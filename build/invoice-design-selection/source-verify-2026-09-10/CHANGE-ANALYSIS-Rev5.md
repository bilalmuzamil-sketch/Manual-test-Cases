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

## G. Second full re-verification, same day (2026-09-10, after another source touch)
Re-read all sources live again on the QA lead's order. Findings:
- **Jira unchanged** — epic SV-9892, stories SV-9893–9897, engineering story SV-9872: identical to the
  first read (updated timestamps unchanged, 2026-09-10 08:46 / 02:32). SV-9896 still says "do not start
  before Q6"; the epic still says "Q6 can still reshape Story 4".
- **Spec page touched (~6 min before the read) but the REQUIREMENTS BODY (Story 1–5, S1..S5) is byte-for-byte
  identical to Rev 5.** The change is confined to the Section 8.1 decision cells:
  - **Q6 decision cell now records option (a)** ("A) … retroactively changing all Invoice-type documents
    created prior to Sep 9 2026 … Documents created on/after Sep 9 and before this feature persist Modern …
    Documents after release respect the new setting"). This is the spec as written (S4-R1..R5).
  - Q7, Q8 decision cells now prefixed "A)"; **Q12** gained option "(C) edit manually as needed" and its
    decision includes (C); **Q17** decision adds "run through AI again to simplify … before deciding";
    Q15 typo fixed. None of these change any requirement or any case expectation.
- **⚠️ The spec is internally contradictory on Q6:** the decision cell says (a), but the **header still
  reads "Q6 to Q12 awaiting a Product decision"**, the **change log has no new revision**, and **SV-9896
  still says "do not start before Q6"**. Per Rule 56 the divergence is disclosed, not silently resolved;
  per Rule 58 the affected cases are not over-committed.
- **Action:** requirement text unchanged ⇒ **no expectation changes on any of the 54.** The 10 Story-4
  cases (C53554–C53562, C53546) get their Q6 note updated to record that Product has now written option (a)
  **while stating the header/story still lag**, and they stay **NOT-FINAL** until the spec formally closes
  Q6. All 54 re-verified for render (full, Rule 101). **Flagged to the QA lead** (register item B updated):
  is Q6 to be treated as decided, so the 10 ship-day cases can become final?

## H. Third full re-verification — the spec rolled the Q-answers into the body (2026-09-10, later)
Chris Ward rolled the answered questions into the requirement body (new 2026-09-10 revision; header now
"Q6 and Q8–Q12 answered and written into the rules; Q7 remains open"). Full re-read of the whole document +
the epic, five stories and SV-9872 (Rule 108). What moved and the case actions:
- **Jira UNCHANGED** (epic + stories + SV-9872 timestamps still 08:46 / 02:32). The epic still says "Q6 can
  still reshape Story 4" and **SV-9896 still says "do not start before Q6"** — **that Jira wording now LAGS
  the rolled-in spec and is stale.** Spec is authoritative (Rule 32/57); the lag is disclosed on the cases
  and flagged to the QA lead, not silently reconciled.
- **Q6 RESOLVED in the body** (Section 2 note, JTBD 3, Story-4 warning all rewritten): the retroactive pin
  is the INTENT, Story 4 is cleared to build. **⇒ the 10 Story-4 cases (C53554–C53562, C53546):** the note
  changed from "awaiting/not-final" to "Q6 resolved — Story 4 confirmed"; expectations unchanged (they
  already matched option a). Still "Not available on Build" (no build yet).
- **S1-R7 dialog copy TIGHTENED (Q10 applied to the body)** — a real Expected change. **⇒ C53524 (Legacy)
  and C53525 (Modern):** dialog body updated to "Estimates not yet invoiced will use the … design straight
  away. Invoices and credit invoices created from now on will use it too. Invoices and credit invoices that
  already exist keep the design they were created with, and the estimate for a work order or parts sale that
  has been invoiced matches its invoice. You can switch back at any time." Note records the title-case button.
- **S1-R3 helper text UNCHANGED** ⇒ **C53520** keeps its wording; its "under challenge" note is REMOVED (the
  helper text is the final Q10-ruled wording).
- **S3-E1 body now explicitly includes the portal held-copy case (Q9 rolled in)** — C53551's note stays accurate.
- **Q8/Q11/Q12 became Key Decisions** (family capture; generic audit log enough; no rollback, edit manually).
  No new case; C53539's Q8 note stays.
- **Q7 STILL OPEN** (pending eng; interim: Modern keeps every fix) — C53532's Q7/SV-9790 note stays.
- **Part Sale Credit now stated as included** (header) ⇒ C53543 note updated (sixth doc included; Section 2
  body still says "five").
- **Provenance re-anchored** on all 54 to "the 2026-09-10 revision that folded the Q6 and Q8–Q12 rulings into
  the rules (post-Revision 5)", read 10 Sep.
- **Cutoff discrepancy persists** (SV-9872 D4 09:14:35 vs spec 09:13:36) — SV-9872 not updated; spec wins.
