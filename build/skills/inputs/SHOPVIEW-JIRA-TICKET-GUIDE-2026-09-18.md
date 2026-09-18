# ShopView Jira Ticket Writing Guide for Claude

## Purpose

Use this guide when creating or rewriting Jira tickets for ShopView QA.

The goal is **not** to make tickets shorter at the cost of useful information.

The goal is to make tickets:

- Easy for Manual QA to reproduce.
- Easy for Developers to understand and fix.
- Easy for Product to review.
- Technically complete.
- Clear about the exact gap between **Actual** and **Expected** behavior.
- Free from unnecessary speculation, repetition, or over-explanation.

---

# NON-NEGOTIABLE RULES

## 1. NEVER remove or skip technical evidence in the name of simplification

Simplification means improving clarity and structure.

It does **not** mean removing:

- Network errors.
- HTTP response codes.
- Request/response details.
- Permission configuration.
- Role configuration.
- Relevant IDs.
- Environment/build information.
- Spec references.
- Reproduction data.
- Comparison data.
- Known dependencies.
- Relevant backend observations.
- Regression notes.
- Product clarification already received.

If technical information helps a Developer understand or diagnose the issue, **keep it**.

Move technical details into a dedicated section if they make the main reproduction flow harder to read.

Recommended sections:

- `Technical Evidence`
- `Network Observation`
- `Permission Configuration`
- `Spec Reference`
- `Additional QA Finding`

---

## 2. KEEP creating and attaching annotated screenshots

Annotated screenshots are important QA evidence.

Claude must continue to:

- Capture screenshots showing the problem.
- Add arrows, rectangles, highlights, labels, or comparisons when useful.
- Attach the screenshots directly to Jira.
- Place each screenshot **next to the exact step or result it demonstrates**.
- Keep screenshots inline where they naturally support the text.

### DO NOT:

- Remove screenshots while simplifying a ticket.
- Replace Jira-native images with temporary `blob:` URLs.
- Convert embedded Jira media into plain Markdown links if that can break the attachment.
- Move every screenshot to the bottom of the ticket.
- Remove annotations because the written description seems "clear enough."

If editing an existing Jira ticket, **preserve the original native Jira media/ADF image nodes**.

If preserving the image safely is not possible through the editing method being used, **do not overwrite the existing Jira description**. Instead, provide the revised text separately for manual replacement.

---

## 3. One ticket should have one clear primary failure

A ticket should answer this quickly:

> What is broken?

If the ticket contains multiple independent behaviors, split them into separate tickets unless they are clearly one root workflow.

Examples:

### Good
**Global Search fails when combining values from multiple indexed fields of the same record.**

This can include:
- Asset example.
- Work Order example.
- Part example.

These demonstrate the **same search failure**.

### Split into separate tickets
- Part Number clears Description/Category/Vendor.
- Sell Price does not recalculate after Category changes.

These occur in the same modal but are **different failures** and should be tracked separately.

---

# HOW TO SIMPLIFY WITHOUT LOSING INFORMATION

## Step 1: Identify the core user-visible failure

Before writing, reduce the issue mentally to one sentence.

Examples:

- "The Receive button remains visible after the PO is fully received."
- "A Technician sees an action that the backend rejects with 403."
- "Global Search finds each field separately but fails when the fields are combined."
- "A permission is enabled, but the user still receives 403."
- "A value remains visible even though See Financial Data is OFF."

That sentence should drive the **Title**, **Description**, **Actual Result**, and **Expected Result**.

---

## Step 2: Write a direct title

Preferred pattern:

**[Area] + [action/condition] + [failure]**

Examples:

- `Global Search Fails When Searching Across Multiple Fields of the Same Record`
- `Receive Button Remains Visible After All Purchase Order Parts Are Fully Received`
- `Work Orders → View Does Not Allow Editing Notes Created by Other Users`
- `Technician Receives 403 When Completing a Work Order Line Through Set Line Status`
- `Parts → Vendors Throws 403 Unless Reports Permission Is Also Enabled`

Avoid vague titles such as:

- "Search issue"
- "Permissions bug"
- "Something wrong with Parts"
- "Need clarification"

---

## Step 3: Keep the Description short

The Description should normally explain:

1. What the user is trying to do.
2. What goes wrong.
3. Why the behavior is inconsistent, if relevant.

Do not turn the Description into the whole investigation.

### Good example

> Global Search can find a record when searching by one indexed field, but the same record disappears when values from two indexed fields of that record are combined. The same behavior is reproducible with Assets, Work Orders, and Parts.

That is enough for the opening.

Technical proof belongs later.

---

## Step 4: Make STRs executable by Manual QA

Steps should be:

- Front-end first.
- In order.
- Specific.
- Reproducible.
- Free from unnecessary explanation.

Use real test data where it improves reproducibility.

### Good

