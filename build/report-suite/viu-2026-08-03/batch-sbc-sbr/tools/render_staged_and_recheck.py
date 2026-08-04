#!/usr/bin/env python3
"""render_staged_and_recheck.py — write STAGED-CHANGES.md and RECHECK-ROWS.md from the verdict table.

Nothing here is pushed to TestRail (Standing Rule 6): STAGED-CHANGES.md is the proposal, and
RECHECK-ROWS.md is the set of rows to merge into the master Rule-49 queue.
"""
import csv
import json
from pathlib import Path

BATCH = Path(__file__).resolve().parents[1]
ROOT = Path(__file__).resolve().parents[5]
BUILD = "v3.4.1-0ed4433"
OBS = "2026-08-04"

# Cases whose Expected/Steps need a concrete rewrite, with current -> proposed text.
# Only the ones where I can quote what the build actually shows are given proposed text; the rest are
# listed as wording/decision items so nothing is invented (Rule 12).
REWRITES = {
 "SBC-DATE-01": (
  'CURRENT (expected 1): the date-range control "offers eleven options in the specified order".',
  'PROPOSED: "The date-range popup shows an inline calendar plus exactly nine quick choices, in this '
  'order: Last 12 Months, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, '
  'This Week, Last Week. Below them a line reads \'Range: N days\' and there is an Apply button. '
  'There is no \'Custom\', \'Today\' or \'Yesterday\' choice."'),
 "SBC-DATE-03": (
  'CURRENT: opens a "Custom range" start/end dialog and enforces a 366-day maximum.',
  'PROPOSED: "Pick a start day and an end day directly on the calendar inside the popup (there is no '
  '\'Custom\' button — the calendar is always there). The \'Range: N days\' line counts the days you '
  'have picked. Press Apply. If you pick a span longer than the allowed maximum the report does not '
  'load and an error is shown."'),
 "SBC-DATE-04": (
  'CURRENT: "Changing the date range writes it into the page link for sharing."',
  'HOLD — no proposed text. The address bar never changes (it stays /reports/sales-by-customer); the '
  'setting is saved locally instead. Either the case is retired in favour of the persistence cases, '
  'or it waits for shareable links to be built. Needs the QA lead\'s call, not a silent reword.'),
 "SBC-PERS-06": (
  'CURRENT: a saved view and a "page-link range" clash, and the saved view wins.',
  'HOLD — no proposed text. Same root cause as SBC-DATE-04: no range can be put in the page link, so '
  'the clash cannot arise. Retire or hold together with SBC-DATE-04.'),
 "SBC-EXP-04": (
  'CURRENT: "Margin % plain; dates mm-dd-yyyy; currency plain; no color".',
  'NO CASE CHANGE PROPOSED — the case is right and the build is wrong (spec S14-R9/R10/R11 quoted on '
  'the verdict row). Raise a dev ticket for the export formatter. The "no color" clause does pass.'),
 "SBC-SORT-01": (
  'CURRENT: "All columns sortable except chevron; text alphabetical, numbers by value".',
  'NO CASE CHANGE PROPOSED — the case matches the spec; the build does not sort Customer, Location, '
  'Margin or Margin %. Raise a dev ticket. If the PO instead rules those four intentionally '
  'unsortable, the case becomes: "These eight columns sort: Date, Inv. Hrs, Labor Invoiced, Labor '
  'Margin, Parts Invoiced, Parts Margin, Shop Supplies, Subtotal."'),
 "SBC-EMPTY-01": (
  'CURRENT: an empty-state message shows in the table body.',
  'HOLD — the build shows no message at all, so there is no build wording to write the case against. '
  'Needs either the message to be built or the PO to confirm a bare empty table is intended.'),
 "SBC-EMPTY-02": (
  'CURRENT: the empty-state message never appears while still loading.',
  'HOLD — depends entirely on SBC-EMPTY-01 being built first.'),
 "SBC-VIS-02": (
  'CURRENT: "Row surfaces alternate by tree level; header and totals rows stay white."',
  'PROPOSED (matches the build): "Every row in the table uses the same light background, and the '
  'Totals row uses that same background rather than white." — but confirm with the PO first, because '
  'this may be a styling gap rather than the intended design.'),
 "SBC-VIS-03": (
  'CURRENT: dark mode darkens every surface while the PDF always renders light.',
  'NO CASE CHANGE PROPOSED — both clauses are right. The build has a real bug: in dark mode the '
  'Totals row keeps BLACK text on a near-black background. Raise a dev ticket; keep the case as the '
  'thing that catches it.'),
 "SBC-NAV-01": (
  'CURRENT: listed in the Performance group, below the pre-existing entries.',
  'PROPOSED (matches the build): "\'Sales By Customer\' is listed under the SALES heading in the '
  'reports side navigation." — but ASK the PO first: the spec says Performance, the build says SALES, '
  'and Chris\'s companion video described a new grouping, so this may be a deliberate regroup.'),
 "SBR-DATE-01": (
  'CURRENT: "offers the standard presets plus Custom".',
  'PROPOSED: same nine-preset wording as SBC-DATE-01 (the control is shared).'),
 "SBR-DATE-02": (
  'CURRENT: "A Custom range uses the date-picker and holds a 366-day maximum span".',
  'PROPOSED: same inline-calendar wording as SBC-DATE-03; keep the maximum-span clause, which is real.'),
 "SBR-ROW-02": (
  'CURRENT: "Row layout: 12 columns in order, blanks in position, bold summary rows".',
  'PROPOSED: "13 columns in order: Date, Invoice, Customer, Status, Location, Inv. Hrs, Labor '
  'Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal (plus the '
  'expand arrow)." OUR case is the stale side here — the Location column was added by the 2026-07-29 '
  'ruling (S21-R7 / S14-R20) after this case was written.'),
 "SBR-EXP-10": (
  'CURRENT: enumerates the Summary CSV headers WITHOUT Location.',
  'TWO separate actions. (a) OUR case needs Location adding to the header list — it was added by '
  'S14-R20 on 2026-07-29 and the build has it. (b) The BUILD needs a dev ticket: four spec\'d columns '
  'are missing from the file (# Invoices, # Customers, Hrs Worked, Hrs Invoiced) and it carries a '
  'Totals row S14-R15 says it should not have, and the first header reads "Representative" not '
  '"Sales Rep". Do not fold (b) into the case as if the build were right.'),
 "SBR-EXP-11": (
  'CURRENT: enumerates the Expanded CSV headers WITHOUT Location.',
  'TWO separate actions, same shape as SBR-EXP-10. (a) OUR case needs Location adding. (b) Dev '
  'ticket for the naming and ordering: "Representative" vs "Sales Rep", "Invoice Status" vs "Status", '
  'and Invoice # / Date swapped. The three hours columns ARE now present, so S14-R16\'s old build-note '
  'about one mislabelled hours column can be closed.'),
 "SBR-EXP-12": (
  'CURRENT: "CSV cells: plain numbers, signed Inv. Hrs, empty Margin %, (Inactive)".',
  'NO CASE CHANGE PROPOSED — same shared formatter bug as SBC-EXP-04 (one ticket covers both '
  'reports). Two clauses could not be exercised at all (signed Inv. Hrs, (Inactive)).'),
 "SBR-LOC-04": (
  'CURRENT (per Chris\'s ruling): the Location filter is HIDDEN for a one-location user.',
  'NO CASE CHANGE PROPOSED — and do NOT "fix" the case to match the build. The build shows the '
  'filter; the spec only ever hides the COLUMN; Chris ruled the filter hidden. Per Rule 33 the PO '
  'ruling outranks the spec text, so this is a PO/dev question. Same for the SBC twin.'),
 "SBR-TOT-03": (
  'CURRENT: "Mobile shows a simplified totals bar below the table; Subtotal at right".',
  'HOLD — at 390px the Totals row stays inside the sideways-scrolling table and there is no bar '
  'beneath it, so the totals scroll out of view. Either the bar gets built or the PO confirms the '
  'current behaviour and the case is rewritten to it.'),
 "SBR-MOB-03": (
  'CURRENT: "Touch targets are at least 44x44 px and touch users get no hover-only tooltips".',
  'NO CASE CHANGE PROPOSED — the case is right and the build is not: chevrons measure 22x22, the nav '
  'button 31x31 and the column-selector button 55x31. Raise a dev accessibility ticket.'),
 "SBR-VIS-02": (
  'CURRENT: dark mode switches page, toolbar, table and Totals to dark equivalents.',
  'NO CASE CHANGE PROPOSED — the Totals row keeps black text on a near-black surface. Same dev '
  'ticket as SBC-VIS-03.'),
 "SBR-VIS-04": (
  'CURRENT: "Chevrons and sortable headers are keyboard-operable and expose their state".',
  'NO CASE CHANGE PROPOSED — the case is right. Build gaps: chevrons are focusable (tabindex=0) but '
  'carry no aria-expanded, and the column headers have no tabindex at all. Dev accessibility ticket.'),
 "SBR-STATE-01": (
  'CURRENT: a VERBATIM empty-state message, no grand Totals, toolbar interactive.',
  'HOLD — there is no empty-state message to quote. Same shared gap as SBC-EMPTY-01.'),
 "SBR-STATE-04": (
  'CURRENT: an inline could-not-load message with a Retry control.',
  'HOLD — a failure surfaces a toast; no inline message and no Retry control exists. Either it gets '
  'built or the case is rewritten to the toast.'),
 "SBR-WO-01": (
  'CURRENT: title and body say "Sales Representative selector".',
  'PROPOSED (Rule 9): use the work order\'s own label, "Sales rep" (lower-case r), for the work-order '
  'surface. Note the CUSTOMER record says "Sales Representative" in full and the CSV export says '
  '"Representative" — each case must use the label of the surface it tests.'),
 "SBR-WO-04": (
  'CURRENT: the selector is read-only when Invoiced or Paid.',
  'PROPOSED: keep as-is and ADD the Standing Rule 24 tester line, because the back end still accepts '
  'the change: "Note for the tester: this field is only made read-only on the screen. If you find the '
  'sales rep can still be changed another way (through the back-end/API), that is expected — mark '
  'this test PASSED and do not raise it as a bug."'),
 "SBR-WO-06": (
  'CURRENT: customer record shows a "Sales Representative" row; "Unassigned" when none.',
  'PROPOSED: keep the label (it is correct for this surface) and add a note that the picker in Edit '
  'Customer lists ALL staff including inactive ones, and that the value is stored as a name rather '
  'than a link to the staff record. The "Unassigned" empty text still needs confirming live.'),
 "SBC-EXP-14": (
  'CURRENT: an export over 10,000 data rows is refused with the too-large toast.',
  'NO CASE CHANGE PROPOSED, but the case CANNOT PASS on this org and the build is worse than it '
  'assumes: the 366-day range limit means 10,000 rows is unreachable, and at the widest reachable '
  'scope the Expanded PDF returns HTTP 500 instead of refusing. Raise the dev ticket; re-test the cap '
  'clause on a bigger org.'),
 "SBR-EXP-15": (
  'CURRENT: over-cap Expanded View PDF is refused with the too-large message.',
  'NO CASE CHANGE PROPOSED — same as SBC-EXP-14.'),
 "SBC-API-05": (
  'CURRENT: exports are server-generated and the 10,000-row cap is counted first.',
  'NO CASE CHANGE PROPOSED — the server-generated half passes; the cap half is unverifiable here and '
  'the large Expanded PDF 500s.'),
 "SBR-API-05": (
  'CURRENT: the Expanded View PDF cap is enforced server-side BEFORE generation.',
  'NO CASE CHANGE PROPOSED — same as SBC-API-05.'),
 "SBC-EXP-15": (
  'CURRENT: a no-match export still downloads headers and a zero totals row.',
  'PROPOSED (matches the build) OR dev ticket — the file does download with the "Locations:" line and '
  'the column headers, but there is NO totals row in either the empty CSV or the empty PDF. Either the '
  'zeroed totals row gets built, or the case drops that clause. QA lead\'s call.'),
 "SBR-EXP-16": (
  'CURRENT: an empty-data export still generates with zeroed Summary PDF totals.',
  'PROPOSED / dev ticket — same as SBC-EXP-15: it generates, but with no totals row.'),
 "SBC-CALC-03": (
  'CURRENT: "+green / -red / 0.0 on every row".',
  'NO CASE CHANGE PROPOSED — the heading and the 0.0 default are right; the colours simply cannot be '
  'seen while the hours pipeline is empty. Re-run when hours exist.'),
}
FOR_HOURS = ["SBR-CALC-01", "SBR-CALC-02", "SBR-CALC-03", "SBR-CALC-09"]


