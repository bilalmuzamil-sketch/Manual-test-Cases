#!/usr/bin/env python3
"""Writes the Bill To round-1 records from the case library: TICKET-LEDGER.json, TICKET-SWEEP.json, PO-QUESTIONS-DRAFT.md,
NO-MANUAL-PROPOSAL.md and REPORT.md (counts, per-item coverage, held cases, story-vs-PRD differences, invariants, surfaces, numbers,
reading coverage, OUTSTANDING). Run after build.py and story_diff.py. Nothing is written outside build/founder-mode/bill-to/."""
import sys, os, re, json, glob, importlib
from collections import Counter, defaultdict
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import bt_lib as L
from po_questions import QUESTIONS, DROPPED
_ORDER = [f"cases_s{i}" for i in range(1, 20)] + ["cases_api", "cases_data", "cases_rel", "cases_inv", "cases_design"]
_MODS = sorted(os.path.basename(f)[:-3] for f in glob.glob(f"{D}/cases_*.py"))
for m in [x for x in _ORDER if x in _MODS] + [x for x in _MODS if x not in _ORDER]: importlib.import_module(m)
P = L.P
SECS = json.load(open(f"{P}/sections.json"))["sections"]
SD = json.load(open(f"{D}/story_diff.json"))
JS = json.load(open(f"{P}/sources/jira-sweep-2026-11-09.json"))
by_item = defaultdict(list)
for c in L.CASES:
    for x in L.codes_of(c): by_item[x].append(c["key"])
CASE = {c["key"]: c for c in L.CASES}
PO = lambda c: "waiting on the PO" in c["marker"]
NOMAN = [c for c in L.CASES if c["held"] and not PO(c) and c["marker"] not in (L.IWO_HOLD, L.PORTAL_HOLD, L.PRE_REL)]

# ---- ticket ledger and sweep config (Rule 129)
led = {}
for i in JS["issues"]:
    k, f = i["key"], i["fields"]
    if f["issuetype"]["name"] == "Epic":
        led[k] = {"updated": f["updated"], "summary": f["summary"], "type": "Epic", "outcome": "NEW-CASES",
                  "cases": [f"every case in authoring/proposals.json ({len(L.CASES)})"],
                  "note": "Epic text read in full (9 Nov 2026). Its scope line \"AccountingHub change (Hub team)\" conflicts with PRD v0.5 "
                          "(no AccountingHub change needed); latest wins, cases follow the PRD (REPORT.md, story-vs-PRD differences)."}
        continue
    n = next(s for s, (key, _) in L.STORY.items() if key == k)
    ks = sorted({c["key"] for c in L.CASES if k in L.refs_of(c).split(",")}, key=lambda x: (x.split("-")[0], x))
    led[k] = {"updated": f["updated"], "summary": f["summary"], "type": f["issuetype"]["name"], "outcome": "NEW-CASES", "cases": ks,
              "note": f"Story {n}. Every code compared word for word with PRD v0.5: identical (story_diff.json). Case links go on the ticket "
                      "only after the cases exist in TestRail (Rule 128), with the QA lead's go-ahead."}
json.dump(led, open(f"{P}/TICKET-LEDGER.json", "w"), indent=1, ensure_ascii=False)
json.dump({"project": "Bill To", "epic": "SV-12289", "stories": [L.STORY[n][0] for n in range(1, 20)], "prd_page": "1003585538",
           "prd_version_handled": "0.5", "jira_saved": "sources/jira-sweep-2026-11-09.json",
           "checked": "2026-11-09 (PRD v0.5, last modified 7 Nov 2026; Jira as saved 9 Nov 2026). The PRD carries an in-body version (0.5); "
                      "the Confluence version integer was not saved at intake, so a later sweep compares the in-body version and the "
                      "page's last-modified date (7 Nov 2026)."},
          open(f"{P}/TICKET-SWEEP.json", "w"), indent=1, ensure_ascii=False)

