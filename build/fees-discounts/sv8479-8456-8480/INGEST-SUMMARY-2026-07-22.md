# Fees & Discounts — Ingest Summary: SV-8479 / SV-8456 / SV-8480 (2026-07-22)

> **Project:** Fees & Discounts V1 (ShopView) · **Epic:** SV-7387 · **PO:** Chris Ward.
> **Scope:** three related F&D tickets, ingested ENTIRELY from local capture
> `/tmp/fd-tickets/*` (no Jira login / no network). Per-ticket detail lives in the
> sibling `requirements-SV-8479.md`, `requirements-SV-8456.md`, `requirements-SV-8480.md`.
> Attachments copied into `attachments/SV-8479/` (46), `attachments/SV-8456/` (7),
> `attachments/SV-8480/` (1) — all app-UI PNGs only (no credentials/OTP/email screenshots).

---

## At-a-glance

| Ticket | Type | Status | Parent | Nature | Delta / action |
|---|---|---|---|---|---|
| **SV-8479** | Story Defect | **Rejected from Testing** (re-opened for item #1) | SV-8288 (predecessor SV-8456) | 20 frontend-only UI corrections (WO 1–12, Parts Sale 13–20) | **NEW work** — author cases + live staging VIU, esp. item #1 re-open |
| **SV-8456** | Story Defect | **Done** | SV-8288 | 8 frontend-only UI corrections + Settings→Service permission pivot | **NO DELTA** — fully covered by 2026-07-21 work |
| **SV-8480** | Story Defect | **Done** (QA Passed, Staging_Verified) | SV-8279 | Display-only line-total summation bug (S3-R18) | **NEW work** — author calc case(s) + live staging VIU |

---

## SV-8479 — F&D UI corrections #2 (Story Defect, REJECTED FROM TESTING)

- **Parent:** SV-8288 (Story 12: Visual rules). **Predecessor:** SV-8456 (Done) — this is the second pass.
- **Reporter:** Chris Ward · **Assignee:** Nikola Milosevic · Priority Medium.
- **Scope:** 20-item UI-corrections list, frontend-only (labels/placement/styling; backend
  & calculations unaffected). **Items 1–12 = Work Order screen; items 13–20 = Parts Sale screen.**
  Highlights: labor entry-point moved to a three-dot menu on the LEFT of the first assigned
  technician / "Unassigned" ("Add Labor Fee / Discount"); part-row + parts-sale menu labels
  ("Add Part Fee / Discount"); blank left-column label; remove all colored badges/pills →
  plain text with the sign convention (percentage discounts "−X%", fees "X%" no sign, flat =
  name only); card verbiage/brackets; WO card disclaimer; Financial-Info "Fees & Discounts (N)"
  line directly above Subtotal (hidden when zero); modal title/subline rewording; Stats/Statistics
  "%" and "Amount" column headings; remove the redundant "+ Add" button on the parts-sale column.
- **QA verdict (staging, Ahtasham Amjad, 2026-07-22):** **19 of 20 items PASS.** **ONLY item #1
  FAILS** — the labor entry-point three-dot landed to the RIGHT of "Unassigned" but must be to
  the LEFT. That single miss is the **sole re-open reason**; the ticket was rejected from testing
  for item #1 only ("Rest looks good").
- **Regression preserves (NOTES):** the **jurisdiction tax note** in the dialogs ("Tax treatment
  varies by jurisdiction — confirm your local requirements before saving.") and the **"Pass
  convenience fee to customer" banner** must remain.
- **Attachments:** **54 total → 46 unique** (8 byte-identical duplicates NOT re-copied); 46 copied
  into `attachments/SV-8479/`. Two series: PO before/after "Picture" shots (RED = current/bug,
  GREEN = expected) + the QA staging verification series (per-item ✅, item #1 flagged 🔴). All
  app-UI PNGs.
- **⚠️ AUTHORING FLAG:** the description references a **"Picture 26"** ("Picture 26 shows the
  three-dot context" for the parts-sale whole-sale entry point, item 19) that was **NOT attached**
  to the ticket (only Picture 27 red is present). Flag for authoring — do not invent its content.

## SV-8456 — F&D UI corrections #1 (Story Defect, DONE)

- **Parent:** SV-8288 · Epic SV-7387 · Reporter/Assignee Stefan Vukovic · PO Chris Ward.
  Labels: QAcomplete_Ahtasham_Amjad, Staging_Verified, fees-discounts.
- **Scope:** **8 frontend-only UI corrections** (Taxable → Yes/No dropdown; Auto-apply → checkbox
  + caption; modal field order; Settings table plain-text/left-aligned no badges; nav placement
  under **Service** below Canned Lines; WO/Parts-Sale adjustments cards ABOVE Financial Info; WO
  card titled "Work Order Fees & Discounts"; Customer tab mirrors Settings styling minus
  convenience toggle) **PLUS the Settings→Service permission pivot** (the "main behavioral change"
  per comment #1: a Service user sees + manages F&D; a Finance-only user no longer sees the nav
  item and cannot reach `/administration/adjustment-templates`).
- **DELTA VERDICT: NO DELTA — fully covered by our 2026-07-21 SV-8456 UI-correction staging VIU pass.**
  That pass reworded **34 cases** (update_case 34/34, 200 + re-GET MATCH), **0 deviations**, no
  status flips, and reconciled the two dev-authored automated cases **C29922 / C29923** into the
  id-map as **FD-PERM-012 / FD-PERM-013** (mirrored dev_authored, no duplicates). Every ticket
  Expected Result maps 1:1 to that work. QA-Result comment #3 (2026-07-22) is a pure pass/confirm,
  no new/changed requirement.
- **Intra-ticket inconsistency noted:** the Description's Expected-Result and QA-comment #3 say the
  gate is "unchanged (Settings → Finance + FeesAndDiscounts flag)", while the QA-Handoff comment #1
  calls the **Settings → Service** pivot the "main behavioral change." The build and our live VIU
  implement the **Service** gate → **Service is authoritative (newer-wins)**; the "Finance-unchanged"
  phrasing is stale ticket prose. Our implementation is correct; no change needed.
- **Attachments:** 7 total (6 unique + 1 byte-identical duplicate, 58882 = dup of 58883), all copied
  into `attachments/SV-8456/` with readable names. All app-UI PNGs.

## SV-8480 — Fees/Discounts do not sum on the line total (Story Defect, DONE)

- **Parent:** SV-8279 (Story 3: Viewing and managing fees & discounts on the work order) · Epic
  SV-7387 · Reporter Chris Ward · Assignee Stefan Vukovic · QA Passed, Staging_Verified.
- **The bug:** display-only line-total **summation bug** — the collapsed line Total summed
  **Labor + Parts (gross) only** and ignored that line's own fee/discount amounts, so the total was
  understated.
- **The rule that must hold — spec S3-R18:** **Line Total = Labor (gross) + Parts (gross) + every
  one of that line's own signed fee/discount amounts** (fees add, discounts subtract), using exactly
  the amounts shown in the rows beneath the line. Additional ACs: line with no fees/discounts →
  unchanged; estimate/invoice documents unchanged (fees print as own rows, no double-count); org
  without the F&D feature flag → line totals unchanged (gross-only).
- **Worked example (must hold):** Labor $250.00 + labor fee "ttt" +20% $50.00 + Part $20.00 + part
  fee "test" +11% $2.20 = **$322.20** — the pictured line must show **$322.20, not $270.00**.
- **Dev fix:** Stefan Vukovic — backend per-line `total_cost` now adds the signed fee/discount
  amounts on top; **display-only, no stored values change**; PR ShopView/shopview **#2228** merged
  to develop (staging). **QA Passed on staging** (Ahtasham Amjad, 2026-07-22).
- **Attachments:** **2** — (1) `image-20260722-031940.png` app-UI screenshot of the "$270" bug line
  (ANALYZED, copied to `attachments/SV-8480/`); (2) `8480-staging fixed.webm` (20.56 MB post-fix
  verification video) **referenced-only — NOT copied** (size; no ffmpeg/ffprobe available to extract
  frames → not analyzed here; lives at `/tmp/fd-tickets/SV-8480/att/58837.webm`, app-UI only).

---

## PROCESS PLAN (proposed, for user confirmation)

- **SV-8479** = author NEW test cases (20 UI-correction items, WO 1–12 + Parts Sale 13–20) + live
  staging VIU — **especially item #1 re-open** (labor entry-point must sit LEFT of "Unassigned");
  carry the jurisdiction-note + convenience-fee-banner regression checks; flag the missing "Picture 26".
- **SV-8480** = author NEW calc case(s) for the line-total summation rule S3-R18 + live staging VIU
  of the summation (verify $322.20 worked example, discounts subtract, no-fee line unchanged,
  document grand-total no double-count, flag-off gross-only).
- **SV-8456** = **no new cases** (current) — already fully covered by the 2026-07-21 pass; optional
  re-VIU only if the user wants re-confirmation.

*(Per Standing Rule 11, confirm which process(es) to run — BUILD-ACCURATE-WORDING-VIU and/or
SPEC-RELEVANCE-RECONCILIATION — before proceeding.)*

---

## Traceability (Rule 20)
- **SV-8479:** Story Defect (Rejected from Testing) · Parent SV-8288 (Story 12) · Epic SV-7387 ·
  Predecessor SV-8456 · spec anchors = items 1–20 + NOTES.
- **SV-8456:** Story Defect (Done) · Parent SV-8288 · Epic SV-7387 · spec anchors = 8 corrections +
  Settings→Service permission pivot (C29922/C29923 = FD-PERM-012/013).
- **SV-8480:** Story Defect (Done) · Parent SV-8279 (Story 3) · Epic SV-7387 · spec anchor **S3-R18**.

## Secret scan (this ingest)
Tree `build/fees-discounts/sv8479-8456-8480/` scanned for the known account password, OTP codes,
cookie/token/session values, and 40+ hex secrets → **CLEAN** (no secret values; the only cookie-name
matches are placeholder references VALUE_1/2/3 in the resolved INGEST-BLOCKED.md). All 54 attachments
verified `PNG image data` — app-UI screenshots only, no email/OTP screenshots.
