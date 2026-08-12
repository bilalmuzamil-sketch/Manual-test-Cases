#!/usr/bin/env python3
"""Classify each precondition LINE into a semantic category.

Design note -- why this differs from the previous pass, which over-counted by 3-4 in 8:

  1. The unit is a LINE, not a case. A case is "established" only if EVERY one of its
     lines is established. One unmet line disqualifies the whole case, because that is
     the line the tester stops on.
  2. Categories are ORDERED, first match wins, most-restrictive first.
  3. UNKNOWN is a real category and is NEVER counted as established.
  4. Every line the regexes left as UNKNOWN on the first run is HAND-JUDGED below in
     OVERRIDE, with its judgement recorded, rather than being swept up by a widened
     regex. A regex written to make a number go up is not a measurement.

THE DISTINCTION THAT MATTERS MOST, and which the previous pass did not draw:

  "I cannot establish this"  is NOT  "a tester cannot run this".

  A role / staff-record / settings edit destroys the session of every holder on this
  shared branch, so THIS PASS is barred from making one. A tester tomorrow, with proper
  admin access and no sibling worker sharing their session, can. Those lines are
  BARRED_TO_US -- an honest limit on our verification, NOT a divergence and NOT a
  reason to hold a case.

  Only EXTERNAL is a genuine impossibility (an external system we do not have).

Categories
  ENV          signed in / desktop browser / ordinary reports access -> admin account is it
  TOOL         dev tools, network panel, forcing a failure by cutting the network
  UISTATE      expanded a row, opened a dialog, cleared storage, dark mode, viewport
  NOTE         an instruction to the tester, not a precondition at all
  DATA_OPEN    "the report is open with rows"          -> checkable live
  DATA_SHAPE   a specific data state                   -> checkable live, seedable
  VOLUME       paging / over-cap volumes               -> checkable live
  BARRED_TO_US second sign-in / role / settings edit   -> session-destroying for US only
  EXTERNAL     an external system or physical device   -> genuinely impossible here
  UNKNOWN      nothing matched                         -> never counted as established
"""
import json, re, collections

D = json.load(open('/tmp/rs812/preconds.json'))
ROWS = D['rows']

# ---------------------------------------------------------------------------
# HAND-JUDGED OVERRIDES.
# Every line here was left UNKNOWN by the regexes on the first run and was then read
# individually. The category and the one-line reason are recorded so the judgement is
# auditable and so a later reader can disagree with a specific call rather than with
# an opaque total.
# ---------------------------------------------------------------------------
OVERRIDE = {
 "You know the report's direct page address (copy it from a permitted session first).":
   ('UISTATE', 'the tester copies a URL; no data and no privilege needed'),
 "This one test covers all six reports, so keep this same sign-in for the whole of it.":
   ('NOTE', 'an instruction about how to run the test, not a precondition'),
 "This one test covers the printable download on all six reports, so do the setup once and check all six.":
   ('NOTE', 'an instruction about how to run the test, not a precondition'),
 "Several reps are on the report, all collapsed.":
   ('DATA_SHAPE', 'needs >=2 rep rows; checkable live'),
 "Two reps are on the report; one of them stops matching under a stricter filter you can apply and re-remove.":
   ('DATA_SHAPE', 'needs >=2 reps separable by a filter; checkable live'),
 "Several reps with differing values are on the report.":
   ('DATA_SHAPE', 'needs >=2 reps with distinct metric values; checkable live'),
 "Several reps are on the report in the A→Z default.":
   ('DATA_SHAPE', 'needs >=2 rep rows; checkable live'),
 "Note the current order of the Report Name dropdown entries before checking.":
   ('UISTATE', 'the tester reads a dropdown before acting'),
 'The Export Report dialog is open with "Sales Representative Assignments" selected.':
   ('UISTATE', 'a dialog the tester opens'),
 "The report is open on a touch device or touch emulation (under 1024px).":
   ('UISTATE', 'the case itself offers browser touch emulation as an alternative'),
 "At least one staff member is offered as a sales representative.":
   ('DATA_SHAPE', 'checkable live from the rep list'),
 "User 2 can open the report.":
   ('BARRED_TO_US', 'a second sign-in'),
 "Both W1 and W2 are selectable ranges.":
   ('UISTATE', 'two date ranges the tester selects'),
 "Min and Max are enabled.":
   ('DATA_SHAPE', 'needs parts carrying min/max; checkable live'),
 "The three-dot download menu offers a spreadsheet option for the Summary view and a separate one for the Expanded view.":
   ('DATA_OPEN', 'a menu on an open report; checkable live'),
 "You are able to mark that line completed.":
   ('DATA_SHAPE', 'needs a work-order line in a completable state'),
 "All four tabs contain at least one job with non-zero money.":
   ('DATA_SHAPE', 'checkable live per tab'),
 "The Estimates tab contains at least one job with a non-zero quoted value.":
   ('DATA_SHAPE', 'checkable live'),
 "The Work In Progress report is open with the summary strip visible.":
   ('DATA_OPEN', 'report open with rows'),
 "Each tab has at least one visible job.":
   ('DATA_SHAPE', 'checkable live per tab'),
 "A tab shows several jobs with known money values.":
   ('DATA_SHAPE', 'checkable live'),
 "The report shows jobs for at least two different advisors.":
   ('DATA_SHAPE', 'checkable live'),
 "Today's nightly snapshot has not yet been recorded (the normal daytime state).":
   ('DATA_SHAPE', 'a time-of-day state; checkable live from the as_of date'),
 "The date nightly recording began at this organization is known.":
   ('DATA_SHAPE', 'checkable live by walking back the snapshot dates'),
 "A capture has already run for the current date.":
   ('DATA_SHAPE', 'checkable live from the as_of date'),
 "The capture can be re-run for that date (arrange with the developers).":
   ('EXTERNAL', 'the line itself says to arrange it with the developers -- not ours to do'),
 "The nightly capture (with its pruning) has run.":
   ('DATA_SHAPE', 'checkable live from the snapshot dates'),
 "The retained capture dates around the requested date are known.":
   ('DATA_SHAPE', 'checkable live by probing the retained dates'),
}
# prefix-matched overrides for long lines that vary only in their tail
OVERRIDE_PREFIX = [
 ("You can force", ('TOOL', 'forcing a failure by cutting the network; each of these lines '
                    'already tells the tester to mark it Blocked if not forceable')),
 ("A download failure can be simulated", ('TOOL', 'as above')),
 ("For the failure path: you can force", ('TOOL', 'as above')),
 ("For the fallback check: the organization has NO configured logo",
    ('BARRED_TO_US', 'clears an org setting')),
 ("You can toggle the shop's logo", ('BARRED_TO_US', 'changes an org setting')),
 ("The shop has a logo set in its settings", ('DATA_SHAPE', 'read-only check of a setting')),
 ("At least one staff member has the sales-representative toggle ON",
    ('BARRED_TO_US', 'the line itself says to change a staff setting to arrange it')),
 ("The test company is connected to QuickBooks", ('EXTERNAL', 'external system we do not have')),
 ("You can sign in to that QuickBooks company", ('EXTERNAL', 'external system we do not have')),
 ("This test cannot be run without a company whose QuickBooks account is connected",
    ('EXTERNAL', 'the line says so itself')),
 ("A past date exists that has NO snapshot of its own",
    ('DATA_SHAPE', 'checkable live by probing past dates')),
 ("The report is open on a view whose displayed day is known",
    ('DATA_OPEN', 'report open on a known day')),
]

