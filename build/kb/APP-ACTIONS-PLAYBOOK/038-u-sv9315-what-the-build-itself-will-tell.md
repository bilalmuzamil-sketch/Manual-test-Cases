## §U · sv9315 — WHAT THE BUILD ITSELF WILL TELL YOU, IF YOU ASK THE RIGHT LIST (measured 2026-09-01)

**WHY THIS SECTION EXISTS.** Three "the data state does not exist here" conclusions on suites 6597 and
6617 were WRONG, and all three had the same shape: **a conclusion drawn from the wrong list.** §S was
the first (`/api/inventory/parts` ignoring the paging parameters, so 100 of 6,879 parts were read).
These are the rest, with the endpoint that answers each question directly.

| Question | Ask this, not the data | Answer on sv9315, 2026-09-01 |
|---|---|---|
| Which work order statuses exist? | `GET /api/work-orders/statuses` | `estimate, approved, in_progress, ready_for_review, complete, invoiced, paid` — **seven, and NEITHER "Declined" NOR "Imported" is one of them.** A case naming those names statuses the product does not have |
| Which line statuses exist? | `GET /api/work-orders/line-statuses` | `authorization_required, authorization_declined, authorized, complete` — **there is no "Cancelled"**, and posting it against a REAL line id answers 400 with the status field alone rejected |
| Are there catalogue parts in no bin? | `GET /api/parts-catalogue/catalogue-parts-that-are-not-on-location` | **19,496 of them.** `/api/inventory/parts` holds only STOCKED parts, so it can never answer this |
| Does a catalogue part carry a price? | `GET /api/parts-catalogue/catalogue-parts?search=<number>` | The record has **no cost and no sell-price field at all** (e.g. F40010212 "Slack Adjuster"). "Every part holds 0.00" was a statement about inventory rows, not catalogue parts |
| Can a work order exist with no customer / no vehicle? | Press Save on the **New Work Order** dialog with the field empty | **"Customer is a required field"** and **"Asset is a required field"** — no request is even sent. Neither state can exist |
| Where is the work order detail? | `GET /api/work-orders/view/<id>` → `data.work_order` | `GET /api/work-orders/<id>` is **404**. Status comes back capitalised (`"Estimate"`), so compare case-insensitively |
| Where are its lines? | `GET /api/work-orders/lines/<id>` → `data.collection`; the id field is **`line_id`**, not `id` | 3 lines on S9315-14846 |

**LINE STATUS IS A WALK, NOT A JUMP.** `POST /api/work-orders/lines/change-status {line_id, status,
workOrderId}` from `authorization_required` straight to `complete` answers **400 "Status transition from
authorization_required to complete is not allowed"** — go via `authorized`. And **a line with
unfulfilled part requests cannot be completed at all**: *"Line can`t be completed with unfulfilled part
requests."* Pick a part-free line. Walk it back the same way afterwards and verify.

**SIDE EFFECT WORTH KNOWING:** completing a line moves the WORK ORDER to **Review** on screen. Reverting
the line reverts the work order — no separate repair needed, but do not read the header mid-probe and
report a status drift.

**TECH STORY:** `POST /api/work-orders/lines/change-story {line_id, tech_story, work_order_id}` → 201.
**`/lines/change` returns 500** — do not use it.

**A ROLE PERMISSION CAN REFUSE TO COME OFF, AND ANSWER 200 WHILE DOING IT.** `PUT /api/roles/{id}` with
`workOrdersView` removed returns **200** and the role reads back **with it still on** — the work-order
line-edit and pick-parts permissions depend on it. Remove the whole dependent group
(`workOrdersView`, `workOrderLinesCreateAndEdit`, `woPickParts`) and it takes. **⇒ After ANY role write,
re-read the role. A 200 is not evidence the change landed.**

**THE ROLE EDIT SCREEN IS DANGEROUS TO A KEYBOARD SWEEP.** The Technician role drifted from Tech View to
Full View during this pass, and the likeliest cause is a stray Enter on the "View mode" radio while a
probe was tabbing through `/administration/roles-permissions/<id>/edit` — the same sweep that clocked the
Admin into a work order (§T). **Snapshot any shared role to disk BEFORE opening its edit screen**, not
just before writing to it.


