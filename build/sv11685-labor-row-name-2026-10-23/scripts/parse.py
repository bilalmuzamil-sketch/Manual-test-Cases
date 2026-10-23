import sys,re,json
from bs4 import BeautifulSoup
def T(e): return re.sub(r'\s+',' ',e.get_text(' ')).strip() if e else ''
def parse(path):
    soup=BeautifulSoup(open(path).read(),'html.parser'); out=[]
    for job in soup.select('.job'):
        j={'no':T(job.select_one('.job-no')),'title':T(job.select_one('.job-ttl')),'sub':T(job.select_one('.job-sub')),
           'scope':T(job.select_one('.scope')),'labor':[],'other':[], 'total':T(job.select_one('.ltot'))}
        for sec in job.select('.chargesec'):
            head=T(sec.select_one('.csec-head'))
            for tr in sec.select('tr'):
                cells=[T(td) for td in tr.select('td')]
                (j['labor'] if head.lower()=='labor' else j['other']).append([head]+cells)
        out.append(j)
    return out
if __name__=='__main__':
    for p in sys.argv[1:]:
        jobs=parse(p); print('==',p.split('/')[-1],'jobs',len(jobs))
        for j in jobs:
            print(f" {j['no']} {j['title'][:50]!r} sub={j['sub'][:30]!r}")
            for l in j['labor']: print('    LABOR',l[1:])
            for o in j['other'][:6]: print('    ',o[0],o[1:])
            print('    ',j['total'])
