# Confluence 768507905 "Digital Inspections V2" — all comments, read 14 Oct 2026

Read with `getConfluencePageFooterComments` (status current, replies included, 25 per comment; status
archived also queried → 0) and `getConfluencePageInlineComments` for resolution status open (9 threads),
resolved (0), reopened (0), dangling (0), replies included. Author ids resolved with Jira user lookup:
`557058:ead5f72a…` = Milan Zivanovic · `712020:1f21c3b6…` = Milos Vasic (PM) · `712020:7b606895…` =
Sasha Grosman · `712020:2865b6e9…` = Fabian Bonjean.

Totals: 1 footer thread (1 root + 4 replies) and 9 inline threads (9 roots + 6 replies) = 20 comments.
**Newest comment on the page: 2026-09-16T12:50:47Z. No comment of any kind was made after 22 Sep 2026,
so no decision was made in a comment after 22 Sep.** (Every decision in these comments was later written
into the page body itself — see the change log entries of 2026-09-16 and after.)

Bodies below are verbatim as returned (markdown), unedited. Mentions render as `@Name`.

---

## Footer thread 860553217

### 860553217 — Milan Zivanovic — 2026-09-15T18:28:06Z (root)

**Technical planning pass — decisions needed, and some corrections**

A technical implementation plan for this epic is being written now. It is grounded in three things read side by side: this PRD, the design handoff bundle for SV-8181 (its own `FR-01`–`FR-24`, the numbered build spec, the acceptance criteria, all 27 artboards), and the actual ShopView codebase. Reading all three together surfaced a set of things only Product can settle, and a set of statements the code refutes.

Planning is **not blocked** — the foundation phases are proceeding on the assumptions marked below, so answers can arrive at their own pace. But each assumption is a place the plan will be wrong if the answer differs.

---

### 1 · The PRD and the design bundle disagree — eight rulings needed

The design bundle's review of 2026-09-03 made decisions with recorded rationale that this page never folded in. Neither document is automatically right; the design is older, but the PRD's change log does not mention these.

| **#** | **Question** | **PRD says** | **Design says** | **Recommended** |
| --- | --- | --- | --- | --- |
| 1 | **"Photo required if Not OK" default** | S17-R2: on for new checkbox fields | Off — reversed on 2026-09-03, _"Not every flagged item should demand a photograph. The note rule stays on"_ — with a verification gate built around the reversal | **Off.** This setting already ships and its live default is off. The PRD's version is a change to released behaviour, not a new default. |
| 2 | **Asset tab filters** | S5-R10: All / Needs action / With issues / Not started, with counts; S5-R16 wraps on a phone | No filter chips at all; one line instead — _"2 of 14 have findings with no lines yet"_ — on the grounds of _"about one inspection a quarter per asset"_ | **Needs your call.** The two documents assume volumes that differ \~15×: S5-E8 sizes an asset at \~150 rows over three years, the design at ten in a year. We are running a read-only query on production to settle which is real; that number should decide this and the paging deferral together. |
| 3 | **A new per-axle field** | S8-R2: pre-filled with four rows — tire pressure, tread depth, brake lining, push-rod travel — with the unit and tire/brake defaults of S8-R3/R4 | `FR-01`: arrives **empty**; those four appear only as examples | **Pre-filled, per the PRD.** It is the better first-run experience and the seeded starters need those rows anyway. Confirming means S8-R3/R4's named defaults are real requirements. |
| 4 | **Measurement units** | S8-R28: inches first in the list | Five units: `psi, mm, in., 32nds, ft-lbs` | **Keep the shipped list, reorder it.** The product ships **nine** units today (`mm, in., PSI, 32nds, ft·lbs, in. H₂O, V, mi, hr`). Adopting the design's five would remove four that live templates may already use. Putting inches first is safe; shortening the list is not. |
| 5 | **Preview mode and the axle count** | S12-R31: adding or deleting an axle in Preview **writes the count back to the draft** — described as the reason the mode exists | Four separate statements that Preview persists nothing, including _"discarded, not persisted"_ and _"no draft mutation"_ | **Needs your call.** Small either way, but it cannot be split: one says write, the other says discard. |
| 6 | **Reference file limit and accepted types** | S11-R3: 20 MB, _"which is what the endpoint enforces"_; S11-R2 accepts PDF, image incl. HEIC, Word, Excel | Copy reads `PDF, JPG or PNG · up to 10 MB` — and the design contradicts itself, since `FR-05` keeps HEIC/TIFF/Word/Excel with the download-only viewer | **Needs your call on the number.** See §2 — there is no endpoint today, so nothing is being enforced and nothing can drift. The accept list should be S11-R2's; only the size is genuinely open. For reference, inspection **photos** today are capped at 10 MB per inspection in total. |
| 7 | **The build flow on a phone** | S3-R3 promises the whole flow without switching device; S15-R26 makes the panel a full-screen modal on a phone | The hand-off surfaces are scoped **desktop only**; no phone artboards exist for drafting or review | **Design needed.** The requirement is right and it closes the gap the earlier review filed as MF-6 — but it has no design, and it is the hardest surface in the epic to render on a phone. |
| 8 | **What "open" means for a work order** | S2-R5/S6-R8: closed = Complete, Invoiced, Paid, Declined, or an invoice exists | _(not addressed)_ | **Needs your call, and it is the most consequential one here.** See §2. |

