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
