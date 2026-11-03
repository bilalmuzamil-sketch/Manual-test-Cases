# Parts Lifecycle — tests whose setup needs a hard data state (not yet build-verified on sv10647, 3 Nov 2026)

Suite: TestRail group 20439 "Part Lifecycle" (Founder Mode, September 2026).

| C-id | Title | Setup needs |
|---|---|---|
| [C154753](https://shopview.testrail.io/index.php?/cases/view/154753) | Parts from before the release are active and tracked | something that existed before this release |
| [C154775](https://shopview.testrail.io/index.php?/cases/view/154775) | Total Qty sort puts untracked parts below tracked parts both ways | a bin pushed below zero by a work order |
| [C154778](https://shopview.testrail.io/index.php?/cases/view/154778) | A number held by two Part Library entries gets a new entry of its own | something that existed before this release |
| [C154791](https://shopview.testrail.io/index.php?/cases/view/154791) | A status change records who made it and when | a part created on an earlier day, or a past date in Inventory Value |
| [C154831](https://shopview.testrail.io/index.php?/cases/view/154831) | Part Library entries from before the release stay listed | something that existed before this release |
| [C154835](https://shopview.testrail.io/index.php?/cases/view/154835) | An old bookmark to the Catalog page opens the Part Library | a bookmark saved before this release; something that existed before this release |
| [C154839](https://shopview.testrail.io/index.php?/cases/view/154839) | Changing the part number warns how many other locations it changes | a third location |
| [C425591](https://shopview.testrail.io/index.php?/cases/view/425591) | An empty Inactive tab says No inactive parts at this location. | a location with no inactive (or no untracked) parts |
| [C425596](https://shopview.testrail.io/index.php?/cases/view/425596) | More than 200 ticked parts disables Deactivate | 35 to 201 parts at once |
| [C425597](https://shopview.testrail.io/index.php?/cases/view/425597) | Search, filters, sorting and scrolling keep working in bulk mode | 35 to 201 parts at once |
| [C425613](https://shopview.testrail.io/index.php?/cases/view/425613) | A number changed on the Part Library page reaches an open part request | an open part request on a work order |
| [C425614](https://shopview.testrail.io/index.php?/cases/view/425614) | A Part Library number over 50 characters is refused on an open part request | an open part request on a work order |
| [C425616](https://shopview.testrail.io/index.php?/cases/view/425616) | A part requested from a vendor reaches the Part Library when it is received | an open purchase order |
| [C425624](https://shopview.testrail.io/index.php?/cases/view/425624) | A special-order lookup result shows Part Library and its vendor | a special-order part received from a vendor in the last 12 months |
| [C425625](https://shopview.testrail.io/index.php?/cases/view/425625) | Release day leaves every role's permissions as they were | something that existed before this release |
| [C425626](https://shopview.testrail.io/index.php?/cases/view/425626) | Release day keeps saved names that contain the word Catalog | something that existed before this release |
| [C425642](https://shopview.testrail.io/index.php?/cases/view/425642) | With no untracked parts, searching not tracked lists nothing | a location with no inactive (or no untracked) parts |
| [C425657](https://shopview.testrail.io/index.php?/cases/view/425657) | Inventory Value for an earlier date still counts a part untracked today | a part created on an earlier day, or a past date in Inventory Value |
| [C425658](https://shopview.testrail.io/index.php?/cases/view/425658) | Inventory Value before the release counts every part as tracked | a part created on an earlier day, or a past date in Inventory Value; something that existed before this release |
| [C425660](https://shopview.testrail.io/index.php?/cases/view/425660) | Bins of +5 and -2 show quantity 3 and $30 in Inventory Value | a bin pushed below zero by a work order |
| [C425661](https://shopview.testrail.io/index.php?/cases/view/425661) | A part with only a -2 bin shows -2 and -$20 and lowers the totals | a bin pushed below zero by a work order |
| [C425664](https://shopview.testrail.io/index.php?/cases/view/425664) | The Inventory list's available quantity still leaves out a negative bin | a bin pushed below zero by a work order |
| [C425665](https://shopview.testrail.io/index.php?/cases/view/425665) | The Supply filter still uses the positive bins for a part with a negative bin | a bin pushed below zero by a work order |
| [C425666](https://shopview.testrail.io/index.php?/cases/view/425666) | Fractional bins of +2.5 and -1.25 show quantity 1.25 and $12.50 | a bin pushed below zero by a work order |
| [C425679](https://shopview.testrail.io/index.php?/cases/view/425679) | With active and inactive matches, the active part's number is named | something that existed before this release |
| [C425680](https://shopview.testrail.io/index.php?/cases/view/425680) | Saving a part with its number unchanged is never refused as a duplicate | something that existed before this release |
| [C425683](https://shopview.testrail.io/index.php?/cases/view/425683) | A part from before the release keeps its Part Library entry | something that existed before this release |
| [C425690](https://shopview.testrail.io/index.php?/cases/view/425690) | Changing the description warns how many other locations it changes | a third location |
| [C425694](https://shopview.testrail.io/index.php?/cases/view/425694) | Saving with the part number unchanged leaves the number and open work alone | an open purchase order |
| [C425696](https://shopview.testrail.io/index.php?/cases/view/425696) | A rename carries over to open purchase order lines at every location | an open purchase order |
| [C425697](https://shopview.testrail.io/index.php?/cases/view/425697) | A rename carries over to open part requests but not to received ones | an open part request on a work order; an open purchase order |
| [C425698](https://shopview.testrail.io/index.php?/cases/view/425698) | A rename carries over to canned jobs that hold the part | a canned job holding the part |
| [C425699](https://shopview.testrail.io/index.php?/cases/view/425699) | A rename carries over to vendor returns that are not completed | a vendor return |
| [C425700](https://shopview.testrail.io/index.php?/cases/view/425700) | A delivery opened before a rename is received under the new number | an open purchase order; a received vendor bill |
| [C425715](https://shopview.testrail.io/index.php?/cases/view/425715) | Delete Part on a part with an open return shows why and does nothing | a vendor return |
| [C425717](https://shopview.testrail.io/index.php?/cases/view/425717) | Deleting a part that got an open return meanwhile is refused | a vendor return |
| [C425718](https://shopview.testrail.io/index.php?/cases/view/425718) | A number over 50 characters is refused while on an open part request | an open part request on a work order |
| [C425727](https://shopview.testrail.io/index.php?/cases/view/425727) | Purchase order line lookup does not offer an inactive part | an open purchase order |
| [C425728](https://shopview.testrail.io/index.php?/cases/view/425728) | Changing the part a received vendor bill line points to skips inactive parts | a received vendor bill |
| [C425730](https://shopview.testrail.io/index.php?/cases/view/425730) | A canned job is added without its inactive parts and one warning names them | a canned job holding the part |
| [C425731](https://shopview.testrail.io/index.php?/cases/view/425731) | The canned job warning names a typed vendor part by the inactive part's number | a canned job holding the part |
| [C425732](https://shopview.testrail.io/index.php?/cases/view/425732) | A canned job leaves out the fee that belongs to an inactive part | a canned job holding the part |
| [C425733](https://shopview.testrail.io/index.php?/cases/view/425733) | Vendor return lookup offers an inactive part with a grey Inactive tag | a vendor return |
| [C425741](https://shopview.testrail.io/index.php?/cases/view/425741) | Saving a purchase order line is refused once the part was retired meanwhile | an open purchase order |
| [C425746](https://shopview.testrail.io/index.php?/cases/view/425746) | With Vendor Order Management Create & Edit, a return's part search works | a vendor return |
| [C425751](https://shopview.testrail.io/index.php?/cases/view/425751) | A part retired while on order can still be ordered, received and picked | an open part request on a work order; an open purchase order |
| [C425768](https://shopview.testrail.io/index.php?/cases/view/425768) | A bulk change of forty parts writes forty Part History entries | 35 to 201 parts at once |
| [C540877](https://shopview.testrail.io/index.php?/cases/view/540877) | Receiving a typed purchase order line adds its number to the Part Library | an open purchase order |
| [C540878](https://shopview.testrail.io/index.php?/cases/view/540878) | Inventory Value for a day after release counts a bin below zero | a part created on an earlier day, or a past date in Inventory Value |
| [C540879](https://shopview.testrail.io/index.php?/cases/view/540879) | Inventory Value for a date before release keeps its saved figures | a part created on an earlier day, or a past date in Inventory Value; something that existed before this release |
| [C573672](https://shopview.testrail.io/index.php?/cases/view/573672) | A special order not yet received is not offered with its vendor | a special-order part received from a vendor in the last 12 months |
| [C573673](https://shopview.testrail.io/index.php?/cases/view/573673) | A special order received only at another location is not offered with its vendor | a special-order part received from a vendor in the last 12 months |
| [C573674](https://shopview.testrail.io/index.php?/cases/view/573674) | The special-order result uses the vendor and cost of the latest delivery | a special-order part received from a vendor in the last 12 months |
| [C573682](https://shopview.testrail.io/index.php?/cases/view/573682) | An imported part with no bin location goes to an Unassigned bin | a third location |
| [C573683](https://shopview.testrail.io/index.php?/cases/view/573683) | A linked entry whose manufacturer no longer exists takes the one picked | something that existed before this release |
| [C573684](https://shopview.testrail.io/index.php?/cases/view/573684) | The canned job warning lists inactive parts A to Z, separated by commas | a canned job holding the part |
| [C573686](https://shopview.testrail.io/index.php?/cases/view/573686) | With Vendor Order Management View only, a return's part search is refused | a vendor return |
| [C839418](https://shopview.testrail.io/index.php?/cases/view/839418) | More than 200 ticked parts disables Activate on the Inactive tab | 35 to 201 parts at once |
| [C839424](https://shopview.testrail.io/index.php?/cases/view/839424) | On a vendor return, searching not tracked also lists untracked parts | a vendor return |
| [C839426](https://shopview.testrail.io/index.php?/cases/view/839426) | A linked entry with no category takes the category picked | something that existed before this release |
| [C839433](https://shopview.testrail.io/index.php?/cases/view/839433) | The purchase order part lookup shows Not Tracked for an untracked part | an open purchase order |
| [C839445](https://shopview.testrail.io/index.php?/cases/view/839445) | Received purchase order lines and accepted vendor bills keep the old number | an open purchase order; a received vendor bill |
| [C839446](https://shopview.testrail.io/index.php?/cases/view/839446) | A purchase order line typed by hand with the old number keeps its number | an open purchase order |
| [C839447](https://shopview.testrail.io/index.php?/cases/view/839447) | A hand-typed purchase order line is received under its own number | an open purchase order; a received vendor bill |
| [C839450](https://shopview.testrail.io/index.php?/cases/view/839450) | Inventory Value for a date before a rename shows the old part number | a part created on an earlier day, or a past date in Inventory Value |
| [C839452](https://shopview.testrail.io/index.php?/cases/view/839452) | The Totals row's Margin % stays the true total and can go above 100% | a bin pushed below zero by a work order |
| [C839453](https://shopview.testrail.io/index.php?/cases/view/839453) | The Totals row's Margin % stays the true total and can go below zero | a bin pushed below zero by a work order |
| [C839463](https://shopview.testrail.io/index.php?/cases/view/839463) | Design: Over 200 ticked shows its hover text below Deactivate | 35 to 201 parts at once |
| [C839491](https://shopview.testrail.io/index.php?/cases/view/839491) | Design: Canned job warning looks as in the design | a canned job holding the part |
| [C839492](https://shopview.testrail.io/index.php?/cases/view/839492) | Design: Inactive tag in the vendor return lookup looks as drawn | a vendor return |
