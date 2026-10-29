# F2 follow-up: "Where it was seen" lines and date-proof wording for the 6 edited tickets (29 Oct 2026)

## Background for all six

- **Source runs.** The new figures and pictures in `RESULT-f2.md` come from the final pass on build **v26.43.2-9272076**. Each run had the zone in all four places: the session's change-location, the browser time zone, the test computer's TZ and the app's own `localStorage['timezone']`. Each run's header showed the intended location (zones in `evidence/f2/pictures/meta.json`).
- **The build has moved since.** Staging is now on **v26.43.3-8ad4001** (since about 11:15 UTC). The diff 9272076 → 8ad4001 touches no Parts Velocity, Inventory Value or Returns code; it changes accounting reports and QB Unexported.
- **Re-read on 8ad4001 at 11:41 UTC.** I re-read the server data and the figures are unchanged:
  - ZZAUTOTEST-PV1: Demand 5, Units Sold 6, Units Returned 0, On Hand 4.
  - ZZAUTOTEST-SO1: 0 / $0 / Demand 0 / Last Sale —.
  - N000000001069: Last Sale 161.
  - Inventory Value qty for ZZAUTOTEST-PV1: 4.
  - The screen on 8ad4001 also showed ZZAUTOTEST-PV1 with Demand 5 and Units Sold 6.00 (11:38 UTC).
  - **Not re-run on 8ad4001:** the B2 vendor-return run, which would mean making a new return, and the Inventory Value headings on screen. If the QA lead wants the "Where it was seen" lines on the newest build, the coordinator can say "v26.43.2-9272076, figures re-read on v26.43.3-8ad4001".

---

## SV-11941 (B2): Units Returned counts a vendor return

- **Where it was seen (replacement first bullet):**
  - Old: "Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin."
  - New: "Staging (https://app.staging.shopview.com), build v26.43.2-9272076, 29 Oct 2026, 5:28 AM Toronto time, Admin. The return was made and cancelled through the screen the same morning."
- **Zones line:** unchanged ("Browser, the app's own time-zone setting and the test computer all set to the location's time zone (America/Toronto).").
- **Date-proof wording:** none needed.
  - The steps make a new return each time, dated today, and **Last 12 months** always includes today.
  - The figure "0.00 + 1 = 1.00" holds as long as no customer return of ZZAUTOTEST-PV1-10282011 exists. None existed in the last 366 days on 29 Oct.
- **Row position.** The "about 100 rows down" position after the Part # sort is an approximate guide. It shifts as other parts are added; the Search box is the fallback, and it gives the same figures.

## SV-11943 (B4): Last Sale ignores a billed sale that moved no stock

- **Where it was seen:**
  - Old: "Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 29 Oct 2026 (Karachi time), Admin."
  - New: "Staging (https://app.staging.shopview.com), build v26.43.2-9272076, 29 Oct 2026, 2:38 PM Karachi time, Admin."
- **Zones line:** unchanged (Asia/Karachi).
- **Date-proof wording:**
  - Last Sale counts all of history, so the **Date** choice does not change it, and the row stays listed under Last 12 months whatever the date. It is an in-stock part.
  - **Today's figures grow by 1 each day,** so state the Expected as a fixed difference.
    - Old: "**Expected:** Last Sale **91 days** on 29 Oct 2026 (the sale on 30 Jul 2026), also going up by 1 each day."
    - New: "**Expected:** Last Sale counts from the 30 Jul 2026 sale, so it should read **70 days fewer** than the screen shows (30 Jul − 21 May = 70 days). For example, 161 − 70 = **91 days** on 29 Oct 2026."
  - **Why "70 fewer" is safer than "91".** The report counts full 24-hour periods since the sale, not calendar days (see `side-findings/SIDE-OBS-RESULT-f2.md`, OBS B). So for part of each day it may read one less than the calendar count. The 70-day difference holds whatever the time of day.
  - **If the optional "Last quarter" sentence is kept:** "Last quarter" means Jul–Sep 2026 only until 31 Dec 2026. Add: "From 1 January 2027, choose **Custom** and pick **Jul 1, 2026** to **Sep 30, 2026** instead." This is the same wording as the filed step 4.

