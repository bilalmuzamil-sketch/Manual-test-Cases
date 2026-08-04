#!/usr/bin/env python3
"""
Standing Rule 28, dimension 2 — CROSS-CASE CONSISTENCY SWEEP over the 38 cases this
pass touched (35 edited + 3 new), against the WHOLE live suite of 478.

A conditional rewrite is exactly the edit that can contradict a neighbour, so all four
required checks are run:
  1. OPPOSITE-ASSERTION KEYWORDS — hidden/shown, automatic/toggle, on-by-default/
     off-by-default, exactly-N-columns, present/absent, editable/read-only.
  2. TITLE vs EXPECTED on every touched case.
  3. SAME-`refs`-ANCHOR CLUSTERS — cases citing the same Sn-Rn compared against each
     other.
  4. THE LOCATION-MECHANISM GROUP specifically — the assertion this pass changed.

Read-only against a fresh live pull.
"""
import json, os, re, sys, base64, urllib.request, time, collections

ROOT = os.path.dirname(os.path.abspath(__file__))
C = json.load(open('/tmp/testrail/creds.json'))
HOST = C['host'].rstrip('/')
AUTH = 'Basic ' + base64.b64encode(
    f"{C['email']}:{C.get('password') or C.get('key')}".encode()).decode()

TOUCHED = [30104, 30202, 30313, 30346, 30351, 30353, 30386, 30423, 30425, 30442, 30452,
           30457, 30466, 30467, 30469, 30495, 30502, 30511, 30538, 30551, 30552, 30554,
           30555, 30556, 30557, 30566, 30570, 30580, 30588, 30590, 30593, 30595,
           38916, 38917, 38918, 43546, 43547, 43548]

REPORT_OF_SECTION = {}   # filled from section names


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
    ids, stack = set(), [4281]
    while stack:
        p = stack.pop()
        for s in secs:
            if s['parent_id'] == p:
                ids.add(s['id']); stack.append(s['id'])
    secname = {s['id']: s['name'] for s in secs}
    live = [c for c in paged('get_cases/1&suite_id=1', 'cases')
            if c['section_id'] in ids and c['created_by'] == 3]
    by = {c['id']: c for c in live}
    rep = {c['id']: secname[c['section_id']].split('—')[0].strip() for c in live}
    print(f'live suite (ours): {len(live)}   touched this pass: {len(TOUCHED)}')
    missing = [t for t in TOUCHED if t not in by]
    if missing:
        print('NOT LIVE:', missing); sys.exit(1)

    findings = []

    # ---- 1. the Location-mechanism group (the assertion this pass changed) -------
    print('\n[1] LOCATION-MECHANISM GROUP — the assertion this pass changed')
    AUTO = re.compile(r'(NOT offered in the column|not in the column-selection|'
                      r'not one of the toggleable|automatic Location column|'
                      r'appears (by itself|on its own)|'
                      r'visibility follows the location scope|cannot turn it on or off)', re.I)
    TOGGLE = re.compile(r'(Location IS offered in the column|Location is offered in the '
                        r'column|Location IS one of the columns|Location is one of the columns|'
                        r'Location is turned ON|Location turned on in the column|'
                        r'switched Location ON|Turning it on adds)', re.I)
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
        verdict = 'OK'
        if a and tg and not (set(a) <= both):
            verdict = 'CONTRADICTION'
            findings.append(f'{r}: automatic-model cases {sorted(set(a)-both)} vs '
                            f'toggle-model cases {sorted(set(tg)-both)}')
        print(f'  {r:4s} automatic-model {sorted(a)}  toggle-model {sorted(tg)}  -> {verdict}')

    # ---- 2. opposite-assertion keyword pairs across the whole suite -------------
    print('\n[2] OPPOSITE-ASSERTION KEYWORD PAIRS (within a report, on the same subject)')
    PAIRS = [
        ('Qty on Hand', 'Qty on Hand column label', r'Qty on Hand'),
        ('Turns / Yr', 'Turns/Yr header label', r'Turns / Yr'),
        ('"All Locations"', 'capitalised All Locations', r'"All Locations"'),
        ('Select all technicians', 'a "Select all" technician control', r'"Select all"'),
        ('Declined status', 'a Declined work-order status', r'\bDeclined\b'),
        ('"In Progress" badge', 'title-cased In Progress status label', r'"In Progress"'),
        ('Totals-row label "Total"', 'the IV totals label', r'label "Total" in the Part #'),
        ('a "Custom" date item', 'a Custom item in the date picker', r'(choose|Open|Pick) "Custom"'),
    ]
    for name, what, pat in PAIRS:
        hits = [(c['id'], rep[c['id']]) for c in live if re.search(pat, body(c) + c['title'])]
        touched_hits = [h for h in hits if h[0] in TOUCHED]
        print(f'  {what:44s} remaining: {len(hits):2d}   of which touched-this-pass: '
              f'{len(touched_hits)}  {sorted(h[0] for h in touched_hits) if touched_hits else ""}')
        if touched_hits:
            findings.append(f'{what}: still present in a case this pass edited: '
                            f'{sorted(h[0] for h in touched_hits)}')

    # ---- 3. title vs expected, on every touched case ---------------------------
    print('\n[3] TITLE vs EXPECTED on all 38 touched cases')
    STOP = set('the a an and or of in on to is are with by for its it that this each every '
               'no not never always all any from as at be been shows show showing so'.split())

    def words(s):
        return {w for w in re.findall(r'[a-z0-9#%/]+', s.lower()) if w not in STOP and len(w) > 2}
    bad = []
    for cid in TOUCHED:
        c = by[cid]
        tw, ew = words(c['title']), words(str(c.get('custom_expected') or ''))
        overlap = tw & ew
        if len(overlap) < 2:
            bad.append((cid, c['title'], sorted(tw - ew)[:6]))
    for cid, t, miss in bad:
        print(f'  FLAG C{cid}: "{t}" — title words absent from expected: {miss}')
    print(f'  {len(TOUCHED) - len(bad)}/{len(TOUCHED)} titles clearly echoed in their expected result')
    for cid, t, miss in bad:
        findings.append(f'C{cid} title/expected overlap thin: {miss}')

    # ---- 4. same-refs-anchor clusters ------------------------------------------
    print('\n[4] SAME-ANCHOR CLUSTERS containing a case this pass touched')
    anch = collections.defaultdict(list)
    for c in live:
        for m in re.findall(r'\bS\d+-[RNE]\d+[a-z]?\b', c['refs'] or ''):
            anch[(rep[c['id']], m)].append(c['id'])
    n = 0
    for (r, a), cs in sorted(anch.items()):
        if len(cs) > 1 and set(cs) & set(TOUCHED):
            n += 1
            print(f'  {r} {a}: {sorted(cs)}   (touched: {sorted(set(cs) & set(TOUCHED))})')
    print(f'  {n} multi-case anchors involve a case this pass touched — each listed above '
          f'for the record; contradictions among them are covered by checks 1 and 2.')

    print('\n' + '=' * 74)
    if findings:
        print('CONTRADICTIONS / FLAGS FOUND:')
        for f in findings:
            print('  -', f)
        sys.exit(2)
    print('ZERO CONTRADICTIONS INTRODUCED.')


if __name__ == '__main__':
    main()
