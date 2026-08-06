# Schedule full live VIU — FINDINGS

**Read `BUILD-MARKER-MOVED.md` first.** This pass spans **two different builds**; no single
build was ever observed across all 168 cases.

| | Cases | Build checked against | Date |
|---|---|---|---|
| Batches 1–5 | **97** | `v3.5-d122eef` — **superseded, no longer exists** | 8/5/2026 |
| Batch 6, batch 7, batch 7b | **40** | `v3.5-7ec992f` | 8/6/2026 |
| Rest of 7b, all of 8 and 9 | **31** | **not yet observed** | — |

**137 of 168 carry a verdict; 31 do not.** Nothing was inferred for the 31, and nothing from
the first 97 has been quietly upgraded to look as though it was seen on the current build.

## 2026-08-06 session — the sign-in, and what caused the earlier 401

**The session was alive the whole time. The 401 that stopped the previous attempt was OUR OWN
malformed cookie header, not a dead sign-in.** Building the header with `paste -sd'; '` alternates
the two delimiter characters, so the string came out as `A=1;B=2 C=3` and the third cookie was lost.
Rebuilt correctly, `GET /api/auth/me/fe-permissions` on `sv8685api.qa.shopview.com` returned **HTTP
200** with 42 permissions and `view_mode: full` on the first try.

**The diagnostic supplied with the cookies is confirmed:** `sv_sso_session` and `PHPSESSID` were
byte-identical to the set that had 401'd, and only `cf_clearance` differed. So what expires first on
this estate is the **Cloudflare clearance**, not the sign-in — on a 401, ask for a fresh
`cf_clearance` before assuming a whole new sign-in is needed. `POST /api/quick-login` was **never
called**.

**Build read at session start and at session end: `v3.5-7ec992f`, last-modified Wed 05 Aug 2026
22:49:36 GMT, etag `e2a80a6ab5e0b47c29fd88af9db1e980`, and the served `index.html` is BYTE-IDENTICAL
on sha256 across both reads. No redeploy occurred under this session.**

## Verdict tally (137 recorded)

| Family | Count |
|---|---|
| PASS (incl. label-fix, hold-lifted, over-specified-case, was-expect-fail) | **99** |
| DEVIATION (incl. new, partly-fixed, stale-text, wrong-marker) | **31** |
| HELD | **3** |
| NOT OBSERVED, reason recorded | **1** |
| **Re-opened as UNSETTLED by a later observation** | **1** (C30050 — see below) |

## The headline of this session: two EXPECT-FAIL markers are now wrong

**SV-8853 no longer reproduces on either half it was raised for.**

