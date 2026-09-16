# HANDOFF — Global Search: run the comparison suite, then raise what it finds

**From:** the session that built the suite · **To:** the session that will run it
**Written:** 15 September 2026 · **Every number below was re-checked live that day**
**Branch:** `claude/global-search-v1-baseline-6ax9ul` (this repo)

---

## 1 · WHAT THIS SUITE IS FOR, IN ONE SENTENCE

**To make sure nothing a customer could do in the OLD search has quietly stopped working in the new
one — and that nothing unwanted has been added either.**

That is the only question it asks. It is **not** a test of the new search's own features (the new
modal, quick actions, typo tolerance as a feature) — that belongs to the separate V2 test plan,
[SV-9175](https://shopview.atlassian.net/browse/SV-9175).

🔴 **The rule that governs everything here: the OLD product is the standard.** If a user could do it
before, they should be able to do it now. A decision in the new specification to remove something does
**not** mean the case is dropped — it means the Product Owner decides whether the loss is acceptable,
*after* the test has run. Never pass a case just because the new specification allows the new
behaviour.

---

## 2 · WHAT TO RUN

| | |
|---|---|
| **Test run** | **415** — https://shopview.testrail.io/index.php?/runs/view/415 |
| **Tests in it** | **164** |
| **Cases** | **65** — 64 in section **6769**, 1 in section **8056** |
| **Every case is in the run** | verified live 15 September |

Sections: 6769 is the main comparison set. 8056 holds one case derived from the old version's own
automated tests.

---

## 3 · BEFORE YOU START — a five-second data check

**Open global search and type `ZZAUTOTEST`.** You should get several groups of results — Work orders,
Customers, Assets, Parts, Vendors, Part sales. Verified live: **14 results across 6 groups.**

**If you get nothing at all, a new build has wiped the test data.** Stop and re-seed (§5). It is one
command and takes about a minute.

🔴 **Do NOT create the missing records by hand.** Records made by hand come out slightly different
every time — a different postcode, a different spelling — and a test that passes against the wrong
data is worse than one that fails, because it says everything is fine when nothing was really checked.

This same check is written at the top of all 65 cases, so a tester who starts mid-suite still sees it.

---

## 4 · 🔴 HOW TO MARK A RESULT — three rules

### Rule one · Thirteen cases are Product Owner decisions. Run them, then mark **Blocked** — never Failed.

These test things the old version did that the new specification deliberately changed. The test still
runs; the verdict is not yours or mine to give. Mark **Blocked**, write down exactly what you typed and
what came back, and flag it. **Do not raise a defect** — the ticket is a question for the Product
Owner, and several are already filed.

### Rule two · Two cases are expected to fail, and say so on the case.

[C55685](https://shopview.testrail.io/index.php?/cases/view/55685) — typing a name also returns other,
differently spelled names. **The ticket is already open: [SV-10025](https://shopview.atlassian.net/browse/SV-10025).**
Mark it **FAILED**, write down the rows that did not contain what you typed, and **raise nothing new.**
If it fails *differently*, that is a new problem — report it. If it *passes*, the fix shipped; say so.

[C55686](https://shopview.testrail.io/index.php?/cases/view/55686) — its safety net, and should
**PASS**: the record you actually typed must be listed first. If this one fails it is more serious than
SV-10025 and needs reporting straight away.

### Rule three · Verified means seen.

Only mark Pass or Fail on something you watched happen, with the evidence captured in that sitting.
Anything you did not observe is **Blocked with the reason**, never a guess.

---

## 5 · THE TEST DATA — one command, about ninety seconds

```bash
cd build/global-search/seeding
python3 seed.py --check      # reports only, changes nothing
python3 seed.py --confirm    # creates what is missing, repairs what is wrong
```

Sign-in cookies live in `/tmp/qa/cookies.json` (`sv_sso_session`, `PHPSESSID`, `cf_clearance`),
`chmod 600`, never committed. The seeder logs itself in and sets the branch.

**Eleven records, verified live 15 September — 11 of 11 present, every declared field checked, zero
gaps:**

| Record | |
|---|---|
| Customer `ZZAUTOTEST Bridgeport Hauling` | ✅ |
| Its contact **Marlene Okonkwo, Dispatch Supervisor** | ✅ |
| Asset unit `ZZT-4471` — a 2019 Freightliner Cascadia | ✅ |
| Four work orders for that customer | ✅ |
| Vendor `ZZAUTOTEST Kestrel Parts Supply` | ✅ |
| Catalogue-only part `ZZT-77-3300` | ✅ |
| Catalogue source part for the stocked one | ✅ |
| Stocked part `ZZT-88-4412` — 25 in bin H3B | ✅ |
| Customer `ZZAUTOTEST Marlene Freight Lines` | ✅ |
| Customer `ZZAUTOTEST Darlene Cartage` — one letter away, deliberately | ✅ |
| A part sale | ✅ **SV-10031 is fixed** |

🔴 **Read the report, not just the last line.** It ends in three blocks and they are not the same
thing:

| Block | What it means | What to do |
|---|---|---|
| `fields n/n ✓` | present **and** carrying every declared value | nothing |
| **DATA GAPS** | the record holds something different | `--confirm` repairs it. **A case searching this finds nothing and it is NOT a product fault** |
| **NOT COMPARED** | could not be checked at all | 🔴 never read as clean |

**If a new case needs data:** add one entry to `seed-manifest.json` and re-run. Never edit the seeder.

---

## 6 · 🔴 EIGHT TRAPS THAT COST REAL TIME — please don't repeat them

1. **A 409 on every call is a rotated session cookie you failed to capture**, not an expired login.
   Read `Set-Cookie` on every response and carry the new `PHPSESSID` forward.
2. **After any fresh sign-in, set the branch** (`POST /api/iam/change-location`) *before* judging
   anything missing. Wrong branch looks exactly like missing data.
3. **`?search=` on some list endpoints silently returns nothing.** Search for a record you know
   exists first. If the control comes back empty, the probe is broken — throw the verdict away.
4. **A 2xx is not proof a write landed.** `/api/vehicles/change` answers 201 to a model *name* and
   changes nothing. Read the record back, every time.
5. **The header search box is a BUTTON, not a typeable field.** Click it (or Ctrl+K) to open the
   modal, then type into the modal's own input. Typing at the page does nothing.
6. **Job numbers change with every build.** No case hardcodes one any more — they tell you to type
   `ZZAUTOTEST`, read a number off the screen and use that. Please keep it that way.
7. **A part is only findable if it is STOCKED**, not merely catalogued. That single fact decides how
   you read every parts result.
8. **Parts follow the branch in the new version** where they used to be company-wide.
   [C45151](https://shopview.testrail.io/index.php?/cases/view/45151) tests exactly this and is
   expected to fail on its parts half.

More, with the exact evidence: `build/APP-ACTIONS-PLAYBOOK.md` §Q1–Q10.

---

## 7 · 🔴 SETTLING ANY ARGUMENT ABOUT THE OLD VERSION — don't guess, run it

`build/global-search/v1-capability-evidence/` holds **the old search re-created from its own code and
made runnable**, plus a register of all 72 capabilities: **53 proved by running, 0 failing, 19 resting
on a code citation** because they were never about matching text.

```bash
cd build/global-search/v1-capability-evidence
python3 prove_all_v1_capabilities.py
```

To answer a specific question:

```python
from v1_search import customer, finds
c = customer("Peterson Trucking", telephone="(419) 555-0143")
finds("555-0143", [c])     # True  — the old version DID find a customer from part of its number
finds("4195550143", [c])   # False — it did NOT match plain digits
```

🔴 **Use it before writing "the old version did X" in any ticket.** Two of six tickets filed on 15
September claimed more than the old version actually did, and this is what catches that.

**The one thing most often got wrong:** there were **two matching passes**. Pass one compared the typed
text **with** its spaces against the record's **visible name**, only from the **start**. Pass two
compared it **without** spaces against one combined text, **anywhere** inside. So `2019 Freightliner`
matched on pass one, as a prefix of `2019 Freightliner Cascadia`.

---

## 8 · WHAT TO RAISE, AND HOW

**Already filed — check before raising anything, and do not duplicate:**

| Ticket | What it covers |
|---|---|
| [SV-10025](https://shopview.atlassian.net/browse/SV-10025) | typing a name returns differently spelled names |
| [SV-10031](https://shopview.atlassian.net/browse/SV-10031) | part sales could not be created — **fixed** |
| [SV-10055](https://shopview.atlassian.net/browse/SV-10055) | a vehicle not found by year **with its make** |
| [SV-10056](https://shopview.atlassian.net/browse/SV-10056) | a new job not findable for ~85 seconds |
| [SV-10057](https://shopview.atlassian.net/browse/SV-10057) | customer phone — full number works now; **part** of it still does not |
| [SV-10058](https://shopview.atlassian.net/browse/SV-10058) | part of a chassis number finds nothing |
| [SV-10059](https://shopview.atlassian.net/browse/SV-10059) | recent list does not return after a no-match |
| [SV-10060](https://shopview.atlassian.net/browse/SV-10060) | mid-word search works on some fields, not others |

**Candidates not yet filed**, with bodies ready to paste:
`build/global-search/v1-parity-audit-2026-09-14/PO-TASK-TICKET-CANDIDATES.md` and
`PO-TICKET-BODIES.md`.

**Before filing anything new:**
- 🔴 **Never file an API-related ticket without asking the QA lead first** — every time, even inside
  an approved batch.
- 🔴 **No Jira ticket without his explicit permission, asked for and granted per ticket.** An earlier
  batch approval never covers a later one.
- **Shape:** a `Story Defect` for a break, a `Task` for a Product Owner decision. Parent is the owning
  **story** (an epic parent is rejected), priority **Medium** (never High), and link `relates to` the
  owning story.
- **Check the record carries the value first.** Four of the things that looked like faults on
  14 September were missing data.

---

## 9 · THE ENVIRONMENT

| | |
|---|---|
| App | `sv9160.qa.shopview.com` |
| API | `sv9160api.qa.shopview.com` |
| Branch | goes down and is redeployed often. **Prove it with a control** — production `app.shopview.com` through the same path — before calling anything broken |
| Second branch | Staging Heavy Duty - 9919 and Staging Lethbridge - 4310, for the location cases |

---

## 10 · HOW TO REACH ME

There is **no live message channel between sessions.** Do not address a reply to a session name — they
change, and the message goes nowhere.

**Write anything you need me to see into this repository and commit it**, on your own branch, under
`build/global-search/`. Name the file so it is obvious (for example
`QUESTIONS-FOR-THE-SUITE-AUTHOR-2026-09-16.md`). The QA lead relays between us.

**Please don't edit cases in sections 6769 or 8056.** If one looks wrong, say so in a file and I will
fix it — touching a case means re-verifying the whole case, and all 65 were verified on 15 September.

**Union-only when syncing the run.** A partial case list on an update **deletes tests and their
results**. The run went 139 → 164 across several syncs with nothing lost; please keep it that way.

---

## OUTSTANDING — what I need back from you

1. **Run the suite and record honest verdicts** — Blocked where it is a Product Owner decision, Failed
   only where it is a genuine break.
2. **Run the first four cases early** ([C55658](https://shopview.testrail.io/index.php?/cases/view/55658)
   to [C55661](https://shopview.testrail.io/index.php?/cases/view/55661)). Their expected results are
   **predictions from the old code, not observations** — they are the ones most likely to need
   correcting, and the sooner that is known the better.
3. **Tell me anything the suite cannot answer** — a case whose steps do not work, data that is missing,
   a result neither of us predicted. Write it into the repo.
4. **Nothing is blocked.** Every case is runnable, every record is seeded, and SV-10031 is fixed.
