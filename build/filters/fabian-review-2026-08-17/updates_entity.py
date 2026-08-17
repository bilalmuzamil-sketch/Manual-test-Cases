# -*- coding: utf-8 -*-
"""Repurpose the 23 removed Work Orders entity-filter cases (Customer / Lead Technician /
Service Advisor). v1.7 removes Stories 3/4/5: these are no longer Work Orders filters. Their
searchable multi-select panel survives as the Story-16 entity-filter panel used elsewhere
(S16-R2/R3). Each case is re-scoped page-agnostic ("a page that still has this filter - confirm
live which pages carry it") and keeps its distinct panel behaviour. Removal noted in item 1."""
import os,sys; sys.path.insert(0,os.path.dirname(__file__))
from bodies import exp,J
V='[spec v21 2026-08-14]'
REMOVED_NOTE = ("Note: {name} is no longer a filter on the Work Orders page (removed in the "
  "redesign). Its searchable panel remains the standard entity-filter panel used on pages that "
  "still have a {short} filter - confirm live which pages those are.")

def entity(name, short, story):
    """Return the 9/7/7 payloads for one entity filter. Returns dict iid_suffix->payload builder."""
    return name

U={}
def mk(cid, title, refs, pre, steps, ex):
    U[cid]=dict(title=title, refs=refs, preconds=pre, steps=steps, expected=ex)

def pre_page(name, short):
    return J("1. You are signed in on a desktop browser.",
             f"2. You are on a page that still has a {short} filter (confirm live which pages carry it - the {name} filter was removed from Work Orders).")

# ---------------- CUSTOMER (C29566-C29574) ----------------
mk(29566,"An entity filter opens a searchable panel with a list and Clear selection",
   f"SV-9276 (S16-R2; S16-R6) {V}", pre_page("Customer","Customer"),
   J("1. Click the entity filter chip (for example Customer).","2. Read the panel that opens."),
   exp(["1. A pop-over panel opens under the chip.",
        "2. A search box with the placeholder 'Search customer' is pinned to the top.",
        "3. Below it is a scrollable checkbox list of values.",
        "4. A 'Clear selection' action is in the panel footer.",
        "5. The Customer filter is no longer on the Work Orders page; this searchable panel is now the standard panel for entity filters (Story 16)."],
     "S16-R2; S16-R6","story SV-9276 (Filter panel types); v1.7 removed the Customer Work Orders filter,"))
mk(29567,"Typing in an entity filter search narrows the list to matching values",
   f"SV-9276 (S16-R2) {V}", pre_page("Customer","Customer"),
   J("1. Open the entity filter panel.","2. Type part of a value name in the search box."),
   exp(["1. As you type, the list narrows to only the values whose name matches what you typed.",
        "2. Clearing the search box shows the full list again."],
     "S16-R2","story SV-9276 (Filter panel types),"))
mk(29568,"Selected entity values show as removable pills and as ticks in the list",
   f"SV-9276 (S16-R3) {V}", pre_page("Customer","Customer"),
   J("1. Open the entity filter panel.","2. Tick two or three values.","3. Read the search box and the list."),
   exp(["1. Each selected value appears as a removable pill inside the search box, each pill with an X; the box grows to fit them.",
        "2. The matching rows in the list below are also shown as ticked.",
        "3. There is no limit on how many values you can select."],
     "S16-R3","story SV-9276 (Filter panel types),"))
mk(29569,"Clicking the X on an entity value pill removes just that one value",
   f"SV-9276 (S16-R3) {V}", pre_page("Customer","Customer"),
   J("1. Open the entity filter panel and select several values.","2. Click the X on one of the pills."),
   exp(["1. Only that one value is removed from the selection.",
        "2. The other selected values stay selected and the list still shows them ticked."],
     "S16-R3","story SV-9276 (Filter panel types),"))
mk(29570,"An entity filter narrows the table to records matching any selected value",
   f"SV-9276 (S16-R2; S2-R6) {V}", pre_page("Customer","Customer"),
   J("1. Open the entity filter panel.","2. Select two values."),
   exp(["1. The table updates in real time (no apply button) to show only records that match ANY of the selected values.",
        "2. Removing a value re-widens the results accordingly."],
     "S16-R2; S2-R6","story SV-9276 (Filter panel types),"))
