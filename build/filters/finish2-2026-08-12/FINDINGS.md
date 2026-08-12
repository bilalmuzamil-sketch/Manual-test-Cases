# Filters — findings (finish2), 2026-08-12

Build `v3.6-3e9dd6d`, unmoved. Location **Staging Heavy Duty - 9919**. 0 bridge errors on every run.

---

## 1 · A CASE MARKED FAILED THAT PASSES AS WRITTEN — [C29603](https://shopview.testrail.io/index.php?/cases/view/29603)

**This is the most important thing in this report.**

The tester failed C29603 today and filed **SV-8905**, with the comment:

> *"Collapsed state is remembered on Work Orders page, but not on Parts/Reports page"*

**But C29603 only ever exercises the Work Orders page.** Its steps say *"Navigate to another page
(for example open a work order, or go to Customers). Return to the Work Orders page."* — and on that
path the build is **correct**, which we drove end to end today:

| Driven | Result |
|---|---|
| Collapse → Customers → back to Work Orders | **still collapsed** (0 chips) |
| Expand → Customers → back to Work Orders | **still expanded** (5 chips) |
| Saved preference | carries `"collapsed": false` — the state is stored server-side |

**Two things follow, and they point in opposite directions:**

1. **The Failed result on this case is not supported by this case.** A reader checking SV-8905
   against C29603 will find the case passing and the ticket standing on something the case never
   claims. That is exactly the shape of a challengeable ticket.
2. **The behaviour he found is probably real, and NOTHING covers it.** No Filters case asserts that
   the collapsed state persists on **Parts** or **Reports** pages. That is a genuine coverage gap,
   and it was found by the tester, not by us.

**Not acted on** — a new case is authoring work and the ticket is his and the QA lead's.

---

## 2 · THE PERSISTENCE RULE, ESTABLISHED PRECISELY — and it corrects one of our own readings

The build saves your filters **only when you set them through the filter bar**:

| How the filter is applied | Stored in `/api/users/me/preferences/work-orders-list`? | Restored on a plain return? |
|---|---|---|
| By URL — `?status=approved` | **No** — `filters` stays `[]` | No |
| By clicking the chip and ticking a value | **Yes** — `{"status":["approved"]}` | **Yes** |

