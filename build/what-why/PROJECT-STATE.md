# What Are You Doing / Why Are You Doing It — PROJECT STATE (canonical cold-resume doc)

> **🔴 BEFORE DOING ANY WORK ON THIS PROJECT, READ [`../skills/README.md`](../skills/README.md).**
> Start with [`../skills/00-COMMON-CORE.md`](../skills/00-COMMON-CORE.md), then the one skill for
> your job. **This project's intake was run on 2026-10-13 under
> [`../skills/15-NEW-PROJECT-INTAKE.md`](../skills/15-NEW-PROJECT-INTAKE.md); its verdict is
> [`INTAKE-2026-10-13.md`](INTAKE-2026-10-13.md) and the verbatim source set is
> [`requirements.md`](requirements.md). Read those two before touching anything.**

**Read this first to resume this project.**

---

## 0 · STATUS / WHAT'S LEFT TO DO — read first (Last updated 2026-10-13)

**STATUS: INTAKE COMPLETE — NOTHING ELSE HAS STARTED, AND THE PROJECT TYPE HAS NOT BEEN ANSWERED.**

**The headline, in one line: the suite is not empty — 19 cases for this feature have been live in
TestRail since 2026-09-30, every one ours, and this workspace had no record of them until today.**

| Thing | Where it stands on 2026-10-13 |
|---|---|
| **Intake checklist** | **5 of 7 core inputs PRESENT, 1 MISSING, 1 PRESENT-but-unread** — and **input 0, the PROJECT TYPE, is unanswered**, which routes everything else |
| **Cases** | **19 ours / 19 live / 0 foreign** in group **20437**, sections 20461–20464. Authored 2026-09-30, last edited 2026-10-09. **Bodies NOT yet audited against the current source** |
| **Test run** | **None exists.** R495 is a different feature's run and contains none of our cases |
| **Source** | PRD **Confluence 845348896, version 13**, read 2026-10-13 — **CURRENT** |
| **Build** | **`sv10130.qa.shopview.com`** and **`qb1.qa.shopview.com`**, both HTTP 200 at **`v26.40.12-3d99e53`** on 2026-10-13. **Nothing has been build-verified. No verdict has been taken** |
| **Jira** | **0 tickets created** — Rule 62's 2026-08-10 hold is treated as ACTIVE until told otherwise |

### What is left to do, in order

1. **Get the project type answered** (Skill 15 §1a). Our evidence says **(ii) V2/UPGRADE in substance,
   run on the (iii) REVIVAL path** — `INTAKE-2026-10-13.md` §3. **If (ii) is confirmed, Rule 96 and
   `../skills/17-REGRESSION-IMPACT-V1-TO-V2.md` are mandatory**, and that skill's inputs **0a and 0b
   are MISSING** — so by Rule 1 the baseline cannot be started on what we hold.
2. **Decide what happens to the 19 existing cases** — reconcile against PRD v13 and report the delta
   (Skill 15 §7), extend, or leave alone. **Not ours to choose.**
3. **Get the eight source conflicts ruled on** — `requirements.md` §4, Q1–Q8. Four of them change a
   literal string a tester must match, and one asks whether a whole surface exists.
4. **Get the engineering tech plan** — it exists and is login-walled, and it carries **FR-001…FR-018
   and NFR-001…NFR-004**, which all four verification tasks reference and we cannot read.
5. **Only then**: the Rule-43 coverage matrix (both directions), the Rule-40 surface matrix, the
   Rule-46 deliberate-decisions register.

### What is blocking / awaiting

- **The project type** (QA lead) — blocks the method, not just the paperwork.
- **The design artefact** `Pz1Q6BfvreYFpQwVQZPTE6` — a parallel worker reports it unreadable; see
  [`BLOCKED-design-artifact-2026-10-13.md`](BLOCKED-design-artifact-2026-10-13.md). **Do not open it
  from this lane.**
- **The tech plan** — `https://powertools.shopview.com/md-viewer/2cb42c08-40ef…` *(full id below)*,
  302 → Google SSO.
- **Permission to touch the 19 cases at all**, including the stale automation markers (§5 below).

---

## 1 · Project identity

- **Project:** What Are You Doing / Why Are You Doing It — renaming the two work order line fields to
  **Title** and **Description**, and removing our field names from the line text that reaches a
  shop's accounting records. ShopView App feature.
