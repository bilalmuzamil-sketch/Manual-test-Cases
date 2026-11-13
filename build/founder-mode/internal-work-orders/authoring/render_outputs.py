#!/usr/bin/env python3
"""Writes the round-1 deliverables from the case library and proposals.json (run build.py first):
REPORT.md, NO-MANUAL-PROPOSAL.md, PO-QUESTIONS-DRAFT.md, TICKET-LEDGER.json and TICKET-SWEEP.json (Rule 129).
Reads only local files: the saved PRD, the saved Jira tickets (sources/jira-sweep-full-2026-11-12.json) and the case library."""
import sys, os, re, json, glob, importlib
from collections import Counter, defaultdict
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import iwo_lib as L
from po_questions import QUESTIONS, DROPPED, QN
_ORDER = [f"cases_s{i}" for i in range(1, 14)] + ["cases_s12p", "cases_api", "cases_data", "cases_rel", "cases_inv", "cases_design", "cases_tp"]
_MODS = sorted(os.path.basename(f)[:-3] for f in glob.glob(f"{D}/cases_*.py"))
for m in [x for x in _ORDER if x in _MODS] + [x for x in _MODS if x not in _ORDER]: importlib.import_module(m)
P = L.P
PROP = json.load(open(f"{D}/proposals.json"))
SECS = json.load(open(f"{P}/sections.json"))["sections"]
JIRA = json.load(open(f"{P}/sources/jira-sweep-full-2026-11-12.json"))["issues"]
NOMAN = [c for c in L.CASES if c["marker"].startswith("AUTOMATION: HOLD - a tester cannot set this up")]

