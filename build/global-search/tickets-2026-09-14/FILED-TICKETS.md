# Global Search V1 → V2 — tickets filed 14 September 2026

All eight are **Task**, priority **Medium**, Product Area **Platform Features**, each linked
`relates to` **SV-9163** (*BE — Search index: backfill and incremental maintenance for all nine entity
types*) under epic **SV-9160**. **None is a Bug.** Each carries two annotated screenshots inline at
width 760 — the failing search, and a control showing the same records ARE found by name.

Every one was re-verified on the build on 14 September before filing, and every one was re-read after
filing to confirm it renders (two images, seven headings, no leftover markup, the link present).

| | What it says a user cannot do | Ticket |
|---|---|---|
| B1 | Find a catalogue part by its part number | [SV-9993](https://shopview.atlassian.net/browse/SV-9993) |
| B2 | Find a customer by their postal code | [SV-9994](https://shopview.atlassian.net/browse/SV-9994) |
| B3 | Find a customer by their website address | [SV-9995](https://shopview.atlassian.net/browse/SV-9995) |
| B4 | Find a company by a contact's job title | [SV-9996](https://shopview.atlassian.net/browse/SV-9996) |
| B5 | Find a supplier by their postal code | [SV-9997](https://shopview.atlassian.net/browse/SV-9997) |
| B6 | Find a supplier by the state they are in | [SV-9998](https://shopview.atlassian.net/browse/SV-9998) |
| B7 | Find a vehicle by its licence plate | [SV-9999](https://shopview.atlassian.net/browse/SV-9999) |
| C1 | Find jobs by typing their status | [SV-10000](https://shopview.atlassian.net/browse/SV-10000) |

## NOT filed — and why

**Six of the sixteen candidates do not reproduce on the build** and were deliberately not filed. Full
evidence in `RE-VERIFICATION-2026-09-14.md`; in short, the search now finds the record in every case:
**A1** asset by unit number · **A2** asset by full VIN · **A3** vendor by email · **A4** part by its
part number · **C2** partial number · **C3** mid-word fragment.

**A1–A4 were the four the handoff called confirmed build defects.** Had they been filed as instructed,
four defects would have been on engineering's desk that anyone could disprove in half a minute.

**C4** (a matching type squeezed out by the 20-result cap) is **not filed** — my query returned 10
results, under the cap, so it cannot demonstrate the effect either way. It needs a query returning well
over 20 across several types before anything is claimed.

**A5** (work order / part sale cannot be created) is **not filed** — it still needs reproducing in the
browser, which the authoring session specifically asked for.

## Repair worth recording

**SV-9997** was created and then the run was cut off before its description and link were written. The
first resume skipped it because a key already existed for it. Fixed both: the ticket was completed, and
`file_tickets.py` now resumes on **completion** (description and link both recorded) rather than on the
mere existence of a key, so a cut-off can never again leave a half-written ticket behind.
