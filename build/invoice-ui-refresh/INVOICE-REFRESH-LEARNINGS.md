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

---

## L20 · ⭐ THE STORY-DEFECT GUIDELINE — QA LEAD, 2026-09-07. BINDING ON EVERY DEFECT.
**Retrieve when:** about to create OR edit any Jira defect. Read this BEFORE writing a word of it.

His five rules, verbatim in substance:

1. **Title** — concise and clear, telling what is inside the story defect.
2. **Always linked to the related story** — `parent` = the owning story AND a `relates to` link to it.
3. **ALL screenshots annotated. NO screenshot without annotation.**
4. **The most simplified steps of replication**, RUNNABLE through the UI by a manual QA tester, a PO,
   or a very non-technical person.
5. **THE SEQUENCE IS FIXED, IN THIS ORDER:**

```
## Description            concisely: what we are going to replicate, and what the issue is about
## Steps to reproduce     numbered 1, 2, 3 … each step a UI action a layman can follow
## Current behaviour      what the build does, in words
## Expected behaviour     what it should do, in words
## Screenshots            the annotated inline images
## Source                 the story (link) AND the spec (rule number + link), the expectation
                          QUOTED IN EXACT WORDS from each
                          ← a LINE BREAK, then:
**Where this was seen:**  environment, build marker, record, role, date
**What is not affected:** the scope limit
```

**Do NOT reorder these and do NOT merge Current into Expected.**

> **🛑 AMENDED BY HIM 2026-09-07, SAME DAY:** *"the Source should appear just above the 'Where it was
> seen' with a line break."* So **Source is the LAST titled section**, the screenshots move ABOVE it,
> and **Source is separated from "Where this was seen" by a LINE BREAK — not a horizontal rule.**
> Emit `&nbsp;` on its own line for that break; a bare blank line collapses and `---` draws a rule he
> does not want. His first wording put the screenshots last; this supersedes it.

**⚠️ THE CONVERTER REORDERS YOU IF YOU FIGHT IT.** Submitting `## Source` before `## Screenshots`
came back stored with **Screenshots hoisted above Source** — the markdown→ADF conversion moved the
media block. Write the sections in the FINAL order above and the stored body matches what you sent.
**Always re-read the issue after writing and check the section order**, because the write reports
success either way. Applied to SV-9773 and SV-9774 on 2026-09-07.

### The annotation recipe that satisfies rule 3
Tool: `/tmp/claude-0/wk/annot.py` (PIL). Rebuild it if the container is gone — the shape that works:

- **A dark header bar** across the top: `environment · build marker · record · screen · date`. This is
  what answers *"that is not what I see"*.
- **The FULL screen**, never a tight crop. A cropped number proves nothing (skill 06).
- **A coloured box on the exact element** — RED for the fault, GREEN for correct/expected/control.
- **Numbered callouts in a RIGHT-HAND GUTTER, never over the screenshot**, each joined to its box by a
  leader line with a dot at the box end. *Callouts placed on top of the content hide the very thing
  they point at — that was the first attempt and it had to be redone.*
- **A caption strip under the image** beginning `WHAT YOU SHOULD SEE:` or `WHAT ACTUALLY HAPPENS:`.
- **Human-readable filenames** (Rule 19): `sv9773-actual-line-footer-ignores-the-line-fee.png`.

### The exhibit set that makes a defect unarguable
1. **Expected** — the Design Document with the relevant toggle on (GREEN).
2. **Actual** — the running build, full screen with the header bar (RED).
3. **Control**, whenever a setting could be blamed — the SAME shop, SAME settings, SAME day, showing
   the thing working elsewhere (GREEN). This is what kills the "it is just the setting" refusal.

