# Report Suite — Epic SV-8582 FULL RE-READ (Tier 2, Standing Rule 37)

> **Authorised:** QA lead, 2026-08-04 — *"Yes, Full epic re-read"*.
> **Scope:** epic SV-8582 + every child ticket, read exhaustively (Rule 37), totals stated (Rule 17),
> testable content quoted verbatim (Rule 25), nothing sampled (Rule 50).
> **READ-ONLY:** no Jira writes, no comments, no transitions, no TestRail writes, no case edits.

---

## ⚠️ READ THIS FIRST — WHAT THIS DOCUMENT IS, AND WHAT IT IS NOT

**I could not authenticate to Jira on this run.** No live read of shopview.atlassian.net was
possible. What follows is therefore built from the **committed 2026-07-31 raw REST snapshot**
(`build/epic-recheck-2026-07-31/raw/SV-8582-*.json`), not from a live 2026-08-04 fetch.

**Why that is still a real read, not a substitute:** the snapshot was taken with
`fields=*all&expand=renderedFields,changelog`, so it holds the **full description, the complete
untruncated changelog, and the comment/attachment collections for all 98 issues** — and it
**post-dates the 2026-07-29 reopening** that prompted this task. Every quotation below is from
ticket text as Jira served it.

**What is genuinely NOT covered, and needs credentials:**

| Gap | Why it matters |
| --- | --- |
| Any change between **2026-07-31 07:18Z** and now (2026-08-04) — 4 days | A description edit, status move, new comment or new attachment in that window is invisible to me |
| Any ticket created after 2026-07-31 | The snapshot's child set is fixed at 97 |
| **SV-8780** — the Story Defect under SV-8598 | Absent from the snapshot, so created after 2026-07-31. **NOT an outstanding ask:** the QA lead ruled on 2026-08-03, verbatim, *"Ignore this ticket."* — so it is **deliberately out of scope**, not a gap. See `OUTSTANDING.md` for the five Rule-48 fields |

**Nothing below is fabricated.** Where I could not read something I say so, here and in
`OUTSTANDING`. Per Rule 12 this document must not be cited as a live Tier-2 read; it is a
**snapshot-based Tier-2 read with a 4-day blind spot**, and the confirmation pass still needs to run.

### SOURCE-CURRENCY block (Rule 31)

| Source | Identifier | Version / last-updated | Checked | Verdict |
| --- | --- | --- | --- | --- |
| Epic + 97 children | SV-8582, SV-8583→SV-8679 | snapshot 2026-07-31T07:18Z; latest ticket `updated` = 2026-07-29T06:21Z | 2026-08-04 | **PARTIAL** — 4-day blind spot; SV-8780 unread |
| Jira changelogs | all 98, untruncated (`total` == `len(histories)` on every issue) | through 2026-07-31 | 2026-08-04 | **PARTIAL** — same window |
| Comments | 0 across all 98 | — | 2026-08-04 | **CURRENT as of 2026-07-31**, double-confirmed |
| Attachments / inline images | 0 across all 98 | — | 2026-08-04 | **CURRENT as of 2026-07-31**, double-confirmed |
| Our case suite | `build/report-suite/cases/` — **475** active, 475/475 C-ids mapped, at the moment the coverage pass ran | read 2026-08-04 | 2026-08-04 | **CURRENT, but MOVING** — a concurrent worker is authoring; a re-read minutes later showed **478**. Every verdict here is against the 475-case state and is unaffected by additions, but the *totals* are a point-in-time reading |

---

## TOTALS (Rule 17)

| Measure | Count |
| --- | --- |
| Issues read | **98** — 1 epic + 97 children |
| Children verified contiguous | **SV-8583 → SV-8679, 97 keys, no gaps** (`nums == range(8583, 8680)`) |
| Descriptions read | **98 / 98** — none empty |
| **Comments read** | **0 — because there are none** (see below) |
| **Attachments / inline images downloaded and viewed** | **0 — because there are none** (see below) |
| Changelogs read | **98 / 98, none truncated** |
| Description edits found, ever, on any child | **0** — only the epic was ever edited (2026-07-26T23:26:41) |
| Distinct spec/doc URLs referenced by ticket bodies | **6** — exactly our six known Confluence pages |
| Subtasks present in the snapshot | **0** (SV-8780 post-dates it) |
| Statuses | **Open 90 · OBSOLETE 6 · In Progress 1** |
| Substantive tickets (real requirement content) | **12** — the epic + SV-8589…SV-8599 |
| Thin pointer stories (title + spec link only) | **80** — SV-8600…SV-8679 |
| Tickets whose content **differs from what our cases assume** | **2** (both epic-level prose — see §4) |

### The child-count verification, both ways (as required)

**I could not re-run the two JQL queries** (`parent = SV-8582` and `"Epic Link" = SV-8582`) because
there is no Jira session. What I *can* certify is that **both queries were run on 2026-07-31 and
returned identical single-page sets of 97**, recorded in
`build/report-suite/epic-sv8582/INGEST-SUMMARY.md`:

> *"Child stories: 97 total (SV-8583 → SV-8679, contiguous; enumerated via both `parent = SV-8582`
> and `"Epic Link" = SV-8582` — identical sets, single page)"*

