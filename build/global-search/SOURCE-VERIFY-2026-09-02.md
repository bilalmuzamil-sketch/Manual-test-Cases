# Global Search V2 — Source verification 2026-09-02 (decision record)

**Trigger:** QA lead asked to re-source-verify the Global Search suite (his manual testing suite);
suspects some cases are outdated. This is a **V2 of an existing feature** (Rule 96 / skill 17): V2 must
not break V1 behaviour unless the design/PRD says to drop it.

**Suite:** group **6720** *Global Search V2 (Aug 2026)*, **118 cases, all ours (`created_by = 3`)**,
23 sections. Run **R415**. No QA build exists yet (Rule 85) — cases are source-verified only; the
suite marker literal is *"AUTOMATION: Not available on Build to test Yet"* (kept as-is, suite-wide).

## 1 · Sources, current versions (all read live 2026-09-02)

| Source | Cases were built against | CURRENT | Delta |
|---|---|---|---|
| **Spec** (Confluence 576978945) | v1.2 (Confluence v11) | **v1.3, 2026-09-01, Branko Cicovic** | large change log |
| **Epic SV-9160** | 24 children | **26 children, bulk-updated 2026-08-31** | scope narrowed |
| **Design** | Figma capture (old) | **Claude Design export — v9 = v10 = v11 byte-identical**; behavioural source `global-search.jsx` | new format |
| **Q&A** | none | **2 Slack threads** (Branko designer+PO; Milos PO) | new decisions |

## 2 · Precedence ruling (QA lead, 2026-09-02)

**Latest decision wins + disclose.** Where the Slack answers / the page's engineering comments / the
design conflict with what spec v1.3 still literally says, the case follows the **latest** source and
carries a **divergence line** (Rule 56) naming which source it followed. Genuinely-open items go to a
**PO question sheet** (Rule 66), not silently resolved. TestRail writes authorised **direct**
(Rule 6 satisfied for this pass).

## 3 · The rulings applied (what changed vs our v1.2 cases)

