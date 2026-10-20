#!/usr/bin/env python3
"""Writes recipes.md: one setup-file recipe per case (SETUP-C<id>), in the format of
../v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md section 4, using its shared procedures (P-SIGNIN, P-LOCATION, P-TECH,
P-CUSTOMER, P-WO, P-ADVISOR, P-LINE-TECH, P-FIELDS-LINETECHS, P-START). The precondition lines are read from proposals.json, so they
match the cases exactly.  python3 make_recipes.py"""
import os, json, re, html
D = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(f"{D}/proposals.json"))
def lines(h):
    h = h.split("<p><strong>Preconditions</strong></p>", 1)[1]
    return [html.unescape(re.sub(r"<[^>]+>", "", x.replace("<br>", " "))) for x in re.findall(r"<li>(.*?)</li>", h, re.S)]
COL = ('Board View\'s card field picker is labelled "Fields to display" on builds before SV-11580 ships and "Column Selection" after it '
       '(PRD v71 renames it); P-FIELDS-LINETECHS works on either label.')
R = {}
R[96987] = ("ACCOUNT-A (creates the records) and a new Admin user made in step 3, who is {User-B} (not ACCOUNT-B).", [
 '**P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST F1 Density Choices"; units "C96987-U1".',
 '**P-WO** (ACCOUNT-A): Unit "C96987-U1"; customer "ZZAUTOTEST F1 Density Choices"; no lead.',
 'New Admin user {User-B} (ACCOUNT-A): your initials > "Settings" > "Staff" > "New Staff Member": First Name "ZZAUTOTEST F1", Last Name "Nora New", an Email inbox you can open, Role "Admin", at least one Department (required), Location = the case location > "Save & Close". Accept the invitation email and set a password (as in P-PHOTO). The user must be brand new each run: once they open the density menu and choose, they no longer qualify; make another (for example "ZZAUTOTEST F1 Nora New 2").',
 'Sign in as {User-B} in its own browser (or a private window), then **P-START** as {User-B}: "All" tab, List, Search empty, no filter, Assigned to me off. Do not open Tech View before the test.'],
 'signed in as {User-B}, Work Orders shows List and Search for "ZZAUTOTEST F1 Density Choices" lists {Work-order-1} with no lead. {User-B} has never opened the density menu.',
 ["{Location-A} = the case location (Staging Heavy Duty - 9919 on staging)", "{User-B} = ZZAUTOTEST F1 Nora New (or the next new user made)",
  "{Customer-A} = ZZAUTOTEST F1 Density Choices", "{Work-order-1} = the work order for unit C96987-U1"])
R[96988] = ("ACCOUNT-A.", [
 '**P-TECH** (ACCOUNT-A): First Name "Esther", Last Name "Howard" (P-TECH reuses an existing active Esther Howard at this location with Time Clock on).',
 '**P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST F1 Density Content"; units "C96988-U1".',
 '**P-WO** (ACCOUNT-A): Unit "C96988-U1"; customer "ZZAUTOTEST F1 Density Content"; lead "Esther Howard".',
 'Tech View column (ACCOUNT-A): Work Orders > "Tech View" > "Column Selection" > turn "Lead Technician" on > close the menu (PRD v71 S5-R4: off by default).',
 '**P-START** (ACCOUNT-A): Tech View, "All" tab, density Regular, Search "ZZAUTOTEST F1 Density Content", no filter, Assigned to me off.'],
 'Tech View shows {Work-order-1} with a "Lead Technician" column reading Esther Howard, a progress bar and a Total price amount.',
 ["{Location-A} = the case location (Staging Heavy Duty - 9919 on staging)", "{Technician-A} = Esther Howard",
  "{Customer-A} = ZZAUTOTEST F1 Density Content", "{Work-order-1} = the work order for unit C96988-U1"])
