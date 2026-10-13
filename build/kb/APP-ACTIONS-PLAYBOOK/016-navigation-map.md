## Navigation Map

How to reach each screen. SPA routes are under `app.staging.shopview.com`. Top nav
items are **gated by permission** (a hidden item means the role lacks the perm).

> **↔ PER-PROJECT PATHS LIVE IN `build/<project>/NAVIGATION-MAP.md` — NOT HERE.** This section holds
> the **shared, cross-project staging** paths. A path that is specific to a project and to the branch
> it is tested on goes in that project's own map (template: `build/NAVIGATION-MAP-TEMPLATE.md`;
> convention: `build/skills/03-RUN-CHECK.md` §9), which records the branch + build marker and the date
> observed. **The two files cross-reference, never duplicate:** if a path proves general, promote it
> here and point at it from the project map. Same discipline either way (Rules 27 / 57 / 12) — a path
> is written only after it was **navigated successfully and observed live**, never inferred from source
> code, a spec, a design or another branch, and the map records **navigation only, never expected
> behaviour**.

**🛑 FRESHNESS COLUMNS ADDED 2026-08-31 — EVERY EXISTING ROW IS `❌`, AND THAT IS THE HONEST ANSWER.**
The four right-hand columns (branch + build marker · date observed · Rule 91 badge · recorded by) were
added on **2026-08-31** to match the navigation-map convention in `build/skills/03-RUN-CHECK.md` §9.
Every row that already existed was written **before the convention existed**, so **none of them carries
an observation date and none can be given one now**. A `❌ unknown` cell means literally that, and the
badge cell states it in full: *"❌ observation date unknown — recorded before the navigation-map
convention existed (2026-08-31); not yet re-observed"*. **The date on which the row's TEXT was committed
is NOT the date the path was observed** — do not back-fill one from git history; that is false precision
(Rule 12: verified means observed, never inferred). **No path text, URL, label or note was changed when
the columns were added** — the paths are exactly as they were.
**Use a `❌` row as a starting point, not as evidence.** If it works, re-observe it properly and replace
all four cells with the branch + build marker, today's date, a ✅ badge and your session; if it fails,
correct the row and commit the correction in the same pass (Rule 93) — never leave a known-wrong path
for the next session. Badges: **✅ ≤7 days · 🟠 8–14 days · 🔴 >14 days · ❌ never observed / unknown.**

