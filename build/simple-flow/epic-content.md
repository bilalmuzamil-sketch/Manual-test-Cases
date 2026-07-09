# Simple Flow — Epic Content (verbatim, as provided 2026-07-09)

> Epic: **Simple Mode — Streamlined Work Order Completion & Bulk Receiving** (SV-7301).
> Recorded verbatim from the user's paste on 2026-07-09. This is the source for the
> "What's Been Built" reconciliation in `spec-epic-diff-latest.md`. INGEST + RECORD only.

## Problem Statement (6 pain points)

1. Completing a work order is slow and click-heavy — up to **18+ clicks** from work
   order to invoice.
2. Single-operator and mobile shops don't need the PO / receiving ceremony but are
   forced through it.
3. Parts added without vendor info get **stuck**.
4. Accountants receive vendor invoices **one PO at a time**.
5. The work-order list gives **no receiving visibility**.
6. Missing cost at completion produces **wrong QuickBooks margins**.

## Epic Summary

Cut completion from **18+ clicks to 2–3 clicks**, configurable per org, without
sacrificing QuickBooks or inventory integrity. Not a separate mode or app — makes
specific existing steps optional plus a set of pure additions.

## Background

(Context for the pain points above — Express/Simple Mode makes the PO/receiving
ceremony optional and adds bulk receiving + receiving visibility.)

## What's Been Built

**(1) Express Mode Settings**
- Auto-approve lines.
- Create POs toggle.
- Vendor invoice Optional / Required.

**(2) Express WO Completion Dialog**
- 2-step wizard.
- Complete-without-receiving **vs** receive-&-complete.
- POs-off ⇒ single-step.

**(3) Dummy Purchase Orders for vendorless parts**
- A **separate no-vendor PO**.
- "Vendor Missing" indicator.
- **Receive hidden** (until a vendor is assigned).
- Vendor dropdown on the PO detail → **becomes receivable**.

**(4) Bulk Vendor Parts Receiving**
- PO page **checkbox + "Receive Selected"**.
- A **dedicated bulk-receive page** grouped by **vendor → WO**.
- Per-WO invoice + **"Apply to All"**.
- Editable **Qty / Cost / Sell**.
- Per-WO **or** global receive.

**(5) WO List "Waiting on Receive" column**
- Count of unreceived parts.
- **Clickable → Accept Delivery**.
- **Replaces the old badge.**

## Key Decisions

- Express Mode is **not limited to small shops**.
- **One invoice per vendor per WO.**
- Vendorless POs are **excluded from bulk receive until a vendor is assigned**.
- **QB sync skipped for vendorless POs** (flagged, not coded).
- **Cost AND sell captured during receiving.**

## What's Remaining

- QB sync flag for vendorless POs.
- Settings page UX review.
