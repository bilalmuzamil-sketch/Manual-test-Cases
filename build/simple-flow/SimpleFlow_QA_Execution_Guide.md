# Simple Flow — QA Execution Guide

> **What this is.** A standalone, pick-up-and-run guide for a manual QA tester
> executing the **159 Simple Flow test cases** (ShopView Simple Mode —
> Streamlined Work Order Completion & Receiving, **Epic SV-7301**). It covers how
> to get into the environment, which accounts you need, how to set the Work Order
> settings for each completion flow, how to seed the test data each group of cases
> needs, and how to clean up afterwards.
>
> **The cases themselves** live in `build/simple-flow/cases/*.json` and in the
> workbook `SimpleFlow_V1_TestCases.xlsx` / `.csv`. This guide is the "how to
> prepare and run them" companion. A one-glance settings matrix is also provided
> as `SimpleFlow_Settings_QuickReference.xlsx`.
>
> **Grounding.** Everything here is taken from the spec
> (`build/simple-flow/requirements.md`), the confirmed live findings on the QA env
> (`build/simple-flow/viu-findings.md`, verified 2026-07-06), the design catalog
> (`build/simple-flow/design-notes.md`), and the proven navigation recipes in
> `build/APP-ACTIONS-PLAYBOOK.md`. Routes marked "confirmed" were walked live.
>
> **No credentials in this document.** You supply your own login (see §1). Never
> paste cookies, tokens, or passwords into this file or any committed file.

---

## Case inventory at a glance

**159 cases**, in three group files:

| Group file | Count | Areas (case-ID prefixes) |
|---|---|---|
| `group-A-settings-completion.json` | 56 | Settings (`SF-SET`), Completion flows (`SF-COMP`), Cores (`SF-CORE`), Tech story (`SF-TECH`) |
| `group-B-receiving-vendor.json` | 55 | Vendorless part (`SF-VPART`), Vendor Missing (`SF-VMIS`), PO multi-select (`SF-POSEL`), Bulk Receive (`SF-BULK`), Apply-invoice (`SF-INV`), Part-number fix (`SF-PNFIX`), Receive on WO (`SF-RCV`), Assign vendor (`SF-VEND`), Waiting-on-Parts (`SF-WOP`) |
| `group-C-review-permissions-validation-edge.json` | 48 | Review (`SF-REV`), UX (`SF-UX`), Permissions (`SF-PERM`), Validation/edge (`SF-VAL`), QuickBooks/Inventory (`SF-QB`) |

---

## 1. Environment & access

1. **QA app URL:** `https://sv7301.qa.shopview.com`
   (This is the dedicated Simple Flow QA/POC environment.)

2. **API host (reference only — you do not normally hit it by hand):**
   `https://sv7301api.qa.shopview.com` (note: `sv7301api`, no dot). A few cases
   (`SF-QB-*`, `SF-SET-12`, `SF-PERM-06`) check backend behaviour; for those a
   developer or a tester with API access reads
   `GET /api/organizations/settings` to confirm the saved settings object. You do
   **not** need the API for the vast majority of the cases.

3. **How to log in.** Open the QA app URL in a browser and sign in with **your
   own** ShopView QA credentials. If you do not have a QA account, request one
   from the Simple Flow dev/QA owner (Milos Vasic) — ask specifically for an
   **Admin** account and, ideally, a **second non-admin account** (see §2).
   *Do not put any credential into this document or any file in the repo — keep it
   in your own password manager only.*

4. **Shared, actively-developed environment — behave accordingly.**
   - This is a **shared DEV/QA environment under active development.** Other
     people (and other automated sessions) may be working in it at the same time.
     Data may appear or change unexpectedly. If something looks wrong that you did
     not cause, note it and move on rather than assuming a bug.
   - **Tag every throwaway record you create with `ZZAUTOTEST`** (in a name,
     description, or customer field where possible) so it is easy to find and
     delete.
   - **Clean up after yourself** (see §6) — delete the work orders, parts, and POs
     you created.
   - **Settings are org-wide.** When you change a Work Order setting you change it
     for *everyone* using this org. Always reset to the baseline between flow
     variants (see §3) and at the end of your session.

5. **Baseline settings captured on the env (2026-07-06)** — use this as your
   "known good" reset point:

   | Setting | Baseline value |
   |---|---|
   | Auto-approve Lines | ON |
   | Require Vendor Invoice Number | OFF |
   | Require Review Before Completion | OFF |
   | Require Tech Story | ON |
   | Require Mileage | ON |
   | Require Engine Hours | OFF |
   | Automatically Pick Inventory Parts | ON |
   | (VIN / vehicle identifier — server field, not a WO-settings toggle) | required |

