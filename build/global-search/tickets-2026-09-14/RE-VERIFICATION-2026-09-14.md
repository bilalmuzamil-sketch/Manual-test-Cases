# 🛑 CORRECTED 14 September 2026 — THE SECTION BELOW MARKED "DOES NOT REPRODUCE" WAS WRONG

**The QA lead caught this, not me.** I re-verified by reading the search modal's **scope-tab count
badges** and treated `Assets (1)` as "the record was found". The badge says 1 while the **Assets tab
itself says "No results in Assets"** — the record shows under **All** and is missing from its own type
tab. That is the defect, stated more precisely than before, and I reported it as gone.

**Affected: A1, A2, A3, A4 and C2 — they DO reproduce.** They are being re-filed as Story Defects with
his evidence and my own once the search service on the branch is back up (it is currently answering
*"Search unavailable"*, so nothing can be measured right now).

**C3 (mid-word fragment) is not yet re-checked** under the corrected method and is neither confirmed
nor cleared.

**What was NOT affected:** the eight filed tickets. Those all showed **All (0)** — zero everywhere,
with nothing to click into — so no badge was mistaken for a result. They stand.

**The lesson is recorded** as L0079 in `build/LEARNINGS-LOG.md` and as a standard in
`build/skills/00-COMMON-CORE.md`: *a count is a claim about content, never the content; verify at the
surface the user acts on.*

---

# Re-verification of the 16 ticket candidates against the build as it stands — 14 September 2026

**Why this exists.** The QA lead authorised filing the 16 Global Search V1→V2 candidates handed over by
session `user-f8`. Standing Rule 62(c) / Rule 73 require the same thing every time: **a go-ahead is
permission to look again, not permission to file** — reproduce each candidate on the build as it stands
that day, close what no longer reproduces, and file only what does.

**I did that first, and it changed the answer for six of the sixteen.**

Environment: QA branch **sv9160** (`sv9160.qa.shopview.com`), signed in as admin, searched **through the
search modal in the UI**, per-type counts read from the app's own scope tabs. Every query has a
screenshot at `evidence/GS1-<tag>.png` and its raw reading in `GS1.json`.

**The instrument is proved both ways** (Rule 104): the same probe reads **0** for six queries and reads
**1–61** for others in the same session, so a zero is a real zero and a hit is a real hit.

---

## A · DOES NOT REPRODUCE — these must NOT be filed (6)

| # | Claim in the handoff | What the build actually did today |
|---|---|---|
| **A1** | Asset not findable by unit number; `ZZT-4471` → 0 | **Found.** `ZZT-4471` → Assets (1), the asset *ZZT-4471 · 2019 Freightliner Cascadia*, plus its 4 work orders. `ZZT4471` without the dash → the same |
| **A2** | Asset not findable by full VIN; `1FUJGLDR9KLZZ4471` → 0 | **Found.** The full VIN returns the same asset, Assets (1) |
| **A3** | Vendor not findable by email; `parts@kestrelsupply-zzt.com` → 0 | **Found.** Vendors (1) — *ZZAUTOTEST Kestrel Parts Supply*, labelled "Contact match" |
| **A4** | Stocked part not findable by its own part number; `ZZT-88-4412` → 0 | **Found.** Parts (1) — *ZZAUTOTEST Brake Chamber … 25 Available … ZZT-88-4412*. Same record the handoff named |
| **C2** | A partial number no longer finds a record *(predicted)* | **Prediction wrong.** `17580` → Work orders (1), the right one. The full number `S9160-17580` returns the same single row |
| **C3** | A mid-word fragment no longer finds a record *(predicted)* | **Prediction wrong.** `ridgeport` → All (8) including the customer *ZZAUTOTEST Bridgeport Hauling* |

**A1–A4 were the four "confirmed build defects" whose evidence I was told to cite rather than re-derive.**
Re-deriving it is what caught this. They may have been real when observed; they are not failing now.

## B · REPRODUCES — fileable (7)

| # | Query | Result today |
|---|---|---|
| **B1** | `ZZT-77-3300` catalogue-only part | All (0) |
| **B2** | `44872-9931` customer postal code | All (0) |
| **B3** | `bridgeporthauling-zzt.com` customer website | All (0) |
| **B4** | `Dispatch Supervisor` contact job title | All (0) |
| **B5** | `43055-2210` vendor postal code | All (0) |
| **B7** | `OHZZT471` asset licence plate | All (0) |
| **C1** | work-order status | `qualitycheck` → All (0). `Quality Check` → 28 rows, but they are *Approved* work orders matching on other text, **not** status matches |

**B6 reproduces, with a trap worth stating in the ticket.** `Ohio` returns Vendors (1) — but that vendor
is *Ohioville Diesel Services LLC*, matched on its **name**, not its state. The seeded Ohio vendor
*ZZAUTOTEST Kestrel Parts Supply* is **not** returned, while it **is** findable by `Kestrel` and by its
email. So the loss is real; anyone glancing at "Vendors (1)" would wrongly conclude otherwise.

## C · NOT DEMONSTRATED — needs a different query before it can be filed (1)

**C4** (a matching type squeezed out by the 20-result cap). My query `ZZAUTOTEST` returns All (10) with
every type represented — under the cap, so it cannot show starvation. A query that *could* is
`Brake Chamber`: **All (61) — Work orders (20), Parts (20), Purchase orders (20), Customers (1),
Vendors (0), Assets (0)**. Three types at exactly 20 and a total far over the cap is suggestive, but I
have not yet shown a type that *has* matches being reduced to zero. **Not filed on this evidence.**

## D · STILL OUTSTANDING (1)

**A5** — work order / part sale cannot be created (HTTP 500). Not yet reproduced in the browser. The
other session asked specifically for this and it is the one candidate its author could not close.

---

## What I am doing about it

1. **Not filing A1, A2, A3, A4, C2, C3.** Filing a defect that an engineer disproves in thirty seconds
   costs the QA lead more than the ticket is worth, and Rule 62(c) says to close it and say so.
2. **Filing the seven that reproduce**, plus B6 with its trap spelled out.
3. **Reporting C4 as needing a better query** rather than filing a prediction as a measurement (Rule 12).
4. **Telling session `user-f8`**, whose two files say A1–A4 are confirmed — that record is now wrong and
   should not be acted on by anyone else.

**This is not a criticism of the authoring session.** Its evidence was captured on an earlier build; the
index may since have been rebuilt, or the fix may have shipped. Which of those it is, is engineering's
question, not mine. What matters is that the build today does not show the failure.
