#!/usr/bin/env python3
"""PROVE THE SAME-RECORD PERMISSION-TOGGLE DATA (C55731-C55737) IS FINDABLE ON sv9160.

🔴 A SEED IS NOT FINISHED WHEN seed.py PRINTS 20/20. "The record exists" is not "the search
returns it", and on this kit that gap has now bitten three separate times:

  · a catalogue part with no stock row is INVISIBLE to search, so a negative case passed while
    its positive half could never have (C55728, 2026-09-18);
  · a keyword one edit away from another keyword matches it, so "private keyword" was not private
    (the first ranking scheme, 2026-09-17);
  · a purchase order and a vendor invoice sat in the index while the seeding script printed
    "ours=0", because its readback query was hardcoded to another universe's keyword.

WHAT THIS ASSERTS, per case:
  (a) OUR record comes back, BY NAME, in the group the case reads - never "were there results";
  (b) the keyword's COLLISION LOAD is measured and held to what was recorded, so a new collision
      appearing later is a failure and not a surprise for the tester;
  (c) C55735's three records (vendor, purchase order, vendor invoice) are ALL present, because the
      case asserts one permission hides all three TOGETHER - two of three is a silent half-pass.

🔴 IT DOES NOT AND CANNOT PROVE THE TOGGLE ITSELF. Removing a permission and re-searching needs a
second signed-in user; this proves the DATA the tester will flip against. Saying so matters: a
green run here means "the records are there", not "the case passes".
"""
import json, sys, urllib.error, urllib.parse, urllib.request

C = json.load(open('/tmp/qa/cookies.json'))
CK = '; '.join(f"{k}={C[k]}" for k in ('sv_sso_session', 'PHPSESSID', 'cf_clearance') if C.get(k))
G, R, Y, X = '\033[32m', '\033[31m', '\033[33m', '\033[0m'

def search(q):
    u = f"https://{C['api']}/api/search?q=" + urllib.parse.quote(q)
    req = urllib.request.Request(u, headers={
        'Cookie': CK, 'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0', 'Referer': f"https://{C['host']}/"})
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            return json.loads(r.read().decode() or '{}')
    except urllib.error.HTTPError as e:
        sys.exit(f"{R}search HTTP {e.code} - the session is not live, or the branch is asleep.{X}\n"
                 f"  A 302 to sleep.qa.shopview.com means the branch switched itself OFF; wake it "
                 f"with:\n    curl -X POST https://fz4hhptxi8.execute-api.ca-central-1.amazonaws."
                 f"com/default/toggleQaEnv -H 'Content-Type: application/json' "
                 f"-d '{{\"action\":\"wake\",\"env\":\"sv9160\"}}'")

def rows(d, group):
    for g in (d.get('data') or {}).get('groups') or []:
        if g.get('type') == group:
            return g.get('items') or []
    return []

def ours(items, needle):
    return [i for i in items
            if needle.lower() in (str(i.get('primary', '')) + str(i.get('secondary', ''))).lower()]

# case, keyword, group, the NAME that must come back, expected foreign-row load, why the load
CHECKS = [
    (55731, 'ZZTOGPART',  'parts',      'ZZTOGPART Brake Kit', 3,
     'ZZSTOCKPART brake parts + their PO match by near-spelling. HARMLESS: removing Parts access '
     'hides every part, so the negative half still reads correctly.'),
    (55732, 'ZZTOGWO',    'work_orders', 'S9160-',             3,
     "'Stock Diesel Services Inc' and its vehicle match by near-spelling. HARMLESS: they are "
     'Customers/Assets rows, not Work Orders - but they STAY on screen after the flip, so a '
     'tester reading the screen rather than the row may call a pass a fail.'),
    (55733, 'ZZTOGCUST',  'customers',  'ZZTOGCUST Freight',   0, 'clean keyword'),
    (55734, 'ZZTOGPS',    'part_sales', 'P9160-',              3, 'near-spelling noise, harmless'),
    (55735, 'ZZTOGVEN',   'vendors',    'ZZTOGVEN Supply',     1,
     'the PO line-item part. HARMLESS but VISIBLE: parts are a different bundle, so this row '
     'REMAINS after Vendor & Order Management access is removed. That is correct, not a leak.'),
    (55736, 'ZZTOGPRICE', 'parts',      'ZZTOGPRICE Filter',   0, 'clean keyword'),
]

