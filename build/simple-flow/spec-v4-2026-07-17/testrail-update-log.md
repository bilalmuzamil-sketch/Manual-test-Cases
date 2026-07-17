# Simple Flow — spec `_4` (V2.6) TestRail Push — Audit Log — 2026-07-17

TestRail project **1** / suite **1 "Master"**, API v2, Basic auth. User authorization for 2026-07-17: "check if any test cases need updating, if yes do that" (update_case + add_case authorized for the spec-`_4` apply). **NO writes to any run (run 325 untouched). NO deletions** — the 3 retire candidates (SF-CORE-05 C29317 / SF-CORE-06 C29318 / SF-CORE-09 C29321) were left UNTOUCHED in TestRail pending the user's explicit keep-vs-retire ruling.

Method per case: before-snapshot (GET, updates) → write → HTTP 200 → fresh re-GET → field-by-field verify (title/refs/preconds/steps/expected) = MATCH. Raw before/after JSON snapshots captured at push time (session evidence: /tmp/sf-v26-tr/, non-persistent; full before/after content reproduced below).

## Summary

| Op | Count | Result |
|---|---|---|
| add_section | 2 | **4252** "Core parts — Pre-Resolve (Story 18)" + **4253** "API — Core Pre-Resolve (Story 18)" (both under the Simple Flow group 4058), HTTP 200 |
| update_case | 13/13 | all HTTP 200, re-GET verify MATCH |
| add_case | 18/18 | C29892–C29909, all HTTP 200, re-GET verify MATCH |

### update_case (13)

