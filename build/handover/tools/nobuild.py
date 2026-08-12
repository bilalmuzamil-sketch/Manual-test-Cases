#!/usr/bin/env python3
"""For every case with no 'Last checked against build' sentence, does it SAY so? READ ONLY."""
import json, sys, re
sys.path.insert(0, '/tmp/hand12')
from tr import api

IDS = {
    'Filters': [29558, 29559, 29600, 29609, 29610, 29612, 43560, 29621, 43563, 43562],
    'Schedule': [43588, 43589],
    'Report Suite': [43591, 43558, 43550, 30169, 43559, 30288, 43592, 43593, 43594],
}
SAYS = re.compile(r'not (?:yet )?been checked against|has not been checked|not yet checked '
                  r'against any build|no build|not been run against', re.I)

for proj, ids in IDS.items():
    print(f'\n===== {proj}')
    for cid in ids:
        d, s = api(f'get_case/{cid}')
        exp = (d.get('custom_expected') or '').replace('\r', '')
        m = SAYS.search(exp)
        print(f'  C{cid}  says-so={"YES" if m else "NO "}  {d["title"][:52]}')
        if m:
            i = max(0, m.start() - 90)
            print(f'        ...{exp[i:m.end()+110].strip()[:210]}')
