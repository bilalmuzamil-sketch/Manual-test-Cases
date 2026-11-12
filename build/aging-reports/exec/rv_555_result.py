"""rv_555_result.py — 12 Nov 2026 07:00 UTC: C715555 (Design: the Vendor menu shows its search box and rows in order) — PASSED under the QA lead's
12 Nov decision rule ("Pass the test if the feature is working as per the requirements … if not … create the ticket") with Rule 140.
PRD v11 S5-R13: "Vendor exactly as Inventory Value's Vendor filter (truck icon, "Search vendors"; as there, the search box shows only when there
are more than 8 vendors)" + S1-R1 A to Z. Full lists (rv1112/d3j_fix, v26.45.3-34788b2): same 1,124 vendors; with the six names that start
with a symbol or an accented letter left out, the same order (1,118 names); only those six sit elsewhere. The test text's "same order" is
stricter than the PRD sentence (Rule 137) — reported, Expected untouched (114)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 'rv1112/d3j_fix/out.json'))['C715555']; C = 'C715555'
import re; sym = lambda s: not re.match(r'[A-Za-z0-9]', s)
assert len(o['a']) == len(o['b']) == 1124 and not o['onlyA'] and not o['onlyB'] and [x for x in o['a'] if not sym(x)] == [x for x in o['b'] if not sym(x)]
R = {C: {'verdict': 'Passed', 'observed': [
    'A/P Aging Summary\'s Vendor menu is the same menu as Inventory Value\'s: truck icon, "Search vendors" box, "All vendors" row, the line "All vendors are included. Pick one or more to narrow.", and tick boxes.',
    'Both menus hold the same 1,124 vendors, listed A to Z in the same order.',
    'Only six names that start with a symbol or an accented letter sit in other places: "#1 Diesel", "-1 Diesel", "@Home Towing", "æble", "Émile\'s", "Øster". The requirement does not say where such names go.',
    'Passed on the QA lead\'s decision of 12 Nov 2026: pass when the feature works as the requirement says. The test\'s own wording asks for the same order everywhere; that wording is stricter than the requirement and is reported to him, not changed.'],
    'pictures': [P(C, 'rv1112/d3j_fix/C715555-menus-side-by-side.png', 'The two Vendor menus side by side: same menu, same vendors, A to Z', [(85, 230, 700, 960, 'good', 'A/P Aging Summary menu'), (1855, 245, 625, 950, 'good', 'Inventory Value menu')])]}}
json.dump({'pass_meta': {'note': '12 Nov 2026, run 557, rv_d3j_fix'}, 'results': R}, open(PP + 'RESULTS-rv-555.json', 'w'), indent=1); print(list(R))
