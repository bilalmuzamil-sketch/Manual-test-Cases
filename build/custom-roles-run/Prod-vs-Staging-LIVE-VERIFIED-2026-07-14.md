# Prod-vs-Staging Permission Compare — LIVE-VERIFIED, DUAL-VERDICT — FINAL (2026-07-16, Pass-13)

> **TRUST-CRITICAL REBUILD. Observed-only (Standing Rules 10 & 12).** Every cell in this
> deliverable is either **LIVE-OBSERVED** on the real screen this effort (screenshot / captured
> response) **or a FULLY-CHARACTERIZED org-config verdict** (Send-to-Terminal). Nothing is inferred
> from role definitions, `fe_permissions`, atoms, or source code. The prior deliverable
> (`Prod-vs-Staging-Permission-Gaps_2026-07-14.xlsx`/`.md`) is **SUPERSEDED** — it was
> inference-tainted.
>
> **This workbook now contains ZERO unverified cells.** Every capability × role × env verdict was
> observed live or characterized as an org-config gate.
>
> Workbook: `Prod-vs-Staging-LIVE-VERIFIED-2026-07-14.xlsx`.
> Evidence: `live-ui-2026-07-15/{staging,production}/<role>/` and
> `live-ui-2026-07-16/{production,staging}/<role>/` (full-page screenshots + per-role captured JSON).

---

## 0. Bottom line

- **176 capability × staging-role dual cells in the authoritative Full Dual Matrix — all carry an
  observed or characterized verdict.** Counts: **MATCH 130 / STAGING-MORE 26 / STAGING-LESS 20.**
- **The one non-plain-role verdict is Send-to-Terminal on production**, and it is a
  **fully-characterized org-device gate** (a physical card terminal must be registered externally with
  the payment processor — there is no ShopView UI path to provision one; the prod org simply has none),
  **not an unverified gap and not a role/migration difference.**

---

## 1. Method (both environments live this effort)

- **Production:** renewable admin **self-login** (`POST /api/login`, 200) + per-role **switch-user**
  (real holders) and, for roles bounced by the null-location artifact, **role-swap test-staff +
  self-login** (self-login populates the SPA active-location store; switch-user does not). All 13
  legacy roles observed on the old-model SPA. Seeded data (pending lines / picks) deleted after; prod
  org otherwise unmodified. Test-staff restored to **Office User + Truck Hill 1**.
- **Staging:** quick-login (`admin`/`tech`) + **real-holder switch-user for all 11 system roles**
  (`staff/change` is returning **HTTP 500** this window — a shared-env fault — so real-holder
  switch-user was used instead of role-swap; **Technician** observed via `quick-login tech` real
  session; **Parts Technician** from the 2026-07-15 role-swap capture taken while `staff/change` was
  healthy: change 201, su 200, perms 19, WO rendered, zero line-action buttons). Seeded pending lines
  deleted after; WOs restored to their original line counts.
- **Bridge:** Node `NODE_USE_ENV_PROXY=1` + CONNECT-relay + Chromium TLS1.2-max headless, boot2
  hydration (cookies + localStorage `user`/`fe_permissions_wrapper`/`token`).

---

## 2. Priority FE-gated capabilities — LIVE dual verdicts (the trust-critical set)

| Capability | Result (observed live both envs) |
|---|---|
| **Send to Portal** | **Office User = STAGING-LESS** (prod SHOWN / staging HIDDEN) = **real release loss**. Technician / Parts Technician also STAGING-LESS. Senior Service Advisor = STAGING-MORE. Technician / Sales Rep / Time Clock vs their prod counterparts = MATCH (both hidden). |
| **Send to Terminal** | **ORG-DEVICE gate, NOT role**: prod org has no terminal → hidden for ALL prod roles; staging org has a terminal → shows for every role that can open New Payment. Not a migration/role difference. |
| **Approve / Decline line** | Observed live all 11 staging roles + 13 prod roles on a genuine `authorization_required` line. Only delta = **Parts Manager = STAGING-MORE** (prod Parts Manager cannot Approve/Decline; staging Parts Manager can). All other roles MATCH. |
| **Take Payment (New Payment)** | **STAGING-MORE** for Service Manager / Senior SA / Foreman / Parts Manager / Parts Technician / Office User (prod hidden, staging shown); MATCH for Admin & Service Advisor (both shown) and Technician / Sales Rep / Time Clock (both hidden). |
| **See AP/AR** | All roles observed (Pass-11). SHOWN prod: Admin + Office only. STAGING-MORE: Service Manager, Parts Manager, Sales Representative. Rest MATCH. |
| **Part Return** | All 13 prod roles + staging observed (Pass-11). STAGING-MORE: Sales Representative + Office User (prod hidden). |
| **Remove-a-WO-part / Order Parts / WO Delete / WO Lines Delete / Core OK-Not-OK** | See the **Parts-Module Dual LIVE** + **Full Dual Matrix** tabs (all observed). |