# ---- PO questions draft (skill 07 §6)
Q = ["# Bill To — questions for Chris Ward (DRAFT, not sent)", "",
     "Project: Bill To (Founder Mode). PRD \"Bill To\" v0.5 (Confluence 1003585538, pending approval from Mat and Amani). Drafted 9 Nov 2026 "
     "by the case worker; **nothing has been sent** (no Google write). The coordinator puts these in the suite's question sheet "
     "(colour-coded format, Rule 125/131) and lists them in `build/PO-QUESTIONS-OPEN.md` the moment they are sent (Rule 132).", "",
     "Skill 07 §6 was applied to every row: each question decides the verdict of a held case, was checked against every saved source "
     "(PRD, the 20 tickets, the design captions), and everything a tester can run without the answer is already a runnable case.", ""]
for i, (slug, q, basis, opts, holds) in enumerate(QUESTIONS, 1):
    keys = [c["key"] for c in L.CASES if c["marker"] == L.PO_HOLD(i)]
    Q += [f"## {i}. {q}", "", f"**What the PRD says now:** {basis}", "", "**Options:**", ""] + [f"- {o}" for o in opts] + \
         ["", "**Your answer:** _(blank)_", "", "_QA only (not for the PO): " + holds + " Cases: " + ", ".join(k + " (" + CASE[k]["title"] + ")" for k in keys) + "._", ""]
Q += ["## Points checked and not asked (our own sources answer them)", ""] + [f"- **{a}** — {b}" for a, b in DROPPED]
open(f"{P}/PO-QUESTIONS-DRAFT.md", "w").write("\n".join(Q) + "\n")

# ---- cases a tester cannot set up
N = ["# Bill To — cases a manual tester cannot set up (proposal)", "",
     "Lesson L-14 / Rule 138: a behaviour a manual tester cannot set up or reach is not put into a manual run. These cases are kept in the "
     "library with their exact text and `AUTOMATION: HOLD - <reason>` so nothing the PRD requires is lost. **QA lead: should they go to "
     "TestRail as held cases, or stay in the library only (as Technician Toggle's five did, 2 Nov 2026: \"Leave them out\")?** "
     "`create.py` adds them unless their keys are put in its NO_MANUAL set.", "",
     "| Key | Title | Why a manual tester cannot run it | PRD items |", "|---|---|---|---|"]
for c in NOMAN: N.append(f"| {c['key']} | {c['title']} | {c['marker'][len('AUTOMATION: HOLD - '):]} | {', '.join(sorted(L.codes_of(c)))} |")
N += ["", "Held for other reasons (not in this proposal): waiting on the PO "
      f"({', '.join(c['key'] for c in L.CASES if PO(c))}); blocked on the Internal Work Orders release "
      f"({', '.join(c['key'] for c in L.CASES if c['marker'] == L.IWO_HOLD)}); blocked on the customer portal app release "
      f"({', '.join(c['key'] for c in L.CASES if c['marker'] == L.PORTAL_HOLD)}); run on production around the release "
      f"({', '.join(c['key'] for c in L.CASES if c['marker'] == L.PRE_REL)})."]
open(f"{P}/NO-MANUAL-PROPOSAL.md", "w").write("\n".join(N) + "\n")

# ---- REPORT.md
R = []; w = R.append
held = [c for c in L.CASES if c["held"]]
w("# Bill To — round 1 case library (9 Nov 2026)"); w("")
w("Project type (ii) V2 / upgrade (QA lead, 9 Nov 2026). PRD \"Bill To\" v0.5 (Confluence 1003585538, 6 Nov 2026, pending approval from Mat "
  "and Amani, last modified 7 Nov 2026, Chris Ward). Epic SV-12289, stories SV-12303 to SV-12321. No tech plan (QA lead: may come later; "
  "the cases are then checked against it, Rule 134). No QA build named. **Nothing was written to TestRail, Jira, Slack or Google; nothing "
  "was committed.** Design cases come in round 2 (the design worker owns `design-2026-11-09/` and the divergence register); every case "
  "has the empty \"References from Design\" hook (`authoring/design_refs.py`)."); w("")
