# Report Suite — SOURCE CURRENCY (Standing Rules 31, 37, 49)

**Pass:** final check 2026-08-05 · **Project:** Report Suite ONLY · **Epic:** SV-8582 ·
**TestRail group:** 4281 · **PO:** Chris Ward

Every source below was fetched LIVE this pass. Nothing is taken from a local mirror.

---

## 1. THE BUILD (a source — Rule 49)

| Read | UTC | app-version | last-modified | etag | sha256(index.html) |
|---|---|---|---|---|---|
| START | 2026-08-05T13:20:39Z | `v3.5-16cf83f` | Wed, 05 Aug 2026 06:40:32 GMT | `177c59546701e7810b894492dabc1423` | `67932a75b5a3a11d…` |
| MID | *(recorded in FINDINGS.md)* | | | | |
| END | *(recorded in FINDINGS.md)* | | | | |

**Verdict: PARTIAL — the branch has NOT been declared final.** Every verdict in this pass is
therefore **PROVISIONAL** and is queued in `RECHECK-QUEUE.md`.

**The session is ALIVE this pass.** The two previous workers (2026-08-05 earlier, and the
Schedule/Filters workers) reported HTTP 401 `sso_required` across the whole `.qa.shopview.com`
estate. The cookies supplied for this pass authenticate: `GET /api/auth/me/fe-permissions` →
HTTP 200 with a full permission array, `GET /api/organizations/settings` → HTTP 200. This is
the first live Report Suite session since the `v3.5-16cf83f` deploy.

---

## 2. THE SIX SPECIFICATIONS (Confluence version number, never the in-body field)

Fetched over Confluence REST `/wiki/rest/api/content/{id}?expand=body.storage,version`.
**Rule 31(a) note: none of the six carries an in-body "Version" field at all** in this
capture, so the Confluence version number is the only available marker — which is what the
rule requires anyway.

| Report | Page | Our baseline | LIVE version | Verdict | Last updated (UTC) | By | Version message |
|---|---|---|---|---|---|---|---|
| Sales By Customer | 577634305 | v13 | **v14** | **STALE → DIFFED** | 2026-08-05T13:07:07Z | Chris Ward | "Applied QA review workbook decisions (2026-08-04)" |
| Sales By Representative | 585629698 | v15 | v15 | CURRENT | 2026-07-29T06:38:33Z | Chris Ward | — |
| Parts Velocity | 620888066 | v4 | **v5** | **STALE → DIFFED** | 2026-08-05T13:21:40Z | Chris Ward | "Applied QA review workbook decisions (2026-08-04)" |
| Technician Utilization | 641400833 | v5 | v5 | CURRENT | 2026-07-29T06:45:11Z | Chris Ward | — |
| Work In Progress | 703660034 | v6 | v6 | CURRENT | 2026-07-29T06:33:58Z | Chris Ward | — |
| Inventory Value | 720142338 | v3 | v3 | CURRENT | 2026-07-29T06:32:54Z | Chris Ward | — |

**749 numbered requirements extracted live** (SBC 193 · SBR 184 · PV 58 · TU 101 · WIP 114 · IV 99).

### ⚠️ CHRIS WARD WAS EDITING THE SPECS WHILE THIS PASS RAN

**Parts Velocity v5 was saved at 13:21:40Z — one minute before I fetched it, and one minute
AFTER I fetched Sales By Customer.** He is working through our QA review workbook right now
and ratifying its decisions into the specs. Two consequences, both stated plainly:

1. **Rule 31's shelf-life lesson applies at minute granularity again.** All six specs are
   re-read at the END of this pass and the result recorded here; a version that moves after
   that is a known, stated shortfall, not a silent one.
2. **He has ratified only TWO of the six so far.** The remaining four still carry the older
   model of the requirement he has just changed — see the cross-spec inconsistency in §2.3.

### 2.1 Sales By Customer v13 → v14 — 9 semantic changes + 1 new anchor

