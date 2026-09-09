# PROJECT-STATE — Inline Add and Edit Parts on Work Order Lines

**Canonical cold-resume doc.** Status derived live; do not trust remembered figures (Rule 92 / skill 15 §7).

## 🆕 Update — 2026-09-09 (17:00 UTC) — QA-lead rulings applied; escalations RESOLVED

The 4 held/escalated items from the FULL re-verify (same day, below) were ruled on by the QA lead and
applied. All 4 written via the fr-view harness (`ONLY=…`), `atm=1` preserved, runnable-gate clean,
live-audited version 16 + read 9 Sep 2026, and all in run **R418**:
- **C44993 / C44994 (S1-N1/N2) — SPEC IS AUTHORITATIVE.** (The QA lead first said "build is right", then
  corrected it: for these the specs/design sources are authoritative — sources are ALWAYS the authority,
  Rule 57.) The cases keep the documented expectation — button/Edit control hidden on **Complete,
  Invoiced, Paid, Declined, and Imported** (per S1-N1/N2) — and the build gap (button currently shown on
  Declined; "Imported" may be unreachable) is handled by **three-outcome tester notes** (Rule 62b), not by
  narrowing to match the build. Rule 57 build-divergence note added; no build-check line (needs build-verify).
- **C45034 (S3-E1 struck) — "logical, doesn't bite".** Reframed from "save fails with a concurrent-edit
  alert" (a behaviour the spec removed as out of scope) to a **single-user runnable** case: the inline
  edit **saves normally, no "changed by someone else" alert** (no concurrent-edit detection platform-wide).
  Retitled. Build-check line dropped → needs fresh build observation.
