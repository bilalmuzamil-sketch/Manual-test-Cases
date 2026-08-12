#!/usr/bin/env python3
"""Derive the exact audit population: cases CREATED today or MATERIALLY changed today.

Baseline = the repo case source at the last commit before 2026-08-11
(43930ee3, 2026-08-10 23:53Z). Head = LIVE TestRail, read this session.

A case counts as MATERIALLY changed only if its tester-facing MEANING moved.
Standing Rule 54's provenance line and Rule 42's version pins in `refs` change
no meaning, so an edit confined to them is EXCLUDED and counted separately.
The `expected` field is therefore split into three parts and compared part by
part:

  body        everything before the '---' separator = the assertion itself
  provenance  the Rule-54 line(s) after '---'       = source + last-checked
  marker      the trailing 'AUTOMATION: ...' line   = Rule 61 automation state

Only a move in body / title / preconditions / steps is material.
"""
import glob
import json
import re
import sys
from collections import Counter, OrderedDict

LIVE = '/tmp/qg/live-3proj.json'
BASE = '/tmp/qg/base'
IDKEYS = ('testrail_id', 'testrail_case_id', 'case_id')
PROJECTS = OrderedDict([('Filters', 'filters'), ('Schedule', 'schedule'),
                        ('ReportSuite', 'report-suite')])
MARKER_RE = re.compile(r'^\s*AUTOMATION:\s*(.+?)\s*$', re.M)


def cid_of(c):
    for k in IDKEYS:
        v = c.get(k)
        if v:
            return str(v).strip().lstrip('C')
    return None


def norm(s):
    if s is None:
        return ''
    if isinstance(s, list):
        return '\n'.join(str(x) for x in s)
    return str(s)


def split_expected(raw):
    """-> (body, provenance, marker). Robust to a missing separator/marker."""
    t = norm(raw).replace('\r\n', '\n')
    marks = MARKER_RE.findall(t)
    marker = marks[-1].strip() if marks else ''
    t_nomark = MARKER_RE.sub('', t)
    parts = t_nomark.split('\n---')
    body = parts[0]
    prov = '\n---'.join(parts[1:]) if len(parts) > 1 else ''
    if not prov:
        # some cases separate with a bare '---' line at start of a line
        m = re.split(r'^---\s*$', t_nomark, maxsplit=1, flags=re.M)
        if len(m) == 2:
            body, prov = m[0], m[1]
    return body.strip(), prov.strip(), marker


def load(d, key):
    out = {}
    for f in sorted(glob.glob(d + '/*.json')):
        try:
            data = json.load(open(f))
        except Exception:
            continue
        if not isinstance(data, list):
            continue
        for c in data:
            k = cid_of(c) if key == 'cid' else c.get('id')
            if k:
                out[str(k)] = c
    return out


def main():
    live = json.load(open(LIVE))
    out = OrderedDict()
    for proj, d in PROJECTS.items():
        cur_int = load('build/%s/cases' % d, 'int')
        int2cid = {i: cid_of(c) for i, c in cur_int.items() if cid_of(c)}
        base = {}
        for k, c in load('%s/%s' % (BASE, d), 'cid').items():
            base[k] = c
        for i, c in load('%s/%s' % (BASE, d), 'int').items():
            cid = int2cid.get(i)
            if cid and cid not in base:
                base[cid] = c
        lv = {str(c['id']): c for c in live[proj] if c['created_by'] == 3}

        created, material, prov_only, marker_only, unchanged = [], OrderedDict(), [], [], []
        for k, c in sorted(lv.items(), key=lambda x: int(x[0])):
            if k not in base:
                created.append(k)
                continue
            b = base[k]
            moved = []
            for fld, vk in (('title', 'title'), ('preconditions', 'custom_preconds'),
                            ('steps', 'custom_steps')):
                if norm(b.get(fld)) != norm(c.get(vk)):
                    moved.append(fld)
            bb, bp, bm = split_expected(b.get('expected'))
            lb, lp, lm = split_expected(c.get('custom_expected'))
            if bb != lb:
                moved.append('expected-body')
            prov_moved = bp != lp
            mark_moved = bm != lm
            refs_moved = norm(b.get('refs')) != norm(c.get('refs'))
            if moved:
                material[k] = moved
            elif mark_moved:
                marker_only.append({'cid': k, 'from': bm, 'to': lm})
            elif prov_moved or refs_moved:
                prov_only.append(k)
            else:
                unchanged.append(k)
        out[proj] = {'live_ours': len(lv), 'created': created, 'material': material,
                     'marker_only': marker_only, 'provenance_or_refs_only': prov_only,
                     'unchanged': unchanged}
        fc = Counter(f for v in material.values() for f in v)
        print('%-12s live=%d | CREATED %d | MATERIAL %d | marker-only %d | '
              'provenance/refs-only %d | untouched %d'
              % (proj, len(lv), len(created), len(material), len(marker_only),
                 len(prov_only), len(unchanged)))
        print('             created : %s' % ', '.join('C' + x for x in created))
        print('             material fields: %s' % dict(fc))
    tgt = sys.argv[1] if len(sys.argv) > 1 else \
        'build/quality-gate-2026-08-11/evidence/population.json'
    json.dump(out, open(tgt, 'w'), indent=1)
    tot_c = sum(len(v['created']) for v in out.values())
    tot_m = sum(len(v['material']) for v in out.values())
    tot_k = sum(len(v['marker_only']) for v in out.values())
    tot_p = sum(len(v['provenance_or_refs_only']) for v in out.values())
    tot_u = sum(len(v['unchanged']) for v in out.values())
    print('\nTOTAL  created %d + material %d = IN SCOPE %d' % (tot_c, tot_m, tot_c + tot_m))
    print('       excluded: marker-only %d, provenance/refs-only %d, untouched %d'
          % (tot_k, tot_p, tot_u))
    print('       grand total %d' % (tot_c + tot_m + tot_k + tot_p + tot_u))
    print('written:', tgt)


if __name__ == '__main__':
    main()
