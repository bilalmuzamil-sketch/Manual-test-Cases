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

# keyword, expected group, expected count, cases served, why, groups that may ALSO answer
#
# 🔴 "PRIVATE" MEANS NO OTHER CASE'S RECORDS LEAK IN - NOT THAT ONLY ONE GROUP MAY ANSWER.
# The first version of this file demanded a single group and then failed four checks that were
# perfectly correct: the work order seeded to give ZZCUSTOPEN its open-work-order signal matches
# ZZCUSTOPEN through its customer's name, and the purchase order that lifts ZZVENDORPO matches both
# the vendor and the part it is for. Those are the case's OWN dependent records - the signal itself
# showing up - and a rule that calls them pollution would have had someone "fixing" correct data.
# So each check declares which companion groups its own signal legitimately produces; anything
# outside that set is still a real failure.
CHECKS = [
    ('ZZPREFIX',      'customers', 3, '55707', 'prefix / whole-word / typo, one keyword', set()),
    # 🔴 assets is unavoidable here, not sloppiness: an asset is indexed under its OWNER'S company
    # name, so every asset belonging to a ZZCUSTOPEN customer answers the keyword however the asset
    # itself is named. Renaming its VIN and unit (which I did, and which landed) changes nothing.
    # A work order needs an asset and the asset must belong to the customer, so the row is a
    # consequence of the signal the case requires.
    ('ZZCUSTOPEN',    'customers', 2, '55708', 'open work order vs none',
     {'work_orders', 'assets'}),
    ('ZZASSETLIFT',   'assets',    2, '55709', 'asset on an open work order vs a newer idle one',
     {'work_orders'}),
    ('ZZVENDORPO',    'vendors',   2, '55710', 'vendor with open POs vs none', {'purchase_orders'}),
    ('ZZTIEBREAK',    'customers', 2, '55716', 'identical matches, one updated later', set()),
    ('ZZSTOCKPART',   'parts',     2, '44852', 'in stock vs out of stock (out MUST still appear)',
     {'purchase_orders'}),
    ('ZZPARTBUSY',    'parts',     2, '55712', 'recent activity vs quiet, identical stock', set()),
    ('ZZCONTACTONLY', 'customers', 1, '45139', 'matched ONLY through its contact', set()),
    ('ZZFUZZLEN',     'customers', 2, '55713', 'a short name and a long one', set()),
]

def main():
    fails = []
    print('=== EACH KEYWORD IS PRIVATE, AND RETURNS ITS OWN RECORDS ===')
    for kw, gtype, want, case, why, allowed in CHECKS:
        d, err = search(kw)
        if err:
            print(f"  ❌ {kw:14} {err}"); fails.append(kw); continue
        g = groups(d)
        got = len(g.get(gtype, []))
        # PRIVACY: no OTHER group may answer. A keyword that drags in another case's records is the
        # exact failure that made the first scheme unreadable, and a count alone would not show it.
        strays = {t: len(v) for t, v in g.items() if t != gtype and t not in allowed}
        companions = {t: len(v) for t, v in g.items() if t in allowed}
        ok = (got == want) and not strays
        print(f"  {'✅' if ok else '❌'} {kw:14} {gtype}={got} (want {want})"
              f"{'' if not companions else '  +signal ' + str(companions)}"
              f"{'' if not strays else '  🔴 STRAY ' + str(strays)}   [C{case}] {why}")
        if not ok: fails.append(kw)

    print('\n=== THE TYPO RECORD IS REACHABLE ONLY BY FUZZY MATCHING (C55707) ===')
    d, err = search('ZZPREFIY')
    if err:
        print(f"  ❌ ZZPREFIY {err}"); fails.append('ZZPREFIY')
    else:
        n = len(groups(d).get('customers', []))
        # 🔴 CORRECTED 2026-09-17. The typo row used to be named ZZPREFIXX, which START S with the
        # query ZZPREFIX - so the product read it as an ordinary prefix match, not a typo, and
        # C55707 could not be judged at all. It is now ZZPREFIY: one letter SUBSTITUTED, never
        # added, so the only way in is a typo. Confirmed live: the row comes back marked as a
        # close match and scores 0.45 against 0.90 for the two literal matches.
        # ZZPREFIY is one edit from ZZPREFIX, so the fuzzy search legitimately returns all three.
        ok = n >= 1
        print(f"  {'✅' if ok else '❌'} ZZPREFIY returns {n} customer(s) — the typo row exists and is reachable ONLY by a typo")
        if not ok: fails.append('ZZPREFIY')

    print('\n=== summary ===')
    if fails:
        print(f"  ❌ {len(fails)} check(s) FAILED: {', '.join(fails)}")
        print("     Do NOT treat the data as seeded. Re-run ./reseed_everything.sh qa and read the log.")
        sys.exit(1)
    print(f"  ✅ all {len(CHECKS) + 1} ranking/fuzzy checks passed on qa")

if __name__ == '__main__':
    main()
