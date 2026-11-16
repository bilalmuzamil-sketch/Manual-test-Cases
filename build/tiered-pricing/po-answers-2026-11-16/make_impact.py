"""Builds IMPACT-CASES.json and the case tables of IMPACT.md from Matt Barge's 16 Nov answers and the PRD v37->v38 diff.
Read-only measuring pass: nothing here writes to TestRail. Run from build/tiered-pricing: python3 po-answers-2026-11-16/make_impact.py"""
import json, csv, sys
sys.path.insert(0, 'po-answers-2026-11-16')
P = json.load(open('authoring/proposals.json'))
IDM = {r['key']: r['case_id'] for r in csv.DictReader(open('testrail-id-map.csv'))}
ANS = {a['number']: a for a in json.load(open('questions-2026-11-14/ANSWERS-2026-11-16.json'))['answers']}
def link(k): return f"[C{IDM[k]}](https://shopview.testrail.io/index.php?/cases/view/{IDM[k]})"

# ---- per question: decision, PRD v38 state ----
Q = {
 1: ("Breadcrumbs start at Pricing (or Categories), never at Settings", "design", "IN v38: S2-R28, S3-R26, S7-R6"),
 2: ("Delete [tier]? says \"This can't be undone.\" instead of the parts line; Archive keeps the parts line; follower list on both", "neither", "IN v38: S2-R30 + messages table (Archive and Delete rows split)"),
 3: ("Set Rule question as the PRD writes, no \"all\"", "PRD", "PRD unchanged (no fix needed)"),
 4: ("\"Uses previous tier\" everywhere", "PRD", "PRD unchanged (no fix needed)"),
 5: ("Default's page: both columns in the grid's short words", "PRD", "PRD unchanged (no fix needed)"),
 6: ("Categories line changeable only in Edit; parts price by the matrix only after Save; Cancel puts them back", "PRD+", "IN v38: S3-R13 (and S3-R12: categories save with the grid)"),
 7: ("Duplicate creates the copy at once", "PRD", "PRD unchanged (no fix needed)"),
 8: ("Add Range adds before the last range", "PRD", "PRD unchanged (no fix needed)"),
 9: ("Last range reads \"and up\" in view and edit", "PRD", "PRD unchanged (no fix needed)"),
 10: ("Neither the first nor the last range has a delete button; a 1- or 2-range matrix has none", "neither", "IN v38: S3-R16, S3-R32"),
 11: ("Grid errors next to the box only, no banner", "PRD", "PRD unchanged (no fix needed)"),
 12: ("Taken matrix name under the name box", "PRD", "PRD unchanged (no fix needed)"),
 13: ("% Off / $ Off column starts empty", "PRD", "PRD unchanged (no fix needed)"),
 14: ("Rule-type change counts 1, each changed box 1 more (3-range switch = 1, then 4); Audit Log records both", "neither", "IN v38: S4-R4 example + S19-R23 example (Matt named S19-R19; the sentence went into S19-R23)"),
 15: ("Save message in three forms per tier (one rule / per-range bullets / multiple rules)", "neither", "IN v38: S4-R12 + messages table"),
 16: ("Matrices list Part Sale Matrix column: \"Same as work orders\" or a rule summary", "design", "IN v38: S6-R1"),
 17: ("No-match messages: the PRD's full sentences with a period", "PRD", "PRD unchanged (no fix needed)"),
 18: ("Shared-matrix line above the grid (exception to the tooltip rule)", "PRD", "IN v38: S19-R15 exception added; S7-R15 unchanged"),
 19: ("New Category has Cancel and Create Category", "design", "IN v38: S8-R10 (the developers' plan Phase 16 still says Save and Cancel; the plan informs, never overrules)"),
 20: ("Category Delete question and taken-name error as the PRD words them", "PRD", "PRD unchanged (no fix needed)"),
 21: ("Uncategorized: read only, Pricing Matrix and Tax Exempt grayed, only QuickBooks Products and Services can be changed", "design", "IN v38: S8-R4"),
 22: ("Customers tab filter: Work orders / Part Sales / Both, each customer matches exactly one", "PRD+", "IN v38: S9-R9"),
 23: ("Counter Sale note as a tooltip", "PRD", "PRD unchanged (no fix needed)"),
 24: ("A line added to a Sent/Paid work order goes on a NEW work order, priced by the customer's current tier", "answer", "IN v38: S10-R14 (the PRD keeps it short; the answer adds: new number, Approved, paid one and invoice untouched)"),
 25: ("Receive shows the PRD's 6-second notice, nothing about tiers", "PRD", "PRD unchanged (no fix needed)"),
 26: ("Price details as the PRD says; on a Part Sale with no separate Part Sale pricing the side reads \"Same as work orders\"", "PRD+", "IN v38: S12-R2"),
 27: ("Change Customer notice counts only tier/Default lines", "PRD", "PRD unchanged (no fix needed)"),
 28: ("Reports: \"2 · Fleet\", \"(archived)\", \"Sales Type: All\"", "PRD", "Reports PRD unchanged (v21, no fix needed)"),
 29: ("Reports Category filter: Uncategorized first, then A to Z", "PRD", "Reports PRD unchanged (v21, no fix needed)"),
 30: ("Download filter lines: Sales Type, Category, Priced By, Customer", "PRD", "Reports PRD unchanged (v21, no fix needed)"),
 31: ("Columns and fields keep their place across state changes; the canvas moves are not intended", "PRD+", "IN v38: new S19-R24"),
}

