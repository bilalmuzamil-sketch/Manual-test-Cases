# Maintenance Reminders — full handoff

**SV-3780 · 23 September 2026 · aligned to Confluence spec v12**

Everything designed for this feature, in one document: every screen, where it lives in the product, and what is still open. Written to be handed to an engineer or to Claude Code as-is.

| | |
|---|---|
| **Screens** | 113 artboards across 5 review pages, matched one to one with the spec pages |
| **Canvas** | `Maintenance Reminders.dc.html` (index) → five page files · `Maintenance Reminders.dc.html` for one scroll |
| **Normative spec** | `PRD.md` — 70 rules (`R-nn`), 35 validation points (`V-nn`), 21 open questions (`OQ-nn`) |
| **Review chunks** | `00-overview.md` … `07-consent.md` |
| **Precedence** | Where the PRD and an artboard disagree, **the PRD wins** |
| **Design system** | Shopview DS, bound at `_ds/` — no invented colors, type or components |


**v12 changes (23 Sep):** calendar `every` gains a `days`/`months` unit (`c6`); reading modal loses `WHAT THIS CHANGES`; status is a badge `Overdue` · `Due today` · `Due soon` beside the service; overdue rows print no figure; month-precision dates; `Add history record`, edit icon, `Expiry date` picker; Certificates tab descoped; plain consent checkbox; descriptive subheadings stripped as a standing rule.

---

## 1. What the feature is

A shop defines **maintenance schedules** (an ordered list of **services**). Assets are **enrolled** in a schedule. From readings and calendar intervals the system computes **when each service comes due**, surfaces the result in three places — the **asset**, a **worklist** under Customers, and the **work order** — and optionally **emails the customer**.

### Vocabulary — locked

| Use | Never |
|---|---|
| `schedule` | program, plan |
| `service` | task, item |
| `compliance` | regulated |
| `mileage` | miles, km, `mi` |
| `template` | preset |
| `Recorded` / `Estimated` | actual / calculated |
| `High` · `Medium` · `Low` confidence, plus `No data` | good / bad |

Services have **one** name — internal only, no customer-facing variant. Calendar, distance and engine hours all support `every` and `at`.

### The spine — objects and where they live `[spine]`

| Object | Lives on | Carries |
|---|---|---|
| Schedule | organization | name · ordered list of services |
| Service | schedule | name · compliance yes/no · triggers · one interval per trigger (a meter trigger always carries a calendar interval beside it) · distance unit · canned lines · reminder schedule · automatic send on/off |
| Enrollment | asset | which schedule · baseline readings · stated weekly average |
| Due service | **computed, never stored** | one per service that has come due · what the worklist shows · resets from the **invoice date** of the work order that completed it |
| Consent | **customer** | one boolean, default off |

---

## 2. The screens

### Page 1 · Settings — maintenance schedules — 38 boards
`Chunk 1.dc.html` · chunk `01-admin-schedules.md` · **goes for review first, alone**

Settings → Maintenance schedules. Nothing in the feature exists until a schedule does.

| Board | Screen |
|---|---|
| `s2b` | Maintenance schedules · empty |
| `e01` | Maintenance schedules · list |
| `s2` | Maintenance schedules · one saved |
| `s2new` | New schedule · start blank |
| `p11` | New schedule · from a template |
| `s3new` | Editor · empty |
| `s3one` | Editor · one service |
| `s3skel` | Editor · five services from the template |
| `s3` `e02` | Editor · in use, 42 assets |
| `c0` | Add service · blank or from a template |
| `c1` | Add service · empty |
| `c2b` | Distance selected |
| `c2` | Distance and calendar · filled |
| `c2all` | All three triggers |
| `t1` | Calendar only |
| `t2` | Engine hours only |
| `t3` | All three triggers |
| `t5` | Calendar · `every` and `at` |
| `c3` | Edit PM-B |
| `p13` | Edit a template service |
| `c4` | Compliance switched on · empty |
| `k02` | Compliance · filled |
| `k03` | Editor · compliance row added |
| `k04` | Edit the existing CVIP |
| `k6` | Type · a type-ahead, not a closed list |
| `k7` | Term and lead time follow the type |
| `k8` | The number field is named by the type |
| `k9` | Attachment · empty and attached |
| `d1` | Add canned lines · over the service modal |
| `d4` | The lines count, opened read-only |
| `e04r` | Remove service · confirm |
| `e04e` | Edit service · confirm |
| `e05` | Saved · what happened |
| `s2arch` | Archive · confirm |
| `s2menu` | Schedule row menu |
| `c5` | Service row menu |
| `c6` | Calendar interval · days or months (v12) |

