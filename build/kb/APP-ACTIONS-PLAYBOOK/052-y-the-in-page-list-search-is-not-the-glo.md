## §Y — THE IN-PAGE LIST SEARCH IS NOT THE GLOBAL SEARCH (proven sv9160, 2026-09-17)

* Toggle: **`.page-search__toggle`** on the list toolbar (y≈100). The header palette trigger is
  **`.global-search__trigger`** (y≈28) — a loose "button whose text matches /search/i" selector
  grabs the header one and you measure the palette twice without noticing.
* The field appears only after a **real mouse click** (`page.mouse.click`) and reads
  `placeholder="Type to search"`.
* Endpoints: jobs `/api/work-orders?…&search=`, customers `/api/customers?…&search=`,
  parts `/api/inventory/parts?…&search=`. The palette uses `/api/search?q=`.
* **Route trap: the parts list is `/parts/inventory`.** `/inventory/parts` is not a route and
  renders a *Back to Work Orders* fallback that reads like an empty list page.
* Empty state wording: *No work orders match the search "<query>".* Two placeholder `tbody tr`
  rows remain in the DOM when it is showing, so **row count alone is not a result count** — read
  the message.

