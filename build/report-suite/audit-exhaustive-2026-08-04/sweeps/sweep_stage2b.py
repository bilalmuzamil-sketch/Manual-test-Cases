#!/usr/bin/env python3
"""Stage-2b cross-case consistency sweeps over the Report Suite (read-only).
Four helpers per build/RUTHLESS-USEFULNESS-AUDIT-PROCESS.md:
  (i)   opposite-assertion keyword-pair scan over control groups
  (ii)  TITLE vs EXPECTED scan, every case
  (iii) same-refs-anchor expectation diff
  (iv)  surface-split check (Rule 40)
Input: the case corpus produced from build/report-suite/cases/*.json (active only).
Exit 0 always; this is a reporting tool, judgement stays with the auditor."""
import json, re, sys, glob, os, csv, collections

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))
def load():
    idmap = {r['internal_id']: r for r in csv.DictReader(
        open(os.path.join(ROOT, 'build/report-suite/testrail-id-map.csv')))}
    out = []
    for f in sorted(glob.glob(os.path.join(ROOT, 'build/report-suite/cases/*.json'))):
        for c in json.load(open(f)):
            if c['viu_status'] != 'VIU-Pending':
                continue
            m = idmap.get(c['id'], {})
            c['cid'] = m.get('testrail_case_id', '')
            out.append(c)
    return out

def flat(x):
    return ' | '.join(map(str, x)) if isinstance(x, list) else str(x)

CONTROLS = {
    'location-filter':      r'location filter',
    'location-column':      r'location column',
    'column-selector':      r'column[- ]selection control|column selector|column picker',
    'date-range-control':   r'date[- ]range (control|picker|selector)|date range picker',
    'export-menu':          r'overflow (menu|button)|three-dot|export menu',
    'empty-state':          r'empty[- ]state|no-data message|Empty bays',
    'totals-row':           r'totals row|Totals row|grand totals',
    'pinned-subtotal':      r'Subtotal column|Total Cost column|Total column',
    'saved-view':           r'saved view|remembered|persist',
    'expansion-chevron':    r'chevron|expand[- ]all|collapse[- ]all',
    'status-badge':         r'status badge|badge',
    'sort-header':          r'header click|column header|sort indicator|aria-sort',
    'info-icon':            r'info(rmation)? icon',
    'dark-mode':            r'dark mode',
    'loading-indicator':    r'loading indicator|spinner|loading state',
}
OPPOSITES = [
    ('hidden',   r'\bhidden\b|\bnot shown\b|\bis not shown\b|\babsent\b|\bnever shown\b'),
    ('shown',    r'\bis shown\b|\bappears\b|\bIS shown\b|\bdisplayed\b'),
    ('disabled', r'\bdisabled\b|\bgreyed out\b|\bgrayed out\b|\bnon-interactive\b'),
    ('enabled',  r'\benabled\b|\binteractive\b|\bclickable\b'),
    ('automatic',r'\bautomatic\b|\bon its own\b|\bby itself\b|\bappears and disappears on its own\b'),
    ('manual',   r'\bturn(ed)? (it )?on\b|\bswitch it on\b|\byou have to switch\b|\bfollows that toggle\b'),
    ('persists', r'\bpersists?\b|\bis remembered\b|\brestored\b|\bstays\b'),
    ('resets',   r'\bresets?\b|\bis cleared\b|\bcollapsed again\b|\bnot persisted\b|\bnot remembered\b'),
    ('reload',   r'\breloads?\b|\bre-?fetch\b|\bserver request\b'),
    ('noreload', r'\bno reload\b|\bwithout a page reload\b|\bon screen only\b|\bNO server request\b|\bzero server calls\b'),
]

