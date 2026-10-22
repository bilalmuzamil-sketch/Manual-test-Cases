#!/usr/bin/env python3
"""Render TICKET-LEDGER.json, TICKET-SWEEP.json, PO-QUESTIONS-DRAFT.md, DESIGN-CASE-CHECKLIST-2026-10-22.md, DESIGN-DIVERGENCE-REGISTER.json
and REPORT.md from the case sources. python3 render_outputs.py (run build.py first)."""
import os, sys, re, json, importlib
from collections import Counter, defaultdict
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import ar_lib as L
for m in ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_s5", "cases_s6_s9", "cases_data", "cases_rel", "cases_design"]: importlib.import_module(m)
from po_questions import QUESTIONS, QN
QPAT = r"question (\d+)"
P = L.P; CASES = L.CASES; BY = {c["key"]: c for c in CASES}
def find(sec, pat): return [c["key"] for c in CASES if c["sec"] == sec and re.search(pat, c["title"])]
def keys_quoting(*codes): return [c["key"] for c in CASES if set(codes) & L.codes_of(c)]

# ---------------- ticket ledger and sweep ----------------
epic = json.load(open(f"{P}/sources/JIRA-EPIC-SV-11315-2026-10-22.json"))["issues"]["nodes"]
TODAY = "2026-10-22"
ledger = {}
def row(k, outcome, cases, note): ledger[k] = {"updated": TODAY, "outcome": outcome, "cases": cases, "note": note}
row("SV-11315", "COVERED", [f"all {len(CASES)}"], "Epic; every case names it on its first From: line. Read in full 22 Oct 2026 (sources/JIRA-READING-2026-10-22.md).")
DIFF = {1: "Jira S1-R8 still says \"Paging (30 rows per page)\" for every report; PRD v5 states paging per report (question %d)." % QN["jira-differs"],
        4: "Jira S4-R4 names A/P Detail only; PRD v5 adds A/R Detail (question %d)." % QN["jira-differs"],
        5: "Jira S5-R3 lacks \"or the Past due filter\", S5-R7 lacks the per-document A/P rule, and S5-R19 keeps the removed single-threshold link (question %d)." % QN["jira-differs"],
        7: "Adds acceptance criterion \"clicking anywhere but the link opens nothing\" (PRD What changes: \"Clicking a row no longer opens it.\"), covered by S7-01 and S7-02."}
for n, (key, name) in L.STORY.items():
    ks = [c["key"] for c in CASES if n in L.story_nums(c)]
    row(key, "NEW-CASES", ks, f"{name}. Description and acceptance criteria read in full 22 Oct 2026 and compared with PRD v5. " + DIFF.get(n, "Same text as PRD v5."))
rel = {c["key"]: c["title"] for c in CASES if c["sec"] == "REL"}
def relk(pat): return [k for k, t in rel.items() if re.search(pat, t)]
row("SV-7192", "COVERED", find("S1", "name order|capitals") + find("S3", "match the rows") + relk("as-of date you picked"),
    "Origin ticket (Fast Truck and Trailer): alphabetical A/R and A/P print/PDF matching QuickBooks. Its proposed \"Sort customers\" option is replaced by the PRD's fixed A to Z opening order; the PRD wins.")
row("SV-10798", "COVERED", find("S1", "name order") + [c["key"] for c in CASES if c["sec"] == "S2"][:6] + find("S3", "Export menu"),
    "Origin ticket (Cody): default alphabetical order, sort by any header, export. Covered by Stories 1 to 3.")
row("SV-11441", "NEW-CASES", relk("credit dated on the as-of date"),
    f"Out of scope (later ticket). One must-not-change case (today's aging must stay as it is in this release).")
for k, what in (("SV-11442", "configurable aging periods"), ("SV-11443", "send a statement"), ("SV-11444", "salesperson and Parts vs Service filters"),
                ("SV-11446", "last payment date and credit limit columns"), ("SV-11447", "collection notes log")):
    row(k, "NEW-CASES", relk("research ideas"), f"Out of scope (later ticket: {what}). Covered only as a must-not-appear check; no case for the feature itself.")
row("SV-11445", "NEW-CASES", [c["key"] for c in CASES if "OOS-1" in L.codes_of(c)],
    "Later phase of this epic (background exports). This release: over the limit the user is told to choose an earlier as-of date and no background export is offered; the case checks that.")
row("SV-11595", "COVERED", [c["key"] for c in CASES if set(L.reports_of(c)) & {"ARS", "APS"}][:40] + ["..."],
    "Developer verify task, Phase 2 (Summaries). Its user-visible checks are covered by the Summary cases; the staging-copy query-plan and G-DATA checks are developer-only.")
