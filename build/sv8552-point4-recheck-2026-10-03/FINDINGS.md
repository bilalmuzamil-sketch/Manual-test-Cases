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

## Comment 77811 shortened (QA lead: *"The comment is too big. We just need something like whats happening vs what it should be that is it."*)
Updated in place: what's happening (2 items) · what it should be · 2 screenshots. Unused attachments 61734 and 61735 deleted. Read back: 2 media `type=file`, 1 list with 2 items, mention = Dipesh. Text saved as `comment-77811-short.txt`.

## QA lead's answers (3 Oct) and the follow-up
- *"Big jobs" includes long single-day jobs?* → **"Yes"**. *Edit the old comment 77784?* → **"Dont edit old comment"** — 77784 left untouched.
- **Observed (05:3x Z, same build):** Brandi Smith, ordinary 8-hour job Wed Oct 21 9 AM–5 PM (fresh, S2-9379, `--shift --blue`, no `--pinned-text`): name at x 606 when opened; scrolled to 4 PM the bar sits at 523–740 with **no name**. On the same screen Emily Madden's continuous multi-day job (Oct 20 2 PM → Oct 21 8 PM) keeps its name pinned. Exhibit `ev/05-long-single-day-job-loses-name-hd.png`.
- **Comment 77811 updated in place** with item 3 (long single-day job) + exhibit 05 (attachment uploaded). Pre-post gate: build `v26.40.2-b57d7c7`, last-modified Fri 02 Oct 07:49:51 GMT, etag `69a4a9ec…` unchanged; ticket still Code Review, no new comment since Chris 77810. Read back: 3 media `type=file` in order, 1 list of 3 items, mention = Dipesh, AI-fingerprint scan empty.
- **Not yet observed (Rule 96 cells still open):** a single-day job **wider than the screen** (14 h, Jason Johnson, Oct 21 7 AM – 9 PM) and long single-day jobs in **Week view**. The create call failed because the **QA sign-in expired** (`/api/auth/me` → 401 `sso_required`; the app and API hosts themselves answer 200). Needs fresh `.qa.shopview.com` cookies.

## QA lead's layout ruling for comment 77811 (3 Oct)
*"this comment of Chris [77810] … should be on the top explaining the dev what is happening with the annotated screenshots. Then a line break and below that line break the other things from your 'Three things I looked at closely and did not treat as faults'"*.
Plan: top = Chris's "big jobs should follow suit" — the three big-job failures (+ the two pending checks) with screenshots; `----`; below = A (Week view sliver), B (Create Event slides the timeline), C (no "8 AM" label on an 8:30 day), each one line + fresh 2× annotated screenshot + steps. D (closed-day scroll, 1 Oct comment) not one of the three — asked. **Blocked on fresh QA cookies; nothing posted.**

## Fresh sign-in (3 Oct ~11:20Z) — remaining big-job checks and items A–E, build `v26.40.2-b57d7c7`
**Big jobs, single-day:** Jason Johnson 14-hour job (Wed Oct 21 7 AM–9 PM, fresh) and Brandi Smith 8-hour job. Day view: the day stretches to fit the 14-hour job (bar 527–1689, timeline 523–1699), so no single-day job is wider than the screen when the day opens. Scrolled (sl 816): Jason's name x 299 → **not visible**; Brandi's partly cut (165 of 223 px visible). Neither has `--pinned-text`. Week view 1700/1100: one day column, nothing cut. Week view 700 at sl 252: Brandi's bar 185–277 (timeline 223), name 29 of 56 px visible — **cut, not pinned** (item E).
**Items captured for the QA lead's decision (no comment posted):**
- **A** Week 700, "Jarod off" (David Haynes, Mon Oct 5–Tue Oct 6): 90 px of bar left → name pinned; 24 px left → name gone, "PM" shows.
- **B** Fri Oct 9 Day: **left-click** an empty spot (Clayton Stephens, 3 PM) opens a menu *Assign Work Order / Create Event / New Work Order*; clicking **Create Event** moves the timeline scroll 1310 → 2191 (first label 9 AM → 3 PM). Escape closed the dialog; nothing saved. Whether the timeline slides back on close was **not** checked.
- **C** Wed Oct 7 (8:30–4:30): labels 8 AM at x 459–489 (under the name column), first visible label 9 AM at 605; timeline starts at 523.
- **D** Sat Oct 10 (closed) at 1700: scrollable by 72 px; at 0 the 10 PM label is cut and 11 PM off screen; at max 12 AM is off the left. (Production equivalence is from the 1 Oct pass, not re-checked today.)
- **E** as above.
Also seen: Emily Madden's continuous Oct 20–21 job in Week view 700 at sl 252 is cut and not pinned — consistent with remaining issue 2.
Not ours on the branch: an event "Title should stay multi day" (Emily Madden, 8:00 AM – 2:15 AM, Week 1 of 2) created by someone else.

