"""s80c_result.py — 11 Nov 2026: C715418 (A/R Collection: Cancel on the switch prompt leaves the report as it was) from exec/s80/C715418.json (s80c, 15:41)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(n, t, b=()): dst = PP + 'pics/C715418-' + n; ann(PP + 's80/' + n, dst, t, [], [], list(b)); return dst
CH = (278, 116, 1132, 36)
R = {'C715418': {'verdict': 'Passed', 'observed': [
    'A/R Aging Collection, as of today, Past due "1-30 days", sorted by Amount (largest first), a customer group open, scrolled down the list (scroll position 2294 px; top row "ZZAUTOTEST AR R03 Location B (1)", bottom row invoice S11315-17872).',
    'Step 1: the page address is .../reports/ar-aging-collection?pastDue=1-30.',
    'Step 2: clicking a work order invoice made at Staging Lethbridge - 4310 opens the "Switch location?" dialog: "This work order is in Staging Lethbridge - 4310. Switch your active location to view it?", "Cancel", "Switch location", and a close ×.',
    'Step 3: "Cancel" closes it; no message pops up; the report is exactly as before: Past due "1-30 days", the Amount sort, the open group, the same scroll position (2294 px) and the same top and bottom rows (37 rows on screen before and after).',
    'Step 4: the address is unchanged (.../ar-aging-collection?pastDue=1-30).'],
    'pictures': [P('01-C715418-0-before.png', 'Before: filtered, sorted by Amount, scrolled down', [CH + ('good', 'Past due: 1-30 days')]),
                 P('02-C715418-2-dialog.png', 'Step 2: the "Switch location?" dialog'),
                 P('03-C715418-3-after.png', 'Steps 3-4: after Cancel - same filter, sort, scroll position and rows', [CH + ('good', 'Same filters')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s80c C715418'}, 'results': R}, open(PP + 'RESULTS-s80c.json', 'w'), indent=1); print(list(R))