| Screen / Feature | Nav path (from the top) | SPA route | Notes | Branch + build marker observed on | Date observed | Freshness badge (Rule 91) | Recorded by |
|---|---|---|---| --- | --- | --- | --- |
| Work Orders list | Top nav → Work Orders | `/workorders` | Gated by `workOrdersView`. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Work Order detail | WO list → click a row | `/workorders/{id}/lines` | **Existing-WO detail bounces to `/workorders` on mount for ALL roles incl. admin.** Only a **freshly-created** WO reliably lands on the detail/lines page — create fresh to test line/part/finance flows. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| WO Finance tab | open WO → **Finance** tab | (within WO detail) | Gated by `invoicingPaymentsView` **AND** `seeFinancialData`. Holds Create Invoice / Add Deposit / invoice kebab (Reverse / Issue Credit). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| WO Parts tab | open WO → **Parts** tab | `/workorders/{id}/parts` | Direct URL to `/parts` sub-route returns page-not-found without WO context (SPA needs WO loaded). Order Parts is meant to gate this tab (visibility looked identical ON/OFF — needs manual confirm). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| WO Lines / Notes / Stats tabs | open WO → tab | (within WO detail) | Tabs render as Lines / Parts / Notes / Stats (+ Finance when invoicing+SFD on). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Schedule (calendar) | Top nav → Schedule | `/schedule` | Gated by `scheduleView`; shows ALL users' appointments. Create/delete = click/drag on the grid (no persistent button). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Parts (department) | Top nav → Parts | `/parts` | Gated by Parts Department parent. Parent OFF → nav item gone and inner pages redirect to `/workorders`. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Part Sales | Parts → Part Sales | `/parts/part-sales` | **Route is flaky in the harness** (sometimes never reaches `domcontentloaded`; `page.evaluate` hangs) while admin/catalog/vendor routes load fine. `/part-sales`, `/partsales` are NOT valid (page-not-found). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Catalog | Parts → Catalog | `/parts/parts-catalogue` | Read-only without Create&Edit. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Inventory | Parts → Inventory | `/parts/inventory` (also `/inventory`) | "New Inventory Part" button with Create&Edit. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Part History (inventory) | Parts → Inventory → **clock icon** next to a part | `/parts/inventory` | Clock icon (tooltip **"Part History"**) opens that part's history. This is a **separate feature** from the WO View History Logs permission. **Part Sales has NO history.** (Confirmed with product owner.) | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Vendors | Parts → Vendors | `/parts/vendors` (also `/vendors`) | Supply-chain sub-tabs: Purchase Orders, Vendor Invoices, Returns, Vendors. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Parts → Returns | Parts → Vendors → Returns tab (or Parts → Returns) | `/parts` → Returns | Returns list; row three-dots → "Return to inventory" / "Delete Return". | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Customers | Top nav → Customers | `/customers` | Gated by `customersView`; OFF → nav gone and `/customers` redirects to `/workorders`. Customer detail tabs: Work Orders / Part Sales / Contacts / Assets(vehicles) / Notes / Payments. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Reports | Top nav → Reports | `/reports` | Gated by `reportsPageAccess`. Left nav groups: A/R Aging (Summary/Detail/Collection), A/P Aging (Summary/Detail/Unpaid Invoices), Sales Tax, Timesheet Activities. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| A/R & A/P aging reports | Reports → left nav | `/reports/ar-aging-summary`, `/reports/ap-aging-summary`, `/reports/ap-unpaid-invoices`, `/reports/ar-aging-collection` | Now follow **Reports** permission (all-or-nothing), per updated spec. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Timesheet Activities | Reports → Timesheet Activities | `/reports/punch-clock-activities` | Default report view; gated by `timesheetsView` (+ reports). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Administration (Settings home) | left sidebar → Settings group | `/administration`, `/administration/settings` | No perms → `/administration` redirects to `/workorders`; no SETTINGS group in sidebar. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Roles & Permissions (roles list) | Settings sidebar → **Roles & Permissions** | `/administration/roles-permissions` | Heading "Roles & Permissions". "Create custom role" button. Gated by `settingsApp` (App Settings). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Create/Edit role | Roles list → "Create custom role" (or pencil) | `/administration/roles-permissions/new` · `/administration/roles-permissions/{id}/edit` | Template picker modal → Apply → `/new?template=...`; Skip → blank `/new`. View-only summary at `/{id}/summary`. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Staff | Settings sidebar → Staff | `/administration/staff` | Role user-counts link here as `?roleName=<RoleName>`. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Locations / Departments / Taxes | Settings sidebar (App group) | `/administration/locations`, `.../departments`, `.../taxes` | App Settings group also holds Settings + Staff + Roles & Permissions. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Service settings | Settings sidebar → Service group | `/administration/labour-types` (Labor Rates), `/canned-lines` (Canned Lines), Asset Types, Inspection Templates | Gated by `settingsService`; OFF → these redirect to `/administration/locations`. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Parts settings | Settings sidebar → Parts group | Pricing, Bin Locations, Categories | Gated by `settingsParts`. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Finance settings | Settings sidebar → Finance group | Payment Methods | Gated by `settingsFinance`. **No QuickBooks entry present** (relocation not implemented). | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Data Import | Settings sidebar → Imports group | Contacts, Assets, Vendors, Inventory, Invoices | Gated by `settingsDataImport`. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Wages | (per-staff) Staff → Edit Staff Member | (modal) | `settingsWages` reveals Salary Type + Hourly Rate on the staff modal. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |
| Integrations | Settings sidebar → Integrations | `/administration/quickbooks`, `/administration/finance/quickbooks` (routes exist) | Shows only **IBS**; QuickBooks absent. | ❌ unknown | ❌ unknown | ❌ observation date unknown — recorded before the navigation-map convention existed (2026-08-31); not yet re-observed | ❌ unknown |

### RE-OBSERVATION ATTEMPT — 2026-08-31 · **0 of 28 rows re-observed** (no session could be minted)

An attempt was made on **2026-08-31** to re-walk every row above on staging and replace the `❌` cells
with a real date. **It reached the app but could not sign in, so NOT ONE row was re-observed and every
row above is still `❌`.** Recorded here so the next session does not repeat the same four probes.

**What WAS observed live, unauthenticated (this much is real):**

| Probe | Result |
|---|---|
| `GET https://app.staging.shopview.com/index.html` | **HTTP 200** · build marker **`v26.35.6-49e216a`** · `last-modified: Fri, 28 Aug 2026 08:31:04 GMT` · `etag: "7ee61447ee66167ad918fee664be24ea"` |
| `GET https://api.staging.shopview.com/` | **HTTP 200** `{"data":[]}` — the API host is up |

**What FAILED, with the exact response text:**

