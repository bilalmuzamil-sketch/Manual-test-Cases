#!/usr/bin/env python3
"""
Standing Rule 28 dimension 2 — CROSS-CASE CONSISTENCY SWEEP over everything this
pass touched, against the WHOLE live suite.

Touched = all 478 (every case took the provenance/attestation line) of which 22 had
an assertion-bearing wording change. A conditional rewrite is exactly the edit that
can contradict a neighbour, so all four required checks run, plus two specific to
this pass:
  1. OPPOSITE-ASSERTION KEYWORDS across each report.
  2. TITLE vs EXPECTED on every case with a wording change.
  3. SAME-refs-ANCHOR CLUSTERS involving a wording-changed case.
  4. THE LOCATION-MECHANISM GROUP (untouched this pass — must be UNCHANGED).
  5. THE ATTESTATION ITSELF — exactly one per case, last, no VIU/flag word, and its
     named spec version agreeing with the report it sits under.
  6. THE FILTER-WIDTH CONSOLIDATION — exactly one surviving owner.

Read-only against a fresh live pull.
"""
import json, os, re, sys, base64, urllib.request, time, collections

HERE = os.path.dirname(os.path.abspath(__file__))
C = json.load(open('/tmp/testrail/creds.json'))
HOST = C['host'].rstrip('/')
AUTH = 'Basic ' + base64.b64encode(
    f"{C['email']}:{C.get('password') or C.get('key')}".encode()).decode()

WORDING = [30104, 30538, 30556, 30226, 30547, 30564, 43548, 30570, 30600, 30381,
           30347, 30348, 30154, 30121, 30133, 30185, 30293, 30305,
           38912, 38913, 38914, 38915]
LOCATION_HELD = [30551, 30554, 30580, 30588, 38917, 30466, 30467, 38916]
NAMES = {'SBC': ('Sales By Customer', 13), 'SBR': ('Sales By Representative', 15),
         'PV': ('Parts Velocity', 4), 'TU': ('Technician Utilization', 5),
         'WIP': ('Work In Progress', 6), 'IV': ('Inventory Value', 3)}
SECREP = {4282: 'SBC', 4283: 'SBR', 4284: 'PV', 4285: 'TU', 4286: 'WIP', 4287: 'IV'}
LEAD = 'This is the expected behaviour as per the build tested on'
WIDTH = 'The Location filter control keeps the same width whichever label it shows'


def api(p, tries=4):
    for a in range(tries):
        try:
            r = urllib.request.Request(f'{HOST}/index.php?/api/v2/{p}',
                                       headers={'Authorization': AUTH})
            with urllib.request.urlopen(r, timeout=180) as h:
                return json.loads(h.read().decode())
        except Exception:
            if a == tries - 1:
                raise
            time.sleep(2 ** a)


def paged(ep, key):
    out, off = [], 0
    while True:
        b = api(f'{ep}&limit=250&offset={off}')
        x = b.get(key, [])
        out += x
        if len(x) < 250:
            break
        off += 250
    return out


def body(c):
    return '\n'.join(str(c.get(k) or '') for k in
                     ('custom_preconds', 'custom_steps', 'custom_expected'))


