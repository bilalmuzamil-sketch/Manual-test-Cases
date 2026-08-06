"""Execute the 168 update_case ops with Rule-50 byte verification.

Every op sends ALL THREE text fields. After every op the case is re-GET and
compared field by field against the intended payload, and every field the op did
NOT intend to change is proven byte-identical to the pre-write snapshot BY CONTENT.
On any mismatch the batch STOPS.
"""
import json, sys, re, time
sys.path.insert(0, '/tmp/testrail')
import tr

PLAN = json.load(open('/tmp/schedule-viu/write/plan.json'))
PRE = {c['id']: c for c in json.load(open('build/schedule/full-viu-2026-08-05/snapshots/PRE-WRITE-168-2026-08-06.json'))}
LOG = '/tmp/schedule-viu/write/exec-log.json'
MARKUP = re.compile(r'<(?:ol|li|ul|p|br|hr|div|strong|em|span|table|tr|td)\b', re.I)

WRITE_FIELDS = ('custom_expected', 'custom_preconds', 'custom_steps')
# fields that legitimately move on any write
VOLATILE = {'updated_on', 'updated_by'}

def norm_refs(s):
    if s is None: return None
    return ','.join(p.strip() for p in s.split(','))

def verify(cid, intended, pre, post):
    problems = []
    for k, v in intended.items():
        if post.get(k) != v:
            problems.append(f"{k}: intended {v!r} but stored {post.get(k)!r}")
    for k in set(pre) | set(post):
        if k in intended or k in VOLATILE: continue
        a, b = pre.get(k), post.get(k)
        if k == 'refs':
            a, b = norm_refs(a), norm_refs(b)
        if a != b:
            problems.append(f"COLLATERAL {k}: was {a!r} now {b!r}")
    return problems

def main():
    ids = sorted(int(k) for k in PLAN)
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    end = int(sys.argv[2]) if len(sys.argv) > 2 else len(ids)
    try:
        log = json.load(open(LOG))
    except Exception:
        log = {}
    for n, cid in enumerate(ids[start:end], start=start):
        p = PLAN[str(cid)]
        if MARKUP.search(p['custom_expected']) or MARKUP.search(p['custom_steps']) or MARKUP.search(p['custom_preconds']):
            print(f"REFUSED C{cid}: raw markup"); sys.exit(3)
        intended = {k: p[k] for k in WRITE_FIELDS}
        pre = PRE[cid]
        st, body = tr.api(f'update_case/{cid}', 'POST', intended)
        if st != 200:
            print(f"FAIL C{cid} HTTP {st} {str(body)[:200]}"); sys.exit(4)
        st2, post = tr.api(f'get_case/{cid}')
        if st2 != 200:
            print(f"FAIL re-GET C{cid} HTTP {st2}"); sys.exit(4)
        probs = verify(cid, intended, pre, post)
        nfields = len(set(pre) | set(post))
        log[str(cid)] = {'op': 'update_case', 'http': st, 'fields_compared': nfields,
                         'verified': 'MATCH' if not probs else 'MISMATCH', 'problems': probs,
                         'marker': p['marker'], 'build': p['build'], 'date': p['date']}
        json.dump(log, open(LOG, 'w'), indent=1)
        flag = 'MATCH' if not probs else 'MISMATCH'
        print(f"{n+1:>3}/168 C{cid} HTTP {st} {nfields} fields {flag}")
        if probs:
            for x in probs: print('     ', x)
            print('STOPPING - Rule 50: a mismatch means the write FAILED')
            sys.exit(5)
    print('batch complete')

if __name__ == '__main__':
    main()
