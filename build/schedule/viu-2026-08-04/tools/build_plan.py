#!/usr/bin/env python3
"""Build the TestRail update plan for the 2026-08-04 Schedule live VIU.

Per case the ONLY field written is custom_expected, rebuilt as:
    <original expected, with any previous provenance block stripped>
    [ + a KNOWN-ISSUE / DO-NOT-AUTOMATE / CANNOT-BE-RUN block when the verdict needs one ]
    + the Standing Rule 54 provenance line, STATE 2 (build + date + epic + spec + anchors)

The stamper is idempotent: strip_provenance() removes a previous line so a re-stamp
REPLACES it and never appends a second.
"""
import sys, os, json, re, csv
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'provenance-2026-08-04', 'tools'))
from verdicts import V

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..')

# ── THE VARIABLES (Rule 54: single constants, not 165 hand-typed strings) ──────
BUILD_DATE   = '8/4/2026'
BUILD_MARKER = 'v3.5-4873abe'
EPIC         = 'SV-8685'
SPEC_NAME    = 'Schedule'
SPEC_VERSION = '23'
SEP  = '---'
LEAD = 'This is the expected behaviour as per'

TR = 'https://shopview.testrail.io/index.php?/cases/view/'
JIRA = 'https://shopview.atlassian.net/browse/'

# the two files a case may cite instead of / as well as the spec
GH = 'https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/main/'
TECHPLAN = ('the engineering technical plan, in this file: ' + GH
            + 'build/schedule/tech-plan-2026-07-29/TechPlan-Schedule-Module-Rewrite.md')
BRANKO   = ("Branko's answers, in this file: " + GH
            + 'build/schedule/branko-answers-2026-07-31/answers-ingested.md')

HOLD_LINE = ('DO NOT AUTOMATE YET: this behaviour is waiting on an answer from the product owner. '
             'Automating it now could lock in the wrong behaviour.')

SEC_RE = re.compile(r'§\s?\d+(?:\.\d+)?')


def anchors_for(refs):
    if not refs:
        return ''
    inner = refs
    m = re.search(r'\((.*)\)', refs, re.S)
    if m:
        inner = m.group(1)
    frags = [f for f in re.split(r'[;,]|\s\+\s', inner) if not re.search(r'tech[- ]plan', f, re.I)]
    body = ' ; '.join(frags)
    out = []
    for s in SEC_RE.findall(body):
        s = s.replace('§ ', '§')
        if s not in out:
            out.append(s)
    return ', '.join(out)


def strip_provenance(expected):
    """IDEMPOTENT: drop a previously written provenance block."""
    if not expected:
        return expected or ''
    lines = expected.split('\n')
    for i in range(len(lines) - 1):
        if lines[i].strip() == SEP and lines[i + 1].lstrip().startswith(LEAD):
            return '\n'.join(lines[:i]).rstrip()
    for i, ln in enumerate(lines):
        if ln.strip().startswith(LEAD):
            j = i - 1
            if j >= 0 and lines[j].strip() == SEP:
                return '\n'.join(lines[:j]).rstrip()
            return '\n'.join(lines[:i]).rstrip()
    return expected.rstrip()


def strip_blocks(expected):
    """Remove any KNOWN-ISSUE / DO-NOT-AUTOMATE / CANNOT block a previous pass wrote,
    so this pass replaces rather than stacks them."""
    markers = ('Known issue on the build tested', 'DO NOT AUTOMATE YET',
               'Not built on the build tested', 'This test cannot be run on the build tested',
               'Note for the tester:')
    lines = expected.split('\n')
    keep, i = [], 0
    while i < len(lines):
        if any(lines[i].lstrip().startswith(m) for m in markers):
            while i < len(lines) and lines[i].strip():
                i += 1
            while i < len(lines) and not lines[i].strip():
                i += 1
            continue
        keep.append(lines[i]); i += 1
    return '\n'.join(keep).rstrip()


