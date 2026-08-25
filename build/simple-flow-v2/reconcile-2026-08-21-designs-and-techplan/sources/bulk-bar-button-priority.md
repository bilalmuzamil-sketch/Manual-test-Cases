# Bulk bar — which buttons, in which order

Companion to `claude-design-spec-line-actions.md`. That document says *whether* a button
exists. This one says *where it goes* and *what it is called*.

---

## 1. Action inventory

| Action | Label | Counts |
|---|---|---|
| Complete | see section 4 | lines |
| Approve | `Approve (n)` | lines |
| Decline | `Decline (n)` | lines |
| Receive parts | `Receive n parts` | parts (split button) |
| Order parts | `Order n parts` | parts |
| Pick parts | `Pick n parts` | parts |
| Authorization required | `Authorization required (n)` | lines |
| Uncomplete | `Uncomplete (n)` | lines |
| Split to new work order | `Split to new work order` | lines |
| Delete lines | `Delete lines (n)` | lines |

---

## 2. Bar anatomy

    [ n selected ] | [ slot 1 ] [ slot 2 ] [ slot 3 ] [ More ▾ ] .......... [ ✕ ]

- Three primary slots, maximum. Everything else goes in More.
- Slot 1 is filled, then 2, then 3. Slots are never left empty with later slots filled.
- If More would be empty, do not render the More button.
- If no action at all is available, render `n selected`, the message
  `No actions available for this selection`, and the ✕.

---

## 3. Ordering algorithm — trace this

**Step 1 — find the dominant status.** Count the selected lines by status. The dominant
status is the one with the most lines. On a tie, take the earliest in the lifecycle
(Needs Approval → Approved → Declined → Complete).

**Step 2 — slot 1 is the action that advances the dominant status.**

| Dominant status | Slot 1 |
|---|---|
| Needs Approval | `Approve (n)` |
| Approved | Complete (label per section 4) |
| Declined | `Approve (n)` |
| Complete | `Uncomplete (n)` |

**Step 3 — fill slots 2 and 3** from this fixed priority list, skipping anything already
placed and anything not visible per the predicates:

    1. Complete
    2. Approve (n)
    3. Decline (n)
    4. Receive n parts
    5. Order n parts
    6. Pick n parts

**Step 4 — everything else goes to More,** in this order: Authorization required,
Uncomplete, Split to new work order, Delete lines.

**Step 5 — stability.** Slot 1 keeps its identity while the dominant status is unchanged.
A button that becomes disabled stays in its slot; it does not get demoted to More and the
others do not shift left. Resolving parts must never make the bar reshuffle under the
user's cursor.

---

## 4. Completion label depends on selection scope

| Selection | Require Review OFF | Require Review ON |
|---|---|---|
| every line on the work order | `Complete Work Order` | `Ready for Review` |
| a subset of lines | `Complete Selected Lines (n)` | `Complete Selected Lines (n)` |
| one line | `Complete Selected Lines (1)` | `Complete Selected Lines (1)` |

Review is a work-order-level concept, so `Ready for Review` only ever appears when the whole
work order is selected. Completing a subset cannot put the work order into review.

Keep `Complete Selected Lines (1)` in the singular case — one label with a count reads more
consistently than switching between two strings.

---

## 5. Worked scenarios — the designer should be able to reproduce each

### S1 — all Needs Approval, no parts
4 selected, all Needs Approval.
Dominant = Needs Approval → slot 1 `Approve (4)`, slot 2 `Decline (4)`.
More: Split, Delete.

    4 selected | Approve (4) | Decline (4) | More ▾

### S2 — all Approved, parts all received, whole work order selected
Dominant = Approved → slot 1 Complete, all lines selected → `Complete Work Order`.

    4 selected | Complete Work Order | Decline (4) | More ▾

### S3 — all Approved, 6 parts awaiting receipt, whole work order selected
Complete is visible but blocked by unreceived parts (receiving required).
It stays in slot 1, disabled, with a tooltip. This is the first screenshot.

    4 selected | Complete Work Order (disabled) | Decline (4) | Receive 6 parts ▾ | More ▾

### S4 — one Approved line selected out of four
Scope is a subset → label changes. This is the second screenshot.

    1 selected | Complete Selected Lines (1) | Decline (1) | More ▾

### S5 — mixed, Needs Approval dominant
6 selected: 3 Needs Approval, 1 Declined, 2 Approved, 5 parts awaiting.
Dominant = Needs Approval → slot 1 `Approve (4)` (3 pending + 1 declined),
slot 2 `Decline (5)`, slot 3 `Receive 5 parts`.
Complete (2) is visible but has no slot left → More.

    6 selected | Approve (4) | Decline (5) | Receive 5 parts ▾ | More ▾
    More: Complete Selected Lines (2), Authorization required (3), Split, Delete lines (4)

### S6 — mixed, Approved dominant, parts in three states
5 selected: 4 Approved, 1 Needs Approval. Parts: 2 quoted, 3 awaiting, 1 in stock.
Dominant = Approved → slot 1 Complete (disabled), slot 2 `Approve (1)`,
slot 3 `Decline (5)`. All three parts buttons overflow.

    5 selected | Complete Selected Lines (4) (disabled) | Approve (1) | Decline (5) | More ▾
    More: Order 2 parts, Receive 3 parts, Pick 1 part, Authorization required, Split, Delete

Note: this is the case where the parts actions — the things that would *unblock* Complete —
are buried in More. Consider promoting parts actions above Decline when Complete is disabled
because of parts. Decide with Sasha; S6 is the scenario to show him.

### S7 — all Complete
Dominant = Complete → slot 1 `Uncomplete (3)`. Nothing else is available.

    3 selected | Uncomplete (3) | More ▾   (More: Split)

### S8 — all Declined
Dominant = Declined → slot 1 `Approve (2)`.

    2 selected | Approve (2) | More ▾   (More: Authorization required (2), Split, Delete lines (2))

### S9 — invoiced or paid work order
No action is permitted regardless of line status.

    3 selected | No actions available for this selection | ✕

### S10 — simple mode, nothing required
Ordering, receiving and picking all not required. Parts never block completion and no parts
buttons ever appear.

    4 selected | Complete Work Order | Decline (4) | More ▾

---

## 6. Disabled vs hidden vs More

| Situation | Treatment |
|---|---|
| not applicable to any selected line | hidden entirely |
| applicable but blocked by an unmet requirement | visible, disabled, tooltip names the blocker |
| applicable and unblocked but lower priority | in More, enabled |
| applicable, blocked, and lower priority | in More, disabled, same tooltip |

Complete is never hidden when the selection contains an Approved line — it is either enabled
or disabled. Hiding it would remove the user's only signal about what is missing.

---

## 7. Open — needs a decision

1. **S6 promotion:** when Complete is disabled because of parts, should the unblocking parts
   action take slot 2 ahead of Decline?
2. **Multi-vendor receive:** `Receive n parts` where the parts span several vendors. One
   invoice number cannot cover several vendors.
3. Whether `declined`, `hold` and `imported` work orders are editable like the first five
   statuses or read-only like invoiced and paid.
