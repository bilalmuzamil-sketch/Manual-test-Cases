# SOURCE CURRENCY — Filters + Schedule handover/design-review ingest — 2026-08-10

**Standing Rule 31.** Every source this pass rests on, with its identifier, the version-or-last-updated
value, the date checked, a verdict, and — where the verdict is not CURRENT — the **exact shortfall**.

**Nothing was written to TestRail or Jira. No build was opened.** `quick-login` and `switch-user` were
deliberately not called (the brief bars them and both rotate the shared session).

---

## The table

| # | Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|---|
| 1 | Filters engineering handover | `ed9bc33e-FIlters_HANDOVERAppWideFilterRedesign.md`, branch `SV-8785-app-wide-filter-redesign` | no version, no date in the document | 2026-08-10 | **CURRENT as an artefact · PARTIAL as a statement about requirements** — see §1 |
| 2 | Schedule design review | `af54d7ba-Schedule_scheduledesignreview20260805.md`, Fabian / Sasha Weekly | dated **Aug 5, 2026** in its own header | 2026-08-10 | **CURRENT as an artefact · PARTIAL as a scope decision** — see §2 |
| 3 | Filters specification | Confluence page **572030978** "Filters", space `SHOPVIEW` | **lastModified Aug 06, 2026**; in-body field reads **"Version: 1.6"** | 2026-08-10, fetched live, HTTP 200 | **CURRENT** — see §3 |
| 4 | Schedule specification | Confluence page **713031682** "Schedule", space `SHOPVIEW` | **lastModified Aug 07, 2026**; in-body field reads **"Version 1.0"** | 2026-08-10, fetched live, HTTP 200 | **CURRENT live · our MIRROR is STALE** — see §4 |
| 5 | Filters epic | **SV-8785** | not re-enumerated this pass | — | **NOT CHECKED** — declared, see §6 |
| 6 | Schedule epic | **SV-8685** | not re-enumerated this pass | — | **NOT CHECKED** — declared, see §6 |
| 7 | Jira tickets this pass rests on | SV-8915, SV-8916, SV-8917, SV-8837, SV-8843, SV-8844, SV-8824, SV-8832 | read live, read-only | 2026-08-10 | **CURRENT** — see §5 |
| 8 | Designs (both projects) | Figma nodes (Filters) · `claude.ai/design/p/d3cdcf5c…Schedule.dc.html` (Schedule) | **no version, no date on either** | 2026-08-10 | **PARTIAL** — see §7 |
| 9 | Build (either QA branch) | — | — | — | **NOT OBSERVED** — see §8 |

---

## 1. The Filters handover — what it is, and what it is not

It is an **engineering handover**, self-described as *"Single self-contained handover (feature and E2E)
for the developer taking this over."* It is **current** in the sense that it describes the branch as it
stands, and it is **specific and checkable** — it names commits, file paths and test ids.

**It is PARTIAL as a statement about requirements, for two reasons, and both matter:**

**(a) It names the PRD as "currently v1.6".** That is the **in-body** field of Confluence page 572030978,
which has read `1.6` while the real page version advanced — the **Rule 31 trap (a)** this project has
already been caught by twice. Our own record puts the live page at **version 19** as of 2026-08-06.
**So the handover's author was reading the same misleading field we were.** Practically: the handover may
predate requirements added in v17–v19, and **anywhere it says "the PRD says X" that claim is only as
current as v1.6-as-displayed.**

*Honest limit:* I **could not read the Confluence version integer this pass.** The Atlassian MCP's
`getConfluencePage` and `searchConfluenceUsingCql` return `lastModified` but **not** `version.number`, and
no Confluence REST credential was available in this container (`/tmp` was reaped). **The verdict "v19" is
carried from the 2026-08-06 fetch, not re-measured today.** What I *can* state from today's live fetch is
the **lastModified date (Aug 06, 2026)**, which is the same day that fetch recorded v19 — consistent with
the page not having moved since. **Stated as a limit, not papered over.**

**(b) It is an engineering document.** Under **Standing Rule 30** a tech plan *informs but never overrules*
product truth. **Whether that still holds for a "technical design"/handover is an open question to the QA
lead** (`QUESTIONS.md`, QA-1) and the brief flags it as open. Until it is settled, **every place this
handover disagrees with the PRD is RAISED in `FILTERS-RECONCILIATION.md`, not resolved.**

---

## 2. The Schedule design review — current, but its scope column is not a ratified V1 list

Dated **Aug 5, 2026** in its own header, sourced from *"Granola meeting notes for that session"* with the
caveat, verbatim: *"the review text did not come through in the original request; findings below are
extracted from the meeting record."* So it is a **second-hand extraction of a meeting**, which is worth
knowing before any of its rows is treated as a requirement.

