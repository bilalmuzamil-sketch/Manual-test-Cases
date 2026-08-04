# API / NON-API SPLIT — defect pack 2026-08-04

**Why this file exists.** On 2026-08-04 the QA lead made API-related tickets a **separate, always-ask
gate** (now **Standing Rule 51**), verbatim:

> *"do not create the tickets which are related to API , if there are any ASK me (ask again if I have
> previously given a go ahead for the API tickets with the Non API tickets) and create them ONLY if I ask
> you to create them"*

The parenthesis is the point: **a batch approval does NOT cover the API item inside it.** *"File these
six"* was **not** authorisation for the API one among the six. This file makes the split **visible before
the next pass files anything**, so the ask can be made separately.

---

## THE TEST WE APPLY (reachability, not evidence type)

| | |
|---|---|
| **API-RELATED** | The defect is **invisible to a user AND to a manual tester**. It is reachable **only** by calling an endpoint directly, with a request the product's own screens **never send**. |
| **USER-FACING** | The **same failure also happens through the product's own screens**. It may still be *characterised* technically — a server error, a request id, an endpoint in the evidence — but **that does not make it API-related.** |

**Judge by reachability from the product, never by whether our evidence happens to be an endpoint
capture.** Four of these six were found with API probes; only **one** is actually API-only.

Read alongside **Standing Rule 24**: where the front end blocks an action and the back end allows it,
that is a **PASS, not a defect at all** — so it never reaches this file.

---

## THE SIX, CLASSIFIED

| # | Key | Summary (short) | Class | Why — the reachability reason | Status |
|---|---|---|---|---|---|
| 1 | [SV-8818](https://shopview.atlassian.net/browse/SV-8818) | PDF download fails with a server error on a medium-sized report view, on 5 of the 6 reports | **USER-FACING** | A tester clicks the three-dot menu → **Download (PDF)** on the report screen and the download fails. Fully reproducible from the screen; the image on the ticket shows the very control. | Open |
| 2 | [SV-8819](https://shopview.atlassian.net/browse/SV-8819) | Parts Velocity: **Turns / Yr** overstated on the *This Year* preset — divides by one day too few | **USER-FACING** | The wrong number is **printed in a column on screen**. Switch **Turns/Yr** on in the column chooser, pick the **This Year** preset, read the value. No back-end call needed to see it. | Open |
| 3 | [SV-8820](https://shopview.atlassian.net/browse/SV-8820) | Inventory Value reports the stock value for one day AFTER the date asked for | **USER-FACING** | The **"As of …"** line and the values under it are on the ordinary default view. A tester comparing the date on screen with the figures sees it. | Open |
| 4 | [SV-8821](https://shopview.atlassian.net/browse/SV-8821) | Creating an invoice from a completed work order fails with a server error | **USER-FACING — but technically characterised** | **This is the contrast case.** The failure happens when a person clicks **Create Invoice** on the work order's **Finance** tab; the ticket carries full on-screen steps that build the work order from scratch. The evidence is a server error and a request id, **but the screen route fails too**, so it is a user-facing defect. **Not withdrawn.** | Open |
| 5 | [SV-8822](https://shopview.atlassian.net/browse/SV-8822) | Saving a customer returns a server error instead of a validation error when a sales-rep id is supplied | **API-ONLY** | **Not reachable from any screen.** The customer dialog never sends the value in the shape that triggers it — the ticket's own Steps section says so: *"This one is only reachable through the interface behind the screen, so there are no on-screen steps."* No customer and no manual tester can hit it. | **WITHDRAWN — see below** |
| 6 | [SV-8823](https://shopview.atlassian.net/browse/SV-8823) | Inventory Value spreadsheet: money arrives as text, and the file ignores the chosen columns and re-orders them | **USER-FACING** | A tester downloads the spreadsheet from the report screen, opens it, and sees text-formatted money and the wrong column order. The ticket's image shows the on-screen order to compare against. | OBSOLETE — closed by the QA lead 2026-08-04 (his decision, untouched by us) |

**Count: 5 user-facing · 1 API-only.**

---

## SV-8822 — WITHDRAWN 2026-08-04

**The ruling, verbatim:**

> *"Yes Tickets related to API which you have already created can be withdrawn"*

**What was done, and what was deliberately NOT done:**

- **Priority set to `Low` first** (Standing Rule 53), so it does not sit closed at the wrong priority.
- **Closed by workflow transition — `Close` (id 8) → status `OBSOLETE`**, whose post-function set
  **`resolution: Done`**.
- **A plain-language closing comment** was added first, explaining that it was raised in error under our
  own filing rules because the behaviour is only reachable through a direct back-end call and is not
  visible to a user or a tester through the product — so it is being withdrawn rather than left open.
- **NOT DELETED.** Deletion is irreversible, and a withdrawn ticket with its reasoning on the record is
  worth more than a missing one.
- **The finding itself is NOT withdrawn.** It stays documented in
  `TICKET-5-customers-change-500.md` in this folder and in
  `build/report-suite/viu-2026-08-03/batch-sbc-sbr/ENV-DEFECTS.md`. **We withdrew the ticket, not the
  finding** — if it is ever wanted as a back-end hardening item, the write-up is ready.

**Do not re-file SV-8822 or its finding as a ticket.** If a future pass believes it should be raised, the
route is to **ask the QA lead separately**, per Rule 51.

---

## FOR THE NEXT PASS — the gate in three lines

1. Classify **every** finding here **before** filing anything, using the reachability test above.
2. Put the API-related ones in **their own section of the ask**, in plain words (Rule 7), and ask
   **separately** — **even if the batch has already been approved.**
3. File **only** what he says to file, **at priority `Low`** (Rule 53), **parented to the Epic with the
   owning story LINKED** (Rule 52).
