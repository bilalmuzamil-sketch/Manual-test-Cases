## §X — CREATING A SECOND ORGANISATION ON A QA BRANCH (proven sv9160, 2026-09-17)

**Needed by any tenant-isolation check.** A QA branch normally ships with exactly one organisation,
and `GET /api/organizations` will tell you so. That is not the end of the road.

| Route | Result |
|---|---|
| `POST /api/organizations` | **405 — Allow: GET.** No creation route on the resource. |
| `POST /api/customers` | **405 — Allow: GET.** Customers are not created through this path either. |
| `POST /api/quick-login {userId}` / `{email}` | **400 "Key is required."** Quick-login serves only the fixed keys (`admin`, `tech`), both in the first organisation. |
| `POST /api/users/<id>/resend-invitation`, `GET /api/users/<id>` | **404.** A newly registered administrator's session cannot be reached from the branch. |
| **`https://<branch>.qa.shopview.com/register`** | ✅ **"Register your organization here."** Five fields — administrator email, first name, last name, company name, work-order start number — and a **Register** button. Posts `/api/register`, answers 200, and the new organisation is then visible in `GET /api/organizations`. |

**What you get, and what you do not.** The new organisation contains its administrator plus an
internal `Counter Sale` company, and nothing else. There is **no way from the branch to sign in as
it**, so you cannot put a customer or a job inside it. That is enough to prove a search does *not*
return another organisation's name; it is **not** enough to prove isolation of the entity kinds the
search actually indexes. Say which of the two you proved.

**Cross-organisation reads (observed, screens unaffected).** From the first organisation's session,
`/api/users` and `/api/companies` both return the second organisation's records. Settings → Staff
does **not** show them, so nothing reaches a user. Record it as an observation for a developer, not
as a finding.