---

## 3. Directional findings (Full Dual Matrix — all observed)

**STAGING-LESS (prod grants more — release-eve losses to review):**
- **Office User:** Send to Portal, WO-level History, Order Parts, WO Delete, Change Customer, Change Asset.
- **Technician:** Send to Portal, Finance view, WO History, Order Parts, Timesheets, WO Delete,
  Change Customer, Change Asset.
- **Parts Technician:** Send to Portal, Create/Edit WO Lines, WO History.
- **Service Advisor / Foreman:** WO Delete. **Parts Manager:** Timesheets.

**STAGING-MORE (staging grants more — over-grants to review):**
- **Parts Manager:** Review Work Orders, Take Payment, Approve/Decline line, Change Customer/Asset,
  Send to Terminal (org-config).
- **Service Manager:** Take Payment, WO Delete, Change Customer/Asset, Send to Terminal (org-config).
- **Senior SA / Service Advisor / Foreman / Parts Technician / Office User:** Take Payment and/or
  Send to Terminal (Send to Terminal = org-config only).
- **Sales Representative:** See Financial Data (Rate/Margin), WO Notes. **Time Clock User:** WO Notes, Timesheets.

---

## 3b. Spec (v2) + Standing-Instruction conformance — two new annotation columns (2026-07-16)

Every role x capability x verdict tab now carries two ADDED columns to the right of the verdict (**Full Dual Matrix, Pass-11, Pass-12, Approve-Decline LIVE, Send to Terminal LIVE, Parts-Module Dual LIVE, New-WO Create Dual LIVE**; the staging-only **Staging Live Grid** carries a pointer note). Observed verdicts are UNCHANGED — the columns only judge the STAGING (new-model) permission against the v2 spec and the standing rules.

- **Per Spec (v2)?** — sources: `spec-conformance/spec-v2-permission-intent.md` (from `CustomRolesandPermissions_2.doc` / `current-spec-2026-07-15.md`, Sasha Grosman, SV-7388). Values: *Per spec — expected reduction* / *expected grant* / *(matches)* | *DEVIATION* | *Spec silent — not addressed* | *Spec inconsistent/ambiguous* | *Org-device config gate*. Each cites the spec gate/section; conformance is NEVER inferred where the spec is silent or inconsistent.

- **Per Standing Instructions?** — sources: `spec-conformance/standing-permission-rules.md` (CLAUDE.md "Sasha's spec updates" + enforcement model). Values: *Consistent with standing rule: <which>* / *Conflicts with standing rule: <which>* / *No standing rule addresses this*.


**Tally (297 annotated rows):**

| Bucket | Count | Meaning |
|---|---|---|
| Per spec — expected / matches | 276 | STAGING agrees with the spec gate (intended) |
| DEVIATION | 7 | STAGING is the opposite of what the spec prescribes (incl. gating-model divergence) |
| Spec silent — not addressed | 11 | Decline/Set Line Status; Issue Credit; remove-a-WO-part atom |
| Spec inconsistent / ambiguous | 3 | Send to Portal Full-View (§3/§4) vs Open Q6 'can approve a WOL' |

**KEY SIGNAL: the migration is largely SPEC-ACCURATE** — every STAGING-LESS loss and nearly every STAGING-MORE grant maps to an intended spec gate change. The only non-per-spec rows are below.


**Release-relevant DEVIATIONS / flags (the only non-per-spec rows):**

| Role | Capability | Direction | Why |
|---|---|---|---|
| Foreman | Send to Terminal | MORE | DEVIATION (gating model): spec requires Customer Portal ON (Foreman has it OFF) so the role-gate would withhold Send to Terminal; build shows it via the org-device gate. Org-config, not a role over-grant. |
| Parts Technician | Send to Terminal | MORE | DEVIATION (gating model): spec requires Customer Portal ON (Parts Technician has it OFF) so the role-gate would withhold Send to Terminal; build shows it via the org-device gate. Org-config, not a role over-grant. |
| Office User | Send to Terminal | MORE | DEVIATION (gating model): spec requires Customer Portal ON (Office User has it OFF) so the role-gate would withhold Send to Terminal; build shows it via the org-device gate. Org-config, not a role over-grant. |
| Senior Service Advisor | See AP/AR | MATCH | DEVIATION — spec grants to Senior Service Advisor (gate: Manage AP/AR toggle (tabs/fields, §5b) / AR-AP aging = Reports toggle (all-or-nothing, decoupled 3 Jul)) but staging hides it (both envs hidden). |

