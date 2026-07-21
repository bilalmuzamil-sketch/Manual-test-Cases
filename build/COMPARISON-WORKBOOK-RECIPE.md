# Comparison / Environment-Diff Workbook — REUSABLE RECIPE

> **Reusable across ALL projects (Standing Rule 3).** This is the durable template for
> the "Prod-vs-Staging LIVE-VERIFIED" comparison workbook, so that a future request
> like *"make a comparison file"* reproduces the same deliverable **shape** without
> re-explanation. The **structure is fixed**; the **environments / population /
> capabilities / spec are the parameters** that change per request.
>
> **Worked reference (the file this recipe was reverse-engineered from):**
> `build/custom-roles-run/Prod-vs-Staging-LIVE-VERIFIED-2026-07-14.xlsx` (+ `.md`
> narrative), its generators, and `build/PROD-VS-STAGING-COMPARE-METHOD.md`.

---

## 1. PURPOSE & TRIGGER

**What it is:** a single Excel workbook (plus a narrative `.md`, plus an EXEC
one-pager if asked) that compares a **population** (roles, or entity types, or
features) **capability-by-capability across two (or N) live environments**, giving a
**dual verdict** per cell (does A have it? does B have it? MATCH / one side has more)
**plus two spec/standing-rule conformance annotations** — with **every cell
LIVE-OBSERVED with evidence** and **zero cells "NOT VERIFIED."**

**Trigger — invoke THIS recipe whenever the user asks for any of:**
- "make a comparison file / comparison workbook / comparison spreadsheet"
- "prod-vs-staging comparison" / "compare X vs Y" / "environment diff" /
  "permission comparison" / "capability compare"
- "with random changes if needed" → this phrase means **the STRUCTURE is a template**;
  only the parameters (§6) differ. Do NOT invent a new layout — mirror this one 1:1
  (Standing Rule 16).

Before starting, per **Standing Rule 11**, confirm which project/spec governs and
which process(es) to run; per **Standing Rule 1**, confirm you have the complete
parameter set (§6) before authoring.

---

## 2. NAMING CONVENTION

- **Workbook file name STARTS WITH "Comparison":**
  `Comparison_<EnvA>-vs-<EnvB>_<YYYY-MM-DD>.xlsx`
  (e.g. `Comparison_Prod-vs-Staging_2026-07-14.xlsx`). The worked reference predates
  this convention (it is `Prod-vs-Staging-LIVE-VERIFIED-<date>.xlsx`); **new files use
  the `Comparison_…` prefix.**
- **Companion narrative:** same stem with `.md`
  (`Comparison_<EnvA>-vs-<EnvB>_<YYYY-MM-DD>.md`).
- **EXEC one-pager (only if requested):**
  `Comparison_<EnvA>-vs-<EnvB>_EXEC_<YYYY-MM-DD>.xlsx` / `.md`.
- **Location:** the project's run folder (e.g. `build/<project-slug>-run/` or
  `build/<project-slug>/`), alongside a **generator script** that regenerates the
  workbook (`gen_<something>.py`) so the file is reproducible, plus the evidence tree
  (§7). Provide **GitHub raw download links** for every deliverable.

---

## 3. EXACT WORKBOOK STRUCTURE (the core — regenerate 1:1)

The worked reference has **10 tabs**. Reproduce this tab set (rename the two env
columns per §6; drop a capability-specific tab only if that capability isn't in
scope, and add per-capability "… LIVE" tabs the same way for new priority
capabilities).

### Tab list (in order)
1. **`READ ME - Coverage & Honesty`** — the legend / honesty statement (§3.1).
2. **`Full Dual Matrix`** — THE authoritative grid: one row per population-member ×
   capability (§3.2). This is the tab everything reconciles to.
3. **Per-capability "… LIVE" evidence tabs** — one per priority/trust-critical
   capability, each a deep live-observation grid (§3.3). In the reference:
   `Send to Terminal LIVE`, `Approve-Decline LIVE`, `Parts-Module Dual LIVE`,
   `New-WO Create Dual LIVE`.
4. **Per-pass "LIVE" tabs** — a running log per observation pass
   (`Pass-11 LIVE (<date>)`, `Pass-12 LIVE (<date>)`, …) recording what each pass
   closed (§3.4).
5. **`<EnvB> Live Grid`** — a per-role snapshot of raw controls seen in the
   new-model env, with a screenshot path per row (§3.5). (Reference:
   `Staging Live Grid`.)
