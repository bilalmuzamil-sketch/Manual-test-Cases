#!/usr/bin/env python3
"""Compact view of each existing ticket for authoring: the parts that carry meaning,
with the developer-appendix bulk trimmed to its first lines so nothing is invisible
but nothing is re-read at full length either."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, '..', 'snapshots', 'pre-edit')

DROP = re.compile(r'(technical details|evidence files|full probe data|what is NOT established|'
                  r'what is established|how bad is it|how often|images)', re.I)


def sections(txt):
    """split a flattened description into (heading, body) pairs; '' heading = preamble"""
    out, cur, buf = [], '', []
    for line in txt.split('\n'):
        m = re.match(r'^(#{2,4})\s*(.*)$', line)
        if m:
            out.append((cur, '\n'.join(buf).strip()))
            cur, buf = m.group(2).strip(), []
        else:
            buf.append(line)
    out.append((cur, '\n'.join(buf).strip()))
    return [(h, b) for h, b in out if h or b]


def compact(key, limit=900):
    txt = open(os.path.join(SNAP, key + '.txt')).read()
    first, rest = txt.split('\n', 1)
    parts = [first]
    for h, b in sections(rest):
        if DROP.search(h or ''):
            b = b[:200] + (' …[TRIMMED]' if len(b) > 200 else '')
        elif len(b) > limit:
            b = b[:limit] + ' …[TRIMMED]'
        parts.append((('## ' + h) if h else '(preamble)') + '\n' + b)
    return '\n'.join(parts)


if __name__ == '__main__':
    keys = sys.argv[1:]
    if not keys:
        ws = json.load(open(os.path.join(HERE, '..', 'snapshots', 'working-set.json')))['working_set']
        keys = [k for k, v in ws.items() if v['open']]
    for k in keys:
        print('\n' + '=' * 100)
        print(compact(k))
