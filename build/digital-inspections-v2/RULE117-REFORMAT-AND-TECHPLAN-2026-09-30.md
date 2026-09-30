# Digital Inspection V2 — Rule 117 reformat + tech-plan coverage (2026-09-30)

## Reformat (Rule 117)
All **87 existing cases** (folder 6658, sections 12150–12165) rewritten in place to the locked
Rule-117 standard, **from live TestRail content** (the local scripts held only the original 43):
- **Concise titles** — every title now ≤ 80 chars (verified live).
- **Seeding as standard QA steps** in the preconditions, with example values (e.g. a template seeded
  via Settings – Service > Inspection Templates > Add field; a completed inspection seeded by running
  and signing one on a work order).
- **Build glossary** throughout (Settings – Service, template builder, Per axle field, checkbox field,
  Monitor / Not OK / OK / N/A, Add Note, Add Photo, outstanding items, ShopCoach Build lines, asset
  Inspections tab, Mark OK, Preview).
- **Runnable Expected observations** kept where already compliant; the **verbatim Source line + quotes
  + AUTOMATION marker were preserved byte-for-byte** (only the "Expected results" bullets and the
  title/preconds were touched; S1/S17's 6 cases had their result bullets tightened to observations).

Scripts: `di_lib.py` (`update` = full; `light` = title+preconds only, for cases whose steps/results
already met the standard), `v2_s1_s17.py` (6 full), `v2_s2_s5.py` (20 light), `v2_s6_s19.py` (61 light).

## Tech-plan coverage pass (Rule 115) — Digital Inspections V2 Foundation Technical Implementation Plan

The tech plan was read for testable behaviour it ADDS beyond the PRD (its §1.3 design-sourced `DFR`
rows and §1.4 non-functional `NFR` rows). Verdict per candidate:

**CONFIRM (already covered by the reformatted PRD cases):**
- DFR-001 (verdict stored at position level; worst-wins derivation) → S8 filling cases.
- DFR-002/003 (Mark OK never invents / no uncaused verdict) → S18 "what it never invents" — but the
  *menu-option* negative for DFR-004 was not explicit, so it is added below.
- DFR-005 (values only by typing), DFR-006 (axle-count default constrains nothing) → S8/S12.
- DFR-008 (reading order left-outer…right-outer) → present in S8 filling.
- DFR-009 (Single↔Dual copy/restore, submit stamps config) → S8 switching + edge cases.
- DFR-010 (measurement rows reorderable) → S8 authoring.
- DFR-012/013 (reference file never blocks submit; remove = X then attach) → S11.
- DFR-014 (bulk-OK inert when nothing to mark) → S18. DFR-015 (submit blocker list) → S14.
- NFR-004 (server-side negative test per withheld action) → already noted in the permission cases
  (e.g. C88516) as a developer/automated check.
- NFR-003/008/009 (materialised summary, index sizing, atomic bulk write) → performance/data-model,
  not manually testable; noted, no case.
- DFR-011 → **superseded** by the new S17-R9 (HEIC), which the S17 cases already carry.

**ADD (genuine gaps the tech plan flags; authored to Rule 117, cited verbatim to the plan) — new
folder 20448 "TP – Tech-plan coverage":**
- **C154644 — Feature flag off is a tested state (NFR-014).** The PRD gives the flag "two bullets and
  no requirements, no negative cases"; this case verifies every V2 surface is absent with the flag off
  and appears with it on, and that endpoints are flag-gated (server part = developer/automated).
- **C154645 — Verdict never by colour alone; colour placement; dark tier (NFR-017, DFR-007, NFR-018).**
  Verdict surfaces carry a text label; colour is confined to border/marker/chips (never a card
  background); the truck diagram is the sole deliberate colour-only surface; dark theme keeps
  not-inspected distinct from judged.
- **C154646 — New read paths scoped to organisation + workplace (NFR-005).** Asset Inspections tab,
  reference files and per-axle answers are tenant-scoped; the asset-history read crosses a customer
  boundary so scoping is explicit (server part = developer/automated).
- **C154647 — "Not inspected" is the absence of a verdict, never a selectable option (DFR-004, +DFR-002/003).**

**DIVERGE:** none requiring a PO question — the plan's PRD-vs-design conflicts (§3.5, §1.5) were all
already resolved by Product in the plan itself (e.g. photo-required default ON, 9 units kept, Preview
writes axle count back), and the reformatted cases already follow those resolved positions.

## Result
- **91 cases** now in folder 6658 (87 reformatted + 4 tech-plan ADDs).
- All titles ≤ 80 chars; all carry seeded preconditions, build-glossary steps, runnable Expected
  observations, and a verbatim source quote. Not build-verified (no sv8181 QA build) → all HOLD.
