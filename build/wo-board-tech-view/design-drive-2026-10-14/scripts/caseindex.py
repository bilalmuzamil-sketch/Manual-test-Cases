"""Shared helper: plain text of every case snapshot (all authors), and which cases mention a text (Rule 124 COVERED lookups)."""
import glob, html, json, os, re
SNAP = "/home/user/Manual-test-Cases/build/wo-board-tech-view/currency-2026-10-14/snapshots-before"


def _plain(j):
    parts = [j.get("title", ""), j.get("custom_preconds") or "", j.get("custom_steps") or "", j.get("custom_expected") or ""]
    for s in j.get("custom_steps_separated") or []:
        parts += [s.get("content") or "", s.get("expected") or "", s.get("additional_info") or ""]
    t = html.unescape(re.sub(r"<[^>]+>", " ", " ".join(parts)))
    t = t.replace("’", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"\s+", " ", t).lower()


CASES = {}
for f in glob.glob(os.path.join(SNAP, "C*.json")):
    j = json.load(open(f))
    CASES[j["id"]] = {"text": _plain(j), "title": j.get("title", ""), "by": j.get("created_by"), "section": j.get("section_id")}


def find(text, limit=8):
    t = text.lower().replace("’", "'").replace("“", '"').replace("”", '"')
    parts = [p.strip(" .,:;-\"'") for p in re.split(r"\{…\}", t)]
    parts = [p for p in parts if len(p) >= 3]
    if not parts:
        return []
    hit = [cid for cid, c in CASES.items() if all(p in c["text"] for p in parts)]
    return sorted(hit)[:limit]


def link(cid):
    return f"[C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid})"
