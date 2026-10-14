# Confluence 829227015 "Parts Lifecycle Update": comments as of 14 Oct 2026 (read in full)

Fetched 2026-10-14 with `getConfluencePageFooterComments` (includeReplies true, repliesPerComment 25, limit 50, sorted by created date, contentFormat markdown; one page, no cursor returned) and `getConfluencePageInlineComments` (includeReplies true) for each resolution status: open, resolved, reopened, dangling.

- **Footer threads:** 2. **Messages:** 7 (2 top-level comments + 5 replies). Same comment ids and the same `createdAt` times as the 13 Oct copy.
- **Inline comments:** 0 open, 0 resolved, 0 reopened, 0 dangling.
- **Newer than 13 Oct 2026: NONE.** The newest message is still Chris Ward's reply of 2026-10-08 13:17:53 UTC.
- **The page moved v27 → v29 (two edits after the 13 Oct copy) with no comment recording either edit.**
- How this file was made: the 14 Oct API bodies were read in full and compared with `confluence-comments-2026-10-13.md` (ids, authors, `createdAt` and closing sentence of every one of the 7 bodies matched). The thread sections below are carried byte for byte from that file; only the "newer than" marker in each heading is restated for the 14 Oct cut-off.
- Authors: account `557058:ead5f72a-46e9-4c4c-adfc-6860a050ad56` is Engineering (the API returns no display name for it); account `712020:aa00b8d6-a71f-4259-8919-82a304227c20` is Chris Ward (Product, page owner).
- All times are UTC as returned (`createdAt`). Bodies below are the API's markdown, unaltered.

---

## Thread 1: root comment 923107341

### 1.0 Comment 923107341, Engineering (557058:ead5f72a…), 2026-10-07T08:45:04.738Z. Newer than 13 Oct 2026: no

**Engineering questions from tech planning — Part Lifecycle**

Thanks Chris, the spec is very complete, and the design canvas covers every board it cites. We checked it against the current app and most of it holds. Below are the places where the spec and the app disagree, or where two engineers could build it differently. Each one has a suggested answer, so a one-line "OK" settles it.

**Blocking: we've paused these parts of the plan until we hear back**

1. **Global search shows inventory parts (Out of scope, "The global search bar").** The spec leaves global search out because "it returns Part Library entries rather than inventory parts." For shops with the new search turned on, it now returns inventory parts at the current location, and clicking one opens the part. So a retired part would still show up there. _We suggest:_ keep inactive parts findable in global search, since it's a way to open a part, not to add it to work, with the same grey "Inactive" tag used in returns. The alternative is to hide them. Which do you want?
2. **Linking on create and refusing on rename use different matches (S7-R4, S13-N1).** Say the Part Library has "BRAKE-01". Creating a part numbered "brake01" gives the new part its own entry, because linking needs an exact match (by design). But renaming a part to "brake01" is refused, because S13-N1 ignores case and punctuation. So the same two numbers can coexist through one door but not the other. _We suggest:_ S13-N1 refuses only an exact match (same characters, same case), so a rename follows the same rule as create. The public API's "already exists" refusal ignores case and punctuation today, and we'd leave it as is.
3. **Untracked parts still raise reorder signals (Goals vs. Out of scope).** The Goals say "No stockout or reorder signals for items the shop knows it cannot count", but Out of scope lists "Reorder and stockout alert changes." The dashboard's Critical Reorder list compares quantity to Min/Max, and an untracked part keeps its saved Min/Max (S5-R4), so it keeps appearing there. _We suggest:_ the Critical Reorder list leaves out untracked parts and inactive parts. Nothing else about reorder changes, and the dashboard's stock-value figures still include both, per S9-E11.
4. **Canned job warnings, one per part (S9-R10, S9-R10a).** A canned job holding eight retired parts shows eight warnings, and each stays until it's closed. _We suggest:_ one warning per canned job that lists every part and fee left out: "These parts are inactive and were not added: A, B, C." OK, or keep one per part?
5. **Searching "not" or "tracked" (S6-R1, S6-R2).** As written, typing "not" returns only untracked parts, so a part described "NOTCHED BELT" or numbered "NOT-450" can't be found by that word. _We suggest:_ those terms return the untracked parts **plus** the normal matches on number, description and tags.

