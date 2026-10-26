"""Story 1 — Reports open in QuickBooks name order (S1-R1 to S1-R7, S1-N1, S1-E1). Paging (S1-R8) is in cases_data.py."""
from ar_lib import C, ALL6, GROUPED
from common import *
from po_questions import QN
import tech_plan as TP

def names(code, key, words, letters="ABCDEF"):
    P = R[code]["Party"]
    ph = [f"{{{P}-{letters[i]}}}" for i in range(len(words))]
    exs = ex(key, *words)
    lst = ", ".join(ph[:-1]) + " and " + ph[-1]
    exl = ", ".join(f"{p} is {x}" for p, x in zip(ph, exs))
    return ph, lst, "For example: " + exl + "."

for key, code in [("S1-01", "ARS"), ("S1-02", "APS")]:
    r = R[code]; w = ["10 Trucking", "2 Trucking", "A-1 Towing", "a1 towing"]
    ph, lst, exl = names(code, key, w)
    C(key, "S1", f"{r['n']} opens with {r['parties']} in name order, A to Z",
      [ADMIN(), (f"Four {r['parties']} have open {r['doc']}s on today's date: {lst}. Their names start with the same word and then differ by a number, a dash or capitals, as in the example.", exl),
       START(code)],
      [f"Look at the header of {namecol(code)}.",
       f"Without clicking any column header, find the four {r['parties']} in the list (scroll down until they load if they are further down)."],
      [f"Step 1: {namecol(code)} is marked as the sorted column.",
       f"Step 2: all four {r['parties']} are listed, reading from top to bottom {ph[0]}, then {ph[1]}, then {ph[2]}, then {ph[3]} (other {r['parties']} may sit between them). With the example names: \"10 Trucking\" comes before \"2 Trucking\" because names compare character by character, and \"A-1 Towing\" comes before \"a1 towing\" because capitals are ignored and the dash compares as a character."],
      ["S1-R1", "S1-R2", "S1-R7"])

C("S1-03", "S1", "A/R Summary sorts accented customer names with their base letter",
  [ADMIN(), ("Six customers have open invoices on today's date: {Customer-A}, {Customer-B}, {Customer-C}, {Customer-D}, {Customer-E} and {Customer-F}. {Customer-B} and {Customer-E} start with a capital accented letter.",
             "For example: {Customer-A} is ZZAUTOTEST S1-03 Eagle, {Customer-B} is ZZAUTOTEST S1-03 Émile's, {Customer-C} is ZZAUTOTEST S1-03 Emma, {Customer-D} is ZZAUTOTEST S1-03 Fargo, {Customer-E} is ZZAUTOTEST S1-03 Øster and {Customer-F} is ZZAUTOTEST S1-03 Ozone."),
   START("ARS")],
  ["Without clicking any column header, find the six customers in the list."],
  ["Step 1: all six customers are listed, reading from top to bottom {Customer-A}, {Customer-B}, {Customer-C}, {Customer-D}, {Customer-E}, {Customer-F}. With the example names, \"Émile's\" sorts among the E names (between \"Eagle\" and \"Emma\"), not after the Z names, and \"Øster\" sorts as an O, before \"Ozone\"."],
  ["S1-R1", "S1-R3"])

C("S1-04", "S1", "A/P Summary sorts lower-case accented and joined letters as plain letters",
  [ADMIN(), ("Six vendors have open bills on today's date: {Vendor-A}, {Vendor-B}, {Vendor-C}, {Vendor-D}, {Vendor-E} and {Vendor-F}. {Vendor-B} has \"æ\" and {Vendor-E} has \"ß\" in its name.",
             "For example: {Vendor-A} is ZZAUTOTEST S1-04 Ackley, {Vendor-B} is ZZAUTOTEST S1-04 æble, {Vendor-C} is ZZAUTOTEST S1-04 Afton, {Vendor-D} is ZZAUTOTEST S1-04 Strand, {Vendor-E} is ZZAUTOTEST S1-04 Straße and {Vendor-F} is ZZAUTOTEST S1-04 Strasser."),
   START("APS")],
  ["Without clicking any column header, find the six vendors in the list."],
  ["Step 1: all six vendors are listed, reading from top to bottom {Vendor-A}, {Vendor-B}, {Vendor-C}, {Vendor-D}, {Vendor-E}, {Vendor-F}. With the example names, \"æble\" sorts as \"aeble\" (between \"Ackley\" and \"Afton\") and \"Straße\" sorts as \"Strasse\" (after \"Strand\", before \"Strasser\")."],
  ["S1-R1", "S1-R3"])

