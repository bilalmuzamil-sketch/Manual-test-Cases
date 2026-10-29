"""F3: write evidence/f3/<folder>/meta.json (Rule 99 zones + build + location check per screen run + pictures) from the screen-meta files."""
import json, glob, os
EV = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f3'
for d in sorted(glob.glob(EV + '/*/')):
    out = {'folder': os.path.basename(d.rstrip('/')), 'screen_runs': {}, 'pictures': sorted(os.path.basename(p) for p in glob.glob(d + 'F3-*.png') + glob.glob(d + 'SIDE1-*.png')), 'server_files': sorted(os.path.basename(p) for p in glob.glob(d + 'server*.json'))}
    for f in sorted(glob.glob(d + 'screen-meta*.json')):
        m = json.load(open(f)); runs = m.get('runs') or m.get('passes') or {}
        for k, r in runs.items():
            loc = r.get('loc') or r.get('loc_end') or {}
            out['screen_runs'][os.path.basename(f) + ':' + k] = {'location': m.get('location'), 'location_tz': m.get('location_tz'), 'browser_zone': r.get('browser_zone', m.get('browser_zone')),
                'process_zone': m.get('process_zone'), 'process_TZ': m.get('process_TZ'), 'app_timezone_key': r.get('app_timezone_key', m.get('app_timezone_key')), 'app_version': m.get('appVersion'),
                'observed_at_utc': m.get('observed_at_utc'), 'location_check_start_end_ok': r.get('VALID'), 'ls_location': loc.get('ls_location')}
    json.dump(out, open(d + 'meta.json', 'w'), indent=1)
    bad = [k for k, v in out['screen_runs'].items() if not v['location_check_start_end_ok'] or v['browser_zone'] != v['location_tz'] or v['process_zone'] != v['location_tz']]
    print(out['folder'], 'runs', len(out['screen_runs']), 'not-valid-or-zone-mismatch', bad, 'pics', out['pictures'])