1. Open Work Order `S9160-17671`.
2. Open Global Search with `Ctrl + K`.
3. Search `S9160-17671`.
4. Confirm the Work Order appears.
5. Search `S9160-17671 Fibridge`.
6. Observe the result.

### Avoid

> Go to the page and use the search in different ways to prove contextual/index behavior.

---

## Step 5: Make Actual Result observable

Write only what QA can prove.

### Good

> The Work Order is returned for `S9160-17671`, but disappears when searching `S9160-17671 Fibridge`.

### Avoid speculative root cause

> The backend is matching each token against only one Elasticsearch field and fails to merge the token vectors.

Unless this has been confirmed by Developer evidence, do not write it as fact.

Put confirmed technical facts under `Technical Evidence`.

---

## Step 6: Make Expected Result authentic

Expected behavior must come from one of these:

1. Product specification.
2. Product Owner clarification.
3. Existing Production behavior when Production is the accepted source of truth.
4. Explicit permission definition.
5. Established application behavior.

Do not invent expected behavior from intuition when the spec is ambiguous.

### Example: contextual ranking

If the PRD says:

- Existing WO part gets `-0.10`.
- Same-category part gets `+0.05`.

Do **not** write:

> The existing part must always be below every other part.

That is stronger than the spec.

Write:

> The current Work Order context should influence ranking. Parts already on the Work Order should receive the documented negative contextual adjustment, while eligible same-category parts should receive the documented positive adjustment.

Then add the visible QA expectation:

> The search should not produce an identical ranking from the Work Order page and an unrelated page when these contextual conditions apply.

---

# STANDARD JIRA FORMAT

Use this structure unless the issue needs something extra.

```md
## Title
[Clear title]

## Description
[2-4 sentences describing the problem.]

## Role / Permission Configuration
[Only when relevant.]

## Steps to Reproduce
1. ...
2. ...
3. ...

[INLINE ANNOTATED SCREENSHOT HERE if it supports these steps]

## Actual Result
[What actually happens.]

[INLINE ANNOTATED SCREENSHOT HERE if it shows the failure]

## Expected Result
[Exact expected behavior, based on spec/product confirmation.]

## Technical Evidence
[Keep HTTP status, request IDs, network responses, console errors, backend observations, etc.]

## Spec Reference
[Only when relevant.]

## Environment
[QA branch / Staging / Production / build / role / test data.]
```

Not every ticket needs every section.

---

# SCREENSHOT PLACEMENT RULES

Screenshots should stay **between the text they explain**.

Example:

```md
### Example 1 - Asset

1. Search `2019`.
2. Search `Freightliner`.
3. Search `2019 Freightliner`.
4. Observe Assets = 0.

[ANNOTATED ASSET SCREENSHOT HERE]

### Example 2 - Work Order

1. Search `S9160-17671`.
2. Search `S9160-17671 Fibridge`.
3. Observe the Work Order disappears.

[ANNOTATED WORK ORDER SCREENSHOT HERE]
```

Do not put all screenshots at the bottom unless there is a specific reason.

---

# PERMISSION TICKET RULES

For permission bugs, always include the exact permission state.

Example:

```md
## Permission Configuration

- Vendor & Order Management → View = ON
- Vendor & Order Management → Create & Edit = ON
- Vendor & Order Management → Delete = ON
- See Financial Data = ON
- View and Manage AP/AR Data = OFF
```

Then explain the dependency clearly.

### Good

> Vendor creation fails while View and Manage AP/AR Data is OFF, despite Vendor & Order Management → Create & Edit being enabled.

### If the spec is unclear

Do not call it definitely a bug.

Use:

**Expected Result / Product Clarification Needed**

Then show the two valid possibilities:

- If permission A is sufficient, the action should work.
- If permission B is intentionally required, the dependency must be documented and the UI should guide the user.

---

# 403 ERROR TICKETS

When an action is visible but backend rejects it:

### Structure

**Actual**
- UI shows the action.
- User clicks it.
- Backend returns 403.

**Expected**
Either:
- Action should work because permission allows it.

OR:
- Action should not be shown if the user is not authorized.

This makes the frontend/backend mismatch obvious.

Example:

> Technician can see `Receive`, but clicking it returns 403. If Technician is not authorized to receive, the Receive action should not be visible.

---

# REGRESSION TICKETS

If behavior worked before and fails after deployment/migration, say so.

Include:

- When it started.
- Environment.
- Whether Production behaves differently.
- Whether issue is intermittent.

Example:

```md
## Regression Note

The issue started immediately after the latest Staging deployment.

Production shows similar behavior occasionally, but the failure occurs significantly more frequently on Staging.
```

Do not claim the deployment caused the bug unless confirmed.

Use:

> "Started occurring after deployment"

rather than:

> "Deployment broke this."

---

# DATA / MIGRATION TICKETS

Separate:

- Existing data state.
- Migration expectation.
- Post-migration result.

Example:

```md
Before migration:
- User A Time Clock = ON
- User B Time Clock = OFF

Expected after migration:
- User A remains ON
- User B remains OFF

Role assignment must not modify the Staff record Time Clock value.
```

---

# SEARCH TICKET EXAMPLE — SIMPLIFIED BUT TECHNICALLY COMPLETE

## Title

Global Search Fails When Searching Across Multiple Fields of the Same Record

## Description

Global Search can find a record when searching by one indexed field, but the same record disappears when values from two different indexed fields of that record are combined.

The same behavior is reproducible with Assets, Work Orders, and Parts.

## Steps to Reproduce

### Example 1 - Asset

1. Open Global Search (`Ctrl + K`).
2. Search `2019`.
3. Confirm matching Assets appear.
4. Search `Freightliner`.
5. Confirm matching Assets appear.
6. Search `2019 Freightliner`.

**Actual:** Expected Asset is no longer returned.

[KEEP / ATTACH ANNOTATED ASSET SCREENSHOT HERE]

### Example 2 - Work Order

1. Search `S9160-17671`.
2. Confirm the Work Order appears.
3. Search `S9160-17671 Fibridge`.

**Actual:** The same Work Order disappears.

[KEEP / ATTACH ANNOTATED WORK ORDER SCREENSHOT HERE]

### Example 3 - Part

1. Search `ZZT-FIB-1001`.
2. Confirm the Part appears.
3. Search `Brake Shoe ZZT-FIB-1001`.

**Actual:** The same Part disappears.

[KEEP / ATTACH ANNOTATED PART SCREENSHOT HERE]

## Actual Result

Records can be found using indexed values separately, but disappear when matching values from different indexed fields are combined.

| Record | Individual search | Combined search |
|---|---|---|
| Asset | `2019`, `Freightliner` | `2019 Freightliner` fails |
| Work Order | `S9160-17671`, `Fibridge` | `S9160-17671 Fibridge` fails |
| Part | `Brake Shoe`, `ZZT-FIB-1001` | `Brake Shoe ZZT-FIB-1001` fails |

## Expected Result

Global Search should return a record when the query contains matching values from multiple indexed fields of that same record.

Examples:

- Year + Make
- WO Number + Customer
- Part Description + Part Number

## Technical / Product Evidence

The Global Search PRD defines these values as indexed fields for their respective record types.

Product has already confirmed that Asset search using Year + Make together should work.

## Environment

QA branch `sv9160`

---

# WHAT NOT TO DO

## Do not over-explain obvious points

Bad:

> This is worth fixing because a user at the counter might be holding paperwork and psychologically expects the system to behave like...

Better:

> Combining additional valid search terms causes an existing result to disappear.

---

## Do not repeat Actual Result in three different sections

State it once clearly.

Use examples only where they add evidence.

---

## Do not turn a QA ticket into a technical design document

QA should prove:

- The state.
- The action.
- The failure.
- The expected behavior.
- The evidence.

Developers determine implementation unless technical root cause is already confirmed.

---

## Do not remove useful technical information

If a Network response says:

```json
{
  "status": "ValidationError",
  "message": "Vehicle not found",
  "messageCode": "assistant.validation_error"
}
```

KEEP IT.

Place it under:

```md
## Technical Evidence
```

Do not remove it because "manual QA does not need backend information."

Manual QA evidence can still be extremely useful to Developers.

---

# FINAL SELF-CHECK BEFORE CREATING OR EDITING A JIRA TICKET

Claude should verify all of the following:

- [ ] Can a Manual QA reproduce this from the STRs alone?
- [ ] Is the core failure obvious within 10 seconds of reading?
- [ ] Is Actual Result factual and observable?
- [ ] Is Expected Result based on the spec or confirmed product behavior?
- [ ] Did I avoid unsupported root-cause assumptions?
- [ ] Did I preserve every relevant technical detail?
- [ ] Did I preserve role and permission configuration?
- [ ] Did I preserve environment/build/test data?
- [ ] Did I preserve regression/migration context?
- [ ] Did I create/keep annotated screenshots?
- [ ] Are screenshots inline beside the behavior they prove?
- [ ] If editing an existing Jira ticket, did I preserve Jira-native image nodes safely?
- [ ] Did I avoid turning embedded Jira images into temporary `blob:` URLs?
- [ ] If image preservation is uncertain, did I stop and provide revised text separately instead of overwriting the ticket?
- [ ] Is this one primary bug rather than several unrelated issues?
- [ ] Did I keep the ticket concise wherever possible without sacrificing evidence?

---

# Core Principle

> **Simplify the explanation, not the evidence.**

A strong ShopView Jira ticket should be easy to read **and** technically complete.

Keep the evidence.
Keep the annotated screenshots.
Keep the exact permissions and environment.
Keep anything that helps reproduce or diagnose the issue.

Remove only:

- repetition,
- unnecessary prose,
- unsupported assumptions,
- overly technical speculation,
- and information that does not help reproduce, understand, or fix the problem.
