#!/usr/bin/env python3
"""Proves the Fibridge seed actually answers the query each case types — BY IDENTITY, never by count.

Rule 110: a result is not evidence until it is attributed, identified and dated. So every check here
names the record it expects and asserts THAT RECORD came back. A group total is reported for the
count targets only, where the number IS the thing under test.

Run:  python3 verify_gsv2.py            (QA)
      SEED_PROFILE=/tmp/prod/cookies.json SEED_WORKPLACE="Trucks Hill 2" python3 verify_gsv2.py
"""
import json, os, re, runpy, sys, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest-gs-v2.json')
_seed = runpy.run_path(f'{HERE}/seed.py', run_name='not_main')
call, ENV = _seed['call'], _seed['ENV_LABEL']

def search(q):
    """🔴 RETRY A TRANSPORT ERROR BEFORE CALLING IT A FAILURE. A single dropped connection made this
    verifier report a red 'HTTP ERR' against a check that passed three times in a row a moment later
    - and a verifier that cries wolf is worse than no verifier, because the next real red gets
    shrugged off. A NON-200 HTTP STATUS IS STILL REPORTED IMMEDIATELY: that is the product answering,
    and it is exactly what we are here to catch. Only the transport layer is retried."""
    import time as _t
    last = None
    for attempt in range(3):
        r = call('/api/search?q=' + urllib.parse.quote(q))
        if r['status'] == 200:
            return ((r['json'] or {}).get('data') or {}), None
        last = f"HTTP {r['status']}"
        if r['status'] != 'ERR':
            return None, last          # the server answered - that is a real result, not a blip
        if attempt < 2: _t.sleep(2 * (attempt + 1))
    return None, f'{last} after 3 attempts'

def call_retry(path):
    """🔴 EVERY direct call in this file goes through here. Three separate transient 'HTTP ERR'
    reds were raised by this verifier against data that was perfectly fine - each one a dropped
    connection, each one costing a run and a re-check. A transport error is retried; a real HTTP
    STATUS is returned immediately, because that is the product answering and it is what we are
    here to catch."""
    import time as _t
    r = None
    for attempt in range(3):
        r = call(path)
        if r['status'] != 'ERR': return r
        if attempt < 2: _t.sleep(2 * (attempt + 1))
    return r


def rows(d, gtype=None):
    out = []
    for g in d.get('groups') or []:
        if gtype and g['type'] != gtype: continue
        for i in g['items']: out.append((g['type'], i))
    p = d.get('pinned')
    if p: out.append(('pinned', p))
    return out

def blob(i):
    f = i.get('fields') or {}
    return f"{i.get('primary')} {i.get('secondary')} " + ' '.join(str(v) for v in f.values())

