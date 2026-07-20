# Simple Flow — Staging VIU (2026-07-20) — STEP 0 validation

**Host confirmed:** app `https://app.staging.shopview.com` / API `https://api.staging.shopview.com`
(the SHARED d55bc308 staging org — same org GUID as Custom Roles staging).

**Auth (live, this run):**
- `POST /api/quick-login {key:'admin'}` → **HTTP 200** (Symfony token returned).
- `GET /api/auth/me/fe-permissions` → **HTTP 200** (42 permission codes).

**Simple Flow present on this build — CONFIRMED:**
- `GET /api/organizations/settings` → **200**, returns the Work Orders settings object with the
  Simple-Flow keys: `requireMileage, requireHours, requireTechStories, requireVehicleIdentifier,
  vehicleIdentifier, autoPickInventoryParts, autoApproveLines, requireVendorInvoiceNumber, requireReview`.
  (Baseline captured `/tmp/sf-viu/staging-settings.json`: requireVehicleIdentifier=true vin, all others false.)
- **Story-18 pre-resolve route BUILT:** `POST /api/work-orders/{id}/pre-resolve-cores` returns
  **400 `{"errors":[{"id":"Not found"},{"error":"At least one core is required."}]}`** on an empty/fake
  request — i.e. the route exists and validates (was absent on sv7301). This is the deployment unblock.
- Bulk Receive / receive pipeline reachable: `GET /api/inventory/orders` 200, `/api/inventory/deliveries` 200,
  `GET /api/work-orders` 200.

**Org / roles (live):** org `d55bc308-e61a-438d-b5f1-c7a73c89d49f`. Roles incl. Technician
`50bf6a0d-f1be-42b2-bb06-4f821b5caa6a`, Time Clock User `e35b0211-23e1-401e-bf45-ce8d1772bfa6`
(NOTE: differs from the Custom-Roles-memory a0359055 id — will capture Tech's ACTUAL current role
before any swap and restore that, not a hardcoded id).

**QuickBooks:** `QuickBooks` feature flag exists but `GET /api/quickbooks/status` → 404
(`'resource' was not found`) — QB likely NOT connected on this org (matches sv7301). QB-dependent
cases will remain Blocked-Env unless a connected company surfaces.

**Verdict: STEP 0 PASS — proceeding with the live VIU pass.**