Formatting-only differences were excluded mechanically (the two captures come from different
pipelines, so 22 of PV's 23 raw diffs were markup artefacts — see §2.2).

| # | Anchor | v13 said | v14 says | Why it matters to us |
|---|---|---|---|---|
| 1 | **S4-R12** | "When more than one location is **in scope**, the report shows a per-row Location column; the column is hidden when a single location is in scope" | "The Location column applies only to a user who **has access** to more than one location; a user with access to a single location is never shown it and **it never appears in their column selector**. For a user with access to more than one location, the column is **shown by default and can be toggled on or off** from the column selector, **regardless of how many locations are currently selected**" | **THIS IS THE ANSWER TO THE LOCATION CONTRADICTION.** It is an ACCESS gate, not a selection gate. It matches what we observed live. It unblocks the held location cases and it settles ticket B4 for SBC. |
| 2 | **S4-R13** | "…When the Location column is shown on screen (**more than one location in scope**, S4-R12)…" | "…When the Location column is shown on screen (**per S4-R12**)…" | Export follows the new access gate. |
| 3 | **S20-R19** | "…when it is hidden (**a single location in scope**)…" | "…when it is hidden (**single-location access, or toggled off in the column selector**)…" | Two hide reasons now, not one. |
| 4 | **S20-R19a** *(NEW)* | — | "In the Summary download, which has no Date column, the Location column instead appears **immediately after the Customer name**, before the financial columns" | A new positional assertion on a surface (Rule 40). |
| 5 | **S15-R17** | "(2) the bundled ShopView logo **when none is uploaded**; (3) no logo" | "(2) the bundled ShopView logo **only when an uploaded logo is set but fails to load**; (3) **no logo when none is uploaded**" | **Ratifies our new case C43553 exactly**, and it means the "no logo uploaded" state is NOT a fallback-to-ShopView state — so the ticket we were holding (B5) is not a defect at all. |
| 6 | **S2-R2** | "The picker offers **eleven** options…: Today, Yesterday, This Week, Last Week, This Month, Last Month, This Year, Last Year, This Quarter, Last Quarter, **Custom**" | "The picker offers **nine** options, in this order: **Last 12 Months**, This Year, Last Year, This Quarter, Last Quarter, This Month, Last Month, This Week, Last Week. Beside the presets, **a calendar** … with a live readout of the number of days in range and an **Apply** button. **There is no Today, no Yesterday, and no option labeled "Custom"**" | A closed enumeration changed. Every case asserting eleven options or a "Custom" menu item is now stale (Rule 42 is exactly this failure mode). |
| 7 | **S2-R3** | "The **Custom range** is capped at 366 days" | "The **custom calendar range** is capped at 366 days" | Wording follows the new control. |
| 8 | **S2-R4** | "When the user picks **"Custom,"** the report opens a **date-picker dialog**" | "The user sets a custom range by selecting a start and end date **on the calendar beside the presets**, then choosing **Apply**" | The interaction changed, not just the label. |
| 9 | **S18-R7** | "Exports (CSV, PDF, **Print**) are generated on the server…" | "Exports (**CSV, PDF**) are generated on the server…" | Print removed. |
| 10 | **S18-R10** | "If an export (CSV, PDF, **or Print**) is triggered…" | "If an export (**CSV or PDF**) is triggered…" | Print removed. |

### 2.2 Parts Velocity v4 → v5 — exactly ONE semantic change

23 anchors differ textually; **22 are capture-pipeline artefacts only** (the v4 baseline came
from the Atlassian MCP as markdown with `` ` `` and `**` markup; this pass reads storage-format
HTML and strips tags, so `` `velocity-report.csv` `` becomes `velocity-report.csv`). Those 22
were excluded by comparing alphanumerics only. The one real change:

| Anchor | v4 said | v5 says | Why it matters |
|---|---|---|---|
| **S1-R4** | "Both loading the report and exporting it require the **Inventory Reports → View permission**" | "…require the **single reports permission — the one permission that grants access to all reports; there is no per-report permission**" | Confirms the permission model we asserted, and it is the exact requirement behind our story defect **SV-8780** ("SBC report gated by its own permission", Ready to Fix). The spec now agrees with us; the build does not yet. |

### 2.3 ⚠️ TWO SPEC DEFECTS AND ONE CROSS-SPEC INCONSISTENCY — Chris's to fix, reported not worked around

1. **The Location model is now inconsistent ACROSS the six specs.** SBC v14 makes it an
   **access** gate. Parts Velocity v5 — saved 14 minutes later, with the same version message —
   still says at **S2-R12**: *"When the Location filter (S2-R9) resolves to more than one
   location **in scope**, the table shows a per-row Location column; when a single location is in
   scope the column is **hidden**."* SBR, TU, WIP and IV were not touched at all and still carry
   the in-scope model. **So the same product behaviour is specified two different ways in the same
   suite.** Consequence for this pass: the access-gate expectation is applied to **SBC only**, and
   the other five reports' location cases are held rather than flipped (see
   `DELIBERATE-DECISIONS.md`).
2. **SBC's own glossary contradicts SBC's own S4-R12.** The Definitions section still reads:
   *"Location (column) — … It is shown only when more than one location is in scope and hidden
   when a single location is in scope."* Three places were updated in v14 (Feature Overview, Key
   Decisions, S4-R12) and the glossary was missed.
3. **SBC S14-R14 still maps date labels that S2-R2 has just deleted.** The export-filename map
   still contains *"Today → today; Yesterday → yesterday"* while S2-R2 no longer offers Today or
   Yesterday.

---

## 3. THE EPIC — SV-8582 (Rule 37 Tier 1, verified TWO ways)

| Check | Result |
|---|---|
| `parent = SV-8582` | **105** issues |
| `"Epic Link" = SV-8582` | **105** issues |
| Key sets equal BOTH directions | **YES** — 0 in one and not the other |
| Paging | exhausted via `nextPageToken` until exhausted; no remainder |
| Our previous record | 102 children |
| Difference explained | **+3 = SV-8879, SV-8880, SV-8881 — the three we filed ourselves yesterday.** Nothing arrived from anyone else. |

**Composition:** 97 Story + 8 Bug. **Statuses:** Open 83 · In Progress 11 · OBSOLETE 7 ·
Ready to Fix 3 · Done 1.

**Story-defect subtasks under the 97 stories: exactly 1** — **SV-8780** "SBC report gated by its
own permission", `Story Defect`, **Ready to Fix**, parent SV-8598, raised by us 2026-07-30.
(Checked because the Schedule project was caught out by story-defect subtasks hiding outside the
epic's direct child list.)

### 3.1 Defect states — TWO HAVE MOVED SINCE OUR RECORD

| Ticket | Status now | Priority | Moved? | What it means for our cases |
|---|---|---|---|---|
| SV-8818 | Ready to Fix | Low | no | accepted, not fixed |
| **SV-8819** | **Done** | Low | **YES — fixed 2026-08-04T08:32** | Parts Velocity Turns / Yr. **A fix has shipped — the case must be re-observed live and its marker may move off EXPECT-FAIL.** |
| SV-8820 | Ready to Fix | Low | no | accepted, not fixed |
| **SV-8821** | **OBSOLETE** (resolution Done) | Low | **YES — closed 2026-08-04T01:43** | Closed as not-reproducible because our steps named no canned line — the lesson already recorded under Rule 50. **Not reopened and not "restored" (Rule 53 corollary): a change under the shared account is the QA lead's triage, not drift.** |
| SV-8823 | Ready to Fix | Low | no | accepted, not fixed |
| SV-8879 | Open | Low | no | ours, 2026-08-05 |
| SV-8880 | Open | Low | no | ours, 2026-08-05 |
| SV-8881 | Open | Low | no | ours, 2026-08-05 |
| SV-8780 | Ready to Fix | Low | no | ours, story defect |

---

## 4. THE DESIGNS

**Verdict: NOT APPLICABLE / STILL ABSENT.** The Report Suite has never had designs; it is a
spec-only project and has been authored as such. No Rule-35 Figma queue exists for it
(`ls build/report-suite/*/PENDING-FIGMA-FETCH.md` → none). This is an OUTSTANDING item, not a
shortfall of this pass.

## 5. THE ENGINEERING TECH PLAN

**Verdict: CURRENT as held.** `build/report-suite/tech-plan-2026-07-29/` is the ingested plan;
nothing newer has been supplied. If engineering has revised it since 2026-07-29 we have not been
told (OUTSTANDING).

## 6. PO / STAKEHOLDER ANSWERS

| Source | Date | Verdict |
|---|---|---|
| `chris-answers-2026-08-05/` | 2026-08-05 | CURRENT — ingested, and now **being ratified into the specs by Chris in real time** (§2) |
| `rulings-2026-08-05/Follow-up-Question-for-Chris-Ward_2026-08-05.xlsx` | 2026-08-05 | **SENT, UNANSWERED** — 11 cases cite it as their blocker |
| `chris-update-2026-07-29/wip-identifier-answer-2026-07-29.md` | 2026-07-29 | CURRENT but **SUPERSEDED for WIP** by his 2026-08-05 answer (Rule 32) |
| The PRD walkthrough video | 2026-07-28 | CURRENT, ruled authoritative |

---

## 7. HEADLINE

**Two of six specs moved under us during the pass, and they moved in our favour.** Chris has
ratified the access-gate Location model, the load-failure logo rule, the nine-preset date picker
and the removal of Print — four of the things our cases and our questions were waiting on. The
cost is that he has done it for two reports out of six, so the suite is now internally consistent
with SBC and Parts Velocity and inconsistent with the other four **through no fault of our cases**.
