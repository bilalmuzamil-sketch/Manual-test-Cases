# Simple Mode - Decisions We Need From You

Hi Milos - thank you for the time on this. Below are two concrete points we ran into while testing the current build by hand against the latest written spec. These are not guesses: for each one we put the written spec and the app's real behaviour side by side. In each case the spec either disagrees with itself or leaves the point open, so only a product decision from you can settle it. Please just pick one option per row (or add a note). Thank you!

---

## 1.

**The situation**
When someone receives a delivery of parts, some of the parts don't yet have a supplier assigned. The app gathers all of those "no supplier yet" parts into their own group. The question is simply where that group should sit in the list.

**What the written spec currently says**
The written spec gives TWO different answers in two different places. One place says the "no supplier yet" group should sit at the BOTTOM of the list. Another place says the very same group should LEAD - sit at the TOP. Both sentences are in the spec today, so the spec disagrees with itself.

**What the app actually does today**
On the newer bulk-receiving screen, the "no supplier yet" group currently appears at the TOP of the list (it leads).

**Why it needs your decision**
Because the spec says both "top" and "bottom" in different places, we genuinely cannot tell which one is correct. Only you can settle which the app should follow.

**The options**
- A) At the top (it leads) - this matches what the app does today.
- B) At the bottom of the list.
- C) Mixed in with all the other parts.

**Your decision:** ______________________________________________

---

## 2.

**The situation**
A brand-new shop opens the app for the very first time, having changed no settings yet. The app has an on/off setting for "a job must be reviewed before it can be finished and billed." The question is only about brand-new shops - existing shops keep whatever they use today.

**What the written spec currently says**
The spec leaves this open on purpose. It says the starting value should be decided "per type of shop," and it lists this exact point under its own "Open Questions" as still undecided - including specifically what a brand-new shop should start with.

**What the app actually does today**
The on/off setting exists on the settings screen and works, and existing shops keep their current behaviour. But because the spec never fixed a starting value for a brand-new shop, there is no defined starting value for a first-time shop for us to check against.

**Why it needs your decision**
The spec itself lists this as an open question and never set the starting value for a new shop, so there is nothing for us to test against. Only you can decide what a brand-new shop should start with.

**The options**
- A) Start turned ON for every new shop.
- B) Start turned OFF for every new shop.
- C) Start ON for larger/established shops and OFF for small new ones.

**Your decision:** ______________________________________________

---

Thank you! Just pick one option per row, or add a note. These two are the only points where the written spec either disagrees with itself or leaves the answer open - everything else we were able to confirm ourselves.

---
---

## Internal - QA lead only (NOT for the PO)

**Do not share this section (or any IDs / codes / clause numbers / links) with the PO.**

### Kept questions - evidence & mapping

#### Q1 - Vendor-missing group order on the receive list

