# The 17 that cannot be run

**Ten of the seventeen are waiting on one thing from you: a decision about work that was cancelled.** The other seven are a mix.

## A. Ten checks test work that was cancelled — you decide: retire them, or take them out of the run

**Eight of them: the buttons that appear when you hover over a result.** The piece of work that would have built them was cancelled. The buttons do not exist, so the checks can never pass as written.

- https://shopview.testrail.io/index.php?/tests/view/2723936 — hovering a job shows "Add new line"
- https://shopview.testrail.io/index.php?/tests/view/2723937 — hovering a vehicle shows "New work order" and history
- https://shopview.testrail.io/index.php?/tests/view/2723938 — hovering a customer shows "New work order"
- https://shopview.testrail.io/index.php?/tests/view/2723939 — hovering a part shows "View part history"
- https://shopview.testrail.io/index.php?/tests/view/2723940 — hovering a supplier shows "Add contact"
- https://shopview.testrail.io/index.php?/tests/view/2723941 — a part row shows only "View part history"
- https://shopview.testrail.io/index.php?/tests/view/2723942 — hover buttons never delete anything
- https://shopview.testrail.io/index.php?/tests/view/2723943 — every type has its hover buttons

**One: the old list-page search being replaced by the new one.** That work was cancelled too.
- https://shopview.testrail.io/index.php?/tests/view/2723966

**One: recording what people search for.** Cancelled, deliberately, and you already confirmed that.
- https://shopview.testrail.io/index.php?/tests/view/2728118

## B. Two are waiting on a wording decision that is yours

Both check what someone without money-access should see. **Their expected wording was changed on the 20th and you are holding whether to put it back** — so judging the product against wording that is itself under review would mean nothing.

- https://shopview.testrail.io/index.php?/tests/view/3077894 — hiding the total on a supplier invoice
- https://shopview.testrail.io/index.php?/tests/view/3077895 — records a person cannot see are not counted in the headings

## C. Two are waiting on a login for the second shop

Covered in my last message. The jobs are already seeded at both shops.

- https://shopview.testrail.io/index.php?/tests/view/2738733 — moving shop refreshes what you see
- https://shopview.testrail.io/index.php?/tests/view/2983591 — after moving, the old shop's work disappears

## D. One needs somebody to mark a supplier invoice as paid

Half of it is confirmed — invoices come back newest first. The other half cannot be seen, because **every supplier invoice on this test site is unpaid**. I tried six ways to pay one and could not.

- https://shopview.testrail.io/index.php?/tests/view/2728116

## E. One is a gap in the written requirements — a product owner question

The requirements describe purchase orders as either still-ordered or received. **The product has a third state in between, "Partial Delivery", which the requirements never mention**, so there is no stated right answer for where it should rank.

- https://shopview.testrail.io/index.php?/tests/view/2728115

## F. One waits on a fix already with the developers

It starts by clicking a "Show all" link on a group heading, and that link is not in the product. That absence is already reported and being worked on.

- https://shopview.testrail.io/index.php?/tests/view/2723896

---

# The 14 that failed, and whether their report is ready for QA

**None of them is ready for you to test yet.**

| What fails | Test | Report | Ready for QA? |
|---|---|---|---|
| The "Show all" link is missing from group headings | https://shopview.testrail.io/index.php?/tests/view/2723895 | SV-10159 | **No — still being worked on** |
| A part sale row shows no total price | https://shopview.testrail.io/index.php?/tests/view/2723906 | SV-10163 | **No — still being worked on** |
| Prices missing for someone allowed to see them | https://shopview.testrail.io/index.php?/tests/view/3050566 | SV-10163 | **No — same report, still being worked on** |
| "No results" does not name the tab you are in | https://shopview.testrail.io/index.php?/tests/view/2723935 | SV-10181 | **No — still being worked on** |
| A catalogue part that was never stocked cannot be found | https://shopview.testrail.io/index.php?/tests/view/2959367 | SV-10001 | **No — the developers are themselves blocked on it** |
| A fragment from the middle of a word finds nothing | https://shopview.testrail.io/index.php?/tests/view/2977472 | SV-10060 | **No — the developers are blocked, and it is waiting on your answer to Sinisa** |
| A vehicle cannot be found by year and make together | https://shopview.testrail.io/index.php?/tests/view/2959371 | SV-10055 | **No — accepted but not started** |
| A correct spelling brings back unrelated names | https://shopview.testrail.io/index.php?/tests/view/2984234 | SV-10025 | **No — accepted but not started** |
| Counts read higher than 20 | https://shopview.testrail.io/index.php?/tests/view/2868064 | SV-10320 | **You closed it last night — see below** |
| Nothing recorded when a result is chosen | https://shopview.testrail.io/index.php?/tests/view/2738741 | none | deliberate; nothing to fix |
| No count beside the kept search text | https://shopview.testrail.io/index.php?/tests/view/2723931 | none | our own test is out of date |
| Recent items don't come back after a fruitless search | https://shopview.testrail.io/index.php?/tests/view/2981982 | none | needs the product owner's ruling |
| Typing a town doesn't return the seeded customer | https://shopview.testrail.io/index.php?/tests/view/2959359 | none | our own test data crowds it out |
| The most-recently-changed rule | https://shopview.testrail.io/index.php?/tests/view/3051908 | none | cannot be proved; a product owner question |

## ⚠️ The report I raised this morning was closed last night as no longer relevant

You closed it at 22:38 with no reason written down. **If it was closed because the counting is acceptable, tell me and I will mark that check as passing and stop reporting it. If it was closed by mistake, it needs reopening** — the count still reads 111 where the requirement says nothing may read above 20.

---

# What is blocked on you, shortest first

1. **Ten checks** — say whether the cancelled work's checks should be retired or taken out of the run. One answer clears ten.
2. **Why you closed this morning's report.** One line. It decides whether one check passes or stays failing.
3. **Two checks** — the money-access wording you are holding.
4. **Two checks** — a login that sits in the second shop.
5. **One check** — somebody with accounting access marks one supplier invoice as paid. One minute of their time.
6. **One check** — ask the product owner where a part-delivered purchase order should rank.
7. **One older question** — Sinisa answered you about the word-fragment search on the 16th and you asked whether it is acceptable as it is. That answer is still outstanding and a report is sitting blocked behind it.

Nothing else is waiting on you.
