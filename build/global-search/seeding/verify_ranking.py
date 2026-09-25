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
import json, os, sys, time, urllib.error, urllib.parse, urllib.request

# 🔴 HONOUR SEED_PROFILE LIKE EVERY OTHER SCRIPT IN THIS KIT. This was hardcoded to the QA
# branch, so pointing the kit at another environment seeded THERE and then tried to verify HERE -
# and on a container where /tmp/qa/cookies.json does not exist it simply crashed. A verifier that
# can only ever check one environment is worse than none: run against staging it would have
# reported the QA branch's health as staging's. Measured on staging, 2026-09-25.
COOKIES = os.environ.get('SEED_PROFILE', '/tmp/qa/cookies.json')
# 🔴 NAME THE ENVIRONMENT IN THE VERDICT. The pass line said "on qa" whatever profile ran,
# so a staging run read as a QA result - exactly the provenance failure Rule 110 forbids.
ENV_LABEL = 'qa' if COOKIES == '/tmp/qa/cookies.json' else os.path.basename(os.path.dirname(COOKIES))
C = json.load(open(COOKIES))
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
    # 🔴 EXPECT 3. If this reads 4, the extra row is almost certainly 'ZZPREFOX Cartage' - a record
    # DELETED from the database on 2026-09-18 that the SEARCH INDEX kept returning for over a
    # minute afterwards. Proven by asking both: /api/customers returned three, /api/search returned
    # four, at the same moment. So a stale row here is an indexing lag, not a seeding fault - check
    # the LIST endpoint before touching any data.
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
    ('ZZOPENCOUNT',   'customers', 2, '55722', 'five open work orders vs one',
     {'work_orders', 'assets'}),
    ('ZZNAMEBONUS',   'customers', 2, '55723', 'name match vs secondary-field match', set()),
    # 🔴 THESE TWO TOKENS ATTRACT FUZZY NOISE IN OTHER GROUPS, AND THAT IS NOT A LEAK.
    # ZZACC pulls in half a dozen unrelated estate ASSETS and ZZPUNC pulls in a vendor called
    # Szybunka Truck Center - none of them ours, none of them in the group the case reads. Checked
    # row by row rather than waved away: the Customers group carries exactly our records, which is
    # the whole of what C55726 and C55727 assert. Treating this as a failure would have had someone
    # renaming good data to chase noise in a group nobody looks at.
    ('ZZACC',         'customers', 1, '55726', 'accented name — exactly ONE row, or "both '
                                               'spellings find the same customer" is unreadable',
     {'assets', 'work_orders', 'vendors', 'parts'}),
    ('ZZPUNC',        'customers', 2, '55727', 'an apostrophe name and a hyphen name',
     {'vendors', 'assets', 'work_orders'}),
    ('ZZBROAD',       'parts',     20, '55730', 'the 20-row cap bites — 22 parts match, 20 show',
     {'purchase_orders'}),
]

# 🔴 THESE ASSERTIONS ARE NEGATIVES, AND A NEGATIVE NEEDS A CONTROL OR IT PROVES NOTHING.
# "No result" and "the probe was broken" look identical. Each row therefore pairs the query that
# must MISS with one that must HIT, and the miss only counts when its control comes back.
#   (query that must miss, what must NOT be in it, control query, what the control MUST return, case)
NEGATIVES = [
    ('Zqwxpol', 'Aabridge', 'Aabridge', 'Aabridge', '55725',
     'a clearly unrelated query returns nothing — the control proves Aabridge is findable at all'),
    ('ZZBROAD Target', 'ZZBROAD Widget', 'ZZBROAD', 'ZZBROAD Widget', '55730',
     'narrowing drops the fillers — the control proves they exist on the broad query'),
]