### Mechanics that will bite
- Commit AND push the images before editing the ticket — Jira fetches them from the raw GitHub URL.
- Pass **plain `https://`** image URLs (L17). Never the `blob:` form read back from Jira.
- `editJiraIssue` preserves `parent`, `priority` and issue links — verified on both tickets — but
  re-read the issue afterwards and confirm, because a lost media node is invisible in the changelog
  (skill 06's recorded hazard).

---

## L21 · THE SEEDING RECIPES THAT UNLOCKED THIS SUITE — REUSE, DO NOT REDISCOVER
**Retrieve when:** a case needs a data state the sample records do not have. All proven live on
staging 2026-09-07, build v26.35.9-9812433. Payload details are in `build/APP-ACTIONS-PLAYBOOK.md`.

| State needed | How |
|---|---|
| An invoice | `POST /api/work-orders/change-status {id, status:'complete'}` then `POST /api/invoices/create {work_order_id}` → 201. **"Work order is not complete" is the status, not a bug.** |
| A partial / full payment | `POST /api/customer-account/create-customer-payment` — the transaction row must be the FULL object from `list-unpaid-transaction` with `transaction_payment_amount` added |
| An applied customer credit | same call, credit row in `applied_credits` → prints `(Credit) {date} - CM-xxxx` |
| The **excess sub-line** | one payment SPLIT ACROSS TWO INVOICES (`transactions:[a,b]`). `new_credit` is IGNORED by the server, so over-applying does not create the excess — splitting does |
| A **deposit** row | `POST /api/deposits {customer_account_id, work_order_id, amount, payment_method, deposit_date}` → 201. **Only while the WO is Estimate/Approved/In Progress/Review** — after invoicing it 400s. Invoice afterwards and it auto-applies (`auto_paid:true`) |
| A **paid date earlier than the invoice date** | back-date the deposit; the deposit-paid invoice prints `Paid date` = the deposit date |
| Line-level and WO-level **fees / discounts** | `POST /api/work-orders/adjustments/add {workOrderId, kind:'fee'\|'discount', calculationType:'flat', amount, scope:'labor_line'\|'part_line'\|'whole_wo', targetId, taxable}` |
| **Special characters** | `POST /api/customers/create` then `/api/contacts/create` then `/api/vehicles/create` (needs BOTH `company_id` and `customer_id`) |
| Undo it all | reverse payments (`reverse-customer-payment`) BEFORE `POST /api/invoices/reverse-invoice` — a paid invoice refuses to reverse |

**Route discovery, when a route is unknown:** do NOT guess (five guesses = five 404s). Fetch
`https://app.staging.shopview.com/` → read the `/js/index.*.js` chunk → grep for the verb
(`createDeposit:e=>s.post("deposits",e)` gave `POST /api/deposits` immediately). Then POST `{}` and
let the 400 name every required parameter.

## L22 · THE LOCATOR THAT NEARLY BECAME A FALSE FINDING
**Retrieve when:** reading the on-screen document preview out of the app.

The rendered document container is **`.invoice-pdf-new`**. A loose `[class*=preview]` matched a
198px-wide unrelated div and made every phrase look "missing from the preview" — a 52-of-52 miss that
would have read as a catastrophic DOMPurify defect. **Nothing was recorded from it.**

**The rule this proves:** when a check reports that EVERYTHING failed, suspect the instrument before
the build. A real defect is almost never total. Confirm the selector matched something of a plausible
size (the document is ~800px wide, ~2000px tall) before believing any verdict drawn from it. The
preview is injected straight into the app DOM — **there is no iframe** — and it renders
`TABLE / TR / TD / SPAN / B`, so the block markup survives sanitising.

## L23 · 🛑 `iam/change-location` CAN POISON THE WHOLE SESSION — AND THE RECOVERY
**Retrieve when:** every authenticated staging call suddenly returns HTTP 500.

`POST /api/iam/change-location {workplace_id}` to **QB Location** returned 500 and left the session
pinned to a workplace that 500s. After that **every** authenticated call 500'd — `/api/workplaces`,
`/api/work-orders`, even `/api/quick-login`. Changing back to Heavy Duty 500'd too, three times.

**Prove it is the session, not the site, before reporting anything** (Rule 68):

| Probe | Healthy site, broken session |
|---|---|
| `curl https://app.staging.shopview.com/` | **200** |
| `curl https://api.staging.shopview.com/api/workplaces` (no cookies) | **401** ← auth layer alive |
| the same call WITH cookies | **500** ← it is your session |

**THE RECOVERY, in this order — the middle step is the one that is easy to miss:**

1. `POST /api/login` with anything → **401 `sso_required`**, but it hands you a **fresh `PHPSESSID`**
   in `Set-Cookie`. Swap that one value into the cookie header, keeping `sv_sso_session` and
   `cf_clearance` (core §6.2 — never replace the whole header).
2. Calls now answer **409**, not 500. **409 is progress**: the session is coherent again but not yet
   bound. Do not read it as a failure and start over.
3. `POST /api/quick-login {"key":"admin"}` with that header → **200**, and its `Set-Cookie` carries a
   **rotated PHPSESSID**. Swap that in as well.
4. Re-verify with `/api/workplaces` → 200 and a known record by number, never by assuming.

Recovered in under two minutes once the order was right. **Do not switch workplace by API at all
unless the case needs it** — the read you want is usually reachable from the current one.

---

## L24 · 🛑🛑 READ THE GEAR-ICON TOGGLES BEFORE CALLING ANY FIELD MISSING — THIS COST US A FALSE DEFECT
**Retrieve when:** ANY case about a field being absent from a document. Read this BEFORE writing the
finding, not after.

**WHAT HAPPENED (2026-09-07).** I filed **SV-9774** saying the Parts Sale document drops the part
number. The QA lead **obsoleted it**: the part number was missing only because the **"Part number"
toggle was OFF** in that part sale's own per-view settings. With it on, the line reads
`E2E-PS-1788771350534-0 - COD Credit Part 1`, exactly as the spec requires.

**WHY IT GOT THROUGH, AND THIS IS THE PART THAT MATTERS.** I quoted **S5-R7 in the ticket itself**:

> *"These settings appear on two surfaces. Administration → Invoice Details holds the shop-wide value…
> The same list is also offered as a per-view override on the work order's Finance tab, seeded from the
> shop-wide value; flipping it there changes only the document being viewed and saves nothing."*

I checked the **shop-wide** value, saw it on, and built a "control exhibit" from a *different document*
that showed the number. **Both documents have their own independent per-view state, and I never read
either one.** Quoting a rule is not applying it. A control document only controls for what you have
actually measured on BOTH sides.

### THE RULE, FROM NOW ON
**Before judging ANY field absent from a document, open the gear icon on that document's own Finance
tab and confirm EVERY toggle is ON.** Nine of them: Labor rate · Labor hours · Labor price ·
Part number · Part quantity · Part price · Part description · Summarize parts total ·
Summarize labor total. **The per-view state is per document and is seeded, not shared** — the part
sale next to it can differ, and so can the same record tomorrow.

### HOW TO READ AND SET THEM (proven live)
The panel is the `settings` icon in the Finance toolbar. Each row carries a stable test id, so read the
state rather than guessing — **the ids are NOT the camel-case of the label**:

| Label | `data-test-id` |
|---|---|
| Labor rate | `toggle_setting_laborRate` |
| Labor hours | `toggle_setting_laborHours` |
| **Labor price** | `toggle_setting_laborCost` ← not `laborPrice` |
| Part number | `toggle_setting_partNumber` |
| Part quantity | `toggle_setting_partQuantity` |
| **Part price** | `toggle_setting_partCost` ← not `partPrice` |
| Part description | `toggle_setting_partDescription` |
| **Summarize parts total** | `toggle_setting_summarizePartsTotal` |
| **Summarize labor total** | `toggle_setting_summarizeLaborTotal` |

```js
[...document.querySelectorAll('.q-menu .q-item')].map(it => ({
  label: it.querySelector('.q-item__label').innerText.trim(),
  id:    it.querySelector('[data-test-id]')?.getAttribute('data-test-id'),
  on:    it.querySelector('[role=switch]')?.getAttribute('aria-checked') }))
```
Every one must read `on: "true"` before the document is evidence of anything being absent.

### THE GENERAL LESSON, WORTH MORE THAN THE SPECIFIC ONE
**An absence is only evidence once you have ruled out every switch that could cause it.** A present
value proves itself; a missing value proves nothing on its own. Before reporting anything as missing,
list what could suppress it — a per-view toggle, a shop setting, a permission, a data state — and
show each one ruled out **on the document in front of you**, not on a neighbouring one.

---

## L25 · 🛑 READ THE CASE'S OWN WORDS BACK TO THE SPEC BEFORE HUNTING FOR A DATA STATE
**Retrieve when:** a case seems to need a state the product cannot reach, and you are about to mark it
Blocked.

**WHAT HAPPENED (2026-09-07).** C44963 says *"An Invoice with no due date set shows 'Invoice date:
{date}' and no 'Due date' line (the old quirk of rendering a null due date as today's date is
retired)."* I read that as needing a record whose `due_date` column is null, and spent a long stretch
proving it unreachable — the server ignores a null `due_date`, terms cannot be cleared, all twelve
terms yield a date. I marked it Blocked with a careful proof of the wrong thing.

