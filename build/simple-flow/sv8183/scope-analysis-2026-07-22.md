# SV-8183 (SV8183_1) — Scope Analysis vs the existing Simple Flow suite

- **Date:** 2026-07-22
- **Driving ticket:** SV-8183 (Epic **SV-7301**) — "Permission: Simple Flow —
  enforcement mapping to existing WO / Parts / Settings atoms"
- **PO:** Milos (Milos Vasic) — never mix PO attributions
- **Source doc:** `30d7e948-SV8183_1.doc` → full verbatim extract in
  `requirements-SV8183_1.md`
- **Prior ingest of the SAME story:** `build/simple-flow/SV-8183-permissions-source.md`
  (from `6592ea00-SV8183.doc`, 2026-07-07)
- **Scope of this analysis:** ingest + analysis ONLY. No cases authored, no VIU
  run, no TestRail writes.

---

## 1. What SV8183_1 specifies (plain terms)

SV-8183 is the **permissions story** for Simple Flow. Its whole purpose is: Simple
Flow does **not** get its own permission — every Simple-Flow action (edit WO
settings, complete a WO, pick parts, order/create POs, receive on a WO, use the
accountant Bulk Receive page, assign a vendor to a vendor-missing PO, fix a part
number, add a vendorless part, mark a WO reviewed) is **mapped to an existing
Custom-Roles permission atom** that already ships. The doc:

1. Gives the **action → atom** mapping (17 actions).
2. Gives the **per-role behavior matrix** (11 system roles × 10 permission
   columns) derived from that mapping.
3. Lists **10 acceptance criteria** that pin the exact atom per action and resolve
   Simple Flow spec §8's open permission questions.
4. Flags **3 code drift/gap items** (leftover `operatingMode` selector, missing
   `settingsIntegrations`, unguarded feature-flags route).
5. Notes the **BE atom collapse**: `woOrderParts` / `workOrderLinesCreateAndEdit`
   / `woFullViewMode` / `woTechViewMode` / `workOrdersCreateAndEdit` all resolve to
   the same server-side atom pair, so per-role FE distinctions are **conveniences,
   not BE-enforceable boundaries**.

### Is this (a) an UPDATE or (b) NEW scope?

**(a) An UPDATE / re-export of the ALREADY-INGESTED permissions scope — NOT new
scope.** The two substantive tables (action→atom + per-role matrix) are
**byte-identical** to the 2026-07-07 export (verified programmatically:
`MATRIX identical: True`, `ACTION table identical: True`). This permission model
is already the basis of `requirements.md §9/§10` and the existing `SF-PERM-*`
cases. **No change to the permission truth table = no forced case rewrites and no
new-scope authoring driven by the mapping itself.**

### What actually changed vs the 2026-07-07 export (the real delta)

| # | Change | Significance |
|---|---|---|
| D1 | **NEW dev comment** — Dipesh Changawala, 10/Jul/26 (see §5) | Confirms BE-enforcement reality: UI blocks correctly; BE checks a bundled atom every role holds → a **direct API/cURL call bypasses per-role BE enforcement**; not Simple-Mode-specific. |
| D2 | **Related-ticket statuses advanced** | SV-7388 → **Done** (was In Progress); SV-8095 → **Done** (TESTING QA); SV-7820 → **Done** (Ready to Fix); SV-7864 → **Done** (TESTING STAGE). Per Rule 20, refs can now cite these as Done. |
| D3 | **SV-7870 (Story 16 Review ON) → Blocked** (was In Progress) | Review-ON dependency is now Blocked — relevant to SF-REV / SF-PERM-04/07/08 status context. |
| D4 | **SV-7696…SV-7710, SV-7876 → Blocked** (were Ready for QA) | The Simple Flow story set is Blocked in this export. |
| D5 | **Assignee** = Dipesh Changawala (was Unassigned); **Labels** = `simple-mode` | Metadata only. |

