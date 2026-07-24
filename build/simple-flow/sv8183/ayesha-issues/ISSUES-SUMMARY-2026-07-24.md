# Ayesha's SV-8183 Issues — Pre-Analysis Summary (Simple Flow Permissions)

- **Ingested:** 2026-07-24 (live Atlassian REST v3 session — no OTP needed, cached cookie still valid, `/rest/api/3/myself` → 200)
- **Project:** Simple Flow, Epic **SV-7301**, PO **Milos**. Permission story = **SV-8183** (parent of all three issues).
- **Reporter of all three:** Ayesha Khan (QA), while testing SV-8183.
- **Scope of this doc:** INGEST + pre-analysis only. **NO live VIU run, NO TestRail writes, NO case authoring.** Every category below is **TENTATIVE and must be live re-verified** against a CLEAN role baseline (Rule 26 — reset each role to template first; the shared staging org d55bc308 is known to drift).
- **Attachment caveat:** all 5 attachments across the 3 tickets are **screen-recording videos** (no still images). `ffmpeg`/`ffprobe` unavailable → frames not extractable / not visually analyzed this run. Repro captured from the ticket text; videos are supplementary.
- **Case-ID references** (Rule 8, from `build/simple-flow/testrail-id-map.csv`):
  - SF-PERM-03 = **C29407** (Bulk Receive per-role) — https://shopview.testrail.io/index.php?/cases/view/29407
  - SF-PERM-05 = **C29409** (PO Receive button hidden for office/readonly) — https://shopview.testrail.io/index.php?/cases/view/29409
  - SF-PERM-10 = **C29414** (per-role completion matrix) — https://shopview.testrail.io/index.php?/cases/view/29414
  - SF-PERM-09 = **C29413** (Technician cannot add vendorless/no-PN part — See Financial Data gate) — https://shopview.testrail.io/index.php?/cases/view/29413
  - SF-REV-14 = **C29399** (cores decided before receiving) — https://shopview.testrail.io/index.php?/cases/view/29399

---

## SV-8515 — Office (Vendor & Order Mgmt: View only) can Bulk Receive
**Ticket:** Story Defect · Status **Ready to Fix** · assignee Dusan Radulovic · relates to SV-8541.

- **(a) What Ayesha did / role + env:** Logged in as an **Office user** on **Staging** (compared against **Production**). Parts → Purchase Orders → **multi-select POs → Receive Selected** → entered invoice/part numbers, **changed vendor**, and bulk received. Also tried cancel/return of parts. *(Sasha reframed the real prerequisite in-ticket to a user holding **Vendor & Order Management → View** permission, not the Office role specifically — Ayesha confirmed.)*
- **(b) Expected:** A Vendor & Order Mgmt **View-only** user can view but **not receive or edit** on Bulk Receive — matching Production.
- **(c) Observed (bug):** Office/View-only user has **no per-PO Receive button** yet can still multi-select → **Receive Selected** → receive/edit/change-vendor "same as Admin."
- **(d) SV-8183 behavior touched:** §9.1 row *"Bulk Receive page (accountant, PO-list driven)"* → gated by **Vendor & Order Mgmt: Create & Edit (route gate `hasPartsPermissions`)**; §9.2 per-role matrix **Office = Bulk Receive "No (4)"** with footnote 4 *"Office has Vendor & Order Mgmt: View only → can open Bulk Receive but cannot receive."* So the observed receive-capability contradicts the spec (Rule 25 wording cited).
- **(e) Closest OUR case(s):** **SF-PERM-03 / C29407** ("Verify which roles can perform Bulk Receive") is the direct match; **SF-PERM-05 / C29409** ("PO Receive button hidden for office/readonly users") is adjacent — note the *per-PO* button IS hidden (matches SF-PERM-05), but the *multi-select Receive Selected* path is NOT gated (the hole SF-PERM-03 should have caught).
- **(f) TENTATIVE category — NEEDS LIVE RE-VERIFY:** Looks like a **real permission-enforcement gap we did not catch on the Bulk-Receive negative for a View-only user** (the per-PO button was hidden, but the bulk multi-select path stayed open). Dev agrees (Ready to Fix; "must have Vendor & Order Mgmt → Create & Edit"). **Alternative to rule out live:** a **role-DRIFT artifact** — the shared staging Office role/user may have been over-granted Vendor & Order Mgmt: C&E by a concurrent session. Re-verify on a template-reset Office (or a purpose-made View-only custom role) per Rule 26 before concluding.

---

## SV-8516 — Time Clock user can edit/cancel/return parts + change vendor
**Ticket:** Story Defect · Status **Done** · label **Staging_Verified** · assignee Dusan Radulovic.