**The QA lead answered it in one line: toggle the Estimate/Invoice switch off and there is no due
date; toggle it on and there is.** He was right, and the spec says so:

> **S10-R2:** *"…the masthead shows 'Estimate date: {date}' **(a relabel, not a new element:
> production estimates today print "Invoice Date" and "Due date" on the estimate; this renames the
> issued date, drops the due-date line, and retires the quirk where a null due date rendered as
> today's date)**."*

**The case's parenthetical is lifted verbatim from S10-R2.** That phrase was the pointer to the
Estimate all along. The "document with no due date" is not an exotic data state — it is the Estimate
view, one click away.

### THE RULE
**When a case looks unreachable, grep the SPEC for the case's own distinctive phrase before you
conclude anything.** A case is written from the spec, so its unusual wording is nearly always a quote.
Find the rule the phrase came from and it will tell you which document, view or toggle the case means.
Searching `grep -n "quirk where a null due date" spec-body-*.md` would have taken ten seconds and
saved an hour.

**And the second-order lesson, which is the same one as L24:** a careful proof of an unreachable state
is worthless if you are proving it about the wrong thing. Before investing in "this cannot be done",
spend one minute on "am I sure this is what is being asked?" — re-read the case against its cited
rule, and check the cheapest interpretation first. The simplest reading is usually the intended one.

