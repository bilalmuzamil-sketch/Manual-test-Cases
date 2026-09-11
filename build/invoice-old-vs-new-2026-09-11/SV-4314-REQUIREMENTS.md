# SV-4314 — Invoice view enhancement: requirements

Derived from **[SV-4314 "BE Invoice view enhancement"](https://shopview.atlassian.net/browse/SV-4314)**
— Task, **Done**, labels `QAcomplete` + `Staging_Verified`, parent
[SV-3170](https://shopview.atlassian.net/browse/SV-3170). Reporter Jasna Mladenovic (PO), assignee
Dipesh Changawala. Read live 2026-09-11: description, acceptance criteria and all 22 comments.

Every requirement below carries its source. **Where the source is a comment, it is a PO ruling made
during build or QA that the ticket description was never updated to contain** — those are marked
**[comment ruling]** and are as binding as the description (latest authoritative source wins).

Nothing here is invented. Where the ticket is silent, it says so rather than filling the gap.

---

## Scope

| | |
|---|---|
| **What changes** | The weight (bold / not bold) of named elements on the customer-facing document, and a new row-type label before each item's description. |
| **What does not change** | Figures, wording, layout, page size, columns. Only weight and the new label. |
| **Surfaces** | Invoice **preview**, **email** copy, **downloaded** copy (PDF), **printed** copy — all four (AC 3). |
| **Documents** | The ticket says "all invoice views" and does not enumerate document types. **Not specified** — see OQ-3. |
| **Where the template lives** | Back end. *"the whole template comes to us from BE, we just show it on our side"* — Stefan Mitrovic, 2025-09-30. |

---

## The bold requirement, at a glance

SV-4314 is written as a **closed list of removals** — *"Remove the bold text from the below text"* —
so the requirement for what must be bold is: **everything that is not on that list keeps the bold it
already had**, plus one element the ticket explicitly protects.

### Must be bold

| # | Element | Where on the document | Why it is bold |
|---|---|---|---|
| 1 | **"Line Total"** — the words only, never the amount | per-line totals block, right-hand side | **Explicitly protected** — AC 1: *"line total text should remain bold"* |
| 2 | Shop name | top left of the masthead | not on the removal list |
| 3 | Document label — "Estimate: EST-…" / "Invoice: …" | top right of the masthead | not on the removal list |
| 4 | **"Bill To"** | left-hand section heading | not on the removal list |
| 5 | **"Remit payment to"** | right-hand section heading | not on the removal list |
| 6 | Unit · VIN/Serial # · Asset · Mileage · Eng Hrs | asset table — **headers only**, not the values | not on the removal list |
| 7 | Service Order · Terms · Due date · Customer PO · Authorizer | second table — **headers only**, not the values | not on the removal list |
| 8 | Description · Quantity · Rate · Amount | line-table column headers | not on the removal list |
| 9 | The job / line title ("What are you doing?") | first row of every line | not on the removal list |
| 10 | Labor · Parts · Shop supplies · Subtotal · Total — the **labels** | summary block, foot of the document | only the *amounts* were ruled out (S1-R9, S1-R10) |
| 11 | "Customer signature:" · "Printed name:" · "Date:" | signature block | not on the removal list |

### Must not be bold

Part Number · Part Description · "Parts Total" (label **and** amount) · "Labor Total" (label **and**
amount) · "Why are you doing it" · the **Line Total amount** · the "Labor" and "Parts" row labels ·
the **Subtotal amount** · the **Total amount**.

### The three that are easy to get wrong

- **"Line Total"** — the words are bold, the amount beside them is not. Same row, two weights.
- **Subtotal and Total** — the words are bold, the amounts are not. This came from a comment ruling,
  not the ticket body, so it is easy to miss.
- **"Parts Total" and "Labor Total"** — neither the words nor the amount. These behave differently
  from Line Total directly above or below them.

---

## S1 — Text weight

### S1-R1 — Part Number is not bold
The part number shown on a part row prints in normal weight, not bold.
*Source: description bullet 1; AC 1.*

### S1-R2 — Part Description is not bold
The part description shown on a part row prints in normal weight, not bold.
*Source: description bullet 2; AC 1.*

### S1-R3 — "Parts Total" is not bold
The per-line **"Parts Total"** row prints in normal weight — **both the label and its amount**.
*Source: description bullet 3; AC 1. Amount added by* **[comment ruling]** *Jasna Mladenovic,
2025-10-13: "can you unbold labor total and parts total on the line level".*

### S1-R4 — "Labor Total" is not bold
The per-line **"Labor Total"** row prints in normal weight — **both the label and its amount**.
*Source: description bullet 4; AC 1; same comment ruling as S1-R3.*

### S1-R5 — "Why are you doing it" is not bold
The line's "Why are you doing it" text prints in normal weight.
*Source: description bullet 5; AC 1.*

### S1-R6 — The Line Total **amount** is not bold
The dollar amount on the per-line **"Line Total"** row prints in normal weight.
*Source: description bullet 6 — "The line total dollar amount. **Not the text.**"; AC 1.*

### S1-R7 — The Line Total **label stays bold**
The words **"Line Total"** remain bold. This is the one element the ticket explicitly protects, and it
is the only bold left inside a per-line totals block.
*Source: AC 1 — "line total text should remain bold".*

### S1-R8 — The "Labor" and "Parts" row labels are not bold
The row-type labels required by S2-R1 and S2-R2 print in normal weight.
*Source:* **[comment ruling]** *Jasna Mladenovic, 2025-10-09: "Labels Labor and Parts should not be
bolded text."*

### S1-R9 — The Subtotal **amount** is not bold
In the summary block at the foot of the document, the **Subtotal amount** prints in normal weight. The
**"Subtotal" label stays bold.**
*Source:* **[comment ruling]** *Jasna Mladenovic, 2025-10-09: "amount for total and and subtotal
shouldn't be bolded, just text." Given in answer to Bilal Muzamil's question of 2025-10-08, which
noted these were bold and that the description did not mention them.*

### S1-R10 — The Total **amount** is not bold
In the summary block, the **Total (grand total) amount** prints in normal weight. The **"Total" label
stays bold.**
*Source: same comment ruling as S1-R9.*

### S1-R11 — Nothing else changes weight
Every element the ticket does not name keeps the weight it already had. Specifically, these stay
**bold**: the shop name and document label; "Bill To" and "Remit payment to"; the asset-table headers
(Unit, VIN/Serial #, Asset, Mileage, Eng Hrs); the Service Order row headers (Service Order, Terms,
Due date, Customer PO, Authorizer); the line-table column headers (Description, Quantity, Rate,
Amount); the job / line title; the summary **labels** (Labor, Parts, Shop supplies, Subtotal, Total);
and the signature-block labels (Customer signature:, Printed name:, Date:).
*Source: derived — the ticket is a closed list of removals ("Remove the bold text from the below
text"), so anything not on that list is out of scope. Listed here because a reader needs to know what
must NOT be touched.*

---

## S2 — Row-type labels

### S2-R1 — Labour items carry a "Labor" label
Every labour item within a line displays the word **"Labor"** before its description.
*Source: description; AC 2.*

### S2-R2 — Part items carry a "Parts" label
Every part item within a line displays the word **"Parts"** before its description.
*Source: description; AC 2.*

### S2-R3 — The label is aligned with the item's price
The label sits on the same row as the price for that item — that is, **bottom-aligned** within the
item, not at the top of it.
*Source: AC 2 — "aligned with price on the line item"; pinned by* **[comment ruling]** *Jasna
Mladenovic, 2025-10-13 ("third option is looking the best, bottom alignment") and 2025-10-15 ("it
should be aligned with price for the line item, in this case at the bottom. I confirmed this with
Fabian").*

### S2-N1 — Which description row the label lands beside
Where a line has several description fields, the label prints in front of whichever of them the price
prints on. Nebojsa Glavinic recorded the observed behaviour on prod, 2025-10-22: the label appears in
front of "Why Are You Doing it?", "What are you doing?" or the Tech Story *"depending on which line is
missing"*.
*Source: comment, 2025-10-22 — recorded as observed behaviour, **not ruled on**. See OQ-1.*

---

## S3 — Consistency

### S3-R1 — All four outputs are identical
The changes in S1 and S2 apply to the **invoice preview**, the **email copy**, the **downloaded copy
(PDF)** and the **printed copy**, with no difference between them.
*Source: AC 3; reinforced by Fabian Bonjean, 2025-09-30: "Both the preview view in the finance tab and
the download/email PDF copy should be identical and these changes should take effect in all places".*

---

## Verification on the record

| Who | When | Result |
|---|---|---|
| Bilal Muzamil | 2025-10-15 and 2025-10-16 | All acceptance criteria met; preview, email, download and print all Passed |
| Nebojsa Glavinic | 2025-10-16 | "Ready for Prod." |
| Nebojsa Glavinic | 2025-10-22 | **Verified on Prod**, item by item — all six removals and both labels Passed, all four outputs Passed |

---

## Open questions — raised, never answered

These are **not requirements**. They are recorded because the ticket closed with them open, and each is
still visible on the document today.

### OQ-1 — "Payments" and "Balance" weight
Nebojsa Glavinic, 2025-10-22: *"The only noticeable difference is that the **Payments** and **Balance**
labels are bolded in the Invoice view but not in the PDFs. However, this was outside the scope of the
ticket."* Never ruled on. The consequence is that these two are the only summary labels not bold in the
PDF, so the PDF disagrees with the screen and with its own neighbouring rows.
**Needs: a PO ruling — bold like the other summary labels, or regular.**

### OQ-2 — A Fixed Line shows the wrong row-type label
Nebojsa Glavinic, 2025-10-22: *"Line4: `Fixed Line Total` → not showing `Parts` label but showing
`Labor` label even if all portion was set to parts (so maybe not show anything for the Fixed Line total
or show labels per portions if they exist)."* Never ruled on.
**Needs: a PO ruling — no label on a fixed line, or a label per portion.**

### OQ-3 — Which documents are in scope
The ticket says "all invoice views" and never names the document types. Estimate, Work Order Invoice,
Credit Invoice, Parts Sale Estimate, Parts Sale Invoice and Part Sale Credit all use these templates.
**Needs: confirmation that all of them are covered.**

---

## Context a reader needs

- **This ticket is the reason today's documents look different from a 2024–2025 invoice.** A document
  rendered before SV-4314 shipped has bold part descriptions, bold Parts/Labor/Line totals and no
  Labor/Parts labels. Comparing such a document against a current one will show exactly the
  differences S1 and S2 require.
- **Customer feedback on this change is already logged on the ticket.** MAX (Qazi Sufyan), 2025-10-22:
  *"multiple customer feedback reports regarding the Invoice View Enhancement (bold text and label
  changes)… requests to bring back bold part numbers/descriptions and concerns about print
  readability."* Jasna Mladenovic answered the next day: *"we got a lot of requests from ex Fullbay
  users regarding Parts/Labor, and we removed bold text based on the feedback and we're saving printer
  ink for them without bold… keep collecting feedback… We'll ask designer to work on this but it is not
  top priority for now."* A feedback spreadsheet is linked on the ticket. So a request to bring the
  bold back is **a change to these requirements, not a defect against them.**
- **These requirements are not superseded by the Invoice UI Refresh
  ([SV-8218](https://shopview.atlassian.net/browse/SV-8218)).** That refresh defines the *Modern*
  design. SV-4314's rules live in the *Legacy* template, which the Invoice Design Selection spec
  ([SV-9892](https://shopview.atlassian.net/browse/SV-9892)) requires to be *"byte-identical to
  v26.35.10"* — and v26.35.10 contains SV-4314.
