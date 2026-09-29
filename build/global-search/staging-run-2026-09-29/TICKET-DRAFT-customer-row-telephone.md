# PREPARED, NOT FILED — awaiting the QA lead's go-ahead (Rule 62 / Rule 113)

**Issue type** `Story Defect` · **Parent** SV-9170 · **Priority** Medium · also link SV-9170 *relates to*

⚠️ **Rule 112 check, and it does not pass cleanly.** SV-9170 reads **QA Complete**, read live
2026-09-29. Rule 112 allows a Story Defect only against a story in **Ready for QA** or **Testing
QA**. The rule was written for a story that is not ready *yet*; this is a story that already passed
QA and has a gap in it. That is a decision for the QA lead, not for this session, so nothing is
filed.

---

## Title

`Customer Search Result Row Omits The Telephone The Requirement Places On Hover`

## Description

A customer's result row is meant to carry four things, so that someone can pick the right customer
without opening anything. Three of them are there. The telephone is not — not on the row, and not
when the pointer rests on the row, which is where the requirement puts it.

For example, on a customer whose record holds a telephone:

* the row shows the customer name, a count of open work orders, and the address line;
* resting the pointer on the row changes nothing at all;
* the telephone never appears, so anyone who searched for a customer in order to ring them has to
  open the record to get the number.

This is not the truncation problem already reported separately. Nothing here is cut off — the
telephone is simply never drawn.

## Steps to Reproduce

# Sign in and open any screen.
# Press `Ctrl`+`K` to open search.
# Type `{{7 Star Truck Repair}}` — any customer whose record has a telephone will do; this one
  carries `{{609-461-6502}}`.
# Open the *Customers* tab.
# Rest the pointer on the customer's row and leave it there.
#* The row shows *7 Star Truck Repair*, a *30 open* marker, and *305 Harris Cape, Priscillabury,
  Nunavut*.
#* Nothing is added, replaced or revealed while the pointer is on the row.
# Open the customer to confirm the number is on file.
#* The record's *Phone* field reads `{{609-461-6502}}`.

*Actual Result* — the telephone is never shown on the result row, on hover or otherwise.

*Expected Result* — the telephone appears on the row when the pointer rests on it.

## Screenshots

!customer-row-no-telephone.png|width=760!

## Environment

Staging — [https://app.staging.shopview.com] · build `{{v26.39.1-97cad2c}}` · 29 September 2026
Customer record: [https://app.staging.shopview.com/customers/b3406baf-3b85-424a-a2c8-c3ed5f4da4b0/work-orders]

## Sources

*PRD v1.5, section 4* — Customers row:

{quote}Displayed: customer name (primary), address line, open WO count badge (e.g. `12`), telephone on hover.{quote}

---

## Notes for filing (not part of the ticket)

* `size_pics.py <KEY> pics/customer-row-no-telephone.png` must run AFTER the description write and
  be read back to confirm `full-width` (Rule 116). The picture is 1002px wide from a 2× capture.
* The description must go in via `PUT /rest/api/2/issue/{KEY}` with `jira.sh` — the MCP tools take
  Markdown and will not embed the image.
* No case ids or run links in the description (removed from the house shape 2026-09-16/17).
