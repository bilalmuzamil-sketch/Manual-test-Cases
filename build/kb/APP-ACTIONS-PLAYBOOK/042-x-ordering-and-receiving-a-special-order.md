## §X — ORDERING AND RECEIVING A SPECIAL-ORDER PART (proven on sv9315, 2026-09-10)

**Needed by any case that requires a received special-order part on a work order line.** Every step
below was done through the screen and verified by reading the line back.

1. **Add the part as a special order.** On the line's Parts section click **+ Add Part**, then open the
   part window and set **Source = Vendor** (an inventory part is not a special order). Save. The part
   row now shows the status chip **Auth To Order** with an **Order** button beside it.
2. **Order it.** Click **Order** (`data-test-id=button_part_request_action`). One click, no confirm
   window. The request moves `authorized_to_order` → `waiting_to_receive` and the chip becomes
   **Awaiting Receive**.
3. **Receive it.** Click **Receive** — the same `button_part_request_action` id, relabelled.
   **🛑 THIS NAVIGATES; IT DOES NOT OPEN A WINDOW.** It goes to
   `/order/<orderId>?receive=1&returnTo=WorkOrder&returnId=<woId>&returnLineId=<lineId>&workOrderId=<woId>&vendorIds=<vendorId>`
   — a **Purchase Order Details** page with the columns *Part Number · Description · Cost · Sell ·
   Quantity Ordered · Quantity Received · Total*.
4. **🛑 FILL THE INVOICE NUMBER.** `input_invoice_<orderId>` is **empty and required**. The quantity
   `input_qty_<orderItemId>` is already pre-filled with the ordered amount, and Invoice Date defaults
   to today. **With the invoice number blank, pressing Receive does nothing and shows no message** —
   which is exactly what made two earlier passes report the feature as broken.
5. **Press Receive.** It writes **`POST /api/orders/receive-requested-parts`** and navigates back to
   the work order. The part request disappears and the part is now on the line.
6. **Then the line can complete** — a line refuses Complete while any request is unfulfilled
   (*"Line can`t be completed with unfulfilled part requests."*).

**The trap, recorded because it cost two passes:** looking for a dialog after clicking Receive, and
describing the page a few seconds into the navigation before it rendered, both produce "nothing
happened". Use `afterAction()` from `build/testing-tools/probe_guard.mjs`, which records navigation
and new tabs as well as panels, so a navigation can never read as a no-op (Rule 104).

**Related line-status facts:** a new line lands in `authorization_required`; a part request cannot be
picked there (*"This action can only be performed on the authorized lines."*); `pick` is the only
action `perform-request-status-action` accepts. Order is create → **authorize** → add part → pick (or
order+receive for a special order) → complete.