- **TestRail cases:**
  - SF-RCV-05 - [C29373](https://shopview.testrail.io/index.php?/cases/view/29373)
  - SF-RCV-07 - [C29375](https://shopview.testrail.io/index.php?/cases/view/29375)
- **Exact spec clause:** SPEC SELF-CONTRADICTION in the current spec (spec-source-2026-07-14.md): S12-R1 (L686) = "...vendor-missing in their own group AT THE BOTTOM" vs S12-R3 (L690) = "...vendor-missing group LEADS" (top). Both are present and unchanged in the _3 (V2.5) upload (spec-diff-2026-07-14.md §C Q4: "top-vs-bottom ambiguity unchanged").
- **Build evidence:** OBSERVED build behavior (VIU 2026-07-14, PROJECT-STATE §0-ZZ; seeded vendor-missing PO S-15845): on the Bulk Receive surface the "Vendor Missing" group renders as the FIRST / TOP group. Evidence: screenshots/grind-2026-07-14/OBSERVE-bulkreceive-groups.png (+ VMGATE-01..03). Case notes in group-B-receiving-vendor.json (SF-RCV-05/07).
- **Run-325 (Ayesha):** Both Untested in run 325 (Ayesha Khan) - no remark (SF-RCV-05 C29373, SF-RCV-07 C29375; run325-status-map-2026-07-14.md).
- **Resolves to:** A (TOP/leads) -> SF-RCV-05 expected #3 changed from "at the bottom" to "leads (top)" on every receive screen incl. Bulk Receive; SF-RCV-07 already says "leads (top)" - no change; BOTH flip VIU-observed-awaiting-Milos -> VIU-Verified (build already matches). B (BOTTOM) -> SF-RCV-05 stays "at the bottom" on the newer screen; the build (top) then DEVIATES from the chosen rule -> log a build deviation for dev. C (mixed) -> rewrite both expecteds; build deviates -> dev deviation.

#### Q2 - New-shop starting default for "require a review before completion"

- **TestRail cases:**
  - SF-REV-15 - [C29400](https://shopview.testrail.io/index.php?/cases/view/29400)
- **Exact spec clause:** S1-R4 (L190, spec-source-2026-07-14.md) = "Require review before completion. ... Default PER COHORT (see §8)." §8 Open Questions (L~1690) lists it unresolved: "Require-review default - on for bigger/existing shops? + new-org preset (existing orgs keep today's behaviour via backfill)." Unchanged in the _3 (V2.5) upload (spec-diff-2026-07-14.md §C Q2: default still "per cohort (see §8)"; §8 open).
- **Build evidence:** OBSERVED build behavior: the Require Review Before Completion toggle IS present and works on the Work Orders settings tab (screenshots/wording-2026-07-13/SET-workorders-tab.png; SF-SET-14 verified). Existing orgs keep their behavior. The brand-new-org PRESET cannot be observed on the long-lived shared sv7301 org (its value reflects prior test toggling, not first-use) -> no defined new-shop default exists to test. Case note SF-REV-15 (group-C...json).
- **Run-325 (Ayesha):** Untested in run 325 (Ayesha Khan) - no remark (SF-REV-15 C29400; run325-status-map-2026-07-14.md).
- **Resolves to:** A (ON for all new) -> SF-REV-15 expected = default ON for new orgs (if the live new-org default != ON that becomes a separate dev bug to verify). B (OFF for all new) -> expected = default OFF for new orgs. C (ON big / OFF small) -> expected = cohort-based new-org preset per the §8 wording; author the cohort split. In all cases existing orgs stay backfilled to today's behavior.

### Dropped (not sent) + why

Of the 8 previously "awaiting-Milos" cases, these 5 are NOT genuine PO product decisions once re-validated against the current spec + build:

- **SF-REV-11** - [C29396](https://shopview.testrail.io/index.php?/cases/view/29396)
  - *Spec position:* S1-R4 makes "review before completion/invoicing" a per-shop On/Off SETTING; §8 does NOT list "make review mandatory" as an open question. New Δ5/S16-R12 (auto-complete-on-last-line) confirms: Require Review OFF -> auto-Complete (invoice-ready); ON -> Ready for Review, invoicing blocked until signed off.
  - *Build status:* Both legs BUILT + VIU-observed: direct sign-off completes the WO (Review->Complete, no separate final Complete); with Require Review ON invoicing is blocked until reviewed (SF-AUTO-05 verified the auto-complete trigger).
  - *Why dropped:* NOT a product decision - the spec already answers it (it is a per-shop toggle, not an open item), and the behavior is already built and matches the spec. The original Round-1 Q8 phrasing was one Milos found confusing.
  - *Self-resolution / routing:* SELF-RESOLVABLE: flip SF-REV-11 from VIU-observed-awaiting-Milos -> VIU-Verified (behavior matches S1-R4 + S16-R8 + Δ5/R12). No PO input needed.

- **SF-UX-04** - [C29404](https://shopview.testrail.io/index.php?/cases/view/29404)
  - *Spec position:* S15-R4 (L794) now FULLY specifies the behavior: "Close = closes the modal only, no discard, stays on the WO (prominent/red); Cancel = closes the modal + returns to the previous screen (text link, far left)." Only a note remains: "Design pending for the close-confirm specifically" (the VISUAL only).
  - *Build status:* The confirmation modal itself is not yet finished in the build (behavior not yet exercisable); our SF-UX-04 wording already matches S15-R4 exactly.
  - *Why dropped:* NOT a product decision - the spec already defines the Close/Cancel behavior; what is outstanding is the VISUAL design + the build, i.e. a design/dev completion task, not a PO A/B choice.
  - *Self-resolution / routing:* SELF-RESOLVABLE: case wording is already spec-accurate; keep it Blocked/pending until the modal is built, then VIU it. No PO input needed.

- **SF-SET-08** - [C29282](https://shopview.testrail.io/index.php?/cases/view/29282)
  - *Spec position:* Spec first-use defaults (§4: Auto-approve OFF / Create POs ON / Vendor Invoice REQUIRED) vs the design (ON / Optional). Already RECONCILED by last-update-wins -> spec is authoritative (contradiction-resolution.md: "spec first-use defaults authoritative ... live defaults are a build gap (GAP-B)").
  - *Build status:* Brand-new-org first-use defaults are non-observable on the long-lived sv7301 org; the settings model exposes no createPurchaseOrders field.
  - *Why dropped:* NOT a PO question - the decision is already made (spec wins). The remaining gap between spec defaults and the live defaults is a DEV build gap (GAP-B / bug draft T5); rule 7 keeps bugs off the PO sheet -> route to dev.
  - *Self-resolution / routing:* Route to DEV as GAP-B / bug draft T5 (wrong live first-use defaults). Not sent to Milos.

- **SF-COMP-06** - [C29295](https://shopview.testrail.io/index.php?/cases/view/29295)
  - *Spec position:* V2.4/_3 spec documents a Create Purchase Orders toggle (S1-R2 "Off -> no POs (default On)"; §4 "Create POs OFF => no PO"). Milos ALREADY ruled Round-1 Q5 ("we will Always have a PO" = PO-OFF descoped); last-update-wins kept the V2.4 documentation, so the residual is a spec-vs-build lag.
  - *Build status:* The Create Purchase Orders toggle is ABSENT from the settings tab and there is no createPurchaseOrders field; POs are always created for vendor parts (SF-SET-03 Deviation).
  - *Why dropped:* NOT a re-ask - Milos already answered (Round-1 Q5, POs always-on). The residual spec-vs-build mismatch is tracked as build-lag BUG-1 (contradiction-resolution C2) = a dev item, not a PO decision.
  - *Self-resolution / routing:* Route to DEV as build-lag BUG-1 (toggle not present). Not sent to Milos.

- **SF-QB-02** - [C29427](https://shopview.testrail.io/index.php?/cases/view/29427)
  - *Spec position:* Same Create-POs-OFF scenario as SF-COMP-06; the QuickBooks-integrity leg needs QB connected.
  - *Build status:* Create Purchase Orders toggle absent (POs always-on) AND QuickBooks is not connected on sv7301 (no QB admin/API), so the scenario is doubly non-configurable/non-observable here.
  - *Why dropped:* NOT a PO question - the Create-POs-OFF scenario was retired by Milos Round-1 Q5, and QB integrity is a Blocked-Env condition (needs a QB-connected company + a human in QB), not a product decision.
  - *Self-resolution / routing:* Keep Blocked-Env (QB-not-connected) + covered by Milos Round-1 Q5 ruling. Not sent to Milos.

**Notes:** Re-validated the 8 previously awaiting-Milos cases against the CURRENT spec (2026-07-14 `_3` upload = de-facto V2.5) + live build evidence. KEPT 3 cases -> 2 questions (both grounded in a spec self-contradiction or a spec-declared open question PLUS observed build behavior). DROPPED 5. TestRail IDs from `testrail-id-map.csv` (rule 8); bugs stay off the PO sheet (rule 7). Citations: `spec-source-2026-07-14.md`, `spec-diff-2026-07-14.md`, `contradiction-resolution.md`.
