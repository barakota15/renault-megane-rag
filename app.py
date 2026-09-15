"""
FastAPI Web Server for Renault Megane (1995-2002) Workshop Service Manual RAG AI
"""

import os
import json
import asyncio
from typing import Optional, List, Dict, Any
from pathlib import Path
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from fastapi import FastAPI, Request, HTTPException, BackgroundTasks
from fastapi.responses import HTMLResponse, StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from rag.indexer import ManualIndexer
from rag.retriever import HybridRetriever
from rag.generator import RAGGenerator, SYSTEM_PROMPT

load_dotenv()

# Paths setup
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
TEMPLATES_DIR = BASE_DIR / "templates"
DATA_DIR = BASE_DIR / "data"

STATIC_DIR.mkdir(exist_ok=True)
TEMPLATES_DIR.mkdir(exist_ok=True)
DATA_DIR.mkdir(exist_ok=True)

# Singletons
indexer = ManualIndexer()
retriever = HybridRetriever(indexer=indexer)

# Global indexing task state
indexing_progress = {
    "is_running": False,
    "percent": 0,
    "message": "Idle",
    "error": None
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown."""
    if indexer.is_indexed():
        try:
            print("[Server] Pre-loading existing index...")
            retriever.load_index()
        except Exception as e:
            print(f"[Server] Failed to load index on startup: {e}")
    yield


app = FastAPI(
    title="Renault Megane Workshop RAG AI",
    description="Automotive RAG AI assistant for Renault Megane I (1995-2002) Factory Workshop Manual",
    version="1.0.0",
    lifespan=lifespan
)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))


class ChatRequest(BaseModel):
    query: str
    messages: Optional[List[Dict[str, Any]]] = None  # Conversation history
    provider: Optional[str] = "gemini"  # "gemini", "groq", "openai", "ollama"
    api_key: Optional[str] = None
    model_name: Optional[str] = None
    section_filter: Optional[str] = None
    top_k: Optional[int] = 5
    alpha: Optional[float] = 0.45
    vehicle_profile: Optional[Dict[str, Any]] = None


class SaveChatRequest(BaseModel):
    id: Optional[str] = None
    title: str
    messages: List[Dict[str, Any]]
    vehicle_profile: Optional[Dict[str, Any]] = None
    created_at: Optional[str] = None


class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5
    section_filter: Optional[str] = None
    alpha: Optional[float] = 0.45
    vehicle_profile: Optional[Dict[str, Any]] = None


class IndexRequest(BaseModel):
    force: Optional[bool] = False


@app.get("/", response_class=HTMLResponse)
async def serve_index(request: Request):
    """Serves the main web UI."""
    return templates.TemplateResponse(request=request, name="index.html")


@app.get("/api/vehicle-profiles")
async def get_vehicle_presets():
    """Returns official Renault Megane 1 factory engine and transmission presets."""
    return [
        {
            "id": "k4m_16v",
            "name": "Mégane 1.6 16V (K4M)",
            "engine": "K4M",
            "capacity": "1.6L (1598cc)",
            "valves": "16V",
            "gearbox": "JB3",
            "gearbox_type": "5-Speed Manual",
            "phase": "Phase 2 (1999-2002)",
            "year": "2001",
            "fuel": "Petrol Multipoint Injection (Siemens Sirius 32)",
            "badge": "1.6 16V K4M • JB3 Manual"
        },
        {
            "id": "k7m_8v",
            "name": "Mégane 1.6 8V (K7M)",
            "engine": "K7M",
            "capacity": "1.6L (1598cc)",
            "valves": "8V",
            "gearbox": "JB1",
            "gearbox_type": "5-Speed Manual",
            "phase": "Phase 1 (1995-1999)",
            "year": "1997",
            "fuel": "Petrol Multipoint Injection",
            "badge": "1.6 8V K7M • JB1/JB3 Manual"
        },
        {
            "id": "e7j_14",
            "name": "Mégane 1.4 8V / 16V (E7J / K4J)",
            "engine": "E7J",
            "capacity": "1.4L (1390cc)",
            "valves": "8V / 16V",
            "gearbox": "JB1",
            "gearbox_type": "5-Speed Manual",
            "phase": "Phase 1 & 2 (1995-2002)",
            "year": "1998",
            "fuel": "Petrol Injection",
            "badge": "1.4L E7J/K4J • JB1 Manual"
        },
        {
            "id": "f3r_20",
            "name": "Mégane 2.0 8V / 16V (F3R / F7R)",
            "engine": "F3R",
            "capacity": "2.0L (1998cc)",
            "valves": "8V",
            "gearbox": "JB3",
            "gearbox_type": "5-Speed Manual",
            "phase": "Phase 1 (1995-1999)",
            "year": "1998",
            "fuel": "Petrol Multipoint Injection (Fenix 5)",
            "badge": "2.0L F3R • JB3 Manual"
        },
        {
            "id": "f9q_diesel",
            "name": "Mégane 1.9 dTi / dCi Diesel (F9Q)",
            "engine": "F9Q",
            "capacity": "1.9L (1870cc)",
            "valves": "8V Turbo Diesel",
            "gearbox": "JC5",
            "gearbox_type": "5-Speed Heavy-Duty Manual",
            "phase": "Phase 1 & 2 (1997-2002)",
            "year": "2000",
            "fuel": "Direct Injection Turbo Diesel (dTi / dCi)",
            "badge": "1.9 dTi/dCi F9Q • JC5 Manual"
        },
        {
            "id": "auto_dp0",
            "name": "Mégane Automatic 1.6 (DP0 / AD4)",
            "engine": "K4M",
            "capacity": "1.6L 16V (1598cc)",
            "valves": "16V",
            "gearbox": "DP0",
            "gearbox_type": "4-Speed Proactive Automatic",
            "phase": "Phase 2 (1999-2002)",
            "year": "2001",
            "fuel": "Petrol Injection",
            "badge": "1.6 16V • DP0 Automatic"
        }
    ]


@app.get("/api/status")
async def get_status():
    """Returns the indexing status and configured providers."""
    is_indexed = indexer.is_indexed()
    stats = indexer.get_stats() if is_indexed else {}

    providers_available = {
        "gemini": bool(os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")),
        "groq": bool(os.getenv("GROQ_API_KEY")),
        "openai": bool(os.getenv("OPENAI_API_KEY")),
        "ollama": True,
    }

    return {
        "is_indexed": is_indexed,
        "indexing_progress": indexing_progress,
        "stats": stats,
        "providers_available": providers_available,
        "default_provider": "gemini" if providers_available["gemini"] else ("groq" if providers_available["groq"] else "ollama")
    }


def _run_background_indexing(force: bool):
    global indexing_progress
    indexing_progress["is_running"] = True
    indexing_progress["percent"] = 5
    indexing_progress["message"] = "Starting PDF processing..."
    indexing_progress["error"] = None

    def progress_callback(pct, msg):
        indexing_progress["percent"] = pct
        indexing_progress["message"] = msg

    try:
        indexer.build_index(force=force, progress_callback=progress_callback)
        retriever.load_index()
        indexing_progress["percent"] = 100
        indexing_progress["message"] = "Indexing completed successfully!"
    except Exception as e:
        indexing_progress["error"] = str(e)
        indexing_progress["message"] = f"Failed: {e}"
    finally:
        indexing_progress["is_running"] = False


@app.post("/api/index")
async def trigger_indexing(req: IndexRequest, background_tasks: BackgroundTasks):
    """Triggers PDF parsing and index construction."""
    global indexing_progress
    if indexing_progress["is_running"]:
        return JSONResponse({"status": "already_running", "progress": indexing_progress})

    background_tasks.add_task(_run_background_indexing, req.force)
    return {"status": "started", "message": "Manual indexing started in background"}


@app.post("/api/search")
async def search_manual(req: SearchRequest):
    """Searches manual and returns relevant chunks tailored to vehicle profile."""
    if not indexer.is_indexed():
        raise HTTPException(status_code=400, detail="Manual is not indexed yet. Please run indexing first.")

    results = retriever.search(
        query=req.query,
        top_k=req.top_k or 5,
        alpha=req.alpha if req.alpha is not None else 0.45,
        section_filter=req.section_filter,
        vehicle_profile=req.vehicle_profile
    )

    return {
        "query": req.query,
        "count": len(results),
        "vehicle_profile": req.vehicle_profile,
        "results": [
            {
                "chunk_id": r.chunk_id,
                "page_num": r.page_num,
                "section": r.section,
                "score": round(r.score, 4),
                "dense_score": round(r.dense_score, 4),
                "bm25_score": round(r.bm25_score, 4),
                "snippet": r.raw_text[:300] + ("..." if len(r.raw_text) > 300 else ""),
                "full_text": r.raw_text,
            }
            for r in results
        ]
    }


@app.post("/api/chat")
async def chat_manual(req: ChatRequest):
    """Generates a complete answer tailored to vehicle profile and conversation history."""
    if not indexer.is_indexed():
        raise HTTPException(status_code=400, detail="Manual is not indexed yet. Please run indexing first.")

    retrieved = retriever.search(
        query=req.query,
        top_k=req.top_k or 5,
        alpha=req.alpha if req.alpha is not None else 0.45,
        section_filter=req.section_filter,
        vehicle_profile=req.vehicle_profile,
        messages=req.messages
    )

    generator = RAGGenerator(
        provider=req.provider or "gemini",
        api_key=req.api_key,
        model_name=req.model_name
    )

    try:
        answer = generator.generate(
            req.query,
            retrieved,
            vehicle_profile=req.vehicle_profile,
            messages=req.messages
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    citations = [
        {
            "chunk_id": r.chunk_id,
            "page_num": r.page_num,
            "section": r.section,
            "score": round(r.score, 4),
            "text": r.raw_text,
        }
        for r in retrieved
    ]

    return {
        "query": req.query,
        "answer": answer,
        "citations": citations,
        "provider": req.provider,
        "model": generator.model_name,
        "vehicle_profile": req.vehicle_profile
    }


@app.post("/api/chat/stream")
async def chat_stream_manual(req: ChatRequest):
    """Streams the generated answer using Server-Sent Events (SSE) with conversation history."""
    if not indexer.is_indexed():
        raise HTTPException(status_code=400, detail="Manual is not indexed yet. Please run indexing first.")

    retrieved = retriever.search(
        query=req.query,
        top_k=req.top_k or 5,
        alpha=req.alpha if req.alpha is not None else 0.45,
        section_filter=req.section_filter,
        vehicle_profile=req.vehicle_profile,
        messages=req.messages
    )

    generator = RAGGenerator(
        provider=req.provider or "gemini",
        api_key=req.api_key,
        model_name=req.model_name
    )

    citations = [
        {
            "chunk_id": r.chunk_id,
            "page_num": r.page_num,
            "section": r.section,
            "score": round(r.score, 4),
            "snippet": r.raw_text[:250] + "...",
            "text": r.raw_text,
        }
        for r in retrieved
    ]

    async def event_generator():
        # First send citations event with model and vehicle profile
        yield f"event: citations\ndata: {json.dumps({'citations': citations, 'model': generator.model_name, 'vehicle_profile': req.vehicle_profile})}\n\n"

        # Stream LLM tokens
        try:
            for token in generator.generate_stream(
                req.query,
                retrieved,
                vehicle_profile=req.vehicle_profile,
                messages=req.messages
            ):
                data = json.dumps({"token": token})
                yield f"event: token\ndata: {data}\n\n"
                await asyncio.sleep(0.01)
        except Exception as e:
            err_data = json.dumps({"error": str(e)})
            yield f"event: error\ndata: {err_data}\n\n"

        yield "event: done\ndata: {}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


# =========================================================
# Saved Chats Endpoints
# =========================================================

SAVED_CHATS_DIR = DATA_DIR / "saved_chats"
SAVED_CHATS_DIR.mkdir(parents=True, exist_ok=True)


@app.get("/api/saved-chats")
async def list_saved_chats():
    """Returns list of saved chat sessions."""
    chats = []
    for p in SAVED_CHATS_DIR.glob("*.json"):
        try:
            with open(p, "r", encoding="utf-8") as f:
                data = json.load(f)
                chats.append({
                    "id": data.get("id", p.stem),
                    "title": data.get("title", "Saved Chat"),
                    "created_at": data.get("created_at", ""),
                    "message_count": len(data.get("messages", [])),
                    "vehicle_badge": data.get("vehicle_profile", {}).get("badge", ""),
                })
        except Exception:
            continue
    # Sort descending by date/time
    chats.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return chats


@app.post("/api/saved-chats")
async def save_chat_session(req: SaveChatRequest):
    """Saves or updates a chat session to disk."""
    import time
    chat_id = req.id or f"chat_{int(time.time() * 1000)}"
    file_path = SAVED_CHATS_DIR / f"{chat_id}.json"

    payload = {
        "id": chat_id,
        "title": req.title.strip() or "Saved Chat",
        "messages": req.messages,
        "vehicle_profile": req.vehicle_profile,
        "created_at": req.created_at or time.strftime("%Y-%m-%d %H:%M:%S")
    }
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    return {"status": "saved", "id": chat_id, "title": payload["title"], "created_at": payload["created_at"]}


@app.get("/api/saved-chats/{chat_id}")
async def get_saved_chat(chat_id: str):
    """Retrieves a single saved chat session."""
    file_path = SAVED_CHATS_DIR / f"{chat_id}.json"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Saved chat not found")
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


@app.delete("/api/saved-chats/{chat_id}")
async def delete_saved_chat(chat_id: str):
    """Deletes a saved chat session."""
    file_path = SAVED_CHATS_DIR / f"{chat_id}.json"
    if file_path.exists():
        file_path.unlink()
    return {"status": "deleted", "id": chat_id}


PAGE_CACHE_DIR = DATA_DIR / "page_cache"
PAGE_CACHE_DIR.mkdir(exist_ok=True)
PDF_FILE_PATH = "renault-megane-1995-2002-factory-workshop-service-manual.pdf"
SECTION_MAP_FILE = DATA_DIR / "index" / "section_to_page.json"
_section_map_cache = {}


def resolve_page_number(page_id: str) -> int:
    """Resolves an absolute page number (e.g. '92') or section code (e.g. '10-48', '01-1', '21-3') to an integer page."""
    global _section_map_cache
    page_id_str = str(page_id).strip()

    if page_id_str.isdigit():
        return int(page_id_str)

    # Load section map
    if not _section_map_cache and SECTION_MAP_FILE.exists():
        try:
            with open(SECTION_MAP_FILE, "r", encoding="utf-8") as f:
                _section_map_cache = json.load(f)
        except Exception:
            _section_map_cache = {}

    if page_id_str in _section_map_cache:
        return _section_map_cache[page_id_str]

    # Try clean variations (e.g. 'page-92', 'p92', '10_48')
    normalized = page_id_str.replace("page", "").replace("p.", "").replace("p", "").replace("_", "-").strip()
    if normalized.isdigit():
        return int(normalized)
    if normalized in _section_map_cache:
        return _section_map_cache[normalized]

    # Search chunks for section text match
    for chunk in retriever.chunks:
        if normalized.lower() in chunk.get("raw_text", "").lower() or normalized.lower() in chunk.get("section", "").lower():
            return chunk.get("page_num", 1)

    return 1


@app.get("/api/pdf/render/{page_identifier}")
async def render_pdf_page(page_identifier: str, dpi: int = 150):
    """Renders a specific PDF page or section code (e.g. '92' or '10-48') to a PNG image with caching."""
    page_num = resolve_page_number(page_identifier)
    if page_num < 1:
        page_num = 1

    cache_file = PAGE_CACHE_DIR / f"page_{page_num}_dpi{dpi}.png"
    if cache_file.exists():
        from fastapi.responses import FileResponse
        return FileResponse(str(cache_file), media_type="image/png")

    try:
        import pymupdf as fitz
    except ImportError:
        import fitz

    if not os.path.exists(PDF_FILE_PATH):
        raise HTTPException(status_code=404, detail="PDF manual file not found")

    try:
        doc = fitz.open(PDF_FILE_PATH)
        if page_num > len(doc):
            page_num = len(doc)

        page = doc[page_num - 1]
        pix = page.get_pixmap(dpi=dpi)
        img_bytes = pix.tobytes("png")
        doc.close()

        # Save to cache
        with open(cache_file, "wb") as f:
            f.write(img_bytes)

        from fastapi import Response
        return Response(content=img_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to render page: {str(e)}")


@app.get("/api/pdf/page-info/{page_identifier}")
async def get_page_info(page_identifier: str):
    """Returns metadata and text for a specific page or section code."""
    if not indexer.is_indexed():
        raise HTTPException(status_code=400, detail="Manual not indexed")

    page_num = resolve_page_number(page_identifier)

    # Find matching chunks for this page
    matching_chunks = [c for c in retriever.chunks if c.get("page_num") == page_num]
    section = matching_chunks[0]["section"] if matching_chunks else "General"
    combined_text = "\n\n".join(c["raw_text"] for c in matching_chunks) if matching_chunks else ""

    stats = indexer.get_stats()
    total_pages = stats.get("total_pages", 2492)

    return {
        "page_num": page_num,
        "section": section,
        "total_pages": total_pages,
        "image_url": f"/api/pdf/render/{page_num}",
        "text": combined_text,
        "has_prev": page_num > 1,
        "has_next": page_num < total_pages
    }


@app.get("/api/quick-topics")
async def get_quick_topics():
    """Curated technical queries for Renault Megane 1995-2002."""
    return [
        {
            "category": "Engine & Timing",
            "title": "Timing Belt Replacement (K4M 1.6 16V)",
            "query": "What is the procedure, tensioning method, and special tools (Mot. 1489 / Mot. 1496) for replacing the timing belt on a 1.6 16V K4M engine?"
        },
        {
            "category": "Engine Specs",
            "title": "Cylinder Head Tightening Torque & Sequence",
            "query": "What are the exact cylinder head bolt torque specifications, tightening angles, and bolt sequence for Renault Megane petrol engines?"
        },
        {
            "category": "Transmission",
            "title": "JB3 / JC5 Gearbox Oil Capacity & Viscosity",
            "query": "What is the gearbox oil capacity, oil grade/viscosity (75W80 TRX), and level check procedure for the JB3 / JC5 manual transmission?"
        },
        {
            "category": "Electrical",
            "title": "Starter & Ignition Bypass (مارش خارجي)",
            "query": "ازاي اعمل مارش خارجي بزرار تشغيل مع كتاوت بناءً على توصيلات مارش وسولينويد الميجان ومفتاح الكونتاك؟"
        },
        {
            "category": "Electrical",
            "title": "Fuse Box Layout & Relays",
            "query": "Where is the passenger compartment and engine bay fuse box located on the Renault Megane 1, and what are the fuse ratings?"
        },
        {
            "category": "Brakes & Chassis",
            "title": "Brake Bleeding Procedure & Fluid",
            "query": "What is the correct brake bleeding order and brake fluid specification (DOT 4 / SAE J 1703) for the Megane with/without ABS?"
        }
    ]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
