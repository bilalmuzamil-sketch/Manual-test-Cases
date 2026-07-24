# Simple Flow — SV-8183 Permission Test vs. QA-found Issues: Reconciliation & Honest Analysis
**Feature:** Simple Flow (Epic SV-7301) — permission / role controls (Story **SV-8183**)
**Prior report under review:** `SimpleFlow_SV-8183_Permission-Test-Report_2026-07-23.md` (our 2026-07-23 pass — concluded **11/11 PASS**)
**QA issues reconciled:** **SV-8515**, **SV-8516**, **SV-8541** (all raised by Ayesha Khan, QA, against SV-8183)
**Environment:** app.staging.shopview.com / api.staging.shopview.com (org d55bc308, shared) · **PO:** Milos · **Date:** 2026-07-24
**Basis:** live re-verification on **template-reset (clean) roles** (drift ruled out, Rule 26) — evidence in `ayesha-issues/reverify-2026-07-24/`. **No TestRail writes.**

---

## 1. Executive summary (plain English — honest)

On **2026-07-23** we published a permission test report for Simple Flow that concluded **"11 of 11 test cases passed, zero mismatches, the role controls behave exactly as specified — PASS."** QA (Ayesha) then raised **three issues** — SV-8515, SV-8516 and SV-8541 — against the same feature.

We re-checked all three **live on the real staging system, against clean (template-reset) roles**, capturing the actual screen and the actual system response for every step. **All three are real coverage gaps.** Plainly: **our report over-claimed.** The eleven cases we ran were correct *for the specific things they tested*, but the test **suite did not cover the action paths these three issues live on**, and we reported "all pass" as if it meant the *whole feature* was clean. It did not.

What the three issues actually are, in plain terms:

- **SV-8515 (real defect, developer already accepting the fix).** A "view-only" parts user is correctly **not** shown the per-order Receive button — but they **can still tick several orders and click "Receive Selected," which opens the full editable receiving screen.** That screen should never appear for a view-only user. **Good news for data safety:** when they actually try to receive, the underlying system **refuses it (Access denied)** — so nothing is actually received or changed. So it is a **misleading, dead-end screen that shouldn't be reachable**, not a case of a view-only user really receiving parts. QA's headline ("receive same as Admin / bypasses the permission model") is **right that there's a defect but overstated** — the real system does block the actual receive.

- **SV-8516 (real, front-end already fixed, one back-end residue to flag).** A Time Clock user used to be able to edit / cancel / return parts and change the vendor. The **front-end fix holds** — that user now only sees "Return" on the parts menu. **However,** the underlying system will **still accept a part edit sent directly to it** from a Time Clock user. Per our standing rule, a front-end block that the API can still get past is **flagged, not a re-opened bug** — unless the product owner decides the system itself must enforce it.

- **SV-8541 (real, but pre-existing and awaiting a product decision).** A user **without** the "Work Order Line: Create & Edit" permission can still **resolve cores** — we proved the system accepts it (returns success) even for the lowest-privilege Time Clock role. This is **not** something Simple Flow broke; it behaves the **same on Production**, and the specification itself says these fine-grained work-order gates are front-end conveniences the back-end does not separately enforce. It is correctly **open with the developer (Sasha) as a clarification**.

**Corrected verdict.** The 11 cases still pass for what they tested (the documented per-role matrix cells). But the report's *feature-wide* "PASS / everything behaves as specified" claim is **CORRECTED**: there are **three action-path coverage gaps** — **two real defects** (one front-end-exposure defect the developer is already fixing; one front-end-fixed-but-back-end-open flag) and **one pre-existing/spec-interpretation item** open with the developer. **QA caught three genuine gaps that our pass missed.**

---

## 2. Per-issue analysis

Case references carry the TestRail ID + link (Rule 8). Plain-English verdicts; the atom / §-references sit in the labelled detail columns (Rules 7/25).

