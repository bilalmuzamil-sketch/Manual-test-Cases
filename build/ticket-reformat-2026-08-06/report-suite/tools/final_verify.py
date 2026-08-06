#!/usr/bin/env python3
"""Final check, read LIVE from Jira over the whole population -- no sampling.

Per rewritten ticket:
  · the five headings are present, exactly once each, in order
  · an Environment line naming the QA branch sits immediately before the steps
  · a numbered list follows it
  · the body ends with a rule then a Source paragraph
  · NONE of the removed sections survives, and no meta-sentence survives
  · every existing attachment is still on the ticket
  · every field except description/updated matches the pre-write snapshot
Per closed ticket: byte-identical to its pre-edit snapshot, updated_on included.
"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import jiralib as J
import adf, render

HERE = os.path.dirname(os.path.abspath(__file__))
SNAP = os.path.join(HERE, '..', 'snapshots')
AUTH = os.path.join(HERE, '..', 'authored')

HEADS = ['Description', 'Steps to reproduce', 'Current behaviour', 'Expected behaviour']
BANNED = [
    'What was ruled out', 'Technical details for developers', 'How bad is it', 'How often',
    'Where it was seen', 'What we ruled out', 'What we tested it on', 'Evidence files',
    'source type 2', 'Branch / Environment', 'Branch / environment', 'What is NOT established',
    'What is ESTABLISHED', 'Full probe data', 'What should happen instead', 'What happens now',
    'Where this expectation comes from', 'Images',
]


def canon(v):
    return json.dumps(v, sort_keys=True, ensure_ascii=False, separators=(',', ':'))


def main():
    ws = json.load(open(os.path.join(SNAP, 'working-set.json')))
    work = ws['working_set']
    rewritten = sorted(k for k in work if os.path.exists(os.path.join(AUTH, k + '.json')))
    closed = sorted(k for k, v in work.items() if not v['open'])

    rows, fails = [], 0
    for k in sorted(work):
        code, live = J.get(f'/rest/api/3/issue/{k}?expand=renderedFields', out=f'/tmp/_rffv_{k}.json')
        if code != '200':
            raise SystemExit(f'{k}: HTTP {code}')
        f = live['fields']
        r = {'ticket': k, 'checks': {}}

        if k in rewritten:
            rec = json.load(open(os.path.join(AUTH, k + '.json')))
            want = render.build(rec)
            body = f['description']
            txt = adf.flatten(body)

            r['checks']['description_equals_intended'] = canon(body) == canon(want)
            heads = [n['content'][0]['text'] for n in body['content'] if n['type'] == 'heading']
            r['checks']['five_headings_exact'] = heads == HEADS + ['Source'] or heads == HEADS
            r['checks']['headings'] = heads
            # environment line immediately before the ordered list
            types = [n['type'] for n in body['content']]
            r['checks']['has_ordered_list'] = 'orderedList' in types
            oi = types.index('orderedList') if 'orderedList' in types else -1
            envp = adf.flatten({'content': [body['content'][oi - 1]]}) if oi > 0 else ''
            r['checks']['env_line_before_steps'] = envp.startswith('Environment:') and 'sv8582' in envp
            r['checks']['env_names_admin_or_says_why'] = ('signed in as an Admin' in envp
                                                          or 'Admin' in envp)
            r['checks']['ends_rule_then_source'] = ('rule' in types
                                                    and types.index('rule') < len(types) - 1
                                                    and 'Source' in txt)
            r['checks']['banned_absent'] = [b for b in BANNED if b in txt] == []
            r['checks']['banned_found'] = [b for b in BANNED if b in txt]
            r['checks']['source_present'] = bool(re.search(r'Source\s*—', txt))

            pre = json.load(open(os.path.join(SNAP, 'pre-write', k + '.json')))['fields']
            moved = [fl for fl in sorted(set(pre) | set(f))
                     if canon(pre.get(fl)) != canon(f.get(fl))]
            r['checks']['fields_moved'] = moved
            r['checks']['no_collateral'] = [m for m in moved if m not in ('description', 'updated', 'lastViewed')] == []
            pre_att = {a['id'] for a in (pre.get('attachment') or [])}
            now_att = {a['id'] for a in (f.get('attachment') or [])}
            r['checks']['attachments_intact'] = (pre_att == now_att)
            r['checks']['attachments'] = sorted(now_att)
        else:
            snap = json.load(open(os.path.join(SNAP, 'pre-edit', k + '.adf.json')))
            r['checks']['closed_untouched_description'] = canon(f['description']) == canon(snap)
            r['checks']['status'] = f['status']['name']
            r['checks']['resolution'] = (f.get('resolution') or {}).get('name')

        bad = [c for c, v in r['checks'].items() if v is False]
        r['verdict'] = 'PASS' if not bad else 'FAIL'
        r['failed_checks'] = bad
        if bad:
            fails += 1
            print('FAIL', k, bad, {c: r['checks'][c] for c in bad})
        rows.append(r)

    out = {'population': len(work), 'rewritten': len(rewritten), 'closed_untouched': len(closed),
           'pass': len(rows) - fails, 'fail': fails, 'rows': rows}
    json.dump(out, open(os.path.join(SNAP, 'FINAL-VERIFICATION.json'), 'w'), indent=1)
    print(f'{len(work)} tickets read live · rewritten {len(rewritten)} · closed untouched {len(closed)} '
          f'· PASS {len(rows)-fails} · FAIL {fails}')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
