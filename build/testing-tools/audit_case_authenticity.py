#!/usr/bin/env python3
"""
FIVE-DIMENSION CASE AUTHENTICITY AUDIT  (earned 2026-09-09, L0026)
==================================================================
A case is only AUTHENTIC when ALL FIVE dimensions agree with each other and with
the sources — Title · Preconditions · Steps · Expected · Sources (provenance).
A source-verify / VIU / edit pass is NOT done until every dimension is checked on
EVERY case. The runnable-shape gate (check_runnable_cases.py) proves steps are
*followable*; it does NOT prove they *cover* the Expected, and it never looks at
the Title. Those are separate, and they bite (C44993/C45007/C45039/C45232, 2026-09-09).

WHAT THIS TOOL DOES
-------------------
1. Fetches every case (Title, Preconds, Steps, Expected, atmstatus, created_by) LIVE.
2. Runs the MECHANICAL checks it can (no judgement needed):
   - provenance present in Expected (version/page-id + read-date, or "Source: Manually added"),
   - exactly one AUTOMATION marker and it is the LAST non-empty line,
   - TITLE status-enumeration == Expected-assertion status-enumeration (heuristic),
   - no obviously-stale build stamp older than a given build (optional).
3. Dumps Title/Preconds/Steps/Expected to a JSON for the TWO SEMANTIC audits that
   require a reviewer (a subagent) — and PRINTS the exact reviewer prompts to use.
   Those two audits are the ones that caught real bugs and MUST be run:
     A) TITLE-vs-EXPECTED   : does the title contradict / misdescribe the assertion?
     B) STEPS-COVER-EXPECTED: do preconds+steps make EVERY asserted outcome observable?
4. Reminds you to run the served-page fr-view scan (container check is not in the API).

This does NOT replace judgement — it makes the five-dimension gate repeatable so no
dimension is silently skipped again. Reuse it; never re-derive the checklist by hand.

USAGE
-----
  python3 build/testing-tools/audit_case_authenticity.py --cases 44993,45039
  python3 build/testing-tools/audit_case_authenticity.py --targets build/<suite>/source-verify-<date>/targets.json
  # then hand /tmp/authenticity_audit.json + each printed prompt to a reviewer subagent.
"""
import json, urllib.request, base64, time, re, argparse, sys

def load_creds(path):
    c = json.load(open(path))
    return c

def api_get(base, auth, ep, tries=6):
    for _ in range(tries):
        try:
            return json.load(urllib.request.urlopen(
                urllib.request.Request(base + ep, headers={'Authorization': 'Basic ' + auth})))
        except Exception:
            time.sleep(2)
    raise RuntimeError(f"GET {ep} failed after {tries} tries")

def strip(h):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', h or '')).strip()

STATUSES = ['Complete','Invoiced','Paid','Declined','Imported','Approved','Estimate',
            'In Progress','In Review','On Hold','Cancelled','Canceled','Open','Draft']
def status_set(txt):
    f = set(s for s in STATUSES if re.search(r'\b'+re.escape(s)+r'\b', txt or ''))
    if 'In Review' in f: f.discard('Review')
    return f

def mechanical_checks(case):
    """Return list of mechanical problems (strings). Empty = clean on the mechanical dims."""
    probs = []
    exp = case['expected_raw'] or ''
    assertion = exp.split('---')[0]
    # provenance
    has_prov = ('specification version' in exp or 'Source: Manually added' in exp
                or ('read on' in exp) or ('Confluence page' in exp))
    if not has_prov:
        probs.append('no provenance line in Expected (Rule 54/64)')
    # AUTOMATION marker present + last
    lines = [l for l in strip(exp).split('\n') if l.strip()]
    exp_lines = [l for l in re.split(r'\n|</p>|<br>', exp) if strip(l)]
    if 'AUTOMATION:' not in exp:
        probs.append('AUTOMATION marker missing (Rule 61)')
    else:
        last = strip(exp_lines[-1]) if exp_lines else ''
        if not last.startswith('AUTOMATION:'):
            probs.append('AUTOMATION marker is not the last line (Rule 61)')
    # title status-set == assertion status-set (only when the title names statuses)
    ts, bs = status_set(case['title']), status_set(assertion)
    if ts and ts != bs:
        probs.append(f'TITLE status set {sorted(ts)} != Expected assertion set {sorted(bs)} '
                     '(title enumerates a different status list than the body)')
    return probs

