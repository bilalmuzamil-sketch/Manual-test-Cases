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
| `AUTOMATION: READY` | ~~357~~ → **356** |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | ~~77~~ → **78** |
| `AUTOMATION: HOLD - <reason>` | **42** |
| **Total** | **476** |

**⚠️ Amended 2026-08-06 by the C30114 repair (section H below): one case moved `READY` → `READY - EXPECT
FAIL (SV-8991)`.** The two figures move in opposite directions by one, so the total and the gate are
unaffected.

**Arithmetic gate: 356 + 78 = 434 = 476 − 42 held. The gate PASSES.**
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


---

# Section F - added by the THIRD session, 2026-08-06 (Sales By Representative)

**Scoped per Standing Rule 61: these rows are what the automated suite CANNOT see.** The **15** cases
this session marked `READY - EXPECT FAIL` are **deliberately NOT listed here** - each one names its exact
symptom and the three outcomes, so the next automated run reports a fix that has shipped or a failure
that has changed, with nobody re-observing it. Ticket status is never read as evidence about the build.

**The arithmetic, stated so it can be checked.** This session **wrote 64 cases**:
**48 `READY` + 15 `READY - EXPECT FAIL` + 1 `HOLD` = 64.** The rows below are **52**: the 48 READY, the
1 HOLD, and **3 permission cases that were NOT written at all** because they cannot be observed without a
second sign-in and there was nothing honest to stamp on them. **48 + 1 + 3 = 52**, and **52 + 15 EF = 67**,
which is the 64 written plus those 3 untouched.

**Every row that was observed was observed on build `v3.5-7168d14`** (last-modified Thu 06 Aug 2026
08:32:37 GMT), read at 09:54:19Z, at 10:31:45Z and again immediately before the writes at 10:35:43Z -
byte-identical each time by sha256, so no redeploy ran under this pass.

## F1 - Waiting on a SECOND SIGN-IN as a non-administrator - 3 rows, NOT WRITTEN

These three were **deliberately left untouched**: with nothing observed, any build stamp would assert a
check that did not happen (Rule 12). They still carry their older build line and say so on themselves.