and that the snapshot I read contains exactly those 97 keys, contiguous, with no paging remainder.
**The both-ways check is therefore verified as of 2026-07-31 and NOT re-verified for 2026-08-04.**

### The comments / images finding — why "0" is a fact, not a fetch failure

This is the one place a lazy read would quietly cheat, so here is the proof. Every issue's comment
collection reads exactly `{"comments": [], "maxResults": 0, "total": 0, "startAt": 0}`. A uniform
`maxResults: 0` is on its own ambiguous — it *could* mean the field was never populated. It is
resolved by an **independent second source**: the 2026-07-27 ingest, taken through the **Atlassian
MCP** (a different transport entirely), recorded the same thing —

> *"**ALL 97 child stories carry 0 comments and 0 attachments** (no images/videos to analyze;
> attachments/ dir empty)."* — `epic-sv8582/INGEST-SUMMARY.md`

Two independent transports agreeing is sufficient. **There are no comments to read and no inline
images to download on this epic.** The Rule-37 obligation to view every image is satisfied
vacuously — and that is stated plainly rather than dressed up as work done.

---

## §1 THE EPIC — SV-8582, Open

Its own description is the only body in the tree that has ever been edited (2026-07-26T23:26:41 —
the change that grew the suite from five reports to six by adding Inventory Value).

**Testable suite-wide claims, verbatim:**

> *"Every report reads the same way — identifier columns left, financials middle, a bold pinned
> **Subtotal** far right — so there's nothing to relearn per report."*

> *"Consolidated **Reports** nav; single visual theme (two-tone Tech-Efficiency)."*

> *"**Subtotal** column pinned far-right + bolded across header/rows/totals."*

> *"Shared date-range selector, org-wide **multi-location filter** (`AccessibleWorkplaceResolver`,
> requested ∩ accessible), and per-report **filter persistence**."*

> *"CSV + PDF exports mirror the on-screen view."*

**Out of scope / follow-ups (verbatim — this is where the trouble is):**

> *"Server-side rework to safely offer "All Time" on the history-scan reports (SBC / SBR / Tech
> Utilization) — per engineering review, **All Time stays on WIP only until this lands**."*

> *"Parts Velocity row-scale (server-side paging / virtual scroll) before it can offer All Time or
> handle very large tenants."*

> *"Trend/as-of history views for WIP (snapshot rig is forward-capture, write-only)."*

Branch: `project/reports-suite-bravo`.

**Two of these epic statements conflict with the epic's own child stories** — see §4. Our cases
follow the child stories and the specs, which is the correct call, but the epic prose should be
corrected so nobody tests from it.

---

## §2 THE ORIGINAL SIX PLACEHOLDERS — SV-8583…SV-8588, all OBSOLETE

These are the six first-cut one-per-report stubs (194–289 chars each): *Technician Utilization
Report*, *Sales By Customer Report*, *Sales By Representative Report*, *Inventory Velocity Report*,
*Inventory Value Report*, *Work In Progress (WIP) Report*.

Changelog: each went `Open → OBSOLETE` with `resolution → Done`. They were **superseded by the
granular user stories** (SV-8600+) and the Part-A/Part-B engineering stories. **These are the 6
OBSOLETE tickets in the tree** — an important correction to the task framing, which implied the 6
OBSOLETE ones were SV-8594–8599. They are not; see §3 and `REOPENED-STORIES.md`.

**Nothing testable is lost by their obsolescence** — every report they named has full coverage.

---

## §3 THE ENGINEERING STORIES — SV-8589…SV-8599 (11 tickets, ALL the real content)

These carry 1160–2288 chars each and are where every testable engineering requirement lives.
Full verbatim requirement extraction with per-assertion coverage verdicts is in
**`NEW-OR-CHANGED-REQUIREMENTS.md`**; this section is the orientation map.

| Key | Phase | Status | What it builds | Blocks |
| --- | --- | --- | --- | --- |
| SV-8589 | PR-1 | **In Progress** | `inventory_changes` INT→DECIMAL(10,2) precision fix; fixes a **live QuickBooks-corruption bug** | B3 (PV Units Sold precision) |
| SV-8590 | A2 | Open | Shared paginated-report contract: `ReportListRequestDto`, 11 presets + Custom, **366-day cap**, `NonVoidInvoicePredicate` | A3, A5, all six reports |
| SV-8591 | A3 | Open | Export contract: **10k row cap** (`ExportRowCapGuard`), CSV as true attachment, PDF scaffold | all six reports' exports |
| SV-8592 | A4 | Open | Six denormalized invoice financial columns + backfill + clock-change subscriber | B5 (SBC), B6 (SBR) |
| SV-8593 | A5 | Open | FE shell: paged table, remembered view, LocationFilter, themes, nav, formatters | all six reports (FE) |
| SV-8594 | **B1** | Open *(reopened)* | WIP report + nightly snapshot cron | — |
| SV-8595 | **B2** | Open *(reopened)* | TU report | — |
| SV-8596 | **B3** | Open *(reopened)* | PV report + `part.last_sold_at` | — |
| SV-8597 | **B4** | Open *(reopened)* | IV report + nightly snapshot + retention | — |
| SV-8598 | **B5** | Open *(reopened)* | SBC report + dedicated permission | — |
| SV-8599 | **B6** | Open *(reopened)* | SBR report + rep schema + staff dialog | — |