---

### 2 · Statements the code refutes — these need rewording whatever else is decided

These are not disagreements about what to build. They are places where the PRD asserts current behaviour that does not exist, or specifies a state the platform cannot produce.

1. **S8-R1 — "the Measurement field will no longer carry an axle option."** There is no axle option, and never has been, anywhere in the product. Nothing to remove and nothing to migrate. This also closes the earlier review's MF-9, which was filed because the removal had no migration story.
2. **S11-R3 — "the limit is 20 MB, which is what the endpoint enforces."** No such endpoint and no such field exist. A template field cannot hold a file of any kind today, not even the instructions type. S11 is entirely new work, so the limit and the accept list are decisions to make (item 6 above), not facts to keep in sync.
3. **S3-E4 — "a completed inspection with no report generated yet."** That inspection cannot exist. In code, an inspection becomes _completed_ **only** as a result of generating the PDF report, so a completed inspection always has one. Either this edge case means _submitted_, or V2 needs to separate completion from report generation — which would be a real change with its own consequences.
4. **The Key Decision that building requires a completed inspection**, justified by _"a submitted one can still be reopened and changed."_ Completed inspections can be reopened too — reopen accepts both states and existing reports survive it. The gate may still be what you want, but its stated reason does not hold, and the "submitted vs completed" ambiguity the earlier review filed as MF-8 is answered: _completed_ means _a report exists_.
5. **S2-E8 — "if the shop has no labour types, the build proceeds and the labour cost is zero."** The platform rejects that line: creating a line requires a labour type or a fixed price, and S2-R18 rightly forbids a generated line from being a Fixed Line Total. As written this case cannot be built.
6. **S2-R9 — generated lines resolve their labour type "the same way the manual New Line form does."** The "default, else first available" fallback is **frontend** behaviour in the existing ShopCoach builder; the server has no such rule. Worth restating as a requirement in its own right rather than a reference to existing behaviour.
7. **S5-E3, S2-E9 and S5-E7 — what happens when the work order is deleted.** Deleting a work order hard-deletes its lines, and deleting a line deletes its inspections. So there is no inspection row left to show a dash on, and nothing to return to _Needs action_. These three cases need rewriting, or the model needs a snapshot so an inspection can outlive its work order.
8. **S5-R21 — "an inspection stays on the asset it was run on."** Not true today: an inspection has no asset column, so its asset is derived by joining through the work order — and a work order's vehicle can be switched on any status except invoiced or paid. Honouring S5-R21 means storing the asset on the inspection when it is created. We plan to do that; flagging it because it is a schema decision the PRD reads as a statement of fact.
9. **S2-N5 — money masked "exactly as the manual New Line form" does.** That form uses two different permissions for two different groups of fields, and it hides rather than masks. There is no single established rule to copy, and S2-N5 additionally asks for server-side masking, which nothing does today.

