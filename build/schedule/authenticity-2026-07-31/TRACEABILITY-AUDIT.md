# Schedule — TRACEABILITY AUDIT (closing authenticity pass, 2026-07-31)

> **Rule 20 gate.** Every ACTIVE case must carry, in the TestRail `refs` field, BOTH
> (a) a Jira ticket — a story `SV-8686..SV-8700`, or the epic `SV-8685` **only** when the
> case is genuinely cross-cutting with no single-story owner, **stated explicitly** — AND
> (b) a spec anchor that **still exists in the CURRENT spec (Confluence v23)**.
>
> Baseline: `build/schedule/requirements.md` (promoted to **v23** 2026-07-31) +
> `build/schedule/spec-current-2026-07-31/SPEC-DIFF.md`. Epic verified UNCHANGED since
> ingest (`build/epic-recheck-2026-07-31/SCHEDULE-EPIC-DELTA.md`).
>
> **Why this pass was needed:** the 2026-07-27 refs backfill was written against the
> then-current spec (Confluence **v18**). v19–v23 changed 9 things and REMOVED 8
> sentences (the `Removed upstream (v19–v23)` appendix R1–R8 in requirements.md), so an
> anchor could still *name a live section* while *describing text that no longer exists*.

## 0. Headline — before → after

| Check | Before this pass | After |
|---|---|---|
| Active cases audited | 164 | **164** (100%, no sampling — Rule 17) |
| Ticket present in `refs` | 164 / 164 | **164 / 164** |
| Ticket is a valid epic/story key | 164 / 164 | **164 / 164** |
| Spec anchor present in `refs` | 164 / 164 | **164 / 164** |
| Anchor section numbers that exist in v23 | 164 / 164 | **164 / 164** |
| Anchor **descriptor text** verifiable in v23 | **162 / 164** (2 stale) | **164 / 164** |
| Epic-only cases with cross-cutting rationale stated | **1 / 16** | **16 / 16** |
| Per-story precision (right story owns the anchor) | **162 / 164** | **164 / 164** |
| `refs` over the 250-char TestRail cap | 0 | **0** |
| Cases needing a possibly-obsolete decision | — | **0** |

**19 metadata field repairs across 19 cases. Zero tester-facing (Title/Preconditions/
Steps/Expected) changes in this phase. Zero retirements.**

## 1. Method (honest)

1. Built the v23 spec body as text (requirements.md up to the OPEN QUESTIONS section, so
   our own QA annotations and the removed-upstream appendix cannot be mistaken for live
   spec text).
2. Harvested the 40 real v23 section numbers from the headings; checked every `§n` in every
   `refs` against that set.
3. Harvested the **137 unique descriptor phrases** from the parenthetical anchors and
   required ≥60% of each descriptor's significant words to be present in the v23 body
   (external anchors — tech-plan / design / Confluence-version notes — exempted and
   reviewed by hand).
4. Ran a **fingerprint scan for each removed sentence R1–R8** over `refs` + `spec_ref`,
   with an exemption for metadata that itself says the thing was removed.
5. Re-derived the owning story for every case from the epic story bodies
   (`build/schedule/epic-sv8685/requirements-SV-86*.md`) and diffed against `refs`.
6. **Limitation, stated plainly:** this is a *metadata-vs-spec* audit. It proves each
   case cites a ticket and a live v23 anchor; it does **not** prove the behaviour is
   right in the build — Schedule still has no QA branch, so all 164 remain **VIU-Pending**
   (Rule 12: spec-pinned and design-pinned ≠ VIU-Verified).

## 2. STALE ANCHORS FOUND — pointing at text REMOVED upstream (2)

| Case | TestRail | Field | Was (stale) | Removed by | Now |
|---|---|---|---|---|---|
| SCH-EVT-01 | C30016 | `spec_ref` | `requirements.md §4.10, §7 (right-click menu)` | **R7/R8, Confluence v22** — "Create via a right-click context menu on any cell" → "Create via left-click on empty grid space" | `requirements.md §4.10 (left-click menu on empty grid space), §7` |
| SCH-REAS-03 | C30054 | `spec_ref` | `requirements.md §7 (Right-click context menu)` | **R8, Confluence v22** — "Right-click context menu on any grid cell: New Shift, New Event, View Day" → "Left-click on empty grid space opens a menu with: Create event, New work order" | `requirements.md §7 (left-click menu on empty grid space)` |