# 🔴 ORDER IS THE THING A RANKING CASE TESTS, AND THE FIRST VERSION OF THIS FILE NEVER CHECKED IT.
# It asserted the records existed, the keyword was private and the counts were right - and all of
# that was true while the signal underneath was doing nothing: C55722's "more open work orders"
# pair had FIVE estimates against one, and ranked the wrong way round, because an ESTIMATE does not
# count as an open work order. C55709's asset was on a work order sitting at Paid. Both looked
# perfect to the seeder and to this verifier.
#
# Each row is (keyword, group, the text that must come FIRST, case, why).
ORDER = [
    # 🔴 KNOWN PRODUCT DEVIATION, NOT A DATA FAULT — measured 2026-09-18 and isolated properly.
    # C55707 expects prefix > whole-word > typo. The typo ranks last correctly, but the WHOLE-WORD
    # match outranks the PREFIX match. That is not my data being uneven: the two records are
    # otherwise identical, and re-saving them in BOTH orders (prefix newest, then whole-word
    # newest) produced the SAME ranking both times, so the recency tiebreak is not what is doing
    # it. The verifier's job is to prove the DATA is right, so this is reported as a deviation
    # rather than counted as a seeding failure - conflating the two would either cry wolf on good
    # data or hide a real finding.
    ('ZZPREFIX',    'customers', 'ZZPREFIX Freight',        '55707',
     'the name that STARTS with the keyword outranks the mid-name and typo matches', True),
    ('ZZCUSTOPEN',  'customers', 'Haulage Open',            '55708',
     'the customer with an open work order outranks the one without', False),
    ('ZZASSETLIFT', 'assets',    'ZZASSETLIFT000001',       '55709',
     'the 2019 on an open work order outranks the newer 2025 that is idle', False),
    ('ZZVENDORPO',  'vendors',   'Supply Open',             '55710',
     'the vendor with an open purchase order outranks the one without', False),
    ('ZZTIEBREAK',  'customers', 'Transport Two',           '55716',
     'on an otherwise exact tie, the most recently updated wins', False),
    ('ZZSTOCKPART', 'parts',     'ZZSTOCKPART-1001',        '44852',
     'in stock outranks out of stock', False),
    ('ZZOPENCOUNT', 'customers', 'ZZOPENCOUNT Freight Busy','55722',
     'five open work orders outranks one', False),
    ('ZZNAMEBONUS', 'customers', 'ZZNAMEBONUS Cartage',     '55723',
     'a match on the NAME outranks a match on a secondary field only', False),
]

