# CHANGES-MADE — Report Suite live observation, 2026-08-06

Everything created or altered by this pass, with the BEFORE value for anything that pre-existed.
Per the QA lead's ruling the QA branch is disposable, so nothing is torn down — but everything is recorded.

## Application data (sv8582.qa.shopview.com)

**Nothing was created, deleted or altered in the application.** No customer, work order, part,
invoice, asset, category or vendor was created; no organisation setting was written; no role was
changed or reset. Every observation used the signed-in Admin session read-only, over the report
read endpoints and the export endpoints.

The one thing written anywhere was **browser local storage inside a throwaway headless browser
context** — the report's own saved-view key `report_view:inventory-value` — used to reproduce the
defensive-restore path (a saved category that no longer exists). That context is destroyed when the
script ends and nothing persists on the server or in any real user's browser.

## TestRail (project 1, suite 1, group 4281)

| Batch | Operation | Count | Verification |
|---|---|---|---|
| 1 | `update_case` | 23 | every one HTTP 200, re-GET, 30 fields compared, 0 mismatches, 0 collateral |

0 `add_case` · 0 `delete_case` · 0 section writes · **0 run writes** · **0 results logged**.

## Jira

Five Story Defects filed, all in the Rule-52 shape (issuetype 10007 · parent = the owning story ·
priority Low · `relates to` link to the same story · no Product Area), every field read back:

