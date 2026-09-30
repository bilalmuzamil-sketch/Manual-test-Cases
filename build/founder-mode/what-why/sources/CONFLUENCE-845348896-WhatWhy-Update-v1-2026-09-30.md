# What Are You Doing / Why Are You Doing It? — source capture

**Confluence page:** 845348896 (space ~Chris Ward) · **Title:** "What Are You Doing / Why Are You
Doing It?" · **Owner/PO:** Chris Ward · **Status:** *Locked for build — 2026-09-16* ·
**Last modified:** Sep 24 2026 · **Epic:** SV-9667 (Founder Mode Batch #1) ·
**Design:** artifact Pz1Q6BfvreYFpQwVQZPTE6 · **Read/captured:** 2026-09-30.

> The **verbatim requirement quotes** for every anchor (S1-R1 … S4-N1, 40 anchors) are stored in
> `../anchor-quotes.json` and are quoted unchanged in each case's "Exact quotes" block (Rule 113).
> This file records currency (Rule 31/32) and the decisions/scope context that shape the cases.

## Stories & Jira
- **S1 The Work Order Line Dialog** — SV-10130 (R1–R7, N1)
- **S2 The ShopCoach Line Builder** — SV-10131 (R1–R3)
- **S3 What Reaches QuickBooks** — SV-10132 (R1–R12 incl R6a/R7a/R9a; N1–N3; E1–E3)
- **S4 The Imports** — SV-10133 (R1 *withdrawn*, R2–R7, N1)

## Business case (why)
The two work-order-line fields are labelled "What are you doing?" / "Why are you doing it?" — those
are prompts, not names. Those questions are printed into the line text that reaches a shop's
QuickBooks records (e.g. `What are you doing?: Replace front brake pads;Why are you doing it?: …;
Tech Story: …`). Two customers asked in writing to remove them (NCCHD SV-6862 open; KMS Mechanics
SV-6582, closed OBSOLETE against unrelated SV-7473 — appears mis-linked, never delivered).

## Key decisions (shape the Expected results)
- Fields named **Title** and **Description** everywhere a person reads them; the two questions survive
  as **placeholders** inside the boxes.
- QuickBooks line text carries **no labels for any of the three values**: `{Title} - {Description} -
  {Tech story}`, joined by a **spaced hyphen**, separator only between two present segments, no
  semicolons. (Rejected: `Title: …;Description: …` — still prints our field names; that Batch-1 build
  never reached develop/release.)
- The narrative (**Tech Story**) also loses its label and semicolon (2026-09-16 ruling reversing
  2026-09-15). "Scope of work" and "Tech Story" labels both rejected (one is half-audience only, the
  other is the label a customer objected to).
- **One builder** feeds both routes (live QuickBooks Online sync + downloadable Customer Invoice
  report), so they can never drift (S3-R4).
- Over-length text shortened from the **end** to **4,000 bytes**, never mid-character, title-first
  (S3-R7); this is the SV-9921 (Unexported Items) failure the rule prevents.
- `Require Tech Story` (Administration → Work Order Settings) governs whether an empty narrative is
  even possible; the literal `Tech story missing.` placeholder is treated as absent (S3-R6).
- Historical invoice import (Administration → Invoices) columns renamed to `*Line Title` /
  `Line Description`; old headers still accepted, may mix (S4).

## Out of scope (do not author cases claiming these change)
Customer-facing estimate/invoice/credit documents (never printed the questions); DB/API field names
(`line_name`, `description`); anything already in QuickBooks (no backfill/re-send); credit memos;
SV-6862's broader field-mapping request; whether the narrative belongs in the books at all.

## Open question (does not block; no case)
"Who downloads the Customer Invoice report, and why?" — owner: owning PM + support. Blocks nothing
(both routes share one builder). All other open questions were answered & closed 2026-09-15/16.

## Manual-runnability note (Rule 114)
S3's joining/shortening rules are observable manually via **Export Reports → Customer Invoice**
(download & read the Description column); the live-sync-only assertions (reaches QuickBooks / not in
Unexported Items) need a shop with an **active QuickBooks Online connection**. Both surfaces share one
builder (S3-R4). No QA branch exists yet, so every case is `AUTOMATION: HOLD`, source-verified only.
