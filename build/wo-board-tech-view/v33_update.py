#!/usr/bin/env python3
"""Update WO Board & Tech View cases to PRD v33 (2026-09-28).
Regenerates the Source line + verbatim 'Exact quotes' block from the v33 anchor map, using each
case's CURRENT anchor list (minus any anchors removed in v33). Optionally replaces the plain
runnable results / title / preconds / steps. Rule 113: the quote changes because the SOURCE changed."""
import json,urllib.request,base64,time,sys,re
c=json.load(open("/tmp/testrail/creds.json"))
HOST=c["host"].rstrip("/"); AUTH=base64.b64encode(f'{c["user"]}:{c["password"]}'.encode()).decode()
def api(ep,data=None):
    r=urllib.request.Request(f"{HOST}/index.php?/api/v2/{ep}",
        data=(json.dumps(data).encode() if data is not None else None),
        headers={"Authorization":"Basic "+AUTH,"Content-Type":"application/json"})
    for a in range(4):
        try: return json.load(urllib.request.urlopen(r,timeout=90))
        except Exception:
            if a==3: raise
            time.sleep(2*(a+1))
def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def ul(items): return "<ul>"+"".join(f"<li>{esc(x)}</li>" for x in items)+"</ul>"
V33=json.load(open("build/wo-board-tech-view/anchor-quotes-v33-2026-09-28.json"))
CREATED=json.load(open("build/wo-board-tech-view/created-ALL.json"))
JIRA={"S1":"SV-10044","S2":"SV-10045","S3":"SV-10046","S4":"SV-10047","S5":"SV-10048","S6":"SV-10049",
      "S7":"SV-10050","S8":"SV-10051","S9":"SV-10052","S11":"SV-10054","S12":"SV-10593"}
STORYNAME={"S1":"Switch between display options","S2":"Tech View","S3":"Board View",
  "S4":"Reassign or unassign the lead technician","S5":"Choose what is shown (fields and columns)",
  "S6":"Density in Tech View and Board View","S7":"Line technicians on cards and rows",
  "S8":"Remove the tech-story check-mark","S9":"Drag to reorder work and technician groups/columns",
  "S11":"Keyboard access and focus","S12":"Google Analytics for display and field usage"}
def source_block(sc, anchors):
    jira=JIRA.get(sc,"SV-10043"); nm=STORYNAME.get(sc,sc)
    reqs=", ".join(anchors)
    return ("<p><strong>Source &mdash; where this behaviour comes from</strong><br>"
        "Epic SV-10043 (Work Orders &mdash; Board View &amp; Tech View Display Options). "
        f"Story reference: {jira} &mdash; {esc(nm)}. Spec: Confluence page 845185030 "
        "&ldquo;Work Orders &mdash; Board View &amp; Tech View Display Options&rdquo;, "
        f"PRD v33 (2026-09-28), requirement(s) {esc(reqs)} (read 30 Sep 2026). "
        "Review decisions/answers: Confluence page 853901313 where cited. "
        "Source-verified on 30 September 2026; not yet build-verified.</p>")
def quotes_block(anchors):
    return ("<p><strong>Exact quotes from the source (for reproducibility)</strong></p><ul>"
        + "".join(f"<li><strong>{esc(a)}:</strong> &ldquo;{esc(V33[a])}&rdquo;</li>" for a in anchors)
        + "</ul>")
MARKER="<p>AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build</p>"
def patch(cid, results=None, title=None, pre=None, steps=None, drop=None, add_anchors=None):
    """drop = anchors to remove from this case; add_anchors = anchors to add (order appended)."""
    cid=str(cid); dry="--apply" not in sys.argv
    meta=CREATED[cid]; sc=meta["sc"]
    anchors=[a for a in meta["anchors"] if not (drop and a in drop)]
    if add_anchors: anchors=anchors+[a for a in add_anchors if a not in anchors]
    missing=[a for a in anchors if a not in V33]
    if missing: raise KeyError(f"C{cid}: anchors not in v33 map: {missing}")
    live=api(f"get_case/{cid}")
    exp=live["custom_expected"]
    # keep existing plain-results block if results not supplied
    if results is None:
        i0=exp.find("</p>")  # after '<p><strong>Expected results</strong></p>'
        i1=exp.find("<p><strong>Source")
        results_html=exp[exp.find("<ul>"):i1] if "<ul>" in exp[:i1] else exp[i0+4:i1]
    else:
        results_html=ul(results)
    newexp="<p><strong>Expected results</strong></p>"+results_html+source_block(sc,anchors)+"<p></p>"+quotes_block(anchors)+"<p></p>"+MARKER
    payload={"custom_expected":newexp}
    if title: payload["title"]=title[:250]
    if pre is not None: payload["custom_preconds"]="<ol>"+"".join(f"<li>{esc(x)}</li>" for x in pre)+"</ol>"
    if steps is not None: payload["custom_steps"]="<ol>"+"".join(f"<li>{esc(x)}</li>" for x in steps)+"</ol>"
    if dry:
        print(f"[DRY] C{cid} [{sc}] anchors={anchors}" + (f" title:{title[:50]}" if title else "") + (" +results" if results else ""))
        return
    # update local created map
    CREATED[cid]["anchors"]=anchors
    if title: CREATED[cid]["title"]=title
    api(f"update_case/{cid}",payload); print(f"[OK] C{cid} [{sc}] -> v33")
def save_map():
    if "--apply" in sys.argv:
        json.dump(CREATED,open("build/wo-board-tech-view/created-ALL.json","w"),indent=1)
        print("created-ALL.json updated")
