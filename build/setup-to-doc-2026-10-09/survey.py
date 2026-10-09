# Survey the suites named by the QA lead on 9 Oct 2026 (testers: steps and preconditions too detailed).
import sys, json, re, collections
sys.path.insert(0, 'build/maintenance-reminder-v2')
from mr_lib import api
OUT = 'build/setup-to-doc-2026-10-09'
secs, off = [], 0
while True:
    r = api(f'get_sections/1&suite_id=1&offset={off}&limit=250'); ss = r['sections'] if isinstance(r, dict) else r
    secs += ss
    if len(ss) < 250: break
    off += 250
json.dump(secs, open(f'{OUT}/sections.json', 'w'))
top = [s for s in secs if s['parent_id'] is None]
pat = re.compile(r'dvi|digital insp|dashboard|part sale|notification|what|why|pric|categor|part lifecycle|maintenance', re.I)
for s in top:
    if pat.search(s['name']): print(s['id'], '|', s['name'])