* **SCH-KEY-01 = [C30066](https://shopview.testrail.io/index.php?/cases/view/30066)** — Escape now
  closes the **"Delete from this series?"** dialog and the **"Reassign shift"** dialog on the FIRST
  press. Both are the layers the spec names first in its stacking order, and both are exactly what
  the case's "Known issue" paragraph says do not close.
* **SCH-KEY-03 = [C30068](https://shopview.testrail.io/index.php?/cases/view/30068)** — Enter now
  confirms the reassign dialog: it closed and produced the toast **"Shift reassigned."** with an Undo
  action.

Both cases currently carry `AUTOMATION: READY - EXPECT FAIL (SV-8853)` **for a fault that no longer
reproduces** — precisely the defect class this pass was sent to find. **SV-8853 should be re-checked
and probably closed.**

This is the third instance in this project of ticket status failing to track build state, and it is
the reason the QA lead's new three-outcome block exists — see
`EXPECT-FAIL-BLOCK-REQUIREMENT.md`.

## Verdicts recorded this session (11 cases, all on `v3.5-7ec992f`)

| Case | Internal ID | Verdict | One line |
|---|---|---|---|
| [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) | SCH-TOOL-03 | **DEVIATION** (SV-8874) | Searching removes non-matching blocks instead of fading them — 53 blocks became 16, all 16 matching, none faded. All five search fields do match, and clearing restores all 53. |
| [C30045](https://shopview.testrail.io/index.php?/cases/view/30045) | SCH-VIEW-04 | **DEVIATION — NEW, no ticket** | Month view shows the VIN on 9 of 25 blocks. Spec §4.4: *"Shown in day and week views only; month view omits it due to space constraints."* Items 1, 2, 4 and 5 pass, including the day-view lane growing 104px → 123px. |
| [C30066](https://shopview.testrail.io/index.php?/cases/view/30066) | SCH-KEY-01 | **PASS** (was expect-fail) | See above. |
| [C30068](https://shopview.testrail.io/index.php?/cases/view/30068) | SCH-KEY-03 | **PASS** (was expect-fail) | See above. Enter in the note textarea correctly inserts a newline instead of confirming. |
| [C30070](https://shopview.testrail.io/index.php?/cases/view/30070) | SCH-KEY-05 | **PASS** | Focus never left the modal across 18 tabs and wrapped; all seven toolbar controls and the sidebar are reachable across 65 stops. |
| [C30071](https://shopview.testrail.io/index.php?/cases/view/30071) | SCH-COLOR-01 | **PASS** | A seeded single shift and a seeded 10-shift series spanning 11–20 Aug both came back `#e2effe` and render `schedule-block--blue`. |
| [C30072](https://shopview.testrail.io/index.php?/cases/view/30072) | SCH-COLOR-02 | **PASS** | Recolouring one shift changed **zero** other blocks, including the other shift of the same work order. Three tones confirmed: fill, text, 3px left border. |
| [C30073](https://shopview.testrail.io/index.php?/cases/view/30073) | SCH-COLOR-03 | **PASS** | Label renamed shop-wide and seen from another shift **and** from an event's picker. Restored afterwards. |
| [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) | SCH-HRS-02 | **PASS** | Toggle labelled exactly "Set custom hours for this technician", OFF by default, reveals a Monday–Sunday editor. |
| [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) | SCH-HRS-04 | **PASS** | "Add Hours" appends an **empty** second range, removable on its own. |
| [C38851](https://shopview.testrail.io/index.php?/cases/view/38851) | SCH-HRS-05 | **PASS** | Message reads exactly *"These hours overlap. Adjust the times so they don't conflict."*; Save disabled during the overlap; an incomplete row shows *"Both times are required"* instead and does **not** block Save. |

## Two label corrections owed to the cases (Rule 9)

1. **[C30073](https://shopview.testrail.io/index.php?/cases/view/30073)** — pressing **Enter does
   not save** a renamed colour label; there is a dedicated save control and Enter alone leaves the
   row in edit mode. The case's step should say to save.
2. **[C30072](https://shopview.testrail.io/index.php?/cases/view/30072)** — the case asserts the
   sibling shift keeps its *"(default blue)"* colour. Only the substantive half — that it does not
   change — is provable when the sibling has been recoloured before. Relax the parenthetical.

## A defect seen but deliberately NOT filed

Turning **"Set custom hours for this technician"** ON for **Benjamin Peters** (Staging Lethbridge -
4310) produced the inline error *"Couldn't load this technician's hours, so they can't be edited
right now. Close and reopen the dialog to try again."* on **every** attempt, and the toggle snapped
back to OFF, so no editor ever appeared for him. Whether this is staff-specific or location-specific
was **not** established, and it is entangled with the item below — so it is recorded, not filed.

## ⚠️ C30050 IS RE-OPENED, AND THE WORKING-HOURS SERVICE LOOKS BROKEN

Read `TECH-HOURS-REGRESSION-2026-08-06.md`. **Three symptoms were observed live on
`v3.5-7ec992f`, and one explanation fits all three — the working-hours service is erroring.**

1. **The grid shows no technician hours** though the toggle reads on — **0 of 23 rows**, sampled at
   1.5 s, 5.5 s and 11.5 s and again on a fresh load, with **no hours data anywhere** in the board
   payload.
2. **Saving a technician's hours does not persist** — Ayesha Khan AK's Monday was set to 10:00–16:00
   and saved; re-opened, it reads **07:00 – 21:00**, its original value.
3. **One staff member's hours cannot be loaded at all** — Benjamin Peters produces *"Couldn't load
   this technician's hours…"* on every attempt.

**Our own edit is RULED OUT as the cause.** The first reading of this suspected our save had broken
something; re-opening the record proved **the stored value never moved**, so nothing we did altered
it. Our failed save is itself symptom 2.

**Nothing has been filed** — a network capture, a duplicate search and a scope check are owed first,
and "it does not work" is not the standard for a symptom line.

**Consequences that the write pass must respect:**

* **SCH-VIEW-09 = [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) must NOT be
  written either way.** Its PASS earlier today, and the report that **SV-8851's fix had shipped
  while its ticket sat Open**, may both have been taken during a healthy window of a flapping
  service. Both observations are real; both are on the same build.
* **SCH-START-01 = [C29969](https://shopview.testrail.io/index.php?/cases/view/29969) is NOT
  settleable after all** — a distinct technician window cannot be created while saves do not
  persist. It stays blocked, **for a new reason**.
* **C38847, C38849 and SCH-START-02 = [C29970](https://shopview.testrail.io/index.php?/cases/view/29970)**
  may be blocked by the same service rather than merely unstarted — check before assuming.

## Two near-misses — false defects avoided by looking twice

1. **A cross-technician drag looked completely broken** — three attempts moved nothing and
   produced no toast. Each had in fact **opened a "Reassign shift" confirmation that was never
   confirmed**. The drag works. (Rules 12/44.)
2. **The shift modal looked to have no focus rings at all** — 1 of 26 stops by outline and
   box-shadow. **Quasar paints its focus indicator on a `.q-focus-helper` CHILD element**; once that
   was read, **every button in the modal had one**. Had it been filed it would have been wrong.
3. **The Unassigned lane looked absent** (recorded in the earlier session) — it is real, sits below
   every technician row, and only renders in a range that already contains an unassigned shift.

## Honest limits

* **31 of 168 have no verdict** — two Working Hours cases that need shop business hours, all of
  batch 8 (Permissions, Edge Cases) and all of batch 9 (Regression, API). Listed case by case in
  `RESUME.md`.
* **The 97 verdicts from batches 1–5 sit on a build that no longer exists**, and **the 25 deviations
  among them were NOT re-driven this session.** We did not look, and we do not guess.
* **SCH-START-01 = [C29969](https://shopview.testrail.io/index.php?/cases/view/29969) is still
  BLOCKED, for a NEW reason.** The plan — give one technician a genuinely distinct window — was
  attempted and **the save does not persist**, so the distinct window cannot be created through the
  UI at all. The old reason ("every technician has the identical window") is superseded.
* **SCH-START-02 = [C29970](https://shopview.testrail.io/index.php?/cases/view/29970) is still
  HELD**, together with **C38847** and **C38849**, all three of which need shop business hours set
  on Edit Location.
* **NO TESTRAIL WRITE HAS BEEN MADE.** Not one, in this session or the previous one. Nothing is
  half-written and there is no repair owed.
* **The branch is not declared final, so every verdict is PROVISIONAL** (Rule 49).

---

# 2026-08-06 SESSION 2 (batch 8) — build `v3.5-7ec992f`, unchanged all session

**Build read at 04:58Z and 05:34Z: `v3.5-7ec992f`, last-modified Wed 05 Aug 2026 22:49:36 GMT, etag
`e2a80a6ab5e0b47c29fd88af9db1e980`, `index.html` sha256 `66e91c52…dbbc53` — identical to the previous
session's reads. NO redeploy.**

**141 of 168 now carry a verdict; 27 do not. STILL ZERO TESTRAIL WRITES** — proven, not asserted: all
168 re-read live and compared field by field, **0 differ on any field including `updated_on`**.

## The headline: the "broken working-hours service" was three different things, and one was ours

Full write-up in `TECH-HOURS-RESOLVED-2026-08-06.md`.

| Symptom | Verdict |
|---|---|
| *"Saving a technician's hours does not persist"* | **FALSE — our own harness bug.** The Save button was clicked without being scrolled into view, so the click hit nothing. Scrolled first, the `PUT` fires with the edited value, returns 200, and it reads back. |
| *"The grid shows no technician hours"* | **REAL, and already SV-8851** (read live: Open, Low, parent SV-8700). |
| *"One staff member's hours cannot be loaded"* | **REAL, unticketed, user-facing — now [SV-8933](https://shopview.atlassian.net/browse/SV-8933).** It is location scoping. |

**Two near-miss false defects avoided by trying to disprove first**, which is the whole point of that
step: the save bug was ours, and **SV-8923 — which we filed earlier today — is invalid** because it
was observed against an unmet precondition.

## Nine cases settled this session

| Case | Verdict | One line |
|---|---|---|
| [C38847](https://shopview.testrail.io/index.php?/cases/view/38847) SCH-HRS-01 | **PASS** | Toggle *"Set business hours for this shop"* is OFF by default and reveals one row per day, Monday to Sunday. All five items. |
| [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) SCH-HRS-03 | **PASS** | A technician with no custom hours now shows the shop's `360–1080` window on the board, identical to the shop-level window; Ayesha keeps her own `420–1260`. Causal — the shop hours were set minutes earlier. |
| [C29970](https://shopview.testrail.io/index.php?/cases/view/29970) SCH-START-02 | **PASS** *(was HELD)* | Drop on a technician with no hours → `12:00Z` = 06:00 Edmonton = the shop start exactly. |
| [C29969](https://shopview.testrail.io/index.php?/cases/view/29969) SCH-START-01 | **PASS** *(was BLOCKED)* | Drop on Ayesha → `13:00Z` = 07:00 = her own start. The two drops prove the §4.2 hierarchy in one sitting. |
| [C30047](https://shopview.testrail.io/index.php?/cases/view/30047) SCH-VIEW-06 | **PASS** *(was DEVIATION)* | Shading works: 40 elements ON, 0 OFF, 40 ON again, two bands of exactly 6.0 hours. **SV-8923 is invalid.** |
| [C30050](https://shopview.testrail.io/index.php?/cases/view/30050) SCH-VIEW-09 | **DEVIATION (SV-8851)** *(was UNSETTLED)* | 0 of 23 rows show hours. The earlier same-day flip to PASS/"fixed" is **withdrawn — no fix shipped.** |
| [C30045](https://shopview.testrail.io/index.php?/cases/view/30045) SCH-VIEW-04 | **DEVIATION (SV-8941)** | Month view shows the VIN on 11 of 67 blocks; Week 29/55 and Day 6/12 are correct. |
| [C30080](https://shopview.testrail.io/index.php?/cases/view/30080) SCH-PERM-07 | **PASS** | Clicking Edit while View is off **auto-selects View**; Delete nests on top. Nothing saved — re-read shows all three OFF again. |
| [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) SCH-PERM-13 | **PARTLY OBSERVED** | Items 1 and 2 PASS on all nine roles. **Items 3 and 4 NOT observed** — they need impersonation. Not claimed. |

## Corrections to our own earlier claims

1. **"The board payload carries no hours data" is FALSE.** It carries a **`workingWindows` array of
   162 entries** with correct per-technician ranges. The grid simply does not render them — a sharper
   statement of SV-8851, and useful to whoever fixes it. The earlier scan ran over an empty capture
   and returned `undefined`, which was read as "nothing found".
2. **A staff-scope figure of "161 of 161 failing" was WRONG.** It used the staff list's `id` where
   this endpoint wants the separate **`staff_id`** on the same record. The real figure is **63 of
   161**. Same user-id-vs-staff-id trap already recorded for Custom Roles.
3. **A role-permission read reporting 9 of 11 roles with Schedule View OFF was WRONG.** The Quasar
   permission checkbox holds its state on the **root's `aria-checked`** (and a
   `q-checkbox__inner--truthy` class); the hidden `<input type=checkbox>` inside reads `checked=false`
   even when the permission is ON. Same class of trap as the `.q-focus-helper` focus-ring one.

## Two method traps worth adding to the playbook (§J) — not edited from here

* **Quasar checkbox state** is on the root's `aria-checked`, never the hidden `<input>`.
* **Clicking a control below the fold**: always `scrollIntoViewIfNeeded()` before a coordinate click.
  A missed click looks exactly like a feature that does nothing, and it cost us a false defect today.

## Honest limits

* **27 of 168 still have no verdict** — 11 Permissions, 7 Edge Cases, 5 Cross-Module, 4 API. Listed
  case by case in `RESUME.md`. Nothing was inferred for any of them.
* **C38926 is PARTLY observed** and says so; its items 3 and 4 are not claimed.
* **The 25 stale deviations from batches 1–5 were NOT re-driven this session** — they still sit on
  `v3.5-d122eef`, a build that no longer exists.
* **NO TESTRAIL WRITE HAS BEEN MADE**, in this session or any before it. Nothing is half-written.
* **The branch is not declared final, so every verdict is PROVISIONAL** (Rule 49).


---

# 2026-08-06 SESSION 3 — the pass FINISHED and WRITTEN

**Build `v3.5-7ec992f`, read at 06:03:34Z and 06:37:13Z — `index.html` byte-identical on sha256. No
redeploy under this session.**

**All 168 cases now carry a definite recorded state, and all 168 have been WRITTEN.** This is the first
session of the pass in which any TestRail write was made.

## The three things this session was sent to do, and what came of each

### 1. SV-8923 was disproved and withdrawn

We filed it, it was wrong, and we proved it wrong ourselves before touching it. C30047's own precondition
says *"The shop has working hours set"* and the original observation was taken with none set. With them
set to 06:00–18:00 the switch shades correctly: **0 shaded elements off, 40 on, 0 off again**, in two
bands that begin at exactly the **midnight** and **6 PM** slot marks read straight off the time axis
(x 524 and x 1390). **C30047 is a PASS.** SV-8923 is closed **OBSOLETE / Done** with a plain comment,
**not deleted**; every field read back. Full record: `SV-8923-WITHDRAWN.md`.

**The lesson is the useful part: a precondition that is not satisfied does not produce a defect, it
produces a test that could not be run.** Checking the source case's own preconditions is now the first
step before filing anything.

### 2. The 27 unobserved cases were driven — 15 settled, 12 need a sign-in we do not have

Re-derived by **CASE ID** from the live 168 minus every recorded verdict: **27**, matching `RESUME.md`.

**Two verdict changes worth naming.** **C38873 HAS SHIPPED** — the long-series guard returns **HTTP 409**
(*"The series would span 98 days, beyond the 56-day limit. Resubmit with acknowledgeLongSeries…"*), the
acknowledgement lets it through as **201** materialising **70 shifts under one series id**, and the
**120-shift cap returns 422 even with the acknowledgement**; the refused calls left **nothing** behind.
And **C38865's own text claiming it cannot be run is FALSE** — a series *can* be spread across the
1 November clock change, and it was: all 70 shifts hold **06:00 America/Edmonton** on both sides with the
stored UTC correctly moving 12:00Z → 13:00Z. The requirement is met in the data; the **screen** shows
12 PM then 1 PM, because the Schedule renders raw UTC — already **SV-8848**.

**Two candidate defects were disproved rather than filed.** A suspected cross-location information leak
turned out to answer **identically for a completely invented id**, so it distinguishes nothing. And a
Month view apparently rendering **zero** blocks was **our own selector** — Month uses `.fc-daygrid-event`;
re-counted properly it renders 68.

### 3. The 25 stale deviations were re-driven — 18 of them, and SEVEN FLIPPED TO PASS

**Every one of the 27 tickets our cases cite was read live first. Not one is Done.** Ticket status was
then deliberately **not** used as a verdict, and that judgement paid for itself seven times:

**SV-8857 is fixed** (the Filters button now carries a count badge and *Clear all* resets everything in
one click) · **SV-8849 is fixed** (a series block opens from Week view, and the banner carries an edge
chevron and a *"Week 1 of 2"* cue) · **SV-8850 is fixed** (the *"+N more"* popover **lists** the hidden
shifts and clicking one **opens** it — proven in Day view by seeding four overlapping shifts to force an
overflow) · the **create-event toast and Undo now exist** · **event cards are now structurally distinct**
from shifts, checked on grey, teal **and** violet · and the **tooltip now caps line names at three** with
a *"+24 more lines"* row.

**Eleven still deviate and were re-proven, not assumed.** Three of them have gained tickets since they
were written — **SV-8826**, **SV-8893**, **SV-8915** — so their *"no ticket exists"* text was false and is
now gone.

**And a regression in a case we had already passed.** **C29962's click-to-arm alternative has been REMOVED
between `v3.5-be42149` and `v3.5-7ec992f`** — zero controls anywhere carry it, on load, on hover, or in
the expanded line list. Filed **SV-8957**. Its absence is also why four spread and scope cases could not
be re-driven: the drag will not complete through our tooling, and the click route no longer exists.

## The write pass

**168 `update_case` ops, every one HTTP 200, 30 fields compared each, 0 mismatches, 0 collateral changes.**
All three text fields sent on every op. Read back live: **exactly one** provenance line, **one** build
stamp and **one** marker on every case; **0 raw markup**; **0** barred phrases.

**Provenance is now two sentences that never merge** — the first names only documents, the second says
which build the case was **actually seen on**, so **78** say `v3.5-d122eef` / 8/5/2026 and **90** say
`v3.5-7ec992f` / 8/6/2026. **Every expect-fail case carries the three-outcome block** with a symptom we
observed ourselves and a **named ticket** — there is no no-ticket variant.

**Markers: 119 READY · 21 READY - EXPECT FAIL · 28 HOLD = 168. Gate: 119 + 21 = 140 = 168 − 28.**

**Run 357 proven untouched** — 168 tests, 429 results, all present by id, **0 graded and 0 derived fields
changed**, `include_all` still false.

## Honest limits

* **The branch is NOT declared final, so all 168 verdicts are PROVISIONAL** (Rule 49). Queue: `RECHECK-QUEUE.md`.
* **78 of the 168 verdicts sit on a build that no longer exists.** Each case says so on itself.
* **12 cases have never been observed** and say so — they need a second sign-in as a non-administrator.
  Impersonation was deliberately not used: a sibling worker shares this session, and `quick-login` and
  `switch-user` were **never called**.
* **7 deviations were not re-driven** — two drag techniques were tried and the click alternative is gone.
* **2 cases are only partly observed** and name the items they do not claim.
* This pass drove the 27 unobserved and re-drove 18 of the 25. **It was not a fresh live run of all 168
  and does not claim to be.**
