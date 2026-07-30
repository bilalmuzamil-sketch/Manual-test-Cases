#!/usr/bin/env python3
"""Phases 2-4: build the requirement -> case coverage matrix with an explicit
verdict per requirement, plus the reverse (anchor validity) check."""
import json, glob, re, pathlib, collections
BASE = pathlib.Path('build/schedule/coverage-rederivation-2026-07-31')
reqs = json.load(open(BASE / 'requirement-case-candidates.json'))
cases = {}
for f in sorted(glob.glob('build/schedule/cases/*.json')):
    d = json.load(open(f)); cs = d if isinstance(d, list) else d.get('cases', d)
    for c in cs:
        if str(c.get('viu_status','')).startswith('Retired'): continue
        cases[c['id']] = c

# ---- verdict overrides, all hand-assigned from the section-by-section read ----
# NON-TESTABLE: goals / personas / success metrics / future considerations
NT_CONTEXT = ['R-1-01','R-1-02','R-1.1-01','R-1.1-02','R-1.2-01','R-1.2-02','R-1.2-03',
              'R-2-01','R-2-02','R-2-03','R-2-04',
              'R-13-01','R-13-02','R-13-03','R-13-04',
              'R-15-01','R-15-02','R-15-03','R-15-04','R-15-05','R-15-06']
# NON-TESTABLE: internal data-model field names (observable aspects covered elsewhere)
NT_IMPL = {'R-8.1-01':'shift internals (sid/rowKey/blockDuration/seriesId); observable behaviour in SCH-DND-01, SCH-SER-04',
           'R-8.1-02':'event internals (eid/rowKey/startHour); observable fields in SCH-EVT-03',
           'R-8.1-05':'technician internals (key/dept/hours); observable in SCH-NAV-04, SCH-VIEW-09, SCH-CONF-02',
           'R-8.1-06':'department internals (key/name); observable in SCH-NAV-04',
           'R-8.1-08':'empty/placeholder rowKey is internal; observable behaviour in SCH-START-05/07',
           'R-8.2-01':'shared seriesId is internal; observable behaviour in SCH-SPREAD-09, SCH-SER-04',
           'R-8.2-03':'"not a distinct persisted entity" is internal; observable behaviour in SCH-SER-04'}
# NON-TESTABLE: pure lead-in fragments whose content is carried by the bullets beneath
NT_LEADIN = {'R-4.1-01':'section lead-in ("The primary interaction model."), no assertion of its own',
             'R-4.2-12':'lead-in ("Both use the same pattern:"), the pattern bullets follow'}
# GAPS (judgement (a) genuine)
GAPS = {
 'R-4.3-05': dict(kind='(a) genuine gap - PARTIAL', close='EXTEND SCH-DND-07',
   why='"no technician cap" IS covered (SCH-LINE-04, SCH-SCOPE-01 avatar-stack "no cap"), but "no swap flow" is asserted NOWHERE: no case observes that scheduling a SECOND technician onto a line that already has one ADDS them alongside rather than replacing/prompting to swap. A build that replaced the incumbent would pass every existing case.'),
 'R-14.1-04': dict(kind='(a) genuine gap', close='NEW case SCH-PERM-13',
   why='No case asserts WHICH default roles sit at which Schedule tier. The role names Technician / Parts Manager / Parts Tech / Office / Time Clock appear nowhere in the 164-case corpus. SCH-PERM-01..06 test the tiers abstractly ("a user whose role has View").'),
 'R-14.1-08': dict(kind='(a) genuine gap', close='NEW case SCH-PERM-13 (same case)',
   why='Same gap, Edit side: Service Manager / Senior Service Advisor / Service Advisor / Foreman appear nowhere in the corpus.'),
}
# COVERED-WITH-CONFLICT / spec-residue flags (no case change - precedence already resolves them)
FLAGS = {
 'R-4.9-06': dict(id='F2', cases=['SCH-MODAL-04'],
   note='Spec §4.9 says the modal shows "the scheduled line(s) with labor/total figures"; SCH-MODAL-04 asserts NO money fields anywhere. Resolved by Rule 33 precedence: Branko\'s 2026-07-22 Q3 ruling + the Claude design §4c + tech-plan D6/NFR-002 ("no pricing in Schedule responses", also asserted by SCH-API-03) all say no money. The §4.9 clause is stale prose Branko has not tidied. NO case change; upstream tidy flagged.'),
 'R-12-03': dict(id='F1', cases=['SCH-EDGE-05','SCH-SPREAD-07'],
   note='Spec-internal contradiction X1: §12 says shop closures "block the spread step from placing shifts on those days", §4.5 says "Shop closures and public holidays are not skipped in V1..". Rule 32 latest-wins: the §4.5 sentence is the Confluence v22 edit (2026-07-27), the §12 sentence is untouched v18-era residue -> the V1 behaviour is NOT-skipped, which is what SCH-EDGE-05 asserts. No new case authored for either side (per instruction); §12 flagged to Branko for tidy (his open question NQ-1).'),
 'R-14.1-03': dict(id='F3', cases=['SCH-PERM-02'],
   note='§14.1 still lists a "right-click context menu" among the editing affordances; Branko ruled 2026-07-31 "there is no right click, only left click" and §4.10/§7 were rewritten to left-click in v22. Our cases follow left-click. NO case change; §14.1 wording flagged for upstream tidy.'),
 'R-14.1-07': dict(id='F3', cases=['SCH-PERM-04'],
   note='Same residue: §14.1 Edit tier says creation "including via right-click context menu". Cases follow the left-click ruling.'),
}
# manual case attributions where the mechanical ranking needs help
MANUAL = {
 'R-1.2-04': ['SCH-DND-07'], 'R-3-02': ['SCH-NAV-01'], 'R-4.2-02': ['SCH-START-01','SCH-START-02','SCH-START-03'],
 'R-4.8-05': ['SCH-LANE-02','SCH-LANE-04'], 'R-8.1-03': ['SCH-WOL-02','SCH-REG-05'],
 'R-8.1-04': ['SCH-LINE-04','SCH-MODAL-04'], 'R-8.1-07': ['SCH-LINE-04'],
 'R-8.2-02': ['SCH-DEL-01','SCH-DEL-05','SCH-SER-01','SCH-SER-02','SCH-SER-03'],
 'R-9-01': ['SCH-VIEW-01','SCH-VIEW-05'], 'R-11-03': ['SCH-KEY-05','SCH-DND-08','SCH-CAP-03','SCH-LANE-03','SCH-KEY-01'],
 'R-14.1-04': ['SCH-PERM-01','SCH-PERM-02'], 'R-14.1-08': ['SCH-PERM-04'],
 'R-12-01': ['SCH-LANE-01','SCH-LANE-03','SCH-LANE-04'],
 'R-7-06': ['SCH-DEL-01','SCH-DEL-02','SCH-DEL-03','SCH-DEL-04','SCH-DEL-05','SCH-DEL-06'],
 'R-3.1-03': ['SCH-LINE-01','SCH-LINE-03','SCH-LINE-04','SCH-LINE-05','SCH-LINE-06','SCH-LINE-07'],
 'R-4.5-03': ['SCH-SPREAD-03','SCH-SPREAD-04','SCH-SPREAD-05'],
 'R-12-02': ['SCH-START-01','SCH-START-02','SCH-START-03','SCH-START-04','SCH-START-05','SCH-START-06','SCH-START-07'],
 'R-4.2-06': ['SCH-START-04'],
 'R-14.1-10': ['SCH-PERM-06','SCH-DEL-01','SCH-DEL-05'],
}
# active cases that trace to the ENGINEERING TECH PLAN rather than a v23 PRD statement
TECHPLAN_ONLY = ['SCH-REG-01','SCH-REG-02','SCH-REG-03','SCH-REG-04','SCH-API-04','SCH-EDGE-07']

