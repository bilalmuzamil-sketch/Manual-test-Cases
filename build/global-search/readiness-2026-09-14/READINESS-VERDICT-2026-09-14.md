# READINESS VERDICT — Global Search V1 regression suite

**Date:** 2026-09-14 · **Asked:** *are we 100% good on (a) covering everything V1 could do, and (b) a QA
environment the other session can actually run in?*

## THE HONEST ANSWER, UP FRONT

| Question | Verdict |
|---|---|
| **(a) Is every V1 capability covered by a test case?** | ✅ **YES — and proved two independent ways, not asserted** |
| **(b) Can the other session run the suite today?** | ⚠️ **NO — 40 of 58 cases are ready; 18 are not, and 17 of those were never my seeding scope** |

**Nothing about the coverage should bite you. The seeding will, if it is not closed before the run
starts.** The gap is concentrated in the permission and scoping cases, which need *users and roles*, not
records — and the seeding work on 14 September only ever covered *records*.

---

## PART A · COVERAGE — ✅ PASS, PROVED TWICE

### A1 · The proof tools, re-run live today

| Tool | Result |
|---|---|
| `parity_coverage_proof.py` | 65 capabilities · 58 cases · 157 tests · **FORWARD 0 · IN-RUN 0 · BACKWARD 0 → PASS** |
| `parity_source_audit.py` | **58 of 58 cases source their expectation to V1**, not to the V2 specification → PASS |

### A2 · The anti-circularity check — the one that actually matters

Re-running my own tools against my own capability list would prove nothing: **if a field went missing
between extraction and list, both would still say PASS.** So the V1 source was re-extracted
**independently**, from scratch, and diffed against the list.

- Re-extraction found **35 `(fetcher, column)` pairs** — the true V1 searchable surface, with the
  overloaded `v.` alias (vehicle in one fetcher, vendor in another) correctly separated.
