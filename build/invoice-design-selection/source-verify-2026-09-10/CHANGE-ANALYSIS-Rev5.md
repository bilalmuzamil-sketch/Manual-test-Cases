# Invoice Design Selection — source re-verification, spec Rev 3 → Rev 5 (2026-09-10)

Full source re-verification (Rule 101 — every case, no delta), triggered by the QA lead handing over the
updated sources: new epic + stories now exist, and the spec advanced from Revision 3 (what the 54 cases
were authored against) to **Revision 5**.

## A. The sources as they read TODAY (read live 2026-09-10)
- **Epic:** **SV-9892** "Invoice Design Selection" (Open). *Was authored against old epic SV-8218.*
- **Stories (new — resolves gap G3, all keys were "TBD"):**
  | Story | Jira | Covers requirement ids |
  |---|---|---|
  | Story 1 Choose the invoice design | **SV-9893** | S1-R1..R10, S1-N1..N4, S1-E1 |
  | Story 2 Invoice-type capture at creation | **SV-9894** | S2-R1..R6, S2-E1..E4 |
  | Story 3 Estimate-type use current setting | **SV-9895** | S3-R1..R3, S3-N1..N2, S3-E1..E3 |
  | Story 4 Documents created before the setting | **SV-9896** | S4-R1..R5, S4-N1..N2, S4-E1..E2 |
  | Story 5 Every surface renders the design | **SV-9897** | S5-R1..R5, S5-N1..N2, S5-E1..E2 |
- **Spec:** Confluence page **845447188** "Invoice Design Selection — Product Spec", **Revision 5**
  (2026-09-10, Sasha Grosman). Status: **Draft — Q6 to Q12 awaiting a Product decision (Section 8.1).**
- **Engineering review story:** **SV-9872** (carries delivery + two decisions D1/D4).
- **Related refresh epic:** **SV-8218** Invoice UI Refresh — **released in v26.36.0 on 2026-09-09** (Done).
- **Design:** Modern = the SV-8218 Design Document; Legacy = the v26.35.10 templates restored by engineering.
  Setting-UI design is **still TBD** (gap G2 stays open).

## B. Gaps from the Rev-3 authoring that are now ANSWERED
- **G4 / AS-1 (do the legacy templates exist?)** — **ANSWERED (Q13):** the refresh overwrote them; engineering
  has **restored the legacy templates from v26.35.10**. So Legacy render is real. (Section 6 assumption now
  recorded as disproven-then-restored.) The restored templates carry v26.35.10 defects — see Q7 (open).
- **G1 (ship date / cohort cutoff)** — **refresh-release cutoff = 2026-09-09 09:13:36 UTC (Q16, confirmed),**
  with a 71-second mixed window before it. *(The setting's own ship date is still undated — target v26.38.0,
  which does not exist in the project yet.)*
- **Feature now being built** — SV-9872: hotfix to `main`, builds on `feature/legacy-invoice-layout`. Still
  no dated QA build → markers stay "Not available on Build" until a build exists (verify live before build-verify).

## C. Universal change — ALL 54 cases (C53518–C53571)
Every case's provenance names **epic SV-8218** and **spec Revision 3** (audited live: 54/54). Re-point to:
- **epic SV-9892** + the **per-story Jira key** (S1→SV-9893, S2→SV-9894, S3→SV-9895, S4→SV-9896,
  S5→SV-9897; an FO-* case takes the story key of the behaviour it checks).
- **spec page 845447188, Revision 5, read 10 September 2026.**
- Markers unchanged ("Not available on Build to test Yet - Last checked 9/10/2026") — no QA build yet.
- These are **our** cases (`created_by=3`, `custom_atmstatus=1` Not Automated) → we correct them directly;
  no Rule 38 / Rule 71 constraint. `add_case`/`update_case` are permitted (Rule 62-a).

