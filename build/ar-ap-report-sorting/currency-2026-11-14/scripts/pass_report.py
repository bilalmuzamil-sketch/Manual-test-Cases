"""Writes currency-2026-11-14/PASS-REPORT.md and pass-parts.json (Rule 134 item 3): per case, every part CHANGED or CONFIRMED, comparing the
body to be written (the v13 body built on the live text; the library body for a new case) with what TestRail holds now (read 14 Nov 2026), plus
the setup recipe (AR-AP-SETUP-FILE.md before/after), run 557 membership and folder. Also the counts, the "edited outside our library" list and the
reading coverage. Read-only."""
import json, csv, re, sys, os
from collections import Counter
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-14"
sys.path.insert(0, f"{B}/authoring"); import v13_layout as V; import cases_v13 as V13C
MAP = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
LIVE = json.load(open(f"{W}/live-before/live-2026-11-14.json")); LC = {c["id"]: c for c in LIVE["cases"]}
SEC = {s["id"]: s["name"] for s in LIVE["sections"]}; INRUN = {t["case_id"]: t for t in LIVE["tests"]}
M = json.load(open(f"{W}/proposals-v13-on-live.json")); P = json.load(open(f"{B}/authoring/proposals.json"))
OE = json.load(open(f"{W}/live-before/outside-edits-2026-11-14.json")); HELD = json.load(open(f"{W}/held-out-of-write.json"))
AFF = json.load(open(f"{W}/AFFECTED.json")); QC = json.load(open(f"{W}/quote-check.json")); MR = json.load(open(f"{W}/merge-report.json"))
INV = json.load(open(f"{W}/merge-invariant.json"))
STATUS = {1: "passed", 2: "blocked", 3: "untested", 4: "retest", 5: "failed"}
def setup_blocks(path):
    out, cur = {}, None
    for l in open(path).read().split("\n"):
        m = re.match(r"^### SETUP-(\S+) ", l)
        if m: cur = m.group(1); out[cur] = []
        elif l.startswith("## "): cur = None
        if cur: out[cur].append(l)
    return out
SB, SA = setup_blocks(f"{W}/AR-AP-SETUP-FILE-before.md"), setup_blocks(f"{B}/AR-AP-SETUP-FILE.md")
def parts(f):
    e = f.get("custom_expected") or ""
    head, rest = (e.split("Exact quotes from the source", 1) + [""])[:2]
    quotes = rest.split("References from Design")[0]
    build = re.findall(r"<p>((?:Not yet|Last|Partly) checked[^<]*)</p>", quotes)
    q_only = re.sub(r"<p>(?:Not yet|Last|Partly) checked[^<]*</p>", "", quotes)
    design = rest.split("References from Design", 1)[1] if "References from Design" in rest else ""
    marker = re.findall(r"<p>(AUTOMATION:[^<]*)</p>", e)
    design = re.sub(r"<p>AUTOMATION:[^<]*</p>$", "", design)
    results = "".join(re.findall(r"<li>.*?</li>", head))
    notes = "".join(x for x in re.findall(r"<p>(.*?)</p>", head) if x and x not in ("<br>",) and not re.match(r"(<strong>Expected Result</strong>|Step \d+:)$", x))
    return {"title": f.get("title") or "", "preconditions": f.get("custom_preconds") or "", "steps": f.get("custom_steps") or "",
            "results": results, "notes": notes, "quotes_and_From_lines": q_only, "build_line": "".join(build), "design_references": design,
            "marker": "".join(marker), "refs": (f.get("refs") or "").replace(" ", "")}
