#!/usr/bin/env python3
"""Canonical content hash for the Custom Roles Confluence spec.

The Atlassian API returns the page's markdown with non-deterministic
serialization (link style, bullet style, list numbering, whitespace, and
change-log date nodes sometimes render blank). A raw SHA-256 of the body
therefore flip-flops between equivalent serializations and raises false
"spec changed" alarms.

This canonical hash ignores that noise so the daily sync only fires on REAL
content changes:
  - drops the Change Log / history section (metadata, never used for bot content)
  - unwraps <custom> nodes and strips links
  - lowercases, keeps only alphanumerics
  - drops isolated single-digit tokens (list markers like "1." "2.")
  - removes all whitespace

Usage:
  python3 spec_hash.py <path-to-markdown-body>   # prints canonical sha256
  # or import canonical_hash(text)

When the canonical hash differs from `canonical_sha256` in
spec-sync-state.json, do a semantic diff before rewriting anything, then
update both `canonical_sha256` and `body_sha256`.
"""
import re
import sys
import hashlib


def canonical_hash(text: str) -> str:
    t = re.split(r'#+\s*Change Log', text, flags=re.I)[0]
    t = re.sub(r'<custom[^>]*>(.*?)</custom>', r'\1', t, flags=re.S)
    t = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', t)
    t = re.sub(r'<https?://[^>]+>', '', t)
    t = re.sub(r'https?://\S+', '', t)
    t = t.lower()
    t = re.sub(r'[^a-z0-9]+', ' ', t)
    t = re.sub(r'\b\d\b', ' ', t)       # drop isolated single-digit list markers
    t = re.sub(r'\s+', '', t)           # remove all whitespace
    return hashlib.sha256(t.encode()).hexdigest()


if __name__ == '__main__':
    data = open(sys.argv[1], encoding='utf-8').read()
    print(canonical_hash(data))
