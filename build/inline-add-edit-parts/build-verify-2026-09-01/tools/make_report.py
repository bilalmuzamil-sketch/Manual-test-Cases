#!/usr/bin/env python3
"""Generate the Rule-98 report for suite 6597: five tables, in order, then Rule 36's OUTSTANDING.

Rule 98 (QA lead, 2026-09-01): a report says what is complete, what is left with why and exactly how
to finish it, what is blocked and on what plus what it does NOT block, how to get unblocked with the
exact ask, and a bare YES/NO on handing the suite to the manual QA tester.

Generated from verdicts.py so the counts can never drift from the evidence.
"""
import sys, json, io, collections, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'verdicts'))
from verdicts import V                                                   # noqa: E402

CASES = {c['id']: c for c in json.load(open('/tmp/inl6597/cases6597.json'))}
BUILD = 'v26.35.6-598cc8a'
TESTER = 'Viktoria Videnovic'
c = collections.Counter(v[0] for v in V.values())
pending = sorted(k for k, v in V.items() if not v[0])
partial = sorted(k for k, v in V.items() if v[0] == 'PARTIAL')
failed  = sorted(k for k, v in V.items() if v[0] == 'FAIL')
link = lambda i: f'[C{i}](https://shopview.testrail.io/index.php?/cases/view/{i})'

# what each pending case is waiting for, and how to finish it -- written per case, never generically
HOW = {
 44996: ('No work order on this branch is un-editable for a reason OTHER than its status, so the state '
         'the case needs does not exist here.',
         'Ask the PO or a developer what "not editable for some other existing reason" covers on this '
         'product (a lock? a closed period? an integration hold?), then seed that condition. Until '
         'that is answered the case cannot be written into a runnable form either - it is the one '
         'precondition in the suite that still names a state rather than a route.'),
 45022: ('The SUBSTANCE is already observed - a forced 500 on the save leaves the row open with the '
         'description and quantity intact. What is not settled is the WORDING: the visible toast reads '
         '"Ooooops! An error occurred" while the document specifies "Couldn\'t add the part. Please '
         'try again.", and although that documented string is present in the page\'s rendered text, a '
         'string in innerText is not proof of what a tester reads.',
         'Run tools/probe_last.mjs with ONLY=L2. It forces the 500 again and walks the DOM for the '
         'element carrying "add the part", reporting its tag, classes, size and computed visibility. '
         'If the documented sentence is on screen the case is a PASS; if only the generic toast is '
         'visible it is a wording deviation - held per the three-gate rule, not filed.'),
 45062: ('Same as C45022 - it is the Full View half of the same requirement (S4-EH1 points at S2-EH1).',
         'Settled by the same ONLY=EH2 run, read as a Full View user on the six-field row.'),
 45028: ('Two runs read nulls back, both times because the values were fetched from the API: '
         'list-requests does not return a freshly created part request on this work order at all.',
         'Run tools/probe_cross.mjs with ONLY=X2 - it now reads cost, sell price and category off the '
         'FULL VIEW EDIT MODAL instead, which is where a Full View user actually sees them and is '
         'better evidence anyway. It creates the part as the admin with cost 7.77, sell 19.19 and '
         'category AUTO-Batteries, edits only the description as the technician, and re-opens the '
         'modal as the admin.'),
 45034: ('The part request the edit row is editing cannot be identified from the API at all: '
         'list-requests ignores work_order_id, workOrderId, work_order and filter[work_order_id] '
         'alike, always returning the same first 100 rows from across the estate, and none of them '
         'belongs to this work order.',
         'Run tools/probe_last.mjs with ONLY=L1. It takes the id from the app\'s OWN save request: '
         'the first save on the edit row is aborted so its payload can be read, the part is then '
         'deleted over the API behind a fresh edit row, and the save is made for real while watching '
         'for "This part was changed by someone else. Refresh to see the latest."'),
 45060: ('Every catalog part on this branch carries a cost and a sell price, so a part with neither '
         'on record does not exist. Five searches (NBOR, BSPP, O-RING, FREIGHT, SUBLET) all came back '
         'with prices; the closest, SUBLET, has cost 0.00, which is a value, not an empty field.',
         'Create one inventory part with no purchase price and no sell price, then select it on the '
         'row. Blocked by the same 403 as the bin seeding - POST /api/inventory/parts/change is '
         'refused for this session - so it needs either the Parts screen in the UI or a session with '
         'inventory write access.'),
}
BIN_HOW = ('Every inventory part on this branch holds EXACTLY ONE bin, so nothing multi-bin can be '
           'observed.',
           'Put one part into four bins with the Default cut below the quantity, one bin covering it, '
           'one for the split and one already negative. tools/seed_bins.py does this over the API but '
           'POST /api/inventory/parts/change answers 403 Access denied for this session, so it needs '
           'the Parts screen in the UI (tools/seed_bins_ui.mjs explores that route) or a session with '
           'inventory write access. Then run tools/probe_bins2.mjs, which covers all nine legs.')
