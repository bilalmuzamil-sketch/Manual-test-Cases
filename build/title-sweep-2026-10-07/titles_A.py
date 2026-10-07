import json, re
L = json.load(open("input/A-global-search.json"))
M = {
44812: "Press Tab to reach the search tabs, then Left and Right arrows switch tabs",
137996: "The clear (x) button appears once you type and empties the search box",
44814: "Search tabs read All, then the eight record types in a fixed order",
44822: "Clicking a search tab shows only that type of record, with its count",
45129: "Searching a contact's name finds its company (there is no Contacts tab)",
44826: "Clicking 'Show all N' opens that record type's tab",
44827: "Result groups always appear in the same fixed order",
44830: "An exact number match sits above the result groups, which keep their order",
44831: "A Work Order result shows its number, customer, status and unit",
44834: "A Part result shows its description, number and stock-coloured quantity",
44844: "A VIN or serial number must match exactly (capitals and spaces ignored)",
44846: "A part number must match exactly, a wrong digit finds nothing",
44847: "A typo in a VIN, part number or work order number finds nothing",
44848: "A close (misspelled) match is marked as close on its row",
44849: "A Part Sale P-number must match exactly, a typo finds nothing",
55713: "A very short search does not return loosely matching results",
55714: "Purchase order and vendor invoice numbers must match exactly",
55725: "A clearly unrelated search returns no close matches",
44853: "On a Customer page, that customer's assets and work orders come first",
44854: "On a Work Order page, parts already on that work order appear lower",
45139: "A company found through its contact ranks below one found by its name",
55707: "Names starting with the search rank above whole-word, then close, matches",
55724: "A name starting with the search ranks above a whole-word match",
55729: "An exact number match stays at the top even above a strong name match",
44855: "First open shows the placeholder and one helper line, no create buttons",
44858: "Recent activity lists different record types in the same row style",
44860: "Opened records appear once in recent activity, only if you can access them",
44880: "Results show only your own organization's records",
44881: "A record type you cannot access shows no group, and its tab is empty",
44882: "Missing permissions hide groups, counts and tabs, and prices too",
55705: "Vendor & Order Management access shows vendors, POs and vendor invoices",
55718: "Typing the exact number of a record you cannot access does not show it",
55731: "Turning Parts access on and off shows, then hides, the same part",
55732: "Turning Work Orders access on and off shows, then hides, the same work order",
55733: "Turning Customers access on and off shows, then hides, the customer and asset",
55734: "Turning Part Sales access on and off shows, then hides, the same part sale",
55735: "Turning off Vendor & Order Management hides the vendor, PO and invoice",
44897: "Only the new global search exists, with no switch to turn it on",
44898: "Global search works on phone and tablet screens",
45133: "On a phone, type chips appear only after typing, for types that match",
45135: "On a phone, first-open, recent and no-results screens match the desktop",
44899: "Purchase orders are found by their real number and offer Receive",
44900: "Vendor invoices are searchable and show their payment state, no action",
45148: "A kind of result with no permission rule is hidden",
45158: "Global search is on for everyone, with no switch to turn it on",
45160: "Selecting a result is counted in usage analytics",
44873: "Each record type that has a hover action always shows it",
}
E = {"WO": ("Work Order", "work order"), "CUST": ("Customer", "customer"), "ASSET": ("Asset", "asset"),
     "PART": ("Part", "part"), "VEND": ("Vendor", "vendor"), "PS": ("Part Sale", "part sale"),
     "PO": ("Purchase Order", "purchase order"), "VINV": ("Vendor Invoice", "vendor invoice")}
FIELD = {"VIN / serial number": "VIN or serial number", "line item descriptions (parts and labor on the WO)": "a line description",
         "part numbers on the work order's lines (`item_part_numbers`)": "a part number on its lines",
         "spliced number variants (`number_variants`)": "a variant of its number",
         "the PO number the invoice belongs to": "its PO number", "the asset on the sale": "its asset",
         "part numbers on the PO": "a part number on it", "part descriptions on the PO": "a part description on it",
         "created-by user": "who created it"}
G = {"A1": "{E} results show the whole matched value, not just what you typed",
     "A2": "{E} results don't cut off a long value through the matched part",
     "A3": "{E} results highlight the match inside the text, not instead of it",
     "B1": "Two {e} results sharing what you typed can be told apart",
     "B2": "Two {e} results with the same bold line differ somewhere visible",
     "D1": "The {E} result row shows every detail it should",
     "I1": "{E} results say when a typo was corrected"}
ALL = {"E1": "A tab's count equals the number of rows inside it", "E2": "No count anywhere reads higher than 20",
       "E3": "Each group on the All tab shows 5 results and offers the rest",
       "E4": "'Show all' opens that tab and keeps you in the search box", "E5": "All nine search tabs are there, named and counted",
       "E6": "Groups on the All tab are always in the same order", "E7": "Typing a full record number puts that record at the very top",
       "F1": "A number is found with and without its dashes", "F2": "A phone number is found however it is punctuated",
       "F3": "An accented name is found typed with or without the accent", "F4": "A name is found with or without its apostrophe or hyphen",
       "F5": "A typo in a number is not silently corrected",
       "F6": "Typing a status word (e.g. Paid) does not match records by their status",
       "G1": "A work order whose truck has no unit number still reads properly",
       "G2": "A very long value does not push the rest of the row out of sight", "G3": "A very common word still gives a usable list",
       "G4": "Typing only one or two characters behaves sensibly", "G5": "A record type that does not exist yet does not break search",
       "H1": "No results shows your search back, and nothing else", "H2": "No results inside a tab names the tab",
       "H3": "A record you can open from its own list is always found",
       "K1": "Someone without access sees no rows and no count"}
for x in L:
    m = re.match(r"SRI-([A-Z]+)-([A-Z]\d+) — (.*)$", x["title"])
    if not m: continue
    ent, code, rest = m.groups()
    if ent == "ALL": M[x["id"]] = ALL[code]; continue
    Ecap, elow = E[ent]
    if code in G: M[x["id"]] = G[code].format(E=Ecap, e=elow); continue
    if code == "C9": M[x["id"]] = "Two contacts with the same name: the row shows which one matched"; continue
    f = re.match(r"A match on (.*) shows the FULL value on the row", rest).group(1)
    f = FIELD.get(f, f)
    art = "An" if elow[0] in "aeiou" else "A"
    t = f"{art} {elow} found by {f} shows that full value on its row"
    if len(t) > 80: t = f"{art} {elow} found by {f} shows the full value"
    M[x["id"]] = t
json.dump({str(k): v for k, v in M.items()}, open("proposed_A.json", "w"), indent=0, ensure_ascii=False)
ids = {x["id"] for x in L}; assert set(M) <= ids
bad = [(k, v) for k, v in M.items() if len(v) > 80 or ";" in v]
print(len(M), "changes; bad:", bad)
for k, v in M.items():
    if any(s in v for s in ("found by a", "found by its", "found by who", "found by VIN")): print(k, v)