# ---- held cases ----
HELD = {
 # release: the PO chose the design's version (Rule 130) or the PRD-following held case
 'D-50': (1, 'RELEASE', "Design wins. Marker to the standard one; re-check the whole case (Rule 134); add PRD v38 S2-R28/S3-R26 as its source."),
 'D-129': (16, 'RELEASE', "Design wins (S6-R1 v38). Marker updated; whole-case re-check."),
 'D-165': (19, 'RELEASE', "Design wins (S8-R10 v38). Marker updated; whole-case re-check."),
 'D-162': (21, 'RELEASE', "Design wins (S8-R4 v38). Change one result: the QuickBooks Products And Services picker can be changed (today it says only 'shows in its usual style'); the design board draws that select as disabled, so the result follows the PRD/answer, not the picture."),
 'RPT-63': (30, 'RELEASE', "The PO chose this case's order. Marker updated; drop the 'picture 20.20 shows the two the other way round' remark or keep it as a design note."),
 # rewrite then release
 'S3-17': (6, 'REWRITE', "Step 6 checks that category A's page still names matrix B before Save; neither v38 ('Picked categories show on the line at once; their parts are priced by this matrix only after Save') nor the answer ('saved in the picker when picked') says what the category page shows. Rewrite to check a part's PRICE before and after Save; release."),
 'S3-18': (6, 'REWRITE', "Same as S3-17 for a removed category (General Matrix pricing only after Save)."),
 'S10-39': (24, 'REWRITE', "The PO chose the opposite of this case: the added line goes on a NEW linked work order (new number, Approved), priced by the customer's CURRENT tier; the paid work order and its invoice are untouched. Title, steps and every result change; release."),
 'D-179': (31, 'REWRITE', "Rewrite to the PRD's S19-R24: Manage Customers columns keep their place when the search narrows the list; release."),
 'D-450': (31, 'REWRITE', "Rewrite: Sales by Tier columns keep their place when a row opens; release."),
 'D-451': (31, 'REWRITE', "Rewrite: Sales by Tier headings keep their place on the empty states; release."),
 'D-452': (31, 'REWRITE', "Rewrite: Sales by Category columns keep their place when a category opens; release."),
 'D-453': (31, 'REWRITE', "Rewrite: the lines table's columns keep their place while the Add Part row is open; release."),
 'D-454': (31, 'REWRITE', "Rewrite: the filter chips keep their place as a picked chip changes; release."),
 'D-63': (31, 'REWRITE', "Rewrite: the simulator columns keep their place between view and edit; release."),
 'D-64': (31, 'REWRITE', "Rewrite: opening the New Matrix category list does not push the tabs and grid; release (if the QA lead reads 'nothing moves down' as covering an opened list, see IMPACT.md)."),
}
for k, q in {'D-51':2,'D-52':3,'D-53':4,'D-54':5,'D-55':7,'D-58':8,'D-61':9,'D-65':10,'D-60':11,'D-62':12,'D-56':13,'D-57':14,'D-59':15,
             'D-130':17,'D-171':17,'D-147':18,'D-168':20,'D-172':22,'D-185':23,'D-442':25,'D-211':26,'D-224':27,'D-440':28,'D-441':29,'D-443':30}.items():
    why = "The PRD wins; the design's version is ruled out (Rule 130: delete with the QA lead's go-ahead, record the ruling)." if Q[q][1] != 'neither' else \
          "The PO chose neither the PRD's v37 wording nor the design's; the design-version case is ruled out (delete); the new behaviour goes into the changed/new cases listed for this question."
    HELD[k] = (q, 'DELETE', why)

