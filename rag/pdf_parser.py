"""
PDF Parser for Renault Megane Workshop Service Manual
Extracts text, page numbers, and structural section headers.
"""

import os
import re
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any


@dataclass
class PageData:
    page_num: int  # 1-indexed
    text: str
    section: str = "General"
    char_count: int = 0
    metadata: Dict[str, Any] = field(default_factory=dict)


# Common Renault workshop manual section mapping
RENAULT_SECTION_KEYWORDS = [
    (r"\b01\b|GENERAL|SPECIFICATIONS|GENERAL POINTS", "01 - General Specifications"),
    (r"\b10\b|ENGINE AND PERIPHERALS|ENGINE ASSEMBLY", "10 - Engine & Peripherals"),
    (r"\b11\b|TOP AND FRONT OF ENGINE|CYLINDER HEAD|TIMING BELT|VALVES", "11 - Top & Front of Engine"),
    (r"\b12\b|FUEL MIXTURE|INJECTION|CARBURETTOR", "12 - Fuel Mixture & Injection"),
    (r"\b13\b|TURBOCHARGING|EXHAUST", "13 - Exhaust & Turbocharging"),
    (r"\b14\b|ANTI-POLLUTION|CATALYST|EGR", "14 - Emission & Anti-Pollution"),
    (r"\b16\b|STARTING|CHARGING|ALTERNATOR|STARTER", "16 - Starting & Charging"),
    (r"\b17\b|IGNITION", "17 - Ignition System"),
    (r"\b19\b|COOLING|RADIATOR|THERMOSTAT|WATER PUMP", "19 - Cooling System"),
    (r"\b20\b|CLUTCH|FLYWHEEL", "20 - Clutch"),
    (r"\b21\b|MANUAL GEARBOX|JB3|JC5|JH3", "21 - Manual Gearbox"),
    (r"\b23\b|AUTOMATIC TRANSMISSION|DP0|AD4", "23 - Automatic Transmission"),
    (r"\b29\b|DRIVESHAFTS|AXLES", "29 - Driveshafts"),
    (r"\b30\b|CHASSIS|SUSPENSION", "30 - Chassis & Suspension"),
    (r"\b31\b|FRONT AXLE|STRUT|STABILIZER", "31 - Front Suspension"),
    (r"\b33\b|REAR AXLE|TORSION BAR", "33 - Rear Suspension"),
    (r"\b36\b|STEERING|POWER STEERING", "36 - Steering"),
    (r"\b37\b|BRAKES|HYDRAULIC|CALIPER|MASTER CYLINDER", "37 - Braking System"),
    (r"\b38\b|ABS|ANTILOCK", "38 - ABS System"),
    (r"\b60\b|HEATING|AIR CONDITIONING|HVAC", "60 - Heating & Air Conditioning"),
    (r"\b80\b|ELECTRICAL EQUIPMENT|FUSES|RELAYS|WIRING", "80 - Electrical & Wiring"),
    (r"\b81\b|LIGHTING|HEADLAMPS|BULBS", "81 - Lighting"),
    (r"\b82\b|INSTRUMENT PANEL|DASHBOARD", "82 - Instrument Panel & Controls"),
    (r"\b84\b|WIPERS|WASHER", "84 - Wipers & Washers"),
    (r"\b87\b|BODYWORK|DOORS|LOCKS", "87 - Bodywork & Interior"),
]


class PDFParser:
    def __init__(self, pdf_path: str):
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF manual not found at {pdf_path}")
        self.pdf_path = pdf_path

    def extract_pages(self) -> List[PageData]:
        """Extracts text page by page with section identification."""
        pages = []
        current_section = "General Specifications"

        try:
            import pymupdf as fitz
        except ImportError:
            import fitz

        doc = fitz.open(self.pdf_path)

        for page_index in range(len(doc)):
            page_num = page_index + 1
            page = doc[page_index]
            text = page.get_text("text") or ""
            clean_text = self._clean_text(text)

            if clean_text:
                detected_section = self._detect_section(clean_text)
                if detected_section:
                    current_section = detected_section

                pages.append(
                    PageData(
                        page_num=page_num,
                        text=clean_text,
                        section=current_section,
                        char_count=len(clean_text),
                        metadata={
                            "source": os.path.basename(self.pdf_path),
                            "page": page_num,
                        },
                    )
                )

        doc.close()
        return pages

    def _clean_text(self, text: str) -> str:
        """Cleans artifacts and standardizes whitespace."""
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()

    def _detect_section(self, text: str) -> Optional[str]:
        """Inspects the upper portion of a page for section identifiers."""
        lines = [line.strip() for line in text.split("\n")[:6] if line.strip()]
        header_snippet = " | ".join(lines).upper()

        # Check explicit Renault Section numbers and titles
        for pattern, section_name in RENAULT_SECTION_KEYWORDS:
            if re.search(pattern, header_snippet, re.IGNORECASE):
                return section_name

        # If header contains meaningful title on first 2 lines
        if len(lines) >= 2 and len(lines[0]) < 60 and len(lines[1]) < 60:
            candidate = f"{lines[0]} - {lines[1]}"
            if any(term in candidate.upper() for term in ["ENGINE", "GEARBOX", "BRAKE", "INJECTION", "ELECTRICAL", "AXLE", "SUSPENSION", "CLUTCH", "WIRING"]):
                return candidate[:60]

        return None