## SV-11944 (B5): Inventory Value heading "Qty" should be "On Hand"

- **Where it was seen:**
  - Old: "Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin."
  - New: "Staging (https://app.staging.shopview.com), build v26.43.2-9272076, 29 Oct 2026, 5:49 AM Toronto time, Admin. The PDF of all locations did not download that day, so the PDF step uses DVI Test only."
- **Zones line:** unchanged (America/Toronto).
- **Date-proof wording:** none needed. "As of" opens on today, and the heading does not depend on the date.
- **Example.** The example quantity can change if the part is used. Write "4.00 in stock (on 29 Oct 2026)".

## SV-11945 (B6): a "Receive later" special-order part shows as never sold

- **Where it was seen:**
  - Old: "Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin."
  - New: "Staging (https://app.staging.shopview.com), build v26.43.2-9272076, 29 Oct 2026, 5:40 AM Toronto time, Admin."
- **Zones line:** unchanged (America/Toronto).
- **Date-proof wording:**
  - **When the sales leave "Last 12 months".** The preset starts on the 1st of the month eleven months back; on 29 Oct 2026 it covers 1 Nov 2025 to 29 Oct 2026. So the 28 Oct 2026 sales stay inside through **30 Sep 2027**. On **1 Oct 2027** the preset starts on 1 Nov 2026 and leaves them out.
  - Sub-bullet: "From 1 October 2027, pick **Custom** and choose a range that includes **Oct 28, 2026** instead." This is already in `RESULT-f2.md`.
  - **"Last Sale 0 days (the day of the sale)".** This wording is right only within 24 hours of the sale, because the report counts full 24-hour periods. Suggested: "Last Sale counted from 28 Oct 2026 (**0 days** within the first 24 hours after the sale, then one more each day)".
- **Row position.** "About 95 rows down" after the Part # sort is an approximate guide; Search is the fallback.

## SV-11946 (B7): Demand counts a reversed-and-re-invoiced work order twice

- **Where it was seen:**
  - Old: "Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin."
  - New: "Staging (https://app.staging.shopview.com), build v26.43.2-9272076, 29 Oct 2026, 5:40 AM Toronto time, Admin. Re-read on v26.43.3-8ad4001 the same morning: Demand still 5."
- **Zones line:** unchanged (America/Toronto).
- **Date-proof wording:**
  - The same cut-off as B6. S1-38203, S1-38204 and S1-38206 are all dated 28 Oct 2026, so they stay inside **Last 12 months** through **30 Sep 2027**.
  - Sub-bullet: "From 1 October 2027, pick **Custom** and choose a range that includes **Oct 28, 2026** instead of Last 12 months."
  - A work order made by following the steps is dated today, so it is always inside.
- **Row position.** "About 100 rows down" is an approximate guide; Search is the fallback.

## SV-11947 (B8): Margin and Total Sell shown on the first visit

- **Where it was seen:**
  - Old: "Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 28 Oct 2026 (Toronto time), Admin, desktop browser."
  - New: "Staging (https://app.staging.shopview.com), build v26.43.2-9272076, 29 Oct 2026, 5:49 AM Toronto time, Admin, desktop browser opened fresh (no saved report settings)."
- **Zones line:** unchanged (America/Toronto).
- **Date-proof wording:** none needed. The first-visit column set does not depend on the date.

---

## Tool note (affects no figure)

- The end-of-run header check fired too early in four kinds of run, before their page had opened: `IV_DVI_PIC` (the B5/B8 picture) and OBS A runs 1–3. Those runs read `VALID: false`.
- The cause was the order of lines in my script, `tools/f2/ev_f2.mjs`; it is now fixed.
- The B5/B8 picture itself shows "DVI Test" in its header, and its location chip reads "All locations" after Select all.
- The runs after the fix read `VALID: true` at both start and end.