**And item 8 from §1 — what "open" means.** The codebase contains **twelve** different definitions of an open or editable work order and no single canonical one. Three disagree with each other on exactly the statuses this epic cares about: the app-wide UI flag treats **Declined as editable**, WIP reporting treats **Complete as open**, and the inspections context's own rule matches the PRD. A fourth answer is in this page's own comment thread, still open, from 25 August: _"'review' is considered open. 'Complete' is also considered open. The only 'closed' work order is one that has been invoiced."_ S2-R5 contradicts that directly, and deliberately, on the grounds that adding a line to a billed work order acts on its invoices without any invoicing permission — **which we verified and is correct**: it voids a pending invoice, or for a sent or paid one it creates a whole new work order. So S2-R5's reasoning is sound. What is needed is an explicit ruling that S2-R5 supersedes that comment, so the plan can name one predicate and cite it instead of adding a thirteenth.

---

### 3 · Two rules the platform cannot currently enforce

S2-R17 states, once, for the whole document, that every rule withholding an action is enforced by the server, citing SV-7932. Two things stand in the way:

* **The permissions this epic keys off are the same permission underneath.** There is no "work order line create & edit" permission at the enforcement level — it was retired. That bundle and "Work Orders — Create & Edit" resolve to _identical_ underlying rights, so S2-N3 and S2-N4, which withhold different things, cannot be told apart server-side. "Work Orders — View" also resolves the edit right, by a deliberate and documented platform policy. The plan adds one new permission scoped to the new endpoints so S2-R17 holds where this epic needs it, without disturbing that policy. This makes the earlier review's MF-1 larger than filed, and it is worth knowing that S6-E3's whole scenario — someone who can fill inspections but cannot create work orders — is not representable today.
* **Nothing checks the ShopCoach entitlement on the server.** S2-R0 and S15-N1 make ShopCoach the gate for the entire build capability, but the endpoint the flow calls never consults the licence; only the interface does. That is precisely the SV-7932 pattern, in the exact endpoint S2-R17 was written to protect.
* **Related: S15-R23** — "the brief and the model will be changeable on QA without a release" — cannot be satisfied in this repository. No brief, prompt or model lives here; they are all on the ShopCoach side. That makes SV-9112 a hard external dependency for S15 rather than a sibling story, and it compounds the two items already open on this page: the unnamed ShopCoach owner, and that assistant drafting is not testable on QA. S15-R17 is the epic's only release gate, and it currently has neither an owner nor a working environment.

---

### 4 · Surfaces with requirements but no design

Raised here because the plan will proceed from the PRD text on the first three, and they will be built to whatever the text says:

* **The customer report (S13)** — no artboard. Fourteen requirements, mostly removals, which is workable. Two parts genuinely need a designer: **S13-R0**'s new per-axle table with its status column, and making a verdict readable **in black and white** — the recorded print rule is mono, and the whole app carries verdicts by colour, so Not OK and OK become the same cell on a shop printer.
* **The provenance note and Audit Log entry (S7)** — no artboard. Plannable from text.
* **The desktop outstanding-items list** that S1-R5 and S17-R5 both require — not drawn at all, and its phone counterpart is recorded in the design as _"unimplemented and unreviewed"_.
* **Review & Sign / the technician signature** — neither designed nor specified, yet it is an authoring option in S12-R3, a column in S5-R3, and the phone's last-section action. The earlier review filed this as MF-11 and it is still open.
* The properties panel is drawn only for **Checkbox** and **Per axle**; Text, Measurement, Photo and Instructions have no design — so S8-R28's unit list has nowhere to be seen.

---

### 5 · Good news, for the record

* **S17 is already built.** The setting, its server-side enforcement at submit, and the builder toggle all ship today. The only open question is the default (item 1).
* **S13-R12 is already satisfied** — reports already version on every regeneration, with older ones retrievable and links resolving to the newest.
* **The load-bearing assumption is a fact.** "Inspections stay pinned to the template version they started on" is enforced in code on every write path, so it can be promoted out of Assumptions.
* **MF-4 is opt-in, not the default.** Generated lines arriving pre-approved only happens in shops that have deliberately turned auto-approval on; the shipped default requires approval.
* The auto-approve behaviour of S2-R7, the new-work-order creation of S2-R6, and the system-note pattern of S7-R1 all already exist and will be reused rather than rebuilt.

---

Answers most useful first: **items 1, 2, 5 and 8** unblock the most planning, and **item 8** is the one with a contradicting answer already sitting unresolved in this page's comments. Everything in §2 needs an edit to the page regardless of what is decided elsewhere.

