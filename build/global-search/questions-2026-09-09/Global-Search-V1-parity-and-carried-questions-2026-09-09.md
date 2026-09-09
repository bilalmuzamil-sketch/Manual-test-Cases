# Global Search V2 — questions for the PO

**Drafted 2026-09-09. NOT SENT** — a question sheet goes out last, once everything we can
answer ourselves is answered (Rule 66). **8 questions need an answer.** Two further rows are
kept visible with no answer needed, so nothing looks quietly dropped.

## Please answer these 8

### PO-GS-SUBSTR-1 — Searching by plate, part number or VIN

**What happens today.** If you type only PART of a number, we still find the record. Typing 4310 finds part AC-4310-XL; typing the last six characters of a vehicle's VIN finds that vehicle.

**What we need you to decide.** In the new search, must a partial number still find the record - or will people have to type the whole number exactly?

**Why it matters.** This is the single biggest risk to the new search being a step backwards. The new specification says identifiers need 'an exact match', which can be read either way. If it means the whole number, everyone who searches by a few digits today stops finding anything.

**Options.** (a) a partial number still finds the record, as today; (b) the whole number must be typed exactly

*Needed from Branko / Milos (PO). Open since 2026-09-09.*

### PO-GS-PARTSALE-1 — Who can see Part Sale results

**What happens today.** A person whose role covers Part Sales but NOT Work Orders is sent Part Sale results by the system, but the screen then hides them - so they see nothing.

**What we need you to decide.** Should the new search keep this exactly as it is, or should such a person actually see their Part Sales?

**Why it matters.** Changing it changes what a Part-Sales-only person can see. If we 'tidy it up' without a decision, we would be quietly changing who can see what.

**Options.** (a) keep today's behaviour unchanged; (b) let a Part-Sales-only person see Part Sale results

*Needed from Branko / Milos (PO). Open since 2026-09-09.*

### PO-REG-6 — Searching a work order by its status

**What happens today.** You can find work orders by typing their status - for example 'qualitycheck' or 'qc' returns work orders in quality check.

**What we need you to decide.** Was removing status from what the new search looks at a deliberate decision?

**Why it matters.** It was removed from the specification without a change-log entry, so we cannot tell if it was intended. If it was accidental, people lose a way of searching they use today.

**Options.** (a) the removal was intended; (b) it was accidental and status should stay searchable

*Needed from Branko / Milos (PO). Open since 2026-08-26.*

### PO-REG-1 — How search decides what you are allowed to see

**What happens today.** Search reuses the SAME permission list the whole application uses to decide which pages you can open (around twenty other places rely on it, including where you land after logging in).

**What we need you to decide.** Please confirm the new search will NOT change that shared permission list just for search.

**Why it matters.** If search changes the shared list, it can affect which pages people can open and where they land after logging in - far beyond search itself.

**Options.** (a) leave the shared list alone and give search its own rules; (b) change the shared list (needs a full re-test of navigation and login)

*Needed from Branko / Milos (PO). Open since 2026-08-26.*

### PO-REG-2 — Time Clock users and search

**What happens today.** Someone whose role is Time Clock gets no search results at all - the search returns completely empty for them.

**What we need you to decide.** Should Time Clock users continue to get no results?

**Why it matters.** This is an access boundary and the new specification does not mention it. If it changes by accident, Time Clock users could suddenly see customer and work order data.

**Options.** (a) keep Time Clock users seeing nothing; (b) let them see some results (please say which)

*Needed from Branko / Milos (PO). Open since 2026-08-26.*

### PO-REG-3 — How many characters before search starts

**What happens today.** Search waits until you have typed at least two characters before it looks for anything.

**What we need you to decide.** Should the new search keep the two-character minimum?

**Why it matters.** The new specification sets a new typing delay but never states a minimum, so we cannot tell whether two is still intended.

**Options.** (a) keep two characters; (b) a different number (please say which)

*Needed from Branko / Milos (PO). Open since 2026-08-26.*

### PO-GS-ASSET-SHOWALL — 'Show all' on asset results

**What happens today.** Not yet built - this is about the new search only.

**What we need you to decide.** Do asset results get a 'Show all' link inside the search panel, now that the separate full-page results view was dropped?

**Why it matters.** This reverses an earlier answer given over Slack, so we would like it confirmed in writing. Our test cases follow the newest specification in the meantime.

**Options.** (a) yes, assets get 'Show all'; (b) no, they do not

*Needed from Branko (designer + PO). Open since 2026-09-07.*

### PO-GS-EMPTY-1 — Wording shown before you type anything

**What happens today.** Not yet built - this is about the new search only.

**What we need you to decide.** Which wording is correct - 'Search for something', or 'Type to start searching for work orders, parts, customers and more'?

**Why it matters.** The specification and the design say different things, so one of them needs to win. Our test cases follow the specification in the meantime.

**Options.** (a) the specification wording; (b) the design wording

*Needed from Branko (designer + PO). Open since 2026-09-02.*

## No answer needed — kept visible for completeness

- **PO-REG-4 — Recording that someone used search.** NO LONGER NEEDED - answered by the specification itself. Version 1.5 removed all of the new tracking from the project, so there is no longer any clash with the existing usage event. It simply stays as it is.

- **PO-REG-5 — The order results appear in.** NO INPUT NEEDED - recorded for completeness. The new search introduces proper ranking. We treat that as an intended improvement, not something broken.
