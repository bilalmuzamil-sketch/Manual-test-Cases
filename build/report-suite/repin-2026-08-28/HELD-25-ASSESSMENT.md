# The 25 held "impacted" Group C cases — hand assessment — 2026-08-28

These 25 were held on 2026-08-26 for one reason: **each cites at least one requirement whose
text moved**, and the only thing that had cleared them was a lexical classifier already proven to
under-report (it missed 6 genuinely stale cases in the Group A set). A machine could not settle
them, so this pass read every one of them **against the live requirement text**.

**Method (Rule 12 — observed, never inferred).** For each case: fetch the case live, extract every
requirement anchor it cites, and put the **live** definition of that anchor next to the **held**
one with a word-level diff. Verdict comes from reading the case's own Expected Result against the
live definition — never from the build. Spec bodies already fetched on 2026-08-26 were reused; no
source was re-fetched. Working dossier: `dossier.py` (evidence regenerable, `/tmp` only).

**Important nuance that explains most of the verdicts.** The diff baseline is the *held* spec
(PV v8, WIP v15), but these cases are pinned at **v10 / v22 / v24**. So an anchor shows as
"changed" even when the change landed *before* the version the case was written against and the
case already reflects it. That is exactly why 22 of the 25 turn out to be **bookkeeping, not
content**.

---

## 1 · Verdict counts

| Verdict | Count | What happened to them |
|---|---|---|
| **Pin-only correction — content confirmed current against the live text** | **22** | **14 written and verified this pass**; 8 cannot take an API write and are queued in `NEEDS-UI-ROUTE.md` |
| **Genuine content change needed** | **2** | C30345, C30459 — **prepared and STOPPED AT THE BUTTON** (Rule 6: a content rewrite was not in the approved scope) |
| **Pin-only, but the pin appears twice** | **1** | C30381 — **STOPPED AT THE BUTTON**; the one-token swap would leave the case self-contradictory |
| **Already fully current (pin included)** | 0 | every one of the 25 cites a superseded version number |
| **Needs a PO decision** | 0 | the live text is unambiguous in all 25; nothing here needs Chris Ward |

**22 + 2 + 1 = 25. Nothing is unaccounted for.**

---

## 2 · The 2 that genuinely need a content change — STOPPED AT THE BUTTON

### C30345 — <https://shopview.testrail.io/index.php?/cases/view/30345>
*"Sticky header, all-left alignment on screen, and plain-text Type values"* · PV, pin 10 → 11

Its Expected Result says, in item 3:

> (The **exports** right-align numerics instead: a deliberate export-only difference.)

Live **PV v11 S3-R8** says:

> All columns — header label and cell data, including numeric and money columns — are left-aligned
> on screen. (**The PDF** right-aligns the numeric and money columns …)

The v11 change is precisely `PDF/CSV exports right-align` → `PDF right-aligns`. The case therefore
tells a tester that the **CSV** right-aligns numerics, which the current specification no longer
says. Corroborated by **S6-R10**, now scoped *"a deliberate PDF-only treatment"*, and by the sibling
case **C30382**, which already states the PDF-only scoping correctly.

**Prepared change:** item 3's parenthetical becomes *"(The PDF right-aligns numerics instead: a
deliberate PDF-only difference; the CSV carries no alignment at all.)"*, plus the pin 10 → 11.
**Not written** — this is a content rewrite, not a re-pin.

### C30459 — <https://shopview.testrail.io/index.php?/cases/view/30459>
*"While loading the standard indicator shows and old rows stay until data"* · WIP, pin 22 → 28

Its Expected Result says, in item 3:

> Both a **date-range** change and a location change reload the report's rows.

Live **WIP v28 S2-R6** says:

> The report reloads its rows when the user changes the **"as of" date** or the location selection.

WIP no longer has a date range at all — **S7-R8**: *"A date range is not offered on this report."*
The case sends a tester to change a control that does not exist.

**Prepared change:** item 3 becomes *"Both an 'as of' date change and a location change reload the
report's rows."*, plus the pin 22 → 28. **Not written.** This case also renders in an escaping
`markdown` container, so even once approved it must go through the **UI editor**, never the API.

---

## 3 · C30381 — pin-only, but the version is named twice — STOPPED AT THE BUTTON

<https://shopview.testrail.io/index.php?/cases/view/30381> · PV, pin 10 → 11

**Content is current.** It states that a null is an empty cell in the CSV and an em-dash in the PDF,
over the fields Avg Cost, Avg Sell, Margin %, On Hand, Turns / Yr, Last Sale, Min, Max — which is
live **S6-R7** verbatim, including the renamed Avg Cost / Avg Sell columns.