### 861569028 — Milan Zivanovic — 2026-09-16T09:01:44Z (reply to 860553217)

**Follow-up: one item withdrawn, one recommendation corrected, one new question**

The technical plan is written and has since been through an adversarial audit against this page. The audit confirmed every factual claim in my earlier comment — including all nine items in §2 and all five in §5 — so nothing there needs revisiting. Three things do.

---

**Item 5 (Preview and the axle count) — withdrawn. No ruling needed.**

I asked you to choose between `S12-R31` writing the axle count back to the draft and the design's insistence that Preview persists nothing. That was a false choice and I should have caught it: the design's prohibition is asserted over **inspection and answer** records — its own self-check reads _"assert the inspection tables are untouched"_ — and writing a draft **template's** axle count touches none of them. The two documents are reconcilable, `S12-R31` stands as written, and the plan builds it. Sorry for the noise.

---

**Item 1 ("Photo required if Not OK" default) — my recommendation was wrong. Build it ON unless you want otherwise.**

I recommended **off**, on the grounds that the setting already ships off and the design reversed it deliberately. Both facts are true, but I under-weighted the decisive one: this page's **Key Decisions** section rules on it explicitly — _"Note required on a flagged response, and photo required on a Not OK response to a checkbox, are on by default for newly created templates"_ — and that section post-dates the design review by a week. That is a considered product position, not an oversight the older design supersedes.

So the recommendation is now: **on**, per `S17-R2`, unless you actively want the design's reversal. It is a one-line change in the builder either way, so this is cheap to settle late. Item 1 stays open — I just no longer want my earlier framing to be the reason it gets answered a particular way.

The same correction applies to the note rule, `S1-R2`, which the same Key Decision covers. The plan now builds both on by default for **newly added** fields, with existing templates untouched per `S1-E2`.

---

**Item 6 (reference-file size limit) — a hard constraint we did not know about.**

The PHP container caps uploads at **10 MB** today. So if the answer is 20 MB, that limit has to be raised in the same release or a 20 MB file will fail before it reaches any validation we write — the user would see a generic upload failure with no stated cause. Not an argument for either number; it just means 20 MB is an infrastructure change as well as a product one, and 10 MB is free.

---

**New question —** `S17-R3`'s photo gate can be unsatisfiable from an iPhone.

`S17-R3` blocks submit until a Not OK checkbox carries a photo. Inspection photos today accept **JPEG and PNG only**. An iPhone photographing a flagged item can produce a HEIC file, which is rejected — so a technician can be blocked from submitting by a requirement they cannot satisfy, with no stated cause. `S17-E4` covers only the case of photo upload being unavailable to the _shop_, and even then does not say whether the inspection submits.

This is not hypothetical: there is a bug on record from 2026-09-02 (Mobile Wrench Enterprises) reporting that photos cannot be uploaded onto inspection forms, described as blocking completion of required inspections. The earlier review of this page filed the same concern as MF-13.

Two ways out, and it is a product call which:

1. **Accept HEIC for inspection photos**, as the reference-file work already has to. Solves it properly; the conversion question that `S11-R9` defers applies here too.
2. **Reject it honestly** — name the accepted types at the point of failure, so the technician knows to switch their camera format rather than being stuck.

The plan currently assumes at minimum option 2, because shipping a hard submit blocker that a phone can fail to satisfy silently is the worse outcome. Option 1 is the better answer if you want it.

---

**Two small notes, no action needed unless you care:**

* `S12-R6` does not exist. The numbering jumps from `S12-R5` to `S12-R7`. Harmless, but worth fixing since Jira stories and QA cases cite these ids.
* `S8-R24` and `S13-R0` overlap. `S8-R24` requires the **report** to show per-axle values per position; `S13-R0` specifies the same table as part of the report story. Because an inspection becomes _completed_ only when its PDF is generated, a per-axle field whose report rendering is deferred would print as a bare label with no readings on every completed inspection. The plan therefore builds the per-axle report rendering alongside the field itself rather than with `S13`. Flagging it so the two stories are not treated as independently schedulable.

---

Still most useful first: **items 1, 2 and 8**. Item 2's production query is drafted and schema-verified but not yet run — I will post the number here when it is.

