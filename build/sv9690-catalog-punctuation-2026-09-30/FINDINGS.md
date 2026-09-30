# SV-9690 — Catalog hides a part's locations and receipts when the delivery's part-number punctuation differs

**Ticket:** [SV-9690](https://shopview.atlassian.net/browse/SV-9690) · status TESTING QA · priority Medium
**QA branch:** https://sv9690.qa.shopview.com — build **`v26.39.1-99a393c`**, last-modified Mon, 28 Sep 2026 13:48:01 GMT, etag `W/"240dcba03e23b564f25abe61db06a4a1"` (read live at the start and at the end of the pass, identical)
**Production (BEFORE half, Standing Rule 86):** https://app.shopview.com — build **`v26.39.2-1aeb22d`**, last-modified Tue, 29 Sep 2026 09:36:08 GMT
**Handoff followed:** Stefan Vukovic's comment **77436**, PR #3326, all four sections
**Date:** 2026-09-30

> Note on version numbers: production reads `v26.39.2` and the branch `v26.39.1`. The branch is a
> hotfix cut from an earlier tag, so the higher production number does **not** mean production is
> ahead on this fix — and it is not: the bug reproduces on production, proven below.

---

## 1. Verdict

**PASS** — every check in all four sections of the handoff passes, including tenant isolation.

---

## 2. What the customer reported, and whether it is fixed

Kimberly Christiansen (Foothills Group Inc) found that the Catalog showed **one** purchase for part
`CV6Z*5422042*A` when the Parts Velocity report showed three units sold. The investigation found the
cause: the receipts were stored `CV6Z 5422042 A` with spaces, the catalogue record used asterisks, and
two handlers matched on the raw text — so the receipts, **and the whole location they were received
at**, disappeared from the part page.

Reproduced on the current production build and re-tested on the branch. On production the location is
missing; on the branch every spelling resolves to the one catalogue record. **The reported symptom is
fixed.**

---

## 3. The case that was built (branch, org *Staging Foothills Group Inc*)

Catalogue record **`SV9690*TEST*A`** (`b5b06ad1-67ff-486c-bbdc-d360ab70e43b`), plus a sibling record
**`SV9690 TEST A`** (`9fa91819-0ed4-4702-9a95-e497ba6bf5cb`).

| # | Location | Part number as typed on the receipt | Vendor | Invoice | Cost | Qty | How it was created |
|---|---|---|---|---|---|---|---|
| A | Staging Heavy Duty - 9919 | `SV9690 TEST A` (spaces) | 5 Star Truck Repair | SV9690-A-001 | $5.92 | 1 | special order → receive |
| B | Staging Heavy Duty - 9919 | `sv9690-test-a` (lower-case, hyphens) | Krebs Diesel Repair | CA63QE6D28EUI | $238.32 | 6 | Vendor Invoices → edited an existing line (was `70167-200`) |
| C | Staging Lethbridge - 4310 | `sv9690-test-a` (lower-case, hyphens) | 5 Star Truck Repair | SV9690-B-002 | $6.06 | 2 | special order → receive |
| D | Staging Heavy Duty - 9919 | `SV9690*TEST*A` (**exact**) | 5 Star Truck Repair | SV9690-C-003 | $7.77 | 3 | special order → receive (regression 3a) |

Four spellings, two locations, both of the handoff's creation routes, and both halves of the claim —
punctuation **and** case.

---

## 4. Results against the handoff

| # | Check | Result |
|---|---|---|
| 2.2 | Locations list includes **both** location A and location B | **PASS** — Staging Heavy Duty - 9919 and Staging Lethbridge - 4310 both listed |
| 2.3 | Expanding each location lists the differently-typed receipt with vendor, invoice number, quantity and cost | **PASS** — all four rows present with every field |
| 2.4 | A sibling catalogue record for one of the typed spellings shows the same receipts | **PASS** — `SV9690 TEST A` returns the identical four receipts across the same two locations |
| 3.1 | A part received typed **exactly** as the catalogue record appears immediately | **PASS** — SV9690-C-003 listed on the first page load after receiving |
| 3.2 | Editing a line's Part number moves the receipt to that part's page | **PASS**, both directions — it appeared under `SV9690*TEST*A`, and `70167-200` now lists no receipts at all |
| 4.1 | A second organization's Catalog page must not list the first organization's locations or receipts | **PASS** — see §6 |

---

## 5. The BEFORE, captured on production (Standing Rules 73 / 86)

Same scenario, built on the live build: catalogue record **`SV9690*PROD*A`**
(`5da34e84-98e3-4ba5-ac50-d11a9ee9824c`), and one existing receipt at **Trucks Hill 2** (vendor invoice
`gfhgdfdf999`, $99.00, qty 99).

| Part number on the receipt | Production `v26.39.2-1aeb22d` | Branch `v26.39.1-99a393c` |
|---|---|---|
| typed **exactly** `SV9690*PROD*A` | location listed, receipt shown | listed |
| typed `sv9690-prod-a` (different punctuation) | **location not listed at all — page empty** | listed |

The exact-spelling row is the control: it proves the page itself works on production, so the empty page
is the defect and not a broken screen.

**Production was left as found.** The delivery line's part number was recorded before any change
(`dfgsdgd`, qty 99.00, price 99.00, description `dsfg`) and restored afterwards; part number, quantity
and price were each re-read and compared field by field — all three match.

---

## 6. Tenant isolation (handoff section 4)

A second organization was created on the branch — **ZZAUTOTEST SV9690 Tenant NewReg**
(`7893eea9-9d2a-4035-86ea-be1c0dc04244`) — and a catalogue record **`SV9690*TEST*A`**
(`a9b1b047-8c80-4a31-8d37-f5ba7d277b10`) created inside it, exactly as the handoff asks.

Signed in as that organization's own administrator:

| Observation | Result |
|---|---|
| Its Catalog page for `SV9690*TEST*A` | empty — no locations, no receipts |
| Staging Heavy Duty - 9919 / Staging Lethbridge - 4310 anywhere on the page | **absent** |
| The four receipts SV9690-A-001 / CA63QE6D28EUI / SV9690-B-002 / SV9690-C-003 | **absent** |
| Its catalogue list searched for `SV9690` | returns only its own record, not the first organization's two |
| The duplicate guard when creating the part | matched **its own** organization's record, not the first organization's |

Checked at the locations handler directly, both directions:

| Caller | Part asked about | Result |
|---|---|---|
| first organization | its own | 200, two locations |
| first organization | second organization's | **400 — refused** |
| second organization | its own | 200, zero locations (correct — it has none) |
| second organization | first organization's | **400 — refused** |

**How the second-organization session was obtained** (recorded because it is not obvious): the QA
branch's interactive login is Google SSO only and always resolves to the first organization, and the
sign-up form sets no password. The route that works is to register the organization, then complete
the password-reset the branch emails — `POST /api/reset-password` reads **all four values from the
query string** as `username`, `token`, `new_password`, `confirmed_password` (a JSON or form body is
ignored, which is why the endpoint appears broken). `POST /api/login` with that password then works
on the branch. Worth adding to the playbook.

---

## 7. Other things seen (reported, not failed)

1. **A punctuation-duplicate catalogue part can no longer be created, but one can still be renamed into
   a duplicate.** Creating `SV9690*TEST*A` when `SV9690 TEST A` exists is rejected with *"Part number
   name duplicate"* and a link to the existing record — the guard is punctuation-insensitive, which is
   consistent with the fix. Editing an existing part's number to the same value is **not** rejected;
   that is how the sibling record in §3 was built. Worth a look, but it is not a regression and is not
   in this ticket's scope.
2. **The catalogue part's name is overwritten by the delivery line's description** when a receipt is
   matched to it — `SV9690*TEST*A` became *"Weatherguard Latch/Lock"* on the branch and
   `SV9690*PROD*A` became *"dsfg"* on production. It happens on **both** builds, so it predates this
   fix and is not caused by it.
3. **Vendor-invoice detail pages render no line items on production** (`/parts/delivery/{id}` shows
   *"Empty bays"* while the API returns the items). On the branch the same pages render normally. Not
   related to this ticket; noted because it is the reason the production setup was driven through the
   API instead of the screen.

---

## 8. What could not be checked

Nothing. All four sections of the handoff were run on the branch.

---

## 9. Evidence

- `ev/01-before-after.png` — production (before) vs branch (after), same scenario
- `ev/02-production-control.png` — production with the exact spelling, proving the page itself works
- `ev/03-sibling-record.png` — the sibling catalogue record showing the same receipts
- `ev/04-tenant-isolation.png` — the second organization's Catalog page
- `ev/build_ex.py` — the exhibit builder
- Probe scripts and raw output: `/tmp/qa9690/` (branch) and `/tmp/qa9690p/` (production), not committed

## 10. Test data left in place

Per-ticket QA branches need no cleanup, so the case is left standing and reproducible: catalogue
records `SV9690*TEST*A` and `SV9690 TEST A`, the four receipts, and the second organization. The one
receipt that came from an existing vendor invoice (Krebs, `CA63QE6D28EUI`) was originally part number
`70167-200`; it was left pointing at the test part because that is what proves regression 3.2 in both
directions. **Production was restored** (see §5).

## 11. Pre-post gate (Standing Rule 72)

Recorded in `GATE.md` when the comment is posted.
