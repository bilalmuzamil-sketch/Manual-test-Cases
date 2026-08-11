# Classification — who set the Automated flag on every Filters and Report Suite case that carries it

**Date:** 2026-08-11 · **Scope of this pass:** Filters and Report Suite only. **Zero TestRail writes
were made against Schedule** (a sibling worker is mid-pass on it — see `SCHEDULE-STAGED.md`).

## THE HEADLINE, AND IT IS THE OPPOSITE OF WHAT THE PASS WAS PROVISIONED FOR

**There is nothing to correct in Filters or the Report Suite. All 44 cases that read `Automated` were
set that way by Vladimir Tomovic himself, and not one of them came from our `add_case` default.**

So this pass **wrote nothing to TestRail** — `0 update_case`, `0` of anything else — and that is the
correct outcome, not a shortfall. Rule 38 is explicit: another author's deliberate decision is not
ours to reverse. Clearing a flag Vlad set would break his automation silently, in a system we do not
own.

---

## 1. The population, established live today (Rule 12 — not taken from the earlier survey)

`get_sections/1&suite_id=1` (626 sections, fully paged) → the three group subtrees; then
`get_cases/1&suite_id=1` (4,089 cases, fully paged) filtered to those subtrees. Raw counts, by
project × flag × author:

| Project | Ours (`created_by = 3`) at `1` Not Automated | Ours at `3` Automated | Foreign |
|---|---:|---:|---:|
| **Filters** | 110 | **4** | 5 (Ahtasham Amjad, `created_by = 7`, flag unset) |
| **Report Suite** | 436 | **40** | 12 (Vladimir Tomovic, `created_by = 1`, flag `3`) |
| Schedule *(out of scope, counted for proof only)* | **174** | **0** | 0 |
| **Total ours** | 720 | **44** | 17 |

**Two things worth reading off that table.**

**(a) Schedule already reads 174 of 174 Not Automated.** The 31 born-Automated Schedule cases were
corrected earlier today by the preceding pass
(`build/automated-flag-and-c30041-2026-08-11/FLAG-CORRECTIONS.md`), and this live read confirms the
correction landed and held. **So there is no Schedule backlog to stage** — see `SCHEDULE-STAGED.md`,
which says so with the numbers rather than leaving a follow-up pass to discover it.

**(b) The 44 candidates split 4 / 40, exactly as the earlier survey found.** The figures agreeing is
worth noting, but **the verdicts below were derived per case from history and would have been reported
as they came out whatever the earlier survey said** (Rule 50 — exhaustive, then exact).

---

## 2. How each verdict was reached

`get_history_for_case/<id>`, fully paged, for **all 44** — no sampling. TestRail's history records
each field change with the field name, the old and new values, the user id and the timestamp; the
entries were filtered to changes of `custom_atmstatus` itself, and every user id was resolved through
`get_user/<id>` rather than assumed.

| | Cases |
|---|---:|
| Candidates examined | **44** |
| …carrying at least one `custom_atmstatus` history entry | **44** |
| …carrying **no** `custom_atmstatus` history entry (⇒ born from our `add_case` default) | **0** |
| **Distinct users who have ever changed the flag on any of the 44** | **1 — Vladimir Tomovic (user id 1)** |
| **Corrected by this pass** | **0** |
| **Left alone under Rule 38** | **44** |
| Ambiguous, reported rather than written | **1 (C38877 — see §4)** |

Flag-change counts across the 44: **42 cases changed once, 1 changed twice, 1 changed three times** —
and **all 44 have `Automated` as the newest value**, so in every case the current value is Vlad's most
recent deliberate act.

---

## 3. The 44 cases, per case, with the evidence

