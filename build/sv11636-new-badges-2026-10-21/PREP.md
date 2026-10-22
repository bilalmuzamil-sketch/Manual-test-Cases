# SV-11636 — temporary "New" badges (Dashboard nav + view switcher) — PREP, not yet testable

Ticket: Story under SV-490, assignee Milomir Kotlajic, status **Open** (21 Oct). Watch: every 2 h; test on the linked QA branch if
it exists and responds, else staging.

## Sources read (21 Oct)
- Description: Dashboard nav pill top-left over the link, nothing moves/resizes, label not covered, clear of Reports + search;
  ONE identical pill centred over the List/Tech View/Board View group, just above it, covers no button, no layout shift, not
  clipped; both expire **Sat 31 Oct 2026 07:00 UTC**, same mechanism as Schedule's (`badge` + `badgeUntil`), an open tab drops
  them too; mobile menu Dashboard entry carries the same badge + expiry; no switcher badge below 1024 px.
- Reference pictures `ref/` (local build 1440x2): page top, nav Dashboard, view switcher.
- Chris comment 79239: phone width menu not broken; ~1024 px tablet: nav + view switcher fit with badges, nothing overlapping or
  clipped.
- Chris in Slack #C0C41RV3T3L (ts 1792611571.182369): same pill as Schedule relaunch; "quick check on mobile and tablet widths
  too when it's done"; request from Sasha.

## Baselines (no badges)
- Production v26.40.20-6ac42c0: **no Dashboard link at all** (nav: Work Orders, Schedule, Customers, Parts, Reports) —
  `prep/e636-prod.json`. So "same place as production" = same as the nav without the badge on the build under test.
- Staging v26.40.20-7405769 (21 Oct ~20:00 UTC): `prep/e636-base-*.json` + screenshots — 1440: Reports 665+85.1,
  Dashboard 760.1+105.6, search 870.7+153.3, switcher 1116+136; 1024: Reports 569+61.1, Dashboard 640.1+81.6, search 726.7+140,
  switcher 133.5+136 (toolbar wraps); 390: menu items 57 px tall, Dashboard 8th row at y 431.

## Test plan (variant matrix)
- Widths 1920 / 1440 / 1280 / 1024 / 1023 (switcher gone) / tablet 768 / phone 390, light + dark.
- Dashboard pill: position over top-left corner, label not covered, every nav item x/y/w/h identical to the no-badge baseline
  (byte-compare geometry), no overlap with Reports / search.
- Switcher pill: exactly one, centred over the group (|centre diff| ≤ 1 px), above it, covers none of the 3 buttons (all
  clickable), no layout shift, not clipped (bounding box inside visible toolbar/viewport, overflow ancestors).
- Same pill style both places (size, colours, weight) and same as Schedule's old pill if retrievable.
- Mobile menu: Dashboard row carries the badge, rows keep their size, menu not broken.
- Expiry: clock set past 2026-10-31T07:00Z (browser clock override, labelled "comparison only") → both gone, including a tab left
  open across the moment; just before → still shown. Disclosed as done in the browser, not a product feature.
- Tech View + Board View pages too (the switcher badge shows in all three views).

