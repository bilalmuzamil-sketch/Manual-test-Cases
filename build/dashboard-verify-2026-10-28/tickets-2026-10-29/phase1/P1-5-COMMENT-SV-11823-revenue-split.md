<!-- DRAFT COMMENT — NOT POSTED. Post on SV-11823 only after the QA lead's go-ahead (a Jira write).
WHY A COMMENT AND NOT A NEW TICKET: SV-11823 (Mudassir Qamar, Ready to Fix, epic SV-11839) already reports the
negative Revenue split. Milomir's comment of 27 Oct says the fix is built on branch SV-11839 (falls back to
"{count} Invoices" when any share is negative). Chris's answer of 28 Oct is the product decision that ticket asked for.
LIVE ON 28 Oct 2026 (DVI Test, This Month, browser America/Toronto): the Revenue tile reads "Parts 2% · Labor 99% · Other -1%"
(visible at the top left of pictures/P1-1-1-dashboard-technician-efficiency.png).
-->

**Product decision for this ticket (Chris Ward, 28 Oct 2026)**

Chris answered this in "Dashboard and Reports – questions for Chris Ward", question 3:

> Hide the split line whenever any share is negative. Only show it when all three are 0% or more. Defect.

The fix described in the comment above (fall back to "{count} Invoices" when any share is negative) matches this. Please keep the split line whenever all three shares are 0 % or more, including when one of them is exactly 0 %.

Still showing on staging build v26.43.2-f8698cb, 28 Oct 2026: at DVI Test, the Revenue tile on **This Month** reads **"Parts 2% · Labor 99% · Other -1%"** (browser on the location's time zone, America/Toronto).
