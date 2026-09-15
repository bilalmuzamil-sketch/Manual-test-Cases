# Annotated ticket evidence — 15 September 2026

Six screenshots taken live on `sv9160` and captioned in plain English, one pair per ticket.
**Jira attachments cannot be uploaded from this session**, so these were handed to the QA lead to drag
onto the tickets; each ticket description names the file it expects.

| File | Ticket | Shows |
|---|---|---|
| **`ANN-SV-10055-side-by-side.png`** | SV-10055 | 🟢 **the one to attach** — failure and proof in a single picture: `2019 Freightliner` → Assets (0), beside `Freightliner Cascadia` → the same vehicle found |
| `ANN-SV-10055-1.png` · `ANN-SV-10055-2.png` | SV-10055 | the two halves separately; superseded by the side-by-side above, kept as the source panels |
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

## Why SV-10055 was redone

The first attempt gave the ticket **two separate screenshots and two similar-looking tables** — one
for "what happens now" and one for "what the old version did" — both listing the same queries. A
reader could easily mix them up, and the most important fact (only `2019 Freightliner` is in scope)
sat in section four behind a warning heading.

Rewritten to:

1. **One sentence at the top** saying exactly what to fix.
2. **One table** with four columns — typed · old version · today · fix it here? — so nothing can be
   confused with anything else, and the scope is visible on the row it applies to.
3. **One picture** instead of two: the failure and the proof side by side, so the comparison is made
   for the reader rather than left to them.

The lesson worth keeping: **two tables covering the same rows is a defect in a ticket.** Merge them
and add a column.
