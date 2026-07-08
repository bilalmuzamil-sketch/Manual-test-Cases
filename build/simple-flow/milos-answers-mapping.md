# Milos's Answers → Case Mapping & Proposed Changes (PROPOSAL — NOT YET APPLIED)

> **Status:** Milos answered the 11 Open Questions (Google Sheet, fetched
> 2026-07-08 — see `milos-answers-source.md`/`.csv`/`.xlsx`). This document maps
> each answer to affected cases with a **concrete proposed change**. **Nothing
> here is applied yet** — no case JSON, Excel, or TestRail edit has been made. We
> apply only after the user confirms.
>
> Outcome classes:
> - **SPEC CHANGE → update expected** — app behavior is intended / spec changes →
>   rewrite the case EXPECTED.
> - **CONFIRMED — expected already correct** — answer confirms our current
>   expected; no wording change (optionally drop the "PER SPEC" hedge).
> - **CONFIRMED BUG → keep expected, file ticket** — app is wrong; expected stays.
> - **AMBIGUOUS / UNANSWERED** — needs a follow-up from Milos.
> - **NO CASE IMPACT** — informational ruling only.

## Master table

| Q# | Milos's answer (verbatim, condensed) | Outcome | Affected cases | Proposed change / ticket note |
|---|---|---|---|---|
| 1 | "They should all have ON the review option" | SPEC CHANGE → update expected | SF-REV-15, SF-SET-14 | Default Require Review = **ON for ALL orgs** (no cohort split; new + existing). Rewrite SF-REV-15 expected; add "defaults ON" to SF-SET-14. If live default ≠ ON → that's a bug (verify live). |
| 2 | "We will not have No PO … removed in Jira" | SPEC CHANGE (No-PO path removed) + PARTLY AMBIGUOUS | SF-COMP-07, SF-QB-01 | The **No-PO / skip path is descoped** (POs always created — ties to Q5). The "skip path bypasses inventory" premise is moot. BUT the inventory-decrement invariant (do in-stock parts decrement + write Part History) is **not explicitly confirmed** — needs a follow-up before rewrite. |
| 3 | "(a) Spec defaults: Auto-approve OFF, Vendor Invoice REQUIRED … mockup shows the common case" | CONFIRMED — expected already correct + CONFIRMED BUG (live defaults) | SF-SET-08 | SF-SET-08 expected (Auto-approve OFF / Create POs ON / Vendor Invoice REQUIRED) is **authoritative** — keep; drop the "PER SPEC" hedge. Live org baseline shows Auto-approve ON / invoice Optional → **file bug: wrong first-use defaults** (dev to fix). |
| 4 | "Spec V2.3 governs; design is visual reference only." | NO CASE IMPACT (global ruling, reinforces others) | Global (SF-SET-08, SF-TECH-08, SF-REV-08) | Author EXPECTED to **Spec V2.3** where spec/design differ. Reinforces Q3 (spec defaults), Q9 (Story 17). Exception: where Milos explicitly descopes a spec item (Q5 Create-POs, Q7 review-note). No standalone wording change. |
| 5 | "We removed the PO OFF … changed the spec … we will Always have a PO" | SPEC CHANGE → update/retire expected | SF-SET-03, SF-COMP-06, SF-QB-02 | **Create-POs-OFF toggle is descoped; POs always ON.** Rewrite SF-SET-03 to verify NO toggle + POs always on + Vendor Invoice sub-setting always shown. **Retire** SF-COMP-06 and SF-QB-02 (the Create-POs-OFF scenario no longer exists). **BUG-1 is NOT a bug — intended descope.** |
| 6 | "Not spec'd. Low-priority polish — (a) intended for v1 or nice-to-have; not a blocker." | SPEC CHANGE → update expected (soften) | SF-SET-13 | Dirty-state gating **not required in v1**; Save always enabled is acceptable. Rewrite expected to: saving persists; no dirty-state gating required (low-priority polish). **BUG-2 downgraded** to nice-to-have, non-blocker. |
| 7 | "This is bug — (b) … the optional note will not be in the build. Review step should show the same things as now (better design)." | SPEC CHANGE → update expected (note descoped) — **but wording conflicts, confirm** | SF-REV-10 | Substance = **review note is descoped** (won't be built; review step stays as-is). Rewrite SF-REV-10 expected: NO optional note field; dialog shows current fields (VIN) only. **NOTE the conflict:** he typed "(b) Bug" but described a descope — confirm intent with user. **BUG-3 → intended descope** (pending confirm). |
| 8 | "not sure what this means?" | AMBIGUOUS / UNANSWERED | SF-REV-08, SF-REV-11 | **Not answered** — Milos didn't understand the distinct-Reviewed-state question. Keep expected as-is (spec = distinct Reviewed state). Re-explain and re-ask. **BUG-4 remains unresolved.** |
| 9 | (mis-pasted No-PO text) | AMBIGUOUS / UNANSWERED (mis-paste) | SF-TECH-08 (+ all SF-TECH-*) | Answer is the **wrong (No-PO) text pasted by mistake** — does not address tech-story Story 17 vs S15-R2. Our cases already assume Story 17 (live build confirmed the gate-modal). Keep as-is; re-ask for explicit confirmation. |
| 10 | "Behavior defined (S15-R4): Close = closes modal only, no discard, stays; Cancel = closes modal + returns to previous screen; others keep labels." | CONFIRMED — expected already correct (enrich + un-block) | SF-UX-04 | SF-UX-04 expected already matches. Enrich wording with button styling (Close = prominent/red; Cancel = text link far left) + "no discard." **Un-blocks SF-UX-04** (was pending design). |
| 11 | "Spec contradicts itself … Recommend (b) top/leads … I will do changes on the spec" | SPEC CHANGE → update expected | SF-RCV-05, SF-RCV-07 | Vendor-missing group **LEADS (top)**. Rewrite SF-RCV-05 (currently "bottom") → TOP, and update its title ("at the bottom" → "at the top/leading"). SF-RCV-07 already says "leads (top)" → **confirmed, no change.** |

---

## Proposed EXPECTED changes (concrete, ready for confirmation)

### Q1 → SF-REV-15 (group-C) — SPEC CHANGE
Current expected:
> 1. A brand-new org shows the Require Review setting in its default state, and existing orgs keep their current completion behavior (the setting is backfilled so their behavior does not change).

**Proposed new expected:**
> 1. The Require Review Before Completion setting defaults to ON for every org — both brand-new and existing orgs default to review-required (no cohort split, no OFF backfill).
> 2. With the default in effect, completing a work order routes into the review flow.

### Q1 → SF-SET-14 (group-A) — SPEC CHANGE (add default)
Current expected:
> 1. The 'Require Review Before Completion' toggle is present on the page (not prototype-only).
> 2. With it On, completing a work order routes into the review flow (Story 16).
> 3. The completion CTA relabels to 'Complete & Send to Review'.

**Proposed:** add
> 4. The toggle defaults to ON for the org.

### Q2 → SF-COMP-07 (group-A) & SF-QB-01 (group-C) — SPEC CHANGE (partly ambiguous — HOLD)
The "skip path bypasses inventory" premise is moot now the No-PO path is removed
(Q5: POs always created). But whether in-stock parts decrement + write Part
History on completion is **not explicitly confirmed by Milos**.
**Proposed action:** do NOT rewrite yet; re-ask Milos "on a normal completion, do
in-stock inventory parts decrement on-hand qty and write Part History?" If yes,
reframe both cases to the normal lifecycle (drop "skip path"). Interim proposed
expected if confirmed yes:
> 1. On completion, in-stock inventory parts decrement on-hand quantity by the used amount.
> 2. A Part History entry is written for the movement.

### Q3 → SF-SET-08 (group-A) — CONFIRMED (drop hedge) + file live-default BUG
Current expected already correct (Auto-approve OFF / Create POs ON / Vendor
Invoice REQUIRED). **Proposed:** remove the "EXPECTED PER SPEC" prefix (now
confirmed authoritative). Separately: **file a bug** — live first-use defaults
show Auto-approve ON / Vendor Invoice Optional, contrary to the confirmed spec
default.

### Q5 → SF-SET-03 (group-A) — SPEC CHANGE (rewrite)
Current expected:
> 1. EXPECTED PER SPEC (currently NOT met): a 'Create purchase orders' toggle exists, default On, with helper text.
> 2. With Create POs Off, the Vendor Invoice sub-setting is hidden …
> 3. With Create POs On, the Vendor Invoice sub-setting appears …

**Proposed new expected:**
> 1. There is no 'Create Purchase Orders' toggle — POs are always created (the OFF option was descoped).
> 2. The Vendor Invoice (Optional/Required) sub-setting is always present (no toggle hides it).

(Title should also change: drop "when off, hides the Vendor Invoice sub-setting".)

### Q5 → SF-COMP-06 (group-A) & SF-QB-02 (group-C) — SPEC CHANGE (RETIRE)
The Create-POs-OFF completion scenario no longer exists. **Proposed:** retire both
cases (mark N/A / remove from the suite) — POs are always created.

### Q6 → SF-SET-13 (group-A) — SPEC CHANGE (soften)
Current expected:
> 1. EXPECTED (typical UX): with no changes, Save Settings is disabled.
> 2. After a change, Save Settings becomes enabled.

**Proposed new expected:**
> 1. Saving persists the settings changes.
> 2. Dirty-state gating (disabling Save until a change is made) is NOT required in v1 — Save being always enabled is acceptable (low-priority polish, not a blocker).

### Q7 → SF-REV-10 (group-C) — SPEC CHANGE (note descoped — CONFIRM wording)
Current expected:
> 1. EXPECTED PER SPEC: an optional review note field (input_review_note) is present.
> 2. A note can be entered and saved with the sign-off.

**Proposed new expected:**
> 1. The Mark Reviewed dialog shows only the current fields (VIN); there is no optional review-note field (the note field is descoped / not in the build).

(Flag: Milos typed "(b) Bug" but his explanation describes a descope — confirm
before applying.)

### Q10 → SF-UX-04 (group-C) — CONFIRMED (enrich + un-block)
Current expected:
> 1. Clicking Close closes the modal only, keeps any entered changes, and stays on the work order.
> 2. Cancel closes the modal and returns to the previous screen.

**Proposed enriched expected:**
> 1. Close (prominent/red button) closes the confirmation modal only, discards nothing, and stays on the work order.
> 2. Cancel (text link, far left) closes the modal and returns to the previous screen.
> 3. Other consumers of the shared confirmation dialog keep their existing action labels.

Case can move from "pending design" to testable.

### Q11 → SF-RCV-05 (group-B) — SPEC CHANGE (bottom → top)
Current expected:
> 3. Vendor-missing parts sit in their own group at the bottom.

**Proposed new expected #3:**
> 3. Vendor-missing parts sit in their own group that LEADS (appears at the top), because they need action (assign a vendor) before receiving.

(Title also references "at the bottom" → change to "at the top / leading".)

### Q11 → SF-RCV-07 (group-B) — CONFIRMED, no change
Current expected #2 ("The vendor-missing group leads (appears first)") is correct.

---

## Findings that become CONFIRMED BUGS (for the ticket list)

1. **Wrong first-use defaults (from Q3).** Live org shows Auto-approve ON /
   Vendor Invoice Optional, but confirmed spec default = Auto-approve OFF / Vendor
   Invoice REQUIRED. Dev to fix defaults. (SF-SET-08 expected stays.)
2. **Require Review default (from Q1) — verify then possibly bug.** Confirmed
   default = ON for all orgs. If the live default is not ON, that's a bug (needs
   live verification on sv7301).

