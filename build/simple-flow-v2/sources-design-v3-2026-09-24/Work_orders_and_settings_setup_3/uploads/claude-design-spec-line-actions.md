# Work order line — actions spec

Use this as the single source of truth for which actions appear on a work order line,
what they are called, and what they do. Applies to the line row, the line ⋯ menu, and
the bulk action bar.

---

## 1. Line statuses

There are exactly four. Never invent a fifth.

| Status | Badge label | Badge colour |
|---|---|---|
| `authorization_required` | Needs Approval | amber |
| `authorized` | Approved | green |
| `authorization_declined` | Declined | red |
| `complete` | Complete | grey |

"Authorization required" is the same state as "Needs Approval". The **action** called
"Authorization required" sends a line back to Needs Approval — it does not create a new state.

---

## 2. Part statuses

| Status | Badge label | Button on the part row |
|---|---|---|
| Quoted, not ordered | Quoted | Order |
| Ordered, not received | Awaiting | Receive (split button — see 6) |
| Inventory, not picked | In Stock | Pick |
| Received or picked | *(empty — no badge)* | none |

A ready part shows **nothing** in its status cell. Empty means ready. Never label it "Staged".

---

## 3. Actions on a single line

`show` = visible and enabled · `hide` = not rendered at all

| Action | Needs Approval | Approved | Declined | Complete |
|---|---|---|---|---|
| Approve | show → Approved | hide | show → Approved | hide |
| Decline | show → Declined | show → Declined | hide | hide |
| Authorization required | hide | show → Needs Approval | show → Needs Approval | hide |
| Complete | hide | show → Complete | hide | hide |
| Uncomplete | hide | hide | hide | show → Approved |
| Request part | show | show | show | hide |
| Delete line | show | show | show | hide |
| Split to new work order | show | show | show | hide |

Rules:
- Never show an action that would produce the state the line is already in.
- Approve and Decline are buttons in the line's Action column. Everything else lives in the ⋯ menu.
- Complete replaces Approve/Decline in the Action column once the line is Approved.
- Line status changes never change part status. Part actions never change line status.

---

## 4. Bulk action bar

Dark bar pinned to the top of the list, replacing the column header row while a selection is active.
Layout: `[n selected]  [primary actions]  [More ▾]  [✕]`

### Counting

| Button | Counts lines with status | Excludes |
|---|---|---|
| Approve (n) | Needs Approval, Declined | Approved, Complete |
| Decline (n) | Needs Approval, Approved | Declined, Complete |
| Complete (n) | Approved | all others |
| Uncomplete (n) | Complete | all others |
| Authorization required (n) | Approved, Declined | Needs Approval, Complete |
| Delete lines (n) | Needs Approval, Approved, Declined | Complete |

| Button | Counts parts with status | Scope |
|---|---|---|
| Order n parts | Quoted | parts on Approved lines |
| Receive n parts | Awaiting | parts on Approved lines |
| Pick n parts | In Stock | parts on Approved lines |

Line actions count **lines**. Part actions count **parts** — `Receive 5 parts` may come from
two lines. Never mix the two in one count.

### Show / hide / disable — one rule for every button

| Condition | Behaviour |
|---|---|
| Nothing in the selection is eligible by status | **hide** the button |
| Eligible by status but blocked by an unmet requirement | **show disabled** + tooltip naming the blocker |
| Eligible and unblocked | **show enabled** with its count |

A count never includes lines or parts the action would skip.

### Disabled tooltips

| Button | Disabled when | Tooltip |
|---|---|---|
| Complete | selection has Quoted parts and ordering is required | This selection still has parts that haven't been ordered yet |
| Complete | selection has Awaiting parts and receiving is required | This selection still has parts that haven't been received yet |
| Complete | selection has In Stock parts and picking is required | This selection still has inventory parts that haven't been picked |

Missing tech story, mileage, engine hours or VIN must **never** disable Complete — those are
resolved inside the completion wizard.

### Primary vs More

Maximum three primary buttons. Promote the actions that move the dominant status of the
selection forward; everything else goes in More.

| Selection is mostly | Primary buttons |
|---|---|
| Needs Approval | Approve · Decline |
| Approved, no parts outstanding | Complete · Decline |
| Approved, parts outstanding | Complete · Order n parts · Receive n parts |
| Complete | Uncomplete |
| Declined | Approve |

---

## 5. Selection cases to support

| # | Selection contains | Expected bar |
|---|---|---|
| 1 | all Needs Approval | Approve (n) · Decline (n) · More |
| 2 | all Approved, no outstanding parts | Complete (n) · Decline (n) · More |
| 3 | all Approved, Quoted parts | Complete (disabled) · Order n parts · Decline · More |
| 4 | all Approved, Awaiting parts | Complete (disabled) · Receive n parts ▾ · Decline · More |
| 5 | all Declined | Approve (n) · More |
| 6 | all Complete | Uncomplete (n) only |
| 7 | Needs Approval + Approved | Approve (n) · Decline (n) · Complete (n) · More |
| 8 | + Declined | as 7; Approve count includes the Declined lines |
| 9 | + Complete | as 8; Complete lines excluded from every count |
| 10 | parts in several states | one part button per state, each with its own count |
| 11 | one line selected | identical rules, counts of 1 |

Worked example for case 9 — 6 lines selected: 3 Needs Approval, 1 Declined, 2 Approved,
with 5 Awaiting parts across them:
`6 selected · Approve (4) · Decline (5) · Complete (2) · Receive 5 parts ▾ · More`