## 3 Oct (later) — new ticket SV-10806 + comment 77811 rebuilt (QA lead's layout ruling)
- **Gate:** build re-read `v26.40.2-b57d7c7` (last-modified Fri 02 Oct 07:49:51 GMT, etag `69a4a9ec…`) — unchanged. SV-8552 still Code Review, last comment 77811. Duplicate search (4 JQL queries, last 60 days): none.
- **B re-checked live just before filing:** scroll 1310 → 2191 on Create Event; the form's start time is 3:00 PM (matches the click, so test-plan item G passes); after Esc the scroll **stays at 2191** (timeline stays at 3 PM).
- **Sources for the expected behaviour** (found in this session's earlier transcript, Dipesh's Powertools QA plan rev 2): D — *"Its name stays visible at the left edge for as long as any part of the bar is on screen."*; F — *"Drag, create and delete a job. The screen does not jump or resize."*; A — *"Open Wednesday. It starts exactly at 8:30 AM. The "8 AM" label is half cut off at the left edge, which is expected."*
- **[SV-10806](https://shopview.atlassian.net/browse/SV-10806)** created: Bug, Medium, Product Area Schedule, no parent (SV-8552 has none), Relates SV-8552, labels none (SV-8552's only label is `QAcomplete`, a QA-status marker, deliberately not copied). First line "Found while testing SV-8552" (linked). Items A, B, C each with steps, expected+source, current, image as a real attachment. Read back: 3 media type `file`.
- **Comment 77811 updated in place:** @Dipesh, Chris 77810 quoted on top, items 1–3, **E folded into item 3** (QA lead ruled long single-day jobs are big jobs), rule, link to SV-10806. Read back: mention + 4 file media, SV-10806 link present.
- **D excluded** — Dipesh 77238: *"Large screens (wider than about 1770px): all 24 hours fit on the screen"*; tested at 1700 px.
- **Learning check (Rule 95 Part B):** the developer's test plan text is NOT lost when Powertools needs Google sign-in — it was pasted into this session earlier and is recoverable from the transcript; search it before calling a source unavailable.

## 3 Oct (later) — D added to SV-10806 on the QA lead's "Yes"
- Re-checked live 12:52Z, build `v26.40.2-b57d7c7`: Sat Oct 10 at a 1700 px window, timeline 523–1699, scrollable 72 px; at 0 the 10 PM label is cut (1673–1710) and 11 PM off screen; at the right end 12 AM is off the left (456–494). Same numbers as 11:20Z.
- New exhibit `ev/D2-closed-day-24h-do-not-fit-hd.png` (old D caption's "production did the same on 1 Oct" removed — not re-checked today).
- SV-10806: item 4 added; source quoted from the test plan (1680 px minimum + "Closed days open the old way (all 24 hours fit)") with Dipesh 77238's ">1770 px" quoted beside it, so the PO sees the conflict. Summary sentence and title updated. Read back: 4 sections, 4 file media, Medium.
- Learning check: nothing new.
