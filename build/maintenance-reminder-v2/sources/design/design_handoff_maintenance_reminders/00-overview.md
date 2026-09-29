# 00 · Overview — read first

**SV-3780 · Maintenance Reminders · 16 September 2026 · aligned to Confluence spec v7**

Cross-cutting material every chunk depends on. Ten minutes here saves re-reading it five times.

---

## Review order

**The canvas is five pages, matched one to one with the spec pages.** Chunk 1 is page 1 only — spec and design together — and nothing else is sent until it comes back.

| Design page | File | Spec page |
|---|---|---|
| 1 Settings — maintenance schedules | `Chunk 1.dc.html` | 1 |
| 2 The asset — Maintenance tab | `Chunk 1.dc.html` | 2 |
| 3 Customers — Maintenance Reminders | `Chunk 1.dc.html` | 3 |
| 4 The work order | `Chunk 2.dc.html` | 4 |
| 5 Estimation and the customer email | `Chunk 2.dc.html` | 5 |


| # | Chunk | File | Artboards | Why this order |
|---|---|---|---|---|
| 1 | Admin page + create a schedule | `01-admin-schedules.md` | 37 | Nothing exists until a schedule does |
| 2 | Asset level dashboard | `02-asset-dashboard.md` | 17 | Where an asset gets enrolled and tracked |
| 3 | Customer level dashboard | `03-customer-worklist.md` | 19 | Where the work gets sold |
| 4 | Algorithms — confidence and estimates | `04-algorithms.md` | 7 + spec | Every screen above renders from this |
| 5 | Auto email | `05-auto-email.md` | 1 | Ships a week behind the rest |
| 6 | The work order | `06-work-order.md` | 26 | **Not in your list.** Largest band on the canvas. |
| 7 | Consent | `07-consent.md` | 6 | **New 16 Sep.** One boolean on the customer, four surfaces. Replaces §3 of chunk 5 |

⚠ **Chunk 6 was not in the brief.** 31 artboards cover the maintenance card inside a work order: adding a service to the job, entering readings there, completion, and the line shapes. It is where the feature turns into revenue, so it needs a review slot. Placed last because it depends on 1–4, but it could equally sit after chunk 2.

**Chunk 4 is a logic review, not a design review.** It has almost no screens. It gates what every other chunk is allowed to claim, so reviewing it late but before build is deliberate.

---

## The feature in four steps

| # | Step | Actor | Frequency | Produces |
|---|---|---|---|---|
| 1 | Define a **schedule** | Owner/admin, settings permission | Once at setup | A schedule available org-wide. No asset affected. |
| 2 | **Enrol** an asset | Service advisor | Whenever an asset is in the shop | One tracked service row per service |
| 3 | Due dates are **computed** | System | Every reading, and daily | Statuses, dates, the worklist |
| 4 | The work gets **sold** | Service advisor | Daily | A contact, an estimate, a work order |

**This is org-level.** A unit can have its safety inspection done at a shop across the country and come back. Nothing may assume one location owns an asset. Location is a recorded fact, never a filter that hides an asset from its own history.

---

## Entry points

| # | Entry | Route | Permission | Chunk |
|---|---|---|---|---|
| 1 | Settings | Settings › Service › Maintenance | Settings (service) | 1, 5 |
| 2 | Customers | Customers › **Maintenance reminders** tab | Customer view | 3 |
| 3 | Asset | Asset › **Maintenance** tab | Customer view | 2 |
| — | Work order | inside a work order already open | Work-order view | 6 |

⚠ **Gap 00.1 (high).** No screen shows an entry point in its unentitled form. A technician without customer-view permission: does the tab not render, render disabled, or render and fail on click? `R-54` states the requirement; nothing draws the negative.

---

## Vocabulary — normative

Implement verbatim. A wrong word here is a defect, because these words appear in the UI, the emails, and the shop's own speech.

