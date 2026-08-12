#!/usr/bin/env python3
"""READ-ONLY. For every case of ours flagged custom_atmstatus=3, establish from
TestRail's own history WHO set it (Standing Rules 64/65).

  Vladimir Tomovic (user 1) set it -> LEAVE ALONE, it is his marker.
  No history entry at all        -> our add_case default -> correct to 1.
  Anything else                  -> ambiguous, report, DO NOT WRITE.
"""
import sys, json, datetime
sys.path.insert(0, '/tmp/testrail')
import tr

OUR = 3
VLAD = 1
OUT = '/home/user/Manual-test-Cases/build/run-sync-2026-08-11/SNAPSHOTS'


def history(cid):
    out, offset = [], 0
    while True:
        st, b = tr.api(f"get_history_for_case/{cid}&limit=250&offset={offset}")
        if st != 200:
            raise RuntimeError(f"get_history_for_case/{cid} HTTP {st}: {b}")
        chunk = b["history"] if isinstance(b, dict) else b
        out.extend(chunk)
        if len(chunk) == 250:
            offset += 250
            continue
        break
    return out


def main():
    cases = json.load(open('/tmp/testrail/ALL-CASES.json'))
    sub = json.load(open('/tmp/testrail/SUBTREES.json'))
    rows = []
    for proj in ('Filters', 'Schedule', 'ReportSuite'):
        ss = set(sub[proj])
        for c in sorted((c for c in cases if c['section_id'] in ss), key=lambda x: x['id']):
            if c.get('custom_atmstatus') != 3:
                continue
            cid, owner = c['id'], c.get('created_by')
            if owner != OUR:
                rows.append({'case_id': cid, 'project': proj, 'created_by': owner,
                             'atmstatus': 3, 'foreign': True,
                             'setter': 'n/a - foreign case', 'action': 'HANDS OFF (Rule 38)',
                             'evidence': 'not ours; never read history, never touched'})
                continue
            h = history(cid)
            ev = [(e['user_id'], e['created_on'], ch.get('old_value'), ch.get('new_value'))
                  for e in h for ch in e.get('changes', [])
                  if ch.get('field') == 'custom_atmstatus']
            setters = sorted({u for u, _, _, _ in ev})
            if not ev:
                setter, action = 'NOBODY - no history entry', 'CORRECT 3 -> 1'
                note = f'{len(h)} history entries, none touching custom_atmstatus'
            elif setters == [VLAD]:
                setter, action = 'Vladimir Tomovic (user 1)', 'LEAVE ALONE'
                note = '; '.join(
                    f"user {u} @ {datetime.datetime.fromtimestamp(t, datetime.timezone.utc):%Y-%m-%d %H:%MZ} {o!r}->{n!r}"
                    for u, t, o, n in ev)
            else:
                setter, action = f'users {setters}', 'AMBIGUOUS - REPORT, DO NOT WRITE'
                note = '; '.join(
                    f"user {u} @ {datetime.datetime.fromtimestamp(t, datetime.timezone.utc):%Y-%m-%d %H:%MZ} {o!r}->{n!r}"
                    for u, t, o, n in ev)
            rows.append({'case_id': cid, 'project': proj, 'created_by': owner, 'atmstatus': 3,
                         'foreign': False, 'setter': setter, 'action': action, 'evidence': note,
                         'history_entries': len(h), 'atm_changes': len(ev)})
            print(f"C{cid} {proj:12s} setter={setter:28s} action={action}")
    json.dump({'generated_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
               'rows': rows}, open(f'{OUT}/atmstatus-history.json', 'w'), indent=1, sort_keys=True)
    from collections import Counter
    print("\nACTION TALLY:", dict(Counter(r['action'] for r in rows)))


main()