| Case | Link | Project | Flag-change history (who · when · old → new) | Verdict | Action |
|---|---|---|---|---|---|
| C29600 | https://shopview.testrail.io/index.php?/cases/view/29600 | Filters | Vladimir Tomovic 2026-08-06T11:30:28Z Not Automated → Automated · Vladimir Tomovic 2026-08-07T07:30:16Z Automated → Not Automated · Vladimir Tomovic 2026-08-08T11:12:30Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C29614 | https://shopview.testrail.io/index.php?/cases/view/29614 | Filters | Vladimir Tomovic 2026-08-06T11:30:30Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C29623 | https://shopview.testrail.io/index.php?/cases/view/29623 | Filters | Vladimir Tomovic 2026-08-07T07:30:28Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C38877 | https://shopview.testrail.io/index.php?/cases/view/38877 | Filters | Vladimir Tomovic 2026-08-05T13:08:49Z Automated → Not Automated · Vladimir Tomovic 2026-08-06T11:30:29Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30107 | https://shopview.testrail.io/index.php?/cases/view/30107 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:51Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30114 | https://shopview.testrail.io/index.php?/cases/view/30114 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:52Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30121 | https://shopview.testrail.io/index.php?/cases/view/30121 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:49Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30123 | https://shopview.testrail.io/index.php?/cases/view/30123 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:50Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30138 | https://shopview.testrail.io/index.php?/cases/view/30138 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:51Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30217 | https://shopview.testrail.io/index.php?/cases/view/30217 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:52Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30221 | https://shopview.testrail.io/index.php?/cases/view/30221 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:53Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30262 | https://shopview.testrail.io/index.php?/cases/view/30262 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:55Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30314 | https://shopview.testrail.io/index.php?/cases/view/30314 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:54Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30326 | https://shopview.testrail.io/index.php?/cases/view/30326 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:49Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30328 | https://shopview.testrail.io/index.php?/cases/view/30328 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:45Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30333 | https://shopview.testrail.io/index.php?/cases/view/30333 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:45Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30338 | https://shopview.testrail.io/index.php?/cases/view/30338 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:48Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30346 | https://shopview.testrail.io/index.php?/cases/view/30346 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:47Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30352 | https://shopview.testrail.io/index.php?/cases/view/30352 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:44Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30353 | https://shopview.testrail.io/index.php?/cases/view/30353 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:46Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30390 | https://shopview.testrail.io/index.php?/cases/view/30390 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:46Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30398 | https://shopview.testrail.io/index.php?/cases/view/30398 | Report Suite | Vladimir Tomovic 2026-08-10T12:49:00Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30399 | https://shopview.testrail.io/index.php?/cases/view/30399 | Report Suite | Vladimir Tomovic 2026-08-10T12:49:00Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30401 | https://shopview.testrail.io/index.php?/cases/view/30401 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:55Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30404 | https://shopview.testrail.io/index.php?/cases/view/30404 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:58Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30410 | https://shopview.testrail.io/index.php?/cases/view/30410 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:57Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30424 | https://shopview.testrail.io/index.php?/cases/view/30424 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:57Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30429 | https://shopview.testrail.io/index.php?/cases/view/30429 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:59Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30449 | https://shopview.testrail.io/index.php?/cases/view/30449 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:56Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30452 | https://shopview.testrail.io/index.php?/cases/view/30452 | Report Suite | Vladimir Tomovic 2026-08-10T12:49:01Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30460 | https://shopview.testrail.io/index.php?/cases/view/30460 | Report Suite | Vladimir Tomovic 2026-08-10T12:49:03Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30462 | https://shopview.testrail.io/index.php?/cases/view/30462 | Report Suite | Vladimir Tomovic 2026-08-10T12:49:01Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30488 | https://shopview.testrail.io/index.php?/cases/view/30488 | Report Suite | Vladimir Tomovic 2026-08-10T12:49:03Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30498 | https://shopview.testrail.io/index.php?/cases/view/30498 | Report Suite | Vladimir Tomovic 2026-08-10T12:49:02Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30508 | https://shopview.testrail.io/index.php?/cases/view/30508 | Report Suite | Vladimir Tomovic 2026-08-10T12:49:05Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30510 | https://shopview.testrail.io/index.php?/cases/view/30510 | Report Suite | Vladimir Tomovic 2026-08-10T12:49:06Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30515 | https://shopview.testrail.io/index.php?/cases/view/30515 | Report Suite | Vladimir Tomovic 2026-08-10T12:49:05Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30518 | https://shopview.testrail.io/index.php?/cases/view/30518 | Report Suite | Vladimir Tomovic 2026-08-10T12:49:07Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30527 | https://shopview.testrail.io/index.php?/cases/view/30527 | Report Suite | Vladimir Tomovic 2026-08-10T12:49:04Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30535 | https://shopview.testrail.io/index.php?/cases/view/30535 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:40Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30557 | https://shopview.testrail.io/index.php?/cases/view/30557 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:42Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30563 | https://shopview.testrail.io/index.php?/cases/view/30563 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:41Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30569 | https://shopview.testrail.io/index.php?/cases/view/30569 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:43Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |
| C30583 | https://shopview.testrail.io/index.php?/cases/view/30583 | Report Suite | Vladimir Tomovic 2026-08-10T12:48:43Z Not Automated → Automated | Deliberately set by Vladimir Tomovic (not us) | LEFT ALONE (Rule 38) |


---

## 4. The one genuinely ambiguous case — reported, not resolved

**C38877 (Filters)** — https://shopview.testrail.io/index.php?/cases/view/38877

Its history reads:

| When (UTC) | Who | Change |
|---|---|---|
| 2026-08-05T13:08:49Z | Vladimir Tomovic | Automated → Not Automated |
| 2026-08-06T11:30:29Z | Vladimir Tomovic | Not Automated → Automated |

**His FIRST recorded act on it takes the flag AWAY from Automated — which means it was already
`Automated` before any human touched it.** Its origin is therefore most likely our own `add_case`
default, exactly like the 31 Schedule cases. **We cannot prove that** — TestRail's history records
changes, not the creation event (the standing limitation of every user-attributed claim we make).

**It is left untouched regardless, and the reason is not the ambiguity — it is that his LATEST
deliberate act, on 6 August, set it back to Automated.** Whatever the value started as, what it reads
today is his decision. Recorded here so the QA lead sees it rather than having it averaged away.

---

## 5. Nothing belonging to another author was touched (Rule 38)

| | |
|---|---|
| Foreign cases in scope | **17** — 12 Report Suite (`created_by = 1`, Vladimir Tomovic, flag `3`) + 5 Filters (`created_by = 7`, Ahtasham Amjad, flag unset: C43576, C43577, C43578, C43579, C43580) |
| Written to by this pass | **0** |
| Proof | included in `snapshots/CASES-PRE.json` and re-read into `snapshots/CASES-POST.json`, compared **field by field including `updated_on` and `updated_by`** |

---

## 6. What would make this classification wrong

Stated rather than glossed, because all three are real:

1. **The QA lead works in the TestRail UI under our own account (user 3).** Had he set a flag by hand
   it would be indistinguishable from ours. No entry here is attributed to user 3 at all — every one
   of the 44 is user 1 — so it does not affect the result, but it is the standing limit.
2. **"No history entry" would prove the value has not moved since creation, not what set it.** That
   branch produced **zero cases here**, so the question does not arise in this pass; the
   `add_case`-hardcoding evidence in `CODE-FIX.md` is what carried it on Schedule.
3. **The flag is read as it stands today.** A case Vlad unmarks tomorrow leaves this population, and
   one he marks joins it. The verdicts are true as at the timestamps in §3.
