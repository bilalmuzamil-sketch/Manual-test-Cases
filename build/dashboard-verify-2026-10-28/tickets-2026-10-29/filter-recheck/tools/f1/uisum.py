import json, sys
for f in sys.argv[1:]:
    d = json.load(open(f)); m = d['meta']
    print('==', m['label'], m.get('appVersion'), 'zones', m['browser_zone'], m['process_zone'], m['app_timezone_key'], m['location_tz'], 'err', m.get('error'))
    for k, v in d['runs'].items(): print(' ', k, json.dumps(v)[:1500])
    for k, v in (m.get('shots') or {}).items(): print('  SHOT', k, json.dumps(v)[:600])
    for r in d['requests']:
        if any(x in r['url'] for x in ('/reporting/', '/dashboard/', '/export')): print('   REQ', r['phase'], r['status'], r['url'][:300])
