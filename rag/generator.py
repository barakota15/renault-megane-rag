"""
LLM Generation Engine for Renault Megane Workshop Manual
Supports Multimodal Visual Diagram Understanding (Gemini / OpenAI) with streaming.
"""

import os
import json
import base64
from typing import List, Dict, Any, Generator, Optional
from rag.retriever import RetrievedChunk

SYSTEM_PROMPT = """You are the Renault Mégane I (1995–2002) Master Automotive Workshop Specialist & Engineer.
You have access to the complete official Renault factory workshop manual (2,492 pages) covering engine overhaul, timing, fuel injection, manual & automatic transmissions, electrical systems, brakes, steering, suspension, and bodywork.

YOUR CORE GUIDING PRINCIPLES:
1. PRIMARY RELIANCE ON THE OFFICIAL WORKSHOP MANUAL (صفحات كتاب الصيانة الرسمي):
   - Your primary reference and source of truth is the official Renault factory workshop manual.
   - Ground your answers directly in the official factory procedures, technical tables, tightening torques, fluid specifications, sensor tolerances, and fault diagnostic sequences found in the manual excerpts.
   - Always cite the exact manual page numbers [صفحة X] or [Page X].

2. DO NOT UNNECESSARILY INTRODUCE ELECTRICAL WIRING (قاعدة عدم إقحام الوايرات دون داعٍ):
   - CRITICAL: Do NOT talk about electrical wiring, wire colors, pinouts, or rewiring bypasses unless the user specifically and explicitly asks for electrical wiring, a wiring schematic, pinouts, fuses, relays, or electrical circuit troubleshooting!
   - For mechanical maintenance, fluid types and capacities, torque specifications, timing belt replacement, transmission operation/fluid change, engine overhaul, suspension, brakes, or general symptoms (e.g. noise, vibration, overheating, car won't start):
     Focus purely on the factory manual's mechanical procedures, inspection steps, torque values, and diagnostic checks from the book. DO NOT turn mechanical or maintenance questions into an electrical wiring harness guide.
   - Only provide wiring connections, relay pins, and terminal numbers when the user's inquiry is genuinely and specifically about electrical wiring or electrical fault testing.

3. EMBED MANUAL BOOK PAGES DIRECTLY AS STANDALONE MARKDOWN:
   - When a manual excerpt contains a technical drawing, assembly illustration, timing mark diagram, or schematic on page X, embed the book page directly on its own line:
     ![وصف توضيحي من كتاب الصيانة - صفحة X](/api/pdf/render/X)
   - CRITICAL: NEVER wrap the image syntax in backticks or code blocks. Write it as normal markdown image syntax.
   - CRITICAL RULE: ALWAYS use the integer ABSOLUTE MANUAL PAGE number X (e.g., /api/pdf/render/92 or /api/pdf/render/328). NEVER write section-page codes like 10-48 in the URL.

4. LANGUAGE MATCHING & ARABIC/ENGLISH BIDI RULES:
   - ALWAYS MATCH THE USER'S LANGUAGE:
     - If the user asks in English, respond entirely in professional, technical English (including English diagram captions, e.g. ![Cylinder Head Tightening Procedure - Page 92](/api/pdf/render/92)).
     - If the user asks in Arabic, respond in fluent Arabic (with Arabic diagram captions, e.g. ![مخطط توضيحي من دليل الصيانة - صفحة 92](/api/pdf/render/92)).
   - When responding in Arabic, ALWAYS wrap English technical terms, part codes, tool numbers, and units in backticks (e.g., `Mot. 1489`, `75W80`, `20 N.m`, `K4M 1.6 16V`, `Terminal 50`, `Pin 18`) so they remain isolated in LTR order and do not scramble in RTL text.

5. PRACTICAL STEP-BY-STEP WORKSHOP LAYOUT:
   - Clear technical explanation based directly on the factory manual.
   - Embedded manual book page illustration: ![...](/api/pdf/render/X) (on its own line, no backticks).
   - Step-by-step procedures with official factory torque specs and safety warnings.
   - Official manual page citations: [صفحة X] or [Page X].
"""