| SF ID | TestRail | HTTP | Verify | New viu_status (local) |
|---|---|---|---|---|
| SF-CORE-03 | [C29315](https://shopview.testrail.io/index.php?/cases/view/29315) | 200 | MATCH | Blocked-Env |
| SF-CORE-04 | [C29316](https://shopview.testrail.io/index.php?/cases/view/29316) | 200 | MATCH | Blocked-Env |
| SF-CORE-07 | [C29319](https://shopview.testrail.io/index.php?/cases/view/29319) | 200 | MATCH | Blocked-Env |
| SF-CORE-08 | [C29320](https://shopview.testrail.io/index.php?/cases/view/29320) | 200 | MATCH | Blocked-Env |
| SF-BULK-10 | [C29359](https://shopview.testrail.io/index.php?/cases/view/29359) | 200 | MATCH | Blocked-Env |
| SF-REV-14 | [C29399](https://shopview.testrail.io/index.php?/cases/view/29399) | 200 | MATCH | Blocked-Env |
| SF-COMP-11 | [C29300](https://shopview.testrail.io/index.php?/cases/view/29300) | 200 | MATCH | VIU-Verified |
| SF-COMP-14 | [C29303](https://shopview.testrail.io/index.php?/cases/view/29303) | 200 | MATCH | VIU-Verified |
| SF-INV-01 | [C29360](https://shopview.testrail.io/index.php?/cases/view/29360) | 200 | MATCH | VIU-Pending |
| SF-INV-02 | [C29361](https://shopview.testrail.io/index.php?/cases/view/29361) | 200 | MATCH | VIU-Pending |
| SF-INV-03 | [C29362](https://shopview.testrail.io/index.php?/cases/view/29362) | 200 | MATCH | VIU-Pending |
| SF-BULK-06 | [C29355](https://shopview.testrail.io/index.php?/cases/view/29355) | 200 | MATCH | VIU-Pending |
| SF-VMIS-06 | [C29343](https://shopview.testrail.io/index.php?/cases/view/29343) | 200 | MATCH | Blocked-Env |

### add_case (18)

| SF ID | TestRail | Section | HTTP | Verify | viu_status (local) | Title |
|---|---|---|---|---|---|---|
| SF-CORE-11 | [C29892](https://shopview.testrail.io/index.php?/cases/view/29892) | 4252 | 200 | MATCH | VIU-Pending | Verify the Resolve cores screen lists every un-received vendor core with part info, core charge and OK / Not OK, plus an invoice-accuracy message |
| SF-CORE-12 | [C29893](https://shopview.testrail.io/index.php?/cases/view/29893) | 4252 | 200 | MATCH | VIU-Pending | Verify marking a core Not OK immediately adds the core charge to the work order total and customer invoice, while OK adds no charge |
| SF-CORE-13 | [C29894](https://shopview.testrail.io/index.php?/cases/view/29894) | 4252 | 200 | MATCH | VIU-Pending | Verify completion and invoice creation are blocked only while a core is undecided — a decided core does not block |
| SF-CORE-14 | [C29895](https://shopview.testrail.io/index.php?/cases/view/29895) | 4252 | 200 | MATCH | VIU-Pending | Verify receiving a pre-resolved core auto-applies the saved decision: OK creates exactly one vendor return, Not OK creates none, the invoice never changes, retries create no duplicates |
| SF-CORE-15 | [C29896](https://shopview.testrail.io/index.php?/cases/view/29896) | 4252 | 200 | MATCH | VIU-Pending | Verify the receive dialog locks quantity to the full remaining amount once the work order is invoiced/paid, with the core auto-selected and an explanatory tooltip |
| SF-CORE-16 | [C29897](https://shopview.testrail.io/index.php?/cases/view/29897) | 4252 | 200 | MATCH | VIU-Pending | Verify the Lines tab shows the core decision state before and after receive: 'Core decision pending', 'Core OK — return to vendor, no charge', 'Core Not OK — customer charged' |
| SF-CORE-17 | [C29898](https://shopview.testrail.io/index.php?/cases/view/29898) | 4252 | 200 | MATCH | VIU-Pending | Verify a core decision cannot be changed once the work order has an active invoice |
| SF-CORE-18 | [C29899](https://shopview.testrail.io/index.php?/cases/view/29899) | 4253 | 200 | MATCH | VIU-Pending | API: Verify POST /api/work-orders/{id}/pre-resolve-cores persists the core decision on the part request with no side-effect records |
| SF-CORE-19 | [C29900](https://shopview.testrail.io/index.php?/cases/view/29900) | 4253 | 200 | MATCH | VIU-Pending | API: Verify resolving a received core via the existing handle-core endpoints also writes the decision back to the linked core part request |
| SF-RCV-11 | [C29901](https://shopview.testrail.io/index.php?/cases/view/29901) | 4078 | 200 | MATCH | VIU-Pending | Verify returning from receiving lands on the exact work order line the receive started from, not the top of the work order |
| SF-RCV-12 | [C29902](https://shopview.testrail.io/index.php?/cases/view/29902) | 4079 | 200 | MATCH | VIU-Pending | Verify clicking Receive on a single work order part opens Accept Delivery showing all of that vendor's to-receive parts plus the vendorless group |
| SF-RCV-13 | [C29903](https://shopview.testrail.io/index.php?/cases/view/29903) | 4079 | 200 | MATCH | VIU-Pending | Verify a vendorless part can be assigned a vendor / merged into the single-part receive on the spot, reusing the same invoice number |
| SF-VEND-07 | [C29904](https://shopview.testrail.io/index.php?/cases/view/29904) | 4080 | 200 | MATCH | VIU-Pending | Verify an assigned vendor stays changeable via the same dropdown until the part is received or the work order is invoiced/paid |
| SF-VEND-08 | [C29905](https://shopview.testrail.io/index.php?/cases/view/29905) | 4080 | 200 | MATCH | VIU-Pending | Verify the part number stays editable via the edit icon after entry until the part is received or the work order is invoiced/paid |
| SF-POSEL-07 | [C29906](https://shopview.testrail.io/index.php?/cases/view/29906) | 4074 | 200 | MATCH | VIU-Pending | Verify part-sale-originated POs appear in the PO list and are selectable like work-order POs |
| SF-BULK-11 | [C29907](https://shopview.testrail.io/index.php?/cases/view/29907) | 4075 | 200 | MATCH | VIU-Pending | Verify a part-sale-originated PO can be received on the Bulk Receive page like a work-order PO |
| SF-WOP-04 | [C29908](https://shopview.testrail.io/index.php?/cases/view/29908) | 4081 | 200 | MATCH | VIU-Pending | Verify part-sale orders behave with the Waiting on Parts column — unreceived count and receive shortcut work without errors |
| SF-QB-09 | [C29909](https://shopview.testrail.io/index.php?/cases/view/29909) | 4086 | 200 | MATCH | VIU-Pending | Verify part-sale order status transitions are not regressed by the shared order/status logic (requested to waiting-to-receive to received) |

Note: viu_status lives only in the local case JSONs / deliverables (imports and TestRail content stay VIU-word-free per the user rule).

---

## Per-case BEFORE → AFTER (the 13 updates)

### SF-CORE-03 — C29315
TestRail: https://shopview.testrail.io/index.php?/cases/view/29315 | update_case HTTP 200 | re-GET verify: MATCH

**title BEFORE:**
```
Verify a waiting special-order core disables Complete Without Receiving (with a tooltip) and offers Receive Parts
```
**title AFTER (live in TestRail):**
```
Verify a Resolve cores screen appears before the Receive parts / Complete without receiving choice and only an undecided core blocks completing
```

**refs BEFORE:**
```
SV-7698 (S3-C2)
```
**refs AFTER (live in TestRail):**
```
SV-8353 (S18 C-R1/C-R4)
```

**preconditions:** unchanged

**steps BEFORE:**
```
<ol>
<li>Click Complete Work Order.</li>
<li>In the completion wizard receive step, look at the actions while the core part is still not received.</li>
<li>Hover the Complete Without Receiving action and try to use it.</li>
</ol>
```
**steps AFTER (live in TestRail):**
```
<ol>
<li>Click Complete Work Order.</li>
<li>Observe the screen shown right before the Receive parts / Complete without receiving choice.</li>
<li>Leave the core undecided and try Complete Without Receiving.</li>
<li>Mark the core OK or Not OK on the resolve screen and try again.</li>
</ol>
```

**expected BEFORE:**
```
<ol>
<li>The receive step shows the parts still to receive and indicates that a core charge is among them.</li>
<li>Complete Without Receiving is disabled (greyed out); hovering it shows a tooltip saying the core part must be received first before you can complete.</li>
<li>A Receive Parts button is offered so the core can be received.</li>
<li>Complete Without Receiving only becomes available once the waiting core has been received.</li>
</ol>
```
**expected AFTER (live in TestRail):**
```
<ol>
<li>A separate Resolve cores screen lists the un-received vendor core with its part info, core charge and an OK / Not OK choice, and explains that resolving now keeps the invoice accurate.</li>
<li>While the core is still undecided, completing is blocked.</li>
<li>Once every core is decided (OK or Not OK), Complete Without Receiving works — a decided core no longer blocks completing without receiving (no receive needed first).</li>
</ol>
```


### SF-CORE-04 — C29316
TestRail: https://shopview.testrail.io/index.php?/cases/view/29316 | update_case HTTP 200 | re-GET verify: MATCH

**title BEFORE:**
```
Verify the invoice shows a 'Cores pending' flag when unresolved special-order cores exist
```
**title AFTER (live in TestRail):**
```
Verify the 'Cores pending' indication reflects only undecided special-order cores (a decided core clears it)
```

**refs BEFORE:**
```
SV-7698 (S3-C3)
```
**refs AFTER (live in TestRail):**
```
SV-8353 (S18 C-R4)
```

**preconditions BEFORE:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A completed (optional-invoice) work order has an unresolved special-order core.</li>
</ol>
```
**preconditions AFTER (live in TestRail):**
```
<ol>
<li>Signed in as Admin.</li>
<li>A completed (optional-invoice) work order has an un-received special-order core.</li>
</ol>
```

**steps BEFORE:**
```
<ol>
<li>Open the work order's invoice / Finance view.</li>
<li>Look for a cores indicator.</li>
</ol>
```
**steps AFTER (live in TestRail):**
```
<ol>
<li>With the core still undecided (no OK / Not OK yet), open the work order's invoice / Finance view and look for a cores indication.</li>
<li>Decide the core (OK or Not OK) and check again.</li>
</ol>
```

**expected BEFORE:**
```
<ol>
<li>The invoice shows a 'Cores pending' flag while special-order cores are unresolved.</li>
</ol>
```
**expected AFTER (live in TestRail):**
```
<ol>
<li>While the core is undecided, a 'Cores pending' indication shows and invoice creation is blocked.</li>
<li>Once every core is decided (OK or Not OK), the 'Cores pending' indication clears and invoicing is no longer blocked — even though the core part has not been received yet.</li>
</ol>
```


### SF-CORE-07 — C29319
TestRail: https://shopview.testrail.io/index.php?/cases/view/29319 | update_case HTTP 200 | re-GET verify: MATCH

**title BEFORE:**
```
Verify special-order cores are resolved after the required-invoice Receive round-trip before Complete
```
**title AFTER (live in TestRail):**
```
Verify the required-invoice flow asks to resolve special-order cores FIRST and then to receive them
```

**refs BEFORE:**
```
SV-7699 (S4-C2)
```
**refs AFTER (live in TestRail):**
```
SV-8353 (S18 C-R6)
```

**preconditions:** unchanged

**steps BEFORE:**
```
<ol>
<li>Complete Work Order → Receive Parts and receive the cored part.</li>
<li>On return, observe the Resolve-cores modal.</li>
<li>Resolve each core Ok / Not OK, then Complete.</li>
</ol>
```
**steps AFTER (live in TestRail):**
```
<ol>
<li>Click Complete Work Order.</li>
<li>Observe the order of the core steps in the wizard.</li>
<li>Decide the core OK / Not OK on the resolve screen, then Receive Parts and receive it, then Complete.</li>
</ol>
```

**expected BEFORE:**
```
<ol>
<li>After the receive round-trip a gated Resolve-cores modal appears.</li>
<li>Cores can be resolved (part is always received, so always resolvable).</li>
<li>After resolving, Complete succeeds to the Success screen.</li>
<li>Consistent with the un-skippable-core rule: the required-invoice flow already forces the Receive round-trip, so the core is always received before Complete.</li>
</ol>
```
**expected AFTER (live in TestRail):**
```
<ol>
<li>The wizard asks to resolve the core FIRST (same resolve screen as the optional flow) and then to receive — not resolve-after-receive.</li>
<li>At receive the saved decision is applied automatically; the user is not asked OK / Not OK again.</li>
<li>After all parts are received, Complete succeeds to the Success screen.</li>
</ol>
```


### SF-CORE-08 — C29320
TestRail: https://shopview.testrail.io/index.php?/cases/view/29320 | update_case HTTP 200 | re-GET verify: MATCH

**title BEFORE:**
```
Verify the invoice gate detects an unresolved special-order core that exists only as a PartRequest
```
**title AFTER (live in TestRail):**
```
Verify the completion and invoice gates detect an undecided special-order core that exists only as a requested part
```

**refs BEFORE:**
```
SV-7698 (S3 Guardrail (PartRequest-only core))
```
**refs AFTER (live in TestRail):**
```
SV-8353 (S18 C-R2/C-R4)
```

**preconditions BEFORE:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A completed work order has a special-order cored part that exists only as a PartRequest (no WorkOrderPart yet).</li>
</ol>
```
**preconditions AFTER (live in TestRail):**
```
<ol>
<li>Signed in as Admin.</li>
<li>A work order has a special-order cored part that exists only as a part request (not received, no work-order part yet) and is still undecided.</li>
</ol>
```

**steps BEFORE:**
```
<ol>
<li>Click Create Invoice.</li>
<li>Observe whether the unresolved core is detected.</li>
</ol>
```
**steps AFTER (live in TestRail):**
```
<ol>
<li>Try to complete the work order and to create the invoice.</li>
<li>Decide the core OK / Not OK and try again.</li>
</ol>
```

**expected BEFORE:**
```
<ol>
<li>The invoice gate detects the unresolved core even though it is only a PartRequest.</li>
<li>The user is required to resolve it before invoicing.</li>
</ol>
```
**expected AFTER (live in TestRail):**
```
<ol>
<li>The undecided core is detected even though it exists only as a requested (un-received) part — completing and invoicing are blocked.</li>
<li>Once the core is decided, the gates clear (no receive needed first).</li>
</ol>
```


### SF-BULK-10 — C29359
TestRail: https://shopview.testrail.io/index.php?/cases/view/29359 | update_case HTTP 200 | re-GET verify: MATCH

**title BEFORE:**
```
Verify a cored part's Ok/Not OK resolution becomes available once received, and core-only partial receive is supported
```
**title AFTER (live in TestRail):**
```
Verify a pre-resolved core's decision is applied automatically at receive with no re-prompt, and core-only partial receive is supported
```

**refs BEFORE:**
```
SV-7703 (S8-C1 / S8-C2)
```
**refs AFTER (live in TestRail):**
```
SV-7703,SV-8353 (S18 C-R5)
```

**preconditions BEFORE:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A PO on the Bulk Receive page holds a cored part.</li>
</ol>
```
**preconditions AFTER (live in TestRail):**
```
<ol>
<li>Signed in as Admin.</li>
<li>A PO on the Bulk Receive page holds a cored part whose core was already decided (OK or Not OK) on the work order.</li>
</ol>
```

**steps BEFORE:**
```
<ol>
<li>Receive only the cored line (core-only partial receive).</li>
<li>Confirm an Ok/Not OK resolution becomes available for the core.</li>
</ol>
```
**steps AFTER (live in TestRail):**
```
<ol>
<li>Receive only the cored line (core-only partial receive).</li>
<li>Watch for any core prompt during the receive.</li>
<li>Check the core's state on the work order lines and the customer invoice afterwards.</li>
</ol>
```

**expected BEFORE:**
```
<ol>
<li>EXPECTED PER SPEC: core-only partial receive is supported.</li>
<li>Once the cored part is received, its Ok/Not OK resolution becomes available (for Story 3/4 resolution).</li>
<li>Consistent with the completion rule that a waiting core cannot be skipped: the core must be received (core-only partial receive supported) before its Ok / Not OK can be resolved.</li>
</ol>
```
**expected AFTER (live in TestRail):**
```
<ol>
<li>Core-only partial receive is supported.</li>
<li>The saved OK / Not OK decision is applied automatically at receive — the user is NOT asked again (no duplicate prompt).</li>
<li>The received core shows its resolved state with no OK / Not OK buttons, and the customer invoice does not change at receive.</li>
</ol>
```


### SF-REV-14 — C29399
TestRail: https://shopview.testrail.io/index.php?/cases/view/29399 | update_case HTTP 200 | re-GET verify: MATCH

**title BEFORE:**
```
Verify cores are resolved per rules before sign-off and invoicing is blocked until both Reviewed and all cores resolved
```
**title AFTER (live in TestRail):**
```
Verify cores are decided before receiving ahead of Send to Review, and invoicing stays blocked until Reviewed and every core is decided
```

**refs BEFORE:**
```
SV-7870 (R Core parts / invoicing block)
```
**refs AFTER (live in TestRail):**
```
SV-7870,SV-8353 (Story 16 core / S18)
```

**preconditions:** unchanged

**steps BEFORE:**
```
<ol>
<li>Resolve inventory cores in the completion modal (after Pick) before Send to Review.</li>
<li>For required-invoice, resolve special-order cores after the Receive round-trip before Send to Review; for optional-invoice, resolve at the Create Invoice gate after sign-off.</li>
<li>Attempt to invoice before both Reviewed and cores are resolved.</li>
</ol>
```
**steps AFTER (live in TestRail):**
```
<ol>
<li>Resolve inventory cores in the completion modal (after Pick) before Send to Review.</li>
<li>Decide the special-order cores OK / Not OK on the resolve screen BEFORE receiving, before Send to Review (same in required- and optional-invoice flows).</li>
<li>Attempt to invoice before the work order is Reviewed and before every core is decided.</li>
</ol>
```

**expected BEFORE:**
```
<ol>
<li>Inventory cores are resolved before Send to Review.</li>
<li>Special-order cores follow the vendor-invoice rules.</li>
<li>Invoicing is blocked until the WO is Reviewed AND all cores are resolved.</li>
<li>In the review flow too, a waiting special-order core cannot be skipped: Send to Review / completion is blocked until the core is received and resolved, and invoicing stays blocked until both Reviewed and all cores resolved.</li>
</ol>
```
**expected AFTER (live in TestRail):**
```
<ol>
<li>Inventory cores are resolved before Send to Review.</li>
<li>Special-order cores are pre-resolved before receiving on the resolve screen before Send to Review — no longer deferred to the Create Invoice gate.</li>
<li>Invoicing is blocked until the work order is Reviewed AND every core is decided; only an undecided core blocks — a decided (un-received) core does not.</li>
</ol>
```


### SF-COMP-11 — C29300
TestRail: https://shopview.testrail.io/index.php?/cases/view/29300 | update_case HTTP 200 | re-GET verify: MATCH

**title:** unchanged

**refs BEFORE:**
```
SV-7698 (S3-R4)
```
**refs AFTER (live in TestRail):**
```
SV-7698,SV-8353 (S3-R4 / S18 C-R1/C-R4)
```

**preconditions:** unchanged

**steps:** unchanged

**expected BEFORE:**
```
<ol>
<li>The wizard shows a Receive step (e.g. 'N parts waiting to receive').</li>
<li>The actions are Cancel, Complete Without Receiving, and Receive Parts.</li>
<li>If one of the waiting parts is a special-order core, Complete Without Receiving is disabled (with a tooltip) until that core is received; for non-core parts it stays available.</li>
</ol>
```
**expected AFTER (live in TestRail):**
```
<ol>
<li>The wizard shows a Receive step (e.g. 'N parts waiting to receive').</li>
<li>The actions are Cancel, Complete Without Receiving, and Receive Parts.</li>
<li>If one of the waiting parts is a special-order core, a Resolve cores screen appears before this choice; once every core is decided (OK / Not OK), Complete Without Receiving stays available — only an undecided core blocks completing (see SF-CORE-03).</li>
</ol>
```


### SF-COMP-14 — C29303
TestRail: https://shopview.testrail.io/index.php?/cases/view/29303 | update_case HTTP 200 | re-GET verify: MATCH

**title:** unchanged

**refs BEFORE:**
```
SV-7698 (S3-R6)
```
**refs AFTER (live in TestRail):**
```
SV-7698,SV-8353 (S3-R6 / S18 C-R4)
```

**preconditions:** unchanged

**steps:** unchanged

**expected BEFORE:**
```
<ol>
<li>The work order completes and the Success screen appears.</li>
<li>Unreceived parts remain in a waiting-to-receive state (would show in the Waiting on Parts column).</li>
<li>The line still shows a Receive button.</li>
<li>Note: Complete Without Receiving is only available when no special-order core is waiting; if a core is waiting it is disabled and the core must be received first (see SF-CORE-03).</li>
</ol>
```
**expected AFTER (live in TestRail):**
```
<ol>
<li>The work order completes and the Success screen appears.</li>
<li>Unreceived parts remain in a waiting-to-receive state (would show in the Waiting on Parts column).</li>
<li>The line still shows a Receive button.</li>
<li>Note: a special-order core no longer has to be received first — it is decided (OK / Not OK) on the Resolve cores screen before this choice; only an undecided core blocks Complete Without Receiving (see SF-CORE-03).</li>
</ol>
```


### SF-INV-01 — C29360
TestRail: https://shopview.testrail.io/index.php?/cases/view/29360 | update_case HTTP 200 | re-GET verify: MATCH

**title BEFORE:**
```
Verify each vendor group has an 'Apply to selected POs' control enabled only with an invoice # and ≥1 PO selected
```
**title AFTER (live in TestRail):**
```
Verify each vendor group has an invoice number field under the vendor name, available only when at least one PO of that vendor is selected (no Apply button)
```

**refs:** unchanged

**preconditions:** unchanged

**steps BEFORE:**
```
<ol>
<li>Locate the 'Apply to selected POs' control under the vendor name.</li>
<li>With no invoice # and no PO selected, confirm it is disabled.</li>
<li>Enter an invoice # and select at least one PO under that vendor.</li>
</ol>
```
**steps AFTER (live in TestRail):**
```
<ol>
<li>Look under the vendor name for the field to enter one invoice number.</li>
<li>With no PO of that vendor selected, confirm the field is not available.</li>
<li>Select at least one PO under that vendor and type an invoice number.</li>
</ol>
```

**expected BEFORE:**
```
<ol>
<li>EXPECTED PER SPEC: the control appears under the vendor name.</li>
<li>It is enabled only when an invoice number is entered and at least one PO under that vendor is selected.</li>
</ol>
```
**expected AFTER (live in TestRail):**
```
<ol>
<li>A field to enter one invoice number for that vendor's POs sits under the vendor name.</li>
<li>It is available only when at least one PO under that vendor is selected.</li>
<li>There is no 'Apply' button — the number is remembered as typed.</li>
</ol>
```


### SF-INV-02 — C29361
TestRail: https://shopview.testrail.io/index.php?/cases/view/29361 | update_case HTTP 200 | re-GET verify: MATCH

**title BEFORE:**
```
Verify Apply pre-fills one invoice number into only the selected POs of that vendor, still editable per PO
```
**title AFTER (live in TestRail):**
```
Verify a typed invoice number fills only the selected POs of that vendor with no Apply click, still editable per PO
```

**refs:** unchanged

**preconditions:** unchanged

**steps BEFORE:**
```
<ol>
<li>Enter one invoice number.</li>
<li>Click Apply.</li>
<li>Inspect the selected and unselected POs' invoice fields.</li>
<li>Edit one PO's invoice number.</li>
</ol>
```
**steps AFTER (live in TestRail):**
```
<ol>
<li>Select some POs under a vendor (leave others unselected).</li>
<li>Type one invoice number in that vendor's invoice number field.</li>
<li>Inspect the selected and unselected POs' invoice fields.</li>
<li>Edit one PO's invoice number.</li>
</ol>
```

**expected BEFORE:**
```
<ol>
<li>EXPECTED PER SPEC: the invoice number is pre-filled into only the selected POs of that vendor.</li>
<li>Unselected POs are not changed.</li>
<li>Each PO's invoice number remains editable after Apply.</li>
</ol>
```
**expected AFTER (live in TestRail):**
```
<ol>
<li>The typed number is filled into only the selected POs of that vendor — no Apply click needed (the number is remembered as typed).</li>
<li>Unselected POs are not changed.</li>
<li>Each PO's invoice number remains editable afterwards; then Receive all works for that vendor.</li>
</ol>
```


### SF-INV-03 — C29362
TestRail: https://shopview.testrail.io/index.php?/cases/view/29362 | update_case HTTP 200 | re-GET verify: MATCH

**title BEFORE:**
```
Verify Apply Invoice is scoped per vendor, not offered for the vendorless group, and allows a reused invoice number
```
**title AFTER (live in TestRail):**
```
Verify the vendor invoice number field is scoped per vendor, absent for the vendorless group, and allows a reused invoice number
```

**refs:** unchanged

**preconditions:** unchanged

**steps BEFORE:**
```
<ol>
<li>Confirm Apply Invoice is available per vendor group.</li>
<li>Confirm the vendorless group has no Apply Invoice control.</li>
<li>Apply the same invoice number to POs where uniqueness is relaxed.</li>
</ol>
```
**steps AFTER (live in TestRail):**
```
<ol>
<li>Confirm each vendor group has its own invoice number field.</li>
<li>Confirm the vendorless group shows no invoice number field.</li>
<li>Type the same invoice number for POs of another vendor.</li>
</ol>
```

**expected BEFORE:**
```
<ol>
<li>EXPECTED PER SPEC: Apply Invoice is scoped to each vendor group.</li>
<li>The vendorless group has no Apply Invoice control.</li>
<li>The same invoice number can be reused (uniqueness relaxed).</li>
</ol>
```
**expected AFTER (live in TestRail):**
```
<ol>
<li>The invoice number field is scoped to each vendor group — other vendors' POs and unselected POs are unaffected.</li>
<li>The vendorless group shows no invoice-number field (assign a vendor first).</li>
<li>The same invoice number can be reused (uniqueness relaxed).</li>
</ol>
```


### SF-BULK-06 — C29355
TestRail: https://shopview.testrail.io/index.php?/cases/view/29355 | update_case HTTP 200 | re-GET verify: MATCH

**title BEFORE:**
```
Verify field editability and locking on Bulk Receive (qty and cost editable; sell locks after WO invoiced/paid)
```
**title AFTER (live in TestRail):**
```
Verify Bulk Receive field editability: quantity editable (partial receive), cost editable ONLY when it is $0, sell locks after the WO is invoiced/paid
```

**refs BEFORE:**
```
SV-7703,SV-7705 (S8-R7 / S10-R2)
```
**refs AFTER (live in TestRail):**
```
SV-7703 (S8-R7)
```

**preconditions BEFORE:**
```
<ol>
<li>Signed in as Admin.</li>
<li>The Bulk Receive page has a PO whose WO is NOT yet invoiced/paid, and another whose WO IS invoiced/paid.</li>
</ol>
```
**preconditions AFTER (live in TestRail):**
```
<ol>
<li>Signed in as Admin.</li>
<li>The Bulk Receive page has a part whose cost is $0, a part whose cost is not $0, and a PO whose work order IS invoiced/paid.</li>
</ol>
```

**steps BEFORE:**
```
<ol>
<li>On the not-yet-invoiced PO, edit quantity, cost and sell.</li>
<li>On the invoiced/paid PO, try to edit sell.</li>
<li>Hover the locked sell field.</li>
</ol>
```
**steps AFTER (live in TestRail):**
```
<ol>
<li>Edit the quantity on a part (partial receive).</li>
<li>Try to edit the cost on the part whose cost is $0.</li>
<li>Try to edit the cost on the part whose cost is not $0.</li>
<li>On the invoiced/paid PO, try to edit the sell price and hover the locked field.</li>
</ol>
```

**expected BEFORE:**
```
<ol>
<li>Quantity and cost are editable; sell is editable while the work order is not invoiced/paid.</li>
<li>After the work order is invoiced/paid, sell is locked with a lock icon and tooltip 'Locked — this part is already invoiced or paid'.</li>
<li>After locking, only cost remains editable.</li>
<li>The field rules have parity with the Accept-Delivery receive screen; cost is editable when $0 or missing on either surface.</li>
</ol>
```
**expected AFTER (live in TestRail):**
```
<ol>
<li>Quantity is editable (partial receive supported).</li>
<li>Cost is editable when it is $0 (pulled from the work order / PO when available).</li>
<li>Cost is NOT editable when it is not $0.</li>
<li>Sell price is editable until the work order is invoiced/paid, then locked with a lock icon and tooltip 'Locked — this part is already invoiced or paid'.</li>
</ol>
```


### SF-VMIS-06 — C29343
TestRail: https://shopview.testrail.io/index.php?/cases/view/29343 | update_case HTTP 200 | re-GET verify: MATCH

**title BEFORE:**
```
Verify reports mark Vendor Missing POs as 'needs vendor'
```
**title AFTER (live in TestRail):**
```
Verify a Vendor Missing PO's spend is excluded from the QuickBooks Vendor Bill export and the Vendors Expenses report until a vendor is assigned
```

**refs:** unchanged

**preconditions BEFORE:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A Vendor Missing PO exists.</li>
<li>A relevant PO report is available.</li>
</ol>
```
**preconditions AFTER (live in TestRail):**
```
<ol>
<li>Signed in as Admin.</li>
<li>A Vendor Missing PO with a non-zero cost exists.</li>
</ol>
```

**steps BEFORE:**
```
<ol>
<li>Open the PO report that lists POs.</li>
<li>Find the Vendor Missing PO.</li>
</ol>
```
**steps AFTER (live in TestRail):**
```
<ol>
<li>Open the Vendors Expenses report and look for the vendor-missing PO's spend.</li>
<li>Inspect the QuickBooks Vendor Bill export for that PO.</li>
<li>Assign a vendor to the PO and check both again.</li>
</ol>
```

**expected BEFORE:**
```
<ol>
<li>The report marks the Vendor Missing PO as 'needs vendor'.</li>
</ol>
```
**expected AFTER (live in TestRail):**
```
<ol>
<li>While the PO has no vendor, its spend is NOT counted in the Vendors Expenses report.</li>
<li>Its spend is excluded from the QuickBooks Vendor Bill export.</li>
<li>There is no dedicated purchase-order report and no 'needs vendor' marker — nothing 'marks' these POs.</li>
<li>Once a vendor is assigned, the spend flows into both normally.</li>
</ol>
```


---

## New-case content (the 18 adds)

Full content as landed (re-GET verified MATCH against the authored case JSONs in `cases/*.json`; source of truth for the authored text = the case JSONs at commit time).

### SF-CORE-11 — C29892 (section 4252)
**Title:** Verify the Resolve cores screen lists every un-received vendor core with part info, core charge and OK / Not OK, plus an invoice-accuracy message
**Refs:** SV-8353 (S18 C-R1) | priority_id 3 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>Require Vendor Invoice Number is OFF (Optional).</li>
<li>A work order has two special-order (vendor) cored parts that have not been received yet.</li>
</ol>
```
**Steps:**
```
<ol>
<li>Click Complete Work Order.</li>
<li>Observe the screen shown right before the Receive parts / Complete without receiving choice.</li>
<li>Read the message on the screen.</li>
</ol>
```
**Expected:**
```
<ol>
<li>A separate, consolidated Resolve cores screen appears, listing EVERY un-received vendor core (both parts).</li>
<li>Each core shows its part info, its core charge and an OK / Not OK choice.</li>
<li>A message explains that resolving now is for invoice accuracy.</li>
</ol>
```

### SF-CORE-12 — C29893 (section 4252)
**Title:** Verify marking a core Not OK immediately adds the core charge to the work order total and customer invoice, while OK adds no charge
**Refs:** SV-8353 (S18 C-R3) | priority_id 3 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A work order has two un-received vendor cores shown on the Resolve cores screen.</li>
</ol>
```
**Steps:**
```
<ol>
<li>Mark one core Not OK and note the work order total.</li>
<li>Mark the other core OK and note the total again.</li>
<li>Create the customer invoice and check its amounts.</li>
</ol>
```
**Expected:**
```
<ol>
<li>Not OK: the core charge is priced into the work order total right away and flows to the customer invoice.</li>
<li>OK: no charge is added (the vendor core return is created automatically later, at receive).</li>
<li>The invoice matches the decisions even though no core part has been received.</li>
</ol>
```

### SF-CORE-13 — C29894 (section 4252)
**Title:** Verify completion and invoice creation are blocked only while a core is undecided — a decided core does not block
**Refs:** SV-8353 (S18 C-R4) | priority_id 3 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A work order has two un-received vendor cores.</li>
</ol>
```
**Steps:**
```
<ol>
<li>Decide one core (OK or Not OK), leave the other undecided; try to complete the work order and to create the invoice.</li>
<li>Decide the remaining core and try again.</li>
</ol>
```
**Expected:**
```
<ol>
<li>With any core still undecided, completing and invoice creation are blocked and a cores-pending indication shows.</li>
<li>Once every core is decided, completion and invoice creation proceed — no receive is required first.</li>
</ol>
```

### SF-CORE-14 — C29895 (section 4252)
**Title:** Verify receiving a pre-resolved core auto-applies the saved decision: OK creates exactly one vendor return, Not OK creates none, the invoice never changes, retries create no duplicates
**Refs:** SV-8353 (S18 C-R5) | priority_id 3 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A work order has one core pre-resolved OK and another pre-resolved Not OK, both not yet received; the customer invoice is created.</li>
</ol>
```
**Steps:**
```
<ol>
<li>Receive the OK core; check vendor returns and the customer invoice.</li>
<li>Receive the Not OK core; check again.</li>
<li>Retry / re-submit the receive and re-check for duplicates.</li>
</ol>
```
**Expected:**
```
<ol>
<li>The OK core is received already resolved, with exactly ONE vendor core return created automatically.</li>
<li>The Not OK core is received already resolved, with NO return created.</li>
<li>The user is never asked OK / Not OK again, the customer invoice does not change at receive, and retries create no duplicate cores or returns.</li>
</ol>
```

### SF-CORE-15 — C29896 (section 4252)
**Title:** Verify the receive dialog locks quantity to the full remaining amount once the work order is invoiced/paid, with the core auto-selected and an explanatory tooltip
**Refs:** SV-8353 (S18 C-R8) | priority_id 2 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>An invoiced/paid work order has an un-received cored part; another (not yet invoiced) work order also has one.</li>
</ol>
```
**Steps:**
```
<ol>
<li>Open the receive dialog for the invoiced/paid work order's part, try to change the quantity, and hover the field.</li>
<li>Open the receive dialog for the not-yet-invoiced work order's part and change the quantity.</li>
</ol>
```
**Expected:**
```
<ol>
<li>On the invoiced/paid work order the quantity is locked to the full remaining amount, the core is auto-selected, and the tooltip reads 'This part is on a customer invoice and should be received in full'.</li>
<li>Before invoicing, the quantity stays editable (partial receive allowed).</li>
<li>The lock is on the screen only — the customer invoice itself never changes at receive.</li>
</ol>
```

### SF-CORE-16 — C29897 (section 4252)
**Title:** Verify the Lines tab shows the core decision state before and after receive: 'Core decision pending', 'Core OK — return to vendor, no charge', 'Core Not OK — customer charged'
**Refs:** SV-8353 (S18 C-R9) | priority_id 2 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A work order has three vendor cores: one undecided, one decided OK, one decided Not OK.</li>
</ol>
```
**Steps:**
```
<ol>
<li>Open the work order's Lines tab before receiving and read each core's state.</li>
<li>Receive the two decided cores and re-check the Lines tab.</li>
</ol>
```
**Expected:**
```
<ol>
<li>Before receive: the undecided core shows 'Core decision pending'; the OK core shows 'Core OK — return to vendor, no charge'; the Not OK core shows 'Core Not OK — customer charged'.</li>
<li>After receive, a pre-resolved core shows its resolved state with NO OK / Not OK buttons.</li>
<li>No duplicate core prompts appear anywhere.</li>
</ol>
```

### SF-CORE-17 — C29898 (section 4252)
**Title:** Verify a core decision cannot be changed once the work order has an active invoice
**Refs:** SV-8353 (S18 AC — resolution immutable with active invoice) | priority_id 2 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A work order has a decided core and an active customer invoice.</li>
</ol>
```
**Steps:**
```
<ol>
<li>Try to change the core's OK / Not OK decision (on the resolve screen or the Lines tab).</li>
</ol>
```
**Expected:**
```
<ol>
<li>The decision cannot be changed while the work order has an active invoice.</li>
</ol>
```

### SF-CORE-18 — C29899 (section 4253)
**Title:** API: Verify POST /api/work-orders/{id}/pre-resolve-cores persists the core decision on the part request with no side-effect records
**Refs:** SV-8353 (S18 C-R2 / technical plan) | priority_id 3 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>A valid Admin session (API).</li>
<li>A work order with an un-received special-order cored part request exists.</li>
</ol>
```
**Steps:**
```
<ol>
<li>POST /api/work-orders/{id}/pre-resolve-cores with the core decision (ok / not_ok).</li>
<li>Re-read the work order's lines / receive-view read models.</li>
<li>Inspect for side-effect records (work-order part, statement item, vendor return).</li>
</ol>
```
**Expected:**
```
<ol>
<li>The request succeeds (2xx) and core_resolution is persisted on the core work_order_part_request (ok | not_ok; NULL = undecided).</li>
<li>NO WorkOrderPart, statement item, or vendor return is created at this point.</li>
<li>cores_pending reflects only undecided (NULL) cores after the call.</li>
</ol>
```

### SF-CORE-19 — C29900 (section 4253)
**Title:** API: Verify resolving a received core via the existing handle-core endpoints also writes the decision back to the linked core part request
**Refs:** SV-8353 (S18 C-R10) | priority_id 2 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>A valid Admin session (API).</li>
<li>A received cored part exists that can be resolved via the existing handle-core(s) endpoints.</li>
</ol>
```
**Steps:**
```
<ol>
<li>Resolve the received core Ok / Not OK via the existing handle-core(s) endpoint.</li>
<li>Read the linked core part request and its core_resolution value.</li>
</ol>
```
**Expected:**
```
<ol>
<li>The call succeeds and the decision is ALSO written to the linked core PartRequest (core_resolution matches the handle-core decision), keeping core_resolution the single source of history.</li>
</ol>
```

### SF-RCV-11 — C29901 (section 4078)
**Title:** Verify returning from receiving lands on the exact work order line the receive started from, not the top of the work order
**Refs:** SV-7706 (S11-R4) | priority_id 2 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A work order has several lines and a line far down the page has an un-received part.</li>
</ol>
```
**Steps:**
```
<ol>
<li>From that line, click Receive (Receive opens Accept Delivery).</li>
<li>Receive the part and go back to the work order.</li>
<li>Observe where the page lands.</li>
</ol>
```
**Expected:**
```
<ol>
<li>The user is returned to the exact work order line they received from — the page scrolls/focuses to the originating line, not the top of the work order — giving instant visual confirmation of the received part.</li>
</ol>
```

### SF-RCV-12 — C29902 (section 4079)
**Title:** Verify clicking Receive on a single work order part opens Accept Delivery showing all of that vendor's to-receive parts plus the vendorless group
**Refs:** SV-7707 (S12-R6) | priority_id 2 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A work order part has a vendor that also has other parts waiting to receive, and a vendorless part is waiting to receive too.</li>
</ol>
```
**Steps:**
```
<ol>
<li>Click Receive on the single work order part.</li>
<li>Observe which parts the Accept Delivery screen shows.</li>
</ol>
```
**Expected:**
```
<ol>
<li>Accept Delivery shows all to-receive parts for that part's vendor (other vendors' parts are not shown).</li>
<li>The vendorless group is also shown alongside them.</li>
</ol>
```

### SF-RCV-13 — C29903 (section 4079)
**Title:** Verify a vendorless part can be assigned a vendor / merged into the single-part receive on the spot, reusing the same invoice number
**Refs:** SV-7707 (S12-R6) | priority_id 2 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>You are on the Accept Delivery screen opened from a single work order part, and the vendorless group is showing a part.</li>
</ol>
```
**Steps:**
```
<ol>
<li>Assign a vendor to the vendorless part (or merge it into this receive).</li>
<li>Receive both parts using the same invoice number.</li>
</ol>
```
**Expected:**
```
<ol>
<li>The vendorless part can be assigned a vendor / merged into this receive right there — no need to go back.</li>
<li>The same invoice number is reused for the merged part.</li>
<li>Both parts are received successfully.</li>
</ol>
```

### SF-VEND-07 — C29904 (section 4080)
**Title:** Verify an assigned vendor stays changeable via the same dropdown until the part is received or the work order is invoiced/paid
**Refs:** SV-7708 (S13-R8) | priority_id 3 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A PO part has a vendor assigned but is not yet received; another part is already received (or its work order is invoiced/paid).</li>
</ol>
```
**Steps:**
```
<ol>
<li>On the un-received part, open the vendor dropdown and pick a different vendor.</li>
<li>On the received (or invoiced/paid) part, try to change the vendor.</li>
</ol>
```
**Expected:**
```
<ol>
<li>The vendor is NOT locked on selection — it can be changed via the same dropdown, so a wrong pick can be corrected before receiving.</li>
<li>Once the part is received or the work order is invoiced/paid, the vendor can no longer be changed.</li>
</ol>
```

### SF-VEND-08 — C29905 (section 4080)
**Title:** Verify the part number stays editable via the edit icon after entry until the part is received or the work order is invoiced/paid
**Refs:** SV-7708 (S13-R8) | priority_id 2 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A PO part has a part number entered but is not yet received; another part is already received (or its work order is invoiced/paid).</li>
</ol>
```
**Steps:**
```
<ol>
<li>On the un-received part, use the edit icon to change the part number.</li>
<li>On the received (or invoiced/paid) part, try to edit the part number.</li>
</ol>
```
**Expected:**
```
<ol>
<li>The part number remains editable (edit icon) after entry, under the same condition as the vendor — until the part is received or the work order is invoiced/paid.</li>
<li>Once the part is received or the work order is invoiced/paid, the part number can no longer be edited.</li>
</ol>
```

### SF-POSEL-07 — C29906 (section 4074)
**Title:** Verify part-sale-originated POs appear in the PO list and are selectable like work-order POs
**Refs:** SV-7702 (Story 7 AC — part-sale POs) | priority_id 2 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A Part Sale with a vendor part exists, so a part-sale purchase order was created.</li>
</ol>
```
**Steps:**
```
<ol>
<li>Open the Purchase Orders list and find the part-sale PO.</li>
<li>Select it (checkbox) together with work-order POs and use Receive Selected.</li>
</ol>
```
**Expected:**
```
<ol>
<li>The part-sale-originated PO appears in the PO list.</li>
<li>It is selectable and joins the Receive Selected flow like a work-order PO.</li>
</ol>
```

### SF-BULK-11 — C29907 (section 4075)
**Title:** Verify a part-sale-originated PO can be received on the Bulk Receive page like a work-order PO
**Refs:** SV-7703 (Story 8 AC — part-sale POs) | priority_id 2 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A part-sale purchase order is waiting to receive and is on the Bulk Receive page.</li>
</ol>
```
**Steps:**
```
<ol>
<li>Find the part-sale PO under its vendor group on the Bulk Receive page.</li>
<li>Select it, enter the vendor invoice number and receive it.</li>
<li>Check the part sale afterwards.</li>
</ol>
```
**Expected:**
```
<ol>
<li>The part-sale PO appears under its vendor group like a work-order PO.</li>
<li>It can be received on this page via the same receive pipeline.</li>
<li>The part sale progresses normally after receiving (no errors).</li>
</ol>
```

### SF-WOP-04 — C29908 (section 4081)
**Title:** Verify part-sale orders behave with the Waiting on Parts column — unreceived count and receive shortcut work without errors
**Refs:** SV-7709 (§8 Part Sales — confirmed) | priority_id 1 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>The Waiting on Parts column is enabled and a Part Sale has an unreceived vendor part.</li>
</ol>
```
**Steps:**
```
<ol>
<li>Locate the part-sale order on the list where the Waiting on Parts column shows.</li>
<li>Check its unreceived-parts count and click it.</li>
<li>Receive via the shortcut and re-check the count.</li>
</ol>
```
**Expected:**
```
<ol>
<li>The part-sale order's unreceived parts are counted consistently in the Waiting on Parts column (or the order is cleanly excluded — no error, no broken link).</li>
<li>The receive shortcut behaves like it does for work orders.</li>
<li>After receiving, the count updates correctly.</li>
</ol>
```

### SF-QB-09 — C29909 (section 4086)
**Title:** Verify part-sale order status transitions are not regressed by the shared order/status logic (requested to waiting-to-receive to received)
**Refs:** SV-7702,SV-7703 (§8 Part Sales — confirmed) | priority_id 1 | custom_atmstatus 3 | custom_automation_type 0
**Preconditions:**
```
<ol>
<li>Signed in as Admin.</li>
<li>A Part Sale exists (or can be created) to which a vendor part can be added.</li>
</ol>
```
**Steps:**
```
<ol>
<li>Add a vendor part to the Part Sale so a purchase order is created.</li>
<li>Follow the order's status as it is ordered and then received (same PO/receive pipeline as work orders).</li>
<li>Confirm the part sale itself progresses normally after receiving.</li>
</ol>
```
**Expected:**
```
<ol>
<li>The part-sale purchase order moves through the normal statuses (requested, then waiting to receive, then received) with no errors.</li>
<li>Receiving the part-sale PO behaves like receiving a work-order PO (same pipeline).</li>
<li>The part sale is not broken by the shared order/status logic.</li>
</ol>
```


---

## Adversarial audit — 2026-07-17 (independent re-verification)

Full-population re-audit of the V2.6 apply pass:
- **Live-vs-local:** all **31 touched cases** (13 update_case + 18 add_case C29892–C29909) re-GET from TestRail and field-diffed against `cases/*.json` (title/preconditions/steps/expected) — **0/31 mismatches**. No TestRail re-push needed.
- **Sections:** 4252 "Core parts — Pre-Resolve (Story 18)" + 4253 "API — Core Pre-Resolve (Story 18)" confirmed live, parent 4058, suite 1 (API cases in the API-titled section per Standing Rule 4).
- **Retire candidates untouched:** C29317 / C29318 / C29321 confirmed live with pre-2026-07-17 `updated_on` and the OLD invoice-gate wording; RETIRE-PROPOSED notes present locally on SF-CORE-05/06/09; nothing deleted anywhere.
- **Run 325 untouched:** get_results_for_case on C29315 / C29360 / C29343 — zero results created 2026-07-17.
- **Tally recount (independent, from cases JSON):** 187 total / 187 unique IDs — VIU-Verified 130 · VIU-Pending 22 · Blocked-Env 27 · awaiting-Milos 5 · Deviation 3 · Open-Question 0. Matches PROJECT-STATE, Blockers Tracker (126+0+49+10+2=187), import CSV (187 rows, canonical header, 0 VIU/flag words), TestCases + Results workbooks (187 rows), id-map (187/187, new block C29892–C29909 titles verified live 18/18).
- **Coverage:** every Story-18 requirement covered — C-R1 (SF-CORE-11/03), C-R2 (SF-CORE-18/08), C-R3 (SF-CORE-12), C-R4 (SF-CORE-13/04/03/08), C-R5 (SF-CORE-14 + SF-BULK-10), C-R6 (SF-CORE-07 reword — no separate case, recorded), C-R7 (existing SF-CORE-01, no edit needed per delta doc), C-R8 (SF-CORE-15), C-R9 (SF-CORE-16), C-R10 (SF-CORE-19), immutability AC (SF-CORE-17); Δ9→SF-RCV-11, Δ10→SF-RCV-12/13, Δ11→SF-VEND-07/08, Δ12→SF-VMIS-06, Δ13→SF-INV-01/02/03, Δ14→SF-BULK-06, Δ15→SF-POSEL-07/SF-BULK-11/SF-WOP-04/SF-QB-09(C29909), Δ16 metadata (no case needed). **No C-R coverage gaps.**
- **Status honesty:** SF-INV-01/02/03 + SF-BULK-06 correctly flipped Verified→VIU-Pending; SF-VMIS-06 Deviation→Blocked-Env (QB-export leg); SF-COMP-11/14 stay Verified with explicit notes separating the verified base behavior from the Blocked-Env spec-sourced core leg. No dishonest statuses found.
- **One defect found & fixed (deliverable text only, not TestRail):** `gen_blockers.py` hardcoded "(all 159 cases)" in the Blockers Tracker header — made dynamic (now "all 187 cases") and the Tracker md/xlsx regenerated. Commit: "Simple Flow V2.6 apply: audit corrections".

**Verdict: CLEAN** (after the one deliverable-header fix).
