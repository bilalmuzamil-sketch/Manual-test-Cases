# Production sanity check — SV-10586 and SV-9568

**Both PASS on production.** Each was re-run as its own ticket describes it, on the live build.

- **Environment:** `https://app.shopview.com`, build **`v26.40.3-df33ae5`**, last-modified
  **Fri, 02 Oct 2026 08:16:28 GMT**, etag `W/"99ac97b5aea2c0dfac02e328342c0494"` — **read at the
  start and again at the end, identical**, so nothing redeployed under the pass.
- **Date:** 2 October 2026. Viewport 1900 × 1050. Account `bilal.muzamil@shopview.com`.
- Both tickets are **Done**, resolved 2026-10-02.
- Both were previously passed by me on their QA branches
  (`build/sv10586-staff-roles-link-filter-2026-10-01/`, `build/sv9568-parts-column-selection-2026-10-01/`).

---

## SV-9568 — Parts column selection does not stay saved

Tested to the ticket's own Steps to Reproduce (1–6), on the live build.

| # | Step from the ticket | Result on production |
|---|---|---|
| 1 | Navigate to Parts | 14 default columns |
| 2–3 | Open the column selector, hide unwanted columns | Tags, Manufacturer and Vendor removed from the table at once; **3 preference writes fired** |
| — | (the saved record) | a full `columns` object is now stored |
| 4 | Navigate away from Parts | — |
| 5 | Return to Parts | **11 columns — the choice held** |
| 6 | Plus a full browser reload | **11 columns — still held**, and the column list still shows the three switched off |

**This is a genuine before/after on the same environment.** When I captured production yesterday
for the branch pass, the same actions produced **zero preference writes**, a stored value of
`null`, and all 14 columns back after one reload. Today production writes the preference and keeps
the choice.

| | production 1 Oct (`v26.40.2-95f3172`) | production 2 Oct (`v26.40.3-df33ae5`) |
|---|---|---|
| preference writes while hiding 3 columns | **0** | **3** |
| stored preference | `null` | full `columns` object |
| columns after a reload | **14 — all three back** | **11 — all three still hidden** |

Exhibit: `ev/01-sv9568-production-before-after.png`.

---

## SV-10586 — Opening Staff from Roles & Permissions mixes in and overwrites your saved Staff filter

Tested to the ticket's own five steps. The roles page link is `?roleName=<role>`, matching the
developer note in the description.

| # | Step from the ticket | Expected (from the ticket) | Result on production |
|---|---|---|---|
| 1 | Staff → Permissions filter → pick Technician | — | chip `Permissions: Technician`, 4 people, all Technician; saved preference `["Technician"]` |
| 2 | Leave and come back | the saved filter | chip `Permissions: Technician`, 4 people — **saved filter confirmed** |
| 3 | Roles & Permissions → click a **different** role's Users count (Admin, showing **10**) | — | Staff opens at `?roleName=Admin&roles=Admin` |
| 4 | | *"Permissions = Admin only, and the list shows exactly the people counted on the Roles page"* | chip reads **`Permissions: Admin`** — not Technician + Admin. **10 people**, matching the 10 counted. **Every row is Admin.** Saved preference **still `["Technician"]`** — the link did not overwrite it |
| 5 | Leave and come back | *"your own saved filter (Technician) is back"* | chip `Permissions: Technician`, 4 people, all Technician — **restored** |

Both reported faults are gone, and the third assertion — that the saved filter is not silently
rewritten by opening a link — holds as well.

Exhibit: `ev/02-sv10586-production.png`.

---

## Observations, each with its bucket (Standing Rule 93)

- **The Staff URL after the link carries both parameters** — `?roleName=Admin&roles=Admin`.
  **Explained, not a defect:** that is how the fix scopes the view to the clicked role for that
  visit while leaving the stored preference alone, which is exactly what the ticket asks for.
- **`parts-inventory` cannot be put back to `null`** — `PUT` with `value: null` returns
  `400 "value must be a JSON object"`. **Explained, not a defect:** once a user has a column
  preference there is no product concept of "no preference", and no user-facing way to ask for one.
  It only affected how I restored (below).
- **Nothing else was observed.** No errors, no unexpected states, nothing unexplained.

Both tickets were searched for related open work before writing any of this up; nothing here
duplicates or contradicts an existing ticket.

---

## Environment restored

Production keeps the restore-after discipline.

| What I changed | Original | Now |
|---|---|---|
| Staff filter (`administration-staff`) | `{"filters":{"roles":["Sales Representative"],"workplaces":[],"departments":[]}}` | **restored to exactly that value** (only `updatedAt` differs, which cannot be reinstated) |
| Parts columns (`parts-inventory`) | `value: null`, 14 columns visible, `size` off by default | **all 14 columns visible again, `size` still off** — matching the original view. The stored record cannot be returned to `null` (see above), so the value is now an all-on object rather than absent |

---

## Honest limits

- This was a **sanity check of the two reported behaviours on the released build**, not a re-run of
  the full 17-check suites from the branch passes. Each ticket's own reproduction steps were
  followed end to end; the wider regression checks (cycle count, per-user isolation, the
  no-financial-data role, filters/sort/search) were done on the branch and were **not** repeated
  here.
- The SV-9568 before-half is my own production capture from 1 October, taken for the branch pass —
  a real capture of the real old build, not a reconstruction.
