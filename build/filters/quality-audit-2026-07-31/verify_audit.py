#!/usr/bin/env python3
"""Adversarial self-audit verifier for the Filters Ruthless Usefulness Audit (Rule 15, process step 7).

Independently re-derives every mechanical claim the audit makes and diffs it against the
delivered artefacts. Exits non-zero on ANY drift, so the audit cannot be shipped inconsistent.

Run:  python3 build/filters/quality-audit-2026-07-31/verify_audit.py
"""
import csv, json, glob, re, sys, subprocess, collections, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
CSV = os.path.join(HERE, 'per-case-verdicts.csv')
MD = os.path.join(HERE, 'USEFULNESS-AUDIT-2026-07-31.md')
PLAN = os.path.join(HERE, 'MERGE-PLAN.md')
CASES = os.path.join(ROOT, 'build', 'filters', 'cases', '*.json')
IDMAP = os.path.join(ROOT, 'build', 'filters', 'testrail-id-map.csv')
SNAPSHOT_SHA = '7eeb74548eae665f5ac5110512fddc0c8550db41'

fails, checks = [], []


def ck(name, ok, detail=''):
    checks.append((name, ok, detail))
    if not ok:
        fails.append(f'{name}: {detail}')


def norm(s):
    """Normalise dashes, curly quotes and whitespace runs so report prose (which wraps
    across lines) can be compared against single-line case-body text."""
    s = re.sub(r'[‐-―−]', '-', s)
    s = s.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    return re.sub(r'\s+', ' ', s).strip()


rows = list(csv.DictReader(open(CSV)))
md = open(MD).read()
plan = open(PLAN).read()

# --- population (Rule 17) ---
bodies = {}
for f in glob.glob(CASES):
    d = json.load(open(f))
    for c in (d if isinstance(d, list) else d.get('cases', [])):
        bodies[c['id']] = c
ck('population = 137 case bodies', len(bodies) == 137, f'found {len(bodies)}')
ck('CSV covers 100% of population, no extras',
   {r['internal_id'] for r in rows} == set(bodies),
   f"csv={len(rows)} bodies={len(bodies)}")

# --- tally reconciliation on BOTH scored dimensions ---
v = collections.Counter(r['verdict'] for r in rows)
s = collections.Counter(r['sense_verdict'] for r in rows)
ck('Dim1 sums to population', sum(v.values()) == len(bodies), dict(v))
ck('Dim2 sums to population', sum(s.values()) == len(bodies), dict(s))
ck('Dim1 uses only the 4 legal verdicts',
   set(v) <= {'KEEP', 'MERGE', 'WEAK-KEEP', 'CUT'}, str(set(v)))
ck('Dim2 uses only the 3 legal verdicts',
   set(s) <= {'SENSIBLE', 'FIX-WORDING', 'NONSENSE'}, str(set(s)))

# --- headline: recommended = KEEP + WEAK-KEEP (survivors are already KEEP) ---
recommended = v['KEEP'] + v['WEAK-KEEP']
ck('headline recommended count present in report',
   f'{len(bodies)} today → {recommended} recommended' in md or
   f'{len(bodies)} → {recommended}' in md, f'recommended={recommended}')

# --- merge integrity ---
survivors = {r['merge_survivor'] for r in rows if r['merge_survivor']}
groups = {r['merge_group'] for r in rows if r['merge_group']}
byid = {r['internal_id']: r for r in rows}
ck('every merge group names exactly one survivor', len(survivors) == len(groups),
   f'{len(groups)} groups / {len(survivors)} survivors')
ck('every survivor is itself KEEP (not double-counted)',
   all(byid.get(x, {}).get('verdict') == 'KEEP' for x in survivors),
   str([x for x in survivors if byid.get(x, {}).get('verdict') != 'KEEP']))
ck('every MERGE row carries group + survivor',
   not [r['internal_id'] for r in rows if r['verdict'] == 'MERGE'
        and not (r['merge_group'] and r['merge_survivor'])])
ck('no non-MERGE row carries a group unless it is a survivor',
   not [r['internal_id'] for r in rows if r['verdict'] != 'MERGE'
        and r['merge_group'] and r['internal_id'] not in survivors])
