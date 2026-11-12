#!/usr/bin/env python3
"""Writes the round-1 deliverables from the case library and proposals.json (run build.py first):
REPORT.md, NO-MANUAL-PROPOSAL.md, PO-QUESTIONS-DRAFT.md, TICKET-LEDGER.json and TICKET-SWEEP.json (Rule 129).
Reads only local files: the saved PRD, the saved Jira tickets (sources/jira-sweep-full-2026-11-12.json) and the case library."""
import sys, os, re, json, glob, importlib
from collections import Counter, defaultdict
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import iwo_lib as L
from po_questions import QUESTIONS, DROPPED
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
 "SV-11976": (["S3-*", "S4-*", "S3-48", "API-02"], "Covers Stories 3 and 4. Its item 7 says the asset's Invoices tab lists the closed record \"at $0.00\" where PRD v1.0 S3-R6/S9-R10 say Total balance \"No Charge\": settled by the tech plan, which builds \"No Charge\" (TP-174); S3-34 follows the PRD and is runnable. Its item 5 (a refused Close leaves the work order where it was, not Complete) is quoted by S3-48."),
 "SV-11977": (["S5-*", "S7-*", "S12-33"], "Covers Stories 5 and 7. Its item 7 adds that the void of an Issue Credit restock posts the reverse; S12-33 quotes the item; the void has no PRD sentence and no plan statement a tester can reach, so it has no case."),
 "SV-11978": (["S6-*", "S8-*"], "Covers Story 6 and the hub side of Story 8. Its item 3 adds the Dismissed reason wording (\"Withdrawn: vendor bill [number] amended\" or \"… voided\"), quoted by S8-09."),
 "SV-11979": (["S8-*", "S3-41", "S13-04"], "Core accounting emission and the accounting UI port. Tester-visible parts are the Accounting pages (Story 8 cases) and the AccountingHub notes in the Close confirmation (S3-41). The contract package versions are a code check with no screen."),
 "SV-11980": (["S9-*", "DATA-*"], "Covers Story 9: every Story 9 case and the number parity cases."),
 "SV-11981": (["REL-*", "S13-*"], "Release run and launch: the release-day cases (production) and the new-organization cases. The run order and the operator command are engineering steps (S13-06, NO-MANUAL)."),
 "SV-12297": (["REL-04"], "Rule zero before and after: REL-04 (production, figures kept before the release)."),
 "SV-12420": (["S1-45", "S1-46", "S1-47", "S1-50", "S1-51", "S1-53", "S1-54", "S1-56", "S1-59", "S1-64", "S5-01", "S13-01", "S13-03"], "Categories page, QuickBooks rows, seeding."),
 "SV-12421": (["S12-*"], "Covers Story 12 core. Item 3 says Mark as No Charge on an invoiced work order is \"disabled with 'Reverse the invoice first.'\", PRD S12-N3 says the menu offers neither action and the tooltip reads the same words: S12-26 checks both. Item 6's server refusal of a restocking fee has no screen."),
 "SV-12422": (["S12P-*"], "Covers the portal. Its item 6 (a portal deposit refused after checkout is recorded with its own reason and can be refunded) has no PRD v1.0 sentence; the tech plan gives its message (TP-668) and the race behind it is asked: S12P-11, held on question 7."),
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

# ---- PO-QUESTIONS-DRAFT.md (round 2a: our questions merged with the tech plan worker's, one numbering) ----------------------------
import cases_tp
Q = ["# Internal Work Orders — questions for Milos Vasic (draft, not sent)", "",
     "Hello sir,", "",
     "While we were writing the tests for Internal Work Orders against the final PRD (v1.0, 9 Nov 2026) and the developers' plan, a few points "
     "came up where the PRD says two different things, where the plan builds something a little different, or where nothing says what the "
     "screen should show. Each one decides whether a test passes, so that test waits for your answer; everything else on the same screens is "
     "written and ready. Each has a suggested answer, so a one-letter reply is plenty.", "",
     "| # | Topic | Question | What happens now | Options | Your answer | Where we found it |", "|---|---|---|---|---|---|---|"]
for i, (slug, topic, q, now, opts, held, where) in enumerate(QUESTIONS, 1):
    cell = lambda x: x.replace("|", "/").replace("\n", " ")
    Q.append(f"| {i} | {cell(topic)} | {cell(q)} | {cell(now)} | {'<br>'.join(cell(o) for o in opts)} |  | {cell(where)} |")
Q += ["", "Skill 07 §6 was applied before each row was kept: every question decides a verdict (a held case), every saved source was checked "
      "first (PRD v1.0, all 28 Jira tickets of the epic, and the tech plan worker's full reading of the plan), and the parts a tester can run "
      "without the answer are written as runnable cases. The colour-coded Google Sheet is built from this draft by the coordinator (no Google "
      "write by this worker).", "",
      "## QA-only tab: question → held cases (not shown to the PO)", "", "| # | Slug | Held cases | Folder | Came from |", "|---|---|---|---|---|"]