## QA lead's pointer (21 Oct, Slack file F0CAY7HAKQV → `ref/slack-F0CAY7HAKQV-badges-preview.png`)
"Also see the Tech View — the buddy sign with small New on that." In the preview, the switcher pill centred over the group lands
directly above the middle button, Tech View (the person icon). Extra checks for that cell:
- The pill must not touch or cover the Tech View icon or its button (measure the gap between the pill's bottom and the button's
  top, and check the person icon is fully visible and the button clickable at the pill's position).
- Hovering Tech View: its tooltip still shows and isn't hidden under the pill.
- Report plainly that a centred pill sits over Tech View only, so it can read as "Tech View is new" while Board View (also new)
  carries no mark; the ticket asks for exactly this placement, so it is noted, not failed, unless the QA lead says otherwise.

## Chris Ward's answers (Slack DM D0B48J5BYQ7, 22 Oct 01:14 +04 = 21 Oct 21:14 UTC), to Bilal's question at ts 1792617184.811789
Verbatim: "Dashboard is not visible to anyone that doesnt have reports access, so that pill shouldnt appear if they cannot have
reports access" · "For board/tech on phone view, because those options aren't visible, the "new" shouldnt be visible either"
Extra cells:
- A user WITHOUT Reports access: no Dashboard link and no Dashboard pill, in the desktop nav AND the phone menu. Method: reset the
  chosen role to template first (Standing Rule 105), read its permissions back, assign it to a test user, sign in AS that user
  (never impersonate). Also a user WITH Reports but not Admin (pill shows).
- Phone width (and anything below 1024 px): no view switcher and no switcher pill anywhere on Work Orders (List/Tech/Board).
- Before passing, confirm Chris's Reports-access rule against the Dashboard PRD (Standing Rule 109); if the PRD doesn't say it,
  ask Chris to add it rather than passing on the Slack answer alone.

## Check 22 Oct 04:08 UTC — status moved, change not deployed
- Changelog: Milomir Kotlajic moved SV-11636 Open → In Progress (03:26:44 UTC) → Code Review (03:26:48) → Ready for QA (03:27:44)
  → TESTING QA (03:27:49) → **QA Complete (03:28:55)**. No QA comment; only comment is still Chris's 79239. QA Assignee Ayesha Khan.
- No QA branch: sv11636.qa.shopview.com does not answer (curl 000); toggleQaEnv returns 500.
- Staging still **v26.40.20-7405769** (last-modified 21 Oct 19:49:03 GMT, etag f90e347f…) = the no-badge baseline. Main bundle
  `/js/index.Be17E1Re.js` has `badge:"New"` only on the AccountingHub/HR apps, nothing for Dashboard or the view switcher.
- Not testable yet → nothing tested, nothing posted. Routine trig_016o1PRHVCDYnqEFJsfaDbHR kept on (every 2 h, next 06:05 UTC),
  prompt changed to wait for the change to reach staging (app-version moves) rather than for a status change.

## Staging check 22 Oct 04:55 UTC (QA lead: "test this on staging")
- Staging build still v26.40.20-7405769 (same etag f90e347f…). Live at 1440 px: 0 elements reading "New" on the page; nav and
  switcher geometry identical to the baseline (Dashboard 760.1+105.6, switcher 1116+136). At 390 px, phone menu: 0 "New",
  Dashboard row 8th at y 431, 57 px. Pictures prep/e636-now-1440.png, prep/e636-now-390-menu.png; data prep/e636-now.json.
- Jira development panel for SV-11636: no pull request and no branch linked.
- So the change is not on staging; nothing to test against. No comment posted — asked the QA lead how to proceed.

## 22 Oct 05:01 UTC — developer ETA
- Minja (Milomir Kotlajic) in Slack C0C45KCLS92 ts 1792645311.856259: "I expect to have it ready on staging in about 3 hours"
  → ~08:00 UTC. Extra one-shot check trig_012Q3RSeWZrJEKqbjjVQBmvo at 08:30 UTC; the 2-hourly routine continues.

## 22 Oct 07:50 UTC — QA lead: "Please start on staging"
- Staging still v26.40.20-7405769 (same etag f90e347f…, last-modified 21 Oct 19:49:03 GMT) — Minja's ETA is ~08:00 UTC.
- The staging cookies (supplied 21 Oct 07:18 UTC) are now past ~24 h: quick-login → HTTP 401, browser lands on the Google sign-in.
  Fresh `sv_sso_session` / `PHPSESSID` / `cf_clearance` for .staging.shopview.com needed before any live check can run.

## 22 Oct 08:03 UTC — fresh staging cookies received, login 200
- Staging still v26.40.20-7405769; live at 1440 px: 0 "New" badges. This session lands on the Staging Heavy Duty location, where the
  right-hand nav is wider than the baseline's DVI Test location (switcher x 1266 vs 1116, search 870.7+153.3 same) — so the
  before-baseline must be re-captured with THIS login and location (same user, same location) the moment the badges appear, or
  before taking the "after", using prep/ only as the earlier reference.
- Waiting on Minja's deploy (ETA ~08:00 UTC); 08:05 routine + 08:30 one-shot will test as soon as the build moves.

## 22 Oct 08:20 UTC — FAILED comment 79263 posted (QA lead: "leave the annotated screenshot in the latest comment … change its status to rejected from testing")
- Staging v26.40.20-7405769 re-read before posting (unchanged); live at 1440 px: 0 "New" elements, Dashboard 760.1+105.6, switcher
  1266+136 (this login/location). Exhibit ev/SV-11636_no-new-badges-on-staging.png (annotated, stacked with the ticket's own picture).
  Pre-post gate run (build, ticket state, PRD v73, text scan); read back: 1 attachment 1440x841, 5 numbered steps, 3 table rows.
- Status change to REJECTED FROM TESTING NOT done: from TESTING STAGE Jira offers only Board Backlog, Blocked, OBSOLETE, Done,
  Ready for production (no Rejected-from-testing transition for this account). Asked the QA lead.

## 22 Oct ~11:50 UTC — DONE: tested on v26.43.0-e48011d, PASSED comment 79273. See FINDINGS.md. Routine trig_016o1PRHVCDYnqEFJsfaDbHR disabled.
