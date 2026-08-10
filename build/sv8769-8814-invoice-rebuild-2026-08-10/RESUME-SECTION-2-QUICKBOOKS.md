# Cold resume — section 2 (QuickBooks) of the SV-8768 plan

**Everything else is finished and posted.** This file is what a fresh session needs to pick up
section 2 the moment a QuickBooks-connected organisation is available. Read this first, then
`RESULT-SV-8768-plan-sections.md`, then `build/APP-ACTIONS-PLAYBOOK.md` §R (production) and **§S**
(staging — flags, reversal, line status, the invoice-dialog rule).

---

## 1. Where things stand

| Section | Status | Where the write-up is |
|---|---|---|
| 1 — invoiced work order shows what was billed | ✅ done | `RESULT-SV-8769-section1.md`, SV-8769 comment **74893** |
| **2 — QuickBooks gets the billed amount** | ⏸️ **THIS IS THE ONLY THING LEFT** | not started |
| 3 — no line can be added to an invoiced work order | ✅ done | SV-8813 comment **74892** |
| 4 — re-invoicing after a void | ✅ done | SV-8813 comment **74892** |
| 5 — editing a work order with an unpaid invoice | ✅ done | SV-8814 comment **74891** |
| 6 — things that shouldn't have changed | ✅ 5 pass / 1 partial / 2 not covered | SV-8768 comment **74894** (updated — the CSV export now passes) |

**Jira comments already posted — update these rather than adding duplicates where it makes sense:**

