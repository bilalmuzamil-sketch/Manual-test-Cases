# WO Board & Tech View — regression cases, 8 October 2026

QA lead: *"See if that warrants new test cases, if yes then create a separate folder for those test cases."* Sources: the developer's ranked regression list and his QA handoff test plan (both 8 Oct, `sources/dev-regression-2026-10-08/`).

**Folder:** [Regression — other areas touched by this release (SV-10043)](https://shopview.testrail.io/index.php?/suites/view/1&group_id=47109) (section 47109) with High 47110 · Medium 47111 · Low 47112. **83 new cases**, 83/83 read back, all in run [498](https://shopview.testrail.io/index.php?/runs/view/498) (now 253 tests). Priority set by tier (High / Medium / Low). Already-covered items, not-manual items and safe-to-skip areas: `REGRESSION-SCOPE-2026-10-08.md`.

| Tier | Case | Title |
|---|---|---|
| High | [C368165](https://shopview.testrail.io/index.php?/cases/view/368165) | Lead Technician cannot be changed on a Paid work order's page |
| High | [C368166](https://shopview.testrail.io/index.php?/cases/view/368166) | Changing Lead Technician on the work order page shows the new lead |
| High | [C368167](https://shopview.testrail.io/index.php?/cases/view/368167) | A refused lead change on the work order page shows an error, keeps the old lead |
| High | [C368168](https://shopview.testrail.io/index.php?/cases/view/368168) | Changing the lead on the work order page moves the lines that followed it |
| High | [C368169](https://shopview.testrail.io/index.php?/cases/view/368169) | Edit Work Order saves a new lead and a new mileage together |
| High | [C368170](https://shopview.testrail.io/index.php?/cases/view/368170) | A refused lead change in Edit Work Order saves none of the other edits |
| High | [C368171](https://shopview.testrail.io/index.php?/cases/view/368171) | A lead change in Edit Work Order adds one Lead tech changed entry |
| High | [C368172](https://shopview.testrail.io/index.php?/cases/view/368172) | A new line created with a technician keeps that technician |
| High | [C368173](https://shopview.testrail.io/index.php?/cases/view/368173) | Changing a line's technician in Edit Line saves the new technician |
| High | [C368174](https://shopview.testrail.io/index.php?/cases/view/368174) | Assigning a technician to lines from the Lines tab still works |
| High | [C368175](https://shopview.testrail.io/index.php?/cases/view/368175) | Line technician lists offer no staff from another organization |
| High | [C368176](https://shopview.testrail.io/index.php?/cases/view/368176) | Clocking in on an unassigned line gives the line to that technician |
| High | [C368177](https://shopview.testrail.io/index.php?/cases/view/368177) | Moving labor to another line gives that line the technician |
| High | [C368178](https://shopview.testrail.io/index.php?/cases/view/368178) | Dragging a work order onto the Schedule as Entire work order makes a shift |
| High | [C368179](https://shopview.testrail.io/index.php?/cases/view/368179) | Dragging a work order onto the Schedule with Choose lines makes a line shift |
| High | [C368180](https://shopview.testrail.io/index.php?/cases/view/368180) | An asset's Work Orders tab lists exactly its own work orders |
| High | [C368181](https://shopview.testrail.io/index.php?/cases/view/368181) | An asset's Work Orders tab count matches its rows |
| High | [C368182](https://shopview.testrail.io/index.php?/cases/view/368182) | An asset's Work Orders tab shows the same progress as the List |
| High | [C368183](https://shopview.testrail.io/index.php?/cases/view/368183) | An asset's Work Orders tab sorts by a column header |
| High | [C368184](https://shopview.testrail.io/index.php?/cases/view/368184) | A customer's Work Orders tab lists exactly its own work orders |
| High | [C368185](https://shopview.testrail.io/index.php?/cases/view/368185) | A customer's Work Orders tab count matches its rows |
| High | [C368186](https://shopview.testrail.io/index.php?/cases/view/368186) | A customer's Work Orders tab shows the same progress as the List |
| High | [C368187](https://shopview.testrail.io/index.php?/cases/view/368187) | A customer's Work Orders tab sorts by a column header |
| High | [C368188](https://shopview.testrail.io/index.php?/cases/view/368188) | The asset tab's Asset on Site toggle keeps the lead technician |
| High | [C368189](https://shopview.testrail.io/index.php?/cases/view/368189) | The asset tab's toggle on an old page does not undo a new lead |
| High | [C368190](https://shopview.testrail.io/index.php?/cases/view/368190) | Removing a line's only shift puts its Labor row back to Unassigned |
| High | [C368191](https://shopview.testrail.io/index.php?/cases/view/368191) | A line with labor by a deleted staff member still reads Deleted user |
| High | [C368192](https://shopview.testrail.io/index.php?/cases/view/368192) | At phone width an expanded line shows its scheduled technicians |
| High | [C368193](https://shopview.testrail.io/index.php?/cases/view/368193) | Changing tab in the List clears the search box |
| High | [C368194](https://shopview.testrail.io/index.php?/cases/view/368194) | A column turned on in List Column Selection stays after a reload |
| High | [C368195](https://shopview.testrail.io/index.php?/cases/view/368195) | A new user's List hides the five optional columns by default |
| High | [C368196](https://shopview.testrail.io/index.php?/cases/view/368196) | Clicking a sortable List header orders the rows |
| High | [C368197](https://shopview.testrail.io/index.php?/cases/view/368197) | Paging the List shows no repeated or missing work orders |
| High | [C368198](https://shopview.testrail.io/index.php?/cases/view/368198) | With only Invoiced ticked on All, the List sorts newest invoice first |
| High | [C368199](https://shopview.testrail.io/index.php?/cases/view/368199) | Switching List tabs quickly shows only the last tab's work orders |
| High | [C368200](https://shopview.testrail.io/index.php?/cases/view/368200) | Clicking a row's Asset on Site toggle does not open the work order |
| High | [C368201](https://shopview.testrail.io/index.php?/cases/view/368201) | After a status change, Back shows the new status in the List |
| High | [C368202](https://shopview.testrail.io/index.php?/cases/view/368202) | A work order made with Create Work Order shows in the List at once |
| High | [C368203](https://shopview.testrail.io/index.php?/cases/view/368203) | A link with Estimates and Assigned to me opens with both applied |
| High | [C368204](https://shopview.testrail.io/index.php?/cases/view/368204) | Opening Work Orders after a link shows your saved view |
| High | [C368205](https://shopview.testrail.io/index.php?/cases/view/368205) | A link with an unknown Asset on Site value is ignored |
| High | [C368206](https://shopview.testrail.io/index.php?/cases/view/368206) | Without See Financial Data the List has no Total price column or total |
| High | [C368207](https://shopview.testrail.io/index.php?/cases/view/368207) | A view-only user sees no Create Work Order button in the List |
| High | [C368208](https://shopview.testrail.io/index.php?/cases/view/368208) | A view-only user cannot change a row's Asset on Site toggle |
| High | [C368209](https://shopview.testrail.io/index.php?/cases/view/368209) | On a phone the List sort choice stays after a reload |
| High | [C368210](https://shopview.testrail.io/index.php?/cases/view/368210) | On a phone the next page of cards loads only when you scroll |
| High | [C368211](https://shopview.testrail.io/index.php?/cases/view/368211) | On a phone a no-match search shows the empty state with Clear filters |
| High | [C368212](https://shopview.testrail.io/index.php?/cases/view/368212) | The List at one location shows no work orders from another location |
| High | [C368213](https://shopview.testrail.io/index.php?/cases/view/368213) | The List's Parts and Returns counts match the work order |
| High | [C368214](https://shopview.testrail.io/index.php?/cases/view/368214) | After Back and Forward the List keeps its tab, search and filters |
| Medium | [C368215](https://shopview.testrail.io/index.php?/cases/view/368215) | A part sale's status card shows in full |
| Medium | [C368216](https://shopview.testrail.io/index.php?/cases/view/368216) | Changing the person on a part sale's status card saves |
| Medium | [C368217](https://shopview.testrail.io/index.php?/cases/view/368217) | The Part Sales list shows the right part request and return counts |
| Medium | [C368218](https://shopview.testrail.io/index.php?/cases/view/368218) | Purchase Orders keeps a chosen filter after a reload |
| Medium | [C368219](https://shopview.testrail.io/index.php?/cases/view/368219) | Vendors keeps a chosen filter after a reload |
| Medium | [C368220](https://shopview.testrail.io/index.php?/cases/view/368220) | Return requests keeps a chosen filter after a reload |
| Medium | [C368221](https://shopview.testrail.io/index.php?/cases/view/368221) | Return credits keeps a chosen filter after a reload |
| Medium | [C368222](https://shopview.testrail.io/index.php?/cases/view/368222) | Part Sales keeps a chosen filter after a reload |
| Medium | [C368223](https://shopview.testrail.io/index.php?/cases/view/368223) | Deliveries keeps a chosen filter after a reload |
| Medium | [C368224](https://shopview.testrail.io/index.php?/cases/view/368224) | Catalog keeps a chosen filter after a reload |
| Medium | [C368225](https://shopview.testrail.io/index.php?/cases/view/368225) | Inventory keeps a chosen filter after a reload |
| Medium | [C368226](https://shopview.testrail.io/index.php?/cases/view/368226) | The Work In Progress report keeps a chosen filter after a reload |
| Medium | [C368227](https://shopview.testrail.io/index.php?/cases/view/368227) | The Sales By Customer report keeps a chosen filter after a reload |
| Medium | [C368228](https://shopview.testrail.io/index.php?/cases/view/368228) | The Parts Velocity report keeps a chosen filter after a reload |
| Medium | [C368229](https://shopview.testrail.io/index.php?/cases/view/368229) | The Inventory Value report keeps a chosen filter after a reload |
| Medium | [C368230](https://shopview.testrail.io/index.php?/cases/view/368230) | The Technician Utilization report keeps a chosen filter after a reload |
| Medium | [C368231](https://shopview.testrail.io/index.php?/cases/view/368231) | The Sales By Representative report keeps a chosen filter after a reload |
| Medium | [C368232](https://shopview.testrail.io/index.php?/cases/view/368232) | The Work In Progress Location filter ticks, selects all and clears |
| Medium | [C368233](https://shopview.testrail.io/index.php?/cases/view/368233) | The Sales By Customer Customer filter ticks, selects all and clears |
| Medium | [C368234](https://shopview.testrail.io/index.php?/cases/view/368234) | The Parts Velocity Vendor filter ticks, selects all and clears |
| Medium | [C368235](https://shopview.testrail.io/index.php?/cases/view/368235) | The Inventory Value Category filter ticks, selects all and clears |
| Medium | [C368236](https://shopview.testrail.io/index.php?/cases/view/368236) | The Technician Utilization Technician filter ticks, selects all and clears |
| Medium | [C368237](https://shopview.testrail.io/index.php?/cases/view/368237) | The Sales By Representative Location filter ticks, selects all and clears |
| Medium | [C368238](https://shopview.testrail.io/index.php?/cases/view/368238) | Starting impersonation while a page loads shows the new user's data |
| Medium | [C368239](https://shopview.testrail.io/index.php?/cases/view/368239) | Exiting impersonation while a page loads shows your own data |
| Medium | [C368240](https://shopview.testrail.io/index.php?/cases/view/368240) | An ended session shows the sign-in page without error messages |
| Medium | [C368241](https://shopview.testrail.io/index.php?/cases/view/368241) | A new photo shows in the top bar after a reload |
| Medium | [C368242](https://shopview.testrail.io/index.php?/cases/view/368242) | A new photo shows in the Staff list after a reload |
| Medium | [C368243](https://shopview.testrail.io/index.php?/cases/view/368243) | A new photo shows in the Schedule after a reload |
| Medium | [C368244](https://shopview.testrail.io/index.php?/cases/view/368244) | A new photo shows in Board View after a reload |
| Low | [C368245](https://shopview.testrail.io/index.php?/cases/view/368245) | The Customers table lists, sorts and pages as before |
| Low | [C368246](https://shopview.testrail.io/index.php?/cases/view/368246) | Dashboard cards that show a table list their rows as before |
| Low | [C368247](https://shopview.testrail.io/index.php?/cases/view/368247) | An imported work order's lead technician cannot be changed |

## Navigation to confirm on the build, and notes (from the drafting pass, verbatim)

- Navigation to confirm on the build (not found in our repo; written in plain words): the Edit Work Order window and how it opens, and its Mileage / Engine Hours / PO field names; the Lines tab's assign-technician action; the Technicians field on New Line; the Labor row More actions > Move labor (design label from the Add Part design); the Work Orders tab label on an asset page and whether its count sits on the tab or under the table; the impersonation control (start and exit) under Settings > Staff; where a profile photo is uploaded (staff record or own profile); the part sale status card's person field (developer says technician, PRD of Part Sales says Sales Representative); how the Part Sales list shows part request and part return counts; the Deliveries page's filter buttons; whether Vendors has a filter bar on this build (the Filters suite recorded none earlier); the report select-all and clear labels (Technician Utilization read "All technicians" / "Clear all" on an earlier build); the List rows-per-page control; Dashboard cards that contain a table.
- Label choice: "Create Work Order" is used (the handoff and the Filters playbook record it as the build label; some feature cases say "New Work Order").
- Source difference: the QA handoff §8 says a line goes back to "No technicians assigned to this line."; the PRD S7-R10 (edited 7 Oct 2026) says it reads "Unassigned". The case follows the PRD. PO question if the build shows the handoff wording.
- Source difference: the QA handoff lists "The Schedule page itself" under What is NOT Impacted, while the developer's reply ranks the Schedule as High 3. The developer's list is the scope, so the two drag-to-create cases are kept.
- Not manual (developer/automated only): every API check in handoff §9 (status codes, response fields, ETag/304, cache headers), the schema checks in §10, cancelled requests in the network log, the one-request-per-work-order and offline/history-mode checks in §8, and the server refusal of foreign staff ids. The human-visible part of each is in a case where one exists.
- Safe to skip (developer): invoicing, payments, accounting and QuickBooks. No case written. Invoicing is used only as a setup step to reach Invoiced or Paid.
