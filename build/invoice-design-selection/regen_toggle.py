#!/usr/bin/env python3
"""Rewrite the 14 Story-1 pick-list cases to the 'Legacy invoice layout' toggle model.

Spec change (Confluence 845447188, change log 2026-09-10, still current 2026-09-11): the design
control is a toggle row titled exactly "Legacy invoice layout", the LAST row on the Invoice settings
page (below "Summarize labor total", above the Disclaimer); off = Modern (new) design, on = Legacy;
S1-R2 "there is no third state and no pick list". Behaviour (Expected) comes from the documents
(Rule 57). Folds in the 4 held FO- citation fixes. Preserves the epic/story provenance and the Design
line; replaces the (now unsupportable) 'Last checked against build ...' stamp with an honest
pending-re-check note, since the toggle was not observed on the build this pass (Rule 12/54/85).
Marker kept as-is. Applies via API; fr-view is verified separately.
"""
import json, urllib.request, base64, re, html as _html

creds = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{creds['user']}:{creds['password']}".encode()).decode()

def get(cid):
    return json.load(urllib.request.urlopen(urllib.request.Request(
        f"https://shopview.testrail.io/index.php?/api/v2/get_case/{cid}",
        headers={'Authorization': f'Basic {AUTH}'})))

def post(cid, payload):
    req = urllib.request.Request(
        f"https://shopview.testrail.io/index.php?/api/v2/update_case/{cid}",
        data=json.dumps(payload).encode(),
        headers={'Authorization': f'Basic {AUTH}', 'Content-Type': 'application/json'}, method='POST')
    return urllib.request.urlopen(req).status

def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def ps(lines):
    return ''.join('<p>' + esc(x) + '</p>' for x in lines)

NAV = ('In the left menu open Settings, then click the Invoice tab (the Settings page shows the tabs '
       'Organization, Invoice and Work Orders). The design control is the last toggle row on the '
       'Invoice tab, titled exactly "Legacy invoice layout" (below "Summarize labor total", above the '
       'Disclaimer); off is the Modern (new) design and on is the Legacy design.')

NOTE = ('The design control changed from a pick list to the "Legacy invoice layout" toggle in the spec '
        'on 2026-09-10 (S1-R1, S1-R2); this case now reflects the toggle and is pending re-check on the '
        'QA build.')

ROUTE_547 = ('Route: to reach any invoice or estimate document, open Work Orders, open the work order, '
             'and click the Finance tab (URL /workorders/<id>/finance). The document renders there in the '
             'current design; use the print, email and download (get_app) controls to see it printed, '
             'emailed or downloaded, and Create Invoice to turn an estimate into an invoice. Change the '
             'design with the "Legacy invoice layout" toggle at Settings, Invoice tab (last row; off = '
             'Modern, on = Legacy). (Parts Sale documents are under Parts, then Part Sales. A Credit '
             "Invoice is raised from an existing invoice's Issue Credit action and viewed under Customers, "
             'the customer, Invoices tab.)')