6. **`Spec-Standing Conformance`** — the summary/tally tab: conformance buckets +
   the explicit list of every DEVIATION / spec-inconsistent / spec-silent row (§3.6).

### 3.1 `READ ME - Coverage & Honesty` (single wide column A)
Free-text honesty/legend sheet. Row 1 = bold title
`LIVE-VERIFIED <EnvA>-vs-<EnvB> <population> Compare - DUAL VERDICT - FINAL (<date>, Pass-N)`.
Then paragraphs covering, in order:
- **Observed-only statement** (Rules 10 & 12): every cell is LIVE-OBSERVED with a
  screenshot/captured response this run, OR a fully-characterized config gate;
  nothing inferred from role defs / `fe_permissions` / atoms / source. Name any
  **SUPERSEDED** prior (inference-tainted) workbook.
- **"THIS WORKBOOK CONTAINS ZERO UNVERIFIED CELLS."**
- **METHOD** — how each env was authed/observed live this run (per §6 auth).
- **PRIORITY … CAPABILITIES - LIVE DUAL VERDICTS** — the trust-critical set summarized.
- **THE ORG-CONFIG / EXTERNAL gate(s)** — any fully-characterized non-role verdict.
- **COVERAGE** — the exact cell counts ("N capability × role cells, ALL carry a
  verdict, 0 unverified").
- **TABS REMOVED AS SUPERSEDED** — list early inference/probe-era tabs that were
  dropped, and where raw evidence lives (`live-ui-<date>/…`).
- **CLEANUP** — impersonations exited, seeded data deleted, roles/settings restored,
  no TestRail writes.
- **THE TWO ANNOTATION COLUMNS** — describe `Per Spec (v2)?` + `Per Standing
  Instructions?` and their full vocabularies (§4), stating they are **ADDITIVE**
  (never change an observed verdict) and that **every value cites its spec
  gate/section**.
- **HEADLINE CONFORMANCE RESULT** — the tally (per-spec / DEVIATION / spec-silent /
  spec-inconsistent) and the release-relevant flags.

### 3.2 `Full Dual Matrix` (THE core grid)
**Row model:** one row per **population-member × capability** (reference: 11 staging
roles × ~16 capabilities = 176 data rows). **Header row is bold, white text on dark
blue fill `FF2F5496`, frozen conceptually as row 1.**

**Columns (exact order):**

| # | Header | Contents |
|---|--------|----------|
| 1 | `<EnvB> Role` (`Staging Role`) | population member in the NEW/target env |
| 2 | `<EnvA> role` (`Prod role`) | the env-A member it maps to (via the merge-map, §6) |
| 3 | `Capability` | the exact capability/control name (build-accurate wording, Rule 9) |
| 4 | `<EnvA>` (`PROD`) | observed value in env A: `SHOWN` / `HIDDEN` / `SHOWN`/`HIDDEN`+note |
| 5 | `<EnvB>` (`STAGING`) | observed value in env B |
| 6 | `Verdict` | dual verdict (§4 vocabulary), **color-filled** (§3.7) |
| 7 | `Caveat` | any per-cell caveat (e.g. "prod portal org-customer-portal gated") |
| 8 | `Per Spec (v2)?` | spec-conformance annotation (§4), citing the exact gate/section |
| 9 | `Per Standing Instructions?` | standing-rule conformance annotation (§4), citing the rule |

Columns 4/5 use the value vocabulary `SHOWN` / `HIDDEN` (adapt to the capability:
`GRANTED`/`DENIED`, `200`/`403`, `present`/`absent` — keep it binary + observed).

### 3.3 Per-capability "… LIVE" tabs (deep evidence grids)
Row 1 = a wide **title/method banner** (bold), describing the exact control, how it
was observed live in both envs, and the seeding used. Row 2 = the header. Columns
(reference `Parts-Module Dual LIVE` / `New-WO Create Dual LIVE`, 13 cols):

`<EnvB> Role` · `<EnvA> role compared` · `Capability` · `<EnvA> observed` ·
`<EnvB> observed` · `Direction / verdict` · `Per-spec?` (short yes/no) ·
`Confidence` (`DUAL LIVE-OBSERVED`) · `Method` (how each env observed) ·
`<EnvA> screenshot` (absolute path) · `<EnvB> screenshot / Notes` ·
`Per Spec (v2)?` · `Per Standing Instructions?`

Simpler capability tabs (`Approve-Decline LIVE`, 7 cols) use:
`<EnvB> Role` · `<EnvA>` · `<EnvB>` · `Dual verdict` ·
`Evidence / method (observed-only)` (evidence file paths) ·
`Per Spec (v2)?` · `Per Standing Instructions?`

### 3.4 Per-pass "LIVE" tabs
Row 1 = a banner naming the pass, the date, what residuals it CLOSED, and
"OBSERVED-LIVE only; never inferred (Rules 10/12)." Below it, the same
role × capability + dual-verdict + two-annotation columns for the rows that pass
closed.

### 3.5 `<EnvB> Live Grid` (raw per-role snapshot)
One row per role in the new-model env; columns are the raw controls observed on one
representative screen plus a **`Screenshot`** column holding the **absolute evidence
path**. Reference `Staging Live Grid` columns: `Staging Role` · `Perms` (perm count) ·
`View` · `Send to Portal` · `See Fin Data` · `New Line` · `Reviewed` · `Line ⋮` ·
`Finance tab` · `Screenshot`.

### 3.6 `Spec-Standing Conformance` (summary + deviation register)
- Row 1 title; rows 2–3 note the annotations are additive and observed verdicts
  unchanged.
- **TALLY block:** `Bucket | Count | Meaning` for the four buckets (§4).
- **KEY SIGNAL** one-liner (e.g. "migration is largely faithful").
- **Release-relevant DEVIATIONS / flags** table:
  `Tab | Role | Capability | Direction | Why (spec judgement)` — one row per
  non-per-spec cell, each citing the spec gate it violates.
- **SPEC-INCONSISTENT / AMBIGUOUS** table: `Role | Capability | Direction | Note`
  (both conflicting spec citations, flagged not resolved).
- **SPEC-SILENT** paragraph listing every capability the spec doesn't address (so
  silence is explicit, never inferred).

