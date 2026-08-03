# Report Suite — SPEC-WATCH (video-driven items awaiting Chris Ward's spec ratification)

## 🔴 THERE IS NO DEADLINE — RE-VERIFIED LIVE 2026-08-03: 8 ITEMS **NOT DONE**

> **QA lead's ruling, verbatim, 2026-08-03 — this REPLACES the "deadline 2026-08-04" framing used
> everywhere below:** *"There is nothing due tomorrow, if something he was supposed to do should have
> been done by now, you need to check. If that has not been done consider it not done."*
>
> **So: an item is either IN the live spec or it is NOT DONE. No grace period, no "due tomorrow".**
> Every mention of "DEADLINE 2026-08-04" further down this file is **superseded by that ruling** —
> the dates are left in place only as the historical record of what was promised when.
>
> **The verification was done LIVE against Confluence on 2026-08-03, not against this file.** Full
> evidence, with every requirement quoted verbatim:
> **`spec-watch-verification-2026-08-03/VERIFICATION.md`** (+ the additive capture
> `spec-watch-verification-2026-08-03/live-capture-2026-08-03/`).
>
> ### Status as of 2026-08-03 — DONE 5 · NOT DONE 8 · PARTIAL 2
>
> | # | Item | Verdict 2026-08-03 (live) |
> |---|---|---|
> | 1a | Asset identifier VIN chain — SBC | ✅ **DONE** — closed |
> | 1b | Asset identifier — WIP | ❌ **NOT DONE** — S4-R7/R8/R9 + §4 still unit-number-first. **He has now twice believed he made this edit.** |
> | 2 | SBC Print removed | ✅ **DONE** — but **NEW:** S18-R7 and S18-R10 still list "Print" as an export |
> | 3 | SBC Summary/Expanded downloads | ✅ **DONE** |
> | 4 | Location filter hidden when ≤1 location | ❌ **NOT DONE** — SBR S21-N1 / TU S9-N1 / IV S7-N1 / PV S2-E4 all still say "still sees the filter". **Highest risk: the spec text contradicts his own Q1=A answer.** |
> | 5 | Per-row Location column | ✅ **DONE** on all six |
> | 6 | Nav placement — TU below existing links | ⚠️ **PARTIAL** — Performance group named, "additive/below existing" absent |
> | 7 | Catalogue rename → "Special Order" | ✅ **DONE** |
> | 8 | WIP asset-dropdown native style + toggle | ❌ **NOT DONE** — zero case impact |
> | 9 | Customer card "Sales Representative" | ❌ **NOT DONE** — S19-R7 still "Sales Rep". **NEW:** now half-applied — S1-R1 carries the ruling, S19-R7/R1/R8 + both CSV header lists do not |
> | 10 | SBC Performance group + named anchors | ❌ **NOT DONE** — SBC S1-R1 names no group at all (SBR/TU/WIP do) |
> | 11 | PV S1-R1 "only report" inconsistency | ❌ **NOT DONE** |
> | 12 | Rep-label scope | ⚠️ **ANSWERED by Chris (Q5=A); spec only half-applied** — see 9 |
> | **13** | **NEW ITEM — the ONE-PERMISSION model** (Chris Q2=A + QA lead *"ONE permission FOR NOW"*) | **SBC ✅ DONE** (v13, 2026-07-31, S1-R2 rewritten). **PV / TU / WIP / IV ❌ NOT DONE** — all four still name a per-area permission. **SBR N/A** (never named one). **16 of our cases are ahead of 4 spec pages.** |
>
> **ZERO of our test cases need changing.** Every NOT DONE item is one where we correctly followed
> his newer video / answer / ruling (Standing Rule 32) and **the spec text is what is behind.** The
> recovery option (restoring the pre-video case wording from
> `video-promotion-backup-2026-07-28/`) is therefore **NOT recommended** — it would move our cases
> away from the newest authoritative source.
>
> **SPEC CURRENCY 2026-08-03:** only **SBC** has moved since 2026-07-31 (**v12 → v13**, and our
> 07-31 mirror was **STALE**, still carrying the abolished dedicated-permission sentence — refreshed
> additively). SBR v15 · PV v4 · TU v5 · WIP v6 · IV v3 are **unchanged** (all `lastModified`
> 2026-07-29) and their mirrors are current.
>
> **⚠️ Version integers could not be read this run** — the Atlassian MCP exposes `lastModified` only,
> and the REST cookie file is gone (`/tmp` is ephemeral). **Re-supply Confluence cookies** for true
> version reads.

