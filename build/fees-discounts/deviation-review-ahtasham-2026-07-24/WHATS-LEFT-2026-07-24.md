# Fees & Discounts — Ahtasham deviation-review reconciliation + WHAT'S LEFT (2026-07-24)

Read-only analysis. NO case JSON / deliverable / TestRail edits made. The user decides the sync.

TestRail case links: https://shopview.testrail.io/index.php?/cases/view/<id>

---

## 1. What Ahtasham did (plain)
- He reviewed **11 cases** that were flagged blocked/deviation, live on staging.
- His decision: **7 pass as written** (just flip the run status to READY, no case change) and **4 need a wording update** (which he says he made in TestRail).
- **He created 0 bug tickets.** His conclusion: **no bug is needed** for any of them. The two calc "bugs" (FDBUG-2 twins) were already fixed by dev under SV-8421.

### His 11 cases map EXACTLY to our current state
His 11 = **our 10 current Deviations + our 1 Pending (FD-PART-005)**. He did NOT touch FD-WO-013 (C28436) or FD-PERM-002 (C28586) — those are the 2 we already flipped to PASS on 2026-07-24 (Rule 24). **So his review is up-to-date: it matches the current 10-deviation state, it does NOT predate our flip.** No conflict.

| C-id | Internal | Our current status | His verdict |
|------|----------|--------------------|-------------|
| 28450 | FD-PART-005 | VIU-Pending | PASS (flip to READY) |
| 28456 | FD-INLINE-003 | VIU-Deviation | PASS |
| 28460 | FD-STATS-002 | VIU-Deviation | UPDATE (edited TestRail) |
| 28462 | FD-STATS-004 | VIU-Deviation | PASS |
| 28489 | FD-CUST-005 | VIU-Deviation | UPDATE (edited TestRail) |
| 28490 | FD-CUST-006 | VIU-Deviation | PASS |
| 28511 | FD-TMPL-010 | VIU-Deviation | PASS |
| 28526 | FD-PROC-008 | VIU-Deviation | UPDATE (edited TestRail) |
| 28527 | FD-PROC-009 | VIU-Deviation | PASS (SV-8421 fixed) |
| 28580 | FD-CALC-013 | VIU-Deviation | PASS (SV-8421 fixed) |
| 30618 | FD-WO-017 | VIU-Deviation | UPDATE (claims edited — see below) |

---

## 2. His 4 TestRail edits vs our local (see his-4-updates.md for full detail)
- **C28460 / FD-STATS-002** — edit LANDED (2026-07-24). **Local out of sync → needs local update.**
- **C28489 / FD-CUST-005** — edit LANDED (2026-07-24). **Local out of sync → needs local update.**
- **C28526 / FD-PROC-008** — edit LANDED (2026-07-24). **Local out of sync → needs local update.**
- **C30618 / FD-WO-017** — **edit did NOT land.** TestRail still says LEFT (updated 2026-07-23, before his review). Our local also says LEFT → local matches TestRail, but neither matches his stated "match-to-build = RIGHT" verdict. **A real TestRail write (LEFT→RIGHT) is still outstanding here.**

---

## 3. Do his verdicts resolve all 10 of our Deviations?
**Yes — all 10 resolve to "no bug".**
- 6 deviations he says PASS-as-written (stale notes / accepted-by-team) → should flip to Verified, no wording change:
  FD-INLINE-003 (C28456), FD-STATS-004 (C28462), FD-CUST-006 (C28490), FD-TMPL-010 (C28511), FD-PROC-009 (C28527), FD-CALC-013 (C28580).
- 4 deviations he reworded to match build → then Verified:
  FD-STATS-002 (C28460), FD-CUST-005 (C28489), FD-PROC-008 (C28526), FD-WO-017 (C30618).
- Plus FD-PART-005 (C28450, our Pending) → PASS/Verified (was env-blocked only).

**None left open as a bug.** His "no bug needed" covers ALL 10 deviations.

