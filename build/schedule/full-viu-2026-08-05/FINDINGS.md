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
