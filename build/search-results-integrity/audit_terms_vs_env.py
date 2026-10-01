#!/usr/bin/env python3
"""Which cases in run 415 name something THIS environment does not hold?

🔴 RULE 111 AS A MEASUREMENT, NOT A GUESS. A case that names an identifier the environment does not
hold is a FALSE FAILED waiting for a tester. Work-order, part-sale and purchase-order numbers are
branch-assigned, staff names are environment data, and the whole suite's terms were discovered on
STAGING - so before anyone runs these against production, every term a tester will literally TYPE
has to be checked against production (Rule 112: check the case body, not a summary of it).

It writes a CSV and changes NOTHING. Correcting a case is a separate, deliberate step.

    SEED_PROFILE=/tmp/prod/creds.json python3 audit_terms_vs_env.py
"""
import csv, json, os, re, sys, time, urllib.parse, urllib.request, urllib.error

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, '/tmp/claude-0')
PROFILE = os.environ.get('SEED_PROFILE', '/tmp/prod/creds.json')
C = json.load(open(PROFILE))
CK = '; '.join(f"{k}={C[k]}" for k in ('sv_sso_session', 'PHPSESSID', 'cf_clearance') if C.get(k))
ENV = os.path.basename(os.path.dirname(PROFILE))

src = open(os.path.join(HERE, 'push_to_testrail.py')).read().split("def main()")[0]
ns = {'__name__': 'notmain', '__file__': os.path.join(HERE, 'push_to_testrail.py')}
exec(compile(src, 'push', 'exec'), ns)
tr = ns['tr']


def search(q):
    u = f"https://{C['api']}/api/search?q=" + urllib.parse.quote(q)
    req = urllib.request.Request(u, headers={
        'Cookie': CK, 'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0', 'Referer': f"https://{C['host']}/"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                d = (json.loads(r.read().decode()).get('data') or {})
                rows = [i for g in (d.get('groups') or []) for i in (g.get('items') or [])]
                if d.get('pinned'):
                    rows.append(d['pinned'])
                return len(rows), None
        except urllib.error.HTTPError as e:
            return None, f'HTTP {e.code}'
        except Exception:
            if attempt < 2:
                time.sleep(2 * (attempt + 1))
    return None, 'transport error'


# The shapes a tester actually types that are BRANCH-ASSIGNED or environment data. A ZZ keyword is
# seeded identically everywhere and needs no check; a number does not survive a reseed (Rule 111).
PATTERNS = [
    ('work order',    re.compile(r'\bS2-\d{3,6}\b')),
    ('part sale',     re.compile(r'\bP2-\d{2,6}\b')),
    ('purchase order', re.compile(r'\bPO-\d{2,6}\b')),
    ('invoice',       re.compile(r'\bINV-\d{2,6}\b')),
]


def main():
    tests, off = [], 0
    while True:
        st, r = tr(f'get_tests/415&limit=250&offset={off}')
        if st != 200:
            sys.exit(f'get_tests -> {st}')
        b = (r.get('tests') if isinstance(r, dict) else r) or []
        tests += b
        if len(b) < 250:
            break
        off += 250
    print(f'run 415 holds {len(tests)} tests on {ENV}')

    seen, rows = {}, []
    for t in tests:
        cid = t['case_id']
        st, case = tr(f'get_case/{cid}')
        if st != 200:
            continue
        body = ' '.join(str(case.get(k) or '') for k in
                        ('title', 'custom_preconds', 'custom_steps', 'custom_expected'))
        for label, rx in PATTERNS:
            for term in set(rx.findall(body)):
                if term not in seen:
                    n, err = search(term)
                    seen[term] = (n, err)
                n, err = seen[term]
                # A near miss is SUPPOSED to return nothing. The case text says so, so only flag a
                # zero when the case is not presenting it as a negative.
                negative = bool(re.search(r'(no such|does not exist|returns nothing|not exist)',
                                          body, re.I))
                verdict = ('ERROR' if err else
                           'MISSING' if (n == 0 and not negative) else
                           'present (negative, expected)' if (n == 0 and negative) else 'present')
                if verdict in ('MISSING', 'ERROR'):
                    rows.append({'case_id': f'C{cid}', 'title': str(case.get('title'))[:70],
                                 'kind': label, 'term': term, 'rows_returned': n,
                                 'verdict': verdict, 'error': err or '',
                                 'link': f'https://shopview.testrail.io/index.php?/cases/view/{cid}'})
                    print(f'  🔴 C{cid} {str(case.get("title"))[:48]:50} {label:14} {term:12} -> {verdict}')

    out = os.path.join(HERE, f'TERMS-NOT-ON-{ENV.upper()}.csv')
    with open(out, 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=['case_id', 'title', 'kind', 'term', 'rows_returned',
                                          'verdict', 'error', 'link'])
        w.writeheader()
        w.writerows(rows)
    print(f'\n{len(rows)} case/term pair(s) name something {ENV} does not hold -> {out}')
    print(f'distinct identifiers checked: {len(seen)}')


if __name__ == '__main__':
    main()