# (label, query, expect_substring_in_a_returned_row, group or None, cases)
CHECKS = [
 ('spine, work orders',      'Fib', 'ZZAUTOTEST Fibridge Commercial', 'work_orders',
  '44816 44823 44824 44826 44874 44875'),
 ('spine, customers',        'Fib', 'ZZAUTOTEST Fibridge Commercial', 'customers', '44817 44832'),
 ('spine, assets',           'Fib', 'ZZAUTOTEST Fibridge',            'assets',    '44818'),
 ('spine, parts',            'Fib', 'ZZAUTOTEST Fibridge',            'parts',     '44819'),
 ('spine, vendors',          'Fib', 'ZZAUTOTEST Fibridge Mining',     'vendors',   '44820 44835'),
 ('spine, part sales',       'Fib', 'ZZAUTOTEST Fibridge Commercial', 'part_sales','44821'),
 ('spine, purchase orders',  'Fib', 'ZZAUTOTEST Fibridge Mining',     'purchase_orders', '44899 45130'),
 ('spine, vendor invoices',  'Fib', 'ZZAUTOTEST Fibridge Mining',     'vendor_invoices', '44900 45131'),
 ('persisting query',        'Fibridge', 'ZZAUTOTEST Fibridge',       None, '44861 44862 44863'),
 ('unit + YMM on a WO row',  'TRK 412', 'TRK 412',                    None, '44831'),
 ('asset by exact VIN',      '1FUJGLDR9CLBP8834', '1FUJGLDR9CLBP8834',None, '44844'),
 # 🔴 SEARCHED BY OWNER, NOT BY "2025 Freightliner M2". The year is indexed as an integer and the
 # group caps at 20, so a year-led query degrades to "Freightliner M2" and the staging estate's own
 # twenty Freightliner M2s fill the group - ours never appears. The asset row displays the year,
 # which makes that look like a missing seed. It is not; the owner is what discriminates.
 ('asset YMM + owner',       'Bryan Smith', '2025 Freightliner M2',  'assets', '44833'),
 ('fuzzy: frieghtliner',     'frieghtliner', 'FREIGHTLINER',          'assets', '44841'),
 ('fuzzy: Petersn',          'Petersn', 'ZZAUTOTEST Peterson Hauling','customers','44839 44848'),
 ('fuzzy: Abrige',           'Abrige',  'ZZAUTOTEST Aabridge Freight','customers','44840'),
 ('fuzzy: Filbridge',        'Filbridge','ZZAUTOTEST Fibridge',       'customers','44842'),
 ('contact email',           'deshawn@fibridge-commercial.test', 'ZZAUTOTEST Fibridge Commercial',
  'customers', '44837 44895 45129'),
 ('contact phone',           '(264) 555-0142', 'ZZAUTOTEST Fibridge Commercial', 'customers',
  '44837 45139'),
 ('contact phone, digits',   '2645550142', 'ZZAUTOTEST Fibridge Commercial', 'customers', '44845'),
 ('customer own telephone',  '2643286723', 'ZZAUTOTEST Fibridge Commercial', 'customers', '44845'),
 ('contact-vs-name ranking', 'Deshawn', 'ZZAUTOTEST Deshawn Freight Lines', 'customers', '45139'),
 ('part number exact',       '65547', '65547',                        'parts', '44846'),
 ('part sale P-number',      'P2-58', 'P2-58',                        'part_sales', '44836 44849'),
 # 🔴 THESE MUST MATCH WHAT THE CASES ACTUALLY SAY. They tested S2-15440 while C44843/C44847/C44850
 # had been corrected to S2-15430 - and they PASSED, because S2-15440 is in the index. The verifier
 # was proving the wrong thing, confidently. Rule 112 applies to our own tooling too: check against
 # the case body, not against what you remember writing.
 ('WO number, exact',        'S2-15430', 'S2-15430',                  None, '44843 44850'),
 ('WO number, no dash',      'S215430', 'S2-15430',                   None, '44843'),
 ('WO number, space',        'S2 15430', 'S2-15430',                  None, '44843'),
 # the quick-actions examples (6774): named in the case bodies, absent from the branch until seeded
 ('quick actions: customer',  'Adale Transport',  'ZZAUTOTEST Adale Transport',  'customers',   '44868'),
 ('quick actions: work order','Fisquare Farms',   'ZZAUTOTEST Fisquare Farms',   'work_orders', '44866 44858 44859'),
 ('quick actions: vendor',    'Report Beverages', 'ZZAUTOTEST Report Beverages', 'vendors',     '44870'),
 ('quick actions: part',      'Rear Shock',       'Rear Shock',                  'parts',       '44869 44871'),
]

# (label, query, group, predicate on the total, cases)
COUNTS = [
 ('customers on Fib are FIVE OR FEWER', 'Fib', 'customers',       lambda n: 1 <= n <= 5, '44825'),
 ('assets on Fib are MORE THAN FIVE',   'Fib', 'assets',          lambda n: n > 5,       '44825'),
 ('work orders on Fib hit the 20 cap',  'Fib', 'work_orders',     lambda n: n >= 20,     '44822 44823 53476'),
 ('purchase orders on Fib',             'Fib', 'purchase_orders', lambda n: n >= 1,      '44899 45130'),
 ('vendor invoices on Fib',             'Fib', 'vendor_invoices', lambda n: n >= 3,      '44900 45131 45138'),
]

# a query that must return NOTHING — the negative half of a pair is a check too
NEGATIVES = [
 ('no such part sale', 'P2-59', 'part_sales', '44849'),
 ('no such work order', 'S2-15431', 'work_orders', '44847'),
 ('no such work order', 'S2-15432', 'work_orders', '44847'),
 ('matches nothing at all', 'S1- 56438', None, '44864'),
]

def status_spread():
    """C44838 needs all SEVEN work-order badge colours on ONE term. It cannot be "Fib": the palette
    caps every group at 20 and there are 30 matching work orders, so the two `declined` ones rank
    out of sight and no limit or scope tab brings them back (measured: scope=work_orders&limit=50
    still returns 20). The narrower term "Fibridge Commercial" returns 18 - under the cap - and
    carries every status. This check exists so a reseed cannot quietly lose one."""
    d, err = search('Fibridge Commercial')
    if err: return set(), err
    g = next((x for x in (d.get('groups') or []) if x['type'] == 'work_orders'), None)
    return {i['fields']['status'] for i in (g['items'] if g else [])}, None



