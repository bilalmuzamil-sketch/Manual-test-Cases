# Report Suite — Epic SV-8582 re-check vs our ingest

> **Verdict in one line: no new and no removed stories, BUT 7 stories changed status — the 6 engineering build stories we recorded as OBSOLETE/superseded were REOPENED to Open on 2026-07-29, and the QuickBooks precision story is now In Progress. Their content is therefore live again, not historical. 1 genuine coverage gap, 2 candidate cases, 1 contradiction to flag.**

- **Epic:** SV-8582 — "Reporting Suite — Technician Utilization, Sales By Customer, Sales By Representative, Inventory Velocity, Inventory Value, WIP" · status **Open** · PO **Chris Ward** · QA **Nebojsa Glavinic + Viktoria Videnovic** · branch `project/reports-suite-bravo`
- **Our ingest:** 2026-07-27 (`build/report-suite/epic-sv8582/`, committed `b542841d` 2026-07-27 06:19 UTC)
- **This re-check:** 2026-07-31, live Jira REST v3 (`GET /rest/api/3/myself` = HTTP 200 as Bilal Muzamil)
- **Raw evidence:** `raw/SV-8582-epic.json`, `raw/SV-8582-children-full.json`, `raw/SV-8582-children-index.json`, `raw/SV-8582-analysis.txt`, `raw/reopened-stories-verbatim.txt`
- **Live-build check:** NOT run and NOT needed for this task (Rule 22) — this is a Jira-source recheck. Nothing below is claimed as build-verified; the gap/contradiction items are marked as needing live confirmation at VIU when the QA branch exists.

## 1. Story count then vs now

| | Then (our ingest) | Now (live 2026-07-31) |
|---|---|---|
| Child stories | **97** (SV-8583 to SV-8679, contiguous) | **97** (SV-8583 to SV-8679, contiguous) |
| NEW stories | — | **0** |
| REMOVED / moved out | — | **0** |
| RENAMED | — | **0** |
| By status | OBSOLETE 12 · Open 85 | **OBSOLETE 6 · Open 90 · In Progress 1** |

Enumerated two independent ways and cross-checked (Rule 17): JQL `parent = SV-8582` = **97**, JQL `"Epic Link" = SV-8582` = **97**, identical key sets, no paging remainder. Exact total found: **97 children + 1 epic = 98 issues.** Comments across all 98 = **0**. Attachments across all 98 = **0** (no images/videos to analyse).

## 2. Status changes — the real delta (7 stories)

| Key | Title | Status at ingest | Status now | Who / when (verbatim changelog) |
|---|---|---|---|---|
| SV-8589 | [Reports Suite][PR-1] inventory_changes INT to DECIMAL precision fix + QB correction | Open | **In Progress** | `status 'Open' -> 'In Progress'` by **parth fadadu**, 2026-07-29T11:22:21Z (+ ranked lower by Stefan Mitrovic 2026-07-30T14:44Z) |
| SV-8594 | [Reports Suite][B1] Work In Progress (WIP) report + nightly snapshot cron | **OBSOLETE** (resolution Done) | **Open** | `resolution 'Done' -> ''`, `status 'OBSOLETE' -> 'Blocked' -> 'Board Backlog' -> 'Open'` by **parth fadadu**, 2026-07-29T11:20:54 to 11:21:00Z |
| SV-8595 | [Reports Suite][B2] Technician Utilization (TU) report | **OBSOLETE** (resolution Done) | **Open** | same pattern by **parth fadadu**, 2026-07-29T11:21:03 to 11:21:09Z |
| SV-8596 | [Reports Suite][B3] Parts Velocity (PV) report + part.last_sold_at | **OBSOLETE** (resolution Done) | **Open** | same pattern by **parth fadadu**, 2026-07-29T11:21:14 to 11:21:17Z |
| SV-8597 | [Reports Suite][B4] Inventory Value (IV) report + nightly snapshot + retention | **OBSOLETE** (resolution Done) | **Open** | same pattern by **parth fadadu**, 2026-07-29T11:21:32 to 11:21:36Z |
| SV-8598 | [Reports Suite][B5] Sales By Customer (SBC) report + dedicated permission | **OBSOLETE** (resolution Done) | **Open** | same pattern by **parth fadadu**, 2026-07-29T11:21:44 to 11:21:49Z |
| SV-8599 | [Reports Suite][B6] Sales By Representative (SBR) report + rep schema + staff dialog | **OBSOLETE** (resolution Done) | **Open** | same pattern by **parth fadadu**, 2026-07-29T11:20:42 to 11:20:45Z |

