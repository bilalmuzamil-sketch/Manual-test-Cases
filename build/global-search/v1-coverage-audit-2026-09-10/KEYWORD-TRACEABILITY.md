# SEED KEYWORD -> V1 FIELD -> CASE traceability

Proof that every V1 searchable field is exercised by a keyword that can ONLY match via that field.

| Search keyword | V1 field it is planted in | Case | What a hit proves |
|---|---|---|---|
| `Kestrelway` | `customer.address_1` | G6a | Proves street address is searchable |
| `Fernvale` | `customer.city` | G6a | Proves city is searchable |
| `44872-9931` | `customer.postal_code` | G6a | Proves postal code is searchable |
| `bridgeporthauling-zzt.com` | `customer.website` | G7 | Proves website is searchable |
| `Okonkwo` | `customer_contact.last_name` | covered by C44895/C44837 | Contact match returns the company (V2 changed shape) |
| `ZZT-4471` | `asset.unit` | G2 | Proves unit number is searchable |
| `1FUJGLDR9KLZZ4471` | `asset.vin` | covered by C44844 | VIN exact match after normalization |
| `OHZZT471` | `asset.licence_plate` | covered by C53516 | Licence plate search |
| `Bridgeport` | `asset.owner_name` | G8 | Proves an asset is findable by its owning customer |
| `Bridgeport` | `work_order.customer_name` | G3 | Proves a WO is findable by its customer name |
| `Halbrook` | `vendor.address_1` | G6b | Proves vendor street address is searchable |
| `Marnston` | `vendor.city` | G6b | Proves vendor city is searchable |
| `43055-2210` | `vendor.postal_code` | G6b | Proves vendor postal code is searchable |
| `parts@kestrelsupply-zzt.com` | `vendor.email` | G5 | Proves vendor email is searchable |
| `ZZT-88-4412 / ZZT884412` | `part.part_number` | covered by C44846 | Part number normalized match |
| `<shop>+WO number forms` | `work_order.number` | G4 | Four shop-prefixed number forms V1 accepted |
| `WO-A..WO-D order` | `work_order.start_date` | G9 | Newest-first ordering |
| `<new record name>` | `created in-run` | G1a/G1b | New record findable immediately |
