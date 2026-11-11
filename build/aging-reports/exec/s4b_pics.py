"""s4b_pics.py — 11 Nov 2026: annotated pictures for S4 C715361, C715366, C715368, C715369, C715603, C715604, C715370, C715371."""
import json, sys; sys.path.insert(0, '.'); from ann import ann
P = 'pics/'
def go(c, n, i, title, marks):
    s = [x for x in json.load(open('s4/%s.json' % c))['shots'] if x['name'] == n][0]; return ann(s['f'], P + '%s-%d-%s.png' % (c, i, n), title, s['boxes'], marks)
go('C715361', '1-open', 1, 'Steps 1-3: 91+ bucket (11,912 lines) opened: first 100 lines, then pages of 100 on scroll, none repeated', [(r'^keyboard_arrow_down 91', 'good', 'Bucket A opened: 100 lines first, then more on scroll (75 more pages read, no line repeated)')])
go('C715361', '5-expand-all', 2, 'Steps 4-7: bucket closed, then Expand all: bucket A again shows 100 lines, then more on scroll', [(r'^keyboard_arrow_down Date', 'good', 'Expand all clicked: every bucket open'), (r'^keyboard_arrow_down 91', 'good', 'Bucket A: 100 lines, then more on scroll')])
go('C715366', '0-A-open', 1, 'Start: only customer A (Bancescu & Sons) expanded', [(r'Bancescu', 'good', 'Customer A open; others among the first 30 closed')])
go('C715366', '2-back-top', 2, 'After scrolling (22 more customers loaded, no page buttons) and back to the top', [(r'Bancescu', 'good', 'Customer A still open'), (r"^keyboard_arrow_right Andrews", 'good', 'Other groups still closed')])
for c, kind, first in [('C715368', 'A/R Aging Detail', r'^keyboard_arrow_(right|down) 91'), ('C715369', 'A/P Aging Detail', r'^keyboard_arrow_(right|down) 91'), ('C715603', 'A/R Aging Collection', r"^keyboard_arrow_(right|down) Andrews"), ('C715604', 'A/P Unpaid Invoices', r'^keyboard_arrow_(right|down) #1 Diesel')]:
    go(c, '1-before', 1, 'Step 1: %s opened: every group closed (chevrons point right)' % kind, [(first, 'good', 'First group closed')])
    go(c, '2-changed', 2, 'Step 2: the first group opened with its own chevron', [(first, 'good', 'Changed: now open')])
    go(c, '4-back', 3, 'Steps 3-4: after Sales By Customer and back: same as step 1, the change was not kept', [(first, 'good', 'Closed again: the open group was not remembered')])
for c, grp in [('C715370', r'^keyboard_arrow_right 31-60'), ('C715371', r'^keyboard_arrow_right (Andrews|ZZAUTOTEST LOC MIX)')]:
    go(c, '1-yesterday', 1, 'Step 1: as-of changed to yesterday (11/09/2026): every group collapsed', [(r'As of: 11/09/2026', 'good', 'Date changed to yesterday'), (r'^keyboard_arrow_right Date', 'good', 'Button points right: every group collapsed')])
    go(c, '3-filtered', 2, 'Steps 2-3: after Expand all, ticking customer A collapsed every group', [(r'Customer: ZZAUTOTEST LOC MIX', 'good', 'Only customer A'), (r'^keyboard_arrow_right Date', 'good', 'Every group collapsed')])
    go(c, '5-pastdue', 3, 'Steps 4-5: after Expand all, ticking "31-60 days" collapsed every group', [(r'Past due: 31-60', 'good', 'Past due 31-60 ticked'), (r'^keyboard_arrow_right Date', 'good', 'Every group collapsed')])
    go(c, '7-location', 4, 'Steps 6-7: after Expand all, unticking location B collapsed every group', [(r'Location: Staging Heavy', 'good', 'Location B (Lethbridge) unticked'), (r'^keyboard_arrow_right Date', 'good', 'Every group collapsed')])
