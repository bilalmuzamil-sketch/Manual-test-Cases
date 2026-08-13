# Schedule — completion report

**Standing Rule 67.** Every figure was **derived live from TestRail and Confluence at
2026-08-13T02:47Z**, not carried from a document — and the check changed three of them (§2).

**Build now running: `v3.5-84846fa`**, last-modified **Wed 12 Aug 2026 21:44:48 GMT**, etag
`f689bc07afb51892df7b253c08838bfb`. Read **three times** across the pass, `index.html` **sha256
identical** each time (`adeae893…`) — it did not move under us.

---

## THE TABLE

| | Schedule (TestRail group 4254) |
|---|---|
| **Total cases** | **ours 176 / live 176** — 0 foreign; every case `created_by = 3` |
| **Source-verified** | **176 of 176** pin specification version 27; Confluence 713031682 read live, **last edited Aug 07 2026** — the spec has **not** moved. **CURRENT.** |
| **🔴 Build-verified — naming the build NOW RUNNING** | **0 of 176** |
| **Build-verified — naming an earlier build** | **176 of 176** — `v3.5-65d6500` ×151 · `v3.5-7ec992f` ×15 · `v3.5-d122eef` ×10 |
| **No build line at all** | **0 of 176** |
| **🔴 Steps and preconditions actually WALKED — union by case id** | **151 of 176** *(corrected up from the 147 on record — see §2b; **this pass walked 0**)* |
| **Walked *and* on the build now running** | **0 of 176** |
| **Runnable vs held** | **READY 137 · READY-EXPECT-FAIL 4 · HOLD 35** |
| **The gate, closing both ways** | **137 + 4 = 141** and **176 − 35 = 141** ✅ |
| **Created / updated / deleted this pass** | **0 / 0 / 0** |

**Build-verified and steps-walked are reported separately and deliberately.** They measure different
things and merging them would overstate the position — **151 cases have had their steps run at some
point; 0 have been run against the build that is running now.**

---

## §1 — WHAT THIS PASS DID, AND WHAT IT COULD NOT

**It could not run anything.** The QA session supplied in the brief returns **HTTP 401
`sso_required`**, proved with four control probes in `BLOCKER-AUDIT.md` §0. `quick-login` and
`switch-user` were barred and never called.

| Brief step | Outcome |
|---|---|
| **1 · Audit the blocked cases under Rule 68** | ✅ **Complete — 39 cases, the full held population** |
| **2 · Walk the verdict-blocked cases** | ❌ needs the session |
| **3 · Check the second-sign-in estate** | ❌ needs the session |
| **4 · The four role/staff/settings cases** | ❌ needs the session |

**Step 1 is the deliverable that never needed a session, and it is the one that found things.**

---

## §2 — HOW MANY OF THE 29 WERE FALSELY BLOCKED

**Direct answer: of the 29 reported as remaining, 4 were never blocked at all, and a further 11 are
blocked only for their verdict — not their runnability.**

### (a) 🔴 Four were already walked — the ticket number blocks the MARKER, not the walk

**C29985 · C30004 · C30013 · C30020.** Each says, in its own expected results: ***"This has been
checked on the build and reported to the QA lead, but it does not have a ticket number yet."*** A
fault cannot be observed without running the steps. **Rule 68(1) names this exact case: a missing
ticket number blocks the marker, not the walk.**

They wait on **one ticket number each** — and Jira creation is under the **Rule-62 hold**. One edit
each turns `HOLD` into `READY - EXPECT FAIL` the moment a number exists.

### (b) So the walked figure is 151, not 147 — and the remainder is 25, not 29

**151 + 25 = 176.** The correction is arithmetic, not opinion: those four sat in the *remaining*
column while their own text records them as checked.

### (c) Eleven more are blocked for the verdict only

- **3 PO-blocked** (C29983, C30089, C43555) — *"a missing PO answer blocks the VERDICT, not the
  RUNNABILITY"*, Rule 68(1) verbatim. **All three are walkable today.**
- **8 second-sign-in** — the **negative** half needs the second account; the **positive** half and
  every step's runnability do not.

### (d) Four should never have been escalated to you

**C29971, C30080, C30083, C38870** were put to you as *"blocked on one go-ahead from you."*
**Standing Rules 5, 14 and 26 already authorise creating roles, staff and settings on the QA
branch** — and Rule 68's own rationale cites *this project* for making exactly this ask. **They are a
scheduling problem, not a permission problem.** No go-ahead is needed.

**And one of them is probably free: C30080 creates a ZZAUTOTEST role nobody holds**, so the known
session-destroying mechanism (editing a role a user *holds*) should not fire. Reasoned from the
recorded mechanism, **not measured**.