- **C45250 (was manually-added; conflicted with S1-R9) — fixed + re-sourced.** Its wrong expectation
  ("+ Add Part disappears on a Complete line") was corrected to S1-R9 ("+ Add Part **is available**;
  system auto-uncompletes the line"), and the source changed from "Manually added" to **spec-derived
  S1-R9** (Story 1, SV-9316, v16). **This closes the S1-R9 coverage gap** — a separate new case would
  duplicate it (Rule 28), so none was created. Retitled. Build-check dropped → needs build observation.
- **Coverage-gap decision (#4):** S1-R9 is now covered by the corrected C45250; no new case created
  (would duplicate). S1-N4 remains a low-priority flag only. Duplicate S4-R21 numbering + §8-table stale
  rows = spec tidy-ups for Sasha (report-only, non-blocking).

**⇒ Both suites are source-verified, source-current, runnable-shape clean, fr-view — HANDOVER-READY to the
build-verification session.** The 4 cases above carry no build-check line and must be build-verified first.

**2026-09-09 (17:10) — whole-case reconciliation fix (L0025).** The user caught that on the UPDATE cases I
had re-derived only the Expected, leaving Title and Preconds/Steps stale. Fixed: **C44993/C44994** titles
now list all 5 statuses and their **preconds+steps now walk all 5** (Declined/Imported checked, with a
reachability caveat); **C45007** title made conditional and its **steps now exercise BOTH branches**
(no-category → Uncategorized; has-category → keeps own); **C45250** title restored. All fr-view, runnable
3/3, titles persisted, live-verified. A read-only title-vs-Expected audit of all 163 cases in both suites =
**0 genuine contradictions**. Rule 41 hardened in skill 02 §5b clause 4.

**2026-09-09 (17:29) — Steps-vs-Expected COVERAGE audit (the 5th dimension).** After the title/steps
lessons, ran a read-only coverage audit across all 163 cases (do the steps make every Expected outcome
observable?). Found **2 real gaps**, both fixed: **C45039** step 2 only edited cost → added the sell-price
edit so "inventory sell price still overwritable" is actually exercised; **C45232** steps covered only 2 of
3 modal branches → steps now run Tech View, Full-View-without-See-Financial-Data, and
Full-View-with-See-Financial-Data, and preconds give the permission route. Both fr-view, runnable 2/2,
titles preserved. **⇒ All five dimensions (title · preconds · steps · expected · sources) now independently
audited across both suites — handover-ready.**

---

## 🆕 Update — 2026-09-09 (LATEST) — FULL source re-verification (corrects the 2026-09-07 delta)

**The 2026-09-07 pass below was a DELTA** — only 5 of 123 cases carried the re-verify date; 113 were still
"31 August 2026" (i.e. stamped against the pre-2026-09-04 spec) and 5 manually-added had no spec line. A
live audit (QA lead, 2026-09-09) caught it; directive **L0021: always full, never delta**. Fixed today.
- Spec 782761986 re-checked **live 2026-09-09**: **NOT moved since v16** (Last Updated 2026-09-04).
- **FULL diff (Rule 43): 114 UNCHANGED · 4 UPDATE · 5 manually-added checked.**
  - **UPDATED (content):** **C44993/C44994** (S1-N1/N2 — added the Declined & Imported statuses the spec
    lists, with 62(b) three-outcomes notes for the build gap; build-check removed → re-build-verify) ·
    **C45007** (S2-R11 — added "keeps its own category" condition).
  - **HELD + escalated (Rule 58):** **C45034** (asserts a concurrent-edit alert the spec STRUCK as out of
    scope) · **C45250** (manually-added; conflicts with S1-R9 "Add Part available on Complete"). Neither re-stamped.
- **117 spec-derived cases re-stamped** to **version 16, read 9 September 2026** (5 page-id-style normalised);
  rendered `fr-view`. **6 Automated re-stamped** (C45005/45026/45223/45224/45227/45237, QA-lead go-ahead) →
  `source-verify-2026-09-09/FOR-VLAD-2026-09-09.md`. **4 manually-added left** (correct source): C45251-54.
  Vladimir's 4 foreign untouched. Run R418 already holds all 123.
- **OUTSTANDING:** C44993/C44994 (spec-vs-build Declined status; is "Imported" real?), C45034 (retire/reframe
  + §8 tidy-up), C45250 (S1-R9 conflict), coverage gaps S1-R9/S1-N4. Detail:
  `source-verify-2026-09-09/{SOURCE-CURRENCY-2026-09-09.md, FULL-REVERIFY-DIFF-2026-09-09.md}`.
- **CONFIRMED LIVE (16:12 UTC 2026-09-09):** harness `fixed 117/0 fail` (the 6 Automated re-stamped, not
  skipped, once the whitelist bug was fixed) → **117/117 `fr-view`**; independent live audit = **117/117 carry
  both "specification version 16" and "read on 9 September 2026"**, 0 stale. Content updates verified landed
  (C44993 "Declined", C45007 "keeps its own category"). Inline source-verify is COMPLETE.

Re-source-verified (QA lead, 2026-09-07; one of three suites). Pulled latest sources live first. Full
record: `source-verify-2026-09-07/SOURCE-CURRENCY-SPEC-DIFF-2026-09-07.md`.

- **Spec (Confluence 782761986) Last Updated 2026-09-04** — two change-log entries: modal-cancel
  reversal + Story 7 formalised. **Story 7 Jira now SV-9724** (was TBD).
- **5 substantive deltas handled (all via html.set, fr-view, 0 failures; runnable 5/5):**
  - **S4-R12 modal-cancel REVERSED** (2026-09-04, reversing 2026-08-24): cancel discards nothing,
    returns to the inline row → **C45047** rewritten (title changed). **Build-check line removed** —
    the 2026-09-01 build predates the reversal, so build verification must re-check it.
  - **S2-R5** inventory description read-only + read-only-after-save (SV-9766) → **C45001**.
  - **S4-R4** inventory cost read-only + Found-part fields read-only → **C45039**.
  - **S7-R12** See-Financial-Data routing of the Bin Locations vs part details modal → **C45232**
    (refs → SV-9724).
  - **S4-R21 new**: (a) category→sell recalc via Pricing Matrix (SV-9673) already covered by
    manually-added **C45253**; (b) Full-View-without-See-Financial-Data three-field row → **new case
    C53477**.
- The 4 rewritten cases had the stale build-check line removed (expected changed post-build); all are
  atm=1 (Rule 71 not triggered). **Automated cases (C45005/26/223/224/227/237 + manually-added
  C45252/53/54) untouched** (their rules unchanged). **Vladimir's cases untouched (Rule 38): C45220,
  and 3 new — C45268, C53474, C53475.**
- **Suite now 123 ours** (122 + new C53477). **Run R418 union-synced 123 → 124.** Other ~114 cases
  unchanged (non-substantive → provenance left as-is, project precedent).
- **Reported, not created:** SV-9677 (deleted-inventory-part raw error; spec says a rule is still
  needed). Build verification is a separate session.

---

## 🆕 Update — 2026-09-02 — AUTOMATED CASES MADE RUNNABLE; EVERY QUOTED LABEL CONFIRMED

**Inline Add and Edit Parts: 123 cases live** (counted from TestRail, paged — never from `testrail-id-map.csv`).
run 418, 123 tests, set-equal. Build on the branch moved to **`v26.35.6-0f8d60b`**.

**QA lead authorisation, 2026-09-02, verbatim:** *"yes this case needs to be updated, and all those
test case also need to be updated which are automated but yet they should be updated to make them
runnable and Build verified. This authorization is for these three suites for now. 1. Invoice refresh
2. Inline Add Part 3. Workorder Print"* — **Vladimir Tomovic's cases stay excluded regardless.**

**Precondition-label gate: ALL CLEAR.** Every label quoted anywhere in this suite is now recorded in
`build/OBSERVED-UI-LABELS-sv9315.md` with the evidence that confirmed it.

**Run the one-command gate before reporting this suite:**
`python3 build/testing-tools/verify_suite.py --root <section> --observed build/OBSERVED-UI-LABELS-sv9315.md`
— ten checks, exit 0 only when all pass. Full detail: `build/skills/00-COMMON-CORE.md`, and the
per-suite outcomes in `build/OUTSTANDING-ITEMS-REGISTER.md` rows AUT-1 … MECH-1.


## 🆕 Update — 2026-09-01 (LATEST) — BUILD-VERIFIED ON A LIVE QA BUILD AND HANDED OFF TO THE MANUAL QA TESTER

**Any "no build / routes PROVISIONAL" reading below is now STALE.** The suite was verified live on
**sv9315.qa.shopview.com, build `v26.35.6-598cc8a`**, on 1 September 2026, and every route in it is
the route actually walked.

**Verdicts, 119 cases:** 111 PASS · 2 PARTIAL · 1 FAIL · 2 NOT VERIFIED · 2 open product-owner
questions · 1 FOREIGN (C45220, Vladimir Tomovic — untouched). Per case:
`build-verify-2026-09-01/verdicts/PER-CASE-VERDICTS.md`. Report:
`build-verify-2026-09-01/REPORT-2026-09-01.md`.

**Writes: 118 of 118 applied through the TestRail UI editor, 0 failures.** All four post-write checks
clean: runnability 118/119 (the one is C45220), 118 markers with the gate balancing both ways, Rule-54
sentence 2 on exactly the 114 cases this pass observed live and nowhere else, and 0 escaping containers
on the served pages.

**The one deviation: C45068.** Clicking the pencil on a part line while a POPULATED inline add row is
open opens the Edit Part Request modal immediately, with **no** discard confirmation, and leaves the
add row behind it. Observed twice. S5-E1 requires S6-R5's confirmation first. **Ticket text ready,
nothing filed** — the Jira hold stands, and per the QA lead's 2026-09-01 instruction a go-ahead means
re-verify on the build first and then ask per candidate. Register row HO-4.

**A correction worth keeping.** Nine Story 7 cases were reported blocked on bin data states that did
not exist. They existed all along: `/api/inventory/parts` ignores `pagination[rowsPerPage]` and
`page` as most callers write them, so the read saw **100 of 6,879** parts. Recorded as
`build/APP-ACTIONS-PLAYBOOK.md` §S. **A "the data does not exist" conclusion needs the paging proved
first.**

**Handed off to Viktoria Videnovic** (TestRail user 4) on 2026-09-01 — not Mudassir Qamar, who owns
Invoice UI Refresh (QA lead, 2026-09-01). Run **418**, 119 tests, set-equal to the cases in both
directions, zero results pre-recorded. Deliverables in `build/handoff-2026-09-01/`: the brief,
`HOW-THE-NUMBERS-WERE-DERIVED.md`, and the `Defects-for-Testers` workbook. Six gates were run at
handover and every one is re-runnable from that folder.

**Also on 2026-09-01:** the 6 cases the brief does not send the tester through end to end now carry
that reason **inside the case**, at the end of Expected Results (skill 04 §4). Gate:
`build/handoff-2026-09-01/check_self_explains.py`.



### 🆕 2026-09-01 (LAST) — C44996 REPLACED BY FOUR CASES FROM THE QA LEAD; SUITE IS NOW 122

He deleted **C44996** and added **C45250, C45251, C45252, C45253** in section 6755. `get_case/44996`
answers HTTP 400. The FAIL this pass had recorded against C44996 was taken on a part-**free** line,
which is not the state his replacement describes — so it is not carried over, and the verdicts file
says so where the entry used to be.

| Case | Verdict | What settled it |
|---|---|---|
| **C45252** | **FAIL** | Entering the Cost does not fill or recalculate the Sell price. Instrumented properly after a first run measured its own instrumentation: assigning `.value` is not reliably seen by the component that derives the sell price, so the cost is TYPED with real key events. Positive control: picking a stocked part fills cost 53.52 / sell 86.32, so the row does populate prices. Typing 10.00, 100.00, 200.00 left it at 86.32 every time; on a priceless catalogue part it stayed 0.00. **22 pricing matrices are configured** (Settings → Pricing), one marked Default |
| **C45253** | **FAIL** | Changing the Category does not move the Sell price. The category is an `<input>`, so its value reads from `.value` — the first run read `innerText`, got `""` five times, and would have called a working control broken. With the row label demonstrably moving Uncategorized → AUTO-Brakes → 70%Override → AUTO-Batteries, the sell price stayed 86.32 |
| **C45250** | **NOT VERIFIED** | His route is the right one and that is exactly where it stops. A line will not complete while a part on it is unfulfilled — *"Line can`t be completed with unfulfilled part requests."* Authorising the line moves the part from `quoted` to **`in_stock`**, still not fulfilled, and the part row's context menu offers only "Move" and "Add Part Fee / Discount", so the pick happens in the Parts area. Not claimed as a verdict |
| **C45251** | **NOT VERIFIED** | Same blocker, plus a special-order part taken through Order → Receive |

**HIS WORDING WAS NOT TOUCHED — that is the C44996 lesson applied.** Three additive changes only:
the **marker literal** (`AUTOMATION: Ready` → `AUTOMATION: READY` — every census, gate and arithmetic
check in this repo matches on that exact string, so as written the four read as having no marker and
the suite's gate would not have closed), the **build sentence** on the two that were observed, and a
**tester note**. His preconditions, steps, expected text and his own *"Source: Manually added"* line
are carried through verbatim; the writer now asserts that source line survives instead of reshaping it
into our standard sentence.

**Two parser traps worth keeping.** His cases use `<ol><li>`, not `<p>` — a `<p>`-only parser silently
dropped the whole expectation on the first attempt. And the workbook generator read case titles from a
saved `cases-*.json` snapshot, which died on a `KeyError` the moment a case was added; it now reads
titles from the live census.

**Suite totals: 122 cases** — 112 PASS · 4 FAIL (C45060, C45068, C45252, C45253) · 2 PARTIAL (C44993,
C44994) · 3 NOT VERIFIED (C45034, C45250, C45251) · 1 FOREIGN (C45220). Run 418 re-synced,
**122 tests, set-equal in both directions, 0 results recorded.** Arithmetic gate: READY 121 + 0 = 121,
121 − 0 HOLD = 121 → closes.

### 🆕 Later on 2026-09-01 — FOUR MORE CASES SETTLED BY SEEDING THE DATA STATE, AND TWO NEW DEVIATIONS

QA lead, verbatim: *"You are never supposed to create defect, you are supposed to make the tests
RUNNABLE."* So the four cases reported as NOT VERIFIED were seeded rather than left blocked:

| Case | Was | Now | What settled it |
|---|---|---|---|
| **C45239** | NOT VERIFIED | **PASS** | `GET /api/parts-catalogue/catalogue-parts-that-are-not-on-location` returns **19,496** catalogue parts held on no bin. Selecting one (F40010212, labelled "Catalog" in the typeahead) gives no bin chip, no allocation, no "Pulled from" line — S7-N1 met. Positive control: a stocked part shows chip "H3B" |
| **C45060** | NOT VERIFIED | **FAIL** | The same part's catalogue record has **no cost or sell-price field at all** and it is stocked nowhere. S4-E1 requires the boxes to open EMPTY and the user to fill them before saving. They open **0.00**, and Save **succeeded** — HTTP 201, "Part added", no validation message. A part can be added at zero price with nothing typed |
| **C44996** | NOT VERIFIED | **FAIL** | The line status enum HAS `complete`, so this was never a data gap. Walked a part-free line `authorization_required → authorized → complete` (a direct jump answers 400 naming the transition; a line with parts cannot complete at all). With the badge reading "Complete" the line **still shows "+ Add Part"** — `evidence/last3-line-complete.png`. S1-N4 requires it hidden |
| **C45034** | NOT VERIFIED | **still NOT VERIFIED** | Honestly unseeded: it needs a real second actor. Two attempts from a second connection could not get the edit row open at the change moment, so nothing is claimed either way |

**NO TICKETS WERE PREPARED for the three deviations (C44996, C45060, C45068).** Each case now carries
the three outcomes in plain words so the tester runs it and marks it Failed, and keeps
`AUTOMATION: READY` — an EXPECT FAIL marker needs a live ticket and there is none.

**THE MISTAKE BEHIND TWO OF THESE, WRITTEN DOWN SO IT IS NOT REPEATED.** C45060 and C45239 were both
reported "the state may not be reachable in this product at all". Both conclusions came from
`/api/inventory/parts` — the **stocked** parts — while both cases are about **catalogue** parts, a
different set. Same shape as the earlier `rowsPerPage` error (playbook §S): **a conclusion drawn from
the wrong list.** Before reporting a data state as non-existent, name the list you looked in and ask
whether it is the list the case is about.

**Test data restored:** the seeded catalogue part was removed, the 13 ZZAUTOTEST part rows left on
S9315-14846 by earlier probes were removed (verified 0 remaining), the line status was walked back and
verified, and the shared **Technician role** was put back to its pre-write snapshot — it had drifted to
Full View, most likely from a stray keyboard Enter on the role edit screen during an earlier probe, and
that repair is recorded in `build/printer-friendly-wo/build-verify-2026-09-01/evidence/tech-role-restore.json`.

**FOUR MORE CASES ARE NOW FLAGGED AUTOMATED — C45223, C45224, C45227, C45237.** This morning only
C45005, C45026 and C45220 were. All four were written before the flag appeared, so nothing was written
to a protected case; from now on they need a per-case go-ahead (Rule 71).

## Update — 2026-09-01 (runnable-steps gate: NOT RUNNABLE = 0 for all non-Automated cases)
Ran `build/testing-tools/check_runnable_cases.py` (reads TestRail live) over the whole suite: it flagged
22 cases NOT RUNNABLE (all R4 — the FIRST step, or a bare "Attempt to Save" later step, did not say where
to go). Fixed **21 of ours** (created_by 3, atm=1) by anchoring the offending step to the state the
preconditions already establish (Inline: "In the work order line's Parts section (see Preconditions), …"
or "On the open inline part row (see Preconditions), …"; guard dialogs point at the named dialog; the four
"Attempt to Save" steps now name the Save control on the inline row). Preconds/Expected untouched (Rule 57);
routes remain PROVISIONAL (no build). Edited through the TestRail UI editor (Froala) so every field stays
`markdown fr-view` — verified served-page fr-view + no literal tags on each. Cases: C45021, C45023, C45034,
C45035, C45036, C45038, C45045, C45053, C45060, C45063, C45064, C45068, C45071, C45076, C45082, C45221,
C45223, C45228, C45239, C45242, C45243. **Final gate: 118 RUNNABLE / 1 NOT RUNNABLE** — the one remaining is
**C45220** (foreign, Vladimir Tomovic / created_by 1, and Automated atm=3) → left untouched (Rules 38 + 71).
Local `cases/*.json` steps synced to match. Gate exit criterion met.

## Identity
- **TestRail parent folder (group):** group_id **6597**, suite 1 — cases live in the sub-sections inside it, not directly in the folder. Link: https://shopview.testrail.io/index.php?/suites/view/1&group_by=cases:section_id&group_order=asc&display=compact&display_deleted_cases=0&group_id=6597 (recorded 2026-08-25)
- **Epic:** SV-9315 · **PO / Owner:** Sasha Grosman
- **Spec:** Confluence **782761986**, live **v16** (verified 2026-08-31; was v13 on 2026-08-25)
- **Design:** Claude "Add Part" artifact `561657da` (appearance reference; static export held)
- **Tech plan:** `intake-2026-08-25/sources/tech-plan-2026-08-18.md` (behind PRD v13; informs only, Rule 30)
- **QA env:** none yet → **Rule 85 SOURCE-VERIFIED ONLY**
- **Case source:** `cases/` · internal ID prefix **IAEP** (`IAEP-<AREA>-NN`)

## Scope (from spec v16)
- **7 stories**, **129 rule IDs**. Stories 1–6 = SV-9316–SV-9321 (107 rule IDs). **Story 7 "Bin
  Allocation on the Inline Row" (added v16, 2026-08-27) = 22 rule IDs (S7-R1…R18/N1–N2/E1–E2); its
  Jira story ticket is TBD — cases ref the epic SV-9315.** Single surface: Work Order → Lines → Parts,
  forking by Work Order View Mode (Tech View / Full View). New v16 "Keyboard Model — Inline Row"
  section is the single source of Tab order (S2-R13 / S4-R15 point to it).

## Status — 2026-08-25 (authoring pass complete)
- **FULL SUITE AUTHORED: 96 cases** across 6 areas.
- **Coverage: 107/107 rule IDs, both directions, 0 uncovered, 0 orphan anchors** (coverage-matrix.md).
- **RUA:** 96/96 KEEP (2 WEAK-KEEP tied to open PO questions), 0 CUT, 0 NONSENSE.
- **Rule-85:** every case "Not available on Build to test Yet - Last checked 8/25/2026".
- **NO TestRail writes. NO Jira. Nothing pushed** (id-map C-IDs blank). Import ready for the QA lead.
- **Open PO questions (Sasha Grosman):** PO-IAEP-1 (S3-E1 scope: PRD keeps it, tech plan D3 defers it) ·
  PO-IAEP-2 ("Imported" status guard: PRD hides Add Part/Edit, tech plan plans no such check).
- **Deliverables:** requirements.md (v13) · coverage-matrix.md · intake-2026-08-25/{INTAKE, SOURCE-CURRENCY,
  SURFACE-MATRIX, DELIBERATE-DECISIONS, OUTSIDE-IN-GAP-HUNT, quality-audit/AUDIT.md} · cases/ ·
  testrail-id-map.csv · testrail-import/Inline-Add-and-Edit-Parts_testrail-import.{csv,xlsx} ·
  questions-2026-08-25/.
- **Reconciliation:** authored 96 = import 96 = id-map 96; set-equal both ways.

## Status — 2026-08-31 (source re-verification v13→v16)
- **Spec re-verified live: Confluence 782761986 now v16** (metadata.version=16, "Last Updated"
  2026-08-27). Verbatim body captured at `intake-2026-08-25/sources/spec-body-confluence-v16-782761986.md`.
  §11 Change Log is EMPTY — the v13→v16 delta was derived by body diff.
- **v13→v16 delta (rule-by-rule):** NEW **Story 7 Bin Allocation** (22 rule IDs, zero prior coverage);
  NEW **Keyboard Model — Inline Row** section; **S2-R4** amended (typeahead cards carry inventory qty +
  bins; selecting triggers bin allocation); **S2-R6** amended (qty may be set by a bin split, S7-R14);
  **S2-R13 / S4-R15** amended (defer Tab order to the Keyboard Model); **§5** (Bin / Default bin /
  Allocation terms added), **§9** (Bin Locations modal is the one Tech View modal), **§8** (two bin
  messages). **Stories 1, 3, 5, 6 unchanged.** S2-R19, S3-R7/R9, S4-R20, S4-N5/N6, S6 edit wording,
  S2-N1 combined message: re-confirmed IDENTICAL to our cases (they already matched from the 2026-08-24
  edits) — re-stamped only.
- **Suite now 118 cases ours** (was 96): +22 Story-7 cases **IAEP-BIN-01…22 → C45221–45240, C45242, C45243**
  (section 6771 "Inline Add and Edit Parts - Bin Allocation"), covering all 22 S7 rule IDs 1:1, 0 uncovered.
- **Amended existing cases updated to v16:** IAEP-TADD-03 (C45000, S2-R4 bin trigger + typeahead cards),
  IAEP-TADD-05 (C45002, S2-R6 bin split), IAEP-TADD-12 (C45009, S2-R13 keyboard model tab order),
  IAEP-FADD-15 (C45050, S4-R15 keyboard model tab order), IAEP-TEDIT-03 (C45025, S3-R4 edit-row tab order).
- **Provenance re-stamped to v16 / "read on 31 August 2026" on all cases we could touch (114 of 116
  non-held; the 2 held keep v13 stamp).** AUTOMATION marker unchanged "Not available on Build to test
  Yet" (Rule 85, no QA build) with "Last checked 8/31/2026".
- **🛑 Rule 71 HOLD — 2 of our cases are live-flagged Automated (atmstatus=3) by Vladimir Tomovic and
  were NOT edited this pass:** IAEP-TADD-08 (C45005, S2-R9) and IAEP-TEDIT-04 (C45026, S3-R5). Both map
  to rules UNCHANGED in v16, so they miss only the provenance re-stamp, no behaviour change. They also
  carry pre-2026-08-31 CSV-import formatting that fails/warns the render self-check (C45026 no block
  tags; C45005 <br>) — cannot be reformatted without the QA lead's go-ahead (Rule 71). **Ask Sasha/Vlad
  whether to re-stamp + reformat these two.**
- **Foreign case in the group:** **C45220** "Adding a part to a completed line reopens the line" —
  created by **Vladimir Tomovic** (TestRail user 1), Automated (atm=3). Hands-off (Rule 38). It was
  pulled into R418 by the union-sync (below). Note it appears to contradict S1-N1 (Add Part hidden on
  Complete) — surface to the QA lead. Ours **118** / live subtree total **119** (1 foreign).
- **Render self-check:** all 116 cases we wrote render clean (block-only <ol>/<li>/<hr />/<p>, no inline
  tags, no <br>). Only the 2 held Automated cases flag (pre-existing, not ours to fix).
- **Run R418 union-synced (Rule 34): 96 → 119 tests** (added the 22 new bin cases + the foreign C45220;
  nothing dropped). https://shopview.testrail.io/index.php?/runs/view/418
- **Deliverables refreshed:** requirements.md (→ v16 incl. Story 7 + Keyboard Model), coverage-matrix.md
  (129/129, +S7 block), testrail-id-map.csv (118 rows, all C-IDs), testrail-import CSV/XLSX (118 rows),
  author_cases.py + apply_to_testrail.py.
- **Still no QA build → Rule 85 SOURCE-VERIFIED ONLY.** Open PO questions PO-IAEP-1/2 still open.

## Status — 2026-08-31 (render-container repair to fr-view)
- **PROBLEM (measured, not theoretical):** TestRail serves each case field in one of two containers,
  invisible to the API — `<div class="markdown fr-view">` (block HTML renders, readable) vs
  `<div class="markdown">` (block HTML **ESCAPED** — the tester literally reads `<ol><li><p>`). An API
  `update_case` always leaves the field in the ESCAPING container; **only a UI save flips it to
  `fr-view`.** The 2026-08-31 v13→v16 API pass converted these cases' plain text to block HTML, so a
  live scan found **76 of the 118 escaping** (e.g. C45000 = 3/3 fields escaping).
- **FIX (QA-lead-approved UI-repair-to-fr-view):** drove the TestRail web editor with Playwright
  through the local MITM bridge and re-saved each field so the container flips to `fr-view`. Evidence +
  scripts in `render-repair-2026-08-31/` (scan.mjs, repair.mjs, fix_deterministic.mjs, REPAIRED-final.jsonl).
- **RESULT — final re-scan of all 118 (scan-final.json): escaping 0, all-fr-view 118, zero literal
  tags, zero visible entities.** 77 targets (76 escaping + C45005) verified fr-view + numbers visible +
  AUTOMATION marker last + atmstatus/title unchanged; 0 failures.
- **Rule 71 / 65 — the 2 Automated cases (atm=3, Vladimir Tomovic) were UI-repaired this pass with the
  QA lead's explicit go-ahead (skip lifted for these two only):** **C45026 (IAEP-TEDIT-04, S3-R5)** was
  escaping → repaired to fr-view + re-stamped v13→v16; **C45005 (IAEP-TADD-08, S2-R9)** was found live
  already fr-view + v16 and was NOT written. atm=3 preserved on both. FOR-VLAD note:
  `render-repair-2026-08-31/FOR-VLAD-automated-cases-changed-2026-08-31.md`. Foreign C45220 untouched (Rule 38).
- **🛑 LESSON — a case's readability is decided by the SERVED-PAGE CONTAINER, not the API-stored HTML.**
  `build/testing-tools/check_case_render.py` reads the API value and cannot see the container, so an
  API-written case with perfect block HTML PASSES that check yet is UNREADABLE on screen. The only fix
  is a **UI save** (Playwright). Two further traps proven this pass: (1) keystroke-typing "1. " into a
  field that still holds the old `<ol>` intermittently triggers Froala's list-autoformat, which swallows
  the literal "1." into a real `<ol>` marker (lost from the tester's numbered view) — so set content
  **deterministically via the Froala instance** (`window.FroalaEditor.INSTANCES.find(i => i.$oel[0].id ===
  '<field>_display').html.set('<p>line<br>line</p>')`) rather than keystrokes; (2) TestRail intermittently
  rejects the save with **"Deadlock found when trying to get lock"** — **retry the save** (loop, backoff).
  Chromium **cannot TLS through the egress proxy** (connection reset) — it must go through the local MITM
  bridge (`build/atlassian-login/bridge.mjs`, `NODE_USE_ENV_PROXY=1`), and Node fetch API calls likewise
  need `NODE_USE_ENV_PROXY=1` + `NODE_EXTRA_CA_CERTS`.

## Status — 2026-08-31 (layman-UI provisional routes — skill 18)
- **STANDARD ENFORCED (QA lead, 2026-08-31, universal):** no case may ship with spec-level
  preconditions/steps; every case must be runnable from the UI by a manual QA (Victoria). This suite is
  **Rule 85 (no QA build)**, so routes are **DESIGN/SPEC-derived and marked PROVISIONAL — to be
  confirmed on the build.** Only PRECONDITIONS/STEPS were touched; Expected Results unchanged (Rule 57).
- **Routes added (from spec v16 + the "Add Part" design + the sibling Invoice-UI NAVIGATION-MAP's
  confirmed top-nav):** entry route in every case — *In the top menu click "Work Orders" → open a work
  order of the right status → its Lines tab → each work order line has its own Parts section, where
  "Add Part" and the part lines appear.* Permission/view-mode preconditions ('Work Order Line - Create
  and Edit', 'Work Orders → Work Order View Mode' = Tech/Full View) now say plainly that an
  administrator sets them "on your user role; confirm the exact path on the build" — **no admin menu
  path invented** (task hard line). Intermediate-state preconditions (inline row open, bin picker,
  Bin Locations modal, part details modal, discard/navigate-away dialogs, "Pulled from" chip) now name
  the click that reaches them. Wording matches the suite convention (UI labels in smart double quotes,
  permissions in single quotes; no markdown — Froala inserts text literally).
- **Applied through the UI editor (Playwright → Froala `html.set` → Save, deadlock-retry ×15) so each
  field is written AND flipped to `fr-view` in one save** (an API write would leave it escaping).
  Recipe `render-repair-2026-08-31/layman_fix.mjs` (adapted from fix_deterministic.mjs, Rule 27);
  intended content regenerated by `gen_intended.py` from the edited JSONs; checkpoints in
  `REPAIRED-layman.jsonl` / `FAILED-layman.jsonl`.
- **RESULT: 116 of 118 verified on the served page — `markdown fr-view`, 0 literal tags, 0 visible
  entities, route text present, AUTOMATION marker still last, atmstatus & title unchanged. 0 failures.**
- **🛑 Rule 71 — the 2 Automated cases (atm=3, Vladimir Tomovic) were SKIPPED this pass (no go-ahead):
  C45005 (IAEP-TADD-08) and C45026 (IAEP-TEDIT-04).** They still carry spec-level wording and do NOT
  yet meet skill 18. Ready-to-apply route text for both is in `intended-blocks.json`; ask/enrich per
  `render-repair-2026-08-31/FOR-VLAD-layman-routes-automated-2026-08-31.md`.
- **Local JSONs (`cases/`) updated to match TestRail.** No Expected Results / no Jira / no run changes.
- **Still Rule 85 SOURCE-VERIFIED ONLY — routes are PROVISIONAL until a QA build confirms exact tab
  names, the Parts-section placement, the admin paths, and the bin/modal controls.**

## How to resume
1. On go-ahead from Sasha's answers: fold PO-IAEP-1/2 outcomes into IAEP-TEDIT-12 and IAEP-BTN-06/07.
2. When a QA build exists: run skill 03/11 build verification; re-stamp AUTOMATION markers.

## TestRail run (2026-08-25)
- **Full-suite run R418** — all 96 cases — https://shopview.testrail.io/index.php?/runs/view/418. C-IDs backfilled into testrail-id-map.csv. New cases: append via `build/testing-tools/sync_runs.py --apply` (union-only, Rule 34).

## Status — 2026-09-01 (source currency re-confirmed; QA lead cleared 6597 to this session)
- QA lead directed the other (build-verify) session NOT to touch 6597/6617 so this session owns them.
- **Source re-checked LIVE 2026-09-01: Confluence 782761986 is still v16** — unchanged since the 2026-08-31 v13→v16 source verification. **Source verification remains CURRENT; no new case changes warranted.**
- Remaining, not source work: (a) 3? no — the 2 Automated cases C45005/C45026 await Vlad for the layman-route enrichment (Rule 71); (b) build verification is blocked (Rule 85, no QA build) — routes stay PROVISIONAL until a build confirms exact labels.

## Status — 2026-09-01 (C44996 split into 4 manually-added cases, per QA lead)
- **QA lead converted C44996 into 4 new manual cases and had C44996 deleted.** C44996 was a single vague "Add Part/Edit hidden when the work order is not editable otherwise" (S1-N4) case; it is replaced by 4 concrete, single-behaviour cases in section 6755 (group 6597), source = **"Manually added"** (not the spec pipeline):
  - **C45250** — Completed line does not offer the Add Part option.
  - **C45251** — Completed line: only the allowed part fields are editable (inventory vs SPO).
  - **C45252** — Add Part calculates the Sell Price from the cost via the pricing matrix.
  - **C45253** — Changing the part category recalculates the Sell Price via the matrix.
- All 4 verified on the served page (`markdown fr-view`) and pass `check_runnable_cases.py` (RUNNABLE). Marked **AUTOMATION: HOLD — manually added; to be build-verified** (UI control names New Work Order/New Line/line-status control are PROVISIONAL, to be confirmed by the build-verification session).
- **C44996 deleted** (snapshot kept at `manual-cases-2026-09-01/C44996-snapshot-before-delete.json`). Run **R418** union-synced 118→122 tests (C44996 gone, 4 new in). Local: `cases/cases-15-manual-additions-2026-09-01.json` added, IAEP-BTN-09 removed from cases-01, id-map updated (121 rows).

## Status — 2026-09-02 (one more manually-added case)
- **C45254** — "Add Part: cannot enter a custom Cost for an inventory part" (source: Manually added, QA lead). In section 6755, group 6597; verified `fr-view` + passes `check_runnable_cases.py`; AUTOMATION: HOLD (to be build-verified). Added to run R418 (→123 tests); local `cases-15-manual-additions-2026-09-01.json` (now 5 manual cases) + id-map updated.
- ✅ **Overlap RESOLVED (QA lead, 2026-09-01):** the QA lead manually edited **C45252** in the TestRail UI and scoped its part-number step to **"add a special order part number from the typeahead list"** — so C45252 (special-order → Cost drives Sell price) no longer conflicts with **C45254** (inventory → Cost NOT enterable). He also rewrote C45252's Expected into an **EXPECT-FAIL / three-outcomes** case documenting the live defect (Sell price does not recalculate from Cost) and moved its marker **HOLD → READY** (build-verified 2026-09-01, v26.35.6-598cc8a). Local `cases-15-manual-additions-2026-09-01.json` synced to his edit; do **not** re-write C45252 via the API (its source block uses `<br>`, which renders from a UI save but shows literally through an API write).
