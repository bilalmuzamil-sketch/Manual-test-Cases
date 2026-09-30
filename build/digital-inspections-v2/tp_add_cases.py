# -*- coding: utf-8 -*-
"""Digital Inspections V2 - tech-plan coverage ADD cases (Rule 115 ADD; Rule 117 format).
Closes gaps the tech plan flags that the PRD cases do not cover: feature-flag-off state (NFR-014),
accessibility of verdict colour + dark tier (NFR-017/018/DFR-007), tenant scoping of new read paths
(NFR-005), and the not-inspected/na invariants (DFR-002/003/004)."""
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
SEC=int(open('/tmp/claude-0/di_tp_section.txt').read())
def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def ol(x): return "<ol>"+"".join(f"<li>{esc(i)}</li>" for i in x)+"</ol>"
def ul(x): return "<ul>"+"".join(f"<li>{esc(i)}</li>" for i in x)+"</ul>"
def expected(results,source,quotes,marker):
    return ("<p><strong>Expected results</strong></p>"+ul(results)
        +f"<p><strong>Source — where this behaviour comes from</strong><br>{esc(source)}</p>"
        +"<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"
        +ul([]).join([""])+"<ul>"+"".join(f"<li><strong>{esc(a)}:</strong> &ldquo;{esc(q)}&rdquo;</li>" for a,q in quotes)+"</ul>"
        +f"<p>{esc(marker)}</p>")
SRC="Epic SV-8181 (Digital Inspections V2); Digital Inspections V2 Foundation Technical Implementation Plan (engineering tech plan .md, provided 2026-09-30), sections 1.3-1.4; read 30 Sep 2026. This behaviour is specified by the tech plan and is not covered by the PRD stories."
HOLD_FLAG="AUTOMATION: HOLD - flag-off server gating is a developer/automated check, and not yet build-verified on the sv8181 QA build"
HOLD_SRV="AUTOMATION: HOLD - server-side scoping is a developer/automated check; the two-org observation is manual, not yet build-verified on the sv8181 QA build"
HOLD="AUTOMATION: HOLD - not yet build-verified on the sv8181 QA build"

