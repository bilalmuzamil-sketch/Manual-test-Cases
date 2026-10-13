

========== C154776 · section 20474 (S7 Create a part without a library item)
TITLE: New Inventory Part opens with Description then Part Number, no library pick
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: no part numbered [Part-A] exists at [Loc-1] (the case creates it). [Part-A] and [Desc-A] are examples; any unused ZZAUTOTEST values work.
--- STEPS
- Parts → Inventory → click New Inventory Part.
- Click into the first field of the dialog and type [Desc-A].
- Press Tab once and type [Part-A].
- Pick any Category (e.g. Uncategorized) and type 10.00 in Cost.
- Click Save.
- Type [Part-A] in the Inventory search.
--- EXPECTED
Expected results
- Step 1: a window titled "New Inventory Part" opens. Its first field is "Description" and the field after it is "Part Number". There is no Part Library (or Catalog Part) field anywhere in the window and no lookup list opens.
- Step 2: the first field (Description) takes the typed text as typed.
- Step 3: Tab moves the cursor from Description to Part Number, which takes [Part-A] as plain typed text (no list to pick from).
- Step 5: the window closes and the part is saved; no Part Library step was asked for.
- Step 6: one row shows Description [Desc-A] and Part Number [Part-A].
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-R1, S7-R2, read 8 Oct 2026; design canvas board 1.1 (New Inventory Part opens), board 1.3 (Number and description typed). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-R1: “The New Inventory Part dialog has a Description field, followed by a Part Number field. Both are free text.”
- S7-R2: “The dialog has no Part Library selector and no Part Library lookup step.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: New Inventory Part opens with Description then Part Number, no library pick
Test case: C154776, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: no part numbered [Part-A] exists at [Loc-1] (the case creates it). [Part-A] and [Desc-A] are examples; any unused ZZAUTOTEST values work.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-TYPED-01 and [Desc-A] = ZZAUTOTEST PL TYPED PART (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- Check the setup worked: Parts → Inventory → type [Part-A] in the search → the Active and Inactive tabs both show no row. If a row exists, use the next suffix (-02, -03…) and write it down as [Part-A].



========== C154777 · section 20474 (S7 Create a part without a library item)
TITLE: A number that exactly matches one Part Library entry links to it
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: exactly one Part Library entry has the number [Part-A]; it is stocked at [Loc-2] only, with the description [Lib-Desc].
- [Loc-1] stocks no part numbered [Part-A].
- Must hold: the number typed at [Loc-1] has exactly the same characters and upper and lower case as [Part-A]; [Typed-Desc] differs from [Lib-Desc] by more than upper and lower case. Names are examples.
--- STEPS
- At [Loc-1]: Parts → Inventory → click New Inventory Part.
- Type [Typed-Desc] in Description.
- Type [Part-A] in Part Number, exactly as written down.
- Pick any Category and type 10.00 in Cost.
- Click Save.
- Type [Part-A] in the Inventory search.
- Parts → Part Library → type [Part-A] in the search.
- Click the [Part-A] row.
--- EXPECTED
Expected results
- Step 5: the window closes and a green success message reads exactly: "Part created. Linked to [Part-A] in the Part Library. Its description "[Lib-Desc]" was kept." It disappears on its own.
- Step 6: one row shows Part Number [Part-A] with Description [Lib-Desc] (the library description, not [Typed-Desc]).
- Step 7: still exactly one row for [Part-A], Description [Lib-Desc] (no second entry was made).
- Step 8: the entry's page lists two workplaces under Parts, [Loc-2] and [Loc-1] (Total parts 1 + 1 = 2).
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-R4, S7-R5, S7-R6, S7-R9, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 1.3 (Number and description typed), board 1.4 (Saved and linked to the Part Library entry), board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-R4: “On save, the system looks for a Part Library entry whose number is exactly the number typed, including upper and lower case.”
- S7-R5: “If exactly one entry matches, the new part is linked to that entry.”
- S7-R6: “A linked entry keeps its own description. The description typed in the dialog does not change it.”
- S7-R9: “When the part was linked to an existing entry whose description differs from the one typed, ignoring upper and lower case and spaces before and after, the system shows "Part created. Linked to {part number} in the Part Library. Its description "{library description}" was kept." For example: "Part created. Linked to N68SL-356 in the Part Library. Its description "BRAKE PAD" was kept."”
- PRD §8 User Feedback Summary (New part linked to an entry whose description differs): “"Part created. Linked to {part number} in the Part Library. Its description "{library description}" was kept."”
- PRD §8 User Feedback Summary (New part linked to an entry whose description differs) — Behavior: “Success toast, fades on its own”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A number that exactly matches one Part Library entry links to it
Test case: C154777, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: exactly one Part Library entry has the number [Part-A]; it is stocked at [Loc-2] only, with the description [Lib-Desc].
- [Loc-1] stocks no part numbered [Part-A].
- Must hold: the number typed at [Loc-1] has exactly the same characters and upper and lower case as [Part-A]; [Typed-Desc] differs from [Lib-Desc] by more than upper and lower case. Names are examples.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-LINK-01, [Lib-Desc] = ZZAUTOTEST PL Link Library, [Typed-Desc] = ZZAUTOTEST PL LINK TYPED LEFT (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- Pick [Loc-2] in the location switcher.
- At [Loc-2]: Parts → Inventory → New Inventory Part → Description: [Lib-Desc] → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-1] in the location switcher.
- Check the setup worked: Parts → Part Library → search [Part-A] → exactly one row, Description [Lib-Desc]. Parts → Inventory at [Loc-1] → search [Part-A] → no row. If the Part Library shows more than one row, use a new suffix and start again.



========== C154778 · section 20474 (S7 Create a part without a library item)
TITLE: A number held by two Part Library entries gets a new entry of its own
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: two Part Library entries that have exactly the same part number [Dup-No] (same characters, same upper and lower case). Such pairs can only come from before the release; this build cannot make new ones.
- [Loc-1] stocks no part whose number is [Dup-No], ignoring upper and lower case, hyphens, asterisks, periods and spaces.
- [Dup-No] is whatever the build holds; [Own-Desc] is an example.
--- STEPS
- At [Loc-1]: Parts → Inventory → click New Inventory Part.
- Type [Own-Desc] in Description.
- Type [Dup-No] in Part Number, exactly as written down.
- Pick any Category and type 10.00 in Cost.
- Click Save.
- Parts → Part Library → type [Dup-No] in the search.
- Parts → Inventory → type [Dup-No] in the search.
--- EXPECTED
Expected results
- Step 5: the part is saved and the window closes. No "Linked to … in the Part Library" message appears.
- Step 6: three rows now show [Dup-No]: the two old entries with [Desc-1] and [Desc-2], unchanged, and a new one with Description [Own-Desc] (2 + 1 = 3).
- Step 7: one row at [Loc-1] shows [Dup-No] with Description [Own-Desc].
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-R8, S7-R10, Story 7 context note, read 8 Oct 2026; design canvas board 1.4 (Saved and linked to the Part Library entry). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-R8: “If more than one entry matches, the system creates a Part Library entry of its own for the new part.”
- S7-R10: “No message about the Part Library is shown when the descriptions match, or when a new entry is created.”
- PRD Story 7 context note: “A number that matches several entries exactly, or none, never gets guessed onto one of them.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A number held by two Part Library entries gets a new entry of its own
Test case: C154778, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: two Part Library entries that have exactly the same part number [Dup-No] (same characters, same upper and lower case). Such pairs can only come from before the release; this build cannot make new ones.
- [Loc-1] stocks no part whose number is [Dup-No], ignoring upper and lower case, hyphens, asterisks, periods and spaces.
- [Dup-No] is whatever the build holds; [Own-Desc] is an example.
# Part 1. Setup for manual QA tester
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- Parts → Part Library → click the Part Number column header to sort by number → scroll until two rows show exactly the same Part Number. [Dup-No] = that number; [Desc-1] and [Desc-2] = the two descriptions.
- Parts → Inventory at [Loc-1] → search [Dup-No] → there must be no row on the Active or the Inactive tab. If there is one, pick another location that stocks neither and use it as [Loc-1].
- Write down: [Own-Desc] = ZZAUTOTEST PL DUP OWN ENTRY (example).
- Check the setup worked: Part Library search [Dup-No] shows exactly two rows with that exact number. If the build holds no such pair, mark the case Blocked with the comment 'no Part Library number is held by two entries on this build'.



========== C154779 · section 20474 (S7 Create a part without a library item)
TITLE: Description and Part Number must be filled to save a new part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: none at the start; the case creates [Part-A].
--- STEPS
- Parts → Inventory → click New Inventory Part.
- Click Save without typing anything.
- Type three spaces in Description and three spaces in Part Number.
- Click Save.
- Replace the spaces in Description with [Desc-A].
- Click Save.
- Replace the spaces in Part Number with [Part-A], pick any Category and type 10.00 in Cost.
- Click Save.
- Type [Part-A] in the Inventory search.
--- EXPECTED
Expected results
- Step 2: Description turns red with "Description is a required field" under it and Part Number turns red with "Part number is a required field" under it, both at the same time. The window stays open. (The design also flags Category and Cost with "Category is a required field" and "Cost is a required field", as today.)
- Step 4: both messages are still shown: fields holding only spaces count as empty. Nothing is saved.
- Step 6: the Description message has gone; "Part number is a required field" is still shown and nothing is saved.
- Step 8: the window closes and the part is saved.
- Step 9: one row shows [Part-A] with Description [Desc-A].
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-N1, S7-N2, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 1.2 (Save with nothing filled); design annotation on page 1 ('Category and Cost are required, as they are today'). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-N1: “Description is required. Left empty, or holding only spaces, the field shows "Description is a required field" and the part is not saved.”
- S7-N2: “Part Number is required. Left empty, or holding only spaces, the field shows "Part number is a required field" and the part is not saved.”
- PRD §8 User Feedback Summary (Description field empty or only spaces): “"Description is a required field"”
- PRD §8 User Feedback Summary (Description field empty or only spaces) — Behavior: “Inline error on the field, stays until corrected”
- PRD §8 User Feedback Summary (Part Number field empty or only spaces): “"Part number is a required field"”
- PRD §8 User Feedback Summary (Part Number field empty or only spaces) — Behavior: “Inline error on the field, stays until corrected”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Description and Part Number must be filled to save a new part
Test case: C154779, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: none at the start; the case creates [Part-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-REQ-01 and [Desc-A] = ZZAUTOTEST PL REQUIRED (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- Check the setup worked: Parts → Inventory → search [Part-A] → no row (if one exists, use the next suffix).



========== C425669 · section 20474 (S7 Create a part without a library item)
TITLE: Spaces before and after the number and description are removed on save
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: no part numbered [Part-A] at [Loc-1].
--- STEPS
- Parts → Inventory → click New Inventory Part.
- In Description type three spaces, then [Desc-A], then three spaces.
- In Part Number type three spaces, then [Part-A], then three spaces.
- Pick any Category, type 10.00 in Cost and click Save.
- Type [Part-A] in the Inventory search and click the row.
- Click at the very end of the Part Number text and press Backspace once.
- Click Cancel.
- Parts → Part Library → type [Part-A] in the search.
--- EXPECTED
Expected results
- Step 4: the part is saved and the window closes.
- Step 5: the row and the Edit Inventory Part window show Description [Desc-A] and Part Number [Part-A] with no spaces before or after them.
- Step 6: Backspace removes the last character of [Part-A] (the final '1'), proving no space was kept at the end.
- Step 7: the window closes without saving.
- Step 8: one entry shows Part Number [Part-A] and Description [Desc-A], with no spaces around them.
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-R3, read 8 Oct 2026; design canvas board 1.3 (Number and description typed). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-R3: “Spaces before and after the part number and the description are removed on save.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Spaces before and after the number and description are removed on save
Test case: C425669, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: no part numbered [Part-A] at [Loc-1].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-TRIM-01 and [Desc-A] = ZZAUTOTEST PL TRIM DESC (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- Check the setup worked: Parts → Inventory → search [Part-A] → no row (if one exists, use the next suffix).



========== C425670 · section 20474 (S7 Create a part without a library item)
TITLE: A linked Part Library entry keeps its tags and gains the new ones
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: one Part Library entry [Part-A], stocked at [Loc-2] only, carrying exactly two tags [Tag-1] and [Tag-2]. [Loc-1] does not stock [Part-A]. Tag names are examples.
--- STEPS
- At [Loc-1]: Parts → Inventory → click New Inventory Part.
- Type ZZAUTOTEST PL Tags Library in Description and [Part-A] in Part Number.
- Click Tags, type [Tag-3] and press Enter.
- Pick any Category, type 10.00 in Cost and click Save.
- Parts → Part Library → type [Part-A] in the search.
--- EXPECTED
Expected results
- Step 4: the part is saved and the window closes.
- Step 5: the one [Part-A] row shows three tags: [Tag-1], [Tag-2] and [Tag-3] (2 kept + 1 added = 3). None was removed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-R6a, read 8 Oct 2026; design canvas board 1.3 (Number and description typed), board 7.1 (Part Library). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-R6a: “A linked entry keeps all its tags. Tags typed on the new part are added to them, and none are removed.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A linked Part Library entry keeps its tags and gains the new ones
Test case: C425670, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: one Part Library entry [Part-A], stocked at [Loc-2] only, carrying exactly two tags [Tag-1] and [Tag-2]. [Loc-1] does not stock [Part-A]. Tag names are examples.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-TAGS-01, [Tag-1] = ZZTAGOLD1, [Tag-2] = ZZTAGOLD2, [Tag-3] = ZZTAGNEW3 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- Pick [Loc-2] in the location switcher.
- At [Loc-2]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Tags Library → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → Tags: type [Tag-1], press Enter, type [Tag-2], press Enter → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-1] in the location switcher.
- Check the setup worked: Parts → Part Library → search [Part-A] → one row whose Tags show [Tag-1] and [Tag-2] only.



========== C425671 · section 20474 (S7 Create a part without a library item)
TITLE: A linked entry with no manufacturer takes the one picked on the new part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: one Part Library entry [Part-A], stocked at [Loc-2] only, with the Manufacturer left empty. [Loc-1] does not stock [Part-A].
- [Mfr-X] = any manufacturer offered in the Manufacturer list (example).
--- STEPS
- At [Loc-1]: Parts → Inventory → click New Inventory Part.
- Type ZZAUTOTEST PL Mfr Empty in Description and [Part-A] in Part Number.
- Open Manufacturer and pick [Mfr-X].
- Pick any Category, type 10.00 in Cost and click Save.
- Parts → Part Library → type [Part-A] in the search.
--- EXPECTED
Expected results
- Step 4: the part is saved and the window closes.
- Step 5: the one [Part-A] row now shows Manufacturer [Mfr-X].
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-R6b, S7-R6d, read 8 Oct 2026; design canvas board 1.3 (Number and description typed), board 7.1 (Part Library). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-R6b: “A linked entry with no manufacturer takes the one picked in the dialog. An entry that already has a manufacturer keeps it.”
- S7-R6d: “A linked entry has a manufacturer only when it points to a manufacturer that exists in this organization. An entry that points to none takes the one picked in the dialog.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A linked entry with no manufacturer takes the one picked on the new part
Test case: C425671, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: one Part Library entry [Part-A], stocked at [Loc-2] only, with the Manufacturer left empty. [Loc-1] does not stock [Part-A].
- [Mfr-X] = any manufacturer offered in the Manufacturer list (example).
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-MFREMPTY-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- Pick [Loc-2] in the location switcher.
- At [Loc-2]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Mfr Empty → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → leave Manufacturer empty → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-1] in the location switcher.
- Check the setup worked: Parts → Part Library → search [Part-A] → one row, Manufacturer cell empty. Open New Inventory Part → open the Manufacturer list → note the first name as [Mfr-X] → close the window with Cancel.



========== C425672 · section 20474 (S7 Create a part without a library item)
TITLE: A linked entry keeps the manufacturer it already has
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: one Part Library entry [Part-A], stocked at [Loc-2] only, with Manufacturer [Mfr-1]. [Loc-1] does not stock [Part-A].
- [Mfr-1] and [Mfr-2] = two different manufacturers from the Manufacturer list (examples).
--- STEPS
- At [Loc-1]: Parts → Inventory → click New Inventory Part.
- Type ZZAUTOTEST PL Mfr Keep in Description and [Part-A] in Part Number.
- Open Manufacturer and pick [Mfr-2].
- Pick any Category, type 10.00 in Cost and click Save.
- Parts → Part Library → type [Part-A] in the search.
--- EXPECTED
Expected results
- Step 4: the part is saved and the window closes.
- Step 5: the one [Part-A] row still shows Manufacturer [Mfr-1], not [Mfr-2].
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-R6b, S7-R6d, read 8 Oct 2026; design canvas board 1.3 (Number and description typed), board 7.1 (Part Library). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-R6b: “A linked entry with no manufacturer takes the one picked in the dialog. An entry that already has a manufacturer keeps it.”
- S7-R6d: “A linked entry has a manufacturer only when it points to a manufacturer that exists in this organization. An entry that points to none takes the one picked in the dialog.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A linked entry keeps the manufacturer it already has
Test case: C425672, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: one Part Library entry [Part-A], stocked at [Loc-2] only, with Manufacturer [Mfr-1]. [Loc-1] does not stock [Part-A].
- [Mfr-1] and [Mfr-2] = two different manufacturers from the Manufacturer list (examples).
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-MFRKEEP-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- Open Parts → Inventory → New Inventory Part → open the Manufacturer list → note the first name as [Mfr-1] and the second as [Mfr-2] → Cancel.
- Pick [Loc-2] in the location switcher.
- At [Loc-2]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Mfr Keep → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → Manufacturer: [Mfr-1] → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-1] in the location switcher.
- Check the setup worked: Parts → Part Library → search [Part-A] → one row, Manufacturer [Mfr-1].



========== C425673 · section 20474 (S7 Create a part without a library item)
TITLE: A linked entry keeps its own category
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: one Part Library entry [Part-A], stocked at [Loc-2] only, with Category [Cat-1]. [Loc-1] does not stock [Part-A].
- [Cat-1] and [Cat-2] = two different categories from the Category list (examples).
--- STEPS
- At [Loc-1]: Parts → Inventory → click New Inventory Part.
- Type ZZAUTOTEST PL Cat Keep in Description and [Part-A] in Part Number.
- Open Category and pick [Cat-2].
- Type 10.00 in Cost and click Save.
- Parts → Part Library → type [Part-A] in the search.
--- EXPECTED
Expected results
- Step 4: the part is saved and the window closes.
- Step 5: the one [Part-A] row still shows Category [Cat-1], not [Cat-2].
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-R6c, read 8 Oct 2026; design canvas board 1.3 (Number and description typed), board 7.1 (Part Library). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-R6c: “A linked entry keeps its own category. The category picked in the dialog does not change it.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A linked entry keeps its own category
Test case: C425673, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: one Part Library entry [Part-A], stocked at [Loc-2] only, with Category [Cat-1]. [Loc-1] does not stock [Part-A].
- [Cat-1] and [Cat-2] = two different categories from the Category list (examples).
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-CATKEEP-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- Open Parts → Inventory → New Inventory Part → open the Category list → note one category as [Cat-1] and a different one as [Cat-2] → Cancel.
- Pick [Loc-2] in the location switcher.
- At [Loc-2]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Cat Keep → Part Number: [Part-A] → Category: [Cat-1] → Cost: 10.00 → Save.
- Pick [Loc-1] in the location switcher.
- Check the setup worked: Parts → Part Library → search [Part-A] → one row, Category [Cat-1].



========== C425674 · section 20474 (S7 Create a part without a library item)
TITLE: No Part Library message when the typed description only differs in case
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: one Part Library entry [Part-A], stocked at [Loc-2] only, with Description [Lib-Desc]. [Loc-1] does not stock [Part-A].
- Must hold: the description typed at [Loc-1] differs from [Lib-Desc] only by upper and lower case and spaces before and after.
--- STEPS
- At [Loc-1]: Parts → Inventory → click New Inventory Part.
- In Description type two spaces, then 'zzautotest pl same desc' (all lower case), then two spaces.
- Type [Part-A] in Part Number.
- Pick any Category, type 10.00 in Cost and click Save.
- Parts → Part Library → type [Part-A] in the search.
--- EXPECTED
Expected results
- Step 4: the part is saved and the window closes. No message mentioning the Part Library appears (no "Linked to … was kept" message).
- Step 5: one row for [Part-A], Description still [Lib-Desc].
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-R9, S7-R10, read 8 Oct 2026; design canvas board 1.4 (Saved and linked to the Part Library entry). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-R9: “When the part was linked to an existing entry whose description differs from the one typed, ignoring upper and lower case and spaces before and after, the system shows "Part created. Linked to {part number} in the Part Library. Its description "{library description}" was kept." For example: "Part created. Linked to N68SL-356 in the Part Library. Its description "BRAKE PAD" was kept."”
- S7-R10: “No message about the Part Library is shown when the descriptions match, or when a new entry is created.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: No Part Library message when the typed description only differs in case
Test case: C425674, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: one Part Library entry [Part-A], stocked at [Loc-2] only, with Description [Lib-Desc]. [Loc-1] does not stock [Part-A].
- Must hold: the description typed at [Loc-1] differs from [Lib-Desc] only by upper and lower case and spaces before and after.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-SAMEDESC-01 and [Lib-Desc] = ZZAUTOTEST PL Same Desc (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- Pick [Loc-2] in the location switcher.
- At [Loc-2]: Parts → Inventory → New Inventory Part → Description: [Lib-Desc] → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-1] in the location switcher.
- Check the setup worked: Parts → Part Library → search [Part-A] → one row, Description [Lib-Desc].



========== C425675 · section 20474 (S7 Create a part without a library item)
TITLE: A new number creates its own Part Library entry with no message
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: no Part Library entry has a number equal to [Part-A] in any form (no case or punctuation variant either).
--- STEPS
- Parts → Inventory → click New Inventory Part.
- Type [Desc-A] in Description and [Part-A] in Part Number.
- Pick any Category, type 10.00 in Cost and click Save.
- Parts → Part Library → type [Part-A] in the search.
- Click the [Part-A] row.
--- EXPECTED
Expected results
- Step 3: the part is saved and the window closes. No message mentioning the Part Library appears.
- Step 4: exactly one entry shows Part Number [Part-A] and Description [Desc-A].
- Step 5: the entry's page lists one workplace, [Loc-1] (Total parts 1).
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-R7, S7-R10, read 8 Oct 2026; design canvas board 7.1 (Part Library), board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-R7: “If no entry matches, the system creates a Part Library entry with the typed number and description, and links the part to it.”
- S7-R10: “No message about the Part Library is shown when the descriptions match, or when a new entry is created.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A new number creates its own Part Library entry with no message
Test case: C425675, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: no Part Library entry has a number equal to [Part-A] in any form (no case or punctuation variant either).
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-NEWENTRY-01 and [Desc-A] = ZZAUTOTEST PL New Entry (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- Check the setup worked: Parts → Part Library → search NEWENTRY → no row. If one exists, use the next suffix.



========== C425676 · section 20474 (S7 Create a part without a library item)
TITLE: A number that differs only in upper or lower case is not linked
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: one Part Library entry [Part-A] in upper case, stocked at [Loc-2] only. [Loc-1] stocks no part whose number matches [Part-A] in any form.
- Must hold: [Part-A-lower] is [Part-A] typed entirely in lower case.
--- STEPS
- At [Loc-1]: Parts → Inventory → click New Inventory Part.
- Type [Typed-Desc] in Description and [Part-A-lower] in Part Number.
- Pick any Category, type 10.00 in Cost and click Save.
- Parts → Part Library → type near-01 in the search.
- Parts → Inventory → type near-01 in the search.
--- EXPECTED
Expected results
- Step 3: the part is saved and the window closes. No "Linked to … in the Part Library" message appears.
- Step 4: two separate entries now show: [Part-A] with [Lib-Desc], and [Part-A-lower] (saved in lower case, exactly as typed) with [Typed-Desc] (1 + 1 = 2).
- Step 5: at [Loc-1] one row shows [Part-A-lower] with [Typed-Desc].
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-R4, S7-R7, §4 Key Decisions, read 8 Oct 2026; design canvas board 1.4 (Saved and linked to the Part Library entry), board 7.1 (Part Library). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-R4: “On save, the system looks for a Part Library entry whose number is exactly the number typed, including upper and lower case.”
- S7-R7: “If no entry matches, the system creates a Part Library entry with the typed number and description, and links the part to it.”
- PRD §4 Key Decisions (exact link): “In the New Inventory Part dialog, a new part links to an existing Part Library entry only on an exact match. Exact means the same characters, including upper and lower case. Any other number gets an entry of its own. A near match is never linked, because two different products can share a number that differs only in punctuation, and linking them would merge them.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A number that differs only in upper or lower case is not linked
Test case: C425676, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: one Part Library entry [Part-A] in upper case, stocked at [Loc-2] only. [Loc-1] stocks no part whose number matches [Part-A] in any form.
- Must hold: [Part-A-lower] is [Part-A] typed entirely in lower case.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-NEAR-01, [Part-A-lower] = zzautotest-pl-near-01, [Lib-Desc] = ZZAUTOTEST PL Near Library, [Typed-Desc] = ZZAUTOTEST PL Near Lower (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- Pick [Loc-2] in the location switcher.
- At [Loc-2]: Parts → Inventory → New Inventory Part → Description: [Lib-Desc] → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-1] in the location switcher.
- Check the setup worked: Parts → Part Library → search near-01 → one row, [Part-A]. Parts → Inventory at [Loc-1] → search near-01 → no row.



========== C425677 · section 20474 (S7 Create a part without a library item)
TITLE: A part number already stocked here and active is refused
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: one active part [Part-A] at [Loc-1].
- Must hold: [Try-1] equals [Part-A] once upper and lower case are ignored; [Try-2] equals [Part-A] once case, hyphens, asterisks, periods and spaces are ignored.
--- STEPS
- Parts → Inventory → click New Inventory Part.
- Type ZZAUTOTEST PL Dup Try in Description and [Try-1] in Part Number.
- Pick any Category, type 10.00 in Cost and click Save.
- Replace the Part Number with [Try-2].
- Click Save.
- Click Cancel.
- Type dupact in the Inventory search.
--- EXPECTED
Expected results
- Step 3: the part is not saved. A red message appears: "[Part-A] already exists at this location." (it names the number of the part already there, in its own upper case), with a second, smaller line "Please try to resolve this." under it. It fades by itself after about 3 seconds. The window stays open with the typed values.
- Step 5: the same red message "[Part-A] already exists at this location." appears; hyphens, asterisks, periods and spaces made no difference.
- Step 6: the window closes.
- Step 7: still exactly one row, [Part-A].
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-N3, S7-N5, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 1.5 (The same number again, in lower case). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-N3: “If a part with the same number is already stocked at this location and is active, the save is refused with "{part number} already exists at this location."”
- S7-N5: “For S7-N3 and S7-N4, "the same number" ignores upper and lower case, hyphens, asterisks, periods, spaces and other blank characters. The message names the number of the part already there.”
- PRD §8 User Feedback Summary (New part's number already stocked here, active): “"{part number} already exists at this location."”
- PRD §8 User Feedback Summary (New part's number already stocked here, active) — Behavior: “Error toast, fades after 3 seconds”
- PRD §8 User Feedback Summary context note: “every refusal sent by the system, the rows that fade after 3 seconds, also shows a second, smaller line under the message: "Please try to resolve this."”
- PRD §4 Key Decisions (duplicate at the location): “A new part number already stocked at the location is refused, ignoring case and punctuation. This check stops a second copy of a part at one location. It runs when a part is created or its number is changed, never when a part is saved with its number unchanged.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A part number already stocked here and active is refused
Test case: C425677, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: one active part [Part-A] at [Loc-1].
- Must hold: [Try-1] equals [Part-A] once upper and lower case are ignored; [Try-2] equals [Part-A] once case, hyphens, asterisks, periods and spaces are ignored.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-DUPACT-01, [Try-1] = zzautotest-pl-dupact-01, [Try-2] = zzautotest pl*dup.act 01 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Dup Active → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: Parts → Inventory → Active tab → search dupact → exactly one row, [Part-A].



========== C425678 · section 20474 (S7 Create a part without a library item)
TITLE: A part number already stocked here but inactive is refused
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: one inactive part [Part-A] at [Loc-1] (on the Inactive tab).
- Must hold: [Try-1] equals [Part-A] once upper and lower case, hyphens, asterisks, periods and spaces are ignored.
--- STEPS
- Parts → Inventory → Active tab → click New Inventory Part.
- Type ZZAUTOTEST PL Dup Try in Description and [Try-1] in Part Number.
- Pick any Category, type 10.00 in Cost and click Save.
- Click Cancel.
- Type dupina in the search on the Active tab, then on the Inactive tab.
--- EXPECTED
Expected results
- Step 3: the part is not saved. A red message appears: "[Part-A] already exists at this location and is inactive. Activate it from the Inactive tab." with the second line "Please try to resolve this.". It fades by itself after about 3 seconds. The window stays open.
- Step 4: the window closes.
- Step 5: the Active tab shows no row; the Inactive tab shows the one row [Part-A].
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-N4, S7-N5, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 1.5 (The same number again, in lower case), board 3.5 (The Inactive tab). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-N4: “If a part with the same number is already stocked at this location and is inactive, the save is refused with "{part number} already exists at this location and is inactive. Activate it from the Inactive tab."”
- S7-N5: “For S7-N3 and S7-N4, "the same number" ignores upper and lower case, hyphens, asterisks, periods, spaces and other blank characters. The message names the number of the part already there.”
- PRD §8 User Feedback Summary (New part's number already stocked here, inactive): “"{part number} already exists at this location and is inactive. Activate it from the Inactive tab."”
- PRD §8 User Feedback Summary (New part's number already stocked here, inactive) — Behavior: “Error toast, fades after 3 seconds”
- PRD §8 User Feedback Summary context note: “every refusal sent by the system, the rows that fade after 3 seconds, also shows a second, smaller line under the message: "Please try to resolve this."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A part number already stocked here but inactive is refused
Test case: C425678, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: one inactive part [Part-A] at [Loc-1] (on the Inactive tab).
- Must hold: [Try-1] equals [Part-A] once upper and lower case, hyphens, asterisks, periods and spaces are ignored.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-DUPINA-01 and [Try-1] = ZZAUTOTEST.PL.DUPINA.01 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Dup Inactive → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- At [Loc-1]: Parts → Inventory → Active tab → search [Part-A] → click the row → Part Status: Inactive → Save → click Deactivate in the 'Deactivate part?' window.
- Check the setup worked: Parts → Inventory → Inactive tab → search dupina → one row, [Part-A]; the Active tab shows no row for it.



========== C425679 · section 20474 (S7 Create a part without a library item)
TITLE: Active and inactive copies of one number: the active message is shown
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data at [Loc-1]: two parts whose numbers match once case, hyphens, asterisks, periods and spaces are ignored: [Part-A] (active) and [Part-B] (inactive), on two different Part Library entries.
- This state cannot be made in the part window any more (the duplicate check refuses it); it is made with the parts CSV import, as in Setup.
- Must hold: [Try-1] matches both once case and punctuation are ignored.
--- STEPS
- At [Loc-1]: Parts → Inventory → Active tab → click New Inventory Part.
- Type ZZAUTOTEST PL Both Try in Description and [Try-1] in Part Number.
- Pick any Category, type 10.00 in Cost and click Save.
- Click Cancel.
--- EXPECTED
Expected results
- Step 3: the part is not saved. The red message is the active-part one: "… already exists at this location." naming the number of a part already there (expected [Part-A], the active one), with the second line "Please try to resolve this.". It is NOT the "… and is inactive. Activate it from the Inactive tab." message.
- Step 4: the window closes; no new row was added on either tab.
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-N5a, S7-N3, S7-N5, §2 Out of scope (CSV import matching), read 8 Oct 2026; design canvas board 1.5 (The same number again, in lower case). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-N5a: “If the location stocks both an active and an inactive part with that number, the save is refused with the message of S7-N3.”
- S7-N3: “If a part with the same number is already stocked at this location and is active, the save is refused with "{part number} already exists at this location."”
- S7-N5: “For S7-N3 and S7-N4, "the same number" ignores upper and lower case, hyphens, asterisks, periods, spaces and other blank characters. The message names the number of the part already there.”
- PRD §2 Out of scope (parts CSV import matching): “The import matches a number ignoring upper and lower case. If nothing matches, it also ignores hyphens, asterisks, periods and spaces. It writes the row's description onto the entry it matches. It never moves a part to a different entry and never changes an entry's part number (S13-N9).”
- PRD §8 User Feedback Summary (New part's number already stocked here, active): “"{part number} already exists at this location."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Active and inactive copies of one number: the active message is shown
Test case: C425679, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data at [Loc-1]: two parts whose numbers match once case, hyphens, asterisks, periods and spaces are ignored: [Part-A] (active) and [Part-B] (inactive), on two different Part Library entries.
- This state cannot be made in the part window any more (the duplicate check refuses it); it is made with the parts CSV import, as in Setup.
- Must hold: [Try-1] matches both once case and punctuation are ignored.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-BOTH-01, [Part-B] = ZZAUTOTESTPLBOTH01, [Try-1] = zz autotest pl both 01 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Both Active → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-2] in the location switcher.
- At [Loc-2]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Both Second → Part Number: [Part-B] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save. ([Part-B] gets its own Part Library entry because it is not an exact match.)
- Pick [Loc-1] in the location switcher.
- At [Loc-1]: Settings → Data Import → Inventory → download the template the screen offers → fill ONE row: Part Number [Part-B], Description ZZAUTOTEST PL Both Import, and the other columns the template requires (e.g. Category Uncategorized, Cost 10.00, Quantity 1) → upload the file → run the import.
- At [Loc-1]: Parts → Inventory → Active tab → search [Part-B] → click the row → Part Status: Inactive → Save → click Deactivate in the 'Deactivate part?' window.
- Check the setup worked: Parts → Inventory at [Loc-1] → Active tab → search both → [Part-A] only; Inactive tab → [Part-B] only. If the import refused the row or updated [Part-A] instead, mark the case Blocked with the comment 'could not place two matching numbers at one location'.



========== C425680 · section 20474 (S7 Create a part without a library item)
TITLE: Saving a part with its number unchanged is never refused as a duplicate
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data at [Loc-1]: two active parts [Part-A] and [Part-B] whose numbers match once case, hyphens, asterisks, periods and spaces are ignored, on two different Part Library entries (made with the parts CSV import, as in Setup).
--- STEPS
- At [Loc-1]: Parts → Inventory → search unch → click the [Part-B] row.
- Change Sell Price to 25.00 and click Save.
- Click the [Part-A] row.
- Change Sell Price to 26.00 and click Save.
--- EXPECTED
Expected results
- Step 2: the save goes through, no "already exists at this location" message, the window closes and [Part-B] shows Sell Price $25.00.
- Step 4: the save goes through, the window closes and [Part-A] shows Sell Price $26.00. Both rows are still listed with their own numbers.
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-N5b, read 8 Oct 2026; design canvas board 2.1 (The part as it stands); tech plan §6 Phase 6 (ChangePartCommandHandler). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-N5b: “S7-N3 and S7-N4 apply when a part is created and when its part number is changed. Saving a part with its number unchanged is never refused by them, even when the location already holds a part whose number matches it.”
- PRD §4 Key Decisions (duplicate at the location): “A new part number already stocked at the location is refused, ignoring case and punctuation. This check stops a second copy of a part at one location. It runs when a part is created or its number is changed, never when a part is saved with its number unchanged.”
- Tech plan, 7 Oct 2026, §6 Phase 6 backend (ChangePartCommandHandler): “the duplicate-at-location check (S7-N3/N4) runs only when the number changes, never on a save with the number unchanged (S7-N5b), so existing same-location duplicates keep saving”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Saving a part with its number unchanged is never refused as a duplicate
Test case: C425680, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data at [Loc-1]: two active parts [Part-A] and [Part-B] whose numbers match once case, hyphens, asterisks, periods and spaces are ignored, on two different Part Library entries (made with the parts CSV import, as in Setup).
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-UNCH-01 and [Part-B] = ZZAUTOTESTPLUNCH01 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Unchanged Active → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-2] in the location switcher.
- At [Loc-2]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Unchanged Second → Part Number: [Part-B] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-1] in the location switcher.
- At [Loc-1]: Settings → Data Import → Inventory → download the template the screen offers → fill ONE row: Part Number [Part-B], Description ZZAUTOTEST PL Unchanged Import, and the other columns the template requires (e.g. Category Uncategorized, Cost 10.00, Quantity 1) → upload the file → run the import.
- Check the setup worked: Parts → Inventory at [Loc-1] → Active tab → search unch → two rows, [Part-A] and [Part-B]. If not, mark the case Blocked with the comment 'could not place two matching numbers at one location'.



========== C425681 · section 20474 (S7 Create a part without a library item)
TITLE: Changing a part's number to one already stocked here is refused
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data at [Loc-1]: two active parts [Part-A] and [Part-B].
- Must hold: [Try-1] matches [Part-A] once case and punctuation are ignored, and no Part Library entry has exactly the number [Try-1].
--- STEPS
- Click the [Part-B] row.
- Replace the Part Number with [Try-1].
- Click Save.
- Click Cancel.
- Type rendup in the Inventory search.
--- EXPECTED
Expected results
- Step 3: the change is not saved. The red message "[Part-A] already exists at this location." appears, with the second line "Please try to resolve this.", and fades after about 3 seconds.
- Step 4: the window closes.
- Step 5: the rows still read [Part-A] and [Part-B]; [Part-B] kept its number.
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-N5b, S7-N3, S7-N5, read 8 Oct 2026; design canvas board 2.2 (Both fields edited). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-N5b: “S7-N3 and S7-N4 apply when a part is created and when its part number is changed. Saving a part with its number unchanged is never refused by them, even when the location already holds a part whose number matches it.”
- S7-N3: “If a part with the same number is already stocked at this location and is active, the save is refused with "{part number} already exists at this location."”
- S7-N5: “For S7-N3 and S7-N4, "the same number" ignores upper and lower case, hyphens, asterisks, periods, spaces and other blank characters. The message names the number of the part already there.”
- PRD §8 User Feedback Summary (New part's number already stocked here, active) — Behavior: “Error toast, fades after 3 seconds”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Changing a part's number to one already stocked here is refused
Test case: C425681, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data at [Loc-1]: two active parts [Part-A] and [Part-B].
- Must hold: [Try-1] matches [Part-A] once case and punctuation are ignored, and no Part Library entry has exactly the number [Try-1].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-RENDUP-01, [Part-B] = ZZAUTOTEST-PL-RENDUP-02, [Try-1] = zzautotest pl rendup 01 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Rename Dup One → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Rename Dup Two → Part Number: [Part-B] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: Parts → Inventory → search rendup → two rows, [Part-A] and [Part-B].



========== C425682 · section 20474 (S7 Create a part without a library item)
TITLE: A blank description or number never reaches the save
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: none.
--- STEPS
- Click New Inventory Part.
- Type three spaces in Description and three spaces in Part Number.
- Pick any Category, type 10.00 in Cost and click Save.
--- EXPECTED
Expected results
- Step 3: the window refuses on the fields ("Description is a required field", "Part number is a required field") and nothing is sent or saved.
- Step 3: the system's own refusal for a blank description or part number arriving another way (red message "Description is required." or "Part number is required.", fading after about 3 seconds) — this part cannot be checked by hand; write 'not checked by hand' in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-N6, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 1.2 (Save with nothing filled). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-N6: “If an empty description or part number reaches the system by any other route, the save is refused with "Description is required." or "Part number is required."”
- PRD §8 User Feedback Summary (Empty description reaches the system by another route): “"Description is required."”
- PRD §8 User Feedback Summary (Empty part number reaches the system by another route): “"Part number is required."”
- PRD §8 User Feedback Summary (Empty part number reaches the system by another route) — Behavior: “Error toast, fades after 3 seconds”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A blank description or number never reaches the save
Test case: C425682, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: none.
# Part 1. Setup for manual QA tester
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- Check the setup worked: Parts → Inventory opens and shows the New Inventory Part button.



========== C425683 · section 20474 (S7 Create a part without a library item)
TITLE: A part that existed before the release keeps its Part Library entry
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: one part [Old-Part] at [Loc-1] that existed before the Part Lifecycle build was deployed (e.g. a part whose Part History has entries dated before the release).
--- STEPS
- Parts → Part Library → type [Old-Part] in the search.
- Click the [Old-Part] row.
- Parts → Inventory → search [Old-Part] → click the row.
--- EXPECTED
Expected results
- Step 1: an entry with Part Number [Old-Part] and Description [Old-Desc] is listed (the same as before the release, if you wrote it down).
- Step 2: the entry's page lists [Loc-1] among its workplaces (the same list as [Old-Workplaces], if written down).
- Step 3: Edit Inventory Part shows Description [Old-Desc] and Part Number [Old-Part], the entry's values.
Source — where this behaviour comes from
Epic SV-10647; story SV-10820 (Story 7, Create a Part by Typing Its Number and Description); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S7-R11, read 8 Oct 2026; design canvas board 7.2 (An entry opens its detail page). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S7-R11: “Parts that exist on the day of release keep the Part Library entry they have.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A part that existed before the release keeps its Part Library entry
Test case: C425683, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: one part [Old-Part] at [Loc-1] that existed before the Part Lifecycle build was deployed (e.g. a part whose Part History has entries dated before the release).
# Part 1. Setup for manual QA tester
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- Parts → Inventory → open the clock icon (Part History) of any part until you find one with entries dated before the release date. [Old-Part] = its part number; [Old-Desc] = its description.
- If possible, before the release reaches this environment, write down for [Old-Part] its Part Library entry's number, description and the workplaces its entry page lists ([Old-Workplaces]).
- Check the setup worked: Parts → Inventory → search [Old-Part] → one row with [Old-Desc].



========== C154836 · section 20480 (S13 Edit the part number of an existing part)
TITLE: The part window title shows Active or Inactive beside the close X
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A] and one inactive part [Part-B].
--- STEPS
- Parts → Inventory → click New Inventory Part.
- Click the X at the right of the title row.
- Active tab → search [Part-A] → click the row.
- Click the X.
- Inactive tab → search [Part-B] → click the row.
--- EXPECTED
Expected results
- Step 1: the window is titled "New Inventory Part"; a thin line runs under the title row and the close X sits at its right end. No status pill is shown.
- Step 2: the window closes.
- Step 3: the window is titled "Edit Inventory Part", with a thin line under the title row, and a green pill reading "Active" just left of the close X.
- Step 5: the title row shows a grey pill reading "Inactive" beside the close X.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R1, S13-R2, S13-R3, read 8 Oct 2026; design canvas board 1.1 (New Inventory Part opens), board 2.1 (The part as it stands), board 3.6 (Opening the inactive part). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R1: “The dialog is titled "New Inventory Part" when creating a part and "Edit Inventory Part" when editing one.”
- S13-R2: “The title row has a thin line under it, and the close X at its right end.”
- S13-R3: “When editing, the title row shows the part's saved status as a pill beside the close X: "Active" in green, or "Inactive" in grey.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The part window title shows Active or Inactive beside the close X
Test case: C154836, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A] and one inactive part [Part-B].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-PILL-01 and [Part-B] = ZZAUTOTEST-PL-PILL-02 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Pill Active → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Pill Inactive → Part Number: [Part-B] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- At [Loc-1]: Parts → Inventory → Active tab → search [Part-B] → click the row → Part Status: Inactive → Save → click Deactivate in the 'Deactivate part?' window.
- Check the setup worked: Active tab search pill → [Part-A] only; Inactive tab search pill → [Part-B] only.



========== C154837 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Editing shows Description and Part Number as ordinary text fields
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one part [Part-A] with description [Desc-A].
--- STEPS
- Click the [Part-A] row.
- Click at the end of the Part Number text and type X.
- Click at the end of the Description text and type X.
- Click Cancel.
- Click the [Part-A] row again.
--- EXPECTED
Expected results
- Step 1: the first two fields are Description holding [Desc-A] and Part Number holding [Part-A], both ordinary text boxes (no edit button, no Confirm or Cancel buttons beside them).
- Steps 2 and 3: both fields take the typed X directly.
- Step 4: the window closes without saving.
- Step 5: the fields again read [Desc-A] and [Part-A].
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R11, read 8 Oct 2026; design canvas board 2.1 (The part as it stands). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R11: “When editing, Description and Part Number are plain text fields holding the part's current values.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Editing shows Description and Part Number as ordinary text fields
Test case: C154837, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one part [Part-A] with description [Desc-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-FIELDS-01 and [Desc-A] = ZZAUTOTEST PL Fields (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: [Desc-A] → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: Parts → Inventory → search [Part-A] → one row with [Desc-A].



========== C154838 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Saving a new part number renames the part in place
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: part [Part-A] with description [Desc-A], a Core Charge (so it has a core) and 3 on hand at [Loc-1], also stocked at [Loc-2]; it has at least one earlier Part History entry.
- Must hold: [Part-A-new] is not in use anywhere and does not contain [Part-A].
--- STEPS
- At [Loc-1]: Parts → Inventory → search [Part-A] → click the row.
- Replace the Part Number with [Part-A-new].
- Click Save.
- Type [Part-A-new] in the Inventory search.
- Click the clock icon (Part History) on the [Part-A-new] row.
- Parts → Part Library → type [Part-A] in the search.
- Type [Part-A-new] in the Part Library search and click the row.
- Type Core for [Desc-A] in the Part Library search.
- Pick [Loc-2] and search [Part-A-new] in Parts → Inventory.
--- EXPECTED
Expected results
- Step 3: the window closes and the change is saved.
- Step 4: one row: [Part-A-new], [Desc-A], the same bin with quantity 3 (unchanged).
- Step 5: Part History still shows the earlier Sell Price entry, plus a new entry "Part number updated | Original number: [Part-A] | New number: [Part-A-new]" — the same part, history kept.
- Step 6: no entry has the number [Part-A] any more.
- Step 7: exactly one entry has [Part-A-new] (no new entry was made); its page lists [Loc-1] and [Loc-2].
- Step 8: the core entry "Core for [Desc-A]" shows the number [Part-A-new].
- Step 9: at [Loc-2] the part also reads [Part-A-new].
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R18, S10-R23, read 8 Oct 2026; design canvas board 2.2 (Both fields edited), board 2.3 (Saved: the list shows the new values), board 2.4 (Part History at Heavy Duty), board 2.5 (Lethbridge: renamed there too). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R18: “Saving a changed number renames the part in place. The part keeps its identity, its history, and every line that holds it. Its Part Library entry is renamed with it, and its core takes the same number. No new Part Library entry is created.”
- S10-R23: “A changed part number writes "Part number updated | Original number: {old} | New number: {new}" to the Part History of the part at every location that stocks it.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Saving a new part number renames the part in place
Test case: C154838, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: part [Part-A] with description [Desc-A], a Core Charge (so it has a core) and 3 on hand at [Loc-1], also stocked at [Loc-2]; it has at least one earlier Part History entry.
- Must hold: [Part-A-new] is not in use anywhere and does not contain [Part-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-RENAME-01, [Part-A-new] = ZZAUTOTEST-PL-RENAMED-02, [Desc-A] = ZZAUTOTEST PL Rename (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: [Desc-A] → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → Core Charge: 15.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Open [Part-A] → change Sell Price to 21.00 → Save (this writes an earlier history entry).
- Pick [Loc-2]: At [Loc-2]: Parts → Inventory → New Inventory Part → Description: [Desc-A] → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save. Then pick [Loc-1] again.
- Check the setup worked: Parts → Part Library → search [Part-A] → one entry; its page lists [Loc-1] and [Loc-2]. Part Library → search [Part-A-new] → no row.



========== C154839 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Changing the part number warns how many other locations it changes
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- [Loc-3] = a third location the Admin can pick in the location switcher (create it the same way as [Loc-2] if needed, e.g. 'ZZAUTOTEST PL Loc 3').
- Data: [Part-A] stocked at [Loc-1], [Loc-2] (active) and [Loc-3] (inactive there); [Part-B] stocked at [Loc-1] and [Loc-2]; [Part-C] stocked at [Loc-1] only.
--- STEPS
- At [Loc-1]: Parts → Inventory → search nummsg → click the [Part-A] row.
- Click at the end of the Part Number and type X.
- Press Backspace once.
- Click at the start of the Part Number and type two spaces.
- Click Cancel.
- Click the [Part-B] row, click at the end of the Part Number and type X.
- Click Cancel.
- Click the [Part-C] row, click at the end of the Part Number and type X.
- Click Cancel.
--- EXPECTED
Expected results
- Step 2: under Part Number the window shows "This also changes the part number at 2 other locations." ([Loc-2] active + [Loc-3] inactive = 2; inactive copies count).
- Step 3: the number is back to [Part-A] and the message disappears.
- Step 4: no message: spaces before or after the number are not a change.
- Step 6: under Part Number: "This also changes the part number at 1 other location."
- Step 8: no message ([Part-C] is stocked nowhere else).
- Steps 5, 7 and 9: the window closes and nothing is saved.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R16, S13-R17, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 2.2 (Both fields edited). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R16: “When the user changes the part number and at least one other location stocks the same Part Library entry, the dialog shows, under the field, "This also changes the part number at {n} other locations.", or "This also changes the part number at 1 other location." for one.”
- S13-R17: “That message shows only while the typed number differs from the saved one, ignoring spaces before and after it. Parts at other locations count whether they are active or inactive.”
- PRD §8 User Feedback Summary (Part number changed on a part other locations stock): “"This also changes the part number at {n} other locations." ("1 other location." for one)”
- PRD §8 User Feedback Summary (Part number changed on a part other locations stock) — Behavior: “Text under the field while it differs”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Changing the part number warns how many other locations it changes
Test case: C154839, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- [Loc-3] = a third location the Admin can pick in the location switcher (create it the same way as [Loc-2] if needed, e.g. 'ZZAUTOTEST PL Loc 3').
- Data: [Part-A] stocked at [Loc-1], [Loc-2] (active) and [Loc-3] (inactive there); [Part-B] stocked at [Loc-1] and [Loc-2]; [Part-C] stocked at [Loc-1] only.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-NUMMSG-01, [Part-B] = ZZAUTOTEST-PL-NUMMSG-02, [Part-C] = ZZAUTOTEST-PL-NUMMSG-03 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Num Msg A → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Num Msg B → Part Number: [Part-B] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Num Msg C → Part Number: [Part-C] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-2]: create [Part-A] and [Part-B] there the same way (type each number exactly).
- Pick [Loc-3]: create [Part-A] there the same way, then At [Loc-3]: Parts → Inventory → Active tab → search [Part-A] → click the row → Part Status: Inactive → Save → click Deactivate in the 'Deactivate part?' window.
- Pick [Loc-1] again.
- Check the setup worked: Parts → Part Library → open [Part-A] → its page lists [Loc-1], [Loc-2], [Loc-3]; open [Part-B] → [Loc-1], [Loc-2]; open [Part-C] → [Loc-1].



========== C154840 · section 20480 (S13 Edit the part number of an existing part)
TITLE: A number that another Part Library entry has exactly is refused
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: part [Part-A] at [Loc-1]; a different Part Library entry [Part-B] stocked at [Loc-2] only ([Loc-1] does not stock it).
--- STEPS
- At [Loc-1]: Parts → Inventory → search [Part-A] → click the row.
- Replace the Part Number with [Part-B], typed exactly.
- Click Save.
- Click Cancel.
- Parts → Part Library → type taken in the search.
--- EXPECTED
Expected results
- Step 3: nothing is saved and the window stays open. A red message reads "Part number [Part-B] already belongs to another part in the Part Library." with the second line "Please try to resolve this."; it fades after about 3 seconds.
- Step 4: the window closes.
- Step 5: still two entries, [Part-A] and [Part-B], unchanged.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-N1, §4 Key Decisions, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 2.2 (Both fields edited); tech plan §1 Q2. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-N1: “If another Part Library entry already has exactly the typed number, with the same characters and the same upper and lower case, the save is refused, the dialog stays open, and the system shows "Part number {number} already belongs to another part in the Part Library."”
- PRD §4 Key Decisions (rename match rule): “A rename follows the same match rule as linking. A rename is refused only when another Part Library entry has exactly the typed number: the same characters, with the same upper and lower case.”
- PRD §8 User Feedback Summary (Part number already belongs to another entry): “"Part number {number} already belongs to another part in the Part Library."”
- PRD §8 User Feedback Summary (Part number already belongs to another entry) — Behavior: “Error toast, fades after 3 seconds; the dialog stays open”
- PRD §8 User Feedback Summary context note: “every refusal sent by the system, the rows that fade after 3 seconds, also shows a second, smaller line under the message: "Please try to resolve this."”
- Tech plan, 7 Oct 2026, §1 Clarifications, Q2: “Exact (same characters and case), like create's link rule.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A number that another Part Library entry has exactly is refused
Test case: C154840, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: part [Part-A] at [Loc-1]; a different Part Library entry [Part-B] stocked at [Loc-2] only ([Loc-1] does not stock it).
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-TAKEN-01 and [Part-B] = ZZAUTOTEST-PL-TAKEN-02 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Taken A → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-2]: At [Loc-2]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Taken B → Part Number: [Part-B] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save. Then pick [Loc-1] again.
- Check the setup worked: Parts → Part Library → search taken → two entries, [Part-A] and [Part-B].



========== C425684 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Edit Inventory Part lists its fields in the set order
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active, tracked part [Part-A].
--- STEPS
- Click the [Part-A] row.
- Scroll the window from top to bottom.
--- EXPECTED
Expected results
- Step 2: the fields appear in this order: Description, Part Number, Part Status (Active / Inactive), Vendor, Category, Manufacturer, Average Cost, Sell Price, Core Charge, Inventory Tracking (the switch "Track quantities and cost of goods", then Min and Max), Tags, and Inventory (the bin rows, then "Add Bin Location").
- Step 2: "Add Bin Location" has a plus icon before its label.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R4, S13-R5, read 8 Oct 2026; design canvas board 2.1 (The part as it stands), board 3.1 (Part Status in the dialog). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R4: “The fields appear in this order: Description, Part Number, Part Status (editing only), Vendor, Category, Manufacturer, Average Cost (editing) or Cost (creating), Sell Price, Core Charge, Inventory Tracking (the switch, then Min and Max), Tags, and Inventory (bin locations, then "Add Bin Location").”
- S13-R5: “"Add Bin Location" has a plus icon before its label.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Edit Inventory Part lists its fields in the set order
Test case: C425684, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active, tracked part [Part-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-ORDER-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Order → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: search [Part-A] → one row.



========== C425685 · section 20480 (S13 Edit the part number of an existing part)
TITLE: New Inventory Part lists its fields in the set order
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: none.
--- STEPS
- Click New Inventory Part.
- Scroll the window from top to bottom.
--- EXPECTED
Expected results
- Step 2: the fields appear in this order: Description, Part Number, Vendor, Category, Manufacturer, Cost, Sell Price, Core Charge, Inventory Tracking (the switch, then Min and Max), Tags, Inventory (the bin row, then "Add Bin Location"). There is no Part Status, and the cost field is labelled "Cost", not "Average Cost".
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R4, read 8 Oct 2026; design canvas board 1.1 (New Inventory Part opens). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R4: “The fields appear in this order: Description, Part Number, Part Status (editing only), Vendor, Category, Manufacturer, Average Cost (editing) or Cost (creating), Sell Price, Core Charge, Inventory Tracking (the switch, then Min and Max), Tags, and Inventory (bin locations, then "Add Bin Location").”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: New Inventory Part lists its fields in the set order
Test case: C425685, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data: none.
# Part 1. Setup for manual QA tester
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- Check the setup worked: Parts → Inventory shows the New Inventory Part button.



========== C425686 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Cost and price fields are hidden from a user without financial access
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [User-B]: a custom role with 'Part Library & Inventory → View', 'Create & Edit' and 'Delete' on and See Financial Data OFF.
- Data at [Loc-1]: one tracked part [Part-A].
--- STEPS
- As the Admin: click the [Part-A] row.
- Click Cancel.
- As [User-B]: click the [Part-A] row.
- Turn the switch "Track quantities and cost of goods" off.
- Turn it back on.
- Click Cancel.
- As [User-B]: click New Inventory Part.
--- EXPECTED
Expected results
- Step 1: the Admin sees Average Cost, Sell Price and Core Charge.
- Step 3: [User-B] sees no Average Cost, Sell Price or Core Charge field.
- Step 4: Min and Max disappear.
- Step 5: Min and Max show again.
- Step 7: [User-B] sees no Cost, Sell Price or Core Charge field in New Inventory Part.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R4a, read 8 Oct 2026; design canvas board 1.1 (New Inventory Part opens), board 1.6 (Branch: a new part with tracking off), board 5.2 (Switch off). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R4a: “Vendor is hidden where the screen that opens the dialog hides it. Cost, Average Cost, Sell Price and Core Charge show only to a user who can see financial data. Min and Max show only while tracking is on (S4-R5).”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Cost and price fields are hidden from a user without financial access
Test case: C425686, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [User-B]: a custom role with 'Part Library & Inventory → View', 'Create & Edit' and 'Delete' on and See Financial Data OFF.
- Data at [Loc-1]: one tracked part [Part-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-NOFIN-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL No Fin → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Settings → Roles & Permissions → Create custom role → name it ZZAUTOTEST PL NOFIN ROLE → turn on the Parts department and 'Part Library & Inventory' View, Create & Edit and Delete → See Financial Data OFF → Save.
- Settings → Staff → add a staff member (e.g. ZZAUTOTEST PL User B, with an e-mail you can open) → Role: ZZAUTOTEST PL NOFIN ROLE → give access to [Loc-1] → Save → accept the invitation e-mail and set a password. [User-B] = that staff member.
- Open a second browser (or a private window) and sign in there as [User-B], at [Loc-1].
- Check the setup worked: as [User-B], Parts → Inventory opens and search [Part-A] shows the row.



========== C425687 · section 20480 (S13 Edit the part number of an existing part)
TITLE: The part window footer shows Delete Part, Cancel and Save
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one part [Part-A].
--- STEPS
- Click the [Part-A] row.
- Scroll to the bottom of the window.
--- EXPECTED
Expected results
- Step 2: a thin line runs above the footer. "Delete Part" sits at the left: a red button with a white trash icon and a white label.
- Step 2: at the right sit Cancel (white, grey outline, dark label) and then Save (blue, white label).
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R6, S13-R7, S13-R8, S13-R9, read 8 Oct 2026; design canvas board 2.1 (The part as it stands), board 3.1 (Part Status in the dialog). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R6: “The footer has a thin line above it. "Delete Part" sits at its left; Cancel and Save sit at its right.”
- S13-R7: “"Delete Part" is the design system's danger button: red, with a white trash icon and white label.”
- S13-R8: “Cancel is the design system's secondary button: white, with a grey outline and dark label. It closes the dialog without saving.”
- S13-R9: “Save is the design system's primary button: blue, with a white label.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The part window footer shows Delete Part, Cancel and Save
Test case: C425687, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one part [Part-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-FOOTER-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Footer → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: search [Part-A] → one row.



========== C425688 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Cancel closes the part window without saving
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one part [Part-A] with description [Desc-A] and Sell Price $20.00.
--- STEPS
- Click the [Part-A] row.
- Replace the Description with ZZAUTOTEST PL Cancel Changed and the Sell Price with 99.00.
- Click Cancel.
- Click the [Part-A] row.
--- EXPECTED
Expected results
- Step 3: the window closes; the row still shows [Desc-A] and Sell Price $20.00.
- Step 4: the fields read [Desc-A] and $20.00: nothing was saved.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R8, read 8 Oct 2026; design canvas board 2.1 (The part as it stands). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R8: “Cancel is the design system's secondary button: white, with a grey outline and dark label. It closes the dialog without saving.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Cancel closes the part window without saving
Test case: C425688, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one part [Part-A] with description [Desc-A] and Sell Price $20.00.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-CANCEL-01 and [Desc-A] = ZZAUTOTEST PL Cancel (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: [Desc-A] → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: search [Part-A] → one row, Sell Price $20.00.



========== C425689 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Delete Part shows only on an existing part, to a user with Delete
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [User-B]: a custom role with 'Part Library & Inventory → View' and 'Create & Edit' on, 'Delete' OFF, See Financial Data on.
- Data at [Loc-1]: one part [Part-A].
--- STEPS
- As the Admin: click New Inventory Part.
- Click Cancel.
- As the Admin: click the [Part-A] row.
- Click Cancel.
- As [User-B]: click the [Part-A] row.
--- EXPECTED
Expected results
- Step 1: the New Inventory Part footer shows only Cancel and Save; no Delete Part.
- Step 3: the Edit Inventory Part footer shows Delete Part at the left.
- Step 5: [User-B] sees no Delete Part button.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R10, read 8 Oct 2026; design canvas board 1.1 (New Inventory Part opens), board 2.1 (The part as it stands). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R10: “Delete Part is shown only when editing, to a user with the 'Part Library & Inventory → Delete' permission.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Delete Part shows only on an existing part, to a user with Delete
Test case: C425689, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [User-B]: a custom role with 'Part Library & Inventory → View' and 'Create & Edit' on, 'Delete' OFF, See Financial Data on.
- Data at [Loc-1]: one part [Part-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-DELVIS-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Del Visible → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Settings → Roles & Permissions → Create custom role → name it ZZAUTOTEST PL NODEL ROLE → turn on the Parts department and 'Part Library & Inventory' View and Create & Edit (Delete OFF) → See Financial Data ON → Save.
- Settings → Staff → add a staff member (e.g. ZZAUTOTEST PL User B, with an e-mail you can open) → Role: ZZAUTOTEST PL NODEL ROLE → give access to [Loc-1] → Save → accept the invitation e-mail and set a password. [User-B] = that staff member.
- Open a second browser (or a private window) and sign in there as [User-B], at [Loc-1].
- Check the setup worked: as [User-B], search [Part-A] shows the row.



========== C425690 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Changing the description warns how many other locations it changes
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- [Loc-3] = a third location the Admin can pick in the location switcher (create it the same way as [Loc-2] if needed, e.g. 'ZZAUTOTEST PL Loc 3').
- Data: [Part-A] with description [Desc-A], stocked (active) at [Loc-1], [Loc-2] and [Loc-3]; [Part-B] stocked at [Loc-1] and [Loc-2]; [Part-C] at [Loc-1] only.
--- STEPS
- At [Loc-1]: Parts → Inventory → search descmsg → click the [Part-A] row.
- Click at the end of the Description and type X.
- Press Backspace once.
- Type two spaces at the end of the Description.
- Click Cancel.
- Click the [Part-B] row and type X at the end of the Description.
- Click Cancel.
- Click the [Part-C] row and type X at the end of the Description.
- Click Cancel.
--- EXPECTED
Expected results
- Step 2: under Description the window shows "This also changes the description at 2 other locations." ([Loc-2] + [Loc-3] = 2).
- Step 3: the description is back to [Desc-A] and the message disappears.
- Step 4: no message: spaces after the text are not a change.
- Step 6: under Description: "This also changes the description at 1 other location."
- Step 8: no message.
- Steps 5, 7 and 9: the window closes and nothing is saved.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R12, S13-R13, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 2.2 (Both fields edited). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R12: “When the user changes the description and at least one other location stocks the same Part Library entry, the dialog shows, under the field, "This also changes the description at {n} other locations.", or "This also changes the description at 1 other location." for one.”
- S13-R13: “That message shows only while the typed description differs from the saved one, ignoring spaces before and after it.”
- PRD §8 User Feedback Summary (Description changed on a part other locations stock): “"This also changes the description at {n} other locations." ("1 other location." for one)”
- PRD §8 User Feedback Summary (Description changed on a part other locations stock) — Behavior: “Text under the field while it differs”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Changing the description warns how many other locations it changes
Test case: C425690, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- [Loc-3] = a third location the Admin can pick in the location switcher (create it the same way as [Loc-2] if needed, e.g. 'ZZAUTOTEST PL Loc 3').
- Data: [Part-A] with description [Desc-A], stocked (active) at [Loc-1], [Loc-2] and [Loc-3]; [Part-B] stocked at [Loc-1] and [Loc-2]; [Part-C] at [Loc-1] only.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-DESCMSG-01, [Part-B] = ZZAUTOTEST-PL-DESCMSG-02, [Part-C] = ZZAUTOTEST-PL-DESCMSG-03, [Desc-A] = ZZAUTOTEST PL Desc Msg A (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: [Desc-A] → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Desc Msg B → Part Number: [Part-B] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Desc Msg C → Part Number: [Part-C] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-2]: create [Part-A] and [Part-B] there (type each number exactly). Pick [Loc-3]: create [Part-A] there. Pick [Loc-1] again.
- Check the setup worked: Parts → Part Library → open [Part-A] → its page lists [Loc-1], [Loc-2], [Loc-3]; [Part-B] → [Loc-1], [Loc-2]; [Part-C] → [Loc-1].



========== C425691 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Saving a new description changes it at every location and on its core
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: part [Part-A] with description [Desc-A] and a Core Charge (so it has a core), stocked at [Loc-1] and [Loc-2].
--- STEPS
- At [Loc-1]: Parts → Inventory → search [Part-A] → click the row.
- Replace the Description with [Desc-new].
- Click Save.
- Parts → Part Library → type [Part-A] in the search.
- Type Core for [Desc-new] in the Part Library search.
- Pick [Loc-2] and search [Part-A] in Parts → Inventory.
--- EXPECTED
Expected results
- Step 3: the window closes; the [Loc-1] row shows [Desc-new].
- Step 4: the one entry shows Description [Desc-new].
- Step 5: the core entry reads "Core for [Desc-new]".
- Step 6: at [Loc-2] the row also shows [Desc-new].
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R14, S13-R15, read 8 Oct 2026; design canvas board 2.3 (Saved: the list shows the new values), board 2.5 (Lethbridge: renamed there too). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R14: “Saving a changed description changes the part's Part Library entry, so every location that stocks the part shows the new description.”
- S13-R15: “A changed description also renames the part's core, which reads "Core for {description}".”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Saving a new description changes it at every location and on its core
Test case: C425691, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: part [Part-A] with description [Desc-A] and a Core Charge (so it has a core), stocked at [Loc-1] and [Loc-2].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-DESCSAVE-01, [Desc-A] = ZZAUTOTEST PL Desc Save, [Desc-new] = ZZAUTOTEST PL Desc Saved New (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: [Desc-A] → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → Core Charge: 15.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-2]: At [Loc-2]: Parts → Inventory → New Inventory Part → Description: [Desc-A] → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save. Then pick [Loc-1] again.
- Check the setup worked: Parts → Part Library → search [Part-A] → one entry, Description [Desc-A]; its page lists [Loc-1] and [Loc-2].



========== C425692 · section 20480 (S13 Edit the part number of an existing part)
TITLE: A number that differs from another entry only in case is accepted
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: part [Part-A] at [Loc-1]; another Part Library entry [Part-B] (upper case), stocked at [Loc-2] only.
- Must hold: [Part-B-lower] is [Part-B] in lower case; no entry has exactly [Part-B-lower].
--- STEPS
- At [Loc-1]: Parts → Inventory → search [Part-A] → click the row.
- Replace the Part Number with [Part-B-lower].
- Click Save.
- Parts → Part Library → type caseok in the search.
--- EXPECTED
Expected results
- Step 3: the change is saved and the window closes (no "already belongs to another part" message).
- Step 4: two entries: [Part-B] (unchanged, upper case) and [Part-B-lower] (the renamed [Part-A]).
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-N1, §4 Key Decisions, read 8 Oct 2026; design canvas board 2.2 (Both fields edited); tech plan §1 Q2 and §6 Phase 6 unit tests. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-N1: “If another Part Library entry already has exactly the typed number, with the same characters and the same upper and lower case, the save is refused, the dialog stays open, and the system shows "Part number {number} already belongs to another part in the Part Library."”
- PRD §4 Key Decisions (rename match rule): “A rename follows the same match rule as linking. A rename is refused only when another Part Library entry has exactly the typed number: the same characters, with the same upper and lower case.”
- Tech plan, 7 Oct 2026, §1 Clarifications, Q2: “Exact (same characters and case), like create's link rule.”
- Tech plan, 7 Oct 2026, §6 Phase 6 unit tests (collision checker): “"brake01" vs "BRAKE-01" allowed; "BRAKE-01" refused; own core excluded”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A number that differs from another entry only in case is accepted
Test case: C425692, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: part [Part-A] at [Loc-1]; another Part Library entry [Part-B] (upper case), stocked at [Loc-2] only.
- Must hold: [Part-B-lower] is [Part-B] in lower case; no entry has exactly [Part-B-lower].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-CASEOK-01, [Part-B] = ZZAUTOTEST-PL-CASEOK-02, [Part-B-lower] = zzautotest-pl-caseok-02 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Case OK A → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-2]: At [Loc-2]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Case OK B → Part Number: [Part-B] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save. Then pick [Loc-1] again.
- Check the setup worked: Parts → Part Library → search caseok → two entries.



========== C425693 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Description and Part Number cannot be left empty when editing
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one part [Part-A] with description [Desc-A].
--- STEPS
- Click the [Part-A] row.
- Clear the Description and the Part Number completely.
- Click Save.
- Click Cancel.
- Click the [Part-A] row.
--- EXPECTED
Expected results
- Step 3: "Description is a required field" shows under Description and "Part number is a required field" under Part Number; the part is not saved.
- Step 4: the window closes.
- Step 5: the fields still read [Desc-A] and [Part-A].
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-N2, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 1.2 (Save with nothing filled). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-N2: “An empty Description shows "Description is a required field" and an empty Part Number shows "Part number is a required field". The part is not saved.”
- PRD §8 User Feedback Summary (Description field empty or only spaces) — Behavior: “Inline error on the field, stays until corrected”
- PRD §8 User Feedback Summary (Part Number field empty or only spaces) — Behavior: “Inline error on the field, stays until corrected”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Description and Part Number cannot be left empty when editing
Test case: C425693, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one part [Part-A] with description [Desc-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-EDITREQ-01 and [Desc-A] = ZZAUTOTEST PL Edit Required (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: [Desc-A] → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: search [Part-A] → one row.



========== C425694 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Saving with the part number unchanged leaves the number and open work alone
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] on one open purchase order [PO-1] (not received).
--- STEPS
- Parts → Inventory → search [Part-A] → click the row.
- Change only the Sell Price to 22.00.
- Click Save.
- Click the clock icon (Part History) on the [Part-A] row.
- Parts → Part Library → type [Part-A] in the search.
- Parts → Purchase Orders → open [PO-1].
--- EXPECTED
Expected results
- Step 3: the change is saved and the window closes.
- Step 4: no "Part number updated" entry was written.
- Step 5: one entry, [Part-A].
- Step 6: the [PO-1] line still reads [Part-A].
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-N3, read 8 Oct 2026; design canvas board 2.1 (The part as it stands). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-N3: “Saving with the number unchanged changes nothing about the number, the Part Library entry or open work.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Saving with the part number unchanged leaves the number and open work alone
Test case: C425694, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] on one open purchase order [PO-1] (not received).
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-UNCHNUM-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Unchanged Number → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Parts → Purchase Orders → New Purchase Order → pick any vendor → add a line: type [Part-A] in Part Number and pick the result marked with an Inventory Qty → Quantity 2 → save the order. [PO-1] = the purchase order number shown.
- Check the setup worked: [PO-1] is listed as not received and its line reads [Part-A].



========== C425695 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Adding spaces around the part number is not a change
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one part [Part-A].
--- STEPS
- Click the [Part-A] row.
- Type two spaces before and two spaces after the Part Number.
- Click Save.
- Click the clock icon (Part History) on the [Part-A] row.
- Click the [Part-A] row again.
--- EXPECTED
Expected results
- Step 3: the save goes through and the window closes.
- Step 4: no "Part number updated" entry was written.
- Step 5: Part Number reads [Part-A] exactly as before, with no spaces.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-N3a, read 8 Oct 2026; design canvas board 2.1 (The part as it stands). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-N3a: “A typed number that differs from the saved one only by spaces before or after it is not a change. The saved number is kept as it is.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Adding spaces around the part number is not a change
Test case: C425695, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one part [Part-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-SPACES-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Spaces → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: search [Part-A] → one row.



========== C425696 · section 20480 (S13 Edit the part number of an existing part)
TITLE: A rename carries over to open purchase order lines at every location
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: part [Part-A] (3 on hand) at [Loc-1], also stocked at [Loc-2]; a vendor [Vendor-A].
- Purchase orders: [PO-1] at [Loc-1], [Part-A] picked from the lookup, 2 ordered, not received; [PO-2] at [Loc-1], [Part-A] picked, 1 ordered, fully received on vendor invoice [Inv-2]; [PO-3] at [Loc-1], [Part-A] typed by hand and added as typed (no link to the part), not received; [PO-4] at [Loc-2], [Part-A] picked, 4 ordered, not received.
- Must hold: [Part-A-new] is unused and does not contain [Part-A].
--- STEPS
- At [Loc-1]: Parts → Inventory → search [Part-A] → click the row → replace the Part Number with [Part-A-new] → click Save.
- Parts → Purchase Orders → open [PO-1].
- Open [PO-2].
- Open [PO-3].
- Parts → Vendor Invoices → open [Inv-2].
- Pick [Loc-2] → Parts → Purchase Orders → open [PO-4].
- Pick [Loc-1] → open [PO-1] → Receive → invoice number ZZ-COPO-INV-1, cost 10.00, sell 20.00, received 2 → Receive.
- Parts → Inventory → search [Part-A-new].
--- EXPECTED
Expected results
- Step 1: the rename is saved.
- Step 2: the open [PO-1] line now reads [Part-A-new].
- Step 3: the fully received [PO-2] line still reads [Part-A] (completed records keep their number).
- Step 4: the hand-typed [PO-3] line still reads [Part-A] (it only shares the old number).
- Step 5: the accepted vendor invoice [Inv-2] still reads [Part-A].
- Step 6: the open [PO-4] line at [Loc-2] reads [Part-A-new] (every location).
- Step 7: receiving finds the renamed part and completes.
- Step 8: [Part-A-new] shows 4 + 2 = 6 on hand.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R19, S13-R19a, S13-R19b, §4 Key Decisions, §5 Terminology, Story 13 context note, read 8 Oct 2026; design canvas board 2.3 (Saved: the list shows the new values); tech plan §1 Q15 and §6 Phase 6 open-work table. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R19: “A rename carries over to open work that holds this part, at every location: purchase order lines not yet fully received, part requests not yet received or returned, canned jobs, and returns that are not completed take the new number. A delivery that is not yet accepted is covered by its open purchase order lines. Receiving, ordering, applying a canned job and returning then find the renamed part.”
- S13-R19a: “A line that only shares the old number, typed in by hand with no link to this part, keeps its number.”
- S13-R19b: “Vendor bills already accepted keep the number they were written with.”
- PRD §4 Key Decisions (rename carry-over): “A rename carries over to work that is still open. Open purchase order lines, open part requests, canned jobs and open returns follow the new number, so receiving and returning still find the part. Records already completed keep the number they were written with.”
- PRD §5 Terminology (Open work): “Open work → A purchase order line not yet fully received, a part request not yet received or returned, a canned job, and a return that is not completed.”
- PRD Story 13 context note (completed records): “Records already completed, such as received purchase order lines, completed returns and past work orders and invoices, keep the number they were written with.”
- Tech plan, 7 Oct 2026, §6 Phase 6, open-work definition for the rename carry-over: “Rows are linked by id only, never by number.”
- Tech plan, 7 Oct 2026, §1 Clarifications, Q15: “Take the new number; accepted bills keep the old (S13-R19, R19b).”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A rename carries over to open purchase order lines at every location
Test case: C425696, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: part [Part-A] (3 on hand) at [Loc-1], also stocked at [Loc-2]; a vendor [Vendor-A].
- Purchase orders: [PO-1] at [Loc-1], [Part-A] picked from the lookup, 2 ordered, not received; [PO-2] at [Loc-1], [Part-A] picked, 1 ordered, fully received on vendor invoice [Inv-2]; [PO-3] at [Loc-1], [Part-A] typed by hand and added as typed (no link to the part), not received; [PO-4] at [Loc-2], [Part-A] picked, 4 ordered, not received.
- Must hold: [Part-A-new] is unused and does not contain [Part-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-COPO-01, [Part-A-new] = ZZAUTOTEST-PL-COPONEW-02, [Vendor-A] = ZZAUTOTEST PL COPO Vendor, [Inv-2] = ZZ-COPO-INV-2 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL CO PO → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-2]: create [Part-A] there the same way, then pick [Loc-1] again.
- Parts → Vendors → add a vendor named [Vendor-A] → Save.
- Parts → Purchase Orders → New Purchase Order → Vendor [Vendor-A] → add a line: type [Part-A] and pick the result with an Inventory Qty → Quantity 2 → save. [PO-1] = its number.
- New Purchase Order → [Vendor-A] → line: pick [Part-A] the same way → Quantity 1 → save → Receive it: invoice number [Inv-2], cost 10.00, sell 20.00, received 1 → Receive. [PO-2] = its number.
- New Purchase Order → [Vendor-A] → line: type [Part-A] in full and choose the row that adds the number as typed (not the result with an Inventory Qty) → Quantity 1 → save. [PO-3] = its number.
- Pick [Loc-2]: New Purchase Order → [Vendor-A] → line: pick [Part-A] → Quantity 4 → save. [PO-4] = its number. Pick [Loc-1] again.
- Check the setup worked: the Purchase Orders lists show [PO-1], [PO-3] not received and [PO-2] received at [Loc-1], and [PO-4] not received at [Loc-2]; every line reads [Part-A]. Inventory at [Loc-1] shows [Part-A] with 3 + 1 = 4 on hand.



========== C425697 · section 20480 (S13 Edit the part number of an existing part)
TITLE: A rename carries over to open part requests
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] (5 on hand); work order [WO-1] with a line holding two part requests for [Part-A]: [PR-1] requested and not yet received, and [PR-2] picked from stock (received).
--- STEPS
- Parts → Inventory → search [Part-A] → click the row → replace the Part Number with [Part-A-new] → Save.
- Open [WO-1] → Parts tab.
- On the [PR-1] row use the Order action to order it from any vendor.
- Open the purchase order that was created and read its line.
--- EXPECTED
Expected results
- Step 1: the rename is saved.
- Step 2: [PR-1] (still open) reads [Part-A-new]; [PR-2] (already received) still reads [Part-A].
- Step 3: ordering finds the renamed part and goes through.
- Step 4: the new purchase order line reads [Part-A-new].
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R19, §4 Key Decisions, §5 Terminology, Story 13 context note, read 8 Oct 2026; design canvas board 6.1 (While active: GREASETUBE is found); tech plan §6 Phase 6 open-work table. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R19: “A rename carries over to open work that holds this part, at every location: purchase order lines not yet fully received, part requests not yet received or returned, canned jobs, and returns that are not completed take the new number. A delivery that is not yet accepted is covered by its open purchase order lines. Receiving, ordering, applying a canned job and returning then find the renamed part.”
- PRD §4 Key Decisions (rename carry-over): “A rename carries over to work that is still open. Open purchase order lines, open part requests, canned jobs and open returns follow the new number, so receiving and returning still find the part. Records already completed keep the number they were written with.”
- PRD §5 Terminology (Open work): “Open work → A purchase order line not yet fully received, a part request not yet received or returned, a canned job, and a return that is not completed.”
- PRD Story 13 context note (completed records): “Records already completed, such as received purchase order lines, completed returns and past work orders and invoices, keep the number they were written with.”
- Tech plan, 7 Oct 2026, §6 Phase 6, open-work definition for the rename carry-over: “Rows are linked by id only, never by number.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A rename carries over to open part requests
Test case: C425697, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] (5 on hand); work order [WO-1] with a line holding two part requests for [Part-A]: [PR-1] requested and not yet received, and [PR-2] picked from stock (received).
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-COPR-01, [Part-A-new] = ZZAUTOTEST-PL-COPRNEW-02, [Cust] = ZZAUTOTEST PL COPR Customer (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL CO PR → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 (Quantity 5) → keep the default bin row (Quantity e.g. 3) → Save.
- Customers → New Customer → name [Cust] → Save; add an asset to it (e.g. unit 'ZZ1'). Work Orders → New Work Order → Customer [Cust] → the asset → Create. [WO-1] = the work order number shown. On the work order click New Line → pick any job in the Title list → Save & Close.
- On the line click ⋮ → Request part → Part Number: type [Part-A] and pick the result marked "Part Library" (so it is requested, not taken from stock) → Quantity 1 → Save Part. [PR-1] = this request.
- Line ⋮ → Request part → Part Number: pick the [Part-A] result with an Inventory Qty → take 1 from its bin → Save Part. [PR-2] = this request (picked from stock).
- Check the setup worked: the work order's Parts tab lists [PR-1] as Requested and [PR-2] as picked/received, both reading [Part-A].



========== C425698 · section 20480 (S13 Edit the part number of an existing part)
TITLE: A rename carries over to canned jobs that hold the part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] (5 on hand); a canned job [CJ-1] holding [Part-A]; work order [WO-1] whose line holds [Part-A] picked from stock (received).
--- STEPS
- Parts → Inventory → search [Part-A] → click the row → replace the Part Number with [Part-A-new] → Save.
- Open [WO-1] → Parts tab.
- On [WO-1] click New Line → type [CJ-1] in Title → pick it → Save & Close.
- Read the part row on the new line.
--- EXPECTED
Expected results
- Step 1: the rename is saved.
- Step 2: the part already picked onto [WO-1] (a completed record) still reads [Part-A].
- Step 3: the canned job is applied and finds the renamed part (no part is left out).
- Step 4: the part on the new line reads [Part-A-new].
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R19, §4 Key Decisions, Story 13 context note, read 8 Oct 2026; design canvas board 6.4 (A canned job that holds it), board 6.5 (The canned job leaves it out); tech plan §6 Phase 6 open-work table. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R19: “A rename carries over to open work that holds this part, at every location: purchase order lines not yet fully received, part requests not yet received or returned, canned jobs, and returns that are not completed take the new number. A delivery that is not yet accepted is covered by its open purchase order lines. Receiving, ordering, applying a canned job and returning then find the renamed part.”
- PRD §4 Key Decisions (rename carry-over): “A rename carries over to work that is still open. Open purchase order lines, open part requests, canned jobs and open returns follow the new number, so receiving and returning still find the part. Records already completed keep the number they were written with.”
- PRD Story 13 context note (completed records): “Records already completed, such as received purchase order lines, completed returns and past work orders and invoices, keep the number they were written with.”
- Tech plan, 7 Oct 2026, §6 Phase 6, open-work definition for the rename carry-over: “Rows are linked by id only, never by number.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A rename carries over to canned jobs that hold the part
Test case: C425698, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] (5 on hand); a canned job [CJ-1] holding [Part-A]; work order [WO-1] whose line holds [Part-A] picked from stock (received).
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-COCJ-01, [Part-A-new] = ZZAUTOTEST-PL-COCJNEW-02, [Cust] = ZZAUTOTEST PL COCJ Customer, [CJ-1] = ZZAUTOTEST PL COCJ Job (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL CO CJ → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 (Quantity 5) → keep the default bin row (Quantity e.g. 3) → Save.
- Customers → New Customer → name [Cust] → Save; add an asset to it (e.g. unit 'ZZ1'). Work Orders → New Work Order → Customer [Cust] → the asset → Create. [WO-1] = the work order number shown. On the work order click New Line → pick any job in the Title list → Save & Close.
- On the line: ⋮ → Request part → pick the [Part-A] result with an Inventory Qty → take 1 from its bin → Save Part.
- On the same line: ⋮ → Save as canned line → name it [CJ-1] → save.
- Check the setup worked: open [WO-1] → New Line → type [CJ-1] in Title → the suggestion shows Total Parts: 1 → close the window without saving.



========== C425699 · section 20480 (S13 Edit the part number of an existing part)
TITLE: A rename carries over to vendor returns that are not completed
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] (5 on hand); vendor [Vendor-A]; return [RET-1] for [Part-A], saved and not completed; return [RET-2] for [Part-A], completed (accepted by the vendor).
--- STEPS
- Parts → Inventory → search [Part-A] → click the row → replace the Part Number with [Part-A-new] → Save.
- Parts → Returns → open [RET-1].
- Open [RET-2].
--- EXPECTED
Expected results
- Step 1: the rename is saved.
- Step 2: the open return [RET-1] reads [Part-A-new].
- Step 3: the completed return [RET-2] still reads [Part-A].
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R19, §4 Key Decisions, §5 Terminology, Story 13 context note, read 8 Oct 2026; design canvas board 6.6 (Vendor return: still offered, tagged); tech plan §6 Phase 6 open-work table. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R19: “A rename carries over to open work that holds this part, at every location: purchase order lines not yet fully received, part requests not yet received or returned, canned jobs, and returns that are not completed take the new number. A delivery that is not yet accepted is covered by its open purchase order lines. Receiving, ordering, applying a canned job and returning then find the renamed part.”
- PRD §4 Key Decisions (rename carry-over): “A rename carries over to work that is still open. Open purchase order lines, open part requests, canned jobs and open returns follow the new number, so receiving and returning still find the part. Records already completed keep the number they were written with.”
- PRD §5 Terminology (Open work): “Open work → A purchase order line not yet fully received, a part request not yet received or returned, a canned job, and a return that is not completed.”
- PRD Story 13 context note (completed records): “Records already completed, such as received purchase order lines, completed returns and past work orders and invoices, keep the number they were written with.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A rename carries over to vendor returns that are not completed
Test case: C425699, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] (5 on hand); vendor [Vendor-A]; return [RET-1] for [Part-A], saved and not completed; return [RET-2] for [Part-A], completed (accepted by the vendor).
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-CORET-01, [Part-A-new] = ZZAUTOTEST-PL-CORETNEW-02, [Vendor-A] = ZZAUTOTEST PL CORET Vendor (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL CO RET → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 (Quantity 5) → keep the default bin row (Quantity e.g. 3) → Save.
- Parts → Vendors → add [Vendor-A] → Save.
- Parts → Returns → Create Return → Vendor [Vendor-A] → Part Number: pick [Part-A] → Qty To Return 1 → Price Per Unit 10.00 → Save Return. [RET-1] = this return.
- Create Return again the same way → Save Return → open it and set it to accepted by the vendor (the return's status control). [RET-2] = this return.
- Check the setup worked: Parts → Returns lists [RET-1] as open and [RET-2] as completed, both reading [Part-A]. If the build offers no way to complete a return, write that in the result comment and skip the [RET-2] check.



========== C425700 · section 20480 (S13 Edit the part number of an existing part)
TITLE: A delivery opened before a rename is received under the new number
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] (3 on hand); vendor [Vendor-A]; [PO-1] with [Part-A] picked from the lookup, 2 ordered, not received; [PO-2] with [Part-A] typed by hand and added as typed, 1 ordered, not received.
--- STEPS
- Tab 1: Parts → Purchase Orders → open [PO-1] → click Receive and leave the Receive screen open.
- Tab 2: Parts → Inventory → search [Part-A] → click the row → replace the Part Number with [Part-A-new] → Save.
- Tab 1: fill invoice number ZZ-RECV-INV-1, cost 10.00, sell 20.00, received 2 → click Receive.
- Tab 2: Parts → Inventory → search [Part-A-new].
- Tab 2: Parts → Part Library → type [Part-A] in the search.
- Tab 2: Parts → Vendor Invoices → open ZZ-RECV-INV-1.
- Tab 2: Parts → Purchase Orders → open [PO-2] → Receive → invoice number ZZ-RECV-INV-2, cost 10.00, sell 20.00, received 1 → Receive.
- Tab 2: Parts → Vendor Invoices → open ZZ-RECV-INV-2.
--- EXPECTED
Expected results
- Step 3: the delivery is accepted.
- Step 4: [Part-A-new] shows 3 + 2 = 5 on hand.
- Step 5: no Part Library entry has the old number [Part-A] (none was made by the receipt).
- Step 6: the invoice line reads [Part-A-new], even though the Receive screen was opened before the rename.
- Step 8: the hand-typed line was received under its own number: the invoice line reads [Part-A].
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R19c, S13-R19a, read 8 Oct 2026; design canvas: no board shows this behaviour; tech plan §3 D30. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R19c: “For a line linked to the renamed part, accepting a delivery uses the part's current number, even when the Receive screen was opened before the rename. No Part Library entry is created for the old number. A hand-typed line (S13-R19a) is received under its own number.”
- S13-R19a: “A line that only shares the old number, typed in by hand with no link to this part, keeps its number.”
- Tech plan, 7 Oct 2026, §3 D30: “for a line linked to an order item with a `part_id`, the handler resolves the number from that part's current entry instead, so a rename between opening and accepting is honored and no entry is created for the old number.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A delivery opened before a rename is received under the new number
Test case: C425700, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] (3 on hand); vendor [Vendor-A]; [PO-1] with [Part-A] picked from the lookup, 2 ordered, not received; [PO-2] with [Part-A] typed by hand and added as typed, 1 ordered, not received.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-RECV-01, [Part-A-new] = ZZAUTOTEST-PL-RECVNEW-02, [Vendor-A] = ZZAUTOTEST PL RECV Vendor (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Receive → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Parts → Vendors → add [Vendor-A] → Save.
- Parts → Purchase Orders → New Purchase Order → [Vendor-A] → line: pick the [Part-A] result with an Inventory Qty → Quantity 2 → save. [PO-1] = its number.
- New Purchase Order → [Vendor-A] → line: type [Part-A] in full and choose the row that adds it as typed → Quantity 1 → save. [PO-2] = its number.
- Check the setup worked: [PO-1] and [PO-2] are listed as not received, both lines reading [Part-A].



========== C425702 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Part Status offers Active and Inactive, set to the saved status
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A] and one inactive part [Part-B].
--- STEPS
- Active tab → search [Part-A] → click the row.
- Click Cancel.
- Inactive tab → search [Part-B] → click the row.
--- EXPECTED
Expected results
- Step 1: under Part Number a "Part Status" choice offers two options, Active and Inactive, with Active selected.
- Step 3: Part Status has Inactive selected.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R20, read 8 Oct 2026; design canvas board 3.1 (Part Status in the dialog), board 3.6 (Opening the inactive part). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R20: “When editing, a "Part Status" choice offers two options, Active and Inactive, set to the part's saved status. A user without the 'Part Library & Inventory → Delete' permission sees the choice disabled.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Part Status offers Active and Inactive, set to the saved status
Test case: C425702, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A] and one inactive part [Part-B].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-STAT-01 and [Part-B] = ZZAUTOTEST-PL-STAT-02 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Status A → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Status B → Part Number: [Part-B] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- At [Loc-1]: Parts → Inventory → Active tab → search [Part-B] → click the row → Part Status: Inactive → Save → click Deactivate in the 'Deactivate part?' window.
- Check the setup worked: [Part-A] is on the Active tab and [Part-B] on the Inactive tab.



========== C425703 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Part Status is disabled for a user without Delete
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [User-B]: a custom role with 'Part Library & Inventory → View' and 'Create & Edit' on, 'Delete' OFF.
- Data at [Loc-1]: one active part [Part-A].
--- STEPS
- As [User-B]: click the [Part-A] row.
- Click the Inactive option.
- Click Cancel.
- As the Admin: click the [Part-A] row and click the Inactive option.
--- EXPECTED
Expected results
- Step 1: Part Status shows Active selected, but the choice is disabled (greyed).
- Step 2: nothing changes; Active stays selected.
- Step 4: for the Admin the choice is enabled and Inactive becomes selected (then close with Cancel).
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R20, read 8 Oct 2026; design canvas board 3.1 (Part Status in the dialog). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R20: “When editing, a "Part Status" choice offers two options, Active and Inactive, set to the part's saved status. A user without the 'Part Library & Inventory → Delete' permission sees the choice disabled.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Part Status is disabled for a user without Delete
Test case: C425703, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [User-B]: a custom role with 'Part Library & Inventory → View' and 'Create & Edit' on, 'Delete' OFF.
- Data at [Loc-1]: one active part [Part-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-STATDIS-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Status Disabled → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Settings → Roles & Permissions → Create custom role → name it ZZAUTOTEST PL STATDIS ROLE → turn on the Parts department and 'Part Library & Inventory' View and Create & Edit (Delete OFF) → See Financial Data ON → Save.
- Settings → Staff → add a staff member (e.g. ZZAUTOTEST PL User B, with an e-mail you can open) → Role: ZZAUTOTEST PL STATDIS ROLE → give access to [Loc-1] → Save → accept the invitation e-mail and set a password. [User-B] = that staff member.
- Open a second browser (or a private window) and sign in there as [User-B], at [Loc-1].
- Check the setup worked: as [User-B], search [Part-A] shows the row.



========== C425704 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Picking a different status changes nothing until Save
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A].
--- STEPS
- Click the [Part-A] row.
- Click the Inactive option.
- Click Cancel.
- Type [Part-A] in the search on the Active tab.
- Click the row.
--- EXPECTED
Expected results
- Step 2: Inactive is selected and nothing else happens (no window opens).
- Step 3: the window closes without asking anything.
- Step 4: [Part-A] is still on the Active tab.
- Step 5: Part Status shows Active.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R21, §4 Key Decisions, read 8 Oct 2026; design canvas board 3.2 (Inactive picked). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R21: “Picking a different status changes nothing until Save. When Save is pressed with a different status picked, the confirmation of Story 10 opens first.”
- PRD §4 Key Decisions (status in the dialog): “The part dialog sets the status, and Save applies it. Part Status is a choice in the form. Picking Active or Inactive changes nothing until Save, and Save asks for confirmation first, the same confirmation the list uses.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Picking a different status changes nothing until Save
Test case: C425704, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-PICK-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Pick → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: [Part-A] is on the Active tab.



========== C425705 · section 20480 (S13 Edit the part number of an existing part)
TITLE: The status pill keeps the saved status while another is picked
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A] and one inactive part [Part-B].
--- STEPS
- Active tab → click the [Part-A] row.
- Click the Inactive option.
- Click Cancel.
- Inactive tab → click the [Part-B] row.
- Click the Active option.
- Click Cancel.
--- EXPECTED
Expected results
- Step 2: the title row pill still reads "Active" in green.
- Step 5: the title row pill still reads "Inactive" in grey.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R25, read 8 Oct 2026; design canvas board 3.2 (Inactive picked), board 3.7 (Bringing it back). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R25: “The title row pill shows the saved status, not the picked one.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The status pill keeps the saved status while another is picked
Test case: C425705, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A] and one inactive part [Part-B].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-PILLKEEP-01 and [Part-B] = ZZAUTOTEST-PL-PILLKEEP-02 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Pill Keep A → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Pill Keep B → Part Number: [Part-B] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- At [Loc-1]: Parts → Inventory → Active tab → search [Part-B] → click the row → Part Status: Inactive → Save → click Deactivate in the 'Deactivate part?' window.
- Check the setup worked: [Part-A] on the Active tab, [Part-B] on the Inactive tab.



========== C425706 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Save with a different status asks for confirmation first
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A].
--- STEPS
- Click the [Part-A] row.
- Click the Inactive option.
- Click Save.
- Click Cancel in the window that opened.
- Click Cancel on Edit Inventory Part.
--- EXPECTED
Expected results
- Step 3: before anything is saved, a confirmation window titled "Deactivate part?" opens over the part window.
- Step 5: the part window closes; [Part-A] is still on the Active tab.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R21, §4 Key Decisions, read 8 Oct 2026; design canvas board 3.3 (Save asks first). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R21: “Picking a different status changes nothing until Save. When Save is pressed with a different status picked, the confirmation of Story 10 opens first.”
- PRD §4 Key Decisions (status in the dialog): “The part dialog sets the status, and Save applies it. Part Status is a choice in the form. Picking Active or Inactive changes nothing until Save, and Save asks for confirmation first, the same confirmation the list uses.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Save with a different status asks for confirmation first
Test case: C425706, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-ASK-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Ask → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: [Part-A] is on the Active tab.



========== C425707 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Confirming Deactivate saves the edits and shows Part deactivated.
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A] with Sell Price $20.00.
--- STEPS
- Click the [Part-A] row.
- Change Sell Price to 25.00.
- Click the Inactive option.
- Click Save.
- Type ZZAUTOTEST retire test in Note (Optional).
- Click Deactivate.
- Search [Part-A] on the Active tab, then on the Inactive tab.
- Click the row on the Inactive tab.
--- EXPECTED
Expected results
- Step 6: both windows close and a green message "Part deactivated." appears and disappears on its own.
- Step 7: no row on the Active tab; one row on the Inactive tab.
- Step 8: Sell Price reads $25.00 (the edit was saved) and the pill reads "Inactive".
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R22, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 3.3 (Save asks first), board 3.4 (Done), board 3.5 (The Inactive tab). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R22: “Confirming saves every change in the dialog, then applies the status, and closes the dialog with "Part deactivated." or "Part activated.".”
- PRD §8 User Feedback Summary (Part deactivated from the part dialog): “"Part deactivated."”
- PRD §8 User Feedback Summary (Part deactivated from the part dialog) — Behavior: “Success toast, fades on its own”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Confirming Deactivate saves the edits and shows Part deactivated.
Test case: C425707, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A] with Sell Price $20.00.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-DEACT-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Deactivate → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: [Part-A] on the Active tab, Sell Price $20.00.



