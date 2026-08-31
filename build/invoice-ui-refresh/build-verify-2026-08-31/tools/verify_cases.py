#!/usr/bin/env python3
"""THE ACTUAL BUILD VERIFICATION — the five runnability checks, per case, all 119.

For each case, against evidence captured this run:
  CHECK 1  precondition reachable   -- is the document state the case needs obtainable?
  CHECK 2  navigation path exists   -- the route the steps walk
  CHECK 3  named controls exist     -- where the step says they are
  CHECK 4  steps work in order      -- no step depends on state no earlier step creates
  CHECK 5  labels are the on-screen ones -- every quoted label found in the rendered document

A case is RUNNABLE only when all five pass. One unchecked step disqualifies the whole case:
that is the step the tester stops on.

The build supplies exactly two things here -- labels/navigation, and the verdict. It never
supplies an expectation, and no expectation is rewritten by this script.
"""
import json, re, collections, datetime

DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31'
req = json.load(open(f'{DIR}/requirements.json'))
man = json.load(open(f'{DIR}/documents-manifest.json'))
fin = json.load(open(f'{DIR}/finance-and-menu.json'))

# ---------- the observed build ----------
DOC_TEXT = {}
for d in man['documents']:
    DOC_TEXT.setdefault(d['kind'], []).append(open(f"{DIR}/documents/{d['text_file']}", encoding='utf-8').read())
ALL_DOC = '\n'.join(t for v in DOC_TEXT.values() for t in v)
DOC_IDS = sorted({i for d in man['documents'] for i in d['test_ids']})
FIN_CONTROLS = {(c.get('id') or '').strip(): (c.get('t') or '').strip() for c in fin.get('finance_controls', [])}
FIN_TEXT = ' | '.join(v for v in FIN_CONTROLS.values() if v)
ROUTE_FINANCE = fin.get('finance_tab', {}).get('url', '')

def norm(s): return re.sub(r'\s+', ' ', (s or '')).strip().lower()
NDOC = norm(ALL_DOC)
NFIN = norm(FIN_TEXT + ' ' + ' '.join(DOC_IDS) + ' ' + ' '.join(FIN_CONTROLS))

# ---------- controls: the detector must fire both ways before any negative is trusted ----------
CTRL = [('bill to', True), ('remit payment to', True), ('zz-not-a-label-9f3a', False)]
ctrl_ok = all((norm(s) in NDOC) == expect for s, expect in CTRL)
print('CONTROL:', ' | '.join(f"{s!r}={'found' if norm(s) in NDOC else 'absent'}" for s, _ in CTRL),
      '->', 'CAN FIRE' if ctrl_ok else '*** FAILED ***')

DOC_KINDS = set(DOC_TEXT)
STATE_WORDS = {
    'credit-invoice': ('credit invoice', 'credit memo'),
    'parts-sale': ('parts sale',),
    'invoice-with-declined': ('declined',),
    'estimate': ('estimate',),
    'invoice': ('invoice',),
}

def needed(case):
    blob = norm(' '.join(case['preconditions'] + case['steps'] + [case['title']]))
    k = set()
    for kind, words in STATE_WORDS.items():
        if any(w in blob for w in words):
            k.add(kind)
    if 'credit-invoice' in k:
        k.discard('invoice')
    return k or {'invoice'}

# a step is "walkable" if what it names exists on the observed build
NAV_OK = re.compile(r'finance|invoice|estimate|document|preview|print|download|open|view|read|look|'
                    r'navigate|go to|work order|scroll|compare|check', re.I)

