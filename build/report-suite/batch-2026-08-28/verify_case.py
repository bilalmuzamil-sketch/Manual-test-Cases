#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Post-write verification, read-only. For each case id: re-read it through the API AND
re-read its RENDERED view page, compare against the pre-write dossier snapshot, and prove

  * only the field(s) named on the command line differ from the snapshot;
  * all three fields still render in `markdown fr-view` (or record the container if not);
  * a tester sees no literal tag and no escaped entity;
  * the AUTOMATION marker is present exactly once and is the LAST thing in Expected Result;
  * the provenance line is present;
  * `custom_atmstatus` is unchanged.

Usage: verify_case.py <dossier.json> <out.json> <cid>:<changed,fields> [...]
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(RS, 'writes-2026-08-26'))
sys.path.insert(0, os.path.join(RS, 'repin-2026-08-28'))
from tr import call                                                   # noqa: E402
from classify import login, field_containers, LITERALS, ENTITIES, BASE  # noqa: E402

KEEP = ('title', 'refs', 'section_id', 'priority_id', 'type_id', 'estimate', 'milestone_id',
        'template_id', 'custom_atmstatus', 'custom_automation_type')
FIELDS = ('custom_preconds', 'custom_steps', 'custom_expected')


def plain(h):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', h))


def main():
    dossier = json.load(open(sys.argv[1]))
    out = sys.argv[2]
    op = login()
    res = []
    allok = True
    for arg in sys.argv[3:]:
        cid, _, ch = arg.partition(':')
        changed = set(x for x in ch.split(',') if x)
        b = dossier[cid]
        st, live = call('get_case/%s' % cid)
        probs = []
        if st != 200:
            probs.append('GET HTTP %s' % st)
        else:
            for k in KEEP:
                if k in b and json.dumps(b[k]) != json.dumps(live.get(k)):
                    probs.append('%s changed %r -> %r' % (k, b[k], live.get(k)))
            for f in FIELDS:
                same = (b.get(f) or '').rstrip() == (live.get(f) or '').rstrip()
                if f in changed and same:
                    probs.append('%s was meant to change and did not' % f)
                if f not in changed and not same:
                    probs.append('%s CHANGED though it was not meant to' % f)
        page = op.open('%s/index.php?/cases/view/%s' % (BASE, cid), timeout=90).read().decode('utf-8', 'replace')
        fc = field_containers(page)
        for label in ('Preconditions', 'Steps', 'Expected Result'):
            cls, h = fc[label]
            for t in LITERALS:
                if t in h:
                    probs.append('LITERAL TAG %s visible to the tester in %s' % (t, label))
            for t in ENTITIES:
                if t in h:
                    probs.append('ESCAPED ENTITY %s visible to the tester in %s' % (t, label))
        p = plain(fc['Expected Result'][1])
        n = p.count('AUTOMATION: ')
        if n != 1:
            probs.append('AUTOMATION marker appears %d times' % n)
        else:
            tail = p[p.index('AUTOMATION: '):].strip()
            if not re.match(r'AUTOMATION: (READY - EXPECT FAIL \(SV-\d+\)|READY|HOLD\b)', tail):
                probs.append('AUTOMATION marker is not canonical: %r' % tail[:60])
            rest = re.sub(r'^AUTOMATION: (READY - EXPECT FAIL \(SV-\d+\)|READY|HOLD.*)$', '', tail).strip()
            if rest:
                probs.append('text follows the AUTOMATION marker: %r' % rest[:60])
        if 'This is the expected behaviour' not in p and 'expectation has not been checked' not in p:
            probs.append('provenance line missing')
        rec = {'cid': int(cid), 'ok': not probs, 'atm': live.get('custom_atmstatus'),
               'atm_before': b.get('atmstatus'),
               'containers': {k: fc[k][0] for k in fc},
               'containers_before': b.get('containers'),
               'changed_fields': sorted(changed),
               'versions_cited_before': b.get('versions_cited'),
               'versions_cited_now': sorted(set(re.findall(r'specification version (\d+)', live.get('custom_expected') or ''))),
               'problems': probs,
               'link': 'https://shopview.testrail.io/index.php?/cases/view/%s' % cid}
        res.append(rec)
        allok &= rec['ok']
        print('C%s %s atm=%s->%s exp=%s %s' % (cid, 'OK  ' if rec['ok'] else 'BAD ',
              rec['atm_before'], rec['atm'], rec['containers']['Expected Result'],
              '' if rec['ok'] else ' | '.join(probs)[:300]), flush=True)
    json.dump(res, open(out, 'w'), indent=1)
    print('wrote', out, '- ALL CLEAN' if allok else '- PROBLEMS FOUND')
    sys.exit(0 if allok else 3)


if __name__ == '__main__':
    main()
