# RESUME — Report Suite live-observation pass, 2026-08-06

## Build marker in force
`v3.5-16cf83f` · last-mod **Wed, 05 Aug 2026 06:40:32 GMT** · etag `177c59546701e7810b894492dabc1423`
· `index.html` sha256 `67932a75b5a3a11d987b065c526d2d6dd38d0f47f76adeef61a6d341b249fa78`.
Read at the start of every batch and at the end. **Byte-identical every time — no redeploy.**

## Sources, re-fetched live 2026-08-06 (Rule 59)
SBC **15** · SBR **17** · PV **5** · TU **6** · WIP **9** · IV **4**. **None moved.**
Epic **SV-8582 = 105 children**, verified two ways with equal key sets, no paging remainder.

## Progress — RE-DERIVED, never copied forward

| | Count |
|---|---|
| Our cases | **476** (481 live under group 4281, incl. 5 foreign) |
| With a verdict established on `v3.5-16cf83f` | **175** |
| **Remaining** | **301** |

175 + 301 = 476. `REMAINING.txt` is regenerated from the population minus recorded verdicts every
batch — **do not copy it forward, re-derive it.** A case recorded `NOT OBSERVED` **stays** in
`REMAINING.txt`, because a reason is not a verdict.

**⚠️ COUNT BY CASE ID, NOT BY LINE.** As of this write `REMAINING.txt` happens to have 301 lines and
301 ids, but long titles have wrapped before and will again: `grep -oE 'C[0-9]{5}' REMAINING.txt |
sort -u | wc -l`.

**Inventory Value, Parts Velocity and Technician Utilization are all FINISHED** — every one of their
68 + 71 + 57 cases carries either a verdict or a written not-observed reason. The 42 of them still
listed in `REMAINING.txt` (IV 9, PV 26, TU 7) are the not-observed ones, each with its reason and its
`AUTOMATION: HOLD` marker already written.

## THE EXACT NEXT ACTION

**Sales By Customer (83), then Sales By Representative (109), then Work In Progress (67).**

Sales By Customer has already been **opened and characterised** by this session but **not one case
was adjudicated** — no verdict was recorded, deliberately, because a characterisation is not a
per-case observation. What is already established and can be reused without re-deriving:

- Report path `/reports/sales-by-customer`; data endpoint
  `GET /api/reporting/reports/sales-by-customer?range=custom&start_date=&end_date=&productType=all|service|parts&locations=&pagination[...]`
- Toolbar test-ids: `btn_dropdown_sbc_export`, `button_column_selection`,
  `date-range-selector_sbc_trigger` (+ `_preset_<slug>`, `_range_indicator`, `button_sbc_apply`),
  `select_sbc_product_type`, `select_sbc_customer_filter` (+ `input_search_sbc_customer_filter`,
  `item_sbc_select_all_customers`, `item_sbc_clear_all_customers`),
  `select_multiple_report_location_filter`, `button_sbc_expand_all`, `row_sbc_totals`,
  `button_sbc_expand_customer_<customerId>`,
  `button_sbc_expand_asset_<customerId>_vehicle:<vehicleId>`, `link_sbc_invoice_<id>`.
- Tab title is exactly `Sales By Customer - Report | ShopView`; page title `Sales By Customer`.
- Date picker holds the nine presets in the specified order, a calendar, a live "Range: N days"
  readout and Apply — **no Today, no Yesterday, no "Custom"**.
- Product Type holds exactly Parts & Service / Parts only / Service only, defaults to Parts & Service,
  and sends `productType=all|parts|service`. **The collapsed label re-cases to "Service Only" and
  "Parts Only"** — check that against S3-R2 before calling it either way.
- The export menu wording here is the **full** `Download Summary (PDF)` / `Download Expanded View
  (PDF)` / `Download Summary (CSV)` / `Download Expanded View (CSV)` — which is exactly what makes
  Technician Utilization's shorter wording the odd one (SV-8881).
- The column selector offers **nine** toggles, all on: Date, Inv. Hrs, Labor Invoiced, Labor Margin,
  Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %. **Location is NOT offered** —
  compare against S4-R12 before filing; it is the same shape as the Technician Utilization finding
  now filed as SV-8954, but SBC has its own requirement wording and would need its own ticket.
- A customer row renders the name at font-weight 700 and the `(n)` count at weight 400 in
  `rgb(97, 97, 97)` — **check that against S7-R4, which asks for #616161 at font-weight 600**.