# every group and every non-KEEP case must be named in the approvable plan
ck('MERGE-PLAN names every group', not [g for g in groups if g not in plan])
ck('MERGE-PLAN names every MERGE/CUT/WEAK-KEEP case',
   not [r['internal_id'] for r in rows
        if r['verdict'] in ('MERGE', 'CUT', 'WEAK-KEEP') and r['internal_id'] not in plan])

# --- the embarrassment cross-check (must be empty) ---
emb = [r['internal_id'] for r in rows
       if r['verdict'] in ('KEEP', 'WEAK-KEEP') and r['sense_verdict'] == 'NONSENSE']
ck('KEEP-but-NONSENSE embarrassment check is EMPTY', not emb, str(emb))
ck('report states the embarrassment check explicitly',
   'KEEP-but-NONSENSE' in md and 'EMPTY' in md)

# --- every NONSENSE quotes its offending text verbatim from the case body ---
for r in rows:
    if r['sense_verdict'] != 'NONSENSE':
        continue
    cid = r['internal_id']
    ck(f'{cid}: NONSENSE listed in the report', cid in md)
    body = bodies[cid]
    blob = norm(' '.join(body.get('steps', []) + body.get('expected', [])
                         + body.get('preconditions', []) + [body.get('title', '')]))
    # The report quotes offending text in the italic-quote form *"..."* (and plain "..." inside
    # the FIX-WORDING table). Disallow markdown markers/pipes inside so quote marks are never
    # paired across sentences.
    mdn = norm(md)
    quoted = [norm(g) for g in re.findall(r'\*"([^"*|]{15,400})"\*', mdn)]
    quoted += [norm(g) for g in re.findall(r'"([^"*|]{15,400})"', mdn)]
    hits = [q for q in quoted if q in blob]
    ck(f'{cid}: report quotes its offending text verbatim from the case body', bool(hits),
       f'none of {len(quoted)} quoted fragments matched the body text')

# --- reasons are never blank (one plain sentence per case, both dimensions) ---
ck('no blank Dim1 reason', not [r['internal_id'] for r in rows if not r['reason'].strip()])
ck('no blank Dim2 reason', not [r['internal_id'] for r in rows if not r['sense_reason'].strip()])
dup_cuts = [r for r in rows if r['verdict'] == 'CUT' and 'duplicate' in r['reason'].lower()]
ck('every CUT-as-duplicate names the superseding case or owning suite',
   all(re.search(r'FLT-[A-Z]+-\d+|Global Search', r['reason']) for r in dup_cuts),
   str([r['internal_id'] for r in dup_cuts
        if not re.search(r'FLT-[A-Z]+-\d+|Global Search', r['reason'])]))
ck('every non-duplicate CUT still states a concrete reason',
   all(len(r['reason'].split()) >= 8 for r in rows
       if r['verdict'] == 'CUT' and r not in dup_cuts))

# --- Dimension 3: traceability + titles ---
no_ref = [r['internal_id'] for r in rows if r['refs_ok'] != 'yes']
ck('missing-traceability count matches the report (0)', not no_ref, str(no_ref))
# Rule 20 anchor = spec_ref / design_ref / refs on the case body (what gen_verdicts.py scores).
unanchored = [cid for cid, b in bodies.items()
              if not (str(b.get('spec_ref', '')).strip()
                      or str(b.get('design_ref', '')).strip()
                      or str(b.get('refs', '')).strip())]
ck('every case body carries a spec/design/tech-plan anchor (Rule 20)', not unanchored,
   str(unanchored))
ck('refs_ok column agrees with the case bodies',
   {r['internal_id'] for r in rows if r['refs_ok'] != 'yes'} == set(unanchored))
# the ticket half of Rule 20 is a known, disclosed gap on this project (epic key TBD)
ck('report discloses the Epic-key-TBD ticket gap rather than inventing a ticket',
   'TBD' in md and 'Epic key' in md)
long_titles = sorted(r['internal_id'] for r in rows if int(r['title_len']) > 80)
ck('title-length violators all listed in the report appendix',
   all(t in md for t in long_titles), f'{len(long_titles)} violators')
ck('report states the violator count', str(len(long_titles)) in md, len(long_titles))