### 3.7 Formatting conventions (mirror exactly — Rule 16)
- **Header cells:** bold; grid-header fill `FF2F5496` (dark blue) with white font on
  the observed columns (cols 1–7 in Full Dual Matrix); annotation-column headers
  (8–9) bold, no fill.
- **Verdict-cell (col 6) conditional fill by category:**
  - `MATCH` (incl. `MATCH (both hidden)`) → **green `FFC6EFCE`**
  - `STAGING-MORE` / `<EnvB>-MORE` (any variant) → **peach/orange `FFFCE4D6`**
  - `STAGING-LESS` / `<EnvA>-MORE` → **red `FFFFC7CE`**
  - (yellow `FFFFF2CC` was used for a few org-config edge rows — optional)
- **Column widths (Full Dual Matrix, approx):** Role 20, prod-role 24, Capability 34,
  env cols 10–13, Verdict 24, Caveat 42, `Per Spec` 60, `Per Standing` 13.
- Banner/title rows are a single merged-look wide cell (value in col A, rest `None`).

---

## 4. VERDICT & CONFORMANCE VOCABULARY (define every term)

### 4.1 Dual verdict (col 6) — generalize env names
- **`MATCH`** — both envs show the SAME state (control present in both, or hidden in
  both → `MATCH (both hidden)`).
- **`STAGING-LESS`** = **`<EnvA>-MORE`** — env A (prod) has the capability, env B
  (staging) does NOT → a **loss** in the target env (release-risk if unintended).
- **`STAGING-MORE`** = **`<EnvB>-MORE`** — env B has the capability, env A does NOT →
  a **grant** in the target env.
- Suffix a parenthetical when the difference is a **config/org gate, not a role
  difference** (e.g. `STAGING-MORE (ORG-CONFIG, not role: staging org has a terminal
  device, prod org has none)`).
- **Generalized:** for an arbitrary A-vs-B pair use **`ENV-A-MORE` / `ENV-B-MORE` /
  `MATCH`**; keep the "which env has more" semantics identical.

### 4.2 `Per Spec (v2)?` vocabulary (source = the canonical governing spec)
- **`Per spec (matches)`** — MATCH row that agrees with the spec grant/withhold.
- **`Per spec — expected reduction`** — a `<EnvA>-MORE`/STAGING-LESS row where the
  spec does NOT grant that role the capability (the loss is intended).
- **`Per spec — expected grant`** — a `<EnvB>-MORE`/STAGING-MORE row where the spec
  DOES grant it (the grant is intended).