========== C425708 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Confirming Activate saves the edits and shows Part activated.
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one inactive part [Part-A] with Sell Price $20.00.
--- STEPS
- Inactive tab → click the [Part-A] row.
- Change Sell Price to 27.00.
- Click the Active option.
- Click Save.
- Click Activate.
- Search [Part-A] on the Inactive tab, then on the Active tab.
- Click the row on the Active tab.
--- EXPECTED
Expected results
- Step 4: "Activate part?" opens.
- Step 5: both windows close and a green message "Part activated." appears and disappears on its own.
- Step 6: no row on the Inactive tab; one row on the Active tab.
- Step 7: Sell Price reads $27.00 and the pill reads "Active".
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R22, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 3.7 (Bringing it back). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R22: “Confirming saves every change in the dialog, then applies the status, and closes the dialog with "Part deactivated." or "Part activated.".”
- PRD §8 User Feedback Summary (Part activated from the part dialog): “"Part activated."”
- PRD §8 User Feedback Summary (Part activated from the part dialog) — Behavior: “Success toast, fades on its own”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Confirming Activate saves the edits and shows Part activated.
Test case: C425708, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one inactive part [Part-A] with Sell Price $20.00.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-REACT-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Reactivate → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- At [Loc-1]: Parts → Inventory → Active tab → search [Part-A] → click the row → Part Status: Inactive → Save → click Deactivate in the 'Deactivate part?' window.
- Check the setup worked: [Part-A] on the Inactive tab.



