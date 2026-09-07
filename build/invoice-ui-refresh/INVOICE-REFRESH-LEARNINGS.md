# Invoice UI Refresh — LEARNINGS (how not to file a ticket that gets thrown back)

> **HOW TO FIND THIS FILE.** It is linked from `build/invoice-ui-refresh/PROJECT-STATE.md` (the
> canonical cold-resume doc) and from `build/defect-lane/REFUSAL-POSTMORTEM-2026-09-07.md`.
> **Retrieval drill — grep this file BEFORE measuring anything on an invoice document:**
> `grep -n "<what you are about to check>" build/invoice-ui-refresh/INVOICE-REFRESH-LEARNINGS.md`
> Started 2026-09-07 by the test-execution-and-defects lane. **Append, never rewrite.**

## LOOKUP INDEX — go straight to the row that matches what you are about to do

| If you are about to… | Read | Why |
|---|---|---|
| say "production has X and staging does not, so it is a defect" | **L4** | The refresh DELIBERATELY drops things. This killed 2 of 4 leads. |
| measure a font size in a PDF | **L3** | 1px = 0.75pt. A 12pt title IS the spec'd 16px. |
| claim a layout / ordering defect from extracted PDF text | **L2** | Content-stream order is NOT visual order. |
| say a field is missing from the order-reference area | **L5** | S3-N1 hides "Work Order" when trailing digits match. |
| quote a spec rule in a ticket | **L6** | The spec moved v45 -> v52; all 120 cases still cite v45. |
| read "actual behaviour" from anywhere | **L1** | THE cause of both refusals on this epic. |
| look up a work order's real number | **L7** | `GET /api/work-orders/view/{id}` -> `data.work_order.number`. |
| decide defect vs Task vs spec-gap | **L8** | This epic routes them differently, and it matters. |

---

## L1 · "ACTUAL" IS OBSERVED ON THE RUNNING ENVIRONMENT — NEVER READ FROM SOURCE
**Both refused tickets on epic SV-8218 died of this one fault**, and nothing else.
- **SV-9692** (job title 14px): *"That figure came from an older local copy of the template. On the
  branch the QA environment actually runs, the title is 12px, not 14px."* — Chris Ward, 2026-09-03.
- **SV-9695** (description below the job name): *"I raised it in error… That came from an older local
  copy of the template. On the branch the QA environment actually runs, the description is already
  rendered inline."* — Chris Ward, 2026-09-03.

**⇒ A value from a repo file, a template, a stylesheet or a code read may MOTIVATE a look. It may never
be reported as the build's actual behaviour.** State the URL + build marker every observation came from.
A supplied PDF is also not the running environment: it carries no build marker.

## L2 · PDF CONTENT-STREAM ORDER IS NOT VISUAL ORDER
Extracting staging page 2 in stream order put the financial summary *before* work line 03 — which would
have been a real-looking "sections print out of order" ticket. **Sorted by (y, x) it is correct**: line
03 at y=63-176, `SUMMARY` at y=220, totals at y=248-366 running beside the disclaimer in a second column.
**⇒ Always sort by (y, x) before claiming anything about order or position.** Two-column bands
interleave in the stream. Recipe: `page.get_text("dict")` -> collect `line["bbox"]` -> `sort((y,x))`.

## L3 · THE px<->pt TRAP — 1 CSS px RENDERS AS 0.75pt (spec rule S12-R5a)
A title measuring **12pt in the PDF IS the spec'd 16px**, not a 25% shortfall. Chris initially misread
this on SV-9685 (*"I answered too quickly off a code read"*), then corrected himself on SV-9694.
**⇒ Convert before comparing: `px = pt / 0.75`.** Verified 2026-09-07 across all eight sizes on the
staging document — every one matches spec exactly, so **SV-9694's rescale revert has landed**.

| element | pt | = px | spec px |
|---|---|---|---|
| job title | 12.00 | 16.0 | 16 |
| SCOPE OF WORK | 7.50 | 10.0 | 10 |
| LABOR / PARTS | 7.88 | 10.5 | 10.5 |
| doc-dates | 8.62 | 11.5 | 11.5 |
| shop-meta | 9.38 | 12.5 | 12.5 |
| body | 10.50 | 14.0 | 14 |
| line total | 11.25 | 15.0 | 15 |
| line no / shop-name | 13.50 | 18.0 | 18 |

**⇒ Any type-size finding on this document is A4-DUPLICATE of SV-9694. Do not file it as new.**

## L4 · 🛑 "PRODUCTION HAS IT, STAGING DOES NOT" IS NOT EVIDENCE OF A DEFECT
**Production is the OLD behaviour. This project's whole purpose is to change the document.** A refresh
deliberately REMOVES things, and the spec marks those removals **net-new**.
**Worked example that killed a lead — S2-R2 (Remit Payment To), verbatim:**
> *"When neither is configured, the block is not shown **(net-new: production previously fell back to
> printing the shop's own address as the remit-to)**. A location whose own remit-to setting points at
> that same location is not a configured payee: that is the dropped self-address case, so the block is
> not shown."*