---

## 2. Accounts & roles needed

The permission cases (`SF-PERM-*`) and the review cases (`SF-REV-*`) exercise the
role matrix defined in the spec **§9 (from Jira SV-8183)**. Simple Flow adds **no
new permission** — every action maps to an existing Custom Roles atom.

**Roles referenced by the cases** (system-role defaults from §9.2):

| Role | Can it… complete WO? | edit settings? | bulk receive? | mark reviewed? | Used by cases (examples) |
|---|---|---|---|---|---|
| Admin | Yes | Yes | Yes | Yes | Almost all cases run as Admin |
| Service Manager | Yes | Yes | Yes | Yes | `SF-PERM-01/02/03/04`, `SF-SET-11` |
| Senior SA | Yes | No | Yes | Yes | `SF-PERM-02` |
| Service Advisor | Yes | No | Yes | Yes | `SF-PERM-02`, `SF-PERM-08` (completer) |
| Foreman | Yes | No | Yes | Yes | `SF-PERM-04/07`, `SF-REV-09`, reviewer role |
| Parts Manager | Yes | No | Yes | Yes | `SF-PERM-03` |
| Technician | **No** | No | No | No | `SF-PERM-09/10`, `SF-VPART-02` (no See Financial Data) |
| Parts Tech | **No** | No | Yes | No | `SF-PERM-03/05` |
| Office | **No** (view-only) | **Yes** | No (view-only) | No | `SF-PERM-01/05`, `SF-RCV-03` |
| Sales Rep | No | No | No | No | `SF-PERM-10` (negative) |
| Time Clock | No | No | No | No | `SF-PERM-10` (negative) |

Most of the 159 cases run entirely as **Admin**. You only need other roles for
the role-gating cases. Read each case's `permissions_required` field for its exact
requirement.

### Two hard dependencies — call these out before you start

**(a) Role-gating negatives need a working NON-ADMIN login.**
Cases that check "role X cannot do Y" — `SF-SET-11`, `SF-PERM-01/02/03/04/05/07/09/10`,
`SF-RCV-03`, `SF-REV-09`, and the permission half of `SF-VPART-02` — require you to
log in as a **non-admin** role and confirm the action is blocked/hidden.

> **BLOCKER on this env:** the built-in **tech quick-login returns 403** on
> sv7301, and only the admin session is currently obtainable
> (per VIU findings). **Until a real non-admin QA credential is provided, all
> role-gating negatives are BLOCKED** — mark them **Blocked** (not Failed) and
> record "no non-admin login available on sv7301." Ask the dev/QA owner to
> provision a non-admin account (e.g. a Technician, a Parts Tech, an Office user)
> to unblock them.

**(b) The reviewer ≠ completer case (`SF-PERM-08`) needs a SECOND user.**
Simple Flow's one net-new *rule* (not a permission atom) is that **the person who
completed / sent a WO to review cannot be the same person who Marks it Reviewed**
(the backend stamps `sentToReviewBy` / `completedBy`). To test `SF-PERM-08` you
need **two distinct users**:
   - **User 1 (the completer)** — any role that can complete / Send to Review
     (e.g. Service Advisor or Admin) — sends the WO to review.
   - **User 2 (the reviewer)** — a *different* user who **has the Review Work
     Orders permission** (e.g. Foreman or Service Manager) — attempts Mark
     Reviewed.

   Expected: User 1 is blocked from Mark Reviewed on that WO; User 2 can sign off.
   This case is **blocked until a second, review-capable account distinct from the
   completer is available.**

---

## 3. Settings quick-reference

**Where to set them (confirmed route):**
Sign in as Admin → go to **`/administration/settings`** → click the **Work Orders**
tab → toggle the settings → click **Save Settings**. Changes persist org-wide and
apply to **future** completions only (never retroactively). Reload the page to
confirm a change stuck.

**The seven Work Order toggles** (confirmed present, in this order):

1. **Auto-approve Lines** — ON: each line is approved the moment it is added.
   OFF: new lines land in "Needs Approval" with Approve/Decline.
2. **Require Vendor Invoice Number** — ON: parts must be received and an invoice #
   captured before the WO can complete (drives the **Required** flow). OFF:
   complete now, receive later (**Optional** flow).
3. **Require Review Before Completion** — ON: completing sends the WO to a review /
   sign-off gate (Story 16) before it can be invoiced.
4. **Require Tech Story** — ON: every line needs a tech story before completion
   (drives the Story-17 tech-story gate modal).
