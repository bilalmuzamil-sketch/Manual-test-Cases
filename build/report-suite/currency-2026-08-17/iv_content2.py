import csv,content_lib as C,sys,importlib
sys.path.insert(0,'/tmp'); import tr
importlib.reload(C)
idmap={}
for r in csv.DictReader(open('../testrail-id-map.csv')): idmap[int(r['testrail_case_id'][1:])]=r['internal_id']
inv={v:k for k,v in idmap.items()}
oplog=open('oplog-content.txt','a'); oplog.write("\n=== IV substantive as-of rewrites (S5-R1/S1-R3/S5-R5/S5-R6) ===\n")
ASOF_DIV=("Note for the tester: an earlier version of this report offered a date range with ready-made periods. "
          "The current Inventory Value report specification (version 10, S5-R1/S5-R7) replaces that with a single \"as of\" date control "
          "- one calendar day, defaulting to today and capped at today - because a stock valuation is a point-in-time position, not an amount over a period. Follow the current specification.")
S820_OLD="ask for a range ending 15 July and it reports as of 16 July; ask for one ending 31 January and it reports as of 1 February"
S820_NEW="ask for an \"as of\" date of 15 July and it reports as of 16 July; ask for 31 January and it reports as of 1 February"

def do(iid,body_pairs,steps_pairs=None,title=None,div=None):
    cid=inv[iid]; st,f=tr.req(f'get_case/{cid}'); assert st==200,(iid,st)
    def bt(b):
        for a,n in body_pairs: assert a in b, f'{iid} BODY missing: {a!r}'; b=b.replace(a,n)
        return b
    ns=None
    if steps_pairs:
        ns=f.get('custom_steps') or ''
        for a,n in steps_pairs: assert a in ns, f'{iid} STEPS missing: {a!r}'; ns=ns.replace(a,n)
    pay=C.restamp(cid,f,new_title=title,new_steps=ns,body_transform=bt,marker_mode='auto',div=div) if False else \
        C.restamp(cid,f,new_title=title,new_steps=ns,body_transform=bt,marker_mode='auto',divergence=div)
    C.write_verify(cid,pay,f,oplog)

# IV-DATE-01
do('IV-DATE-01',
  [("1. The chooser offers nine ready-made periods, in this order: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week. Beside them it shows a month calendar you click dates on to build your own range, a live readout of how many days the range covers, and an Apply button. There is no \"Today\", no \"Yesterday\" and no item called \"Custom\" - you build your own range on the calendar instead. There is no \"All Time\" option.",
    "1. The toolbar has a single \"as of\" date control - one calendar day, not a range. It defaults to today and is capped at today (no future date). It offers no ready-made periods (no \"Last 12 Months\", no \"This Month\", no \"This Week\" and so on), no start-and-end pair, no item called \"Custom\", and no \"All Time\". You pick one day."),
   ("2. Because the report is valued as of a single date, an All-Time period would be meaningless; its absence is the documented behaviour.",
    "2. Because the report values stock as of a single point in time, a date range or an All-Time period would state something the number cannot mean; a single \"as of\" day is the documented behaviour.")],
  steps_pairs=[("1. Open the date-range control in the toolbar.","1. Open the \"as of\" date control in the toolbar."),
               ("2. Read every option offered.","2. Read what it offers.")],
  title="\"As of\" date control: a single day, defaults to today, capped at today",
  div=ASOF_DIV)
# IV-NAV-03
do('IV-NAV-03',
  [("1. The date range defaults to the current calendar month.","1. The \"as of\" date defaults to today."),
   ("The date range does open correctly on This Month.","The \"as of\" date does open correctly on today.")],
  steps_pairs=[("2. Read the date-range control's value.","2. Read the \"as of\" date control's value.")],
  title="First visit defaults to today and the active location",
  div=ASOF_DIV)
# IV-DATE-03
do('IV-DATE-03',[],
  steps_pairs=[("1. Select a range that reaches today (for example \"This Month\" or \"Today\").","1. Set the \"as of\" date to today.")],
  title="The \"as of\" date today, with today not yet recorded, values live stock",
  div=ASOF_DIV)
# IV-DATE-04
do('IV-DATE-04',
  [("1. The report replays the closest recorded day on or before the end of the selected range.",
    "1. The report replays the closest recorded day on or before the selected \"as of\" date."),
   (S820_OLD,S820_NEW)],
  steps_pairs=[("1. Open the date range picker and use the month calendar inside it to set a range ending on the past recorded day, then apply.",
                "1. Set the \"as of\" date to the past recorded day.")],
  div=ASOF_DIV)
# IV-DATE-05
do('IV-DATE-05',
  [("1. When the displayed day is an earlier recorded day than the date asked for, the report shows an \"As of\" indicator naming the day actually shown.",
    "1. When the displayed day is an earlier recorded day than the date you asked for, the \"as of\" date control itself names the day actually shown - the requested date on its face, and beneath it, inside the same control, the resolved day worded \"As of {date}\". There is no separate \"As of\" indicator anywhere else on the page."),
   ("2. When the displayed day matches the date asked for (the common current-view case), the \"As of\" indicator is not shown — the date control already communicates the date.",
    "2. When the displayed day matches the date you asked for (the common current-view case), the control shows only the selected date, with no \"As of\" line beneath it."),
   (S820_OLD,S820_NEW)],
  steps_pairs=[("1. Select a Custom range ending on the gap date (a date with no snapshot of its own).","1. Set the \"as of\" date to the gap date (a date with no snapshot of its own).")],
  title="The date control names the resolved day; no separate \"As of\" indicator",
  div=ASOF_DIV)
# IV-DATE-06
do('IV-DATE-06',
  [("1. A Custom range lets the user pick a start and end date, and the report values as of the picked end date.",
    "1. The \"as of\" date control lets you pick one calendar day, and the report values stock as of that day."),
   ("2. A future end date cannot be chosen — the end date is capped at today.",
    "2. A future day cannot be chosen — the \"as of\" date is capped at today."),
   ("3. Changing the date range reloads the report (the loading indicator shows and the rows re-fetch).",
    "3. Changing the \"as of\" date reloads the report (the loading indicator shows and the rows re-fetch)."),
   (S820_OLD,S820_NEW)],
  steps_pairs=[("1. Open the date-range control - a month calendar is shown inside it (there is no separate \"Custom\" item to choose).",
                "1. Open the \"as of\" date control - a single-day calendar (there is no start/end range and no \"Custom\" item).")],
  title="The \"as of\" date values stock as of that day; capped at today",
  div=ASOF_DIV)
oplog.write("=== IV SUBSTANTIVE DONE ===\n"); print('IV substantive done')
