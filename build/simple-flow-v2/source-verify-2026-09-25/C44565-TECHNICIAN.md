# C44565 — the case agrees with the source, and the build does not

**Source read once this pass with the QA lead's go-ahead (Rule 81), 25 September 2026.**
Confluence page **771391574**, *Simple Flow V2*, **version 26**, last changed **11 September 2026**.
Full text as read: `spec-v26-as-read-2026-09-25.txt` (679 lines).
⚠️ Our cases cite "revised 8 September 2026"; the live page is **version 26, changed 11 September**.
The three sentences below are unchanged in substance, but **the provenance line is now stale** and
every case in this suite needs its version re-stamped (Rule 54) — raised, not done in this pass.

## The three ways (Rule 106)

### 1. The CASE's Expected — read live from TestRail, 25 September 2026
1. Complete is never disabled for a parts reason, anywhere.
2. A line reopened after completion returns to Approved with its parts unchanged.
3. A Technician in Tech View cannot complete (they cannot approve), but can still pick parts.

### 2. The SOURCE as it reads today — verbatim, `SV-9251` Story 5, *Parts no longer block completing a line*, under **Negative cases**
> Complete is never disabled for a parts reason, anywhere
> No timer and no background job completes a line
> A line reopened after completion returns to Approved with its parts unchanged
> **A Technician in Tech View cannot complete, because they cannot approve. They can still pick parts**

And in the same story's **Prerequisite**:
> WO Lines: Create & Edit plus Full View to approve lines. **Tech View hides Approve**

And under the permissions section of the same page:
> Pick Parts (woPickParts), the same gate as picking one part. **A Technician carries it even though they cannot complete a line**

**The case is a faithful quote of the source. There is no divergence between them.**

### 3. The BUILD observed — production, `v26.39.0-07c719b`, 25 September 2026
| Item | Observed |
|---|---|
| Complete never disabled for a parts reason | **Holds.** Five approved lines all offered Complete while parts sat *In Stock* and *Awaiting* |
| Reopen returns to Approved, parts unchanged | **Holds.** Status returned to Approved and the part list was identical either side |
| A Technician in Tech View cannot complete | **DOES NOT HOLD.** The technician pressed Complete, carried the pick-parts step, and the line became Complete |
| They can still pick parts | **Holds** |

## The positive control that makes the negative safe (Rule 104)

The source's sentence is conditional on **Tech View**, so "the person was in Tech View" had to be
proved, not assumed. The source supplies the test itself — *"Tech View hides Approve"*. On the **same
line awaiting approval**, on the same work order, minutes apart:

| | Buttons on that line | The word *Approve* anywhere on the page |
|---|---|---|
| Admin (58 permissions) | `Approve`, `Decline` | yes |
| The technician (6 permissions) | **none** | **no** |

Approve is hidden for them exactly as the source describes, so Tech View was in force.

**And the role was proved default first (Rule 118).** Pressing *Reset To Template* on the Technician
role **enabled Save**, meaning another session had changed it; the product named what came off
(*Timesheets — View, Settings — Service, Settings — Finance*). It was saved, a second reset left Save
disabled, and **both technician checks were re-run on the clean role**. The role then grants six
permissions: `customersView, scheduleView, woPickParts, workOrderLinesCreateAndEdit, workOrdersView,
woTechViewMode`.

## Verdict under Rule 106's four outcomes

**Case agrees with source + build differs ⇒ a real defect.** Not a case correction, and not a false
defect. `custom_expected` is not touched (Rule 114).

## Answering the nearest apparently contradicting rule, in advance

- **Rule 114** — nothing in the case is edited. The Expected is the source's own sentence and stays.
- **Rule 112** — the owning story **SV-9251** must be in *Ready for QA* or *Testing QA* before the
  filing ask. Its live status is to be read at the moment of the ask, not carried from here.
- **Rule 62** — no ticket is created. The body is prepared and the ask is made per ticket.
- **Rule 24** — this is not front-end-blocks / back-end-allows. The front end **offers** the action and
  the action **succeeds**, which is the opposite case and a real deviation.
