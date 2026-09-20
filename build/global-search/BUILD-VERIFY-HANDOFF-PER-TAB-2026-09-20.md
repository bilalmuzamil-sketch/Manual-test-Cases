# HANDOFF → Build Verification: Global Search per-tab prefix ranking (3 new) — 2026-09-20

**Source gate satisfied.** Evidence: `build/global-search/PER-TAB-RANKING-COVERAGE-2026-09-20.md`,
SV-10279 (the Parts-tab defect these close), PRD 576978945 v1.5 §6.1 + §4.
**Run:** R415 (Global Search V2 — Full Suite), now 203 cases; these 3 are in it.

## The 3 new cases (all NEW, never build-verified; `AUTOMATION: READY`)
| Case | Run test link | Tab |
|---|---|---|
| **C72120** — Parts tab: a part whose name begins with the query ranks above one that only contains it | https://shopview.testrail.io/index.php?/tests/view/3088559 | Parts (direct SV-10279 regression) |
| **C72121** — Vendors tab: begins-with ranks above contains | https://shopview.testrail.io/index.php?/tests/view/3088560 | Vendors |
| **C72122** — Assets tab: begins-with ranks above contains | https://shopview.testrail.io/index.php?/tests/view/3088561 | Assets |

Read the real labels off the build (Rule 18/102); Expected stays from the documents (Rule 57); re-stamp the build line (Rule 54).

## Data seeding — per case (Rule 111; standing-authorised Rule 107; tag ZZAUTOTEST)
Each needs THREE records of that entity, identical in every way EXCEPT the match type, so only match
strength can decide order (the SV-10279 discipline):
- **C72120 (Parts):** 3 inventory parts — (A) description BEGINS with a unique keyword, (B) description
  CONTAINS it part-way, (C) one-letter typo. All: no stock, same bin, never sold, never opened.
- **C72121 (Vendors):** 3 vendors — name begins / contains / typo. All: no open POs, not used recently.
- **C72122 (Assets):** 3 vehicles — displayed name (year/make/model) begins / contains / typo. All: no
  open work orders, not viewed recently, same year band.
Use one unique keyword per case; verify each trio is findable before running; allow OpenSearch index lag
before calling a miss (Rule 104).

## Watch-outs
- Ranking is config-driven and can differ per environment — verify the ORDER RULE (begins-with is
  highest), not an absolute score.
- The whole point is per-TAB: open that entity's scope tab and read the order there, not the All view.

**No source blocker.**

---
## Per-tab coverage matrix (after these 3) — every tab now has matching AND ranking coverage
| Tab | Matching test | Ranking test |
|---|---|---|
| All | pinned exact-ID top C44850/C55729 | group order C44827/C44830; within-group C44851 |
| Work orders | exact number C44843; VIN C44844 | C44851 (open/active, recency, assigned, viewed, closed-demote) |
| Customers | prefix C55724; name fuzzy C44839–42 | C55708; prefix C55724 |
| Assets | prefix **C72122** | C55709; **C72122** |
| Parts | prefix **C72120**; description fuzzy C55715 | in-stock C44852; recency C55712; **C72120** |
| Vendors | prefix **C72121** | C55710; **C72121** |
| Part sales | exact P-number C44849 | recency/paid/mine C55711 |
| Purchase orders | exact PO number C55714 | Ordered+recency C45137 |
| Vendor invoices | exact invoice number C55714 | Unpaid+recency C45138 |

Name tabs (Customers/Assets/Parts/Vendors) all now carry the begins-with rule; identifier tabs
(Work orders/Part sales/Purchase orders/Vendor invoices) are exact-number by design (§7 / SV-10279 table),
which is covered; the All tab carries group order + pinned top + within-group.
