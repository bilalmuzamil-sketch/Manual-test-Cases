"""Writes currency-2026-11-10/PASS-REPORT.md (Rule 134 per-part proof for every case, plus the pass narrative). Read-only on everything else."""
import json, csv, collections
B = "/home/user/Manual-test-Cases/build/ar-ap-report-sorting"; W = f"{B}/currency-2026-11-10"
P = json.load(open(f"{B}/authoring/proposals.json")); PP = json.load(open(f"{W}/pass-parts.json"))
ids = {r["key"]: int(r["case_id"]) for r in csv.DictReader(open(f"{B}/testrail-id-map.csv"))}
plan = {x["key"]: x["fields"] for x in json.load(open(f"{W}/applied/update-plan-2026-11-10.json"))}
ATT = json.load(open(f"{W}/attachments-to-delete-2026-11-10.json"))
def link(k): return f"[C{ids[k]}](https://shopview.testrail.io/index.php?/cases/view/{ids[k]})" if k in ids else "new"
WHY = {
 "S5-18": "S5-E3 (PRD v11) settles step 3: location A stays ticked and the chip hides; the hedge note is removed; S5-E3 quoted.",
 "S9-03": "CSV heading \"Credit Term\" (PRD v11 S3-R8a; the group row keeps \"Credit term: \").",
 "S9-04": "CSV heading \"Credit Term\" (PRD v11 S3-R8a, S9-N2).",
 "REL-01": "Each step's \"Only the order may differ\" now names the release changes PRD section 2 lists (S1-R5a credit on the as-of date in Current; on Detail and Collection S2-R1a plain dates and S2-R1b credit names); WC-12 to WC-14 quoted; refs add SV-11531, SV-11532 (the stories those lines belong to).",
 "REL-02": "Same for A/P (vendor credit on the as-of date, plain dates, \"Vendor Credit\"); the A/R overpaid-invoice bullet copied from REL-01 is removed; WC-12 to WC-14 quoted; refs add SV-11531, SV-11532.",
 "REL-03": "PRD v11 S3-R4's format no longer says \"the day without a leading zero\": example now \"As of Oct 15, 2026\"; for a day before the 10th the tester judges only the date (question 18).",
 "D-13": "PRD v11 S8-R3: Location wraps on A/P Detail and A/P Unpaid Invoices (was: only on this report). Found by the readiness read, 10 Nov 2026.",
 "D-16": "PRD v11 S8-R3: Location may wrap on A/P Unpaid Invoices; the tech plan's \"only on A/P Detail\" is quoted as the difference (TP-71) with a divergence note.",
 "D-63": "Re-shot picture \"Links only where they can open\" removed: title, preconditions and steps no longer ask for it; the column list is given in words; S7-R7 quoted (semi-bold, not underlined).",
 "D-68": "Re-shot picture \"Cleared: No locations\" removed: title, preconditions and step 2 results reworded to the PRD (no Totals row, no Location column).",
 "D-73": "Re-shot picture \"The native Vendor menu\" removed: title, preconditions and step 1 results reworded (\"Search vendors\", S5-R13).",
 "D-81": "One of its two pictures (\"Links only where they can open\") removed; \"as in the picture\" dropped from step 1; \"Expand all from the header\" stays.",
 "D-02": "Precondition corrected in the full reading: a Summary lists customers, so the credit memo shows as a negative amount, not as a \"credit memo row\" (Rule 137).",
 "D-03": "Same precondition correction as D-02.",
 "D-10": "Precondition corrected in the full reading: A/P Summary has no Transaction Type column (Rule 137).",
 "D-11": "Same precondition correction as D-10 (and \"a negative amount\" in place of \"a long Transaction Type\").",
 "D-12": "Same precondition correction as D-11.",
 "S5-05": "Moved from stamp-only to CHANGE (round 2): the DD-02 ruling line in References from Design now reads as of PRD v11.",
 "S5-06": "Moved from stamp-only to CHANGE (round 2): same DD-02 ruling line.",
}
for k in ["D-17", "D-18", "D-58", "D-62"]: WHY[k] = "Results re-checked against PRD v11 and kept; quotes and design references only."
def design_why(k):
    d = PP[k]; arr = " ".join(d.get("design_arrived", [])); out = []
    if any("version of 5 N" in x for x in d.get("design_arrived", [])): out.append("design version of 5 Nov 2026 named")
    if k in ATT: out.append(f"old picture {', '.join(a['name'] for a in ATT[k]['delete'])} no longer attached, its 5 Nov caption quoted")
    if "DD-07" in arr: out.append("DD-07 (credit names) closed by PRD v10")
    if "Known build bug" in arr: out.append("5 Nov caption of \"The customer row stays pinned\"")
    if "Difference from the PRD" in arr and "DD-07" not in arr: out.append("ruling line re-read against PRD v11")
    return "; ".join(out) or "design block re-rendered"