- **`DEVIATION`** — the target-env state is the OPPOSITE of what the spec prescribes
  (spec grants but build hides, or build grants but spec withholds). Note
  `DEVIATION (gating model)` when the build gates the capability by a different
  mechanism than the spec (e.g. org-device presence vs a role toggle).
- **`Spec silent — not addressed`** — the spec has NO rule for this capability
  (stated explicitly, never inferred).
- **`Spec inconsistent/ambiguous`** — the spec contradicts itself for this
  role/capability; cite BOTH conflicting sections, flag, do not resolve by inference.
- **`Org-device config gate`** (or the relevant external-gate label) — the A-vs-B
  difference is org-config, not a role/migration delta.
- **Every value CITES the exact spec gate/section** it was judged against.
- **MATCH rows are STILL judged** — identical behavior in both envs can still deviate
  from spec (Standing Rule 15.4).

### 4.3 `Per Standing Instructions?` vocabulary (source = documented design rules)
- **`Consistent with standing rule: <which>`** — target env matches a documented
  permission-design rule (rule cited).
- **`Conflicts with standing rule: <which> (<why>)`** — contradicts a documented rule.
- **`No standing rule addresses this`** — no documented rule covers the capability.

### 4.4 Conformance tally buckets (the `Spec-Standing Conformance` tab)
`Per spec — expected / matches` · `DEVIATION` · `Spec silent — not addressed` ·
`Spec inconsistent / ambiguous`. Counts must reconcile to the annotated row total
across all tabs.

---

## 5. METHOD — how every cell is filled (cross-ref, do NOT duplicate)

- **Live-observed-with-evidence process:** follow
  **`build/PROD-VS-STAGING-COMPARE-METHOD.md`** end-to-end — env auth (§1), the
  node/Chromium proxy gotcha (§2), per-role observation techniques a→b→d, never c
  (§3), classifying API errors as evidence (§4), seeding recipes (§5), the role
  merge-map (§8), and how-to-resume (§9).
- **Governing non-negotiables (Standing Rules 12/13/14):** every cell **LIVE-OBSERVED
  with evidence captured THIS run** (screenshot and/or captured API response); never
  inferred from spec, source, role defs, `fe_permissions`, or atoms; **ZERO cells
  "NOT VERIFIED"** — SEED any missing data-state and observe it; the ONLY permissible
  non-plain-observed cell is a genuine external dependency (e.g. physical terminal
  hardware) and even then it is a **fully-characterized labeled gate**, never the bare
  text "NOT VERIFIED."
- **Spec-conformance annotations (Standing Rule 15 + METHOD §10):** derive the two
  annotation columns from a **VERBATIM cited spec truth table** (pattern:
  `build/custom-roles-run/spec-conformance/spec-truth-table.md`) built straight from
  the CANONICAL spec doc with all change-log entries applied (latest-wins) — never
  from a prose extract. Re-derive every annotation from the truth table, then run an
  **adversarial self-audit diff** (full population for release-critical work) and ship
  only after the diff is empty.
- **Format mirroring (Standing Rule 16):** match the established file's schema 1:1.

---

## 6. PARAMETERS (what changes per request)

| Parameter | What to establish | Reference value (Custom Roles run) |
|---|---|---|
| **Environments (2 or N)** | the A-vs-B (or N-way) pair + how to auth each LIVE | Prod `app/api.shopview.com` (self-login `POST /api/login`); Staging `app/api.staging.shopview.com` (`quick-login`) — METHOD §1 |
| **Population** | what is compared per row — roles, entity types, or features | 11 staging system roles |
| **Capability / permission list** | the exact controls, build-accurate names (Rule 9) | ~16 caps (Send to Portal/Terminal, New Line, Order Parts, Review WOs, See Fin Data, …) |
| **Governing spec** | the canonical doc for the conformance columns | CustomRoles spec v2 (SV-7388, Sasha Grosman) → truth table |
| **Merge-map** | how env-A names map to env-B names when they differ | METHOD §8 (prod legacy → staging new-model) |
| **Evidence root** | `live-ui-<date>/{<envA>,<envB>}/<member>/` | `build/custom-roles-run/live-ui-2026-07-15|16/` |

If any parameter is missing, STOP and ask (Standing Rule 1). Enumerate the FULL
population/capability set and state the totals before authoring (Standing Rule 17).

---

## 7. BUILD STEPS (repeatable checklist)

1. **Establish live sessions** for every environment (§6 auth; secrets to `/tmp`
   only; `NODE_USE_ENV_PROXY=1`; fresh Chromium MITM bridge if driving UI).
