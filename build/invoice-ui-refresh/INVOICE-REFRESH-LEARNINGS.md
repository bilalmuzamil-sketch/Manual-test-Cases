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
| say a missing Work Order field is correct | **L5** | ⛔ SUPERSEDED 2026-09-07 — the QA lead ruled the Work Order number MUST appear. |
| quote a spec rule in a ticket | **L6** | The spec moved v45 -> v52; all 120 cases still cite v45. |
| read "actual behaviour" from anywhere | **L1** | THE cause of both refusals on this epic. |
| look up a work order's real number | **L7** | `GET /api/work-orders/view/{id}` -> `data.work_order.number`. |
| check a finding against the DESIGN document | **L11** | The design is a STATEFUL prototype; its CSS encodes the hide states. |
| test ANY conditional hide-rule (the general logic) | **L13** | THE DEAD-RULE TEST. A condition true BY CONSTRUCTION kills its field. |
| decide whether a spec/design/staging difference is a defect | **L12** | THE DECISION MATRIX. Direction matters: missing != extra. |
| report something you hit through the API | **L16** | If the UI does it fine, an API-only failure is NOT reported. |
| WRITE a ticket (copy the approved shape) | **L15** | ⭐ SV-9770 IS THE APPROVED TEMPLATE. Copy its section order exactly. |
| FILE a ticket on this project (exact field shape) | **L14** | Task needs Product Area; a Task cannot be parented to a Story. |
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

## L5 · ⛔ SUPERSEDED 2026-09-07 BY THE QA LEAD — THE WORK ORDER NUMBER **MUST** APPEAR
**QA LEAD'S RULING, 2026-09-07 (binding, supersedes the reading below):** *"the Work order number should
appear on the invoice like it is apeparing in the design, the number can be different from teh design
because the design is just a design with mock data."*
**⇒ THE EXPECTATION IS: the Work Order number APPEARS on the Estimate and the Invoice.** The design's
mock number (`S3-4176`) is mock data — the VALUE is irrelevant, the PRESENCE of the field is the
requirement. **Do not treat a missing Work Order field as correct.**

**WHY THIS IS A STRONG FINDING AND NOT JUST AN OVERRIDE — the arithmetic of S3-N1 makes the field DEAD.**
S3-N1 (revised 2026-09-04) hides the field when *"the trailing digits of the work order number equal the
trailing digits of the document number"*. **But the document number is DERIVED FROM the work order
number**, so those runs match by construction on every ordinary record:

| | work order | document | trailing run | S3-N1 verdict |
|---|---|---|---|---|
| live staging, 2026-09-07 | `S-32136` | `EST-S2-32136` | `32136` = `32136` | hidden |
| the DESIGN's own mock | `S3-4176` | `EST-S3-4176` | `4176` = `4176` | would hide — **yet the design SHOWS it** |
| spec's own example | `S2-5468` | `INV-S2-5468` | `5468` = `5468` | hidden |

**⇒ Under S3-N1 as revised, the Work Order field can essentially NEVER appear on a normal document — and
the design, production, and the QA lead all say it should.** The design even contradicts S3-N1 in its own
default state. That is a **spec-vs-design conflict on visibility**, and the spec's own closing clause
sends exactly that to the PO: *"A conflict that cannot be resolved by that split goes to Chris W."*
**⇒ FRAME THE TICKET THAT WAY — "S3-N1 hides the field on every document, contradicting the binding
design and production" — NOT as a bare "the field is missing".** The bare version invites the reply
"working as specified, see S3-N1"; the framed version cannot be answered that way.

*(Kept for the record, the reading this supersedes: until 2026-09-07 this lane read S3-N1 literally and
concluded a missing Work Order field was spec-correct. The QA lead corrected it. The literal reading was
not careless — it was the current spec text — which is exactly why the design and the real-world effect
of a rule must be checked against a rule, not just the rule read on its own.)*

**Also still true and independent of the above:** production labels the field **"Service Order"**; S3-R1
labels it **"Work Order"**, with **no colon** after order-reference labels.

## L5-OLD · [SUPERSEDED] the literal S3-N1 reading
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

