# TestRail execution log — Report Suite, 2026-08-03 (buckets A + B + run-359 UNION)

**Status: EXECUTED.** Authorised by the QA lead, 2026-08-03, verbatim: *"Go ahead and do as
necessary"* — in answer to a listing of **(a)** the 3 metadata/tester-note corrections on the Sales
By Customer permission cases and **(b)** the 1 new case for the hidden permission plus the run-359
union.

**Executor:** `exec_push_2026-08-03.mjs` (this folder). **Machine log:**
`run359-snapshot-2026-08-03/ops-log.json`. **Per-case before/after bodies:**
`run359-snapshot-2026-08-03/C<id>-BEFORE.json` / `-AFTER.json`.

**Buckets C, D and E were NOT executed** (see the bottom of this log).
**SV-8780 was NOT touched** — no comment, no transition, no read-and-edit (QA lead's ruling
2026-08-03: *"Ignore this ticket."*).

---

## SOURCE-CURRENCY BLOCK (Standing Rule 31) — established BEFORE the first write

| # | Source | Identifier | Version / last-updated | Checked | Verdict |
|---|---|---|---|---|---|
| 1 | **SBC spec** | Confluence **577634305** "SBC (Sales By Customer) Report" | **lastModified Jul 31, 2026** (CQL `id = 577634305`), body read live | **2026-08-03** | **CURRENT** |
| 2 | **The 4 TestRail cases** | live `get_case` on C30096 / C30098 / C30099 (+ C30100/C30101 to resolve the id collision) | read live | 2026-08-03 | **CURRENT** |
| 3 | **Run 359** | TestRail run 359 "Reports Suite - Nebojsa/Viktoria (VIU Pending)" | `include_all=false`; **474 tests; 539 result records** | 2026-08-03 | **CURRENT** |
| 4 | **Foreign cases** | C38919–C38923 | `created_by = 1` (Vladimir Tomovic) | 2026-08-03 | **CURRENT** — untouched (Rule 38) |
| 5 | **The build** | QA branch `project/reports-suite-bravo` | — | — | **ABSENT** — no QA branch has ever been available. **Nothing in this pass is live-observed**; the new case ships **VIU-Pending** (Rules 12/22) |

### ⚠️ TWO CURRENCY FINDINGS THAT CHANGED THIS PASS

1. **Our own local SBC spec copies are STALE.**
   `build/report-suite/specs/sbc-sales-by-customer.md` (line 111) and the
   `spec-current-2026-07-31/Sales-By-Customer-Report-current.md` capture (**v12, last updated
   2026-07-29**) both still carry the OLD **S1-R2** — *"gated by a dedicated Sales By Customer report
   View permission."* The **live page is newer (Jul 31)**. Had this pass trusted either local copy it
   would have written a refs field asserting the exact opposite of the live spec. **The live text was
   therefore fetched and quoted directly.** *Not corrected in this pass* — editing the spec mirrors is
   outside the authorised scope; recorded as an outstanding item.
2. **Run 359 holds 539 result records, not 0.** The staged plan (written earlier today) recorded
   *"0 Passed · 0 Failed · 0 Blocked · 0 Retest · 474 Untested"*. The live `get_results_for_run/359`
   returned **539 records**. This is exactly why Rule 34 requires the snapshot to be taken **at write
   time, never from a document** — a partial `case_ids` list would have destroyed 539 real records.
   All 539 were verified present after the write.

### LIVE SPEC TEXT the writes rely on (Standing Rule 25 — verbatim, Confluence 577634305, read 2026-08-03)

> **S1-R2:** *"The report is gated by ordinary reports access, not by a report-specific permission.
> Any user with standard reports access can open it; there is no dedicated Sales By Customer View
> permission."*
>
> **S1-N1:** *"A user without reports access does not see the report in navigation and cannot open it
> by direct link."*
>
> Story 1 prerequisite: *"User has ordinary reports access."*
>
> Change-log row 2026-07-31 (extract): *"…the report is gated by ordinary reports access, not a
> dedicated Sales By Customer View permission (S1-R2, plus the Story 1 prerequisite and the S1-N1
> negative case). This reverses the 2026-07-07 change… Engineering (SV-8598) to drop the dedicated
> ROLE_SALES_BY_CUSTOMER_REPORT::VIEW atom…"*

