"""
Smart Query Translator and Arabic Automotive Analyzer
Translates and expands colloquial Arabic questions into precise Renault OEM technical terms.
"""

import os
import re
from typing import Optional, Dict, Any, List


# Comprehensive Automotive Arabic-to-Renault Technical Dictionary
ARABIC_RENAULT_TERMS = {
    # Electrical & Starting
    "مارش": ["starter motor", "démarreur", "163", "solenoid", "terminal 50", "starting circuit", "starter relay"],
    "سلف": ["starter motor", "démarreur", "163", "solenoid", "starting circuit"],
    "مارش خارجي": ["starter motor 163", "solenoid terminal 50", "ignition switch 104", "starter relay", "push button wiring"],
    "دينامو": ["alternator", "163", "charging system", "voltage regulator", "section 16"],
    "كونتاك": ["ignition switch", "104", "starter switch", "neiman", "terminal 15", "terminal 30", "terminal 50"],
    "سويتش": ["switch", "ignition switch 104", "selector switch"],
    "فيوز": ["fuse", "fuse box", "passenger compartment connection unit", "UCH", "BMT", "relay", "section 80", "section 87"],
    "علبة فيوزات": ["engine fuse box", "passenger compartment connection unit", "relays", "section 80", "section 87"],
    "كتاوت": ["relay", "starter relay", "cooling fan relay", "fuel pump relay 247"],
    "ريلاي": ["relay", "fuel pump relay", "injection relay 247"],
    "ضفيرة": ["wiring diagram", "wiring harness", "connectors", "cabling", "earth", "section 88"],
    "اسلاك": ["wiring", "wiring diagram", "electrical schematics", "connectors"],
    "مخطط": ["wiring diagram", "schematic", "section view", "layout"],

    # Engine & Timing
    "كاتينة": ["timing belt", "camshaft", "crankshaft", "Mot 1489", "Mot 1496", "Mot 1054", "section 11"],
    "سير الكاتينة": ["timing belt replacement", "belt tension", "E7J", "K7M", "K4M 16V", "Mot 1489", "Mot 1496"],
    "سير دينامو": ["accessories belt", "alternator drive belt", "section 07"],
    "تاكيهات": ["valve clearance", "tappets", "camshaft", "valve setting", "section 11"],
    "وش سلندر": ["cylinder head", "cylinder head tightening torque", "angular tightening", "cylinder head gasket", "section 07", "section 11"],
    "جوان وش سلندر": ["cylinder head gasket", "gasket thickness", "section 11"],
    "بساتم": ["pistons", "piston rings", "connecting rods", "gudgeon pin", "section 10"],
    "كرنك": ["crankshaft", "flywheel", "main bearings", "oil seal", "section 10"],
    "سبائك": ["crankshaft bearings", "connecting rod big end bearings", "bearing clearance", "section 10"],

    # Fuel & Injection
    "بنزين": ["fuel supply", "fuel injection", "fuel rail", "section 12", "section 13", "section 17"],
    "طلمبة بنزين": ["fuel pump", "fuel sender unit", "fuel tank", "relay 247", "section 19"],
    "مضخة الوقود": ["fuel pump", "fuel tank", "section 19"],
    "رشاشات": ["injectors", "fuel injection", "injection rail", "computer 120", "section 17"],
    "حاقن": ["injectors", "injection computer", "section 17"],
    "حساس كرنك": ["TDC sensor", "top dead centre sensor", "flywheel sensor", "crankshaft position", "section 17"],
    "حساس الكرنك": ["TDC sensor", "crankshaft position sensor", "flywheel", "section 17"],
    "حساس شكمان": ["oxygen sensor", "lambda sensor", "richness regulation", "#05", "#35", "exhaust", "section 12", "section 17"],
    "حساس الشكمان": ["oxygen sensor", "lambda probe", "#05", "#35", "section 12", "section 17"],
    "حساس أكسجين": ["oxygen sensor", "lambda sensor", "section 12", "section 17"],
    "حساس ماب": ["manifold pressure sensor", "MAP sensor", "air pressure", "section 17"],
    "حساس حرارة": ["coolant temperature sensor", "air temperature sensor", "NTC", "section 17", "section 19"],
    "بوابة": ["throttle body", "throttle potentiometer", "idle speed regulation motor", "section 17"],
    "حساس ايدل": ["idle speed stepping motor", "idle speed regulation", "section 17"],
    "بوجيهات": ["spark plugs", "gap", "ignition coils", "pencil coils", "section 17"],
    "موبينة": ["ignition coil", "dual ignition coil", "pencil coils", "section 17"],

    # Transmission & Clutch
    "فتيس": ["manual gearbox", "automatic transmission", "JB1", "JB3", "JC5", "DP0", "AD4", "section 21", "section 23"],
    "جيربوكس": ["gearbox", "transmission", "JB3", "JC5", "DP0", "section 21", "section 23"],
    "زيت الفتيس": ["gearbox capacity", "lubricants", "TRX 75W80", "ELF", "level check", "section 21", "section 23"],
    "دبرياج": ["clutch", "clutch plate", "clutch mechanism", "thrust bearing", "clutch cable", "section 20"],
    "كلاتش": ["clutch", "flywheel", "thrust bearing", "section 20"],
    "كوبلن": ["driveshafts", "CV joint", "gaiter", "stub axle", "section 29"],
    "عكوس": ["driveshafts", "driveshaft gaiter", "section 29"],

    # Brakes & Chassis
    "فرامل": ["braking system", "master cylinder", "brake caliper", "brake pads", "brake disc", "section 37"],
    "تيل فرامل": ["brake pads", "brake shoes", "caliper", "thickness", "section 37"],
    "طنابير": ["brake discs", "brake drums", "disc runout", "thickness", "section 37"],
    "اي بي اس": ["ABS system", "Teves ABS", "BOSCH ABS", "hydraulic unit", "wheel speed sensor", "section 38"],
    "abs": ["ABS", "hydraulic unit", "wheel speed sensor", "brake pressure", "section 38"],
    "عفشة": ["front axle", "rear axle", "suspension", "shock absorbers", "wishbone", "anti-roll bar", "section 30", "section 31", "section 33"],
    "مساعدين": ["shock absorbers", "strut assembly", "coil spring", "section 31", "section 33"],
    "مقصات": ["suspension arm", "track control arm", "ball joint", "bushes", "section 31"],
    "بيض مقص": ["ball joint", "suspension ball joint", "swivel joint", "section 31"],
    "علبة دركسيون": ["steering rack", "power steering", "steering column", "track rod", "section 36"],

    # Cooling & Heating
    "رادياتير": ["radiator", "cooling circuit", "cooling fan", "expansion bottle", "section 19"],
    "طلمبة مياه": ["water pump", "cooling pump", "coolant", "section 19"],
    "ثيرموستات": ["thermostat", "opening temperature", "cooling circuit", "section 19"],
    "تكييف": ["air conditioning", "compressor", "condenser", "refrigerant R134a", "pressure switch 206", "section 62"],

    # Security & Body
    "ايموبلايزر": ["immobiliser", "PLIP system", "coded key system", "transponder", "section 82"],
    "شفرة المفتاح": ["coded key", "transponder coil", "immobiliser ECU", "section 82"],
    "سنتر لوك": ["central door locking", "door lock motor", "section 87"],
}