def main():
    secs = paged('get_sections/1&suite_id=1', 'sections')
    kids = collections.defaultdict(list)
    for s in secs:
        kids[s['parent_id']].append(s['id'])
    ids, stack = set(), [4281]
    while stack:
        p = stack.pop()
        ids.add(p)
        stack += kids[p]
    parent = {s['id']: s['parent_id'] for s in secs}

    def rep_of(sid):
        while sid is not None:
            if sid in SECREP:
                return SECREP[sid]
            sid = parent.get(sid)
        return '??'

    allc = paged('get_cases/1&suite_id=1', 'cases')
    live = [c for c in allc if c['section_id'] in ids and c['created_by'] == 3]
    foreign = [c for c in allc if c['section_id'] in ids and c['created_by'] != 3]
    by = {c['id']: c for c in live}
    rep = {c['id']: rep_of(c['section_id']) for c in live}
    print(f'live suite (ours) {len(live)} · foreign {len(foreign)} · '
          f'wording-changed this pass {len(WORDING)}')
    miss = [w for w in WORDING if w not in by]
    if miss:
        print('NOT LIVE:', miss)
        sys.exit(1)

    findings = []

    # ---- 5. the attestation itself --------------------------------------------
    print('\n[5] THE PROVENANCE / ATTESTATION LINE — one per case, last, correct spec version')
    n_ok = 0
    for c in live:
        e = str(c.get('custom_expected') or '')
        lines = e.split('\n')
        probs = []
        if e.count(LEAD) != 1:
            probs.append('appears %d times' % e.count(LEAD))
        elif not lines[-1].startswith(LEAD):
            probs.append('not the last line')
        elif lines[-2].strip() != '---':
            probs.append('no separator directly above')
        if 'VIU' in e:
            probs.append('contains the word VIU')
        r = rep[c['id']]
        if c['id'] != 38925:
            want = '%s report specification version %d' % NAMES[r]
            if want not in e:
                probs.append('does not name "%s"' % want)
        for other, (on, ov) in NAMES.items():
            if other != r and ('%s report specification version %d' % (on, ov)) in lines[-1]:
                probs.append('names ANOTHER report (%s)' % on)
        if probs:
            findings.append('C%d attestation: %s' % (c['id'], '; '.join(probs)))
        else:
            n_ok += 1
    print(f'  {n_ok}/{len(live)} attestation lines correct, single, last, right report+version')

    # ---- 4. the Location-mechanism group -------------------------------------
    print('\n[4] LOCATION-MECHANISM GROUP — held for Chris, must be UNCHANGED in substance')
    AUTO = re.compile(r'(NOT offered in the column|not in the column-selection|'
                      r'not one of the toggleable|automatic Location column|'
                      r'appears (by itself|on its own)|is NOT one of the 20 columns|'
                      r'never listed in the Column Selection|'
                      r'visibility follows the location scope|cannot turn it on or off)', re.I)
    TOGGLE = re.compile(r'(Location IS offered in the column|Location is offered in the '
                        r'column|Location IS one of the columns|Location is one of the columns|'
                        r'Location is turned ON|Location turned on in the column|'
                        r'switched Location ON|Turning it on adds|when it is turned on)', re.I)
    grp = collections.defaultdict(lambda: {'auto': [], 'toggle': []})
    for c in live:
        t = body(c)
        if AUTO.search(t):
            grp[rep[c['id']]]['auto'].append(c['id'])
        if TOGGLE.search(t):
            grp[rep[c['id']]]['toggle'].append(c['id'])
    for r in sorted(grp):
        a, tg = grp[r]['auto'], grp[r]['toggle']
        both = set(a) & set(tg)
        pure_t = sorted(set(tg) - both)
        # a pure-toggle case is only acceptable if it is one of the HELD Location cases
        unexpected = [x for x in pure_t if x not in LOCATION_HELD]
        v = 'OK'
        if a and unexpected:
            v = 'CONTRADICTION'
            findings.append(f'{r}: toggle-model case(s) {unexpected} not in the held Location set')
        elif pure_t:
            v = 'KNOWN (held for Chris)'
        print(f'  {r:4s} automatic {sorted(a)}  toggle {sorted(tg)} -> {v}')

    # ---- 6. the filter-width consolidation -----------------------------------
    print('\n[6] FILTER-WIDTH FILLER — consolidated to exactly one owner')
    owners = sorted(c['id'] for c in live if WIDTH in body(c))
    print(f'  surviving copies: {owners}')
    if owners != [38917]:
        findings.append(f'filter-width filler expected only on C38917, found {owners}')

    # ---- 1. opposite-assertion keyword pairs ---------------------------------
    print('\n[1] OPPOSITE-ASSERTION KEYWORD PAIRS')
    PAIRS = [
        ('a "Custom" date-picker item', r'Choosing "Custom" opens|Select a Custom range|choose "Custom"'),
        ('a numbered pagination control', r'standard pagination control'),
        ('IV totals label "Totals" on screen', r'label "Totals" in the Part #'),
        ('font-weight / px assertions', r'font-weight \d|\b\d+px\b|#[0-9a-fA-F]{6}'),
        ('dev tools instruction', r'dev tools'),
        ('unbounded "regardless of" universal', r'regardless of permission, data, filters'),
    ]
    for what, pat in PAIRS:
        hits = sorted(c['id'] for c in live if re.search(pat, body(c) + ' ' + c['title']))
        tou = [h for h in hits if h in WORDING]
        print(f'  {what:38s} remaining {len(hits):3d}  of which wording-changed: {tou}')
        if tou:
            findings.append(f'{what}: still present in a case this pass edited: {tou}')

    # ---- 2. title vs expected on the wording-changed cases -------------------
    print('\n[2] TITLE vs EXPECTED on the 22 wording-changed cases')
    STOP = set('the a an and or of in on to is are with by for its it that this each every '
               'no not never always all any from as at be been shows show showing so'.split())

    def words(s):
        return {w for w in re.findall(r'[a-z0-9#%/]+', s.lower()) if w not in STOP and len(w) > 2}
    bad = []
    for cid in WORDING:
        c = by[cid]
        tw, ew = words(c['title']), words(str(c.get('custom_expected') or ''))
        if len(tw & ew) < 2:
            bad.append((cid, c['title'], sorted(tw - ew)[:6]))
    for cid, t, m in bad:
        print(f'  FLAG C{cid}: "{t}" — title words absent from expected: {m}')
        findings.append(f'C{cid} title/expected overlap thin: {m}')
    print(f'  {len(WORDING)-len(bad)}/{len(WORDING)} titles clearly echoed in their expected result')

    # ---- 3. same-anchor clusters ---------------------------------------------
    print('\n[3] SAME-ANCHOR CLUSTERS involving a wording-changed case')
    anch = collections.defaultdict(list)
    for c in live:
        for m in re.findall(r'\bS\d+-[RNE]\d+[a-z]?\b', c['refs'] or ''):
            anch[(rep[c['id']], m)].append(c['id'])
    n = 0
    for (r, a), cs in sorted(anch.items()):
        if len(cs) > 1 and set(cs) & set(WORDING):
            n += 1
            print(f'  {r} {a}: {sorted(cs)}  (changed: {sorted(set(cs)&set(WORDING))})')
    print(f'  {n} multi-case anchors involve a wording-changed case — contradictions among '
          f'them are covered by checks 1, 4 and 6.')

    print('\n' + '=' * 74)
    if findings:
        print('CONTRADICTIONS / FLAGS FOUND:')
        for f in findings:
            print('  -', f)
        sys.exit(2)
    print('ZERO CONTRADICTIONS INTRODUCED.')


if __name__ == '__main__':
    main()