def main():
    rows = list(csv.DictReader((BATCH / "verdicts.csv").open()))
    by_id = {r["internal_id"]: r for r in rows}
    field = {r["internal_id"]: r for r in json.loads((BATCH / "evidence/field-review.json").read_text())}

    # ---------------- STAGED-CHANGES.md ----------------
    L = []
    A = L.append
    A("# Staged changes — Sales By Customer + Sales By Representative (2026-08-04)")
    A("")
    A("> **NOTHING IN THIS FILE HAS BEEN PUSHED.** No TestRail write of any kind was made during this")
    A("> pass (Standing Rule 6). Every item below needs the QA lead's authorisation, and several need a")
    A(f"> PO ruling first. All of it is provisional against build `{BUILD}` observed {OBS} (Rule 49).")
    A("")
    A("## 0. Summary of what is being proposed")
    A("")
    universal = len(rows)
    anchors = [i for i in rows if not i["f_references"].startswith("OK")]
    brittle = [r for r in field.values() if r["brittle_count"]]
    A("| Change | Cases | Needs |")
    A("|---|---:|---|")
    A(f"| **Add the Rule-49 non-final-build marker** to the notes field | **{universal}** | QA lead go-ahead (mechanical, no wording risk) |")
    A(f"| **Add a missing spec anchor** to `refs` | **{len(anchors)}** | QA lead go-ahead |")
    A(f"| **Rewrite a brittle closed enumeration** (Rule 42) | **{len(brittle)}** | QA lead go-ahead |")
    A(f"| **Reword to match the build** (labels, counts, controls) | **9** | QA lead go-ahead; 2 also want a PO word |")
    A(f"| **Add the Rule-24 tester note** | **1** (`SBR-WO-04`) | QA lead go-ahead |")
    A(f"| **HOLD pending a build change or a PO ruling** | **8** | PO / dev — do not edit these yet |")
    A(f"| **Raise a dev ticket, leave the case alone** | **8** | QA lead to file |")
    A("| **New cases proposed** | **0** | see §5 for why |")
    A("")
    A("## 1. Applies to every one of the 195 — the Rule-49 build marker")
    A("")
    A("Every case in scope needs this appended to its **notes / metadata** field (never the")
    A("tester-facing fields, Rule 20):")
    A("")
    A("```")
    A(f"VIU {OBS}: verdict observed live on QA branch sv8582, build {BUILD}. THE BRANCH WAS DECLARED")
    A("NOT FINAL, so this finding is PROVISIONAL and must be re-confirmed when the build settles")
    A("(Standing Rule 49). Re-check queue: build/report-suite/viu-2026-08-03/batch-sbc-sbr/RECHECK-ROWS.md")
    A("```")
    A("")
    A("## 2. Missing spec anchors (Rule 20 — `refs` must carry ticket AND anchor)")
    A("")
    A("| Case | C-id | Current `refs` | Problem |")
    A("|---|---|---|---|")
    for r in anchors:
        f = field[r["internal_id"]]
        A(f"| `{r['internal_id']}` | [{r['cid']}]({r['link']}) | `{f['refs_raw'][:120]}…` | {r['f_references']} |")
    A("")
    A("Each cites a spec **section** in prose but no `Sn-Rn` anchor. All three are genuinely")
    A("cross-cutting display rules with no single owning story, so the honest fix is to cite the")
    A("owning section explicitly in anchor form rather than invent a requirement number — that needs")
    A("the QA lead's call on the convention.")
    A("")
    A("## 3. Brittle closed enumerations to rewrite (Rule 42)")
    A("")
    A(f"{len(brittle)} cases close a list with wording like \"exactly\". Each needs either a")
    A("version-pinned anchor in `refs` (`<TICKET> (<anchor>, spec v<N> <date>)`) or scope-conditional")
    A("wording. This is exactly the shape of the defect that made `SBR-EXP-10`/`SBR-EXP-11` wrong when")
    A("the Location column arrived.")
    A("")
    A("| Case | C-id | The closing phrase |")
    A("|---|---|---|")
    for r in sorted(brittle, key=lambda x: x["internal_id"]):
        txt = (r["brittle_text"] or "").replace("|", "\\|")[:150]
        A(f"| `{r['internal_id']}` | [{r['cid']}]({r['link']}) | {txt}… |")
    A("")
    A("## 4. Per-case rewrites, holds and dev tickets")
    A("")
    A("Current text first, then what I propose and why. Where I do **not** propose text, that is")
    A("deliberate — either the build is the wrong side of the argument, or there is no build wording to")
    A("write against yet.")
    A("")
    for iid, (cur, prop) in REWRITES.items():
        r = by_id[iid]
        A(f"### `{iid}` — [{r['cid']}]({r['link']}) — verdict **{r['verdict']}**")
        A("")
        A(f"- {cur}")
        A(f"- {prop}")
        A("")
    A("### The four hours-dependent SBR calculation cases")
    A("")
    A("`" + "` · `".join(FOR_HOURS) + "`")
    A("")
    A("No wording change proposed. The cases look correct; they simply could not be exercised because")
    A("`Inv. Hrs` / `Hrs Worked` / `Hrs Invoiced` are `0.0` for every row in the org and new invoices")
    A("cannot be created on this branch. They must be re-run, not edited. Same for `SBC-CALC-03`.")
    A("")
    A("## 5. New cases proposed: none — and why that is the honest answer")
    A("")
    A("I found real build behaviour that no case covers, but I am **not** proposing new cases for it")
    A("yet, because in every instance the right next step is a ruling rather than a test:")
    A("")
    A("| Uncovered behaviour | Why no new case yet |")
    A("|---|---|")
    A("| The customer's **Sales Representative picker offers all staff, including inactive staff**, "
      "instead of the toggled-on reps the work-order selector uses (`F50`) | This contradicts the "
      "intent of S19-R2 but S19-R2 is written about the WO selector. Whether the customer picker "
      "should honour the toggle is a **PO question**. Once ruled, it is one new case. |")
    A("| A customer's rep is stored as a **name pair, not a rep id** (`F50`) | Testable, but the "
      "assertion depends on the answer above, and it is invisible to a manual tester (it only shows up "
      "in the API payload). Would belong in an API section. |")
    A("| The **PDF `Date Range` header is one day later** than the requested end date (`F13`) | A "
      "genuine bug; the correct first move is a dev ticket. A regression case should be written from "
      "the fix, per the standing \"tickets become test cases\" practice. |")
    A("| **`change-sales-rep` silently no-ops across workplaces** (201 with no effect) | Out of scope "
      "for these two reports — it belongs to work-order permissions/scoping, and it is another team's "
      "area. Recorded in `ENV-DEFECTS.md` for whoever owns it. |")
    A("")
    A("If the QA lead wants any of these authored now, say which and I will write them against the")
    A("observed behaviour with the evidence path attached.")
    A("")
    A("## 6. Dev tickets this pass would raise (case left alone)")
    A("")
    A("| # | Defect | Cases that catch it |")
    A("|---|---|---|")
    A("| 1 | **CSV export formatting** keeps `$`, thousands separators and `%`, and writes dates as "
      "`Jun 02 2026` instead of `mm-dd-yyyy` — breaks re-pivoting. One shared formatter, both reports. | "
      "`SBC-EXP-04` C30162 · `SBR-EXP-12` C30287 |")
    A("| 2 | **SBR Summary CSV is missing four spec'd columns** (`# Invoices`, `# Customers`, "
      "`Hrs Worked`, `Hrs Invoiced`) though the payload carries the figures; also carries a Totals row "
      "S14-R15 excludes, and names the first column `Representative` not `Sales Rep`. | "
      "`SBR-EXP-10` C30285 |")
    A("| 3 | **SBC does not sort Customer, Location, Margin or Margin %** — no request is issued at "
      "all, yet Customer displays a sort arrow and `aria-sort=\"ascending\"`. SBR sorts Margin % fine. | "
      "`SBC-SORT-01` C30142 |")
    A("| 4 | **Dark mode: the Totals row keeps black text on a near-black surface** — unreadable. | "
      "`SBC-VIS-03` C30187 · `SBR-VIS-02` C30306 |")
    A("| 5 | **Touch targets below 44x44** on mobile (chevrons 22x22, nav 31x31, column selector "
      "55x31). | `SBR-MOB-03` C30304 |")
    A("| 6 | **Accessibility: chevrons expose no `aria-expanded`; column headers are not keyboard "
      "focusable** (no `tabindex`). | `SBR-VIS-04` C30308 |")
    A("| 7 | **PDF `Date Range` header is one day later** than the requested end date, on all four "
      "PDFs of both reports. | `SBC-EXP-09` C30167 (noted) |")
    A("| 8 | **Customer's Sales Representative picker lists all staff including inactive**, and stores "
      "a name pair rather than a rep id. | `SBR-WO-06` C30315 (noted) |")
    A("| 9 | **The Expanded PDF returns HTTP 500 at scale** — a 12-month two-location Expanded PDF dies "
      "(requestIds ffca8e2c-f6ae-4477-9216-16083355a3e5, 139bcca5-44a4-41a6-8255-e4d7b4a1ef30) while the "
      "equivalent CSV succeeds. It fails WELL BELOW the 10,000-row cap that is supposed to make a big "
      "export fail gracefully. **Highest-severity find of this pass.** | `SBC-EXP-14` C30172 · "
      "`SBR-EXP-15` C30290 · `SBC-API-05` C30194 · `SBR-API-05` C30320 |")
    A("| 10 | **Empty exports carry no totals row** — a no-match CSV and PDF both generate correctly but "
      "omit the Totals line entirely. | `SBC-EXP-15` C30173 · `SBR-EXP-16` C30291 |")
    A("")
    A("Separately, the write-path 500s in `ENV-DEFECTS.md` (§1 invoice creation, §2 customer update, ")
    A("§3 work-order line creation) are almost certainly known work-in-progress on this branch, but ")
    A("they are recorded with request ids in case they are not.")
    A("")
    (BATCH / "STAGED-CHANGES.md").write_text("\n".join(L) + "\n")
    print("wrote STAGED-CHANGES.md")

    # ---------------- RECHECK-ROWS.md ----------------
    R = []
    B = R.append
    B("# Re-check rows — SBC + SBR (to merge into the master `RECHECK-QUEUE.md`)")
    B("")
    B("> **STATUS: OPEN.** Standing Rule 49: the QA branch was declared NOT FINAL, so every verdict in")
    B(f"> `VERDICTS.md` is PROVISIONAL against build **`{BUILD}`** observed **{OBS}**.")
    B("> Re-run these when the build is declared final, when the app-version marker changes, or when")
    B("> the QA lead asks. **Do not merge these rows into the master queue file yourself if another")
    B("> worker is mid-write** — hand them to the coordinator.")
    B("")
    B("Re-read the marker with: `curl -s https://sv8582.qa.shopview.com/ | grep app-version`")
    B("")
    B("## A. Every case in scope (195) — the blanket provisional row")
    B("")
    B(f"All 195 SBC/SBR cases carry a verdict observed only against `{BUILD}`. On a new build, the")
    B("cheapest re-confirmation is to re-run the four capture tools in `tools/` and diff their JSON")
    B("against the copies in `evidence/`:")
    B("")
    B("```")
    B("node tools/observe_full.mjs sales-by-customer")
    B("node tools/observe_full.mjs sales-by-representative")
    B("node tools/observe_sbr_deep.mjs")
    B("node tools/capture_all_exports.mjs sales-by-customer && python3 tools/extract_pdf.py evidence/sales-by-customer/exports/*.pdf")
    B("node tools/capture_all_exports.mjs sales-by-representative && python3 tools/extract_pdf.py evidence/sales-by-representative/exports/*.pdf")
    B("```")
    B("")
    B("## B. Rows that MUST be individually re-confirmed (a verdict hangs on them)")
    B("")
    B("| Case | C-id | Verdict now | What to re-confirm |")
    B("|---|---|---|---|")
    must = {
     "SBC-CALC-03": "Re-run once invoiced-hours data exists: the +green / -red colouring on Inv. Hrs.",
     "SBR-CALC-01": "Re-run once hours exist: Inv. Hrs = hours invoiced - hours worked, half-up to one decimal.",
     "SBR-CALC-02": "Re-run once hours exist: colouring and rollups from unrounded deltas.",
     "SBR-CALC-03": "Re-run once hours exist: the negative clocked-unbilled case.",
     "SBR-CALC-09": "Re-run once hours exist: a clock-record edit after invoicing moves Inv. Hrs but not money.",
     "SBR-DEACT-02": "Re-run once invoice creation works: the counted, pluralised dialog headline and focus trap.",
     "SBR-DEACT-03": "Re-run: the type-YES gate (auto-focus, case-insensitive, Enter submits).",
     "SBR-DEACT-04": "Re-run: Cancel/X dismiss, Escape and outside-click do not.",
     "SBR-DEACT-05": "Re-run: valid submit locks the dialog then deactivates, keeping assignments.",
     "SBR-DEACT-06": "Re-run the dialog half; the report-credit half is already proven (F41).",
     "SBR-DEACT-07": "Re-run through the staff-administration UI, not the API — that was the correction made this pass.",
     "SBR-DEACT-08": "Re-run: a deactivation failure shows the error toast and leaves status alone.",
     "SBR-DEACT-09": "Re-run: a failed pre-check still opens the warning dialog.",
     "SBR-API-06": "Re-run: the pre-check request fires first and its count matches the dialog headline.",
     "SBC-TREE-11": "Re-check when a service invoice with no vehicle exists — no 'Parts Sales' bucket appeared at all.",
     "SBC-TREE-06": "Re-check the 'Parts Sales bucket always last' half — no such bucket existed.",
     "SBC-LBL-01": "Re-check the Unit # and plate fallbacks — every asset had a VIN.",
     "SBC-LBL-04": "Re-check when two assets share a label — no duplicate existed, so no (#1)/(#2) suffix.",
     "SBC-LOC-04": "Re-check the 'Multiple' cell — no SBC customer spanned two locations.",
     "SBR-ROW-03": "Re-check once a toggled-off or deleted rep holds an invoice — the (Inactive) tag was unobservable.",
     "SBR-CALC-07": "Re-check when a negative dollar value exists — accounting parentheses were unobservable.",
     "SBR-EXP-05": "Re-check when an invoice number exceeds 18 characters.",
     "SBR-EXP-07": "Re-check both clauses (negative money, (Inactive) tag).",
     "SBR-EXP-08": "Re-check the PDF font step-down thresholds — they were never forced.",
     "SBR-VIS-05": "Re-check the (Inactive) tag's contrast — only the (N) count was measurable.",
     "SBR-WO-01": "Re-check on a Part Sale WO and an imported WO — only a standard WO was driven.",
     "SBR-WO-05": "Re-check the customer-rep fallback leg — it only applies at invoice creation.",
     "SBR-WO-06": "Re-check the 'Unassigned' empty text on a customer with no rep.",
     "SBR-MOB-03": "Re-check the hover-only-tooltip clause — it could not be forced separately.",
     "SBC-EXP-09": "Re-confirm the PDF Date Range end date (off by one day this run).",
     "SBR-ASGN-01": "Re-check whether the Sales Representative Assignments export has been built.",
     "SBC-EXP-14": "Re-check on a bigger org whether the 10,000-row refusal message exists at all, AND whether the Expanded PDF still 500s at scale.",
     "SBR-EXP-15": "Same as SBC-EXP-14.",
     "SBC-API-05": "Same as SBC-EXP-14 - the cap-counted-first half is still unverified.",
     "SBR-API-05": "Same as SBC-EXP-14.",
     "SBC-EXP-15": "Re-check whether a zeroed totals row has been added to empty exports.",
     "SBR-EXP-16": "Same as SBC-EXP-15.",
    }
    for iid, what in must.items():
        r = by_id[iid]
        B(f"| `{iid}` | [{r['cid']}]({r['link']}) | {r['verdict']} | {what} |")
    B("")
    B("`SBR-ASGN-02` C30293, `SBR-ASGN-03` C30294, `SBR-ASGN-04` C30295, `SBR-ASGN-05` C30296 and")
    B("`SBR-ASGN-06` C30297 all re-check together with `SBR-ASGN-01`: none of them can be run until")
    B("the Assignments export exists.")
    B("")
    B("## C. Rows to re-confirm because they are DEVIATIONS that may just be unfinished work")
    B("")
    B("| Case | C-id | Read as | Re-confirm |")
    B("|---|---|---|---|")
    prov = {
     "SBC-DATE-04": ("not-built-yet", "whether shareable URL state has been added"),
     "SBC-PERS-06": ("not-built-yet", "same — depends on URL state existing"),
     "SBC-EMPTY-01": ("not-built-yet", "whether an empty-state message has been added"),
     "SBC-EMPTY-02": ("not-built-yet", "same"),
     "SBR-STATE-01": ("not-built-yet", "same, on the SBR side"),
     "SBR-STATE-04": ("not-built-yet", "whether an inline could-not-load message with Retry has been added"),
     "SBR-TOT-03": ("not-built-yet", "whether the mobile totals bar has been added"),
     "SBC-NAV-01": ("PO question", "whether SALES is the intended nav group"),
     "SBR-LOC-04": ("spec-vs-ruling", "whether the Location filter should hide for one-location users"),
    }
    for iid, (read, what) in prov.items():
        r = by_id[iid]
        B(f"| `{iid}` | [{r['cid']}]({r['link']}) | {read} | {what} |")
    B("")
    B("## D. Closing this queue")
    B("")
    B("The queue closes only when **100% of the rows above** have been re-verified against a settled")
    B("build and each has been flipped to CONFIRMED or CHANGED with fresh evidence (Rule 17 — no")
    B("sampling). A row that flips to CHANGED is a finding in its own right and gets reported, not")
    B("quietly corrected.")
    B("")
    (BATCH / "RECHECK-ROWS.md").write_text("\n".join(R) + "\n")
    print("wrote RECHECK-ROWS.md")


if __name__ == "__main__":
    main()
