#!/usr/bin/env python3
"""THE OTHER HALF OF THE RUNNABILITY GATE: are the labels the preconditions name REAL?

WHY THIS EXISTS. `check_runnable_cases.py` proves a precondition is tester-SHAPED — it names a screen,
gives a navigation instruction, points at something to aim at. Its own header says what it cannot do:
"WHAT THIS CANNOT CHECK. Whether a route is CORRECT or still exists on the build - only that one is
present and tester-shaped."

On 2026-09-01 that gap cost real work. The QA lead asked, plainly, whether the preconditions were
build-verified. They passed the runnability gate 121/122 and 43/44 — and **117 of them named a
permission called “Work Order Line - Create and Edit” and 90 named “Work Orders → Work Order View
Mode”, neither of which exists on the screen.** The build calls them the “Work order lines” section's
“Create & Edit” toggle and the “Work orders” section's “View mode”. A tester would have hunted for a
label that isn't there — the precise failure the QA lead means by "this thing never bites me".

WHAT THIS CHECKS. Every quoted label in a case's preconditions is compared against a file of labels
OBSERVED on the build (default `build/OBSERVED-UI-LABELS-<env>.md`). A label that appears nowhere in
that file is reported as UNCONFIRMED — not necessarily wrong, but not yet seen, and therefore not
something to hand a tester.

WHAT IT CANNOT DO, stated so nobody over-trusts it either: it cannot tell a label that is merely
absent from the observed file from one that is genuinely wrong, and it cannot check unquoted prose.
Its output is a work list for a probe, not a verdict.

Usage:
    python3 build/testing-tools/check_precond_labels.py --sections 6755,6756 --observed build/OBSERVED-UI-LABELS-sv9315.md
    python3 build/testing-tools/check_precond_labels.py --cases 44988,45250 --observed ...
Exit 1 if any label in scope is unconfirmed, or if any BARRED label is present.
"""
import argparse, base64, html, json, re, sys, time, urllib.request, collections

HOST = 'https://shopview.testrail.io'
# 🛑 ONLY PAIRED QUOTES. An apostrophe is not a delimiter: including ‘ ’ and ' made "user’s role can
# edit work order lines. To check it: open" look like a UI label, and the first run of this gate
# reported 110 such phantoms. A label is what sits inside “ … ” or " … ".
QUOTED = re.compile(r'“([^”\n]{2,60})”|"([^"\n]{2,60})"')
# labels PROVEN not to exist. Any occurrence is a hard failure, not an "unconfirmed".
BARRED = [
    (re.compile(r'Work Order Line\s*-\s*Create and Edit'),
     'the role screen has a “Work order lines” section with a “Create & Edit” toggle; this string does not exist'),
    (re.compile(r'Work Order View Mode'),
     'the role screen calls it “View mode”, inside the “Work orders” section'),
]
# things that are never UI labels, so never worth flagging
IGNORE = re.compile(r'^(Escape|Enter|Tab|Shift\+Enter|Ctrl\+|F\d|\d+(\.\d+)?|[A-Z0-9\-]{4,}|x|×|s “X)$', re.I)


def api(path, auth, tries=5):
    for a in range(tries):
        try:
            r = urllib.request.Request(f'{HOST}/index.php?/api/v2/{path}',
                                       headers={'Authorization': 'Basic ' + auth})
            return json.load(urllib.request.urlopen(r, timeout=180))
        except Exception:
            if a == tries - 1: raise
            time.sleep(2 ** a)


def paged(path, key, auth):
    out, off = [], 0
    while True:
        j = api(f'{path}&limit=250&offset={off}', auth)
        chunk = j[key] if isinstance(j, dict) else j
        out += chunk
        if len(chunk) < 250: break
        off += 250
    return out


