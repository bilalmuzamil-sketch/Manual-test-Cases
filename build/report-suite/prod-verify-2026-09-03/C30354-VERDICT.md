# C30354 — build-verification verdict, production, 2026-09-03

**Case:** [C30354](https://shopview.testrail.io/index.php?/cases/view/30354) — *"Filters; columns and
sort are remembered per browser before the first fetch."* Report Suite / Parts Velocity.
**Environment:** production `app.shopview.com`, build **`v26.35.8-7318b27`**, org `72b2cc90…`, location
Trucks Hill 2. **Executed by the QA lead in his own signed-in browser** (the prod SPA cannot be booted
headlessly without a real login; see `C30354-MANUAL-CHECK.md`). Evidence: three DevTools screenshots,
2026-09-03 ~13:58 UTC.

## The measurement, done right (count, never time)

On return to Parts Velocity, the Network tab filtered to `parts-velocity` showed **5 requests**:

| # | Request | What it is |
|---|---|---|
| 1 | `GET /api/users/me/preferences/report-parts-velocity` → 200 | the **saved-view read** |
| 2 | `GET …/reporting/reports/parts-velocity?type=inventory&range=custom&start_date=…&…sortBy=re…` | the **one** report data fetch |
| 3–5 | `collect?v=2&tid=G-Q8V1RLY7LK…` | Google Analytics beacons — **not** report data |

**Exactly ONE report data fetch**, and its query string already carries the saved filters
(`type=inventory`, `range=custom` = the Last-Month range, `sortBy=re…` = Revenue). **No defaults fetch
precedes it** — a `parts-velocity?range=this_year&type=both…` request would also match the filter and
would be visible; it is absent.

## Verdicts

| Expected | Verdict | Evidence |
|---|---|---|
| **#2 — saved values applied BEFORE the first data fetch; no defaults flash** | **PASS** | one data fetch on return, already parameterised with the saved filters; no preceding defaults request |
| **#1 — all saved settings restored** | **PASS** (chips + sort) | the report reopened with **Type: Inventory · Date: Last month · Category: Air Conditioning**, and the Revenue column carries the sort arrow. *(The `Turns / Yr` column specifically is off the right edge of the screenshot — not disproven, just not visible; the other four settings are confirmed.)* |
| **#3 — saved view beats first-visit defaults** | **PASS** | on return it loaded Inventory / Last-Month / one-category, NOT the first-visit defaults (This Year / Both / all categories / Demand-descending) |
| **#4 — survives a full page reload (F5)** | **NOT EXPLICITLY TESTED** | the trace captured leave-and-return, not an F5. The store is server-side (below), which would survive a reload, but that was not the step observed — mark it verified only once an F5 is done |

**C30354 Expected #2 — the case's hard assertion — PASSES on production.**

## 🛑 FINDING — the storage model deviates from the spec (bears on C30355 / C30356, not on C30354's own verdict)

The saved view is read back from **`GET /api/users/me/preferences/report-parts-velocity`** — a
**server-side, PER-USER** store. Its payload (screenshot 3):

```
pageKey: "report-parts-velocity"   updatedAt: "2026-09-03T13:56:46Z"
value.filters: { types:["inventory"], dateRange:["last-month"],
                 categoryIds:["4f20c06b-…"], locationIds:["4c869c8b-…","555206ea-…"],
                 binIds:[], vendorIds:[] }
```

**The spec S4-R6 (PV v10/v11, byte-identical) says the opposite:** *"The report saves, **in this
browser (not tied to the user account)** … Because storage is per-browser, a different user signing in
on the same browser **inherits** the saved view (there is no per-account separation)."*

A **`users/me/preferences`** store is **tied to the account**, not the browser. If that is the only
store, then:
- the **same** user on a **different** browser would see the saved view — the spec's per-browser model
  says they should not;
- a **different** user on the **same** browser would **not** inherit it — which is exactly what
  **[C30356](https://shopview.testrail.io/index.php?/cases/view/30356)** asserts *should* happen, so
  **C30356 would FAIL** against this build.

**Held honestly (Rule 12 / the absence-claim rule):** I OBSERVED a server-side per-user read. I did
**not** observe the *absence* of a per-browser `localStorage` store — the app could use both. So this
is a strong, evidence-backed **deviation signal**, not yet a proven C30356 failure. **It needs the
explicit two-browser / two-user check** (C30355, C30356) to settle.

**No ticket, no case edit.** Per the standing rule (we make tests runnable, we do not create defects)
and Rule 71 (C30354 and its siblings are Automated), the documented expectation STAYS and this is
reported **with its C-ids** — C30354 (verdict above), and the deviation against S4-R6 that
**C30355/C30356 must be run to confirm.** Nothing was written to TestRail: a result write needs the QA
lead's go-ahead (Rule 6), and it has not been given for this run.
