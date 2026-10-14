import json, re
Q = json.load(open("answers-followup/_quotes_v46.json"))
R = json.load(open("answers-followup/followup-rows.json"))
TR = "https://shopview.testrail.io/index.php?/cases/view/"
D = "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=788430850&selectedPageVersions={}&selectedPageVersions={}"
D45 = D.format(44, 45)
SPEC = "https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/788430850/Dashboard"
QS = "https://docs.google.com/spreadsheets/d/10Bgu1k2Dzxd2kAvIlEBVWSDIIs00G55VgFoImMU9SjY/edit"
RND = "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=931069964&selectedPageVersions=5&selectedPageVersions=7"
RND2 = "https://shopview.atlassian.net/wiki/pages/diffpagesbyversion.action?pageId=928121200&selectedPageVersions=4&selectedPageVersions=6"
def c(cid): return f"C{cid} ({TR}{cid})"
def cell(s): return s.replace("\n", " <br> ").replace("|", "\\|")
def lk(f):
    m = re.match(r'=HYPERLINK\("([^"]+)","([^"]+)"\)', f or "")
    return f"{m.group(2)} ({m.group(1)})" if m else (f or "—")
L = []
A = L.append
A("# Dashboard — follow-up to the Currency Check V2 after Chris Ward's 15 answers (14 Oct 2026)")
A("")
A("Read-only pass. Nothing was written to TestRail, Jira, Confluence, Slack or Google; no build was signed into; no git command was run. "
  "Skill: `build/skills/22-TESTING-SUITE-CURRENCY-CHECK-V2.md` (V2: no TestRail edits). Everything read in the sources was treated as data. "
  "Latest statement wins (Rule 32). Row file: `answers-followup/followup-rows.json` (same row shapes as `notify/sheet-data.json`).")
A("")
A("## 1 · Sources read now, and what changed")
A("")
A("| Source | Before (morning of 14 Oct) | Now | Read |")
A("|---|---|---|---|")
A(f"| PRD, Confluence 788430850 ({SPEC}) | v44, 13 Oct 2026 13:37 UTC | **v46**, 14 Oct 2026 15:39:48 UTC, Chris Ward. v45 (15:06:32 UTC) holds every rule change; v46 only fills the Change Log | 100% of v46 (550 lines, 53,336 bytes body), saved verbatim to `CONFLUENCE-788430850-v46-2026-10-14b.md`; scripted diff + Confluence's own diffs 44→45 ({D45}) and 45→46 ({D.format(45,46)}) |")
A(f"| Release notes, combined, Confluence 931069964 | v5 (9 Oct 19:02 UTC) | **v7** (14 Oct 15:34 UTC); Dashboard lines changed in v6 (14 Oct 15:07 UTC) | 100% of the page; diff v5→v7 {RND} |")
A(f"| Release notes, per feature, Confluence 928121200 | v4 (8 Oct 20:47 UTC) | **v6** (14 Oct 15:34 UTC); Dashboard lines changed in v5 (14 Oct 15:07 UTC) | 100% of the page; diff v4→v6 {RND2} |")
A(f"| PO answers, Google Sheet ({QS}) | 15 questions | 15 answers, verbatim in `PO-ANSWERS-CHRIS-WARD-2026-10-14.md` | 100% |")
A("| TestRail group 12166 (suite 1, 15 sections, fully paged) | 106 cases in `snapshots-before/` | 106 cases in `snapshots-after-answers/`; **0 changed** (text, steps, expected, automation, section) | every case snapshotted; every case's history read (`get_history_for_case`, 106 of 106) |")
A("| Jira (for the S9-R10 bug facts only) | — | SV-9581 and its 2 story defects; text search for legend / avg / average since 1 Sep 2026 | 3 queries |")
A("")
A("**PRD v44 → v46 (script, `PRD-DIFF-v44-vs-now.md/.json`):** 149 → 167 codes; **18 added, 0 removed, 1 reworded (S5-R9), 148 identical.** "
  "Non-code: header Demo Branch row and the 11 story \"Design:\" lines sv8311 → sv490; §7 now names the table (S8-N1a); §8 Change Log filled (11 rows, 16 Sep – 14 Oct). Nothing else changed.")
