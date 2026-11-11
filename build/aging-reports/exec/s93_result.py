"""s93_result.py — 11 Nov 2026: C715343 (A/R Detail export "Locations:" line in Location-menu A-Z order, not tick order). EXPECT FAIL SV-12141 marker:
outcome (3) - it PASSES, the fix shipped (SV-12141 read live 11 Nov 2026: QA Complete)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b): src = PP + 's93/' + n; dst = PP + 'pics/%s-%s' % (cid, n); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 's93/C715343.json')); WANT = 'Locations: Staging Heavy Duty - 9919, ZZAUTOTEST V1R-87 Location C'
assert o['pdfLines'] == [WANT] and WANT in o['csvLines'] and o['chip2'].startswith('place Location: 2 locations') and 'ZZAUTOTEST V1R-' in o['chip1']
C = 'C715343'; CHIP = (880, 118, 220, 32)
R = {C: {'verdict': 'Passed', 'observed': [
    'A/R Aging Detail, as of today, Location filter cleared first (no location ticked).',
    'Step 1: ticking location C ("ZZAUTOTEST V1R-87 Location C") - the chip reads "Location: ZZAUTOTEST V1R-..." (the long name shortened, as the other reports\' chips do).',
    'Step 2: ticking location A ("Staging Heavy Duty - 9919") as well - the chip reads "Location: 2 locations".',
    'Steps 3-4: the PDF downloads; under its title it reads "Locations: Staging Heavy Duty - 9919, ZZAUTOTEST V1R-87 Location C" - the Location menu\'s A to Z order, not the order ticked. Staging Lethbridge - 4310 is not named.',
    'Steps 5-6: the CSV downloads; its second line reads the same "Locations: Staging Heavy Duty - 9919, ZZAUTOTEST V1R-87 Location C".',
    'This test carried a "what you should see today" note for a known problem (locations listed in the order ticked). That problem is gone - the fix has shipped, so the note can come off.'],
    'pictures': [P(C, 'C715343-1-C-ticked.png', 'Step 1: location C ticked - chip "Location: ZZAUTOTEST V1R-..."', [CHIP + ('good', 'Location C')]),
                 P(C, 'C715343-2-A-ticked.png', 'Step 2: A ticked too - chip "Location: 2 locations"', [CHIP + ('good', '2 locations')]),
                 P(C, 'C715343-pdf-01.png', 'Step 4: PDF - "Locations: Staging Heavy Duty - 9919, ZZAUTOTEST V1R-87 Location C" (A to Z)', [(25, 128, 700, 34, 'good', 'A, then C')]),
                 P(C, 'C715343-csv-top.png', 'Step 6: CSV - the same Locations line, A then C', [])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s93 C715343'}, 'results': R}, open(PP + 'RESULTS-s93.json', 'w'), indent=1); print(list(R))