| Ticket | Comment id |
|---|---|
| [SV-8814](https://shopview.atlassian.net/browse/SV-8814) | `74891` — PASSED, closeable |
| [SV-8813](https://shopview.atlassian.net/browse/SV-8813) | `74892` — PASSED, closeable |
| [SV-8769](https://shopview.atlassian.net/browse/SV-8769) | `74893` — passed on all tested, **says QuickBooks outstanding** |
| [SV-8768](https://shopview.atlassian.net/browse/SV-8768) | `74894` — master, **says QuickBooks outstanding**; `74902` — correction, the Customer Invoice CSV export exists and passes |

The MCP tool takes `commentId` to edit in place: `addCommentToJiraIssue({issueIdOrKey, commentId, contentFormat:"adf", commentBody})`.

**When section 2 passes, SV-8769 and SV-8768 become closeable** — those are the only two whose
comments currently say something is outstanding on QuickBooks grounds.

---

## 2. What section 2 actually asks for (verbatim from the plan, SV-8768 comment 74852)

> **2. QuickBooks gets the amount the customer was charged (SV-8768)**
> This one happens on **every** invoice — no special setup. If your org is connected to QuickBooks,
> this is the most valuable section here.
> - Invoice a work order carrying a Processing Fee on a QuickBooks-connected org
> - In QuickBooks, the fee lines match the invoice **to the cent** — with the setup above, the
>   Processing Fee posts as **$6.33**, not $6.70
> - The fee/discount lines still net to the invoice's fee total (a mismatch shows up as the invoice
>   landing in Unexported with a log entry — never as a bad figure in QuickBooks)
> - Invoice a work order with **no** fees — QuickBooks output unchanged

The bug being checked: `InvoiceCreateSyncService::buildAdjustmentLines()` re-resolved the adjustments
live, and the invoice row is already flushed by the time the sync runs — so QuickBooks was posted the
**inflated** fee on every invoice carrying a %-of-grand-total processing fee.

**The plan's own caveat, do not raise it as a bug:** QuickBooks is **not re-sent after a rebuild**.
It receives the invoice once, at creation. If the invoice is later rebuilt via the API, QuickBooks
keeps the creation-time totals. Compare QuickBooks against the invoice **as it was created**.

---

## 3. The exact test to run

Use the same shape that produced a clean, arithmetic-checkable result everywhere else:

| Item | Value |
|---|---|
| Labour | 1 hour at a round rate ($100/hr on staging, $118/hr on production) |
| Shop supplies | 10% of labour |
| Tax | 15% |
| Fee | **$50 flat, whole work order, TAXABLE** |
| Processing fee | **100% of grand total, non-taxable, from a template** |

At 5% the error is pennies; at 100% it shows up in dollars. With labour $100 + supplies $10 the
processing fee resolves to **(100 + 10) × 1.15 = $126.50**, subtotal $286.50, tax $24.00, total
$310.50.

**Then:** invoice it, and in QuickBooks confirm the processing-fee line reads **$126.50** — the
invoiced amount — and **not** the inflated live re-resolution. On an unfixed build the inflation is
`PF% × (final tax − invoice-time gross tax)` = 100% × (15% × $50) = **$7.50**, so a broken build
would post **$134.00**.

Then repeat on a work order with **no fees** and confirm the QuickBooks output is unchanged.

**Evidence required (QA lead's standing rule):** annotated before/after screenshots — the ShopView
invoice beside the QuickBooks invoice, with the fee line boxed on both. The generator is committed as
`annotate.py` in this folder (PIL; feed it a JSON spec — see the existing `ANN-SEC*.png` for the
pattern), with `capture-with-coordinates.mjs` to get the box coordinates.

**Cross-check it against the CSV too.** The Customer Invoice export (Reports → Export Reports, playbook
§S.10, or `GET /api/reporting/export/customer_invoice?report=customer_invoice&range=today`) gives the
billed fee amount per invoice line in one call — QuickBooks, the invoice and that CSV should all agree
to the cent.

---

## 4. What is needed before it can run

| Need | Why |
|---|---|
| **A QuickBooks-connected ShopView organisation** | Neither environment we used is connected. Staging org `115f79f7…` reports `bookkeeping_enabled: false` and **does not even carry the `QuickBooks` feature flag**. Production **does** carry the flag — but a flag is not a connection, and that was never confirmed |
| **QuickBooks login** for that company | To read the posted invoice lines |
| **Fresh ShopView cookies** for whichever environment | Staging dies roughly daily and **cannot be re-logged-in from the container** (Google SSO). Production takes `bilal.muzamil@shopview.com` / the password already supplied |

If the connected org turns out to be a **third** environment, treat it as new: `GET /api/workplaces`
for the location and its shop-supplies %, `GET /api/organization/feature-flags?organization_id=` for
the flags, and check `bookkeeping_enabled` on `POST /api/iam/change-location`'s response — that is
where it surfaced.

---

## 5. Environment state as left on 2026-08-10

### Staging `app.staging.shopview.com` — org `115f79f7-fbeb-470b-a709-bcfda7c5ad67`

**Two deliberate changes are still live** (left in place so section 3 and 4 stay reproducible):

| Change | Original value | Restore with |
|---|---|---|
| Feature flags `ShopCoach`, `ShopCoachStory`, `ShopCoachWOReview` enabled | only `BillingPortal` + `Deposits` | `POST /api/organization/feature-flags {organization_id, feature_flag_ids:["644fb244-e897-4934-83d1-b57c78a46209","b6d129ff-9690-47b3-98ad-2a485e824328"]}` |
| First Location shop supplies **10%** | `shop_supplies_charge: 0` | `POST /api/workplaces/change` — full record, `tax` **as an object** (see playbook §S.3) |

Reference ids (non-secret):

| Thing | Id |
|---|---|
| Workplace "First Location" | `10675225-b6b8-4751-8ace-2d5541981080` (Asia/Dubai, tax "Flat 15%" `8bb08dd0-2735-4a87-93c8-b42d6c02fde7`) |
| Customer "Aadale Motors" | `80e9f596-5293-4dd3-a56d-170eb48175c1` |
| Contact "Olivia Chen" | `068302d1-a01e-4749-b65a-babf5b0b72de` |
| Labour rate "100 per hour" | `f860f38f-3bc6-445e-a7d3-7c93fda28a24` |
| Processing-fee template | `f74120f5-069b-408e-89fc-22726a71934c` |

Work orders seeded (all `ZZAUTOTEST`, all invoiced, all unpaid):

| WO | Id | Role |
|---|---|---|
| S1-44 | `2fc3add6-d62b-4afa-9812-399a12a504ef` | section 1 evidence |
| S1-45 | `177877a1-830d-4f21-be36-e626e87dbc7d` | section 4 — reversed and re-invoiced |
| S1-46 | `936b7b30-3bbb-45c2-ad9d-7cfe2b3bca99` | section 6, no fees |
| S1-47 | `e3ed983a-9fc1-41ec-b5d5-d5eae70df4da` | section 6, declined line |

### Production `app.shopview.com` — org `72b2cc90-6964-4429-a207-76e55f946936`

| Thing | Id |
|---|---|
| Workplace "Trucks Hill 2" | `b617914c-16e9-4485-8e8b-193cd86aa416` |
| Customer "aqeel transport 56" | `01de15df-5651-4704-9450-0b94f4375f6b` |
| Contact | `77f953d2-80a8-487a-a053-196a82fa3ea6` |
| Labour rate "4226" ($118/hr) | `e9e21aac-b79b-4cba-b7cb-8419c6610f9a` |
| Processing-fee template | `af8095ce-8a8e-404d-9004-4ad7dd5b3984` |
| S2-833 (section 5) | `32a2fb4e-9d1d-4df9-994c-efa996a50465` — labour only, invoiced |
| S2-836 (sections 1, 3, 4) | `98888335-a4fb-49b1-8a59-849f5a2b2159` — reversed and re-invoiced, now 2 h |

Nothing on production needs restoring: shop supplies were already 10%, no flags were touched, and
every work order there is one we created and tagged.

---

## 6. The traps that cost time, so they don't again

1. **The payment dialog must be LEFT OPEN.** Closing it — with Escape *or* the close button — rolls
   invoice creation back even though the POST returned 201. Click Create Invoice, wait, close the
   browser. Playbook §S.1.
2. **A work order created via the API has no customer contact**, and without one Create Invoice sits
   **disabled with no tooltip**. Set it with `POST /api/work-orders/change-contact` *before*
   completing. Playbook §R.7a.
3. **`fe_permissions_wrapper` must be the real fe-permissions object**, not a name array, or the SPA
   renders blank. Playbook §R.2.
4. **Quasar needs coordinate clicks** — `locator.click()` times out on menus and dialogs. Submenus
   open on **click**, not hover.
5. **Read the org's feature flags before concluding a UI element is missing because of a code
   change.** That mistake nearly produced a false pass on section 3.

---

## 7. Other things still open (not blockers for section 2)

- **A technician-user login on staging** — the section-6 permissions check was skipped because
  impersonating ends the only session we have.
- **How the section-4 freeze was originally provoked** — a question for Nemanja; the Reverse action
  does not reproduce it on production.
- **Not raised, observed on both builds:** any line edit on an invoiced work order carrying a part
  returns HTTP 500, and a line cannot be completed while a part request is unfulfilled. Neither is a
  regression from this branch. No ticket filed — the QA lead's call.
