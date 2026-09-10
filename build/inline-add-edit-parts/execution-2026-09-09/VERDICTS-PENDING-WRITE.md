# Verdicts determined but NOT yet written to R418

These are settled by observation. They are not in the run yet because writing anything other than
Passed is part of the defect stage, which the QA lead has scheduled for **after both suites are
fully executed**. Nothing here is waiting on more testing.

| Case | Verdict | Needs a ticket? | Why |
|---|---|---|---|
| [C45060](https://shopview.testrail.io/index.php?/cases/view/45060) | **Failed** | **No** | The case's own note describes exactly what happens and says *"(1) If that is exactly what you see, mark the case FAILED and raise nothing new."* |
| [C45001](https://shopview.testrail.io/index.php?/cases/view/45001) | **Failed** | Yes — draft 5 | ⚠️ currently sits in R418 as **Passed**, written before clause 3 had been checked. Must be corrected. |
| [C45022](https://shopview.testrail.io/index.php?/cases/view/45022) | **Failed** | Yes — draft 4 (SV-9317) | a failed save is unreported; on a dropped connection the row closes and the part is lost |
| [C45062](https://shopview.testrail.io/index.php?/cases/view/45062) | **Failed** | Yes — draft 4 (SV-9319) | the same, in Full View |
| [C45058](https://shopview.testrail.io/index.php?/cases/view/45058) | **Failed** | Yes — draft 2 | letters in Cost/Sell give the empty-field message |
| [C45070](https://shopview.testrail.io/index.php?/cases/view/45070) | **Failed** | Yes — draft 3 | the edit-row discard action reads "Discard Changes" |
| [C44993](https://shopview.testrail.io/index.php?/cases/view/44993) · [C44994](https://shopview.testrail.io/index.php?/cases/view/44994) | **Failed** | Yes — draft 1 | Add Part and Edit still offered on a Declined work order |
| [C45061](https://shopview.testrail.io/index.php?/cases/view/45061) | **Failed** | Yes — candidate 6, no draft yet | a part SAVES successfully on a work order that went Declined under the open row; no "can no longer be edited" alert at all |
| [C45035](https://shopview.testrail.io/index.php?/cases/view/45035) | **Failed** | Yes — candidate 7, no draft yet | the same in Tech view on an EDIT row: change-request returns 200, the row closes, no alert |

## C45060 — the detail, so it can be written without re-testing

The case says the two boxes should open **empty** and force the user to type a price before saving.

Observed on catalogue part **F40010212** ("Slack Adjuster"), whose card in the typeahead reads
**"Catalog"** and which has no cost or sell price on record: the row opens with **Cost `0.00`** and
**Sell price `0.00`**, both editable, and the part saves at those figures without anything being
typed. That is outcome (1) in the case's own note, word for word.

Evidence: `evidence/76-final.json` (`beforeSave`), `evidence/71-purecatalog.json`.