---

## OPERATIONS — 6 writes, 6 verified

| # | Op | Case / run | HTTP | Re-GET | Verified |
|---|---|---|---|---|---|
| 0a–0e | `get_case` **guard only, no write** | C38919, C38920, C38921, C38922, C38923 | 200 ×5 | — | **created_by = 1 → refused by the executor's guard** |
| 0f | `get_run` + `get_tests` + `get_results_for_run` **snapshot** | run 359 | 200 | — | 474 tests · 474 unique case_ids · **539 results** · `include_all=false` |
| 1 | `update_case` | **C30096** SBC-NAV-01 | **200** | 200 | **MATCH** — `refs` + `custom_expected` written; title / preconditions / steps / section unchanged |
| 2 | `update_case` | **C30098** SBC-PERM-01 | **200** | 200 | **MATCH** — same fields; title / preconditions / steps / section unchanged |
| 3 | `update_case` | **C30099** SBC-PERM-02 | **200** | 200 | **MATCH** — same fields; title / preconditions / steps / section unchanged |
| 4 | `add_case` into section **4289** "SBC — Permissions" | **C39447** SBC-PERM-05 (new) | **200** | 200 | **MATCH** — all 7 fields byte-equal; `custom_atmstatus=3`, `custom_automation_type=0`, `section_id=4289`, `created_by=3` |
| 5 | `update_run` **UNION** | **run 359** | **200** | — | 475 case_ids sent = `sorted(set(474 current) ∪ {39447})` |
| 6 | `get_tests` + `get_results_for_run` **verify after** | run 359 | 200 | — | **MATCH** — see the run-sync block below |

### Run-359 sync (Standing Rules 34 / 47) — the dangerous step

| Check | Before | After | Result |
|---|---|---|---|
| Tests in run | **474** | **475** | ✅ exactly old + 1 |
| New case present | — | **C39447 present** | ✅ |
| Prior case_ids lost | — | **0** | ✅ every one of the 474 still present |
| Result records | **539** | **539** | ✅ **all 539 prior records verified present by result id** |
| `include_all` | false | false | unchanged |

Snapshots on disk: `run359-tests-BEFORE/AFTER.json`, `run359-results-BEFORE/AFTER.json`,
`run359-case-ids-BEFORE.txt`, `run359-case-ids-UNION-SENT.txt`, `run359-case-ids-AFTER.txt`.

### Two failed attempts before the clean run (recorded for honesty — no data was harmed)

| Attempt | What happened | Root cause | Fix |
|---|---|---|---|
| 1 | `update_case` C30096 returned **200** but the re-GET **MISMATCHED** and the executor stopped **before** the add and the run write | TestRail treats **`refs` as a comma-delimited list** and strips the space after each comma, so the round-trip was not byte-equal | refs rewritten **comma-free** (semicolons), as every prior Report Suite pass had done |
| 2 | `update_case` C30096 returned **HTTP 400** | TestRail enforces a **~250-character limit per reference entry**; the comma-free refs was one 380-char entry | refs shortened to **≤250 chars each** (222 / 227 / 215 / 214) with a hard assertion in the executor |

The fail-fast design worked exactly as intended: the run write was never reached while a case
verification was failing.

---

## PER-CASE DETAIL — Standing Rule 41 (whole case re-verified, not just the edited field)

Each entry below states **"re-verified whole against …"** plus every field checked and any second
finding, per the execution discipline.

### 1 · SBC-NAV-01 · **C30096** · https://shopview.testrail.io/index.php?/cases/view/30096

