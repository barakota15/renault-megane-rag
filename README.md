# Renault Mégane I (1995–2002) Factory Workshop Manual — RAG AI Assistant 🚗🔧

A high-precision Retrieval-Augmented Generation (RAG) AI assistant built specifically for the **Renault Mégane I (1995–2002) OEM Factory Workshop Service Manual** (`renault-megane-1995-2002-factory-workshop-service-manual.pdf`).

---

## Key Features

- **Vehicle Profile Customization**: Configure your exact Renault Mégane model (e.g., `1.6L 16V K4M`, `1.6L 8V K7M`, `1.4L E7J/K4J`, `2.0L F3R/F7R`, `1.9L Diesel F8Q/F9Q`, `JB1/JB3/JC5 Manual`, `DP0/AD4 Automatic`). All search results, capacities, wiring diagrams, and torque values automatically adapt to your engine and gearbox!
- **Full Manual Ingestion**: Indexed all **2,492 pages** (2,626 semantic chunks) covering engine mechanics, timing belts, cylinder head torques, JB3/JC5 manual gearboxes, AD4/DP0 automatic transmissions, injection troubleshooting charts, wiring, fuses, and bodywork.
- **Visual Diagram & Page Image Rendering**: High-resolution 150 DPI page rendering (`/api/pdf/render/{page_num}`) with an interactive PDF page viewer modal (zoom, page navigation, direct jump).
- **Hybrid Retrieval**: Dense vector embeddings (`all-MiniLM-L6-v2`) combined with **BM25 keyword search** and engine-specific relevance boosting.
- **BiDi RTL / LTR Typography**: Perfect reading order for mixed Arabic and English technical terms (`Terminal 50`, `Mot. 1489`, `+12V`, `20 daN.m`).

---

## Quick Start

### 1. Launch the Web Interface

```bash
python3 app.py
```

Then open your browser at:
👉 **`http://localhost:8000`**

### 2. Run via Terminal CLI

```bash
# Ask a question
python3 cli.py "What is the timing belt replacement procedure for a K4M 16V engine?"

# Search manual chunks only (no LLM required)
python3 cli.py "JB3 gearbox oil capacity" --search-only

# Interactive terminal session
python3 cli.py -i
```

---

## Configuration & API Keys

You can enter your API keys either in the **Web UI Settings dialog** (top right ⚙️) or create a `.env` file:

```env
# Choose: "gemini", "groq", "openai", or "ollama"
DEFAULT_PROVIDER=gemini

# Google Gemini API Key
GEMINI_API_KEY=AIzaSy...

# Groq API Key (Optional)
GROQ_API_KEY=gsk_...

# OpenAI API Key (Optional)
OPENAI_API_KEY=sk-...
```

---

## Project Structure

```
├── renault-megane-1995-2002-factory-workshop-service-manual.pdf
├── app.py                      # FastAPI web server and streaming endpoints
├── cli.py                      # Interactive terminal tool
├── requirements.txt            # Python dependencies
├── .env.example                # Example environment variables
├── rag/
│   ├── __init__.py
│   ├── pdf_parser.py           # PyMuPDF extractor with chapter detection
│   ├── chunker.py              # Semantic chunker with page metadata
│   ├── indexer.py              # Dense vector + BM25 indexer
│   ├── retriever.py            # Hybrid search engine (Vector + BM25)
│   └── generator.py            # Multi-provider LLM generation & streaming
├── templates/
│   └── index.html              # Responsive web dashboard
├── static/
│   ├── app.js                  # Frontend client logic & streaming handler
│   └── style.css               # Styling & typography
└── data/
    └── index/                  # Cached vectors, BM25 index, & metadata
```
