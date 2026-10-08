# WO Board & Tech View design — coverage proof, 8 October 2026 (Rule 120)

Design: Branko Cicovic's Claude Design project "Work Orders" (787fef1a), export uploaded by the QA lead on 8 Oct 2026 (`sources/design-2026-10-08-upload/`). The live link needs a claude.ai sign-in (L15), so the export is the design driven.

## 1 · Stateful crawl (`build/testing-tools/crawl_design_states.py`), one crawler per display

| Display | Screens reached | Screens swept (full / new-elements-only) | Duplicate screens skipped | Max depth | Hovers | Clicks | Typing | Drags | Forced (covered elements) | Still failing | Dark-theme captures |
|---|---|---|---|---|---|---|---|---|---|---|---|
| List | 111 | 98 / 9 | 4 | 5 | 1787 | 1785 | 6 | 0 | 945 | 43 | 99 |
| Tech View | 223 | 135 / 36 | 51 | 6 | 1238 | 1237 | 8 | 1385 | 392 | 512 | 203 |
| Board View | 300 | 148 / 11 | 77 | 5 | 1363 | 1360 | 6 | 1139 | 382 | 582 | 235 |

Method: every element visible on a screen (buttons, links, menu items, inputs, every pointer-cursor and every React-handler element, tooltip hosts, drop zones) is hovered and clicked; text inputs get a matching and a no-match term; selects get every option; on each display's starting screen every draggable is dropped on every drop zone, on other screens each draggable once and each drop zone at least once. A screen is crawled in turn when it shows a new KIND of text (record data — work-order numbers, amounts, people shown on the board — counts as the same kind) or a new overlay. An element identical to one already exercised on another screen is not re-exercised; changed or new elements always are. Elements covered by a sticky header or overlay are driven with forced hover/click/drag. Buttons that appear only on hover are revealed by hovering their row/card first.

## 2 · One-click sweep of every board in the export (`build/testing-tools/drive_design_full.py`)

- `Add Part.html`: 90 elements, 90 hovered, 90 clicked, 0 failed; dark theme and 768/1920 px variants captured.
- `Work Orders -no page-fix-.dc.html`: 179 elements, 179 hovered, 179 clicked, 0 failed; dark theme and 768/1920 px variants captured.
- `Work Orders.dc.html`: 152 elements, 152 hovered, 152 clicked, 0 failed; dark theme and 768/1920 px variants captured.

## 3 · Files read in full

- `Work Orders.dc.html` (all 1,411 lines) and the no-page-fix variant — by the three drafting workers.
- `wo-details/Add Part.html` (Lines tab) — Stories 4–8 worker.
- Design-system library, `support.js`, icon files (17 files, 100%): `design-library-reading-2026-10-08.md`.
- 36 fonts, 4 avatar photos, the thumbnail: `design-binary-files-reading-2026-10-08.md`. All screenshots and uploads viewed.

## 4 · What the design added to the suite

See `design-gap-triage-2026-10-08.md` (every kind of text the design shows that no case mentioned, classified) and the register's W-questions.