out = []
for r in reqs:
    rid = r['id']
    rec = dict(id=rid, section=r['section'], kind=r['kind'], text=r['text'])
    if rid in NT_CONTEXT:
        rec.update(verdict='NOT-TESTABLE', subtype='(b) goal / persona / success-metric / future consideration',
                   cases=[], note='States intent or a post-launch metric, not a behaviour a manual tester can observe.')
    elif rid in NT_IMPL:
        rec.update(verdict='NOT-TESTABLE', subtype='(b) implementation detail (data model)', cases=[], note=NT_IMPL[rid])
    elif rid in NT_LEADIN:
        rec.update(verdict='NOT-TESTABLE', subtype='(b) lead-in fragment', cases=[], note=NT_LEADIN[rid])
    elif rid in GAPS:
        g = GAPS[rid]
        rec.update(verdict='GAP', subtype=g['kind'], cases=MANUAL.get(rid, []), note=g['why'] + ' || CLOSURE: ' + g['close'])
    else:
        cl = MANUAL.get(rid) or [c['case'] for c in r['candidates'] if c['anchor'] and c['score'] >= 0.30] \
             or [c['case'] for c in r['candidates'] if c['anchor']][:1] \
             or [c['case'] for c in r['candidates'][:1]]
        rec.update(verdict='COVERED', subtype='', cases=cl, note='')
        if rid in FLAGS:
            rec['verdict'] = 'COVERED-FLAGGED'
            rec['cases'] = FLAGS[rid]['cases']
            rec['subtype'] = FLAGS[rid]['id']
            rec['note'] = FLAGS[rid]['note']
    bad = [c for c in rec['cases'] if c not in cases]
    assert not bad, (rid, bad)
    out.append(rec)

json.dump(out, open(BASE / 'coverage-matrix.json', 'w'), indent=1)
cnt = collections.Counter(r['verdict'] for r in out)
print('requirements:', len(out), dict(cnt))
print('COVERED with 0 cases:', [r['id'] for r in out if r['verdict'].startswith('COVERED') and not r['cases']])
# reverse check
valid = set(r['section'] for r in reqs) | {'4','5','8'}
bad = []
for cid, c in cases.items():
    txt = (c.get('refs','') or '') + ' ' + str(c.get('spec_ref','') or '')
    for a in re.findall(r'§(\d+(?:\.\d+)?)', txt):
        if a not in valid: bad.append((cid, a))
print('REVERSE CHECK - case anchors not present in v23:', bad)
used = set(x for r in out for x in r['cases'])
print('active cases referenced by >=1 requirement:', len(used), 'of', len(cases))
extra = sorted(set(cases) - used)
print('cases referenced by NO v23 PRD requirement:', extra)
print('  of those, expected tech-plan-derived:', [c for c in extra if c in TECHPLAN_ONLY])
print('  UNEXPLAINED:', [c for c in extra if c not in TECHPLAN_ONLY])
