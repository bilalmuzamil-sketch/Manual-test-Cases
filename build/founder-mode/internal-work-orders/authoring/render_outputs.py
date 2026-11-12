#!/usr/bin/env python3
"""Writes the round-1 deliverables from the case library and proposals.json (run build.py first):
REPORT.md, NO-MANUAL-PROPOSAL.md, PO-QUESTIONS-DRAFT.md, TICKET-LEDGER.json and TICKET-SWEEP.json (Rule 129).
Reads only local files: the saved PRD, the saved Jira tickets (sources/jira-sweep-full-2026-11-12.json) and the case library."""
import sys, os, re, json, glob, importlib
from collections import Counter, defaultdict
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import iwo_lib as L
from po_questions import QUESTIONS, DROPPED
_ORDER = [f"cases_s{i}" for i in range(1, 14)] + ["cases_s12p", "cases_api", "cases_data", "cases_rel", "cases_inv", "cases_design"]
_MODS = sorted(os.path.basename(f)[:-3] for f in glob.glob(f"{D}/cases_*.py"))
for m in [x for x in _ORDER if x in _MODS] + [x for x in _MODS if x not in _ORDER]: importlib.import_module(m)
P = L.P
PROP = json.load(open(f"{D}/proposals.json"))
SECS = json.load(open(f"{P}/sections.json"))["sections"]
JIRA = json.load(open(f"{P}/sources/jira-sweep-full-2026-11-12.json"))["issues"]
NOMAN = [c for c in L.CASES if c["marker"].startswith("AUTOMATION: HOLD - a tester cannot set this up")]

