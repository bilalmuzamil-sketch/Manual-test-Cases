"""Compact summary of f1inv/f1ui JSON: zones, version, controls (id=text), tabs, heads, range menu, reporting requests."""
import json, sys
for f in sys.argv[1:]:
    d = json.load(open(f)); m = d['meta']
    print('==', m['label'], m.get('appVersion'), '| zones', m['browser_zone'], m['process_zone'], m['app_timezone_key'], '| url', m.get('url_at_end'))
    print('  storage_end', {k: v[:90] for k, v in (m.get('storage_at_end') or {}).items() if k not in ('user', 'token', 'fe_permissions_wrapper', 'organization_features', 'organization_features_timestamp', 'mode')})
    for k, v in d.items():
        if k in ('meta', 'requests'): continue
        if isinstance(v, dict) and 'chips' in v:
            print(' ', k, 'chips:', [c['id'] + '=' + c['text'] + ('' if c['checked'] is None else '[' + c['checked'] + ']') for c in v['chips'] if not c['id'].startswith(('module_selector', 'global_search'))][:30])
            print('    tabs', v['tabs'], '| heads', v['heads'][:25], '| inputs', [i for i in v['inputs']][:6])
        elif k == 'range_menu': print('  range_menu', v)
        elif k not in ('tiles',): print(' ', k, json.dumps(v)[:400])
    for r in d['requests']:
        if '/reporting/' in r['url'] or '/dashboard/' in r['url'] or '/export' in r['url']: print('   REQ', r['phase'], r['status'], r['url'][:330])
