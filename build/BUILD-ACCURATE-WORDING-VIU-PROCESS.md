# Build-Accurate Wording + VIU Process (reusable, cross-project)

> **A repeatable method to make every test case build-accurate + layman-friendly AND
> VIU-verify its behavior, then sync the corrected cases to TestRail — area by area.**
> First proven on **Fees & Discounts** (2026-07-13; all 183 cases, all pushed, 0 errors).
> **Apply this to any project (Fees & Discounts / Simple Flow / Custom Roles / future) ONLY
> WHEN THE USER ASKS.** Ties directly to **CLAUDE.md Standing Rule 9** (build-accurate,
> layman-friendly wording) and Standing Rules 6/8/9 (TestRail is the only real system;
> per-day authorization; TestRail Case ID + Link columns in deliverables).

---

## Purpose

Deliver test cases a **new, non-technical manual tester** can run with zero prior context:
- Every **Title / Preconditions / Steps / Expected** uses the **EXACT** on-screen build
  labels (button/tab/dialog/field/toast/menu text), taken directly from the live build —
  never invented, paraphrased, or guessed — in plain layman English.
- Every case is **VIU-verified** (behavior exercised live) with a one-line evidence note
  and a `fresh_run` date.
- The corrected wording + status is **synced to TestRail** (update_case only), with a
  per-case audit log, so TestRail matches the source of truth.

---

## Preconditions (before starting a run)

1. **Fresh env cookies in `/tmp` only** — never in the repo; `chmod 600`. Re-supply per
   session (they are ephemeral). Confirm the domain/host matches the target project's env.
