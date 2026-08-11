"""Partition the 85 asserted UI strings by whether spec v27 pins the wording.

This is what decides CLASS for any mismatch the build later shows:
  in-spec + Expected Results  -> class B candidate (spec wins, build differing = deviation)
  in-spec + Steps/Preconds    -> class A (build wins; spec wording is a cross-check only)
  not in spec                 -> class A or C (the build decides outright)

Exact-case and case-insensitive are reported SEPARATELY: a case-only difference is
itself a finding (our case asserts a capitalisation the document does not support).
"""
import json, re, collections

spec = json.load(open('/home/user/Manual-test-Cases/build/schedule/'
                     'coverage-rederivation-2026-08-10/evidence/extract-v27.json'))
blob = '\n'.join((r['text'] or '') for r in spec)
# section lookup for reporting
def where(s):
    out = []
    for r in spec:
        if s.lower() in (r['text'] or '').lower():
            out.append(r['section'] or '-')
    return sorted(set(out))[:4]

rows = json.load(open('/tmp/sched-bv/labels.json'))
byl = collections.defaultdict(list)
for r in rows:
    byl[r['label']].append(r)

exact, ci_only, absent = [], [], []
for lab, rs in sorted(byl.items()):
    fields = sorted({r['field'].replace('custom_', '') for r in rs})
    cases = sorted({r['case'] for r in rs})
    rec = (lab, fields, cases, where(lab))
    if lab in blob:
        exact.append(rec)
    elif lab.lower() in blob.lower():
        ci_only.append(rec)
    else:
        absent.append(rec)

def dump(title, recs, note):
    print('\n' + '=' * 78)
    print(f'{title}  ({len(recs)} strings)')
    print(note)
    print('=' * 78)
    for lab, fields, cases, secs in recs:
        star = ' <<< IN EXPECTED RESULTS' if 'expected' in fields else ''
        print(f'  {lab!r}')
        print(f'      fields={",".join(fields)}  §{",".join(secs) if secs else "-"}  '
              f'cases={["C%d"%c for c in cases]}{star}')

dump('A · SPEC PINS THE WORDING EXACTLY', exact,
     'Our text matches spec v27 byte-for-byte. Safe. If the build differs and the string is\n'
     'in Expected Results, that is class B -> the case STANDS and the build deviates.')
dump('B · SPEC HAS IT, BUT OUR CAPITALISATION DIFFERS', ci_only,
     'Our case asserts a capitalisation the document does not use. Where this sits in\n'
     'Expected Results it is a class-B candidate defect IN OUR CASE (Report Suite C30452 shape).')
dump('C · NOT IN THE SPEC AT ALL', absent,
     'No document pins these, so the BUILD decides outright (class A in steps, class C in\n'
     'expected). Every one needs a live read - none can be settled from documents.')

json.dump({'exact': exact, 'ci_only': ci_only, 'absent': absent},
          open('/tmp/sched-bv/partition.json', 'w'), indent=1)
print(f'\n\nTOTALS  spec-exact {len(exact)} | case-differs {len(ci_only)} | '
      f'absent-from-spec {len(absent)} | = {len(exact)+len(ci_only)+len(absent)}')
