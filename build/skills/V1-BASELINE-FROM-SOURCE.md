# METHOD — V1 BASELINE FROM SOURCE (the source-cited regression baseline)

> **What this is.** The concrete method for **Skill 17 Step 1 / §3** — turning the CURRENT product source
> code into a **factual, source-cited V1 behaviour baseline** that Skill 17 then subtracts the V2 delta
> from to derive the invariant set (Rule 96). This file is a **companion to `17-REGRESSION-IMPACT-V1-TO-V2.md`**,
> not a separate job. **Skill 17 still owns:** the V2-delta mapping (Step 2), the invariant subtraction
> (Step 3), the deliberate-decisions register, and — critically — the **code-vs-document cross-check
> (§3.4)** and the **code-bug caveat (§7)**. Do those there; do not restate them here.
>
> **First established:** 2026-08-26, from the Global Search V1 baseline built for the SV-9160 (Global
> Search V2) project. Worked example on disk: `build/global-search/GLOBAL-SEARCH-V1-BASELINE-INVARIANTS.md`.

**🔴 TOKEN DISCIPLINE CHARTER (Rule 95) applies from your first turn** —
[`TOKEN-DISCIPLINE-CHARTER.md`](TOKEN-DISCIPLINE-CHARTER.md). In particular here: **strategy first (79)**,
**never bulk-read the repo to "get oriented" — search for what you need and script the bulk (88)**, and
**quality is never the thing cut (clause 12)**.

**Read first:** [`00-COMMON-CORE.md`](00-COMMON-CORE.md) (the honesty bar) and
[`17-REGRESSION-IMPACT-V1-TO-V2.md`](17-REGRESSION-IMPACT-V1-TO-V2.md) (the job this feeds).

---

## KICKOFF PROMPT (fill in, then begin)

```
Build the V1 BASELINE FROM SOURCE for: <feature name> (V2 epic: <SV-xxxx>)
Repo(s): <repo> (and sibling repos if the feature spans FE/BE/others)
V2 PRD: <link/version>   (used ONLY to know what V2 changes — never as a source of V1 fact)
Output: an invariant register + collateral-risk map + existing-coverage list + self-check,
        pinned to one commit SHA, saved to build/<project>/<FEATURE>-V1-BASELINE-INVARIANTS.md
```

---

## WHEN TO USE

- The project type at intake (`15-NEW-PROJECT-INTAKE.md` §1a) is **(ii) V2 / UPGRADE**, and you need the
  V1 baseline that Skill 17 Step 1 requires.
- You have (or can get) **read access to the product source code**. If you do NOT, you cannot run this
  method — fall back to the document/case baseline in Skill 17 §3.1–3.2 and record the limit.

**Do NOT use this to author cases or derive invariants.** It produces the *baseline of fact*; Skill 17
turns that into cases. Keep the two separate so neither drifts.

---

## THE NON-NEGOTIABLE RULES OF THIS METHOD

1. **Report only what the code DOES.** Not what it should do, not what V2 plans. Facts only.
2. **Every statement cites file path + line range + a short VERBATIM snippet.** A claim without a citation
   is not a baseline row.
3. **If a thing is not determinable from the code, write "NOT FOUND IN CODE".** Never guess, never infer to
   look complete. An invented detail is worse than a blank — the QA lead will act on this. (This is
   Rule 12 — *verified means observed, never inferred* — applied to source reading.)
4. **Product source code establishes FACT, never EXPECTATION (Rule 57).** The baseline says "the code does
   X"; whether X is *correct* is a Skill 17 §3.4 cross-check + a possible PO decision item, never settled
   here.
5. **Do not bulk-read the repo (Rule 88).** Search for the feature's entry points, then read only those
   files. Script any bulk extraction and read the summary.

---

## PROCEDURE

### Step 0 — Pick the branch, and JUSTIFY it (this decides what the baseline MEANS)

You need the branch that represents **current V1 behaviour as users have it today** — NOT one where V2
work already landed.

1. List the candidate long-lived branches (`main`/`master`/`develop`/`release`/`production`/`staging`) —
   confirm which actually exist (`git ls-remote --heads origin …`), do not assume.
