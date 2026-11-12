#!/usr/bin/env python3
"""run-<env>.json + evidence pictures  ->  a RESULTS json that push_results_to_run.py posts in ONE command.
WRITES NOTHING TO TESTRAIL. Local files only:

    python3 results_for_testrail.py staging          # -> ../testrail-results-staging/RESULTS-STAGING.json + pics/

What it does, per case in run-<env>.json (V1R key -> C-id from ../results.json; V1R-72 was deleted and is skipped):
  PASS    -> "Passed"; observed = every check as "Step ...: what was seen".
  FAIL    -> "Failed" ONLY when the case says the failure MATCHES a known, still-relevant ticket's symptom
             (KNOWN below - the tickets the QA-branch run filed; SV-12546 is NOT here: it was closed OBSOLETE and
             V1R-35 now expects Product's decision). Any other failure is listed under NEEDS REVIEW and NOT emitted:
             a new failure needs Rules 110/120/121 (measure, attribute, search Jira, read the epic's notes) first.
  BLOCKED -> "Blocked" with the case's own reason as the "What needs to be done" line.
  ERROR   -> not emitted (a harness error is not a product verdict, Rule 12); listed for a re-run.
Pictures: every evidence picture is annotated with scratchpad xtools/annotate_v2.py (title = case, step, env, build,
UTC time) so the image alone says what it is. Boxes for a Failed result are added by hand before posting.
The build marker must be ONE value across every emitted verdict (Rule 110c) - mixed markers are refused."""
import json, os, re, subprocess, sys, datetime
HERE = os.path.dirname(os.path.abspath(__file__)); RUNDIR = os.path.dirname(HERE)
XT = '/tmp/claude-0/-home-user/ef40c1d4-3e84-5396-9a66-1a25d97a7768/scratchpad/xtools'
ENV = sys.argv[1] if len(sys.argv) > 1 else 'staging'
LABEL = {'staging': 'Staging', 'qa': 'the QA site', 'prod': 'Production'}[ENV]
OUT = os.environ.get('RFT_OUT') or os.path.join(RUNDIR, f'testrail-results-{ENV}'); PICS = os.path.join(OUT, 'pics'); os.makedirs(PICS, exist_ok=True)
EVID = os.path.join(RUNDIR, 'evidence-staging' if ENV == 'staging' else 'evidence')
ONLY = os.environ.get('RFT_MARKER')   # build one RESULTS file per build when a redeploy split the run (Rule 110c)
RUN = json.load(open(os.environ.get('RFT_RUN') or os.path.join(HERE, f'run-{ENV}.json')))   # RFT_RUN / RFT_OUT: test overrides
CID = {c['key']: c['cid'] for c in json.load(open(os.path.join(RUNDIR, 'results.json')))['cases']}
DELETED = {'V1R-72'}
# need records only a developer can make (no screen or API a tester can use creates them) - never posted from a run
HELD = {'V1R-25', 'V1R-26', 'V1R-27'}   # retired to section 134653 by the QA lead; V1R-76 revived 12 Nov 2026
# V1R-35 was rewritten 12 Nov 2026 to Product's decision: its implementation is V1R-35v2 (the old V1R-35 code is retired);
# V1R-35chev is the chevron measurement (Rule 120) that supports it - shown for review, never posted on its own.
ALIAS = {'V1R-35v2': 'V1R-35'}; SUPPORT = {'V1R-35chev'}
KNOWN = {  # key -> ticket the QA-branch run filed for exactly this symptom (re-check each ticket's status before posting)
    'V1R-07': 'SV-12545', 'V1R-08': 'SV-12545', 'V1R-36': 'SV-12547',
}
QA_RES = json.load(open(os.path.join(RUNDIR, 'testrail-results-v2', 'RESULTS.json')))['results']
for k, v in list(QA_RES.items()):   # also carry any other key the QA run tied to SV-12544 / 12545 / 12547 (not 12546)
    for t in v.get('defects') or []:
        key = next((kk for kk, cc in CID.items() if cc == k), None)
        if key and t in ('SV-12544', 'SV-12545', 'SV-12547'): KNOWN.setdefault(key, t)
# Only a ticket that is OPEN right now may carry a Failed result (read its status in Jira before every post).
# 12 Nov 2026 13:0xZ: SV-12545 "Ready to Fix" (open); SV-12544 and SV-12547 "Done"; SV-12546 OBSOLETE.
OPEN = set((os.environ.get('OPEN_TICKETS') or 'SV-12545').split(','))
KNOWN = {k: t for k, t in KNOWN.items() if t in OPEN}
def lines(r):
    if r.get('checks'): return [f"{'' if c['ok'] else 'NOT AS EXPECTED - '}{c['what']}: {c['saw']}" for c in r['checks']]
    return [s.strip() for s in (r.get('observed') or '').split(' | ') if s.strip()]
