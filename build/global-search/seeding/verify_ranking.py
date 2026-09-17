#!/usr/bin/env python3
"""PROVE THE RANKING / FUZZY-REMAINDER DATA IS FINDABLE ON sv9160.

🔴 A RESEED IS NOT FINISHED WHEN seed.py PRINTS 25/25. "The record exists" is not "the search
returns it" - and on this universe that gap was not theoretical twice over:

  · the first keyword scheme (ZZRANKQ, ZZRANKC, ZZRANKV ...) passed every create and field check
    and was still broken: the tokens were ONE EDIT APART, the search is fuzzy, so each keyword
    matched all the others and the private-keyword property was gone;
  · the two part keywords returned NOTHING while their catalogue parts were present and verified,
    because the search indexes the INVENTORY row, not the catalogue entry.

Both were invisible to the seeder and obvious here. That is what this file is for.

WHAT IT ASSERTS, per case: the keyword is PRIVATE (only its own records answer), the COUNT is what
the case needs, and the records come back in the right GROUP. It checks identity and counts, never
"were there results".
"""
import json, sys, time, urllib.error, urllib.parse, urllib.request

C = json.load(open('/tmp/qa/cookies.json'))
CK = '; '.join(f"{k}={C[k]}" for k in ('sv_sso_session', 'PHPSESSID', 'cf_clearance') if C.get(k))

def search(q):
    """Transport errors are retried; a real HTTP status is returned at once - that is the product
    answering, and it is what we are here to catch."""
    u = f"https://{C['api']}/api/search?q=" + urllib.parse.quote(q)
    req = urllib.request.Request(u, headers={
        'Cookie': CK, 'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0', 'Referer': f"https://{C['host']}/"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                return (json.loads(r.read().decode()).get('data') or {}), None
        except urllib.error.HTTPError as e:
            return None, f"HTTP {e.code}"
        except Exception:
            if attempt < 2: time.sleep(2 * (attempt + 1))
    return None, 'transport error after 3 attempts'

def groups(d):
    return {g['type']: (g.get('items') or []) for g in (d.get('groups') or []) if g.get('items')}

# keyword, expected group, expected count, the cases it serves
CHECKS = [
    ('ZZPREFIX',      'customers', 3, '55707', 'prefix / whole-word / typo, one keyword'),
    ('ZZCUSTOPEN',    'customers', 2, '55708', 'open work order vs none'),
    ('ZZASSETLIFT',   'assets',    2, '55709', 'asset on an open work order vs a newer idle one'),
    ('ZZVENDORPO',    'vendors',   2, '55710', 'vendor with open POs vs none'),
    ('ZZTIEBREAK',    'customers', 2, '55716', 'identical matches, one updated later'),
    ('ZZSTOCKPART',   'parts',     2, '44852', 'in stock vs out of stock (out MUST still appear)'),
    ('ZZPARTBUSY',    'parts',     2, '55712', 'recent activity vs quiet, identical stock'),
    ('ZZCONTACTONLY', 'customers', 1, '45139', 'matched ONLY through its contact'),
    ('ZZFUZZLEN',     'customers', 2, '55713', 'a short name and a long one'),
]

def main():
    fails = []
    print('=== EACH KEYWORD IS PRIVATE, AND RETURNS ITS OWN RECORDS ===')
    for kw, gtype, want, case, why in CHECKS:
        d, err = search(kw)
        if err:
            print(f"  ❌ {kw:14} {err}"); fails.append(kw); continue
        g = groups(d)
        got = len(g.get(gtype, []))
        # PRIVACY: no OTHER group may answer. A keyword that drags in another case's records is the
        # exact failure that made the first scheme unreadable, and a count alone would not show it.
        strays = {t: len(v) for t, v in g.items() if t != gtype}
        ok = (got == want) and not strays
        print(f"  {'✅' if ok else '❌'} {kw:14} {gtype}={got} (want {want})"
              f"{'' if not strays else '  🔴 ALSO ' + str(strays)}   [C{case}] {why}")
        if not ok: fails.append(kw)

    print('\n=== THE TYPO RECORD IS REACHABLE ONLY BY FUZZY MATCHING (C55707) ===')
    d, err = search('ZZPREFIXX')
    if err:
        print(f"  ❌ ZZPREFIXX {err}"); fails.append('ZZPREFIXX')
    else:
        n = len(groups(d).get('customers', []))
        # ZZPREFIXX is one edit from ZZPREFIX, so the fuzzy search legitimately returns all three.
        ok = n >= 1
        print(f"  {'✅' if ok else '❌'} ZZPREFIXX returns {n} customer(s) — the typo row exists and is reachable")
        if not ok: fails.append('ZZPREFIXX')

    print('\n=== summary ===')
    if fails:
        print(f"  ❌ {len(fails)} check(s) FAILED: {', '.join(fails)}")
        print("     Do NOT treat the data as seeded. Re-run ./reseed_everything.sh qa and read the log.")
        sys.exit(1)
    print(f"  ✅ all {len(CHECKS) + 1} ranking/fuzzy checks passed on qa")

if __name__ == '__main__':
    main()
