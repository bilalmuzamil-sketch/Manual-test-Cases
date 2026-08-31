#!/usr/bin/env python3
"""Per-case build evaluation against the OBSERVED documents. 119 cases, no sampling.

WHAT THIS DOES AND DOES NOT DO
  It checks, per case, whether the things the case sends a tester to actually EXIST on the
  build: the on-screen labels it quotes, the document type it needs, the data state its
  preconditions demand. That is runnability (skill 03's five checks), and it is the build's
  only two permitted contributions -- labels/navigation and the verdict.

  It NEVER decides what a case should expect. Where a label the case quotes is absent, the
  output is a DIVERGENCE for a human to classify cosmetic vs substantive -- never a rewrite,
  because rewriting a substantive gap into a runnable step deletes the finding (skill 03).

HONESTY MECHANICS
  * every label check runs against a CONTROL: the same corpus is asked for a string that must
    be present and one that must be absent, so a detector that cannot fire is caught before
    its negatives are believed (skill 03 section 2).
  * a case whose needed document type was never captured is NOT_ESTABLISHED, never ABSENT.
  * verdicts are provisional (core 16.0 -- the branches are not final).
"""
import json, re, os, html, collections, datetime

DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31'
man = json.load(open(f'{DIR}/documents-manifest.json'))
req = json.load(open(f'{DIR}/requirements.json'))

# ---- the observed corpus, per document kind ----
corpus = {}
for d in man['documents']:
    txt = open(f"{DIR}/documents/{d['text_file']}", encoding='utf-8').read()
    corpus.setdefault(d['kind'], []).append({'wo': d['wo_number'], 'text': txt, 'ids': d['test_ids']})
ALL_TEXT = '\n'.join(c['text'] for v in corpus.values() for c in v)
ALL_IDS = sorted({i for v in corpus.values() for c in v for i in c['ids']})


def norm(s):
    return re.sub(r'\s+', ' ', (s or '')).strip().lower()


NORM_ALL = norm(ALL_TEXT)

# ---- CONTROL: prove the detector can fire in both directions ----
CTRL_PRESENT = 'bill to'            # verified by eye in the captured documents
CTRL_ABSENT = 'zzautotest-not-a-real-label-9f3a'
ctrl_ok = (CTRL_PRESENT in NORM_ALL) and (CTRL_ABSENT not in NORM_ALL)
print(f"CONTROL: '{CTRL_PRESENT}' present={CTRL_PRESENT in NORM_ALL} | "
      f"'{CTRL_ABSENT[:20]}…' absent={CTRL_ABSENT not in NORM_ALL} -> "
      f"{'DETECTOR CAN FIRE' if ctrl_ok else '*** CONTROL FAILED — every result below is NOT_ESTABLISHED ***'}")

# which document kinds a case needs, inferred from its own words
def needed_kinds(case):
    blob = norm(' '.join(case['preconditions'] + case['steps'] + [case['title']]))
    k = set()
    if 'credit invoice' in blob:
        k.add('credit-invoice')
    if 'estimate' in blob:
        k.add('estimate')
    if 'invoice' in blob and 'credit invoice' not in blob:
        k.add('invoice')
    if 'declined' in blob:
        k.add('invoice-with-declined')
    if 'parts sale' in blob:
        k.add('parts-sale')
    return k or {'invoice'}


AVAILABLE = set(corpus)
results = {}
tally = collections.Counter()
for cid, case in req.items():
    labels = case['labels_quoted']
    need = needed_kinds(case)
    missing_kinds = sorted(need - AVAILABLE)

    found, absent = [], []
    for l in labels:
        (found if norm(l) in NORM_ALL else absent).append(l)

    if not ctrl_ok:
        verdict, why = 'NOT_ESTABLISHED', 'the label detector failed its own control'
    elif missing_kinds:
        verdict, why = 'NOT_ESTABLISHED', f"needs a document type not captured: {', '.join(missing_kinds)}"
    elif not labels:
        verdict, why = 'NO_LABELS_TO_CHECK', 'the case quotes no on-screen label; runnability turns on its steps alone'
    elif not absent:
        verdict, why = 'LABELS_ALL_PRESENT', f'all {len(labels)} quoted labels found in the rendered document'
    else:
        verdict, why = 'LABEL_DIVERGENCE', f'{len(absent)} of {len(labels)} quoted labels not found'
    tally[verdict] += 1
    results[cid] = {
        'cid': cid, 'title': case['title'], 'section': case['section'],
        'atm': case['atm'], 'needs': sorted(need), 'missing_document_kinds': missing_kinds,
        'labels_total': len(labels), 'labels_found': found, 'labels_absent': absent,
        'verdict': verdict, 'why': why,
    }

json.dump({'evaluated_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
           'control_can_fire': ctrl_ok, 'document_kinds_available': sorted(AVAILABLE),
           'document_test_ids': ALL_IDS, 'tally': dict(tally), 'cases': results},
          open(f'{DIR}/evaluation.json', 'w'), indent=1, ensure_ascii=False)

print(f"\ncases evaluated: {len(results)} (no sampling)")
for k, v in tally.most_common():
    print(f"  {k:<22} {v}")
print(f"\ndocument kinds captured : {sorted(AVAILABLE)}")
print(f"document kinds NEEDED but not captured: "
      f"{sorted({m for r in results.values() for m in r['missing_document_kinds']})}")

# the labels most often absent — these are the divergence candidates
absent_freq = collections.Counter()
for r in results.values():
    for l in r['labels_absent']:
        absent_freq[l] += 1
print(f"\nmost-cited labels NOT found in the rendered documents ({len(absent_freq)} distinct):")
for l, n in absent_freq.most_common(25):
    print(f"   {n:>3}x  {l!r}")
