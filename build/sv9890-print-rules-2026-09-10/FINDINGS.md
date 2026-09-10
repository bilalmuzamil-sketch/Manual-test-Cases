# SV-9890 — print rule weight and the Balance box — **STOPPED PART-WAY, NOT A VERDICT**

**Status: testing stopped on the QA lead's instruction** ("I see mudassir has already tested this. So
STop"), 10 Sep 2026 ~16:45 UTC. **Nothing was posted to Jira. This is not a QA verdict** — it is the
measured evidence gathered before stopping, kept because one part of it is a finding somebody should
see whoever finishes the ticket.

Ticket: [SV-9890](https://shopview.atlassian.net/browse/SV-9890) · Bug · **TESTING QA** · priority
High · reporter **Chris Ward** · assignee **Milomir Kotlajic** · fix PR #3002 (`20004fc49f`).

## Environments

| Environment | app-version | index.html last-modified |
|---|---|---|
| Fix branch `sv9890.qa.shopview.com` | **v26.36.2-20004fc** | Thu, 10 Sep 2026 16:17:57 GMT |
| Staging (the before picture) | v26.36.2-a678e3c | Thu, 10 Sep 2026 12:42:51 GMT |

Same document on both, like for like: work order **S-4219** (8 work lines), invoice
`aac99a06-20af-424a-afdb-56e865b1553b` — the same invoice id exists on both environments.
Documents pulled as `GET /api/invoices/preview?invoice_id=…&type=html|pdf` (playbook §AC.1).

## What was verified before stopping

**1. The change is print-only, and it is exactly what the developer describes.** The served stylesheet
gains **one new `@media print` block** (the 4th) and **modifies nothing that was already there** — the
diff is purely additive. Every base (screen) declaration is byte-identical between the builds:
`.mh` 2px, `.job` 1px, `.job-first` 2px, `.job-foot .ltot.with-divider` 2px, `.ps-body` 2px,
`.b-break-line` 2px, `.row-strong` 1px, `.bal` `padding: 14px 18px` / `border: 2px`,
`.bal .v` 30px, `.bal .k` 12px.

The new block, in full: `.mh` 1px · `.job` 0.75px · `.job-first` 1px · `.ps-body` 1px ·
`.job-foot .ltot.with-divider` 1px · **`.b-break-line` 1px** · `.row-strong` 0.75px ·
`.sign-line` 0.75px · `.bal` `padding: 10px 14px; border-width: 1px` · `.bal .v` 24px.

`.b-break-line` is **not** in the ticket's list of seven selectors and is not named in the developer's
comment; it is the Summary bar's rule and thinning it is consistent with the intent. Noted, not a fault.

**2. Measured in the produced PDF — exhaustive, every border edge, matched by position.**
26 border edges before, **26 after, every one matched, none added or removed**; **18 thinned, 8
unchanged, and not one colour moved.**

| | before | after |
|---|---|---|
| masthead rule (p1) | 1.5pt #121926 | **0.75pt** |
| work-section / first work-line rule (p1) | 1.5pt #121926 | **0.75pt** |
| between-job rules (7 of them, p1–p3) | 0.75pt #121926 | **0.5625pt** |
| signature rules (3, p3) | 0.75pt #121926 | **0.5625pt** |
| Subtotal / Total row tops (p3) | 0.75pt | **0.5625pt** |
| addresses-row and Summary-bar hairlines (8) | 0.75pt #CDD5DF | 0.75pt #CDD5DF — unchanged |

**No 1.5pt edge survives on the branch.** Colours present in print are only #121926 and #CDD5DF, on
both builds — so the disputed ink-floor half really is untouched, as declared.

**3. The headline figure, measured.** `BALANCE` label **9.00pt on both** (12px × 0.75, so S12-R9's
pinned label size is intact). The figure **22.50pt → 18.00pt**.

**4. An overflow the ticket describes horizontally, found vertically.** Before, the box measures
39.0pt tall: 2 × 1.5pt border + 2 × 7.5pt padding leaves **21pt of interior for a 22.5pt figure** — the
figure was taller than the space it sat in. After, 41.7pt tall: 1.5pt of border + 15pt of padding
leaves **25.2pt for an 18pt figure**. The box getting *taller* while the figure got *smaller* is the
tell: it is now sized by its content instead of being overrun.

**The developer's horizontal claim was NOT reached** — `$12,345.67` touching both borders at 30px and
`$123,456.78` running through them. The S-4219 balance is `$0.00`, so it needed a five-figure invoice
(`S2-16654`, balance `$8,600.85`, invoice `1d00250c-8065-40c1-8cdd-63d6c34111f4`, was the next step).

## The finding worth passing on — the spec is NOT silent on rule weight

Both the ticket and the developer's comment rest on the same premise. The ticket: *"it does not pin the
weight of any rule or the size of the headline figure."* The comment, and the template's own new
block: *"The spec pins neither the weight of any rule nor the size of the headline figure."*

**Read live from the spec (Confluence page 755990532, *Invoice UI Refresh*), that premise is wrong on
rule weight:**

- **S12-R1:** the masthead sits *"over a **2px** ink rule"*.
- **S12-R8:** *"The work section opens with a **2px** ink rule under the section label. Numbered jobs
  are separated by a **1px** ink (#121926) rule. **Both widths, and every other width and size in Story
  12, are stated in CSS pixels**, so on paper **the 2px rule measures 1.5pt and the 1px rule measures
  0.75pt** (S12-R5a)."*
- **S12-R14 (@chris ruling, 2026-09-09)** is a **closed list**: *"The printed PDF departs from the
  Design Document's sizes and spacing **in the ways listed here, and in no others**."* It lists body
  text, job title, scope text, charge-table text, disclaimer, signature rule **heights**, the 280px
  Summary column, side padding and the SV-9870 spacing set. **No rule width. No headline figure size.**
- **S12-R9** states the governing principle against the fix's own rationale: sizes are *"absolute page
  sizes, not sizes relative to the Design Document's canvas … no global scale factor is applied … If a
  specific element cannot fit at its stated size, that element is raised as its own defect and ruled on
  by name rather than rescaled."* The fix's stated reason is a ~25% canvas rescale (876px design sheet
  vs 698px A4 content).

So as shipped, the printed masthead rule is 0.75pt where **S12-R8 says 1.5pt**, and the between-job
rules are 0.56pt where it says **0.75pt** — and S12-R14 forbids print departures it does not list.
**This is not a reason to fail the change** — the PO asked for it and owns the spec — but Story 12 has
to be amended before it ships, which is exactly what the ticket says is owed (*"whatever lands here
should be written into Story 12"*) and what the developer offered to draft. Until then the document
fails S12-R1, S12-R8 and S12-R14 on the next spec-conformance pass.

**On the disputed half, the developer is right and the ticket is wrong.** Chris asked for print
hairlines at #E3E8EF/#EEF2F6. **S12-R5** — which his own ticket cites as pinned — says *"hairline rules
render no lighter than #CDD5DF"* in print. The ticket's own note says S12-R5 is *"a floor and not a
target"* so a rule *"may be thinner while still meeting it"* — thinner, not lighter. It has already
been settled in opposite directions twice (SV-9708 chose #EEF2F6, SV-9823 darkened it to the floor and
was verified on staging by Mudassir Qamar on 9 Sep) and the template records that history in a comment
so a third flip has to argue with the note.

**Unverified by me:** the developer cites the Design Document's own print block (artifact
`c88ee207`, line 47) as setting `--rule:#CDD5DF; --g100:#CDD5DF`. I did not open that artifact, so his
factual claim about it is not something I checked. It does not change the conclusion, because S12-R5
settles the print value on its own.

## What was NOT done

Estimates (the ticket requires both document types), the horizontal overflow test with a five-figure
balance, the on-screen render comparison, the money-multiset and page-fill diff, and any Jira comment.
Page count was 3 on both builds for S-4219.

## Reusable

`print-stg.css` / `print-qa.css` are the two extracted print blocks. `css.py` extracts them,
`an.py` reports which declarations sit inside which print block (comments blanked in place so byte
offsets stay valid — a CSS comment otherwise swallows the following selector), `borders.py` measures
every border edge from WeasyPrint's outer/inner rect pairs, `pair.py` matches them before-to-after by
position, and `bal.py` reads the headline figure's span size and the rounded box's geometry.
**WeasyPrint draws a square border as a pair of `re` items** (thickness = outer minus inner) and a
**rounded** box with `l`/`c` curve items, so a rounded box needs the span/geometry route instead.