---

## L26 · THE DIFFERENCE BETWEEN "I COULD NOT" AND "IT CANNOT BE DONE"
**Retrieve when:** about to mark a case Blocked.

The QA lead pushed back on ten Blocked cases with *"why are they blocked, they should not be unless
there is a genuine reason"*. He was right on four of them. What separates a real block from a lazy one:

| Case | What I first said | What it actually was |
|---|---|---|
| C45190 | "no imported work order exists" | **Passed.** Our own playbook documents `POST /api/imports/work-order-historical` with the full 24-column CSV contract. I imported one in two minutes |
| C45178 | "every canned line is priced" | **Passed.** A work-order-wide discount equal to the subtotal gives a $0.00 total |
| C44963 | "no due date is unreachable" | **Passed.** It was the Estimate view all along (L25) |
| C44970 | "outcome (2), raise nothing" | **A real defect**, filed as SV-9790 |

**A block is only real when you can state the mechanism that forbids the state**, not merely that you
did not find a way. Compare:

- ❌ *"No logo control could be found."* → weak; I had not looked at the Organization tab's DOM.
- ✅ *"The logo is organisation-level, not per-shop, so the case's precondition cannot exist; the only
  control is a pencil that opens a file picker with no remove option; and DELETE on the logo endpoint
  answers 405 Allow: GET."* → three independent mechanisms, all measured.

**The four shapes a genuine block takes, all of which are worth writing down:**
1. **Validation forbids the state** — C44907: all five masthead fields are required at creation, and
   the edit form silently refuses to persist them empty. Proven from both directions.
2. **The product offers no way to undo a thing** — C44902: a logo can be set or replaced, never removed.
3. **The value comes from outside the system** — C44916: an IBS approval code is issued by Interstate
   Billing, and no route in the app sets one.
4. **The surface is a different application** — the three paid-banner cases: the banner exists only on
   a customer-portal PDF, and the portal is not reachable or discoverable from the shop app.

