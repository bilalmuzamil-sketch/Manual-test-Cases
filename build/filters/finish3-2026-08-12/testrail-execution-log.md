# Filters — TestRail execution log (finish3), 2026-08-12

**Build `v3.7-20e801b`** — `index.html` last-modified Wed 12 Aug 2026 12:09:14 GMT, etag
`82eedf656263a3228c8865356eed8379`, sha256 `157756e3…`. **Read by this worker at 13:44:12Z and again
at 15:13:51Z, byte-identical, so nothing redeployed under the pass.**

Sources re-read **immediately before the write phase** (Rule 59), not only at pass start: all 65
target cases were pulled fresh from TestRail into `restamp_pre.json` and the payloads were built from
that read, so nothing was written from a stale body.

## WHAT WAS WRITTEN

| | |
|---|---|
| Operations | **64 × `update_case`** |
| Cases touched | **64 distinct** (65 planned, 1 skipped — below) |
| HTTP | **200 on every one** |
| Verification | **re-GET + byte-compare, 28 fields per case, 0 mismatches** |
| Collateral changes | **0** on any case |
| Fields sent | **all three text fields on every payload** (`custom_preconds`, `custom_steps`, `custom_expected`) — `update_case` re-renders any text field it is not given, and this project shows markup literally to the tester |
| What actually moved | **Rule-54 SENTENCE 2 only** |
| `add_case` / `delete_case` / `add_section` | **0 / 0 / 0** |
| Run writes / results logged | **0 / 0** |
| Jira calls that create anything | **0** |

**The change, on every case:** sentence 2 became
**`Last checked against build v3.7-20e801b on 12 August 2026.`** — **61 replaced** an existing
sentence, **3 inserted** one where none existed (C29558, C29600, C43563).

**SENTENCE 1 WAS NOT TOUCHED ON ANY CASE.** It names documents only; nothing about the sources
changed, and putting a build into it is precisely what Rule 54's 2026-08-05 amendment forbids. The
barred phrase *"as per the build tested on …"* was not written anywhere.

## THE ONE SKIP, REPORTED RATHER THAN GUESSED AT

**[C29621](https://shopview.testrail.io/index.php?/cases/view/29621)** — **SKIPPED.** Its provenance
paragraph ends *"…read on 11 August 2026"* with **no full stop**, so there is no safe place to append
a second sentence without inventing punctuation inside a tester-facing field. The writer's own guard
refused it and recorded the reason. **The case was walked and passes; only its stamp is unchanged.**
One line of authorised text repair would fix it.

## PER-OPERATION LOG

`evidence/restamp-oplog.json` — written **before and after each individual write**, not at the end,
and committed. Per operation it carries: sequence number · C-id · title · `custom_atmstatus`
**captured at write time** · the transform applied (replaced / inserted) · HTTP status · fields
compared · whether the expected field matched · any collateral changes · start and finish timestamps.

**A killed run could have been resumed from that file alone** — it names the exact position reached.

## THE 64 CASES

C29557, C29558, C29560, C29561, C29562, C29563, C29564, C29565, C29566, C29567, C29570, C29571,
C29572, C29573, C29574, C29575, C29576, C29577, C29578, C29579, C29580, C29582, C29583, C29584,
C29585, C29586, C29587, C29589, C29590, C29591, C29592, C29593, C29595, C29596, C29597, C29598,
C29599, C29600, C29602, C29603, C29604, C29605, C29606, C29607, C29608, C29611, C29613, C29615,
C29616, C29617, C29619, C29623, C29624, C29625, C29627, C29629, C29630, C29631, C29632, C29635,
C38888, C38889, C38897, C43563.

**Every one of these was driven step by step on this build in this pass.** No case was re-stamped
from a label harvest, and no build line was invented: the 29 cases not fully walked **keep their
older, honest stamps** (30 still name `v3.4.2-d00239b`, 14 name `v3.6-3e9dd6d`, 7 carry no build line
at all because they have never been checked against one — which is exactly what Rule 60 requires).

## RUN 352 — PROVEN UNTOUCHED **BY CONTENT**, NEVER BY COUNTS

| Check | Result |
|---|---|
| `include_all` | still **false** |
| Tests | **120 before, 120 after** |
| `case_id` sets | **equal in BOTH directions** (0 only-before, 0 only-after) |
| `test_id` sets | **equal in BOTH directions** |
| Result records | **645 before, 645 after** |
| Prior results **missing by id** | **0** |
| Prior results with any **graded** field changed | **0** (`status_id`, `comment`, `defects`, `elapsed`, `version`, `assignedto_id`, `created_by`, `created_on`, `test_id`) |
| New results during our write window | **0** — the tester logged nothing while we wrote |

`update_run` was **never called**. No result was logged anywhere.

## THE FIVE FOREIGN CASES — HANDS OFF, AND PROVEN SO

**C43576, C43577, C43578, C43579, C43580** (created and last updated by **user 7, Ahtasham Amjad**)
were **byte-identical over all 30 fields including `updated_on` and `updated_by`** before and after
this pass. They were **not edited, not deleted, not counted in our tally, and not added to any run**.

**Counts are reported both ways:** **ours 115 / live 120.**

## OUR OWN CASE COUNT, RE-DERIVED LIVE

Enumerated from group **4110** plus its **18 child sections** at 15:1xZ: **120 cases live, 115 ours
(`created_by = 3`), 5 foreign (`created_by = 7`)** — set-equal to the figures the pass opened with.

## AUTOMATION MARKERS — READ BACK LIVE, NOT COMPUTED

**90 `READY` · 7 `READY - EXPECT FAIL` · 18 `HOLD` = 115.**
**The gate closes both ways: 90 + 7 = 97, and 115 − 18 = 97.**

**No marker was changed by this pass.** In particular C38876 keeps its plain `READY` even though its
precondition proved unreachable — moving it to `HOLD` would remove a case from the automatable count
on our own initiative, and that is the QA lead's call (`DIVERGENCES.md` §5).

## `custom_atmstatus` — NOT SET, NOT TOUCHED

**`custom_atmstatus` was not sent on any payload.** Two of the 64 carry TestRail's own Automated flag
and are reported to Vlad in `AUTOMATED-CASES-CHANGED.md`; the flag's value was **captured at write
time** on all 64, because it moves both ways.
