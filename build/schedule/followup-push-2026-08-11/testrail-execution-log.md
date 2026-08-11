# Schedule follow-up push — per-operation execution log, 2026-08-11

> **⚠️ THIS LOG WAS RECONSTRUCTED AFTER THE FACT, AND SAYS SO PLAINLY.** The pass that
> performed these two writes **died before it wrote any of its deliverables** — only its
> executor (`tools/exec_followup.py`) reached the repository. This file was rebuilt on
> **2026-08-11 ~17:55Z** from three sources: the executor's own intent literals, the **live
> TestRail text**, and `build/RECOVERY-2026-08-11/STATE.md`.
>
> **What that costs, stated honestly:** the executor's in-run byte-comparison output
> (`{OUT}/ops.json`, `{OUT}/exec-log.txt`, written to the ephemeral `/tmp/fu-push`) **is
> gone with the container and is not recoverable.** So the per-op *"30 fields compared, 0
> mismatch"* lines that the executor certainly printed **cannot be quoted here**. What CAN
> be, and is, established is the thing that actually matters: **both writes landed, and
> their landed content is exactly what was intended** — verified by content, field by
> field, against the executor's literals.

---

## The verification method, and why it is not `updated_on`

**Landing was decided by comparing live case text against the executor's intended
literals — never by the timestamp.** The timestamp is reported only as corroboration,
because this workspace has twice been misled by it: TestRail re-renders text hours later
without moving `updated_on`, and three Filters cases carried the current day's timestamp
from an unrelated pass while the intended write had never landed.

**The corroboration is nonetheless clean here:** both cases carry `updated_on` inside this
pass's own window and **nothing has touched them since**.

| Case | `updated_on` | UTC | Falls in this pass's window (14:13Z)? |
|---|---|---|---|
| C29944 | `1786457585` | **2026-08-11 14:13:05Z** | ✅ yes |
| C38866 | `1786457588` | **2026-08-11 14:13:08Z** | ✅ yes |

---

## OP 1 — `update_case` C29944

**[SCH-FILT-03 = C29944](https://shopview.testrail.io/index.php?/cases/view/29944)** —
*"Status filter narrows the list to work orders in the chosen status(es)"*

| | |
|---|---|
| **Operation** | `update_case/29944` |
| **Fields written** | `custom_preconds`, `custom_steps`, `custom_expected` — **all three**, per playbook §J declared normalisation #3 |
| **Intent** | **REMOVE** the unsourced multi-status assertion (expected item 3) and renumber |
| **HTTP** | **200** *(reported by the executor at run time; not re-quotable — see the banner)* |
| **Verified now** | ✅ **LANDED, and correct** — by content |
| **`custom_atmstatus` at write time** | **1** (read live now; unchanged) |

**REMOVED, verbatim:**

> *"3. Choosing more than one status shows the work orders of all the chosen statuses
> together."*

**RENUMBERED:** old item 4 → item 3 (*"The card left-border colours of the remaining cards
are consistent with that status."*)

**Live text now reads exactly that** — three expected items, the multi-status sentence
absent, the card-border item sitting at 3.

**WHY REMOVAL AND NOT REWORDING — the point of the op.** The case's own steps say
*"2. Choose **one** status under Status."*, so the assertion described a multi-select the
case never performs, and **no source required it**. Under Rules 25/57/58 the repair for an
unsourced assertion is **removal**, never substitution of whatever the build happens to
do. The executor guarded this with a hard pre-assertion — it re-checked that the steps
still said *"Choose one status"* and **would have stopped** if that premise had changed.

**The delta was proved to be exactly the removal:** the executor asserted
`len(before) - len(after) == len(the removed line)`, so no other character could have
moved.

---

## OP 2 — `update_case` C38866

**[SCH-EDGE-08 = C38866](https://shopview.testrail.io/index.php?/cases/view/38866)** —
*"Schedule and all its dialogs display correctly in dark mode"*

| | |
|---|---|
| **Operation** | `update_case/38866` |
| **Fields written** | `custom_preconds`, `custom_steps`, `custom_expected` — all three |
| **Intent** | Re-point the Rule-54 provenance from the **epic** to the **OWNING STORIES** (per-story precision, Rule 20), matching the case's own `refs`. **Sentence 2 untouched.** |
| **HTTP** | **200** *(as above)* |
| **Verified now** | ✅ **LANDED, and correct** — by content |
| **`custom_atmstatus` at write time** | **1** (read live now; unchanged) |

**BEFORE (sentence 1):**

> *"This is the expected behaviour as per **epic SV-8685**, read on 11 August 2026, and the
> Schedule specification version 27 (§11), read on 11 August 2026."*

**AFTER (sentence 1), live now:**

> *"This is the expected behaviour as per **story SV-8700 (dark theme)**, read on 11 August
> 2026, **story SV-8698 (overtime and conflict cues are not colour-only)**, read on 11
> August 2026, and the Schedule specification version 27 (§11), read on 11 August 2026."*

**SENTENCE 2 SURVIVED VERBATIM, and this was asserted three ways:**
*"Last checked against build v3.5-7ec992f on 8/6/2026."* — **confirmed live.** The
executor refused to proceed if it were lost, if the old epic sentence survived, **or if
any assertion changed** (it compared everything before the `---` separator byte for byte).

**Rule 54 compliance:** sentence 1 names **documents only**; sentence 2 records only what
the case was **last checked against**. The build is never credited with the expectation.

---

## What this pass did NOT do

| | |
|---|---|
| `add_case` | **0** |
| `delete_case` | **0** |
| section writes | **0** |
| **run writes** | **0** — run 357 untouched |
| result writes | **0** |
| **Jira calls** | **0** — the Rule-62 creation hold was and is active |

**Re-verified independently on 2026-08-11 at ~17:53Z:** run 357 reads `include_all=false`,
**174 tests, 529 results, 89 Passed / 6 Failed / 2 Blocked / 77 Untested** — exactly as
`build/RECOVERY-2026-08-11/STATE.md` recorded it.

---

## Two things that cannot be reconstructed, and are not guessed

1. **The executor's per-op byte-comparison output.** It ran (the code path raises on any
   mismatch, so reaching completion is itself evidence the comparisons passed) but its text
   lived in `/tmp/fu-push` and the container is gone. **The claim "0 mismatches" is
   therefore INFERRED from the executor's control flow, not quoted from its log** — stated
   as an inference, per Rule 12.
2. **Which phase last wrote C38866.** It appears in **both** the staged-push op list and
   this follow-up executor, and TestRail exposes only the most recent write. **Both ops
   landed and the final content is correct**; the ordering is simply not reconstructable.

## Rule 59 — the source re-read

The executor re-read the specification at **write start and again at write end**, comparing
the **body checksum** rather than the version number (the in-body *"Version"* field on this
page reads `1.0` and lies). It would have exited on any change.

**Independently re-confirmed at 17:48:53Z and 17:50:09Z today:** Confluence page
`713031682` → HTTP 200, **version 27**, `2026-08-07T15:01:20.801Z`, 43,064 chars, sha256
**`4c51fb7239c84987b4bed33481448c1099911d4bb2a976ca9c7426c833485d4b`** — identical to the
committed mirror `build/schedule/coverage-gaps-2026-08-11/evidence/versions/raw-v27.xml`.
**The spec has not moved since these writes.**
