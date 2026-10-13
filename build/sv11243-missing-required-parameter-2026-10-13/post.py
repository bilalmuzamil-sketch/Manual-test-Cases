"""Upload the four exhibits to SV-11243 as real attachments, post comment.txt, read it back."""
import json, subprocess, os, sys
D = os.path.dirname(os.path.abspath(__file__)); CK = '/tmp/atlassian/cookies.txt'; B = 'https://shopview.atlassian.net'
imgs = ['sv11243-01-lines-hd.png', 'sv11243-02-pick-inventory-hd.png', 'sv11243-03-amount-1-hd.png', 'sv11243-04-error-hd.png']
def sh(*a): return subprocess.run(a, capture_output=True, text=True).stdout
if 'post' in sys.argv:
    for n in imgs:
        r = sh('curl', '-sS', '-b', CK, '-H', 'X-Atlassian-Token: no-check', '-F', f'file=@{D}/ev/{n}', f'{B}/rest/api/3/issue/SV-11243/attachments')
        print(n, json.loads(r)[0]['id'])
    body = json.dumps({'body': open(f'{D}/comment.txt').read()})
    r = sh('curl', '-sS', '-b', CK, '-H', 'Content-Type: application/json', '-X', 'POST', '--data', body, f'{B}/rest/api/2/issue/SV-11243/comment')
    cid = json.loads(r)['id']; print('comment', cid); open(f'{D}/comment-id.txt', 'w').write(cid)
cid = open(f'{D}/comment-id.txt').read().strip()
a = json.loads(sh('curl', '-sS', '-b', CK, f'{B}/rest/api/3/issue/SV-11243/comment/{cid}'))
media = []
def walk(n):
    if isinstance(n, dict):
        if n.get('type') == 'media': media.append((n['attrs'].get('type'), n['attrs'].get('alt') or n['attrs'].get('id')))
        if n.get('type') == 'mention': print('mention', n['attrs'].get('text'), n['attrs'].get('id'))
        for v in n.values(): walk(v)
    elif isinstance(n, list):
        for v in n: walk(v)
walk(a['body']); print('media', media); print('created', a['created'])
open(f'{D}/comment-as-posted-{cid}.json', 'w').write(json.dumps(a['body'], indent=1))
