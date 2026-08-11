import json,re,sys
cases={c['id']:c for c in json.load(open('/tmp/lb_225.json'))}
rows=json.load(open('/tmp/lb_misses.json'))
KEY={'title':'title','preconds':'custom_preconds','steps':'custom_steps','expected':'custom_expected'}
want=set(int(a) for a in sys.argv[1:]) if len(sys.argv)>1 else None
for r in rows:
    if want and r['id'] not in want: continue
    c=cases[r['id']]
    print('='*100)
    print(f"C{r['id']}  [{r['report']} / {r['section']}]")
    print('TITLE:',c['title'])
    for f,ms in r['per_field'].items():
        txt=c.get(KEY[f]) or ''
        for m in ms:
            for line in txt.split('\n'):
                if '"%s"'%m in line:
                    print(f'  [{f}] «{m}»  ::  {line.strip()[:400]}')
                    break