### 862224385 — Milos Vasic — 2026-09-16T10:55:32Z (reply to 860553217)

@Milan Zivanovic   
Rulings on the planning pass, and the page is updated

All of this is on the page now, v30.

2. Asset tab filters. Not ruled; post the number when you have it. All and Needs action stay either way. The number decides the paging deferral in S5-E8 and whether With issues and Not started earn their place.
3. New per-axle field. Pre-filled, per the PRD. That makes S8-R3 and S8-R4's named units and tire/brake defaults real requirements.
4. Measurement units. Keep all nine, inches first. The design's five is a limitation of the tool it was drawn in. S8-R28 unchanged.
5. Reference file limit and types. Two lists, not one. Inspection photos take JPEG, PNG and HEIC; reference files take S11-R2 as written. S11-R3 now reads 20 MB where the platform upload cap is raised to match in the same release, and 10 MB where it is not. It no longer claims an endpoint enforces anything.
6. Build flow on a phone. Design added
7. What "open" means. S2-R5 stands, and the page no longer uses the word. S2-R4 and S2-R5 now name an eligible build target: eligible is Estimate, Approved, In Progress or Review; ineligible is Complete, Invoiced, Paid or Declined, or an invoice existing. Take this as the explicit ruling you asked for. S2-R5 supersedes the 25 August comment, and I will resolve that thread pointing here. Naming the predicate rather than the word is deliberate, so what you cite neither joins nor extends the twelve definitions.

One correction to the reasoning rather than the rule, now written into the note under S2-R5. Your verification covers a work order that has an invoice, but not Complete with no invoice, where there is nothing to void. It is ineligible there for a different reason: it is finished work the technician has come off, and new findings are new work.

One thing I could not settle from the page: Imported. It appears in the work order statuses but nowhere in this spec, so I have left it out of both lists rather than guess. My assumption is ineligible, since an imported work order is historical data. Tell me if you know of a case where one takes new lines and I will write it in.

9. HEIC. Accepted for inspection photos, as S17-R9. Accepting it for reference files while rejecting it for the photo S17-R3 makes mandatory is not defensible in one release. S17-E6 requires the accepted formats to be named at the point of failure. The 2026-09-02 report is a live defect independent of V2.

On the nine corrections: all accepted and applied. 

3 (S3-E4) is deleted. Completion implies a report, and I am not separating the two in this epic. The Key Decision now gives that as its reason, since both submitted and completed inspections can be reopened.

5 (S2-E8) is deleted. "The shop has at least one labour type" is now a prerequisite, and S2-N6 says the build states the reason rather than producing a line that cannot be saved.

7 and 8 (the deletion cases and S5-R21): snapshot. S5-R21 is now a schema requirement, with the asset stored on the inspection when it is created. Two things go beyond your framing. It also needs a backfill for existing inspections, which is written in; without it S5-R2's "every inspection linked to that asset" is false for all history. And S2-E9 covered two cases, only one of them impossible. Lines on a new work order that is later deleted leave the inspection alive on its original one, and it should return to Needs action. That is S2-E9 now, and the same-work-order case is the new S2-E12, kept beside it.

9 (S2-N5) is rewritten. It now names the withheld fields, being the labour rate, the labour total and the part prices, instead of inheriting the New Line form. The note beneath says why: two permissions, two groups of fields, hiding rather than masking, so there was no single rule to copy.

### 862322690 — Milan Zivanovic — 2026-09-16T12:38:13Z (reply to 860553217)

**Imported — answered, and there is a precedent**

Your assumption is right, and the reason is stronger than "historical data": **Imported is not a work order status.** The status enum has exactly eight values — Estimate, In Progress, Approved, Declined, Ready for Review, Complete, Invoiced, Paid — and `imported` is not among them. Imported work orders are a **separate aggregate in their own table**, with no line relationship at all, so there is no path by which one could take a new line. Leaving it out of both lists is correct; adding it would imply a state the platform cannot produce.

There is also a precedent that settles it. Product answered this same question on **2026-08-26** for SV-9315, and it is recorded in the domain code: _"Declined is editable today and locking it is a behavior change this epic shouldn't make. Drop both \[Declined and Imported\] — S1-N1/N2 read 'Complete, Invoiced, or Paid.'"_ That ruling treated Declined and Imported as a pair and dropped both.