**But the specification version appears twice**: once in the provenance line, and once inside the
tester note — *"The current Parts Velocity report specification (version 10, updated 17 August
2026, per the SV-8823 correction) changes the CSV to leave those cells empty"*. The standard re-pin
swaps only the provenance token, which would leave the case citing **v11 in one sentence and v10 in
the next**. The note's date is stale too: **live PV v11 is dated 2026-08-20**, not 17 August.

**Prepared change:** both mentions to version 11 and the note's date to 20 August 2026. It is
bookkeeping, but it is two prose edits rather than one token, so it is held for your word.

---

## 4 · The 22 pin-only cases, with the evidence for each

"Current" below means: the case's own wording was read against the **live** definition of every
changed anchor it cites, and matches it.

### Written and verified this pass (14)

| C-id | Report | Pin | Changed anchor(s) cited | Why it is content-current | Link |
|---|---|---|---|---|---|
| C30348 | PV | 10→11 | S3-R9, S5-R5 | Asserts the em-dash on special-order On Hand / Turns / Yr / Min / Max and that counts and money totals are never null — live S5-R5 states both. The v8→v11 churn was the Unit Cost/Sell Price → Avg Cost/Avg Sell rename, which this case never names. | <https://shopview.testrail.io/index.php?/cases/view/30348> |
| C30365 | PV | 10→11 | S5-R5 | Last Sale = "N days", em-dash when never sold. Live S5-R5 tail: *"Last Sale → N days (e.g. 42 days ); null → — ."* Exact match. | <https://shopview.testrail.io/index.php?/cases/view/30365> |
| C30366 | PV | 10→11 | S5-R5 | Min / Max as whole numbers with an em-dash when unset. Live S5-R5: *"Min, Max → whole number; null → — ."* | <https://shopview.testrail.io/index.php?/cases/view/30366> |
| C30382 | PV | 10→11 | S3-R8, S6-R10 | Already states the alignment treatment is **PDF-only** and that the CSV is plain data — i.e. it already carries the v11 change that C30345 is missing. | <https://shopview.testrail.io/index.php?/cases/view/30382> |
| C30455 | WIP | 24→28 | S11-R7 | Says the report DOES read the nightly snapshot and only the trend view is unbuilt. Live S11-R7: *"The report reads the snapshot to reconstruct any earlier 'as of' day."* The case already discloses this correction against v22. | <https://shopview.testrail.io/index.php?/cases/view/30455> |
| C30501 | WIP | 24→28 | S7-R6, S7-R8 | Single "as of" day, defaults to today, capped at today, no presets, no range, shared with Inventory Value — live S7-R6 word for word; live S7-R8 confirms no range is offered. | <https://shopview.testrail.io/index.php?/cases/view/30501> |
| C30502 | WIP | 24→28 | S2-R6, S7-R7 | End-of-day position, reload on change, snapshot reconstruction for an earlier day — live S7-R7 and S2-R6. | <https://shopview.testrail.io/index.php?/cases/view/30502> |
| C30528 | WIP | 24→28 | S11-R1 | One snapshot row per open work order **per tab**, keyed by work order / tab / calendar date — that is the v28 wording of S11-R1, and the case is already written to it. | <https://shopview.testrail.io/index.php?/cases/view/30528> |
| C30530 | WIP | 24→28 | S11-R3, S11-R5 | **Neither cited anchor is in the changed set** once the case is read live; it was swept in by the citation-level filter. Captured Earned/Remaining match the on-screen figures to the cent. | <https://shopview.testrail.io/index.php?/cases/view/30530> |
| C30531 | WIP | 24→28 | S11-R4, S2-R1 | **Neither cited anchor is in the changed set.** Snapshot spans every location, same service-type and open-status conditions as the report. | <https://shopview.testrail.io/index.php?/cases/view/30531> |
| C30533 | WIP | 24→28 | S11-R6 | The only S11-R6 movement is whitespace inside the money literal (`" $0.00"` → `"$0.00"`), and the case already writes it the new way. | <https://shopview.testrail.io/index.php?/cases/view/30533> |
| C38918 | WIP | 22→28 | S9-R11 | Over-cap export refusal and the exact toast wording — live S9-R11 carries the same sentence. The only removal was "date range or" from the cap's trigger list, which the case never states. | <https://shopview.testrail.io/index.php?/cases/view/38918> |
| C38924 | PV | 10→11 | S5-R5 | Part-of-a-unit Units Sold kept to two decimals — live S5-R5 lists Units Sold under two decimals and never null. | <https://shopview.testrail.io/index.php?/cases/view/38924> |
| C43551 | WIP | 22→28 | S8-R7 | The S8-R7 change is `date range,` → `"as of" date,` in the remembered-settings list — and the case **already** says the "as of" date is remembered. | <https://shopview.testrail.io/index.php?/cases/view/43551> |