- **Spec doc title:** "What Are You Doing / Why Are You Doing It?" (in-body heading: *"Title and
  Description, Product Spec"*).
- **Canonical spec URL (confirmed 2026-10-13):**
  `https://shopview.atlassian.net/wiki/spaces/~712020aa00b8d6a71f4259891982a304227c20/pages/845348896/What+Are+You+Doing+Why+Are+You+Doing+It`
- **Confluence page id: `845348896`** · **space id** `526057474` · **space key**
  `~712020aa00b8d6a71f4259891982a304227c20` (a personal space — **Chris Ward's**, not a team space).
- **Confluence version at ingest: `13`** (read 2026-10-13). The in-body status line reads *"Locked for
  build - 2026-09-16"* — **that is the in-body field, not the version** (Rule 31 trap (a)).
- **PO: Chris Ward** — the PRD's "Owner" field, and the epic's reporter, creator **and** assignee.
  *(Never mix PO attributions across projects: What/Why = Chris Ward; Report Suite = Chris Ward;
  Fees & Discounts = Chris Ward; Schedule / Filters / Global Search = Branko; Simple Flow = Milos.)*
- **Epic / Jira key: `SV-11257`** — `https://shopview.atlassian.net/browse/SV-11257`
  Created **2026-10-13**, status **TESTING QA**, priority **Medium**, **Product Area: Work Orders**,
  no labels, no fix version, no components. **Split out of SV-9667 (Founder Mode Batch #1) on
  2026-10-13**, and `relates to` **SV-9667**.
- **Children: 8, verified two ways** — `parent = SV-11257` → **8**; `"Epic Link" = SV-11257` → **8**;
  no paging remainder. **4 Stories + 4 Tasks**, all **TESTING QA**, all **Medium**, all assigned to
  **Nemanja Djuric**.
- **Design:** Claude artefact `https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6` — an **undated,
  editable share link**, so latest-wins cannot be applied to it (Rule 54). **Owned by a parallel
  worker; not opened from this lane.**
- **Engineering tech plan:** *"Title and Description — Technical Implementation Plan"*,
  `https://powertools.shopview.com/md-viewer/2cb42c08-54d6-40ef-b98b-696198c19feb` —
  **exists, login-walled, not held.**
- **TestRail:** suite **1**, group **20437** ("What/Why") under section **20434**
  ("Founder Mode (September 2026)").
  `https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=20437`
- **Project type: NOT ANSWERED.** Provisional reading **(ii) V2/UPGRADE on the (iii) REVIVAL path** —
  `INTAKE-2026-10-13.md` §3.

### The epic's children

| Key | Type | Status | Assignee | Summary |
|---|---|---|---|---|
| [SV-10130](https://shopview.atlassian.net/browse/SV-10130) | Story | TESTING QA | Nemanja Djuric | Title and Description - Story 1 - The Work Order Line Dialog |
| [SV-10131](https://shopview.atlassian.net/browse/SV-10131) | Story | TESTING QA | Nemanja Djuric | Title and Description - Story 2 - The ShopCoach Line Builder |
| [SV-10132](https://shopview.atlassian.net/browse/SV-10132) | Story | TESTING QA | Nemanja Djuric | Title and Description - Story 3 - What Reaches QuickBooks |
| [SV-10133](https://shopview.atlassian.net/browse/SV-10133) | Story | TESTING QA | Nemanja Djuric | Title and Description - Story 4 - The Imports |
| [SV-10390](https://shopview.atlassian.net/browse/SV-10390) | Task | TESTING QA | Nemanja Djuric | Verify QuickBooks and report line text |
| [SV-10391](https://shopview.atlassian.net/browse/SV-10391) | Task | TESTING QA | Nemanja Djuric | Verify line dialog and ShopCoach labels and placeholders |
| [SV-10392](https://shopview.atlassian.net/browse/SV-10392) | Task | TESTING QA | Nemanja Djuric | Verify invoices import wording and old-template compatibility |
| [SV-10393](https://shopview.atlassian.net/browse/SV-10393) | Task | TESTING QA | Nemanja Djuric | Verify E2E coverage updated |

**The four Tasks are the dev team's verification tickets, reported by Milan Zivanovic (2026-09-23).**
All four say *"When all four verification tickets for this feature are Done, it's ready for QA."*

---

## 2 · Feature summary (one paragraph)

A work order line's two text fields are labelled with questions today — *"What are you doing?"* and
*"Why are you doing it?"* — and those questions are printed into the line text that reaches a shop's
QuickBooks, so a bookkeeper reads our interview questions inside their own books. This change names
the fields **Title** and **Description** on every surface a person reads (the work order line dialog
and the ShopCoach line builder), keeps the two questions as **placeholders** inside the boxes, and
rebuilds the line text that both routes into QuickBooks share — the live QuickBooks Online sync and
the downloadable Customer Invoice report — as *"{Title} - {Description} - {Tech story}"* with **no
labels and no semicolons**, a spaced-hyphen separator that appears only between two present segments,
and a **4,000-byte** shortening that never cuts inside a character. The historical invoice import
(Administration → Invoices) renames its two columns to *"\*Line Title"* and *"Line Description"* and
**still accepts the old spellings**, so no saved spreadsheet breaks. Stored values, the customer
documents, the database and API field names, and anything already in QuickBooks are **unchanged**.

---

## 3 · Deliverables index (this folder: `build/what-why/`)

- **`INTAKE-2026-10-13.md`** — the PRESENT/MISSING checklist, the project-type verdict with evidence,
  the source-currency block, the full live TestRail inventory, and the open-questions list.
- **`requirements.md`** — the **verbatim** requirement set: PRD v13 §5 (S1/S2/S3/S4, negatives, edges),
  the out-of-scope statements, the assumptions, the surfaces table, the PRD's own open questions, and
  all four stories' requirements and acceptance criteria. **§4 is the source-conflict register.**
- `BLOCKED-design-artifact-2026-10-13.md` — **another worker's file.** The design artefact is not
  readable; that worker also owns `DESIGN-REFERENCE-2026-10-13.md` and `design-2026-10-13/`.
- **Not created, deliberately:** `cases/` · `testrail-id-map.csv` · the coverage matrix · the surface
  matrix · the deliberate-decisions register. Reasons in `INTAKE-2026-10-13.md` §8.

---

## 4 · Shared infrastructure to reuse (do NOT re-invent)

- **TestRail reading:** `build/testing-tools/census_group.py` (paged census) and
  `build/testing-tools/load_creds.py`. **Project 1 is single-suite — `get_sections/1&suite_id=…`
  returns HTTP 400, and a 400 there is not an auth failure.** Page `get_sections/1` and `get_cases/1`
  whole and filter to the group's descendants; an unpaged call returns 250 and silently finds zero.
- **Credentials:** `build/ENVIRONMENT-CREDENTIALS.md` §4 (TestRail) and §5 (Atlassian). Secrets live
  in `/tmp` at `chmod 600` and are never committed (Rule 82).
- **🔴 The Confluence version integer IS readable** — Atlassian MCP `fetch` with the page's **ARI**
  (`ari:cloud:confluence:19fdd96d-a135-46c4-83e7-d2cc218a4e63:page/845348896`) returns
  `metadata.version`. `getConfluencePage` and `searchConfluenceUsingCql` return only a relative
  *"about an hour ago"*. This is the symptom in `build/BLOCKED-confluence-version-integers.md`;
  **the fix is proposed, not recorded** (Rule 72) — that file was not edited.
- **App action recipes:** `build/APP-ACTIONS-PLAYBOOK.md` — §2885 already records the line dialog's
  test ids (`dialog_line`, `select_line_canned_line`, `input_line_description`), which the dev team's
  own comments say moved to `input_line_name` / `input_line_description` on this branch.
- **Seeding:** `build/skills/20-FEATURE-DATA-SEEDING.md` if this feature's cases turn out to need
  data (a QuickBooks-connected org on `qb1` is the obvious candidate).

---

## 5 · Testing-relevant highlights for whoever picks this up

- **🔴 THE 19 CASES' AUTOMATION MARKERS ARE STALE.** Every one reads
  `AUTOMATION: HOLD - authored from the PRD … not yet build-verified against a QA build (no QA branch
  yet)`. That was true when they were written (2026-09-30); **the QA environment was announced on
  2026-10-08**. Correcting it is a case edit, so **Rule 41 applies — there are no surgical edits** —
  and it needs permission (Rule 6).
- **🔴 THE CASES CITE THE OLD EPIC.** Their provenance lines read *"Epic SV-9667; story SV-101xx…"*.
  SV-9667 is now the **parent batch epic**; this feature's epic is **SV-11257**, created 2026-10-13.
  Every provenance line is therefore owed a re-stamp — again a case edit, again permission-gated.
- **Foreign cases sit directly on the changed surfaces, and they are HANDS-OFF** (Rule 38). All are
  `created_by == 1` → **Vladimir Tomovic**: **C2319** and **C2327** carry the **old import column
  wording in their titles**; **C2359 / C2361** cover *Require Tech Story* ON/OFF; **C16 · C33 · C145 ·
  C221 · C1701 · C1750 · C1800 · C1993 · C2159** cover Tech Story on work order lines.
  **Report, never edit.**
- **At least one case the dev team names is flagged Automated — C2274.** Rules 71/65 bite there:
  never change or delete it without the QA lead's go-ahead, and if a pass does change it, **tell
  Vlad**.
- **The high-value test is the shared builder.** PRD §2: the line text "is built in **one place**" and
  feeds both the live sync and the downloadable report. **S3-R4 — the two can never differ — is the
  assertion that protects a customer's accounting records**, and it is the one our existing C154715
  is marked manual for ("QuickBooks (QBO E2E is blocked)").
- **Three defect-shaped disclosures already exist in the stories' comments** (CSV formula injection
  newly reachable in the report's `ItemDescription`; a UTF-8-BOM import rejection; a Labor Rate focus
  issue). The dev team says tickets are **"being drafted"** for all three. **Check Jira before
  reporting any of them as a new finding** (Rule 110), and **file nothing** while Rule 62's hold
  stands.

---

## 6 · How to resume (ordered)

1. `git fetch origin && git pull` (Skill 15 G8 — a stale working copy yields confident wrong facts).
2. Read **`INTAKE-2026-10-13.md`**, then **`requirements.md`** §4 (the conflicts), then §5 above.
3. **Get the project type answered** before choosing a method. Do not infer it.
4. **Re-run the source-currency block** (`INTAKE-2026-10-13.md` §2) — the PRD moved the morning of the
   intake and it can move again. Re-read it **immediately before any write** (Rule 59).
5. **Re-measure the 19 cases live and paged** before trusting any number on this page (Skill 15 §7
   step 2: treat every remembered figure as unverified until measured).
6. Claim the project lock (Rule 83) before the first write.

---

## 7 · Env / access facts

| Thing | Value | Evidence |
|---|---|---|
| **QA host (all four stories)** | `https://sv10130.qa.shopview.com/` | HTTP 200, app-version **`v26.40.12-3d99e53`**, observed 2026-10-13 |
| **QA host (QuickBooks steps only)** | `https://qb1.qa.shopview.com/` — same branch code against the sv10130 backend; *"it is the host QuickBooks can connect to"* | HTTP 200, **same marker `v26.40.12-3d99e53`**, observed 2026-10-13 |
| **PR** | `https://github.com/ShopView/shopview/pull/3553` — all four stories ship in one branch | SV-10130/10131/10132/10133 comments, 2026-10-08 |
| **Login** | *"Log in as admin unless a step says otherwise."* Credentials: `build/ENVIRONMENT-CREDENTIALS.md` | dev comments, 2026-10-08 |
| **QuickBooks** | A QuickBooks **sandbox company must be connected on qb1 first**; the live sync runs automatically when an invoice is created, for a shop whose QuickBooks connection is active (PRD S3-P4) | PRD §5 Story 3; SV-10132 comment |
| **Report permission** | Downloading the Customer Invoice report requires **"Invoicing & payments - View"**, enforced **on the server** (PRD S3-P3) | PRD §5 Story 3 |
| **Feature flag** | **None named** in the PRD, the epic, any story or any comment | measured absence, 2026-10-13 |
| **Build finality** | **NOT final** — `00-COMMON-CORE.md` §16.0; Rules 49/60 apply, findings stay PROVISIONAL | — |

**Rule 91 badges as at 2026-10-13:** source **✅ 2026-10-13** (PRD v13) · build **❌ NEVER
build-verified** (the hosts are reachable; no behaviour has been observed and no verdict taken).

---

## 8 · Open threads

**Everything open is itemised in `INTAKE-2026-10-13.md` §6** — eight for the QA lead (L1–L8) and
eight for the PO (Q1–Q8). The four that change what a tester must literally see:

- **Q1** — *"Title is a required field"* (PRD) vs *"Title is required"* (story SV-10130).
- **Q3** — the shortening limit: **4,000 bytes** (PRD) vs unnumbered (story SV-10132).
- **Q4** — **does a work order import exist at all?** The PRD withdrew S4-R1; story SV-10133 still
  renames its columns and tests it in two acceptance criteria.
- **Q5** — must the unknown-column rejection name the missing and extra columns (story AC7), or is the
  existing generic message enough (PRD S4-N1)?

**And the two the QA lead has to answer before method can be chosen:** **L1** the project type, and
**L2** what happens to the 19 cases that already exist.

---

## 9 · History

| Date | What happened |
|---|---|
| **2026-09-10** | PRD page `845348896` created by Chris Ward. |
| **2026-09-15 / 2026-09-16** | The PRD's two blocking open questions answered; the Tech Story ruling reversed on 2026-09-16 so the narrative loses its label. Page marked *"Locked for build - 2026-09-16"*. |
| **2026-09-16** | Stories SV-10130 / 10131 / 10132 / 10133 created, under SV-9667. |
| **2026-09-23** | Verification tasks SV-10390 / 10391 / 10392 / 10393 created by Milan Zivanovic. |
| **2026-09-30** | **Our 19 cases authored into TestRail group 20437** — no workspace record was made. |
| **2026-10-07** | Tech plan linked on SV-10130. Vladimir Tomovic posts the per-story case lists. Cases last edited 2026-10-07 / 2026-10-09. |
| **2026-10-08** | **QA environments announced** (`sv10130`, `qb1`), PR #3553, per-story QA severities. The dev team records the PRD-vs-story wording gaps as "known gaps". |
| **2026-10-13** | **Epic SV-11257 split out of SV-9667.** PRD updated to name it (version **13**). **This intake run**: epic + PRD + live TestRail inventory recorded; project folder created; **nothing written to TestRail or Jira**. |