**Its own gate line is the reason its "In Scope?" column is PARTIAL:**

> *"**Gate:** V1 must-have vs. fast-follow list due to Fabian before the **Thursday release decision**."*

**The V1 list was still DUE at the time of writing.** So the column records the review's *recommendation*,
not a closed decision — which is exactly why item E11 does **not** settle Branko's question 8
(`BRANKO-SHEET-RECHECK.md`, S2-Q8).

---

## 3. Filters specification — CURRENT

Fetched live 2026-08-10 via `getConfluencePage` on page **572030978**, HTTP 200, full body retrieved.
`lastModified` **Aug 06, 2026**, author Branko Cicovic.

**In-body "Version" field reads `1.6`. That is the Rule 31(a) trap and it is what the handover quotes.**

Requirement text this pass rests on was read from the **live body**, not from a mirror:
S1-R1, S1-R3, S2-R7, S9-R2, S9-R3, S10-R2, S10-R5, S11-R3, S11-R6, S11-R7, S12-R2, S12-R6,
S13-R14, S13-R22, S13-R23, S13-R24, S13-R25, S14-R6, and the Key Decisions block.

**Two things confirmed still true in the live body**, both of which the sheet rests on:
- **S12-R2's cross-reference is still wrong** — it says *"with one exception (see S12-R5)"* where the real
  exception is **S12-R6**. Sheet Section 4 item 1 stands.
- **S9-R2 / S9-R3 still hide the Status chip** on Estimates and Completed. Sheet Section 1 item 1 stands.

---

## 4. Schedule specification — live CURRENT, our mirror STALE, and the shortfall named

Fetched live 2026-08-10, page **713031682**, HTTP 200. `lastModified` **Aug 07, 2026**.

**Our newest mirror is `build/schedule/spec-v25-2026-08-06/evidence/raw-v25.xml` = Confluence v25,
published 2026-08-06T09:13:51Z. The live page was modified 2026-08-07 — so the page has moved at least
once since our mirror, and our record (CLAUDE.md, the register) still says v23.**

**Exact shortfall, as Rule 31 demands it be named:**

> The **v25 → current diff has NOT been done.** We do not know what the 7 August edit changed.
> `build/schedule/spec-v25-2026-08-06/SPEC-DIFF.md` covers only v23 → v25.

**What WAS proven this pass**, so the shortfall is bounded rather than open-ended: the **twelve sentences**
the Branko sheet and this reconciliation rest on were probed against the v23, v24 and v25 mirrors and
against the live body, and **every one is unchanged**:

| Sentence | v23 | v24 | v25 | live |
|---|---|---|---|---|
| *"The full 24-hour timeline remains intact and scrollable."* | 1 | 1 | 1 | present |
| *"Auto-scroll to business hours."* (§4.8 heading) | 1 | 1 | 1 | present |
| *"auto-scrolls so the working-day start…"* | 1 | 1 | 1 | present |
| *"…with a small 30 to 60 minute buffer before it"* | 1 | 1 | 1 | present |
| *"…otherwise 7:00 AM"* | 1 | 1 | 1 | present |
| *"…so no shifts are off-screen"* | 1 | 1 | 1 | present |
| *"Shop closures and public holidays are not skipped in V1"* (§4.5) | 1 | 1 | 1 | present |
| *"…block the spread step from placing shifts on those days"* (§12) | 1 | 1 | 1 | present |
| *"Left-click on empty grid space"* (§7) | 1 | 1 | 1 | present |
| *"right-click context menu"* (§14.1, §14.2) | 2 | 2 | 2 | present ×2 |
| *"Estimated hours with inline edit."* (§4.9) | 1 | 1 | 1 | present |
| *"…with labor/status figures"* (§4.9) | 1 | 1 | 1 | present |

**And two absences, proven the same way and load-bearing for `SCHEDULE-RECONCILIATION.md`:**

| String | v23 | v24 | v25 | live |
|---|---|---|---|---|
| `Add Existing Work Order` | **0** | **0** | **0** | **absent** |
| `carryover` / `Carryover` | **0** | **0** | **0** | **absent** |

So the two headline design-review items — **B4's button** and **E15/E7/E8's carryover action** — have
**never appeared in any Schedule spec version we hold, nor in the live body.**

---

## 5. Jira — read live 2026-08-10, read-only, no writes, no tickets created (Rule 62)

