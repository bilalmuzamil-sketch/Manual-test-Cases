import json
B="https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/claude/heic-upload-iphone-test-sz7h5p/build/sv9478-filter-cap-2026-09-01/evidence"
def t(s,marks=None):
    n={"type":"text","text":s}
    if marks: n["marks"]=marks
    return n
def p(*content): return {"type":"paragraph","content":list(content)}
def strong(s): return t(s,[{"type":"strong"}])
def code(s): return t(s,[{"type":"code"}])
def heading(s,l=3): return {"type":"heading","attrs":{"level":l},"content":[t(s)]}
def rule(): return {"type":"rule"}
def panel(kind,*content): return {"type":"panel","attrs":{"panelType":kind},"content":list(content)}
def media(url,caption):
    ms={"type":"mediaSingle","attrs":{"layout":"full-width"},
        "content":[{"type":"media","attrs":{"type":"external","url":url}}]}
    return [ms, p(t(caption,[{"type":"em"}]))]
def cell(*content,head=False):
    return {"type":"tableHeader" if head else "tableCell","attrs":{},"content":list(content)}
def row(cells): return {"type":"tableRow","content":cells}
def status(s):
    col="Green" if s=="PASS" else ("Yellow" if "NOT" in s or "note" in s.lower() else "Red")
    return {"type":"status","attrs":{"text":s,"color":col.lower()}}

# --- table of checks ---
checks=[
 ("50-value cap: pick vendors + categories to 50 total; 50th applies, further options lock, notice \"50 selected (max 50 across all filters)\"","PASS"),
 ("At the cap, deselecting works and a different value can then be selected","PASS"),
 ("With exactly 50 selected the report request returns 200 and filters correctly","PASS"),
 ("Location filter at its default does not consume the 50 budget","PASS"),
 ("Select all works even at the cap and sends no IDs (unlimited)","PASS"),
 ("New \"All …\" select-all row on Parts Catalogue, Staff and Inventory; chip reads \"All <noun>\"","PASS"),
 ("Shared link with 60 valid vendor UUIDs loads (no 400/414/CloudFront) and clamps to 50","PASS"),
 ("X-Current-Page header on a heavily-filtered page stays well under 8 KB (measured 2,844 bytes)","PASS"),
 ("Backend guard: 51 counted values -> 400 with one error per offending param; 50 -> passes","PASS"),
 ("Backend guard: 26 vendors + 25 categories -> 400 with two error entries (combined count)","PASS"),
 ("Exemptions: locations, Technician Utilization exclude list, and bulk-id endpoints are not counted","PASS"),
 ("Regression: Technician Utilization technicians never locked or trimmed","PASS"),
 ("Regression: Sales By Customer customers select-all = all customers","PASS"),
 ("Regression: WO Notes tab loads on a work order with many lines","PASS"),
 ("Mobile bottom-sheet: at the 50 cap the notice shows, options lock, and an over-cap draft cannot be applied","PASS"),
 ("No false positives: default loads of all six affected reports do not 400 from the guard","PASS"),
 ("Request bodies are not counted: saving a 60-value report preference (in the body) succeeds","PASS"),
 ("Existing user with a pre-fix >50 saved selection: report clamps to 50, loads normally, no error","PASS"),
 ("Empty selection means ALL (not nothing) on a select-all screen (Parts Catalogue Category)","PASS"),
 ("Count Sheet PDF request carries no bin filters (113-byte request); the PDF 500 is the pre-existing bug SV-8043, not this change","PASS"),
]
table_rows=[row([cell(p(strong("#")),head=True),cell(p(strong("What I tested")),head=True),cell(p(strong("Result")),head=True)])]
for i,(txt,st) in enumerate(checks,1):
    table_rows.append(row([cell(p(t(str(i)))),cell(p(t(txt))),cell(p(status(st)))]))
table={"type":"table","attrs":{"isNumberColumnEnabled":False,"layout":"default"},"content":table_rows}

