#!/usr/bin/env python3
"""Re-sync the LOCAL case source FROM LIVE TestRail for one project.

Live is authoritative. This corrects local files ONLY -- it performs no
TestRail write of any kind. Run local_vs_live.py first to see what will move.

The local source stores preconditions/steps/expected either as a list of lines
or as a joined string; this preserves whichever shape the file already uses, so
the re-sync changes CONTENT and never reformats the file's structure.

Usage:  resync_local_from_live.py <Filters|Schedule|ReportSuite> [--apply]
"""
import glob
import json
import sys

LIVE = '/tmp/qg/live-3proj.json'
FIELDS = {'title': 'title', 'preconditions': 'custom_preconds',
          'steps': 'custom_steps', 'expected': 'custom_expected', 'refs': 'refs'}
IDKEYS = ('testrail_id', 'testrail_case_id', 'case_id')
PROJECTS = {'Filters': 'filters', 'Schedule': 'schedule', 'ReportSuite': 'report-suite'}


def cid_of(c):
    for k in IDKEYS:
        v = c.get(k)
        if v:
            return str(v).strip().lstrip('C')
    return None


def norm(s):
    if s is None:
        return ''
    if isinstance(s, list):
        return '\n'.join(str(x) for x in s)
    return str(s)


def main():
    proj = sys.argv[1]
    apply_ = '--apply' in sys.argv
    live = {str(c['id']): c for c in json.load(open(LIVE))[proj]
            if c['created_by'] == 3}
    moved = []
    for f in sorted(glob.glob(f'build/{PROJECTS[proj]}/cases/*.json')):
        data = json.load(open(f))
        if not isinstance(data, list):
            continue
        touched = False
        for c in data:
            cid = cid_of(c)
            if not cid or cid not in live:
                continue
            lv = live[cid]
            for lk, vk in FIELDS.items():
                want = norm(lv.get(vk))
                if norm(c.get(lk)) == want:
                    continue
                # preserve the file's existing shape for this field
                if isinstance(c.get(lk), list):
                    c[lk] = want.split('\n')
                else:
                    c[lk] = want
                moved.append({'cid': 'C' + cid, 'field': lk, 'file': f})
                touched = True
        if touched and apply_:
            # indent=1, no trailing newline -- proven byte-identical round-trip
            # against every existing case file before this was used to write.
            with open(f, 'w') as fh:
                fh.write(json.dumps(data, indent=1, ensure_ascii=False))
    print(f'{proj}: {len({m["cid"] for m in moved})} cases,'
          f' {len(moved)} fields {"UPDATED" if apply_ else "would move (dry run)"}')
    for m in moved:
        print('  ', m['cid'], m['field'])


if __name__ == '__main__':
    main()
