"""23 Oct 2026 — QA lead's answers to the final report: Q7 "AGreed" (C97029: the set-up's spacing choice saved in Tech View, as for the
other four usage tests), Q8 "AGreed" (C368170: step 2 leaves the New Customer Payment window open — on production its X takes the invoice
back off), Q9 "Go ahead" (C614719, Automated, named by him: keep three work orders for Customer-C and change step 9's expected result to
"all three show, off to the right" — Rule 114(c)). Only the named text changes; a dated decision line is added (Rule 114(d)).
Before/after JSON beside this file; --write applies."""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../../testing-tools'))
import tr_client as t
D = os.path.dirname(os.path.abspath(__file__))
CH = {
 97029: {'custom_preconds': [
    ('<li>As your dispatcher, in Work Orders pick Board View, change one field in Fields to display and pick a density, so all three are saved choices; then sign out.</li>',
     '<li>As your dispatcher, in Work Orders pick Board View and change one field in Fields to display; then click Tech View and pick a density (Board View has no density in this release); then click Board View again, so the display, a field and a density are all saved choices; then sign out.</li>'),
    ('<li>Your dispatcher has a saved display, fields and density (any non-default choice).</li>',
     '<li>Your dispatcher has a saved display, fields and density (any non-default choice; the density is picked in Tech View, QA lead decision 23 Oct 2026).</li>')]},
 368170: {'custom_steps': [
    ('<li>Click the Finance tab and click Create Invoice so the work order is Invoiced. Close the New Customer Payment window (X) without paying.</li>',
     '<li>Click the Finance tab and click Create Invoice so the work order is Invoiced. A New Customer Payment window opens: leave it open and do not pay (do not close it with its X, which takes the invoice back off; QA lead decision 23 Oct 2026).</li>')]},
 614719: {'custom_expected': [
    ('<li>Step 9: only {Work-order-4} shows, as a card in {Technician-C}’s column, which is off to the right, out of sight. The &quot;Unassigned&quot; column has no cards.</li>',
     '<li>Step 9: {Customer-C}’s three work orders show ({Work-order-4} to {Work-order-6}), as cards in {Technician-C}’s column, which is off to the right, out of sight. The &quot;Unassigned&quot; column has no cards. (QA lead decision 23 Oct 2026: step 9 expects all three work orders, matching the set-up.)</li>')]},
}
for cid, ch in CH.items():
    s, c = t.get(f'get_case/{cid}'); assert s == 200 and c['created_by'] == 3, (cid, c.get('created_by'))
    new = {}
    for field, pairs in ch.items():
        v = c[field]
        for o, n in pairs: assert v.count(o) == 1, (cid, field, o[:70]); v = v.replace(o, n)
        new[field] = v
    json.dump({k: c[k] for k in new} | {'title': c['title'], 'custom_atmstatus': c.get('custom_atmstatus')}, open(os.path.join(D, f'C{cid}-before.json'), 'w'), indent=1)
    if '--write' in sys.argv:
        s, r = t.post(f'update_case/{cid}', new); s2, c2 = t.get(f'get_case/{cid}')
        same = all(c2[k] == v for k, v in new.items()) and all(c2[k] == c[k] for k in ('custom_preconds', 'custom_steps', 'custom_expected', 'title') if k not in new)
        print(cid, 'update', s, 'read back ok', same, 'automated' if c.get('custom_atmstatus') == 3 else '')
        json.dump({k: c2[k] for k in new}, open(os.path.join(D, f'C{cid}-after.json'), 'w'), indent=1)
    else: print(cid, 'dry run ok', list(new))
