# CHANGES MADE ON QA BRANCH `sv8785` — Filters full live VIU, 2026-08-05

Per the QA lead's instruction of 2026-08-05: *"Note any changes you make to these QA branches
whether you seed something or change anything. You do not need to delete any test data from those
QA branches they are just the temporary branches which get deleted after the feature is moved to
the staging environment."*

Branch: `https://sv8785.qa.shopview.com` · API `sv8785api.qa.shopview.com`
Build observed throughout: **`v3.4.2-d00239b`** (last-modified Tue 04 Aug 2026 22:51:02 GMT,
etag `b9ab1d41718b5e871432064ed914e2e7`).
Signed in as **Admin ShopView** (`bilal.muzamil@shopview.com`), Administrator, full view mode.
Workplace: **Staging Heavy Duty - 9919**.

---

## 1. NOTHING WAS CREATED. NOTHING WAS DELETED.

This pass created **no** customers, **no** work orders, **no** assets, **no** technicians, **no**
service advisors, **no** staff, **no** roles and **no** parts. It deleted nothing. There is
therefore **no `ZZAUTOTEST` data on this branch from this pass** — not because it was cleaned up,
but because none was ever needed.

**Why none was needed** — the org already held every data state the 110 cases require, and it was
cheaper and safer to find those states than to manufacture them:

| Data state a case needed | What already existed, used read-only |
|---|---|
| A status with work orders | `paid` (500+), `estimate` 125, `approved` 92, `invoiced` 62, `complete` 11, `declined` 7, `ready_for_review` 1 |
| A status with **zero** work orders (empty-state tests) | `in_progress` **0** and `imported` **0** |
| A customer with many work orders | **Ceview Builders** (`275af4eb-e926-47bb-b43a-679476c05023`), 90 |
| A lead technician with work orders | **Colleen Guerrero** (`16469a2e-c167-4797-b16e-a17bdc5f32e9`), 50 |
| A service advisor with work orders | **Lauren Knight** (`6e2fbce3-c278-4095-8f79-ad1931519409`), 137 |
| A service advisor with **zero** work orders | **Ayesha Khan** (`1e81b8a0-9a45-4f16-89e3-209bf240990a`), 0 |
| A customer whose work orders are **all off-site** (so "Asset on Site: Yes" matches nothing) | **Bahampton Holdings** (`60079061-d514-45bb-8aba-9343759201ff`), 6 work orders, all `vehicleHere:false` |
| **Deactivated** staff (must not appear in the people dropdowns) | 34 staff already carry `is_active:false` |
| A second customer for multi-select | **Braside Design** (`8e72b8fc-0c6a-4f11-8b9b-8d54fc76d93a`), 68 |

No row of any of those records was modified.

---

## 2. WHAT *WAS* CHANGED — the account's saved page preference (the only write)

**One server-side object was written, repeatedly:** the signed-in user's saved Work Orders list
preference at `PUT /api/users/me/preferences/work-orders-list`.

This is **per-user server-side state on a SHARED account**, so it changes what the next person to
open that page sees — including **Ahtasham Amjad, who was grading run 352 during this pass**. It is
recorded here in full for exactly that reason.

### 2a. THE BEFORE VALUE — the one thing nobody could reconstruct later

Captured before the first write and committed as
`evidence/PRE-pref.json`:

| Field | Value found at pass start |
|---|---|
| `filters` | **`{"status":["declined"]}`** |
| `tab` | `all` |
| `collapsed` | `false` |
| `sortBy` / `descending` | `vin` / `true` |
| `columns` | 14 keys; `daysOpen`, `invoicedDate`, `partRequestsCount`, `partReturnRequestsCount`, `unreceivedPartRequestsCount` false, the rest true |
| `search` key | **absent** |
| `updatedAt` | **`2026-08-05T19:14:50Z`** |

That `updatedAt` is **39 minutes before this pass began** (pass start 19:53Z), so the `declined`
filter was **not** left by this pass — it was already set by another actor on the shared account.

### 2b. WHAT WAS WRITTEN, AND WHY

