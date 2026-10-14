import json
d = json.load(open("PRD-DIFF-v44-vs-now.json"))
D = "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=788430850&selectedPageVersions={}&selectedPageVersions={}"
d["versions"] = {
 "43": {"createdAt": "2026-10-09T15:41:14Z", "author": "Chris Ward", "message": "S4-R11a: no-sales bucket is a 0 point (SV-11076)"},
 "44": {"createdAt": "2026-10-13T13:37:09Z", "author": "Chris Ward", "message": "S8-R5a / S8-N1a: the table follows the chart filter (Ayesha)"},
 "45": {"createdAt": "2026-10-14T15:06:32Z", "author": "Chris Ward", "message": "Bilal QA sheet 14 Oct: S4-R11b, S7-R2a, S6-R3a, S6-R8a, S5-R9, S5-N3, S3-N2, S9-R9..R11, S11-E2, S12-R6..R13, section 7, sv490"},
 "46": {"createdAt": "2026-10-14T15:39:48Z", "author": "Chris Ward", "message": "Change Log: every change since development started (after Milan tech review)"}}
d["entered"] = {c: {"version": 45, "date": "2026-10-14T15:06:32Z", "diff": D.format(44, 45)} for c in list(d["added"]) + list(d["reworded"])}
d["cross_check"] = "Confluence diffConfluenceContentVersions 44->45 and 45->46 list the same 18 added bullets, the S5-R9 rewording, 12 sv8311->sv490 lines, the section 7 sentence and the Change Log rows; nothing else."
json.dump(d, open("PRD-DIFF-v44-vs-now.json", "w"), indent=1, ensure_ascii=False)
L = ["# PRD diff — Confluence 788430850 \"Dashboard\": our v44 copy (saved 14 Oct 2026 morning) vs version 46 (14 Oct 2026 15:39 UTC)", "",
 "Old: `build/dashboards/currency-2026-10-14/CONFLUENCE-788430850-2026-10-14.md` (v44)  ",
 "New: `build/dashboards/currency-2026-10-14/CONFLUENCE-788430850-v46-2026-10-14b.md` (v46, verbatim, 54,253 bytes incl. header)  ",
 "Method: `answers-followup/scripts/prd_diff_v44_v46.py` — requirement codes from `**S#-R#/N#/E#:**` bullets, whitespace / bullet / link markup normalised; every other line diffed after the same normalisation. Cross-checked against Confluence's own version diffs (`diffConfluenceContentVersions` 44→45 and 45→46): identical result.", "",
 f"**Counts:** {d['counts']['old']} codes in v44, {d['counts']['new']} in v46 — **{d['counts']['added']} added, {d['counts']['removed']} removed, {d['counts']['reworded']} reworded, {d['counts']['identical']} identical.**", "",
 "## Page history (listConfluenceContentVersions, all by Chris Ward; times UTC)", "",
 "| Version | Saved | Version message | Diff |", "|---|---|---|---|"]
for v, m in d["versions"].items():
    L.append(f"| v{v} | {m['createdAt'].replace('T',' ').replace('Z',' UTC')} | {m['message']} | {D.format(int(v)-1, v)} |")
L += ["", "Note: our earlier files gave v44 as \"13 Oct 2026 18:37\" — that is local time (UTC+5); the page history gives 13:37 UTC. v45 holds every rule change in this diff; v46 only fills the Change Log (§8).", "",
 "## Added (18) — all entered in **v45, 14 Oct 2026 15:06 UTC** (" + D.format(44, 45) + ")", ""]
for c, t in d["added"].items(): L.append(f"- **{c}** — {t}")
L += ["", "## Reworded (1) — v45, 14 Oct 2026", ""]
for c, t in d["reworded"].items(): L += [f"- **{c}**", f"  - v44: {t['old']}", f"  - v46: {t['new']}"]
L += ["", "## Removed (0)", "", "None.", "", "## Other sections (non-code lines)", "",
 "- **Header \"Demo Branch\" row and the eleven story \"Design:\" lines**: `https://sv8311.qa.shopview.com` → `https://sv490.qa.shopview.com` (v45). No sv8311 link remains; the word survives only inside the v45 Change Log row.",
 "- **§7 User Feedback Summary** (v45): \"…that chart is hidden until at least one technician is selected again (S8-N1).\" → \"…that chart and the table under it are hidden until at least one technician is selected again (S8-N1, S8-N1a).\"",
 "- **§8 Change Log** (v46): was an empty table; now 11 dated rows from 2026-09-16 (v35 baseline) to 2026-10-14 (v45). Verbatim rows are in the v46 file, lines 539–552.",
 "- Business Case, Feature Overview, Key Decisions, Terminology, Assumptions, the measure table and every context note: unchanged.", "",
 f"## Identical codes ({len(d['identical'])})", "", ", ".join(d["identical"]), "",
 "## Non-code diff lines (verbatim, normalised)", ""] + [f"    {l}" for l in d["non_code_diff"]]
open("PRD-DIFF-v44-vs-now.md", "w").write("\n".join(L) + "\n")
print("ok", len(L))
