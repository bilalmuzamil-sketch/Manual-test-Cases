# LEARNINGS LOG — the continuous, retrievable ledger of everything we learn

> **PURPOSE.** One durable, append-only place where **every** learning is written the moment it happens,
> so any future session can retrieve **all** learnings in one read or one grep. This complements — does
> not replace — the rules (`build/rules/RULES-*.md`), the skills (`build/skills/`), the playbook
> (`build/APP-ACTIONS-PLAYBOOK.md`) and each `PROJECT-STATE.md`. A learning that hardens into a standing
> rule/skill is graduated there (Rule 72 records, Rule 93 proposes); this log keeps the **raw, dated,
> always-growing** record regardless.

## 🔁 THE CONTINUOUS PROCESS — how this stays current (do this every session)

1. **The moment you learn something durable** — a trap, a fix, a fact about the app/TestRail/access, a
   corrected mistake, a rule the QA lead states — **append an entry here in the SAME pass** (Rule 93/97:
   "solve something new ⇒ write it into the playbook/skill in the same pass" — this log is the front door).
2. **Never delete or rewrite an old entry.** If a learning is superseded, add a NEW entry that says so and
   link the old id (e.g. "supersedes L0007"). History is evidence.
3. **If the learning is important enough to be a standing behaviour**, ALSO graduate it: propose the
   rule/skill change (Rule 72) and record it in the right `RULES-*.md` / skill / playbook — then note the
   destination in the entry's **Graduated-to** field. This log is the index that points at where it lives.
4. **Commit this file with the work** (Rule 29). It is durable memory; `/tmp` and context are not.

## 🔎 HOW TO RETRIEVE — get ALL learnings, or just the ones you need

- **All learnings, newest first:** read this file top-to-bottom (it is kept small — details live behind
  the pointers, not inline).
- **By topic:** `git grep -n "#access" build/LEARNINGS-LOG.md` — every entry carries `#tags`.
- **Common tags:** `#access` `#testrail` `#shopview-app` `#roles-permissions` `#build-verify`
  `#source-verify` `#cookies` `#deadlock` `#methodology` `#rule` `#mistake-corrected`.
- **From a cold start:** CLAUDE.md §4 (Skills index) and §5 point here; skill `00-COMMON-CORE.md` names it
  as a first-read. Search order when stuck (Rule 97): this log → the playbook → the skill → `RULES-*.md`.

---

## ENTRIES — newest first (id · date · tags · lesson → pointer)

### L0036 · 2026-09-10 · #staging #build-verify #pdf #print #seeFinancialData #custom-roles #automation #methodology
**"BUILD-VERIFY FOR AUTOMATION" MEANS PINNING THE REAL ENDPOINT + A TEXTABLE ASSERTION — THREE TRAPS
FOUND ON C26577 (See-Financial-Data-OFF strips WO pricing), staging 2026-09-10.** A case can describe
the RIGHT behaviour against the WRONG mechanism; build-verification for an Automated case must confirm
the mechanism is real and deterministic or the automation fails/falsely-passes. Three traps, all live:
**(1) The WO "Print Work Order" (⋮ menu) is client-side `window.print()`** of a time/labour-hours
printer-friendly sheet that shows **NO money for anyone** (same doc as suite 6617) — it is NOT a
server PDF and NOT the money-bearing document. The money document is the **Invoice/Estimate**:
`GET /api/invoices/preview?invoice_id=<id>&type=pdf|html`. **(2) The generated invoice PDF has NO text
layer** (`pdffonts` empty) → "search the PDF text for money" returns 0 even for a Fin-ON admin = false
pass; assert on **`type=html`** or the JSON payload instead. **(3) seeFinancialData chokepoint CONFIRMED
working** on the money doc: admin (Fin-ON) invoice HTML = 11 money figures ($539.35 total…), a
See-Financial-Data-OFF user = **0** money. Secondary: the **WO view payload** (`/api/work-orders/view`)
zeroes the totals for a Fin-OFF user **but leaks `tax.amountTotal` ($37.29)** — a real financial leak on
that API even though the invoice render is clean. Full write-up + proposed (unapplied, Rule 71) case fix:
`build/custom-roles/build-verify-C26577-2026-09-10/`. **Graduated-to:** this log; report folder.

### L0035 · 2026-09-10 · #staging #access #cookies #cloudflare #roles #methodology
**STAGING FACTS SETTLED LIVE 2026-09-10 (were "unproven" in staging-boot2.mjs).** **(a)** The staging
**browser login with `sv_sso_session` ALONE gets past Cloudflare** — `boot2('admin')` landed on
`/workorders` with 42 perms; the headless DEV-MODE panel click-through works on staging exactly as on a
QA branch. This retires the two "❌ STILL UNOBSERVED" caveats in `staging-boot2.mjs` lines 32-39.
**(b)** Roles admin route = **`/administration/roles-permissions`** (sidebar "Roles & Permissions",
`verified_user`); role editor `/administration/roles-permissions/<id>/edit` shows **"View mode:
Full View / Tech view"** + a **"See Financial Data"** toggle. Roles API: `GET /api/roles/{id}` (has
`view_mode`, `cross_toggles.seeFinancialData`, `fe_permissions`); list `GET /api/organizations/{org}/roles`.
**(c) `staging-restore-tech.mjs` STAFF id has DRIFTED** — `/api/staff/{id}/change` 404s and `/api/staff`
lists 0 rows (staging re-seeded); update the id from the Staff settings page before using it. A full-view
Fin-OFF role already exists: **"TEST"** `e0e9b247-5432-43e8-9e35-f0c9bf3ade16`. org id
`d55bc308-e61a-438d-b5f1-c7a73c89d49f`. **Graduated-to:** this log; to fold into `staging-boot2.mjs` header + playbook §A.

### L0034 · 2026-09-10 · #testrail #mistake-corrected #steps-format #diagnosis
**A CASE'S STEPS/EXPECTED CAN LIVE IN `custom_steps_separated`, NOT `custom_steps` — READING ONLY THE PLAIN
FIELD FALSELY SHOWS "EMPTY".** Diagnosing why four of Vlad's cases fail in automation, C43850 and C45275
came back with `custom_steps=None` and `custom_expected=None` and I was one step from reporting them as
"empty, no steps". They are not empty — they use TestRail's **separated-steps** format, so the real content
is in **`custom_steps_separated`** (a list of `{content, expected, ...}` per step). Always check both the
plain fields AND `custom_steps_separated` before concluding a case has no steps. Worked value once read:
C45275 turned out to have a *real* structural defect (all five per-step expecteds piled into step 5, steps
1–4 blank) — which the plain-field read would have mislabelled as "no expected at all". Same family as the
`text-transform`/`<kbd>`-legend traps: the field you read is not always where the content is.

### L0033 · 2026-09-10 · #shopview-app #api #probe #harness #mistake-corrected
**THE SPA'S API LIVES ON A DIFFERENT HOST, AND ITS LIST ENDPOINTS RETURN `{collection: [...]}` — AN
IN-PAGE `fetch('/api/...')` SILENTLY RETURNS THE SPA's OWN index.html.** On a QA branch the app is
`https://<branch>.qa.shopview.com` and the API is `https://<branch>api.qa.shopview.com` (no dot before
`api`); `boot()` exposes it as **`APIH`** and puts the `sv_sso_session` cookie on both hosts, so
`fetch(\`https://\${APIH}/api/...\`, {credentials:'include'})` works from the page. Two probes died on
`Unexpected token '<', "<!doctype "...` before this was spotted. **And the row array is not always under
the same key** — `part/request/inventory-parts-as-options-with-remaining-catalogue-parts` returns
`{collection:[...]}` while `/api/inventory/parts` returns `{data:{...}}`; four probes died on
`rows is not iterable` / `rows.find is not a function`. Use a recursive picker that tries
`collection · data · rows · items · results` and then descends, rather than one hard-coded key.
→ `build/inline-add-edit-parts/execution-2026-09-09/probe49_bins_data.mjs`, playbook §S.

### L0032 · 2026-09-10 · #playwright #harness #mistake-corrected
**`page.evaluate` TAKES EXACTLY ONE ARGUMENT — `evaluate(fn, a, b)` THROWS AT RUNTIME, NOT AT PARSE.**
Three probes ran most of the way through and then died on *"Too many arguments. If you need to pass more
than 1 argument to the function wrap them in an object."*, losing the results of everything after the
failing line because the JSON is written at the end. **Two habits fix it:** wrap every argument set in an
object (`evaluate(({vis,idx})=>…, {vis:VIS, idx:i})`), and **write the evidence file incrementally**, not
only on the last line, so a late crash does not discard a completed leg.

### L0031 · 2026-09-10 · #shopview-app #build-verify #labels #mistake-corrected #rule-57
**A KEYBOARD-HINT LEGEND MADE OF `<kbd>`-STYLE CHIPS IS INVISIBLE TO A `body.innerText` REGEX — READ IT
FROM THE SCREENSHOT.** The inline row's legend renders as separate chips, so
`innerText.match(/.{0,40}(Enter|Esc|Tab).{0,40}/g)` returns the bare words `Enter`, `Tab`, `Esc` with no
surrounding text, which reads exactly like "the descriptions are missing" — a false defect one step away
from being written up. The screenshots show the legends in full and they are correct, and they differ
between the two rows exactly as the spec requires: **add row `Enter save & next row · Tab next field ·
Esc cancel`**, **edit row `Enter save · Tab next field · Esc cancel`**. Same family as the
`text-transform` trap (§1 of CLAUDE.md): the DOM string and the displayed string are different things.
→ `evidence/50-a-addhint.png`, `evidence/50-b-edithint.png`.

### L0030 · 2026-09-10 · #shopview-app #roles-permissions #route #build-verify
**THE ROLE EDITOR'S "VIEW MODE" IS A SEGMENTED BUTTON PAIR, NOT A TOGGLE OR A RADIO — WHICH IS WHY A
CHECKBOX/TOGGLE SWEEP CANNOT FIND IT.** On `/administration/roles-permissions/<roleId>/edit` (reachable
by a direct `goto` once booted) the control is `button.wo-settings__segment` inside
`.wo-settings__segmented`, with `wo-settings__segment--active` on the chosen one and the labels
**"Full View"** and **"Tech view"**. In the same editor, **Work order lines → Create & Edit is
`.q-checkbox` index 7** and **See Financial Data is a `.q-toggle`** at the bottom of the module list.
Technician role id on sv9315: `2d4b8464-81a9-4c1e-96c6-a2a64f02a389`; its default state is Tech view ·
Create & Edit ON · See Financial Data off. → `evidence/52-rolelabels.json`, `evidence/55-viewmode.json`.

### L0029 · 2026-09-10 · #methodology #defects #never-bite #qa-lead
**A DEFECT CANDIDATE IS NOT A CANDIDATE UNTIL IT HAS A CONTROL LEG AND A SECOND RUN.** Two findings this
pass looked solid on one observation and did not survive: **C45080** "the row closed when I clicked
outside" was my click landing on an interactive element, not an inert one; **C45081** "the follow-on row
blocks navigation" reproduced in one view and not the other, so it needed a four-run matrix before it
could be described at all. Every candidate now carries: the failing leg, a **control leg that must
behave differently**, and a **repeat**. This is cheaper than one wrong ticket.

