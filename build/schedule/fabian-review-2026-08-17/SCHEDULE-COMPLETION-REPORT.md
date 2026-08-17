# Schedule — Fabian design-review reconciliation — COMPLETION REPORT (2026-08-17)

Plain-English summary for the QA lead. **Build verification was deliberately deferred** this pass (your
2026-08-17 instruction); the application was never opened, `quick-login`/`switch-user` were never
called, and no admin/staff/role/setting was touched. This report covers **two passes**: the earlier
authoring of 19 new cases, and this pass, which **finished Schedule** — the v25→v30 spec re-ingest and
the ~28 deferred existing-case alignment updates.

## What I did this pass (in order)

1. **Spec re-ingest v25 → v30** (`SPEC-REINGEST-v25-v30.md`). Fetched live Confluence v30 and every
   historical body v25→v30; produced the exhaustive version-attributed delta; promoted `requirements.md`
   to the **v30 baseline** (header, a v25→v30 delta subsection, and the reworded §4.2/§4.5/§12 bodies
   annotated `[v29]`/`[v30]`). **0 orphaned anchors** — every §-anchor our cases cite still exists in v30.
2. **Applied the deferred existing-case updates** — **28 cases** aligned to v30, each byte-verified.
3. **Post-write assertion re-audit + full-suite contradiction sweep** (`POST-WRITE-AUDIT.md`) — 28/28
   PASS; **0 live contradictions** across all 195 cases.
4. **Regenerated the import + id-map** to v30; re-merged C-ids from live.
5. This report, `QUALITY-GATE.md`, `KNOWN-FAILURES-FOR-SYNC.md`, `STAGED-RUN-357-SYNC.md`, and the
   register updates.

## Source currency (Rule 31) — refreshed this pass
| Source | Verdict | Detail |
|---|---|---|
| **Spec** (Confluence 713031682) | **CURRENT — re-ingested** | Live **Confluence v30** (last edited 2026-08-13T22:48:26Z, *"Restore Business hours labelling"*), read live 2026-08-17. `requirements.md` promoted 25→30 this pass; exhaustive delta in `SPEC-REINGEST-v25-v30.md`. **The prior "v25→v30 re-ingest OWED" item is now DONE.** |
| **Epic + stories** (SV-8685) | **CURRENT** | 39 children, verified two ways. 14 new stories SV-9231…SV-9244 = the Fabian scope; SV-9245 (theme) OBSOLETE, not tested. |
| **Designs** (Claude/Figma/technical) | **PARTIAL** | Unchanged — the newer Sasha design share link is undated/editable and re-ingestion is conditional on "if Sasha's design is final" (not established). Labels not pinned by spec/story text are marked VIU-confirm, never invented. |
| **Technical design / tech plan** | **MISSING (and now a reported contradiction)** | No newer tech plan for the Fabian scope. **The 2026-07-29 tech plan CONTRADICTS v30 on shop closures** (plan: closures block the spread; v30: closures receive shifts). Per your 2026-08-12 tech-design ruling the spec wins and the contradiction is REPORTED to you (below). |
| **PO / handover** | **CURRENT** | The 14 new stories are the newest authoritative source. |

Rule-59 re-read at write start (batch A/B): spec v30 + epic 39 — **UNCHANGED** during the write window.

## Counts — honest; the two build numbers reported separately (core §1.5)
| | Count |
|---|---|
| New cases authored + pushed (earlier pass) | **19** (C43795–C43813) |
| **Existing cases updated to v30 THIS pass (byte-verified)** | **28** (20 content-align + 6 PANEL re-anchor SV-8686→SV-9243 + 2 title fixes) |
| Still deferred / flagged (NOT acted on, with reason) | **2** — see below |
| **Build-verified this pass** | **0** — build verification deferred; nothing observed (Rule 12) |
| **Steps walked on the build this pass** | **0** — the app was not opened |
| Suite size (ours == live under group 4254 == id-map == import) | **195**, **0 foreign** (all created_by 3), sets equal both ways |

**The 28 updated cases:** SCH-DND-01/04, SCH-START-03/07, SCH-SPREAD-03/04/05/07/08, SCH-WOL-02/04,
SCH-MODAL-02/03, SCH-CAP-04, SCH-DAY-01/04/05, SCH-CONF-02/03, SCH-EDGE-05, SCH-PANEL-01…06, and the
two title fixes SCH-NAV-07 (C29931) / SCH-REAS-03 (C30054). **SCH-EDGE-05 was added to the list beyond
the original ~22** because the v30 shop-closures resolution made it stale too (same alignment category).

**TestRail writes:** **28 `update_case`, all HTTP 200, all Rule-50 byte-verified** (5 text/refs fields +
9 frozen fields re-GET and byte-compared each; 0 collateral change; verified by CONTENT not `updated_on`).
Oplog: `oplog-v30-updates.jsonl` (28 × VERIFIED_OK). **0 add, 0 delete, 0 run writes, 0 Jira writes.**
Every touched case carries the Rule-69 `AUTOMATION: Not available on Build to test Yet - Last checked
8/17/2026` marker and a v30 provenance line with read-date 17 August 2026 (sentence 2 / build check
omitted — build deferred).