Each of the 14 got **one field sent** (`custom_expected`), the cited version bumped, and one
sentence appended before the AUTOMATION marker recording the 28 August re-check. Per-case evidence,
including the rendered-page verification, is in `REPINNED.jsonl`.

### Pin-only, but cannot take an API write — queued for the UI route (8)

Same verdict, blocked by the case's storage shape, not by its content. Full detail and the reason
per case in `NEEDS-UI-ROUTE.md`.

| C-id | Report | Pin | Changed anchor(s) | Why it is content-current | Blocked by |
|---|---|---|---|---|---|
| C30368 | PV | 10→11 | S5-R4a | Already uses the **new** column names (Avg Cost = COGS ÷ billed units, Avg Sell = Revenue ÷ billed units) — the rename is the whole of the S5-R4a change. | multi-block body (4) |
| C30369 | PV | 10→11 | S5-R4a | Uses Avg Cost / Avg Sell; reversal netting matches live S5-R4a *"Reversed/voided sales are excluded from these sums"*. | escaping container |
| C30370 | PV | 10→11 | S3-R9, S5-R4a | Independent null triggers — Avg Cost/Avg Sell null on billed units ≤ 0, Margin % null on Revenue ≤ 0 — is live S5-R4a's null-rule column exactly. | escaping container |
| C30371 | PV | 10→11 | S5-R5 | Its per-column format list reproduces live S5-R5 including the Avg Cost / Avg Sell names. | escaping container |
| C30464 | WIP | 24→28 | S2-R4, S3-R4 | The line-state model — a mixed work order appears in its status tab **and** Estimates, at most two tabs — is live S2-R4; the started-boundary matches live S3-R4. The case even quotes S2-R4's live text. | multi-block body (3) |
| C30485 | WIP | 22→28 | S4-R9 | *"The Asset column sorts by the Unit #"* is unchanged; the v28 movement is an **addition** (see the coverage gap below), not a contradiction. | escaping container |
| C38916 | WIP | 22→28 | S7-R14 | Each row names its own work order's location and never reads "Multiple" — live S7-R14. The removed text was the old date-range narrative, which this case never mentions. | escaping container |
| C43836 | WIP | 22→28 | S9-R10b | The CSV repeats the PDF header's filter lines, "as of" date and Locations included — live S9-R10b, which the case already words the new way. | escaping container |

---

## 5 · Two things this reading turned up that are NOT re-pins

**(a) A coverage gap on WIP S4-R9 — no case covers it.** v28 added to S4-R9:

> Rows with no unit number sort last on an ascending sort (and first when the sort is reversed);
> they are never interleaved with the numbered rows (Chris, 2026-08-13).

C30485 covers the sort key but not this null-ordering rule, and no other case asserts it. That is a
**new case**, and **Rule 62's creation hold is active**, so nothing was created. Raising it here.

**(b) C30528's stale-classifier blind spot is real and now has a second example.** Both the WIP
S4-R9 addition and the PV S5-R4a rename are **insertions/replacements that leave nothing removed to
match on**, which is the same failure mode that produced the 6 false negatives on 2026-08-26. The
classifier should not be trusted to clear a case on its own; this pass did not use it.

**(c) C38918 contradicts itself internally** (pre-existing, not caused by any spec change): the
tester note says *"the biggest single tab holds about 114 work orders"* while its AUTOMATION HOLD
reason says *"largest is Estimates at ~1067 rows"*. Both cannot be right. Out of scope for a re-pin;
flagged for a later correction pass.

---

## OUTSTANDING — what I need from you

1. **C30345 and C30459 — approve the content corrections?** Both are prepared above, both are
   unambiguous against the live spec, neither is written.
2. **C30381 — approve the two-place version + date correction?** It is bookkeeping, but it edits
   prose in two places rather than swapping one token.
3. **The 8 pin-only cases in section 4** — approve the TestRail UI editor route (the route proven on
   the 71 repaired cases). The API is barred on all 8 by the case's own storage shape.
4. **The WIP S4-R9 null-unit-number sort rule has no test case.** The Jira/TestRail creation hold
   (Rule 62) is still recorded as active — has it lifted? If it has, may I write this one case?
5. **C38918's internal 114-vs-1067 contradiction** — want it corrected in a later pass?