**Should fix: we'll build to the suggested answer unless you say otherwise**

6. **Release day.** S1-R5 says every existing part is active. _We suggest_ adding that every existing part is tracked on release day, and that the feature turns on for every shop at once, with no rollout flag.
7. **Export (S1-R9).** _We suggest:_ an untracked part exports "Not Tracked" in the quantity column, the same as on screen. No new status column, since the tab already says which.
8. **Turning tracking off takes value out of the Inventory Value report (S4-R9, S5-R5).** No confirmation is fine, but a shop won't be able to tell why its Inventory Value dropped. The dashboard's stock-value figures keep untracked parts, so the two will no longer agree. _We suggest_ extending the info text in S4-R3: "Tracked parts keep a stock count, with Min and Max. Turn this off for items you don't count. Untracked parts are left out of the Inventory Value report."
9. **Part Library wording (S12-R11).**

    * "A part from the Part Library must have Vendor as its source." doesn't exist in the app today. _We suggest_ dropping it.
    * "This Part Library entry is used by inventory parts and cannot be deleted." replaces a message that also fires when the entry is used by a part request or a return. _We suggest:_ "This Part Library entry is in use and cannot be deleted."
    * Some strings the story doesn't list still say Catalog or Catalogue: the browser tab titles ("Parts Catalogue", "Catalogue Part"), the delete confirmation ("Are you sure you want to delete this catalogue part?"), and the lookup subtitle for recently ordered special parts ("Catalog · {vendor}"). _We suggest_ renaming all of them to Part Library.
    

**FYI, no answer needed**

10. The CSV import ignores upper and lower case when it matches a number, but it does **not** ignore punctuation (Out of scope says it ignores both). We're not changing it, just correcting the description.
11. S11-R6: raising a part request doesn't create a Part Library entry. The entry is created when the requested part is received. The outcome is the same, only the timing differs.

### 1.1 Reply 923631622 (to 923107341), Engineering (557058:ead5f72a…), 2026-10-07T10:48:54.974Z. Newer than 13 Oct 2026: no

**Follow-up: a few more from the detailed planning**

Six more came up while we mapped the spec to the code. Same format, each with a suggested answer:

1. **Category when a new part links to an existing entry (S7-R6).** S7-R6 says a linked entry keeps its description, R6a covers tags and R6b covers manufacturer, but category isn't mentioned. Today, adding a part overwrites the shared entry's category with the one picked in the dialog, which changes it at every location. _We suggest:_ the linked entry keeps its own category, like its description.
2. **Supply filter and untracked parts (Goals).** The Inventory list's Supply filter (under-, well- and over-supplied) compares bin quantities to Min/Max, so untracked parts still show up as under-supplied. _We suggest:_ untracked parts show only under "All" in the Supply filter. This is the same idea as item 3 of the first comment.
3. **Renaming from the Part Library detail page (S11-E2, S11-R3).** An entry can still be edited from its detail page. _We suggest:_ a number or description change made there follows the same rules as the part dialog: the "already belongs to another part" refusal (S13-N1), carrying the new number to open work (S13-R19), and the Part History entries at every location (S10-R23 to R25).
4. **Vendor bills not yet accepted (S13-R19).** A vendor bill that hasn't been accepted yet also holds its own copy of the part number. _We suggest:_ those lines take the new number too, so accepting the bill still finds the part. Accepted bills keep the old number, like other completed records.
5. **Very long part numbers (S13-R19).** Part requests can store at most 50 characters, while a part number can be up to 255. Until we widen that, a rename that would put a longer number on an open part request can't be carried over. _We suggest_ refusing that save with: "Part number can't be longer than 50 characters while it's on an open part request." This is rare: it only applies to numbers over 50 characters.
6. **Column headers (S4-R8, boards 5.3 and 5.7).** The boards show "Total Quantity" and "Average Cost", but the list currently reads "Total Qty" and "Avg Cost". They were shortened recently so the list fits a 1920px screen. _We suggest_ keeping the short labels. S4-R8's "Total Quantity column" means that column.

### 1.2 Reply 926121990 (to 923107341), Engineering (557058:ead5f72a…), 2026-10-08T07:42:39.732Z. Newer than 13 Oct 2026: no