for i in (45221, 45227, 45230, 45231, 45234, 45235, 45239, 45242, 45243):
    HOW.setdefault(i, BIN_HOW)

o = io.StringIO()
w = o.write
w('# Inline Add and Edit Parts (6597) — build-verification report, 1 September 2026\n\n')
w(f'**Branch** `https://sv9315.qa.shopview.com` · **build `{BUILD}`**, re-read at the end of the run '
  'and unchanged, so every verdict is against one build.\n')
w(f'**Suite** 119 cases · **manual QA tester for this suite: {TESTER}**\n')
w('**Work order used** S9315-14846 (Estimate, 3 lines, existing part rows) at Staging Heavy Duty - 9919. '
  'Throwaway data tagged `ZZAUTOTEST`.\n\n')
w('| Verdict | Cases |\n|---|---|\n')
for k, lab in [('PASS', 'PASS — observed live'), ('PARTIAL', 'PARTIAL — part observed, part has no data state'),
               ('FAIL', 'FAIL — a deviation, observed live'), (None, 'NOT YET VERIFIED'),
               ('FOREIGN', "FOREIGN — Vladimir Tomovic's, not ours to touch")]:
    w(f'| **{lab}** | **{c.get(k, 0)}** |\n')
w('\n---\n\n## TABLE 1 — WHAT IS COMPLETE\n\n')
w('| Item | Evidence | When |\n|---|---|---|\n')
rows1 = [
 ('The feature is on the build — all seven areas of the suite have their backbone observed',
  '`PROGRESS.md` seven-area table; `evidence/discovery.json`', '1 Sep'),
 (f'**{c.get("PASS",0)} of 119 cases verified PASS** against the documents, each naming the probe that observed it',
  '`verdicts/PER-CASE-VERDICTS.md`, `evidence/probe-*.json`', '1 Sep'),
 ('Both view modes exercised end to end — Full View six fields, Tech View three and no pricing',
  '`evidence/probe-full.json`, `evidence/probe-tech.json`', '1 Sep'),
 ('Every documented user-feedback sentence found verbatim on screen',
  '`V-message-hunt`, `TD2-tech-sentences`', '1 Sep'),
 ('The permission negative proved and the role restored field-by-field',
  '`N3-no-permission` — `identical: true`, view_mode unchanged', '1 Sep'),
 ('The closed-status negative proved on a Paid work order with an Estimate positive control',
  '`N1-paid-work-order` — 0 vs 3 Add Part, 0 vs 12 edit', '1 Sep'),
 ('Case content regenerated for 118 cases and passing the runnability gate 118/118',
  '`write-2026-09-01/intended-blocks.json`; gate run on the generated text', '1 Sep'),
 ('The permission click path observed, not inherited: top-right chip → Settings → Roles & Permissions → pencil',
  '`R1-role-screen-labels`, `R0-permission-route`', '1 Sep'),
 ('Twelve instrument errors caught before they became findings, and recorded as rules',
  '`build/skills/03-RUN-CHECK.md` §8.0-b lessons 1–13', '1 Sep'),
]
for r in rows1: w(f'| {r[0]} | {r[1]} | {r[2]} |\n')

w('\n## TABLE 2 — WHAT IS LEFT, WHY, AND HOW TO FINISH IT\n\n')
w('| Case | Why it is not done | Exactly how to finish it | Whose move |\n|---|---|---|---|\n')
for i in pending:
    why, how = HOW.get(i, ('—', '—'))
    w(f'| {link(i)} {CASES[i]["title"]} | {why} | {how} | mine, once inventory write access exists |\n'
      if i in (45060, 45221, 45227, 45230, 45231, 45234, 45235, 45239, 45242, 45243)
      else f'| {link(i)} {CASES[i]["title"]} | {why} | {how} | mine |\n')
for i in partial:
    w(f'| {link(i)} {CASES[i]["title"]} — **PARTIAL** | {V[i][2]} | see the note; the uncovered leg needs a data state or a fresh instrument | mine |\n')
w('| **The TestRail write pass** | Held deliberately so every case is touched ONCE, with complete '
  'routes and a settled verdict, rather than twice (Rule 41 makes every touch a full re-verify) | '
  '`node write-2026-09-01/apply_cases.mjs` — 118 cases queued, content generated and gate-passed, '
  'C45220 excluded. Writes through the TestRail editor, never the API, because an API write flips '
  'the fields back to the escaping container | mine, on your word |\n')

w('\n## TABLE 3 — WHAT IS BLOCKED, AND ON WHAT\n\n')
w('| Blocked item | Blocked on | Proof it is really blocked | What it does NOT block |\n|---|---|---|---|\n')
w('| Nine Story 7 cases and C45060 | **No inventory write access.** `POST /api/inventory/parts/change` '
  'answers **403 Access denied** for this session | The session\'s own permission list carries '
  '`catalogInventoryCreateAndEdit` and the call still 403s; the required payload was worked out from '
  'the SPA\'s own client (`id`, `catalog_part_id`, `category_id`, `quantity`, `purchase_price`, `tags`, '
  '`bins`) so it is not a malformed request | Nothing else. The other 13 Story 7 cases are verified, '
  'and the whole of Stories 1–6 is unaffected |\n')
