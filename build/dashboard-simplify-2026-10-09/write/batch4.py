import json,re,sys
sys.path.insert(0,'/tmp/cln/refine'); from lib import *
L={str(c['id']):c for c in json.load(open('/tmp/cln/dash-live-1009.json'))}
src=open('/tmp/cln/refine/batch1.py').read(); exec(src[src.index('NAME_FIX='):src.index('CHK_PEOPLE=')])
R100='EVR Travel to EVO ($100 an hour)'
def lis(h):
    inner=h[h.index('<ol>')+4:h.rindex('</ol>')]; out=[];depth=0;cur='';i=0
    while i<len(inner):
        if inner.startswith('<li>',i) and depth==0: depth=1;cur='';i+=4;continue
        if inner.startswith('<li>',i): depth+=1
        if inner.startswith('</li>',i):
            depth-=1
            if depth==0: out.append(cur);i+=5;continue
        cur+=inner[i];i+=1
    return out
def stepfix(k): 
    s=fixnames(L[k]['custom_steps'])
    return re.sub(r'<li>Open the dashboard','<li>Click Dashboard in the top menu',s)
NEW_TECH=f'create a second technician you can sign in as: profile icon {G} Settings {G} Staff {G} New Staff Member: a name (for example ZZAUTOTEST Tech Two), an Email you can open, Role Technician, a Department, Location = this location, Time Clock on {G} Save &amp; Close; accept the invitation email and set a password'
SEED_T=lambda tech='Tech ShopView',adv='the Service Advisor is filled in with your name (Admin ShopView); to use another advisor change Service Advisor in the work order\'s left panel',hrs='Estimated Time 1 and Tech Time 1',rate=R100: f'{NEW_CUST} (for example ZZAUTOTEST Dash Customer); '+wo_recipe(rate=rate,tech=tech,times=hrs,clock=True).replace('tick Line Approved &gt; Save &amp; Close',f'tick Line Approved &gt; Save &amp; Close; then {adv}',1)
P1=P_ADMIN; P3Z=P_ZOOM
def base(extra_pre,extra_setup,k,keep=()):
    pre=[P1,'You are in one location (workplace) (see 4 and later for the data it needs).' if False else None,P3Z]
    return pre
spec={}
def mk(k,data_pres,setups,keep_tail=()):
    pre=[P1,'You are in one location (workplace) with the data below.',P3Z]+data_pres+list(keep_tail)
    setup=[S_ADMIN, f'For 2: to change location, {LOC_ROUTE}. On the QA site use Staging Heavy Duty - 9919 unless a later line says otherwise.']+setups
    spec[k]=(pre,setup,stepfix(k))
BACK='then set the pill back to This Month (the dashboard remembers your choices)'
mk('88617',['The location has invoiced work orders with clocked technician time both this month and in earlier months.'],
   [f'For 4: check: Billing Efficiency on This Month shows a percentage (not -); set it to Last 12 Months: it shows one too; {BACK}. If this month has none, create one invoice with clocked time today: '+SEED_T()+f' If earlier months have none, {BLOCK_IF[3:]}'.replace('mark','mark',1)],
   ['Start with no tile expanded: if a tile shows its detail panel, click its View details to close it.'])
mk('88619',['At least two technicians have clocked time on invoiced work order lines this month in this location.'],
   ['For 4: check: Technician Efficiency (This Month) &gt; View details: the table lists at least two technicians. If not, create an invoice with clocked time for each technician: first with Tech ShopView: '+SEED_T()+' Then '+NEW_TECH+', and repeat with a second customer and that technician.'])
mk('88620',['At least two technicians appear in the Technician filter of the Technician Efficiency chart (they have clocked time on invoiced lines this month).'],
   ['For 4: check: Technician Efficiency (This Month) &gt; View details &gt; Technician filter lists at least two names. If not, create the data as follows: with Tech ShopView: '+SEED_T()+' Then '+NEW_TECH+', and repeat with a second customer and that technician.'])
mk('88621',['A one-off very high Billing Efficiency month for one advisor exists: one invoiced work order today whose Service Advisor has nothing else invoiced this month, with one labor line of 1.00 hour assigned to a technician who clocked exactly 0.25 hours on it (1.00 / 0.25 x 100 = 400%).',
   'The location also has other advisors with ordinary monthly figures under 200% over the last twelve months, so most plotted points are at or below 200%.'],
   ['For 4: pick the advisor: Reports &gt; Advisor Analysis, Date: This month: choose an advisor with no row there (your own name, Admin ShopView, if it has none). Then '+SEED_T(adv='set Service Advisor in the work order\'s left panel to that advisor',hrs='Estimated Time 1 and Tech Time 1').replace('to make the time exact','make the clocked time exactly 0.25 hours (15 minutes)')+'',
    f'For 5: check: Billing Efficiency set to Last 12 Months &gt; View details shows several advisors\' points; {BACK}.'])
mk('88622',['At least two service advisors have invoiced work with clocked time this month in this location.'],
   ['For 4: check: Billing Efficiency (This Month) &gt; View details: the Advisor Analysis table lists at least two advisors. If not, create an invoice with clocked time for each advisor: '+SEED_T()+' Then repeat with a second customer and, in the work order\'s left panel, a different Service Advisor.'])
