# Jira epic re-check — 2026-07-31 roll-up

**Why this was run:** to make sure no active project is working from a stale Jira source, after the Filters Confluence spec turned out to be 8 versions behind. The user's Jira status screenshot showed both active epics with "updated" dates *after* our ingest dates, which looked like drift.

**Access:** live Jira REST v3 with the saved session in `/tmp` — `GET /rest/api/3/myself` = **HTTP 200** as Bilal Muzamil. No fabrication, no secrets in this repo.
**Scope of this pass:** analysis + ingest ONLY. **No test case was edited. No TestRail write of any kind.** The deliverable is the change plan below.
**Live-build check:** not applicable and not run (Rule 22) — this pass reads Jira only. Nothing here is presented as build-verified; items needing live confirmation are marked as VIU-time.

---

## The headline, in plain words

1. **Schedule (SV-8685) is completely unchanged since we ingested it.** Same 15 stories, same statuses, no text edits, no comments. **Good result — nothing to do.**
2. **Report Suite (SV-8582) has no new and no removed stories either — but 7 stories changed status.** The 6 engineering build stories we had written off as OBSOLETE/superseded were **reopened to Open on 2026-07-29** by a developer, and the QuickBooks precision story is now **In Progress**. Their content is live engineering truth again, not history.
3. **Both epics' "updated" dates in the screenshot are false alarms.** In both cases the last edit was the **QA Assignee field being set by the user's own Jira account** — administrative, no product content, and already captured in our ingest docs.
4. **There is no Jira epic for Filters at all.** All 170 SV epics were enumerated; none is Filters. This is confirmed absence, not a failed lookup.
5. **One genuine coverage gap found across everything: 1 area / 2 candidate cases** (QuickBooks + fractional-quantity precision, Report Suite / Parts Velocity).
6. **One real contradiction found:** an SBR case asserts Escape does NOT close the deactivate dialog, while the spec requirement wants Escape to close it — engineering has flagged it as an open decision.
7. **Two side-findings the user will want to know:** a **"Simple Flow V2" epic (SV-8683) is Open with 7 children** even though we marked Simple Flow COMPLETED, and the **Report Suite suite has zero Rule-20 `refs`** on any of its 529 case bodies.

---

## The single table

| Project | Epic | Stories then / now | New | Changed | Done-since ingest | Genuine gaps | Contradictions | Verdict |
|---|---|---|---|---|---|---|---|---|
| **Schedule** | **SV-8685** (Open) | **15 / 15** | **0** | **0** | **0** | **0** | **0** | **UNCHANGED since ingest — nothing to do** |
| **Report Suite** | **SV-8582** (Open) | **97 / 97** | **0** | **7** (6 reopened OBSOLETE→Open, 1 Open→In Progress) | **0** (nothing shipped; movement was the reverse) | **1 area / 2 cases** | **1 real + 1 watch + 1 doc-level** | **Delta is real — 6 stories' content is live again; act on the list below** |
| **Filters** | **NONE EXISTS** | n/a | n/a | n/a | n/a | n/a | n/a | **No Jira epic — 170 SV epics enumerated, none is Filters. Ask Branko / the user.** |

Counts were verified two independent ways for both epics (`parent = <epic>` and `"Epic Link" = <epic>`), with identical key sets and no paging remainder (Rule 17). Totals found: **SV-8685 = 15 children + 1 epic**; **SV-8582 = 97 children + 1 epic**. Comments and attachments across both epics and all 112 children = **0 and 0** — no images or videos to analyse.

Per-project detail:
- `SCHEDULE-EPIC-DELTA.md`
- `REPORT-SUITE-EPIC-DELTA.md`
- `FILTERS-EPIC-SEARCH.md`
- raw evidence in `raw/` (epic + all children JSON, per-epic analysis text, verbatim reopened-story text, the epic-hunt logs)

---

## Prioritized action list

Cross-referenced so the follow-up work can be executed without re-deriving anything.

