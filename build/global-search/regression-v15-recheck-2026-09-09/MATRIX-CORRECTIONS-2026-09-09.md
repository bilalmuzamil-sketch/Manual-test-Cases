# Global Search — V1→V2 regression re-check against spec v1.5

**Produced 2026-09-09. READ-ONLY: no TestRail write, no case edit, no Jira ticket.**
Re-checks `build/global-search/regression-2026-08-26/REGRESSION-IMPACT-MATRIX.md` (built against
**V2 spec v1.2**) against the live spec, now **v1.5**. Answers the QA lead's four asks of 2026-09-09.

## Verification status (Rules 12, 91)

- **V1 code: ✅ FACT, read 2026-09-09.** `ShopView/shopview` Global Search files are **byte-identical**
  to the 2026-08-26 pinned baseline `55767168` — `git log 55767168..origin/develop` over
  `api/src/Reporting/GlobalSearch`, `GlobalSearch.vue`, `useGlobalSearch.ts`, `routingService.ts`
  returns **zero commits**. Per Rule 96, code establishes fact.
- **Build: ❌ NEVER build-verified**, both sides. No GS V2 QA branch exists
  (`build/BLOCKED-global-search-build.md`); V1 was not observed live either. Nothing below is a
  live observation.
- **V2 spec: v1.5** (Confluence 576978945, last updated 2026-09-08), per
  `source-verify-2026-09-09/SPEC-DIFF-2026-09-09.md`.

---

## 🔴 HEADLINE FINDING — V2 as specified is *less* than V1 on partial identifier search

This is the single thing that answers "will V2 do at least what V1 does". **On current spec wording,
no — and the V2 suite has the narrowing written in as intended behaviour.**

**V1 FACT — identifier matching is SUBSTRING.** `useGlobalSearch.ts:90-92`:

```js
return entry.search.toLowerCase().includes(normalizedSearch.replace(/\s+/g, ''));
```

`.includes()` on a lowercased, space-stripped haystack. Every identifier V1 indexes is therefore
matchable by **any fragment**:

| Identifier | Indexed at | V1 behaviour today |
|---|---|---|
| VIN | `FetchDataQueryHandler.php:291` | any substring of the VIN finds the asset |
| Licence plate | `:292` | any substring finds the asset |
| Unit number | `:290` | any substring |
| Part number (both hyphenated and stripped) | `:326-327` | any substring |
| WO `raw_number` + 5 shop-id variants | `:95-111` | any substring |
| Phone (parens normalised) | `:235`, `:162` | any substring of digits |

**V2 spec/suite — identifiers require an exact match.** Live cases:

| Case | Title |
|---|---|
| [C44866](https://shopview.testrail.io/index.php?/cases/view/44866) (GS-FUZ-06) | A VIN / serial number **requires an exact match after normalization** |
| GS-FUZ-08 | A part number **requires an exact match after normalization** |
| GS-FUZ-11 | A Part Sale P-number **requires an exact match** (no fuzzy typo tolerance) |
| GS-FUZ-09 | Typos in identifier fields do NOT return fuzzy matches |

### Why this is a decision item, not a finding I can settle (Rules 57, 58, 96)

**"Exact match after normalization" is genuinely ambiguous.** It can mean either:

- **(a) no typo tolerance, substring still matches** → V1 parity preserved, nothing to fix; or
- **(b) the query must equal the whole identifier** → **a real regression.** A parts clerk who
  today types the last 6 of a VIN, or `4310` to find part `AC-4310-XL`, gets nothing in V2.

Rule 58 forbids resolving this by looking at the build, and Rule 96 makes a code-vs-document
conflict a **PO decision item, never a silent invariant**. So this is filed as **PO-GS-SUBSTR-1**
below, not decided here.

**Silence default (Rule 96):** until answered, the invariant stands as **"partial identifier search
must keep working"** — reading (a). Cases should be authored to (a) only once confirmed.

**Related live bug:** **SV-9640 "Work order search returns nothing when the full WO number is used"**
= Blocked, linked to the epic. That is the *inverse* symptom on the same surface and should be read
together with this item.

---

## 1 · Disposition corrections — the v1.2 matrix is wrong in three places

The invariant (V1) side of the 2026-08-26 matrix all still holds — the code has not moved. But its
**"V2 says" column was judged at v1.2** and three rows have since flipped. Left uncorrected, two of
them send a tester hunting for V2 behaviour that no longer exists.

| Matrix row | Said at v1.2 | TRUE at v1.5 | Why it matters |
|---|---|---|---|
| **INV-17** — Customer haystack → "Contact/info match" | `CHANGED → "Contact match" + Contacts entity (§4)`; pointed at GS-ENT-07, **GS-CON-01** | **The standalone Contacts group was REMOVED at v1.3.** v1.5 §4 confirms contact telephone and email **remain indexed on Customers and Vendors**; the design (DS14) shows **no Contacts group**. | Disposition flips **CHANGED → effectively PRESERVED**. V1's "a contact-field hit returns the parent company row" is now an **INVARIANT**, not a change. A tester following the v1.2 matrix would look for a Contacts group that does not exist. |
| **INV-48** — usage analytics event on select | `SILENT vs new telemetry §6.4` + **PO-REG-4** | **Telemetry removed entirely at v1.5** — §6.4 deleted, impression/click logging dropped from §8. | The conflict the matrix flagged is **gone**. C45160 becomes a clean invariant: the V1 `global_search_use` GA event must simply keep firing. **PO-REG-4 can be closed.** |
| **INV-01** — 6 result types | `CHANGED → 9 entities` | **8 entities / 9 tabs** (Contacts dropped at v1.3; Vendor Invoices retained). | Arithmetic only, but the entity count is quoted in tester-facing text. |

**Unchanged and still correct:** every other row, including all 8 permission rows, all 3 scoping
rows, navigation, the "Assets" label, ⌘K, de-dup, no-feature-flag and the 2-char minimum.

### ⚠️ Suspected orphan case — needs one live TestRail read

**[C45129](https://shopview.testrail.io/index.php?/cases/view/45129) (GS-TAB-10) "The 'Contacts' tab
shows only Contact results"** asserts a tab that v1.3 removed and v1.5/DS14 confirm absent.

It was **not** mentioned in the 2026-09-09 spec-diff pass. It may already have been rewritten — its
sibling **C45139** (GS-RANK-08) *was* silently repurposed (the 09-09 diff cites C45139 as asserting
contact-field indexing on the parent company, while `testrail-id-map.csv:110` still carries its
original v1.2 title "Contacts rank by open work…").

**That proves `build/global-search/testrail-id-map.csv` is STALE and cannot be trusted for titles.**
So C45129 cannot be adjudicated from the repo — the live case body is the authority. Flagged, not
actioned.

---

## 2 · The "V1 match-parity" case set: 12 candidates → 1 authorable

Applying the QA lead's condition ("if it is logical and nothing will bite me") honestly: **9 of the
12 candidates I proposed fail that test.** Authoring them as proposed would have put three wrong
cases into TestRail.

| # | Candidate | Verdict | Reason |
|---|---|---|---|
| 1 | Match by WO **status** (`qualitycheck`, `qc`) | 🛑 **DO NOT AUTHOR** | V1 indexes status (`:113-116`, incl. `quality_check`→`qualitycheckqc`) **but v1.2 §4 DROPPED status from the WO indexed fields** — matrix row INV-02, open as **PO-REG-6**. Asserting it as an invariant would contradict the spec. Blocked on PO-REG-6. |
| 2 | Match by **licence plate** | ✅ **AUTHORABLE** | Indexed at `:292`; no case in the 119+20 mentions licence plate; nothing in v1.2→v1.5 drops it. Unambiguous invariant, genuine gap. |
| 3 | Partial **VIN** | ⏸️ **HOLD → PO-GS-SUBSTR-1** | Covered *contrarily* by GS-FUZ-06 (exact). Cannot author until the substring question is answered. |
| 4 | Partial **part number** | ⏸️ **HOLD → PO-GS-SUBSTR-1** | Same, vs GS-FUZ-08. |
| 5 | Bare / shop-id-variant **WO number** | ⏸️ **HOLD** | Partly covered by GS-FUZ-05; also entangled with live bug **SV-9640**. Authoring now would duplicate or contradict. |
| 6 | Customer-name **space-insensitivity** (`johnsmith` → "John Smith") | ⏸️ **HOLD → PO-GS-SUBSTR-1** | V1 strips whitespace from both haystack and query (`:92`, and `REPLACE(...," ","")` in SQL). V2's fuzzy matching probably subsumes it, but "probably" is not a source. |
| 7 | Phone with parens | ❌ Already covered | GS-FUZ-07 "matches on digits only, ignoring formatting". |
| 8 | Contact person → parent company | ❌ Already covered | GS-ENT-07 / [C44837](https://shopview.testrail.io/index.php?/cases/view/44837). |
| 9 | **Customers group holds 6 rows** (3 Customer + 3 Contact, `:214-217`) | ❌ Not an invariant | V2 caps at 5 per group (GS-GRP-02) and dropped the Contacts type. Deliberate change. |
| 10 | Per-type cap of 3 | ❌ Not an invariant | Explicitly CHANGED → 5 (GS-GRP-02). |
| 11 | Zero results → shows **recent history** (`:229-231`) | ❌ Not an invariant | V2 has a dedicated no-results state. Deliberate change. |
| 12 | 350 ms debounce | ❌ Not an invariant | CHANGED → 150 ms (§8). |

**Net: 1 case authorable now** (licence plate), **4 held on PO-GS-SUBSTR-1**, **1 held on PO-REG-6**,
6 correctly rejected. Not written — awaiting the QA lead's go-ahead on the narrowed set, since the
scope is materially different from the 12 he approved.

---

## 3 · Part Sale permission asymmetry — invariant already protected; do NOT unify silently

**The fact:** backend and frontend gate Part Sale rows on **different** permissions.

| Layer | Gate | Source |
|---|---|---|
| Backend | `FEPermissionEnum::partSalesView` | `FetchDataQueryHandler.php:45`, applied `:199-208` |
| Frontend | `getPermittedRoutesMap().WorkOrders` | `routingService.ts:80` |

A role holding `partSalesView` but **not** Work Orders access receives Part Sale rows from the API,
and the browser then hides them.

**Ruling: I am not making one, and that is the correct call.** Whether V2 should preserve or unify
this is product intent about who may see what — Rule 96 makes it a **PO decision item, never a
silent invariant**, and Rule 58 bars resolving it from the build.

**What protects us meanwhile:** the invariant is **already covered** by
**[C45143](https://shopview.testrail.io/index.php?/cases/view/45143) (GSREG-PERM-02) "A Part-Sales-only
role sees Part Sales but not catalog Parts or Vendors"** — which encodes today's observable
behaviour. **No new case is needed.** Per Rule 96's silence default, V2 must not change it until
someone decides otherwise. Filed as **PO-GS-PARTSALE-1**.

---

## 4 · `group_concat_max_len` — a V1 defect that will masquerade as a V2 diff

**Checked as asked.** `group_concat_max_len` is **not set anywhere in the repo**: no `.cnf` file
exists, and no Doctrine session init, YAML, env or SQL sets it (grepped `*.php *.yaml *.yml *.ini
*.cnf *.sql Dockerfile* *.env*`). **The MySQL/Aurora default of 1024 bytes therefore applies.**

The customer haystack builds its contact segment with an unbounded `GROUP_CONCAT`
(`FetchDataQueryHandler.php:237-243`) over first name + last name + title + phone per contact.
At a typical ~35–40 bytes per contact, **the haystack silently truncates somewhere around 25–30
contacts**. MySQL does not error — it raises warning 1260 and returns a shortened string.

**Consequence:** on a large customer, contacts past the cut-off are **not searchable in V1 today**.

**Why this matters for your diff cases — and this is the trap:** a V2 that indexes contacts properly
will **return results V1 does not**. That will show up in a naive parity comparison as a V2 defect
when it is in fact **V1 being broken**. So:

> **Do NOT write a parity case that asserts V1's truncation behaviour.** Any contact-search parity
> case must be seeded with a customer holding **fewer than ~20 contacts**, or it will encode a bug
> as the expected result.

**Honest limit (Rule 12):** I confirmed only that *the repo does not set it*. The **live Aurora value
is unconfirmed** — an RDS/Aurora parameter group can set it server-side, outside the repo. Settling
it needs one query, `SELECT @@group_concat_max_len;`, which I could not run (no DB access this
session; `build/BLOCKED-shopview-app-session.md` — every stored cookie returns HTTP 401).
Recorded as register item **R-GCML**.

**Not filed as a ticket:** Rule 51 (never file an API-related ticket without asking, every time) and
Rule 62 (Jira creation hold H1 active).

---

## New PO decision items raised by this pass

| Id | Question for the PO / Branko | Blocks |
|---|---|---|
| **PO-GS-SUBSTR-1** | In V2, does an identifier search (VIN, licence plate, part number, WO number) still match on a **partial fragment** as V1 does, or must the query equal the **whole** identifier? "Exact match after normalization" (§7) reads both ways. If the latter, V2 is **less** than V1 and long-standing user habits break. | 4 parity cases + the reading of GS-FUZ-06/08/11 |
| **PO-GS-PARTSALE-1** | Should V2 preserve the current Part Sale permission split (BE `partSalesView` / FE `WorkOrders`), or unify it? Unifying **changes** what a Part-Sales-only role sees. | firming C45143 |
| **PO-REG-6** (carried, 2026-08-26) | Is dropping **WO status** from the searchable index intended? Users can search `qualitycheck` / `qc` today. | parity candidate 1 |

## OUTSTANDING — what I need from the QA lead

| # | Ask | Why |
|---|---|---|
| 1 | **Go-ahead on the narrowed case set: 1 now (licence plate), 5 held.** Materially different from the 12 approved on 2026-09-09 — 3 of those 12 would have been wrong. | Rule 6 permission was given for 12; reporting that the honest scope is 1. |
| 2 | **One live TestRail read of C45129** to settle the suspected Contacts-tab orphan. | Repo id-map proven stale; cannot adjudicate offline. |
| 3 | **Send PO-GS-SUBSTR-1 to Branko as the top question.** | It decides whether V2 meets the "at least what V1 does" bar at all. |
| 4 | **Authorise `SELECT @@group_concat_max_len;`** on staging, or an Aurora parameter-group read. | Closes R-GCML. |
| 5 | Carried: **PO-REG-1..6**, and **a QA build of GS V2** (Rule 85). | 20 regression cases + anything new stay "Not available on Build to test Yet". |