PARTS = ["title", "preconditions", "steps", "results", "notes", "quotes_and_From_lines", "build_line", "design_references", "marker", "refs"]
rows = []
for k in sorted(set(M) | set(V13C.NEW13)):
    new = k in V13C.NEW13; cid = MAP.get(k)
    fin = (P[k] if new else M[k])["fields"]; lv = {} if new else LC[cid]
    pf, pl = parts(fin), parts(lv) if lv else {}
    r = {"key": k, "case": f"C{cid}" if cid else "new", "set": "NEW" if new else ("REWRITE" if k in V.REWRITE else "RE-STAMP"),
         "held": HELD.get(k, "")}
    for p in PARTS: r[p] = "NEW" if new else ("CHANGED" if pf[p] != pl[p] else "CONFIRMED")
    r["setup_recipe"] = "NEW" if new else ("CHANGED" if SB.get(k) != SA.get(k) else "CONFIRMED")
    r["run_557"] = "added by sync_run_557.py" if new else (f"in run ({STATUS.get(INRUN[cid]['status_id'], INRUN[cid]['status_id'])} 11-12 Nov)" if cid in INRUN else "not in run")
    r["folder"] = "Setup needed before testing (133629), new" if new else f"kept: {SEC.get(lv['section_id'], lv['section_id'])} ({lv['section_id']})"
    rows.append(r)
json.dump(rows, open(f"{W}/pass-parts.json", "w"), indent=1)
cnt = Counter(r["set"] for r in rows)
chg = {p: Counter(r[p] for r in rows if r["set"] == "REWRITE") for p in PARTS + ["setup_recipe"]}
chs = {p: Counter(r[p] for r in rows if r["set"] == "RE-STAMP") for p in PARTS + ["setup_recipe"]}
behav = [r for r in rows if r["set"] == "REWRITE" and r["results"] == "CHANGED"]
L = []
A = L.append
A("# A/R and A/P Report Sorting — PRD version 13 currency pass, 14 Nov 2026 (DRAFT: nothing written to TestRail, Jira, Slack or Google; nothing committed)")
A("")
A("QA lead, 14 Nov 2026: **\"Named set (Recommended)\"**: rewrite top to bottom (Rule 134) every case that quotes or depends on a requirement changed "
  "between PRD v11 and v13; add cases for S3-R7b and S5-R10b; re-stamp every other case to v13 only after a script proves its quotes are word for word in v13. "
  "Release 19 Nov 2026.")
A("")
A("## 1. Counts")
A("")
A("| What | Count |"); A("|---|---|")
A(f"| Cases of ours in the library (excluding the 14 Demo Day cases D-82 to D-95, untouched) | {cnt['REWRITE'] + cnt['RE-STAMP']} |")
A(f"| Rewritten top to bottom (quote or depend on S1-R8, S4-R1, S5-E3, S8-R3; S5-37 contradicted by S5-R10b) | {cnt['REWRITE']} |")
A(f"| ... of which the tester text changed (title, preconditions, steps or results) | {sum(1 for r in rows if r['set']=='REWRITE' and any(r[p]=='CHANGED' for p in ('title','preconditions','steps','results')))} |")
A(f"| Re-stamped to v13 (From line only; quotes proved word for word in v13 first) | {cnt['RE-STAMP']} |")
A(f"| New cases (S3-33 to S3-36 for S3-R7b; S5-43 for S5-R10b; S5-41b for the changed S5-E3) | {cnt['NEW']} |")
A(f"| Edited outside our library since our last write (10 Nov 2026) | {len(OE)} of {cnt['REWRITE'] + cnt['RE-STAMP']} |")
A(f"| Held out of every write (readiness check fails on live text we did not write) | {len(HELD)} ({', '.join(HELD)}) |")
A(f"| Quotes checked word for word against their sources (final bodies) | {QC['quotes']} in {QC['cases']} cases, {len(QC['fails'])} failing |")
A("")
A("## 2. What changed in the PRD (v11 -> v13; diff read in full)")
A("")
for code, v in AFF["changed"].items(): A(f"- **{code}**: {v['what_changed']} ({len(v['cases'])} cases quote it.)")
A(f"- **S3-R7b (new)**: {AFF['new']['S3-R7b']['v13']}")
A(f"- **S5-R10b (new)**: {AFF['new']['S5-R10b']['v13']}")
A("- Change Log rows 2026-11-12 (Milos Vasic, v12) and 2026-11-13 (Chris Ward, v13). The v12 row also records Q1 (the 2,000-row PDF limit stays pending "
  "SV-12539's timing check) and Q7 (S1-R4 unchanged; names differing only in capitals or accents cannot be created, so that case comes only from existing data); no requirement line changed for either.")
