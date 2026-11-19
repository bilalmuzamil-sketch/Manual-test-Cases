# Knowledge cards (Rule 127)

One card = one durable fact, recipe, tool or trap, small enough to read whole. Each has `title`, `keywords`, `learned`,
`evidence` (committed paths). **Step 0 of every task:** `python3 build/testing-tools/lessons.py "<the task in your own words>"`
and read every hit. **Last step of every task:** anything you had to discover becomes a card
(`lessons.py --new "<title>" --keywords "a,b,c"`), every mistake becomes an M-entry in `build/rules/MISTAKES-AND-CHECKS.md`
plus its line in CLAUDE.md §1B. `lessons.py --check` must say OK before the commit.
