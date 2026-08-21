# HANDOFF 2 — BUILD-VERIFICATION SESSION

> **Copy-paste this whole file into a fresh session as its briefing.**
> Written 2026-08-21. Repo: `Manual-test-Cases` (PUBLIC). Working directory:
> `/home/user/Manual-test-Cases`.

---

## 1. MISSION

You are the **build-verification session**. Your job is to take test cases that already exist and
**drive them live against the running build**, producing an observed **PASS / DEVIATION / HOLD**
verdict for each one with evidence captured that run, a re-check queue, and a plain-language
**Defects-for-Testers** workbook a manual QA can act on tomorrow morning. **You must NEVER do the
following:** you do not author new test cases (that is handoff 1), you do not rewrite case wording or
push a full VIU pass (that is handoff 3), you never treat the build's behaviour as the expected
behaviour — if the build differs from the documented expectation the case **keeps** the documented
expectation and becomes a deviation — you never create a Jira ticket or write to TestRail without
explicit permission asked for and granted, and you never touch another author's test case. **Stay in
your lane and report cross-lane findings back to the main session**: if you find a coverage gap, a
missing case or a nonsense case, write it up and hand it back rather than authoring or editing it
yourself.

---

## 2. READ THESE FIRST, IN THIS ORDER

1. **`build/skills/11-BUILD-VERIFICATION.md`** — your own skill. Read it fully.
2. **`build/skills/00-COMMON-CORE.md`** — **READ IT.** It is the shared core for the pre-existing
   skill set (`00`–`08`) and carries the honesty bar, TestRail write discipline and hazards, run sync,
   foreign cases, access mechanics, environment, session survival, git on a shared branch, secrets,
   authority, the reader-facing standards, the provenance line, the `AUTOMATION:` marker, the project
   fact sheet (§17) and finality (§16).
   **⚠️ CORRECTION, recorded 2026-08-21:** an earlier draft of this handoff said this file did not
   exist. **It does** — `build/skills/` was empty in this session's first inventory and the whole
   `00`–`08` set arrived from another worker on the next fetch. The claim is corrected rather than
   deleted so nobody re-derives it.
   **⚠️ AND THERE IS OVERLAP TO BE AWARE OF, NOT RESOLVED BY YOU:** the pre-existing set already
   contains **`01-CASE-BUILD.md`** (authoring), **`02-SOURCE-CHECK.md`** (source currency),
   **`03-RUN-CHECK.md`** (driving the build), **`04-TESTER-READY.md`** (handover) and
   **`06-DEFECT-PREP.md`** (ticket prep). Skills `10`/`11`/`12` were written as dedicated per-process
   skills and **partly cover the same ground**. Read both for your lane; **where they disagree, STOP
   and ask the QA lead** — do not pick a side and do not merge or delete either file.
   **One known disagreement already:** `00-COMMON-CORE.md` §16 states all three branches are
   **FINAL**, while skill `11`/`12` carry Rule 60's "never declared final" plus the 2026-08-10
   **per-report** finality ruling. That is a source-currency question for him, not for you.
3. **`build/VIU-ACCESS-METHOD.md`** — how to get live access: network egress, the three session
   cookies, the MITM bridge and the `boot2` hydration pattern.
4. **`build/APP-ACTIONS-PLAYBOOK.md`** — the indexed **STAGING ACTION RECIPES** at the top, plus **§J**
   (TestRail/API declared facts and normalisations). **Rule 27: reuse the recorded recipe; never
   re-discover an action from scratch, and append any genuinely new proven recipe immediately.**
5. **`build/TESTING-RUNBOOK.md`** — the proven staging/TestRail method.
6. **`build/CUSTOM-ROLES-PERMISSION-VIU-PROCESS.md`** — the 4-layer live permission method, if the
   pass touches roles or permissions.
7. **`build/PROD-VS-STAGING-COMPARE-METHOD.md`** — if two environments must be compared (100%
   live-observed, zero NOT-VERIFIED).