**Decision on both: RE-ANCHOR to the replacement text — neither case is obsolete.** The
tester-facing bodies of both cases were already corrected to left-click in the
2026-07-31 Branko-answers pass (Branko verbatim: *"there is no right click, only left
click. when clicked it opens dropdown menu with two options (Create event, New work
order)"*), and both cases' `refs` were already correct. Only the local `spec_ref`
mirror had been left behind. **`spec_ref` is a local field — it is NOT pushed to
TestRail** (the executor maps `refs`, falling back to `spec_ref` only when `refs` is
empty), so these two repairs need **no TestRail write**.

## 3. NO case is possibly-obsolete — every R1–R8 removal accounted for

The task asked for a separate list of cases whose anchor pointed at a removed sentence and
that might therefore be obsolete. **That list is empty.** Each removal was already
absorbed as a *behaviour change*, not a scope removal:

| Removed | What we did | Evidence |
|---|---|---|
| **R1** §4.9 modal "and Reassign to another technician" (v23) | SCH-MODAL-08 (C30015) asserts the *negative* ("no Reassign action"), and its `refs` says so verbatim: `§4.9 (Actions - Delete only; Reassign removed in Confluence v23)`. SCH-REAS-02 was retired+deleted 2026-07-22. Drag-reassign lives on in SCH-REAS-01 (C30052), anchored `§7 (Shift reassignment)` — **still verbatim in v23** (§7: "Dragging a shift block from one technician row to another"). | v23 §4.9 / §7 / §12 |
| **R2** §4.4 colour tied to the work order (v22) | Already repaired 2026-07-27 (delta D3) + SCH-COLOR-02 repaired 2026-07-31. No metadata still describes WO-tied colour. | v23 §4.4 / §10 |
| **R3** §4.5 "skips weekends **and shop closures**, end date emergent" (v22) | SCH-SPREAD-07 (C29983) / SCH-EDGE-05 (C30089) assert the v23 rule (closures **NOT** skipped in V1). Their `§12 (Shop closures)` anchor is **valid** — §12 still has that bullet; it is the flagged spec-internal contradiction **X1** (see §6). | v23 §4.5 vs §12 |
| **R4 / R5** §4.6 series banners "breaks around skipped or booked days" (v22) | SCH-SER-01 (C29987) / SCH-SER-02 (C29988) were reworded 2026-07-31; both carry the v18→v23 diff verbatim in their notes. Anchor `§4.6` is live. | v23 §4.6 |
| **R6** §4.8 now-line label (v22, *changed* not removed) | SCH-DAY-06 (C30006) anchored `§4.8 (Now line)` — **still verbatim in v23**; the case was reworded to "on hover over the grid" 2026-07-31. | v23 §4.8 |
| **R7 / R8** §4.10 + §7 right-click cell menu (v22) | Bodies corrected in the 2026-07-31 pass across SCH-EVT-01/02/03, SCH-REAS-03/06, SCH-PERM-02/04. The two leftover `spec_ref` mirrors are the §2 repairs above. | v23 §4.10 / §7 |

## 4. PER-STORY PRECISION repairs (2) — Rule 20 "per-story precision ALWAYS"

| Case | TestRail | Was | Now | Why |
|---|---|---|---|---|
| SCH-EDGE-03 | C30086 | `SV-8686 (§11 (Performance - virtualization))` | `SV-8687 (§11 (Performance - sidebar list and line drill-down virtualize at 50+ items))` | The case is entirely about the **sidebar** list + line drill-down. **SV-8687** owns it verbatim: *"WO list virtualizes at 50+ items; line drill-down virtualizes for orders with many lines. — ( PRD: §11 )"*. SV-8686 §11 only owns the **grid** (*"must render smoothly with up to 15 technicians × 7 days"*) — that is SCH-EDGE-04, which correctly stays on SV-8686. |
| SCH-EDGE-02 | C30085 | `SV-8686 (§11 (Responsiveness))` | `SV-8686,SV-8687 (§11 (Responsiveness - grid scrolls horizontally below 960px; sidebar collapses))` | The case asserts **both** halves of §11 Responsiveness, and they have **different owners**: SV-8686 *"Minimum supported width is 960px; the grid scrolls horizontally below that"* and SV-8687 *"The sidebar collapses on narrow viewports"*. Both keys now cited. |

## 5. EPIC-KEY cases — cross-cutting rationale now stated on the case (15)

Rule 20 permits `SV-8685` **only** for a genuinely cross-cutting case with no single-story
owner, **"and that is stated explicitly."** The rationale existed in
`build/schedule/epic-sv8685/RECONCILIATION.md` but **not on the cases themselves**, so a
reader in TestRail could not tell an intentional epic ref from a lazy one. Fixed: each now
reads `SV-8685 [epic - cross-cutting, no single-story owner] (<anchor>)`.

**The claim is verified, not assumed:** the epic has 15 stories, SV-8686..SV-8700, and
**none of them is a permissions story or a regression/migration story** — titles are Grid
Layout, WO Sidebar, Drag-and-Drop, Scope Picker, Block Anatomy, Spread, Series, Overlap,
Day View, Modal+Tooltips, Events, Conflicts, Capacity, Working Hours, View Options. §14
Roles and permissions is cross-cutting in the PRD with no story owner.

| Case | TestRail | Anchor | Why the epic is correct |
|---|---|---|---|
| SCH-PERM-01 | C30074 | `§14.1 (Schedule: View), §14.3` | core permission tier — no permissions story exists |
| SCH-PERM-02 | C30075 | `§14.1 (Schedule: View - editing affordances)` | core permission tier |
| SCH-PERM-03 | C30076 | `§14.1 (When Schedule: View is OFF)` | core permission tier |
| SCH-PERM-04 | C30077 | `§14.1 (Schedule: Edit)` | core permission tier |
| SCH-PERM-05 | C30078 | `§14.1 (Schedule: Delete - without it)` | core permission tier |
| SCH-PERM-06 | C30079 | `§14.1 (Schedule: Delete)` | core permission tier |
| SCH-PERM-07 | C30080 | `§14 (Delete requires Edit and Edit requires View)` | tier containment — spans all three tiers |
| SCH-PERM-09 | C30082 | `§14.3` | no permission-level "own only" restriction — spans the whole feature |
| SCH-REG-01 | C38867 | `tech-plan §3 FR-015 data migration` | pre-rewrite data migration — no story owns it |
| SCH-REG-02 | C38868 | `tech-plan §4 Dashboard FR-016` | Dashboard repoint outside the Schedule stories |
| SCH-REG-03 | C38869 | `tech-plan §4 WO-create AppointmentScheduler` | WO-create surface outside the Schedule stories |
| SCH-REG-04 | C38870 | `tech-plan §3 WO-primary location resolution` | multi-location resolution — cross-cutting |
| SCH-API-01 | C38872 | `§14 + tech-plan §4 NFR-003 permissions` | API permission enforcement across all endpoints |
| SCH-API-03 | C38874 | `§14 + tech-plan D6/NFR-002 no pricing` | no-pricing invariant across all Schedule responses |
| SCH-API-04 | C38875 | `tech-plan NFR-001 location scoping` | location scoping across all Schedule endpoints |

*(C-IDs above are read from `build/schedule/testrail-id-map.csv`.)*

## 6. Two honest, INTENTIONAL exceptions — stated, not hidden

### 6a. Five cases anchor to the ENGINEERING TECH PLAN, not to a Confluence §

`SCH-REG-01`, `SCH-REG-02`, `SCH-REG-03`, `SCH-REG-04`, `SCH-API-04` carry a ticket + a
**tech-plan** anchor and no `§` anchor. That is correct, not a gap: these are
migration / Dashboard-repoint / WO-create / location-scoping behaviours that the
Confluence page **does not describe at all** (SPEC-DIFF §4: *"No API/backend contract in
the page body — §8 Data model is entity-level only... the tech plan remains the only
backend description"*). Per Rule 30 the tech plan is a legitimate standard input; per
Rule 15 we say "spec silent" out loud rather than inventing a `§`.
`SCH-EDGE-07` and `SCH-API-02` carry **both** (`§4.5` + tech-plan).

### 6b. SCH-EVT-05 trips the R1 "reassign" fingerprint — it is a FALSE POSITIVE

`SCH-EVT-05 (C30020)` refs `SV-8696 (§4.10 (Drag-and-drop to reassign/move), §7 (toast))`.
The removed R1 text was the **shift detail modal's** Reassign *action*. This anchor is the
separate, still-live **event** drag behaviour, verbatim in v23 §4.10: *"Drag-and-drop to
reassign between technicians or move between days."* Anchor **VALID — left unchanged.**

## 7. Spec-internal contradiction X1 — our anchors sit on the right side of it

Confluence v23 contradicts itself: **§4.5** says *"Shop closures and public holidays are
not skipped in V1.."* while **§12** says closures *"block the spread step from placing
shifts on those days."* Both are live in v23 (Branko updated §4.5 in v22 and never
updated the §12 bullet). Per Rule 15 we flag, never silently pick a side.

Our cases follow **§4.5 (the newer text)** and cite both sections, so the contradiction is
visible from the metadata rather than buried: SCH-SPREAD-07 `§4.5, §12 (shop closures)`;
SCH-EDGE-05 `§12 (Shop closures), §4.5`. It is already question **NQ-1** on the Branko
sheet. No anchor repair needed; **no case asserts the §12 side.** (Re-verified in Phase 3.)

## 8. Verdict

**All 164 active Schedule cases are traceable and authentic against Confluence v23:**
ticket present and valid on 164/164, spec anchor present on 164/164, every anchor section
live in v23, every descriptor verifiable, every epic use justified and now stated on the
case, 0 stale anchors remaining, 0 possibly-obsolete cases, 0 refs over the 250-char cap.
