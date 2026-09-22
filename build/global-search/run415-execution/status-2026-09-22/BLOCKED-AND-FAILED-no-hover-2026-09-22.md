Excluding the eight hover checks — the whole "Quick Actions on Hover" folder, all of which were blocked. That takes the run from 203 to **195 checks**.

**Five other checks mention hovering in passing** (a phone number that appears on hover, for instance). They are not hover tests and they all pass, so I have left them in. Nothing has been removed from the run itself — say the word if you want them taken out for real.

# Where the run stands without them

**172 pass · 14 fail · 9 cannot be run · nothing untested.**

---

# The 9 that cannot be run

## A. Two test work that was cancelled — you decide: retire them, or take them out of the run

- https://shopview.testrail.io/index.php?/tests/view/2723966 — the old list-page search being replaced by the new one. That work was cancelled.
- https://shopview.testrail.io/index.php?/tests/view/2728118 — recording what people search for. Cancelled deliberately, and you already confirmed it.

## B. Two are waiting on a wording decision that is yours

Both check what someone without money-access should see. **Their expected wording was changed on the 20th and you are holding whether to put it back** — so judging the product against wording that is itself under review would mean nothing.

- https://shopview.testrail.io/index.php?/tests/view/3077894 — hiding the total on a supplier invoice
- https://shopview.testrail.io/index.php?/tests/view/3077895 — records a person cannot see are not counted in the headings

## C. Two are waiting on a login for the second shop

The jobs are already seeded at both shops and waiting.

- https://shopview.testrail.io/index.php?/tests/view/2738733 — moving shop refreshes what you see
- https://shopview.testrail.io/index.php?/tests/view/2983591 — after moving, the old shop's work disappears

## D. One needs somebody to mark a supplier invoice as paid

Half is confirmed — invoices come back newest first. The other half cannot be seen, because **every supplier invoice on this test site is unpaid**, and I tried six ways to pay one.

- https://shopview.testrail.io/index.php?/tests/view/2728116

## E. One is a gap in the written requirements — a product owner question

The requirements say a purchase order is either still-ordered or received. **The product has a third state in between, "Partial Delivery", which the requirements never mention**, so there is no stated right answer for where it should rank.

- https://shopview.testrail.io/index.php?/tests/view/2728115

## F. One waits on a fix already with the developers

It starts by clicking a "Show all" link on a group heading, and that link is not in the product. That absence is already reported and being worked on.

- https://shopview.testrail.io/index.php?/tests/view/2723896

---

# The 14 that failed — **none has a report ready for you to test**

| What fails | Test | Report | Ready for QA? |
|---|---|---|---|
| The "Show all" link is missing from group headings | https://shopview.testrail.io/index.php?/tests/view/2723895 | SV-10159 | **No — still being worked on** |
| A part sale row shows no total price | https://shopview.testrail.io/index.php?/tests/view/2723906 | SV-10163 | **No — still being worked on** |
| Prices missing for someone allowed to see them | https://shopview.testrail.io/index.php?/tests/view/3050566 | SV-10163 | **No — same report** |
| "No results" does not name the tab you are in | https://shopview.testrail.io/index.php?/tests/view/2723935 | SV-10181 | **No — still being worked on** |
| A catalogue part never stocked cannot be found | https://shopview.testrail.io/index.php?/tests/view/2959367 | SV-10001 | **No — the developers are themselves blocked on it** |
| A fragment from the middle of a word finds nothing | https://shopview.testrail.io/index.php?/tests/view/2977472 | SV-10060 | **No — developers blocked, and waiting on your answer to Sinisa** |
| A vehicle cannot be found by year and make together | https://shopview.testrail.io/index.php?/tests/view/2959371 | SV-10055 | **No — accepted but not started** |
| A correct spelling brings back unrelated names | https://shopview.testrail.io/index.php?/tests/view/2984234 | SV-10025 | **No — accepted but not started** |
| Counts read higher than 20 | https://shopview.testrail.io/index.php?/tests/view/2868064 | SV-10320 | **You closed it last night — see below** |
| Nothing recorded when a result is chosen | https://shopview.testrail.io/index.php?/tests/view/2738741 | none | deliberate; nothing to fix |
| No count beside the kept search text | https://shopview.testrail.io/index.php?/tests/view/2723931 | none | our own test is out of date |
| Recent items don't come back after a fruitless search | https://shopview.testrail.io/index.php?/tests/view/2981982 | none | needs the product owner's ruling |
| Typing a town doesn't return the seeded customer | https://shopview.testrail.io/index.php?/tests/view/2959359 | none | our own test data crowds it out |
| The most-recently-changed rule | https://shopview.testrail.io/index.php?/tests/view/3051908 | none | cannot be proved; a product owner question |

## ⚠️ The report I raised this morning was closed last night as no longer relevant

You closed it at 22:38 with no reason written down. **If the counting is acceptable, tell me and I will mark that check as passing and stop reporting it. If it was closed by mistake it needs reopening** — the count still reads 111 where the requirement says nothing may read above 20.

---

# What is blocked on you, shortest first

1. **Why you closed this morning's report.** One line, and it decides whether one check passes or stays failing.
2. **Two checks** — say whether the cancelled work's checks should be retired or taken out of the run.
3. **Two checks** — the money-access wording you are holding.
4. **Two checks** — a login that sits in the second shop.
5. **One check** — somebody with accounting access marks one supplier invoice as paid. A minute of their time.
6. **One check** — ask the product owner where a part-delivered purchase order should rank.
7. **One older question** — Sinisa answered you about the word-fragment search on the 16th and you asked whether it is acceptable as it is. Still outstanding, with a report sitting blocked behind it.

**Six of the nine unrunnable checks clear the moment you answer items 2, 3 and 4.**