5. **Require Mileage** — ON: mileage is a required field at completion.
6. **Require Engine Hours** — ON: engine hours required at completion.
7. **Automatically Pick Inventory Parts** — ON: in-stock parts auto-picked. OFF:
   you pick parts inside the completion modal.

> **Known deviation (do not raise as a new bug):** the spec's **"Create Purchase
> Orders" toggle is NOT present** on this env, and the settings model has no
> `createPurchaseOrders` field — **POs are effectively always-on.** This means the
> pure **"No-PO / skip" configuration cannot be set up** here. See §4 and §6.

### Completion-flow → toggle matrix

Set the toggles exactly as below for each flow variant, **Save**, then run that
flow's cases. **Reset to the §1 baseline between variants.** (This matrix is also
in `SimpleFlow_Settings_QuickReference.xlsx`.)

| Flow variant | Auto-approve Lines | Require Vendor Invoice Number | Require Review | Require Tech Story | Require Mileage | Require Engine Hours | Auto-pick Inventory | Notes / what you should see |
|---|---|---|---|---|---|---|---|---|
| **A. No-PO / skip completion** | ON | OFF | OFF | OFF (unless testing tech-story) | ON | OFF | ON | Spec intent = "Create POs OFF ⇒ no PO at all." **NOT configurable on this env** (no Create-POs toggle). Approximate with a **no-parts / labor-only WO**, which completes in one confirm to the Success screen. Cases: `SF-COMP-02/03/04`, `SF-QB-02`. |
| **B. PO + Optional vendor invoice** | ON | **OFF** | OFF | OFF | ON | OFF | ON | Part-bearing WO → Complete opens the wizard showing **Cancel · Complete Without Receiving · Receive Parts** and "N parts waiting to receive." Cases: `SF-COMP-11..17`, `SF-CORE-03/04/05/06`. |
| **C. PO + Required vendor invoice (CTA gated until received)** | ON | **ON** | OFF | OFF | ON | OFF | ON | Part-bearing WO → wizard's **Complete Work Order CTA is DISABLED** until all parts are received (invoice # captured); **no "Complete Without Receiving."** Cases: `SF-COMP-18/19/20`, `SF-CORE-07`, `SF-VAL-05`. |
| **D. Require-Review ON (review sign-off gate)** | ON | OFF (or ON — orthogonal) | **ON** | OFF | ON | OFF | ON | Complete relabels to **"Complete & Send to Review"**; WO → **Review** (amber) → Mark Reviewed (captures VIN) → sign-off. Cases: `SF-REV-*`, `SF-PERM-04/07/08`, `SF-VAL-07`. |

**To exercise the tech-story gate** (Story 17 / `SF-TECH-*`), turn **Require Tech
Story ON** on top of any variant above — completion will open the tech-story modal
first.
**To exercise auto-pick-off** (`SF-COMP-08`), turn **Automatically Pick Inventory
Parts OFF** — you must pick parts inside the completion modal.

> **Always reset settings to the §1 baseline** after each variant. Because the
> setting is org-wide, leaving a non-baseline value could confuse the next tester
> or an automated session sharing the org.

---

## 4. Test-data setup recipes

All routes below are **confirmed live** (VIU 2026-07-06) unless flagged. A key
gotcha from the playbook: **an existing WO's detail page bounces back to
`/workorders` on load for every role** — so **always create a fresh WO** to land
reliably on its `/workorders/{id}/lines` detail page.

### 4.1 A Work Order ready to complete
1. Top nav → **Work Orders** (`/workorders`) → **New / New Work Order**.
2. Pick a **Customer** (searchable) and an **Asset** (the customer must have at
   least one asset/vehicle). Tag it `ZZAUTOTEST` where a free-text field allows.
3. **Save** → you land on `/workorders/{id}/lines` (a WO with 0 lines auto-opens
   the New Line dialog).
4. **Add a labor line** — use the canned-line field
   (`select_line_canned_line`); it accepts only existing canned lines. A
   labor-only line shows "Total Parts: 0."
5. **Add a tech story** if Require Tech Story is ON — each line has a Story
   sub-row with an **"Add tech story for this line"** link, or the gate modal will
   prompt you at Complete.
6. **Add a part line** (for the PO / receiving flows) — see 4.2.
7. **Approve the lines.** With Auto-approve ON, lines are approved on add. With
   Auto-approve OFF, each new line shows **"Needs Approval"** — click **Approve**.
   *All lines must be approved before a WO can complete or Send to Review.*
8. Click **Complete Work Order** (next to New Line) to start the flow.

