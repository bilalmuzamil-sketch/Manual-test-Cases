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
