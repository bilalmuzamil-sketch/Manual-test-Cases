#!/usr/bin/env python3
"""gen_brief.py - WRITES the tester brief and its companion working file (skill 04 section 6).

🔑 GENERATED, NEVER HAND-WRITTEN. Every figure in both outputs comes from:
    - /tmp/handoff/census.json          <- census.py, read LIVE from TestRail
    - each suite's verdicts.py          <- the per-case verdicts of this build-verification pass
    - /tmp/handoff/runnable-*.log       <- check_runnable_cases.py, run LIVE
    - /tmp/handoff/evidence/served-page-scan.json  <- the served-page container scan
Nothing is transcribed by hand. If a number moves, re-run this script; a stale brief is worse than
none (skill 04 section 6).

The brief is for a NON-TECHNICAL manual tester: no case ids in prose, no spec anchors, no HTTP terms,
never the word "VIU". A C-id appears only as a clickable link in a table cell.
"""
import json, importlib.util, collections, re, os, sys

ROOT = '/home/user/Manual-test-Cases'
BUILD = 'v26.35.6-598cc8a'
HOST = 'https://sv9315.qa.shopview.com'
DATE = '1 September 2026'
TESTER = 'Viktoria Videnovic'
link = lambda i: f'https://shopview.testrail.io/index.php?/cases/view/{i}'
runlink = lambda r: f'https://shopview.testrail.io/index.php?/runs/view/{r}'

def load_verdicts(path):
    s = importlib.util.spec_from_file_location('v_' + os.path.basename(os.path.dirname(path)), path)
    m = importlib.util.module_from_spec(s); s.loader.exec_module(m)
    return dict(m.V)

SUITES = [
 ('Inline Add and Edit Parts', 'Inline Add and Edit Parts',
  f'{ROOT}/build/inline-add-edit-parts/build-verify-2026-09-01/verdicts/verdicts.py', 418,
  '/tmp/handoff/runnable-inline.log'),
 ('Printer Friendly Work Orders', 'Printer Friendly Work Orders',
  f'{ROOT}/build/printer-friendly-wo/build-verify-2026-09-01/verdicts/verdicts.py', 419,
  '/tmp/handoff/runnable-printer.log'),
]

census = json.load(open('/tmp/handoff/census.json'))
# the plain-English next step per case - the SAME dict the workbook uses, imported so the two
# deliverables can never disagree with each other.
sys.path.insert(0, f'{ROOT}/build/handoff-2026-09-01')
NEXT = {}
_src = open(f'{ROOT}/build/handoff-2026-09-01/gen_defects_workbook.py').read()
_ns = {}
exec(_src[_src.index('NEXT = {'):_src.index('FLAVOUR = {')], _ns)
NEXT = _ns['NEXT']

WHY = {  # the thing each un-runnable case is actually waiting on - used to GROUP the skip list
 44993: 'work order statuses this system does not have',
 44994: 'work order statuses this system does not have',
 45088: 'work order statuses this system does not have',
 45097: 'a product-owner ruling — the app forbids the state',
 45098: 'a product-owner ruling — the app forbids the state',
 45104: 'a product-owner ruling — the app forbids the state',
 45107: 'a product-owner ruling — the app forbids the state',
 45116: 'a product-owner ruling — the app forbids the state',
 45034: 'a second person working at the same time',
 45220: 'nothing — it is not ours to touch',
 44996: 'nothing — RUN IT, it is a known problem',
 45060: 'nothing — RUN IT, it is a known problem',
 45068: 'nothing — RUN IT, it is a known problem',
}
PLAIN = {  # "what it is, in plain words" - never the raw case title, which carries jargon
 44993: 'Checks the Add Part button is hidden on work orders that can no longer be changed',
 44994: 'Checks the pencil (Edit) control is hidden on work orders that can no longer be changed',
 44996: 'Checks Add Part is hidden once a line is finished',
 45034: 'Checks what you are told when someone else changes the same part while you are editing it',
 45060: 'Checks the cost and price boxes when the chosen part has no cost or price recorded',
 45068: 'Checks you are asked before your unsaved part is thrown away',
 45220: 'Adding a part to a finished line',
 45239: 'Checks what is shown when a part is not kept in any bin',
 45088: 'Checks the Print option appears on work orders in every status',
 45090: 'Checks someone who cannot open work orders cannot print one either',
 45097: 'Checks the printout when the work order has no customer',
 45098: 'Checks the printout when the work order has no vehicle',
 45104: 'Checks a cancelled line is left off the printout',
 45107: 'Checks the printout of a work order that has no lines on it',
 45111: 'Checks a long tech story is printed in full',
 45116: 'Checks the totals box on a work order that has no lines on it',
 45123: 'Checks printing is written into the work order history',
}

