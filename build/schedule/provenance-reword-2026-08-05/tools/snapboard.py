import json,subprocess,sys,datetime
def get(f,t):
    r=subprocess.run(['bash','/tmp/schedule-viu/api.sh','GET',f'/api/schedule/board?from={f}&to={t}'],capture_output=True,text=True)
    raw=r.stdout.split('__HTTP_')[0]
    code=r.stdout.split('__HTTP_')[1].strip('_\n')
    return code, json.loads(raw)
def snap(out):
    shifts={}; events={}; series=set()
    d0=datetime.date(2026,6,1)
    while d0 < datetime.date(2027,3,1):
        d1=d0+datetime.timedelta(days=60)
        code,j=get(d0.isoformat()+'T00:00:00Z', d1.isoformat()+'T00:00:00Z')
        assert code=='200', (code,j)
        b=j['data']['board']
        for s in b.get('shifts',[]) or []:
            shifts[s['id']]=s
            if s.get('seriesId'): series.add(s['seriesId'])
        for e in b.get('events',[]) or []: events[e['id']]=e
        d0=d1
    json.dump({'shifts':shifts,'events':events,'series':sorted(series)},open(out,'w'),indent=1,sort_keys=True)
    print(out,'shifts',len(shifts),'events',len(events),'series',len(series))
if __name__=='__main__': snap(sys.argv[1])
