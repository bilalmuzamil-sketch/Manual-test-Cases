# SV-11970 evening re-check — 29 Oct 2026, 8:27–8:55 PM Toronto (00:27–00:55 UTC 30 Oct), staging v26.43.3-8ad4001

Time zones (Rule 99): session change-location DVI Test, browser timezoneId, process TZ, localStorage['timezone'] all America/Toronto;
localStorage['location'] set; header location checked at start and end of every run — VALID true on every run (meta.json in each folder).
Heavy Duty read: all on Asia/Karachi.

| Deposit | Made | Date picked | Saved by server (payment_date) | Finance tab | Customer → Deposits tab |
|---|---|---|---|---|---|
| DEP-4821 (new) | 8:27 PM Toronto, screen | 10/29/2026 (left on today) | 2026-10-29 00:27:28 (= 28 Oct 8:27 PM Toronto) | Oct 29, 2026 ✔ | "Yesterday" (Oct 28) ✘ |
| DEP-4822 (new) | 8:42 PM Toronto, screen | 10/28/2026 (typed) | 2026-10-28 00:42:37 (= 27 Oct 8:42 PM Toronto) | Oct 28, 2026 ✔ | "2 days ago" (Oct 27) ✘ |
| DEP-4818 (28 Oct, build f8698cb) | 8:46 PM Toronto, screen | 10/26/2026 (typed) | 2026-10-27T00:46:11Z (= 26 Oct 8:46 PM Toronto) | Oct 27, 2026 ✘ (still, tonight) | Oct 26, 2026 ✔ |
| DEP-4718 (Heavy Duty, Sep) | 12:20 AM Karachi 17 Sep | — | 2026-09-16T19:20:15Z | Sep 16, 2026 ✘ (still, tonight) | Sep 17 ✔ |

Verdict: the ticket as written (a FRESH late-evening deposit shows the next day on the Finance tab) did NOT reproduce on this build.
- Deposits saved before this build still show the wrong day on the Finance tab (and invoice) tonight.
- New late-evening deposits are now SAVED one day early (picked date + the UTC clock time), so the Finance tab looks right but the
  customer's Deposits tab shows the day before the picked date. The fault has moved, not gone.
- Ticket NOT changed (stored instruction: ask the QA lead first).
Folders: evening/ (DEP-4821), evening-typed/ (DEP-4822), dvi-read-evening-2026-10-29/, dep-dvi-evening-2026-10-29*/, hd-read-evening-2026-10-29/, server*.json here.
Test data left in place (ZZAUTOTEST, Held): DEP-4821, DEP-4822 on S1-38222.