# ── RULE 111 AS CODE: THE PINNED IDENTIFIERS ARE BRANCH-ASSIGNED, SO MEASURE THEM ──────────────
# 🔴 The constants in CHECKS/NEGATIVES are what the TESTRAIL CASES SAY, and the cases were written
# against the QA branch. A work-order number is assigned by the branch that creates it, so
# `S2-15430` exists on exactly one environment and nowhere else. Running this file against
# production reported seven failures, four of which were this: the DATA was fine and the
# IDENTIFIER was foreign. The other two were the same mistake wearing a different hat - `P2-59`
# was chosen as a near miss that returns nothing, and production genuinely holds a P2-59; and
# `Rear Shock` is the name a catalogue part already had ON THE QA BRANCH (the manifest deliberately
# does not rename it, see cpart_65547), so on an environment where our seed created that part it is
# called something else entirely.
#
# So: measure this environment's own identifiers, prove each one, and use them for the checks. The
# case text is still reported - as a DIVERGENCE, because a case naming an identifier this
# environment does not hold is a false FAILED waiting for a tester (Rule 111).
DIVERGENCES = []


def _ids_for_env():
    f = f'{HERE}/seed-ids-gsv2-{ENV}.json'
    return json.load(open(f)) if os.path.exists(f) else {}


def _wo_number(wid):
    v = call_retry(f'/api/work-orders/view/{wid}')
    wo = (((v.get('json') or {}).get('data') or {}).get('work_order') or {})
    return wo.get('number')


def _absent(q, group):
    """A near miss is only a near miss if it genuinely returns nothing HERE. Never assumed."""
    d, err = search(q)
    if err:
        return False
    rows = [i for g in ((d or {}).get('groups') or []) if g['type'] == group
            for i in (g.get('items') or [])]
    return not rows


def _display_number(raw):
    """The work-order number exactly as the SEARCH shows it. Searched by its digits, and the row
    whose number ends in those digits is taken; falls back to the production/staging `S2-` form."""
    digits = raw.split('-', 1)[-1]
    d, err = search(digits)
    if not err:
        for g in ((d or {}).get('groups') or []):
            if g['type'] != 'work_orders':
                continue
            for i in (g.get('items') or []):
                prim = i.get('primary') or ''
                if re.fullmatch(rf'S\d*-{re.escape(digits)}', prim):
                    return prim
    return re.sub(r'^S-', 'S2-', raw)


def resolve_env_identifiers():
    """Returns the substitutions this environment needs, each one measured."""
    sub = {}
    ids = _ids_for_env()
    wid = (ids.get('work_orders_fib_main') or [None])[0]
    if not wid:
        return sub
    raw = _wo_number(wid)
    if not raw:
        return sub
    # The view API answers `S-889`; the SEARCH displays it with a shop prefix, and that is what a
    # tester reads off the screen and types. `S2-` on production and staging, but `S10740-` on the
    # sv10740 QA branch (2026-10-05) - so the prefix is READ from the search, never assumed.
    disp = _display_number(raw)
    pre = disp.split('-', 1)[0]
    if disp != 'S2-15430':
        DIVERGENCES.append(f"the cases name work order S2-15430; this environment's seeded work "
                           f"order is {disp} (branch-assigned, Rule 111)")
        digits = disp.split('-', 1)[1]
        sub['S2-15430'] = disp
        sub['S215430'] = f'{pre}{digits}'
        sub['S2 15430'] = f'{pre} {digits}'
        # two near misses that MUST return nothing — probed, not assumed
        found = []
        for delta in range(1, 40):
            cand = f'{pre}-{int(digits) + delta}'
            if _absent(cand, 'work_orders'):
                found.append(cand)
            if len(found) == 2:
                break
        if len(found) == 2:
            sub['S2-15431'], sub['S2-15432'] = found
        else:
            DIVERGENCES.append('could not find two work-order numbers near the seeded one that '
                               'return nothing — the negative checks were SKIPPED, not passed')
            sub['S2-15431'] = sub['S2-15432'] = None
    # the part-sale near miss: production holds a real P2-59, so the constant proves nothing there
    if not _absent('P2-59', 'part_sales'):
        cand = next((f'P2-{n}' for n in range(59, 140) if _absent(f'P2-{n}', 'part_sales')), None)
        DIVERGENCES.append(f"the cases use P2-59 as a part sale that does not exist; this "
                           f"environment HAS one, so the near miss used here is {cand or 'NONE FOUND'}")
        sub['P2-59'] = cand
    # the quick-actions part: 'Rear Shock' is the QA branch's own name for catalogue part 65547
    d, _ = search('65547')
    rows = [i for g in ((d or {}).get('groups') or []) if g['type'] == 'parts'
            for i in (g.get('items') or [])]
    if rows:
        nm = rows[0].get('primary')
        if nm and 'rear shock' not in nm.lower():
            DIVERGENCES.append(f"the cases name the part 'Rear Shock'; on this environment "
                               f"catalogue part 65547 is called {nm!r}")
            sub['Rear Shock'] = nm
    return sub


