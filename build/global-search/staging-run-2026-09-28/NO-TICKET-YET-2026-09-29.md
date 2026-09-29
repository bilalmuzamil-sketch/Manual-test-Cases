# The six checks with no report raised — run links and every Jira link that touches them

**Run 415** — https://shopview.testrail.io/index.php?/runs/view/415

*(Reference numbers and links are in the table below because you asked for them. What each check
actually looks at is written out in words beside every one, so nothing here needs decoding.)*

These are the only failing checks with **no report filed against them**. I searched Jira for each one
by name and for the wording each describes: nothing exists. The Jira links in the last column are
**related items, not reports raised for these checks** — they are there because each one tells you
something about why the product now behaves the way it does.

All six passed on **21 September** and fail now, so in every case the product changed rather than the
check being wrong from the start.

| Check | What it expects, and what happens instead | Run link | Story it belongs to | Related Jira — NOT filed against this check |
|---|---|---|---|---|
| **C44850**<br>[case](https://shopview.testrail.io/index.php?/cases/view/44850) | Typing an exact number should put that record on a line of its own above everything. It no longer does — the record is found and ranked first, but sits inside its section. | [test in run 415](https://shopview.testrail.io/index.php?/tests/view/2723920) | [SV-9174](https://shopview.atlassian.net/browse/SV-9174) — TESTING QA | [SV-10547](https://shopview.atlassian.net/browse/SV-10547) — Done — raised 28 Sep, fixed the same day: the first result did not say what kind of record it was · [SV-10556](https://shopview.atlassian.net/browse/SV-10556) — OBSOLETE — raised 28 Sep, same complaint about a missing heading |
| **C55729**<br>[case](https://shopview.testrail.io/index.php?/cases/view/55729) | The same, with a customer name that also matches what was typed. The number does win — it just is not on a line of its own. | [test in run 415](https://shopview.testrail.io/index.php?/tests/view/3075528) | [SV-9174](https://shopview.atlassian.net/browse/SV-9174) — TESTING QA | [SV-10547](https://shopview.atlassian.net/browse/SV-10547) — Done — as above · [SV-10556](https://shopview.atlassian.net/browse/SV-10556) — OBSOLETE — as above |
| **C44898**<br>[case](https://shopview.testrail.io/index.php?/cases/view/44898) | On a phone the results should scroll as one full list. They are capped at five a section with a "Show All" link, exactly as on a computer. | [test in run 415](https://shopview.testrail.io/index.php?/tests/view/2723968) | [SV-9174](https://shopview.atlassian.net/browse/SV-9174) — TESTING QA | [SV-10345](https://shopview.atlassian.net/browse/SV-10345) — QA Complete — OPEN. Asks for "Show all" to be ADDED on phones. The opposite of what this check requires. |
| **C45134**<br>[case](https://shopview.testrail.io/index.php?/cases/view/45134) | The same phone capping. Sticky headings and tapping a row both work; only the capped list is wrong. | [test in run 415](https://shopview.testrail.io/index.php?/tests/view/2728112) | [SV-9174](https://shopview.atlassian.net/browse/SV-9174) — TESTING QA | [SV-10345](https://shopview.atlassian.net/browse/SV-10345) — QA Complete — OPEN. The opposite of what this check requires. |
| **C45136**<br>[case](https://shopview.testrail.io/index.php?/cases/view/45136) | The same phone capping, from the "there should be no Show all" angle. The keyboard half of this check is right. | [test in run 415](https://shopview.testrail.io/index.php?/tests/view/2728114) | [SV-9168](https://shopview.atlassian.net/browse/SV-9168) — TESTING QA | [SV-10345](https://shopview.atlassian.net/browse/SV-10345) — QA Complete — OPEN. The opposite of what this check requires. |
| **C45132**<br>[case](https://shopview.testrail.io/index.php?/cases/view/45132) | The greyed-out words in the phone search box read "Search work orders, parts…" where this requires "Search everything". Everything else about the phone panel is right. | [test in run 415](https://shopview.testrail.io/index.php?/tests/view/2728110) | [SV-9168](https://shopview.atlassian.net/browse/SV-9168) — TESTING QA | **nothing** — no report anywhere mentions this behaviour |

---

## What each group needs from you

**The two about an exact number losing its own line at the top.** On 28 September two complaints were
raised that the very first result did not show what KIND of record it was; one was fixed within
hours. The separate line disappeared the same day. That looks deliberate, but nothing says so
outright — so I need you to confirm it was intended, in which case the two checks get reworded, or
say it was not, in which case I will write it up as a fault.

**The three about phones.** These are in direct conflict with a report that is still open: it asks
for "Show all" to be ADDED on phones, and our checks require it to be absent. One of the two has to
give. If the phone is meant to match the computer, I reword three checks; if it is meant to scroll
the whole list, then the change that went in is wrong and I will write that up.

**The one about the wording in the phone search box.** Purely wording — either the product changes or
the check does.

**I have raised nothing, and nothing here is waiting on my go-ahead.** Each needs a decision first,
because in every case it is genuinely unclear whether the product or the check is the thing that is
wrong — and filing against the wrong one wastes a developer's day.

---REFERENCE---

No report filed: C44850 · C55729 · C44898 · C45134 · C45136 · C45132
Searched Jira by case number and by the wording each check describes — no match.
Related only: SV-10547 · SV-10556 (the top line) · SV-10345 (Show all on phones, open).
Stories: SV-9174 and SV-9168, both TESTING QA — neither is obsolete.
Every one of these six last passed on 21 September 2026; full history in `failed-history.json`.
