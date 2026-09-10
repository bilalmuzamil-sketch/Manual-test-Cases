# SV-9498 — "Unable to Cancel/Delete Manual Returns – Failed to Cancel Manual Return"

**QA verdict: PASSED.** The reported failure is fixed, the product decision Chris Ward ruled on is
implemented on both the screen and the server, and nothing else in the returns flow moved.

Ticket: [SV-9498](https://shopview.atlassian.net/browse/SV-9498) · Bug · TESTING QA · priority Medium ·
assignee Dipesh Changawala · reporter Ryan Fyfe (via ShopView PowerTools, submitter Mike Freeman).
Customer: **Jeromy Penner, E2 Trucking Inc.** (5 users, via Intercom) — *"there are 3 i am trying to
clean up/delete the returns. they were all manual entry returns."*

## What the ticket asked for, and who decided what

| Source | What it says |
|---|---|
| Description (Steps to Reproduce) | Open the Returns section, find a return with status **Manual**, use the three-dot menu, cancel/delete it → *"Failed to cancel manual return. Please try again later – Cancel return Error"* plus a general error with a request ID; the return stays in the list. |
| Description (Dev Team Question) | *"If manual returns cannot be deleted through the UI in this situation, is there another way we can remove these entries for the customer?"* |
| Dipesh Changawala, 28 Aug 09:33 (root cause) | *"the inventory part each of these returns was created against has since been deleted. Cancelling a manual return puts the stock back, and with the part gone there's nothing to put it back into — so the cancel fails every time."* Then a question with two options: **No** — parts stay deletable, allow the cancel with no stock change; **Yes** — the user is told to deal with the return or credit first. |
| **Chris Ward, 28 Aug 10:58 (the ruling)** | *"I'd say yes, lets have them properly in and out with return/credit before deleting."* → **Option "Yes"**. |
| Dipesh, 10 Sep 06:04 | QA env created. **No test plan or QA handoff was provided**, so this pass was written from the description and the ruling. |

**Standing Rule 78 note — the build implements BOTH options, and that matters.** Chris ruled for the
guard (option "Yes"), and the guard is there. But the build **also** makes the cancel itself tolerant of
a missing part, which is option "No" — and that is the half that actually clears the customer's three
stuck returns. It is more than the ruling asked for, it is the right call, and it is stated here in the
open so nobody has to discover it later.

## Environments and build markers (read live, at the start and again before writing up)

| Environment | app-version | index.html last-modified |
|---|---|---|
| **Fix branch** `sv9498.qa.shopview.com` | **v26.36.2-13b91e9** | Thu, 10 Sep 2026 11:00:34 GMT |
| Staging (pre-fix reference) `app.staging.shopview.com` | v26.36.2-617d8d1 | Thu, 10 Sep 2026 11:23:49 GMT |
| Production (field comparison only, read-only) `app.shopview.com` | v26.36.2-dbe16f4 | Thu, 10 Sep 2026 08:54:50 GMT |

**How I know the branch is post-fix and the other two are not** — the fix is server-side, so the
frontend version cannot tell you. `GET /api/inventory/parts` returns **31 fields on the branch and 29 on
both staging and production**, and the two extra fields are exactly **`has_outstanding_return`** and
**`has_work_order_part`**. Staging is additionally proven pre-fix *by behaviour*: the defect reproduces
there.

## What was checked

| # | Check | Result |
|---|---|---|
| 1 | The reported failure, on the **same return record** on both builds | **PASSED** — staging HTTP 500 + the exact reported error; branch HTTP 204 + *"Manual return cancelled successfully"*, row removed |
| 2 | All of the customer's "3 manual returns" can be cleaned up | **PASSED** — 3 of 3 cancelled on the branch (204 each), 0 manual returns left |
| 3 | Chris's ruling on screen: deleting a part with an open return | **PASSED** — Delete refuses and says *"Please complete or cancel the related return or credit first."* |
| 4 | Chris's ruling on the server | **PASSED** — `POST /api/inventory/parts/delete` → **400** *"Inventory part with an open return or a pending credit cannot be deleted."* |
| 5 | Is there a second, unguarded way to delete the part? | **PASSED** — there is only one delete surface; Catalog bulk actions offer *Set category* only, Inventory actions offer *Cycle count / Export* only |
| 6 | Regression: cancelling a normal manual return puts the stock back | **PASSED** — 10 → 8 with the return open → **10** after cancelling |
| 7 | Regression: the part becomes deletable again once the return is dealt with | **PASSED** — `deletable` false → true, `has_outstanding_return` true → false |
| 8 | Regression: a part with nothing against it still deletes | **PASSED** — 201, part gone |
| 9 | A return that has already been credited | **PASSED** — refuses with a clean **400** *"Cannot cancel return that has been completed."*, not a 500; the part is then deletable, which is exactly "properly in and out … before deleting" |
| 10 | Root cause confirmed on the pre-fix build | **CONFIRMED** — with an open return the part shows `deletable: true`, Delete is offered with no warning, the delete succeeds (201), and the return's cancel then fails with 500 |

## The detail behind check 1 — the same record, both builds

Record **`c798f0f3-4a55-46f0-a07d-0a850ce5d607`** — part **19419780** *"5W30 Dexos Engine Oil, 4.73L"*,
vendor **Hueytown Truck & Trailer Repair**, qty **2.00**, requested **Aug 14 2026**. It exists on both
environments (the branch is a clone of the same organisation), so this is a true like-for-like.

- **Staging (pre-fix):** `POST /api/part/manual-return-request/c798f0f3…/cancel` → **HTTP 500**,
  request id `7d161e03-d70b-40d2-8c86-19e7a5712d04`. On screen: *"Ooooops! An error occurred … Include
  your request ID"* and *"Failed to cancel manual return. Please try again later — Cancel return
  Error"*. The return stays in the list. This is the customer's report, word for word.
- **Branch (post-fix):** the same call → **HTTP 204**. On screen: *"Manual return cancelled
  successfully"*, and the list then reads *"No return requests match the search 19419780"*.

Exhibit: `ev/EX1-reported-bug-before-after.png`.

Not every manual return in that data was broken — of the three on staging, `c798f0f3` failed with 500
while `92d3c57e` and `1661a780` cancelled normally (204). That is the same mix the customer would see,
and it is why the earlier reading that "the three pre-existing returns are the customer's state" was
wrong: only the one whose part had actually been deleted was stuck.

## The detail behind checks 3, 4 and 10 — the guard

On the branch, creating a manual return against part **2--83-2511PK** moved it from
`{deletable: true, has_outstanding_return: false, qty 46}` to
`{deletable: false, has_outstanding_return: true, qty 44}`, and then:

- the **Edit Inventory Part** dialog's red **Delete** shows the tooltip *"Please complete or cancel the
  related return or credit first."* and sends no request;
- `POST /api/inventory/parts/delete {id}` → **400** *"Inventory part with an open return or a pending
  credit cannot be deleted."* — so this is a real server-side guard, not a hidden button.

On staging the same setup leaves the part `deletable: true`, the Delete button enabled with **no
tooltip at all**, and the delete succeeds — which is precisely how the customer's returns got broken.

Exhibit: `ev/EX2-part-delete-guard-before-after.png`.

## The detail behind check 6 — the stock really goes back

Part **573.D430FH-HV** *"FLAT HOOK WINCH STRAP HiVis 4""*, bin **MZH1C**: **10 in stock** → a manual
return for 2 → **8** → cancel the return → **10**. Exhibit: `ev/EX3-restock-on-cancel.png`.

## Honest limits

- **E2 Trucking's own data was never touched.** Their three returns live in their organisation, which I
  have no access to. The already-broken case was proven on a record that exists identically on the
  pre-fix and post-fix environments, which is the closest like-for-like available.
- **Admin only.** Every check ran as an Admin user; per-role behaviour of the new guard was not
  exercised.
- **The Vendor Credits side was exercised only as far as the ruling needs.** Posting a credit through
  *Create Credit* creates the manual return and credits it in two calls
  (`…/manual-return-request/create` then `…/manual-return/{id}/create`), after which the return counts
  as completed and the part is deletable. I did not construct a separately "pending" credit.
- **Writes I made on the shared staging environment** (your standing note is that staging and
  production are dummy accounts, but recording it anyway): 2 inventory parts deleted
  (`2--83-2511PK`, `4--1493-6C`), 2 manual returns cancelled (`92d3c57e`, `1661a780`), and 2 manual
  returns left open (`7532540d` — deliberately orphaned for the reproduction — and `10cde749` on part
  `N6801-06-04`). Nothing was touched on production: one read-only login, no writes.

## Recipes proven this pass (for the playbook)

- Returns live at **`/parts/returns`** (`Returns` / `Credits` tabs), listed by
  `GET /api/work-orders/part/list-return-requests?…&core_only=0`. `return_type` is `manual` or
  `work_order`; the Status column shows *Manual* for manual returns while the API `status` reads
  `returned` for both — filter on **`return_type`**, not on the status label.
- **Cancel a manual return:** `POST /api/part/manual-return-request/{id}/cancel` → 204. In the UI:
  the row's `button_manual_return_actions_<returnId>` → `menu_item_cancel_return` → a **two-step
  confirm**: `button_remove_return_positive_answer` ("Yes") re-renders into **"Are You Sure?"** with a
  **different id — `button_remove_return_confirmation_answer`** — so a script that clicks the first id
  twice silently does nothing. Click the first, then find the button by its new label or id.
- **Create a manual return:** `POST /api/part/manual-return-request/create`
  `{vendorId, packagingSlip, items:[{inventoryPartId, partNumber, partDescription, quantity,
  costDecimal, binAllocations:[{binLocationId, quantity}]}]}` → 201. `binLocationId` is required and
  comes from the part's `binLocations[].binLocationId` (the field is **not** called `id`). In the UI the
  quantity input's id changes to `input_return_qty_<row>_<bin>` **after** a part is selected.
- **Post a credit:** `/parts/create-credit` → `POST /api/part/manual-return/{returnId}/create`
  `{creditMemoNumber, creditDate, note, tax}` → 201, preceded by a manual-return create.
- **Delete an inventory part:** `POST /api/inventory/parts/delete {id}` → 201. The only UI surface is
  the **Edit Inventory Part** dialog reached by clicking the part's name
  (`table_cell_name_<partId>`); its Delete button carries `data-test-id="button_cancel_dialog"`.
- `GET /api/inventory/parts` exposes **`deletable`**, **`has_outstanding_return`** and
  **`has_work_order_part`** — the quickest way to tell a post-SV-9498 build from a pre-fix one.
- A returns/inventory page search is opened with **`page_search_toggle`** and then typed into; there is
  no separate search input in the DOM until it is toggled.

---

## Posted

**Comment [76291](https://shopview.atlassian.net/browse/SV-9498?focusedCommentId=76291)** on SV-9498,
10 Sep 2026 07:48:45 -0500, on the QA lead's go-ahead.

**Pre-post gate (Standing Rule 72), run immediately before posting:**

- Branch marker re-read live — **`v26.36.2-13b91e9`**, last-modified Thu, 10 Sep 2026 11:00:34 GMT:
  identical to the reading at the start of the pass, so nothing redeployed under the testing.
- **Staging redeployed mid-pass and the gate caught it** — `v26.36.2-617d8d1` → **`v26.36.2-a678e3c`**
  (last-modified 12:42:51 GMT). Re-checked afterwards: still 29 fields, still no
  `has_outstanding_return`, and the orphaned return still returns **500**. So the before picture
  remains a valid pre-fix reference, and the comment names **both** staging markers rather than
  implying the capture and the current state are the same build.
- All three exhibit URLs returned **HTTP 200** at post time.
- Ticket state re-read: **TESTING QA**, no new comment since Dipesh's 06:04 note.
- Reader-facing text scanned for AI self-reference and model names — clean.
- **Read back from Jira after posting:** verdict panel is the first node, 3 media nodes in the order
  EX1 → EX2 → EX3 with the correct URLs, the table carries its header plus all 10 rows, and the
  technical section sits last after the rule.