2. **Build the capability list** and the population list; state the exact totals
   (Rule 17). Build the **merge-map** if env names differ.
3. **Build the VERBATIM spec truth table** from the canonical spec (all change-log
   applied, latest-wins), each value cited — commit it under `spec-conformance/`.
4. **Observe each cell LIVE** per population-member per env, using METHOD §3
   technique a→b→d (never c), seeding any missing data-state (METHOD §5) and
   capturing evidence under `live-ui-<date>/{<env>}/<member>/` (screenshot + JSON).
5. **Classify each dual verdict** MATCH / `<EnvA>-MORE` / `<EnvB>-MORE` (§4.1);
   caveat org/external gates.
6. **Add the two conformance columns** from the truth table (§4.2/§4.3), each citing
   its gate/section; judge MATCH rows too.
7. **Build the summary/deviation tab** (§3.6): tally + DEVIATION register +
   spec-inconsistent + spec-silent lists; reconcile counts.
8. **Adversarial self-audit** (Rule 15): independently recompute the calls
   (full population for release-critical) and diff; fix at all layers (extract,
   generator, workbook) until the diff is empty.
9. **Regenerate the workbook + narrative `.md`** via the generator script; write the
   READ ME honesty sheet; supersede any inference-tainted prior with a banner.
10. **EXEC/QA companions if asked** — mirror the established exec/QA generators
    (`gen_exec_release_readiness.py`, `gen_qa_prerelease.py`).
11. **Deliver** with GitHub raw download links; state the counts
    (total in scope / observed / excluded-with-reason) and the TestRail status
    (no TestRail writes without explicit permission).

---

## 8. QUALITY GATES (all must pass before delivery)

- **ZERO cells "NOT VERIFIED"** — every cell live-observed with evidence, or a
  fully-characterized labeled config/external gate (never bare "NOT VERIFIED").
- **Evidence per cell** — screenshot and/or captured response path recorded this run.
- **Tallies reconcile** across the Full Dual Matrix, the per-capability/pass tabs,
  and the `Spec-Standing Conformance` tally.
- **Independent adversarial verification CLEAN** — the conformance-column diff is
  empty before shipping (full-population re-audit for release-critical work).
- **Format matches** the established comparison workbook 1:1 (Rule 16); file name
  starts with `Comparison`.
- **No secrets committed**; disposable-env cleanup done (impersonations exited,
  seeded data deleted, roles/settings restored); no unauthorized TestRail writes.

---

## 9. EXAMPLE INSTANTIATION (worked reference)

The **Custom Roles prod-vs-staging** run is the canonical worked example of this
recipe:
- **Workbook:** `build/custom-roles-run/Prod-vs-Staging-LIVE-VERIFIED-2026-07-14.xlsx`
  (10 tabs; Full Dual Matrix = 176 cells, MATCH 130 / STAGING-MORE 26 /
  STAGING-LESS 20; conformance 276 per-spec / 7 DEVIATION / 11 spec-silent /
  3 spec-inconsistent across 297 annotated rows).
- **Narrative:** `build/custom-roles-run/Prod-vs-Staging-LIVE-VERIFIED-2026-07-14.md`.
- **EXEC file:**
  `build/custom-roles-run/CustomRoles_Release-Readiness_Prod-vs-Staging_EXEC_2026-07-16.xlsx`
  (+ `..._EXEC-SUMMARY_2026-07-16.md`).
- **QA file:** `build/custom-roles-run/CustomRoles_QA-PreRelease-Checklist_2026-07-16.xlsx`.
- **Generators:** `gen_prod_vs_staging.py`, `gen_parts_dual.py`, `gen_newwo_dual.py`,
  `gen_remaining_caps.py`, `add_spec_standing_columns.py`, `fix_spec_annotations.py`
  (all under `build/custom-roles-run/`).
- **Spec truth table:** `build/custom-roles-run/spec-conformance/spec-truth-table.md`.
- **Method doc:** `build/PROD-VS-STAGING-COMPARE-METHOD.md`.
- **Evidence dirs:** `build/custom-roles-run/live-ui-2026-07-15/`,
  `live-ui-2026-07-16/`, `compare-evidence-2026-07-14/`,
  `staging-ui-verify-2026-07-14/`.
- **Resume doc:** `build/custom-roles-run/PROD-VS-STAGING-STATE-2026-07-14.md`.
