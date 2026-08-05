# FINDINGS — Chris Ward's three new requirement items, live pass 2026-08-05

**Build:** `v3.5-16cf83f` · last-modified Wed, 05 Aug 2026 06:40:32 GMT · etag
`177c59546701e7810b894492dabc1423` — read at the start and again before the writes, **identical both
times**, so nothing redeployed under this pass.

**⚠️ The branch `sv8582` is still NOT declared final. Every verdict below is PROVISIONAL** (Rule 49)
and queued in `RECHECK-QUEUE.md`.

---

# 0 · READ THIS FIRST — what this pass could and could not observe

| Asked for | Status |
|---|---|
| All six specifications re-read live, versions recorded, deltas verdicted per requirement | **DONE** — `SOURCE-CURRENCY.md`, `SPEC-DIFF.md`. Six deltas, six verdict rows, totals reconciled. |
| Enumerate every link in all six reports and give every surface a verdict | **DONE** — `LINK-SURFACE-MATRIX.md`. Seven links on four reports; nine surfaces verdicted; every N/A carries its reason. |
| **Item 1 — the WIP filter scope, verified live** | **DONE, and it produced a real defect.** §2 and §3. |
| **Items 2 and 3 — the link rule's NEGATIVE half, verified live per drill-down, with a positive control** | **NOT DONE. Nothing was observed on screen this pass at all.** §4 explains exactly why and what would unblock it. **This is the one thing the brief asked for that this pass did not deliver, and it is an access problem, not a seeding problem.** |
| Reset every in-scope role to template and record the diff | **NOT DONE, deliberately — no role was driven, so there was nothing to reset.** All eleven roles were READ and recorded; nothing was modified. `ROLE-RESET-LOG.md`. |
| Author the missing coverage | **DONE** — 3 new cases, 4 case repairs, 9 marker corrections. |
| File user-facing defects found live | **DONE** — SV-8907 and SV-8908. `FILED.md`. |

**The honest headline: the two link items were answered from the DOCUMENTS, which under Rule 57 is
where the expected behaviour has to come from anyway. What is missing is the pass/fail VERDICT, not the
expectation.** The three new cases say so on themselves.

---

# 1 · THE LINK SWEEP — seven links, and the negative half was covered nowhere

Full matrix in `LINK-SURFACE-MATRIX.md`. In one line: **all 735 numbered requirements across the six
live specifications were swept for `link`, `clickable`, `navigate`, `opens`, `drill`, `href`,
`target=`, and every non-anchored prose block was swept again.** Result — **seven** navigable elements,
on **four** of the six reports; **Parts Velocity and Inventory Value have none at all**, proven rather
than assumed.

**Across all seven, the positive half is covered and the negative half was covered nowhere.** The
previous worker reported this; it is confirmed here from the case text, not taken on trust.

**And one existing case pointed the wrong way.**
**C30100** — *"Opening an invoice you lack permission for shows access-denied; back works"* — tests the
user **clicking through** to an access-denied page, which is what SBC's **S9-N2** says. The **new
S9-R1a says that user has no link to click.** Both are live in SBC v15. **The case was flagged, not
flipped** (`SPEC-DIFF.md` §3).

---

# 2 · ITEM 1 — THE WIP FILTER SCOPE **IS** MET, AND IT IS MET BY A MECHANISM THE SPEC DOES NOT DESCRIBE

**The requirement (WIP v9 S7-R1, verbatim):** *"…a multi-select listing the advisors present **across
all open jobs in the current scope (the report loads the complete set of open jobs in one request)**"* —
same clause on S7-R2 (customers) and S7-R4 (assets).

## 2.1 · The option lists come from their own endpoint, and they are complete

Chris asked us to *"filter by a customer/advisor/asset whose jobs would be far down the list — confirm
the result is complete, never a partial 'loaded subset'."* Done exhaustively, both directions, no
sampling:

| Dimension | Distinct values on the report (all 392 rows, all four tabs) | Values the filter offers | On the report but NOT offered | Offered but not on the report |
|---|---|---|---|---|
| **Advisor** | 15 | **15** | **0** | **0** |
| **Customer** | 215 | **215** | **0** | **0** |
| **Asset — by unit number** | 172 | **172** | **0** | **0** |
| **Asset — by identification number** | 279 | **273** | **6** | 0 |

So for advisors, customers and unit numbers the lists are **exactly the union across every row of every
tab, set-equal in both directions.** They are not derived from the loaded page — they come from a
**separate server endpoint**, `GET /api/reporting/reports/work-in-progress/filters`, which the
specification never mentions.

## 2.2 · But the parenthetical explanation is wrong: the report DOES paginate

The clause says the report *"loads the complete set of open jobs in one request"*. It does not.

| Probe | Result |
|---|---|
| Default request, Approved – Partially Completed | **100 rows** returned, with `pagination: {page: 1, rowsPerPage: 100, rowsNumber: 116}` |
| `page=2`, `rowsPerPage=500`, `offset`, `skip`, `limit`, `perPage`, `pageSize`, `size`, `all=1`, `paginate=0` | **all ignored** — still page 1 of 100 |
| `pagination[page]=2` (bracket form) | **honoured** — rows 101–116 |
| `pagination[rowsPerPage]=500` | **honoured** — all 116 in one response |

