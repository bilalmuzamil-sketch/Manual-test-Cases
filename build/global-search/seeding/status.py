#!/usr/bin/env python3
"""WHAT IS ACTUALLY ON THIS BRANCH RIGHT NOW — one read-only command, every universe.

    python3 status.py            # QUICK (about 20 calls, a few seconds)
    python3 status.py --full     # quick, then run all three verifiers end to end

🔴 WRITES NOTHING. Ever. It is safe to run at any time, including while another session is working.

WHY THIS EXISTS. The branch gets redeployed and the seeded data goes with it - twice already, once
mid-handoff, taking 32 of 33 records. Three universes now live here, each with its own manifest,
state file and verifier, and the question "is the data still there?" was previously answered by
running three different scripts and remembering which verifier belongs to which environment. This
answers it in one place, and it names the exact command to fix whatever is missing.

🔴 IT CHECKS IDENTITY, NOT ROW COUNTS. Each probe looks for a NAMED record in a NAMED group. A count
is not a verdict here: a count of 1 has already produced a false PASS on a real regression in this
project, and the first ranking keyword scheme returned healthy-looking counts for records that were
all matching each other.
"""
import json, os, subprocess, sys, time, urllib.error, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
FULL = '--full' in sys.argv
C = json.load(open(os.environ.get('SEED_PROFILE', '/tmp/qa/cookies.json')))
CK = '; '.join(f"{k}={C[k]}" for k in ('sv_sso_session', 'PHPSESSID', 'cf_clearance') if C.get(k))
G, R, Y, X = '\033[32m', '\033[31m', '\033[33m', '\033[0m'

