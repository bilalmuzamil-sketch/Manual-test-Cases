#!/usr/bin/env python3
"""Writes PASS-REPORT.md for the Story 8 named-set update (14 Nov 2026) from authoring/proposals.json, the live read-backs
(applied/C<id>-after.json), restamp-proof.json, named-set.json and the gate outputs (gates-*.txt). python3 make_pass_report.py"""
import json, os, re, csv, html, sys
H = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(H)
sys.path.insert(0, f"{P}/layout-stress-2026-11-14"); import render_text as R
PROP = json.load(open(f"{P}/authoring/proposals.json")); ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{P}/testrail-id-map.csv"))}
NAMED = json.load(open(f"{H}/named-set.json")); PROOF = json.load(open(f"{H}/restamp-proof.json"))
FROM = re.compile(r"<p>From: PRD[^<]*</p>")
PICRE = re.compile(r"bt-p\d-\d\d-[\w-]+\.png")
def blocks(e):
    q = e.split("<p><strong>Exact quotes")[0]
    quotes = e.split("Exact quotes")[1].split("References from Design")[0] if "Exact quotes" in e else ""
    refs = e.split("References from Design")[1] if "References from Design" in e else ""
    mk = re.findall(r"<p>(AUTOMATION: [^<]*)</p>", e)[-1:]
    return {"results": q, "From line": "".join(FROM.findall(e)), "quotes": FROM.sub("", quotes), "References from Design": refs.rsplit("<p>AUTOMATION", 1)[0],
            "pictures": sorted(set(PICRE.findall(refs))), "marker": mk}
def parts(k):
    new = PROP[k]["fields"]; old = json.load(open(f"{P}/applied/C{ids[k]}-after.json")) if k in ids else None
    if old is None: return None
    o, n = blocks(old.get("custom_expected") or ""), blocks(new["custom_expected"])
    r = {"title": new["title"] == old.get("title"), "refs": new["refs"].replace(" ", "") == (old.get("refs") or "").replace(" ", ""),
         "preconditions": new["custom_preconds"] == old.get("custom_preconds"), "steps": new["custom_steps"] == old.get("custom_steps")}
    for b in ("results", "quotes", "From line", "References from Design", "pictures", "marker"): r[b] = o[b] == n[b]
    return {x: ("CONFIRMED" if v else "CHANGED") for x, v in r.items()}
# re-stamp only: the From line is the only difference
rs_bad = []
for k in PROOF["restamp_only"]:
    if k not in ids: continue
    old = json.load(open(f"{P}/applied/C{ids[k]}-after.json")); new = PROP[k]["fields"]
    same = all(new[f] == (old.get(f) or "") for f in ("title", "custom_preconds", "custom_steps")) and \
           FROM.sub("", new["custom_expected"]) == FROM.sub("", old.get("custom_expected") or "")
    if not same: rs_bad.append(k)