## Still deferred / flagged — 2 items, with why (NOT acted on)
1. **C30075 (SCH-PERM view-only)** — INCOMPLETE against v30 (its "no creation menu" list names the two
   old menu items, not the new "Assign work order"). **Not a contradiction** (a view-only user sees no
   menu at all). Out of the SCH-FR-2 alignment scope (a permission case, owning story SV-8703).
   **Recommend a 1-line touch when next authorised.**
2. **C30015 (SCH-MODAL-08 "Delete only / no Reassign")** — carries a genuine **open PO question** (modal
   Reassign vs the §7 stacking order). **Not an alignment update; a product decision.** Left untouched
   per your instruction ("a genuine PO product decision … DO NOT act on it; keep it flagged").

## 🔴 A tech-design contradiction I must report (your 2026-08-12 ruling)
v30 §4.5/§12 now say the spread **skips weekends only** and **shop closures/public holidays receive
shifts**. This **resolves the oldest Schedule question** (register S1/X1/NQ-1/P9 — the shop-closures
contradiction, open since 22 July). **It contradicts the 2026-07-29 engineering tech plan**, which built
real closure-skipping. Per your ruling, the spec/story wins (Rule 32) and the cases follow v30 — **and I
am telling you where it contradicts the tech design**, as your ruling requires. Cases affected:
SCH-SPREAD-07 = [C29983](https://shopview.testrail.io/index.php?/cases/view/29983), SCH-EDGE-05 =
[C30089](https://shopview.testrail.io/index.php?/cases/view/30089), SCH-SPREAD-08 =
[C29984](https://shopview.testrail.io/index.php?/cases/view/29984).

## Rule 63/69 layering confirmation
The Rule-69 marker on all touched cases is a **layering, not a conflict** (core §11.6): your Rule 69
explicitly covers "verification deliberately DEFERRED for the pass", and the later build-verify sync
lifts the marker. The build-observation / expect-fail paragraphs removed this pass are preserved in
`KNOWN-FAILURES-FOR-SYNC.md` so the sync re-establishes them (SV-9006, SV-9005, the DAY-04 no-toast
fault, and the PANEL / START-07 not-built observations).

## AUTOMATED CASES CHANGED — FOR VLAD (Standing Rule 65)
**None.** Rule 65 keys off `custom_atmstatus = 3` (Automated). **No touched case is `3`.** The 9 frozen
fields byte-checked on every write include `custom_atmstatus`, proven unchanged. Three cases carry `4`
(Pending — C29931/C29937/C29939), set before this pass, not by us and not touched; `4` is not
Automated, so no tell-Vlad obligation. The other 25 are `1` (Not Automated).

## Is Schedule now fully complete?
**YES for everything in this pass's authorised scope, with two named, out-of-scope caveats.**
- **Content:** all 195 live cases are consistent and current to spec v30; **0 live contradictions**; the
  14 new stories are covered (19 new cases) and every existing case the new stories touched is aligned.
- **`requirements.md`** is the v30 baseline; **0 orphaned anchors**.
- **NOT complete in two senses, both honest and both deferred by design:** (a) **build verification is
  0** — every touched case says so via its Rule-69 marker, and the later sync resolves it; (b) two cases
  (C30075 incomplete, C30015 open PO question) are flagged, not acted on, because they fall outside
  alignment (a permission-case tidy and a genuine product decision).

## OUTSTANDING — what I need from you (all six categories swept)
1. **[go-ahead] Run 357 sync** — the 19 NEW cases are still absent from Ayesha's run 357 (`include_all`
   false, frozen at 176; union to **195** staged in `STAGED-RUN-357-SYNC.md`). A run write needs your
   explicit per-ask permission (Rules 6/34). **The 28 cases I updated are already in run 357** — no run
   change is needed for them. **Blocks:** the 19 new cases appearing in the execution run. Since 2026-08-17.
2. **[go-ahead] The build-verification sync** — to lift the Rule-69 markers to `READY` / `READY - EXPECT
   FAIL` (per `KNOWN-FAILURES-FOR-SYNC.md`). **Blocks:** any "ready to automate" figure for the new
   scope and the 28 updated cases. Since 2026-08-17.
3. **[decision] The tech-design contradiction above** (shop closures: v30 vs the 2026-07-29 tech plan).
   Spec wins and cases already follow v30; **reporting it to you is the action your ruling requires.**
4. **[another team owes] Technical design / tech plan for the Fabian scope** (Rule 30) — none supplied.
   **Blocks:** edge-case/API-contract strengthening of the new cases.
5. **[missing source] Design finality** — is Sasha's design final? If so, re-ingest and confirm the
   labels currently marked VIU-confirm. **Blocks:** pinning ~unconfirmed on-screen labels.
6. **[go-ahead, tiny] C30075 1-line alignment** (add "no 'Assign work order'" to the view-only case) and
   **[decision] C30015** (the modal-Reassign open question). Neither is a coverage gap.

Nothing else outstanding. **The v25→v30 re-ingest (previously outstanding, SCH-FR-5) is DONE; the ~22
deferred alignment updates (SCH-FR-2) are DONE (28 cases).**
