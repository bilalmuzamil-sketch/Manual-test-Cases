"""Add C368131, C368167 and C96936 to WO-BOARD-SETUP-FILE.md (QA lead, 19 Oct 2026: "correct and simplify the following test
cases"). The how-to that left the cases (C368167's and C96936's Setup blocks, C368131's per-case Google Doc) lands here, nothing lost.
Run once."""
import json, re, html, sys
sys.path.insert(0, "."); from cases import CASES, BLOCKED
F = "/home/user/Manual-test-Cases/build/wo-board-tech-view/v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md"
s = open(F).read(); probs = []
def rep(old, new):
    global s
    if s.count(old) != 1: probs.append(f"{s.count(old)} x {old[:60]}"); return
    s = s.replace(old, new)
def append_row(start, end, row):
    global s
    i, j = s.index(start), s.index(end); s = s[:i] + s[i:j].rstrip("\n") + "\n" + row + "\n\n" + s[j:]
L = lambda n: f"[C{n}](https://shopview.testrail.io/index.php?/cases/view/{n})"
TITLE = {n: json.load(open(f"before/C{n}.json"))["title"] for n in CASES}
TEST = {368131: 3761652, 368167: 3792488, 96936: 3481880}
def txt(h):
    h = re.sub(r"<(br|/p|/li)\s*/?>", "\n", h); return html.unescape(re.sub(r"<[^>]+>", "", h))
def quotes(n):
    e = txt(json.load(open(f"before/C{n}.json"))["custom_expected"])
    q = e.split("Exact quotes from the source (for reproducibility)")[1]
    return [l.strip() for l in q.split("\n") if "“" in l]
