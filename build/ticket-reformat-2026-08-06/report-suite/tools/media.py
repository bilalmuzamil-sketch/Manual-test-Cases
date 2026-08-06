#!/usr/bin/env python3
"""Resolve a Jira attachment id to its MEDIA file id, so an already-attached image
can be referenced inline in the description.

The media id is only exposed on the 303 redirect from /attachment/content/{id}.
Only the UUID is kept -- the signed token on that URL is a secret and is never
stored or printed.

WHY THIS MATTERS (learned the hard way on SV-8818, 2026-08-06): a PASTED image lives
as an EMBEDDED attachment, and if the description that references it is rewritten
without its media node, JIRA DELETES THE ATTACHMENT. The deletion does NOT appear in
the changelog. So every existing media node must be carried forward.
"""
import json, os, re, subprocess, sys

CJ = '/tmp/atlassian/cookies.json'
_cj = json.load(open(CJ))
_items = _cj if isinstance(_cj, list) else _cj.get('cookies', [])
CK = '; '.join(f"{c['name']}={c['value']}" for c in _items)
BASE = 'https://shopview.atlassian.net'


def media_id(attachment_id):
    r = subprocess.run(['curl', '-s', '-D', '-', '-o', '/dev/null', '-H', f'Cookie: {CK}',
                        f'{BASE}/rest/api/3/attachment/content/{attachment_id}'],
                       capture_output=True, text=True)
    m = re.search(r'location:\s*https://api\.media\.atlassian\.com/file/([0-9a-f-]{36})/',
                  r.stdout, re.I)
    return m.group(1) if m else None


if __name__ == '__main__':
    out = {}
    for a in sys.argv[1:]:
        out[a] = media_id(a)
        print(a, '->', out[a])
    HERE = os.path.dirname(os.path.abspath(__file__))
    p = os.path.join(HERE, '..', 'snapshots', 'media-ids.json')
    cur = json.load(open(p)) if os.path.exists(p) else {}
    cur.update(out)
    json.dump(cur, open(p, 'w'), indent=1)
