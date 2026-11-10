"""10 Nov 2026 (Rule 129): refresh TICKET-LEDGER.json for all 26 tickets under SV-11315 as read 10 Nov 2026, write the flat Jira file the
sweep reads, and set TICKET-SWEEP.json prd_version_handled to 11. Local files only (no Jira write)."""
import json, re, csv, collections
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"
nodes = json.load(open(f"{B}/sources/jira-sweep-2026-11-10.json"))["issues"]["nodes"]
json.dump({"issues": nodes, "isLast": True, "_from": "sources/jira-sweep-2026-11-10.json (issues.nodes, 26 tickets, one page)"},
          open(f"{B}/sources/jira-sweep-2026-11-10-flat.json", "w"), indent=1)
P = json.load(open(f"{B}/authoring/proposals.json"))
ids = {r["key"]: r["case_id"] for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
def cid(k): return f"{k} C{ids[k]}" if k in ids else f"{k} (new, no C-id yet)"
by_story = collections.defaultdict(list)
for k, v in P.items():
    for t in re.findall(r"SV-\d+", v.get("refs") or ""): by_story[t].append(k)
led = json.load(open(f"{B}/TICKET-LEDGER.json"))
upd = {n["key"]: n["fields"]["updated"] for n in nodes}
READ = " Re-read in full 10 Nov 2026 (sources/JIRA-READING-2026-11-10.md)."
HAND = " New on 10 Nov 2026: Nemanja Djuric's QA handoff comment (a description of the build on sv11315, not a source of expected behaviour, Rule 57)."
r1531 = [k for k in P if "S1-R5a" in (P[k]["codes"] or [])]
def row(k, outcome, cases, note): led[k] = {"updated": upd[k], "outcome": outcome, "cases": cases, "note": note}
row("SV-11315", "COVERED", [f"all {len(P)}"], "Epic; every case names it on its first From: line." + READ + HAND)
for s in ["SV-11531", "SV-11532", "SV-11533", "SV-11534", "SV-11535", "SV-11536", "SV-11537", "SV-11538", "SV-11539"]:
    old = led[s]["note"].split(" Re-read")[0]
    row(s, "NEW-CASES", [cid(k) for k in sorted(by_story[s])],
        old + READ + " Description unchanged since 26 Oct 2026 (it still carries the PRD v9 wording); PRD version 11 governs (Chris Ward's answer 10)." + HAND)
row("SV-7192", "COVERED", led["SV-7192"]["cases"], led["SV-7192"]["note"].split(" Re-read")[0] + READ + " Status Blocked; no new text.")
row("SV-10798", "COVERED", led["SV-10798"]["cases"], led["SV-10798"]["note"].split(" Re-read")[0] + READ + " Status Blocked; no new text.")
row("SV-11441", "NEW-CASES", [cid(k) for k in r1531] + [cid("REL-01"), cid("REL-02")],
    "Moved into scope by PRD versions 10/11 (S1-R5a: a credit dated on the as-of date is Current with Past Due 0). New cases written 10 Nov 2026 "
    "(S1-17..S1-20, DATA-25, DATA-26, REL-14); REL-01 and REL-02 name the change on release day. REL-08 C715478, which expected the old aging, is "
    "proposed for deletion (QA lead's order of 10 Nov 2026, \"Yes, both\"). QA Complete on 10 Nov 2026 (Bilal Muzamil, QA build and QuickBooks)." + READ)
for k in ["SV-11595", "SV-11596", "SV-11597", "SV-11598"]:
    old = led[k]["note"].split(" Re-read")[0]
    row(k, led[k]["outcome"], [x for x in led[k]["cases"] if x != "REL-08"], old + READ + " Done 10 Nov 2026." + HAND)
row("SV-11599", "NO-CASE", [], led["SV-11599"]["note"].split(" Re-read")[0] + READ + " Done 10 Nov 2026.")
row("SV-11600", "NO-CASE", [], led["SV-11600"]["note"].split(" Re-read")[0] + READ + " Closed OBSOLETE on 4 Nov 2026.")
fit = ["D-13", "D-16", "D-61", "D-62", "D-13b", "D-16b", "D-48", "D-19", "D-20", "D-21", "D-22", "D-23", "D-24", "S3-02", "S3-02b", "S3-02c"]
row("SV-12135", "COVERED", [cid(k) for k in P if k.startswith(("S1-", "S2-"))],
    "Filed 3 Nov 2026 against the old reports (no column sorts, inconsistent opening order). Every opening-order and sort case (all of S1 and S2) fails if it "
    "is still there. No expect-fail marker: no open ticket describes a failure on the build under test (Rule 61)." + READ)
row("SV-12136", "COVERED", [cid(k) for k in ["DATA-08", "DATA-11", "DATA-12", "DATA-15", "DATA-24", "DATA-02b", "DATA-04b"]],
    "A/P Open Balance a few cents above Amount on bucket totals. The A/P Totals cases check Open Balance; no case compares a bucket's Amount with its Open "
    "Balance (S5-R18a: Amount is not compared). No marker owed." + READ)
row("SV-12137", "COVERED", [cid(k) for k in fit],
    "Old-report symptoms (A/P columns cut off at 1400 px, no loading state, no A/P Print). Our cases test the fit at 1440 px, the loading bar and the A/P "
    "Export menu. No marker owed." + READ)
for k, cs in [("SV-12138", ["S1-10", "S1-11"]), ("SV-12139", ["S7-03", "S7-04", "D-39", "D-40", "D-64"]), ("SV-12140", ["S1-16"]), ("SV-12141", ["S3-17"])]:
    row(k, "COVERED", [cid(x) for x in cs], "Filed 3 Nov 2026 from our cases; each case carries the expect-fail block and marker (Rule 61), folded into the "
        "library on 10 Nov 2026 byte-equal to the live text. Ticket open (TESTING QA)." + READ)
for k in ["SV-11442", "SV-11443", "SV-11444", "SV-11446", "SV-11447", "SV-11445"]:
    if k in led and "SV-12125" not in led[k]["note"]:
        led[k]["note"] += " Moved to epic SV-12125 (Report Modernization) on 4 Nov 2026: no longer under SV-11315 (seen 10 Nov 2026)."
json.dump(led, open(f"{B}/TICKET-LEDGER.json", "w"), indent=1, ensure_ascii=False)
cfg = json.load(open(f"{B}/TICKET-SWEEP.json"))
cfg["prd_version_handled"] = 11
cfg["_query"] = ("(key = SV-11315 OR parent = SV-11315 OR parent in (SV-11531..SV-11539)), every page, saved 10 Nov 2026 as "
                 "sources/jira-sweep-2026-11-10.json (26 tickets; flat copy for the sweep: sources/jira-sweep-2026-11-10-flat.json).")
cfg["prd_handled_note"] += (" 10 Nov 2026: PRD v11 (5 Nov 2026) saved (sources/CONFLUENCE-947650561-2026-11-05-read-2026-11-10.*), diffed against v9 "
                            "and every case re-checked against it (currency-2026-11-10/ASSESSMENT.md and PASS-REPORT.md); all 26 tickets re-read 10 Nov 2026.")
json.dump(cfg, open(f"{B}/TICKET-SWEEP.json", "w"), indent=1, ensure_ascii=False)
print("ledger rows", len(led))
