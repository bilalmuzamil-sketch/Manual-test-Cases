#!/usr/bin/env python3
"""Render TICKET-LEDGER.json, TICKET-SWEEP.json, PO-QUESTIONS-DRAFT.md and REPORT.md from the case sources.
python3 render_outputs.py (run build.py first)."""
import os, sys, re, json
from collections import Counter, defaultdict
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import ct_lib as L
import build_mods
from po_questions import QUESTIONS, DROPPED, QN
P = L.P; CASES = L.CASES; TODAY = "2026-10-23"
SEC = json.load(open(f"{P}/sections.json"))
SECNAME = {"S1": "Story 1 — Credit Terms page and list", "S2": "Story 2 — Row menu actions", "S3": "Story 3 — Create or edit a credit term",
           "S4": "Story 4 — Move Customers", "S5": "Story 5 — New Customer and Edit Customer", "S6": "Story 6 — Vendors", "S7": "Story 7 — Due dates",
           "S8": "Story 8 — QuickBooks sync", "S9": "Story 9 — Over Credit warning", "S10": "Story 10 — Imports and Public API",
           "S11": "Release day and what must not change", "S12": "Story 12 — Credit Terms audit log", "DATA": "Counts and due dates — exact numbers",
           "DESIGN": "Design — how it looks (written by the design worker, cases_design.py)"}
def quoting(code): return [c["key"] for c in CASES if code in L.codes_of(c)]

# ---------------- ticket ledger and sweep ----------------
ledger = {"SV-11638": {"updated": TODAY, "outcome": "COVERED", "cases": [f"all {len(CASES)}"],
                       "note": "Epic \"Credit terms\" (Ready for Development, updated 2026-10-22). Every case names it on its first From: line."}}
for n, (key, name) in L.STORY.items():
    ks = [c["key"] for c in CASES if n in L.story_nums(c)]
    ledger[key] = {"updated": TODAY, "outcome": "NEW-CASES", "cases": ks,
                   "note": f"{name}. Read in full 23 Oct 2026: its requirement lines are word for word PRD v3's; Context, Acceptance Criteria and UI/UX add nothing the PRD lacks "
                           + ("(the acceptance criterion gives the old limit's format, \"Credit limit $500.00 → $0.\", quoted in S4-13)." if n == 4 else "(acceptance criteria examples quoted where a case uses them).")}
json.dump(ledger, open(f"{P}/TICKET-LEDGER.json", "w"), indent=1, ensure_ascii=False)
json.dump({"project": "Credit terms", "epic": "SV-11638", "stories": [v[0] for v in L.STORY.values()], "prd_page": "963346440", "prd_version_handled": 3,
           "_query": "key = SV-11638 OR parent = SV-11638 OR parent in (SV-11670..SV-11681), one page, 13 tickets (sources/SWEEP-2026-10-23.md).",
           "prd_handled_note": "23 Oct 2026: first draft of the whole suite from PRD v3 (22 Oct 2026); nothing earlier to diff."},
          open(f"{P}/TICKET-SWEEP.json", "w"), indent=1, ensure_ascii=False)

# ---------------- PO questions draft ----------------
held = defaultdict(list)
for c in CASES:
    m = re.search(r"question (\d+)", c["marker"])
    if m: held[int(m.group(1))].append(c["key"])
Q = ["# Credit terms — questions for Chris Ward (DRAFT, not sent)", "",
     "Drafted 23 Oct 2026 from PRD v3 (Confluence 963346440) and stories SV-11670 to SV-11681. Nothing has been sent (QA lead decides when; skill 07: the sheet goes last, as a colour-coded Google Sheet).",
     "Every row: project Credit terms. Plain words for the PO; the QA mapping is in the second table.", "",
     "| # | Project | Feature | What the PRD says now | The question | Options | Your answer |", "|---|---|---|---|---|---|---|"]
FEAT = {"s11-r15": "Release day", "other-term-order": "Credit Terms list order", "changed-meanwhile-msg": "Credit Terms page, two people at once",
        "inactive-elsewhere": "Deactivated terms on other screens", "move-note-inactive": "Move Customers note", "move-note-spelling": "Move Customers note",
        "date-change-term": "Invoice due dates"}
for i, (slug, q, basis, opts, holds) in enumerate(QUESTIONS, 1):
    Q.append(f"| {i} | Credit terms | {FEAT[slug]} | {basis.replace('|', '/')} | {q} | {'<br>'.join(opts)} | |")