**When you do write Blocked, the note must name what you searched**, so the next person does not repeat
it: hostnames probed, endpoints tried, screens opened, bundle greps run. "Not found" without that list
is an admission, not a finding.

**And a block on a CASE is sometimes a finding about the CASE.** C44907's precondition asks for a state
the product forbids; C44902's assumes the logo is per-shop when it is per-organisation; C45275 has no
steps and no expected results at all (and is Vladimir Tomovic's, so hands-off). Those go to the QA lead
as authoring questions, not as environment complaints.

---

## L27 · ⭐ SV-9770 WAS ANSWERED — THE FIELD SHOWS, AND THE SPEC MOVED FOUR TIMES UNDER US
**Retrieve when:** anything touches the Work Order field, or before trusting a spec snapshot.

### The ruling (Chris Ward, 2026-09-07, live page v57)
> *"Ruling: the field shows. The rule was wrong, not the build."*

He identified the trailing-digits comparison as **his own 2026-09-04 revision, written to match what
the build did**, and reversed it: *"I moved the rule to the build instead of asking whether the build
was right."*

**New S3-N1** — the Work Order field is hidden in exactly two cases, shown in every other:
**(a)** the document has no work order behind it (a standalone Parts Sale);
**(b)** the work order number and the document number are **character-for-character identical as whole
strings** — nothing stripped, no digit run extracted. `S2-5468` vs `S2-5468` hides; `S2-5468` vs
`INV-S2-5468` shows. Case (b) is duplicate-suppression, not something an ordinary document reaches.
**New S3-R10** — the field shows the work order number exactly as on the work order, no prefix added,
no reformatting.

**Consequence:** C44917 flipped **Passed → Failed**. The defect was already tracked as **SV-9642**
(Code Review, raised by Mudassir from the code side); Chris linked the two. **No new ticket.**

### THE LESSON THAT MATTERS MOST HERE
**A "spec-correct" verdict is only as good as the spec version it was read against.** C44917 passed
honestly against v45 and is a failure against v57 — the build never changed. So:

- **Re-pull the spec before finalising any pass**, and diff it against the snapshot you started with.
  One `difflib` run over the two bodies found all four changes in seconds.
- **When a ticket you raised gets a ruling, the ruling is a spec event, not just a ticket update.**
  Go and re-read the page, diff it, and re-verdict every case the change touches — here three cases,
  only one of which was the obvious one.
- **A ruling can create coverage gaps.** S3-R10 and G-R4 are both brand new and no case covers either.
  Say so; do not let a new rule pass unnoticed because no case failed.

### The other three changes in the same edit
- **New G-R4** — every document is A4 portrait, 210×297mm, fixed. Names a **718px sheet box** and a
  **634px content box** because the two had been confused. **These are PRINT geometry**: measured
  595.28 × 841.89pt = 210 × 297mm on all six document types, content box 475.3pt = 634px. On screen
  the sheet is responsive (718px at a 1440 viewport, 800px at 1500), so never read those two numbers
  as an on-screen assertion. Verified — passes.
- **S10-R2 expanded** — the Estimate date is the issued date and **tracks the current date** until an
  invoice exists, so two printouts of one Estimate on different days can differ. Explicitly *not* a
  defect. This explains why estimate renders came back dated Sep 6 when a later issue date was passed.
- Changelog rows.

**Also worth knowing:** the manual tester Mudassir is filing actively against this suite — SV-9642,
SV-9782, SV-9784, SV-9791 all trace to him. **Check his tickets before raising anything on Story 3,
page size, or document dates.**

---

## L28 · A DIFFERENT LOGIN IS NOT A DIFFERENT ENVIRONMENT — CHECK THE IDs, NOT THE CREDENTIALS
**Retrieve when:** handed a "new environment", a second account, or a sandbox to test something
destructive in.

The QA lead set up `bilal.muzamil+logo@shopview.com` as a new staging environment so C44902's
no-logo state could be tested safely. **It is a second USER ACCOUNT in the SAME organisation**, not a
separate environment. Three checks proved it in under a minute, and all three matter:

| Check | Result |
|---|---|
| Workplace UUIDs | **Identical** — `f8a8b802`, `b3c8c820`, `25a0d576` |
| Work order numbers | **Identical**, including S2-32266 and others I had created 20 minutes earlier |
| Organisation logo bytes | **Identical** — 408,254 bytes, sha256 `8f26cec4649ac6ce3e93` |

**Always run those checks before treating a handed-over environment as isolated.** Same host plus a
different login usually means the same tenant. A `+alias` address is a mail alias, not a tenancy
boundary. Had I assumed isolation and removed the logo, every document in the shared organisation
would have lost it the night before a release.

### Say so immediately
When a sandbox turns out not to be one, tell the person straight away and say what a real one would
need — here, an organisation with **different workplace ids**, because the logo is per organisation
and not per location. Do not quietly proceed and do not quietly give up.

### While proving it, the last search gap got closed
Driving the logo picker with a request listener revealed the write route, which no amount of guessing
had found: **`POST /api/organization/organization-details/upload-logo`**. Probing it completed the
picture — `DELETE` on it is 405, `DELETE` on the read route is 405 `Allow: GET`, and `remove-logo`
and `delete-logo` are 404 on both verbs. **There is no way to remove an organisation logo, anywhere.**
Re-uploading the identical file first (verified byte-identical afterwards, same sha256) made the
search itself a no-op — *when you must exercise a destructive-looking endpoint to learn its shape,
feed it the value that is already there.*

## L29 · ⭐ HOW TO REACH THE CUSTOMER PORTAL — AND WHY EVERY EARLIER SEARCH MISSED IT
**Retrieve when:** anything needs the ShopPay customer portal, the paid banner, portal payments,
batch payments, disputes, payouts or the portal's own invoice document.

**The route is the shop app's own account menu.** Click the round avatar at the top right →
**"Customer Portal"** (badged *New*) → a new tab opens at
`https://staging.portal.shopview.com/invoices`. The click does `POST https://staging.portal.shopview.com/sso-login`
and mints a `shopview_customer_portal_session` cookie for the same signed-in shop user. **There is no
separate portal password**, and the `+alias` accounts do not have one either.

**Why eight earlier searches missed it.** The portal is a **separate Laravel + Inertia application**.
Its host appears nowhere in the shop app's Quasar bundle, nowhere in the invoice email, and on no API
route. The only trace in the shop app is the lazy chunk `usePortalRedirect.*.js`, loaded when the menu
item is clicked. **The lesson: when a feature is a different application, grep the app that LINKS to
it for the link, not for the host — and click every menu item before concluding a surface is
unreachable.**

**The portal's own route map is free.** Its login HTML carries an inline `Ziggy` block listing all
161 routes. `python3 -c "…re.search(r'const Ziggy=(\{.*?\});', html, re.S)…"` gives invoices,
payments, batch-payments, disputes, payouts, terminal and admin routes in one read — no guessing.

**The banner document.** On an invoice, the **printer icon** at the top right offers
**"Print Invoice"** and **"Print with Payment Receipt"**. The second loads
`/invoices/{id}/preview?include_receipt=1`. 🛑 **The banner is rendered CLIENT-SIDE**, by
`build/assets/PreviewInvoice-*.js`; the server's `props.htmlContent` contains none of the banner
strings. Fetching that page server-side and grepping for "PAID IN FULL" returns nothing and looks
like the feature is missing. **Render it in a browser and read
`document.getElementById('portal-paid-invoice-summary').innerText`.**

**Seeding every banner state (all proven live 2026-09-07):**

| State | How |
|---|---|
| A portal payment | invoice → **Pay Now** → confirm payer → amount → **Continue to checkout** → Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC, **ZIP `94107`** |
| A PARTIAL payment | type an amount smaller than the balance in that same box |
| A **batch** payment | Invoices list → **Filter by Customer** → tick two unpaid rows (the checkbox is a `<button>` in the first `<td>`, not an `<input>`) → **Pay Online** |
| A batch marker AND a plain marker on one invoice | one single payment, then include the same invoice in a batch |
| A payment with a **late fee** | none could be created; the existing S-12725 (Apr 17 2026) carries one |
| A shop payment and a portal payment on one invoice | `create-customer-payment` for the shop side, then Pay Now for the portal side |

**Traps.** The payer dialog has **two shapes** — "Who is this payment for?" with a picker when the
customer has several contacts, "Confirm payment recipient" with just **Next** when it has one; handle
both or the flow hangs. Stripe checkout defaults **Country = United States**, so a Canadian postal
code fails validation — use a US ZIP. Only invoices in the portal's current scope resolve;
`/invoices/{id}/preview` answers **404** for the rest, and that 404 is scope, not a missing invoice.

## L30 · 🛑 A RULE THAT RESTATES PRODUCTION IS A SPEC CORRECTION, NOT A DEFECT — CHECK THE SHIPPED BUNDLE
**Retrieve when:** the build does not do what a rule says, and the rule describes existing behaviour.

C44952 clause 4 requires a "Remaining Balance" row in the paid banner. It is not drawn. The reflex is
a Story Defect. **The right answer was a spec correction**, and two checks decided it:

1. **Read the rule's own preamble.** S8-R8 opens *"Behavior already in production, restated unchanged
   — this spec adds no new banner work"*, and S8-R9 is not marked net-new. The spec then carries a
   standing principle: *"Where a rule in this spec is found to disagree with what production already
   does, and that rule is not marked net-new, the rule is amended to describe production rather than
   production being changed to match the rule."*
2. **Prove what production ships, without touching production data.** Both environments serve a Vite
   build manifest at `/build/manifest.json`. The same chunk name appeared in both, and
   `sha256` of `portal.shopview.com/…/PreviewInvoice-DQmgXtBb.js` equalled staging's byte for byte.
   **Downloading a public JS asset is a read of the shipped code, not a production test** — it is
   cheap, safe, and it is the difference between "regression" and "never existed".

**Also worth the two minutes:** the whole front end was searched, not one file — all 133 JS assets in
the manifest, zero occurrences of the string. *"I could not find it on the screen"* is weak;
*"it is not in the shipped bundle"* is not arguable.

## L31 · THE PROJECT'S MANUAL TESTER IS NOT A FOREIGN AUTHOR — `created_by 6` IS IN SCOPE
**Retrieve when:** a script guards a TestRail write with `created_by !== 3`.

A write guard of `created_by !== 3` **skipped C45175** as foreign. It is **Mudassir Qamar** (TestRail
user **6**), the designated manual QA tester for Invoice UI Refresh, and Rule 38's amendment puts his
cases IN SCOPE — source-verify them, keep them tester-ready, update them. The guard must be
`[3, 6].includes(created_by)` on this suite (user **4**, Viktoria Videnovic, plays the same role on
Inline Add and Edit Parts 6597 and Printer Friendly WO 6617). **`created_by === 1` — Vladimir
Tomovic — stays hands-off, always.**

## L32 · EDITING A CASE THAT ALREADY RENDERS `fr-view` — GO THROUGH THE UI, NEVER THE API
**Retrieve when:** a one-line correction is needed in a case body.

Scan first: `div[class^="markdown"]` on `/index.php?/cases/view/<id>` tells you the container. All
three portal cases were **`markdown fr-view`** — an API `update_case` would have dropped them into the
escaping container and turned their `<br>` tags into literal text. **A one-character fix is still a UI
edit.**

The minimal, deterministic recipe (no keystroke retyping, so no autoformat surprises):

```js
const inst = window.FroalaEditor.INSTANCES.find(i => i.$oel[0].id === f + '_display');
let html = inst.html.get();
html = html.replace('…old…', '…new…');          // or splice a block in before '<p>---'
inst.html.set(html); inst.undo.saveStep();
const b = document.querySelector('#' + f);
b.value = inst.html.get(); b.dispatchEvent(new Event('change', {bubbles: true}));
```

**Two traps.** `#accept` can still read **disabled** after `html.set` — dispatch `input` on
`inst.$el[0]` as well, wait ~1s, and only then click; if it is still disabled, clear `disabled`
directly. And **Froala normalises `<b>` to `<strong>`** on save, so emit block tags and plain text
only. Verify every edit by re-reading the view page: container `markdown fr-view`, zero literal tags,
`AUTOMATION:` marker still last.
