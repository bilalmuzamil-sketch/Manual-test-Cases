# Title and Description — Technical Implementation Plan

**Date:** 2026-09-23
**PRD:** https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896/What+Are+You+Doing+Why+Are+You+Doing+It
**Jira epic:** [SV-9667](https://shopview.atlassian.net/browse/SV-9667) — Founder Mode Batch #1 · stories SV-10130, SV-10131, SV-10132, SV-10133
**Design:** https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6 (boards: New Line before/after, Edit Line before/after, What reaches QuickBooks, Awkward inputs, The long end). No boards for Story 2 / Story 4 — accepted as text-only, verified by browser-walk.
**Tech stack:** Symfony 7.4 / PHP 8.5 (`api/`), Vue 3.5 + Quasar 2 (`app/`), Playwright (`e2e/`)
**Estimated complexity:** Low–Medium (small diff; the risk is in two silent failure modes — invisible placeholders and the UTF-8 cut)

---

## 0. Execution State

_Keep this block current so any agent (or person) can resume mid-flight — this plan may be executed by someone who did not write it._

- **Status:** Not started
- **Current phase:** —
- **Last completed:** —
- **Open questions / blockers:** — none. (Product reworded S4-N1 on 2026-09-24 to "a genuinely unrecognized column is still rejected"; answered the rest on 2026-09-23 and updated the PRD: S1-R6 = "Title is a required field", S4-R1 withdrawn, S4-R2 names confirmed, S3-R7 = 4,000 bytes on both routes. S4-N1 column-naming errors are out of scope for this epic — see Clarifications.)

> 🛑 **About to implement this plan? Run it as `/loop /implement 2026-09-23-title-and-description.md`.** This plan is meant to be executed by the `/implement` orchestrator inside a `/loop` — that combination is what adds the code-review loop, the Phase 5 runtime gates (migration / compile / smoke / browser-walk), the mandatory E2E ask, and phase-by-phase hands-off execution. Free-hand implementation skips all of it.
>
> - **However you were handed this** — "implement it", "here's the path, do it", or a single phase — do **not** start editing code directly. Route through `/loop /implement <this-file>` (or `/loop /implement Phase N from <this-file>` for one phase). That *is* "doing the implementation" — just with the gates. Announce that you're routing through `/loop /implement` and proceed; no need to ask.
> - **If you are ALREADY running under `/loop /implement`**, ignore this note and continue — you're in the right place.
> - **If you are a sub-agent** (`be-implementer`, `fe-implementer`, …) without orchestration tools, do **not** invoke `/loop` or `/implement` — that's the orchestrator's job. Execute only the scope you were handed and report back.
> - **Precedence:** only a *live, explicit* user instruction to the contrary wins — if the user in this session says to implement directly or skip the loop, honor that. Being handed just the plan path is **not** such an instruction; absent one, default to `/loop /implement` without asking.

> **Release line:** feature work → branch off `develop`. This is a new feature release item (Founder Mode batch), not a hotfix; `LineDialog.vue` already differs between `main` and `develop`, so it could not be cut from `main` cleanly anyway.

---

## 1. Requirements (extracted from PRD)

**Starting point (verified 2026-09-23):** the PRD describes a "first build" that shipped `Title: ...;Description: ...`. That build is **not** on `origin/main` or `origin/develop` and no branch/PR carries it. Both lines still emit `What are you doing?: …;Why are you doing it?: …;Tech Story: …`. This plan builds from that state directly to the S3-R1 format.

### SV-10130 — Work Order Line Dialog
(New Line and Edit Line are **one** component, `LineDialog.vue`, switched by `isEditMode`; the canned-line picker renders only in create mode.)
- **FR-001 (SV-10130):** The free-text Title field and the canned-line picker are labelled exactly "Title", independent of picker state (S1-R1, S1-R4, S1-R5).
- **FR-002 (SV-10130):** The second field is labelled exactly "Description" (S1-R2).
- **FR-003 (SV-10130):** Placeholders "What are you doing?" (Title and picker) and "Why are you doing it?" (Description) are visible while the field is empty and gone once it has a value; the picker's placeholder clears once the user types or picks a canned line. The picker is focused on open (already true) (S1-R3, S1-R5).
- **FR-004 (SV-10130):** Empty Title blocks save with exactly "Title is a required field" (S1-R6, as updated by Product 2026-09-23).
- **FR-005 (SV-10130):** Nothing else in the dialog changes — fields, order, validation, saved values; no existing line data altered (S1-R7, S1-N1).

### SV-10131 — ShopCoach Line Builder
- **FR-006 (SV-10131):** The builder's two editors are labelled "Title" / "Description" with the FR-003 placeholders; the empty-cell fallback text reads "What are you doing?" / "Why are you doing it?" in sentence case (S2-R1, S2-R2).
- **FR-007 (SV-10131):** What ShopCoach generates and writes into a line is unchanged (S2-R3).

### SV-10132 — What Reaches QuickBooks
- **FR-008 (SV-10132):** Labor line text is `{Title} - {Description} - {Tech story}`: no labels, no semicolons, separator exactly `" - "`, only between two present segments, no trailing separator or space; no line falls back to old labels (S3-R1, S3-R2, S3-R3, S3-R5, S3-E1, S3-N2).
- **FR-009 (SV-10132):** The narrative is absent when null, empty, whitespace-only, or exactly `"Tech story missing."`; absence is a normal case (Require Tech Story defaults off) (S3-R6, S3-R6a).
- **FR-010 (SV-10132):** One builder produces the text for both the live QuickBooks Online sync and the downloadable Customer Invoice report; nothing else reads it (S3-R4, S3-R11).
- **FR-011 (SV-10132):** If the joined text exceeds 4,000 bytes it is shortened from the end, never mid-character, on both routes; title survives; an over-long line still syncs (S3-R7, S3-R7a, S3-E3).
- **FR-012 (SV-10132):** Values are otherwise carried as written — hyphens (incl. spaced) and semicolons untouched, no escaping or quoting (S3-R8, S3-R9, S3-R9a).
- **FR-013 (SV-10132):** Report money masking unchanged; line text never masked; report stays gated server-side by `ROLE_INVOICE_VIEW` (S3-R10, prerequisites).
- **FR-014 (SV-10132):** No backfill/resend; parts, shop supplies, fee/discount rows unchanged; credit memos untouched; imported historical invoices unaffected; reversals after release carry new text (S3-N1, S3-N3, S3-R12, S3-E2, §2 Out of scope).

### SV-10133 — The Imports
(Per the user: the "work order import" is Administration → Invoices import, backed by `WorkOrderHistorical`, which writes into the imported-work-order tables. It is the only live importer carrying these columns. `WorkOrderValidator` is dead code and is left untouched.)
- **FR-015 (SV-10133):** The import's columns are named "\*Line Title" and "Line Description" (S4-R2; S4-R1 withdrawn by Product).
- **FR-016 (SV-10133):** Old names ("\*Line Title - What are you doing", "Line Description - Why are you doing it") are still accepted, a file may mix old and new, and an old name is never reported missing or "to remove" (S4-R3, S4-R4, S4-R5).
- **FR-017 (SV-10133):** The downloadable sample and the on-screen column list show the new names; every other column name and the column order is unchanged (S4-R6, S4-R7).
- **FR-018 (SV-10133):** A genuinely unrecognized header is still rejected with the importer's existing `Invalid file headers provided!`; the compatibility rule covers exactly the two renamed columns (S4-N1, as reworded by Product 2026-09-24).

### Non-functional
- **NFR-001 (analysis):** The line-text builder is covered by direct unit tests over the full presence matrix, the placeholder, hyphen/semicolon passthrough, and the cut on multibyte input. (Today no test asserts this string.)
- **NFR-002 (analysis):** BE header compatibility (FR-016) deploys no later than the FE template change (FR-017) — the BE header check is exact and ordered.
- **NFR-003 (analysis):** Placeholder visibility (FR-003, FR-006) and the ShopCoach cell layout are verified by browser-walk; no static gate can catch an invisible placeholder.
- **NFR-004 (PRD S3-R7):** No invalid UTF-8 is ever sent to QuickBooks, and no invoice lands in Unexported Items because a line description is too long.

### Clarifications & PRD comment outcomes
| Question | Asked via | Answer |
|----------|-----------|--------|
| Anything to add beyond the PRD? | intake | "Nothing to add — analyze the PRD as-is" |
| S1-R6 originally quoted "Title is required"; the real current messages are "Line Name is a required field" (create mode, `CannedLineSelect.vue:9`) and "Line name is a required field" (edit mode, `LineDialog.vue:57`); the app-wide form is "X is a required field" | Confluence comment | Product (2026-09-23): ship **"Title is a required field"**; S1-R6 updated to that string |
| S4-R1 renamed a work-order import that doesn't exist as a separate thing (`WorkOrderValidator` has no callers, no route, no UI) | user (fact) + Confluence comment | The work order import **is** Administration → Invoices import (`/api/imports/work-order-historical`). Product (2026-09-23): use S4-R2's names; **S4-R1 withdrawn** |
| No design boards for Story 2 / Story 4 | user | Accepted; ShopCoach verified by browser-walk (NFR-003) |
| Does the live sync share one builder with the report (S3-R4)? | code research | **Yes** — `InvoiceCreateSyncService::sync()` calls `InvoiceGenerator::generateInvoiceForId()` (`api/src/Bookkeeping/Application/Service/Sync/InvoiceCreateSyncService.php:172-176`), which reaches `InvoiceData::buildStatementDescription()`. **But** only the QBO route truncates (`InvoiceLineEntityMap.php:36`, byte `substr`), so the routes already diverge above 4,000 bytes |
| S3-R3 ("no trailing space") vs S3-R8 ("nothing trimmed") when the last present value ends in whitespace (e.g. a tech story ending in a newline) | audit / agent | The **joined** text is right-trimmed once at the end; every value is otherwise carried verbatim. Only the tail of the whole line is touched |
| S4-N1 originally asked the rejection to name the missing column and the column to remove; the live importer (`ImportCommandHandler.php:281-282`) has only ever thrown `Invalid file headers provided!` | user (scope) + Confluence comment | Engineering lead: imports get wording + compatibility only; better import errors belong in a separate imports epic. Product reworded S4-N1 (2026-09-24) to "a genuinely unrecognized column is still rejected" — no deviation remains |
| S1-R7 ("nothing else about the dialog changes") vs `stack-label` | audit / agent | Labels on the five fields become permanently floated. Required for the placeholders to be visible at all (Quasar `QField.sass:399-403`) and matches the design after-boards |
| PRD FYI comment | Confluence comment | Posted 2026-09-23; Product replied the same day and updated the PRD (S1-R6, S3-R7, S4-R1/R2, context notes) |
| Shortening unit | Confluence comment | Product (2026-09-23): 4,000 **bytes** on both routes, never splitting a character; S3-R7 updated |

Data shape (local QA-derived DB, directional only — not prod): 34,541 `invoice_statement` rows; 30 composites over 4,000 bytes (max 10,350); 1,066 with multibyte text; 1,700 carry `tech_story = 'Tech story missing.'`; 675 carry `''`. No prod query was needed — no decision depends on the absolute numbers.

## 2. Architecture Overview

```
Invoice created ─► CreateCommandHandler::syncBookkeeping()
                     └► InvoiceCreateSyncService::sync()
                          └► InvoiceGenerator::generateInvoiceForId()  ─┐
                                                                        ├─► InvoiceData::addStatementRow()
GET /api/reporting/export/customer_invoice (ROLE_INVOICE_VIEW)          │      └► buildStatementDescription()  ◄── the ONE composer (labor rows)
  └► CustomerInvoiceExportQueryHandler                                  │            └► NEW StatementLineText::compose()   (join + filter + UTF-8-safe cut)
       └► InvoiceGenerator::generateForRange()  ───────────────────────┘
                                                                        ▼
                           CSV (ItemDescription)          InvoiceLineDto → InvoiceLineEntityMap (substr 4000 = now a no-op) → QBO
```

Source values come from the frozen `invoice_statement` copy (`iss.name AS statement_name` = line title, `iss.description AS statement_description`, `iss.tech_story`) — `api/src/Reporting/Export/Service/InvoiceGenerator.php:273-275`. ⚠️ The alias `statement_name` means the **line title**.

The UI half is label/placeholder-only in three Vue components plus the import template; the import half is a header-normalization step before `validateHeaders()`.

## 3. Technical Decisions

- **D1 — Cut lives in the shared builder, not the QBO map** (agent). The composer shortens to `QuickbooksService::DESCRIPTION_MAX_LENGTH` (4,000, `api/src/Bookkeeping/Domain/Service/QuickbooksService.php:50`) **bytes** with `mb_strcut(..., 'UTF-8')`, so both routes emit identical text (S3-R4) and no character is split (S3-R7). After the cut, a dangling separator fragment (`" -"` / `" - "`) and trailing spaces are removed so S3-R3 still holds. Bytes rather than characters because Intuit's 4,095 unit is unknown and a byte cap is safe under both readings (PRD §4). `InvoiceLineEntityMap.php:36` `substr(..., 0, 4000)` becomes a no-op for labor rows and is left as-is (it still guards non-labor rows; changing sibling maps is out of scope). *Consequence, accepted and told to Product:* the downloaded report is now shortened too — today it has no cap.
  - Import of `QuickbooksService` into Reporting would create a Reporting→Bookkeeping dependency; instead define `StatementLineText::MAX_BYTES = 4000` with a docblock pointing at `QuickbooksService::DESCRIPTION_MAX_LENGTH`. (Reporting already feeds Bookkeeping, not vice-versa — don't invert that.)
- **D2 — Extract the composer into a pure final class** `StatementLineText` beside `InvoiceData.php`, with a static `compose(?string $title, ?string $description, ?string $techStory): string`. `InvoiceData::buildStatementDescription()` delegates. Reason: the private method is the most business-critical string in this change and has zero direct tests (NFR-001).
- **D3 — Presence test** (agent). A segment is absent when `null` or `trim($value) === ''`; the narrative is additionally absent when it equals `Line::TECH_STORY_MISSING_MESSAGE` (`api/src/VehicleService/WorkOrders/Domain/Line/Line.php:29`). Present values are carried **verbatim** (not trimmed) per S3-R8. Compare against the constant, don't re-type the literal.
  - Reading `Line::TECH_STORY_MISSING_MESSAGE` from Reporting is a read of a public domain constant, same as the Twig templates' literal; acceptable.
- **D4 — Import compatibility by header normalization** (agent). In `WorkOrderHistorical/ImportCommandHandler`, `REQUIRED_HEADERS` slots 15/16 become `'*Line Title'` / `'Line Description'`, and `validateHeaders()` maps the two legacy spellings (case-insensitive, after trim) onto the new ones **before** the ordered comparison. Rows are read positionally (`$data[15]`, `$data[16]`), so nothing else changes. Mixed files (S4-R4) work naturally because each slot is normalized independently.
- **D5 — `stack-label` on all five fields** (agent). Quasar makes the placeholder transparent on a labeled, non-floated field (`app/node_modules/quasar/src/components/field/QField.sass:399-403`); without `stack-label` FR-003 silently fails. Precedent: `app/src/components/ts/schedule-next/dialogs/AssignWorkOrderDialog.vue:48-68, 489-490`. The design's after-boards show a floated label with the placeholder beneath it, which is exactly the `stack-label` look.
- **D6 — Picker placeholder is gated** on `CannedLineSelect`'s internal `line === null`. A `use-input` `q-select` renders the input beside the selection, so a static placeholder would sit next to the picked canned-line name (`QSelect.js:1631-1637`).
- **D7 — Required message via the shared validator** (PRD S1-R6, updated): `validateRequired('Title')` → "Title is a required field" (`app/src/utils/validations.ts:3-6`), in both `CannedLineSelect.vue:9` and `LineDialog.vue:57`. `e2e/src/enums/error-codes.ts:30` `TITLE_MISSING_ERROR` already holds that string and is currently unused; the e2e implementer confirms it isn't reserved for another domain before reusing it, else adds a line-dialog-specific constant.
- **D8 — ShopCoach empty-cell fallback in sentence case** (agent; from a design note, not a PRD rule) — S2-R2 "same placeholders"; the design notes the after-boards are sentence case.
- **D9 — Ship order** (agent): BE phases (1–2) before/with FE phases (3–4) in the same release — NFR-002.
- **D10 — `WorkOrderValidator` left untouched.** It has no callers (the live importer is `WorkOrderHistorical`, per the user); renaming or deleting it has no runtime effect.
- **D11 — Import scope is wording only** (user). Story 4 keeps the header rename, template and banner text, and the legacy-header mapping (without it every saved template breaks on release day). Better import error messages are left for a separate imports epic; Product has reworded S4-N1 accordingly.

No new dependencies.

## 4. Database Changes

**None.** No schema, mapping, or data change. Field names `line_name`, `description`, `tech_story` stay (PRD §2 Out of scope). No backfill (S3-N1). The migration gate does not apply.

## 5. API Changes

**No endpoint shapes change.**
- `GET /api/reporting/export/customer_invoice` — same route, same `#[IsGranted(PermissionEnum::ROLE_INVOICE_VIEW)]`, same columns; the `ItemDescription` value of labor rows changes format and may be shortened (FR-008–FR-011).
- `POST /api/imports/work-order-historical` — same contract; accepts two additional header spellings (FR-016). Error messages for genuinely wrong headers unchanged (FR-018).
- QuickBooks Online payload — `Line[].Description` for labor lines changes format (outbound, no API of ours).

## 6. Implementation Phases

### Phase 1: Line-text builder (BE)
**Implements:** FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014, NFR-001, NFR-004
**Depends on:** Nothing

#### Database changes:
None.

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Reporting/Export/Application/CustomerInvoiceExport/CustomerInvoiceExportDetails/StatementLineText.php` | Create | `final class StatementLineText` — `compose()` joins present segments with `" - "`, drops the tech-story placeholder, cuts to `MAX_BYTES` UTF-8-safely, strips a dangling separator |
| `api/src/Reporting/Export/Application/CustomerInvoiceExport/CustomerInvoiceExportDetails/InvoiceData.php` | Modify | `buildStatementDescription()` (`:334-337`) delegates to `StatementLineText::compose($row['statement_name'], $row['statement_description'], $row['tech_story'])`. Call site `:158` unchanged |

Do **not** touch `InvoiceLineEntityMap.php`, the part/shop-supplies/adjustment description expressions (`StatementData.php:70`, `InvoiceData.php:259`, `:304`), credit-memo builders, or `ExternalInvoiceLineGenerator` (dead, SV-8713).

#### Key code changes:

```php
// api/src/Reporting/Export/Application/CustomerInvoiceExport/CustomerInvoiceExportDetails/StatementLineText.php
final class StatementLineText
{
    /** Mirrors QuickbooksService::DESCRIPTION_MAX_LENGTH; bytes, so it is safe whichever unit Intuit's 4,095 is. */
    public const int MAX_BYTES = 4000;

    private const string SEPARATOR = ' - ';

    public static function compose(?string $title, ?string $description, ?string $techStory): string
    {
        if (Line::TECH_STORY_MISSING_MESSAGE === $techStory) {
            $techStory = null;
        }

        $segments = array_filter(
            [$title, $description, $techStory],
            static fn (?string $segment): bool => null !== $segment && '' !== trim($segment),
        );

        // Tail-only trim: S3-R3 forbids a trailing space; S3-R8 keeps every value otherwise verbatim.
        $text = rtrim(implode(self::SEPARATOR, $segments));

        if (strlen($text) <= self::MAX_BYTES) {
            return $text;
        }

        // Cut on a character boundary, then drop a separator (or part of one) the cut left dangling.
        return rtrim(preg_replace('/(?: -)+ ?$/', '', rtrim(mb_strcut($text, 0, self::MAX_BYTES, 'UTF-8'))) ?? '');
    }
}
```
_(Implementer: the trailing-fragment strip must only remove our separator remnant; a value that itself ends in `-` without a preceding space must survive — cover it in the test.)_

#### Unit / Integration tests:
- **Create** `api/tests/Unit/Reporting/Export/Application/CustomerInvoiceExport/CustomerInvoiceExportDetails/StatementLineTextTest.php` (data provider):
  - all three present → `"Replace tie rod - excessive play - Both outer ends worn, replaced and aligned"`
  - no description → `"Replace tie rod - Both outer ends worn, replaced and aligned"` (S3-E1)
  - no narrative / narrative `''` / narrative `'   '` / narrative `'Tech story missing.'` → `"Replace tie rod - excessive play"`
  - title only → `"Replace tie rod"`
  - values containing `" - "`, `;`, and inner/leading spaces are carried verbatim (S3-R8/R9/R9a); a last segment ending in `\n` or spaces produces no trailing whitespace (S3-R3)
  - no output ever contains `"What are you doing"`, `"Tech Story:"`, `";"` introduced by us
  - over-length ASCII → exactly ≤ 4000 bytes, starts with the title
  - over-length with multibyte (`é`, `ü`, CJK, 4-byte emoji) placed across the 4000-byte boundary → `mb_check_encoding($out, 'UTF-8')` true, `strlen <= 4000`
  - cut landing inside/just after a separator → no trailing `" -"` or space
  - a description ending in a bare `"-"` (no preceding space) at the boundary survives; a hyphen-only description cut as `"Title - -"` ends as `"Title"`
- **Modify** `api/tests/Unit/Reporting/Export/Service/InvoiceGeneratorTest.php` / add a case to `api/tests/Functional/Reporting/Export/CustomerInvoiceExportTest.php`: a labor row's `ItemDescription` equals the new format (and masking of rate/amount/tax/average cost is unchanged for a pricing-blind user — FR-013).
- **Modify** `api/tests/Unit/Bookkeeping/Application/Service/Sync/InvoiceCreateSyncServiceTest.php` if it asserts the old composite; add an assertion that the `InvoiceLineDto` description equals the builder's output (FR-010).

#### Verification (Definition of Done gates):
- **Static (scoped):** `composer cs-fix` on changed files; `vendor/bin/phpstan analyse <changed files>` (clear result cache first); `./vendor/bin/pest` on the new/changed tests
- **Smoke:** `bin/smoke-test.sh` — no 500s; then download Administration → Export Reports → Customer Invoice for a range containing a labor line and read `ItemDescription`
- **Browser-walk:** none (no UI)

#### E2E tests (e2e/):
None — the line text is not UI; BE unit/functional tests are the cheapest layer that can observe it (test-scope-rules §3).

---

### Phase 2: Historical invoice import header compatibility (BE)
**Implements:** FR-015, FR-016, FR-018, NFR-002
**Depends on:** Nothing (independent of Phase 1; must ship no later than Phase 4). Header names confirmed by Product (S4-R2).

#### Backend changes (`api/`):
| File | Action | Description |
|------|--------|-------------|
| `api/src/Administration/Import/Application/WorkOrderHistorical/ImportCommandHandler.php` | Modify | `REQUIRED_HEADERS` `:62-63` → `'*Line Title'`, `'Line Description'`; add `LEGACY_HEADER_ALIASES`; `validateHeaders()` (`:683-693`) normalizes legacy spellings before the existing comparison; the throw at `:281-282` is unchanged |

#### Key code changes:

```php
// api/src/Administration/Import/Application/WorkOrderHistorical/ImportCommandHandler.php
/** Pre-rename spellings (SV-10133). Templates are kept for years, so old files must keep validating. */
private const array LEGACY_HEADER_ALIASES = [
    '*LINE TITLE - WHAT ARE YOU DOING' => '*LINE TITLE',
    'LINE DESCRIPTION - WHY ARE YOU DOING IT' => 'LINE DESCRIPTION',
];

/** @param array<int,string> $headers */
private function validateHeaders(array $headers): bool
{
    $upperCaseHeaders = array_map(strtoupper(...), self::REQUIRED_HEADERS);
    $upperCaseInputHeaders = array_map(
        static fn (string $header): string => self::LEGACY_HEADER_ALIASES[strtoupper(trim($header))] ?? strtoupper(trim($header)),
        array_slice($headers, 0, 24),
    );

    return $upperCaseHeaders == $upperCaseInputHeaders;
}
```

Row reading (`$data[15]`, `$data[16]`) is positional and unchanged. `WorkOrderValidator` (dead) is not touched.

#### Unit / Integration tests:
- **Modify** `api/tests/Functional/Administration/Import/WorkOrderHistorical/ImportCommandHandlerTest.php` (`buildCsv()` / header helper): default to the **new** headers; add cases:
  - legacy headers → imports identically (same lines, titles, descriptions as the new-header file)
  - mixed: new `*Line Title` + legacy `Line Description - Why are you doing it` → imports
  - genuinely wrong header in slot 15 (e.g. `Line Name`) → still rejected with `Invalid file headers provided!` (FR-018)
  - legacy title header placed in slot 16 → rejected
- Keep `WorkOrderLineImportDtoTest` etc. untouched unless they hardcode the header strings.

#### Verification:
- **Static (scoped):** cs-fix, phpstan, pest on the handler test
- **Smoke:** `bin/smoke-test.sh`
- **Manual:** upload an old-template CSV and a new-template CSV via Administration → Invoices import as `admin`; both import

#### E2E tests (e2e/):
Covered in Phase 5 (reference-breakage + legacy-header workflow).

---

### Phase 3: Line dialog + ShopCoach labels and placeholders (FE)
**Implements:** FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, NFR-003
**Depends on:** Nothing (can run in parallel with Phases 1–2)

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/ts/work-orders/CannedLineSelect.vue` | Modify | Add `placeholder?: string` to `defineProps` (`:105-117`); on `<Select>` bind `:placeholder="line === null ? placeholder : undefined"` and `stack-label`; rule `:9` → `validateRequired('Title')`. Leave `focusOnMount`/`autofocus` as-is |
| `app/src/components/ts/work-orders/LineDialog.vue` | Modify | `:41` → static `label="Title"` + `placeholder="What are you doing?"` (drop the `cannedLineEmpty` ternary **on this line only**); `:57` → `validateRequired('Title')`; `:60` → `label="Title"` + `placeholder="What are you doing?"` + `stack-label`; `:72` → `label="Description"` + `placeholder="Why are you doing it?"` + `stack-label` |
| `app/src/components/ts/shopcoach/ShopCoachVehicleLines.vue` | Modify | `:44` → `label="Title"` + placeholder + `stack-label`; `:72` → `label="Description"` + placeholder + `stack-label`; `:55` / `:89` fallback spans → `'What are you doing?'` / `'Why are you doing it?'` |

🔴 **Do not** remove the `cannedLineEmpty` ref or any of its other 12 uses (`LineDialog.vue:67, 124, 147, 164, 286, 298, 714-715, 963, 1258, 1403, 1408`) — `:1258` chooses `addLine()` vs `submitCreationFromCannedLine()`. Do not rename `data-test-id`/`-suffix` values.

#### Key code changes:

```vue
<!-- app/src/components/ts/work-orders/CannedLineSelect.vue -->
<!-- stack-label: Quasar hides the placeholder on a labeled field until the label floats
     (q-field--labeled:not(.q-field--float) ::placeholder { color: transparent }). -->
<Select
  ...
  :label="label"
  stack-label
  :placeholder="line === null ? placeholder : undefined"
  :rules="[validateRequired('Title')]"
/>
```

#### Unit / Integration tests:
- `app/src/components/ts/work-orders/tests/LineDialog.spec.ts`: update `getInput(...)` at `:735, :736, :808, :2411` to `'Title'` / `'Description'`. Add:
  - label reads "Title" with the picker empty **and** after a canned line is selected (S1-R4 regression guard)
  - `getByPlaceholderText('What are you doing?')` and `('Why are you doing it?')` present while empty (create and edit mode)
  - empty Title save shows exactly "Title is a required field" (create and edit mode)
- `app/src/components/ts/work-orders/tests/CannedLineSelect.spec.ts`: placeholder passed while `line === null`, not passed once selected (use the existing `clearableSelectStub` pattern at `:233-245`)
- ShopCoach: no new spec (label-only)

#### Verification:
- **Static (scoped):** `npx eslint --max-warnings=0 <changed files>`, `npx vitest related --run <changed files>`, `npx vue-tsc --noEmit`; `npx tsx scripts/e2e-precheck.ts --files=<paths>` from `e2e/`
- **Compile:** Vite up, no errors
- **Browser-walk (`admin`):**
  1. Open a work order → Add line → **New Line**: picker labelled "Title", "What are you doing?" visible immediately; tab away with it empty → placeholder still visible; Description shows "Why are you doing it?" while empty. Pick a canned line → no placeholder text beside the selected name.
  2. Save with empty Title → "Title is a required field".
  3. Open an existing line → **Edit Line**: "Title" / "Description" labels, placeholders visible when cleared; saved values unchanged.
  4. Mobile width (≤ 600px): same words in the same fields.
  5. ShopCoach builder: both editors labelled, placeholders visible, empty cells read in sentence case; **screenshot the table** — cells must not grow/shift (risk R2).

#### E2E tests (e2e/):
- Happy path: New Line from canned line shows Title/placeholder then clears on pick (Update `@C26742`)
- Happy path: Edit Line shows Title/Description; empty Title blocked with message (Create)
- Happy path: ShopCoach builder labels (Update `line-builder.spec.ts`)

---

### Phase 4: Import template and on-screen column list (FE)
**Implements:** FR-015, FR-017, NFR-002
**Depends on:** Phase 2 (same release or earlier)

#### Frontend changes (`app/`):
| File | Action | Description |
|------|--------|-------------|
| `app/src/components/ts/administration/imports/InvoicesDataImport.vue` | Modify | Banner prose `:87-88` → `… Item, Line Title, Line Description, Tech Story, …`; template header `:249` → `…,*Item,*Line Title,Line Description,Tech Story,…`. Only those two tokens change; the other 22 columns and the order stay byte-identical |

#### Unit / Integration tests:
- `app/src/components/ts/administration/imports/tests/InvoicesDataImport.spec.ts`: assert the generated template header contains `*Line Title,Line Description,` and not `What are you doing`.

#### Verification:
- **Static (scoped):** eslint, vitest related, vue-tsc
- **Compile:** Vite clean
- **Browser-walk (`admin`):** Administration → Invoices import: banner lists the new names; download the template → header row shows `*Line Title,Line Description`; upload that same file (with one labor row) → imports

#### E2E tests (e2e/):
- Happy path: legacy-header file still imports; downloaded template shows new headers (Update `invoices-import.spec.ts`)

---

### Phase 5: E2E reference-breakage + new coverage
**Implements:** coverage for FR-001–FR-006, FR-015–FR-017 (FR-007 has no E2E — no behavior change)
**Depends on:** Phases 2–4

Run via `/e2e-after-change` (hard-block). Reference-breakage items are mandatory and uncapped; see §7.

| File | Action |
|------|--------|
| `e2e/src/pages/dialogs/edit-line.dialog.ts:26-27` | `@aria-label='What are you doing?'` → `'Title'`; `'Why are you doing it?'` → `'Description'` (scope to the dialog to avoid the vendor-contact `aria-label='Title'` collision) |
| `e2e/src/utils/invoice-import-csv.ts:39-40, 79` | New header names; keep a `LEGACY_HEADERS` option for the compatibility test |
| `e2e/tests/ui/administration/invoices-import.spec.ts:412` | Row key → `'*Line Title'` |
| `e2e/tests/ui/administration/imported-invoice-views.spec.ts:185, 193` | `setCell` keys → new names |
| `e2e/src/pages/dialogs/new-line.dialog.ts:435-460`, `e2e/tests/ui/work-orders/new-line-from-canned-line.spec.ts:14`, `invoices-import.spec.ts:784` | Refresh stale comments |

---

## 7. Testing Strategy

### Unit tests (`api/` and `app/`)
- **BE:** `StatementLineTextTest` is the core (see Phase 1 matrix). Import handler functional tests for new/legacy/mixed/wrong headers.
- **FE:** `LineDialog.spec.ts` (labels static, placeholders, required message), `CannedLineSelect.spec.ts` (placeholder gating), `InvoicesDataImport.spec.ts` (template header).
- **Edge cases:** multibyte characters across the 4,000-byte boundary; `"Tech story missing."`; whitespace-only description; values containing `" - "`; a cut landing on the separator.

### Integration tests
- Customer Invoice export functional test: labor `ItemDescription` in new format; masking unchanged for a pricing-blind user.
- `InvoiceCreateSyncService` unit test: `InvoiceLineDto` description equals the builder output (proves the one-builder contract).

### Manual testing checklist
1. With a QBO-connected staging org, create an invoice from a WO with a labor line (title + description + tech story) → the QBO invoice line reads `Title - Description - Story`.
2. Same with Require Tech Story **off** and no story typed → line ends after the description, no trailing hyphen.
3. Same with a description of ~5,000 characters including accented text → invoice syncs (not in Unexported Items); description cut, valid text, title intact.
4. Download Customer Invoice report for the same range → `ItemDescription` identical to what QBO received.
5. Parts / shop supplies / fee rows unchanged in both.
6. An invoice synced before release is untouched in QBO.

### E2E tests
**Reference-breakage (mandatory, not capped):** the four functional sites in the Phase 5 table (`edit-line.dialog.ts`, `invoice-import-csv.ts`, `invoices-import.spec.ts:412`, `imported-invoice-views.spec.ts:185,193`), plus the stale-comment refresh in three files.

**New / updated coverage (4 workflows, within `batchCap = 5`):**

**Test: New line from canned line shows the Title field with its prompt** (Happy path, FR-001, FR-003) — Update `e2e/tests/ui/work-orders/new-line-from-canned-line.spec.ts` (`@C26742`)
1. Open a work order as a service writer, click Add line
2. Assert the picker's label is "Title" and placeholder "What are you doing?" is visible without typing
3. Assert the Description field shows "Why are you doing it?"
4. Pick a canned line
- **Expected:** label still "Title"; the placeholder text is no longer shown; line saves as today

**Test: Edit line names the fields and blocks an empty title** (Edge case, FR-001, FR-002, FR-004) — Create `e2e/tests/ui/work-orders/line-dialog-title-description.spec.ts`
1. Open an existing labor line (Edit Line)
2. Assert fields labelled "Title" and "Description" with their existing values
3. Clear Title, click Save & Close
- **Expected:** "Title is a required field" (`ErrorCodes.TITLE_MISSING_ERROR`, see D7); dialog stays open; line unchanged

**Test: ShopCoach builder uses Title and Description** (Happy path, FR-006) — Update `e2e/tests/ui/line-builder.spec.ts`
1. Open the ShopCoach line builder on a work order
2. Enter edit on a line's title and description cells
- **Expected:** editors labelled "Title" / "Description"; empty cells show "What are you doing?" / "Why are you doing it?"

**Test: Invoice import accepts old and new column names** (Edge case, FR-016, FR-017) — Update `e2e/tests/ui/administration/invoices-import.spec.ts`
1. Administration → Invoices import; download the template
2. Assert header row contains `*Line Title,Line Description`
3. Upload a file built with the **legacy** headers
- **Expected:** import succeeds; imported invoice shows the line title and description

**Backlog:** none.
**No E2E for FR-008–FR-014** — non-UI; owned by BE unit/functional tests (cheapest observing layer).

## 8. Rollback Plan

- Pure code change, no schema or data migration → revert the merge commit(s) and redeploy.
- QuickBooks: invoices synced while the new build was live keep the new text; nothing is rewritten on rollback (same as rollout, S3-N1). Mixed forms in one set of books are already accepted (S3-E2).
- Import: rolling back Phase 2 while Phase 4 stays live breaks template round-trips → roll back Phases 2 and 4 together (they ship in the same release per NFR-002).

## 9. Security Considerations

- Report stays gated by `#[IsGranted(PermissionEnum::ROLE_INVOICE_VIEW)]` (`CustomerInvoiceExportController.php:16`); no change.
- Pricing-blind masking unchanged; line text is not money (FR-013).
- No tenant-scoping changes; the generator's existing org scoping is untouched.
- UTF-8-safe cut removes a path that could send malformed UTF-8 to a third party (NFR-004).
- No user input is newly interpreted: values are joined verbatim, not escaped (S3-R9 accepted by Product).

## 10. Requirement Traceability

| Requirement | Phase | Layer | Files | Status |
|-------------|-------|-------|-------|--------|
| FR-001 | Phase 3 | App | app/src/components/ts/work-orders/LineDialog.vue, CannedLineSelect.vue | Planned |
| FR-001 | Phase 5 | E2E | e2e/tests/ui/work-orders/new-line-from-canned-line.spec.ts, line-dialog-title-description.spec.ts | Planned |
| FR-002 | Phase 3 | App | app/src/components/ts/work-orders/LineDialog.vue | Planned |
| FR-002 | Phase 5 | E2E | e2e/tests/ui/work-orders/line-dialog-title-description.spec.ts, e2e/src/pages/dialogs/edit-line.dialog.ts | Planned |
| FR-003 | Phase 3 | App | app/src/components/ts/work-orders/LineDialog.vue, CannedLineSelect.vue | Planned |
| FR-003 | Phase 5 | E2E | e2e/tests/ui/work-orders/new-line-from-canned-line.spec.ts | Planned |
| FR-004 | Phase 3 | App | app/src/components/ts/work-orders/LineDialog.vue, CannedLineSelect.vue | Planned |
| FR-004 | Phase 5 | E2E | e2e/tests/ui/work-orders/line-dialog-title-description.spec.ts | Planned |
| FR-005 | Phase 3 | App | app/src/components/ts/work-orders/LineDialog.vue (+ LineDialog.spec.ts) | Planned |
| FR-005 | Phase 5 | E2E | e2e/tests/ui/work-orders/line-dialog-title-description.spec.ts (existing values shown, line unchanged) | Planned |
| FR-006 | Phase 3 | App | app/src/components/ts/shopcoach/ShopCoachVehicleLines.vue | Planned |
| FR-006 | Phase 5 | E2E | e2e/tests/ui/line-builder.spec.ts | Planned |
| FR-007 | Phase 3 | App | app/src/components/ts/shopcoach/ShopCoachVehicleLines.vue (no logic change) | Planned |
| FR-008 | Phase 1 | API | api/src/Reporting/Export/Application/CustomerInvoiceExport/CustomerInvoiceExportDetails/StatementLineText.php | Planned |
| FR-009 | Phase 1 | API | StatementLineText.php | Planned |
| FR-010 | Phase 1 | API | InvoiceData.php, InvoiceCreateSyncServiceTest.php | Planned |
| FR-011 | Phase 1 | API | StatementLineText.php | Planned |
| FR-012 | Phase 1 | API | StatementLineText.php | Planned |
| FR-013 | Phase 1 | API | CustomerInvoiceExportTest.php (assert unchanged) | Planned |
| FR-014 | Phase 1 | API | (no change to other row types / credit memos — asserted by tests) | Planned |
| FR-015 | Phase 2 | API | api/src/Administration/Import/Application/WorkOrderHistorical/ImportCommandHandler.php | Planned |
| FR-015 | Phase 4 | App | app/src/components/ts/administration/imports/InvoicesDataImport.vue | Planned |
| FR-015 | Phase 5 | E2E | e2e/tests/ui/administration/invoices-import.spec.ts (template headers) | Planned |
| FR-016 | Phase 2 | API | ImportCommandHandler.php, ImportCommandHandlerTest.php | Planned |
| FR-016 | Phase 5 | E2E | e2e/tests/ui/administration/invoices-import.spec.ts, e2e/src/utils/invoice-import-csv.ts | Planned |
| FR-017 | Phase 4 | App | InvoicesDataImport.vue | Planned |
| FR-017 | Phase 5 | E2E | e2e/tests/ui/administration/invoices-import.spec.ts | Planned |
| FR-018 | Phase 2 | API | ImportCommandHandlerTest.php | Planned |
| NFR-001 | Phase 1 | API | api/tests/Unit/Reporting/Export/Application/CustomerInvoiceExport/CustomerInvoiceExportDetails/StatementLineTextTest.php | Planned |
| NFR-002 | Phases 2+4 | API/App | release ordering | Planned |
| NFR-003 | Phase 3 | App | browser-walk | Planned |
| NFR-004 | Phase 1 | API | StatementLineText.php | Planned |

## 11. Verification Tickets

_Filled in by Phase 10 after the plan is approved._

| Ticket | Title | Covers | Linked stories | Assignee |
|--------|-------|--------|----------------|----------|
| [SV-10390](https://shopview.atlassian.net/browse/SV-10390) | Verify QuickBooks and report line text | Phase 1 / FR-008–FR-014, NFR-001, NFR-004 | SV-10132 | Nemanja Djuric |
| [SV-10391](https://shopview.atlassian.net/browse/SV-10391) | Verify line dialog and ShopCoach labels and placeholders | Phase 3 / FR-001–FR-007, NFR-003 | SV-10130, SV-10131 | Nemanja Djuric |
| [SV-10392](https://shopview.atlassian.net/browse/SV-10392) | Verify invoices import wording and old-template compatibility | Phases 2+4 / FR-015–FR-018, NFR-002 | SV-10133 | Nemanja Djuric |
| [SV-10393](https://shopview.atlassian.net/browse/SV-10393) | Verify E2E coverage updated | Phase 5 | SV-10130–SV-10133 | Nemanja Djuric |

When all these tickets are marked Done, the feature is ready for QA.