class SmartQueryTranslator:
    """Intelligently analyzes and translates user queries into technical Renault terms."""

    def __init__(self, provider: str = "gemini", api_key: Optional[str] = None):
        self.provider = provider
        self.api_key = api_key or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or os.getenv("GROQ_API_KEY") or os.getenv("OPENAI_API_KEY")

    def translate_and_expand(
        self,
        query: str,
        vehicle_profile: Optional[Dict[str, Any]] = None,
        messages: Optional[List[Dict[str, Any]]] = None,
        use_llm: bool = True
    ) -> str:
        """Translates user query into a targeted technical search query for the Renault manual with context."""
        # Extract immediate context from last user message if follow-up
        context_hint = ""
        if messages:
            past_user_msgs = [m.get("content", "") for m in messages if m.get("role") == "user" and m.get("content") != query]
            if past_user_msgs:
                last_msg = past_user_msgs[-1]
                # Extract dictionary terms from previous message as well
                context_hint = self._dictionary_expand(last_msg)

        # 1. Fast Dictionary Expansion
        dictionary_terms = self._dictionary_expand(query)
        if context_hint:
            dictionary_terms = f"{dictionary_terms} {context_hint}".strip()

        # 2. LLM Semantic Query Expansion (if key available and requested)
        llm_terms = ""
        if use_llm and self.api_key and self._contains_arabic(query):
            try:
                llm_terms = self._expand_with_llm(query, vehicle_profile, messages)
            except Exception as e:
                print(f"[QueryTranslator] Fast fallback to dictionary: {e}")

        # 3. Combine with Vehicle Profile
        profile_terms = ""
        if vehicle_profile:
            engine = vehicle_profile.get("engine", "")
            gearbox = vehicle_profile.get("gearbox", "")
            capacity = vehicle_profile.get("capacity", "")
            if engine and engine != "Any":
                profile_terms += f" {engine} engine"
            if gearbox and gearbox != "Any":
                profile_terms += f" {gearbox} transmission"
            if capacity:
                profile_terms += f" {capacity}"

        # Combine all representations
        full_expanded = f"{query} {dictionary_terms} {llm_terms} {profile_terms}".strip()
        # Clean duplicate spaces
        full_expanded = re.sub(r"\s+", " ", full_expanded)
        return full_expanded

    def _contains_arabic(self, text: str) -> bool:
        return bool(re.search(r"[\u0600-\u06FF]", text))

    def _dictionary_expand(self, query: str) -> str:
        matched_terms = []
        q_lower = query.lower()
        for ar_keyword, en_list in ARABIC_RENAULT_TERMS.items():
            if ar_keyword in q_lower:
                matched_terms.extend(en_list)
        return " ".join(set(matched_terms))

    def _expand_with_llm(
        self,
        query: str,
        vehicle_profile: Optional[Dict[str, Any]] = None,
        messages: Optional[List[Dict[str, Any]]] = None
    ) -> str:
        """Uses fast LLM call to translate Arabic technical intent into OEM Renault terms with context."""
        engine_hint = vehicle_profile.get("engine", "K4M") if vehicle_profile else "K4M"
        gearbox_hint = vehicle_profile.get("gearbox", "JB3") if vehicle_profile else "JB3"

        history_context = ""
        if messages:
            recent_turns = []
            for m in messages[-3:]:
                if m.get("content") != query:
                    role = "User" if m.get("role") == "user" else "Assistant"
                    content = m.get("content", "")[:150]
                    recent_turns.append(f"{role}: {content}")
            if recent_turns:
                history_context = f"Previous context:\n" + "\n".join(recent_turns) + "\n"

        prompt = f"""You are a Renault automotive technical query analyzer.
Convert this Arabic automotive question into 4-6 precise English technical keywords and Renault factory manual component names/codes for searching the OEM workshop manual.
Vehicle context: Renault Megane 1 (Engine: {engine_hint}, Gearbox: {gearbox_hint}).
{history_context}
User question: "{query}"

Output ONLY space-separated keywords (e.g. "starter motor 163 solenoid terminal 50 ignition switch 104 wiring diagram"):"""

        try:
            if self.provider == "gemini":
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                model = genai.GenerativeModel("gemini-1.5-flash")
                resp = model.generate_content(prompt)
                return resp.text.strip()
            elif self.provider == "groq":
                from groq import Groq
                client = Groq(api_key=self.api_key)
                comp = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama-3.3-70b-versatile",
                    max_tokens=60
                )
                return comp.choices[0].message.content.strip()
            elif self.provider == "openai":
                from openai import OpenAI
                client = OpenAI(api_key=self.api_key)
                comp = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="gpt-4o-mini",
                    max_tokens=60
                )
                return comp.choices[0].message.content.strip()
        except Exception:
            return ""
        return ""
