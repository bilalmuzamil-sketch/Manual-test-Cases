# Simple Flow V2 — Automated cases held for the QA lead (Rule 71)

**Source-verify pass 2026-09-08** against the Simple Flow V2 spec revision of 8 September 2026
(Confluence page 771391574), epic **SV-8683**. Four cases in group 6665 are flagged **Automated**
(`custom_atmstatus = 3`). Rule 71: an Automated case is **never changed without the QA lead's
go-ahead**. None of the four was touched. This note records, per case, exactly what the 2026-09-08
revision does to it, so the QA lead can decide.

| C-id | Link | Story | Verdict against current spec | Action needed |
|---|---|---|---|---|
| **C44557** | https://shopview.testrail.io/index.php?/cases/view/44557 | SV-9249 (Story 3) | **NEEDS A REWRITE** | QA-lead decision |
| **C44561** | https://shopview.testrail.io/index.php?/cases/view/44561 | SV-9251 (Story 5) | **Already spec-current** | none |
| **C44583** | https://shopview.testrail.io/index.php?/cases/view/44583 | SV-9259 (Story 13) | **Already spec-current** | none |
| **C44587** | https://shopview.testrail.io/index.php?/cases/view/44587 | SV-9259 (Story 13) | **Already spec-current** | none |

---

## C44557 — the one that needs a change

**What it does today:** toggles **all four** settings and reads a confirmation on each; its Expected
calls the change an *"irreversible org-wide sweep."*

**Why the 2026-09-08 revision breaks it:** the revision limits the confirmation to the **two** settings
that change existing records, and drops the org-wide-sweep framing.

- *"Only the two settings that change existing records ask for confirmation. Changing Require ordering
  parts or Require picking inventory parts opens a confirmation before anything is saved. Changing
  Require approval for new lines or Require receiving parts before completion does not … Neither writes
  to an existing record, so there is nothing to warn about."*
- *"The confirmation names the setting and the direction in its title … and it states the consequence
  with the number of records that will change."*
- *"Turning picking off is the highest-consequence change in this feature, because it is the only one
  that moves inventory. It is stated as a warning rather than as a count alone, and it names the stock
  deduction in those words."*

**The change it would need** (if the QA lead approves editing it):
1. Confirmation appears only for **Require ordering parts** and **Require picking inventory parts**.
2. **Require approval for new lines** and **Require receiving parts before completion** save with **no**
   confirmation.
3. The confirmation title names the setting **and the direction**.
4. The body states the **count** of records that will change (zero count ⇒ no confirmation, saves
   directly; where the count cannot be established, the consequence is stated without a figure; a large
   count also advises changing outside working hours).
5. Turning picking **off** is shown as a **warning** that names the **stock deduction** in words.

Its **Preconditions** (which describe a generic "sweepable" review-setting scenario and API driving)
also no longer fit and would be rewritten to the confirmation-content scenario.

**⚠️ Coverage is not lost while this is held.** A new, live, runnable case was authored this pass to
carry exactly this behaviour so the narrowing is testable now:
**C53485 — "Only ordering and picking ask to confirm; picking-off warns of stock deduction"**
(https://shopview.testrail.io/index.php?/cases/view/53485), SV-9249 (Story 3). If the QA lead instead
wants C44557 itself brought current (and C53485 retired as a duplicate), that is his call — say the word.

---

## C44561, C44583, C44587 — verified spec-current, no change needed

Re-verified against the 8 September 2026 revision; the revision does **not** touch what each asserts.
Left exactly as they are (Rule 71). Recorded here only so the "held" set is complete.

- **C44561** (Story 5) — verifies that an **already-Approved** line completes whatever the state of its
  parts. The revision does not change this (*"A line completes whatever the state of its parts.
  Unordered, unpicked and unreceived parts do not prevent it, in any combination."*). The new
  "Approve first" gate is out of scope here because its precondition already requires an Approved line;
  that gate is covered by **C44563** (updated this pass).
- **C44583** (Story 13) — verifies Receive opens a modal (no navigation) whose contents depend on the
  entry point, and that a received part leaves "Awaiting". The 2026-09-08 vendor-creation and
  vendor-fix rules do **not** change this; they are covered by **C44585** (updated) and **C53487** (new).
- **C44587** (Story 13) — verifies a user **without** See Financial Data can still receive (money fields
  removed, prefilled values stand). Unchanged in the revision
  (*"A user who cannot see money can still receive. Cost and tax are removed from their screen and the
  prefilled values stand."*).

---

**Bottom line for the QA lead:** exactly **one** held case (**C44557**) is out of date. Its behaviour is
already covered by the new live case **C53485**, so the suite is not blocked. Do you want C44557 brought
current (and C53485 retired), or C53485 kept and C44557 left as-is / retired? The other three held cases
need nothing.

---

## ✅ RESOLUTION — 2026-09-08 (QA lead chose option A)

The QA lead authorised **option A**: bring **C44557** current and retire the duplicate **C53485**.

- **C44557** (still `custom_atmstatus = 3`, Automated) was **updated in place** to the narrowed-confirmation
  rule — title, preconditions, steps and Expected now match the 8-Sep spec (identical to the content
  authored on C53485). `custom_automation_type` set to 2 (Functional). Rendered to served-page `fr-view`
  (whitelisted for one repair run — `AUTOMATED_OK=44557`). **atmstatus kept at 3.**
- **C53485** was **deleted** (retired as the duplicate). TestRail auto-removed it from run **R416**, which
  dropped **66 → 65**. Suite is now **65 cases ours**.

### 🔔 FOR VLAD (Rule 65 — an Automated case changed)
**C44557** (`custom_atmstatus = 3`, https://shopview.testrail.io/index.php?/cases/view/44557) had its
title and all three text fields rewritten on **2026-09-08** to match the 8 September 2026 Simple Flow V2
spec revision (Story 3 confirmation narrowed to the two record-changing settings; picking-off warning
names the stock deduction). Change made with the QA lead's explicit go-ahead (option A). The automation
status was **not** changed (still Automated). **Vladimir Tomovic (TestRail user 1) to be told** — flagged
to the QA lead to relay, as there is no direct channel from this lane.
