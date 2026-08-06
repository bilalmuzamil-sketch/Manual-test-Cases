# RECHECK-QUEUE — Report Suite, opened 2026-08-06

## STATUS: **OPEN**

> **⚠️ REPORT SUITE HAD NO LIVE RE-CHECK QUEUE UNTIL NOW.** Every other pass on every other project
> opened one. The 2026-08-06 first session did not, so its verdicts were queued nowhere and nothing
> would ever have triggered their re-check. This file opens the queue and covers **both** the earlier
> verdicts and the ones this second session established. The predecessor queue
> `build/report-suite/viu-2026-08-03/RECHECK-QUEUE.md` covers the far older 3 August pass only.

**Check this file at every session start and before and after any Report Suite work** (Rules 35/49).
There is no background scheduler — this committed, dated file plus that habit *is* the mechanism.

## Why it stays open

The `sv8582` QA branch is **not declared final**, and engineering will not declare it final before
release. Under Standing Rule 60 an **OPEN queue is therefore this project's normal steady state, not
a failure**. It does not lower the close condition: the queue closes only when **100 % of its rows are
re-verified** (Rule 17 — no sampling), and Rule 60 may never be cited to close it with rows unverified.

**Every verdict on every one of the 476 cases is PROVISIONAL.**

## Build markers this queue is measured against

| Read at | app-version | index.html last-modified | etag |
|---|---|---|---|
| 2026-08-06 08:24:28Z | `v3.5-16cf83f` | Wed, 05 Aug 2026 06:40:32 GMT | `177c59546701e7810b894492dabc1423` |
| **2026-08-06 09:25:03Z** | **`v3.5-7168d14`** | **Thu, 06 Aug 2026 08:32:37 GMT** | `207df1aa07090fcf99e98e67f1d1d6d5` |

**The branch redeployed at 08:32:37Z, eight minutes into this pass.** Every build line this pass wrote
was corrected to `v3.5-7168d14` afterwards. Earlier passes' markers (`v3.5-16cf83f`, `v3.4.1-3d03023`)
survive on the cases they belong to and say so on themselves.

## What this queue carries, and what it deliberately does NOT

Scoped per **Standing Rule 61**, which retired "a redeploy triggers a re-check of every finding" as
the default. An **automated** case is monitored **by the suite itself**: its next run reports a fix
that has shipped, or a failure that has *changed*, without anyone re-observing it. So this queue
carries **only what the automated suite cannot see**:

1. every **`AUTOMATION: HOLD`** case — 42 of them;
2. every case **never observed at all**;
3. any verdict that is **not** automated.

**Each row's trigger is the thing it is actually waiting on — not "a deploy."**

**`AUTOMATION: READY` is NOT in this queue.** It asserts that a case is *automatable*, not that it
currently passes, so it is build-independent and survives a redeploy (Rule 60).

**`AUTOMATION: READY - EXPECT FAIL` is NOT individually queued either**, because every one of the 77
carries the Rule-61 three-outcome block: it names the exact symptom and tells the tester what to do if
it fails that way, fails differently, or passes. **The next automated run is its monitor.** The one
standing obligation is the group row at the end of this file.

## Marker census, live, after this pass — 476 of 476, exactly one each

| Marker | Count |
|---|---|
| `AUTOMATION: READY` | **357** |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | **77** |
| `AUTOMATION: HOLD - <reason>` | **42** |
| **Total** | **476** |

**Arithmetic gate: 357 + 77 = 434 = 476 − 42 held. The gate PASSES.**
**Ready to automate = 434 of 476.** (Was 426 READY + 38 HOLD + 12 unmarked at the end of the first
session; the 12 unmarked were the raw-markup cases and are now readable and counted.)

---

# THE QUEUE — 47 rows

Every row: the case, its link, what was observed, the build marker it was observed on, and **the thing
it is waiting on**.

## A · Waiting on a SECOND TEST LOGIN — 17 rows

These are permission cases. The QA lead authorised unblocking them ("You should unblock yourself") and
**it WAS attempted on 2026-08-06 — both self-service routes are shut on this branch**, so this is an
evidenced blocker rather than an omission. Details in the Trigger note below and in
`SECOND-LOGIN-ATTEMPT.md`.

