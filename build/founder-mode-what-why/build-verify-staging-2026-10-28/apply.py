# What/Why (Title and Description), TestRail group 20437 — build verification on STAGING, 28 Oct 2026.
# QA lead: build-verify the suite on staging; "Without re-checking" the sources; the writing session "has finished".
# Rulings this pass (README): QuickBooks cases "Hold them for now"; "Capitalise the examples".
# Lane: labels / routes / setup only. Evidence: probe/*.json + screenshots (staging v26.43.1-f2d183d).
# Expected results are never changed, except: the build sentence, the AUTOMATION marker line, and (QA lead's
# capitalisation ruling) the example text typed into the line window, in the lines ABOVE "Exact quotes from the source".
# Guards: ours (created_by 3), not Automated, unchanged since the before/ snapshot; write only changed fields; read back.
import json, sys, os, re, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__))
BUILD = 'v26.43.1-f2d183d'
STAMP = f'<p>Last checked against build {BUILD} (staging) on 10/28/2026.</p>'
OLD_STAMP = r'<p>Not yet checked against a build by us:.*?</p>'
QUOTES = 'Exact quotes from the source'

TOPRIGHT = 'click the location box at the top right, then Settings'
WO_HOW = ('go to Work Orders and click Create Work Order: pick a Customer (for example 4 Star Truck Repair) and an asset under '
          'Add Asset (for example 2015 Ford Escape), then click Save; if a Confirmation says the customer is over their credit limit, '
          'click Create. The new work order opens on its Lines tab with the New Line window already open')
LINE_HOW = ('in the New Line window type the title in the Title box (press Tab to leave the list of canned lines without picking one), '
            'type the description, if any, in the Description box, type 1 in Estimated Time, tick Line Approved, then click Save &amp; Close '
            '(for another line, click New Line again)')
DONE_HOW = ('To do this on work order 1&#39;s Lines tab: for a line that needs a tech story, click Add tech story for this line under it, '
            'type the tech story and click Update; click Complete in each line&#39;s Action column (once every line is complete, '
            'work order 1 shows Complete by itself); then click the Finance tab, then Create Invoice, and close the New Customer Payment '
            'window with its X. The invoice number shows on the Finance tab as Invoice: INV-…')
OLD_WO = ('staging received this change on 23 Oct 2026: on Work Orders, All tab, List view, clear the Status and Asset on Site filters '
          'with their x and use the Created On column to find one created before 23 Oct 2026')