## ✅⚠️ RE-DIFF RUN 2026-07-31 — THE PROMISED CHANGELOG LANDED; 6 OF 12 ITEMS STILL OPEN

Full evidence: **`spec-current-2026-07-31/SPEC-DIFF-2026-07-31.md`** (+ the six `*-current.md`
captures and `*-raw-unified.diff` files). Live Confluence read verified (`/rest/api/3/myself` →
200); capture pipeline validated 6/6 byte-identical against the 2026-07-28 baseline, so every
difference is a real Chris edit.

**All six pages moved on 2026-07-29, each with a new dated Change Log row** — SBC v11→**v12**,
SBR v14→**v15**, PV v3→**v4**, TU v4→**v5**, WIP v5→**v6**, IV v2→**v3**.

| # | Item | Verdict 2026-07-31 |
|---|---|---|
| 1a | Asset identifier VIN → Unit # → plate — **SBC** | ✅ **RATIFIED** (S8-R7…R10 rewritten) — CLOSED |
| 1b | Asset identifier — **WIP** | ❌ **STILL-MISSING / spec text contradicts** — §4, S4-R7/R8/R9, S7-R4 still unit-number-first. **He believed he had made this edit; he had not.** His later 2026-07-29 answer ("A is the correct answer") is the newer source and STANDS. **STAYS OPEN.** |
| 2 | SBC Print removed | ✅ **RATIFIED** (`Story 16: (removed — Print retired)`) — CLOSED |
| 3 | SBC Summary/compressed download | ✅ **RATIFIED + EXTENDED** to four menu items — CLOSED |
| 4 | Location FILTER hidden when ≤1 location | ❌ **CONTRADICTED in spec text** (SBR S21-N1, TU S9-N1, IV S7-N1, PV S2-E4 all still "still sees the filter") — **but Chris's Q1 answer 2026-07-31 = A (hidden), which WINS.** Spec text needs his fix. **STAYS OPEN.** |
| 5 | Per-row Location label in the all-locations view | ✅ **RATIFIED on all six** + "Locations:" export line + constant-width filter — CLOSED |
| 6 | Nav placement (TU below existing links) | ⚠️ **PARTIAL** — Performance group named, "additive/below existing" wording absent. **STAYS OPEN.** |
| 7 | Catalogue rename | ✅ **RATIFIED as "Special Order"** — CLOSED |
| 8 | WIP asset-dropdown native style + toggle | ❌ **STILL-MISSING** (note-only, zero case impact). **STAYS OPEN.** |
| 9 | Customer-card "Sales Representative" | ❌ **STILL-MISSING** — S19-R7 still "Sales Rep". Chris's Q5 answer = A (full word everywhere) WINS. **STAYS OPEN.** |
| 10 | SBC Performance group + named nav anchors | ❌ **STILL-MISSING**. **STAYS OPEN.** |
| 11 | PV S1-R1 "only report" inconsistency | ❌ **STILL-MISSING**. **STAYS OPEN.** |
| 12 | Rep-label scope | ✅ **ANSWERED by Chris (Q5 = A)**, not by the spec — CLOSED as a question |

**~~DEADLINE 2026-08-04~~ — SUPERSEDED by the QA lead's ruling 2026-08-03 (see the top of this file): there is no deadline; not-in-the-spec = NOT DONE. The 2026-07-31 verdict below is retained as the historical record.** Verdict that day: partly met. The changelog he promised DID land on time on all
six pages. **But the watch CANNOT retire:** items **1b, 4, 6, 8, 9, 10, 11** still need spec text.
**The one to put in front of him first is 1b** — he told us he had already updated the WIP
identifier text and he had not; our WIP cases follow his answer, so the spec and the cases are out
of step until he edits it. Items 4 and 9 are the other two where the spec text now actively
CONTRADICTS a ruling he gave us afterwards.

