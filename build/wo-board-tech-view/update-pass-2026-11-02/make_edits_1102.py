"""make_edits_1102.py — 2 Nov 2026 update pass (QA lead: update the WO Board / Tech View tests to the fixed behaviour, keep them runnable).
Builds edits-parked/C<id>-send.json for the parked tests that PASSED on production v26.43.5 (ids given on the command line), Rule 136
mechanics (standing 114(c) for tests linked to a ticket that passed QA): only the parts the fix changed —
  expected: drops the "Known problem …" and "What you should see today …" (three-outcome) paragraphs, EXPECT FAIL marker -> READY,
            "Not yet checked …"/old "Last checked …" -> the production stamp, the cited defect's "(open)" -> its live status, and a
            "PRD version 82 re-read" sentence (quote-check.json proved every quote unchanged in v82); the source's quoted sentences are untouched.
  preconds: the stale "Build: the Work Orders QA build (sv10043)" line -> a neutral build line.
  title:    the "SV-nnnnn - " prefix comes off (Rule 133 amendment: it comes off when the test passes).
Writes a diff summary per case to edits-parked/summary.json. Nothing is sent from here (safe_case_edit.py sends)."""
import json, re, sys, os
D = json.load(open('parked-live-2026-11-02.json')); T = json.load(open('inventory.json')).get('tickets', {})
STAMP = 'Last checked against build v26.43.5-77de68c (production) on 11/2/2026.'
PRD82 = 'Re-read against PRD version 82 (29 Oct 2026) on 2 Nov 2026: the quoted rules are unchanged.'
os.makedirs('edits-parked', exist_ok=True); summary = {}
for cid in sys.argv[1:]:
    c = D[cid.lstrip('C')]; send = {}; why = []
    e = c['exp'] or ''; e2 = e.replace('</strong><br>', '</strong></p><p>')
    paras = re.findall(r'<p>.*?</p>|<ul>.*?</ul>|<ol>.*?</ol>|<hr ?/?>', e2, re.S)
    joined = ''.join(paras)
    if len(re.sub(r'\s', '', joined)) != len(re.sub(r'\s', '', e2)): sys.exit(f'{cid}: expected has text outside block tags; not touched')
    out = []
    for x in paras:
        if re.match(r'<p>(<strong>)?(Known problem|What you should see today)', x): why.append('removed: ' + re.sub('<[^>]+>', '', x)[:90]); continue
        if re.match(r'<p>(Not yet checked against a build|Last checked against build)', x): continue
        m = re.match(r'<p>AUTOMATION: READY - EXPECT FAIL \((SV-\d+)\)</p>', x)
        if m:
            out += [f'<p>{STAMP}</p>', '<p>AUTOMATION: READY</p>']; why.append(f'marker EXPECT FAIL ({m.group(1)}) -> READY; stamp production 11/2/2026'); continue
        if re.match(r'<p>AUTOMATION: HOLD - not yet build-verified', x): out += [f'<p>{STAMP}</p>', '<p>AUTOMATION: READY</p>']; why.append('marker HOLD (not yet build-verified) -> READY; stamp production 11/2/2026'); continue
        if x == '<p>AUTOMATION: READY</p>': out += [f'<p>{STAMP}</p>', x]; why.append('stamp production 11/2/2026'); continue
        y = x
        for k in set(re.findall(r'(SV-\d+)\)? ?\(open\)|Defect (SV-\d+) \(open\)', x)):
            for kk in [z for z in k if z]:
                st = T.get(kk, {}).get('status'); fx = ', '.join(T.get(kk, {}).get('fix') or [])
                if st and st != 'open': y = y.replace(f'{kk} (open)', f'{kk} ({st}{", fixed in " + fx if fx else ""})'); why.append(f'{kk} (open) -> {st}')
        if re.match(r'<p>(<strong>)?Source', y) is None and 'Confluence 845185030' in y and PRD82 not in y:
            y = y[:-4] + ' ' + PRD82 + '</p>'; why.append('PRD v82 re-read sentence added')
        out.append(y)
    ne = ''.join(out)
    if ne != e: send['custom_expected'] = ne
    p = c['pre'] or ''
    np_ = re.sub(r'Build: the Work Orders QA build \(sv10043(, v[\w.\-]+)?\)\.?', 'Build: any build that has the Work Orders Board View and Tech View (checked on production v26.43.5).', p)
    if np_ != p: send['custom_preconds'] = np_.replace('</strong><br>', '</strong></p><p>'); why.append('preconditions: stale QA-build line replaced')
    tt = re.sub(r'^SV-\d+ - ', '', c['title'])
    if tt != c['title']: send['title'] = tt; why.append('title prefix removed')
    for k, v in send.items():
        if k != 'title' and '<br' in v.lower(): sys.exit(f'{cid}: {k} still holds <br>')
    json.dump(send, open(f'edits-parked/{cid}-send.json', 'w'), ensure_ascii=False, indent=1); summary[cid] = why
json.dump(summary, open('edits-parked/summary.json', 'w'), indent=1); print(json.dumps(summary, indent=1)[:4000])