2. **Confirm backend health** — wake the env if it sleeps, then poll the API root for 200.
   If every request 500s, mint a fresh session (poisoned-shared-session fix per the
   project's playbook).
3. **Per-project TestRail authorization from the user** — get **explicit, fresh one-day
   write authorization** BEFORE any push. The rule: **never write to TestRail without
   explicit user permission** (TestRail is the only real/production system).
4. **Re-derive the live roles matrix FIRST** if any permission/role cases are in scope —
   shared envs **drift** (e.g. Technician gaining/losing perms). Capture the fresh matrix
   to a dated file (`roles-matrix-<date>.md`) before writing/adjudicating any
   permission-gated case; note any drift that makes a negative case not testable.

---

## Method — area by area (checkpoint each area so it becomes "tester-ready")

Work **one functional area at a time** (an area = a TestRail leaf section / a case-ID
prefix, e.g. FD-WO, FD-CALC). For each area, do all five steps, then declare the area
tester-ready before moving on. This makes the run **resumable** at area granularity.

**(1) Capture EXACT build labels.**
Open the relevant build screen(s) **once**. Capture the exact on-screen text —
button/tab/dialog/field/toast/menu/column labels — into a **label glossary**
(`wording-glossary-<date>.md`) plus **screenshots** (`screenshots/wording-<date>/`).
Record the delta where the build wording differs from the old case wording.

**(2) Rewrite each case to those exact build terms, in plain layman language.**
Update Title / Preconditions / Steps / Expected of every case in the area:
- Use the **exact build labels** captured in step 1 (if a UI term is unavoidable, use it
  exactly as the build shows it).
- Numbered lines with line breaks (Preconditions / Steps / Expected each numbered).
- **NO "VIU" / "verified" wording** in tester-facing fields.
- **NO "Feature Flag ON" preconditions** (settings-driven preconditions are fine when the
  behavior is settings-driven).
- **Strip spec-ref / design jargon** (story IDs, §-refs, enum names, bug codes, HTTP terms
  from tester-facing fields).
- **Never invent** — if a term cannot be confirmed from the build, **FLAG it** rather than
  guess.

**(3) VIU the behavior — LIVE UI-OBSERVED, with evidence, never inferred.**
Exercise the case **live in the UI** and capture evidence **that run** (a screenshot
and/or the captured API response). For **permission/role** cases this means actually
logging in / driving the UI **AS the actual role** and **OBSERVING the control**, PER
role, PER environment — **never** inferred from role definitions, `fe_permissions`,
atoms, prior data, or source code. Set `viu_status` on the case JSON (Verified /
Deviation / Blocked-* / Pending) + a **one-line evidence note** + the
`fresh_run: <date>` stamp. A case is **Verified ONLY when its behavior was directly
observed live with evidence**; anything not directly observed is **Blocked / NOT
VERIFIED** with the reason stated — never silently derived and passed off as done. If
a live check cannot be completed (session/cookie expired, screen unreachable, env
down), **STOP** and report plainly what could not be verified and what is needed
(e.g. fresh cookies); do NOT substitute inference to appear complete. (This is
Standing Rule 12 — verified means observed, never inferred; it governs this step
absolutely.)

**(4) Commit the area, then push it to TestRail.**
- **Commit by explicit pathspec** (only the files you changed — rebase-safe; never
  `git add .`).
- Push the area to TestRail via **`update_case`** only:
  - **curl only** against `shopview.testrail.io`; **Basic auth from env / `/tmp` only**
    (never hard-code or commit credentials).
  - Loop: **GET current case → diff → update only changed fields → re-verify 200/200**.
    **Skip no-ops** (don't rewrite unchanged cases).
  - **Respect the API-section rule** (Standing Rule 4): any case with API endpoints / HTTP
    methods / status codes / backend request-response checks stays in an **API-titled
    section**; UI-only cases stay in their functional sections.
  - Append a **per-case audit log** (`testrail-wording-viu-log.md`): what changed, status,
    push result (e.g. "N updated · 0 error").

**(5) Report the area as tester-ready.**
State the area's per-status counts and that its cases are wording-corrected + VIU'd +
pushed.

---

## Traceability = authenticity (Standing Rule 20)

Every case created / VIU'd / updated must be provably linked to (a) its Jira ticket(s) and
(b) its spec section, so its existence and its expected result are always justifiable. Keep
these in the **metadata/traceability layer, never the tester-facing fields**. The TestRail
case **References (`refs`)** field carries **BOTH together** in the format
**`<TICKET(S)> (<spec-anchor>)`** (e.g. `SV-7696 (S1-R3 (Vendor invoice Optional/Required))`,
`SV-7865 (§5-R3)`) — **per-story precision ALWAYS, and ticket-only is never acceptable (the
spec reference must never be dropped)**. Mirror the same combined value into the per-project
`testrail-id-map.csv` + coverage matrix; the audit log also records it. Tester-facing
Title/Preconditions/Steps/Expected stay jargon-free (Rules 7 & 9). Every change cites its
driving ticket (Done/Not-Done) + spec section in the audit log. A case with neither a ticket
nor a spec anchor is flagged missing-traceability, not left unsourced.

## Honesty rules

- **Leave genuine blockers blocked** with a **precise reason** — never fake a pass. Examples:
  - QuickBooks invoice line-item internals need a **human logged into QuickBooks** (no QB
    read API).
  - **Non-seedable data** (data you cannot create yourself in the disposable env).
  - **Env 500s** (e.g. line-create 500, unmap PUT 500) — record the endpoint + requestId.
- **Note anything a shared live tester prevents** — e.g. a flag-off window can't be taken
  while a manual tester is active on the shared env; a role negative isn't testable because
  the shared role has drifted. Record it as an action, not a fake result.
- Only mark **Verified** what you actually exercised (or re-validated with fresh evidence).

---

## Resume safety

- The **checkpoint is the committed `cases/*.json` `viu_status` + `fresh_run:<date>`** plus
  the **wording-viu audit log** (`testrail-wording-viu-log.md`).
- On resume, **skip areas already logged tester-ready for that run date** (the log lists
  each completed area with `N updated · 0 error`).
- Because each area is committed by pathspec before the next starts, an interrupted run
  loses at most the in-progress area.

---

## Deliverables (regenerate at the end)

Regenerate the interim artifacts from the updated cases:
- **TestRail import CSV + XLSX** (`gen_import.py`) — VIU-word-free + feature-flag-free.
- **Blockers Tracker** (`gen_blockers.py`, `.md` + `.xlsx`) — the per-case source of truth.
- **Fresh-VIU results workbook** (`gen_fresh_viu_workbook.py`, `.xlsx` + `.csv`) — a tab per
  result status + a Summary tab.
- All case-listing deliverables **MUST keep the TestRail Case ID (C#####) column + a
  clickable TestRail Link** (`https://shopview.testrail.io/index.php?/cases/view/<id>`),
  sourced from the per-project `testrail-id-map.csv` (Standing Rule 8).

**ALWAYS state the TestRail update status explicitly in the final result** (per user rule)
— e.g. "all N cases pushed via update_case, 200/200, 0 errors" or "no TestRail write (not
authorized)".

---

## One-page checklist

1. Cookies in `/tmp` (chmod 600) · backend healthy · **fresh TestRail authorization** ·
   re-derive roles matrix if perms in scope.
2. For each area: capture labels + screenshots → rewrite Title/Precond/Steps/Expected to
   exact build terms (layman; no VIU/flag words; flag unconfirmables) → VIU + set
   `viu_status`/evidence/`fresh_run` → commit by pathspec → push via `update_case`
   (GET→diff→update→200/200; skip no-ops; API-section rule) + audit log → report
   tester-ready.
3. Leave real blockers blocked with precise reasons; note shared-tester limits.
4. Regenerate import + Blockers Tracker + results workbook (keep Case ID + Link columns).
5. **State the TestRail update status explicitly** in the final report.
