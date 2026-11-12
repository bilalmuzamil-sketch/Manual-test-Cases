# Re-checking production after the 19 Nov 2026 release

The QA lead will ask for this after the release: open production again, repeat every capture in this folder **with the
same data**, and say for each one whether the release changed it or not.

## Before starting

1. **Read the new version:** `curl -s https://app.shopview.com/ | grep app-version`. Before the release it was
   `v26.45.3-fc08f23`. If it is still that, the release is not installed yet: stop and say so.
2. **Sign in once** (an Admin production login from the QA lead; it ends that user's other sessions, so warn him). Keep the
   password, cookie and login answer in `/tmp/prod/` only (`chmod 600`), never in this folder:
   `login-resp.json` (the `/api/login` answer), `fe-perms.json` and `cookies.txt` (PHPSESSID). `scripts/prod.js` reads them.
3. **Check credit memo CM1-4411 is still there and unused** (customer ZZAUTOTEST SV11744 Q3, $5.00, dated 18 Nov 2026,
   id `8aec796e-7536-43b1-b037-51a88db161de`). If it was used or deleted, section 2 cannot be compared: say so.

## Run the same steps

Copy `scripts/` to a scratch folder, make an `out/` next to them, and run each with
`NODE_PATH=$(npm root -g) node <script>`. Then put the results in a sibling folder named
**"A-R A-P after release 2026-11-19"** with the same sub-folders.

| Script | Sections | Change needed after the release |
|---|---|---|
| `s1.js` | 1 | 🔴 It used the reports' **default** date, which was 10 Nov 2026. After the release the default is a later day, so **set the as-of date to 10 Nov 2026** on each report first |
| `s2.js` | 2 | It clicks "18" in the calendar's current month. Still November ⇒ unchanged. Later than November ⇒ move the calendar back to November 2026 first. If the release adds a customer filter, also tick ZZAUTOTEST SV11744 Q3 (that is what the prep file wanted) |
| `s3.js` | 3 | 🔴 Set Inventory Value and Work In Progress to **as of 10 Nov 2026**, and Sales By Customer to **November 2026** (1–30 Nov 2026), so the files cover the same period. The location stays **Truck Hill 1** |
| `s4to8.js` | 4 to 8 | Unchanged: network off on Sales By Customer; the switcher on A/R Aging Summary; **aqeel transport 56** and **Delete Test** (if the script picks a different first overdue row, click these two by name); untick **Trucks Hill 2**; type **ZZA** then **UTO**; 900 px window |

The scripts find things by the screen's element names (for example `filter_chip_asOfDate`). The release may rename some;
if a script cannot find an element, find the new name in the app's code (Rule 115) rather than guessing, and record the
change: a renamed or moved control is itself a "changed".

## Compare and report

For each of the 8 sections: **changed** or **not changed**, with the before and after side by side, and for every change
whether the release was meant to make it (check the release's own tickets/PRD; the build is never the source of what is
right). Compare the `rows.txt` files line by line, and the CSVs line by line. Also re-check each of the six "Differences
from the prep file" in `README.md`: those are the places a fix is most likely to show.