**Headline:** SV8183_1 does **not** change the Simple-Flow permission model. Its
one piece of new substance is the **dev comment confirming that per-role
enforcement is effectively FE-only** (direct API bypasses the bundled BE atom) —
which our suite already captures in **SF-PERM-06**. Everything else is
ticket-status / metadata refresh.

---

## 2. VERBATIM truth table (ground truth for later authoring/VIU — Rule 15)

Cited to the exact rows of the SV8183_1 "Resulting per-role behavior" matrix
(`requirements-SV8183_1.md` → *Resulting per-role behavior*). **This is identical
to the 2026-07-07 export and to `requirements.md §9/§10`.**

### 2A. Action → gating atom (17 rows, verbatim)

| Action | Story | Gated by (atom) |
|---|---|---|
| See/edit WO Settings page | 1 | App Settings (`settingsApp`) — inherited route guard, no new gating |
| Run completion (status change) | 2/3/4/16 | Work Orders: Create & Edit |
| Approve all lines (hard gate) | all | WO Lines: Create & Edit + Full View (collapses to `ROLE_WORK_ORDER::VIEW + CREATE_AND_EDIT` at BE) |
| Enter mileage / VIN / engine hours | 2/3/4 | WO Lines: Create & Edit |
| Tech story per line | 17 | WO Lines: Create & Edit |
| Resolve inventory / special-order cores (Ok/Not OK) | 3/4/16 | WO Lines: Create & Edit |
| Add vendorless / no-part-number part | 5 | WO Lines: Create & Edit + See Financial Data (`seeFinancialData`) |
| Pick inventory parts in modal | 2/3/4 | Pick Parts (`woPickParts`) |
| Background order + create POs | 3/4/6 | Order Parts (`woOrderParts`) → requires See Financial Data |
| Receive on the WO | 3/4/11/12 | FE: Order Parts; BE: OR of `ROLE_DELIVERY_CREATE_AND_EDIT` / `ROLE_WORK_ORDER_PART_CREATE` / `ROLE_WORK_ORDER_CREATE_AND_EDIT` |
| Bulk Receive page | 7/8/9 | Vendor & Order Mgmt: Create & Edit (`hasPartsPermissions` route gate) + See Financial Data |
| Assign vendor / merge / keep-separate | 6/13 | Vendor & Order Mgmt: Create & Edit |
| Inline part-number fix → first-class part | 10 | Catalog & Inventory: Create & Edit |
| Cost/sell fields on receive screens | 8/10 | See Financial Data (visibility+edit); sell auto-locks once WO invoiced/paid (state gate, not permission) |
| Mark Reviewed / sign-off; reviewer VIN | 16 | Review Work Orders (`woReviewWorkOrders`) + reviewer ≠ completer (NET-NEW hard rule); VIN entry → WO Lines: Create & Edit |
| Waiting-on-Parts column (visibility) | 14 | Work Orders: View; click-through suppressed without receive gate |
| Go to Invoice / Create Invoice | 2/3/4 | Invoicing & Payments: Create & Edit + See Financial Data |

### 2B. Per-role behavior matrix (11 roles × 10 columns, verbatim)

| Role | Edit WO settings | Complete WO | Pick | Order/PO | Receive on WO | Bulk Receive | Assign vendor | Fix part # | Add vendorless part | Mark Reviewed |
|---|---|---|---|---|---|---|---|---|---|---|
| Admin | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Service Manager | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Senior SA | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Service Advisor | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Foreman | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Technician | No | No (1) | Yes | No | No | No | No | No | No (2) | No |
| Parts Manager | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Parts Tech | No | No (1) | Yes | Yes | Yes | Yes | Yes | Yes | No | No |
| Office | Yes | No (3) | No | No | No | No (4) | No | No | No | No |
| Sales Rep | No | No | No | No | No | No | No | No | No | No |
| Time Clock | No | No | No | No | No | No | No | No | No | No |