w("## 1. Counts"); w("")
w(f"- **{len(L.CASES)} cases**: {len(L.CASES) - len(held)} runnable once a build exists (marker \"AUTOMATION: Not available on Build to test Yet - Last checked 11/9/2026\", Rule 69), {len(held)} held.")
w(f"- Held: waiting on the PO {sum(PO(c) for c in held)} · blocked on the Internal Work Orders release (SV-11665) {sum(c['marker'] == L.IWO_HOLD for c in held)} · blocked on the customer portal app release {sum(c['marker'] == L.PORTAL_HOLD for c in held)} · production around the release {sum(c['marker'] == L.PRE_REL for c in held)} · a tester cannot set it up {len(NOMAN)} (NO-MANUAL-PROPOSAL.md).")
w("- Gates: `python3 authoring/build.py` → **0 PROBLEM lines**; `tester_readiness_check.py` → **0 hard problems**, 55 \"does not / never\" results, every one read and each has a control the tester can see; the random sample of 6 (seed 9: S7-14, S5-03, S2-03, S12-04, S14-09, API-04) read in full — found and fixed a doubled comma in work order preconditions; S12-07 given a search control.")
w(""); w("| Section (proposed subsection of 132467) | Cases | Held |"); w("|---|---|---|")
cnt = Counter(c["sec"] for c in L.CASES); hc = Counter(c["sec"] for c in held)
for s, v in SECS.items(): w(f"| {s} — {v['name']} | {cnt.get(s, 0)} | {hc.get(s, 0)} |")
w("")
w("## 2. Coverage of every PRD item (Rule 43: one verdict per item)"); w("")
codes = set(L.CODE); named = set(L.NAMED)
w(f"Requirement codes: **{len(codes & set(by_item))}/{len(codes)}** quoted by a case, the other {len(codes - set(by_item))} listed as not testable with the reason. "
  f"Named items (Error Handling {sum(k.startswith('EH-') for k in named)}, User Feedback Summary rows and sentences {sum(k.startswith('UFS-') for k in named)}, Key Decisions {sum(k.startswith('KD-') for k in named)}, "
  f"Terminology {sum(k.startswith('T-') for k in named)}, Core {sum(k.startswith('CORE-') for k in named)}, Integrations {sum(k.startswith('INT-') for k in named)}, Release day {sum(k.startswith('REL-') for k in named)}, "
  f"State by action {sum(k.startswith('SBA-') for k in named)}, Out of Scope {sum(k.startswith('OOS-') for k in named)}, Goals {sum(k.startswith('GOAL-') for k in named)}, form factor and dependencies {sum(k.startswith(('FF-', 'DEP-')) for k in named)}): "
  f"**{len(named & set(by_item))}/{len(named)}** covered, {len(named - set(by_item))} not testable. Every User Feedback Summary message is used word for word "
  "(fixed words exact) in a step or result (build.py gate)."); w("")
w("| Item | PRD text (start) | Cases |"); w("|---|---|---|")
def short(t): return L.ws(t)[:110].replace("|", "/")
for k in sorted(codes, key=lambda x: (int(x[1:].split("-")[0]), "RNE".index(x.split("-")[1][0]), int(re.sub(r"\D", "", x.split("-")[1])))):
    w(f"| {k} | {short(L.CODE[k])} | {', '.join(by_item.get(k, [])) or 'NOT TESTABLE: ' + L.NOT_TESTABLE.get(k, '?')} |")
for k in sorted(named):
    w(f"| {k} ({L.NAMED[k][0]}) | {short(L.NAMED[k][1])} | {', '.join(by_item.get(k, [])) or 'NOT TESTABLE: ' + L.NOT_TESTABLE.get(k, '?')} |")
w("")
w("## 3. Held cases"); w("")
w("| Key | Title | Why held |"); w("|---|---|---|")
for c in held: w(f"| {c['key']} | {c['title']} | {c['marker'][len('AUTOMATION: HOLD - '):]}{' (BLOCKED ON RELEASE banner)' if c['banner'] else ''} |")
w("")
w("## 4. Story-vs-PRD differences (each story compared with its PRD story, `authoring/story_diff.py`)"); w("")
w(f"- All {len(SD['codes'])} requirement, negative and edge codes in the 19 stories are word for word the PRD's; no PRD code is missing from a story. "
  "Every story's Error handling, Prerequisite, Form factor, Dependency, Trigger and Messages line is in the PRD word for word.")
