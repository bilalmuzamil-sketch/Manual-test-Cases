#!/usr/bin/env python3
"""Re-derive the §5.3 / §6 / §3.1 coverage rows from the LIVE case bodies and
patch COVERAGE-MAP.md, then reconcile both totals (Rule 43 / Rule 45(e)).

Every "covered" verdict quotes BOTH texts side by side, taken from live TestRail,
never from the local source and never from memory.
"""
import sys, json, re, os
sys.path.insert(0, '/tmp/sch-panel/tr')
from trlib import tr

MAP = '/home/user/Manual-test-Cases/build/schedule/coverage-rederivation-2026-08-10/COVERAGE-MAP.md'
LINK = 'https://shopview.testrail.io/index.php?/cases/view/'
NEW = {'SCH-PANEL-01': 43582, 'SCH-PANEL-02': 43583, 'SCH-PANEL-03': 43584,
       'SCH-PANEL-04': 43585, 'SCH-PANEL-05': 43586, 'SCH-PANEL-06': 43587}

live = {k: tr(f'get_case/{v}') for k, v in NEW.items()}

def quote(iid, pattern):
    """Pull the covering sentence VERBATIM out of the live case text."""
    txt = live[iid]['custom_expected']
    for line in txt.split('\n'):
        if pattern.lower() in line.lower():
            return line.strip()
    raise SystemExit(f'NOT FOUND in {iid}: {pattern}')

def cell(iid, pattern):
    cid = NEW[iid]
    return (f'**{iid} = [C{cid}]({LINK}{cid})**', f'*"{quote(iid, pattern)}"*')

# assertion -> (internal id, a distinctive fragment of the covering sentence)
COV = {
 '§5.3-L189.A1': ('SCH-PANEL-01', 'Clicking the button at step 4 hides the left panel'),
 '§5.3-L189.A2': ('SCH-PANEL-01', "It sits above the grid's left-hand column"),
 '§5.3-L189.A3': ('SCH-PANEL-01', 'It sits together with the date controls'),
 '§5.3-L190.A1': ('SCH-PANEL-01', 'The button shows a small picture only'),
 '§5.3-L190.A2': ('SCH-PANEL-01', 'The picture on the button is exactly the same in both states'),
 '§5.3-L190.A3': ('SCH-PANEL-01', 'the tooltip reads: Hide panel'),
 '§5.3-L191.A1': ('SCH-PANEL-02', 'The dividing line between the panel and the grid goes away'),
 '§5.3-L191.A2': ('SCH-PANEL-02', 'The grid grows into the space the panel gave up'),
 '§5.3-L192.A1': ('SCH-PANEL-03', 'Nothing has been reset, cleared or reloaded'),
 '§5.3-L192.A2': ('SCH-PANEL-03', 'The text you typed is still in the Search work orders box'),
 '§5.3-L192.A3': ('SCH-PANEL-03', 'The work order you had opened is still the selected one'),
 '§5.3-L192.A4': ('SCH-PANEL-03', 'it returns to whichever of the two views was open'),
 '§5.3-L193.A2': ('SCH-PANEL-04', 'The panel button still works on a narrow window'),
 '§5.3-L193.A3': ('SCH-PANEL-04', 'Your choice only stops applying when the window is resized'),
 '§5.3-L194.A1': ('SCH-PANEL-05', 'It sits against the edge of the browser window with a normal margin'),
 '§5.3-L195.A2': ('SCH-PANEL-06', 'it is a working-mode preference for the session you are in'),
 '§6-L200.A1':   ('SCH-PANEL-01', 'Clicking the button at step 4 hides the left panel'),
 '§3.1-L44.A1':  ('SCH-PANEL-02', 'The grid grows into the space the panel gave up'),
}
NIT = {
 '§5.3-L195.A1': ('NOT-INDEPENDENTLY-TESTABLE',
   'Describes the PROTOTYPE, not a requirement on the build - and the very next clause '
   '(`§5.3-L195.A2`) states the build requirement, which SCH-PANEL-06 = [C43587]'
   '(https://shopview.testrail.io/index.php?/cases/view/43587) asserts. Recorded as a '
   'deliberate non-authoring rather than left as a hole (Rule 46).'),
}

src = open(MAP).read()
patched = 0
for a, (iid, frag) in COV.items():
    case_cell, text_cell = cell(iid, frag)
    pat = re.compile(r'^(\| `' + re.escape(a) + r'` \| .*?) \| UNCOVERED \| — \| \*\*no case asserts this\*\* \|$', re.M)
    if not pat.search(src):
        raise SystemExit('row not found or already patched: ' + a)
    src = pat.sub(lambda m: f'{m.group(1)} | COVERED | {case_cell} | {text_cell} |', src)
    patched += 1
for a, (verdict, note) in NIT.items():
    pat = re.compile(r'^(\| `' + re.escape(a) + r'` \| .*?) \| UNCOVERED \| — \| \*\*no case asserts this\*\* \|$', re.M)
    if not pat.search(src):
        raise SystemExit('row not found: ' + a)
    src = pat.sub(lambda m: f'{m.group(1)} | {verdict} | — | {note} |', src)
    patched += 1

# ---- per-section totals: §3.1, §5.3, §6 ----
src = src.replace('| §3.1 | Left panel: work order sidebar ⚠️ | 20 | 18 | 0 | 1 | 0 | 1 |',
                  '| §3.1 | Left panel: work order sidebar | 20 | 19 | 0 | 0 | 0 | 1 |')
src = src.replace('| §5.3 | Panel collapse ⚠️ | 18 | 1 | 0 | 17 | 0 | 0 |',
                  '| §5.3 | Panel collapse | 18 | 17 | 0 | 0 | 0 | 1 |')
src = src.replace('| §6 | Grid toolbar ⚠️ | 20 | 10 | 0 | 1 | 0 | 9 |',
                  '| §6 | Grid toolbar | 20 | 11 | 0 | 0 | 0 | 9 |')

# ---- Direction-1 totals: 18 newly COVERED, 1 newly NOT-INDEP-TESTABLE ----
src = src.replace('| **COVERED** | **282** |', '| **COVERED** | **300** |')
src = src.replace('| **UNCOVERED** | **19** |', '| **UNCOVERED** | **0** |')
src = src.replace('| **NOT-INDEPENDENTLY-TESTABLE** | **91** |', '| **NOT-INDEPENDENTLY-TESTABLE** | **92** |')
src = src.replace('282 + 4 + 19 + 1 + 91 = **397**.', '300 + 4 + 0 + 1 + 92 = **397**.')

open(MAP, 'w').write(src)
print('rows re-derived and patched:', patched)