| Case | Report | What is owed | Observed on |
|---|---|---|---|
| [C30098](https://shopview.testrail.io/index.php?/cases/view/30098) | SBC | ordinary reports access opens the report | not observed |
| [C30099](https://shopview.testrail.io/index.php?/cases/view/30099) | SBC | without reports access it is absent and cannot open | not observed |
| [C30100](https://shopview.testrail.io/index.php?/cases/view/30100) | SBC | opening an invoice you lack permission for | not observed |
| [C30101](https://shopview.testrail.io/index.php?/cases/view/30101) | SBC | location access enforced for a non-administrator | not observed |
| [C30109](https://shopview.testrail.io/index.php?/cases/view/30109) | SBC | **item 5 only** — a one-location user is shown no Location filter. Items 1–4 PASS on `v3.5-7168d14` | partly, `v3.5-7168d14` |
| [C43546](https://shopview.testrail.io/index.php?/cases/view/43546) | SBC | the back end serves data and export on ordinary reports access | not observed |
| [C43550](https://shopview.testrail.io/index.php?/cases/view/43550) | SBC | a one-location user never sees Location in the column list | never checked on any build |
| [C43558](https://shopview.testrail.io/index.php?/cases/view/43558) | SBC | you cannot reach an invoice you may not open | never checked on any build |
| [C39447](https://shopview.testrail.io/index.php?/cases/view/39447) | SBC | no SBC permission offered in the role editor. **The role editor route was probed and `/administration/roles` returns the application's own 404** — the right route was not found | not observed |
| [C30526](https://shopview.testrail.io/index.php?/cases/view/30526) | WIP | ordinary reports access covers opening and downloading | not observed |
| [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | WIP | without reports access it is absent from navigation | not observed |
| [C30325](https://shopview.testrail.io/index.php?/cases/view/30325) · [C30326](https://shopview.testrail.io/index.php?/cases/view/30326) · [C30327](https://shopview.testrail.io/index.php?/cases/view/30327) · [C30340](https://shopview.testrail.io/index.php?/cases/view/30340) · [C30391](https://shopview.testrail.io/index.php?/cases/view/30391) | PV | the permission set, carried forward from the first session | not observed |
| [C30603](https://shopview.testrail.io/index.php?/cases/view/30603) · [C30604](https://shopview.testrail.io/index.php?/cases/view/30604) | IV | the permission pair, carried forward | not observed |

**Trigger:** a **second set of cookies for a NON-ADMIN user** on `.qa.shopview.com` — and that is now the
only trigger, because **both self-service routes were tried on 2026-08-06 and both are CLOSED on this
branch**: `POST /api/switch-user` returns **HTTP 403 "Access denied."** to the administrator against a
real, active, confirmed Technician, and `POST /api/quick-login {"key":"tech"}` returns **HTTP 403 "Access
denied."** — only `admin` works here. **Do not spend another session re-discovering this**; read
`SECOND-LOGIN-ATTEMPT.md`. Alternatives that would also work: a developer enabling the `tech` key on
`sv8582`, or granting `switch-user` to the administrator.

## B · Waiting on a DATA STATE that this organisation does not hold — 12 rows

| Case | What is missing | Observed on |
|---|---|---|
| [C30104](https://shopview.testrail.io/index.php?/cases/view/30104) | the calendar could not be driven past a 366-day span from this harness. **The back end DOES refuse it — 367 days returns HTTP 400 "Date range cannot exceed 366 days.", exactly 366 returns 200** — but the on-screen prevention was not seen | partly, `v3.5-7168d14` |
| [C30131](https://shopview.testrail.io/index.php?/cases/view/30131) | a **service** invoice with no vehicle. The "Parts Sales" bucket itself IS built and was confirmed — it holds P-96, P-60, P-57, P-56, P-54, P-26, P-23 for Uashore Partners — but every invoice in it is a parts sale | partly, `v3.5-7168d14` |
| [C30137](https://shopview.testrail.io/index.php?/cases/view/30137) | two assets of one customer that produce the same label, so the "(#1)/(#2)" suffix can appear. Checked across the 14 largest customers: **no duplicates exist** | `v3.5-7168d14` |
| [C30132](https://shopview.testrail.io/index.php?/cases/view/30132) | a reversed or voided invoice inside the range | not observed |
| [C30141](https://shopview.testrail.io/index.php?/cases/view/30141) | an invoice deleted while the report is open — **deliberately not done on a shared environment** | not observed |
| [C30184](https://shopview.testrail.io/index.php?/cases/view/30184) | a failing data fetch, which cannot be forced from the application | not observed |
| [C43553](https://shopview.testrail.io/index.php?/cases/view/43553) | a logo that is **set but fails to load**. This organisation's logo loads correctly | not observed |
| [C30456](https://shopview.testrail.io/index.php?/cases/view/30456) · [C30457](https://shopview.testrail.io/index.php?/cases/view/30457) · [C30458](https://shopview.testrail.io/index.php?/cases/view/30458) · [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) · [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | WIP scope and tab-placement, each needing a seeded work order in a known status | not observed |

**Trigger:** seeded data, or a decision that the condition is not worth seeding. **Note honestly:
Standing Rule 14 says seed it rather than hold it.** These rows are held because the pass ran out of
time, not because seeding is impossible — except C30141 and C30184, which are genuinely improper or
unforceable.

## C · Waiting on the SERVER-SIDE NIGHTLY JOB — 6 rows

The Work In Progress and Inventory Value nightly snapshot captures are cron jobs whose stored rows are
not reachable from the application at all.

[C30528](https://shopview.testrail.io/index.php?/cases/view/30528) · [C30530](https://shopview.testrail.io/index.php?/cases/view/30530) · [C30531](https://shopview.testrail.io/index.php?/cases/view/30531) · [C30533](https://shopview.testrail.io/index.php?/cases/view/30533) (WIP) ·
[C30605](https://shopview.testrail.io/index.php?/cases/view/30605) · [C30607](https://shopview.testrail.io/index.php?/cases/view/30607) (IV)

**Trigger:** a developer or a database read, not a deploy.

## D · Waiting on CHRIS WARD — 4 rows, and they are the Location column question

The Location column is stated **both ways inside the same specification** on four of the six reports,
and this pass **confirmed the build's behaviour live** without resolving the question, because Rules 15
and 58 forbid picking a winner inside a self-contradictory document.

**What was observed on `v3.5-7168d14`, so whoever answers has the facts:** on Sales By Customer the
Location column **disappears the moment a single location is selected**, and it is **never offered in
the column selector** — the selector holds exactly the nine metric columns S13-R4 names. **S4-R12 says
the opposite**: for a user with access to more than one location it "is shown by default and can be
toggled on or off from the column selector, **regardless of how many locations are currently
selected**."

| Case | Report | |
|---|---|---|
| [C38912](https://shopview.testrail.io/index.php?/cases/view/38912) | SBC | already `HOLD`, correctly |
| [C38916](https://shopview.testrail.io/index.php?/cases/view/38916) | WIP | S4-R3 and S7-R13 contradict each other **inside v9** |
| [C43551](https://shopview.testrail.io/index.php?/cases/view/43551) | WIP | a hand-made Location choice remembered — depends on the answer |
| [C30577](https://shopview.testrail.io/index.php?/cases/view/30577) | IV | S7-R6 still contradicts its own Key Decision |

**Trigger:** one sentence from Chris. See `QUESTIONS-FOR-CHRIS.md`.

## E · Waiting on a re-drive that this pass did not reach — 8 rows

Cases whose report was opened and characterised but whose own assertion was **not** exercised. They
carry their earlier markers and their earlier build lines, which say so on themselves.

[C30501](https://shopview.testrail.io/index.php?/cases/view/30501) (WIP nine presets) ·
[C30503](https://shopview.testrail.io/index.php?/cases/view/30503) · [C30504](https://shopview.testrail.io/index.php?/cases/view/30504) (WIP location filter) ·
[C30507](https://shopview.testrail.io/index.php?/cases/view/30507) · [C30508](https://shopview.testrail.io/index.php?/cases/view/30508) · [C30509](https://shopview.testrail.io/index.php?/cases/view/30509) (WIP columns and persistence) ·
[C30520](https://shopview.testrail.io/index.php?/cases/view/30520) · [C30521](https://shopview.testrail.io/index.php?/cases/view/30521) (WIP strip band and pinned Total)

**Trigger:** the next pass on this report. **Nothing about these is blocked** — they simply were not
reached.

## F · The group row for the 77 EXPECT-FAIL cases

**Every one carries the Rule-61 three-outcome block, so the automated suite is their monitor.** The
standing obligation is not a re-observation — it is this: **when a run reports outcome (3), a
PASS, tell the QA lead so the ticket can be closed and the note removed**; when it reports outcome (2),
a *different* failure, **raise it as a new problem**.

**Trigger:** an automated run's result, not a deploy.

---

# THE 181 CASES CARRYING AN OLDER BUILD LINE — stated plainly, not queued

**176 cases still read `v3.4.1-3d03023` on 8/4/2026** and **5 carry no build line at all** (they say
in their own text that they have not yet been checked against any build:
[C30278](https://shopview.testrail.io/index.php?/cases/view/30278),
[C43550](https://shopview.testrail.io/index.php?/cases/view/43550),
[C43551](https://shopview.testrail.io/index.php?/cases/view/43551),
[C43558](https://shopview.testrail.io/index.php?/cases/view/43558),
[C43559](https://shopview.testrail.io/index.php?/cases/view/43559)).

**These are NOT a defect and they are NOT re-check rows.** Under Rule 60 an older build line is the
*honest record* of when a case was last checked; each case states its own date, which is exactly what
makes the honest split below derivable from the cases themselves rather than from memory. They enter
this queue only if they are `HOLD` (rows A–E above) or if a run reports something unexpected.

# THE HONEST SPLIT — numbers, not a banner

| | Count |
|---|---|
| Our cases under group 4281 | **476** |
| Carrying a build line naming **`v3.5-7168d14`** (this session's live verdicts) | **69** |
| Carrying `v3.5-16cf83f` 8/6/2026 (the first session's live verdicts, same day) | **219** |
| Carrying `v3.5-16cf83f` 8/5/2026 | **7** |
| Carrying `v3.4.1-3d03023` 8/4/2026 | **176** |
| Carrying no build line, and saying so | **5** |

**288 of the 476 were checked against a build on 6 August; 188 were not.** And of those 288, only the
**69** this session wrote name the build that is actually running now — the other 219 name
`v3.5-16cf83f`, which the 08:32:37Z redeploy replaced.

**Nothing in this folder claims the suite is verified.** The correct sentence is the one above.