### Cross-check against the user's rule (a deviation stays a bug only if a ticket says it's a bug; otherwise match-to-build)
- **Zero** of the 10 deviations need to remain a bug.
  - The 2 that WERE bug-linked (FDBUG-2 twins: FD-PROC-009 C28527, FD-CALC-013 C28580) → their ticket **SV-8421 is Done/fixed** → now PASS.
  - FD-WO-017 (C30618) was tied to the SV-8479 re-open, but the **PO accepted the right-side placement in SV-8479 (Done)** → so it is match-to-build, not a bug.
  - The other 7 were stale notes / accepted-by-team / env-blocked → match-to-build or pass as written.
- So per the rule, **all 10 should be matched-to-build / verified, none kept as a bug.**

---

## 4. WHAT'S LEFT (plain checklist — nothing done yet, user decides)

### A. Local-sync updates to match his 3 LANDED TestRail edits (local-only, NO TestRail write)
Update our case JSON title/expected/notes to match what TestRail now says, and flip status Deviation → Verified:
1. **FD-STATS-002 (C28460)** — new title "…lists each fee/discount as its own row with name, percent and amount"; drop the clickable-target-link expectation; drop the zero-value line.
2. **FD-CUST-005 (C28489)** — Expected #1: single-select → **multi-select** (per S9-R20); update the stale "PO Q6=A single-select accepted" note.
3. **FD-PROC-008 (C28526)** — Expected #1: "Edit and Remove (Edit does nothing)" → **"Remove only, no Edit"**.
Then regenerate deliverables (Blockers Tracker + import) over these.

### B. One deviation still needs a real decision + a TestRail write (his edit is missing)
4. **FD-WO-017 (C30618)** — his LEFT→RIGHT edit is NOT in TestRail (still LEFT). Decide whether to apply the match-to-build rewrite (LEFT→RIGHT, per SV-8479 PO acceptance = Done) to **BOTH TestRail (a write — needs authorization) AND our local**, then flip to Verified. This is the only item requiring a TestRail write.

### C. The 6 pass-as-written deviations — flip local status only (no wording change)
5. Flip local viu_status Deviation → Verified for: **FD-INLINE-003 (C28456), FD-STATS-004 (C28462), FD-CUST-006 (C28490), FD-TMPL-010 (C28511), FD-PROC-009 (C28527), FD-CALC-013 (C28580)**. (For the 2 calc twins, add the SV-8421-fixed note.)

### D. Our 1 Pending
6. **FD-PART-005 (C28450)** — Ahtasham says PASS (fee stays attached through requested→received; was env-blocked only). Our local is still VIU-Pending because we could not drive the requested→received transition ourselves (line-create 500 in earlier passes). **Decision:** accept his QA sign-off, OR do our own LIVE re-VIU with evidence before flipping (per Standing Rules 12/22 — "verified = observed by us"). Recommend a quick live re-check on staging, then flip to Verified.

### E. Tally impact (if his review is accepted in full)
- Deviations 10 → **0**; Pending 1 → **0**; Verified 167 → **178**.
- New tally would be **178 Verified / 0 Deviation / 21 Blocked / 0 Pending = 199 active** (unchanged total).
- (Analysis only — do NOT change the tally until the user approves the sync above.)

### F. His open follow-ups WE have NOT done (new spot-check tasks)
7. **SV-8421 downstream floor/credit spot-check** — corrected (smaller) Processing Fee gives less padding vs the $0 subtotal floor on heavy-discount WOs. Spot-check cases **28582 / 28584 / 28555–28558**.
8. **SV-8421 QA note** — a taxable whole-WO discount and a non-taxable whole-WO fee should also leave the Processing Fee base unchanged. Spot-check live.

### G. Note on Standing Rules
- Per Rules 12/13/22, a status flip to Verified should be backed by our own live observation with evidence. Ahtasham observed these live; if the user wants our own confirmation, a short live pass on staging would cover FD-STATS-002/CUST-005/PROC-008/WO-017/PART-005 before flipping. Otherwise we adopt his QA sign-off as the source.
- TestRail is read-only in this task; the only outstanding TestRail write identified is FD-WO-017 (item B), which needs explicit authorization.
