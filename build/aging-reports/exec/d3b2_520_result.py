"""d3b2_520_result.py — 11 Nov 2026: C715520 (A/R Collection: part sale P3-188 at Lethbridge opens the "Switch location?" dialog; compared with the
existing prompt) from the d3b2 light-theme re-run + d3e (existing prompt via /workorders/<id>?locationId=<Lethbridge>, L0682). SV-12139 outcome (3)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 'd3b/C715520.json')); e = json.load(open(PP + 'd3e/out.json'))['a-locationId']; C = 'C715520'
assert o['text'] == ['Switch location?', 'close', 'This part sale is in Staging Lethbridge - 4310. Switch your active location to view it?', 'Cancel', 'Switch location'] and o['afterCancel']['dialogs'] == 0
assert e['dialog']['text'][0] == 'Switch location?' and e['dialog']['box']['x'] == 416
D = (416, 345, 608, 201)
R = {C: {'verdict': 'Passed', 'observed': [
    'A/R Aging Collection, as of today, signed in at Staging Heavy Duty - 9919, customer "Doi Truck Center" ticked; part sale invoice P3-188 made at Staging Lethbridge - 4310.',
    'Step 1: clicking P3-188 opens a dialog over the report. Read in order: "Switch location?", "This part sale is in Staging Lethbridge - 4310. Switch your active location to view it?", "Cancel" on the left, "Switch location" (small l) on the right, and a close × at the top right.',
    'Step 2: the existing prompt (a Lethbridge work order opened from its address in a second tab) has the same title, box size and place on the screen and the same two buttons in the same places; its own right-hand button reads "Switch Location" with a capital L - the work order page\'s wording, kept unchanged there; the report\'s dialog uses the small l as the requirement says.',
    'Step 3: "Cancel" closes the dialog and leaves the report as it was.',
    'Steps 4-5: in dark theme the dialog opens again and is readable.',
    'This test carried a "what you should see today" note for a known problem (the button read "Switch Location" with a capital L). That problem is gone - the fix has shipped, so the note can come off.'],
    'pictures': [P(C, 'd3b/C715520-1-dialog.png', 'Step 1: "This part sale is in Staging Lethbridge - 4310..." - Cancel left, "Switch location" right', [D + ('good', 'Exact wording')]),
                 P(C, 'd3e/1-a-locationId.png', 'Step 2: the existing prompt in a second tab - same look and place', [D + ('good', 'Same box and place')]),
                 P(C, 'd3b/C715520-2-cancelled.png', 'Step 3: Cancel - the dialog closes, the report is unchanged', []),
                 P(C, 'd3b/C715520-3-dark-dialog.png', 'Steps 4-5: dark theme - the dialog is readable', [D + ('good', 'Readable')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d3b2 + d3e C715520'}, 'results': R}, open(PP + 'RESULTS-d3b2-520.json', 'w'), indent=1); print(list(R))
