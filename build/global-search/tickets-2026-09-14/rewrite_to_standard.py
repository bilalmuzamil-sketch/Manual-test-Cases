#!/usr/bin/env python3
"""Rewrite a Global Search regression ticket into the layout the Head of Product and the Head of
Engineering approved on 15 September 2026.

The layout, in their order:
  title (one line) · Environment (one line) · Description · Steps of reproduction ·
  Current behaviour · Expected behaviour · Screenshots (annotated, readable without clicking) ·
  the question for the Product Owner · a rule · Sources

What is deliberately NOT here: any "technical details for developers" section. The Head of
Engineering asked for it to go, and a ticket a manual tester and a product owner can both run is the
point.

Pictures: one composed image per ticket, the live product above and the new version below, each
cropped to the search panel so it arrives at its own size. The reason the current ones have to be
clicked is that they are whole screens shrunk to fit.

Markup: WIKI, through PUT /rest/api/2/issue/<KEY> - the only route that embeds an image inline. The
MCP tools take markdown and would leave the pictures as attachments nobody opens.

  python3 rewrite_to_standard.py --key SV-10002 [--dry-run]
"""
import argparse, json, os, subprocess, sys

REPO = '/home/user/Manual-test-Cases'
D    = f'{REPO}/build/global-search/tickets-2026-09-14'
IMG  = f'{D}/ticket-images'
COOK = os.environ.get('ATL_COOKIES', '/tmp/atlassian/cookies.txt')

QUESTION = """h2. The question for the Product Owner

Is losing this acceptable?

* *Yes* -- it was deliberate, and we close this and mark the matching test as agreed behaviour.
* *No* -- it should still work, and this becomes work for the team.

Nothing is being called a fault here. This is a capability the previous version had and this one does
not, raised so somebody decides on purpose rather than by accident."""

ENVIRONMENT = ("*Environment:* the new version on the test branch https://sv9160.qa.shopview.com "
               "and the version people use today https://app.shopview.com -- the same records are "
               "seeded on both, so the same words were typed into both.")

def sh(args):
    r = subprocess.run(args, capture_output=True, text=True)
    return r.stdout

def attach(key, path):
    out = sh(['curl','-s','-w','\n__HTTP:%{http_code}','-b',COOK,
        '--cacert','/root/.ccr/ca-bundle.crt','-H','Accept: application/json',
        '-H','X-Atlassian-Token: no-check','-H','Origin: https://shopview.atlassian.net',
        '-H','Referer: https://shopview.atlassian.net/browse/'+key,
        '-H','User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
        '-F', f'file=@{path}',
        f'https://shopview.atlassian.net/rest/api/3/issue/{key}/attachments'])
    return '__HTTP:200' in out, out[-100:]

def put_description(key, text):
    p = f'/tmp/{key}-desc.json'
    json.dump({'fields': {'description': text}}, open(p,'w'))
    out = sh(['bash', f'{REPO}/build/atlassian-login/jira.sh', 'PUT',
              f'/rest/api/2/issue/{key}', p])
    return '__HTTP:204' in out, out[-60:]

GAINED = """h2. The question for the Product Owner

Is this acceptable?

* *Yes* -- it was deliberate, and we close this and mark the matching test as agreed behaviour.
* *No* -- it should behave as it did before, and this becomes work for the team.

Nothing is being called a fault here. This is a way the previous version behaved and this one does
not, raised so somebody decides on purpose rather than by accident."""

def build(t, image_name, image_width):
    parts = [ENVIRONMENT, '', 'h2. Description', '', t['description'], '',
             'h2. Steps of reproduction', '']
    parts += [f'# {s}' for s in t['steps']]
    parts += ['', 'h2. Current behaviour', '']
    parts += [f'* {s}' for s in t['current']]
    parts += ['', 'h2. Expected behaviour', '']
    parts += [f'* {s}' for s in t['expected']]
    parts += ['', 'h2. Screenshots', '',
              f'!{image_name}|width={image_width}!', '',
              t['shot_caption'], '']
    # the question for the Product Owner belongs on a ticket that compares the two versions.
    # A plain fault inside the new version is not a question for anybody - asking "is losing this
    # acceptable?" about it would be nonsense, so those tickets carry no block.
    if not t.get('no_question'):
        parts += ['', (GAINED if t.get('gained') else QUESTION)]
    parts += ['', '----', '',
              'h2. Sources', '', t['sources']]
    return '\n'.join(parts)

