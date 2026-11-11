"""d3b2_532_result.py — 11 Nov 2026: C715532 (A/R Summary opens A to Z and matches the design picture) from the d3b2 light-theme re-run."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
C = 'C715532'
R = {C: {'verdict': 'Passed', 'observed': [
    'A/R Aging Summary, as of today, all locations, 1440 px, light theme; compared with the design picture "A/R Aging Summary opens A to Z" (layout, labels and styles).',
    'Step 1: the title "A/R Aging Summary", a grey circled "i" right of it and a grey "⋯" at the far right, on one line.',
    'Step 2: four chips in order: "As of: 11/11/2026" (blue pill, calendar icon, down arrow), "Customer: All customers" (person icon, no fill), "Past due: Any" (hourglass, no fill), "Location: All locations" (location pin, blue pill).',
    'Step 3: headings "Customer" (small up arrow), "Location", "Current", "1-30 Days", "31-60 Days", "61-90 Days", "91 And Over", "Total", bold, each on one line; only "Customer" carries an arrow.',
    'Step 4: customer names are blue and A to Z ("10 Trucking" before "2 Trucking"); money right-aligned, empty buckets blank, a credit shows as "$-16.90"; the Total column is bold on every row.',
    'Step 5: scrolling down, the bold Totals row ($3,247.00 / $105,705.77 / $167,713.30 / $126,336.92 / $118,341.26 / $521,344.25) stays at the bottom of the table while rows scroll under it.',
    'Step 6: the table runs across the page with no card or frame, rows divided by thin lines, as in the picture.',
    'Step 7: at 1536 px nothing overlaps, is cut off or clipped; the layout is the same as at 1440 px.'],
    'pictures': [P(C, 'design-pics/ar-ap-p1-a-r-aging-summary-opens-a-to-z.png', 'The design picture', []),
                 P(C, 'd3b/C715532-1-1440.png', 'Steps 1-4 and 6: the report at 1440 px - as designed', [(278, 70, 1132, 75, 'good', 'Title and chips'), (278, 160, 1132, 48, 'good', 'Headings'), (278, 208, 300, 100, 'good', 'Blue names A to Z')]),
                 P(C, 'd3b/C715532-2-scrolled.png', 'Step 5: scrolled - the Totals row stays at the bottom', [(278, 852, 1132, 46, 'good', 'Totals stays')]),
                 P(C, 'd3b/C715532-3-1536.png', 'Step 7: 1536 px - nothing clipped, same layout', [])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d3b2 C715532'}, 'results': R}, open(PP + 'RESULTS-d3b2-532.json', 'w'), indent=1); print(list(R))