Notes (verbatim): (1) No completion = Tech View can't approve lines and/or no WO
C&E; Technician can still pick; Parts Tech is a receiver, not a completer. (2)
Technician has WOL C&E but no See Financial Data → cannot enter mandatory sell →
cannot add vendorless (Decision 4). (3) Office WO: View only → configures but
cannot operate. (4) Office Vendor & Order Mgmt: View only → can open Bulk Receive
but cannot receive.

**BE atom collapse (verbatim):** `woOrderParts`, `workOrderLinesCreateAndEdit`,
`woFullViewMode`, `woTechViewMode`, `workOrdersCreateAndEdit` all resolve to
`ROLE_WORK_ORDER::VIEW + CREATE_AND_EDIT` server-side → FE distinctions are not
BE-enforceable (SV-7864 Done).

---

## 3. DELTA vs the current suite

### 3A. Existing cases that MAP to SV-8183 (the permissions surface)

All are already **VIU-Verified** and already cite SV-8183 / §8 / §9 in `refs`.
C-ids from `testrail-id-map.csv`.

| Internal ID | C-id | Title (abridged) | Current `refs` | Alignment to SV8183_1 |
|---|---|---|---|---|
| SF-PERM-01 | C29405 | Only App-Settings roles view/modify WO settings | SV-7696 (S1 AC / §8 Permissions) | MATCHES AC bullet 1 |
| SF-PERM-02 | C29406 | Which roles can complete a WO | SV-8183 (§8 Permissions) | MATCHES matrix "Complete WO" column |
| SF-PERM-03 | C29407 | Which roles can Bulk Receive | SV-8183 (§8 Permissions) | MATCHES matrix "Bulk Receive" + Office view-only note (4) |
| SF-PERM-04 | C29408 | Which roles can Mark Reviewed | SV-8183 (R7 / §8 role-gating review) | Permission gate MATCHES; **self-review clause conflicts with AC** (see §3C) |
| SF-PERM-05 | C29409 | PO Receive button hidden for office/readonly | SV-7706 (S11-R3) | MATCHES receive/Order-Parts gate |
| SF-PERM-06 | C29410 | UI gating is v1 pass criterion; BE 403 on settings; completion/review NOT BE-blocked | SV-8183 (§8 BE enforcement) | **DIRECTLY MATCHES the new Dipesh dev comment** — already captures the API-bypass reality |
| SF-PERM-07 | C29411 | Review sign-off gated by Review Work Orders (not open to all) | SV-8183 (§8 role-gating review) | Gate MATCHES; **self-review clause conflicts with AC** (§3C) |
| SF-PERM-08 | C29412 | User with Mark Reviewed can self-review a WO they completed | SV-8183 (R7 — self-review permission-gated; identity rule NOT in v1) | **DIRECTLY CONTRADICTS SV-8183 AC "NET-NEW reviewer ≠ completer"** (§3C) |
| SF-PERM-09 | C29413 | Technician cannot add vendorless part (no See Financial Data) | SV-7700 (S5 / §9 See Financial Data gate) | MATCHES AC "Add vendorless" + matrix note (2) |
| SF-PERM-10 | C29414 | Complete WO follows per-role completion matrix | SV-8183 (§9 per-role completion matrix) | MATCHES matrix "Complete WO" column |
| SF-REV-09 | C29394 | Mark Reviewed gated by Review Work Orders; self-review allowed | SV-7870 (R7 role-gating) | Gate MATCHES; **self-review clause conflicts with AC** (§3C) |

### 3B. Cases AFFECTED (may need wording/expected changes) — NONE forced

- The permission **truth table is unchanged**, so no case's role→capability
  expected result needs to change from SV8183_1 alone.
