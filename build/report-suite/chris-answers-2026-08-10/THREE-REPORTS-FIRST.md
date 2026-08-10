# The three handed-off reports first — Work In Progress · Technician Utilization · Sales By Customer

**The QA lead's scope change, verbatim:** *"Until today, for Reports, the Development team has handed
off only three below mentioned reports. Work In Progress / Technician Utilization / Sales by Customer.
So we have to make sure that the test cases for them are 100% authentic and VIU'd."*

Everything on this page is **read-only measurement**. No case was written.

---

## 1 · What Chris's answers actually change for these three

**Only two of his six answers touch a handed-off report at all.**

| His answer | Handed-off cases affected | What it does |
|---|---|---|
| Tab 1 item 1 — Location column = **A** (access gate, on by default, user-toggleable) | **C30467, C43551** (Work In Progress) · **C38912** (Sales By Customer) | Removes the blocking question from all three |
| Tab 2 item 2 — invoice link = **A** (no link, plain text) | **C30100, C43558** (Sales By Customer) | Settles C30100's question but **voids its premise**; C43558 stays held on a second blocker |

**Not one Technician Utilization case is affected by any answer he gave.** Its six held cases are all
environment or sign-in blockers, none of which is a product question.

**The other four answers land entirely on Sales By Representative**, which has **not** been handed off —
recorded fully in `ANSWERS-INGESTED.md`, follow-through marked **lower priority**.

### The three that need more than an unhold

| Case | C-id | Link | Why an unhold alone is wrong |
|---|---|---|---|
| SBC-LOC-04 | C38912 | https://shopview.testrail.io/index.php?/cases/view/38912 | Title and first expected line assert *"shows only with more than one location **in scope**"* — the **scope** model his answer overturns. Needs rewriting to the access model. |
| WIP-COL-02 | C30467 | https://shopview.testrail.io/index.php?/cases/view/30467 | Lists Location among the columns *"available in the column-selection control"*, i.e. **off by default**. Under his answer it is **on by default** for a multi-location-access user. |
| SBC-PERM-04 | C30100 | https://shopview.testrail.io/index.php?/cases/view/30100 | Titled *"Opening an invoice you lack permission for shows access-denied"*. Under answer **A** that user gets **no link**, so the journey the case tests should not exist. Needs re-deriving against S9-R1a. |

---

## 2 · Readiness — the three handed-off reports only

Counted live from TestRail on **2026-08-10**, read-only, no sampling — every case under the three report
sections was read and its marker parsed from the end of its Expected Results.

| Report | Our cases | `AUTOMATION: READY` | `READY - EXPECT FAIL` | `AUTOMATION: HOLD` | Carries a marker |
|---|---:|---:|---:|---:|---:|
| Sales By Customer | **87** | 61 | 16 | 10 | 87 / 87 |
| Technician Utilization | **60** | 35 | 19 | 6 | 60 / 60 |
| Work In Progress | **78** | 54 | 17 | 7 | 78 / 78 |
| **TOTAL** | **225** | **150** | **52** | **23** | **225 / 225** |

**Every row sums to its case count, and the three totals sum to 225.** Every one of the 225 carries
**exactly one** machine-findable marker; **none is missing one**.

*(Whole-suite context: 476 of ours live under group 4281, plus 9 of Vladimir Tomovic's — up from 5 on
6 August. His are excluded from every figure here and were not touched, per Rule 38.)*

### ⚠️ Read the marker columns correctly — they are not verification

**`AUTOMATION: READY` asserts that a case CAN BE AUTOMATED. It does not assert that the case currently
passes, and it does not mean the case has been verified against the running build** (Rule 60). Adding
150 + 52 = **202 "ready to hand to the automation engineer"** for these three reports is a statement
about automatability, **not** about authenticity or verification.

**The verification position is materially worse, and it has not moved today.** Our own
`READINESS-2026-08-06.md` records the honest split, and I did not refresh it because that needs a live
sign-in this pass deliberately did not use:

| Report | Cases | Checked on `v3.5-7168d14` | on `v3.5-16cf83f` (5 Aug) | on `v3.4.1-3d03023` (4 Aug) | Never checked |
|---|---:|---:|---:|---:|---:|
| Sales By Customer | 87 | 45 | 29 | 11 | **2** |
| Technician Utilization | 60 | 0 | **60** | 0 | 0 |
| Work In Progress | 78 | 24 | 12 | 41 | **1** |

**Every Technician Utilization verdict is from the 5 August build and is several deploys old.**
`READINESS-2026-08-06.md` also states plainly: **0 of 476 cases have been checked against
`v3.5-f77875c`**, the build that was running on 6 August — and the branch has very likely moved again
since. **This pass did not open the application, so that figure stands unchanged and unimproved.**

### What moved since 6 August, and it was not us

Comparing today's live marker census with the table in `READINESS-2026-08-06.md`:

