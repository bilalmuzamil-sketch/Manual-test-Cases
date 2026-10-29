import json, sys
for m in sys.argv[1:]:
    d = json.load(open(f'../../evidence/f1/ui-{m}.ui.json')); me = d['meta']; g = me.get('location_guard') or {}
    print(f"== {m} {me.get('appVersion')} zones={me['browser_zone']},{me['process_zone']},{me['app_timezone_key']},{me['location_tz']} guard={g.get('VALID')} xloc={g.get('x_location_ids_seen')} err={me.get('error')}")
    for k, v in d.get('runs', {}).items():
        if isinstance(v, dict):
            keep = {x: v[x] for x in ('tile', 'target', 'parent_row', 'chip_after', 'rows', 'per_tab', 'target_day', 'target', 'days_over_24_all_staff', 'error', 'expand') if x in v}
            if 'controls' in v and isinstance(v['controls'], list): keep['controls'] = [c for c in v['controls'] if 'clear' not in c]
            if 'detail_controls' in v: keep['detail'] = [c for c in v['detail_controls'] if 'filter_chip_' in c and 'clear' not in c]
            print(' ', k, json.dumps(keep)[:1400])
        else: print(' ', k, json.dumps(v)[:300])