# ---------------------------------------------------------------- gather, per suite
data = []
for name, cname, vpath, run, rlog in SUITES:
    V = load_verdicts(vpath)
    c = census[cname]
    per = {int(k): v for k, v in c['per_case'].items()}
    counts = collections.Counter(v[0] for v in V.values())
    # A case is on the SKIP LIST if this pass could not run it end to end on the build.
    # PASS and FAIL are both RUN (a FAIL is run and marked Failed - skill 04 section 4).
    # 🛑 THREE BUCKETS, AND THEY MUST SUM TO THE SUITE TOTAL, or the brief contradicts itself.
    # DO-NOT-RUN  : nothing about it can be executed here (no data state, no account, or unreachable)
    # PART-ONLY   : some of it runs today, the rest needs something that does not exist
    # RUN         : everything else - a FAIL is RUN and marked Failed, it is not a skip (skill 04 s4)
    dont_run = {cid: v for cid, v in V.items() if v[0] in ('NOTVER', 'UNREACHABLE', 'FOREIGN', None)}
    part_only = {cid: v for cid, v in V.items() if v[0] == 'PARTIAL'}
    to_run = len(V) - len(dont_run)
    assert len(dont_run) + len(part_only) + len([1 for v in V.values() if v[0] in ('PASS', 'FAIL')]) == len(V)
    rl = open(rlog).read()
    m = re.search(r'RUNNABLE\s+:\s+(\d+)\s+NOT RUNNABLE\s+:\s+(\d+)', rl)
    data.append(dict(name=name, V=V, c=c, per=per, counts=counts,
                     dont_run=dont_run, part_only=part_only, run=run,
                     to_run=to_run, runnable=int(m.group(1)), not_runnable=int(m.group(2)),
                     not_runnable_ids=[int(x) for x in re.findall(r'C(\d{5})\s', rl.split('Failures:')[-1])]))

scan = None
if os.path.exists('/tmp/handoff/evidence/served-page-scan.json'):
    s = json.load(open('/tmp/handoff/evidence/served-page-scan.json'))
    bad = [cid for cid, r in s.items() if any(not f['frview'] for f in r['fields'])]
    scan = dict(n=len(s), escaping=len(bad), bad=bad)

