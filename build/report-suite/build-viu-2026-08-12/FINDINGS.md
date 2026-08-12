# FINDINGS — Report Suite build VIU, 12 August 2026

**Build `v3.6-8c28eed`, read three times byte-identical · session alive throughout · ours 480 /
live 492 · run 359 proven undamaged.**

---

## 1 · Can a manual tester run this suite in the morning? — **Yes, with one caveat**

**438 of the 480 are runnable and 42 are not**, and the 42 are now listed by name in
`TESTER-SKIP-LIST.md`. The suite is **structurally clean, measured live after the writes**: exactly
one provenance line and one automation marker on every one of the 480, **0 raw markup, 0 titles over
80 characters, 0 barred "as per the build tested on" phrases**, and the four counts reconcile
set-equal in both directions (live 480 · id-map 480 · import 480 · run 359 tests 480).

**The caveat is honest and it is about coverage, not quality: only 8 of the 480 carry a verdict
established against the build that is running.** The other 472 were last checked against `v3.5`
builds and say so on themselves. Under Standing Rule 60 that is the ordinary state of a branch under
continuous deployment — it touches the labels and the pass/fail verdict, and invalidates no
expectation — but it must not be described as *"the suite is current"*.

---

## 2 · The headline: `SV-8907` is fixed, and half a case family was wrong about it

**8 of 8 download attempts succeeded** — four Work In Progress tabs (15, 3, 4 and 15 rows: every one
of them a tab *with* work orders, the exact state the failing assertion says must break) x two
formats. HTTP **200** each time, a real file each time, **all eight file sizes different**, and the
notification **"Success — Data exported successfully."**

**Five cases were corrected** and three had their build line re-stamped because they had been flipped
to `READY` yesterday **with no build session at all**. Detail in `WIP-DOWNLOAD-VERDICT.md`.

**OWED TO THE QA LEAD: `SV-8907` should be closed.** It is not ours to close, and the creation
hold means nothing was written to Jira. This is Standing Rule 61 outcome (3) — the case told us what
to do if it passed, it passed, and the report is the action.

---

## 3 · The near-miss, which is the most transferable thing here

**A textContent-only label sweep would have "corrected" five Work In Progress cases into wording no
tester will ever see, on a FINAL report, hours before release.**

The tab labels carry `text-transform: capitalize`. `textContent` gives
`Approved - partially completed`; the tester reads `Approved - Partially Completed`. **Our cases say
the second, and they are right.** The playbook's Trap 1 records that a screenshot lies about casing
and the fix is to read `textContent` — this is the **reverse** case, where the case is describing
what the tester sees and `textContent` is the misleading one. **Both readings are needed. Neither
alone is "the label".** Recorded in `LABEL-DIFF.md`; it belongs in playbook section I.

On the classes that could be settled exactly, **7 of 7 matched — exact and in order** — all on the
three final reports.

---

## 4 · Two more things that looked like faults and were not

**(a) Sales By Customer and Technician Utilization order the same four download items differently** —
SBC groups by format, TU by view. This is the sort of thing that becomes a spurious 9 a.m. defect.
**The suite had already handled it**: `C30434` states in its own text that TU's order is not part of
the check, while SBC's `C30159` fixes the order and matches its own report exactly. Two correct
cases, two different requirements.

**(b) Work In Progress's column-selection list has 15 items and `Location` is not one of them**,
while Inventory Value's list does contain it. **Deliberately not reported as a finding.** It is the
open Location-column question already sitting with Chris Ward on the round-3 sheet, with three cases
already on `HOLD` naming it — and it cannot be settled from a single-location scope anyway. *Before
recording anything as absent you have to be in a state where it should appear*, and this session was
not.

---

## 5 · What this pass did NOT do — the exact remainder

| | |
|---|---:|
| our cases | **480** |
| observed against `v3.6-8c28eed` this session | **8** |
| **not observed this session** | **472** |

The 472 keep their own earlier build line, each stating honestly what it was last checked against.
**No build line was invented for any of them.**

Also not established:

- **The date-range picker's nine named presets.** Opening it showed a calendar; the preset panel was
  not captured. `C30102`, `C30501` and siblings carry **no verdict** from this pass.
- **`C30511`'s *"if you turn Inv. Hrs on, the download is refused"*.** The column toggle did not take
  in the harness — the header row and the export's `columns` parameter were both unchanged after the
  click — so **nothing is claimed either way**. A click that misses looks exactly like a feature that
  does nothing, and that mistake has already produced one false *"the service is broken"* report in
  this workspace.
- **`C30517`'s PDF logo.** One embedded JPEG is present, consistent with a logo, but an embedded
  image is not an observed logo. Untouched.
- **`C30518` items 2 and 3** — the *"Empty export"* warning and the failure toast were never
  produced; no tab was empty and nothing failed.
- **Label surfaces other than the screen**, except the Work In Progress files actually downloaded.
- **Every permission case**, across all six reports — one shared sign-in on this environment, and
  `quick-login` / `switch-user` were **deliberately never called** because they rotate the shared
  token and a sibling worker is live.

---

## 6 · Structural verification of all 480, measured live

| check | result |
|---|---|
| exactly one `AUTOMATION:` marker per case | **480 / 480** |
| exactly one Rule-54 provenance line per case | **480 / 480** |
| markers reconcile | **343 `READY` + 95 `EXPECT FAIL` + 42 `HOLD` = 480; 343 + 95 = 438 = 480 - 42** |
| raw HTML markup shown to the tester | **0** |
| titles over 80 characters | **0** |
| barred phrase *"as per the build tested on"* | **0** |
| four counts set-equal both directions | live 480 · id-map 480 · import 480 · run 359 tests 480 |
| cases with no build line at all | **9** — and this is CORRECT, not a defect: each says in its own words it has not been checked against any build (C30169, C30288, C43550, C43558, C43559, C43591-C43594) |

---

## 7 · OUTSTANDING — what I need from you

1. **Close `SV-8907`.** Proven fixed by 8 of 8 download attempts. We did not touch Jira: the creation
   hold is active and it is not our ticket.
2. **The Location column, still with Chris Ward.** The round-3 question sheet is unanswered. It holds
   **3 cases on `HOLD`** and leaves `C30511`'s note in place. Nothing can settle it but his answer.
3. **A second sign-in on `sv8582`.** **7 cases** are on `HOLD` solely for want of a second, lesser
   login — every permission case across all six reports. One shared sign-in cannot test access
   control, and impersonation was refused on purpose because a sibling worker shares the token.
4. **Six more product answers from Chris Ward** — the 6 cases in bucket A of `TESTER-SKIP-LIST.md`,
   including the tab-placement rule the specification states two different ways.
5. **A decision on `C30511`'s Inv. Hrs sentence.** It asserts a build limitation we could not
   re-test. Either it gets one live check, or it should come out of the expectation body (Rule 57 —
   a build limitation is not an expectation).
6. **Tell tomorrow's testers about the skip list.** `HOLD` graded as `Passed` turns *"nobody could
   check this"* into *"this was checked and it is fine"* — the most expensive wrong entry a release
   run can carry, and a sibling has already seen it happen.
