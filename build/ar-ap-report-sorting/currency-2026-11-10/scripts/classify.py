"""Final per-case verdicts for the 10 Nov 2026 currency assessment (Rule 134). Reads assess-raw.json; writes verdicts.json + verdicts.csv."""
import json, csv, collections
OUT = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting/currency-2026-11-10"
raw = {r["key"]: r for r in json.load(open(f"{OUT}/assess-raw.json"))}
V = collections.defaultdict(list)   # key -> [(part, reason)]
def add(keys, part, why):
    for k in keys: V[k].append((part, why))
S8R3 = ['S4-09b','S4-10b','S4-11b','S4-12b','D-01','D-02','D-03','D-04','D-05','D-06','D-07','D-08','D-09','D-10','D-11','D-12','D-13','D-14','D-15','D-16','D-17','D-18','D-47','D-48','D-50','D-56','D-58','D-61','D-62','D-01b','D-04b','D-07b','D-10b','D-13b','D-16b']
add(S8R3, "quotes", 'S8-R3 re-quoted from v11 ("Location wraps only on A/P Detail (nine columns) and A/P Unpaid Invoices")')
add(['D-16'], "results", 'step result "Location does not wrap" on A/P Unpaid Invoices now contradicts v11 S8-R3 (Location wraps on A/P Unpaid Invoices)')
add(['D-17','D-18','D-58','D-62'], "results", 'A/P Unpaid Invoices layout case: check whether a long location now wraps (S8-R3 v11); add or confirm the result')
S1R8 = ['S2-29','S2-31','S2-32','S2-34','S4-05','S4-06','S4-07','S4-08','S4-13','S4-14','DATA-01','DATA-02','DATA-03','DATA-04','DATA-05','DATA-06','DATA-01b','DATA-02b','DATA-03b','DATA-04b']
add(S1R8, "quotes", "S1-R8 re-quoted as the whole v11 line (new last sentence: an open customer or vendor shows 100 documents at a time)")
S2R7 = ['S2-29','S2-30','S2-31','S2-32','S2-33','S2-34','S2-35']
add(S2R7, "quotes", 'S2-R7 re-quoted from v11 ("…keep it, except as in S2-R7a")')
add(['S9-03','S9-04'], "quotes", 'S3-R8a re-quoted from v11 ("Credit Term")')
add(['S9-04'], "quotes", 'S9-N2 re-quoted from v11 ("no Credit Term column")')
add(['S9-03','S9-04'], "results", 'CSV column heading now "Credit Term" (capital T); the results name a "Credit term" column')
add(['REL-09'], "quotes", "Out of Scope line re-quoted: v11 removes the SV-11441 credit item from it (moved into scope as S1-R5a)")
add(['REL-01','REL-02'], "results", "the 'only the order may differ' results now miss three v10 changes listed in PRD section 2: plain dates instead of Today/Yesterday (S2-R1a), credit names instead of \"Credit\" (S2-R1b), a credit dated on the as-of date moves from 1-30 to Current (S1-R5a)")
add(['REL-01','REL-02'], "quotes", "add the three new section-2 lines and S1-R5a/S2-R1a/S2-R1b quotes")
add(['REL-02'], "results", "the A/P case's last result talks about an A/R Summary overpaid-invoice Totals row (copied from REL-01); found in this reading, not a source change")
add(['S5-18'], "results", 'step-3 hedge ("If step 3 keeps location B unticked in the address, tick every location before step 3") is now settled by S5-E3: location A stays ticked, so the one-location list shows no chip; remove the hedge, quote S5-E3')
add(['S5-18'], "quotes", "add S5-E3")
add(['REL-03'], "results", 'result says the PDF as-of line has "the day without a leading zero"; no source sentence says so, and v11 S3-R7a now says PDF dates print "Nov 04 2026" (leading zero). Draft PO question Q1; until answered, run on a day 10 or later or drop that clause')
add(['REL-03'], "quotes", "add S3-R7a beside S3-R4")
FIG = {"The native Vendor menu": "vendor-menu picture reshot (Search vendors, shown over 8 vendors, A to Z): replace the attached picture, re-quote the caption, close the DD-02 note",
       "Cleared": "No locations picture reshot (no Totals row, no Location column): replace the picture, re-quote the caption, close the DD-03 note",
       "The customer row stays pinned": "caption now names the same-date time-of-day build bug: re-quote the caption",
       "Links only where they can open": "links picture reshot (WIP blue, semi-bold, no underline): replace the picture, re-quote the caption, close the DD-05 note",
       "Another location asks first": "caption now names Cancel left, Switch location right, close x and the capital-L build bug: re-quote the caption"}
for k, r in raw.items():
    for t in r["reasons"]:
        if t.startswith("design changed 5 Nov: "):
            name = t[len("design changed 5 Nov: "):].split(":")[0]
            for n, w in FIG.items():
                if name.startswith(n): V[k].append(("References from Design", "5 Nov design: " + w))
        if "will be corrected" in t:
            V[k].append(("References from Design", 'note says "the design picture(s) will be corrected"; the 5 Nov design corrected them (DD-03/DD-04/DD-05): reword the note'))