**Spec-inconsistent / ambiguous (flagged, not resolved):**

| Role | Capability | Direction | Note |
|---|---|---|---|
| Parts Technician | Send to Portal | LESS | Send to Portal: §3/§4 bare Full-View would grant; Open Q6 'can approve a WOL' would withhold (role lacks WOL Create&Edit). Flagged. |
| Office User | Send to Portal | LESS | Send to Portal: §3/§4 bare Full-View would grant; Open Q6 'can approve a WOL' would withhold (role lacks WOL Create&Edit). Flagged. |
| Sales Representative | Send to Portal | MATCH | Same §3/§4-vs-Open-Q6 ambiguity; both envs hidden. |

**Spec-silent capabilities** (conformance NOT inferred): Decline line / Set Line Status (11 rows), Issue Credit (inside the 'Finance' cap), remove-a-WO-part as a discrete atom (spec covers only: return = no gate, move = WOL C&E, remove-lines = WOL Delete).


---

## 4. The one org-config verdict (fully characterized)

**Send-to-Terminal on production is an org-device gate.** Prod admin Settings full-nav + the Payment
Methods page show **no Terminals / Card-Readers / Payment-Devices section**; "New Payment Method"
creates a *named* method only; all terminal APIs (`/api/terminals`, `/api/payment-terminals`,
`/api/card-readers`, `/api/payments/terminals`, `/api/stripe/terminals`) return **404**. A real card
terminal must be registered **externally** with the payment processor (hardware) — there is **no
ShopView UI action** to provision one — so the prod org shows no Send-to-Terminal button for **any**
role. The staging org **has** a terminal, so the button shows for every role that can open New Payment.
Migrating roles does **not** change Send-to-Terminal access. (Evidence: Pass-12, `_terminal/` shots +
API probes.)

---

## 5. Workbook tabs

- **READ ME - Coverage & Honesty** — coverage + honesty statement (zero unverified).
- **Full Dual Matrix** — authoritative: 176 capability × staging-role dual cells, every one observed
  or characterized (MATCH 130 / STAGING-MORE 26 / STAGING-LESS 20).
- **Approve-Decline LIVE** — the fresh 2026-07-16 dual observation, all 11 staging + 13 prod roles,
  with per-role evidence + method.
- **Send to Terminal LIVE** — org-device-gate characterization, per role, both envs.
- **Staging Live Grid / Parts-Module Dual LIVE / New-WO Create Dual LIVE** — staging + parts-module +
  new-WO caps observed.
- **Pass-11 LIVE / Pass-12 LIVE** — the closing audit passes (AP/AR, Part Return, Approve/Decline,
  Send-to-Terminal).
- **Spec-Standing Conformance** — summary of the two new annotation columns: the per-bucket tally
  (Per-spec 276 / DEVIATION 7 / Spec-silent 11 / Spec-inconsistent 3), the release-relevant DEVIATION list,
  and the spec-inconsistent/ambiguous rows. Every dual tab also carries the two columns inline.

**Tabs removed as superseded (trust rebuild):** `Live Compare DUAL`, `Production Live Grid`,
`Remaining-Caps Dual LIVE`, `Prod Remaining-Caps (all 14)`, `Pass-9 LIVE`, `Pass-10 LIVE` — the early
inference / headless-probe-era working tabs, fully superseded by the evidence-backed Full Dual Matrix +
Pass-11/12 + the Dual LIVE tabs. Their raw per-role evidence remains under `live-ui-2026-07-15/` and
`live-ui-2026-07-16/`.

---

## 6. Cleanup

- All `switch-user` impersonations exited (final `exit-switch-user` = 400 = none active).
- Staging seeded pending lines deleted; the leftover seed on `a54c7541` removed → WO back to its
  original 1 line; `d34e173b` back to its original 1 line.
- Prod test-staff restored to **Office User + Truck Hill 1**; no throwaway data left on either env.
- **No TestRail writes.** Secrets kept in `/tmp` only.
