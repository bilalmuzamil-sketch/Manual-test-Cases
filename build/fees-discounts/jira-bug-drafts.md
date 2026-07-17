# Fees & Discounts V1 — Jira Bug Drafts (plain-language, ready to file)

> **STATUS: NOT YET FILED — Atlassian is not reachable from this Claude Code
> environment.** File these via your chat app where Atlassian / Jira IS connected.
> Do NOT auto-create them from here.
>
> **Rewritten 2026-07-09** after the v1 closeout reconciliation
> (`spec-v1-reconciliation.md`) and Chris Ward's (the F&D PO's) PO answer sheet
> (`data-sheet-source.md`). Every ticket below is written in plain language so a
> non-technical reader can understand it; anything technical (spec references,
> internal bug codes, test-case IDs, endpoints, observed figures) lives only in
> the "Technical notes (QA internal)" block at the bottom of each draft — trim
> that block if you don't want it in the filed ticket.
>
> **Changes in this rewrite:**
> - **DROPPED:** the "customer defaults are added one at a time" complaint is
>   NOT a bug — the Product Owner confirmed one-at-a-time is deliberate
>   (answer sheet Q6 = A). No ticket. *(QA internal: FDBUG-7 closed as accepted.)*
> - **ON HOLD:** Ticket 1 (customer totals leave out fees/discounts) is kept as
>   a draft but must **NOT be filed yet** — it needs a re-check on a US
>   sales-tax organization first (see the flag on the ticket).
> - **ADDED (PO-confirmed defects):** Tickets 8–11 — Statistics list (Q1=B),
>   Add-button greyed-out (Q4=B), "show more" collapse (Q5=B), and the missing
>   Processing Fee option (Q3=B, in scope for this release).

## Common fields (apply to all tickets)

- **Project:** ShopView — **SV**
- **Issue type:** **Bug**
- **Product Area (REQUIRED, `customfield_10153`):** **Work Orders** (id **`10120`**)
- **Parent (epic):** **SV-7387 — Fees & Discounts** (confirmed from the v1 spec).
- **Labels:** `fees-discounts`, `qa`, `testrail`
- **cloudId (same ShopView Atlassian instance):** `19fdd96d-a135-46c4-83e7-d2cc218a4e63`
- **QA env:** app `https://qb.qa.shopview.com` (Fees & Discounts feature ON).

---

## TICKET 1 — Priority: High — **ON HOLD, DO NOT FILE YET**

> **DO NOT FILE THIS TICKET YET.** We tested on a Canadian-tax (GST) test shop,
> but this release only covers US sales tax — so the wrong numbers we saw might
> be caused by the test shop's tax setup rather than by the feature. Also, when
> we re-checked a day later, the numbers came out RIGHT on three work orders.
> We will re-run this check on a US sales-tax shop first. File only if it still
> reproduces there.

**Title:** Customer's total sometimes leaves out the fees and discounts on the work order

**Description:**

*What the user does:* A shop adds one or more fees or discounts to a work order,
then looks at the money totals — on the work order's financial summary and on
the estimate/invoice document the customer receives.

*What happens now (when it goes wrong):* The Subtotal and Total leave the fee
and discount amounts OUT, while the tax line still includes the tax on those
same fees and discounts. So the customer sees a total that doesn't add up — in
one example a work order with about $219 of fees showed a total of only $10.93
(just the tax).

*What should happen:* Fees and discounts are part of the bill. The Subtotal
should include them, tax should be worked out on that full amount, and the
Total should equal Subtotal plus tax. The work order's stored total should
match the document the customer gets.

*Steps to replicate:*
1. Open a work order and add one or more fees to the whole work order.
2. Look at the work order's financial summary (Total / Balance).
3. Create the customer estimate document and read its Subtotal, tax, and Total.

*Expected:* Subtotal includes the fees/discounts; tax is calculated on that
amount; Total = Subtotal + tax; the summary and the document agree.

*Actual:* On the failing runs, Subtotal and Total omitted the fee/discount
amounts while the tax line still included their tax — the customer-facing
money was wrong.

*Epic link:* SV-7387

**Technical notes (QA internal):**
- Internal ref FDBUG-1; affected case FD-DOC-011; spec S5-R5 (Adjustments before
  Subtotal).