| # | Priority | Action | Project / owner | Driving ticket (status) | Cross-reference |
|---|---|---|---|---|---|
| 1 | **HIGH** | **Author 2 new cases** for the one genuine gap: (a) a part sold in a **fractional quantity** keeps its exact fractional Units Sold (no rounding to a whole number); (b) the **QuickBooks journal entry dollar amount** for a fractional inventory movement is exact, not multiplied. Place in a section titled with "API" per Rule 4. Zero cases in the 529-case source mention QuickBooks; zero PV cases mention fractional quantities. | Report Suite | **SV-8589** (**In Progress** — being built now, so it becomes testable soon) | `REPORT-SUITE-EPIC-DELTA.md` §4 + §6 item 1 |
| 2 | **HIGH** | **Get Chris Ward's ruling on the SBR Escape-key conflict**, then align **SBR-DEACT-04 = C30255** (https://shopview.testrail.io/index.php?/cases/view/30255) under authorization. Our case says *"Escape and clicking outside do not"* dismiss; the story says verbatim *"S13-R8 wants Esc-to-dismiss but Golden Rule #9 forbids Esc — surface as decision."* | Report Suite | **SV-8599** (Open) | already a question in `build/report-suite/PO-Questions-Chris-ReportSuite-2026-07-27.md` ("SBR Esc vs Golden-Rule") |
| 3 | **HIGH** | **Ask the user / Branko for the Filters epic key** — or confirm the Filters work is genuinely not ticketed in Jira. Until then Filters' ~110 local / 94 live cases cannot satisfy Rule 20 traceability (there is no ticket to cite). | Filters | none exists | `FILTERS-EPIC-SEARCH.md` |
| 4 | Medium | **Get Chris Ward's confirm on the SBC permission bundle** (*"43rd bundle vs ride existing — product call"*), because the answer changes the tester's setup step. Our SBC-PERM-01/02 = **C30098 / C30099** are correct either way. | Report Suite | **SV-8598** (Open) | same PO questions doc; `REPORT-SUITE-EPIC-DELTA.md` §5 C-2 |
| 5 | Medium | **Refresh `build/report-suite/epic-sv8582/RECONCILIATION.md`** — it still calls SV-8594–8599 "OBSOLETE … superseded" and their content "Historical detail only". They are **Open** again. No case impact; documentation honesty only. | Report Suite (folder owned by another worker this session — hand off) | SV-8594–8599, SV-8589 | `REPORT-SUITE-EPIC-DELTA.md` §5 C-3 |
| 6 | Medium | **Backfill Rule-20 `refs` on the Report Suite suite.** Independent finding: **0 of 529 local case bodies carry a `refs` field** and `testrail-id-map.csv` has **no refs column**. The 97-story map is now re-verified, so per-story `<TICKET> (<spec-anchor>)` refs are derivable. Working precedent: `build/schedule/epic-sv8685/backfill_refs.py`. | Report Suite (hand off) | epic **SV-8582** + per-report stories | `REPORT-SUITE-EPIC-DELTA.md` §6 item 5 |
| 7 | Medium | **Decide what to do about "Simple Flow V2" (SV-8683, Open, 7 children)** — see the side-findings below. Simple Flow is recorded as COMPLETED, but this epic carries live enhancement stories. | Simple Flow / QA lead call | **SV-8683** (Open) | this doc, side-finding A |
| 8 | Low | Record **QA Assignee = Ayesha Khan** on the Schedule project state doc (new fact from the epic; our docs name the PO but not the QA). | Schedule (folder owned by another worker — hand off) | SV-8685 | `SCHEDULE-EPIC-DELTA.md` §3 |
| 9 | Low (VIU-time) | Record the exact permission atom **`ROLE_SALES_BY_CUSTOMER_REPORT::VIEW`** in the SBC permission cases' metadata and confirm it live. | Report Suite | SV-8598 | `REPORT-SUITE-EPIC-DELTA.md` §6 item 6 |

---

## Paused / completed epics — one line each ("has it moved?")

Checked live; **no deep ingest**, as instructed.

