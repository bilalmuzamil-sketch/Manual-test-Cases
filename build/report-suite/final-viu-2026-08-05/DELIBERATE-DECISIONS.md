# Report Suite — DELIBERATE DECISIONS / ANTICIPATED-CHALLENGE REGISTER (Standing Rule 46)

Every deliberate non-action, every case following one source over another, every accepted imperfection —
written down **before** anyone asks. Six fields per entry. **Read the RISK column honestly: HIGH does not
mean we are wrong, it means if this is raised publicly we have a concession to make, not just an
explanation.**

---

### 1 · The Location cases were put on HOLD rather than aligned to the build we can see

- **Decision (plain):** thirteen cases about the Location column, plus two more, now state each report's own
  written rule and say the product owner has been asked one outstanding question — instead of describing
  what the build does.
- **One-sentence answer:** *The six reports' descriptions disagree with each other about this column, and
  one of them disagrees with itself, so we have written down what each description actually says and asked
  Chris which is right — we have not let the build decide it for us.*
- **Evidence:** PV v5 S3-R10 "is not user-toggleable" · TU v5 S10-R4 "never listed in the column selector" ·
  WIP v6 S4-R3 "not offered in the column selector" · IV v3 S7-R6 "not one of the columns offered" ·
  SBR v15 S20-R1 (a closed list of seven metric columns) — **versus** SBC v14 S4-R12 "can be toggled on or
  off from the column selector".
- **Affected cases:** C30352, C38914, C30401, C30437, C38915, C30467, C30511, C38916, C30551, C30554,
  C30588, C38917, C38913, C30156, C38912 (`https://shopview.testrail.io/index.php?/cases/view/<id>`).
- **Who closes it:** **Chris Ward** — Q1 and Q2 of `../rulings-2026-08-05/FOLLOW-UP-QUESTIONS-ROUND-2-2026-08-05.md`.
- **RISK: HIGH.** Fifteen cases are unrunnable-for-verdict until he answers, and **the concession is ours**:
  a previous pass of ours wrote the ambiguous reading into them as a requirement, and one of those edits
  overwrote a line that was correct.

### 2 · C30265 was NOT changed, although the brief asked for it

- **Decision:** SBR-COL-01 was left exactly as it is.
- **One-sentence answer:** *It already matches the Sales By Representative description; changing it to match
  Sales By Customer would have copied one report's rules onto another.*
- **Evidence:** SBR v15 S21-R7 + S20-R1 + S20-R3, quoted side by side with the case text in
  `../expected-behaviour-audit-2026-08-05.md` §6.
- **Affected case:** SBR-COL-01 = [C30265](https://shopview.testrail.io/index.php?/cases/view/30265).
- **Who closes it:** the QA lead, if he disagrees with the reasoning.
- **RISK: LOW** — declining an instruction needs to be visible, which is why it is entry 2 and not a footnote.

### 3 · The missing-logo state was deliberately not seeded

- **Decision:** the organisation logo was not removed, so the no-logo fallback was not observed.
- **One-sentence answer:** *Two other testers are working in the same organisation right now, so removing
  its logo would have changed what they see; and Chris has since written the logo rule down, so the test no
  longer needs the build to decide it.*
- **Evidence:** organisation `d55bc308-e61a-438d-b5f1-c7a73c89d49f` is shared with the live Filters and
  Schedule work · SBC **v14 S15-R17** "the bundled ShopView logo **only when an uploaded logo is set but
  fails to load**; no logo when none is uploaded" · S15-R18.
- **Affected cases:** C43553, C30168, C30281, C30379, C30439.
- **Who closes it:** a live check in a window when no other worker is on this organisation.
- **RISK: MEDIUM.** It was an explicit ask and it is not done. The mitigation is real (the requirement is now
  written down, and the embedded-logo half **was** verified live) but a verdict is still missing.

### 4 · The build clause in all 473 provenance lines was NOT re-stamped

- **Decision:** every case still reads "as per the build tested on 8/4/2026 (build v3.4.1-3d03023)".
- **One-sentence answer:** *We only re-date a case when we have actually re-run it, and we did not re-run all
  473 today.*
- **Evidence:** Rule 12; the live build this pass is `v3.5-16cf83f`, two versions on from the one named.
- **Affected cases:** all 473.
- **Who closes it:** the next full live pass.
- **RISK: MEDIUM.** Every case names a build that no longer exists. **A stale date is honest; a false fresh
  date would not be** — but it does mean no case's verdict is confirmed against today's build.

### 5 · Two new differences were reported rather than ticketed

- **Decision:** no ticket was filed for the date-range values, nor for the Inventory Value page controls.
- **One-sentence answer:** *One is only visible by calling the system directly and the rule it breaks is six
  hours old; the other rests on an earlier tester's note that we have not repeated ourselves.*
- **Evidence:** `API-ASK.md` ASK 1 · `FINDINGS.md` §6.
- **Who closes it:** the QA lead (a yes/no on ASK 1) and one live screen check.
- **RISK: LOW** — both are written up in full; only the filing is withheld.

### 6 · The audit's Class C was reached by elimination, not by 440 cold reads

- **Decision:** 440 cases are classed legitimate because they fell out of two exhaustive pattern sweeps and a
  provenance audit — **not** because each was individually read against its requirement.
- **One-sentence answer:** *We searched every one of the 473 for the tell-tale wording and checked every
  provenance line, and we read in full only the ones that came up — we are not claiming to have re-read all
  473 line by line today.*
- **Evidence:** `../expected-behaviour-audit-2026-08-05.md` §9.
- **Who closes it:** a full cold read, which is a pass of its own.
- **RISK: MEDIUM.** A build-derived expectation written in wording none of the 42 patterns covers would have
  been missed. **Saying so is the point of this entry.**

### 7 · Run 359 was not synced, although 9 cases are missing from it

- **Decision:** no run write of any kind.
- **One-sentence answer:** *Nine of our cases are not in the test run, but the run belongs to other testers
  and we were told not to touch it.*
- **Evidence:** run 359 holds 469 tests; the 9 absent are the 5 foreign cases C38919–C38923 and our 4 new
  ones **C43550, C43551, C43552, C43553**. `include_all` is `false`, so the run will never pick them up on
  its own (Rule 34).
- **Who closes it:** the QA lead authorising a union-only `update_run`.
- **RISK: MEDIUM.** Until it is synced, those four cases **cannot be executed by Nebojsa or Viktoria** and
  will read as absent coverage — the exact false-gap that cost a review cycle on Filters.

### 8 · Nothing was deleted

- **Decision:** 0 deletions. See `DELETIONS.md`.
- **One-sentence answer:** *We found cases whose expectations had been weakened, not cases that should not
  exist — those get repaired, not deleted.*
- **Evidence:** `DELETIONS.md`; one candidate (C43552) held on Q7.
- **Who closes it:** Chris Ward's answer to Q7.
- **RISK: LOW.**
