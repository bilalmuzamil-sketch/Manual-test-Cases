# What `custom_atmstatus` really is — read from TestRail, not assumed

**Date:** 2026-08-11 · **Source:** `get_case_fields` on project 1, read live today.
**Raw response kept at** `evidence/case-field-atmstatus.json`.

---

## 1. The field definition, verbatim

| Property | Value |
|---|---|
| `system_name` | **`custom_atmstatus`** |
| `id` | 17 |
| `label` | **Automation status** |
| `type_id` | 6 (dropdown) |
| **`is_required`** | **`true`** (for project 1) |
| **`default_value`** | **`"1"`** |
| `items` | `1, Not Automated` · `2, Cannot be automated` · **`3, Automated`** · `4, Pending` |

And the sibling field, because our note bundled the two together:

| Property | `custom_automation_type` |
|---|---|
| `is_required` | **`false`** |
| `default_value` | `"0"` |
| `items` | `0, None` · `1, Ranorex` |

---

## 2. So what did our long-standing note get wrong?

`CLAUDE.md` said, under "Durable key facts → TestRail":

> *"`add_case` REQUIRES `custom_atmstatus:3` + `custom_automation_type:0`."*

**It is wrong on both halves, and the way it is wrong is worse than simply being wrong.**

**(a) The `3` was never required by anything.** The field is marked required, but its **default value
is `1`**. "Required with a default" means the value must exist, not that it must be `3` — and the
default TestRail itself would have applied is **Not Automated**. **Our note picked the one value that
asserts something untrue about every case we create.**

**(b) `custom_automation_type` is not required at all** — `is_required: false`. It happens to be
harmless (`0` = None is also its default), but the note stated a requirement that does not exist.

**(c) The note reads like a technical constraint, so nobody questioned it.** Phrased as *"`add_case`
REQUIRES…"*, it looks like something TestRail imposes on us. It was in fact a value we chose once and
then propagated. **Every `add_case` script in this workspace copied it** — which is why the error is
not one case, it is every case we have ever created by API on a project whose script copied that line.

**The honest correction is therefore `1`, not "omit it".** Sending `1` explicitly satisfies the
required flag *and* states the truth, and it does not depend on TestRail's default behaviour on a
create — which we did not test, because `add_case` is not authorised in this pass.

---

## 3. Why `3` is not ours to set

QA lead, 2026-08-11, verbatim:

> *"Are you adding 'Automated' to the test cases when you create them? there ar etest cases which are
> being given the AUTOMATED testrail marker, those are fine, but if you are adding that marker that is
> wrong."*

The flag is **how Vladimir Tomovic records what he has actually automated**. **Standing Rule 65 keys
the entire tell-Vlad duty off this field** — a pass reports the Automated cases it touched so he can
adjust his scripts. A case born `3` therefore does two kinds of damage at once:

1. it **tells him he automated something he never touched**; and
2. it **pollutes the very signal Rule 65 uses to decide what to report to him** — so the noise grows
   with every pass rather than staying put.

**It is not our field to write a `3` into. `1` is a statement of fact; `3` is a claim about somebody
else's work.**

---

## 4. The tooling — what was fixed and what was deliberately left alone

**FIXED AT SOURCE:** the `CLAUDE.md` line above now instructs **`custom_atmstatus:1`**, with the
superseded wording kept visible and dated. That line is the root cause: it is what every script copied
from, so correcting it is the only fix that reaches future passes.

**DELIBERATELY NOT REWRITTEN — the executed `add_case` scripts.** Every script below still contains
`custom_atmstatus: 3`, and each one **has already been run**. They are the **audit record of what was
actually executed**, and editing them would make that record describe a write that never happened —
the same class of harm as back-dating a decision into the deliberate-decisions register (Rule 46).
**They are listed here instead, so the list lives somewhere a future pass will read:**

| Script | Project |
|---|---|
| `build/schedule/panel-collapse-2026-08-11/tools/push.py` | Schedule |
| `build/schedule/exec_sync_epic_2026-07-27.py` | Schedule |
| `build/schedule/exec_sync_2026-07-22.py` | Schedule |
| `build/schedule/exec_sync_techplan_2026-07-30.py` | Schedule |
| `build/schedule/coverage-rederivation-2026-07-31/exec_sync_coverage_2026-07-31.py` | Schedule |
| `build/filters/design-2026-07-31/push/exec_push_design12.py` | Filters |
| `build/filters/branko-answers-2026-07-31/exec_push.py` | Filters |
| `build/filters/tech-plan-2026-07-29/exec_sync_2026-07-30.py` | Filters |
| `build/report-suite/chris-newreqs-2026-08-05/tools/exec.py` | Report Suite |
| `build/report-suite/viu-push-2026-08-04/new_cases.py` | Report Suite |
| `build/report-suite/chris-update-2026-07-29/exec_chris_push_2026-07-29.py` | Report Suite |
| `build/simple-flow/sell-price-investigation-2026-07-29/exec_push_2026-07-29.py` | Simple Flow |
| `build/simple-flow/sv8183/exec_corrective_2026-07-24.py` | Simple Flow |

**⇒ THE OPERATIVE INSTRUCTION: do not copy an `add_case` payload from an old script. Copy it from
`CLAUDE.md`.** One script also asserts the wrong value in a *verifier* —
`build/report-suite/chris-newreqs-2026-08-05/tools/audit.py` checks `custom_atmstatus == 3` as a
**pass condition**, so it would have flagged a correctly-created case as a failure. Left as-is for the
same audit-record reason, and recorded here because it is the one that would actively mislead.

---

## 5. Two things this pass could not establish, said plainly

1. **Whether `add_case` genuinely rejects a payload with no `custom_atmstatus` at all.** `is_required:
   true` with `default_value: "1"` strongly suggests TestRail applies the default, but **`add_case` is
   not authorised in this pass and it was not tested** (Rule 12 — not observed, so not asserted). It
   does not matter operationally: the instruction is to send `1` explicitly, which is correct either
   way.
2. **Whether other projects outside the three active ones carry the same born-Automated cases.** The
   two Simple Flow scripts above hardcode `3`, and Simple Flow is a completed project outside this
   pass's scope. **Not measured, not corrected — flagged here rather than assumed clean.**