R[96989] = ("ACCOUNT-A, in two browsers (the second one starts signed out).", [
 '**P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST F1 Density Shared"; units "C96989-U1".',
 '**P-WO** (ACCOUNT-A): Unit "C96989-U1"; customer "ZZAUTOTEST F1 Density Shared"; no lead.',
 '**P-LOCATION** check only: your initials > "Change Location" lists a second location for {Location-B} (Staging Lethbridge - 4310 on staging); do not switch yet.',
 'Density (ACCOUNT-A): Work Orders > "Tech View" > density button > "Regular" (anything but Comfortable).',
 'Open a second browser (or a private window) on the sign-in page and leave it signed out.',
 '**P-START** (ACCOUNT-A): Board View, "All" tab, Search "ZZAUTOTEST F1 Density Shared", no filter, Assigned to me off.'],
 'Board View shows the card of {Work-order-1}; Tech View\'s density is Regular; the second browser shows the sign-in page.',
 ["{Location-A} = the case location (Staging Heavy Duty - 9919 on staging)", "{Location-B} = another location (Staging Lethbridge - 4310 on staging)",
  "{Customer-A} = ZZAUTOTEST F1 Density Shared", "{Work-order-1} = the work order for unit C96989-U1"])
R[96990] = ("ACCOUNT-A.", [
 '**P-TECH** (ACCOUNT-A): First Name "Esther", Last Name "Howard" (reuse if it already matches).',
 '**P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST F1 Compact Text"; units "C96990-U1".',
 '**P-WO** (ACCOUNT-A): Unit "C96990-U1"; customer "ZZAUTOTEST F1 Compact Text"; lead "Esther Howard".',
 'Tech View column check (ACCOUNT-A): "Column Selection" shows "Progress" ticked (on by default, PRD v71 S5-R4); tick it if someone turned it off.',
 '**P-START** (ACCOUNT-A): Tech View, "All" tab, Search "ZZAUTOTEST F1 Compact Text", nothing ticked in Status, no Asset on Site choice, Assigned to me off.'],
 'Tech View shows {Work-order-1} with its progress bar and percentage.',
 ["{Location-A} = the case location (Staging Heavy Duty - 9919 on staging)", "{Technician-A} = Esther Howard",
  "{Customer-A} = ZZAUTOTEST F1 Compact Text", "{Work-order-1} = the work order for unit C96990-U1 (S10043-17651 was the example on the QA build)"])
R[96991] = ("ACCOUNT-A, plus a developer for step 3.", [
 '**P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST F1 Density Load Fail"; units "C96991-U1".',
 '**P-WO** (ACCOUNT-A): Unit "C96991-U1"; customer "ZZAUTOTEST F1 Density Load Fail"; no lead.',
 'Forced load failure: UNVERIFIED, no recorded method in this repository. Ask the user whether a developer can make this user\'s saved density fail to load on the site used; if not, the tester writes "load failure not checked by hand" for step 3 (the case says so).',
 '**P-START** (ACCOUNT-A): Tech View, "All" tab, Search empty, no filter, Assigned to me off.'],
 'Search for "ZZAUTOTEST F1 Density Load Fail" shows {Work-order-1}; clear the search again.',
 ["{Location-A} = the case location (Staging Heavy Duty - 9919 on staging)", "{Customer-A} = ZZAUTOTEST F1 Density Load Fail",
  "{Work-order-1} = the work order for unit C96991-U1"])
R[96992] = ("ACCOUNT-A.", [
 '**P-TECH** (ACCOUNT-A): First Name "Esther", Last Name "Howard" (reuse if it already matches).',
 '**P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST F1 Density Scope"; units "C96992-U1".',
 '**P-WO** (ACCOUNT-A): Unit "C96992-U1"; customer "ZZAUTOTEST F1 Density Scope"; lead "Esther Howard".',
 'Density (ACCOUNT-A): Work Orders > "Tech View" > density button > "Regular".',
 'Open a second browser tab on the top menu "Customers" page and leave it open.',
 '**P-START** (ACCOUNT-A): List, "All" tab, Search "ZZAUTOTEST F1 Density Scope", no filter, Assigned to me off.'],
 'List shows {Work-order-1}; Board View shows its card in Esther Howard\'s column; a second tab shows Customers.',
 ["{Location-A} = the case location (Staging Heavy Duty - 9919 on staging)", "{Technician-A} = Esther Howard",
  "{Customer-A} = ZZAUTOTEST F1 Density Scope", "{Work-order-1} = the work order for unit C96992-U1"])
