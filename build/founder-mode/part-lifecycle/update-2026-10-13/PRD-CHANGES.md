# Part Lifecycle PRD — what changed from v26 (8 Oct) to v27 (edited 9 Oct 2026)

Script comparison of the requirement lines and §8 rows; full line diff in `../sources/prd-diff-v26-to-2026-10-13.txt`. Product's reasons: `../po-answers-2026-10-09/ANSWERS-Chris-Ward-2026-10-09.md`.

Requirement codes: v26 288, v27 290.

## Added
- **S10-R12a:** The counts include only the parts the user selected. A core that changes with its part is not counted, so changing 2 parts that both have a core reads "2 parts updated."
- **S11-E4:** If a Part Library entry is deleted while its detail page is open elsewhere, for example in another browser tab, saving that page is refused with "Part Library entry not found."
- **S7-N5c:** The check never counts the part being saved. Changing a part's number only in upper and lower case, hyphens, asterisks, periods or spaces, for example FF-5507 to FF5507, saves when no other part at the location matches it.
- **S9-R10b:** The warning names each part by the inventory part's own number, as it shows on the Inactive tab, not by the number as typed in the canned job.

## Removed (cases resting only on these are proposed for retirement)
- **S5-R14** (v26): The dashboard's Critical Reorder list leaves out untracked parts.
- **S9-E12** (v26): The dashboard's Critical Reorder list leaves out inactive parts.

## Reworded
- **S13-R13** v26: That message shows only while the typed description differs from the saved one, ignoring spaces before and after it.
  - v27: That message shows only while the typed description differs from the saved one, ignoring spaces before and after it. Parts at other locations count whether they are active or inactive.
- **S13-R4a** v26: Vendor is hidden where the screen that opens the dialog hides it. Cost, Average Cost, Sell Price and Core Charge show only to a user who can see financial data. Min and Max show only while tracking is on (S4-R5).
  - v27: Vendor always shows. Cost, Average Cost, Sell Price and Core Charge show only to a user who can see financial data. Min and Max show only while tracking is on (S4-R5).
- **S7-N5a** v26: If the location stocks both an active and an inactive part with that number, the save is refused with the message of S7-N3.
  - v27: If the location stocks both an active and an inactive part with that number, the save is refused with the message of S7-N3. The message names the active part's number.

## §8 User Feedback Summary rows

## Outside requirement lines
- Accounting bullet added: Inventory Value figures already saved for past dates keep their values; the count of bins below zero applies only from release on.
- Out of scope reorder bullet now mentions only the Supply filter (S6-R10).