**NEW deltas found in this changelog that were never on the watch list** (they drive case work —
see `chris-answers-2026-07-31/DELTAS.md`): PV "Sold via WO"→**"Sold (WO)"** / "Sold via Parts
Sale"→**"Sold (Parts Sale)"**; TU **Story 10 Column Selection** + Est. Lost Labor now hideable +
toolbar order changed + PDF **bundled-default logo**; SBC export **filenames** + PDF header
"Locations:" line (reversing old S15-R11); WIP Location column **removed from the column
selector**; the suite-wide per-row Location column; and **mojibake** in the SBR/PV spec text
(`â‹¯`, `â “˜`) to report to Chris (cosmetic, no case change).

---


> **STANDING INSTRUCTION: on ANY Report Suite touch, re-check the 6 Confluence spec pages for
> the items below. ~~If by the DEADLINE = 2026-08-04…~~ — SUPERSEDED 2026-08-03: there is NO
> deadline. If an item he was supposed to do is not in the live spec, it is **NOT DONE** — say so
> and REMIND THE USER. The backup-recovery option is available but is NOT recommended (it would
> move our cases off the newest authoritative source — Rule 32)** (restore the original
> case wording from `build/report-suite/video-promotion-backup-2026-07-28/` — per-case
> instructions in that folder's MANIFEST.md).

Created 2026-07-28. Basis: user ruling 2026-07-28 — Chris Ward's kickoff video is authoritative
product intent and NEWER than the specs (last updated 2026-07-21), so the cases were edited
LOCALLY to the video; Chris said on the call he would update/double-check the spec for most of
these. The six pages to re-check (Confluence, via Atlassian MCP `getConfluencePage` — pageIds):
SBC 577634305 · SBR 585629698 · PV 620888066 · TU 641400833 · WIP 703660034 · IV 720142338.
Spec state as of 2026-07-28 for every item = NOT ratified (see
`spec-current-2026-07-28/SPEC-DIFF-SUMMARY.md` Table B).

**Backup location for ALL items:** `build/report-suite/video-promotion-backup-2026-07-28/`
(verbatim pre-edit bodies + MANIFEST.md).

## ⚡ UPDATE 2026-07-29 — Chris ratification IN PROGRESS (group message, Chris Ward 8:53 AM 2026-07-29)

Chris announced he is actively editing the specs now: "This will slightly change all specs with an
appropriately updated changelog" — **spec changelog expected ~2026-07-30** (spilled from 2026-07-29
night; "high priority in my mind"). The companion visualization video spills to the same night.
Verbatim message + ingest: `chris-update-2026-07-29/chris-message-2026-07-29.md`; local case edits:
`chris-update-2026-07-29/` (backups in `backup/`). **CAVEAT: the message's change summary was
written by Chris's assistant and is "pending a human-eye-pass" — when the real spec changelog
lands, RE-RUN the spec capture+diff (`spec-current-2026-07-28/` method) and VERIFY the assistant
summary against the actual changelog before treating any item as final.**

Message-level effect on the watch items (message = spec-INTENT confirmed; spec TEXT still pending):
- **#1 serial identifier — SUPERSEDED EVERYWHERE (updated 2026-07-29, answer):** assets identified
  by **VIN (falls back Unit #, then plate)**, not serial (SBC-LBL-01 C30134 re-edited). **WIP
  question ANSWERED = A** (Chris Ward 2026-07-29: "A is the correct answer" — verbatim + standing
  notes in `chris-update-2026-07-29/wip-identifier-answer-2026-07-29.md`): **WIP ALSO uses the VIN
  chain** — WIP-COL-05 C30470 / WIP-FLT-03 C30500 / WIP-SORT-03 C30485 flipped off the video's
  serial ruling + WIP-EXP-07 C30516 caveat re-based (all LOCAL, awaiting push authorization).
  Chris's standing notes: the VIN → Unit # → plate chain is the **STANDARD for all reports and all
  future work** ("keep this in mind for all actions moving forward"); terminology caution — for
  non-vehicle assets (e.g. a generator) the VIN field is effectively the serial number (label stays
  "VIN"). **Chris updated the spec before bed but has NOT hand-reviewed it — the changelog re-diff
  must confirm the WIP identifier text too.**
- **#2 SBC Print removed — CONFIRMED** by the message ("The Print option is removed.").
- **#3 SBC compressed download — CONFIRMED + EXTENDED:** Summary AND Expanded versions for BOTH
  PDF and CSV, four exact menu items (SBC-EXP-16 C38856 + SBC-EXP-01 C30159 reshaped).
- **#7 Catalogue rename — CONFIRMED with the exact label "Special Order"** (Type filter, Type
  column, export; PV-FILT-01/09, PV-ROW-05, PV-EXP-08 updated). The matching Parts Sales dropdown
  rename is OUT of this suite's scope (FYI only).
