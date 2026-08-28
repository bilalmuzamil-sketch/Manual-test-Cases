#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""JOB 2 phase A - create the three approved candidate cases, verified one at a time."""
import json, os, sys, re, datetime
ROOT = '/home/user/Manual-test-Cases'
HERE = os.path.join(ROOT, 'build/report-suite/wip-authoring-2026-08-28')
sys.path.insert(0, os.path.join(ROOT, 'build/report-suite/repin-2026-08-28'))
sys.path.insert(0, os.path.join(ROOT, 'build/report-suite/writes-2026-08-26'))
sys.path.insert(0, os.path.join(ROOT, 'build/testing-tools'))
from tr import call                                                    # noqa
from testrail_add_case import add_case_payload, AUTOMATION_STATUS      # noqa
from classify import login, field_containers, BASE, LITERALS, ENTITIES  # noqa

IDS = ['WIP-STR-REC-05', 'WIP-STR-NEG-06', 'WIP-ADJ-OUT-07']
OUT = os.path.join(HERE, 'created3.json')
LOG = os.path.join(HERE, 'oplog3.json')
BRK = re.compile(r'<br\s*/?>|</p>|</li>')


def vis(h):
    h = BRK.sub('\n', h or ''); h = re.sub(r'<[^>]+>', '', h)
    import html as H
    h = H.unescape(H.unescape(h))
    return [l.strip() for l in h.split('\n') if l.strip()]


def norm_refs(v):
    # TestRail treats `refs` as a comma-separated list and trims each entry, so it stores
    # "a, b" as "a,b".  That normalisation is TestRail's, not a content change.
    return ','.join(x.strip() for x in (v or '').split(','))


def existing_in_section(section_id, title):
    s, d = call('get_cases/1&suite_id=1&section_id=%d&limit=250' % section_id)
    if s != 200:
        return None
    for c in (d['cases'] if isinstance(d, dict) else d):
        if c['title'] == title:
            return c
    return None


def main():
    created = json.load(open(OUT)) if os.path.exists(OUT) else []
    have = {c['internal_id'] for c in created}
    op = login(); ops = []
    for iid in IDS:
        if iid in have:
            print('skip', iid); continue
        d = json.load(open(os.path.join(HERE, 'drafts', iid + '.json')))
        assert len(d['title']) <= 80
        found = existing_in_section(d['section_id'], d['title'])
        if found:
            print('%s already exists as C%d - verifying it instead of creating a duplicate'
                  % (iid, found['id']))
            resp, s = {'id': found['id']}, 200
        else:
            payload = add_case_payload(title=d['title'], refs=d['refs'], preconds=d['preconds'],
                                       steps=d['steps'], expected=d['expected'])
            assert payload['custom_atmstatus'] == AUTOMATION_STATUS['Not Automated'] == 1
            s, resp = call('add_case/%d' % d['section_id'], payload)
            if s != 200:
                print('STOP - add_case failed for %s: HTTP %s %s' % (iid, s, str(resp)[:200])); return 2
        cid = 'C%d' % resp['id']
        s2, back = call('get_case/%d' % resp['id'])
        probs = []
        for k, src in (('title', 'title'), ('refs', 'refs'), ('custom_preconds', 'preconds'),
                       ('custom_steps', 'steps'), ('custom_expected', 'expected')):
            if k == 'refs':
                if norm_refs(back.get(k)) != norm_refs(d[src]):
                    probs.append('refs does not match the draft')
            elif vis(back.get(k)) != vis(d[src]):
                probs.append('%s does not match the draft' % k)
        if back.get('section_id') != d['section_id']:
            probs.append('landed in section %s not %s' % (back.get('section_id'), d['section_id']))
        if back.get('custom_atmstatus') != 1:
            probs.append('custom_atmstatus is %r not 1' % back.get('custom_atmstatus'))
        if back.get('custom_automation_type') != 0:
            probs.append('custom_automation_type is %r not 0' % back.get('custom_automation_type'))
        # RENDERED page - score only the fr-view blocks (the page repeats the source twice more)
        page = op.open(f'{BASE}/index.php?/cases/view/{resp["id"]}', timeout=90).read().decode('utf-8', 'replace')
        fc = field_containers(page); render = {}
        for label in ('Preconditions', 'Steps', 'Expected Result'):
            cls, htm = fc[label]
            if cls != 'markdown fr-view':
                probs.append('%s container %r' % (label, cls))
            for t in LITERALS:
                if t in htm: probs.append('literal %s visible in %s' % (t, label))
            for t in ENTITIES:
                if t in htm: probs.append('entity %s visible in %s' % (t, label))
            render[label] = len(vis(htm))
        exp = vis(fc['Expected Result'][1])
        nm = sum(1 for l in exp if l.startswith('AUTOMATION: '))
        if nm != 1: probs.append('AUTOMATION marker x%d' % nm)
        elif exp[-1] != 'AUTOMATION: READY': probs.append('marker not last / not READY')
        if sum(1 for l in exp if l.startswith('This is the expected behaviour')) != 1:
            probs.append('provenance line not present exactly once')
        if 'build' in ' '.join(exp).lower().split('AUTOMATION')[0][-400:]:
            probs.append('provenance mentions a build - Rule 54 forbids it here')
        rec = {'internal_id': iid, 'cid': cid, 'id': resp['id'], 'section_id': d['section_id'],
               'covers': d['covers'], 'title': d['title'],
               'link': 'https://shopview.testrail.io/index.php?/cases/view/%d' % resp['id'],
               'add_case_http': s, 'get_case_http': s2, 'rendered_lines': render,
               'atmstatus': back.get('custom_atmstatus'),
               'automation_type': back.get('custom_automation_type'),
               'when': datetime.datetime.utcnow().isoformat() + 'Z', 'problems': probs}
        ops.append(rec)
        if probs:
            print('\n*** %s (%s) CAME BACK WRONG - RUN STOPPED ***' % (iid, cid))
            for p in probs: print('   ', p)
            json.dump(ops, open(LOG, 'w'), indent=1); return 3
        created.append(rec); json.dump(created, open(OUT, 'w'), indent=1)
        json.dump(ops, open(LOG, 'w'), indent=1)
        print('OK %s -> %s  %s  rendered %s' % (iid, cid, rec['link'], render), flush=True)
    print('\nall three created and verified clean')
    return 0


if __name__ == '__main__':
    sys.exit(main())
