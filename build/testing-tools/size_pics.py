"""Give EACH picture in a description its own true size.

🔴 THE BUG THIS REPLACES (2026-09-17): the old version applied ONE width/height to every media node
in the document. A ticket with two pictures had the second one stretched to the first one's shape -
and on SV-10159 that distorted a screenshot the QA lead had pasted in himself. Never assume a
description holds one picture.

Usage: size_pics.py <KEY> <img1> [<img2> ...]   - in the order they appear in the description.
"""
import json, subprocess, sys
from PIL import Image
KEY = sys.argv[1]; IMGS = sys.argv[2:]
REPO = '/home/user/Manual-test-Cases'
def sh(a): return subprocess.run(a, capture_output=True, text=True).stdout
sizes = [Image.open(p).size for p in IMGS]
raw = sh(['bash', f'{REPO}/build/atlassian-login/jira.sh','GET', f'/rest/api/3/issue/{KEY}?fields=description'])
d,_ = json.JSONDecoder().raw_decode(raw)
doc = d['fields']['description']
seen = []
def walk(node):
    if isinstance(node, dict):
        if node.get('type') == 'mediaSingle':
            node['attrs'] = {**node.get('attrs', {}), 'layout': 'full-width'}
            for c in node.get('content', []):
                if c.get('type') == 'media':
                    i = len(seen)
                    if i < len(sizes):
                        w, h = sizes[i]
                        c['attrs'] = {**c.get('attrs', {}), 'width': w, 'height': h}
                        seen.append((w, h))
                    else:
                        # unknown picture - leave its size ALONE rather than guess
                        seen.append(None)
        for v in node.values(): walk(v)
    elif isinstance(node, list):
        for v in node: walk(v)
walk(doc)
p = f'/tmp/{KEY}-adf.json'; json.dump({'fields': {'description': doc}}, open(p, 'w'))
out = sh(['bash', f'{REPO}/build/atlassian-login/jira.sh', 'PUT', f'/rest/api/3/issue/{KEY}', p])
print('pictures found:', len(seen), '| sized:', [s for s in seen if s], '| left alone:', seen.count(None),
      '| written:', '__HTTP:204' in out)
