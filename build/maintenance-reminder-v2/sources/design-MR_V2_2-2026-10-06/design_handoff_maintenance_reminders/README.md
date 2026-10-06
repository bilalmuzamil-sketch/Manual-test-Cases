# Handoff: Maintenance Reminders (SV-3780)

Preventive maintenance for heavy-duty shops, built into ShopView. Shops define maintenance schedules, enrol assets on them, record readings, see what is due, add due services to work orders, record the date the work was done at invoice, and send reminder emails to customers.

**Start here, in this order**
1. This README: what to build, where each screen is, how the pieces fit together.
2. `PRD.md`: the normative spec (rules `R-nn`, checks `V-nn`, open questions `OQ-nn`). **Where the PRD and a design board disagree, the PRD wins.**
3. `00-overview.md`, then the chunk files `01`–`07`: screen-by-screen behaviour, states and gaps.
4. `DS-GAPS.md`: components the design system does not have yet.

---

## About the design files

The `.dc.html` files are **design references built in HTML**. They show the intended look and behaviour. They are not production code. Do not copy the markup. Rebuild the screens in the ShopView codebase with its existing framework, component library and patterns.

- They open directly in a browser (`support.js` is the preview runtime, not part of the design).
- Styles are inline because the design tool streams them. Read them for values, not for structure.
- Every board has a short id badge (`s2b`, `n5`, `i3` …). The PRD and chunk files refer to boards by these ids.

## Fidelity

**High fidelity.** The final colours, type, spacing and copy all come from the Shopview Design System. Controls use the real DS component classes (`sv-btn`, `sv-badge`, `sv-check`, `sv-radio`, `sv-toggle`, `sv-tab`, `sv-card`, `sv-modal`, `sv-menu`, `sv-alert`, the `sv-tt` tooltip, `sv-header`). Map each one to the matching component in the codebase (`Button`, `Badge`, `Checkbox`, `Toggle`, `Tabs`, `Card`, `Modal`, `Menu`, `Alert`, `Tooltip`, `AppHeader`).

Anything the DS does not have is still drawn by hand and is listed in `DS-GAPS.md`. Treat those as **proposals that need a DS component**, not final specs. The main gaps are the label-above field, the compact inline select, the number field, the date picker, the icon button, and the work-order detail layout.

**Copy is final.** Keep the wording as written: `compliance` (never "regulated"), `640 a week` for rates, `Due soon` / `Due today` / `Overdue`, `Add history record`, `When was the maintenance done?`.

---

## Screens

| Page file | Boards | Area | PRD / chunk |
|---|---|---|---|
| `Chunk 1.dc.html` | 32 | Settings › Service › Maintenance schedules | chunk `01` |
| `Chunk 1.dc.html` | 15 | Asset › Maintenance tab | chunk `02` |
| `Chunk 1.dc.html` | 19 | Customers › Maintenance reminders (worklist) | chunk `03` |
| `Chunk 2.dc.html` | 31 | Work order: maintenance lines, completion, the work-done step after invoice | chunk `06` |
| `Chunk 2.dc.html` | 5 | Estimation spine (logic) and the customer email | chunks `04`, `05`, `07` |
| `Maintenance Reminders.dc.html` | 102 | All of the above on one scrolling page | — |
| `Maintenance Reminders.dc.html` | — | Index of the pages | — |
| `Maintenance Reminders - Flow Map.dc.html` | — | Control-flow diagram | — |

### 1 · Settings: maintenance schedules (`01-admin-schedules.md`)
- **List** `s2b`, empty `s2new`, archived `s2arch`, row menu `s2menu`. Schedules are archived, never deleted.
- **Create a schedule** `s3new` → `c0`–`c2all`: name, triggers (Calendar required, plus Distance and/or Engine hours), services.
- **Service form** `c1`, `c2`, `c4`:
  - **Triggers.** Calendar is always on. Distance and Engine hours are independent checkboxes. A single `or` label sits under Calendar, and only when another trigger is checked.
  - **Calendar interval.** `every` takes a number and a unit, `days` or `months` (months offers 1 to 12). `at` takes a month only and has no unit control. Board `c6`.
  - **No next-date preview or anchor control.** The system anchors the next due date when the service is completed.
  - **The form ends at canned lines.** Four sections only.
