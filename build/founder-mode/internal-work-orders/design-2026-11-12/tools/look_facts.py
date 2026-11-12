#!/usr/bin/env python3
"""Look facts for the visual inventory: computed style of the feature's own texts on every board (from render/render-log-*.json).
python3 -I tools/look_facts.py > render/look-facts.txt"""
import json, glob, ast, os, re
from collections import defaultdict
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = re.compile(r'^(Internal|No Charge|NO CHARGE|INTERNAL|Closed · Internal|Closed · No Charge|Closed|Internal Work Orders|Close Work Order|Reopen|Reopen Work Order|Convert to No Charge|Convert to Billable|Change category|Mark as No Charge|Mark as Billable|Classification.*|Billable|Cost|Hours|\$0\.00|Warranty|Held|No Charge category|Internal category|Save|Cancel|Close|Internal customer|Default internal category)$')
agg = defaultdict(lambda: defaultdict(list))
for p in sorted(glob.glob(os.path.join(ROOT, 'render', 'render-log-[0-9].json'))):
    for k, b in json.load(open(p))['boards'].items():
        rows = b['rows']
        for r in rows:
            t = r['text'].strip()
            if KEY.match(t) and not r['covered']:
                sig = '%s %s %s bg=%s %s %s h=%s' % (r['tag'], r['size'], r['weight'], r['bg'], r['color'], r['transform'], r['h'])
                agg[t][sig].append('%s-%s' % (b['page'], b['nn']))
for t in sorted(agg):
    print('==', t)
    for sig, bs in sorted(agg[t].items(), key=lambda x: -len(x[1])):
        print('   %3d  %s   e.g. %s' % (len(bs), sig, ' '.join(sorted(set(bs))[:6])))
