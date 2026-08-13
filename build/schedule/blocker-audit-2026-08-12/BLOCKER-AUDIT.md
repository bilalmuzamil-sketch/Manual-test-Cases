# Schedule — every blocker audited under Standing Rule 68

**Date 2026-08-13. Scope: Schedule only, TestRail group 4254.** Every figure below was **derived
live from TestRail** this pass, not carried from a document — and that mattered, because **three
claims in the handover did not survive the check** (§1).

**Population audited: 39 cases** — the **35** carrying `AUTOMATION: HOLD` live, plus the **4**
marked `READY` that the previous pass recorded as unwalked. The handover's own figure was **29**;
§2 shows why that number is wrong in **both** directions.

---

## §0 — THE SESSION IS DEAD, AND HERE IS THE PROOF RATHER THAN THE ASSERTION

Rule 68(2) requires that a blocker be **proved**, not asserted: *"state what was attempted, what it
returned, and what remained possible."* So:

| # | Probe | Result |
|---|---|---|
| 1 | `GET sv8685api.qa.shopview.com/api/auth/me/fe-permissions`, supplied cookies | **HTTP 401** `{"error":"sso_required"}` |
| 2 | `GET sv8685api.qa.shopview.com/api/organizations`, supplied cookies | **HTTP 401**, same body |
| 3 | **Control** — same endpoint, cookies replaced with `deadbeef` | **HTTP 401**, *byte-identical body* |
| 4 | **Control** — same endpoint, **no** `Cookie` header at all | **HTTP 401** |
| 5 | App host `sv8685.qa.shopview.com/this-path-does-not-exist-xyz` | **HTTP 200** — confirms the brief's warning that the app host answers 200 on any path and is worthless as an auth signal |

**What this establishes and what it does not.** Cloudflare is **passed** — probes 1 and 2 return the
*application's* JSON, not a Cloudflare challenge — so `cf_clearance` is fine and it is
`sv_sso_session` that is rejected. The header shape is the one the working harness uses
(`PHPSESSID=…; sv_sso_session=…; cf_clearance=…`, 564 bytes, no trailing newline, read from the same
`/tmp/qa-cookies/sched-hdr.txt` path prior passes used).

**Stated honestly (Rule 12): I could not construct a positive control**, because I have no
known-good session to compare against. So the strongest claim the evidence supports is *"the
supplied session does not authenticate, and behaves identically to no session at all"* — not
*"my probe would definitely have detected a good one."* That is the honest limit.

**Neither `quick-login` nor `switch-user` was called** — both barred by the brief.

### What this blocked, decomposed the way Rule 68 demands

| Brief step | Blocked? | Why |
|---|---|---|
| **1 — audit the 29 under Rule 68** | **NO** | Reasons live in the case text and the source documents. **Done in full, below.** |
| **2 — walk the steps of verdict-blocked cases** | **YES, totally** | Every one of the five checks needs the running application |
| **3 — check the second-sign-in estate** | **YES, totally** | Needs `GET /api/staff` |
| **4 — the four role/staff/settings cases** | **YES, totally** | Needs an authenticated write |

**Zero TestRail writes followed from this.** Nothing was walked, so nothing earned a Rule-54
sentence-2 re-stamp; inventing one would assert an observation nobody made.

---

## §1 — THREE THINGS IN THE HANDOVER DID NOT SURVIVE THE CHECK

Rule 68 says to **verify each grouping rather than inherit it**. Doing so found three defects. None
of them is catastrophic; all three would have propagated.

### (a) 🔴 The four "genuinely remaining" cases are listed with the WRONG TITLES

`finish5-2026-08-12/COMPLETION-REPORT.md` tabulates the four remaining cases as:

| C-id | Title in the handover | **Actual live title** |
|---|---|---|
| C29971 | *"Schedule access is gated by the Schedule permission tier"* | **"With neither technician hours nor business hours set, a 7:00 AM default applies"** |
| C30080 | *"Schedule: Delete gates the delete controls"* | **"Permission tiers nest: Delete requires Edit, Edit requires View"** |
| C30083 | *"The Work Orders: View dependency gates the sidebar"* | **"Grid rows are department-based, not role-based"** |
| C38870 | *"Working-hours settings are gated by the settings permission"* | **"A multi-location technician's shift appears only on the work order's location"** |

**None of the four handover titles matches ANY case in the live 176** — searched, zero hits. They
read like plausible paraphrases of the *permission* cases (C30076–C30084), which are a different
group entirely.

**But the C-ids are RIGHT, and that is the part that matters.** Reading all four cases' actual
preconditions confirms each genuinely needs a role, staff or settings change:

- **C29971** — needs a technician with **no configured hours** *and* the shop's **business hours
  unset**. A **settings** change.
- **C30080** — needs *"a ZZAUTOTEST custom role exists (create one; delete after)"*. A **role**
  change.
- **C30083** — needs a non-technician **assigned to a department**, and another with **none**. A
  **staff** change.
- **C38870** — needs *"a technician enrolled at TWO locations"*. A **staff** change.

**So the selection is sound and the labelling is wrong.** Recorded rather than quietly corrected,
because anyone reading that table would have gone looking for permission cases and found none.

### (b) The handover's own two figures disagree about C30034

`C30034` carries the *identical* HOLD reason to C29985/C30004/C30013/C30020 — *"an observed fault on
this case has no ticket number yet"* — and the *identical* build stamp. The handover puts the other
four in its **unwalked** list and C30034 in the **walked** remainder. **Same evidence, same reason,
opposite classification.** §2 resolves it: **all five were walked.**

### (c) The arithmetic is fine, and that is worth saying