add(['D-18','D-58','D-63'], "References from Design", 'the picture compared row by row shows Transaction Type "Credit" for a credit; PRD v10 S2-R1b names it "Credit Memo"/"Deposit"/"Vendor Credit" (new design difference DD-07, closed by the PRD v10 ruling): add the note')
add(['D-68'], "results", 'step result says "the picture also draws a Totals row of $0.00 … the picture will be corrected"; the 5 Nov picture is reshot without it: reword the result')
RETIRE = {"REL-08": 'expects a credit dated on the as-of date to stay in "1-30 days past due" because SV-11441 was out of scope; PRD v10/v11 S1-R5a moves SV-11441 into scope (Current, Past Due 0) and drops it from Out of Scope. Replace with NEW REL case N-25 (before/after) and the S1/DATA cases.'}
rows = []
for k, r in raw.items():
    if k in RETIRE: verdict, why = "RETIRE", [("all", RETIRE[k])]
    elif V.get(k): verdict, why = "CHANGE", V[k]
    else: verdict, why = "CONFIRMED", []
    rows.append({"key": k, "case_id": r["case_id"], "link": f"https://shopview.testrail.io/index.php?/cases/view/{r['case_id']}", "title": r["title"],
                 "verdict": verdict, "parts": sorted(set(p for p, _ in why)), "reasons": [w for _, w in why], "codes": r["codes"], "marker": r["marker"],
                 "stamp": ["From line: PRD version 9 -> 11, read 10 Nov 2026", "build line: a QA build exists since 10 Nov (sv11315, v26.45.2-6a8b89c); 'not yet available' is no longer true"]
                          + (["AUTOMATION: HOLD - not yet build-verified (no build yet) loses its reason (Rule 61)"] if "no build yet" in r["marker"] else [])
                          + (['References from Design "read 22 Oct 2026" -> design version of 5 Nov 2026'] if True else [])})
json.dump(rows, open(f"{OUT}/verdicts.json", "w"), indent=1)
with open(f"{OUT}/verdicts.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["key", "case_id", "link", "verdict", "parts", "reasons", "title"])
    for r in rows: w.writerow([r["key"], r["case_id"], r["link"], r["verdict"], "; ".join(r["parts"]), " | ".join(r["reasons"]), r["title"]])
c = collections.Counter(r["verdict"] for r in rows); print(c)
print("CHANGE parts:", collections.Counter(p for r in rows for p in r["parts"]))
for r in rows:
    if r["verdict"] != "CONFIRMED": print(r["verdict"], r["key"], "C%s" % r["case_id"], r["parts"])

# --- evidence line for every CONFIRMED case (why the v10/v11, Jira and 5 Nov design changes cannot touch it)
FP = {"not-yet-due Past Due": "the hit is the Past due FILTER or a 'past due' bucket name; S1-R5a keeps not-yet-due Past Due as today",
      "relative date wording": "the hit is a data description in the preconditions (\"dated 40 days ago\"); no result shows a date as Today/Yesterday",
      "Location filter with an as-of change": "the as-of date changes while every location is ticked (S5-E3 keeps All), or before any location is unticked",
      "PDF dates": "the hit is the as-of header line (S3-R4, unchanged); no result reads a date cell in the PDF",
      "PDF with a negative amount": "the PDF result reads a positive Totals figure only",
      "A/P Unpaid Invoices layout at 1440": "the hit is the 1440 px window precondition; the case asserts no wrapping",
      "Location wrapping": "the hit is a CSV 'one line each' or a title-row line, not a Location cell",
      "credit in a bucket": "the credit's bucket is set up by the tester as of today; no result names a credit dated on the as-of date",
      "Past Due value of a credit": "the credit's Past Due shows a dash (A/P Unpaid, S2-R6, unchanged) or is not asserted",
      "bucket load error": "the hit is an export-limit or another error message, not a bucket load",
      "credit dated on the as-of date": "A/P Unpaid vendor credit: no bucket and no Past Due there (S2-R6, unchanged)"}
for row in rows:
    if row["verdict"] != "CONFIRMED": row["confirmed_evidence"] = ""; continue
    r = raw[row["key"]]; hits = [t for t in r["reasons"] if t.startswith("expected screen touched")]
    ev = [f"all PRD quotes ({', '.join(r['codes']) or 'none coded'}) are word for word and whole lines in v11; none of S1-R8, S2-R7, S3-R8a, S8-R3, S9-N2 or the Out of Scope line"]
    if hits:
        for h in hits:
            n = h.split(": ", 1)[1].rsplit(" (", 1)[0]
            ev.append("trigger '" + n + "' reviewed: " + next((v for k, v in FP.items() if n.startswith(k)), "reviewed"))
    else: ev.append("no v10/v11 rule's screen appears in its steps or results (keyword scan)")
    ev.append("design references only unchanged boards/figures and no DD-01..05 'will be corrected' note")
    row["confirmed_evidence"] = "; ".join(ev)
json.dump(rows, open(f"{OUT}/verdicts.json", "w"), indent=1)
with open(f"{OUT}/verdicts.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["key", "case_id", "link", "verdict", "parts", "reasons", "confirmed_evidence", "stamp_changes", "title"])
    for r in rows: w.writerow([r["key"], r["case_id"], r["link"], r["verdict"], "; ".join(r["parts"]), " | ".join(r["reasons"]), r["confirmed_evidence"], " | ".join(r["stamp"]), r["title"]])
print("evidence written", sum(1 for r in rows if r["confirmed_evidence"]))
