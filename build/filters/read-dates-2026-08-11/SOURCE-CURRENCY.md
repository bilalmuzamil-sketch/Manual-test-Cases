# Filters — SOURCE CURRENCY (Standing Rule 31) — read-date sweep, 2026-08-11

> Established **before** any TestRail write. This pass makes **`update_case` calls only**: no
> `add_case`, no `delete_case`, no section write, no run write, no result logged, and **zero Jira
> calls that create anything** (Rules 6 and 62, and the active creation hold at Rule 62's tail).

| | |
|---|---|
| **Sources read at pass start** | **2026-08-11 13:41Z – 13:56Z** |
| **Sources re-read immediately before the writes began** | recorded in `testrail-execution-log.md` (Rule 59) |
| **Verdict** | **SPEC CURRENT — Confluence v19, and proven current BY CONTENT, not by its version number.** The **epic child set has MOVED, 20 → 21**, and one of the new children carries a behavioural statement — see row **C** and `FINDINGS.md` §2. That movement does **not** block a read-date sweep, and it is reported rather than absorbed. |

---

## Why every date this pass writes is 11 August 2026, and why that is not back-filling

**Rule 12 bars back-filling a read-date.** Every source this pass stamps was **read live, by this
pass, today**; the timestamps are in the table below. No date was copied from another case, inferred
from a folder name, or assumed from a version number.

All the sources happen to share one date because **they were all read in one sitting, at pass start,
for exactly this purpose.** That is a fact about this pass, not a shortcut: a later pass that
re-reads only the specification will move only the specification's date, and the rest will still
carry 11 August.

**Two dates in the suite are NOT 11 August and were deliberately left alone**, because they are
honest records of earlier readings (Rule 12): C38909's *"the engineering handover … sections 3 and 8,
**read on 10 August 2026**"*, and C29600 / C29632's engineering-technical-design citations, which
already carried 11 August from earlier work today.

---

## The sources, per Rule 31

| # | Source | Identifier | Version / last-updated | Read at (UTC) | Verdict |
|---|---|---|---|---|---|
| **A** | **The specification** | Confluence page **572030978** "Filters" | **Confluence version 19**, `version.when` **2026-08-06T11:48:47.371Z**, by **Branko Cicovic**, comment *"S1-R3: filter chips display a leading type-icon per filter (align PRD with design decision / SV-8986)"*, storage body **57,028 chars** | **2026-08-11 13:41:2xZ** | **CURRENT — v19, and identical to our committed mirror. The sweep proceeds.** |
| **B** | **The build** | `https://sv8785.qa.shopview.com` | **NOT READ THIS PASS** | — | **NOT APPLICABLE, deliberately.** This pass writes **sentence 1 only**, which names documents. Sentence 2 (`Last checked against build …`) is **left exactly as found on every case**: none added, none altered, none removed. No build fact is claimed anywhere (Rules 12 / 54 / 57). |
| **C** | **The epic** | Jira epic **SV-8785** "Filters", status **Open** | **21 direct children**, verified two independent ways — `parent = SV-8785` → 21 and `"Epic Link" = SV-8785` → 21, **key sets equal in both directions, paging remainder 0**. Epic `updated` 2026-08-07T13:12:18Z; changelog **5 entries**, last one administrative (Dusan Radulovic, `QA Branch` field) | **2026-08-11 13:43:34Z** | **CURRENT, but MOVED since our recorded baseline of 20 children — and one new child carries a behavioural statement (SV-9041). Reported in `FINDINGS.md` §2; not acted on.** |
| **C2** | **The cited stories** | **SV-8786** Filter Bar Layout & Visibility (Ready for QA) · **SV-8793** Clearing Filters & Empty State (Ready for QA) · **SV-8794** Tab Behaviour with Active Filters (QA Complete) · **SV-8795** Filter Persistence (Ready for QA) · **SV-8797** Mobile Filter Bar (Ready for QA) · **SV-8798** Page Search (Ready for QA) | descriptions read in full: 1,889 / 1,677 / 1,675 / 1,769 / 1,498 / 4,398 chars; changelogs 5 / 5 / 10 / 8 / 6 / 6 entries | **2026-08-11 13:51:xxZ** | **CURRENT.** These six are the only stories any Filters case names in its provenance line. |
| **D** | **The designs** | Our committed Figma capture — `build/filters/design-screens/` (**9 `parts20_*` + 23 `reports21_*` + 27 `wo20_*` PNGs**) described in `build/filters/design-notes.md`, plus the complete 85-frame extraction in `build/filters/design-2026-07-31/` (Rule-35 queue **CLOSED at 85/85**) | Figma file `DR4gEODShYgJqkozs3mF5q`, page `11817:27678`; captured **2026-07-17**, completed **2026-07-31**. **The Figma source itself carries no version and no date**, so its currency cannot be asserted | **2026-08-11 13:53Z** | **PARTIAL as to currency, READ as to content.** Two frames were opened and looked at, not merely listed — `parts20_Inventory_11894-21846.png` (filter buttons *Bin Location · Category · Supply · Vendor*) and `reports21_Sales_11951-30535.png` (*Customer · Date*) — plus the design notes and the 85-frame inventory. **8 cases cite a design and now carry a read-date.** No live Figma re-fetch was made: no Figma token exists in this container and a re-fetch was not part of this pass. |
| **E** | **The engineering tech plan** | `build/filters/tech-plan-2026-07-29/TechPlan-AppWide-Filter-Redesign.md` | **77,875 bytes**, sha256 `db4e716821345c4a…`, last changed in git **2026-07-30**; supplied to us, **not re-fetchable** | **2026-08-11 13:52Z** | **PARTIAL as to currency** — no newer version was supplied and there is no source we can poll for one, so "current" is not asserted (Rule 12). **Read today, so a read-date is honest. 3 cases cite it.** |
| **F** | **PO answers — three files** | `branko-answers-2026-07-17/answers-ingested.md` (11,900 bytes, sha256 `22d8782d1575…`) · `branko-answers-2026-07-31/answers-ingested.md` (12,987 bytes, sha256 `aa05f97753ed…`) · `branko-answers-2026-08-04/answers-ingested.md` (51,204 bytes, sha256 `0e6893a49fc6…`) | ingested 2026-07-17 / 2026-07-31 / 2026-08-04 | **2026-08-11 13:52Z** | **CURRENT as records.** Cited by **4 / 1 / 9** cases respectively. The separate standing item — Branko's Parts/Reports write-up is still outstanding — is unchanged by this pass. |
| **G** | **The engineering handover** | `build/handover-ingest-2026-08-10/FILTERS-RECONCILIATION.md` (32,383 bytes, sha256 `c587a56c740d…`) — our reading of the handover branch `SV-8785-app-wide-filter-redesign` | ingested 2026-08-10 | not re-read this pass | **DELIBERATELY NOT STAMPED.** C38909 cites the handover itself with an honest **10 August** read-date, which stands; the `.md` file beside it is *our reading record*, not a source, so it takes no read-date (`FINDINGS.md` §4). |

### How the specification was proven current BY CONTENT (Rule 31 trap (a))

This page's **in-body "Version:" field reads `1.6`** and has done for months — the exact trap. So the
live storage body was flattened and compared against our committed v19 mirror
(`build/filters/vlad-gap-review-2026-08-06/evidence/spec-v19-flattened.txt`):

| Check | Result |
|---|---|
| Confluence `version.number` | **19** both sides |
| Flattened length | **43,209 chars** both sides |
| **Whitespace-normalised sha256** | **`1c53e98eb3fea0c2cf00590efd65061a1cdbb21990b5f552201ab4531daf215b` — IDENTICAL** |
| 6-word runs present live and absent from the mirror | **0** |
| 6-word runs present in the mirror and absent live | **0** |
| Requirement anchors | **132 live / 132 mirror, sets equal both directions** |

The only raw differences are newline-versus-space at inline-tag boundaries, an artefact of the two
passes' different flatteners. Tool: `tools/spec_compare.py`; live flattened text committed as
`evidence/spec-v19-live-flattened-2026-08-11.txt`.

## What the 114 cases actually cite (measured from live text, not assumed)

| Source named in the provenance line | Cases |
|---|---|
| epic **SV-8785** | **113 of 114** — C29600 names its story SV-8793 instead, which is itself a child of the epic |
| the **Filters specification at Confluence version 19** | **114 of 114 mention it**, but only **101 CITE it as a source** (84 stamped now + 17 already dated). **13 name it only to say it does NOT cover the point** — see `FINDINGS.md` §3 |
| a **story** (SV-8786, SV-8793, SV-8794 ×4, SV-8795, SV-8797, SV-8798) | **9** |
| a **design** (*"the designs"* ×7, *"the Reports filters design"* ×1) | **8** |
| **Branko's answers** (2026-08-04 ×9, 2026-07-17 ×4, 2026-07-31 ×1) | **14** |
| the **engineering tech plan** file | **3** |
| the **engineering technical design** (prose citation, C29600 / C29632) | **2 — already dated** |
| the **engineering handover** (C38909) | **1 — already dated 10 August** |

**Cases already carrying at least one read-date before this pass: 18.** Of those, **17 carried it on
the specification only**, leaving the epic (and on C29558 the story) undated; C29600 carried it on the
specification and the technical design, leaving its story undated. **So under the amendment's
per-source requirement, NONE of the 114 was already complete.**

## Run 352, before the writes

`include_all` **false** · **114** tests · **473** result records · counters 65 Passed / 7 Failed /
0 Blocked / 42 Untested. Snapshots in `snapshots/`. The after-state proof is in
`testrail-execution-log.md`.

## Foreign cases (Rule 38)

**5, and they are hands-off.** Live under group 4110 there are **119** cases: **114 ours**
(`created_by = 3`) and **5 authored by user 7, Ahtasham Amjad** — **C43576, C43577, C43578, C43579,
C43580**, all on story SV-8799 (*Remove Page Filtering from Global Search*), `template_id` 2,
`custom_atmstatus` null, `updated_by` 7. The honest two-number report is **ours 114 / live total
119**. They were **read only**, excluded from every count and every write, and proven byte-identical
after the writes by content **including `updated_on` and `updated_by`**.

## TestRail's own Automated flag (Rule 65)

**4 of our 114 carry `custom_atmstatus = 3` (Automated): C29600, C29614, C29623, C38877.** The other
**110 read `1` (Not Automated)**; the 5 foreign cases carry **null**. The flag was re-read **at write
time** on every case — see `AUTOMATED-CASES-CHANGED.md`, which is not empty.

## Raw-markup census (playbook §J hazard #5)

**0 of 114, measured 2026-08-11 13:56Z, before any write** — all four tester-facing fields of every
case checked for `<p>`, `<ol>`, `<ul>`, `<li>`, `<br>`, `<hr>`, `<a>`, `<div>`, `<span>`, `<strong>`,
`<em>`. The 5 foreign cases are also clean. **This is true of the moment it was taken and of no other
moment**: TestRail re-renders tester text into HTML hours after a write without moving `updated_on`,
so the count is a measurement, never a durable state.