for key, code in [("S1-05", "ARS"), ("S1-06", "APS")]:
    r = R[code]; P = r["Party"]
    C(key, "S1", f"Two {r['party']} names that differ only in capitals keep one order everywhere",
      [ADMIN(), (f"Two {r['parties']} have open {r['doc']}s on today's date and their names differ only in capitals: {{{P}-A}} and {{{P}-B}}.",
                 f"For example: {{{P}-A}} is ZZAUTOTEST {key} Ace Towing and {{{P}-B}} is ZZAUTOTEST {key} ACE TOWING."),
       START(code)],
      [f"Find {{{P}-A}} and {{{P}-B}} in the list and note which one is higher.",
       "Choose \"Download (PDF)\" from the ⋯ menu at the right of the title.",
       "Open the PDF and find the two names.",
       "Choose \"Download (CSV)\" from the ⋯ menu.",
       "Open the CSV in a spreadsheet program and find the two names.",
       "Reload the page and find the two names again."],
      [f"Step 1: the two {r['parties']} sit next to each other (no other {r['party']} between them) in one order.",
       "Step 2: the PDF downloads.",
       "Step 3: the two names are in the same order as on screen.",
       "Step 4: the CSV downloads.",
       "Step 5: the two rows are in the same order as on screen.",
       "Step 6: after the reload they are still in the same order."],
      ["S1-R4", "S1-R2", "S3-R2"])

# 26 Oct 2026 (PRD v9 S1-R4 carries Chris Ward's answer 1 as its own example): the case follows PRD v9; the tech plan's D4 agrees.
C("S1-07", "S1", "A/R Summary lists Emile's Towing before Émile's Towing",
  [ADMIN(), ("Two customers have open invoices on today's date and their names differ only by an accent: {Customer-A} without it and {Customer-B} with it.",
             "For example: {Customer-A} is ZZAUTOTEST S1-07 Emile's Towing and {Customer-B} is ZZAUTOTEST S1-07 Émile's Towing."),
   START("ARS")],
  ["Without clicking any column header, find {Customer-A} and {Customer-B} in the list."],
  ["Step 1: the two customers sit next to each other (with the accent folded to its base letter their names are the same), and {Customer-A} (no accent) is directly above {Customer-B} (with the accent): the tie is broken by the plain lower-cased names, where the unaccented letter comes first."],
  ["S1-R4", "S1-R3"] + TP.q("D4"))


for key, code in [("S1-08", "ARD"), ("S1-09", "APD")]:
    r = R[code]; P = r["Party"]; d = r["doc"]; Dc = d.capitalize()
    C(key, "S1", f"{r['n']} lists the five buckets in fixed order and rows by name",
      [ADMIN(), (f"The report has open documents in all five aging buckets on today's date.", None),
       (f"In the \"1-30 days past due\" bucket, {{{P}-A}} has one open {d}, {{{Dc}-A}}, and {{{P}-B}} has two, {{{Dc}-B}} and {{{Dc}-C}}. {{{P}-B}}'s name comes first alphabetically, and {{{Dc}-B}}'s number is smaller than {{{Dc}-C}}'s but has fewer digits.",
        f"For example: {{{P}-A}} is ZZAUTOTEST {key} Baker and {{{P}-B}} is ZZAUTOTEST {key} Abbott; {{{Dc}-B}} is S1-99 and {{{Dc}-C}} is S1-100 (the app assigns the real numbers)."),
       START(code)],
      ["Read the bucket rows from top to bottom without expanding anything.",
       f"Look at the header of the \"{r['opened']}\" column.",
       "Click the chevron of the \"1-30 days past due\" bucket to expand it."],
      ["Step 1: the buckets read, in this order: \"91 or more days past due\", \"61-90 days past due\", \"31-60 days past due\", \"1-30 days past due\", \"Current\".",
       f"Step 2: \"{r['opened']}\" is marked as the sorted column.",
       f"Step 3: the bucket opens and shows its rows: {{{P}-B}}'s two {d}s come first, {{{Dc}-B}} above {{{Dc}-C}} (smaller number first, counted as a number), then {{{P}-A}}'s {{{Dc}-A}}."],
      ["S1-R5", "S1-R7", "S2-R4"] + (["WC-2"] if code == "APD" else []))

