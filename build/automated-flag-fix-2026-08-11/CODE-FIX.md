# The code fix — stop our own `add_case` tooling flagging cases as Automated

**Date:** 2026-08-11 · **Ruling:** QA lead, verbatim — *"Are you adding 'Automated' to the test cases
when you create them? there ar etest cases which are being given the AUTOMATED testrail marker, those
are fine, but if you are adding that marker that is wrong."*

---

## 1. The root cause, and it is structural rather than a typo

**There was no shared `add_case` helper anywhere in this repository.** Every TestRail push has been a
one-off script, and each one copied its payload from the previous one, which is how a single wrong
value propagated into **19 scripts across five projects** without anyone re-examining it.

The value it propagated:

```python
"custom_atmstatus": 3,          # 3 == "Automated"
```

**Re-read live today from `get_case_fields` on project 1** (raw response:
`evidence/case-field-atmstatus.json`) — not taken on trust from the earlier pass:

| Field | `is_required` | `default_value` | Items |
|---|---|---|---|
| **`custom_atmstatus`** (id 17, "Automation status") | **`true`** | **`"1"`** | `1` Not Automated · `2` Cannot be automated · **`3` Automated** · `4` Pending |
| `custom_automation_type` ("Automation Type") | `false` | `"0"` | `0` None · `1` Ranorex |

So `3` was **never required by anything** — the field is required *with a default of `1`*, and the
default TestRail itself would apply is **Not Automated**. Our tooling picked the one value that
asserts something untrue about every case we create.

**Why it matters, not just that it is wrong:** the flag is how Vladimir Tomovic records what he has
actually automated, and **Standing Rule 65 keys the entire tell-Vlad duty off this field**. A case born
`3` therefore does two kinds of damage at once — it tells him he automated something he never touched,
**and** it pollutes the very signal Rule 65 reads to decide what to report to him, so the noise grows
with every pass instead of staying put.

---

## 2. Files changed

| File | Status | What changed |
|---|---|---|
| **`build/testing-tools/testrail_add_case.py`** | **NEW** | The canonical Python `add_case` payload builder. `add_case_payload()` defaults `custom_atmstatus` to **`1`**, and **raises `ValueError` if any caller passes `3`**. Also carries `verify_created_case()` for the post-write check. |
| **`build/testing-tools/check_add_case_payloads.py`** | **NEW** | The guard. Scans the repo for `add_case` payloads that would send `3`, and separately **warns about post-write verifiers that treat `3` as the PASS condition**. Exit 0 = clean, exit 1 = new hazard. |
| **`build/testing-tools/testrail-api.mjs`** | **EDITED** (additive) | Gained the JS twin: `AUTOMATION_STATUS`, `DEFAULT_ATMSTATUS = 1`, `addCasePayload()` (throws on `3`), `addCase()`, `verifyCreatedCase()`. Nothing existing was altered — the file had **no** `add_case` support at all before, which is the gap that let every pass invent its own. |
| **`build/testing-tools/README.md`** | **EDITED** (additive) | Three new rows in the script table, plus a `custom_atmstatus` section stating the field facts and the "run the guard before any create-cases push" instruction. |
| **`CLAUDE.md`** | **EDITED** (additive, ~11 lines) | The `add_case` bullet under "Durable key facts → TestRail" now **points at the canonical helper and the guard**. See §4 — the instruction itself was already correct and needed no correction. |

**Nothing else was touched.** In particular, **no test case, no TestRail record and no Jira issue was
written by this pass at all** (see `testrail-execution-log.md`).

---

## 3. Proof the fix works — run both, both ways

**The Python helper produces a truthful payload and refuses `3`:**

```
$ python3 build/testing-tools/testrail_add_case.py
Canonical add_case payload (no title/refs/text supplied):
{
  "title": "<title>",
  "type_id": 1,
  "priority_id": 1,
  "template_id": 1,
  "custom_atmstatus": 1,
  "custom_automation_type": 0
}

Guard works — atmstatus=3 is refused:
  custom_atmstatus=3 ('Automated') is the automation engineer's flag to set, not ours
  (CLAUDE.md 'Durable key facts -> TestRail'; Standing Rules 38 and 65). A case we create
  has not been automated by anyone, so it is 1 ('Not Automated').
```

**The JS twin behaves identically:**

```
default payload: {"title":"x","type_id":1,"priority_id":1,"template_id":1,"custom_atmstatus":1,"custom_automation_type":0}
guard works: custom_atmstatus=3 ('Automated') is the automation engineer's flag to set, not o...
verify on a correct case:    {"ok":true,"problems":[]}
verify on a 3-flagged case:  {"ok":false,"problems":["custom_atmstatus is 3, expected 1"]}
```

**The repo guard passes clean —** 833 files scanned, `exit 0`:

```
PASS — 0 new add_case payloads send custom_atmstatus: 3 (833 file(s) scanned).
```

**…and it genuinely fails on a new hazard** (a throwaway file with the old payload, then deleted):

```
FAIL — 1 NEW add_case payload(s) would flag a case as Automated:
  build/automated-flag-fix-2026-08-11/tools/_guardtest.py:1  p = {"title":"x","custom_atmstatus": 3, ...}
exit=1
```

**A guard that only ever passes proves nothing**, which is why the negative test is recorded here
alongside the positive one.

---

## 4. One deviation from the brief, stated plainly

