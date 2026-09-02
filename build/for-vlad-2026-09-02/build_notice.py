#!/usr/bin/env python3
"""Build ONE consolidated Rule-65 notice for Vladimir Tomovic.

Four separate notice files had accumulated (2026-08-31, 09-01, and two on 09-02), which is four things
to forward and four chances to miss one. This reads TestRail LIVE, confirms each case still carries
custom_atmstatus = 3, and emits a single notice.

Scope: the Automated cases in the three suites the QA lead authorised on 2026-09-02 that WE changed.
C45220 is excluded and named as excluded - created_by = 1, Vladimir's own, never touched.
"""
import base64, html, json, re, sys, urllib.request
sys.path.insert(0, 'build/testing-tools')
from load_creds import testrail_creds

email, key = testrail_creds()
AUTH = 'Basic ' + base64.b64encode(f'{email}:{key}'.encode()).decode()
def get(p):
    r = urllib.request.Request(f'https://shopview.testrail.io/index.php?/api/v2/{p}',
                               headers={'Authorization': AUTH})
    return json.load(urllib.request.urlopen(r, timeout=90))

CHANGED = [
    # cid, suite, what changed, when
    (45005, 'Inline Add and Edit Parts', 'route wording + the build-checked date (2026-09-01); then preconditions 2 and 3 given the role screen’s real wording (2026-09-02)', '09-01 & 09-02'),
    (45026, 'Inline Add and Edit Parts', 'route wording + the build-checked date (2026-09-01); then preconditions 2 and 3 given the role screen’s real wording (2026-09-02)', '09-01 & 09-02'),
    (45223, 'Inline Add and Edit Parts', 'preconditions 2 and 3 only — the two permission names that do not exist', '09-02'),
    (45224, 'Inline Add and Edit Parts', 'preconditions 2 and 3 only — the two permission names that do not exist', '09-02'),
    (45227, 'Inline Add and Edit Parts', 'preconditions 2 and 3 only — the two permission names that do not exist', '09-02'),
    (45237, 'Inline Add and Edit Parts', 'preconditions 2 and 3 only — the two permission names that do not exist', '09-02'),
    (45123, 'Printer Friendly Work Orders', 'ALL THREE FIELDS — the audit-history route added, the event label corrected, the marker lifted to READY', '09-02'),
    (44919, 'Invoice UI Refresh', 'design reference added to the provenance line', '09-02'),
    (44920, 'Invoice UI Refresh', 'design reference added to the provenance line', '09-02'),
    (44921, 'Invoice UI Refresh', 'design reference added to the provenance line', '09-02'),
    (44922, 'Invoice UI Refresh', 'design reference added to the provenance line', '09-02'),
    (44985, 'Invoice UI Refresh', 'design reference added to the provenance line', '09-02'),
]
EXCLUDED = 45220

rows, bad = [], []
for cid, suite, what, when in CHANGED:
    c = get(f'get_case/{cid}')
    atm = c.get('custom_atmstatus')
    if atm != 3:
        bad.append((cid, atm))
    rows.append((cid, c['title'], suite, what, when, atm, c['created_by']))
ex = get(f'get_case/{EXCLUDED}')

L = ['# For Vladimir Tomovic — every Automated case we changed, 1–2 September 2026',
     '', '**One notice, replacing four.** Separate notes had accumulated for 2026-08-31, 2026-09-01 and',
     'two passes on 2026-09-02; they are superseded by this list. Every case below carries TestRail’s own',
     '**Automated** flag (`custom_atmstatus = 3`), so an automation script may be reading its wording —',
     'which is why Rule 65 requires telling you.', '',
     '**Authorisation (QA lead, 2026-09-02, verbatim):** *"yes this case needs to be updated, and all those',
     'test case also need to be updated which are automated but yet they should be updated to make them',
     'runnable and Build verified. This authorization is for these three suites for now. 1. Invoice refresh',
     '2. Inline Add Part 3. Workorder Print"*', '',
     '**The flag was re-read immediately before and after every write and is still 3 on all '
     f'{len(rows)}**; no section moved and no `refs` value changed.', '',
     '| Case | Suite | Title | What changed | When |', '|---|---|---|---|---|']
for cid, title, suite, what, when, atm, by in rows:
    L.append(f'| [C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid}) | {suite} | {title} | {what} | {when} |')
L += ['', f'## Not touched: [C{EXCLUDED}](https://shopview.testrail.io/index.php?/cases/view/{EXCLUDED}) — “{ex["title"]}”', '',
      'It is flagged Automated **and** it is inside an authorised suite, and it was still left exactly as it',
      'is, because `created_by = 1` — it is yours. No authorisation reaches your cases. It is reported on five',
      'of our automated checks and edited by none of them.', '',
      '## 🛑 The one thing that matters most for automation', '',
      '**If any script asserts on the audit-history event text `"Work order printed history"`, it is asserting',
      'on a string that has never existed on the page.** Our 2026-09-01 pass recorded it that way and raised a',
      'wording divergence on it. The build says **`Work order printed`**. The extra word came from reading a',
      'whole table row with `tr.innerText`, which glued the Event cell’s clock-icon text (`history`) onto the',
      'event name. The finding is withdrawn and C45123 now names the real label.', '',
      '**The audit-history route, in the build’s own words:** the three-dots button at the top right of the',
      'work order, between `SHOPCOACH ANALYSIS` and `New Line` → **`Audit Log`** → a window titled',
      '**`Work Order Log`** with the columns `Event`, `User`, `Line`, `Details`, `Date`, `Time`.', '',
      '## The two permission names that do not exist', '',
      'Six Inline cases told a tester to look for `Work Order Line - Create and Edit` and',
      '`Work Orders → Work Order View Mode`. **Neither string is on the screen.** The role screen has a',
      '**`Work order lines`** section whose column is **`Create & Edit`**, and a **`Work orders`** section with a',
      '**`View mode`** block offering **`Full View`** and **`Tech view`**. If a script drove either old string,',
      'it was driving nothing.', '',
      '## Evidence', '',
      'Payloads, pre-write snapshots, per-case applied logs and the four post-write checks:',
      '`build/automated-cases-2026-09-02/` and `build/invoice-ui-refresh/design-ref-write-automated/`.',
      'All four checks clean on every case — precondition-label gate, runnability, stored-value render check,',
      'and the served-page container scan.']
if bad:
    L += ['', '⚠️ **Flag check at notice time:** ' + ', '.join(f'C{c} now reads custom_atmstatus={a}' for c, a in bad)]
open('build/for-vlad-2026-09-02/FOR-VLAD-consolidated-2026-09-02.md', 'w').write('\n'.join(L) + '\n')
print(f'notice written: {len(rows)} cases, all still Automated: {not bad}')
print('excluded (Vladimir\'s):', f'C{EXCLUDED}', '| created_by', ex['created_by'])