# ---- story text (Jira) compared with the PRD v1.0 story (each Jira story says "Requirements ... live in the spec") ----------------
STORY_DIFF = {
 "SV-11665": ("DIFFERS (older wording)", "The epic summary names the setting \"No-Charge Work Orders\", a \"No charge checkbox with a reason\", a \"No-Charge Work Orders report\", and links PRD v0.16 and design v5.11. PRD v1.0 (latest, Final, 9 Nov 2026) names the setting and the report \"Internal Work Orders\", replaces Reason by Category (Terminology: \"Reason → the earlier name ... Superseded by Category\") and links design v6.1. Latest wins (Rule 32): cases follow PRD v1.0. Not asked: the PRD itself records the rename."),
 "SV-11758": ("DIFFERS (older wording)", "Summary says \"The No-Charge Work Orders setting\"; PRD v1.0 S1-R1 names the toggle \"Internal Work Orders\". Everything else matches Story 1. Cases follow PRD v1.0."),
 "SV-11759": ("DIFFERS (older wording)", "Summary says \"the No charge checkbox with its Reason\" and \"Convert to no charge, Convert to billable and Change reason\"; PRD v1.0 S2-R2, S2-R5, S2-R6: \"No Charge\" checkbox with Category, \"Convert to No Charge\", \"Convert to Billable\", \"Change category\" (Title Case). Cases follow PRD v1.0."),
 "SV-11760": ("SAME", "Summary matches Story 3."),
 "SV-11761": ("SAME", "Summary matches Story 4."),
 "SV-11762": ("DIFFERS (superseded design)", "Summary says \"Two rows ... Internal Work Orders Expense and No-Charge Work Orders Expense\"; PRD v1.0 S5-R1: one row per category (Terminology: \"Replaces the two fixed rows Internal Work Orders Expense and Customer No-Charge Expense of v0.17\"). Cases follow PRD v1.0."),
 "SV-11763": ("DIFFERS (superseded design)", "Summary says \"Two mapping keys ... with seeded defaults\"; PRD v1.0 S6-R1/S6-R2: one row per category with the starting mappings 6500, 6430, 6440. Cases follow PRD v1.0."),
 "SV-11764": ("SAME", "Summary matches Story 7."),
 "SV-11765": ("SAME", "Summary matches Story 8."),
 "SV-11766": ("DIFFERS (older wording)", "Summary says \"the new No-Charge Work Orders report with its Reason filter, and the invoice export option with the Classification and Reason columns\"; PRD v1.0 S9-R2/S9-R6: \"Internal Work Orders\" report with a Category filter; export columns Classification and Category. Cases follow PRD v1.0."),
 "SV-11767": ("SAME", "Summary matches Story 10."),
 "SV-11833": ("DIFFERS (older wording)", "Summary says \"a read-only classification and reason\"; PRD v1.0 S11-R1: classification and category. Cases follow PRD v1.0. Both say Story 11 is built after the Open API refactoring: its cases open with a BLOCKED ON RELEASE line."),
 "SV-12226": ("SAME", "Summary matches Story 12."),
 "SV-12295": ("DIFFERS (resolved since)", "Summary says \"Comeback Expense at the number the hub owner confirms\"; PRD v1.0 S6-R2 and S13 prerequisites: 6440 Comeback Expense, confirmed 9 Nov 2026. Cases use 6440."),
 "SV-12296": ("SAME", "Summary matches the portal requirements it lists (S2-R11, S2-E6, S1-R11, S3-R4, S12-R4, S12-R7); it notes design frame 7b is being redrawn (the text wins)."),
}
VERIFY = {
 "SV-11973": (["REL-04", "REL-05", "INV-01", "S9-01", "S9-02", "S9-03", "S9-04"], "Developer check-list for the foundation (schema, shared predicates, invoice-create extraction). Tester-visible parts: rule zero (REL-04) and nothing visible while the release switch is off (REL-05). The migration diff and the extraction are code checks with no screen."),
 "SV-11974": (["S1-*", "S10-04"], "Covers Story 1 and S10-R1: every Story 1 case."),
 "SV-11975": (["S2-*", "S10-*"], "Covers Story 2 and Story 10. Its item 5 adds \"the server refuses Change Customer without 'Work Orders — Create & Edit'\": a server refusal with no screen, listed with S1-82 in NO-MANUAL-PROPOSAL.md (PM-R1)."),
 "SV-11976": (["S3-*", "S4-*", "S3-48", "API-02"], "Covers Stories 3 and 4. Its item 7 says the asset's Invoices tab lists the closed record \"at $0.00\" where PRD v1.0 S3-R6/S9-R10 say Total balance \"No Charge\": asked (question 4), S3-34 held. Its item 5 (a refused Close leaves the work order where it was, not Complete) is quoted by S3-48."),
 "SV-11977": (["S5-*", "S7-*", "S12-33"], "Covers Stories 5 and 7. Its item 7 adds that the void of an Issue Credit restock posts the reverse; S12-33 quotes the item, the void itself has no PRD sentence and is left for the tech plan round."),
 "SV-11978": (["S6-*", "S8-*"], "Covers Story 6 and the hub side of Story 8. Its item 3 adds the Dismissed reason wording (\"Withdrawn: vendor bill [number] amended\" or \"… voided\"), quoted by S8-09."),
 "SV-11979": (["S8-*", "S3-41", "S13-04"], "Core accounting emission and the accounting UI port. Tester-visible parts are the Accounting pages (Story 8 cases) and the AccountingHub notes in the Close confirmation (S3-41). The contract package versions are a code check with no screen."),
 "SV-11980": (["S9-*", "DATA-*"], "Covers Story 9: every Story 9 case and the number parity cases."),
 "SV-11981": (["REL-*", "S13-*"], "Release run and launch: the release-day cases (production) and the new-organization cases. The run order and the operator command are engineering steps (S13-06, NO-MANUAL)."),
 "SV-12297": (["REL-04"], "Rule zero before and after: REL-04 (production, figures kept before the release)."),
 "SV-12420": (["S1-45", "S1-46", "S1-47", "S1-50", "S1-51", "S1-53", "S1-54", "S1-56", "S1-59", "S1-64", "S5-01", "S13-01", "S13-03"], "Categories page, QuickBooks rows, seeding."),
 "SV-12421": (["S12-*"], "Covers Story 12 core. Item 3 says Mark as No Charge on an invoiced work order is \"disabled with 'Reverse the invoice first.'\", PRD S12-N3 says the menu offers neither action and the tooltip reads the same words: S12-26 checks both. Item 6's server refusal of a restocking fee has no screen."),
 "SV-12422": (["S12P-*"], "Covers the portal. Its item 6 (a portal deposit refused after checkout is recorded with its own reason and can be refunded) has no PRD v1.0 sentence: left for the tech plan round, no case yet."),
}


def expand(keys):
    out = []
    for k in keys:
        if k.endswith("-*"): out += [c["key"] for c in L.CASES if c["sec"] == k[:-2]]
        else: out.append(k)
    return sorted(dict.fromkeys(out))