R[590110] = ("ACCOUNT-A. **Run first:** SETUP-ADMIN.", [
 '**P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590110", Last Name "Ana" (shows as "ZZAUTOTEST C590110 Ana").',
 '**P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590110 Toolbar Icons"; units "C590110-U1".',
 '**P-WO** (ACCOUNT-A): Unit "C590110-U1"; customer "ZZAUTOTEST C590110 Toolbar Icons"; lead "ZZAUTOTEST C590110 Ana".',
 '**P-START** (ACCOUNT-A): starting screen: List, All tab, density Regular (set in Tech View), Search empty.'],
 "Every precondition line of the case is true on screen, read top to bottom. Unchanged from the setup file's SETUP-C590110 apart from the case's steps (Board View's density button is no longer looked at, PRD v71 S3-R11).",
 ["{Location-A} = the case location (Staging Heavy Duty - 9919 on staging)", "{Customer-A} = ZZAUTOTEST C590110 Toolbar Icons",
  "{Technician-A} = ZZAUTOTEST C590110 Ana", "{Work-order-1} = the work order for unit C590110-U1"])
R[590128] = ("ACCOUNT-A. **Run first:** SETUP-ADMIN.", [
 '**P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590128", Last Name "Ana" (shows as "ZZAUTOTEST C590128 Ana").',
 '**P-TECH** (ACCOUNT-A): First Name "ZZAUTOTEST C590128", Last Name "Ben" (shows as "ZZAUTOTEST C590128 Ben").',
 '**P-CUSTOMER** (ACCOUNT-A): Name "ZZAUTOTEST C590128 Density"; units "C590128-U1".',
 '**P-WO** (ACCOUNT-A): Unit "C590128-U1"; customer "ZZAUTOTEST C590128 Density"; lead "ZZAUTOTEST C590128 Ana".',
 '**P-ADVISOR** (ACCOUNT-A): Unit "C590128-U1".',
 '**P-LINE-TECH** (ACCOUNT-A): Unit "C590128-U1"; technicians "ZZAUTOTEST C590128 Ben"; use the work order\'s existing approved line.',
 '**P-FIELDS-LINETECHS** (ACCOUNT-A): as described in the procedure table. ' + COL,
 '**P-START** (ACCOUNT-A): starting screen: Tech View, All tab, density Regular, Search "ZZAUTOTEST C590128 Density".'],
 "Every precondition line of the case is true on screen, read top to bottom; the Board View card shows the lead's and Ben's avatars.",
 ["{Location-A} = the case location (Staging Heavy Duty - 9919 on staging)", "{Customer-A} = ZZAUTOTEST C590128 Density",
  "{Technician-A} = ZZAUTOTEST C590128 Ana", "{Technician-B} = ZZAUTOTEST C590128 Ben", "{Work-order-1} = the work order for unit C590128-U1"])
out = ["# Setup recipes for the 8 density cases, Tech View only (draft, 20 Oct 2026)", "",
       "To replace the matching recipes in `../v61-pass-2026-10-16/two-audience/WO-BOARD-SETUP-FILE.md` section 4 (C590110, C590128) and to add the "
       "six behaviour cases, which have no recipe there yet. Shared procedures are that file's (section 4, \"Shared procedures\"). Sources: PRD v71 "
       "(Confluence 845185030, 20 Oct 2026) and each case's own setup before this change (`C<id>-before.json` in this folder). No environment address, "
       "credentials or session data.", ""]
for cid, (slots, steps, check, ph) in R.items():
    f = P[str(cid)]
    out += [f"#### SETUP-C{cid} — [C{cid}](https://shopview.testrail.io/index.php?/cases/view/{cid}) {f['title']}", "",
            "**Satisfies these precondition lines, exactly as the case states them:**", ""]
    out += [f"- {l}" for l in lines(f["custom_preconds"])] + [""]
    out += [f"**Slots:** {slots}" + ("" if "Run first" in slots else " **Run first:** SETUP-ADMIN."), ""]
    out += [f"{i}.  {s}" for i, s in enumerate(steps, 1)] + ["", f"**Check:** {check}", "",
            "**Placeholder values** (the case names records by placeholder; give the tester the real work order numbers after setup):", ""]
    out += [f"- {x}" for x in ph] + [""]
    used = set(re.findall(r"\{[A-Za-z0-9-]+\}", f["custom_preconds"] + f["custom_steps"] + f["custom_expected"]))
    given = set(re.findall(r"\{[A-Za-z0-9-]+\}", " ".join(ph)))
    assert used <= given, (cid, used - given)
open(f"{D}/recipes.md", "w").write("\n".join(out))
print("recipes:", len(R), "placeholders covered: yes")
