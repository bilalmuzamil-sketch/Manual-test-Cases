# Schedule build verification — 2026-08-11

## 🔴 THE HEADLINE

**0 of 174 build-verified. 174 remain unverified.**

**The session was ALIVE this time and the token worked. The blocker is different, it is new, and it is
not Schedule's:** signed in as `admin@shopview.com`, **every route in the application redirects to
`/administration/locations`**, so **no page of the product can be observed at all** — not Schedule,
not Work Orders, not Customers, not Reports, not Parts.

**Nothing was faked to get around it, on the QA lead's explicit instruction** (see §2).

**0 TestRail writes · 0 Jira calls · 0 environment changes.**

---

## 1 · THE BUILD AND THE LOCATION — both named, per the QA lead's standing instruction

| | |
|---|---|
| **App version** | **`v3.5-65d6500`** |
| **`index.html` last-modified** | **Tue, 11 Aug 2026 09:33:33 GMT** |
| **etag** | `3250d285ffcf50626363a578fe273071` |
| **Read at** | pass **start** and pass **end** |
| **Moves during the pass** | **0** — last-modified and etag byte-identical both reads |
| **Location used** | **`Staging Heavy Duty - 9919`** (`b3c8c820-f815-4cf1-8938-10956c5ee71a`, America/Edmonton) |
| **Account** | `admin@shopview.com` (Admin) |

**The location instruction was complied with, and it is worth being precise about what that means
here.** `POST /api/iam/change-location` was called with the Heavy Duty workplace id and returned
**HTTP 200**; the top bar rendered **`Staging Heavy Duty - 9919`**; `localStorage.location` and
`current_shop_id` both held the Heavy Duty id. **No observation in this pass was taken on any other
location** — and the honest reason that claim is easy to make is that **no observation of the product
was taken at all.** Nothing here needs re-attributing to a different shop.

### Session probe — the first action, as instructed

The supplied `sv_sso_session` was **byte-identical to the one that died last attempt**, so it was
probed first, against the **API** host (never the app host, which returns 200 on any path):

```
GET https://sv8685api.qa.shopview.com/api/auth/me/fe-permissions  →  HTTP 200
```

**Alive.** Header construction was validated before use — the file holds **exactly three
`name=value` pairs** and **no `Cookie: ` prefix**, the two faults that have cost previous passes.
`quick-login` and `switch-user` were **never called**.

---

## 2 · THE BLOCKER — app-wide, diagnosed rather than assumed

Five routes were requested. **All five landed on the same place:**

| Asked for | Landed on |
|---|---|
| `/schedule` | `/administration/locations` |
| `/workorders` | `/administration/locations` |
| `/customers` | `/administration/locations` |
| `/reports` | `/administration/locations` |
| `/parts` | `/administration/locations` |

**So this is not a Schedule guard and not a permission problem.** Both alternatives were ruled out
by measurement, not by reasoning:

- **Permissions are present.** `fe_permissions` carries **`scheduleView`, `scheduleCreateAndEdit`
  and `scheduleDelete`**, 42 permissions in total, `view_mode: full`.
- **The cause is the account's own configuration.** `admin@shopview.com` genuinely has
  **`default_workplace: null`** and **`workplace_id: null`** on its staff record (read live from
  `/api/staff`). The SPA's router treats that as "no location chosen" and forces the Locations page.

**Two legitimate routes past it were tried, in the app, and neither worked:**

1. **In-app navigation** — clicking the `Schedule` nav item rather than a hard page load. Clicked
   successfully; still landed on `/administration/locations`.
2. **The app's own top-bar location switcher** — opened it and **selected `Staging Heavy Duty - 9919`
   through the UI**, exactly as a tester would. Both steps succeeded (`switcher opened: true`,
   `picked: true`). **Still bounced.** So the switcher sets the session's active workplace but does
   **not** satisfy the guard, which reads the staff record's `default_workplace`.

### What was deliberately NOT done, and why

**A default workplace was NOT seeded, injected, or set.** The brief barred it and the QA lead's
standing instruction, which arrived during this pass, bars it in his own words:

> *"Do NOT seed or fake your way around a location bounce. A pass that seeded a default workplace to
> get past the `/no-location` redirect produced a false 'this defect is fixed' reading — its own setup
> had created the evidence. If the app bounces you, report it rather than engineering around it."*

