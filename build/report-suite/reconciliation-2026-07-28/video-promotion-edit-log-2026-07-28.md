# Report Suite — video-promotion per-case edit log (2026-07-28)

**USER RULING 2026-07-28:** Chris Ward's kickoff video is AUTHENTIC and AUTHORITATIVE product
intent (created for Chris Amani, company Vice President). It is NEWER than the six Confluence
specs (video 2026-07-28 context vs specs last updated 2026-07-21), so by the last-update-wins
rule **the VIDEO overrides the spec where they conflict**. The previously PENDING-CHRIS
change-list rows are hereby promoted to actionable and applied as **LOCAL case edits only**.

**NO TestRail writes were made in this pass (Rule 6)** — every edit below lives only in
`build/report-suite/cases/*.json`; the change-list remains the approval gate for the eventual
authorized `update_case` / `add_case` / `delete_case` push. Run R359 untouched.

Sources quoted below: driving video wording from
`chris-answers-2026-07-28/loom-kickoff-transcript.md` (timestamps) and the overridden spec
wording from `spec-current-2026-07-28/SPEC-DIFF-SUMMARY.md` + the six `*-current.md` captures
(Rule 25). Tickets = epic SV-8582 child stories (Rule 20; `epic-sv8582/INGEST-SUMMARY.md`).
Applier script: `apply_video_promotion_2026-07-28.py` (one-shot, guarded).

Concise-title rule: every touched case's title is ≤80 chars (one deliberate exception:
SBC-EXP-13, left as authored because it is Retire-Proposed — see its entry).

---

## P24 — Serial number replaces unit number as the asset identifier (7 cases)

**Driving video wording (29:54–30:46):** "Using unit number as an identifier is not best in
class. … One thing that always remains the same, the holy grail as we like to call it for unit
identification, is the serial number, or in some cases the bin number. … it's one and the same.
Interchangeable terminology. … One thing that always remains the same is the serial number. So
that is the identifier … I need to change this on my local to actual serial number."

