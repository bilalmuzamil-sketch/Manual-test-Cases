# -*- coding: utf-8 -*-
"""WO Board & Tech View - tech-plan coverage ADD cases (Rule 115 ADD; Rule 117 format).
From the Board View & Tech View Display Options Technical Implementation Plan. Adds the CONFIRMED
behaviours the PRD cases do not cover (Imported view A3; the below-desktop interim; tenant scoping)."""
import json,urllib.request,base64,time,sys
c=json.load(open("/tmp/testrail/creds.json"))
HOST=c["host"].rstrip("/"); AUTH=base64.b64encode(f'{c["user"]}:{c["password"]}'.encode()).decode()
def api(ep,data=None):
    r=urllib.request.Request(f"{HOST}/index.php?/api/v2/{ep}",data=(json.dumps(data).encode() if data is not None else None),
        headers={"Authorization":"Basic "+AUTH,"Content-Type":"application/json"})
    for a in range(4):
        try: return json.load(urllib.request.urlopen(r,timeout=90))
        except Exception:
            if a==3: raise
            time.sleep(2*(a+1))
SEC=int(open('/tmp/claude-0/wob_tp_section.txt').read())
def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def ol(x): return "<ol>"+"".join(f"<li>{esc(i)}</li>" for i in x)+"</ol>"
def ul(x): return "<ul>"+"".join(f"<li>{esc(i)}</li>" for i in x)+"</ul>"
def expected(results,source,quotes,marker):
    return ("<p><strong>Expected results</strong></p>"+ul(results)
        +f"<p><strong>Source — where this behaviour comes from</strong><br>{esc(source)}</p>"
        +"<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
        +"<ul>"+"".join(f"<li><strong>{esc(a)}:</strong> &ldquo;{esc(q)}&rdquo;</li>" for a,q in quotes)+"</ul>"
        +f"<p>{esc(marker)}</p>")
SRC=("Epic SV-10043 (Work Orders - Board View & Tech View); Work Orders Board View & Tech View Display "
 "Options Technical Implementation Plan (engineering tech plan .md, provided 2026-09-30), section 1.4 "
 "Clarifications; read 30 Sep 2026. Specified by the tech plan / Product clarification and not covered "
 "by the PRD stories.")
HOLD="AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build"
HOLD_SRV="AUTOMATION: HOLD - server-side scoping is a developer/automated check; the two-org observation is manual, not yet build-verified on the Work Orders QA build"

CASES=[
{"title":"Imported: board displays off and Imported disabled as a status filter",
 "pre":["On the Work Orders QA build (Board View / Tech View on), signed in with Work Orders view permission.",
   "Seed / setup: have work orders in the Imported state at the location, plus eligible lead technicians and work orders in other statuses."],
 "steps":["Open the Work Orders page and select the Imported filter view.",
   "Look for the Board View and Tech View display options while Imported is selected.",
   "In Tech View and Board View, open the Status filter and look for Imported as an option."],
 "results":["While Imported is selected, the Board View and Tech View display options are unavailable (only List is offered).",
   "In Tech View and Board View, Imported is disabled as a Status-filter option."],
 "quotes":[("Clarification A3 (answered 2026-09-24)","Confirmed + extended: board displays unavailable while Imported is selected, and Imported is disabled as a Status-filter option in Tech View and Board View.")],
 "marker":HOLD},
{"title":"Below the desktop breakpoint the new displays are withheld",
 "pre":["On the Work Orders QA build (Board View / Tech View on), signed in with Work Orders view permission.",
   "Seed / setup: have eligible lead technicians and work orders at the location; a phone or a browser window narrowed below the desktop breakpoint."],
 "steps":["On a desktop-width screen, confirm the List, Tech View and Board View display options are offered.",
   "Narrow the window below the desktop breakpoint (or open on a phone) and read the Work Orders page.",
   "Look for the Tech View and Board View display options at that width."],
 "results":["Below the desktop breakpoint the Tech View and Board View displays are withheld and the page keeps today's mobile List (an interim state until the phone/tablet design exists - not the final V-2 requirement).",
   "At desktop width all three displays are available again."],
 "quotes":[("Clarification - Phone and tablet layouts (V-2, UX-20)","Design does not exist. Phase 13 keeps today's mobile List and withholds the new displays below the desktop breakpoint - an interim state, not the V-2 requirement.")],
 "marker":HOLD},
{"title":"New board/tech queries are scoped to organization and workplace",
 "pre":["Two organizations/workplaces on the Work Orders QA build, and a user in organization A only.",
   "Seed / setup: work orders, lead technicians and manual orders belonging to organization B; and a technician id that belongs to organization B."],
 "steps":["As the organization-A user, try to load organization B's Board View / Tech View data by its addresses.",
   "Attempt a reassignment supplying a technician id that belongs to organization B.",
   "Note for the tester: server-side scoping and the organization-ownership check are developer/automated checks. By hand, confirm only that no organization-B data or technician is ever shown or accepted."],
 "results":["Every new Board View / Tech View query is scoped by both workplace and organization; a user in another organization or workplace cannot read the data.",
   "An inbound technician id on a reassignment gets an organization-ownership check, so a technician from another organization is refused (eligibility remains the picker's job)."],
 "quotes":[("NFR-006","Every new query is scoped by workplace and organization."),
   ("Clarification - Tenant check on inbound technician id","Add organization-ownership check (eligibility stays the picker's job per the PRD).")],
 "marker":HOLD_SRV},
]
dry = "--apply" not in sys.argv
created=[]
for cs in CASES:
    payload={"title":cs["title"][:250],"custom_preconds":ol(cs["pre"]),"custom_steps":ol(cs["steps"]),
             "custom_expected":expected(cs["results"],SRC,cs["quotes"],cs["marker"]),
             "custom_automation_type":2,"custom_atmstatus":1}
    if dry: print("[DRY]",cs["title"]); continue
    r=api(f"add_case/{SEC}",payload); created.append(r["id"]); print("[OK] C%s  %s"%(r["id"],cs["title"]))
if not dry: json.dump(created,open('/tmp/claude-0/wob_tp_created.json','w')); print("created",len(created))