mk('88623',['The location has invoiced work with clocked technician time last month and this month.'],
   [f'For 4: check: Technician Efficiency on Last Month and on This Month each shows a percentage (not -); {BACK}. If this month has none, create one invoice with clocked time today: '+SEED_T()+' Last month cannot be created by hand: if no location has it, '+'mark the case Blocked and write in the result comment that no location has this data.'])
mk('88624',['The location has sales and technician time this year.'],
   [f'For 4: check: on Reports &gt; Sales with Date: This year, the table has rows. If not, create one invoice with clocked time: '+SEED_T()],
   ['If a report shows Show Chart at the right of its toolbar, click it once so the chart is shown.'])
# 351716 — use the quiet location (0% shop supplies) so the invoice adds exactly $250.00
pre=[P1,'You are in a location (workplace) where nobody else creates an invoice or a credit memo while you run the case, and where no shop supplies are added (for example ZZAUTOTEST Dashboard Quiet).',P3Z,
     'You have written down the Revenue headline on This Month (e.g. $2,422.00) before the invoice below is created.',
     'Then one invoice dated today is created in that location, with no discount, with clocked time, for example 2.50 hours at $100.00 an hour = $250.00.']
setup=[S_ADMIN, f'For 2: to change location, {LOC_ROUTE}; pick ZZAUTOTEST Dashboard Quiet (it charges 0 % shop supplies). If you cannot be sure nobody else invoices there while you run the case, write that in the result comment.',
       'For 4: Dashboard &gt; Revenue tile on This Month.', 'For 5: '+SEED_T(hrs='Estimated Time 2.5 and Tech Time 2.5')]
spec['351716']=(pre,setup,stepfix('351716'))
mk('351717',['At least two service advisors each have an invoiced work order with clocked time this month in this location.'],
   ['For 4: check: Billing Efficiency (This Month) &gt; View details: the Advisor Analysis table lists at least two advisors. If not, create an invoice with clocked time for each advisor: '+SEED_T()+' Then repeat with a second customer and, in the work order\'s left panel, a different Service Advisor.'])
mk('351718',['At least two technicians and at least two service advisors have invoiced work with clocked time this month in this location.'],
   ['For 4: check: Technician Efficiency (This Month) &gt; View details &gt; Technician filter lists at least two names, and Billing Efficiency (This Month) &gt; View details &gt; Advisor filter lists at least two names. If not, create the data: with Tech ShopView and your own name as Service Advisor: '+SEED_T()+' Then '+NEW_TECH+', and repeat with a second customer, that technician and a different Service Advisor.'],
   ['You use the same browser throughout (the choice is kept in this browser only).'])
mk('351720',['A technician whose only clocked work this month is billed far above the time clocked exists: one invoiced work order today with one labor line of 1.00 hour assigned to that technician, who clocked exactly 0.25 hours on it (1.00 / 0.25 x 100 = 400%).'],
   ['For 4: use a technician with no other clocked time this month: '+NEW_TECH.replace('a second technician','a new technician').replace('ZZAUTOTEST Tech Two','ZZAUTOTEST Tech')+'. Then '+SEED_T(tech='that technician').replace('as the technician: in a second browser or a private window, on the QA site\'s sign-in page, in the DEV MODE — QUICK LOGIN panel, click Tech (this signs you in as Tech ShopView, a technician at Staging Heavy Duty - 9919 with Time Clock on)','as that technician in a private window').replace('to make the time exact','make the clocked time exactly 0.25 hours (15 minutes)')])
mk('351721',['At least two service advisors have invoiced work with clocked time over the last twelve months in this location.'],
   [f'For 4: check: Billing Efficiency set to Last 12 Months &gt; View details &gt; Advisor filter lists at least two names; {BACK}. If not, create an invoice with clocked time for each advisor: '+SEED_T()+' Then repeat with a second customer and, in the work order\'s left panel, a different Service Advisor.'])
mk('351732',['At least two technicians appear in the Technician filter on Reports &gt; Technician Utilization, and the location has technician time this month.'],
   ['For 4: check: Reports &gt; Technician Utilization, Date: This month: the table lists at least two technicians. If not, create one invoice with clocked time: '+SEED_T()+' and, for a second technician, '+NEW_TECH+' and clock time with them the same way.'])
spec['204097']=([P1,'You are in a location (workplace) where no invoice has been created today.',P3Z,
  'Today, in that location, a credit was issued against an invoice from an earlier week, larger than today\'s sales (e.g. $300.00), so today\'s revenue is negative; no invoice is created today.'],
  [S_ADMIN, f'For 2: to change location, {LOC_ROUTE}. Check: Reports &gt; Sales &gt; Date: a custom range of today only (click today twice, then Apply): the total reads $0.00. If other people invoice there today, use a quieter location.',
   f'For 4: Customers &gt; a customer &gt; Invoices tab (turn Open only off): open an invoice dated before this week; on its work order\'s Finance tab, the invoice\'s three dots {G} Issue Credit, and credit more than today\'s sales (e.g. $300.00).'],stepfix('204097'))
out={}
for k,(pre,setup,steps) in spec.items():
    n={'custom_preconds':build(pre,setup)}
    if steps!=L[k]['custom_steps']: n['custom_steps']=steps
    ex=fixnames(L[k]['custom_expected'])
    if ex!=L[k]['custom_expected']: n['custom_expected']=ex
    out[k]=n
json.dump(out,open('/tmp/cln/refine/batch4.json','w')); print(len(out),'steps:',[k for k in out if 'custom_steps' in out[k]],'exp:',[k for k in out if 'custom_expected' in out[k]])