| Use | Never |
|---|---|
| **schedule** | program, plan, campaign |
| **template** | starter template as two concepts |
| **service** | item, task, job |
| **enrol / enrolled / enrolment** (button reads `Enroll`) | apply, applied, assign |
| **compliance** | compliance, mandatory, safety |
| **reading** | meter value, mileage entry |
| **recorded** vs **estimated** | actual vs projected. **Reserved for readings** — never used for confidence |
| **Start reminders** | work list lead time |
| **Open** | No work order, None, — |
| **Not enough data** | unknown, N/A, 0. The worklist bucket for a meter with `No data` |
| **Low · Medium · High** | good, poor, unknown. The three confidence levels, grading the meter |
| **No data** | None, unknown. A separate state, not a fourth level |
| **Not priced** | $0.00 |
| **Soon** | a date, where confidence is low |

**Asset naming.** Always `unit number · year make model` — `402 · 2019 Freightliner Cascadia`. No "Unit" or "Asset" prefix. No unit number → make and model stand alone with `No unit number` beneath.

**Units.** The distance unit is the word **`mileage`**, written in full, everywhere — `mi` and `km` never appear, because one unit covers both. Values read `342,417 mileage`, rates read `640 a week`, provenance reads `based on mileage`. Engine hours keep `hrs` (`OQ-17`). The field is labelled **`Mileage`**, never `Odometer`.

**No em dashes in prose.** Use a full stop, a colon, or a comma. `·` separates label fragments.

**An exact date belongs to a recorded reading alone.** Everything computed shows a **month** — `Sep 2026`, never `15 Sep 2026`. A user-set snooze date stays exact.

**No explanatory subtext.** Fabijan, standing instruction: *"Claude design puts so much subtext everywhere."* A rule the user needs goes **behind an info icon**; a rule the team needs goes in the spec. 44 such lines were stripped from the canvas on 10 September — do not reintroduce them in the build.

---

## Permissions matrix

| Action | Requires | Negative state |
|---|---|---|
| View worklist / asset panel | customer view | ⚠ undrawn — Gap 00.1 |
| Send a reminder | **more than view**, `OQ-13` unresolved | must be **hidden**, not disabled ⚠ undrawn |
| Create/edit/archive a schedule | settings (service) | ⚠ undrawn |
| Add a service to a work order | work-order edit | `[w2p]` **drawn** |
| Enter a reading | work-order edit | ⚠ undrawn |
| Edit reminder wording | settings (service), `OQ-14` partial access unresolved | ⚠ undrawn |

---

## Global state coverage

| Surface | Empty | Populated | Error | Loading | Permission | Stale |
|---|---|---|---|---|---|---|
| Schedules list | `[s2b]` | `[s2]` | — | — | — | — |
| Schedule editor | `[s3new]` | `[s3]` | — | — | — | — |
| Service form | `[c1]` | `[c2]` | — | — | — | — |
| Canned lines | — | `[d1]` `[d4]` | — | — | — | — |
| Customer email | — | `[r1]` | — | — | — | — |
| Consent | — | `[cs1]` `[cs2]` | — | — | — | — |
| Asset panel | `[m4]` | `[s4]` | — | — | — | — |
| Enrolment | — | `[x1]` `[x1r]` `[x4]` | — | — | — | — |
| Reading entry | — | `[n5]` `[p3]` | — | — | — | — |
| Certificates | `[cert2]` | `[cert1]` | `[k2]` | — | — | — |
| Worklist | `[s1b]` `[s1c]` | `[s1]` | — | — | — | — |
| Contact | `[b1e]` `[b1p]` ×3 | `[b1]` `[b1r]` `[b4]` `[b5]` | — | — | ⚠ | — |
| WO card | `[w6]` | `[wo1]`… | — | — | `[w2p]` | — |

**Across all 106 artboards, two columns are entirely empty: `Loading` and `Stale`.** One permission state exists. This is the single largest structural gap in the design, and it is not chunk-specific — it needs one decision applied everywhere.

