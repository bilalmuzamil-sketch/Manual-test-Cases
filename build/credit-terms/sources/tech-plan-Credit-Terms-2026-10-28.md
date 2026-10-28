# Credit Terms — Technical Implementation Plan

**Date:** 2026-10-26
**PRD:** https://shopview.atlassian.net/wiki/spaces/~7120207b6068952672480db1a06bd810e23ba1/pages/963346440/Credit+terms (v5)
**Jira epic:** [SV-11638](https://shopview.atlassian.net/browse/SV-11638). Stories: SV-11670 (S1) · SV-11671 (S2) · SV-11672 (S3) · SV-11673 (S4) · SV-11674 (S5) · SV-11675 (S6) · SV-11676 (S7) · SV-11677 (S8) · SV-11678 (S9) · SV-11679 (S10) · SV-11680 (S11) · SV-11681 (S12)
**Design:** https://claude.ai/artifact/2erYxWz2ffDNcoXzEfu6wf (9 pages: 1 List and row menus · 2 Move customers · 3 New credit term and Inactive tab · 4 Everything deactivated · 5 New Customer · 6 Customer on a deactivated term · 7 Vendors · 8 Over Credit warning · 9 Invoice due date)
**Tech stack:** Symfony 7.4 / PHP 8.5 / Doctrine ORM 3 (api), Vue 3.5 + Quasar 2 + TanStack Query (app), Playwright (e2e)
**Estimated complexity:** High. This adds a new organization-scoped aggregate, touches 11 due-date call sites and about 20 term-name readers, adds a bulk write of up to 11k rows, and changes QuickBooks term sync.

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight. This plan may be executed by someone who did not write it._

- **Status:** Not started. The plan is approved (2026-10-27) and its verification tickets are created.
- **Current phase:** —
- **Last completed:** —
- **Open questions / blockers:** none. All Product questions are answered (PRD v5).

> 🛑 **About to implement this plan? Run it as `/loop /implement <this-file>`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop`. That combination adds the code-review loop, `/implement`'s runtime gates (migration / compile / smoke / browser-walk), and phase-by-phase hands-off execution. Free-hand implementation skips all of it. E2E coverage is not part of `/implement`: run `/e2e-after-change` before `/create-pr`.
>
> - **However you were handed this** ("implement it", "here's the path, do it", or a single phase), do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). That *is* doing the implementation, just with the gates. Announce that you're routing through `/loop /implement` and proceed; there's no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore the routing part of this note and continue; you're in the right place. The `/loop` session is **orchestrator-only**, though: every code edit, including a one-line review or runtime-gate fix, goes through `be-implementer` / `fe-implementer` (or the matching test-writer). You dispatch, run the runtime gates and keep this Execution State current, but you never edit code yourself.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement`; that's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins. If the user in this session says to implement directly or skip the loop, honor that. Being handed just the plan path is **not** such an instruction; absent one, default to `/loop /implement` without asking.

> 🎨 **Design access.** Design files are never copied into the repo or shipped with this plan; open them from the link.
> - The design is a `claude.ai/artifact/<id>` canvas. Open it with the **Artifact** tool (`action: "read"`); its boards are published files (`project/Main.dc.html`, `Default.dc.html`, `NewTerm.dc.html`, `Empty.dc.html`, `NewCustomer.dc.html`, `Inactive.dc.html`, `Vendor.dc.html`, `OverCredit.dc.html`, `Invoice.dc.html`, plus screenshots under `project/shots/`), read with `path`.
> - For `claude.ai/design/p/<projectId>` links use **DesignSync** (load it with `ToolSearch` `select:DesignSync`). WebFetch and curl return 403.
> - Project sub-agents (`be-*`, `fe-*`, `e2e-implementer`) don't have these tools. The orchestrator opens the board a phase cites and passes what's needed into the agent's prompt: icons, colors, tab-count format and spacing.

> ⚡🔒 **Performance and security are top priorities for every phase.** Read §9 before writing code.
> - Every new read path must be bounded, tenant-scoped and index-backed, with no N+1 or per-row fan-out.
> - Every new endpoint must enforce authorization.
> - Move Customers writes up to 11,185 rows; it must stay set-based and inside the 30 s PHP-FPM CPU cap.
> - When the orchestrator dispatches a phase, it includes the §9 items that phase touches in the implementer's prompt.

---

## 1. Requirements (extracted from PRD)

**The requirement IDs are the PRD's own**, used verbatim: S1-R1 … S12-R8, 212 IDs in PRD v5. Each story maps to one Jira story: S1 = SV-11670 … S12 = SV-11681. The full requirement text lives in the PRD; every user-facing string is copied verbatim in Appendix A. This section adds only what the PRD doesn't say.

Requirements introduced by analysis (NFRs). Each one is tagged with its story.

| ID | Story | Requirement | Origin |
|---|---|---|---|
| NFR-1 | SV-11670 | The Credit Terms page loads in under 1 s at the test org's size, with counts and menu locks. The exact "Used by" figures load lazily when a row menu opens. | PRD v4 **S1-R17** (engineering commitment, IT-1) |
| NFR-2 | SV-11673 | Move Customers scales to **11,185 customers on one term**, the prod maximum (Q-D3), as one all-or-nothing request inside the 30 s PHP-FPM CPU cap. | analysis + prod data |
| NFR-3 | SV-11672 | Term names are unique per org **ignoring capitals and all whitespace**, enforced in the DB (`name_key` unique index). Edits carry an optimistic `version`. | PRD review "For engineering" |
| NFR-4 | SV-11677 | QuickBooks term get-or-create is safe under concurrent exports: a local term map, a named lock, and a re-query on a duplicate fault (OQ-2). | analysis, confirmed in the PRD thread |
| NFR-5 | SV-11673 | The AccountingHub `customer_updated` events for a move are recorded by **one async job after commit**, not inside the request. | user decision D15 |
| NFR-6 | SV-11674 | S5-N4 is enforced **server-side**: a user without AR/AP who sends a term or limit has it ignored. | analysis (today the gate is frontend-only) |
| NFR-7 | SV-11674 | 31-character term names print unclipped on legacy and batch invoice templates (S5-R11). | analysis (coverage walk) |

### Clarifications & PRD comment outcomes

| Question | Asked via | Answer |
|---|---|---|
| Intake directives | intake | None. The PRD is analyzed as-is. |
| No stories under the epic; design states without boards; A/R Collection column dropped; Move has no cap; COD/Credit Hold $0 across imports and the API; "in use" definition; the Vendor Bill Export prints the stored due date; log error state; term list loads for everyone; no per-record change history | prd-review (Accepted by Product, 2026-10-22) | Settled as stated in the PRD |
| OQ-4: release order vs SV-11414 / SV-11571 | prd-review | SV-11571 ships first; this branch merges on top. Verified: `1da89350bd [SV-11571]` is on `origin/develop`. |
| OQ-1 merge with AccountingHub Payment Terms; OQ-5 vendor default term | prd-review | Out of scope for this release ("Blocks: nothing") |
| IT-1: page-load target | Confluence comment (round 1) | PRD v4 **S1-R17**: under 1 s; exact "Used by" figures on menu open |
| OQ-2: concurrent QuickBooks term creation | Confluence comment (FYI) | Today the code takes no lock, cache or idempotency step, so a duplicate term or a QB Unexported row is possible. Fixed by NFR-4. Product agreed. |
| OQ-3: QuickBooks sandbox check of day-of-following-month dates | Confluence comment (FYI) | Becomes a QA verification ticket (Section 11) |
| Q-P1: a contacts import update with a blank or missing limit cell | Confluence comment | **OK** (v4 S10-E3): keep the stored limit. S10-R8 still applies when the update moves the customer onto COD or Credit Hold. |
| Q-P2: Public API vendor created with no term | Confluence comment | **OK** (v4 S10-R7): it starts on COD instead of "net_30". Existing vendors are unchanged. |
| Q-P3: A/P aging after a vendor invoice edit | Confluence comment | **OK** (v4 S7-R9): fixed in this release |
| Q-P4: editing an inactive term (server refusal) | Confluence comment | **OK** (v4 S2): "Reactivate this term to edit it." |
| Q-P5: refusal copy for a stale edit | Confluence comment (follow-up) | **OK** (v5 S2 Error Handling): "Someone else changed this credit term. Reload the page and try again." |
| S1-R6 "app-wide sorting rule" | Confluence comment | Confirmed: the first click sorts ascending (Due in the S1-R5 order), each further click reverses, and the sort is not saved |
| Q-D1: vendor invoices with no stored due date | prod query | `SELECT COUNT(*), SUM(d.due_date IS NULL) … FROM inventory_delivery d` returned 324,110 total and **0** NULL, so the Vendor Bill Export needs no backfill |
| Q-D2: invoice volume per org | prod query | `SELECT organization_id, COUNT(*) FROM invoice GROUP BY 1 ORDER BY 2 DESC LIMIT 10`: the largest org has **15,813** invoices and the top ten are all under 16k. Live counting plus an index is enough. |
| Q-D3: largest single-term customer group | prod query | `GROUP BY organization_id, LOWER(REPLACE(term,' ',''))` on `company WHERE is_system_default=0`: the maximum is **11,185** (COD), then 8,357 (COD) and 7,236 (Due on Receipt) |
| Q-D4: collation and table sizes | prod query | `credit_term` is `utf8mb4_unicode_ci` on `company`, `invoice` and `part_vendor` (case-insensitive, PAD SPACE). Row counts: `invoice` 273k (586 MB data), `company` 252k, `inventory_delivery` 320k, `part_vendor` 68k. |

## 2. Architecture Overview

Today the credit-term model has three parts:
- The twelve terms are constants in `api/src/Shared/Domain/ValueObject/CreditTerms.php`, mirrored in `app/src/constants/ts/creditTerms.ts`.
- `company.credit_term`, `part_vendor.credit_term` and `invoice.credit_term` (a frozen copy) are free-text `varchar(255)` columns, with no index on any of them.
- `GET /api/credit-terms` is orphaned: no frontend code calls it.

**The new model keeps the free-text columns** (S5-E2, S10-R4 and S11-E2 require unknown text to survive) and adds an **organization-scoped lookup table** that the stored text is matched against by name key:

```
                  ┌───────────────────────── credit_term (per org) ─────────────────────────┐
                  │ 12 seeded standard rows + shop's own rows · name_key (unique per org)   │
                  │ rule {cod|due_on_receipt|credit_hold|net_days|day_of_following_month}    │
                  │ is_active · default_marker (exactly one per org) · version               │
                  └───────────────▲──────────────────────────────▲──────────────────────────┘
                                  │ match by CreditTerms::nameKey(raw text)
 company.credit_term ─────────────┤                              │
 part_vendor.credit_term ─────────┤        CreditTermCatalog (per-request memo, unseeded → constants)
 invoice.credit_term (frozen) ────┘                              │
                                                                 ▼
   CreditTermDueDateCalculator (own terms → rule; standard/unknown → unchanged CreditTerms path)
     → InvoiceBuilder, deliveries, vendor transactions, AR dashboard, statement / unpaid credit memos
   CreditTermNameResolver → customer/vendor saves, imports, Public API (shop spelling, default)
   QuickBooksTermResolver → local quickbooks_term_map → TermHandler (DueDays | DayOfMonthDue)
   CreditTermLogRecorder  → entity_event (entity_type=credit_terms, entity_id=org) → AuditLogDialog
```

**Bounded context:** `api/src/Organization/Finance/CreditTerms/`, a sibling of Payment Methods, in the canonical layout (`Domain/{Model,Repository,Service,Error}`, `Application/{Command,Query,Handler,DTO,Service,EventListener,Messenger}`, `Infrastructure/Persistence/{Repository/Doctrine,Query/Dbal}`, `UI/HTTP/<Feature>/DTO`, `UI/CLI`). The legacy Payment Methods layout is **not** copied.

**Frontend:** a new `app/src/api/credit-terms/` module (TanStack Query, no Vuex), the page under `app/src/components/ts/administration/credit-terms/`, registered like Payment Methods (`routes.ts` + `Administration.vue` + `AdminLeftMenuNav.vue`).

## 3. Technical Decisions

Each decision shows who made it (agent or user) and why.

- **D1 · agent. The default is a `default_marker` on `credit_term`, not a column on `setting`.** `setting` throws when its row is missing (S11-E1 forbids that), and it's documented as work-order gates. A unique `(organization_id, default_marker)` key allows one `1` and many NULLs.
- **D2/D20 · agent. Name matching uses a stored `name_key` (lowercase, all whitespace stripped) and SQL `GROUP BY` on the raw `credit_term`, folded in PHP.** The collation already folds case and trailing spaces (Q-D4). Inner spaces are folded by `CreditTerms::nameKey()`, mirrored in TS as `toCreditTermMatchKey()`, and both sides share test vectors. No derived column goes on `company`, `part_vendor` or `invoice`.
- **D3 · agent. Move Customers is set-based, in one transaction.**
  - Sorted, chunked `SELECT … FOR UPDATE` on the ticked ids.
  - A guarded `UPDATE … WHERE credit_term IN (observed spellings)`, which handles S4-E1.
  - Batch `INSERT`s into `communication_note`, bypassing per-note mention resolution and notifications.
  - A log row plus `entity_event_ref` rows.
- **D4 · user. A local `quickbooks_term_map`, a MySQL named lock (`WaitingLock`), and a re-query on a duplicate fault.** Moving the whole invoice and vendor-bill export onto the `quickbooks` worker is a **separate follow-up** (a ticket is drafted with the verification tickets, Section 11). It re-orders the journal-entry, payment and deposit syncs that read `BookkeepingInvoice` right after create, so it's a project of its own.
- **D5 · agent. A day-of-following-month term goes to QuickBooks as `DayOfMonthDue = X`, `DueNextMonthDays = 31`**, so it's always due the following month. Whether QuickBooks Online also requires `DiscountDayOfMonth` is checked in the OQ-3 sandbox ticket.
- **D6 · agent. One Over Credit rule, in two places:** `CreditStanding::isOverLimit()` (BE) and `isOverCreditLimit()` (TS). The rule is `limit > 0 && balance > limit && term ∉ {COD, Due on Receipt, Credit Hold}`, with a blank term counting as COD.
- **D7 · agent. The list returns `is_active`, and the frontend adds "(Inactive)".** Documents print the stored raw name.
- **D8 · agent. S5-N4 is enforced server-side** through an AR/AP atom check on customer create and change.
- **D9/D17 · agent. Routes follow the Adjustment Templates style.** The orphan `api/src/Sales/CreditTerms/` tree is deleted.
- **D10 · agent. Bug fixes the PRD mandates:**
  - the contacts import's `??` becomes `?:` (S10-E3);
  - the record's location time zone on the AR dashboard and the two credit-memo recalculations (S11-R14);
  - the Vendor Bill Export prints the stored `d.due_date` (S7-R11).
- **D12 · agent. Requirement IDs are the PRD's own, used verbatim** (S1-R1 … S12-R8), plus NFR-1 … NFR-7. No re-numbering.
- **D11 · agent. FE traps to handle:**
  - the Name field uses `lazy-rules` `'ondemand'` until the user types (S5-R10, S6-R5, S11-R6, S11-R7);
  - `v-close-popup="!blocked"` (S2-N6);
  - the wrapper-div tooltip on a disabled `CurrencyInput`;
  - test-id suffixes on `CurrencyInput`.
- **D13 · user. The 12 standard terms are seeded rows for every org.** A subscriber on `OrganizationRegistered` seeds new orgs with Due on Receipt as the default. The idempotent CLI `app:credit-terms:seed-standard` seeds existing orgs with COD as the default. Reads fall back to the constants for an unseeded org (S11-E1). Rejected: constants plus an overlay table, which would mean two sources everywhere.
- **D14 · user. The Credit Terms Log lives in `entity_event`** (`EntityEventType::CREDIT_TERMS`, `entity_id` = org id), with the IBS Settings log as precedent. Rejected: a dedicated table, and the purged `audit_log` system (S12-R6 says "kept indefinitely").
- **D15 · user. The move fan-out to AccountingHub runs as one async job after commit**, which reads the moved ids from `entity_event_ref`. Rejected: inline outbox rows, which at 11k builds risk the 30 s CPU cap.
- **D16 · agent. "In use" counting is live.** The page uses index-only `GROUP BY` queries; the exact invoice count is fetched lazily when a row menu opens (S1-R17). Largest org: 15.8k invoices (Q-D2).
- **D18 · agent. The ungated list carries no counts.** A separate `GET …/usage` endpoint, gated on Settings → Finance, returns the counts.
- **D19 · agent. API casing:** snake_case everywhere except the log rows, which use the camelCase shape of the WO history DTO.
- **D21 · agent. The "Used by …" text is rendered server-side only**, as `used_by_text` (E8, and in every refusal string).

- **D22 · agent. Gates:**
  - FIN = `ROLE_PAYMENT_METHOD::CHANGE`. Only the Settings → Finance bundle grants it (`FEPermissionMappings.php:711`, verified), and `UpdatePaymentSettingsController.php:54` already uses it as the Finance gate.
  - MOVE = FIN **and** `ROLE_CUSTOMER::CREATE_AND_EDIT` **and** (AR view **or** AP view).
  - A customer id outside the org rejects the whole move.
- **D23 · agent. Frontend shapes:** a `q-virtual-scroll` Move list, and `AuditLogDialog` widened with `subject: 'creditTerms'`.
- **D24 · agent. Remove `text-truncate` from the Terms cell** in the legacy invoice, legacy part-sale and batch templates (S5-R11).
- **D25 · agent. A blank `credit_term` on `POST /api/customers/change` keeps the stored term.** It's never refused and never written as blank, matching S10-E3's "blank keeps" rule for imports. Consequence: after release no write path produces a blank term. E2E C44914 gets re-scoped (see the E2E pass).
- **D26 · agent. The `POST /api/customers/create` wire contract is frozen.** `CreateCustomerRequestDto` must bind every key `CustomerDialog.vue:772-804` and `e2e/src/api/factories/customer.factory.ts` send today (`address_1`, `state_or_province`, `postal_code`, `country_code`, `email`, `phone`, `city`, `ibs`, `salesRepId`, `salesRepFirstName`, `salesRepLastName`, …) and return `data.id`. A functional test posts that exact payload.
- **D28 · agent. One release rule: an org with no `credit_term` rows is a pre-release org, and it behaves exactly as today: COD default, the 12 standard terms (S11-R1, S11-R3, S11-E1).** The same rule is used in three places:
  - `StandardCreditTermSeeder::ensureSeeded()`, which E1 calls before reading, so the page always gets real ids;
  - the `CreditTermCatalog` fallback for id-less readers;
  - the seed CLI.

  **Post-release orgs** get their rows with Due on Receipt as the default **inside the registration transaction**. `RegisterCommandHandler` publishes `OrganizationRegistered` on the synchronous `integration_event.bus` before `commit()`, the same way `CreateDefaultPaymentMethod` seeds payment methods. So a post-release org never has zero rows (S11-R12).

  **Accepted edge:** during a rolling deploy, an org registered on a not-yet-updated task gets no rows and is treated as pre-release (COD). That's the literal S11-E1 behavior, and the window is minutes long.

  **Rejected:** a creation-date cutoff. `organization_detail` has no `created_at`, and a config date is set before the deploy happens.
- **D29 · agent. Edit Customer reuses "Pick an active credit term."** when a stale form sends a term that's now inactive or deleted. The PRD names that string only for New Customer; Edit Customer is the same window (S5-R15), so it shows the same message.
- **D30 · agent. Name uniqueness also folds accents** ("Café" = "Cafe"), because `utf8mb4_unicode_ci` does. A duplicate is refused with S3-R9's "A term called {existing name} already exists." This is stricter than the PRD's "capitals and spaces", and harmless.
- **D32 · agent. A ticked customer that was hard-deleted mid-move rejects the whole move** with "Couldn't move the customers. Nothing was changed. Please try again." The FE refetches the list and the user retries. This narrowly deviates from S4-E1 ("left alone"). Skipping would need an unscoped existence check to tell a deleted id from a foreign one, which is a 🔴 Inbound ID Ownership exemption. Rejecting keeps a foreign id from ever being silently accepted.
- **D33 · agent. Small extras, each flagged:**
  - Delete the dead `CustomerAccount::isOverLimit()` and its unit-test cases (Phase 2).
  - Replace `Vendor.vue`'s touched inline style with a scoped class (the no-static-inline-styles rule, Phase 6).
  - `/customers/change` stops writing NULL for an omitted limit, as a side effect of S5-N4 (Phase 6).
  - QuickBooks legacy `DueDays` is clamped to 999 (Phase 7). QuickBooks rejects anything above that today, so legacy terms over 999 days start exporting. Each invoice still carries its own stored due date.
- **D34 · agent. Creating a term whose name matches legacy free text that customers or invoices already hold** (for example, an imported "Net 10") folds those holders in at once. This follows from the PRD's own rules: S3-R9 only refuses names matching a standard term or another of the shop's terms, and the S1-R12/§6 counts are name-based. The new term shows those customers and is in use straight away; their future invoices follow its rule. The existing invoices keep their stored due dates (S7-R7). This is shown to Product as an FYI on the PRD thread.
- **D27 · agent. Test ids are added up front in the phase that touches each component** (Phase 2: badges and `CurrencyInput` suffixes; Phases 4 and 5: the page and dialogs; Phase 6: card texts and restored option ids), using the names in §7 E2E, so the E2E implementer needs no carve-out edits (Golden Rule #5). Option `value` stays the term **name**, so `option_customer_credit_term_<name>` stays stable.

**Golden Rule exemptions (user-approved 2026-10-26; copy into the PR's "Golden Rule Exemptions" block):**
- **G1 🔴 Tenant scoping.** `SeedStandardCreditTermsCommand` enumerates every `organization_detail.id` unscoped, in keyset pages of 200. Every write runs inside `OrganizationDecorator::runAs($orgId, …)`, one short transaction per org. Rejected alternatives: an `INSERT … SELECT` data migration (the same exemption, plus one long statement), and lazy seeding on the first Finance mutation (synthetic ids and more code paths).
- **G2 🔴 Authorization.** `GET /api/organizations/finance/credit-terms` is gated by authentication only. The PRD requires it: the list loads for every user (§4 Permissions, S5 and S6 prerequisites), and the Payment Methods list is the precedent. The list returns names, rules and flags only; counts sit behind FIN (D18). Rejected alternative: gating the list, which breaks New Customer, Edit Vendor and the invoice preview for non-Finance users.

**Non-🔴 architecture notes:**
- Move writes `company`, `customer_account`, `communication_note` and `entity_event_ref` through DBAL. A docblock and an "identical to ORM" note test guard this.
- E9 (the Move list) is unpaginated, per S4-R13 and S4-R24.

**New dependencies:** none. `q-virtual-scroll` is part of Quasar.

## 4. Database Changes

> ⚠️ Migrations are written **by hand** and verified as a no-op with `bin/console doctrine:migrations:diff --allow-empty-diff` ("No changes detected"). DBAL's schema tools choke on functional/expression indexes in this repo, so the real migration is produced by the implementer against the live schema. Hand-authored FKs must be registered in `MANUALLY_MANAGED_FOREIGN_KEYS`. See `api/.claude/reference/database.md`. Functional tests build the schema on SQLite, so idempotent writes use **insert + catch `UniqueConstraintViolationException`**, never `INSERT IGNORE` or `ON DUPLICATE KEY`.

### New tables

**M1 `credit_term`.** Entity `App\Organization\Finance\CreditTerms\Domain\Model\CreditTerm`. Mapping in `Infrastructure/Persistence/Repository/Doctrine/CreditTerm.orm.xml`, plus a `CreditTermRule.orm.xml` embeddable; register both in `config/packages/doctrine.yaml`.

```sql
-- Illustrative shape only, NOT the migration to copy-paste
CREATE TABLE credit_term (
  id BINARY(16) NOT NULL, organization_id BINARY(16) NOT NULL,
  name VARCHAR(31) NOT NULL, name_key VARCHAR(64) NOT NULL,
  is_standard TINYINT(1) NOT NULL DEFAULT 0,
  rule_type VARCHAR(32) NOT NULL, rule_days SMALLINT UNSIGNED NULL, rule_day_of_month TINYINT UNSIGNED NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1, default_marker TINYINT(1) NULL,
  version INT NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, created_by BINARY(16) NULL, updated_by BINARY(16) NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX cterm__organization_id_name_key_unq (organization_id, name_key),
  UNIQUE INDEX cterm__organization_id_default_marker_unq (organization_id, default_marker),
  CONSTRAINT cterm__organization_id_fk FOREIGN KEY (organization_id) REFERENCES organization_detail (id) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
- The `ct__` index prefix is taken (`customer_transaction`), so use `cterm__`.
- Add `cterm__organization_id_fk` to `MANUALLY_MANAGED_FOREIGN_KEYS` in `api/src/Shared/Infrastructure/Doctrine/Schema/ExpressionIndexFilteringMySQLSchemaManager.php`.

**M4 `quickbooks_term_map`** (Phase 7): `id`, `organization_id`, `realm_id VARCHAR(32)`, `name_key VARCHAR(255)`, `term_name VARCHAR(255)`, `external_term_id VARCHAR(32)`, `created_at`, with a unique index `qbterm__organization_id_realm_id_name_key_unq`. `name_key` is 255 wide because legacy free-text terms reach QuickBooks too.

### Modified tables (indexes only, `ALGORITHM=INPLACE, LOCK=NONE`, non-transactional; template `Version20261021120000.php`)

- **M2:** `company` gets `c__organization_id_credit_term_is_system_default_name_idx (organization_id, credit_term, is_system_default, name)`, which serves both the counts and the Move list index-only. `part_vendor` gets `pv__organization_id_credit_term_idx (organization_id, credit_term)`. Declare both in `Company.orm.xml` / `Vendor.orm.xml`.
- **M3, in its own migration:** `invoice` gets `inv__organization_id_credit_term_idx (organization_id, credit_term)`, declared in `Invoice.orm.xml`. This is the 586 MB table, so run it off-peak.

### Data migrations

- **Standard-term seeding (D13 / G1):** `bin/console app:credit-terms:seed-standard [--organization=] [--batch=200] [--dry-run]`.
  - It inserts the 12 standard rows for orgs that lack them.
  - It sets COD as the default **only when the org has no default row**. A post-release org already has its Due on Receipt rows from registration (D28), so the CLI never touches it.
  - It's idempotent, uses one short transaction per org, and catches and logs a failure per org without stopping.
  - **Deploy order (D28):** ship the code and migrations M1–M3, then run the CLI in the same release's post-deploy commands (list it in the `/release-pr` command block). The CLI is a bulk pre-warm, not a correctness step:
    - Before it reaches an org, that org's first Credit Terms page load seeds it (`ensureSeeded`, COD default).
    - Id-less readers (due dates, imports, the Public API, New Customer's default) see the same COD fallback.
    - Every path applies one rule: no rows ⇒ pre-release ⇒ COD.
- **No customer, vendor or invoice row is rewritten** (S11-R2, S11-N1). There's no Vendor Bill Export backfill (Q-D1).
- **Derived data and how it's maintained:**
  - `credit_term.name_key` is written only by the aggregate (factory and `rename()`).
  - `quickbooks_term_map` is written on first export per (org, realm, term) and never updated. QuickBooks terms are immutable from ShopView (S8-R4, S8-R7).

## 5. API Changes

All routes live under `/api/organizations/finance/credit-terms`, with the internal envelope (`data.*`) and snake_case fields (D19). Every `{id}` resolves through a non-nullable `#[MapEntity] CreditTerm` against the org-scoped `findById()`; an unknown or foreign id returns **"Credit term not found."** (404). Domain refusals return 409 with the PRD's **exact** strings, and the axios interceptor shows them, so the frontend has no error-mapping code. `{id}` routes carry `requirements: ['id' => Requirement::UUID]`.

| # | Route | Gate | Request | Response | Errors (exact PRD text) |
|---|---|---|---|---|---|
| E1 | `GET …/credit-terms` | **authenticated only (G2)** | — | `{ credit_terms: [{ id, name, kind: standard\|net_days\|day_of_following_month, rule_type, days, day, rule_text, is_standard, is_active, is_default, is_always_available, version }], default_credit_term_id }`, sorted in the S1-R5 order server-side. An unseeded org is seeded on this request first (D28), so `id` is never null on this endpoint. | — |
| E1b | `GET …/credit-terms/usage` | FIN | — | `{ usage: [{ id, customers_count, vendors_count, in_use }] }` | 403 |
| E2 | `POST …/credit-terms` | FIN | `{ name, kind: net_days\|day_of_following_month, days?, day? }` | 201 item | "Enter a name." · "Use 31 characters or fewer." · "{Standard} is already a standard term. Pick another name." · "A term called {name} already exists." (also the S3-E2 race, via the unique key) · "Enter 1 to 365 days." · "Enter a day from 1 to 31." · "Pick Due Net X days or Due day of the following month." |
| E3 | `POST …/{id}/change` | FIN | `{ name, kind, days?, day?, version }` | 200 item | E2's name and number strings · "Used by {holders}. Deactivate it instead to take it out of the pickers." · "Reactivate this term to edit it." · "Someone else changed this credit term. Reload the page and try again." (stale version, S2-E2) |
| E4 | `POST …/{id}/make-default` | FIN | — | 200 item | "Pick an active term other than Credit Hold." (a no-op on the current default writes no log row) |
| E5 | `POST …/{id}/deactivate` | FIN | — | 200 item | "Always available. COD, Due on Receipt and Credit Hold can't be deactivated." · "This is your default for new customers. Pick another default first." |
| E6 | `POST …/{id}/reactivate` | FIN | — | 200 item | — |
| E7 | `DELETE …/{id}` | FIN | — | 204 | default · in-use · standard (generic; the UI never offers it) |
| E8 | `GET …/{id}/holders` | FIN | — | `{ holders: { customers, vendors, invoices, used_by_text } }` | — |
| E9 | `GET …/{id}/customers` | MOVE | — | `{ customers: [{ id, name }] }`: A–Z, excludes `is_system_default`, includes blank terms when the source is COD, **unpaginated** (S4-R13/R24, up to 11,185 rows) | 403 |
| E10 | `POST …/{id}/customer-moves` | MOVE | `{ to_credit_term_id, customer_ids: uuid[] (≥1) }` | `{ moved_count, to_credit_term_name }` | "Pick at least one customer to move." · "Pick an active term other than {from term}." · "Couldn't move the customers. Nothing was changed. Please try again." (any failure, or an id outside the org, D22) |
| E11 | `GET …/credit-terms/history` | FIN | `#[Search] search`, `#[Pagination]` | `{ history: [{ id, eventType, eventName, userName, details: string[], historyDate, historyTime, historyTimestamp }], pagination }`, newest first. `historyDate` and `historyTime` are formatted on the **viewer's** current location calendar (`WorkplaceTimezone`, the session's location), as S12-R4 requires; `historyTimestamp` is ISO UTC | 403 (S12-N1) |

FIN = `#[IsGranted(PermissionEnum::ROLE_PAYMENT_METHOD_CHANGE)]`. MOVE = an Expression built like `ListCustomerDefaultAdjustmentsController.php:62-68` (FIN **and** `ROLE_CUSTOMER_CREATE_AND_EDIT` **and** (`ROLE_ACCOUNT_RECEIVABLE_REPORT_VIEW` **or** `ROLE_ACCOUNT_PAYABLE_REPORT_VIEW`)).

### Removed endpoint
- `GET /api/credit-terms`: the whole `api/src/Sales/CreditTerms/` tree. A grep found no consumers in `api/tests`, `api/config`, `app/src` or `e2e/src`.

### Modified endpoints
| Endpoint | Change |
|---|---|
| `POST /api/customers/create` | Moved to `api/src/Customer/Customers/UI/HTTP/Create/{CreateCustomerController, DTO/CreateCustomerRequestDto}.php` (same path and route name `customers_create`). It accepts `credit_term` and `credit_limit`. Without AR/AP (S5-N4) the server ignores both: the term is the default, and the limit is 0 when the default is COD, otherwise null. "Pick an active credit term." · "COD and Credit Hold customers can't charge to account, so they have no credit limit." |
| `POST /api/customers/change` | `ChangeCommand` gains `canManageCredit`, set by the controller. Without it the server keeps the stored term **and** limit, which also removes today's "omitted limit → NULL" behavior. With it: a blank term keeps the stored term (D25); the stored spelling is kept when the name key is unchanged (S5-R7, S5-E2); otherwise the term must be active, refused with "Pick an active credit term." (D29). **COD or Credit Hold:** a null or 0 limit saves 0 (S5-R9, S11-R16); a limit above 0 is refused with "COD and Credit Hold customers can't charge to account, so they have no credit limit." The UI always sends 0 for these terms (S5-R9). |
| Vendor add and change | Term saved in the shop's spelling (S10-R3/S6). New vendors stay on COD (S6-R2). |
| `POST /api/v1/customers` | Blank term → the org default (S10-R2); otherwise the shop spelling. COD or Credit Hold → limit 0 (S10-R8). Never refuses (S10-N1). |
| `PATCH /api/v1/customers/{id}` | Shop spelling (S10-R5). Limit forced to 0 when the request sends a term or limit and the resulting term is COD or Credit Hold (S10-R8). Never refuses (S10-N1). |
| `POST /api/v1/vendors` | Default **COD** instead of `'net_30'` (v4 S10-R7). Shop spelling. |
| `PATCH /api/v1/vendors/{id}` | Shop spelling. |

## 6. Implementation Phases

Phases are ordered by dependency. Phase 1 must land first. After it, Phases 2, 3 and 4 are independent of each other. Phase 7 needs Phase 3 (`CreditTermDueDateCalculator::ruleFor`). Phase 4 must precede Phase 5, because the move needs the log recorder. Phase 6 must ship its BE part before or with its FE part (see the Phase 6 note).


### Cross-cutting UI rules (every FE phase)

- **Exact copy:** every user-facing string comes from **Appendix A**, verbatim.
- **Long names never clip** (S1-R15, S2-R12, S4-R23, S5-R14, S6-R6, S12-R8). Check each surface in the browser walk with a 31-character term name and a long customer name:

  | Surface | What to do |
  |---|---|
  | Table | Never use `no-wrap` or `.table-column-limited-width` |
  | Toasts | `.q-notification` is 400px and already wraps |
  | Move list | `q-checkbox` labels wrap; `q-virtual-scroll` handles variable row heights |
  | "Move To" and the term dropdowns, options | `q-item-label` with no `lines` prop already wraps |
  | Customer and vendor `q-select` **selected value**, incl. "(Inactive)" | Quasar may ellipsize it. Add a scoped `white-space: normal` override on these selects if the browser walk shows clipping. |
  | Customer and vendor cards | Value divs already wrap |
  | `AuditLogDialog` Event/User/Details | Already `white-space: normal`. Don't copy `.audit-log-line`'s ellipsis rule. |
  | Modal titles | Already wrap |
  | Buttons | Ellipsize app-wide (`.q-btn`), so a term name never goes in a button label |

---

### Phase 1: Foundation: aggregate, schema, seeding, list endpoint, shared helpers
**Implements:** S11-R1, S11-R3, S11-R12, S11-E1, S11-R2, S11-N1; NFR-3 (schema); E1 (the list the later phases read); the pure FE helpers
**Depends on:** nothing. Branch from current `develop` (SV-11571 is already there).

#### Database changes
| Migration | Description |
|---|---|
| `api/migrations/Version2026MMDD000001.php` | M1 `credit_term` |
| `api/migrations/Version2026MMDD000002.php` | M2 `company` and `part_vendor` indexes |
| `api/migrations/Version2026MMDD000003.php` | M3 `invoice` index (on its own) |

#### Backend changes (`api/`)
| File | Action | Description |
|---|---|---|
| `src/Organization/Finance/CreditTerms/Domain/Model/{CreditTerm,CreditTermName,CreditTermRule,CreditTermRuleType,CreditTermHolders,CreditTermLogEvent}.php` | Create | The aggregate and VOs (below) |
| `.../Domain/Repository/{CreditTermRepository,CreditTermCatalog,CreditTermHolderCounter}.php` | Create | Ports. `findById` is org-scoped. `CreditTermCatalog::forOrganization(Uuid)` returns active + inactive terms keyed by `nameKey`, plus `defaultTerm()`. An org with **no rows** (pre-release, D28) gets the 12 constants with COD as default. This fallback serves only id-less readers; E1 seeds the org first. It memoizes per request and implements `ResetInterface`. |
| `.../Domain/Service/{CreditTermDefaultSwitcher,CreditTermDueDateCalculator}.php` | Create | Default switch under `SELECT … FOR UPDATE` on the current default, with a flush between the clear and the set (unique key). The calculator is in Phase 3. |
| `.../Domain/Error/*.php` | Create | One error per PRD string |
| `.../Infrastructure/Persistence/Repository/Doctrine/{DoctrineCreditTermRepository,CreditTerm.orm.xml,CreditTermRule.orm.xml}` | Create | |
| `.../Infrastructure/Persistence/Query/Dbal/{DbalCreditTermCatalog,DbalCreditTermHolderCounter}.php` | Create | `GROUP BY credit_term` on the new indexes, folded in PHP by `nameKey`; blank → COD; `is_system_default = 0` |
| `.../Application/Service/{StandardCreditTermSeeder,CreditTermOrdering,CreditTermRuleText,CreditTermNameResolver}.php` | Create | S1-R5 ordering, S1-R7 text, shop spelling/default resolution |
| `.../Application/EventListener/SeedCreditTermsOnOrganizationRegisteredListener.php` | Create | `IntegrationEventSubscriber` on `App\Organization\OrganizationDetails\Application\Register\OrganizationRegistered`, the same hook as `PaymentMethods/Domain/IntegrationEvent/CreateDefaultPaymentMethod.php`; default Due on Receipt |
| `.../UI/CLI/SeedStandardCreditTermsCommand.php` | Create | G1 |
| `.../UI/HTTP/ListCreditTerms/{ListCreditTermsController,DTO/ListCreditTermsRequestDto}.php` + `Application/Query/CreditTerm/ListCreditTermsQuery*` + `Infrastructure/Persistence/Query/Dbal/DbalCreditTermListQuery.php` | Create | E1 (G2) |
| `src/Shared/Domain/ValueObject/CreditTerms.php` | Modify | Add public `nameKey(?string): string`: strip `[\pZ\s\x{FEFF}]+`, then lowercase. Keep the "keep the two in step" docblock. |
| `config/packages/doctrine.yaml`, `ExpressionIndexFilteringMySQLSchemaManager.php`, `Company.orm.xml`, `Vendor.orm.xml`, `Invoice.orm.xml` | Modify | Mapping registration, FK whitelist, index declarations |

#### Frontend changes (`app/`)
| File | Action | Description |
|---|---|---|
| `app/src/api/credit-terms/{index,keys,queries,CreditTermsModel}.ts` | Create | `creditTermsApi`; `creditTermsKeys = { all, list, usage, holders(id), customers(id) }`; `useCreditTermsQuery`, `useCreditTermUsageQuery` (`staleTime: 0`), `useCreditTermHoldersQuery(id, enabled)`, `useCreditTermCustomersQuery(id, enabled)` (`gcTime: 0`). Mutations are added in later phases; each invalidates `creditTermsKeys.all` (moves also invalidate `companyKeys.all`). |
| `app/src/api/index.ts` | Modify | `export * from './credit-terms'` |
| `app/src/testing/handlers.ts` | Modify | **Mandatory.** A default `GET */organizations/finance/credit-terms` handler returning the 12 standard rows with COD as default. MSW runs with `onUnhandledRequest: 'error'` (`src/testing/setup.ts:131`), so every spec rendering a consumer would fail without it. |
| `app/src/constants/ts/creditTerms.ts` | Modify | Keep the 12 constants (the S5-E3 fallback) and the existing helpers. Add `toCreditTermMatchKey`, `findCreditTerm`, `ordinal`, `creditTermRuleText`, `compareCreditTerms` (S1-R5), `buildCreditTermOptions(terms, selectedRaw, { markDefault })` (inactive suffix, unknown text, odd spelling), `creditTermDisplayName`, `isZeroLimitTerm`, `isOverCreditLimit` (D6), and `creditTermDueDate(createdOnIso, raw, terms, tz)`, which resolves through the org list **first** (S3-E1) and otherwise follows today's logic (S7-N1). |
| `app/src/utils/helpers.ts` | Modify | Add `dayOfFollowingMonthInLocationTz` next to `addDaysInLocationTz` (:885), reusing `WALL_CLOCK` (:769) and `fromLocationWallClock` (:788). Add `formatMonthDayInTz` ("Oct 21"). Check for an import cycle with `creditTerms.ts`. |

#### Key code changes
```php
// src/Organization/Finance/CreditTerms/Domain/Model/CreditTerm.php — invariants live here
public function edit(CreditTermName $name, CreditTermRule $rule, int $expectedVersion, CreditTermHolders $holders): ?CreditTermEdit
{
    if ($this->isStandard) { throw new StandardCreditTermLockedError(); }
    if (!$this->isActive) { throw new InactiveCreditTermEditError(); }          // "Reactivate this term to edit it."
    if ($holders->isInUse()) { throw CreditTermInUseError::for($holders); }       // "Used by {holders}. Deactivate it instead…"
    if ($expectedVersion !== $this->version) { throw new CreditTermChangedError(); } // "Someone else changed this credit term. Reload the page and try again."
    // set name, nameKey = CreditTerms::nameKey(name), rule; return the diff, or null when nothing changed (no log row, S12-R7)
}
public function allowsCreditLimit(): bool { return !\in_array($this->rule->type, [CreditTermRuleType::Cod, CreditTermRuleType::CreditHold], true); }
```

#### Unit / Integration tests
- **Unit:**
  - `tests/Unit/Organization/Finance/CreditTerms/Domain/Model/CreditTermTest.php`: every invariant and its exact string.
  - `CreditTermNameTest`, `CreditTermRuleTest`, and `CreditTermHoldersTest` (pluralization: "1 customer and 2 vendors", "12 customers, 3 vendors and 40 invoices", "5 invoices").
  - `CreditTermDefaultSwitcherTest`, `CreditTermOrderingTest`, `CreditTermRuleTextTest`.
  - `tests/Unit/Shared/Domain/ValueObject/CreditTermsTest` gets `nameKey` vectors shared with TS.
- **Functional:**
  - The seeder is idempotent and keeps an existing Due on Receipt default.
  - The unique `name_key` and default-marker constraints hold.
  - Holder counts fold "NET 30", "Net30" and blank → COD, and exclude Counter Sale.
  - The catalog falls back for an unseeded org.
  - E1 is reachable with authentication only and is tenant-isolated (org A can't see org B).
- **FE:** `src/constants/ts/tests/creditTerms.spec.ts` (all new helpers, including `isOverCreditLimit` and `buildCreditTermOptions` matrices) and `src/utils/tests/helpers.spec.ts` (the shared date vectors, listed under Phase 3's tests).

#### Verification (Definition of Done gates)
- **Static (scoped):** BE `cs-fix` + `phpstan` (files; clear the result cache first) + `pest`; FE `eslint` + `vitest run --maxWorkers=2` + `vue-tsc`.
- **Migration gate:** `doctrine:migrations:migrate`, then `doctrine:migrations:diff --allow-empty-diff` → "No changes detected". Then run `app:credit-terms:seed-standard` locally and re-run it to prove idempotency.
- **Smoke:** `bin/smoke-test.sh`, no 500s; add E1 to the curated list.

#### E2E tests (e2e/)
- None. Phase 1 adds no user-visible UI. A Phase-only PR needs the override marker ("coverage lands with Phases 4/6").

---

### Phase 2: Over Credit warning + Name-field validation fixes
**Implements:** S9-R1, S9-R2, S9-R3, S9-R4, S9-N1, S9-N2, S9-E1, S9-E2, S11-R8; S5-R10, S6-R5, S11-R6, S11-R7
**Depends on:** Phase 1 (the FE helpers)

#### Backend changes (`api/`)
| File | Action | Description |
|---|---|---|
| `src/Shared/Domain/ValueObject/CreditStanding.php` | Create | `isOverLimit()` = `limit > 0 && balance > limit && !in_array(CreditTerms::normalize($term ?: COD), [COD, DUE_ON_RECEIPT, CREDIT_HOLD])`. An own term or unknown text counts as Net (S9-E1). |
| `src/VehicleService/WorkOrders/Application/View/ViewDetails/WorkOrderDetails.php` | Modify | `getIsOverLimit()` (:1273) delegates to `CreditStanding`; work orders and part sales share it |
| `src/Customer/Customers/Domain/CustomerAccount/CustomerAccount.php` | Modify | Delete the dead `isOverLimit()` (:257); it has no production callers and the wrong rule. Also remove its cases in `tests/Unit/.../CustomerAccountTest.php` (:134, :141, :148). |

#### Frontend changes (`app/`)
| File | Action | Description |
|---|---|---|
| `app/src/components/work-orders/ts/WorkOrderDialog.vue` | Modify | :550-557 becomes `isOverCreditLimit({ balance, creditLimit: credit_limit, creditTerm: credit_term }) && !forceCreate`. The Credit Hold branch (:545) and the wording are unchanged. |
| `app/src/components/shared/OrderStatusCard.vue`, `app/src/components/ts/shared/OrderStatusCardMobile.vue` | Modify | Badge `v-if="workOrder?.is_over_limit && isOverCreditLimit(...)"`. Add `data-test-id="badge_over_limit"` and `badge_credit_hold`. |
| `app/src/components/ts/customers/CustomerDialog.vue` | Modify | Name `Input` (:13-25): `:lazy-rules="hasTypedName ? true : 'ondemand'"` and `@update:model-value="hasTypedName = true"`, reset on open (watch at :930). Give the four `CurrencyInput`s distinct suffixes: `customer_credit_limit`, `customer_shop_supplies`, `customer_shop_supplies_min`, `customer_shop_supplies_max`. |
| `app/src/components/ts/parts/dialogs/VendorDialog.vue` | Modify | The same Name fix (:14-24), reset in `useFormDialog`'s `onOpen` (add one if it's missing) |

#### Unit / Integration tests
- **BE:** a `CreditStandingTest` matrix covering blank / 0 / null limit × COD / Due on Receipt / Credit Hold / blank term / own term / Net 30 / unknown text; a `WorkOrderDetails` test.
- **FE:**
  - `WorkOrderDialog.spec.ts`: COD over its limit → no `dialog_customer_warning`; Net 30 with limit 100 and balance 150 → shown; limit 0 → not shown.
  - `OrderStatusCard.spec.ts` and `OrderStatusCardMobile.spec.ts`.
  - `CustomerDialog.spec.ts` and `VendorDialog.spec.ts`: open the dialog, click another field → no "… is a required field"; type, clear and blur → error; submit empty → error.

#### Verification
- **Static:** scoped BE + FE.
- **Smoke:** no 500s.
- **Compile:** OK.
- **Browser-walk** (`admin`): open a New Work Order for a COD customer with a balance → no confirmation and no "Over limit" badge. A Net 30 customer over a positive limit → both show. Open New Customer and New Vendor and click Phone → no Name error.

#### E2E tests (e2e/)
- None new in this run. Over Credit is Backlog #3; the rule is owned by `CreditStandingTest` and `WorkOrderDialog.spec.ts`. Run the reference scan. A Phase-only PR needs the override marker.

---

### Phase 3: Due dates
**Implements:** S7-R1, S7-R2, S7-R3, S7-R4, S7-R5, S7-R6, S7-R6a, S7-R6b, S7-R7, S7-R8, S7-R9, S7-R10, S7-R11, S7-N1, S7-E1, S7-E2, S7-E3, S7-E4, S11-R13, S11-R14
**Depends on:** Phase 1

#### Backend changes (`api/`)
| File | Action | Description |
|---|---|---|
| `src/Organization/Finance/CreditTerms/Domain/Service/CreditTermDueDateCalculator.php` | Create | `dueDate(Uuid $orgId, \DateTime $invoiceDate, ?string $term, ?\DateTimeZone $tz)`: an **own** term follows its rule; standard terms and unknown text go through the unchanged `CreditTerms::getDueDate()` path, which guarantees no regression on SV-11571. Also `ruleFor()` for QuickBooks. The org id is explicit, taken from the record, not the decorator, so the calculator works in workers. |
| `src/Invoicing/Invoice/Application/HTTP/Builder/InvoiceBuilder.php` | Modify | `getDueDate()` (:690-697) goes through the calculator (company org, existing `getInvoiceTimezone()`) |
| `src/Invoicing/Invoice/Domain/Service/InvoiceViewDetailsProvider.php` | Modify | The fallback (:141-146) uses the calculator with the invoice workplace's time zone |
| `src/Inventory/Orders/Application/Handler/AcceptDelivery/AcceptDeliveryCommandHandler.php` (:199-206), `src/Inventory/Deliveries/Domain/RequestedPartsReceived.php` (:219-226), `src/Inventory/Deliveries/Domain/Service/DeliveryModifier.php` (:155-165), `src/PartsCatalogue/Vendors/Domain/VendorTransaction/CreateTransactionWhenDeliveryIsCreated.php` (:43-50) | Modify | Use the calculator; the time zone is already passed |
| `src/Reporting/Dashboard/Infrastructure/Doctrine/AccountReceivable/Service/DbalAccountReceivableCustomerFetcher.php` (:92-98) + `src/Reporting/Dashboard/Application/AccountReceivable/Service/AccountReceivableCustomerService.php` (:73) | Modify | Select `wp.timezone`; recalculate on the invoice's location (S11-R14); an invalid or null zone → UTC |
| `src/Customer/Customers/Application/CustomerTransaction/StatementPdf/StatementPdfQueryHandler.php` (:602-607), `.../ListUnpaidTransactions/ListUnpaidTransactionsQueryHandler.php` (:597-602) | Modify | `LEFT JOIN workplace` on the credit memo's `workplace_id` (sentinel ids → UTC); calculator |
| `src/Reporting/Export/Application/VendorBillExport/VendorBillExportQueryHandler.php` (:35-55, :103) | Modify | Select `d.due_date` + the delivery workplace's time zone; print the stored date (`m-d-Y`), blank when NULL; drop `CreditTerms::getDueDate()` (S7-R11). No backfill (Q-D1). |
| `src/PartsCatalogue/Vendors/Domain/VendorTransaction/Service/VendorTransactionModifier.php` (:49-124), `.../VendorTransaction/VendorTransaction.php` (:122-134) | Modify | **v4 S7-R9 (A/P aging):** pass the delivery's recalculated due date into `VendorTransaction::change(…, ?\DateTime $dueDate)`, and extract the "due equals invoice date → NULL" rule (`CreateTransactionWhenDeliveryIsCreated.php:51-53`) into one shared helper. Write the failing test first. |

#### Frontend changes (`app/`)
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/billing/Invoice.vue` | Modify | The due-date branch (:1915-1935) uses `creditTermDueDate(createdOn, customer.credit_term, creditTermsQuery.data, timeZone)`. Keep the SV-9087 and SV-11414 comments. This covers the S7-R8 invoice-date change preview. |

#### Key code changes
```php
// CreditTermRule::dueDate() — record's location calendar; null tz = UTC (S7-R6b)
$zone  = $tz ?? new \DateTimeZone('UTC');
$local = \DateTimeImmutable::createFromInterface($invoiceDate)->setTimezone($zone);
$due = match ($this->type) {
    CreditTermRuleType::NetDays => $local->add(new \DateInterval('P'.$this->days.'D')),            // wall-clock days, DST-safe (S7-R10)
    CreditTermRuleType::DayOfFollowingMonth => (function () use ($local) {
        $next = $local->modify('first day of next month');                                          // Dec → Jan (S7-R4)
        return $next->setDate((int) $next->format('Y'), (int) $next->format('n'), min($this->dayOfMonth, (int) $next->format('t'))); // S7-R3
    })(),
    default => $local,                                                                              // COD / DoR / Credit Hold (S7-R5)
};
return \DateTime::createFromImmutable($due->setTimezone($invoiceDate->getTimezone()));
```

#### Unit / Integration tests
- **Shared PHP + TS date vectors:**
  - Oct 5 on Net 30 → Nov 4; an own Net 10 → Oct 15.
  - Day 10: Oct 5 and Oct 28 → Nov 10.
  - Day 31 in October → Nov 30.
  - Day 30 or 31 in January → Feb 28 (2027) and Feb 29 (2028).
  - Day 31 in March → Apr 30.
  - Dec 15 2026 → Jan 10 2027.
  - `America/Edmonton` Oct 5 on the 10th → Nov 10.
  - Net 30 across the March and November DST changes.
  - A null time zone.
- **Characterization test** of the Vendor Bill Export **before** the change.
- **Per-site wiring tests:** an own day-of-month term changes the stored due date; standard Net 30 doesn't.
- **A/P aging:** a delivery edit updates `vendor_transaction.due_date`.

#### Verification
- **Static:** scoped.
- **Smoke:** no 500s.
- **Browser-walk** (`admin`): create an invoice for a customer on an own "10th of the following month" term (before Phase 4 ships, insert one own-term row into the **local** `credit_term` table for the admin org: `rule_type = 'day_of_following_month'`, `rule_day_of_month = 10`, `name_key` = `CreditTerms::nameKey(name)`; the unit and functional tests are the primary gate) → the invoice and preview show the PRD date. Change the invoice date → the date recalculates. Edit a delivery's invoice date → the A/P aging due date matches. Run the Vendor Bill Export → it shows stored dates.

#### E2E tests (e2e/)
- Unblocks the date part of C-NEW-4, which runs once Phases 4 and 6 have landed. Re-run C45270, C2462–C2464, C44501, C44239 and C44502 as regression checks: they use standard terms and should be unchanged.

---

### Phase 4: Credit Terms page, row actions, term dialog, audit log
**Implements:** S1-R1 … S1-R17, S1-N1, S1-N2, S1-N3, S1-E1, S1-E2, S1-E3; S2-R1 … S2-R12, S2-N1 … S2-N6, S2-E1, S2-E2, S2-E3; S3-R1 … S3-R16, S3-N1, S3-N2, S3-N3, S3-E1, S3-E2; S12-R1 … S12-R8, S12-N1, S12-N2, S12-N3, S12-E1, S12-E2; S11-R4, S11-R9, S11-E2; S8-R7, S8-N2 (the module never calls QuickBooks)
**Depends on:** Phase 1

#### Backend changes (`api/`)
| File | Action | Description |
|---|---|---|
| `src/Organization/Finance/CreditTerms/UI/HTTP/{CreateCreditTerm,ChangeCreditTerm,MakeDefaultCreditTerm,DeactivateCreditTerm,ReactivateCreditTerm,DeleteCreditTerm,GetCreditTermHolders,GetCreditTermUsage,ListCreditTermLog}/{*Controller.php,DTO/*RequestDto.php}` | Create | E1b–E8, E11 |
| `.../Application/{Command,Query,Handler}/CreditTerm/*` + `Application/DTO/CreditTerm/*Dto.php` | Create | Each handler runs: transaction → load (org-scoped) → aggregate method → save → log (only on a real change) → commit. A `UniqueConstraintViolationException` → "A term called {name} already exists." |
| `.../Application/Service/{CreditTermLogRecorder,CreditTermLogRenderer}.php` | Create | The recorder builds an `EntityEventDto(entityId: orgId, entityType: CREDIT_TERMS, eventType, workplaceId, payload)` → `EntityEventRecorder`. Payloads are structured (`DefaultSerializer`): name and rule for term events, before/after for edits, from/to for the default, from/to/count/limitsCleared for moves. The renderer produces the S12-R3 Event and Details text with `CreditTermRuleText`. |
| `.../Infrastructure/Persistence/Query/Dbal/DbalCreditTermLogQuery.php` | Create | `entity_event` `WHERE entity_type='credit_terms' AND entity_id=:org`, `OrganizationDecorator` on `ee.organization_id`, **LEFT JOIN** `user` (a deleted user doesn't hide history), `ORDER BY occurred_at DESC, id DESC`. Uses the existing index `ee__organization_id_entity_type_entity_id_occurred_at_id_idx`. Search (S12-R5) runs server-side after rendering, as a case-insensitive substring over Event, User and Details, chunked like `WorkOrderHistoryResolver::searchPage()`; the volume is tiny. |
| `src/EntityEvent/Domain/EntityEventType.php` | Modify | Add `CREDIT_TERMS = 'credit_terms'` and its `getLabel` case |
| `src/Sales/CreditTerms/` | Delete | The orphan endpoint |

#### Frontend changes (`app/`)
| File | Action | Description |
|---|---|---|
| `app/src/router/routes.ts` (~:1142) | Modify | `{ path: 'credit-terms', name: 'CreditTerms', component: EmptyTabView, meta: { requiredPermissions: ['settingsFinance'], title: 'Credit Terms' } }`. A direct URL silently redirects to the first permitted route (S1-N1). |
| `app/src/pages/Administration.vue` | Modify | Async import, `componentMap`, `routeNameToTab`, and a `components[]` entry after Payment Methods |
| `app/src/components/ts/administration/AdminLeftMenuNav.vue` (~:306-322) | Modify | A `q-route-tab` immediately after Payment Methods inside the `settingsFinance` group, `data-test-id="link_credit_terms_tab"`, **no `exact`** (S1-R1) |
| `app/src/components/ts/administration/credit-terms/CreditTerms.vue` | Create | Page shell; header with the "New Credit Term" `Button` and a "⋯" page menu holding "Audit Log" (S1-R2, S12-R1); inline error **above the tabs**, copied from `Staff.vue:60-66` ("Something went wrong loading credit terms. Please try again."); counted tabs copied from `Staff.vue:69-92` (no counts while loading, S1-E3); "No inactive terms" (S1-N2); `subscribeToLocation(refetch)` (S1-R16) |
| `.../credit-terms/CreditTermsTable.vue` | Create | `<Table disable-virtual-scroll>` with columns Name / Due / Customers / Vendors / actions, all `sortOrder: 'ad'`; Due uses `compareCreditTerms` (S1-R5/R6); fixed widths on both tabs; no `no-wrap` (S1-R15); info and lock icons with tooltips (S1-R8/R9/R10); a "Default" badge (S1-R11) |
| `.../credit-terms/CreditTermRowMenu.vue` + `creditTermMenu.ts` | Create | `buildCreditTermMenuItems(term, ctx)` returns items in the S2-R1 order with blocked reasons. Each `q-item` uses `:disable` + `v-close-popup="!item.blockedReason"` + a guard in the handler (S2-N6). The holders query is enabled only while the menu is open and the term is `in_use` (S1-R17, D16). `canMoveCustomers = canEdit('customers') && seeApArData()`. |
| `.../credit-terms/useCreditTermActions.ts` | Create | Make Default via a `BaseDialog` + `:async-confirm` (title "Make {name} the default?"); Delete via a `BaseDialog` with `confirm-button-text="Delete Credit Term"` and `color="negative"` (**not** `DeleteDialog` / `DialogType 'credit-term'`, which means "credit hold"); Deactivate and Reactivate through `useAsyncAction`. Each menu item carries an optional `hoverText` shown when it isn't blocked: Deactivate → "Hide from customer and vendor pickers", Reactivate → "Show in pickers again" (S2-R3). The Delete `BaseDialog` also uses `:async-confirm`, so it is disabled while saving and **stays open when refused** (S2-R9, S2-R11). The success toasts get the boot-default Close action (S2-R6; don't pass `ignoreDefaults`). toasts via `showSuccessNotification({ message, caption, testId })` with the exact S2 copy |
| `.../credit-terms/CreditTermDialog.vue` | Create | `BaseFormDialog` + `useFormDialog`, left `persistent` (S3-R15). Name has `maxlength=31`, the hint, and the `hasTypedName` lazy rule (S3-R10). Two radios; each number box sits in a `<div @click="chooseKind">` (S3-R4) with `:lazy-rules="false"` (S3-R11). The blue explanation line uses today's date on the current location's calendar, resolved the same way `Invoice.vue:1848-1861` does it (S3-R5/R16). `isFormValid` is a pure function (S3-R6). The name is trimmed and collapsed (S3-R12). `version` is sent on edit. |
| `.../credit-terms/CreditTermsModel.ts` | Create | Component-local types |
| `app/src/components/work-orders/history/AuditLogDialog.vue` | Modify | `subject?: 'workOrder' \| 'partSale' \| 'creditTerms'`; row union type plus an `in`-narrowing guard; hide the snapshot and Line `<q-td>`s for credit terms; render `details` lines through the plain-value branch. The WO and Part Sale behavior must stay identical. |
| `app/src/api/credit-terms/*` | Modify | Mutations: create, change, make-default, deactivate, reactivate, delete; `fetchLog(params, config)` |

The log mounts in `CreditTerms.vue` like this: `<AuditLogDialog subject="creditTerms" title="Credit Terms Log" :fetch-logs …>`. Error handling is copied from `PartSale.vue:577-615`: `handlesFailureLocally`, the sentence "Something went wrong loading the Credit Terms Log. Please try again." as `noDataLabel` plus the same sentence as an error toast, reset to "No history here. Yet." on each call (S12-E1).

#### Unit / Integration tests
- **BE, functional per endpoint:**
  - 403 without the FIN atom on E1b–E8 and E11.
  - Cross-org id → 404.
  - S3-E2 race mapped to the duplicate-name error.
  - Stale version refused.
  - A no-op make-default writes no log row (S12-R7).
  - Ordering.
  - Renderer strings for every S12-R3 row, including singular and plural moves.
  - A deleted term's earlier rows stay (S12-E2).
- **FE:**
  - `CreditTerms.spec.ts`: order, counts, loading, empty and error states, Default tag, icons, location refetch.
  - `creditTermMenu.spec.ts`: the full S2-R1 matrix.
  - `CreditTermRowMenu.spec.ts`: a blocked click keeps the menu open and emits nothing; holders are fetched only when open and in use.
  - `CreditTermDialog.spec.ts`: validation timing, standard and duplicate names, editing keeps its own name valid, 0 → 25 clears without blur, the disabled-box switch, the explanation line via `vi.setSystemTime`, trimming, a double click posts once, a 409 keeps the dialog open.
  - `AuditLogDialog.spec.ts`: the credit-terms subject; **existing WO and Part Sale cases stay green**.
  - `Administration.spec.ts`.

#### Verification
- **Static:** scoped.
- **Smoke:** no 500s.
- **Compile:** OK.
- **Browser-walk:**
  - As `admin` at `/administration/credit-terms`: list, tabs, sort cycle; create "Net 10" and "10th of next month"; edit and delete an unused term; make Net 10 the default; try to deactivate it (refused with the reason); deactivate Net 30; reactivate it; refuse an edit of an in-use term ("Used by …" appears on hover); open the Audit Log.
  - As `tech`: no nav item, and the direct URL redirects.
  - **Regression:** open a WO Log and a Part Sale Log.

#### E2E tests (e2e/)
- The C26448/C26451 update. Add the D27 test ids. Build the credit-term factory, page object and dialog objects. C-NEW-1 and C-NEW-5 run once Phase 6 has landed. Regression: the WO and Part Sale log specs (§7).


> **Ship note:** in Phase 4 the "Move Customers" row item is built with its blocked states, but its dialog only arrives in Phase 5. Ship Phases 4 and 5 in the same PR, or keep the item out of the menu until Phase 5 lands.

---

### Phase 5: Move Customers
**Implements:** S4-R1 … S4-R24, S4-N1, S4-N2, S4-N3, S4-E1, S4-E2, S4-E3, S4-E4; S11-R17; S12-E3; S8-R6 (no QuickBooks update); NFR-2, NFR-5
**Depends on:** Phase 4 (the log recorder and the page)

#### Backend changes (`api/`)
| File | Action | Description |
|---|---|---|
| `src/Organization/Finance/CreditTerms/UI/HTTP/{ListCreditTermCustomers,MoveCustomers}/…` + `UI/HTTP/MoveCustomers/Constraint/{CustomersBelongToOrganization,CustomersBelongToOrganizationValidator}.php` | Create | E9, E10. The validator counts `company` rows `WHERE organization_id = :org AND is_system_default = 0 AND id IN (chunk of 1,000)`. A mismatch rejects the whole request (D22). That includes a ticked customer that was **hard-deleted** meanwhile, which is a deliberate, narrow deviation from S4-E1's "left alone" (**D32**). |
| `.../Application/{Query,Command,Handler}/CreditTerm/{ListCreditTermCustomers*,MoveCustomers*}.php` | Create | |
| `.../Domain/Repository/CustomerCreditTermMover.php` + `Infrastructure/Persistence/Query/Dbal/{DbalCustomerCreditTermMover,DbalCreditTermCustomerList}.php` | Create | The set-based write (below) and the slim id + name list on the 4-column `company` index |
| `.../Application/Service/MovedCustomerNoteComposer.php` | Create | "Credit term changed from {old} to {new} by {user name} (Move Customers)." A blank source reads "COD". Appends " Credit limit {$x,xxx.xx} → $0." only when the old limit was > 0 (S4-R11/R20). |
| `.../Application/Messenger/{RecordMovedCustomersForAccountingJob,RecordMovedCustomersForAccountingJobHandler}.php` | Create | D15 / NFR-5 |

**Move transaction** (one `Transactional`, all-or-nothing):
1. Re-validate the target: active and ≠ the source. Otherwise "Pick an active term other than {from}."
2. Sort the ids. For each 1,000-id chunk, in id order: `SELECT id, credit_term FROM company WHERE organization_id=:org AND is_system_default=0 AND id IN (…) FOR UPDATE`. The deterministic lock order prevents deadlocks.
3. In PHP, keep the rows whose `nameKey(credit_term)` equals the source's, or that are blank when the source is COD (S4-E1). If none remain: "Pick at least one customer to move."
4. Guarded `UPDATE company SET credit_term=:to, updated_at=:now, updated_by=:user WHERE organization_id=:org AND id IN (…) AND credit_term IN (:observedSpellings) AND is_system_default=0`. **Stamp `updated_at` and `updated_by`**: the Public API `updated_since` feed reads them, and a raw write bypasses `AuditStampListener`. `moved_count` = Σ affected rows (S12-E3).
5. Target COD or Credit Hold only: `SELECT customer_id, credit_limit FROM customer_account WHERE customer_id IN (…) FOR UPDATE`, then `UPDATE customer_account SET credit_limit=0, version=version+1, updated_at, updated_by …` (S4-R16). The `version` bump keeps Doctrine's optimistic lock honest.
6. Multi-row `INSERT INTO communication_note` in batches of 500 rows: type `customer`, `reference_id` = the company id, source `USER`, author = the acting user, `CustomerMetadata`, `customer_visible = 0`, no mentions. No `NoteCreatedEvent` and no notifications. The column values must equal what `Note::create(…)` writes; a test pins this.
7. `CreditTermLogRecorder::customersMoved(...)`, plus `entity_event_ref` rows (`ref_type='customer'`) for the moved ids, via DBAL in chunks of 500.
8. Commit. **After the commit**, and only when `AccountingEventRecorder::isRecording(AccountingEventType::CustomerUpdated)` is true: dispatch one `RecordMovedCustomersForAccountingJob {organizationId, entityEventId, initiatedByUserId}`. The ids are passed by reference: 11k UUIDs is about 425 KB, more than the classic SQS message limit. A dispatch failure is logged at error level with the event id and doesn't fail the response.
9. The job handler runs inside `OrganizationDecorator::runAs`, reads the refs scoped to the org, and in chunks of 200 (one transaction each) calls `accountingEventRecorder->record(CustomerUpdated, customerUpdatedPayloadBuilder->build($company))`, then `EntityManager::clear()`. The payload is a full-state upsert, so the job is idempotent.

Estimated CPU for 11,185 customers is about 1–3 s, with about 5–15 s of DB wall time holding row locks (Risk R4). No ORM hydration happens on the request path.

#### Frontend changes (`app/`)
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/administration/credit-terms/MoveCustomersDialog.vue` | Create | Shell: `BaseFormDialog` with title "Move Customers from {term}" (wraps), `persistent` (S4-R22), `:async-submit` and `:auto-close-on-confirm="false"`. **Search:** an always-visible `Input` with `@keydown.enter.prevent` (S4-R5; Enter must not submit the `q-form`). **List:** `q-virtual-scroll` with `q-checkbox` rows, all ticked on load (S4-R4, S4-R13); "No customers match your search." on no match. **Select All / Select None** add or remove only the current matches and never clear the search (S4-R6). **Move To:** `Select`, active terms except the source, sorted by `compareCreditTerms`, prefilled with the default plus the hint, or empty when the source is the default (S4-R7). **$0 line** under it (S4-R10). **Confirm:** "Move {n} Customers" or "Move 1 Customer", disabled while invalid (S4-R8). A COD or Credit Hold target opens a red `BaseDialog` confirmation with `:async-confirm` (disabled while saving, S4-R21), and its Cancel keeps all state (S4-R14/R15). The toast uses the **response** `moved_count` (S4-R9, S4-E1). State resets on open, not on hide. |
| `app/src/api/credit-terms/*` | Modify | `useMoveCustomersMutation`, which invalidates `creditTermsKeys.all` and `companyKeys.all` |

#### Unit / Integration tests
- **BE:**
  - Note text, singular and plural, money formatting.
  - All-or-nothing on an injected failure.
  - S4-E1 skip and count.
  - Target inactive or equal to the source.
  - A foreign or Counter Sale id rejects the whole request.
  - A COD or Credit Hold target zeroes limits and bumps the version.
  - `updated_at` and `updated_by` stamped.
  - Batch note row equals an ORM row.
  - Refs written.
  - The job handler reads only refs scoped to its org.
- **Perf check:** seed 11,185 customers on a throwaway local MySQL (the test env is SQLite). The move completes well under 30 s of CPU, and the E9 list for 2,000 customers returns in under 1 s.
- **FE (`MoveCustomersDialog.spec.ts`):** all ticked initially; search; Select All and None on matches only; Enter posts nothing; prefill and hint; empty when the source is the default; the $0 line; the COD confirmation and its Cancel; a Net target needs no confirmation; the toast uses `moved_count`; labels.

#### Verification
- **Static:** scoped.
- **Smoke:** no 500s.
- **Browser-walk** (`admin`):
  - Move some Due on Receipt customers to Net 30: the counts update and a customer's Notes show the note.
  - Move to COD: the red confirmation appears and limits become $0 with the previous limit in the note; check the Credit Terms Log row.
  - Check that the AccountingHub job ran (worker logs) for an org with the accounting flag.
  - As a user with Settings → Finance but without Customers Create & Edit: Move Customers is greyed with the reason.

#### E2E tests (e2e/)
- C-NEW-2 and C-NEW-3 (`move-customers.spec.ts`), plus `move-customers.dialog.ts`.

---

### Phase 6: New Customer, vendors, imports, Public API, printed invoices
**Implements:**
- S5-R1 … S5-R9, S5-R11 … S5-R15, S5-N1 … S5-N4, S5-E1, S5-E2, S5-E3 (S5-R10 is Phase 2)
- S6-R1 … S6-R6, S6-N1, S6-N2, S6-E1, S6-E2
- S10-R1 … S10-R8, S10-N1, S10-N2, S10-E1, S10-E2, S10-E3
- S11-R2, S11-R5, S11-R10, S11-R11, S11-R16, S11-N2
- NFR-6, NFR-7

**Depends on:** Phase 1. Phase 4 must be done for the "(Inactive)" display to mean anything.

> ⚠️ **Ship order inside this phase:** the frontend **already posts** `credit_term` and `credit_limit` on customer create, and the backend silently drops them today. The BE part must land with or before the FE "fields on New Customer" part, and the FE create-mode payload must be correct (default prefilled, AR/AP-gated) before the BE starts honoring the fields.

#### Backend changes (`api/`)
| File | Action | Description |
|---|---|---|
| `src/Customer/Customers/UI/HTTP/Create/{CreateCustomerController,DTO/CreateCustomerRequestDto}.php` | Create | Same path and route name. **D26:** the wire contract is frozen; the DTO binds every key today's FE and E2E factory send, returns `data.id`, and a functional test posts the exact payload. `canManageCredit = isGranted(AR_VIEW) \|\| isGranted(AP_VIEW)`. Keeps the existing gate (`CUSTOMER_CREATE_AND_EDIT or WORK_ORDER_CREATE_AND_EDIT`). |
| `src/Customer/Customers/Application/Create/{CreateCommand,CreateCommandHandler}.php` | Modify | The command becomes pure, with `creditTerm`, `creditLimitCents` and `canManageCredit`. **Rules:** the default term via `CreditTermNameResolver` (S5-R2, S5-N4); an active term is required ("Pick an active credit term."); COD or Credit Hold with a limit > 0 is refused. The limit is set on the `CustomerAccount` created by `CreateAccountWhenCompanyIsCreated`. Verify the account is findable in the same unit of work; otherwise carry the initial limit on `CompanyCreated`. Delete `Application/Create/CreateController.php`. |
| `src/Customer/Customers/Application/Change/{ChangeController,ChangeCommand,ChangeCommandHandler}.php` | Modify | **D25:** a blank `credit_term` keeps the stored term (never refused, never written blank). `canManageCredit` from the controller. Without it, `setCreditTerm` / `changeCreditLimit` aren't called (S5-N4). With it, the stored spelling is kept when the key is unchanged (S5-R7, S5-E2); otherwise an active term is required; COD or Credit Hold → limit 0 (S5-R9, S11-R16). |
| Vendor add and change handlers (`src/PartsCatalogue/Vendors/...`) | Modify | `toShopSpelling()` (S10-R3); new vendors stay on COD (S6-R2) |
| `src/Organization/DataImport/Application/ContactsImport/ImportCommandHandler.php` | Modify | **New customer** (:153): blank → the default (S10-R1), else the shop spelling; COD or Credit Hold → limit 0 (S10-R6). **Existing customer** (:190): `??` → `?:` (S10-E3), then the shop spelling. **v4 S10-E3:** a blank or missing limit cell **keeps** the stored limit (:213; today it zeroes it), and S10-R8 forces 0 when the result is COD or Credit Hold. The `(int) $x * 100` precision bug (:162-167, :213, which drops cents) stays **as today** (S10-E2); it's raised as a follow-up, not fixed here. Load the catalog once per import. |
| `.../Vendor/ImportVendorCommandHandler.php` (:243, :277) | Modify | Shop spelling only; blank stays COD (S10-N2) |
| `src/OpenApi/Customer/Application/{Create,Update}/*Controller.php` | Modify | S10-R2, S10-R5, S10-R8; never refuse (S10-N1) |
| `src/OpenApi/Vendor/Application/Create/CreateController.php` (:131), `.../Update/UpdateController.php` | Modify | **v4 S10-R7:** the default becomes `CreditTerms::COD` instead of `'net_30'`; shop spelling. Existing vendors are untouched. |
| `templates/invoices/legacy/invoice.html.twig` (:613), `templates/invoices/legacy/part-sale-invoice.html.twig` (:581), `templates/invoices/batch-invoice.html.twig` (:629) | Modify | **S5-R11 / D24:** drop `text-truncate` from the Terms `<td>` so a 31-character name wraps. Check that the modern `invoice.html.twig` (:2485) and `part-sale-invoice.html.twig` (:1849) `.ochip` render 31 characters unclipped. |

#### Frontend changes (`app/`)
| File | Action | Description |
|---|---|---|
| `app/src/components/ts/customers/CustomerDialog.vue` | Modify | **Fields on New Customer (S5-R1):** drop `editMode &&` at :90 and :124; both stay `col-6`, side by side at every width. **Options:** `buildCreditTermOptions(..., { markDefault: true })`, falling back to the constants (S5-E3). Keep the overridden `#option` slot but restore `option_customer_credit_term_<value>` test ids, render labels inside `q-item-label`, never a `<span>` (the scoped `span { text-transform: capitalize }` trap), and add the "Default" badge (S5-R3, S5-N3). **Prefill:** fill a blank term with the default once the list arrives; never overwrite (S5-R2, S5-E1). **Lock:** a wrapper `<div class="col-6 q-pt-md">` around `CurrencyInput :disable="isLimitLocked"` with a `q-tooltip` **on the wrapper**, plus a touch-only tap-to-reveal hint under the field (S5-R4, form-factor note). `changeCreditLimit()` then `syncDisplayFromModel()`. `setCompanyData()` runs `changeCreditLimit()` (S5-R9). **Create payload:** term and limit are sent only with `seeApArData()`. |
| `app/src/components/ts/parts/dialogs/VendorDialog.vue` | Modify | `buildCreditTermOptions(..., { markDefault: false })` with the default option slot, so `option_vendor_credit_term_<value>` stays (S6-R1, S6-R2, S6-R3, S6-N2) |
| `app/src/components/ts/customers/CustomerLeftSection.vue` (:64-73), `app/src/components/ts/parts/vendors/Vendor.vue` (:75-89) | Modify | `creditTermDisplayName(...)` adds "(Inactive)" (S5-R8, S6-R3), with `data-test-id="text_customer_credit_term"` / `text_vendor_credit_term`. In `Vendor.vue`, replace the touched static inline style with a scoped class. |

#### Unit / Integration tests
- **BE:**
  - Characterization tests first (Change, contacts import).
  - S5-N4 both ways; "Pick an active credit term."; the COD/Credit Hold refusal.
  - Import: `?:` and S10-E3 "keep the limit" as failing-first tests.
  - The Public API S10-R8 matrix; the vendor API defaults to COD.
  - Regression for Edit Customer without AR/AP: name, address, tax, labour type and notes still save.
- **FE (`CustomerDialog.spec.ts`):** fields appear only with `seeApArData`; default prefill (a late default fills a blank but never overwrites); COD → $0.00 disabled with the tooltip on the wrapper; switching to Net → editable at 0; editing a COD customer whose limit is 500 → shows 0 and posts 0; inactive and unknown selected values.
- **FE (other specs):** `VendorDialog.spec.ts`, `CustomerLeftSection.spec.ts`, `Vendor.spec.ts` ("(Inactive)").

#### Verification
- **Static:** scoped.
- **Smoke:** no 500s.
- **Browser-walk** (`admin`):
  - New Customer from `/customers`, from New Work Order and from New Part Sale (S5-R15), each prefilled with the default.
  - COD → limit locked.
  - Edit a customer on a deactivated term → "{name} (Inactive)" is selected; the card shows it.
  - Edit Vendor on an own term.
  - As `tech`: New Customer shows no credit fields.
  - Generate a **legacy** invoice and a **batch** invoice PDF for a customer on a 31-character term → printed in full.
  - Contacts import of a file with a blank limit cell → the stored limit is kept.

#### E2E tests (e2e/)
- Complete C-NEW-1, C-NEW-4 and C-NEW-5 (they need the New Customer fields and the own-term options).
- Reference updates: C44914 re-scope (D25), the `customerFactory.create` read-back (D26), `setPinnedNote` / `assignSalesRepToCustomer` sending 0 on COD or Credit Hold, and the canonical-path re-labels.

---

### Phase 7: QuickBooks term sync
**Implements:** S8-R1 … S8-R8, S8-N1, S8-E1, S8 error handling; NFR-4
**Depends on:** Phase 3 (`CreditTermDueDateCalculator::ruleFor`)

#### Database changes
| Migration | Description |
|---|---|
| `api/migrations/Version2026MMDD000004.php` | M4 `quickbooks_term_map` |

#### Backend changes (`api/`)
| File | Action | Description |
|---|---|---|
| `src/Bookkeeping/Domain/Service/Dto/TermDto.php` | Modify | Add `?int $dayOfMonthDue`, `?int $dueNextMonthDays` |
| `src/Bookkeeping/Domain/Service/EntityMap/QuickBooks/TermEntityMap.php` | Modify | Emit `{Name, DueDays}` **or** `{Name, DayOfMonthDue: X, DueNextMonthDays: 31}` (D5), never both; read both |
| `src/Bookkeeping/Domain/Service/Handler/QuickBooks/TermHandler.php` (:44-66) | Modify | Build the payload via `TermEntityMap`. Throw `QuickBooksDuplicateTermNameError` on QuickBooks' duplicate-name fault; pin the code in the sandbox (believed to be 6240, unverified). |
| `src/Bookkeeping/Application/Service/QuickBooksTermResolver.php` | Create | Replaces `ExternalCustomerResolver::getOrCreateTerm()` (:104-116) and `ExternalEntityResolver::resolveOrCreateTerm()` (:27-45). Steps: name and key (catalog match, else `externalTermName`) → **map hit returns with no QuickBooks call** → on a miss, `WaitingLock::acquire("qb-term:{realm}:{key}", 5)` → re-check the map → `getOneByName` → `create` (on a duplicate fault, re-query) → insert the map row (catch the unique violation) → release in `finally`. Legacy `DueDays` is clamped to 999 (QuickBooks' maximum; our clamp is 3650). |
| `src/Bookkeeping/Domain/QuickBooksTermMap/{QuickBooksTermMapping,QuickBooksTermMapRepositoryInterface}.php` + Infrastructure repository and mapping | Create | |
| `src/Bookkeeping/Application/Service/ExternalCustomerResolver.php`, `src/Bookkeeping/Application/BookkeepingVendorBill/Service/ExternalEntityResolver.php` | Modify | Delegate to the resolver |
| `BookkeepingService` | Modify | A realm-id accessor (reuse what `QuickBooksOptionsSync::realmId()` reads; unverified) |

Failures still land on QB Unexported through `InvoiceCreateSyncService`'s catch-all (:275-292). S8-R6 is already true today: the QuickBooks customer gets its term only at creation (`CompanyEntityMap.php:57-88`).

#### Unit / Integration tests
- Resolver: a map hit makes no QuickBooks call; a miss creates; a duplicate fault re-queries; the lock times out and falls through safely; the date-driven payload shape; `DueDays` clamped to 999.
- A `TermEntityMap` round-trip.
- QuickBooks Online behavior itself is checked in the OQ-3 sandbox ticket, not in CI.

#### Verification
- **Static:** scoped.
- **Migration gate.**
- **Smoke:** no 500s.
- **Manual on the QuickBooks sandbox:** see the OQ-3 verification ticket.

#### E2E tests (e2e/)
- None. A Phase-only PR qualifies for `None — no-fe-diff` (confirm on the diff). QuickBooks behavior is verified manually through the OQ-3 ticket.

## 7. Testing Strategy

### Unit tests (`api/` and `app/`)
- **BE:**
  - The aggregate invariants and every PRD error string.
  - The due-date rule vectors (shared with TS).
  - Ordering, rule text, pluralization.
  - `CreditStanding`.
  - Note composition.
  - The QuickBooks resolver.
- **FE:**
  - `creditTerms.ts` helpers: due dates, options, display, Over Credit, ordering, match key.
  - The menu matrix.
  - Each new component and dialog.
  - The `AuditLogDialog` subject, with the WO/PS regression cases.
- **Edge cases to watch:**
  - "NET 30", "Net30" and blank → COD.
  - Counter Sale excluded.
  - An unseeded org.
  - Own "Net 6" due on the 25th (S3-E1): it must not fall into the legacy "Net N" parse.
  - December rollover; leap year; DST.
  - Accent-only name variants (`unicode_ci` folds accents; the unique-key catch maps the error).

### Integration tests
- Endpoints E1–E11: authorization and tenant isolation (cross-org → 404).
- Move Customers: all-or-nothing, S4-E1, refs, and the post-commit job.
- Invoice create and delivery flows: stored due dates for own terms.
- Contacts import and the Public API: the S10 matrix.
- Seeder idempotency.
- A 11,185-customer move on a throwaway MySQL.

### Manual testing checklist
1. Run `app:credit-terms:seed-standard` twice on a copy of staging data: there are no duplicate rows, and every org has exactly one default.
2. Before seeding, an unseeded org's New Customer shows COD prefilled and its page lists the 12 terms.
3. QuickBooks sandbox (OQ-3): "10th of the following month" on invoices dated Oct 5 and Oct 28 → both due Nov 10; day 31 invoiced in November → Nov 30; two invoices with the same new term exported at once → one QuickBooks term, and nothing on QB Unexported.
4. Legacy and batch invoice PDFs with a 31-character term name.
5. A move of about 11k customers on staging: response time, the worker job for AccountingHub, and no lock timeouts on Edit Customer during the move.
6. Touch device: tapping a locked Credit Limit toggles the explanation under the field.

### E2E tests

There are 5 new tests in 4 specs plus 1 update, which fills `batchCap = 5`. New specs go in `e2e/tests/ui/credit-terms/` with the describe `'<Workflow> Tests @credit_terms'`. Every test uses the `admin` role, pins every seed to `fixtureState.workplaceId`, and sets up preconditions through API factories only.

**Test: C-NEW-1 Owner makes a term the default, and New Customer starts on it** (Happy path; S1-R1, S1-R11, S2-R5, S2-R6, S5-R1, S5-R2, S5-R6, S11-R5, S12-R3; needs Phases 1, 4 and 6). File: `make-default-new-customer.spec.ts`.
1. Open Settings → Credit Terms. Exactly one row carries the "Default" tag.
2. On Net 45's row menu, choose "Make Default for New Customers". The confirmation reads "Make Net 45 the default?" / "New customers start on Net 45. Customers you already have keep their current term."
3. Click Make Default. The toast reads "Net 45 is now the default" / "New customers start on Net 45.", and the tag moves to Net 45.
4. Open the page "⋯" → Audit Log. The newest row is "Default changed", with "{previous} → Net 45" and the owner's name.
5. Open Customers → New Customer. Credit Terms is prefilled with Net 45 and Credit Limit is editable. Save.
- **Expected:** the new customer's card shows "Net 45".
- **Notes:** the org default is shared state. Snapshot it with `creditTermFactory.getDefault()` and restore it in `finally` and `afterEach`.

**Test: C-NEW-2 Owner moves part of a term's customers to another term** (Happy path; S4-R1, S4-R2, S4-R4, S4-R5, S4-R7, S4-R8, S4-R9, S4-R11, S4-R17, S4-R19, S1-R12; needs Phases 1, 4 and 5). File: `move-customers.spec.ts`.
1. Seed two spec-owned Net terms via the API, plus 3 customers on the source term, one of them with a $500 limit.
2. Open Move Customers on the source term. All 3 customers are listed A to Z and ticked, with "3 selected".
3. Search narrows the list, and clearing the search restores it.
4. Untick the $500 customer. The counter reads "2 selected" and the button reads "Move 2 Customers".
5. Choose the target term. No $0 line is shown.
6. Move. There's no confirmation, the toast reads "2 customers moved to {target}.", and the row counts change to 1 and 2.
- **Expected:** each moved customer has the note "Credit term changed from {source} to {target} by {owner} (Move Customers)." The unticked customer keeps its term and its $500 limit.

**Test: C-NEW-3 Owner moves customers to COD and confirms the $0 credit limit** (Edge case; S4-R10, S4-R14, S4-R15, S4-R16, S4-R20, S11-R17, S12-R3; needs Phases 1, 4 and 5). Same file as C-NEW-2.
1. Seed one customer with a $750 limit on a spec-owned Net term.
2. Open Move Customers and choose COD. The line "Their credit limit will be set to $0." appears.
3. Click Move. The red confirmation "Set 1 customer's credit limit to $0?" opens.
4. Cancel. The window keeps its ticks and Move To.
5. Move again and confirm. The toast reads "1 customer moved to COD."
- **Expected:** the customer is on COD with a $0.00 limit, and the note ends with "Credit limit $750.00 → $0." The log row reads "1 customer from {term} to COD" plus the $0 sentence.

**Test: C-NEW-4 Owner creates a "day of the following month" term, and the invoice falls due on that day** (Happy path; S3-R1, S3-R2, S3-R3, S3-R5, S3-R7, S1-R5, S1-R7, S5-R3, S7-R2, S7-R6; needs Phases 3, 4 and 6). File: `own-term-invoice-due-date.spec.ts`.
1. Open New Credit Term. It opens on "Due Net X days" with Day disabled.
2. Enter a unique name, choose "Due day of the following month" and enter 10. The blue explanation line is shown.
3. Create. The toast reads "{name} created", and the row shows "10th of the following month" with 0 customers.
4. In Edit Customer, assign the new term.
5. Open the WO Finance tab. The preview due date is the 10th of the month after the invoice date.
6. Create the invoice and charge it to the account.
- **Expected:** the invoice document's due date is the 10th of the following month, derived from the document's issue date and not the runner's clock.
- **Notes:** reuse `freshCreditTermCustomer` and `parseDocumentDate` from `e2e/tests/ui/finance/credit-term-setup.ts`. The term ends up on an invoice, so deactivate it in `afterEach`; it can never be deleted.

**Test: C-NEW-5 Owner deactivates and reactivates a term in use** (Happy path; S2-R7, S2-R8, S2-E3, S1-R3, S1-R14, S5-R7, S5-R8, S5-N2; needs Phases 4 and 6). File: `deactivate-reactivate-term.spec.ts`.
1. Seed a spec-owned Net 21 term held by one customer.
2. Deactivate it. The toast reads "{name} deactivated", and the tab counts change Active −1 and Inactive +1. Assert deltas only: persistent orgs accumulate E2E terms.
3. Open the customer. The card reads "{name} (Inactive)", and Edit Customer shows it selected.
4. Open New Customer. The term isn't offered.
5. Reactivate it. The toast reads "{name} reactivated".
- **Expected:** after reactivation, New Customer offers the term again.

**Update: `e2e/tests/permissions/custom/settings-access-enforcement.spec.ts`** (S1-R1, S1-N1, S11-R4, S11-N2; Phase 4).
- **C26448:** `link_credit_terms_tab` is visible and opens the page.
- **C26451** (Finance OFF): the tab count is 0, and `page.goto('/administration/credit-terms')` redirects silently. That's a redirect, not a 403 page.

**Reference updates (mandatory, uncapped; confirm each one as its phase lands):**
- **`e2e/tests/ui/invoice-refresh/invoice-order-reference.spec.ts` C44914** (with `invoice-refresh.fixtures.ts` `seedDocumentCustomer({ creditTerm: '' })`): under D25 a blank term can no longer be written, so this precondition is unreachable after release (Phase 6).
  - Re-scope C44914 to assert that the Terms chip renders on a customer whose term is COD.
  - Move the "no term set" render to a BE functional test of the invoice template with an empty `invoiceCreditTerms`.
  - Update the TestRail case text to match. Don't `test.skip` it.
- **`e2e/src/api/factories/customer.factory.ts` `create()`:** guarded by D26. When Phase 6 lands, create one customer via the factory and read back the address, province, postal code and sales rep. If a field is missing, that's a BE contract regression; fix it in the BE.
- **`customer.factory.ts:setPinnedNote` (~:381) and `staff.factory.ts:assignSalesRepToCustomer` (~:376):** they echo the stored `credit_limit` along with the term. Send `0` when the normalized term is COD or Credit Hold, or Phase 6's refusal would throw for a pre-release COD customer with a limit.
- **C44500, C44501, C44503, C44239** write `NET 30` / `CREDIT HOLD` through `/customers/change`. After Phase 6 those save in the shop's spelling, so the specs still pass but now exercise the canonical path. Re-label them in TestRail as canonical-path cases. Folding of non-canonical spellings is owned by the BE holder-counter test and the TS `toCreditTermMatchKey` vectors.
- **Fresh-org CI (stage/QA):** a newly registered org now defaults to **Due on Receipt** (S11-R12). Any spec that relies on a factory customer being COD without calling `setCreditTerm` changes behavior there; only C44914 was found. Watch the first stage run.
- **Regression guard for the `AuditLogDialog` widening (Phase 4):** run `ps-audit-log`, `work-orders/adjustment-audit-log`, `work-order-history-validation`, `part-request-move-history` and `wo-audit-log-link-gating-enforcement`.

**New E2E infrastructure** (under `e2e/src/`):
- `api/factories/credit-term.factory.ts` (`CreditTermFactory`, shaped like `payment-method.factory.ts`): `list`, `getDefault`, `findByName`, `create`, `change`, `makeDefault`, `deactivate`, `reactivate`, `delete`, `holders`, `uniqueName(prefix)` (≤ 31 characters, never a standard name), and `cleanup` (delete, or deactivate when in use). Register it in `fixtures/test-fixtures.ts` and `fixtures/owned-resources.fixture.ts`.
- `customer.factory.ts`: `create({ creditTerm, creditLimit })`, `setCreditLimit`, `getCreditStanding`.
- `pages/administration/credit-terms.page.ts` (`data-test-id`-first; don't copy the XPath Payment Methods page object), `pages/dialogs/credit-term.dialog.ts`, `pages/dialogs/move-customers.dialog.ts` (virtual scroll: read only the rendered rows). Reuse `pages/dialogs/audit-log.dialog.ts`.
- `new-customer.dialog.ts` / `edit-customer.dialog.ts`: `creditTermsSelect`, `creditLimitInput`, `selectCreditTerm(name)` via `DropdownHelper.selectFromDropdown`, `readSelectedCreditTerm()`.
- Register `credit_terms: '@credit_terms'` in `config/test-groups.ts` (`TEST_GROUPS` + `UI_TEST_GROUPS`). Add `'**/ui/credit-terms/*.spec.ts'` to the `admin` project's `testMatch` in `e2e/playwright.config.ts`, or the specs never run. Add a `ui/credit-terms/` entry to `SECTION_MAP` in `e2e/scripts/testrail-push.ts`.

**Test ids to add in Phases 4 and 5 (D27):**
- **Page:**
  - `table_credit_terms`, `tab_active_credit_terms`, `tab_inactive_credit_terms`, `text_credit_terms_error`, `text_no_inactive_credit_terms`
  - `button_new_credit_term`, `button_credit_terms_page_menu`, `menu_item_credit_terms_audit_log`
  - `row_credit_term`, `text_credit_term_name`, `badge_credit_term_default`, `icon_credit_term_info`, `icon_credit_term_lock`
  - `button_credit_term_row_menu`, and `menu_item_credit_term_<edit|make_default|move_customers|deactivate|reactivate|delete>`
- **Dialogs:** suffixes `make_default_credit_term`, `delete_credit_term`, `credit_term`, `move_customers`, `confirm_zero_credit_limit`.
- **Term dialog:** `input_credit_term_name`, `radio_credit_term_kind_net_days`, `radio_credit_term_kind_day_of_month`, `input_credit_term_days`, `input_credit_term_day`, `text_credit_term_explanation`, `button_save_credit_term`.
- **Move dialog:** `input_move_customers_search`, `button_move_customers_select_all`, `button_move_customers_select_none`, `text_move_customers_selected_count`, `list_move_customers`, `checkbox_move_customer`, `text_move_customers_no_match`, `select_move_customers_target`, `text_move_customers_default_hint`, `text_move_customers_zero_limit_warning`, `button_move_customers_confirm`.
- **Toasts:** `toast_credit_term_<created|saved|default|deactivated|reactivated|deleted|moved>`.

**Backlog** (deferred by `batchCap`; ranked):

| # | Workflow | Requirements | Suggested file |
|---|---|---|---|
| 1 | Edit and delete an unused own term; an in-use term shows Edit/Delete blocked with "Used by …" | S2-R1, S2-R2, S2-R4, S2-R9, S2-N5, S2-E1, S3-R8, S3-R13 | `e2e/tests/ui/credit-terms/edit-delete-term.spec.ts` |
| 2 | Move Customers greyed for a Finance-only custom role; the server refuses | S4-N1 | `e2e/tests/permissions/custom/credit-terms-move-gating-enforcement.spec.ts` |
| 3 | "Over limit" badge and New WO confirmation from a real balance (Net 30 over its limit shows; COD never) | S9-R1, S9-R2, S9-N1, S9-N2, S11-R8 | `e2e/tests/ui/work-orders/over-credit-warning.spec.ts` |
| 4 | Vendor invoice due date on an own term; A/P aging after an invoice-date edit | S7-R9, S7-R1, S7-R6a | `e2e/tests/ui/parts-orders/vendor-invoice-own-term-due-date.spec.ts` |
| 5 | Changing the invoice date recalculates the due date for an own term | S7-R8 | `e2e/tests/ui/finance/invoice-date-own-term-recalc.spec.ts` |
| 6 | Vendors on own terms: no Default tag; "(Inactive)"; New Vendor stays on COD | S6-R1, S6-R2, S6-R3, S6-N2 | `e2e/tests/ui/vendors/vendor-credit-term.spec.ts` |
| 7 | Edit Customer on a deactivated term: pick another and save, and the inactive term is gone | S5-R12, S5-R13 | `e2e/tests/ui/credit-terms/customer-on-inactive-term.spec.ts` |
| 8 | Credit Terms Log rows and search | S12-R2, S12-R3, S12-R5, S12-R7 | `e2e/tests/ui/credit-terms/credit-terms-log.spec.ts` |
| 9 | New Customer for a role without AP/AR shows no credit fields | S5-N1, S11-N2 | update `customer-management-enforcement.spec.ts` |
| 10 | QuickBooks creates an own term on export | S8-R1 … S8-R4 | manual, via the OQ-3 ticket |
| 11 | A new org starts on Due on Receipt with 12 terms | S11-R12, S11-R3 | assertion in `e2e/tests/api/fresh-org-bootstrap.spec.ts` |

A non-zero Backlog fails the advisory CI check, so the PR carries the override marker, with this table kept in the coverage block. Everything else, including the date vectors, ordering and text, refusals, the menu matrix, dialog validation, the Move write path, the Over Credit rule, the S10 matrix, seeding and log rendering, is owned by the dev-layer tests listed in each phase. Offer them in TestRail as `Test Layer = Dev`.

**§8 skip reasons:** if phases ship as separate PRs, Phase 7 qualifies for `None — no-fe-diff` (confirm on the real diff). Phases 1 and 2 need the override marker ("coverage lands with Phases 4/6"). If the feature ships as one PR, use the coverage block above plus the override marker for the Backlog.

## 8. Rollback Plan

- **Code:** revert the release. The new tables (`credit_term`, `quickbooks_term_map`) and the indexes are additive.
  - Old code ignores them, and leaving them in place is safe.
  - Down migrations drop the tables and indexes. Run them only if needed; the `invoice` index drop is online.
- **Data written by the feature:**
  - Customer and vendor `credit_term` values for own terms stay as text. After a rollback they date invoices through the legacy parser: "Net 10" keeps working; "10th of the following month" falls back to 0 days.
  - Customer notes and `entity_event` rows remain as history.
  - Credit limits set to $0 by a move are recorded in each customer's note, so a shop can restore them by hand.
- **QuickBooks:** terms created in QuickBooks stay there (S8-R7). A rollback doesn't touch them.
- **Partial rollback:** Phase 7 (QuickBooks) can be reverted on its own, which falls back to today's get-or-create. Phase 2 (Over Credit) is independent too.

## 9. Performance & Security Considerations

### Performance
| Path (phase) | Query shape | Index | Volume (prod) | Live or derived |
|---|---|---|---|---|
| E1 list (P1) | org terms (≤ ~50 rows) | `cterm__organization_id_name_key_unq` | ≤ 50 | live |
| E1b usage (P4) | `company` and `part_vendor` `GROUP BY credit_term` + `SELECT DISTINCT invoice.credit_term`, folded in PHP | `c__organization_id_credit_term_is_system_default_name_idx`, `pv__organization_id_credit_term_idx`, `inv__organization_id_credit_term_idx`, all index-only | largest COD group 11,185; largest org 15.8k invoices | live (D16); target under 1 s (S1-R17), expected under 100 ms |
| E8 holders (P4) | `invoice` `GROUP BY credit_term` for the org | same | ≤ 15.8k index entries | live, lazy on menu open |
| E9 Move list (P5) | `SELECT id, name, credit_term FROM company WHERE org AND credit_term IN (spellings) AND is_system_default=0 ORDER BY name` | the 4-column `company` index, covering | 11,185 rows, about 0.6 MB JSON | live, unpaginated (PRD) |
| E10 Move (P5) | chunked PK `FOR UPDATE`, guarded UPDATEs, 500-row multi-INSERTs | PK; `ca__customer_id_idx` | 11,185 | write. About 1–3 s CPU and 5–15 s of row locks (R4). No ORM hydration. |
| E11 log (P4) | `entity_event` org + type + entity id, newest first | existing `ee__organization_id_entity_type_entity_id_occurred_at_id_idx` | tiny (a few rows a year) | live |
| Due-date calculator (P3) | one catalog read per org per request, memoized | `cterm__…` prefix | ≤ 50 | live |
| QuickBooks term (P7) | a point lookup on the map; a QuickBooks call only on a miss | `qbterm__…unq` | one row per term per realm | derived map, never updated |

- **Derived data and backfills:** `credit_term.name_key` is maintained only by the aggregate. The seeding CLI runs one short transaction per org and is never one long transaction. `quickbooks_term_map` is written once per (org, realm, term). There are no other backfills (Q-D1).
- **Known risks:**
  - The `invoice` index build on 586 MB (M3, run off-peak, INPLACE, LOCK=NONE).
  - **R4: Move row locks.** A move holds row locks on up to 11k `company` rows for about 5–15 s. Concurrent edits of those customers wait; sorted, chunked locking avoids deadlocks.
  - Frontend bursts: the usage, holders and customers queries use `staleTime: 0`, but each fires only on page open, menu open or dialog open. No per-keystroke requests: Move search filters client-side, and log search is debounced by `PageSearchInput`.
  - The dropdown list is fetched once per session cache (`useCreditTermsQuery`) and reused by every dialog, card and the invoice preview.

### Security
- **Tenant scoping:**
  - Every read uses `OrganizationDecorator` or an explicit org id taken from the record (calculator, job).
  - Every `{id}` is resolved org-scoped; foreign ids → 404.
  - Move validates every customer id against the org before any write (D22), and every UPDATE carries `organization_id`.
- **Authorization:**
  - FIN (`ROLE_PAYMENT_METHOD::CHANGE`) on every mutation, on usage, holders and history.
  - MOVE on E9 and E10.
  - E1 is authentication-only (**G2, approved**).
  - S5-N4 is enforced server-side (NFR-6). Today it's frontend-only.
- **Golden Rule exemptions:** G1 (the seed CLI's unscoped org enumeration) and G2 (the list gate), both user-approved 2026-10-26. Copy both into the PR.
- **Audit:** every Credit Terms page change and every move lands in the immutable Credit Terms Log; moved customers also get a note.

## 10. Requirement Traceability

| Requirement | Phase | Layer | Files | Status |
|---|---|---|---|---|
| S1-R1, S1-N1 | 4 | App | `routes.ts`, `Administration.vue`, `AdminLeftMenuNav.vue` | Planned |
| S1-R2 … S1-R16, S1-N2, S1-N3, S1-E1 … S1-E3 | 4 | App | `credit-terms/CreditTerms.vue`, `CreditTermsTable.vue`, `CreditTermRowMenu.vue` | Planned |
| S1-R5, S1-R7, S1-R12, S1-R13, S1-R14 | 1, 4 | API | `CreditTermOrdering`, `CreditTermRuleText`, `DbalCreditTermHolderCounter`, E1, E1b | Planned |
| S1-R17 / NFR-1 | 1, 4 | API + App | indexes M2/M3, E1b, E8 lazy holders | Planned |
| S2-R1 … S2-R12, S2-N1 … S2-N6, S2-E1 … S2-E3 | 4 | API | `CreditTerm` aggregate, E3–E8, `CreditTermDefaultSwitcher` | Planned |
| S2-R1 … S2-R12, S2-N1 … S2-N6 | 4 | App | `creditTermMenu.ts`, `CreditTermRowMenu.vue`, `useCreditTermActions.ts` | Planned |
| S2-E2 stale-edit string | 4 | API | `CreditTermChangedError` | Planned |
| S3-R1 … S3-R16, S3-N1 … S3-N3, S3-E1, S3-E2 | 4 | API + App | E2/E3, `CreditTermName`, `CreditTermRule`, `CreditTermDialog.vue` | Planned |
| NFR-3 | 1, 4 | API | `name_key` unique index, `version` | Planned |
| S4-R1 … S4-R24, S4-N1 … S4-N3, S4-E1 … S4-E4, NFR-2 | 5 | API + App | E9/E10, `DbalCustomerCreditTermMover`, `MovedCustomerNoteComposer`, `MoveCustomersDialog.vue` | Planned |
| S4-R12, NFR-5 | 5 | API | `RecordMovedCustomersForAccountingJob(Handler)` | Planned |
| S5-R1 … S5-R15, S5-N1 … S5-N3, S5-E1 … S5-E3 | 6 | App | `CustomerDialog.vue`, `CustomerLeftSection.vue` | Planned |
| S5-R2, S5-R4, S5-R6, S5-R9, S5-N4, NFR-6 | 6 | API | `UI/HTTP/Create/*`, `Create/CreateCommandHandler`, `Change/*` | Planned |
| S5-R10, S6-R5, S11-R6, S11-R7 | 2 | App | `CustomerDialog.vue`, `VendorDialog.vue` | Planned |
| S5-R11, NFR-7 | 6 | API | legacy and batch invoice templates | Planned |
| S6-R1 … S6-R6, S6-N1, S6-N2, S6-E1, S6-E2 | 6 | API + App | vendor handlers, `VendorDialog.vue`, `Vendor.vue` | Planned |
| S7-R1 … S7-R11, S7-N1, S7-E1 … S7-E4 | 3 | API | `CreditTermDueDateCalculator`, `CreditTermRule`, the 6 call sites, Vendor Bill Export, `VendorTransactionModifier` | Planned |
| S7-R1 … S7-R8 (preview) | 3 | App | `Invoice.vue`, `creditTermDueDate`, `dayOfFollowingMonthInLocationTz` | Planned |
| S8-R1 … S8-R5, S8-E1, S8 errors, NFR-4 | 7 | API | `QuickBooksTermResolver`, `TermEntityMap`, `TermHandler`, `quickbooks_term_map` | Planned |
| S8-R6, S8-R7, S8-R8, S8-N1, S8-N2 | 4, 5, 7 | API | no QuickBooks calls from the CreditTerms module (unchanged paths) | Planned |
| S9-R1 … S9-R4, S9-N1, S9-N2, S9-E1, S9-E2, S11-R8 | 2 | API + App | `CreditStanding`, `WorkOrderDetails`, `WorkOrderDialog.vue`, `OrderStatusCard(Mobile).vue` | Planned |
| S10-R1 … S10-R8, S10-N1, S10-N2, S10-E1 … S10-E3 | 6 | API | `ImportCommandHandler`, `ImportVendorCommandHandler`, OpenApi customer and vendor controllers | Planned |
| S11-R1, S11-R3, S11-R12, S11-E1 | 1 | API | seeder, subscriber, CLI, `DbalCreditTermCatalog` fallback | Planned |
| S11-R2, S11-N1 | 1 | API | no row rewrites; seeding only | Planned |
| S11-R4, S11-R9, S11-E2, S11-N2 | 4, 6 | App | page and nav gating, counts, cards | Planned |
| S11-R5, S11-R10, S11-R11, S11-R16, S11-R17 | 2, 5, 6 | API + App | see S5 / S4 | Planned |
| S11-R13, S11-R14 | 3 | API | AR dashboard, statement and unpaid credit memos, Vendor Bill Export | Planned |
| S12-R1 … S12-R8, S12-N1 … S12-N3, S12-E1 … S12-E3 | 4 | API + App | `CreditTermLogRecorder/Renderer`, `DbalCreditTermLogQuery`, `EntityEventType`, `AuditLogDialog.vue` | Planned |

| S1-R1, S1-R11, S2-R5, S2-R6, S5-R1, S5-R2, S5-R6, S11-R5, S12-R3 | 1, 4, 6 | E2E | `e2e/tests/ui/credit-terms/make-default-new-customer.spec.ts` (C-NEW-1) | Planned |
| S4-R1, S4-R2, S4-R4, S4-R5, S4-R7, S4-R8, S4-R9, S4-R11, S4-R17, S4-R19, S1-R12 | 5 | E2E | `e2e/tests/ui/credit-terms/move-customers.spec.ts` (C-NEW-2) | Planned |
| S4-R10, S4-R14, S4-R15, S4-R16, S4-R20, S11-R17 | 5 | E2E | `e2e/tests/ui/credit-terms/move-customers.spec.ts` (C-NEW-3) | Planned |
| S3-R1, S3-R2, S3-R3, S3-R5, S3-R7, S1-R5, S1-R7, S5-R3, S7-R2, S7-R6 | 3, 4, 6 | E2E | `e2e/tests/ui/credit-terms/own-term-invoice-due-date.spec.ts` (C-NEW-4) | Planned |
| S2-R7, S2-R8, S2-E3, S1-R3, S1-R14, S5-R7, S5-R8, S5-N2 | 4, 6 | E2E | `e2e/tests/ui/credit-terms/deactivate-reactivate-term.spec.ts` (C-NEW-5) | Planned |
| S1-R1, S1-N1, S11-R4, S11-N2 | 4 | E2E | `e2e/tests/permissions/custom/settings-access-enforcement.spec.ts` (C26448, C26451 update) | Planned |
| S2-R1, S2-R2, S2-R4, S2-R9, S2-N5, S4-N1, S9, S7-R8, S7-R9, S6, S5-R12, S5-R13, S12-R2, S12-R5, S5-N1, S8, S11-R12 (E2E) | — | E2E | Backlog rows 1–11 (§7) | Deferred (override marker) |

## 11. Verification Tickets

_Filled in after the plan is approved._

| Ticket | Title | Covers | Linked stories | Assignee |
|--------|-------|--------|----------------|----------|
| SV-11840 | Verify Phase 1: foundation, seeding and term list | Phase 1 / S11-R1..R3, S11-R12, S11-E1, S11-N1, NFR-3 | SV-11680, SV-11670 | Nemanja Djuric |
| SV-11841 | Verify Phase 2: Over Credit warning and Name-field validation | Phase 2 / S9, S11-R8, S5-R10, S6-R5, S11-R6, S11-R7 | SV-11678, SV-11674, SV-11675, SV-11680 | Nemanja Djuric |
| SV-11842 | Verify Phase 3: due dates | Phase 3 / S7, S11-R13, S11-R14 | SV-11676, SV-11680 | Nemanja Djuric |
| SV-11843 | Verify Phase 4: Credit Terms page, row actions, term window and log | Phase 4 / S1, S2, S3, S12, NFR-1 | SV-11670, SV-11671, SV-11672, SV-11681 | Nemanja Djuric |
| SV-11844 | Verify Phase 5: Move Customers | Phase 5 / S4, S11-R17, S12-E3, NFR-2, NFR-5 | SV-11673, SV-11681, SV-11680 | Nemanja Djuric |
| SV-11845 | Verify Phase 6: New Customer, vendors, imports, Public API, printed invoices | Phase 6 / S5, S6, S10, NFR-6, NFR-7 | SV-11674, SV-11675, SV-11679, SV-11680 | Nemanja Djuric |
| SV-11846 | Verify Phase 7: QuickBooks term sync | Phase 7 / S8, NFR-4 | SV-11677 | Nemanja Djuric |
| SV-11847 | QA: QuickBooks Online sandbox check of "day of the following month" terms (OQ-3) | S8-R3, OQ-2, OQ-3 | SV-11677 | Nemanja Djuric |

**Follow-ups (outside this epic's QA gate):** SV-11848 (moving the QuickBooks export onto the worker), SV-11849 (the contacts import drops credit-limit cents).

When all these tickets are marked Done, the feature is ready for QA.

---

## Appendix A: Copy deck (exact user-facing strings)

Implementers get every string from here verbatim. The orchestrator passes the rows a phase touches into the implementer's prompt, because sub-agents can't read Confluence. **Source: PRD v5.** If the PRD moves past v5, re-sync this appendix.

### A.1 PRD §8 User Feedback Summary (verbatim, v5)

| Trigger | Message | Behavior |
| --- | --- | --- |
| Credit Terms list fails to load | "Something went wrong loading credit terms. Please try again." | Inline line above the tabs, stays until a reload succeeds |
| Inactive tab is empty | "No inactive terms" | Inline line in place of the table |
| Hover the lock on COD, Due on Receipt or Credit Hold | "Always available." / "COD, Due on Receipt and Credit Hold can't be deactivated." | Tooltip on hover |
| Hover the info icon on COD | "Cash on delivery. COD customers can't charge to account, so payment is taken when the invoice is created." | Tooltip on hover |
| Hover the info icon on Due on Receipt | "Payment is due on the invoice date. You can charge the invoice to the customer's account instead of taking payment." | Tooltip on hover |
| Hover the info icon on Credit Hold | "No invoices can be created for a customer on Credit Hold until their credit term is changed." | Tooltip on hover |
| Hover a blocked Edit or Delete Credit Term on a term in use | "Used by {holders}" / "Deactivate it instead to take it out of the pickers." | Tooltip on hover, item greyed |
| Hover a blocked Deactivate or Delete Credit Term on the default | "This is your default for new customers" / "Pick another default first." | Tooltip on hover, item greyed |
| Hover a blocked Move Customers | "No customers are on this term" | Tooltip on hover, item greyed |
| Hover Deactivate / Reactivate | "Hide from customer and vendor pickers" / "Show in pickers again" | Tooltip on hover |
| Make Default chosen | "Make {name} the default?" / "New customers start on {name}. Customers you already have keep their current term." | Confirmation, buttons "Cancel" and "Make Default" |
| Make Default confirmed | "{name} is now the default" / "New customers start on {name}." | Success toast with a Close action |
| Term deactivated | "{name} deactivated" | Success toast |
| Term reactivated | "{name} reactivated" | Success toast |
| Delete Credit Term chosen | "Are you sure you want to delete this credit term?" | Confirmation titled "Confirmation", buttons "Cancel" and red "Delete Credit Term" |
| Term deleted | "{name} deleted" | Success toast |
| Credit term created | "{name} created" | Success toast |
| Credit term edited and saved | "{name} saved" | Success toast |
| Name field hint | "Up to 31 characters. Prints on invoices and goes to QuickBooks." | Hint under the field, always shown |
| Name empty | "Enter a name." | Inline error, persists until corrected |
| Name too long | "Use 31 characters or fewer." | Inline error, persists until corrected |
| Name matches a standard term | "{name} is already a standard term. Pick another name." | Inline error, persists until corrected |
| Name matches one of the shop's terms | "A term called {name} already exists." | Inline error, persists until corrected |
| Days out of range | "Enter 1 to 365 days." | Inline error, clears as soon as the number is valid |
| Day out of range | "Enter a day from 1 to 31." | Inline error, clears as soon as the number is valid |
| No option sent on create (server) | "Pick Due Net X days or Due day of the following month." | Standard error alert |
| Valid Net term typed | "{Name} means payment is due {X} days after the invoice date. An invoice dated {today} is due {due}." | Blue information line, updates as the user types |
| Valid day-of-month term typed | "{Name} means payment is due on the {ordinal X} of the following month. An invoice dated {today} is due {due}." | Blue information line, updates as the user types |
| Edit or delete of a term in use refused (server) | "Used by {holders}. Deactivate it instead to take it out of the pickers." | Standard error alert |
| Deactivate or delete of the default refused (server) | "This is your default for new customers. Pick another default first." | Standard error alert |
| Deactivate of COD, Due on Receipt or Credit Hold refused (server) | "Always available. COD, Due on Receipt and Credit Hold can't be deactivated." | Standard error alert |
| Make Default of an inactive term or Credit Hold refused (server) | "Pick an active term other than Credit Hold." | Standard error alert |
| Term no longer exists (server) | "Credit term not found." | Standard error alert |
| Move To hint | "Prefilled with your default for new customers." | Hint under Move To while the default is selected |
| Move To is COD or Credit Hold | "Their credit limit will be set to $0." | Line under Move To while COD or Credit Hold is selected |
| Move to COD or Credit Hold pressed | "Set {n} customers' credit limit to $0?" ("Set 1 customer's credit limit to $0?") / "This can't be undone. Their current limits are kept in each customer's note, and the Credit Terms Log records the move." | Confirmation, buttons "Cancel" (back to the window, choices kept) and red "Set Limits to $0 and Move" (displayed "Set Limits To $0 And Move") |
| Hover a greyed Move Customers (missing permission) | "You need Customers → Create & Edit and View and Manage AP/AR Data to move customers." | Tooltip on hover, item greyed |
| Move fails partway | "Couldn't move the customers. Nothing was changed. Please try again." | Standard error alert, window stays open |
| Move Customers search has no match | "No customers match your search." | Inline line in the list area |
| Customers moved | "{n} customers moved to {term}." / "1 customer moved to {term}." | Success toast |
| Note on each moved customer | "Credit term changed from {old term} to {new term} by {user name} (Move Customers)." followed by "Credit limit {old limit} → $0." when the move changed the limit | Note on the customer's Notes |
| Move with no ticked customer still on the term (server) | "Pick at least one customer to move." | Standard error alert, window stays open |
| Move To term no longer active (server) | "Pick an active term other than {from term}." | Standard error alert, window stays open |
| Hover the locked Credit Limit (COD or Credit Hold) | "COD and Credit Hold customers can't charge to account, so they have no credit limit." | Tooltip on hover |
| Limit above $0 sent for COD or Credit Hold (server) | "COD and Credit Hold customers can't charge to account, so they have no credit limit." | Standard error alert, form stays open |
| New Customer term no longer active (server) | "Pick an active credit term." | Standard error alert, form stays open |
| Page "⋯" menu item | "Audit Log" | Menu item, opens the "Credit Terms Log" window |
| Credit Terms Log events | "Credit term created", "Credit term edited", "Credit term deactivated", "Credit term reactivated", "Credit term deleted", "Default changed", "Customers moved" | Event column text, one row per saved change |
| Credit Terms Log details | "{name}: {rule}" (created, deactivated, reactivated, deleted); "Name: {old} → {new}" and/or "Due: {old rule} → {new rule}" (edited); "{old} → {new}" (default changed); "{n} customers from {from} to {to}", plus "Credit limit set to $0 (previous limits are in each customer's note)" when the target is COD or Credit Hold (customers moved) | Details column text |
| Credit Terms Log has no rows | "No history here. Yet." | Empty state in the table |
| Credit Terms Log fails to load | "Something went wrong loading the Credit Terms Log. Please try again." | Standard error alert; the table shows no rows and repeats the same sentence in place of the empty-state line |
| Over credit limit on New Work Order (unchanged wording) | "Are you sure you want to open a new work order? This customer is over their credit limit." | Confirmation titled "Confirmation", buttons "Create" and "Cancel" |

### A.2 Due column text (S1-R7)

- **S1-R7:** The Due column describes each term in words:
    - COD: "Paid when the invoice is created"
    - Due on Receipt: "Due on the invoice date"
    - Credit Hold: "Invoicing is blocked"
    - A Net term: "{X} days after the invoice date" ("1 day after the invoice date" when X is 1), for example "30 days after the invoice date"
    - A "day of the following month" term: "{ordinal day} of the following month", for example "10th of the following month", "1st of the following month", "22nd of the following month"

### A.3 Credit Terms Log events (S12-R3)

- **S12-R3:** Each change saved after release adds one row. There is no Line column. "{rule}" is the term's Due column text (S1-R7). The Event and Details columns read:

| Change | Event | Details |
| --- | --- | --- |
| A term is created (Story 3: Create or edit a credit term) | "Credit term created" | "{name}: {rule}", for example "Net 14: 14 days after the invoice date" |
| An unused term is edited (Story 3: Create or edit a credit term) | "Credit term edited" | Only what changed: "Name: {old} → {new}" and/or "Due: {old rule} → {new rule}" |
| A term is deactivated (Story 2: Row menu actions) | "Credit term deactivated" | "{name}: {rule}" |
| A term is reactivated (Story 2: Row menu actions) | "Credit term reactivated" | "{name}: {rule}" |
| A term is deleted (Story 2: Row menu actions) | "Credit term deleted" | "{name}: {rule}" |
| The default is changed (Story 2: Row menu actions) | "Default changed" | "{old} → {new}", for example "COD → Net 14" |
| Customers are moved (Story 4: Move Customers) | "Customers moved" | "{n} customers from {from} to {to}" ("1 customer from {from} to {to}" for one), followed by "Credit limit set to $0 (previous limits are in each customer's note)" when the target is COD or Credit Hold |

### A.4 Term dialog and Move Customers labels (S3-R1, S3-R2, S4-R2)

- **S3-R1:** "New Credit Term" opens a window titled "New Credit Term"; Edit opens the same window titled "Edit Credit Term". The buttons are "Cancel" and "Create Credit Term" (New) or "Save Changes" (Edit).
- **S3-R2:** The window holds:
    - **Name** (required), focused on open, accepting at most 31 characters, with the hint "Up to 31 characters. Prints on invoices and goes to QuickBooks."
    - Two options, one chosen at a time: **"Due Net X days"** with a **Days** box followed by "days after the invoice date", and **"Due day of the following month"** with a **Day** box followed by "of the following month".

- **S4-R2:** The window shows, top to bottom: a "Search customers" box; "Select All" and "Select None" with "{n} selected" on the right; a scrolling list of every customer on the term, A to Z, each with a checkbox; a "Move To" dropdown; and the buttons "Cancel" and "Move {n} Customers" ("Move 1 Customer" when one is selected).