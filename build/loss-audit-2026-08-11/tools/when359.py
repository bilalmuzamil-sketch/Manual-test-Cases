import json, glob, subprocess
targets = {371369,371537,371632,371640,371716,371719,371731,371773,371795,372413}
rows=[]
for f in sorted(glob.glob('build/**/*run359*result*.json', recursive=True)):
    if '/run-sync-2026-08-11/' in f: continue
    d = json.load(open(f))
    r = d['results'] if isinstance(d,dict) and 'results' in d else d
    if not isinstance(r,list) or not r or not isinstance(r[0],dict) or 'status_id' not in r[0]: continue
    ids = {x['id'] for x in r}
    date = subprocess.run(['git','log','-1','--format=%ad','--date=format:%m-%d %H:%M','--',f],
                          capture_output=True,text=True).stdout.strip()
    rows.append((date, f, len(r), len(targets & ids)))
for date,f,n,hit in sorted(rows):
    print(f'{date} | total={n:4d} | of-the-10-present={hit:2d} | {f}')
