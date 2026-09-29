# Maintenance Reminders — design handover 3

**SV-3780 · 2026-09-08 · amendment to `maintenance-design-handover.md` (base) and `maintenance-design-handover-2.md`. Read both first. This document wins wherever it contradicts them, and it contradicts them in four places — they are marked ⛔ WITHDRAWN.**

This is the delta from the **Sasha walkthrough of 2026-09-08**, a screen-by-screen pass over the current canvas. No surface was rejected and nothing needs a rebuild. The theme of the review was **cut, unify, and stop inventing patterns** — most items here delete something.

**All global rules from the base handover still apply**: no explanatory hint copy on artboards, existing design-system components only, compliance orange never red, every artboard belongs to a band.

**Two standing instructions from this review, applied everywhere:**

- **Delete the internal `not in design system` markers** from every artboard. They are Milos's own annotations and must not ship on the canvas.
- **Delete decorative `ⓘ` eye/info icons** wherever they sit next to a field for no reason. An info icon is allowed only where this document asks for one.

---

## 0. Rename — again, and this one supersedes handover 2

⛔ **WITHDRAWN from handover 2 §0:** the rename to *Maintenance programmes*.

| Where | Was (h2) | Is now |
|---|---|---|
| The object a shop builds | Maintenance programme | **Maintenance schedule** |
| Create modal title / list CTA | New programme | **New maintenance schedule** |
| Everywhere the word *programme* appears | Programme | **Schedule** |

*Programme* is dead. Sweep every artboard, breadcrumb, empty state, modal title, menu item and column header.

⚠️ **This creates a collision you must not resolve on your own.** The email timing control in Reminder settings is currently also called the **reminder schedule** (handover 2 §3). Two different things cannot both be *schedule*. **Do not rename the timing control** — flag the collision on the artboard and leave it for the next review. A working proposal to sketch beside it, not to adopt: the timing rows become **reminder timing**, and *schedule* belongs to the maintenance object only.

**Also unify the template language.** *Start from example*, *start from a common service* and *template* are all in use for the same idea. **The word is `template`**, matching DVI. One vocabulary across schedule-level and service-level selection.

⚠️ **`Enroll` vs `Apply` is open.** *Apply* is more honest about what happens (§6), *enroll* is what the canvas says today. Raised and not ruled. **Keep `enroll` on the canvas** and flag it; do not sweep it.

---

## 1. Creating a schedule — the wizard

**`Continue` becomes `Create`** on the new-schedule modal, both branches (blank and from template). The schedule is created the moment that button is pressed. A mistake is fixed by deleting the schedule from the list, and that is acceptable.

**Delete the `Save` button on the schedule editor.** ⛔ **WITHDRAWN:** any artboard, state or flow that implies a schedule is saved as a unit. There is no draft schedule, no save state, no dirty state, no unsaved-changes warning.

Why, and it drives §6 as well: a save on the schedule level would mean a change to a service only takes effect on save, so the *"this affects N assets"* conversation would have to happen **twice** — once on the service edit and once on the schedule save. Services save themselves; the schedule is just their container.

**Delete the step 1 / step 2 pattern on the editor.** ⛔ **WITHDRAWN:** the `Program name` step. It is a new pattern that exists nowhere else in ShopView.

Replace it with the DVI pattern: the title reads **`Untitled schedule`** at the top of the page with an inline edit affordance (pencil), edited in place. What was *step 2* becomes a plain **`Services`** section — no step number, no numbered spine.

**Delete `Started from <template>`.** Fluff — valuable for about a minute after creation and meaningless a year later.

---

## 2. Template selection — one pattern, not two

Today the canvas has **two different UIs for the same idea**: a modal wizard at the schedule level (*start blank / start from example*) and an inline selector inside the service form (*start from a common service*). This was the review's main structural complaint.

**Unify on the wizard.** Creating a service opens a modal that asks **blank or template** first — the same shape as the schedule modal, and the same shape as the DVI *create inspection template* screen. Choose, press **`Create`**, and the form opens populated. **You are then locked in.**

**Delete the in-form template selector.** ⛔ **WITHDRAWN:** any control that lets a user swap templates while a service form is populated.

The reason is interaction cost, and it is worth stating on the artboard notes so it does not creep back: an in-form selector forces us to design *"I picked template A, edited it, picked B, edited it, went back to A — is my work still there?"*, plus a destructive-change warning to go with it. A wizard step has none of that.

**Reference the DVI *create inspection template* screen for layout** — template list above, `Build from scratch` below, single `Create` action. Match it rather than inventing.