w("- Wording of a label only: Story SV-12318 writes \"Dependency:\" where the PRD writes \"Release dependency:\"; the sentence is the same.")
w("- Every story says \"Status: Pending approval from Mat and Amani. Do not start until approved.\", matching the PRD's status.")
for n in SD["epic"]: w(f"- Epic SV-12289: \"{n['text']}\" — {n['verdict']}")
w("- No real conflict needs a PO question: the one conflict (AccountingHub change) is settled by latest wins (Rule 32).")
w("")
w("## 5. What must not change (Rule 96, skill 17)"); w("")
w("Code baseline: **NOT AVAILABLE** (no product repository access in this session); the invariant set rests on the PRD's own \"as today\" / "
  "\"unchanged\" sentences and its Out of Scope list. Every such sentence a tester can see is quoted by a case:"); w("")
w("| PRD item | \"as today\" / \"unchanged\" sentence (start) | Cases |"); w("|---|---|---|")
INVRX = re.compile(r"as today|unchanged|exactly as|as before|Neither window changes|keep today|no Bill To|No Bill To|works as|matches the day before|reads as today", re.I)
for k, t in sorted([(k, v) for k, v in L.CODE.items() if INVRX.search(v)]) + sorted([(k, v[1]) for k, v in L.NAMED.items() if INVRX.search(v[1]) or k.startswith("OOS-")]):
    w(f"| {k} | {short(t)} | {', '.join(by_item.get(k, [])) or 'NOT TESTABLE: ' + L.NOT_TESTABLE.get(k, '?')} |")
w("")
w("Silences judged dangerous (V2 touches the same screen) and asked: part sale Credit Hold / Over Limit badges (question 3). Considered and "
  "not asked, with the reason: PO-QUESTIONS-DRAFT.md, last section. **Honest limit (skill 17 §7):** undocumented, untested, code-invisible "
  "behaviours cannot be fully enumerated; without the product code the baseline is the PRD's own statements, and what protects us is this "
  "written list plus the dated questions.")
w("")
w("## 6. Surfaces (Rule 40) and numbers (Rule 116)"); w("")
w("| Surface | Cases |"); w("|---|---|")
SURF = [("Customer page (Bill Invoices To line, Change, Pays for)", "S1"), ("New Customer / Edit Customer (field, help line, Address 2)", "S2"),
        ("Work order and part sale Customer card", "S3"), ("Authorizer list", "S4"), ("Locked field: invoiced, deposits, two tabs, phone", "S5"),
        ("Change Customer", "S6"), ("Invoicing: Bill To block, terms, PO, Over Credit, Credit Hold banner and badges", "S7"),
        ("Invoices and estimates, modern and legacy, part sale, batch (Service For band)", "S8"), ("Invoice email", "S9"),
        ("Receivables, deposits, payments, credits, Invoices tab Service For column", "S10"), ("Reverse and invoice again", "S11"),
        ("Delete customer", "S12"), ("Work Order Log", "S13"), ("Asset Work Orders tab", "S14"), ("Internal / No Charge", "S15"),
        ("Customer portal", "S16"), ("QuickBooks", "S17"), ("AccountingHub", "S18"), ("IBS and invoice CSV export", "S19"), ("Public API", "API"),
        ("Cross-surface money parity", "DATA"), ("Release day", "REL"), ("What must not change", "INV")]
for name, s in SURF: w(f"| {name} | {', '.join(c['key'] for c in L.CASES if c['sec'] == s)} |")
w("")
money = [c["key"] for c in L.CASES if re.search(r"\$\d", " ".join(b for r in c["res"] for b in r))]
w(f"Exact money and counts (Rule 116): {len(money)} cases assert an exact $ figure with its arithmetic, among them the payer's balance on its "
  "Invoices tab, A/R Aging and statement (DATA-01), a part payment on every surface (DATA-02), deposits applied (DATA-03), revenue staying "
  "with the service customer (DATA-04, S10-12), the Over Credit warning on both sides of the limit (S7-07, S7-08), deposit totals in the lock "
  "message (S5-09, S5-11, S5-12), one payment across customers (S10-06), the unchanged total (S7-04, INV-02, INV-08). Counts: Pays for 1, 2 "
  "and 20 (S1-06, S1-08, S1-09, S1-14), the 50-customer list (S3-05), asset tab rows and the 8/9-option search threshold (S14).")