# ---- released cases whose tester-facing text changes ----
CHANGE = {
 'S2-53': (1, "Breadcrumb 'Settings › Pricing › Tiers › tier A' becomes 'Pricing › Tiers › tier A'."),
 'S2-54': (1, "Same breadcrumb change (opened from a bookmark)."),
 'S2-58': (1, "Breadcrumb 'Settings › Pricing › Tiers › tier A › matrix A' loses 'Settings ›'."),
 'S3-01': (1, "Breadcrumb 'Settings › Pricing › Matrices › matrix A' loses 'Settings ›'."),
 'S3-02': (1, "Breadcrumb 'Settings › Categories › category A › matrix A' loses 'Settings ›'."),
 'S3-03': (1, "Breadcrumb 'Settings › Categories › Uncategorized › General Matrix' loses 'Settings ›'."),
 'S3-05': (1, "Bookmark breadcrumb loses 'Settings ›'."),
 'S7-10': (1, "Category page breadcrumb 'Settings › Categories › category A' loses 'Settings ›'."),
 'D-143': (1, "Design case: breadcrumb loses 'Settings ›'."),
 'D-144': (1, "Design case: breadcrumb loses 'Settings ›'."),
 'D-145': (1, "Design case: New Matrix breadcrumb loses 'Settings ›'."),
 'D-164': (1, "Design case: New Category breadcrumb loses 'Settings ›' (its unnamed 'blue button' steps already fit Q19)."),
 'S2-35': (2, "Delete dialog reads \"This can't be undone.\" instead of \"Parts already on work orders keep their prices.\"."),
 'D-14': (2, "Design case: same Delete dialog wording change (picture 2.29/2.30 still show the old lines until the canvas changes)."),
 'S3-40': (6, "Step 8 rests on v37 'changing its categories ... save without asking', removed in v38 ('categories save with the grid'). Whether a categories-only Save on a 2-category matrix asks Change All is not settled by v38: re-derive, or hold on follow-up question F2."),
 'S3-28': (10, "Step 3: only the middle range has a delete button (not the first); step 5: the two remaining ranges show no delete button."),
 'S6-02': (16, "Matrix A's Part Sale Matrix reads \"Same as work orders\" instead of Off."),
 'S6-03': (16, "Reads \"Same as work orders\" before, and its Part Sale rules in short after the switch is on (title changes too: no 'reads On')."),
 'S6-07': (16, "Part Sale Matrix shows the Part Sale rules in short instead of On."),
 'S8-02': (19, "The New Category page shows Cancel and Create Category (not Save and Cancel)."),
 'S8-03': (19, "Title 'creates nothing until Save' becomes 'until Create Category'; steps unchanged."),
 'S8-04': (19, "'Click Save' on New Category becomes 'Click Create Category'."),
 'S8-12': (19, "'Click Save' on New Category becomes 'Click Create Category'."),
 'INV-47': (19, "Invariant case: 'Click Save' (twice) on New Category becomes 'Click Create Category'."),
 'S16-06': (19, "'Click Save' on New Category becomes 'Click Create Category'."),
 'S16-15': (19, "'Click Save' on New Category becomes 'Click Create Category'."),
 'S6-08': (19, "'Click Save' on New Category becomes 'Click Create Category'."),
 'S8-06': (21, "Uncategorized's page: Pricing Matrix and Tax Exempt shown grayed (not 'no Pricing Matrix picker'); QuickBooks Products and Services can be changed when QuickBooks is connected."),
 'S9-26': (22, "Step 7 adds that customer A (on tier A for both channels) is hidden under Part Sales: each customer matches one option."),
 'S12-12': (26, "Part Sale with no separate Part Sale pricing: the price details' side reads \"Same as work orders\", not Work Order Matrix."),
}
LIB = {
 'S2-31': (2, "Archive question unchanged; its S2-R30 quote is re-anchored to v38 (the '(or \"Delete <tier>?\") with the same last line' sentence changed)."),
 'S2-32': (2, "Archive follower list unchanged; S2-R30 quote re-anchored ('After the list, Archive says ...')."),
 'S3-06': (6, "Rename-only case unchanged; S3-R12 quote re-anchored ('Renaming and turning the Part Sale switch on save without asking')."),
 'S3-27': (10, "Last range still has no delete button; S3-R16 quote re-anchored ('Neither can be removed, so every cost is covered')."),
}
REFS_ONLY = {k: (31, "S19-R24 added to References (the case already checks that columns keep their place in a state S19-R24 lists).") for k in ['D-123','D-149','D-78']}
NEW = [
 (2, "Delete a tier that a later tier follows: the question lists the follower, then \"This can't be undone.\" (no parts line)", "S2-R30 v38 + messages table"),
 (6, "In view, the Categories line cannot be changed; Edit turns it into the picker", "S3-R13 v38"),
 (6, "Cancel after picking a category puts the line back and the category's parts keep their old matrix price", "S3-R13 v38"),
 (14, "Switching a 3-range column to % Off counts 1 change; typing a value in each box makes 4", "S4-R4 v38"),
 (14, "After that save, the Audit Log entry records the rule-type change and the 3 range values", "S19-R23 v38"),
 (15, "Different values per range: the saved message reads \"tier A is\" and one bullet per range", "S4-R12 v38"),
 (15, "More than one rule type in a tier: \"tier A is multiple rules\" and one bullet per type", "S4-R12 v38"),
 (21, "Uncategorized's QuickBooks Products and Services can be changed and saved (QuickBooks connected: staging)", "S8-R4 v38"),
 (22, "Work orders and Both each list only the customers on the tier for exactly that", "S9-R9 v38"),
]
WATCH = {k: (31, "Expects a bar/notice/error line to push the list DOWN by its own height. S19-R24 lists the states that must not move anything and these are not among them, so the case stays as it is (no question needed: the PRD's own list settles it).") for k in ['D-166','D-175','D-225','D-76','D-77']}