row("SV-11596", "COVERED", [c["key"] for c in CASES if set(L.reports_of(c)) & {"ARC", "APU"}][:40] + ["..."],
    "Developer verify task, Phase 3 (Collection and Unpaid Invoices). Every check it lists is covered by a case.")
row("SV-11597", "NEW-CASES", relk("Inventory Value|work order link"),
    "Developer verify task, Phase 1 (shared report kit). Its check that the other reports behave exactly as before, and that a work order link from another location still asks to switch, became REL cases (Rule 96: a shared component). The name-order examples (Øster before Ozone) are in S1-03.")
row("SV-11598", "COVERED", [c["key"] for c in CASES if set(L.reports_of(c)) & {"ARD", "APD"}][:40] + ["..."],
    "Developer verify task, Phase 4 (Detail reports). Covered, including the QA organization's 13,540-line PDF refusal.")
row("SV-11599", "NO-CASE", [], "Developer verify task, Phase 5: old code and routes removed and the nightly automated run green are developer checks; \"All six reports work end to end once more as admin\" is the whole suite.")
row("SV-11600", "NO-CASE", [], "Duplicate of SV-11597 (same summary and description, word for word); covered by the SV-11597 cases. Noted for the QA lead.")
assert {i["key"] for i in epic} == set(ledger), set(i["key"] for i in epic) ^ set(ledger)
json.dump(ledger, open(f"{P}/TICKET-LEDGER.json", "w"), indent=1, ensure_ascii=False)
json.dump({"project": "A/R and A/P Report Sorting, Export and Location Filter", "epic": "SV-11315",
           "stories": [v[0] for v in L.STORY.values()], "prd_page": "947650561", "prd_version_handled": 5,
           "_query": "(key = SV-11315 OR parent = SV-11315 OR parent in (SV-11531..SV-11539)), every page, saved as sources/JIRA-EPIC-SV-11315-2026-10-22.json (25 tickets).",
           "prd_handled_note": "22 Oct 2026: first draft of the whole suite from PRD v5 (21 Oct 2026); nothing earlier to diff."},
          open(f"{P}/TICKET-SWEEP.json", "w"), indent=1, ensure_ascii=False)

# ---------------- PO question draft ----------------
refs = defaultdict(list)
for c in CASES:
    for n in set(int(x) for x in re.findall(r"question (\d+)", c["note"] + " " + c["marker"])): refs[n].append(c["key"])
Q = ["# A/R and A/P Report Sorting — questions for Chris Ward (DRAFT, not sent)", "",
     "Project: A/R and A/P Report Sorting, Export and Location Filter (epic SV-11315). Feature: the six A/R and A/P aging reports. "
     "PRD version 5 (21 Oct 2026). Prepared 22 Oct 2026 from a full read of the PRD and every ticket under the epic. **Nothing here has been sent** "
     "(QA lead's instruction for this pass). When it is sent, it uses the colour-coded question sheet format (Rule 125) and the open list goes into "
     "`build/PO-QUESTIONS-OPEN.md` (Rule 132).", "",
     "| No. | Project / feature | Question (plain words) | What the PRD says | Options | Effect on the test cases | Cases that name it |",
     "|---|---|---|---|---|---|---|"]
for i, (slug, q, basis, opts, holds) in enumerate(QUESTIONS, 1):
    Q.append(f"| {i} | A/R and A/P Report Sorting / {'the six reports'} | {q} | {basis} | {'<br>'.join(opts)} | {holds} | {', '.join(refs.get(i, [])) or '—'} |")
Q += ["", "Not for Chris (for the QA lead): SV-11597 and SV-11600 are the same developer task, word for word."]
open(f"{P}/PO-QUESTIONS-DRAFT.md", "w").write("\n".join(Q) + "\n")

