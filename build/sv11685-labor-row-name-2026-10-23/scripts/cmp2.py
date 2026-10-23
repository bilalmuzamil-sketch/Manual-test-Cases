import re,fitz,sys
sys.path.insert(0,'/tmp/qa11685/w'); from parse import parse
from bs4 import BeautifulSoup
def bodytext(p): return re.sub(r'\s+',' ',BeautifulSoup(open(p).read(),'html.parser').get_text(' '))
def pdftext(p): return re.sub(r'\s+',' ',' '.join(pg.get_text() for pg in fitz.open(p)))
for env in ['prod','branch']:
    titles=[j['title'] for j in parse(f'var-{env}/modern-S1-decl1.html')]
    for v in ['S0','S1','S2','S3']:
        mh=bodytext(f'var-{env}/modern-{v}-decl1.html'); mp=pdftext(f'var-{env}/modern-{v}-decl1.pdf')
        lh=bodytext(f'var-{env}/legacy-{v}-decl1.html'); lp=pdftext(f'var-{env}/legacy-{v}-decl1.pdf')
        c=lambda t,s: s.count(t.strip())
        print(env,v,'modern html',[c(t,mh) for t in titles],'pdf',[c(t,mp) for t in titles],'| legacy html',[c(t,lh) for t in titles],'pdf',[c(t,lp) for t in titles])
    # totals modern vs legacy
    for v in ['S0','S1']:
        def summ(p):
            s=BeautifulSoup(open(p).read(),'html.parser'); out={}
            for e in s.select('[data-test-id^=invoice-summary]'): out[e['data-test-id']]=re.sub(r'\s+',' ',e.get_text(' ')).strip()
            return out
        a=summ(f'var-{env}/modern-{v}-decl1.html'); b=summ(f'var-{env}/legacy-{v}-decl1.html')
        money=lambda p: sorted(re.findall(r'\$[\d,]+\.\d\d',pdftext(p)))
        print(' ',env,v,'summary modern',a); print('   summary legacy',b)