**Keep the template names as they are.** `PM-A` · `PM-B` · `PM-C` · `PM-D` · `CVIP` are genuine industry-standard names, confirmed twice. Values behind them differ between US and Canada (miles vs kilometres, different intervals) and are fully editable after creation — the template only nudges.

**Both levels of template survive.** A **schedule template** (highway tractor, refuse, trailer, light truck — carrying several services at once) and a **service template** (PM-A, CVIP) are different things and both stay. The complaint was never that there are two, it was that they looked like two unrelated products.

---

## 3. Triggers and intervals — calendar becomes mandatory

⛔ **WITHDRAWN from handover 2 §2a:** the auto-tick-and-lock treatment. There is no ticked-and-locked calendar checkbox, and no `(locked)` label.

**The calendar is required and not selectable.** Draw it as the first interval row on the form, always present, always editable, value blank and required:

```
Interval
  Calendar         every [        ] months          ← always present, required

Additional triggers
  [ ] Distance     every [ 15,000 ] mi
  [ ] Engine hours every [        ] hrs
```

Distance and engine hours are **additional triggers**, optional, and each reveals its own interval row when selected. One calendar row regardless of how many meters are on.

**Why it is mandatory, for the artboard note:** distance and engine-hour readings frequently do not exist — telematics coverage will stay poor even after an odometer integration, since the providers are fragmented and it is the shop's *customer*, not the shop, who holds those accounts. The calendar is the fallback that guarantees a reminder ever fires. It cannot be silent (a hidden interval would be the same value for every service, which is wrong) and it cannot be optional.

**Whichever comes first still governs.** Say it once, in **plain grey body text or the section tooltip** — not in a yellow warning panel.

**Delete from this block:**

| Delete | Why |
|---|---|
| The **yellow `whichever comes first` warning panel** | It is information, not a warning — nothing is going wrong |
| The **`OR` separators** between trigger rows | Redundant once the sentence above exists |
| The **`Required before the service can be saved`** helper line | Validation handles it; the form simply will not save |
| The **per-trigger helper sentences** (*"Do every set distance the unit travels"*) | Nobody can parse them, and they cost a lot of vertical space. Move the explanation into **one tooltip beside the section heading** |
| The **`Take a trigger to set its interval`** instruction line | Self-evident from the control |

**Copy:** the word is **`select`**, never **`tick`**.

**Interval inputs.** Whole numbers only — `3.5 months` must be impossible. Either a pick list or a free input with inline validation; **draw both and flag for a pick.** Minimum 1, no negatives, sane maximum per unit. Units render as **abbreviations** — `mi` · `km` · `hrs` · `months` — not spelled out; they are narrower and read better.

---

## 4. Compliance services

**Compliance stays its own flagged type.** Re-confirmed against the *"just make term another trigger"* alternative, and rejected for a concrete reason worth carrying on the artboard: a lapsed certificate puts the asset **out of service**. A missed oil change does not. That difference justifies a different lead time and a different treatment.

**Rename `Work list lead time`.** It reads as jargon. It is **when the first reminder fires**, so name it that way — e.g. `Start reminders`, with the value shown as a count of months.

- **Months only.** No day-level granularity anywhere in the compliance branch.
- **Default 1 month**, which is the actual shop practice.
- **Range 1–4 months.** Four is the observed outer edge; a full year is meaningless.
- ⚠️ **Open:** per-service (as drawn) or one global setting in Reminder settings. Fabijan to rule. **Keep it on the service form** and flag it — it is cheap to move later.

**Delete the reminder-schedule step from the compliance branch.** ⛔ It is not a step — the content there is informational and duplicates the lead-time control directly above it.

**The explanatory text under lead time moves into a tooltip, and is rewritten positively.** Today it says what we do *not* do (*"no trigger and no intervals; everyone expiring in the same month is called together"*). State the behaviour instead: what happens, to which records, when.

**Unchanged from handover 2 §2c:** the certificate-number field is labelled by compliance type and does not render where the type has no such artefact.

---

## 5. Canned lines

The direction is right; this is all trimming.

⛔ **Withdrawn — the review-list item that said to remove the `Add lines` button until canned-line editing is supported.** Canned lines already exist in ShopView and are already editable from the service page; nothing here is unsupported. **Keep the button and keep the picker.** The only change is naming and clutter, below.

**Delete:**

| Delete | Why |
|---|---|
| The word **`library`** everywhere, including `Add from library` and the `214 in the library` counter | We never call it a library anywhere else in the app |
| The **eye icons** on canned-line rows | Nobody knew what they were |
| The **disabled row state** in the picker | No reason for it to exist |
| **`Drag to reorder`** in the picker footer | Not applicable in a selection modal |
| **`The service can be saved without canned lines`** | Obvious, and it is the second reassurance on one screen |
| The **doubled empty-state copy** | One line only |

