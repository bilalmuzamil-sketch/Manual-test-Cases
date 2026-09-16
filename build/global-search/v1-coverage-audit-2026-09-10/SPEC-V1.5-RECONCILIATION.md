# SPEC v1.5 RECONCILIATION — what the real PRD changes about the 12 cases

**Source read live 2026-09-10:** Confluence page 576978945 "Global Search - Product Requirements",
**Version 1.5**, last modified 2026-09-08, author Branko Cicovic / Milos Vasic (v1.5 change-log row).

## 🔴 FINDING 0 — the existing regression matrix is built on a STALE spec
`build/global-search/regression-2026-08-26/REGRESSION-IMPACT-MATRIX.md` records
**"V2 spec: v1.2 (Confluence version 12)"**. The live spec is **v1.5**, i.e. **three documented
revisions newer** (v1.3 design revision, v1.4 Show-all/20-cap, v1.5 engineering answers). Every
"V2 SAYS" cell in that matrix predates v1.3-v1.5 and must be re-checked before the V2 run.

## 1 · §4 ANSWERS WHAT I HAD TREATED AS SILENCE — 4 cases get STRONGER

PRD v1.5 §4 lists indexed fields per entity explicitly. These four are now **spec-backed**, not
Rule-96 defaults:

| Case | Assertion | Spec v1.5 §4 |
|---|---|---|
| C53578 (G3) | WO findable by customer name | Work Orders indexed: "WO number, **customer name**, asset, unit number, VIN…" |
| C53580 (G2) | Asset findable by unit number | Assets indexed: "year, make, model, VIN/serial #, **unit number**, owning customer name" |
| C53581 (G8) | Asset findable by owning customer | Assets indexed: "…**owning customer name**" |
| C53584 (G5) | Vendor findable by email | Vendors indexed: "name, telephone, **email**, address, city…" |

## 2 · 🔴 THREE CASES WOULD HAVE PRODUCED FALSE FAILURES — corrected

| Case | What I asserted | What v1.5 actually says | Correction |
|---|---|---|---|
| C53588 (G9) | Work orders listed **strictly newest-first** (V1 `start_date DESC`) | §6.1 makes recency **one signal among several** (exponential decay, 14-day half-life, up to +0.25; plus open-status +0.30, assigned-to-me +0.15, viewed +0.10; closed >90d demoted −0.20). §6.2 sorts by **score descending**, ties broken by recency | **Retitled and rewritten.** Strict date order is NOT expected in V2. Now asserts: among work orders of equal match quality and status, the more recently updated ranks higher; and a closed/invoiced WO older than 90 days is demoted |
| C53586 (G1a) | New customer findable **immediately, no wait** | §9: "**Index refresh latency ≤ 30s** for entity create/update". §8: "creating an entity counts as a view, so a record the user just created is immediately recent and recency-boosted" | **Rewritten** to allow up to 30 seconds, and to also assert the record appears under Recent searches |
| C53587 (G1b) | New WO / part sale findable **immediately, no wait** | Same §9 / §8 | **Rewritten** with the same 30-second allowance |

Left uncorrected these three would have had a tester raise defects against **intended** V2 behaviour —
the precise "your work bit me" failure mode.

## 3 · 🟠 THREE V1 FIELDS THE SPEC OMITS — code-vs-document conflicts, now flagged as PO decisions

Rule 96/58: a code-vs-document conflict is a **PO DECISION ITEM, never a silent invariant**. V1's code
indexed these; PRD v1.5 §4 does not list them. Each case still asserts the V1 behaviour (silence
defaults to must-not-change) but now carries the conflict in its Expected Results so a tester does not
file a bug against a deliberate scope cut:

| V1 field | V1 evidence | v1.5 §4 | Case |
|---|---|---|---|
| **Customer postal code** | `FetchDataQueryHandler.php:224-245` (`c.postal_code`) | Customers list "address 1/2, city, state/province" — **postal code absent** | C53582 (G6a) |
| **Customer website** | `:224-245` (`c.website`) | **website absent entirely** | C53583 (G7) |
| **Vendor postal code + state** | `:155-164` | Vendors list "name, telephone, email, address, city" — **postal code and state absent** | C53585 (G6b) |

**Also flagged, not mine to edit:** **C53516 "Searching an asset's licence plate finds that asset"** —
V1 indexed `v.licence_plate` (`:285-293`), but v1.5 §4 Assets lists "year, make, model, VIN/serial #,
unit number, owning customer name" — **licence plate is absent**. Same conflict class; needs the same
PO decision. I have not modified that case.

## 4 · 🟢 THE SPEC RESURRECTS THE TWO "STALE" LEGACY CASES — correcting my earlier advice

I previously recommended **retiring C1927**. **That advice was wrong and is withdrawn.** PRD v1.5 §4
indexes for **Parts (Inventory)**: "description, part number, **tags**, category, manufacturer, vendor
name, **bin location**."

- **C1927 "Search For Grid Location"** — bin location becomes a **V2 searchable field**. The case tested
  the old page-filtering mechanism, so it needs rewriting, **not retiring**: it should become a V2
  parts-search case ("find a part by its bin location").
- **C252 "Search for tags"** — **tags are indexed in V2.** But note the case as written searches WO
  *statuses* ("Estimate", "Approved"), and v1.5 §4 is explicit that **status is deliberately NOT
  matchable** ("typing a status name does not return records carrying that status"). So C252's current
  content is correctly dead, while a genuine **part-tag** search case is now missing from V2 coverage.

