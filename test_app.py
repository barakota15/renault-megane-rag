"""
Unit and Integration Tests for Renault Megane RAG API
"""

import os
from fastapi.testclient import TestClient
from app import app, indexer, retriever

client = TestClient(app)


def test_status_endpoint():
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert "is_indexed" in data
    assert data["is_indexed"] is True
    assert data["stats"]["total_pages"] == 2492
    assert data["stats"]["total_chunks"] >= 2000
    print("[TEST PASSED] /api/status verified.")


def test_quick_topics_endpoint():
    response = client.get("/api/quick-topics")
    assert response.status_code == 200
    topics = response.json()
    assert len(topics) >= 5
    assert any("Timing Belt" in t["title"] for t in topics)
    print("[TEST PASSED] /api/quick-topics verified.")


def test_search_endpoint():
    payload = {
        "query": "JB3 gearbox oil capacity 75W80",
        "top_k": 3,
        "alpha": 0.45
    }
    response = client.post("/api/search", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["count"] > 0
    top_result = data["results"][0]
    assert top_result["page_num"] == 328
    assert "3.4" in top_result["full_text"] or "JB3" in top_result["full_text"]
    print(f"[TEST PASSED] /api/search verified: Top match on Page {top_result['page_num']}.")


def test_pdf_render_endpoint():
    # Test rendering page 99 (timing belt)
    response = client.get("/api/pdf/render/99")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert len(response.content) > 10000
    print("[TEST PASSED] GET /api/pdf/render/99 returned valid PNG image.")


def test_pdf_page_info_endpoint():
    response = client.get("/api/pdf/page-info/328")
    assert response.status_code == 200
    data = response.json()
    assert data["page_num"] == 328
    assert "Manual Gearbox" in data["section"]
    assert "image_url" in data
    print("[TEST PASSED] GET /api/pdf/page-info/328 verified.")


def test_index_html_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "Renault Mégane I" in response.text
    print("[TEST PASSED] GET / HTML dashboard served.")


def test_vehicle_presets_endpoint():
    response = client.get("/api/vehicle-profiles")
    assert response.status_code == 200
    presets = response.json()
    assert len(presets) >= 4
    assert any(p["engine"] == "K4M" for p in presets)
    print(f"[TEST PASSED] /api/vehicle-profiles verified ({len(presets)} presets available).")


def test_search_with_vehicle_profile():
    k4m_profile = {"engine": "K4M", "capacity": "1.6L (1598cc)", "gearbox": "JB3"}
    payload = {
        "query": "timing belt replacement Mot 1489",
        "top_k": 3,
        "vehicle_profile": k4m_profile
    }
    response = client.post("/api/search", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["count"] > 0
    print(f"[TEST PASSED] /api/search with vehicle profile verified.")


def test_section_code_rendering():
    # Test rendering section code '10-48' (which maps to absolute page 92)
    response = client.get("/api/pdf/render/10-48")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert len(response.content) > 5000
    print("[TEST PASSED] GET /api/pdf/render/10-48 (Section Code) successfully rendered page 92 image.")

    # Test page-info with section code
    response_info = client.get("/api/pdf/page-info/10-48")
    assert response_info.status_code == 200
    data = response_info.json()
    assert data["page_num"] == 92
    print("[TEST PASSED] GET /api/pdf/page-info/10-48 resolved to absolute page 92.")


def test_arabic_query_translation():
    from rag.query_translator import SmartQueryTranslator
    translator = SmartQueryTranslator()
    
    # Test Arabic expansion for starter/ignition bypass
    expanded = translator.translate_and_expand("ازاي اعمل مارش خارجي للسيارة مع مفتاح الكونتاك؟")
    assert "starter" in expanded.lower() or "163" in expanded or "solenoid" in expanded
    print(f"[TEST PASSED] Smart Arabic Query Translation verified: '{expanded[:80]}...'")


def test_saved_chats_endpoints():
    # 1. Save chat session
    chat_payload = {
        "id": "test_session_123",
        "title": "Starter Motor Troubleshooting",
        "messages": [
            {"role": "user", "content": "ازاي اعمل مارش خارجي؟"},
            {"role": "assistant", "content": "يتم توصيل الطرف 50 مع كتاوت خارجي ومفتاح تشغيل..."}
        ],
        "vehicle_profile": {"engine": "K4M", "gearbox": "JB3", "badge": "1.6 16V K4M • JB3 Manual"},
        "created_at": "2026-09-15 10:00:00"
    }
    save_resp = client.post("/api/saved-chats", json=chat_payload)
    assert save_resp.status_code == 200
    assert save_resp.json()["status"] == "saved"

    # 2. List saved chats
    list_resp = client.get("/api/saved-chats")
    assert list_resp.status_code == 200
    chats = list_resp.json()
    assert any(c["id"] == "test_session_123" for c in chats)

    # 3. Retrieve specific saved chat
    get_resp = client.get("/api/saved-chats/test_session_123")
    assert get_resp.status_code == 200
    retrieved_chat = get_resp.json()
    assert len(retrieved_chat["messages"]) == 2
    assert retrieved_chat["title"] == "Starter Motor Troubleshooting"

    # 4. Delete saved chat
    del_resp = client.delete("/api/saved-chats/test_session_123")
    assert del_resp.status_code == 200
    assert del_resp.json()["status"] == "deleted"
    print("[TEST PASSED] /api/saved-chats CRUD operations verified successfully.")


def test_multi_turn_history_in_search():
    # Test that retriever search accepts conversation messages and resolves follow-up context
    history = [
        {"role": "user", "content": "عايز اعرف مكان حساس الكرنك TDC sensor"},
        {"role": "assistant", "content": "يقع حساس الكرنك فوق الحذافة Flywheel..."}
    ]
    payload = {
        "query": "طب ورقم البن بتاعه كام؟",
        "top_k": 3,
        "messages": history
    }
    # Test search endpoint
    resp = client.post("/api/search", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["count"] > 0
    print("[TEST PASSED] Multi-turn context in search verified successfully.")


def test_multiview_html_structure():
    with open("templates/index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Views
    for view_id in ["view-chat", "view-wiring-studio", "view-manual-reader", "view-torque-specs", "view-dashboard"]:
        assert f'id="{view_id}"' in html, f"Missing #{view_id}"

    # Navigation tabs & rail
    for nav_id in ["tab-diag", "tab-wiring", "tab-manuals", "tab-torque", "tab-dashboard", "rail-dashboard", "rail-electrical", "rail-engine", "rail-gearbox", "rail-body"]:
        assert f'id="{nav_id}"' in html, f"Missing #{nav_id}"

    # Studio & Pin Inspector
    assert 'id="studio-schematic-mount"' in html, "Missing #studio-schematic-mount"
    assert 'id="pin-inspector-modal"' in html, "Missing #pin-inspector-modal"
    assert '<script src="/static/schematics.js"></script>' in html, "Missing schematics.js"
    print("[TEST PASSED] Multi-view workstation HTML structure verified.")


def test_digital_schematics_engine():
    with open("static/schematics.js", "r", encoding="utf-8") as f:
        js = f.read()

    # Verify all 5 circuits modeled
    circuits = ["starter_circuit", "sirius32_ecu", "cooling_fan", "transmission_ad4_dp0", "alternator_charging"]
    for c in circuits:
        assert c in js, f"Missing circuit: {c}"

    # Key functions & state
    assert "generateStarterCircuitSVG" in js
    assert "generateSirius32SVG" in js
    assert "generateCoolingFanSVG" in js
    assert "generateTransmissionSVG" in js
    assert "generateAlternatorSVG" in js
    assert "bypassConnected" in js
    assert "bypassPressed" in js
    print("[TEST PASSED] Antigravity digital schematics engine (5 circuits & simulations) verified.")


if __name__ == "__main__":
    test_status_endpoint()
    test_quick_topics_endpoint()
    test_vehicle_presets_endpoint()
    test_search_endpoint()
    test_search_with_vehicle_profile()
    test_pdf_render_endpoint()
    test_pdf_page_info_endpoint()
    test_section_code_rendering()
    test_arabic_query_translation()
    test_saved_chats_endpoints()
    test_multi_turn_history_in_search()
    test_index_html_endpoint()
    test_multiview_html_structure()
    test_digital_schematics_engine()
    print("\n==================================================")
    print("ALL AUTOMATED TESTS PASSED! 🚀")
    print("==================================================")
