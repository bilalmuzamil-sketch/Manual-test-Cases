#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""JOB 1 phase B - build the RESTORATION payload for each damaged case.  NO WRITES.

FLATTENED (17): the payload is the PRE-DAMAGE text taken verbatim from
get_history_for_case (`old_value` of the 2026-08-20 edit that destroyed the line
structure), re-emitted in the single-top-level-<p>-with-<br> storage shape that this
TestRail round-trips byte-identically.  Words are NOT touched.

ESCAPED-TAG (2): the pre-damage text is the value we SENT on the damaging write; the
API's sanitiser escaped every block after the first, which is the damage.  The payload
is those same words, re-emitted as one block with <br> between the paragraphs.

The ONE post-damage content change anywhere in the 19 is preserved, not reverted:
C29955's AUTOMATION marker was changed READY -> AUTOMATED on 2026-08-27 by TestRail
user 7 (Ahtasham Amjad, a FOREIGN editor).  Rule 38 - hands off.
"""
import json, os, sys, re, html, glob

HERE = os.path.dirname(os.path.abspath(__file__)); RS = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(RS, 'writes-2026-08-26'))
from htmlfmt import ent, block                                    # noqa: E402

ESCAPED_PRE = {
    # cid: (index of the chain entry whose NEW value is the text we intended, i.e. the
    #       last authored wording before the sanitiser escaping was observed)
    'C26427': 0,
    'C26489': 2,
}
BRK = re.compile(r'<br\s*/?>|</p>|</li>|</ul>|</ol>|</div>|</h[1-6]>')


def plain(v):
    """What a tester sees: break tags -> newline, all other tags dropped, entities decoded."""
    v = BRK.sub('\n', v or '')
    v = re.sub(r'<[^>]+>', '', v)
    v = html.unescape(html.unescape(v))
    return re.sub(r'[ \t]+', ' ', v)


def words(v):
    return plain(v).split()


def main():
    payloads = {}
    for f in sorted(glob.glob('/tmp/rspin/repair/C[0-9]*.json')):
        d = json.load(open(f)); r = d['record']; ch = d['chain']; cid = r['cid']
        if cid in ESCAPED_PRE:
            src = ch[ESCAPED_PRE[cid]]['new']
            # one authored paragraph per line; the escaping is what we are undoing
            lines = [re.sub(r'\s+', ' ', plain(b)).strip()
                     for b in re.findall(r'<p>(.*?)</p>', src, re.S)]
        else:
            src = ch[r['damage_index']]['old']
            lines = [l.rstrip() for l in (src or '').split('\n')]
            while lines and not lines[-1]:
                lines.pop()
        # preserve the ONE post-damage foreign content change
        note = None
        if cid == 'C29955':
            cur_marker = re.search(r'AUTOMATION: [A-Z][A-Z \-]*', plain(d['current']))
            cur_marker = cur_marker.group(0).strip() if cur_marker else None
            for i, l in enumerate(lines):
                if l.startswith('AUTOMATION: ') and cur_marker and l != cur_marker:
                    note = 'AUTOMATION marker kept as the CURRENT value %r (foreign edit by ' \
                           'user 7 on 2026-08-27), not reverted to the pre-damage %r' % (cur_marker, l)
                    lines[i] = cur_marker
        payload = block(lines)
        # PROOF: the visible words of the payload equal the visible words of the source,
        # and (for flattened) equal the visible words of the CURRENT damaged body too -
        # i.e. this restores structure and changes no wording at all.
        chk = {'payload_words_eq_source': words(payload) == words(src)}
        if cid not in ESCAPED_PRE:
            cw, pw = words(d['current']), words(payload)
            chk['payload_words_eq_current'] = cw == pw
            chk['current_vs_payload_diff'] = [w for w in cw if w not in pw][:5] if cw != pw else []
        chk['rendered_lines_after'] = len([l for l in lines if l.strip()])
        chk['blank_display_lines'] = len([l for l in lines if not l.strip()])
        chk['automation_markers'] = payload.count('AUTOMATION: ')
        chk['marker_is_last'] = lines[-1].startswith('AUTOMATION: ')
        chk['has_provenance'] = 'This is the expected behaviour' in plain(payload)
        chk['top_level_p'] = payload.count('<p>')
        payloads[cid] = {'cid': cid, 'class': r['class'], 'atmstatus': r['atmstatus'],
                         'automation_type': r['automation_type'], 'refs': r['refs'],
                         'payload': payload, 'checks': chk, 'note': note}
        print(cid, json.dumps(chk), ('  NOTE: ' + note) if note else '', flush=True)
    json.dump(payloads, open('/tmp/rspin/repair/PAYLOADS.json', 'w'), indent=1)
    bad = [c for c, p in payloads.items() if not p['checks']['payload_words_eq_source']
           or not p['checks']['marker_is_last'] or p['checks']['automation_markers'] != 1
           or not p['checks']['has_provenance'] or p['checks']['top_level_p'] != 1]
    print('\nPAYLOADS', len(payloads), 'FAILING GATES:', bad)


if __name__ == '__main__':
    main()