| Issue (link) | What QA reported | Role / env QA used | Our prior finding (case + C-id + link) | Live ground truth this run (UI + API status + evidence) | Verdict | Spec wording it deviates from (verbatim, Rule 25) | Was QA right? | Our miss (path not driven) |
|---|---|---|---|---|---|---|---|---|
| **SV-8515** — https://shopview.atlassian.net/browse/SV-8515 (Story Defect · **Ready to Fix** · Dusan) | Office / Vendor & Order Mgmt **View-only** user has no per-PO Receive button but can multi-select → **Receive Selected** → edit invoice/vendor and **bulk receive "same as Admin."** | Office user (real prereq = Vendor & Order Mgmt: **View** only). Staging vs Production. | **SF-PERM-03 / C29407** — https://shopview.testrail.io/index.php?/cases/view/29407 ("which roles can Bulk Receive"; we said "Office view-only per spec — PASS") + adjacent **SF-PERM-05 / C29409** — https://shopview.testrail.io/index.php?/cases/view/29409 (per-PO button hidden — still valid) | **UI:** per-PO Receive **hidden** ✓; but after multi-select the **"Receive Selected"** button appears and opens the full editable **/bulk-receive** "Receive Vendor Parts" screen (33 editable inputs — invoice#, date, cost $, tax) with no front-end gate (`sv8515-office-after-select.png`, `sv8515-bulk-receive-screen.png`). **API:** the read `receive-view` = **200** (why the screen loads); the actual **`POST /api/inventory/orders/accept` = HTTP 403 `{"errors":[{"error":"Access denied."}]}`** — receive does **not** complete (`sv8515-recv5-net.json`). Control: same empty body = 400 (validation) for Admin vs 403 (Access denied) for Office = a real back-end gate. Clean role (drift ruled out). | **Real front-end-exposure defect** (developer-accepted, Ready to Fix). **NOT a data bypass** — back-end blocks the actual receive. | §9.1: *"Bulk Receive page (accountant, PO-list driven) | 7/8/9 | **Vendor & Order Mgmt: Create & Edit** (route gate `hasPartsPermissions`) + See Financial Data…"* — front-end must require Create & Edit to reach the screen. §9.2 Office = **"No (4)"**, footnote 4: *"Office has Vendor & Order Mgmt: View only → **can open Bulk Receive but cannot receive**."* Back-end matches spec (receive blocked); **front-end deviates** by exposing the Receive-Selected entry point. | **Yes** — real front-end defect — **but overstated** the bypass (the receive is blocked at the back end, so no privilege escalation / no data mutation). | We never drove the **multi-select "Receive Selected"** alternate entry point for a View-only user — SF-PERM-03/C29407 stopped at route-level nav; SF-PERM-05/C29409 stopped at the per-PO button. |
| **SV-8516** — https://shopview.atlassian.net/browse/SV-8516 (Story Defect · **Done** · `Staging_Verified` · Dusan) | Time Clock user could **edit / cancel / return** parts and **change vendor** (should have no access; Production blocks it). | Time Clock user. Staging vs Production. | **No dedicated part-action negative existed.** Nearest: **SF-PERM-09 / C29413** — https://shopview.testrail.io/index.php?/cases/view/29413 (financial part-add gate) + **SF-PERM-10 / C29414** — https://shopview.testrail.io/index.php?/cases/view/29414 (per-role **completion** matrix only). | **UI (the fix):** Time Clock part-row ⋮ menu now shows **only "Return"** — Edit / Cancel / Change-Vendor removed (`sv8516-tc-menus.json`, `sv8516-tc-wo-lines.png`) → the Done / Staging_Verified fix **holds at the front end**. **API (the residue):** Time Clock (confirmed **3/3** perms live) can **still edit a part** via **`POST /api/work-orders/part/change-request` = HTTP 200, and the change persisted** (re-GET showed the new description) — same as Admin. Edit of an already-received part is blocked by **state** ("can't be modified once received"), not permission. Clean role (drift ruled out). | Original over-grant was **real, now front-end-fixed**; residual back-end-accepts-edit = **Rule-24 API-possible flag** — **not** a re-opened bug unless the PO requires back-end enforcement. | §9.2: Time Clock = **"No" across every column** (no access) — a Time Clock editing a part contradicts this. §9.1 (Sasha's mapping): part-request management (make/edit/cancel) → **"WO Lines: Create & Edit"** (Time Clock lacks it → back-end *should* block). §9.4 counterweight: *"FE distinctions … are **conveniences, not BE-enforceable boundaries**"* → so the residual back-end-possibility is spec-anticipated (flag). | **Yes** — real; **front-end fixed, back-end still open** (Rule-24 flag). | We had **no per-role part edit / cancel / return negative anywhere** in the suite. |
| **SV-8541** — https://shopview.atlassian.net/browse/SV-8541 (Story Defect / **Clarification** · **Open** · Sasha) | A user **without "WO Line: Create & Edit"** can **return a received special-order part** and **resolve cores** (OK/Not OK). Same on Staging **and Production**. | User lacking WOL C&E (tested **Office** and **Time Clock**). Staging + Production. | **SF-REV-14 / C29399** — https://shopview.testrail.io/index.php?/cases/view/29399 ("cores decided before receiving") — touches core resolution but **no per-role permission-negative**. | **API:** **`POST /api/work-orders/{id}/pre-resolve-cores {cores:[{partRequestId,isCoreOk:true}]}` = HTTP 201 `{"resolvedCount":1}`** for **Office** (WO 3996683a) **AND Time Clock** (WO 1b6f0ae6) — endpoint applies **zero permission check** (`LOG-SV-8541`). Part-action endpoints returned **state 400** (not permission 403) for Office & Time Clock. **UI:** low-priv roles also **see** the controls (Office shows Return/Core/Edit; Time Clock ⋮ shows Return). Clean template roles (drift ruled out, before==after). | **Real & reproduces on clean roles.** Time Clock holds **none** of the §9.4 collapsing atoms yet still succeeds → **genuine missing back-end check** — **but pre-existing** (matches Production) and **spec-anticipated** per §9.4. Correctly **Open for Sasha** (Rule 24/25 clarification). | §9.1: *"Resolve inventory / special-order cores (Ok/Not OK) | 3/4/16 | **WO Lines: Create & Edit**."* — spec requires WOL C&E. §9.2: Time Clock = **"No"** every column. **Counterweight (Rule 25 honesty):** §9.4: the collapse is *"a deliberate, spec-sanctioned low-privilege trade-off (SV-7864). FE distinctions … are **conveniences, not BE-enforceable boundaries**."* — the spec itself anticipates back-end non-enforcement (why it's a clarification, not a clean bug). The **one** part §9.4 does **not** cover: a role (Time Clock) holding **none** of the collapsing atoms still succeeding = the gap for Sasha. | **Yes** — real; **pre-existing / spec-interpretation** (flag), correctly Open with the developer. | SF-REV-14/C29399 exercised cores **functionally** but never as a **per-role permission-negative**. |

