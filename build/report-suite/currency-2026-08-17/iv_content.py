import json,csv,content_lib as C,sys,importlib
sys.path.insert(0,'/tmp'); import tr
importlib.reload(C)
idmap={}
for r in csv.DictReader(open('../testrail-id-map.csv')): idmap[int(r['testrail_case_id'][1:])]=r['internal_id']
inv={v:k for k,v in idmap.items()}
oplog=open('oplog-content.txt','a'); oplog.write("\n=== IV: date-range control -> single 'as of' date control (S5-R1/S1-R3/S5-R5/S5-R6/S6-R9/S8-R5/S10-R12/S11-R6) ===\n")
ASOF_DIV=("Note for the tester: an earlier version of this report offered a date range with ready-made periods. "
          "The current Inventory Value report specification (version 10, S5-R1/S5-R7) replaces that with a single \"as of\" date control "
          "- one calendar day, defaulting to today and capped at today - because a stock valuation is a point-in-time position, not an amount over a period. Follow the current specification.")
SYMPTOM_FIX=("The date range does open correctly on This Month","The \"as of\" date does open correctly on today")
MSG_OLD="Narrow the date range or filters, then try again."
MSG_NEW="Narrow the filters, then try again."

def do(iid, tfns, preconds_sub=None, steps_sub=None, title=None, div=None):
    """tfns: list of (old,new) on expected body. *_sub: list of (old,new) on that field."""
    cid=inv[iid]; st,f=tr.req(f'get_case/{cid}'); assert st==200,(iid,st)
    def bt(b):
        for a,n in tfns:
            assert a in b, f'{iid} BODY missing: {a!r}'; b=b.replace(a,n)
        return b
    ns=None
    if steps_sub is not None:
        ns=f.get('custom_steps') or ''
        for a,n in steps_sub: assert a in ns, f'{iid} STEPS missing: {a!r}'; ns=ns.replace(a,n)
    npre=None
    if preconds_sub is not None:
        npre=f.get('custom_preconds') or ''
        for a,n in preconds_sub: assert a in npre, f'{iid} PRE missing: {a!r}'; npre=npre.replace(a,n)
    pay=C.restamp(cid,f,new_title=title,new_preconds=npre,new_steps=ns,body_transform=bt,marker_mode='auto',divergence=div)
    C.write_verify(cid,pay,f,oplog)

# ---- light swaps ----
do('IV-NAV-02',
   [('2. The values are valued as of the resolved date (the current stock for a range reaching today, or the closest recorded nightly snapshot for an earlier date',
     '2. The values are valued as of the resolved date (the current stock when the "as of" date is today, or the closest recorded nightly snapshot for an earlier "as of" date')],
   steps_sub=[('3. Note the date range in the toolbar and which date the values','3. Note the "as of" date in the toolbar and which date the values')])
do('IV-FLT-02',
   [('3. Every change — date range, location, Category, Vendor, part search, sort — reloads the rows',
     '3. Every change — the "as of" date, location, Category, Vendor, part search, sort — reloads the rows')])
do('IV-FLT-05',
   [('1. A part must satisfy EVERY active filter and the search to appear — the Date range, Location, Category, Vendor, and part search combine with AND.',
     '1. A part must satisfy EVERY active filter and the search to appear — the "as of" date, Location, Category, Vendor, and part search combine with AND.')],
   title='"As of" date, Location, Category, Vendor and part search combine with AND')
do('IV-PERS-03',
   [('1. On return and after a reload, the report restores the saved date range, category selection',
     '1. On return and after a reload, the report restores the saved "as of" date, category selection')],
   steps_sub=[('1. Change the date range, select a category and a vendor','1. Change the "as of" date, select a category and a vendor')])
do('IV-EXP-07',[(MSG_OLD,MSG_NEW)])
do('IV-EXP-10',[(MSG_OLD,MSG_NEW)])
do('IV-LOC-01',[SYMPTOM_FIX])
do('IV-NAV-06',[SYMPTOM_FIX] if False else [],
   steps_sub=[('2. Select a Custom range ending before nightly recording began','2. Set the "as of" date to a day before nightly recording began')])
do('IV-DATE-09',
   [('the "As of" indicator na','the "as of" date control na') if False else
    ('1. The earlier recorded day still shows the category and vendor names','1. The earlier recorded day still shows the category and vendor names')],
   steps_sub=[('2. Set the report\'s date range so it shows the earlier recorded day (the "As of" indicator na',
               '2. Set the report\'s "as of" date to the earlier recorded day (the date control na')])
do('IV-API-05',
   [('every daily capture is kept — full daily per-part detail, covering the report\'s longest date preset (366 days / This Year / Last Year) entirely at daily resolution.',
     'every daily capture is kept — full daily per-part detail, covering a full 13 months of selectable "as of" days entirely at daily resolution.')])
oplog.write("=== IV LIGHT DONE ===\n"); print('IV light swaps done')
