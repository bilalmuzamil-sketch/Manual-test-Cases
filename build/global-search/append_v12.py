#!/usr/bin/env python3
"""Fix PO/VI entity cases to v1.2 and append new V1 cases (Clear all, entity tabs, mobile, ranking)."""
import json, glob, re

def prov(sec):
    return ("\n\n---\nThis is the expected behaviour as per epic SV-9160 and the Global Search - Product "
            "Requirements specification version 1.2 (Confluence page 576978945, Confluence version 11), "
            f"{sec}, read on 25 August 2026."
            "\n\nAUTOMATION: Not available on Build to test Yet - Last checked 8/25/2026")
def num(lines): return "\n".join(f"{i+1}. {l}" for i,l in enumerate(lines))
DESIGN = ("Claude 'Global Search' design fac6efcf (Global Search Page.html + Mobile Global Search.html); "
          "desktop page changed 2026-08-25, mobile unchanged.")
SPEC = "requirements.md / reconcile-2026-08-25/sources/PRD-v1.2-delta-snapshot.md (PRD 576978945 v1.2)"

def mk(cid, area, title, body, sec, refs, perms="View Global Search"):
    assert len(title)<=80, f"{cid} title {len(title)}"
    return {"id":cid,"area":area,"title":title,"priority":"Medium","type":"Functional",
            "permissions_required":perms,"preconditions":"The global search palette is available to the signed-in user.",
            "steps":["Perform the action described and observe the result."],
            "expected":num(body)+prov(sec),"design_ref":DESIGN,"spec_ref":"section "+sec if not sec.startswith("section") else sec,
            "refs":refs,"viu_status":"source-verified-only","notes":""}

# ---- 1. fix PO-01 / VI-01 (remove quick actions; align to v1.2 §5.3) ----
fixes={
 "GS-PO-01":["Purchase Orders appear as their own searchable entity, grouped under a 'Purchase Orders' heading with a true count and a scope tab (subject to permission).",
   "A PO row carries the package icon; the primary line shows the PO number + vendor, and the row shows a status badge (Ordered / Received) with the total and created date.",
   "PO results are gated by Vendor & Order Management: View."],
 "GS-VI-01":["Vendor Invoices appear as their own searchable entity, grouped under a 'Vendor Invoices' heading with a true count and a scope tab (subject to permission).",
   "A vendor-invoice row carries the file-text icon; the primary line shows the invoice number + vendor, with a status badge (Paid / Unpaid), the total, the invoice date, and the type (Invoice / Sublet).",
   "Vendor Invoice results are gated by Vendor & Order Management: View, and the invoice total is masked for a user without See Financial Data."],
}
FIXSEC={"GS-PO-01":"section 5.3 / 6.1 (Purchase Orders row)","GS-VI-01":"section 5.3 / 6.1 (Vendor Invoices row)"}
for f in glob.glob("build/global-search/cases/*.json"):
    cs=json.load(open(f)); ch=False
    for c in cs:
        if c["id"] in fixes:
            c["expected"]=num(fixes[c["id"]])+prov(FIXSEC[c["id"]])
            c["spec_ref"]=FIXSEC[c["id"]]; ch=True
    if ch: json.dump(cs,open(f,"w"),indent=2,ensure_ascii=False); open(f,"a").write("\n")

