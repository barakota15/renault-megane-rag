#!/usr/bin/env python3
"""
Renault Megane I (1995-2002) Workshop Manual - CLI Assistant
Query technical specifications and repair guides directly from the terminal.
"""

import sys
import os
import argparse
from dotenv import load_dotenv
from rag.retriever import HybridRetriever
from rag.generator import RAGGenerator

load_dotenv()


def main():
    parser = argparse.ArgumentParser(description="Renault Megane Workshop Manual CLI")
    parser.add_argument("query", nargs="?", type=str, help="Your technical question")
    parser.add_argument("--provider", type=str, default="gemini", choices=["gemini", "groq", "openai", "ollama"], help="LLM Provider")
    parser.add_argument("--search-only", action="store_true", help="Perform vector/BM25 search without LLM generation")
    parser.add_argument("--top-k", type=int, default=4, help="Number of manual excerpts to retrieve")
    parser.add_argument("--section", type=str, default=None, help="Filter by manual section")
    parser.add_argument("--engine", type=str, default="K4M", help="Engine code (K4M, K7M, E7J, K4J, F3R, F8Q, F9Q)")
    parser.add_argument("--gearbox", type=str, default="JB3", help="Gearbox code (JB3, JB1, JC5, DP0, AD4)")
    parser.add_argument("--capacity", type=str, default="1.6L (1598cc)", help="Engine displacement (e.g. 1598cc, 1390cc)")
    parser.add_argument("--interactive", "-i", action="store_true", help="Interactive terminal mode")

    args = parser.parse_args()

    vehicle_profile = {
        "engine": args.engine,
        "gearbox": args.gearbox,
        "capacity": args.capacity,
    }

    print(f"🚗 Initializing Renault Megane Workshop Assistant for: {args.engine} ({args.capacity}) • {args.gearbox}...")
    retriever = HybridRetriever()
    retriever.load_index()

    if args.interactive or not args.query:
        print("\n" + "=" * 60)
        print("  Renault Mégane I (1995-2002) Workshop AI Assistant (CLI)")
        print(f"  Configured: Engine {args.engine} ({args.capacity}) | Gearbox {args.gearbox}")
        print("  Type your question below (or 'exit' / 'quit' to close)")
        print("=" * 60 + "\n")

        while True:
            try:
                user_input = input("\n🔧 Question > ").strip()
                if not user_input or user_input.lower() in ("exit", "quit", "q"):
                    print("Goodbye!")
                    break
                process_query(user_input, retriever, args.provider, args.search_only, args.top_k, args.section, vehicle_profile)
            except (KeyboardInterrupt, EOFError):
                print("\nExiting.")
                break
    else:
        process_query(args.query, retriever, args.provider, args.search_only, args.top_k, args.section, vehicle_profile)


def process_query(query: str, retriever: HybridRetriever, provider: str, search_only: bool, top_k: int, section_filter: str, vehicle_profile: dict):
    print(f"\n🔍 Searching manual for: '{query}' (Tailored for {vehicle_profile['engine']})...")
    results = retriever.search(query, top_k=top_k, section_filter=section_filter, vehicle_profile=vehicle_profile)

    if not results:
        print("❌ No matching technical sections found.")
        return

    print(f"\n📖 Found {len(results)} relevant manual excerpts:")
    for i, r in enumerate(results, 1):
        print(f"  [{i}] Page {r.page_num} | Section: {r.section} (Score: {r.score:.3f})")

    if search_only:
        for i, r in enumerate(results, 1):
            print(f"\n--- EXCERPT {i} (Page {r.page_num} - {r.section}) ---")
            print(r.raw_text.strip())
        return

    # Generation
    generator = RAGGenerator(provider=provider)
    print(f"\n🤖 Generating grounded response using {provider.upper()} ({generator.model_name})...\n")

    try:
        for token in generator.generate_stream(query, results, vehicle_profile=vehicle_profile):
            sys.stdout.write(token)
            sys.stdout.flush()
        print("\n")
    except Exception as e:
        print(f"\n⚠️ Generation note: {e}")
        print("Showing raw manual excerpts instead:\n")
        for i, r in enumerate(results, 1):
            print(f"--- [Page {r.page_num}] {r.section} ---")
            print(r.raw_text.strip())
            print()


if __name__ == "__main__":
    main()