### 4.2 A part line in the states cases reference
Parts move through **requested → ordered → picked / received** states:
1. On a line, **add a part** via the Parts grid.
2. **Order** a vendor/special-order part (blue **Order** button — moves it to
   "waiting to receive") or **Pick** an in-stock part (green **Pick** button).
3. **Receive** the part on a receive surface (§4.4) so it becomes a genuine
   received, numbered part.

**A part WITHOUT a part number (vendorless / no-PN flow, `SF-VPART-*`):**
   - Add a part entering **only description + quantity + sell price**; leave part
     number, cost, and vendor empty. It saves as a **vendorless** part (source
     `vendor` or `found`, never `inventory`).
   - Requires **See Financial Data** (sell price is mandatory, no catalog source)
     — that is why a Technician cannot add one (`SF-VPART-02`, `SF-PERM-09`).

**A part WITH a part number (`SF-PNFIX-02/03`):**
   - Either add a catalogued part, or use the inline **"Missing part number" →
     Edit → enter a number → save** on a no-PN part. A **new** number creates a
     new inventory/catalog part + stock + Part History; an **existing** number
     links to that item.

### 4.3 A Purchase Order flagged "Vendor Missing"
1. Add a **vendorless vendor-part** to a WO (4.2) and complete/order so a PO is
   generated. There is **no dummy PO** — the part sits on the WO's normal PO,
   flagged.
2. Go to **Purchase Orders** — route **`/parts/orders`** (also reachable via
   Parts → Vendors → Purchase Orders tab).
3. Confirm the PO shows a **"Vendor Missing +N"** indicator (confirmed live).
   Cases: `SF-VMIS-*`. Resolve it by assigning a vendor and entering the part
   number (Stories 13 / 10).

### 4.4 Accept-Delivery / vendor-invoice data
1. Route **`/parts/deliveries`** — the shared **Accept Delivery / Vendor
   Invoices** surface (confirmed present; it is the existing multi-vendor screen,
   reused not rebuilt).
2. It groups parts by **vendor**, each group with its own **invoice #, date, tax,
   note, and Receive** action. Enter a vendor invoice number to enable receiving.
3. Reach it from a WO via the per-row **Receive** action on WO-originated POs
   (confirmed present) or via the completion wizard's **Receive Parts** button
   (which round-trips back to the completion modal in the Required flow).
   Cases: `SF-RCV-*`, `SF-COMP-13/19`.

### 4.5 Recipes you CANNOT set up yet (stories not built)
Skip these; the underlying UI does not exist on the env yet (VIU-confirmed
NOT-BUILT). Mark their cases **Blocked / Not-built** and move on:

| Not-built story | Affected cases | Why you cannot set it up |
|---|---|---|
| **Story 7** — PO multi-select + "Receive Selected" | `SF-POSEL-01..06` | No checkboxes / selection bar on `/parts/orders`. |
| **Story 8** — PO Bulk Receive page | `SF-BULK-01..10` | No Bulk Receive page / entry point exists. |
| **Story 9** — per-vendor "Apply invoice to selected POs" | `SF-INV-01..03` | Depends on Stories 7/8. |
| **Story 14** — "Waiting on Parts" column | `SF-WOP-01..03` | Column absent from the WO-list column selector. |

Also note: the **"Create Purchase Orders" settings toggle** (`SF-SET-03`) and
several other spec items have **deviations** — see the case's own `expected`
notes; they are written "expected per spec (currently not met)."

---

## 5. Per-area precondition map

For each case group, prepare the settings + data + role below **before** running
it. (Reset settings to baseline between groups that need different settings.)

