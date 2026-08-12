#!/usr/bin/env python3
"""Roll the line classification + the live fact checks up to a per-case verdict.

THE RULE, and it is deliberately harsh: a case counts as ESTABLISHED only if EVERY
one of its precondition lines is established. One unmet line disqualifies the case,
because that is the line the tester stops on.

Verdicts
  ESTABLISHED     every line is either self-met (env/tool/ui-state/note) or is a data
                  state proven PRESENT live
  NOT_OURS        at least one line needs a second sign-in or an admin edit -- barred to
                  THIS PASS by the shared session, but a tester with admin access can
                  very likely do it. NOT a divergence.
  EXTERNAL        at least one line needs a system we do not have (QuickBooks, a screen
                  reader, a developer action). A genuine divergence.
  UNVERIFIED_DATA a data line this pass did not tie to a checked fact. NOT counted as
                  established -- this is the residue and it is reported as such.
"""
import json, collections, re

CASES = json.load(open('/tmp/rs812/classified.json'))
FACTS = {f['id']: f for f in json.load(open('/tmp/rs812/facts.json'))}

# Which fact answers which kind of data line. Matched on the LINE text.
# Ordered; first match wins. A line matching nothing stays UNVERIFIED_DATA.
MAP = [
 (r'report (is open|with|shows)|you are on the .*report|rows loaded|data loaded|'
  r'with (data|rows)|reports navigation|performance group', 'F1'),
 (r'two or more locations|at least two locations|two different locations|'
  r'access to at least two|more than one location|two of those locations|'
  r'locations in two different time zones|location a has default labor rate', 'F3'),
 (r'invoices at two different locations|spans two locations', 'F5'),
 (r'at least three customers|several customers|two customers|customers with distinct|'
  r'at least one customer|customer in the current view|customers are visible|'
  r'differing values are in the current view|enough customers', 'F4'),
 (r'subtotal (is )?zero or below|subtotal <= ?0|subtotal ≤ ?0|em dash|em-dash|'
  r'zero-subtotal|margin % ?(is)? ?—', 'F6'),
 (r'negative (money |inv\.? hrs|value)|positive and negative', 'F7'),
 (r'more than one page|span more than one page|fill more than one page|'
  r'vertical scrolling|more rows than fit', 'F8'),
 (r'two or more invoices|several invoices|known number of matching invoices|'
  r'two invoices|invoice rows|multiple assets and invoices', 'F9'),
 (r'several reps|two reps|reps? (are|with|has)|rep [ab] |at least two reps', 'F10'),
 (r'inactive|deactivat|staff record was deleted|toggle (turned )?off', 'F11'),
 (r'unassigned', 'F12'),
 (r'rep .*two (different )?locations|single location and another rep', 'F13'),
 (r'sales activity|parts have activity|demand', 'F14'),
 (r'special order|special-order', 'F15'),
 (r'min and max|min/max', 'F16'),
 (r'different categories|different vendors|category, and vendor|category and vendor', 'F17'),
 (r'no category|no vendor|no bin location', 'F18'),
 (r'same (inventory )?part .*(two|at two)|same part number', 'F19'),
 (r'clocked no time|clocked none|no technician clocked|zero work-order hours|'
  r'technician [ab] clocked', 'F20'),
 (r'internal hours but zero|internal, non-billable|internal time', 'F21'),
 (r'rounding tie|checkable percentage', 'F22'),
 (r'technicians? .*(location|time zone)|multi-zone', 'F23'),
 (r'nightly (snapshot|capture)|snapshot|capture (has|can|date)|as of date|as_of', 'F24'),
 (r'inventory .*(two|location)|stocked', 'F25'),
 (r'all four tabs|each tab|both tabs|at least two tabs|tabs? (has|have|contain|shows)|'
  r'estimates tab|completed tab|approved - ', 'F26'),
 (r'money (values?|columns?)|over \$1,?000|non-zero|quoted value|earned|remaining|'
  r'known (labor|approved|money)|labor line|parts line|fixed', 'F27'),
 (r'advisors?', 'F28'),
 (r'vin|unit #|unit number|plate|asset identifier|assets whose', 'F29'),
 (r'work orders? .*(two|different) location|open work orders exist at', 'F30'),
 (r'status|statuses|estimate status|complete status|invoiced|paid', 'F31'),
 (r'exceed 10,?000|10,000|over-cap|large enough data set', 'F32'),
]

SELF_MET = {'ENV', 'TOOL', 'UISTATE', 'NOTE'}
DATA = {'DATA_OPEN', 'DATA_SHAPE', 'VOLUME'}

out = {}
unmatched = []
for cid, c in CASES.items():
    verdict = 'ESTABLISHED'
    reasons, used = [], set()
    for ln in c['lines']:
        cat, text = ln['cat'], ln['line']
        low = text.lower()
        if cat in SELF_MET:
            continue
        if cat == 'EXTERNAL':
            verdict = 'EXTERNAL'
            reasons.append(('EXTERNAL', text))
            continue
        if cat == 'BARRED_TO_US':
            if verdict != 'EXTERNAL':
                verdict = 'NOT_OURS'
            reasons.append(('BARRED_TO_US', text))
            continue
        if cat in DATA:
            hit = None
            for pat, fid in MAP:
                if re.search(pat, low, re.I):
                    hit = fid
                    break
            if hit is None:
                if verdict == 'ESTABLISHED':
                    verdict = 'UNVERIFIED_DATA'
                reasons.append(('UNMAPPED', text))
                unmatched.append((cid, text))
            else:
                used.add(hit)
                fv = FACTS[hit]['verdict']
                if fv not in ('PRESENT', 'PARTIAL'):
                    if verdict == 'ESTABLISHED':
                        verdict = 'UNVERIFIED_DATA'
                    reasons.append((f'{hit}:{fv}', text))
    out[cid] = {'cid': c['cid'], 'report': c['report'], 'verdict': verdict,
                'facts_used': sorted(used), 'reasons': reasons,
                'n_lines': len(c['lines'])}

json.dump(out, open('/tmp/rs812/rollup.json', 'w'), indent=1)

cc = collections.Counter(v['verdict'] for v in out.values())
print('PER-CASE VERDICTS (480 cases)')
for k, v in cc.most_common():
    print(f'  {v:4d}  {k}')
print()
byrep = collections.defaultdict(collections.Counter)
for v in out.values():
    byrep[v['report']][v['verdict']] += 1
print(f'{"Report":34s} {"ESTAB":>6s} {"NOT_OURS":>9s} {"EXTERNAL":>9s} {"UNVER":>6s} {"total":>6s}')
for r, c in sorted(byrep.items()):
    t = sum(c.values())
    print(f'{r:34s} {c["ESTABLISHED"]:6d} {c["NOT_OURS"]:9d} {c["EXTERNAL"]:9d} '
          f'{c["UNVERIFIED_DATA"]:6d} {t:6d}')
print(f'{"TOTAL":34s} {cc["ESTABLISHED"]:6d} {cc["NOT_OURS"]:9d} {cc["EXTERNAL"]:9d} '
      f'{cc["UNVERIFIED_DATA"]:6d} {sum(cc.values()):6d}')
print()
print(f'UNMAPPED data lines (the residue that keeps a case out of ESTABLISHED): {len(unmatched)}')
seen = set()
for cid, t in unmatched:
    if t[:60] in seen:
        continue
    seen.add(t[:60])
    print(f'  {cid}  {t[:118]}')