Worth knowing that the new page treats the two differently, and that is fine rather than a contradiction. SV-9315 was about whether the **platform** locks a work order against edits; `S2-R5` is about whether the **build** offers one as a destination. A Declined work order stays editable — nobody is locking it — and the build simply routes new findings to a new work order instead, for the reason `S2-R5` gives. Different rules, different subjects.

---

**Two questions your rulings leave open**

**1 ·** `S5-E3` — what does "the row remains usable" mean once the work order is gone?

The schema half is clear and we will build it. The behaviour is not, because of how an inspection is read today: the detail is loaded by joining **through** its work-order line to the work order and the asset. With the line gone, the row survives in the asset list but the inspection cannot be opened — the query serving the fill and completed views returns nothing.

Three candidate boundaries:

1. **Listed only** — the row shows template, date, technician and findings from the list query; the inspection is not openable.
2. **Listed and readable** — the completed inspection opens read-only, which means the detail query stops depending on the work-order line.
3. **Listed, readable, and its report still downloadable** — the artefact a customer asking about a truck's brake history actually wants.

We would build **(3)** unless you say otherwise. (1) makes the tab a teaser, and (3) is barely more than (2), since the report is already stored against the inspection rather than the work order.

**2 · Does a HEIC photograph reach the customer report?**

`S17-R9` closes the submit-blocker trap, and the two-lists framing is right. It surfaces a second problem behind it.

`S17-R3` makes a photograph **mandatory evidence**, and `S17`'s own user story says the point is that "the finding carries evidence the advisor **and the customer** can both look at." But `S13` never mentions a photograph in any of its requirements, and the PDF renderer cannot render HEIC. So a technician can be _required_ to attach evidence that does not appear on the only customer-facing artefact — and accepting HEIC widens that gap rather than creating it. This is the earlier review's MF-12, still open.

What should the report do until `S11-R9`'s conversion ticket lands?

1. **Convert on the report path only** — pull the conversion forward just far enough to render photographs in the PDF.
2. **Print what renders, and say what does not** — a placeholder naming the format, so the advisor can see a photo exists and open it in the app.
3. **Leave** `S13` silent — accept that required photographs may be missing from the report, and record it.

Our preference is **(2)**: honest, cheap, and it keeps `S17`'s promise visible even when the file cannot be drawn.

---

**One thing we are deciding rather than asking**

`S11-R3`'s limit is conditional on the platform cap, and that cap is ours to raise. **We are shipping 10 MB and not raising it**, so the panel says 10 MB. It is free, it matches the existing per-inspection photo budget so a shop meets one number rather than two, and 20 MB of reference PDF is unusual. Raising it later is a one-line change plus a copy update — say so if you would rather have 20 MB now.

---

**One editorial thing.** The page no longer uses "open" or "closed" as you intended, with four exceptions that still read the old way: `S2-N4`, `S2-E4`, `S6-N3` and `S6-E3`. Flagging them only because QA will read those four literally, and the point of the new predicate is that there is one name for it.

Item 2's number is still owed from our side — noted that All and Needs action stay either way, which narrows what it decides. Phone design: noted as added, thank you.

### 862420994 — Milos Vasic — 2026-09-16T12:50:47Z (reply to 860553217)

I agree with proposed solutions @Milan Zivanovic ,  i will make sure that QA undesrand statues :slight_smile: 

---

## Inline threads (all 9 are status "open"; none resolved, reopened or dangling)

### 782008325 — Sasha Grosman — 2026-08-14T22:03:56Z
Anchored on: "S11: Attach a document to an instruction"

Needs to be added to any questions type.  
  
Need a second story to describe the behavior for Techs filling this out. Need a design/requirements for desktop and mobile view.

(no replies)

### 805404675 — Sasha Grosman — 2026-08-25T05:04:24Z
Anchored on: "rather than one for the whole row"

not needed

(no replies)

### 805535746 — Sasha Grosman — 2026-08-25T05:04:52Z
Anchored on: "We dont have space to store past inspections and findings are lost"

Grammar seems odd here, it took me a second to understand this.

- 805404692 — Milos Vasic — 2026-08-25T07:17:13Z: Changing

