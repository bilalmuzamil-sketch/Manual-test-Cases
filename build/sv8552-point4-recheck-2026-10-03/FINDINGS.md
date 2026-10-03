# SV-8552 — point 4 re-check (3 Oct 2026)

**Why:** the QA lead: *"The point 4 from Chris's 2nd last comment seems to not have been followed by you when you tested … Check the last comment of chris too."* and then: *"why did you skip testing something which was important and then without testing the core point fully … told me its overall passed."*

**Sources read live (3 Oct ~05:09Z):** SV-8552, status **Code Review**, 14 comments, assignee Dipesh Changawala. Chris Ward 77735 (1 Oct) point 4: *"Keep the task name visible. For full-day and multi-day jobs, the name should always stay on screen. It used to stick to the edge of the screen when the bar was cut off."* Chris Ward 77810 (2 Oct 18:59 −0500): *"In the QA environment, a full day job has the title moving with page scroll. That's exactly right. Big jobs should follow suit as well."*

**Build:** `sv8552.qa.shopview.com`, `v26.40.2-b57d7c7` (read at 05:04Z and 05:08Z) — the same build my comment 77784 passed. Woken via the sleep page (*Wake Up*, up in ~15 s this time; can take up to 5 min).

## What my 2 Oct pass actually covered for point 4 — and why the PASS was wrong
I observed: an all-day event in Day view, a multi-day **event** ("Jarod off") in Week view, and **one** multi-day work-order shift that I had created myself as **one continuous block**. All kept their names. I wrote "PASSED" for the whole requirement. I never asked how many *kinds* of multi-day job exist. There are two booking modes — **one continuous block** (`spreadMode: single`) and **day by day** (`spreadMode: series`, one piece per day) — and the day-by-day kind fails. My specimen happened to be the kind that works.

**A second error, made in my first reply this morning:** I told the QA lead the cause was bar *width* (only bars wider than the screen keep the name). That was also drawn from too few specimens. With fresh data the real split is the **booking mode**: a continuous job narrower than the screen (Thu Oct 15, bar 1163 px) keeps its name.

## Variant matrix (all observed live today)

| Job | Booked as | View / window | Day | Name pinned when cut off? |
|---|---|---|---|---|
| all-day event | — | Day 1700 | Fri 9 Oct | **yes** |
| "Jarod off" multi-day task | — | Day 1700 | Mon 5 Oct | **yes** |
| S2-9379, Emily Madden, Oct 13 2 PM → Oct 15 3 PM (fresh) | one continuous block | Day 1700 | first / middle / last | **yes / yes / yes** |
| S2-9379, Emily Madden, Oct 27 → 29 (fresh) | day by day | Day 1700 | first / middle / last | **NO / NO / NO** |
| S2-9379, Clayton Stephens, Oct 2 + Oct 5 (pre-existing) | day by day | Day 1700 | first / last | **NO / NO** |
| S2-9379 Oct 13–15 | one continuous block | Week 700 | Wed column, scrolled 168 px | **NO** ("…ruck & Trailer Repair Blackfoot") |
| S2-9379 Oct 27–29 | day by day | Week 700 | Wed column, scrolled 168 px | **yes** |
| both | both | Week 1700 | — | not cut off at 1700 (week fits) |

Mechanism (for the findings record only, not posted per Rule 84): the pinned behaviour comes from the `schedule-block--pinned-text` class. In Day view it is on continuous blocks and not on series pieces; in Week view it is the other way round.

## Posted
SV-8552 comment **77811** for Dipesh — *"Remaining issue to be fixed"*, two issues with steps, expected + source, current, and 4 annotated 2× exhibits (attachments 61733–61736). Read back: 4 media `type=file` in order, both ordered lists start at 1 (5 and 6 items), mention resolves to Dipesh Changawala, AI-fingerprint scan empty. No technical section (Rule 84).

**Not done:** comment 77784 still says point 4 PASSED — awaiting the QA lead on whether to correct it in place.

**Data left on the branch (per-ticket branch, no cleanup):** shift `84a74d81…` (Oct 13–15 continuous) and series `29356a89…` (Oct 27–29), both S2-9379 on Emily Madden.

**Learning check (Rule 95/82):** Standing Rule 96 (variant matrix before any verdict), LESSONS-INDEX row, playbook §Schedule recipe for the two booking modes.

## Second pass — 5-day jobs, at the QA lead's request (3 Oct ~05:15–05:30Z, build `v26.40.2-b57d7c7`)
QA lead: *"Make a 5 days job, and read point 4 again from chris and the last comment of chris too."* **Nothing posted in this pass.**

Fresh jobs, all work order S2-9379, all created this pass:
- **David Haynes** — one continuous block, Thu Oct 22 9 AM → Mon Oct 26 5 PM (crosses the weekend and the week boundary)
- **Julie Olson** — day by day, Thu 22 · Fri 23 · Mon 26 · Tue 27 · Wed 28 (weekend skipped by the app)
- **Karen Peck** — one continuous block, Mon Nov 2 9 AM → Fri Nov 6 5 PM (inside one week)
- **John Ortiz** — day by day, Mon Nov 2 → Fri Nov 6
- **Brandi Smith** — an ordinary single-day 8-hour job, Wed Oct 21 9 AM–5 PM

| View / window | Continuous 5-day (David, Karen) | Day-by-day 5-day (Julie, John) | Single-day 8 h (Brandi) |
|---|---|---|---|
| Day 1700, every day incl. the LAST day, 5 scroll positions | **name pinned on all 7 days checked** (only shrinks when the visible bar is narrower than the name) | **name scrolls away on all 10 days checked** | **name scrolls away** |
| Week 1700 | week fits, nothing cut | week fits, nothing cut | — |
| Week 1100 / 700, job inside one week (Karen / John, Nov 2–8) | **name scrolls away** (700 px: "air Blackfoot" only) | pinned | — |
| Week 1100 / 700, job crossing the week (David / Julie, Oct 19–25 and Oct 26–Nov 1) | pinned | pinned | — |
| Month 1700 / 1100 / 700 | names fully visible (700 px: month only 29 px wider than the window, ≤ 23 px lost) | same | — |

**Conclusion, held to Rule 96 (facts per specimen, no theory):** point 4 is not met for (a) day-by-day multi-day jobs in Day view, on every one of their days, and (b) continuous multi-day jobs that sit inside one week, in Week view on a narrower window. Comment 77811 reported both; the 5-day jobs reproduce both. **Open question, not decided by me:** whether Chris's *"Big jobs should follow suit"* also covers long single-day jobs (Brandi's 8-hour job loses its name too). Point 4 itself names only *"full-day and multi-day jobs"*.