**So the report is paginated in pages of 100 and the front end must ask for more.** The requirement's
*substance* (the option lists span all open jobs) is met; its *stated mechanism* is not.

**This matters for the test cases and it is why they were written the way they were:** the three
repaired cases assert **what the tester can see** — that an advisor, customer or asset whose jobs sit
far down the list is still offered and still filters completely — and they do **not** assert "one
request", which is an implementation claim a manual tester cannot check and which the build does not
meet.

**Recorded as an observation, NOT filed:** the pagination point is a **wording problem in the
specification**, not a product defect. Chris is the one to fix it. It is in the outstanding list.

---

# 3 · ITEM 1 PRODUCED A REAL DEFECT — the Asset filter drops assets that share a unit number

**Filed as [SV-8908](https://shopview.atlassian.net/browse/SV-8908).**

The asset option list holds **exactly one entry per unit number** — 172 unit-numbered entries for 172
distinct unit numbers, plus 106 entries for assets with no unit number, identified by their
identification number: **278 in total.** Where two different vehicles share a unit number, **only one is
listed**, and the listed entry carries only that one's identification number.

**Five unit numbers on this data carry more than one vehicle**, so **six vehicles are missing from the
filter and their identification numbers match nothing typed into it:**

| Unit | Offered | Missing | Work orders carrying the missing vehicle | Customer |
|---|---|---|---|---|
| **854** | `5SHFE4730MB001604` | `1HTKTSWK4RH442544` | S8582-15742, S8582-11992 | Euwood Paving |
| **4** | `1NKDX4TX0CR955991` | `3HTMMAAP19N045446` | S8582-15133 | Iowell Works |
| **4** | `1NKDX4TX0CR955991` | `54DC4W1C2GS805134` | S8582-15668 | Auline Consulting |
| **1** | `5KJJALD1XEPFP2932` | `54DC4W1B9ES801599` | S8582-15544 | Auline Consulting |
| **80** | `1XKWDR9X2WJ949172` | `5KKPALDV3DPBY2035` | S8582-14030 | Suman Solutions |
| **B104** | *(the entry shows no identification number at all)* | `5100036463` | S8582-15391 | Kabridge Enterprises |

**Against S7-R4 verbatim** — *"listing the assets present across all open jobs in the current scope…
the user's typed text matches against EITHER the unit number OR the vehicle identification number"* —
both halves fail for these six: the asset is not listed, and its identification number matches nothing.

**Why it is quiet rather than loud:** the filter *looks* like it works. Type `854`, get a result. Nothing
tells you a second truck with that number exists and has been left out.

**C30500 now carries this as a known issue and is marked `READY - EXPECT FAIL (SV-8908)`.**

---

# 4 · ITEMS 2 AND 3 — WHY THE NEGATIVE HALF WAS NOT OBSERVED, AND WHAT WOULD FIX IT IN MINUTES

**This is the shortfall. It is stated plainly rather than worked around, because Rule 12 forbids
substituting inference to appear complete.**

## 4.1 · No user on this system has the combination the rule needs

All eleven roles were read live (`evidence/roles-permission-sets.json`):

| Role | Permissions | Holds `reportsPageAccess` | Holds `workOrdersView` |
|---|---|---|---|
| Admin | 42 | yes | yes |
| Service Manager | 36 | yes | yes |
| Office User | 25 | yes | yes |
| Parts Manager | 31 | yes | yes |
| **Sales Representative** | **8** | **yes** | **yes** |
| Parts Technician · Senior Service Advisor · Service Advisor · Technician · Foreman · Time Clock User | 19 · 31 · 25 · 6 · 23 · 3 | no | yes |

**Every single role holds `workOrdersView`.** So *"reports access and no work-order access"* — the exact
state items 2 and 3 turn on — **is held by nobody**, and the same is true for the part-sales and
customers variants.

## 4.2 · Rule 14 says seed it. Here is every route tried, and why each is closed

| Route | Outcome |
|---|---|
| **Create a purpose-made custom role and assign it** | Possible in principle — but it only helps if we can then *be* that user, which is where it fails below. Nothing was created, because creating a role that could not be used would have left litter on an organisation two other workers are using. |
| **Impersonate with `POST /api/switch-user`** | The endpoint is alive — probed **safely** with a non-existent id, which returned HTTP 401 *"Invalid credentials."* and left our session untouched (verified: still `administrator`, 42 atoms). **But it acts on the session you present, and the only documented way back is `quick-login`, which is barred.** Using it would have left this session signed in as a low-permission user **with no way to return**, on a session **two other workers share**. |
| **Create a fresh staff member and sign in as them** | A new staff member must confirm an invitation by email, and no email is reachable from here. The staff record carries no invitation token (all 24 fields read). |
| **Set or reset a password as an administrator** | Not built — that is SV-8225, still Open. |
| **Sign in with a real password** | No application credentials are available to this run at all. |
| **Open the front end with the raw cookies** | Tried. The application **bounces to `/login`**: it decides whether you are signed in from a `user` payload in browser storage that only a login response produces. There is no endpoint that returns it — `/api/auth/me`, `/api/users/me`, `/api/auth/session`, `/api/sso/check` and three more all return 404 or 405. |
| **Hand-build that payload so the front end lets us in** | **Refused on principle.** Fabricating session state and then reporting what the screen showed would be observing our own edit, not the product (Rule 12). |

**⇒ This is an ACCESS blocker, precisely characterised — not a data-state blocker, and not something
seeding can solve.** Rule 14's "never block on data you can create yourself" does not reach it.

## 4.3 · What is needed — and it is small

**Any ONE of these unblocks all four negative cases in about ten minutes:**

1. **Authorisation to call `quick-login`** on this branch (the coordinator barred it to protect a shared
   session; if the other two workers are finished, the objection disappears), **or**
2. **a second real sign-in** — email and password — for a user with reports access and without work
   orders / part sales / customers, **or**
3. **one live check by a manual tester** who already has two accounts: open Work In Progress as the
   second user and look at the WO # column.

## 4.4 · What WAS established at the API layer, and why it does not substitute

The drill-down payloads return the link targets **unconditionally**:

| Report | Endpoint | Target fields returned |
|---|---|---|
| SBC | `…/sales-by-customer/{customerId}/assets/{assetKey}/invoices` | `invoice_id`, `work_order_id`, `work_order_type` (`service`/`parts`), `invoice_number` |
| SBR | `…/sales-by-representative/{repKey}/invoices` | the same plus `customer_id`, `customer_name`, `payment_status` |
| WIP | `…/work-in-progress` | `work_order_id` on every row |

**So the link/plain-text decision is made in the browser, not by the server.** Two consequences,
stated so nobody has to re-derive them:

* **The negative half cannot be verified from the API at all** — only on screen. That is why §4 is a
  genuine blocker and not laziness.
* **Under Rule 24 the unconditional id is NOT a defect.** An identifier sitting in a payload is not an
  action, and there is nothing here of the "front end blocks, back end allows" shape. **Nothing was
  filed on this, and nothing should be.**

---

# 5 · THE EXPORT SURFACES — proven N/A, and one broken download found on the way

**PDF.** The live Sales By Customer summary PDF (**268,586 bytes**) contains **`/URI` × 0, `/Link` × 0,
`/Annots` × 0, `http` × 0.** There is no hyperlink of any kind in a report PDF, so a rule about *when*
something is a link cannot apply to it. **Evidence-backed N/A, not an assumption.**

**CSV.** The live SBC *expanded* CSV carries an `"Invoice #"` column holding bare values — `S-16244`,
`S-16245` — with no markup, for every user. **N/A by format.**

## 5.1 · ⚠️ AND THE WORK IN PROGRESS DOWNLOAD IS BROKEN — filed as [SV-8907](https://shopview.atlassian.net/browse/SV-8907)

Found while checking the export surface. **Every non-empty tab fails; only an empty tab succeeds:**

| Date range | Tab | Rows | CSV download |
|---|---|---|---|
| 1–5 Aug 2026 | Approved – Partially Completed | 0 | **HTTP 200**, 109 bytes, heading lines only |
| 1–5 Aug 2026 | Approved – Not Started | 1 | **HTTP 500** |
| 1–5 Aug 2026 | Completed | 1 | **HTTP 500** |
| 1–5 Aug 2026 | Estimates | 62 | **HTTP 500** |
| 1 Jan – 4 Aug 2026 | all four | 63 / 28 / 12 / 139 | **HTTP 500** on all four |

**PDF fails identically.** The other five reports export fine on the same build (SBC csv 200 / pdf 200,
IV csv 200, PV csv 200, TU csv 200, SBR csv 200). Input validation still works correctly (a bad column
gives a polite 400), so the request is accepted and then fails.

**It is not the known PDF-size defect SV-8818** — that one is PDF-only, size-dependent, and explicitly
on *the other five* reports. This is Work In Progress only, both formats, and it fails with a single row.

**It looks like a regression:** the identical request shape returned a populated file on 2026-08-03 —
our own captured `wip__Completed__SINGLE__default.head.txt` begins with a real data row, `S2-15856`.
That capture is from an earlier build **and an earlier data snapshot**, so the change of data cannot be
completely excluded, and the ticket says so rather than overclaiming.

**Nine WIP export cases now carry `READY - EXPECT FAIL (SV-8907)`.**

---

# 6 · ONE MORE THING FOUND, REPORTED NOT FIXED

**Parts Velocity S1-N1 still describes the old role-based access model**, verbatim: *"Users without the
Manager or Office User role cannot reach the Reports section…"* — while **S1-R4 in the same version**
says access is *"the single reports permission — the one permission that grants access to all
reports; there is no per-report permission."* Read live from all eleven roles, the build agrees with
**S1-R4**: `reportsPageAccess` is one atom, held by five roles including Sales Representative, which is
neither Manager nor Office User.

**Not changed by this pass** — no case cites S1-N1, it is outside the three items, and it is Chris's
text to correct. It is in the outstanding list.
