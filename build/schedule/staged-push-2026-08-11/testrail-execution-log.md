# Schedule — TestRail execution log — 2026-08-11 (the authorised staged push)

**Authorisation:** the QA lead, verbatim — *"do not hold creating the test cases in Testrail"*.
**The Jira creation hold of 2026-08-10 is LIVE and was honoured: ZERO Jira calls that create
anything.** Two Jira/Confluence reads were made, both `GET`.

| | |
|---|---|
| **Ops executed** | **10** — 8 × `update_case` + 2 × `add_case` |
| **HTTP** | **10 × 200. 0 failures, 0 retries.** |
| **Byte-verification (Rule 50)** | **10 of 10 PASS. 30 fields compared per op, 0 mismatches, 0 collateral changes.** |
| **`delete_case`** | **0** |
| **Section writes** | **0** |
| **Run writes** | **0** — run 357 proven untouched by content, see below |
| **Result writes** | **0** |
| **Jira writes** | **0** |

---

## Sources — read at pass start AND re-read at write start (Standing Rule 59)

| Read | UTC | What was read | Verdict |
|---|---|---|---|
| **Pass start** | **2026-08-11 13:42:xxZ** | Confluence page **713031682**, `?expand=version,body.storage` → **HTTP 200**, version **27**, `version.when` 2026-08-07T15:01:20.801Z (Branko Cicovic), **43,064 chars**, sha256 `4c51fb7239c84987b4bed33481448c1099911d4bb2a976ca9c7426c833485d4b` | **CURRENT** |
| **Write start** | **2026-08-11 13:49:28Z** | the same, re-fetched | **UNCHANGED — version 27, body sha256 IDENTICAL.** Safe to write. |
| **Write end** | **2026-08-11 13:50:51Z** | the same, re-fetched | **UNCHANGED — version 27, body sha256 IDENTICAL.** Nothing moved under the batch. |

**The currency claim rests on the BODY CHECKSUM, not the version number.** The page's own in-body
header table still reads `Version | 1.0` / `Last Updated | July 15, 2026`, which is Rule 31's
trap (a) — it has read that since version 1 while the page is at Confluence 27. The sha256 is what
carries the claim, and it is byte-identical to the committed mirror
`build/schedule/coverage-gaps-2026-08-11/evidence/spec-v27-live-2026-08-11.xml`.

**Story [SV-8700](https://shopview.atlassian.net/browse/SV-8700) read live 2026-08-11** (Story,
parent SV-8685, status TESTING QA, updated 2026-08-10T07:12:37-0500) — this is the read that gates
Group 4 and it is quoted verbatim in that section.

**The build was NOT observed.** `quick-login` and `switch-user` were **not called** (they rotate the
shared session and two siblings are live on this estate), so **no case gained a build stamp and no
behaviour is claimed anywhere in this pass** (Rule 12).

---

## Pre-write state, and the untouched-proof baseline

* **174 live Schedule cases** under group **4254** (31 sections, walked down the `parent_id` tree
  from a **paged** `get_sections` — 626 sections exist, and an unpaged call returns 250 and silently
  finds nothing).
* **`created_by` = 3 (us) on 174 of 174 — ZERO foreign cases in this group** (Rule 38 has nothing
  to bite on here).
* **`custom_atmstatus` = 1 on 174 of 174.**
* **Raw-markup census BEFORE any write: 0 of 174** (playbook DECLARED HAZARD #5 — the deferred
  HTML render that moves case text hours later without moving `updated_on`).
* **Invariant census before: 174 of 174 carry exactly one Rule-54 provenance line and exactly one
  `AUTOMATION:` marker.**
* Whole-suite snapshot committed at `evidence/PRE-schedule-cases.json`; each target additionally
  snapshotted individually at `evidence/PRE-C<id>.json`.

**`custom_atmstatus` captured AT WRITE TIME (Rule 65), not from any document:**
`C43582=1 · C43583=1 · C43584=1 · C43585=1 · C43586=1 · C43587=1 · C29998=1 · C38866=1`.

---

## GROUP 1 — six Panel collapse cases: our own text was confusing the tester

