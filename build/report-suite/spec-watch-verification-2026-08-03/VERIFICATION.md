# Report Suite — SPEC-WATCH LIVE VERIFICATION · 2026-08-03

**What this is.** The QA lead ruled, verbatim, **2026-08-03**: *"There is nothing due tomorrow, if
something he was supposed to do should have been done by now, you need to check. If that has not
been done consider it not done."* So every item on `SPEC-WATCH-2026-07-28.md` was re-checked
**against the LIVE Confluence spec text read today** — not against our own note, and not against our
local mirrors. Every "current spec text" quote below was **actually fetched this run** and is
verbatim. Nothing is inferred (Standing Rule 12).

**Headline: 5 of 13 items DONE · 8 NOT DONE · 1 partly.** Only **one** page has moved since our
2026-07-31 capture — **SBC** — and the edit it received is the **one-permission correction**, which
is good news for four of our cases. Everything else Chris owed on 2026-07-29 is **still owed**.

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31)

| Spec | pageId | Live `lastModified` (read 2026-08-03) | Version | Our mirror (`spec-current-2026-07-31/`) | Mirror verdict |
|---|---|---|---|---|---|
| **SBC** Sales By Customer | 577634305 | **Jul 31, 2026** | **v13** — the in-body Change Log gained a **2026-07-31** row | **v12**, captured 2026-07-29T06:44:06Z | ❌ **STALE — one version behind** |
| **SBR** Sales By Representative | 585629698 | Jul 29, 2026 | v15 | v15, 2026-07-29T06:38:33Z | ✅ CURRENT |
| **PV** Parts Velocity | 620888066 | Jul 29, 2026 | v4 | v4, 2026-07-29T06:41:59Z | ✅ CURRENT |
| **TU** Technician Utilization | 641400833 | Jul 29, 2026 | v5 | v5, 2026-07-29T06:45:11Z | ✅ CURRENT |
| **WIP** Work In Progress | 703660034 | Jul 29, 2026 | v6 | v6, 2026-07-29T06:33:58Z | ✅ CURRENT |
| **IV** Inventory Value | 720142338 | Jul 29, 2026 | v3 | v3, 2026-07-29T06:32:54Z | ✅ CURRENT |

**Other sources:** epic **SV-8582** — not re-checked this run (out of this task's scope; Rule 37 Tier
1 belongs to whoever next touches the epic). **Designs — N/A**, Report Suite is spec-only, no Figma,
no Rule-35 fetch queue. **Tech plan** — held (`tech-plan-2026-07-29/`), not re-fetched this run.
**Live build** — **STILL ABSENT**; no QA branch, so nothing below is build-verified.

### ✅ SUPERSEDED LATER THE SAME DAY — read the ADDENDUM

`ADDENDUM-full-versions-SBC-delta-epic.md` **removes limit 1 below and completes the picture**:
`mcp__Atlassian__fetch` with a page **ARI** returns `metadata.version`, so the **TRUE Confluence
versions** are now on record — **SBC 13 · SBR 15 · PV 4 · TU 5 · WIP 6 · IV 3** — and **five of six of
our mirrors are the SAME VERSION as live** (only SBC is stale, by exactly one). The addendum also
carries the **FULL structural SBC v12→v13 delta** (3 permission text changes and nothing else, so
items 1a/2/3/10 are CONFIRMED against v13), the **Rule-43 per-requirement verdicts**, the **Rule-40
surface matrix**, and the **epic SV-8582 Tier-1 result** (7 status changes vs our ingest). Read it with
this file.

### ⚠️ TWO HONEST LIMITS ON THE ABOVE (limit 1 now WITHDRAWN — see above)

1. **The numeric Confluence version is NOT readable with the tools available this session.**
   `getConfluencePage` and `searchConfluenceUsingCql` both return **`lastModified` (date only)** and
   no `version` object; the earlier passes read version numbers through the Confluence REST API with
   session cookies, and **`/tmp/fd-tickets/all-cookie-header.txt` no longer exists** (`/tmp` is
   ephemeral). So the version column above is derived from **(a)** the live `lastModified` date and
   **(b)** the in-body Change Log's newest row. Standing Rule 31 warns that the in-body version field
   lies — **the mitigation used here is the `lastModified` date, which is Confluence's own metadata
   and cannot be typed by an author.** *To get true version numbers again, re-supply Confluence
   session cookies.*
