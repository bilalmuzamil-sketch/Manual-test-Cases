"""14 Nov 2026: ledger rows for every ticket under SV-11315 and its stories that is new or updated since 10 Nov 2026 (Rule 129).
Jira read 14 Nov 2026 through the Atlassian connector (sources/jira-sweep-2026-11-14-raw.json, -flat.json; descriptions
sources/jira-descriptions-2026-11-14-raw.json; story description diff currency-2026-11-14/JIRA-DESC-DIFF-10Nov-to-14Nov.txt; new tickets read
in full in currency-2026-11-14/jira-new-tickets-2026-11-14.md)."""
import json
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"
led = json.load(open(f"{B}/TICKET-LEDGER.json")); flat = {i["key"]: i["fields"] for i in json.load(open(f"{B}/sources/jira-sweep-2026-11-14-flat.json"))["issues"]}
R = "Re-read 14 Nov 2026"
NEW = {
 "SV-12538": ("NO-CASE", [], "Defect found in execution (bills edited after receiving keep an old Amount and Due Date); the PRD rules it breaks (Amount is the bill's total, Past Due counted from its due date) are unchanged in v13 and already tested; no requirement change, no new case. Open."),
 "SV-12539": ("COVERED", ["DATA-20 C715469", "DATA-18 C715467"], "PDF export fails at about 1,100 rows (below the 2,000-row limit). PRD v12 change log (Milos Vasic, Q1): the 2,000-row PDF limit stays, pending a timing check on staging. The limit cases stand as written."),
 "SV-12540": ("COVERED", ["S1-21 C1062570", "S1-22 C1062571"], "OBSOLETE since 11 Nov 2026. PRD v12 S1-R8 adds that an open customer's or vendor's documents may arrive in one request and the rule sets only how many are SHOWN at a time; the two cases were rewritten 14 Nov 2026 to say 'show', not 'load', and still expect the first 100 shown, then the next 100 as the user scrolls (a closed ticket is not a spec change, Rule 57)."),
 "SV-12544": ("COVERED", ["S3-32 C1062581"], "Done. PDF dates as \"Nov 04 2026\" (S3-R7a, unchanged in v13); S3-32 checks it."),
 "SV-12545": ("NEW-CASES", ["S5-37 C715579 (rewritten 14 Nov 2026)", "S5-43 (new, no C-id yet)"], "Merged to Staging. PRD v13 S5-R10b (13 Nov 2026, Chris Ward). S5-37 said the opposite (tech plan D20) and was rewritten top to bottom to a day after today aging an A/P bill; S5-43 checks the PDF and CSV print the picked day. Another author's C1078980 and C1078981 (run 557) cover picking it on A/R Summary and opening a link with it; not duplicated, not touched (Rule 38). No expect-fail marker: a merged ticket is no live backing (Rule 61)."),
 "SV-12546": ("NO-CASE", [], "OBSOLETE. Empty buckets left out of the A/R Detail PDF: PRD v13 is silent on it (no requirement changed); another author's C1079008 covers it. Our new S3-33/S3-35 check only the buckets that hold a document."),
 "SV-12547": ("NEW-CASES", ["S3-33 (new)", "S3-34 (new)", "S3-35 (new)", "S3-36 (new)", "D-95 C1145260 (Demo Day)"], "Done. PRD v12 S3-R7b (\"Total for <name>\", never \"Subtotal\", in the four grouped PDFs); one new case per grouped report, written 14 Nov 2026."),
 "SV-12554": ("FROM-OUR-CASE", ["S5-19 C715393", "S5-23 C715397"], "OBSOLETE since 11 Nov 2026. Filed from our cases (Back should undo the last filter change). S5-R10 is unchanged in v13, so the cases keep the PRD (Rule 57); both passed in run 557 on 11-12 Nov."),
 "SV-12563": ("FROM-OUR-CASE", ["S9-03 C715447"], "OBSOLETE since 11 Nov 2026. CSV header \"Credit Term\" vs PRD S3-R8a \"Credit term\"; S3-R8a unchanged in v13, the case keeps the PRD."),
 "SV-12663": ("FROM-OUR-CASE", ["REL-01 C715471", "REL-02 C715472"], "Ready for Production. Past Due counted in the location's time zone against a UTC Due Date; filed from our release cases (their live titles now start \"SV-12663 - \", edited outside our library). S1-R5a unchanged in v13."),
 "SV-12723": ("ASKED", [], "Ready for Production. Empty money cells on A/R Summary sort as $0 instead of going to the bottom (S2-R6, unchanged in v13). Our S2-R6 cases cover vendor credits on A/P Unpaid Invoices and A/P Detail only: no case covers empty bucket cells on the Summaries. Outside the QA lead's named set of 14 Nov 2026; proposed to him as a new case in the 14 Nov report."),
}
n = 0
for k, f in flat.items():
    row = led.get(k)
    if k in NEW:
        o, cs, note = NEW[k]; led[k] = {"updated": f["updated"], "outcome": o, "cases": cs, "note": f"{R} in full ({f['status']}). " + note}; n += 1
    elif row and f["updated"] > (row.get("updated") or ""):
        if k == "SV-11535":
            row["outcome"] = "NEW-CASES"; row["cases"] = list(row.get("cases", [])) + ["S5-37 C715579 (rewritten 14 Nov 2026)", "S5-43 (new)", "S5-41b (new)"]
            add = (f" {R}: description changed: S5-R10b and its acceptance check added (Nov 13 -> Dec 31, chip As of: 12/31/2026, PDF and CSV As of Dec 31, 2026); "
                   "cases S5-37 (rewritten) and S5-43 (new). Status " + f["status"] + ".")
        else:
            add = f" {R}: description unchanged since 10 Nov 2026 (script diff); status {f['status']}."
            if k in ("SV-11531", "SV-11533", "SV-11534", "SV-11538"):
                add += " The story does not yet carry PRD v12's change to its requirements (S1-R8, S3-R7b, S4-R1, S8-R3); the PRD wins (Chris Ward's answer 10)."
        row["note"] = (row.get("note") or "") + add; row["updated"] = f["updated"]; n += 1
json.dump(led, open(f"{B}/TICKET-LEDGER.json", "w"), indent=1, ensure_ascii=False)
cfg = json.load(open(f"{B}/TICKET-SWEEP.json"))
cfg["prd_version_handled"] = 13
cfg["_query"] = ("key = SV-11315 OR parent = SV-11315 OR parent in (SV-11531..SV-11539), every page, read 14 Nov 2026 through the Atlassian connector: "
                 "sources/jira-sweep-2026-11-14-raw.json (37 tickets; flat copy sources/jira-sweep-2026-11-14-flat.json).")
cfg["prd_handled_note"] += (" 14 Nov 2026: PRD v13 (13 Nov 2026; Confluence version 13 created 2026-11-13T14:36:51Z, re-checked 14 Nov 2026) diffed against v11 "
                            "(currency-2026-11-14/PRD-DIFF-v11-to-v13.txt, read in full) and every case checked against it (currency-2026-11-14/AFFECTED.json, PASS-REPORT.md); "
                            "37 tickets read, 11 new since 10 Nov, every one handled in the ledger.")
json.dump(cfg, open(f"{B}/TICKET-SWEEP.json", "w"), indent=1)
print("ledger rows written or updated:", n, "| ledger rows", len(led))
