### What

In Board View and Tech View, the hand cursor you see over cards, rows and technician headers (and while dragging) can turn pure white with no outline, so it disappears against the white cards. The normal arrow is fine.

The cause: these views use the browser's own grab and grabbing hands. Chrome on Windows draws those itself, ignoring the user's Windows pointer settings, and on some screens they come out white with no outline.

### Fix

* Replace the browser's grab and grabbing hands in Board View and Tech View with our own hand cursors: a white hand with a 2px black outline, the same shapes (open hand while hovering, closed hand while dragging), about 32px.
* Keep the browser's grab / grabbing as the fallback, so a browser that cannot show a custom cursor still shows a hand.
* Apply it everywhere these views use a hand today: Board View cards and column headers, Tech View rows and group headers, and while dragging in either view.
* Nothing else changes: same places, same moments, only the drawing of the hand.

### How to check

* On Windows in Chrome, hover a Board View card, a Tech View row and a technician header: the hand has a clear black outline on white and on blue.
* Drag a card or row: the closed hand keeps its black outline the whole drag.
* List and every other page are unchanged.

### Reproduced

Windows 11, Chrome, standard Windows pointer, one 1920x1080 screen: the browser's grab and grabbing hands went pure white, while a hand drawn with a black outline stayed visible. Chris Ward, 2026-10-20.
