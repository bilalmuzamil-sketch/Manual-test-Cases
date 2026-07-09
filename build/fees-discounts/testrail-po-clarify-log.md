# F&D — TestRail PO-Answer Clarification Audit Log

> **Run:** 2026-07-09 ~19:44 UTC · authorized by the user (explicit permission for
> master-case updates driven by the PO answers, 2026-07-09 only).
> **Source of the clarifications:** the PO answer sheet from **Chris Ward, the
> Fees & Discounts PO** (`data-sheet-source.md`), adjudicated in
> `spec-v1-reconciliation.md` §3/§5 groups B & C.
> **Method:** per case — GET `get_case`, diff against the clarified local
> `cases/*.json` content (import-layout fields: title / refs / custom_preconds /
> custom_steps / custom_expected), then `update_case` with ONLY the changed
> fields. Throttled ~250 ms; no runs/results written; no deletions.
> **Section moves:** NONE needed — none of the 8 cases are API-flagged and no new
> wording contains endpoints/HTTP verbs/status codes (standing rule 4 checked).

| C-ID | FD-ID | What changed (one line) | TestRail action | Timestamp (UTC) |
|---|---|---|---|---|
| [C28487](https://shopview.testrail.io/index.php?/cases/view/28487) | FD-CUST-003 | Q6=A: picker re-worded from checkbox multi-select + "Add" to the accepted single-select "Fee / Discount Templates" dropdown + Save (steps + expected) | updated (custom_steps, custom_expected) | 2026-07-09 19:44 |
| [C28488](https://shopview.testrail.io/index.php?/cases/view/28488) | FD-CUST-004 | Q6=A: case re-scoped from multi-select-with-plural-toast to three sequential one-at-a-time adds, each with its own "Fee / discount added." toast (title, refs S9-R23b→S9-R23a, steps, expected) | updated (title, refs, custom_steps, custom_expected) | 2026-07-09 19:44 |
| [C28489](https://shopview.testrail.io/index.php?/cases/view/28489) | FD-CUST-005 | Q6=A: expected now states the single-select dropdown (one template per add) is the intended behavior; the 3 list assertions (linked hidden / unlinked shown / Processing Fee shown) kept | updated (custom_steps, custom_expected) | 2026-07-09 19:44 |
| [C28490](https://shopview.testrail.io/index.php?/cases/view/28490) | FD-CUST-006 | Q6=A: empty-picker expected adopts the shipped dropdown's "No results" empty state (replaces the spec's "No templates available to add.") | updated (custom_expected) | 2026-07-09 19:44 |
| [C28491](https://shopview.testrail.io/index.php?/cases/view/28491) | FD-CUST-007 | Q6=A: remove control re-worded from 3-dot menu "Remove" to the shipped direct per-row trash icon; no-confirm + toast expectations kept | updated (title, custom_steps, custom_expected) | 2026-07-09 19:44 |
| [C28500](https://shopview.testrail.io/index.php?/cases/view/28500) | FD-CUST-016 | Q2=A: expected re-scoped from "known bug may add twice — record actual count" to exactly ONE adjustment (single-add settled; a duplicate = defect) | updated (custom_expected) | 2026-07-09 19:44 |
| [C28605](https://shopview.testrail.io/index.php?/cases/view/28605) | FD-VAL-007 | Q2=A: same exactly-one re-scope; "(known double-add bug)" dropped from the title | updated (title, custom_expected) | 2026-07-09 19:44 |
| [C28509](https://shopview.testrail.io/index.php?/cases/view/28509) | FD-TMPL-008 | Epic-confirmed standardized "Delete Template" dialog adopted as expected, incl. the live warning wording "…Deleting it will remove it from them." (spec S7-R21 text was stale) | updated (custom_expected, custom_steps¹) | 2026-07-09 19:44 |

¹ C28509's `custom_steps` content is unchanged in substance — the update only
normalized the field to byte-match the authored JSON (whitespace/import-artifact
drift); steps still read "click the delete action / read the confirm dialog".

## Cases the PO answers touch but that needed NO content change

- **Q1=B (per-row Stats)** — FD-STATS-001/002/004: cases already expect the
  per-row table with %/Value + Amount columns; the aggregate build is the defect
  (dev ticket), so no case edit. **No TestRail write.**
- **Q4=B (Add disabled-until-valid)** — FD-WO-005, FD-VAL-001: cases already
  expect the disabled-until-valid button; the always-enabled build is the defect.
  **No TestRail write.**
- **Q5=B (show-more collapse)** — FD-INLINE-003: case already expects the
  "Show N more" toggle; its absence is the defect. **No TestRail write.**
- **Q3=B (Processing-Fee builder UI in v1)** — FD-PROC-001…014 audited: no
  precondition or wording implies the builder UI is out of scope/optional (the
  builder cases simply assume the create dialog), so nothing to clarify; the
  missing UI is an in-scope build gap (dev ticket). **No TestRail write.**

No credentials appear in this file. No runs, results, or deletions were made.