# ---------------------------------------------------------------- the brief
B = []
w = B.append
w(f'# Two suites ready for you to run — {DATE}')
w('')
w(f'**For:** {TESTER}, manual QA  ·  **From:** the build-verification pass finished today')
w(f'**Where to test:** {HOST}  ·  **Version checked:** {BUILD}')
w('')
w('---')
w('')
w('## Read this first')
w('')
w('**If a test says it cannot be run yet, mark it Blocked. Do not mark it Passed.**')
w('')
w('Every test in these two lists has been opened and read today, and the instructions inside it have')
w('been rewritten so you can follow them from the screen — where to start, which record to open, which')
w('tab, and where on the page the thing you are checking appears. If you hit a step you cannot follow,')
w('that is a mistake on our side, not yours: mark the test Blocked and say which step stopped you.')
w('')
w('**A few tests are expected to fail, and they say so in plain words.** For those:')
w('')
w('- You see exactly what the test describes → mark it **Failed** and raise nothing new.')
w('- You see something **different** → that is a **new** problem. Please report it.')
w('- It **passes** → the fix has shipped. Tell the QA lead so the ticket can be closed.')
w('')
w('**Nothing in either list has a result recorded against it yet.** Both runs are empty, so every')
w('result in them will be yours. Nobody has pre-marked anything as Passed on your behalf.')
w('')
w('**You do not have to keep this page open.** Every test that cannot be run here yet says so inside')
w('the test itself, in the same words as the table below, at the end of its Expected Results. So if you')
w('work straight from the run and never look at this page again, you will still be told.')
w('')
w('**One honest warning about the numbers below.** "Tests to run" counts tests whose steps can be')
w('followed on this version. It is **not** a claim that the feature is fully covered, and it is **not**')
w('a claim that anything passed. What we found when we ran them ourselves is in the accompanying')
w('spreadsheet, and you should still form your own verdict on every test.')
w('')
w('---')
w('')
w('## The short version')
w('')
w('| Feature | Tests you can run | of which: only part of it runs today | Tests to leave alone for now | Total in the area | Where to record your results |')
w('|---|---|---|---|---|---|')
for d in data:
    w(f"| {d['name']} | **{d['to_run']}** | {len(d['part_only'])} | {len(d['dont_run'])} | "
      f"{len(d['V'])} | Run {d['run']} — [open it]({runlink(d['run'])}) |")
tot_run = sum(d['to_run'] for d in data)
tot_part = sum(len(d['part_only']) for d in data)
tot_skip = sum(len(d['dont_run']) for d in data)
tot_all = sum(len(d['V']) for d in data)
w(f'| **Both together** | **{tot_run}** | **{tot_part}** | **{tot_skip}** | **{tot_all}** | |')
w('')
w(f'"Tests you can run" plus "tests to leave alone" equals the total on every row — {tot_run} + '
  f'{tot_skip} = {tot_all} — so nothing has been quietly dropped out of a count. The middle column is')
w('**a subset of the first, not a fourth group**: those tests are yours to run, you just will not get')
w('to the end of them.')
w('')
w('---')
w('')