# ---- 2. append new V1 cases ----
addfile="build/global-search/cases/cases-F-v12-additions.json"
new=[
 mk("GS-REC-04","Recent Activity Default State","Clear all empties the history and returns to the first-time state",
   ["The first recent-activity group header carries a 'Clear all' action.",
    "Selecting 'Clear all' empties the entire recent-search history.",
    "After clearing, the panel falls back to the first-time state - helper text plus the three quick-create buttons - with no separate empty-history message.",
    "'Clear all' is present on both web and mobile."],
   "5.2 / 5.6 / 8 (Clear all)","SV-9160 (PRD 5.2 Clear all)"),
 mk("GS-TAB-10","Scope Tabs","The 'Contacts' tab shows only Contact results",
   ["Selecting the 'Contacts' tab scopes the query to contacts only.",
    "The tab carries the true contact count; results show contact rows only."],
   "5.2 (Contacts scope tab)","SV-9160 (PRD 5.2 Contacts tab)"),
 mk("GS-TAB-11","Scope Tabs","The 'Purchase Orders' tab shows only Purchase Order results",
   ["Selecting the 'Purchase Orders' tab scopes the query to purchase orders only.",
    "The tab carries the true PO count; results show PO rows only (subject to permission)."],
   "5.2 (Purchase Orders scope tab)","SV-9160 (PRD 5.2 Purchase Orders tab)"),
 mk("GS-TAB-12","Scope Tabs","The 'Vendor Invoices' tab shows only Vendor Invoice results",
   ["Selecting the 'Vendor Invoices' tab scopes the query to vendor invoices only.",
    "The tab carries the true count; results show vendor-invoice rows only (subject to permission)."],
   "5.2 (Vendor Invoices scope tab)","SV-9160 (PRD 5.2 Vendor Invoices tab)"),
 mk("GS-MOB-02","Mobile Global Search (v2)","On mobile the search is a full-screen surface with a Cancel action",
   ["On a phone the search is a full-screen screen that replaces the page, not a centered modal.",
    "The top bar shows a 'Cancel' action next to the input.",
    "The placeholder copy is 'Search everything'.",
    "There is no keyboard-hints footer on mobile."],
   "5.6 (mobile surface)","SV-9160 (PRD 5.6 mobile)"),
 mk("GS-MOB-03","Mobile Global Search (v2)","On mobile the scope chip row appears only with a query and lists matched types",
   ["Scope selection on mobile is a horizontal chip row.",
    "The chip row appears only once there is a query.",
    "It lists only the entity types that actually matched, each with its count, so the row stays short."],
   "5.6 (mobile scope chips)","SV-9160 (PRD 5.6 mobile scope)"),
 mk("GS-MOB-04","Mobile Global Search (v2)","On mobile results are uncapped and scroll with sticky group headers",
   ["Results are not capped per group and there is no 'Show all' overflow on mobile.",
    "The user scrolls the full grouped list.",
    "Group headers stick to the top of the list while scrolling.",
    "A tap on a row opens the record."],
   "5.6 (mobile results)","SV-9160 (PRD 5.6 mobile results)"),
 mk("GS-MOB-05","Mobile Global Search (v2)","Mobile first-time, recent and no-results states match web with stacked buttons",
   ["The first-time, recent-searches and no-results states match the web states.",
    "The quick-create buttons are stacked full-width instead of inline.",
    "'Clear all' behaves as on web: clearing the history returns the screen to the first-time state."],
   "5.6 (mobile states)","SV-9160 (PRD 5.6 mobile states)"),
 mk("GS-MOB-06","Mobile Global Search (v2)","On mobile the full-page handoff and keyboard navigation do not apply",
   ["The full-page result handoff and its banner (the web 'Show all' behaviour) do not apply on mobile in v1 - the mobile lists have no query handoff.",
    "Keyboard navigation does not apply on mobile."],
   "5.6 (mobile deferrals)","SV-9160 (PRD 5.6 mobile deferred)"),
 mk("GS-RANK-06","Ranking and Prioritization","Purchase Orders rank by Ordered status and recency",
   ["A Purchase Order that is still Ordered (not yet received) ranks above received ones.",
    "More recently created POs rank above older ones (recency decays over about two weeks).",
    "A PO created by the signed-in user gets a small additional boost."],
   "6.1 (Purchase Order signals)","SV-9160 (PRD 6.1 PO ranking)"),
 mk("GS-RANK-07","Ranking and Prioritization","Vendor Invoices rank Unpaid first and by recency",
   ["An Unpaid vendor invoice ranks above paid ones.",
    "More recent invoice dates rank higher (recency decays over about a month)."],
   "6.1 (Vendor Invoice signals)","SV-9160 (PRD 6.1 Vendor Invoice ranking)"),
 mk("GS-RANK-08","Ranking and Prioritization","Contacts rank by open work, recent contact and primary status",
   ["A contact whose owning company has at least one open work order ranks higher.",
    "A contact called or viewed by the signed-in user in the last 7 days gets a boost.",
    "A company's primary contact gets a small additional boost."],
   "6.1 (Contact signals)","SV-9160 (PRD 6.1 Contact ranking)"),
]
json.dump(new, open(addfile,"w"), indent=2, ensure_ascii=False); open(addfile,"a").write("\n")
print("fixed PO-01/VI-01; appended", len(new), "new V1 cases ->", addfile)
tot=sum(len(json.load(open(f))) for f in glob.glob("build/global-search/cases/*.json"))
print("new suite total:", tot)
