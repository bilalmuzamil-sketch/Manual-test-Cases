#!/usr/bin/env python3
"""The mechanical half of build/processes/00-WHAT-MUST-NEVER-HAPPEN.md.

A written promise is not a guard. These are the checks that can be MACHINE-ENFORCED, so they hold
even if I am careless. Anything this cannot check is listed by name at the end, so nobody mistakes a
green run for "everything is safe" — that false comfort is itself a way to get bitten.

    python3 build/testing-tools/safety_check.py --staged
    python3 build/testing-tools/safety_check.py --staged --run 415
    python3 build/testing-tools/safety_check.py --run 415 --expect-at-least 304

Exit 0 = every check that COULD run, passed.  Exit 1 = something is wrong; do not proceed.
"""
import argparse, json, os, re, subprocess, sys

ROOT = subprocess.run(['git', 'rev-parse', '--show-toplevel'], capture_output=True, text=True,
                      cwd=os.path.dirname(os.path.abspath(__file__))).stdout.strip()
G, R, Y, X = '\033[32m', '\033[31m', '\033[33m', '\033[0m'
fails, skipped = [], []


def ok(label, detail=''):
    print(f"  {G}✅{X} {label}{('  ' + detail) if detail else ''}")


def bad(label, detail):
    print(f"  {R}❌{X} {label}  {detail}")
    fails.append(label)


def skip(label, why):
    print(f"  {Y}—{X}  {label}  (not checked: {why})")
    skipped.append((label, why))


def check_secrets_staged():
    """#5 — a credential in a public repository.

    TWO passes, because they catch different things. The project scanner finds STRUCTURAL patterns
    (key shapes, token formats). It will not find a short human-chosen password. So the second pass greps the staged
    diff for the LITERAL values of every credential file in /tmp — the actual strings that would do
    the damage.
    """
    r = subprocess.run([sys.executable, f'{ROOT}/build/testing-tools/scan_secrets.py', '--staged'],
                       capture_output=True, text=True, cwd=ROOT)
    if r.returncode != 0:
        bad('secret scan (structural)', (r.stdout + r.stderr).strip()[:200])
    else:
        ok('secret scan (structural)')

    diff = subprocess.run(['git', 'diff', '--cached'], capture_output=True, text=True,
                          cwd=ROOT).stdout
    if not diff.strip():
        skip('literal-credential scan', 'nothing staged')
        return
    literals, where = [], []
    for base in ('/tmp/prod', '/tmp/qa', '/tmp/staging'):
        for name in ('login.json', 'creds.json', 'cookies.json'):
            p = os.path.join(base, name)
            if not os.path.exists(p):
                continue
            try:
                for k, v in (json.load(open(p)) or {}).items():
                    # a short value is not a secret; a host name is not a secret
                    if isinstance(v, str) and len(v) >= 6 and k not in ('host', 'api'):
                        literals.append(v); where.append(f'{p}:{k}')
            except Exception:
                continue
    if not literals:
        skip('literal-credential scan', 'no credential files present in /tmp')
        return
    hit = [w for lit, w in zip(literals, where) if lit in diff]
    if hit:
        # deliberately does NOT print the value
        bad('literal-credential scan', f'a value from {", ".join(hit)} appears in the staged diff')
    else:
        ok('literal-credential scan', f'{len(literals)} value(s) checked, none present')


def check_run_not_shrinking(run_id, expect_at_least):
    """#2 — destroying results in TestRail.

    A partial case_ids list DELETES tests and their results. This records the run's size and refuses
    to call it healthy if it has shrunk below what we last recorded (or below --expect-at-least).
    """
    sys.path.insert(0, '/tmp/claude-0')
    try:
        src = open(f'{ROOT}/build/search-results-integrity/push_to_testrail.py').read().split('def main()')[0]
        ns = {'__name__': 'notmain',
              '__file__': f'{ROOT}/build/search-results-integrity/push_to_testrail.py'}
        exec(compile(src, 'push', 'exec'), ns)
        tr = ns['tr']
    except Exception as e:
        skip(f'TestRail run {run_id} size', f'no TestRail client available ({type(e).__name__})')
        return
    total, off = 0, 0
    while True:
        st, r = tr(f'get_tests/{run_id}&limit=250&offset={off}')
        if st != 200:
            skip(f'TestRail run {run_id} size', f'get_tests answered {st}')
            return
        b = (r.get('tests') if isinstance(r, dict) else r) or []
        total += len(b)
        if len(b) < 250:
            break
        off += 250
    marker = f'{ROOT}/build/testing-tools/.run-sizes.json'
    seen = json.load(open(marker)) if os.path.exists(marker) else {}
    before = seen.get(str(run_id))
    floor = max([v for v in (before, expect_at_least) if v] or [0])
    if floor and total < floor:
        bad(f'TestRail run {run_id} size',
            f'{total} tests now, was {floor} — RESULTS MAY HAVE BEEN DELETED. Do not sync again '
            f'until this is explained')
    else:
        ok(f'TestRail run {run_id} size', f'{total} tests' + (f' (was {before})' if before else ''))
        seen[str(run_id)] = total
        json.dump(seen, open(marker, 'w'), indent=1)


def check_no_bulk_add():
    """#7 — `git add -A` sweeps in whatever happens to be lying around, including a credential file
    somebody dropped in the working tree. Path-scoped staging only (Rule 29)."""
    staged = subprocess.run(['git', 'diff', '--cached', '--name-only'], capture_output=True,
                            text=True, cwd=ROOT).stdout.split()
    outside = [f for f in staged if not f.startswith('build/')]
    if outside:
        print(f"  {Y}!{X}  staged outside build/: {outside[:5]}"
              f"{' …' if len(outside) > 5 else ''} — intended?")
    ok('staged paths', f'{len(staged)} file(s)')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--staged', action='store_true', help='check the staged diff before a commit')
    ap.add_argument('--run', type=int, help='TestRail run id to check for shrinkage')
    ap.add_argument('--expect-at-least', type=int, default=0)
    a = ap.parse_args()
    if not (a.staged or a.run):
        ap.error('nothing to check — pass --staged and/or --run')

    print('=== SAFETY CHECK — the mechanical half of WHAT MUST NEVER HAPPEN ===')
    if a.staged:
        check_secrets_staged()
        check_no_bulk_add()
    if a.run:
        check_run_not_shrinking(a.run, a.expect_at_least)

    print('\n🔴 NOT CHECKED BY THIS SCRIPT, AND STILL ABLE TO BITE — these rest on judgement:')
    for line in (
        'whether a result was actually OBSERVED rather than inferred (#1)',
        'whether permission was given for THIS ticket (#3)',
        'whether a finding is really the product\'s fault (#4)',
        'whether a claimed check actually ran (#6)',
    ):
        print(f'     · {line}')
    print('   A green run here does NOT mean everything is safe. It means the mechanical ones held.')

    if fails:
        print(f'\n{R}❌ {len(fails)} check(s) FAILED: {", ".join(fails)}{X}')
        print('   DO NOT PROCEED.')
        sys.exit(1)
    print(f'\n{G}✅ every check that could run, passed{X}'
          + (f' · {len(skipped)} skipped' if skipped else ''))


if __name__ == '__main__':
    main()
