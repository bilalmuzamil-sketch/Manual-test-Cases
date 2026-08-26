import json, hashlib, sys, html
import tr
SECTION=237
L=[]
def say(*a):
    s=' '.join(str(x) for x in a); print(s); L.append(s)
def h(v): return hashlib.sha256((v or '').encode()).hexdigest()[:12]

CLEAN = ('1. The full "Sales By Representative" label renders without crowding.\n'
         '2. The label is not shortened to fit — the fix is padding, not the name.\n'
         '\n---\n'
         'This is the expected behaviour as per epic SV-8582.\n'
         '\nAUTOMATION: READY')

s,c=tr.call(f'add_case/{SECTION}',{'title':'ZZAUTOTEST damage-repair probe (delete me)',
    'custom_preconds':'ZZ pre clean line one.\nZZ pre clean line two.',
    'custom_steps':'1. Step one.\n2. Step two.',
    'custom_expected':CLEAN,'custom_atmstatus':1,'custom_automation_type':0})
if s!=200: say('FATAL add_case',s,c); sys.exit(1)
cid=c['id']; say(f'CREATED C{cid}')
s,g=tr.call(f'get_case/{cid}')
say('A) add_case with PURE PLAIN TEXT (no tags anywhere):')
say('   sent  :',repr(CLEAN))
say('   stored:',repr(g['custom_expected']))
say('   IDENTICAL:',g['custom_expected']==CLEAN)
say('   steps stored:',repr(g['custom_steps']))

def attempt(label, payload_val, want):
    s,_=tr.call(f'update_case/{cid}',{'custom_expected':payload_val})
    s2,gg=tr.call(f'get_case/{cid}')
    got=gg['custom_expected']
    ok = got==want
    say(f'   [{label}] HTTP {s} -> stored {"CLEAN/byte-match" if ok else "NOT a match"} '
        f'| sha={h(got)} len={len(got)}')
    if not ok: say('        stored repr:',repr(got)[:400])
    return ok,got

# reproduce the damage exactly as htmlfmt.py did
sys.path.insert(0,'/home/user/Manual-test-Cases/build/report-suite/writes-2026-08-26')
import htmlfmt
DAMAGED = htmlfmt.block(CLEAN.split('\n'))
say('')
say('B) REPRODUCE the damage (htmlfmt.block -> <p>..<br>..</p>):')
s,_=tr.call(f'update_case/{cid}',{'custom_expected':DAMAGED})
s2,g2=tr.call(f'get_case/{cid}')
say('   sent  :',repr(DAMAGED)[:300])
say('   stored:',repr(g2['custom_expected'])[:300])
say('   damage reproduced (literal <p> present):','<p>' in (g2['custom_expected'] or ''))

say('')
say('C) REPAIR STRATEGIES (target = the CLEAN string byte-for-byte):')
res={}
res['a_original_plain']=attempt('a: send ORIGINAL clean plain text', CLEAN, CLEAN)[0]
# reset to damaged for a fair test of each
def redamage():
    tr.call(f'update_case/{cid}',{'custom_expected':DAMAGED})
redamage()
unesc=html.unescape(g2['custom_expected'] or '')
res['b_unescape_once']=attempt('b: HTML-unescape the live value once', unesc, CLEAN)[0]
redamage()
stripped=(g2['custom_expected'] or '')
stripped=stripped.strip()
if stripped.startswith('<p>') and stripped.endswith('</p>'): stripped=stripped[3:-4]
stripped=html.unescape(stripped.replace('<br>','\n'))
res['c_strip_wrapper_unescape']=attempt('c: strip <p>/</p>, <br>->\\n, unescape', stripped, CLEAN)[0]
redamage()
res['d_single_block_plain']=attempt('d: send as one plain block, no tags, \\n only', CLEAN.replace('\n\n','\n'), CLEAN.replace('\n\n','\n'))[0]
redamage()
res['e_crlf']=attempt('e: send clean text with CRLF line endings', CLEAN.replace('\n','\r\n'), CLEAN)[0]

say('')
say('D) SUMMARY:',json.dumps(res))
s,_=tr.call(f'delete_case/{cid}')
say('DELETE C%s HTTP %s'%(cid,s))
s,chk=tr.call(f'get_case/{cid}')
say('confirm-gone re-GET HTTP',s,'(400/403/404 = deleted)')
open('probe.log','w').write('\n'.join(L)+'\n')
json.dump({'case_id':cid,'results':res},open('probe-result.json','w'),indent=1)