ORIGIN = {"modal-text": "PRD worker Q1", "no-charge-document-case": "PRD worker Q2", "internal-estimate-stamp": "PRD worker Q3",
          "rows-per-move": "tech plan worker Q1 (DIVERGE D-1)", "closed-chip": "tech plan worker Q2 (DIVERGE D-2)", "import": "tech plan worker Q4 (DIVERGE D-4)",
          "portal-deposit": "tech plan worker Q5", "hub-inactive-account": "tech plan worker Q6", "line-marks-after-convert": "tech plan worker Q7",
          "work-order-updated": "PRD worker Q5", "rate-zero": "PRD worker Q7"}
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
R = ["# Internal Work Orders — report, rounds 1 and 2a (PRD, Jira, tech plan), 12 Nov 2026", "",
     "Worker: PRD cases (round 1) and the tech plan fold-in (round 2a, on the coordinator's order). No writes to TestRail, Jira, Slack or Google; "
     "no commits. The design round comes next: it fills `authoring/design_refs.py` and adds the \"Design — how it looks\" cases.", "",
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
     "| Design (All flows v6.1) | pending | the design round adds References from Design and the design cases |", "",
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
      "## Story text (Jira) compared with PRD v1.0", "",
      "Every story ticket says \"Requirements, negative cases and edge cases live in the spec\"; its one-paragraph summary was compared with the PRD "
      "story. Latest wins (Rule 32): PRD Final v1.0 of 9 Nov 2026. No story needs a PO question; the verify task SV-11976's \"$0.00\" is settled "
      "by the plan (\"No Charge\").", "", "| Ticket | Verdict | Difference |", "|---|---|---|"]
for k, (v, d) in STORY_DIFF.items(): R.append(f"| {k} | {v} | {d} |")
R += ["", "Verify tasks (developer check-lists), read in full:", "", "| Ticket | Cases | Note |", "|---|---|---|"]
for k, (cs, note) in VERIFY.items(): R.append(f"| {k} | {', '.join(cs)} | {note} |")
R += ["", "## Reading coverage (Rule 119)", "",
      "| Source | Size | Read |", "|---|---|---|",
      "| PRD `sources/CONFLUENCE-942243841-read-2026-11-12.md` (Final v1.0) | 805 lines, 179,770 bytes | lines 1–805, 100% |",
      "| Jira `sources/JIRA-SV-11665-tickets-2026-11-12.md` (epic, 14 stories, 13 verify tasks, fetched in full) | 454 lines | 1–454, 100% |",
      "| Tech plan worker's outputs: TECH-PLAN-TESTABLE.json (680 statements and 8 context lines), TECH-PLAN-DIVERGENCES.md, INVARIANTS-FROM-PLAN.md, QUESTIONS-DRAFT.md, TECH-PLAN-READING-RECORD.md, NOTES.md | 259 KB + 45 KB | every statement and line, 100% |",
      "| The tech plan itself (842 KB, 5,398 lines) | — | read in full by the tech plan worker (its reading record); this worker re-checks every quoted statement against its plan line by script |",
      "| Rules and skills: LESSONS-REGISTER.md; Rule 4; Rules 96, 113–117 (all amendments), 122, 123, 129, 130, 132–140; IDEAL-TEST-CASE-STANDARD.md; skill 17 §0–2; skill 07 §2–6 | — | in full |", "",
      "## Checks run", "",
      f"- `python3 authoring/build.py`: 0 PROBLEM lines; proposals.json ({len(PROP)} cases). New gates: every tech plan quote is word for word on its plan line, no DIVERGE statement is quoted, every ADD statement is quoted or listed as left out.",
      "- `tester_readiness_check.py`: 0 hard problems. Round 1 read a sample of 6 and all 112 \"does not / never\" results; round 2a read a new sample of 6 "
      "(S1-88, S4-12, S2-28, S7-36, S12-35, S7-32) and every new \"does not / never\" result (13). Changes from the read: S12P-12 rewritten with a "
      "visible control and one action per step, an unneeded labor rate removed from S12-35.",
      "- `ticket_sweep.py`: 0 unhandled tickets, PRD 1.0 handled. `create.py` dry run: nothing written.", "",
      "## OUTSTANDING — what I need from you", "",
      "- **Before any TestRail write (Rule 6):** create the subsections of section 136701 in sections.json and put their ids there; then `create.py --apply`. Recommended after the design round, so each case is written once.",
      f"- **NO-MANUAL:** confirm the {len(NOMAN)} cases stay out of TestRail (recommended, as for Bill To).",
      "- **For the QA lead only (Rule 30):** the plan-vs-PRD differences D-3 and D-5 to D-9 above need no PO answer; the cases follow the PRD.",
      f"- **Waiting on the PO (Rule 132):** PO-QUESTIONS-DRAFT.md, {len(QUESTIONS)} questions for Milos, not yet sent (the sheet is built by the coordinator). Held on them: "
      + "; ".join(f"question {i}: {', '.join(c['key'] for c in L.CASES if L.qnum(c) == i)}" for i in range(1, len(QUESTIONS) + 1)) + ".",
      "- **No QA branch is named:** every runnable case carries the Rule 69 marker until a build is checked."]
open(f"{P}/REPORT.md", "w").write("\n".join(R) + "\n")
print("written: REPORT.md, NO-MANUAL-PROPOSAL.md, PO-QUESTIONS-DRAFT.md, TICKET-LEDGER.json, TICKET-SWEEP.json")