# ---------------- design-case checklist and divergence register ----------------
design = [c for c in CASES if c["sec"] == "DESIGN"]
dk = lambda pat: ", ".join(c["key"] for c in design if re.search(pat, c["title"])) or "—"
CL = ["# Design-case checklist (skill 21 §6d, Rule 133) — 22 Oct 2026", "",
      "**The design canvas could not be read in this pass**, so lines that need the design are OPEN, not ticked. The design cases are written "
      "from the PRD's own look sentences (the brief) and compare with the native reports the PRD names. When the design arrives the whole design is "
      "driven and every case is re-checked (Rules 120, 122). The suite is not reported complete while a line is open.", "",
      "| # | Checklist line | Status | Cases / where |", "|---|---|---|---|",
      f"| 1 | Every screen and state the design draws has a \"Design: … looks as described\" case | PARTLY: every screen and state the PRD names, for all six reports (1440 light, dark, 1536 both, loading/empty/error); the design's own screens OPEN until it is read | {dk('1440|dark theme|1536|loading')} |",
      f"| 2 | Every menu, dialog, tooltip, toast, prompt and empty state listed with its rows and buttons in order, compared with the PRD | DONE from the PRD (Location, Customer, Vendor, Past due and Export menus; switch-location dialog; Collapse/Expand tooltip; info tooltip; Success, Empty export, too-large and failed-export messages; empty and error states); the design's versions OPEN | {dk('menu|dialog|tooltip|messages|chevrons|states')} |",
      f"| 3 | Every label compared letter for letter, capitals included (L-04) | DONE in every design case step; the letter-case conflict inside the PRD asked (question {QN['open-balance-case']}); every other heading stays as today | all design cases |",
      "| 4 | Every design behaviour that differs from the PRD has a held design-version case and a sent question (Rule 130) | OPEN: needs the design; the divergence register is empty for that reason | DESIGN-DIVERGENCE-REGISTER.json |",
      "| 5 | Both directions checked: design → cases (text and visual inventory) and PRD → design (spec_to_design_check.py) | OPEN: needs the design | — |",
      f"| 6 | Sizes, colours, icons, column order, widths at 1440 and 1536 px, no overlap, no truncation | DONE where the PRD states them | {dk('1440|1536|narrower')} |",
      f"| 7 | Every PRD look sentence has a design case even without a design file | DONE (S7-R7, S8-R1 to S8-R5, S3-R7, S4-R1, S4-R5, S4-R6, S5-R2, S5-R13, S5-R15, KD reuse rule, Out of Scope phone layout) | {len(design)} design cases |",
      "| 8 | Result written down in the divergence register and the proof file; checklist committed beside them | PARTLY: this file and the register exist; the proof file (DESIGN-COVERAGE) waits for the design | this folder |"]
open(f"{P}/DESIGN-CASE-CHECKLIST-2026-10-22.md", "w").write("\n".join(CL) + "\n")
json.dump({"project": "A/R and A/P Report Sorting, Export and Location Filter", "design": L.DESIGN_URL, "design_read": False,
           "note": "22 Oct 2026: the design canvas was not available to this pass, so no design-vs-PRD difference could be found yet. Rule 130 applies the day it is read.",
           "differences": []}, open(f"{P}/DESIGN-DIVERGENCE-REGISTER.json", "w"), indent=1)

# ---------------- REPORT.md ----------------
sec_names = {"S1": "Story 1", "S2": "Story 2", "S3": "Story 3", "S4": "Story 4", "S5": "Story 5", "S6": "Story 6", "S7": "Story 7", "S8": "Story 8",
             "S9": "Story 9", "DATA": "Totals and counts — exact amounts", "REL": "Release day and what must not change", "DESIGN": "Design — how it looks"}
secs = json.load(open(f"{P}/sections.json"))
cnt = Counter(c["sec"] for c in CASES)
markers = Counter(c["marker"] for c in CASES)
cov = defaultdict(list)
for c in CASES:
    for x in L.codes_of(c): cov[x].append(c["key"])
def fsize(p): return os.path.getsize(p), sum(1 for _ in open(p, encoding="utf-8", errors="replace"))
R = ["# A/R and A/P Report Sorting, Export and Location Filter — draft suite report (22 Oct 2026)", "",
     "## What I did", "",
     f"- Drafted the whole suite as authoring files: **{len(CASES)} cases** in 12 sections, every one in the Rule 117 shape (all twelve amendments). "
     "`python3 authoring/build.py` passes with **0 PROBLEM lines**; it wrote `authoring/proposals.json` (one entry per case: section, title, refs, the three HTML fields).",
     "- Nothing was written to TestRail, Jira, Slack or Google, and nothing was committed.",
     "- Saved PRD v5 (Confluence 947650561, 21 Oct 2026, Chris Ward) and checked the saved copy word for word against the page's HTML (352 text blocks, 0 missing apart from the epic link's display form).",
     "- Read every ticket under the epic (25) and listed every sentence that differs from the PRD.", "",
     "## Cases per section", "", "| Section | TestRail section | Cases |", "|---|---|---|"]
for s in secs: R.append(f"| {sec_names[s]} | {secs[s]} | {cnt[s]} |")
R += [f"| **Total** | group 90418 | **{len(CASES)}** |", "",
      "## Automation markers (read back from the cases)", "", "| Marker | Cases |", "|---|---|"]