# Per case: new title (or None to keep), new anchors, preconds[], steps[], behaviour[]
CASES = {
 53518: dict(title='"Legacy invoice layout" toggle is the last row on Invoice settings',
   anchors='S1-R1, S1-R2',
   preconds=["1. Log in to the shop app as a user who has access to the shop's invoice settings.",
             "2. The Invoice Design setting is built and available on this build."],
   steps=["1. In the left menu open Settings, then click the Invoice tab. The Settings page shows the tabs Organization, Invoice and Work Orders.",
          "2. Scroll to the bottom of the list of toggle rows on the Invoice tab.",
          "3. Confirm the design control is a two-state toggle (an on/off switch), not a pick list."],
   behaviour=['1. The design control is a toggle row, shown as the last row in the list of toggles on the Invoice settings page (directly below "Summarize labor total" and above the Disclaimer).',
              '2. The toggle is titled exactly "Legacy invoice layout".',
              '3. It has two states and no pick list: off is the Modern (new) design, on is the Legacy design. This is where the shop chooses whether its customer documents use the legacy design or the new design.']),
 53519: dict(title='"Legacy invoice layout" toggle has two states: off Modern, on Legacy',
   anchors='S1-R2',
   preconds=["1. Logged in as a user with access to invoice settings.", "2. " + NAV],
   steps=['1. Look at the "Legacy invoice layout" toggle and note its current state (on or off).',
          "2. Confirm the control is a two-state on/off toggle, not a list of choices.",
          "3. Turn the toggle to its other state, then read the state again."],
   behaviour=["1. The control is a two-state toggle: off is the Modern design and on is the Legacy design - no third state and no pick list.",
              "2. The toggle is in exactly one state at any time.",
              "3. Turning it to one state leaves the other off, so it always reads as exactly one of Modern (off) or Legacy (on)."]),
 53520: dict(title=None, anchors='S1-R3',
   preconds=["1. Logged in as a user with access to invoice settings.", "2. " + NAV],
   steps=['1. Locate the explanatory text shown directly below the "Legacy invoice layout" toggle row.',
          "2. Read the full text, character for character."],
   behaviour=['1. The explanatory text below the setting reads exactly: "Every estimate, invoice and credit invoice your shop shows, prints or sends uses the legacy design while this is on, including documents created before you changed it."',
              "2. The text is shown as static helper text (always present, not a toast or a dialog)."]),
 53521: dict(title=None, anchors='S1-R4',
   preconds=["1. An organization that has more than one location.",
             "2. Logged in as a user with access to invoice settings.", "3. " + NAV],
   steps=['1. Confirm the "Legacy invoice layout" setting appears once on the Invoice tab.',
          "2. Switch the app to a different location of the same organization (use the location switcher in the top bar) and open Settings, Invoice tab again.",
          "3. Look for any per-location, per-customer, or per-document copy of the design choice anywhere in settings or on a document."],
   behaviour=['1. The "Legacy invoice layout" setting appears exactly once and applies to the entire organization, including every location.',
              "2. There is no per-location variant - it reads the same on every location.",
              "3. There is no per-customer and no per-document choice of design anywhere."]),
 53522: dict(title=None, anchors='S1-R5',
   preconds=["1. An organization that already existed at the moment this setting shipped and has never changed the design setting.",
             "2. Logged in as a user with access to invoice settings.", "3. " + NAV],
   steps=['1. Read the current state of the "Legacy invoice layout" toggle.'],
   behaviour=['1. For an organization that already existed when this shipped, the "Legacy invoice layout" toggle starts off, which is the Modern design.',
              "2. Modern is the new design, so the default for existing organizations is the new design."]),
 53523: dict(title=None, anchors='S1-R6',
   preconds=["1. A brand-new organization created after this setting shipped, that has never changed the design setting.",
             "2. Logged in with access to that new organization's invoice settings.", "3. " + NAV],
   steps=['1. Read the current state of the "Legacy invoice layout" toggle.'],
   behaviour=['1. For an organization created after this shipped, the "Legacy invoice layout" toggle starts off, which is the Modern design.',
              "2. Modern is the new design, so the default for newly created organizations is the new design."]),
 53524: dict(title=None, anchors='S1-R7',
   preconds=["1. Logged in with access to invoice settings.", "2. " + NAV,
             '3. The "Legacy invoice layout" toggle is currently off (Modern).'],
   steps=['1. Turn the "Legacy invoice layout" toggle on (to switch to the Legacy design).',
          "2. Do not confirm yet - observe the confirmation dialog that appears before the change is applied.",
          "3. Read the dialog title, the full dialog body, and the button labels."],
   behaviour=["1. A confirmation dialog is shown before the change is applied, and the toggle does not move until it is confirmed.",
              '2. The dialog title reads exactly: "Switch to the Legacy design?"',
              '3. The dialog body reads exactly: "Every estimate, invoice and credit invoice will use the Legacy design straight away, including documents your shop has already sent. Reprints and portal copies of older documents change too. You can switch back at any time."',
              '4. The dialog offers exactly two buttons, labeled exactly "Switch to Legacy" and "Cancel".']),
 53525: dict(title=None, anchors='S1-R7',
   preconds=["1. Logged in with access to invoice settings.", "2. " + NAV,
             '3. The "Legacy invoice layout" toggle is currently on (Legacy).'],
   steps=['1. Turn the "Legacy invoice layout" toggle off (to switch to the Modern design).',
          "2. Do not confirm yet - observe the confirmation dialog that appears before the change is applied.",
          "3. Read the dialog title, the full dialog body, and the button labels."],
   behaviour=["1. A confirmation dialog is shown before the change is applied, and the toggle does not move until it is confirmed.",
              '2. The dialog title reads exactly: "Switch to the Modern design?"',
              '3. The dialog body reads exactly: "Every estimate, invoice and credit invoice will use the Modern design straight away, including documents your shop has already sent. Reprints and portal copies of older documents change too. You can switch back at any time."',
              '4. The dialog offers exactly two buttons, labeled exactly "Switch to Modern" and "Cancel".']),
 53526: dict(title=None, anchors='S1-R8',
   preconds=["1. Logged in with access to invoice settings.", "2. " + NAV,
             '3. The "Legacy invoice layout" toggle is off (Modern).'],
   steps=['1. Turn the "Legacy invoice layout" toggle on and, in the confirmation dialog, click "Switch to Legacy".',
          "2. Watch for a toast message after confirming.",
          "3. Do not click or dismiss the toast; wait and observe whether it disappears on its own.",
          "4. Reload the Invoice tab and read the toggle state."],
   behaviour=['1. After confirming, a success toast is shown reading exactly: "Invoice design updated."',
              "2. The toast fades on its own without the user closing it.",
              '3. The change is saved: after reload the "Legacy invoice layout" toggle is on (Legacy).']),
 53528: dict(title=None, anchors='S1-R10',
   preconds=["1. Logged in with access to invoice settings.", "2. " + NAV],
   steps=['1. Turn the "Legacy invoice layout" toggle on (Legacy) and confirm in the dialog.',
          "2. Immediately turn it off (Modern) and confirm.",
          "3. Repeat the on/off change several times in a row."],
   behaviour=["1. Each change is accepted; the setting can be changed as often as the shop likes.",
              "2. Changes are accepted in either direction (Modern to Legacy and Legacy to Modern).",
              "3. There is no limit on the number of changes and no cooling-off period blocking a rapid re-change."]),
 53530: dict(title=None, anchors='S1-N2',
   preconds=["1. Logged in with access to invoice settings.", "2. " + NAV,
             '3. The "Legacy invoice layout" toggle is off (Modern).'],
   steps=["1. Turn the toggle on so the confirmation dialog appears.",
          '2. Click "Cancel" in the confirmation dialog.',
          "3. Read the toggle state.", "4. Reload the Invoice tab and read the state again."],
   behaviour=["1. After cancelling, the toggle returns to its previous state (off, Modern).",
              "2. Nothing is saved: after reload the toggle is still off (Modern)."]),
 53532: dict(title=None, anchors='S1-N4',
   preconds=["1. Logged in with access to invoice settings.",
             "2. " + NAV + " The Invoice tab also carries other invoice settings; record the current value of each of the other settings."],
   steps=['1. Turn the "Legacy invoice layout" toggle to its other state and confirm.',
          "2. Re-read every other setting on the invoice settings page.",
          "3. Create or preview an invoice-type document so it renders in the newly selected design, and confirm the other settings' effects (the values you noted) still appear and apply on that document."],
   behaviour=['1. Changing the "Legacy invoice layout" setting does not change any other setting on the invoice settings page.',
              "2. The other settings keep their values and continue to apply to whichever design is selected."]),
 53533: dict(title=None, anchors='S1-E1',
   preconds=["1. Logged in with access to invoice settings.", "2. " + NAV,
             '3. The "Legacy invoice layout" toggle is off (Modern).',
             "4. A way to make the save fail is arranged (for example, the save request is rejected)."],
   steps=["1. Turn the toggle on (Legacy) and confirm so a save is attempted that will fail.",
          "2. Observe the toast that appears.",
          "3. Wait to see whether the toast disappears on its own, then confirm whether it requires an explicit close.",
          "4. Read the toggle state after the failed save."],
   behaviour=['1. When the change cannot be saved, an alert toast is shown reading exactly: "Could not update the invoice design. Please try again."',
              "2. The alert does not fade on its own - it must be closed explicitly by the user.",
              "3. The toggle reverts to its previous state (off, Modern); the failed change is not kept."]),
 53547: dict(title=None, anchors='S3-R1, S3-R2',
   preconds=["1. Log in to the shop app as a user who can reach Settings and work orders.",
             '2. Go to Settings, Settings, Invoice and turn the "Legacy invoice layout" toggle off (Modern). The toggle is the last row on the Invoice tab; off is Modern, on is Legacy.',
             "3. Seed a work order with an estimate whose work order has NOT been invoiced (create a work order, add line items so an Estimate is available, and do not invoice it).",
             "4. Provisional route (feature not built, Setting UI TBD): reach the estimate from the work order's Finance tab, Estimate view.",
             ROUTE_547],
   steps=["1. Open the work order and go to its Finance tab, Estimate view.",
          "2. View the in-app preview of the estimate and note its design.",
          "3. To tell the two designs apart, compare the overall Modern (new) vs Legacy look; a reliable spec-named tell is the Authorizer line, which prints on a Modern (new-design) document and is absent on a Legacy-design document.",
          "4. Without invoicing the work order, confirm the estimate is re-rendered on each view and stores no design of its own.",
          '5. Turn the "Legacy invoice layout" toggle on (Legacy), then view the SAME estimate again and confirm it now renders in the Legacy design - proving the estimate follows the current setting on each view and stores no design of its own.'],
   behaviour=['1. The estimate renders in the Modern design, i.e. "whichever design the organization\'s setting reads at the moment it is viewed, printed, sent, or downloaded."',
              '2. "Nothing is captured" - the estimate stores no design of its own; it is a live view re-rendered every time.']),
}