R = {
368131: ("ACCOUNT-A, ACCOUNT-B (view only)",
 ['**P-TECH** (ACCOUNT-A): {Technician-A}: reuse "Esther Howard" if active at the case location with Time Clock on and a Role other than Office User or Time Clock User; otherwise make one.',
  '**P-TECH** (ACCOUNT-A): {Technician-B}: First Name "ZZAUTOTEST", Last Name "Jenny Pinned". New for every run: the test deactivates it.',
  '**P-TECH** (ACCOUNT-A): {Technician-C}: First Name "ZZAUTOTEST", Last Name "Theresa Pinned", Location {Location-A}. New for every run: the test moves it to {Location-B} (for example Staging Lethbridge - 4310).',
  '**P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C368131 Pinned Gone"; unit "C368131-U1".',
  '**P-WO** (ACCOUNT-A), twice on unit "C368131-U1": {Work-order-1} with lead {Technician-A}; {Work-order-2} with lead {Technician-C}. Book no Schedule shift on either.',
  'ACCOUNT-B: Settings > Roles & Permissions > Create Custom Role > Skip > Role Name "ZZAUTOTEST C368131 View Role" > under Work orders turn on View only > Create. Then Settings > Staff > New Staff Member "ZZAUTOTEST C368131 Viewer" with an email you can open, that role, one Department, Location {Location-A} > Save & Close; accept the invitation and set a password. Quick login signs in only as Admin, so ACCOUNT-B signs in with email and password in a second browser context (password in /tmp only).',
  '**P-PIN** as ACCOUNT-A and again as ACCOUNT-B: pin {Technician-B} and {Technician-C}. Only three pins are allowed: if three are already pinned, unpin one first. Pins are per user.',
  '**P-START** (ACCOUNT-A): the Work Orders page with no filter set (nothing in Status, no Asset on Site choice, Assigned to me off, Search empty).'],
 "Both users' Board View shows {Technician-B} and {Technician-C} right after Unassigned with filled pins; Search with the customer name shows {Work-order-1} led by {Technician-A} and {Work-order-2} led by {Technician-C}. Clear the search.",
 ["{Location-A} = the case location (Staging Heavy Duty - 9919 on staging); {Location-B} = another location (Staging Lethbridge - 4310 on staging)",
  "{User-B} = ZZAUTOTEST C368131 Viewer", "{Technician-A} = Esther Howard (or the reused technician)", "{Technician-B} = ZZAUTOTEST Jenny Pinned",
  "{Technician-C} = ZZAUTOTEST Theresa Pinned", "{Customer-A} = ZZAUTOTEST C368131 Pinned Gone", "{Work-order-1}, {Work-order-2} = the two work orders on unit C368131-U1"],
 ["Staging, 19 Oct 2026 (passed, T3761652): S2-35908 led by Aaa ZZAUTOTEST Tara Lead and S2-35909 led by Aaa ZZAUTOTEST Theresa Pinned.",
  "Step 3 needs both parts on screen: the Location field change (Save & Close) AND the bin icon in Manage staff enrollments (the Department(s) button on her row). The Location change alone leaves her a technician at {Location-A} (seen 17 Oct 2026); the QA lead decided the two-part step on 19 Oct 2026.",
  "GET /api/staff rows carry both id and staff_id; the Schedule's staffId and the working-hours calls use staff_id.",
  "Steps 9 to 12: drag each card onto the target column with Playwright; read the message after step 10 character for character; record where each card ends up.",
  "Steps 7, 8 and 15: record each header's text and whether it shows a pin, an inactive marker and the empty-column text. Evidence: a screenshot after each step with a result, the build marker, the real value of every placeholder."],
 "Steps 1 to 3 spend {Technician-B} (deactivated) and {Technician-C} (moved to {Location-B}): make two new technicians before the next run (keep ZZAUTOTEST at the start), pin them for both users and give {Work-order-2} the new {Technician-C}. Step 12 moves {Work-order-2} to Unassigned."),
368167: ("ACCOUNT-A",
 ['**P-TECH** (ACCOUNT-A): "Esther Howard" (the expected results name her): reuse if active at the case location with Time Clock on; otherwise make one with this name.',
  '**P-TECH** (ACCOUNT-A): {Technician-B}: any second active technician that the work order page\'s Lead Technician list offers. That list stops after about 100 names (seen 17 Oct 2026, SV-11393 closed as obsolete but still there), so pick one near the top; Jenny Wilson worked on staging on 19 Oct 2026. Ralph Edwards is NOT offered there.',
  '**P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST Refused Lead Change"; unit "TRK-118" (contact first: Contact and Make are required). If the customer shows Over Limit, raise its credit limit first.',
  '**P-WO-REVIEW** (ACCOUNT-A) on that unit: the line "Service - Full grease service"; Lead Technician "Esther Howard" (only a dropdown once the work order is Approved; it saves at once). If a "Missing Details (1)" step shows on Complete, type a Mileage. "Work order sent to review." appears and the status reads Review.',
  'Click "Mark Reviewed"; if the Mark as reviewed window asks for a VIN, type any 17 characters (for example 1FVACWDT1BDAZ0001) > "Confirm Review". The status reads Complete. Do NOT click Create Invoice: the test does that in step 2.',
  'Open the work order in two tabs of the same browser window (right-click > Open link in new tab). Do not quick-login again in a private window: a second quick-login can end the first tab\'s session.'],
 'Reload {Work-order-1}: status Complete, Lead Technician "Esther Howard", and on the Finance tab "Create Invoice" can be clicked.',
 ["{Location-A} = the case location (Staging Heavy Duty - 9919 on staging)", "{Technician-B} = the second technician picked (Jenny Wilson on staging, 19 Oct 2026)",
  "{Customer-A} = ZZAUTOTEST Refused Lead Change", "{Work-order-1} = the new Complete work order"],
 ["Staging, 19 Oct 2026 (passed, T3792488): S2-37327, Complete, led by Esther Howard; the refusal read \"The lead technician can't be changed once a work order is Invoiced or Paid. Please try to resolve this.\"",
  "Step 2: leave New Customer Payment open. Closing it with its X takes the invoice back off and the work order returns to Complete (staging and production, 17 Oct 2026); the QA lead decided on 19 Oct 2026 to leave it open."],
 "Step 2 invoices {Work-order-1}: make a new Complete work order (same recipe) before the next run."),
96936: ("ACCOUNT-A",
 ['**P-TECH** (ACCOUNT-A): "Esther Howard" and "Aaron Baker" (the expected results name them, keep these names), active at the case location, Time Clock on, Role neither Office User nor Time Clock User, this location in Location. Aaron Baker is used because his name sorts near the top: the work order page\'s Lead Technician list stops after about 100 names (QA lead\'s decision, 19 Oct 2026, replacing Ralph Edwards, who is not offered there).',
  '**P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST F2 Refresh Lead" (if it exists, open it); unit "TRK-118".',
  '**P-WO** (ACCOUNT-A), five times on that unit: {Work-order-1}, {Work-order-2}, {Work-order-3} with lead Esther Howard; {Work-order-4}, {Work-order-5} with lead Aaron Baker. (An Estimate\'s lead is read-only on the page; give it from Board View: More actions (…) > Reassign lead technician.)',
  'Open a second tab of the same browser window (tab B).'],
 "Work Orders > All tab > Search \"ZZAUTOTEST F2 Refresh Lead\" > Tech View: Esther Howard shows 3 and Aaron Baker shows 2. If not, fix the leads first.",
 ["{Location-A} = the case location (Staging Heavy Duty - 9919 on staging)", "{Customer-A} = ZZAUTOTEST F2 Refresh Lead",
  "{Work-order-1} = one of Esther Howard's three (the expected results call it \"S1-702\"; give the tester the real number)", "{Work-order-2} to {Work-order-5} = the other four"],
 ["Staging, 19 Oct 2026 (passed, T3481880): S2-35331, S2-35332, S2-35333 led by Esther Howard; S2-35334, S2-35335 by Aaron Baker; {Work-order-1} = S2-35331.",
  "Step 5: a work order with no lines opens with a New Line window over it; close it with its X before reaching Lead Technician (seen 17 Oct 2026)."],
 "Step 5 moves {Work-order-1} to Aaron Baker: set its lead back to Esther Howard before the next run."),
}
for n, (slots, steps, check, ph, notes, reset) in R.items():
    pre = "\n".join(f"- {a}" + (f" {b}" if b else "") for a, b in CASES[n]["pre"] + [(BLOCKED, None)])
    body = (f"#### SETUP-C{n} — {L(n)} {TITLE[n]}\n\n**Satisfies these precondition lines, exactly as the case states them:**\n\n{pre}\n\n"
            f"**Slots:** {slots}. **Run first:** SETUP-ADMIN.\n\n" + "\n".join(f"{i}.  {x}" for i, x in enumerate(steps, 1)) +
            f"\n\n**Check:** {check}\n\n**Placeholder values** (give the tester the real work order numbers after setup):\n\n" + "\n".join(f"- {x}" for x in ph) +
            "\n\n**Notes for a Claude session:**\n\n" + "\n".join(f"- {x}" for x in notes) + "\n\n")
    rep("## 5. Mapping table (execution order)", body + "## 5. Mapping table (execution order)")
    append_row("## 5. Mapping table", "## 6. Dependencies", f"| {L(n)} {TITLE[n]} | {slots.split(' (')[0]} | SETUP-ADMIN, SETUP-C{n} |")
    append_row("## 7. Reset and cleanup", "## 8. Traceability", f"- **SETUP-C{n}**: {reset}")
    tr = (f"### {L(n)} {TITLE[n]}\n\nPreconditions and steps simplified 19 Oct 2026 (QA lead); the Expected field, its sources and quotes are unchanged. "
          "The quotes, word for word as in the case:\n\n" + "\n".join(f"- {q}" for q in quotes(n)).replace(" #", " \\#") + "\n\n")
    rep("## 9. VIU status", tr + "## 9. VIU status")
    append_row("## 9. VIU status", "## 10. Open questions", f"| {L(n)} | Passed on staging v26.40.19-e435950, 19 Oct 2026 (run 498, T{TEST[n]}), in the wording before this simplification; the actions are the same. AUTOMATION: READY |")
rep("(23 cases, 16 to 19 Oct 2026)", "(26 cases, 16 to 19 Oct 2026)")
rep("C665914 added 19 Oct 2026 for SV-11503 (drag preview), PRD v64.", "C665914 added 19 Oct 2026 for SV-11503 (drag preview), PRD v64; C368131, C368167 and C96936 added 19 Oct 2026 when their preconditions and steps were simplified (QA lead).")
print("problems:", probs)
if not probs: open(F, "w").write(s); print("written")