**Two small confirmations from the final check**

1. **S8-N1, "save an untracked part by any route".** We read this as: creating an untracked part or changing a part's tracking needs the Delete access. Editing other fields of a part that's already untracked (price, bins, description) keeps today's edit access. Read literally, a user who can edit parts but can't delete them could no longer change the price of an untracked part. _We suggest_ the narrower reading. OK?
2. **Bulk partial-failure toast.** The table gives "{n} parts updated, {m} could not be changed." With one success it reads "1 parts updated, 1 could not be changed." _We suggest_ "1 part updated, 1 could not be changed.", using the singular as the all-succeeded toast already does.

We're building to both suggestions in the meantime.

### 1.3 Reply 927858689 (to 923107341), Chris Ward (712020:aa00b8d6…), 2026-10-08T13:17:53.561Z. Newer than 13 Oct 2026: no

Both OK, and the page is now v26.

1. S8-N1: yes, the narrower reading. Delete access is needed only to create an untracked part (S8-N1) or to change a part's tracking (S8-N2). Editing anything else on a part that's already untracked, like price, bins or description, keeps today's edit access (new S8-N1a).
2. Toast: yes, "1 part updated, 1 could not be changed." for one, the same as the all-succeeded toast.

Since you're already building to both, nothing changes on your side.

---

## Thread 2: root comment 924876801

### 2.0 Comment 924876801, Chris Ward (712020:aa00b8d6…), 2026-10-07T13:14:11.643Z. Newer than 13 Oct 2026: no

🔎 PRD Review · v22 · 2026-10-07 · READY · PRD + codebase

Thanks for the planning questions. All 17 are answered below, along with 3 more the codebase check found. Every answer is now written into the page (v21; v22 updates the Status row).

**Open: Product**

None.

**Decided by Product**

1. Global search keeps inactive parts. They carry the grey "Inactive" tag, and selecting one opens the Inactive tab. An untracked part shows "Not Tracked" in place of the stock badge (S9-R18 to S9-R20).
2. A rename is refused only on an exact match (same characters, same case), the same rule create uses to link. The public API check stays as it is (S13-N1).
3. The dashboard's Critical Reorder list leaves out untracked and inactive parts. The Supply filter shows untracked parts only under "All". Nothing else about reorder changes (S5-R14, S6-R10, S9-E12).
4. A canned job shows one warning that lists every part and fee left out (S9-R10, S9-R10a).
5. "not", "tracked" and "not tracked" return the untracked parts plus the normal matches (S6-R1).
6. Default Sorting ships after Part Lifecycle, so S6-R6, S6-R8 and S6-R9 stay as written here.
7. A new part that links to an existing entry leaves that entry's category unchanged (S7-R6c).
8. Changing an entry's number or description from its Part Library page follows the part dialog's rules: the refusal, carrying the new number to open work, and Part History at every location (S11-R3a).
9. Parts that already share a number at one location (ignoring case and punctuation) stay as they are. The duplicate check runs only on create and on a number change (S7-N5b).
10. Every existing part is tracked on release day. The feature is on for every shop at once, with no rollout setting (S1-R5a, S1-R5b).
11. An untracked part exports "Not Tracked" in the quantity column. There is no status column (S1-R9a).
12. The tracking info text adds "Untracked parts are left out of the Inventory Value report." (S4-R3).
13. Part Library wording:

    * The delete refusal reads "This Part Library entry is in use and cannot be deleted."
    * The Vendor-source message is kept and renamed, because it still exists.
    * Tab titles, the delete confirmation and the special-order lookup subtitle move to Part Library (S12-R11 to S12-R14).
    
14. Lines on vendor bills not yet accepted take the new number. Accepted bills keep the old one (S13-R19, S13-R19b).
15. A rename that would put a number over 50 characters on an open part request is refused with "Part number can't be longer than 50 characters while it's on an open part request." (S13-N7).
16. The list keeps "Total Qty" and "Avg Cost". The PRD now says "Total Qty".
17. Pointing a part at a different Part Library entry is removed from the dialog, and the system refuses it by any other route (Key Decisions, S13-E1).
18. Inventory Value for a past date shows the number as it was on that date. Dates before release count every part as tracked.
19. User access does not change. Status, tracking and Delete Part follow exactly the access that deleting an inventory part has today, both on screen and in what the system accepts (Key Decisions, S8-R14, S8-R15).
20. Without View, the vendor return and credit part search shows the standard access error, as it does today (S9-N3).

