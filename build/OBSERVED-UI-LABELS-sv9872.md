# OBSERVED UI LABELS — sv9872.qa.shopview.com (build v26.36.2-12974d6), 2026-09-11
# Invoice Refresh / Invoice Design Selection (folder 7800). Read live from the build with evidence.

## Settings → Invoice tab → Invoice Design picker
- Settings page tabs (in order): **Organization · Invoice · Work Orders**  (route `/administration/settings`)
- Field label: **Invoice Design**  (a dropdown / pick list at the top of the Invoice tab)
- Options (exactly two): **Modern** · **Legacy**  (the current one carries a check mark)
- Helper text (verbatim): **"Every estimate, invoice and credit invoice your shop shows, prints or sends uses the selected design, including documents created before you changed it."**

## Switch confirmation dialog (shown on either change)
- To Modern — title: **"Switch to the Modern design?"**
- To Legacy — title: **"Switch to the Legacy design?"**
- Body (verbatim, design word swaps): **"Every estimate, invoice and credit invoice will use the <Modern|Legacy> design straight away, including documents your shop has already sent. Reprints and portal copies of older documents change too. You can switch back at any time."**
- Buttons: **Cancel** · **Switch To Modern** (or **Switch To Legacy**)

## Success toast (after confirming)
- **"Invoice design updated."**  (with a check_circle icon)

## Behaviour observed
- Selecting an option opens the confirm dialog; confirming saves immediately and the picker shows the new value.
- Both directions (Modern↔Legacy) show the same dialog shape. Switchable repeatedly.