def txt(h):
    if not h: return ''
    s = re.sub(r'<(br|/p|/li|/div|hr)[^>]*>', '\n', h)
    return html.unescape(re.sub(r'<[^>]+>', '', s))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--sections')
    ap.add_argument('--cases')
    ap.add_argument('--observed', required=True)
    ap.add_argument('--creds', default='/tmp/testrail/creds.json')
    a = ap.parse_args()
    c = json.load(open(a.creds))
    auth = base64.b64encode(f"{c['email']}:{c['password']}".encode()).decode()

    observed = open(a.observed, encoding='utf-8').read()
    # the observed file is prose + tables; a label counts as seen if it appears anywhere in it
    seen = lambda label: label.lower() in observed.lower()

    cases = []
    if a.cases:
        for cid in [x.strip() for x in a.cases.split(',') if x.strip()]:
            cases.append(api(f'get_case/{cid}', auth))
    elif a.sections:
        for sid in [x.strip() for x in a.sections.split(',') if x.strip()]:
            cases += paged(f'get_cases/1&section_id={sid}', 'cases', auth)
    else:
        sys.exit('give --cases or --sections')

    unconfirmed = collections.defaultdict(list)
    barred_hits = collections.defaultdict(list)
    # 🛑 SILENCE USED TO PASS. This gate only ever inspected the labels a case QUOTES, so a
    # precondition that names nothing at all scored a clean pass -- it had no labels to be wrong
    # about. C45123 was exactly that: "Open the work order's audit history", no route, no label,
    # green on this gate, and a tester had nowhere to click. A precondition with no quoted label is
    # not a case that got the labels right; it is a case that has not been build-verified yet.
    silent = []
    for case in cases:
        pre = txt(case.get('custom_preconds') or '')
        for rx, why in BARRED:
            if rx.search(pre):
                barred_hits[rx.pattern].append((case['id'], why))
        found = {a or b for a, b in QUOTED.findall(pre)}
        for label in sorted(found):
            label = label.strip().rstrip('.,;:')
            if not label or IGNORE.match(label): continue
            if not seen(label):
                unconfirmed[label].append(case['id'])
        stp = txt(case.get('custom_steps') or '')
        if not {a or b for a, b in QUOTED.findall(pre + '\n' + stp)}:
            silent.append((case['id'], case.get('title', '')))

    print(f'cases checked      : {len(cases)}')
    print(f'observed-label file: {a.observed}')
    print()
    if barred_hits:
        print('🛑 BARRED LABELS PRESENT — these are known NOT to exist on the build:')
        for pat, hits in barred_hits.items():
            ids = sorted({i for i, _ in hits})
            print(f'   /{pat}/  in {len(ids)} case(s): {["C%d" % i for i in ids][:12]}'
                  + (' …' if len(ids) > 12 else ''))
            print(f'      {hits[0][1]}')
        print()
    if unconfirmed:
        print('UNCONFIRMED LABELS — quoted in a precondition, never observed on the build:')
        for label, ids in sorted(unconfirmed.items(), key=lambda kv: -len(kv[1])):
            print(f'   {len(ids):4} case(s)  “{label}”   {["C%d" % i for i in ids][:6]}'
                  + (' …' if len(ids) > 6 else ''))
        print()
        print('Each one is a job for a probe: read it off the served page, then add it to the observed')
        print('file with its evidence — or correct the case to the wording the build actually uses.')
    else:
        print('every quoted precondition label is present in the observed-label file')
    if silent:
        print()
        print('🛑 NO LABEL QUOTED AT ALL — the preconditions and steps name nothing on the screen,')
        print('   so this gate has nothing to check and a tester has nothing to click:')
        for cid, title in silent[:20]:
            print(f'   C{cid}  {title[:70]}')
        if len(silent) > 20:
            print(f'   ... and {len(silent) - 20} more')
        print('   Read the route off the build and quote its labels. A silent case is NOT a clean case.')
    bad = bool(barred_hits) or bool(unconfirmed) or bool(silent)
    print()
    print('PRECONDITION-LABEL GATE:', 'PROBLEMS ABOVE' if bad else 'ALL CLEAR')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
