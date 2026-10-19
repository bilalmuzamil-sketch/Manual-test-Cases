# SV-11466 — test case changes (proposal, nothing written to TestRail yet)

Related test in run 498: https://shopview.testrail.io/index.php?/tests/view/3481897
"Each Board column scrolls on its own and technicians are never hidden" — the only case built on S3-E2.
It quotes S3-E2 as it read in PRD v33 ("Allow horizontal scrolling ... never hide technicians automatically")
and has nothing about the scroll bar's thickness or handle. It also needs about 45 minutes of setup.

## Change 1 — new short case (no setup), placed right after it in the same section, added to run 498

Title: Board View's sideways scroll bar is thick and its handle is never tiny

Preconditions
1. Sign in as Admin, browser zoom 100%.
2. Use a location where Board View is wider than the window (a sideways scroll bar shows under the board). On Staging, "Staging Heavy Duty - 9919" has many technicians.

Steps
1. Click Work Orders, then the All tab.
2. At the right of the bar above the list, click Board View (the right-most of the three view buttons).
3. Look at the scroll bar at the very bottom of the board, under the technician columns.
4. Compare it with the thin scroll bar inside a long column (scroll inside the Unassigned column to see it).
5. Compare the grey handle on the bottom bar with the width of one technician column.
6. Drag the handle all the way to the right, then all the way back to the left.
7. Make the browser window narrower (about the width of a small laptop) and look at the handle again.
8. Click your initials (top right) > Dark, and look at the bottom bar again. Switch back to Light.
9. Click Tech View (middle view button), then List (left button), and look at their scroll bars.

Expected results
1. The bottom bar is clearly thicker than the scroll bar inside a column (about twice as thick).
2. The handle is at least about half as wide as one technician column, at every window size. On a location with only a few technicians it can be much longer; that is correct.
3. Dragging right reaches the last technician; dragging left comes back to the first. Unassigned stays in place on the left the whole time.
4. In Dark the bar and handle are still easy to see.
5. Tech View and List keep their usual thin scroll bars; nothing changed there.
6. In Firefox the bottom bar looks like Firefox's normal scroll bar; that is correct.
---
This is the expected behaviour as per epic SV-10043, story SV-10046 and the Work Orders — Board View & Tech View Display Options specification version 65 (S3-E2).

AUTOMATION: READY

refs: SV-11466, SV-10046 (S3-E2, spec v65)

## Change 2 — refresh the old case's spec quote
Replace the S3-E2 quote in tests/view/3481897 with the version 65 text and re-stamp its source line to version 65.
No step or expected result changes there.