| Key | Parent story | Summary |
|---|---|---|
| [SV-8925](https://shopview.atlassian.net/browse/SV-8925) | SV-8612 | SBC and SBR spreadsheets export money, percentages and dates as text |
| [SV-8926](https://shopview.atlassian.net/browse/SV-8926) | SV-8671 | Inventory Value totals row labelled "Totals" where the spec asks for "Total" |
| [SV-8927](https://shopview.atlassian.net/browse/SV-8927) | SV-8670 | Inventory Value opens with Margin and Total Sell already on |
| [SV-8928](https://shopview.atlassian.net/browse/SV-8928) | SV-8675 | Inventory Value forgets the part search text between visits |
| [SV-8929](https://shopview.atlassian.net/browse/SV-8929) | SV-8675 | Inventory Value keeps a saved category that no longer exists |

No existing ticket was edited, commented on, transitioned or re-prioritised.

## Update after batch 2

| Batch | Operation | Count | Verification |
|---|---|---|---|
| 2 | `update_case` | 36 | every one HTTP 200, re-GET, 30 fields compared, 0 mismatches, 0 collateral |

Running TestRail total: **59 `update_case`**. Still 0 add · 0 delete · 0 section · **0 run writes**
· **0 results logged**.

Three further Story Defects filed, same Rule-52 shape, every field read back:

| Key | Parent story | Summary |
|---|---|---|
| [SV-8930](https://shopview.atlassian.net/browse/SV-8930) | SV-8668 | Inventory Value shows an empty table with no message when nothing matches |
| [SV-8931](https://shopview.atlassian.net/browse/SV-8931) | SV-8674 | Inventory Value opens on All locations instead of the user's current location |
| [SV-8932](https://shopview.atlassian.net/browse/SV-8932) | SV-8679 | Inventory Value: long text never shortens, and headings announce no sort state |

Still nothing created or altered in the application.

## Update after batch 3 and the expect-fail block pass

| Batch | Operation | Count | Verification |
|---|---|---|---|
| 3 (Parts Velocity) | `update_case` | 23 | HTTP 200, 30 fields compared each, 0 mismatches |
| expect-fail blocks | `update_case` | 28 | HTTP 200, 30 fields compared each, 0 mismatches |
| C30341 repair | `update_case` | 1 | HTTP 200, 30 fields compared, 0 mismatches |

Running TestRail total: **111 `update_case`** over **99 distinct cases**. Still 0 add · 0 delete ·
0 section · **0 run writes** · **0 results logged**.

### A defect of our own, owned and repaired

**C30341 was damaged by this pass and then repaired.** That case stores its text as raw HTML
(`<ol>/<li>`, `<hr />`, `<p>AUTOMATION: READY</p>`). None of the writer's plain-text patterns
matched that form, so instead of REPLACING the provenance line and the marker it **appended a
second one of each**. The byte-check did not catch it because the write was faithful to the
payload — the payload itself was wrong.

Found by a census of all 476 cases, not by chance. Repaired in the same session: converted to
plain numbered text, one provenance line, one marker, and **not one word of meaning changed** —
the preconditions and steps were converted from the identical HTML and the expected-results
wording is word-for-word what it was. A guard now makes `rebuild()` **refuse outright** on any
case containing raw markup.

**13 raw-markup cases remain** (of the 14 in the brief; C30341 was the fourteenth and is now
plain text). They sit in Sales By Representative, Work In Progress and Technician Utilization,
which this session did not reach. They carry no plain-text `AUTOMATION:` marker because their
marker is wrapped in `<p>` tags.

## Update after batch 4 (Parts Velocity, 2026-08-06)

**Application data: still nothing created, deleted or altered.** Every observation this batch used the
signed-in Admin session read-only over the report read endpoints, the export endpoints and the report
page itself. The only writes anywhere were to **browser local storage inside a throwaway headless
context** (`report_view:parts-velocity`, written by the product itself when a filter, sort or column
selection changes, and once removed by us to force a genuine first-visit state). That context is
destroyed when the script ends; nothing persists on the server or in any real user's browser.
No role was changed, no role reset, no organisation setting written.

| Batch | Operation | Count | Verification |
|---|---|---|---|
| 4 (Parts Velocity) | `update_case` | 26 | every one HTTP 200, re-GET, 30 fields compared, 0 mismatches, 0 collateral |

Running TestRail total: **137 `update_case`** over **125 distinct cases**. Still 0 add · 0 delete ·
0 section · **0 run writes** · **0 results logged**.

Six Story Defects filed, all in the Rule-52 shape (issuetype 10007 · parent = the owning story ·
priority Low · `relates to` link to the same story · no Product Area), every field read back —
11 checks each, all PASS:

| Key | Parent story | Summary |
|---|---|---|
| [SV-8934](https://shopview.atlassian.net/browse/SV-8934) | SV-8646 | Parts Velocity PDF prints Description, Category and Vendor in full instead of shortening them to 18 characters |
| [SV-8935](https://shopview.atlassian.net/browse/SV-8935) | SV-8646 | Parts Velocity spreadsheet prints Last Sale as the words "54 days" instead of a plain number |
| [SV-8936](https://shopview.atlassian.net/browse/SV-8936) | SV-8646 | Parts Velocity download success message is a general one and does not name the report or the file type |
| [SV-8937](https://shopview.atlassian.net/browse/SV-8937) | SV-8646 | Parts Velocity PDF heading shows an end date one day later than the range asked for, and is labelled "Start Date Range" |
| [SV-8938](https://shopview.atlassian.net/browse/SV-8938) | SV-8643 | Parts Velocity Location column sits sixth, after Vendor, instead of first before Type |
| [SV-8939](https://shopview.atlassian.net/browse/SV-8939) | SV-8642 | Parts Velocity opens on All locations instead of the location the user is working in |

No existing ticket was edited, commented on, transitioned or re-prioritised.

## Update after batch 5 (Parts Velocity finished, 2026-08-06)

**Application data: still nothing created, deleted or altered.** Read-only throughout, plus the
product's own `report_view:parts-velocity` local-storage key inside a throwaway headless context.

| Batch | Operation | Count | Verification |
|---|---|---|---|
| 5 (Parts Velocity tail) | `update_case` | 3 | every one HTTP 200, re-GET, 30 fields compared, 0 mismatches, 0 collateral |

Running TestRail total: **140 `update_case`** over **128 distinct cases**. Still 0 add · 0 delete ·
0 section · **0 run writes** · **0 results logged**.

One further Story Defect filed, same Rule-52 shape, every field read back:

| Key | Parent story | Summary |
|---|---|---|
| [SV-8940](https://shopview.atlassian.net/browse/SV-8940) | SV-8643 | Parts Velocity never shortens long Description, Category or Vendor text, so the table runs far wider than the window |

## Update after batch 6 (Work In Progress export, 2026-08-06)

**Application data: still nothing created, deleted or altered.** Read-only throughout.

| Batch | Operation | Count | Verification |
|---|---|---|---|
| 6 (WIP export) | `update_case` | 8 | every one HTTP 200, re-GET, 30 fields compared, 0 mismatches, 0 collateral |

Running TestRail total: **148 `update_case`** over **136 distinct cases**. Still 0 add · 0 delete ·
0 section · **0 run writes** · **0 results logged**. **No further ticket filed** — SV-8907 already
covers the export failure, so the finding went into the cases, not into Jira.

## Update after batch 7 (Technician Utilization, 2026-08-06)

**Application data: nothing created, deleted or altered.** Every observation this batch used the
signed-in Admin session read-only — the report read endpoints, the per-day breakdown endpoint, the
export endpoints, the Timesheet Activities read endpoint and the report page itself. No customer,
work order, clock record, part, invoice, asset or organisation setting was written; no role was
changed or reset; nobody was clocked in or out.

The only writes anywhere were to **browser local storage inside a throwaway headless context**:
the product's own saved-view key `report_view:technician-utilization`, which the product itself
writes whenever a filter, sort or column selection changes, and which was removed twice by us to
force a genuine first-visit state, and once had a `locations` key added to it in an attempt to test
the defensive-restore path (the attempt failed — the real key is `locationIds` — so nothing was
proven by it). That context is destroyed when the script ends; nothing persists on the server or in
any real user's browser.

| Batch | Operation | Count | Verification |
|---|---|---|---|
| 7 (Technician Utilization) | `update_case` | 57 | every one HTTP 200, re-GET, 30 fields compared, 0 mismatches, 0 collateral |

Running TestRail total: **205 `update_case`** over **193 distinct cases**. Still 0 add · 0 delete ·
0 section · **0 run writes** · **0 results logged**.

Twelve Story Defects filed, all in the Rule-52 shape (issuetype 10007 · parent = the owning story ·
priority Low · `relates to` link to the same story · no Product Area), every field read back —
**11 checks each, all PASS**:

| Key | Parent story | Summary |
|---|---|---|
| [SV-8943](https://shopview.atlassian.net/browse/SV-8943) | SV-8648 | Technician Utilization opens on All locations instead of the location the user is working in |
| [SV-8944](https://shopview.atlassian.net/browse/SV-8944) | SV-8648 | Technician Utilization total hours do not match Timesheet Activities for the same technician, range and location |
| [SV-8945](https://shopview.atlassian.net/browse/SV-8945) | SV-8649 | Sorting a Technician Utilization column reloads the report from the server instead of reordering the rows on screen |
| [SV-8946](https://shopview.atlassian.net/browse/SV-8946) | SV-8652 | The Technician Utilization technician filter reloads the report from the server instead of hiding rows on screen |
| [SV-8947](https://shopview.atlassian.net/browse/SV-8947) | SV-8652 | Technician Utilization technician filter and its select-all control are labelled differently from the specification |
| [SV-8948](https://shopview.atlassian.net/browse/SV-8948) | SV-8654 | Technician Utilization downloads ignore the technician filter and include everybody |
| [SV-8949](https://shopview.atlassian.net/browse/SV-8949) | SV-8654 | Technician Utilization downloads are not ordered by technician name A to Z |
| [SV-8950](https://shopview.atlassian.net/browse/SV-8950) | SV-8654 | Technician Utilization downloads leave out the Summary row |
| [SV-8951](https://shopview.atlassian.net/browse/SV-8951) | SV-8654 | The Technician Utilization Expanded spreadsheet contains per-day rows and the file names differ from the specification |
| [SV-8952](https://shopview.atlassian.net/browse/SV-8952) | SV-8654 | Technician Utilization download messages: the success wording is generic and a failed download says nothing at all |
| [SV-8953](https://shopview.atlassian.net/browse/SV-8953) | SV-8655 | Technician Utilization expand and collapse controls do not tell assistive technology whether a row is open |
| [SV-8954](https://shopview.atlassian.net/browse/SV-8954) | SV-8656 | The Technician Utilization Location column disappears when one location is chosen, and cannot be turned on again |

No existing ticket was edited, commented on, transitioned or re-prioritised — including
**SV-8937**, whose stated scope this batch showed to be too narrow, and **SV-8818**, which already
covers the Expanded PDF failure.

## Update after batch 8 (Sales By Customer, part 1, 2026-08-06)

**Application data: nothing created, deleted or altered.** Read-only throughout — the report read
endpoint, the two drill-down endpoints, the export endpoint and the report page itself, plus one
navigation into a work order's finance tab and straight back out. The only writes anywhere were the
product's own `report_view:sales-by-customer` local-storage key inside a throwaway headless context,
which was also removed once to force a genuine first-visit state.

| Batch | Operation | Count | Verification |
|---|---|---|---|
| 8 (Sales By Customer part 1) | `update_case` | 25 | every one HTTP 200, re-GET, 30 fields compared, 0 mismatches, 0 collateral |

Running TestRail total: **230 `update_case`** over **218 distinct cases**. Still 0 add · 0 delete ·
0 section · **0 run writes** · **0 results logged**.

Two Story Defects filed, same Rule-52 shape, every field read back — 11 checks each, all PASS:

| Key | Parent story | Summary |
|---|---|---|
| [SV-8955](https://shopview.atlassian.net/browse/SV-8955) | SV-8601 | Sales By Customer never puts the date range or Product Type in the page link, so the report cannot be shared |
| [SV-8956](https://shopview.atlassian.net/browse/SV-8956) | SV-8612 | Sales By Customer download file names leave out the date range |

No existing ticket was edited, commented on, transitioned or re-prioritised.

## Update after the QA lead's three decisions (2026-08-06)

**Application data: nothing created, deleted or altered.** No application screen was opened for this
pass — it was TestRail and Jira only.

| Operation | Count | Verification |
|---|---|---|
| `update_case` (C38918 marker, C30102 title) | 3 | every one HTTP 200, re-GET, 30 fields compared, 0 mismatches, 0 collateral |
| Jira `PUT` on SV-8937 (summary + description) | 1 | HTTP 204, 16 field checks read back, all PASS |
| Jira `issueLink` on SV-8937 | 2 | HTTP 201 each; `relates to` SV-8654 and SV-8613 |

Running TestRail total: **233 `update_case`** over **220 distinct cases**. Still 0 add · 0 delete ·
0 section · **0 run writes** · **0 results logged**.

**SV-8937 is the ONLY already-filed ticket edited**, and only because the QA lead asked for it to be
widened and given the new source block in the same pass. **No other existing ticket was edited,
commented on, transitioned or re-prioritised** — he is retrofitting the rest himself, in one pass, to
avoid a collision.

---

## SESSION 4 — 2026-08-06 — changes made to the QA branch

**One work order was created and left in place.** These branches are deleted when the feature reaches
staging, so **no teardown is required** — but it is recorded here rather than glossed.

| What | Detail |
|---|---|
| Work order created | `e40c1c15-63ba-4202-9cc9-358da3d5fe21`, customer **Iibay Landscaping**, vehicle `00052898-8ce9-4bf4-b0be-c3644db57f29` (2020 Ford Transit, VIN `86J8FAC1VALJ43SJY`), workplace **Staging Heavy Duty - 9919**, start date 2026-08-06, `is_vehicle_here: true`. Created via `POST /api/work-orders/create` → HTTP 201 |
| Lines added to it | **None.** The New Line dialog was opened and filled but Save & Close fired no request, and the session was lost before the required field could be identified. **The work order has zero lines**, so it contributes $0.00 to every Work In Progress figure and sits in the Estimates tab |
| Named `ZZAUTOTEST`? | **No — and that is a miss.** The line description was to be `ZZAUTOTEST labour 4h est 1h clocked`, but the line was never saved, and the work order itself carries no marker because the create endpoint takes no description. **It is identified by its id above.** |
| Dark mode | Switched to **Dark** through the profile menu and **switched back to Light**, verified: `localStorage.mode` reads `"light"` and the body class is `body--light` |
| Column selection / date range / filters | Changed repeatedly during the pass. These are **per-browser** settings held in `report_view:wip` in the throwaway browser profile, not server state, so nothing persisted for anyone else |
| Roles, staff, settings, deactivations | **None. Nothing else was created, changed or deleted.** |

**No impersonation.** `POST /api/switch-user` and `POST /api/quick-login {"key":"tech"}` were **never
called** — both are proven to 403 on this branch and a failed attempt rotates the shared session that the
Filters and Schedule workers depend on. One `quick-login {"key":"admin"}` **was** attempted, once, as the
documented 401 recovery; it returned **HTTP 401 itself**, so it changed nothing.

---

## SESSION 5 — 2026-08-06

### TestRail — 16 `update_case`, no other operation of any kind

**16 ops over 16 distinct cases, every one HTTP 200, 30 fields compared each, 0 mismatches, 0 collateral
changes**, all three text fields on every payload. **0 `add_case` · 0 `delete_case` · 0 section ops ·
0 run writes · 0 results logged. `refs` not written on any operation.**

Batch 1 (WIP, 8): C30456 · C30464 · C30475 · C30476 · C30477 · C30478 · C30480 · C38890.
Batch 2 (SBR Inv. Hrs, 4): C30229 · C30230 · C30231 · C38894.
Batch 3 (SBR rows/tree/sort/badges, 4): C30218 · C30221 · C30242 · C30227.

**Post-write census run separately on each batch** (a byte-check proves the write matched the payload, not
that the payload was right — the lesson C30341 taught this pass): exactly one provenance line, exactly one
build sentence naming `v3.5-f77875c` on 8/6/2026, exactly one marker, marker last, 0 raw markup, 0 barred
phrases, and on the 5 expect-fail cases exactly one symptom block containing all three outcomes.

### Run 359 — PROVEN UNTOUCHED, by content

`include_all` still **false** · **476 tests** · case_id sets **equal in both directions** with our 476 ·
**535 result records** — the same 535 sessions 1 and 2 recorded today · counters unchanged at
**6 passed / 470 untested** · **0 results created during this session's window** (the newest result on the
run dates from 5 August 12:42:21Z).

**Reported honestly rather than hidden:** a 4 August snapshot at `/tmp/testrail/run359-resultids-START.json`
holds **539** result ids, so **10 of those are no longer present and 6 have been added since**. That delta
is **historical and not ours** — sessions 1 and 2 already recorded 535 this morning, before this session
began, and the run belongs to Nebojsa and Viktoria who grade it. It is recorded because comparing against
the wrong baseline and saying nothing would have been the worse choice.

### Jira — 2 issues created, 1 existing issue edited (description only)

- **[SV-8999](https://shopview.atlassian.net/browse/SV-8999)** created — Inv. Hrs zero on SBR and SBC.
- **[SV-9001](https://shopview.atlassian.net/browse/SV-9001)** created — SBR summary rows merge the four
  leading columns. **16 field checks read back, all PASS.**
- **[SV-8818](https://shopview.atlassian.net/browse/SV-8818)** — the owed screenshot attached and inlined.
  **Description only.** 5 attachments before, 6 after, **0 lost**; `summary`, `status`, `priority`,
  `issuetype`, `parent` all byte-identical.
- **0 edits to anyone else's ticket.**

### The application — what was created, and what was left behind

Everything is tagged or named so it is identifiable, and **nothing was torn down**, because the branch is
disposable and the QA lead's standing instruction is to seed rather than block.

**On WO `e40c1c15-63ba-4202-9cc9-358da3d5fe21` (S8582-16263, Iibay Landscaping, Staging Heavy Duty - 9919):**
- an **approved** canned line *Replace - Drive axle brakes (Drum)* (180 min, HD Fleet Rate, $449.85);
- a second, **unapproved** canned line *Replace - Suspension air bag* (90 min, $224.93) — created as the
  control for C30480 and **deliberately left in place**, since it is the precondition that case needs;
- a labour task assigned to a technician, and **a clock record that is STILL RUNNING**. Left open on
  purpose: it is exactly the state C38890 needs, and once it passes three hours somebody can read the
  per-line cap straight off the report without any seeding at all;
- the work order was moved to **Approved**, a contact (Christine Hill) and mileage `123456` were set, and a
  sales rep was assigned.

**A second work order was created and invoiced: `1bd4c3f0-338e-4357-8764-7dfcfb963767` (S-16265).** Zero-parts
canned line *Service - 5th wheel adjustment* (45 min, $112.46), contact set, mileage `222222`, tech story
`ZZAUTOTEST 5th wheel adjusted`, sales rep **Parth Fadadu**, line completed, work order completed, invoice
`ae148b0e-edd9-4d20-8f06-78366743c20d` created. **This is the invoice that proved the Inv. Hrs defect** —
known billed hours, correct money, zero hours.

**Three failed removal attempts are recorded so nobody repeats them:** the part-request delete endpoint was
not found (`work-orders/parts/delete` answers `400 {"part_id":"Not found"}` for a part *request* id), and
`work-orders/lines/delete-lines` wants `lines`, not `line_ids`, and then returns **500** — which is why the
unapproved line is still there and why a fresh zero-parts work order was used for the invoicing chain
instead of clearing this one.

**Settings and roles: nothing changed.** No role was created, edited or reset; `quick-login` and
`switch-user` were **never called**, deliberately, because a sibling worker shares the session token.

### API facts worth keeping (flagged for the playbook, NOT edited from here)

`build/APP-ACTIONS-PLAYBOOK.md` §Q belongs to another worker's pass, so these are flagged rather than written:

1. **§Q IS WRONG ON ONE POINT: `tech_time` is NOT the clocked time.** It says *"`input_tech_time` is the
   clocked time"*. A canned line arrived with `tech_time: 120` and the report still read
   `worked_hours: 0` / `labor_earned: 0`. The reports read **clock records** (`total_clocked_time`).
2. **§Q's "Save & Close fired no request … at least one more field is required" is a dead end worth
   abandoning.** Picking a canned line **collapses the dialog to Title + Line Approved + Save**, and
   `POST /api/work-orders/{woId}/lines/create-from-canned-line`
   `{another, canned_line_id, work_order_id, status}` returns **201**. No unknown field is involved.
3. **`POST /api/work-orders/change-status` takes `id`, NOT `work_order_id`** (`work_order_id` → 400
   *"Work Order ID is missing"*; `{id}` alone → 500; `{id, status}` → 201).
4. **The staff list has TWO ids and the task endpoints want the second one.** `GET /api/staff` returns both
   `id` and `staff_id`; `POST /api/work-orders/tasks/create` answers `400 {"staff_id":"Not found"}` for the
   `id` and **201** for the `staff_id`.
5. **Clock in: `POST /api/technician-tasks/check-in {task_id, line_id, work_order_id, refresh_lines:true}`
   → 201.** Clock **out** was not solved — `check-out` answers
   `400 {"error":"Task not found for the given technician ID."}` for every id tried (task id, the returned
   record id, with and without the work order), and a second check-in elsewhere then fails with
   *"You are already clocked into different line."*
6. **`POST /api/work-orders/lines/change` is camelCase** (`lineName`, `timeEstimate`, `labourTypeId`);
   snake_case returns *"Line name is missing"*. The **labour-price key is still unknown** — every candidate
   returns `400 {"error":"Labor or fixed prices must be set."}`.
7. **The work-order list response key is `data.work_orders`, not `data.collection`** — and reading it as
   `collection` returns an empty list with HTTP 200, which silently reads as "no work orders exist".
8. **WIP received-vs-outstanding parts live in two different arrays on a line:** `parts[]` holds what
   arrived (it carries `arrived_date` / `delivery_id`), `part_requests[]` what is outstanding. **Parts
   Earned includes the core charge**; omitting it is what made our first formula miss by $149.50.
