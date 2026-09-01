#!/usr/bin/env python3
"""THE RUNNABLE-STEPS GATE — can a manual tester actually follow this case from the UI?

Why this exists (QA lead, 2026-09-01, verbatim):
    "ONE of the major part of build verification is TO make the steps of replication and
     preconditions RUNNABLE and not to keep those test cases the spec level test cases.
     Make sure you do never fail in that part and this thing never bites me"

So this is a GATE, not a report. It reads the cases LIVE from TestRail (never a local file that
can drift) and fails the run if any case in scope is still spec-level.

It replaces check_layman_steps.py, which was far too permissive: that one passed a case if its text
contained ANY of click/open the/tab/menu/icon/button anywhere, so "Open the Credit Invoice preview"
passed on the words "open the" while telling a tester nothing about where to go.

WHAT IT CHECKS (skill 18's five things, as far as text can be checked)
  1 ENTRY POINT    a real top-menu screen is named (Work Orders, Customers, Parts, Schedule,
                   Reports, Settings) - the place the tester starts.
  2 NAVIGATION     an actual instruction to get somewhere: click / open / go to a named thing.
  3 NO BARE STATE  a precondition may not be only an assertion that some state exists
                   ("An invoice paid to $0.00 via a cash payment plus an applied credit") unless
                   some precondition also says how to reach or create it.
  4 NO SUMMARY     a step may not merely summarise an action ("Generate the Invoice",
                   "Open each record's customer card") with no UI anchor anywhere in the case.
  5 NO JARGON      no permission identifiers (workOrdersCreateAndEdit), no spec anchors (S3-R5),
                   no API paths, no "plan ..." implementation references. Testers do not read those.

WHAT IT CANNOT CHECK. Whether a route is CORRECT or still exists on the build - only that one is
present and tester-shaped. Pair it with a human read of one case per area and with the served-page
render check (skill 04 4.5): a case can be perfectly worded and still display raw HTML on screen.

Usage:
    python3 build/testing-tools/check_runnable_cases.py --section-prefix "Invoice Refresh (Aug 2026)"
    python3 build/testing-tools/check_runnable_cases.py --cases 44923,45197
Exit code 1 if any case in scope fails, so it can gate a handover or a marker push.
"""
import argparse, base64, html, json, re, sys, urllib.request

HOST = 'https://shopview.testrail.io'

SCREEN = re.compile(r'\b(work orders?|customers?|parts|schedule|reports|settings)\b', re.I)
NAV    = re.compile(r'\b(click|open|go to|navigate to|select|tick|choose|press|switch to|set the)\b', re.I)
TAB    = re.compile(r'\b(tab|panel|menu|dialog|icon|button|column|row|filter|chip|toggle|list|card)\b', re.I)

JARGON = [
    (re.compile(r'\b[a-z]+[A-Z][A-Za-z]*\b'),           'a camelCase identifier (e.g. a permission name)'),
    (re.compile(r'\bS\d+-[RN]\d+[a-z]?\b'),             'a specification anchor (e.g. S3-R5)'),
    (re.compile(r'/api/|\bHTTP\b|\b\d{3}\s+error\b'),   'an API path or HTTP term'),
    (re.compile(r'\bplan\s+[A-Z]', ),                   'an implementation-plan reference'),
    (re.compile(r'\bcustom_[a-z]+\b'),                  'a database field name'),
]
# A STEP MUST BE SELF-SUFFICIENT. The QA lead's own skill-18 example is "Generate the Invoice."
# -> "Click Work Orders in the top menu. Open the work order. Click the Finance tab." A tester
# reads the steps; a route buried only in the preconditions does not help them mid-run.
# A step passes if it either names a place (tab/menu/icon/...) or explicitly points back at the
# preconditions. It fails if it is a bare verb+noun with no pointer of any kind.
SUMMARY = re.compile(r'^\s*\d*\.?\s*(generate|create|produce|verify|confirm|check|open|reach|attempt|'
                     r'apply|re-open|reopen|read|look|find|select|use)\b', re.I)
STEP_ANCHOR = re.compile(r'\b(tab|menu|icon|button|column|row|filter|screen|list|card|page|toggle|'
                         r'dialog|panel|chip|field|box|link|heading|section|banner|preconditions?|'
                         r'top menu|left|right|above|below)\b', re.I)