**Nothing moved to Done.** No story has shipped, so there is no newly-shipped behaviour to test. The movement is the opposite direction: **work was un-obsoleted and put back on the board**, and one story started.

### Why this matters (plain English)

At ingest, `build/report-suite/epic-sv8582/RECONCILIATION.md` line 54 recorded the B-series as:

> "Engineering build (Part B) | SV-8594–8599 | 6 | **OBSOLETE** | B1–B6 per-report build stories | superseded by the granular user stories; still carry tech-plan detail"

…and treated each one's content as **"Historical detail only (superseded)"** (line 115, WIP). That premise is now **wrong**: a developer reopened all six on 2026-07-29, so **B1–B6 are the live engineering implementation tickets for the six reports**, and their technical detail is CURRENT engineering truth rather than history. Every "Confirms our cases" and "NEW candidate case LATER" note we parked against them is now actionable rather than archival.

**Important scope note (honesty, Rule 12):** the reopening was a *board/status* action only. **No description text changed on any of the 7 stories** — the post-cutoff changelog contains only `status`, `resolution`, `Rank` and (on the epic) `QA Assignee` items. So the requirement text we ingested is still verbatim-accurate; what changed is its authority (live, not superseded).

### Why the user's screenshot showed the epic "updated 2026-07-27"

The epic's own `updated` = **2026-07-27T01:12:35.143-0500**, and the changelog shows that edit verbatim:

> `2026-07-27T01:12:35.143-0500 | QA Assignee | '' -> '[Nebojsa Glavinic, Viktoria Videnovic]' | by Bilal Muzamil`

Administrative, by the user's own account, and **already captured** in our INGEST-SUMMARY ("QA Nebojsa Glavinic + Viktoria Videnovic"). The last content edit to the epic was **Chris Ward on 2026-07-26T23:26** (description + summary — the 5-to-6 reports change, which our ingest records). So the epic itself is **not** a stale source; the delta lives entirely in the 7 child status changes above.

## 3. Description / comment changes carrying testable content

- **Description edits after our ingest cutoff: 0** (across the epic and all 97 children).
- **Comments after cutoff: 0.** Comments all-time: **0**.
- **Total changelog items after cutoff: 22** — all of them `status` / `resolution` / `Rank` / `QA Assignee`. No requirement text moved.

Because the six reopened stories now carry live authority, the following text from them is **verbatim testable content that is newly in force** (quoted from the live fetch, `raw/reopened-stories-verbatim.txt` — Rule 25, no paraphrase):

**SV-8589 (In Progress) — the only actively-worked story:**
> "**Goal:** Fix the live QuickBooks-corruption bug caused by `inventory_changes.old_quantity`/`new_quantity` being mapped `integer` while the domain types them `float` — fractional units are truncated at hydrate/persist and QB journal-entry sync multiplies these into dollar amounts."
> "**Tests:** fractional-quantity round-trip regression; QB journal amount exact from fractional movement."
> "**Depends on:** nothing. **Blocks:** B3 (PV — Units Sold precision)."

**SV-8594 (B1/WIP):**
> "**DB:** `work_order_wip_snapshot` table (one row per open WO per date; join org-purge path; no FK; **no reader this version**)."
> "Nightly snapshot cron `app:reporting:capture-wip-snapshots` — cross-tenant Golden-Rule exemption …; EventBridge to ECS RunTask ~08:00 UTC; **idempotent delete+reinsert per (workplace, WO, date)**."

