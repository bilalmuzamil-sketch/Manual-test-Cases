# Bounded summary of one screen-evidence meta.json (no secrets in it). Usage: python3 summ_screen.py <meta.json> [keys...]
import json, sys
m = json.load(open(sys.argv[1]))
print('ZONES browser=%s process=%s app_tz_key=%s location_tz=%s version=%s at=%s' % (m.get('browser_zone'), m.get('process_zone'), m.get('app_timezone_key'), m.get('location_tz'), m.get('appVersion'), m.get('observed_at_utc')))
print('ERRS', {k: v for k, v in m.items() if k.startswith('err_') or k.endswith('Err') or k.startswith('dlErr') or k.startswith('colMissing')})
for n, s in m.get('steps', {}).items():
    print('##', n, '| chips:', s['chips'])
    print('   headers(%d):' % len(s['headers']), s['headers'])
    print('   storage:', {k: v[:120] for k, v in s['storage']['local'].items()}, '| session:', list(s['storage']['session'])[:5], '| url:', s['storage']['url'][:200])
    for f, rows in s['rows'].items():
        for r in rows: print('   ROW', f, {k: v for k, v in r.items() if v and k not in ('Description',)})
    if s.get('notifications'): print('   notes', s['notifications'])
for k in sys.argv[2:]:
    print('>>', k, json.dumps(m.get(k), default=str)[:1500])
print('API (reports/prefs only):')
for a in m.get('api', []):
    if any(x in a for x in ('reports/', 'preferences', 'returns')): print('  ', a[:330])