========== C425709 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Cancelling the confirmation saves nothing and keeps the picked status
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A] with Sell Price $20.00.
--- STEPS
- Click the [Part-A] row.
- Change Sell Price to 25.00.
- Click the Inactive option.
- Click Save.
- Click Cancel in "Deactivate part?".
- Click Cancel on Edit Inventory Part.
- Search [Part-A] on the Active tab and click the row.
--- EXPECTED
Expected results
- Step 5: the confirmation closes and the part window is back with Inactive still selected and Sell Price still 25.00.
- Step 7: [Part-A] is still on the Active tab and Sell Price reads $20.00: nothing was saved.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R23, read 8 Oct 2026; design canvas board 3.3 (Save asks first). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R23: “Cancelling the confirmation saves nothing and returns to the dialog with the picked status kept.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Cancelling the confirmation saves nothing and keeps the picked status
Test case: C425709, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A] with Sell Price $20.00.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-CONFCANCEL-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Confirm Cancel → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: [Part-A] on the Active tab, Sell Price $20.00.



========== C425710 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Saving with the saved status picked asks no confirmation
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A].
--- STEPS
- Click the [Part-A] row.
- Change Sell Price to 23.00.
- Click Save.
- Click the [Part-A] row.
- Click Inactive, then click Active again.
- Change Sell Price to 24.00 and click Save.
--- EXPECTED
Expected results
- Step 3: the part saves and the window closes with no confirmation window.
- Step 6: again no confirmation; the window closes and the row shows $24.00 on the Active tab.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R24, read 8 Oct 2026; design canvas board 3.1 (Part Status in the dialog). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R24: “Saving with the saved status picked saves the part with no confirmation.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Saving with the saved status picked asks no confirmation
Test case: C425710, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-NOCONF-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL No Confirm → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: [Part-A] on the Active tab.