### L0028 · 2026-09-09 · #testrail #fr-view #build-verify #re-stamp #efficiency #methodology #deadlock
**A STRUCTURE-PRESERVING API `update_case` PRESERVES fr-view RENDERING — SO A BULK BUILD-LINE RE-STAMP IS
AN API JOB (~3 MIN), NOT A UI/Froala DEADLOCK JOB (~2 HRS).** The documented trap (playbook §J) says an API
write lands a field in the *escaping* container (`markdown`, not `markdown fr-view`), so the UI-editor route
(surgical_replace.mjs → Froala) was treated as the only safe way to re-stamp. **Refinement proven this
session:** that only applies when the API write *introduces new HTML structure into a plain-text field*. When
the field is ALREADY `fr-view` and the write changes only **text inside the existing HTML** (e.g. swapping
`v26.35.9-7f2e4fa on 9/8/2026` → `v26.36.0-f43b2fd on 9/9/2026` inside an existing `<ul><li>`), the container
is **preserved** — the field stays `fr-view`, renders blocks, zero escaping. **Evidence:** API-wrote C53477
and compared its served page to UI-written C44988 (both fr-view=true, blocks=true, escaped=false); then bulk
API re-stamped 123 cases (errors=0) and the FULL 167-case served-page scan returned escaped=true=0,
fr-view=false-on-real-field=0. **The rule of thumb:** *changing text within existing fr-view HTML = safe via
API; converting plain-text → block HTML, or introducing new tags = still needs the UI editor.* This unblocked
the re-stamp when the Froala loop was deadlocking (L0010) and would have missed the QA lead's morning deadline.
Verify after ANY such bulk write with the served-page scan (`/tmp/check_served2.mjs`) — belt-and-suspenders,
non-negotiable at this stakes. **Graduated-to:** to be added to `build/APP-ACTIONS-PLAYBOOK.md` §J as the
"structure-preserving API write" carve-out; refines the §J trap, does not overturn it.

### L0027 · 2026-09-09 · #rule #build-verify #expected #build-glossary #tester-ready #qa-lead
**BUILD VERIFICATION MAKES ALL THREE PARTS RUNNABLE — PRECONDITIONS · STEPS · EXPECTED — AND EXPECTED IS
KEPT INTACT IN SUBSTANCE BUT WORDED TO THE BUILD GLOSSARY (now Standing Rule 102).** QA lead, verbatim:
*"I need everything runnable for the manual QA tester in the build starting from Preconditions Runnable,
Steps of replication Runnable, Expected result: … remain intact, but their wording should be clear,
meaningful, and consistent with the Build Glossary."* The new/sharpened piece is the **Expected** bar: the
*requirement* never changes (documents, Rule 57), but its *wording* is aligned to the build's real on-screen
terms — the `OBSERVED-UI-LABELS-<env>.md` file is that glossary — so a tester reads the same words they see.
**The line not to cross:** wording-to-glossary is NOT rewriting Expected to match build *behaviour* (that
stays a documented expectation + three-outcomes, §1 rule 62-b). This is Rule 84 made explicit for all three
fields and Rule 9/7 applied to Expected, under Rule 101 (full). **Graduated-to:** `RULES-61-ONWARD.md` rule
102; §1 + §2 of CLAUDE.md; to be reflected in skills 11/18/03. Applied first on Viktoria's two suites
(Inline 6597 + WO Print 6617) build-verified on sv9315 v26.36.0-f43b2fd, 2026-09-09.

### L0026 · 2026-09-09 · #rule #authenticity #five-dimensions #source-verify #close-out-gate #tooling #never-bite
**A CASE IS AUTHENTIC ONLY WHEN ALL FIVE DIMENSIONS AGREE — TITLE · PRECONDITIONS · STEPS · EXPECTED ·
SOURCES — AND A SOURCE-VERIFY IS NOT DONE UNTIL EACH IS INDEPENDENTLY CHECKED ON EVERY CASE.** This is the
consolidation of the whole 2026-09-09 thread. I kept declaring suites "verified" after checking a subset of
dimensions, and the user kept finding the un-checked one: first Sources (delta, L0015/L0021), then the
build-vs-doc authority (L0024), then Titles (L0025 part 1), then Steps/Preconds on changed requirements
(L0025 part 2), then — when I *still* said "ready" — Steps that did not COVER the Expected (C45039/C45232).
Each was real and each would have reached the tester. **The pattern behind all of them: I verified the
dimension I came for and assumed the rest.** The fix is a fixed, complete checklist that no pass may skip:
- **The five dimensions and their distinct failure modes:** Title (contradicts/understates the body) ·
  Preconditions (never establish the needed state) · Steps (not followable → runnable gate; **or followable
  but do not COVER every asserted outcome → a SEPARATE audit the runnable gate cannot see**) · Expected
  (drifts from the current spec, or narrows to the build instead of staying documented — Rule 57) · Sources
  (stale stamp, or missing provenance — Rule 54/64).
- **"Runnable" ≠ "covers".** `check_runnable_cases.py` proves steps are *followable*; it never proves they
  make every asserted outcome *observable*. That gap needs its own steps-cover-Expected reviewer pass.
- **Preserve only what did not change.** Preconds/steps may carry over for an UNCHANGED requirement; every
  UPDATE case re-derives all five together (Rule 41).
- **Graduated-to a COMMITTED, REUSABLE TOOL (Rule 27/93):**
  `build/testing-tools/audit_case_authenticity.py` runs the mechanical dimensions, dumps the bodies, and
  prints the two semantic reviewer prompts (title-vs-Expected, steps-cover-Expected); plus the served-page
  `fr-view` scan. And `build/skills/02-SOURCE-CHECK.md` §5c makes running it the required close-out gate.
  **Handover-ready = mechanical clean + both semantic audits 0 + runnable 0 + fr-view confirmed, on every
  case.** Proven on Viktoria's two suites the same day: it caught C45039 and C45232 that four earlier checks
  had missed.

### L0025 · 2026-09-09 · #mistake-corrected #rule-41 #titles #preconds-steps #source-verify #harness #testrail
**A CHANGED REQUIREMENT RE-DERIVES THE WHOLE CASE — TITLE, PRECONDITIONS AND STEPS, NOT JUST THE EXPECTED.**
Two related misses on the same pass, both caught by the user:
- **(part 1) Titles left stale.** The user opened C44993 and saw the title still said "…Complete,
  Invoiced, or Paid" (3 statuses) while the body asserted 5.
- **(part 2, the deeper one) Preconds/Steps left stale on UPDATE cases.** I told the user preconds/steps
  were "preserved and runnable-gated, not re-authored." The user rightly pushed back: that is fine ONLY
  when the source is unchanged — when the requirement CHANGED, you cannot assume the setup and clicks are
  still valid. Real defects: C44993/C44994 Expected grew to 5 statuses but the steps walked only 3
  (Declined/Imported never checked); C45007 Expected became conditional (Uncategorized only if no
  category) but the steps saved one generic part and never tested the has-category branch. All re-derived,
  fr-view, runnable-gate 3/3, live-verified (preconds name 5 statuses, steps cover both branches).
**THE RULE:** preserving preconds/steps is valid ONLY for a case whose requirement is UNCHANGED this pass;
every UPDATE case re-derives preconds + steps + title + expected together (Rule 41 — no surgical edits).
A broader read-only title-vs-expected audit of all 163 cases in both suites returned 0 genuine
contradictions after the fixes.
**(original part-1 detail retained below)**
**A SOURCE-VERIFY THAT ONLY TOUCHES THE FIELD IT CAME FOR LEAVES THE REST OF THE CASE STALE — THE TITLE
ESPECIALLY.** The user opened C44993 and saw the title still said "…Complete, Invoiced, or Paid" (3
statuses) while the body now asserted 5. I had changed the Expected and never reconciled the title —
a Rule 41 violation ("touch a case, re-verify the WHOLE case"). Root cause is structural, not a one-off:
the `fr-view` write harness `hs_write.mjs` writes ONLY preconds/steps/expected and **asserts the title
unchanged**, and the FULL-diff work focused on per-requirement Expected verdicts (Rule 43) + provenance —
so titles were never in the loop. Anything I changed the Expected on could carry a stale title.
- **What I found when I swept BOTH suites (title-vs-body status-set check):** real title defects on
  **C44993, C44994** (title 3 statuses, body 5), **C45007** (title "is categorized Uncategorized" absolute,
  body now conditional "only if no category"), and **C45250** (title had lost its "(auto-uncompletes)"
  suffix). WO Print C45104 flagged but was a FALSE POSITIVE (the extra status words were in the tester
  note, not the assertion). All fixed; re-scan clean bar the known false positive.
- **A SECOND bug surfaced:** setting a title via API and THEN running the harness let the harness's
  edit-form Save re-submit and TRUNCATE the title (C45250 lost "(auto-uncompletes)"). **Safe order: run
  the harness content pass FIRST, then set the title with a title-only `update_case`.** Verified
  2026-09-09 that a title-only `update_case` does NOT knock the other fields out of `fr-view` (served-page
  scan: all three stayed `markdown fr-view`), and the title persists on re-fetch. So no harness re-run is
  needed for a title fix — which also dodges the clobber.
- **Honest scope of what the re-verify DID vs DIDN'T do (so nobody over-trusts it):** Expected =
  re-derived against the current spec and re-written; Sources/provenance = re-stamped v16 + read-date and
  verified; **Titles = were NOT reconciled (now fixed + swept)**; **Preconds/Steps = preserved from prior
  passes and runnable-gated (`check_runnable_cases.py`), NOT re-authored word-by-word this pass** — valid
  under the validity window but state it, don't imply every word was re-derived. The title sweep is a
  heuristic (status-word enumeration); it will not catch a title stale in a non-status way, so eyeball
  every content-changed case.
- **Graduated-to:** `build/skills/02-SOURCE-CHECK.md` §5b clause 4 (whole-case + title reconciliation, the
  safe title-write order, the persist + fr-view re-check, the sweep). Reinforces Rule 41.

### L0024 · 2026-09-09 · #mistake-corrected #rule-57 #source-of-truth #qa-lead #methodology
**THE SOURCES ARE ALWAYS THE AUTHORITY — a "build is right" instruction does not flip that; confirm it,
and default to spec + three-outcomes.** On the Inline suite the QA lead first answered "Build is right"
for C44993/C44994 (Add Part button / Edit control hidden by work-order status). I applied it literally:
narrowed the documented list to Complete/Invoiced/Paid and dropped Declined & Imported to match the build.
He then corrected it twice — "For them the specs/design sources are authoritative" and "**ALWAYS the
Sources are the authority**." I reverted: the cases keep the full documented list (Complete, Invoiced,
Paid, Declined, Imported per S1-N1/N2) and the build gap is carried by **three-outcome tester notes**
(Rule 62b: a pass ends in a runnable test, tester marks FAILED on the deviation), never by rewriting the
expectation to match the build.
- **The rule this reinforces:** Rule 57 — expected behaviour comes from the documents (spec/PRD, epic,
  design, Figma, PO answers), NEVER from the build; from the build we take only on-screen labels and the
  pass/fail verdict. A closed ticket or a "the build does X" observation is not a source.
- **The trap:** even a QA-lead sentence like "build is right" reads as authorising build-as-source. It is
  not — it is a hypothesis to confirm against the sources. When build ≠ document, the safe, standing
  handling is: keep the documented expectation, add the three outcomes, escalate the divergence, and let
  the build-verify pass mark it. If he truly wants the spec changed, that is a **spec correction** (his
  call, reported to the spec author), not a silent case-narrowing.
- **C45250 was already right** — it was fixed to follow spec S1-R9 (Add Part available on a Complete line;
  auto-uncompletes), with no build influence, so "spec is the authority" needed no further change there.
- **Graduated-to:** already carried by Rule 57 + Rule 62b (§1 CRITICAL CORE) — no new rule; this entry is
  the dated incident so the reflex ("sources always win; confirm any build-is-right steer") is retrievable.

### L0023 · 2026-09-09 · #testrail #playwright #harness #mistake-corrected #automated #methodology
**A CLONED HARNESS CARRIES THE ORIGINAL'S HARD-CODED CONSTANTS — AND A RUNNING NODE PROCESS HOLDS OLD CODE
IN MEMORY.** The `fr-view` write harness `hs_write.mjs` was sed-cloned from the Global Search copy into the
WO Print and Inline dirs. The GS copy had `const AUTOMATED_OK = new Set([]);` (its Automated cases were
whitelisted a different way), so the clones **silently ignored the `AUTOMATED_OK` env var** and skipped
every `custom_atmstatus=3` case even when the QA lead had approved them. Two independent traps stacked:
- **(1) The clone bug.** Fixed to `new Set((process.env.AUTOMATED_OK||'').split(',')…)` — env-driven, so the
  whitelist actually applies. Lesson: after cloning any harness, **grep its hard-coded config constants**
  (whitelists, target lists, base URLs) before trusting an env override.