- **Optional (not required) traceability enhancement:** SF-PERM-06 (C29410) could
  gain a one-line audit note citing the **Dipesh 10/Jul/26 comment** as the
  in-ticket dev confirmation of the API-bypass behavior it already describes. This
  is a metadata/notes enhancement, not a wording change — **needs confirmation**
  before any (authorized) TestRail edit.
- **No retirements** identified.

### 3C. The ONE real conflict to resolve — reviewer ≠ completer (self-review)

- **SV8183_1 AC (verbatim):** *"Mark Reviewed / sign-off requires Review Work
  Orders … **NET-NEW: enforce reviewer ≠ completer as a hard rule** … block Mark
  Reviewed for that user. This is not an atom and must be built. (Decision 3.)"*
- **Current suite (SF-PERM-04/07/08, SF-REV-09):** self-review is **ALLOWED** in
  v1; NO reviewer ≠ completer restriction; the only gate is the Review Work Orders
  permission. Our memory records this was **DESCOPED** later (self-review allowed
  when role holds Mark Reviewed; BUG-5 dropped).
- **Assessment:** the SV8183_1 AC text is the SAME July-7-era text; our descope
  decision is **more recent**. Per the **Simple Flow last-update-wins
  contradiction rule**, the descope stands and the suite is currently correct.
  **BUT** SV8183_1 re-asserts the hard rule, so this must be **explicitly
  reconfirmed with Milos** rather than silently assumed (Rule 15 — never pick a
  side silently). Flagged as **OQ-1** below. **NO case change until Milos
  confirms.**

### 3D. NEW cases needed (gaps)

**Count: 0 forced new cases.** The permission model is fully covered by the 11
existing cases above.

- **Possible (needs confirmation) coverage additions** — only if the user wants
  explicit dev-comment / drift coverage; NONE are required by a scope change:
  1. An **API-bypass negative** as an explicit case: "a role lacking Work Orders:
     Create & Edit can still complete a WO via a direct API call (HTTP 200) — v1
     accepts this; UI gating is the pass criterion." *This is already folded into
     SF-PERM-06 point 3; a standalone API case (API-titled section per Rule 4)
     would only be additive — **needs confirmation**.*
  2. Drift items (D-drift): leftover `operatingMode` selector removed; missing
     `settingsIntegrations`; unguarded feature-flags route. These are **dev
     fix/track items, not test-case scope** (and `operatingMode`-absent is already
     covered by SF-SET-02/SF-SET-12). No new cases recommended; **needs
     confirmation** if the user wants a guard-route regression case.

**Net: this ingest does not, by itself, require any new cases or any forced
edits.** It CONFIRMS the existing SF-PERM suite.

---

## 4. Process recommendation (feeds a Rule-11 question — do NOT act on it)