Production's "Remit payment to" block printed **the shop's own address** (byte-identical to its
masthead) — i.e. exactly the fallback the refresh dropped on purpose. **Staging omitting it is correct.**
**⇒ THE CHECK: before filing any "staging lost X", grep the live spec for X and look for the words
"net-new", "dropped", "no longer" or "previously".**
**⇒ AND CHECK THE CONSEQUENCE RULE.** S2-R3 says that when Remit Payment To is hidden, Bill To must span
full width. Measured on the staging PDF via `page.get_drawings()`: card rect **x0=60.0 -> x1=535.3
(475.3pt) = the full content width. PASSES.**

## L5 · S3-N1 — A MISSING "WORK ORDER" FIELD IS USUALLY CORRECT
> *"The Work Order field is hidden when the trailing digits of the work order number equal the trailing
> digits of the document number… document 'INV-S-24914' with work order '24914' hides it."*

Live worked example, 2026-09-07: work order **`S-32136`**, document **`EST-S2-32136`** -> trailing runs
are **"32136"** and **"32136"** -> **match -> field correctly hidden.**
**Also renamed:** production labels it **"Service Order"**; S3-R1 labels it **"Work Order"**, with **no
colon** after order-reference labels. So "the Service Order field vanished" is two intended changes at
once, not a defect. *(Rule revised 2026-09-04 — the earlier wording compared the WHOLE work order number
and could never match, so an old reading of this rule will mislead. Read it live.)*

## L6 · THE SPEC MOVES FASTER THAN THE SUITE — RE-READ IT, EVERY TIME
Confluence **755990532**. Cases were authored at **v38**, re-stamped **v45**. Chris recorded **"Live page
v49"** on 2026-09-04 and **S12-R4 v52** the same day; the page's `lastModified` on 2026-09-07 is
**Sep 05, 2026**, and it differs from a 2026-09-03 snapshot by **104 lines**.
**⇒ ALL 120 SUITE CASES STILL CITE v45.** Quoting v45 in a ticket is the textbook *"obsolete"* refusal.
**⇒ Pull it to a FILE, never into context** (it is ~105 KB): the MCP `getConfluencePage` result exceeds
the token cap and is auto-saved to a tool-results file — extract `nodes[0].body` from that JSON.
Live snapshot kept at `execution-2026-09-07/spec-body-confluence-LIVE-2026-09-07-755990532.md`.
**⇒ The change log is the fastest read**: it is the last table in the body; `grep -n '| 2026-09' <file>`.

## L7 · GET THE REAL RECORD NUMBER FROM THE API — NEVER INFER IT FROM THE DOCUMENT
The document read `EST-S2-32136`, so the work order "obviously" was `S2-32136`. **It is `S-32136`.**
Inferring it would have inverted the S3-N1 trailing-digit test and produced a false defect.
**Recipe (from `build/APP-ACTIONS-PLAYBOOK.md`, reused not re-derived):**
`GET https://api.staging.shopview.com/api/work-orders/view/{id}` -> `data.work_order.number`.
Useful siblings on that payload: `authorizer_full_name`, `ibs_approval_code` (drives S3-R4),
`invoice_status`, `amount_paid`. **`/api/work-orders/{id}` without `/view/` returns 404.**

## L8 · DEFECT vs TASK vs SPEC-GAP — THIS EPIC ROUTES THEM DIFFERENTLY
- **Build diverges from an agreed, quotable, CURRENT value** -> `Story Defect`, **parent = the owning
  STORY** (SV-9694 is parented to SV-9151), priority Medium. An Epic parent is rejected HTTP 400.
- **The value is not agreed / the spec is silent** -> a **Task** titled **"Spec gap — …"**. Five of these
  exist on this epic (SV-9684/9685/9686/9687/9689) and **all five were accepted (Done)**; the two Bugs
  raised as build defects are the two that were refused.
- **A question about configuration or intent** -> a **Task**, label **`Clarification_needed`** (the QA
  lead's 2026-09-07 instruction).
**⇒ Choosing the wrong one of these three is itself a refusal risk.**

## L9 · ALREADY-KNOWN ISSUES ON THIS EPIC — CHECK BEFORE FILING (A4)
| Ticket | Covers | Status 2026-09-07 |
|---|---|---|
| **SV-9694** | ALL document type sizes (the 0.75 rescale) | Ready for QA — reverted, verified fixed |
| **SV-9671** | work lines splitting from their footers across page breaks | open |
| **SV-9644 / SV-9598** | wrap / charge-row dividers | ruled working-as-designed |
| **SV-9639** | Inter fonts not deployed on the QA branch | Code Review |
| **SV-9441** | mobile: invoice clipped on the left | Code Review |
| **SV-9649 / SV-9672** | finance-tab and PDF-download performance | Code Review |
| **SV-9646** | six spec points blocking cases | Code Review |
**Open and NOT to be filed over (they are questions Chris still owes):** whether a 5.1px micro-label on a
375px phone preview is acceptable (confirmed a zoom consequence, nothing clips, so S12-R11 holds).

## L10 · THE STORY STATUS GATE IS FAVOURABLE HERE — BUT CHECK IT EVERY TIME
All 14 stories under SV-8218 are **`TESTING QA`** (development done, handed to QA), so a gap is **not**
"pending work" and findings ARE admissible on that axis. **The epic itself is `In Progress` — that is
the EPIC's status and it does not make a story's gap unfinished work.** Check the owning STORY.