**Net new V2 coverage gap (not a V1 regression):** no case covers searching Parts by **tags**,
**category**, **manufacturer**, **vendor name** or **bin location**, all indexed per §4.

## 5 · CONFIRMED BY THE SPEC — no change needed
- **Status not matchable** (§4 preamble) — confirms C252's status search is intentionally gone and
  PO-REG-6 was right.
- **C53589 (G10) loading state** — §8 specifies 150ms debounce and 200ms p95 render but says nothing
  about a loading/disabled state, so the V1 behaviour stands as a Rule-96 invariant. Unchanged.
- **C53579 (G4) WO number forms** — §7 normalization strips non-alphanumerics so `S2-15276` and
  `s215276` match, which covers the dash/space half. The spec's canonical number format is itself
  shop-prefixed (`S2-15276`), so whether the bare non-shop form still matches remains open. The PO note
  on that case stands.

## 6 · NEW OPERATIONAL FINDINGS FROM THIS PASS (belong in the playbook on canonical)

1. **The TestRail API key supplied on 2026-09-10 returns HTTP 401**; the account password
   authenticates fine over Basic auth. Key-based auth appears disabled or the key is invalid.
2. **TestRail wraps text fields in `<p>…</p>` on write.** A read-back check that compares the sent
   string to the stored string with exact equality therefore reports a FALSE NEGATIVE on every text
   field, even though the write landed. `title` is stored verbatim and is safe to compare exactly.
   **Verify text-field writes by asserting the substance is present (substring checks), not by string
   equality** — otherwise a correct write looks like a failure and a session may "fix" it repeatedly.
   Proven here: all 10 corrections showed `verified=False` under equality and `verified=True` under
   content checks (`correction_verification.json`).
3. **Titles must be re-read after a content correction.** Two cases (C53586/C53587) kept titles saying
   "straight away" after their bodies were corrected to a 30-second window — a title that contradicts
   its own expected result is exactly what makes a tester file a wrong defect. Both retitled.

## 7 · 🔴 EPIC vs SPEC CONTRADICTION — affects 8 existing cases, needs a ruling

Read live 2026-09-10: **SV-9160**, updated **2026-09-02**, status Open, label `global-search-v2`.

| Source | Date | Says about quick actions on hover |
|---|---|---|
| **Epic SV-9160**, "Out of scope" | 2026-09-02 | "**Contextual quick actions on hover** (design-confirmed, **later release**)" |
| **PRD v1.5** §5.4 + change-log v1.3 | 2026-09-08 | "**Quick actions are back in v1 scope** for every entity, shown unconditionally, with `View part history` added to Part rows" — and §5.4 specifies the per-entity action list in full |

**Why this matters:** TestRail section **6774 "Quick Actions on Hover (v1)"** holds **8 cases**
(C44866-C44873). If the epic is right they must not run at V2 launch; if the spec is right they must.

**Rule 32 (latest information wins) points at the spec** — v1.5 (2026-09-08) is six days newer than the
epic (2026-09-02), and the v1.3 change-log row records the reversal deliberately ("Quick actions are
back in v1 scope"). **But Rule 33/63 forbid silently picking a side on a high-collateral conflict, and
8 cases is high-collateral.** So this is recorded as a **PO/PM decision item**, not resolved here.
No case was added, retired or edited on the strength of it.

**Everything else in the epic agrees with the spec** and with our coverage: telemetry out of scope
(matches v1.5 §2 and C45140), Contacts not a standalone group (matches §4 and C45129/C44895),
list-page search on WOs / Inventory Parts / Customers served by the same tier (matches sections 6737
and 6732).

## 8 · DESIGN PACK — what it confirms

Three design bundles were supplied (`Shopview_Design_System_15/16/17`; the Global Search artboards are
`Global Search Page.html`, `preview/global-search.html`, `Mobile Global Search.html`, plus the
`global-search.jsx` / `mobile-global-search.jsx` builds).

- **No loading or skeleton state exists anywhere in the Global Search design** — the only placeholder
  is the input copy "Search work orders, customers, parts and more". Combined with §8 (which specifies
  a 150 ms debounce and 200 ms p95 render but no loading affordance), **the V2 spec and design are both
  silent on a loading state**, so **C53589 (G10) correctly stands as a Rule-96 invariant.** Confirmed,
  not assumed.
- **"Assets" is confirmed as the user-facing label** by §5.2's tab strip
  (`All · Work Orders · Customers · Assets · Parts · Vendors · Part Sales · Purchase Orders · Vendor
  Invoices`) and §4's "Assets (Vehicles)" heading — so existing case **C45155** is spec-backed.
- The design's empty/no-results/recent copy matches §5.2 ("No results for", "Recent searches",
  "Clear all").

## 9 · PROPOSED — NEW V2 coverage gap (needs permission; nothing created)

PRD v1.5 §4 indexes **Parts (Inventory)** on: description, part number, **tags**, **category**,
**manufacturer**, **vendor name**, **bin location**. Current coverage tests description and part
number only. **Five indexed fields have no case at all.** This is a *V2 functional* gap, not a V1
regression, so it sits outside the 6769 remit and outside the permission already given.

Proposed (5 cases, section 6725 or a new Parts-search section):
find a part by **tag** · by **category** · by **manufacturer** · by **vendor name** · by **bin
location**. The last one is the correct home for the rewritten **C1927**.
