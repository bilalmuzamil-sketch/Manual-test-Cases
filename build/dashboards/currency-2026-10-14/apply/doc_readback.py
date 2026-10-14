#!/usr/bin/env python3
"""Read-back of every setup doc of the Dashboard apply pass (14 Oct 2026): exports each Google Doc as plain text through its
PUBLIC link (no sign-in, so a 200 also proves anyone-with-the-link access) and compares its words, in order, with the text of
the local source docs/<C-id>.html (tags stripped, entities unescaped; list markers and whitespace ignored).
Writes applied/doc-readback-2026-10-14.jsonl."""
import json, re, html, subprocess, os
H = "build/dashboards/currency-2026-10-14/apply"
def words(t):
    t = t.replace("﻿", "")
    t = re.sub(r"(?m)^\s*(?:[*•]|\d+\.)\s+", " ", t)
    return re.findall(r"\S+", t.replace("•", " "))
rows = []
for l in open(f"{H}/doc-ids-0.jsonl"):
    r = json.loads(l); cid, doc = r["id"], r["doc"]
    src = open(f"{H}/docs/{cid}.html").read()
    src_txt = html.unescape(re.sub(r"<[^>]+>", "\n", re.sub(r"</?(?:a|strong|em|b)\b[^>]*>", "", src)))  # inline tags vanish, block tags break
    out = f"/tmp/claude-0/docexp/{cid}.txt"
    code = subprocess.run(["curl", "-sS", "-L", "-o", out, "-w", "%{http_code}",
                           f"https://docs.google.com/document/d/{doc}/export?format=txt"], capture_output=True, text=True).stdout
    got = open(out, encoding="utf-8").read() if os.path.exists(out) else ""
    a, b = words(src_txt), words(got)
    first = next((i for i, (x, y) in enumerate(zip(a, b)) if x != y), None if len(a) == len(b) else min(len(a), len(b)))
    rows.append({"op": "doc_readback", "case": cid, "doc": f"https://docs.google.com/document/d/{doc}/edit", "public_export_http": code,
                 "words_source": len(a), "words_doc": len(b), "first_difference_at_word": first,
                 "context": None if first is None else [" ".join(a[max(0, first-5):first+8]), " ".join(b[max(0, first-5):first+8])],
                 "ok": code == "200" and first is None})
with open(f"{H}/applied/doc-readback-2026-10-14.jsonl", "w") as f:
    for x in rows: f.write(json.dumps(x, ensure_ascii=False) + "\n")
for x in rows: print(x["case"], x["public_export_http"], x["words_source"], x["words_doc"], "OK" if x["ok"] else ("DIFF " + json.dumps(x["context"], ensure_ascii=False)))
print(sum(x["ok"] for x in rows), "of", len(rows), "ok")
