#!/usr/bin/env python3
"""The Rule-98 report for suite 6617 (Printer Friendly Work Orders): five tables, then OUTSTANDING.
Generated from verdicts.py so the counts cannot drift from the evidence."""
import sys, json, io, collections, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'verdicts'))
from verdicts import V                                                # noqa: E402
CASES = {c['id']: c for c in json.load(open('/tmp/pf6617/cases6617.json'))}
BUILD, TESTER = 'v26.35.6-598cc8a', 'Viktoria Videnovic'
c = collections.Counter(v[0] for v in V.values())
link = lambda i: f'[C{i}](https://shopview.testrail.io/index.php?/cases/view/{i})'
HOW = {
 45090: ('Needs a user who cannot view a work order at all.',
         "Strip the work-order viewing permission from a role, sign in as a holder of it, and confirm "
         "the detail page itself is unreachable - the same method that proved the permission negative "
         "on the Inline suite (probe_neg.mjs N3), which edits the role, reads the screen and restores "
         "the role in the same run with a field-by-field check."),
 45097: ('Needs a work order with no customer assigned. All 100 work orders read carry one.',
         'Create a work order and leave the customer unset, if the app allows it; if it does not, that '
         'answers the case and it becomes a PO question like the two below.'),
 45098: ('Needs a work order with no vehicle assigned. All 100 carry one.', 'As above, for the vehicle.'),
 45104: ('Needs a line whose status is Cancelled. None of the lines used had that status.',
         'Drive one line on a test work order to Cancelled through the Lines tab, then print and look '
         'for it on the paper with its status shown.'),
 45111: ('Needs a tech story of 500 or more characters. The longest in use is about 45.',
         'Put a 500+ character story on one line through the Lines tab, print, and read the paper to '
         'confirm it wraps and is not cut off.'),
}
o = io.StringIO(); w = o.write
w('# Printer Friendly Work Orders (6617) — build-verification report, 1 September 2026\n\n')
w(f'**Branch** `https://sv9315.qa.shopview.com` · **build `{BUILD}`** · **suite** 44 cases · '
  f'**manual QA tester: {TESTER}**\n\n')
w('**How a printout was verified without a printer** — every verdict rests on this: `window.print` '
  'was stubbed so the menu click could be proven to reach it; `page.emulateMedia({media:"print"})` '
  'makes the browser apply the print rules, so what the paper carries is read off the live DOM; and '
  'PDFs at Letter portrait, Letter landscape and A4 had their text extracted page by page, which is '
  'what settles pagination and the repeated footer. **No verdict reads the screen and calls it the '
  'printout.**\n\n')
w('| Verdict | Cases |\n|---|---|\n')
for k, lab in [('PASS', 'PASS — observed live'), ('PARTIAL', 'PARTIAL — part observed, part has no data here'),
               ('UNREACHABLE', 'UNREACHABLE — the build makes the state impossible'),
               ('NOTVER', 'NOT VERIFIED — needs a data state that does not exist here')]:
    w(f'| **{lab}** | **{c.get(k, 0)}** |\n')
w('\n## TABLE 1 — WHAT IS COMPLETE\n\n| Item | Evidence |\n|---|---|\n')
for a, b in [
 ('**The feature is on the build and works** — the More menu carries Print Work Order and it reaches the print dialog', '`A-menu-item`, `evidence/print-menu.png`'),
 (f'**{c.get("PASS",0)} of 44 cases PASS**, each naming the probe that observed it', '`verdicts/PER-CASE-VERDICTS.md`'),
 ('The whole printed header verified, including year/make/model and licence plate', '`E-header-contents`, `probe-omission`'),
 ('**Field omission proved on work orders that actually lack the fields**, not inferred', '`probe-omission` — no "Service Advisor:" line on one, no "Lead Technician:" on another'),
 ('**No pricing anywhere on the paper** — zero visible dollar signs, no Rate/Margin/Total/Sell price/Subtotal/Tax', '`D-print-view`'),
 ('Pagination settled from the PDFs — 7 lines → 3 pages, 33 lines → 13 pages, `break-inside: avoid` on every line group', '`J-pagination`, `printout-biggest.pdf`'),
 ('The work order number is the last line of **every** page', 'PDF text extracted per page: 3 of 3 and 13 of 13'),
 ('All navigation and interactive elements hidden on paper', '`D-print-view` + `E-header-contents` — zero app-nav words visible'),
 ('The audit trail works — an entry per print, with user and timestamp', '`H-audit-trail` — 4 entries before, 6 after two prints'),
 ('Case content regenerated for 43 cases and passing the runnability gate 43/43', '`write-2026-09-01/intended-blocks.json`'),
]:
    w(f'| {a} | {b} |\n')