for key, code in [("S1-10", "ARC"), ("S1-11", "APU")]:
    r = R[code]; P = r["Party"]; d = r["doc"]; Dc = d.capitalize()
    C(key, "S1", f"{r['n']} groups {r['parties']} by name, rows oldest date first",
      [ADMIN(), (f"Two {r['parties']} have overdue {d}s on today's date: {{{P}-A}} and {{{P}-B}}; {{{P}-B}}'s name comes first alphabetically.",
                 f"For example: {{{P}-A}} is ZZAUTOTEST {key} Baker and {{{P}-B}} is ZZAUTOTEST {key} Abbott."),
       (f"{{{P}-B}} has three overdue {d}s: {{{Dc}-A}} with the oldest date, and {{{Dc}-B}} and {{{Dc}-C}} with the same later date. {{{Dc}-B}}'s number is smaller than {{{Dc}-C}}'s but has fewer digits, and {{{Dc}-C}} was " + ("invoiced" if d == "invoice" else "entered") + f" earlier that day than {{{Dc}-B}}.",
        f"For example: {{{Dc}-A}} is dated 40 days ago; {{{Dc}-B}} (S1-99) and {{{Dc}-C}} (S1-100) are dated 35 days ago, {{{Dc}-C}} " + ("invoiced" if d == "invoice" else "entered") + f" in the morning and {{{Dc}-B}} in the afternoon."),
       START(code)],
      [f"Find the groups of {{{P}-A}} and {{{P}-B}} and note their order.",
       "Look at the header of the \"Date\" column.",
       f"Expand {{{P}-B}}'s group."],
      [f"Step 1: {{{P}-B}}'s group is above {{{P}-A}}'s group.",
       "Step 2: \"Date\" is marked as the sorted column.",
       f"Step 3: the group opens: {{{Dc}-A}} first (oldest date), then {{{Dc}-B}}, then {{{Dc}-C}}: on the same date the smaller number comes first, counted as a number, whatever the time of day each was " + ("invoiced" if d == "invoice" else "entered") + "."],
      ["S1-R6", "S1-R7", "S2-R4"],
      note=("Where the build is expected to differ: Chris Ward (answers 12 and 14, 23 Oct 2026) says the current build orders same-day rows by the time of day "
            "they were created, a build bug to fix; no ticket number is known yet. If the rows come out in time-of-day order, mark this test Failed."))

for key, fam, codes in [("S1-12", "A/R", AR3), ("S1-13", "A/P", AP3)]:
    s, d, g = [R[c]["n"] for c in codes]
    C(key, "S1", f"Each {fam} report opens with its opening column marked as sorted",
      [ADMIN(), (f"Each of the three {fam} reports has open documents on today's date.", None),
       f"Starting screen: Reports > Finance is open in a desktop browser window 1440 px wide."],
      [f"Open {s} and look at the column headers.",
       f"Open {d} and look at the column headers.",
       f"Open {g} and look at the column headers."],
      [f"Step 1: {namecol(codes[0])} is marked as the sorted column, and no other column is.",
       f"Step 2: \"{R[codes[1]]['opened']}\" is marked as the sorted column, and no other column is.",
       f"Step 3: \"Date\" is marked as the sorted column, and no other column is."],
      ["S1-R7"], reports=codes)