Q += ["", "## QA mapping (not for the PO)", "", "| # | Cases held | What changes when answered |", "|---|---|---|"]
for i, (slug, q, basis, opts, holds) in enumerate(QUESTIONS, 1):
    Q.append(f"| {i} | {', '.join(held.get(i, [])) or 'none'} | {holds} |")
Q += ["", "## Dropped before the sheet (skill 07 §6: our own sources answer them)", ""]
for k, v in DROPPED.items(): Q.append(f"- **{k}**: {v}")
open(f"{P}/PO-QUESTIONS-DRAFT.md", "w").write("\n".join(Q) + "\n")

# ---------------- report ----------------
R = []; A = R.append
cnt = Counter(c["sec"] for c in CASES)
A("# Credit terms — draft suite report (23 Oct 2026)"); A("")
A(f"Drafted from PRD v3 (Confluence 963346440, 22 Oct 2026) and the 12 stories of epic SV-11638. {len(CASES)} cases, not written to TestRail. "
  "No tech plan yet; no build; the design is driven in parallel by another worker and its pass fills \"References from Design\" and the DESIGN section.")
A(""); A("## 1. Counts per section"); A("| Key | TestRail section | Name | Cases |"); A("|---|---|---|---|")
for s in ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12", "DATA", "DESIGN"]:
    A(f"| {s} | {SEC[s]} | {SECNAME[s]} | {cnt.get(s, 0)} |")
A(f"| | | **Total** | **{len(CASES)}** |")
mk = Counter(c["marker"] for c in CASES)
A(""); A("Markers: " + "; ".join(f"`{m}` × {n}" for m, n in mk.most_common()))
A(""); A("## 2. Coverage of the 211 requirement codes"); A("| Code | Cases |"); A("|---|---|")
def _cov(k):
    cs = quoting(k)
    if k in L.NO_MANUAL:
        return (", ".join(cs) + "; " if cs else "") + f"{L.DELETED_MSG} (was {L.NO_MANUAL[k]}, {L.DELETED_CASES[L.NO_MANUAL[k]]})"
    return ", ".join(cs)
for k in L.CODE: A(f"| {k} | {_cov(k)} |")
A(""); A("No code is listed as not testable. 26 Oct 2026: 10 cases were deleted on the QA lead's order because a manual tester cannot set them up (" + ", ".join(f"{k} {c}" for k, c in L.DELETED_CASES.items()) + "); each requirement only they covered reads \"" + L.DELETED_MSG + "\"; every other requirement they quoted is still covered by the remaining cases named in its row. Story 11 has no S11-R15 (question 1).")
A(""); A("### Named PRD items (no code): Error Handling, User Feedback Summary, Key Decisions, Permissions, Terminology, Assumptions, Goals, Out of Scope")
A("| Item | Where | Cases or reason |"); A("|---|---|---|")
for k, (lab, t) in L.NAMED.items():
    cs = quoting(k)
    A(f"| {k} | {lab} | {_cov(k) if (cs or k in L.NO_MANUAL) else 'NOT TESTABLE: ' + L.NOT_TESTABLE[k]} |")
A(""); A("Sub-items (rows of the S2-R1 and S12-R3 tables, the S1-R7/S1-R8/S3-R2/S3-R5/S3-R9 bullets): every one is quoted by a case (gate in build.py).")
A(""); A("## 3. Must not change (Rule 96)")
A("Project type: V2 / upgrade, confirmed by the QA lead on 23 Oct 2026 (\"It is an updgrade\"; twelve fixed terms exist today). Code baseline: NOT AVAILABLE (no product repository in this session); the baseline rests on PRD v3 and the facts in `build/sv9087-credit-term-2026-08-27/FINDINGS.md`. Every PRD sentence that says a behaviour stays as today, and the case that protects it:")
A("| PRD sentence (verbatim) | Cases |"); A("|---|---|")
items = list(L.CODE.items()) + [(k, v[1]) for k, v in L.NAMED.items()]
seen = set()
for k, t in items:
    for sent in re.split(r"(?<=[.;])\s+", t):
        if re.search(r"\bas today\b|exactly as|unchanged|as before|behave exactly|keep (?:their|its) |never rewritten|never changes", sent) and sent not in seen:
            seen.add(sent); cs = quoting(k)
            A(f"| {k}: \"{sent.replace('|', '/')}\" | {', '.join(cs) if cs else '—'} |")