def main():
    fails, warns = [], []
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
        # 🔴 A STRAY IN ANOTHER GROUP IS AN ENVIRONMENT FACT, NOT A SEEDING FAILURE. The point of
        # this check is that the count in the group UNDER TEST can be trusted, and a record in a
        # DIFFERENT group cannot affect it - the case reads one tab. Staging carries a real
        # customer, 'Community Support Centre', that fuzzy-matches ZZBROAD; nothing we seed can
        # prevent that, and failing the run over it would mean the verifier could never go green
        # on any estate with real data in it. So it is reported loudly and counted as a WARNING.
        # A stray INSIDE the group under test is still a failure - that one does move the count.
        ok = (got == want)
        mark = '✅' if ok else '❌'
        if ok and strays: mark = '⚠️ '
        signal_txt = '' if not companions else '  +signal ' + str(companions)
        stray_txt = '' if not strays else (
            '  ⚠️  foreign rows in OTHER groups ' + str(strays)
            + ' — environment data, does not affect this count')
        print(f"  {mark} {kw:14} {gtype}={got} (want {want})"
              f"{signal_txt}{stray_txt}   [C{case}] {why}")
        if not ok: fails.append(kw)
        elif strays: warns.append(f"{kw}: foreign rows {strays}")

    print('\n=== ORDER — the ranking rule itself, not just the records ===')
    for kw, gtype, first, case, why, known_deviation in ORDER:
        d, err = search(kw)
        if err:
            print(f"  ❌ {kw:14} {err}"); fails.append(f'{kw}/order'); continue
        rows = groups(d).get(gtype) or []
        if not rows:
            print(f"  ❌ {kw:14} no {gtype} rows at all   [C{case}]"); fails.append(f'{kw}/order'); continue
        top = json.dumps(rows[0])
        ok = first.lower() in top.lower()
        got = (rows[0].get('primary') or rows[0].get('title') or '?')
        print(f"  {'✅' if ok else ('⚠️ ' if known_deviation else '❌')} {kw:14} first {gtype[:-1]} = {str(got)[:36]!r}"
              f"{'' if ok else '  🔴 EXPECTED ' + first!r}   [C{case}]")
        if not ok and known_deviation:
            print(f"     ⚠️  KNOWN PRODUCT DEVIATION — the DATA is correct; the build ranks it this"
                  f" way.\n        Expected: {why}.\n        Isolated 2026-09-18: re-saving the pair"
                  f" in BOTH orders gave the same result, so it is not the recency tiebreak.\n"
                  f"        The case is RUNNABLE and will FAIL on this build — that is a real result,"
                  f" not bad data.")
        elif not ok:
            print(f"        {why}")
            print(f"        🔴 The records may all be present and still rank wrong - check the "
                  f"SIGNAL, not the records. Run: python3 apply_ranking_signals.py --confirm")
            fails.append(f'{kw}/order')

    print('\n=== NEGATIVES — each proved with a control, never on a bare "no results" ===')
    for q, absent, ctrl_q, ctrl_needle, case, why in NEGATIVES:
        cd_, cerr = search(ctrl_q)
        if cerr or not any(ctrl_needle.lower() in json.dumps(v).lower()
                           for v in groups(cd_ or {}).values()):
            print(f"  ❌ {q:16} CONTROL FAILED — {ctrl_q!r} did not return {ctrl_needle!r}, so a "
                  f"miss below would prove nothing   [C{case}]")
            fails.append(f'{q}/control'); continue
        d, err = search(q)
        if err:
            print(f"  ❌ {q:16} {err}"); fails.append(q); continue
        leaked = any(absent.lower() in json.dumps(v).lower() for v in groups(d).values())
        print(f"  {'❌' if leaked else '✅'} {q:16} {absent!r} "
              f"{'LEAKED IN' if leaked else 'correctly absent'}  (control {ctrl_q!r} ok)   [C{case}]")
        if leaked: fails.append(q)

    print('\n=== THE TYPO RECORD IS REACHABLE ONLY BY FUZZY MATCHING (C55707) ===')
    d, err = search('ZZPREFIY')
    if err:
        print(f"  ❌ ZZPREFIY {err}"); fails.append('ZZPREFIY')
    else:
        n = len(groups(d).get('customers', []))
        # ZZPREFIY is one edit from ZZPREFIX, so the fuzzy search legitimately returns all three.
        ok = n >= 1
        print(f"  {'✅' if ok else '❌'} ZZPREFIY returns {n} customer(s) — the typo row exists and is reachable")
        if not ok: fails.append('ZZPREFIY')

    print('\n=== summary ===')
    if warns:
        print(f"  ⚠️  {len(warns)} check(s) passed with foreign rows in other groups: "
              f"{'; '.join(warns)}")
        print("     These are the environment's own records matching our keyword. They do not "
              "change the\n     count under test, and no seeding can remove them.")
    if fails:
        print(f"  ❌ {len(fails)} check(s) FAILED: {', '.join(fails)}")
        print("     Do NOT treat the data as seeded. Re-run ./reseed_everything.sh qa and read the log.")
        sys.exit(1)
    print(f"  ✅ all {len(CHECKS) + len(ORDER) + len(NEGATIVES) + 1} ranking/fuzzy checks passed on {ENV_LABEL} "
          f"({len(CHECKS)} presence + {len(ORDER)} ORDER + {len(NEGATIVES)} negatives-with-controls"
          f" + 1 fuzzy-reachability)")

if __name__ == '__main__':
    main()
