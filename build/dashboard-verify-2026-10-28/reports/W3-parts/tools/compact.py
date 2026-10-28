"""Write full check rows to /tmp/cln/w3/full/<name> (never into the repo) and a compact summary + failed rows to ../<name>."""
import json, os, collections
FULL = '/tmp/cln/w3/full'
def write(name, rows, extra=None, cap=150):
    os.makedirs(FULL, exist_ok=True)
    json.dump({'rows': rows, **(extra or {})}, open(f'{FULL}/{name}', 'w'))
    summ = collections.defaultdict(lambda: [0, 0]); c = collections.Counter(); failed = []
    for x in rows:
        summ[x['check']][0 if x['ok'] else 1] += 1
        if not x['ok']:
            c[x['check']] += 1
            if c[x['check']] <= cap: failed.append(x)
    out = {'summary': {k: {'pass': v[0], 'fail': v[1]} for k, v in summ.items()}, 'failed_rows': failed,
           'note': f'failed_rows capped at {cap} per check; full rows in {FULL}/{name} (not committed).', **(extra or {})}
    json.dump(out, open(os.path.join(os.path.dirname(__file__), '..', name), 'w'), indent=0)
