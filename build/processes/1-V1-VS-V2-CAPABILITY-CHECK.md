# V1 vs V2 CAPABILITY CHECK `<feature>` — prove V2 still does everything V1 could

> **Call it:** `V1 vs V2 Capability Check on Invoicing`  —  or just *"does Invoicing V2 still do
> everything V1 did?"*
>
> **The one-line reason this exists.** A V2 specification describes only what **changes**. It is
> silent about everything the feature already did. So a V2 can quietly drop a capability and every
> single test case still passes — because no case was ever written for the thing nobody mentioned.
> **We are checking that V2 = V1 + V2, not V1 − V2.**
>
> 🔴 **This is the most important process in the set, and it is the one that cannot be done from
> documents.** The PRD will not tell you that V1's vendor search also looked at the website column.
> Only the code does. So this process **reads the product repository** — that is its whole premise.

---

## THE GATE — I ask you for this before I start, and I stop here if it is missing

| What I need | Why I cannot proceed without it | What it looks like |
|---|---|---|
| **Repository access** to the product repo | The entire process is reading V1's real behaviour out of the code | `ShopView/shopview` (api + app) |
| **The V1 reference point** — a branch, tag or commit SHA | "V1" must be a fixed thing, or the baseline shifts under us | `main` at `55767168`, or `v26.38.0` |
| **The V2 reference point** — the branch or environment the new version lives on | That is what we compare against | branch `sv9160`, or `app.staging.shopview.com` |
| **The feature boundary, in your words** | So I read the right code and do not drift into the whole app | "global search: the box in the header and its results" |
| *(helpful, not blocking)* the V2 PRD and epic | To classify each difference as INTENDED or LOST | Confluence link + `SV-9160` |

**If the V1 and V2 code are the same repo at different commits, say so.** If V1 is a different repo
entirely (an older product), say that instead — the method is identical, the paths are not.

> **Why I ask for a commit and not just "main".** `main` moves. A baseline derived from a moving
> target cannot be re-checked later, and a finding you cannot re-check is a finding you will end up
> withdrawing. Pin it.

---

## WHAT IT PRODUCES

1. **`<feature>-V1-BASELINE.md`** — what V1 does, every claim citing `file:line` at the pinned
   commit. Not prose: a list of behaviours.
2. **The INVARIANT REGISTER** — `INVARIANTS = V1 baseline − (changed ∪ removed ∪ replaced)`.
   Everything V2 is silent about, which therefore **must not change**.
3. **The WHAT-CHANGED table** — per behaviour: `KEPT` / `CHANGED-BY-DESIGN` / 🔴 `LOST`.
4. **A case for every invariant worth testing**, and a **PO question** for every silence that is
   dangerous enough that guessing is worse than asking.

---

## THE STEPS

### 1 — Pin both ends, and say so out loud
Record the V1 commit SHA and the V2 branch + its build marker in the baseline file's header. Every
later finding is read against these two points. *(Rule 110's provenance leg.)*

### 2 — Read V1's behaviour out of the code, not out of the docs
Find the feature's entry points and follow them down. For a search feature that meant: the API
route → the query builder → the SQL → the response assembler → the component that renders a row.
Write down, per behaviour, **what it does and where you read it**.

🔴 **Product source code establishes FACT, never EXPECTATION.** You are learning what V1 *does*, so
you can notice it disappearing. You are not learning what the product *should* do — that still comes
from the documents (Rule 57). A code-vs-document conflict is a **PO decision item**, never a quiet
assumption.

Companion method with the full technique: `build/skills/V1-BASELINE-FROM-SOURCE.md`.

### 3 — Subtract the V2 delta
Read the V2 spec and the V2 code. Mark each V1 behaviour as changed, removed, replaced — or
untouched. **What is left untouched is the invariant set, and silence defaults to "must not
change".**

### 4 — Go and look at V2 doing it
For every invariant, exercise it on the V2 environment and record the answer. This is where LOST
behaviour surfaces. Use the feature's own interface — an API call that returns 200 is not proof the
user can do the thing.

### 5 — Classify every difference, and never silently
- **KEPT** → no action.
- **CHANGED-BY-DESIGN** → the V2 spec says so. Cite the sentence. Retire or rewrite the old case.
- 🔴 **LOST** → V2 cannot do something V1 could, and no document says it should go. This is the
  finding the whole process exists for. Before reporting it, **search Jira for an existing ticket**
  — on Global Search, all six already had one.

### 6 — Hand over
The findings table, the invariant register, the new cases, and the PO questions for the dangerous
silences. For a comparison suite the **specification is V1 at the pinned commit** — so the expected
result states the V1 behaviour and the source line leads with repo, commit, file and lines
(Rule 109).

---

## THE TRAPS — each cost us real time on Global Search

| Trap | How it shows up | What to do instead |
|---|---|---|
| **Reasoning from the API payload to a UI conclusion** | I claimed rows "cannot explain themselves" from the JSON; five screenshots proved the UI *did* label them. 32 cases were wrongly held. | If the claim is about what a user SEES, open the UI. The payload is not the screen. |
| **Editing a V1-comparison case towards the V2 spec** | The case starts passing and never fails again | A comparison case is specified by V1. Never rewrite it to match the thing it tests (Rule 109). |
| **Treating a V2 omission as permission** | "The spec doesn't mention it, so it's fine to drop" | Silence defaults to MUST NOT CHANGE. High-collateral silence becomes a PO question, not an assumption. |
| **A moving baseline** | A finding cannot be reproduced next week | Pin the commit in step 1. |
| **Blaming the index for a behaviour change** | Four TRUE findings were withdrawn as "slow indexing" | Check the build marker first. A branch redeploys unannounced (Rule 110). |

---

## DONE WHEN

- Every V1 behaviour in the baseline is classified KEPT / CHANGED-BY-DESIGN / LOST, with evidence.
- Every LOST item has either a Jira ticket (existing or approved) or a written reason it is not one.
- Every invariant worth testing has a case, and every dangerous silence has a PO question.
- The baseline file names the V1 commit and the V2 build marker, so this can be re-run and compared.

**Canonical procedure:** `build/skills/17-REGRESSION-IMPACT-V1-TO-V2.md` (operator form of Rule 96)
and `build/skills/V1-BASELINE-FROM-SOURCE.md` (how to build the baseline).
**Rules:** 96, 109, 57, 58, 110. **Worked example:**
`build/global-search/GLOBAL-SEARCH-V1-BASELINE-INVARIANTS.md` and
`build/global-search/v1-parity-audit-2026-09-14/` — including the mistake that produced Rule 109.