R = []; A = R.append
A("# A/R and A/P Report Sorting — PRD version 11 pass, 10 Nov 2026 (PASS-REPORT)")
A("")
A("Feature: A/R and A/P Report Sorting, Export and Location Filter (epic SV-11315), TestRail group 90418. Sources: PRD Confluence 947650561 "
  "version 11 (5 Nov 2026, Chris Ward), Jira of 10 Nov 2026 (26 tickets), Chris Ward's answers 1 to 17, the tech plan of 21 Oct 2026, the design "
  "version of 5 Nov 2026 (1793886208-34e0). The QA lead's decisions of 10 Nov 2026: \"Named set\", \"Yes, both\", \"Yes, add Q1 only\", \"Remove old, add later\". "
  "Drafted only: nothing was written to TestRail, Jira, Slack or Google and nothing was committed. Assessment: `ASSESSMENT.md`.")
A("")
A("## 0. Round 3 (10 Nov 2026): the re-shot pictures")
A("")
A("- `write/delete_attachments.py` could not remove the 46 old pictures: TestRail answered HTTP 200 with {\"error\":\"Attachment can't be deleted or replaced as the file is attached to a closed/archived run.\"} for each (readback_gone false). They are permanent; section 6 below is kept as the record of what was tried.")
A("- The QA lead sent the three re-shot pictures (`design-2026-11-05/reshot-from-qa-lead/`, 21 files: 18 byte-equal to the 22 Oct images, checked by sha256). Copied as `design-2026-11-05/images/ar-ap-p4-cleared-no-locations-reshot-2026-11-05.png` (\"download (4).png\", sha256 09a4821b…), `ar-ap-p5-links-only-where-they-can-open-reshot-2026-11-05.png` (\"download (9).png\", 830c7dfa…) and `ar-ap-p7-the-native-vendor-menu-reshot-2026-11-05.png` (\"download (17).png\", 7c0f1506…). I viewed each.")
A("- Library: each of the 46 cases lists the new picture under \"Design pictures attached to this case\" and says: compare with the new picture only; the older attachment with the old name shows the design before 23 Oct 2026 and must not be used (TestRail cannot remove it). The sentences \"is no longer attached to this case; the new picture will be attached later\" and \"were reshot (see below) and will be attached later\" are gone (0 left). D-04 now also prints DD-07, because its credit memo row is compared with the re-shot Links picture, which still reads \"Credit\".")
A("- Rule 134: all 46 re-read whole (1,818 lines, 100%). Against the round-2 library only `custom_expected` changed, and only below \"References from Design\" (checked by script on all 380: exactly these 46 differ). Every result, step and precondition still reads true against the new pictures and PRD v11.")
A("- Live re-read (get_case, 10 Nov 2026): the 46 live texts equal what round 2 wrote; `write/update_refs.py` is locked on that text (`live-before/live-46-round3-2026-11-10.json`).")
A("- Look differences seen in the new pictures (none changes a verdict; no new PO question):")
A("  - Links \"Links only where they can open\": the credit memo rows (CM2-2821, CM2-418) read Transaction Type \"Credit\" (DD-07, closed by PRD v10/v11 S2-R1b: \"Credit Memo\" / \"Deposit\"). The rest agrees with the PRD: plain dates (\"Jul 23, 2025\", S2-R1a), credit memo numbers plain text (S7-R10), invoice numbers blue links, Location right after Date, no Past Due column, \"Total for 91 or more days past due\" subtotal, the bold Totals row, A/R Title Case headings.")
A("  - Filters \"The native Vendor menu\": the search box now reads \"Search vendors\" (DD-02 settled in the picture too); \"All vendors\" ticked, the helper line, then the vendors, whose boxes show a grey dash while All vendors is ticked. The figure's alt text still says \"Search vendor\" (a stale alt text, not the picture). The menu lists \"10 Trucking Parts\" before \"2 Trucking Parts\"; no case states the menu order beyond \"the same as Inventory Value's\" (D-73).")
A("  - Location \"Cleared: No locations\" (A/R Detail): no Totals row and no Location column (DD-03 now matches the PRD), \"Location: No locations\" with the pin icon, the empty state words and \"Clear all filters\" button word for word. The No locations chip is drawn without the blue pill (resting look); the PRD does not set its style and no case states one.")
A("- Round-3 write scripts (dry runs): `write/update_refs.py` (46 cases, custom_expected only, run first) and `write/attach_reshot.py` (46 uploads: Links 21, Vendor menu 14, No locations 11; idempotent, sha256-checked files, read back by name).")
A("")
cnt = collections.Counter(v["status"] for v in PP.values())
A("## 1. Counts")
A("")
A("| | Cases |"); A("|---|---|")
A(f"| Library after the pass | {len(P)} (S1 22, S2 60, S3 36, S4 30, S5 46, S6 5, S7 21, S8 14, S9 4, DATA 30, REL 18, DESIGN 94) |")
A(f"| CHANGE (rewritten top to bottom, Rule 134) | {cnt['CHANGE']} |")
A(f"| CONFIRMED, stamps only (From line, build sentence, marker) | {cnt['CONFIRMED (stamps only)']} |")
A(f"| NEW | {cnt['NEW']} |")
A(f"| RETIRE (proposed for deletion) | {cnt['RETIRE']}: REL-08 [C715478](https://shopview.testrail.io/index.php?/cases/view/715478) |")
A(f"| Cases the update script writes | {len(plan)} (fields: " + ", ".join(f"{'+'.join(k)} {n}" for k, n in collections.Counter(tuple(v) for v in plan.values()).most_common()) + ") |")
A("")
A("## 2. What I did")
A("")
A("- Folded the 9 live expect-fail blocks of 4 Nov 2026 into the library (`authoring/expect_fail_2026_11_04.json`); the library then rendered all 356 live cases byte for byte (`proposals-foldin-equal-live.json` = live).")
A("- Pointed the library at PRD version 11 (`sources/CONFLUENCE-947650561-2026-11-05-read-2026-11-10.*`) and at the design version of 5 Nov 2026; every quote is checked word for word against PRD version 11 by build.py.")
A("- Read every case in full once as the tester reads it (all 380, `readall` text, 3,125 lines, 100%), after the build.py and readiness gates. Found and fixed: D-13 (Location wrap, from the readiness read), D-02, D-03, D-10, D-11, D-12 (preconditions that named a column or row a Summary does not have), REL-03 (a day before the 10th, question 18), new S1-19 (a credit memo's Due Date on A/R Collection is not stated by the PRD: that bullet removed). No stamp-only case needed more than a stamp; S5-05 and S5-06 had moved to CHANGE earlier in this round (DD-02 line).")
A("- Wrote the 25 new cases (`authoring/cases_v11.py`), removed REL-08 from the library (`authoring/v11_layout.py` REMOVED), refreshed the ticket ledger for all 26 tickets, re-rendered the setup file and the suite outputs, and prepared the write scripts as dry runs (`write/`).")
A("")
A("## 3. The AUTOMATION marker (Rules 61 and 69, read in full)")
A("")
A("- Rule 61: HOLD is only for what genuinely cannot be had; \"no build yet\" stopped being true on 10 Nov 2026 (QA build sv11315, v26.45.2-6a8b89c).")
A("- Rule 69: a case whose steps cannot yet be build-verified carries `AUTOMATION: Not available on Build to test Yet - Last checked <M/D/YYYY>`; it never replaces an EXPECT FAIL or a real HOLD.")
A("- Used: `AUTOMATION: Not available on Build to test Yet - Last checked 11/10/2026` on 356 cases (the 333 former \"no build yet\" HOLDs plus 23 of the new cases). Kept: 9 `READY - EXPECT FAIL` (SV-12138 ×2, SV-12139 ×5, SV-12140, SV-12141), 13 release-day HOLDs (REL-14 among them), DATA-19's developer-check HOLD. New: S3-32 `AUTOMATION: HOLD - waiting on the PO (question 18)`. Sum 356 + 9 + 13 + 1 + 1 = 380.")
A("- **Flag for the QA lead:** Rule 69 says a metadata-only re-stamp normally keeps the marker as it is. Here the marker is changed on the 222 stamp-only cases because you ordered it (\"the AUTOMATION marker whose 'no build yet' reason has gone\"); it is the only marker change those cases get.")
A("")
A("## 4. Gates")
A("")
A("| Gate | Result |"); A("|---|---|")
A("| `authoring/build.py` | 380 cases, **0 PROBLEM lines**; every PRD code covered except S3-N2, OOS-1, UFS-2, which only the case deleted on 26 Oct 2026 (DATA-21) covered (left to the developers, as ruled then) |")
A("| `build/testing-tools/tester_readiness_check.py build/ar-ap-report-sorting` | 380 cases, **0 hard problems**; all 200 \"does not / never\" results read, each has its control; the random sample (S4-11, REL-12b, S2-04, S3-15, S1-05) read in full: runnable |")
A("| `build/testing-tools/ticket_sweep.py` (PRD version 11, flat copy of the 10 Nov search) | 26 tickets, **0 unhandled**, PRD handled 11, exit 0 |")
A("| `authoring/render_setup.py` | `AR-AP-SETUP-FILE.md` 7,184 lines; no \"mark this test Blocked\" line |")
A("| `authoring/render_outputs.py` | `REPORT.md`, `PO-QUESTIONS-DRAFT.md`, design checklist and register re-rendered; ledger and sweep config kept as refreshed 10 Nov |")
A("| `write/_common.readiness()` (what every write script calls) | passes |")
A("| `check_add_case_payloads.py` | PASS: no payload sends custom_atmstatus 3 (the new cases send 1) |")
A("")
A("## 5. Write scripts (dry runs; the coordinator runs them with `--apply`, in this order)")
A("")
A("| # | Script | Does | Dry run says |"); A("|---|---|---|---|")
A(f"| 1 | `write/update_v11.py` | update_case for the 355 kept cases, only the fields that differ; edit lock on the 10 Nov snapshot (live `updated_on` and every field to be written must equal the snapshot, else skipped and logged); before-copy, read-back, log | {len(plan)} cases |")
A("| 2 | `write/create_v11.py` | add_case for the 25 new cases in their sections; refuses if a section holds a case not in our map; read-back; appends `testrail-id-map.csv` | 25 to add: S1 6 (90419), S2 8 (90420), S3 2 (90421), S4 2 (90422), S5 3 (90423), DATA 3 (90428), REL 1 (90429) |")
A("| 3 | `write/delete_rel08.py` | delete_case C715478 (edit-locked) — the proposal; the coordinator decides | REL-08 C715478 |")
A("| 4 | `write/run557_sync.py` | update_run 557 with the UNION of its current cases and 24 new ones (S3-32 left out: question 18); never removes a case | 24 to add (after step 2) |")
A("| 5 | `write/delete_attachments.py` | delete_attachment for the 46 old picture copies, re-checking each before deleting | 46 attachments on 46 cases |")
A("")
A("Order matters: 1 before 5 (the text stops calling the picture attached before it goes), 2 before 4. REL-14 goes into run 557 because the 12 other release-day cases are in it (run on release day); say if you want it out.")
A("")
A("## 6. Attachments to delete (the three re-shot pictures, QA lead: \"Remove old, add later\")")
A("")
A("Read with get_attachments_for_case on 10 Nov 2026; every one of the 356 live cases was scanned and exactly these 46 carry one of the three files (`live-before/attachments-all-2026-11-10.json`). Each case's References from Design now says the picture is no longer attached and quotes its new 5 Nov caption.")
A("")
A("| Case | Attachment file to delete | Attachment id |"); A("|---|---|---|")
for k, v in ATT.items():
    for a in v["delete"]: A(f"| {k} {link(k)} | {a['name']} | {a['attachment_id']} |")