---

## 3. Where our report was wrong (blunt)

**Three dimensions the 2026-07-23 pass missed:**

1. **Alternate entry points were not driven per role.** We verified route-level navigation (`/parts/orders` allowed/denied) and the **per-PO** Receive button being hidden — but never the **multi-select → "Receive Selected"** path into the editable Bulk-Receive screen. That is exactly where SV-8515 lives. A hidden button on one path does not mean the action is unreachable on *every* path.
2. **The back end was not probed per granular action.** We probed the **settings save** endpoint (403/200) and concluded "back end enforces," but we did **not** probe the **part-action** endpoints (`part/change-request`, `pre-resolve-cores`, part status-action) per no-access role. Doing so is what surfaced the SV-8516 back-end-accepts-edit **Rule-24 flag** and the SV-8541 **core-resolve = 201 with no gate**.
3. **No cases existed for these negatives.** The suite had no per-role **part edit / cancel / return** negative and no per-role **core-resolution** negative. Several report rows were **"PASS (composition-verified)"** — i.e. inferred from the role's permission list plus an *inherited* gate, **not driven live per action** (which is the very gap Rule 12 warns against: a matching permission list ≠ an observed, enforced action).

**And critically — the framing.** We reported **"110 role-and-permission combinations, zero mismatches, controls behave exactly as specified — PASS"** as **feature-wide completeness**. It was not. It was completeness *for the 11 documented matrix cells we chose to test*. The correct claim would have been scoped: *"the documented §9.2 matrix cells pass; action-path and back-end-per-action coverage is not yet exhaustive."*