========== C425711 · section 20480 (S13 Edit the part number of an existing part)
TITLE: A status change refused after the save keeps the confirmation open
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A] with Sell Price $20.00.
--- STEPS
- Tab 1: click the [Part-A] row → change Sell Price to 25.00 → click the Inactive option.
- Tab 2: click the [Part-A] row → Inactive → Save → Deactivate.
- Tab 1: click Save.
- Tab 1: click Deactivate.
- Tab 1: wait 10 seconds.
- Tab 1: close the red message, then click Cancel in the confirmation and Cancel on the part window.
- Tab 1: Inactive tab → search [Part-A] → click the row.
--- EXPECTED
Expected results
- Step 4: the confirmation stays open. A red message reads "This part could not be deactivated" with the reason "Part is already in that state."
- Step 5: the red message is still shown: it stays until closed.
- Step 7: [Part-A] is inactive and Sell Price reads $25.00 (the form was saved before the status change was refused).
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-N4, S13-R22, S10-R13a, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 3.3 (Save asks first). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-N4: “If the status change is refused after the save, the confirmation stays open and the system shows "This part could not be deactivated" or "This part could not be activated", with the reason.”
- S13-R22: “Confirming saves every change in the dialog, then applies the status, and closes the dialog with "Part deactivated." or "Part activated.".”
- S10-R13a: “The reasons are "A core follows its part. Activate or deactivate the part instead.", "Part not found." and "Part is already in that state."”
- PRD §8 User Feedback Summary (Status change from the part dialog refused): “"This part could not be deactivated" / "This part could not be activated", with the reason”
- PRD §8 User Feedback Summary (Status change from the part dialog refused) — Behavior: “Error toast, stays until closed”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A status change refused after the save keeps the confirmation open
Test case: C425711, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one active part [Part-A] with Sell Price $20.00.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-REFUSED-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Refused → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Open a second tab of the same site, signed in as the Admin at [Loc-1].
- Check the setup worked: both tabs show [Part-A] on the Active tab.



