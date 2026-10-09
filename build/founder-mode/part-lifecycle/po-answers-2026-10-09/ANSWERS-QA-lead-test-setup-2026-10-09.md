# How to create five test situations — answers from the QA lead, 9 Oct 2026

These are facts about how to set up data, not product decisions. They answer the five set-up questions that were
on the developer tab of the Part Lifecycle question sheet. The QA lead answered them in chat on 9 Oct 2026, with an
import file (`inventory-import-no-bin-example.csv`, kept here) and three production screenshots (described below,
not stored). Expected results still come only from the specification; these answers only say how to reach a state.

| # | Situation needed | Answer (QA lead's words) | What a tester does |
|---|---|---|---|
| 1 | A bin with a quantity below zero | "Negative bin can be when you order the inventory part on a work order line when the quantity is already ZERO" | Take an inventory part whose bin quantity is 0, add it to a work order line. The bin goes to −1 (the production Inventory list shows a red "-2 Available" for a part in this state). |
| 2 | A part with no bin, or no default bin | "When we import the part without defining anything under the colum Grid Location (Grid Location in the import file is actually the Bin location in the UI)" | Import a part with the `grid_location` column empty (example file kept here: name 12bilal12, part number 5117608, quantity 0). In Edit Inventory Part it then shows Bin Location "Unassigned", Quantity 0, marked Default, with an "Add Bin Location" link. |
| 3 | The new global search switched on | "By default new global search is enabled for all the accounts including the QA branches." | Nothing to set up. |
| 4 | A Part Library entry that no location stocks | "Yes after deleting the inventory part from parts -> Inventory you can still locate its catalogue entry from parts catalog" | Delete the inventory part in Parts → Inventory; the entry is still found in Parts → Catalog. |
| 5 | Where a part's core shows | "It appears In Parts -> Inventory & Parts -> Returns and at several places more." | Parts → Inventory has a "Core" column (for example $1 for part A158). Parts → Returns lists core returns as "Core for <part>" (for example "Core for A158"), and has a "Show cores only" filter. |

Note on screenshot 1 (Edit Inventory Part for 5117608): the window shows Catalog Part, Vendor, Category, Manufacturer,
Average Cost, Sell Price, Core Charge, Min, Max, Tags, and under Inventory: Bin Location "Unassigned", Quantity 0,
"Default", "Add Bin Location", with Delete and Save buttons.
Note on screenshot 3 (Parts → Returns): one row reads "Core for 0" — a core whose part description is "0". Recorded
as seen; not judged here.

The QA lead also agreed that build verification usually finds these answers itself.
