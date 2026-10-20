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
