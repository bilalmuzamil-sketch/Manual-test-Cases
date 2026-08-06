# -*- coding: utf-8 -*-
"""Read SV-8991 back from Jira and check every field against what was intended (Standing Rule 50)."""
import json, sys, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', 'ticket-source-blocks-2026-08-06', 'tools'))
import jiralib as J
sys.path.insert(0, HERE)
import file_ticket as T

KEY = 'SV-8991'
code, d = J.get('/rest/api/3/issue/%s?expand=renderedFields' % KEY, out='/tmp/z/sv8991-live.json')
f = d.get('fields', {})
res = []


def ck(name, ok, got, want=''):
    res.append((name, 'PASS' if ok else 'FAIL', got, want))


ck('1  re-GET HTTP', code == '200', code, '200')
ck('2  key', d.get('key') == KEY, d.get('key'), KEY)
it = f.get('issuetype', {})
ck('3  issuetype name', it.get('name') == 'Story Defect', it.get('name'), 'Story Defect')
ck('4  issuetype id', str(it.get('id')) == '10007', it.get('id'), '10007')
ck('5  subtask / hierarchyLevel', it.get('subtask') is True and it.get('hierarchyLevel') == -1,
   '%s / %s' % (it.get('subtask'), it.get('hierarchyLevel')), 'True / -1')
par = (f.get('parent') or {})
ck('6  parent = owning story', par.get('key') == T.STORY, par.get('key'), T.STORY)
ck('7  parent is a Story at level 0',
   par.get('fields', {}).get('issuetype', {}).get('name') == 'Story',
   par.get('fields', {}).get('issuetype', {}).get('name'), 'Story')
ck('8  priority', (f.get('priority') or {}).get('name') == 'Medium',
   (f.get('priority') or {}).get('name'), 'Medium (Rule 53 as amended 2026-08-06)')
ck('9  status', (f.get('status') or {}).get('name') == 'Open', (f.get('status') or {}).get('name'), 'Open')
ck('10 project', (f.get('project') or {}).get('key') == 'SV', (f.get('project') or {}).get('key'), 'SV')
ck('11 summary byte-equal', f.get('summary') == T.SUMMARY, repr(f.get('summary'))[:90], 'the intended string')
live_adf = json.dumps(f.get('description'), sort_keys=True, ensure_ascii=False)
want_adf = json.dumps(T.adf(), sort_keys=True, ensure_ascii=False)
ck('12 description ADF byte-equal', live_adf == want_adf,
   '%d chars' % len(live_adf), '%d chars' % len(want_adf))
links = [(l['type']['name'], (l.get('outwardIssue') or l.get('inwardIssue', {})).get('key'))
         for l in f.get('issuelinks', [])]
ck('13 relates-to link on the owning story', ('Relates', T.STORY) in links, links, "[('Relates', '%s')]" % T.STORY)
ck('14 Product Area not set (absent on this type)', not f.get('customfield_10153'),
   f.get('customfield_10153'), 'None')
ck('15 Severity left unset (mirrors the 29 peers)', f.get('customfield_10418') is None,
   f.get('customfield_10418'), 'None')
ck('16 labels empty', f.get('labels') == [], f.get('labels'), '[]')
att = [(a['filename'], a['size']) for a in f.get('attachment', [])]
ck('17 screenshot attached at the right size', ('sbc-empty-state.png', 99358) in att, att,
   "[('sbc-empty-state.png', 99358)]")
plain = re.sub(r'<[^>]+>', ' ', f.get('renderedFields', {}).get('description', '')
               if isinstance(d.get('renderedFields'), dict) else '')
plain = plain or ''
rf = (d.get('renderedFields') or {}).get('description', '')
n_src = rf.count('Where this expected behaviour comes from')
ck('18 source block present, exactly one heading + 2 citations', n_src == 3, n_src,
   '3 (the heading and the two requirement citations)')
ck('19 no internal case IDs or TestRail links', not re.search(r'\bC3\d{4}\b|testrail', rf, re.I),
   'none found', 'none')
ck('20 no provisional / not-final disclaimer',
   not re.search(r'not final|provisional|close it if|already fixed', rf, re.I), 'none found', 'none')
ck('21 both requirement anchors quoted', 'S18-N1' in rf and 'S18-R10' in rf,
   'S18-N1 and S18-R10 both present', 'both')

print('%-52s %-5s' % ('CHECK', 'RESULT'))
for n, r, got, want in res:
    print('%-52s %-5s  got=%s' % (n, r, str(got)[:70]))
print()
print('%d checks: %d PASS / %d FAIL' % (len(res), sum(1 for x in res if x[1] == 'PASS'),
                                        sum(1 for x in res if x[1] == 'FAIL')))
json.dump([{'check': n, 'result': r, 'got': str(got), 'expected': str(want)} for n, r, got, want in res],
          open(os.path.join(HERE, '..', 'FIELD-CHECKS.json'), 'w'), indent=1)