2. **The capture pipeline changed, so a byte-diff against 2026-07-31 is not possible.** The 07-31
   mirrors were produced from REST storage-format via `html2text`; today's are MCP markdown (and
   `html2text` is not installed in this container). Verification below is therefore done **by
   requirement text**, quoted side by side — which is the stronger check anyway (Rule 45(e)).

### The new dated capture (mirrors refreshed, nothing overwritten)

`live-capture-2026-08-03/` holds today's live bodies for **SBC** (the stale one — this is the
refresh), **SBR** and **PV**. The 2026-07-31 captures are **untouched**. **TU, WIP and IV were read
LIVE and IN FULL this run** and every quote below comes from that read, but their bodies are **not
re-written to disk**: their live `lastModified` (2026-07-29) matches the version already captured on
2026-07-31, so those three mirrors are provably current and re-capturing them would add nothing.
That is a deliberate, stated decision, not an omission (Rule 46).

---

## THE VERIFICATION TABLE

Legend: **DONE** = his edit is in the live spec · **NOT DONE** = it is not (per the QA lead's ruling,
that is the verdict — no grace period).

| # | Item — what Chris agreed to put in the spec | CURRENT LIVE SPEC TEXT (verbatim, fetched 2026-08-03) | Verdict | Affected cases | What we do about it |
|---|---|---|---|---|---|
| **1a** | Asset identifier **VIN → Unit # → plate** — **SBC** | SBC Change Log, 2026-07-29 row: *"Assets identified by VIN (VIN → Unit # → plate → \"Unknown Asset\")…"* | ✅ **DONE** | SBC-LBL-01 [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) | Nothing. Closed 2026-07-31, re-confirmed today. |
| **1b** | Asset identifier — **WIP** (he answered *"A is the correct answer"* on 2026-07-29 = VIN chain for WIP too) | WIP **S4-R7**: *"The **Asset** column is a two-line cell: **the unit number on the first line in bold**, and the vehicle identification number on the second line in a smaller, muted style."* · **S4-R9**: *"The Asset column **sorts by unit number**."* · **S4-R8**: *"When a work order has no unit number, the Asset cell's first line shows \"(no unit #)\"…"* · §4 Terminology: *"**Asset** → The vehicle or unit the job is for, identified by its unit number and its vehicle identification number."* | ❌ **NOT DONE** — still **unit-number-first**, four places | WIP-COL-05 [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) · WIP-FLT-03 [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) · WIP-SORT-03 [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) · WIP-EXP-07 [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | **Our cases follow his 2026-07-29 answer (VIN first) and are CORRECT per Rule 32** — the newer authoritative source wins. **No case change.** Chase the spec edit: this is the one where **he believed he had already made it and had not** — now twice. |
| **2** | **SBC Print removed** | SBC: *"### Story 16: (removed — Print retired)"* + note *"The Print action that previously occupied this story has been removed from this report."* | ✅ **DONE** | SBC-EXP-01 [C30159](https://shopview.testrail.io/index.php?/cases/view/30159), SBC-EXP-14 [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) | Nothing — **but see NEW FINDING 1 below**: two other SBC requirements still list Print as an export. |
| **3** | **SBC Summary / Expanded downloads** (four menu items) | SBC Change Log 2026-07-29: *"split exports into Summary and Expanded (CSV + PDF, four menu items)"* | ✅ **DONE** | SBC-EXP-16 [C38856](https://shopview.testrail.io/index.php?/cases/view/38856), SBC-EXP-01 [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) | Nothing. |
| **4** | **Location filter HIDDEN when the user has ≤1 location** (his Q1 answer 2026-07-31 = **A, hidden**) | **All four still say the opposite.** SBR **S21-N1**: *"A single-location user **still sees the filter** with one selectable location; behavior is unchanged from single-location use."* · TU **S9-N1**: *"A user with access to only one location **still sees the filter** with a single selectable location…"* · IV **S7-N1**: *"A user with access to only one location **still sees the filter** with a single selectable location."* · PV **S2-E4**: *"A user with access to only one location **still sees the Location filter** with a single selectable location…"* | ❌ **NOT DONE** — the spec text **actively contradicts his own later ruling**, on four pages | SBR-LOC-04 [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) · TU-LOC-05 [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) · IV-LOC-04 [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) · PV-FILT-13 [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) | **Our four cases follow his Q1=A answer (hidden) and are CORRECT per Rule 32. No case change.** This is the **highest-risk open item**: a dev reading the spec will build the opposite of what we test. |
| **5** | **Per-row Location column** in the all-locations view | Ratified on all six. e.g. TU **S9-R9**: *"When the selected scope spans **more than one location**, the report shows a per-row **Location** column; when the scope is a single location, the column is hidden."* · SBC **S4-R12** and IV **S7-R6** identical in substance | ✅ **DONE** | SBC-LOC-03 [C30111](https://shopview.testrail.io/index.php?/cases/view/30111), SBR-LOC-03 [C30215](https://shopview.testrail.io/index.php?/cases/view/30215), PV-FILT-10 [C30337](https://shopview.testrail.io/index.php?/cases/view/30337), TU-LOC-01 [C30442](https://shopview.testrail.io/index.php?/cases/view/30442), IV-LOC-01 [C30574](https://shopview.testrail.io/index.php?/cases/view/30574) | Nothing. |
| **6** | **Nav placement — TU below the existing links** ("additive, not interruptive") | TU **S1-R1**: *"The report appears in the reports navigation under the **Performance** group, labeled \"Technician Utilization\"."* — the group is named; **no "below existing / additive" wording anywhere** | ⚠️ **NOT DONE (partial)** — group ✅, ordering ❌ | TU-NAV-01 [C30392](https://shopview.testrail.io/index.php?/cases/view/30392) | Our case asserts *"below existing report links"* from the **video** (C4, 01:18–02:05). Keep it (Rule 32) and get one sentence into S1-R1. **Low risk.** |
| **7** | **Catalogue rename → "Special Order"** | PV §2: *"Parts are split into two types: **Inventory** … and **Special Order** (parts sourced from a vendor on a per-job basis)."* | ✅ **DONE** | PV-FILT-01 [C30328](https://shopview.testrail.io/index.php?/cases/view/30328), PV-FILT-09 [C30336](https://shopview.testrail.io/index.php?/cases/view/30336), PV-ROW-05 [C30345](https://shopview.testrail.io/index.php?/cases/view/30345), PV-EXP-08 [C30382](https://shopview.testrail.io/index.php?/cases/view/30382) | Nothing. |
| **8** | **WIP asset dropdown = native style + toggle** | WIP **S7-R4**: *"The toolbar has an **Asset** filter, a searchable type-ahead multi-select listing the assets present in the loaded jobs."* — **no** native-style or toggle wording | ❌ **NOT DONE** | WIP-FLT-03 [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) (note only) | **Zero case impact** — no case asserts either style. Lowest priority of the eight. |
| **9** | **Customer card reads "Sales Representative"** (his Q5 answer = A, full word everywhere) | SBR **S19-R7**: *"The customer record's left-panel sidebar shows a single \"**Sales Rep**\" row with the customer's assigned rep; when none is assigned it renders \"Unassigned\"."* Also **S19-R1/R8** (*"Sales Rep" selector / accessible name*) and both CSV header lists (**S14-R15/R16**) still use `Sales Rep` | ❌ **NOT DONE** | SBR-WO-06 [C30315](https://shopview.testrail.io/index.php?/cases/view/30315) · plus the export header lists in SBR-EXP-10 [C30285](https://shopview.testrail.io/index.php?/cases/view/30285) and SBR-EXP-11 [C30286](https://shopview.testrail.io/index.php?/cases/view/30286) | **Our cases follow Q5=A ("Sales Representative") and are CORRECT per Rule 32. No case change.** Note the spec is now **internally split**: **S1-R1** already says *"The label is the full word \"Representative,\" not the \"Rep\" shorthand"* while S19-R7, S19-R1/R8 and the CSV headers still say "Sales Rep". |
| **10** | **SBC Performance group + named nav anchors** | SBC **S1-R1** (live, v13): *"\"Sales By Customer\" appears in the Reports left-side navigation."* — **no group named, no anchors** | ❌ **NOT DONE** | SBC-NAV-01 [C30096](https://shopview.testrail.io/index.php?/cases/view/30096) · TU-NAV-01 [C30392](https://shopview.testrail.io/index.php?/cases/view/30392) · SBR-NAV-01 [C30195](https://shopview.testrail.io/index.php?/cases/view/30195) · WIP-TAB-01 [C30451](https://shopview.testrail.io/index.php?/cases/view/30451) | Keep our video-sourced wording (Rule 32). **Partial progress worth telling him:** SBR **S1-R1** now says *"…for every user who can see any other report in the same **Performance** group"*, and TU/WIP both name **Performance** — **SBC is the only one of the four with no group at all.** |
| **11** | **PV S1-R1 "only report" inconsistency** (IV is also under Parts) | PV **S1-R1**: *"…Parts Velocity is its **first (and, in this release, only) report**. A dev should not assume a Par[ts section exists]…"* — while IV **S1-R1**: *"The report appears in the reports navigation under the **Parts** group, labeled \"Inventory Value\"."* | ❌ **NOT DONE** — the two specs still contradict each other | PV-NAV-01 [C30322](https://shopview.testrail.io/index.php?/cases/view/30322) | Settled by the companion video (both under Parts); our case follows it. **No case change**; PV needs the one-word fix. |
| **12** | **Rep-label scope** (how far "Representative" reaches) | Answered by Chris **Q5 = A**; in the spec only **partly** — see item 9 | ⚠️ **ANSWERED, spec partial** | as item 9 | Closed as a *question*; the remaining work is the spec text (item 9). |
| **13** | **The ONE-PERMISSION model** — one ordinary Reports permission gates all six (Chris Q2=A + *"we just hide the new permissions from FE"*) | **SBC ✅ DONE.** New v13 text — **S1-R2**: *"The report is gated by **ordinary reports access**, not by a report-specific permission. Any user with standard reports access can open it; **there is no dedicated Sales By Customer View permission**."* · **S1-N1**: *"A user **without reports access** does not see the report in navigation and cannot open it by direct link."* · Change Log 2026-07-31: *"Corrected the Sales By Customer permission gate… This reverses the 2026-07-07 change that introduced a dedicated permission — that permission was specced before Custom Roles (CRP) existed… Engineering (SV-8598) to drop the dedicated ROLE\_SALES\_BY\_CUSTOMER\_REPORT::VIEW atom, gate SBC endpoints on standard reports access, and confirm the atom does not linger in the Custom Roles matrix."*<br>**PV ❌** — **S1-R4**: *"Both loading the report and exporting it require the **Inventory Reports → View** permission. A user without that permission is denied the report data and the export."* · **S1-N2**: *"A user who has the Reports-section role but lacks the **Inventory Reports → View** permission (S1-R4) still sees the Parts Velocity navigation entry… they are shown the standard access-denied state rather than data…"*<br>**TU ❌** — Story 1 Prerequisites: *"The user must have **the permission that grants access to the timesheet reports** (the same permission that controls the existing Timesheet Activities report — this report adds no new permission)."*<br>**WIP ❌** — Story 1 Prerequisites: *"The user must have **the permission that grants access to Work In Progress reports**."* + note *"the report reuses one existing reporting permission; it does not add a new one…"*<br>**IV ❌** — Story 1 Prerequisites: *"The user must have **the permission that grants access to the inventory reports** (the report reuses **the existing inventory-reports permission** — it adds no new permission)."*<br>**SBR — N/A**, it never named one: **S1-N1**: *"If the user lacks permission to access Reports, the entire Reports navigation (including this entry) is not shown."* | **SBC ✅ DONE · PV / TU / WIP / IV ❌ NOT DONE · SBR N/A** | **Confirmed by the spec (good news):** SBC-PERM-01 [C30098](https://shopview.testrail.io/index.php?/cases/view/30098), SBC-PERM-05 [C39447](https://shopview.testrail.io/index.php?/cases/view/39447), SBC-NAV-01 [C30096](https://shopview.testrail.io/index.php?/cases/view/30096), SBC-NAV-03 [C30099](https://shopview.testrail.io/index.php?/cases/view/30099)<br>**Ahead of the spec (correct per Rule 32, spec edit owed):** PV-PERM-01 [C30325](https://shopview.testrail.io/index.php?/cases/view/30325) · PV-PERM-03 [C30327](https://shopview.testrail.io/index.php?/cases/view/30327) · PV-API-04 [C30391](https://shopview.testrail.io/index.php?/cases/view/30391) · PV-NAV-01 [C30322](https://shopview.testrail.io/index.php?/cases/view/30322) · TU-NAV-07 [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) · TU-NAV-01 [C30392](https://shopview.testrail.io/index.php?/cases/view/30392) · WIP-PERM-01 [C30526](https://shopview.testrail.io/index.php?/cases/view/30526) · WIP-PERM-02 [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) · WIP-TAB-01 [C30451](https://shopview.testrail.io/index.php?/cases/view/30451) · IV-PERM-01 [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) · IV-PERM-02 [C30604](https://shopview.testrail.io/index.php?/cases/view/30604) · IV-NAV-01 [C30534](https://shopview.testrail.io/index.php?/cases/view/30534) | **No case change anywhere.** All 16 cases already say "ordinary reports access" (groups C, D and E, executed 2026-08-03). What is owed is **four spec edits** — the same paragraph SBC just got, applied to PV, TU, WIP and IV. **The SBC row also gives us the engineering ticket to watch: SV-8598 must drop `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW` and confirm it does not linger in the Custom Roles matrix** — that is exactly what SBC-PERM-05 (C39447) tests. |

**Verdict count: DONE 5 (items 1a, 2, 3, 5, 7) · NOT DONE 8 (1b, 4, 8, 9, 10, 11, and 13 on four of
the six specs) · PARTIAL 2 (6, 12).** **Zero of our test cases need changing** as a result — every
NOT DONE item is a case where we correctly followed his newer verbal/video/answer ruling (Rule 32)
and the **spec text is what is behind**.

---

## THE TWO ITEMS I HAD SEPARATELY REPORTED AS OUTSTANDING

### (i) The SBR export self-contradiction — **STILL LIVE, NOT FIXED**

Read side by side from today's live SBR (v15, unchanged since 2026-07-29):

- **S14-R15 (Summary CSV):** *"Headers, in order: `Sales Rep`, `# Invoices`, `# Customers`,
  `Hrs Worked`, `Hrs Invoiced`, `Inv. Hrs`, `Labor Invoiced`, `Labor Margin`, `Parts Invoiced`,
  `Parts Margin`, `Margin`, `Margin %`, `Subtotal`."* — **no Location, and `Sales Rep` not
  `Sales Representative`.**
- **S14-R16 (Expanded CSV):** *"Headers, in order: `Sales Rep`, `Date`, `Invoice #`, `Customer`,
  `Status`, `Hrs Worked`, …, `Subtotal`."* — same two problems.
- **S14-R20:** *"Whenever the Location column is shown on screen (S21-R7), it **is included in all
  four exports in the same position it occupies on screen** — Summary and Expanded, PDF and CSV…"*

**So S14-R15/R16 and S14-R20 cannot both be true as written.** This is the defect that
Vladimir Tomovic's automated [C38923](https://shopview.testrail.io/index.php?/cases/view/38923)
exposed (Rules 40/44). **Our two cases are already fixed and are the safer wording:** SBR-EXP-10
[C30285](https://shopview.testrail.io/index.php?/cases/view/30285) and SBR-EXP-11
[C30286](https://shopview.testrail.io/index.php?/cases/view/30286) now say *"**With a single location
in scope** the headers, in order, are exactly: **Sales Representative**, …"* — i.e. scope-conditional
per Rule 42 — and their `refs` already record *"S14-R15's header list was left un-updated when
S14-R20 was added — spec correction pending"*. **Nothing to change on our side; the spec correction
is Chris's.**

### (ii) Has the one-permission ruling reached the other five reports' text? — **NO. One of six.**

**SBC only** (v13, 2026-07-31). **PV, TU, WIP and IV all still name a per-area permission** — the
four verbatim quotes are in row 13 above. **SBR needs no edit** (it never named one). So the answer
is: **one report done, four to go, one not applicable.**

---

## TWO NEW FINDINGS FROM TODAY'S READ (neither was on the watch list)

1. **SBC still lists "Print" as an export in two requirements, after retiring it in Story 16.**
   **S18-R7**: *"Exports (CSV, PDF, **Print**) are generated on the server and contain exactly the
   customers matching the active filters…"* and **S18-R10**: *"If an export (CSV, PDF, or **Print**)
   is triggered while the active filters match no customers…"* — while **Story 16** reads *"(removed
   — Print retired)"*. A residual self-contradiction inside SBC. **No case impact** (our cases follow
   the removal), but it belongs on his list.
2. **SBR's rep label is now internally split.** **S1-R1** already carries the ruling — *"The label is
   the full word \"Representative,\" not the \"Rep\" shorthand"* — while **S19-R7**, **S19-R1/R8** and
   both CSV header lists still say "Sales Rep". So item 9 is not simply "not started"; it is
   **half-applied**, which is more confusing for a dev than either extreme.

---

## LOCAL MIRROR VERDICTS (the re-verified claim)

**The claim was true.** Two mirror sets exist and both matter:

| Mirror set | SBC | SBR | PV | TU | WIP | IV |
|---|---|---|---|---|---|---|
| `spec-current-2026-07-31/` (the working baseline) | ❌ **STALE (v12)** | ✅ current | ✅ current | ✅ current | ✅ current | ✅ current |
| `specs/*.md` (the original authoring ingest) | ❌ **STALE** | — not re-checked this run | — | — | — | — |

**Proof of the SBC staleness, quoted from our own files:**
`spec-current-2026-07-31/Sales-By-Customer-Report-current.md` line **125** still reads
*"**S1-R2:** The report is gated by a **dedicated Sales By Customer report View permission** — it is
not tied to a generic \"all reports\" permission."* and line **133** *"**S1-N1:** A user without the
**Sales By Customer report View permission** does not see the report in navigation…"* — **the
requirement Chris abolished on 2026-07-31.** `specs/sbc-sales-by-customer.md` line **111** carries
the identical abolished sentence.

**Action taken:** a **new dated capture** at `live-capture-2026-08-03/` with today's live SBC (plus
SBR and PV). **The 2026-07-31 captures were NOT overwritten.** The `specs/*.md` authoring ingest was
**deliberately not touched** — it is the historical authoring baseline, other workers are writing in
this tree concurrently, and refreshing it is a separate authorised job.

---

## DELIBERATE DECISIONS ON THIS PASS (Standing Rule 46)

| Decision | Plain answer | Evidence | Risk |
|---|---|---|---|
| No test case was changed | Every NOT DONE item is a case where we already follow his newer ruling; changing a case to match a spec sentence he has told us is wrong would make our tests worse. | Rule 32 (latest authoritative source wins); Rule 33 (his ruling outranks the stale document) | **LOW** |
| Version numbers reported from `lastModified` + the in-body Change Log, not the Confluence version integer | The tool we have does not expose it, so we say so instead of guessing. `lastModified` is Confluence's own metadata and an author cannot type it. | Rule 12; Rule 31's own "markers lie" warning | **MEDIUM** — a version integer would be firmer; needs cookies |
| TU / WIP / IV bodies not re-written to disk | Their live modified date matches the version we already hold, so the existing mirrors are provably current. | the currency table above | **LOW** |
| `specs/*.md` (the original ingest) not refreshed | Not this job, and other workers are editing this tree right now. | Rule 6; concurrency | **LOW** |
| The epic (SV-8582) not re-checked | This task was the spec watch. A Tier-1 epic currency check is cheap and belongs to the next Report Suite touch. | Rule 37 Tier 1 | **MEDIUM** — 6 stories were reopened as of 2026-07-31; somebody must look |

---

## OUTSTANDING — what I need from you

| # | What is missing | Who owes it | What it blocks | Since |
|---|---|---|---|---|
| 1 | **Chris Ward: the one-permission paragraph applied to PV, TU, WIP and IV** — the same edit SBC got on 2026-07-31 | Chris Ward | Nothing operationally, but **16 of our cases now read differently from four spec pages**, so any dev or reviewer reading the spec would judge our cases wrong | 2026-08-01 (his Q2=A answer) |
| 2 | **Chris Ward: the Location-filter-hidden fix on SBR / TU / IV / PV** (his own Q1=A answer) | Chris Ward | **Highest risk of the eight** — a dev building from the spec will build the *opposite* of what 4 of our cases assert | 2026-07-31 |
| 3 | **Chris Ward: the WIP asset-identifier VIN chain** — he has now twice believed this was done | Chris Ward | 4 WIP cases assert VIN-first against a spec that says unit-number-first | 2026-07-29 |
| 4 | **Chris Ward: the SBR export header lists** (S14-R15/R16) — add Location, and change `Sales Rep` → `Sales Representative` | Chris Ward | The spec contradicts itself; a foreign automated case already collided with ours over exactly this | 2026-07-29 |
| 5 | **Chris Ward: the smaller five** — SBC Performance group + anchors (10); TU "below existing links" (6); PV "only report" sentence (11); SBC's leftover "Print" in S18-R7/R10 (new); WIP asset-dropdown style (8) | Chris Ward | Low risk each; they are one-sentence fixes | 2026-07-28 → today |
| 6 | **Confluence session cookies** | you | Without them the **true Confluence version integers** cannot be read; we are reporting from `lastModified` + the in-body Change Log | today |
| 7 | **A QA branch + fresh cookies** | you / dev | **All 475 cases remain VIU-Pending.** Nothing in this suite has ever been observed on a running build | 2026-07-22 |
| 8 | **Your word on whether `specs/*.md` (the original ingest mirrors) should be refreshed too** | you | Nothing today — the 07-31/08-03 captures are the working baseline — but the old ingest still carries the abolished SBC permission sentence and could mislead a future pass | today |