2. Establish which branch is **production** (usually `main`) and report its head **commit SHA**.
3. **Prove V2 is not already in your chosen branch:** grep the feature's files for V2 markers (the V2
   ticket id, new-stack keywords from the PRD) AND `git diff <prod> <integration> -- <feature paths>` to
   see whether the feature already diverges. If the feature is **byte-identical across prod and the
   integration branch**, say so — either branch is a valid baseline and you note the parity.
4. **If V2 work is already in your chosen branch, say so LOUDLY** — it changes what the baseline means.
5. **Pin every citation in the deliverable to the chosen SHA.**

### Step 1 — Locate the feature across every surface (Rule 40)

Search, don't browse. Find the FE entry component, the composable/state, the API module, the BE
controller → query/handler, the DB tables/indexes, the permission checks, and the DTOs/serializers. A
feature that spans FE + BE + other repos must be traced across **every** surface.

### Step 2 — Read the actual files and extract behaviour

Open the located files (only those). For each behaviour, capture: what it does, the file, the line range,
and a verbatim snippet. Cover **at minimum** (adapt to the feature): searchable/affected entities and the
fields involved; matching/validation/calculation rules (exact/prefix/substring/fuzzy, case, tokenisation,
minimums, ranking/order); grouping, limits, pagination; debounce/throttle, request lifecycle,
cancellation; keyboard/interaction; empty/loading/error/no-result states; what happens on the primary
action per entity type; recent/history (what, where, how long, when shown); **permission/role gating**;
**tenant/location/shop scoping**; **feature flags**; and **anything EXCLUDED and where the exclusion is
enforced**.

### Step 3 — Produce the deliverable (four parts)

Save to `build/<project>/<FEATURE>-V1-BASELINE-INVARIANTS.md`. Structure:

- **Provenance block** — repo, baseline branch, **commit SHA**, prod-parity note, "is V2 present?", the
  entry-point file list.
- **Part A — INVARIANT REGISTER.** One numbered assertion per row (`INV-01`…), each a *testable
  must-remain-true* statement with its `file:line` citation, grouped by concern. **This is the section
  Skill 17 Step 2 maps the V2 delta against.** Frame it explicitly: *if the PRD does not mention a row,
  that row is a regression candidate.*
- **Part B — COLLATERAL-RISK MAP.** For each shared thing the feature depends on (component, composable,
  endpoint, handler, table/index, permission check, DTO), give: the item, its path, what ELSE uses it
  (paths + rough count), and H/M/L risk. Say explicitly when something is **used ONLY by this feature**.
  This is the raw material for Skill 17's "Collateral risk" matrix column and §3.5.
- **Part C — EXISTING AUTOMATED COVERAGE.** Every test touching the feature (unit / integration / E2E):
  file, test name, one-line assertion — so the V2 suite reuses them as regression anchors instead of
  duplicating them.
- **Part D — SELF-CHECK + OPEN AMBIGUITIES.** The branch + SHA, the number of files you actually opened and
  their full paths, an explicit list of what you could NOT determine, and the subtle/possibly-unintended
  V1 behaviours to confirm against the PRD (candidate PO questions, not resolved here).

### Step 4 — Hand it to the case-authoring session

The deliverable is the **input to Skill 17**. Deliver it as a file in `build/<project>/`, and (if the
authoring session cannot read the repo) as pasteable text. End with the OUTSTANDING section (Rule 36).

---

## HONESTY / QUALITY CONVENTIONS (carry these verbatim into the output)

- **"NOT FOUND IN CODE"** for anything the source does not settle — including behaviour that is a
  framework default rather than app code (say which). Do not present a library default as an app fact.
- **Pin to a SHA**, and record the prod-parity check, so the authoring session can diff V2 against exactly
  this point.
- **Each row is one assertion** (Rules 7/9 — plain, tester-readable), so it can become one test case.
- **Never imply exhaustiveness you do not have** (Skill 17 §7): the baseline is only as complete as the
  files you read; name the gaps.

## HANDS OFF (what this method must NOT do)

- **No invariant derivation, no V2-delta decision, no case authoring** — those are Skill 17 / Skill 01.
- **No commit/push** unless the QA lead asks (Rule 29 cadence is his call on this repo's shared branch).
- **The product build is never a source of EXPECTATION** (Rule 57). This method reads the build only to
  state current fact.

---

*Companion to Skill 17 (Rule 96). Proposed 2026-08-26 per Rule 72; worked example:
`build/global-search/GLOBAL-SEARCH-V1-BASELINE-INVARIANTS.md`.*