# ── the tester-facing block each verdict earns ────────────────────────────────
def block_for(cid, verdict, ticket, note):
    if verdict == 'PASS':
        if cid in (29969, 29971, 29974, 30006):
            return ('Known issue on the build tested: the time this test talks about is stored '
                    'correctly but the Schedule SHOWS it six hours later than it should be, so a '
                    '7:00 AM start reads 1:00 PM on screen. That is already raised with the '
                    'developers as SV-8848 (' + JIRA + 'SV-8848). Check the value is right by the '
                    'rule this test describes, and ignore the six-hour display shift - do not '
                    'raise a new ticket for it.')
        if cid == 29939:
            return ('Note for the tester: searching the number exactly as the card shows it (for '
                    'example S-9379) does work. Searching the longer shop-prefixed form (for '
                    'example S8685-9379) returns nothing; that is already raised as SV-8841 ('
                    + JIRA + 'SV-8841) and is not part of this test.')
        if cid == 30045:
            return ('Note for the tester: the VIN staying visible in the hover summary and in the '
                    'shift window while the VIN switch is off is CORRECT and is what this test '
                    'expects. The product owner ruled on 31 July 2026 that the VIN is always '
                    'visible on hover regardless of the switch. If you see it there, pass this test.')
        if cid == 30011:
            return ('Note for the tester: the absence of any money figure is CORRECT and is what '
                    'this test expects. The product owner ruled on 22 July 2026 that no total in '
                    'dollars is shown anywhere on the Schedule. If you see no money figure, pass '
                    'this test.')
        return None
    if cid in CORRECT:
        return ('Note for the tester: steps 5 to 7 above were corrected against the build on '
                '4 August 2026 after checking it live. What the build does is right; our earlier '
                'wording asked for something the specification never required. Follow the wording '
                'as it now reads and pass the test if the build matches it.'
                if cid == 29967 else
                'Note for the tester: this expected result was corrected against the build on '
                '4 August 2026 after checking it live. A line badged Complete was approved before '
                'it was completed, so seeing Authorized and Complete lines here is right; only a '
                'line that was never approved should be absent.')
    if verdict == 'DEV':
        if ticket:
            return ('Known issue on the build tested: ' + note.split('. ', 1)[-1].strip()
                    + ' This is already raised with the developers as ' + ticket + ' ('
                    + JIRA + ticket + '). Until it is fixed this test will fail - mark it FAILED '
                    'and link ' + ticket + '; do not raise a new ticket.')
        return ('Known issue on the build tested: ' + note.split('. ', 1)[-1].strip()
                + ' It has been reported to the QA lead but has no developer ticket yet. Mark this '
                'test FAILED and note it in your run comment; do not raise a new ticket without '
                'asking the QA lead.')
    if verdict == 'NOTBUILT':
        t = (' It is already raised with the developers as ' + ticket + ' (' + JIRA + ticket + ').') if ticket else \
            (' It has no developer ticket yet - report it to the QA lead rather than raising one yourself.')
        return ('Not built on the build tested: ' + note.split('. ', 1)[-1].strip() + t
                + ' Mark this test BLOCKED - not failed - because the feature it checks does not '
                'exist yet on this build.')
    if verdict == 'HELD':
        return (HOLD_LINE + ' The specification says this two different ways and no ruling exists '
                'yet, so mark this test BLOCKED - not failed - and leave it out of the automation '
                'suite. The open question and its evidence are recorded in ' + BRANKO)
    if verdict == 'EXT':
        return ('This test cannot be run on the build tested: ' + note.split(': ', 1)[-1].strip()
                + ' Mark it BLOCKED - not failed - and say which of these you could not set up.')
    return None


