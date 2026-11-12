"""WRITE Tier A (timing phrases only) to the 13 cases of section 133628, exactly as repoint-13-proposed/ (the dry run,
REPOINT-13-CASES-DRYRUN.md). RUN 12 Nov 2026 by the coordinator on the QA lead's go-ahead ("Do it if that is needed"): 13/13 written and re-verified OK (see the reverify lines in the log).
Run it only with the QA lead's explicit go-ahead (Rule 6):
    python3 repoint_13_write.py <staging app-version marker, e.g. v26.45.3-6197d19>
Per case: re-read live and REFUSE if it changed since the before-image or is flagged Automated (Rule 71); update_case
with title / custom_preconds / custom_steps / custom_expected only (never custom_preconds_tierB); read back; prove the
4 fields equal the proposal, every other field and the "Exact quotes from the source" block identical to the
before-image. Log: repoint-13-write-log.jsonl (operation · C-id · HTTP status · verification result · Rule 41 line).
PRD check done 12 Nov 2026 ~07:00Z: Confluence 947650561 last modified 2026-11-05T13:21Z = v11, unchanged."""
import sys, json, os, re, datetime
sys.path.insert(0, '/home/user/Manual-test-Cases/build/ar-ap-report-sorting/v1-regression/tools')
from push_testrail import req  # credentials from /tmp/testrail/creds.json only

HERE = os.path.dirname(os.path.abspath(__file__))
IDS = [715471, 715472, 715475, 715617, 715618, 715476, 715480, 715582, 715583, 715619, 715620, 715584, 1062590]
F4 = ['title', 'custom_preconds', 'custom_steps', 'custom_expected']
VOLATILE = {'updated_on', 'updated_by', 'version'}  # version = TestRail's edit counter (fixed 12 Nov 2026 after a false FAILED)
PRD = ('PRD "A/R and A/P Report Sorting, Export and Location Filter", Confluence 947650561, v11 '
       '(last modified 2026-11-05T13:21Z; re-check it is still v11 before running)')
MARK = sys.argv[1] if len(sys.argv) > 1 else '?'
LOG = open(f'{HERE}/repoint-13-write-log.jsonl', 'a')
norm = lambda s: re.sub(r'(</p>)?\s*$', '', (s or '').replace('\r\n', '\n'))  # TestRail trailing newline / stray </p> (playbook §O4)


def quotes(e):
    i = (e or '').find('<p><strong>Exact quotes from the source')
    return e[i:] if i >= 0 else ''


def log(**k):
    k['utc'] = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    LOG.write(json.dumps(k, ensure_ascii=False) + '\n'); LOG.flush(); print(json.dumps(k)[:300])


ok_all = True
for i in IDS:
    b = json.load(open(f'{HERE}/repoint-13-before-images/C{i}.json'))
    p = json.load(open(f'{HERE}/repoint-13-proposed/C{i}.json'))
    st, live = req(f'get_case/{i}')
    if st != 200 or any(live.get(k) != b.get(k) for k in b if k not in VOLATILE) or live.get('updated_on') != b.get('updated_on'):
        log(op='pre-read', case=f'C{i}', http=st, result='REFUSED: case changed since the before-image (or read failed)'); ok_all = False; continue
    if live.get('custom_atmstatus') != 1:
        log(op='pre-read', case=f'C{i}', http=st, result=f'REFUSED: atmstatus {live.get("custom_atmstatus")} (Rule 71)'); ok_all = False; continue
    st2, _ = req(f'update_case/{i}', {k: p[k] for k in F4})
    st3, a = req(f'get_case/{i}')
    fails = [f'{k} != proposal' for k in F4 if norm(a.get(k)) != norm(p[k])]
    fails += [f'untouched field {k} changed' for k in b if k not in VOLATILE and k not in F4 and a.get(k) != b.get(k)]
    if norm(quotes(a.get('custom_expected'))) != norm(quotes(b.get('custom_expected'))):
        fails.append('quote block differs')
    res = 'VERIFIED' if (st2 == 200 and st3 == 200 and not fails) else 'FAILED: ' + '; '.join(fails or [f'HTTP {st2}/{st3}'])
    ok_all &= res == 'VERIFIED'
    log(op='update_case', case=f'C{i}', link=f'https://shopview.testrail.io/index.php?/cases/view/{i}', http=st2, readback_http=st3,
        fields_written=[k for k in F4 if norm(b.get(k)) != norm(p[k])],
        untouched_fields_identical=not any('untouched' in f for f in fails), quote_block_identical='quote block differs' not in fails,
        result=res, rule41=f're-verified whole (title · preconditions · steps · expected · refs · section · type · automation status) '
                           f'against {PRD}; runnable against staging {MARK} NOT checked (the cases run after the feature lands)')
print('ALL VERIFIED' if ok_all else 'SOME FAILED OR REFUSED — read the log')
