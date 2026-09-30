# -*- coding: utf-8 -*-
import importlib.util
spec=importlib.util.spec_from_file_location("v33","build/wo-board-tech-view/v33_update.py")
V=importlib.util.module_from_spec(spec); spec.loader.exec_module(V)
patch=V.patch

# ---- LIGHT: quote + Source refreshed to v33; plain results already accurate (reword/spelling) ----
LIGHT=["96956","97011","97025","96912","96916","96917","96924","97030","96928","96933",
       "96940","96966","96979","96983","97003"]
for cid in LIGHT: patch(cid)

# C96931 — drop the removed S2-R16; retitle (no hide-control clause); results reworded for empty Unassigned
patch("96931", drop=["S2-R16"],
  title="Every eligible technician appears even with no work, labelled No work orders",
  results=[
   "Every eligible technician has a group even without matching work, except while Assigned to me is enabled (then only groups holding my work show).",
   "A technician group with no work orders under the current filters, and an empty Unassigned group, show the text \"No work orders\"."])

# ---- MATERIAL: new runnable results (and corrected titles) matching the v33 quote ----
patch("96915",
  title="Returning to List uses the List sort; manual order never changes it",
  results=[
   "Switching back to List uses the List sort the user last chose there (e.g. by Created date).",
   "The manual order set in Tech View or Board View never changes the List sort."])

patch("96926",
  title="Initial technician order: first name, then last name, then account age",
  results=[
   "Technicians are initially ordered by first name A-Z, then last name A-Z.",
   "Technicians with identical names are ordered by when their user account was created, oldest first and newest last."])

patch("96927",
  title="Tech View has its own column chooser and adds an Assigned Techs column",
  results=[
   "Tech View offers the same columns as List, plus an Assigned Techs column (Story 7).",
   "It has its own column chooser (Story 5), separate from List."])

patch("96932",
  title="Clicking a Tech View row opens the work order; a drag needs a few pixels first",
  results=[
   "Clicking anywhere on a row, outside its own controls, opens the work order.",
   "A drag starts only after the pointer has moved a few pixels, so a click never turns into a drag."])

patch("96937",
  title="Assigned to me shows only groups holding my work; the rest are hidden",
  results=[
   "With Assigned to me enabled, Tech View shows only the technician groups (including Unassigned) that hold at least one work order matching Assigned to me.",
   "Every other group is hidden, including pinned technicians."])

patch("96950",
  title="Empty eligible columns stay as drop targets showing \"No work orders\"",
  results=[
   "A technician column with no work orders under the current filters, and an empty Unassigned column, show the text \"No work orders\" and stay visible as drop targets.",
   "Empty eligible columns are kept as drop targets except while Assigned to me is enabled; there is no control to hide them."])

patch("96951",
  title="Assigned to me shows only columns holding my work; pinning is disabled",
  results=[
   "With Assigned to me enabled, Board View shows only the technician columns (including Unassigned) that hold at least one work order matching Assigned to me.",
   "Every other column is hidden, including pinned technicians, and pinning is not offered while Assigned to me is enabled."])

patch("96953",
  title="Every Board column scrolls on its own; the page itself does not scroll",
  results=[
   "Every Board View column, including Unassigned, scrolls vertically on its own when its cards exceed the viewport, while adjacent columns and pinned headers stay visible.",
   "The page itself does not scroll vertically; only the content inside each column does."])

patch("96974",
  title="The N open count counts Approved, In Progress, Ready for Review and Complete",
  results=[
   "The Reassign lead technician dialog's \"N open\" count includes Approved, In Progress, Ready for Review, and Complete work orders."])

patch("97032",
  title="The N open dialog count is exact and counts the four included statuses",
  results=[
   "Seed a known set of work orders across statuses; the dialog's \"N open\" equals exactly the number in Approved + In Progress + Ready for Review + Complete (other statuses excluded).",
   "The count matches an independent hand count of those four statuses."])

patch("96963",
  title="Lead change is blocked in Invoiced/Paid/Imported on every path",
  results=[
   "The lead technician cannot be changed in Invoiced, Paid, or Imported status by any path, including a request that bypasses the UI (server-refused).",
   "An Invoiced or Paid work order can still be dragged to reorder within its current technician (or within Unassigned), but cannot move to another technician, to Unassigned, or out of Unassigned; Declined and Complete move freely."])

patch("96964",
  title="Disabled reassignment shows the status reason; the WO can still reorder in place",
  results=[
   "The disabled Reassign lead technician action on an Invoiced or Paid work order shows the tooltip \"The lead technician can't be changed once a work order is Invoiced or Paid.\"",
   "The work order is shown as reorderable only within its current technician, not movable to another one."])

patch("96975",
  title="Tech View has its own column selection, separate from List, saved per user",
  results=[
   "Tech View has its own optional-column selection, separate from List: changing columns in one never changes the other.",
   "The Tech View column selection is saved per user across logout/login, devices and locations; List keeps saving its columns as it does today."])

patch("96987",
  title="Compact/Regular/Comfortable offered in Tech View and Board View, Regular default",
  results=[
   "Compact, Regular and Comfortable density are offered in Tech View and Board View (not List).",
   "Without a saved choice, Regular is the default."])

patch("96989",
  title="One density selection is shared between Tech View and Board View, and persists",
  results=[
   "One density selection is shared between Tech View and Board View (List keeps today's row size).",
   "The chosen density persists across sessions, logout/login and devices."])

patch("96992",
  title="Density applies to Tech View rows and Board cards; List unchanged",
  results=[
   "Density applies to Tech View rows and Board View cards on Work Orders.",
   "List keeps today's row size and other application tables are unchanged."])

patch("96993",
  title="Avatar group on cards and the Tech View Assigned Techs column (not List)",
  results=[
   "Board View cards (when the line-technicians field is on) and a new optional Assigned Techs column in Tech View show a compact avatar group: the lead technician plus the distinct technicians assigned to lines.",
   "List does not get this column."])

patch("97005",
  title="After reordering, the saved order is used and shared per location across views",
  results=[
   "Once anyone at the location has reordered a technician's work orders, that saved order is used instead of the initial sort; the manual order of work orders is saved once per location and everyone there sees the same order in both Tech View and Board View.",
   "Technician group/column order is saved per user. If two people reorder at the same time, the later save wins; the other sees the saved order on next refresh and is not warned."])

patch("97007",
  title="Newly eligible technicians append last; reassignment placement rules",
  results=[
   "A newly eligible technician (Clockable, Active, role not Office/Time Clock, enrolled at the location) is added after the existing unpinned technicians.",
   "A work order given a new lead via the Reassign dialog or its detail page goes to the bottom of the new technician's work for everyone at the location; a dragged work order goes where it is dropped; removing the lead puts it at the bottom of Unassigned; a created/split-with-lead work order keeps the initial sort."])

patch("97024",
  title="Field-exposure snapshot recorded once per display per session",
  results=[
   "The analytics snapshot of selected and unselected fields available to the user (including untouched defaults and restored preferences) is recorded once per display per session, the first time the user opens that display that session, not on every open.",
   "Field changes are still recorded each time they are saved; unavailable financial fields are excluded."])

V.save_map()