⚠ **Gap 00.2 (high).** No loading or saving state anywhere.
⚠ **Gap 00.3 (high).** No stale-data state anywhere. Two advisors on one asset; a reading entered since the page loaded.
⚠ **Gap 00.4 (high).** No save-failure or network-error state on any form.

---

## Out of scope — must not appear

| ID | Cut | Why |
|---|---|---|
| `OOS-01` | Internal digest email to shop staff | Needs groups, notification preferences, a from/reply-to decision. A feature, not a message. |
| `OOS-02` | Welcome email on enrolment | Scaled down |
| `OOS-03` | Customer self-booking, rescheduling emails | Scaled down |
| `OOS-04` | Campaign tooling, recipient lists, wording editor per campaign | One fixed skeleton, shop-worded lines only |
| `OOS-05` | Anything needing mass-email capability | We do not have it |
| `OOS-06` | Bulk enrolment from the schedule | Needs cross-customer asset search, which does not exist |
| `OOS-07` | One estimate spanning several assets | Removed 14 September |
| `OOS-08` | Delivery reporting, bounces, open rates | Deliberately not tracked |
| `OOS-09` | Conflict/overlap screens at enrolment | Enrolment does not negotiate with other schedules |
| `OOS-10` | A state, chip or badge for the entered rate | Origin goes in the provenance line |
| `OOS-11` | Borrowing a rate by customer, make or model | Measured 15 Sep and rejected: 82.4% of units sit at customers whose own units disagree by more than 50% |
| `OOS-12` | An abbreviation for the distance unit | One unit covers miles and kilometres |
| `OOS-13` | **Dormant units** | Cut entirely. It hid a significant action at the bottom of a list |
| `OOS-14` | **The Reminder settings screen and its editor** | One hardcoded email leaves nothing to word |
| `OOS-15` | **An unsubscribe link** | Consent management is its own feature; consent lives on the customer |
| `OOS-16` | **An expected running rate at enrolment** | Tested against production and dropped |
| `OOS-17` | **The customer records page** | Out for now; only the consent switch is drawn |
| `OOS-19` | **Inferring that a line satisfies a service** | The advisor states it. Nothing reads line text |
| `OOS-20` | **A `Compliance` tag on a data row** | The name plus the due date already identify it |

---

## Blocking open questions

These gate a v1 surface. Do not invent answers.

| ID | Question | Blocks | Chunk | Owner |
|---|---|---|---|---|
| `OQ-09` | Is the compliance due date the **last day of the expiry month**? | every compliance date | 1, 2, 4 | Shop side |
| `OQ-10` | **The confidence thresholds.** The three levels are settled; what counts as High against Medium against Low is not. Gates what the UI may claim. | every estimate | 4 | Design + Sasha |
| `OQ-21` | **The bundling window** — how long it is. | bundling | 6 | — |
| `OQ-12a` | The starter set: four basic templates are specified; the canvas still shows `PM-A`…`PM-D` + `CVIP` | `R-44` | 1 | Cody |
| `OQ-13` | **Permission to send a reminder** — new permission, or gated behind create/edit customer? | `R-55` | 3 | Sasha |
| `OQ-01`–`OQ-04` | Who the email is from · whether we can mass-send · the daily job · one global send time | the whole email chunk | 5 | — |

---

## Notation used in every chunk

| Symbol | Meaning |
|---|---|
| `──▶` | Navigates. The page is replaced. |
| `··▶` | Opens a modal or panel over the page. |
| `◀··` | Dismisses, returning to the page underneath. |
| `[id]` | An artboard. Search `id="…"` in `Maintenance Reminders.dc.html`. |
| `‹undrawn›` | Specified, no artboard. A gap, not a decision. |
| ⚠ | A divergence, contradiction, or hole. Every one is listed in that chunk's gap table. |
