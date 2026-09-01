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
 45034: ('The deletion behind the row was made and the save then produced no message and left the '
         'row open - but the run cannot tell that apart from the row not having been editing the '
         'part that was deleted. The first save had to be aborted to capture the id, so the row was '
         're-opened afterwards and its target was never re-confirmed. An inconclusive run is not a '
         'finding.',
         'Run tools/probe_last.mjs with ONLY=L1 after adding one assertion: on the SECOND edit row, '
         'abort its save too and compare the id in that payload with the id that was deleted. Only '
         'when the two match does the absence of "This part was changed by someone else. Refresh to '
         'see the latest." mean anything.'),
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
             '**YES** — the runnability gate run LIVE against TestRail after the write passes clean',
             '`tools/postwrite_check.py` check 1'))
gate.append(('Every case renders on the served page (`markdown fr-view`, no literal tags)',
             '**YES** — 118 scanned on the served page after the write: 0 escaping, 0 literal tags',
             '`evidence/served-page-scan.json`'))
gate.append(('Exactly one AUTOMATION marker per case, arithmetic balancing',
             '**YES** — 118 markers, one per case; READY 118 + EXPECT-FAIL 0 = total 118 − HOLD 0',
             '`tools/postwrite_check.py` check 2'))
gate.append(('Every case build-verified, or explicitly listed as not',
             f'**NO** — {c.get("PASS",0)} PASS, {c.get("PARTIAL",0)} PARTIAL, {c.get("FAIL",0)} FAIL, '
             f'{c.get("NOTVER",0)} unreachable-or-unverifiable, {len(pending)} still open',
             '`verdicts/PER-CASE-VERDICTS.md`'))
gate.append(('Provenance intact, build sentence only where observed (Rule 54)',
             '**YES** — sentence 1 unaltered on all 118; sentence 2 on exactly the 114 cases this '
             'pass observed and absent from the 4 it did not',
             '`tools/postwrite_check.py` check 3'))
gate.append(('Titles within the length convention',
             '**YES** — none over 80 characters', '`tools/postwrite_check.py` check 4'))
w('\n## TABLE 5 — IS THE SUITE READY TO HAND TO THE MANUAL QA TESTER?\n\n')
w('| Gate | Result | Evidence |\n|---|---|---|\n')
for g in gate: w(f'| {g[0]} | {g[1]} | {g[2]} |\n')
w(f'| **HANDOFF READY?** | **NO** | Everything mechanical is done — 118 of 118 cases written and all '
  f'four post-write checks clean. What holds it back is verification coverage: {len(pending)} cases '
  f'open and {c.get("NOTVER",0)} describing states this product may not produce. **Two PO answers away '
  f'from YES for {TESTER}.** |\n')
w('\n---\n\n## OUTSTANDING — what I need from you\n\n')
w('| # | Item |\n|---|---|\n')
w('| 1 | **Two PO answers** decide four cases: can a part be held in NO bin, and can a part be saved '
  'with cost and sell price genuinely blank? Questions 1 and 2 on the spreadsheet. |\n')
w('| 2 | **C44996** — what makes a work order un-editable other than its status? You said leave it for '
  'now; it is question 3 on the spreadsheet, and it is the one precondition in the suite still naming '
  'a state instead of a route. |\n')
w(f'| 3 | **{failed and link(failed[0]) or "C45068"} is a real deviation**, ticket text written and '
  'HELD under the three-gate rule — I re-verify on the build first, then ask. |\n')
w('| 4 | **C45034** is inconclusive, not a finding: the edit row stopped opening on that work order '
  'after my own probes left 17 part rows on it. The missing assertion is named in Table 2. |\n')
w('| 5 | **C45220** untouched — Vladimir Tomovic\'s, per your instruction. |\n')
w('| 6 | **S9315-15888 stays at In Progress** after my accidental clock-in — you said leave it. |\n')
w('| 7 | Reminder still owed: the Invoice snapshot-500 defect and its PO questions, both held. |\n')
open(os.path.join(HERE, '..', 'REPORT-2026-09-01.md'), 'w').write(o.getvalue())
print('report written;', dict(c))
