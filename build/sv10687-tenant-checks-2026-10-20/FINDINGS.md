# SV-10687 — tenant checks on work-order/payment actions (QA branch sv10687)

**Environment:** https://sv10687.qa.shopview.com, build v26.40.19-edfe7b0, Admin ShopView, location Staging Heavy Duty - 9919, 20 Oct 2026.
**Ticket state when read:** TESTING QA; handoff = Nemanja Djuric comment 79048 (19 Oct 14:37 CDT). Recording: no (QA lead). Technical section: none (QA lead).
**Scope:** the handoff's "normal use still works" list. The cross-organization / cross-location refusals are listed as "dev tested, no QA needed" and are not driven here (only reachable by sending crafted requests; no screen offers them).

Test work order: **S10687-17580** (customer Desert Edge Truck Service & Repair), 3 approved lines, built for this test.

## 1. Part return requests (work order → Lines)
| Step | On screen | Result |
|---|---|---|
| Make | Part ZZ687-RET-37137 (qty 3, received) ⋮ → Return → "Add new part return request", reason "ZZAUTOTEST wrong part", qty 2 → Save & Close | Return row "2 Returned", part row 1. PASS |
| Change reason/quantity | Click the "Returned" row → dialog "Edit part return request" (reason box starts empty, qty 2) → reason "ZZAUTOTEST wrong size", qty 1 → Save & Close | change-return-request 200; after reload part 2, returned 1. PASS |
| Cancel ("Put Back") | Returned row ⋮ → Cancel Return → dialog "This will put that part back onto the work order." → Put Back (one confirmation only; no "Are You Sure?") | Return row gone, part back to 3 ($540). PASS |

Note: the edit dialog opens with an empty Return reason (the saved reason is not pre-filled). The form requires a reason, so the user retypes it. Not part of this ticket (no frontend change); not raised — ask QA lead.

## 2. Delete a part
| Case | On screen | Result |
|---|---|---|
| Inventory part picked from a bin | Line 3 → Add Part → FS19732 (Inventory, bin MZF1C, 3 in stock) qty 1 → Save → Pick (stock 3→2) → pencil → Edit Part → red **Return** | parts/delete 201; part gone; bin MZF1C back to 3. PASS |
| Found part (not picked) | ZZ687-FOUND-13074 → pencil → red **Delete** | remove-request 200; part gone after reload. PASS |