w("")
w("## 7. Observations for the coordinator"); w("")
w("- S12-R5 \"open work orders keep their Bill To\" cannot be reached through the Delete Customer window: S12-R7/S12-R8 refuse the delete "
  "first whenever the payer is the Bill To on any work order. The confirmation's words are checked; the behaviour has no reachable case "
  "(listed under points not asked).")
w("- Labels taken from the design captions only for the screen's own words (no expected result from the design): Change Customer (two "
  "arrows at the top right of the Customer card), Confirmation \"Are you sure you want to delete this company?\", New Customer Payment, "
  "\"Include 'For Customer' Attachments in email\", \"Customer: All customers\", history mode. Labels the sources do not give (the email send "
  "action, the deposit-link action, the CSV export page, the A/R Aging and statement menus, Public API endpoint names) are written plainly "
  "and must be checked on the first build (Rule 9).")
w("- `build/testing-tools/ticket_sweep.py` was widened to accept a decimal PRD version (\"0.5\"): `--prd-version` and "
  "`prd_version_handled` are read as numbers with decimals; whole-number versions behave exactly as before (Technician Toggle 20, Credit "
  "terms 5). The only change to a shared tool in this pass.")
w("")
w("## 8. Reading coverage (Rule 119)"); w("")
w("| Source | Size | Read |"); w("|---|---|---|")
w("| PRD `sources/CONFLUENCE-1003585538-v0.5-2026-11-09.md` | 53,054 bytes, 1,049 lines | lines 1–1049, 100% |")
w("| Tickets `sources/JIRA-SV-12289-tickets-2026-11-09.md` (epic + 19 stories) | 66,031 bytes, 814 lines | lines 1–814, 100%; plus every code compared by script |")
w("| Jira sweep `sources/jira-sweep-2026-11-09.json` | 20 issues | read by script (keys, types, updated) for the ledger |")
w("| Design captions `design-2026-11-09/files/project/*.dc.html` (8 boards) | 97,134 bytes | visible text of all 8 boards read, for the screen's own labels only; the design drive (every board, clickable and screenshot) is the design worker's |")
w("| Rules and skills | — | LESSONS-REGISTER (every row); Rules 4, 96, 113, 114, 116, 117 (all amendments), 122, 129, 130, 132, 134–138; IDEAL-TEST-CASE-STANDARD; skill 17 in full; skill 07 §0–§6 |")
w("")
w("## OUTSTANDING — what I need from you"); w("")
w("- TestRail: create the 23 proposed subsections under 132467 (`sections.json`), then `create.py --apply`, with the QA lead's go-ahead (Rule 6). The creation hold (Rule 62, H1) must be checked as lifted before any new case is created.")
w("- Decide NO-MANUAL-PROPOSAL.md: the cases a tester cannot set up go to TestRail held, or stay in the library only.")
w("- Send the three questions in PO-QUESTIONS-DRAFT.md to Chris Ward (question sheet, Rule 131) and add them to `build/PO-QUESTIONS-OPEN.md` (Rule 132).")
w("- A QA branch for Bill To, to lift the Rule 69 marker; the tech plan when it exists; product code access for the skill 17 baseline.")
w("")
w("**Waiting on the PO:** nothing sent yet. Once sent: Chris Ward questions 1–3 (Bill To); " +
  "; ".join(f"question {i} holds {', '.join(c['key'] for c in L.CASES if c['marker'] == L.PO_HOLD(i))}" for i in range(1, len(QUESTIONS) + 1)) + ".")
open(f"{P}/REPORT.md", "w").write("\n".join(R) + "\n")
print("written: TICKET-LEDGER.json", len(led), "| PO-QUESTIONS-DRAFT.md", len(QUESTIONS), "| NO-MANUAL-PROPOSAL.md", len(NOMAN), "| REPORT.md", len(R), "lines")