def provenance(cid, refs, verdict):
    anch = anchors_for(refs)
    spec = 'the ' + SPEC_NAME + ' specification version ' + SPEC_VERSION + ((' (' + anch + ')') if anch else '')
    lead = (LEAD + ' the build tested on ' + BUILD_DATE + ' (' + BUILD_MARKER + '), and as per epic '
            + EPIC + ' and ')
    # honesty variants -------------------------------------------------------
    if cid in (38867, 38868, 38869, 38870, 38871, 38875):        # no spec anchor at all
        return (SEP + '\n' + LEAD + ' the build tested on ' + BUILD_DATE + ' (' + BUILD_MARKER
                + '), and as per epic ' + EPIC + ' and ' + TECHPLAN
                + '. No numbered requirement in the ' + SPEC_NAME + ' specification version '
                + SPEC_VERSION + ' covers this point.')
    if cid in (38863, 38873):                                    # tech-plan limits
        return (SEP + '\n' + lead + spec + ', with the specific limits above taken from '
                + TECHPLAN + '.')
    if cid in (30011, 30614, 38874):                             # PO ruling over spec text
        return (SEP + '\n' + lead + spec + '. The behaviour above follows a later product owner '
                'decision dated 22 July 2026 rather than that specification\'s wording, and that '
                'decision is recorded in ' + BRANKO + '.')
    if cid in (30034, 30045):                                    # PO ruling over spec text
        return (SEP + '\n' + lead + spec + '. The behaviour above follows a later product owner '
                'decision dated 31 July 2026 rather than that specification\'s wording, and that '
                'decision is recorded in ' + BRANKO + '.')
    if cid in (30015, 30089, 29983, 29984):                       # spec states it both ways / ruling
        return (SEP + '\n' + lead + spec + '. That specification describes this point in two '
                'different ways, so the behaviour above follows its first-release wording and a '
                'product owner decision is still awaited; the open question is recorded in '
                + BRANKO + '.')
    return SEP + '\n' + lead + spec + '.'


# ── two cases where OUR text is wrong and the build is right ──────────────────
CORRECT = {
 # FULL REPLACEMENT texts - our wording was wrong, the build is right (checked live 2026-08-04)
 29967: ("1. 'Select multiple' switches the line rows into tick boxes - one per line.\n"
         "2. A bar appears at the bottom of the picker with a running tally of what is ticked, in "
         "the form '2 selected \u00b7 6h', and it updates as you tick and untick rows.\n"
         "3. The confirm button in that bar reads 'Schedule'.\n"
         "4. Pressing 'Schedule' creates ONE shift covering exactly the ticked lines, and the "
         "technician is added to those lines' rosters only - not to the other lines.\n"
         "5. There is no 'Select all' button and no 'Cancel' button. To leave without creating "
         "anything, close the picker with its X or press Escape."),
 29950: ("1. Every line the drill-down lists is a line that has been approved. In practice that "
         "means you will see lines badged 'Authorized' and lines badged 'Complete', because a "
         "completed line was approved before it was worked.\n"
         "2. No line that has never been approved appears anywhere in the schedule sidebar - for "
         "example a line still sitting on an estimate, or one that was declined.\n"
         "3. The line count in the drill-down header matches the number of lines actually listed."),
}


def build():
    live = json.load(open(os.path.join(ROOT, 'build/schedule/viu-2026-08-04/snapshots/live-pull.json')))
    idm = {r['testrail_case_id'].lstrip('C'): r for r in
           csv.DictReader(open(os.path.join(ROOT, 'build/schedule/testrail-id-map.csv')))}
    plan = []
    for c in live['cases']:
        cid = c['id']
        verdict, ticket, edit, note = V[cid]
        base = strip_blocks(strip_provenance(c.get('custom_expected') or ''))
        if cid in CORRECT:
            base = CORRECT[cid]
        blk = block_for(cid, verdict, ticket, note)
        parts = [base]
        if blk:
            parts.append(blk)
        parts.append(provenance(cid, c.get('refs') or '', verdict))
        new = '\n\n'.join(p for p in parts if p).replace('\n\n' + SEP, '\n\n' + SEP)
        plan.append({'case_id': cid, 'internal_id': idm[str(cid)]['internal_id'],
                     'verdict': verdict, 'ticket': ticket, 'edit': edit,
                     'changed': new != (c.get('custom_expected') or ''),
                     'intended': {'custom_expected': new}})
    return plan


if __name__ == '__main__':
    plan = build()
    out = os.path.join(ROOT, 'build/schedule/viu-2026-08-04/plan.json')
    json.dump(plan, open(out, 'w'), indent=1)
    from collections import Counter
    print('cases in plan:', len(plan), '| changed:', sum(1 for p in plan if p['changed']))
    print(Counter(p['verdict'] for p in plan))
