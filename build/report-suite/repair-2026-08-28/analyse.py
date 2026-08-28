#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""JOB 1 phase A - ANALYSIS ONLY.  For each of the 19 damaged cases, page the full
edit history, walk the custom_expected change chain in order, and locate the edit that
destroyed the formatting.  Writes a per-case dossier to /tmp/rspin/repair/.  NO WRITES."""
import json, os, sys, re, datetime, html

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'writes-2026-08-26'))
from tr import call                                              # noqa: E402

ESCAPED = ['C26427', 'C26489']
FLAT = ['C29946', 'C29948', 'C29950', 'C29951', 'C29952', 'C29953', 'C29954', 'C29955',
        'C29963', 'C30008', 'C30016', 'C30034', 'C30052', 'C30057', 'C30066', 'C30071', 'C38872']
ALL = ESCAPED + FLAT
OUT = '/tmp/rspin/repair'
SEP = re.compile(r'<br\s*/?>|</p>|<p\b|</li>|<li\b|<ul\b|<ol\b|<div\b|<h[1-6]\b|\n')


def history(num):
    hs, off = [], 0
    while True:
        s, d = call('get_history_for_case/%s&limit=250&offset=%d' % (num, off))
        if s != 200:
            raise SystemExit('history HTTP %s on %s' % (s, num))
        page = d['history'] if isinstance(d, dict) else d
        hs += page
        if not isinstance(d, dict) or len(page) < d.get('limit', 250):
            break
        off += len(page)
    return hs


def plain(v):
    """Visible text a tester reads: separators -> newline, tags stripped, entities decoded."""
    v = SEP.sub('\n', v or '')
    v = re.sub(r'<[^>]+>', '', v)
    v = html.unescape(html.unescape(v))
    return re.sub(r'[ \t]+', ' ', v).strip()


def squash(v):
    """Content ignoring ALL whitespace/line structure - for proving wording is unchanged."""
    return re.sub(r'\s+', '', plain(v))


def nlines(v):
    return len([l for l in plain(v).split('\n') if l.strip()])


def main():
    os.makedirs(OUT, exist_ok=True)
    summary = []
    for cid in ALL:
        num = cid[1:]
        s, case = call('get_case/' + num)
        assert s == 200, (cid, s)
        cur = case.get('custom_expected') or ''
        hs = sorted(history(num), key=lambda h: (h.get('created_on') or 0, h.get('id') or 0))
        chain = []
        for h in hs:
            for c in h.get('changes', []):
                if c.get('field') == 'custom_expected':
                    chain.append({'id': h.get('id'), 'on': h.get('created_on'),
                                  'date': datetime.datetime.utcfromtimestamp(h['created_on']).strftime('%Y-%m-%d %H:%M'),
                                  'user': h.get('user_id'),
                                  'old': c.get('old_value') or '', 'new': c.get('new_value') or ''})
        # locate the damaging edit
        dmg = None
        for i, c in enumerate(chain):
            if cid in ESCAPED:
                bad = ('&lt;p&gt;' in c['new'] or '&lt;br&gt;' in c['new'] or '&lt;/p&gt;' in c['new'])
                was = ('&lt;p&gt;' in c['old'] or '&lt;br&gt;' in c['old'] or '&lt;/p&gt;' in c['old'])
                if bad and not was:
                    dmg = i
                    break
            else:
                if nlines(c['old']) > 1 and nlines(c['new']) == 1:
                    dmg = i
                    break
        rec = {'cid': cid, 'class': 'ESCAPED' if cid in ESCAPED else 'FLATTENED',
               'title': case.get('title'), 'atmstatus': case.get('custom_atmstatus'),
               'automation_type': case.get('custom_automation_type'),
               'refs': case.get('refs'), 'section_id': case.get('section_id'),
               'n_expected_edits': len(chain), 'damage_index': dmg,
               'edits_after_damage': (len(chain) - 1 - dmg) if dmg is not None else None,
               'cur_lines': nlines(cur), 'cur_len': len(cur)}
        if dmg is not None:
            pre = chain[dmg]['old']
            rec['damage_date'] = chain[dmg]['date']
            rec['damage_user'] = chain[dmg]['user']
            rec['pre_lines'] = nlines(pre)
            rec['chain_intact'] = (chain[dmg]['new'] == chain[dmg + 1]['old']) if dmg + 1 < len(chain) else None
            rec['last_new_is_current'] = (chain[-1]['new'] == cur)
            rec['wording_identical_pre_vs_cur'] = (squash(pre) == squash(cur))
        json.dump({'record': rec, 'chain': chain, 'current': cur},
                  open('%s/%s.json' % (OUT, cid), 'w'), indent=1)
        summary.append(rec)
        print(json.dumps(rec), flush=True)
    json.dump(summary, open('%s/SUMMARY.json' % OUT, 'w'), indent=1)
    print('\n--- SUMMARY ---')
    print('damage located:', sum(1 for r in summary if r['damage_index'] is not None), '/', len(summary))
    print('wording identical pre vs current:', sum(1 for r in summary if r.get('wording_identical_pre_vs_cur')))
    print('last_new_is_current false:', [r['cid'] for r in summary if r.get('last_new_is_current') is False])
    print('edits after damage >0:', [(r['cid'], r['edits_after_damage']) for r in summary if r.get('edits_after_damage')])


if __name__ == '__main__':
    main()