C("S1-14", "S1", "Without Reports page access the six reports are not available",
  [('You are signed in as {User-B}, whose custom role {Role-A} has every permission except "Reports → Page Access".',
    "For example: {User-B} is ZZAUTOTEST S1-14 No Reports with the custom role ZZAUTOTEST S1-14 No Reports Role."),
   ("You have a link to A/R Summary and a link to A/P Detail, copied earlier from the address bar by an Admin user.", None),
   "Starting screen: the ShopView home page in a desktop browser window 1440 px wide."],
  ["Click Reports in the top menu and read the left menu's ACCOUNTS RECEIVABLE and ACCOUNTS PAYABLE sections.",
   "Paste the A/R Summary link into the address bar.",
   "Press Enter.",
   "Paste the A/P Detail link into the address bar.",
   "Press Enter."],
  ["Step 1: none of the six reports is offered (on screen: \"A/R Aging Summary\", \"A/R Aging Detail\", \"A/R Aging Collection\", \"A/P Aging Summary\", \"A/P Aging Detail\", \"A/P Unpaid Invoices\"), as today.",
   "Step 2: the A/R Summary link shows in the address bar.",
   "Step 3: the report does not open, as today for a user without this permission.",
   "Step 4: the A/P Detail link shows in the address bar.",
   "Step 5: the report does not open, as today."],
  ["S1-N1", "KD-PERM"], reports=ALL6)

C("S1-15", "S1", "A customer with nothing open on the as-of date is not listed",
  [ADMIN(), ("Customer {Customer-A} has no open documents: its only invoice is paid in full.", "For example: {Customer-A} is ZZAUTOTEST S1-15 Paid Up."),
   ("Customer {Customer-B} has one open invoice, created today, and nothing before today.", "For example: {Customer-B} is ZZAUTOTEST S1-15 New Today."),
   START("ARS")],
  ["Look for {Customer-A} and {Customer-B} in the list.",
   "Change the as-of date to yesterday."],
  ["Step 1: {Customer-A} is not listed, as today, and {Customer-B} is listed.",
   "Step 2: the report reloads for yesterday and {Customer-B} is not listed: on yesterday's date it had nothing open."],
  ["S1-E1", "S1-R1"])

C("S1-16", "S1", "A/R Summary sorts names that start with a punctuation mark by character",
  [ADMIN(), ("Four customers have open invoices on today's date: {Customer-A}, {Customer-B}, {Customer-C} and {Customer-D}. After the same first words, {Customer-A}'s name goes on with \"#\", {Customer-B}'s with \"-\", {Customer-C}'s with a digit and {Customer-D}'s with \"@\".",
             "For example: {Customer-A} is ZZAUTOTEST S1-16 #1 Diesel, {Customer-B} is ZZAUTOTEST S1-16 -1 Diesel, {Customer-C} is ZZAUTOTEST S1-16 10 Trucking and {Customer-D} is ZZAUTOTEST S1-16 @Home Towing."),
   START("ARS")],
  ["Without clicking any column header, find the four customers in the list."],
  ["Step 1: all four customers are listed, reading from top to bottom {Customer-A}, {Customer-B}, {Customer-C}, {Customer-D}: plain character order, where \"#\" comes before \"-\", both come before the digits, and \"@\" comes after them."],
  ["S1-R2", ("Key Decisions, name order", "Names sort the way QuickBooks sorts them: plain character order, capitals ignored, accented letters with their base letter.")] + TP.q("UCA"),
  note=("Where the build is expected to differ: the tech plan (21 Oct 2026) puts every punctuation mark before every digit and orders the marks differently "
        "(\"-\" before \"#\"), which would give {Customer-B} first, then {Customer-A} and {Customer-D}, then {Customer-C}. Chris Ward (answer 16, 23 Oct 2026) "
        "keeps the PRD's plain character order and asks engineering to match it; PRD version 9 adds this example to the requirement. No ticket number is known "
        "yet. If the build gives the tech plan's order, mark this test Failed."))