## D. Case-specific reconciliation (Rule 106 — case vs live source)
| Case | Req | Finding vs Rev 5 | Action |
|---|---|---|---|
| **C53570** | S5-E1 | **CASE DISAGREES WITH SOURCE.** Title/expected say the Authorizer is *omitted* from a legacy document. Rev 5 S5-E1 (rewritten under Q14) says the legacy templates **do have an Authorizer column that prints the IBS approval code** (not the approving contact); the contact is still selected + locked on the WO, and prints normally again after a switch back to Modern. | **Correct the case** — retitle + rewrite Expected to the Q14 wording. |
| **C53554/55/56/57/58/59/60/61/62, C53546** | S4-R1..R5, S4-N1/N2, S4-E1/E2, FO-8 | **SOURCE UNDER OPEN DECISION (Q6).** Spec still carries S4-R1..R5 verbatim, but Q6 is High-priority **awaiting Product** and the spec says *"this story should not start before Q6"*; one Q6 option is to **drop S4-R1 entirely**. Product has written a leaning toward option (a) "Story 4 wins" in the Decision cell but Status still reads awaiting. Also pin the **exact cutoff 2026-09-09 09:13:36 UTC** (cases say "before 2026-09-09"). | Keep cases (expectation stays, Rule 57), **pin the cutoff instant**, add a **Q6-open note** to each so the tester knows the cohort flip is not yet Product-confirmed. Report Q6 as the top outstanding PO item. |
| **C53541** | S2-R4/S2-E1 | Rev 5 adds a **deliberate exception (Q19, settled):** the internal labour-type fix command reverses+recreates and **keeps each invoice's original design** — not the current setting. | Add the Q19 exception note to Expected. |
| **C53520** | S1-R3 | Helper text still verbatim in body but **under challenge Q10** (leaning "tighten"). Confirm the case quotes the **Rev-5 exact string**. | Keep verbatim string; add "wording under challenge (Q10)" note. |
| **C53524/C53525** | S1-R7 | Dialog titles/bodies/buttons verbatim in body, **under challenge Q10**; Q10 also notes the app renders the button as title-case "Switch To Legacy". | Keep verbatim; add Q10 note. |
| **C53551, C53566** | S3-E1, S5-R4 | **Q9 (settled (a)):** an approval estimate already pushed to the portal **keeps the design it was sent in** after a switch (held copy, like S3-N1). | Add the Q9 held-copy exception note. |
| **C53543** | FO-4 | Case says the setting governs **all five** refreshed documents. Rev 5 (Q21, settled) found a **sixth** — the **Part Sale Credit**; new ones can't be created, existing render Legacy, tied to Q6. | Add a note: a sixth document (Part Sale Credit) exists; "all five" language is under Q6/Q21. |
| **C53552** | S3-E2 | Rev 5 (Q18) confirms **void** behaves like reversal (estimate returns to the setting). Case covers reversal only. | Broaden Expected to name void too (per Q18). |
| **Legacy-render cases** (any asserting a Legacy render is "correct") | — | **Q7 (open):** Legacy = byte-identical v26.35.10, so it **restores already-fixed defects** (no-logo wordmark, raw deposit, today's-date due date, $0.00 balance, missing disclaimer, VIN placeholder, remit-to). **Q15 (open):** the SV-9832 fee breakdown — PM wants it **fixed and shown on Legacy AND Modern**, contradicting SV-9872's D1 ("not restored on Legacy"). | Note on relevant cases that Legacy may show known v26.35.10 defects (Q7) and the fee-breakdown is unsettled (Q15). No Expected change — documents own the expectation; these are build-verification watch-outs. |

## E. Cross-source divergence to flag
- **Cohort cutoff timestamp:** SV-9872 (D4) says **09:14:35 UTC**; the **spec (Q16) and SV-9896 say 09:13:36 UTC**.
  The **spec is authoritative (Rule 57)** → use **2026-09-09 09:13:36 UTC**. SV-9872's number is stale; flag it.

## F. Outstanding → PO / QA-lead items (Rule 98/99)
1. **Q6 (High):** does Story 4 ship (flip pre-refresh back catalogue to Legacy on ship day) — the whole
   Story-4 suite (10 cases) is provisional until this lands.
2. **Q7 / Q15 (High/Med):** which restored Legacy defects stay, and whether the fee breakdown returns to Legacy.
3. **Q10 (Low):** final dialog/helper wording — the S1 copy cases follow it.
4. **G2:** the Setting-UI design is still TBD — S1 routes stay provisional.
5. **Cutoff timestamp** discrepancy (E above).