**35 HOLD = 25 (the handover's grouped table) + 10 walked-but-still-held**, and the six groups sum
to 25 exactly. **The counts reconcile; it is the labels and the walked/unwalked split that do not.**

---

## §2 — 🔴 THE BIGGEST FINDING: FOUR OF THE 29 WERE NEVER UNWALKED

**Rule 68(1), verbatim: *"A missing ticket number blocks the MARKER, not the walk."*** That is this
group, exactly.

**Cases: [C29985](https://shopview.testrail.io/index.php?/cases/view/29985) ·
[C30004](https://shopview.testrail.io/index.php?/cases/view/30004) ·
[C30013](https://shopview.testrail.io/index.php?/cases/view/30013) ·
[C30020](https://shopview.testrail.io/index.php?/cases/view/30020)** (and
[C30034](https://shopview.testrail.io/index.php?/cases/view/30034), already correctly counted as
walked).

**The proof is in the cases' own text.** Every one of the five contains, verbatim:

> *"This has been checked on the build and reported to the QA lead, but it does not have a ticket
> number yet."*

and C30004 goes further, recording a **per-point** result:

> *"What you should see today: Points 1, 2 and 3 are fine — the shift moves, the released start time
> lands on a quarter hour, and the length does not change."*

**You cannot observe a fault on a case without running its steps.** All five carry the build stamp
`v3.5-65d6500` on 8/12/2026. **They were walked.**

- **Blocked for:** a ticket number, which does not exist because **Jira creation is under the
  Rule-62 active hold** — *"Do not create anything until my next order."*
- **Still possible under it:** **everything except the marker string.** These four are runnable
  today, by a manual tester, unchanged.
- **Genuinely impossible until it clears:** upgrading `HOLD` → `READY - EXPECT FAIL (SV-xxxx)`.
  **One edit each, the moment a number exists.**

**⇒ The reported remainder of 29 should be 25.** And the four are not waiting on a session, a PO or
a build — they are waiting on **one word from the QA lead**.

---

## §3 — 🔴 THIRTEEN "NOT IN THIS BUILD" CLAIMS NOW REST ON A BUILD THAT NO LONGER RUNS

**The branch redeployed.** `v3.5-84846fa`, last-modified **Wed 12 Aug 2026 21:44:48 GMT**, etag
`f689bc07afb51892df7b253c08838bfb` — read twice this pass with `index.html` **sha256 identical**, so
it is stable and it is **not** the build any of our 176 cases names.

| Build named | Cases |
|---|---|
| `v3.5-65d6500` | 151 |
| `v3.5-7ec992f` | 15 |
| `v3.5-d122eef` | 10 |
| **`v3.5-84846fa` — the one actually running** | **0** |

**Why this bites precisely here.** Under **Rule 60** a redeploy invalidates layer 1 (labels and
navigation), layer 2 (the verdict) and **the `HOLD` half of layer 3**. Under **Rule 61** an automated
suite reports its own staleness — **but a `HOLD` case is never run, so it reports nothing.** These
thirteen are exactly the population the suite cannot see, and their claim is a *build fact*:

| Case | Claim | Stamped on | Deploys stale |
|---|---|---|---|
| [C43582](https://shopview.testrail.io/index.php?/cases/view/43582)–[C43587](https://shopview.testrail.io/index.php?/cases/view/43587) (6) | *the panel button does not exist in this build* | `v3.5-65d6500` | **1** |
| [C29973](https://shopview.testrail.io/index.php?/cases/view/29973), [C29974](https://shopview.testrail.io/index.php?/cases/view/29974), [C29975](https://shopview.testrail.io/index.php?/cases/view/29975) | *the Unassigned row does not exist in the build* | `v3.5-65d6500` | **1** |
| [C29929](https://shopview.testrail.io/index.php?/cases/view/29929) | *the control this test needs does not exist* | `v3.5-65d6500` | **1** |
| [C29945](https://shopview.testrail.io/index.php?/cases/view/29945) | *the Priority filter does not exist* | `v3.5-65d6500` | **1** |
| [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) | *the toggle displays nothing in this build* | `v3.5-65d6500` | **1** |
| [C38868](https://shopview.testrail.io/index.php?/cases/view/38868), [C38869](https://shopview.testrail.io/index.php?/cases/view/38869), [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) | *the Dashboard / appointment / Priority field does not exist* | `v3.5-7ec992f` | **2** |

**Every one of these is a requirement the specification actually makes** — panel collapse is **§5.3**
(a full section), the Unassigned row is **§3.2**, the Priority filter is **§5.1**, Tech Hours is
**§9**, collapsible department headers are **§3.2**. So they are not speculative cases; they are
**built-to-spec cases waiting on the feature**.

- **Blocked for:** the feature being absent — **as measured one or two deploys ago**.
- **Still possible under it:** **re-checking whether it is still absent.** That is a cheap look, and
  it is the single highest-value use of the next live session.
- **Genuinely impossible:** walking the steps, *if* the control is still missing.

**⚠️ This is NOT a claim that anything shipped.** No session, so nothing was observed (Rule 12). It
is a claim that **the evidence behind thirteen holds is out of date and nobody has re-tested the
premise** — which is precisely the migration Rule 68 warns about.

---

## §4 — THE THREE "WAITING ON THE PRODUCT OWNER" CASES: THE VERDICT IS BLOCKED, THE WALK IS NOT

**Rule 68(1), verbatim: *"A missing PO answer blocks the VERDICT, not the RUNNABILITY."*** This is
the exact shape of the Filters mistake the rule was written from.

**[C29983](https://shopview.testrail.io/index.php?/cases/view/29983) ·
[C30089](https://shopview.testrail.io/index.php?/cases/view/30089) ·
[C43555](https://shopview.testrail.io/index.php?/cases/view/43555)**

**And the underlying product question is real — I verified it in the live spec rather than taking it
on trust. The specification contradicts itself:**

> **§4.5:** *"Shop closures and public holidays are **not** skipped in V1."*
> **§12:** *"Shop closures (holidays, inventory days) are defined at the shop level and **block the
> spread step** from placing shifts on those days."*

Those cannot both be true, and **C30089 follows §4.5**. So the PO question is genuine and correctly
raised — **but it blocks only which of the two the tester should expect.**

- **C29983** (spread uses tech hours; weekend skipping) — **blocked for:** the verdict.
  **Still possible:** the entire walk — drag a large job, reach the spread step, read what it
  produces. **Genuinely impossible:** deciding pass or fail.
- **C43555** (month-view drag-create) — identical shape.
- **C30089** — **two blockers, and they must be separated.** (i) the spec contradiction blocks the
  **verdict**; (ii) *"the shop-closure setting does not exist in the build"* blocks the
  **precondition** — and **that half is a build fact stamped on a superseded build**, so it belongs
  in §3's re-check list as well.

**⚠️ AND THE QUESTION HAS NEVER BEEN SENT.** Both C29983 and C30089 say so in their own hold
reasons: *"waiting on the product owner's answer, **and the question has not been sent yet**."*
**The blocker here is us, not Branko** — and under Rule 66 the question sheet is the last thing sent,
so this is correctly sequenced rather than neglected. It still needs saying plainly, because a row
reading *"waiting on the PO"* implies the PO is the holdup, and he has not been asked.

---

## §5 — THE FOUR ROLE/STAFF/SETTINGS CASES: A COST, NOT A WALL — AND ONE OF THEM IS PROBABLY FREE

**Rule 68(4), verbatim: *"A COST IS NOT A BLOCKER — IT IS A SCHEDULING DECISION."*** And Rule 68(3):
seeding data, **creating roles**, creating users are **ours to do** (Rules 5/14/26).

The established mechanism, from `finish-2026-08-12/DIVERGENCES.md` §A: **editing a role DEFINITION
invalidates every holder's session, one way, and it does not come back when the permissions are
restored.** That is what cost the Technician session on 12 August.

**🔑 But read that carefully — it is about editing a role that somebody HOLDS. Now decompose:**

| Case | What it needs | Session-destroying? |
|---|---|---|
| **[C30080](https://shopview.testrail.io/index.php?/cases/view/30080)** | *"a ZZAUTOTEST custom role exists (create one; delete after)"* — then toggle Edit/Delete **within that new role's own form** | **🟢 PROBABLY NOT.** It **creates a role nobody holds** and never touches the administrator's own role. The known mechanism does not apply. |
| **[C29971](https://shopview.testrail.io/index.php?/cases/view/29971)** | clear technician hours + shop business hours | 🟠 a **settings** write, not a role write — lower risk, restore after |
| **[C30083](https://shopview.testrail.io/index.php?/cases/view/30083)** | department assignment on two staff records | 🟠 **staff** write |
| **[C38870](https://shopview.testrail.io/index.php?/cases/view/38870)** | enrol a technician at two locations | 🟠 **staff** write |

- **Blocked for:** an authenticated session — **that is all**, and it is today's blocker for every
  one of the 39, not something special to these four.
- **Still possible under it:** nothing, today.
- **Genuinely impossible:** nothing permanently. **These are not blocked on the QA lead.**

**⚠️ I am correcting the handover here, and this is the one to read twice.** finish5 escalated these
four as *"blocked on one go-ahead from you"* with a five-field Rule-48 entry. **Rule 68(6) says
escalate only what is truly his — and Rule 68's own rationale cites this very project for making
exactly this ask when Rules 5, 14 and 26 already authorise it**, quoting the QA lead: *"do whatever
you want to do with data seeding/changing/editing in the QA branch."*

**So the correct handling is: do C30080 FIRST (it is probably free), then everything else that needs
the session, commit and push, and do the three staff/settings writes LAST — accepting that the
session may end.** That is Rule 68(4)'s sequencing, and it needs **no permission at all**.

**Honest limit:** the claim that C30080 is non-destructive is **reasoned from the recorded mechanism,
not measured** — no session to test it with. Treat it as the best first bet, not a certainty.

---

## §6 — THE EIGHT SECOND-SIGN-IN CASES: THE NEGATIVE HALF IS BLOCKED, THE POSITIVE HALF IS NOT

**C30076 · C30077 · C30078 · C30079 · C30081 · C30084 · C30614 · C38926**

These assert permission gating — *"with Schedule: View OFF, the nav item is hidden"*, and so on.

- **Blocked for:** the **negative** verdict, which needs a session as a user who **lacks** the
  permission.
- **Still possible under it:** (i) the **positive** half — that the control exists and behaves for a
  user who *does* hold the permission — is observable from the administrator session; (ii) the
  **runnability** of every step; (iii) **whether a suitable user already exists**, which is a
  read-only `GET /api/staff` and needs no writes at all.
- **Genuinely impossible:** the negative observation, until a second sign-in exists.

**The brief's instinct is worth acting on.** On Filters the equivalent group *"turned out to need no
new user — 17 inactive staff already existed."* **Three of these eight do not obviously need a new
account at all:** **C30084** wants *"each of the two staff members"* (a Time Clock setting, not a
permission), and **C30044** — held separately — wants *"a user with no staff record of their own"*,
which is a property some existing account may already have. **This was not checkable this pass**, and
it is the first thing to check next.

**Note the three partial holds are already correctly decomposed** and deserve credit rather than
re-litigation — **C30044** (*"points 1 to 3 are observed and pass"*), **C38872** (*"point 2 is
observed and passes"*), **C38874** (*"point 1 is observed and passes"*). That is Rule 68(1) done
right, before the rule existed.

---

## §7 — THE ONE GENUINELY IRRECOVERABLE BLOCKER

**[C38867](https://shopview.testrail.io/index.php?/cases/view/38867)** — *"Shifts and events created
before the Schedule rewrite still appear."* Hold: *"cannot be run now — it needs shifts noted BEFORE
the release, and the release is already deployed."*

- **Blocked for:** a **one-way time window that has closed.**
- **Still possible:** a **weaker** version — if any shift in the data predates the rewrite, that it
  renders correctly is checkable. That is not the case as written, and it should not be relabelled
  as though it were.
- **Genuinely impossible:** the case as written. **Permanently.**

**This is the only one of the 39 where "blocked" is the whole truth**, and it should be retired or
rewritten rather than carried forward as outstanding work — **a decision for the QA lead, not a
write I would make unasked.**

---

## §8 — THE SCOREBOARD

| Group | Cases | What the blocker ACTUALLY blocks | Verdict |
|---|---|---|---|
| Missing ticket number | **4** | the **marker only** — already walked | 🔴 **falsely counted as unwalked** |
| "Not in this build" | **13** | the walk — **on evidence 1–2 deploys stale** | 🔴 **premise never re-tested** |
| Waiting on the PO | **3** | the **verdict**, not the walk | 🟠 **partly false; and the question was never sent** |
| Role/staff/settings | **4** | **a session** — a cost to schedule, not a wall | 🟠 **should not have been escalated** |
| Second sign-in | **8** | the **negative** verdict only | 🟠 **partly false** |
| Partial, already decomposed | **3** | one point each, correctly stated | 🟢 **sound** |
| Time window closed | **1** | everything, permanently | 🟢 **sound — and terminal** |
| Others (feature-absent overlap, counted in row 2) | **3** | — | — |

**Of the 29 the handover reported as remaining: 4 were never unwalked at all, and a further 3 + 8
are blocked only for their verdict, not their runnability.** The Filters error rate the brief warned
about — *14 of 23 self-inflicted* — **is reproduced here in kind, though not in the same
proportion.**

**None of this was fixable this pass, because the one blocker that IS real and total is the dead
session** — and it blocks the fixing, not the finding.
