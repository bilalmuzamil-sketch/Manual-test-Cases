"""d1_result.py — 11 Nov 2026: results for the per-report design tests C715481-C715498 from exec/d1/out.json (d1b run). Banner + boxes on the title
row, the heading row and the Totals row of the picture d1 took for that width/theme. KEYS maps report key -> (light 1440, dark, 1536) case ids."""
import json, sys
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
NAME = {'ars': 'A/R Aging Summary', 'ard': 'A/R Aging Detail', 'arc': 'A/R Aging Collection', 'aps': 'A/P Aging Summary', 'apd': 'A/P Aging Detail', 'apu': 'A/P Unpaid Invoices Report'}
KEYS = {'ars': (715481, 715482, 715483), 'ard': (715484, 715485, 715486), 'arc': (715487, 715488, 715489), 'aps': (715490, 715491, 715492), 'apd': (715493, 715494, 715495), 'apu': (715496, 715497, 715498)}
def runs(folder='d1'): return json.load(open(PP + folder + '/out.json'))['runs']
def pic(cid, src, title, w, extra=()):
    right = w - 30; f = PP + 'pics/C%d-%s' % (cid, src.split('/')[-1])
    boxes = [(278, 70, right - 278, 46, 'good', 'Title, info icon and ⋯ on one line'), (278, 160, right - 278, 48, 'good', 'Headings, each on one line'), (278, 852, right - 278, 46, 'good', 'Totals row')] + list(extra)
    return ann(src.replace('//', '/'), f, title, [], [], boxes)
def heads(m): return ', '.join('"%s"' % h['t'] for h in m['heads'])