========== C425712 · section 20480 (S13 Edit the part number of an existing part)
TITLE: A refused save closes the confirmation and saves nothing
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: active part [Part-A] at [Loc-1] with Sell Price $20.00; another Part Library entry [Part-B] stocked at [Loc-2] only.
--- STEPS
- At [Loc-1]: click the [Part-A] row.
- Replace the Part Number with [Part-B], change Sell Price to 25.00 and click the Inactive option.
- Click Save.
- Click Deactivate.
- Click Cancel on the part window.
- Search [Part-A] on the Active tab and click the row.
--- EXPECTED
Expected results
- Step 3: "Deactivate part?" opens.
- Step 4: the confirmation closes; the part window shows the refusal "Part number [Part-B] already belongs to another part in the Part Library."
- Step 6: [Part-A] is still active, still numbered [Part-A], Sell Price $20.00: nothing was saved.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-N5, S13-N1, read 8 Oct 2026; design canvas board 3.3 (Save asks first). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-N5: “If saving the form is refused while the confirmation is open, the confirmation closes, the dialog shows the refusal, and nothing is saved.”
- S13-N1: “If another Part Library entry already has exactly the typed number, with the same characters and the same upper and lower case, the save is refused, the dialog stays open, and the system shows "Part number {number} already belongs to another part in the Part Library."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A refused save closes the confirmation and saves nothing
Test case: C425712, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- [Loc-2] = a second location the Admin can pick in the location switcher. If there is none: Settings → Locations → add a location (e.g. 'ZZAUTOTEST PL Loc 2') → Save, then Settings → Staff → open the Admin → give access to the new location → Save.
- Data: active part [Part-A] at [Loc-1] with Sell Price $20.00; another Part Library entry [Part-B] stocked at [Loc-2] only.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-SAVEFAIL-01 and [Part-B] = ZZAUTOTEST-PL-SAVEFAIL-02 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Save Fail A → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Pick [Loc-2]: At [Loc-2]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Save Fail B → Part Number: [Part-B] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save. Then pick [Loc-1] again.
- Check the setup worked: Parts → Part Library → search savefail → two entries.