**The one thing we got RIGHT (keep the credit honest):** on **SV-8515**, our report said Office is **"view-only (can open, cannot receive) exactly per spec"** and that the **back end enforces (403)**. That conclusion is **correct** — the live `accept` call returns **403** and nothing is received. What we missed was the **front-end exposure** of the editable screen *along the way*. So: right about the back-end enforcement, wrong to assume the front-end path was therefore clean.

---

## 4. Root cause

Our VIU applied the four documented layers (composition / back-end endpoint / front-end route / on-screen element) to the **11 cases we had**, and did that well for those cells. The failure was in **scope and method breadth**, not in the individual observations:

- **(a) Action-path coverage was not exhaustive.** We tested *whether a role can reach a feature* (route/nav/button) but not *every way to perform the action* — alternate entry points (multi-select / bulk / kebab menus) were not driven per role.
- **(b) Per-action back-end probing was not exhaustive.** We probed one endpoint family (settings) for 403/200 and generalised "back end enforces." We did not send the **specific granular action** (part edit, core resolve) to the back end **as each no-access role** — which is the only way to catch front-end-exposure gaps *and* Rule-24 API-possible flags.
- **(c) The suite had no cases** for part edit/cancel/return per role, or core-resolution per role — so nothing prompted the checks.
- **(d) The completeness claim was mis-scoped.** "All pass" was reported as feature-wide; a **passing matrix cell is not a fully-enforced action**, and several rows were composition-inferred rather than action-driven.

**In one line:** we proved the documented gates were configured correctly, but did not adversarially try to *break* every action from every role by every path and against the back end — so the enforcement holes hid in the paths and endpoints we never exercised.

---

## 5. Corrective actions (proposed — NOT authored / NOT pushed)

Three new/updated permission-negative cases. **Each needs user approval to author, and eventual explicit permission to add to TestRail (Standing Rule 6).** Traceability (ticket + spec anchor) per Rule 20.