A("")
A("## 7. Question 18 (the QA lead's Q1) — the row for Chris Ward's sheet")
A("")
A("Sheet https://docs.google.com/spreadsheets/d/11_3z_TpKkOL-MiAWqxrj1jlHP1rn9QXu_h3uCR0SjVA, tab \"Questions for Chris\". Question 17 is in rows 24-25 (light purple, colour guide G3). Question 18 goes in rows 26-27 in a colour not used before, for example light pink, with colour guide H3 \"Light pink = new question, 10 Nov 2026\" (Rule 131). Answer cell: column E of row 27, yellow, empty.")
A("")
A("Row 26 (heading line, as row 24): `New question, 10 Nov 2026 (spec version 11, 5 Nov 2026)`")
A("")
A("Row 27:")
A("")
A("| Column | Text |"); A("|---|---|")
A("| # | 18 |")
A("| Topic | A/R and A/P Report Sorting: the date on the PDF's \"As of\" line for a day before the 10th |")
A("| Question for you | The PDF of every one of the six reports starts with an \"As of\" line. For an as-of date before the 10th of the month (for example 4 November 2026), which form should it print?<br>(a) \"As of Nov 4, 2026\" — Suggested: the form of the \"As of\" example, no leading zero, with a comma<br>(b) \"As of Nov 04, 2026\" — a leading zero, with a comma<br>(c) \"As of Nov 04 2026\" — the PDF's own date form, as the document dates print |")
A("| What we know today | The spec says: \"Each export states the as-of date the user picked: the PDF \"As of Oct 15, 2026\", the CSV \"As of: Oct 15, 2026\" (format: three-letter month, day, four-digit year).\" It also says the PDF uses the app-wide report format, where \"dates print as \"Nov 04 2026\"\". The \"As of\" example is the 15th, so it does not show whether a day before the 10th gets a leading zero, or which of the two rules the \"As of\" line follows. |")
A("| Your answer | (empty, yellow) |")
A("| Where we found it | PRD v11 (5 Nov 2026) S3-R4, S3-R7a; Jira SV-11533 (Story 3) |")
A("")
A("Held on it: S3-32 (new, no C-id yet; out of run 557 until answered). REL-03 checks only which date the line shows, so it is not held. Q2 dropped as ordered. Not added to the sheet: that is the QA lead's or coordinator's write (no Google writes in this pass).")
A("")
A("## 8. Tech-plan differences to report to the QA lead (Rules 115, 134)")
A("")
A("- TP-66 (§6 Phase 4, backend): the plan says \"credits never Current\"; PRD v10/v11 S1-R5a puts a credit dated exactly on the as-of date in Current with Past Due 0. S1-18 follows the PRD and quotes the plan as the difference.")
A("- TP-71 (§7 Manual testing checklist 1): the plan says Location wraps only on A/P Detail; PRD v11 S8-R3 also lets it wrap on A/P Unpaid Invoices. D-16 follows the PRD and quotes the plan as the difference.")
A("- The tech plan file is unchanged since 22 Oct 2026 (read in full then); this round its 84 statements were re-checked against PRD v11 (TP-37 reason updated, TP-66 and TP-71 now DIVERGE); it was not re-read line by line. Say if you want it re-read in full.")
A("")
A("## 9. Notes")
A("")
A("- The setup file (`AR-AP-SETUP-FILE.md`) shows each case's tester preconditions as TestRail will hold them, including this pass's corrections; its \"placeholders and example values\" lines come from the case model, which the tester-text corrections (v11_layout) do not touch, so for D-02, D-03, D-10, D-11, D-12, D-63, D-68, D-73 and D-81 those lines still carry the earlier wording.")
A("- Unchanged design blocks keep \"read 22 Oct 2026\": the QA lead's named set limits stamp-only cases to the From line, the build sentence and the marker; a design block that changes names the version of 5 Nov 2026.")
A("- New cases carry custom_automation_type 2, as the 356 existing cases do; custom_atmstatus 1 (Not Automated).")
A("- The CSV's \"As of:\" line has the same open point for a day before the 10th; no case depends on it (every CSV case uses the 15th), so it is not on the sheet (Q2 dropped).")
A("- SV-11442 to SV-11447 moved to epic SV-12125 on 4 Nov 2026; REL-09 still checks they do not appear; the PRD's Out of Scope line still says they are tickets on SV-11315 (a wording point for Chris).")
A("")
A("## 10. OUTSTANDING — what I need from you")
A("")
A("| What | Why | Recommendation |"); A("|---|---|---|")
A("| Go-ahead to run the five write scripts (section 5) | TestRail writes need your permission (Rule 6) | run them in the order given |")
A("| Go-ahead to delete REL-08 C715478 | ordered \"Yes, both\"; deletion is the coordinator's call | delete: PRD v11 S1-R5a reverses it and REL-14 replaces it |")
A("| Add question 18 to Chris Ward's sheet (section 7) | no Google writes in this pass | add rows 26-27 as written |")
A("| The three re-shot pictures (5 Nov 2026) | this account is not a writer of the design canvas, so the files cannot be fetched | share them, or open the canvas and download the three pictures |")
A("| The 13 release-day cases' records and captures | must be made before the release is installed (19 Nov 2026) | testers capture them this week |")
A("")
A("### Waiting on the PO")
A("")
A("Sheet https://docs.google.com/spreadsheets/d/11_3z_TpKkOL-MiAWqxrj1jlHP1rn9QXu_h3uCR0SjVA: questions 1 to 17 answered. Question 18 (added 10 Nov 2026) is not sent yet; held on it: S3-32 (new). `build/PO-QUESTIONS-OPEN.md` needs this row once the question is on the sheet.")
A("")
A("## 11. Reading coverage (Rule 119)")
A("")
A("| Source | Size | Read |"); A("|---|---|---|")
A("| PRD v11 `sources/CONFLUENCE-947650561-2026-11-05-read-2026-11-10.md` | 58,699 bytes, 479 lines | 100% (lines 1-479); HTML 99,325 bytes diffed block by block against v9 |")
A("| Jira, 26 tickets, `sources/JIRA-READING-2026-11-10.md` | 151,539 bytes, 2,030 lines | 100% (lines 1-2030) |")
A("| Design version of 5 Nov 2026, 8 project files | 48,734 bytes | 100%; the 3 re-shot pictures could not be fetched |")
A("| Chris Ward's answers 1 to 17 | 3,806 + 902 bytes | 100% |")
A("| Tech plan | 88,174 bytes | read in full 22 Oct 2026; statements re-checked 10 Nov (section 8) |")
A("| Every case of the library as the tester reads it | 380 cases, 3,125 lines | 100% |")
A("| Live cases snapshot | 356 cases | 100% by script; 9 expect-fail blocks folded in byte for byte |")
A("| Rules 61, 69, 113, 116, 117 (14th and 15th amendments), 128-139 | repo | 100% of those sections |")
A("")
A("## 12. Per-case record (Rule 134)")
A("")
A("Parts: T title, P preconditions, S steps, R results and notes, Q quotes, D References from Design, F refs, From line, build sentence, marker. "
  "CH = changed, ok = confirmed unchanged. Every kept case gets the three stamps (From line version 11 with its date, author and read date; the build "
  "sentence; the Rule 69 marker where the old marker was the \"no build yet\" HOLD).")
