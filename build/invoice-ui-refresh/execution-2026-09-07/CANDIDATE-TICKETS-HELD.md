# Candidate tickets — PREPARED, NOT FILED
**Held pending the QA lead's go-ahead.** Nothing in this file has been created in Jira.
**Date:** 2026-09-07 · **Environment:** staging · **Build:** `v26.35.9-9812433`

---

## CANDIDATE 1 — S1/S4 asset identifier: the spec describes two fields where the product has one

**Would be filed as:** `Story Defect` · parent **SV-9143 — Story 4, Asset Section** · priority `Medium` ·
label `fs_invoice_refresh` · no Product Area · plus a `relates to` link to SV-9143.

**Title:** Asset section rule assumes a separate VIN and Serial; the product has one combined field

**Description**

C44924 clause 4 says "The VIN is preferred when both exist". A ShopView asset has **one** identifier
field, not two, so there is no state in which "both exist" and nothing to prefer. Clause 3 — a serial
showing in the "VIN / Serial" slot when the value is not a VIN — does work, and is now proved.

This is a wording correction to the specification, not a fault in the build. Same family as SV-9804
and SV-9805.

**Steps of replication**

1. Sign in to ShopView on staging.
2. Click **Customers**, open **4 Star Truck Repair**, click the **Assets** tab.
3. Open any asset and look at the identifier field.
4. Click **Work Orders** in the top menu and look at the **VIN/Serial #** column heading.
5. Open a work order, click **Finance**, and read the asset band on the document.

**Current behavior**

There is a single field, labelled **"VIN/Serial #"** on the asset card, in the asset picker and as the
Work Orders list column, and rendered as **"VIN / SERIAL"** on the document. Whatever it holds is what
prints. Confirmed three ways: the vehicle API returns one `vin` key and no serial field on all 500
assets read; the string `serial_number` appears nowhere in the application bundle; and the product's
own labels combine the two words.

An asset was created with the serial-style value `SN-ZZAUTOTEST-0042` in that field, a work order
raised on it (**S2-32270**), and its document prints `VIN / SERIAL  SN-ZZAUTOTEST-0042`.

**Expected behavior**

Clause 3 is correct and passes. Clause 4 should be removed or re-worded to describe one combined
field — for example, "the VIN / Serial value shows whichever identifier the asset carries" — so the
case can be scored. If two separate fields are actually wanted, that is a new story, not a defect.

**Screenshots**

`evidence-gap-closure/ann-serial.png`

**Source**

Invoice UI Refresh specification, **S4** asset section, clause quoted exactly from case C44924:

> The VIN is preferred when both exist.

Story: **SV-9143 — Story 4, Asset Section**. Epic: **SV-8218 — Invoice UI Refresh**.

**Where this was seen**

Staging, build `v26.35.9-9812433`, work order **S2-32270**, 7 September 2026.

---

## NOT A NEW TICKET — fresh corroboration for SV-9680

The asset created today carries **no mileage and no engine-hours reading**, and the document's asset
band still prints `MILEAGE 0` and `ENG HRS 0`. That is **SV-9680** (Code Review) reproducing on a
brand-new record rather than on migrated data, which narrows it: the zero is being written by the
renderer, not inherited from old rows. Worth adding as a comment to SV-9680 on your go-ahead — no new
ticket needed.

---

## Test data created while closing these gaps

* Asset **ZZSER-01 / unit SER1**, VIN/Serial `SN-ZZAUTOTEST-0042`, on 4 Star Truck Repair.
* Work order **S2-32270** on that asset (Estimate, $0.00, no lines) — created through the UI because
  `POST /api/work-orders/create` returns the known 500.
* Imported historical invoice **ZZAUTOTEST-IMP-002** (the import returned 200; the record could not be
  relocated through the UI afterwards).
* **Nothing was left changed.** The Heavy Duty location's "Show % on Estimates and Invoices" and its
  tax code were each toggled and restored, verified field-by-field against the original form
  (`evidence-gap-closure/loc-restored-crop.png`).