- **All 35 map to a capability that has at least one live case.** Two initially flagged
  (`i.workplace_shop_id`, `wp.shop_id`) were confirmed covered by
  [C53579](https://shopview.testrail.io/index.php?/cases/view/53579), which tests all four
  shop-prefixed number forms explicitly — the matcher was comparing literal column names, not the
  capability.

**Conclusion: the capability list was itself complete.** That is the claim that was worth testing, and
it holds.

---

## PART B · ENVIRONMENT — ⚠️ 40 OF 58 READY

### B1 · Ready to run now — 40

| Count | Group |
|---|---|
| **31** | Covered by the 14 September seed — customer, contact, asset, vendor, both parts, four work orders |
| **7** | Need no seeded data at all (keyboard, two-character minimum, no-results, mobile, loading, feature flag) |
| **2** | Self-seeding by design — the tester creates the record as the test |

### B2 · NOT ready — 18, and what each needs

🔴 **The big one: eight cases need USERS AND ROLES that were never set up.** My seeding covered records.
It did not cover people. This is the single largest readiness gap and it is mine to own — the seeding
checklist scoped itself to the search-capability cases and never came back for the permission half.

| Cases | What is missing | Effort |
|---|---|---|
| [C45142](https://shopview.testrail.io/index.php?/cases/view/45142) [C45143](https://shopview.testrail.io/index.php?/cases/view/45143) [C45144](https://shopview.testrail.io/index.php?/cases/view/45144) [C45145](https://shopview.testrail.io/index.php?/cases/view/45145) [C45146](https://shopview.testrail.io/index.php?/cases/view/45146) [C45147](https://shopview.testrail.io/index.php?/cases/view/45147) [C45149](https://shopview.testrail.io/index.php?/cases/view/45149) [C45159](https://shopview.testrail.io/index.php?/cases/view/45159) | **Seven role/user setups**: Work-Orders-only · Part-Sales-only (no Catalog, no Vendor) · Catalog-&-Inventory-only · Vendor-&-Order-Management-only · Customers-only · **Time Clock** · a user with **no default workplace**. C45149 also needs a user who opened a record and *then* lost access to it | Half a day of role work. **Rule 26: reset roles to template BEFORE any permission verification** — these regress when other features ship |
| [C45151](https://shopview.testrail.io/index.php?/cases/view/45151) [C45152](https://shopview.testrail.io/index.php?/cases/view/45152) | **A second location**, with a Work Order *and* a Part Sale belonging to it, plus a user with access to both | Needs the part sale — so A5 blocks this too |
| [C45150](https://shopview.testrail.io/index.php?/cases/view/45150) | **A second organization** with a record matching the same search word | May need an admin |
| [C45153](https://shopview.testrail.io/index.php?/cases/view/45153) | A **part sale** and the catalogue-only part together | Blocked by A5 |
| [C55665](https://shopview.testrail.io/index.php?/cases/view/55665) | A **part sale** for the seeded customer | **Blocked by A5** |
| [C45148](https://shopview.testrail.io/index.php?/cases/view/45148) | A build returning an **unrecognised result type**. **May not be seedable at all** — it may only be testable by code inspection | Ask before spending time |
| [C45160](https://shopview.testrail.io/index.php?/cases/view/45160) | **Analytics capture available** on the QA branch — unverified | One check |
| [C45154](https://shopview.testrail.io/index.php?/cases/view/45154) [C45155](https://shopview.testrail.io/index.php?/cases/view/45155) [C45157](https://shopview.testrail.io/index.php?/cases/view/45157) | Probably satisfied by the seed, but **not verified**: C45157 needs a record matching on **two fields at once** | One check each |

### B3 · 🔴 THE ENVIRONMENT WENT DOWN MID-CHECK — and what that proves about A5

Partway through verifying the seeded records, **every QA endpoint began returning HTTP 409 *"Session has
expired."*** — search, work orders, bin locations, part sales, all of them. The cookies supplied earlier
today are now dead, so **the record-by-record seed verification could not be completed.** That is why B2
lists "not verified" rather than "verified absent".

**But it settles A5 in A5's favour, and this matters because someone will try to dismiss it.**

| | |
|---|---|
| An **expired session** returns | **HTTP 409**, a clean `"Session has expired."` |
| **A5 returned** | **HTTP 500**, a generic server error with a request id |
| At the time A5 was tested, the same session returned | **HTTP 200** on `/api/search`, `/api/work-orders`, `/api/inventory/bin-locations`, `/api/inventory/parts` — all within the same few minutes |

**So A5 was not session expiry.** Keep this paragraph with the ticket; it is the pre-built answer to
*"are you sure your session hadn't just timed out?"*

---

## WHAT WOULD ACTUALLY BITE YOU, RANKED

| # | Risk | Likelihood | What closes it |
|---|---|---|---|
| **1** | **The run starts and 18 cases cannot be executed.** The tester marks them Blocked-for-setup, and the permission and location behaviour — where regressions are most dangerous — goes untested at launch | **HIGH if nothing is done** | Set up the seven roles, a second location and a second organization **before** the run |
| **2** | **A5 blocks four cases** (C55665, C45153, and both location cases need a part sale) | **CERTAIN until A5 is fixed** | Fix A5, or create one part sale by any working route |
| **3** | The seed data is *assumed* present but was never re-verified after 14 September | **MEDIUM** — it is 0 days old, but the session died before I could confirm it record by record | Fresh cookies; the check takes minutes |
| **4** | Coverage is wrong | **LOW** — proved two independent ways today | Nothing; re-run the two tools any time |

## OUTSTANDING — what I need from you

| # | What I need | Why |
|---|---|---|
| 1 | **Fresh QA cookies** for `sv9160.qa.shopview.com` | To finish the record-by-record seed verification the expired session cut short |
| 2 | **A decision on the 18 not-ready cases**: set the roles/locations up before the run, or run the 40 now and the rest later | Either is defensible — running 40 and blocking 18 is honest; running all 58 needs setup first. **What is not defensible is discovering this mid-run** |
| 3 | **Who sets up the roles** — me, `manual-test-cases-c2`, or an admin | Rule 26 says roles are reset to template first; on a shared environment that affects other people |
| 4 | **A ruling on C45148** (unrecognised result type) — is it worth seeding, or retire it as code-inspection-only? | It may not be seedable at all, and I will not guess |