**SV-8595 (B2/TU):**
> "default rate is a `labour_type` row with `is_default=1` (no unique constraint — pick deterministically; **workplace may have none → partial/"—"**)."
> "**sort resets to Technician A–Z on reload (NOT remembered)**"
> "Reconcile to the cent vs Timesheet Activities."

**SV-8596 (B3/PV):**
> "Units Sold = net over invoicing origins (WorkOrderInvoiceCreate +, WorkOrderInvoiceReverse −) — origin filter mandatory. Demand = count of in-window invoicing events."
> "**Permission: existing Inventory Reports to View (no new atom).**"
> "**Depends on:** PR-1, A2, A5."

**SV-8597 (B4/IV):**
> "Qty = AVAILABLE_QUANTITY_SQL (positive-bins-only, agrees with Parts page — do NOT copy Dashboard's raw `p.quantity`)."
> "**Retention prune (<=13mo daily to monthly last-capture)** as in-command step."
> "As-of resolution (live today / nearest snapshot / none to empty). **Permission `ROLE_REPORT_VIEW`.**"

**SV-8598 (B5/SBC):**
> "Dedicated view permission (SV-5319 model, must land in one commit or be-permission-drift CI fails): atom **`ROLE_SALES_BY_CUSTOMER_REPORT::VIEW`**, **bundle decision (43rd bundle vs ride existing — product call)** … Every SBC endpoint gates on the new atom via `#[IsGranted]`, **NOT `ROLE_REPORT_VIEW`**."
> ""Parts Sales" bucket = `vehicle_id IS NULL`"; "10k cap counts customers + invoices (two-level)."

**SV-8599 (B6/SBR):**
> "No dual parts/service rep fields exist (spec build-note describes a dead prototype) — build single-rep chain fresh."
> "rep snapshot write at invoice creation (WO rep to customer rep to null); **must NOT recompute in updateInvoice (immutable)**."
> "**Payment 5-to-3 mapping** — `balance_owed` != `total_balance − paid_balance` (deposits excluded from `paid_balance` per SV-6616); prepaid branch needs deposit-contribution join or every prepaid invoice misclassifies"
> "**S13-R8 wants Esc-to-dismiss but Golden Rule #9 forbids Esc — surface as decision.**"

## 4. Coverage verdict per CHANGED story

Checked against `build/report-suite/testrail-id-map.csv` (465 mapped cases; not re-read from live TestRail this pass) and the local case bodies in `build/report-suite/cases/` — **read-only, no edits**. All Case IDs paired per Rule 8.