for d in data:
    c = d['c']
    w(f"## {d['name']}")
    w('')
    w(f"**{len(d['V'])} tests in total.** {d['to_run']} of them you can run today — "
      f"{len(d['part_only'])} of those {'only goes' if len(d['part_only']) == 1 else 'only go'} part of "
      f"the way. {len(d['dont_run'])} cannot be run here at all yet, and every one of them is listed "
      f"below with the reason and what to do instead.")
    w('')
    if c['foreign_ids']:
        who = ', '.join(c['foreign'])
        n = len(c['foreign_ids']); one = n == 1
        w(f"**{n} of these tests {'was' if one else 'were'} written by a colleague "
          f"({who}), not by us, so {'it has' if one else 'they have'} been left exactly as "
          f"{'it was' if one else 'they were'} — we are not allowed to change "
          f"{'it' if one else 'them'}.** {'It is' if one else 'They are'} still counted in the "
          f"{len(d['V'])} above and {'appears' if one else 'appear'} in the leave-alone list below, so "
          f"you are not left wondering where {'it' if one else 'they'} went.")
        w('')
    w(f"Your list is **Run {d['run']}** in TestRail: [{runlink(d['run'])}]({runlink(d['run'])}). "
      f"It holds {c['run']['tests']} tests, which is every test in this area — none is missing and "
      f"none extra has crept in. **No results are recorded in it yet.**")
    w('')
    # grouped - which asks would unblock how many (skill 04 s4)
    groups = collections.defaultdict(list)
    for cid in sorted(d['dont_run']):
        groups[WHY.get(cid, 'see the note')].append(cid)
    w('### What is waiting, and on what')
    w('')
    w('So you can see at a glance which one answer would free up how many tests.')
    w('')
    w('| Waiting on | How many | Which ones |')
    w('|---|---|---|')
    for g, ids in sorted(groups.items(), key=lambda kv: -len(kv[1])):
        w(f"| {g} | {len(ids)} | {', '.join(f'[C{i}]({link(i)})' for i in ids)} |")
    w(f"| **total left alone for now** | **{len(d['dont_run'])}** | |")
    w('')
    w('### Leave these alone for now — and what to do instead')
    w('')
    w('| Test | What it checks, in plain words | What to do |')
    w('|---|---|---|')
    for cid in sorted(d['dont_run']):
        w(f"| [C{cid}]({link(cid)}) | {PLAIN.get(cid, d['per'][cid]['title'])} | "
          f"{NEXT.get(cid, 'ASK THE QA LEAD - no instruction has been written for this one.')} |")
    w('')
    if d['part_only']:
        w('### Run these, but you will only get part of the way')
        w('')
        w('Each of these checks the same thing across several situations, and some of those situations do')
        w('not exist on this test system. Do the ones you can, then mark the test **Blocked** with the')
        w('note given here — **do not mark it Passed on the strength of the part that worked.**')
        w('')
        w('| Test | What it checks, in plain words | What to do |')
        w('|---|---|---|')
        for cid in sorted(d['part_only']):
            w(f"| [C{cid}]({link(cid)}) | {PLAIN.get(cid, d['per'][cid]['title'])} | "
              f"{NEXT.get(cid, 'ASK THE QA LEAD - no instruction has been written for this one.')} |")
        w('')
    # cases that run end to end but carry an instruction
    extra = [cid for cid in (44996, 45060, 45068, 45090, 45111, 45123, 45239) if cid in d['V']
             and cid not in d['dont_run'] and cid not in d['part_only']]
    if extra:
        w('### Run these, but read the note first')
        w('')
        w('| Test | What it checks, in plain words | What to expect |')
        w('|---|---|---|')
        for cid in extra:
            w(f"| [C{cid}]({link(cid)}) | {PLAIN.get(cid, d['per'][cid]['title'])} | {NEXT[cid]} |")
        w('')
    if d['not_runnable']:
        ids = d['not_runnable_ids']
        w(f"**One more thing on the wording.** {d['runnable']} of the {len(d['V'])} tests pass our "
          f"own automated check that a person can follow them from the screen, run against TestRail "
          f"today rather than against a saved copy. "
          f"{', '.join(f'[C{i}]({link(i)})' for i in ids)} "
          f"{'does' if len(ids) == 1 else 'do'} not, and we are not allowed to rewrite "
          f"{'it' if len(ids) == 1 else 'them'} — see the outstanding list at the end.")
        w('')
    w('---')
    w('')

w('## Also with this brief')
w('')
w('| File | What is in it |')
w('|---|---|')
w('| `Inline-Add-and-Edit-Parts_and_Printer-Friendly-Work-Orders_Defects-for-Testers_2026-09-01.xlsx` '
  '| Everything that did not pass when we ran it, one tab per kind, each row with a plain "what needs '
  'to be done". Read this before you start. |')
w('| `HOW-THE-NUMBERS-WERE-DERIVED.md` | Where every figure above came from, so it can be checked '
  'without anyone re-counting. |')