`filters`, `tab` and `collapsed` were reset to a known clean baseline before most observations,
because a leftover filter silently changes what a test observes. `columns`, `sortBy` and
`descending` were **carried through unchanged on every write** (each write spread the existing
value and overrode only those three keys).

Values deliberately set at various points, all through the product's own filter controls or this
endpoint:

- `filters` = `{}` (clean baseline — used before most observations)
- `filters` = `{"status":["paid"],"company_id":["275af4eb-…"]}` (persistence test)
- `filters` = `{"status":["declined"]}` (URL-state and shared-link tests)
- `collapsed` = `true` then back to `false` (collapse/expand tests)
- `tab` = `all`, and `tab` **deleted entirely** once, to observe the first-visit default
  (this is how the Estimates-on-first-visit behaviour was proven)

### 2c. THE STATE IT WAS LEFT IN — read live at 2026-08-05T20:57:36Z

```
filters   = {}          (EMPTY - no filter is left set)
tab       = "all"
collapsed = false
search    = key absent
```

**No filter is left applied**, so the next person opening the page gets an unfiltered list. Note
this is **not** byte-identical to the pre-pass value: the `{"status":["declined"]}` filter that was
there at 19:14Z is **gone**. If anyone is looking for it, that is why. The `columns`, `sortBy` and
`descending` settings are unchanged from the pre-pass snapshot.

Also read read-only and confirmed **never saved** (HTTP 200, `value: null`, untouched by this
pass): `parts-list` and `reports-list` preferences.

---

## 3. ROLES — none touched, and why Rule 26 was still satisfied

**No role was reset, edited, created or deleted, and no user's role was changed.**

Rule 26 requires a reset-to-template before any *permission-dependent* observation. **The Filters
suite contains no permission cases** — its 18 sections are filter bar, the five filters, chips,
collapse, empty state, tabs, persistence, URL state, mobile, API, page search, Parts and Reports.
Not one of the 110 cases asserts on a role or a permission gate, so no permission-dependent
observation was made and no reset was required.

This matters for the sibling worker: the org is shared with the Schedule pass, and **this pass left
every role exactly as it found it**. Nothing here can have corrupted a role-dependent observation
there.

The staff roster was read (`GET /api/staff?limit=400`, 68 records) purely to identify deactivated
users. **Read-only — no staff record was written.**

---

## 4. Third-party / integration systems

None touched. No QuickBooks, no email, no export, no scheduled delivery.

---

## 5. TestRail and Jira

Recorded here for completeness; detail in `testrail-execution-log.md` and `FILED.md`.

- **TestRail:** `update_case` only, on cases under group 4110, all `created_by = 3` (ours). **No**
  `add_case`, **no** `delete_case`, **no** section change, **no** run write, **no** result logged.
  Run 352 was snapshotted before and after and proven undamaged **by content comparison, not by
  timestamps** (see the note in §6).
- **Jira:** see `FILED.md`. No existing ticket's fields were edited; closed tickets were left
  closed (Rule 53's corollary — a change made under this shared account is the QA lead's triage,
  not ours to reverse).

---

## 6. A CAVEAT ON HOW "UNTOUCHED" IS PROVEN HERE

A sibling pass found **fourteen Report Suite cases whose three text fields changed from plain text
to raw `<ol>`/`<li>` markup while `updated_on` and `updated_by` stayed frozen at earlier values.**
So `updated_on` is **not** evidence that a case is untouched.

Every untouched-proof in this pass is therefore a **byte comparison of the field content** against
the pre-write snapshot (`pre-write/PRE-cases-110.json`, committed before the first write), not a
timestamp check. Where a timestamp is quoted it is context, never proof.

**Ten of the 110 cases already carried raw `<ol>`/`<li>` markup in the pre-write snapshot** —
C29558, C29559, C29571, C29574, C29589, C29595, C29608, C29616, C38881, C38904 — in **all three**
text fields. That is recorded as a pre-existing defect found, **not** something this pass caused;
the snapshot committed before any write is the evidence.