| # | Case | C-id / link | Edit | Overridden spec wording (Rule 25) | Refs (Rule 20) |
|---|---|---|---|---|---|
| 1 | SBC-LBL-01 | [C30134](https://shopview.testrail.io/index.php?/cases/view/30134) | Title/preconds/steps/expected REWRITTEN: the identifier after year/make/model is now the SERIAL NUMBER; the missing-serial fallback is flagged "confirmed in the build" (not invented, Rule 9). Title 71 chars. | SBC S8-R8: suffix priority "· Unit {unit}" → "· {plate}" → "· VIN …{last 8}" → none (unit number first). | SV-8606 (S8-R7; S8-R8 — overridden by video P24 29:54–30:46) |
| 2 | SBC-LBL-02 | [C30135](https://shopview.testrail.io/index.php?/cases/view/30135) | Notes + refs only — the S8-R9 rule (no year/make/model ⇒ label = VIN on its own) is NOT itself overridden by the video; flagged for re-confirm once the serial identifier ships. Tester text unchanged. | (none overridden — context edit) | SV-8606 (S8-R9) |
| 3 | SBC-LBL-03 | [C30136](https://shopview.testrail.io/index.php?/cases/view/30136) | Notes + refs only — "Unknown Asset" rule (S8-R10) kept; flagged that "unknown" may now also require no serial number; re-confirm in build. | (none overridden — context edit) | SV-8606 (S8-R10) |
| 4 | SBC-LBL-04 | [C30137](https://shopview.testrail.io/index.php?/cases/view/30137) | Notes + refs only — (#1)/(#2) duplicate rule (S8-R11) kept; seeding note updated (serials are unique, duplicates rarer). Overlong title shortened to 73 chars (case touched). | (none overridden — context edit) | SV-8606 (S8-R11) |
| 5 | WIP-COL-05 | [C30470](https://shopview.testrail.io/index.php?/cases/view/30470) | Asset cell line 1 = bold SERIAL NUMBER (was bold unit number); "(no unit #)" placeholder replaced by "placeholder text confirmed in the build" flag; "— no VIN —" kept (verbatim spec, S4-R8). Title 77 chars. | WIP S4-R7: "The Asset cell is two lines: the unit number on the first line in bold…"; §4 "Asset … identified by its unit number and its VIN"; placeholder "(no unit #)". | SV-8660 (S4-R7; S4-R8; S4-R10 — overridden by video P24) |
| 6 | WIP-FLT-03 | [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) | Asset-filter options + type-ahead now match SERIAL NUMBER or VIN (was unit number or VIN). P12 stays-open-vs-native dropdown OPEN-DECISION noted, untouched. Title 78 chars. | WIP S7-R4/S7-R5: options show and type-ahead matches "the unit number and the vehicle identification number". | SV-8663 (S7-R4; S7-R5 — overridden by video P24) |
| 7 | WIP-SORT-03 | [C30485](https://shopview.testrail.io/index.php?/cases/view/30485) | Asset column sort key = SERIAL NUMBER (was unit number); precondition wording updated. Title 64 chars. | WIP S4-R9: the Asset column "sorts by unit number". | SV-8660 (S4-R27; S4-R9 — overridden by video P24) |
| 8 | WIP-EXP-07 | [C30516](https://shopview.testrail.io/index.php?/cases/view/30516) | Kept the documented Unit/Branch export-header limitation; ADDED a plain tester caveat that the on-screen Asset data is now the serial number and the export header text is to be recorded, not bugged. Title 76 chars. | WIP S9-E1: export headers "Unit" / "Branch" (documented v1 limitation) — header predates the video; the DATA rule (unit number) is what P24 overrides. | SV-8665 (S9-E1; §2 Known Limitations — data overridden by video P24) |

## P25 — Print removed from Sales By Customer (2 edits + 1 retire-proposed)

**Driving video wording (31:14):** "Like, print here, this should not exist. I'm going to make
sure. That's cut out of the spec."

| # | Case | C-id / link | Edit | Overridden spec wording (Rule 25) | Refs (Rule 20) |
|---|---|---|---|---|---|
| 9 | SBC-EXP-01 | [C30159](https://shopview.testrail.io/index.php?/cases/view/30159) | Overflow-menu expectation now: "Download (CSV)", "Download (PDF)" — and NO "Print" item anywhere. Title 79 chars. | SBC S14-R1/S14-R2: menu items "in order: 'Download (CSV)', 'Download (PDF)', 'Print' (Print is the third item)"; Story 16 S16-R1..R6 "Print the report". | SV-8612; SV-8613 (S14-R1; S14-R2; S15-R1; S15-R2; S20-R16 — Print removed per video P25, Story 16/SV-8614 overridden) |
| 10 | SBC-EXP-13 | [C30171](https://shopview.testrail.io/index.php?/cases/view/30171) | **RETIRE-PROPOSED** — the case's ONLY purpose is Print behavior. NOT deleted (Rule 6): stays in TestRail and in the import until the user authorizes `delete_case`. Body left as authored for the record (title deliberately not shortened); `viu_status` = Retire-Proposed. | SBC Story 16 S16-R3..R5, S16-N1, §7 "Print PDF fails" — the whole story is cut per the video. | SV-8614 (Story 16 — case retire-proposed per video P25) |
| 11 | SBC-EXP-14 | [C30172](https://shopview.testrail.io/index.php?/cases/view/30172) | The Print leg (step 3 + "no print dialog opens") removed from the 10,000-row-cap negative; CSV + PDF legs kept. Overlong title shortened to 67 chars. NOTE: the earlier change-list wrongly named SBC-EXP-15 C30173 as the third Print reference — it is actually SBC-EXP-14 C30172 (corrected in the regenerated change-list; SBC-EXP-15 contains no Print reference and is untouched). | SBC S16-R6: Print obeys the 10,000-row cap (Print leg of the cap negative). | SV-8612; SV-8613 (S14-R14; S15-R22; §7 — Print leg removed per video P25) |

## P21 — Compressed (summary) download ADDED to Sales By Customer (1 new case)

**Driving video wording:** Parth 32:10: "So, in sales by customer, we don't want to include
option to download as a expanded view?" → Chris 32:43: "You know what? That's actually a good
callout. Let's, let's add that." and 48:39: "we're gonna have to add to SVC, Sales by Customer,
like you said, the CompressedView, that was a great idea."

| # | Case | C-id / link | Edit | Overridden spec wording (Rule 25) | Refs (Rule 20) |
|---|---|---|---|---|---|
| 12 | SBC-EXP-16 | **new — no C-ID yet** | NEW case authored (section "SBC — Exports", Medium, Functional, VIU-Pending): the download menu also offers a compressed (summary) version alongside the expanded (nested) one; menu wording + file shape flagged "confirmed in the build" (Rule 9). Title 75 chars. Needs an authorized `add_case`. | SBC exports are a single FLAT shape — S14-R6/S14-R10 (CSV), S15-R16 (PDF); no Summary-vs-Expanded option exists in the spec. | SV-8582 (EPIC-LEVEL — stated explicitly: no child story exists yet for the SBC compressed download; video P21 32:10–33:03 + 48:39) |

## P33 — Location filter HIDDEN for single-location users (4 flips)

**Driving video wording (46:10–46:28):** "if you, say you only had QA testing, you would not
see this at all. This- the filter's just gone. If you had, say there's three or four of them
here, if you had QA testing and QB location, then of course you'd see the filter."

| # | Case | C-id / link | Edit | Overridden spec wording (Rule 25) | Refs (Rule 20) |
|---|---|---|---|---|---|
| 13 | SBR-LOC-04 | [C30216](https://shopview.testrail.io/index.php?/cases/view/30216) | Expectation FLIPPED: single-location user sees NO Location filter; user with 2+ permitted locations sees it. Title 74 chars. | SBR S21-N1: "A single-location user STILL SEES the filter with one selectable location." | SV-8638 (S21-N1 — flipped by video P33 46:10–46:28) |
| 14 | TU-LOC-05 | [C30446](https://shopview.testrail.io/index.php?/cases/view/30446) | Same flip. Title 74 chars. | TU S9-N1: "A user with access to only one location still sees the filter with a single selectable location." | SV-8656 (S9-N1 — flipped by video P33) |
| 15 | IV-LOC-04 | [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) | Same flip. Title 74 chars. | IV S7-N1: "A user with access to only one location still sees the filter with a single selectable location." | SV-8674 (Story 7 S7-N1 — flipped by video P33) |
| 16 | PV-FILT-13 | [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) | Same flip. Title 74 chars. | PV S2-E4: "A user with access to only one location STILL SEES the Location filter with a single selectable location." | SV-8642 (S2-E4 — flipped by video P33) |

Completeness note (Rule 17): the whole case source was searched ("one location" /
"single-location") — these four are the ONLY single-location-filter cases; SBC and WIP never
had such a case (their specs carry no S-N1 rule), so nothing on those two reports asserts the
old behavior. Whether SBC/WIP need a NEW hidden-filter negative each is listed as a follow-up
on the change-list (not authored — outside this pass's authorization).

## P10 — Per-row location identifier in All-locations view (5 adds)

**Driving video wording (40:58–41:20):** "in theory, we should have this on every single
report. Obviously, we'll need a way to define, we're looking at all locations, okay, where's,
where's the location? You know, how do I know which is for shop A and which is for shop B? …
we should probably add that in there."

| # | Case | C-id / link | Edit | Overridden spec wording (Rule 25) | Refs (Rule 20) |
|---|---|---|---|---|---|
| 17 | SBC-LOC-03 | [C30111](https://shopview.testrail.io/index.php?/cases/view/30111) | ADDED step + expected: with "All locations" active, each row identifies which location it belongs to; exact control/label flagged "confirmed in the build" (Rule 9 — the video names no control). Overlong title shortened to 78 chars. | Spec has NO per-row location label: SBC tree = Customer→Asset→Invoice, no Location column (only WIP has one, S4-R1). | SV-8603 (S4-R5; S4-R6 — identifier added per video P10 40:58–41:20) |
| 18 | SBR-LOC-03 | [C30215](https://shopview.testrail.io/index.php?/cases/view/30215) | Same add. Title shortened to 79 chars. | SBR: no Location column in the spec. | SV-8638 (S21-R3; S21-R4; S21-R5; §3 — identifier added per video P10) |
| 19 | PV-FILT-10 | [C30337](https://shopview.testrail.io/index.php?/cases/view/30337) | Same add. Title shortened to 79 chars. | PV: no explicit Location column in the 20-column set (S4-R4), though rows are per-location (S3-R1a). | SV-8642 (S2-R9 — identifier added per video P10) |
| 20 | TU-LOC-01 | [C30442](https://shopview.testrail.io/index.php?/cases/view/30442) | Same add, worded for TU's pooled rows (hours pooled into one row per technician — the marking may take a different form; flagged). Title shortened to 78 chars. | TU S9-R4: hours pooled across locations into one row per technician — no per-row location identifier. | SV-8656 (S9-R1 — identifier added per video P10) |
| 21 | IV-LOC-01 | [C30574](https://shopview.testrail.io/index.php?/cases/view/30574) | Same add. Title shortened to 77 chars. | IV: one row per part per location (S2-R3) but no Location identifier column in S3-R1. | SV-8674 (S7-R1; S7-R2; S12-R3 — identifier added per video P10) |

WIP needs NO edit here — its spec already has a Location column (S4-R1, export header "Branch"
S9-E1), which the change-list already recorded as the one matching report.

## P2/P3 — Nav placement (1 edit + 2 verified no-ops)

**Driving video wording (04:32–05:19):** "The main difference is this parts section here. …
we need to create a new section here. … technician utilization is actually in a really bad
spot right now. So, we want to move these down below what's already there."

| # | Case | C-id / link | Edit | Overridden spec wording (Rule 25) | Refs (Rule 20) |
|---|---|---|---|---|---|
| 22 | TU-NAV-01 | [C30392](https://shopview.testrail.io/index.php?/cases/view/30392) | ADDED expected: the entry sits BELOW the previously existing report links (additive, not interruptive). Performance-group expectation kept (video does not remove it). Title shortened to 77 chars. | TU S1-R1 places the report but the spec is order-agnostic among the six ("the order … does not matter") — the below-existing rule is the video's addition, not a contradiction. | SV-8648 (S1-R1 — placement tightened per video P3 05:11–05:19) |
| — | PV-NAV-01 | [C30322](https://shopview.testrail.io/index.php?/cases/view/30322) | NO-OP (verified): already expects Parts Velocity under a NEW "Parts" section heading (matches video P2). | — | — |
| — | IV-NAV-01 | [C30534](https://shopview.testrail.io/index.php?/cases/view/30534) | NO-OP (verified): already expects Inventory Value under the Parts group (matches video P2). | — | — |

Nav coverage check (task item 6): nav cases EXIST for every affected area (SBC-NAV-01/02,
SBR-NAV set, PV-NAV-01..03, TU-NAV-01/02, IV-NAV-01..06, WIP tab cases) — coverage matrices
show nav placement covered, so NO new nav case was needed.

## OPEN-DECISION items applied per LATEST information (user addition 2026-07-28)

**User ruling (same day, addition):** also apply the open-decision items per the LATEST
information — update now, correct at VIU later. Pre-edit bodies backed up in
`../video-promotion-backup-2026-07-28/` (applier `apply_open_decision_2026-07-28.py`).

### P31 — Catalogue rename (leaning to rename toward the special-order meaning)

**Driving video wording (43:41–44:12):** "Yeah, I chose the verbiage in general to match our
catalogue itself, but you're right. That is exactly that. That's, special order parts. And, you
know what, to be honest, maybe we do rename it. Because you're absolutely right. Things in
inventory have a catalogue item … I'll, we'll have to truncate that down somehow, because
that'll get a little big for, for a column here."

| # | Case | C-id / link | Edit | Overridden/at-risk spec wording (Rule 25) | Refs (Rule 20) |
|---|---|---|---|---|---|
| 23 | PV-FILT-01 | [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) | Type-filter options reworded to the MEANING (Both / Inventory / a choice for special-order catalog parts never put into stock); the exact third-option label flagged "confirmed in the build" — both possible labels noted ("Catalogue" per spec, or a short special-order-parts name, not invented — Rule 9). | PV S2-R1: options "Both, Inventory, Catalogue". | SV-8642 (S2-R1 — label rename pending per video P31 43:34–44:12) |
| 24 | PV-FILT-09 | [C30336](https://shopview.testrail.io/index.php?/cases/view/30336) | "Type = Catalogue" wording → "the special-order (catalogue) choice"; label VIU-confirm; behavior (Bin filter excludes those rows) unchanged. | PV S2-R8. | SV-8642 (S2-R8 — label rename pending per video P31) |
| 25 | PV-ROW-05 | [C30345](https://shopview.testrail.io/index.php?/cases/view/30345) | Type column value reworded: "Inventory, or the special-order catalogue kind" with the exact word VIU-confirm (video: must stay short enough for a column). | PV S3-R5: Type shows "Inventory or Catalogue" plain text. | SV-8643 (S3-R4; S3-R5; S3-R8 — value rename pending per video P31) |
| 26 | PV-EXP-08 | [C30382](https://shopview.testrail.io/index.php?/cases/view/30382) | Notes/refs only — exported Type VALUES may rename; alignment rule unaffected. | — (context edit) | SV-8646 (S6-R10; S3-R8) |

### Asset-dropdown style — match native + toggle (latest info)

**Driving video wording (15:49–16:54):** Stefan: "We can do that, yeah, but I would also add
maybe a toggle or something. … Just to have it, like, uniform throughout the app." → Chris:
"That actually makes sense … I'm definitely flexible there. … Let's, for the purposes of doing
that, let's try and match that up. … let's please do this. Happy to update the spec with that,
too."

| # | Case | C-id / link | Edit | Overridden/at-risk spec wording (Rule 25) | Refs (Rule 20) |
|---|---|---|---|---|---|
| — | (search result) | — | **Verified: NO case asserts the stay-open dropdown behavior** (whole case source searched for stay-open/close-on-pick assertions — none). Nothing to flip. | — | — |
| 27 | WIP-FLT-03 | [C30500](https://shopview.testrail.io/index.php?/cases/view/30500) | Note updated from "open decision" to the latest info: the Asset dropdown should match the NATIVE ShopView multi-select style (+ possible toggle); exact interaction = VIU-confirm; do not fail on stay-open vs close-per-pick until confirmed live. Tester-facing text unchanged (it never asserted either style). | — (context edit; the P24 serial-number edit above is this case's tester-facing change) | SV-8663 (S7-R4; S7-R5) |

### TU column selector — NO-OP confirmed

Latest info = Chris's veto stands ("I vetoed putting a column selector on Utilization … I'm
still kind of in that same mindset", 49:05–49:14) and the spec agrees (no TU column-selector
story). **Verified: no TU column-selector case exists — cases already match; nothing touched.**

### Pagination — pagination stands on every page; no case contradicts it

**Driving video wording (45:05, Stefan):** "we are definitely having pagination on every page,
so with the current code base, we are basically forcing the user to scroll." (Chris, 45:42:
"let's flag that … revisit pagination, infinite, scroll, and load" — a LATER revisit.)

| # | Case | C-id / link | Edit | Refs (Rule 20) |
|---|---|---|---|---|
| — | (search result) | — | **Verified: NO case asserts infinite-scroll or all-rows-at-once** (whole case source searched). The pagination cases (PV-API-01/02, IV-ACC pagination case, SBC-API server-pagination case, SBR per-rep detail pagination) already assert server pagination — matching the latest info. | — |
| 28 | PV-API-01 | [C30388](https://shopview.testrail.io/index.php?/cases/view/30388) | Notes/refs only — pagination stands; behavior details (page size, control style) flagged VIU-confirm. | SV-8642 (§2; S2-R10) |
| 29 | PV-API-02 | [C30389](https://shopview.testrail.io/index.php?/cases/view/30389) | Notes/refs only — same flag. | SV-8642 (S2-R10) |

---

## Totals (both passes)

- **27 unique cases edited locally** (20 tester-facing edits + 7 notes/refs-only:
  SBC-LBL-02/03/04, SBC-EXP-13 retire marking, PV-EXP-08, PV-API-01/02; WIP-FLT-03 had both a
  tester-facing P24 edit and a P12 note update, counted once) — of which **1 is
  Retire-Proposed** (SBC-EXP-13 C30171).
- **1 NEW case authored:** SBC-EXP-16 (no C-ID yet — needs authorized `add_case`).
- **Backups:** every touched case's verbatim pre-edit body is in
  `../video-promotion-backup-2026-07-28/` (27 files + MANIFEST; the new case is
  delete-to-recover). Recovery instructions in the MANIFEST.
- **Spec-watch:** every video-driven item awaiting Chris's spec ratification is tracked in
  `build/report-suite/SPEC-WATCH-2026-07-28.md` (deadline 2026-08-04).
- **Suite total: 516 authored (515 in TestRail + 1 new); 0 TestRail writes; run R359 untouched.**
- All edits VIU-Pending (design/spec-level only — Rule 12: nothing here is live-verified; the
  QA branch does not exist yet, Rule 22).
