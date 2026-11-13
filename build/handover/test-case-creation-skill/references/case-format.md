# Case format

Every case has four TestRail fields: Title, Preconditions, Steps, Expected Result. Write them exactly like this.

## Title

- Plain words describing what the tester will see. At most 80 characters. No semicolons, no spec shorthand, one check.
- Design cases start with `Design: ` (the 80 characters include the prefix).

## Preconditions

- Short plain bullets, in the order a tester would set things up:
  - `Sign in as …` (role)
  - `Use a …` (location, browser width, device)
  - `Have a …` (each record the case needs, with its state)
- Only what the steps and results need. Every record named here is used in the steps or results; if one is needed for
  another reason, say why ("…, so the work order bills a customer other than its own").
- A record the case changes is created new for this case ("Have a new work order for this test …").
- Shared settings are stated ("Have Internal Work Orders turned on in Settings > Work Orders").
- Two records of the same kind are named plainly ("customer A" and "customer B") and the same names are used in the steps
  and results.
- Example values are written "(for example Caliper)". Never present an example as if it exists in every account.
- Do not add: a scenario line, placeholders in braces, "ask your QA lead", generic lines, or a closing "mark this test
  Blocked" line.

## Steps

- Numbered. One UI action per step, in the product's exact labels.
- A step may say what to look at ("Open the work order and look at its details card").
- A "don't" the test depends on gets its own step ("Do not save the window").
- Leave out steps the tester does not need; never remove a step needed to reach or judge the result.

## Expected Result

```
Step 1:
- <one observable fact>
Step 2:
- <one observable fact>
- <another observable fact>

Exact quotes from the source (for reproducibility)
From: PRD "<name>", Confluence <id>, version <n> (<date>, <author>), read <date> · Epic <key>, story <key> (<story name>)
- <REQ-ID>: “<the source sentence, word for word>”
From: <next document, if another is quoted>
- <REQ-ID>: “<sentence>”
The build is not yet available to check this case against.

References from Design
<design name and link>, version <published version>, read <date>: page "<page>", board "<board>".
Design pictures attached to this case:
- <file name>.png
The design's own words:
- “<design text, word for word>”

AUTOMATION: Not available on Build to test Yet - Last checked M/D/YYYY
```

Rules:

- One `Step N:` block per step, in order. One fact per bullet, written as what the tester sees (text, order, colour,
  position, a count, a value with its arithmetic).
- Where a plain result could ever disagree with its quote, the quote wins and the plain result is corrected.
- Each quoted document has its own `From:` line directly above its own quotes. The epic and story go on the first one.
- Once a build has been checked, the line after the last quote becomes "Last checked against build <marker> on
  <date>."
- Nothing from the design goes in the quotes; it all goes in "References from Design".
- Where a case follows a later decision (for example a product-owner answer) that differs from an earlier source, add
  one sentence after the quotes naming the later decision, where it is recorded and its date.
- Words in square brackets inside a quoted message stand for the value they name; every other word must match exactly.
  If a case uses this, it says so in one sentence.
- The automation line is last (see SKILL.md §5).

## Worked example

**Title:** Design: Cost move window names the moved part and its vendor bill

**Preconditions**
- Sign in as an Admin (a user with every setting, See Financial Data included).
- Use a desktop browser window 1440 pixels wide at 100% zoom.
- Have Internal Work Orders turned on in Settings > Work Orders.
- Use a location that is connected to QuickBooks Online, with every ShopView Accounts row mapped.
- Have a customer flagged as Internal customer, with one asset, and its default internal category left at General
  Internal.
- Have a new internal work order for that customer with every line Complete and one special-order part (for example
  Caliper) whose vendor bill (for example VB-2041) was posted to Cost of Parts while the work order was billable, made
  for this test.
- Open the attached picture at 100% zoom beside the screen.

**Steps**
1. Open the internal work order.
2. Click Close Work Order.

**Expected Result**
```
Step 1:
- The work order opens.
Step 2:
- A window "Close work order [number]?" opens over the Finance tab.
- Above the "Moved from" row the window reads "A vendor bill on this work order was posted to another account. Closing moves that cost."
- The item line names this work order's special-order part and its vendor bill: "[part name] (special order), vendor bill [bill number]" (for example "Caliper (special order), vendor bill VB-2041").

Words in square brackets in a message stand for the value they name; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Internal Work Orders (PRD)", Confluence <id>, version 1.3 (<date>), read <date> · Epic <key>, story <key> (Story 3, Close an internal or no-charge work order)
- S3-R2: “Two cases open a dialog before closing, each only when its case applies: … (2) a vendor bill whose cost moves to another account at Close (S7-R4), at a location with an accounting integration: "Close work order [number]?" with one "Moved from [account] to [account] $[amount]" row per pair of accounts, the amounts added up, and the buttons Cancel and "Close Work Order" …”
The build is not yet available to check this case against.

References from Design
Design canvas "<name>", version <version>, read <date>: page "Flow 1 · Create and close", board "7e Close · vendor bill cost moves".
Design pictures attached to this case:
- <board picture>.png
The design's own words:
- “A vendor bill on this work order was posted to another account. Closing moves that cost.”
- “Caliper (special order), vendor bill VB-2041”
The PRD is silent on these two lines and the design shows them, so the design is the source. "Caliper" and "VB-2041" are the design's example data.

AUTOMATION: Not available on Build to test Yet - Last checked 11/12/2026
```

(The quote is shortened here with "…" only to keep the example readable; in a real case it is copied in full.)

## Final check for every case

"Could a tester who has never seen this feature set up the preconditions, do every step in the UI and decide pass or
fail from what they see, using this case alone?" If not, fix it, or move it to the "not testable by hand" list.