# Global replacements: (old, new). Applied wherever old occurs in preconditions / steps.
G_PRE = [
 ('Sign in as an Admin at the test location.',
  'Sign in to staging (app.staging.shopview.com) as a user with the Admin role (Settings, then Roles &amp; Permissions describes it as '
  '&quot;Full system access&quot;: every permission is on). Work at the location Staging Heavy Duty - 9919: its name shows in the location box at the '
  'top right, next to your initials. Other people may change it, so check it before each test; to change it, click that box, then the location name under '
  'Change Location, then Staging Heavy Duty - 9919.'),
 ('(Settings, then the Work Orders tab)',
  f'({TOPRIGHT}; on the Work Orders tab, under LINE REQUIREMENTS, set the Require Tech Story switch, then click Save Settings. '
  'The setting covers every location, so check it before each test)'),
 ('(Settings, then Invoice)', f'({TOPRIGHT}; on the Invoice tab set the Legacy invoice layout switch, then click Save Details)'),
 ('(Settings, then Canned Lines)', f'({TOPRIGHT}, then Canned Lines under SERVICE in the left menu; for example &quot;Replace - Torque rod&quot;)'),
 ('Start on Settings, then Invoices under Data Import in the Settings left menu.',
  f'Start on the Invoices import page: {TOPRIGHT}, then Invoices under IMPORTS in the Settings left menu.'),
 ('(Settings, then Invoices under Data Import)', f'({TOPRIGHT}, then Invoices under IMPORTS in the Settings left menu)'),
 ('Start on Settings.', f'Start on Settings: {TOPRIGHT}.'),
 ('from the downloaded Invoices import template', 'from the Invoices import template (on the Invoices import page, click Download Template)'),
 ('Start on Reports, then Export Reports in the Reports left menu, with the Export Report dialog open.',
  'Start with the Export Report dialog open: click Reports in the top bar, then Export Reports under ACCOUNTING in the Reports left menu.'),
 ('so you can add a line to it.', f'so you can add a line to it: {WO_HOW}; close that New Line window with its X.'),
 ('so a saved line can be added to it.', f'so a saved line can be added to it: {WO_HOW}; close that New Line window with its X.'),
 ('so that a wrongly saved line would not touch other work.', f'so that a wrongly saved line would not touch other work: {WO_HOW}; close that New Line window with its X.'),
 ('so ShopCoach can suggest lines for it.', f'so ShopCoach can suggest lines for it: {WO_HOW} (2015 Ford Escape has its year, make and model filled in); close that New Line window with its X.'),
 ('Have line 1 opened in Edit Line and saved once', 'Have line 1 opened in Edit Line (click line 1&#39;s title on the Lines tab) and saved once'),
 ('Write down invoice A&#39;s number.', 'Write down invoice A&#39;s number (Invoice: INV-… on work order 1&#39;s Finance tab).'),
 ('Write down invoice A\'s number.', 'Write down invoice A\'s number (Invoice: INV-… on work order 1\'s Finance tab).'),
 ('at the test location', 'at Staging Heavy Duty - 9919'),
]
G_STEP = [
 ('Click Download.', 'Click Export.'), ('In the second browser, click Download.', 'In the second browser, click Export.'),
 ('Set the date range to today.', 'Pick Today in the Date Range list.'),
 ('In the second browser, set the date range to today.', 'In the second browser, pick Today in the Date Range list.'),
 ('Set the date range to cover invoice A&#39;s date.', 'Pick Custom in the Date Range list and choose dates that cover invoice A&#39;s date.'),
 ('Set the date range to cover invoice A\'s date.', 'Pick Custom in the Date Range list and choose dates that cover invoice A\'s date.'),
 ('Upload file A.', 'Click Select CSV File, pick file A, then click Import Invoices.'),
 ('Upload file B.', 'Click Select CSV File, pick file B, then click Import Invoices.'),
 ('Click Download template.', 'Click Download Template.'),
 ('Click Invoices under Data Import in the Settings left menu.', 'Click Invoices under IMPORTS in the Settings left menu.'),
 ('Switch the list to List view.', 'Click the List button (the first of the three view buttons at the top right, before Tech View and Board View).'),
 ('Pick Imported in the Status filter.', 'Click the Status filter, pick Imported, then clear the Asset on Site filter with its x.'),
 ('Type the shared start of the two invoice numbers in the Search box.', 'Click Search and type the shared start of the two invoice numbers.'),
 ('Type invoice A&#39;s number in the Search box.', 'Click Search and type invoice A&#39;s number.'),
 ('Type invoice A\'s number in the Search box.', 'Click Search and type invoice A\'s number.'),
 ('Set the Estimate / Invoice toggle to Invoice.', 'Set the Estimate/Invoice switch to Invoice.'),
 ('Change work order 1&#39;s status to Complete.', 'Check the status at the top left of work order 1: it changes to Complete by itself once its only line is complete.'),
 ('Change work order 1\'s status to Complete.', 'Check the status at the top left of work order 1: it changes to Complete by itself once its only line is complete.'),
 ('Complete line 1 without typing a tech story.', 'Click Complete in line 1&#39;s Action column, without adding a tech story.'),
 ('Close the Edit Line window without saving.', 'Close the Edit Line window with its X, without saving.'),
 ('Close the New Line window without saving.', 'Close the New Line window with its X, without saving.'),
 ('Close the New Customer Payment window without taking a payment.', 'Close the New Customer Payment window with its X, without taking a payment.'),
]
# Per-item additions in preconditions: (regex on one <li>, text appended inside the li)
P_ADD = [
 (r'^(Create|Have) (a|an open) work order[^<]*?, work order 1, with (one|two|five) labor lines?[^<]*$', f' To make it: {WO_HOW}; {LINE_HOW}.'),
 (r'^Have an open work order, work order 1, with a line, line 1, titled[^<]*$', f' To make it: {WO_HOW}; {LINE_HOW}.'),
 (r'^Have lines? 1[^<]*invoiced today as invoice A[^<]*$', ' ' + DONE_HOW),
 (r'^Have a work order made before this release[^<]*$', f' ({OLD_WO}; for example S2-16710, whose line 2 &quot;Service - Adjust engine oil level&quot; has the description &quot;High&quot;; use that line as line 1.)'),
 (r'^Have an open work order, work order 1, with a line, line 1, that has a title and a description\.$', ' For example S2-16710 at Staging Heavy Duty - 9919, whose line 2 &quot;Service - Adjust engine oil level&quot; has the description &quot;High&quot;; use that line as line 1.'),
 (r'^Have an invoice made before this release[^<]*$', ' (staging received this change on 23 Oct 2026: on Work Orders, All tab, List view, clear the Status and Asset on Site filters with their x, pick Invoiced in the Status filter and use the Invoiced Date column to find one invoiced before 23 Oct 2026.)'),
 (r'^Have an invoice made today at Staging Heavy Duty - 9919, invoice A, by an Admin\.$', f' To make one: {WO_HOW}; {LINE_HOW}; then click Complete in the line&#39;s Action column, the Finance tab, Create Invoice, and close the New Customer Payment window with its X.'),
]
# QA lead's capitalisation ruling: example text typed into the line window starts with a capital letter.
CAP = [('excessive play', 'Excessive play'), ('leaking', 'Leaking'), ('pulls left', 'Pulls left'), ('no title', 'No title')]
CAP_CASES = {154707, 154709, 154713, 154715, 154716, 154718, 154719, 154720, 154722, 549075, 549077, 549082, 839506, 839507,
             839508, 839521, 839522, 839523, 839524, 847720, 847722, 847723, 847725, 847721}
