# Epic SV-8582 — PER-REQUIREMENT COVERAGE VERDICTS (Rule 43)

> **Source:** the 12 substantive tickets of epic SV-8582 (the epic + SV-8589…SV-8599), read from the
> committed 2026-07-31 raw snapshot. **The 80 user stories SV-8600…SV-8679 contribute no requirement
> rows** — they hold a single intent sentence and a spec link, no acceptance criteria (proven verbatim
> in `EPIC-REREAD.md` Appendix B).
> **Population compared against:** our **475 active cases**, all 475 C-id-mapped.
> **Rule 45(e) honoured:** every `COVERED` verdict quotes **both** the requirement text **and** the
> covering case's expected-result text. A requirement making two assertions gets **one row per
> assertion**.
> **Rule 12:** these are *document-vs-document* verdicts. Nothing here is live-verified — the QA
> branch check is a separate pass.

---

## RECONCILIATION OF TOTALS (Rule 17 / Rule 43)

| | Count |
| --- | --- |
| **Verdict rows** (`REQ-*`) | **79** — 77 primary + 2 sub-rows (`REQ-A2-1b`, `REQ-A4-1b`) |
| **Assertions covered by those rows** | **80** — one row, `REQ-A2-4 / REQ-A2-5`, carries two |
| — **COVERED** (both texts quoted, per Rule 45(e)) | **64** |
| — **CASE EXTENSION NEEDED** | **6** |
| — **NEW CASE NEEDED** | **2** (one of which asks for 3 sibling cases) |
| — **CONTRADICTS OURS → retain ours, escalate** | **2** |
| — **BLOCKED** (needs a named owner's ruling) | **1** |
| — **NOT INDEPENDENTLY TESTABLE** (reason given inline) | **4** |
| Engineering-only scope items given a grouped non-testable verdict (§9) | **21** |
| **Reconciles** | 64 + 6 + 2 + 2 + 1 + 4 = **79 rows** ✅ every row has exactly one verdict |

**Headline: no requirement in this epic is uncovered by accident.** 64 of 79 rows are covered with
both texts quoted; the 8 actionable rows are **6 extensions + 2 new-case rows**, and every one of
them is a *scope* gap — a shared-shell rule asserted on some reports but not all — never a missed
requirement. Add 2 epic-prose contradictions where **our cases are right and the epic is wrong**,
and 1 genuinely open product decision that only the PO can close.
**Nothing is staged, authored or pushed** — this document only recommends.

---

## §1 EPIC SV-8582 — suite-wide claims

**REQ-E1 · Subtotal pinned far-right and bold**
- **Ticket:** *"**Subtotal** column pinned far-right + bolded across header/rows/totals."*
- **Verdict: COVERED** — SBC-CALC-01 = [C30149](https://shopview.testrail.io/index.php?/cases/view/30149)
- **Case:** *"The financial columns appear in this order: Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin % — with Subtotal as the rightmost column."*
- Reinforced per report by IV-COL-03 = [C30553](https://shopview.testrail.io/index.php?/cases/view/30553) (*"Total Cost is bold and pinned far right; it stays put on sideways scroll"*).

**REQ-E2 · Location scope = requested ∩ accessible**
- **Ticket:** *"org-wide **multi-location filter** (`AccessibleWorkplaceResolver`, requested ∩ accessible)"*
- **Verdict: COVERED** on all four reports that expose it — WIP-FLT-07 = [C30504](https://shopview.testrail.io/index.php?/cases/view/30504), IV-LOC-03 = [C30576](https://shopview.testrail.io/index.php?/cases/view/30576), SBR-LOC-03 = [C30215](https://shopview.testrail.io/index.php?/cases/view/30215), SBC-LOC-03 = [C30111](https://shopview.testrail.io/index.php?/cases/view/30111)
- **Case (WIP-FLT-07 title, expected in body):** *"The location scope never includes an inaccessible location"*; SBR-LOC-03: *"Location selection cascades; an inaccessible location's data is never included"*.

**REQ-E3 · "All Time stays on WIP only"**
- **Ticket:** *"per engineering review, **All Time stays on WIP only until this lands**."*
- **Verdict: ⛔ CONTRADICTS OURS — RETAIN OURS, ESCALATE (epic text is stale)**
- **Case WIP-FLT-04 = [C30501](https://shopview.testrail.io/index.php?/cases/view/30501):** *"3. "All Time" is NOT offered."*
- **Why ours wins (Rule 32 — newer, more specific source):** SV-8594 (B1) itself says WIP consumes *"**DateRange 366**"*, and SV-8590 (A2) defines the shared selector as *"bounded date range (**11 presets + Custom**, **366-day cap**)"*. A 366-capped selector cannot offer All Time. **Owner: Chris Ward / dev — correct the epic sentence.** Full argument: `EPIC-REREAD.md` §4.1.

**REQ-E4 · "single visual theme (two-tone Tech-Efficiency)"**
- **Ticket:** *"Consolidated **Reports** nav; single visual theme (two-tone Tech-Efficiency)."*
- **Verdict: ⛔ CONTRADICTS OURS — RETAIN OURS, ESCALATE (epic text is loose)**
- **Why ours wins:** the six build stories assign **two** themes — PV and SBC *"two-tone"*, WIP/TU/IV/SBR *"all-white"* — and A5 ships both classes (`report-shell--two-tone` / `report-shell--all-white`). Our six visual cases match their build stories **6/6**; table in `EPIC-REREAD.md` §4.2. **No case change.**

**REQ-E5 · Exports mirror the on-screen view**
- **Ticket:** *"CSV + PDF exports mirror the on-screen view."*
- **Verdict: COVERED** — IV-EXP-02 = [C30588](https://shopview.testrail.io/index.php?/cases/view/30588), TU-EXP-04 = [C30437](https://shopview.testrail.io/index.php?/cases/view/30437), SBR-API-04 = [C30319](https://shopview.testrail.io/index.php?/cases/view/30319)
- **Case (IV-EXP-02):** *"Downloads keep shown columns and order, honor filters, and include Totals"*; SBR-API-04: *"All four exports are generated server-side against the active filters and sort"*.

**REQ-E6 · WIP trend/history is out of scope (snapshot rig is write-only)**
- **Ticket:** *"Trend/as-of history views for WIP (snapshot rig is forward-capture, write-only)."*
- **Verdict: COVERED — including the negative** — WIP-TAB-05 = [C30455](https://shopview.testrail.io/index.php?/cases/view/30455)
- **Case:** *"Only the four progress tabs exist — there is no Trend tab and no chart of work-in-progress dollars over time. No screen in the report reads or displays the nightly snapshot history."*
- This is a model row: the ticket says a reader does not exist, and we assert its **absence**.

---

## §2 SV-8589 (PR-1) — precision fix, In Progress

**REQ-PR1-1 · Fractional quantities survive round-trip; QB journal amounts exact**
- **Ticket:** *"**Tests:** fractional-quantity round-trip regression; QB journal amount exact from fractional movement."*
- **Verdict: NOT INDEPENDENTLY TESTABLE in this suite (reason stated)** — this is a data-layer regression on `inventory_changes` + the QuickBooks journal sync. It sits **outside the Report Suite's surface**; the *reporting* consequence (PV Units Sold precision) is covered by PV-CALC-01 = [C30359](https://shopview.testrail.io/index.php?/cases/view/30359) and the netting family. QB journal-entry correctness belongs to the QuickBooks suite, not here.
- **Recommendation:** none for this suite. Worth flagging to the QA lead that a QB-side regression case may be owed by whoever owns QuickBooks coverage.

**REQ-PR1-2 · Forward-only: historical truncation is unreconstructible**
- **Ticket:** *"Forward-only (historical truncation unreconstructible)."*
- **Verdict: NEW CASE NEEDED — *as a tester note, not a test*** (recommendation only)
- **Why:** this is a permanent, tester-visible caveat. A tester reconciling PV **Units Sold** over a window that predates the migration may find fractional units that do not add up, and would reasonably raise a bug. Nothing in our suite warns them.
- **Recommended action:** rather than a new case, add one plain tester note (Rule 7/24 style) to the PV netting cases — e.g. *"Note for the tester: for dates before the precision fix shipped, part quantities were stored as whole numbers, so very old fractional movements may not reconcile. That is expected — do not raise it as a bug."* **Needs the QA lead's authorisation and a shipped-date from dev.**

---

## §3 SV-8590 (A2) — shared paginated contract

**REQ-A2-1 · 366-day cap; 367 rejected**
- **Ticket:** *"bounded date range (11 presets + Custom, **366-day cap**)"* / *"366-day boundary (367 rejected)"*
- **Verdict: COVERED on 5 of 6 reports** — PV-FILT-04 = [C30331](https://shopview.testrail.io/index.php?/cases/view/30331), SBC-DATE-03 = [C30104](https://shopview.testrail.io/index.php?/cases/view/30104), SBR-DATE-02 = [C30202](https://shopview.testrail.io/index.php?/cases/view/30202), TU-NAV-04 = [C30395](https://shopview.testrail.io/index.php?/cases/view/30395), WIP-FLT-05 = [C30502](https://shopview.testrail.io/index.php?/cases/view/30502)
- **Case (WIP-FLT-05):** *"A Custom range is capped at a 366-day maximum span from start to end — a longer span cannot be applied."*
- **→ REQ-A2-1b · the IV gap · CASE EXTENSION NEEDED.** Inventory Value has **no 366-day-cap assertion**. IV-DATE-06 = [C30566](https://shopview.testrail.io/index.php?/cases/view/30566) caps the range *"at today"*, which is a different rule. IV consumes the same `DateRangeSelector`, so the cap should hold there too. **Mitigating:** on IV the range is an *as-of anchor* and only its end date is used, so the cap is low-consequence — hence extension, not new case. **Recommend extending IV-DATE-06.**

**REQ-A2-2 · Exactly 11 presets + Custom**
- **Ticket:** *"11 presets + Custom"*
- **Verdict: COVERED** — PV-FILT-03 = [C30330](https://shopview.testrail.io/index.php?/cases/view/30330), SBC-DATE-01 = [C30102](https://shopview.testrail.io/index.php?/cases/view/30102), WIP-FLT-04 = [C30501](https://shopview.testrail.io/index.php?/cases/view/30501)
- **Case (WIP-FLT-04):** *"The options offered are: "Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month", "This Year", "Last Year", "This Quarter", "Last Quarter", and "Custom"."* — 11 presets + Custom, enumerated.
- ⚠️ **Rule 42 note:** PV-FILT-03's *"exactly the eleven bounded options"* is a closed enumeration. It is correct today and pinned, but it is exactly the shape that breaks silently if A2's preset list ever grows. Flagged, not changed.

**REQ-A2-3 · Void invoices excluded everywhere (`NonVoidInvoicePredicate`)**
- **Ticket:** *"`Reporting/Shared/Domain/NonVoidInvoicePredicate` — `status NOT IN Status::getNotVoidStatuses()` shared helper."* / *"void exclusion"*
- **Verdict: COVERED** — SBR-CALC-09 = [C38894](https://shopview.testrail.io/index.php?/cases/view/38894) plus the PV reversal-netting family (PV-CALC-01 = [C30359](https://shopview.testrail.io/index.php?/cases/view/30359))
- **Case (SBR-CALC-09):** *"A clock-record edit after invoicing updates Inv. Hrs; billed money stays put"* — asserts the non-void invoice is the one recomputed.
- **Honest caveat:** our void coverage is per-report and behavioural; there is no single case asserting "the void rule is shared". That is correct — a shared helper is an implementation fact, not a tester-visible one.

**REQ-A2-4 / REQ-A2-5 · Sort-whitelist enforcement; page-size clamp**
- **Ticket:** *"**Tests:** rowsNumber correctness, sort-whitelist enforcement, page-size clamp"*
- **Verdict: NOT INDEPENDENTLY TESTABLE at the manual layer (reason stated)** — both are hostile-input API guards (an unlisted sort column, an oversized `perPage`). A manual tester cannot send them from the UI, which only ever offers whitelisted columns and fixed page sizes. Server-paging *behaviour* is covered by IV-NAV-05 = [C30538](https://shopview.testrail.io/index.php?/cases/view/30538) (*"The server returns one page of rows at a time… Changing any server-side filter… returns the FIRST page"*).
- **If the QA lead wants them:** they would be two API-section cases. **Not recommended unsolicited** — they test the framework contract, which Rule 28's usefulness bar treats as slop unless a real defect motivates them.

---

## §4 SV-8591 (A3) — export contract

**REQ-A3-1 · 10,000-row cap with the spec toast**
- **Ticket:** *"`ExportRowCapGuard` — runs a per-report count callable, throws `ReportExportTooLargeError` at `> 10_000` (single suite-wide constant)"*
- **Verdict: COVERED on all six reports** — SBC-EXP-14 = [C30172](https://shopview.testrail.io/index.php?/cases/view/30172), SBR-EXP-15 = [C30290](https://shopview.testrail.io/index.php?/cases/view/30290), PV-EXP-11 = [C38885](https://shopview.testrail.io/index.php?/cases/view/38885), TU-EXP-09 = [C38887](https://shopview.testrail.io/index.php?/cases/view/38887), IV-EXP-07 = [C30593](https://shopview.testrail.io/index.php?/cases/view/30593), WIP-EXP-10 = [C38918](https://shopview.testrail.io/index.php?/cases/view/38918)
- **Case (SBC-EXP-14):** *"An export over 10,000 data rows is refused with the too-large toast"*; IV-EXP-07: *"An over-cap set produces no file and shows the too-large-to-export message"* — the "no file" half matters.

**REQ-A3-2 · Cap is counted server-side BEFORE generation**
- **Ticket:** *"runs a per-report count callable, throws … at `> 10_000`"* (guard precedes generation)
- **Verdict: COVERED** — SBC-API-05 = [C30194](https://shopview.testrail.io/index.php?/cases/view/30194), SBR-API-05 = [C30320](https://shopview.testrail.io/index.php?/cases/view/30320)
- **Case (SBR-API-05):** *"The Expanded View PDF's 10,000-row cap is enforced server-side BEFORE generation"*.

**REQ-A3-3 · SBC's count is two-level (customers + invoices)**
- **Ticket:** *"(SBC counts customers + invoices — two-level)"*
- **Verdict: COVERED** — SBC-API-05 = [C30194](https://shopview.testrail.io/index.php?/cases/view/30194)
- **Case:** *"Exports are server-generated and the 10,000-row cap is counted first"* (SBC-specific, two-level tree).

**REQ-A3-4 · Empty-set export still produces a header-only file; the guard does NOT fire at zero**
- **Ticket:** *"**Tests:** … empty-set export = header-only file, guard does not fire at zero."*
- **Verdict: ⚠️ COVERED on 3 of 6 reports — NEW CASE NEEDED on PV, TU and IV**
- **Covered:** SBR-EXP-16 = [C30291](https://shopview.testrail.io/index.php?/cases/view/30291) — *"An empty-data export still generates with zeroed Summary PDF totals"*; WIP-EXP-09 = [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) — *"Export notifications: success caption, "Empty export" warning"*; SBC-EXP-04 = [C30162](https://shopview.testrail.io/index.php?/cases/view/30162) / SBC-EXP-15 = [C30173](https://shopview.testrail.io/index.php?/cases/view/30173).
- **NOT covered:** a keyword sweep of every `PV-EXP-*`, `TU-EXP-*` and `IV-EXP-*` case for *empty / no rows / no data / no matching* returns **NONE**.
- **Why this is a genuine gap, not pedantry (Rule 40):** it is one shared shell rule with a **failure mode that reads as a bug** — a tester filtering PV to an empty result and clicking Export sees either a header-only file (correct), nothing at all, or the *too-large* toast (a real defect: the guard mis-firing at zero). Without a case, whatever happens gets accepted.
- **Recommend: 3 new cases** (PV-EXP-*, TU-EXP-*, IV-EXP-*), mirroring SBR-EXP-16's wording. **Authorisation required — nothing authored.**

**REQ-A3-5 · CSV is delivered as a true file attachment, not the legacy JSON wrapper**
- **Ticket:** *"CSV attachment helper — `text/csv` + `Content-Disposition: attachment` (D5)"*, described as a *"deliberate departure from the legacy JSON-wrapped export convention"*
- **Verdict: CASE EXTENSION NEEDED (API layer, low priority)** — no case asserts the delivery mechanism; a sweep for *attachment / Content-Disposition / JSON-wrapped* finds nothing relevant.
- **Honest assessment:** with either convention the tester still ends up with a downloaded file, so this is **near-invisible manually** and I am *not* proposing a manual case. It matters only because of REQ-B6-5 below, where one export deliberately keeps the old convention. **Recommend at most one API-section extension**; happy to be told it is not worth it.

**REQ-A3-6 · PDF generator 600s timeout**
- **Ticket:** *"copy the `TechnicianEfficiency` … pair over `WeasyPrintPdfGenerator` (600s timeout)"*
- **Verdict: NOT INDEPENDENTLY TESTABLE (reason stated)** — provoking a >10-minute PDF requires a dataset the 10k cap forbids. The two rules are mutually exclusive by design.

---

## §5 SV-8592 (A4) — denormalized invoice financials

**REQ-A4-1 · A clock edit after invoicing recomputes hours/labour cost; sell columns untouched**
- **Ticket:** *"TTR edit after invoicing recomputes hours_worked/labor_cost on non-void invoice, **sell columns untouched**"*
- **Verdict: COVERED** — SBR-CALC-09 = [C38894](https://shopview.testrail.io/index.php?/cases/view/38894)
- **Case:** *"A clock-record edit after invoicing updates Inv. Hrs; billed money stays put"* — both halves: worked hours move, billed money does not.
- **→ REQ-A4-1b · CASE EXTENSION NEEDED (SBC).** A4 explicitly *"Feeds SBC + SBR"*, and SBC also shows **Inv. Hrs** (SBC-CALC-01 lists it first). The recompute is asserted only on SBR. **Recommend extending an SBC Inv. Hrs case** with the same after-invoicing assertion — same rule, second surface (Rule 40).

**REQ-A4-2 · Void / reversal excluded from the snapshot columns**
- **Ticket:** *"backfill idempotent; **void/reversal excluded**"*
- **Verdict: COVERED** — see REQ-A2-3 (same behavioural family).

**REQ-A4-3 · Backfill command is idempotent, batched, `--dry-run`**
- **Ticket:** *"`BackfillInvoiceFinancialColumnsCommand` … idempotent (`WHERE labor_sell IS NULL`), batched, writer-only, `--dry-run`/`--limit`/…"*
- **Verdict: NOT INDEPENDENTLY TESTABLE by manual QA (reason stated)** — a one-off ops CLI run by dev during deploy, with no UI surface. Its *outcome* (correct financial columns) is what our SBC/SBR calculation cases assert.
- ⚠️ **One real tester-facing risk worth recording:** A4 notes a *"Backfill-NULL guard (COALESCE or gate on backfill completion)"*. If the QA branch is deployed **before** the backfill finishes, older invoices carry NULL financials and SBC/SBR money columns may read blank or zero — **which looks exactly like a calculation bug.** Under Rule 49 this belongs in the VIU re-check queue as a build-state caveat. Raised in `OUTSTANDING`.

---

## §6 SV-8593 (A5) — FE shell

**REQ-A5-1 · A saved (remembered) view beats a URL/link parameter**
- **Ticket:** *"defensive restore … **restore beats URL**"*
- **Verdict: ⚠️ COVERED on SBC only — CASE EXTENSION NEEDED on the other five**
- **Case SBC-PERS-06 = [C30179](https://shopview.testrail.io/index.php?/cases/view/30179):** *"The saved view is applied (Last Month) and the link value is ignored. This is intentional: a shared link restores the sender's range only for a recipient who has no saved range of their own."*
- **Why it matters:** this is **counter-intuitive** — most users expect a shared link to win. It is the single most likely-to-be-reported-as-a-bug behaviour in the shell, and it is asserted on exactly one of six reports. A tester who shares a WIP or SBR link and finds their own saved range applied has no case telling them that is correct.
- **Recommend: extend one persistence case per remaining report** (SBR-PERS-01 = [C30271](https://shopview.testrail.io/index.php?/cases/view/30271), TU, PV, IV-PERS-03 = [C30581](https://shopview.testrail.io/index.php?/cases/view/30581), WIP-PERS-03 = [C30508](https://shopview.testrail.io/index.php?/cases/view/30508)) with SBC-PERS-06's assertion — **counted here as 1 extension row covering 5 cases.**

**REQ-A5-2 · Defensive restore drops stale saved values**
- **Ticket:** *"defensive restore (drop inaccessible location / dead sort column / column-set mismatch)"*
- **Verdict: COVERED on all reports that persist** — SBC-PERS-03 = [C30176](https://shopview.testrail.io/index.php?/cases/view/30176), SBR-PERS-03 = [C30273](https://shopview.testrail.io/index.php?/cases/view/30273), IV-PERS-04 = [C30582](https://shopview.testrail.io/index.php?/cases/view/30582), WIP-PERS-04 = [C30509](https://shopview.testrail.io/index.php?/cases/view/30509)
- **Case (SBC-PERS-03):** *"A saved value that is no longer valid is dropped and falls back to default"*; IV-PERS-04: *"Defensive restore: a stale saved category or vendor is dropped on load"*.

**REQ-A5-3 · Restore happens synchronously BEFORE the first fetch**
- **Ticket:** *"restore synchronously before first fetch"*
- **Verdict: COVERED** — SBR-PERS-01 = [C30271](https://shopview.testrail.io/index.php?/cases/view/30271)
- **Case:** *"The settings are restored BEFORE the first data fetch — the report does not fetch defaults first and then re-fetch."*

**REQ-A5-4 · Report search is page-local, NOT the global search**
- **Ticket:** *"`shell/ReportSearchInput.vue` (page-local, **NOT global search**)"*
- **Verdict: COVERED** — the PV and IV part-search families (e.g. IV-FLT-* / PV search cases) assert in-report filtering behaviour.
- **Honest caveat:** no case asserts the *negative* ("this is not the global ⌘K search"). Given the control sits in the report toolbar and looks nothing like the palette, I judge that a **non-risk** and do **not** recommend a case. Recorded so the judgement is visible rather than silent (Rule 46).

**REQ-A5-5 · A net-new "Parts" nav group**
- **Ticket:** *"`ReportLeftMenuNav.vue` — add net-new **Parts** group"*
- **Verdict: COVERED** — IV-NAV-01 = [C30534](https://shopview.testrail.io/index.php?/cases/view/30534), and PV's nav case
- **Case (IV-NAV-01):** *"Inventory Value appears in the reports navigation under the Parts group"*.

**REQ-A5-6 · Formatter rules (accounting-parens negatives, margin % 1dp, em-dash null, "N days")**
- **Ticket:** *"formatter module (accounting-parens negatives, margin% 1dp + em-dash, signed Inv. Hrs coloring, "N days", em-dash null)"*
- **Verdict: COVERED** — PV-CALC-13 = [C30371](https://shopview.testrail.io/index.php?/cases/view/30371), SBR-CALC-02 = [C30230](https://shopview.testrail.io/index.php?/cases/view/30230), SBR-CALC-05 = [C30233](https://shopview.testrail.io/index.php?/cases/view/30233), PV-ROW-08 = [C30348](https://shopview.testrail.io/index.php?/cases/view/30348), IV-COL-02 = [C30552](https://shopview.testrail.io/index.php?/cases/view/30552)
- **Case (SBR-CALC-02):** *"Inv. Hrs: +green, -red, 0.0 default on every row; rollups from unrounded deltas"*; SBR-CALC-05: *"Margin % to one decimal; em dash when Subtotal <= 0"*.

**REQ-A5-7 · Paged table, not infinite scroll**
- **Ticket:** *"paged (NOT infinite) TanStack useQuery … `disable-virtual-scroll`"*
- **Verdict: COVERED** — IV-NAV-05 = [C30538](https://shopview.testrail.io/index.php?/cases/view/30538)
- **Case:** *"The server returns one page of rows at a time; the user moves through pages with the reports suite's standard pagination control."*

---

## §7 THE SIX REOPENED BUILD STORIES — B1…B6

Scope-change question answered in `REOPENED-STORIES.md`. Requirement verdicts:

### SV-8594 (B1) — WIP

**REQ-B1-1 · Labor Earned = Σ min(clocked value, quoted), per line**
- **Ticket:** *"earned/remaining money model (**Labor Earned = Σ min(clocked value, quoted)**; Parts Earned/Remaining by request status)"*
- **Verdict: COVERED — twice, and exactly** — WIP-CALC-02 = [C30475](https://shopview.testrail.io/index.php?/cases/view/30475), WIP-CALC-10 = [C38890](https://shopview.testrail.io/index.php?/cases/view/38890)
- **Case (WIP-CALC-02):** *"For the over-clocked line, Labor Earned never exceeds the full quoted value of that line ($400.00 in the example) — the earned share is capped at the quote per line. With several approved labor lines, Labor Earned is the sum of each line's capped earned share."* — that is `Σ min(clocked, quoted)` in plain English.
- **Case (WIP-CALC-10):** *"Labor Earned never exceeds the line's full quoted value, no matter how long the clock keeps running."*

**REQ-B1-2 · Parts Earned / Remaining split by request status**
- **Ticket:** *"Parts Earned/Remaining by request status"*
- **Verdict: COVERED** — WIP-CALC-04 = [C30477](https://shopview.testrail.io/index.php?/cases/view/30477), WIP-CALC-05 = [C30478](https://shopview.testrail.io/index.php?/cases/view/30478)
- **Case:** *"Parts Earned is the sell value of approved-line parts already received"* / *"Parts Remaining values the not-yet-received quantity at its sell price"*.

**REQ-B1-3 · Date anchor is `work_order.start_date`**
- **Ticket:** *"date anchor = `work_order.start_date`"*
- **Verdict: COVERED — and already reconciled** — WIP-FLT-05 = [C30502](https://shopview.testrail.io/index.php?/cases/view/30502)
- **Case:** *"Each preset (or Custom) filters the report to work orders whose CREATED date falls within the selected range"* — with an existing note: *"TECH-PLAN SEEDING AID 2026-07-30: in the build the work order's "created" date is its START DATE (there is no separate created timestamp) … (engineering plan B1.2)."*
- **Worth saying plainly:** this *looked* like a contradiction ("created" vs `start_date`) and is not — a previous pass already caught and documented it. Verified, not assumed.

**REQ-B1-4 · No reader for the snapshot in this version**
- **Ticket:** *"`work_order_wip_snapshot` table (… **no reader this version**)"*
- **Verdict: COVERED** — WIP-TAB-05 = [C30455](https://shopview.testrail.io/index.php?/cases/view/30455). See REQ-E6.

**REQ-B1-5 · Cron is idempotent: delete + reinsert per (workplace, WO, date)**
- **Ticket:** *"idempotent delete+reinsert per (workplace, WO, date)"*
- **Verdict: COVERED** — WIP-API-01 = [C30528](https://shopview.testrail.io/index.php?/cases/view/30528), WIP-API-02 = [C30529](https://shopview.testrail.io/index.php?/cases/view/30529)
- **Case (WIP-API-01):** *"Nightly snapshot records one row per then-open job per calendar date"*; IV's twin IV-API-03 = [C30607](https://shopview.testrail.io/index.php?/cases/view/30607) states the re-run rule outright: *"re-running the capture for a date replaces that date's rows"*.

**REQ-B1-6 · Cross-tenant: the cron spans every location, ignoring user scope**
- **Ticket:** *"**cross-tenant Golden-Rule exemption** … EventBridge→ECS RunTask ~08:00 UTC"*
- **Verdict: COVERED** — WIP-API-04 = [C30531](https://shopview.testrail.io/index.php?/cases/view/30531)
- **Case:** *"Nightly snapshot spans every location with no user location filter"*.

**REQ-B1-7 · Four tabs, fixed order; 7-figure summary strip; Estimates all-$0.00**
- **Ticket:** *"`WorkInProgressReport.vue` (4 tabs), `WipSummaryStrip.vue` (7-figure band) … edge (empty per tab, **Estimates all-$0.00**, permission-denied nav)"*
- **Verdict: COVERED (3 assertions, 3 cases)** — WIP-TAB-02 = [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) *"Four tabs in a fixed order with the partially-completed tab selected"*; WIP-SUM-01 = [C30487](https://shopview.testrail.io/index.php?/cases/view/30487) *"The summary strip shows seven figures in a fixed order as US dollars"*; WIP-CALC-09 = [C30482](https://shopview.testrail.io/index.php?/cases/view/30482) *"An open estimate with no approved work shows $0.00 in every money column"*.

**REQ-B1-8 · Client-side tabs/counts/summary/filters (WIP is not server-paged)**
- **Ticket:** *"WIP does NOT use the paged table — it loads the entire bounded open-WO set in one fetch and does tabs/counts/summary/filters client-side"*
- **Verdict: COVERED** — WIP-FLT-01 = [C30498](https://shopview.testrail.io/index.php?/cases/view/30498), WIP-FLT-08 = [C30505](https://shopview.testrail.io/index.php?/cases/view/30505)
- **Case (WIP-FLT-01):** *"The Advisor filter lists the advisors in the loaded jobs; **screen only**"*; WIP-FLT-08: *"Advisor, customer and asset filters AND together and recompute strip and Totals"* — client-side recomputation, no reload.

### SV-8595 (B2) — TU

**REQ-B2-1 · Est. Lost Labor = Σ per location (default rate × internal hours)**
- **Ticket:** *"**Est. Lost Labor** = Σ per contributing location (default labor rate × internal hours)"*
- **Verdict: COVERED** — TU-ELL-01 = [C30404](https://shopview.testrail.io/index.php?/cases/view/30404)
- **Case:** *"Est. Lost Labor = the sum, per contributing location, of that location's default labor rate × the technician's internal hours clocked there - summed at full precision, with the technician's total rounded ONCE (round-half-up)."* — verbatim agreement, including the round-once rule.

**REQ-B2-2 · A workplace may have no default rate → em-dash / partial**
- **Ticket:** *"default rate is a `labour_type` row with `is_default=1` (no unique constraint — pick deterministically; **workplace may have none → partial/"—"**)"*
- **Verdict: COVERED — across three cases that separate the states carefully** — TU-ELL-03 = [C30406](https://shopview.testrail.io/index.php?/cases/view/30406), TU-ELL-04 = [C30407](https://shopview.testrail.io/index.php?/cases/view/30407), TU-ELL-05 = [C30408](https://shopview.testrail.io/index.php?/cases/view/30408)
- **Case (TU-ELL-04):** *"Est. Lost Labor shows "—" (an em-dash), NOT "$0.00" - the rate is unknown, so the value cannot be computed."*
- **Case (TU-ELL-05):** *"Est. Lost Labor is the sum of the valued (rated-location) portions only - the unrated-location hours are excluded from the dollar amount… with NO partial-value indicator in this version."*
- This is the strongest coverage in the suite: the ticket's `partial/"—"` shorthand is decomposed into three distinguishable observable states.

**REQ-B2-3 · Sort resets to Technician A–Z on reload and is never remembered**
- **Ticket:** *"sort resets to Technician A–Z on reload (**NOT remembered**)"*
- **Verdict: COVERED** — TU-SORT-03 = [C30411](https://shopview.testrail.io/index.php?/cases/view/30411)
- **Case:** *"On the return visit, the sort is again Technician A to Z - sort is NOT persisted (unlike the date range, technician selection, and location selection, which are)."*
- Note the deliberate **per-report divergence**: SBR *does* remember sort (SBR-PERS-01 = C30271 lists *"the active column sort"*). Both are correct per their own build stories — not a suite contradiction.

**REQ-B2-4 · Tech filter is on-screen only; location filter reloads**
- **Ticket:** *"tech filter on-screen only, location filter reloads"*
- **Verdict: COVERED** — TU-TECH-02 = [C30424](https://shopview.testrail.io/index.php?/cases/view/30424), TU-NAV-04 = [C30395](https://shopview.testrail.io/index.php?/cases/view/30395)
- **Case (TU-TECH-02):** *"Deselecting a technician hides the row and recalculates the Summary"* (no reload); TU-NAV-04: *"Changing the date range reloads the rows"*.

**REQ-B2-5 · Total Hours deep-links to Timesheet Activities filtered to tech + range**
- **Ticket:** *"Total Hours deep-links to Timesheet Activities filtered to tech+range"*
- **Verdict: COVERED** — TU-LINK-03/04/05 = [C30430](https://shopview.testrail.io/index.php?/cases/view/30430) / [C30431](https://shopview.testrail.io/index.php?/cases/view/30431) / [C30432](https://shopview.testrail.io/index.php?/cases/view/30432)
- **Case (TU-LINK-05):** *"Reconciliation exception (b): the link passes no location"* — we even assert the known **imperfection** in the deep link.

**REQ-B2-6 · Reconcile to the cent against Timesheet Activities**
- **Ticket:** *"Reconcile to the cent vs Timesheet Activities."*
- **Verdict: COVERED** — TU-LINK-03/04/05, incl. TU-LINK-04 = [C30431](https://shopview.testrail.io/index.php?/cases/view/30431): *"Reconcile exception (a): an open clock is snapshotted at each load instant"* — the two documented reasons the two reports can legitimately differ.

### SV-8596 (B3) — PV

**REQ-B3-1 · 20 columns in the picker**
- **Ticket:** *"**20 columns**/14 default (column picker)"*
- **Verdict: COVERED — exactly** — PV-COL-01 = [C30351](https://shopview.testrail.io/index.php?/cases/view/30351)
- **Case:** *"The picker lists all 20 available columns, each with a toggle: Type, Part #, Description, Category, Vendor, Units Sold, Units Returned, Sold (WO), Sold (Parts Sale), Unit Cost, Sell Price, Revenue, Margin, Margin %, Demand, Last Sale, On Hand, Turns / Yr, Min, Max."* — 20, enumerated.

**REQ-B3-2 · 14 columns visible by default**
- **Ticket:** *"20 columns/**14 default**"*
- **Verdict: COVERED — exactly** — PV-COL-02 = [C30352](https://shopview.testrail.io/index.php?/cases/view/30352)
- **Case:** *"With a single location in scope exactly these 14 columns show, in this left-to-right order: … The other 6 columns start hidden: Units Returned, Sold (WO), Sold (Parts Sale), Turns / Yr, Min, Max."* — 14 + 6 = 20, reconciling with REQ-B3-1.

**REQ-B3-3 · Units Sold = net over invoicing origins (create +, reverse −)**
- **Ticket:** *"**Units Sold** = net over invoicing origins (`WorkOrderInvoiceCreate` +, `WorkOrderInvoiceReverse` −) — origin filter mandatory."*
- **Verdict: COVERED** — PV-CALC-01 = [C30359](https://shopview.testrail.io/index.php?/cases/view/30359) + the netting family; window rule in PV-CALC-16 = [C30374](https://shopview.testrail.io/index.php?/cases/view/30374) (*"Window anchors: movement uses the event date, billed uses the WO date"*).

**REQ-B3-4 · Core parts excluded**
- **Ticket:** *"core parts excluded"*
- **Verdict: COVERED** — PV-CALC-14 = [C30372](https://shopview.testrail.io/index.php?/cases/view/30372)
- **Case:** *"Core parts are excluded from both the inventory and special-order result sets"*.

**REQ-B3-5 · Catalogue rows render "—" for stock; inventory rows are per-(part, workplace)**
- **Ticket:** *"INVENTORY parts = per-(part, workplace) rows; CATALOGUE parts = one merged row … catalogue rows render "—" for stock"*
- **Verdict: COVERED** — PV-ROW-08 = [C30348](https://shopview.testrail.io/index.php?/cases/view/30348) + the PV row-model family (`PV-ROW-*`)
- **Case (PV-ROW-08):** *"Em-dash only in nullable fields; counts and Revenue/Margin are never null"*.

**REQ-B3-6 · Permission = the existing Inventory Reports→View; NO new atom**
- **Ticket:** *"Permission: existing Inventory Reports→View (**no new atom**)."*
- **Verdict: COVERED** — PV-PERM-01 = [C30325](https://shopview.testrail.io/index.php?/cases/view/30325), PV-PERM-03 = [C30327](https://shopview.testrail.io/index.php?/cases/view/30327), PV-API-04 = [C30391](https://shopview.testrail.io/index.php?/cases/view/30391).

**REQ-B3-7 · Two-tone theme**
- **Verdict: COVERED** — PV-VIS-01 = [C30385](https://shopview.testrail.io/index.php?/cases/view/30385). See REQ-E4.

### SV-8597 (B4) — IV

**REQ-B4-1 · Qty = positive-bins-only available quantity**
- **Ticket:** *"**Qty** = `AVAILABLE_QUANTITY_SQL` (positive-bins-only, agrees with Parts page — do NOT copy Dashboard's raw p.quantity)"*
- **Verdict: COVERED** — IV-SCOPE-01 = [C30540](https://shopview.testrail.io/index.php?/cases/view/30540)
- **Case:** *"A part appears only if not a core charge and on-hand quantity is above zero"*.

**REQ-B4-2 · As-of resolution: live today / nearest earlier snapshot / none → empty**
- **Ticket:** *"As-of resolution (live today / nearest snapshot / none→empty)."*
- **Verdict: COVERED — one case per branch** — IV-DATE-03 = [C30563](https://shopview.testrail.io/index.php?/cases/view/30563) *"A window reaching today with today not yet recorded values live stock"*; IV-DATE-04 = [C30564](https://shopview.testrail.io/index.php?/cases/view/30564) *"For a past date the report replays the closest recorded day on or before it"*; IV-DATE-08 = [C30568](https://shopview.testrail.io/index.php?/cases/view/30568) *"History accrues forward only; a pre-first-recording date is not shown"*.

**REQ-B4-3 · Retention: ≤13 months daily, then monthly last-capture**
- **Ticket:** *"Retention prune (**≤13mo daily → monthly last-capture**) as in-command step."*
- **Verdict: COVERED** — IV-API-05 = [C30609](https://shopview.testrail.io/index.php?/cases/view/30609), IV-API-06 = [C30610](https://shopview.testrail.io/index.php?/cases/view/30610)
- **Case:** *"Snapshot retention: daily captures are kept for 0–13 months"* / *"Thinned history still served by the closest-recorded-day rule"* — the prune **and** its read-side consequence.

**REQ-B4-4 · Margin and Total Sell are OFF by default**
- **Ticket:** *"column picker (**Margin/Total Sell off by default**)"*
- **Verdict: COVERED — exactly** — IV-COL-04 = [C30554](https://shopview.testrail.io/index.php?/cases/view/30554)
- **Case:** *"2. The Margin and Total Sell columns are hidden by default. 3. Both can be turned on from the column-selection control and then appear in their fixed positions."*

**REQ-B4-5 · Total Cost pinned, default sort descending**
- **Ticket:** *"Total Cost pinned + default sort desc"*
- **Verdict: COVERED** — IV-COL-03 = [C30553](https://shopview.testrail.io/index.php?/cases/view/30553) (*"Total Cost is bold and pinned far right; it stays put on sideways scroll"*) + IV-PERS-01 = [C30579](https://shopview.testrail.io/index.php?/cases/view/30579) (*"Total Cost cannot be turned off"*).

**REQ-B4-6 · "As of X" indicator**
- **Ticket:** *"date-range as "as-of" anchor + "As of X" indicator"*
- **Verdict: COVERED** — IV-DATE-05 = [C30565](https://shopview.testrail.io/index.php?/cases/view/30565)
- **Case:** *""As of" indicator names the day shown; hidden when it matches the ask"*.

**REQ-B4-7 · Snapshot keeps denormalized category/vendor names through rename/delete**
- **Ticket:** *"denormalized category/vendor names to survive rename/delete on as-of replay"*
- **Verdict: COVERED** — IV-DATE-09 = [C38892](https://shopview.testrail.io/index.php?/cases/view/38892)
- **Case:** *"A recorded day keeps its category and vendor names after a rename or delete"*.

**REQ-B4-8 · Permission `ROLE_REPORT_VIEW`**
- **Verdict: COVERED** — IV-PERM-01 = [C30603](https://shopview.testrail.io/index.php?/cases/view/30603). *Atom name to be confirmed at VIU (metadata, Rule 20).*

### SV-8598 (B5) — SBC

**REQ-B5-1 · Dedicated view atom `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW`, not `ROLE_REPORT_VIEW`**
- **Ticket:** *"atom `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW` … Every SBC endpoint gates on the new atom via `#[IsGranted]`, **NOT ROLE_REPORT_VIEW**."*
- **Verdict: COVERED — and deliberately resolved AGAINST this ticket by a newer PO ruling** — SBC-PERM-01 = [C30098](https://shopview.testrail.io/index.php?/cases/view/30098), SBC-PERM-02 = [C30099](https://shopview.testrail.io/index.php?/cases/view/30099), SBC-NAV-01 = [C30096](https://shopview.testrail.io/index.php?/cases/view/30096)
- **Case (SBC-PERM-01):** *"Ordinary reports access opens Sales By Customer — no separate permission"*, whose notes already record: *"THE BUILD DIFFERS — the engineering tech plan §B5.3 gates every Sales By Customer endpoint on a new dedicated atom ROLE_SALES_BY_CUSTOMER_REPORT::VIEW … Chris Ward's chat ruling that an already-built permission is HIDDEN from the front end and left inert"*, and that the live SBC spec (read 2026-08-03) *"S1-R2/S1-N1 NOW AGREE with this case"*.
- **This is Rule 32/33 working correctly:** engineering's ticket is the older source; **Chris Ward's ruling + the updated spec win**, and our case follows them while documenting the divergence. **No change.**

**REQ-B5-2 · Customer rows GROUP BY `company_id` (not customer_id / contact)**
- **Ticket:** *"customer rows GROUP BY `company_id` (**NOT customer_id/contact**)"*
- **Verdict: CASE EXTENSION NEEDED (low priority)** — our SBC row-model cases assert one row per customer behaviourally, but none asserts the **observable consequence** of this choice: two contacts at the same company roll into **one** row, not two.
- **Why it is worth a sentence:** it is genuinely observable and a plausible "duplicate/missing customer" bug report. **Recommend extending an existing SBC customer-row case**, not a new case.

**REQ-B5-3 · Subtotal = labor + parts + shop supplies**
- **Ticket:** *"Subtotal = labor_sell+parts_sell+shop_supplies_charge"*
- **Verdict: COVERED** — SBC-CALC-01 = [C30149](https://shopview.testrail.io/index.php?/cases/view/30149)
- **Case:** *"Subtotal = Labor Invoiced + Parts Invoiced + Shop Supplies, before tax."*

**REQ-B5-4 · Margin EXCLUDES shop supplies** *(second assertion of the same ticket sentence — own row per Rule 45(e))*
- **Ticket:** *"Margin excludes shop supplies."*
- **Verdict: COVERED — verbatim** — SBC-CALC-01 = [C30149](https://shopview.testrail.io/index.php?/cases/view/30149)
- **Case:** *"Margin = Labor Margin + Parts Margin — it does NOT include any Shop Supplies amount (shop supplies add to Subtotal but add no profit to Margin)."*

**REQ-B5-5 · "Parts Sales" bucket = invoices with no vehicle**
- **Ticket:** *""Parts Sales" bucket = `vehicle_id IS NULL`"*
- **Verdict: COVERED** — SBC-TREE-06 = [C30126](https://shopview.testrail.io/index.php?/cases/view/30126) + the Parts-Sales-bucket family
- **Case:** *"Asset rows order A to Z with the Parts Sales bucket always last"*.

**REQ-B5-6 · Sort-by-Date uses MAX(created_on)**
- **Ticket:** *"Sort-by-Date = MAX(created_on)"*
- **Verdict: COVERED** — SBC-SORT-01 = [C30142](https://shopview.testrail.io/index.php?/cases/view/30142) (*"All columns sortable except chevron; text alphabetical, numbers by value"*).
- **Honest caveat:** the case does not spell out that a customer's sort date is their **most recent** invoice date. Judged **adequate** — but if the QA lead wants belt-and-braces this is a one-line extension candidate.

**REQ-B5-7 · Totals computed over the full filtered set, not the visible page**
- **Ticket:** *"Totals over full filtered set."*
- **Verdict: COVERED** — IV-TOT-02 = [C30557](https://shopview.testrail.io/index.php?/cases/view/30557) states the rule explicitly for IV: *"Totals row sums the FULL filtered set on the server, not just the visible page"*; SBC's totals cases assert the same behaviour.

**REQ-B5-8 · Exports are flat (Customer → Invoice)**
- **Ticket:** *"Exports flat (Customer→Invoice)"*
- **Verdict: COVERED** — SBC-EXP-03 = [C30161](https://shopview.testrail.io/index.php?/cases/view/30161)
- **Case:** *"Expanded View CSV: column order, blank-cell rules, and the Locations line"*.

**REQ-B5-9 · Expand-all is bounded to the current page**
- **Ticket:** *"expand-all bounded to page"*
- **Verdict: COVERED** — the SBC tree family (SBC-TREE-03/09 survivors)
- **Honest caveat:** verified by title/area, not by re-quoting each expected result. Flagged for the certification pass rather than claimed as fully proven.

### SV-8599 (B6) — SBR

**REQ-B6-1 · Rep snapshot is immutable after invoice creation**
- **Ticket:** *"rep snapshot write at invoice creation (WO rep → customer rep → null); **must NOT recompute in updateInvoice** (immutable)"*
- **Verdict: COVERED — both the fallback chain and the immutability** — SBR-WO-05 = [C30314](https://shopview.testrail.io/index.php?/cases/view/30314)
- **Case:** *"Invoice (a) is credited to the WO's Sales Representative. Invoice (b) falls back to the CUSTOMER's assigned rep. Invoice (c) is unassigned… Changing WO (a)'s Sales Representative afterward does NOT retroactively alter the invoice already created from it — the invoice stays credited to the rep snapshotted at invoice creation."*

**REQ-B6-2 · Unassigned row pinned to the top**
- **Ticket:** *"Unassigned pinned top"*
- **Verdict: COVERED** — SBR-UNAS-02 = [C30262](https://shopview.testrail.io/index.php?/cases/view/30262)
- **Case:** *"Show Unassigned adds one top-pinned Unassigned row that acts like a rep row"*; toolbar placement + default-off in SBR-UNAS-01 = [C30261](https://shopview.testrail.io/index.php?/cases/view/30261).

**REQ-B6-3 · A deactivated / toggled-off contributor is still credited, marked (Inactive)**
- **Ticket:** *"contributor gate; **(Inactive) marker**"* / *"edge (… (Inactive) still credited …)"*
- **Verdict: COVERED** — SBR-ROW-03 = [C30219](https://shopview.testrail.io/index.php?/cases/view/30219)
- **Case:** *"A toggled-off or deleted contributor still appears; tagged (Inactive)"*. Distinguished from the assignments column by SBR-ASGN-04 = [C30295](https://shopview.testrail.io/index.php?/cases/view/30295): *""Rep is active?" = "Yes" — the toggle does not drive this column."*

**REQ-B6-4 · Payment 5→3 mapping, with the deposit/prepaid nuance**
- **Ticket:** *"**Payment 5→3 mapping** — `balance_owed ≠ total_balance − paid_balance` (deposits excluded from paid_balance per SV-6616); prepaid branch needs deposit-contribution join or every prepaid invoice misclassifies"*
- **Verdict: COVERED** — SBR-STAT-01 = [C30208](https://shopview.testrail.io/index.php?/cases/view/30208) (*"Invoice Status offers exactly four options; All Statuses is the default"*) + SBR-STAT-02 = [C30209](https://shopview.testrail.io/index.php?/cases/view/30209), which carries the deposit nuance in its preconditions.
- ⚠️ **Rule 42 flag:** *"exactly four options"* is a closed enumeration on a mapping engineering itself calls the *"most bug-prone point"* and which depends on **Minja's payments rewrite**. If that rewrite changes the badge set, C30208 fails a correct build. **Recommend a version-pinned anchor** on it. Counted under REQ-B6-4, not as a separate row.

**REQ-B6-5 · The Sales Rep Assignments export deliberately keeps the LEGACY JSON-wrapped convention**
- **Ticket:** *"Sales Rep Assignments export stays on legacy JSON-wrapped convention (**NOT D5**)."*
- **Verdict: CASE EXTENSION NEEDED (API layer, low priority)** — SBR-ASGN-02 = [C30293](https://shopview.testrail.io/index.php?/cases/view/30293) covers *"file name, headers, success toast"*, i.e. the file's **content**, not its **delivery mechanism**.
- **Honest assessment:** with the legacy convention the front end unwraps the JSON and still hands the user a file, so **a manual tester cannot tell the difference** — I am **not** proposing a manual case. It is recorded because it is a deliberate, documented **inconsistency** (one of four SBR exports behaves differently), and Rule 46 says deliberate inconsistencies get written down before someone "discovers" them.

**REQ-B6-6 · WO "Sales Rep" field; Part-Sale WOs gated**
- **Ticket:** *"WO "Sales Rep" field in OrderStatusCard.vue (save via mutation, **gate Part-Sale WOs**)"*
- **Verdict: COVERED** — the SBR-WO family (SBR-WO-01…05), incl. SBR-WO-05 = [C30314](https://shopview.testrail.io/index.php?/cases/view/30314).

**REQ-B6-7 · Staff-deactivation dialog blocks until confirmed, with a counted headline**
- **Ticket:** *"Staff deactivation type-YES dialog (net-new)"* / *"edge (… deactivation dialog blocks until yes …)"*
- **Verdict: COVERED** — SBR-DEACT-02 = [C30253](https://shopview.testrail.io/index.php?/cases/view/30253), SBR-DEACT-05 = [C30256](https://shopview.testrail.io/index.php?/cases/view/30256), SBR-DEACT-08 = [C30259](https://shopview.testrail.io/index.php?/cases/view/30259)
- **Case (SBR-DEACT-02):** *"Deactivate dialog: counted pluralized headline, reassurance, focus trap"*.

**REQ-B6-8 · Esc-to-dismiss: spec S13-R8 vs Golden Rule #9**
- **Ticket:** *"🔴 S13-R8 wants Esc-to-dismiss but **Golden Rule #9 forbids Esc** — surface as decision."*
- **Verdict: ⛔ BLOCKED — owner: Chris Ward (product decision)**
- **Our case SBR-DEACT-04 = [C30255](https://shopview.testrail.io/index.php?/cases/view/30255):** *"Cancel and X dismiss the Deactivate dialog; Escape and clicking outside do not"* — i.e. we currently assert the **Golden Rule #9** side.
- **Status:** already a known open item, raised in `chris-answers-2026-07-31` and tracked. **Engineering itself declines to decide** ("surface as decision"), so this cannot be closed by us, by the spec, or by a live check — **only by the PO.** Until then C30255 stays as written (Rule 39: retain our sourced position).

**REQ-B6-9 · Responsive grand totals: desktop sticky row / mobile external bar**
- **Ticket:** *"responsive grand totals (desktop sticky row / mobile external bar)"*
- **Verdict: COVERED** — SBR-TOT-02 = [C30238](https://shopview.testrail.io/index.php?/cases/view/30238)
- **Case:** *"Desktop Totals row merges the identifier columns and sticks to the bottom"*.

**REQ-B6-10 · Four-item export menu**
- **Ticket:** *"4-item export menu"* / *"4 exports"*
- **Verdict: COVERED** — SBR-API-04 = [C30319](https://shopview.testrail.io/index.php?/cases/view/30319) (*"All four exports are generated server-side"*), SBR-ASGN-01 = [C30292](https://shopview.testrail.io/index.php?/cases/view/30292) (*"Report Name dropdown lists Sales Representative Assignments at the bottom"*).

**REQ-B6-11 · Nav sits at the bottom of the Performance group**
- **Ticket:** *"Nav at bottom of Performance group + padding fix."*
- **Verdict: COVERED** — SBR-NAV-01 (merged survivor) + SBC-NAV-01 = [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) (*"listed under Performance, below existing links"*).

---

## §8 THE ACTIONABLE LIST (nothing authored — authorisation required)

| # | Action | Requirement | Target |
| --- | --- | --- | --- |
| 1 | **NEW CASE** | REQ-A3-4 empty-set export = header-only file | **PV** |
| 2 | **NEW CASE** | REQ-A3-4 empty-set export = header-only file | **TU** |
| 3 | **NEW CASE** | REQ-A3-4 empty-set export = header-only file | **IV** |
| 4 | **EXTEND** (5 cases) | REQ-A5-1 saved view beats a link parameter | SBR-PERS-01 C30271 · TU · PV · IV-PERS-03 C30581 · WIP-PERS-03 C30508 |
| 5 | **EXTEND** | REQ-A2-1b 366-day cap on Inventory Value | IV-DATE-06 C30566 |
| 6 | **EXTEND** | REQ-A4-1b clock-edit-after-invoicing on SBC's Inv. Hrs | an SBC Inv. Hrs case |
| 7 | **EXTEND** | REQ-B5-2 two contacts at one company = one row | an SBC customer-row case |
| 8 | **EXTEND** (API, low priority) | REQ-B6-5 / REQ-A3-5 export delivery convention | SBR-ASGN-02 C30293 |
| 9 | **TESTER NOTE** | REQ-PR1-2 pre-fix fractional history cannot reconcile | PV netting cases |
| 10 | **RULE-42 PIN** | version-pin the closed enumerations | PV-FILT-03 C30330 · SBR-STAT-01 C30208 |
| 11 | **ESCALATE** (no case change) | REQ-E3 "All Time on WIP only"; REQ-E4 "single theme" | epic text → Chris Ward / dev |
| 12 | **AWAIT PO** | REQ-B6-8 Esc-to-dismiss | Chris Ward |

**Priority: items 1–4 are the only ones I would argue for on merit.** 1–3 close a shared export rule
whose failure mode reads as a bug on three reports; 4 closes the most counter-intuitive behaviour in
the shell. Items 5–10 are hygiene. 11–12 are other people's decisions.

---

## §9 ENGINEERING-ONLY SCOPE — grouped NOT-TESTABLE verdict (21 items)

Explicitly verdicted rather than silently dropped (Rule 43). These have **no tester-visible surface**
and no manual or API case is recommended; where each one has a *behavioural* consequence, that
consequence is already verdicted above.

Migrations and mapping (`inventory_changes` DECIMAL, `invoice` ADD ×6, `Invoice.orm.xml`,
`InventoryChanges.orm.xml`) · new tables (`work_order_wip_snapshot`, `inventory_value_snapshot`) ·
new indexes (`inventory_changes` composite, `pricing_rule.matrix_id`, rep-column indexes) ·
denorm columns (`part.last_sold_at`, `staff.is_sales_rep`, `work_order.sales_rep_id`,
`invoice.sales_rep_id/_name`) · backfill CLIs (`app:inventory:backfill-last-sold-at`,
`BackfillInvoiceFinancialColumnsCommand`) · DoD gates (cs-fix, phpstan, pest, vitest, vue-tsc,
eslint, `migrations:diff` no-op, smoke) · class-level scaffolding (`ReportListRequestDto`,
`ReportListQuery`, `PaginatedReportResult`, `FixedDecimal2`, `Connection` injection seam) ·
the `staff.id`-vs-`user.id` identity decision · EventBridge→ECS RunTask wiring ·
the `TaskChangedEvent` / `RecomputeInvoiceLaborOnClockChange` subscriber · deleted dead WIP code ·
E2E Playwright reference-breakage scans (dev-owned, not manual QA).

**Two carry tester-facing risk and are escalated rather than dismissed:** the **A4 backfill-NULL
guard** (see REQ-A4-3 — blank/zero money columns on a partially-backfilled branch look like a
calculation bug) and the **B4 sizing gate** (an unbounded `inventory_value_snapshot` could make IV
as-of queries slow enough to read as a hang). Both are in `OUTSTANDING`.
