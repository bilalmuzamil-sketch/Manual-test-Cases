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


def dumps_like(path, orig_bytes, data):
    """Serialise `data` in the EXACT format this file already uses.

    The projects do not agree: Schedule case files are indent=1 with no trailing
    newline, Report Suite files are indent=2 with one. Assuming either reformats
    the other end to end -- a one-field change came out as 524 changed lines,
    which buries the real edit and makes the diff unreviewable. So the format is
    DETECTED by round-tripping the untouched file and only then used to write.
    """
    orig = json.loads(orig_bytes)
    for indent in (1, 2, 4, None):
        for nl in ('\n', ''):
            cand = json.dumps(orig, indent=indent, ensure_ascii=False) + nl
            if cand.encode() == orig_bytes:
                return json.dumps(data, indent=indent, ensure_ascii=False) + nl
    raise SystemExit(
        'REFUSING TO WRITE %s: its exact formatting could not be reproduced, so a '
        'write would reformat the whole file and hide the real change.' % path)


def main():
    proj = sys.argv[1]
    apply_ = '--apply' in sys.argv
    live = {str(c['id']): c for c in json.load(open(LIVE))[proj]
            if c['created_by'] == 3}
    moved = []
    for f in sorted(glob.glob(f'build/{PROJECTS[proj]}/cases/*.json')):
        orig_bytes = open(f, 'rb').read()
        data = json.loads(orig_bytes)
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
            with open(f, 'w') as fh:
                fh.write(dumps_like(f, orig_bytes, data))
    print(f'{proj}: {len({m["cid"] for m in moved})} cases,'
          f' {len(moved)} fields {"UPDATED" if apply_ else "would move (dry run)"}')
    for m in moved:
        print('  ', m['cid'], m['field'])


if __name__ == '__main__':
    main()