A("")
A("| Case | C-id | Verdict | T | P | S | R | Q | D | F | Why |"); A("|---|---|---|---|---|---|---|---|---|---|---|")
for k in list(P) + ["REL-08"]:
    d = PP.get(k, {"status": "RETIRE"})
    if d["status"] == "NEW": A(f"| {k} | new | NEW | new | new | new | new | new | new | new | written 10 Nov 2026 from PRD v11 |"); continue
    if d["status"] == "RETIRE": A(f"| REL-08 | [C715478](https://shopview.testrail.io/index.php?/cases/view/715478) | RETIRE | | | | | | | | PRD v10/v11 S1-R5a reverses it; proposed for deletion |"); continue
    fl = plan.get(k, []); parts = d.get("parts", [])
    m = lambda b: "CH" if b else "ok"
    T = m("title" in fl); Pp = m("custom_preconds" in fl); S = m("custom_steps" in fl); Rr = m("results/notes" in parts)
    Q = m("quotes" in parts); Dd = m("design" in parts); F = m("refs" in fl)
    why = WHY.get(k, "")
    if "quotes" in parts and not why:
        codes = sorted({x.split(":")[0] for x in d["quotes_arrived"]})
        why = "quotes re-taken from PRD v11 (" + ", ".join(codes) + ")"
    if "design" in parts: why = (why + "; " if why else "") + design_why(k)
    if d["status"].startswith("CONFIRMED"): why = "stamps only"
    A(f"| {k} | {link(k)} | {'CHANGE' if d['status']=='CHANGE' else 'CONFIRMED'} | {T} | {Pp} | {S} | {Rr} | {Q} | {Dd} | {F} | {why} |")
open(f"{W}/PASS-REPORT.md", "w").write("\n".join(R) + "\n")
print("PASS-REPORT lines", len(R))
