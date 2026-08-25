# Line status ↔ part status — verified against the backend

Supersedes assumption 3 in `claude-design-spec-line-actions.md` ("line status transitions
never change part status"). **That assumption was wrong.** Line status changes DO cascade to
part requests.

Sources (api/src/VehicleService/WorkOrders/Domain):
- `Line/Service/StatusTransition.php` — the legal transitions and their guards
- `Line/Service/LineStatusManager.php` — the cascade
- `Line/Service/PartsAreReturnedValidator.php` — the de-authorize guard
- `Line/Service/LineCompletableValidator.php` — the complete guard
- `PartRequest/PartRequestStatus.php` — part statuses

---

## 1. Part request statuses (7, not 4)

| Value | Label |
|---|---|
| `requested` | Requested |
| `quoted` | Quoted |
| `authorized_to_order` | Auth to order |
| `waiting_to_receive` | **Awaiting** |
| `in_stock` | In Stock |
| `received` | Received |
| `returned` | Returned |

---

## 2. Legal line transitions — this IS the matrix

`✓` allowed · `✗` rejected by the backend · `guard` = allowed only if the guard passes

| From ↓ To → | Needs Approval | Approved | Declined | Complete |
|---|---|---|---|---|
| **Needs Approval** | — | ✓ | ✓ | **✗ not allowed** |
| **Approved** | ✓ *guard: parts returned* | — | ✓ *guard: parts returned* | ✓ *guard: line completable* |
| **Declined** | ✓ | ✓ | — | **✗ not allowed** |
| **Complete** | ✓ | ✓ *(= Uncomplete)* | ✓ *guard: parts returned* | — |

Consequences for the UI:

- **Complete must be hidden on Needs Approval and on Declined lines.** The backend throws
  `StatusTransitionNotAllowed`. The current UI offers it — that is the bug.
- **Decline IS allowed on a Complete line**, provided parts are returned. My earlier
  assumption that it should be hidden was wrong — show it, and let the guard produce the
  error. Same for Complete → Needs Approval.
- Declined and Complete are not terminal. Every state is reachable from every other except
  the two `✗` cells.

---

## 3. The cascade

`LineStatusManager` fires these on transition:

| Transition | Effect on the line | Effect on parts |
|---|---|---|
| → Approved | `recordLineChangedStatusToAuthorized()` | part requests are re-authorized — a demoted `quoted` request returns to its vendor-flow status (`Awaiting` etc.) |
| → Needs Approval | `recordLineDeauthorized()` | part requests are **demoted to `quoted`** |
| → Declined | `recordLineDeauthorized()` | part requests are **demoted to `quoted`** |
| → Complete | `markAsCompleted()` | none |
| from Complete → anything | `markAsUncompleted()` first, then the above | per the target status |

This is exactly the behaviour you observed: order a part → decline the line → part reads
`Quoted`; re-approve → part returns to `Awaiting`. Confirmed by a comment in
`LineCompletableValidator`: *"Declining demotes its pre-received part requests to QUOTED."*

**Design rule:** de-authorizing a line (Decline or Authorization required) visually resets
its parts to Quoted. Re-approving restores them. Claude Design must show this — parts do not
keep their badges through a decline.

---

## 4. Guard: parts are returned

Blocks Approved → Needs Approval, Approved → Declined, and Complete → Declined.
Throws `PartsNotReturned`.

Two conditions, both must hold:

1. total returned quantity **equals** total received quantity on the line
2. no inventory part request has a picked part with remaining quantity > 0

Plain English: **you cannot decline or de-authorize a line whose parts have already been
received or picked.** Return them first.

Per-status effect on that line:

| Part status | Blocks decline? |
|---|---|
| Requested, Quoted, In Stock | no |
| Auth to order, Awaiting | no — vendor-flow transient, nothing physical yet |
| Received, still held | **yes** |
| Received then fully returned | no |
| Picked from inventory, not returned | **yes** |
| Returned | no |

UI: Decline stays visible, disabled, tooltip
`Return this line's received parts before declining it.`

---

## 5. Guard: line is completable

Blocks Approved → Complete. Checks, in order:

1. tech story present — only if `requiresTechStories()`
2. mileage present — only if `requiresMileage()`
3. engine hours present — only if `requiresHours()`
4. **core parts resolved** — always, no setting
5. **all part requests fulfilled** — always, no setting

Item 4 is a completion blocker neither meeting covered. An unresolved core part throws
`CannotCompleteLineCorePartUpdateError`. It needs a wizard step or an explicit tooltip.

---

## 6. IMPORTANT: two different completion gates exist

| Gate | Used by | Parts rule |
|---|---|---|
| `validate()` | single-line complete | **all** part requests must be fulfilled, regardless of settings |
| `validateWorkOrderIsCompletable()` | Simple Mode work-order complete | inventory/found must be **picked** always; vendor parts must be **received** only when `requiresVendorInvoiceNumber()` |

So a work order can be completable while its individual lines are not, and the
require-receiving setting only relaxes the **work-order** path. The work-order gate also:

- rejects completion if **any** line is still Needs Approval
  (`All lines must be approved before completing the work order`)
- **skips declined lines entirely** — no tech story, no parts, nothing required of them

This divergence has to be resolved before build, because the wizard is reachable from both
the line-level Complete and the bulk/work-order Complete, and today they do not enforce the
same thing.

---

## 7. Parts button order in the bulk bar

Follow the physical lifecycle, always in this order, so the bar never reorders:

    Order n parts  →  Receive n parts  →  Pick n parts

Inventory picking is a separate track from the vendor flow, so Pick sits last. When more than
one part status is present in a selection, each gets its own button with its own count, in
that order. Supersedes the earlier Receive-before-Order ordering.

---

## 8. Corrections to the earlier spec

| Earlier | Corrected |
|---|---|
| Line status never changes part status | It does — de-authorize demotes to Quoted, re-approve restores |
| Decline hidden on Complete | Show it; guarded on parts being returned |
| Complete hidden on Needs Approval | Correct, and now confirmed by the backend |
| 4 part statuses | 7 |
| Receive before Order in the bar | Order, Receive, Pick |
| Parts blocking Complete depends on settings | Only on the work-order path; single-line always requires fulfilled parts |