# --- C-ids agree with the id-map (Rule 8) ---
idmap = {}
for r in csv.DictReader(open(IDMAP)):
    k = (r.get('internal_id') or '').strip()
    if k:
        idmap[k] = (r.get('testrail_case_id') or '').strip().lstrip('C')
mis = [(r['internal_id'], r['testrail_case_id'], idmap.get(r['internal_id']))
       for r in rows if r['internal_id'] in idmap
       and r['testrail_case_id'].strip().lstrip('C') != idmap[r['internal_id']]]
ck('C-ids match testrail-id-map.csv', not mis, str(mis[:3]))
blanks = sum(1 for r in rows if not r['testrail_case_id'].strip())
ck('blank-C-id count is the 43 design-level pending cases', blanks == 43, blanks)

# --- per-area tables in the report agree with the CSV (dash-normalised) ---
agg = collections.defaultdict(collections.Counter)
for r in rows:
    a = agg[norm(r['section'])]
    a['n'] += 1
    a[r['verdict']] += 1
    a['S:' + r['sense_verdict']] += 1
tbl = {}
for line in md.splitlines():
    m = re.match(r'\|\s*([A-Za-z][^|]*?)\s*\|' + r'\s*(\d+)\s*\|' * 8, line)
    if m:
        tbl[norm(m.group(1))] = [int(x) for x in m.groups()[1:]]
bad = []
for sec, c in agg.items():
    exp = [c['n'], c['KEEP'], c['MERGE'], c['WEAK-KEEP'], c['CUT'],
           c['S:SENSIBLE'], c['S:FIX-WORDING'], c['S:NONSENSE']]
    if tbl.get(sec) != exp:
        bad.append((sec, tbl.get(sec), exp))
ck('per-area verdict/sense table matches the CSV for all areas', not bad, str(bad))
ck('all 18 areas present in the report table',
   len([k for k in tbl if k in agg]) == len(agg), f'{len(agg)} areas in CSV')

# --- cross-project CUT claim: Global Search really does cover the component ---
gs = 0
for f in glob.glob(os.path.join(ROOT, 'build', 'global-search', 'cases', '*.json')):
    d = json.load(open(f))
    gs += len(d) if isinstance(d, list) else len(d.get('cases', []))
ck('Global Search suite size backs the 9-case cross-project CUT (86)', gs == 86, gs)

# --- snapshot integrity: case bodies unchanged since the SHA the report cites ---
try:
    out = subprocess.run(['git', '-C', ROOT, 'log', '--oneline', f'{SNAPSHOT_SHA}..HEAD',
                          '--', 'build/filters/cases/', 'build/filters/testrail-id-map.csv'],
                         capture_output=True, text=True, timeout=60).stdout.strip()
    ck('case bodies + id-map unchanged since the cited snapshot SHA', not out, out[:200])
except Exception as e:  # pragma: no cover
    ck('snapshot check ran', False, str(e))
ck('report cites the snapshot SHA', SNAPSHOT_SHA in md)

# --- report must carry the mandated narrative sections ---
for needle, label in [
        ('Is the critic right', 'honest is-the-critic-right answer'),
        ('exec paragraph', 'Rule-7 plain-words exec paragraph'),
        ('slop patterns', 'named slop patterns section'),
        ('Load-bearing coverage', 'load-bearing defence section'),
        ('RECOMMENDATION ONLY', 'recommendation-only guardrail'),
        ('FIX-WORDING list', 'FIX-WORDING repair list')]:
    ck(f'report contains the {label}', needle.lower() in md.lower())

print(f'ADVERSARIAL SELF-AUDIT — {len(checks)} checks')
for name, ok, detail in checks:
    print(f'  [{"PASS" if ok else "FAIL"}] {name}' + (f'  ({detail})' if detail and not ok else ''))
print()
if fails:
    print(f'RESULT: {len(fails)} DRIFT(S) FOUND')
    for f in fails:
        print('  -', f)
    sys.exit(1)
print(f'RESULT: CLEAN — 0 drift across {len(checks)} checks.')
print(f'  population 137 | Dim1 {dict(v)} | Dim2 {dict(s)}')
print(f'  headline 137 -> {recommended} recommended | {len(groups)} merge groups | '
      f'missing-traceability {len(no_ref)} | titles>80 {len(long_titles)}')
