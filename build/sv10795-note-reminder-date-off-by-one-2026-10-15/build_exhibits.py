"""SV-10795 exhibits. Captures at 1600x1000 CSS, dpr 2, browser timezone America/New_York; boxes in CSS px."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'testing-tools'))
from ticket_exhibit import panel, stack, RED, GRN, BLU
EV = os.path.join(os.path.dirname(__file__), 'ev'); p = lambda n: os.path.join(EV, n)
DLG = (480, 560, 1120, 640); INP = (521, 577, 988, 617)
CARD = (300, 180, 1590, 335); DATE = (1404, 211, 1515, 239)

def pair(tag, title, picked, shown, ok, extra):
    a = panel(p(f'{tag}-1-picked.png'), DLG, title, boxes=[(*INP, BLU, 1)], notes=[(1, BLU, f'Reminder Date picked in the calendar: {picked}.')])
    b = panel(p(f'{tag}-2-list.png'), CARD, 'After Save, on the Notes tab', boxes=[(*DATE, GRN if ok else RED, 2, 'right')],
              notes=[(2, GRN if ok else RED, shown + extra)])
    return [a, b]

stack(pair('P-T1-NY', 'BEFORE - production (v26.40.17-f5bf8f4), browser in New York, 14 Oct 2026 11:22 PM', 'Oct 15, 2026 (tomorrow)',
           'Shows "Oct 14, 2026" in red, one day early.', False, '') +
      pair('T1b-NY', 'AFTER - QA branch sv10795 (v26.40.17-5d3a257), same browser, 14 Oct 2026 11:40 PM', 'Oct 15, 2026 (tomorrow)',
           'Shows "Oct 15, 2026" in grey.', True, '')).save(p('sv10795-01-before-after-hd.png'))
stack(pair('P-T4-NY-morning', 'BEFORE - production, browser in New York, 15 Oct 2026 10:00 AM', 'Oct 16, 2026 (tomorrow)',
           'Shows "Oct 15, 2026" in red: tomorrow\'s reminder appears as due today - the customer\'s report.', False, '') +
      pair('T4-NY-morning', 'AFTER - QA branch, same browser and time', 'Oct 16, 2026 (tomorrow)',
           'Shows "Oct 16, 2026" in grey.', True, '')).save(p('sv10795-02-morning-before-after-hd.png'))
print('ok')