All six carried, verbatim, *"…so on that build **steps 1 to 8** cannot be carried out and this test
FAILS."* The sentence was copied from C43582, **which has eight EXPECTED RESULTS and seven steps** —
so it was wrong on all six, not five.

**The step counts were re-counted from each case's own LIVE `custom_steps`, by counting leading
`N.` markers, and never taken from the brief or the manifest.** The executor refuses to write if the
literal is absent or appears more than once, and skips any case whose real count is genuinely 8.

| # | Op | Case | Live step count | Sentence now reads | HTTP | Byte-verification | Rule 41 |
|---|---|---|---|---|---|---|---|
| 1 | `update_case` | **[C43582](https://shopview.testrail.io/index.php?/cases/view/43582)** | **7** | steps 1 to 7 | **200** | 30 fields compared, 3 intended, **0 mismatch** | re-verified whole against Confluence spec v27, read 2026-08-11 |
| 2 | `update_case` | **[C43583](https://shopview.testrail.io/index.php?/cases/view/43583)** | **6** | steps 1 to 6 | **200** | 30 fields compared, 3 intended, **0 mismatch** | re-verified whole against Confluence spec v27, read 2026-08-11 |
| 3 | `update_case` | **[C43584](https://shopview.testrail.io/index.php?/cases/view/43584)** | **7** | steps 1 to 7 | **200** | 30 fields compared, 3 intended, **0 mismatch** | re-verified whole against Confluence spec v27, read 2026-08-11 |
| 4 | `update_case` | **[C43585](https://shopview.testrail.io/index.php?/cases/view/43585)** | **4** | steps 1 to 4 | **200** | 30 fields compared, 3 intended, **0 mismatch** | re-verified whole against Confluence spec v27, read 2026-08-11 |
| 5 | `update_case` | **[C43586](https://shopview.testrail.io/index.php?/cases/view/43586)** | **5** | steps 1 to 5 | **200** | 30 fields compared, 3 intended, **0 mismatch** | re-verified whole against Confluence spec v27, read 2026-08-11 |
| 6 | `update_case` | **[C43587](https://shopview.testrail.io/index.php?/cases/view/43587)** | **7** | steps 1 to 7 | **200** | 30 fields compared, 3 intended, **0 mismatch** | re-verified whole against Confluence spec v27, read 2026-08-11 |

**Every payload carried all three text fields** (`custom_preconds`, `custom_steps`,
`custom_expected`) with the two unchanged ones set to their exact pre-write snapshot value —
DECLARED NORMALISATION #3 re-renders any omitted text field into `<p>`-wrapped CRLF, and this
project shows markup literally to the manual tester. **Field lengths are unchanged on all six**
(1561 · 1278 · 1393 · 1186 · 1119 · 1743 before and after), because a single digit was replaced.

**Rule 41, what the whole-case re-read found:** §5.3 of spec v27 was read verbatim against all six.
The control, tooltip wording (*"Hide panel"* / *"Show panel"*), the no-seam reflow, the five
preserved panel states, the 960px breakpoint behaviour, the popover fallback and the
session-scoped persistence all match the cases as written. **Nothing further needed changing, and
the positive line is recorded here as the evidence that they were looked at.** One scope
observation that is NOT a defect is in `FINDINGS.md`.

---

## GROUP 3 — [C29998](https://shopview.testrail.io/index.php?/cases/view/29998) (SCH-LANE-03)

**Requirement, Confluence v27 §11, verbatim:** *"Overtime and conflict signals are not color-only
(OT uses a text tag; **the overflow uses shape**)."*
**What the case asserted:** that the overflow **exists** (item 2) and **opens** (item 3). Nothing
asserted it is conveyed by **shape**, so a build signalling it by colour alone would have passed
every case in the suite. The requirement has been in the spec **since version 1, 2026-07-15**.

| Field | Change |
|---|---|
| `title` | unchanged |
| `custom_preconds` | unchanged (sent explicitly) |
| `custom_steps` | unchanged (sent explicitly) |
| `custom_expected` | **new item 4 inserted**; the old item 4 renumbered to **5**; items 1–3 untouched; **and the provenance anchor extended to name §11** |
| `refs` | `SV-8693 (§4.7)` → `SV-8693 (§4.7 lane cap and overflow + §11 the overflow uses shape - spec v27 2026-08-07)` — comma-free, **88 chars** |

**Op 7 · `update_case` C29998 · HTTP 200 · 30 fields compared, 4 intended, 0 mismatch.**
`refs` verified under the ONE declared normalisation (comma split → trim → rejoin).

**The provenance extension is a deliberate departure from the staged manifest and is the honest
call:** the manifest said the provenance block was unchanged, but the new item is sourced from
**§11**, not §4.7. Leaving §11 unnamed would have made the case assert something no source it cites
supports — the exact Rule-54 defect that `COVERAGE-REDERIVATION.md` §8 reports on five other cases.
**Sentence 2 was kept VERBATIM** (*"Last checked against build v3.5-7ec992f on 8/6/2026."*) and is
still true of the case as a whole; the new item has never been checked against any build, which is
recorded in `FINDINGS.md` rather than written into tester-facing text.

**Rule 41:** re-verified whole against Confluence spec v27 §4.7, read 2026-08-11 — *"Visible lanes
are capped at 3"* and *"Additional overlapping shifts collapse into a '+N more' affordance that
opens a popover listing the hidden shifts"* both match items 1–3 as written.

---

## GROUP 4 — [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) (SCH-EDGE-08), `refs` only

**This op was gated on proving the anchor before writing, and the proof was obtained.**

**[SV-8700](https://shopview.atlassian.net/browse/SV-8700) requirement 5, read LIVE 2026-08-11,
verbatim:**

> *"5. Dark theme: built on design-system color tokens. Surfaces, borders, text, accents, and
> elevation/shadow tokens remap automatically. **User-selectable from user menu, persisted per
> user.** — ([PRD: §11](https://shopview.atlassian.net/wiki/spaces/shopviewapp/pages/713031682/Schedule#11.-Non-functional-requirements))"*

**The story text supports the anchor, and cites §11 itself**, so SV-8700 is the owning story and
Rule 20's per-story precision is satisfiable. **The write proceeded.**

**Three defects in the old value, all fixed by one write:**

1. **It cited the EPIC** where a story states the requirement almost verbatim. Rule 20 reserves the
   epic for a genuinely cross-cutting case with no single-story owner; this one has an owner.
2. **It claimed an assertion the case's steps never make** — *"persisted per user"*, while the four
   steps never sign out. The case asserted **less** than its own reference said it did. That
   coverage now lives on the new **C43588**.
3. **It contained a COMMA**, so TestRail stored it as **two** references, the second being the
   fragment `persisted per user))`.

| | |
|---|---|
| **Before** | `SV-8685 (§11 (Dark theme - user-selectable Light / Dark,persisted per user))` |
| **After** | `SV-8700 (§11 Dark theme - the Schedule and its dialogs render readably in dark mode and revert on switching back) and SV-8698 (§11 accessibility - overtime and conflict cues are not colour-only) - spec v27 2026-08-07` |
| **Length** | **216 chars, one comma-free entry, ≤ 248** (measured, not estimated; 249 would fail with HTTP 400 *"Field :refs does not match the required pattern."*) |

**SV-8698 is named because the case's third assertion is genuinely a §11 *accessibility* assertion,
not a dark-theme one**, and the suite already credits SV-8698 with *"not color-only"* on
[C30032](https://shopview.testrail.io/index.php?/cases/view/30032). Describing only the dark-theme
half would have reproduced defect 2 in a new form.

**Op 8 · `update_case` C38866 · HTTP 200 · 30 fields compared, 4 intended, 0 mismatch.**
**No assertion was changed** — all three text fields were sent at their exact pre-write values, as
instructed. The case's own Rule-54 provenance line still names the epic rather than SV-8700; that is
**owed, not done**, and is in `FINDINGS.md`.

---

## GROUP 2 — two new cases

**Internal IDs checked THREE ways before either was created**, because a sibling project once reused
a retired id and its resync **overwrote the retired record**:

| Internal id | (1) among all 201 local case bodies | (2) on the 27-case retired-ID list | (3) in `testrail-id-map.csv` |
|---|---|---|---|
| **SCH-EDGE-09** | absent — OK | absent — OK | absent — OK |
| **SCH-EDGE-10** | absent — OK | absent — OK | absent — OK |

**The family in use is SCH-EDGE-01…08, and SCH-EDGE-01 IS retired** (CUT 2026-07-31, duplicate of
SCH-SPREAD-10). **09 and 10 are the first free ids and are not reused.** The 27 retired ids remain
**never-reuse**.

| # | Op | Internal id | New C-id | Section | HTTP | Verification |
|---|---|---|---|---|---|---|
| 9 | `add_case` | **SCH-EDGE-09** | **[C43588](https://shopview.testrail.io/index.php?/cases/view/43588)** | **4280** Edge Cases and Responsiveness | **200** | re-GET, 30 fields compared, 10 intended, **0 mismatch**; `custom_atmstatus`=**1**; `created_by`=3 |
| 10 | `add_case` | **SCH-EDGE-10** | **[C43589](https://shopview.testrail.io/index.php?/cases/view/43589)** | **4280** Edge Cases and Responsiveness | **200** | re-GET, 30 fields compared, 10 intended, **0 mismatch**; `custom_atmstatus`=**1**; `created_by`=3 |

**`custom_atmstatus` = 1 ("Not Automated") on both, read back live.** The payload was built by the
canonical helper `build/testing-tools/testrail_add_case.py`, which defaults to `1` and **raises** on
`3`; the assertion `payload["custom_atmstatus"] == 1` is in the executor as well. **No payload was
copied from any of the 19 older executed scripts** — those still carry `3` on purpose, as the audit
record of what was actually run.

**GUARD RESULT — `build/testing-tools/check_add_case_payloads.py` exited 0**, run before the push:
*"PASS — 0 new add_case payloads send custom_atmstatus: 3 (852 file(s) scanned)"*, with the 21
known-executed hits listed separately as history and 3 pre-existing verifier warnings reported (see
`FINDINGS.md`).

**Metadata:** `type_id` **2** (Accessibility) and `priority_id` **1** (Low) — byte-identical to
C38866, the sibling dark-theme case in the same section whose requirement these two split off from.
Both read live from `get_case_types` / `get_priorities`, not assumed. `template_id` **1** (Text),
matching all 174. Titles **64** and **60** characters, under the 80 bar. **Zero angle brackets** in
any field (TestRail eats `<placeholders>` as HTML).

**`refs`** — `SV-8700 (§11 Dark theme - chosen from user menu and persisted per user - spec v27
2026-08-07)` (**93 chars**) and `SV-8700 (§11 Dark theme - elevation and shadow swap so depth reads
correctly - spec v27 2026-08-07)` (**99 chars**); both comma-free, both measured.

**Rule-54 provenance, sentence 1 only, one read-date PER CITED SOURCE:**
*"This is the expected behaviour as per epic SV-8685, read on 11 August 2026, its story SV-8700
(requirement 5), read on 11 August 2026, and the Schedule specification version 27 (§11 Dark
theme), read on 11 August 2026."*
**No sentence 2** — no build was observed, so a build date would be a fabricated observation.
**`AUTOMATION: READY` is last, after a blank line.** No `READY - EXPECT FAIL`: no live source backs
one, and Rule 61 as amended today is explicit — no backing, no marker.

---

## POST-BATCH VERIFICATION

**A byte-check proves FIDELITY, not CORRECTNESS (the C30341 lesson), so the batch is followed by an
invariant census, not just a per-op compare.**

| Check | Result |
|---|---|
| Live Schedule cases | **174 → 176** |
| **Untouched cases proven byte-identical** — every field, `updated_on` and `updated_by` **included** | **166 of 166. 0 moved.** |
| Touched/created cases carrying **exactly one** Rule-54 provenance line | **10 of 10** |
| Touched/created cases carrying **exactly one** `AUTOMATION:` marker, last | **10 of 10** |
| Raw markup on the touched/created cases | **0 of 10** |
| **Whole-suite raw-markup census after the batch** | **0 of 176** |

**The untouched-proof is BY CONTENT, never by timestamp** — 14 Report Suite cases once had all
three text fields change while `updated_on` stayed frozen, so a timestamp is context and content is
evidence.

### Run 357 — PROVEN UNTOUCHED (no write was made to it)

| | Before | After |
|---|---|---|
| `include_all` | **false** | **false** |
| Tests | **174** | **174** |
| Result records | **458** | **458** |
| Counters | 25 Passed / 0 Failed / 1 Blocked / 148 Untested | **identical** |

* `case_id` sets **equal in BOTH directions**; `test_id` sets **equal in BOTH directions**.
* **Every one of the 458 prior results present BY ID** — not by count. **0 missing. 0 new results
  during the write window.**
* **0 changes across all 458 on every graded field** (`status_id`, `comment`, `defects`, `elapsed`,
  `version`, `assignedto_id`, `created_by`, `created_on`, `test_id`, `id`).
* **The only movement is `case_refs` on 3 records, and all 3 trace to C29998** — the one case in the
  run whose `refs` we edited. That is the **declared read-time echo** (playbook DECLARED
  NORMALISATIONS #2b / #2c), not a run write. Asserted explicitly as the expected transformation
  rather than waved through.

Snapshots: `evidence/RUN357-{PRE,POST}-ids.json`, `evidence/RUN357-run-{PRE,POST}.json`.

---

## AUTOMATED CASES CHANGED — FOR VLAD (Standing Rule 65)

### **None.**

**`custom_atmstatus` was captured AT WRITE TIME on all eight edited cases and read back on both
created cases: all ten are `1` ("Not Automated").** Not one case this pass touched is flagged
Automated in TestRail, so there is nothing for the automation engineer to adjust either way.

The value was captured at write time and not taken from any document, because **the flag moves both
ways** — C29600 on another project went `1 → 3 → 1 → 3`. The whole Schedule suite reads `1` after
the 2026-08-11 correction pass that fixed 31 cases our own `add_case` tooling had wrongly born as
`3`. **The section is written even though the answer is "none", because omitting it costs the reader
the ability to tell "clear" from "we forgot to look".**

---

## Deliverables regenerated, and the four counts

Local case source **re-synced FROM LIVE before regenerating** — 10 files rewritten, **174 `expected`
fields**, 1 `title`, 1 `steps` and 3 `refs` brought into line (the read-date sweep and the
C30041 latest-wins pass had both written live without syncing local).

| Count | Value |
|---|---|
| **Live TestRail, group 4254** | **176** |
| **Local active** (203 bodies − 27 retired) | **176** |
| **`testrail-id-map.csv` rows** | **176** |
| **Import data rows** | **176** |

**All four equal, and set-equal in BOTH directions** (live == local, live == id-map, no member on
either side without a counterpart).

* id-map: the generator blanked **all 176** C-ids as it always does — **re-merged from live, 0
  blanks**, `refs` **176/176**, header unchanged, **titles and refs byte-equal to live 176/176 both
  ways**.
* **Shredding guard: 0 of 176 rows** carry the newline-between-every-character signature, confirmed
  a **second, independent way** (mean line length in every text column).
* Import header sha256 `a82ca60c36074512` — **identical to all five peer imports**.
* 0 internal `SCH-` ids leaked, 0 C-ids leaked, 0 occurrences of "viu", 0 angle brackets, 0
  duplicate titles, 0 duplicate internal ids, 0 rows missing preconditions/steps/expected.

---

## Tooling

| File | What it is |
|---|---|
| `tools/payloads.py` | the exact intended bodies and the text-surgery literals, reviewable on its own; no TestRail call in it |
| `tools/exec_push.py` | the executor: source re-read, snapshot, 10 ops, per-op byte-verification, post-batch census |
| `/tmp/testrail/tr.py` | the shared harness — `update_case_verified` raises on any mismatch, so a failed byte-check **stops the batch** rather than logging a 200 |
| `evidence/exec-console.log` | the run's own output, verbatim |