## Findings DOWNGRADED / RESOLVED (no longer bugs)

- **BUG-1** (no Create-POs toggle) → **intended descope** (Q5). Not a bug.
- **BUG-2** (Save always enabled) → **intended / nice-to-have, non-blocker** (Q6).
- **BUG-3** (missing review note) → **intended descope** (Q7, pending wording
  confirm — he typed "bug" but described a descope).

## Still OPEN / UNANSWERED (need a follow-up to Milos)

- **Q2 inventory-decrement invariant** — No-PO path confirmed removed, but whether
  in-stock parts decrement + write Part History on a normal completion is not
  explicitly answered. (SF-COMP-07, SF-QB-01 on HOLD.)
- **Q8 distinct Reviewed state** — "not sure what this means?" Not answered.
  Re-explain. (SF-REV-08, SF-REV-11; BUG-4 unresolved.)
- **Q9 tech story Story 17 vs S15-R2** — answer was the wrong (No-PO) text pasted
  by mistake. Re-ask. (SF-TECH-08 + all SF-TECH-*; cases already assume Story 17.)

## NOT covered by this sheet (remain parked — Milos did not address)

These were parked pending a ruling but are **not among the 11 sheet questions**, so
Milos's answers do NOT resolve them:

- **BUG-9** — vendorless / no-PN part add requires a Category (spec S5-R1 says only
  description + qty + sell). Cases SF-VPART-01, SF-VPART-02. Still needs a ruling.
- **BUG-10** — no distinct "Resolve Cores" wizard step (resolution is line-level).
  Cases SF-CORE-*. Still needs a ruling.
- **SF-PERM-06 / BUG-6 / BUG-7** — backend enforces the Simple-Flow atoms
  (SV-8183) vs FE-only enforcement / SV-7864 atom-collapse. The BE-vs-FE
  enforcement contradiction is unresolved (SV-8183 questions were intentionally
  excluded from this sheet). Needs a dev/PO ruling.
</content>