def main():
    cases = load()
    print(f'# Stage-2b cross-case consistency sweeps — {len(cases)} active cases\n')

    # ---- (ii) TITLE vs EXPECTED, every case -------------------------------
    print('## Helper (ii) — TITLE vs EXPECTED, all cases scanned')
    NEG = re.compile(r'\b(no|not|never|hidden|absent|without|excluded|cannot|non-)\b', re.I)
    flagged = []
    for c in cases:
        t, e = c['title'], flat(c['expected'])
        tneg, eneg = bool(NEG.search(t)), bool(NEG.search(e))
        # a negative-polarity title whose expected carries no negation at all
        if tneg and not eneg:
            flagged.append((c['id'], c['cid'], 'title asserts a negative the expected never states', t))
        # a title naming a control the expected never mentions
        for key, pat in CONTROLS.items():
            if re.search(pat, t, re.I) and not re.search(pat, e, re.I):
                flagged.append((c['id'], c['cid'], f'title names "{key}" but the expected never mentions it', t))
    print(f'scanned: {len(cases)} / flagged: {len(flagged)}')
    for i, cid, why, t in flagged:
        print(f'  {i:16} {cid:8} {why}\n      title: {t}')
    print()

    # ---- (i) opposite-assertion keyword pairs over control groups --------
    print('## Helper (i) — opposite-assertion keyword-pair scan over control groups')
    groups = collections.defaultdict(list)
    for c in cases:
        face = c['title'] + ' | ' + flat(c['preconditions']) + ' | ' + flat(c['steps']) + ' | ' + flat(c['expected'])
        for key, pat in CONTROLS.items():
            if re.search(pat, face, re.I):
                groups[key].append((c, face))
    pairs = [('hidden', 'shown'), ('disabled', 'enabled'), ('automatic', 'manual'),
             ('persists', 'resets'), ('reload', 'noreload')]
    for key in sorted(groups):
        members = groups[key]
        present = {}
        for label, pat in OPPOSITES:
            present[label] = [c['id'] for c, face in members if re.search(pat, face, re.I)]
        both = [(a, b) for a, b in pairs if present[a] and present[b]]
        tag = 'BOTH SIDES PRESENT' if both else 'no opposite pair'
        print(f'  {key:20} n={len(members):3}  {tag}')
        for a, b in both:
            print(f'      {a}: {", ".join(present[a][:8])}{" …" if len(present[a])>8 else ""}')
            print(f'      {b}: {", ".join(present[b][:8])}{" …" if len(present[b])>8 else ""}')
    print()

    # ---- (iii) same-refs-anchor clusters ---------------------------------
    print('## Helper (iii) — same-anchor clusters (cases sharing a spec anchor)')
    ANCH = re.compile(r'\bS\d+-(?:R|N|E)\d+[a-z]?\b')
    byanchor = collections.defaultdict(list)
    for c in cases:
        for a in set(ANCH.findall(c.get('spec_ref', ''))):
            byanchor[(c['id'].split('-')[0], a)].append(c['id'])
    multi = {k: v for k, v in byanchor.items() if len(v) > 1}
    print(f'anchors total: {len(byanchor)} / shared by >1 case: {len(multi)}')
    for (rep, a), ids in sorted(multi.items()):
        print(f'  {rep:4} {a:10} -> {", ".join(sorted(ids))}')
    print()

    # ---- (iv) surface-split check ---------------------------------------
    print('## Helper (iv) — SURFACE-SPLIT CHECK (Standing Rule 40)')
    SURF = {
        'screen': r'on screen|the table|the row|the column|the report shows',
        'csv':    r'\bCSV\b',
        'pdf':    r'\bPDF\b',
        'api':    r'\bAPI\b|endpoint|network panel|HTTP',
        'mobile': r'phone|viewport|touch|mobile',
        'selector': r'column[- ]selection control|column selector|column picker',
        'empty':  r'empty[- ]state|no-data message',
    }
    rows = []
    for (rep, a), ids in sorted(multi.items()):
        cov = collections.defaultdict(list)
        for i in ids:
            c = next(x for x in cases if x['id'] == i)
            face = c['title'] + ' | ' + flat(c['steps']) + ' | ' + flat(c['expected'])
            for s, pat in SURF.items():
                if re.search(pat, face, re.I):
                    cov[s].append(i)
        rows.append((rep, a, ids, dict(cov)))
    # report only anchors whose cluster names an export surface in ANY member
    print('anchors whose cluster mentions an export surface — screen/CSV/PDF coverage:')
    gaps = 0
    for rep, a, ids, cov in rows:
        if not (cov.get('csv') or cov.get('pdf')):
            continue
        missing = [s for s in ('screen', 'csv', 'pdf') if not cov.get(s)]
        mark = 'GAP: ' + ','.join(missing) if missing else 'screen+csv+pdf all covered'
        if missing:
            gaps += 1
        print(f'  {rep:4} {a:10} {mark:34} members: {", ".join(sorted(ids))}')
    print(f'\nclusters with an export surface but a missing sibling surface: {gaps}')
    return 0

if __name__ == '__main__':
    sys.exit(main())