| Probe | Result |
|---|---|
| `GET https://api.staging.shopview.com/api/auth/me/fe-permissions` (no cookies — none exist in this container) | **HTTP 401** `{"error":"sso_required","sso_redirect_url":"https://auth.staging.shopview.com/login?return_to=…"}` |
| `POST https://api.staging.shopview.com/api/quick-login {"key":"admin"}` | **HTTP 401** — the **identical** `sso_required` body. Confirms on **staging** what §A already proved on `sv9500api`: quick-login is itself SSO-gated and is **not** a way in from a cold jar |
| Following the `sso_redirect_url` to `https://auth.staging.shopview.com/login?...` | **HTTP 200 — the real Google sign-in page** (`accounts.google.com`, `hd=shopview.com`, `prompt=select_account`). Exactly the §A root cause: **a staging session is mintable only by a human SSO login or by the QA lead handing over a cookie set** |

**Why no fallback was tried:** `/tmp` held **no cookie file at all** (`/tmp/qa-cookies/`,
`/tmp/staging-cookie.txt`, `/tmp/cln/cookies.json` — none present; `/tmp` is per-container and this was
a fresh one), and §A records that `POST /api/login {username,password}` is **prod-only** and answers the
same `sso_required` 401 on staging. **This is the state `build/BLOCKED-shopview-app-session.md` already
describes — re-confirmed live on 2026-08-31, not a new blocker.** The unblock is unchanged: a fresh
three-cookie set for `app.staging.shopview.com` from the QA lead, into `/tmp` only.
**🆕 SUPERSEDED IN FORM, 2026-09-03 — the paragraph above is kept as the dated 2026-08-31 record.** The
unblock is now **DECIDED and per-need**: the QA lead drops a live **`sv_sso_session`** (plus
`cf_clearance` if Cloudflare demands it) into `/tmp`, `chmod 600`, **when a NAMED piece of work needs
staging** — **a cookie, never a password** (the password route was tested 2026-09-03 and is closed).
See §A *"HOW A STAGING SESSION IS OBTAINED"* and `build/BLOCKED-shopview-app-session.md`.

### 🛑 HOW THE 28 `❌` ROWS GET FIXED — **PIGGYBACK, NEVER A DEDICATED PASS** (Rule 78, recorded 2026-09-03)

**THE RULE, in one sentence: any pass that gains a working staging session re-observes THE ROWS IT
ACTUALLY USES and stamps them in the SAME pass — nothing more, nothing less.** There is no
re-observation project, and there is not going to be one.

**Why it is written this way.** All 28 rows are **staging** paths, and staging is currently
unreachable (register row **R1**, narrowed 2026-09-02 — a staging session cannot be self-minted; QA
branches are no longer blocked but they are a different host and do not warrant these rows). So a
dedicated re-observation pass **cannot run at all today**, and the moment one could, it would be
spending a whole spawn on routes nobody had asked for. **Rule 78 says the opposite: piggyback the
cheap check onto the next substantive worker.** Rule 93 says whatever you solve gets written into the
playbook **in the same pass**, not queued.

**What a session must actually do — four steps, and only for rows it touches:**

1. **Use the `❌` row as a starting point.** It is a lead, not a licence.
2. **🛑 A `❌` ROW IS NOT EVIDENCE.** It was recorded before the navigation-map convention existed
   (2026-08-31), nobody has re-walked it, and **its committed date is the date the TEXT was written,
   not the date the path was observed** — do not back-fill one from git history (Rule 12: verified
   means observed, never inferred). **Never cite a `❌` row as a build-verified route, never quote its
   labels into a case's preconditions, and never let it stand behind a Verified/Pass verdict.**
   Skill `03-RUN-CHECK.md` §9 tells sessions to reuse recorded routes — **this is the boundary on that
   reuse.**
3. **If the row WORKS: stamp it, in the same pass.** Replace all four right-hand cells —
   **branch + build marker · today's date · a ✅ badge · your session** — commit the stamp with the
   work it came from. Badges: **✅ ≤7 days · 🟠 8–14 days · 🔴 >14 days · ❌ never observed / unknown.**
4. **If the row FAILS: correct it, in the same pass, and commit the correction** (Rule 93). A
   known-wrong path left for the next session is worse than an unbadged one — it is a route that reads
   as authoritative and sends a manual tester somewhere that does not exist. Say what it actually is
   now, and stamp the four cells the same way.

**Do NOT re-observe a row you did not use.** Walking all 28 "while you are in there" is exactly the
dedicated pass this rule exists to avoid — and a row observed to satisfy a checklist, rather than
because a piece of work needed it, is the kind of stamp that goes stale unnoticed.

**Consequence, stated so nobody is surprised:** the map will improve **unevenly** — the rows real work
touches go ✅ and the rest stay ❌ indefinitely. **That is the intended outcome, not a gap.** A row
nobody has needed in months has not earned a spawn.

**Register row: `NAV-3` (opened 2026-09-02), authorised and recorded 2026-09-03.**

---

