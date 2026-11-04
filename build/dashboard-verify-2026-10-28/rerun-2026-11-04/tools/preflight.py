#!/usr/bin/env python3
"""Rule 99 preflight for the 4 Nov 2026 Dashboard re-run: read every location's zone LIVE from the server and refuse to run
if any tool list disagrees. Also records the staging build. SECRET-FREE (cookie from /tmp/cln/sess-admin.txt)."""
import json, re, subprocess, sys, os, datetime as dt
sys.path.insert(0, os.path.dirname(__file__))
from collect_dashboard import curl, WORKPLACES
c, b = curl('GET', '/api/staff/my-workplaces')
live = {}
def walk(o):
    if isinstance(o, dict):
        if 'timezone' in o and 'id' in o and 'name' in o: live[o['id']] = (o['name'], o['timezone'])
        for v in o.values(): walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
walk(b)
html = subprocess.run(['curl', '-sS', '-4', 'https://app.staging.shopview.com/'], capture_output=True, text=True).stdout
m = re.search(r'name="app-version"\s+content="([^"]+)"', html) or re.search(r'content="([^"]+)"\s+name="app-version"', html)
out = {'at_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'status': c, 'build': m and m.group(1), 'locations': []}
ok = c == 200
for wid, name, tz in WORKPLACES:
    ln, lz = live.get(wid, (None, None)); same = lz == tz
    ok &= same; out['locations'].append({'id': wid, 'name': name, 'tool_tz': tz, 'server_tz': lz, 'match': same})
tools = os.path.dirname(os.path.abspath(__file__))
for f in ('screen_check.mjs', 'screen_expanded.mjs', 'screen_atrisk.mjs'):
    s = open(os.path.join(tools, f)).read()
    for wid, (ln, lz) in live.items():
        mm = re.search(re.escape(wid) + r"'\s*,\s*'[^']*'\s*,\s*'([^']+)'", s)
        if mm and mm.group(1) != lz: ok = False; out['locations'].append({'file': f, 'id': wid, 'tool_tz': mm.group(1), 'server_tz': lz, 'match': False})
out['OK'] = ok
print(json.dumps(out, indent=1))
sys.exit(0 if ok else 3)