- **(a) What Ayesha did / role + env:** Logged in as a **Time Clock user** on **Staging** (vs **Production**). Opened a WO/part and edited part details, cancelled part, cancelled order, returned part, changed vendor.
- **(b) Expected:** Time Clock = **no access** to part actions — cannot edit/cancel/return/change-vendor — matching Production.
- **(c) Observed (bug, original):** Time Clock could do **everything** on part details.
- **(d) SV-8183 behavior touched:** §9.2 per-role matrix — **Time Clock = "No" across every column** (no access). Sasha's ruling: *"Users require WOL → Create & Edit to manage anything related to part requests (make/edit/cancel)."* Part-request management maps to **WO Lines: Create & Edit** (§9.1 rows for line entry / core resolution).
- **(e) Closest OUR case(s):** No dedicated Time-Clock part-action negative exists in our suite; nearest are **SF-PERM-09 / C29413** (financial/part-add gate) and **SF-PERM-10 / C29414** (per-role matrix — completion only). **Gap:** our SF-PERM matrix cases cover completion / bulk-receive / review, not per-role part-EDIT/cancel/return gating.
- **(f) TENTATIVE category — NEEDS LIVE RE-VERIFY:** Was a **real permission bug** (staging-only, not on Production) — now **FIXED** (Done + Staging_Verified: edit/cancel/change-vendor no longer possible for Time Clock). **BUT** Ayesha's follow-up says the **residual return-part / cancel-return / resolve-cores** actions still work for Time Clock on **both** Staging and Production → she deliberately did **not** file a separate bug and folded it into **SV-8541** (see below). So: original over-grant = real-miss-now-fixed; residual = tracked as spec-interpretation clarification in SV-8541.

---

## SV-8541 — User WITHOUT "WO Line: Create & Edit" can return a received special part + resolve cores
**Ticket:** Story Defect (raised as a **Clarification**) · Status **Open** · assignee **Sasha Grosman** · relates to SV-8515. Supersedes SV-8515's cancel/return-parts half.

- **(a) What Ayesha did / role + env:** Logged in as a user **lacking Work Order Line: Create & Edit**, on **both Staging and Production**. On a WO: **returned a special-order part that was already received**; **resolved cores (OK/Not OK)** for an inventory part and a special part.
- **(b) Expected / clarification asked:** Per the permission model these actions **appear to require WO Line: Create & Edit** — confirm whether a user without it should be able to return a received special part / resolve cores.
- **(c) Observed:** The user **can** return the received special part and resolve cores despite lacking the permission — **identical on Staging and Production.**
- **(d) SV-8183 behavior touched:** §9.1 row *"Resolve inventory / special-order cores (Ok/Not OK)"* → gated by **WO Lines: Create & Edit**; return-of-received-part is a line/part action in the same family. **Critical caveat — §9.4 BE atom-collapse:** the spec itself states `woOrderParts`, `workOrderLinesCreateAndEdit`, `woFullViewMode`, `woTechViewMode`, `workOrdersCreateAndEdit` **all resolve to the same BE pair `ROLE_WORK_ORDER::VIEW + CREATE_AND_EDIT` and are indistinguishable server-side** — "a deliberate, spec-sanctioned low-privilege trade-off (SV-7864). FE distinctions … are conveniences, not BE-enforceable boundaries." (Rule 25 wording cited.)
- **(e) Closest OUR case(s):** **SF-REV-14 / C29399** (cores decided before receiving) touches core resolution; **SF-PERM-09 / C29413** touches part gating. **Gap:** no dedicated "WOL C&E gates core resolution / received-part return" permission-negative in SF-PERM.
- **(f) TENTATIVE category — NEEDS LIVE RE-VERIFY + PO/dev ruling:** Most likely a **spec-interpretation difference / pre-existing behavior, NOT a Simple-Flow regression** — Ayesha explicitly notes it behaves **the same on Production**, and §9.4's documented BE atom-collapse predicts exactly this (BE can't distinguish the sub-atoms, so any WO View+C&E-level access permits the action while FE hides it elsewhere). Per Standing Rule 24, "FE-restricted but API/BE-possible is NOT a bug (for now) — just FLAG it." **Blocked on Sasha's clarification** (ticket Open, assigned to her). Re-verify live on a template-reset role that genuinely lacks WOL C&E (Rule 26) and capture whether the block is FE-only vs BE-enforced.

---

## Cross-cutting notes for the (later) live VIU
1. **Reset roles to template first (Rule 26)** — shared staging org d55bc308 is known to drift (concurrent sessions re-grant atoms). Re-read + reset Office / Time Clock / the WOL-less role immediately before observing; the before→after diff is itself a finding (could explain SV-8515 as drift).
2. **§9.4 BE atom-collapse is the likely root theme** for SV-8541 (and possibly the residual SV-8516 return/core actions): FE gates ≠ BE boundaries. Classify FE-hidden-but-API-possible as a FLAG (Rule 24), not a bug, unless PO/dev rules BE enforcement required.
3. **Suite coverage gaps surfaced (do NOT author yet — flag as follow-ups):** (i) no Bulk-Receive negative for a View-only user via the *multi-select Receive Selected* path; (ii) no per-role part-EDIT/cancel/return negative for no-access roles (Time Clock); (iii) no WOL-C&E-negative for core resolution / received-part return.
4. **Dev/PO state:** SV-8516 = Done/fixed; SV-8515 = Ready to Fix (dev accepts — needs Vendor & Order Mgmt C&E to bulk receive); SV-8541 = Open, awaiting Sasha's intended-rule confirmation.
