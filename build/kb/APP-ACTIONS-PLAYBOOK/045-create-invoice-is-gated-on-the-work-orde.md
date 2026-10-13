## 🧾 CREATE INVOICE IS GATED ON THE WORK ORDER BEING **COMPLETE** (proven on production 2026-09-12)

**The button is always present and is DISABLED until the work order reaches `Complete`.** It is not
missing, and it is not unresponsive — `button.disabled === true` with `aria-disabled="true"`.

Measured across ten jobs on `app.shopview.com`, build `v26.36.4-3e1c643`:

| Work order status | Create Invoice |
|---|---|
| `estimate` (S1-860, S1-816) | **disabled** |
| `approved` (S1-793, S1-762, S1-756, S1-825, S1-791, S1-763, S1-858) | **disabled** |
| `complete` (S1-852) | **enabled** — clicking it invoices the job |

Other badges on those jobs (`Over Limit`, `Valid VIN Required`) do **not** decide it: S1-852 carried
both and was still invoiceable. Only the status did.

**Consequences for a probe:**
- To seed a fresh invoice, pick a work order at `complete`, not at `estimate` or `approved`.
- Read `button.disabled` before clicking, and report *disabled* rather than *not responding* —
  they are different findings and only one of them is about the product.
- After clicking, a **"New Customer Payment"** dialog opens (Payment Date, Payment Method, Charge
  Account, Reference Number, Memo). The invoice is created regardless; the dialog can be dismissed.
- Confirm the outcome from the record, not the screen: `GET /api/work-orders/view/<id>` → `status`
  moves to `Invoiced` and `invoice_id` is populated.

---