def pics(key, cid, r):
    out = []
    for i, ev in enumerate(r.get('evidence') or [], 1):
        src = ev if os.path.isabs(ev) else os.path.join(EVID, ev)
        if not (src.endswith('.png') and os.path.isfile(src)): continue
        step = re.sub(r'^V1R-\d+\s*-\s*', '', os.path.basename(src))[:-4]
        dst = os.path.join(PICS, f'{cid}-{i}-' + re.sub(r'[^a-z0-9]+', '-', step.lower()).strip('-')[:60] + '.png')
        title = f"{key} ({cid}) - {step} - {LABEL}, build {r.get('marker')}, {r.get('utc_start', '')[:16].replace('T', ' ')} UTC"
        subprocess.run(['python3', os.path.join(XT, 'annotate_v2.py'), src, dst, '--title', title], check=True, capture_output=True)
        out.append(dst)
    return out
res, review, errors, skipped, held, markers, days = {}, [], [], [], [], set(), set()
for key in sorted(RUN, key=lambda k: (int(re.match(r'V1R-(\d+)', k).group(1)), k)):
    r = RUN[key]; cid = CID.get(ALIAS.get(key, key))
    if ONLY and r.get('marker') != ONLY: skipped.append(f"{key} (observed on build {r.get('marker')}, not {ONLY})"); continue
    if key in SUPPORT: review.append(f"{key}: supporting measurement for V1R-35, verdict {r['verdict']} - read it before posting V1R-35: {r.get('observed', '')[:200]}"); continue
    if key == 'V1R-35' and 'V1R-35v2' in RUN: skipped.append('V1R-35 (retired implementation; V1R-35v2 is the case now)'); continue
    if key in DELETED or not cid: skipped.append(key); continue
    if key in HELD: held.append(f'{key} {cid}'); continue
    v = r['verdict']
    if v == 'ERROR': errors.append(f"{key} {cid}: {r.get('observed', '')[:160]}"); continue
    rec = {'observed': lines(r), 'note': f"run-{ENV}.json {r.get('utc_start')}..{r.get('utc_end')}, build {r.get('marker')}"}
    if v == 'PASS': rec['verdict'] = 'Passed'
    elif v == 'BLOCKED':
        rec['verdict'] = 'Blocked'
        rec['todo'] = 'What needs to be done: ' + (r.get('note') or r.get('observed') or 'see the observation above').strip()
    elif v == 'FAIL':
        t = KNOWN.get(key); matches = 'matches' in str(r.get('expect_fail_outcome') or '')
        if not (t and matches):
            review.append(f"{key} {cid}: FAIL{' (ticket ' + t + ' known but symptom ' + repr(r.get('expect_fail_outcome')) + ')' if t else ' - no known ticket'}: "
                          + '; '.join(x for x in lines(r) if x.startswith('NOT AS EXPECTED'))[:300]); continue
        bad = [c for c in r.get('checks') or [] if not c['ok']]
        rec.update({'verdict': 'Failed', 'defects': [t], 'ticket': f'Ticket: https://shopview.atlassian.net/browse/{t}',
                    'failed_steps': 'Failed at: ' + '; '.join(f"{c['what']} (saw: {c['saw'][:120]})" for c in bad),
                    'bold_steps': sorted({int(m) for c in bad for m in re.findall(r'Steps? (\d+)', c['what'])}),
                    'todo': f'What needs to be done: nothing for the tester now; re-run this test once {t} is fixed.'})
        q = QA_RES.get(cid) or {}
        if q.get('source'): rec['source'] = q['source']
    else: review.append(f'{key} {cid}: unknown verdict {v}'); continue
    rec['pictures'] = pics(key, cid, r)
    markers.add(r.get('marker')); days.add((r.get('utc_start') or '')[:10]); res[cid] = rec
if len(markers) > 1: sys.exit(f'REFUSED: verdicts span several builds {sorted(markers)} - re-run the older ones on one build (Rule 110c)')
marker = next(iter(markers), 'none'); day = max(days) if days else ''
date = datetime.date.fromisoformat(day).strftime('%-d %B %Y') if day else ''
meta = {'env': ENV, 'build_marker': marker, 'utc_days': sorted(days), 'built_utc': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
        'not_emitted': {'needs_review': review, 'harness_errors': errors, 'held_developer_data': held, 'skipped_deleted': skipped}}
path = os.path.join(OUT, f'RESULTS-{ENV.upper()}' + (f'-{ONLY}' if ONLY else '') + '.json')
json.dump({'pass_meta': meta, 'results': res}, open(path, 'w'), indent=1, ensure_ascii=False)
from collections import Counter
print(f"{path}: {dict(Counter(x['verdict'] for x in res.values()))} | build {marker} | {sum(len(x['pictures']) for x in res.values())} annotated pictures")
for h, xs in (('NEEDS REVIEW (not emitted)', review), ('HARNESS ERRORS (re-run, not emitted)', errors), ('HELD - need developer data (not emitted)', held), ('skipped (deleted or retired)', skipped)):
    if xs: print(h + ':'); [print('  ' + x) for x in xs]
nopic = sorted(c for c, x in res.items() if not x['pictures'])
if nopic: print('no picture (push with --screenshots yes will refuse these):', ', '.join(nopic))
print(f'\nDRY RUN (writes nothing):\n  python3 {XT}/push_results_to_run.py --run <RUN-ID> --results {path} '
      f'--build-marker {marker} --date "{date}" --env "{LABEL}" --screenshots yes --dry-run')