mk(29571,"Clear selection in an entity filter panel removes all its selected values",
   f"SV-9276 (S16-R6) {V}", pre_page("Customer","Customer"),
   J("1. Open the entity filter panel and select several values.","2. Click 'Clear selection'."),
   exp(["1. All selected values in that panel are cleared.",
        "2. Only that filter is cleared - any other active filter is left untouched.",
        "3. The table re-widens to the results without that filter."],
     "S16-R6","story SV-9276 (Filter panel types),"))
mk(29572,"Clicking outside an entity filter panel closes it and keeps the selection",
   f"SV-9276 (S16-R7) {V}", pre_page("Customer","Customer"),
   J("1. Open the entity filter panel and select a value.","2. Click somewhere outside the panel."),
   exp(["1. The panel closes.",
        "2. The selection you made is already applied and is kept - it is not discarded."],
     "S16-R7","story SV-9276 (Filter panel types),"))
mk(29573,"An entity filter search that matches nothing shows No matches",
   f"SV-9276 (S16-N1) {V}", pre_page("Customer","Customer"),
   J("1. Open the entity filter panel.","2. Type text that matches no value."),
   exp(["1. The panel body shows 'No matches'.",
        "2. Clearing the search box brings the full list back."],
     "S16-N1","story SV-9276 (Filter panel types),"))
mk(29574,"Selecting an entity value that has no records shows the empty state",
   f"SV-9276 (S16-R2; S8-R3) {V}", pre_page("Customer","Customer"),
   J("1. Open the entity filter panel.","2. Select a value that has no matching records."),
   exp(["1. The value is still listed and can be selected.",
        "2. When the selection matches no records, the table shows the no-results empty state (Story 8)."],
     "S16-R2; S8-R3","story SV-9276 (Filter panel types),"))

# ---------------- LEAD TECHNICIAN (C29575-C29581) ----------------
mk(29575,"Lead Technician is removed from Work Orders; its panel survives elsewhere",
   f"SV-9276 (S16-R2) {V}", pre_page("Lead Technician","Lead Technician"),
   J("1. On the Work Orders page, look for a Lead Technician filter chip.",
     "2. On a page that still has a technician filter, open its chip."),
   exp(["1. There is NO Lead Technician filter chip on the Work Orders page - it was removed in the redesign.",
        "2. Where a technician filter still exists on another page, its chip opens the standard searchable multi-select panel (search box 'Search technician', scrollable ticked list, Clear selection)."],
     "S16-R2","story SV-9276 (Filter panel types); v1.7 removed the Lead Technician Work Orders filter,"))
mk(29576,"Typing in a technician filter search narrows the list to matching names",
   f"SV-9276 (S16-R2) {V}", pre_page("Lead Technician","technician"),
   J("1. Open the technician filter panel.","2. Type part of a technician name."),
   exp(["1. The list narrows to only technicians whose name matches what you typed.",
        "2. Clearing the search shows the full list again."],
     "S16-R2","story SV-9276 (Filter panel types),"))
mk(29577,"A technician filter shows only records where they are the lead technician",
   f"SV-9276 (S16-R2; S16-R3) {V}", pre_page("Lead Technician","technician"),
   J("1. Open the technician filter panel.","2. Select one or more technicians."),
   exp(["1. Selected technicians show as ticks (and removable pills).",
        "2. The table narrows to only records where a selected technician is the lead technician.",
        "3. Selecting more than one technician shows records matching any of them."],
     "S16-R2; S16-R3","story SV-9276 (Filter panel types),"))
mk(29578,"Clear selection in the technician filter panel removes all technicians",
   f"SV-9276 (S16-R6) {V}", pre_page("Lead Technician","technician"),
   J("1. Open the technician filter panel and select several technicians.","2. Click 'Clear selection'."),
   exp(["1. All selected technicians are cleared and only that filter is removed.",
        "2. The table re-widens to results without that filter."],
     "S16-R6","story SV-9276 (Filter panel types),"))
mk(29579,"Clicking outside the technician filter panel closes it and keeps the selection",
   f"SV-9276 (S16-R7) {V}", pre_page("Lead Technician","technician"),
   J("1. Open the technician filter panel and select a technician.","2. Click outside the panel."),
   exp(["1. The panel closes and the selection stays applied - it is not discarded."],
     "S16-R7","story SV-9276 (Filter panel types),"))
