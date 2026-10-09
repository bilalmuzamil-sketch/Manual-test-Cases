import json,re,sys
sys.path.insert(0,'/tmp/cln/refine'); from lib import *
L=json.load(open('/tmp/cln/dash86-live.json'))
def lis(h):  # top-level li texts of the first <ol>
    inner=h[h.index('<ol>')+4:h.rindex('</ol>')]; out=[];depth=0;cur='';i=0
    while i<len(inner):
        if inner.startswith('<li>',i) and depth==0: depth=1;cur='';i+=4;continue
        if inner.startswith('<li>',i): depth+=1
        if inner.startswith('</li>',i):
            depth-=1
            if depth==0: out.append(cur);i+=5;continue
        cur+=inner[i];i+=1
    return out
T_ADMIN='Sign in on the build under test as an Admin user.'
T_WS='Pick one workplace in the workplace selector at the right of the top bar (e.g. QA Testing).'
T_ZOOM='Use a desktop browser at 100% zoom on a screen at least 1024 pixels wide (any ordinary laptop or desktop monitor).'
T_TECHS='At least two technicians can clock time:'
T_ADV='At least two staff members act as service advisors'
NAME_FIX=[('(e.g. Grace Sullivan, Nadia Petrov, Aisha Farah)','(any three names in the list)'),
 ('(e.g. Marcus Halvorsen, 120%,','(e.g. the advisor\'s name, 120%,'),('(e.g. Nadia Petrov, 70%,','(e.g. the technician\'s name, 70%,'),
 ('(e.g. Marcus Halvorsen: 117%, ELR: $172.25)','(e.g. the advisor\'s name: 117%, ELR: $172.25)'),('(e.g. Marcus Halvorsen: 117%)','(e.g. the advisor\'s name: 117%)'),
 ('(e.g. Jun 2026: Carlos Mendez 129%, Ravi Kapoor 126%)','(e.g. Jun 2026: each technician\'s name with that month\'s percent, such as 129%)'),
 ('(e.g. Grace Sullivan, Nadia Petrov)','(any technician in each legend)'),('(e.g. keep Grace Sullivan and Nadia Petrov)','(keep any two)'),
 ('(e.g. Grace Sullivan and Ravi Kapoor)','(any two)'),('(e.g. Jamal Okonkwo)','(any technician in the legend)'),
 ('(e.g. Marcus Halvorsen)','(any advisor in the list)'),('(e.g. Nadia Petrov)','(any technician in the list)'),('(e.g. Grace Sullivan)','(any one in the list)')]
def fixnames(s):
    for a,b in NAME_FIX: s=s.replace(a,b)
    return s
CHK_PEOPLE=lambda what: f'Check: {what}. If not, try the other location in the list. {BLOCK_IF}'
def f1(k,data_pre=None,data_setup=None,extra_pre=(),drop_prefixes=(),keep_zoom=True):
    old=lis(L[k]['custom_preconds'])
    pre=[P_ADMIN]
    pre.append(data_pre or 'You are in one location (workplace).')
    rest=[]
    for x in old:
        if x.startswith(T_ADMIN) or x.startswith(T_WS): continue
        if any(x.startswith(p) for p in drop_prefixes): continue
        rest.append(x.replace('Use a desktop browser at 100% zoom','You use a desktop browser at 100% zoom').replace('the QA Testing workplace does','check it as in the Setup'))
    pre+=rest+list(extra_pre)
    setup=[S_ADMIN, 'For 2: '+LOC_9919+'.'+(' '+data_setup if data_setup else '')]
    return pre,setup
spec={}
for k in ['88626','88629','351725','351726','351727','351729','351730','351737','351739','204098','351733','351728','351738','88625','351735']:
    spec[k]=f1(k)
# theme switch: verified in profile menu (Light / Dark)
pre,setup=f1('351736')
pre=[x if not x.startswith('Find the app') else 'The app\'s light / dark theme switch is in the profile menu (your initials, top right): Light and Dark.' for x in pre]
spec['351736']=(pre,setup)
TECH_PRE='At least two technicians appear in this location\'s Technician Efficiency and Technician Utilization charts (they have clocked time in the period you look at).'
ADV_PRE='At least two service advisors appear in this location\'s Billing Efficiency / Advisor Analysis chart (they have invoiced work with clocked time in the period you look at).'
TECH_CHK='on the Dashboard set Technician Efficiency to Last 12 Months, click View details and open the Technician filter: it lists at least two names'
ADV_CHK='set Billing Efficiency to Last 12 Months, click View details and open the Advisor filter: it lists at least two names'
spec['351722']=f1('351722',data_pre=TECH_PRE.replace('two','three'),data_setup=CHK_PEOPLE(TECH_CHK.replace('two','three')),drop_prefixes=(T_TECHS,))
spec['351719']=f1('351719',data_pre='You are in one location (workplace) with technician clocked time over the last twelve months.',data_setup=CHK_PEOPLE('on the Dashboard set Technician Utilization to Last 12 Months: it shows a percentage, not "-"'),drop_prefixes=(T_TECHS,))
for k in ['351731','351734']:
    spec[k]=f1(k,data_pre=TECH_PRE+' '+ADV_PRE,data_setup=CHK_PEOPLE(TECH_CHK+'; and '+ADV_CHK),drop_prefixes=(T_TECHS,T_ADV))
spec['351723']=f1('351723',data_pre=TECH_PRE+' '+ADV_PRE,data_setup=CHK_PEOPLE(TECH_CHK+'; and '+ADV_CHK),drop_prefixes=(T_TECHS,T_ADV,'Technicians and advisors have invoiced work'))
spec['351724']=f1('351724',data_pre='You are in one location (workplace) with revenue and technician clocked time over the last twelve months, and at least two technicians in its Technician Efficiency and Technician Utilization charts.',data_setup=CHK_PEOPLE('on the Dashboard set Revenue to Last 12 Months (an amount above $0.00), then '+TECH_CHK),drop_prefixes=(T_TECHS,'The workplace has revenue'))
out={}
for k,(pre,setup) in spec.items():
    c=L[k]; new={'custom_preconds':build(pre,setup)}
    st=fixnames(c['custom_steps']); ex=fixnames(c['custom_expected'])
    if st!=c['custom_steps']: new['custom_steps']=st
    if ex!=c['custom_expected']: new['custom_expected']=ex
    out[k]=new
json.dump(out,open('/tmp/cln/refine/batch1.json','w'))
print(len(out),'cases;', 'steps changed:',[k for k in out if 'custom_steps' in out[k]],'expected changed:',[k for k in out if 'custom_expected' in out[k]])