**There was a tempting third option and it was rejected on purpose:** setting a real default
workplace on `admin@shopview.com` through the Staff admin endpoint. That is not seed-faking — it
would genuinely configure the account — but it **changes a shared account another worker may be
signed in as**, and it is a configuration decision the QA lead owns, not a test step. It is put to
him below instead.

---

## 3 · WHAT WAS ESTABLISHED ANYWAY

### 3.1 The click-to-arm check is **still unanswered** — and the earlier reading was invalid

The single highest-value check (**7 cases** held only because a drag cannot be completed and the
click alternative was removed per **SV-8957**) **could not be made.** The first harvest reported
`html_has_arm: false`, **but that reading was taken on `/administration/locations`, not on the
Schedule page, so it is worthless and is recorded here as invalid rather than quietly used.** An
absence measured on the wrong page is not an absence.

### 3.2 The Panel collapse re-confirmation (C43582–C43587) is **still owed**

Their stamp names `v3.5-af3a6e1`, which is superseded. Their plain `AUTOMATION: READY` marker and
their record-what-you-find note were **left exactly as they are** — correct and deliberate, not
turned back into a prediction.

### 3.3 Hygiene — re-censused live this pass, not carried forward

Measured from a fresh live read of all 174 cases (**not** from the previous pass's numbers, because
TestRail re-renders text into HTML hours after a write without moving `updated_on`):

| Check | Result |
|---|---|
| **Raw markup** | **0 of 174** (all four text fields) |
| **Automation markers** | **174, exactly one each** — `READY` **146** · `HOLD` **28** |
| **Gate** | **146 = 174 − 28 ✓** (passes both ways) |
| **Provenance lines** | **174, exactly once each** |
| **Build stamps** | **174** |
| **`custom_atmstatus`** | **1 on all 174 — none Automated** |

**No case's verdict rests on the build now running**, and the split is unchanged:
**90 on `v3.5-7ec992f` · 78 on `v3.5-d122eef` (which no longer exists) · 6 on `v3.5-af3a6e1`.**

### 3.4 A tooling gotcha worth recording

`/tmp/trlib.py`'s `getall()` appends **`?limit=…`** when the path contains no `?`. But the TestRail
URL is `index.php?/api/v2/…`, which **already has one**, so every paginated call became a
double-`?` and returned **HTTP 400**. `get_case` was unaffected (no pagination), which is why it
looked like a partial outage. **Pagination on this API must use `&`, always.** Belongs in the
playbook; not edited from here.

---

## 4 · PROOFS

- **All 174 cases byte-identical** to the pass-start snapshot — every field compared, `updated_on`
  and `updated_by` included: **0 field differences across 174 cases.**
- **Run 357 (Ayesha's) proven untouched BY CONTENT**, not by timestamp:
  `include_all` still **false** · **174 tests** · **test-id and case-id sets equal in BOTH
  directions** · **458 result records, all present by ID, 0 missing, 0 new, 0 field changes** ·
  counters unchanged **25 Passed / 0 Failed / 1 Blocked / 148 Untested**.
- **Jira: 0 calls of any kind.** The ticket-creation hold stands untouched.
- **Environment: nothing seeded, created, modified or restored** — no data, no role, no setting, and
  **no default workplace**. `change-location` is a session-scoped call that leaves no residue.

---

## 5 · WHAT IS NEEDED — one thing, and it is not a token

**A way to reach the application as a user who has a default workplace, on `Staging Heavy Duty - 9919`.**
Either of these unblocks the whole pass; both are the QA lead's to give:

1. **Set a default location on `admin@shopview.com`** (Staff admin → default location →
   `Staging Heavy Duty - 9919`). One field, done in the product's own UI. **Deliberately not done by
   us** — it alters a shared account, per §2.
2. **Or name a QA user that already has one**, with a sign-in for it.

**Do not send another `sv_sso_session` on its own — the token is not the problem this time.** It
worked, and it is still returning HTTP 200 at the end of this pass.

Once past the bounce the remaining work is **roughly an hour and is mechanical**: the label
check-list is built and partitioned (`evidence/labels.json`, `evidence/partition.json`), the diff
tool is written (`tools/diff_labels.py`), and the harvest scripts reach and dump the page in one
run — they simply have nowhere to land today.