- Repro evidence (batch 1/2, 2026-07-08, GST org): fees-only WO showed
  `total_cost` **$10.93 = tax alone** (fees $218.68 ignored); an estimate showed
  Subtotal $292.83 / GST $17.75 / Total $310.58 with **+$62.25 net adjustments
  missing**. Surfaces: WO `total_cost`, Financial-Info Total/Balance, estimate
  Subtotal/Total.
- **Did NOT reproduce in batch 4 (2026-07-09):** three WOs' estimate documents
  reconciled correctly (estimate doc via
  `POST /api/work-orders/invoices/estimate`).
- **Hold reason:** v1 is US-sales-tax-only (Canada GST/PST is Phase 2); the GST
  org makes the tax half of the symptom off-model, and the non-repro suggests a
  partial fix or a scenario-specific trigger. Action: controlled re-repro on a
  US sales-tax org (fees-only WO + Financial Info surface, and a discount-heavy
  estimate) before filing. See `spec-v1-reconciliation.md` §1.

---

## TICKET 2 — Priority: High

**Title:** Processing fee is worked out on too big an amount, overcharging the customer

**Description:**

*What the user does:* A shop adds a processing fee that is defined as a
percentage of the work order's grand total (for example 3%), on a work order
that also has other whole-work-order fees or discounts.

*What happens now:* The processing fee is calculated on an amount that wrongly
includes the other whole-work-order fees/discounts (and their tax). In our
test the customer was charged $15.90 instead of $9.22 — an overcharge.

*What should happen:* By design, the processing fee should be worked out on
the work order's own total only — the other whole-work-order fees and
discounts must be left OUT of that calculation.

*Steps to replicate:*
1. Take a work order with normal labor/parts charges.
2. Add a whole-work-order fee (for example a couple of hundred dollars).
3. Add a processing fee of 3% of the grand total.
4. Compare the processing-fee amount to 3% of the work order's own total
   (without the other fee).

*Expected:* The processing fee equals 3% of the work order's own total,
excluding other whole-work-order fees/discounts.

*Actual:* The processing fee is bigger, because the other whole-work-order
fee and its tax were included in the calculation.

*Epic link:* SV-7387

**Technical notes (QA internal):**
- Internal ref FDBUG-2; affected cases FD-PROC-009, FD-CALC-013 (also feeds the
  Statistics totals in FD-STATS-001/002/004); spec §5-R4 (pfee base excludes
  every whole-WO adjustment).
- Observed on the GST org: 3% × (292.83 subtotal + 212.00 whole-WO fees) × 1.05
  = **$15.90** vs expected 3% × 307.47 = **$9.22**. Tax-inclusion, resolve-last
  and the no-self-feedback tax rule behaved correctly.
- The ×1.05 factor is GST — **re-verify the exact figures on a US sales-tax
  org** — but the structural error (whole-WO adjustments leaking into the base)
  is tax-model-independent, so the defect stands (`spec-v1-reconciliation.md`
  §1). Status: still open.

---

## TICKET 3 — Priority: Medium

**Title:** Fees and discounts that are added automatically don't show up in the work order's audit log

**Description:**