8. **`build/NO-WORK-LOSS-STRATEGY.md`** — checkpoint discipline and in-flight kill recovery.
9. **`build/PROCESS-CATALOG.md`** — the index of every callable process.
10. **`build/OUTSTANDING-ITEMS-REGISTER.md`** — what we are already waiting on.
11. The target project's **`build/<project>/PROJECT-STATE.md`**, then its most recent dated pass folder
    (`build-verify-*` / `full-viu-*` / `final-viu-*`) and its **`RECHECK-QUEUE.md`** files.
12. **Closest existing example of this lane's output:**
    `build/report-suite/build-verify-2026-08-10/` — `BUILD-VERIFICATION-2026-08-10.md`,
    `LABEL-LAYER-2026-08-10.md`, `RESUME.md`, `evidence/`, `tools/`.

**⚠️ DO NOT read `CLAUDE.md` end to end** — roughly 5,000 lines; reading it whole causes context
thrash and will cost you the session. `grep -n` for what you need. Note that **CLAUDE.md's numbered
Standing Rules stop at Rule 62**; the higher-numbered rules quoted in your skill come from the QA
lead's later instructions and are recorded in the skill file, not in CLAUDE.md.

**At session start also run the standing queue checks:**
`ls build/*/design-*/PENDING-FIGMA-FETCH.md` (Rule 35) and `ls build/*/*/RECHECK-QUEUE.md` (Rule 49).

---

## 3. THE NON-NEGOTIABLE RULES FOR THIS LANE

1. **Rule 6** — TestRail is the only real production system: **no writes without permission.**
2. **Rule 8** — always pair an internal ID with its C-ID **and** the TestRail link.
3. **Rule 9** — the build supplies the **labels**; correct them, never invent them.
4. **Rule 12** — verified means **observed**, with evidence captured that run. Never inferred from
   spec, code, role definitions or prior data. Not observed ⇒ labelled NOT VERIFIED / Blocked with the
   reason.
5. **Rule 13** — live, feature-by-feature testing is the default standard for any test / verify /
   check / confirm request.
6. **Rule 14** — **seed, don't block.** A missing data state is never an acceptable blocker on a
   disposable environment.
7. **Rule 17** — cover the whole population; state total in scope / processed / excluded-with-reason.
8. **Rule 25** — every deviation quotes its source **verbatim** (document + version + anchor + date).
9. **Rule 26 / 26a** — reset roles to template first; re-reset persistently on mid-run drift.
10. **Rule 27** — reuse the recorded action recipes; append new proven ones immediately.
11. **Rule 29** — commit and push after every step and mid-run; path-scoped `git add` only.
12. **Rule 31 / 59** — establish source currency first, and **re-read the sources immediately before
    any writes**, logging **both** timestamps.
13. **Rule 34 / 47** — run sync is **UNION ONLY**; a partial `case_ids` list deletes tests **and their
    results**. Snapshot before, verify every prior result **by id** after.
14. **Rule 36** — every report ends with "OUTSTANDING — what I need from you".
15. **Rule 49** — a non-final build yields **PROVISIONAL** findings: record the build marker, open a
    dated `RECHECK-QUEUE.md`, stamp provenance, never claim completeness. A queue closes only at
    **100%** of rows re-verified.
16. **Rule 50** — **exhaustive then exact**: every case, every field, no sampling; byte-verify every
    write and prove every untouched field byte-identical; on a mismatch **stop the batch**.
17. **Rule 51** — API-only findings are asked about **separately**.
18. **Rule 52 / 53** — if a ticket is authorised: `Story Defect`, parent = the **owning story**, story
    also linked *relates to*, priority **Medium**, no Product Area. **High is barred.** Never convert
    or "restore" someone else's ticket field.
19. **Rule 57** — the build supplies **only** labels and the verdict; it is never a source of expected
    behaviour, and a **closed ticket is not a spec change**.
20. **Rule 58** — an ambiguous source is never resolved from the build: hold and ask.
21. **Rule 60** — the layer split: only labels/navigation, the verdict, and the **HOLD half** of the
    markers go stale on a redeploy. Plain `AUTOMATION: READY` is build-independent. Never use "the
    branch is not final" as a blanket caveat — give numbers.
22. **Rule 61** — the automated suite is the monitor; **ticket status is never evidence about the
    build**.
23. **Rule 62** — no Jira ticket is created without permission (currently under a **"create nothing"**
    hold).
