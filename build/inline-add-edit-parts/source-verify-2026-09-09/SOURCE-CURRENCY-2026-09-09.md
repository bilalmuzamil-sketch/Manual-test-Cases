# Inline Add & Edit Parts (6597) — FULL SOURCE RE-VERIFICATION (2026-09-09)

Epic **SV-9315** · spec **Confluence 782761986** · group 6597 · run **R418** · 123 cases ours (4 foreign,
Vladimir user 1). **FULL re-verification (L0021): every case re-read against the live spec and re-stamped —
NOT a delta.** Corrects the 2026-09-07 delta pass (only 5 of 123 carried the re-verify date; 113 were still
"31 August 2026" — i.e. stamped against the pre-2026-09-04 spec — and 5 manually-added had no spec line).

## Source currency
- Spec 782761986 fetched **live 2026-09-09**: body **Last Updated 2026-09-04** (Sasha Grosman), page
  last-modified 2026-09-07; newest change-log = the two 2026-09-04 entries (Story 7/SV-9724; modal-cancel
  no longer discards). **NOT moved since the v16 baseline** — content identical to what 2026-09-07 verified.
  Version integer not MCP-readable (known blocker); treated as **still version 16**.
- Epic SV-9315 (Story 7 = SV-9724) maps cleanly.

## Diff (Rule 43, FULL): 114 UNCHANGED · 4 UPDATE (of 118 spec-derived) · 5 manually-added checked
**Content UPDATES (Rule 57 — documented expectation kept):**
- **C44993 (S1-N1)** & **C44994 (S1-N2)** — Expected listed only 3 statuses; spec lists **five** (adds
  **Declined, Imported**). Updated to the spec, with 62(b) three-outcomes tester notes for the build gap
  (build currently shows the control on Declined). Build-check line removed (expected changed) — **re-build-verify**.
- **C45007 (S2-R11)** — added the missing condition: "Uncategorized" only when the part has no category; an
  inventory/catalog part keeps its own category.
**HELD, NOT changed (Rule 58 — case-vs-spec conflict, escalated):**
- **C45034 (S3-E1)** — asserts a concurrent-edit alert the spec has **struck as out of scope** ("no
  concurrent-edit detection exists platform-wide"). Retire/reframe is a QA-lead call → escalated, NOT
  re-stamped (re-stamping would falsely claim it matches v16).
- **C45250 (manually-added)** — expects Add Part to vanish on a Completed line, but spec **S1-R9** says Add
  Part IS available on Complete/In-Review (auto-uncompletes). Kept its "Manually added" source; escalated.

Full per-case detail: `FULL-REVERIFY-DIFF-2026-09-09.md`.

## Writes
- **117 spec-derived cases re-stamped** to **specification version 16, read 9 September 2026** (the 5
  page-id-style cases C45001/45039/45047/45232/C53477 normalised to also cite version 16). 3 of these carry
  the content updates above. Rendered to `fr-view` via the `html.set` harness. Build-check + AUTOMATION
  preserved except the 2 build-gap cases (build-check removed).
- **6 Automated cases re-stamped** (C45005, C45026, C45223, C45224, C45227, C45237) with QA-lead go-ahead →
  `FOR-VLAD-2026-09-09.md` (Rule 65).
- **4 manually-added left as-is** (correct non-spec source): C45251, C45252, C45253, C45254 (re-confirmed sensible).
- **2 HELD** (not re-stamped): C45034, C45250. **Vladimir's 4 foreign untouched** (Rule 38).
- 0 new cases → run R418 already holds all 123 (Rule 34 / L0020).

## OUTSTANDING (for the QA lead / PO)
- **C44993 / C44994** — spec-vs-build on the Declined status (and is "Imported" a real status?): PO/spec decision.
- **C45034** — retire or reframe (spec struck concurrent-edit detection); also §8 still lists the removed
  "changed by someone else" message → spec tidy-up.
- **C45250** — manually-added conflict with S1-R9 (Add Part on Completed line): PO decision.
- **Coverage gaps (report-only):** S1-R9 and S1-N4 have no spec-derived case; duplicate S4-R21 numbering in the spec.