RULES = [
 ('EXTERNAL', [
    r'screen reader', r'\bnvda\b', r'\bvoiceover\b', r'\bjaws\b',
    r'quickbooks',
 ]),
 ('BARRED_TO_US', [
    r'two sign-ins', r'second sign-in',
    r'a test user exists', r'test user exists whose role',
    r'signed in as that user', r'signed in as the unpermitted',
    r'signed in as a user who (can view|lacks|cannot)',
    r'non-administrator test user', r'an administrator account is also available',
    r'access to exactly one location',
    r'one person who can .* and one person', r'whose role does not have',
    r'whose role has no ', r'lacks permission to open',
    r'a user whose role',
    r'create a (throwaway )?custom role', r'create/assign a zzautotest role',
    r'use/create a zzautotest role', r'create a zzautotest custom role',
    r'administrator (then )?removes your access', r'removes your access to that location',
    r'toggle the organi[sz]ation\'?s uploaded logo', r'change the organi[sz]ation\'?s uploaded logo',
    r'you can change the organi[sz]ation', r'organi[sz]ation\'?s original logo',
    r'a logo is set but the picture will not load',
    r'edit roles and their permissions',
    r'restore afterwards', r'restore it afterwards',
 ]),
 ('TOOL', [
    r"browser'?s own developer tools", r'\bf12\b', r'network panel', r'"network" tab',
    r'network activity panel', r'dev tools', r'devtools', r'throttling',
    r'inspector', r'interrupt the network', r'offline mode',
    r'see the requests the browser makes', r'reads a downloaded csv as text',
    r'nothing to install',
 ]),
 ('UISTATE', [
    r'you have expanded', r'have expanded', r'expanded a customer', r'expanded an asset',
    r'column selector open', r'the column selector is open',
    r'no saved view', r'cleared browser storage', r'cleared storage',
    r'clear the browser\'?s site data', r'fresh browser profile',
    r'browser has no saved view', r'saved view exists',
    r'you have a saved view', r'have set a distinctive saved view',
    r'dark mode', r'light mode', r'phone-sized viewport', r'device emulation',
    r'narrow enough to force horizontal scrolling',
    r'columns? (are|is) turned on', r'you have downloaded', r'have already clicked',
    r'in a browser you can revisit', r'page link carrying', r'plain address with no date range',
    r'filter is at its default', r'filters otherwise match no customers',
    r'selection is empty', r'you have selected exactly',
    r'date range is this month', r'known active location',
    r'the report is open with an invoice detail row visible',
    r'is expanded', r'are expanded', r'rep row is expanded', r'owning rep is expanded',
    r'columns? (are|is) hidden', r'hidden via the column selector',
    r'sorted by a metric column', r'sort by a financial column',
    r'leave at least one rep collapsed', r'all collapsed', r'is left collapsed',
    r'^a date range is selected', r'never clicked a financial column header',
    r'totals indicator is visible', r'table is scrolled', r'scrolled partway',
    r'non-default filters are set', r'set a specific date range',
 ]),
 ('DATA_OPEN', [
    r'^you are on the .* report( with (data|rows)| as | in )?\.?$',
    r'report is open with (rows|data) loaded',
    r'^the .* report is open\.?$',
    r'report with (data|rows) (loaded|showing|on screen)',
    r'^you are on the report with data', r'^you are on the report\b',
    r'^you are on the .* report\b', r'report with data loaded',
    r'reports navigation with the entry visible',
    r'see the other reports in the performance group',
 ]),
 ('VOLUME', [
    r'more than one page', r'span more than one page', r'fill more than one page',
    r'exceed 10,?000', r'over-cap', r'large enough data set',
    r'enough (customers|rows|parts) exist',
 ]),
 ('ENV', [
    r'signed in to the shopview app', r'ordinary reports access',
    r'your role has the ordinary reports', r'^you are signed in\b', r'desktop browser',
 ]),
]