- **Reminders and email live on each service:** Reminder schedule rows in days (default 14 before · due date · 7 after) and an Email the customer automatically switch (default on), also shown as the Email column in the service table. No schedule-level master.
- **Service row** reads `PM-B · 30,000 mileage or 30 days · 3 lines · 3 reminders` on one line, never wrapping.
- **Remove / Save / Saved messages** `e04r`, `e04e`, `e05` use the same three sentences:
  - "Assets already enrolled keep … as it is."
  - "Assets enrolled from now on get the new version." (For a removed service: "… do not get PM-C.")
  - "Work orders with a … line keep it."
- **Compliance types** `t1`–`t5`: a type-ahead field. There is no `Start reminders` field, because lead time comes from the Reminder schedule.
- **Validation**: six states (see PRD `V-03` onward).

### 2 · Asset maintenance tab (`02-asset-dashboard.md`)
- **Tab** `s4`:
  - Meter cards (Mileage, Engine hours) with the estimate and its confidence.
  - The services table: Service with a status badge beside it, Schedule, Interval, Due.
  - **Status is a badge, exactly one of three:** `Overdue` · `Due today` · `Due soon`. There is no status column.
  - **An overdue row never prints a figure.** The Due cell reads `Based on mileage estimate` / `Based on engine hours estimate` / `Based on the certificate term`. Confidence lives only on the meter card.
  - **Month-precision dates show a month** (`Aug 2026`). `Due today` holds for the whole month.
- **Enrol** `x1`, `x1r`: the consent control is a plain checkbox with an info tooltip. It writes the customer's own setting.
- **Enter mileage** `n5`, `p3`:
  - Two columns, CURRENT and NEW, with no unit word beside the values.
  - The provenance line reads `Last recorded 29 Aug 2026 · WO S3780-15211`. The work order is not a link, and a long number truncates before the date does.
  - **No "what this changes" panel.** Save returns to the tab, which shows the result.
- **Add history record** `k4`, `k2`:
  - One form with three entry points.
  - Fields: Type, Term, Effective date, **Expiry date** (calendar picker), Certificate number (optional), Attachment (optional).
  - Existing records are edited with the standard edit icon.
  - **There is no Certificates tab.**
- **Row menus** `m1`: routine Mark complete · Snooze · Create estimate; compliance Mark complete · Create estimate · Skip; schedule header Remove only (no Pause).
- **Due cell** is one line: the earliest date and its trigger. Other candidates sit behind the row menu (`Other triggers`). `Soon` only for a low-confidence date still ahead; once due, the cell names the trigger alone.
- **Mark complete** `m2` has no consequence panel; the reset date is set at invoice.

### 3 · Customer worklist (`03-customer-worklist.md`)
- Tiles, list columns, filters `s1`–`s1n`. Contact and send drawers `b1`–`b5`. Emails `k3`, `k3e`. Find the asset `x4`.

### 4 · Work order (`06-work-order.md`)
- **Work-order screen** (all full-screen boards):
  - Left column of cards: Work Order, Customer, Asset (with the Maintenance schedule section), Financial Info.
  - Text tabs: Lines · Parts · Notes · Stats · Finance.
  - Line table: # · Name/Description · Maintenance · Actual/Estimate · Progress · Status · Action · Rate · Margin · Total.
- **Maintenance card, adding due services, completion** `w*`, `v*`, `y*`. `Mark Complete` replaces `Already addressed`. Due-today rows get an amber border and fill, and a dot after the service name.
- **After invoice: When was the maintenance done?** `i1`–`i5`:
  - **Order:** Create Invoice → invoice created (toast) → this step. **It never blocks invoicing.**
  - **When it appears:** only if the work order completed one or more maintenance services. Board `i4` shows its absence.
  - **Rows:** one per completed maintenance service, showing the service, its schedule and **Work done**. Work done is a past date, proposed as the invoice date and editable with a date picker. **No next-due figure is shown.**
  - **Changed date:** `Invoice date 1 Oct 2026 · Reset` appears under the field (`i2`).
  - **Absorbed services** are a single row with `Also resets: PM-B · PM-A` under it (`i3`).
  - **Compliance inspections are excluded**, because their next due comes from the certificate expiry.
  - **Actions:** `Save Dates` (primary) and `Keep Invoice Date`. Closing the step keeps the invoice dates.
  - **Phone width** `i5`: a bottom sheet.

