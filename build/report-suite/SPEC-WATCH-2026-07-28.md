# Report Suite — SPEC-WATCH (video-driven items awaiting Chris Ward's spec ratification)

> **STANDING INSTRUCTION: on ANY Report Suite touch, re-check the 6 Confluence spec pages for
> the items below. If by the DEADLINE = 2026-08-04 (1 week from 2026-07-28) they are still NOT
> in the specs, REMIND THE USER and offer the backup-recovery option** (restore the original
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
- **DEADLINE 2026-08-04 STANDS** — if the promised spec changelog has NOT landed by then, remind
  the user (the recovery option now includes `chris-update-2026-07-29/backup/`).
- **2026-07-29: WIP-identifier question SENT to Chris by the user — ANSWERED the same day: "A is
  the correct answer" (VIN chain for WIP too).** Verbatim + standing notes:
  `chris-update-2026-07-29/wip-identifier-answer-2026-07-29.md`. WIP-COL-05 C30470 / WIP-FLT-03
  C30500 / WIP-SORT-03 C30485 + WIP-EXP-07 C30516 flipped LOCALLY (push queue wave 2, awaiting
  authorization). His spec update is NOT hand-reviewed yet — verify the WIP identifier text in the
  changelog re-diff.

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
3. **If 2026-08-04 arrives with items still unratified: REMIND THE USER** — options are (a) keep
   the video-authoritative wording and chase Chris, or (b) recover the original cases from the
   backup folder (MANIFEST.md has per-case instructions).
4. This file is referenced from PROJECT-STATE.md — keep both in sync.
