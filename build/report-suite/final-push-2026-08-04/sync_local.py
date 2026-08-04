#!/usr/bin/env python3
"""
Report Suite FINAL PUSH 2026-08-04 — bring the LOCAL case source into exact
agreement with what is now live in TestRail, then apply the LOCAL-ONLY changes.

Live -> local (byte-exact, Rule 50):
    title            <- title
    preconditions[]  <- custom_preconds.split('\n')
    steps[]          <- custom_steps.split('\n')
    expected[]       <- custom_expected.split('\n')
    spec_ref         <- refs

Local-only changes (NOT TestRail writes):
  (a) three cases whose recorded PASS contradicts their own evidence -> DEVIATION
      SBR-EXP-06 C30281 · SBR-VIS-03 C30307 · SBC-EXP-09 C30167
      (ledger 327 PASS/109 DEVIATION -> 324 PASS/112 DEVIATION)
  (b) IV-COL-02 C30552 — the audit's FIX-WORDING verdict was explicitly
      "reword nothing tester-facing ... state that in the notes", so the
      spec-vs-build "Qty on Hand" / "Qty" difference is recorded in notes only.
"""
import json, os, glob, csv, collections

HERE = os.path.dirname(os.path.abspath(__file__))
RS = os.path.abspath(os.path.join(HERE, '..'))

STATUS_FLIPS = {
    30281: ('SBR-EXP-06', 'DEVIATION'),
    30307: ('SBR-VIS-03', 'DEVIATION'),
    30167: ('SBC-EXP-09', 'DEVIATION'),
}
FLIP_NOTE = ('STATUS CORRECTED 2026-08-04 (final-push pass): the recorded VIU-Observed-PASS '
             'contradicted this case\'s own captured evidence, so the ledger status is '
             'DEVIATION. Local status only — no TestRail field carries it.')

C30552_NOTE = ('FIX-WORDING 2026-08-04, notes-only by the audit\'s own verdict ("reword nothing '
               'tester-facing; the deviation is the spec\'s, not the case\'s - state that in the '
               'notes"): the live column header is "Qty" and the case says "Qty", which is '
               'build-accurate; the IV spec still calls it "Qty on Hand". The difference is the '
               'spec\'s to fix, not the case\'s. No tester-facing text was changed.')


def main():
    live = {c['id']: c for c in json.load(open(os.path.join(HERE, 'data', 'live-after.json')))}
    idmap = {}
    for r in csv.DictReader(open(os.path.join(RS, 'testrail-id-map.csv'))):
        idmap[r['internal_id']] = int(r['testrail_case_id'].lstrip('C'))

    stats = collections.Counter()
    changed_files = []
    for path in sorted(glob.glob(os.path.join(RS, 'cases', '*.json'))):
        arr = json.load(open(path))
        dirty = False
        for c in arr:
            iid = c.get('id')
            if iid not in idmap:
                stats['local_not_in_idmap'] += 1
                continue
            cid = idmap[iid]
            L = live.get(cid)
            if not L:
                stats['idmap_not_live'] += 1
                continue
            new = {
                'title': L['title'],
                'preconditions': (L.get('custom_preconds') or '').split('\n'),
                'steps': (L.get('custom_steps') or '').split('\n'),
                'expected': (L.get('custom_expected') or '').split('\n'),
                'spec_ref': L.get('refs') or '',
            }
            for k, v in new.items():
                if c.get(k) != v:
                    c[k] = v
                    dirty = True
                    stats['field:' + k] += 1
            if cid in STATUS_FLIPS:
                iid_exp, st = STATUS_FLIPS[cid]
                assert iid == iid_exp, (iid, iid_exp)
                if c.get('viu_status') != st:
                    c['viu_status'] = st
                    dirty = True
                    stats['status_flip'] += 1
                if FLIP_NOTE not in (c.get('notes') or ''):
                    c['notes'] = ((c.get('notes') or '') + ' | ' + FLIP_NOTE).lstrip(' |')
                    dirty = True
            if cid == 30552 and C30552_NOTE not in (c.get('notes') or ''):
                c['notes'] = ((c.get('notes') or '') + ' | ' + C30552_NOTE).lstrip(' |')
                dirty = True
                stats['notes_only_C30552'] += 1
            stats['synced'] += 1
        if dirty:
            json.dump(arr, open(path, 'w'), indent=1, ensure_ascii=False)
            changed_files.append(os.path.basename(path))

    print('=== LOCAL SYNC ===')
    for k, v in sorted(stats.items()):
        print('  %-24s %d' % (k, v))
    print('  files rewritten: %d' % len(changed_files))

    # ---- prove set equality both directions ----
    local_ids, dupes = set(), []
    for path in glob.glob(os.path.join(RS, 'cases', '*.json')):
        for c in json.load(open(path)):
            if str(c.get('viu_status', '')).startswith('Retired'):
                continue
            if c['id'] in local_ids:
                dupes.append(c['id'])
            local_ids.add(c['id'])
    map_ids = set(idmap)
    live_ids = {c['id'] for c in live.values() if c['created_by'] == 3}
    map_cids = set(idmap.values())
    print('\n=== SET EQUALITY (Rule 50: both directions, never by count) ===')
    print('  local active ids      %d' % len(local_ids))
    print('  id-map rows           %d' % len(map_ids))
    print('  live ours (created_by=3) %d' % len(live_ids))
    print('  id-map distinct C-ids %d' % len(map_cids))
    print('  local - idmap  =', sorted(local_ids - map_ids) or '(empty)')
    print('  idmap - local  =', sorted(map_ids - local_ids) or '(empty)')
    print('  live  - idmap  =', sorted(live_ids - map_cids) or '(empty)')
    print('  idmap - live   =', sorted(map_cids - live_ids) or '(empty)')
    print('  duplicate local ids   =', dupes or '(none)')


if __name__ == '__main__':
    main()
