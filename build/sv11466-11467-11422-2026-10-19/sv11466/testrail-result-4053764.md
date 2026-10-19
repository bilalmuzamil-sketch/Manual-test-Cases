Tested on staging, build v26.40.19-c850386, on 19 October 2026, signed in as Admin. Result: Passed. This adds the Firefox check to the earlier result.

- Steps 1 to 4: on Staging Heavy Duty - 9919 the bottom scroll bar is 16 px thick; the bar inside the Unassigned column is 10 px.
- Step 5: the grey handle is 150 px; one technician column is 286 px.
- Step 6: dragging the handle right reaches the last technician; dragging left comes back to the first. Unassigned stays on the left.
- Step 7: at 1920, 1440, 1280 and 1024 px wide the handle stays 150 px. On DVI Test (8 technicians) it is longer, most of the bar.
- Step 8: in Dark the bar and handle are easy to see.
- Step 9: Tech View and List keep their thin scroll bars.
- Firefox: the bottom bar is Firefox's own standard scroll bar, as the expected result says.

Ticket QA comment: https://shopview.atlassian.net/browse/SV-11466?focusedCommentId=79018
Attached: three annotated pictures (thickness and handle; drag end to end; Dark and Firefox).