**Why this matters:** an earlier probe in this very pass applied the filter **by URL**, saw it not
restored, and read that as corroborating the persistence defect behind **SV-8828**. It was **our
probe's artefact**. Driven the way a tester drives it, expectation 1 of
**[C29614](https://shopview.testrail.io/index.php?/cases/view/29614)** passes. The wrong reading is
recorded and corrected in `DIVERGENCES.md` §2 rather than quietly dropped.

**It is also the mechanism behind two clean passes:** a shared link changes what you see **without
touching what you have saved**, which is precisely what
**[C38879](https://shopview.testrail.io/index.php?/cases/view/38879)** asserts — the saved preference
did not move, same `updatedAt`, while a link carrying `?status=paid&vehicleHere=1` was open.

---

## 3 · THE FIVE FAILURES THE TESTER FILED TODAY — each one checked against the build

He filed five fresh tickets off plain `READY` cases. Had any of those cases been wrong, we would
have caused a bogus ticket the day before release.

| Case | Ticket | What the build actually does | Is the case sound? |
|---|---|---|---|
| [C29601](https://shopview.testrail.io/index.php?/cases/view/29601) | SV-8903 | Bar hides, table rises 40 px — **expectations 1–2 pass**. The state class is applied **while EXPANDED**, the inverse of expectation 3; colour and background are identical in both states and there is no `aria-pressed`. | **Yes** — runnable, correctly sourced |
| [C29603](https://shopview.testrail.io/index.php?/cases/view/29603) | SV-8905 | **Passes as written** — see §1 | **Yes, and the failure is out of its scope** |
| [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | SV-8828 | Expectation 1 **passes** via the chip path; expectations 2–3 not established | **Yes** — see §2 |
| [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) | SV-9000 | **No drag handle**; title **left-aligned**, 137 px off centre; rows carry **no filter icons** | **Yes** — three parts genuinely unmet |
| [C29628](https://shopview.testrail.io/index.php?/cases/view/29628) | SV-8846 | Phone chip reads **`Status (1)`** where desktop reads **`Status : Approved`** — a count, not the value | **Yes** |

**So four of the five are squarely evidenced, and the fifth (C29603) is the one to look at.**

---

## 4 · C38877 ESTABLISHED AFTER THREE FAILED ATTEMPTS, AND THE REASON IS REUSABLE

**[C38877](https://shopview.testrail.io/index.php?/cases/view/38877)** step 3 had defeated two
passes. The cause was never the product: the status options are
**`DIV[data-test-id^="filter_option_"]`**, not `label` and not `.q-item`. Both wrong selectors match
nothing, so the check **reported "no options" and could not fail** — the worst kind of check.

Found by **dumping the menu's DOM** instead of guessing a fourth selector. With the right selector:
ticking **Imported** → `?status=imported`, chip `Status : Imported`, all four other chips
`disabled=true` at `opacity 0.7`; then picking **Approved** **deselects Imported**. The exclusivity
rule holds.

**This belongs in `build/APP-ACTIONS-PLAYBOOK.md` §J. Not edited from this worker — flagged.**

---

## 5 · THE PHONE SHEET'S EXCLUSIVITY IS APPLIED AFTER *APPLY*, NOT INSIDE THE SHEET

Driving **[C43563](https://shopview.testrail.io/index.php?/cases/view/43563)** steps 1–5: with
Imported ticked **inside** the open sheet, the other five rows stay fully enabled (`opacity 1`, no
`aria-disabled`). Only after **`Apply Filters`** do the page chips come back greyed at `opacity 0.7`.
Worth the tester's eye, because step 3 asks them to *"look at the other filter rows in the sheet …
and try to use one of them"* — at that moment they will look enabled.

---

## 6 · CONFIRMATIONS WORTH RECORDING

- **[C38898](https://shopview.testrail.io/index.php?/cases/view/38898) is exact to the pixel** — the
  search box opens at **180 px**, the figure the case quotes from the design, with placeholder
  **`Type to search`**; a 161-character sentence left it at 180 px and moved **no** toolbar button.
- **[C38896](https://shopview.testrail.io/index.php?/cases/view/38896) passes on all four
  expectations**, including the one no pass had driven: clicking **`Back To My Saved Filters`**
  restores your own view **and the control then disappears**.
- **[C38893](https://shopview.testrail.io/index.php?/cases/view/38893) passes end to end** — and the
  tester marked it **Passed at 12:41Z**, independently, while this pass was running.
- **[C38895](https://shopview.testrail.io/index.php?/cases/view/38895) step 1 confirmed** —
  `PUT /api/users/me/preferences/work-orders-list` → **200** on a real chip change.

---

## 7 · WHAT THE TESTER HAS DONE, AS AT 12:44Z

**75 Passed · 8 Failed · 1 Blocked · 36 Untested** of 120 tests in run 352. He is close to finished,
and three of those results landed **during this session**. **Nothing of ours was written to the run.**

---

## OUTSTANDING — what I need from you

1. **[C29603](https://shopview.testrail.io/index.php?/cases/view/29603) / SV-8905 — your call.** The
   case passes as written; the defect he describes is on Parts/Reports pages, which **no case
   covers**. Either the result moves, or the ticket's evidence should point somewhere else, or a new
   case is owed. **Authoring one is not blocked by the creation hold — only Jira is — but it is not
   mine to start unasked at this hour.**
2. **[C38897](https://shopview.testrail.io/index.php?/cases/view/38897) still has no ticket** and is
   the one real unticketed deviation on this project. Written up and ready to file the moment the
   hold lifts.
3. **[C29625](https://shopview.testrail.io/index.php?/cases/view/29625)'s expect-fail note describes
   the single-filter sheet while the case's precondition is the All Filters sheet.** The two behave
   differently, and the tester has marked it Passed.
4. **[C29581](https://shopview.testrail.io/index.php?/cases/view/29581) and
   [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) need a staff record
   deactivated** — barred for us, ordinary work for a tester.
5. **Branko's Parts and Reports write-up** — still the blocker behind the held cases, outstanding
   since 27 July.
