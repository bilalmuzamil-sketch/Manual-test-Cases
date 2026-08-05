# API-ASK — 2026-08-05

**Nothing to ask about. This pass produced NO API-only finding.**

Standing Rule 51 requires that any defect reachable **only** by calling an endpoint directly — with a
request the product's own screens never send — is listed separately and **never filed without asking**.
The rule is checked item by item, and the file exists saying "none" rather than being left out, because
an omitted section is indistinguishable from an unchecked one.

| Finding from this pass | Reachable from the product's own screens? | Therefore |
|---|---|---|
| The Work In Progress download fails with a server error on every non-empty tab | **YES** — the three-dot menu's *Download (CSV)* / *Download (PDF)* makes exactly this request | user-facing → filed as **SV-8907** |
| The Asset filter omits a vehicle that shares a unit number | **YES** — the option list the filter renders is this response; typing the missing identification number matches nothing on screen | user-facing → filed as **SV-8908** |
| The report paginates in pages of 100 rather than loading everything in one request | Not a defect — a **specification wording** problem | asked of Chris, not filed |
| The report API returns `work_order_id` / `customer_id` to every user, so the link decision is client-side | Not a defect — **Rule 24**: an identifier in a payload is not an action, and the front end is the gate | nothing filed, and nothing should be |

**A note for the next pass, because it is easy to get wrong:** a 500 in the evidence does **not** make a
finding API-related. SV-8907 is characterised with request ids and an endpoint, and it is still a
user-facing defect, because a person clicking *Download (CSV)* hits it. The test is **reachability from
the product**, never the shape of our evidence.
