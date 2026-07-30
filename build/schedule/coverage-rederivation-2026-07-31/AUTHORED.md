# Phase 5 — what was authored to close the gaps (Schedule, 2026-07-31)

**3 gap statements closed with 1 NEW case + 1 EXTENSION.** Nothing else was authored.

| Gap | Statement | Closure | Kind |
|---|---|---|---|
| G1 | R-4.3-05 §4.3 "There is no technician cap and no **swap flow**." | **SCH-DND-07** (C29961) extended — +2 steps, +2 expected | EXTENSION |
| G2 | R-14.1-04 §14.1 view-only role list | **SCH-PERM-13** (new, no C-ID yet) | NEW |
| G3 | R-14.1-08 §14.1 edit role list | **SCH-PERM-13** — same case | NEW |

**Local tally: 165 ACTIVE** (was 164) — 192 authored − 27 Retired. All `VIU-Pending`
(no QA environment exists, OQ-3 — Rule 12: design/spec-pinned is never "verified").

---

## Why 1 + 1 and not 3 (the split, justified — Rule 28, no padding)

* **G2 + G3 are one observable behaviour** — "does each default role start at the Schedule
  level the spec names?" — so they get **one** case with one expected list, not one case per
  role list. Authoring two would have produced a near-duplicate pair (the exact slop pattern
  the Ruthless Usefulness Audit hunts).
* **G1 was extended, not authored.** SCH-DND-07 already covers roster sync from a drag; the
  missing half ("a *second* technician is *added*, not swapped in") is the same observation
  continued with two more steps. A separate "no swap flow" case would have re-run SCH-DND-07's
  entire setup to add one assertion.
* **9 role names, 1 case.** The View list (5 roles) and the Edit list (4 roles) are checked in
  the same pass on the same screen; splitting per role would have produced 9 cases asserting
  one rule — the "permission cases reducing to one gate" slop pattern.

---

## The new case — SCH-PERM-13

* **Title (76 chars):** "Default roles start at the Schedule level the spec names (view-only vs edit)"
* **Area / TestRail section:** Permissions · **Priority:** High · **Type:** Functional
* **refs (Rule 20, comma-free, 141 chars):**
  `SV-8685 [epic - cross-cutting - no single-story owner] (§14.1 default role tiers - view-only role list + edit role list; spec v23 2026-07-30)`
  The **epic** key is used — and said so explicitly — because §14 permissions have **no owning
  story** among SV-8686..SV-8700 (identical to SCH-PERM-01..07 and SCH-PERM-09, established
  2026-07-27).
* **Not an API case** — UI/admin-screen only, so it stays in **Permissions**, not "API — Schedule" (Rule 4).

**Expected (the assertions):**
1. Technician, Parts Manager, Parts Tech, Office and Time Clock each have Schedule View ON and
   Schedule Edit + Delete OFF.
2. Service Manager, Senior Service Advisor, Service Advisor and Foreman each have Schedule Edit
   ON (so also View).
3. A user from group 1 gets the read-only schedule — nothing draggable, no shift creatable.
4. A user from group 2 can drag a work order on and create a shift.

**Scope limits written into the case's NOTES on purpose (honesty, not hedging):**
* The spec says "roles **like**", so roles it does not name (Admin, Sales Representative) are
  **not asserted** — the tester records what they show and raises a question.
* The spec never says which roles get **Schedule: Delete**, so **nothing is asserted** about
  Delete for the edit roles (Rule 15 — spec silent, say so, never pick a side).
* Permissions are configurable per shop, so the case checks role **defaults after "Reset To
  Template"** (Standing Rule 26) and restores every role afterwards.
* **VIU-confirm live:** the exact roles-screen path and the exact on-screen wording of the three
  Schedule permission toggles and the reset control. No prototype string is quoted as a build
  label (today's contradiction X7 lesson) and no label was invented (Rule 9).

---

## The extension — SCH-DND-07 (C29961)

Added **steps 3–4**:
```
3. Drag the SAME line onto a different technician's cell and create a second shift.
4. Look at that line's technician roster again.
```
Added **expected 4–5**:
```
4. Dragging the same line onto a second technician adds that technician to the line's roster
   as well - the technician who was already there stays on it.
5. Nothing asks you to swap or replace the technician who was already there, and no limit is
   reached on how many technicians a line can have.
```
`refs` refined to name the clause (comma-free):
`SV-8688 (§1.2 Goals - roster sync · §4.3 roster add + no swap flow · §7; spec v23 2026-07-30)`

Title unchanged ("Scheduling a technician onto a line adds them to its labor roster") — it
already describes the extended behaviour, and leaving it alone keeps the TestRail write to the
fields that actually changed.

---

## NOT authored — and why (each with its reason)

| Item | Reason it was NOT authored |
|---|---|
| **R-12-03 §12** shop closures "block the spread step" | **Spec self-contradiction (X1 / Branko NQ-1).** §4.5 (Confluence v22) says closures are NOT skipped in V1; §12 is untouched v18-era residue. Per instruction, **no case asserts either side**; the existing SCH-EDGE-05 follows the newer §4.5 text (Rule 32 latest-wins) and §12 is flagged to Branko. |
| **R-4.9-06 §4.9** modal shows "labor/total figures" | **Reversed by a PO ruling** (Branko 2026-07-22 Q3) + design §4c + tech-plan D6/NFR-002 "no pricing". SCH-MODAL-04 + SCH-API-03 assert no money fields. Rule 33 — the ruling stands; the spec sentence is the stale artefact. Flagged for upstream tidy. |
| **R-14.1-03 / R-14.1-07 §14.1** "right-click context menu" | **Reversed by a PO ruling** — Branko 2026-07-31 "there is no right click, only left click"; §4.10/§7 were rewritten in v22. Cases already follow left-click. Flagged for upstream tidy. |
| **Week Export / printable week** | **PO-descoped** — Branko 2026-07-31: "Not in V1, not even in future considerations". SCH-EXP-01 already retired + deleted. |
| **Modal "Reassign" button** | **PO-descoped** — Branko "B - No button"; v23 deleted the clause. SCH-MODAL-08 asserts its absence. |
| **§15 Future considerations (6)** | Out of V1 by definition — PTO, auto-scheduling, recurring events, skill matching, spread-around-bookings, long-job cap. |
| **§13 Success metrics (4)** | Post-launch fleet analytics, not manually testable. |
| **§1/§1.1/§1.2 goals + §2 personas (11)** | Statements of intent; the mechanisms they name are covered. (The one testable goal — roster sync, R-1.2-04 — is covered by SCH-DND-07.) |
| **§8.1/§8.2 data-model internals (7)** | Field names and internal ids; observable aspects covered by named cases (per item in Appendix A). |
| **Own-data WRITE scoping** (NQ-5) | §14 is **silent**; re-routed to engineering. Nothing may be asserted until answered (Rule 15). SCH-PERM-09 covers only the read side. |
| **Spec-silent S1–S6** (events → OT tag, department-wide events, all-day capacity, Events toggle vs capacity, tech-edits-others, double-booking severity) | Spec silent → they stay **questions**, not cases. |
