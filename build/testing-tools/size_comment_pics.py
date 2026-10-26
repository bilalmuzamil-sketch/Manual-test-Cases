"""size_comment_pics.py <KEY> <COMMENT_ID> <img1> [<img2> ...] — Rule 116 for a COMMENT (26 Oct 2026): a wiki-markup comment with
!pic|width=1000! is stored with height 183 whatever the picture, and mediaSingle is not full-width. Same fix as size_pics.py (which only
does the description): read the comment's ADF, give each media node (in order) the picture's true width/height and each mediaSingle
layout full-width, PUT it back via /rest/api/3, and read back."""
import sys, json, subprocess, os
REPO = '/home/user/Manual-test-Cases'
KEY, CID, IMGS = sys.argv[1], sys.argv[2], sys.argv[3:]
def sh(a): out = subprocess.run(a, capture_output=True, text=True).stdout; t, _, c = out.rpartition('\n__HTTP:'); return int(c or 0), t
from PIL import Image
sizes = [Image.open(p).size for p in IMGS]
s, t = sh(['bash', f'{REPO}/build/atlassian-login/jira.sh', 'GET', f'/rest/api/3/issue/{KEY}/comment/{CID}'])
body = json.loads(t)['body']; i = [0]
def walk(n):
    if isinstance(n, dict):
        if n.get('type') == 'mediaSingle': n['attrs'] = {**n.get('attrs', {}), 'layout': 'full-width'}
        if n.get('type') == 'media' and i[0] < len(sizes):
            w, h = sizes[i[0]]; n['attrs'] = {**n.get('attrs', {}), 'width': w, 'height': h}; i[0] += 1
        for v in n.values(): walk(v)
    elif isinstance(n, list):
        for v in n: walk(v)
walk(body)
p = '/tmp/atlassian/size-comment.json'; json.dump({'body': body}, open(p, 'w'))
s, t = sh(['bash', f'{REPO}/build/atlassian-login/jira.sh', 'PUT', f'/rest/api/3/issue/{KEY}/comment/{CID}', p])
s2, t2 = sh(['bash', f'{REPO}/build/atlassian-login/jira.sh', 'GET', f'/rest/api/3/issue/{KEY}/comment/{CID}'])
got = []
def rd(n):
    if isinstance(n, dict):
        if n.get('type') in ('media', 'mediaSingle'): got.append((n['type'], {k: n['attrs'].get(k) for k in ('layout', 'width', 'height') if k in n['attrs']}))
        for v in n.values(): rd(v)
    elif isinstance(n, list):
        for v in n: rd(v)
rd(json.loads(t2)['body'])
print('PUT', s, '| media sized:', i[0], 'of', len(sizes), '| read back:', got)