A("")
A("## 3. The write plan and the edit lock — every case was edited outside our library")
A("")
A(f"The ordered lock (update only a case whose live fields equal our last written body, the 10 Nov 2026 read-back) leaves **0 cases to update**: "
  f"all {len(OE)} were changed in TestRail on 11-12 Nov 2026 after run 557 was executed (by our TestRail account, user 3, outside this library). "
  "`write/update_cases.py` (default mode) lists them and writes nothing to them.")
A("")
kinds = Counter()
for k, v in OE.items():
    for f, x in v["fields"].items():
        for kd in x["kinds"]: kinds[f"{f}: {kd}"] += 1
A("What the outside edits are (by script, `live-before/outside-edits-2026-11-14.json`):"); A("")
A("| Field: kind of edit | Cases |"); A("|---|---|")
for kd, n in kinds.most_common(): A(f"| {kd} | {n} |")
A("")
A("Mostly: the build line became \"Last checked against build …\" or \"Partly checked …\" (366 markers now AUTOMATION: READY); a \"Setup\" block of concrete "
  "staging steps was added to the preconditions of 130 cases; some steps reworded (\"below the last row of the report page\", the network-blocking steps); 16 "
  "cases re-quoted to PRD v12 (REL cases, REL-07, DATA-13; D-52 already shows the blue header chevron, \"on the QA lead's instruction\"); REL titles now say \"staging deploy\".")
A("")
A("**Prepared, not run: `write/update_cases.py --on-live`.** It sends the v13 body built ON the live text (`proposals-v13-on-live-writable.json`, "
  "`scripts/merge_on_live.py`): a three-way merge (our 10 Nov read-back, the v13 library body, the live text) keeps every outside edit. Proof "
  "(`scripts/check_merge.py`, `merge-invariant.json`): 0 lines added that are not ours, and every outside line is still there except where a named rule replaced it: "
  f"{', '.join(f'{k}: {v}' for k, v in Counter(x[1] for v in INV.values() for x in v['their_lines_replaced']).items())}. "
  "R1 = the From line now names version 13 (rest of their line kept); R2 = a rewritten case's own build line where the rewrite added a result no build has shown; "
  "R3 = S5-37's marker (its expected behaviour reversed); R4 = the v13 quote text (theirs only re-encoded the same quote); R5 = D-16's tech-plan note (their wording kept, "
  "the v13 point added). D-52 keeps its live tester line and note. Lock in that mode: the 14 Nov 2026 read (fields and updated_on). Held: DATA-13 (its live preconditions name "
  "\"ZZAUTOTEST OVERPAID C715462 Cust A\", a case id in tester text, so the readiness check refuses it; we do not edit that text).")
A("")
A("No case is moved: no script sends section_id; update reads back section_id; new cases go to \"Setup needed before testing\" (133629), where the cases that need "
  "records made and the Demo Day cases are. S1-05 and S1-07 stay in \"Retired - cannot be set up\" (re-stamp only, not in run 557).")
A("")
A("## 4. Gates")
A("")
A("- `authoring/build.py`: 400 cases, **0 PROBLEM lines** (every quote word for word in PRD v13; From lines name version 13; per-case build line).")
A("- `tester_readiness_check.py build/ar-ap-report-sorting --also currency-2026-11-14/proposals-v13-on-live-writable.json`: 400 cases, **0 hard problems** "
  "(library alone: 0 hard). With DATA-13's live text: 1 hard (held, above).")