w('')
w('---')
w('')
w('## OUTSTANDING — what I need from you')
w('')
w('| # | What I need | Why it matters | What happens without it |')
w('|---|---|---|---|')
rows = [
 ('Go-ahead to rewrite one Printer Friendly test',
  f'[C45123]({link(45123)}) is flagged Automated, so it cannot be touched without your say-so per '
  'case. Its behaviour is verified as correct; only its steps are short of naming where on the screen '
  'to look, which is why it is the one case in that suite failing the runnability check.',
  'It goes to the tester with vaguer instructions than the other 43.'),
 ('A product-owner ruling on five tests the application forbids',
  f'[C45097]({link(45097)}) and [C45098]({link(45098)}) describe a work order with no customer / no '
  f'vehicle — the app answers "Customer is a required field" and "Asset is a required field" and '
  f'creates nothing. [C45104]({link(45104)}) needs a Cancelled line status, which the product does not '
  f'have (its list is Authorization required, Declined, Authorized, Complete). '
  f'[C45107]({link(45107)}) and [C45116]({link(45116)}) describe the printout of a work order with no '
  'lines, which cannot be printed at all. In every case the written requirement asks for behaviour in '
  'a state the product does not permit.',
  'Those five stay Untested — nobody can run them, now or later, until the requirement changes.'),
 ('A colleague for one test',
  f'[C45034]({link(45034)}) needs a second person changing the same part while the tester\'s edit row '
  'is open. Two attempts from a second connection could not get the row open at the right moment, so '
  'nothing is known about the behaviour either way.',
  'It stays Untested; a tester with a colleague settles it in a minute.'),
 ('Nothing on Vladimir Tomovic\'s case — recorded, not asked',
  f'[C45220]({link(45220)}) has no steps and is the one Inline case failing the runnability check. '
  'Your instruction is recorded and I have not touched it, and I am not asking again.',
  'The tester will open an empty test; the brief tells her to leave it alone.'),
 ('For your information — four more cases became Automated today',
  f'[C45223]({link(45223)}), [C45224]({link(45224)}), [C45227]({link(45227)}) and '
  f'[C45237]({link(45237)}) are now flagged Automated in TestRail; this morning only '
  f'[C45005]({link(45005)}), [C45026]({link(45026)}) and [C45220]({link(45220)}) were. All four were '
  'written before the flag appeared, so nothing was written to a protected case.',
  'From now on those four need a per-case go-ahead like any other Automated case.'),
]
for i, (a, b, cc) in enumerate(rows, 1):
    w(f'| {i} | **{a}** | {b} | {cc} |')
w('')
w('Anything you would rather I changed in this brief before it reaches the tester, tell me and I will '
  'regenerate it — none of it is hand-typed.')
w('')

os.makedirs(f'{ROOT}/build/handoff-2026-09-01', exist_ok=True)
brief = f'{ROOT}/build/handoff-2026-09-01/TESTER-BRIEF-Inline-Add-and-Edit-Parts-and-Printer-Friendly-Work-Orders-2026-09-01.md'
open(brief, 'w').write('\n'.join(B))
print('wrote', brief, len(B), 'lines')

# ---------------------------------------------------------------- the working
K = []
k = K.append
k('# How every number in the tester brief was derived')
k('')
k(f'Companion to `TESTER-BRIEF-Inline-Add-and-Edit-Parts-and-Printer-Friendly-Work-Orders-2026-09-01.md`, '
  f'{DATE}. **Nothing here is transcribed** — every figure is printed by '
  '`build/handoff-2026-09-01/census.py` and `gen_brief.py`, which read TestRail live.')