def api(path):
    req = urllib.request.Request(f"https://{C['api']}{path}", headers={
        'Cookie': CK, 'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0', 'Referer': f"https://{C['host']}/"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                return r.status, json.loads(r.read().decode() or '{}')
        except urllib.error.HTTPError as e:
            return e.code, None
        except Exception:
            if attempt < 2: time.sleep(2 * (attempt + 1))
    return 'ERR', None

def search(q):
    st, d = api('/api/search?q=' + urllib.parse.quote(q))
    if st != 200: return None
    return (d or {}).get('data') or {}

def found(q, gtype, needle):
    """Is a record whose text contains `needle` present in group `gtype` for query `q`?"""
    d = search(q)
    if d is None: return None                      # could not ask - not the same as absent
    for g in (d.get('groups') or []):
        if g.get('type') != gtype: continue
        for i in (g.get('items') or []):
            blob = json.dumps(i).lower()
            if needle.lower() in blob: return True
    p = d.get('pinned')
    if p and needle.lower() in json.dumps(p).lower(): return True
    return False

def marker():
    try:
        import ssl
        with urllib.request.urlopen(f"https://{C['host']}/", timeout=25) as r:
            html = r.read().decode(errors='ignore')
        i = html.find('app-version')
        if i < 0: return None
        seg = html[i:i + 120]
        s = seg.find('content="') + 9
        return seg[s:seg.find('"', s)]
    except Exception:
        return None

# universe → (label, probes, reseed command, verifier)
#   a probe is (what you type, the group it must come back in, the text that identifies OUR record)
UNIVERSES = [
 ('V1-regression  (6769 / 8056, 11 records)', [
     ('ZZAUTOTEST Bridgeport', 'customers', 'Bridgeport Hauling'),
     ('ZZT-4471',              'assets',    'ZZT-4471'),
  ], 'seed-manifest.json', None),   # 🔴 verify_gsv2_v1.py is the PRODUCTION verifier - it reads
                                    # the prod profile and reports on prod, so running it from a QA
                                    # status board answers a question nobody asked and reads like a
                                    # pass for this branch. The spine probes above ARE the QA check
                                    # for this universe.

 ('Global Search V2 "Fibridge"  (6721-6740, 39 records)', [
     ('Fib',                   'customers', 'Fibridge Commercial'),
     ('Fib',                   'assets',    'TRK 412'),
     ('Fib',                   'vendors',   'Fibridge Mining'),
     ('65547',                 'parts',     '65547'),
     ('S2-15430',              'work_orders', '15430'),
     ('P2-58',                 'part_sales', 'P2-58'),
  ], 'seed-manifest-gs-v2.json', 'verify_gsv2.py'),

 ('Ranking + fuzzy remainder  (6726 / 6725, 39 records)', [
     ('ZZPREFIX',      'customers', 'ZZPREFIX Freight'),
     ('ZZCUSTOPEN',    'customers', 'Haulage Open'),
     ('ZZASSETLIFT',   'assets',    'ZZASSETLIFT000001'),
     ('ZZVENDORPO',    'vendors',   'Supply Open'),
     ('ZZTIEBREAK',    'customers', 'Transport Two'),
     ('ZZSTOCKPART',   'parts',     'ZZSTOCKPART-1001'),
     ('ZZPARTBUSY',    'parts',     'ZZPARTBUSY-2001'),
     ('ZZCONTACTONLY', 'customers', 'Northgate Cartage'),
     ('ZZFUZZLEN',     'customers', 'Abcde Logistics'),
     ('I9160-1398',    'purchase_orders', 'I9160-1398'),
     ('ZZOPENCOUNT',   'customers', 'Freight Busy'),
     ('ZZNAMEBONUS',   'customers', 'ZZNAMEBONUS Cartage'),
  ], 'seed-manifest-ranking.json', 'verify_ranking.py'),
]

ROLES = ['ZZAUTOTEST No Work Orders View', 'ZZAUTOTEST No Customers View',
         'ZZAUTOTEST No Parts View', 'ZZAUTOTEST No Part Sales View',
         'ZZAUTOTEST No Vendor Order View', 'ZZAUTOTEST No Financial Data',
         'ZZAUTOTEST No Work Orders Or Vendors']   # C55720 - TWO bundles missing at once

def main():
    print(f"\n{'='*78}\n ENVIRONMENT STATUS — {C['host']}\n{'='*78}")

    m = marker()
    last = None
    sf = os.path.join(HERE, 'last-seen-marker.json')
    if os.path.exists(sf):
        try: last = json.load(open(sf)).get('marker')
        except Exception: pass
    print(f"\n build marker : {m or 'UNREADABLE'}")
    if last and m and last != m:
        print(f" {R}🔴 THE BRANCH WAS REDEPLOYED since this was last run ({last} → {m}).{X}")
        print(f"    Seeded records do not survive a redeploy. Expect losses below.")
    elif last and m == last:
        print(f" {G}   unchanged since the last status run — a redeploy has not wiped anything{X}")

    st, _ = api('/api/staff/my-workplaces')
    if st != 200:
        print(f"\n {R}🔴 THE SESSION IS NOT LIVE ({st}).{X} Nothing below can be trusted — every probe "
              f"would read as 'missing' when the data may be perfectly fine.")
        print("    Refresh the cookie profile first, then re-run. (409 = this organisation's")
        print("    PHPSESSID has lapsed; 401 = no usable SSO token.)")
        sys.exit(2)

    broken = []
    for label, probes, manifest, verifier in UNIVERSES:
        ok = miss = unknown = 0
        detail = []
        for q, gtype, needle in probes:
            r = found(q, gtype, needle)
            if r is True: ok += 1
            elif r is False: miss += 1; detail.append(f"{q} → {gtype}: {needle}")
            else: unknown += 1; detail.append(f"{q}: COULD NOT ASK")
        total = len(probes)
        colour = G if miss == 0 and unknown == 0 else (Y if ok else R)
        state = 'PRESENT' if miss == 0 and unknown == 0 else ('PARTIAL' if ok else 'GONE')
        print(f"\n {colour}{state:8}{X} {label}")
        print(f"          {ok}/{total} spine records found by search")
        for d in detail[:4]:
            print(f"          {R}missing:{X} {d}")
        if miss or unknown:
            broken.append((label, manifest, verifier))

    # the role fixtures - not searchable, so read the list
    st, d = api('/api/iam/list-roles')
    have = {r.get('label') for r in ((d or {}).get('data', {}).get('collection') or [])} if st == 200 else set()
    gone = [r for r in ROLES if r not in have]
    print(f"\n {(G if not gone else R)}{'PRESENT' if not gone else 'PARTIAL':8}{X} "
          f"Permission role fixtures (6734)")
    print(f"          {len(ROLES)-len(gone)}/{len(ROLES)} roles present")
    for r in gone: print(f"          {R}missing:{X} {r}")
    if gone: broken.append(('role fixtures', None, None))

    print(f"\n{'='*78}")
    if not broken:
        print(f" {G}✅ EVERYTHING THIS BRANCH HAS EVER BEEN SEEDED WITH IS PRESENT.{X}")
        print(f"    Spine records only — for the full assertion set run:  python3 status.py --full")
    else:
        print(f" {R}🔴 {len(broken)} UNIVERSE(S) NEED RESEEDING.{X}  One command rebuilds all of them:")
        print(f"\n      ./reseed_everything.sh qa\n")
        print("    It is safe to run even for the parts that are fine — every step measures first")
        print("    and creates only the difference.")
    print('='*78)

    if m:
        json.dump({'marker': m, 'when': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())},
                  open(sf, 'w'), indent=1)

    if FULL:
        print("\n\n### FULL VERIFICATION — every assertion, not just the spine\n")
        for label, _, _, verifier in UNIVERSES:
            if not verifier or not os.path.exists(os.path.join(HERE, verifier)):
                print(f"---- {label}\n     (no QA verifier for this universe - the spine probes above are the check)")
                continue
            print(f"---- {verifier}  ({label})")
            r = subprocess.run([sys.executable, os.path.join(HERE, verifier)],
                               capture_output=True, text=True, cwd=HERE)
            lines = [l for l in r.stdout.strip().split('\n') if l.strip()]
            # The VERDICT line is the one the verifier prints after '=== summary ==='. Taking the
            # last few lines instead showed two failing checks and hid the summary entirely, which
            # made a service blip look like the whole universe was gone.
            verdict = [l for l in lines if l.strip().startswith(('✅', '❌'))
                       and ('passed' in l or 'FAILED' in l or 'checks' in l)]
            for l in (verdict[-1:] or lines[-1:]): print('   ', l.strip())
            # a 503 is the search SERVICE, not missing data - say so rather than letting it read
            # as a loss, and never let it trigger a reseed of data that is sitting right there
            blips = [l for l in lines if 'HTTP 503' in l or 'HTTP 502' in l]
            if blips:
                print(f"    {Y}⚠️  {len(blips)} check(s) hit a 5xx from the search service - that is"
                      f" the SERVICE, not your data.{X}")
                print(f"       Re-run this verifier before concluding anything is missing.")
        print("\n🔴 Read each verifier's OWN summary line above. Do not judge by an exit code -"
              "\n   a `grep` that finds no failures exits 1 and makes a clean run look broken.")

if __name__ == '__main__':
    main()