*What the user does:* A shop sets certain fee/discount templates to be applied
automatically (for the location, or as a customer's defaults). When a new work
order is created, those fees/discounts are added to it automatically. The user
then opens the work order's audit log (the "Work Order Log") to see what
happened.

*What happens now:* The audit log shows nothing about the automatically-added
fees/discounts. Only fees/discounts that a person adds, edits, or removes by
hand get recorded. So the paper trail is incomplete — a fee can appear on a
work order with no record of when or how it got there.

*What should happen:* Every fee or discount added to a work order — whether by
hand or automatically — should get its own line in the work order's audit log.

*Steps to replicate:*
1. Set one or more fee/discount templates to apply automatically (and/or set
   them as a customer's defaults).
2. Create a new work order for that customer, so the fees/discounts are added
   automatically.
3. Open the work order's audit log ("Audit Log" in the work order's ⋮ menu — it
   opens the "Work Order Log" page).

*Expected:* One audit-log entry for each automatically-added fee/discount, the
same as when someone adds one by hand.

*Actual:* No audit-log entries at all for the automatic ones — only entries like
"Created" appear.

*Epic link:* SV-7387

**Technical notes (QA internal):**
- Internal ref FDBUG-3; affected case FD-HIST-001 (also blocks the positive
  verification of FD-HIST-007); spec §1 / S10-R2 (the audit log records the
  adjustment lifecycle). Reworded 2026-07-17 per spec V1_3 Δ2 ("history log" →
  "audit log"; terminology only, defect unchanged).
- Repro: a new WO that received 3 automatic adjustments (location auto-apply ×2
  + a customer-default processing fee) logged only "Created"/"Line created".
  Reconfirmed batch 3: an auto-applied Processing Fee produced NO audit-log entry.
  Audit-log read: `GET /api/work-orders/{id}/history`.

---

## TICKET 4 — **DROPPED 2026-07-14 (DO NOT FILE) — PO ruled this is working as designed**

> **DROPPED — do not file.** Chris Ward (F&D PO) answered Round-2 Q2 = **A**
> (2026-07-14), verbatim: *"A — already resolved by spec: S2-R25 says an entered 0
> is treated the same as empty, i.e. no maximum. Working as designed; a true $0 cap
> can only come from legacy data (§5-R6 note), never from the UI. No change needed."*
> A typed 0 in Max Amount = "no limit" is the intended behavior. FDBUG-9 closed as
> accepted; cases FD-CALC-008 (C28575), FD-VAL-006 (C28604), FD-TMPL-011 (C28512)
> reworded to affirm 0 = no cap and flipped to VIU-Verified. This draft is retained
> below for history only.

**Title:** Setting a fee/discount's maximum amount to 0 removes the limit instead of applying it

**Description:**

*What the user does:* A shop creates a percentage fee or discount and types 0
into the "Max Amount" (maximum) field.

*What happens now:* The 0 is saved, and then ignored — the fee/discount is
applied with NO maximum at all. For example, a 10% fee with a maximum of 0
still charged $32.46.

*What should happen:* A maximum of 0 should never mean "no limit". It should
either cap the amount at $0.00 or be treated the same as leaving the field
empty — but silently removing the limit is wrong either way.

*Steps to replicate:*
1. Add a percentage fee or discount (for example 10%) with Max Amount = 0.
2. Save it on a work order big enough that 10% is a real amount.
3. Look at the amount that was applied.

*Expected:* The maximum of 0 takes effect (amount capped) or the 0 is treated
as "no value entered" — not as "unlimited".

*Actual:* The full uncapped percentage is charged as if no maximum was set.

*Epic link:* SV-7387

**Technical notes (QA internal):**
- Internal ref FDBUG-9; affected cases FD-CALC-008, FD-VAL-006 (also the
  0-handling clause of FD-TMPL-011); spec §5-R6 (Max $0 forces $0.00) vs S7-R14
  (0 treated as empty / never sent) — either contract beats the live "0 =
  unlimited".
- Repro: `maxCap:0` accepted; 10% of $324.60 resolved to **$32.46**.

---

## TICKET 5 — **DROPPED 2026-07-14 (DO NOT FILE) — PO ruled this is expected**

> **DROPPED — do not file.** Chris Ward (F&D PO) answered Round-2 Q3 = **A**
> (2026-07-14), verbatim: *"A -- fully anticipated and expected."* Quietly rounding
> a below-minimum percentage up to the 0.01% minimum is acceptable/expected. FDBUG-10
> closed as accepted; case FD-CALC-006 (C28573) reworded to expect the round-up-to-
> minimum coercion and flipped to VIU-Verified. This draft is retained below for
> history only.

**Title:** A percentage that's too small is quietly changed instead of being rejected

**Description:**

*What the user does:* A shop enters a percentage fee/discount with a value
below the smallest allowed percentage (for example 0.005%).

*What happens now:* The app accepts it and silently rounds it up to the
smallest allowed value (0.01%) without telling the user.

*What should happen:* The app should refuse the too-small value and show a
validation message, so the user knowingly enters a valid percentage.

*Steps to replicate:*
1. Add a percentage fee or discount and enter a percent below the minimum
   (for example 0.005%).
2. Save it.
3. Look at the saved percentage.

*Expected:* The save is rejected with a clear validation message.

*Actual:* The save succeeds and the percentage has been quietly changed to
0.01%.

*Epic link:* SV-7387

**Technical notes (QA internal):**
- Internal ref FDBUG-10; affected case FD-CALC-006; spec §5-R1 (below-minimum
  percent is rejected, expected HTTP 400).
- Repro: 0.005% accepted (201) and rounded UP to 0.01%.

---

## TICKET 6 — Priority: Low

**Title:** Add Fee/Discount window on a part shows the wrong wording in three places

**Description:**

*What the user does:* On a work order, the user opens the menu on a part and
chooses "Add Fee/Discount". A window opens for adding a fee or discount to
that part.

*What happens now:* The math is right, but three pieces of wording are wrong:
1. The line at the top that says what the fee applies to shows only the part's
   name — it's missing the "Line … Part —" lead-in and the part number.
2. The "Calculation Type" box shows a raw internal code instead of a readable
   label.
3. The percentage choice is labelled as a percentage "of Labor Total" when it
   actually (and correctly) works on the Part total.

*What should happen:* The window should say plainly which line and part the
fee applies to (with the part number), show a readable calculation-type label,
and label the percentage option as a percentage of the Parts total.

*Steps to replicate:*
1. Open a work order that has a part on a line.
2. On the part's row, open the "…" menu and choose "Add Fee/Discount".
3. Read the "Applying to:" line and the Calculation Type box.
4. Select the percentage option and read its label and the preview.

*Expected:* Clear, human-readable labels that match what the calculation
actually does.

*Actual:* Missing lead-in/part number, a raw internal code, and a percentage
option labelled "Labor" that really uses the Part total.

*Epic link:* SV-7387

**Technical notes (QA internal):**
- Internal ref FDBUG-14; affected case FD-PART-001; spec S2-R11 (subtitle
  "Applying to: Line {N} Part — {part name} ({part number})") / §5-R10
  (part-line percentage labelled "% of Parts Total").
- Observed: subtitle "Applying to: 1710 U-JOINT 1.938X6.094" (no prefix / no
  part number in parens); Calculation Type default shows raw enum
  **"Pct_parts"**; percentage option mislabelled **"% of Labor Total"** while
  correctly resolving against the Part total (preview "Part total $232.68 …
  Fee · 10% +$23.27"). Evidence: `screenshots/viu-qb/partui3-dialog`,
  `partui5-partcalc`, `partui6-preview`.

---

## TICKET 7 — Priority: Medium

**Title:** Users who can't see the fee/discount buttons can still add fees/discounts another way

**Description:**

*What the user does:* A staff member whose role is not allowed to edit work
orders (for example a technician) opens a work order. As designed, the buttons
for adding a whole-work-order fee or discount are hidden from them.

*What happens now:* Hiding the buttons is the ONLY protection. If such a user
sends the add/edit/remove request directly (bypassing the screen — something a
technically-minded person or a script can do), the system accepts it. So the
permission is only skin-deep.

*What should happen:* The system itself should refuse the request from a user
whose role doesn't allow it — the same way it already refuses them access to
the fee/discount template admin pages and to customer defaults.

*Steps to replicate:*
1. Sign in as a role that is not allowed to create/edit work orders (for
   example Technician).
2. Confirm the whole-work-order "Add Fee / Discount" buttons are hidden on a
   work order.
3. Send the add-fee request directly to the system for that work order
   (details in the technical notes).

*Expected:* The system refuses the request because the role lacks permission.

*Actual:* The system accepts it and the fee is added.

*Epic link:* SV-7387

**Technical notes (QA internal):**
- Internal ref BUG-FD-3 (enforcement gap); affected cases FD-PERM-002,
  FD-WO-013 (also touches FD-PERM-007, FD-TMPL-016; the history endpoint has
  the same FE-only class — FD-PERM-009 / FD-HIST-006); spec S13-R3.
- Repro: Technician (quick-login `{key:'tech'}` on qb) without
  `workOrdersCreateAndEdit` → `POST /api/work-orders/adjustments/add` with
  `scope:"whole_wo"` returned **201** (expected 403). Same session correctly
  gets 403 on template create/list and customer default-adjustments GET/POST
  (BE-enforced), and financials are masked for `view_mode:tech`. WO history
  endpoint also FE-only (tech without `viewHistoryLogs` got 200 with entries).
- **Routing:** the PO answer sheet did NOT cover this (it is a dev/enforcement
  decision, not a product decision — `spec-v1-reconciliation.md` §3). The spec
  Key Decisions confirm the permission *mapping* is correct; only enforcement
  depth is open. Route to dev; file as a bug or a dev-decision ticket per the
  dev lead's call.

---

## TICKET 8 — Priority: Medium — NEW (PO-confirmed defect, answer sheet Q1 = B)

**Title:** Statistics page lumps all fees/discounts into one total instead of listing each one

**Description:**

*What the user does:* A user opens a work order's Statistics page to see how
the money breaks down, including the fees and discounts on the work order.

*What happens now:* All the fees are rolled up into a single combined line
(for example "Fees (3): $227.90"), and likewise for discounts. You can't see
the individual fees and discounts or their amounts on this page.

*What should happen:* Each fee and each discount should be listed on its own
row with its own amount. The Product Owner confirmed the row-by-row list was
in the original design and that today's combined total is a defect (the
requirement was lost when the design was written up).

*Steps to replicate:*
1. Open a work order that has two or more fees and at least one discount.
2. Open its Statistics page.
3. Look at how fees and discounts are presented.

*Expected:* One row per fee and per discount, each with its own name and
amount.

*Actual:* One combined "Fees (N)" total and one combined "Discounts (N)"
total.

*Epic link:* SV-7387

**Technical notes (QA internal):**
- PO answer sheet Q1 = **B** ("story defect; fixed originally in Branko's
  design, regressed in the spec"). Internal refs BUG-FD-2 / FDBUG-6; affected
  cases FD-STATS-001 (+ FD-STATS-002, FD-STATS-004 — their totals are also
  polluted by the TICKET-2 base error). Design evidence: `stats-table.png` in
  the design bundle (`design-v1-catalog.md`).

---

## TICKET 9 — Priority: Low — NEW (PO-confirmed defect, answer sheet Q4 = B)

**Title:** "Add" button on the fee/discount form is clickable before the form is filled in

**Description:**

*What the user does:* A user opens the window to add a fee or discount and
looks at the "Add" button before filling anything in.

*What happens now:* The "Add" button is already clickable. If you click it too
early, you get an error message.

*What should happen:* The "Add" button should stay greyed out (disabled) until
everything required is filled in correctly, so it's impossible to submit an
incomplete form. The Product Owner confirmed this is how it should work.

*Steps to replicate:*
1. Open any "Add Fee/Discount" window (whole work order or a line).
2. Before typing anything, look at the "Add" button.
3. Click it.

*Expected:* The button is greyed out and can't be clicked until the form is
valid.

*Actual:* The button is active immediately, and clicking it shows an error.

*Epic link:* SV-7387

**Technical notes (QA internal):**
- PO answer sheet Q4 = **B** (grey out until valid). Internal ref BUG-FD-4;
  affected cases FD-WO-005, FD-VAL-001 (keep the spec expected =
  disabled-until-valid).

---

## TICKET 10 — Priority: Low — NEW (PO-confirmed defect, answer sheet Q5 = B)

**Title:** When a line has several fees/discounts they all show at once — the "show more" collapse is missing

**Description:**

*What the user does:* A user adds two or more fees/discounts to the same labor
or part line on a work order, then views that line.

*What happens now:* Every fee/discount is displayed at full length all the
time. There is no "show more / show less" control, so lines with several
fees/discounts get long and cluttered.

*What should happen:* When a line has several fees/discounts, the extras
should collapse behind a "show more" control. The Product Owner confirmed this
collapse was in the design and its absence is a defect (it was under-described
in the write-up).

*Steps to replicate:*
1. On a work order line, add two or more fees/discounts.
2. View the line in the work order.

*Expected:* The extra fees/discounts are collapsed behind a "show more"
control.

*Actual:* All of them are always shown expanded; no such control exists.

*Epic link:* SV-7387

**Technical notes (QA internal):**
- PO answer sheet Q5 = **B** ("fixed in the design with a 'show more'").
  Internal ref BUG-FD-5; affected case FD-INLINE-003 (keep the spec expected =
  show-more collapse). Design evidence: the `*show-more*.png` frames in the
  design bundle (`design-v1-catalog.md`).

---

## TICKET 11 — Priority: High — NEW (PO-confirmed in-scope gap, answer sheet Q3 = B)

**Title:** "Processing Fee" can't be created in the app even though it's part of this release

**Description:**

*What the user does:* An admin goes to the fees/discounts template settings to
create a Processing Fee (a fee that covers card-processing costs, worked out
as a percentage of the bill).

*What happens now:* There is no visible way to create one. The template
builder only offers Fee and Discount — the Processing Fee choice is missing
from the screen, even though the system underneath is already partly able to
handle one.

*What should happen:* The Product Owner confirmed the Processing Fee option IS
part of this release, so the visible option needs to be added: pick
"Processing Fee" when creating a template, set its percentage, and have it
behave per the feature's rules.

*Steps to replicate:*
1. Sign in as an admin.
2. Open Settings → the fees/discounts templates screen.
3. Create a new template and look for a "Processing Fee" choice.

*Expected:* "Processing Fee" is offered alongside Fee and Discount and can be
created, edited, and used like the design describes.

*Actual:* No Processing Fee option anywhere in the screen.

*Epic link:* SV-7387

**Technical notes (QA internal):**
- PO answer sheet Q3 = **B** ("should be part of this release — the visible
  option needs to be added"). Internal refs NOTE-FD-4 / FDBUG-8 (Story 8);
  affected cases FD-PROC-001..004 (builder UI, currently Blocked-NotBuilt);
  keeps FD-PROC-001…014 in v1 scope.
- The BE already accepts `kind:processing_fee` on
  `POST /api/adjustment-templates` (that is how the WO-side processing-fee
  cases were driven); only the builder UI is absent. Do NOT descope to
  Phase 2. Note the epic's "what shipped" list omits it; the PO ruling makes
  it in-scope.

---

## Dropped — recorded here so it isn't re-raised

- **Over-sized discount saves "silently" (FDBUG-15).** NOT a defect per the PO.
  Chris Ward answered Round-2 Q1 = **A** (2026-07-14), verbatim: *"A — already
  resolved: the warning exists and is spec-required (S6-R12, 'the carry is never
  silent'). It shows before invoicing and before marking the WO reviewed/complete,
  stating the $0.00 floor, that tax on the taxable base is still owed, and the exact
  credit amount, and requires confirmation. It intentionally doesn't fire when the
  adjustment is merely added (nothing committed yet; the add dialog's preview shows
  the resulting totals). No change needed."* Our FDBUG-15 "silent save" was observed
  at ADD time = the wrong trigger point; the PO says that is intentional. **NO dev
  ticket released.** FDBUG-15 reclassified NOT-A-DEFECT; case FD-QB-014 (C28557)
  reworded to the commit-point warning and moved to **VIU-Pending** (the invoice /
  mark-reviewed / complete warning still needs a live commit-time re-VIU). *(QA
  internal: the potential "new Q1 ticket" flagged in PROJECT-STATE §0.1 is NOT
  created.)*

- **Processing Fee minimum amount (FD-PROC-014, Round-2 Q4).** No ticket needed.
  Chris Ward answered Q4 = **B** (2026-07-14), verbatim: *"B — already resolved by
  spec: S8-N6 forbids a Processing Fee minimum. Premise doesn't reproduce: there is
  no minimum-amount field anywhere in the UI, and the API rejects a Processing Fee
  minimum with an explicit error ('A processing fee cannot have a minimum or maximum
  cap') — nothing is silently dropped. No change needed."* Processing fees do not
  support a minimum and the app already makes that clear (no field + explicit API
  reject — matches the live 2026-07-13 finding). Case FD-PROC-014 (C28532) reworded
  to the explicit-reject + no-field behavior; stays VIU-Verified. No dev tweak
  ticket filed (silent-strip premise superseded by the live explicit-reject).

- **Customer defaults are added one at a time from a dropdown (no multi-tick
  checklist).** The Product Owner confirmed this is deliberate — adding one at
  a time lowers the risk of accidentally adding several, and the extra clicks
  are worth it (answer sheet Q6 = **A**). This is accepted behavior, NOT a
  bug; no ticket will be filed. *(QA internal: FDBUG-7 / NOTE-FD-5 closed as
  won't-fix/accepted; the FD-CUST-003/004/005/006/007 cases get the
  single-select case-wording update instead — see
  `reconciliation-actions.md` group C.)*
