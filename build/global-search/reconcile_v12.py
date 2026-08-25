#!/usr/bin/env python3
"""Reconcile Global Search cases v1.1 -> PRD v1.2 (Confluence v11).
Transforms in place: (1) re-pin provenance to v1.2 on every case; (2) move quick-action
cases to an Out-of-V1 area with an exclusion block + reference; (3) flip Show-all / tabs /
contact-match / placeholder to v1.2. New V1 cases are added by a separate append script.
"""
import json, glob, re

OUT_AREA = "Global Search - Out of V1 Scope (not tested this release)"
QA_IDS = {"GS-HOVER-01","GS-HOVER-02","GS-HOVER-03","GS-HOVER-04","GS-HOVER-05",
          "GS-HOVER-06","GS-HOVER-07","GS-HOVER-08"}
EXCL = ("EXCLUDED FROM V1 - not tested in this release. Contextual quick actions on result rows are a "
        "v1 non-goal: the Global Search PRD v1.2 documents the intended behaviour in section 5.4 but "
        "states it “is not part of the v1 build and carries no v1 stories” (see also section 2, "
        "Non-Goals). Kept for the future release in which quick actions are built - do not execute "
        "against the v1 build.")

def clean_sec(sr):
    if not sr: return "the relevant section"
    s = sr.strip().replace("requirements.md ", "section ")
    if "tech plan" in s.lower() or "technical implementation" in s.lower() or "(Global Search PRD" in s:
        return "the section/story named in this case's References"
    return s

def prov(spec_ref, excl=False):
    sec = clean_sec(spec_ref)
    p = ("\n\n---\n"
         + (EXCL + "\n\n" if excl else "")
         + "This is the expected behaviour as per epic SV-9160 and the Global Search - Product "
           "Requirements specification version 1.2 (Confluence page 576978945, Confluence version 11), "
           f"{sec}, read on 25 August 2026."
           "\n\nAUTOMATION: Not available on Build to test Yet - Last checked 8/25/2026")
    return p

def body_of(exp):
    return re.split(r'\n\s*---\s*\n', exp)[0].rstrip()

def numbered(lines):
    return "\n".join(f"{i+1}. {l}" for i, l in enumerate(lines))

# --- explicit v1.2 rewrites (title, refs, spec_ref, body lines) ---
REWRITE = {
 "GS-TAB-01": dict(title="The scope tab strip lists All plus all nine entity tabs in the exact order",
   refs="SV-9160 (PRD 5.2 tab strip - ten tabs)", spec_ref="section 5.2 (tab strip)",
   body=["The tabs read, in this exact left-to-right order: All, Work Orders, Customers, Contacts, Assets, Parts, Vendors, Part Sales, Purchase Orders, Vendor Invoices.",
         "The 'All' tab is selected by default.",
         "Each tab carries its total result count over the full result set (for example 'All (12)', 'Work Orders (8)').",
         "The strip scrolls horizontally since ten tabs do not fit the 640px modal width.",
         "A tab is shown only for an entity type the user has permission to see."]),
 "GS-GRP-03": dict(title="A 'Show all N' link appears when a group has more than five matches",
   refs="SV-9160 (PRD 5.2 Show all N link)", spec_ref="section 5.2 (Show all N link)",
   body=["When a result group has more than five matches, a 'Show all N' link appears to the right of that group's heading (for example 'Show all 12').",
         "A group with five or fewer matches shows no 'Show all' link.",
         "The number N reflects the true total for that entity in the current query, not the capped five."]),
 "GS-GRP-04": dict(title="Clicking 'Show all N' hands off to the entity's list page with a banner",
   refs="SV-9160 (PRD 5.2 Show all full-page handoff)", spec_ref="section 5.2 (Show all - full-page handoff and results banner)",
   body=["Clicking 'Show all N' closes the search modal and navigates to that entity's list page with the query carried over.",
         "The list is filtered to the query and a banner above the table reads 'Showing N <entity> matching «query»'.",
         "The banner has a 'Clear search' action that drops the filter and leaves the user on the unfiltered list.",
         "While the handoff filter is active, the list page's own inline search field stays empty so the two filters are not confused.",
         "This is implemented for Work Orders in the prototype; each remaining entity list is expected to get the same treatment."]),
 "GS-TAB-09": dict(title="Selecting a scope tab shows only that entity's results with its count",
   refs="SV-9160 (PRD 5.2 scope tab scoping)", spec_ref="section 5.2 (scope tab scoping)",
   body=["Selecting an entity scope tab scopes the query to that entity type only.",
         "Within the scoped tab the results carry that entity's true total count in the heading.",
         "When the scoped entity has more than five matches the same 'Show all N' link is available (full-page handoff per the Show-all case)."]),
 "GS-ENT-07": dict(title="A customer or vendor matched on a contact field shows 'Contact match'",
   refs="SV-9160 (PRD 4 contact-field match)", spec_ref="section 4 (contact-field match)",
   body=["The customer or vendor still appears in the results.",
         "Its secondary line shows 'Contact match' to indicate the match was on a contact field (phone or email) rather than the name.",
         "When the query reaches both a contact and its parent company, two rows are returned - the contact in the Contacts group and the company in its own group carrying the 'Contact match' label; neither row suppresses the other."]),
 "GS-EMPTY-01": dict(title="First-time empty state shows the placeholder, helper text and quick-create buttons",
   refs="SV-9160 (PRD 5.1 5.2 first-time state)", spec_ref="section 5.1 / 5.2 (first-time state and placeholder copy)",
   body=["The modal input shows the placeholder 'Search work orders, customers, parts and more' (no 'ask a question' / AI wording - AI is out of scope in v1).",
         "Helper text below the input reads 'Type to start searching for work orders, parts, customers and more'.",
         "Three quick-create buttons are shown: 'New work order', 'New customer', 'New inventory part'.",
         "The footer keyboard legend is visible: down/up Navigate, Enter Select, Esc Close."]),
}

moved = repin = rewrote = 0
for f in glob.glob("build/global-search/cases/*.json"):
    cs = json.load(open(f)); changed = False
    for c in cs:
        cid = c["id"]
        if cid in REWRITE:
            r = REWRITE[cid]
            c["title"] = r["title"]; c["refs"] = r["refs"]; c["spec_ref"] = r["spec_ref"]
            c["expected"] = numbered(r["body"]) + prov(r["spec_ref"]); rewrote += 1; changed = True
            continue
        excl = cid in QA_IDS
        if excl:
            c["area"] = OUT_AREA; c["viu_status"] = "out-of-v1"; moved += 1
        c["expected"] = body_of(c["expected"]) + prov(c.get("spec_ref",""), excl=excl)
        repin += 1; changed = True
    if changed:
        json.dump(cs, open(f, "w"), indent=2, ensure_ascii=False); open(f, "a").write("\n")
print(f"re-pinned provenance: {repin}  | rewritten to v1.2: {rewrote}  | moved to Out-of-V1: {moved}")