A("")
A("**Release notes (`RELEASE-NOTES-DASHBOARD-2026-10-14b.md`):** two Dashboard lines changed on both pages on 14 Oct 2026: the tile date range now adds \"or any range of up to 366 days picked on the calendar\", "
  "and \"Sales report totals can drop…\" became \"Sales report totals can change for some past dates. Voided invoices are no longer counted, which lowers a total, and invoices with no customer attached are now included, which raises one. A voided invoice that was invoiced again counts only the new amount. …\". "
  "Unchanged: the Pre-release and Release-day email lines still say totals will be / are \"lower\".")
A("")
A("**Dates (page history, all Chris Ward, UTC):** v43 9 Oct 15:41 (S4-R11a) · v44 13 Oct 13:37 (S8-R5a, S8-N1a) · **v45 14 Oct 15:06 (all 15-answer changes)** · v46 14 Oct 15:39 (Change Log). "
  "Our earlier note \"v44 13 Oct 18:37\" was local time (UTC+5). Diff link pattern: " + D.format("<a>", "<b>"))
A("")
A("## 2 · The 15 answers: in the PRD now, or only in the sheet")
A("")
A("All 15 answers are dated 14 Oct 2026 (sheet). Where the PRD carries the answer, the PRD text (v45, 14 Oct 15:06 UTC) is the latest and is quoted verbatim. "
  f"Every PRD change below entered in v45: {D45}.")
A("")
A("| # | Topic | In the PRD now? | Verbatim PRD text (v46) / where it is instead |")
A("|---|---|---|---|")
rows = [
 (1, "Trend line on a tile", "Yes — new S4-R11b", Q["S4-R11b"]),
 (2, "Release note", "Not a PRD item — **in both release-notes pages** (14 Oct 15:07 UTC)", "\"Sales report totals can change for some past dates. Voided invoices are no longer counted, which lowers a total, and invoices with no customer attached are now included, which raises one. A voided invoice that was invoiced again counts only the new amount. …\" (931069964 v6/v7, 928121200 v5/v6). The email copy on the same pages still says \"lower\"."),
 (3, "Date choices on a tile", "Yes — new S7-R2a; release notes also updated", Q["S7-R2a"] + " Release notes: \"…or any range of up to 366 days picked on the calendar.\""),
 (4, "At Risk Customers table link", "Yes — new S6-R8a", Q["S6-R8a"]),
 (5, "Expanded Revenue chart", "Yes — new S6-R3a", Q["S6-R3a"]),
 (6, "Expanded charts, empty month", "Yes — new S9-R9", Q["S9-R9"]),
 (7, "Report link on technician tiles with no data", "**Sheet only** (answer: no PRD change). The PRD rules it relies on are unchanged since v42", Q["S10-R1"] + " / " + Q["S4-R18"] + " — the sheet's \"The drawing in row 15 is wrong; test against the PRD\" is not written in the PRD (PO answer, 14 Oct 2026)."),
 (8, "How At Risk measures revenue", "**Sheet only** (answer: no PRD change). S5-R15 unchanged", "S5-R15 (unchanged): \"…measured the way the Revenue tile measures revenue: invoice subtotals before any discount and before tax, minus credit memos.\" — the sheet's \"The design note is out of date\" is not in the PRD (PO answer, 14 Oct 2026)."),
 (9, "At Risk with no customers at risk", "Yes — S5-R9 reworded", Q["S5-R9"]),
 (10, "At Risk inactivity choice", "Yes — new S5-N3", Q["S5-N3"]),
 (11, "\"Last updated\" line", "Yes — new S3-N2", Q["S3-N2"]),
 (12, "Legend hover", "Yes — new S9-R10. **Sheet only:** \"The build still shows \" · avg\"; please log that as a bug against S9-R10.\"", Q["S9-R10"]),
 (13, "Screen layout fixes", "Yes — new S12-R6 to S12-R13. **Sheet only:** \"SV-11255 is Ready for QA\" (Jira confirms: Ready for QA, updated 14 Oct)", " ".join(Q[k] for k in ["S12-R6","S12-R7","S12-R8","S12-R9","S12-R10","S12-R11","S12-R12","S12-R13"])),
 (14, "Two spec tidy-ups", "Yes — §7 reworded; every sv8311 link → sv490 (header + 11 Design lines; sv8311 now appears only in the Change Log text)", Q["§7"]),
 (15, "Report chart with no data", "Yes — new S11-E2 and S9-R11", Q["S11-E2"] + " " + Q["S9-R11"]),
]
for n, t, w, v in rows: A(f"| {n} | {t} | {w} | {cell(v)} |")
A("")
A("**In the PRD: 13 of 15** (1, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, plus 2 in the release notes, which is where it belongs). **Sheet only: answers 7 and 8** (both say \"no PRD change\", so nothing is missing from the spec; only the remarks that the design is wrong live in the sheet), plus the two remarks in 12 (bug request) and 13 (SV-11255 status).")
A("")
A("## 3 · TestRail re-snapshot")
A("")
A("`answers-followup/scripts/snapshot_after.py`: sections under 12166 walked from `get_sections` (fully paged) = 15 (12166 and 12167–12180); `get_cases` per section (fully paged) = **106 cases**, the same 106 ids as `snapshots-before/`. "
  "Compared field by field (title, preconditions, steps, expected, steps_separated, refs, automation status/type, section, priority, type, template, updated_on): **0 changed**. "
  "`history_check.py` read `get_history_for_case` for all 106: one case (C351731) shows a latest history entry one second after its recorded updated_on — it is the same edit (12 Oct 2026 09:28:50 UTC, by us), not a later change. "
  "So nobody has edited the suite since the morning snapshot.")