The brief said: *"Preferred: omit the field entirely so TestRail applies its own default of `1`."`*

**The helper sends `1` explicitly instead of omitting the field, and the reason is `is_required:
true`.** Omitting a required field on a create is **not proven safe**, and `add_case` was not exercised
to test it — this pass is `update_case`-only and creating a throwaway case to probe it is not
authorised (Rule 6), so asserting that omission works would be asserting something we did not observe
(Rule 12). Sending `1` explicitly **satisfies the required flag AND states the truth**, and it does not
depend on TestRail's default-application behaviour on a create.

It also **matches the authoritative line in `CLAUDE.md`**, which is the shared brain both parallel
sessions read, and which says in terms: *"the required value, if one must be sent, is `1`. Sending `1`
explicitly satisfies the required flag and states the truth, which is why it is the instruction rather
than omitting the field."*

**Both readings satisfy the actual requirement** — the flag must never say Automated on a case we
created — and the brief's other condition is met exactly: **`3` is not a default on any code path, and
a caller who wants a non-default status must pass it as an explicit argument.** Flagged here rather
than silently chosen; if the QA lead prefers omission, it is a one-line change plus one probe.

---

## 5. The 19 already-executed scripts — deliberately NOT rewritten, and why

Every script below hardcodes `3`, and **every one has already been run.** They were left
**byte-identical**:

- They are the **audit record of what was actually executed.** Editing one so it describes a payload
  that was never sent makes the record lie — the same class of harm as back-dating a decision into the
  deliberate-decisions register (Rule 46). Each sits beside an execution log asserting what it sent.
- **The preceding pass recorded this as a deliberate decision earlier today**
  (`build/automated-flag-and-c30041-2026-08-11/FIELD-FACTS.md` §4). Reversing another pass's recorded
  decision without the QA lead is the pattern Rule 53's corollary exists to prevent.
- **The QA lead's ruling is about NEW cases** — *"if you are adding that marker that is wrong"*. An
  executed script cannot add anything. Rewriting it changes nothing about a future case.

**The real danger they pose is that somebody COPIES one — and that is what the guard is for.** It
names all 19 loudly on every run under a `DO NOT COPY A PAYLOAD FROM THESE` banner, and it can tell
them apart from a genuinely new hazard.

| Script | Project |
|---|---|
| `build/filters/branko-answers-2026-07-31/exec_push.py` | Filters |
| `build/filters/design-2026-07-31/push/exec_push_design12.py` | Filters |
| `build/filters/tech-plan-2026-07-29/exec_sync_2026-07-30.py` | Filters |
| `build/report-suite/authenticity-2026-07-31/exec_push_closing_2026-07-31.py` | Report Suite |
| `build/report-suite/chris-answers-2026-07-31/exec_push_2026-07-31.py` | Report Suite |
| `build/report-suite/chris-answers-2026-08-01/exec_push_2026-08-03.mjs` | Report Suite |
| `build/report-suite/chris-newreqs-2026-08-05/tools/exec.py` | Report Suite |
| `build/report-suite/chris-update-2026-07-29/exec_chris_push_2026-07-29.py` | Report Suite |
| `build/report-suite/reconciliation-2026-07-28/exec_push_2026-07-28.py` | Report Suite |
| `build/report-suite/tech-plan-2026-07-29/exec_techplan_push_2026-07-30.py` | Report Suite |
| `build/report-suite/viu-push-2026-08-04/new_cases.py` | Report Suite |
| `build/schedule/coverage-rederivation-2026-07-31/exec_sync_coverage_2026-07-31.py` | Schedule |
| `build/schedule/exec_sync_2026-07-22.py` | Schedule |
| `build/schedule/exec_sync_epic_2026-07-27.py` | Schedule |
| `build/schedule/exec_sync_techplan_2026-07-30.py` | Schedule |
| `build/schedule/panel-collapse-2026-08-11/tools/push.py` | Schedule |
| `build/fees-discounts/exec_sync_2026-07-22.py` | Fees & Discounts |
| `build/simple-flow/sell-price-investigation-2026-07-29/exec_push_2026-07-29.py` | Simple Flow |
| `build/simple-flow/sv8183/exec_corrective_2026-07-24.py` | Simple Flow |

**⚠️ THE NASTIER HAZARD, AND IT IS NOT AN `add_case` PAYLOAD AT ALL: a post-write VERIFIER that
treats `3` as the PASS condition.** `build/report-suite/chris-newreqs-2026-08-05/tools/audit.py:45`
checks `('custom_atmstatus', 3)` as a **pass** condition, so it would call a **correctly-created case a
failure** — and a future pass, seeing its own check go red, would be pushed back towards `3` to make it
go green. Ten other executed scripts assert `== 3` in the same way. The guard reports these in a
separate **WARN** section, and `verify_created_case()` / `verifyCreatedCase()` are the correct
replacements.

---

## 6. Two things this pass did NOT establish, said plainly

1. **Whether `add_case` genuinely accepts a payload with no `custom_atmstatus` at all.** Not tested —
   `add_case` is not authorised here (Rule 6) and it was not observed, so it is not asserted (Rule 12).
   Operationally irrelevant: the instruction is to send `1`, which is correct either way.
2. **Whether the two completed projects carry born-Automated cases of their own.** **Fees & Discounts**
   and **Simple Flow** both hardcode `3` in their push scripts (table above), and both are **outside
   this pass's scope**, which is Filters and the Report Suite. **Not measured, not corrected — flagged
   rather than assumed clean.** Whether they are worth a sweep is the QA lead's call; the projects are
   closed, so the flag there misleads nobody who is currently automating.