- **(2) The in-memory trap.** A WO Print harness was ALREADY RUNNING when I fixed the file on disk. A running
  Node process does not re-read its source — it kept the buggy `new Set([])` and finished having skipped
  C45107 & C45123 despite the correct env. **Fixing the file does not fix a process already launched from
  it** — you must re-run the affected cases with the fixed code.
- **(3) The re-run gotcha.** The harness's `done` set reads BOTH `REPAIRED-hs.jsonl` and `FAILED-hs.jsonl`
  and treats a `{skipped:true}` line as done. So a naive re-run skips them again. Fix: **delete the skip
  lines from FAILED-hs.jsonl**, then run with `ONLY=<cids> AUTOMATED_OK=<cids>`. Both re-ran clean
  (44/44 WO Print, verified live). **Graduated-to:** `build/APP-ACTIONS-PLAYBOOK.md` §J (fr-view harness
  notes) — record the env-driven whitelist + the "already-running process keeps old code" + "clear skip
  lines before ONLY re-run" as the standard harness-clone checklist.

### L0022 · 2026-09-09 · #mistake-corrected #lanes #build-verify #test-execution #scope #methodology
**KNOW WHERE BUILD VERIFICATION STOPS — it makes the cases RUNNABLE; a DIFFERENT session drives the
results.** My repeated confusion this session: when the QA lead asked whether the SFV2 build verification
was "full or delta," I decided "full" must mean driving every case end-to-end to a pass/fail (seed each
data state, execute, per-case verdict) — declared my own completed work inadequate, and asked for a fresh
cookie to run a 64-case execution walk. **That conflated two separate lanes.** The QA lead corrected me:
- **BUILD VERIFICATION (my lane · skill 11 → 03/04/18):** make the **steps and preconditions 100% RUNNABLE**
  by a manual QA tester — real routes written as UI clicks, every quoted label read off the current build,
  every named state reachable via those clicks, `fr-view` render, marker set. **DONE = runnable-shape gate
  0 NOT-RUNNABLE + label gate clean + render OK.** It does **NOT** run cases to pass/fail, does **NOT** push
  results into the TestRail run, does **NOT** create defects. "Driven live" in this lane means *walk the
  route to prove it is followable and read the labels* — never *produce a verdict*.
- **RESULTS / DEFECTS (a SEPARATE session the QA lead named "Create defects from TestRail (Push Results to
  TestRail)" · skills 09/16 + `build/testing-tools/push_results_to_run.py`, playbook §W + skill 06):** runs
  each case to the point of pass/fail, **pushes the result (Passed/Failed/Blocked) into the TestRail test
  run with a comment per case**, and creates defects. **This is not my lane and I never do it as part of
  build verification.**
- **So "full vs delta" for BUILD VERIFICATION means:** every case's route/labels/state re-confirmed runnable
  **on the CURRENT build this pass** (never carried over from an older build or a shared-label delta) — NOT
  "every case executed to a verdict." The SFV2 pass met the build-verification bar (both gates green on all
  64); it was never a shortfall in *build verification*. Don't drift into the results lane and then accuse
  the build-verify work of falling short. **Graduated-to:** `build/skills/11-BUILD-VERIFICATION.md` (a
  "WHERE THIS LANE STOPS" boundary block) and `build/skills/03-RUN-CHECK.md`. Related: Rule 101 (full, not
  delta — but *of the runnability check*, not of execution), Rule 84 (tester-readiness gate), skill 16.


