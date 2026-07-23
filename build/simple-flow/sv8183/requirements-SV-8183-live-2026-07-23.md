# SV-8183 — LIVE RE-PULL 2026-07-23 (Jira REST v3, authenticated session)

> **Fresh live pull** of Jira issue **SV-8183** via the REST v3 API
> (`GET /rest/api/3/issue/SV-8183?expand=renderedFields,names,changelog&fields=*all`
> + `/comment?expand=renderedBody`), using an authenticated Atlassian browser
> session (method: `build/ATLASSIAN-JIRA-ACCESS-METHOD.md`; `/myself` → HTTP 200).
> **Pulled-live date:** 2026-07-23
> **Canonical Jira key:** SV-8183 (Epic **SV-7301**)
> **PO:** Milos (Milos Vasic) — never mix PO attributions
> **Reference pointer only (do NOT fetch):**
> `https://shopview.atlassian.net/browse/SV-8183`
> **Prior ingest compared against:** `requirements-SV8183_1.md`
> (2026-07-22 export) + `scope-analysis-2026-07-22.md`.
> This is a source-of-truth snapshot of the live pull — do not edit.

---

## Header / metadata (live)

- **Key:** SV-8183
- **Summary:** Permission: Simple Flow — enforcement mapping to existing WO / Parts / Settings atoms
- **Type:** Story
- **Status (LIVE):** **Blocked**  *(was TESTING QA at the time of the prior 2026-07-22 export; see workflow trail below)*
- **Resolution:** None (Unresolved) · **Resolution date:** none
- **Parent (Epic):** SV-7301 — Simple Mode — Streamlined Work Order Completion & Bulk Receiving
- **Reporter:** Milos Vasic · **Assignee:** Dipesh Changawala
- **Labels:** `simple-mode`
- **Fix versions:** none
- **Created:** 2026-07-07 · **Updated (LIVE):** 2026-07-23T03:03 (driven by Sasha Grosman's new comment)
- **Attachments:** **0** (unchanged — the ticket has never carried attachments)

### Workflow status trail (from live changelog)

| When | Who | Transition |
|---|---|---|
| 2026-07-09 08:46 | Milos Vasic | Open → In Progress |
| 2026-07-22 06:05 | Dipesh Changawala | In Progress → Ready for QA |
| 2026-07-22 13:29 | Ayesha Khan | Ready for QA → TESTING QA |
| 2026-07-22 18:46 | Ayesha Khan | **TESTING QA → Blocked** |

---

## Substantive spec content — UNCHANGED vs prior ingest

The two substantive tables and the acceptance criteria in the live pull are
**identical** to `requirements-SV8183_1.md` (the full verbatim content lives
there — not duplicated here to avoid drift):

- **Action → Story → Gated-by-atom table** — 17 action rows, identical.
- **Resulting per-role behavior matrix** — 11 roles × 10 capability columns,
  identical (Admin/Svc Mgr/Sr SA/SA/Foreman/Parts Mgr = full; Technician,
  Parts Tech, Office, Sales Rep, Time Clock restricted per notes 1–4).
- **Acceptance criteria** — 10 bullets, identical (incl. the NET-NEW
  "reviewer ≠ completer" hard rule that OQ-1 covers).
- **Drift / gaps found in code** — 3 bullets, identical (dropped `operatingMode`;
  missing `settingsIntegrations`; unguarded feature-flags route).
- **Core-rule / atom-collapse note** — identical (BE collapses `woOrderParts`,
  `workOrderLinesCreateAndEdit`, `woFullViewMode`, `woTechViewMode`,
  `workOrdersCreateAndEdit` → `ROLE_WORK_ORDER::VIEW + CREATE_AND_EDIT`;
  FE distinctions are conveniences, not BE-enforceable — SV-7864).

---

## Comments (live, in order)

### 1. Dipesh Changawala — 2026-07-10 (UNCHANGED, already in prior ingest)

> Looked into the enforcement concern: The UI blocks it correctly (Complete WO,
> Order Parts, etc. are hidden from roles that shouldn't have them). The backend
> also checks a permission on every endpoint — nothing is open — but that
> permission ("Work Orders: Create & Edit") is grouped in the same bundle as
> several other permissions, so every role ends up holding it. So through the UI
> it's blocked, but a direct API/cURL call outside the app would still pass the
> backend check. This isn't specific to Simple Mode — the existing Work Order
> create endpoint checks the same permission; a Technician can already hit it via
> a direct API call today. Simple Flow just behaves like the rest of the app.

*(Confirms BE enforcement is FE-only — already captured by SF-PERM-06/C29410.)*

### 2. Sasha Grosman — 2026-07-23T03:03 (**NEW** since the prior ingest)

> Assigning to myself to review Thursday.

*Administrative only — no spec/matrix/AC content. A reviewer self-assignment
note; it does not change any requirement.*

---

## DELTA vs prior ingest (`SV8183_1`, 2026-07-22)

**Verdict: NO SUBSTANTIVE SPEC CHANGE.** The permission model — the action→atom
table, the 11-role capability matrix, and all 10 acceptance criteria — is
**unchanged**. The only differences are metadata/workflow refreshes:

1. **Own status advanced → Blocked.** SV-8183 moved Ready for QA → TESTING QA →
   **Blocked** on 2026-07-22 (Ayesha Khan, 18:46), i.e. AFTER the prior 2026-07-22
   export was taken (which captured it as TESTING QA / "Unresolved"). The block
   reason is not stated in the ticket body/comments.
2. **One NEW comment** — Sasha Grosman, 2026-07-23: "Assigning to myself to review
   Thursday." Administrative; no requirement impact.
3. **Updated date** now 2026-07-23 (driven by that comment).
4. **Attachments:** still 0 (nothing new to download; Rule 17 — full set
   enumerated and empty).
5. **Related-ticket statuses:** as recorded in the prior ingest/scope-analysis
   (SV-7388/8095/7820/7864 Done; SV-7870 & the SV-7696…7710/SV-7876 story set
   Blocked; SV-7301 In Progress) — no further advancement observed.

**Consequences for our suite: none required.**
- **OQ-1 (self-review / reviewer ≠ completer)** remains **RESOLVED by the user
  2026-07-22 = self-review ALLOWED** (last-update-wins over the SV-8183 AC's
  NET-NEW reviewer ≠ completer rule). The live pull re-asserts the same AC text
  but adds no new decision, so the user's ruling stands; no case edits.
- The Dipesh dev comment (BE = FE-only) is unchanged and already captured by
  SF-PERM-06 (C29410).
- No new attachments, no matrix/AC edits → no re-authoring, no TestRail writes.

**The only genuinely new fact is the workflow status (now Blocked) + Sasha's
self-assignment to review** — relevant as status/timeline context for the upcoming
VIU, not a spec change.
