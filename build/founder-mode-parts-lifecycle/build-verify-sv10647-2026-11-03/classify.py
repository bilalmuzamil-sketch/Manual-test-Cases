# Sort our 360 cases by the setup recipes their preconditions and steps need.
import json, glob, re, html, collections
cs = sorted([json.load(open(f)) for f in glob.glob('before/*.json')], key=lambda c: c['id'])
o = [c for c in cs if c['created_by'] == 3 and c['id'] not in (425662, 425725, 425726)]
def t(s): return html.unescape(re.sub(r'<[^>]+>', '\n', s or ''))
TRIG = {  # recipe -> regex over preconds+steps
 'part': r'\b(Create|Have)\b[^.\n]*\bparts?\b', 'inactive': r'inactive', 'locB': r'location B|two locations|three locations|location C',
 'role': r'custom role|role B|role C|role D|Service Manager role', 'userB': r'user B|staff member|private window', 'import': r'import', 'wo': r'work order',
 'partsale': r'part sale', 'po': r'purchase order', 'return': r'return [AB]\b|vendor return|Create Return', 'vbill': r'vendor bill|bill A|Vendor Invoices',
 'canned': r'canned job', 'special': r'special.order', 'negbin': r'goes to -|below zero|to -\d', 'prerelease': r'before this release|before the release|from before',
 'earlierday': r'earlier day|date A', 'invoice': r'invoiced|invoice', 'ivr': r'Inventory Value', 'velocity': r'Parts Velocity', 'design': r'design picture|board',
 'theme': r'Light theme|Dark|theme', 'twotabs': r'second (browser )?tab|tab 2|browser 2|window 2', 'screenreader': r'screen reader', 'export': r'Export|exported',
 'cycle': r'Cycle count', 'bookmark': r'bookmark', 'newloc': r'newly created location|no inactive parts at all|no untracked part', 'fortyplus': r'forty|more than \d+ active|201|35 parts',
 'partrequest': r'(open|a|two) part requests?\b|Part Requests? (for|N)|Part Request [0-9]|on an open part request', 'core': r'Core Charge|core', 'manyloc': r'location C',
}
HARD = {'special', 'negbin', 'prerelease', 'earlierday', 'bookmark', 'newloc', 'vbill', 'canned', 'po', 'return', 'partrequest', 'fortyplus'}
rows = []
for c in o:
    txt = t(c['custom_preconds']) + '\n' + t(c['custom_steps'])
    tr = sorted(k for k, p in TRIG.items() if re.search(p, txt, re.I))
    rows.append({'id': c['id'], 'title': c['title'], 'sec': c['section_id'], 'trig': tr, 'hard': sorted(set(tr) & HARD)})
json.dump(rows, open('classify.json', 'w'), indent=0)
print('total', len(rows), 'no-hard', sum(1 for r in rows if not r['hard']), 'hard', sum(1 for r in rows if r['hard']))
print(collections.Counter(k for r in rows for k in r['trig']).most_common())
print('hard by kind', collections.Counter(k for r in rows for k in r['hard']).most_common())