### L0021 · 2026-09-09 · #rule #source-verify #qa-lead #methodology
**STANDING DIRECTIVE (QA lead, 2026-09-09, verbatim): "NEVER run deltas, the verification should ALWAYS be
FULL."** A source-verification ALWAYS re-reads EVERY case in the suite against the current spec and
re-stamps EVERY case to the current version with a fresh read-date — never only the changed-story/changed-
requirement cases. This HARDENS L0015 and REMOVES the "disclosed partial" escape hatch that L0015/§5b still
allowed: a delta is now forbidden outright, not merely something to footnote. Confirmed by a live audit
that caught two more delta passes I did on 2026-09-07 — **6617 Printer Friendly WO** (42 of 44 still stamped
25 Aug, only 2 at 7 Sep) and **6597 Inline Add & Edit Parts** (113 of 123 still at 31 Aug, only 5 at 7 Sep),
both now being brought to a full re-stamp. **Graduated-to:** **Standing Rule 101** ("there is no such thing
as a DELTA verification — every verification is FULL, on every case", `build/rules/RULES-61-ONWARD.md`) +
§1 of CLAUDE.md + `build/skills/02-SOURCE-CHECK.md` §5b clause 2 (rewritten: "ALWAYS FULL — NEVER A DELTA") +
`build/skills/11-BUILD-VERIFICATION.md`. Same directive the QA lead also gave about the 6617/6597
build-verify delta; both are the one rule. Related: L0015 (the delta that first bit us, SFV2).

### L0020 · 2026-09-09 · #rule #testrail #test-runs #qa-lead
**STANDING RULE (QA lead, 2026-09-09): authoring a new test case is NOT done until it is a member of that
suite's active Test Run — and you must CONFIRM it live, every time, forever.** This is Rule 34 made into a
mandatory close-out step: after any `add_case` in a suite that has a run, immediately union-sync the run
(`build/testing-tools/sync_runs.py --apply`, union-only — a partial `case_ids` list DELETES tests + their
results) and then **read the run back live** to prove the new C-id is a test in it. A case that exists but
is not in the run is invisible to the tester and to every count. Verified live 2026-09-09 for the four new
cases I authored: **C53486/53487/53488/53489 → R416 (SFV2)**, **C53480 → R417 (Invoice UI Refresh)**,
**C53477 → R418 (Inline Add & Edit Parts)** — all present. **Graduated-to:** `build/rules/RULES-21-40.md`
rule 34 (the confirm-live close-out) and `build/skills/01-CASE-BUILD.md` (case authoring is done only when
the case renders `fr-view` AND is in the suite's run).

### L0019 · 2026-09-09 · #mistake-corrected #build-verify #ui-walk #rule-97 #self-unblock
**Two "not on the build" blockers I declared were both WRONG — the feature was there; I just hadn't
walked the UI hard enough. The QA lead had to hand me both.** (1) I deferred the 4 PO-pages cases as
"surface not built" after `/purchase-orders` 404'd and the Parts sub-nav (Part Sales/Inventory/Catalog/
Returns/Vendors) showed no PO entry — but the real route was **Parts → left sidebar SUPPLY CHAIN →
Purchase Orders (`/parts/orders`)**, a nav group I never expanded. (2) I HELD C44604 as "can't force the
reorder from the UI" — but parts reorder by **dragging the 6-dots drag-handle** at the left of each part
row on the WO Lines page. **The rule I broke: Rule 97 / the UI-walk drill — never declare a blocker (or
give up on a route) without exhausting the walk first.** What I should have done, and now will by default:
**(a)** when a guessed URL 404s, that is data about the guess, not the feature — **enumerate EVERY
sidebar/nav group and sub-item** (`ENUMERATE_ROWS_FN`), expand collapsed groups, before concluding
absence; **(b)** for an "action I can't perform" (reorder, expand, assign), **look for a drag-handle
(6-dots / `drag_indicator`), a hover-reveal control, a row menu, a context menu** — interaction
affordances are often icon-only and not in a text scan; **(c)** grep the build's JS chunks for the
feature name when the walk stalls; **(d)** a blocker is only real after ALL of that, and I must say which
searches I ran (Rule 68/97). "I couldn't find it" is a fact about my search, never about the build.
Pointers: `build/simple-flow-v2/build-verify-2026-09-09/sf_po_real.mjs` (PO route found),
`sf_reorder.mjs` (6-dots drag). Reinforces L0001 (a "build changed / missing" claim must survive a
harder check first).

### L0018 · 2026-09-09 · #testrail #runnable-gate #skill-18
**`check_runnable_cases.py`'s R3/R4 anchor regexes match WHOLE WORDS, so a plural noun that is the only
anchor in a case FAILS the gate.** The `TAB` regex is `\b(tab|panel|menu|...|toggle|...)\b` — "permission
toggles" (plural) does NOT satisfy it, nor does "columns"; only the singular "toggle"/"column"/"menu"/etc.
matches. A permission case whose only UI target was "permission toggles" was flagged **R3 nothing to aim
at** despite naming a real control. **Fix:** when a case is flagged R3/R4 but you know it names a control,
add the SINGULAR anchor word ("...find the Received later permission **toggle**", "open the receive
**dialog**"). Also **R4 checks the FIRST STEP** for a location even when the precondition carries the full
route — a step-1 like "Open the line's actions" must name where ("On the work order's **Lines tab**, open
the line's three-dot **menu**..."). Pointer: `build/simple-flow-v2/build-verify-2026-09-09/runnable-edits.json`.

### L0019 · 2026-09-10 · #rule #qa-lead #methodology
**STANDING RULE (QA lead, 2026-09-10): never act on anyone else's comment or finding without
consulting him first.** Verbatim: *"Dont trust viktoria's finding (though you can see anyone's finding
in the comment if that helps you for anything but ask me always before taking any decision based on
anyone's findings in the comment when you believe the commenter might be right on something - do not
blindly trust but do consider them to see if they are helpful but before acting in favour or in
accordance with those comments make sure to consult with me) so you have to see everything Logically
and if logically the test case is correct and as per your verification it should stay as it is then
keep it as it is."*

**How to apply it.** A comment by a tester, a developer or anyone else is **input, never authority**.
Read it — it often points somewhere useful. Then judge the case on its own merits: the documents
(Rule 57) plus your own live verification. **If the case is logically correct and your verification
supports it, LEAVE IT ALONE.** If you come to believe the commenter is right and something should
change, **stop and ask him before changing anything** — the change is his call, not yours and not the
commenter's.

**Why this rule exists — the incident it is made of.** On 2026-09-09 Viktoria commented that "Declined"
should be added to seven preconditions' status lists. It looked right, it matched what the build did,
and I applied it to all seven. The re-verified S1-N1 says the exact opposite: on Declined the Add Part
button must be **hidden**. So the edit sent testers to a work order where the button should not exist
in order to find it — and I had validated a commenter's claim against the BUILD instead of the RULE,
which is the inversion Rule 57 exists to prevent. All seven were reverted the same day. Two of her ten
"Passed" rows were also set to Blocked, and one of the notes she left in place (`only Paid exists in
the data`) was stale in a way that made her block two cases that actually pass.

### L0017 · 2026-09-09 · #playwright #testrail #bridge #mistake-corrected
**Any Playwright script that opens a shopview.testrail.io (or *.qa.shopview.com) UI page MUST launch
chromium through the local MITM bridge — a bare `chromium.launch()` gets `net::ERR_CONNECTION_RESET`.**
Chromium cannot TLS through the egress proxy directly. Copy the proven pattern from `surgical_replace.mjs` /
`qa-branch-boot.mjs`: `const PORT=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
chromium.launch({args:['--no-sandbox'],proxy:{server:'http://127.0.0.1:'+PORT}})` and a context with
`ignoreHTTPSErrors:true`; run `bash build/testing-tools/ensure_bridge.sh` first (port ROTATES — never
hard-code it). A new writer/probe script that skips this loses its first run to a connection reset.
Pointer: `build/simple-flow-v2/build-verify-2026-09-09/apply_edits.mjs`.

### L0016 · 2026-09-09 · #shopview-app #roles-permissions #build-verify #route
**The ShopView admin area lives at `/administration/*`, NOT `/settings` (which 404s), and Roles &
Permissions is `/administration/roles-permissions`.** Left-sidebar labels observed on sv8683: SETTINGS
(Settings·Staff·**Roles & Permissions**·Locations·Departments·Taxes), SERVICE (Labor Rates·Canned
Lines·Fees & Discounts·Asset Types·Inspection Templates), PARTS (Pricing·Bin Locations·Categories),
INTEGRATIONS (QuickBooks·IBS), FINANCE (Payment Methods), IMPORTS (Contacts·Assets·Vendors·Inventory·
Invoices). The **Edit Role** page (`.../roles-permissions/<id>/edit`) has a `Search permission` box, a
`View`/`Create & Edit`/`Delete` header, a `Full View`/`Tech view` control, `Reset To Template`/`Cancel`/
`Save`/`Delete Role`, and under the **Work orders** category the toggles `Review work orders`, `Pick
parts`, `Order parts`, **`Received later`** (the new SFV2 permission). ⚠️ The permission SEARCH box
filters by CATEGORY name: typing "receiv" collapses the WO category and hides its child toggles — to see
"Received later" you must expand the Work orders category (search "order" or scroll), a UI quirk that can
read as "the permission is absent" when it is present. Recorded in `build/OBSERVED-UI-LABELS-sv8683.md`.

### L0017 · 2026-09-09 · #probe #playwright #mistake-corrected
**A keyboard test is void unless focus is PROVEN to be where the user's would be.** C45051 read as a
failure ("Escape does not close the inline row") purely because an earlier step had clicked at
(20,300), moving focus to the page body — Escape then went to the document, not the row. Re-run with
`document.activeElement` asserted to be the row's own input first, Escape behaved perfectly: empty row
closes silently, populated row raises the discard guard with "Keep Editing" focused. **Always capture
`document.activeElement` immediately BEFORE a key press and record it alongside the result.**

### L0018 · 2026-09-09 · #probe #shopview-app #mistake-corrected
**An absent option may just be absent from your SELECTOR.** C45055 read as a failure ("no Create as a
new part action in the typeahead") because the probe enumerated `.q-menu .q-item` — and this action is
not rendered as a `q-item`, and only appears when the typed text matches NOTHING. Searching a matching
string found 24 items and no Create; a deliberate no-match string (`ZZQQXNOMATCH123`) produced the menu
text "Create ZZQQXNOMATCH123 as a new part". **Two rules: read the whole container's text, not just the
rows your selector knows about; and exercise the EMPTY-RESULT state before concluding an
empty-result affordance is missing.**

### L0015 · 2026-09-09 · #mistake-corrected #source-verify #methodology #provenance
**A spec-revision source-verification that re-stamps ONLY the changed-story cases is a DELTA, not a full
re-verification — and the suite's provenance then LIES about its currency to every later session.** On
2026-09-08 the Simple Flow V2 spec moved v23 → the 8-Sep revision; I diffed the 11 changed stories and
re-stamped the **18** cases I touched, but left the other **47 of 65** cases at "specification version 23,
read on 21 August 2026". The provenance stamp IS the system of record for "last source-verified", so a
build-verify session correctly read the suite as last-verified 2026-08-21/v23 and nearly proceeded on a
suite where 47 cases had never been checked against the current spec — a bite the user caught, not me.
**THE RULE I NOW FOLLOW — a suite is "source-verified against spec vN" ONLY when EVERY one of its cases
(created_by=3; authorised Automated included, Vladimir's excluded) carries vN in its provenance:**
1. After a spec move, run a suite-wide provenance audit (live TestRail, per-case) BEFORE reporting the
   suite verified — count new-stamp vs old-stamp; the OLDEST stamp present is the suite's true currency.
2. Either re-verify + re-stamp EVERY case to vN (default), OR, if a delta is deliberate, record the split
   explicitly in PROJECT-STATE ("N re-stamped to vN; M still at v<old> — NOT a full re-verification") and
   NEVER report the suite as "source-verified against vN" without that qualifier.
3. "Not in the change-log" ≠ "verified against the new spec" — an unchanged-story case must still be
   re-READ against the current spec (Rule 12: observed, not assumed) before its stamp moves to vN.
**Graduated-to:** `build/skills/02-SOURCE-CHECK.md` (the "delta vs full — the provenance-currency gate").
Related: L0014 (a provenance line is a claim about when a case was written, never proof the version is
current), Rules 31/54/59/43.

### L0015 · 2026-09-09 · #methodology #probe #mistake-corrected
**Three would-be defects died on verification in one session — the cheap check is always a second,
different measurement.** All three looked real on the first probe and were false: (a) **C45003** — the
inline row's close control reads "Cancel" not "X", but the CASE ITSELF already says it is labelled
"Cancel" in Tech View; read the case before calling a divergence. (b) **C44991** — the Edit control
stayed at `opacity: 0` under a synthetic `mouseover`/`mouseenter`, because **CSS `:hover` cannot be
triggered by a synthetic event**; a real `page.mouse.move()` gave opacity 1, and real keyboard focus
gave opacity 1. (c) **C44997** — the discard confirmation looked absent because the probe filtered
dialogs by `offsetParent`, which is **null for `position: fixed`** and therefore for every Quasar
dialog; judged by geometry plus computed style, the dialog was plainly there.

### L0016 · 2026-09-09 · #probe #playwright #shopview-app
**Visibility must be judged by geometry + computed style, never by `offsetParent`.** Use
`r.width>0 && r.height>0 && display!=='none' && visibility!=='hidden' && opacity>0.01` on
`getBoundingClientRect()`/`getComputedStyle()`. `offsetParent` is null for fixed-position elements, so
it reports every modal, toast and sticky bar as hidden. Matching trap already recorded for TestRail's
hidden `Title is too long` template (L0012): filter by `offsetParent` there, by geometry here — the
point is the same, **prove visibility with the measurement that fits the element's positioning.**

### L0013 · 2026-09-08 · #rule #test-execution #qa-lead
**STANDING INSTRUCTION (QA lead, 2026-09-08): a test whose ticket comment proves the fix verified must
show Passed in the run.** Verbatim: *"Every test run case which has been proven as verified-fix in the
ticket comment that test case-run should show Passed in the test run."* Run the sweep over every
not-Passed test at the START of each pass on a suite: read each mapped ticket's comments, and where a
same-day verified-fix is recorded, write the Passed result citing who verified it, where and when.
First application (R417, 8 Sep): **none of six qualified** — all six tickets carried a same-day
"still failing / not deployed" comment. Evidence table:
`build/invoice-ui-refresh/coverage-2026-09-08/STORY-DEFECT-COVERAGE-2026-09-08.md` §A.

### L0014 · 2026-09-08 · #mistake-corrected #source-currency #test-execution
**A PASSED result can be wrong because the RULE moved, not because the observation was wrong — so a
coverage or execution report must re-read the spec, not just the tickets.** C44949 passed on 7 Sep with
its own result text recording the pass as firing "on a REGULAR payment… not a deposit". S8-R5 had been
reverted on **4 Sep** to deposit-only ("A plain payment row never carries a sub-line"), three days
BEFORE that run. The case, the run and this session's first coverage answer all inherited the
superseded rule. Caught only by reading the live spec body for the rule text rather than trusting the
case's own provenance line. **Two habits:** (a) when a ticket is REJECTED FROM TESTING but its mapped
case is Passed, treat that as a contradiction to investigate, never a coincidence — it found both
C44949 and C44927 here; (b) a provenance line naming "specification version N" is a claim about when
the case was written, never evidence that N is current (Rule 31/59).

### L0011 · 2026-09-08 · #testrail #render #api #mistake-corrected
**`add_case` lands its fields in `markdown fr-view` — the escaping-container trap is an `update_case`
problem, not an "any API write" problem.** Measured live on C53481/C53482/C53483, created via
`add_case` on 2026-09-08 with block-only HTML: all three fields on all three cases served as
`<div class="markdown fr-view">` with no literal tags, needing **no** UI repair. CLAUDE.md §5 currently
says "An API `update_case`/`add_case` leaves the field in the ESCAPING container", which over-states it
for `add_case`. **Still scan the served page after any API write** — the scan is what proved this, and
`update_case` is unchanged. **Proposed (Rule 72, not yet recorded):** narrow that CLAUDE.md sentence to
`update_case`. Scanner: `/tmp` copy of the pattern in
`build/inline-add-edit-parts/render-repair-2026-08-31/scan.mjs`.

### L0012 · 2026-09-08 · #testrail #froala #methodology
**A UI re-save cannot flip a container when the content is identical — `#accept` stays disabled and a
forced click is refused.** Writing a field's own stored value back through Froala leaves TestRail's form
clean, so Save never enables; the page then shows its **latent, hidden** `Title is too long` template,
which a naive `.message-error` scrape reports as the failure reason. Two guards, both already known and
both worth repeating: (a) filter by `offsetParent` — a hidden error is not an error (this cost ~11 minutes
here); (b) dispatch the dirty-marking events on **`inst.$oel[0]`** (the backing element), never
`inst.$el[0]`, and click `#accept` **un-forced** so Playwright waits for it to enable — the correct form is
in `build/testing-tools/surgical_replace.mjs` lines 82-96. If a genuine flip is ever needed on unchanged
content, save a deliberately-different version first, then save the intended one: two real UI saves.

### L0010 · 2026-09-08 · #testrail #deadlock #methodology
**The TestRail UI-editor "deadlocks" were SELF-INFLICTED — run ONE writer, never concurrent (Rule 83).**
`surgical_replace.mjs` deadlocked at ~0.6 case/min while I had **multiple** re-stamp runs going at once
(a background driver loop I thought had died, plus manual re-runs launched on top of it) — several
Playwright sessions editing the same TestRail estate contend on row locks. The moment I killed the extras
and left a **single** writer, it ran clean at **~10 s/case with zero deadlocks**. So: before launching a
bulk TestRail-write run, `pgrep -f surgical_replace` and make sure nothing else is writing; one loop, to
completion. (Refines L0004 — the deadlock is contention you can avoid, not an inherent tool limit.)
**Graduated-to:** operational; keep in mind for any bulk TestRail write.

### L0009 · 2026-09-08 · #build-verify #rule #testrail
**Re-stamping the build-check line (provenance Sentence 2) is a MANDATORY part of build verification —
ALWAYS, never optional/cosmetic.** (QA lead, verbatim: *"Yes restamping should be the part of Build
verification ALWAYS."*) A build-verification pass that observes cases against build vX on date D must, in
the same pass, re-stamp every case it verified to `Last checked against build vX on D`. A suite is NOT
build-verified-complete while any verified case still names an older build (`verify_suite.py` check 9 must
be clear). Drive it to zero with `surgical_replace.mjs` (it checkpoints, so a deadlocking estate is
retried to completion, never abandoned). Scope: `created_by=3`, authorised Automated included, Vladimir's
(user 1) never. **Graduated-to:** `build/rules/RULES-41-60.md` rule 54 (2026-09-08 amendment),
`build/skills/03-RUN-CHECK.md`, `build/skills/11-BUILD-VERIFICATION.md`, CLAUDE.md §5.


### L0008 · 2026-09-08 · #roles-permissions #shopview-app #rule
**Assigning a role to `TECH@shopview.com` — RESET the role first, then assign.** When a test needs
`TECH@shopview.com` to have a particular role, first **reset that role from Roles & Permissions** (the role
edit screen's "Reset To Template" control) so it starts from a known-clean state, THEN assign it to TECH —
**unless** the test specifically requires modifying the role before assigning (then modify, then assign).
Combined with L0006: **`TECH@shopview.com` is the account whose role you may change; the Admin account's
role is never changed.** (QA lead, 2026-09-08.) **Graduated-to:** `build/skills/03-RUN-CHECK.md`.

### L0007 · 2026-09-08 · #shopview-app #build-verify #roles-permissions
**Full-View inline Add Part row on sv9315 `v26.35.9-7f2e4fa` is CONFIRMED complete.** Logged in as **Admin**
(full access: `woTechViewMode=false`, `seeFinancialData=true`), the inline row shows
`Description · Part number · Qty · Category · Cost · Sell price · More options · Save · ×`, and **"More
options" opens the "New Part Request" / "Edit Part Request" modal**; the line's Story row reads "Add tech
story for this line". So the 14 Full-View cases (C45046/47/60/65/67/111/226/27/32/33/34/35/38/43) match the
build. Evidence: `build/inline-add-edit-parts/build-verify-2026-09-08/ADMIN-fullrow-CONFIRMED-v26.35.9.png`,
`ADMIN-partrequest-modal-CONFIRMED-v26.35.9.png`, `confirm.log`. **Graduated-to:** `OBSERVED-UI-LABELS-sv9315.md`.

### L0006 · 2026-09-08 · #roles-permissions #shopview-app #mistake-corrected #rule
**🛑 NEVER change the Admin role.** The **Admin** quick-login (`admin@shopview.com`) is the **full-access
(Full View + See Financial)** login used to build-verify anything needing the full UI. Editing its View-mode
segment to "Tech View" (which an earlier pass did, and left there) makes every later session land in the
reduced three-field row and mis-read Full-View-only controls (e.g. `More options`) as *removed from the
build*. It was self-inflicted; the QA lead reverted it. **If a role must be changed for a test, change
`TECH@shopview.com`'s role — never Admin's.** **Graduated-to:** `build/skills/03-RUN-CHECK.md` (view-mode section).

### L0005 · 2026-09-08 · #methodology #shopview-app #build-verify
**Before calling a permission/view-gated control "absent", prove your session's effective state.** Dump
`localStorage.fe_permissions_wrapper`: `woTechViewMode` present ⇒ you are in **Tech View**, which correctly
shows a reduced UI (e.g. the three-field inline row, spec §S4-R21) — that is NOT a missing feature. Probe:
`build/inline-add-edit-parts/build-verify-2026-09-08/probe_perms.mjs`. **Graduated-to:** `build/skills/03-RUN-CHECK.md`.

### L0004 · 2026-09-08 · #testrail #deadlock #build-verify
**`surgical_replace.mjs` (TestRail UI editor via Froala) deadlocks under concurrent estate load** —
"Deadlock found when trying to get lock", ~0.6 case/min with retries. It is a shared-estate contention
issue, not a tool bug. Run bulk TestRail UI edits (e.g. build-stamp re-stamps) **when the estate is quiet**;
the re-stamp is cosmetic and never gates runnability. The tool checkpoints (`APPLIED.jsonl`) so a re-run
skips done cases. Pointer: `build/inline-add-edit-parts/build-verify-2026-09-08/restamp-9-1/`.

### L0003 · 2026-09-08 · #access #cookies #shopview-app
**`sv_sso_session` QA-branch cookies expire mid-session.** When `qa-branch-boot.mjs` starts bouncing to
`accounts.google.com` (Google SSO) instead of the DEV MODE panel, the cookie aged out — ask the user for a
fresh one; **never forge a session**. Carry **only** `sv_sso_session` (host-only); the 32-hex PHPSESSID and
`cf_clearance` are the 409 trap (playbook §A). Bridge port rotates: `bash build/testing-tools/ensure_bridge.sh`.

### L0002 · 2026-09-08 · #source-verify #build-verify #rule
**Rule 81 ask-and-wait gate is IN FORCE for build-verification sessions** (QA lead kept it for this work):
on a build-verify order, name the need, give the last-done DATE + spec version, ASK with/without source
verification, WAIT. Do not auto-pull sources. **Graduated-to:** `build/rules/RULES-61-ONWARD.md` rule 81.

### L0001 · 2026-09-08 · #methodology #mistake-corrected
**A conclusion that "the build changed" must survive a permissions/state check first.** This session twice
neared a false "label removed" finding that was really a Tech-View session (L0005/L0006). The cross-checks
that caught it: (a) read the SOURCE (spec §S4-R21 documented the reduced row), (b) dump `fe_permissions`.
Build ≠ document is escalated, never resolved by rewriting cases (Rule 57/63) — and never asserted from an
unverified session state. Keep this reflex.

## L0034 — 2026-09-10 · a probe that mutates shared state must restore it in a `finally`, and the restore must not need a fresh login

**What happened.** `probe105_noneditable.mjs` moves a work order to **Declined** to test the
"work order became non-editable under your open row" cases, then puts it back. Its final restore
opens a NEW browser session to do so — and that boot failed (`exit=2`). The probe died leaving
**S9315-15899 sitting at Declined**, a state no other test expects. It was caught only because the
next check read the status back; nothing in the probe itself would have reported it.

**The rule this gives us.** Any probe that changes shared state (a work order status, a role, stock)
must:
1. wrap the whole body in `try { … } finally { …restore… }`, so a crash anywhere still restores;
2. do the restore over a session it **already holds**, not a fresh `boot()` — a login can fail, and
   a restore that needs a login is a restore that can be skipped;
3. **read the state back** after restoring and log the read-back, never trust the write's 201;
4. print a loud line if the restore did not verify, so the pass knows it left a mess.

**Related.** `GET /api/work-orders/{id}` carries **no `status` field** — reading it there returns
`undefined`, which reads as "the change failed" when it succeeded. The status lives on the LIST
endpoint, `GET /api/work-orders?limit=200`. That misread cost a probe run and left the same work
order Declined the first time round.

## L0035 — 2026-09-10 · a work order LINE is a table row, not an expansion panel — and it has its own test-ids

**Three probe runs were lost to guessing this.** Every earlier probe in this pass opened the Lines
tab with `[...document.querySelectorAll('.q-expansion-item')].forEach(i => i.querySelector('.q-item')?.click())`
and then looked for a line inside those panels. There are exactly **two** `.q-expansion-item`s on the
page and they are the **customer** and **vehicle** header panels. No line is ever inside one.

**What a line actually is.** Lines are `<tr>` rows inside `[data-test-id=table_work_order_lines]`.
The "+ Add Part" button sits in its own row, `<tr class="q-tr q-tr--no-hover line-row parts-group-header">`
— **one such row per line**, present whether or not the line is expanded. That is why counting the
buttons gave 5, and why walking up the DOM from one and matching a line id against `outerHTML`
matched **all** of them: the id lives in a shared ancestor.

**The real per-line anchors** (read off the page, `probe112_linedom.mjs`):
`button_line_expand_<lineId>` · `line_number_<lineId>` · `badge_line_status_<lineId>` ·
`button_action_complete_line_<lineId>` · `line_total_cost_<lineId>` · `line_tech_story_<lineId>`,
and per part `button_part_context_menu_<partId>_line_<lineId>` /
`button_requested_part_context_menu_<requestId>_line_<lineId>`.

**How to address one line:** click `button_line_expand_<lineId>` to open it, then walk the table's
rows in DOM order remembering which line the last `badge_line_status_<id>` / `button_line_expand_<id>`
belonged to; the next `parts-group-header` row is that line's. A part is addressed directly by its
id, which needs no line scoping at all.

**Also settled:** the New Line form's **description is overwritten by the canned line** you pick —
typing into `input_line_description` and then choosing a canned line leaves the line named after the
canned line ("Out of adjustment"), so a line can NOT be found again by a description you typed.
Find it by diffing the line-id list before and after, which is what the probes now do.


## L0036 — 2026-09-10 · work order lines are EXPANDED BY DEFAULT, so clicking "expand" collapses them

A follow-on to L0035, and the reason a corrected probe still failed. Having learned that lines are
table rows with a `button_line_expand_<lineId>` of their own, the obvious next move — click it to
open the line — is **wrong**: lines render expanded, so the click **collapses** the line. Its child
rows go `hidden` and, critically, **its "+ Add Part" row stops being rendered at all**. The row walk
then reports `found: false` for that one line while finding the other four, which reads like a
scoping bug and is not.

**The toggle tells you the state:** an expanded line's button reads **`expand_less`**, a collapsed
one **`expand_more`**. Read it first and click only when collapsed, then verify:

```js
const st = await state();                 // {collapsed: /expand_more/.test(button.textContent)}
if (st.collapsed) { await click(); await verify(); }
```

Measured in `probe114_rowseq.mjs`, whose row dump also confirms the pairing the walk relies on:
each line's marker row (`button_line_expand_` · `line_number_` · `badge_line_status_`) is followed
by its Story/Labor rows and then by exactly one `[ADD PART]` row — rows 36→39, 40→42, 45→48. The
collapsed line at row 49 has no Add Part row beneath it at all.

**Also visible in that dump:** a line carries `button_action_complete_line_<lineId>` — the UI's own
Complete action — so a line can be completed by clicking rather than by the status API.

## L0036 — 2026-09-10 · FIVE FALSE BLOCKERS IN ONE SESSION, ALL THE SAME MISTAKE: MY INSTRUMENT BROKE AND I BLAMED THE PRODUCT

**The QA lead, 2026-09-10:** *"I do not want you to block yourself on something I have unblocked you
previously... you must set up a mechanism to unblock yourself so that when you are doing something in
an unattended mode you do not get yourself trapped into a blocker which you can cross by yourself."*

**The five.** Not one was the product:

| I reported | The truth | What actually failed |
|---|---|---|
| "no Add Part on this line" | lines are **table rows**, not `.q-expansion-item` — those two panels are the customer and vehicle headers | my selector |
| "Print is missing on 4 of 5 statuses" | I opened a **line's** three-dots menu, not the toolbar's; Paid only looked right because it has no lines | my selector |
| "Print absent on ready_for_review" | the menu **never opened** (`menuOpen:false`) — that is not a reading | my timing |
| "Receive does nothing, the app throws" | Receive **navigates** to `/order/<id>?receive=1&…`; I described the page 5s in, before it rendered | my route + timing |
| "roles cannot be saved" | roles save fine through **Settings → Roles & Permissions**; staff assignment saves too | my method (script, not screen) |

**THE SHAPE, and it is always the same:** a **NEGATIVE** observation — *absent, nothing, broken,
impossible, blocked* — produced by **my own locator, timing, or route**, never cross-checked against a
case where the same instrument worked. Two of these the QA lead had already unblocked by hand on
earlier days, and I re-blocked myself on them anyway.

**Rule 97 did not catch any of them**, and could not: 97 says *the answer is probably already written
down*. This class is different — **the instrument is broken and I blame the patient.** Hence Rule 104
and a real mechanism, not another reminder.

**THE MECHANISM — two files, both executable, both committed:**

**1. `build/testing-tools/probe_guard.mjs` — catches it at OBSERVATION time, inside the probe.**
- `settle(page)` — waits until the URL and DOM actually stop changing and *reports whether they did*;
  an observation taken from an unsettled page is marked UNRELIABLE rather than recorded.
- `afterAction(page, ctx, fn)` — wraps a click and records **navigation · new tab · panel · DOM change
  · server write**. A click can never be written up as "nothing happened" unless all five are empty.
  This alone kills the Receive mistake.
- `assertNegative({what, positiveControls, attempts, userPathTried})` — **throws** unless the same run
  contains a passing positive control, at least 2 attempts, a settled page, and a UI attempt. This
  kills the three selector mistakes and the role mistake.

**2. `build/testing-tools/blocker_gate.py` — catches it at REPORTING time.** Seven proofs, each needing
evidence: positive control · tried through the screen · waited and retried · checked for navigation ·
precondition read back · searched the repo (97) · **"name the most likely way this is MY fault and how
I ruled it out"**. Exit 1 until all seven carry evidence. `--questions` prints them for a quick check.

**THE ORDER OF OPERATIONS, for an unattended run:** build the probe on `probe_guard`; if
`assertNegative` throws, **fix the probe, do not record the finding**; before anything negative reaches
a `BLOCKED-*.md`, a defect candidate, or a Blocked/Failed-as-unavailable result, run `blocker_gate.py`
and get exit 0. **A gap that genuinely cannot be closed is reported AS AN OPEN GAP, never as a proved
blocker.**

**The one question that would have caught all five:** *"what is the most likely way this is my own
mistake?"* Five for five, there was an obvious answer and I had not asked.

## L0037 — 2026-09-10 · the chain went idle between steps and the QA lead had to ask

**What happened.** `probe126` finished at 07:36. The next probe was not launched. At 07:39 the QA
lead asked *"Are you done? I do not see any running task etc."* Nothing was blocked, nothing was
finished — the session simply stopped **between** steps. Three minutes here, but in an unattended run
that is dead time with nobody watching for it.

**Why it happened.** I was hand-launching one probe at a time and deciding the next step only after
reading the previous result. That is fine when someone is watching; it guarantees a gap when nobody
is. The gap is not a thinking pause — it is the process having no next step queued.

**The fix — `build/testing-tools/run_queue.sh`.** Put every remaining step in a queue file and let the
runner walk it: it refreshes the QA-branch bridge before each step, pauses between steps for login
trap 2, survives a step that crashes, and writes `/tmp/queue-<tag>.log` with `START` / `EXIT rc=` per
step and `QUEUE-DONE` at the end. `--status <tag>` answers "is anything running?" in one line, which
is precisely the question that had to be asked out loud.

**The discipline that goes with it (Rule 105):** the last action before writing any report is to start
the next work and confirm it is running — never the report first. And every status names the step in
flight, so nobody has to ask.

**Note the pattern with L0036.** Both of today's process failures are the same species: *I reported a
state without checking the thing that would have told me it was wrong.* L0036 — reported "broken"
without checking my instrument. L0037 — reported progress without checking anything was still running.
The cure in both cases is a committed, executable check rather than an intention to remember.

## L0038 — 2026-09-10 · Rule 103 said "ask", so a STATUS line slipped through in shorthand

**Hours after recording Rule 103** ("every ask in his language"), this went to the QA lead:

> *"R418 now: 114 Passed · 1 Failed · 2 Blocked · 7 Untested — and both remaining Blocked (C44993,
> C44994) plus the 7 Untested are all settled verdicts waiting only on your go-ahead to file the one
> Declined ticket."*

Seven things to decode in one sentence: a run number, two case ids, "verdicts", "settled", and two
bare status tallies that say nothing about what he should do. His reply: *"you must always keep things
simple for me to understand, for **everything** you share with me **all the time**."*

**The lesson is about the shape of the rule, not just the sentence.** I wrote a rule scoped to "asks",
and then classified a status line as not-an-ask, so the rule did not fire. **A rule with a category in
it invites me to argue the category.** Rule 103 now says *everything he reads*, with no category to
hide behind.

**The mechanism: `build/testing-tools/plain_check.py`.** Run it on any draft before sending. It exits 1
and names each phrase he would stop at — run numbers, case/test ids, ticket keys, suite numbers, API
paths, status codes, HTTP verbs, selector/probe names, payload/endpoint/DOM/JSON, precondition,
verdict, settled, "not observed", "clause 3" — **and bare status tallies**, which was the part no
word-list would have caught. Ids after a `---REFERENCE---` line are exempt, so Rule 8 still holds.
Verified against the offending sentence: it catches all seven.

**The writing rule underneath it:** a number is never sent alone. *"114 of 124 pass"* is data.
*"114 pass; 10 are finished but can't be written up until you say yes to one bug report; nothing left
to test"* is information he can act on.

## L0039 — 2026-09-10 · a defect was drafted quoting spec rules I had never opened

**What happened.** The Declined defect draft cited **S1-N1** and **S1-N2** as its source. Both were
quoted from my own notes and from our own case text. The QA lead asked *"where in the specs does it
say that? I need the exact quotation from the sources."* I had to go and read the live Confluence page
to answer. **The wording did hold — but that was luck, not method.** The ticket had been written
without ever opening the document it cited.

**His rule (now Rule 106):** before proposing any defect, reconcile three things — what the **case**
says, what the **live source** says today, and what the **build** did.
- case agrees with source, build differs → a real defect, ask to file
- **case disagrees with source → the CASE is wrong, not the build.** Do not ask to file; ask
  permission to correct the case's Expected Result
- source silent or ambiguous → hold and ask, never resolve from the build

And: **always the latest version of the source, never an old record in memory.**

**Two things worth keeping from doing it properly this time:**
1. **Answer the contradicting rule in advance.** S1-R9 says Add Part *is* available on a line whose
   status is Complete — a reviewer would reach for that immediately. It is about the **line's** status;
   S1-N1 is about the **work order's** status. Writing that down before being asked is the difference
   between a ticket that survives review and one that bounces.
2. **Say what you could not confirm.** Our cases claim "specification version 16". The live read
   returns no version integer, so I stated that plainly instead of repeating the number as if verified.

## L0040 — 2026-09-10 · the printout is BUILT ON DEMAND into `#wo-print-root`; print media alone shows the ordinary screen

**This is the sixth time today the same mistake nearly reached a report — and the first time the
guard caught it before anything was recorded.**

On the QA branch I read the work order page under print media and found the whole app still there:
25 buttons, 5 tabs, the navigation and 20 money amounts. That looked like a dozen failing cases
(no pricing on the printout, interactive elements hidden, and so on). I did not report it, because
the Rule 104 control had to run first.

**The control settled it in one line:** visible elements screen **3190**, print **3190** — *unchanged*.
Print media was changing nothing at all. And the stylesheet says exactly why:

```css
@media print { body.wo-printing > :not(#wo-print-root) { display: none !important; } }
```

**How the printout actually works:** pressing *Print Work Order* (1) adds the class `wo-printing`
to `<body>`, (2) builds a `#wo-print-root` element holding the printout, and (3) that rule hides
every sibling. **Switch to print media without pressing Print and the body has no `wo-printing`
class, so nothing is hidden and you are reading the ordinary screen.** Every "the printout still
shows X" conclusion from that method is void.

**The method that is correct:** press Print for real (hook `window.print` so the dialog cannot block,
but let the app do all its preparation first), confirm `#wo-print-root` exists, then read **inside
that element**. Also worth asserting as a control: with print media on, no sibling of the print root
is still displayed.

**The five print rules on staging, for the record:** the `wo-printing`/`#wo-print-root` rule ·
`.print-hide { display:none }` · a dark-mode colour override · an animation-duration override ·
and one lifting the height cap on the work-order-lines scroll container so all lines print.

**Why this keeps happening, and what actually stops it.** Every one of the six was a *negative*
observation produced by my own method, and in five of them I had no control that could have exposed
it. The control is not paperwork — here it was a single number compared against itself, and it saved
a dozen wrong results.

## L0041 — 2026-09-10 · standing authorisation to unblock, and the seven routes that clear almost everything

**The QA lead, 2026-09-10:** *"you are authorized to do anything to unblock yourself, give it what it
takes to unblock you on your tasks."* Recorded as **Rule 107**.

**What the day actually proved.** Every wall I hit came down, and none of them needed him:

| Wall | What cleared it | Route |
|---|---|---|
| roles "cannot be saved" | they save fine through Settings — my script was the problem | other surface |
| no part held in multiple bins | create the part with its bins set, instead of moving stock after | seed |
| a line will not complete | create → authorize → add part → **pick** → complete | walk the neighbour |
| special-order part cannot be received | fill the **invoice number**; the button is silent without it | read the screen |
| "Receive does nothing" | it NAVIGATES to a receiving page — I described the page mid-navigation | prove the instrument |
| create a work order fails | the playbook already carried the UI recipe | search the repo |
| the printout "shows prices" | the printout is built on demand; I never pressed Print | prove the instrument |

**Seven routes, in order, before "blocked" is even a candidate:** search the repo · read the refusal
(it names the missing field or the allowed method) · try the other surface · seed the state · walk the
neighbouring feature that produces it · change the role, permission or data in the way · prove the
instrument. **All seven tried, and NAMED in the report, or it is not a blocker — it is step 1 of 7.**

**The two that sting most are the repo ones.** The work-order-create failure and its UI workaround
were written down months ago; so was the staging sign-in helper. Rule 97 exists precisely for that and
I still nearly rebuilt both. **Search first is cheaper than every other route combined.**

**And the boundary, which the authorisation does not move:** seeding and role edits are about reaching
a test STATE. They say nothing about what may be published — no ticket, no TestRail write, no touching
Vladimir's cases, no committed secrets, production is not a test environment.

## L0042 — 2026-09-10 · the QA lead had to show me the line operations; they are now written down

**He said:** *"Keep on learning all this, I do not want to repeatedly telling you the same thing
again and again, save this learning from where you will pick that up when needed again."*

He was right to. In one session I spent probe runs guessing at three things he then showed me in two
screenshots. **All of it is now in `build/APP-ACTIONS-PLAYBOOK.md` §Y**, which is the first place to
look before touching a line.

| What I was guessing at | What it actually is |
|---|---|
| how a work order reaches **In Progress** | press **Start** on a line's Labor row |
| how it reaches **Complete** | **Complete** on each line, then **Complete Work Order** |
| how to set a **line** status | click the **LINE** → Edit Line window → Status list |
| why `cancelled` kept failing | **there is no Cancelled line status** — only Authorization required · Declined · Authorized · Complete |
| how to **delete** a line | tick its checkbox → **⋮ in the table header** → Delete lines |

**The two habits this should change:**

**1. When a value is refused, ask the screen what values exist — do not try more spellings.** I tried
eight variants of "cancelled" and got 400 eight times. The Status list on screen names all four
accepted values. One look would have replaced eight guesses. The refusal *"Invalid parameter value"*
is precisely the signal to go and read the list.

**2. A control I cannot find is usually somewhere I have not looked.** Delete is not on the row; it
is in a bulk menu that only appears once a line is ticked. I had already SEEN `button_line_bulk_action`
in a dump of the page's controls and did not follow it up.

**And a self-check that would have caught the lead-technician mistake:** its picker's first option is
"Unassigned". Taking "the first option" from any list can assign nothing — read the label before
accepting it, or the test proves nothing.

## L0043 — 2026-09-10 · a refusal names its precondition, and a reading names its element

Finishing runs 418/419 on Staging produced four misses of the same two shapes, all mine:

1. **`Cannot complete work order with incomplete lines.`** I had read the earlier silence ("pressed
   Complete Work Order, status still Approved") as *the build will not complete a job*. It was a
   confirmation dialog whose button reads **"Complete Without Receiving"**, and behind that a plain
   refusal naming exactly what was missing. **Read the refusal; press the button the screen actually
   offers.** (Rule 104's "prove the instrument".)
2. **`{"line_id":"Missing required parameter"}`** while I was sending `line` and `id`. A "missing"
   error about a field I *was* sending is a **wrong field name**, never a missing record.
3. **A border read off the `<tr>` instead of the cells** gave "no rules anywhere on the printed page",
   which would have been filed as a defect against a page that has rules on 16 of 24 rows. The real
   finding — no rule at the boundary *between* line blocks, while the rows *inside* a block do have one
   — only appears once you read the element that owns the style. **A reading names its element.**
4. **"Print is greyed out when a work order has no lines"** — carried in two case bodies as the reason
   they could not be run. It is not greyed out; it prints "No lines on this work order" with zero
   totals, and both cases pass. **A blocker written into a deliverable still has to be re-proved when
   you next touch it** (Rule 104: never re-block on something not actually proved).

The habit: before any negative claim, ask *which element did I read, and which word did the server
actually use?* — then look at the screen, in that order.

## L0044 — 2026-09-10 · a case number without its run makes him hunt

He asked twice for the same thing. On 2026-07-23 it was "pair the internal id with the C-id and the
case link"; on 2026-09-10, "Give me the Test run of the test case link ALWAYS anytime you have to
share with me the test case number." The second ask exists because the first was satisfied literally
and uselessly: a `/cases/view/` link opens the case, not the RESULT, and the result is what he wants
to read. A case can sit in several runs; without the run he has to find which one.

The habit: a case reference is three things or it is not written — the C-id, the case link, and the
run (number and link; the `/tests/view/<test_id>` form when the exact row is known). Recorded as the
Rule 8 amendment of 2026-09-10.

The wider lesson, which is the same one as L0043: **when he repeats a request, the first version was
answered to the letter and missed the point.** Ask what he was trying to DO with the thing he asked
for, not just what he named.

## L0045 — 2026-09-10 · the ticket tool is MARKDOWN, and a ticket without pictures is not a ticket

Three Story Defects were raised (SV-9917, SV-9918, SV-9919) and the QA lead's reaction was that they
"look ugly, not friendly or understandable or reproducible by a layman". Two separate faults, both mine:

1. **I wrote Jira WIKI markup (`h1.`, `{quote}`, `||`, `#`) into the MCP tool, whose `contentFormat`
   defaults to MARKDOWN.** Every marker rendered as literal text — the reader saw `h1. What happens`
   and `{quote}` on the page. **`createJiraIssue` / `editJiraIssue` take MARKDOWN** (`##`, `>`, `1.`,
   `|` tables, `**bold**`) and convert it to ADF. Wiki markup is only for the raw
   `PUT /rest/api/2/issue/{KEY}` route, which is a different door and the one the inline-image recipe
   in skill 06 uses. **Know which door you are using before you write a character.**
2. **I filed with no screenshots at all**, when the eight-item evidence bar (skill 06, from the
   2026-08-12 ruling that a bad ticket put his job on the line) requires annotated ones, embedded.
   `build/testing-tools/annotate_shot.py` already existed for exactly this and was not used.

Also relearned the same day, third time in three passes: **`build/skills/06-DEFECT-PREP.md` carries a
seven-section ticket layout and a plain-language table. Read it BEFORE writing a ticket, not after
being told the ticket is bad.**

The habit: before creating anything in an external system — read the skill that owns that artefact,
confirm the markup dialect the tool actually accepts, and never file evidence-bearing work without
the evidence attached.

## L0046 — 2026-09-10 · he had told me the ticket shape before, and I wrote my own anyway

Straight after the markup fix he set out the layout again and added: *"but this is what I always ask
you but you keep on forgetting"*. What he wants, and what I keep failing to do:

- **The description explains the problem and nothing else.** I had put in "who this affects and how
  badly" and "what is not affected" — impact paragraphs I invented. He struck them: *"do NOT assume
  the effects of the defects etc"*. The reader decides the impact; I report what happens.
- **Current behaviour and expected behaviour get their own plain sections**, concise, non-technical.
- **Steps are the easiest possible route a layman can follow**, including making the data.
- **Images are INLINE and annotated**, not attachments listed at the end.
- **Sources go at the BOTTOM, quoted, with a link so the reader can reach the source themselves.**

Recorded as the eight-heading layout in `build/skills/06-DEFECT-PREP.md` with both quotes verbatim,
and pointed at from CLAUDE.md §1.

The pattern across L0043, L0044 and this one is the same and it is the thing to fix in myself:
**when he repeats an instruction, it is because the first version was answered literally and missed
the intent.** Before building anything he will read, find where he has already described it and
follow that, rather than composing a shape of my own and waiting to be corrected.

## L0047 — 2026-09-10 · he gave the ticket order; I had invented one an hour earlier

Third correction to the same artefact in one afternoon. After the markup fix and after he set out the
content, he gave the **section order** explicitly: Environment → The problem → Steps to reproduce →
Inline annotated screenshots sized to fit the frame → Current behaviour → Expected behaviour →
Sources (clearly quoted, with the reference number/key/link so anyone can navigate straight there) →
Test cases.

I had already written an order of my own that afternoon and recorded it in the skill as if it were
his. It was not — it was mine, and it put the behaviour sections before the steps and the environment
in the middle. **Recording my own invention into the skill is worse than not recording anything: the
next session would have followed it and been corrected again.**

Two rules for myself:
1. **When recording a standard on his behalf, record only what he actually said, and mark anything I
   inferred as inferred.** The superseded table is kept dated in skill 06 rather than deleted, so the
   difference between his order and my guess stays visible.
2. **He also wants the environment FIRST and the record's FULL LINK in it** — *"give me the full link
   of that work order so that I can see what is happening"*. A ticket that names a record without a
   link makes him go and find it.

## L0048 — 2026-09-10 · "no message appeared" is a negative claim and needs its own control

I wrote a defect saying a line could not be set to Declined and that *"no message of any kind
appears"*. The QA lead opened the same screen and pointed at the message I had missed, sitting at the
bottom right: *"Can`t change status while there are staged parts. Please move parts to another line
or return them."* The product was refusing correctly and explaining itself. The ticket was withdrawn
before it was filed.

**The specific mistake:** I read the page for messages **once, seven seconds after the click**. The
toast fades. Arm a watcher that polls from the moment of the action (recipe now in playbook §Y.2).

**The general mistake, and it is the one that matters:** Rule 104 says a negative claim needs a
positive control. I built one — I proved the SAVE BUTTON worked by changing Tech Time instead. But
the claim I actually published was *"no message appeared"*, and I had **no control on the message
reader at all**. I controlled the wrong instrument.

⇒ **List every negative in the sentence you are about to write, and make sure each one has its own
control.** "The button does nothing AND says nothing" is two claims and needs two proofs. Rerun with
a control on the reader, the same code caught the toast on the first attempt.

This is the fourth time in one day the same shape has bitten: a reading that named the wrong element
or the wrong moment (L0043 borders, L0043 refusal text, L0045 markup dialect, and now this).

## L0049 — 2026-09-10 · a requirement read literally against a case it was not written for

SV-9918 ("a part with no price saves at 0.00") was closed as **obsolete** by the QA lead: for a
**catalogue** part it is correct. A catalogue part is not held in stock and has no price yet — the
cost is captured on the receiving screen when it is ordered and received. The picker even labels it
**"Catalog"** on the row I screenshotted, and I did not stop to ask what that word meant.

The requirement (S4-E1) genuinely says the boxes open empty and must be filled before saving. It does
not carve out catalogue parts. I matched the words and filed.

**What I skipped:** skill 06 **§A5-b — "I have understood what the thing means in a repair shop"**,
which exists precisely because two tickets were obsoleted this way on 2026-09-08. Answering it here
would have been: *a part nobody has bought yet has no cost yet; a shop learns the cost from the
supplier's invoice at receiving.* That is a whole product concept sitting behind an empty price box,
and it was visible on the screen I photographed.

⇒ **Before filing, say out loud what the thing being tested MEANS to a shop, and check the finding
still stands.** A specification sentence read against a case it was not written for produces a real
quote and a wrong ticket — the most expensive kind, because the quote makes it look sound.

**Second, smaller thing:** the specification still says the opposite of the ruling. Unless S4-E1 is
amended, the next source-verification pass will re-derive the same expectation and the finding will
come back. **A ruling that contradicts a written requirement is not finished until the requirement is
changed** — raise it, and put it on the outstanding register.

## L0050 — 2026-09-11 · a tab is a surface, and lazily-loaded code cannot be grepped before you click

Opening the Invoice Design work I could not find the feature and was three probes into deciding it was
not on the branch. The QA lead sent a screenshot: it is the **first control on the Invoice tab** of
`/administration/settings`. Four separate readings had each failed in a way that looked like absence:

1. **The sidebar enumerator returned 0 rows**, so the "walk every row" loop walked nothing — and a
   loop that iterates an empty list prints no failures. **An enumeration that finds zero rows is a
   broken enumerator, not an empty screen.** Assert the row count before trusting the walk.
2. **I never clicked the tabs across the top.** A page can have a second navigation surface that the
   sidebar selectors do not see. The standing rule says enumerate EVERY row; it needs to say every
   row of every navigation surface on the page — sidebar, tabs, and sub-tabs.
3. **I guessed five routes.** All five render a not-found page that looks like an empty settings page
   (2 controls, no heading). Guessing routes is barred for exactly this reason and I did it anyway.
4. **I grepped the shipped code and found nothing** — because the tab's code is fetched only when the
   tab is clicked. **A code grep before the feature's screen has been opened proves nothing.**

The route and the four traps are recorded in
`build/invoice-design-selection/NAVIGATION-MAP.md`.

The general form, which is the same lesson as L0043 and L0048 at a different altitude: **before
concluding a thing is not there, prove the instrument reached the place it would be.** A walk that
visited nothing, and a grep of code that was never loaded, are not evidence of absence.

---

## L0051 — 2026-09-11 — A SHARED BRANCH MOVES UNDER YOU: GUARD EVERY READING, DO NOT TRUST ONE

**Incident.** Run 446 was executed on sv9872 while several people were testing the same feature on the
same branch. The QA lead warned: *"many people are testing on the same branch so someone might turn to
modern mode when you are running legacy mode… bear with this thing."* Twice a probe set the design to
Modern, and a render taken seconds later came back Legacy because somebody else had switched it. A
figure read across such a switch is not a finding — it is an artefact, and reporting it would have been
a false defect.

**The rule.** On any shared environment, a reading is only admissible if the state it depends on held
STILL ACROSS IT. Read the state from the system of record **immediately before and immediately after**
every observation, and **DISCARD** the observation if the two disagree — never average, never assume,
never report it. Count the discards and say how many there were.

```js
const guarded = async (label, fn) => {
  const a = await stored(); const out = await fn(); const b = await stored();
  if (a !== b) { discards.push({label, before:a, after:b}); return null; }   // DISCARD, do not report
  return {state:a, ...out};
};
```

**And read the state from the API, not the screen.** A UI read costs a page load plus a tab click plus
a settle wait (~12 s), can be stale, and returns `null` whenever the tab was not clicked first — which
silently turned a restore step into a no-op earlier the same day. One API call answers it in under a
second and cannot be stale. For Invoice Design that call is
`GET /api/organizations/invoice-settings/view` → `data.documentDesign` (`"modern"` | `"legacy"`).

**Corollary — a UI write must be VERIFIED AND RETRIED.** `setDesign('Modern')` silently failed once
because an anchored option matcher (`^Modern$`) missed the menu item's padding. The pass then rendered
three "different" designs that were all the same one. Every UI write now: perform → read the stored
value → retry up to 3 times → **log loudly if it never took**, and skip that half of the comparison
rather than reporting it.

---

## L0052 — 2026-09-11 — TWO TEMPLATES PRINT THE SAME MONEY IN A DIFFERENT ORDER: COMPARE THE SET, NOT THE LIST

**Incident.** Comparing a parts-sale invoice across the two designs, a positional comparison of the
money strings reported `sameMoneySet: false` — which reads as "the figures changed", the single most
serious thing this feature could do wrong. It had not. The Modern template adds a "Parts" subtotal row,
so the same values appear a different number of times and in a different order. The correct measure —
`onlyInLegacy: []`, `onlyInModern: []` — showed **not one value present in one design and absent in the
other**.

**The rule.** Never compare two renderings of the same document by the ORDER of what they contain. Two
templates lay the same data out differently; that is what a template is. Compare:
1. the **set difference** both ways (`onlyInA`, `onlyInB`) — this is the one that answers "did a figure change";
2. the **labelled** figures (`Subtotal`, `Total`, `Balance`, `Shop supplies`, each with the value beside it);
3. the **document number**.
A label that appears in one design and not the other is a LAYOUT difference to report as an observation,
never a wrong figure. Worked example: on an estimate view, Legacy prints a Payments row and a $0.00
Balance and Modern prints neither — every figure they both print is identical.

**Precedent.** This is the third time a crude money comparison has produced a phantom finding (see the
2026-09-10 `Total`/`Subtotal` regex that matched both). A comparison that cannot tell `Total` from
`Subtotal`, or ordering from value, is not evidence and must not reach a report.

---

## L0053 — 2026-09-11 — RUN THE POSITIVE CONTROL IN THE SAME PROBE, NOT AS A SEPARATE ERRAND

**Incident.** C53529 asks that a user without settings access cannot see the Invoice Design setting.
The earlier attempt at this class of check (2026-09-10) cleared `localStorage` and got the sign-in
screen, which proves nothing about permissions. This time the probe took a single function
`check(who)` and ran it **twice in the same pass**: once as `tech`, once as `admin`.

- `tech` → `/administration/settings` redirects to `/workorders`; the sidebar offers only Work Orders,
  Schedule, Customers; "Invoice Design" appears nowhere.
- `admin`, thirty seconds later, same code path → lands on the settings page, 13 controls, and the
  chooser reading "Invoice Design Modern" with its helper text.

The admin run is what makes the tech run mean something: it proves the instrument can see the thing it
reported absent.

**The rule (Rule 104, made concrete).** A negative finding's positive control is not a separate task to
be done afterwards — write the probe as **one parameterised function run over both subjects**, so the
control cannot drift, cannot be skipped, and cannot be run against a different build, route or moment.
If the control does not produce the positive result, the probe is broken; fix the probe, never file the
finding.

---

## L0054 — 2026-09-11 — ROUTES AND MECHANICS LEARNED ON sv9872 (Invoice Design Selection)

Recorded so no session re-discovers them. All observed live on `v26.36.2-12974d6`.

| Thing | How to reach it |
|---|---|
| The design setting | Settings → **Invoice** tab. Stored at `GET /api/organizations/invoice-settings/view` → `documentDesign`; saved by `POST /api/organizations/invoice-settings/change-design` |
| Any invoice/estimate document | `GET /api/invoices/preview?invoice_id=<id>&type=html|pdf&isEstimate=0|1&includeDeclined=0&historyEvent=` — `type=pdf` returns a real `application/pdf` |
| A work order's invoice id | `GET /api/work-orders/view/<woId>` → `invoice_id` |
| History + snapshots | `GET /api/work-orders/<woId>/history` → `data.history[]`, each with `id` and `snapshotAvailable`; pass that `id` as `historyEvent=` on the preview route |
| **Part Sales** | `/parts/part-sales` (NOT `/part-sales`, which renders an empty page). Detail: `/parts/part-sale/<id>/finance`, which uses the same `invoices/preview` route |
| **Reverse** an invoice, **Issue Credit** | the kebab (`more_vert`) on the work order's **Finance** tab — not on the customer page |
| Emailing a document | the `Send email` button generates `GET …/preview?type=pdf…` FIRST, then `POST /api/work-order/invoice/send-email`. So the emailed copy is produced by the same renderer that follows the setting — capturing that pair is how you evidence the email path without a mailbox |
| Create an invoice | `Create Invoice` on the Finance tab → `POST /api/invoices/create` (no confirmation dialog; the dialog that opens afterwards is the payment one) |
| Approving contact | `authorizer_contact_id` / `authorizer_full_name` / `company_ibs` / `ibs_approval_code` on the work order. Legacy prints an Authorizer column carrying the billing-service reference; Modern prints the contact's name. Both fields grey out once the work order is invoiced |
| Quick-login roles available | `admin` and `tech` only (`GET /api/quick-login/users`) — `tech` is the ready-made no-settings-access user |
| Not present on this branch | credit documents (none exist; `GET /api/credit-memos` is 405, POST-only), batch invoicing, imported invoices, a second selectable location in the profile menu, any way to create an organisation |

---

## L0055 — 2026-09-11 — ONE BRANCH CAN HOST MORE THAN ONE ORGANISATION, AND THE DEV LOGIN REACHES ONLY ONE

**Incident.** The QA lead seeded a credit for a customer on sv9872 and said "test it". Every search
came back empty and I twice concluded "this shop has no credits". The customer was real — it simply
lived in a **different organisation on the same branch**. `sv9872` carries at least two: **Foothills
Group Inc** (`d55bc308…`, workplaces "Staging Heavy Duty - 9919" and "Staging Lethbridge - 4310") and
**Dteem** (`32b4d057…`, workplace "Location1" `e2131c05…`). The branch's dev quick-login lands in
Foothills and **cannot reach Dteem at all**: there is no organisation switcher in the app, and
`iam/change-location` pointed at Location1 returns 200 but yields an empty session.

**The rule.** Before hunting for a record you were told exists, read **`organization_id` off the
record itself** (`GET /api/customers/view/<id>` → `data.company.organization_id`) and compare it with
the organisation your session is in. A 404/`companyId: Not found`/empty list is far more often
"wrong organisation" than "no such data". `GET /api/organizations` listing two rows is the tell.

**And a session that can READ is not a session that can CLICK.** The QA lead's own cookies
(`sv_sso_session` + `PHPSESSID` + `cf_clearance`, all three — one alone gives "Session has expired")
authenticate every API call in his organisation. But the SPA still renders the login page, because
its own auth probe `GET /api/api/sso/check` 404s on this branch and the app falls back to the
dev quick-login panel. So with a borrowed session you can **read and print, but not tick a box**.
Decide at the START whether the task needs clicks: if it does, a borrowed session will not do it, and
saying so early is worth an hour.

---

## L0056 — 2026-09-11 — `iam/change-location` IS NOT A SAFE WAY TO SWITCH LOCATION — AND REPEATING A KNOWN-BROKEN CALL IS THE REAL FAULT

**Incident.** `POST /api/iam/change-location {workplace_id}` returns **200** and looks successful. It
then leaves the session showing **no location in the top bar and zero invoices/customers**. I used it
**five times** across five probes, each time watching it break the session, each time re-booting and
trying a variant. That is the expensive part of this pass — not the first failure, the four repeats.

**The rule (mechanics).** Never call `iam/change-location` directly. A location switch is only safe
through the UI control, and on a session that has been broken by it the fix is a **fresh
`qa-branch-boot.mjs` login**, which recovers fully (verified: location back, 100 invoices visible, no
data harmed). Note the profile menu's "Change Location" row lists **only the current location** when
the user is enrolled in one workplace for that organisation — an empty submenu is not a bug to chase.

**The rule (judgement) — this is the durable one.** When an approach fails in a way you do not
understand, the second attempt must change the *hypothesis*, not just the parameters. Cap it: **two
failures of the same mechanism ⇒ stop, report what you know, and name the cheapest thing the human
could do instead.** In an emergency the honest "I need two minutes of your time" beats another forty
minutes of variants. The QA lead had already told me the branch was shared and time was short.

---

## L0057 — 2026-09-11 — `limit=N` IS SILENTLY IGNORED ON THIS API; IT CAPS AT 100

`GET /api/invoices/list?limit=300` returns **100** rows and no warning. Every "how many are there"
and "is X present" conclusion drawn from such a call is wrong by construction. I reported "only one
customer has two or more unpaid invoices" from a single capped page; paging properly found many more.
**Always page:** `?pagination[page]=N&pagination[rowsPerPage]=100`, loop until a short page comes
back. Applies to `invoices/list`, `customers`, `work-orders`, `part-sales`. (`customers?search=` is
not a valid shape on its own — it 500s; filter client-side while paging.)

---

## L0058 — 2026-09-11 — CREDIT MEMOS: WHERE THEY LIVE AND WHAT "RAISED AGAINST" MEANS

Found only by grepping the app's own bundle (`/js/index.*.js`) after route-guessing failed ten times.

| Need | Route |
|---|---|
| The credit document itself | `GET /api/credit-memos/{id}/pdf` (real `application/pdf`) |
| Credits **including unapplied ones**, with their origins | `GET /api/customer-account/list-unpaid-transaction?account_id=<customer_account_id>&pagination[...]` → rows with `type:"credit"` |
| Credits that have been **applied** | `GET /api/customer-payment/list?account_id=…` → `applied_credit_memos[]` |
| The account id | `GET /api/customers/view/<customerId>` → `data.company.customer_account_id` (NOT the customer id) |
| Create / void | `POST credit-memos`, `POST credit-memos/{id}/void` |

**`origin_invoices` is the authority** on what a credit was *raised against* — `[]` means a standalone
credit with no originating invoice. Do not infer this from the PDF alone (though the two agree: a
credit with origins prints an "Invoice Number" column, one without omits it). **Applied ≠ raised
against:** CM-103's origin is S-3 while it was *applied* on the payment for S-4. A credit that is
unapplied is invisible to `customer-payment/list` entirely — which is why an early sweep "found no
credits" that existed.

---

## L0059 — 2026-09-11 — SEEDING AN IMPORTED INVOICE (two traps, both cost a round each)

Settings → **Invoices Import** (`/administration/invoices-import`), CSV upload, `POST
/api/imports/work-order-historical`; listed by `GET /api/work-orders-imported`, printed by
`GET /api/imported-work-orders/{id}/pdf`.

1. **Keep the asterisks.** Use the screen's own *Download Template* and send its header row verbatim —
   `*Shop Location,*Customer,…`. Stripping the asterisks (the on-screen instructions list the columns
   without them) gives `400 Invalid file headers provided!`.
2. **Shop Location must name the location the session is actually on**, and Customer must exist at
   that location, or the POST returns `200 {"duplicatedInvoices":[]}` and imports nothing — a silent
   success that looks like a product bug and is not.

Worked example: `ZZAUTOTEST-IMP-003`, $262.50, and the C53568 proof (identical text under both
designs, with an ordinary invoice as the positive control changing by ~9,500 bytes in the same pass).

---

## L0056 — 2026-09-11 — ONE BRANCH CAN HOLD TWO ORGANISATIONS, AND THE DEV LOGIN ONLY REACHES ONE

**Incident.** The QA lead pointed at a customer and said "I have added credit here". Every screen came
back empty and the customer could not be found among 600 records. I concluded twice that the data did
not exist. It did — in a **second organisation on the same branch** that the dev quick-login cannot
reach. Cost: well over an hour, across two separate sessions of thrashing.

**The rule.** On any branch, before hunting for data a person says is there, **establish which
organisation and which location the session is in, and whether the record lives there.** The tell is
exact: `GET /api/customers/view/<id>` answering `{"errors":[{"companyId":"Not found"}]}` while the
session is otherwise healthy means **wrong organisation**, not missing data. Say that immediately.

**The corollary that cost the most.** `POST /api/iam/change-location` answers **200** and then leaves
the session showing zero customers and zero invoices with a null location. I called it five times
across an hour, each time reading the empty result as a fact about the product. **An API call that
"succeeds" and empties your view has broken your instrument, not revealed the truth.** One failure
should have been enough to stop. Full mechanics: `build/APP-ACTIONS-PLAYBOOK.md` §Z.1.

## L0057 — 2026-09-11 — A SESSION THAT READS IS NOT A SESSION THAT CLICKS

The QA lead's cookies gave a fully working API session in his organisation — every read, every
document, every PDF. The SPA still landed on `/login` every time, because its own auth check requests
a route that does not exist on that branch (`/api/api/sso/check`, 404 on every host and spelling).

**So state the two halves separately when reporting access:** what can be *read* and what can be
*done*. "I have access" is not a useful sentence. Here it was: everything the test needed to *observe*
was reachable, and everything the test needed to *click* was not — which meant the honest ask was
"tick these three boxes for me", not "give me another cookie". I asked for cookies twice before
working that out.

## L0058 — 2026-09-11 — WHEN WALKING STALLS, GREP THE SERVED BUNDLE; DO NOT GUESS URLS

Ten guessed endpoints for the credit-memo document all returned 404. One grep of the app's own served
JavaScript returned `printCreditMemoPDF:e=>s.get(\`credit-memos/${e}/pdf\`)` — the exact route, first
try. The same grep later produced the imported-invoice route and the change-location route.

**Rule:** after the SECOND guessed route 404s, stop guessing and read the bundle. Recipe in
`build/APP-ACTIONS-PLAYBOOK.md` §Z.7. Guessing is not "trying to unblock yourself" — it is the slowest
possible search over a space the answer is already written down in.

## L0059 — 2026-09-11 — AN EVIDENCE AUDIT IS DELIVERED ONCE, AND HIS RULING CLOSES IT

I delivered an audit of every pass in a run, grouped by how well the evidence supported the verdict.
He ruled on each group. **A ruled item is closed**: it is recorded in the project state and never
raised, re-counted or quoted back at him. Re-surfacing closed items reads as not listening and spends
the one thing he was short of.

Recorded rulings for run 446: `build/invoice-design-selection/PROJECT-STATE.md`.
