# SV-8552 — point 4 re-check (3 Oct 2026)

**Why:** the QA lead: *"The point 4 from Chris's 2nd last comment seems to not have been followed by you when you tested … Check the last comment of chris too."*

**Sources read live:** SV-8552, status **Code Review**, 14 comments. Chris Ward 77735 (1 Oct 10:41 −0500) point 4: *"Keep the task name visible. For full-day and multi-day jobs, the name should always stay on screen. It used to stick to the edge of the screen when the bar was cut off."* Chris Ward 77810 (2 Oct 18:59 −0500, after my 77784): *"In the QA environment, a full day job has the title moving with page scroll. That's exactly right. Big jobs should follow suit as well. It's important to match the behavior."*

**Build:** `sv8552.qa.shopview.com`, `v26.40.2-b57d7c7`, last-modified Fri 02 Oct 2026 07:49:51 GMT, etag `69a4a9ecfb83cd23d6fe39475f164032` — the same build my 77784 comment passed. The branch was asleep; woken via the Wake Up button (~90 s). Viewport 1700 × 1050, Day view.

## What my 2 Oct pass actually checked for point 4
D1/D2 = an **all-day** bar in Day view (name pinned); D3 = a multi-day bar in **Week** view; E4 = clicking a cut-off multi-day work-order shift opens its card. **No check scrolled a multi-day work-order bar in Day view and watched its name.** The only multi-day work-order bar I measured (20/21 Oct) was **wider than the screen**. So the PASS on point 4 claimed more than was measured.

## Measured today (Day view, name x vs timeline left edge 523)

| Day | Bar | Bar width | Scrolled | Name x | Pinned? |
|---|---|---|---|---|---|
| Fri 9 Oct | all-day event | 3504 | 0 → 2328 | 535–536 throughout | **yes** (`position: sticky`) |
| Mon 5 Oct | multi-day task "Jarod off" | 2603 | 1536, 2304 | 535 | **yes** |
| Tue 20 / Wed 21 Oct | multi-day WO shift, wider than the screen | 1453 / 2913 | up to 2328 | 531 | **yes** (`--pinned-text`) |
| Fri 2 Oct | multi-day WO shift S2-9379 (first day, `--continues-after`) | 936 | 1632 | **189 — off-screen** | **no** |
| Mon 5 Oct | same shift, last day (`--continues-before`) | 495 | 1536 | **317 — off-screen; only "oot" visible** | **no** |
| Wed 14 Oct | ordinary single-day shift | 365 | — | — | not sticky (by design per point 4) |

**Result: point 4 is NOT met for multi-day work-order jobs whose bar is narrower than the screen.** Their name scrolls away; only bars wider than the screen get `--pinned-text`. Multi-day *tasks/events* and all-day bars are fine. This is what Chris's 77810 describes ("big jobs should follow suit"). Exhibit: `ev/01-multi-day-job-loses-its-name-hd.png` (2×).

**Bucket (Rule 93):** already tracked — Chris's 77810 on the same ticket raises it; the ticket is back in Code Review. Nothing new filed. My comment 77784 row 4 / D-rows say PASSED and needs correcting in place (awaiting the QA lead).

**Not yet re-checked:** ordinary long single-day jobs cut off at the edge — point 4 did not ask for them, and Chris's "big jobs" may or may not include them (ask, Rule 55).