**Keep:** search in the picker (the real canned-line list is long), and the **hours** and **price** columns — those are the two values that make a row worth choosing.

**The button reads `Add canned lines`.** The empty state is a single line — **`No lines on this service yet`** — with the button beside it on the **same row**. The block should be short; today it is far too tall for what it says.

**In view mode, `3 canned lines` opens a modal listing them.** ⛔ It must not navigate away. Nobody clicks that value to edit — they click it to see what the three lines are. New component; keep it minimal (name, hours, price, close).

---

## 6. Editing an existing schedule — no retroactive updates, no versions

This resolves an open question, and it removes a whole family of artboards.

**Applying a schedule to an asset copies the services onto that asset.** From then on the asset owns its copy. **Editing the schedule later does not touch already-applied assets** — they never learn about the change. New assets get the new version.

> *"We printed out a copy of this template and handed it to that asset, and that asset just knows those things. If we update the template, that asset has no idea."*

**⛔ Delete the whole apply-to-assets / conflict family:**

- the *"this change affects N assets"* screen, in every variant
- any *"N assets will be updated"* confirmation
- any publish / version / draft treatment borrowed from DVI
- any prompt shown when adding a service to a schedule that already has assets applied

Editing a schedule is silent. Add a service, edit a service, remove a service — no interstitial, no warning, no conflict state.

**Do not draw a re-apply or refresh action for already-applied assets.** It is deliberately out of v1. A shop that must push a change to existing assets does it by applying the schedule again — that is the whole mechanism, and it does not need UI of its own yet.

---

## 7. Customer email step

**⛔ Delete the recipient selector** — the *shop / customer / both* choice. Scope cut, explicitly: the worklist already covers the shop side.

What is left is one question: **do we automatically email the asset's preferred contact — yes or no.** When off, the schedule rows below collapse or disable.

**Delete `No one has to press send`.** It reads as AI copy. `Customer email schedule · sent automatically to the asset's preferred contact` is the whole heading.

**The default schedule is confirmed and stands:** `14 days before` · `on the day` · `7 days after`, with more rows addable up to the existing ceiling.

**Delete the eye icons** beside the rows.

---

## 8. Archive

**Simplify the archive confirmation to one sentence.** It is currently three blocks of reassurance for a reversible action.

**Delete the `View assets` link** from the modal, and do not build a view-assets screen anywhere in v1. It needs a real table — searchable, filterable, grouped by customer — and that is its own piece of work.

Archive behaves exactly as DVI archive does: nothing is deleted, and restore brings it back. Match that pattern rather than describing it.

---

## 9. Reminder settings — the email itself

Partly deferred; a dedicated session follows. Draw only what is below.

**⛔ Delete the from / reply-to fields.** We do not invent a sending identity here. Reuse the **existing ShopView send-email pattern** — the one behind sending an estimate — verbatim.

**⛔ Delete the template builder controls:** `show shop logo`, `show shop phone number`, `sign off as shop name / service advisor`. Each toggle is a feature that has to be built and none of them is worth it for v1.

**The email template is hardcoded.** One layout, populated from shop and asset data. The right-hand preview **stays**, but it is a **preview of what the customer receives** — read-only, informational — not a builder canvas.

⚠️ **Open, next session:** the actual copy and content of the template, and whether the internal maintenance digest (handover 2 §3, currently v1) survives. **Change nothing about the digest in this pass.**

---

## 10. Still open — do not resolve by accident

Carried forward from handover 2 §8, minus what this review closed, plus what it opened.

**Closed by this review:** the retroactive-update question (§6 — no) · the calendar-trigger treatment (§3 — mandatory, not locked) · the two template patterns (§2 — one wizard).

**Still open:**

1. **`Schedule` collision** — the maintenance object and the email timing control cannot share the word (§0). Flag; do not rename the timing control.
2. **`Enroll` vs `Apply`** (§0). Flag; keep `enroll` on the canvas.
3. **Compliance lead time: per-service or global** (§4). Fabijan rules. Keep per-service.
4. **Interval input: pick list or validated free input** (§3). Draw both.
5. **The email template content**, and the digest's fate (§9). Next session.
6. **The subline nesting treatment** (handover 2 §4a) — untouched today, still open.
7. **A replacement for the deleted nav badge** (handover 2 §6) — untouched today, still open.
8. **Who receives the reminder** and **unsubscribe** (handover 2 §8) — untouched today, still open.
9. **The name for a worklist row** (handover 2 §8) — untouched. Still do not label it.