**Rules that shape it:** compliance inspections use a **type-ahead** (seeded generics, shops add their own) and the record fields are **named by the type**. A meter trigger always carries a calendar interval beside it. Edits to a schedule in use do not retro-change enrolled assets; they apply to future enrolments.

### Page 5 · Estimation and the customer email — 9 boards
`Chunk 2.dc.html` · chunks `04-algorithms.md` + `05-auto-email.md`

| Board | Screen |
|---|---|
| `spine` | The spine · objects and where they live |
| `x3` | Find the asset · unit number, customer unit number or VIN |
| `n6` | Snooze · the rules |
| `n7` | Approaching and past thresholds |
| `n8` | Open, and settled |

| Board | Screen |
|---|---|
| `r1` | The email, as the customer receives it — mixed states |
| `r1p` | All past due · one unit |
| `r1t` | All due today · one unit |
| `r1u` | All coming up · a fleet of six |

Same subject, opening line, closing and footer in all four boards; only the rows differ. **One hardcoded email per customer**, covering upcoming, due today and overdue in a **single table** — because one unit can be in all three states at once. Fixed wording for every shop, so **there is no reminder settings screen**. No unsubscribe link. Low confidence renders `Soon`, not a date. Sending reuses the work-order email mechanism.

### Page 2 · The asset — Maintenance tab — 16 boards
`Chunk 1.dc.html` · chunk `02-asset-dashboard.md`

| Board | Screen |
|---|---|
| `s4` | The panel |
| `x1` | Enroll · from the asset |
| `x1r` | Enroll · no readings, and a customer who declined |
| `n5` | Enter a reading · before and after |
| `p1` | Current reading · recorded and estimated |
| `p2` | What the field is for |
| `p3` | In the shop today · the recorded value moves |
| `p4` | Comes due · one, two and three triggers |
| `k4` | Add history record · one form, three entry points |
| `k2` | A compliance inspection whose certificate is missing |
| `m1` | Two menus, two objects |
| `m2` | Mark complete · a work order, or elsewhere |
| `m2e` | Completed elsewhere · the other branch |
| `m4` | Not on a schedule |
| `m5` | Snooze · moves the due date |
| `cs0` | Consent · the toggle on the customer info card |

**Rules that shape it:** enrolment asks for schedule and an optional **last service date per service** — no reading fields, no comes-due arithmetic inside the modal. `Not enough data` is **per meter**, so mileage and engine hours are judged separately. Completed elsewhere takes a date, and that date resets the service.

### Page 3 · Customers — Maintenance Reminders — 19 boards
`Chunk 1.dc.html` · chunk `03-customer-worklist.md`

Under **Customers**, as a tab beside Customers itself — not under Reports.

| Board | Screen |
|---|---|
| `s1` | Maintenance reminders · tiles filter one flat table |
| `s1d` | Overdue tile selected · the same table, filtered |
| `s1f` | Filtered · `Not enough data` |
| `s1dl` | Filtered · more than one workplace |
| `s1e` | One customer · their maintenance reminders |
| `s1b` | Nothing enrolled yet |
| `s1c` | The book is clear |
| `s1n` | What could replace the badge |
| `b1` | Contact card · the hub |
| `b1r` | Contact card · already sent |
| `b1o` | Contact card · notifications off for this customer ⭐ new |
| `b1e` | Contact card · no email address |
| `b1p` | Contact card · no phone, no email, nothing at all |
| `b4` | Add contact information · from the empty state |
| `b5` | Resend · the confirmation step |
| `b3` | Row menus |
| `k3` | Compliance inspections are a filter, not a screen |
| `k3e` | Nothing expiring this month |
| `x4` | Bulk enroll · from a customer's asset list |

**Rules that shape it:** tiles are filters over **one flat table**. The work order is reachable as a **link in the Work Order column** — there is **no `View work order` button**. No checkbox column, no bulk bar, no bulk estimate. ~55% of customers have neither phone nor email, which is why `b1e` / `b1p` exist. `Resend` always goes through a confirmation.

### Page 4 · The work order — 26 boards
`Chunk 2.dc.html` · chunk `06-work-order.md`

Where the feature turns into revenue. Largest band on the canvas.