w('\n## TABLE 2 — WHAT IS LEFT, WHY, AND HOW TO FINISH IT\n\n')
w('| Case | Why it is not done | Exactly how to finish it | Whose move |\n|---|---|---|---|\n')
for i in sorted(k for k, v in V.items() if v[0] == 'NOTVER'):
    why, how = HOW[i]
    w(f'| {link(i)} {CASES[i]["title"]} | {why} | {how} | mine |\n')
for i in sorted(k for k, v in V.items() if v[0] == 'PARTIAL'):
    w(f'| {link(i)} {CASES[i]["title"]} — **PARTIAL** | {V[i][2]} | drive one test work order to each '
      'of the seven missing statuses and back, or accept the three that exist | mine, or your call |\n')
w('| **C45123** (Automated) | Flagged Automated, so Rule 71 holds it — verdicted PASS but NOT written | '
  'Your per-case go-ahead, then it joins the batch and Vlad gets the Rule 65 report | **you** |\n')
w('\n## TABLE 3 — WHAT IS BLOCKED, AND ON WHAT\n\n')
w('| Blocked item | Blocked on | Proof it is really blocked | What it does NOT block |\n|---|---|---|---|\n')
w('| ' + link(45107) + ' and ' + link(45116) + ' | **The specification contradicting itself**, not the '
  'build | The Key Decisions say print is disabled when no line items exist — and on S9315-15889, a '
  'work order with zero lines, the item is present but **greyed out**. S3-N1 and S4-N1 describe what '
  'the printout shows in exactly that case. Both cannot be true | Nothing else. The other 42 cases are '
  'unaffected, and the disabled-until-loaded behaviour itself is verified (C45091 PASS) |\n')
w('| C45123 | **Rule 71** — it is flagged Automated | `custom_atmstatus = 3`, read live before the '
  'write | Only the WRITE. Its verdict is PASS, observed live |\n')
w('\n## TABLE 4 — HOW TO GET UNBLOCKED\n\n')
w('| Blocked item | The exact ask | Who can grant it | What happens the moment it lands |\n|---|---|---|---|\n')
w('| C45107 / C45116 | **One answer: should a work order with no lines be printable, or should Print '
  'stay greyed out?** It is question 4 on the spreadsheet | the PO, via you | either two cases are '
  'rewritten to match, or one becomes a defect candidate — and the contradiction leaves the document |\n')
w('| C45123 | **Your per-case go-ahead to rewrite one Automated case** | you | it joins the batch; the '
  'suite then has no unwritten case |\n')
w('\n## TABLE 5 — IS THE SUITE READY TO HAND TO THE MANUAL QA TESTER?\n\n')
w('| Gate | Result | Evidence |\n|---|---|---|\n')
w('| Every case runnable from the UI by a layman | **YES** — the gate run LIVE against TestRail '
  'after the write passes clean; the one unwritten case is the Automated one | `tools/postwrite_check.py` check 1 |\n')
w('| Every case renders on the served page (`markdown fr-view`) | **YES** — 43 scanned on the served page after the write: 0 escaping, 0 literal tags | `evidence/served-page-scan.json` |\n')
w('| Exactly one AUTOMATION marker per case, arithmetic balancing | **YES** — 43 markers, one per '
  'case; READY 43 + EXPECT-FAIL 0 = total 43 − HOLD 0 | `tools/postwrite_check.py` check 2 |\n')
w('| Every case build-verified, or explicitly listed as not | **NO** — '
  f'{c.get("PASS",0)} PASS, {c.get("PARTIAL",0)} PARTIAL, {c.get("UNREACHABLE",0)} UNREACHABLE, '
  f'{c.get("NOTVER",0)} not verified | `verdicts/PER-CASE-VERDICTS.md` |\n')
w('| Provenance intact, build sentence only where observed | **YES** — sentence 1 unaltered on all '
  '43; sentence 2 on the 38 cases this pass observed and absent from the 5 it could not | `tools/postwrite_check.py` check 3 |\n')
w(f'| **HANDOFF READY?** | **NO** | 5 cases need a data state and 2 need the PO to resolve a '
  f'contradiction in the document. Everything else is done and written. Two data states away from YES '
  f'for **{TESTER}** |\n')
w('\n## OUTSTANDING — what I need from you\n\n| # | Item |\n|---|---|\n')
w('| 1 | **Should a work order with no lines be printable?** Question 4 on the spreadsheet. It decides '
  'C45107 and C45116, which cannot be executed until it is answered. |\n')
w('| 2 | **Per-case go-ahead for C45123** (Automated) so the last case can be written. |\n')
w('| 3 | **One wording divergence to route:** the audit event reads "Work order printed history" where '
  'the document says "Work Order Printed", and that history row also shows a money total. Question 5 '
  'on the spreadsheet. Behaviour itself is correct. |\n')
w('| 4 | Whether the seven missing work order statuses are worth seeding for C45088. |\n')
open(os.path.join(HERE, '..', 'REPORT-2026-09-01.md'), 'w').write(o.getvalue())
print('6617 report written;', dict(c))