**PR-1 (SV-8589) deserves separate notice.** It is the only ticket **In Progress**, and it is not a
reporting feature at all — it is a production bug fix:

> *"**Goal:** Fix the live QuickBooks-corruption bug caused by `inventory_changes.old_quantity`/
> `new_quantity` being mapped `integer` while the domain types them `float` — fractional units are
> truncated at hydrate/persist and QB journal-entry sync multiplies these into dollar amounts."*

> *"Forward-only (historical truncation unreconstructible)."*

That last clause is a permanent data-quality caveat worth knowing: pre-fix truncated history cannot
be repaired, so PV figures over old windows may not reconcile and **that is expected, not a bug**.

**Three tickets carry explicit engineering uncertainty flags** — useful VIU targets because they are
where the build is most likely to differ from the plan:

- SV-8595 (TU): *"**⚠️ Re-verify at implementation:** Timesheet methodology alignment +
  `labour_type` default-rate query (TU-BE agent stalled during planning)."*
- SV-8596 (PV): *"**⚠️ Re-verify at implementation:** movement queries + `InventoryQueryHandler`
  discriminators (PV-BE agent stalled). Do NOT copy its WO-type IN-list heuristic or
  `workplace_location_id` hack."*
- SV-8597 (IV): *"**⚠️ Sizing gate before locking:** `COUNT(*) FROM part WHERE quantity>0 AND
  is_core=0` per workplace — fleet-wide could be 50–200M/yr; retention bounds it, else month-RANGE
  partition."*

---

## §4 TICKETS WHOSE CONTENT DIFFERS FROM WHAT OUR CASES ASSUME

Exactly **two**, and **both are epic-level prose contradicted by the epic's own child stories.**
In both, our cases follow the child story and the spec, which is correct under Rule 32
(latest authoritative source wins) — so **no case should change**; the *epic* should be corrected.

### 4.1 "All Time stays on WIP only" — the epic contradicts B1 and our WIP case

**Epic SV-8582, verbatim:**
> *"Server-side rework to safely offer "All Time" on the history-scan reports (SBC / SBR / Tech
> Utilization) — per engineering review, **All Time stays on WIP only until this lands**."*

That sentence can only mean WIP **has** an All Time option.

**Our case WIP-FLT-04 = [C30501](https://shopview.testrail.io/index.php?/cases/view/30501)
("The date range offers the presets plus Custom; This Week default; no All Time"), verbatim
expected result:**
> *"2. The options offered are: "Today", "Yesterday", "This Week", "Last Week", "This Month",
> "Last Month", "This Year", "Last Year", "This Quarter", "Last Quarter", and "Custom".
> 3. "All Time" is NOT offered."*

**These cannot both be true.** Resolving it against the newer, more specific sources:

- **SV-8594 (B1), the WIP build story, verbatim:** *"Still consumes the rest of the shell (all-white
  theme, remembered-view, LocationFilter, **DateRange 366**, ColumnSelector, export)."* — a
  366-day-capped selector cannot offer All Time.
- **SV-8590 (A2), the shared contract, verbatim:** *"bounded date range (**11 presets + Custom**,
  **366-day cap**)"* — eleven bounded presets, no All Time.
- Our cases agree across reports: PV-FILT-03 = [C30330](https://shopview.testrail.io/index.php?/cases/view/30330)
  (*"exactly the eleven bounded options and no All Time"*), IV-DATE-01 = [C30561](https://shopview.testrail.io/index.php?/cases/view/30561),
  WIP-FLT-04 = C30501.

**Verdict: our cases are right; the epic sentence is stale**, almost certainly left over from an
earlier plan in which WIP kept All Time before the shared 366-day contract landed. **Retain our
position (Rule 39)**; raise the epic-text correction with Chris Ward / dev. **Risk if unaddressed:**
a tester or reviewer reading the epic would report a false defect ("WIP is missing All Time"), which
is precisely the review-cycle waste Rule 34 exists to prevent.

### 4.2 "single visual theme" — the epic contradicts all six B stories

**Epic SV-8582, verbatim:** *"Consolidated **Reports** nav; single visual theme (two-tone
Tech-Efficiency)."*

**But the six build stories assign two different themes, explicitly:**

| Report | Ticket | Verbatim theme in the ticket | Our case | Agrees? |
| --- | --- | --- | --- | --- |
| WIP | SV-8594 | *"all-white theme"* | WIP-VIS-01 = [C30519](https://shopview.testrail.io/index.php?/cases/view/30519) *"Each tab uses an all-white table with no alternating row shading"* | ✅ |
| TU | SV-8595 | *"All-white theme."* | TU-VIS-01 = [C30447](https://shopview.testrail.io/index.php?/cases/view/30447) *"All-white table with no row shading"* | ✅ |
| PV | SV-8596 | *"**two-tone theme**"* | PV-VIS-01 = [C30385](https://shopview.testrail.io/index.php?/cases/view/30385) *"The report uses the standard two-tone layout"* | ✅ |
| IV | SV-8597 | *"all-white theme"* | IV-VIS-01 = [C30596](https://shopview.testrail.io/index.php?/cases/view/30596) *"All-white table with no row shading"* | ✅ |
| SBC | SV-8598 | *"**two-tone theme**"* | SBC-VIS-02 = [C30186](https://shopview.testrail.io/index.php?/cases/view/30186) *"Row surfaces alternate by tree level; header and totals rows stay white"* | ✅ |
| SBR | SV-8599 | *"all-white theme"* | SBR-VIS-01 = [C30305](https://shopview.testrail.io/index.php?/cases/view/30305) *"edge-to-edge white table"* | ✅ |

And **SV-8593 (A5) ships two theme classes**, verbatim: *"`css/app.scss` — theme layer
`report-shell--two-tone` / `report-shell--all-white`."*

**Verdict: our six visual cases are individually correct and match their build stories 6/6.** The
epic's "single visual theme" is loose prose, not a requirement. **No case change.** Worth noting for
honesty: none of our six cases uses the literal class names, so a reviewer comparing the epic
sentence to the suite could allege inconsistency — the answer is the table above.

---

## §5 THE 80 USER STORIES — SV-8600…SV-8679

All 80 are **Open**. All 80 have the identical shape: one intent sentence, a `Spec:` smart-link, and
`Part of the Reporting Suite epic (SV-8582).` Example, in full, SV-8600:

> *"Where the report lives in the Reports navigation, and who can open it.*
> *__Spec:__ <SBC Confluence page 577634305>*
> *Part of the Reporting Suite epic (SV-8582)."*

**They contain no acceptance criteria** — the testable detail lives in the Confluence specs. Every
intent sentence is quoted verbatim in **Appendix B** so that claim is checkable rather than asserted.

**A completeness win from re-reading these.** My first extraction pass silently dropped the `Spec:`
links, because ADF stores them as `inlineCard` nodes carrying a `url` attribute and no text. I fixed
the extractor and recovered **92 link occurrences resolving to exactly 6 distinct URLs** — and those
six are **precisely our six known Confluence spec pages**, page-id for page-id:

| Page id | Report | Occurrences |
| --- | --- | --- |
| 585629698 | SBR — Sales By Representative | 24 |
| 577634305 | SBC — Sales By Customer | 21 |
| 720142338 | Inventory Value | 14 |
| 703660034 | WIP — Work In Progress | 13 |
| 641400833 | Technician Utilization | 11 |
| 620888066 | Parts Velocity | 9 |

**This is a positive traceability result: the epic points at no spec page we do not already hold**,
and no seventh document. Had I not fixed the flattener I would have reported "spec links empty",
which would have been wrong.

**One structural oddity, worth a question rather than an assumption:** the SBC and SBR story numbers
have gaps — SBC skips Story 5 and Story 19; SBR skips Story 7. The tickets are contiguous by *key*
(no missing Jira issue), so these are **spec story numbers that were never turned into tickets**.
Whether those spec stories were dropped or folded into neighbours is a question for Chris Ward; I am
not inferring it. Listed in `OUTSTANDING`.

---

## §6 LINKS, SUBTASKS, PRs AND BRANCHES

- **Issue links:** 46 of the 97 children carry at least one link; every linked key is **inside the
  epic** (SV-8589…SV-8677). **No ticket outside the epic links into it** in the snapshot, so the
  Rule-37 "including tickets outside the epic that link to it" sweep returns **zero** as of
  2026-07-31.
- **Subtasks: none in the snapshot.** **SV-8780 is absent**, which dates its creation after
  2026-07-31 — it is unread and is my top outstanding item.
- **Branches / PRs:** the only VCS reference anywhere in the tree is the epic's
  `project/reports-suite-bravo`, plus SV-8589's note that it *"ships as its own PR, ahead of the
  suite"*. **No ticket carries a linked PR, commit or remote-branch reference** in its body. Jira's
  development-panel data is not in `fields=*all` and I had no session to query it, so **"no linked
  PRs" is verified for ticket bodies only, not for the dev panel** — stated as a limit, not a
  finding.
- **Two Golden-Rule exemptions are declared** (both cross-tenant snapshot crons, both flagged 🔴 by
  engineering): SV-8594 `app:reporting:capture-wip-snapshots` and SV-8597
  `app:reporting:capture-inventory-value-snapshots`, each *"record in PR "Golden Rule Exemptions"
  block"*. These are the two crons our WIP-API-* and IV-API-* cases exercise.

---

## §7 WHAT I COULD NOT READ (Rule 12 — stated precisely)

1. **Live Jira, at all.** No Atlassian MCP is configured in this environment
   (`mcpServers` is empty; no `mcp__atlassian__*` tools exist), and no credential survives:
   `/tmp/fd-tickets/all-cookie-header.txt` — the cookie file every prior fetcher used — **does not
   exist** (`/tmp` is ephemeral and was wiped since 2026-07-31). I searched `/tmp` and `/root` for
   any `cloud.session.token`, `atlassian.xsrf.token` or `ATATT*` API token: **zero matches.**
   Reachability was confirmed and the failure is purely authentication:
   `GET /rest/api/3/myself` → **HTTP 401**, `GET /rest/api/3/issue/SV-8594` → **HTTP 404**
   (Jira's masked 401).
2. **SV-8780** — the Story Defect under SV-8598. Absent from the snapshot, therefore created after
   2026-07-31, and **unread**. **But it is not an outstanding ask:** the QA lead ruled on 2026-08-03,
   verbatim, **"Ignore this ticket."** It is therefore **deliberately out of scope**, and I have not
   attempted to read it. Recorded here for completeness of the unread list, not as a gap.
3. **The 2026-07-31 → 2026-08-04 delta** on all 98 issues: description edits, status moves, new
   comments, new attachments, new children.
4. **The two-way child-count JQL** could not be re-run for today (verified for 2026-07-31 only).
5. **Jira development-panel** PR/branch/commit links (not in `fields=*all`).

**What would fix all five:** a fresh Atlassian session cookie header written to
`/tmp/fd-tickets/all-cookie-header.txt` (the path
`build/epic-recheck-2026-07-31/fetch_epic.py` already reads), or an Atlassian API token. With
either, re-running that fetcher plus `extract.py` reproduces this document against live data in a
few minutes, and SV-8780 becomes readable.

---

## §8 HONEST BOTTOM LINE

- The epic's **requirement content is unchanged** since we ingested it: **no child description has
  ever been edited**, and the only body edit in the whole tree is the epic's own, on 2026-07-26.
- **The six reopened stories did not change scope** — full argument in `REOPENED-STORIES.md`.
- Our 475 cases stand up well against the engineering stories: on every specific, checkable
  assertion I tested, the case exists and frequently matches **verbatim**. Full per-assertion
  verdict table in `NEW-OR-CHANGED-REQUIREMENTS.md`.
- **The two content differences I found are both epic prose being wrong, not our cases** (§4).
- **Nothing materially unread remains in scope.** SV-8780 is unread but was explicitly ruled out of
  scope by the QA lead ("Ignore this ticket.", 2026-08-03), so the in-scope tree is fully read subject
  only to the 4-day window.

---

<!-- appendices appended below -->
## Appendix A — every child ticket, as read (97 of 97)

Ordered by key. `Spec` = the Confluence page the ticket's own smart-link points at
(recovered from the ADF `inlineCard` nodes). `Chars` = description length.
All 97 carry **0 comments** and **0 attachments** (double-confirmed — see the honesty section).

| Key | Status | Spec | Chars | Title |
| --- | --- | --- | --- | --- |
| SV-8583 | OBSOLETE | TU | 394 | Technician Utilization Report |
| SV-8584 | OBSOLETE | SBC | 350 | Sales By Customer Report |
| SV-8585 | OBSOLETE | SBR | 327 | Sales By Representative Report |
| SV-8586 | OBSOLETE | PV | 333 | Inventory Velocity Report |
| SV-8587 | OBSOLETE | IV | 410 | Inventory Value Report |
| SV-8588 | OBSOLETE | WIP | 354 | Work In Progress (WIP) Report |
| SV-8589 | In Progress | — | 1240 | [Reports Suite][PR-1] inventory_changes INT→DECIMAL precision fix + QB correction |
| SV-8590 | Open | — | 1384 | [Reports Suite][A2] Shared paginated-report contract (RequestDto + Query + count/page helper) |
| SV-8591 | Open | — | 1160 | [Reports Suite][A3] Export contract + 10k row-cap guard (CSV attachment + PDF scaffold) |
| SV-8592 | Open | — | 1708 | [Reports Suite][A4] Denormalized invoice financial columns + backfill + clock subscriber |
| SV-8593 | Open | — | 1953 | [Reports Suite][A5] FE report shell (table/remembered-view/filters/themes/nav/formatters) |
| SV-8594 | Open | — | 1748 | [Reports Suite][B1] Work In Progress (WIP) report + nightly snapshot cron |
| SV-8595 | Open | — | 1846 | [Reports Suite][B2] Technician Utilization (TU) report |
| SV-8596 | Open | — | 1724 | [Reports Suite][B3] Parts Velocity (PV) report + part.last_sold_at |
| SV-8597 | Open | — | 1987 | [Reports Suite][B4] Inventory Value (IV) report + nightly snapshot + retention |
| SV-8598 | Open | — | 2117 | [Reports Suite][B5] Sales By Customer (SBC) report + dedicated permission |
| SV-8599 | Open | — | 2288 | [Reports Suite][B6] Sales By Representative (SBR) report + rep schema + staff dialog |
| SV-8600 | Open | SBC | 254 | SBC - Story 1 - Report access and navigation placement |
| SV-8601 | Open | SBC | 222 | SBC - Story 2 - Filter by date range |
| SV-8602 | Open | SBC | 246 | SBC - Story 3 - Filter by product type |
| SV-8603 | Open | SBC | 265 | SBC - Story 4 - Filter by location |
| SV-8604 | Open | SBC | 266 | SBC - Story 6 - Remember filters and view between visits |
| SV-8605 | Open | SBC | 238 | SBC - Story 7 - View customer summary rows |
| SV-8606 | Open | SBC | 281 | SBC - Story 8 - Expand a customer to its assets, and an asset to its invoices |
| SV-8607 | Open | SBC | 258 | SBC - Story 9 - Open an invoice |
| SV-8608 | Open | SBC | 224 | SBC - Story 10 - Sort the report |
| SV-8609 | Open | SBC | 243 | SBC - Story 11 - Subtotal column behavior |
| SV-8610 | Open | SBC | 260 | SBC - Story 12 - Inv. Hrs (Labor Delta) display |
| SV-8611 | Open | SBC | 220 | SBC - Story 13 - Show or hide columns |
| SV-8612 | Open | SBC | 228 | SBC - Story 14 - Export as CSV |
| SV-8613 | Open | SBC | 224 | SBC - Story 15 - Download as PDF |
| SV-8614 | Open | SBC | 243 | SBC - Story 16 - Print the report |
| SV-8615 | Open | SBC | 237 | SBC - Story 17 - Empty state |
| SV-8616 | Open | SBC | 267 | SBC - Story 18 - Filter by customer |
| SV-8617 | Open | SBC | 241 | SBC - Story 20 - Visual conformance with the reports suite |
| SV-8618 | Open | SBC | 252 | SBC - Story 21 - Mobile usability |
| SV-8619 | Open | SBR | 231 | SBR - Story 1 - Access the Sales By Representative Report |
| SV-8620 | Open | SBR | 221 | SBR - Story 2 - Filter the report by date range |
| SV-8621 | Open | SBR | 223 | SBR - Story 3 - Filter the report by product type |
| SV-8622 | Open | SBR | 233 | SBR - Story 4 - Filter the report by invoice payment status |
| SV-8623 | Open | SBR | 215 | SBR - Story 5 - View per-rep summary rows |
| SV-8624 | Open | SBR | 225 | SBR - Story 6 - Expand a rep to view their invoices |
| SV-8625 | Open | SBR | 218 | SBR - Story 8 - Invoice payment status badge |
| SV-8626 | Open | SBR | 227 | SBR - Story 9 - Inv. Hrs (Labor Delta) column display |
| SV-8627 | Open | SBR | 232 | SBR - Story 10 - Subtotal column and grand Totals indicator |
| SV-8628 | Open | SBR | 205 | SBR - Story 11 - Sort the report |
| SV-8629 | Open | SBR | 224 | SBR - Story 12 - Navigate to an invoice or customer |
| SV-8630 | Open | SBR | 238 | SBR - Story 13 - Deactivate a sales rep with customer assignments |
| SV-8631 | Open | SBR | 209 | SBR - Story 14 - PDF and CSV exports |
| SV-8632 | Open | SBR | 222 | SBR - Story 15 - Sales Rep Assignments CSV export |
| SV-8633 | Open | SBR | 222 | SBR - Story 16 - Loading, empty, and error states |
| SV-8634 | Open | SBR | 206 | SBR - Story 17 - Mobile usability |
| SV-8635 | Open | SBR | 226 | SBR - Story 18 - Visual conformance and accessibility |
| SV-8636 | Open | SBR | 221 | SBR - Story 19 - Work Order Sales Rep assignment |
| SV-8637 | Open | SBR | 205 | SBR - Story 20 - Column selector |
| SV-8638 | Open | SBR | 219 | SBR - Story 21 - Filter the report by location |
| SV-8639 | Open | SBR | 214 | SBR - Story 22 - Show Unassigned invoices |
| SV-8640 | Open | SBR | 215 | SBR - Story 23 - Remember filters and view |
| SV-8641 | Open | PV | 262 | Velocity - Story 1 - Report Access & Location |
| SV-8642 | Open | PV | 259 | Velocity - Story 2 - Filters & Search |
| SV-8643 | Open | PV | 274 | Velocity - Story 3 - Data Table |
| SV-8644 | Open | PV | 290 | Velocity - Story 4 - Columns & Remembered View |
| SV-8645 | Open | PV | 315 | Velocity - Story 5 - Metric Calculations |
| SV-8646 | Open | PV | 241 | Velocity - Story 6 - Exports (CSV & PDF) |
| SV-8647 | Open | PV | 240 | Velocity - Story 7 - Visual Conformance |
| SV-8648 | Open | TU | 307 | Tech Util - Story 1 - Report Access and Display |
| SV-8649 | Open | TU | 309 | Tech Util - Story 2 - Columns and Calculations |
| SV-8650 | Open | TU | 251 | Tech Util - Story 3 - Summary Totals Row |
| SV-8651 | Open | TU | 266 | Tech Util - Story 4 - Per-Day Breakdown |
| SV-8652 | Open | TU | 284 | Tech Util - Story 5 - Technician Filter |
| SV-8653 | Open | TU | 306 | Tech Util - Story 6 - Total Hours Links to Timesheet Activities |
| SV-8654 | Open | TU | 314 | Tech Util - Story 7 - Export to PDF and CSV |
| SV-8655 | Open | TU | 314 | Tech Util - Story 8 - Visual Conformance and Accessibility |
| SV-8656 | Open | TU | 286 | Tech Util - Story 9 - Location Filter |
| SV-8657 | Open | WIP | 295 | WIP - Story 1 - Report Access and Tabs |
| SV-8658 | Open | WIP | 251 | WIP - Story 2 - Work-Order Scope, Loading, and Empty State |
| SV-8659 | Open | WIP | 287 | WIP - Story 3 - Tab Placement (Sectioning) |
| SV-8660 | Open | WIP | 302 | WIP - Story 4 - Columns and Calculations |
| SV-8661 | Open | WIP | 284 | WIP - Story 5 - Summary Strip |
| SV-8662 | Open | WIP | 248 | WIP - Story 6 - Per-Tab Totals Row |
| SV-8663 | Open | WIP | 264 | WIP - Story 7 - Filters |
| SV-8664 | Open | WIP | 258 | WIP - Story 8 - Column Selection and Persistence |
| SV-8665 | Open | WIP | 237 | WIP - Story 9 - Export to PDF and CSV |
| SV-8666 | Open | WIP | 312 | WIP - Story 10 - Visual Conformance and Accessibility |
| SV-8667 | Open | WIP | 317 | WIP - Story 11 - Nightly WIP Snapshot Capture |
| SV-8668 | Open | IV | 297 | Inv Value - Story 1 - Report Access and Display |
| SV-8669 | Open | IV | 230 | Inv Value - Story 2 - Row Scope |
| SV-8670 | Open | IV | 313 | Inv Value - Story 3 - Columns and Calculations |
| SV-8671 | Open | IV | 242 | Inv Value - Story 4 - Totals Row |
| SV-8672 | Open | IV | 292 | Inv Value - Story 5 - As-Of Date and History |
| SV-8673 | Open | IV | 316 | Inv Value - Story 6 - Category, Vendor, and Part Search Filters |
| SV-8674 | Open | IV | 279 | Inv Value - Story 7 - Location Filter |
| SV-8675 | Open | IV | 253 | Inv Value - Story 8 - Column Selection and Persistence |
| SV-8676 | Open | IV | 254 | Inv Value - Story 9 - Sorting |
| SV-8677 | Open | IV | 315 | Inv Value - Story 10 - Export to PDF and CSV |
| SV-8678 | Open | IV | 322 | Inv Value - Story 11 - Nightly Snapshot Capture |
| SV-8679 | Open | IV | 265 | Inv Value - Story 12 - Visual Conformance and Accessibility |

## Appendix B — the 80 user stories, verbatim intent line

Every one of SV-8600..SV-8679 has the identical three-part shape: **one intent sentence**,
a `Spec:` smart-link to that report's Confluence page, and the line
`Part of the Reporting Suite epic (SV-8582).` **They carry no acceptance criteria** — the
testable detail lives in the Confluence specs and in the Part-A/Part-B engineering stories.
The intent sentence is quoted verbatim below so the claim above is checkable.

| Key | Status | Verbatim intent sentence |
| --- | --- | --- |
| SV-8600 | Open | "Where the report lives in the Reports navigation, and who can open it." |
| SV-8601 | Open | "Set the time window the report covers." |
| SV-8602 | Open | "Limit the report to service invoices, parts invoices, or both." |
| SV-8603 | Open | "Scope the report to one, several, or all of the locations the user has access to." |
| SV-8604 | Open | "Restore the user's last filters, sort, and columns when they return to the report." |
| SV-8605 | Open | "Show one row per customer that rolls up their revenue." |
| SV-8606 | Open | "Drill from a customer down to the vehicles the work was done on, then to the individual invoices." |
| SV-8607 | Open | "Click into an invoice from the report without losing filters or expansion." |
| SV-8608 | Open | "Rank customers by any meaningful column." |
| SV-8609 | Open | "Keep the headline number unmistakable and always on screen." |
| SV-8610 | Open | "Show whether a customer or invoice was billed for more time than was worked." |
| SV-8611 | Open | "Hide columns the user does not need." |
| SV-8612 | Open | "Download the on-screen report as a CSV file." |
| SV-8613 | Open | "Download a printable copy of the report." |
| SV-8614 | Open | "Print directly from the toolbar without first saving a PDF." |
| SV-8615 | Open | "Give clear feedback when the filters produce no data." |
| SV-8616 | Open | "Narrow the report to a chosen set of customers with a multi-select Customer filter." |
| SV-8617 | Open | "Make the report look and feel like the rest of the suite." |
| SV-8618 | Open | "Keep every control usable on a phone even though the table is dense." |
| SV-8619 | Open | "Access the Sales By Representative Report" |
| SV-8620 | Open | "Filter the report by date range" |
| SV-8621 | Open | "Filter the report by product type" |
| SV-8622 | Open | "Filter the report by invoice payment status" |
| SV-8623 | Open | "View per-rep summary rows" |
| SV-8624 | Open | "Expand a rep to view their invoices" |
| SV-8625 | Open | "Invoice payment status badge" |
| SV-8626 | Open | "Inv. Hrs (Labor Delta) column display" |
| SV-8627 | Open | "Subtotal column and grand Totals indicator" |
| SV-8628 | Open | "Sort the report" |
| SV-8629 | Open | "Navigate to an invoice or customer" |
| SV-8630 | Open | "Deactivate a sales rep with customer assignments" |
| SV-8631 | Open | "PDF and CSV exports" |
| SV-8632 | Open | "Sales Rep Assignments CSV export" |
| SV-8633 | Open | "Loading, empty, and error states" |
| SV-8634 | Open | "Mobile usability" |
| SV-8635 | Open | "Visual conformance and accessibility" |
| SV-8636 | Open | "Work Order Sales Rep assignment" |
| SV-8637 | Open | "Column selector" |
| SV-8638 | Open | "Filter the report by location" |
| SV-8639 | Open | "Show Unassigned invoices" |
| SV-8640 | Open | "Remember filters and view" |
| SV-8641 | Open | "Where the report lives in the Reports navigation, and the access required to open it." |
| SV-8642 | Open | "The filters and search available on the report; each reloads data from the server." |
| SV-8643 | Open | "One row per part (per location for inventory): how rows rank and sort, and how each cell renders." |
| SV-8644 | Open | "Which columns show by default, and how each user's filters, column choices, and sort are remembered and restored." |
| SV-8645 | Open | "The authoritative source, formula, and on-screen format for every column - the single reference for the table, the exports, and the tests." |
| SV-8646 | Open | "What the CSV and PDF exports contain and how they are formatted." |
| SV-8647 | Open | "The report's visual treatment (self-contained normative rules)." |
| SV-8648 | Open | "The report is reachable from the reports navigation and shows technician rows for the selected date range and location(s)." |
| SV-8649 | Open | "Each technician row shows the hours breakdown, the utilization rate, and the Est. Lost Labor value, in a fixed column order." |
| SV-8650 | Open | "A pinned Summary row shows the totals for the visible technicians." |
| SV-8651 | Open | "Each technician row can expand to show that technician's day-by-day clock totals." |
| SV-8652 | Open | "A filter lets the user choose which technicians the report shows, and the Summary updates to match." |
| SV-8653 | Open | "Each technician's Total Hours value links to the Timesheet Activities report, filtered to that technician and date range." |
| SV-8654 | Open | "The user can download the report as a Summary PDF, an Expanded PDF, or a CSV file, and the download respects the current filters." |
| SV-8655 | Open | "The report conforms to the application's standard all-white reporting theme and layout, and meets the accessibility requirements." |
| SV-8656 | Open | "A filter lets the user scope the report to one, several, or all of the locations they have access to." |
| SV-8657 | Open | "The report is reachable from the reports navigation and opens on the first section tab, with four tabs in total." |
| SV-8658 | Open | "The report lists every open work order for the selected location(s)." |
| SV-8659 | Open | "Each open work order is placed in exactly one tab, derived from its status and whether work has started." |
| SV-8660 | Open | "Each row shows the work order's identity, its aging, and its earned/remaining money breakdown, in a fixed column order." |
| SV-8661 | Open | "A strip across the top shows the whole floor as headline figures, and recomputes as the user filters." |
| SV-8662 | Open | "Each tab has a Totals row that sums the visible jobs in that tab." |
| SV-8663 | Open | "The report can be filtered by advisor, customer, asset, date range, and location." |
| SV-8664 | Open | "The user can choose which columns show, and the report remembers its setup." |
| SV-8665 | Open | "The user can download the current tab as a PDF or CSV." |
| SV-8666 | Open | "The report conforms to the application's standard all-white reporting theme and layout, and meets the accessibility requirements." |
| SV-8667 | Open | "Once per day the report captures every open work order's earned/remaining value, so a future Trend view can read a consistent history." |
| SV-8668 | Open | "The report is reachable from the reports navigation and shows in-stock part rows for the selected date and location(s)." |
| SV-8669 | Open | "The report values only real, sellable on-hand stock." |
| SV-8670 | Open | "Each row shows the part's identity, its on-hand quantity, its unit and extended cost and sell, and its margin, in a fixed column order." |
| SV-8671 | Open | "A totals row sums the full filtered set, computed on the server." |
| SV-8672 | Open | "A date control chooses the date the report is valued as of, served from the current stock or from nightly history." |
| SV-8673 | Open | "The user can narrow the report by category, by vendor, and by a part search over part number and description. All three apply server-side." |
| SV-8674 | Open | "A filter lets the user scope the report to one, several, or all of the locations they have access to." |
| SV-8675 | Open | "The user can choose which columns show, and the report remembers its setup." |
| SV-8676 | Open | "The user can sort the report by any column; sorting is resolved server-side." |
| SV-8677 | Open | "The user can download the current view as a PDF or CSV, generated server-side, respecting the current filters, search, columns, and sort." |
| SV-8678 | Open | "The as-of history is built from a once-daily recorded snapshot of every location's inventory value, retained at reducing granularity as it ages." |
| SV-8679 | Open | "The report conforms to the application's standard all-white reporting theme and layout." |