IMPORT_ITEM = re.compile(r'import (file|a file)|Line Description &quot;|Line Description "', re.I)

HOLD = {
 **{i: 'QuickBooks side cannot be checked yet: invoices from Staging Heavy Duty - 9919 do not reach QuickBooks today, the QA site qb1 does not have this change yet, and no QuickBooks sandbox sign-in is available'
    for i in (154715, 154721, 549084, 549085, 549087, 847723)},
 549080: 'line 1 has to come from the ShopCoach line builder, which shows nothing on staging (known problem SV-11850)',
 154719: 'signing in as a second user with a custom role was not confirmed on staging in this pass',
 549088: 'signing in as a second user with a custom role was not confirmed on staging in this pass',
 154722: 'receiving part A was not confirmed on staging in this pass',
 154708: 'the clear (x) button in the Title box after picking a canned line was not seen on staging in this pass',
}
EXPECT_FAIL = {154711, 154712, 549079, 839526, 839527}

def cap_text(t):
    for a, b in CAP: t = t.replace('&quot;' + a, '&quot;' + b).replace('"' + a, '"' + b).replace('“' + a, '“' + b)
    return t

def edit_list(html, field, i):
    def fix(m):
        li = m.group(1)
        for a, b in (G_PRE if field == 'custom_preconds' else G_STEP):
            if a == 'at the test location' and li.startswith('Sign in to staging'): continue
            li = li.replace(a, b)
        if field == 'custom_preconds':
            for rx, add in P_ADD:
                plain = re.sub('<[^>]+>', '', li)
                if re.search(rx, plain) and add not in li: li = li + add
        if i in CAP_CASES and not IMPORT_ITEM.search(li): li = cap_text(li)
        return '<li>' + li + '</li>'
    return re.sub(r'<li>(.*?)</li>', fix, html, flags=re.S)

def edit_expected(e, i):
    k = e.find(QUOTES)
    head, tail = (e[:k], e[k:]) if k >= 0 else (e, '')
    if i in CAP_CASES:
        if i == 847721: head = head.replace('Replace tie rod - excessive play', 'Replace tie rod - Excessive play')
        else:
            head = cap_text(head)
            for a, b in (('Replace tie rod - excessive play', 'Replace tie rod - Excessive play'),
                         ('passenger side - excessive play', 'passenger side - Excessive play'),
                         ('Replace hose - leaking', 'Replace hose - Leaking'), ('Align front axle - pulls left', 'Align front axle - Pulls left')):
                head = head.replace(a, b)
    e = head + tail
    n = len(re.findall(OLD_STAMP, e, re.S)); assert n == 1, (i, 'old stamp count', n)
    e = re.sub(OLD_STAMP, STAMP, e, flags=re.S)
    mk = re.findall(r'<p>AUTOMATION:[^<]*</p>', e); assert len(mk) == 1, (i, 'markers', mk)
    if i in EXPECT_FAIL: assert 'EXPECT FAIL (SV-11850)' in mk[0], (i, mk); new = mk[0]
    elif i in HOLD: new = f'<p>AUTOMATION: HOLD - {HOLD[i]}</p>'
    else: new = '<p>AUTOMATION: READY</p>'
    return e.replace(mk[0], new), new

write = '--write' in sys.argv; only = {int(x) for x in sys.argv[1:] if x.isdigit()}
ids = json.load(open('/tmp/claude-0/-home-user-Manual-test-Cases/169cf2b3-7c06-5d1d-9efd-a5870bb2aa07/scratchpad/ids-20437.json'))
log = open(f'{D}/write-log.txt', 'a') if write else None
out = {}
for i in ids:
    if only and i not in only: continue
    snap = json.load(open(f'{D}/before/C{i}.json'))
    cur = L.call(f'get_case/{i}'); time.sleep(0.3)
    if cur['created_by'] != 3: print(i, 'SKIP author'); continue
    if cur['custom_atmstatus'] == 3: print(i, 'SKIP automated'); continue
    if cur['updated_on'] != snap['updated_on']: print(i, 'SKIP changed since snapshot by user', cur['updated_by']); continue
    new = {'custom_preconds': edit_list(cur['custom_preconds'] or '', 'custom_preconds', i),
           'custom_steps': edit_list(cur['custom_steps'] or '', 'custom_steps', i)}
    new['custom_expected'], mk = edit_expected(cur['custom_expected'], i)
    d = {f: v for f, v in new.items() if v != cur[f]}
    out[i] = {f: v for f, v in d.items()}
    if not write: print(i, 'PREVIEW', sorted(d), '|', mk[3:70]); continue
    r = L.call(f'update_case/{i}', d); time.sleep(1)
    ok = all(r[f] == v for f, v in d.items()) and all(r[f] == cur[f] for f in ('title', 'custom_atmstatus', 'custom_automation_type', 'section_id', 'refs'))
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{i} fields={sorted(d)} marker={mk[3:-4]} verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n'); log.flush()
if not write: json.dump(out, open(f'{D}/preview.json', 'w'), indent=1)
