import json,re,sys,difflib,html
L=json.load(open('/tmp/cln/dash86-live.json')); B=json.load(open(sys.argv[1]))
BAD=r'QA Testing|workplace selector|Clockable|ShopHub|Grace Sullivan|Nadia Petrov|Marcus Halvorsen|Priya Raman|Ravi Kapoor|Aisha Farah|Jamal Okonkwo|Carlos Mendez|Tom Tech|Tara Tech|Alex Advisor|Bea Advisor|Time Sheets tab|New Work Order &gt; |&gt; Create\.|Administrator|give your user access|Edit Staff Member, |enrolled in'
bad=0
for k,n in B.items():
    c=L[k]
    for f,v in n.items():
        for m in re.finditer(BAD,v): print('LEFTOVER',k,f,'|',v[max(0,m.start()-60):m.end()+40].replace('\n',' ')); bad+=1
        if '<br' in v: print('BR',k,f); bad+=1
    if 'custom_steps' in n:
        a=len(re.findall('<li>',c['custom_steps'])); b=len(re.findall('<li>',n['custom_steps']))
        if a!=b: print('STEPCOUNT',k,a,b); bad+=1
    if 'custom_expected' in n:
        sm=difflib.SequenceMatcher(None,c['custom_expected'],n['custom_expected'])
        for op,i1,i2,j1,j2 in sm.get_opcodes():
            if op!='equal': print('EXP',k,op,repr(c['custom_expected'][i1:i2][:90]),'->',repr(n['custom_expected'][j1:j2][:90]))
    # Settings without profile icon
    for m in re.finditer(r'(?<!profile icon &gt; )Settings &gt;',n['custom_preconds']): print('SETTINGS-ROUTE',k,'|',n['custom_preconds'][max(0,m.start()-50):m.end()+40]); bad+=1
print('problems:',bad)
