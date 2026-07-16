# Simple Flow — Milos Round-3 TestRail Push Log — 2026-07-16

TestRail project **1** / suite **1 "Master"**, API v2, Basic auth. Method: `update_case` (case WORDING ONLY — title/preconds/steps/expected).
NO run/results were written; **Ayesha's run 325 was NOT touched.** User granted TestRail write authorization for 2026-07-16.

Each case: `update_case` returned **HTTP 200** and a fresh re-GET confirms the landed content equals the reworded case JSON (final verify = MATCH; a subsequent no-op run confirms idempotence).

| SF ID | TestRail | update_case HTTP | Final re-GET verify | New status |
|---|---|---|---|---|
| SF-RCV-05 | [C29373](https://shopview.testrail.io/index.php?/cases/view/29373) | 200 | MATCH | Deviation |
| SF-RCV-07 | [C29375](https://shopview.testrail.io/index.php?/cases/view/29375) | 200 | MATCH | Deviation |
| SF-REV-15 | [C29400](https://shopview.testrail.io/index.php?/cases/view/29400) | 200 | MATCH | Blocked-Env |

---

## SF-RCV-05 — C29373
TestRail: https://shopview.testrail.io/index.php?/cases/view/29373 | New viu_status: **Deviation**

### title
**BEFORE:**
```
Verify new vendorless/no-PN WO parts and WO-originated POs appear and are receivable on Accept Delivery, with the vendor-missing group at the top
```
**AFTER (reworded, now live in TestRail):**
```
Verify vendorless / no-part-number Work Order parts appear and can be received on the Receive (Accept Delivery) screen, and the Vendor Missing group sits per the agreed rule (top on Bulk Receive, bottom on the Receive screen)
```

### preconditions
**BEFORE:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A WO has a vendorless/no-PN part and a WO-originated PO reached via the Receive button.</li>
</ol>
```
**AFTER (live in TestRail):**
```
<ol>
<li>Signed in as Admin (or a role with receiving access).</li>
<li>A Work Order has a part with no vendor and no part number, plus a WO-created Purchase Order that is opened using the Receive button on the Work Order.</li>
</ol>

```

### steps
**BEFORE:**
```
<ol>
<li>Open Accept Delivery for the WO.</li>
<li>Confirm the vendorless/no-PN parts appear.</li>
<li>Confirm the vendor-missing group is at the top (leading).</li>
</ol>
```
**AFTER (live in TestRail):**
```
<ol>
<li>On the Work Order, click the Receive button to open the Receive (Accept Delivery) screen (headed Purchase Order Details).</li>
<li>Confirm the vendorless / no-part-number parts are listed and can be received here.</li>
<li>Note where the Vendor Missing group sits on this Receive (Accept Delivery) screen.</li>
<li>Open the Bulk Receive page (headed Receive Vendor Parts) for the same Purchase Orders and note where the Vendor Missing group sits there.</li>
</ol>

```

### expected
**BEFORE:**
```
<ol>
<li>New vendorless/no-PN WO parts appear and are receivable here.</li>
<li>WO-originated POs reached via the Receive button appear.</li>
<li>Vendor-missing parts sit in their own group that LEADS (appears at the top), because they need action (assign a vendor) before receiving.</li>
</ol>
```
**AFTER (live in TestRail):**
```
<ol>
<li>The vendorless / no-part-number Work Order parts appear in the Vendor Missing group and can be received once a vendor is chosen (Select Vendor) and a Part Number is entered.</li>
<li>WO-created Purchase Orders opened with the Receive button appear on the Receive (Accept Delivery) screen and are receivable.</li>
<li>The Vendor Missing group is positioned per the agreed rule (Milos, 2026-07-16): on the Bulk Receive page (Receive Vendor Parts) it leads at the TOP; on the Receive (Accept Delivery) screen it sits at the BOTTOM.</li>
</ol>

```

**Final verify (live TestRail == reworded case JSON): MATCH ✓**

---

## SF-RCV-07 — C29375
TestRail: https://shopview.testrail.io/index.php?/cases/view/29375 | New viu_status: **Deviation**

### title
**BEFORE:**
```
Verify Accept Delivery shows a '+N' vendor indicator and leads with the vendor-missing group
```
**AFTER (reworded, now live in TestRail):**
```
Verify the multi-vendor '+N' indicator and the Vendor Missing group position on the receiving screens
```

### preconditions
**BEFORE:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A multi-vendor delivery with a vendor-missing group exists.</li>
</ol>
```
**AFTER (live in TestRail):**
```
<ol>
<li>Signed in as Admin (or a role with receiving access).</li>
<li>A multi-vendor Purchase Order that also includes parts with no vendor (a Vendor Missing group) exists.</li>
</ol>

```

### steps
**BEFORE:**
```
<ol>
<li>Open Accept Delivery.</li>
<li>Confirm the '+N' vendor indicator.</li>
<li>Confirm the ordering of the vendor-missing group.</li>
</ol>
```
**AFTER (live in TestRail):**
```
<ol>
<li>Open the Purchase Orders list (Parts > Purchase Orders) and look at the vendor indicator on a multi-vendor Purchase Order.</li>
<li>Open the Receive (Accept Delivery) screen from the Work Order Receive button and note where the Vendor Missing group sits.</li>
<li>Open the Bulk Receive page (Receive Vendor Parts) and note where the Vendor Missing group sits.</li>
</ol>

```

### expected
**BEFORE:**
```
<ol>
<li>A '+N' indicator summarizes multiple vendors.</li>
<li>The vendor-missing group leads (appears first).</li>
</ol>
```
**AFTER (live in TestRail):**
```
<ol>
<li>A multi-vendor Purchase Order shows a '+N' indicator (for example '+1' or '+4') on the Purchase Orders list summarizing the extra vendors. (On the Receive / Accept Delivery screen the vendor names are listed in full instead of a '+N' badge.)</li>
<li>The Vendor Missing group is positioned per the agreed rule (Milos, 2026-07-16): on the Bulk Receive page (Receive Vendor Parts) it leads at the TOP; on the Receive (Accept Delivery) screen it sits at the BOTTOM.</li>
</ol>

```

**Final verify (live TestRail == reworded case JSON): MATCH ✓**

---

## SF-REV-15 — C29400
TestRail: https://shopview.testrail.io/index.php?/cases/view/29400 | New viu_status: **Blocked-Env**

### title
**BEFORE:**
```
Verify the Require Review default for new vs existing orgs matches the agreed cohort rule
```
**AFTER (reworded, now live in TestRail):**
```
Verify Require Review Before Completion starts ON for a brand-new organization, and existing organizations keep today's behavior
```

### preconditions
**BEFORE:**
```
<ol>
<li>A newly-created org and an existing org are available.</li>
<li>Signed in as Admin for each.</li>
</ol>
```
**AFTER (live in TestRail):**
```
<ol>
<li>A brand-new organization / account (no settings changed yet) and an existing organization are available.</li>
<li>Signed in as Admin for each.</li>
</ol>

```

### steps
**BEFORE:**
```
<ol>
<li>Check the Require Review default on a brand-new org.</li>
<li>Check that existing orgs keep today's behavior (backfilled).</li>
</ol>
```
**AFTER (live in TestRail):**
```
<ol>
<li>On a brand-new organization, open Settings > Work Orders and check the Require Review Before Completion setting.</li>
<li>On an existing organization, confirm its completion behavior is unchanged (the setting is backfilled).</li>
</ol>

```

### expected
**BEFORE:**
```
<ol>
<li>On a brand-new org the Require Review Before Completion setting shows its default state.</li>
<li>Existing orgs keep their current completion behavior (the setting is backfilled so their behavior does not change).</li>
</ol>
```
**AFTER (live in TestRail):**
```
<ol>
<li>On a brand-new organization / account, Require Review Before Completion defaults to ON (Milos decision, 2026-07-16: it stays ON for every new organization).</li>
<li>Existing organizations keep their current completion behavior (the setting is backfilled so their behavior does not change).</li>
</ol>

```

**Final verify (live TestRail == reworded case JSON): MATCH ✓**
