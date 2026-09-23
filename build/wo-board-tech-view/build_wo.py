#!/usr/bin/env python3
"""Create the WO Board and Tech View cases in TestRail from cases.py + plain-bullets.txt + anchor-quotes.json.
Expected layout = Rule 113/114 three parts (plain results, source, verbatim quotes) + AUTOMATION HOLD."""
import json,urllib.request,base64,importlib.util,re,sys,time

c=json.load(open("/tmp/testrail/creds.json"))
HOST=c["host"].rstrip("/"); AUTH=base64.b64encode(f'{c["user"]}:{c["password"]}'.encode()).decode()
def api(ep,data=None):
    r=urllib.request.Request(f"{HOST}/index.php?/api/v2/{ep}",
        data=(json.dumps(data).encode() if data is not None else None),
        headers={"Authorization":"Basic "+AUTH,"Content-Type":"application/json"})
    for attempt in range(4):
        try: return json.load(urllib.request.urlopen(r,timeout=90))
        except Exception as e:
            if attempt==3: raise
            time.sleep(2*(attempt+1))

SMAP=json.load(open("section-map.json"))            # code -> [section_id, name]
QUOTES=json.load(open("anchor-quotes.json"))
PLAIN={}
for ln in open("plain-bullets.txt"):
    s=ln.rstrip("\n")
    if "::=" in s and not s.lstrip().startswith("#"):
        k,v=s.split("::=",1); PLAIN[k.strip()]=v.strip()
spec=importlib.util.spec_from_file_location("cases","cases.py"); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
CASES=m.CASES

STORY_JIRA={"S1":"SV-10044","S2":"SV-10045","S3":"SV-10046","S4":"SV-10047","S5":"SV-10048",
  "S6":"SV-10049","S7":"SV-10050","S8":"SV-10051","S9":"SV-10052","S10":"SV-10053","S11":"SV-10054",
  "S12":"SV-TBD (Story 12 has no Jira story yet)"}
STORY_NAME={"S1":"Story 1 Switch between display options","S2":"Story 2 Tech View","S3":"Story 3 Board View",
  "S4":"Story 4 Reassign or unassign the lead technician","S5":"Story 5 Choose what is shown",
  "S6":"Story 6 Density","S7":"Story 7 Line technicians on cards and rows","S8":"Story 8 Remove tech-story check-mark",
  "S9":"Story 9 Drag to reorder","S10":"Story 10 More-actions and lead assignment from List",
  "S11":"Story 11 Keyboard access and focus","S12":"Story 12 Google Analytics for display and field usage"}

def esc(t): return t.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def clean(q):
    q=q.replace("**","").replace("`","")
    return q.strip()
def block(lines): return "".join(f"<p>{esc(x)}</p>" for x in lines)
def ol(lines): return "<ol>"+"".join(f"<li>{esc(x)}</li>" for x in lines)+"</ol>"
def ul(items): return "<ul>"+"".join(f"<li>{x}</li>" for x in items)+"</ul>"

READ="read 23 Sep 2026"
def expected(anchors):
    # Part 1 plain results
    p1="<p><strong>Expected results</strong></p>"+ul(esc(PLAIN[a]) for a in anchors)
    # Part 2 source
    stories=[]
    for a in anchors:
        sc=a.split("-")[0]
        if sc in STORY_NAME and sc not in [s[0] for s in stories]:
            stories.append((sc,STORY_NAME[sc]))
    src_stories="; ".join(f"{STORY_JIRA[sc]} — {nm}" for sc,nm in stories)
    p2=("<p><strong>Source — where this behaviour comes from</strong><br>"
        f"Epic SV-10043 (Work Orders — Board View &amp; Tech View Display Options). "
        f"Story reference: {esc(src_stories)}. "
        f"Spec: Confluence page 845185030 &ldquo;Work Orders — Board View &amp; Tech View Display Options (Draft Spec)&rdquo;, Draft v0.9, "
        f"requirement(s) {esc(', '.join(anchors))} ({READ}). "
        f"Review decisions/answers: Confluence page 853901313 where cited. "
        f"Source-verified on 23 September 2026; not yet build-verified.</p>")
    # Part 3 verbatim quotes
    p3="<p><strong>Exact quotes from the source (for reproducibility)</strong></p>"+ul(
        f"<strong>{esc(a)}:</strong> &ldquo;{esc(clean(QUOTES[a]))}&rdquo;" for a in anchors)
    marker="<p>AUTOMATION: HOLD - not yet build-verified on the Work Orders QA build</p>"
    return p1+"<p></p>"+p2+"<p></p>"+p3+"<p></p>"+marker

def main():
    dry = "--create" not in sys.argv
    created={}
    for i,cs in enumerate(CASES,1):
        sec=SMAP[cs["sc"]][0]
        payload={
            "title":cs["t"][:250],
            "custom_preconds":block(cs["pre"]),
            "custom_steps":ol(cs["st"]),
            "custom_expected":expected(cs["a"]),
            "custom_automation_type":2,
            "custom_atmstatus":1,
        }
        if dry:
            if i<=2: print("SAMPLE",cs["sc"],cs["t"][:60],"\n  expected len",len(payload["custom_expected"]))
            continue
        r=api(f"add_case/{sec}",payload)
        created[str(r["id"])]={"sc":cs["sc"],"title":cs["t"],"anchors":cs["a"],"section":sec}
        print(f"[{i}/{len(CASES)}] C{r['id']} {cs['sc']} {cs['t'][:50]}")
    if not dry:
        json.dump(created,open("created-ALL.json","w"),indent=2)
        ids=sorted(int(x) for x in created)
        print("CREATED",len(created),"cases: C%d..C%d"%(ids[0],ids[-1]))
main()