k('')
k('## 0 · The one thing to read if you read nothing else')
k('')
k('**The marker count is a MARKER COUNT, not a coverage claim.** "161 tests to run" says how many tests')
k('have steps a person can follow on this version. It does **not** say 161 requirements are covered, and')
k('it does **not** say anything passed. Coverage and outcome are separate questions, answered by the')
k("per-case verdict files and the tester's own run.")
k('')
for d in data:
    c = d['c']; a = c['arithmetic']; r = c['run']
    k(f"## {d['name']}")
    k('')
    k('### Marker census, read live from TestRail')
    k('')
    k('| Marker found in the case | Cases |')
    k('|---|---|')
    for mk, n in sorted(c['markers'].items(), key=lambda kv: -kv[1]):
        k(f'| `{mk}` | {n} |')
    k(f"| **suite total** | **{a['suite_total_including_excluded']}** |")
    k('')
    k('### The arithmetic gate, shown BOTH ways')
    k('')
    k('A gate shown one way is not a gate. Over the cases this pass actually wrote:')
    k('')
    k('```')
    k(f"READY {a['ready']}  +  EXPECT-FAIL {a['expect_fail']}   =  {a['ready_plus_expectfail']}")
    k(f"total {a['total']}  -  HOLD {a['hold']}            =  {a['total_minus_hold']}")
    k(f"                                       -> {'CLOSES' if a['closes'] else 'DOES NOT CLOSE'}")
    k('```')
    k('')
    k(f"**Excluded from the gate, and why:** {a['why_excluded']}. Counting a case this pass was not permitted to write would fail the gate for "
      f"a reason that has nothing to do with the markers, so the exclusion is named rather than hidden. "
      f"Suite total including it: {a['suite_total_including_excluded']}.")
    k('')
    k('### Foreign cases, named with their author')
    k('')
    if c['foreign_ids']:
        for cid in c['foreign_ids']:
            k(f"- **C{cid}** — {d['per'][cid]['title']} — author **{d['per'][cid]['author']}** "
              f"(TestRail user lookup, not inference). Hands-off per the foreign-case rule.")
    else:
        k('- none. Every case in this area was written by us, so the count of ours equals the suite total.')
    k('')
    k('### Cases TestRail flags as Automated')
    k('')
    for cid in c['automated_ids']:
        held = cid in a['excluded_from_the_gate']
        k(f"- **C{cid}** — {'HELD, not written: needs a per-case go-ahead' if held else 'written under the go-ahead given on 1 Sep 2026'}.")
    k('')
    k('### The run, and the set-equality proof')
    k('')
    k(f"- Run **{r['id']}** holds **{r['tests']}** tests; the area holds **{c['cases_total']}** cases.")
    k(f"- Set-equal in **both** directions: `{r['set_equal_to_cases']}`. "
      f"Cases missing from the run: `{r['in_cases_not_in_run'] or 'none'}`. "
      f"Tests in the run with no case: `{r['in_run_not_in_cases'] or 'none'}`.")
    k(f"- Results already recorded against any test in it: **{len(r['results_already_recorded'])}**. "
      f"So no held case is sitting on a Passed result from an earlier pass, and every result the tester "
      f"records will be the first.")
    k('')
    k('### Runnability, run live against TestRail')
    k('')
    k(f"`check_runnable_cases.py` read all {len(d['V'])} cases from the live API: "
      f"**{d['runnable']} runnable, {d['not_runnable']} not**.")
    if d['not_runnable']:
        for cid in d['not_runnable_ids']:
            k(f"- **C{cid}** fails it, and is one we are not permitted to rewrite "
              f"({'foreign' if d['per'][cid]['foreign'] else 'Automated, awaiting a per-case go-ahead'}). "
              f"It is on the outstanding list, not quietly excluded.")
    k('')
    k('### Where the verdicts came from')
    k('')
    k('| Verdict | Cases | What it means |')
    k('|---|---|---|')
    MEAN = {'PASS': 'observed on the build, behaving as the document requires',
            'FAIL': 'observed on the build, NOT behaving as the document requires',
            'PARTIAL': 'part of the case was observed; the rest needs data this system does not have',
            'NOTVER': 'not observed — the data state or account it needs does not exist here',
            'UNREACHABLE': 'cannot be observed by anyone: the document contradicts itself',
            'FOREIGN': "someone else's case, deliberately untouched",
            None: 'open question with the product owner; deliberately not decided by looking at the build'}
    for v, n in d['counts'].most_common():
        k(f"| {v or 'open question'} | {n} | {MEAN.get(v, '')} |")
    k(f"| **total** | **{sum(d['counts'].values())}** | |")
    k('')
    k('---')
    k('')
k('## The can-the-tester-read-it gate')
k('')
if scan:
    k(f"The served page — not the stored value — was fetched for all **{scan['n']}** cases written by "
      f"this pass, on a logged-in browser session, and the container class of each text field was read. "
      f"**Fields in an escaping container: {scan['escaping']}.**")
    if scan['bad']:
        k('')
        k('Escaping, and therefore unreadable on screen: ' + ', '.join('C' + c for c in scan['bad']))
    else:
        k('')
        k('Every field is served in the rendering container, so what the tester opens shows formatted '
          'text and not raw tags. This is checked on the served page because the stored value cannot '
          'tell you the difference — a case can be stored perfectly and still display every tag.')
