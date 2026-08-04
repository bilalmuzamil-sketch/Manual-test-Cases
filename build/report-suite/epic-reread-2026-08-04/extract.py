#!/usr/bin/env python3
"""READ-ONLY extractor: 2026-07-31 raw snapshot -> per-ticket text.
No network. No writes outside this folder."""
import json, os, re

RAW = "/home/user/Manual-test-Cases/build/epic-recheck-2026-07-31/raw"

def adf_text(node, out=None):
    """Flatten Atlassian Document Format to plain text, preserving list/para breaks."""
    if out is None: out = []
    if node is None: return out
    if isinstance(node, str):
        out.append(node); return out
    t = node.get("type")
    if t == "text":
        s = node.get("text", "")
        marks = {m.get("type") for m in node.get("marks", [])}
        if "strong" in marks: s = "**%s**" % s
        if "code" in marks: s = "`%s`" % s
        out.append(s); return out
    if t in ("hardBreak",): out.append("\n"); return out
    if t in ("inlineCard", "blockCard", "embedCard"):
        out.append((node.get("attrs") or {}).get("url") or ""); return out
    for c in node.get("content", []) or []:
        adf_text(c, out)
    if t in ("paragraph", "heading"): out.append("\n\n")
    if t == "listItem": out.append("\n")
    if t == "bulletList" or t == "orderedList": out.append("\n")
    if t == "tableRow": out.append("\n")
    if t == "tableCell" or t == "tableHeader": out.append(" | ")
    return out

def links_of(node, acc=None):
    """Collect every smart-card url and link href (ADF drops these from text)."""
    if acc is None: acc = []
    if isinstance(node, dict):
        if node.get("type") in ("inlineCard", "blockCard", "embedCard"):
            u = (node.get("attrs") or {}).get("url")
            if u: acc.append(u)
        for m in node.get("marks", []) or []:
            if m.get("type") == "link":
                h = (m.get("attrs") or {}).get("href")
                if h: acc.append(h)
        for c in node.get("content", []) or []: links_of(c, acc)
    return acc


def desc_text(f):
    d = f.get("description")
    if d is None: return ""
    if isinstance(d, str): return d.strip()
    s = "".join(adf_text(d))
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()

def main():
    ch = json.load(open(os.path.join(RAW, "SV-8582-children-full.json")))
    ep = json.load(open(os.path.join(RAW, "SV-8582-epic.json")))
    allis = dict(ch); allis["SV-8582"] = ep
    keys = ["SV-8582"] + sorted(ch, key=lambda k: int(k.split("-")[1]))
    recs = []
    for k in keys:
        i = allis[k]; f = i["fields"]
        cl = i.get("changelog") or {}
        desc_edits = []
        status_hist = []
        for h in cl.get("histories", []):
            for it in h.get("items", []):
                if it["field"] == "description":
                    desc_edits.append(h["created"][:19])
                if it["field"] in ("status", "resolution"):
                    status_hist.append((h["created"][:19], h["author"]["displayName"],
                                        it["field"], it.get("fromString"), it.get("toString")))
        recs.append({
            "key": k,
            "summary": f["summary"],
            "type": f["issuetype"]["name"],
            "status": f["status"]["name"],
            "resolution": (f.get("resolution") or {}).get("name"),
            "updated": f.get("updated"),
            "created": f.get("created"),
            "labels": f.get("labels") or [],
            "comments_total": (f.get("comment") or {}).get("total", 0),
            "attachments": len(f.get("attachment") or []),
            "subtasks": [s["key"] for s in (f.get("subtasks") or [])],
            "links": [((l.get("inwardIssue") or l.get("outwardIssue") or {}).get("key"),
                       l.get("type", {}).get("inward" if l.get("inwardIssue") else "outward"))
                      for l in (f.get("issuelinks") or [])],
            "desc": desc_text(f),
            "links_in_desc": sorted(set(links_of(f.get("description")))),
            "desc_edits": desc_edits,
            "status_hist": status_hist,
            "changelog_total": cl.get("total", 0),
        })
    json.dump(recs, open("tickets.json", "w"), indent=1)
    print("extracted", len(recs), "issues (1 epic + %d children)" % (len(recs) - 1))
    print("issues with empty description:", [r["key"] for r in recs if not r["desc"]])
    print("issues with description edits:", [(r["key"], r["desc_edits"]) for r in recs if r["desc_edits"]])
    print("total comments:", sum(r["comments_total"] for r in recs))
    print("total attachments:", sum(r["attachments"] for r in recs))
    print("subtasks:", [(r["key"], r["subtasks"]) for r in recs if r["subtasks"]])
    allu = {}
    for r in recs:
        for u in r["links_in_desc"]: allu[u] = allu.get(u, 0) + 1
    print("distinct spec/doc urls referenced:", len(allu))
    for u, n in sorted(allu.items(), key=lambda x: -x[1]): print("   %3d  %s" % (n, u))

main()
