# Extract UI labels named in our cases' setup and steps; classify against probe screen text and the build's code.
import json, glob, re, html, collections, subprocess, os
cs = sorted([json.load(open(f)) for f in glob.glob('before/*.json')], key=lambda c: c['id'])
SKIP = {425662, 425725, 425726}
o = [c for c in cs if c['created_by'] == 3 and c['id'] not in SKIP]
def lines(s): return [l.strip() for l in html.unescape(re.sub(r'<[^>]+>', '\n', s or '')).split('\n') if l.strip()]
VERB = r'(?:Click|Tick|Untick|Choose|Pick|Select|Open|Press|Hover over|Switch on|Switch off|Turn on|Turn off|then)'
lab = collections.defaultdict(set)
for c in o:
    for l in lines(c['custom_preconds'])[1:] + lines(c['custom_steps']):
        for m in re.findall(r'"([^"]{1,60})"|“([^”]{1,60})”', l):
            lab[(m[0] or m[1]).strip()].add(c['id'])
        W = r"[A-Z0-9][\w/+\-\.']*"
        CAP = W + r"(?: (?:&|" + W + r"))*"
        for m in re.findall(r'(?:Click|Tick|Untick|Choose|Pick|Press|Hover over|Open) (?:the )?(' + CAP + r')', l):
            if m not in ('A','B','C','Escape','Tab','Enter','Backspace'): lab[m].add(c['id'])
        for m in re.findall(r'(' + CAP + r') (?:in the top bar|in the left menu|tab\b|button|window|box\b|menu\b|column|switch|tick box|link|heading|page\b|report\b|dialog)', l):
            lab[m].add(c['id'])
def norm(t):
    t = t.strip(' .,:;')
    t = re.sub(r"^(Click|Tick|Open|Pick|Choose) ", '', t)
    t = re.sub(r"^[A-Z0-9]'s ", '', t)
    return t
lab2 = collections.defaultdict(set)
for t, ids in lab.items():
    n = norm(t)
    if n and n not in ('A','B','C','Escape','Esc','Tab','Enter','Backspace','Pick'): lab2[n] |= ids
lab = lab2
screen = '\n'.join(open(f, errors='ignore').read() for f in glob.glob('probe/**/*.txt', recursive=True))
code_root = '/home/user/shopview-sv10647/app/src'
out = []
for t, ids in sorted(lab.items(), key=lambda x: -len(x[1])):
    on_screen = t.lower() in screen.lower()
    r = subprocess.run(['grep', '-rlF', '--include=*.vue', '--include=*.ts', '--include=*.json', t, code_root], capture_output=True, text=True)
    out.append({'label': t, 'n': len(ids), 'screen': on_screen, 'code': len(r.stdout.split()), 'ids': sorted(ids)})
json.dump(out, open('label-inventory.json', 'w'), indent=0)
c = collections.Counter(('screen' if x['screen'] else 'code-only' if x['code'] else 'NOWHERE') for x in out); print(len(out), c)
for x in out:
    if not x['screen']: print(('CODE ' if x['code'] else 'NONE ') + f"{x['n']:3d} {x['label']}")
