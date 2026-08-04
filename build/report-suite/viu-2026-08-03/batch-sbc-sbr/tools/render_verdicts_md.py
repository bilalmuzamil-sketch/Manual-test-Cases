#!/usr/bin/env python3
"""render_verdicts_md.py — render VERDICTS.md from the verdict table + the findings table."""
import csv
import json
from collections import Counter, OrderedDict
from pathlib import Path

import verdicts as VZ

BATCH = Path(__file__).resolve().parents[1]
BUILD = "v3.4.1-0ed4433"


def main():
    rows = list(csv.DictReader((BATCH / "verdicts.csv").open()))
    tally = Counter(r["verdict"] for r in rows)
    per = {rep: Counter(r["verdict"] for r in rows if r["report"] == rep) for rep in ("SBC", "SBR")}
    L = []
    A = L.append

    A("# Sales By Customer + Sales By Representative — VIU verdicts (2026-08-04)")
    A("")
    A(f"> **Build observed: `{BUILD}`** (re-read at the start AND the end of this pass — unchanged).")
    A("> **THE BRANCH IS NOT FINAL**, so every verdict below is **PROVISIONAL** (Standing Rule 49) and")
    A("> carries a re-check obligation. See `RECHECK-ROWS.md`.")
    A("> **No TestRail writes were made.** Proposed edits are staged in `STAGED-CHANGES.md`.")
    A("")
    A("## 1. Scope reconciliation")
    A("")
    A("| | Count |")
    A("|---|---|")
    A("| Sales By Customer cases in `build/report-suite/testrail-id-map.csv` | **84** |")
    A("| Sales By Representative cases in the same map | **111** |")
    A("| **Total in scope** | **195** |")
    A("| Case bodies found in `build/report-suite/cases/` | **195 / 195** (none missing) |")
    A("| Cases given a definite verdict below | **195** |")
    A("| Cases left \"partly observed\" | **0** |")
    A("")
    A("This reconciles exactly against the 84 + 111 = 195 the task specified.")
    A("")
    A("## 2. Verdict tally")
    A("")
    A("| Verdict | SBC | SBR | Total |")
    A("|---|---:|---:|---:|")
    for v in ("VIU-Observed-PASS", "DEVIATION", "NOT-BUILT", "EXTERNAL-DEPENDENCY"):
        A(f"| **{v}** | {per['SBC'].get(v,0)} | {per['SBR'].get(v,0)} | **{tally.get(v,0)}** |")
    A(f"| **Total** | **{sum(per['SBC'].values())}** | **{sum(per['SBR'].values())}** | **{len(rows)}** |")
    A("")
    A("## 3. What each verdict means here")
    A("")
    A("- **VIU-Observed-PASS** — the build did what the case says, watched live this run, with the")
    A("  captured evidence named on the row.")
    A("- **DEVIATION** — the build differs from the case/spec. The governing spec text is quoted")
    A("  **verbatim** (Rule 25) and each row states whether I read it as a **defect** or as")
    A("  **not-built-yet on an unfinished branch**.")
    A("- **NOT-BUILT** — the thing does not exist. Each row states **what I observed that proves the")
    A("  absence** (a swept control list, a walked dataset), never merely \"I could not find it\".")
    A("- **EXTERNAL-DEPENDENCY** — a fully characterised blocker outside the report under test. In this")
    A("  batch all 9 are the same one, described in `ENV-DEFECTS.md`: the staff-administration")
    A("  deactivation dialog needs a **staff-backed rep holding customer assignments**, and both routes")
    A("  to create one (invoice creation, and the customer-update API) return **HTTP 500** on this")
    A("  branch. **Honest caveat: this is a defect in a *different area of this same branch*, not a")
    A("  third-party dependency** — it is labelled EXTERNAL-DEPENDENCY because the blocker sits outside")
    A("  the two reports, and it is the one soft spot in this pass.")
    A("")
    A("## 4. The five known spec-versus-ruling traps — how each resolved")
    A("")
    A("| Trap | Live result | Classification |")
    A("|---|---|---|")
    A("| Single-location users still see the **Location filter** (`C30216` SBR, and the same on SBC) | "
      "Confirmed live with a genuinely one-workplace user: the **column is correctly hidden**, the "
      "**filter is still shown**. The spec (S4-R12 / S21-R7) only ever hides the *column*. | "
      "**Not our error, and not clearly a build defect** — the build matches the SPEC and contradicts "
      "Chris's RULING. Per Rule 33 the ruling outranks the spec, so this is a **PO question**, not a "
      "case edit. |")
    A("| \"Sales Representative\" vs \"Sales Rep\" — a third spelling in the export (`C30285`, `C30286`, "
      "`C30315`) | The third spelling is **`Representative`**, in both SBR CSV header rows. The spec "
      "says `Sales Rep`. Separately the WO panel says **`Sales rep`** and the customer record says "
      "**`Sales Representative`** — three different labels for one field across three surfaces. | "
      "**Build deviation** on the export header; **case wording fixes** needed on the WO/customer cases. |")
    A("| Four columns missing from the **SBR Summary download** though the figures exist in the payload "
      "(`C30285`) | **Confirmed.** The Summary CSV omits `# Invoices`, `# Customers`, `Hrs Worked` and "
      "`Hrs Invoiced`, while the payload carries `invoice_count`, `hours_worked` and `hours_invoiced`. "
      "It also carries a Totals row that S14-R15 says it should not have. | **Genuine export defect.** |")
    A("| The date picker has **nine** options and no **Custom** button (`C30104`, `C30102`) | "
      "Confirmed: exactly nine presets — Last 12 Months, This Year, Last Year, This Quarter, Last "
      "Quarter, This Month, Last Month, This Week, Last Week — plus an inline calendar, a `Range: N "
      "days` readout and Apply. No Custom, no Today, no Yesterday. | **Our cases are stale** against "
      "the shared control; reword to the nine presets + inline calendar. |")
    A("| The **SBR export self-contradiction** (S14-R15/R16 enumerate headers without the Location "
      "column that S14-R20 adds) | **Settled with evidence.** Both SBR CSVs and both SBR PDFs carry "
      "the Location column, so **S14-R20 is implemented and S14-R15/R16's lists are the stale half of "
      "the spec**. Verbatim headers are in §5 below. | **Spec-internal contradiction**, newest wins "
      "(Rule 32): the build is right. Our two cases need Location adding. |")
    A("| **Print** is retired by ruling but still in the spec | A sweep of every button, menu item and "
      "link for `print` in text or `aria-label` returned an **empty list on both reports**. The export "
      "menu holds exactly four items. | **Confirmed: no Print control exists.** Matches the ruling. |")
    A("")
    A("## 5. The export headers, verbatim (the point the whole Location episode turned on)")
    A("")
    A("Captured from the downloaded files, not retyped from the spec.")
    A("")
    A("**Sales By Representative — Summary CSV**")
    A("```")
    A('Representative,Location,"Inv. Hrs","Labor Invoiced","Labor Margin","Parts Invoiced","Parts Margin",Margin,"Margin %",Subtotal')
    A("```")
    A("**Sales By Representative — Expanded CSV**")
    A("```")
    A('Representative,"Invoice #",Date,Customer,"Invoice Status",Location,"Hrs Worked","Hrs Invoiced","Inv. Hrs","Labor Invoiced","Labor Margin","Parts Invoiced","Parts Margin",Margin,"Margin %",Subtotal')
    A("```")
    A("**Sales By Customer — Summary CSV**")
    A("```")
    A('Customer,Location,"Inv. Hrs","Labor Invoiced","Labor Margin","Parts Invoiced","Parts Margin","Shop Supplies",Margin,"Margin %",Subtotal')
    A("```")
    A("**Sales By Customer — Expanded CSV**")
    A("```")
    A('Customer,Asset,"Invoice #",Date,Location,"Inv. Hrs","Labor Invoiced","Labor Margin","Parts Invoiced","Parts Margin","Shop Supplies",Margin,"Margin %",Subtotal')
    A("```")
    A("Every CSV opens with a UTF-8 BOM and the metadata line `\"Locations: All locations\"`, and ends")
    A("with a `Totals` row.")
    A("")
    A("## 6. PDF contents — the gap is closed")
    A("")
    A("The PDFs are **not** an external dependency. `pip install pypdf` plus `pip install cffi` (needed")
    A("to repair a broken system `cryptography` module that made `pypdf` fail to import) extracts the")
    A("text. `apt-get install poppler-utils` was tried first and failed with a 404 from the Ubuntu")
    A("mirror; `pypdf` made it unnecessary. Extractor: `tools/extract_pdf.py`.")
    A("")
    A("**Location column, per report per export — all four PDFs carry it:**")
    A("")
    A("| Export | Location column | Per-row location values | `Locations:` line |")
    A("|---|---|---|---|")
    A("| SBC Summary PDF (8 pages) | **YES** — header reads `Customer Location Inv. Hrs …` | YES | YES |")
    A("| SBC Expanded PDF (49 pages) | **YES** — `Customer Asset Invoice # Date Location …` | YES | YES |")
    A("| SBR Summary PDF | **YES** — `RepresentativeLocation Inv. Hrs …` (the two header words sit adjacent in the text layer) | YES | YES |")
    A("| SBR Expanded PDF | **YES** — `Representative Invoice # Date Customer Invoice Status Location …` | YES | YES |")
    A("")
    A("PDF header strip, in order: report title · organisation name · current workplace ·")
    A("`Date Range: <start> – <end>` · `Product Type: …` · (SBR) `Invoice Status: …` · `Locations: …`.")
    A("")
    A("**One PDF bug found while reading them:** the `Date Range` line prints an end date **one day")
    A("later** than requested — `end_date=2026-08-04` printed as `Aug 5, 2026`. Carried as a re-check")
    A("row and worth a ticket.")
    A("")
    A("## 7. Field review across all 195 (the QA lead's seven fields)")
    A("")
    fr = json.loads((BATCH / "evidence/field-review.json").read_text())
    A("| Field | Result across 195 |")
    A("|---|---|")
    A(f"| **Title** | all 195 OK; **0 over 80 characters** (longest {max(x['title_len'] for x in fr)}) |")
    A(f"| **Title vs its own expected result** | 190 coherent; **5 flagged** for a wording look (listed in `STAGED-CHANGES.md`) |")
    A("| **Preconditions** | all 195 present and numbered; all reachable as written except where the row's verdict says otherwise |")
    A("| **Steps** | all 195 present and numbered, executable in order with the build's real labels |")
    A(f"| **Expected results** | all numbered; **27 carry brittle closed enumerations** (\"exactly …\") that need a version-pinned anchor or scope-conditional wording (Rule 42) |")
    A("| **References** | **192 OK** (ticket + spec anchor, and every cited anchor still exists in the current spec); **3 need a spec anchor** — `SBC-EMPTY-04` C30184, `SBR-CALC-07` C30235, `SBR-CALC-08` C30236 |")
    A("| **Section** | **195 OK** — Rule 4 is satisfied: no API content sits outside an API-titled section, and all 11 cases in API sections are genuine API cases worded plainly per Rules 7/9 |")
    A("| **Notes** | **all 195 need the Rule-49 non-final-build marker adding** (`build v3.4.1-0ed4433, observed 2026-08-04`); `SBR-WO-04` C30313 additionally needs the Rule-24 tester note |")
    A("")
    A("An earlier, broader API detector flagged 7 cases as having API content outside an API section.")
    A("All 7 were **false positives** from ordinary English — \"delete it\", \"inclusive endpoints\",")
    A("\"post-click links\", font weight \"400\", \"get back to\". The detector was narrowed and the")
    A("finding withdrawn rather than reported.")
    A("")
    A("## 8. Per-case verdicts")
    A("")
    A("`verdicts.csv` carries the same rows with every field verdict as its own column.")
    A("Evidence paths are relative to this folder.")
    A("")
    for rep, label in (("SBC", "Sales By Customer"), ("SBR", "Sales By Representative")):
        A(f"### {label} ({sum(per[rep].values())} cases)")
        A("")
        areas = OrderedDict()
        for r in rows:
            if r["report"] != rep:
                continue
            areas.setdefault(r["area"], []).append(r)
        for area, items in areas.items():
            A(f"#### {area}")
            A("")
            A("| Case | C-id | Verdict | What was observed / why |")
            A("|---|---|---|---|")
            for r in items:
                note = r["note"].replace("|", "\\|").replace("\n", " ")
                A(f"| `{r['internal_id']}` | [{r['cid']}]({r['link']}) | **{r['verdict']}** | {note} |")
            A("")
            for r in items:
                flags = []
                for k, lab in (("f_title", "title"), ("f_title_vs_expected", "title-vs-expected"),
                               ("f_preconditions", "preconditions"), ("f_steps", "steps"),
                               ("f_expected", "expected"), ("f_references", "references"),
                               ("f_section", "section")):
                    if not r[k].startswith("OK"):
                        flags.append(f"**{lab}**: {r[k]}")
                if flags:
                    A(f"- `{r['internal_id']}` ({r['cid']}) field flags — " + " · ".join(flags))
            A("")
    A("## 9. The findings every verdict rests on")
    A("")
    A("Each was observed live this run; the path is the captured proof.")
    A("")
    A("| id | Finding | Evidence |")
    A("|---|---|---|")
    for k in sorted(VZ.F, key=lambda x: int(x[1:])):
        text, ev = VZ.F[k]
        A(f"| **{k}** | {text} | `{ev}` |")
    A("")
    A("## 10. Honest limits of this pass")
    A("")
    A("- **The invoiced-hours pipeline is empty.** `Inv. Hrs`, `Hrs Worked` and `Hrs Invoiced` are")
    A("  `0.0` on every row, in every range, across the whole org. Six cases (`SBC-CALC-03`,")
    A("  `SBR-CALC-01/02/03/09`) therefore could not have their arithmetic exercised and are recorded")
    A("  as DEVIATION with that reason stated in full, not as passes.")
    A("- **Nine cases hit the one characterised blocker** described in `ENV-DEFECTS.md`. I did not")
    A("  guess at them.")
    A("- **Some clauses inside otherwise-passing cases were not exercisable** because the data does not")
    A("  exist in this org — no negative dollar value, no duplicate asset label, no VIN-less asset, no")
    A("  invoice number over 18 characters, no \"Parts Sales\" bucket, no multi-location customer (so no")
    A("  `Multiple` cell on SBC), no inactive rep holding credit. Each is named on its row and carried")
    A("  into `RECHECK-ROWS.md` rather than quietly counted as verified.")
    A("- **One verdict was corrected mid-pass for honesty.** I first credited `SBR-DEACT-07` as a pass")
    A("  on the strength of an API toggle; that is not what the case describes, so it was moved to")
    A("  EXTERNAL-DEPENDENCY.")
    A("- **One reported defect was withdrawn.** The column selector looked broken until I found the")
    A("  menu row is not clickable and the control is the `q-toggle` beside it; toggling that removes")
    A("  the column correctly. The first reading was a test-technique artifact (Rule 12).")
    A("")
    (BATCH / "VERDICTS.md").write_text("\n".join(L) + "\n")
    print("wrote VERDICTS.md", len(L), "lines |", dict(tally))


if __name__ == "__main__":
    main()