# ---- TICKET-LEDGER.json and TICKET-SWEEP.json -----------------------------------------------------------------------------------
led = {}
for i in JIRA:
    k, f = i["key"], i["fields"]
    if k in VERIFY:
        cs, note = VERIFY[k]; outcome = "COVERED"; cases = expand(cs)
    else:
        cases = sorted(c["key"] for c in L.CASES if k in PROP[c["key"]]["refs"].split(","))
        verdict, diff = STORY_DIFF.get(k, ("", ""))
        outcome = "NEW-CASES"
        note = f"Story text compared with PRD v1.0: {verdict}. {diff} Case links go on the ticket only after the cases exist in TestRail (Rule 128), with the QA lead's go-ahead."
        if k == "SV-11665": cases = [f"every case in authoring/proposals.json ({len(L.CASES)})"]
    led[k] = {"updated": f["updated"], "summary": f["summary"], "type": f["issuetype"]["name"], "outcome": outcome, "cases": cases, "note": note}
json.dump(led, open(f"{P}/TICKET-LEDGER.json", "w"), indent=1, ensure_ascii=False)
stories = [i["key"] for i in JIRA if i["fields"]["issuetype"]["name"] == "Story"]
json.dump({"project": "Internal Work Orders", "epic": L.EPIC, "stories": stories, "prd_page": "942243841", "prd_version_handled": "1.0",
           "jira_saved": "sources/jira-sweep-full-2026-11-12.json (JQL key = SV-11665 OR parent in (SV-11665 and its 14 stories), 28 tickets, read 12 Nov 2026)",
           "checked": "2026-11-12 (PRD Final v1.0, last modified 10 Nov 2026; the Confluence page-version integer was not saved at intake, so a later sweep compares the in-body version 1.0 and the last-modified date; Jira SV-11973 names the tech plan's base as \"PRD v1.0 (page version 39, final for build)\")"},
          open(f"{P}/TICKET-SWEEP.json", "w"), indent=1, ensure_ascii=False)

# ---- NO-MANUAL-PROPOSAL.md -------------------------------------------------------------------------------------------------------
R = ["# Internal Work Orders — cases a manual tester cannot set up (proposal)", "",
     "The QA lead's standing decision (Bill To, 10 Nov 2026): *\"If a tester can not set it up then they should not be in testrail.\"* "
     f"These {len(NOMAN)} cases are kept in the case library (`authoring/`, marker `AUTOMATION: HOLD - a tester cannot set this up ...`) so the "
     "PRD item stays covered and visible, and `create.py` leaves them out of TestRail. Proposed: hand them to the developers' own checks "
     "(each verify ticket of epic SV-11665 lists the same behaviours), and decide again when a build exists.", "",
     "| Case | Title | PRD items | Why a tester cannot set it up |", "|---|---|---|---|"]
for c in NOMAN:
    R.append(f"| {c['key']} | {c['title']} | {', '.join(sorted(L.codes_of(c)))} | {c['marker'].split(': ', 2)[-1]} |")
R += ["", "Also not written as cases (no screen): the server's 403 refusal of each permission-matrix write (PM-R1, case S1-82 stands for all of them), "
      "the idempotency key (S7-R6, S7-E1: S7-34), a replay of hub history (S8-R5, S8-E1: S8-27), the app's own invoice list request (S3-R6: API-24), "
      "and the migration and operator-command reruns (S13-R4, S13-N1: S13-06).", "",
      "## OUTSTANDING — what I need from you", "",
      "- (Recommended) Confirm these stay out of TestRail, as for Bill To: they need a developer to make something fail, a slowed connection, or a request outside the screens. If you want them in TestRail anyway, they go in as held cases in their story folders."]
open(f"{P}/NO-MANUAL-PROPOSAL.md", "w").write("\n".join(R) + "\n")

# ---- PO-QUESTIONS-DRAFT.md --------------------------------------------------------------------------------------------------------
Q = ["# Internal Work Orders — questions for Milos Vasic (draft, not sent)", "",
     "Hello sir, a few points in the Internal Work Orders PRD (Final v1.0, 9 Nov 2026) where two of its own sentences, or the PRD and a "
     "developers' check-list, say different things, or where it does not say what a screen should show. Each one decides whether a test "
     "passes, so the matching test waits for your answer; everything else about the same screens is already written and ready. Pick (a), "
     "(b) or (c); (a) is my suggestion each time.", "",
     "Skill 07 §6 was applied before each row was kept: every question decides a verdict (a case is held on it), every saved source was "
     "checked first (PRD v1.0 read in full, all 28 Jira tickets of the epic read in full), and the parts a tester can run without the answer "
     "are written as runnable cases. The colour-coded Google Sheet is built from this draft by the coordinator (no Google write by this worker).", ""]
