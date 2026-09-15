# Annotated ticket evidence — 15 September 2026

Six screenshots taken live on `sv9160` and captioned in plain English, one pair per ticket.
**Jira attachments cannot be uploaded from this session**, so these were handed to the QA lead to drag
onto the tickets; each ticket description names the file it expects.

| File | Ticket | Shows |
|---|---|---|
| `ANN-SV-10055-1.png` | SV-10055 | `2019 Freightliner` → **Assets (0)**, no vehicles |
| `ANN-SV-10055-2.png` | SV-10055 | the control — `Freightliner Cascadia` returns the same vehicle, so the record is fine |
| `ANN-SV-10057-1.png` | SV-10057 | the full phone number **does** return the customer now (all four formats) |
| `ANN-SV-10057-2.png` | SV-10057 | the part still open — **part** of the number returns nothing |
| `ANN-SV-10060-1.png` | SV-10060 | mid-word fragment from the **name** works |
| `ANN-SV-10060-2.png` | SV-10060 | the same kind of fragment from the **town** returns nothing |

## How they were made, so they can be remade

* `capture_search_screenshots.mjs` — drives a real browser into the QA branch and captures the search
  modal for each query.
  🔴 **The header search is a BUTTON (`global_search_trigger`), not a typeable field.** A first attempt
  pressed Ctrl+K and typed; the modal never opened, `Ctrl+A` selected the whole page, and six
  identical screenshots of the work-orders list came back — all exactly the same file size, which is
  what gave it away. Click the trigger, then type into the modal's own input.
* `annotate_screenshots.py` — crops to the modal, adds a plain-English title bar, a green/red verdict
  bar, boxes the relevant count, and prints the explanation underneath.

## The rule these follow

A screenshot with no caption is not evidence — it is a picture. Each one states **what was typed**,
**what came back**, and **why that matters**, so a reader who has never seen the product can judge it
without asking anyone.
