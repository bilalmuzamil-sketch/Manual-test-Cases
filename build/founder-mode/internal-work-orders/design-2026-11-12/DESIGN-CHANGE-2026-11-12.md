# Internal Work Orders: design republish and PRD v1.1 assessment (12 Nov 2026)

Assessment only. Nothing was written to TestRail, Jira, Slack or Google, nothing was committed, and `authoring/` was not edited.

- **Design:** "Internal Work Orders · All flows v6" (https://claude.ai/artifact/5jHR3nLeDinzks1viREFuo). The drive used version **1794484794-2031**; the current version is **1794507512-2fc4**.
- **PRD:** Confluence 942243841. We had **Final v1.0**; the current version is **v1.1** (12 Nov 2026), which carries Milos Vasic's answers to questions 1–16.

## 1. Verdict in one paragraph

**No board changed in the design.** All 210 published files of 1794507512-2fc4 were downloaded and compared by sha256 against `files/`:

- **173 are byte-identical.** This covers all 167 boards, `canvas.json` (so the 198 notes are unchanged), the four components, `_ds_bundle.js` and both CSS files.
- **1 file changed:** the viewer shell `index.html`. The change is runtime code, not design content (§2).
- **36 files are new and are not design content:**
  - the canvas app's own runtime: 31 files under `artifact-type/` (app, capture, i18n, reference docs, licences, thumbnail);
  - the design system's `fonts/` folder (5 Inter files) that the old package lacked.

All 167 boards were rendered from the new package and pixel-compared with `images/` (§3). Every board has 0 changed pixels.

**Every change that affects our cases therefore comes from PRD v1.1:**

- 11 design cases change.
- 3 held design cases are released: D-88 (rewritten), D-90 and D-92.
- 3 held design cases are retired: D-87 and D-89 are deleted, and D-91 is retired (or rewritten). Deleting TestRail cases needs the QA lead's go-ahead.
- 8 register rows are updated, 1 register row is added, and 3 rows are added to the design-silent list.
- **No new design case is needed.**

## 2. File comparison (sha256, all 210 files)

| Group | Files | Result |
|---|---|---|
| `project/*.dc.html` (167 boards + Main + 4 components) and `project/canvas.json` | 173 with the rest below | **byte-identical** |
| `project/_ds/…/_ds_bundle.js`, `colors_and_type.css`, `components.css` | 3 | byte-identical |
| `artifact-type/dc-runtime.js` (the board runtime) | 1 | byte-identical |
| `index.html` (canvas viewer shell) | 1 | **changed**: see below |
| `artifact-type/` app, capture, fast-edit worker, icon font, 10 i18n files, 14 reference files, licences, thumbnail | 31 | new (viewer app, not design) |
| `project/_ds/…/fonts/Inter_18pt-{Bold,Medium,Regular,SemiBold}.ttf`, `Inter_28pt-SemiBold.ttf` | 5 | new (the design system's real fonts) |
| Files in `files/` that are no longer published | 0 | none |

**`index.html` diff (47,000 → 48,561 bytes).** All changes are runtime code:

- two feature flags removed (`appifact_creation_sequence`, `appifact_extra_export_formats`);
- load-timeout telemetry added (`TIMEOUT_STAGES`, `timeoutStageOf()`, `READY_LATE_MS = 5000`, `progress()`);
- the build stamp changed (`fdb6c227…` → `832bee79…`).

No text, label or property that any board shows is in this file.

**Board text and property differences: none.** The board sources are byte-identical, so no text, property, `dc-import` attribute or note differs.

Downloads are in `v2-1794507512/files/`, at the same paths as `files/`. The comparison is in the scratchpad file `shacmp.json`; the counts are above.

## 3. Pictures (all 167 boards rendered and compared)

Tool: `tools/v2_compare.js`, which writes `v2-1794507512/render/v2-compare.json`. Each board is rendered twice from the new package at its own size, in the light theme.

| Pass | Fonts | Identical bytes | Changed pixels (> threshold 30) |
|---|---|---|---|
| A, "mapped" | system Inter, as our `images/` were made | 161 of 167 | **0 on all 167** (6 boards differ by 6–60 pixels below the threshold: anti-aliasing) |
| B, "real" | the package's own Inter_18pt files (new) | 0 | all 167 (3,366–70,320 pixels: glyph shapes and widths) |

**Pass A proves the design did not change.** Pass B measures the effect of the real fonts our old pictures could not use.

`tools/v2_fontlayout.js` (output `v2-1794507512/render/v2-fontlayout.json`) compared line count, cut-off and overlap of every text on the 90 distinct boards under both fonts. Seven boards break lines differently, and **no finding changes**:

- **Flow 1 02b/2b2/2a/2e and the New-WO dialog:** a hidden tooltip box no longer overlaps "Add". The open asset list still covers the Internal badge, so **IWO-D13 stands**. Compare `v2-1794507512/render/real/iwo-flow1-03-…png` with `images/`.
- **Flow 4 05 (report):** "A & J Truck & Trailer Repair" goes from 4 lines to 3. Work order numbers still break ("S2-" / "34918") and dates still wrap with the real font, so **IWO-D45 stands**.
- **Flow 5 01 (QB Unexported):** "Export Manually", "Journal Entry" and "S2-34918" fit on one line with the real font. Nothing in our inventory relied on that wrap (V66).

**Recommendation:** keep `images/` as the attached pictures. They show the same design. Swap them for the real-font renders (`v2-1794507512/render/real/`) only at the next full write of the design cases, not as a pass of its own.

## 4. What changes in our cases because of PRD v1.1 and the answers

Sources read in full:

- `PRD-DIFF-v1.0-to-v1.1.txt`: 33 lines, all read. A fresh `diff` of the two saved PRDs gives the same 34 changed lines; the other 773 lines of v1.1 are byte-identical to v1.0, which was read in full this morning.
- `ANSWERS-Milos-Vasic-2026-11-12.json`: 21 lines, all read.
- `QUESTION-REVIEW.md`: 64 lines, all read.

Tool `tools/v11_quote_check.py` (output `v2-1794507512/v11-quote-check.json`) re-copies every quote of all 92 drafts from both PRDs with the plan's own quote rule:

- 13 drafts quote a sentence that changed;
- 0 quotes disappeared.

§8 gained the row "Reopen done" at position 25, so §8 rows 25–42 are now 26–43. No design draft quotes them by number, but authoring's UFS-nn keys should be re-checked.

Answer to sheet row and register mapping:

| Sheet question | Register row |
|---|---|
| 3 | IWO-D19 |
| 12 | IWO-D09 |
| 13 | IWO-D29 |
| 14 | IWO-D31 |
| 15 | IWO-D44 |
| 16 | IWO-D45 |

### 4a. Design cases (draft id → authoring key → TestRail)

| Draft | Key | C-id | Verdict | What changes |
|---|---|---|---|---|
| DC-02 | D-02 | [C1112320](https://shopview.testrail.io/index.php?/cases/view/1112320) | CHANGE | The §8-01 quote is now the full S1-R2 text ("…Nothing is picked for you: your location is not always a customer, and the names can differ…"), answering q1. Results unchanged (they already quote S1-R2). IWO-D05 stays: the design still says "your Internal Work Orders Expense account". |
| DC-06 | D-06 | [C1112324](https://shopview.testrail.io/index.php?/cases/view/1112324) | CHANGE | New result and quote (S1-R13 v1.1, q12): under the Internal categories tab the hint reads "Set on the customer, or on the asset for one unit. An internal work order takes it when it is created." The design's hint "Where the cost of work on your own equipment goes…" differs; the PRD text wins (IWO-D09). |
| DC-08 | D-08 | [C1112326](https://shopview.testrail.io/index.php?/cases/view/1112326) | CHANGE | New result and quote (S1-R14 v1.1, q12): the Name helper reads "It shows in the badge tooltip on the work order, on the NO CHARGE document and in the Internal Work Orders report." The design's "Shown in the Category select…" differs. The diff note drops "question 8, held case DV-01". |
| DC-09 | D-09 | [C1112327](https://shopview.testrail.io/index.php?/cases/view/1112327) | CHANGE | The same Name helper on New Internal Category (S1-R14 applies to both dialogs). The design draws the same differing helper. |
| DC-13 | D-13 | [C1112331](https://shopview.testrail.io/index.php?/cases/view/1112331) | CHANGE | New result and quote (S1-R7 v1.1, q12): under "Default internal category" the helper reads "Used by every new internal work order for this customer unless the asset has its own category." The design's "Preselected on every new work order…" differs. |
| DC-48 | D-48 | [C1112365](https://shopview.testrail.io/index.php?/cases/view/1112365) | CHANGE | The S4-R3 quoted sentence changed (it now ends with the green message). Results unchanged; the message is D-90's (below). |
| DC-49 | D-49 | [C1112366](https://shopview.testrail.io/index.php?/cases/view/1112366) | CHANGE | New result and quote (S2-R9 v1.1, q13): "No other note is shown on the closed work order (an invoiced work order shows none today)." So no "This work order is locked…" note. |
| DC-56 | D-56 | [C1112373](https://shopview.testrail.io/index.php?/cases/view/1112373) | CHANGE | The S2-R6 quote changed (lines come back billable, including lines with their own mark; q9). The dialog body quoted in the results is unchanged. |
| DC-64 | D-64 | [C1112381](https://shopview.testrail.io/index.php?/cases/view/1112381) | CHANGE | The S2-R4 quoted sentence changed. The no-charge expectation (NO CHARGE stamp, "Category: Goodwill") is unchanged. |
| DC-74 | D-74 | [C1112391](https://shopview.testrail.io/index.php?/cases/view/1112391) | CHANGE | S9-R2 v1.1 adds two checks: "an empty cell shows a dash, as every table of the app does" (q15) and "work order numbers and dates stay on one line at 1440 and 1536 pixels wide" (q16). The diff note drops "held as DV-05 and DV-06". |
| DC-75 | D-75 | [C1112392](https://shopview.testrail.io/index.php?/cases/view/1112392) | CHANGE | S9-R2 v1.1 (q11, q15): Comeback rate is "a dash, never a number, when the technician has no completed lines in the range", and empty cells show a dash. The design's Unassigned row leaves Completed lines and Comeback rate **empty** (flow4-6 / hf-39b). This is new register row IWO-D56. |
| DV-01 | D-87 | [C1112404](https://shopview.testrail.io/index.php?/cases/view/1112404) | **RETIRE (delete)** | q12: Milos chose the PRD texts, so the design's helper is not the expectation. The three helpers move into D-06, D-08/D-09 and D-13. |
| DV-02 | D-88 | [C1112405](https://shopview.testrail.io/index.php?/cases/view/1112405) | **RELEASE, rewritten** | q3: an open internal estimate carries the INTERNAL stamp (S2-R4 v1.1), as the design draws. See the note below the table about the "Category:" line. |
| DV-03 | D-89 | [C1112406](https://shopview.testrail.io/index.php?/cases/view/1112406) | **RETIRE (delete)** | q13: "the design frame is wrong and the text wins". The check that no such note shows moves to D-49. |
| DV-04 | D-90 | [C1112407](https://shopview.testrail.io/index.php?/cases/view/1112407) | **RELEASE** | q14: the design's "Work order S2-34918 reopened" is now the PRD (S4-R3 v1.1; §8 "Reopen done", green message). Drop the hold and "(the design version)", and quote S4-R3 and §8. |
| DV-05 | D-91 | [C1112408](https://shopview.testrail.io/index.php?/cases/view/1112408) | **RETIRE, or rewrite to the PRD version** | q15: the design's empty cells are wrong; the dash is covered by D-74. Recommended: retire, to avoid a duplicate. |
| DV-06 | D-92 | [C1112409](https://shopview.testrail.io/index.php?/cases/view/1112409) | **RELEASE** | q16: Milos chose "stay on one line", which is what this case already expects. Drop the hold and quote S9-R2 v1.1. It stays separate from D-74 because it needs the 1536-pixel step. |
| the other 75 drafts | D-01…D-86 not listed | — | CONFIRMED | No quoted sentence changed and no board changed. Only the shared lines below change. |

Note: D-44 has no TestRail id in `testrail-id-map.csv` (91 of 92 D cases are mapped). Please check this separately.

**Shared lines on all 92 design cases** (and on every PRD case that carries "References from Design"):

- the From line names "Final v1.0", which becomes v1.1;
- the design reference names version 1794484794-2031, which becomes 1794507512-2fc4. A note can say the boards are byte-identical to the drive.

Under Rule 134 these are re-stamps on otherwise CONFIRMED cases. The QA lead decides under Rule 122 (full pass or named set) whether they go with this write or the next.

**DV-02 / D-88: one point to decide.** v1.1 S2-R4 reads: "carry the INTERNAL stamp on an internal work order … the same as the closed document (S3-R5), and, on a no-charge work order, the line "Category: [Category]" under the stamp."

- The design draws "Category: General Internal" under INTERNAL on the open internal estimate.
- S3-R5 (closed document) gives the category line to both kinds of document.
- S2-R4's own words limit the line to no-charge work orders.

**Recommendation:** follow S2-R4's explicit words (INTERNAL stamp, no category line on an internal estimate), cite the PRD header rule, and record it as settled in IWO-D19. Do not send another question. Milos's answer speaks only about the stamp word, and S2-R4 is the specific rule for the estimate.

### 4b. Register rows (`../DESIGN-DIVERGENCE-REGISTER.json`)

| Row | Now | After v1.1 |
|---|---|---|
| IWO-D09 (category helpers) | QUESTION 12 | SETTLED-BY-PRD: S1-R7, S1-R13 and S1-R14 v1.1 give the three texts. Held case D-87 retired. |
| IWO-D19 (internal estimate) | QUESTION 3 | SETTLED-BY-PRD: S2-R4 v1.1 (INTERNAL stamp). Its PRD quote must be re-copied (the v1.0 sentence is gone). Category line per the note in §4a. D-88 released. |
| IWO-D29 (locked note) | QUESTION 13 | SETTLED-BY-PRD: S2-R9 v1.1 "No other note is shown…". D-89 retired. |
| IWO-D31 (reopened message) | QUESTION 14 | CLOSED: the design now matches the PRD (S4-R3 v1.1, §8 "Reopen done"). D-90 released. |
| IWO-D44 (report empty cells) | QUESTION 15 | SETTLED-BY-PRD: S9-R2 v1.1 dash. D-91 retired, or rewritten. |
| IWO-D45 (report wrapping) | QUESTION 16 | SETTLED-BY-PRD: S9-R2 v1.1 one line at 1440/1536. The design (re-rendered with the real font) still wraps. D-92 released. |
| IWO-D05, IWO-D26 | SETTLED | Outcome unchanged. Re-copy the changed §8-01 / S2-R6 sentences in their notes. |
| **IWO-D56 (new)** | — | **look (library rule) / undefined rate**: By technician, the "Not in ShopView / no technician" row shows empty Completed lines and Comeback rate cells (Flow 4 06, Happy 39b, Review 7.5). SETTLED-BY-PRD: S9-R2 v1.1 dash. Case D-75. No question is needed. |
| NOT_SHOWN S7-R8 | "Create invoice [number]? with Moved from rows" | Reword to v1.1: one row per pair of accounts, amounts added up (q4). |
| **NOT_SHOWN (3 new)** | — | S2-E8 refused portal deposit after Convert (q7); S6-E1 hub refuses to deactivate a mapped account (q8); S2-R10 the Status value "Closed" hidden until first use (q5). None is drawn: DESIGN-SILENT, PRD cases own them. |

**Counts after:**

- differences 56;
- settled by PRD 54;
- closed as matching 1 (D31);
- design questions open 0;
- not shown 44.

Checklist line 4 (questions unsent) becomes ✅: all answered 12 Nov 2026. Questions 2, 6, 9 and 10 have no design surface; no design case is affected by them.

### 4c. New design cases

**None.** Every v1.1 sentence the design draws is checked by an existing design case: the three helpers, no other note, the reopened message, the dash and one-line report. Everything the design does not draw goes to NOT_SHOWN for the PRD cases: the Closed value before first use, the refused deposit, the hub refusal, and Create invoice rows per account pair.

## 5. Outstanding: what is needed from the QA lead

1. Go-ahead to delete D-87 [C1112404](https://shopview.testrail.io/index.php?/cases/view/1112404) and D-89 [C1112406](https://shopview.testrail.io/index.php?/cases/view/1112406), and to retire D-91 [C1112408](https://shopview.testrail.io/index.php?/cases/view/1112408). Then remove all three from the run.
2. Go-ahead for the 11 changes and 3 releases above (TestRail writes, Rule 6).
3. Rule 122: a full pass, or only the named set. The named set (§4a) plus the re-stamp of the From line and the design version on the other cases is what PRD v1.1 changes; the design itself did not change.
4. The D-88 category-line reading (recommended: S2-R4's words, no question).

**Waiting on the PO (Rule 132):** question 10 (work_order.updated). Milos answered "(a)", but the Open API owner's confirmation is still pending. No design case is held on it.