| Report | 6 Aug (READY / EXPECT-FAIL / HOLD) | 10 Aug | Change |
|---|---|---|---|
| Sales By Customer | 63 / 14 / 10 | **61 / 16 / 10** | 2 moved to EXPECT-FAIL |
| Technician Utilization | 35 / 19 / 6 | **35 / 19 / 6** | unchanged |
| Work In Progress | 60 / 13 / 5 | **54 / 17 / 7** | 6 to EXPECT-FAIL, 2 to HOLD |
| *(all six reports)* | 343 / 92 / 41 | **330 / 103 / 43** | ready-to-automate 435 → **433** |

**Thirteen cases have gained expect-fail markers and two have gone on hold since 6 August.** This pass
wrote nothing, so that is another worker's authorised work. It is recorded here only so the numbers
reconcile and nobody reads the change as drift.

---

## 3 · The 23 held cases — exactly what stands between these three and "100% authentic"

Grouped by what is actually blocking them, with the hold reason quoted from each case.

### (a) Released by Chris's answers today — 4 cases

**C30467, C43551** (Work In Progress) · **C38912, C30100** (Sales By Customer).
Three need a rewrite rather than a plain unhold (§1). Staged in `PROPOSED-CHANGES.md`.

### (b) Blocked on a SECOND SIGN-IN — 3 cases · **this is the single biggest lever**

| Case | C-id | Hold reason, quoted |
|---|---|---|
| TU | C30398 | *"needs a second sign-in as a user without reports access, and there is one shared sign-in on this environment"* |
| TU | C30446 | *"needs a second sign-in as a user who can reach only one location…"* |
| SBC | C43558 | *"…and it needs a second sign-in that cannot open work orders or part sales"* |

**C43558's product half is now answered; only the sign-in remains.** This blocker has been outstanding
since **2026-08-05 through four sessions**, and `READINESS-2026-08-06.md` records that it also gates the
observation of a further **20** cases that depend on a restricted user. **One extra non-administrator
login clears more held work than anything else on this list.**

### (c) Test data that does not exist in this organisation — 10 cases

| Case | C-id | What is missing |
|---|---|---|
| SBC | C30131 | no service invoice without a vehicle |
| SBC | C30132 | no reversed or voided invoice inside the date range |
| SBC | C30137 | no customer with two assets producing the same label |
| SBC | C43553 | the organisation's logo loads correctly, so the "set but fails to load" fallback cannot be produced |
| SBC | C30104 | the calendar cannot be driven past the 366-day span from this harness |
| TU | C30407 / C30408 / C30413 | every location has a default labor rate, so the em-dash and part-valued states cannot occur |
| TU | C30431 | needs a technician clocked in at that moment; none is |
| WIP | C38918 | no tab comes near the 10,000-row export cap |

**Under Standing Rule 14 several of these are normally seedable and should not stay held** — a location
with no default labor rate (C30407/08/13), a clocked-in technician (C30431), an org logo swap (C43553).
**They are held today only because there is no working sign-in**, not because the data is impossible.
**Once a session exists, most of this group should fall.**

### (d) Genuinely awkward — 2 cases

| Case | C-id | Reason |
|---|---|---|
| SBC | C30141 | *"deleting a real invoice while the report is open is not something to do on a shared environment"* |
| SBC | C30184 | *"a failing data fetch cannot be forced from the application"* |

### (e) Backend-only, nothing in the product reads it back — 4 cases

**C30528, C30530, C30531, C30533** (Work In Progress, Story 11 nightly snapshot), all reading:
*"the nightly capture is written by a background process and nothing in the product reads it back in
this version."*

**This is correct by design.** WIP v10 S11-R7 says so: *"No screen in this version reads the snapshot;
there is no Trend tab."* **These four can never be verified through the interface**, and checking them
would mean reading the database or an endpoint directly — which under Rule 51 is an API matter needing
the QA lead's explicit permission, and it is **not** requested here.

---

## 4 · So what actually stands between these three reports and 100% authentic?

**In order of how much they unlock:**

1. **A working QA-branch sign-in.** Nothing has been observed on the current build. Until a session
   exists, **no verdict on any of the 225 can be refreshed**, and roughly **10 of the 23 holds cannot
   even be attempted**. This is the whole game.
2. **A second, non-administrator sign-in.** Clears 3 held cases outright and unblocks the observation of
   about 20 more. Outstanding since 5 August.
3. **The QA lead's go-ahead on the staged changes** in `PROPOSED-CHANGES.md` — 4 cases come off hold, 3
   of which need their wording corrected first.
4. **A spec-delta pass over the three new versions** — Sales By Customer **v16**, Technician Utilization
   **v7**, Work In Progress **v10**. Our baselines are all one version behind. Under Rule 43 each changed
   requirement needs its own coverage-verdict row. **This pass did not do that** — it is an answer
   ingest, and saying otherwise would be a false claim of completeness.
5. **Chris's two spec tidy-ups** — the dead S9-N2 access-denied path in Sales By Customer, and (for the
   other three reports) the residual Location wording.
6. **The branch declared final, or told plainly that it never will be.** Under Rule 60 that changes what
   we monitor rather than what we assert, but every verdict on all 225 stays **PROVISIONAL** until then,
   and the Rule-49 re-check queues stay open.

**The honest one-line answer: these three reports are 202-of-225 ready to AUTOMATE, and nowhere near
100% VERIFIED — because not one of the 225 has been checked against the build that is running now, and
this pass could not change that.**
