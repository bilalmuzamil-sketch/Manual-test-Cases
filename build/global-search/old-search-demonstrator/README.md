# The old-search demonstrator — for showing people, not reading

**Live page:** https://claude.ai/artifact/9mJMvNCNggwrDsDb4UYQ7E
**Source:** `old-search.html` in this folder (the whole page, self-contained)
**Built:** 15 September 2026 · private until shared from the page's share menu

## What it is

A **working copy of the old search box**. Type into it and it answers using the old version's own two
rules. It is not a set of canned screenshots and not a recording — anyone can type anything and get a
truthful answer, which is what makes it usable in a meeting where somebody asks *"well what about…?"*

## Two ways in

**Tab 1 · Meeting run-through** — ten numbered steps that build the argument in order: three things
that still work, then the losses, then the noise, ending on the recently-viewed list.

**Tab 2 · Every keyword — 42** — every single thing you can type, **grouped by the part of the app it
comes from**, with that part's navigation path printed under the heading:

| Area | Where it lives | Keywords |
|---|---|---|
| Customers | Customers → open a company | 12 |
| Contacts | Customers → open a company → its Contacts list | 4 |
| Assets | Assets → open a vehicle | 8 |
| Jobs | Work orders → open a job | 5 |
| Vendors | Parts → Vendors → open a supplier | 7 |
| Parts | Parts → Parts catalogue → open a part | 3 |
| Edge cases | nothing to set up | 3 |

**Clicking any keyword opens a briefing panel on the right** telling you, for that keyword alone:

- **what it is** — "the SECOND line of the address"
- **which part of the app it lives in** — as a chip, and the exact path to the field
- **the field that holds it** — the field name as it appears on the record
- **what should come back** — in words, before you look
- 🔴 **what to check before you judge the result** — because if the field is empty on the record, the
  test proves nothing. This is the line that stops a false finding.
- **on the new version today**, where it was measured — dated, and marked *reported as* where it came
  from someone else's testing rather than a measurement

And under the search box, a banner **compares what actually came back against that stated
expectation** and says whether they match. So you are never asked to take the expectation on trust —
the page checks itself in front of the room.

## How to run a meeting with it

Open it and work down the **ten numbered steps on the left**. Each one says, in one line:

1. **what to do** — "Find a customer by its street address"
2. **what to type** — shown as a chip you can click, which fills the box for you
3. **why it mattered** — one sentence of plain reasoning

Click it, and the box fills, the results appear, and the panel states **"This is the expected
result."** Underneath, an amber note says **what the new version does today** — measured by hand on
the QA branch on 15 September, and dated for that reason.

The ten steps are ordered as a demonstration, not alphabetically: three things that still work, then
the losses, then the noise, ending on the recently-viewed list. That order builds the argument.

**The records it searches are shown as cards underneath**, so nobody has to take on trust what data
exists. They are the same eight records the test suite is seeded with.

## Why it was built this way

Three deliberate choices:

- **Every expectation is machine-checked.** `check_presets.py` in this folder runs all 42 declared
  expectations against the rebuilt engine and fails if any disagrees. It is run before every publish:
  a preset that says one thing and does another would be shown in a meeting and contradicted on the
  spot. Current state: **42 checked, 0 mismatches.**
- **It runs the real rules, ported line for line** from `v1_search.py` in
  `build/global-search/v1-capability-evidence/`, which is itself transcribed from the product at
  commit `55767168`. All ten steps were cross-checked against the Python engine before publishing and
  agree exactly.
- **Every row says HOW it matched** — *"its name starts with this"* or *"found inside its details"*.
  That is the teaching bit: the old search had **two** rules, and people assume it had one.
- **The "new version today" lines are only the ones actually measured.** Where a finding came from
  someone else's testing rather than a measurement of mine, it says *"reported as"* instead. A
  demonstrator that overstates by one line is worth nothing in a room with a developer in it.

## Keeping it honest

If the old code is ever revisited, the commit changes and this needs re-deriving — the commit is
printed on the page for exactly that reason. If the new version gets fixed, the amber notes go stale;
they are dated so that is obvious rather than misleading.