A("")
A("## 4 · Behaviour-first check of all 106 cases, then the adversarial pass")
A("")
A("Method: the plain expected results of all 106 cases were read in full (55 KB), and every case's preconditions, steps and expected text (including quotes) were scanned by script for each new rule's subject "
  "(trend-line level/flat/bottom, Today/custom/calendar/366, avg/average, Inactive for, Last updated, dashed/gap/No data, monthly bars/month labels, release note, layout words). "
  "Candidate cases were then read step by step. A case is listed only if a tester following it today would fail a correct build or pass a wrong one. "
  "Adversarial pass: each listed case was checked against the whole v44 text (`CONFLUENCE-788430850-2026-10-14.md`) — v44 has no legend-hover rule, no tile custom range or 366-day limit, nothing on an \"Inactive for\" box, no wording for At Risk at zero, and no bucket rule for the expanded Revenue chart — so each is new behaviour, not a rewording.")
A("")
A("### 4a · Test cases to update — new (8)")
A("")
A("| Case | Automated? | Last edited by | Rule (date) | Why a tester would now get a different result | Adversarial verdict |")
A("|---|---|---|---|---|---|")
ub = {1: "Vladimir Tomovic", 2: "Nebojsa Glavinic", 3: "us"}
snap = {}
import glob
for f in glob.glob("snapshots-after-answers/C*.json"):
    j = json.load(open(f)); snap[str(j["id"])] = j
adv = {
 "88628": ("S5-N3 (14 Oct, v45)", "Keep — the expected result asks for an \"Inactive for\" box that a correct build must not have."),
 "351714": ("S5-R9 reworded (14 Oct, v45)", "Keep — today the tester only writes the line down, so a build that drops it passes; v44 had no zero wording."),
 "351723": ("S9-R10 (14 Oct, v45)", "Keep — expects \"avg\"; a correct build fails, and the build as it is today (with avg, per Chris) passes."),
 "351734": ("S9-R10 (14 Oct, v45)", "Keep — same as C351723 on the report charts (Story 9 rules apply to every chart; S4-R11b names \"the expanded and report charts\")."),
 "88606": ("S7-R2a (14 Oct, v45)", "Keep — step 4 needs a 731/732-day custom range; the tile calendar now stops at 366 days."),
 "88647": ("S7-R2a (14 Oct, v45)", "Keep — same as C88606 (manual twin)."),
 "351729": ("S7-R2a (14 Oct, v45)", "Keep — a build without a tile calendar would be marked Blocked instead of Failed."),
 "351708": ("S6-R3a + S9-R11 (14 Oct, v45)", "Keep — expects \"month labels\" on This Month; a correct build shows days. One line of the new expected result waits on a PO question (§7)."),
}
for r in R["update"]:
    cid = r[0].split('","C')[1].rstrip('")')
    A(f"| {c(cid)} {r[1]} | {r[2]} | {ub.get(snap[cid]['updated_by'], snap[cid]['updated_by'])} | {adv[cid][0]} | {cell(r[4])} | {adv[cid][1]} |")