---

## 6. Receive later

When `Require Receiving Parts` is ON, Receive is a **split button**: primary `Receive`, a
divider, and a caret opening a single item, `Receive later`.

- Visible only to users with the receive-later permission. Without it, render a plain
  `Receive` button with no caret.
- Applies on the part row and in the bulk bar.
- Never duplicate `Receive later` in the ⋯ menu while the split button is showing.
- Label is `Receive later`, never `Skip receive`.

---

## 7. Settings that change what appears

| Setting | OFF | ON |
|---|---|---|
| Require Ordering Parts | parts are ordered automatically; no Order button, Order step skipped | Order button on the part row and in bulk |
| Require Receiving Parts Before Completion | Receive available only in the ⋯ menu as an optional action | Receive button on the row and in bulk; receive-later split button appears |
| Require Picking Inventory Parts | inventory parts are ready immediately; no Pick button | Pick button on the row and in bulk |
| Require Approval for New Lines | new lines start Approved | new lines start Needs Approval |
| Require Review Before Completion | final action reads `Complete work order` | final action reads `Ready for review` |

Every toggle OFF is the simplest flow. Turning one ON always adds a step.

---

## 8. Assumptions to confirm — do not treat as final

1. Decline is hidden on a Complete line; reversing requires `Uncomplete` first.
2. Delete is hidden on a Complete line.
3. Uncomplete returns a line to Approved and leaves all part statuses untouched.
4. Bulk receive across parts from more than one vendor is unresolved — one vendor invoice
   number cannot cover several vendors.

---

## 9. Work order status gates everything above

Sections 3–7 only apply when the work order itself is editable. The work order has eleven
statuses (`WorkOrderStatus`): `estimate`, `approved`, `in_progress`, `ready_for_review`,
`complete`, `invoiced`, `paid`, `declined`, `hold`, `imported`.

| Work order status | Line actions | Part actions | Bulk bar |
|---|---|---|---|
| estimate | full | full | full |
| approved | full | full | full |
| in_progress | full | full | full |
| ready_for_review | full | full | full |
| complete | full | full | full |
| **invoiced** | **read only** | **read only** | selection allowed, no actions |
| **paid** | **read only** | **read only** | selection allowed, no actions |
| declined | verify | verify | verify |
| hold | verify | verify | verify |
| imported | verify | verify | verify |

`invoiced` and `paid` are hard read-only — the existing guard is
`!['invoiced','paid'].includes(workOrderStatus)`. Every action in section 3 and every bulk
button in section 4 must respect it, not just Uncomplete.

## 10. Permission gates

| Permission | Controls |
|---|---|
| `workOrderLinesCreateAndEdit` | every line action — approve, decline, complete, uncomplete, delete, request part |
| receive-later permission | the split-button caret only |
| view-only user | no bulk bar at all; no checkboxes on rows |

Signed in as Technician vs Admin changes what is visible. Design both: a technician without
line-edit permission sees rows and statuses but no checkboxes, no Action column buttons, and
no bulk bar.

## 11. Line composition

| Line contains | Notes |
|---|---|
| labor only, no parts | no part buttons; Complete is never blocked by parts |
| purchased parts only | Order / Receive apply |
| inventory parts only | Pick applies; Order and Receive never appear |
| both kinds | each part row follows its own status; bulk counts them separately |
| no labor, parts only | Complete still available — labor is not required to complete |

## 12. Empty and degenerate cases — must be designed, not left to chance

| Case | Expected |
|---|---|
| 0 lines selected | bar not rendered; column headers visible |
| every line selected via header checkbox | same rules; counts equal the whole work order |
| selection where **no action is available** (e.g. all Complete on an invoiced work order) | bar renders with `n selected`, the ✕, and the message `No actions available for this selection` — never an empty bar |
| More menu would be empty | hide the More button entirely |
| a part with no vendor | Receive still offered; opens the vendor-missing variant of the modal |
| parts from several vendors in one selection | UNRESOLVED — see 8.4 |

## 13. Rules as predicates

Apply these rather than memorising the tables. `S` = the set of selected lines.

    showApprove       = any(S.status in [NEEDS_APPROVAL, DECLINED])
    showDecline       = any(S.status in [NEEDS_APPROVAL, APPROVED])
    showAuthReq       = any(S.status in [APPROVED, DECLINED])
    showComplete      = any(S.status == APPROVED)
    showUncomplete    = any(S.status == COMPLETE)
    showDelete        = any(S.status in [NEEDS_APPROVAL, APPROVED, DECLINED])

    countOrder        = count(parts where status == QUOTED    and line.status == APPROVED)
    countReceive      = count(parts where status == AWAITING  and line.status == APPROVED)
    countPick         = count(parts where status == IN_STOCK  and line.status == APPROVED)

    editable          = workOrderStatus not in [INVOICED, PAID]
                        and user.has(workOrderLinesCreateAndEdit)

    renderButton(b)   = editable and show_b            -> enabled unless blocked_b
                        editable and show_b and blocked_b -> disabled + tooltip_b
                        otherwise                      -> not rendered

    blockedComplete   = (requireOrdering  and countOrder   > 0)
                        or (requireReceiving and countReceive > 0)
                        or (requirePicking   and countPick    > 0)

Note `blockedComplete` depends on the settings, not only on part state — an unordered part
blocks Complete only when ordering is required.
