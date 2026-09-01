import urllib.request,json,base64,ssl,html as H,time
c={}
for l in open("/tmp/shopview-creds.env"):
    l=l.strip()
    if l and "=" in l and not l.startswith("#"): k,v=l.split("=",1);c[k]=v
E=c["CLAUDE_USERNAME"];K=c["TESTRAIL_API_KEY"]
BASE="https://shopview.testrail.io/index.php?/api/v2/";CTX=ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
SECTION=6755
def call(path,body=None,tries=4):
    for t in range(tries):
        try:
            data=json.dumps(body).encode() if body is not None else None
            r=urllib.request.Request(BASE+path,data=data,method="POST" if body is not None else "GET")
            r.add_header("Authorization","Basic "+base64.b64encode(f"{E}:{K}".encode()).decode())
            if body is not None: r.add_header("Content-Type","application/json")
            with urllib.request.urlopen(r,context=CTX,timeout=90) as x:
                raw=x.read().decode().strip(); return json.loads(raw) if raw else {}
        except Exception as e:
            if t<tries-1: time.sleep(2*(t+1)); continue
            raise
def esc(s): return H.escape(str(s),quote=False)
def ol(items): return "<ol>\n"+"".join(f"<li>{esc(i)}</li>\n" for i in items)+"</ol>\n"
def expected(lines):
    return ol(lines)+("<hr />\n<p>Source: Manually added (QA lead, 2026-09-01).</p>\n"
      "<p>UI control names (New Work Order, New Line, line status control) are PROVISIONAL - to be confirmed on the build.</p>\n"
      "<p>AUTOMATION: HOLD - manually added; to be build-verified.</p>\n")
# delete the first-attempt 4
for cid in (45246,45247,45248,45249):
    try: call(f"delete_case/{cid}",{}); print("deleted C%d"%cid)
    except Exception as e: print("del C%d: %s"%(cid,e))
cases=[
{"title":"Completed line does not offer the Add Part option",
 "preconds":["You have a work order line whose status is Complete and that has a part on it. Reach this state with the steps below."],
 "steps":["In the top menu, click “Work Orders”, then create a new work order (the “New Work Order” button).",
          "On the work order's “Lines” tab, click “New Line” to add a work order line.",
          "In that line's Parts section, click “+ Add Part” and add a part.",
          "Pick / receive the part.",
          "Set the line's status to Complete (the line status control)."],
 "expected":["On the now-Complete line, the “+ Add Part” button no longer appears in its Parts section."]},
{"title":"Completed line: only the allowed part fields are editable (inventory vs special order)",
 "preconds":["You have a work order line in Complete status with a part on it (quantity 5). Reach it with the steps below."],
 "steps":["In the top menu, click “Work Orders”, then create a new work order.",
          "On the “Lines” tab, click “New Line”.",
          "In the line's Parts section, click “+ Add Part”, then add and pick an INVENTORY part with quantity 5.",
          "Also add, via Order → Receive, a SPECIAL ORDER (SPO) part with quantity 5.",
          "Set the line's status to Complete.",
          "Click the part and try to edit each of: Part number, Source, Vendor, Cost, Core charge, Description."],
 "expected":["For an INVENTORY part, only these fields are editable (all others are read-only): Category, Sell Price, Margin, Quantity.",
             "For a SPECIAL ORDER (SPO) part, only these fields are editable: Description, Category, Sell Price, Margin.",
             "Part number, Source, Vendor, Cost and Core charge are NOT editable on a completed line."]},
{"title":"Add Part calculates the Sell Price from the cost via the pricing matrix",
 "preconds":["In the top menu, click “Work Orders”, create a new work order, and add a new line (“New Line” on the “Lines” tab)."],
 "steps":["In the line's Parts section, click “+ Add Part”.",
          "In the part number field, add a special order part number OR select an inventory / catalogue part from the typeahead list.",
          "Enter the Quantity, then enter the Cost."],
 "expected":["Entering the Cost fills in the Sell Price automatically, calculated from the pricing matrix."]},
{"title":"Changing the part category recalculates the Sell Price via the matrix",
 "preconds":["In the top menu, click “Work Orders”, create a new work order, and add a new line (“New Line” on the “Lines” tab)."],
 "steps":["In the line's Parts section, click “+ Add Part”.",
          "Fill in all the fields needed to add the part to the line, but do NOT click Save.",
          "Change the Category field, cycling through different categories."],
 "expected":["The Sell Price changes according to the selected category, for categories that have a different pricing matrix."]},
]
made=[]
for cs in cases:
    p={"title":cs["title"][:250],"custom_preconds":ol(cs["preconds"]),"custom_steps":ol(cs["steps"]),
       "custom_expected":expected(cs["expected"]),"refs":"SV-9315 (Manually added)","custom_atmstatus":1,"custom_automation_type":0}
    r=call(f"add_case/{SECTION}",p); made.append([r["id"],cs["title"]]); print("created C%d  %s"%(r["id"],cs["title"][:55]))
json.dump(made,open("build/inline-add-edit-parts/manual-cases-2026-09-01/created.json","w"),indent=1)