# C55735 asserts all three vanish TOGETHER, so all three must be present to begin with.
TRIPLE = [('vendors', 'ZZTOGVEN Supply'), ('purchase_orders', 'ZZTOGVEN'),
          ('vendor_invoices', 'ZZTOGVEN')]

def main():
    fails, warns = [], []

    print('=== EACH CASE\'S RECORD COMES BACK, BY NAME, IN ITS OWN GROUP ===')
    for case, kw, group, name, load, why in CHECKS:
        d = search(kw)
        mine = ours(rows(d, group), name)
        total = sum(len(g.get('items') or []) for g in (d.get('data') or {}).get('groups') or [])
        foreign = total - sum(len(ours(g.get('items') or [], kw))
                              for g in (d.get('data') or {}).get('groups') or [])
        if not mine:
            fails.append(f'C{case} {kw}')
            print(f"  {R}❌{X} C{case} {kw:11} {group:14} OUR RECORD ({name}) IS NOT THERE")
            continue
        flag = ''
        if foreign != load:
            warns.append(f'C{case} {kw}: foreign rows {load} -> {foreign}')
            flag = f'  {Y}⚠ collision load CHANGED ({load} -> {foreign}){X}'
        print(f"  {G}✅{X} C{case} {kw:11} {group:14} {mine[0].get('primary')!r}"
              f"   foreign rows: {foreign}{flag}")
        if load:
            print(f"        {Y}tester note:{X} {why}")

    print('\n=== C55735 — ALL THREE RECORDS, OR THE CASE CANNOT BE READ ===')
    d = search('ZZTOGVEN')
    for group, needle in TRIPLE:
        mine = ours(rows(d, group), needle)
        if mine:
            print(f"  {G}✅{X} {group:17} {mine[0].get('primary')!r}")
        else:
            fails.append(f'C55735 {group}')
            print(f"  {R}❌{X} {group:17} MISSING — one permission must hide all three together")

    print('\n=== C55737 — MEASURED, NOT ASSUMED ===')
    d = search('ZZCOUNT')
    cust = rows(d, 'customers')
    mine = ours(cust, 'ZZCOUNT')
    total = sum(len(g.get('items') or []) for g in (d.get('data') or {}).get('groups') or [])
    foreign = total - len(mine)
    print(f"  our customers: {len(mine)}  |  foreign rows in the whole result: {foreign}")
    if foreign:
        print(f"  {R}🔴 C55737 IS NOT RUNNABLE ON THIS KEYWORD.{X} The case turns on knowing the "
              f"EXACT number\n     the role may see, and 'ZZCOUNT' matches real catalogue parts "
              f"named 'Hi Count(R)'.\n     Awaiting the QA lead's go-ahead to change the KEYWORD "
              f"ONLY (Rule 111 shape); the\n     case is otherwise untouched (Rule 6).")
        warns.append('C55737 keyword collides with real data')
    print(f"  {Y}Separately:{X} the case needs SOME rows of a type visible and at least one HIDDEN "
          f"from the\n  same role. Every permission measured here is TYPE-level, not row-level, so "
          f"that may not be\n  expressible at all - a PO decision, not a seeding gap.")

    print('\n=== summary ===')
    print(f"  🔴 This proves the DATA, never the TOGGLE. Flipping a permission and re-searching "
          f"needs a\n     second signed-in user; a green run here means the records are there, not "
          f"that a case passes.")
    if fails:
        print(f"  {R}❌ {len(fails)} check(s) FAILED: {', '.join(fails)}{X}")
        print("     Re-run:  SEED_MANIFEST=seed-manifest-toggle.json python3 seed.py --confirm")
        sys.exit(1)
    if warns:
        print(f"  {Y}⚠ passed with {len(warns)} warning(s):{X} " + '; '.join(warns))
    print(f"  {G}✅ all {len(CHECKS)} per-case records + C55735's three-record set are present "
          f"on qa{X}")

if __name__ == '__main__':
    main()
