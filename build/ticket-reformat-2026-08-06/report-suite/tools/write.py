#!/usr/bin/env python3
"""Write the reformatted description, then verify EXHAUSTIVELY and EXACTLY (Rule 50).

Per ticket:
  1  GET every field  -> pre-edit snapshot
  2  PUT description only
  3  GET again        -> the description must equal what we sent, and EVERY other
                         field must be byte-identical to the pre-edit snapshot
On any mismatch the batch STOPS and both byte sequences are reported.

Usage: write.py SV-8818 SV-8820 ...        (append --dry to render and verify only)
"""
import json, os, sys, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import jiralib as J
import render

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, '..', 'snapshots')
AUTH = os.path.join(HERE, '..', 'authored')
LOG = os.path.join(HERE, '..', 'execution-log.jsonl')

# `updated` moves because we edited the issue -- that is the edit, not collateral.
# `description` is the field we are writing. Everything else must not move.
ALLOWED_TO_MOVE = {'description', 'updated', 'lastViewed'}


def get_all(key):
    code, d = J.get(f'/rest/api/3/issue/{key}?expand=names', out=f'/tmp/_rfw_{key}.json')
    if code != '200':
        raise SystemExit(f'{key}: GET returned HTTP {code}')
    return d


def canon(v):
    return json.dumps(v, sort_keys=True, ensure_ascii=False, separators=(',', ':'))


def diff_fields(pre, post):
    """every field, both directions, byte-compared"""
    a, b = pre['fields'], post['fields']
    moved, keys = [], sorted(set(a) | set(b))
    for k in keys:
        if canon(a.get(k)) != canon(b.get(k)):
            moved.append(k)
    return moved, len(keys)


def logline(rec):
    with open(LOG, 'a') as f:
        f.write(json.dumps(rec, ensure_ascii=False) + '\n')


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    dry = '--dry' in sys.argv
    for key in args:
        rec = json.load(open(os.path.join(AUTH, key + '.json')))
        body = render.build(rec)

        pre = get_all(key)
        os.makedirs(os.path.join(SNAP, 'pre-write'), exist_ok=True)
        json.dump(pre, open(os.path.join(SNAP, 'pre-write', key + '.json'), 'w'), indent=1)

        if dry:
            print(f'{key}: DRY -- would write {len(canon(body))} bytes of ADF')
            continue

        code, resp = J.put(f'/rest/api/3/issue/{key}', {'fields': {'description': body}},
                           out=f'/tmp/_rfput_{key}.json')
        post = get_all(key)
        os.makedirs(os.path.join(SNAP, 'post-write'), exist_ok=True)
        json.dump(post, open(os.path.join(SNAP, 'post-write', key + '.json'), 'w'), indent=1)

        moved, nfields = diff_fields(pre, post)
        collateral = [m for m in moved if m not in ALLOWED_TO_MOVE]
        sent, got = canon(body), canon(post['fields']['description'])
        desc_ok = sent == got

        entry = {'op': 'update_description', 'ticket': key, 'http': code,
                 'fields_compared': nfields, 'fields_moved': moved,
                 'collateral_changes': collateral,
                 'description_byte_identical_to_payload': desc_ok,
                 'verification': 'PASS' if (code in ('200', '204') and desc_ok and not collateral) else 'FAIL',
                 'at': datetime.datetime.utcnow().isoformat() + 'Z'}
        logline(entry)
        print(f"{key}: HTTP {code} · {nfields} fields compared · moved {moved} · "
              f"description byte-identical: {desc_ok} · {entry['verification']}")

        if entry['verification'] != 'PASS':
            print('\n--- STOPPING THE BATCH (Rule 50) ---')
            if not desc_ok:
                for i, (x, y) in enumerate(zip(sent, got)):
                    if x != y:
                        print(f'first difference at byte {i}')
                        print('SENT:', sent[max(0, i - 120):i + 120])
                        print('GOT :', got[max(0, i - 120):i + 120])
                        break
                else:
                    print(f'lengths differ: sent {len(sent)} got {len(got)}')
                    print('SENT tail:', sent[-300:])
                    print('GOT  tail:', got[-300:])
            for c in collateral:
                print(f'COLLATERAL {c}:\n  pre : {canon(pre["fields"].get(c))[:400]}\n'
                      f'  post: {canon(post["fields"].get(c))[:400]}')
            sys.exit(2)


if __name__ == '__main__':
    main()
