"""Exhibit 04 — a fee/discount on a PART line: the preview on both builds."""
import sys, json
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import panel, stack, GRN

g = {k: json.load(open(f'/tmp/qa9480b/geo-{k}.json')) for k in ('prod', 'branch')}
S = {'prod': '/tmp/qa9480b/prod-part-EDIT.png', 'branch': '/tmp/qa9480b/branch-part-EDIT.png'}
TITLE = {'prod': 'PRODUCTION  app.shopview.com', 'branch': 'FIX BRANCH  sv9480.qa.shopview.com'}
SUB = {'prod': 'build v26.39.2-1aeb22d  ·  30 September 2026',
       'branch': 'build v26.39.1-59f1f91  ·  30 September 2026'}

panels = []
for k in ('prod', 'branch'):
    b = g[k]['editPreview']
    pad = 26
    crop = (max(0, b['x']-pad), max(0, b['y']-90), b['x']+b['w']+pad, b['y']+b['h']+pad)
    panels.append(panel(S[k], crop, TITLE[k], SUB[k],
                        item=(b['x'], b['y'], b['w'], b['h']), c=GRN,
                        item_note=g[k].get('note', 'the preview'), gutter=360))

stack(panels, g.get('footer') or
      'Editing a discount that sits on a PART line. Both builds start from the part’s own '
      'pre-discount total and reach the same answer — this half of the screen was not part of '
      'the change and has not moved.').save(
    '/home/user/Manual-test-Cases/build/sv9480-discount-preview-2026-09-30/ev/04-part-line-unchanged.png')
print('written')
