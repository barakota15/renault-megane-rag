"""
Verification test for Digital Vector Schematics, View Switching, and Chat-Integrated Interactive Diagrams.
"""

import os
import re
import json

def test_html_structure():
    with open("templates/index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Check views exist
    assert 'id="view-chat"' in html, "Missing #view-chat"
    assert 'id="view-wiring-studio"' in html, "Missing #view-wiring-studio"
    assert 'id="view-manual-reader"' in html, "Missing #view-manual-reader"
    assert 'id="view-torque-specs"' in html, "Missing #view-torque-specs"
    assert 'id="view-dashboard"' in html, "Missing #view-dashboard"

    # Check navigation elements
    assert 'id="tab-diag"' in html, "Missing #tab-diag"
    assert 'id="tab-wiring"' in html, "Missing #tab-wiring"
    assert 'id="tab-manuals"' in html, "Missing #tab-manuals"
    assert 'id="tab-torque"' in html, "Missing #tab-torque"
    assert 'id="tab-dashboard"' in html, "Missing #tab-dashboard"

    # Check rail buttons
    assert 'id="rail-dashboard"' in html, "Missing #rail-dashboard"
    assert 'id="rail-electrical"' in html, "Missing #rail-electrical"
    assert 'id="rail-engine"' in html, "Missing #rail-engine"
    assert 'id="rail-gearbox"' in html, "Missing #rail-gearbox"
    assert 'id="rail-body"' in html, "Missing #rail-body"

    # Check studio elements
    assert 'id="studio-schematic-mount"' in html, "Missing #studio-schematic-mount"
    assert 'data-circuit="starter_circuit"' in html, "Missing starter_circuit pill"
    assert 'data-circuit="sirius32_ecu"' in html, "Missing sirius32_ecu pill"
    assert 'data-circuit="cooling_fan"' in html, "Missing cooling_fan pill"
    assert 'data-circuit="transmission_ad4_dp0"' in html, "Missing transmission_ad4_dp0 pill"
    assert 'data-circuit="alternator_charging"' in html, "Missing alternator_charging pill"

    # Check Pin Inspector modal
    assert 'id="pin-inspector-modal"' in html, "Missing #pin-inspector-modal"
    assert 'id="pin-modal-pin"' in html, "Missing #pin-modal-pin"
    assert 'id="pin-modal-voltage"' in html, "Missing #pin-modal-voltage"
    assert 'id="pin-modal-wire"' in html, "Missing #pin-modal-wire"
    assert 'id="pin-ask-ai-btn"' in html, "Missing #pin-ask-ai-btn"

    # Check script tags
    assert '<script src="/static/schematics.js"></script>' in html, "Missing schematics.js script tag"
    assert '<script src="/static/app.js"></script>' in html, "Missing app.js script tag"

    print("[PASSED] templates/index.html structure verified.")

def test_schematics_engine():
    with open("static/schematics.js", "r", encoding="utf-8") as f:
        js = f.read()

    circuits = [
        "starter_circuit",
        "sirius32_ecu",
        "cooling_fan",
        "transmission_ad4_dp0",
        "alternator_charging"
    ]
    for c in circuits:
        assert c in js, f"Missing circuit: {c}"

    # Check key functions
    assert "generateStarterCircuitSVG" in js, "Missing generateStarterCircuitSVG"
    assert "generateSirius32SVG" in js, "Missing generateSirius32SVG"
    assert "generateCoolingFanSVG" in js, "Missing generateCoolingFanSVG"
    assert "generateTransmissionSVG" in js, "Missing generateTransmissionSVG"
    assert "generateAlternatorSVG" in js, "Missing generateAlternatorSVG"
    assert "renderInteractiveWidget" in js, "Missing renderInteractiveWidget"
    assert "inspectPin" in js, "Missing inspectPin"

    # Check push-button bypass simulation logic
    assert "bypassConnected" in js, "Missing bypassConnected state in starter circuit"
    assert "bypassPressed" in js, "Missing bypassPressed state in starter circuit"

    print("[PASSED] static/schematics.js circuits and simulation verified.")

def test_app_integration():
    with open("static/app.js", "r", encoding="utf-8") as f:
        js = f.read()

    assert "switchView" in js, "Missing switchView"
    assert "openStudioWithCircuit" in js, "Missing openStudioWithCircuit"
    assert "showPinInspectorModal" in js, "Missing showPinInspectorModal"
    assert "detectCircuitForPageOrText" in js, "Missing detectCircuitForPageOrText"
    assert "hydrateRenderedContent" in js, "Missing hydrateRenderedContent"
    assert "chat-schematic-mount" in js, "Missing chat-schematic-mount in createDiagramCard"
    assert "toggle-scan-btn" in js, "Missing toggle-scan-btn in createDiagramCard"

    print("[PASSED] static/app.js multi-view and interactive card integration verified.")

if __name__ == "__main__":
    test_html_structure()
    test_schematics_engine()
    test_app_integration()
    print("\nALL DIGITAL SCHEMATICS AND MULTI-VIEW TESTS PASSED! 🚀")