A("")
A("Honest limit (skill 17 §7): undocumented, untested, code-invisible behaviours cannot be fully listed; without code access the list above is the PRD's own sentences plus the Out of Scope checks. A dangerous silence found while drafting (how a deactivated term reads on screens the PRD does not name) is question 4.")
A(""); A("## 4. Held cases and why")
A("| Case | Title | Marker |"); A("|---|---|---|")
for c in CASES:
    if c["marker"] != L.MARKER: A(f"| {c['key']} | {c['title']} | `{c['marker']}` |")
A(""); A(f"Every other case carries `{L.MARKER}` (the pattern's default while no build exists). The six Public API cases (S10-11 to S10-16) would be READY once the request is documented.")
A(""); A("## 5. Story-vs-PRD differences")
A("- None in substance. All 211 requirement lines in SV-11670 … SV-11681 are word for word PRD v3 (script check, markdown marks removed). The S2-R1 and S12-R3 tables are bullet lists in the stories with the same cells.")
A("- Context and Acceptance Criteria add nothing the PRD lacks; the S4 acceptance criterion gives the note's limit format \"$500.00\" (used in S4-13, quoted). The stories' PRD link points at the draft (resumedraft.action?draftId=963346440) and calls it \"Default Credit Terms PRD\"; the live page is \"Credit terms\" v3. Noted, nothing held.")
A(""); A("## 6. Rule 4 (API placement)")
api = [c["key"] for c in CASES if c["api"]]
A(f"The {len(api)} Public API cases ({', '.join(api)}) are in S10. TestRail section 91464 is titled \"S10 — Imports and Public API\" (coordinator, 23 Oct 2026), so Rule 4 is satisfied and they stay there.")
A(""); A("## 7. Gates (`python3 authoring/build.py`)")
A("The QA lead's case pattern (Rule 117 fourteenth amendment, 26 Oct 2026): plain precondition bullets only (no Scenario line, no {placeholder}, no \"For example\", no setup-file link), no \"mark this test Blocked\" line (fifteenth amendment, 26 Oct 2026); \"Expected Result\" with a \"Step N:\" heading and a bullet list per step, a blank paragraph, then the quotes, From lines, References from Design and AUTOMATION line identical to before the pattern. "
  "Title ≤ 80 and no semicolon; steps = results, each \"Step N:\"; no step with two UI actions (heuristic, plus each step read by hand); placeholders defined and named name-hyphen-letter/number; every quote verbatim in PRD v3 or the saved stories; every code and named item covered or not testable with a reason; every User Feedback Summary message used word for word in a step or result; one AUTOMATION line, last; From: line per document, build line, References from Design block. Result: 0 PROBLEM lines. Over the ~10-step target: DATA-24 (14 steps; kept whole: each count depends on the action before it, Rule 136).")