# ---- story text (Jira) compared with the PRD v1.0 story (each Jira story says "Requirements ... live in the spec") ----------------
STORY_DIFF = {
 "SV-11665": ("DIFFERS (older wording)", "The epic summary names the setting \"No-Charge Work Orders\", a \"No charge checkbox with a reason\", a \"No-Charge Work Orders report\", and links PRD v0.16 and design v5.11. PRD v1.3 (latest, 12 Nov 2026) names the setting and the report \"Internal Work Orders\", replaces Reason by Category (Terminology: \"Reason → the earlier name ... Superseded by Category\") and links design v6.1. Latest wins (Rule 32): cases follow PRD v1.3. Not asked: the PRD itself records the rename."),
 "SV-11758": ("DIFFERS (older wording)", "Summary says \"The No-Charge Work Orders setting\"; PRD v1.3 S1-R1 names the toggle \"Internal Work Orders\". Everything else matches Story 1. Cases follow PRD v1.3."),
 "SV-11759": ("DIFFERS (older wording)", "Summary says \"the No charge checkbox with its Reason\" and \"Convert to no charge, Convert to billable and Change reason\"; PRD v1.3 S2-R2, S2-R5, S2-R6: \"No Charge\" checkbox with Category, \"Convert to No Charge\", \"Convert to Billable\", \"Change category\" (Title Case). Cases follow PRD v1.3."),
 "SV-11760": ("DIFFERS (superseded by PRD v1.2/v1.3)", "Summary says \"one confirmation with the posting date, the parts cost, the shop supplies amount and the accounts they post to\"; PRD v1.3 S3-R1/S3-R2: Close Work Order closes on one press with no confirmation, the posting date and the posting summary sit on the Finance tab, and a window opens only for a missing original work order or a vendor bill cost move. Cases follow PRD v1.3. Not asked: the PRD Status cell records the change (v1.2, SV-10312)."),
 "SV-11761": ("SAME", "Summary matches Story 4."),
 "SV-11762": ("DIFFERS (superseded design)", "Summary says \"Two rows ... Internal Work Orders Expense and No-Charge Work Orders Expense\"; PRD v1.3 S5-R1: one row per category (Terminology: \"Replaces the two fixed rows Internal Work Orders Expense and Customer No-Charge Expense of v0.17\"). Cases follow PRD v1.3."),
 "SV-11763": ("DIFFERS (superseded design)", "Summary says \"Two mapping keys ... with seeded defaults\"; PRD v1.3 S6-R1/S6-R2: one row per category with the starting mappings 6500, 6430, 6440. Cases follow PRD v1.3."),
 "SV-11764": ("SAME", "Summary matches Story 7."),
 "SV-11765": ("SAME", "Summary matches Story 8."),
 "SV-11766": ("DIFFERS (older wording)", "Summary says \"the new No-Charge Work Orders report with its Reason filter, and the invoice export option with the Classification and Reason columns\"; PRD v1.3 S9-R2/S9-R6: \"Internal Work Orders\" report with a Category filter; export columns Classification and Category. Cases follow PRD v1.3."),
 "SV-11767": ("SAME", "Summary matches Story 10."),
 "SV-11833": ("DIFFERS (older wording)", "Summary says \"a read-only classification and reason\"; PRD v1.3 S11-R1: classification and category. Cases follow PRD v1.3. Both say Story 11 is built after the Open API refactoring: its cases open with a BLOCKED ON RELEASE line."),
 "SV-12226": ("SAME", "Summary matches Story 12."),
 "SV-12295": ("DIFFERS (resolved since)", "Summary says \"Comeback Expense at the number the hub owner confirms\"; PRD v1.3 S6-R2 and S13 prerequisites: 6440 Comeback Expense, confirmed 9 Nov 2026. Cases use 6440."),
 "SV-12296": ("SAME", "Summary matches the portal requirements it lists (S2-R11, S2-E6, S1-R11, S3-R4, S12-R4, S12-R7); it notes design frame 7b is being redrawn (the text wins)."),
}
VERIFY = {
 "SV-11973": (["REL-04", "REL-05", "INV-01", "S9-01", "S9-02", "S9-03", "S9-04"], "Developer check-list for the foundation (schema, shared predicates, invoice-create extraction). Tester-visible parts: rule zero (REL-04) and nothing visible while the release switch is off (REL-05). The migration diff and the extraction are code checks with no screen."),
 "SV-11974": (["S1-*", "S10-04"], "Covers Story 1 and S10-R1: every Story 1 case."),
 "SV-11975": (["S2-*", "S10-*"], "Covers Story 2 and Story 10. Its item 5 adds \"the server refuses Change Customer without 'Work Orders — Create & Edit'\": a server refusal with no screen, listed with S1-82 in NO-MANUAL-PROPOSAL.md (PM-R1)."),
 "SV-11976": (["S3-*", "S4-*", "S3-48", "API-02"], "Covers Stories 3 and 4. Its item 7 says the asset's Invoices tab lists the closed record \"at $0.00\" where PRD v1.0 S3-R6/S9-R10 say Total balance \"No Charge\": settled by the tech plan, which builds \"No Charge\" (TP-174); S3-34 follows the PRD and is runnable. Items 1, 2 and 5 describe the Close confirmation that PRD v1.2/v1.3 removed: the posting summary is now on the Finance tab (S3-07 and the S3 summary cases), a missing original opens the one remaining window (S3-15), and the \"work order changed\" refusal applies only while a Close window is open (S3-47). Item 5's second sentence (a refused Close leaves the work order where it was, not Complete) still applies through that window: S3-48 quotes it."),
 "SV-11977": (["S5-*", "S7-*", "S12-33"], "Covers Stories 5 and 7. Its item 7 adds that the void of an Issue Credit restock posts the reverse; S12-33 quotes the item; the void has no PRD sentence and no plan statement a tester can reach, so it has no case."),
 "SV-11978": (["S6-*", "S8-*"], "Covers Story 6 and the hub side of Story 8. Its item 3 adds the Dismissed reason wording (\"Withdrawn: vendor bill [number] amended\" or \"… voided\"), quoted by S8-09."),
 "SV-11979": (["S8-*", "S3-41", "S13-04"], "Core accounting emission and the accounting UI port. Tester-visible parts are the Accounting pages (Story 8 cases) and the AccountingHub notes in the Finance tab posting summary (S3-41; its item 6 still says \"Close confirmation\", which PRD v1.3 removed). The contract package versions are a code check with no screen."),
 "SV-11980": (["S9-*", "DATA-*"], "Covers Story 9: every Story 9 case and the number parity cases."),
 "SV-11981": (["REL-*", "S13-*"], "Release run and launch: the release-day cases (production) and the new-organization cases. The run order and the operator command are engineering steps (S13-06, NO-MANUAL)."),
 "SV-12297": (["REL-04"], "Rule zero before and after: REL-04 (production, figures kept before the release)."),
 "SV-12420": (["S1-45", "S1-46", "S1-47", "S1-50", "S1-51", "S1-53", "S1-54", "S1-56", "S1-59", "S1-64", "S5-01", "S13-01", "S13-03"], "Categories page, QuickBooks rows, seeding."),
 "SV-12421": (["S12-*"], "Covers Story 12 core. Item 3 says Mark as No Charge on an invoiced work order is \"disabled with 'Reverse the invoice first.'\", PRD S12-N3 says the menu offers neither action and the tooltip reads the same words: S12-26 checks both. Item 6's server refusal of a restocking fee has no screen."),
 "SV-12422": (["S12P-*"], "Covers the portal. Its item 6 (a portal deposit refused after checkout is recorded with its own reason and can be refunded) had no PRD v1.0 sentence and is PRD v1.1 S2-E8 (Milos Vasic's answer 7, unchanged in v1.3); the tech plan gives its message (TP-668) and the race behind it is asked: S12P-11, held on question 7."),
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
        note = f"Story text compared with PRD v1.3: {verdict}. {diff} Case links go on the ticket only after the cases exist in TestRail (Rule 128), with the QA lead's go-ahead."
        if k == "SV-11665": cases = [f"every case in authoring/proposals.json ({len(L.CASES)})"]
    led[k] = {"updated": f["updated"], "summary": f["summary"], "type": f["issuetype"]["name"], "outcome": outcome, "cases": cases, "note": note}
json.dump(led, open(f"{P}/TICKET-LEDGER.json", "w"), indent=1, ensure_ascii=False)
stories = [i["key"] for i in JIRA if i["fields"]["issuetype"]["name"] == "Story"]
json.dump({"project": "Internal Work Orders", "epic": L.EPIC, "stories": stories, "prd_page": "942243841", "prd_version_handled": "1.3",
           "jira_saved": "sources/jira-sweep-full-2026-11-12.json (JQL key = SV-11665 OR parent in (SV-11665 and its 14 stories), 28 tickets, read 12 Nov 2026)",
           "checked": "2026-11-13, round 4: PRD v1.3 (12 Nov 2026, Status cell \"v1.3 (2026-11-12): the Settings tab keeps one hint line (S1-R3) ...\"), saved as sources/CONFLUENCE-942243841-v1.3-read-2026-11-12.md and diffed against v1.1 (po-answers-2026-11-12/PRD-DIFF-v1.1-to-v1.3.txt); round 3: PRD v1.1 (12 Nov 2026, Status cell \"v1.1 (2026-11-12): QA questions 1 to 16 answered in the text\"), saved as sources/CONFLUENCE-942243841-v1.1-read-2026-11-12.md and diffed against v1.0; earlier: (PRD Final v1.0, last modified 10 Nov 2026; the Confluence page-version integer was not saved at intake, so a later sweep compares the in-body version 1.0 and the last-modified date; Jira SV-11973 names the tech plan's base as \"PRD v1.0 (page version 39, final for build)\")"},
          open(f"{P}/TICKET-SWEEP.json", "w"), indent=1, ensure_ascii=False)

# ---- NO-MANUAL-PROPOSAL.md -------------------------------------------------------------------------------------------------------
R = ["# Internal Work Orders — cases a manual tester cannot set up (proposal)", "",
     "The QA lead's standing decision (Bill To, 10 Nov 2026): *\"If a tester can not set it up then they should not be in testrail.\"* "
     f"These {len(NOMAN)} cases are kept in the case library (`authoring/`, marker `AUTOMATION: HOLD - a tester cannot set this up ...`) so the "
     "PRD item stays covered and visible, and `create.py` leaves them out of TestRail. Proposed: hand them to the developers' own checks "
     "(each verify ticket of epic SV-11665 lists the same behaviours), and decide again when a build exists.", "",
     "Round 3 (12 Nov 2026): S2-90 [C1112004](https://shopview.testrail.io/index.php?/cases/view/1112004) and S8-26 [C1112153](https://shopview.testrail.io/index.php?/cases/view/1112153) joined this list because PRD v1.1 makes them impossible to set up by hand. Round 4 (13 Nov 2026): the QA lead approved deleting both from TestRail (\"Delete both (Recommended)\"); `po-answers-2026-11-12/write/delete_approved.py` deletes them with D-87, D-89 and D-91. They stay in the case library with their reason.", "",
     "| Case | Title | PRD items | Why a tester cannot set it up |", "|---|---|---|---|"]
for c in NOMAN:
    R.append(f"| {c['key']} | {c['title']} | {', '.join(sorted(L.codes_of(c)))} | {c['marker'].split(': ', 2)[-1]} |")
R += ["", "Also not written as cases (no screen): the server's 403 refusal of each permission-matrix write (PM-R1, case S1-82 stands for all of them), "
      "the idempotency key (S7-R6, S7-E1: S7-34), a replay of hub history (S8-R5, S8-E1: S8-27), the app's own invoice list request (S3-R6: API-24), "
      "and the migration and operator-command reruns (S13-R4, S13-N1: S13-06).", "",
      "## OUTSTANDING — what I need from you", "",
      "- (Recommended) Confirm these stay out of TestRail, as for Bill To: they need a developer to make something fail, a slowed connection, or a request outside the screens. If you want them in TestRail anyway, they go in as held cases in their story folders."]
open(f"{P}/NO-MANUAL-PROPOSAL.md", "w").write("\n".join(R) + "\n")

# ---- PO-QUESTIONS-DRAFT.md (round 2a: our questions merged with the tech plan worker's, one numbering) ----------------------------
import cases_tp
from po_questions import ANSWERED
Q = ["# Internal Work Orders — questions for Milos Vasic (sent; all 16 answered on 12 Nov 2026, all option (a))", "",
     "Answers read from the question sheet (column E) on 12 Nov 2026 and saved in `po-answers-2026-11-12/ANSWERS-Milos-Vasic-2026-11-12.json`; PRD v1.1 carries them (question 10: the Open API owner's confirmation is still pending). The rows below are the sheet as sent, with his answer in \"Your answer\".", "",
     "Hello sir,", "",
     "While we were writing the tests for Internal Work Orders against the final PRD (v1.0, 9 Nov 2026), the developers' plan and the design "
     "\"Internal Work Orders · All flows v6\", a few points came up where the PRD says two different things, where the plan or the design shows "
     "something a little different, or where nothing says what the screen should show. Each one decides whether a test passes, so that test waits for your answer; everything else on the same screens is "
     "written and ready. Each has a suggested answer, so a one-letter reply is plenty.", "",
     "| # | Topic | Question | What happens now | Options | Your answer | Where we found it |", "|---|---|---|---|---|---|---|"]
for i, (slug, topic, q, now, opts, held, where) in enumerate(QUESTIONS, 1):
    cell = lambda x: x.replace("|", "/").replace("\n", " ")
    Q.append(f"| {i} | {cell(topic)} | {cell(q)} | {cell(now)} | {'<br>'.join(cell(o) for o in opts)} | {cell(ANSWERED.get(i, ''))} | {cell(where)} |")
Q += ["", f"Questions 12 to {len(QUESTIONS)} come from reading the design (12 Nov 2026); on the Google Sheet they are the batch \"Questions from "
      "reading the design (12 Nov 2026)\" in their own colour, added to the colour guide with that date (Rule 131).", "",
      "Skill 07 §6 was applied before each row was kept: every question decides a verdict (a held case), every saved source was checked "
      "first (PRD v1.0, all 28 Jira tickets of the epic, the tech plan worker's full reading of the plan, and the design worker's full drive of the design), and the parts a tester can run "
      "without the answer are written as runnable cases. The colour-coded Google Sheet is built from this draft by the coordinator (no Google "
      "write by this worker).", "",
      "## QA-only tab: question → held cases (not shown to the PO)", "", "| # | Slug | Held cases | Folder | Came from |", "|---|---|---|---|---|"]
ORIGIN = {"modal-text": "PRD worker Q1", "no-charge-document-case": "PRD worker Q2", "internal-estimate-stamp": "PRD worker Q3; also the design's IWO-D19",
          "rows-per-move": "tech plan worker Q1 (DIVERGE D-1)", "closed-chip": "tech plan worker Q2 (DIVERGE D-2)", "import": "tech plan worker Q4 (DIVERGE D-4)",
          "portal-deposit": "tech plan worker Q5", "hub-inactive-account": "tech plan worker Q6", "line-marks-after-convert": "tech plan worker Q7",
          "work-order-updated": "PRD worker Q5", "rate-zero": "PRD worker Q7",
          "category-helper": "design worker Q8 (register IWO-D09)", "locked-note": "design worker Q9 (IWO-D29)", "reopen-message": "design worker Q10 (IWO-D31)",
          "report-empty-cell": "design worker Q11 (IWO-D44)", "report-wrapping": "design worker Q12 (IWO-D45)"}
for i, (slug, *_r) in enumerate(QUESTIONS, 1):
    hk = [c["key"] for c in L.CASES if L.qnum(c) == i]
    Q.append(f"| {i} | {slug} | {', '.join(hk)} | {', '.join(sorted({PROP[k]['sec'] for k in hk}))} | {ORIGIN.get(slug, '')} |")
Q += ["", "## QA-only: points considered and not asked (a saved source settles them, or no runnable case depends on them)", ""]
for a, b in DROPPED: Q += [f"- **{a}** — {b}"]
open(f"{P}/PO-QUESTIONS-DRAFT.md", "w").write("\n".join(Q) + "\n")

# ---- REPORT.md ------------------------------------------------------------------------------------------------------------------
used = Counter(x for c in L.CASES for x in L.codes_of(c))
tp_used = Counter(x for c in L.CASES for x in L.tps_of(c))
fold = Counter(PROP[k]["sec"] for k in PROP)
held = Counter(re.sub(r"\(question \d+\)", "(question n)", c["marker"]) for c in L.CASES if c["held"])
to_tr = [k for k in PROP if not PROP[k]["automation"].startswith("AUTOMATION: HOLD - a tester cannot set this up")]
TPV = Counter(v["verdict"] for v in L.TP.values())
ADD_Q = sorted(k for k in tp_used if L.TP[k]["verdict"] == "ADD")
CONF_Q = sorted(k for k in tp_used if L.TP[k]["verdict"] == "CONFIRM")
NEWKEYS = [c["key"] for c in L.CASES][[c["key"] for c in L.CASES].index("S1-83"):]
INV_MAP = [("1.1 Create invoice on billable work orders from every place", "INV-01, INV-19, S3-01"), ("1.2 Create invoice refusal messages", "REL-07"),
 ("1.3 Completion wizard on billable work orders", "INV-20"), ("1.4 Credit hold still blocks Create invoice", "S3-43"), ("1.5 Header status labels", "INV-15"),
 ("1.6 Billable work order menu", "INV-21"), ("1.7 Change Customer on billable work orders", "INV-22"), ("1.8 Reverse", "INV-02"),
 ("1.9 A line added to an invoiced billable work order", "INV-23"), ("1.10 Split and move-part on billable work", "INV-24"),
 ("1.11 Auto-apply fees and the default discount", "INV-25"), ("1.12 Receiving on billable work", "INV-26"), ("1.13 Billable shop supplies; Min alone inert", "INV-11, INV-18"),
 ("1.14 Pick, receive, clock-in, approval on internal work", "INV-04"), ("1.15 A billable invoice with no mark is identical", "INV-01, INV-08, INV-30"),
 ("1.16 Issue Credit on billable parts", "INV-12"), ("1.17 Ordinary notes", "INV-27"), ("1.18 Invoiced / Paid filters, Completed tab", "INV-28"),
 ("1.19 Today's $0 invoices stay billable, with their webhooks", "REL-04, S12-20, API-26"), ("2.1 Part sales", "INV-03, INV-15"),
 ("3.1 New Customer and New Asset", "INV-29, S1-16"), ("3.2 Other Work Orders toggles", "INV-16"), ("3.3 Release day flags nobody", "REL-01"),
 ("3.4 Existing warranty flags kept", "API-27"), ("3.5 Nothing visible before the release switch", "REL-05 (after launch the switch is gone; the before-launch state is not on a build a tester gets)"),
 ("3.6 Administration sections", "INV-17, S1-84"), ("4.1-4.3 Rule zero, every billable figure", "REL-04, S9-01 to S9-07"),
 ("4.4 Customers Spending for billable work", "REL-04, S9-41"), ("4.5 Customer Invoice export with the option off", "S9-34"),
 ("4.6 Inventory Value, Work In Progress, A/P", "INV-09, S9-39"), ("4.7 A no-charge line adds no tax and nothing owed", "S9-46"),
 ("4.8 Asset Invoices tab columns", "S3-34"), ("5.1 QuickBooks sync of billable work", "INV-30, S7-19"), ("5.2 QB Unexported type of billable entries", "INV-31"),
 ("5.3 ShopView Accounts rows keep their place", "S5-01"), ("5.4 A location without QuickBooks", "S7-35"), ("6.1, 6.3 Billable invoices and bills in the hub", "INV-32"),
 ("6.2 $0 invoices and replays in the hub", "S8-27 (NO-MANUAL: a replay is run by the hub team)"), ("6.4 Hub Invoice List default", "S8-13"),
 ("6.5 Hub sales tax reports", "INV-33"), ("6.6 Existing hub pills (a Held deposit stays blue), static mapping rows", "Left out: no source says how a tester produces a Held deposit in the hub; the static rows are covered by S6-01's unchanged Shop supplies row"),
 ("6.7 No AccountingHub", "S6-06"), ("7.1 Billable portal estimates and approvals", "INV-13"), ("7.2 Portal payments and reminders", "INV-34 (payments; the overdue reminders run on a schedule a tester cannot trigger)"),
 ("7.3 Billable invoice webhooks and the portal's new invoice email", "API-26, INV-35"), ("8.1 Billable invoices in the Open API lists and webhooks", "API-05, API-26"),
 ("8.2 No Open API V1", "API-20")]
import design_refs as DR
DCH = json.load(open(f"{D}/design_changes.json"))
DES = [c for c in L.CASES if c["sec"] == "DESIGN"]
PRD_REFS = [c for c in L.CASES if c["sec"] != "DESIGN" and L.design_for(c)]
ALLPICS = {x for c in L.CASES if L.design_for(c) for x in L.design_for(c)["pictures"]}
REGROWS = json.load(open(f"{P}/DESIGN-DIVERGENCE-REGISTER.json"))["differences"]
S2DV = Counter(r["verdict"] for r in DR.S2D.values())
import cases_zbaseline as ZB
from tp_quote_fix import TPFIX
import cases_zz_v11 as V11, csv as _csv
_IDS = {r['key']: r['case_id'] for r in _csv.DictReader(open(f'{P}/testrail-id-map.csv'))}
_PLAN = json.load(open(f"{P}/po-answers-2026-11-12/write/plan.json")) if os.path.exists(f"{P}/po-answers-2026-11-12/write/plan.json") else {}
import cases_zzz_v13 as Z13
_REG = json.load(open(f"{P}/DESIGN-DIVERGENCE-REGISTER.json"))
R = ["# Internal Work Orders — report, rounds 1 to 4 (PRD v1.3, Jira, tech plan, design 1794510020-d4ec; Milos Vasic's answers), 13 Nov 2026", "",
     "## Round 4 (13 Nov 2026): PRD v1.3, design 1794510020-d4ec and the full-read fixes", "",
     "- Every case now quotes **PRD v1.3** (From line \"version 1.3 (12 Nov 2026, Milos Vasic)\") and names design version 1794510020-d4ec. "
     "v1.3 (with v1.2): Close Work Order closes on one press with no confirmation; the posting date, the posting summary and the closing sentence "
     "sit on the Finance tab; a window opens only for a missing original work order or a vendor bill cost move; the \"work order changed\" "
     "refusal applies only while that window is open; the Settings tab keeps one hint line. §8 has 45 rows (16-18 new, 17-43 became 19-45).",
     f"- Per case, part by part: `po-answers-2026-11-12/PASS-REPORT.md` (the round 3 report kept as `PASS-REPORT-round3-v1.1.md`). Round 3 was never "
     f"written, so the updates carry both rounds: {len(_PLAN.get('update', []))} updates, {len(_PLAN.get('move', []))} moves, new cases "
     f"{', '.join(_PLAN.get('create', []))}; deletions on the QA lead's go-ahead: {', '.join(d['key'] for d in _PLAN.get('delete', []))}; "
     f"proposed for deletion: {', '.join(d['key'] for d in _PLAN.get('proposed_delete', [])) or 'none'}; run 559 gets {', '.join(_PLAN.get('run_add', []))}.",
     "- The full read's fixes are in: S1-71 rewritten (the S1-R7 helper) and all 51 runnability fixes (`full-read/fix-list.json`).",
     f"- `check_v13_text.py`: every PRD quote of every case is word for word in v1.3, and no tester text names what v1.3 removed (the Close "
     "confirmation, the second hint line, the old confirmation sentence).",
     "- Not retired after all: S3-48. Its source (Jira SV-11976 item 5: a refused Close leaves the work order where it was, not Complete) still "
     "applies through the original work order window; it is rewritten to that path.",
     f"- Register ({_REG['counts']['differences']} differences, {_REG['counts']['not_shown']} design-silent): IWO-D02, D20, D21 closed; D22, D23 "
     "narrowed; N05, N25 reworded; D57-D61 added with the coordinator's verdicts (D57 closed by check (c): runnable design case D-93 written from board 7e); D62 added by the case "
     "worker: Happy flow board \"28 Close confirmation\" was not redrawn and still draws the removed confirmation (check a and d; dropped from "
     "D-60's references); N42-N44 added (design-silent). **No question.**",
     "- Folder note (Rule 140) to be re-stamped 11/13/2026: `write/folder_note.py` (locked on today's live text).", "",
     "## Round 3 (12 Nov 2026, superseded by round 4 where they differ): PRD v1.1 and Milos Vasic's answers 1-16", "",
     "- Every case now quotes **PRD v1.1** (From line \"version 1.1 (12 Nov 2026, Milos Vasic)\"); v1.1 changed 15 requirements and message "
     "rows, added S2-E8 and the message row \"Reopen done\" (rows 25-42 became 26-43). Milos's answers are quoted only where v1.1 does not "
     "carry them: question 10 (API-23).",
     f"- Per case, part by part: `po-answers-2026-11-12/PASS-REPORT.md`. Updates to send: {len(_PLAN.get('update', []))}; new cases: "
     f"{', '.join(_PLAN.get('create', []))}; deleted on the QA lead's go-ahead: D-87, D-89, D-91; proposed for deletion: "
     f"{', '.join(V11.PROPOSED_DELETE)}; released into run 559: {', '.join(_PLAN.get('run_add', []))}.",
     "- Held cases: none waits on the PO any more. API-23 is released from question 10 but stays blocked on the Open API release (the Open "
     "API owner's confirmation is still pending, Milos: \"test against (a)\").",
     "- Register: IWO-D09, D19, D29, D44, D45 settled by PRD v1.1, D31 closed (the design matches), IWO-D56 added (design worker's assessment); "
     "0 design questions open. Skill 07 §6.0 applied: **no new question**.",
     "- Write scripts (dry run by default): `po-answers-2026-11-12/write/` — update (locked on the live text), create the new cases, delete "
     "the 3, sync run 559 (union only).", "",
     "Worker: PRD cases (round 1), the tech plan fold-in (round 2a) and the design fold-in (round 2b), each on the coordinator's order. No "
     "writes to TestRail, Jira, Slack or Google; no commits.", "",
     "## Counts", "",
     f"- **{len(L.CASES)} cases** in the library; **{len(to_tr)} for TestRail** (section 136701); **{len(NOMAN)} kept out** (a tester cannot set them up: NO-MANUAL-PROPOSAL.md).",
     f"- Round 2a added {len(NEWKEYS)} cases ({', '.join(NEWKEYS)}) and changed {len(cases_tp.TP_CHANGES)} existing cases (listed below, Rule 134).",
     "- By story section: " + ", ".join(f"{s} {n}" for s, n in Counter(c['sec'] for c in L.CASES).items()) + ".",
     "- By TestRail folder (build.py FOLDER): " + ", ".join(f"{SECS[s]['name']} {n}" for s, n in fold.items()) + ".",
     f"- Held: {sum(held.values())} — " + "; ".join(f"{n} × `{m[len('AUTOMATION: HOLD - '):]}`" for m, n in held.items()) + ".",
     f"- Runnable once a build exists (marker `Not available on Build to test Yet - Last checked 11/12/2026`, Rule 69): {sum(not c['held'] for c in L.CASES)}.", "",
     "## Coverage per source (Rule 115)", "",
     "| Source | Verdict | What |", "|---|---|---|",
     f"| PRD v1.0 (Confluence 942243841) | ✓ | {len(set(L.CODE) & set(used))} of {len(L.CODE)} requirement codes quoted word for word; {len(set(L.NAMED) & set(used))} of {len(L.NAMED)} named items quoted (error handling, all 42 message rows, key decisions, permission rows and rules, terminology, overview, out of scope, goals, form factor), {len(L.NOT_TESTABLE)} not testable with the reason |",
     f"| Jira, epic SV-11665 (28 tickets) | ✓ | every story compared with its PRD story; 13 verify tasks mapped to their cases; {sum(1 for c in L.CASES if any(isinstance(x, tuple) for x in c['q']))} cases quote a ticket; ticket_sweep 0 unhandled |",
     f"| Tech plan rev. 5 (2026-11-10), via TECH-PLAN-TESTABLE.json ({TPV['CONFIRM']} CONFIRM, {TPV['ADD']} ADD, {TPV['DIVERGE']} DIVERGE) | ✓ | {len(ADD_Q)} of {TPV['ADD']} ADD statements quoted by a case (new cases or result bullets), {len(cases_tp.TP_OUT)} left out with the reason (below); {len(CONF_Q)} CONFIRM statements quoted where they settle a detail the PRD leaves open; no DIVERGE statement is quoted (the PRD wins); 74 invariant rows mapped to cases (below) |",
     f"| Design \"Internal Work Orders · All flows v6\" (version 1794484794-2031), via the design worker's drive (design-2026-11-12/) | ✓ | {len(DES)} design cases in \"Design — how it looks\" (one per draft: {sum(1 for c in DES if not c['held'])} runnable look cases, {sum(1 for c in DES if 'waiting on the PO' in c['marker'])} held design-version cases, {sum(1 for c in DES if 'cannot set this up' in c['marker'])} a tester cannot set up); References from Design on every design case and on {len(PRD_REFS)} PRD cases whose screen a board draws ({len(ALLPICS)} distinct pictures, all present in images/, attached by create.py); spec-to-design table {dict(S2DV)}; register {len(REGROWS)} differences: {sum(r['outcome'].startswith('SETTLED') for r in REGROWS)} settled by a named PRD sentence, {len(DR.OPEN)} closed by a question on the sheet, 1 (IWO-D50) by a named ruling |", "",
     "- **Every surface (Rule 40):** Settings > Work Orders and the turn-on window; Customers list, header and mobile card; Edit Customer; New and "
     "Edit Asset; Administration > Service > Internal Work Orders and the category windows; New / Edit Work Order; the work order page (badge, "
     "orange card, lines, menus, Shop supplies, Finance tab, Notes, Audit Log); the work orders list, Tech View, Board, Schedule, global search, "
     "the customer's and asset's tabs; Close / Reopen and the completion steps; the NO CHARGE document in both invoice designs; estimates and "
     "invoices with a no-charge line; purchase order receiving and vendor invoices; Issue Credit; reports, the dashboard and Export Reports; "
     "QuickBooks Online and QB Unexported; AccountingHub (Account Mappings, chart of accounts, Sales > Invoices, Journal Entries, Accounting "
     "Events, sales tax and Invoice list reports); the customer portal, its approvals list, deposits, payments and emails; the Open API and webhooks; "
     "every permission matrix row.",
     "- **Exact numbers (Rule 116):** seeded costs with the arithmetic shown, before-plus-delta report figures, and parity across the confirmation, "
     "document, report and books (DATA-01 to DATA-09). The pooled totals rate (DATA-08) is now runnable: the tech plan settles it (TP-312). The rate "
     "with no completed lines is asked (question 11).",
     "- **What must not change (Rule 96):** INV-01 to INV-35 and REL-04 to REL-07, each quoting the PRD's own \"as today\" sentence (and the plan "
     "where it names the invariant). Honest limit: the baseline is what the PRD and the plan say must not change; the product code was not "
     "available to this worker, so a behaviour nobody documented cannot appear here.", "",
     "## Tech plan: invariant rows (INVARIANTS-FROM-PLAN.md) and the cases that check them", "", "| Row | Case(s) |", "|---|---|"]
R += [f"| {a} | {b} |" for a, b in INV_MAP]
R += ["", "## Design (round 2b)", "",
      f"- **Design cases:** {len(DES)} (D-01 to D-{len(DES):02d}), made by `authoring/make_cases_design.py` from the design worker's drafts "
      "(`design-2026-11-12/tools/cases_data.py`, the data of DESIGN-CASE-PLAN.md); titles start \"Design: \"; every precondition list ends with "
      "the pictures to open beside the screen; every design case quotes the PRD sentence it checks and lists the boards, pictures and the design's "
      "own words under References from Design (checked word for word against the board files and the rendered text by build.py). Held "
      "design-version cases stay in \"Design — how it looks\".",
      "- **Changes made to the drafts:** " + "; ".join(DCH["changes"]) + ".",
      f"- **PRD cases:** {len(PRD_REFS)} carry References from Design: the case's primary PRD code (the screen it is about) is SHOWN or DIFFERENT "
      "on a board; boards come from the spec-to-design table's own board names, then the design cases that quote the same code (at most 4 "
      "pictures); a difference on any quoted code adds a note naming its register row and how it is closed. API cases and cases whose screen no "
      "board draws carry no heading.",
      "", "| Register row (open) | Closed by |", "|---|---|"]
R += [f"| {rid} | question {QN[slug]} of PO-QUESTIONS-DRAFT.md ({slug}); held: {', '.join(c['key'] for c in L.CASES if L.qnum(c) == QN[slug])} |" for rid, slug in DR.OPEN.items()]
R += ["| IWO-D50 | named ruling, no question: two reviewer remarks left in the file of Review board 1.1, below its visible area; PRD Final v1.0 is newer than the design and its header says \"Where a frame and this text disagree, the text wins\"; it already gives the toggle description (S1-R1) and the No Charge badge in its own style (S2-R3), which is what the remarks ask; no verdict depends on them |",
      "", f"The other {sum(r['outcome'].startswith('SETTLED') for r in REGROWS)} rows are settled by the PRD sentence the register names; the cases follow the PRD and name the row in their References from Design.", "",
      "## Round 2c (coordinator's review): every result has a baseline the tester can see, and no plan quote is code", "",
      f"- **{len(ZB.BASELINE_CHANGES)} cases changed** (one of them, S2-105, retired). A result that judged against \"as before\", \"as today\", "
      "\"where it was\", \"unchanged\" or \"as usual\" now names what the tester sees (most), notes the value in an earlier step of the same case "
      "(S1-44, S12-05, INV-24), compares with the same screen on production where the feature is not released yet (S1-84, INV-02, INV-15, "
      "INV-17, INV-21), or compares with what was noted before the release on production (REL-02, REL-03; PROD folder). build.py now refuses "
      "those words in any result.",
      f"- **Plan quotes:** {sum(1 for v in TPFIX.values() if v)} plan statements whose saved quote carried code or a file path are now quoted only "
      f"by the code-free behaviour wording of the same plan line; {sum(1 for v in TPFIX.values() if not v)} had none and were dropped (the cases "
      "rely on the PRD; a bullet only the code backed was removed; the ADD ones are listed under \"ADD statements left out\"). build.py refuses "
      "any plan quote that carries code.",
      "- Folders (coordinator, 12 Nov 2026): WAIT-PO \"Waiting on Milos Vasic's answers\", BLK \"Blocked on the Open API release\", BLK-MR "
      "\"Blocked on the Maintenance Reminders release\", PROD \"Run on Production After Release\".",
      "", "| Case | What changed (Rule 134: the case was rebuilt whole) |", "|---|---|"]
R += [f"| {k} | {'; '.join(v)} |" for k, v in ZB.BASELINE_CHANGES.items()]
R += ["", "## Tech plan: DIVERGE items", "",
      "- D-1 (Create invoice rows per move or per account pair): S7-38 written and held on question 4; S7-12, S7-22 and S7-23 have one move each, where both readings agree, so they stay runnable.",
      "- D-2 (\"Closed\" in the Status filter only after first use): S2-106 written and held on question 5; S2-68 runs in a shop that uses the feature, where both agree.",
      "- D-3 (the message when a completion step fails inside Close): no runnable case depends on it (S3-53 is NO-MANUAL); not asked (skill 07 §6), reported here for the QA lead.",
      "- D-4 (no live work order import): S2-90 held on question 6.",
      "- D-5 to D-9: the cases follow the PRD, no hold (\"No charge\" vs \"No Charge\" in two plan lines, an old report name, account 6510, the release-run order).",
      "- Code facts: the hub refuses to deactivate a mapped account (S6-10 and S8-26 held on question 8); the portal deposit race (S12P-11 held on question 7); line marks after converting back (S2-100 held on question 9).", "",
      "## Tech plan: ADD statements left out", "", "| Statement | Why |", "|---|---|"]
R += [f"| {k} | {v} |" for k, v in cases_tp.TP_OUT.items()]
R += ["", "## Existing cases changed in round 2a (Rule 134: each changed case was rebuilt whole by build.py; the parts that changed)", "",
      "| Case | Change |", "|---|---|"]
R += [f"| {k} | {'; '.join(v)} |" for k, v in cases_tp.TP_CHANGES.items()]
R += ["", "Also changed in round 2a: S3-34 released (question \"asset tab total\" settled by the plan: TP-174 \"No Charge\") and DATA-08 released "
      "(TP-312). Every other part of every case (title, preconditions, steps, other results, PRD quotes and From lines, build line, marker, refs) "
      "was rebuilt by build.py from the same source and is CONFIRMED.", "",
      "## Story text (Jira) compared with PRD v1.3", "",
      "Every story ticket says \"Requirements, negative cases and edge cases live in the spec\"; its one-paragraph summary was compared with the PRD "
      "story. Latest wins (Rule 32): PRD v1.3 of 12 Nov 2026 (Final v1.0 of 9 Nov 2026 with Milos Vasic's answers 1-16 in v1.1 and the one-press Close in v1.2/v1.3). No story needs a PO question; the verify task SV-11976's \"$0.00\" is settled "
      "by the plan (\"No Charge\").", "", "| Ticket | Verdict | Difference |", "|---|---|---|"]
for k, (v, d) in STORY_DIFF.items(): R.append(f"| {k} | {v} | {d} |")
R += ["", "Verify tasks (developer check-lists), read in full:", "", "| Ticket | Cases | Note |", "|---|---|---|"]
for k, (cs, note) in VERIFY.items(): R.append(f"| {k} | {', '.join(cs)} | {note} |")
R += ["", "## Reading coverage (Rule 119)", "",
      "| Source | Size | Read |", "|---|---|---|",
      "| PRD `sources/CONFLUENCE-942243841-read-2026-11-12.md` (Final v1.0) | 805 lines, 179,770 bytes | lines 1–805, 100% |",
      "| PRD `sources/CONFLUENCE-942243841-v1.1-read-2026-11-12.md` (v1.1, 12 Nov 2026) | 182,519 bytes | the 34 changed lines (`po-answers-2026-11-12/PRD-DIFF-v1.0-to-v1.1.txt`) read in full, and every requirement, message row and named item re-parsed from v1.1 by script and compared with v1.0 (16 changed items, 1 new requirement S2-E8, 1 new message row); the other lines are byte-identical to v1.0, read in full in round 1 |",
      "| PRD `sources/CONFLUENCE-942243841-v1.3-read-2026-11-12.md` (v1.3, 12 Nov 2026) | 810 lines | the v1.1 → v1.3 diff (`po-answers-2026-11-12/PRD-DIFF-v1.1-to-v1.3.txt`) and PRD-CHANGES-v1.1-to-v1.3.md read in full; every requirement, message row and named item re-parsed from v1.3 by script; the Story 1, Story 3 and §8 lines read in full; every case quote checked against the whole text by check_v13_text.py |",
      "| Design 1794510020-d4ec: DESIGN-CHANGE-v1.3-2026-11-12.md, v3 text diff (167 boards), the 15 redrawn boards' files and pictures, canvas notes | — | in full; every v3 board file scanned for the removed wording (found Happy 28) |",
      "| Full read: FULL-READ-SUMMARY.md, fix-list.json, verdict-1..6.json (the 52 cases with a fix read in full) | — | in full |",
      "| Milos Vasic's answers (`po-answers-2026-11-12/ANSWERS-Milos-Vasic-2026-11-12.json`), QUESTION-REVIEW.md, AFFECTED-CASES.json, the design worker's DESIGN-CHANGE-2026-11-12.md, skill 07 §6.0 | — | in full |",
      "| Jira `sources/JIRA-SV-11665-tickets-2026-11-12.md` (epic, 14 stories, 13 verify tasks, fetched in full) | 454 lines | 1–454, 100% |",
      "| Tech plan worker's outputs: TECH-PLAN-TESTABLE.json (680 statements and 8 context lines), TECH-PLAN-DIVERGENCES.md, INVARIANTS-FROM-PLAN.md, QUESTIONS-DRAFT.md, TECH-PLAN-READING-RECORD.md, NOTES.md | 259 KB + 45 KB | every statement and line, 100% |",
      "| The tech plan itself (842 KB, 5,398 lines) | — | read in full by the tech plan worker (its reading record); this worker re-checks every quoted statement against its plan line by script |",
      "| Design worker's outputs: tools/cases_data.py (every draft, DC-01 to DC-86 and DV-01 to DV-06, read in full), NEW-QUESTIONS.py (in full), DESIGN-DIVERGENCE-REGISTER.json (every row), SPEC-TO-DESIGN-2026-11-12.json (247 rows), DESIGN-FIGURES-2026-11-12.json (167 boards), tools/make_case_plan.py and tools/prd.py (in full) | — | 100%; DESIGN-CASE-PLAN.md is rendered from cases_data.py by make_case_plan.py, so its content was read through its data; build.py checks the case count equals the drafts |",
      "| Rules and skills: LESSONS-REGISTER.md; Rule 4; Rules 96, 113–117 (all amendments), 122, 123, 129, 130, 132–140; IDEAL-TEST-CASE-STANDARD.md; skill 17 §0–2; skill 07 §2–6 | — | in full |", "",
      "## Checks run", "",
      f"- `python3 authoring/build.py`: 0 PROBLEM lines; proposals.json ({len(PROP)} cases). New gates: every tech plan quote is word for word on its plan line, no DIVERGE statement is quoted, every ADD statement is quoted or listed as left out.",
      "- `tester_readiness_check.py`: 0 hard problems. Round 1 read a sample of 6 and all 112 \"does not / never\" results; round 2a read a new sample of 6 "
      "(S1-88, S4-12, S2-28, S7-36, S12-35, S7-32) and every new \"does not / never\" result (13). Changes from the read: S12P-12 rewritten with a "
      "visible control and one action per step, an unneeded labor rate removed from S12-35.",
      "- Round 2b: build.py adds the design gates (pictures exist, the design's words are on the case's boards, every open register row is closed "
      "by a sheet question or the named ruling, one case per design draft). Readiness: 0 hard; the sample read (D-72, S1-15, S5-05, S2-52, S3-33) "
      "and every \"does not / never\" result of the design cases (19) and of the rest (140 in all) read; each has its positive control in the same case.",
      "- Round 2c: build.py adds the baseline-word gate and the code-in-plan-quote gate. Readiness re-run: 0 hard; the new sample and every \"does not / never\" result (145) read again.",
      "- `ticket_sweep.py`: 0 unhandled tickets, PRD 1.0 handled. `create.py` dry run: nothing written.",
      "- Round 4: build.py 0 PROBLEM lines (two gates widened: a message row's \"(Closed · No Charge)\" may be left out where the case's work order is internal; a register row held as a design-version case passes when that case exists and is held). check_v13_text.py: 0 quote misses, 0 removed wording. Readiness: 0 hard; a random sample of 20 rewritten cases and all 152 \"does not / never\" results read (fixes from the read: stale \"until the PO answers\" notes on S1-02b and S2-32b removed, S9-28 step 6, register notes for v1.3). ticket_sweep.py at PRD 1.3: 0 unhandled; Jira re-read live 13 Nov 2026 (28 tickets under the epic, none updated since 10 Nov). Write scripts dry-run with --check-live: 636 updates lock ok, 5 deletes lock ok, run 559 596 + 12 now (6 more after create), folder note lock ok.", "",
      "## OUTSTANDING — what I need from you", "",
      "- **Go-ahead for the writes of rounds 3 and 4 (Rule 6):** run, in order, `po-answers-2026-11-12/write/update_cases.py --apply`, `create_new.py --apply`, `delete_approved.py --apply` (D-87, D-89, D-91, S2-90, S8-26: approved), `sync_run_559.py --apply`, `folder_note.py --apply` (each is a dry run without the flag and reads every write back).",
      f"- **NO-MANUAL:** confirm the {len(NOMAN)} cases stay out of TestRail (recommended, as for Bill To).",
      "- **For the QA lead only (Rule 30):** the plan-vs-PRD differences D-3 and D-5 to D-9 above need no PO answer; the cases follow the PRD.",
      "- **Waiting on the PO (Rule 132):** no unanswered question (all 16 answered 12 Nov 2026). One confirmation is pending from the Open API owner, not the PO: question 10 (work_order.updated), case API-23, still blocked on the Open API release.",
      "- **No QA branch is named:** every runnable case carries the Rule 69 marker until a build is checked."]
open(f"{P}/REPORT.md", "w").write("\n".join(R) + "\n")
print("written: REPORT.md, NO-MANUAL-PROPOSAL.md, PO-QUESTIONS-DRAFT.md, TICKET-LEDGER.json, TICKET-SWEEP.json")