| Story | Testable content now in force | Covered by | Verdict |
|---|---|---|---|
| **SV-8589** PR-1 QB/precision | fractional-quantity round-trip not truncated; **QB journal amount exact from fractional movement** | **NOTHING.** Zero cases in the whole 529-case local source mention QuickBooks; zero PV cases mention fractional/decimal quantities (`grep` = 0 hits for "quickbooks" and 0 for "fractional" in all `cases-pv-*.json`). Nearest neighbours are PV-CALC-01 = **C30359** (net stock movement) and PV-ROW-10 = **C30350** (reversal to Units Sold 0.00) — both integer-quantity scenarios. | **GENUINE GAP** to 2 candidate cases (see section 6) |
| **SV-8594** B1 WIP | nightly snapshot capture, idempotent per (workplace, WO, date), "no reader this version" | WIP-API-01..06 = **C30528 / C30529 / C30530 / C30531 / C30532 / C30533** — capture-only, incl. idempotence (C30530 identical computation, C30531 same scope conditions). No WIP case asserts an as-of/history *reader*, which correctly matches "no reader this version". | **COVERED** — no gap, no contradiction |
| **SV-8595** B2 TU | no-default-rate to em-dash / partial; sort resets on reload, never persisted; cent-reconcile vs Timesheet Activities | TU-ELL-03 = **C30406**, TU-ELL-04 = **C30407**, TU-ELL-05 = **C30408** (em-dash / $0.00 / partial); TU-SORT-03 = **C30411** ("A data reload resets the sort to Technician A to Z, and sort is never persisted"); TU-LINK-03 = **C30430** (Total Hours matches Timesheet) + TU-LINK-04/05 = **C30431 / C30432** (the two named reconciliation exceptions) | **COVERED — exact match**, no gap, no contradiction |
| **SV-8596** B3 PV | Units Sold net over invoicing origins; Demand counts events not quantity; permission = existing Inventory Reports to View, no new atom | PV-CALC-01 = **C30359**, PV-CALC-02 = **C30360**, PV-CALC-06 = **C30364**, PV-CALC-11 = **C30369**; permission PV-PERM-01 = **C30325** ("a user with the Inventory Reports to View permission can load the report and export it") + PV-PERM-03 = **C30327** (entry visible, data denied) | **COVERED** (except the fractional-precision angle, which belongs to SV-8589 above) |
| **SV-8597** B4 IV | retention prune <=13 months daily to monthly; positive-bins-only qty; as-of resolution; `ROLE_REPORT_VIEW` | IV-API-05 = **C30609** ("daily captures are kept for 0–13 months; older history is reduced to…") and IV-API-06 = **C30610** (thinned history still served by the closest-recorded-day rule); IV-DATE-02/03/04/05/08 = **C30562 / C30563 / C30564 / C30565 / C30568**; IV-API-01..04 = **C30605–C30608** | **COVERED** — note this **closes** the "NEW candidate case LATER" we parked at ingest for IV retention; it was authored in the 2026-07-28 wave |
| **SV-8598** B5 SBC | dedicated atom `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW`, not `ROLE_REPORT_VIEW`; Parts Sales bucket; two-level 10k cap | SBC-PERM-01 = **C30098**, SBC-PERM-02 = **C30099** (dedicated Sales By Customer View permission gates nav *and* direct open), SBC-PERM-03 = **C30100**, SBC-PERM-04 = **C30101** | **COVERED behaviourally.** Two metadata follow-ups only: (a) record the exact atom name in the case metadata at VIU (Rule 20), (b) the **bundle decision is still an open product call** — see section 5 |
| **SV-8599** B6 SBR | immutable rep snapshot; payment 5-to-3 with the deposit/prepaid nuance; (Inactive) still credited; Unassigned pinned; **Esc-to-dismiss decision** | SBR-WO-05 = **C30314** (snapshot WO rep to customer rep to unassigned, later WO change does not re-credit); SBR-STAT-02 = **C30209** — and this one already nails the deposit nuance verbatim: precondition 2 = *"the customer pays a DEPOSIT up front that fully covers the work, so the invoice is created with nothing left to pay"*, expected 1 = *""Paid" includes the paid, the overpaid, AND the prepaid-with-zero-balance invoices"*; SBR-ROW-03 = **C30219** ((Inactive) credit intact); SBR-UNAS-02 = **C30262** (Unassigned pinned top) | **COVERED** — including the prepaid/deposit misclassification risk. **One contradiction to flag** on the Esc behaviour — see section 5 |

**Genuine gaps: 1 area (SV-8589), 2 candidate cases.** Everything else the reopened stories put back in force is already covered.

## 5. Contradictions / things to flag (NOT fixed here — flag, don't fix)

**C-1 — SBR deactivation dialog: Escape key. REAL CONTRADICTION, needs a product ruling.**