1. **(NEW) Bulk-Receive "Receive Selected" multi-select negative for a Vendor & Order Mgmt View-only user.**
   *Assert:* per-PO Receive hidden (passes) **and** the **multi-select "Receive Selected"** button must **not** open the editable /bulk-receive screen for a View-only user (currently the front-end **exposes** it — defect), **and** the actual receive is blocked at the back end (`accept` → **403**).
   *Also update* **SF-PERM-03 / C29407** (https://shopview.testrail.io/index.php?/cases/view/29407) to drive the multi-select path, not just route-level nav.
   *refs:* **SV-8515** / SV-8183 (§9.1 Bulk-Receive route gate `hasPartsPermissions`; §9.2 footnote 4).

2. **(NEW) No-access role (Time Clock) part edit / cancel / return negative.**
   *Assert:* the UI **hides** Edit / Cancel / Change-Vendor for Time Clock (passes — the SV-8516 front-end fix), **and** flag per **Rule 24** that the action is **still possible via the API** (`part/change-request` → 200, persisted). Not a bug unless the PO requires back-end enforcement.
   *refs:* **SV-8516** / SV-8183 (§9.2 Time Clock row; §9.1 part-request → WO Lines: Create & Edit; §9.4 atom-collapse).

3. **(NEW) WO-Lines-C&E-gated core-resolution / received-part-return negative.**
   *Assert:* a role **without** WO Lines: Create & Edit (test **Time Clock**) — the intended rule is that it cannot resolve cores / return a received special part; capture that the back end **currently returns 201 with no gate** (`pre-resolve-cores`). **Pending Sasha's SV-8541 ruling** on whether back-end enforcement is required.
   *refs:* **SV-8541** / SV-8183 (§9.1 resolve cores → WO Lines: Create & Edit; §9.2 Time Clock row; §9.4 atom-collapse caveat).

---

## 6. "Was QA right?" scorecard

| Issue | C-id links to our nearest case | QA's call | Reality (live-verified) | Was QA right? |
|---|---|---|---|---|
| **SV-8515** | SF-PERM-03 / C29407 · SF-PERM-05 / C29409 | Real defect; "view-only can receive same as Admin — bypasses the permission model." | Real **front-end-exposure** defect (dev accepting, Ready to Fix). Back end **blocks the actual receive (403)** — no data bypass. | **Yes** — real defect, but **overstated the bypass**. |
| **SV-8516** | SF-PERM-09 / C29413 · SF-PERM-10 / C29414 | Real over-grant (Time Clock could edit/cancel/return/change-vendor). | Was real; **front-end now fixed** (⋮ = only Return). **Back end still accepts a part edit** (change-request → 200) = **Rule-24 flag**. | **Yes** — real, front-end-fixed, **back-end still open**. |
| **SV-8541** | SF-REV-14 / C29399 | Real; user without WO Lines: C&E can resolve cores / return received part (Staging + Production). | Real; **pre-existing** (matches Production), **spec-anticipated** (§9.4). Time Clock exceeds the documented collapse. Correctly **Open** for Sasha. | **Yes** — real, **pre-existing / flag**, correctly a clarification. |

**Net:** **QA caught 3 real coverage gaps. Our report over-claimed completeness.** Two are real defects (one front-end-exposure, developer-accepted; one front-end-fixed with a back-end Rule-24 flag) and one is a pre-existing/spec-interpretation clarification open with the developer.

---

## 7. Corrected SV-8183 status

| | Prior report (2026-07-23) | Corrected (2026-07-24) |
|---|---|---|
| Test cases | 11 passed / 0 failed / 0 blocked | **11 still pass for what they tested** (the documented §9.2 matrix cells) |
| Feature-wide claim | "PASS — controls behave exactly as specified; 110 combinations, 0 mismatches" | **CORRECTED — scoped to tested paths, not feature-wide;** 3 action-path coverage gaps found by QA |
| Defects | 0 | **2 real** (SV-8515 front-end-exposure, dev Ready-to-Fix; SV-8516 front-end-fixed / back-end-open Rule-24 flag) + **1 pre-existing/spec-interpretation** open for Sasha (SV-8541) |
| Coverage | implied complete | **3 negatives missing** (proposed in §5, not yet authored) |

**Corrected verdict:** *The documented per-role matrix cells pass (11/11). The suite does not yet cover the multi-select bulk-receive path, per-role part-action back-end gating, or per-role core-resolution — three gaps QA correctly surfaced. Two real defects + one clarification result. The 2026-07-23 "feature-wide PASS" is corrected to a scoped PASS.*

---

*Evidence: `build/simple-flow/sv8183/ayesha-issues/reverify-2026-07-24/` (LOG-SV-8515.md / LOG-SV-8516.md / LOG-SV-8541.md; `sv8515-recv5-net.json` = accept 403; `sv8516-tc-menus.json`; `role-drift-before/after-2026-07-24.json`; screenshots + API captures). Commits b59e8a8 / 7ccb91e / 6dccb54. Tickets: `ayesha-issues/requirements-SV-85{15,16,41}.md` + `ISSUES-SUMMARY-2026-07-24.md`. Spec: `requirements.md` §9 (§9.1 gates / §9.2 matrix / §9.4 atom-collapse) + `sv8183/requirements-SV8183_1.md`. Prior report: `sv8183/SimpleFlow_SV-8183_Permission-Test-Report_2026-07-23.md` (see its 2026-07-24 CORRECTION addendum).*
