|  |  |
| --- | --- |
| **PM** | Milos Vasic |
| **Jira Epic** | [SV-8181](https://shopview.atlassian.net/browse/SV-8181) |
| **Tech Design** | TBD |
| **QA Environment** | [https://sv8181.qa.shopview.com](https://sv8181.qa.shopview.com) |

# Business Case

Inspections are already digital, but a finding does not lead to work. When a technician marks three items Not OK, those findings land in a PDF and stop there; somebody has to re-type each one by hand as a work order line. Anything nobody re-types never becomes work, and there is no list of inspections that found something and were never actioned. Inspections are also reachable only through the work order they were run on, so a fleet customer asking about a truck's brake history has no answer.

# Feature Overview

**Core ShopView**

* Users with ShopCoach can turn an inspection's Monitor and Not OK findings into work order lines in one action
* The build can be started from three places: a completed inspection, the inspection report note on a work order, and the asset's Inspections tab
* Users choose whether the lines go on the inspection's own work order or a new one, and the choice is made before the drafting starts
* ShopCoach drafts the lines and the user reviews and edits them; nothing reaches the work order until they are added
* Closed work orders are never modified; the system creates a new work order instead
* A note and an Audit Log entry record which inspection the lines came from
* An Inspections tab on the asset record lists every inspection ever run on that asset, with a filter for the ones that still need a work order
* Technicians can record brake and tire measurements per axle, adding axles at fill time, with a verdict on every tire rather than one for the whole row
* Template authors can require a note on flagged responses, a photo on a Not OK response, and attach a reference file to any question
* The template builder offers starting points and a reduced empty state

**Mobile**

* Technicians can complete an inspection and build a work order from it on a phone
* The asset Inspections tab and the inspection report note are usable on a phone

**Out of scope**

* Conditional logic of any kind. A response cannot reveal further questions or instructions
* A non-ShopCoach line builder. Building lines from an inspection requires ShopCoach; without it an inspection reports its findings and a person builds the work order
* The Line Builder started from a work order with no inspection. That flow already exists and is not an inspection story. It is referenced only where it constrains this work, in S15-R16 and S15-N5
* Template authoring on mobile. The builder is a desktop tool
* Notifications for inspections that need a work order
* Customer portal changes. The PDF report is the customer-facing artefact
* Bulk building across several inspections at once

# Jobs to be Done

**When** I finish an inspection and have found problems, **I want to** turn those findings into work order lines without re-typing them, **so I can** quote and schedule the work without losing anything.

**When** a customer asks what has been done to an asset over time, **I want to** see every inspection run on it in one list, **so I can** answer from history instead of hunting through work orders.

**When** I am reviewing a work order weeks later, **I want to** see that its lines came from an inspection and which one, **so I can** trace the work back to the evidence for it.

**When** I inspect a tractor-trailer, **I want to** record measurements per axle, left and right, **so I can** capture what I actually measured instead of forcing it into a single number.

Goals:

* Remove double entry between an inspection and a work order
* Make unactioned findings visible instead of silently lost
* Give the asset record a condition history
* Let one template carry the procedure the technician needs while answering

# Key Decisions

* Both Monitor and Not OK findings feed the work order. Monitor items are planned work, not noise.
* A closed work order is never modified. Adding a line to a work order that is Complete or Invoiced also acts on its invoices, and a user with line rights but no invoicing rights would silently void an invoice they cannot even open. The system creates a new work order instead.
* Building is per inspection, never batched across inspections, so the trail from an inspection to a work order stays one to one.
* Per axle is its own field type. The Measurement field returns to a single value with a unit.
* A verdict is recorded per position, not per row. A row's verdict and an axle's verdict are derived from the positions beneath them, worst first.
* A unit belongs to a measurement row, and the technician can change it while filling — one row at a time, across the whole axle. The template's unit is the default, not a lock: the author cannot know whether the unit in front of the technician reads in inches or millimetres.
* What is not supported is a unit per position. One tire in inches and the next in millimetres would make a row's readings incomparable and its roll-up meaningless.
* Note required on a flagged response, and photo required on Not OK, are on by default for newly created templates. Existing templates are never altered.
* Building work order lines from an inspection is a ShopCoach capability. Without ShopCoach an inspection reports its findings and a person builds the work order; there is no non-AI line builder.
* Conditional follow-ups and instruction acknowledgement are out of scope. Neither exists today, and a conditional note that collects nothing back was not worth building.
* The Drum or Disc choice is offered on every axle at fill time rather than enabled by the template author, and may be left blank.
* Short text and Long text merge into one Text field. The distinction was a formatting decision users should not have to make.
* Response labels are editable by the author, but the customer report always uses the standard wording so reports stay comparable across shops.
* Filter counts on the asset Inspections tab describe the inspection, not the viewer's permissions, so the counts read the same for everyone. Only the action button is permission-gated.
* Instruction attachments are not deleted in this release. The same file is referenced by later template versions, and deleting it would break earlier published versions and the completed inspections under them. Accepted cost.
* Concurrent builds are accepted. The worst outcome is two work orders or duplicated lines, which is recoverable.
* Navigation and drafting happen together. The user picks the destination, arrives on that work order's Lines tab, and watches the lines being drafted there rather than waiting on the inspection.
* Nothing reaches the work order until the user presses Add Lines. Until then the proposed lines do not exist as work order lines and no state depends on them.
* There is no prompt in ShopView's own code. The assistant is briefed by what the system composes into the content it is sent, so the brief is a ShopView deliverable rather than a ShopCoach setting.
* The user never types anything to get lines. No prompt, no query box, no configuration step in the inspection flow.
* ShopCoach is named once, at the destination step. Everywhere else the purple treatment and the AI badge carry the meaning, so the action label does not name the product.

# Assumptions

* Inspections stay pinned to the template version they started on, so editing or republishing a template does not change a running or completed inspection. Several requirements below depend on this; if it is not true, the edge cases around changing a published template need rework.
* Digital Inspections is already released and in use. This spec extends it and does not restate Phase 1 behaviour.

# Feature flag

* This feature sits behind the existing Digital Inspections feature flag
* When the flag is off, none of the stories below are available, regardless of a user's permissions

---

# Requirements

| Jira | Story |
| --- | --- |
| **Capturing findings** |  |
| [SV-9099](https://shopview.atlassian.net/browse/SV-9099) | S1: Require a note on flagged responses |
| [SV-9440](https://shopview.atlassian.net/browse/SV-9440) | S17: Require a photo on a Not OK response |
| [SV-9106](https://shopview.atlassian.net/browse/SV-9106) | S8: Record measurements per axle |
| [SV-9109](https://shopview.atlassian.net/browse/SV-9109) | S11: Attach a reference file to a question |
| **Building work from findings** |  |
| [SV-9100](https://shopview.atlassian.net/browse/SV-9100) | S2: Turn findings into work order lines |
| [SV-9101](https://shopview.atlassian.net/browse/SV-9101) | S3: Build from a completed inspection |
| [SV-9102](https://shopview.atlassian.net/browse/SV-9102) | S4: Build from the inspection note on a work order |
| [SV-9104](https://shopview.atlassian.net/browse/SV-9104) | S6: Build from the asset Inspections tab |
| [SV-9105](https://shopview.atlassian.net/browse/SV-9105) | S7: Record where the lines came from |
| [SV-9404](https://shopview.atlassian.net/browse/SV-9404) | S15: Draft the lines with ShopCoach |
| **Inspection history** |  |
| [SV-9103](https://shopview.atlassian.net/browse/SV-9103) | S5: Inspection history on the asset record |
| **Authoring and output** |  |
| [SV-9110](https://shopview.atlassian.net/browse/SV-9110) | S12: Template builder authoring |
| [SV-9111](https://shopview.atlassian.net/browse/SV-9111) | S13: Customer-facing inspection report |
| [SV-9397](https://shopview.atlassian.net/browse/SV-9397) | S14: Inspection filling on a phone |

---

## S1: Require a note on flagged responses

**As a** template author, **I want** the technician to explain any Monitor or Not OK response, **so that** the finding is actionable when it becomes a work order line.

**Design:** [Digital Inspections V2 design](https://claude.ai/design/p/0c2be389-b1b1-41f9-8b95-6dba538c69ba?file=Digital+Inspections+V2+-+All+Screens.dc.html)    
**Jira:** [SV-9099](https://shopview.atlassian.net/browse/SV-9099)

**Prerequisites**

* The template contains at least one checkbox or per-axle measurement field
* The author has 'Settings — Service' enabled
* The technician filling the inspection has 'Work Order Lines — Create & Edit' enabled

**Requirements**

* **S1-R1:** A checkbox field will offer an authoring option, "Note required if Monitor / Not OK"
* **S1-R2:** The option will be on by default for newly added checkbox fields
* **S1-R3:** When the option is on and the technician selects Monitor or Not OK, a note will be required before the inspection can be submitted
* **S1-R4:** The system will enforce the requirement on submit, not only while the technician is filling the form
* **S1-R5:** Before submit, the technician will see the field listed among the outstanding items, so they are not rejected by an error they could have avoided
* **S1-R6:** The same option will apply to per-axle measurement fields

**Negative cases**

* **S1-N1:** If the option is off, a Monitor or Not OK response with no note will submit successfully
* **S1-N2:** If the response is OK or N/A, no note will be required

**Edge cases**

* **S1-E1:** A note containing only spaces counts as empty
* **S1-E2:** Templates created before this release are unaffected until an author opens one and turns the option on
* **S1-E3:** If the option is turned on while an inspection is already in progress, that inspection keeps the rule it started with
* **S1-E4:** If the technician writes a note and then changes the response to OK, the note is kept
* **S1-E5:** On a per-axle field, the requirement triggers when any axle is marked Monitor or Not OK
* **S1-E6:** If the field has no label, the outstanding-items list still identifies it by its type and position rather than showing an empty row

---

## S17: Require a photo on a Not OK response

**As a** template author, **I want** the technician to photograph what they marked Not OK, **so that** the finding carries evidence the advisor and the customer can both look at.

The note half of this rule is S1. This is its sibling, and the two are authored the same way.

**Design:** [Digital Inspections V2 design](https://claude.ai/design/p/0c2be389-b1b1-41f9-8b95-6dba538c69ba?file=Digital+Inspections+V2+-+All+Screens.dc.html)    
**Jira:** [SV-9440](https://shopview.atlassian.net/browse/SV-9440)

**Prerequisites**

* The template contains at least one checkbox field
* The author has 'Settings — Service' enabled
* Photo upload is available to the technician filling the inspection

**Requirements**

* **S17-R1:** A checkbox field will offer an authoring option, "Photo required if Not OK"
* **S17-R2:** The option will be on by default for newly added checkbox fields
* **S17-R3:** When the option is on and the technician selects Not OK, at least one photo will be required before the inspection can be submitted
* **S17-R4:** The system will enforce the requirement on submit, not only while the technician is filling the form
* **S17-R5:** Before submit, the technician will see the field listed among the outstanding items, so they are not rejected by an error they could have avoided
* **S17-R6:** The option applies to checkbox fields only. A per-axle field records a verdict per position, and there is no single position a photo of the field would belong to
* **S17-R7:** The option is separate from "Photo required", which asks for a photo whatever the response. When both are on the unconditional rule is the one the technician is held to, and the summary sentence in the builder says so

**Negative cases**

* **S17-N1:** If the option is off, a Not OK response with no photo will submit successfully
* **S17-N2:** OK, Monitor and N/A never require a photo. Monitor requires a note, not a photograph
* **S17-N3:** Templates created before this release are unaffected until an author opens one and turns the option on

**Edge cases**

* **S17-E1:** If the technician attaches a photo and then changes the response to OK, the photo is kept
* **S17-E2:** If the technician satisfies the rule and then removes the photo, the field blocks submit again
* **S17-E3:** If the option is turned on while an inspection is already in progress, that inspection keeps the rule it started with
* **S17-E4:** If photo upload is unavailable to the shop, the technician is told why rather than being blocked by a requirement with no visible cause
* **S17-E5:** If the field has no label, the outstanding-items list identifies it by its type and position rather than showing an empty row

---

## S2: Turn findings into work order lines

**As a** user, **I want** an inspection's findings turned into work order lines in one action, **so that** nothing is re-typed and nothing is lost.

This story defines what committing the lines does: which work order they land on, how they are approved, and what the inspection's state becomes. How the lines are drafted and reviewed before that point is S15. The three places the build can be started from are S3, S4 and S6.

**Design:** [Digital Inspections V2 design](https://claude.ai/design/p/0c2be389-b1b1-41f9-8b95-6dba538c69ba?file=Digital+Inspections+V2+-+All+Screens.dc.html)    
**Jira:** [SV-9100](https://shopview.atlassian.net/browse/SV-9100)

**Prerequisites**

* The inspection is completed
* The inspection has at least one Monitor or Not OK finding
* User has 'Work Order Lines — Create & Edit' enabled
* Creating a new work order additionally requires 'Work Orders — Create & Edit' enabled
* The work order the inspection was run on can be identified

**Requirements**

* **S2-R0:** Building lines requires ShopCoach. Without it the completed inspection offers the report and a link to its work order, and no build action at all
* **S2-R1:** Every Monitor and Not OK finding will be represented by at least one line. ShopCoach composes each line's name, description, time estimate and parts; the field label, the measured value and the technician's note are inputs to that drafting rather than the line text itself (S15)
* **S2-R2:** A generated line will behave as an ordinary work order line from that point on, indistinguishable from one a user typed
* **S2-R3:** The user will choose the target before any drafting starts: the work order the inspection was run on, or a new work order
* **S2-R4:** The system will offer the existing work order only while it is open. Open means Estimate, Approved, In Progress or Review
* **S2-R5:** When the work order the inspection was run on is closed, the system will create a new work order without asking. Closed means Complete, Invoiced, Paid, or an invoice already exists
* **S2-R6:** A new work order will be created for the same customer and asset as the work order the inspection was run on, using their current values
* **S2-R7:** When the lines are added, they will arrive approved or awaiting authorisation according to the shop's existing setting for automatically approving work order lines, exactly as a manually added line does
* **S2-R8:** A work order in Approved status will not require re-approval, because approval applies to lines rather than to the work order
* **S2-R9:** Generated lines will resolve their labour type the same way the manual New Line form does, taking the default labour type and falling back to the first available one. The labour rate will follow from the labour type
* **S2-R10:** The time estimate ShopCoach proposes will be carried onto the line, and will be editable before the line is added. Where no estimate is proposed the line arrives at zero, to be estimated by whoever plans the work
* **S2-R11:** The user will arrive on the target work order's Lines tab as soon as the target is chosen, before the drafting has finished, and will watch it complete there
* **S2-R12:** Once the lines have been added, the inspection will no longer count as needing a work order. Drafting alone does not change that state, because a draft the user abandoned left the findings unactioned
* **S2-R13:** If lines have already been added from this inspection, the user will be asked to confirm before adding a second set. The check is made when Add Lines is pressed, on the state at that moment

**Negative cases**

* **S2-N1:** If the inspection is not completed, the build will not be offered
* **S2-N2:** If the inspection has no Monitor or Not OK findings, the build will not be offered
* **S2-N3:** If the user does not have 'Work Order Lines — Create & Edit' enabled, the build will not be available from any entry point
* **S2-N4:** If the user does not have 'Work Orders — Create & Edit' enabled, the option to create a new work order will not be shown. They will only be offered the option to add lines to the open work order
* **S2-N5:** If the user does not have 'See Financial Data' enabled, the build is still allowed. Money on the resulting work order stays hidden by the existing rules

_Note: S2-N5 is deliberate. The build is functionally the same as the manual New Line form, which a user without financial visibility may already use. Money is never entered by the user during a build._

_Note on S2-R5: adding a line to a work order that is Complete or Invoiced also acts on its invoices, and that behaviour is not gated by any invoicing permission. Creating a new work order avoids putting a user with line rights but no invoicing rights in a position to void an invoice. Related:_ [_SV-7124_](https://shopview.atlassian.net/browse/SV-7124)

**Edge cases**

* **S2-E1:** If the work order has no asset, the build proceeds without one
* **S2-E2:** If a note is very long, it is given to ShopCoach whole rather than truncated before it is read
* **S2-E3:** An inspection with thirty flagged findings is built without a cap and without an extra confirmation. If the assistant cannot draft that many in one run, the run is split rather than the surplus findings being dropped (S15-R14)
* **S2-E4:** If the user chose to add lines to the open work order and it was closed by someone else in the meantime, the system tells the user and creates nothing
* **S2-E5:** If the work order the inspection was run on is deleted before the user confirms, the build fails without creating a partial result
* **S2-E6:** If two users draft from the same inspection at once, nothing is duplicated by the drafting itself, because a draft is not a work order line. Duplication happens only if both press Add Lines, which is accepted and recoverable
* **S2-E7:** If the inspection is reopened by someone else while a draft is on screen, the draft stays usable and any lines already added are kept
* **S2-E8:** If the shop has no labour types, the build proceeds and the labour cost is zero
* **S2-E9:** If the work order that was built is later deleted, the inspection counts as needing a work order again
* **S2-E10:** Reversing an invoice does not change the inspection's state, because the work order and its lines still exist

_What ShopCoach is told, how the wait is shown, and how the proposed lines are reviewed before they are added are specified in S15._

---

## S3: Build from a completed inspection

**As a** user, **I want** to start the build from the inspection I have just read, **so that** acting on the findings is the next step rather than a separate errand.

**Design:** [Digital Inspections V2 design](https://claude.ai/design/p/0c2be389-b1b1-41f9-8b95-6dba538c69ba?file=Digital+Inspections+V2+-+All+Screens.dc.html)    
**Jira:** [SV-9101](https://shopview.atlassian.net/browse/SV-9101)

**Prerequisites**

* The inspection is open in its completed, read-only view
* User has 'Work Order Lines — Create & Edit' enabled
* The conditions in S2 are met

**Requirements**

* **S3-R1:** The completed inspection screen will offer a Build Work Order action
* **S3-R2:** The action will run the build described in S2, including the choice of target work order
* **S3-R3:** The action will be usable on a phone, and the technician will be able to complete the whole flow without switching device

**Negative cases**

* **S3-N1:** If the inspection has no Monitor or Not OK findings, the action will not be shown
* **S3-N2:** If the user does not have 'Work Order Lines — Create & Edit' enabled, the action will not be shown. It will be absent, not disabled
* **S3-N3:** If the inspection is not completed, the action will not be shown
* **S3-N4:** If the organisation does not have ShopCoach, no build action is shown. The screen offers View PDF and a link to the work order and nothing else — the action is absent, not disabled and not behind a tooltip (S2-R0)

**Edge cases**

* **S3-E1:** If the work order the inspection was run on has been deleted, only the option to create a new work order is offered
* **S3-E2:** If another user builds from the same inspection while this screen is open, the confirmation in S2-R13 is based on the current state rather than the state when the screen loaded
* **S3-E3:** If the inspection is reopened while the screen is open, the action disappears

---

## S4: Build from the inspection note on a work order

**As a** user reading an inspection's results on the work order, **I want** to build from there, **so that** I do not have to open the inspection again to act on what I am looking at.

When an inspection completes, a note appears on the work order with the report thumbnail, the finding counts, and actions to view and download the report.

**Design:** [Digital Inspections V2 design](https://claude.ai/design/p/0c2be389-b1b1-41f9-8b95-6dba538c69ba?file=Digital+Inspections+V2+-+All+Screens.dc.html)    
**Jira:** [SV-9102](https://shopview.atlassian.net/browse/SV-9102)

**Prerequisites**

* The work order has an inspection report note
* The report recorded at least one Monitor or Not OK finding
* User has 'Work Order Lines — Create & Edit' enabled

**Requirements**

* **S4-R1:** The inspection report note will offer a Build Work Order action alongside the existing view and download actions
* **S4-R2:** The action will run the build described in S2, including the choice of target work order
* **S4-R3:** The confirmation in S2-R13 will be based on the inspection's current state rather than on the note. The note reflects the inspection as it was when it completed, so a build performed elsewhere afterwards would otherwise go unnoticed and the same findings could be built twice without warning
* **S4-R4:** All actions on the note will remain reachable on a phone, wrapping rather than overflowing

**Negative cases**

* **S4-N1:** If the report recorded only passes, the action will not be shown
* **S4-N2:** If the inspection has been deleted, the note remains as a record but the action will not be shown
* **S4-N3:** If the user does not have 'Work Order Lines — Create & Edit' enabled, the action will not be shown
* **S4-N4:** If the note is being read in the work order's history view, the action will not be shown
* **S4-N5:** If the organisation does not have ShopCoach, the note keeps its view and download actions and offers no build action (S2-R0)

**Edge cases**

* **S4-E1:** If the work order itself is closed, the build creates a new work order per S2-R5 and the note stays where it is
* **S4-E2:** If the inspection was already built from through another entry point, the user is asked to confirm

---

## S5: Inspection history on the asset record

**As a** user, **I want** every inspection ever run on an asset in one list, **so that** I can see its condition history and what still needs doing.

This story delivers the list. Acting on a row is S6.

**Design:** [Digital Inspections V2 design](https://claude.ai/design/p/0c2be389-b1b1-41f9-8b95-6dba538c69ba?file=Digital+Inspections+V2+-+All+Screens.dc.html)    
**Jira:** [SV-9103](https://shopview.atlassian.net/browse/SV-9103)

**Prerequisites**

* User has 'Customers — View' and 'Work Orders — View' enabled
* The asset is reachable from a customer record

**Requirements**

* **S5-R1:** An Inspections tab will appear on the asset record, alongside Work Orders, Invoices and Notes
* **S5-R2:** The tab will list every inspection linked to that asset, most recently completed first
* **S5-R3:** Each row will show the inspection, its status, the completion date, the technician who signed it, the findings, the work order it was run on, the report, and an action
* **S5-R4:** The inspection column will show the template name with its version beneath, which is what distinguishes repeated runs of the same template
* **S5-R5:** The status column will show the inspection's own progress only, and will not also express whether work is pending
* **S5-R6:** The findings column will show one item per finding type with a colour, such as 1 Not OK in red and 3 Monitor in amber
* **S5-R7:** The work order column will link to the work order the inspection was run on and show its status
* **S5-R8:** The report column will link to the report when one has been generated
* **S5-R9:** The action column will have three states. Needs action offers the build described in S6. Done shows the outcome and links to the resulting work order, reading "WO created" when a new work order was created and "Lines added" when the lines went onto the existing one. Nothing to do shows a dash
* **S5-R10:** A filter row will offer All, Needs action, With issues and Not started, each with a count taken from the full list rather than from the filtered view
* **S5-R11:** A summary will read "N of M need a work order"
* **S5-R12:** An inspection needs action when it is completed, has at least one Monitor or Not OK finding, and has not been built from
* **S5-R13:** Two users with different permissions viewing the same asset will see identical counts. Only the action button differs
* **S5-R14:** Everything that navigates will be a link and everything that changes something will be a button
* **S5-R15:** The tab will be usable on a phone. Every column's information will remain reachable and the page will not scroll sideways
* **S5-R16:** The filter row will wrap on a phone rather than scrolling out of view, and will keep its counts

**How findings are counted**

This rule is the single definition of the counts, and the asset list, the report summary and the Needs action filter all follow it.

* **S5-R17:** A response contributes one count to exactly one of Pass, Monitor or Needs attention when the field is visible, the field is a checkbox or a measurement, and the response is Pass, Monitor or Not OK
* **S5-R19:** N/A and unanswered responses contribute nothing
* **S5-R20:** A per-axle measurement field contributes one count per axle, because each axle is a separate inspected position. A field with three axles marked OK, Monitor and Not OK contributes one pass, one monitor and one needs-attention

**Negative cases**

* **S5-N1:** If the user does not have 'Work Orders — View' enabled, the Inspections tab will not appear at all. It will be absent, not empty
* **S5-N2:** If the user has 'Work Orders — View' but not 'Customers — View', the asset record is unreachable and so is the tab. No alternative route is added
* **S5-N3:** If the asset has no inspections, an empty state will explain so
* **S5-N4:** If the user cannot build, the action column will show no button on any row
* **S5-N5:** If the organisation does not have ShopCoach, the action column shows no build button on any row. The Needs action state described in S5-R9 does not arise (S2-R0)

**Edge cases**

* **S5-E1:** For a not-started inspection, the completion date, technician and findings show dashes and no action is offered
* **S5-E2:** A completed inspection whose responses are all N/A reads as having no issues and never needs action
* **S5-E3:** If the work order the inspection was run on has been deleted, the column shows a dash rather than a broken link and the row remains usable
* **S5-E4:** If the asset has been moved to a different customer, all of its inspections are still listed. The tab is the asset's history
* **S5-E5:** If the template has been archived or deleted, the row shows the template name and version as they were at the time, never "unknown"
* **S5-E6:** If two inspections share a completion time, the order between them is stable rather than varying between loads
* **S5-E7:** If the work order that was built is deleted, the row returns to Needs action rather than showing a Done state that points nowhere
* **S5-E8:** An asset inspected weekly for three years has roughly 150 rows, which the list shows without paging. Above roughly 200 rows the list will need a date filter or paging, which is follow-up work

**Open question**

* On release, every historical completed inspection with findings will read as needing a work order, including ones a shop already handled by hand. The data cannot tell the two apart. The recommendation is to flag only inspections completed after release, so that every item in the queue is real, with older inspections still reachable through the With issues filter. To be confirmed with a count of how many completed inspections have findings and no work order.

---

## S6: Build from the asset Inspections tab

**As a** user, **I want** to act on an unactioned inspection from the asset's history, **so that** I do not have to find the original work order first.

**Design:** [Digital Inspections V2 design](https://claude.ai/design/p/0c2be389-b1b1-41f9-8b95-6dba538c69ba?file=Digital+Inspections+V2+-+All+Screens.dc.html)    
**Jira:** [SV-9104](https://shopview.atlassian.net/browse/SV-9104)

**Prerequisites**

* The asset Inspections tab is available to the user (S5)
* The row needs action (S5-R12)
* User has 'Work Order Lines — Create & Edit' enabled

**Requirements**

* **S6-R1:** A row that needs action will offer a build action
* **S6-R2:** The action will present the target choice up front as a menu rather than opening a dialog, because the user has already decided by the time they click
* **S6-R3:** The menu will offer "Build new Work Order" and "Add lines to {work order number}"
* **S6-R4:** "Add lines to {work order number}" will be offered only while that work order is open, judged by its status on the row
* **S6-R5:** The action will run the build described in S2
* **S6-R6:** A row that has been built from will show its outcome instead of the action
* **S6-R7:** After a successful build, the row will leave the Needs action filter and the counts and summary will update with it
* **S6-R8:** What counts as closed here will be identical to S2-R5, including Complete

**Negative cases**

* **S6-N1:** If the user does not have 'Work Orders — Create & Edit' enabled, "Build new Work Order" will not be offered anywhere on this tab
* **S6-N2:** If the work order the inspection was run on is closed, only "Build new Work Order" will be offered
* **S6-N3:** If the user chose "Add lines" and the work order has since been closed, the system will explain that and create nothing
* **S6-N4:** If the user does not have 'Work Order Lines — Create & Edit' enabled, no build action will appear on any row
* **S6-N5:** If the organisation does not have ShopCoach, neither menu option is offered on any row and no build action appears on the tab (S2-R0)

**Edge cases**

* **S6-E1:** If the work order the inspection was run on has been deleted, only "Build new Work Order" is offered
* **S6-E2:** If several rows on the same asset need action, each is built separately. There is no bulk build
* **S6-E3:** A user who can fill inspections but cannot create work orders, looking at a row whose work order is closed, has no available action. The row will show a dash with an explanation that creating a work order requires 'Work Orders — Create & Edit'. The explanation must be readable on a phone, where there is no hover

_Note on S6-E3: this is the one case where a row shows work the user cannot start. Excluding such rows from their counts was rejected because it would make the counts differ between viewers. Offering the user a different action, such as flagging the inspection for someone who can act on it, is the better long-term answer and is not in this release._

---

## S7: Record where the lines came from

**As a** user looking at a work order, **I want** to see that its lines came from an inspection and which one, **so that** I can trace the work back to the evidence for it.

**Design:** [Digital Inspections V2 design](https://claude.ai/design/p/0c2be389-b1b1-41f9-8b95-6dba538c69ba?file=Digital+Inspections+V2+-+All+Screens.dc.html)    
**Jira:** [SV-9105](https://shopview.atlassian.net/browse/SV-9105)

**Prerequisites**

* A build has completed (S2)
* Seeing the Audit Log entry additionally requires 'View History Logs' enabled

**Requirements**

* **S7-R1:** A note will be added to the work order the lines landed on, stating that it was built from the inspection
* **S7-R2:** When the lines went onto a new work order, the note will link back to the work order the inspection was run on
* **S7-R3:** The Notes tab count will include the new note immediately
* **S7-R4:** An entry reading "Built from inspection" will be added to that work order's Audit Log
* **S7-R5:** The Audit Log entry will name the inspection, link to it, and name the work order the inspection was run on
* **S7-R6:** Both records will be written however the build was started, from S3, S4 or S6
* **S7-R7:** The Audit Log entry and the note will carry the same three facts: that the work order was built from an inspection, which inspection, and which work order the inspection was run on. Whichever a user opens, they get the same account. Neither may carry a fact the other lacks

**Negative cases**

* **S7-N1:** If the lines went onto the work order the inspection was run on, the note will not link to that work order from itself
* **S7-N2:** If the user does not have 'View History Logs' enabled, the Audit Log is not shown to them. The entry is still recorded

**Edge cases**

* **S7-E1:** If either record cannot be written, the created lines are kept and the build still reports success. The lines are the valuable output
* **S7-E2:** If a user deletes the note, the Audit Log entry remains
* **S7-E3:** If the inspection is later deleted, the Audit Log entry keeps the inspection name as recorded, and the link fails gracefully rather than breaking the Audit Log

**Open question**

* Whether the record should include how many lines were created, so the asset tab could read "3 lines added" rather than "Lines added".

---

## S15: Draft the lines with ShopCoach

**As a** technician, **I want** the lines drafted for me from what I just recorded and handed to me to correct, **so that** I am reviewing finished work rather than filling in a form.

This story owns everything between pressing the build action and the lines existing: what ShopCoach is told, what is shown while it works, and what the user can change before anything is added. S2 owns what happens once they are added.

**Design:** [Digital Inspections V2 design](https://claude.ai/design/p/0c2be389-b1b1-41f9-8b95-6dba538c69ba?file=Digital+Inspections+V2+-+All+Screens.dc.html)    
**Jira:** [SV-9404](https://shopview.atlassian.net/browse/SV-9404)

**Prerequisites**

* The organisation has ShopCoach
* The conditions in S2 are met
* The user has chosen the target work order

**Requirements**

* **S15-R1:** The system will compose the brief it sends to ShopCoach from the inspection itself. For each Monitor and Not OK finding it will include the field label, its section, the measured value and its unit, the verdict, and the technician's note
* **S15-R2:** A per-axle finding will name its axle and its measurement row, so a proposed line can be traced back to the measurement that caused it
* **S15-R3:** The brief will state what ShopCoach may not do: invent a part it was not given, turn a passing finding into a line, or leave a flagged finding unrepresented
* **S15-R4:** The user will never type anything to get lines. There is no prompt, no query box and no configuration step anywhere in this flow
* **S15-R5:** The action that starts the build will read as an AI action before it is pressed, carrying the purple treatment and the AI badge. The label will not name the product
* **S15-R6:** ShopCoach will be named once, at the step where the destination is chosen, and nowhere else in the flow
* **S15-R7:** Drafting will start when the destination is chosen, so the navigation and the drafting happen together rather than one after the other
* **S15-R8:** While the lines are being drafted, the panel will show one skeleton row per finding, because the number of findings is known before the drafted lines are
* **S15-R9:** The work order will stay usable while the drafting runs
* **S15-R10:** Cancelling during the drafting will leave the work order exactly as it was
* **S15-R11:** Proposed lines will arrive selected, so the default is to accept them
* **S15-R12:** Every proposed title, description, labour figure and part will be editable in place before the lines are added
* **S15-R13:** Each proposed line will name the finding it came from
* **S15-R14:** Every flagged finding will be represented by at least one proposed line however many findings there are. If the assistant cannot draft the whole set in one run, the set will be split across runs rather than the surplus being dropped
* **S15-R15:** Nothing will reach the work order until Add Lines is pressed
* **S15-R16:** The proposed-lines panel is shared with the Line Builder that is started from a work order with no inspection. A change made for this flow lands on that one too, and must not degrade it

**Negative cases**

* **S15-N1:** If the organisation does not have ShopCoach, this story does not apply and no build action exists (S2-R0)
* **S15-N2:** A passing finding never becomes a proposed line
* **S15-N3:** No part is proposed that ShopCoach was not given
* **S15-N4:** Deselecting every proposed line leaves Add Lines unavailable rather than adding nothing silently
* **S15-N5:** The written brief a user can type on the Line Builder started from a work order is not removed. S15-R4 removes it from the inspection flow only. It is the only way a service advisor with no inspection to hand gets lines, and that flow is out of scope for this epic

**Edge cases**

* **S15-E1:** If ShopCoach returns no lines at all, the user is told so plainly and the work order is unchanged
* **S15-E2:** If the call to ShopCoach fails, the user is told that it failed. An empty panel is not an acceptable outcome, because there is no non-AI path to fall back to
* **S15-E3:** If the user navigates away while the drafting runs, nothing is added
* **S15-E4:** If a finding's note is empty, the finding is still sent and still represented. An empty note is not a reason to drop it
* **S15-E5:** If the same field is flagged on several axles, each flagged position reaches ShopCoach with its own axle and row so they are not collapsed into one line by accident

_Note on S15-R1: ShopView has no prompt of its own today. The integration is a proxy — the assistant is given a free-text content field and whatever is composed into it is the brief. One assistant accepts that written brief; the other receives only the vehicle and therefore never sees the inspection, so it is not used from this flow. This is why the brief is a ShopView deliverable rather than a setting on the ShopCoach side._

---

## S8: Record measurements per axle

**As a** technician inspecting a heavy truck, **I want** to record brake and tire measurements per tire, **so that** the inspection matches how the vehicle is actually built and a single bad tire is not hidden behind a passing row.

**Design:** [Digital Inspections V2 design](https://claude.ai/design/p/0c2be389-b1b1-41f9-8b95-6dba538c69ba?file=Digital+Inspections+V2+-+All+Screens.dc.html)    
**Jira:** [SV-9106](https://shopview.atlassian.net/browse/SV-9106)

**Prerequisites**

* The template contains a Per axle field
* The author has 'Settings — Service' enabled to add the field
* The technician has 'Work Order Lines — Create & Edit' enabled

**Requirements: authoring**

* **S8-R1:** Per axle will be its own field type, offered alongside Checkbox, Text, Measurement, Photo and Instructions. The Measurement field will no longer carry an axle option
* **S8-R2:** A new per-axle field will be named "New axle set" and pre-filled with four measurement rows: tire pressure, tread depth, brake lining and push-rod travel
* **S8-R3:** Each row will carry a unit set by the author, which is the default the technician starts from rather than a fixed value. Defaults will be PSI for tire pressure and inches for tread depth, brake lining and push-rod travel
* **S8-R4:** Each row will state whether it is measured on the tire or on the brake. Tire pressure and tread depth will default to per tire, brake lining and push-rod travel to per brake
* **S8-R5:** The author will not choose how many values a side needs. A per-tire row follows the axle's Single or Dual setting at fill time; a per-brake row is always one value per side
* **S8-R6:** Rows will be renamed in place, confirmed with a check and dismissed with an X, without a dialog
* **S8-R7:** Rows can be added and removed. The last row cannot be removed
* **S8-R8:** A per-axle field will carry a reference file like any other field, as defined in S11
* **S8-R9:** The template will not hold a number of axles. The technician adds them while filling, because the template cannot know what is on the truck

**Requirements: filling**

* **S8-R10:** Each axle will be set to Single or Dual, and to Drum or Disc. Drum or Disc may be left blank when the axle has no brakes
* **S8-R11:** A per-tire row on a Dual axle will record four values, left outer, left inner, right inner and right outer. On a Single axle it will record two. A per-brake row will always record two
* **S8-R12:** Every value will carry its own verdict, chosen from a menu on the field: OK, Monitor, Not OK or N/A
* **S8-R13:** The value's input will be tinted by its verdict and will stay neutral while nothing is entered
* **S8-R14:** A row's verdict will be derived from its positions, and an axle's from all of its positions. Worst wins: Not OK over Monitor over OK. Neither will be chosen directly
* **S8-R15:** Nothing will be required. An empty value will stay empty and will not be converted to N/A
* **S8-R16:** Values will accept numbers and characters, including the text N/A
* **S8-R17:** Switching an axle between Single and Dual will preserve what was entered, with no warning and no confirmation. Switching to Single keeps the outer readings as the left and right values; switching back restores the inner readings. Preserved values will live for the session only
* **S8-R18:** A diagram of the truck will show every axle and will tint each tire by the worst verdict of the rows measuring it. A tire will stay grey until one of its rows has a verdict
* **S8-R19:** Selecting a tire in the diagram will move to that axle, that row and that tire
* **S8-R20:** The first axle can never be deleted. It will carry a clear action that empties its readings and verdicts and leaves the axle in place
* **S8-R21:** Any axle after the first can be deleted. Axles below a deleted one will move up, and the numbering will follow
* **S8-R22:** Axles can be expanded one at a time or all at once. Opening one will not collapse another
* **S8-R23:** Desktop and phone will be two layouts rather than one layout compressed. The phone will render one card per measurement row and will not scroll sideways
* **S8-R27:** The technician will be able to change a row's unit while filling. The change applies to that row across the whole axle, so every position on it is read in one unit, and it does not touch the other rows or the other axles

**Requirements: output**

* **S8-R24:** The completed read-only view and the report will show each row's values per position, with the row's derived verdict
* **S8-R25:** Counting will be per judged position. The inspection list, the report counters and the field's own summary will report the same numbers
* **S8-R26:** Each flagged row will produce its own finding for the work order, naming the axle and the row, so a line can be traced to the measurement that caused it

**Negative cases**

* **S8-N1:** A per-axle field with no verdict anywhere counts as unanswered and blocks submit when the field is required
* **S8-N2:** If Drum or Disc is left blank, nothing about brake type appears in the report
* **S8-N3:** A position with a value and no verdict is not counted as a finding, and does not block submit

**Edge cases**

* **S8-E1:** An axle with a verdict and no measurements counts as answered. A technician may judge an axle without recording numbers
* **S8-E2:** A value containing the text N/A and a verdict of N/A are different statements, and both survive to the report distinctly. One says the measurement does not apply, the other says the position does not apply
* **S8-E3:** Free text in a value reaches the report as entered, without being converted or dropped
* **S8-E4:** A road train may have seven or more axles. Both the diagram and the phone layout remain usable
* **S8-E5:** Renaming or removing a row after values exist cannot affect a completed inspection, because the inspection keeps the template version it started on
* **S8-E6:** Leaving the page loses any readings preserved by a Single or Dual switch, because they were only ever held for the session
* **S8-E7:** Changing a row's unit does not convert the readings already entered. The technician is recording what the gauge shows, and silently multiplying their numbers would be worse than leaving them

**Open questions**

* Whether measurement rows should change based on the Drum or Disc selection

---

## S11: Attach a reference file to a question

**As a** template author, **I want** to attach the actual procedure to the question the technician is answering, **so that** they have it in front of them instead of being told to go and find it.

**Design:** [Digital Inspections V2 design](https://claude.ai/design/p/0c2be389-b1b1-41f9-8b95-6dba538c69ba?file=Digital+Inspections+V2+-+All+Screens.dc.html)    
**Jira:** [SV-9109](https://shopview.atlassian.net/browse/SV-9109)

**Prerequisites**

* The field is any question type
* Uploading requires 'Settings — Service' enabled
* Opening the file requires 'Work Orders — View' enabled

**Requirements**

* **S11-R1:** Any question type will hold one file attachment
* **S11-R2:** PDF, image, Word and Excel files will be accepted, including HEIC. Video will not be accepted
* **S11-R3:** The author will upload from the field's properties panel, and the accepted file types and the size limit will be stated there before the upload rather than after a file is rejected
* **S11-R4:** The technician will see the attached file while filling and will be able to open it. It will open as a full-page view in the same tab, with a close action and a download action, and will be readable without downloading it
* **S11-R5:** The attached file will be visible on the canvas on the field's row
* **S11-R6:** The upload control will read "Attach File" on every field type
* **S11-R7:** Attached files will be available only within the shop that uploaded them
* **S11-R8:** After a template is republished, instructions in earlier published versions will still open their attachments

**Negative cases**

* **S11-N1:** Video files will be rejected, with a reason shown to the author
* **S11-N2:** A file belonging to another shop cannot be opened
* **S11-N3:** If an attachment is removed from the field, the technician no longer sees it

**Edge cases**

* **S11-E1:** If an upload fails partway, no attachment is recorded and the author is told why. A recorded attachment that points at nothing is the outcome to avoid
* **S11-E2:** Replacing a file records the new attachment. The old file is not removed
* **S11-E3:** An unusually long file name is shortened in the interface rather than breaking the layout
* **S11-E4:** If the stored file is missing while the field still refers to it, opening it fails with a message rather than a broken download

_Note on S11-E2 and S11-R8: attachments are not deleted in this release. The same file is referenced by later template versions, so deleting it would break earlier published versions and the completed inspections under them. This means stored files accumulate, which is an accepted cost for this release._

---

## S12: Template builder authoring

**As a** template author, **I want** a builder that gives me a starting point and stays out of the way, **so that** building a template is not an exercise in patience.

**Design:** [Digital Inspections V2 design](https://claude.ai/design/p/0c2be389-b1b1-41f9-8b95-6dba538c69ba?file=Digital+Inspections+V2+-+All+Screens.dc.html)    
**Jira:** [SV-9110](https://shopview.atlassian.net/browse/SV-9110)

**Prerequisites**

* The author has 'Settings — Service' enabled
* Template authoring is a desktop screen

**Requirements: the first screen**

* **S12-R1:** A brand-new template will show only the choice of starting point: start from a template, or build from scratch. No section heading, field count, section menu, signature option or add-section control
* **S12-R2:** As soon as the author chooses either option, the full builder will appear
* **S12-R3:** The "Require technician signature" option will be available while building, and withheld only on that first empty screen

**Requirements: starting points**

* **S12-R4:** A Brake and Axle starting point will create a drum or disc check together with the per-axle brake and tire measurement set
* **S12-R5:** A PM Service starting point will create a five-section preventive-maintenance outline: fluids and filters, brakes and tires, electrical, chassis and driveline, and diagnostics and finish
* **S12-R7:** A section added after the first will offer field types only, not starting points, because a starting point creates a whole template

**Requirements: the field properties panel**

* **S12-R8:** Measurement rows on a per-axle field will appear as cards. The row name will read as text with a control to rename it, confirmed with a check and dismissed with an X, alongside the unit and whether the row is measured on the tire or on the brake. The defaults will be labelled as defaults, so the author does not read them as the value for a particular truck
* **S12-R9:** A newly added measurement row will open ready to be renamed
* **S12-R10:** The row list will show how many rows there are, and offer a full-width control to add another
* **S12-R11:** Response options will be editable rows with their colours. An "Include Monitor option" control will turn the optional amber response on and off, and will be on by default
* **S12-R12:** An empty response label will show an error on the row itself and will block publishing, while still allowing the author to save a draft
* **S12-R13:** An empty measurement row name will behave the same way, with the error on the row, so the author can see which row is at fault
* **S12-R14:** Validation rules will be explained on demand rather than as permanent text on the panel
* **S12-R15:** The author will be told that response labels are theirs to edit but that the customer report always uses the standard wording, so reports stay comparable

**Requirements: the canvas**

* **S12-R16:** A field row will show its type, a summary line, and its markers, which will wrap rather than being cut off
* **S12-R17:** A checkbox's summary line will list its responses
* **S12-R18:** A per-axle field will list its measurement rows and note that the technician adds axles while filling
* **S12-R19:** An empty section will not offer duplicate ways to add a field, the option to duplicate itself, or the add-section control, until it has content

**Requirements: one text field**

* **S12-R20:** A single Text field will replace the separate short text and long text fields
* **S12-R21:** The Text field will grow as the technician types rather than scrolling within itself
* **S12-R22:** The field type list will offer one text option
* **S12-R23:** Templates built with the previous short text and long text fields will keep working unchanged, with nothing for the author to migrate

**Negative cases**

* **S12-N1:** A starting point cannot be applied twice, or to a template that already has sections, because starting points are offered only on the empty first screen
* **S12-N2:** If a response label is cleared, publishing is blocked until it is corrected

**Edge cases**

* **S12-E1:** If the last section is deleted, the canvas still offers a way to add one back
* **S12-E2:** If a field is deleted while it is selected, the properties panel clears rather than showing a field that no longer exists
* **S12-E3:** A very long field or section name is shortened in the canvas, the outline and the properties panel rather than breaking the layout

---

## S13: Customer-facing inspection report

**As a** user, **I want** a report that states facts and identifies the customer correctly, **so that** it is safe to hand to a customer.

This is the only customer-facing output in this epic.

**Design:** [Digital Inspections V2 design](https://claude.ai/design/p/0c2be389-b1b1-41f9-8b95-6dba538c69ba?file=Digital+Inspections+V2+-+All+Screens.dc.html)    
**Jira:** [SV-9111](https://shopview.atlassian.net/browse/SV-9111)

**Prerequisites**

* The inspection is completed
* A report has been requested

**Requirements: what the report says**

* **S13-R0:** A per-axle field will print each row's values per position, with a status column carrying the row's derived verdict
* **S13-R1:** The report title will read "Inspection results"
* **S13-R2:** The template version will not appear on the report
* **S13-R3:** The introductory paragraph and the three summary blurbs will be removed. They editorialised, and they referred to trucks for assets that are not trucks
* **S13-R4:** The advisor row will be removed
* **S13-R5:** Per-section counts will be removed
* **S13-R6:** The work order number will appear without a leading hash, in both the header and the running header
* **S13-R7:** The inspected date will show without a time
* **S13-R8:** The work order number will include its branch prefix, so S1-2252 rather than S-2252

**Requirements: who the report is addressed to**

* **S13-R9:** The Customer block will show the company on the work order, with its name, address, city, state, postal code and phone
* **S13-R10:** The contact person will appear on a separate Contact row
* **S13-R11:** Any field attributed to a user will show that person's name

**Requirements: what the report must survive**

* **S13-R12:** Regenerating a report will produce a new version rather than replacing the previous one, and every link will resolve to the most recent. Earlier versions remain retrievable as the record of what was sent, so a report already handed to a customer cannot change
* **S13-R13:** Republishing the template will not alter an existing report, and the inspection will keep the template version it ran on

**Negative cases**

* **S13-N1:** If the work order has no company, the Customer block is omitted rather than showing an empty frame
* **S13-N2:** If there is no contact person, the Contact row is omitted

**Edge cases**

* **S13-E1:** A company with a name but no address or phone shows only its name, with no blank lines and no stray punctuation
* **S13-E2:** A very long company name or address wraps or is shortened rather than pushing the layout out of shape
* **S13-E3:** An inspection with no answered fields produces a report with zero counts rather than failing

**Error handling**

* If the report cannot be generated, the user is shown the reason where one is available, rather than a generic failure

---

## S14: Inspection filling on a phone

**As a** technician, **I want** the inspection to be usable on the phone I actually carry, **so that** I am not squinting at a desktop layout in a bay.

Most of this is the phone rendering of behaviour specified above, and this story exists so that work is tracked rather than assumed. Two requirements are genuinely new here: how outstanding work is surfaced, and where selecting it takes the technician.

**Design:** [Digital Inspections V2 design](https://claude.ai/design/p/0c2be389-b1b1-41f9-8b95-6dba538c69ba?file=Digital+Inspections+V2+-+All+Screens.dc.html) (mobile artboards)    
**Jira:** [SV-9397](https://shopview.atlassian.net/browse/SV-9397)

**Prerequisites**

* The stories above are implemented
* The technician has 'Work Order Lines — Create & Edit' enabled

**Requirements**

* **S14-R1:** The per-axle field will render one card per measurement row and will not scroll sideways at any width
* **S14-R2:** Every target a technician taps will be large enough to hit with a gloved thumb, including the unit selector and the Drum, Disc, Single and Dual controls
* **S14-R3:** Value inputs will not zoom the page when they take focus
* **S14-R4:** Moving between axles will happen from a header rather than by scrolling, and the primary action will advance to the next axle
* **S14-R5:** A reference file will open across the full screen, in the same view, and will be closable back to the exact position in the inspection
* **S14-R6:** Outstanding required work will be surfaced on the action that completes the section, carrying a count, rather than as a separate banner competing with the fields
* **S14-R7:** Selecting an outstanding item will move to the first field that still needs an answer, rather than to a summary of what is missing
* **S14-R8:** The layout will not draw its own back control where the device already provides one

**Negative cases**

* **S14-N1:** No screen in the filling flow requires a horizontal scroll to reach a control
* **S14-N2:** No control is placed where the device's own navigation overlaps it

**Edge cases**

* **S14-E1:** A truck with seven axles remains navigable without scrolling through every one
* **S14-E2:** A long field label, a long row name and a long file name each shorten rather than breaking the layout

---

# Open items

| # | Item | Owner |
| --- | --- | --- |
| 1 | Whether historical inspections appear as needing a work order on release, or only ones completed after release. Recommendation is the cut-off (S5) | Fabian |
| 2 | What the build does when the work order the inspection was run on is Declined or Ready for Review (S2) | Fabian |
| 3 | Mobile design for the asset Inspections tab, including how S6-E3 reads without hover | Milos |
| 4 | Exact wording of success and error messages across the stories, which is not yet authored | Milos |
| 5 | Whether the asset Inspections tab should appear in the customer portal (S5) |  |
| 6 | Whether "note required" should be per response rather than one option (S1) |  |
| 7 | Whether photos or measurement values should be carried into the line description (S2) |  |
| 8 | Whether building should be possible from a submitted but not completed inspection (S2) |  |
| 9 | Whether the record should include how many lines were created (S7) |  |
| 10 | What a shop that pays for ShopCoach is offered when the assistant call fails. There is no non-AI fallback left, so the choice is a retry or an empty line per finding (S15-E2) | Fabian |
| 11 | Whether S12-R4's "drum or disc check" on the Brake and Axle starting point is deliberate. It contradicts the Key Decision that Drum or Disc is a fill-time choice on every axle | Milos |
| 12 | Whether renumbering axles on delete is acceptable without a way to reorder or insert one (S8-R21) | Milos |

# Change Log

| Date | Reporter | Change | Notes |
| --- | --- | --- | --- |
| 2026-08-10 | Milos Vasic | First full draft | 13 stories across capture, build, history, authoring and report |
| 2026-08-12 | Milos Vasic | Rewritten to the ShopView spec format | Removed the decisions, gaps, risks and verification registers and the document commentary; permissions restated using the labels users see; requirements numbered S1-R1 for QA reference; added business case, jobs to be done, open items and this change log |
| 2026-08-24 | Milos Vasic | Cross-check follow-ups | Units: the technician changes a row's unit while filling, one row at a time across the axle, and the template value is the default — the earlier Key Decision said author-only, which contradicted S14-R2. Added S8-R27 and S8-E7 for the fill-time change and for not converting readings already entered. New S17 for the photo-required-on-Not-OK rule, which the Key Decisions asserted but no requirement covered, so QA had nothing to test; checkbox fields only. Two items from the cross-check that need a decision rather than an edit were added to Open items as 11 and 12 |
| 2026-08-20 | Milos Vasic | Aligned the work-order hand-off with the design | S2 split: it now covers committing the lines, while drafting, the wait and the review move to the new S15. Navigation now precedes drafting and nothing reaches the work order until Add Lines is pressed, which rewrote S2-R11, R12, R13 and the concurrency edge cases. The deterministic naming requirements (former S2-R1, E2, E3, E5) are gone, because ShopCoach composes the line. New S15 for drafting with ShopCoach, including what it is sent and what happens when the call fails. The Line Builder started from a work order with no inspection is not a story here — it is not an inspection flow — but the two facts that couple it to this work are recorded as S15-R16 and S15-N5, so the shared panel and the existing written-brief field are not broken by accident. Every entry point now states that without ShopCoach no build action appears. Design link added to every story |
| 2026-08-20 | Milos Vasic | Aligned with the agreed design and cut scope | Conditional follow-ups (former S9) and instruction acknowledgement (former S10) removed entirely, with every reference to them cleared from the overview, S11 and S12. S8 rewritten: per axle is its own field type, a verdict is recorded per tire and the row and axle verdicts are derived, units are set by the author, the first axle clears rather than deletes, and Single/Dual preserves readings for the session. S11 widened from instructions to any question type, HEIC accepted, one wording for the upload control. S2 now requires ShopCoach for building lines and states what the assistant is told. S13 prints a status per row. S14 added for phone filling |
