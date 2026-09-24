# Work order line — status × action matrix

## 0. There are only FOUR line statuses

From `app/src/api/work-orders/WorkOrdersModel.ts` (LineStatus) and
`app/src/components/ts/work-orders/work-order-lines/constants.ts` (LINE_STATUS_LABELS):

| Code value | Label shown to user |
|---|---|
| `authorization_required` | **Needs Approval** |
| `authorized` | **Approved** |
| `authorization_declined` | **Declined** |
| `complete` | **Complete** |

**"Needs Approval" and "Authorization required" are the same status.** The enum value is
`authorization_required`; the UI label is "Needs Approval". So the "Authorization required"
action does not create a fifth state — it sends a line *back* to Needs Approval.

That is why your instinct was right: on a Needs Approval line the "Authorization required"
action must be hidden, because you are already in that state.

`LineStatus.CanBeDeclined = 'can_be_declined'` exists in the enum but is referenced nowhere
in the front end — treat as dead/BE-only, not a UI state. Confirm with BE before designing
anything around it.

## 1. Recommended action availability

`✓` = show and enable · `–` = hide · `!` = currently allowed but shouldn't be (bug)

| Action | Needs Approval | Approved | Declined | Complete |
|---|---|---|---|---|
| Approve / Authorize | ✓ → Approved | – (no-op; today it just refreshes the page) | ✓ → Approved | – |
| Decline | ✓ → Declined | ✓ → Declined | – (already) | DECISION — see 3.1 |
| Authorization required | – (already there) | ✓ → Needs Approval | ✓ → Needs Approval | – |
| Complete | ! must be hidden | ✓ → Complete | – | – |
| Uncomplete | – | – | – | ✓ → Approved |
| Request part | ✓ | ✓ | ✓ | – (already hidden in code) |
| Delete line | ✓ | ✓ | ✓ | DECISION — see 3.2 |
| Split to new work order | ✓ | ✓ | ✓ | verify |

Two current-behaviour notes confirmed in code:
- **Uncomplete already exists** in the line ⋯ menu, gated on `status === 'complete'`,
  `canCreateEditLine`, and `workOrderCanBeChanged`. Nothing new to build — reuse it and
  surface it in the bulk bar.
- **Request part** is already hidden on completed lines (`row.status !== 'complete'`).

Two bugs to raise:
- **Complete is offered on a Needs Approval line.** Should be hidden — you cannot complete
  unapproved work.
- **Authorize on an already-authorized line** is a no-op that reloads the page. Hide it.

## 2. State machine

    Needs Approval  --Approve-->  Approved  --Complete-->  Complete
          |  ^                       |  ^                     |
       Decline                   Decline |                Uncomplete
          v  |                       v   |                     |
       Declined --Approve--> Approved <--+---------------------+
          |
          +--Authorization required--> Needs Approval

Every non-terminal transition is reversible. `Complete` is the only status that changes
financial state, which is why the two decisions below matter.

## 3. Decisions needed

### 3.1 Can you Decline a completed line?
Two options:
- **A — hide Decline on Complete.** Force `Uncomplete → Decline`. Two clicks, but every
  state change is explicit and auditable.
- **B — allow it,** transitioning `Complete → Declined` directly.

Recommend **A**. Uncomplete already exists and already carries the
`workOrderCanBeChanged` guard, so it is the one place that knows whether reversing a
completion is even legal. A direct Complete → Declined path would need to duplicate that
guard.

### 3.2 What happens to parts when a line leaves Complete?
This is the real question behind Uncomplete, and it is not a UI decision:

| Part state at completion | On Uncomplete | Needs answer from |
|---|---|---|
| Picked from inventory (stock deducted) | stays picked, or stock returned? | BE / QuickBooks |
| Received against a vendor invoice | stays received (money already spent) | recommend: unchanged |
| Quoted, never ordered | unchanged | – |

Recommendation: **line status transitions never change part status.** Parts have their own
lifecycle and their own return flow. Uncomplete reverses the line only.

### 3.3 Is Uncomplete blocked once the work order is invoiced or paid?
`workOrderCanBeChanged` already gates the existing menu item — read what that resolves to
and mirror the same rule in the bulk bar so the two entry points cannot diverge.

## 4. Bulk bar counting (derived from section 1)

| Bulk button | Counts lines in status | Excludes |
|---|---|---|
| Approve (n) | Needs Approval + Declined | Approved, Complete |
| Decline (n) | Needs Approval + Approved | Declined, Complete |
| Complete (n) | Approved | all others |
| Uncomplete (n) | Complete | all others |
| Authorization required (n) | Approved + Declined | Needs Approval, Complete |
| Delete (n) | Needs Approval + Approved + Declined | Complete |

Matches the screenshot: 6 selected = 3 Needs Approval + 1 Declined + 2 Approved
→ Approve (4) · Decline (5) · Complete (2) · Receive 5 parts.

Governing rule: nothing eligible by status → hide the button. Eligible but blocked by an
unmet requirement → disabled with a tooltip naming the blocker. Never show a count that
includes lines the action will skip.

## 5. Parts dimension (independent of line status)

Part states: `QUOTED` (not ordered) · `AWAITING` (ordered, not received) ·
`IN STOCK / needs picking` · received or picked (renders empty).

Parts actions are counted from part state and only on Approved lines. They never change
line status, and line actions never change part status — with one exception to confirm:
does completing a line force-resolve its parts today?
