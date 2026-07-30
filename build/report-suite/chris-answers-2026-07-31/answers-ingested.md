# Chris Ward — Report Suite TechPlan questions: ANSWERS INGESTED (2026-07-31)

- **Source file (preserved verbatim in this folder):**
  `PO-Questions-Chris-ReportSuite-TechPlan_2026-07-30_ANSWERED.xlsx`
  (upload `256b918c-POQuestionsChrisReportSuiteTechPlan_20260730_2.xlsx`).
- **Sheets read:** 1 of 1 — `Questions for PO` (8 rows × 6 columns, every row read; no hidden
  sheets, no extra tabs, no free-text tab). Question doc it answers:
  `../PO-Questions-Chris-ReportSuite-TechPlan_2026-07-30.md`/`.xlsx` (sent 2026-07-30).
- **Answered:** **5 of 5.** **Unanswered: 0. Ambiguous: 0.** Every answer is an explicit option
  letter, and all five are **A**. (Rule 32 — nothing inferred; nothing read past what he wrote.)
- **Authority:** Chris Ward is the Report Suite PO → tier (a), the top of the Rule-33 precedence
  order. These answers are dated **2026-07-31**, i.e. NEWER than the six spec pages (all v-bumped
  2026-07-29 06:32–06:45Z), newer than the companion video (2026-07-30), newer than the engineering
  tech plan (2026-07-29) and newer than the kickoff video. **Latest-wins (Rule 32): these answers
  are the current product truth wherever they touch.**

---

## Q1 — The Location dropdown when someone only has one location

**His answer (verbatim):**
> **A -- classic spec drift**

= **Option A: "Hidden for a one-location person (the video's way — this is what our tests expect
today)."**

**What he settled:** the video-vs-tech-plan conflict. The kickoff video said the dropdown
disappears for a one-location user; the engineering plan (written a week earlier) said it stays.
**The video is right.** His words "classic spec drift" acknowledge the four spec notes that still
say the opposite are stale text, not intent.

**Our question text he was answering (verbatim, for the record):** *"Should the dropdown be hidden
for a one-location person (as you said in the video), or always shown?"*

---

## Q2 — Two slightly different "too big to download" messages

**His answer (verbatim):**
> **A - great catch**

= **Option A: "One message everywhere: 'This report is too large to export. Narrow the date range
or filters, then try again.'"**

**What he settled:** one suite-standard string — the **Inventory Value + engineering-plan** wording.
The Sales By Customer variant ("This export is too large to generate…") is retired.

---

## Q3 — The 10,000-row download size limit is missing from three report pages

**His answer (verbatim):**
> **A - this was not well thought out by me (the specs were written at different times)**

= **Option A: "Yes — the same limit applies to all six reports (we have prepared tests for this)."**

**What he settled:** the 10,000-row export cap is **suite-wide** — it applies to **Parts Velocity,
Technician Utilization and Work In Progress** too, even though those three spec pages never
mentioned it. His parenthetical confirms the omission was an artifact of the specs being written at
different times, not a deliberate exemption.

---

## Q4 — Who can open each report (the permission re-ask) ⭐ THE IMPORTANT ONE

**His answer (verbatim):**
> **A - the intention is to not hide these from normal reports access. These were specced before
> CRP was built :)**

= **Option A: "Change it to the normal reports access (what you told us) — engineering adjusts the
build."**

**What he settled — plainly:** **every one of the six reports is gated by the ordinary reports
permission.** There is to be **no dedicated per-report View permission**. He is ruling on
**INTENDED BEHAVIOUR** (note "the intention is…"), and he explains the origin: the SBC spec
predates Custom Roles & Permissions ("CRP") being built.

**This is the second time he has said this** (his 2026-07-28 answer was "these should be gated by
normal reports access"); this re-ask was deliberately sharpened with the tech-plan citations, and
he did not move. **The mixed model is therefore NOT what he wants**, even though the tech plan
called it a deliberate decision awaiting his call (plan decision #5) and the build ships it.

**Consequence (worked through in `DELTAS.md`):** the BUILD and the SBC spec text now DEVIATE from
the PO's ruling. This is a **product-ruling-vs-build gap → a dev change ticket**, not a silent case
flip. See `DELTAS.md` §D4 and `Q4-permission-dev-note-2026-07-31.md`.

---

## Q5 — How far does "the full word Representative" go?

**His answer (verbatim):**
> **A - this is really cool, you guys are running into the same problems I did. Rep is too much
> slang, let's do representative everywhere**

= **Option A: "Every label everywhere uses the full word 'Representative' — including the work
order box and the assignments download with its file and columns."**

**What he settled:** the widest scope. "Rep" is out **everywhere** — not just the report name and
the customer card. That reaches the **work-order "Sales Rep" selector** (and its accessible name)
and the **"Sales Rep Assignments"** export (dialog entry, file name, and the CSV column header).

---

## Cross-check against the specs captured the same day

The Phase-0 re-diff (`../spec-current-2026-07-31/SPEC-DIFF-2026-07-31.md`) shows the spec TEXT has
**not yet caught up** with three of these five answers. Recorded here so the next pass does not
mistake stale spec text for a fresh ruling:

| Answer | Spec text as of the live v12–v15 capture | Reconciliation |
|---|---|---|
| Q1 = A (dropdown hidden) | **Contradicts:** SBR S21-N1, TU S9-N1, IV S7-N1, PV S2-E4 all still say a single-location user "still sees the filter". | Answer is newer → **answer wins**; the four notes need Chris's edit. |
| Q2 = A (one message) | **Half-aligned:** IV S10-R12 already carries the winning string; SBC S14-R16/S15-R25 still carry the losing one. | Answer wins → SBC case wording flips; SBC spec text needs his edit. |
| Q3 = A (cap on all six) | **Missing:** PV, TU, WIP spec pages still have no cap or message. | Answer wins → cases exist/are authored for PV + TU; **WIP now needs one**; three spec pages need the cap line. |
| Q4 = A (normal reports permission) | **Contradicts:** SBC S1-R2 still reads *"gated by a dedicated Sales By Customer report View permission — it is not tied to a generic 'all reports' permission."* | Answer wins as INTENT → cases move to the unified model **and** a dev ticket is raised because the build ships the dedicated atom. |
| Q5 = A (full word everywhere) | **Contradicts:** SBR S19-R1/R7/R8 still "Sales Rep"; Story 15 still "Sales Rep Assignments" (9 occurrences). | Answer wins → case labels flip; SBR spec text needs his edit. |

**Nothing in this file is live-verified** (Rule 12) — the Report Suite QA branch is still not
available to us. Every consequence below is spec/answer reconciliation, to be VIU-confirmed live
when the branch exists.

## Still open with Chris after this round (not asked here)

- The **SBR staff-dialog Escape vs Golden-Rule** question — still awaiting an answer on
  `../PO-Questions-Chris-ReportSuite-2026-07-27` (Q1).
- The **7 spec-text corrections** his own answers now imply (Q1 ×4 notes, Q2 SBC string, Q3 ×3
  pages, Q4 SBC S1-R2, Q5 SBR "Sales Rep" labels) **plus the WIP asset-identifier text he believed
  he had already edited** — see `../SPEC-WATCH-2026-07-28.md`.