rs = [k for k in PROOF["restamp_only"] if k in ids]
COLS = ["title", "preconditions", "steps", "results", "quotes", "From line", "References from Design", "pictures", "marker", "refs"]
out = ["# Bill To: Story 8 named-set update, 14 Nov 2026 (DRAFT: nothing written to TestRail, Jira, Slack or Google; nothing committed)", "",
 "QA lead's approval (14 Nov 2026): a named-set update after the PRD page's Story 8 changed. Confluence 1003585538 was edited on 14 Nov 2026",
 "(status line still v0.5, Change Log empty); the design canvas is now version 1794608112-d8a1 (page 4, ServiceFor.dc.html, redrawn; the",
 "other 7 boards byte-identical, checked with cmp). Rule 134: every affected case rewritten top to bottom; every other case re-stamped only",
 "where its quotes are unchanged, proved by script.", "",
 "## Summary", "",
 f"- Named set (found by script, `find_affected.py`; the coordinator's list checked against it): **{len(NAMED)}** keys, of which "
 f"{sum(k in ids for k in NAMED)} are live in TestRail. Added by the script beyond the coordinator's list: D-44, D-45, D-65, S8-14, S8-15, "
 "INV-06, INV-08, REL-02, S7-01, S7-02, S7-24 (page 4 references or band text). Eight hits were the Service For *column* (Story 10), not the "
 "band, and are not in the set: D-47, D-48, D-49, D-85, D-101, S10-09, S10-10, S10-11 (their quotes are unchanged; they are re-stamped).",
 "- Rewritten: S8-01 to S8-08, S8-10 to S8-15, D-36 to D-43, D-46, D-82, D-83 (band, unit and vehicle text); D-84 (References from Design: "
 "its old page 4 words); D-44, D-45, D-65 (redrawn pictures, canvas line and words); INV-06, INV-08, REL-02, S7-01, S7-02, S7-24 (From line and, "
 "where they point at page 4, References from Design; their steps and results still hold).",
 "- New: **S8-16 to S8-20** (address with Address 2, no address, invoice keeps name and address, Change Customer leaves the band, estimate "
 "shows the current address). Not yet in TestRail and created with them: **D-82, D-83, D-84**.",
 "- Held cases stay held: S8-15 (production), REL-02 (production), S7-24 (question), D-65 (question 8).",
 f"- Re-stamped only (From line to the 14 Nov 2026 copy): **{len(rs)}** live cases (+ {len(PROOF['restamp_only']) - len(rs)} library-only "
 f"NO_MANUAL cases). Proof: every quote word for word in the new copy, quote list unchanged against the last build before this pass "
 f"(commit 9f5770bf3), and the From line the ONLY difference from the live text: **{len(rs) - len(rs_bad)} of {len(rs)}** "
 + ("(all)." if not rs_bad else f"(not: {rs_bad})."),
 "- Markers: rewritten and new cases carry \"AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026\"; held cases keep "
 "their HOLD line; re-stamped cases keep their marker.",
 "", "## Proposed deletions (for the QA lead; nothing deleted)", "",
 f"- **S8-09 C{ids['S8-09']}** \"A unit that already starts with Unit is not prefixed again\" "
 f"(https://shopview.testrail.io/index.php?/cases/view/{ids['S8-09']}). Reason: it tests S8-R3's clause \"a unit already starting with "
 "\"Unit\" is not prefixed again\", which the 14 Nov 2026 page removed; S8-R4 now says the band never repeats the unit, so the behaviour has "
 "no successor (S8-01, S8-02 and S8-10 check that no unit prints). Left exactly as it is (still on PRD version 0.5, not re-stamped); it is in "
 "run 558, so a tester would fail it today. **Recommendation: delete it** (and so drop it from run 558).",
 "", "## Edited outside our library", "",
 "Checked at write time by `update_story8.py` (live text against our last read-back; anything different is skipped and listed in "
 "`edited-outside.json`). The dry run compares with saved read-backs only, so the live list is produced by the --apply run.",
 "", "## Pictures", "",
 "18 redrawn page 4 pictures fetched with the Artifact tool (read, paths, version 1794608112-d8a1) and saved as "
 "`design-2026-11-09/images/bt-p4-NN-...-2026-11-14.png`; figure list `design-2026-11-14/DESIGN-FIGURES-P4-2026-11-14.json` "
 "(`make_p4_figures.py`). The \"part sale with a vehicle\" row is gone: the old part sale pictures map to the new part sale row. The library "
 "now refuses any old page 4 picture name and any old page 4 caption as design words.",
 "", "## Gate results", "", "```", open(f"{H}/gates-build.txt").read().strip(), "```", "```", open(f"{H}/gates-readiness.txt").read().strip(), "```",
 "```", open(f"{H}/gates-proof.txt").read().strip(), "```", "",
 "## Per case: every part CHANGED or CONFIRMED (against the live read-back)", "",
 "| Key | C-id | " + " | ".join(COLS) + " |", "|---|---|" + "---|" * len(COLS)]
for k in NAMED:
    pr = parts(k)
    if pr is None: out.append(f"| {k} | new | " + " | ".join(["NEW"] * len(COLS)) + " |"); continue
    if k == "S8-09": out.append(f"| {k} | C{ids[k]} | " + " | ".join(["CONFIRMED (proposed delete)"] * len(COLS)) + " |"); continue
    out.append(f"| {k} | C{ids[k]} | " + " | ".join(pr[c] for c in COLS) + " |")
out += ["", f"Re-stamped only ({len(rs)}; title, preconditions, steps, results, quotes, references and marker CONFIRMED, From line CHANGED): "
        + ", ".join(f"{k} C{ids[k]}" for k in rs), "",
 "## Reading coverage", "",
 "- `sources/PRD-DIFF-v0.5-to-2026-11-14.txt`: 27 lines, both sides read in full.",
 "- `sources/CONFLUENCE-1003585538-read-2026-11-14.md` (51,499 bytes): Story 8 (lines 388-417) and Story 6 rows read in full; the whole copy "
 "checked by script (every quote of every case, 179 requirement codes, 19 User Feedback rows, every named item).",
 "- Old Story 8 (v0.5 copy) read in full for the comparison.",
 "- Design: `ServiceFor.dc.html` version 1794608112-d8a1 (12,171 bytes) read in full as text; the 7 other boards compared byte for byte "
 "(identical); one redrawn picture viewed (modern invoice: name in the address's weight, unit only in the asset table).",
 "- Every rewritten and new case read in full (tester text; quotes, references and marker blocks on S8-01, D-36, D-65, D-82, D-84); "
 "siblings built from the same templates (S8-03, S8-04, D-39, D-41, D-43, D-45) read too.", "",
 "## Scripts (prepared, not run)", "",
 "- `update_story8.py`: readiness check; per case locked on the live text (skips and lists edits made outside our library, Automated cases, "
 "other authors); changed fields only; read-back; redrawn pictures attached and old page 4 pictures deleted where TestRail allows; map "
 "prd_version set to the new copy for each case written. S8-09 not touched; no run change.",
 "- `create_story8.py`: S8-16 to S8-20 and D-82 to D-84; readiness check; foreign-case guard; read-back; pictures; run 558 union only; "
 "assigned to user 6.",
 "- `folder_note.py`: Rule 140 note on folder 132467, \"current as of 11/14/2026\"; dry run saves the live description as the lock; "
 "--apply writes only if it is unchanged; QA lead's own text kept below.", "",
 "## Full text of every rewritten and new case", ""]
for k in NAMED:
    if k == "S8-09": continue
    out.append(R.one(k))
open(f"{H}/PASS-REPORT.md", "w").write("\n".join(out) + "\n"); print("PASS-REPORT.md", len("\n".join(out)), "chars; re-stamp check failures:", rs_bad)