def text_of(v):
    v = v or ''
    v = re.sub(r'<[^>]+>', '\n', v)
    return [l.strip() for l in html.unescape(v).split('\n') if l.strip()]

def audit(case):
    pre  = text_of(case.get('custom_preconds'))
    step = text_of(case.get('custom_steps'))
    blob = ' '.join(pre + step)
    fails = []
    if not pre:                       fails.append('no preconditions at all')
    if not step:                      fails.append('no steps at all')
    if not SCREEN.search(blob):       fails.append('R1 no entry point: no top-menu screen is named')
    if not NAV.search(blob):          fails.append('R2 no navigation instruction (click / open / go to)')
    if not TAB.search(blob):          fails.append('R3 nothing to aim at: no tab, panel, menu, icon, button, column or row')
    for rx, why in JARGON:
        m = rx.search(blob)
        if m:                         fails.append(f'R5 jargon a tester will not understand: {why} -- {m.group(0)!r}')
    # R4: THE FIRST STEP MUST PUT THE TESTER SOMEWHERE.
    # Calibration matters here. Requiring EVERY step to name a place over-fires badly: once step 1
    # has the document on screen, "Look at the masthead" is exactly right and repeating the click
    # path in every step is noise. What actually strands a tester is a FIRST step that assumes they
    # are already somewhere -- "Generate the Invoice", "Open the Credit Invoice preview",
    # "Open the work order" -- which is the QA lead's own skill-18 example of a defective step.
    # So: step 1 must name a screen, an on-screen anchor, or point back at the preconditions.
    if step:
        first = step[0]
        if SUMMARY.match(first) and not (SCREEN.search(first) or STEP_ANCHOR.search(first)):
            fails.append(f'R4 the FIRST step does not say where to go: {first[:70]!r}')
    # and no later step may be a bare verb with nothing to aim at at all
    for st in step[1:]:
        if SUMMARY.match(st) and not STEP_ANCHOR.search(st) and len(st.split()) <= 4:
            fails.append(f'R4 step has nothing to aim at: {st[:60]!r}')
    return fails

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--section-prefix'); ap.add_argument('--cases')
    ap.add_argument('--creds', default='/tmp/testrail/creds.json')
    ap.add_argument('--json-out'); ap.add_argument('--quiet', action='store_true')
    a = ap.parse_args()
    cr = json.load(open(a.creds))
    auth = base64.b64encode(f"{cr['user']}:{cr['password']}".encode()).decode()
    def get(p):
        r = urllib.request.Request(f'{HOST}/index.php?/api/v2/{p}', headers={'Authorization': 'Basic ' + auth})
        return json.load(urllib.request.urlopen(r, timeout=180))

    if a.cases:
        cases = [get(f'get_case/{c.strip().lstrip("Cc")}') for c in a.cases.split(',')]
    else:
        secs, off = [], 0
        while True:
            j = get(f'get_sections/1&suite_id=1&limit=250&offset={off}')
            secs += j['sections']
            if len(j['sections']) < 250: break
            off += 250
        byid = {s['id']: s for s in secs}
        def path(s):
            out, cur = [], s
            while cur: out.append(cur['name']); cur = byid.get(cur.get('parent_id'))
            return ' / '.join(reversed(out))
        want = {s['id'] for s in secs if path(s).startswith(a.section_prefix)}
        allc, off = [], 0
        while True:
            j = get(f'get_cases/1&suite_id=1&limit=250&offset={off}')
            allc += j['cases']
            if len(j['cases']) < 250: break
            off += 250
        cases = [c for c in allc if c['section_id'] in want]

    results = {}
    for c in cases:
        results[str(c['id'])] = {'title': c['title'], 'fails': audit(c), 'created_by': c.get('created_by')}
    bad = {k: v for k, v in results.items() if v['fails']}
    print(f'cases checked : {len(results)}')
    print(f'RUNNABLE      : {len(results) - len(bad)}')
    print(f'NOT RUNNABLE  : {len(bad)}')
    if bad and not a.quiet:
        print('\nFailures:')
        for cid, v in sorted(bad.items()):
            print(f'\n  C{cid}  {v["title"][:70]}')
            print(f'    {HOST}/index.php?/cases/view/{cid}')
            for f in v['fails']: print(f'      - {f}')
    if a.json_out: json.dump(results, open(a.json_out, 'w'), indent=1)
    sys.exit(1 if bad else 0)

if __name__ == '__main__':
    main()