## 3. Move a part to another line
| Case | On screen | Result |
|---|---|---|
| Normal move | ZZ687-MOV-37137 ⋮ → Move → "Move part to line" → Target Line "1 - … line 1" → **Move To Line** → button turns **Please Confirm** → click again | move-part-to-line 200; part now under line 1. PASS (also DEL line 3 → 1, MOV 1 → 2, all 200) |
| Part that carries an open core | ZZ687-CORE-38980 (core charge $40, received, "Core for …" row with Core OK) → Move to line 2 | 200; the "Core for …" row moves with it. PASS |
| Target line declined | line 3 declined (line ⋮ → Decline); MOV → Target Line 3 → confirm | Red message **"Part cannot be moved to declined line"**, part stays. PASS (usual error) |
| Core row itself | "Core for …" row ⋮ offers only **Core OK** (open core) / **Cancel Return** (returned core) — no Move | Screen does not offer the move. (compare production) |
| Invoiced work order | Move dialog's Work Order list shows open work orders only; S2-17540 (invoiced) not listed. On the invoiced work order the part rows have no ⋮ | Screen does not offer it. (compare production) |
| Requested (not yet ordered) part off a declined line | DEL2 ⋮ → Move → line 1 | part-request/move-to-line 200 (different action; not in the ticket's list) |

## 4. Split a work order
| Case | On screen | Result |
|---|---|---|
| 2 lines | Tick lines 1 and 2 → bottom bar **More** → **Split work order** → click again | split 201; new work order opens with both lines and all their parts (DEL, RET, CORE + core row, MOV); line 3 stays on S10687-17580. PASS |
| Invoiced (S2-17540) / paid (S2-17510, S2-17504) | Tick lines | Bar reads **"No actions available for this selection"** — no split. PASS |

## 5. Work Order Log
⋮ (top right, next to New Line) → **Audit Log** → "Work Order Log" opens with every event (Split to, Part moved, Part received, Part ordered …). history 200. PASS

## 6. Change sales rep
Setup: no sales reps existed on the branch; Ashley Schultz and Brandon Jarvis were made sales reps (Settings → Staff → edit → "Sales Representative" toggle → Save & Close).
Left panel **Sales Representative** dropdown: Unassigned → Ashley Schultz → Brandon Jarvis; each change-sales-rep 201 and survives a reload. PASS

## 7. Receive Payment (customer Desert Edge → Invoices → tick → New Payment → Cash → Make Payment), at Heavy Duty
| Case | What was ticked | Dialog showed | Result |
|---|---|---|---|
| Cash only | S2-17296 $183.38 | Payment amount $183.38 | create-customer-payment 201; invoice leaves the unpaid list. PASS |
| Two locations in one payment | S2-17278 $472.91 (Heavy Duty) + S10687-17582 $243.58 (Lethbridge, built for this test) | Both rows; Payment amount $716.49; note "Select invoices from a single location to pay by terminal." | 201; both invoices paid. PASS |
| Overpayment | S2-17069 $995.34, Amount to credit $4.66 | Payment amount $1,000.00 | 201; invoice paid, $4.66 held as deposit DEP-4703 (Heavy Duty). PASS |
| With a deposit | S2-16198 $844.43 | Deposit DEP10687-4703 row added by itself, "Fully consumed −$4.66"; Payment amount $839.77 | 201; invoice paid; DEP-4703 open balance 0, fully_consumed. PASS |
| With a store credit | Issue Credit → $25, Issue Store Credit → CM10687-4189 (Unapplied row on the Invoices tab). Then ticked S2-17198 $2,116.97 + CM10687-4189 | Credit row "Fully consumed −$25.00"; Payment amount $2,091.97 | 201; invoice paid; credit gone from the open list. PASS |
| Credit not ticked | S2-16985 $1,952.34 only | No credit row (store credit is applied only when its row is ticked) | 201, paid in full in cash. (behaviour note, not a fault) |

## 8. Another location's deposit / credit (handoff "known difference")
While at Lethbridge: issued store credit CM10687-4190 ($25) and overpaid S2-17307 by $3.33 → deposit DEP-4704 held at Lethbridge.
- At **Heavy Duty**: the Invoices tab shows no CM10687-4190 row; New Payment for S2-17312 shows no deposit row (Payment amount $6,122.86). Deposit list from Heavy Duty shows only DEP-4703.
- At **Lethbridge**: CM10687-4190 row shown (Unapplied); New Payment for the same S2-17312 adds "Deposit DEP10687-4704 −$3.33" (Payment amount $6,119.53).
Matches the handoff: a deposit or credit held at location B is not offered in location A. PASS

## 9. Invoice page → payment
S2-17312 → its Finance tab → **New Payment** (the invoice is pre-filled on its row) → Cash, $100 → Make Payment → 201; S2-17312 balance $6,122.86 → **$6,022.86, "Partially paid"**. PASS

## 10. IBS batch payment
Reports → IBS Batch Transactions → Ready To Send → tick INV-S2-17462 (Lansing Truck & Trailer Repair, $1,113.83) → ⋮ → Create Batch (setup). Sent tab → tick the batch → ⋮ → **Make Payment** → "New Batch Payment" → Cash → Make Payment → ibs/payment 201; batch now **$0.00 Paid**, Payments tab lists the $1,113.83 payment. PASS

## 11. Customer portal online payment — NOT RUN (open question for the QA lead)
`GET /api/customer-portal/payment-settings` on the branch → `{"payments_mode":"shared","onboarded":false}`: online payments are not onboarded for this organisation on sv10687, and no "Send to Portal" control shows on the invoice. The portal is a separate app (laravel.cloud). Asked the QA lead how to proceed before posting (Rule 91).

## 12. Production before (app.shopview.com, build v26.40.19-d2441a9, 20 Oct 2026, Trucks Hill 2, S2-868)
Same return flow on ZZQA9807-P1: Return (qty 1) → click Returned row → **"Edit part return request"** (same dialog, reason box also starts empty) → Save & Close (change-return-request 200) → ⋮ Cancel Return → same "This will put that part back onto the work order." → **Put Back** (one click) → part back to qty 2. Identical to the branch.
Move part dialog on production offers the same Move / Return / Add Part Fee / Discount menu.

## 13. Closed out — 20 Oct 2026, ~09:00 UTC
- **Live re-read (Rule 103):** SV-10687 is **Ready for Production** (moved 03:44 CDT). Mudassir Qamar posted final QA results in **79076** (03:43 CDT). Nemanja wrote in **79075** (03:41 CDT): "the customer portal isn't available on the QA env, so please skip the portal payment check" — covered by the backend test CreatePaymentTenantIsolationTest.
- **sv10687 was torn down** while the annotated exhibits were being recaptured (502/503 from 08:52 UTC, connection reset after). Recaptured with element positions before that: returns (r1–r8), delete with bin (d0–d3: stock MZF1C 3 → 2 on Pick → 3 after Return), move with "Please Confirm" (m1, m2), declined-line error into S10687-17580 line 3 (m3), split → S10687-17584 (s1–s3), invoiced "No actions available" (s4). Stored in `ev/x687/`. Payment pictures exist only from the test run (`ev/pay*`, `ev/loc-*`, `ev/ibs-*`, `ev/take-*`).
- **Also seen:** Decline is disabled on a line that holds received/picked parts, with tooltip "Line can't be declined while it holds received or picked parts, please move the parts to another line or return them." Expected.
- **Also seen:** at Lethbridge, opening a Heavy Duty work order's URL on screen switches the header back to Heavy Duty and the work order loads; a direct lines request made while Lethbridge was selected answered 400 "WorkOrder not found." Mudassir's note ("opening a Heavy Duty WO was refused (400)") matches the direct request, not what the screen shows.
- **QA lead's ruling (20 Oct, asked after the above):** "No, skip it" — **no comment posted on SV-10687**; Mudassir's sign-off stands. Findings kept here.
