# Founder Mode → What/Why (Title & Description) — PROJECT-STATE

**Feature:** "What Are You Doing / Why Are You Doing It?" — rename the two work-order-line fields to
Title / Description and strip our field names from the text that reaches QuickBooks.
**Epic:** SV-9667 · **Spec:** Confluence 845348896 (*Locked for build 2026-09-16*, read 2026-09-30)
· **PO:** Chris Ward
**TestRail:** Founder Mode = 20434 → **What/Why = 20437**
**Design:** artifact Pz1Q6BfvreYFpQwVQZPTE6 (5 artboards, driven end-to-end — Rule 115)
**Branch:** `claude/slack-session-setup-7v5itm`
**Build:** ❌ No QA branch yet → every case `AUTOMATION: HOLD`, source-verified only (Rule 85).

## What was created — 19 cases, Rule 117, 40 anchors covered 1:1
| Story | Sub-folder (section) | Cases | Case ids |
|---|---|---|---|
| S1 The Work Order Line Dialog | 20461 | 4 | C154707–C154710 |
| S2 The ShopCoach Line Builder | 20462 | 2 | C154711–C154712 |
| S3 What Reaches QuickBooks | 20463 | 10 | C154713–C154722 |
| S4 The Imports | 20464 | 3 | C154723–C154725 |
| **Total** | | **19** | C154707–C154725 |

40 PRD requirement anchors (S1-R1 … S4-N1) covered 1:1 — no gap, no duplicate, no extra (verified by
script vs `anchor-quotes.json`).

## Coverage verdict (Rule 115)
- **PRD (Confluence 845348896):** ✅ 100% — all 40 anchors covered 1:1. R1 of S4 ("Withdrawn") is
  covered as the negative "no separate work order import carries these columns".
- **Design (5 artboards, driven):** ✅ CONFIRM — New Line / Edit Line dialogs, Title */Description
  labels, "What are you doing?" / "Why are you doing it?" placeholders (sentence case), the
  before/after QuickBooks line text (spaced-hyphen join, no semicolons), AI SHOPCOACH LINE BUILDER.
  No DIVERGE.
- **Tech plan:** none supplied. N/A.
- **Epic/stories (SV-9667):** ✅ four stories (SV-10130…10133) map 1:1 to the four sub-folders.

## Manual-runnability (Rule 114)
S3's joining/shortening rules are read manually via **Export Reports → Customer Invoice** (download,
read the Description column; needs "Invoicing & payments - View"). The live-sync-only assertions
(reaches QuickBooks / not in Unexported Items) need a shop with an active QuickBooks Online
connection; both surfaces share one builder (S3-R4). All HOLD until a QA build exists.

## Outstanding
- No QA build / no tech plan for What/Why → all 19 HOLD; build-verify when a branch exists.
- Nothing else outstanding.
