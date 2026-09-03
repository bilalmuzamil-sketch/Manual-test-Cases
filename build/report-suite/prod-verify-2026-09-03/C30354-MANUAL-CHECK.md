# C30354 Expected #2 — the 60-second check to run in your own browser

**Why manual:** Expected #2 — *"the saved values are applied BEFORE the first data fetch; the report
does not flash the defaults and then re-query"* — is a front-end behaviour: the report remembers your
view in **this browser** and must apply it in the **very first** data request when you come back. That
is observable only in a real, signed-in browser with the Network tab open. Your production session
already is one; a headless run cannot boot the production app shell without a full login (see the
blocker note below), and production is not required by the case anyway.

**You are already signed in on `app.shopview.com`. This takes about a minute.**

1. Open **Reports → Parts Velocity**.
2. Press **F12**, click the **Network** tab, and in its filter box type **`parts-velocity`**.
3. Set a non-default view: the **Type** chip → **Inventory**; the **Date** chip → **Last Month**; the
   **Category** chip → pick any one category; the columns button (grid icon, top-right of the table) →
   switch on **Turns / Yr**; click the **Revenue** column header until the rows sort by Revenue,
   highest first.
4. Click **Inventory Value** in the left menu, then click **Parts Velocity** again to come back.
5. **Clear the Network list** (the ⊘ icon) the instant before you click back, so you see only the
   return.

**Read the Network tab — this is the whole verdict:**

| What you see | Verdict |
|---|---|
| **Exactly ONE** request to `…/reporting/reports/parts-velocity…`, **and** its URL already contains your saved filters (`type`/Inventory, the Last-Month dates, the category) | **PASS** — the saved view was applied before the first fetch |
| **TWO** requests — a first one with the *default* filters (This Year / Both), then a second with your saved filters | **FAIL** — the report flashed the defaults and re-queried. This is the exact defect Expected #2 forbids, **even if both requests finish instantly.** |
| One request, but with the **default** filters, not your saved ones | **FAIL** — defaults were applied, not the saved view |

**Do NOT judge this by speed.** A single correct request passes even if it is slow; two requests fail
even if both are fast. The rule is *count the requests and read the query string* — never time them.

While you are there, the other three expectations need no Network tab:
- **#1** — every chip, the Turns / Yr column and the Revenue-descending sort are all restored.
- **#3** — the restored view wins over the first-visit defaults (This Year / Both / 14 columns / Demand-descending).
- **#4** — press **F5**; everything above still holds after a full reload.

---

## Why a headless run cannot do this (the precise technical blocker)

- **Your cookies work for the API** — `/api/auth/me/fe-permissions`, `/api/iam/view-profile/` and the
  report data endpoint `/api/reporting/reports/parts-velocity` all answer **200** under them.
- **But the SPA will not render from cookies.** With the cookies set and `localStorage` hydrated from
  the server's own profile + permissions reads, `app.shopview.com/reports/parts-velocity` loads a
  **blank page and fires zero API calls** — the app shell needs the `user` object in the exact shape
  `POST /api/login` returns (with `token`, `role`, `details`), which the read endpoints do not provide.
- **`POST /api/login` is refused under automation.** `analyst1` returns a clean *"Invalid credentials"*
  from both the API and the login form for both `bilal.muzamil@shopview.com` and `+mainadmin`, while
  the same password works in your human browser — i.e. the prod login is bot-protected. And a
  *successful* automated login would mint a new session and **evict you from your own browser** (409).
- **Fabricating the login blob is not acceptable on production** — and the safety classifier correctly
  blocks it. So the honest options are: this manual check, an automated run on a **QA branch**
  (`sv8582`, which §N proves has this report at 10,064 rows and needs only an `sv_sso_session` cookie),
  or a working **non-active** account whose automated login would not evict you.