- **NEW watch items from the message:** (a) "Locations:" line in every CSV+PDF + on-screen scope
  indicator, all 6 reports; (b) same logo treatment all reports (PV-EXP-05 C30379 extended — PV had
  no logo coverage); (c) TU column selector added (NEW case TU-COL-01, no C-ID yet); (d) SBR
  spec gets a padding-issue flag (purely visual, no case).
- ~~**DEADLINE 2026-08-04 STANDS**~~ — SUPERSEDED 2026-08-03 (no deadline; not-in-spec = NOT DONE). Historical: if the promised spec changelog has NOT landed, remind
  the user (the recovery option now includes `chris-update-2026-07-29/backup/`).
- **2026-07-29: WIP-identifier question SENT to Chris by the user — ANSWERED the same day: "A is
  the correct answer" (VIN chain for WIP too).** Verbatim + standing notes:
  `chris-update-2026-07-29/wip-identifier-answer-2026-07-29.md`. WIP-COL-05 C30470 / WIP-FLT-03
  C30500 / WIP-SORT-03 C30485 + WIP-EXP-07 C30516 flipped LOCALLY (push queue wave 2, awaiting
  authorization). His spec update is NOT hand-reviewed yet — verify the WIP identifier text in the
  changelog re-diff.

## ⚡ UPDATE 2026-07-30 — COMPANION VIDEO DELIVERED (the expected artifact from the 2026-07-29 message)

The PRD/Spec Companion video arrived 2026-07-30 (Loom
https://www.loom.com/share/e4a3ad01912048c0bba88f1a02677004; transcript =
`chris-update-2026-07-29/companion-video-transcript-2026-07-30.md`; delta analysis =
`chris-update-2026-07-29/companion-video-deltas-2026-07-30.md`) — the "companion video expected"
item CLOSES. **The spec changelog LANDED 2026-07-29 (verified 2026-07-31); the ~~deadline 2026-08-04~~ framing is SUPERSEDED 2026-08-03 — see the top of this file.**
New watch items from the companion video (added to the checklist below):
- **#9 customer-card label "Sales Representative"** (video C17, 10:53–11:12 FIRM): S19-R7
  currently says a "Sales Rep" row — must be re-worded in the changelog. Case edited:
  SBR-WO-06 C30315.
- **#10 SBC Performance group + named anchors** (video C4, 01:18–02:05): the SBC spec names NO
  nav group; TU/WIP/SBR specs don't name the anchor items (Sales, Technician Efficiency,
  Advisor Analysis, Shop Efficiency). Cases edited: SBC-NAV-01 C30096, TU-NAV-01 C30392,
  SBR-NAV-01 C30195, WIP-TAB-01 C30451.
- **#11 PV S1-R1 "only report" inconsistency** (video C2b, 00:35–01:18): PV S1-R1 says PV is
  the Parts section's "first (and, in this release, only) report" but IV S1-R1 puts IV under
  Parts too — intra-suite inconsistency, settled by the video (both under Parts); the PV
  sentence needs correcting. Case edited: PV-NAV-01 C30322.
- **#12 Rep-label scope** (video C15, 09:41–10:10 PENDING): how far "Representative, the full
  word" reaches (WO selector "Sales Rep" S19-R1/R8; "Sales Rep Assignments" export S15) —
  question Q5 on PO-Questions-Chris-ReportSuite-TechPlan_2026-07-30 awaiting Chris. No case
  label flipped beyond the customer card.
- **C20 note:** the video's soft snapshot-indicator ruling ("if snapshot data is taken, we
  don't need to see this… only… offline… or no snapshot") CONFIRMS the current IV S5-R5/R6
  conditional "As of" indicator + the ratified PV/WIP label removal — NO contradiction, no case
  change; if the changelog touches the As-of indicator, re-diff against this ruling. The
  "offline" nuance is spec-silent — VIU-watch only.

## Watch checklist