## L11 · 🛑 CHECKING THE DESIGN — IT IS A STATEFUL PROTOTYPE, NOT A STATIC PICTURE
**The QA lead's standing instruction (2026-09-07):** where something absent from the build is justified
by the spec **but the DESIGN shows it**, that is a **Story Defect against the design**, and the ticket
says the design shows it. **So the design check is mandatory, not optional.** But run it correctly:

**(a) THE AUTHORITY SPLIT, verbatim from the live spec — read it before calling anything a conflict:**
> *"This spec defines the information and the exact wording that must appear on each document, **and the
> rules for when each piece of content is shown or hidden.** The Design Document is the **binding visual
> reference**… **Where the prototype and this spec disagree on content or wording, this spec is the
> source of truth; on appearance, the Design Document is the source of truth.** A conflict that cannot be
> resolved by that split goes to Chris W."*

**⇒ VISIBILITY (whether a thing shows) is the SPEC's. APPEARANCE (size, weight, ink, spacing, order,
width, treatment) is the DESIGN's — and there the design WINS and a divergence IS a Story Defect.**

**(b) 🔑 THE TRAP THAT WOULD HAVE PRODUCED A FALSE DEFECT.** The design export is an interactive HTML
prototype (`Design invoice refresh_files/saved_resource.html`, ~1.9 MB, ONE line). Its mock renders **one
example state**, and **its CSS encodes all the other states as `.wrap.<state>` classes.** So *"the mock
shows the Work Order field"* does **NOT** mean *"the design requires it always"*.
Proven 2026-09-07 — the design's own rule:
```css
/* conditional order + asset fields, and work-state */
.wrap.wo-match .chip-wo, .wrap.no-po .chip-po, .wrap.no-auth .chip-auth, … { display:none }
.wrap.no-remit .addr-row{ max-width:none; }   /* Remit To -> Bill To spans the full width */
.wrap.ps .chip-wo, .wrap.ps .chip-appr{ display:none; }   /* parts sale */
```
`wo-match` **is S3-N1's condition modelled in the design.** The design therefore AGREES that the Work
Order chip hides when the numbers match; the mock just shows the default state. Same for `no-remit`.

**⇒ THE DRILL, before claiming the design and the build disagree:**
1. `grep -o 'chip-<thing>\|<thing>' ` the design HTML to find the element's class.
2. **Search the CSS for a `.wrap.<state> .<class>{display:none}` rule.** If one exists, the design models
   the hide and there is **no conflict** — the mock is just one state.
3. Only if **no** state rule exists, and the spec is silent or the difference is APPEARANCE, is it a
   Story Defect citing the design.
Extraction recipe (the file is one huge line, so `grep -o -E '.{240}term.{240}'` FAILS — use Python):
`re.finditer(term, s)` -> slice ±250 chars -> `re.sub(r'<[^>]+>',' | ',seg)` -> `html.unescape`.

