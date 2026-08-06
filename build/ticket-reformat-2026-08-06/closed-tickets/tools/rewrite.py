#!/usr/bin/env python3
"""Rewrite the 8 CLOSED tickets' descriptions, and nothing else.

PRESERVING IMAGES IS THE HARD REQUIREMENT. Before each write every mediaSingle /
mediaGroup node in the CURRENT description is lifted out VERBATIM and carried into the new
body. If the new body would not carry all of them, the ticket is REFUSED, not written.
After each write the attachment set is re-read and compared BY ID.

Rule 50 verification per write:
  * the stored description is byte-compared against the intended payload
  * EVERY other field is byte-compared against the pre-write snapshot; only `updated`
    (the server's own write stamp) may move. `lastViewed` is a per-user browser marker,
    proven by the sibling pass never to move on a REST call -- if it moves it is REPORTED,
    not absorbed.
  * on ANY mismatch the batch STOPS and both byte sequences are printed.

Usage: python3 tools/rewrite.py --dry-run [KEY ...]
       python3 tools/rewrite.py --write   [KEY ...]
"""
import copy, json, os, sys, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.abspath(os.path.join(HERE, '..'))
ROOT = os.path.abspath(os.path.join(BASE, '..'))
sys.path.insert(0, os.path.join(ROOT, 'attachment-audit', 'tools'))
sys.path.insert(0, os.path.join(ROOT, 'report-suite', 'tools'))
sys.path.insert(0, HERE)
import jira as J
import adf
import content

PRE = os.path.join(BASE, 'snapshots', 'pre-write')
POST = os.path.join(BASE, 'snapshots', 'post-write')
LOG = os.path.join(BASE, 'execution-log.jsonl')
ALLOWED_MOVERS = {'description', 'updated'}
ORDER = sorted(content.TICKETS, key=lambda k: int(k.split('-')[1]))


# ------------------------------------------------------------------ media handling
def media_blocks(doc):
    """Every top-level-reachable mediaSingle / mediaGroup node, verbatim, in order."""
    out = []

    def walk(n):
        if isinstance(n, dict):
            if n.get('type') in ('mediaSingle', 'mediaGroup'):
                out.append(copy.deepcopy(n))
                return
            for v in n.values():
                walk(v)
        elif isinstance(n, list):
            for v in n:
                walk(v)

    walk(doc or {})
    return out


def media_ids(doc):
    ids = set()

    def walk(n):
        if isinstance(n, dict):
            if n.get('type') == 'media' and n.get('attrs', {}).get('id'):
                ids.add(n['attrs']['id'])
            for v in n.values():
                walk(v)
        elif isinstance(n, list):
            for v in n:
                walk(v)

    walk(doc or {})
    return ids


# ------------------------------------------------------------------ body build
def paras(items):
    return [adf.p(t) for t in items]


def source_paras(entries):
    out, first = [], True
    for e in entries:
        bits = []
        if e[0] == 'spec':
            (name, ver, url), label, quote = e[1], e[2], e[3]
            if first:
                bits += [('strong', 'Source'), ' — the ',
                         ('link', name, url), f' on Confluence, version {ver}, {label}: '
                         f'“{quote}”']
            else:
                bits += ['The ', ('link', name, url),
                         f' on Confluence, version {ver}, {label}: “{quote}”']
        elif e[0] == 'same':
            bits += [f'The same description, {e[1]}: “{e[2]}”']
        elif e[0] == 'note':
            bits += [e[1]]
        out.append(adf.p(*bits))
        first = False
    return out


def build(key, rec, existing_media):
    if rec.get('shape') == 'probe':
        nodes = paras(rec['body'])
        nodes.append({'type': 'rule'})
        nodes += source_paras(rec['source'])
        return adf.doc(nodes)

    nodes = [adf.h(3, 'Description')] + paras(rec['description'])
    nodes.append(adf.h(3, 'Steps to reproduce'))
    nodes.append(adf.p(rec['env']))
    nodes.append(adf.ol(rec['steps']))
    nodes.append(adf.h(3, 'Current behaviour'))
    nodes += paras(rec['current'])
    # every existing media node, verbatim, at the point in Current behaviour where the
    # text has just referred to the pictures
    nodes += existing_media
    nodes.append(adf.h(3, 'Expected behaviour'))
    nodes += paras(rec['expected'])
    nodes.append({'type': 'rule'})
    nodes += source_paras(rec['source'])
    return adf.doc(nodes)