| Case | What is owed | Observed on |
|---|---|---|
| [C30198](https://shopview.testrail.io/index.php?/cases/view/30198) | Sales By Representative is visible to anyone who can see another Performance report | not observed |
| [C30199](https://shopview.testrail.io/index.php?/cases/view/30199) | without Reports access there is no navigation entry, no download menu and no export dialog | not observed |
| [C30200](https://shopview.testrail.io/index.php?/cases/view/30200) | without staff-administration access the deactivation flow cannot be reached | not observed |

**Trigger: a second set of cookies for a NON-ADMIN user.** Not a deploy. Both self-service routes are
**shut on this branch** and were **not re-attempted this session**, because a failed `quick-login` burns
the sign-on token shared by all three QA branches: `POST /api/switch-user` returns HTTP 403 "Access
denied." to an administrator against a real confirmed Technician, and `POST /api/quick-login` with the
technician key returns HTTP 403. Read `SECOND-LOGIN-ATTEMPT.md` before trying again.

## F2 - Waiting on something this HARNESS could not drive - 1 row

| Case | What is owed | Observed on |
|---|---|---|
| [C30202](https://shopview.testrail.io/index.php?/cases/view/30202) | the on-screen prevention of a custom range longer than 366 days. **The server does refuse it, but one day late** - counting both ends, 367 days is accepted and only 368 is refused, with "Date range cannot exceed 366 days." The calendar itself could not be driven past the limit from this harness | partly, `v3.5-7168d14` |

**Trigger: a run that can drive the calendar across a year boundary.** Not a deploy. The one-day-late
server boundary is recorded in `API-ASK.md` and **deliberately not filed** - it was not shown to be
reachable from the screen, and Rule 51 forbids filing an API-only finding without asking first.

## F3 - PASSED on this build, and therefore PROVISIONAL only - 48 rows

The branch is **not declared final**, so these verdicts are provisional under Rule 49 even though they
passed. Under Rule 61 they need **no re-observation on a redeploy**: each carries `AUTOMATION: READY`,
which asserts that the case is automatable rather than that it currently passes, and the automated suite
is the monitor.

- [C30195](https://shopview.testrail.io/index.php?/cases/view/30195)
- [C30197](https://shopview.testrail.io/index.php?/cases/view/30197)
- [C30201](https://shopview.testrail.io/index.php?/cases/view/30201)
- [C30204](https://shopview.testrail.io/index.php?/cases/view/30204)
- [C30206](https://shopview.testrail.io/index.php?/cases/view/30206)
- [C30208](https://shopview.testrail.io/index.php?/cases/view/30208)
- [C30209](https://shopview.testrail.io/index.php?/cases/view/30209)
- [C30211](https://shopview.testrail.io/index.php?/cases/view/30211)
- [C30212](https://shopview.testrail.io/index.php?/cases/view/30212)
- [C30213](https://shopview.testrail.io/index.php?/cases/view/30213)
- [C30215](https://shopview.testrail.io/index.php?/cases/view/30215)
- [C30217](https://shopview.testrail.io/index.php?/cases/view/30217)
- [C30219](https://shopview.testrail.io/index.php?/cases/view/30219)
- [C30222](https://shopview.testrail.io/index.php?/cases/view/30222)
- [C30223](https://shopview.testrail.io/index.php?/cases/view/30223)
- [C30224](https://shopview.testrail.io/index.php?/cases/view/30224)
- [C30226](https://shopview.testrail.io/index.php?/cases/view/30226)
- [C30241](https://shopview.testrail.io/index.php?/cases/view/30241)
- [C30243](https://shopview.testrail.io/index.php?/cases/view/30243)
- [C30244](https://shopview.testrail.io/index.php?/cases/view/30244)
- [C30245](https://shopview.testrail.io/index.php?/cases/view/30245)
- [C30247](https://shopview.testrail.io/index.php?/cases/view/30247)
- [C30249](https://shopview.testrail.io/index.php?/cases/view/30249)
- [C30250](https://shopview.testrail.io/index.php?/cases/view/30250)
- [C30251](https://shopview.testrail.io/index.php?/cases/view/30251)
- [C30261](https://shopview.testrail.io/index.php?/cases/view/30261)
- [C30262](https://shopview.testrail.io/index.php?/cases/view/30262)
- [C30264](https://shopview.testrail.io/index.php?/cases/view/30264)
- [C30265](https://shopview.testrail.io/index.php?/cases/view/30265)
- [C30267](https://shopview.testrail.io/index.php?/cases/view/30267)
- [C30268](https://shopview.testrail.io/index.php?/cases/view/30268)
- [C30269](https://shopview.testrail.io/index.php?/cases/view/30269)
- [C30271](https://shopview.testrail.io/index.php?/cases/view/30271)
- [C30272](https://shopview.testrail.io/index.php?/cases/view/30272)
- [C30274](https://shopview.testrail.io/index.php?/cases/view/30274)
- [C30275](https://shopview.testrail.io/index.php?/cases/view/30275)
- [C30276](https://shopview.testrail.io/index.php?/cases/view/30276)
- [C30278](https://shopview.testrail.io/index.php?/cases/view/30278)
- [C30291](https://shopview.testrail.io/index.php?/cases/view/30291)
- [C30300](https://shopview.testrail.io/index.php?/cases/view/30300)
- [C30302](https://shopview.testrail.io/index.php?/cases/view/30302)
- [C30303](https://shopview.testrail.io/index.php?/cases/view/30303)
- [C30308](https://shopview.testrail.io/index.php?/cases/view/30308)
- [C30316](https://shopview.testrail.io/index.php?/cases/view/30316)
- [C30317](https://shopview.testrail.io/index.php?/cases/view/30317)
- [C30318](https://shopview.testrail.io/index.php?/cases/view/30318)
- [C30319](https://shopview.testrail.io/index.php?/cases/view/30319)
- [C38913](https://shopview.testrail.io/index.php?/cases/view/38913)

**Trigger for this group: the automated suite reporting a change.** Not a deploy, and not a ticket status.

## F4 - One PRODUCT-OWNER answer is owed, and it does not hold up a whole case

[C30279](https://shopview.testrail.io/index.php?/cases/view/30279) is marked `READY - EXPECT FAIL` against **SV-8981**, because its Expanded View PDF is a flat table on
A3 paper and that is wrong under **either** reading of the description. Only one sentence inside it is in
doubt: whether the paper should be **A4 portrait** (what the Sales By Representative description says) or
**A4 landscape** (what the Sales By Customer description says, and what both reports actually render).
That single point is **Q7 in `QUESTIONS-FOR-CHRIS.md`**, and it is **not** listed as a held row because
the case can be run and failed today regardless of the answer.

**Trigger: Chris Ward answering Q7.** Not a deploy.

---

## SECTION G — SESSION 4, 2026-08-06, Work In Progress on build `v3.5-f77875c`

**STATUS: OPEN.** The branch is **not declared final** and engineering have said it will not be before
release, so under Rule 60 an open queue is this project's normal steady state and **every verdict below
is PROVISIONAL**.

**Build these 35 observations were made on: `v3.5-f77875c`** (last-modified Thu 06 Aug 2026 10:43:37 GMT,
etag `829ed038…`, `index.html` sha256 `b0f05b6f…`, byte-identical at 10:55:54Z and 11:53:07Z).
**This is recorded per row, not per pass** — the suite now spans four build markers and an average would
hide that.

### G.1 — What the automated suite now monitors by itself (Rule 61), so it is NOT a re-check task

The 24 PASS and 5 EXPECT-FAIL cases below are automatable and each expect-fail case names its exact
symptom with all three outcomes, so a shipped fix or a changed failure is reported by the next automated
run at no cost. **They need no deploy-triggered re-observation.**

| Case | Verdict | Build observed on | Ticket |
|---|---|---|---|
| C30457, C30458, C30459, C30460, C30462, C30473, C30482, C30484, C30485, C30486, C30490, C30501, C30502, C30503, C30504, C30506, C30507, C30508, C30509, C30520, C30521, C30522, C30525, C38916 | PASS (24) | `v3.5-f77875c` | — |
| C30466 | DEVIATION | `v3.5-f77875c` | SV-8987 |
| C30491 | DEVIATION | `v3.5-f77875c` | SV-8988 |
| C30481 | DEVIATION | `v3.5-f77875c` | SV-8989 |
| C30500 | DEVIATION | `v3.5-f77875c` | SV-8908 (carried forward, not re-verified) + SV-8968 (confirmed) |
| C30511 | DEVIATION | `v3.5-f77875c` | SV-8907 |

### G.2 — THE REAL WORK LIST: rows that need a human, each against the thing it is actually waiting on

| Case | Waiting on | NOT a deploy trigger |
|---|---|---|
| C30467, C43551 | **Chris Ward's answer to Q5** — the WIP specification says the Location column two ways (S4-R3 vs S7-R13) | Re-check when he answers |
| C30528, C30530, C30531, C30533 | **A way to read the nightly snapshot back.** Six candidate endpoints probed, all HTTP 404 | Re-check if a reader ships |
| C30526, C30527 | **A second sign-in as a non-administrator** | Re-check when the login exists |
| C30456, C30464, C30475, C30476, C30477, C30478, C30480, C38890 | **A seeded work order with known billed and clocked labour hours.** Half-done: the work order exists (`e40c1c15-63ba-4202-9cc9-358da3d5fe21`) and the two fields needed are identified as `input_time_estimate` and `input_tech_time` in the New Line dialog | Re-check when the session returns. **These 8 were NOT written, so they still carry their 4 August build stamp — correctly** |

### G.3 — Two things for the QA lead, carried as queue rows because neither is ours to settle

| Row | What it is |
|---|---|
| **C30495** | Verdicted **PASS** on `v3.5-7168d14` by an earlier session, but **S6-R3** requires the Totals row's Inv. Hrs to carry the same green/red colouring as a row and **it carries none** on all four tabs (`+246.84`, `+1434.65`, `+0.52`, `+173.50`, all positive, all black in light mode). **Outside this session's work list; not re-verdicted.** |
| **The five APC rows** | Five of 116 "Approved - Partially Completed" rows have neither clocked time nor Parts Earned, where **S3-R4** requires one or the other. A part received at a $0.00 sell value would make all five correct, and that could not be separated before the session was lost. **Not filed.** |

---

## SECTION H — THE C30114 ZEROS-ROW REPAIR, 2026-08-06

**STATUS: OPEN**, like every other section — the branch is **not declared final**, so the verdict below is
**PROVISIONAL**.

**One case was written: [C30114](https://shopview.testrail.io/index.php?/cases/view/30114)** — the *screen*
half of [SV-8991](https://shopview.atlassian.net/browse/SV-8991), whose *export* half
([C30173](https://shopview.testrail.io/index.php?/cases/view/30173)) was repaired earlier the same day.
Both had been disarmed by a note claiming the description is silent on the totals row; **`S18-N1` states it
plainly**, and did so at v15, published the previous evening. Full working:
`execution-log.md` and `../zeros-row-2026-08-06/SOURCE-VERIFICATION.md`.

### H.1 — What the automated suite now monitors by itself (Rule 61), so it is NOT a re-check task

| Case | Verdict | Build the verdict rests on | Ticket | Marker now |
|---|---|---|---|---|
| [C30114](https://shopview.testrail.io/index.php?/cases/view/30114) | **DEVIATION** — after "Clear all" the empty state and the `"None"` label are correct, but **no totals row is rendered at all**, where `S18-N1` requires a row of zeros | **`v3.5-7168d14`** — **NOT re-observed today; the branch is unreachable** and has since redeployed to `v3.5-f77875c` | **SV-8991** | `READY - EXPECT FAIL (SV-8991)` |

**Trigger: the next automated run reporting a change.** Not a deploy, and **not the ticket's status.** The
case now carries the Rule-61 three-outcome block, so a shipped fix (outcome 3) or a *different* failure
(outcome 2) is reported at no cost. Its symptom is written **narrower** than C30173's on purpose: this case
asserts four things and only one fails, so outcome (2) names the other three explicitly to stop a pinned-
control fault being filed under SV-8991.

**It is listed here, rather than only under the group row, because its marker CHANGED in this pass** — the
census above had to be amended, and a reader reconciling `READY 357` against a live count of `356` needs
this row to find out why.

### H.2 — The one row that needs a human, against the thing it is actually waiting on

| Row | What it is | Trigger |
|---|---|---|
| **The `sbc7.json` ambiguity** | `full-viu-2026-08-06/evidence/2026-08-06-session2/sbc7.json` holds `emptyBody: " \| "` beside a **fully populated, non-zero** totals row — which cannot be the same state as `sbc9.json`'s `totals: null`. The likeliest reading is **two different empty states** (an empty **date range** vs an empty **customer selection**), in which case a stale non-zero totals row over a range matching nothing is a **SECOND, SEPARATE DEFECT**. The harness that produced the capture is **not in the repository**, so it cannot be settled from what we hold. **Asserted nowhere and not filed** (Rule 12) | **A live pass on a reachable branch** that drives an empty **date range** (not an empty customer selection) and reads the totals row. Not a deploy |

**C30114's repair does not depend on this row.** It rests on `sbc9.json`, whose `label: "None"` is the
`S18-R5` label for an empty selection, making it unambiguously `S18-N1`'s scenario.

---

## SECTION H — SESSION 5, 2026-08-06 (16 cases)

**Build all 16 were observed on: `v3.5-f77875c`** (last-mod Thu 06 Aug 2026 10:43:37 GMT, etag
`829ed03832a746e78cbdb28eb9957a3e`, `index.html` sha256 `b0f05b6f…94fc9b6`; read at **13:53:17Z** and
**14:49:05Z**, byte-identical, so nothing redeployed under this session). **The branch is NOT declared
final, so every verdict below is PROVISIONAL** (Rule 49). Per Rule 61 the `READY` and
`READY - EXPECT FAIL` rows are monitored by the automated suite itself and do **not** need
re-observation on a redeploy; what the queue genuinely still owes is the two named shortfalls at the end.

| Case | Link | Verdict | Observed on | What was seen | Re-check obligation |
|---|---|---|---|---|---|
| C30456 | [30456](https://shopview.testrail.io/index.php?/cases/view/30456) | PASS | `v3.5-f77875c` | report set-equal to the WO list both directions, 260 = 260, all five open statuses present | none — automated |
| C30464 | [30464](https://shopview.testrail.io/index.php?/cases/view/30464) | PASS | `v3.5-f77875c` | all 3 tab-boundary items, incl. a before/after control on our own seeded WO | none — automated |
| C30475 | [30475](https://shopview.testrail.io/index.php?/cases/view/30475) | PASS (items 1, 3) | `v3.5-f77875c` | clocked share exact at 0.01 h, 0.02 h and 0.18 h against a 3.00 h / $449.85 quote | **item 2, the per-line CAP, was NOT exercised** |
| C30476 | [30476](https://shopview.testrail.io/index.php?/cases/view/30476) | PASS | `v3.5-f77875c` | Earned + Remaining = Total on all 104 live rows and 3× on the seeded WO | none — automated |
| C30477 | [30477](https://shopview.testrail.io/index.php?/cases/view/30477) | PASS | `v3.5-f77875c` | 100 of 104 exact once the core charge is included | the 4 outliers all carry part RETURNS — **question for Chris**, not a defect |
| C30478 | [30478](https://shopview.testrail.io/index.php?/cases/view/30478) | PASS | `v3.5-f77875c` | 102 of 104 exact | as above |
| C30480 | [30480](https://shopview.testrail.io/index.php?/cases/view/30480) | PASS | `v3.5-f77875c` | a $224.93 unapproved line left Total unchanged at $449.85 | none — automated |
| C38890 | [38890](https://shopview.testrail.io/index.php?/cases/view/38890) | PASS (items 1, 2) | `v3.5-f77875c` | a still-running clock counted, and the earned share grew across three readings | **item 3, the CAP, was NOT exercised** |
| C30229 | [30229](https://shopview.testrail.io/index.php?/cases/view/30229) | DEVIATION (SV-8999) | `v3.5-f77875c` | item 1 passes (heading is "Inv. Hrs"); item 2 fails — value is hard-zero | Rule 61 — the suite reports a fix |
| C30230 | [30230](https://shopview.testrail.io/index.php?/cases/view/30230) | DEVIATION (SV-8999) | `v3.5-f77875c` | green/red/default cannot be exercised at all | Rule 61 |
| C30231 | [30231](https://shopview.testrail.io/index.php?/cases/view/30231) | DEVIATION (SV-8999) | `v3.5-f77875c` | S9-N1's worked-but-unbilled negative is suppressed to 0.0 | Rule 61 |
| C38894 | [38894](https://shopview.testrail.io/index.php?/cases/view/38894) | DEVIATION (SV-8999) | `v3.5-f77875c` | a clock edit cannot move a hard-zero figure | Rule 61 |
| C30218 | [30218](https://shopview.testrail.io/index.php?/cases/view/30218) | DEVIATION (SV-9001) | `v3.5-f77875c` | items 1, 2, 4 and the alignment half of 5 pass; item 3 fails — the four leading columns are merged, not blank | Rule 61 |
| C30221 | [30221](https://shopview.testrail.io/index.php?/cases/view/30221) | PASS | `v3.5-f77875c` | drill-down fires only on expand; a **row-level** `q-spinner` appears at 0 ms once the request is slowed to 3 s; detail row layout matches | none — automated |
| C30242 | [30242](https://shopview.testrail.io/index.php?/cases/view/30242) | PASS (item 1) | `v3.5-f77875c` | A→Z by display name with the saved view cleared, and the API default is `sortBy=rep_name` ascending | **item 2 (no active/inactive tiers) NOT exercised — no inactive contributor exists in range** |
| C30227 | [30227](https://shopview.testrail.io/index.php?/cases/view/30227) | PASS (item 1) | `v3.5-f77875c` | all three badges read from computed style: Paid `bg-teal-1 text-teal-9`, Partially Paid `bg-orange-1 text-orange-10`, Unpaid `bg-red-1 text-red-10` | **item 3 (dark mode) NOT exercised — the Light/Dark menu items could not be reached** |

### WHAT THIS QUEUE STILL GENUINELY OWES — three things, all named on their cases

1. **The per-line Inv. Hrs / Labor Earned CAP** (C30475 item 2, C38890 item 3). Needs `worked_hours >
   quoted_hours`. The smallest canned line on this estate is 18 minutes, and the *Edit labor* route needs
   a labour-price field name that is **still unknown** — `POST /api/work-orders/lines/change` takes
   **camelCase** keys (`lineName`, `timeEstimate`, `labourTypeId`) but every price key tried
   (`labourRate`, `labourPrice`, `fixedPrice`, `techTime`) returns
   **400 `{"error":"Labor or fixed prices must be set."}`**. Capture it from the dialog's own request.
   **A running clock was deliberately LEFT OPEN on WO S8582-16263** so that whoever returns after three
   hours have passed can read the cap straight off the report.
2. **C30242 item 2** — needs a contributor tagged `(Inactive)` in range, i.e. the Staff Deactivation flow
   (C30253–C30260) run first.
3. **C30227 item 3** — dark mode. The playbook says the control is
   `[data-test-id="profile_menu_button"]` → menu items `Light` / `Dark`; the button was found but the
   items were not, so this needs a second attempt, not new access.