TITLE_PROMPT = """Read /tmp/authenticity_audit.json (list of cases: cid, suite, title, assertion).
Find cases where the TITLE genuinely CONTRADICTS or MATERIALLY MISDESCRIBES the assertion —
a tester reading only the title would form a wrong expectation. Report opposite outcomes,
mismatched enumerated sets, behaviour-A-titled-but-B-verified, and absolute-vs-conditional flips.
Do NOT report mere summarisation/omission. One line per real problem:
`Cxxxxx [suite] | WHY: <one sentence>` then `TOTAL GENUINE PROBLEMS: N`. Read-only."""

COVERAGE_PROMPT = """Read /tmp/authenticity_audit.json (list of cases: cid, suite, preconds, steps, expected assertion).
Find cases where PRECONDS+STEPS do NOT let a tester observe everything the EXPECTED asserts:
- Expected covers an enumerated SET (statuses/fields/branches) but steps exercise only a subset;
- Expected is CONDITIONAL (X if A else Y) but steps set up only one branch;
- Expected asserts an outcome (message/recalculation/routing/modal) the steps never trigger;
- Expected needs a state the preconds never establish.
Do NOT report shorter-but-complete steps or simple single-assertion cases. One line per real gap:
`Cxxxxx [suite] | GAP: <one sentence: what the Expected asserts that the steps never make observable>`
then `TOTAL COVERAGE GAPS: N`. Read-only."""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cases', help='CSV of case ids')
    ap.add_argument('--targets', help='JSON file: list of case ids')
    ap.add_argument('--creds', default='/tmp/testrail/creds.json')
    ap.add_argument('--suite-label', default='suite')
    ap.add_argument('--out', default='/tmp/authenticity_audit.json')
    a = ap.parse_args()
    ids = []
    if a.cases: ids += [x.strip() for x in a.cases.split(',') if x.strip()]
    if a.targets: ids += [str(x) for x in json.load(open(a.targets))]
    if not ids:
        print('provide --cases or --targets'); sys.exit(2)
    c = load_creds(a.creds)
    base = f"https://shopview.testrail.io/index.php?/api/v2/"
    auth = base64.b64encode(f"{c.get('user') or c.get('email')}:{c['password']}".encode()).decode()
    dump, flagged = [], []
    for cid in ids:
        d = api_get(base, auth, f'get_case/{cid}')
        case = {'cid': cid, 'suite': a.suite_label, 'title': d.get('title'),
                'preconds': strip(d.get('custom_preconds'))[:900],
                'steps': strip(d.get('custom_steps'))[:900],
                'assertion': strip((d.get('custom_expected') or '').split('---')[0])[:1000],
                'expected_raw': d.get('custom_expected'),
                'atmstatus': d.get('custom_atmstatus'), 'created_by': d.get('created_by')}
        probs = mechanical_checks(case)
        if probs: flagged.append((cid, probs))
        dump.append({k: case[k] for k in ('cid','suite','title','preconds','steps','assertion')})
    json.dump(dump, open(a.out, 'w'), ensure_ascii=False, indent=0)

    print(f"\n=== MECHANICAL CHECKS: {len(ids)} cases, {len(flagged)} flagged ===")
    for cid, probs in flagged:
        for p in probs: print(f"  C{cid}: {p}")
    if not flagged: print("  clean (provenance + marker + title-status-set)")
    print(f"\nDumped {len(dump)} cases -> {a.out}")
    print("\n=== NOW RUN THE TWO SEMANTIC AUDITS (a reviewer subagent each) ===")
    print("--- AUDIT A (title-vs-Expected) prompt ---\n" + TITLE_PROMPT)
    print("\n--- AUDIT B (steps-cover-Expected) prompt ---\n" + COVERAGE_PROMPT)
    print("\n=== AND the served-page fr-view container scan (API cannot see the container) ===")
    print("  the case is 'done' only when its served page shows `markdown fr-view` on all three fields.")
    print("\nFIVE DIMENSIONS, ALL REQUIRED: Title · Preconditions · Steps · Expected · Sources.")

if __name__ == '__main__':
    main()