24. **Rule 71** — automated cases: read-assess → report → **HOLD**; never blanket-skip.
25. **Rule 74** — the multi-login standard: reset role to template → assign to the Technician
    quick-login → test → restore Technician.
26. **Rule 77** — the validity window: a verdict within **≤3 builds and ≤3 source versions** still
    counts, **but show the date**.
27. **Rules 75 / 76 / 79** — detached-process architecture, quota discipline, strategy first.

---

## 4. HARD GATES — ASK FIRST, EVERY TIME

| Gate | Rule | The ask |
|---|---|---|
| **Last-done date + re-run** | 80 | Before re-running a verification, **state when it was last done and against which build/version, then ASK whether to re-run.** |
| **Source verification** | 81 (refined) | **Do not auto-run it.** Tell him the task needs source-current cases, give the **last source-verify date + version**, **ask proceed WITH or WITHOUT — and WAIT** for the answer. |
| **TestRail writes** | 6 | No `update_case` / `add_case` / `delete_case` / **run result** write without explicit permission. |
| **Jira ticket creation** | 62 + the **"create nothing until my next order"** hold of 2026-08-10 | Prepare the ticket text with a recommendation and **stop at the button.** Permission is **per ask**; a batch approval never covers a later ticket; the finding being real and obviously worth filing is **not** permission. |
| **API-only findings** | 51 | Asked **separately**, even inside an approved batch. Reachability test: invisible to a user **and** to a manual tester ⇒ API-related. |
| **Automated cases** | 71 | Read-assess first, report, then **HOLD** for his decision. |
| **Which process** | 11 | On a new/updated spec or a VIU request, ask which process(es) he wants. |
| **Live check + access** | 22 | Ask up front for cookies + env/branch + feature-flag state, naming every item that needs live observation. |

---

## 5. THE FIVE NEW PROJECTS — STARTING MONDAY 24 AUGUST 2026

| Project | **DEVELOPER(S) / engineering lead** | Product Owner |
|---|---|---|
| Parts on Work Orders | **Stefan Vukovic** | **UNKNOWN — must be asked for** |
| Global Search | **Sinisa Nogic, Nikola Milosevic** | **UNKNOWN — must be asked for** |
| Invoicing Refresh | **Minja Kotlajic** | **UNKNOWN — must be asked for** |
| Simplified Workflow v2 | **Parth Faladu** | **UNKNOWN — must be asked for** |
| Accounting | **Nikola Mitrovic** | **UNKNOWN — must be asked for** |

> **⚠️ THE NAMES ABOVE ARE DEVELOPERS / LEADS, NOT PRODUCT OWNERS.**
> **The PO for each of these five projects is UNKNOWN and must be ASKED FOR.**
> **PO attributions are never mixed and never guessed.** Existing known attributions — Branko =
> Filters / Schedule / Global Search (historic) · Chris Ward = Report Suite / Fees & Discounts ·
> Milos = Simple Flow — must **not** be assumed to carry over. Ask.
> *(For this lane the developer names matter for a different reason: they tell you whose branch you are
> testing and who to name when a finding is written up — but a developer's opinion about intended
> behaviour is not a product source, and it never overrules the PRD or a PO answer.)*

> **⚠️ GLOBAL SEARCH ALREADY EXISTS IN THIS WORKSPACE — it is a REVIVAL, not a greenfield build.**
> **86 cases are already authored** (15 sections, adversarially reviewed clean, import ready, never
> pushed to TestRail); the project was **postponed** on 2026-07-27; canonical resume doc
> **`build/global-search/PROJECT-STATE.md`**. Before verifying anything against a build, the existing
> cases must be reconciled against the current sources — which is handoff 1's and handoff 3's work,
> not yours. Say so rather than verifying stale cases and reporting confident verdicts on them.

---

## 6. MISSING INPUTS TO REQUEST BEFORE STARTING — PER PROJECT

1. **The PO's name** — who settles a product question when the sources disagree?
2. **The spec / PRD** — Confluence URL **and** export/MCP access, so a deviation can quote its source
   verbatim.
3. **The designs** — Claude design, Figma (file + node ids), and the technical design. Flag any undated
   editable share link: it cannot be dated, so latest-wins cannot be applied to it.
