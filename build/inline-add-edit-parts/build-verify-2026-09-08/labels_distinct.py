import sys, importlib.util, collections
spec = importlib.util.spec_from_file_location("cpl", "build/testing-tools/check_precond_labels.py")
# import guarded: it has main() at bottom under __main__? check
src = open("build/testing-tools/check_precond_labels.py").read()
import re, base64, json
QUOTED = re.compile(r'“([^”\n]{2,60})”|"([^"\n]{2,60})"')
IGNORE = re.compile(r'^(Escape|Enter|Tab|Shift\+Enter|Ctrl\+|F\d|\d+(\.\d+)?|[A-Z0-9\-]{4,}|x|×|s “X)$', re.I)
DATA_LOOKING = re.compile(r'''(^\$|^\d+$|^[A-Z]{2,4}-|^\d{1,2}/\d{1,2}|^S9315|ZZAUTOTEST|^WO\b|^INV\b|^\+)''', re.X)
import urllib.request
c = json.load(open('/tmp/testrail/creds.json'))
auth = base64.b64encode(f"{c['email']}:{c['password']}".encode()).decode()
BASE = c.get('base','https://shopview.testrail.io') + '/index.php?/api/v2/'
def api(path):
    for t in range(5):
        try:
            r = urllib.request.Request(BASE+path, headers={'Authorization':'Basic '+auth,'Content-Type':'application/json'})
            return json.load(urllib.request.urlopen(r, timeout=60))
        except Exception as e:
            if t==4: raise
def paged(path,key):
    out=[]; off=0
    while True:
        d=api(f'{path}&limit=250&offset={off}')
        items = d[key] if isinstance(d,dict) else d
        out+=items
        if isinstance(d,dict) and d.get('_links',{}).get('next'): off+=250
        else: break
    return out
def txt(h):
    import html as H
    h = re.sub(r'<[^>]+>',' ',h or '')
    return H.unescape(re.sub(r'\s+',' ',h)).strip()

sections = sys.argv[1].split(',')
lab = collections.defaultdict(list)
n=0
for sid in sections:
    for case in paged(f'get_cases/1&section_id={sid}','cases'):
        n+=1
        pre = txt(case.get('custom_preconds') or '')
        found = {a or b for a,b in QUOTED.findall(pre)}
        for l in found:
            l=l.strip().rstrip('.,;:')
            if not l or IGNORE.match(l) or DATA_LOOKING.search(l): continue
            lab[l].append(case['id'])
print(f"{n} cases scanned; {len(lab)} distinct quoted precondition labels")
for l in sorted(lab, key=lambda x:-len(lab[x])):
    print(f"{len(lab[l]):3}x  {l!r}")
