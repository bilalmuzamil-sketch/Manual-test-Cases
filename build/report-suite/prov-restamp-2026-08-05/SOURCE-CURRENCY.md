# Report Suite — SOURCE CURRENCY, provenance re-stamp + Location re-repair pass

**Pass date:** 2026-08-05 · **Project:** Report Suite ONLY (epic SV-8582, TestRail group 4281)

## 1 · The six specifications — re-fetched LIVE immediately before writing (Standing Rules 31 + 59)

Fetched over the Confluence REST API at **2026-08-05T17:1x UTC**, reading the **Confluence version
number**, never the in-body "Version" field (Rule 31(a) trap).

| Report | Confluence page | Live version | Version saved at | Verdict |
|---|---|---|---|---|
| Sales By Customer | 577634305 | **14** | 2026-08-05T13:07:07Z | CURRENT |
| Sales By Representative | 585629698 | **16** | 2026-08-05T13:33:14Z | CURRENT |
| Parts Velocity | 620888066 | **5** | 2026-08-05T13:21:40Z | CURRENT |
| Technician Utilization | 641400833 | **6** | 2026-08-05T13:33:10Z | CURRENT |
| Work In Progress | 703660034 | **7** | 2026-08-05T13:33:12Z | CURRENT |
| Inventory Value | 720142338 | **4** | 2026-08-05T13:33:13Z | CURRENT |

**No spec moved between this fetch and the writes** (re-read again at the end of the pass — see
`FINDINGS.md` §Sources re-read).

## 2 · The build — a source, and it is unchanged

`https://sv8582.qa.shopview.com/` read live: **`v3.5-16cf83f`**, `last-modified: Wed, 05 Aug 2026
06:40:32 GMT`, `etag "177c59546701e7810b894492dabc1423"`, `index.html`
sha256 `67932a75b5a3a11d987b065c526d2d6dd38d0f47f76adeef61a6d341b249fa78`. **Identical to the marker the
14:00Z pass recorded — no redeploy.** The branch is **still not declared final**, so every verdict on it
is **PROVISIONAL** (Rule 49) and the re-check queue stays OPEN.

## 3 · Epic

**SV-8582** — not re-enumerated this pass (Rule 37 Tier 1 was run at 13:20Z the same day: 105 children,
verified two ways). No case's ticket traceability was changed, so `refs` was not written on any case.

## 4 · The requirement-level re-diff of the five moved specifications (owed by
`final-viu-2026-08-05/ADDENDUM-SPECS-MOVED-AGAIN.md` item 1)

Numbered requirements extracted from both versions and compared by anchor. `diff-summary.json` holds the
machine-readable result.

| Spec | reqs before → after | Added | Removed | **Changed** |
|---|---|---|---|---|
| SBR v15 → v16 | 228 → 228 | 0 | 0 | **S14-R15, S14-R16, S14-R20, S21-N1** |
| TU v5 → v6 | 120 → 121 | S7-R4a | 0 | **S10-R4, S2-R1, S7-R11, S7-R4, S9-N1, S9-R9** |
| WIP v6 → v7 | 122 → 122 | 0 | 0 | **S4-R3, S7-R6** |
| IV v3 → v4 | 112 → 113 | S10-R8a | 0 | **S5-R1, S7-N1** |
| PV v4 → v5 | 70 → 70 | 0 | 0 | **S1-R4, S2-E4** |

**The decisive finding, and it corrects the addendum:** on the Location column, only **Technician
Utilization** actually moved its *numbered requirements* (**S9-R9 and S10-R4 both rewritten**). In the
other five reports the toggleable/access-gate decision landed in the **narrative summary and the
changelog only**, while the numbered requirement that says the opposite was **left untouched**:

| Report | Numbered requirement, live, verbatim | Narrative / changelog, live, verbatim | State |
|---|---|---|---|
| **SBC v14** | **S13-R4**: "The nine toggleable columns are, in order: Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %." (no Location) | **S4-R12**: "…the column is shown by default and can be toggled on or off from the column selector" | **BOTH WAYS** |
| **SBR v16** | **S21-R7** (UNCHANGED in v16): "A per-row Location column is shown on the report only when the current view spans more than one location… When the view is scoped to a single location the column is hidden"; **S20-R1/R2**: the dropdown holds "the seven toggleable metric columns", Location not among them | §2: "it is shown by default and can be toggled on or off from the column selector"; changelog: "made toggleable in the column selector" | **BOTH WAYS** |
| **PV v5** | **S3-R10** (UNCHANGED in v5): "The column is auto-managed by the location scope (it is not one of the 20 columns in the picker, S4-R1, and **is not user-toggleable**)" | §4 (NEW in v5): "Such a user sees it by default and **can toggle it on or off from the column selector**"; changelog (NEW in v5): "the Location column changed to an access gate (… and can toggle it in the column selector …)" | **BOTH WAYS** |
| **TU v6** | **S9-R9 + S10-R4, BOTH REWRITTEN in v6**: "The per-row Location column is one of the toggleable columns for a user with access to more than one location: it is shown by default and can be toggled on or off from the column selector" | agrees | **SETTLED — toggleable** |
| **WIP v7** | **S7-R13** (UNCHANGED in v7): "…the user does **not** toggle it in the column selector" | **S4-R3** (CHANGED in v7): "The Location column is offered in the column selector… can be toggled on or off" | **BOTH WAYS — inside the same version** |
| **IV v4** | **S7-R6** (UNCHANGED in v4): "…it is **not one of the columns offered in the column-selection control**"; **S3-R1**: inserted "When the report is scoped to more than one location" | §2/§4 (NEW in v4): "access-gated and toggleable" | **BOTH WAYS** |

**⚠️ THIS CONTRADICTS THE BRIEF I WAS GIVEN ON ONE POINT AND I AM NOT SILENTLY ACCEPTING EITHER SIDE.**
The brief (and the round-3 question sheet) record **Parts Velocity as "never touched" on this point**, and
the coordinator's later correction lists the remaining contradictions as **SBC, SBR, WIP and IV only**.
**Live, PV v5 states it both ways**: its §4 narrative and its changelog were **added in v5** and assert the
toggleable model, while **S3-R10 still says "is not user-toggleable"**. Parts Velocity is therefore a
**FIFTH open contradiction**, not a settled report, and its two Location cases **stay held** — asserting
either side would pick a winner inside a self-contradictory document, which Rules 15 and 57 forbid.

## 5 · Tech plan · designs · PO answers

- **Tech plan** — held, unchanged; one case (C38925) cites it and says so.
- **Designs** — **NONE for this project** (never provided; not a Rule-35 queue, an absent source).
- **PO answers** — Chris Ward's 2026-08-05 answer sheet, already ingested. **Round-3 questions were sent
  today** (`rulings-2026-08-05/Questions-for-Chris-Ward_Report-Suite_Round-3_2026-08-05.xlsx`) and are
  **unanswered**, which is why 13 cases remain held.