**(c) WORKED RESULT, 2026-09-07.** Design mock shows `Work Order S3-4176` on a document suffixed
`-S3-4176`, and `Remit Payment To — Northgate Fleet Billing Inc, c/o Interstate Billing Service` (a
**third-party integrated-billing payee**, NOT the shop's own address). Both are the *shown* states of
conditional elements, and both match what the spec requires. **Neither is a defect.**

## L12 · 🛑 THE DECISION MATRIX — SPEC vs DESIGN vs STAGING (QA lead, 2026-09-07)
**The direction of the difference decides the verdict. "Missing" and "extra" are NOT symmetrical.**

| # | Spec / stories | Design | Staging | VERDICT |
|---|---|---|---|---|
| 1 | **says hide** (a stated condition) | — | hides it | **NOT a defect.** Spec owns visibility. Worked: L1 (S2-R2), L4 (S3-N1), Unit (S4-N1). |
| 2 | **SILENT** | **SHOWS it** | **MISSING** | **🔴 STORY DEFECT — raise it, citing the DESIGN.** Say the design shows it and attach a **screenshot of the design**. Precedent on this epic: SV-9684 (*"the element IS in the binding Design Document but was never written into Story 5"*). |
| 3 | **SILENT** | **does NOT show it** | **SHOWS it** | **NOT a defect — STAGING WINS.** Extra content the design lacks and the spec never mentions is treated as an **environment/configuration matter**, not a build fault. Worked: **"Supplies %"** (the shop-supplies percentage in the label) — it is a location setting, and the QA lead corrected it in the environment. |
| 4 | says show | — | missing | **Story Defect** (ordinary spec-backed defect). |
| 5 | **conflict on APPEARANCE** (size, weight, ink, spacing, order, width, treatment) | design differs from build | — | **Story Defect citing the DESIGN** — the design is the source of truth on appearance. |
| 6 | **conflict on CONTENT / WORDING / VISIBILITY** | design differs from spec | — | **Spec wins.** Only escalate to Chris W. if the split cannot resolve it. |

**The QA lead's own words, 2026-09-07:** *"if something missing is justified as per the specs but they are
not missing in the design we need to create the story defect based on the design too and we may need to
mention that the design shows that"* (row 2) · *"if it is not mentioned in the specs or stories to show or
not give the staging the precedence if staging is not missing something rather showing something like
'Supplies %' because in that case the supplies % is the configuration matter of the environment"* (row 3).

**⇒ THE ONE-LINE TEST: the design can only ADD a requirement, never REMOVE one.** Something the design
shows and the build lacks is a gap worth raising. Something the build shows and the design lacks is
configuration, not a fault — do not raise it.
**⇒ AND BEFORE ROW 2 FIRES, RULE OUT A DATA/STATE CONDITION** (L11(b)): check for a `.wrap.<state>` hide
rule in the design's CSS **and** check the record's own data. Every candidate so far died on that check —
`vehicle.unit = None` (S4-N1), `ibs_approval_code = None` (S3-R4), no remit payee (S2-R2).

## L13 · 🔑 THE DEAD-RULE TEST — apply this to EVERY conditional hide-rule, not just the Work Order one
**Generalised 2026-09-07 at the QA lead's instruction (*"understand the logic for similar things in other
tests too"*).** L5's Work Order finding is one instance of a reusable test.

### The test — four questions, in order
1. **What is the hide condition?** Quote it from the LIVE spec.
2. **🔑 CAN THAT CONDITION EVER BE FALSE IN NORMAL DATA?** If it is satisfied **BY CONSTRUCTION** — because
   one value is *derived from* the other, or defaulted, or always equal — then **the rule hides the field
   on every ordinary record and the field is DEAD.** A field that can never appear is almost never the
   intent.
3. **What does the DESIGN do in that same case?** If the design's own default state SHOWS the field where
   the rule would hide it, that is a **spec-vs-design conflict on visibility**.
4. **What does PRODUCTION do?** Production showing it corroborates that the field is expected.
**⇒ Dead by construction + design shows it + production shows it = RAISE IT. Frame it as "the rule hides
the field on every document", never as "the field is missing" — the bare version is answered with
"working as specified".**

### Applied to all 17 hide-rules in the live spec (2026-09-07)

| Rule | Hide condition | Can it be false in normal data? | Verdict |
|---|---|---|---|
| **S3-N1** Work Order | trailing digits of WO == trailing digits of document | **NO — the document number is DERIVED from the work order number, so they match by construction** | **🔴 DEAD RULE — the only one. Raise it.** |
| S1-N1 masthead address parts | each empty | yes — data | live, correct |
| S2-N1 Bill To address parts | each empty | yes — data | live, correct |
| S2-N2 Remit Payment To | no payee configured | yes — configuration | live, correct |
| S3-N2 Customer PO | empty | yes — staging SHOWS `Customer PO 9989` | live, correct |
| S3-N3 Authorizer | empty | yes — staging SHOWS `Authorizer Savannah Tran` | live, correct |
| S3-N5 Approval Code | empty | yes — `ibs_approval_code = None` here | live, correct |
| S4-N1 Unit / Plate / Mileage / Eng Hrs | each empty | yes — staging shows Plate, Mileage, Eng Hrs and hides ONLY Unit, which is genuinely `None` | live, correct |
| S4-N2 VIN / Serial | none, or literal "Unknown" | yes — data | live, correct |
| S4-N3 asset section | no asset attached | yes — data | live, correct |
| S5-R7 labor/parts figures | per-setting | yes — configuration | live, correct |
| S6-N1 Declined Work | no declined lines, or toggle off | yes — data + toggle | live, correct |
| S7-N1 Adjustments heading | no adjustments | yes — data | live, correct |
| S8-R7 $0.00 payment row | amount is $0.00 | yes — data | live, correct |
| S8-N2 paid banner | no portal payment | yes — data | live, correct |
| S9-N1 disclaimer | none configured | yes — configuration | live, correct |
| S9-N2 footer tax identifier | none configured | yes — staging SHOWS `GST# 812694966 RT0001` | live, correct |

**⇒ RESULT: 16 of 17 hide-rules are data- or configuration-dependent and behave correctly on staging.
Exactly ONE — S3-N1 — is true by construction.** That isolation is what makes the finding strong: it is
not "a field is missing", it is "one rule in seventeen is written so it can never be false".

### Carry this into execution
When a case expects a field and the document does not show it, **do not stop at "a hide-rule covers it"**.
Run the four questions. Most of the time the rule is legitimate and the case passes; when the condition is
structural, you have found a real defect that the literal spec text would otherwise have hidden from you.

## L14 · FILING ON THIS PROJECT — the exact field shape, learned by doing it (2026-09-07)
**Filed: [SV-9770](https://shopview.atlassian.net/browse/SV-9770)** - Task, "Work Order number never
appears on the Estimate or Invoice", label `Clarification_needed`, parent SV-8218, relates to SV-9142.

| Thing | Task (hierarchy 0) | Story Defect (hierarchy -1) |
|---|---|---|
| **Product Area** (`customfield_10153`) | **REQUIRED** - creation fails `"Product Area is required"` until set. Invoice work = **"Work Orders"** (`id 10120`) | **absent on the type** - do not send it |
| **parent** | the **EPIC** (SV-8218). A Task **CANNOT** be parented to a Story - same hierarchy level | the **owning STORY**. An Epic parent is rejected HTTP 400 |
| attaching it to the owning story | **`relates to` link** (this is how "attach to the story" is satisfied for a Task) | parent + also a `relates to` link |
| priority | Medium | Medium |

**⇒ CLAUDE.md's "no Product Area (absent on this type)" is TRUE FOR STORY DEFECT ONLY.** On a Task it is
mandatory. That one line cost a failed create; it is written here so the next one does not.

**Inline images that actually render:** commit the annotated PNGs to this PUBLIC repo, push, **curl each
raw URL for 200 BEFORE posting**, then use an ADF `mediaSingle` > `media` node with
`{"type":"external","url":"<raw.githubusercontent.com URL>"}`. External media needs no attachment upload
and no media-services UUID. Raw URL shape:
`https://raw.githubusercontent.com/bilalmuzamil-sketch/Manual-test-Cases/<branch>/<path>/<file>.png`

**Playwright on this image:** the pip package expects browser build **1234**, the image ships **1194**.
Launch with `executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"` and `--no-sandbox`.
**Never run `playwright install`.** Geometry for annotation boxes comes from `element.bounding_box()`
(design) or the PDF text bbox scaled by `150/72` (a 150-dpi page render).

**Capturing the live document (the evidence that makes a ticket stick):**
`POST /api/work-orders/invoices/estimate` with `{work_order_id, type, issue_date, due_date}` -
`type=html` and `type=pdf` both return **200**. `type=invoice`/`estimate` return 500. The
`/api/invoices/preview?invoice_id=...` route needs an invoice_id, which an **un-invoiced** work order does
not have (`invoice_id: ''`) - the Estimate/Invoice toggle previews an invoice before one exists.

**🛑 NEVER put a TestRail case id, C-id or TestRail link in a ticket body** (QA lead, 2026-09-07). Design
reference first, then the spec reference. The case mapping stays in our records only.

## L15 · ⭐ THE APPROVED TICKET TEMPLATE — SV-9770 (QA lead, 2026-09-07)
**QA lead, verbatim, on [SV-9770](https://shopview.atlassian.net/browse/SV-9770):** *"Exactly that is how
you will create cases in similar situations."*
**⇒ SV-9770 IS THE CANONICAL PATTERN. Open it, copy its shape, do not invent a layout (Rule 16).**

### The section order — this order is the approved part, not just the content
1. **One plain sentence saying what decision is needed** (or what is wrong). No preamble.
2. **`What the design shows`** — **the DESIGN REFERENCE COMES FIRST**, always.
   Then the annotated design exhibit inline, then one italic caption line explaining that the mock's
   values are sample data and the **presence of the element** is the requirement.
3. **`What the build shows today`** — the plain statement, then the annotated build exhibit inline.
   Name the document number, the record number and the customer.
4. **`What the specification says`** — **the SPEC REFERENCE COMES SECOND**. Name the rule id, the
   Confluence page id and the date read, then **quote the rule verbatim in a blockquote**.
   Where the build follows the rule correctly, **say so plainly** — "this is not a coding mistake" —
   because that is what stops a reviewer arguing the point instead of answering it.
5. **`Why we think it needs a decision`** — the argument, with a short bullet list of concrete
   worked examples (ours, the design's, and the spec's own example).
6. **`rule` divider**, then **`Where this was seen`** LAST — environment, build marker, date, the exact
   record, and the click path.

### The hard rules baked into it
- **🛑 NEVER a TestRail case id, C-id or TestRail link in the body.** That mapping stays in our records.
- **Design reference first, spec reference second.** That ordering is the QA lead's explicit instruction.
- **Plain layman English throughout.** No endpoints, no HTTP codes, no internal field names, no jargon.
- **Both exhibits inline and annotated** — box on the exact element, arrow, caption in a band BELOW the
  image so nothing is covered. Green = the correct/expected state, red = what the build does.
- **Every number traceable to something captured this pass on the running build**, with the build marker.
- **Concise.** SV-9770 is about one screen of reading. A long ticket is one nobody finishes.

### Field shape (see L14 for the full table)
`Task` + label **`Clarification_needed`** + parent **the EPIC** + **`relates to` the owning story** +
priority **Medium** + Product Area set. For a build-vs-agreed-value defect instead: `Story Defect`,
parent **the owning STORY**, no Product Area.

### When to use which
- **A question / a rule that needs a ruling** -> this template, as a **Task + `Clarification_needed`**.
- **The build plainly diverges from an agreed, current, quotable value** -> same template, filed as a
  **Story Defect** parented to the owning story.
Either way the section order above does not change.

## L16 · 🛑 IF IT WORKS THROUGH THE UI, DO NOT REPORT THE API-ONLY FAILURE (QA lead, 2026-09-07)
**Verbatim:** *"If it is working through UI then dont report what is replicated through API only."*

**⇒ THE TEST, before reporting anything found via a direct API call:** can a user do this same thing
through the product's own screens? **If YES and it works there, the API-only failure is NOT a finding
and is NOT reported** — not as a defect, not as an observation, not as a footnote. It is our tooling
hitting a path the product does not use.
**⇒ Only if the failure ALSO occurs through the screens is it real** — and then it is an ordinary
user-facing finding, described from the screen, not from the endpoint.

**Worked example, 2026-09-07 (dropped under this rule):** `POST /api/workplaces/change` answered 400
`tax: Missing required parameter` for `tax_id`, then **500** for `tax`. Administration → Locations
edits the same record perfectly well. **So it is not reported.** *(The record was still re-read live
afterwards and confirmed byte-identical — core §2.6, a 500 can follow a write that landed. Verifying is
not the same as reporting.)*

**This sharpens Rule 51 rather than replacing it.** Rule 51 says an API-only finding is *asked about
separately*; this says that where the UI does the job, there is nothing to ask about. The reachability
test is unchanged: judge by whether a screen can reach it, never by whether our evidence happens to be
an endpoint capture.

**⇒ PRACTICAL CONSEQUENCE FOR SEEDING: an API 500 while seeding is a TOOLING problem, not a finding.**
Switch to the UI and carry on (Rule 14/74 — never let it block the test). Record the working route in
the playbook so the next session goes straight to it.

---

## L17 · A JIRA IMAGE URL MUST BE THE PLAIN `https://` ONE — NEVER THE WRAPPED FORM
**Retrieve when:** filing a ticket with a screenshot, or a ticket's images render as broken.

`getJiraIssue` returns an image as
`![](blob:https://media.staging.atl-paas.net/?...&url=<percent-encoded https URL>)`.
That wrapper is Jira's **stored** form, produced by the converter. **Copying it back into a new
ticket makes Jira wrap it AGAIN** — the nested result percent-encodes the whole blob URL into the
`url=` parameter and the image is dead.

**Always pass the bare URL:** `![](https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<path>.png)`.
Verify by re-reading the created issue: the stored value must contain exactly ONE `blob:` and its
`url=` must decode to a `https://raw.githubusercontent.com/...` address, not to another blob URL.
Worked example: SV-9773 was created wrapped and had to be corrected with `editJiraIssue`; SV-9774 was
created with plain URLs and rendered first time (both 2026-09-07).

**The image must be committed AND pushed before the ticket is created** — Jira fetches it from the raw
GitHub URL, so an unpushed exhibit is a broken image.

## L18 · THE TWO FILED DEFECTS, AND THE SHAPE THAT GOT THEM ACCEPTED
**Retrieve when:** preparing an Invoice Refresh defect, or checking whether a finding is already filed.

| Ticket | Finding | Parent | How it was proven |
|---|---|---|---|
| **SV-9773** | The work-line footer is GROSS where S5-R9 requires NET of the line's own fees/discounts. Labor $299.90 / Line total $299.90 where both should read $324.90 after a $25.00 line fee. | SV-9144 (Story 5) | The design's own script: `setTxt('j2-labor', money(599.80 + L + F))`, plus the spec's Story-7 note that only the SUMMARY rows stay gross. The build makes both gross. |
| **SV-9774** | The Parts Sale document prints no part number; S13-R2 requires one. | SV-9195 (Story 13) | A **control exhibit** settled it: the service Invoice at the SAME shop with the SAME Invoice Details values prints `N68SL-356 - <description>`. So it is not the "Part number" setting. |

**The shape (QA lead, established by SV-9770):** design reference first with a design screenshot ·
then the spec rule quoted verbatim with its Confluence page id and read date · then what the build
shows with its own screenshot · then why it matters to a **customer** · then what we expect after the
fix · then a "Where this was seen" block naming the build marker, the record and the clicks.
**Never a test-case reference in the ticket.** Story Defect · Medium · parent = the OWNING STORY
(an Epic parent is HTTP 400) · plus a `relates to` link to that same story · no Product Area.

**⭐ THE MOVE THAT MAKES A SETTING-DEPENDENT FINDING UNCHALLENGEABLE:** find a document in the SAME
environment, SAME shop and SAME settings that DOES show the thing, and put it in the ticket as a
control. "It is not the setting" stops being an assertion and becomes an exhibit. Without it, A5
(setting-dependent ⇒ could be by design) sinks the ticket.

## L19 · CHECK JIRA BEFORE CALLING A FINDING NEW — TWO OF FOUR FAILURES WERE ALREADY FILED
**Retrieve when:** about to propose a defect.

Of the four failures this pass, only two were new:
- **C44974** (staging PDFs embed DejaVu Sans, never Inter) → already **SV-9761**, Open. Also SV-9639
  covers the QA branch. **Not filed again.**
- **C44970** (an account-level credit prints no disclaimer) → the case's own note already predicts it;
  outcome (2) means mark Failed and raise nothing.
- C44935 → new, filed as SV-9773. C44981 → new, filed as SV-9774.

The search that worked: `project = SV AND (summary ~ "<the noun>" OR text ~ "<the symptom>") ORDER BY
created DESC`. A `text ~` search over the whole project can exceed the tool's token cap — the result is
saved to a file the error names, and `python3 -c "import json; ..."` over that file lists the rows.
