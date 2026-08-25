# Prompt for Claude Design — ShopCoach line builder, seeded from an inspection

Build mock screens for one flow: a technician finishes a digital inspection, presses
**Build Work Order**, and lands on the work order with the ShopCoach Line Builder
already finished, reviewing lines it proposed.

This is a mock of an existing component, not a new idea. **Do not invent a different
line builder.** Mirror what ships today and change only what this flow adds.

## What already exists (match it)

The ShopCoach Line Builder is a panel that opens inside the work order's Lines tab,
under the lines table. Today it can run with no input and propose interval-based
work; this flow feeds it inspection findings instead.

Panel, top to bottom:

- A purple `AI` badge beside the label `SHOPCOACH LINE BUILDER`, and a close X on the
  far right of the panel header.
- One line of helper text: "Click to edit names, descriptions, labor hours, or parts.
  Add new parts or toggle them on/off."
- A table with a header checkbox and four columns: **Title · Description · Labor ·
  Parts**. One row per proposed line, each with its own checkbox.
- Title, Description and Labor are **editable in place** — click the cell, it becomes
  an input. Labor reads as `1 hr` / `0.5 hrs` / `1.2 hrs`.
- Parts render as green chips, `Engine oil ( 20 ) ✓`, each toggleable on/off, followed
  by a `+ Add` button to add another part.
- A primary **Add Lines** button, centred under the table.

The data behind a row is exactly this — do not add fields to it:

```
{ name, description, estimate, parts: [ { part_name, quantity, part_number?, required? } ] }
```

## What this flow changes

**The technician never sees a prompt box or a chat.** They press Build Work Order on
the inspection and arrive with the work finished. No query field, no "thinking" step
to interact with, no conversation. They arrive reviewing.

**Rows are pre-selected.** Because the run was driven by findings rather than a blank
bay, every proposed line starts checked. The technician unchecks what they disagree
with rather than hunting for what to check.

**Every row can be traced to the finding that caused it.** An inspection produces one
finding per flagged measurement row, named like:

- `Brake & tire set - Axle 2 - Brake lining`
- `Brake & tire set - Axle 1 - Tire pressure`
- `Slack adjuster travel`

Show that origin on the row. Decide where it reads best — under the Title as a small
line, or as a chip — but it must be visible without hovering, and it must not compete
with the Title. A reviewer looking at this later has to be able to answer "why is this
line here".

## Screens to produce

**1 — Completed inspection, before the build.** The inspection summary with its
findings and a primary **Build Work Order** action. Show the counts the way the
inspection already reports them: per judged measurement row, e.g. `1 row Not OK`,
`1 Monitor`. This screen exists only to establish where the flow starts; keep it
light.

**2 — The landing state (the important one).** The work order's Lines tab. The lines
table above is still empty. The ShopCoach panel is open and **already complete**, rows
pre-selected, each traceable to its finding. Use realistic heavy-truck content:

| Title | Description | Labor | Parts |
| --- | --- | --- | --- |
| Replace brake lining, axle 2 | Lining measured 0.22 in., below the 0.25 in. minimum. | 2.5 hrs | Brake shoe kit ( 2 ), Hardware kit ( 1 ) |
| Adjust tire pressure, axle 1 | Left steer at 42 PSI against 100 PSI spec. | 0.3 hrs | — |
| Inspect slack adjuster travel | Travel out of range; confirm chamber and adjuster. | 1 hr | Slack adjuster ( 1 ) |

Note the second row: a line with **no parts**. Show what that cell looks like empty —
today's design only ever shows chips.

**3 — Something to review, not just accept.** Same panel with one row unchecked and
one Description mid-edit (input focused, the focus treatment from the design system).
This is the state that proves the technician is reviewing rather than rubber-stamping.

**4 — The fallback, when ShopCoach is unavailable.** If the assistant fails, times out,
or the organization does not have ShopCoach, lines are still created the way they are
today: one line per finding, named from the field the technician filled, and the
provenance recorded in the line's note so it says what it came from. There is **no
panel** in this state — the lines simply exist in the table. Show the note.

## Constraints

- Desktop first; this is the work order screen. If the panel needs a phone treatment,
  do it after, and say so.
- Use the tokens and controls from the Digital Inspections V2 handoff — same primary,
  same status ramp, same 8px radii, same focus ring. This lands next to that work and
  must not look like a different product.
- Parts chips stay green as they are today. Do not restyle what already works.
- No new nouns. It is a line, a part, a finding. Not a "recommendation", not a "task".

## Out of scope

Do not design the prompt engineering, the loading animation, or an error dialog.
The four states above are the deliverable.
