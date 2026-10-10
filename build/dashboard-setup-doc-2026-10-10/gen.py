# One-time job (QA lead, 10 Oct 2026): move each Dashboard test's detailed preconditions + setup into its own
# Google Doc (layout of the existing "Setup (manual QA tester and Claude session)" docs); the test keeps a labelled
# Preconditions list with the Doc link on top. Steps / Expected never touched. Not a rule.
import json,re,sys,html,os
D=os.path.dirname(os.path.abspath(__file__))
live={x['id']:x for x in json.load(open('/tmp/cln/dash-live-1010.json'))}
def label(t):
    s=re.sub('<[^>]+>','',t)
    if re.match(r'(You are signed in|Your role|You can switch)',s): return 'User'
    if re.match(r'(You use a desktop|Your browser window|You have a screen|A screen narrower|A second browser|Use the same browser|You use the same browser|The app)',s): return 'Browser'
    if re.match(r'(You are in (a|one|the) |A location for|The location also|The workplace has|That location)',s): return 'Location'
    if re.match(r'(You run |Today,)',s): return 'Timing'
    if re.match(r'(You have written|Work out|On each report|You have a stopwatch)',s): return 'Before you start'
    if re.match(r'(At least (two|three) (technicians|service)|Advisor [AB]|Technician [12]|A technician whose|ZZAUTOTEST Tech)',s): return 'People'
    return 'Data'
def fmt(l,x):
    m=re.match(r'([A-Z][A-Za-z0-9 -]{1,25}?): (.*)',x,re.S)
    if m and len(m.group(1).split())<=3: return f'{l} ({m.group(1)}): {m.group(2)}'
    x=re.sub(r'^(You|Your|At|A|An|The|That|This|Then|Use|Work|On|Today|One|Four|Three|Invoice|Customer)\b',lambda k:k.group(1).lower() if k.group(1) in ('You','Your','A','An','The','One','At') else k.group(1),x)
    return f'{l}: {x}'
def split(i):
    p=live[i]['custom_preconds']
    if '<p><strong>Setup</strong></p>' in p: pre,setup=p.split('<p><strong>Setup</strong></p>',1)
    else:
        b=json.load(open(f'/tmp/cln/docjob/C{i}-before.json'))['custom_preconds']
        pre,setup=b.split('<p><strong>Setup</strong></p>',1)
        assert pre==p,i
    items=re.findall(r'<li>(.*?)</li>',pre,re.S); assert pre.count('<li>')==len(items)
    sl=re.findall(r'<li>(.*?)</li>',setup,re.S)
    return items,sl
def build(i):
    t=live[i]['title']; items,sl=split(i)
    lab=[label(x) for x in items]
    lis=''.join(f'<li>{fmt(l,x)}</li>' for l,x in zip(lab,items))
    test_list='<p><strong>Preconditions</strong></p><ol>'+lis+'</ol>'
    def parts(s):
        out=[];d=0;cur=''
        k=0
        while k<len(s):
            ch=s[k]
            if ch=='(': d+=1
            elif ch==')': d=max(0,d-1)
            if d==0 and s.startswith('; ',k) and not re.search(r'&#?[A-Za-z0-9]+$',cur): out.append(cur);cur='';k+=2;continue
            cur+=ch;k+=1
        out.append(cur)
        res=[]
        for p in out:
            d=0;cur=''
            for k,ch in enumerate(p):
                if ch=='(': d+=1
                elif ch==')': d=max(0,d-1)
                cur+=ch
                if d==0 and ch=='.' and p[k+1:k+2]==' ' and p[k+2:k+3].isupper() and not re.search(r'(e\.g|i\.e|etc)\.$',cur): res.append(cur);cur=''
            res.append(cur)
        return [p.strip()[0].upper()+p.strip()[1:] for p in res if p.strip()]
    def setup_li(s):
        m=re.match(r'For ([0-9][0-9 ,and&amp;-]*?):\s*(.*)',s,re.S)
        head,body=(f'<strong>For precondition {m.group(1).strip()}:</strong>',m.group(2)) if m else ('',s)
        ps=parts(body)
        if len(ps)<2: return f'<li>{head} {body}</li>'
        return f'<li>{head}<ol>'+''.join(f'<li>{p}</li>' for p in ps)+'</ol></li>'
    doc=(f'<html><body><h1>Setup: {html.escape(t)}</h1>'
      f'<p>Test case: <a href="https://shopview.testrail.io/index.php?/cases/view/{i}">C{i}</a>, Dashboard. Part 1 is for the manual QA tester. Part 2 is for a Claude session that prepares the case on its own. Both create the starting state listed in the test case\'s Preconditions; the numbers below match that list.</p>'
      f'<h2>What must be true before you start</h2><ol>'+lis+'</ol>'
      f'<h1>Part 1. Setup for manual QA tester</h1><p>Each line says which precondition it sets up. Where a precondition is not listed, it needs no setup.</p><ul>'+''.join(setup_li(s) for s in sl)+'</ul>'
      + open(f'{D}/part2.html').read() + '</body></html>')
    return test_list,doc,lab
if __name__=='__main__':
    for a in sys.argv[1:]:
        i=int(a); tl,doc,lab=build(i)
        open(f'{D}/docs/C{i}.html','w').write(doc)
        json.dump({'id':i,'title':live[i]['title'],'labels':lab,'pre_body':tl},open(f'{D}/pre/C{i}.json','w'),indent=1)
        json.dump(live[i],open(f'{D}/before/C{i}-before.json','w'),indent=1)
        print(i,lab)
