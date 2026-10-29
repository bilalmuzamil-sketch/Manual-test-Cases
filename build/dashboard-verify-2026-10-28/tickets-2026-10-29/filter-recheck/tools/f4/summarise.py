"""Bounded summary of the F4 screen evidence (meta.json per mode). No network. python3 summarise.py <mode> [<mode>..]"""
import json, sys
EV = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f4'
for mode in sys.argv[1:]:
    m = json.load(open(f'{EV}/{mode}/meta.json')); n = m['notes']
    print(f'== {mode}', m.get('appVersion'), 'browser', m['browser_zone'], 'process', m['process_zone'], 'app tz key', (n.get('storage_after_open') or {}).get('local', {}).get('timezone'))
    print('  header location:', (n.get('header') or '')[-40:])
    print('  url', (n.get('storage_after_open') or {}).get('url'), '| session keys', list(((n.get('storage_after_open') or {}).get('session') or {}).keys()))
    for k in ('active_tab', 'table_bottom', 'location_switcher', 'cm_rows_in_dom', 'cm_sample_cells', 'testvt1_cm_rows_in_dom', 'dialog_fresh', 'dialog_after_report', 'range_options', 'finance'):
        if k in n: print(f'  {k}:', json.dumps(n[k], default=str)[:700])
    if 'heads' in n: print('  heads', n['heads'])
    if mode.startswith('qb') or mode.startswith('ibs'):
        if 'ready_rows' in n: print('  ready rows', [r for r in n['ready_rows'] if r][:12])
    print('  requests', [(r['u'][:230]) for r in m['requests']][:8])
    for r in m['replies']: print('  reply', r['u'][:110], {k: r.get(k) for k in ('n', 'pag', 'blank_by_type', 'types', 'testvt1_cm_oct22', 'zero', 'batches') if r.get(k) is not None})
    for k, v in (m.get('exports') or {}).items(): print('  export', k, v)