### (e) Genuinely, permanently blocked: one

**C38867** needs shifts noted **before** a release that has already deployed. A closed time window.
**This is the only one of the 39 where "blocked" is the whole truth.**

---

## §3 — 🔴 THE FINDING NOBODY WAS LOOKING FOR: THIRTEEN HOLDS REST ON A DEAD BUILD

**The branch redeployed to `v3.5-84846fa` on 12 Aug at 21:44 GMT.** Thirteen cases are held on the
claim that a control *"does not exist in this build"* — measured on `v3.5-65d6500` or `v3.5-7ec992f`,
**one or two deploys ago**:

**C43582–C43587** (panel button, spec **§5.3**) · **C29973, C29974, C29975** (Unassigned row, **§3.2**)
· **C29929** (department header collapse, **§3.2**) · **C29945** (Priority filter, **§5.1**) ·
**C30050** (Tech Hours, **§9**) · **C38868, C38869, C38871**.

**Why these and not the rest.** Rule 60 says a redeploy invalidates the `HOLD` half of layer 3. Rule
61 says an automated suite reports its own staleness — **but a held case is never run, so it reports
nothing.** These thirteen are precisely the population the suite cannot see, and **their premise has
not been re-tested.**

**⚠️ This is not a claim that anything shipped.** No session, nothing observed (Rule 12). It is a
claim that **thirteen holds are being carried on out-of-date evidence** — the migration Rule 68 warns
about, where a blocker gathers authority at every hop while nobody re-tests it.

**Re-checking all thirteen is a handful of minutes and is the highest-value use of the next session.**

---

## §4 — THREE DEFECTS FOUND IN OUR OWN RECORDS

1. **🔴 The four "remaining" cases are tabulated with the WRONG TITLES** in
   `finish5/COMPLETION-REPORT.md`. **None of the four handover titles matches any case in the live
   176.** The **C-ids are correct** — all four genuinely need a role, staff or settings change — but
   anyone reading that table would go hunting for permission cases and find none.
2. **The handover's own two figures disagree about C30034** — identical hold reason and identical
   build stamp to the other four unticketed-fault cases, yet classified on the opposite side.
3. **The specification contradicts itself on shop closures** — **§4.5** *"not skipped in V1"* versus
   **§12** *"block the spread step"*. Both sentences are in the current version. This is a document
   defect and is raised, not resolved (Rule 57).

---

## §5 — PROOFS

| | |
|---|---|
| TestRail writes | **0** — no update, add, delete, section, run or result |
| Jira calls that create anything | **0** (Rule 62 hold) |
| Application writes | **0** — the session never authenticated |
| Run 357 | **never addressed** — no call names it; 529+ results untouched |
| `custom_atmstatus` | **never set, on any case** |
| Foreign cases | **0** — all 176 `created_by = 3` |
| Automated cases changed | **none**, on both counts (`AUTOMATED-CASES-CHANGED.md`) |
| Build stability | read ×3, `index.html` sha256 identical |
| Secret scanning | `scan_secrets.py` clean on every staged file; 15-token grep clean |

---

## OUTSTANDING — what I need from you

**1 · A live QA session for `sv8685` — this is the only real blocker, and it blocks the fixing, not
the finding.** The cookies in the brief were dead on arrival (HTTP 401, four control probes). With a
session, the work-list in `RUNNABILITY.md` §B is ready to run in priority order and needs no further
decisions from you.

**2 · Ticket numbers for four observed faults** — C29985, C30004, C30013, C30020. They are **already
walked**; each becomes `READY - EXPECT FAIL` with **one edit**. Blocked by your own hold, verbatim:
***"Do not create anything until my next order."*** **That ruling was right** — it was given the day
before a release, and creation is the one thing that cannot be cleanly undone. **One word lifts it,
or tells me to keep waiting.**

**3 · A second non-administrator sign-in** would release **8** held cases — the largest single group,
and the same ask open on Filters since 5 August. **Worth checking first whether the estate already
holds a suitable account** (on Filters it did — 17 inactive staff already existed); that check is
read-only and is first on the work-list.

**4 · A decision on C38867** — it needs shifts noted before a release that has already deployed.
**It cannot ever be run as written.** Retire it or rewrite it; I have not touched it, because that is
a judgement about coverage, not a correction.

**5 · Branko's answer on shop closures** — the specification says both things (**§4.5** vs **§12**),
which blocks the verdict on **C29983, C30089, C43555**. **Note the holdup is us, not him: the
question has never been sent**, and under Rule 66 the question sheet goes last, so this is correctly
sequenced rather than neglected.

**You do NOT need to give a go-ahead for the four role/staff/settings cases.** That ask was made of
you and should not have been — Rules 5, 14 and 26 already cover it.
