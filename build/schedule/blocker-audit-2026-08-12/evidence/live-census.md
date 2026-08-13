# Live TestRail census — derived 2026-08-13T02:47Z

Read-only: `get_sections` (paged) + `get_cases` (paged), section membership resolved by walking each
section's `parent_id` chain up to group 4254.

| Measure | Value |
|---|---|
| Sections in project 1 / suite 1 | 626 |
| Sections under group 4254 | **31** |
| Cases under those sections | **176** |
| `created_by` | **3 × 176** — 0 foreign |
| Markers | **READY 137 · HOLD 35 · READY-EXPECT-FAIL 4** |
| Cases with no marker | **0** |
| Cases with more than one marker | **0** |
| Gate | 137 + 4 = **141**; 176 − 35 = **141** ✅ |

## Build stamps across all 176

| Stamp | Count |
|---|---|
| `v3.5-65d6500` | 151 |
| `v3.5-7ec992f` | 15 |
| `v3.5-d122eef` | 10 |
| **`v3.5-84846fa` (running)** | **0** |
| No build line | 0 |

## HOLD population: 35, reconciled

- **25** = the six groups in the previous pass's table (8 second-sign-in · 6 panel · 4 unticketed ·
  3 PO · 3 feature-absent · 1 pre-release) — sums exactly.
- **10** = walked-but-still-held: C29929, C29945, C29973, C29974, C29975, C30034, C30044, C30050,
  C38872, C38874.

## The four unticketed-fault cases — evidence they were WALKED

C29985, C30004, C30013, C30020 (and C30034) each contain verbatim:
*"This has been checked on the build and reported to the QA lead, but it does not have a ticket
number yet."* All five stamped `v3.5-65d6500`, 8/12/2026. C30004 additionally records a per-point
result: *"Points 1, 2 and 3 are fine…"*.