def row(k, q, v, why, run):
    return {"key": k, "case_id": IDM[k], "link": f"https://shopview.testrail.io/index.php?/cases/view/{IDM[k]}", "question": q,
            "verdict": v, "held": P[k]['held'], "in_run_560": run, "title": P[k]['title'], "what_changes": why}
out = []
for k, (q, v, why) in HELD.items(): out.append(row(k, q, v, why, False))
for k, (q, why) in CHANGE.items(): out.append(row(k, q, 'CHANGE', why, True))
for k, (q, why) in LIB.items(): out.append(row(k, q, 'LIBRARY-ONLY', why, True))
for k, (q, why) in REFS_ONLY.items(): out.append(row(k, q, 'REFS-ONLY', why, True))
for k, (q, why) in WATCH.items(): out.append(row(k, q, 'CONFIRMED (checked)', why, True))
for r in out: assert r['held'] == (r['verdict'] in ('RELEASE','REWRITE','DELETE')), r['key']
assert sum(1 for r in out if r['held']) == 41
json.dump({"made": "2026-11-16", "prd": "938213378 page v38 (2026-11-16T12:28:08Z)", "cases": out,
           "new_cases": [{"question": q, "what": w, "source": s} for q, w, s in NEW]},
          open('po-answers-2026-11-16/IMPACT-CASES.json', 'w'), indent=1, ensure_ascii=False)

def table(verdict):
    L = [r for r in out if r['verdict'] == verdict]; L.sort(key=lambda r: (r['question'], r['key']))
    s = "| Q | Case | C-id | Title | What changes |\n|---|---|---|---|---|\n"
    for r in L: s += f"| {r['question']} | {r['key']} | {link(r['key'])} | {r['title']} | {r['what_changes']} |\n"
    return s, len(L)
T = {v: table(v) for v in ('RELEASE','REWRITE','DELETE','CHANGE','LIBRARY-ONLY','REFS-ONLY','CONFIRMED (checked)')}
qt = "| # | Topic | Chosen | Decision | PRD v38 |\n|---|---|---|---|---|\n"
for n in range(1, 32):
    d, who, prd = Q[n]
    held = ', '.join(f"{k} {link(k)}" for k, (q, v, w) in HELD.items() if q == n)
    qt += f"| {n} | {ANS[n]['topic'].split(': ',1)[-1]} | ({ANS[n]['chosen']}) | {d}. Held: {held or '—'} | {prd} |\n"
nt = "| Q | New case (proposed, not written) | Source |\n|---|---|---|\n" + ''.join(f"| {q} | {w} | {s} |\n" for q, w, s in NEW)
json.dump({"T": {k: v[0] for k, v in T.items()}, "N": {k: v[1] for k, v in T.items()}, "qt": qt, "nt": nt, "new": len(NEW)},
          open('/tmp/claude-0/-home-user-Manual-test-Cases/06e6c85d-c9b5-5e70-a786-f21cb2d333a2/scratchpad/tables.json', 'w'))
print({k: v[1] for k, v in T.items()}, 'new', len(NEW))
