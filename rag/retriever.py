"""
Hybrid Retriever combining Dense Vector Search and BM25 Lexical Matching
Optimized for automotive technical specs and workshop documentation.
"""

import json
import pickle
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass

from rag.indexer import ManualIndexer
from rag.query_translator import SmartQueryTranslator


@dataclass
class RetrievedChunk:
    chunk_id: str
    page_num: int
    section: str
    content: str
    raw_text: str
    score: float
    dense_score: float
    bm25_score: float
    metadata: Dict[str, Any]


class HybridRetriever:
    def __init__(
        self,
        indexer: Optional[ManualIndexer] = None,
        index_dir: str = "data/index"
    ):
        self.indexer = indexer or ManualIndexer(index_dir=index_dir)
        self.index_dir = Path(index_dir)

        self.chunks: List[Dict[str, Any]] = []
        self.embeddings: Optional[np.ndarray] = None
        self.bm25 = None
        self.is_loaded = False
        self.translator = SmartQueryTranslator()

    def load_index(self):
        """Loads cached index files from disk into memory."""
        if not self.indexer.is_indexed():
            print("[Retriever] Index not found on disk. Building now...")
            self.indexer.build_index()

        with open(self.indexer.chunks_file, "r", encoding="utf-8") as f:
            self.chunks = json.load(f)

        self.embeddings = np.load(self.indexer.embeddings_file)

        with open(self.indexer.bm25_file, "rb") as f:
            self.bm25 = pickle.load(f)

        self.is_loaded = True
        print(f"[Retriever] Loaded {len(self.chunks)} chunks into retriever memory.")

    def _expand_query(
        self,
        query: str,
        vehicle_profile: Optional[Dict[str, Any]] = None,
        messages: Optional[List[Dict[str, Any]]] = None
    ) -> str:
        """Expands query using SmartQueryTranslator (Arabic understanding + context + vehicle profile)."""
        return self.translator.translate_and_expand(query, vehicle_profile=vehicle_profile, messages=messages)

    def search(
        self,
        query: str,
        top_k: int = 5,
        alpha: float = 0.45,  # Weight for BM25 (0.0 = pure vector, 1.0 = pure BM25)
        section_filter: Optional[str] = None,
        vehicle_profile: Optional[Dict[str, Any]] = None,
        messages: Optional[List[Dict[str, Any]]] = None,
    ) -> List[RetrievedChunk]:
        """Performs hybrid retrieval for a given automotive query tailored to vehicle profile and conversation history."""
        if not self.is_loaded:
            self.load_index()

        if not self.chunks:
            return []

        # Expand query with smart Arabic translation and technical terms
        expanded_query = self._expand_query(query, vehicle_profile, messages)

        # 1. BM25 Scores
        query_tokens = self.indexer._tokenize(expanded_query)
        if query_tokens and self.bm25 is not None:
            raw_bm25_scores = np.array(self.bm25.get_scores(query_tokens), dtype=np.float32)
        else:
            raw_bm25_scores = np.zeros(len(self.chunks), dtype=np.float32)

        # 2. Dense Vector Scores
        if self.indexer.embedder is not None and self.embeddings is not None:
            query_embedding = self.indexer.embedder.encode(
                expanded_query,
                normalize_embeddings=True
            ).astype(np.float32)
            raw_dense_scores = np.dot(self.embeddings, query_embedding)
        else:
            raw_dense_scores = np.zeros(len(self.chunks), dtype=np.float32)

        # 3. Normalize Scores (Min-Max)
        def normalize(arr: np.ndarray) -> np.ndarray:
            min_val = np.min(arr)
            max_val = np.max(arr)
            if max_val > min_val:
                return (arr - min_val) / (max_val - min_val)
            return np.zeros_like(arr)

        norm_bm25 = normalize(raw_bm25_scores)
        norm_dense = normalize(raw_dense_scores)

        # 4. Hybrid Combination
        combined_scores = (1.0 - alpha) * norm_dense + alpha * norm_bm25

        # 5. Vehicle Profile Relevance Boost
        if vehicle_profile:
            engine_code = vehicle_profile.get("engine", "").strip().upper()
            gearbox_code = vehicle_profile.get("gearbox", "").strip().upper()
            
            if engine_code and engine_code != "ANY":
                for i, chunk in enumerate(self.chunks):
                    raw_upper = chunk.get("raw_text", "").upper()
                    if engine_code in raw_upper:
                        combined_scores[i] += 0.15  # Boost matching engine chunks
            
            if gearbox_code and gearbox_code != "ANY":
                for i, chunk in enumerate(self.chunks):
                    raw_upper = chunk.get("raw_text", "").upper()
                    if gearbox_code in raw_upper:
                        combined_scores[i] += 0.10  # Boost matching transmission chunks

        # 6. Apply Section Filtering if requested
        if section_filter and section_filter.lower() != "all":
            for i, chunk in enumerate(self.chunks):
                if section_filter.lower() not in chunk.get("section", "").lower():
                    combined_scores[i] = -1.0

        # 6. Rank Top K
        top_indices = np.argsort(combined_scores)[::-1][:top_k]

        results = []
        for idx in top_indices:
            if combined_scores[idx] <= -1.0:
                continue
            chunk_data = self.chunks[idx]
            results.append(
                RetrievedChunk(
                    chunk_id=chunk_data["chunk_id"],
                    page_num=chunk_data["page_num"],
                    section=chunk_data["section"],
                    content=chunk_data["content"],
                    raw_text=chunk_data["raw_text"],
                    score=float(combined_scores[idx]),
                    dense_score=float(raw_dense_scores[idx]),
                    bm25_score=float(raw_bm25_scores[idx]),
                    metadata=chunk_data.get("metadata", {}),
                )
            )

        return results