| Process | Recommend? | One-line rationale |
|---|---|---|
| **(1) BUILD-ACCURATE-WORDING-VIU-PROCESS** | **Light / optional** | No wording driver in SV8183_1 (truth table unchanged). Worth it ONLY to (a) fold the Dipesh dev-comment confirmation into SF-PERM-06 and (b) re-VIU the SF-PERM role-gates live on staging (they're currently VIU-Verified) if the user wants fresh evidence after the SV-7388/SV-7864 → Done transitions. Not otherwise needed. |
| **(2) SPEC-RELEVANCE-RECONCILIATION-PROCESS** | **Recommended (light)** | This is fundamentally a re-export + status/comment refresh. A light reconciliation pass would: reconcile the reviewer ≠ completer AC vs the descope (OQ-1), refresh `refs`/traceability to the new Done statuses (Rule 20), and confirm no case is now obsolete. It is the better-fit of the two — but the single genuine open item (self-review) is a **PO decision for Milos**, not a suite rewrite. |

**Bottom line for the Rule-11 ask:** most likely **(2) light reconciliation +
resolve OQ-1 with Milos**, with **(1)** only if you want the SF-PERM cases
re-VIU'd live and the dev-comment note folded in. **Awaiting your instruction —
not acting.**

---

## 5. The new dev comment (why it matters)

**Dipesh Changawala → Milos Vasic, 10/Jul/26:** UI blocks the gated actions
correctly (Complete WO, Order Parts, etc. hidden from wrong roles). BE checks a
permission on every endpoint, but "Work Orders: Create & Edit" is **bundled** so
every role holds it → **a direct API/cURL call outside the app passes the BE
check.** Not Simple-Mode-specific (the existing WO-create endpoint already behaves
this way; a Technician can hit it via direct API today).

**Impact on our suite:** this is the exact behavior **SF-PERM-06 (C29410)** already
documents ("UI gating is the v1 pass criterion… completion/review NOT blocked at
the backend today: a direct API call still succeeds HTTP 200"). The comment is
**in-ticket dev corroboration** of that case — strengthens, not changes, it.

---

## 6. Rule 20 traceability note

- **Driving ticket:** **SV-8183** (Epic **SV-7301**) — status Unresolved/Open,
  Assignee Dipesh Changawala, Label `simple-mode`.
- **Combined `refs` format for any new/edited case** = `<TICKET(S)> (<spec-anchor>)`:
  - Permission-mapping cases → `SV-8183 (SV8183_1 §Core rule — action→atom row: "<action>")`
    or `SV-8183 (SV8183_1 per-role matrix — <Role> × <column>)`.
  - Completion/matrix → `SV-8183 (SV8183_1 per-role matrix — Complete WO)`.
  - Review sign-off → `SV-8183 (SV8183_1 AC "Mark Reviewed / sign-off")`.
  - Vendorless part → `SV-8183 (SV8183_1 AC "Adding a vendorless part (Story 5)")`.
  - API-bypass / BE enforcement → `SV-8183 (SV8183_1 AC "BE enforces… atom collapse" + Dipesh comment 10/Jul/26)`.
- Existing SF-PERM `refs` already cite `SV-8183 (§8 …)` / `(§9 …)` — keep the
  ticket + spec anchor together; where a case now derives from a specific SV8183_1
  row, tighten the anchor to that row (per-story precision, Rule 20). **Related
  Done tickets** (SV-7388/7864/8095/7820) can be cited as Done in change logs.

---

## 7. Open questions (for a later Milos question sheet — layman, Rule 7)

- **OQ-1 — RESOLVED 2026-07-22 (user): self-review allowed; SV8183_1 reviewer≠completer AC superseded by descope (last-update-wins). No case edits required.**
  Original question (kept for the record): SV-8183 says a person who **finished** a
  work order should **not** be allowed to be the one who **signs it off** as
  reviewed (two different people required). Our current tests say the same person
  **can** sign off their own work order as long as they have the review
  permission. **Which is correct for v1 — must it be two different people, or is
  self-sign-off allowed?** (This is the reviewer ≠ completer vs self-review
  conflict; last-update-wins currently favors self-review, but SV-8183 re-asserts
  the two-person rule — needs Milos to confirm.)
- **OQ-2:** SV-8183 notes the backend can be reached directly (outside the app) by
  a role that shouldn't have an action, because the permissions are bundled. The
  dev says the app itself blocks it and this is how the whole app already works.
  **For v1, is "the app blocks it" enough, or do we need the backend to block each
  role too?** (Confirms our SF-PERM-06 stance.)
- **OQ-3 (status/timeline):** SV-8183 lists the Simple Flow stories
  (SV-7696…7710, SV-7876) and Review-ON (SV-7870) as **Blocked** in this export.
  **Is that current?** (Affects when the SF-PERM cases can be freshly re-VIU'd on
  a live build.) — likely an env/status question for the user, not Milos.

---

## 8. Guardrails honored

Analysis + ingest ONLY. No test cases authored, no VIU run, no TestRail
create/update/delete, no secrets. All findings above are derived from the two
Jira exports and the existing local suite; no live environment was touched.