========== C425713 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Delete Part deletes the part at once with no confirmation
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one part [Part-A] that is on no work order, return or credit.
--- STEPS
- Click the [Part-A] row.
- Click Delete Part.
- Search [Part-A] on the Active tab, then on the Inactive tab.
--- EXPECTED
Expected results
- Step 2: the window closes straight away; no confirmation is asked.
- Step 3: no row on either tab.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R26, read 8 Oct 2026; design canvas board 2.1 (The part as it stands). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R26: “Delete Part deletes the part and closes the dialog. It asks for no confirmation.”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Delete Part deletes the part at once with no confirmation
Test case: C425713, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one part [Part-A] that is on no work order, return or credit.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-DELETE-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Delete → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: search [Part-A] → one row.



========== C425714 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Delete Part on a part on a work order shows why and does nothing
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] picked onto work order [WO-1].
--- STEPS
- Parts → Inventory → search [Part-A] → click the row.
- Hover over Delete Part.
- Click Delete Part.
- Click Cancel.
- Search [Part-A].
--- EXPECTED
Expected results
- Step 2: a tooltip reads "Please delete related work order parts first."
- Step 3: nothing happens; the window stays open.
- Step 5: [Part-A] is still listed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R27, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 2.1 (The part as it stands); tech plan §6 Phase 6 frontend (Delete trap). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R27: “When the part sits on a work order, Delete Part does nothing and hovering it shows "Please delete related work order parts first."”
- PRD §8 User Feedback Summary (Delete Part hovered on a part on a work order): “"Please delete related work order parts first."”
- PRD §8 User Feedback Summary (Delete Part hovered on a part on a work order) — Behavior: “Tooltip”
- Tech plan, 7 Oct 2026, §6 Phase 6 frontend (Delete trap): “It stays enabled and no-ops, so the S13-R27/R28 tooltip fires”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Delete Part on a part on a work order shows why and does nothing
Test case: C425714, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] picked onto work order [WO-1].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-DELWO-01 and [Cust] = ZZAUTOTEST PL DELWO Customer (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Del WO → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Customers → New Customer → name [Cust] → Save; add an asset to it (e.g. unit 'ZZ1'). Work Orders → New Work Order → Customer [Cust] → the asset → Create. [WO-1] = the work order number shown. On the work order click New Line → pick any job in the Title list → Save & Close.
- On the line: ⋮ → Request part → pick the [Part-A] result with an Inventory Qty → take 1 from its bin → Save Part.
- Check the setup worked: [WO-1] → Parts tab lists [Part-A].



========== C425715 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Delete Part on a part with an open return shows why and does nothing
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] (3 on hand) on vendor return [RET-1], saved and not completed.
--- STEPS
- Parts → Inventory → search [Part-A] → click the row.
- Hover over Delete Part.
- Click Delete Part.
- Click Cancel.
- Search [Part-A].
--- EXPECTED
Expected results
- Step 2: a tooltip reads "Please complete or cancel the related return or credit first."
- Step 3: nothing happens; the window stays open.
- Step 5: [Part-A] is still listed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-R28, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 6.6 (Vendor return: still offered, tagged); tech plan §6 Phase 6 frontend (Delete trap). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-R28: “When the part has a return or credit that is not completed, Delete Part does nothing and hovering it shows "Please complete or cancel the related return or credit first."”
- PRD §8 User Feedback Summary (Delete Part hovered on a part with an open return or credit): “"Please complete or cancel the related return or credit first."”
- PRD §8 User Feedback Summary (Delete Part hovered on a part with an open return or credit) — Behavior: “Tooltip”
- Tech plan, 7 Oct 2026, §6 Phase 6 frontend (Delete trap): “It stays enabled and no-ops, so the S13-R27/R28 tooltip fires”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Delete Part on a part with an open return shows why and does nothing
Test case: C425715, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] (3 on hand) on vendor return [RET-1], saved and not completed.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-DELRET-01 and [Vendor-A] = ZZAUTOTEST PL DELRET Vendor (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Del Return → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Parts → Vendors → add [Vendor-A] → Save.
- Parts → Returns → Create Return → Vendor [Vendor-A] → Part Number: pick [Part-A] → Qty To Return 1 → Save Return. [RET-1] = this return.
- Check the setup worked: Parts → Returns lists [RET-1], not completed.



========== C425716 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Deleting a part that reached a work order meanwhile is refused
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] on no work order at the start; work order [WO-1] with one line.
--- STEPS
- Tab 1: Parts → Inventory → search [Part-A] → click the row (leave it open).
- Tab 2: open [WO-1] → line ⋮ → Request part → pick the [Part-A] result with an Inventory Qty → take 1 → Save Part.
- Tab 1: click Delete Part.
- Tab 1: close the window and search [Part-A].
--- EXPECTED
Expected results
- Step 3: the delete is refused with the red message "Inventory part that has a work order part cannot be deleted." (with the standard second line "Please try to resolve this."), fading after about 3 seconds. No other error message appears.
- Step 4: [Part-A] is still listed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-N6, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 2.1 (The part as it stands). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-N6: “If Delete Part reaches the system while the part sits on a work order, or has a return or credit that is not completed, the delete is refused with "Inventory part that has a work order part cannot be deleted." or "Inventory part with an open return or a pending credit cannot be deleted." Only that message is shown.”
- PRD §8 User Feedback Summary (Delete refused, part on a work order): “"Inventory part that has a work order part cannot be deleted."”
- PRD §8 User Feedback Summary (Delete refused, part on a work order) — Behavior: “Error toast, fades after 3 seconds”
- PRD §8 User Feedback Summary context note: “every refusal sent by the system, the rows that fade after 3 seconds, also shows a second, smaller line under the message: "Please try to resolve this."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Deleting a part that reached a work order meanwhile is refused
Test case: C425716, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] on no work order at the start; work order [WO-1] with one line.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-DELRACE-01 and [Cust] = ZZAUTOTEST PL DELRACE Customer (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Del Race → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Customers → New Customer → name [Cust] → Save; add an asset to it (e.g. unit 'ZZ1'). Work Orders → New Work Order → Customer [Cust] → the asset → Create. [WO-1] = the work order number shown. On the work order click New Line → pick any job in the Title list → Save & Close.
- Open a second tab of the same site, signed in as the Admin at [Loc-1].
- Check the setup worked: [WO-1] → Parts tab does not list [Part-A].



========== C425717 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Deleting a part that got an open return meanwhile is refused
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] (3 on hand) on no return at the start; vendor [Vendor-A].
--- STEPS
- Tab 1: Parts → Inventory → search [Part-A] → click the row (leave it open).
- Tab 2: Parts → Returns → Create Return → [Vendor-A] → pick [Part-A] → Qty To Return 1 → Save Return.
- Tab 1: click Delete Part.
- Tab 1: close the window and search [Part-A].
--- EXPECTED
Expected results
- Step 3: the delete is refused with the red message "Inventory part with an open return or a pending credit cannot be deleted." (with the second line "Please try to resolve this."), fading after about 3 seconds. No other error message appears.
- Step 4: [Part-A] is still listed.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-N6, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 6.6 (Vendor return: still offered, tagged). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-N6: “If Delete Part reaches the system while the part sits on a work order, or has a return or credit that is not completed, the delete is refused with "Inventory part that has a work order part cannot be deleted." or "Inventory part with an open return or a pending credit cannot be deleted." Only that message is shown.”
- PRD §8 User Feedback Summary (Delete refused, part has an open return or credit): “"Inventory part with an open return or a pending credit cannot be deleted."”
- PRD §8 User Feedback Summary (Delete refused, part has an open return or credit) — Behavior: “Error toast, fades after 3 seconds”
- PRD §8 User Feedback Summary context note: “every refusal sent by the system, the rows that fade after 3 seconds, also shows a second, smaller line under the message: "Please try to resolve this."”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Deleting a part that got an open return meanwhile is refused
Test case: C425717, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] (3 on hand) on no return at the start; vendor [Vendor-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-DELRACERET-01 and [Vendor-A] = ZZAUTOTEST PL DELRACERET Vendor (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Del Race Return → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Parts → Vendors → add [Vendor-A] → Save.
- Open a second tab of the same site, signed in as the Admin at [Loc-1].
- Check the setup worked: Parts → Returns lists no return for [Part-A].



========== C425718 · section 20480 (S13 Edit the part number of an existing part)
TITLE: A number over 50 characters is refused while on an open part request
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] on an open part request on [WO-1] (requested, not received); part [Part-B] on no part request.
- Must hold: [Long-51] is exactly 51 characters and [Long-60] exactly 60 characters.
--- STEPS
- Parts → Inventory → search [Part-A] → click the row.
- Replace the Part Number with [Long-51].
- Click Save.
- Click Cancel.
- Click the [Part-B] row, replace the Part Number with [Long-60] and click Save.
--- EXPECTED
Expected results
- Step 3: nothing is saved and the window stays open. A red message reads "Part number can't be longer than 50 characters while it's on an open part request." (with the second line "Please try to resolve this.") and fades after about 3 seconds.
- Step 4: [Part-A] keeps its number.
- Step 5: [Part-B] saves with the 60-character number [Long-60] (no open part request, so no limit).
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-N7, §8 User Feedback Summary, read 8 Oct 2026; design canvas: no board shows this behaviour; tech plan §6 Phase 6 functional tests. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-N7: “If the new number is longer than 50 characters and the part sits on an open part request, the save is refused with "Part number can't be longer than 50 characters while it's on an open part request."”
- PRD §8 User Feedback Summary (Rename over 50 characters with an open part request): “"Part number can't be longer than 50 characters while it's on an open part request."”
- PRD §8 User Feedback Summary (Rename over 50 characters with an open part request) — Behavior: “Error toast, fades after 3 seconds; the dialog stays open”
- Tech plan, 7 Oct 2026, §6 Phase 6 functional tests: “S13-N7 refusal with the exact copy; no open part request → a 60-character rename saves”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: A number over 50 characters is refused while on an open part request
Test case: C425718, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] on an open part request on [WO-1] (requested, not received); part [Part-B] on no part request.
- Must hold: [Long-51] is exactly 51 characters and [Long-60] exactly 60 characters.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-LONG-01, [Part-B] = ZZAUTOTEST-PL-LONG-02, [Long-51] = ZZAUTOTEST-PL-LONG-01-XXXXXXXXXXXXXXXXXXXXXXXXXXXXX (51 characters), [Long-60] = ZZAUTOTEST-PL-LONG-02-YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY (60 characters), [Cust] = ZZAUTOTEST PL LONG Customer (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Long A → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Long B → Part Number: [Part-B] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Customers → New Customer → name [Cust] → Save; add an asset to it (e.g. unit 'ZZ1'). Work Orders → New Work Order → Customer [Cust] → the asset → Create. [WO-1] = the work order number shown. On the work order click New Line → pick any job in the Title list → Save & Close.
- On the line: ⋮ → Request part → type [Part-A] and pick the result marked "Part Library" → Quantity 1 → Save Part (it stays requested).
- Check the setup worked: [WO-1] → Parts tab lists [Part-A] as Requested.



========== C425719 · section 20480 (S13 Edit the part number of an existing part)
TITLE: The part window offers no way to move a part to another library entry
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one part [Part-A].
--- STEPS
- Click the [Part-A] row.
- Scroll through every field of the window.
- Click Cancel.
--- EXPECTED
Expected results
- Step 2: there is no Part Library (or Catalog Part) field and no way to pick a different library entry; the only number control is the Part Number text field.
- Step 2: the system's own refusal of a move made another way (red message "A part can't be moved to a different Part Library entry.", fading after about 3 seconds) — this part cannot be checked by hand; write 'not checked by hand' in the result comment.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-N8, S13-E1, §4 Key Decisions, §8 User Feedback Summary, read 8 Oct 2026; design canvas board 2.1 (The part as it stands). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-N8: “If a request to point a part at a different Part Library entry reaches the system by any route, it is refused with "A part can't be moved to a different Part Library entry."”
- S13-E1: “Pointing a part at a different Part Library entry is not offered in the part dialog, and the system refuses it by any other route. Re-importing a part through the parts CSV import with a fully different old number creates a separate part under the old number. Both are for the merge and duplicate tool (Out of scope).”
- PRD §4 Key Decisions (re-point removed): “Pointing a part at a different Part Library entry is removed from the part dialog. The dialog has no Part Library selector, and the system refuses a re-point by any other route.”
- PRD §8 User Feedback Summary (Part pointed at a different Part Library entry): “"A part can't be moved to a different Part Library entry."”
- PRD §8 User Feedback Summary (Part pointed at a different Part Library entry) — Behavior: “Error toast, fades after 3 seconds”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The part window offers no way to move a part to another library entry
Test case: C425719, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: one part [Part-A].
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-REPOINT-01 (example).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Repoint → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: search [Part-A] → one row.



========== C425720 · section 20480 (S13 Edit the part number of an existing part)
TITLE: The parts import never changes an entry's part number
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] (upper case) with Sell Price $20.00. [Part-A-lower] is [Part-A] in lower case.
--- STEPS
- Settings → Data Import → Inventory → download the template the screen offers → fill ONE row: Part Number [Part-A-lower], Description ZZAUTOTEST PL Import Number CSV, Sell Price 30.00, and the other columns the template requires (e.g. Category Uncategorized, Cost 10.00) → upload the file → run the import.
- Parts → Inventory → search impnum.
- Parts → Part Library → search impnum.
--- EXPECTED
Expected results
- Step 1: the import finishes.
- Step 2: still one row; its Part Number still reads [Part-A] in upper case (not changed to the row's lower case); Sell Price $30.00 and Description ZZAUTOTEST PL Import Number CSV (the row updated this part).
- Step 3: one entry, number [Part-A] unchanged.
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-N9, §2 Out of scope (CSV import matching), read 8 Oct 2026; design canvas: no board shows this behaviour. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-N9: “The parts CSV import never moves a part to a different Part Library entry and never changes an entry's part number.”
- PRD §2 Out of scope (parts CSV import matching): “The import matches a number ignoring upper and lower case. If nothing matches, it also ignores hyphens, asterisks, periods and spaces. It writes the row's description onto the entry it matches. It never moves a part to a different entry and never changes an entry's part number (S13-N9).”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: The parts import never changes an entry's part number
Test case: C425720, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] (upper case) with Sell Price $20.00. [Part-A-lower] is [Part-A] in lower case.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-IMPNUM-01, [Part-A-lower] = zzautotest-pl-impnum-01 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Import Number → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Check the setup worked: search impnum → one row [Part-A], Sell Price $20.00.



