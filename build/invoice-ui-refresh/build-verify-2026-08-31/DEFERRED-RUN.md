# DEFERRED BUILD-VERIFICATION RUN — Invoice UI Refresh (SV-8218)

**A local list, NOT a TestRail run object** (skill 03 §7.4). These are cases whose **feature was not
found in the build** on the date shown. Each is a **finished case in a defined state**, not a blocker:
it keeps its documented expectation (Rule 57), carries
`AUTOMATION: Not available on Build to test Yet - Last checked 8/31/2026`, carries the §7.3
tester-facing re-check line, and is **excluded from the ready-to-automate count**.

**Re-check trigger: THE FEATURE SHIPPING — not a redeploy alone** (skill 03 §7.4, Rule 49).

**Build checked against:** `v26.35.5-8c3cc21` (QA branch **sv8218**) · **checked:** 31 August 2026

| Case | Title | Waiting on | Story | Evidence of absence |
|---|---|---|---|---|
| [C44937](https://shopview.testrail.io/index.php?/cases/view/44937) | Declined Work shows in its own section with names and descriptions only | the `"Show declined work"` setting | **SV-9145** (In Progress) | Absent from the Invoice Details dialog, read with a **positive control firing in the same read** — `Labor rate`, `Labor hours`, `Labor price`, `Summarize labor total`, `Summarize parts total`, `Part number`, `Part description` all FOUND. |
| [C44938](https://shopview.testrail.io/index.php?/cases/view/44938) | Declined lines show no prices, no line numbers, and no status pill | same | **SV-9145** | same read |
| [C44939](https://shopview.testrail.io/index.php?/cases/view/44939) | Declined Work section hidden when nothing declined or option off | same | **SV-9145** | same read |
| [C44942](https://shopview.testrail.io/index.php?/cases/view/44942) | Percent column shows only when the setting is on | the `"Show % on Estimates and Invoices"` setting | **SV-9146** (In Progress) | Absent from the same dialog; a source read found no backend field either — a cleaner not-built than declined work, which does have a backend path. |
| [C44987](https://shopview.testrail.io/index.php?/cases/view/44987) | Batch and imported invoices are out of scope (kept on current templates) | invoice **import / batch** | **SV-9193** (deferred) | `/api/invoices/import`, `/api/invoices/batch`, `/api/work-orders/import`, `/api/imported-work-orders` → all 404; no import/type field in the work-order listing; templates explicitly deferred. |
| [C45185](https://shopview.testrail.io/index.php?/cases/view/45185) | A snapshot created before the redesign renders in the new layout with blanks | document **history snapshots** | document history | `historyEvent` = none/1/2/5/99 all return a **byte-identical** document (one sha across five values, including the nonsense `99`). Defect candidate 2. |

## ⚠️ A note on the strength of each row

**C44937–C44939 and C44942 are strong**: a probe that demonstrably fires found the sibling settings
and not these. **C44987 is weaker on its own** — four guessed 404 routes prove little by themselves
(a guessed route and a wrong id 404 identically), so that row rests mainly on the explicit SV-9193
deferral and the absent navigation. **If invoice import turns out to exist, Rule 14 applies: seed the
record, do not report NOT-VERIFIED for a missing data state.**

## Not on this list, and why

- **C44951 · C44952 · C45175** — the feature exists; it is the **customer portal**, which is not on a
  QA branch. They carry the staging-only HOLD instead (core §5.0-b).
- **C44913 · C44916** — the feature exists; the **source is ambiguous** about how a tester obtains an
  Approval Code. Rule 58: held case + PO question (`questions-2026-08-31/PO-QUESTIONS-IBS.md`).
- **C44947** — was wrongly parked as staging-only. It reads the payment **method name** on the invoice
  Payments rows (S8-R2), which renders on a shop-app document. **Testable on the branch**; the HOLD has
  been lifted and it is back on the to-do list.
