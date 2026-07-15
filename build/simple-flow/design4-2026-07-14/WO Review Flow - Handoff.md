# Work Order — Review & Completion Flow · Developer Handoff

This document specifies the behavior built in the `WO Review Flow` prototype: the completion wizard, the optional review gate, the separate tech-story flow, and parts receiving. It is the source of truth for finishing implementation against the Jira stories. Every state, branch, and edge case shown in the prototype is listed here.

- **Prototype:** WO Review Flow.html
- **Epic:** SV-7301 (Simple Mode)
- **Stories:** SV-7697 / SV-7698 / SV-7699 · SV-7710 · SV-7870
- **Spec:** Simple Mode V1.4

---

## 1. Org settings that drive the flow

Six org-level settings change how completion behaves. In the prototype these are the toggles in the bottom-right Prototype panel; in production they come from Workflow Settings.

| Setting | Values | Effect |
|---|---|---|
| **Require review before completion** | On / Off | On → completing sends the WO to **Review** instead of **Complete**. Final CTA becomes "Send to Review". |
| **Create purchase orders** | On / Off | On → vendor parts generate POs; the receiving step appears. Off → no receiving step. |
| **Vendor invoice number** | Optional / Required | Sub-setting of Create POs. Required → WO cannot complete until parts are received (invoice # captured on the receiving page). Optional → user may "Complete Without Receiving". |
| **Require tech story** | On / Off | On → every line needs a tech story before completion; the tech-story flow gates the completion modal. |
| **Require VIN / mileage / engine hours** | On file / Missing | Missing → the Details step is shown to capture them. (See §5 for the review-mode split.) |
| **Current user role** | Advisor / Manager | Only a Manager (foreman/owner) can sign off review. Advisors see a disabled "Mark Reviewed" with an "Awaiting review" tooltip. |

---

## 2. Work order states & badges

The WO summary badge reflects the lifecycle. Review adds two intermediate states between Approved and Complete.

```
Active → [complete] → Review → [mark reviewed] → Reviewed → [complete WO] → Complete
— with review OFF, Active → [complete] → Complete directly —
```

| State | Badge | Primary action shown |
|---|---|---|
| Active (in progress) | `Approved` (green) | Complete Work Order |
| Sent for review | `Review` (amber) | Mark Reviewed (manager only) · Advisor sees disabled + "Awaiting review" |
| Reviewed (signed off) | `Reviewed` (green) | Complete Work Order (returns, any role) |
| Completed | `Complete` (amber) | — (invoice-ready; success screen offers "Go To Invoice") |

> A status banner appears under the action bar for the **Review** (amber, "Ready for Review") and **Reviewed** (blue, "sign-off complete") states to explain what's blocking invoicing.

---

## 3. Tech story — separate flow (per line)

Tech story is **not** a step inside the completion modal. It is its own modal, because some shops have a different person enter stories than the one completing the WO.

### Entry points

- **Inline** — each line has a **Story** sub-row. Empty shows an "Add tech story for this line" link; clicking opens the tech-story modal at that line.
- **As a gate** — clicking **Complete Work Order** while "Require tech story" is on and any line is missing a story opens the tech-story modal first; on finish it chains directly into the completion modal.

### Modal behavior

- Header: "Tech story" + `WO# · Customer`.
- Per-line card shows line number, line name, and **Technician: {name}**; counter reads "Line X of N".
- Required textarea per line. **Next** is disabled until non-empty. **Back** appears after line 1.
- Last-line button: **Continue** when chained into completion, otherwise **Save** (closes back to the WO).
- Saved stories render inline: green check + the story text + an **Edit** link.

> ⚠️ **Spec divergence to confirm (Story 15 / S15-R2):** V1.4 says tech story stays **on the line, not in a modal** — only mileage + VIN belong in the completion modal. Our build collects it in a dedicated modal. Decide whether to keep the modal or move story entry to the line before finalizing.

---

## 4. Completion wizard

Triggered by **Complete Work Order**. Steps are assembled dynamically — only the steps that apply are shown, with a step-pill header. Title is "Complete Work Order" (or "Complete & Send to Review" in review mode).

| Step | Shown when | Order |
|---|---|---|
| Details (VIN / mileage / hrs) | fields missing | 1st |
| Receive parts & invoice | Create POs on AND parts waiting | 2nd |
| Success screen | always (terminal) | last |

If no steps apply, completion goes straight to the success screen. **Cancel** closes the modal without changing the WO. The final CTA label is **Complete Work Order** or, in review mode, **Send to Review**.

### Success screen

- **Complete:** green check, "Work order complete", invoice total, buttons _Done_ + _Go To Invoice_.
- **Review:** amber clipboard, "Sent for review", note that a manager must review before invoicing. Button _Done_.

---

## 5. Details step — VIN / mileage / engine hours

All three are required inputs; **Continue** is disabled until valid. On continue, values write to the vehicle sidebar.

> ⚠️ **Review-mode split (key rule):** when review is **on**, the Details step in "Complete & Send to Review" shows **only Mileage + Engine Hours**. **VIN is collected later**, by the reviewer, in the "Mark Reviewed" dialog (required there). Rationale: the completer is not necessarily the technician, and VIN sign-off belongs to the reviewer. When review is **off**, all three are asked together in the completion modal as normal.

---

## 6. Parts & receiving step

Only when Create POs is on and parts are waiting. Behavior depends on the Vendor-invoice setting.

### Optional vendor invoice

- Modal shows "N parts waiting to receive" + note that inventory parts are auto-picked on completion.
- Two actions: **Receive Parts** (opens the receiving page) or **Complete Without Receiving** / **Send to Review** (skip).

### Required vendor invoice

- Modal lists each vendor + the part(s) to receive. The completion CTA is **disabled** until all are received.
- **Receive Parts** opens the full receiving page; receiving captures qty, tax, date, delivery note, and the invoice number per vendor.
- Each vendor receives independently; when all vendors are received the page auto-returns to the modal (~1s) with the CTA enabled.

> The receiving page is reached **identically** for optional and required — "Receive Parts" always routes to the same Accept-Delivery page (supports partial qty, tax, dates). The only difference is whether skipping is allowed.

---

## 7. Review gate & sign-off

1. Completer runs the wizard; final CTA **Send to Review**. WO → **Review**; all lines lock to **Complete**; inventory parts auto-picked.
2. A **Manager** clicks **Mark Reviewed** → confirm dialog: **VIN (required, if missing)** + optional review note. Confirm is disabled until VIN entered.
3. An **Advisor** cannot sign off — the button is disabled with an "Awaiting review" tooltip.
4. On confirm → WO completes and the invoice-ready success screen appears (Go To Invoice).

---

## 8. Full case matrix

Every combination the prototype demonstrates (review × PO × invoice × fields × story).

| # | Settings | Path |
|---|---|---|
| 1 | Review off · PO off | Complete → (Details if missing) → success "Complete" → Go To Invoice |
| 2 | Review off · PO on · invoice optional | Complete → Details → Parts(optional): Receive or Complete Without Receiving → success |
| 3 | Review off · PO on · invoice required | Complete → Details → Parts(required): must receive all → success |
| 4 | Require tech story on | Complete → tech-story modal (per line) → chains into completion wizard |
| 5 | Review on (any PO/invoice) | Complete & Send to Review → Details (**mileage + hrs only**) → Parts → "Send to Review" → state Review |
| 6 | Review on · role Advisor | Mark Reviewed disabled ("Awaiting review") |
| 7 | Review on · role Manager | Mark Reviewed → VIN + note dialog → Confirm → Completed → Go To Invoice |
| 8 | Fields on file | Details step skipped entirely |
| 9 | Tech story added inline first | Story rows show check + text; completion no longer gated by story |

---

## 9. Element test IDs

Stable hooks already in the prototype for QA automation:

| Test ID | Element |
|---|---|
| `input_tech_story` | Tech story textarea (per line) |
| `button_mark_reviewed` | Mark Reviewed action (role-gated) |
| `input_review_vin` | VIN field in the Mark Reviewed dialog |
| `input_review_note` | Optional review note |
| `button_confirm_review` | Confirm Reviewed |

---

## 10. Open items / not yet built

- **[Confirm]** Tech story placement — modal (built) vs. on-the-line (spec S15-R2).
- **[Story 15]** Close-vs-Cancel confirmation when leaving the completion flow mid-way (design pending in spec).
- **[Story 4]** Inline invoice entry inside the required-invoice modal + delete-line-from-modal — we currently route to the receiving page instead.
- **[Story 1]** Surface Require-review & VIN-required toggles in Workflow Settings (today review lives only in the prototype panel; settings ship Mileage/Engine Hours).
- **[Story 16]** "Ready for Review" queue — list filter/column for reviewers.

---

_Pair this with the interactive prototype (WO Review Flow.html) — drive each row of the case matrix from the Prototype panel to see the exact UI. Hand both to Claude Code to finalize against the Jira acceptance criteria._
