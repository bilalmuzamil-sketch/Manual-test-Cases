# Notes — Credit terms design drive (23 Oct 2026)

Running notes of the design drive. Anything that did not render, could not be done, or looks wrong in the drawing itself.

## Rendering
- All 9 boards rendered in Chromium (Playwright 1.56.1, `/opt/pw-browsers/chromium`), each at its own canvas width (7488 or 4512 px),
  light theme (every board's root is `data-theme="light"`; no board draws dark). 62 figures screenshotted to `images/`
  (`ct-p<page>-<nn>-<slug>.png`), one per figure. Log: `render/render-log.json`.
- The only failed request on every board is `./support.js` (net::ERR_FILE_NOT_FOUND): the canvas runtime injects it and it was not
  published. Nothing visible depends on it: each board's script is the empty stub `class Component extends DCLogic { renderVals(){ return {}; } }`.
- Material Icons / Material Icons Outlined come from Google Fonts. Fetched once with curl through the proxy into `cache/` and served to
  the browser by route (no TLS change). Inter 400/500/600/700 load from the design system's `fonts/` folder (kept out of git).
  Inter Display and the other Inter weights named in `tokens.css` are not in the package (404 locally); no board uses them.
- The 25 screenshots under `project/shots/` load at their natural size (22 are 1440x900; `before-new-customer.png`,
  `before-customer-page.png`, `before-edit-customer.png` are 1600x1000 and are drawn scaled to 1440x900 on the boards).

## Interactivity (Rule 120)
- The boards have NO interactive content: no `title=` attributes, no `:hover` rules, no `onclick`, no script beyond the empty stub,
  no `is_interactive` flag in `canvas.json`. Every hover, menu, tooltip, dialog and toast is drawn as a separate static figure.
  So "click every clickable / hover every hover target" = every drawn state was screenshotted and its text and look recorded; there
  is nothing a click or hover reveals that is not already drawn (checked: zero hover rules, zero handlers, zero hidden-until-hover text).
- Accessible names that are never visible (aria-label): "Actions for {term}", "More actions", "Close", "Always available" (lock icon),
  the info icons' tooltip text, "Add representative", "Remove Sales Representative - …". Listed in the text inventory as LOOK-ONLY.

## Things that look wrong in the drawing itself (data, not behaviour)
- p6 "Customer on a deactivated term": the customer card says Credit limit "$0.00" while the Edit Customer window for the same
  customer shows "$ 5,000.00" (and the caption says "the Net 10 customer above shows $5,000.00"). Demo-data mismatch.
- p8 "Still warns: limit above $0 exceeded": the card behind the warning shows Credit term "Net 45", Credit limit "$0.00", yet the
  board is the "limit above $0" case. Demo data; a design case must not tell the tester to compare that card value.
- p6 fig 5 "This customer's picker": the open Credit Terms list is cut off at the top of the 1440x1000 frame and ends at "Net 90";
  the "Net 10 (Inactive)" row the caption describes ("at the end, selected") is not visible in the drawing. The vendor board
  (p7 fig 7) does draw the equivalent row ("✓ Net 10 (Inactive)" last, selected).
- p7 figs 2, 4, 8 (vendor pickers): the first row (COD, selected with a check in fig 2) is cut off under the top edge of the dialog/frame.
- p6 Edit Customer drawing leaves out fields production shows (Taxes, PO is required; production picture before-edit-customer.png);
  p7 vendor-invoice drawings leave out Manufacturer and Actions columns and the Items cost / Tax rows; p9 invoice drawing leaves out the
  toolbar icons. None of these is a credit-terms element; the captions say only Due date / Terms change.
- p1 board vs build pictures differ in typography and some control styles (table header weight, font, Cancel button grey vs white,
  select style, × colour, checkbox fill). Raised as a question (which picture is the reference for the look).
- p1 fig 16 caption says the build "differs from the PRD" by repeating the error sentence in the log table; PRD v3 (S12 Error Handling,
  §8 last-but-one row) now says exactly that, so the caption is out of date, not the picture.
- p2 fig 7 (build capture r15-limit-confirm.png): behind the "$0" confirmation the Move Customers window's main button shows a spinner
  and its Cancel is greyed while the confirmation is still open.

## Could not do / limits
- Dark theme: not drawn by any board ("Light theme." in every board note). Not rendered as a design state; no dark case planned.
- Widths: every app screen is drawn at 1440 px only. 1536 px is not drawn; see DESIGN-VISUAL-INVENTORY.md for the reflow check.
- Viewer runtime (app.js, app.css, dc-runtime.js, fast-edit-worker.js, viewer fonts) was not downloaded: recorded as "viewer runtime,
  not design content" (read in full for the SSR design on 22 Oct 2026, build/splitting-sales-reps/design-drive-2026-10-19/viewer-code/).
- The container restarted once mid-pass (23 Oct); nothing on disk was lost and no background process was running.