for i, (slug, q, basis, opts, held) in enumerate(QUESTIONS, 1):
    Q += [f"## {i}. {q}", "", f"**Project:** Internal Work Orders · **Feature:** {q.split(':')[0]}", "", f"**What the PRD says now:** {basis}", "",
          "**Options:**"] + [f"- {o}" for o in opts] + ["", "**Your answer:** ", ""]
Q += ["## QA-only tab: question → held cases (not shown to the PO)", "", "| # | Slug | Held cases | Folder |", "|---|---|---|---|"]
for i, (slug, *_r) in enumerate(QUESTIONS, 1):
    hk = [c["key"] for c in L.CASES if L.qnum(c) == i]
    Q.append(f"| {i} | {slug} | {', '.join(hk)} | {', '.join(sorted({PROP[k]['sec'] for k in hk}))} |")
Q += ["", "## QA-only: points considered and not asked (a saved source answers them; not shown to the PO)", ""]
DROP = DROPPED + [
 ("The Jira stories still use the old names (\"No-Charge Work Orders\" setting and report, \"Reason\", two fixed QuickBooks rows, two hub keys)",
  "PRD v1.0 is the latest source and records each rename itself (Terminology: Reason → Category; Category expense account replaces the two fixed rows of v0.17); every Jira story says \"Requirements ... live in the spec\". Cases follow PRD v1.0; listed in REPORT.md."),
 ("§8 Close confirmation row writes \"This completes the work order, posts ...\"",
  "An abbreviation of S3-R2's full sentence, which the cases quote; no difference in meaning."),
 ("S12-N3 (\"the line menu offers neither ... the tooltip reads\") vs SV-12421 (\"disabled with 'Reverse the invoice first.'\")",
  "Same words and same outcome: S12-26 checks that neither action can be used and that the tooltip reads \"Reverse the invoice first.\""),
 ("SV-12295 \"Comeback Expense at the number the hub owner confirms\"", "PRD v1.0 S6-R2: 6440 Comeback Expense, confirmed 2026-11-09."),
]
for a, b in DROP: Q += [f"- **{a}** — {b}"]
open(f"{P}/PO-QUESTIONS-DRAFT.md", "w").write("\n".join(Q) + "\n")

