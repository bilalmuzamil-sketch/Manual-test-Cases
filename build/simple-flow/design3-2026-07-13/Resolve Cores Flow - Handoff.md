# Resolve Cores — Completion Flow Step · Developer Handoff

This document specifies the behavior built in the `Resolve Cores Flow` prototype: the new **Resolve cores** gate step inside the completion wizard, where it sits in the step order, the OK / Not OK decision reused from the line, and why it blocks completion. It is the source of truth for finishing implementation against the Jira stories. Every state, branch, and edge case shown in the prototype is listed here.

- **Prototype:** Resolve Cores Flow.html
- **Canvas:** Simple Flow Design.html → "Resolve Cores — Completion Flow Step" section
- **Epic:** SV-7301 (Simple Mode)
- **Model flow (reuse):** WO Review Flow.html + WO Review Flow - Handoff.md
- **Spec:** Simple Mode V1.4

---

## 1. Where it sits

The completion wizard assembles its steps dynamically; only the steps that apply are shown, with a step-pill header.

```
Details → Pick parts → Resolve cores → Receive → Complete
```

| Step | Shown when | Order |
|---|---|---|
| **Details** (VIN / mileage) | fields missing | 1st |
| **Pick parts** | auto-pick is OFF and inventory parts need picking | 2nd |
| **Resolve cores** | WO has **≥ 1 unresolved core part** | 3rd |
| **Receive** | Create POs on AND parts waiting | 4th |
| Success screen | always (terminal) | last |

If a step's condition isn't met it is skipped entirely — including **Resolve cores** when there are no cores (nothing to funnel). If no steps apply, completion goes straight to the success screen.

---

## 2. What the Resolve cores step does

- Lists **only the core parts** — every non-core line is funnelled out. One row per core.
- Each row shows: **part name**, the **line** it sits on, the **core charge amount**, and its source group.
- Cores are grouped by source: **Inventory cores** and **Special order cores** (vendor). Both use the identical control.
- Each core gets a two-way choice:
  - **OK · returned** → old unit came back → **no charge**.
  - **Not OK · keep + charge** → customer keeps the old unit → **core charge added to invoice**.
- A progress readout ("N / M resolved" + bar) and a running "+$X to invoice" total update live as decisions are made.

---

## 3. Blocking logic (why it gates completion)

**Completion is blocked until every core is resolved.** The step's **Continue** CTA stays `disabled` until all cores have an OK / Not OK choice.

The rule behind it: **the invoice only bills a core once it's resolved.** An unresolved core means the charge decision hasn't been made, so the money is undecided. Resolution must therefore happen **before** completion.

> **Key edge case:** this also gates the optional-invoice **"Complete Without Receiving"** path. Cores are normally resolved on the receive step in the old flow; by pulling resolution into its own earlier step, a user who skips receiving still cannot bypass the core decision. Because cores are resolved *before* Receive, the Receive step's "Complete Without Receiving" is safe to leave unblocked.

---

## 4. Reuse — same OK / Not OK as the line

This is **not** a new decision. The same OK / Not OK control already exists on each core line today. The step just **funnels those line-level decisions into one place** in the completion flow instead of making the user hunt for them line by line.

- On the **lines table**, each core line carries an inline `Ok / Not Ok` toggle plus a resolved-status chip (green "OK · returned" / amber "Not OK · +$X").
- Decisions made inline and decisions made in the wizard step are the **same state** — resolving on the line pre-fills the step, and vice-versa. If all cores are resolved inline before completion, the wizard **skips** the Resolve cores step.
- Resolved "Not OK" charges surface in the **Financial Info** sidebar (Core charges row) and roll into the invoice-ready total on the success screen.

---

## 5. Prototype panel (org settings that drive the flow)

The bottom-right Prototype panel toggles map to production settings:

| Control | Values | Effect |
|---|---|---|
| **Cores on this work order** | None / Inventory only / Special-order only / Mixed | Which cores exist. None → Resolve cores step skipped. |
| **Inventory parts to pick** | Need picking / Auto-picked | Need picking → Pick parts step shown (auto-pick off). |
| **VIN / mileage** | On file / Missing | Missing → Details step shown first. |
| **Create purchase orders** | On / Off | On → Receive step appears. |

---

## 6. Step details

### Details (§ reuse from WO Review Flow)
VIN + mileage required; **Continue** disabled until both filled. On continue, values write to the vehicle sidebar.

### Pick parts (auto-pick off)
- Default view: "Auto-pick is off — N parts need picking." Two actions: **Pick all from default bins** (primary) or **Review individually** (secondary).
- **Pick all** → all parts marked picked from their default bin; a green "N parts picked" confirmation with **Undo** shows; **Continue** enabled.
- **Review individually** → per-part list with a bin `<select>` and a Pick checkbox each; **Continue** enabled only once all parts are picked.

### Resolve cores
As specified in §2–§4. Grouped list, per-core OK / Not OK, progress + live charge total, **Continue** gated on all-resolved.

### Receive
- Matches the live receive step: "2 parts waiting to receive" info card + note that inventory parts are auto-picked on completion.
- Adds a green **"All N cores resolved"** indicator (with the core-charge total if any) — confirms the gate was cleared before receiving.
- Actions: **Receive Parts** (routes to Accept-Delivery page) or **Complete Without Receiving**.

### Success
Green check, "Work order complete", invoice-ready draft breakdown: Parts & labor + Core charges (kept count) + Invoice total. Buttons _Done_ + _Go To Invoice_.

---

## 7. Full case matrix

Drive each from the Prototype panel, or open the deep-linked artboard.

| # | Scenario | `?screen=` | Path / result |
|---|---|---|---|
| 1 | Pick parts, auto-pick off | `pick-default` | Pick all / Review individually |
| 2 | Pick parts, review one by one | `pick-review` | Per-part bin + checkbox list |
| 3 | WO with unresolved cores | `wo-cores` | Inline OK / Not OK on the lines table |
| 4 | Resolve cores — unresolved | `cores-unresolved` | Continue blocked |
| 5 | Resolve cores — partial | `cores-partial` | One set, still blocked |
| 6 | Resolve cores — all resolved | `cores-resolved` | Mix OK / Not OK, Continue enabled, +$ to invoice |
| 7 | Inventory cores only | `cores-inventory` | Single "Inventory cores" group |
| 8 | Special-order core only | `cores-special` | Single "Special order cores" group |
| 9 | Receive after resolving | `receive-after` | Cores-resolved indicator shown |
| 10 | No cores | `none-skipped` | Resolve cores step skipped entirely |
| 11 | Success | `success` | Invoice-ready draft with core charge billed |
| 12 | Interactive | *(no param)* | Full flow + scenario panel |

---

## 8. Open items / to confirm

- **[Confirm]** Core-charge amounts and part identifiers in the prototype are representative — wire to the real line/core data model.
- **[Confirm]** Whether special-order (vendor) cores resolve at the same moment as inventory cores, or need a vendor-return reference captured alongside the Not OK decision.
- **[Confirm]** Copy for the two options — prototype uses "OK · returned" / "Not OK · keep + charge" to disambiguate from the terse line-level "Ok / Not Ok".
- **[Story]** Surface the unresolved-core count as a completion blocker on the WO action bar (prototype shows a violet alert banner).

---

_Pair this with the interactive prototype (Resolve Cores Flow.html) — drive each row of the case matrix from the Prototype panel, or append `?screen=…` to jump straight to a state. Hand both to Claude Code to finalize against the Jira acceptance criteria._