- The totals row is labelled **"Totals"** — check the SBC spec for "Total" vs "Totals" (Inventory
  Value's equivalent became SV-8926).
- `$224.92` / `90.5%` on the first rows is **SV-8823**, which still reproduces.

Everything learned on Parts Velocity and Technician Utilization transfers:

- Money in the report API is in **cents**; the screen renders dollars. Hours arrive as **seconds**.
- **Presets are sent as `range=custom&start_date=&end_date=`**, never as a preset name.
- Export endpoint = the report path + `/export?variant=summary|expanded&format=csv|pdf` plus
  `columns=`. **Capture it from the product's own download menu first.**
- Menu item text is prefixed by its icon word (`check Both`), so match on the **suffix**.

## THE WORK IN PROGRESS EXPORT — the mechanism is solved, do not re-derive it

Work In Progress does **not** take the other five reports' date parameters. It uses `from=`/`to=`
with full ISO instants:

```
GET /api/reporting/reports/work-in-progress/export
    ?format=csv|pdf &tab=<Tab> &from=2026-08-02T00:00:00.000Z &to=2026-08-06T23:59:59.999Z
    &locations=<ids> &columns=<list> &sortBy=days_open &descending=true
```

Every tab **with** rows (4, 4, 2, 65) returns HTTP 500 on both formats; a tab with **0** rows returns
200 and a real file. It is the presence of rows, not size — that is SV-8907. Two cases still lack a
Rule-61 block: **C30500** and **C38918** — see the decisions section below.

## Two traps, and three more added this pass

1. **A 400 or 500 from an export is not automatically a defect.** The ~10,000-row refusal is the
   deliberate guard in epic story **SV-8591**. And the ~30-second PDF timeout is already
   **SV-8818**, which names five of the six reports. Search the epic and the existing tickets first.
2. **Read the header's own sort class alongside the rows, not the last request URL.** A snapshot four
   seconds after a header click still shows the previous order.
3. **A page needs longer than 8 seconds to settle.** Timesheet Activities showed a raw identifier and
   "no results" at 8 s and the correct technician and totals at 14 s. That nearly became a defect.
4. **Check a "colour-only" link against a neighbouring cell before calling it one.** The Total Hours
   link has no underline but is font-weight 600 against 400 — which satisfies the requirement.
5. **A label the case asserts may be the BUILD's label, not the spec's.** Two Technician Utilization
   cases asserted "Technician" and "All technicians" where the spec says "Filter by Technician" and
   "Select all". Read the requirement before trusting the case (Rule 57).

## Tooling that works (reuse, do not re-derive)
- `build/report-suite/full-viu-2026-08-05/tools/rs.py` — raw-cookie API + export downloader.
  **`-g` (globoff) is required** for `pagination[...]` bracket params. `rs.build_marker()`.
- `/tmp/rs-viu/boot.mjs` — Chromium straight through `$HTTPS_PROXY`; no MITM bridge. Exports
  `boot()` and `go(page,path,waitMs)` and returns a `netlog` of every `/api/` request.
  `boot({colorScheme:'dark'})` is **not enough for dark mode** — the app reads its own
  `localStorage.mode`; set `mode` to `dark` and reload.
- `/tmp/rs2/lib.mjs` — `rows`, `heads`, `lastUrl`, `menuPick`, `menuItems`, `save`. **Wrap every
  batch in try/catch and save incrementally.**
- `build/report-suite/full-viu-2026-08-06/tools/writer.py` — rebuilds an expected-results field and
  writes it with all three text fields and Rule-50 byte verification. **It REFUSES on a raw-markup
  case.** Keep that guard. **It splits the provenance block on the FIRST `\n---\n`, so a case with a
  second separator inside its body (C38915 was one) must be handled by hand** — see
  `/tmp/rs3/write/tu_special.py` for both that and the HTML-to-numbered-text conversion.
- `/tmp/rs3/jira/tu_tickets.py` — `create()` (Story Defect 10007, parent = story, priority Low,
  `relates to` link, no Product Area) and `verify()` (the 11 field checks).
- `/tmp/testrail/tr.py` — TestRail with byte verification built in.
- `/tmp/conf_fetch.py` — all six Confluence specs, live, with version numbers.
- `/tmp/jql.py` — the epic child count, two ways.

## Write ledger (this pass, cumulative)

TestRail **205 `update_case` over 193 distinct cases**, every one HTTP 200 + byte-verified,
30 fields compared each, 0 mismatches, 0 collateral. **0 add · 0 delete · 0 section · 0 run writes ·
0 results logged.** Jira **27 Story Defects created** (SV-8925–SV-8940, SV-8943–SV-8954), 0 edits to
anyone else's ticket. Application **read-only**.

## Marker census caveat

**THE ARITHMETIC GATE IS NOT CLAIMED TO PASS AND MUST NOT BE.** 175 of the 476 carry a verdict
established against `v3.5-16cf83f`; the other 301 carry markers inherited from earlier passes.

## STILL OWED — carried forward

- **12 raw-markup cases**, all now in Work In Progress: C30451, C30456, C30457, C30460, C30487,
  C30490, C30491, C30493, C30519, C30522, C30526, C30528. Convert to plain numbered text as you
  meet them (formatting only). C30392 was the thirteenth and is now plain text.
- **9 cases with no build line at all**: C30278, C38856, C43550, C43551, C43552, C43553, C43557,
  C43558, C43559. **C43552 was given one in batch 7**, so eight remain: C30278, C38856, C43550,
  C43551, C43553, C43557, C43558, C43559.
- **Permission cases across every report cannot be driven**: one session on this estate, shared with
  a sibling worker; `quick-login` and `switch-user` both rotate it.
- **A question for Chris Ward**: none of the six specifications mentions the ~10,000-row export cap,
  yet it is real, deliberate and in epic story SV-8591.
- **A decision for the QA lead**: **SV-8937** is written as a Parts Velocity defect but Technician
  Utilization prints the same one-day-late end date and the same "Start Date Range:" label. Widen
  that ticket, or file a second one? It was **not edited**.
- **C30500 and C38918** still carry no Rule-61 block. C30500's symptom (the Asset filter, SV-8908)
  was never driven. **C38918 asserts the over-cap refusal, which cannot be produced on this estate** —
  the biggest Work In Progress tab holds 65 work orders against a cap near 10,000 — so the honest
  marker for it is **`AUTOMATION: HOLD`**, not expect-fail. That change needs the QA lead's word
  because it lowers the ready-to-automate figure by one.

## Ticket filing — the standing authorisation STANDS

A mid-session instruction to stop filing was **retracted by the QA lead the same hour**, verbatim:
*"I take everything back which I said before... Do not take any action or change anything based on
the above which I said to you earlier."* **It was never in force. No case text was ever written under
it.** Defects are filed as found, in the Rule-52 shape, after a duplicate search and after trying to
disprove them. **Rule 51 is untouched: an API-only fault is never filed — it goes to `API-ASK.md`.**