CASES=[
{"title":"Feature flag off: every new inspection surface is absent",
 "pre":["You are signed in with the inspection roles ('Settings - Service', 'Work Order Lines - Create & Edit'), on the build under test.",
   "The Digital Inspections V2 feature flag is OFF for the shop. Seed it: set the shop's feature flag off (an admin/config toggle - ask the QA lead if you cannot set it), then reload."],
 "steps":["With the flag OFF, open the template builder and confirm the Per axle field type, the 'Note required if Monitor / Not OK' option and the 'Photo required if Not OK' option are absent.",
   "Confirm reference-file attachment, conditional follow-ups, the Mark OK action and Preview mode are absent.",
   "Open a completed inspection and the asset Inspections tab and confirm the ShopCoach Build lines action and the tab's V2 additions are absent.",
   "Turn the flag ON and confirm every one of those surfaces appears.",
   "Note for the tester: that the server itself refuses a V2 endpoint while the flag is off cannot be proven by hand - it is a developer/automated check. By hand, confirm only that each surface is genuinely absent, not greyed."],
 "results":["With the feature flag off, none of the Digital Inspections V2 surfaces render - the Per axle field type, the note-required and photo-required options, reference files, conditional follow-ups, Mark OK, Preview, and the ShopCoach build entry points are all absent.",
   "With the flag on, every one of those surfaces appears.",
   "Every new endpoint is gated by the flag, so a request made while the flag is off is refused whatever the interface showed (server-enforced; a developer/automated check)."],
 "quotes":[("NFR-014","The feature flag gates every new endpoint and every new surface, and flag-off is a tested state.")],
 "marker":HOLD_FLAG},
{"title":"Verdict is never colour alone; colour placement; dark theme",
 "pre":["You are signed in as a technician with 'Work Order Lines - Create & Edit', on the build under test.",
   "An inspection with a per-axle field carrying both judged positions and not-inspected positions. Seed it: Settings - Service > Inspection Templates > add a Per axle field; fill an inspection and give some positions a verdict, leaving others not inspected.",
   "Be able to view the screen in light theme and in dark theme."],
 "steps":["Read the answer buttons, the verdict menu and the status chips and confirm each states the verdict in words, not by colour alone.",
   "Confirm verdict colour appears only on the input border, the verdict marker and the status chips - never as a card or container background.",
   "Confirm the truck diagram is the only colour-only surface, with the readings shown beside it.",
   "Switch to dark theme and confirm a not-inspected position is still distinguishable from a judged one."],
 "results":["Every verdict surface that states a verdict does so in words - the answer buttons, the verdict menu and the status chips are labelled, so colour is never the only signal.",
   "Verdict colour is confined to the input border, the verdict marker and the status chips, and never fills a card or container background.",
   "The truck diagram is the single deliberate colour-only surface; because the readings sit beside it, a tyre's tint summarises rather than solely states its verdict.",
   "In dark theme a not-inspected position reads distinctly from a judged one (the grey-versus-tinted distinction is preserved, not inverted)."],
 "quotes":[("NFR-017","Verdict is never conveyed by colour alone on any surface — a shape, glyph or text label accompanies it."),
   ("DFR-007","Verdict colour appears on the input border, the verdict marker and status chips only — never as a container or card background."),
   ("NFR-018","The dark tier distinguishes not-inspected from judged correctly.")],
 "marker":HOLD},
{"title":"New read paths are scoped to organisation and workplace",
 "pre":["Two organisations/workplaces on the build under test, and a user who belongs to organisation A only.",
   "Inspection data belonging to organisation B: an inspection on an asset, a reference file on a template, and per-axle answers. Seed each in organisation B."],
 "steps":["As the organisation-A user, try to reach organisation B's inspection through the asset Inspections tab.",
   "Try to open organisation B's reference file and its per-axle answers by their addresses.",
   "Note for the tester: server-side scoping is a developer/automated check. By hand, confirm only that no data belonging to organisation B (or another workplace) is ever shown to the organisation-A user."],
 "results":["The asset Inspections tab, reference files and per-axle answers are scoped to both organisation and workplace; a user in another organisation or workplace cannot read them.",
   "Because the asset-history read deliberately crosses a customer boundary, the scoping is applied explicitly on each read rather than inherited from the customer join."],
 "quotes":[("NFR-005","Every new read path is tenant-scoped. The reference-file and axle rows carry no tenant column of their own, so each read joins its aggregate root and applies both organisation and workplace.")],
 "marker":HOLD_SRV},
{"title":"'Not inspected' is absence of a verdict, never a selectable option",
 "pre":["You are signed in as a technician with 'Work Order Lines - Create & Edit', on the build under test.",
   "A per-axle field (and a checkbox field) being filled, with some positions judged and some left not inspected. Seed a template with these fields and fill an inspection against it."],
 "steps":["Open the verdict menu on a position and read every option it offers.",
   "Confirm a not-inspected position carries no verdict of its own.",
   "Press Mark OK over a scope that includes unmeasured positions and confirm nothing is stamped as N/A by default.",
   "Confirm no default, seeding or migration wrote a verdict onto a position the technician did not action."],
 "results":["'Not inspected' is the absence of a verdict, not a value of it - it never appears as a selectable option in the verdict menu.",
   "No answer carries a verdict the technician did not cause: there is no seeding, no migration fill and no 'complete the record' job.",
   "'na' is never written as a default by any code path, including bulk Mark OK."],
 "quotes":[("DFR-004","\"Not inspected\" is the absence of a verdict, not a value of it, and never appears as a selectable option in the verdict menu."),
   ("DFR-003","No answer exists carrying a verdict the technician did not cause — no seeding, no migration fill, no \"complete the record\" job."),
   ("DFR-002","na is never written as a default by any code path, including bulk Mark OK.")],
 "marker":HOLD},
]
dry = "--apply" not in sys.argv
created=[]
for cs in CASES:
    payload={"title":cs["title"][:250],"custom_preconds":ol(cs["pre"]),"custom_steps":ol(cs["steps"]),
             "custom_expected":expected(cs["results"],SRC,cs["quotes"],cs["marker"]),
             "custom_automation_type":2,"custom_atmstatus":1}
    if dry: print("[DRY]",cs["title"]); continue
    r=api(f"add_case/{SEC}",payload); created.append(r["id"]); print("[OK] C%s  %s"%(r["id"],cs["title"]))
if not dry:
    json.dump(created,open('/tmp/claude-0/di_tp_created.json','w'))
    print("created",len(created),"tech-plan cases in section",SEC)
