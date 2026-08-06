# -*- coding: utf-8 -*-
"""Convert raw-HTML cases to plain numbered text. FORMATTING ONLY - not one word of
meaning changes, and the build line is preserved verbatim (these cases were not
re-observed, so claiming a newer build would be false)."""
import sys, json, re, html as H
sys.path.insert(0,'/tmp/testrail'); import tr
IDS=[30451,30456,30457,30460,30487,30490,30491,30493,30519,30522,30526,30528]

def conv_list(s):
    """<ol><li>a</li><li>b</li></ol> -> '1. a\n2. b'  (also handles <ul> -> same numbering
    only when the source was <ol>; a <ul> becomes '- item')."""
    out=[]
    pos=0
    for m in re.finditer(r'<(ol|ul)>(.*?)</\1>', s, re.S):
        pre=s[pos:m.start()].strip()
        if pre: out.append(plain(pre))
        items=re.findall(r'<li>(.*?)</li>', m.group(2), re.S)
        if m.group(1)=='ol':
            out.append('\n'.join('%d. %s'%(i+1,plain(t)) for i,t in enumerate(items)))
        else:
            out.append('\n'.join('- %s'%plain(t) for t in items))
        pos=m.end()
    tail=s[pos:].strip()
    if tail: out.append(plain(tail))
    return '\n'.join(x for x in out if x)

def plain(t):
    t=re.sub(r'<br\s*/?>','\n',t)
    t=re.sub(r'</p>\s*<p>','\n',t)
    t=re.sub(r'<[^>]+>','',t)
    t=H.unescape(t)
    return re.sub(r'[ \t]+',' ',t).strip()

def conv_expected(s):
    # split on the <hr /> separator
    parts=re.split(r'<hr\s*/?>', s)
    body=conv_list(parts[0])
    rest=parts[1] if len(parts)>1 else ''
    # marker is the last <p>AUTOMATION: ...</p>
    mk=re.search(r'<p>\s*(AUTOMATION:[^<]*)</p>', rest)
    marker=plain(mk.group(1)) if mk else None
    if mk: rest=rest[:mk.start()]+rest[mk.end():]
    prov=conv_list(rest)
    if not marker:
        raise RuntimeError('no marker found')
    return body.rstrip()+'\n\n---\n'+prov.strip()+'\n\n'+marker

if __name__=='__main__':
    log=[];errs=[]
    for cid in IDS:
        st,c=tr.get_case(cid)
        pre=c.get('custom_preconds') or ''; stp=c.get('custom_steps') or ''; exp=c.get('custom_expected') or ''
        try:
            npre=conv_list(pre) if '<' in pre else pre
            nstp=conv_list(stp) if '<' in stp else stp
            nexp=conv_expected(exp)
            for tag in ['<li>','<ol','<p>','<hr','<br']:
                assert tag not in npre+nstp+nexp, 'residual %s on C%d'%(tag,cid)
            assert nexp.rstrip().split('\n')[-1].startswith('AUTOMATION:')
            assert nexp.count('This is the expected behaviour')==1
            assert nexp.count('Last checked against build')==1
        except Exception as ex:
            errs.append((cid,'CONV '+str(ex))); print('SKIP C%d %s'%(cid,ex)); continue
        payload={'custom_preconds':npre,'custom_steps':nstp,'custom_expected':nexp}
        try:
            st2,line,b,a=tr.update_case_verified(cid,payload,'update_case')
            log.append({'cid':cid,'http':st2,'verify':line}); print('OK C%d %s'%(cid,line))
        except Exception as ex:
            errs.append((cid,'WRITE '+str(ex))); print('FAIL C%d %s'%(cid,str(ex)[:400])); break
    json.dump({'log':log,'errs':errs},open('/tmp/rs4/write/unmarkup-oplog.json','w'),indent=1)
    print('wrote',len(log),'errors',len(errs))
