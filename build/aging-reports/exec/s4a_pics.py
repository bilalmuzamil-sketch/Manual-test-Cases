"""s4a_pics.py — 11 Nov 2026: annotated pictures for S4 C715355, C715358, C715359, C715360 (from s4/*.json boxes)."""
import json, sys; sys.path.insert(0, '.'); from ann import ann
P = 'pics/'; J = lambda c: json.load(open('s4/%s.json' % c)); sh = lambda c, n: [s for s in J(c)['shots'] if s['name'] == n][0]
TIP = (256, 137, 92, 28)
def go(c, n, i, title, marks, extra=()):
    s = sh(c, n); return ann(s['f'], P + '%s-%d-%s.png' % (c, i, n), title, s['boxes'], marks, extra)
go('C715355', '1-one-open', 1, 'Step 1: one customer group opened with its own chevron', [(r"^keyboard_arrow_down Andrews", 'good', 'This group opened; its chevron now points down')])
go('C715355', '2-tip-collapse', 2, 'Step 2: the top-left button points down; tooltip "Collapse all"', [(r"^keyboard_arrow_down$", 'good', 'Button chevron points down')], [TIP + ('good', 'Tooltip reads "Collapse all"')])
go('C715355', '4-tip-expand', 3, 'Steps 3-4: every group collapsed; button points right, tooltip "Expand all"; Date sort unchanged', [(r"^keyboard_arrow_right$", 'good', 'Button chevron points right'), (r"^keyboard_arrow_(right|down) Date arrow_drop_up", 'good', 'Sort mark still on Date (column under the button not sorted)')], [TIP + ('good', 'Tooltip reads "Expand all"')])
go('C715355', '5-all-open', 4, 'Step 5: every group expanded; Date sort still unchanged', [(r"^keyboard_arrow_down Andrews", 'good', 'Groups open (all 52 open, read by scrolling)'), (r"^keyboard_arrow_(right|down) Date arrow_drop_up", 'good', 'Sort mark still on Date')])
go('C715358', '2-later-groups', 1, 'After Expand all, customers loaded later by scrolling arrive expanded', [(r"ZZAUTOTEST S1R5 Alpha", 'good', 'A customer from the later load: already expanded, rows showing')])
go('C715359', '2-later-groups', 1, 'After Expand all, vendors loaded later by scrolling arrive expanded', [(r"^Jun 11, 2026", 'good', 'Rows of a vendor that loaded on scroll (page 2+): shown without another click')])
go('C715360', '1-open', 1, 'Steps 1-3: 31-60 bucket (153 lines) opened: 100 lines, then 53 more on scroll, none repeated', [(r"^keyboard_arrow_down 31-60", 'good', 'Bucket A opened: first 100 lines, then the next 53 loaded on scroll')])
go('C715360', '5-expand-all', 2, 'Steps 5-7: Expand all; bucket A again shows 100 lines, then loads more on scroll', [(r"^keyboard_arrow_down$", 'good', 'Expand all clicked: every bucket expanded'), (r"^keyboard_arrow_down 91", 'good', 'Buckets open; bucket A (31-60, lower down) showed 100 lines, then 53 more on scroll')])
