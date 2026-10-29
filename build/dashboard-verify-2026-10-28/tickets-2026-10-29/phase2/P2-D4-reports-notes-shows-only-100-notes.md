<!-- DRAFT — NOT FILED. File only after the QA lead's go-ahead for THIS ticket (Rule 62/73).
SUMMARY: Reports - Notes shows only the first 100 notes, with no way to see the rest
TYPE Bug · PARENT SV-11839 · PRIORITY Medium · PRODUCT AREA Reports & Dashboards
LINKS: owning story NOT FOUND (no story or task for the Notes report found by JQL — searches in SUMMARY-p2d.md). QA lead to decide the "relates to" link.
PICTURES: pictures/P2-D4-1-notes-last-week-ends-at-100.png
BASIS: Chris Ward's answer to question 36 (28 Oct 2026): "Yes, show every note in the chosen dates, with paging. Defect."
RE-CHECKED: 29 Oct 2026, 12:47–12:48 AM UTC (= 29 Oct, 5:47–5:48 AM in Karachi; screen, re-taken with the app's time-zone setting; Last Week request window 2026-10-17T19:00:00.000Z → 2026-10-24T19:00:00.000Z = 18–24 Oct in Karachi), staging v26.43.2-f8698cb, Staging Heavy Duty - 9919; session, browser, app time-zone setting and test computer all on Asia/Karachi.
-->

## What is wrong

The **Notes** report never shows more than **100 notes**. When more than 100 notes fall in the chosen dates, the list simply stops after the 100th, and there is no next page, "load more" or message.

**Example:** with **Date Range: Last Week** (18–24 Oct 2026) there are **255** notes. The list shows the newest 100 (from 23 Oct, 11:02 PM down to 20 Oct, 6:33 PM) and stops. The other **155** notes (19 Oct, 11:51 AM to 20 Oct, 6:30 PM) cannot be seen: 255 − 100 = 155.

## Where this shows on the Dashboard

Not affected — this report does not feed any Dashboard tile.

## Steps to reproduce

1. Log in to staging as an Admin.
2. At the top right, switch the location to **Staging Heavy Duty - 9919**.
3. Click **Reports**, then **Notes** (under Communications).
4. Click **Date Range** and pick **Last Week**.
   - From 1 November 2026, pick **Custom** and choose **Oct 18, 2026** to **Oct 24, 2026** instead.
5. Leave **Sort By: Newest First**.
6. Scroll to the bottom of the list.

**Actual:** the list ends at the 100th note (Viktoria Videnovic, Work Order S1-37618, 06:33 PM, Oct 20, 2026). There is no next page and no way to see the older notes of that week.

**Expected:** every note in the chosen dates can be seen, with paging — here all 255, down to the oldest on 19 Oct 2026.

On 28 Oct 2026 the same was seen with **All** (100 of 2,545), **This Month**, **Filter by Author** and **Filter by Mention** whenever more than 100 notes matched (re-checked today with Last Week only).

---

**Source:** Chris Ward, answer to question 36 in "Dashboard and Reports – questions for Chris Ward" (28 Oct 2026):

> Yes, show every note in the chosen dates, with paging. Defect.

## Screenshots

**1.** Notes, Date Range: Last Week, scrolled to the bottom: the list stops at note 100 of 255 (times shown in Karachi time).

## Where it was seen

- Staging (https://app.staging.shopview.com), build v26.43.2-f8698cb, 29 Oct 2026 (Karachi time), Admin.
- Browser, app time-zone setting and test computer set to the location's time zone (Asia/Karachi).
- Notes are shown for the whole organisation, so the same happens from any location.
- Not checked on Production or on a QA branch.

## For developers

The screen asks for page 1 with 100 rows (`rowsPerPage=100`); the reply says `hasMore: true`, but no further page is ever requested. Fetch further pages (on scroll or with a pager) until `hasMore` is false.