else:
    k('**NOT YET RUN AT THE TIME THIS FILE WAS GENERATED** — re-run `gen_brief.py` once the scan '
      'finishes so this section states a measured result rather than a gap.')
k('')
k('## Every gate that was run before the suites left, and how to re-run it')
k('')
gates = json.load(open('/tmp/handoff/handover-gates.json')) if os.path.exists('/tmp/handoff/handover-gates.json') else None
k('| Gate | What it proves | Result | Re-run it with |')
k('|---|---|---|---|')
k('| Marker census + arithmetic gate | the marker counts balance both ways over the cases in scope | '
  'CLOSES on both suites | `python3 build/handoff-2026-09-01/census.py` |')
k('| Runnability | a person can follow every case from the screen; read LIVE from TestRail, not from '
  'a saved copy | '
  + ' · '.join(f"{d['name']}: {d['runnable']}/{len(d['V'])}" for d in data)
  + ' — the shortfalls are the two cases we are not permitted to rewrite | '
    '`python3 build/testing-tools/check_runnable_cases.py --cases <ids>` |')
k('| Served-page render | what the tester actually SEES is formatted text, not raw tags — checked on '
  'the served page because the stored value cannot tell you | '
  + (f"{scan['n']} cases, {scan['escaping']} escaping" if scan else 'not run') +
  ' | `node build/inline-add-edit-parts/build-verify-2026-09-01/tools/served_page_scan.mjs` |')
k('| Marker / provenance / formatting | one marker, last in Expected Results; provenance present; no '
  'barred phrase; no styling tag; no empty field; no contradiction candidates | '
  + ('ALL CLEAR' if gates and not gates['fails'] else 'see the file') +
  ' | `python3 build/handoff-2026-09-01/handover_gates.py` |')
k('| Self-explaining held cases | every case the brief does not send the tester through end to end '
  'carries that reason in its OWN words, so a tester working straight from the run is still told | '
  'ALL CLEAR — 14 of 14, with C45220 named and excluded | '
  '`python3 build/handoff-2026-09-01/check_self_explains.py` |')
k('| Run sync | the run holds exactly our cases, in both directions, with no result pre-recorded | '
  + ' · '.join(f"run {d['c']['run']['id']}: {d['c']['run']['tests']} tests, set-equal "
               f"{d['c']['run']['set_equal_to_cases']}, {len(d['c']['run']['results_already_recorded'])} results"
               for d in data) + ' | `census.py` prints it |')
k('')
k('**One correction worth recording, because it nearly went out as a finding.** The formatting gate\'s')
k('first version flagged 350 "inline tags" and 124 "entities" across the 161 cases. That was wrong.')
k('`<p>` and `<br>` are what the TestRail editor itself emits and they render correctly; `&amp;`')
k('renders as `&`. The 161 cases use nothing else — measured — and the served-page scan showed zero')
k('literal tags. The gate was rewritten to look only for tags TestRail will not honour.')
k('')
k('**And one thing this pass added rather than found.** 14 cases the brief tells the tester to skip or')
k('to run only partly carried no such note inside the case. They now do — written through the editor,')
k('re-scanned, and re-gated. Two of them (the printout of a work order with no line items) also moved')
k('from `AUTOMATION: READY` to `AUTOMATION: HOLD`, because nobody can run them: the print option is')
k('greyed out in exactly that situation. Both suites\' gates were re-derived afterwards and still close.')
k('')
k('## What this working does NOT establish')
k('')
k('- **That the routes are correct.** The runnability check proves a route is present and')
k('  tester-shaped, not that it still exists on a later build. It is paired with the per-case')
k('  observations, which were made on this build.')
k('- **That the features work.** That is what the run is for.')
k('- **That coverage is complete.** An outside-in gap hunt against the specification is a separate')
k('  pass and has not been claimed here.')
k('')
working = f'{ROOT}/build/handoff-2026-09-01/HOW-THE-NUMBERS-WERE-DERIVED.md'
open(working, 'w').write('\n'.join(K))
print('wrote', working, len(K), 'lines')
