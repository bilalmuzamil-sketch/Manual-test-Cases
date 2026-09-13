# COMPLETENESS PROOF — every field V1 could search, and the case that guards it

**Question this answers:** *"If a customer could find something in V1 by typing X, is there a test that
fails when V2 can't?"*

**Method:** every field in V1's five search haystacks was enumerated **from the code**
(`FetchDataQueryHandler.php` @ `55767168`), not from the case list. Each is then mapped to the case
that would fail if V2 lost it. Display-only cases (a field merely *shown* on a result row) are NOT
accepted as coverage — that distinction is what hid the original gaps.

## Work Orders — `FetchDataQueryHandler.php:91-118`
| V1 searchable field | Guarded by |
|---|---|
| `wo.raw_number`, `wo.number` (dash / space forms) | C44843 |
| shop-number-prefixed forms (4 variants V1 built) | **C53579** 🟠 PO decision |
| customer name `c.name` | **C53578** |
| `wo.status` | **Dropped on purpose** — PRD v1.5 §4: status is "deliberately not matchable". PO-REG-6 |

## Customers — `:224-245`
| V1 searchable field | Guarded by |
|---|---|
| `c.name` | C44839 / C44840 (fuzzy) |
| `REPLACE(c.name," ","")` — run-together name | **C53602** 🟠 PO decision |
| `c.address_1` | **C53582** |
| `c.address_2` | **C53604** |
| `c.state_or_province` | **C53582** |
| `c.postal_code` | **C53582** 🟠 PO decision |
| `c.city` | **C53582** |
| `c.telephone` | C44845 |
| `c.website` | **C53583** 🟠 PO decision |
| contact `first_name` / `last_name` | C44895 / C44837 |
| contact `title` | **C53603** 🟠 PO decision |
| contact `telephone` | C44845 / C44837 |

## Assets (Vehicles) — `:285-293`
| V1 searchable field | Guarded by |
|---|---|
| owning customer `c.name` | **C53581** |
| `v.year` | **C53605** |
| maker / model | C44841 |
| `v.unit` | **C53580** |
| `v.vin` | C44844 |
| `v.licence_plate` | C53516 🟠 PO decision |

## Vendors — `:155-164`
| V1 searchable field | Guarded by |
|---|---|
| `v.name` | C44839 / C44840 (fuzzy) |
| `v.address_1` | **C53585** |
| `v.address_2` | **C53604** |
| `v.state_or_province` | **C53606** 🟠 PO decision |
| `v.postal_code` | **C53585** 🟠 PO decision |
| `v.city` | **C53585** |
| `v.telephone` | C44845 |
| `v.email` | **C53584** |

## Parts — `:317-331`
| V1 searchable field | Guarded by |
|---|---|
| `cp.name` (description) | **C53607** |
| `cp.part_number` with and without dashes | C44846 |
| **the CATALOGUE as the source** — every catalogue part was searchable, stocked or not | **C53601** 🔴 PO decision, highest risk |

## Result
**Every field V1 could search now has a case that fails if V2 loses it.** 21 of those cases already
existed; **19 were added or corrected in this pass** (bold entries).

**What this proof does NOT claim:** that V2 passes. Nothing here has been executed against a build.
It claims only that a loss would be *caught* rather than reaching a customer unnoticed.