### 5 · Estimation and email (`04-algorithms.md`, `05-auto-email.md`, `07-consent.md`)
- `spine`: how rate, confidence and due are derived. This is a logic review.
- `r1`–`r1u`: the customer reminder email.

---

## Interactions and behaviour (cross-cutting)

- **Buttons trigger actions and links navigate.** There is one primary button per view.
- **Motion:** 120–160ms ease-out colour shifts. No scaling, bounce or entrance animations.
- **Tooltips** appear on hover or focus of an info icon. A rule the user needs goes behind an info icon, never in a descriptive subheading. This is a standing rule.
- **Validation:** see PRD. Readings are never refused (`R-30`).
- **Missing states (open):** no loading, skeleton or stale-data states are designed anywhere (`00-overview.md` §gaps). Decide once and apply everywhere.
- **First-run email volume:** the first daily job after release would email every customer with something due. This needs a quiet period or a cap before shipping.

## State and data (summary; full detail in the PRD)
- **Schedule** → services[] (triggers, interval `{every|at, n, unit days|months}`, reminder rows, canned lines, absorbs[]).
- **Asset enrolment:** schedule id, per-service last-completed date or reading, next due, status.
- **Reading:** value, source (work order id or manual), recorded date. The estimate is computed from the visit history and has a confidence grade (`OQ-10`: the thresholds are not final).
- **Customer:** `Send preventive maintenance notifications`, default ON.
- **Invoice hook:** after the invoice is created, if the work order has completed maintenance services, collect `workDoneDate` per service (default = invoice date) and reset each cycle from that date.

## Design tokens

Use the codebase's Shopview tokens. Do not copy hex values. The reference copy is `_ds/…/colors_and_type.css` (all `--sv-*` tokens) and `_ds/…/components.css` (the `sv-*` component classes).

| Role | Token | Light value |
|---|---|---|
| Primary / action | `--sv-accent` | `#257CFF` |
| Text | `--sv-text-primary` / `--sv-grey-900` | `#121926` |
| Secondary text | `--sv-grey-600` | `#4B5565` |
| Border | `--sv-border-default` / `--sv-border-strong` | `#E3E8EF` / `#CDD5DF` |
| Success · Warning · Danger | `--sv-success-*` · `--sv-warning-*` · `--sv-danger-*` | `#16B364` · `#F79009` · `#F04438` |
| Type | Inter / Inter Display | body 14/20, dense 13/18, micro 11/14 |
| Radii | xs 4 · sm 6 · md 8 · lg 12 · pill | buttons, inputs and menus md; cards and modals lg |
| Spacing | `--sv-space-N` = N×4px | |

Always pair status colours with text. Colour alone never carries state.

## Assets
- `assets/symbol-primary.svg`: the ShopView symbol (header).
- `assets/icons/`: Lucide icons. The codebase's own icon set matches 1:1.
- No imagery or illustrations.

## Files in this bundle

| File | Role |
|---|---|
| `README.md` | This file |
| `PRD.md` | Normative spec |
| `HANDOFF.md` | Board-by-board index |
| `00-overview.md` … `07-consent.md` | Chunk specs |
| `DS-GAPS.md` | Components missing from the design system |
| `1-…` to `5-….dc.html`, `Maintenance Reminders.dc.html` | Design boards |
| `Maintenance Reminders.dc.html`, `… Flow Map.dc.html` | Index and flow map |
| `ShopviewHeader.dc.html`, `SettingsSidebar.dc.html` | Shell used by the boards |
| `support.js` | Preview runtime only |
| `_ds/` | Design system reference (tokens and component CSS) |

## Open questions to resolve before or during build
- **OQ-10:** confidence thresholds.
- **`Mark Complete` naming:** it collides with the asset's existing `Mark complete`.
- **Template set:** only `PM-A`–`PM-D` and `CVIP` are drawn. The spec names none.
- **Settings tab name:** `Customer email` may need renaming to match `Reminder schedule`.
- **Chunk four:** the reset-date step is designed (`i1`–`i5`). Confirm it with the spec owner, since the next-due preview was removed.

## Review chunks
- **Chunk 1:** pages 1–3 (schedules, asset tab, worklist)
- **Chunk 2:** pages 4–5 (work order, estimate and email)