========== C425721 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Re-importing the old number of a case-only rename updates that part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] renamed (case only) to [Part-A-lower], Sell Price $20.00.
--- STEPS
- Settings → Data Import → Inventory → download the template the screen offers → fill ONE row: Part Number [Part-A], Description ZZAUTOTEST PL Import Case CSV, Sell Price 31.00, and the other columns the template requires (e.g. Category Uncategorized, Cost 10.00) → upload the file → run the import.
- Parts → Inventory → search impcase (Active and Inactive tabs).
- Parts → Part Library → search impcase.
--- EXPECTED
Expected results
- Step 1: the import finishes.
- Step 2: still exactly one row, reading [Part-A-lower], now with Sell Price $31.00. No second part was added.
- Step 3: one entry, number [Part-A-lower].
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-N9a, read 8 Oct 2026; design canvas: no board shows this behaviour; tech plan §7 edge cases. Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-N9a: “When an import row's number matches a Part Library entry that is already stocked as a part at this location, the import updates that part. It never adds a second part on the same entry. A match ignores upper and lower case, hyphens, asterisks, periods and spaces, so re-importing an old number that differs from the new one only in those ways updates the renamed part.”
- Tech plan, 7 Oct 2026, §7 Edge cases to watch: “case-only rename of a part's own entry (allowed)”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Re-importing the old number of a case-only rename updates that part
Test case: C425721, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] renamed (case only) to [Part-A-lower], Sell Price $20.00.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-IMPCASE-01, [Part-A-lower] = zzautotest-pl-impcase-01 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Import Case → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Open [Part-A] → replace the Part Number with [Part-A-lower] → Save.
- Check the setup worked: search impcase → one row reading [Part-A-lower].