DATA_NOUNS = (r'(invoice|customer|asset|vehicle|vin|unit #|part|technician|rep\b|location|'
              r'work order|margin|subtotal|hours|clock|inventory|stock|min/max|category|'
              r'vendor|core|labor|labour|shop suppl|date range|seed|zzautotest|row|column|'
              r'amount|total|advisor|snapshot|job)')

REASON = {}


def classify(line):
    if line in OVERRIDE:
        cat, why = OVERRIDE[line]
        REASON[line] = 'hand-judged: ' + why
        return cat
    for pref, (cat, why) in OVERRIDE_PREFIX:
        if line.startswith(pref):
            REASON[line] = 'hand-judged: ' + why
            return cat
    low = line.lower()
    for cat, pats in RULES:
        for p in pats:
            if re.search(p, low, re.I):
                return cat
    if re.search(DATA_NOUNS, low, re.I):
        return 'DATA_SHAPE'
    return 'UNKNOWN'


for r in ROWS:
    r['cat'] = classify(r['line'])
    if r['line'] in REASON:
        r['why'] = REASON[r['line']]

bycase = collections.defaultdict(list)
for r in ROWS:
    bycase[r['cid']].append(r)

# Categories that are SATISFIED without any live data work on our part.
SELF_MET = {'ENV', 'TOOL', 'UISTATE', 'NOTE'}
NEEDS_LIVE = {'DATA_OPEN', 'DATA_SHAPE', 'VOLUME'}
NOT_OURS = {'BARRED_TO_US', 'EXTERNAL', 'UNKNOWN'}

cases = {}
for cid, rs in bycase.items():
    cats = {x['cat'] for x in rs}
    cases[str(cid)] = {
        'cid': cid, 'report': rs[0]['report'], 'cats': sorted(cats),
        'lines': [{'line': x['line'], 'cat': x['cat']} for x in rs],
        'not_ours': sorted(cats & NOT_OURS),
        'needs_live': sorted(cats & NEEDS_LIVE),
        'self_met_only': cats <= SELF_MET,
    }

allcids = {c['id'] for c in json.load(open('/tmp/rs812/live_now.json'))['cases'] if c['created_by'] == 3}
for cid in allcids - {int(k) for k in cases}:
    cases[str(cid)] = {'cid': cid, 'report': '?', 'cats': ['NOPRECOND'], 'lines': [],
                       'not_ours': [], 'needs_live': [], 'self_met_only': True}

json.dump(cases, open('/tmp/rs812/classified.json', 'w'), indent=1)

cc = collections.Counter(r['cat'] for r in ROWS)
print('LINES by category (873 total):')
for k, v in cc.most_common():
    print(f'  {v:5d}  {k}')
print()
print(f'CASES: {len(cases)}')
print(f'  every line self-met (no live data needed): {sum(1 for c in cases.values() if c["self_met_only"])}')
print(f'  needing a LIVE data check:                 {sum(1 for c in cases.values() if c["needs_live"])}')
print(f'  carrying a line NOT establishable by us:   {sum(1 for c in cases.values() if c["not_ours"])}')
print(f'    of which EXTERNAL (truly impossible):    {sum(1 for c in cases.values() if "EXTERNAL" in c["cats"])}')
print(f'    of which BARRED_TO_US (session limit):   {sum(1 for c in cases.values() if "BARRED_TO_US" in c["cats"])}')
print(f'    of which still UNKNOWN:                  {sum(1 for c in cases.values() if "UNKNOWN" in c["cats"])}')
rem = [r for r in ROWS if r['cat'] == 'UNKNOWN']
print()
print(f'REMAINING UNKNOWN lines: {len(rem)}')
for r in rem:
    print(f'  {r["cid"]}  {r["line"][:120]}')