A(f"- `scripts/quote_check.py` (re-stamp proof): {QC['quotes']} quotes in {QC['cases']} final bodies, **0 failing**; every PRD From line names version 13.")
A("- `ticket_sweep.py`: 37 tickets, **0 unhandled**, PRD v13 handled (TICKET-LEDGER.json: 11 new tickets and 18 updated rows written).")
A("- Demo Day cases D-82 to D-95: byte-identical in proposals.json before and after (`scripts/lib_diff.py`).")
A("- Read in full: 20 random rewritten or new cases (seed 20261114, `sample-20-keys.json`) and every \"does not / never\" result in a rewritten or new case "
  "(52 lines): each has a visible control (a positive row, a count or the chip before the change). No fault found.")
A("")
A("## 5. Design")
A("")
A("- DD-08 (new, closed by the later PRD ruling, as DD-07): every \"this build\" picture with the table header draws the header chevron dark grey beside blue "
  "group chevrons; PRD v12/v13 S4-R1 says blue. Printed in the 13 S4-R1 cases; register row added (DESIGN-DIVERGENCE-REGISTER.json). No question: a later written PO ruling settles it.")
A("- S8-R3: the design's A/P Unpaid Invoices picture draws vendor group rows on one line and wraps only the bill rows' Vendor Name: no difference.")
A("- Checklist line 9 (stress data) where a rewritten case touches typed text: D-16 adds a vendor name with & \" ' < > (on screen; the 78-character no-space name is D-89); "
  "S3-34 and S3-36 print a long name with spaces and & \" ' < > in the PDF Total row (the no-space name is D-95). Line 10 (layout stays put across states): "
  "the rewritten S4/D cases open and close groups; the before-and-after check is D-90 to D-94 (Demo Day), not duplicated.")
A("")
A("## 6. Per case, every part (CHANGED / CONFIRMED against TestRail as read 14 Nov 2026; sources PRD v13, design of 5 Nov 2026 read 10 Nov, tech plan 21 Oct, Jira read 14 Nov)")
A("")
A("Rewritten (73), part by part: " + "; ".join(f"{p} {dict(chg[p])}" for p in PARTS + ["setup_recipe"]) + ".")
A("")
A("Re-stamped (307): " + "; ".join(f"{p} {dict(chs[p])}" for p in PARTS + ["setup_recipe"]) + ".")
A("")
A("| Key | C-id | Set | Title | Pre | Steps | Results | Notes | Quotes+From | Build line | Design | Marker | Refs | Setup recipe | Run 557 | Folder |")
A("|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|")
for r in rows:
    A(f"| {r['key']} | {r['case']} | {r['set']}{' (HELD)' if r['held'] else ''} | " + " | ".join(r[p] for p in PARTS + ["setup_recipe"]) + f" | {r['run_557']} | {r['folder']} |")
A("")
A("Tester-text changes in the rewrite set (from AFFECTED.json):"); A("")
for code, v in AFF["changed"].items():
    for c in v["cases"]:
        if not c["tester_text"].startswith("confirmed"): A(f"- {c['key']} {c['case']}: {c['tester_text']}")
A(f"- S5-37 C715579: {AFF['new']['S5-R10b']['depending_existing_cases'][0]['tester_text']}")
A("")
A("Run 557 note: these rewritten cases keep their 11-12 Nov results, which were given against the earlier expectation: S5-37 (passed: the date could not be moved past today; "
  "now expected to move), D-16, D-25 to D-28, D-56, D-58, D-59, D-62 (a result was added). The QA lead may want them retested.")
A("")
A("## 7. Edited outside our library (C-id, link, what changed) — for the QA lead")
A("")
A("| Key | C-id | Link | Fields edited (kinds) | Live folder |"); A("|---|---|---|---|---|")
for k, v in sorted(OE.items()):
    A(f"| {k} | C{v['case']} | https://shopview.testrail.io/index.php?/cases/view/{v['case']} | " +
      "; ".join(f"{f}: {'+'.join(x['kinds'])}" for f, x in v["fields"].items()) + f" | {SEC.get(v['section_live'], v['section_live'])} |")