# ------------------------------------------------------------------ verification
def flat(o, p='', out=None):
    if out is None:
        out = {}
    if isinstance(o, dict):
        for k, v in o.items():
            flat(v, f'{p}.{k}' if p else k, out)
    elif isinstance(o, list):
        out[p] = json.dumps(o, sort_keys=True)
    else:
        out[p] = o
    return out


def compare(pre, post, intended):
    pf, qf = flat(pre['fields']), flat(post['fields'])
    moved = sorted({k for k in set(pf) | set(qf) if pf.get(k) != qf.get(k)})
    top = sorted({k.split('.')[0] for k in moved})
    desc_ok = (json.dumps(post['fields']['description'], sort_keys=True) ==
               json.dumps(intended, sort_keys=True))
    att_pre = [a['id'] for a in (pre['fields'].get('attachment') or [])]
    att_post = [a['id'] for a in (post['fields'].get('attachment') or [])]
    return {'fields_compared': len(set(pf) | set(qf)), 'fields_moved': top,
            'moved_paths': moved,
            'no_collateral': set(top) <= ALLOWED_MOVERS,
            'description_byte_identical': desc_ok,
            'attachments_pre': att_pre, 'attachments_post': att_post,
            'attachments_intact': sorted(att_pre) == sorted(att_post)}


def main():
    write = '--write' in sys.argv
    keys = [a for a in sys.argv[1:] if a.startswith('SV-')] or ORDER
    for key in keys:
        rec = content.TICKETS[key]
        code, pre = J.issue(key, out=os.path.join(PRE, f'{key}.json'))
        if code != '200':
            print(f'{key}: pre-read HTTP {code} — STOP')
            return 1
        cur = pre['fields'].get('description')
        existing = media_blocks(cur)
        want = media_ids(cur)
        body = build(key, rec, existing)
        got = media_ids(body)
        if not want <= got:
            print(f'{key}: REFUSED — new body would drop media {sorted(want - got)}')
            return 1
        print(f'{key}: media carried forward {sorted(got)} (was {sorted(want)}) '
              f'| status {pre["fields"]["status"]["name"]} '
              f'| bytes {len(json.dumps(cur))} -> {len(json.dumps(body))}')
        json.dump(body, open(os.path.join(BASE, 'authored', f'{key}.json'), 'w'), indent=1)
        if not write:
            print(adf.flatten(body))
            print('-' * 100)
            continue
        pc, presp = J.put(f'/rest/api/3/issue/{key}', {'fields': {'description': body}})
        if pc != '204':
            print(f'{key}: PUT HTTP {pc} {presp} — STOP')
            return 1
        oc, post = J.issue(key, out=os.path.join(POST, f'{key}.json'))
        if oc != '200':
            print(f'{key}: post-read HTTP {oc} — STOP')
            return 1
        v = compare(pre, post, body)
        row = {'ticket': key, 'op': 'update_description', 'http': pc,
               'at_utc': datetime.datetime.utcnow().isoformat() + 'Z', **v}
        row['verdict'] = ('PASS' if v['no_collateral'] and v['description_byte_identical']
                          and v['attachments_intact'] else 'FAIL')
        open(LOG, 'a').write(json.dumps(row) + '\n')
        print(f"  -> {row['verdict']} fields {v['fields_compared']} moved {v['fields_moved']} "
              f"desc-identical {v['description_byte_identical']} "
              f"attachments {len(v['attachments_pre'])}->{len(v['attachments_post'])} intact "
              f"{v['attachments_intact']}")
        if row['verdict'] == 'FAIL':
            print('  INTENDED:', json.dumps(body, sort_keys=True)[:1500])
            print('  STORED  :', json.dumps(post['fields']['description'], sort_keys=True)[:1500])
            print('  MOVED   :', v['moved_paths'])
            print('BATCH STOPPED')
            return 1
    return 0


if __name__ == '__main__':
    os.makedirs(PRE, exist_ok=True)
    os.makedirs(POST, exist_ok=True)
    os.makedirs(os.path.join(BASE, 'authored'), exist_ok=True)
    sys.exit(main())