# ---- REPORT.md ------------------------------------------------------------------------------------------------------------------
used = Counter(x for c in L.CASES for x in L.codes_of(c))
fold = Counter(PROP[k]["sec"] for k in PROP)
held = Counter(re.sub(r"\(question \d+\)", "(question n)", c["marker"]) for c in L.CASES if c["held"])
to_tr = [k for k in PROP if not PROP[k]["automation"].startswith("AUTOMATION: HOLD - a tester cannot set this up")]
R = ["# Internal Work Orders — round 1 report (PRD and Jira), 12 Nov 2026", "",
     "Worker: PRD cases (round 1). No writes to TestRail, Jira, Slack or Google; no commits. Design and tech plan rounds run in parallel "
     "(`design-2026-11-12/`, `tech-plan-2026-11-12/`, not touched); round 2 fills `authoring/design_refs.py` and adds their cases.", "",
     "## Counts", "",
     f"- **{len(L.CASES)} cases** in the library; **{len(to_tr)} for TestRail** (section 136701); **{len(NOMAN)} kept out** (a tester cannot set them up: NO-MANUAL-PROPOSAL.md).",
     f"- By story section: " + ", ".join(f"{s} {n}" for s, n in Counter(c['sec'] for c in L.CASES).items()) + ".",
     f"- By TestRail folder (build.py FOLDER): " + ", ".join(f"{SECS[s]['name']} {n}" for s, n in fold.items()) + ".",
     f"- Held: {sum(held.values())} — " + "; ".join(f"{n} × `{m[len('AUTOMATION: HOLD - '):]}`" for m, n in held.items()) + ".",
     f"- Runnable once a build exists (marker `Not available on Build to test Yet - Last checked 11/12/2026`, Rule 69): {sum(not c['held'] for c in L.CASES)}.", "",
     "## Coverage of PRD v1.0 (Rule 115 per-source verdict)", "",
     f"- **Requirement codes: {len(set(L.CODE) & set(used))} of {len(L.CODE)} quoted word for word by at least one case** (S1 26, S2 34, S3 17, S4 10, S5 10, S6 7, S7 17, S8 11, S9 21, S10 10, S11 9, S12 24, S13 9).",
     f"- **Named items without a code: {len(set(L.NAMED) & set(used))} of {len(L.NAMED)} quoted**, {len(L.NOT_TESTABLE)} listed as not testable with the reason "
     "(iwo_lib.NOT_TESTABLE): every Error Handling line (17), every §8 User Feedback Summary row (42; every message used word for word in a step or result, "
     "two asked because the summary and the story text differ), the Key Decisions (23), the permissions matrix rows (15) and its two rules, the "
     "Terminology (22), the Feature Overview paragraphs (10), Out of Scope (17), Goals (5), the Form factor lines (5) and the entry points.",
     "- Not testable (no screen to look at): " + "; ".join(f"{k}: {v}" for k, v in L.NOT_TESTABLE.items()), "",
     "- **Every surface (Rule 40):** Settings > Work Orders; the turn-on window; Customers list, header and mobile card; Edit Customer; Edit Asset; "
     "Administration > Service > Internal Work Orders and the category windows; New / Edit Work Order; work order detail (badge, orange card, lines, "
     "menu, Shop supplies, Notes, Audit Log); work orders list (status column, Total Price, All / Completed tabs, Status and Classification chips, "
     "mobile filter sheet), Tech View, Board, Schedule, global search, the customer's and asset's Work Orders tabs; Close / Reopen and the completion "
     "steps; the NO CHARGE document (Download, Print, Email); estimates and invoices with a no-charge line; the asset Invoices tab; reports (Sales, "
     "Sales By Customer, Sales By Representative, Advisor Analysis, Internal Work Orders, Technician Efficiency, Shop Efficiency, Technician "
     "Utilization, Timesheets, Parts Velocity, Work In Progress, Inventory Value, Sales Tax Collected, IBS Batches, A/R Aging, statements, Journal "
     "Entries, Customers Spending), the dashboard cards, Export Reports; QuickBooks Online (journal entries, invoices, QB Unexported); AccountingHub "
     "(Account Mappings, Sales > Invoices, Journal Entries, Accounting Events, Invoice list report); the customer portal and the Approval Required "
     "email; the Open API and webhooks; permissions per matrix row.",
     "- **Exact numbers (Rule 116):** known costs are seeded and the arithmetic shown: Stock parts $80.00 (2 × $40.00), Parts cost $205.00 "
     "($80.00 + $125.00), core cost shown separately ($40.00 + $30.00 = $70.00, document $40.00), Shop supplies $15.00, Convert to Billable pricing "
     "(2.0 h × $120.00 = $240.00; location rate $100.00 → $200.00), taxes and fees on billable lines only ($240.00, 5% = $12.00, total $252.00; fee "
     "10% $42.00 → $24.00), QuickBooks and AccountingHub debits and credits per entry and the Reopen reversal, report rows, totals and summary strip, "
     "By technician counts and rate (1 ÷ 4 = 25%), money reports and dashboard cards as before-plus-delta, and parity across confirmation, document, "
     "report and books (DATA-01 to DATA-07). Two rate hazards the PRD does not settle (pooled totals rate, zero completed lines) are asked "
     "(questions 6 and 7).",
     "- **What must not change (Rule 96):** INV-01 to INV-14 and REL-04/REL-05 quote every PRD \"as today\" / \"unchanged\" sentence and the Out of "
     "Scope items a tester can see (billable work orders, Reverse, part sales, deposits, shop supplies percentage, Issue Credit, the billable portal "
     "estimate, review, reports to the cent). **Honest limit:** the V1 baseline is the PRD's own \"unchanged\" sentences and the PRD-named "
     "surfaces; the product source code was not available to this worker (code column NOT AVAILABLE), so behaviours nobody documented cannot "
     "become invariants here. The tech plan round may add some.",
     "- **Jira (SV-11665, 28 tickets):** every story compared with its PRD story (below); the 13 verify tasks read and mapped to the cases "
     "that cover them (TICKET-LEDGER.json); " + str(sum(1 for c in L.CASES if any(isinstance(x, tuple) for x in c["q"]))) + " cases quote a verify task where it adds a checkable detail.",
     "- **Design and tech plan:** not used for expected results in round 1 (the brief); the design's labels were not needed beyond the PRD's own. "
     "Round 2 adds References from Design and the tech plan digest.", "",
     "## Story text (Jira) compared with PRD v1.0", "",
     "Every story ticket says \"Requirements, negative cases and edge cases live in the spec\"; its one-paragraph summary was compared with the "
     "PRD story. Latest wins (Rule 32): PRD Final v1.0 of 9 Nov 2026 (page last modified 10 Nov 2026). No real conflict needs the PO; the one real "
     "conflict found is in a verify task (question 4).", "", "| Ticket | Verdict | Difference |", "|---|---|---|"]
