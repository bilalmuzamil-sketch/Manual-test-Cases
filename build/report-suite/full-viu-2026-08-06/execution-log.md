# TestRail execution log — the C30114 zeros-row repair, 2026-08-06

**Scope authorised:** `update_case` on **C30114** only. No other case, no `add_case`, no `delete_case`,
no section operation, **no run write, no result logged**. No Jira write of any kind.

**What this closes.** `build/report-suite/zeros-row-2026-08-06/testrail-execution-log.md` repaired
**C30173**, the *export* half of [SV-8991](https://shopview.atlassian.net/browse/SV-8991), and ended by
recording that **C30114**, the *screen* half, still carried the same false note and still read
`AUTOMATION: READY` — *"the single most important follow-up from this pass"*. That follow-up is now done.

---

## Source currency — read at task start AND re-read immediately before the write (Rules 31 + 59)

| Source | Identifier | Version / state | Read at | Verdict |
|---|---|---|---|---|
| Sales By Customer specification | Confluence page **577634305** | **Confluence version 15**, edited 2026-08-05T17:53:06.664Z, HTTP 200, **77 407 body chars** | **2026-08-06, re-fetched live immediately before the write** | **CURRENT — unmoved** |
| TestRail case | **C30114** | read live; `updated_on 1786008368` — **identical to the 13:13 snapshot**, so nothing had moved under us | 2026-08-06 | **CURRENT** |
| Owning story | **SV-8616** "SBC - Story 18 - Filter by customer" | not re-read; no Jira call was made or needed | — | carried |
| **The build** | `sv8582.qa.shopview.com` | **NOT OBSERVED.** The shared sign-in expired estate-wide at ~11:37Z. `quick-login` and `switch-user` were **deliberately not called** — both rotate a session a sibling worker shares | 2026-08-06 | **UNAVAILABLE** |

The version used is the **Confluence page version**, never the version printed inside the page body
(Rule 31 trap (a)). The body size came back **identical** to the figure recorded when SV-8991 was filed,
which is stronger than the version number alone.

---

## Rule 41 — the WHOLE case was re-verified, not only the field being changed

**Re-verified whole against the Sales By Customer specification, Confluence v15** (re-fetched live).
Fields checked: **title · preconditions · every step · every expected-result item · refs · section · type
· the provenance line · the build line · the marker.**

| Field | What it asserts | Live v15 source | Verdict |
|---|---|---|---|
| `title` (78 chars) | pinned control toggles; clearing shows empty state | S18-R3, S17-E1 | **accurate, ≤80** — left unchanged |
| `custom_preconds` | on the report with several customers in the current results | Story 18 Prerequisites | **OK** — byte-identical |
| `custom_steps` 1–3 | open filter and read the pinned control; activate "Clear all" and **read the table body, the totals row, and the collapsed label**; read and activate again | drives S18-R3 in both directions | **OK** — byte-identical. **Note: step 2 already told the tester to read the totals row.** The steps were never disarmed; only the expectation was — exactly the Rule-57 diagnostic |
| expected 1 | all-customers state → control reads "Clear all"; clears to an empty set | **S18-R3** verbatim | OK |
| expected 2 | not all-customers → reads "All customers"; puts it back | **S18-R3** verbatim | OK |
| expected 3 | pinned to the top in both states | **S18-R3** *"A control pinned to the top of the dropdown"* | OK |
| expected 4 | empty-state message + collapsed label | **S17-R1** message verbatim; **S18-R5** label; **S17-E1** empty state | **INCOMPLETE — the zeros totals row (S18-N1) was missing.** Restored |
| expected 4a | *"the written description does not say what the totals row should do"* | **nothing — the claim is false** | **REMOVED** |
| `refs` | pinned **`v13 2026-07-31`** | the provenance line said **version 15** | **self-contradiction — repinned to v15** |
| marker | `AUTOMATION: READY` | the build fails S18-N1 | **→ `READY - EXPECT FAIL (SV-8991)`** |
| provenance + build line | epic SV-8582, spec v15 (S18-R3, S18-N1, S17-E1); `v3.5-7168d14` on 8/6/2026 | correct as written | **NOT re-stamped** — nothing was re-observed (Rule 12) |

**The three cited anchors, quoted verbatim from the live v15 page:**

- **`S18-R3`** — *"A control pinned to the top of the dropdown selects or clears every customer at once.
  It reads "All customers" when the filter is not in the all-customers state (activating it puts the
  filter in the all-customers state, S18-R4) and "Clear all" when the filter is in the all-customers
  state (activating it clears the selection to an empty set)."*
- **`S18-N1`** — *"When no customer is selected (every customer cleared), the report shows the empty state
  (Story 17) and **the totals row shows zeros**."*
- **`S17-E1`** — *"… Clearing the Customer filter to no customers ("Clear all," S18-R3) also produces the
  empty state (S18-N1)."*

Also read, because item 4 quotes them: **`S17-R1`** — *"When no customers match, the table body shows the
message "No sales data found for the selected filters.""* — and **`S18-R5`** — *"The collapsed filter
label reads … **"None"** when the selection is an empty set …"*.

Extracted live text: `../zeros-row-2026-08-06/evidence/sbc-v15-live-recheck-2026-08-06.txt`.

**No further defect was found that this pass was not chartered to fix**, beyond the one precision point
recorded under "one deliberate minor correction" below.

---

## Every TestRail call this pass made

| # | Call | Target | HTTP | Verification |
|---|---|---|---|---|
| 1 | `get_case` | 30114 | 200 | pre-write snapshot, `../zeros-row-2026-08-06/snapshots/c30114-pre-write.json`. `updated_on` matched the 13:13 snapshot, proving nothing moved between authorisation and write |
| 2 | `get_run` · `get_tests` · `get_results_for_run` | run 359 | 200 | **read-only PRE snapshot BY ID**, `../zeros-row-2026-08-06/snapshots/run359-PRE.json` |
| 3 | **`update_case`** | **30114** | **200** | re-GET and byte-compared: **30 fields, 0 mismatches.** Per-field table `../zeros-row-2026-08-06/C30114-FIELD-COMPARE.json` |
| 4 | `get_case` | 30114 | 200 | post-write snapshot `c30114-post-write.json` |
| 5 | `get_case` | 30114 | 200 | **a second, independent read-back** through a separate script |
| 6 | `get_run` · `get_tests` · `get_results_for_run` | run 359 | 200 | read-only POST snapshot, compared to PRE **by result id** |
| 7 | `get_test` | 2019167 | 200 | traced the two echoed result records to their case |

**Exactly one write was made.** Nothing else in TestRail was called with a write verb at any point.

### The field comparison

**30 fields compared, 0 mismatches.** The four fields on the payload — `custom_preconds`, `custom_steps`,
`custom_expected`, `refs` — all read back **MATCH intended**. **Every one of the other 26 fields is
byte-identical** to the pre-write snapshot, including `title`, `section_id`, `type_id`, `priority_id`,
`custom_atmstatus`, `custom_automation_type` and `labels`. Only `updated_on` moved
(1786008368 → 1786023120); `updated_by` stayed **3**.

**All three text fields were sent explicitly**, though `custom_preconds` and `custom_steps` were not being
changed, because `update_case` **re-renders any text field omitted from the payload** — wrapping it in
`<p>` and turning `\n` into `\r\n` (the declared normalisation found on the 5 August Filters pass). This
project shows markup **literally** to the tester, so an omitted field is a visible defect. Both came back
byte-identical, confirming the defence worked.

`refs` was verified under TestRail's declared normalisation `','.join(p.strip() for p in s.split(','))`.
The value is **one comma-free entry of 65 characters**, well inside the 248-character per-entry limit that
returns HTTP 400 *"does not match the required pattern."* — and its internal anchor separators are
**semicolons, deliberately**, because a comma would split it into three entries.

### The payload's shape was checked BEFORE sending, not only byte-checked after

A byte-check proves we wrote what we *intended*, never that the intention was *right* — **C30341 was
damaged earlier today by a faithful write of a wrong payload.** Verified on the payload pre-flight:
exactly **1** provenance line · **1** build line · **1** `AUTOMATION:` marker · the marker is the last
content, with a blank line before and a line break after · the `---` separator present once · all three
Rule-61 outcomes present · SV-8991 named · the zeros assertion present · the false note absent · **no raw
markup** (`<p>`, `<ol>`, `<li>`, `<br>`) · no CR anywhere · `refs` normalises to itself · preconds and
steps byte-identical to live.

**Then read back live a second time** and re-confirmed all of it from the stored text: 1 marker, 1
provenance line, 1 build line, marker last, three outcomes present, zeros assertion present, false note
gone, 0 raw markup, 0 CRLF.

---

## What changed on C30114

**Title, preconditions and steps unchanged** — byte-identical to what was live.

### The false note is gone

It read:

> 4a. Note for the tester: the written description does not say what the totals row should do when
> nothing matches, so do not fail the test on the totals row either way. Write down what you see - a row
> of zeros, or no totals row at all - and carry on. The product owner has been asked to settle it.

**Every clause of that is wrong.** The description says exactly what the totals row must do — S18-N1,
quoted above — and it said so at v15, **published 2026-08-05T17:53Z, before the session that wrote the
note ran**. *"The product owner has been asked to settle it"* was also untrue: the question was
deliberately kept off the 2026-08-06 sheet for Chris Ward precisely because its premise was false, and
Rule 7 forbids putting a defect in front of a product owner. The note sat **directly above a provenance
line citing S18-N1** — the very requirement it denied.

Its practical effect was that the case **could not fail**, which is the failure Rule 57 exists to prevent.

### The documented assertion is restored, and the build is NOT described (Rule 57)

Before:

> 4. After "Clear all": the report shows the empty-state message "No sales data found for the selected
> filters." and the collapsed label reads "None."

After:

> 4. After "Clear all": the report shows the empty-state message "No sales data found for the selected
> filters." The collapsed label reads "None", and the totals row shows zeros.

### The Rule-61 symptom block, placed before the provenance line

> What you should see today: everything in item 4 happens except the totals row - the empty-state message
> appears and the collapsed label reads "None", but there is no totals row on the report at all, of zeros
> or otherwise. This is a known problem and it is already reported - see
> https://shopview.atlassian.net/browse/SV-8991.
> - If you see exactly that, mark this test FAILED and do not raise anything new.
> - If it fails in a DIFFERENT way from what is described above - for example a totals row appears but the
> figures are not zeros, or the empty-state message or the "None" label is wrong, or the pinned control in
> items 1 to 3 does not behave as described - that is a NEW problem, so please report it.
> - If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed.

**The symptom is deliberately narrower than C30173's**, because this case asserts **four** things and only
the totals row fails. The evidence supports that precision: `full-viu-2026-08-06/evidence/2026-08-06-session2/sbc9.json`
records `afterClear = {"label":"None","body":" | ","totals":null,"n":0}`, so the label **passes** and only
the totals row is absent. Outcome (2) therefore names the other three assertions explicitly, so a tester
who sees the pinned control misbehave reports it instead of filing it under SV-8991.

**Marker: `AUTOMATION: READY` → `AUTOMATION: READY - EXPECT FAIL (SV-8991)`.** `READY` was wrong twice
over — it asserted the case was fit to automate as written, when as written it asserted less than the
requirement and could not fail.

**`refs`: `SV-8616 (SBC spec v13 2026-07-31 Story 18 S18-R3; S18-N1; S17-E1)` →
`SV-8616 (SBC spec v15 2026-08-05 Story 18 S18-R3; S18-N1; S17-E1)`.** Done under Rules 41 and 42, and for
the same reason as on C30173: the case's own provenance line already said **version 15** while its `refs`
pinned **v13**, so it contradicted itself about which document it answers to — and a version pin two
releases stale disables the exact mechanism Rule 42 exists to make work. The ticket key and all three
requirement anchors are unchanged.

**Provenance line and build line unchanged, deliberately.** They already read *"…specification version 15
(S18-R3, S18-N1, S17-E1). Last checked against build v3.5-7168d14 on 8/6/2026."* Nothing was re-observed
today — the branch is unreachable — so re-stamping the build sentence would have claimed an observation we
did not make (Rule 12).

### One deliberate minor correction, recorded rather than slipped in

Item 4 previously read `the collapsed label reads "None."` — with the full stop **inside** the quotation
marks, which leaves a tester unable to tell whether the label itself ends in a dot. **S18-R5** gives the
label as **`"None"`**, so the sentence was re-punctuated to put the label in quotes and the stop outside.
**Nothing asserted changed**; it is a Rule-9 exactness point on a line that was being rewritten anyway,
and it is logged here rather than left for someone to find as an unexplained diff.

---

## Run 359 — proven untouched BY CONTENT, not by counts

Run **359** "Reports Suite - Nebojsa/Viktoria (VIU Pending)" belongs to **Nebojsa and Viktoria**. The only
write this pass made was `update_case/30114`; no run or result endpoint was called with a write verb.

A **PRE snapshot was taken by id before the write** — which the C30173 pass could not do, and honestly
recorded that it could not — so this is a genuine by-id comparison rather than a count match:

| Check | PRE | POST | Verdict |
|---|---|---|---|
| `include_all` | false | false | unchanged |
| tests | 476 | 476 | unchanged |
| test_id sets | — | — | **equal in BOTH directions** (0 missing, 0 new) |
| case_id sets | — | — | **equal in BOTH directions** (0 missing, 0 new) |
| result records | 535 | 535 | **all 535 present BY ID** — 0 missing, 0 new |
| counters | 6 P / 0 F / 0 B / 470 U / 0 R | identical | unchanged |
| **graded fields changed** | — | — | **0** across all 535 (`status_id`, `comment`, `defects`, `elapsed`, `version`, `created_by`, `created_on`, `test_id`) |

**Two result records moved one field each, and both are the declared read-time echo.** Results **372331**
and **371301** show `case_refs` changing from the v13 string to the v15 string. Both were traced by
`get_test`: both hang off **test 2019167**, whose `case_id` is **30114** — the only case whose `refs` this
pass edited. `case_refs` is a **derived display copy** TestRail renders at read time, the same class as the
`case_title` echo, and both are already recorded in `build/APP-ACTIONS-PLAYBOOK.md` §J. **This is the third
independent corroboration of that normalisation** and it is stated as an expected transformation, not
waved through as close enough.

Full snapshots: `../zeros-row-2026-08-06/snapshots/run359-PRE.json` and `run359-POST.json`.

---

## What was deliberately NOT done

- **No second case was written.** C30114 was the whole authorisation.
- **No `add_case`, `delete_case`, section operation, run write or result.** `delete_case` is irreversible
  and nothing earned it.
- **No Jira call at all** — SV-8991 was already correct, so it was not even read.
- **No `quick-login` / `switch-user`** — both rotate a session a sibling worker shares.
- **The build line was not re-stamped** and **no verdict was re-observed.**
- **`CLAUDE.md` was not touched**, nor `build/ticket-reformat-2026-08-06/**`, nor `build/schedule/**` —
  other workers are live in all three.

## Honest limits

1. **The failure was not re-observed today.** C30114's DEVIATION rests on the 2026-08-06 session-2
   observation on **`v3.5-7168d14`**, and the branch has since redeployed to **`v3.5-f77875c`** and is now
   unreachable. So it is possible the fix has already shipped — which is precisely what the Rule-61
   outcome (3) line exists to catch at no cost, and why the marker is `EXPECT FAIL` rather than a claim
   about today's build.
2. **The verdict is PROVISIONAL.** The branch is not declared final (Rule 49), and engineering have said
   it will not be before release.
3. **The `sbc7.json` ambiguity is still unresolved and is asserted nowhere.** That capture shows an empty
   table body with a **fully populated, non-zero** totals row, which cannot be the same state as
   `sbc9.json`'s `totals: null`. If they are two different empty states — an empty **date range** versus an
   empty **customer selection** — a stale non-zero totals row would be a **second, separate defect**. The
   harness that produced it is not in the repository and the branch is unreachable, so it stays a question
   for the next live pass. **C30114's repair does not depend on it**: it rests on `sbc9.json`, whose
   `label: "None"` is the S18-R5 label for an empty selection and therefore unambiguously S18-N1's
   scenario.

---

## Found during the Rule-41 whole-case re-read, REPORTED NOT FIXED

Rule 41 requires that a further problem found while a case is open is **recorded**, not silently left. Two
were, and neither is this pass's charter.

### 1 · The `testrail-id-map.csv` refs column is stale across the suite — **78 rows**, not one

`build/report-suite/testrail-id-map.csv` still pins **`v13 2026-07-31`** on **78 of its 477 rows**,
including **both** SV-8991 cases:

| Row | id-map refs | Live refs after today's repairs |
|---|---|---|
| `SBC-CUST-03,C30114` | `SV-8616 (SBC spec v13 2026-07-31 Story 18 S18-R3; S18-N1; S17-E1)` | `… v15 2026-08-05 …` |
| `SBC-EXP-15,C30173` | `SV-8616 (SBC spec v13 2026-07-31 Story 18 S18-R10)` | `… v15 2026-08-05 …` |

**Deliberately NOT patched, and this is the reasoning rather than an omission.** Rule 20 does require the
combined `refs` to be mirrored into the id-map, so the temptation was to fix C30114's single cell. But the
staleness is **uniform** — C30173 was repinned live hours earlier and its id-map row is still v13 — so
editing only C30114's cell would leave the two halves of one defect pinned to different spec versions in the
same file and **invent a distinction that does not exist**. A partial mirror is harder to trust than a
wholly stale one, because it looks deliberate.

**What it needs:** one authorised whole-suite re-sync of the id-map's `refs` column **from live**, which is
also when the generator's known gotchas must be handled — it **blanks the C-id column and drops `refs`
entirely on every rerun**, so both are re-merged from live afterwards. That is a deliverables pass, not a
case repair. **Raise it with the QA lead.**

### 2 · The local case source predates the disarming — and independently corroborates that the assertion was right

`build/report-suite/cases/cases-sbc-A-access-filters.json` → `SBC-CUST-03` **still carries the zeros
assertion** in item 4: *"…the totals row shows zeros, and the collapsed label reads "None.""*. Its mirror
was taken **before** the session that removed it from live, so **our own authored source never agreed with
the false note.** That is a third independent line of evidence, alongside Confluence v15 and the v15
publication timestamp, that the assertion was correctly sourced from the start and was talked out of
existence later.

The same local record is stale in the ordinary ways — build stamp `v3.4.1-3d03023 on 8/4/2026`,
`AUTOMATION: READY`, no Rule-61 block, `spec_ref` at v13, `viu_status: VIU-Pending`.

**Deliberately NOT patched**, for the same reason as the id-map: re-syncing local source **from live** is a
whole-suite operation that a deliverables pass owns, and hand-editing one case into a mirror that is stale
everywhere else would make the divergence harder to detect, not easier.