for m, n in markers.most_common(): R.append(f"| `{m}` | {n} |")
R += ["", "Every case is HOLD today because no build exists (Rule 85: source-verified only). READY + EXPECT-FAIL = 0 = total − HOLD.", "",
      "## What is held, and why", "", "| Case | Title | Why held |", "|---|---|---|"]
for c in CASES:
    if c["marker"] != L.MARKER: R.append(f"| {c['key']} | {c['title']} | {c['marker'].split(' - ', 1)[1]} |")
R += ["", "## PRD v5 coverage — every requirement code", "", "| Code | Cases | Reports covered |", "|---|---|---|"]
for k in sorted(L.CODE, key=lambda s: (int(s.split('-')[0][1:]), {"R": 0, "N": 1, "E": 2}[s.split('-')[1][0]], int(re.sub(r'\D', '', s.split('-')[1])), s)):
    reps = sorted({r for ck in cov[k] for r in L.reports_of(BY[ck])}, key=list(L.REPORTS).index)
    R.append(f"| {k} | {', '.join(cov[k])} | {', '.join(L.REPORTS[r] for r in reps)} |")
R += ["", "## Named PRD items without a code — every one covered", "", "| Item | What it is | Cases |", "|---|---|---|"]
for k, (lab, t) in L.NAMED.items(): R.append(f"| {k} | {lab}: {t[:90]}{'…' if len(t) > 90 else ''} | {', '.join(cov[k])} |")
R += ["", f"Not testable as written: {', '.join(L.NOT_TESTABLE) or 'none'} (every PRD line has a case).", "",
      "Gates `build.py` runs on every build: title ≤ 80 and no semicolon · design titles start \"Design: \" · one \"Step N:\" result per step · every {placeholder} defined in the preconditions · "
      "every quote word for word in PRD v5 (or the Jira reading record) · every PRD code and named item covered · every report a requirement names covered · every column of every report clicked "
      "in a sort case, with a third click per report · every PRD message used word for word in a step or result · the six descriptions quoted word for word · one AUTOMATION line, last · "
      "\"From:\" line per document, build line, \"References from Design\" block · setup-file link first.", "",
      "## What must not change (Rule 96, upgrade of six existing reports)", "",
      "Code baseline: NOT AVAILABLE (no product source code in this pass), so the invariant list rests on the PRD's own statements; the honest limit is larger and stated here.", "",
      "| Must not change (PRD wording) | Case(s) |", "|---|---|"]
for k in ["WC-10", "KD-PERM", "GOAL-ACCESS", "KD-ORG", "OOS-2", "OOS-3", "OOS-4", "OOS-8", "S7-E1", "S1-N1", "S1-E1", "S4-R5", "KD-REUSE", "EH", "S7-R2", "S7-R6"]:
    t = L.NAMED[k][1] if k in L.NAMED else L.CODE[k]
    R.append(f"| {k}: {t[:110]}{'…' if len(t) > 110 else ''} | {', '.join(cov[k])} |")
R += ["", "## Where Jira differs from PRD v5 (the PRD wins; listed for the PO)", "",
      "| Ticket | Difference |", "|---|---|",
      "| SV-11531 (Story 1) | S1-R8 reads \"Paging (30 rows per page) never repeats or skips…\"; PRD v5 states 30 per page on the Summaries, A/R Collection and A/P Unpaid Invoices, and 100 lines per bucket then scroll on the Detail reports. AC 6 says \"more than 30 customers, vendors or rows\". |",
      "| SV-11532 (Story 2) | AC 7 lists the Past due filter among changes that keep the sort; PRD S2-R7 does not (question 7; case held). |",
      "| SV-11534 (Story 4) | S4-R4 names A/P Detail only (\"as today\"); PRD v5 adds A/R Detail (\"new on A/R Detail\"). |",
      "| SV-11535 (Story 5) | S5-R3 lacks \"or the Past due filter; it changes only with the as-of date\"; S5-R7 lacks the per-document A/P rule; S5-R19 and AC 8 keep the single-threshold Past due link (pastDue=31) that PRD v5 removed on 20 Oct. |",
      "| SV-11537 (Story 7) | Adds AC \"clicking anywhere but the link opens nothing\" (agrees with What changes). |",
      "| SV-11538 (Story 8) | AC 2 \"text columns wrapping to a second line\" is looser than S8-R3 (Location wraps only on A/P Detail). |",
      "| SV-7192 (origin) | Proposes a selectable \"Sort customers: Alphabetical (A-Z)\" option with a \"Default order\" and ties by Customer ID; the PRD always opens A to Z and breaks ties by the lower-cased name, then the customer. |",
      "| SV-11597 / SV-11600 | Duplicate developer tasks, word for word (for the QA lead). |", "",
      "## Reading coverage (Rule 119)", "", "| Source | Size | Lines | Read |", "|---|---|---|---|"]