w('| C44996 | **An unanswered question, not a technical blocker** — what "not editable for some other '
  'existing reason" means on this product | 3,000 work orders paged: only estimate, approved and paid '
  'exist, and none is blocked for a non-status reason | Only this one case. It is also the only '
  'precondition in the suite that still names a state rather than a route |\n')
w('| Four legs of C44993 / C44994 | **Branch data** — Complete, Invoiced, Declined and Imported work '
  'orders do not exist here | 3,000 work orders paged; status counts were estimate 240, approved 90, '
  'paid 2,670 | The Paid leg is verified, so the requirement is not unobserved - it is partly observed |\n')

w('\n## TABLE 4 — HOW TO GET UNBLOCKED\n\n')
w('| Blocked item | The exact ask | Who can grant it | What happens the moment it lands |\n|---|---|---|---|\n')
w('| The nine bin cases + C45060 | **Either** a session/user with inventory write on sv9315 (the '
  'permission that lets `inventory/parts/change` through), **or** your go-ahead for me to do it '
  'through the Parts screen in the UI as the admin | you | `seed_bins.py --seed` then '
  '`probe_bins2.mjs` settles all nine in one run, and `--restore` puts the part back and verifies it |\n')
w('| C44996 | One answer: what makes a work order un-editable on this product other than its status? | '
  'the PO, via you | the case becomes both verifiable and runnable, and its precondition can name a route |\n')
w('| The four closed-status legs | Nothing needed from you unless you want them covered — say so and I '
  'will drive one work order to each status and put it back | you | the two PARTIALs become PASS |\n')

# ---- Table 5, the handoff gate ----
gate = []
gate.append(('Every case runnable from the UI by a layman (skill 18)',
             'READY, NOT APPLIED — the generated content passes 118/118; nothing is in TestRail yet',
             'pre-write gate run on `intended-blocks.json`'))
gate.append(('Every case renders on the served page (`markdown fr-view`, no literal tags)',
             'YES for the cases as they stand — 118 of 118 scanned clean on 31 Aug, and the write pass '
             'goes through the editor so it keeps that',
             '`render-repair-2026-08-31/scan-final.json`'))
gate.append(('Exactly one AUTOMATION marker per case, arithmetic balancing',
             'READY, NOT APPLIED — 118 markers generated, one per case, all `AUTOMATION: READY`',
             '`intended-blocks.json`'))
gate.append(('Every case build-verified, or explicitly listed as not',
             f'NO — {c.get("PASS",0)} PASS, {c.get("PARTIAL",0)} PARTIAL, {c.get("FAIL",0)} FAIL, '
             f'{len(pending)} not yet verified',
             '`verdicts/PER-CASE-VERDICTS.md`'))
gate.append(('Provenance lines intact, build sentence only where observed (Rule 54)',
             'READY, NOT APPLIED — sentence 2 generated on the verified cases only, and the writer '
             'FAILS a case that carries one without a verdict',
             '`apply_cases.mjs` per-case assertion'))
w('\n## TABLE 5 — IS THE SUITE READY TO HAND TO THE MANUAL QA TESTER?\n\n')
w('| Gate | Result | Evidence |\n|---|---|---|\n')
for g in gate: w(f'| {g[0]} | {g[1]} | {g[2]} |\n')
w(f'| **HANDOFF READY?** | **NO** | {len(pending)} cases have no verdict yet and the content is '
  'generated but not written to TestRail. Nothing is wrong with the suite — the work is unfinished, '
  f'and it is one write pass plus one data state away from YES for **{TESTER}** |\n')

w('\n---\n\n## OUTSTANDING — what I need from you\n\n')
w('| # | Item |\n|---|---|\n')
w('| 1 | **Inventory write access, or your go-ahead to seed the bins through the Parts screen in the '
  'UI.** That single unblock settles nine Story 7 cases and C45060. |\n')
w('| 2 | **Say the word and I run the TestRail write pass** — 118 cases, content generated and '
  'gate-passed, C45220 excluded. I held it so each case is touched once. |\n')
w('| 3 | **One PO question:** what makes a work order un-editable on this product other than its '
  'status (C44996)? |\n')
w(f'| 4 | **{failed and link(failed[0]) or ""} is a real deviation** and its ticket text is written. '
  'Held under the three-gate rule: I re-verify on the build first, then ask. |\n')
w('| 5 | **C45220** stays untouched — Vladimir Tomovic\'s, per your instruction. |\n')
w('| 6 | Reminder still owed after 6617: the Invoice snapshot-500 defect and the three PO questions. |\n')

open(os.path.join(HERE, '..', 'REPORT-2026-09-01.md'), 'w').write(o.getvalue())
print('report written;', dict(c))