doc={"type":"doc","version":1,"content":[
 panel("success",
    p(strong("OVERALL QA STATUS: PASSED")),
    p(t("Tested on the QA branch (sv9478.qa.shopview.com, build v26.35.7-7e3d970), against an org with 1,042 vendors and full inventory (well past the ~163 that triggered the original outage). The >8 KB header/URL outage is fixed; the 50-value combined cap works with its lock and inline notice on desktop and mobile; Select-all stays unlimited; the backend guard returns per-parameter 400s; and every exempt path is confirmed uncounted. I also ran the field scenarios most likely to regress — no false positives on the six reports, request bodies not counted, and an existing user's pre-fix >50 saved selection clamps to 50 and loads cleanly. No blocking issues found."))),
 heading("What I tested"),
 table,
 heading("Evidence"),
 *media(B+"/EX1-cap-before-after-annotated.png",
    "The 50-value cap on Inventory Value, before and after. Below the cap every option stays selectable with no notice; once individually-picked values reach 50 combined, the remaining unchecked options lock and the inline notice \"50 selected (max 50 across all filters)\" appears."),
 *media(B+"/EX3-selectall-annotated.png",
    "Select all (unlimited path). Parts Catalogue's Category filter has a new \"All categories\" select-all row (replacing the old \"Clear selection\" footer); empty selection means all rows and sends no IDs, so it is never capped. Same new row confirmed on Staff and Inventory."),
 *media(B+"/EX2-sharedlink-annotated.png",
    "Oversized shared link. Opening a report URL carrying 60 valid vendor UUIDs loads cleanly with no 400 / 414 / CloudFront error, clamps the selection to 50, and the X-Current-Page header measured 2,844 bytes (limit is 8,192)."),
 *media(B+"/EX4-mobile-cap-annotated.png",
    "Mobile bottom sheet (390-wide viewport). At the 50 cap the sheet shows the inline notice \"50 selected (max 50 across all filters)\" and every unchecked vendor is greyed and locked; tapping an unchecked one does not add it, and a blocked add shows \"This change would exceed the 50-value limit across all filters\". The valid 50-value draft applies via Apply Filters."),
 rule(),
 heading("How to reproduce (for the developer)"),
 p(strong("The cap — "),t("Reports → Inventory Value → open Vendor, then Category, and tick values one at a time. The 50th tick across the two filters is the last that applies; after that every unchecked option is disabled and the red \"50 selected (max 50 across all filters)\" line shows under the list. Untick one and a different vendor can be ticked again.")),
 p(strong("Select-all — "),t("On Parts Catalogue → Category (or Staff → Roles, Inventory → Bin Location) open the filter: the first row is now \"All …\". Leaving it selected sends no IDs, so results show everything and no cap applies. The chip reads \"All <noun>\".")),
 p(strong("Shared link — "),t("While logged in, open /reports/inventory-value with more than 50 valid vendorIds in the query string. The page loads normally, the vendor chip shows 50, and the URL is rewritten. (Fabricated UUIDs are dropped by the environment's existing sanitization and surface a pre-existing \"Invalid parameter type\" toast — not part of this change.)")),
 heading("Technical details"),
 p(strong("Backend guard responses (exact):")),
 {"type":"codeBlock","attrs":{},"content":[t(
"GET /api/reporting/reports/inventory-value?vendors=<51 UUIDs>\n"
" -> 400 {\"errors\":[{\"vendors\":\"Too many filter values selected: 51 of 51 selected values (maximum 50).\"}]}\n\n"
"GET .../inventory-value?vendors=<50 UUIDs>  -> 200\n\n"
"GET .../inventory-value?vendors=<26>&categories=<25>\n"
" -> 400 {\"errors\":[{\"vendors\":\"...26 of 51...\"},{\"categories\":\"...25 of 51...\"}]}\n\n"
"GET .../inventory-value?locations=<60>&vendors=<40>  -> 200  (locations uncounted)\n\n"
"Customer-portal find-by-ids with >50 ids  -> 200 (exempt)")]},
 p(t("The guard counts the combined total across counted params and reports it per offending parameter — confirming the cap is across all filters, not per filter. X-Current-Page no longer carries the query string (2,844 bytes on a 50-vendor page).")),
 p(strong("Robustness / field-risk checks (all passed): "),t("default loads of all six affected reports do not trip the guard (Work In Progress's 400 is its own required from/to-date validation, not the guard); request bodies are not counted (a 60-value preference saves fine); an existing user's pre-fix >50 saved selection clamps to 50 and loads with 0 guard 400s and a 2,374-byte header; empty selection means all (not nothing) on the new select-all screens; and the guard boundary is exact (50 passes, 51 fails).")),
 p(strong("Count Sheet PDF: "),t("the Cycle Count -> Print request correctly carries no bin filters (113-byte URL), so the URL-limit concern is resolved. The PDF itself then returns 500, but that is the pre-existing known bug SV-8043 (\"Cycle count Print returns 500\", Ready to Fix) — it 500s even with zero parameters and is not the cap guard, so it is unrelated to this change.")),
 p(strong("Not verified this run (none a blocker): "),t("the Sales By Customer empty-selection pole (this org has no customer records to deselect); TimeSheets and Pricing Matrix dialogs. Pre-existing out-of-scope items noted in the handoff (logged-out shared link, customer-portal find-by-ids above ~170 ids, TU exclude byte-risk above ~150 technicians) were not part of this verification.")),
]}
open("/tmp/sv9478/comment.adf.json","w").write(json.dumps(doc,indent=1))
# plain-text preview
def flat(node,depth=0):
    out=[]
    ty=node.get("type")
    if ty=="text": return node["text"]
    if ty=="status": return "["+node["attrs"]["text"]+"]"
    if ty in ("mediaSingle",): return "  [IMAGE]"
    if ty=="media": return "  [IMAGE]"
    kids=node.get("content",[])
    inner="".join(flat(k,depth) for k in kids)
    if ty=="heading": return "\n## "+inner+"\n"
    if ty=="paragraph": return inner+"\n"
    if ty=="panel": return "|PANEL:"+node["attrs"]["panelType"]+"|\n"+inner
    if ty=="rule": return "\n"+"-"*60+"\n"
    if ty=="codeBlock": return "```\n"+inner+"\n```\n"
    if ty=="table":
        rows=[]
        for r in kids:
            cells=[ "".join(flat(c) for c in cc.get("content",[])).strip() for cc in r.get("content",[])]
            rows.append(" | ".join(cells))
        return "\n".join(rows)+"\n"
    return inner
print("\n".join(flat(n) for n in doc["content"]))
