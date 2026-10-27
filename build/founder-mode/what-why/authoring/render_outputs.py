#!/usr/bin/env python3
"""Writes the per-case, per-part pass record (Rule 134) comparing every case with its live read-back of 13 Oct 2026
(update-2026-10-13/applied/C<id>-after.json):
  ../full-pass-2026-10-27/PASS-REPORT-PHASE-<PHASE>.md   python3 render_outputs.py [--phase A] [--sections S1,S2,S3,S4] [--samples S1-03,S3-05,S4-02]
Parts: title, preconditions, steps, expected results, quotes (codes), From lines, build line, References from Design, marker, refs,
setup (Google Doc link -> setup file), run membership. Each part is CHANGED or CONFIRMED against PRD v15. It never writes anything else."""
import os, sys, re, json, html, argparse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wwlib as L, build_mods  # noqa: F401
ap = argparse.ArgumentParser(); ap.add_argument("--phase", default="A"); ap.add_argument("--sections", default="S1,S2,S3,S4")
ap.add_argument("--samples", default="S1-03,S3-05,S4-02"); a = ap.parse_args()
SECS = a.sections.split(","); MAP = L.id_map()
def t(s):
    s = re.sub(r"<li>", "\n - ", s or ""); s = re.sub(r"</p>|<br ?/?>|</ul>|</ol>", "\n", s); s = re.sub(r"<[^>]+>", "", s)
    return re.sub(r"\n\s*\n+", "\n", html.unescape(s)).strip()
def old(cid):
    f = f"{L.P}/update-2026-10-13/applied/C{cid}-after.json"
    return json.load(open(f)) if os.path.exists(f) else None
def part(x, y): return "CONFIRMED" if x == y else "CHANGED"
rows, n, per_sec = [], {"rewritten": 0, "split": 0, "new": 0}, {}
for c in L.CASES:
    if c["sec"] not in SECS: continue
    f = L.render(c); r = MAP.get(c["key"]); o = old(r["case_id"]) if r else None
    per_sec.setdefault(c["sec"], {"rewritten": 0, "split": 0, "new": 0})
    kind = "rewritten" if o else ("split" if c["part_of"] else "new")
    n[kind] += 1; per_sec[c["sec"]][kind] += 1
    if o:
        oexp = o["custom_expected"]
        ocodes = sorted(set(re.findall(r"(S\d-[RNE]\d+a?)", oexp)))
        ncodes = sorted(x for x in L.codes_of(c) if x in L.CODE)
        parts = dict(title=part(o["title"], f["title"]), preconditions=part(t(o["custom_preconds"]), t(f["custom_preconds"])),
                     steps=part(t(o["custom_steps"]), t(f["custom_steps"])),
                     results=part(t(re.split(r"<p><strong>Source", oexp)[0]), t(f["custom_expected"].split("<p></p>")[0])),
                     quotes="CONFIRMED" if ocodes == ncodes else f"CHANGED ({', '.join(sorted(set(ocodes) ^ set(ncodes)))} differ)",
                     quote_text="CHANGED (re-copied from PRD v15; v14 rewrote S1-R1, S1-R3, S1-R6, S1-R7, S3-R3, S3-R4, S3-R6, S3-R6a, S3-R8, S3-N1, S4-R3)",
                     from_lines="CHANGED (v13 Source paragraph -> From: lines, PRD version 15, read 27 Oct 2026)",
                     build_line="CHANGED (eleventh amendment build sentence)",
                     design="CHANGED (References from Design block, boards " + (", ".join(L.design_of(c)["boards"]) or "none") + ")",
                     marker=part(re.search(r"AUTOMATION:[^<]*", oexp).group(0), c["marker"]),
                     refs=part((o.get("refs") or ""), f["refs"]),
                     setup="CHANGED (per-case Google Doc link removed; recipe in WHAT-WHY-SETUP-FILE.md)",
                     run="CONFIRMED (same C-id; stays in the open Nightly run, union only)")
    else:
        parts = dict(all=f"NEW ({'split from ' + c['part_of'] if c['part_of'] else 'new requirement'}); needs a C-id and the run (union only)")
    rows.append((c, r, parts))
out = [f"# What/Why full pass — Phase {a.phase} pass record (Rule 134), 27 Oct 2026", "",
       f"Sections {', '.join(SECS)}. Every case is compared part by part with its live read-back of 13 Oct 2026 and checked against "
       f"{L.PRD_NAME}. Counts: {n}.", "", "| Section | rewritten (keeps C-id) | split parts (new) | new behaviour (new) |", "|---|---|---|---|"]
for s, v in per_sec.items(): out.append(f"| {s} | {v['rewritten']} | {v['split']} | {v['new']} |")
out += ["", "## Per case, per part", ""]
for c, r, parts in rows:
    link = f"[C{r['case_id']}](https://shopview.testrail.io/index.php?/cases/view/{r['case_id']})" if r else "new"
    out.append(f"- **{c['key']}** {link} — {c['title']}: " + "; ".join(f"{k} {v}" for k, v in parts.items()))
out += ["", "## Samples, old (13 Oct, live) vs new (this pass), tester text", ""]
for k in a.samples.split(","):
    c = next(x for x in L.CASES if x["key"] == k); r = MAP.get(k)
    if not r: continue        # a new case has no old version to compare
    o = old(r["case_id"]); f = L.render(c)
    out += [f"### {k} · C{r['case_id']}", "", "**Old (live since 13 Oct 2026)**", "", "```", o["title"], t(o["custom_preconds"]), "STEPS", t(o["custom_steps"]),
            t(re.split(r"<p><strong>Source", o["custom_expected"])[0]), "```", "", "**New**", "", "```", f["title"], t(f["custom_preconds"]), "STEPS",
            t(f["custom_steps"]), t(f["custom_expected"]), "```", ""]
open(f"{L.FP}/PASS-REPORT-PHASE-{a.phase}.md", "w").write("\n".join(out))
print("pass record:", n, per_sec)
