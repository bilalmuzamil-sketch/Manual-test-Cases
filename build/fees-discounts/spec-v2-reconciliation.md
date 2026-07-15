# Fees & Discounts V1 — Spec-v2 Reconciliation (Round-2 answers + new spec doc + Chris's changelog)

> **Purpose:** ingest + diff + reconcile the THREE new QA-lead inputs (2026-07-10)
> against our current baseline. **PROPOSAL ONLY** — this task edited **no**
> `requirements.md` body, **no** `cases/*.json`, and **no** TestRail. Everything
> below is a proposal for a later authorized editing pass.
>
> **Inputs ingested:**
> 1. Chris Ward's answers to our Round-2 questions — Google Sheet
>    → `chris-round2-answers-source.xlsx/.csv/.md`. **Result: sheet reachable, 4
>    questions match ours, but ALL 4 answers are BLANK (unanswered).**
> 2. New spec doc `49f38748-FeesDiscountsV1_2.doc` (successor to V1_1)
>    → text snapshot `spec-source-2026-07-10.md`.
> 3. Chris's changelog summary (4 items) — verified item-by-item against Input 2.
>
> **Baseline compared against:** `requirements.md` (built from V1_1),
> `spec-v1-reconciliation.md`, `PROJECT-STATE.md` §0.1, `PO-Questions-Round2.md`,
> `jira-bug-drafts.md`, `cases/*.json` (182 cases).

---

## 0. Headline conclusions

1. **Chris has NOT answered Round-2.** The sheet loads and its 4 questions are a
   verbatim match to ours, but the "Your answer" column is empty. **The §0.1
   action map cannot be applied; the project stays PAUSED on this input.** (§A.)
2. **The new spec doc (V1_2) is a permissions + taxable-disclaimer pass.** It is
   NOT a calculation-contract or story-behavior change. Its one dated Change-Log
   entry (2026-07-12, @chris/@claude) rewrites Story 13 and the permission
   phrasing in Stories 1/3/4/9/10/11, and adds §5-R15. (§B.)
3. **All 4 items in Chris's changelog are PRESENT in the new spec doc** —
   full verbatim coverage, no gaps. (§C.)
4. **One genuine BEHAVIOR change lands: history-log gating.** WO-level history now
   requires **Work Orders: Create and Edit** (was **View History Logs**); line
   history requires **Work Order Lines: Create and Edit**. This flips the expected
   result on our history-permission cases and needs a live re-VIU. (§B2, §D, §E.)
5. **The permission model is now bound to exact Custom Roles (SV-7388) names**
   inline in every story, and the S13-R11 translation table is DELETED. Our
   `requirements.md` §10.2 still carries that table and the old euphemisms — the
   FD-PERM-* suite wording needs a rewrite pass and a live permission re-VIU. (§E.)
6. **No literal "v73" marker exists** in the doc; version is tracked only by the
   Change Log. Epic status line moved **Open → In Progress**.

---

## A. Chris's Round-2 answers → §0.1 action map

**Sheet status: REACHABLE, questions MATCH ours, but ALL FOUR ANSWERS ARE BLANK.**
The "Your answer" cells (F5–F8) are empty; no comments, no other tab/gid. The
sanity-check passed on *question identity* (Q1 over-sized discount silent save; Q2
max cap of 0; Q3 tiny-% rounding; Q4 processing-fee minimum) — this is our sheet,
not a different question set — so per the brief I did **not** hard-stop; I recorded
the empty state and proceeded with the (independent) Inputs 2 and 3.

**Because there are no option choices, none of the §0.1 branches can be selected.**
For each question the resulting action is **HOLD — still pending Chris**:

| Q | Internal ref → cases | Chris's answer | Resulting action (unchanged from PAUSE) | Held ticket |
|---|---|---|---|---|
| **Q1** | FDBUG-15 → FD-QB-014 (companions FD-QB-012 / FD-QB-015) · [C28557](https://shopview.testrail.io/index.php?/cases/view/28557) | **BLANK** | HOLD. Cannot choose A (draft+file a new over-discount warning ticket, keep spec expected) vs B (case-update FD-QB-014 → silent-carry expected, flip Verified). FD-QB-014 stays **VIU-Deviation**. Potential new Q1 ticket stays **unwritten**. | (new ticket — only if Q1=A) |
| **Q2** | FDBUG-9 → FD-CALC-008, FD-VAL-006, FD-TMPL-011 · [C28575](https://shopview.testrail.io/index.php?/cases/view/28575)/[C28604](https://shopview.testrail.io/index.php?/cases/view/28604)/[C28512](https://shopview.testrail.io/index.php?/cases/view/28512) | **BLANK** | HOLD. Cannot choose A (0=no cap → case-update all 3, drop TICKET 4) / B (file TICKET 4 as drafted) / C (refuse 0 → revise TICKET 4). 3 cases stay **VIU-Deviation**. | **jira-bug-drafts TICKET 4 — HELD** |
| **Q3** | FDBUG-10 → FD-CALC-006 · [C28573](https://shopview.testrail.io/index.php?/cases/view/28573) | **BLANK** | HOLD. Cannot choose A (accept coercion, drop TICKET 5) / B (store-exact dev change) / C (file TICKET 5 as drafted). FD-CALC-006 stays **VIU-Deviation**. | **jira-bug-drafts TICKET 5 — HELD** |
| **Q4** | FD-PROC-014 (no FDBUG) · [C28532](https://shopview.testrail.io/index.php?/cases/view/28532) | **BLANK** | HOLD. Cannot choose A (support pfee minimums → spec/data-model change + new cases) / B (explicit reject / remove box → case-update FD-PROC-014). FD-PROC-014 stays **VIU-Verified w/ wording note**. | (optional low-sev tweak — only if Q4=B) |

**Net for §A:** nothing to action yet. **Re-ping Chris for the Round-2 answers.**
When they arrive, apply PROJECT-STATE §0.1 exactly (and request fresh one-day
TestRail authorization then).

---

## B. Input-2 spec delta (V1_2 vs our V1_1 baseline) — story-by-story

The diff is small and surgical: **§5 calc contract is UNCHANGED** (R1–R14 identical);
**no story's functional behavior changed** except history-log gating. All deltas are
permission-name substitutions plus the new §5-R15 disclaimer plus the history-gating
behavior change. Requirement IDs cited from the new doc.

### B1. NEW requirement — §5-R15 taxable jurisdiction note (advisory)

- **§5-R15 (NEW):** Below **every** Taxable control — the Add/Edit fee-or-discount
  dialog (S2-R26) and the Processing Fee dialog (S8-R11) — this EXACT text shows:
  *"Tax treatment varies by jurisdiction — confirm your local requirements before
  saving."* Plain advisory; explicitly **not** a UI instruction and **not** a
  legal-compliance statement.
- **S2-R26a (NEW):** the §5-R15 note shows below the Taxable dropdown in the Add/Edit
  dialog.
- **S8-R13 (REWRITTEN):** was a heavy "render exactly / do not translate without
  legal sign-off" legal-disclosure context note on the Processing Fee; now simply
  *"The Taxable jurisdiction note (§5-R15) shows below the Taxable setting."* The old
  legal block is **removed**.
- **Baseline gap:** our `requirements.md` has **no §5-R15**, and **no case** tests
  this disclaimer (0 "jurisdiction" hits across cases). → new cases needed (§D).

### B2. BEHAVIOR CHANGE — history-log gating (Story 10 / S13-R10)

- **S13-R10 (REWRITTEN):** *"Viewing a work order's history log … requires **Work
  Orders: Create and Edit**. Viewing an individual labor-line or part-line history
  requires **Work Order Lines: Create and Edit**."* (was: *requires **View History
  Logs**.*) The SFD-independence + set-rate note is retained.
- **Story 10 Prerequisites (REWRITTEN):** *"To view a work order's history log, the
  user has **Work Orders: Create and Edit**. To view an individual labor-line or
  part-line history, the user has **Work Order Lines: Create and Edit**."* (was:
  *"the user has the work-order history permission."*)
- **This is the only true behavior change** in the doc, and it INVERTS the expected
  result of our history-permission cases (which currently assert **View History
  Logs**). Affected: **FD-PERM-009, FD-HIST-006** (directly gate on View History
  Logs) plus the "View History Logs" wording in **FD-HIST-001/002/003/004/005/007/008,
  FD-FLAG-002** (10 cases total carry the phrase). → case-content updates + a live
  re-VIU (§D, §E).

### B3. Permission-name substitutions (exact SV-7388 names inline; no behavior change beyond wording)

| Story / rule | V1_1 baseline wording | V1_2 wording |
|---|---|---|
| **Story 1** prereqs (S1) | "the Work Order change permission" | **Work Orders: Create and Edit** *+ NEW* **See Financial Data** prereq added |
| S1-N2 | "Without the Work Order change permission…" | "Without **Work Orders: Create and Edit**…" |
| **Story 3** prereqs (S3) | view $ = "Work Order pricing-view permission"; change = "Work Order change permission" | view $ = **See Financial Data**; change = **Work Orders: Create and Edit** (whole-WO) **or Work Order Lines: Create and Edit** (labor/part line) |
| S3-R9 (3-dot menu, WO) | "…has the change permission" | "…has **Work Orders: Create and Edit**" |
| S3-R17 (3-dot menu, line) | "…has the change permission" | "…has **Work Order Lines: Create and Edit**" |
| S3-N4 | "Without the Work Order pricing-view permission…" | "Without **See Financial Data**…" |
| **Story 4** (Statistics) prereq (S4) | "Work Order pricing-view permission" | **See Financial Data** |
| **Story 9** (customer defaults) S9-R13 button | "…the customer change permission" | "…**Customer Management: Create and Edit** and **Manage Accounts Payable and Receivable**" |
| **Story 11** (Part Sale) prereqs (S11) | "Same as Story 1 — … the user has the Work Order change permission" | "…the user has **Part Sales: Create and Edit**, and the user has **See Financial Data**" (no WO permission) |
| **Story 13** S13-R2 | ends "…This is the 'pricing-view permission' named in Stories 3, 4, and 11." | trailing pricing-view sentence **removed** |
| S13-R4 | line-level = Work Order Lines: Create and Edit | + intentional note: "a user who can create a work-order line and has See Financial Data can add a line-level adjustment." |
| S13-R5 | "…a part adjustment on a Part Sale requires Part Sales: Create and Edit." | **expanded**: "…an adjustment on a Part Sale — **on the whole sale or on a part line** — requires **Part Sales: Create and Edit** (plus **See Financial Data**, S13-R6). Part-sale adjustments do not use any Work Order permission." |
| S13-R6 | (was implicit) | now explicit: **See Financial Data required to ADD, edit, or remove** any adjustment (not only edit/remove) |
| S13-R8 (templates) | Settings → Finance | **unchanged** (Settings → Finance) |
| S13-R9 (customer defaults) | Customer Management: C&E + Manage AP/AR | **unchanged** in substance (renumber only) |
| S13-R11 (translation table) | Full "earlier-story phrase → exact permission" table | **DELETED entirely** |
| S13-N2 | "Without the matching change permission…" | "Without the matching **Create and Edit** permission…" |
| Epic status line | "SV-7387 - Fees & Discounts **Open**" | "…**In Progress**" |

- **§5 calc contract:** confirmed **UNCHANGED** (R1–R14 byte-identical; §5-R15 is the
  only addition).
- **No "v73"** version token anywhere; only the Change-Log dates track versions.

---

## C. Input-3 — Chris's changelog vs the new spec doc (coverage table)

Verdict per item: **PRESENT / NOT-in-spec / PARTIAL**, with the spec line as evidence.

| # | Changelog item | Verdict | Evidence (quoted / located in `spec-source-2026-07-10.md`) |
|---|---|---|---|
| 1 | **History-log gating behavior change** (S13-R10 / Story 10): WO-level history now requires **Work Orders: Create and Edit** (was View History Logs); line history requires **Work Order Lines: Create and Edit** | **PRESENT** | S13-R10: *"Viewing a work order's history log … requires Work Orders: Create and Edit. Viewing an individual labor-line or part-line history requires Work Order Lines: Create and Edit."* + Story 10 prereqs rewritten identically. |
| 2a | Exact SV-7388 names: Story 1 → WO C&E + See Financial Data prereq | **PRESENT** | Story 1 prereqs now list both "The user has Work Orders: Create and Edit." and "The user has See Financial Data." |
| 2b | Story 3 → view $ = SFD; change = WO / WO Lines C&E | **PRESENT** | S3 prereqs: "See Financial Data to see any money values" / "Work Orders: Create and Edit … or Work Order Lines: Create and Edit … to add, edit, or remove"; S3-R9/R17/N4 aligned. |
| 2c | Story 4 (Statistics) → See Financial Data | **PRESENT** | Story 4 prereqs: "The user has See Financial Data." |
| 2d | Story 9 (customer defaults) → Customer Management: C&E + Manage AP/AR | **PRESENT** | S9-R13: "…button shows only to a user with Customer Management: Create and Edit and Manage Accounts Payable and Receivable." |
| 2e | Story 11 (Part Sale) → Part Sales: C&E + See Financial Data (was a WO permission) | **PRESENT** | S11 prereqs: "…the user has Part Sales: Create and Edit, and the user has See Financial Data." (WO permission removed.) |
| 2f | Story 13: R4 line-level note; R5 expanded to whole-sale AND part-line (both Part Sales C&E + SFD); R10 rewritten; **S13-R11 translation table DELETED**; N2 → "matching Create and Edit permission" | **PRESENT** | S13-R4 intentional note; S13-R5 "on the whole sale or on a part line … Part Sales: Create and Edit (plus See Financial Data)"; S13-R10 rewritten; **no S13-R11 table exists** in V1_2 (present in V1_1); S13-N2 "Without the matching Create and Edit permission…". |
| 3 | **See Financial Data required to ADD an adjustment** (not only edit/remove) | **PRESENT** | S13-R6: "To add, edit, or remove any adjustment, the user must also have See Financial Data on." Change-Log 2026-07-12: "See Financial Data is required to add an adjustment, not only to edit or remove one." |
| 4 | **NEW Taxable disclaimer §5-R15** (ref by S2-R26a + S8-R13): exact text *"Tax treatment varies by jurisdiction — confirm your local requirements before saving."*; advisory; replaces the old heavy legal block on Processing Fee (S8-R13) | **PRESENT** | §5-R15 verbatim; S2-R26a references it; S8-R13 rewritten to reference §5-R15; old legal-disclosure context note removed. |

**Coverage verdict: 100% — every changelog item is PRESENT in the V1_2 spec doc.
Nothing to flag as missing.** The Change-Log entry (2026-07-12) itself restates all
four items, confirming intent. (One nuance for the record: the changelog phrases
Story 1 as "WO C&E + See Financial Data prereq" — the doc does add the SFD prereq to
Story 1, matching.)

---

## D. Consolidated ACTION LIST (proposals — no edits made)

### D1. Case-content updates needed (wording → exact SV-7388 names; keep behavior)

- **FD-PERM-001** — replace "pricing-view permission" language with **See Financial
  Data** (matches S13-R2; drop the euphemism).
- **FD-PERM-003** — remove "Work Order change permission" euphemism; state **Work
  Order Lines: Create and Edit** (S13-R4).
- **FD-PERM-004** — remove "Work Order change permission"; state **Part Sales:
  Create and Edit + See Financial Data**, and clarify it now covers **whole-sale
  AND part-line** adjustments (S13-R5). (Also a Not-Built case today — Story 11
  absent — so this rewrite lands when Story 11 ships.)
- **FD-STATS-001..005 / Story-4 cases** — where the Statistics prereq is phrased as
  "pricing-view", change to **See Financial Data** (S4 prereq).
- **Story-1 add-toolbar cases (FD-WO-001 and the whole-WO add starting-place cases)**
  — add the **See Financial Data** prereq alongside **Work Orders: Create and Edit**
  (new Story-1 prereq).
- **FD-CUST / Story-9 cases + FD-PERM-008** — confirm wording = **Customer
  Management: Create and Edit + Manage AP/AR** (already matches; verify no euphemism
  remains).
- **requirements.md later-edit (separate authorized pass):** delete §10.2 (the
  S13-R11 translation table), inline the exact names in §10.1 and Stories 1/3/4/9/11,
  rewrite S13-R10 to the history-gating behavior, add §5-R15 + S2-R26a + rewrite
  S8-R13. **Not done here** (proposal only; another worker may be active).

### D2. Case-content updates needed — BEHAVIOR CHANGE (expected-result flip; re-VIU)

- **FD-PERM-009** (WO history-log gating) — expected changes **View History Logs →
  Work Orders: Create and Edit** for the WO-level log; add a **Work Order Lines:
  Create and Edit** clause for line history. **Needs a live re-VIU.**
- **FD-HIST-006** (history entries gated by View History Logs) — same flip; retitle
  to the C&E gate.
- **FD-HIST-001/002/003/004/005/007/008, FD-FLAG-002** — audit each "View History
  Logs" mention; where it states the *gate*, update to the new C&E gates; where it
  states SFD/flag independence, keep.

### D3. New cases needed

- **§5-R15 taxable disclaimer (UI-only → functional section):**
  - NEW case: disclaimer text shows verbatim below the Taxable dropdown in the
    **Add/Edit fee-or-discount dialog** (S2-R26a).
  - NEW case: same disclaimer below the Taxable setting in the **Processing Fee
    dialog** (S8-R13). (Story-8 builder UI is Not-Built today — case authored now,
    run when Story 8 ships.)
  - Assert exact string match; advisory (non-blocking, no legal wording). **UI-only
    → NOT an API section** (standing rule 4).
- **Permission re-mapping / SFD-to-add (may be API-titled section):**
  - Story-1 "**See Financial Data** required to ADD a whole-WO adjustment" — if the
    case asserts a backend 403/200 it belongs in an **API-titled** section (standing
    rule 4); if UI-gate-only, functional. (S13-R6 is stated as UI-screen-hidden, so a
    UI case is the natural fit; add an API-section variant only if we assert BE
    rejection.)
  - Story-11 whole-sale vs part-line Part-Sale adjustment gating (Part Sales: C&E +
    SFD) — author when Story 11 ships; API-titled section if it asserts 403/201.
- **History-gating negatives (likely API-titled section):**
  - "User WITH View History Logs but WITHOUT Work Orders: Create and Edit can no
    longer see the WO history log" and the line-history variant — these are exactly
    the behavior-change verification; if they assert BE/endpoint status they go in an
    **API-titled** section, else functional. (Note the documented enforcement caveat:
    the WO history endpoint has been **FE-only** in prior VIU — see §E.)

### D4. Re-VIU needed (live)

- **History-log gating (D2)** — must be re-verified live under the new gates. The
  Technician role has **DRIFTED** on the shared qb env (now has WO C&E + WO Delete),
  so **re-derive the roles matrix first** (`/tmp/fdcln/roles-matrix.json` is stale)
  before any history/permission re-check.
- **Full permission-gating re-VIU** (§E) — because the model is now bound to exact
  SV-7388 names and the history gate changed, re-run the FD-PERM-* suite live once a
  clean roles matrix is derived.
- **§5-R15 disclaimer** — quick UI eyeball in both dialogs (Add/Edit; Processing Fee
  when Story 8 ships).

### D5. Dev tickets — file / hold / drop

- **HELD (still, on Chris's blank Round-2 answers):** jira-bug-drafts **TICKET 4**
  (Q2/maxCap-0) and **TICKET 5** (Q3/tiny-% rounding); potential **new Q1
  over-discount-warning ticket** (only if Q1=A); potential **Q4 pfee-min tweak**
  (only if Q4=B). No change — Chris has not answered.
- **No new dev ticket from the spec doc itself** — V1_2 is spec text, not a defect.
  BUT: the history-gating behavior change means the current build (if it still gates
  on View History Logs) will **deviate from the new spec** — decide at re-VIU whether
  that is a dev ticket (build lags spec) or already implemented.
- **Cleared tickets unrelated to this input** stay ready to file (TICKETS 2/3/6/7/8–11
  per PROJECT-STATE §0.3) — unchanged.

### D6. Needs QA-lead / TestRail authorization

- **Re-ping Chris** for the Round-2 answers (Input 1 is blocking §A).
- **Fresh one-day TestRail write authorization** before any master-case edit (the
  D1/D2 wording + behavior updates, once decided). The 2026-07-10 authorization is
  spent.
- **A clean permission-gating re-VIU window** on qb (re-derive roles matrix first;
  tech quick-login is flaky).
- Confirm with the QA lead whether the history-gating behavior change should be
  filed as a build-lags-spec dev ticket or verified-as-built.

---

## E. FLAG — the big one: permission model now bound to Custom Roles (SV-7388) names

The V1_2 spec **inlines the exact Custom Roles (SV-7388) permission names in every
story and DELETES the S13-R11 translation table**. Two consequences:

1. **The whole FD-PERM-* suite and every "prereq" line in our cases now use
   euphemisms the spec has retired** ("Work Order change permission", "pricing-view
   permission", "work-order history permission", "customer change permission"). These
   need a **wording rewrite** to the exact names. Directly affected:
   **FD-PERM-001** (pricing-view), **FD-PERM-003 / FD-PERM-004** (Work Order change
   permission), and the Story-1/3/4/9/11 prereq lines across the WO/CUST/STATS/PCOL
   cases. `requirements.md` §10.2 (the translation table) should be **deleted** in
   the later authorized pass.

2. **The history-gating BEHAVIOR change (View History Logs → WO/WO-Lines: Create and
   Edit) is a real expected-result flip** (FD-PERM-009, FD-HIST-006, +8 wording
   cases) — **a live re-VIU of permission gating is warranted.** Caveat from prior
   VIU: the whole-WO adjustment write **and** the WO history endpoint were found
   **FE-only** at the backend (BUG-FD-3), and the **Technician role has DRIFTED** on
   the shared qb env — so **re-derive the roles matrix before ANY permission retest**;
   BUG-FD-3 / FD-PERM re-checks are invalid until then. Whether the backend should
   *enforce* the new C&E history gate (vs FE-only) is a dev decision to route
   alongside the existing BUG-FD-3 thread (FD-PERM-002, FD-WO-013).

**Recommendation:** treat the permission layer as a scoped re-work item — (a) a
wording pass over the FD-PERM-* suite + case prereqs to the exact SV-7388 names,
(b) an expected-result flip on the history cases, (c) a fresh roles-matrix
derivation + live permission-gating re-VIU, (d) request TestRail authorization to
push the resulting master-case edits. None of this is done here — proposal only.

---

## Appendix — provenance

- Input 1 source: `chris-round2-answers-source.xlsx/.csv/.md` (fetched 2026-07-13;
  HTTP 200; "Questions for PO" tab; F5–F8 empty).
- Input 2 source: `spec-source-2026-07-10.md` (text snapshot of
  `49f38748-FeesDiscountsV1_2.doc`; Change-Log newest entry 2026-07-12; no "v73").
- Input 3: Chris's 4-item changelog — 100% PRESENT in Input 2 (§C).
- Baseline: `requirements.md`, `spec-v1-reconciliation.md`, `PROJECT-STATE.md` §0.1,
  `PO-Questions-Round2.md`, `jira-bug-drafts.md`, `cases/*.json`.
- TestRail IDs from `testrail-id-map.csv` (standing rule 8). **No TestRail write
  performed or authorized by this task.**