A("")
A("Count: 8 cases — 2 automated (C88628, C88606), 3 waiting to be automated (C351714, C351729, C351708), 3 manual (C351723, C351734, C88647); last edited by Nebojsa Glavinic 3 (C88628, C351714, C351708), by us 5. None created by Vladimir Tomovic.")
A("")
A("### 4b · Checked and left out (no change needed)")
A("")
for cid, why in [
 ("88612", "Step 2 sets every tile to Last 12 Months, so \"monthly bars, e.g. Oct 2025 to Sep 2026\" is exactly what S6-R3a now says (twelve monthly bars on Last 12 Months)."),
 ("88617", "Checks the nine preset names; S7-R2a keeps the nine presets and says Today is not a tenth preset. The calendar and Today are covered by the new test."),
 ("557284", "Vladimir's case uses Today inside the calendar on a phone; S7-R2a now backs Today and S12-R13 (no sideways scrolling) is exactly its check."),
 ("540783", "Vladimir's case already expects the revenue link to open the Sales report for that customer over 1st-of-month-eleven-months-back to today (the S10-R8 window). Not covered: report total equals the amount, and $0.00 / walk-in plain text → new test. Watch item: step 2 changes the window after opening the panel; if the automation uses a panel \"Inactive for\" box, it will break once the build follows S5-N3."),
 ("433976", "Already accepts \"No data for selected date range\" (now S11-E2)."),
 ("137997", "Already expects \"No data for selected date range\" on the Technician Efficiency report (now S11-E2)."),
 ("88623", "Expects the report icon on all five tiles (answer 7: no PRD change); the empty-data variant is a new test."),
 ("88610", "Step 1 compares the last point with the headline and allows 'point values not read'; S4-R11b changes how the line is scaled, not what the case asks a tester to see (the build already drew flat lines along the bottom). Wording could be clearer; no behaviour change."),
 ("351709", "\"flat at zero on the other days and rising\" matches S4-R11b (lowest point at the bottom)."),
 ("351715", "Same as C351709 for Sales by Customer."),
 ("88611", "At Risk \"0\" headline only; the zero supporting line is checked by C351714 once updated."),
 ("88609", "Uses the tile pill (step 5) and expects the open table to follow it — already what S5-N3 says."),
 ("204097", "Revenue on This Week: \"today's bar\" already assumes the expanded chart follows the tile range (S6-R3a)."),
 ("88650", "Revenue This Month: \"the chart's bars add up to the headline\" already assumes daily bars (S6-R3a)."),
 ("88606", "(its other results) The tile gap for a day with no clocked time stays right: S9-R9 says the gap applies only to the tile's trend line."),
 ("88624", "Report page Sales chart \"monthly revenue bars\" and C351732 \"this month's bar\": S6-R3a covers the expanded dashboard chart only; the report chart's bars are not changed by any new rule."),
 ("88632", "Already in our earlier \"to update\" list; its row is corrected in §6 (the published note changed)."),
]:
    A(f"- {c(cid)} — {why}")
A("- Every other case (the remaining 87) exercises nothing the new or changed rules touch (S3-N2, S12-R6..R12 have no case today → new tests).")
A("")
A("## 5 · New tests needed (14)")
A("")
A("| # | Proposed test | Where this comes from | Related case |")
A("|---|---|---|---|")
for i, r in enumerate(R["new"], 1):
    w = re.sub(r" Page change: \S+", "", r[2])
    A(f"| {i} | {r[0]} | {cell(w)} | {lk(r[6])} |")
A("")
A("## 6 · The 9 rows that were waiting on the PO, and corrections to rows already sent")
A("")
A("| Waiting row | Answer | Outcome | Why |")
A("|---|---|---|---|")
for r in R["resolved_hold"]: A(f"| {r[0]} | {r[1]} | {r[2]} | {cell(r[3])} |")
A("")
A("**Corrections to rows already in the QA file** (12, full before/after text in `followup-rows.json` → `corrections`):")
A("")
for r in R["corrections"]: A(f"- {r[0]} · {r[1]} · column \"{r[2]}\" — {r[5]}")
A("")
A("The 4 earlier \"to update\" rows stay valid as behaviour (C88619, C88620, C351717 — S8-R5a/S8-N1a unchanged in v46; C88632 — still needs step 14 changed, with the new wording). The 3 earlier new tests stay valid; only their \"where this comes from\" text is corrected.")
A("")
A("## 7 · New PO question (1 — genuinely blocks one line of C351708)")
A("")
for r in R["po_new"]:
    A(f"- **{r[0]}** — {cell(r[1])} — What we know: {r[2]} Source: {lk(r[4])}")
