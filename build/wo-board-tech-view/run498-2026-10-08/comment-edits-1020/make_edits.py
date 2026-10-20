"""make_edits.py — 20 Oct 2026, QA lead: in run 498 every not-Passed test's comment must name the step(s) that fail, in bold.
For each test's newest explaining result (targets.json), build the edited comment: a bold first line naming the failing step(s),
and the bullet(s) describing those steps made bold. Nothing else in the comment changes. Output edits.json {rid: {...}}."""
import json, re, html
T = json.load(open('targets.json'))
B = lambda s: f'<p><strong>{s}</strong></p>'
# case -> (headline, [start of each <li> to make bold])
PLAN = {
 581915: ('Retest — cannot pass from step 1: Tech View and Board View have no Technician filter, so steps 1 to 4 cannot be done (step 5, List, is not affected).', ['On staging on 19 Oct']),
 581916: ('Retest — cannot pass from step 2 ("Select Unassigned and A in the Technician filter"): there is no Technician filter, so steps 2 to 4 cannot be done.', ['On staging on 19 Oct']),
 581917: ('Retest — cannot pass from step 1 ("select technician A"): there is no Technician filter, so steps 1 to 5 cannot be done.', ['On staging on 19 Oct']),
 581918: ('Retest — cannot pass from step 1 ("select technician A"): there is no Technician filter, so steps 1 to 4 cannot be done.', ['On staging on 19 Oct']),
 97022:  ('Retest — cannot pass from step 4 ("Apply Technician = A"): there is no Technician filter, so steps 4 to 7 cannot be done. Steps 1 to 3 are not affected.', ['On staging on 19 Oct']),
 614711: ('Failed at step 10 (steps 1 to 9 passed).', ['Result:', 'Step 10:']),
 96964:  ('Failed at steps 4, 6, 7 and 9 (and the same steps when repeated in steps 11 and 12): the wording is the old sentence. Steps 3, 5, 8 and 10 passed.', ['Result:', "The lock icon's hover text", 'More actions:', 'While each work order is dragged']),
 96967:  ('Failed at step 4 and again at step 8 (Tech View): no "You don’t have permission to assign technicians" note. Steps 5, 6, 7 and 9 passed.', ['Result:', 'Step 4:', 'Step 8:']),
 96975:  ('Failed at step 18: after logging out and back in, List has lost its own column choice (Progress is back on).', ['Result:', 'After logging out and signing in again']),
 581895: ("Failed at step 5: List's Lead Technician shows a different name from the staff record.", ['Result:', 'Step 5:']),
 368147: ('Failed at steps 6 and 10: no "You don’t have permission to assign technicians" note. All other steps passed.', ['Result:', 'Step 6:', 'Step 10:']),
 97020:  ('Failed at step 11 only: no note shows on keyboard highlight, and its words are the old sentence. All other steps passed.', ['Result:', 'Step 11:']),
 682421: ('Blocked at step 5 (Tech View): the focused row is covered by the fixed heading; waiting on Chris Ward\'s answer. Steps 1 to 4 and 7 passed.', ['Step 5 (Tech View):']),
 368159: ('Retest — cannot pass step 2: in browser 2 the Lead Technician list stops at about 97 names, so the technician the test needs cannot be picked (SV-11429).', ['Still seen on staging today']),
 368173: ('Retest — cannot pass step 3: Add Technician stops at about 97 names, so the technician the test needs cannot be picked (SV-11429).', ['Still seen on staging today']),
 368169: ('Failed at step 3 (now Retest): Lead Technician stops at about 98 names, so the technician the test needs cannot be picked (SV-11429). Steps 4 to 6 depend on it.', ['Result:', 'Ralph Edwards, the name']),
 368171: ('Failed at step 4 (now Retest): Lead Technician stops at about 98 names, so the technician the test needs cannot be picked, and steps 5 and 6 (the audit entry) cannot follow (SV-11429).', ['Result:', 'Ralph Edwards, the name']),
 590114: ('Failed at step 7: Total price sits at the left of its column, not the right.', ['Result:', 'In Tech View, every Total Price']),
 590117: ("Failed at step 4: the count's tooltip opens below the number, not above it.", ['Result:', 'In Tech View, hovering the count']),
 590121: ('Failed at step 11 only: the locked tooltip shows the old sentence. Steps 2 to 10 passed.', ['Result:', 'Step 11:']),
 590127: ('Failed at steps 2 and 7: no Technician filter after Assigned to me in Tech View or Board View; steps 3 to 6 cannot be done. Step 8 passed.', ['Result:', 'Step 2:', 'Step 7:', 'Steps 3 to 6']),
}
def bold_li(h, starts):
    hit = []
    def rep(m):
        inner = m.group(1); txt = html.unescape(re.sub('<[^>]+>', '', inner)).strip()
        if any(txt.startswith(s) for s in starts) and not inner.startswith('<strong>'):
            hit.append(txt[:30]); return f'<li><strong>{inner}</strong></li>'
        return m.group(0)
    return re.sub(r'<li>(.*?)</li>', rep, h, flags=re.S), hit
out = {}
for c, v in T.items():
    c = int(c)
    if c not in PLAN: continue
    head, starts = PLAN[c]; h = v['comment']
    if c == 682421:   # stored as plain text with "- " bullets: give it the same block shape
        parts = [p.strip() for p in h.split('\n') if p.strip()]
        lis = [p[2:] for p in parts if p.startswith('- ')]; ps = [p for p in parts if not p.startswith('- ')]
        h = f'<p>{html.escape(ps[0])}</p><ul>' + ''.join(f'<li>{html.escape(x)}</li>' for x in lis) + '</ul>' + ''.join(f'<p>{html.escape(p)}</p>' for p in ps[1:])
    new, hit = bold_li(h, starts)
    missing = [s for s in starts if not any(x.startswith(s[:min(len(s),30)]) for x in hit)]
    out[v['rid']] = {'case': c, 'test': v['test'], 'old': v['comment'], 'new': B(head) + new, 'bolded': hit, 'missing': missing}
    if missing: print('MISSING', c, missing)
# C665914: the QA lead's own one-line result; add the failing steps from SV-11503 (Board View preview step 2, Tech View preview step 6)
out[527961] = {'case': 665914, 'test': 4014037, 'old': '<p>Track here:&nbsp;<a data-fr-linked="true" href="https://shopview.atlassian.net/browse/SV-11503" data-pasted="true">https://shopview.atlassian.net/browse/SV-11503</a></p>',
  'new': B('Failed at steps 2 and 6: while dragging, the long customer name runs outside the preview box (step 2 Board View, step 6 Tech View).') + '<p>Track here:&nbsp;<a data-fr-linked="true" href="https://shopview.atlassian.net/browse/SV-11503" data-pasted="true">https://shopview.atlassian.net/browse/SV-11503</a></p>', 'bolded': [], 'missing': []}
json.dump(out, open('edits.json', 'w'), indent=1, ensure_ascii=False)
print(len(out), 'edits'); [print(k, v['case'], v['bolded']) for k, v in out.items()]