mk(29580,"Selecting a technician who leads no records shows the empty state",
   f"SV-9276 (S16-R2; S8-R3) {V}", pre_page("Lead Technician","technician"),
   J("1. Open the technician filter panel.","2. Select a technician who leads no records."),
   exp(["1. The table shows the no-results empty state (Story 8)."],
     "S16-R2; S8-R3","story SV-9276 (Filter panel types),"))
mk(29581,"A deactivated technician does not appear in the technician filter list",
   f"SV-9276 (S16-R2) {V}", pre_page("Lead Technician","technician"),
   J("1. A technician has been deactivated.","2. Open the technician filter panel."),
   exp(["1. The deactivated technician is not offered in the list.",
        "2. Only currently valid technicians are shown."],
     "S16-R2","story SV-9276 (Filter panel types),"))

# ---------------- SERVICE ADVISOR (C29582-C29588) ----------------
mk(29582,"Service Advisor is removed from Work Orders; its panel survives elsewhere",
   f"SV-9276 (S16-R2) {V}", pre_page("Service Advisor","Service Advisor"),
   J("1. On the Work Orders page, look for a Service Advisor filter chip.",
     "2. On a page that still has an advisor filter, open its chip."),
   exp(["1. There is NO Service Advisor filter chip on the Work Orders page - it was removed in the redesign.",
        "2. Where an advisor filter still exists on another page, its chip opens the standard searchable multi-select panel (search box 'Search advisor', scrollable ticked list, Clear selection)."],
     "S16-R2","story SV-9276 (Filter panel types); v1.7 removed the Service Advisor Work Orders filter,"))
mk(29583,"Typing in an advisor filter search narrows the list to matching names",
   f"SV-9276 (S16-R2) {V}", pre_page("Service Advisor","advisor"),
   J("1. Open the advisor filter panel.","2. Type part of an advisor name."),
   exp(["1. The list narrows to only advisors whose name matches what you typed.",
        "2. Clearing the search shows the full list again."],
     "S16-R2","story SV-9276 (Filter panel types),"))
mk(29584,"An advisor filter shows only records assigned to the selected advisors",
   f"SV-9276 (S16-R2; S16-R3) {V}", pre_page("Service Advisor","advisor"),
   J("1. Open the advisor filter panel.","2. Select one or more advisors."),
   exp(["1. Selected advisors show as ticks (and removable pills).",
        "2. The table narrows to only records assigned to a selected advisor.",
        "3. Selecting more than one advisor shows records matching any of them."],
     "S16-R2; S16-R3","story SV-9276 (Filter panel types),"))
mk(29585,"Clear selection in the advisor filter panel removes all advisors",
   f"SV-9276 (S16-R6) {V}", pre_page("Service Advisor","advisor"),
   J("1. Open the advisor filter panel and select several advisors.","2. Click 'Clear selection'."),
   exp(["1. All selected advisors are cleared and only that filter is removed.",
        "2. The table re-widens to results without that filter."],
     "S16-R6","story SV-9276 (Filter panel types),"))
mk(29586,"Clicking outside the advisor filter panel closes it and keeps the selection",
   f"SV-9276 (S16-R7) {V}", pre_page("Service Advisor","advisor"),
   J("1. Open the advisor filter panel and select an advisor.","2. Click outside the panel."),
   exp(["1. The panel closes and the selection stays applied - it is not discarded."],
     "S16-R7","story SV-9276 (Filter panel types),"))
mk(29587,"Selecting an advisor with no assigned records shows the empty state",
   f"SV-9276 (S16-R2; S8-R3) {V}", pre_page("Service Advisor","advisor"),
   J("1. Open the advisor filter panel.","2. Select an advisor with no assigned records."),
   exp(["1. The table shows the no-results empty state (Story 8)."],
     "S16-R2; S8-R3","story SV-9276 (Filter panel types),"))
mk(29588,"A deactivated advisor does not appear in the advisor filter list",
   f"SV-9276 (S16-R2) {V}", pre_page("Service Advisor","advisor"),
   J("1. An advisor has been deactivated.","2. Open the advisor filter panel."),
   exp(["1. The deactivated advisor is not offered in the list.",
        "2. Only currently valid advisors are shown."],
     "S16-R2","story SV-9276 (Filter panel types),"))

if __name__=='__main__':
    for cid,u in U.items():
        assert len(u['title'])<=80,(cid,len(u['title']))
        assert ',' not in u['refs'],(cid,'comma in refs')
        assert '<' not in u['expected'] and '>' not in u['expected'],cid
    print("entity updates:",len(U),"validated")