| Key | Summary | Type | Status | Priority | Parent | Reporter |
|---|---|---|---|---|---|---|
| **SV-8915** | Schedule: view opens at midnight instead of the first business hour | Bug | **OBSOLETE / Done** | High | SV-8685 | Sasha Grosman |
| **SV-8916** | Schedule: "Add Existing Work Order" button missing from build | Bug | **Blocked** | Medium | SV-8685 | Sasha Grosman |
| **SV-8917** | Schedule: conflict label reads "working hours" instead of "business hours" | Bug | **TESTING QA** | Medium | SV-8685 | Sasha Grosman |
| SV-8837 | Day view does not auto-scroll to the working-day start | Story Defect | Ready for QA | High | SV-8694 | Mudassir Qamar |
| SV-8843 | Filter bar sits on the same row as the tabs… | Bug | **OBSOLETE / Done** | Low | — | **Bilal Muzamil (ours)** |
| SV-8844 | Page Search is not working Anymore | Bug | **OBSOLETE / Done** | Low | — | **Bilal Muzamil (ours)** |
| SV-8824 | Multi-select filter dropdown closes after each selection | Story Defect | **QA Complete** | Medium | SV-8787 | Ahtasham Amjad |
| SV-8832 | Deleted filter value still applied to table results (S10-N1) | Story Defect | **Open** | Medium | SV-8795 | Ahtasham Amjad |

**Three of these change what we thought:**
- **SV-8915 is already OBSOLETE/Done** — Branko closed it as a duplicate of **SV-8837**, which is still
  **Ready for QA**. So B1 is *covered*, not new.
- **SV-8916 is Blocked**, which corroborates the review's own *"Needs confirmation with Bronco as to
  whether it was dropped in build or never scoped"* — it is **an open product question, not a defect we
  can author against.**
- **SV-8844 was reported by us and is now OBSOLETE/Done.** See `FILTERS-RECONCILIATION.md` F-06: the
  handover says that behaviour is **the intended design**, so this was very likely never a defect.

---

## 6. Epics — NOT re-checked this pass, and that is declared rather than implied

**Standing Rule 37** splits the epic check into a cheap Tier-1 currency check and an expensive Tier-2 full
re-read. **Neither was run**, because the brief scopes this pass to the two documents, the two specs and
the question sheet, and a Tier-2 re-read needs the QA lead's authorisation.

**Consequence, stated plainly:** if a story under SV-8785 or SV-8685 changed status or description since
our last ingest, **this pass would not know.** Nothing in this pass's verdicts depends on a story field —
every verdict traces to a spec sentence, a document sentence, or a case's own text — but the gap is real
and is carried into `QUESTIONS.md` (QA-6).

---

## 7. Designs — PARTIAL, both projects, and the shortfall is the same on both

**Filters:** the handover states, verbatim, *"The visual components were built from existing app
components while Figma was rate-limited — they are **not** pixel-perfect"*, and §7 items 4–6 owe a PM
sign-off, a layout fix pass and a Figma-fidelity pass. **So the Figma nodes describe a target the build is
not yet held to.** Exact shortfall: *we cannot tell which visual differences are defects and which are
known unfinished work, because the PM's authoritative list of style deltas does not exist yet.*

**Schedule:** unchanged from `build/schedule/spec-v25-2026-08-06/DESIGN-SOURCE.md`. We hold a Claude
prototype with **no version and no date**; the three 5 August tickets cite a `claude.ai/design/p/…` share
URL, also with **no version and no date**; **~48 of our on-screen labels were pinned from the one we
hold.** The new design review's header cites **the same `d3cdcf5c…Schedule.dc.html` link the live spec's
Design row cites** — which is *suggestive* that the two are the same artefact, but a share link resolves to
whatever the page contains when opened, so **it does not establish it**. Sheet Section 1 item 5 stands
unchanged and is still the right ask.

---

## 8. Build — NOT OBSERVED, and every build-side statement is flagged as such

No QA-branch sign-in exists (`/tmp` reaped over the weekend); the brief bars `quick-login` and
`switch-user`. **This is a documents job and did not need the build** — but it means:

- **every verdict in this pass is document-derived**, and where a row needs a live look it says so;
- the **Rule 49 queues stay OPEN** on both projects and **all verdicts remain PROVISIONAL**;
- one incidental observation worth recording: **our own cases no longer agree on which build they were
  last checked against** — `SCH-CONF-02`/`SCH-CONF-03` say **`v3.5-d122eef` on 8/5/2026** while
  `SCH-DAY-01` says **`v3.5-7ec992f` on 8/6/2026**, and CLAUDE.md's Schedule section says
  **`v3.5-be42149`**. That is three markers for one branch. **Reported, not repaired.**

---

## Verdict in one line

**Both new documents are genuinely current and genuinely useful; the Filters PRD is current; the Schedule
PRD has moved past our mirror by one edit we have not diffed; the designs are PARTIAL on both projects;
the epics were not checked; and nothing was observed on a build.** No deliverable in this folder claims
completeness against a stale source, and the one stale item — the Schedule v25 → current diff — is named
above with its exact shortfall and carried into `QUESTIONS.md`.