| Case area (prefix) | Settings to set | Data to seed | Role | Notes |
|---|---|---|---|---|
| **Settings** (`SF-SET`) | You will toggle each setting as part of the test | None (or a brand-new org for first-use defaults `SF-SET-08`) | **Admin** (owner). `SF-SET-11` needs a non-admin → **blocked** | `SF-SET-03` Create-POs toggle is a known deviation |
| **Completion flows** (`SF-COMP`) | Per §3 matrix (variant A/B/C) | A WO ready to complete (§4.1); part-bearing WO for B/C | Admin | `SF-COMP-06`/`-02` approximate No-PO with a no-parts WO |
| **Cores** (`SF-CORE`) | Optional-invoice (B) or Required (C); Auto-pick ON | A WO with a **core-bearing part** received/awaiting core inspection (hard to seed — see playbook) | Admin | Inventory cores resolve after Pick; special-order cores at receive / invoice gate |
| **Tech story** (`SF-TECH`) | **Require Tech Story ON** | A WO with ≥1 line missing a story | Admin | Gate modal opens before completion |
| **Vendorless part** (`SF-VPART`) | Any (B is convenient) | Add a part with description+qty+sell only | Admin; `SF-VPART-02` also needs a **Technician** (no See Financial Data) → blocked | Requires See Financial Data |
| **Vendor Missing** (`SF-VMIS`) | POs on (default) | A vendorless vendor-part on a WO PO (§4.3) | Admin | `/parts/orders` shows "Vendor Missing +N" |
| **Receiving on WO** (`SF-RCV`) | Optional/Required | A WO-originated PO with parts to receive (§4.4) | Admin; `SF-RCV-03` needs Office/readonly → blocked | Accept Delivery at `/parts/deliveries` |
| **Assign vendor** (`SF-VEND`) | POs on | A Vendor Missing PO (§4.3) | Admin | Merge / keep-separate on Accept Delivery |
| **Review** (`SF-REV`) | **Require Review ON** (variant D) | A WO with approved lines | Admin to drive; `SF-REV-09` needs a role **without** Review Work Orders → blocked | VIN captured at Mark Reviewed |
| **Permissions** (`SF-PERM`) | Depends (D for review perms) | A WO in the relevant state | **Various non-admin roles** + a **second user** for `SF-PERM-08` → mostly **blocked** until non-admin creds provided | See §2 hard dependencies |
| **Validation / edge** (`SF-VAL`) | Per the field being tested (e.g. Require Mileage ON) | A WO missing the required field / an unapproved line | Admin | `SF-VAL-07` (VIN in Mark Reviewed) needs variant D |
| **QuickBooks / Inventory** (`SF-QB`) | Per flow (A/B/C) | Parts that receive → Delivery → Vendor Bill; in-stock parts to decrement | Admin (+ API/dev to confirm QB sync + Part History) | Backend-behaviour cases; may need dev help |

---

## 6. Execution notes

1. **Cleanup (do this every session).**
   - Tag throwaway data **`ZZAUTOTEST`** so it is findable.
   - **Delete the work orders you created:** open the WO → header **⋮ (more)** →
     **Delete Work Order**. (Note: a line cannot be deleted once it is Complete;
     if needed, re-open the WO by adding a line, which returns it to Approved.)
   - Delete any throwaway POs, parts, and vendors you added.
   - **Reset the Work Order settings to the §1 baseline** (org-wide — affects
     everyone).

2. **Result statuses.** Record every result locally. Use **Blocked** (not Failed)
   for anything you cannot run because a non-admin/second account is missing or a
   story is not built. Use **Failed** only when a built feature behaves wrong.

3. **VIU status is internal.** The `viu_status` field on each case
   (VIU-Verified / VIU-Partial / VIU-Pending / Not-built) is internal
   bookkeeping — it is **not** a TestRail status and should not be logged to
   TestRail. It just tells you what has already been confirmed live so you can
   prioritise.

4. **Known NOT-BUILT stories to skip** (VIU-confirmed dev-incomplete) — mark
   Blocked/Not-built until dev ships them:
   - **Story 7** — PO multi-select + "Receive Selected" (`SF-POSEL-*`)
   - **Story 8** — PO Bulk Receive page (`SF-BULK-*`)
   - **Story 9** — per-vendor Apply invoice (`SF-INV-*`)
   - **Story 14** — "Waiting on Parts" column (`SF-WOP-*`)

5. **Known deviations already logged** (do not re-raise as new bugs; they are in
   the VIU findings):
   - No "Create Purchase Orders" settings toggle / no `createPurchaseOrders`
     field — POs always-on (`SF-SET-03`, `SF-COMP-06`, `SF-QB-02`).
   - Save Settings button is always enabled (no dirty-state gating)
     (`SF-SET-13`).
   - Mark Reviewed dialog has no optional note field (`input_review_note`)
     (`SF-REV-10`).
   - Review sign-off jumps straight to Complete — no distinct "Reviewed" holding
     state observed (`SF-REV-08`, `SF-REV-11`).

6. **If confused by unexpected state**, remember this is a shared, live-dev env —
   other testers/automation may have changed things. Re-check against the §1
   baseline before assuming a defect.

---

*Sources: `build/simple-flow/requirements.md` (spec, 17 stories, §9 permissions,
§10 spec updates), `build/simple-flow/viu-findings.md` (confirmed live routes /
behaviour, 2026-07-06), `build/simple-flow/design-notes.md`,
`build/simple-flow/cases/*.json` (159 cases), `build/APP-ACTIONS-PLAYBOOK.md`.*