A(""); A("## 8. Reading coverage (Rule 119)")
A("| File | Size | Lines read | Coverage |"); A("|---|---|---|---|")
A("| sources/CONFLUENCE-963346440-v3-2026-10-23.md | 119,191 bytes, 1,075 lines | 1–1075 | 100% |")
A("| sources/JIRA-SV-11638-stories-2026-10-23.md | 82,576 bytes, 811 lines | 1–811 (211 requirement lines by script against the PRD, the rest by eye) | 100% |")
A("| build/sv9087-credit-term-2026-08-27/FINDINGS.md | 9,034 bytes | whole | 100% |")
A("| build/sv8815-customer-credit-2026-08-20/FINDINGS.md | 13,848 bytes | first 120 lines (customer credit memo path; the rest is tax-rounding detail, not credit terms) | partial, facts only |")
A("| build/APP-ACTIONS-PLAYBOOK.md | 279,203 bytes | §G, §H, Navigation Map, Invoicing, Customers/Vendors, Roles/Staff, Settings sub-toggles (targeted, Rule 88) | targeted |")
A("| Rules and skills (brief list) | — | LESSONS-REGISTER L-01–L-09; Rule 4; Rules 96, 113, 114, 116, 117 (all amendments), 122, 129, 130, 132, 134, 135, 136; IDEAL-TEST-CASE-STANDARD; skills 17 and 07; TOKEN-DISCIPLINE-CHARTER | 100% |")
A(""); A("## 9. Fix round, 23 Oct 2026 (coordinator review)")
FIX = [
 ("Item 1 (a), fresh shop term per case", "S4-01, S4-04, S4-05, S4-08, S4-12, S4-13, S4-16, S4-20 (three customers on {Term-A}, 15 days); S4-09, S4-10, S4-14, S4-17, S4-18, S4-19, S4-29, S4-31, S4-32, S4-33, S7-01c, S8-06, S8-12, S12-09, DATA-25, DATA-26 ({Term-A}, 20 days); DATA-26b ({Term-A}, 45 days); S4-35 (deactivated {Term-A}, 60 days); S1-06, S1-07, S1-19 (new terms with 1/2/3 holders or none)",
  "a standard term on the shared site holds other people's customers, so \"exactly N on Net 15/20/45\" could not be reached; the behaviour does not depend on the term being standard"),
 ("Item 1 (b), standard term kept, relative counts or Select None + search", "S2-03, S2-07 (\"at least one customer\", Move Customers available), S2-22 and DATA-24 ({Count-A}/{Count-B} tab counts), S4-08 (Net 30 {Count-A} + 3), S4-25 (Credit Hold: Select None, search, tick), S11-09 (COD → Credit Hold with Select None, search, tick)",
  "the case must use that standard term; counts and selections are stated so a tester can reach them"),
 ("Item 1 (c), clean organization", "S1-23, S1-25, S11-04, S12-16 (`AUTOMATION: HOLD - needs a test organization holding only ZZAUTOTEST records ...`; setup recipe P-CLEAN)",
  "an empty Inactive tab, every term deactivated, exactly the twelve standard terms, an empty log: none can be reached on a shared site without touching other sessions' data"),
 ("Item 2, shared site lists", "S1-03, S1-04, S1-05, S1-08, S4-06, S5-02, S6-01",
  "other sessions' shop terms also appear in lists, so the results now check the order of the named rows rather than an exact full list"),
 ("Item 2, start screen and other-screen checks", "S9-03 (starts on Parts, Part Sales), S4-14 (limit checked on the customer page in its own step), S5-07, S5-08 (customer page in its own step), S7-06 (printed invoice in its own step), S8-09 (QuickBooks invoice in its own step), S11-01 (default proven by the log, not by \"nobody used the page\")",
  "a result checked something not on the screen of its step, or the starting screen did not match step 1"),
 ("Item 2, S11-09 content", "S11-09", "S11-R17 is about an existing COD or Credit Hold customer with an old limit; the case moved a Net customer and now moves an old-limit COD customer to Credit Hold"),
 ("Item 2, trivial results (all cases)", "every case (ct_lib.visible)", "results that only restated the action (\"the name is typed\", \"Net 45 is chosen\", \"the toast shows\") now say what the tester sees"),
 ("Item 3, design hook", "ct_lib.design_block, build.py", "DREFS from design_refs.py fills References from Design; cases_design.py is imported; design gates added (title \"Design: \", a picture per design case, every picture exists in design-2026-10-23/images/)"),
]
A("| Change | Cases | Why |"); A("|---|---|---|")
for a_, b_, c_ in FIX: A(f"| {a_} | {b_} | {c_} |")
A("Every touched case was rewritten top to bottom (title, preconditions, steps, results, quotes unchanged as the sources did not change, setup recipe regenerated).")
A(""); A("## OUTSTANDING — what I need from you")
A("| What is missing | Who owes it | What it blocks | Since |"); A("|---|---|---|---|")
A("| Tech plan | QA lead (engineering) | A full pass over every case (Rule 134); the Public API request details | 23 Oct 2026 |")
A("| Public API documentation (request addresses and fields) | QA lead / developers | S10-11 to S10-16 stay held | 23 Oct 2026 |")
A("| How a tester gets an organization created after the release, and one with no settings record | QA lead | S11-10, S11-11 | 23 Oct 2026 |")
A("| Access to what AccountingHub and IBS receive | QA lead | S8-11, S8-12 | 23 Oct 2026 |")
A("| Records and screenshots captured before the release reaches the test site | QA (us, once a date is known) | S7-05, S11-02, S11-07, S11-14 | 23 Oct 2026 |")
A("| A QA branch for SV-11638 | developers | every case's build check | 23 Oct 2026 |")
A("| Which organization the clean-organization cases run on (only this suite's records) | QA lead | " + ", ".join(c["key"] for c in CASES if c["marker"] == L.CLEAN_HOLD) + " | 23 Oct 2026 |")
A(""); A("**Waiting on the PO:** Chris Ward's Credit terms questions 1 to " + str(len(QUESTIONS)) + " are drafted in `PO-QUESTIONS-DRAFT.md` and NOT sent yet; "
  + "; ".join(f"question {i} holds {', '.join(v)}" for i, v in sorted(held.items())) + ".")
open(f"{P}/REPORT.md", "w").write("\n".join(R) + "\n")
print("ledger", len(ledger), "| questions", len(QUESTIONS), "dropped", len(DROPPED), "| held", sum(1 for c in CASES if c["marker"] != L.MARKER), "| report lines", len(R))
