# One-time job (QA lead, 12 Oct 2026: "Please do the same for these test cases" — C368136, C96960, WO Board suite).
# Same shape as build/dashboard-setup-doc-2026-10-10: setup + detailed preconditions in a per-test Google Doc, the test
# keeps a labelled Preconditions list with the Doc link on top. Steps and everything below are never touched. Not a rule.
import json,re,html,os,sys
D=os.path.dirname(os.path.abspath(__file__))
live={int(k):v for k,v in json.load(open(f'{D}/before/two-live-2026-10-12.json')).items()}
LOWER=('Desktop','One','Two','Three','Customer','A','The')
def label(t):
    s=re.sub('<[^>]+>','',t)
    if re.match(r'(Needs|Build):',s): return None
    if s.startswith('[User-A]'): return 'User'
    if s.startswith('Desktop browser'): return 'Browser'
    if s.startswith('One location'): return 'Location'
    if re.match(r'(Two|Three) eligible technicians|\[Tech-A\] can also sign in',s): return 'People'
    if re.match(r'(Customer |A shift )',s): return 'Data'
    if re.match(r'(Esther Howard is named|The technician names)',s): return 'Note'
    raise SystemExit('unlabelled: '+s[:60])
def fmt(l,x):
    if l is None: return x
    x=re.sub(r'^('+'|'.join(LOWER)+r')\b',lambda m:m.group(1).lower(),x)
    return f'{l}: {x}'
def top_items(h):
    # top-level <li> items of the first list, keeping any nested list inside its item
    body=h[h.find('<ol>')+4:h.rfind('</ol>')]; out=[];d=0;cur=''
    for tok in re.split(r'(</?li>|</?ul>|</?ol>)',body):
        if tok=='<li>':
            d+=1
            if d==1: cur=''; continue
        elif tok=='</li>':
            d-=1
            if d==0: out.append(cur); continue
        cur+=tok
    return out
def parts(s):
    out=[];d=0;cur='';k=0
    while k<len(s):
        ch=s[k]
        if ch=='(': d+=1
        elif ch==')': d=max(0,d-1)
        if d==0 and s.startswith('; ',k) and not re.search(r'&#?[A-Za-z0-9]+$',cur): out.append(cur);cur='';k+=2;continue
        cur+=ch;k+=1
    out.append(cur); res=[]
    for p in out:
        d=0;cur=''
        for k,ch in enumerate(p):
            if ch=='(': d+=1
            elif ch==')': d=max(0,d-1)
            cur+=ch
            if d==0 and ch=='.' and p[k+1:k+2]==' ' and p[k+2:k+3] in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ[' and not re.search(r'(e\.g|i\.e|etc)\.$',cur): res.append(cur);cur=''
        res.append(cur)
    return [p.strip()[0].upper()+p.strip()[1:] for p in res if p.strip()]
P2=open(f'{D}/part2.html').read()
def build(i):
    x=live[i]; pre,setup=x['custom_preconds'].split('<p><strong>Setup</strong></p>',1)
    items=re.findall(r'<li>(.*?)</li>',pre,re.S); assert pre.count('<li>')==len(items)
    steps=top_items(setup); assert sum(1+t.count('<li>') for t in steps)==setup.count('<li>')
    lis=''.join(f'<li>{fmt(label(t),t)}</li>' for t in items)
    test_list='<p><strong>Preconditions</strong></p><ol>'+lis+'</ol>'
    def step_li(s):
        sub=''
        if '<ul>' in s: s,sub=s.split('<ul>',1); sub=re.findall(r'<li>(.*?)</li>',sub,re.S)
        ps=parts(s)+list(sub)
        return f'<li>{s}</li>' if len(ps)<2 else '<li>'+ps[0]+'<ul>'+''.join(f'<li>{p}</li>' for p in ps[1:])+'</ul></li>'
    doc=(f'<html><body><h1>Setup: {html.escape(x["title"])}</h1>'
      f'<p>Test case: <a href="https://shopview.testrail.io/index.php?/cases/view/{i}">C{i}</a>, WO Board and Tech View. Part 1 is for the manual QA tester. Part 2 is for a Claude session that prepares the case on its own. Both create the starting state listed in the test case\'s Preconditions.</p>'
      f'<p>How to read this document: a name in square brackets, such as [Tech-A], stands for a person or record you create or pick; it is defined in the list below and used the same way in the test case. Write down the real value you used for each name, because the test steps refer to it.</p>'
      f'<h2>What must be true before you start</h2><ol>{lis}</ol>'
      f'<h1>Part 1. Setup for manual QA tester</h1><p>Do these steps in order.</p><ol>'+''.join(step_li(s) for s in steps)+'</ol>'+P2+'</body></html>')
    return test_list,doc
if __name__=='__main__':
    for a in sys.argv[1:]:
        i=int(a); tl,doc=build(i)
        open(f'{D}/docs/C{i}.html','w').write(doc)
        json.dump({'id':i,'title':live[i]['title'],'pre_body':tl},open(f'{D}/pre/C{i}.json','w'),indent=1)
        print(i,len(doc))