**Re-verified whole against the live SBC spec, Confluence 577634305, last updated 2026-07-31, read
live 2026-08-03.** Fields checked: title · preconditions · steps · expected 1–5 · refs · section.

- Title — **unchanged**, still accurate.
- Precondition 2 (*"Your role has the ordinary reports access"*) — **matches** the live Story 1
  prerequisite verbatim. No change needed.
- Expected 1 (Performance group, below the four pre-existing entries) — sourced to the **PRD
  companion video 2026-07-30**, not to the spec; **S1-R1** only requires that it *"appears in the
  Reports left-side navigation."* Recorded so the video-sourced half is never mistaken for spec text.
- Expected 3 / 4 — **match S1-R3 / S1-R4** verbatim.
- **Written:** `refs` re-pinned to the live spec version; the tester note (expected item 5) replaced.
- **Second finding:** none in the case. The finding was in **our own spec mirrors** (see Currency
  Finding 1).

**refs after (222 chars):**
`SV-8600 (SBC spec S1-R1; S1-R3; S1-R4 — Confluence 577634305 v-2026-07-31; Performance-group placement per the PRD video 2026-07-30; access = ordinary reports permission per Chris Ward 2026-07-31 Q4=A + SV-8598 sheet Q1=A)`

### 2 · SBC-PERM-01 · **C30098** · https://shopview.testrail.io/index.php?/cases/view/30098

**Re-verified whole against the same spec + version.** Fields checked: title · preconditions · steps
· expected 1–4 · refs · section.

- Expected 3 — *"Ordinary reports access alone is enough — this report does NOT need a permission of
  its own"* — **is the live S1-R2 in plain words.** Left untouched.
- **Removed as factually false:** the old refs clause *"S1-R2 + the build still use a dedicated
  permission."* The **spec half stopped being true on 2026-07-31.**
- **Written:** `refs` + tester note (expected item 4).
- **Second finding:** the live spec change-log still instructs engineering to **drop** the atom,
  whereas Chris's later chat ruling permits **hiding it and leaving it inert**. Under Rule 32 the
  later product source wins; the refs now records that explicitly so the next reader is not misled.

**refs after (227 chars):**
`SV-8600 (SBC spec S1-R2 — Confluence 577634305 v-2026-07-31 — now reads "gated by ordinary reports access; not by a report-specific permission"; Chris Ward Q1=A; built atom hidden-and-inert per his ruling; SV-8780 Ready to Fix)`

### 3 · SBC-PERM-02 · **C30099** · https://shopview.testrail.io/index.php?/cases/view/30099

**Re-verified whole against the same spec + version.** Fields checked: title · preconditions · steps
· expected 1–4 · refs · section.