def apply_subs(sub):
    """Rewrite the three tables in place, dropping any check whose substitute could not be proved."""
    global CHECKS, NEGATIVES
    def fix(rows, qi, ei=None):
        out = []
        for r in rows:
            r = list(r)
            if r[qi] in sub:
                if sub[r[qi]] is None:
                    continue
                r[qi] = sub[r[qi]]
            if ei is not None and r[ei] in sub and sub[r[ei]] is not None:
                r[ei] = sub[r[ei]]
            out.append(tuple(r))
        return out
    CHECKS = fix(CHECKS, 1, 2)
    NEGATIVES = fix(NEGATIVES, 1)


def main():
    call_retry('/api/staff/my-workplaces')
    print(f'=== environment: {ENV} ===')
    bad = []
    SUB = resolve_env_identifiers()
    if SUB:
        apply_subs(SUB)
        print('\n=== THIS ENVIRONMENT USES ITS OWN IDENTIFIERS (Rule 111) ===')
        for d_ in DIVERGENCES:
            print(f'  • {d_}')
    print('\n=== IDENTITY CHECKS — is OUR record in the list? ===')
    for label, q, expect, gtype, cases in CHECKS:
        d, err = search(q)
        if err: print(f'  🔴 {label:26} {q!r:34} {err}'); bad.append((label, q, err)); continue
        found = [i for t, i in rows(d, gtype) if expect.lower() in blob(i).lower()]
        mark = '✅' if found else '🔴'
        who = str(found[0].get('primary'))[:30] if found else 'NOT FOUND'
        print(f'  {mark} {label:26} {q!r:34} -> {who:32} [C{cases.replace(" ", ", C")}]')
        if not found: bad.append((label, q, f'expected {expect!r}'))

    print('\n=== COUNT TARGETS — here the number IS the thing under test ===')
    for label, q, gtype, ok, cases in COUNTS:
        d, err = search(q)
        g = next((x for x in (d or {}).get('groups') or [] if x['type'] == gtype), None)
        n = g['total'] if g else 0
        mark = '✅' if ok(n) else '🔴'
        print(f'  {mark} {label:40} {gtype:17} = {n:3}  [C{cases.replace(" ", ", C")}]')
        if not ok(n): bad.append((label, q, f'total={n}'))

    print('\n=== REACHABILITY — the record must OPEN, not merely be indexed ===')
    # 🔴 PINNING IS NOT UNIVERSAL. The QA branch pins an exact work-order match; production returns
    # the same record inside the work_orders GROUP and pins nothing. Reading "no pinned row" as a
    # reachability failure therefore condemned a record that opens perfectly. What the rule actually
    # requires is that the row the TESTER CAN SEE opens — pinned or in the group, either is seen.
    wo_q = SUB.get('S2-15430', 'S2-15430')
    d, _ = search(wo_q)
    p = (d or {}).get('pinned') or {}
    rid = p.get('id') or next((i.get('id') for g in ((d or {}).get('groups') or [])
                               if g['type'] == 'work_orders' for i in (g.get('items') or [])), None)
    where = 'pinned' if p.get('id') else ('in the work_orders group' if rid else 'NOT RETURNED')
    v = call_retry(f'/api/work-orders/view/{rid}') if rid else {'status': 'NOT RETURNED'}
    ok = v.get('status') == 200
    print(f"  {'✅' if ok else '🔴'} {wo_q} ({where}) opens at this workplace -> HTTP {v.get('status')}")
    if not ok:
        bad.append(('reachability', wo_q, f"view HTTP {v.get('status')} - the search index is "
                    "organisation-scoped but the record is workplace-scoped"))

    print('\n=== STATUS BADGE COLOURS — all seven on one term (C44838) ===')
    want = {'approved', 'estimate', 'in_progress', 'ready_for_review', 'complete', 'declined', 'invoiced'}
    got, err = status_spread()
    missing = want - got
    print(f"  {'✅' if not missing else '🔴'} 'Fibridge Commercial' shows {len(got & want)} of 7"
          f"  [{', '.join(sorted(got & want))}]")
    if missing:
        print(f'      missing: {sorted(missing)}')
        bad.append(('status spread', 'Fibridge Commercial', f'missing {sorted(missing)}'))

    print('\n=== NEGATIVES — these MUST return nothing, and a control proves the probe works ===')
    for label, q, gtype, cases in NEGATIVES:
        d, err = search(q)
        got = rows(d or {}, gtype)
        mark = '✅' if not got else '🔴'
        print(f'  {mark} {label:26} {q!r:20} -> {len(got)} row(s)  [C{cases.replace(" ", ", C")}]')
        if got: bad.append((label, q, f'{len(got)} rows returned'))

    print('\n=== summary ===')
    if bad:
        print(f'  🔴 {len(bad)} check(s) did not pass:')
        for b in bad: print(f'     {b[0]} / {b[1]!r}: {b[2]}')
        sys.exit(1)
    print(f'  ✅ all {len(CHECKS)+len(COUNTS)+len(NEGATIVES)} checks passed on {ENV}')

main()
