# Filters — changes made (finish3), 2026-08-12

## IN TESTRAIL

**64 × `update_case`, and nothing else.** Every one HTTP 200, re-GET and byte-compared over 28
fields, **0 mismatches, 0 collateral changes**. All three text fields on every payload.

**The only thing that moved on any case is Rule-54 SENTENCE 2** —
`Last checked against build v3.7-20e801b on 12 August 2026.` — on the **64 of 65 walked cases** where
there was a safe place to put it. **61 replaced** an existing sentence; **3 inserted** one
(C29558, C29600, C43563). Full list and proofs: `testrail-execution-log.md`.

**0 `add_case` · 0 `delete_case` · 0 `add_section` · 0 run writes · 0 results · 0 Jira creations.**

## IN THE APPLICATION (seeded data — authorised, and tagged)

| What | Why | State now |
|---|---|---|
| Customer **`ZZAUTOTEST Extremely Long Customer Name For Tag Truncation Check Limited Partnership`** (84 chars) | to answer C29568's ellipsis question, which the longest existing name (36 chars) cannot | **deleted** (delete 201, re-read 404) — its deletion is what gave **C29619** a URL naming a customer that no longer exists |
| Customer **`ZZAUTOTEST Remembered Deleted Value Customer`** | first attempt at C29616's precondition | left in place; the attempt failed its own guard |
| Customer **`ZZAUTOTEST Deleted Remembered Value Two`** | second attempt | left in place; failed its guard too |
| Customer **`ZZAUTOTEST Deleted Remembered Three`** | third attempt — **this one worked** | **deleted** (201 / 404), which is what made C29616 verifiable |
| The admin account's saved page preference | driven constantly by the cases themselves | **restored to a clean, valid state** — `filters: []`, `collapsed: false` — see below |

**No role, staff record or org setting was touched, anywhere, at any point.** `quick-login` and
`switch-user` were never called. Two customers remain (`…Value Customer`, `…Value Two`), both tagged
`ZZAUTOTEST` and both with zero work orders; cleanup was ruled unnecessary, and they are named here so
nobody wonders what they are.

### THE ONE THING WE PUT BACK, AND WHY IT MATTERED

A diagnostic wrote `filters={status:['review']}` into the admin's saved preference by direct `PUT`.
**`review` is not a valid status key on this build** (it is `ready_for_review`), and that value
**stopped the SPA sending its own save request at all** — three valid chip picks in a row changed the
URL and ticked correctly while no write went out.

**Restoring a valid preference made saving resume immediately** (PUT 200, `updatedAt` moved, the value
landed). The account was then left at **`filters: []`, `collapsed: false`**, verified by re-read.

**This is recorded prominently rather than tidied away for two reasons.** First, it nearly became a
reported defect — *"filter selections are not saved"* — on precisely the ground where the tester has
already failed C29614 and where SV-8871 and SV-8905 live; filing it would have muddied real tickets
the day before a release. Second, leaving it in place would have **broken filter saving for the human
tester using that account**, which is why it was restored even though cleanup was not required.

## CASE TEXT DELIBERATELY **NOT** CHANGED

| Case | What we found | Why it was left alone |
|---|---|---|
| [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) | Its expect-fail note describes the **single-filter** sheet while its own precondition opens the **All Filters** sheet, where all four expectations **pass**. | Rewriting a tester-facing expect-fail note hours before release risks **disarming a real signal** — the note names SV-8875, which is a genuine ticket about the other sheet. Reported with evidence and proposed wording (below) for the QA lead's decision. |
| [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | Its precondition **cannot be met on this branch** (`DELETE` on the preference → HTTP 405; a fresh user needs a barred staff-record edit). | Moving it to `AUTOMATION: HOLD` would take a case out of the automatable count **on our own initiative**. Raised instead. |
| [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | Expectations 1 and 4 are **not met by the build**. | **The case is right and the build is wrong**, so it keeps asserting its source and the tester fails it. A hold here would disarm a working case. |
| [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | The reopened sheet's title carries **no count**; the count is on the chip. | Same reason. |
| [C29568](https://shopview.testrail.io/index.php?/cases/view/29568) | The 84-character tag renders in full — but **it still fits the panel**, so no truncation was required. | **Not established either way.** The design does specify the ellipsis, so the case is properly sourced; "repairing" it would have broken a correct case. |
| [C29601](https://shopview.testrail.io/index.php?/cases/view/29601), [C29622](https://shopview.testrail.io/index.php?/cases/view/29622), [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | Deviations established by the previous pass. | Not re-litigated; the tester has each of them failed under a ticket. |

### PROPOSED REPLACEMENT NOTE FOR C29625 — *for the QA lead to accept or reject, not applied*

> **What you should see today:** inside the **All Filters** sheet this filter works as described
> above — you can search, pick more than one customer, remove one with the **x** on its tag, and
> nothing is applied until you tap **Apply Filters**.
> **A different sheet behaves differently and that is covered elsewhere:** if you tap the **Customer
> chip on the bar** instead of opening All Filters, that single-filter sheet applies your choice the
> moment you tap a name and closes — see https://shopview.atlassian.net/browse/SV-8875. **That is not
> what this test covers.**

## NO NEW CASE WAS AUTHORED

Authoring was permitted for the C29603 / Parts-Reports coverage gap. **It was not done, because there
is nothing to author it from** — `S1-R7` looks page-agnostic but sits under a story whose own
prerequisites read *"The user is on the Work Orders page"*, and the Parts/Reports behaviour is exactly
what Branko's write-up still owes (ten existing cases are already held on that dependency). Inventing
the expectation would breach Rules 57/58 and make the case a Rule-64 deletion candidate the moment
anyone checked it. Full reasoning: `DIVERGENCES.md` §7.
