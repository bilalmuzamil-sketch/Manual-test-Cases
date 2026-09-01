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
            r=urllib.request.Request(BASE+path,data=data,method="POST" if body else "GET")
            r.add_header("Authorization","Basic "+base64.b64encode(f"{E}:{K}".encode()).decode())
            if body is not None: r.add_header("Content-Type","application/json")
            with urllib.request.urlopen(r,context=CTX,timeout=90) as x:
                raw=x.read().decode().strip(); return json.loads(raw) if raw else {}
        except Exception as e:
            if t<tries-1: time.sleep(2*(t+1)); continue
            raise
def esc(s): return H.escape(str(s),quote=False)
def ol(items): return "<ol>\n"+"".join(f"<li>{esc(i)}</li>\n" for i in items)+"</ol>\n"
def expected(lines, source="Manually added (QA lead, 2026-09-01)."):
    out=ol(lines)+"<hr />\n<p>Source: "+esc(source)+"</p>\n<p>AUTOMATION: HOLD - manually added; to be build-verified.</p>\n"
    return out

cases=[
{"title":"Completed line does not offer the Add Part option",
 "preconds":["You have a work order with a line that has a part on it, and the line is in Complete status (reach it with the steps below)."],
 "steps":["Create a work order.","Create a line on the work order.","Click “+ Add Part” and add a part to the line.","Pick / receive the part.","Mark the line as Complete."],
 "expected":["After the line is marked Complete, the “+ Add Part” button no longer appears for that line."]},
{"title":"Completed line: only the allowed part fields are editable (inventory vs special order)",
 "preconds":["You have a completed line with a part on it (for example, quantity 5), reached with the steps below."],
 "steps":["Create a work order.","Create a line.","Add and pick an inventory part with quantity 5.","Order → receive a special order (SPO) part with quantity 5.","Mark the line as Complete.","Click the part and try to edit: Part number, Source, Vendor, Cost, Core charge, Description."],
 "expected":["For an INVENTORY part, only these fields are editable (all others are read-only): Category, Sell Price, Margin, Quantity.","For a SPECIAL ORDER (SPO) part, only these fields are editable: Description, Category, Sell Price, Margin.","Part number, Source, Vendor, Cost and Core charge are NOT editable on a completed line."]},
{"title":"Add Part calculates the Sell Price from the cost via the pricing matrix",
 "preconds":["Create a work order and create a new line."],
 "steps":["Click “+ Add Part”.","Add a part number as a special order part, OR select an inventory / catalogue part from the list.","Enter the quantity, then enter the cost."],
 "expected":["Entering the cost fills in the Sell Price automatically, calculated from the pricing matrix."]},
{"title":"Changing the part category recalculates the Sell Price via the matrix",
 "preconds":["Create a work order and create a line."],
 "steps":["Click “+ Add Part”.","Fill in all the fields needed to add the part to the line, but do NOT click Save.","Change the Category, cycling through different categories."],
 "expected":["The Sell Price changes according to the selected category, for categories that have a different pricing matrix."]},
]
made=[]
for cs in cases:
    payload={"title":cs["title"][:250],"custom_preconds":ol(cs["preconds"]),"custom_steps":ol(cs["steps"]),
             "custom_expected":expected(cs["expected"]),"refs":"SV-9315 (Manually added)","custom_atmstatus":1,"custom_automation_type":0}
    r=call(f"add_case/{SECTION}",payload)
    made.append((r["id"],cs["title"]))
    print("created C%d  %s" % (r["id"],cs["title"][:60]))
json.dump(made,open("build/inline-add-edit-parts/manual-cases-2026-09-01/created.json","w"),indent=1)