| Board | Screen |
|---|---|
| `w7c` | Collapsed by default · the count carries the signal |
| `wo1` | Enrolled · nothing at criteria |
| `y0` | One service due |
| `w2x` | One service due |
| `w3` | Several due · bundling |
| `w4` | Compliance inspection due |
| `w6` | On no schedule |
| `w7` | Two schedules · one row each |
| `y1h` | Hover · the job, its parts, and its inspection form |
| `y1a` | Add to this work order · confirm |
| `y1d` | This was already done here · no canned line |
| `w2b` | After adding · the service line and its sublines |
| `v1` | Shape A · the service is one line |
| `v2` | Shape B · four canned lines beneath it |
| `v3` | Nesting · three treatments, none chosen |
| `v4` | Line search · canned lines only |
| `v5` | On work-order creation · what is coming up |
| `v6` | Three sublines closed · the service still open |
| `v7` | Two compliance records · both listed together |
| `v8` | Declined on the estimate |
| `v9` | The worklist, unchanged |
| `w2p` | Add · without permission |
| `w8` | Enter a reading · from the work order |
| `w9` | The moment after saving |
| `y3` | Completion step · what gets marked complete |
| `y4` | Work Orders list · provenance column |

**Rules that shape it:** the panel shows **collapsed line summaries** (`4 lines · $412.60 · 2.1 hrs`), not every canned line. Every service offers two actions: **`Add`** and **`Mark Complete`** — the shop states that this work order satisfies the service; the system never infers it from line descriptions. A reading entered on a work order **is** a recorded reading, and **invoicing is also a recording**: whatever the mileage is at invoice becomes the new last recorded value, and the invoice date resets the service.

### Consent — where it went

Consent **defaults on** as of 16 September, so the bulk turn-on is withdrawn: `[cs5]` and `[cs6]` are deleted. The one remaining board, `[cs0]` the toggle on the customer info card, sits on **page 2** beside the enrolment modal it belongs with. The other two consent surfaces are `[x1]` `[x1r]` (page 2) and `[b1o]` (page 3). Full detail in `07-consent.md`.

---|---|
| `spine` | The spine · objects and where they live |
| `x3` | Find the asset · unit number, customer unit number or VIN |
| `n6` | Snooze · the rules |
| `n7` | Approaching and past thresholds |
| `n8` | Open, and settled |

---

## 3. Cross-cutting rules

**Estimates and confidence.** Calendar is always required, which is what makes an estimate possible at all. A meter estimate needs two readings; ~28% of assets have more than two visits, so `No data` and `Low` are the common cases, not the exception. Confidence is **High / Medium / Low** plus **`No data`**; `Recorded` readings carry **no** grade. `Not enough data` is per meter.

**Resets.** A service resets from the **invoice date** of the work order that completed it. `Completed elsewhere` resets from the stated date. Snooze moves the due date without resetting the interval.

**States on canvas.** No loading states and no stale-data states anywhere — deliberate. There is **no `Paused` status**. Empty-state rules are logged in the PRD rather than invented on canvas.

**Permissions.** Reading entry follows the work-order permission; consent follows customer edit; financial columns keep the existing AP/AR visibility gate.

---

## 4. Known seams

| Board | Seam |
|---|---|
| `[s4]` | Canvas shows one row shape, the spec asks another — logged, not guessed |
| `[y1h]` | Same |
| `[p4]` | `Comes due` cell needs to agree with `[s4]`'s single-line approach |
| — | Missing variant: a compliance row with **no parts and no inspection form** |
| — | Not drawn: the edit-dialog checkbox, the no-permission dialog, the phone-width reflow |

---

## 5. What blocks implementation

| # | Decision | Why it blocks |
|---|---|---|
| 1 | Does a **voided work order** ever reset a service? | The reset rule keys off the invoice; voiding breaks that chain |
| 2 | How is **"completed, awaiting invoice"** distinguished from **"never done"**? | The worklist shows both as due today |
| 3 | What does the **invoice-date rule** do when there is no invoice? | Same chain, different hole |
| 4 | **Turning consent off** has no confirmation and no count | A 50-unit fleet goes silent with one click. Sharper now that everyone starts on |
| 5 | **No audit trail** on consent | Nobody can answer who switched a customer off |
| 5b | **Default on means the first daily job after release emails every customer with anything due** | Needs a quiet period or a first-run cap before release |
| 6 | `OQ-01`–`OQ-04` — who the email comes from, whether mass send is possible, the daily job, one global send time | Gates the whole email chunk |

Full list: 21 `OQ-nn` items in `PRD.md` §9 with owners.

---

## 6. How to read this bundle

1. `00-overview.md` — vocabulary, entry points, permissions. Ten minutes here saves re-reading it five times.
2. Chunks `01`–`07` in order. Each carries its own gap table, ranked by severity.
3. `PRD.md` for any rule, in full. It is the normative document.
4. The canvas — `Maintenance Reminders.dc.html` to navigate, `Maintenance Reminders.dc.html` to read end to end. Board ids in this document match the badges on the artboards.