| # | Area | v1.2 cases said | NOW (authoritative) | Source |
|---|---|---|---|---|
| R1 | **Contacts** | Contacts a standalone entity + tab + group (9 entities) | **NOT a standalone group. 8 entities.** A contact-field match returns the **company row** with a "Contact match" secondary label | spec v1.3 §2/§4/§5.2/§6; design `matches()` comment; epic |
| R2 | **Scope tabs** | All + 9 (incl. Contacts) = 10 tabs | **All + 8 = 9 tabs**, order All · Work Orders · Customers · Assets · Parts · Vendors · Part Sales · Purchase Orders · Vendor Invoices | spec §5.2; design `SEARCH_TABS` |
| R3 | **Group order** | …Customers · Contacts · Assets… | **WO · Customers · Assets · Parts · Vendors · Part Sales · PO · Vendor Invoices** (no Contacts) | spec §6.2; design `SECTIONS` |
| R4 | **Quick actions** | moved to *Out-of-V1* (8 cases) | **BACK in v1**, shown unconditionally; set incl. `View part history` on Part | spec v1.3 §5.4 + design (both newer than the epic's stale "out" bullet) |
| R5 | **Show-all landing** | banner "Showing N… matching «q»", page search box empty, filters parked | **No banner. Term goes into the page's normal search box. Saved filters RESET.** | Branko Slack #7 (overrides spec v1.3 §5.2 banner text) |
| R6 | **Assets Show-all** | general show-all rule | **Assets get no "Show all"** (no vehicles list page to land on) | Branko Slack #4 |
| R7 | **WO row anatomy** | lead tech + date shown | **unit number + year/make/model** (falls back to y/m/m when no unit #); tech/advisor/date indexed but not shown | spec v1.3 §4 |
| R8 | **Part row nav** | (unspecified/catalogue) | opens the **inventory part, not the catalogue entry** | spec v1.3 §5.3 |
| R9 | **Empty/first-time state** | quick-create buttons / helper | single helper line, no quick-create. Wording: spec says **"Search for something"**; design renders **"Type to start searching for work orders, parts, customers and more"** → PO-confirm exact string; case follows spec wording meanwhile | spec v1.3 §5.2; design |
| R10 | **Customer ranking** | "created in last 90 days → +0.05" | **signal dropped**; a customer create is treated as a **touch** in the recent-views store (rides "viewed in last 7 days → +0.10") | Milos Slack #2 (overrides spec v1.3 §6.1) |
| R11 | **Part ranking** | sold/used last 30 days +0.15 | **kept** (computed over `inventory_changes` ledger) | Milos Slack #3 (agrees with spec) |
| R12 | **Contact email/phone findability** | (some cases dropped it) | **KEPT** — customers/vendors findable by a contact's phone/email (indexed on the parent) | Milos Slack #4 (agrees with spec §4) |
| R13 | **Vendor Invoice badge** | Paid / Unpaid (2) | **all statuses / tri-state** (Paid · Partially paid · Unpaid) — use the design-system status-to-tone map, no invented palette | eng comment 8-17; Nikola Slack #3; spec §5.3 |
| R14 | **Stock & status colours** | (some invented a scale) | **use the app's current design-system colours/badges** — search invents no palette | Nikola Slack #5/#6; spec §5.3 |
| R15 | **Telemetry (§6.4)** | a Search Telemetry case in v1 | **out of v1** (SV-9167 → v2); move that case to Out-of-V1 | epic; page comment 8-20 |
| R16 | **AI / "ask a question"** | out (already) | **stays out**; design still draws an AI row but spec §2 excludes it | spec §2; eng comments |
| R17 | **Pagination in popup** | — | **no pagination**; tabs filter the fetched set; "Show all" is the only way to more | Nikola Slack #1 |
| R18 | **Status not matchable** | — | typing a status name does **not** return records with that status (status stored for ranking/badge only) | spec v1.3 §4 |

## 4 · Open item → PO question sheet (Rule 66)

- **PO-GS-VI-1 — Vendor Invoice "type (Invoice / Sublet)".** Spec §4 and the design show a type label
  Invoice/Sublet, but **sublet does not exist anywhere in the platform** and Milos (#1) said he needs
  Branko's help. Case held as PO-question; do not assert the type label until confirmed.
- Carry any other genuinely-ambiguous item here rather than guessing.

## 5 · Disposition (scaffold, refined during execution) — `/tmp/gs_disposition.json`

| Disposition | Count | Meaning |
|---|---|---|
| REVIEW → CURRENT | ~77 | re-verify against v1.3/design; re-stamp provenance to v1.3; no behaviour change |
| UPDATE | ~31 | rewrite to the ruling above + divergence line |
| RESTORE→v1 | 8 | quick-action cases move back from Out-of-V1 into v1 sections |
| MOVE→Out-of-V1 | 1 | telemetry (C45140) |
| RETIRE/REWORK | 1 | Contacts entity (C44895) → contact-match-returns-company |
| PO-QUESTION | 1 | VI Sublet (held) |

## 6 · Write mechanics (Rule / playbook §J)

- Body format is block `<ol><li>` + `<hr>` provenance `<p>` + AUTOMATION `<p>`. Keep block-only HTML
  (no inline styling tags, no `<br>` via API).
- **Render container:** the suite is MIXED — some cases are `fr-view`, some in the escaping container.
  An API `update_case` lands the field in the escaping container, so **every edited case gets a
  served-page scan + UI render-repair to `fr-view`** afterward (Playwright → Froala `html.set` → Save),
  per playbook §J / `build/*/render-repair-*`.
- Provenance re-stamp: *"…specification version 1.3 (Confluence page 576978945), <section/story>, read
  on 2026-09-02."* Divergence line added where the case follows a Slack/comment decision over spec text.
- After writes: union-sync run R415 (Rule 34), backfill id-map, post-write render self-check + served
  container scan, PROJECT-STATE update, five-table report + PO sheet.

**Provenance of this record:** spec v1.3 (read 2026-09-02), epic SV-9160 + 26 children (2026-08-31),
design v9/10/11 (identical), page comments (8-12 … 8-20), and the two Slack threads the QA lead relayed
2026-09-02.
