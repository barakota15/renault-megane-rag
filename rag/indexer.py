"""
Vector and BM25 Indexer for Renault Megane Workshop Manual
Extracts, chunks, embeds, and saves indexes to disk for fast retrieval.
"""

import os
import json
import pickle
import numpy as np
from typing import List, Optional, Dict, Any
from pathlib import Path

from rag.pdf_parser import PDFParser
from rag.chunker import WorkshopChunker, DocumentChunk


class ManualIndexer:
    def __init__(
        self,
        pdf_path: str = "renault-megane-1995-2002-factory-workshop-service-manual.pdf",
        index_dir: str = "data/index",
        embedding_model_name: str = "all-MiniLM-L6-v2",
    ):
        self.pdf_path = pdf_path
        self.index_dir = Path(index_dir)
        self.embedding_model_name = embedding_model_name
        self.index_dir.mkdir(parents=True, exist_ok=True)

        self.chunks_file = self.index_dir / "chunks.json"
        self.embeddings_file = self.index_dir / "embeddings.npy"
        self.bm25_file = self.index_dir / "bm25.pkl"
        self.metadata_file = self.index_dir / "metadata.json"

        self._embedder = None

    @property
    def embedder(self):
        if self._embedder is None:
            try:
                import os
                # Allow loading from local cache without remote check
                from sentence_transformers import SentenceTransformer
                try:
                    self._embedder = SentenceTransformer(self.embedding_model_name, local_files_only=True)
                except Exception:
                    self._embedder = SentenceTransformer(self.embedding_model_name)
            except Exception as e:
                print(f"[Indexer] Warning: sentence-transformers not initialized: {e}")
                self._embedder = None
        return self._embedder

    def is_indexed(self) -> bool:
        """Checks if pre-computed index files exist on disk."""
        return (
            self.chunks_file.exists()
            and self.embeddings_file.exists()
            and self.bm25_file.exists()
            and self.metadata_file.exists()
        )

    def get_stats(self) -> Dict[str, Any]:
        """Returns stats of current index if available."""
        if not self.metadata_file.exists():
            return {"indexed": False}
        with open(self.metadata_file, "r", encoding="utf-8") as f:
            meta = json.load(f)
        meta["indexed"] = True
        return meta

    def build_index(self, force: bool = False, progress_callback=None) -> Dict[str, Any]:
        """Extracts PDF, chunks text, creates dense embeddings and BM25 index."""
        if self.is_indexed() and not force:
            print("[Indexer] Existing index found. Loading metadata...")
            return self.get_stats()

        print(f"[Indexer] Processing PDF: {self.pdf_path}")
        if progress_callback:
            progress_callback(5, "Parsing PDF manual pages...")

        parser = PDFParser(self.pdf_path)
        pages = parser.extract_pages()
        print(f"[Indexer] Extracted {len(pages)} pages with text.")

        if progress_callback:
            progress_callback(30, f"Extracted {len(pages)} pages. Generating semantic chunks...")

        chunker = WorkshopChunker()
        chunks = chunker.chunk_pages(pages)
        print(f"[Indexer] Created {len(chunks)} document chunks.")

        if progress_callback:
            progress_callback(50, f"Embedding {len(chunks)} chunks using {self.embedding_model_name}...")

        # 1. Generate dense embeddings
        texts = [chunk.content for chunk in chunks]
        if self.embedder is not None:
            embeddings = self.embedder.encode(
                texts,
                batch_size=32,
                show_progress_bar=True,
                normalize_embeddings=True
            )
            np.save(self.embeddings_file, np.array(embeddings, dtype=np.float32))
        else:
            # Fallback zero-embeddings if embedder unavailable
            np.save(self.embeddings_file, np.zeros((len(chunks), 384), dtype=np.float32))

        if progress_callback:
            progress_callback(80, "Building BM25 keyword index...")

        # 2. Build BM25 index
        from rank_bm25 import BM25Okapi
        tokenized_corpus = [self._tokenize(t) for t in texts]
        bm25 = BM25Okapi(tokenized_corpus)
        with open(self.bm25_file, "wb") as f:
            pickle.dump(bm25, f)

        # 3. Save chunks JSON
        serialized_chunks = [
            {
                "chunk_id": c.chunk_id,
                "page_num": c.page_num,
                "section": c.section,
                "content": c.content,
                "raw_text": c.raw_text,
                "metadata": c.metadata,
            }
            for c in chunks
        ]
        with open(self.chunks_file, "w", encoding="utf-8") as f:
            json.dump(serialized_chunks, f, ensure_ascii=False, indent=2)

        # 4. Save metadata
        metadata = {
            "total_pages": len(pages),
            "total_chunks": len(chunks),
            "embedding_model": self.embedding_model_name,
            "source_pdf": os.path.basename(self.pdf_path),
            "pdf_size_bytes": os.path.getsize(self.pdf_path),
        }
        with open(self.metadata_file, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)

        if progress_callback:
            progress_callback(100, "Index successfully built!")

        print("[Indexer] Indexing completed successfully.")
        return metadata

    def _tokenize(self, text: str) -> List[str]:
        """Tokenize text into lowercase words while keeping automotive specs like '16v', 'k4m'."""
        import re
        text = text.lower()
        tokens = re.findall(r"[a-z0-9]+(?:[-.][a-z0-9]+)*", text)
        return tokens


if __name__ == "__main__":
    indexer = ManualIndexer()
    indexer.build_index()
