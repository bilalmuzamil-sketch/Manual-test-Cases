# TestRail execution log — quality gate, 2026-08-11

**Written AS each operation happened, not reconstructed afterwards.**

**Scope executed: `update_case` only. 0 `add_case` · 0 `delete_case` · 0 section ops · 0 run writes ·
0 results logged · 0 Jira calls of any kind. `custom_atmstatus` NOT sent on any payload.**

Harness: `/tmp/testrail/tr.py` `update_case_verified()` — snapshots the full case, writes, re-GETs,
compares **every** field against the intended payload, and proves every field the pass did not intend
to change byte-identical (Standing Rule 50). **On any mismatch it raises and the batch stops.**
Executor: `/tmp/qg/fix_c38914.py` (dry run first, then `--apply`).

---

## PRE-FLIGHT (read-only, before any write)

| Check | Result |
|---|---|
| Live suite read | 4,096 cases in project 1 / suite 1; **771 ours** across the three groups (Filters 115, Schedule 176, Report Suite 480) |
| Foreign cases identified and excluded | Filters **5** (Ahtasham Amjad, `created_by=7`) · Report Suite **12** (Vladimir Tomovic, `created_by=1`). Not read for verdicts, not written, not counted |
| Raw markup census, **all 771**, measured live **2026-08-12T02:06:27Z** | **0 of 771** |
| CRLF census, all 771 | **0 of 771** |
| Automation markers, all 771 | **exactly 1 per case, 771/771** |
| Provenance lines, all 771 | **exactly 1 per case, 771/771** |
| Titles over 80 characters, all 771 | **0** |
| Local case source vs live, by CONTENT | Filters 0 drifted · Schedule **12** drifted (corrected, local-only) · Report Suite 0 drifted |

---

## THE WRITE — 1 operation, 1 case

| # | Op | Case | Section | `custom_atmstatus` | Fields sent | HTTP | Byte-level verification |
|---|---|---|---|---|---|---|---|
| 1 | `update_case` | **C38914** [link](https://shopview.testrail.io/index.php?/cases/view/38914) | PV — Columns | **1 — not sent, unchanged** | `custom_preconds`, `custom_steps`, `custom_expected` | **200** | **30 fields compared, 3 intended, 0 mismatch, 0 collateral change** |

**All three text fields were sent explicitly**, because `update_case` re-renders any text field
omitted from the payload through its HTML pipeline (playbook §J). `custom_preconds` and
`custom_steps` were sent **byte-identical to their live values** and came back byte-identical.

**Fields proven byte-identical before → after:** `title`, `refs`, `custom_preconds`, `custom_steps`,
**`custom_atmstatus`**, `custom_automation_type`, `section_id`.
**The only field that moved is `custom_expected`.**

### What changed inside `custom_expected`, and what did not

**ADDED** — the Standing Rule 61 symptom + three-outcome block, inserted immediately before the
`---` that opens the provenance, which is where all 106 sibling EXPECT-FAIL cases carry it:

> What you should see today: the Location column is not the leftmost column. It sits sixth, after
> Vendor, in all three places - on screen and in both downloads. The values themselves are right,
> including "Multiple" on the merged Special Order row. This is a known problem and it is already
> reported - see https://shopview.atlassian.net/browse/SV-8938
> - If you see exactly that, mark this test FAILED and do not raise anything new.
> - If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it.
> - If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed.

**NOT CHANGED — proven by an assertion in the executor, not by inspection.** The script asserts
`new_expected.replace('\n' + BLOCK, '', 1) == old_expected`, i.e. **the edit is purely additive**;
if one other character had moved, the write would not have been attempted. So:

- **no expectation moved** — items 1–5 are byte-identical (Standing Rule 57: expectations come from
  the documents, and this pass had no build session);
- the existing tester note is byte-identical;
- **Rule-54 sentence 2 is preserved exactly** — `Last checked against build v3.5-16cf83f on
  8/6/2026.` — not re-dated, not removed, no new build fact asserted;
- the marker is unchanged and still the last line.

### Why this asserted no build fact we had not observed

The symptom is quoted from **our own recorded live observation on the same build the case already
names**, `build/report-suite/full-viu-2026-08-06/FINDINGS.md` line 65:

> C38914 | S7-R8 — leftmost, before Type, on screen and in both downloads | **Sixth** in all three
> places (values themselves are correct, incl. "Multiple") | SV-8938

Nothing was inferred and nothing was observed by this pass (Standing Rule 12).

---

## POST-WRITE VERIFICATION (read back live)

| Check | Result |
|---|---|
| Markers on the case | **1** |
| Provenance lines on the case | **1** |
| Symptom sentence present | **yes** |
| Outcome 3 ("If it PASSES") present | **yes** |
| Raw markup / CRLF introduced | **none** |
| Last non-empty line | `AUTOMATION: READY - EXPECT FAIL (SV-8938)` |
| Rule-54 sentence 2 intact | **yes**, byte-identical |

### Run 359 proven undisturbed — BY CONTENT, never by `updated_on`

Compared against tonight's post-sync snapshot
`build/run-sync-2026-08-11/SNAPSHOTS/run359-POST-*.json`:

| Check | Result |
|---|---|
| Tests | 480 → **480** |
| `case_id` sets | **equal in BOTH directions** |
| Result records | 535 → **535** |
| Every prior result present **by id** | **yes** |
| New results during the write window | **0** |
| Prior results with any graded field changed (`status_id`, `comment`, `defects`, `elapsed`, `version`, `created_by`, `created_on`, `test_id`) | **0** |
| `include_all` | still **false** |

Runs 352 and 357 were **not read for writes and not written** — no case in either was touched.

---

## LOCAL SOURCE

Re-synced **FROM LIVE** after the write (`tools/resync_local_from_live.py`), 1 case / 1 field.
Final content comparison across all three suites: **Filters 0 drifted · Schedule 0 · Report Suite 0.**
