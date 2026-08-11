# -*- coding: utf-8 -*-
"""Build update_case payloads for the expect-fail audit (2026-08-11).
Removes unbacked EXPECT-FAIL markers, repairs backed ones, releases the 6 panel HOLDs."""
import json, re, sys
from scope import group

READ_DATE = "11 August 2026"
SPEC = re.compile(r'(the Schedule specification version 27|the Filters specification at Confluence version 19 \(published 6 August 2026\))(\s*\([^)]*\))?')

allc = {c['id']: c for c in group(4110) + group(4254)}

BACKED = {   # case -> (ticket, symptom paragraph WITHOUT the three bullets)
 29616:("SV-8832","What you should see today: a customer the system no longer recognises is hidden from the Customer list, but it is still used to narrow the table. The address bar keeps it and the request to the server still carries it, so you get an empty list instead of the list without that value."),
 29619:("SV-8832","What you should see today: a value in the address bar that no longer exists is still sent to the server, so the page comes back with an empty list instead of the list without that value. The Customer button shows no value name."),
 29620:("SV-8832","What you should see today: a broken address is not fully ignored. A customer value the system does not recognise is still sent to the server and the page shows an empty list, and a wrong tab value can still switch the tab."),
 29634:("SV-8832","What you should see today: the server itself does not fail - it answers normally - but the page does not ignore the broken value. It is still sent with the request, so the list comes back empty."),
 29624:("SV-8875","What you should see today: a single filter's own sheet applies your choice the moment you tap a value - the address bar changes at once, the list reloads and the sheet closes - and there is no 'Apply filters' button anywhere in that sheet. Only the combined 'All Filters' sheet holds your choices until you press a button."),
 29625:("SV-8875","What you should see today: the Customer sheet does have a Search box, but it applies your choice the moment you tap a name - the address bar changes at once, the list reloads and the sheet closes - so you cannot pick a second customer, there are no removable tags, and there is no 'Apply filters' button."),
 38889:("SV-8912","What you should see today: on a phone there is no page search at all. The magnifier in the top bar opens the app-wide search box instead, and typing in it does not narrow this page's list."),
}
BULLETS = ("\n- If you see exactly that, mark this test FAILED and do not raise anything new."
           "\n- If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it."
           "\n- If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed.")

# paragraph index of the expect-fail narrative to drop (None = there is none)
DROP = {29557:1,29558:1,29606:1,29607:1,38897:1,29613:1,29616:1,29618:1,29619:1,29620:1,
        29624:1,29625:None,29628:1,29634:1,38889:1,
        29927:1,43554:1,29939:2,29960:1,29962:1,29975:1,29987:1,30001:1,30009:1,30010:1,
        30014:1,30035:1,30036:1,30041:1,30045:2,30046:1,30050:1,43556:2,30086:1,30087:1,38865:1}

PANEL = list(range(43582,43588))
PANEL_NOTE = ("Run this test as written and mark it on what you actually find. When it was last checked, "
  "on 11 August 2026, the Schedule toolbar had no panel button at all - the button furthest to the left "
  "above the grid was Today - so on that build steps 1 to 8 cannot be carried out and this test FAILS. "
  "Mark it failed if that is still what you see. If the button is there and behaves as described, mark it passed.")

def split(t):
    head, tail = t.split('\n---\n', 1)
    return [p for p in head.split('\n\n')], tail

def add_read_date(tail, cid):
    if cid == 43554:            # sourced from the story, which was not re-read today
        return tail, False
    new, n = SPEC.subn(lambda m: (m.group(1) + (m.group(2) or '')) + f", read on {READ_DATE}", tail, count=1)
    assert n == 1, f"C{cid}: spec citation not found"
    return new, True

def set_marker(tail, marker):
    out, n = re.subn(r'^AUTOMATION:.*$', marker.replace('\\', r'\\'), tail, count=1, flags=re.M)
    assert n == 1, "marker not found"
    return out

ops = []
for cid, drop in DROP.items():
    c = allc[cid]; t = c['custom_expected']
    paras, tail = split(t)
    proj = 'Filters' if c['id'] in [x['id'] for x in json.load(open('ef.json')) if x['proj']=='Filters'] else 'Schedule'
    if cid in BACKED:
        tk, sym = BACKED[cid]
        block = sym + BULLETS
        if drop is None: paras.append(block)
        else:
            assert paras[drop].startswith(('What you should see today','Known issue','Note for the tester: on the build')), f"C{cid} para{drop} unexpected: {paras[drop][:60]}"
            paras[drop] = block
        tail = set_marker(tail, f"AUTOMATION: READY - EXPECT FAIL ({tk})")
        act = 'KEEP+REPAIR'
    else:
        assert paras[drop].startswith(('What you should see today','Known issue','Note for the tester: on the build')), f"C{cid} para{drop} unexpected: {paras[drop][:60]}"
        del paras[drop]
        tail = set_marker(tail, "AUTOMATION: READY")
        act = 'REMOVE'
    tail, dated = add_read_date(tail, cid)
    new = '\n\n'.join(p for p in paras if p.strip()) + '\n---\n' + tail
    ops.append({'cid':cid,'proj':proj,'action':act,'dated':dated,'new':new,'old':t})

for cid in PANEL:
    c = allc[cid]; t = c['custom_expected']
    paras, tail = split(t)
    idx = [i for i,p in enumerate(paras) if p.startswith('Not built yet.')]
    assert len(idx)==1, f"C{cid}: {len(idx)} 'Not built yet' paragraphs"
    paras[idx[0]] = PANEL_NOTE
    tail = set_marker(tail, "AUTOMATION: READY")
    tail, dated = add_read_date(tail, cid)
    new = '\n\n'.join(p for p in paras if p.strip()) + '\n---\n' + tail
    ops.append({'cid':cid,'proj':'Schedule','action':'HOLD->READY','dated':dated,'new':new,'old':t})

# ---- shape assertions (Rule 50: assert the payload BEFORE sending) ----
for o in ops:
    n = o['new']; cid = o['cid']
    assert not re.search(r'<[a-z/][^>]*>', n), f"C{cid}: markup"
    assert '\r' not in n, f"C{cid}: CRLF"
    assert n.count('This is the expected behaviour') == 1, f"C{cid}: provenance count"
    assert len(re.findall(r'^AUTOMATION:', n, re.M)) == 1, f"C{cid}: marker count"
    lines = [l for l in n.split('\n') if l.strip()]
    assert lines[-1].startswith('AUTOMATION:'), f"C{cid}: marker not last"
    assert re.search(r'\n\nAUTOMATION:', n), f"C{cid}: no blank line before marker"
    assert n.count('\n---\n') == 1, f"C{cid}: separator count"
    assert 'expected to fail' not in n or cid in BACKED, f"C{cid}: leftover expect-fail prose"
    if o['action'] == 'REMOVE':
        assert 'EXPECT FAIL' not in n, f"C{cid}: expect-fail marker survived"
    if o['dated']:
        assert n.count(f'read on {READ_DATE}') == 1, f"C{cid}: read-date count"

json.dump(ops, open('ops.json','w'), indent=1)
from collections import Counter
print("ops built:", len(ops))
for k,v in sorted(Counter((o['proj'],o['action']) for o in ops).items()): print("  ",k,v)
print("dated:", sum(1 for o in ops if o['dated']), "| not dated:", [o['cid'] for o in ops if not o['dated']])