for k, (v, d) in STORY_DIFF.items(): R.append(f"| {k} | {v} | {d} |")
R += ["", "Verify tasks (developer check-lists) read in full; what each adds beyond the PRD:", "", "| Ticket | Cases | Note |", "|---|---|---|"]
for k, (cs, note) in VERIFY.items(): R.append(f"| {k} | {', '.join(cs)} | {note} |")
R += ["", "## Reading coverage (Rule 119)", "",
      "| Source | Size | Read |", "|---|---|---|",
      "| PRD `sources/CONFLUENCE-942243841-read-2026-11-12.md` (Confluence 942243841, Final v1.0) | 805 lines, 179,770 bytes | lines 1–805, 100% |",
      "| Jira `sources/JIRA-SV-11665-tickets-2026-11-12.md` (epic, 14 stories, 13 verify tasks; fetched today in full) | 454 lines | lines 1–454, 100% |",
      "| Rules: LESSONS-REGISTER.md; RULES-01-20 Rule 4; RULES-61-96 Rules 96, 113, 114, 115, 116, 117 (all amendments), 122, 123, 129, 130, 132–140 | — | each in full |",
      "| Skills: IDEAL-TEST-CASE-STANDARD.md; 17-REGRESSION-IMPACT-V1-TO-V2.md §0–2; 07-PO-QUESTIONS.md §2–6 | — | the sections the brief names |",
      "| Tech plan (842 KB) and design package | — | not read by this worker (other workers own them; the brief allows a grep for a label, none was needed) |", "",
      "## Checks run", "",
      f"- `python3 authoring/build.py`: 0 PROBLEM lines; proposals.json written ({len(PROP)} cases).",
      "- `python3 ../../testing-tools/tester_readiness_check.py founder-mode/internal-work-orders`: 0 hard problems. The random sample (6 cases: "
      "S2-32b, S10-01, S3-29, S2-60, S3-34, S12-29) and all 112 \"does not / never\" results were read in full. Changes made from the read: status "
      "wording (\"in status Approved\"), an unused labor rate removed from S12-29's preconditions, and visible controls added to S9-25, S9-28 and S9-31.",
      "- `python3 authoring/create.py` (dry run): plan only, nothing written; it runs the readiness check itself (Rule 138).",
      "- `python3 ../../testing-tools/ticket_sweep.py ...`: 0 unhandled tickets, PRD 1.0 handled.", "",
      "## OUTSTANDING — what I need from you", "",
      "- **Before any TestRail write (Rule 6):** create the subsections of section 136701 listed in sections.json and put their ids there; then `create.py --apply`. Recommended after round 2 (design and tech plan), so each case is written once.",
      "- **NO-MANUAL:** confirm the 18 cases stay out of TestRail (recommended, as for Bill To).",
      "- **Waiting on the PO (Rule 132):** the sheet is a draft (PO-QUESTIONS-DRAFT.md), not yet sent; questions 1–7 are unanswered. Held on them: "
      + "; ".join(f"question {i}: {', '.join(c['key'] for c in L.CASES if L.qnum(c) == i)}" for i in range(1, len(QUESTIONS) + 1)) + ".",
      "- **No QA branch is named:** every runnable case carries the Rule 69 marker until a build is checked."]
open(f"{P}/REPORT.md", "w").write("\n".join(R) + "\n")
print("written: REPORT.md, NO-MANUAL-PROPOSAL.md, PO-QUESTIONS-DRAFT.md, TICKET-LEDGER.json, TICKET-SWEEP.json")