### 805273612 — Sasha Grosman — 2026-08-25T05:05:48Z
Anchored on: "Template authors can require a note on flagged responses, a photo on a Not OK response, and Attach a reference file to any question"

the attach a reference file to any question req. seems like a separate bullet.

- 805863431 — Milos Vasic — 2026-08-25T07:30:09Z: Done

### 805634049 — Sasha Grosman — 2026-08-25T05:07:13Z
Anchored on: "artifact"

speling

(no replies)

### 805502978 — Sasha Grosman — 2026-08-25T05:07:50Z
Anchored on: "Bulk building across several inspections at once"

What is bulk building? Is this referring to using ShopCoach line builder across multiple inspections?

- 805863425 — Milos Vasic — 2026-08-25T07:19:42Z: Not sure about this one. Removing

### 805371907 — Sasha Grosman — 2026-08-25T06:09:29Z
Anchored on: "Review"

Let’s confirm with @Fabian Bonjean that Review belongs here.

(no replies)

### 805404683 — Sasha Grosman — 2026-08-25T06:32:34Z
Anchored on: "raft the lines with ShopCoach"

We need the prompt itself; and we need to create criteria to verify the prompt is generating proper results.  
  
We can play around with this during build process. Probably use CS team to help us verify what we are building works.

- 805797891 — Milos Vasic — 2026-08-25T07:27:24Z: This is what i mentioned , that we need to check. This can be done during the build phase 

### 806486304 — Sasha Grosman — 2026-08-25T14:33:51Z
Anchored on: "The system will offer the existing work order only while it is open. Open means Estimate, Approved, In Progress or Review"

@Fabian Bonjean this is the one.  
Is an work order in “Review” state something that is considered ‘open’? Should users still be able to add lines to WO in Review state?

- 807174145 — Fabian Bonjean — 2026-08-25T16:29:46Z: Yes, ‘review' is considered open.   
  
  'Complete’ is also considered open.   
  
  The only ‘closed’ work order, is one that has been invoiced.   
  
  @Sasha Grosman 
- 806813699 — Sasha Grosman — 2026-08-25T16:42:00Z: Thanks @Fabian Bonjean fyi @Milos Vasic 

---

## Decisions in comments — and whether they are after 22 Sep

| Decision | Who / when | After 22 Sep? | Where it stands now (page v43) |
|---|---|---|---|
| Review and Complete are "open"; only invoiced is closed | Fabian Bonjean, 2026-08-25 | No | **Superseded** by Milos Vasic 2026-09-16 (reply 862224385: "S2-R5 supersedes the 25 August comment") and by S2-R4/S2-R5 (Complete ineligible). The inline thread was never resolved, despite the PM saying he would resolve it. |
| Eligible build target = Estimate/Approved/In Progress/Review; ineligible = Complete/Invoiced/Paid/Declined/invoice exists | Milos Vasic, 2026-09-16 | No | In the page (S2-R4/R5, S6-R8); S2-R4 additionally now says "and no invoice exists". |
| Photo-required default ON (Milan's corrected recommendation) | Milan Zivanovic, 2026-09-16 | No | **Overturned later in the page itself**: S17-R2 now reads "off by default" (changed between 22 Sep and 14 Oct; Key Decision rewritten). |
| Reference file limit 10 MB ("We are shipping 10 MB") | Milan Zivanovic, 2026-09-16; PM "I agree with proposed solutions" | No | **Overturned later in the page**: change log 2026-10-07 "The reference file limit is 20 MB, since the platform cap is already above it"; S11-R3 "The limit is 20 MB" and the size is not stated in advance. |
| Deleted work order → option (3) listed, readable, report downloadable | Milan proposal, PM agreed 2026-09-16 | No | Written into S5-E3 (change log 2026-10-06/07). |
| HEIC photo on the report → option (2) placeholder | Milan proposal, PM agreed 2026-09-16 ("I agree with proposed solutions") | No | **Not written into the page**: S13 says nothing about photos. Remains a comment-only agreement (see SOURCE-CHECK §7). |
| Asset-tab filters: "All and Needs action stay either way" | Milos Vasic, 2026-09-16 | No | **Overturned later in the page**: S5-R10 "The table has no filter row" (filters removed in v32, change log 2026-10-07). |