4. **The epic / Jira key** — needed to name the owning story if a ticket is later authorised.
5. **The engineering tech plan** (Rule 30) — remind him if it was never supplied.
6. **The QA branch / environment + the feature-flag or settings state**, and **fresh session cookies**
   (`sv_sso_session`, `PHPSESSID`, `cf_clearance` for `.qa.shopview.com`). These die at roughly 24
   hours **or on deploy** — this is the single most common blocker in this lane.
7. **A second sign-in / non-administrator login** if any permission case must be driven, plus
   confirmation that no sibling worker is sharing the session (`quick-login` and `switch-user` rotate
   it).
8. **The TestRail target** — which run, if any, and whether a union sync will be needed afterwards.

State plainly what each missing item **blocks**, who owes it, and since when (Rule 36).

---

## 7. DEFINITION OF DONE FOR THIS LANE

- The **build marker** is captured at **pass start and pass end** — `<meta name="app-version">`,
  `last-modified`, `etag`, and the sha256 of `index.html`, each with its UTC timestamp — and proven
  **byte-identical** across the reads, so nothing redeployed under the pass.
- **Every case in scope carries a definite outcome:** PASS · DEVIATION (with its source quoted
  verbatim and its ticket, or the prepared ticket text if creation is on hold) · HOLD (with the exact
  thing it is waiting on) · NOT OBSERVED (with the written reason). **Zero partly-observed, zero
  silently skipped.** Counted two independent ways that agree.
- The **honest split is stated in numbers**, never as a banner: *"N of M observed on build
  `<marker>`; the remaining M−N carry their last recorded check."*
- A dated **`RECHECK-QUEUE.md`** exists with one row per verdicted case, OPEN/CLOSED header, and the
  re-check obligation and trigger per row (Rule 49).
- If writes were authorised: **every write byte-verified**, every untouched field proven
  byte-identical, the per-operation audit log complete (operation · C-ID · HTTP status · verification
  result), and the **run proven undamaged** — `include_all` state recorded, case_id sets equal both
  directions, **every prior result present by id** with no graded field changed.
- The environment is **left clean**: throwaway data named `ZZAUTOTEST` and deleted, roles restored to
  template, settings and location restored and **proven byte-identical** — a restore is not restored
  until it is compared field by field.
- Everything **committed and pushed**; no credential ever committed.

**Deliverable — the primary output of this lane:**
`build/<project>/build-verify-<date>/<Project>_Defects-for-Testers_<date>.xlsx`
One row per non-passed case, with: internal ID · **C-ID** · **TestRail link** · title · what the
document requires (anchor + version) · what the build actually does (observed, with the evidence
reference) · verdict · ticket key or "ticket prepared, not filed" · and a plain **"What needs to be
done"** in words a non-technical QA can act on. A tab per verdict status plus a Summary tab.
**Never a bare DEVIATION / Failed / Blocked with no plain next step.**
Alongside it: `FINDINGS.md` · `RECHECK-QUEUE.md` · `SOURCE-CURRENCY.md` · `CHANGES-MADE.md` ·
`testrail-execution-log.md` · `API-ASK.md` · `DELIBERATE-DECISIONS.md` · `evidence/`.
*(Honest note: no `*Defects-for-Testers*.xlsx` exists in the repo yet — the first one sets the
template. Mirror the established workbook conventions, Rule 16.)*

---

## 8. HOW TO REPORT BACK

Plain layman words, simple status format, these headings:

- **What I did**
- **What I found** — each finding with the source quoted verbatim and the case named as internal ID +
  C-ID + link.
- **What needs to be done** — a plain next step for every non-passed row.
- **Other actions**
- **OUTSTANDING — what I need from you** — always present; **"nothing outstanding"** if true. Sweep
  all six categories: missing sources · unanswered PO/dev questions · missing go-aheads ·
  access/credentials · deferred or HELD decisions · what another team owes. For anything blocked on
  the QA lead himself, give the five Rule-48 fields: his ruling quoted verbatim · when he gave it and
  what question it answered · the named cases it blocks (internal ID + C-ID + link) · why it was
  reasonable or what has changed since · the one thing that would unblock it, and from whom.

Always **state the TestRail update status explicitly**, even when it is "nothing pushed", and always
name the build marker the verdicts rest on.
