## §Z — `jira.sh` OUTPUT CARRIES A STATUS SUFFIX

Every response ends `\n__HTTP:<code>`. Piping it into `json.load` raises a parse error that looks
exactly like an expired Atlassian session. Strip it first: `| sed 's/__HTTP:.*//'`.

- **🔑 THE ASSET'S OWN SCREEN IS `/customers/vehicle/{vehicleId}/work-orders?companyId={companyId}`** (sv9160,
  2026-09-22). `/asset/{id}`, `/assets/{id}`, `/vehicle/{id}` and `/customer/{id}` are all 404 — the route was
  found by clicking an Asset row in global search and reading where it landed. The pencil control is an
  `edit_note` glyph; the edit form's fields are VIN/Serial #, Year, **Make \*** (required, a q-select),
  Model, Trim, Engine, Drivetrain, Unit, Type, Mileage, Engine Hours, Licence Plate, Color. **A vehicle with no
  Make cannot be saved from this form at all**, so a record seeded via the API (which sets no make) is not
  editable through the screen until a Make is picked.
- **⛔ `POST /api/vehicles/change` IS BROKEN ON sv9160 (2026-09-22).** Without `vin` →
  `400 "Cannot remove VIN form vehicle, update to valid one"`; **with** `vin` → **500** for every variant tried
  (`unit`+`vin`, `vin` alone, with and without `customer_id`). So the playbook's line-822 recipe does not hold on
  this branch; use the screen, and remember Make is required there.
- **🔑 READ A VEHICLE BACK WITH `GET /api/vehicles?search=<token>&pagination[rowsPerPage]=50`.** The same
  endpoint **without** `search` — and with `company_id` instead — returns the record set the token is NOT in, so
  a read-back written that way reports "not stored" for a record that is perfectly well stored. Prove the
  instrument returns both records BEFORE reading anything into an unchanged value (Rule 104).
- **🔑 A PARTS-TAB FIXTURE NEEDS AN INVENTORY PART, NOT A CATALOGUE PART.** `POST /api/parts-catalogue/add-catalogue-part
  {name, part_number, tags}` → 201 but the record is **not findable in global search** on this build (that is
  C53601, failing). Follow it with `POST /api/inventory/parts/create {catalog_part_id, category_id, quantity,
  cost, tags, bins:[{id,quantity,isDefault}]}` → 201 and it appears. The row's displayed description comes from
  the CATALOGUE part, so `POST /api/parts-catalogue/change-catalogue-part {id, name, part_number, tags}` → 200 is
  what changes what the tester sees. Category ids: `GET /api/inventory/categories` → `{value,label}`; a bin id:
  `GET /api/inventory/parts?pagination[rowsPerPage]=1` → `binLocations[0].binLocationId`.

