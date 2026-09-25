# Problem 3 — resolved 25 September 2026. All four of my "missing feature" claims were wrong.

⛔ **This file replaces the version written earlier the same day**, which said two of four claims were
wrong. The truth is that **all four were wrong**, and the QA lead had to show me the route with two
screenshots before I found it.

## The two probe faults that manufactured the whole problem

1. **I clicked the wrong three-dot.** A job-item row carries **more than one** `more_vert`. The first
   in DOM order is the **labor sub-row's**, whose menu holds a single item, `Add Labor Fee / Discount`.
   My selector took `.first()`, so on every line, on every work order, I read that one-item menu and
   concluded the feature set was absent. The item's own menu is the **leftmost** one on the row.
2. **I read a menu that was not on screen.** Quasar leaves closed menus in the DOM. `.q-menu .q-item`
   with no visibility filter returns a stale menu's items.
3. **I hunted a pencil.** There is none — **the editor opens by clicking the item**, and it carries
   both a **Status** dropdown (Authorization required / Declined / Authorized / Complete) and **Delete**.

## What the product actually does — all observed on production, build v26.39.0-07c719b

| | Observed |
|---|---|
| **Uncomplete** | On a finished item's own menu. Pressing it returns the item to **Approved** |
| **Delete line** | On the item's menu, and in the editor. A new item was created and deleted end to end; the confirmation reads *"Are you sure you want to delete this line? This cannot be undone."* |
| **Request part** | On the menu of every item that can take one; correctly **absent** on a finished item |
| **Authorization required** | On the item's menu at every status |
| **Decline** | On the menu, **greyed out** while the item holds received or picked parts, with the reason *"Line can't be declined while it holds received or picked parts, please move the parts to another line or return them."* |
| **Invoiced / paid work order** | The menu drops **Uncomplete, Decline, Authorization required and Delete line** entirely — the block the QA lead described, and the one C44602 item 3 asks for |
| **Parts across a reopen** | Identical either side. The only change is that an `edit` control appears, because the item became editable again |
| **Complete with outstanding parts** | Never greyed out — five approved items all offered it while parts sat In Stock and Awaiting |

## The QA lead's route, in his words, now in the playbook

A **Complete** item cannot be deleted directly: move it to **Authorization required** or **Decline** it
first, then delete. Deletable while Declined / Authorization required / Authorized. Still refused while
it holds staged parts — move the parts, cancel the order, or return the part. And **nothing can be
reopened or deleted once the work order is invoiced or paid**, so "finished" must be stated as either
*status Complete* or *work order invoiced/paid*; they behave differently.

## Verdicts

| Check | Was | Now |
|---|---|---|
| C44565 | Failed | **Failed — on one point only** (see below) |
| C44566 | Failed | **Passed** |
| C44567 | Failed | **Passed** |
| C44602 | Failed | **Passed** |
| C44603 | Failed | **Passed** |

**C44565's remaining point.** Items 1 and 2 pass. Item 3 says *"A Technician in Tech View cannot
complete (they cannot approve), but can still pick parts."* On the **reset, proven-default** Technician
role (6 permissions, including tech view mode and pick parts) the technician **completed a job item**.
Picking parts works as the check expects. **Whether the check or the product is wrong cannot be settled
without reading the source, and no source read has been authorised this pass (Rule 81), so nothing has
been reconciled against anything — that is stated rather than guessed (Rule 106).**

## The role was not default, and the first technician result was void

Per the QA lead's instruction the same day (now **Standing Rule 118**): pressing **Reset To Template**
on the Technician role **enabled Save**, which means another session had changed it. The product named
what came off: *Timesheets — View, Settings — Service, Settings — Finance*. It was saved, a second
reset left Save **disabled** (so the role is now genuinely default), and **both technician checks were
re-run on it**. The earlier nine-permission readings are withdrawn.

Raw readings: `p3c-all-dots.json` · `p3d-problem3-final.json` · `p3e-uncomplete-delete.json` ·
`p3g-reopen-invoiced.json` · `p3i-reopen-diff.json` · `p3j-limited-line-menus.json` ·
`p3k-tech-complete.json` · `p3n-role-reset.json` · `p3o-verify-reset.json` ·
`p3p-technician-default-perms.json`. Screenshots `p3b-*`, `p3c-*`, `p3d-*`, `p3e-*`, `p3g-*`, `p3i-*`,
`p3j-*`, `p3k-*`, `p3n-*`, `p3o-*`.
