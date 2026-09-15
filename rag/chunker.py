"""
Smart Semantic Chunker for Technical Workshop Manuals
Preserves automotive procedures, tables, torque values, and page references.
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any
import re
from rag.pdf_parser import PageData


@dataclass
class DocumentChunk:
    chunk_id: str
    page_num: int
    section: str
    content: str
    raw_text: str
    metadata: Dict[str, Any] = field(default_factory=dict)


class WorkshopChunker:
    def __init__(self, chunk_size: int = 900, chunk_overlap: int = 150):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_pages(self, pages: List[PageData]) -> List[DocumentChunk]:
        chunks: List[DocumentChunk] = []

        for page in pages:
            text = page.text.strip()
            if not text:
                continue

            # If page text is short enough, keep it as a single chunk
            if len(text) <= self.chunk_size + 100:
                chunk_id = f"p{page.page_num}_c0"
                formatted_content = self._format_chunk_text(
                    section=page.section,
                    page_num=page.page_num,
                    body=text
                )
                chunks.append(
                    DocumentChunk(
                        chunk_id=chunk_id,
                        page_num=page.page_num,
                        section=page.section,
                        content=formatted_content,
                        raw_text=text,
                        metadata={
                            "page": page.page_num,
                            "section": page.section,
                            "chunk_index": 0,
                            **page.metadata,
                        }
                    )
                )
            else:
                # Split page into overlapping paragraphs / sections
                sub_texts = self._split_text(text)
                for idx, sub_text in enumerate(sub_texts):
                    chunk_id = f"p{page.page_num}_c{idx}"
                    formatted_content = self._format_chunk_text(
                        section=page.section,
                        page_num=page.page_num,
                        body=sub_text
                    )
                    chunks.append(
                        DocumentChunk(
                            chunk_id=chunk_id,
                            page_num=page.page_num,
                            section=page.section,
                            content=formatted_content,
                            raw_text=sub_text,
                            metadata={
                                "page": page.page_num,
                                "section": page.section,
                                "chunk_index": idx,
                                **page.metadata,
                            }
                        )
                    )

        return chunks

    def _format_chunk_text(self, section: str, page_num: int, body: str) -> str:
        """Adds contextual prefix to improve retrieval embedding quality."""
        return f"[Manual Section: {section} | Page: {page_num}]\n{body}"

    def _split_text(self, text: str) -> List[str]:
        """Splits long text into overlapping chunks respecting paragraph/procedure boundaries."""
        # Split on double newlines or numbered lists
        paragraphs = re.split(r"\n\s*\n", text)
        chunks = []
        current_chunk = ""

        for para in paragraphs:
            para = para.strip()
            if not para:
                continue

            if len(current_chunk) + len(para) + 2 <= self.chunk_size:
                if current_chunk:
                    current_chunk += "\n\n" + para
                else:
                    current_chunk = para
            else:
                if current_chunk:
                    chunks.append(current_chunk)
                    # Overlap: keep tail of previous chunk if possible
                    words = current_chunk.split()
                    if len(words) > 20:
                        overlap_text = " ".join(words[-20:])
                        current_chunk = overlap_text + "\n\n" + para
                    else:
                        current_chunk = para
                else:
                    # Paragraph itself is larger than chunk_size, split by sentences/lines
                    lines = para.split("\n")
                    temp = ""
                    for line in lines:
                        if len(temp) + len(line) + 1 <= self.chunk_size:
                            temp += ("\n" + line) if temp else line
                        else:
                            if temp:
                                chunks.append(temp)
                            temp = line
                    if temp:
                        current_chunk = temp

        if current_chunk:
            chunks.append(current_chunk)

        return chunks