for p, what in [(f"{P}/sources/CONFLUENCE-947650561-v5-2026-10-22.md", "PRD v5 (markdown, saved this pass)"),
                (f"{P}/sources/CONFLUENCE-947650561-v5-2026-10-22-html.json", "PRD v5 (HTML, used to verify the markdown copy by script)"),
                (f"{P}/sources/JIRA-EPIC-SV-11315-2026-10-22.json", "Epic search result, 25 tickets (key, summary, status, updated)"),
                (f"{P}/sources/JIRA-READING-2026-10-22.md", "My record of every ticket's description and acceptance criteria")]:
    sz, ln = fsize(p); R.append(f"| {what} | {sz:,} bytes | {ln} | 100% (lines 1–{ln}) |")
R += ["| Stories SV-11531 to SV-11539 (description, requirements, acceptance criteria, comments: none) | via Jira | — | 100% |",
      "| Origin tickets SV-7192, SV-10798; out-of-scope SV-11441 to SV-11447; verify tasks SV-11595 to SV-11600; epic SV-11315 | via Jira | — | 100% |",
      "| Rules: LESSONS-REGISTER.md (L-01 to L-05); RULES-61-96.md Rules 96, 113, 114, 115, 116, 117 (all twelve amendments), 122, 126, 130, 133 | repo | — | 100% of those sections |",
      "| Skills: 17-REGRESSION-IMPACT-V1-TO-V2.md (whole), 21-DESIGN-DRIVE-PROTOCOL.md (whole, incl. §4b, §6b, §6c, §6d), IDEAL-TEST-CASE-STANDARD.md (whole) | repo | — | 100% |",
      f"| Design canvas {L.DESIGN_URL} | — | — | **NOT READ: not available to this pass** |",
      "| Tech plan | — | — | **not available** |", "",
      "## Outputs", "",
      "- `authoring/` — `ar_lib.py`, `common.py`, `po_questions.py`, `cases_*.py`, `build.py`, `render_setup.py`, `render_outputs.py`, `proposals.json`.",
      "- `AR-AP-SETUP-FILE.md` — the setup file for Claude sessions (Rule 117 ninth amendment).",
      "- `TICKET-LEDGER.json`, `TICKET-SWEEP.json` — one row per ticket (25); `build/testing-tools/ticket_sweep.py` exits 0 on them (run on a flattened copy of the saved search, whose issues sit under `nodes`; PRD still version 5 when re-checked at the end of the pass).",
      "- `PO-QUESTIONS-DRAFT.md` — 18 questions for Chris Ward, not sent.",
      "- `DESIGN-CASE-CHECKLIST-2026-10-22.md`, `DESIGN-DIVERGENCE-REGISTER.json`, `cases/design/DESIGN-CASES.json`.", "",
      "## OUTSTANDING — what I need from you", "",
      "| What | Who | What it blocks | Since |", "|---|---|---|---|",
      "| The design canvas (export or a readable link) | QA lead / Chris Ward | Rules 120/124/126/130/133: the design drive, the text and visual inventories, design-version cases, checklist lines 1, 2, 4, 5 and 8 | 22 Oct 2026 |",
      "| The tech plan | QA lead | Rule 115 coverage from the tech plan | 22 Oct 2026 |",
      "| Permission to add the cases to TestRail (Rule 6) and to the project's run (Rule 123) | QA lead | Every case stays a draft | 22 Oct 2026 |",
      "| Send the question sheet to Chris Ward (18 questions) | QA lead | 9 held cases; exact words in several cases | 22 Oct 2026 |",
      "| A test data set with exactly 2,000/2,001 and 50,000/50,001 rows, or a lower test limit | developers | 3 held export-limit cases | 22 Oct 2026 |",
      "| A build of the feature | developers | every case is HOLD (no build yet) | 22 Oct 2026 |", "",
      "### Waiting on the PO", "",
      "Sheet: `PO-QUESTIONS-DRAFT.md` (draft, not sent). Unanswered: questions 1 to 18. Cases held on them: "
      + ", ".join(c["key"] + " (Q" + re.search(QPAT, c["marker"]).group(1) + ")" for c in CASES if re.search(QPAT, c["marker"])) + "."]
open(f"{P}/REPORT.md", "w").write("\n".join(R) + "\n")
print("ledger rows", len(ledger), "| questions", len(QUESTIONS), "| report lines", len(R))
