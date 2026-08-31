#!/usr/bin/env python3
"""Gate for skill 18: can a layman follow this case from the UI?

Flags a case whose PRECONDITIONS + STEPS contain no UI route at all -- no screen name, no tab, no
click, no control. "Generate the Invoice" tells a tester nothing about where to go.

This is a WORDING gate, deliberately narrow. It cannot tell you whether a route is CORRECT, only
whether one is present. Pair it with the served-page render check (skill 04 4.5) -- a case can read
perfectly and still display raw HTML on screen -- and with a human read of one case per area.

Usage:
    python3 build/testing-tools/check_layman_steps.py <requirements.json> [--only-verified <verification.json>]
Exit code 1 if any case has no route, so it can gate a handover.
"""
import json, re, sys, collections

# A route mentions at least one of: a top-level screen, a tab/panel, or a click on a named control.
SCREEN = re.compile(r'\b(work orders?|customers?|schedule|parts|reports|part sales?|invoices?\s+tab|'
                    r'contacts?\s+tab|finance\s+tab|payments?\s+tab|deposits?\s+tab)\b', re.I)
CLICK = re.compile(r'\b(click|open the|press|select the|tick|toggle|choose|navigate to|go to|'
                   r'tab\b|menu\b|icon\b|button\b|chip\b|dialog\b)', re.I)

def has_route(case):
    blob = ' '.join(case.get('preconditions', []) + case.get('steps', []))
    return bool(SCREEN.search(blob) or CLICK.search(blob))

def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    req = json.load(open(sys.argv[1]))
    only = None
    if '--only-verified' in sys.argv:
        ver = json.load(open(sys.argv[sys.argv.index('--only-verified') + 1]))
        only = {c for c, r in ver['cases'].items() if r['verdict'] == 'RUNNABLE'}
    scope = [c for c in req if only is None or c in only]
    bad = [c for c in scope if not has_route(req[c])]
    bysec = collections.Counter(req[c].get('section') for c in bad)
    print(f'cases checked        : {len(scope)}' + ('  (build-verified only)' if only else ''))
    print(f'carry a UI route     : {len(scope) - len(bad)}')
    print(f'NO UI route          : {len(bad)}')
    if bad:
        print('\nby area:')
        for s, n in bysec.most_common():
            print(f'   {str(s)[:44]:<46} {n}')
        print('\nfirst 20:')
        for c in sorted(bad, key=int)[:20]:
            step = (req[c].get('steps') or ['-'])[0]
            print(f'   C{c}  {req[c]["title"][:44]:<46} | {step[:56]}')
    print('\nverdict:', 'PASS — every case names a route' if not bad
          else f'FAIL — {len(bad)} case(s) give a tester no way to reach the screen')
    sys.exit(1 if bad else 0)

if __name__ == '__main__':
    main()