A("")
A("## 8. Reading coverage")
A("")
A("| Source | Size | Read |"); A("|---|---|---|")
A("| PRD v11 → v13 line diff (`PRD-DIFF-v11-to-v13.txt`) | 25 lines, 6,518 bytes | 100%, in full |")
A("| PRD v13 (`sources/CONFLUENCE-947650561-v13-read-2026-11-13.md`) | 485 lines, 61,453 bytes | the 10 changed or added lines in full (diff); the other 475 lines proven identical by script to v11, which was read in full on 10 Nov 2026; every one of the 115 requirement lines quoted by a case checked word for word by script |")
A("| Confluence page 947650561 | live metadata | version 13, created 2026-11-13T14:36:51Z by Chris Ward (\"S5-R10b future as-of date (SV-12545)\"), re-checked 14 Nov 2026 |")
A("| Jira: SV-11315 and its stories, every child | 37 tickets (one page, isLast) | 100% list; 29 descriptions fetched; story/epic/bug descriptions diffed against 10 Nov by script (only SV-11535 changed: S5-R10b + acceptance check, read in full); the 11 new tickets read in full (401 lines, 34,498 bytes) |")
A("| Chris Ward's question sheet, rows 24-40 | 22 questions | read in full: answers column empty for 18-22 |")
A("| Live TestRail | 9,030 cases paged, 486 kept (394 ours + 89 in run 557 + 3 retired-folder), run 557 (481 tests), folder 90418 | by script; foreign C1078980 and C1078981 read in full |")
A("| Design (5 Nov version) | 2 pictures viewed (\"Expand all from the header\", \"A/P Unpaid Invoices at 1440\"), chevron text in Grouped.dc.html | for DD-08 and S8-R3 |")
A("| Rules and skills | Rule 117 14th/15th amendments, 113, 134-137, 140, 61, 69; skill 21 §6d; skill 07 §6.0; LESSONS-REGISTER.md | in full |")
A("")
A("## 9. Unsettled / for the QA lead")
A("")
A("1. **Every case was edited outside our library** (section 3). Recommended: run `update_cases.py --on-live` (keeps every outside edit, proven), then "
  "`create_new.py`, `sync_run_557.py`, `folder_note.py`. Otherwise the ordered lock writes nothing and the suite stays on v11/v12 for the 19 Nov release.")
A("2. **DATA-13 (C715462)** held: its live preconditions carry a case id in a record name; fix the text or allow it.")
A("3. **SV-12723 gap**: no case checks that empty bucket cells on the Summaries sort to the bottom (S2-R6); outside the named set. Recommended: one new case per Summary.")
A("4. **SV-12540 closed as obsolete**, but PRD v13 S1-R8 still sets that only the first 100 documents are shown, then 100 more as you scroll; S1-21/S1-22 keep that "
  "(they passed 11-12 Nov). No PO question: the PRD's own words settle it (skill 07 §6.0 check b).")
A("5. **PO questions**: no new question passes checks a-h (DD-08 is settled by the later PRD ruling, check a/c; S8-R3's 'can make the table scroll sideways' is permissive, not a must, check e; "
  "everything else is quoted from the PRD, check b). Waiting on Chris Ward (sheet https://docs.google.com/spreadsheets/d/11_3z_TpKkOL-MiAWqxrj1jlHP1rn9QXu_h3uCR0SjVA): "
  "18 (no case held; S3-32 C1062581 and S5-43 avoid days before the 10th), 20, 22 (added 11 Nov by another session; no case of ours held). 19 and 21 are settled by PRD v13/v12.")
open(f"{W}/PASS-REPORT.md", "w").write("\n".join(L) + "\n")
print("rows", len(rows), dict(cnt)); print("rewrite parts:", {p: dict(v) for p, v in chg.items()}); print("restamp parts:", {p: dict(v) for p, v in chs.items()})