def clear_attachments(key):
    """An older picture with the same name is what the embed resolves to, so the ticket keeps
    showing the first one uploaded however many times it is replaced. Clear them, then upload once."""
    raw = sh(['bash', f'{REPO}/build/atlassian-login/jira.sh','GET', f'/rest/api/3/issue/{key}?fields=attachment'])
    try:
        d,_ = json.JSONDecoder().raw_decode(raw)
    except Exception:
        return 0
    n=0
    for a in d['fields'].get('attachment') or []:
        out = sh(['bash', f'{REPO}/build/atlassian-login/jira.sh','DELETE', f"/rest/api/3/attachment/{a['id']}"])
        if '__HTTP:204' in out: n+=1
    return n

def size_the_picture(key, path):
    """Wiki markup hands Jira a picture without its real height, so it draws it small and the reader
    clicks to see it. Read the description back, put the true width and height on the media node and
    let it span the description, then write it back."""
    from PIL import Image
    w,h = Image.open(path).size
    raw = sh(['bash', f'{REPO}/build/atlassian-login/jira.sh','GET', f'/rest/api/3/issue/{key}?fields=description'])
    d,_ = json.JSONDecoder().raw_decode(raw)
    desc = d['fields']['description']; fixed=[0]
    def walk(n):
        if isinstance(n,dict):
            if n.get('type')=='mediaSingle':
                n.setdefault('attrs',{})['layout']='full-width'
                for c in n.get('content',[]) or []:
                    if c.get('type')=='media':
                        c['attrs']['width']=w; c['attrs']['height']=h; fixed[0]+=1
            for c in n.get('content',[]) or []: walk(c)
        elif isinstance(n,list):
            for c in n: walk(c)
    walk(desc)
    p=f'/tmp/{key}-adf.json'; json.dump({'fields':{'description':desc}},open(p,'w'))
    out = sh(['bash', f'{REPO}/build/atlassian-login/jira.sh','PUT', f'/rest/api/3/issue/{key}', p])
    return fixed[0], ('__HTTP:204' in out), w, h

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--key', required=True)
    ap.add_argument('--tickets', default=f'{D}/TICKET-CONTENT.json')
    ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()
    content = json.load(open(a.tickets))
    if a.key not in content:
        sys.exit(f'no content written for {a.key} in {a.tickets}')
    t = content[a.key]
    img = os.path.join(IMG, t['image'])
    if not os.path.exists(img):
        sys.exit(f'no picture at {img} -- compose it first')
    from PIL import Image
    w = Image.open(img).width
    body = build(t, t['image'], w)
    if a.dry_run:
        print(f'--- {a.key} :: {t["title"]}')
        print(body)
        return
    cleared = clear_attachments(a.key)
    ok, why = attach(a.key, img)
    print(f'{a.key} old pictures cleared: {cleared} | new one attached: {ok}')
    okd, whyd = put_description(a.key, body)
    print(f'{a.key} description written: {okd} {whyd.strip()[:40]}')
    # the title too, if it is being changed
    if t.get('title'):
        p = f'/tmp/{a.key}-sum.json'
        json.dump({'fields': {'summary': t['title']}}, open(p,'w'))
        out = sh(['bash', f'{REPO}/build/atlassian-login/jira.sh','PUT',
                  f'/rest/api/2/issue/{a.key}', p])
        print(f'{a.key} title written: {"__HTTP:204" in out}')
    n, okm, w, h = size_the_picture(a.key, img)
    print(f'{a.key} picture sized {w}x{h} and set to span the description: {okm} ({n} node)')

if __name__ == '__main__':
    main()