- Precondition 1 (*"role does NOT have reports access"*) — **matches the CORRECTED S1-N1**, which now
  says *"A user without reports access"* (it previously said *"without the Sales By Customer report
  View permission"*). Already correct; no change needed.
- Expected 3 (*"there is no separate Sales By Customer permission to remove"*) — **matches** *"there
  is no dedicated Sales By Customer View permission."*
- **Written:** `refs` + tester note (expected item 4).
- **Second finding:** none.

**refs after (215 chars):**
`SV-8600 (SBC spec S1-N1 — Confluence 577634305 v-2026-07-31 — now reads "A user without reports access does not see the report in navigation and cannot open it by direct link"; Chris Ward Q1=A; SV-8780 Ready to Fix)`

### 4 · SBC-PERM-05 · **C39447** (NEW) · https://shopview.testrail.io/index.php?/cases/view/39447

Section **4289 "SBC — Permissions"** (child of 4282 "Sales By Customer Report", child of 4281
"Reports Suite") — **verified live from `get_sections`, not guessed.** Non-API, UI-only, so it stays
out of an "API" section (Rule 4). `custom_atmstatus: 3`, `custom_automation_type: 0`.
`viu_status: VIU-Pending`.

**Title (72 chars):** *"No Sales By Customer permission is offered in the role permission editor"*

**⚠️ INTERNAL ID CHANGED FROM THE STAGED PLAN — an id collision the plan missed.** The plan named
this case **SBC-PERM-03**, but **SBC-PERM-03 = C30100** and **SBC-PERM-04 = C30101** already exist.
The next free id is **SBC-PERM-05**, which is what was used. Nothing else about the case changed.

**refs (214 chars):**
`SV-8598 (SBC spec S1-R2 — Confluence 577634305 v-2026-07-31 — "there is no dedicated Sales By Customer View permission"; Chris Ward Q1=A + his ruling to hide an already-built permission from the front end; SV-8780)`

---

## ONE DELIBERATE DEVIATION FROM THE STAGED PLAN (Standing Rule 46 — visible, not silent)

**The staged plan's tester note named the ticket key "SV-8780" in the tester-facing Expected field.
That was dropped.** Standing Rule 20 is explicit that the tester-facing Title / Preconditions /
Steps / Expected carry **no ticket IDs**; the references live in the metadata layer. The note
therefore says *"report it against the change already raised with the developers"*, and **SV-8780
stays in `refs`**, where it belongs. Nothing about what the tester checks was weakened.

**The tester note now on all four cases (identical text):**

> *"Note for the tester: the product owner has ruled that every report in this suite opens with the
> ordinary reports access, and the written description now says the same. If the build still demands
> a separate Sales By Customer permission, mark this test Failed and report it against the change
> already raised with the developers — do not change the test. You may also find a "Sales By
> Customer" permission still listed for an administrator to switch on and off: that should have been
> hidden from the screen, so please report that too. If it is listed but switching it on or off
> changes nothing at all, that part is expected for now — just report that it is still visible."*

---

## LOCAL SOURCE + DELIVERABLES

| Item | Result |
|---|---|
| Case source | `cases/cases-sbc-A-access-filters.json` — 3 cases patched (`spec_ref`, tester note, notes) + **SBC-PERM-05 inserted** after SBC-PERM-04 |
| `testrail-id-map.csv` | **475 rows · 0 blanks** · `SBC-PERM-05 → C39447` recorded |
| Import | regenerated by `gen_import.py`; **475 data rows**; header **byte-identical** (verified by `cmp` against the pre-run header); 0 VIU words, 0 flag words, 0 internal-id leaks, 30 API cases all in "API" sections |
| C-id re-merge | the generator blanks the id-map C-ids on rerun — **475/475 re-merged**, 0 blanks |
| **Reconciliation** | **local active 475 == live-ours 475 == id-map 475 == import rows 475** |
| Live total under group 4281 | **480 = ours 475 + 5 foreign** (C38919–C38923, Vladimir Tomovic) — reported both ways per Rule 38 |

---

## WHAT WAS **NOT** EXECUTED

| Group | Cases | Status |
|---|---|---|
| **C** — 6 permission-name edits | C30325, C30603, C30604, C30398, C30526, C30527 | **NOT EXECUTED.** Re-staged for authorisation in `staged-case-plan-CDE-2026-08-03.md` |
| **D** — 4 precondition edits | C30322, C30534, C30392, C30451 | **NOT EXECUTED.** Same |
| **E** — retire-or-rescope | C30327, C30391 | **NOT EXECUTED.** Same; recommendation = **RESCOPE, not retire** |
| **SV-8780** | — | **NOT TOUCHED.** No comment, no transition, no edit. QA lead's ruling 2026-08-03: *"Ignore this ticket."* The draft at `build/dev-tickets-2026-07-31/SV-8780-followup-draft.md` is left in place, unposted, with a NOT TO BE POSTED banner added at its top |

**Secrets:** none written. Credentials read at runtime from `/tmp/testrail/creds.json`; the staged
diff was grepped for the password, the literal account email and the Figma-token prefix — **0 hits** (the only match was this sentence naming the pattern, which is prose, not a secret).