def build_expected(cid, spec):
    cur = get(cid)
    text = _html.unescape(re.sub('<[^>]+>', '\n', cur['custom_expected']))
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    prov = next((l for l in lines if l.startswith('This is the expected behaviour')), None)
    design = next((l for l in lines if l.startswith('Design:')), None)
    marker = next((l for l in lines if l.startswith('AUTOMATION:')), None)
    if not prov or not marker:
        raise RuntimeError(f"C{cid}: missing prov/marker")
    prov = re.sub(r'section .*?, read on', f"section {spec['anchors']}, read on", prov, count=1)
    tail = ['<p>' + esc(prov) + '</p>']
    if design:
        tail.append('<p>' + esc(design) + '</p>')
    tail.append('<p>' + esc(NOTE) + '</p>')
    tail.append('<p>' + esc(marker) + '</p>')
    return ps(spec['behaviour']) + '<hr />' + ''.join(tail), cur['title']

if __name__ == '__main__':
    for cid, spec in CASES.items():
        new_exp, cur_title = build_expected(cid, spec)
        payload = {'custom_preconds': ps(spec['preconds']),
                   'custom_steps': ps(spec['steps']),
                   'custom_expected': new_exp}
        if spec['title']:
            payload['title'] = spec['title']
        st = post(cid, payload)
        c2 = get(cid)
        fo = bool(re.search(r'FO-?\d', c2['custom_expected']))
        pl = bool(re.search(r'pick list|dropdown', (c2['custom_preconds'] or '') + (c2['custom_steps'] or ''), re.I))
        print(f"C{cid}: HTTP {st} | title={'set' if spec['title'] else 'kept'} | FO_left={fo} | picklist_left={pl}")
