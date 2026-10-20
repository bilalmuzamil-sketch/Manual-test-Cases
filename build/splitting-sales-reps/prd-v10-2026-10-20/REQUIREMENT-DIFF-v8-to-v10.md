## S2-R17
v8:  Once the work order is invoiced or paid, or when it is opened from its history, each field is plain text with the same label and wording, with no + or remove x. A work order with both fields shows both labels with their names.
v10: Once the work order is invoiced or paid, or when it is opened from its history, each field is plain text with the same label and wording, with no + or remove x. A work order with both fields shows both labels with their names. On the read-only card only the Sales Representative fields read as in S1-R2 and S2-R5; Lead Technician and Service Advisor keep today's read-only labels.

## S2-N2
v8:  A part sale's card has no + button. A part sale keeps one Sales Representative field.
v10: A part sale's card has no + button. A part sale keeps one Sales Representative field, exactly as Part Sales Update v1 builds it: its label stays "Sales representative" and its look and behavior do not change.

## S4-R3
v8:  Its dropdown starts with "Unassigned", followed by every staff member whose Sales Representative switch is on and whose account is active, sorted by first name, then last name, A to Z, as on the work order (S1-R8). Every one of them is listed, however many there are. It has no search box (S1-R12).
v10: Its dropdown starts with "Unassigned", followed by every staff member whose Sales Representative switch is on and whose account is active, sorted by first name, then last name, A to Z, as on the work order (S1-R8). Every one of them is listed, however many there are. It has no search box (S1-R12). The same list shows when the New Customer window is opened from a part sale by a user who can create part sales but not customers.

## S4-R20
v8:  Deactivating a staff member's account removes them from every customer field they hold. The customer's other fields keep their people. A Part Sales field where they were picked is removed, so new part sales follow again (S4-R26).
v10: Deactivating a staff member's account removes them from every customer field they hold. The customer's other fields keep their people. A Part Sales field where they were picked is removed, so new part sales follow again (S4-R26). Reactivating the account does not put them back.

## S4-R21
v8:  The warning shown before deactivating a sales representative counts every customer where they are in the first field, Service Parts or Part Sales, and counts each customer once.
v10: The Deactivate window, shown before deactivating a sales representative's account, counts every customer where they are in the first field, Service Parts or Part Sales, counting each customer once, and reads "They will be removed as sales representative from {n} customer{s}.", with "customer" when {n} is 1 and "customers" otherwise, in place of today's "Their customer assignments will stay where they are." The "Turn Off Sales Representative" warning, shown when the Sales Representative switch is turned off, does not change and shows no count (S4-N2).

## S4-R23
v8:  The Sales Representative Assignments export lists one row per customer per person, with a column, Side, after "Representative is active?". The one representative of a customer that is not split reads "Parts and Service". A split customer lists "Service Labor" and "Service Parts". "Part Sales" is listed for the person in an added Part Sales field, split or not. A person in more than one field of one customer gets one row listing them in window order, separated by ", ", for example "Parts and Service, Part Sales".
v10: The "Sales Representative Assignments" export, file sales-representative-assignments.csv, lists one row per customer per person, with a column, Side, after "Representative is active?". The one representative of a customer that is not split reads "Parts and Service". A split customer lists "Service Labor" and "Service Parts". "Part Sales" is listed for the person in an added Part Sales field, split or not. A person in more than one field of one customer gets one row listing them in window order, separated by ", ", for example "Parts and Service, Part Sales".

## S4-N2
v8:  Turning off a staff member's Sales Representative switch, without deactivating their account, leaves them in the customer fields they hold, as today.
v10: Turning off a staff member's Sales Representative switch, without deactivating their account, leaves them in the customer fields they hold, as today. In Edit Customer and on the customer page their name reads followed by "(Inactive)", for example "Elliot Brennan (Inactive)", as on the work order (S1-E2). They are not offered in the dropdown, so no option is checked while they hold the field.

## S4-E1
v8:  On release day every existing customer has the one "Sales Representative" field, with no Service Parts or Part Sales field, and keeps its one representative, so the customer page and every invoice read exactly as before, except that an empty field reads "Unassigned" instead of "N/A".
v10: On release day every existing customer has the one "Sales Representative" field, with no Service Parts or Part Sales field, and keeps its one representative, so the customer page and every invoice read exactly as before, except that an empty field reads "Unassigned" instead of "N/A". About 10 customers whose representative is no longer a user of the shop are the exception: they read "Unassigned".

## S5-R6
v8:  Whole-invoice fees and discounts are shared between the Labor and the Parts rows in proportion to each side's labor or parts dollars after that side's line fees and discounts, measured by size whatever their sign. The adjustment that stops a non-taxable discount from taking the subtotal below zero is a whole-invoice amount and is shared the same way. Example: labor $600.00, parts $400.00, shop supplies $30.00, whole-invoice discount ($50.00). The Labor row gets $30.00 supplies and ($30.00); the Parts row gets ($20.00). Subtotals $600.00 and $380.00 add up to $980.00.
v10: Whole-invoice fees and discounts are shared between the Labor and the Parts rows in proportion to each side's labor or parts dollars after that side's line fees and discounts, measured by size whatever their sign. The adjustment that stops a non-taxable discount from taking the subtotal below zero is a whole-invoice amount and is shared the same way. Example: labor $600.00, parts $400.00, shop supplies $30.00, whole-invoice discount ($50.00). The Labor row gets $30.00 supplies and ($30.00); the Parts row gets ($20.00). Subtotals $600.00 and $380.00 add up to $980.00. Each row shows its share in its Adjustments column.

