#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Print the LIVE definition of one or more requirement anchors from a report spec.

Reuses the already-fetched spec bodies under source-verify-2026-08-26/specs (Rule 88 -
no re-fetch, no bulk read into the session). Usage:

    python3 anchor.py <report-slug> S3-R8 S6-R10 ...
    python3 anchor.py <report-slug> --grep "right-align"
"""
import json, os, re, sys, html

HERE = os.path.dirname(os.path.abspath(__file__))
SPECS = os.path.join(os.path.dirname(HERE), 'source-verify-2026-08-26', 'specs')
ANCHOR = re.compile(r"\bS\d+-(?:R|E|N|Q)\d+[a-z]?\b")


def flatten(xml):
    t = re.sub(r"<[^>]+>", " ", xml)
    t = html.unescape(t)
    return re.sub(r"\s+", " ", t).strip()


def anchor_texts(flat):
    hits = list(ANCHOR.finditer(flat))
    out = {}
    for i, m in enumerate(hits):
        end = hits[i + 1].start() if i + 1 < len(hits) else len(flat)
        out.setdefault(m.group(0), []).append(flat[m.start():end].strip())
    return out


def definition(d, a):
    for t in d.get(a, []):
        if re.match(re.escape(a) + r"\s*:", t):
            return t
    return None


def load(slug):
    d = json.load(open(os.path.join(SPECS, slug + '.json')))
    flat = flatten(d['body']['storage']['value'])
    return d, flat, anchor_texts(flat)


if __name__ == '__main__':
    slug, args = sys.argv[1], sys.argv[2:]
    d, flat, at = load(slug)
    print('# %s  v%s  %s\n' % (d['title'], d['version']['number'], d['version']['createdAt'][:10]))
    if args and args[0] == '--grep':
        pat = re.compile(args[1], re.I)
        for m in pat.finditer(flat):
            print('...%s...\n' % flat[max(0, m.start() - 320):m.start() + 320])
    else:
        for a in args:
            t = definition(at, a)
            print('### %s\n%s\n' % (a, t if t else '(NO DEFINITION OCCURRENCE - occurrences: %r)' % at.get(a)))