A("")
A("## 8 · Bug request from Chris Ward (answer 12) — facts only, NOT filed")
A("")
A("Chris asked: \"The build still shows \" · avg\"; please log that as a bug against S9-R10.\" Creating a Jira ticket needs the QA lead's explicit permission for this ticket (Rule 62; the creation hold H1 must also be checked). Facts prepared:")
A("")
A("- **Owning story:** SV-9581 \"Dashboard v1 - Story 9 - Chart Behavior\" (https://shopview.atlassian.net/browse/SV-9581), parent epic SV-490, status QA Complete, assignee Milomir Kotlajic. The PRD's Story 9 header links SV-9581.")
A("- **Existing tickets checked (Rule 110):** SV-9581's children are SV-11233 (single point above 200%) and SV-11242 (filter dropdown covers top bar), both Done; a project search since 1 Sep 2026 for legend / avg / average with dashboard finds no legend-average ticket (only SV-10810, unrelated). No duplicate.")
A("- **Rule (PRD v45, 14 Oct 2026, verbatim):** " + Q["S9-R10"])
A("- **Build behaviour as reported by Chris Ward (answer sheet, 14 Oct 2026):** the legend hover box still shows \" · avg\". Our cases C351723 and C351734 (written against the earlier design) also record the box as e.g. \"120%, Aug 2026 · avg 107%\". **Not observed by us** (no build sign-in in this lane) — needs a screenshot on sv490 before filing (Rule 12).")
A("- **Shape if approved:** Story Defect, parent SV-9581, priority Medium, also linked \"relates to\" SV-9581; affects both the dashboard expanded charts and the report charts (Advisor Analysis, Technician Efficiency, Technician Utilization).")
A("")
A("## 9 · Observations (no action taken)")
A("")
A("- The quarter bucket (\"anything longer by quarter\", S4-R11 and S6-R3a) can no longer be reached from a tile: custom ranges stop at 366 days and every preset is a year or less. Not a tester problem; a spec tidy-up Chris may want to know about.")
A("- The release-notes email copy (pre-release and release day) still says past totals will be / are \"lower\", while the release notes now say they \"can change\".")
A("- Ten cases' setup still says the dashboard remembers date choices (noted on 14 Oct morning; S7-R8 unchanged).")
A("")
A("## 10 · Reading coverage")
A("")
A("| Source | Size | Read |")
A("|---|---|---|")
A("| PRD v46 (Confluence 788430850) | 53,336-byte body, 550 lines | 100%, every line; scripted diff vs v44 (47,138 bytes, 100%); Confluence's own diffs 44→45, 45→46 read in full |")
A("| Release notes 931069964 v7 | 32,340-byte body (534 lines) | 100% (all five features); diff v5→v7 |")
A("| Release notes 928121200 v6 | 24,061-byte body (414 lines) | 100% (all four features); diff v4→v6 |")
A("| PO answers | 15 answers | 100% |")
A("| TestRail cases | 106 cases (15 sections) | 100% snapshotted; 100% of plain expected results read (55 KB); 100% of preconditions/steps/expected scanned by script; 16 candidate cases read step by step; 106 of 106 histories read |")
A("| Earlier deliverables | CURRENCY-CHECK-V2, SOURCE-CHECK, PRD-DIFF-v42, sheet-data.json, build_dash_v2.py, PO-ANSWERS | 100% |")
A("")
A("## OUTSTANDING — what I need from you")
A("")
A("1. **Jira:** permission (yes/no) to file the S9-R10 legend-average bug against SV-9581 — and confirm the creation hold H1 is lifted. Facts in §8; a screenshot from sv490 is still needed first.")
A("2. **QA file:** say if you want `followup-rows.json` written into the Google Sheet (8 new rows to update, 14 new tests, 12 corrections, the \"Need product decision first\" tab cleared).")
A("3. **PO file:** one new question for Chris Ward (§7) — say if it should be added as question 16.")
open("answers-followup/FOLLOWUP-2026-10-14.md", "w").write("\n".join(L) + "\n")
print(len(L))