| Epic | Project | Status now | Children | Last real change | Moved since our work? |
|---|---|---|---|---|---|
| **SV-7301** | Simple Flow (Simple Mode) | **Done** | 25 | 2026-07-27 — `status 'Dev Complete' -> 'Done'` + `resolution -> Done`, by **Milos Vasic** | **Yes, but only to close it.** The epic was signed off Done on 2026-07-27, consistent with our COMPLETED ruling. Nothing reopened. |
| **SV-7387** | Fees & Discounts | **Ready for Production** | 24 | 2026-07-27 — `status 'TESTING STAGE' -> 'Ready for Production'`, by **Nemanja Djuric** | **Yes, forward only.** Promoted out of testing to Ready for Production — matches our COMPLETED ruling. Nothing reopened. |
| **SV-7388** | Custom Roles | **Done** | 269 | 2026-07-27 — `Fix Version '' -> 'v0.68'`, by **Dusan Bulovan** | **No behaviour change.** Only a release-version stamp (v0.68), which is exactly the release our 2026-07-27 post-v0.68/v0.69 regression already covered. |
| **Global Search** | Global Search v2 | **epic key still unknown** | — | — | **Cannot be answered.** No epic matches the v2 PRD. The only candidates are **SV-3770 "Global search enhancement"** (Open, 2 children, last touched 2026-04-17 — long predates the v2 PRD) and **SV-1495 "[ARCHIVED] Global Search"** (Done, archived 2025). **Neither is claimed as the project's epic.** Project is POSTPONED, so no action needed beyond asking for the key if it is ever resumed. |

---

## Two side-findings worth raising

**A. A "Simple Flow V2" epic is Open — SV-8683 (7 children), even though Simple Flow is recorded COMPLETED.**
It was linked to SV-7301 by Milos Vasic on 2026-07-27, the same day SV-7301 was closed. Children:

| Key | Type | Status | Summary |
|---|---|---|---|
| SV-8495 | Bug | Ready to Fix | Complete-from-line fails with "unfulfilled part request" when receiving is not required |
| SV-8497 | Bug | **Done** | Quick-add part without part number forces category selection — should default |
| SV-8540 | Task | Board Backlog | [Enhancement] Add a "Receive all" button when receiving parts directly from a work order |
| SV-8581 | Bug | **Done** | Invoice Balance displays $NaN when fixed line total or fixed labor total contains … |
| SV-8680 | Bug | **Done** | Invoice Total displays $NaN when labor rate contains four or more digits |
| SV-8726 | Story | Open | [Enhancement] Rename the "Total Price" column to "Total Cost" on the Purchase Order page |
| SV-8734 | Story | Open | Bulk Approve / Decline Work Order Lines |

Three bugs are already **Done** (shipped behaviour changes touching Simple Flow surfaces we have cases for) and two are net-new **enhancement stories**. This is outside the scope the coordinator set for this pass (paused/completed epics were one-line only), so **nothing was ingested or authored** — but it is a live V2 workstream against a project we consider finished, and it deserves a QA-lead decision on whether Simple Flow reopens.

**B. `Custom Roles & Permissions | Follow-up Defects` (SV-8406, Open, 5 children)** — 4 Done, 1 in Code Review (**SV-8412** *"Sales Representative | Global Search Allows Access to Catalog Without Catalog Permission"*). Last epic edit 2026-07-17, so it predates and is consistent with the 2026-07-27 Custom Roles release regression already on record. No action from this pass; noted because the standing rule is to re-run the Custom Roles regression after every release.

---

## Honest limits of this pass

- **Jira only.** No live build was driven and no TestRail was read or written. Coverage verdicts were derived from our own local case sources (`build/report-suite/cases/*.json`, `testrail-id-map.csv`) read **read-only** — they say what our cases *assert*, not what the build *does*. Build conformance is still a VIU-time question.
- **Confluence specs were NOT re-checked.** This pass answers "has Jira drifted?" only. The Filters stale-spec incident was a **Confluence** problem, and a Confluence-side recheck (Rule 23) is a separate job that still needs doing for the active projects.
- **Comment/attachment scan is complete but trivially so** — both epics genuinely have 0 comments and 0 attachments across all 112 issues, so there was no discussion thread to mine.
- The 6 reopened stories' **descriptions did not change**; only their status/authority did. So no requirement text needed re-ingesting — the text in `build/report-suite/epic-sv8582/requirements-SV-859*.md` is still verbatim-accurate.
