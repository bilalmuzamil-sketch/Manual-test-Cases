# Cases updated or added since 28 Oct 2026 — list for build verification (4 Nov 2026)

## Technician Toggle — 2 Nov 2026, PRD v18 and Chris's answers 1-8 (54 rewritten, 6 new)
Never build-verified (marked "Not available on Build to test Yet"). The PRD v20 set is listed in its own section below.

| Key | Case | Title |
|---|---|---|
| API-08 | [C897287](https://shopview.testrail.io/index.php?/cases/view/897287) | Turning Time Clock off through the API turns Technician off |
| API-09 | [C897288](https://shopview.testrail.io/index.php?/cases/view/897288) | A request switching Technician on with Time Clock off is refused |
| API-10 | [C897289](https://shopview.testrail.io/index.php?/cases/view/897289) | A request switching Technician on for an Office User is refused |
| API-11 | [C897290](https://shopview.testrail.io/index.php?/cases/view/897290) | With Office User and Time Clock off, the refusal gives the role message |
| API-12 | [C897291](https://shopview.testrail.io/index.php?/cases/view/897291) | Moving a technician to Office User through a request saves and turns it off |
| D-26 | [C897367](https://shopview.testrail.io/index.php?/cases/view/897367) | Design: Edit Labor list shows a former technician grayed out in name order |
| D-27 | [C897368](https://shopview.testrail.io/index.php?/cases/view/897368) | Design: Edit Line shows a former technician as an ordinary chip with its X |
| D-29 | [C897370](https://shopview.testrail.io/index.php?/cases/view/897370) | Design: Board View shows No technicians yet when there are no technicians |
| INV-11 | [C897333](https://shopview.testrail.io/index.php?/cases/view/897333) | A Technician-only change does not log the staff member out |
| INV-12 | [C897334](https://shopview.testrail.io/index.php?/cases/view/897334) | A save that also changes Time Clock still logs the staff member out |
| INV-13 | [C897335](https://shopview.testrail.io/index.php?/cases/view/897335) | A save that changes Technician and the role logs out as a role change does |
| S1-06 | [C897153](https://shopview.testrail.io/index.php?/cases/view/897153) | New Staff Member pre-fills Technician on for the Technician role |
| S1-07 | [C897154](https://shopview.testrail.io/index.php?/cases/view/897154) | New Staff Member pre-fills Technician on for the Foreman role |
| S1-08 | [C897155](https://shopview.testrail.io/index.php?/cases/view/897155) | New Staff Member pre-fills Technician off for the Parts Technician role |
| S1-09 | [C897156](https://shopview.testrail.io/index.php?/cases/view/897156) | New Staff Member pre-fills Technician off for the Parts Manager role |
| S1-10 | [C897157](https://shopview.testrail.io/index.php?/cases/view/897157) | New Staff Member pre-fills off for a custom role made from Technician |
| S1-11 | [C897158](https://shopview.testrail.io/index.php?/cases/view/897158) | New Staff Member pre-fills off for a custom role made from Foreman |
| S1-14 | [C897161](https://shopview.testrail.io/index.php?/cases/view/897161) | With Time Clock off, Technician is grayed out with the Time Clock tooltip |
| S1-15 | [C897162](https://shopview.testrail.io/index.php?/cases/view/897162) | New Staff Member sets Technician again each time the role changes |
| S1-16 | [C897163](https://shopview.testrail.io/index.php?/cases/view/897163) | New Staff Member sets Technician again when Time Clock changes |
| S1-17 | [C897164](https://shopview.testrail.io/index.php?/cases/view/897164) | After a hand switch off, role and Time Clock no longer turn Technician on |
| S1-18 | [C897165](https://shopview.testrail.io/index.php?/cases/view/897165) | After Technician is switched on by hand, a role change keeps it on |
| S1-19 | [C897166](https://shopview.testrail.io/index.php?/cases/view/897166) | After a hand switch, Time Clock off still turns Technician off for good |
| S1-20 | [C897167](https://shopview.testrail.io/index.php?/cases/view/897167) | After a hand switch, picking Office User still turns Technician off for good |
| S1-21 | [C897168](https://shopview.testrail.io/index.php?/cases/view/897168) | A new staff member switched off by hand is saved with Technician off |
| S1-22 | [C897169](https://shopview.testrail.io/index.php?/cases/view/897169) | A new staff member switched on by hand is saved with Technician on |
| S1-23 | [C897170](https://shopview.testrail.io/index.php?/cases/view/897170) | Edit Staff Member never turns Technician on from the role |
| S1-25 | [C897172](https://shopview.testrail.io/index.php?/cases/view/897172) | In Edit Staff Member, Time Clock off turns Technician off and on leaves it off |
| S1-27 | [C897174](https://shopview.testrail.io/index.php?/cases/view/897174) | With Office User and Time Clock off, the role message shows on hover |
| S1-28 | [C897175](https://shopview.testrail.io/index.php?/cases/view/897175) | A custom role made from Office User never grays out Technician |
| S1-37 | [C897184](https://shopview.testrail.io/index.php?/cases/view/897184) | After Save & Add Next, the empty form sets Technician from the role again |
| S3-01 | [C897223](https://shopview.testrail.io/index.php?/cases/view/897223) | Board View gives a column only to technicians |
| S3-02 | [C897224](https://shopview.testrail.io/index.php?/cases/view/897224) | Tech View gives a group only to technicians |
| S3-03 | [C897225](https://shopview.testrail.io/index.php?/cases/view/897225) | The Technician filter offers only the people the board gives a column to |
| S3-04 | [C897226](https://shopview.testrail.io/index.php?/cases/view/897226) | Assign lead technician offers only technicians and says when none match |
| S3-07 | [C897229](https://shopview.testrail.io/index.php?/cases/view/897229) | The Lead Technician dropdown offers only technicians |
| S3-08 | [C897230](https://shopview.testrail.io/index.php?/cases/view/897230) | Add Technician in the New Line window offers only technicians |
| S3-09 | [C897231](https://shopview.testrail.io/index.php?/cases/view/897231) | Add Technician in the Edit Line window offers only technicians |
| S3-10 | [C897232](https://shopview.testrail.io/index.php?/cases/view/897232) | The Edit Labor technician list offers only technicians |
| S3-11 | [C897233](https://shopview.testrail.io/index.php?/cases/view/897233) | Someone with Time Clock off is not offered |
| S3-21 | [C897243](https://shopview.testrail.io/index.php?/cases/view/897243) | With no technicians and no lead, Lead technician shows as read-only Unassigned |
| S3-23 | [C897245](https://shopview.testrail.io/index.php?/cases/view/897245) | In Edit Labor, a former technician on the line is grayed out in name order |
| S3-24 | [C897246](https://shopview.testrail.io/index.php?/cases/view/897246) | In Edit Line, a former technician is a removable chip and stays when saved |
| S3-25 | [C897247](https://shopview.testrail.io/index.php?/cases/view/897247) | In Edit Line, a former technician with logged time shows the lock |
| S3-26 | [C897248](https://shopview.testrail.io/index.php?/cases/view/897248) | Removing a former technician's chip in Edit Line takes them off the line |
| S3-29 | [C897251](https://shopview.testrail.io/index.php?/cases/view/897251) | Board View with no technicians shows "No technicians yet" with the new text |
| S3-30 | [C897252](https://shopview.testrail.io/index.php?/cases/view/897252) | Tech View with no technicians shows "No technicians yet" with the new text |
| S3-31 | [C897253](https://shopview.testrail.io/index.php?/cases/view/897253) | With no technicians and no work orders, "Nothing here yet" has the new text |
| S3-32 | [C897254](https://shopview.testrail.io/index.php?/cases/view/897254) | "Set Up Technicians" on the empty board opens the staff list |
| S3-33 | [C897255](https://shopview.testrail.io/index.php?/cases/view/897255) | "No technicians yet" does not show while a non-technician lead keeps a column |
| S3-34 | [C897256](https://shopview.testrail.io/index.php?/cases/view/897256) | "No technicians yet" does not show while a pinned column is kept |
| S3-35 | [C897257](https://shopview.testrail.io/index.php?/cases/view/897257) | "No technicians yet" does not show with Assigned to me on |
| S3-36 | [C897258](https://shopview.testrail.io/index.php?/cases/view/897258) | "No technicians yet" does not show with a Technician filter on |
| S3-48 | [C897269](https://shopview.testrail.io/index.php?/cases/view/897269) | A Technician filter set to someone who is then turned off |
| S1-38 | [C897376](https://shopview.testrail.io/index.php?/cases/view/897376) | An old staff window that turns Technician on without Time Clock is refused |
| S1-39 | [C897377](https://shopview.testrail.io/index.php?/cases/view/897377) | An old staff window that turns Technician on for an Office User is refused |
| S1-40 | [C897378](https://shopview.testrail.io/index.php?/cases/view/897378) | An old staff window that turns Technician on for a Time Clock User is refused |
| S1-41 | [C897379](https://shopview.testrail.io/index.php?/cases/view/897379) | With Time Clock off and Office User, an old window gets the role message |
| S3-49 | [C897380](https://shopview.testrail.io/index.php?/cases/view/897380) | The filter's Deleted technician choice keeps "No technicians yet" away |
| S3-50 | [C897381](https://shopview.testrail.io/index.php?/cases/view/897381) | People picked in the filter at another location are dropped on switching |

## Credit terms — 28 Oct 2026, PRD v5 (9 rewritten, 8 new)
No build of Credit terms has been checked yet.

| Key | Case | Title |
|---|---|---|
| S2-30 | [C723930](https://shopview.testrail.io/index.php?/cases/view/723930) | Deactivating a term another user just made the default is refused |
| S2-31 | [C723931](https://shopview.testrail.io/index.php?/cases/view/723931) | Deleting a term another user just put a customer on is refused |
| S2-32 | [C723932](https://shopview.testrail.io/index.php?/cases/view/723932) | Deleting a term another user just made the default is refused |
| S2-33 | [C723933](https://shopview.testrail.io/index.php?/cases/view/723933) | Making a term the default after another user deactivated it is refused |
| S2-34 | [C723934](https://shopview.testrail.io/index.php?/cases/view/723934) | Deleting a term another user already deleted says it was not found |
| S2-36 | [C723936](https://shopview.testrail.io/index.php?/cases/view/723936) | Acting on a term another user renamed after the page loaded |
| S10-08 | [C724077](https://shopview.testrail.io/index.php?/cases/view/724077) | An import update of an old COD customer clears its stored limit |
| S10-12 | [C724081](https://shopview.testrail.io/index.php?/cases/view/724081) | An API term in other capitals saves and reads back in the term's spelling |
| S10-16 | [C724085](https://shopview.testrail.io/index.php?/cases/view/724085) | The Public API has no way to list terms or the default |
| S2-37 | [C847735](https://shopview.testrail.io/index.php?/cases/view/847735) | Saving an edit after another user deactivated the term is refused |
| S2-38 | [C847736](https://shopview.testrail.io/index.php?/cases/view/847736) | Saving an edit after another user saved the same term is refused |
| S7-11 | [C847737](https://shopview.testrail.io/index.php?/cases/view/847737) | A/P aging shows a vendor invoice's new due date after its date changes |
| S7-12 | [C847738](https://shopview.testrail.io/index.php?/cases/view/847738) | A/P aging shows a vendor invoice's new due date after its vendor changes |
| S10-17 | [C847739](https://shopview.testrail.io/index.php?/cases/view/847739) | An import update with an empty credit limit cell keeps the stored limit |
| S10-18 | [C847740](https://shopview.testrail.io/index.php?/cases/view/847740) | An import update with no credit limit column keeps the stored limit |
| S10-19 | [C847741](https://shopview.testrail.io/index.php?/cases/view/847741) | An import update onto Credit Hold with an empty limit cell saves $0 |
| S10-20 | [C847742](https://shopview.testrail.io/index.php?/cases/view/847742) | A vendor created through the API with no term starts on COD |

## Part Lifecycle — 28 Oct 2026, PRD v35 (28 rewritten, 8 new)
All are in run 556 (Mudassir), which is being executed now on sv10647.

| Key | Case | Title |
|---|---|---|
| S5-05 | [C425631](https://shopview.testrail.io/index.php?/cases/view/425631) | Turning tracking on marks the first bin as default when none is |
| S5-16 | [C573675](https://shopview.testrail.io/index.php?/cases/view/573675) | After its default bin is deleted, turning tracking on marks the remaining bin |
| S5-17 | [C573676](https://shopview.testrail.io/index.php?/cases/view/573676) | A part's core has no row of its own on the Inventory or Part Library list |
| S5-17b | [C839423](https://shopview.testrail.io/index.php?/cases/view/839423) | A part's core has no row of its own on the Part Library list |
| S9-28 | [C425746](https://shopview.testrail.io/index.php?/cases/view/425746) | Vendor return part search without View shows the access error |
| S9-41 | [C573685](https://shopview.testrail.io/index.php?/cases/view/573685) | Without Vendor Order Management View, Returns cannot be opened |
| S9-42 | [C573686](https://shopview.testrail.io/index.php?/cases/view/573686) | With Vendor Order Management View only, a new return cannot be started |
| S10-01 | [C154789](https://shopview.testrail.io/index.php?/cases/view/154789) | Saving a different Part Status asks to confirm first |
| S10-19 | [C425766](https://shopview.testrail.io/index.php?/cases/view/425766) | A core has no row of its own to tick in Deactivate parts |
| S11-02 | [C154829](https://shopview.testrail.io/index.php?/cases/view/154829) | Clicking a Part Library row opens the entry's detail page |
| S11-18 | [C573671](https://shopview.testrail.io/index.php?/cases/view/573671) | Delete is disabled while a part still uses the Part Library entry |
| S12-03 | [C154834](https://shopview.testrail.io/index.php?/cases/view/154834) | Roles & Permissions shows the Part Library and Inventory permission group |
| S12-10 | [C425625](https://shopview.testrail.io/index.php?/cases/view/425625) | Release day leaves every role's permissions as they were |
| S13-45 | [C839448](https://shopview.testrail.io/index.php?/cases/view/839448) | A new number that looks like a part at another location is refused |
| S7-17 | [C425681](https://shopview.testrail.io/index.php?/cases/view/425681) | Changing a part's number to one already stocked here is refused |
| S7-25 | [C573682](https://shopview.testrail.io/index.php?/cases/view/573682) | An imported part with no bin location goes to the Unassigned bin |
| S12-06 | [C425620](https://shopview.testrail.io/index.php?/cases/view/425620) | Deleting a Part Library entry that a part uses is refused |
| D-33 | [C839486](https://shopview.testrail.io/index.php?/cases/view/839486) | Design: Part History keeps column widths when events are long |
| D-49 | [C839502](https://shopview.testrail.io/index.php?/cases/view/839502) | Design: Status confirmation has a close X in its title row |
| S8-04 | [C154783](https://shopview.testrail.io/index.php?/cases/view/154783) | A status change is refused for a user who has just lost the right to delete |
| S8-13 | [C425654](https://shopview.testrail.io/index.php?/cases/view/425654) | A tracking change is refused for a user who has just lost the right to delete |
| S8-14 | [C425655](https://shopview.testrail.io/index.php?/cases/view/425655) | Creating an untracked part is refused for a user who has just lost Delete |
| S13-19 | [C425697](https://shopview.testrail.io/index.php?/cases/view/425697) | A rename carries over to open part requests |
| D-11 | [C839464](https://shopview.testrail.io/index.php?/cases/view/839464) | Design: Bulk deactivation confirmation looks as in the design |
| D-12 | [C839465](https://shopview.testrail.io/index.php?/cases/view/839465) | Design: Bulk reactivation confirmation looks as in the design |
| D-24 | [C839477](https://shopview.testrail.io/index.php?/cases/view/839477) | Design: Deactivate part confirmation looks as in the design |
| D-25 | [C839478](https://shopview.testrail.io/index.php?/cases/view/839478) | Design: Activate part confirmation looks as in the design |
| D-42 | [C839495](https://shopview.testrail.io/index.php?/cases/view/839495) | Design: Part Library entry page looks as in the design |
| S7-17b | [C847726](https://shopview.testrail.io/index.php?/cases/view/847726) | Changing a number to a look-alike of an inactive part here is refused |
| S7-27 | [C847727](https://shopview.testrail.io/index.php?/cases/view/847727) | An imported part is tracked and takes its description from the name column |
| S9-49 | [C847728](https://shopview.testrail.io/index.php?/cases/view/847728) | Global search never lists a part's core |
| S10-36 | [C847729](https://shopview.testrail.io/index.php?/cases/view/847729) | Pressing Esc or clicking outside does not close a status confirmation |
| S11-21 | [C847730](https://shopview.testrail.io/index.php?/cases/view/847730) | Delete in Edit Library Part is enabled only after the page is reloaded |
| S12-15 | [C847731](https://shopview.testrail.io/index.php?/cases/view/847731) | Opening the address of a deleted Part Library entry says it is not found |
| S13-48 | [C847732](https://shopview.testrail.io/index.php?/cases/view/847732) | A rename leaves the old number on part sale lines that hold the part |
| S13-49 | [C847733](https://shopview.testrail.io/index.php?/cases/view/847733) | A look-alike rename on the Part Library page names the location it clashes with |

## What/Why — 28 Oct 2026, PRD v16 (15 rewritten, 7 new)
The build-verification session edited these cases on 28 Oct after our write (markers, EXPECT FAIL SV-11850).

| Key | Case | Title |
|---|---|---|
| S1-03 | [C154709](https://shopview.testrail.io/index.php?/cases/view/154709) | New Line will not save without a Title and shows "Title is a required field" |
| S1-03b | [C839503](https://shopview.testrail.io/index.php?/cases/view/839503) | Leaving the Title empty shows "Title is a required field" under it |
| S1-05 | [C549075](https://shopview.testrail.io/index.php?/cases/view/549075) | Edit Line will not save an emptied Title and shows the required message |
| S2-03 | [C549079](https://shopview.testrail.io/index.php?/cases/view/549079) | Empty ShopCoach title and description show the question prompts |
| S3-03 | [C154715](https://shopview.testrail.io/index.php?/cases/view/154715) | QuickBooks Online and the Customer Invoice report show the same line text |
| S3-05 | [C154717](https://shopview.testrail.io/index.php?/cases/view/154717) | An over-long line is shortened from the end in the report, title kept |
| S3-06 | [C154718](https://shopview.testrail.io/index.php?/cases/view/154718) | Hyphens, semicolons and capitals typed in a line are carried as written |
| S3-08 | [C154720](https://shopview.testrail.io/index.php?/cases/view/154720) | Other downloaded reports do not carry the joined Title - Description text |
| S3-09 | [C154721](https://shopview.testrail.io/index.php?/cases/view/154721) | Invoices already in QuickBooks Online keep the text they were sent with |
| S3-13 | [C549083](https://shopview.testrail.io/index.php?/cases/view/549083) | An accented over-long line is cut earlier and never in the middle of a letter |
| S3-14 | [C549084](https://shopview.testrail.io/index.php?/cases/view/549084) | An over-long line still reaches QuickBooks Online and matches the report |
| S3-15 | [C549085](https://shopview.testrail.io/index.php?/cases/view/549085) | An imported historical invoice is not sent to QuickBooks Online |
| S3-21 | [C839507](https://shopview.testrail.io/index.php?/cases/view/839507) | Spaces and an empty line at the end of the tech story do not reach the report |
| S3-22 | [C839508](https://shopview.testrail.io/index.php?/cases/view/839508) | A space typed at the end of the title is kept before the separator |
| S3-23 | [C839509](https://shopview.testrail.io/index.php?/cases/view/839509) | An invoice made before the release shows the new text in the downloaded report |
| S1-09 | [C847719](https://shopview.testrail.io/index.php?/cases/view/847719) | New Line says "Title cannot be longer than 255 characters" at 256 |
| S1-10 | [C847720](https://shopview.testrail.io/index.php?/cases/view/847720) | Edit Line says "Title cannot be longer than 255 characters" at 256 |
| S3-24 | [C847721](https://shopview.testrail.io/index.php?/cases/view/847721) | An imported invoice never appears in the Customer Invoice report |
| S3-25 | [C847722](https://shopview.testrail.io/index.php?/cases/view/847722) | The report puts one apostrophe before a line starting with =, +, - or @ |
| S3-26 | [C847723](https://shopview.testrail.io/index.php?/cases/view/847723) | QuickBooks Online gets no apostrophe before a line starting with = |
| S4-09 | [C847724](https://shopview.testrail.io/index.php?/cases/view/847724) | An import row with an empty *Line Title says "Line Title cannot be empty." |
| D-18 | [C847725](https://shopview.testrail.io/index.php?/cases/view/847725) | Design: Modern invoice prints no Scope of work heading without a tech story |

## Technician Toggle — 4 Nov 2026, PRD v20 (16 rewritten, 3 new C913764-C913766)
All in run 555 (Mudassir). S6 cases are release-day cases (run on production around the release).

| Key | Case | Title |
|---|---|---|
| S3-01 | [C897223](https://shopview.testrail.io/index.php?/cases/view/897223) | Board View gives a column only to technicians |
| S3-02 | [C897224](https://shopview.testrail.io/index.php?/cases/view/897224) | Tech View gives a group only to technicians |
| S3-03 | [C897225](https://shopview.testrail.io/index.php?/cases/view/897225) | The Technician filter offers only the people the board gives a column to |
| S3-04 | [C897226](https://shopview.testrail.io/index.php?/cases/view/897226) | Assign lead technician offers only technicians and says when none match |
| S3-07 | [C897229](https://shopview.testrail.io/index.php?/cases/view/897229) | The Lead Technician dropdown offers only technicians |
| S3-08 | [C897230](https://shopview.testrail.io/index.php?/cases/view/897230) | Add Technician in the New Line window offers only technicians |
| S3-11 | [C897233](https://shopview.testrail.io/index.php?/cases/view/897233) | Someone with Time Clock off is not offered |
| S3-48 | [C897269](https://shopview.testrail.io/index.php?/cases/view/897269) | A Technician filter set to someone who is then turned off |
| S3-50 | [C897381](https://shopview.testrail.io/index.php?/cases/view/897381) | People picked in the filter at another location are dropped on switching |
| S6-01 | [C897295](https://shopview.testrail.io/index.php?/cases/view/897295) | Time on a work order in the last 90 days turns Technician on |
| S6-02 | [C897296](https://shopview.testrail.io/index.php?/cases/view/897296) | Time on a work order older than 90 days does not turn Technician on |
| S6-03 | [C897297](https://shopview.testrail.io/index.php?/cases/view/897297) | Time on a part sale in the last 90 days turns Technician on |
| S6-04 | [C897298](https://shopview.testrail.io/index.php?/cases/view/897298) | A manual time entry made by someone else turns Technician on |
| S6-05 | [C897299](https://shopview.testrail.io/index.php?/cases/view/897299) | Time on a department only does not turn Technician on |
| S6-06 | [C897300](https://shopview.testrail.io/index.php?/cases/view/897300) | A time entry dated after the release moment also counts |
| INV-06 | [C897328](https://shopview.testrail.io/index.php?/cases/view/897328) | Schedule lanes still follow departments, not the Technician toggle |
| S3-51 | [C913764](https://shopview.testrail.io/index.php?/cases/view/913764) | A turned-off person stays picked while Work Orders stays open |
| S3-52 | [C913765](https://shopview.testrail.io/index.php?/cases/view/913765) | A picked person who still leads shown work stays picked after turning off |
| S3-53 | [C913766](https://shopview.testrail.io/index.php?/cases/view/913766) | A turned-off person picked in the filter drops out when Work Orders is reopened |