========== C425722 · section 20480 (S13 Edit the part number of an existing part)
TITLE: Re-importing a fully different old number creates a separate part
--- PRECONDITIONS (TestRail)
Setup (manual QA tester and Claude session)
Preconditions
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] renamed to the fully different number [Part-A-new], Sell Price $20.00.
--- STEPS
- Settings → Data Import → Inventory → download the template the screen offers → fill ONE row: Part Number [Part-A], Description ZZAUTOTEST PL Import Old CSV, Sell Price 33.00, and the other columns the template requires (e.g. Category Uncategorized, Cost 10.00) → upload the file → run the import.
- Parts → Inventory → search ZZAUTOTEST-PL-IMP.
- Parts → Part Library → search ZZAUTOTEST-PL-IMP.
--- EXPECTED
Expected results
- Step 1: the import finishes.
- Step 2: two rows: a new part [Part-A] (Sell Price $33.00) and the renamed [Part-A-new], untouched (Sell Price $20.00).
- Step 3: two entries, [Part-A] and [Part-A-new].
Source — where this behaviour comes from
Epic SV-10647; story SV-10826 (Story 13, The Part Dialog); PRD "Parts Lifecycle Update", Confluence 829227015, v26 (Ready for dev), S13-E1, read 8 Oct 2026; design canvas: no board shows this behaviour; tech plan §6 Phase 6 functional tests (ImportTest). Source-verified 8 October 2026; not yet build-verified (no Part Lifecycle QA build exists).
Exact quotes from the source (for reproducibility)
- S13-E1: “Pointing a part at a different Part Library entry is not offered in the part dialog, and the system refuses it by any other route. Re-importing a part through the parts CSV import with a fully different old number creates a separate part under the old number. Both are for the merge and duplicate tool (Out of scope).”
- Tech plan, 7 Oct 2026, §6 Phase 6 functional tests (ImportTest): “after a rename, re-importing a row under the old number creates a separate part under the old number; the renamed part is untouched”
AUTOMATION: HOLD - no Part Lifecycle QA build exists yet, not build-verified
--- CURRENT SETUP DOC (Part 1 and its intro)
# Setup: Re-importing a fully different old number creates a separate part
Test case: C425722, Founder Mode / Part Lifecycle. Part 1 is for a manual QA tester. Part 2 is for a Claude session that prepares and runs the case on its own. Both create the starting state listed in the test case's Preconditions.
How to read this document: a name in square brackets, such as [Part-A], stands for a record you create or pick; it is defined in the list below and used the same way in the test case. Values given as examples can be anything: they are not records that already exist in the app. Write down the real value you used for each name, because the test steps refer to it.
## What the setup creates
- User: an Admin, who has 'Part Library & Inventory → View / Create & Edit / Delete' and See Financial Data.
- [Loc-1] = the location you work in (pick it in the location switcher in the top bar).
- Data at [Loc-1]: part [Part-A] renamed to the fully different number [Part-A-new], Sell Price $20.00.
# Part 1. Setup for manual QA tester
- Write down: [Part-A] = ZZAUTOTEST-PL-IMPOLD-01, [Part-A-new] = ZZAUTOTEST-PL-IMPRENAMED-02 (examples).
- Sign in as the Admin and pick [Loc-1] in the location switcher in the top bar.
- At [Loc-1]: Parts → Inventory → New Inventory Part → Description: ZZAUTOTEST PL Import Old → Part Number: [Part-A] → Category: any (e.g. Uncategorized) → Cost: 10.00 → Sell Price: 20.00 → keep the default bin row (Quantity e.g. 3) → Save.
- Open [Part-A] → replace the Part Number with [Part-A-new] → Save.
- Check the setup worked: search ZZAUTOTEST-PL-IMP → one row, [Part-A-new].

