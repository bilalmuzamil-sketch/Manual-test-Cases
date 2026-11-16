#!/usr/bin/env python3
"""Approved write (QA lead, 16 Nov 2026: "1. Yes"): bring C30540 in line with SV-10380. Logs to audit-log.jsonl."""
import sys, json, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools'); import tr_client as T
before = json.load(open('C30540-before.json'))
body = {
 'title': 'A part appears unless it is a core charge or its on-hand quantity is zero',
 'refs': before['refs'] + '; SV-10380 (negative quantities are listed, 22 Sep 2026)',
 'custom_preconds': '<ol>\n<li>You are signed in to the ShopView App on a desktop browser.</li>\n<li>ZZAUTOTEST parts exist at your active location: a normal part with positive on-hand quantity, a core-charge part with a positive quantity, a part with exactly zero on-hand quantity, and a part with a negative on-hand quantity (its bins add up to less than zero).</li>\n</ol>\n',
 'custom_steps': before['custom_steps'],
 'custom_expected': (
  '<ol>\n'
  '<li>The normal, positive-quantity, non-core part appears as one row.</li>\n'
  '<li>The core-charge part is never listed — even with a positive quantity — and its value is not counted in the totals row.</li>\n'
  '<li>The zero-quantity part is not listed.</li>\n'
  '<li>The negative-quantity part IS listed, with its quantity and values below zero, and it lowers the totals row. For example, a part 2 units short with a cost of $10.00 shows a quantity of −2 and a cost value of −$20.00.</li>\n'
  '<li>Only core-charge parts and parts whose on-hand quantity is exactly zero are left out.</li>\n'
  '<li>A part that has sat without movement for a long time still appears and is still counted — there is no dead-stock exclusion; how long stock has sat makes no difference.</li>\n'
  '</ol>\n\n<hr />\n\n'
  '<p>This is the expected behaviour as per:</p>\n<ul>\n'
  '<li>epic SV-8582, read on 17 August 2026;</li>\n'
  '<li>the Inventory Value report specification version 10 (S2-R1, S2-R2, S2-N1, S2-N2), read on 17 August 2026;</li>\n'
  '<li>ticket SV-10380, read on 16 November 2026.</li>\n</ul>\n'
  '<p>Last checked against build v3.8-bd246fd on 8/18/2026, before the negative-quantity change; point 4 has not yet been checked against a build since this update.</p>\n'
  '<p>The specification (S2-R1) says only quantities greater than zero are valued. The later ticket SV-10380 (22 September 2026) says "Include negative-quantity parts with their signed values", and this case follows that later ticket.</p>\n\n'
  '<p>AUTOMATION: READY</p>\n'),
}
st, r = T.post('update_case/30540', body)
st2, after = T.get_case(30540)
ok = st == 200 and all(after.get(k) == v for k, v in body.items())
diffs = [k for k, v in body.items() if after.get(k) != v]
json.dump(after, open('C30540-after.json', 'w'), indent=1)
open('audit-log.jsonl', 'a').write(json.dumps({'at_utc': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()), 'op': 'update_case', 'case': 'C30540',
  'http': st, 'fields': list(body), 'readback_equal': ok, 'readback_diffs': diffs}) + '\n')
print('http', st, 'readback_equal', ok, 'diffs', diffs)