class RAGGenerator:
    def __init__(
        self,
        provider: str = "gemini",
        api_key: Optional[str] = None,
        model_name: Optional[str] = None,
    ):
        self.provider = (provider or "gemini").lower()
        self.api_key = api_key or self._get_default_api_key(self.provider)
        self.model_name = model_name or self._get_default_model(self.provider)

    def _get_default_api_key(self, provider: str) -> Optional[str]:
        if provider == "gemini":
            return os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        elif provider == "groq":
            return os.getenv("GROQ_API_KEY")
        elif provider == "openai":
            return os.getenv("OPENAI_API_KEY")
        return None

    def _get_default_model(self, provider: str) -> str:
        defaults = {
            "gemini": "gemini-2.5-flash",
            "groq": "llama-3.3-70b-versatile",
            "openai": "gpt-4o-mini",
            "ollama": "llama3.2",
        }
        return defaults.get(provider, "gemini-2.5-flash")

    def _validate_credentials(self):
        """Ensures valid API key is present for cloud providers."""
        if self.provider == "gemini" and not self.api_key:
            raise ValueError(
                "Gemini API key is required. Please enter your API Key in Settings (⚙️ top right) "
                "or set GEMINI_API_KEY in your .env file."
            )
        elif self.provider == "groq" and not self.api_key:
            raise ValueError(
                "Groq API key is required. Please enter your API Key in Settings (⚙️) or set GROQ_API_KEY in .env."
            )
        elif self.provider == "openai" and not self.api_key:
            raise ValueError(
                "OpenAI API key is required. Please enter your API Key in Settings (⚙️) or set OPENAI_API_KEY in .env."
            )

    def _get_page_image_bytes(self, context_chunks: List[RetrievedChunk], max_images: int = 2) -> List[Dict[str, Any]]:
        """Extracts JPEG image bytes for the top retrieved pages for Multimodal visual reasoning."""
        images = []
        seen_pages = set()
        pdf_path = "renault-megane-1995-2002-factory-workshop-service-manual.pdf"
        if not os.path.exists(pdf_path):
            return images

        try:
            import pymupdf as fitz
            doc = fitz.open(pdf_path)
            for chunk in context_chunks:
                p_num = chunk.page_num
                if p_num in seen_pages:
                    continue
                seen_pages.add(p_num)
                if 1 <= p_num <= len(doc):
                    page = doc[p_num - 1]
                    pix = page.get_pixmap(dpi=120)
                    img_bytes = pix.tobytes("jpeg")
                    images.append({
                        "page_num": p_num,
                        "section": chunk.section,
                        "bytes": img_bytes,
                        "mime_type": "image/jpeg"
                    })
                if len(images) >= max_images:
                    break
            doc.close()
        except Exception as e:
            print(f"[Generator] Multimodal image extraction error: {e}")
        return images

    def build_prompt(
        self,
        query: str,
        context_chunks: List[RetrievedChunk],
        vehicle_profile: Optional[Dict[str, Any]] = None,
        messages: Optional[List[Dict[str, Any]]] = None
    ) -> str:
        """Constructs grounded context prompt tailored to user's vehicle profile and conversation history."""
        profile_str = ""
        if vehicle_profile:
            engine = vehicle_profile.get("engine", "")
            capacity = vehicle_profile.get("capacity", "")
            gearbox = vehicle_profile.get("gearbox", "")
            phase = vehicle_profile.get("phase", "")
            year = vehicle_profile.get("year", "")
            fuel = vehicle_profile.get("fuel", "")

            profile_lines = []
            if engine and engine.lower() != "any":
                profile_lines.append(f"- Engine Code / Family: {engine}")
            if capacity:
                profile_lines.append(f"- Displacement / Capacity: {capacity}")
            if gearbox and gearbox.lower() != "any":
                profile_lines.append(f"- Transmission / Gearbox: {gearbox}")
            if phase:
                profile_lines.append(f"- Phase / Model Generation: {phase}")
            if year:
                profile_lines.append(f"- Model Year: {year}")
            if fuel:
                profile_lines.append(f"- Fuel Type / Injection: {fuel}")

            if profile_lines:
                profile_str = f"""
CONFIGURED USER VEHICLE SPECIFICATIONS:
{chr(10).join(profile_lines)}

CRITICAL PERSONALIZATION INSTRUCTION:
The user is working on the exact Renault Megane model specified above. You MUST tailor all fluid capacities, torque specs, timing belt procedures, sensor locations, wiring pins, and tightening angles SPECIFICALLY to this engine ({engine}) and transmission ({gearbox}). Disregard or clearly distinguish specs that belong to different engine families (such as E7J, K7M, F3R, or F8Q diesel).
=====================================================
"""

        # Format past conversation history (last 6 turns)
        history_str = ""
        if messages:
            history_turns = []
            recent_msgs = messages[-6:]
            for msg in recent_msgs:
                content = msg.get("content", "").strip()
                # Skip if this is the identical query at the end
                if msg == recent_msgs[-1] and content == query:
                    continue
                role_label = "User" if msg.get("role") == "user" else "Renault Specialist"
                # Keep past assistant turns reasonably concise
                if len(content) > 900 and msg.get("role") != "user":
                    content = content[:900] + "... [truncated previous response]"
                history_turns.append(f"[{role_label}]:\n{content}")

            if history_turns:
                history_str = f"""
PREVIOUS CONVERSATION TURNS (USE FOR CONTEXT & FOLLOW-UP CONTINUITY):
{chr(10).join(history_turns)}
=====================================================
"""

        context_str = ""
        for i, chunk in enumerate(context_chunks, 1):
            context_str += f"\n--- EXCERPT {i} [ABSOLUTE MANUAL PAGE: {chunk.page_num} | Section: {chunk.section}] ---\n"
            context_str += chunk.raw_text.strip() + "\n"

        prompt = f"""{profile_str}{history_str}CONTEXT FROM RENAULT MEGANE WORKSHOP MANUAL:
{context_str}
=====================================================
CURRENT USER QUESTION:
{query}

CRITICAL RULES FOR RESPONSE:
1. Rely primarily on the Renault Workshop Manual excerpts above. Base your answers directly on the official factory manual procedures, specifications, and book pages.
2. DO NOT introduce electrical wiring, wire connections, or pinouts unless the user explicitly asks about electrical wiring, fuses, relays, or electrical testing. For mechanical, fluid, torque, timing, or general diagnostic questions, focus directly on the manual's procedures, mechanical steps, and specifications.
3. Cite the manual pages [صفحة X] / [Page X] and embed relevant manual book page illustrations directly using:
   ![Diagram Description - Page {context_chunks[0].page_num if context_chunks else 1}](/api/pdf/render/{context_chunks[0].page_num if context_chunks else 1})
   ALWAYS use the exact integer ABSOLUTE MANUAL PAGE number from the excerpts above.
4. MATCH USER LANGUAGE: If the user asks in English, reply in English. If the user asks in Arabic, reply in fluent Arabic.
5. In Arabic text, wrap ALL English technical terms, part numbers, and units in backticks (e.g. `K4M`, `75W80`, `20 N.m`).
"""
        return prompt

    def generate(
        self,
        query: str,
        context_chunks: List[RetrievedChunk],
        system_instruction: str = SYSTEM_PROMPT,
        vehicle_profile: Optional[Dict[str, Any]] = None,
        messages: Optional[List[Dict[str, Any]]] = None
    ) -> str:
        """Synchronous generation."""
        self._validate_credentials()
        prompt = self.build_prompt(query, context_chunks, vehicle_profile, messages)
        page_images = self._get_page_image_bytes(context_chunks)

        if self.provider == "gemini":
            return self._generate_gemini(prompt, system_instruction, page_images)
        elif self.provider == "groq":
            return self._generate_groq(prompt, system_instruction)
        elif self.provider == "openai":
            return self._generate_openai(prompt, system_instruction, page_images)
        elif self.provider == "ollama":
            return self._generate_ollama(prompt, system_instruction)
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")

    def generate_stream(
        self,
        query: str,
        context_chunks: List[RetrievedChunk],
        system_instruction: str = SYSTEM_PROMPT,
        vehicle_profile: Optional[Dict[str, Any]] = None,
        messages: Optional[List[Dict[str, Any]]] = None
    ) -> Generator[str, None, None]:
        """Streaming response generator."""
        self._validate_credentials()
        prompt = self.build_prompt(query, context_chunks, vehicle_profile, messages)
        page_images = self._get_page_image_bytes(context_chunks)

        if self.provider == "gemini":
            yield from self._stream_gemini(prompt, system_instruction, page_images)
        elif self.provider == "groq":
            yield from self._stream_groq(prompt, system_instruction)
        elif self.provider == "openai":
            yield from self._stream_openai(prompt, system_instruction, page_images)
        elif self.provider == "ollama":
            yield from self._stream_ollama(prompt, system_instruction)
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")

    # Gemini Multimodal Implementation
    def _generate_gemini(self, prompt: str, system: str, page_images: List[Dict[str, Any]]) -> str:
        try:
            from google import genai
            from google.genai import types
            client = genai.Client(api_key=self.api_key)
            contents = []
            for img in page_images:
                contents.append(f"Visual Factory Diagram from Manual Page {img['page_num']} ({img['section']}):")
                contents.append(types.Part.from_bytes(data=img["bytes"], mime_type="image/jpeg"))
            contents.append(prompt)

            model_id = self.model_name
            if model_id.startswith("models/"):
                model_id = model_id.replace("models/", "")

            resp = client.models.generate_content(
                model=model_id if "gemini" in model_id else "gemini-2.5-flash",
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=system,
                    temperature=0.2
                )
            )
            return resp.text
        except Exception as e:
            # Fallback to legacy SDK
            import google.generativeai as genai_legacy
            genai_legacy.configure(api_key=self.api_key)
            model = genai_legacy.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=system
            )
            resp = model.generate_content(prompt)
            return resp.text

    def _stream_gemini(self, prompt: str, system: str, page_images: List[Dict[str, Any]]) -> Generator[str, None, None]:
        try:
            from google import genai
            from google.genai import types
            client = genai.Client(api_key=self.api_key)
            contents = []
            for img in page_images:
                contents.append(f"Visual Factory Diagram from Manual Page {img['page_num']} ({img['section']}):")
                contents.append(types.Part.from_bytes(data=img["bytes"], mime_type="image/jpeg"))
            contents.append(prompt)

            model_id = self.model_name
            if model_id.startswith("models/"):
                model_id = model_id.replace("models/", "")

            response = client.models.generate_content_stream(
                model=model_id if "gemini" in model_id else "gemini-2.5-flash",
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=system,
                    temperature=0.2
                )
            )
            for chunk in response:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            # Fallback to legacy SDK streaming
            import google.generativeai as genai_legacy
            genai_legacy.configure(api_key=self.api_key)
            model = genai_legacy.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=system
            )
            response = model.generate_content(prompt, stream=True)
            for chunk in response:
                if chunk.text:
                    yield chunk.text

    # Groq Implementation
    def _generate_groq(self, prompt: str, system: str) -> str:
        from groq import Groq
        client = Groq(api_key=self.api_key)
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt}
            ],
            model=self.model_name if "llama" in self.model_name else "llama-3.3-70b-versatile",
            temperature=0.2,
            max_tokens=2500,
        )
        return response.choices[0].message.content

    def _stream_groq(self, prompt: str, system: str) -> Generator[str, None, None]:
        from groq import Groq
        client = Groq(api_key=self.api_key)
        stream = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt}
            ],
            model=self.model_name if "llama" in self.model_name else "llama-3.3-70b-versatile",
            temperature=0.2,
            max_tokens=2500,
            stream=True,
        )
        for chunk in stream:
            token = chunk.choices[0].delta.content or ""
            if token:
                yield token

    # OpenAI Multimodal Implementation
    def _generate_openai(self, prompt: str, system: str, page_images: List[Dict[str, Any]] = None) -> str:
        from openai import OpenAI
        client = OpenAI(api_key=self.api_key)
        
        user_content = []
        if page_images:
            for img in page_images:
                b64 = base64.b64encode(img["bytes"]).decode("utf-8")
                user_content.append({
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{b64}"}
                })
        user_content.append({"type": "text", "text": prompt})

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user_content}
            ],
            model=self.model_name if "gpt" in self.model_name else "gpt-4o-mini",
            temperature=0.2,
            max_tokens=2500,
        )
        return response.choices[0].message.content

    def _stream_openai(self, prompt: str, system: str, page_images: List[Dict[str, Any]] = None) -> Generator[str, None, None]:
        from openai import OpenAI
        client = OpenAI(api_key=self.api_key)

        user_content = []
        if page_images:
            for img in page_images:
                b64 = base64.b64encode(img["bytes"]).decode("utf-8")
                user_content.append({
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{b64}"}
                })
        user_content.append({"type": "text", "text": prompt})

        stream = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user_content}
            ],
            model=self.model_name if "gpt" in self.model_name else "gpt-4o-mini",
            temperature=0.2,
            max_tokens=2500,
            stream=True,
        )
        for chunk in stream:
            token = chunk.choices[0].delta.content or ""
            if token:
                yield token

    # Ollama Implementation
    def _generate_ollama(self, prompt: str, system: str) -> str:
        import urllib.request
        payload = {
            "model": self.model_name,
            "prompt": f"{system}\n\n{prompt}",
            "stream": False
        }
        req = urllib.request.Request(
            "http://localhost:11434/api/generate",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("response", "")

    def _stream_ollama(self, prompt: str, system: str) -> Generator[str, None, None]:
        import urllib.request
        payload = {
            "model": self.model_name,
            "prompt": f"{system}\n\n{prompt}",
            "stream": True
        }
        req = urllib.request.Request(
            "http://localhost:11434/api/generate",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as resp:
            for line in resp:
                if line:
                    data = json.loads(line.decode("utf-8"))
                    token = data.get("response", "")
                    if token:
                        yield token