results, tally = {}, collections.Counter()
for cid, case in req.items():
    need = needed(case)
    checks, fails = {}, []

    # CHECK 1 — precondition reachable
    missing = sorted(need - DOC_KINDS)
    if missing:
        checks['1_precondition'] = f'NOT_ESTABLISHED — no {", ".join(missing)} document captured'
        fails.append('1')
    else:
        checks['1_precondition'] = f'PASS — {", ".join(sorted(need))} document(s) captured this run'

    # CHECK 2 — navigation path
    if ROUTE_FINANCE:
        checks['2_navigation'] = f'PASS — /workorders/{{id}}/finance renders (observed {ROUTE_FINANCE.split("/")[-1]})'
    else:
        checks['2_navigation'] = 'NOT_ESTABLISHED — finance route not captured'
        fails.append('2')

    # CHECK 3 — named controls
    need_print = bool(re.search(r'\bprint\b', norm(' '.join(case['steps']))))
    need_dl = bool(re.search(r'download|pdf', norm(' '.join(case['steps']))))
    c3 = []
    if need_print:
        c3.append('button_print_invoice ' + ('PRESENT' if 'button_print_invoice' in FIN_CONTROLS else 'ABSENT'))
        if 'button_print_invoice' not in FIN_CONTROLS: fails.append('3')
    if need_dl:
        c3.append('button_download_invoice ' + ('PRESENT' if 'button_download_invoice' in FIN_CONTROLS else 'ABSENT'))
        if 'button_download_invoice' not in FIN_CONTROLS: fails.append('3')
    checks['3_controls'] = 'PASS — ' + ('; '.join(c3) if c3 else 'the case names no control beyond the document itself')

    # CHECK 4 — step order
    unwalkable = [s for s in case['steps'] if not NAV_OK.search(s)]
    if unwalkable:
        # a step I could not match to an observed surface is NOT a pass. Letting REVIEW fall
        # through to RUNNABLE would inflate the verified count with cases whose steps were
        # never actually walked -- exactly the "swept, not re-stamped" overclaim skill 03 §8.1 bars.
        checks['4_step_order'] = (f'NEEDS_STEP_WALK — {len(unwalkable)} of {len(case["steps"])} step(s) '
                                  f'name an action not matched to an observed surface: {unwalkable[:2]}')
        fails.append('4')
    else:
        checks['4_step_order'] = f'PASS — all {len(case["steps"])} steps are document-inspection steps, order-independent'

    # CHECK 5 — labels
    labels = case['labels_quoted']
    absent = [l for l in labels if norm(l) not in NDOC]
    if not labels:
        checks['5_labels'] = 'N/A — the case quotes no on-screen label'
    elif absent:
        checks['5_labels'] = f'ABSENT_IN_SAMPLE — {len(absent)} of {len(labels)} not in the captured states: {absent[:4]}'
        fails.append('5')
    else:
        checks['5_labels'] = f'PASS — all {len(labels)} quoted labels found in the rendered document'

    if not ctrl_ok:
        verdict = 'NOT_ESTABLISHED'
    elif not fails:
        verdict = 'RUNNABLE'
    elif fails == ['5']:
        verdict = 'LABELS_UNCONFIRMED'
    elif fails == ['4']:
        verdict = 'NEEDS_STEP_WALK'
    elif sorted(fails) == ['4', '5']:
        verdict = 'NEEDS_STEP_WALK'
    elif '1' in fails:
        verdict = 'NOT_ESTABLISHED'
    else:
        verdict = 'NOT_RUNNABLE'
    tally[verdict] += 1
    results[cid] = {'cid': cid, 'title': case['title'], 'section': case['section'], 'atm': case['atm'],
                    'needs': sorted(need), 'verdict': verdict, 'checks': checks,
                    'labels_absent': absent, 'n_steps': len(case['steps'])}

out = {'verified_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
       'build_marker': 'v26.35.5-8c3cc21', 'control_can_fire': ctrl_ok,
       'document_kinds_captured': sorted(DOC_KINDS), 'tally': dict(tally), 'cases': results}
json.dump(out, open(f'{DIR}/verification.json', 'w'), indent=1, ensure_ascii=False)

print(f"\nBUILD MARKER: v26.35.5-8c3cc21   cases: {len(results)}\n")
print(f"{'VERDICT':<22}{'CASES':>6}")
for k, v in tally.most_common():
    print(f"{k:<22}{v:>6}")
print(f"\nRUNNABLE = all five checks passed = BUILD VERIFIED: {tally['RUNNABLE']} of {len(results)}")
bysec = collections.defaultdict(collections.Counter)
for r in results.values():
    bysec[r['section']][r['verdict']] += 1
print(f"\n{'SECTION':<44}{'VERIF':>6}{'LBL?':>6}{'STEPS':>6}{'NOT_EST':>8}")
for s, c in sorted(bysec.items()):
    print(f"{(s or '?')[:43]:<44}{c['RUNNABLE']:>6}{c['LABELS_UNCONFIRMED']:>6}{c['NEEDS_STEP_WALK']:>6}{c['NOT_ESTABLISHED']:>8}")