| # | In spec? (re-check) | Item (video anchor) | What to look for in the spec | Affected cases (internal + C-id) |
|---|---|---|---|---|
| 1 | ☐ | **Asset identifier** (P24 serial, 29:54–30:46 — SUPERSEDED 2026-07-29 by the VIN chain: message for SBC + Chris answer A for WIP) | SBC S8-R8 + WIP S4-R7/S4-R9/S7-R4/S7-R5/§4 changed to **VIN, falling back to Unit #, then plate** (NOT serial — Chris's spec edit is not hand-reviewed; verify the WIP text explicitly) | SBC-LBL-01 C30134 (+ LBL-02 C30135 / LBL-03 C30136 / LBL-04 C30137 notes), WIP-COL-05 C30470, WIP-FLT-03 C30500, WIP-SORT-03 C30485, WIP-EXP-07 C30516 |
| 2 | ☐ | **SBC Print removed** (P25, 31:14) | SBC Story 16 deleted / S14-R1 menu no longer lists "Print" | SBC-EXP-01 C30159, SBC-EXP-14 C30172, SBC-EXP-13 C30171 (DELETED from TestRail 2026-07-28, user-authorized "Push ALL"; body kept locally Retired — restore via add_case from consolidation-backup if Print is ever re-ratified) |
| 3 | ☐ | **SBC compressed (summary) download** (P21, 32:10–33:03 + 48:39) | SBC Stories 14/15 gain a Summary/Compressed download option | SBC-EXP-16 = C38856 (added to TestRail 2026-07-28, user-authorized; delete_case C38856 to recover if never ratified) |
| 4 | ☐ | **Location filter HIDDEN when ≤1 permitted location** (P33, 46:10–46:28) | SBR S21-N1 / TU S9-N1 / IV S7-N1 / PV S2-E4 "still sees the filter" reversed, or a custom-roles gating section added | SBR-LOC-04 C30216, TU-LOC-05 C30446, IV-LOC-04 C30577, PV-FILT-13 C30340 |
| 5 | ☐ | **Per-row location label in All-locations view** (P10, 40:58–41:20) | A location label/column added on the five non-WIP reports (WIP already has one, S4-R1) | SBC-LOC-03 C30111, SBR-LOC-03 C30215, PV-FILT-10 C30337, TU-LOC-01 C30442, IV-LOC-01 C30574 |
| 6 | ☐ | **Nav placement: TU below existing links; Parts section** (P2/P3, 04:32–05:19) | TU S1-R1 (or a suite nav note) pins "below existing items / additive not interruptive"; Parts section already in PV/IV specs | TU-NAV-01 C30392 (PV-NAV-01 C30322 / IV-NAV-01 C30534 already spec-matching) |
| 7 | ☐ | **Catalogue rename** (P31, 43:34–44:12 — latest-info edit; rename NOT final) | PV S2-R1/S2-R8/S3-R5 "Catalogue" renamed (short special-order-parts name) or explicitly kept | PV-FILT-01 C30328, PV-FILT-09 C30336, PV-ROW-05 C30345, PV-EXP-08 C30382 (notes) |
| 8 | ☐ | **Asset-dropdown = native style + toggle** (P12, 15:49–16:54 — latest-info note; Chris: "happy to update the spec") | WIP S7 (and any SBC asset-filter spec text) pins the native-consistent multi-select (+ toggle) | WIP-FLT-03 C30500 (note only — no case asserts either style) |

Also watched (no case edit hung on it): **pagination stands on every page** (P30, 45:05 — a
later infinite-scroll revisit would change PV-API-01 C30388 / PV-API-02 C30389).

## What to do at each re-check

1. Read the six pages' change-logs (they must be updated on every change — video P39).
2. For each ☐ item found ratified: tick it here, move the case(s) forward (authorized TestRail
   push + live VIU), and note the spec version.
3. **If an item is not in the live spec, it is NOT DONE — REMIND THE USER (no deadline; QA-lead
   ruling 2026-08-03).** Options are (a) keep the video/answer-authoritative wording and chase
   Chris — **recommended, Rule 32**, and what we do today — or (b) recover the original cases from
   the backup folder (MANIFEST.md has per-case instructions), which is NOT recommended.
4. **Latest live verification: `spec-watch-verification-2026-08-03/VERIFICATION.md` (2026-08-03).**
4. This file is referenced from PROJECT-STATE.md — keep both in sync.
