# -*- coding: utf-8 -*-
"""C30392 (raw <ol>/<li> markup) and C38915 (a second '---' inside the body).
Both are handled by hand because writer.rebuild() refuses / would mis-split."""
import sys, json, re, html
sys.path.insert(0,'/home/user/Manual-test-Cases/build/report-suite/full-viu-2026-08-06/tools')
sys.path.insert(0,'/tmp/testrail')
import writer, tr

def html_to_numbered(s):
    """<ol><li>a</li><li>b</li></ol> -> '1. a\n2. b'. Formatting only."""
    if not s: return s
    out=[]; n=0
    # split into blocks so <p> outside a list keeps its own line
    s=s.replace('\r\n','\n')
    for m in re.finditer(r'<li>(.*?)</li>|<p>(.*?)</p>', s, re.S):
        if m.group(1) is not None:
            n+=1; txt=m.group(1)
            out.append('%d. %s' % (n, html.unescape(re.sub(r'<[^>]+>','',txt)).strip()))
        else:
            out.append(html.unescape(re.sub(r'<[^>]+>','',m.group(2))).strip())
    return '\n'.join(x for x in out if x)

BLK = ("What you should see today: %s. This is a known problem and it is already reported - see "
       "https://shopview.atlassian.net/browse/%s\n"
       "· If you see exactly that, mark this test FAILED and do not raise anything new.\n"
       "· If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it.\n"
       "· If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed.")

def do_30392():
    st,c=tr.get_case(30392)
    pre=html_to_numbered(c['custom_preconds'])
    steps=html_to_numbered(c['custom_steps'])
    exp_raw=c['custom_expected']
    # body items only (before the <hr />)
    body_html=exp_raw.split('<hr />')[0]
    body=html_to_numbered(body_html)
    prov=("This is the expected behaviour as per epic SV-8582 and the Technician Utilization report "
          "specification version 6 (S1-R1).\nLast checked against build %s on %s." % (writer.BUILD, writer.DATE))
    new_exp = body + '\n\n---\n' + prov + '\n\nAUTOMATION: READY'
    payload={'custom_preconds':pre,'custom_steps':steps,'custom_expected':new_exp}
    st,line,b,a=tr.update_case_verified(30392,payload,'update_case')
    return line,{'pre':pre,'steps':steps,'exp':new_exp}

def do_38915():
    st,c=tr.get_case(38915)
    exp=c['custom_expected']
    m=writer.MARKER_RE.search(exp)
    marker_old=m.group(0) if m else None
    head=exp[:m.start()].rstrip('\n')
    # LAST '---' separates the provenance block; everything before it is body
    idx=head.rfind('\n---\n')
    body=head[:idx]; prov=head[idx+5:]
    body=re.sub(r'\nWhat you should see today: .*(?:\n(?!\n).*)*','',body).rstrip()
    body=body+'\n'+BLK % ('items 1, 2, 5 and 7 pass, but the column disappears completely as soon as you narrow the '
        'Location filter to a single location, and Location is never offered in the Column Selection control so you '
        'cannot switch it back on. Item 3 and item 4 could not be checked here because no technician on this '
        'environment has hours at both locations, and item 6 needs a second sign-in','SV-8954')
    prov=writer.LASTCHK_RE.sub('Last checked against build %s on %s.'%(writer.BUILD,writer.DATE),prov).rstrip()
    if 'Last checked against build' not in prov:
        prov=prov.rstrip()+'\nLast checked against build %s on %s.'%(writer.BUILD,writer.DATE)
    new_exp=body.rstrip()+'\n\n---\n'+prov.strip()+'\n\n'+'AUTOMATION: READY - EXPECT FAIL (SV-8954)'
    line=writer.write(38915,new_exp)
    return line,new_exp

if __name__=='__main__':
    out={}
    l,d=do_30392(); print('C30392',l); out['30392']={'verify':l,'fields':d}
    l,e=do_38915(); print('C38915',l); out['38915']={'verify':l,'exp':e}
    json.dump(out,open('/tmp/rs3/write/tu-special.json','w'),indent=1)