Your FYIs: the CSV import description now states the real rule (case first, then hyphens, asterisks, periods and spaces). S11-R6 now says a part request creates its entry when the part is received.

**For engineering**

* Several role settings carry the delete right for inventory parts behind the scenes. Keep the server check and the on-screen check exactly as they are for deleting an inventory part today.
* Global search needs a status for parts and a tracked state for the badge, which means an index change and a rebuild.
* The Inventory list's part endpoint is also used by the return and credit part pickers. A default of active parts only would break S9-R11.
* S9-R16 also has to close the special order that is committed when the field loses focus, and the always-on offer row on purchase order screens. S9-R17 is the backstop.
* The standalone Part Library create route and the re-point route have to be refused at the server.
* An untracked part with no bins is refused by the part save today, because the bin checks run unconditionally.
* Canned job apply returns only the new line, so the single warning needs a response shape.
* The Inventory Value daily snapshot needs a tracked column.
* The work order bulk bar is specific to work orders. Its X has no hover text yet (S2-R9).

### 2.1 Reply 925499393 (to 924876801), Chris Ward (712020:aa00b8d6…), 2026-10-07T15:04:56.661Z. Newer than 13 Oct 2026: no

v23 adds four requirements found while building the local, all decided by Product: S13-N8 (refusal message when a part is pointed at a different Part Library entry), S13-R19 reworded plus S13-R19c (accepting a delivery uses the part’s current number, even if the Receive screen was opened before a rename), S13-R19d (renames through the public API follow the part dialog’s rules), and S11-R3b (the Part Library page keeps a part number exactly as typed). The verdict stays READY.

### 2.2 Reply 924221611 (to 924876801), Chris Ward (712020:aa00b8d6…), 2026-10-07T15:44:07.297Z. Newer than 13 Oct 2026: no

Thanks for flagging the in-flight work. We checked all five PRs (#3528, #3294, #3384, #3489, #3486) and SV-10645, SV-10033, SV-9827 and SV-10628 against the PRD. None of them conflicts with it. Where they raised new questions, Product has decided, and the page is now v24:

1. A parts import can change Min, Max and bin quantities on an untracked part, and Part History records it (S5-E1).
2. The "Min/Max updated" history entry from #3528 is accepted as written, and Part History search finds it (S10-R22a).
3. A part number that differs from the saved one only by spaces at the start or end is not a rename (S13-N3a).
4. Every way a part number reaches the Part Library removes spaces at the start and end first (S11-R6a). The screens #3384 doesn’t cover (purchase order edits, deliveries, part edits) need a follow-up ticket.
5. The parts import never moves a part to a different Part Library entry, and never changes an entry’s part number (S13-N9).
6. A Part Library entry only counts as having a manufacturer when that manufacturer really exists in the shop (S7-R6d). The SV-10033 cleanup needs to run before Part Lifecycle is released.
7. A line that holds a now-inactive part keeps working on part sales too, including completed ones (S9-E1).
8. A blank Manufacturer cell in the parts import leaves the manufacturer as it is (S9-E8a).
9. A change made through the public API shows "| Changed through: Public API" in Part History (S10-R25a).
10. Receiving uses the renamed part’s current number only for lines tied to that part. A part number typed by hand on a line is received as typed (S13-R19c).

Suggested release order: #3489, then #3528, then #3384 and #3486, then #3294 once the SV-10033 cleanup has run, then Part Lifecycle.

Two notes for the team: #3528 and Part Lifecycle both change Part History, so that merge needs care. The #3294 review also flagged that a public API part update can reach a part from another shop.


## Observation (fact, not a question raised)

Between the 13 Oct copy (v27) and this one (v29) the page gained 12 requirement codes and reworded 4, and every mention of "the dashboard" was removed (§2 Accounting bullet and S9-E11). No comment records why. See `../SOURCE-CHECK-2026-10-14.md`.
