"""Check converted cases before any TestRail write. Usage: python3 conv_check.py /tmp/cln/conv-out-N.json"""
import json,re,sys,html,glob
D='/home/user/Manual-test-Cases/build/wo-board-tech-view/structure-conversion-2026-10-08/'
FOLDER_DOC=re.compile(r'^<p><strong><a href="https://docs\.google\.com/document/d/[A-Za-z0-9_-]+/edit[^"]*">Setup \(manual QA tester and Claude session\)</a></strong></p><p></p><p><strong>Preconditions</strong></p><ul><li>')
def split_exp(e):
    m=re.search(r'<p><strong>(What you should see today|Source)',e); return (e[:m.start()],e[m.start():]) if m else (e,'')
def steps_n(s):
    d=0;n=0
    for m in re.finditer(r'<(/?)(ol|ul|li)\b',s):
        c,t=m.group(1),m.group(2)
        if t in('ol','ul'): d+=-1 if c else 1
        elif t=='li' and not c and d==1: n+=1
    return n
out=json.load(open(sys.argv[1])); bad=0; merged={}
for k,v in out.items():
    b=json.load(open(D+f'C{k}-before.json')); p=[]
    pre,st,head=v['custom_preconds'],v['custom_steps'],v['expected_head']
    _,tail=split_exp(b['custom_expected']); newexp=head+tail
    if not FOLDER_DOC.match(pre): p.append('preconds must start with the bold doc link then Preconditions list')
    if v['doc_link'] not in pre: p.append('doc_link not in preconds')
    if '<strong>Setup</strong>' in pre or re.search(r'Needs:|minutes|Build:|v26\.40',html.unescape(re.sub('<[^>]+>',' ',pre))): p.append('Setup block / Needs / duration / build left in preconds')
    allt=pre+st+head
    if re.search(r'\[[A-Z][A-Za-z-]*-?\d*[A-Z]?\]',html.unescape(allt)): p.append('square-bracket placeholder left: '+str(re.findall(r'\[[A-Z][A-Za-z-]*-?\d*[A-Z]?\]',html.unescape(allt))[:3]))
    if not st.startswith('<ol><li>'): p.append('steps not <ol>')
    n=steps_n(st)
    if not head.startswith('<p><strong>Expected results</strong></p><ul>'): p.append('expected head shape')
    lis=re.findall(r'<li>(.*?)</li>',head,re.S)
    for li in lis:
        t=html.unescape(re.sub('<[^>]+>','',li)).strip()
        m=re.match(r'Steps? (\d+)(?:\s*(?:,|and|to|-|–)\s*(\d+))*',t)
        if not m: p.append('result line without Step N: '+t[:50]); continue
        nums=[int(x) for x in re.findall(r'\d+',m.group(0))]
        if max(nums)>n: p.append(f'result points at step {max(nums)} but only {n} steps')
    braces=set(re.findall(r'\{[^{}]+\}',html.unescape(pre+st+head)))
    for bname in braces:
        if not re.match(r'\{[A-Z][a-z]+(-[a-z]+)*-[A-Z]( id)?\}$',bname): p.append('brace name shape: '+bname)
    for bname in set(re.findall(r'\{[^{}]+\}',html.unescape(st+head))):
        if bname not in html.unescape(pre): p.append('brace used but not defined in Preconditions: '+bname)
    for bad_tag in ['<br','<em>','<i>','<b>','<code>']:
        if bad_tag in pre+st+head: p.append('inline tag '+bad_tag)
    if p: bad+=1; print('C'+k,' | '.join(p[:6]))
    merged[k]={**b,'custom_preconds':pre,'custom_steps':st,'custom_expected':newexp}
json.dump(merged,open(sys.argv[1].replace('.json','-merged.json'),'w'))
print(f'checked {len(out)}; with problems {bad}'); sys.exit(1 if bad else 0)
