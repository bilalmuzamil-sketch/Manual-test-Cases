# -*- coding: utf-8 -*-
"""Re-stamp the 55 untouched Filters cases v19 -> v21 (documents-only pass).
Surgical, well-anchored replacements only. DRY-RUN prints every rebuilt custom_expected.
Rule 14.1(2): only spec + epic read-dates move to 17 Aug (the two sources re-read this pass);
all other source read-dates (tech plan/design/handover/Branko answers/owning stories) are LEFT.
Drop the stale sentence-2 build line (redesign not build-verified this pass).
Marker policy: plain READY -> Rule-69 marker; keep HOLD / EXPECT-FAIL markers verbatim."""
import json, re, sys
cases = json.load(open('build/filters/currency-2026-08-17/live-4110.json'))
byid = {c['id']: c for c in cases}
UNTOUCHED = json.load(open('/tmp/untouched_ids.json'))
R69 = "AUTOMATION: Not available on Build to test Yet - Last checked 8/17/2026"

def restamp_refs(refs):
    r = refs
    # trailing/inline bracket form with the v19 publish date
    r = r.replace('[spec v19 2026-08-06]', '[spec v21 2026-08-14]')
    # inline "spec v19 2026-08-06" without brackets (rare)
    r = r.replace('spec v19 2026-08-06', 'spec v21 2026-08-14')
    # inline "(spec v19 " anchor form (the 8 HOLD Parts/Reports/persistence refs)
    r = r.replace('(spec v19 ', '(spec v21 ')
    r = r.replace('spec v19 §', 'spec v21 §')
    r = r.replace('spec v19 S', 'spec v21 S')
    r = r.replace('spec v19 Parts', 'spec v21 Parts')
    r = r.replace('spec v19 Reports', 'spec v21 Reports')
    r = r.replace('spec v19 Feature', 'spec v21 Feature')
    r = r.replace('spec v19 §2 Parts', 'spec v21 §2 Parts')
    r = r.replace('in spec v19 ', 'in spec v21 ')
    return r

def restamp_prov(prov, cid):
    p = prov
    # 1. version phrase (the common form)
    p = p.replace('Confluence version 19 (published 6 August 2026)',
                  'Confluence version 21 (published 14 August 2026)')
    # 1b. C38909 form: "at Confluence version 19, read on"
    p = p.replace('at Confluence version 19, read on', 'at Confluence version 21, read on')
    # NOTE: "added in Confluence version 19" is a HISTORICAL fact and is deliberately NOT changed.
    # 2. epic read-date -> 17 Aug
    p = re.sub(r'(epic SV-8785, read on )\d+ August 2026', r'\g<1>17 August 2026', p)
    # 3. spec read-date after "(published 14 August 2026) (<anchors>), read on <D> August 2026"
    p = re.sub(r'(published 14 August 2026\)\s*\([^)]*\), read on )\d+ August 2026',
               r'\g<1>17 August 2026', p)
    # 3b. C38909 form: "at Confluence version 21, read on <D> August 2026"
    p = re.sub(r'(at Confluence version 21, read on )\d+ August 2026', r'\g<1>17 August 2026', p)
    # 4. drop stale build sentence-2 (any build marker/date)
    p = re.sub(r'\s*Last checked against build \S+ on (?:\d+/\d+/\d+|\d+ \w+ \d{4})\.', '', p)
    # 4b. C43563 self-contradictory "not yet checked" clause -> drop (Rule-69 marker announces it)
    p = p.replace(' This test has not yet been checked against any build.', '')
    return p.rstrip()

def marker_line(exp):
    for ln in exp.splitlines():
        if ln.strip().startswith('AUTOMATION:'): return ln.strip()
    return None

def mtype(m):
    if 'Not available on Build' in m: return 'R69'
    if 'EXPECT FAIL' in m: return 'EXPECT-FAIL'
    if 'HOLD' in m: return 'HOLD'
    if m == 'AUTOMATION: READY': return 'READY'
    return 'OTHER'

def rebuild_expected(exp, cid):
    lines = exp.split('\n')
    # locate provenance line and marker line
    prov_i = next(i for i,l in enumerate(lines) if l.startswith('This is the expected'))
    mark_i = next(i for i,l in enumerate(lines) if l.strip().startswith('AUTOMATION:'))
    old_marker = lines[mark_i].strip()
    mt = mtype(old_marker)
    new_marker = R69 if mt == 'READY' else old_marker
    new_prov = restamp_prov(lines[prov_i], cid)
    # body = everything up to (and including) the '---' separator that precedes provenance
    # Reconstruct: body lines [0..prov_i-1], then new_prov, blank, marker, trailing newline
    body = lines[:prov_i]
    # ensure separator handling untouched: body already contains the '---' + blank line
    out = body + [new_prov, '', new_marker, '']
    return '\n'.join(out), mt, old_marker, new_marker

def build_payload(cid):
    c = byid[cid]
    exp = c['custom_expected']
    new_exp, mt, old_m, new_m = rebuild_expected(exp, cid)
    new_refs = restamp_refs(c['refs'])
    payload = dict(title=c['title'], refs=new_refs,
                   custom_preconds=c['custom_preconds'], custom_steps=c['custom_steps'],
                   custom_expected=new_exp)
    return payload, mt, old_m, new_m, c

if __name__ == '__main__':
    mode = sys.argv[1] if len(sys.argv) > 1 else 'dry'
    if mode == 'dry':
        from collections import Counter
        mc = Counter()
        for cid in UNTOUCHED:
            payload, mt, old_m, new_m, c = build_payload(cid)
            mc[mt] += 1
            print('='*100)
            print('C%d | %s | %s' % (cid, mt, c['title']))
            print('OLD refs:', c['refs'])
            print('NEW refs:', payload['refs'])
            print('--- OLD expected (tail) ---')
            print('\n'.join(c['custom_expected'].split('\n')[-6:]))
            print('--- NEW expected (tail) ---')
            print('\n'.join(payload['custom_expected'].split('\n')[-6:]))
        print('\nMARKER TYPES:', dict(mc))