- Our case asserts the opposite of the spec requirement: **SBR-DEACT-04 = C30255** (https://shopview.testrail.io/index.php?/cases/view/30255) — *"Cancel and X dismiss the Deactivate dialog; **Escape and clicking outside do not**"*.
- The live story SV-8599 says verbatim: *"S13-R8 wants Esc-to-dismiss but Golden Rule #9 forbids Esc — surface as decision."*
- So the SBR spec (Story 13, S13-R8) wants Esc **to** dismiss; the app-wide Golden Rule #9 forbids Esc; our case chose Golden Rule #9. **Engineering has explicitly escalated this as an unresolved decision, so our case is currently asserting one side of an open question.**
- **Do not edit the case.** This is already question-ready in `build/report-suite/PO-Questions-Chris-ReportSuite-2026-07-27.md` ("SBR Esc vs Golden-Rule"). Action = get Chris Ward's ruling, then align C30255 one way or the other under authorization.

**C-2 — SBC permission bundle: open product call, watch item (not yet a contradiction).**

- SV-8598 verbatim: *"bundle decision (43rd bundle vs ride existing — **product call**)"*.
- Our SBC-PERM-01/02 (**C30098 / C30099**) assert only that a *dedicated* Sales By Customer View permission exists and gates the report — which is correct either way. But **how it is granted** (its own permission bundle vs riding an existing one) is undecided, and the answer changes the tester's setup steps ("give the user X"). Flag for Chris Ward's permission-model confirm (already a question in the same PO doc).

**C-3 — the premise of our own reconciliation is now stale (documentation-level, no case impact).**

- `build/report-suite/epic-sv8582/RECONCILIATION.md` describes SV-8594–8599 as **"OBSOLETE … superseded by the granular user stories"** and their content as **"Historical detail only (superseded)"**. That is no longer true as of 2026-07-29. The *cases* are unaffected (coverage verdicts above hold), but the reconciliation doc's status column and framing should be refreshed by the Report Suite owner so nobody later dismisses B1–B6 as dead.
- Not fixed here: `build/report-suite/**` is owned by another worker this session.

**No other contradictions found.** In particular the two items most at risk of contradicting us — TU sort persistence and the WIP snapshot reader — both **match** our cases exactly.

## 6. Action list for Report Suite

Priority order. Nothing below has been executed (analysis + ingest only; no case edits, no TestRail writes).

| # | Action | Driving ticket (status) | Where it lands | Priority |
|---|---|---|---|---|
| 1 | **Author 2 new PV/QB precision cases** (the one genuine gap): (a) *a part sold in a fractional quantity keeps its exact fractional Units Sold — no rounding to a whole number*; (b) *the QuickBooks journal entry dollar amount for a fractional inventory movement is exact, not multiplied* to go in **"PV — API"** per Rule 4 (HTTP/backend content) or as an API/regression pair. Layman wording, Rule 9 labels VIU-confirmed at the build. | **SV-8589** (In Progress — actively being built, so this will be testable soon) | new cases, `build/report-suite/cases/cases-pv-D-exports-visual-api.json` + id-map + import | **HIGH** |
| 2 | **Get Chris Ward's ruling on the SBR Escape-key conflict** (C-1), then align **SBR-DEACT-04 = C30255** under authorization. | **SV-8599** (Open) | existing `PO-Questions-Chris-ReportSuite-2026-07-27.md` | **HIGH** |
| 3 | **Get Chris Ward's confirm on the SBC permission bundle** (C-2) so the tester's setup step is right. | **SV-8598** (Open) | same PO questions doc | Medium |
| 4 | **Refresh `epic-sv8582/RECONCILIATION.md`**: B1–B6 are Open again, not OBSOLETE/superseded; PR-1 is In Progress. Update the status table (lines ~52–54, 115–120) and drop the "historical detail only" framing. | SV-8594–8599, SV-8589 | `build/report-suite/epic-sv8582/RECONCILIATION.md` (owned by another worker — hand off) | Medium |
| 5 | **Backfill Rule-20 `refs` on the Report Suite suite.** Independent finding from this pass: **0 of 529 local case bodies carry a `refs` field**, and `testrail-id-map.csv` has **no refs column** (columns are `internal_id, testrail_case_id, title, section`). With the 97-story map now re-verified, per-story `<TICKET> (<spec-anchor>)` refs are derivable — the same backfill Schedule already did (`epic-sv8685/backfill_refs.py` is the working precedent). | epic **SV-8582** + per-report stories | `build/report-suite/**` (hand off) + authorized `update_case` wave | Medium |
| 6 | At VIU: record the exact permission atom **`ROLE_SALES_BY_CUSTOMER_REPORT::VIEW`** in SBC-PERM-01/02 (**C30098 / C30099**) metadata, and confirm it live. | SV-8598 | VIU pass | Low (VIU-time) |