## S5-R7
v8:  A cent left over by rounding the share goes to the Labor row.
v10: The Parts row's share is rounded to the nearest cent and the Labor row gets the rest, so the two shares always add up to the whole amount. On an exact half cent the Labor row gets the extra cent. Example: labor $100.00, parts $200.00, whole-invoice discount ($1.00): Parts ($0.67), Labor ($0.33).

## S5-R8
v8:  A whole-invoice amount on an invoice with no labor and no parts dollars goes to the labor representative. If the labor side is empty and the parts side is not, it goes to the parts representative. If both are empty, it is Unassigned.
v10: A whole-invoice amount on an invoice with no labor and no parts dollars goes to the labor representative. If the labor side is empty and the parts side is not, it goes to the parts representative. If both are empty, it is Unassigned. A side is empty when it has no representative.

## S5-R15
v8:  On a Labor row the parts columns show a dash, and on a Parts row the labor, hours and Shop Supplies columns show a dash, not $0.00. $0.00 is shown only for a real zero.
v10: On a Labor row the parts columns show a dash, and on a Parts row the labor, hours and Shop Supplies columns show a dash, not $0.00. $0.00 is shown only for a real zero. A row that holds both sides, one person on both, keeps the report's rule that an invoice with no labor shows Labor Delta 0.0.

## S5-R15a
v8:  On a Part Sales row, Shop Supplies shows the part sale's shop supplies, or a dash when it has none.
v10: On a Part Sales row, Shop Supplies shows the part sale's shop supplies, or a dash when the part sale has no shop supplies charge. $0.00 shows only when a shop supplies charge of $0.00 is on it.

## S5-R19
v8:  An invoice row carries a "Sales Type" column, after Status, reading "Labor", "Parts", "Part Sales" or "Labor, Parts".
v10: An invoice row carries a "Sales Type" column, after Status and before Location (Status, Sales Type, Location), reading "Labor", "Parts", "Part Sales" or "Labor, Parts".

## S5-R23
v8:  The Expanded CSV and the Expanded PDF always carry the Sales Type column, after Status, whatever the screen shows. In them, the cells of the side a row is not credited with are blank in the CSV and show a dash in the PDF.
v10: The Expanded CSV and the Expanded PDF always carry the Sales Type column, after Status and before Location, whatever the screen shows. In them, the cells of the side a row is not credited with are blank in the CSV and show a dash in the PDF.

## S7-R1
v8:  Each change to a work order's representatives, including adding or removing the Parts field, writes one log entry, "Sales representative changed".
v10: Each change to a work order's representatives, including adding or removing the Parts field, writes one log entry, "Sales representative changed". Adding the Parts field with the same person on both sides is a change and writes one entry, for example "Sales Representative: Ann Able → Ann Able (Parts) · Ann Able (Labor)".

## S7-R4
v8:  A change that leaves the representatives as they were writes no entry.
v10: A change that leaves the representatives as they were writes no entry. For example, picking the person already in the field.

## S8-R4
v8:  The filter line at the top of every PDF and CSV export of Sales By Representative reads the same: "Sales Type: All", or the selected names. With no option selected there is nothing to export: Export shows "Empty export" and makes no file.
v10: The filter line at the top of every PDF and CSV export of Sales By Representative reads the same: "Sales Type: All", or the selected names. With no option selected there is nothing to export: Export shows "Empty export" and makes no file. Any other export with no rows, for example a date range with no invoices, still downloads a file with the headings and no rows, as today.

## S8-R9
v8:  The filter line at the top of every PDF and CSV export of Sales By Customer reads "Sales Type: All Sales", "Sales Type: Part Sales only", or "Sales Type: Service Sales only". With no option selected, Export shows "Empty export" and makes no file.
v10: The filter line at the top of every PDF and CSV export of Sales By Customer reads "Sales Type: All Sales", "Sales Type: Part Sales only", or "Sales Type: Service Sales only". With no option selected, Export shows "Empty export" and makes no file. Any other export with no rows still downloads a file with the headings and no rows, as today.

## S8-E1
v8:  A Sales By Customer filter choice remembered from before the release opens with the same options selected, under the new names.
v10: A saved or bookmarked Sales By Customer link from before the release that carries a Product Type choice opens with the same options selected, under the new names. Report filters are kept in the page link, not saved between visits.

## S1-R6a
v8:  None
v10: A Lead Technician message shows directly below the Lead Technician field and pushes the fields under it down while it shows. With no message, the gaps are as in S1-R6.

## S1-E3
v8:  None
v10: A side whose staff member no longer exists, or belongs to another organization, reads "Unassigned" on the card, as on the printout (S6-N1). It never reads a bare "(Inactive)".

## S2-E6
v8:  None
v10: When the same work order is open in two places and one adds the Parts field while the other, still showing the one field, then picks a person, the later save wins: the work order ends with the one Sales Representative field holding the person picked last, and the Parts field is gone. Each screen shows what was saved once its save finishes.

## S7-R6
v8:  None
v10: A side whose staff member no longer exists, or belongs to another organization, reads "Unassigned" in the entry, as on the card (S1-E3).
