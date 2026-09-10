# Execution pass — Inline Add and Edit Parts (6597) — started 2026-09-09

**Order (QA lead, 2026-09-09):** execute the suite on the QA branch; defects created ONE AT A TIME with
his approval between each; passes marked Passed with a line break then a note that it was tested on the
QA branch and will be retested on Staging; every Story Defect linked to its story in epic SV-9315.
Failures: create the defect first (approved), then mark the test Failed, put the defect key in the
result and add a tracking note for the retest.

## Environment established

| Fact | Value |
|---|---|
| Branch | `https://sv9315.qa.shopview.com` (API `sv9315api.qa.shopview.com`) |
| **Build marker** | **`v26.36.0-f43b2fd`** — MOVED since the 2026-09-08 pass (`v26.35.9-7f2e4fa`) |
| Login | DEV MODE quick-login → Admin, via `build/testing-tools/qa-branch-boot.mjs` |
| Identity | `template_slug=administrator`, 42 fe_permissions |
| **View mode** | **`tech`** — with `seeFinancialData: true`, `seeApArData: true`, `viewHistoryLogs: true` |
| Test work order | `b90d6e97-3f47-4745-8cc6-73765802d6ab` — an **Estimate** (editable), 3 lines |
| Route | Work Orders → open the WO → **Lines** tab → expand a line → **`+ Add Part`** (`button_add_part`) |

## Suite state (live from TestRail)

127 cases under group 6597 = **123 ours** + **4 Vladimir Tomovic's (hands-off, Rule 38)**:
C45220, C45268, C53474, C53475. Run **R418** holds **124** tests (123 ours + C45220).
**C45268, C53474, C53475 are NOT in the run** — Vladimir's, so not ours to add.
Run at start of pass: 113 Untested · 10 Blocked · 1 Passed (C45220, Vladimir's).

## 🛑 Proved blocker — Full View is not reachable from this branch's logins

`GET /api/quick-login/users` returns **exactly two** users: `admin` ("Main admin user") and `tech`
("Technician user"). The **admin** user itself reports `view_mode: "tech"`. There is no Full View
quick-login, and the 2026-09-08 session already established that the role editor's Save is disabled
here, so the View mode cannot be flipped from inside the app.

**What it blocks:** the Full View cases only — *Full View Inline Add* (30) and *Full View Edit* (6),
plus the view-mode-specific Bin Allocation case C45232 and C53477.
**What it does NOT block (Rule 68):** *Tech View Inline Add* (25) · *Tech View Inline Edit* (13) ·
*Add Part Button and Edit Control* (16) · *Unsaved Data Protection* (15) · most of *Bin Allocation* (22).

## First observations on v26.36.0-f43b2fd (Tech View) — recorded, not yet written to the run

| Case | Observed | Reading |
|---|---|---|
| C44988 | `+ Add Part` present on each expanded line's Parts area — three buttons for three lines, `data-test-id="button_add_part"` | tracking to PASS |
| C44989 | Clicking it opens the inline row and focus lands in `input_inline_part_description` | tracking to PASS (the "above existing parts" clause still to confirm) |
| C44990 / C44998 | Tech View row carries exactly **Description · Part number · Qty** and no pricing field | tracking to PASS |
| C44991 | `button_edit_part_<uuid>` exists per part at `opacity: 0` — i.e. revealed on hover | tracking to PASS (hover + keyboard-focus reveal still to confirm) |
| C45003 | Row shows **Save** and **Cancel** | **PASS** — the case already states the close action "in Tech View it is labelled 'Cancel'". Checked the wording before calling it a divergence |

**Nothing has been written to TestRail or Jira in this pass yet.**

## Re-stamp note

Cases carry `Last checked against build v26.35.9-7f2e4fa on 9/8/2026`. The branch is now
`v26.36.0-f43b2fd`, so every case verified in this pass gets its Sentence 2 re-stamped to the new
marker and today's date (CLAUDE.md §5, mandatory since 2026-09-08).

---

# 2026-09-10 — Tech View execution (session resumed)

Signed in through the **Technician quick login** (`qa-branch-boot.mjs sv9315 <route> tech`), which
lands `view_mode: tech`, `seeFinancialData: false`, 6 fe_permissions, role **Technician**. Probe 41
established that the Technician role **already** carries Work order lines → **Create & Edit ON** (it
is a `.q-checkbox`, not a toggle — the first scan missed it), so **no role edit was needed** to reach
the Tech View inline row.

## Passes written to [R418](https://shopview.testrail.io/index.php?/runs/view/418) this session

| Section | C-ids |
|---|---|
| Tech View Inline Add | C44998 C44999 C45000 C45002 C45003 C45004 C45005 C45006 C45008 C45009 C45010 C45011 C45012 C45013 C45014 C45015 C45016 C45017 C45018 C45019 C45020 |
| Tech View Inline Edit | C45023 C45024 C45025 C45026 C45027 C45029 C45030 C45031 C45033 C45034 |
| Unsaved Data Protection | C45069 |

Every comment opens with the required line *"It was tested on the QA branch and needs to be retested
on Staging by Viktoria."* followed by a layman explanation of what was checked and what happened.

## Observations worth keeping

- **The keyboard hint legend differs between the two rows, correctly.** Add row:
  `Enter save & next row · Tab next field · Esc cancel`. Edit row: `Enter save · Tab next field ·
  Esc cancel`. The legend renders as separate `<kbd>`-style chips, so a `body.innerText` regex
  returns bare `Enter`/`Tab`/`Esc` with no surrounding words — **read it from the screenshot, not
  from `innerText`**. Evidence: `evidence/50-a-addhint.png`, `evidence/50-b-edithint.png`.
- **The typeahead endpoint is
  `GET /api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts`**
  on the **API host** (`sv9315api.qa.shopview.com`), not the app origin — an in-page `fetch` of a
  relative `/api/...` path returns the SPA's `index.html`. Each row carries `part_type`
  (`inventory_part` vs catalogue), `cost`, `sell_price` and **`binLocations`**.
- **`page.evaluate` takes exactly one argument.** Three probes died on `evaluate(fn, a, b)`; wrap
  the arguments in an object.

## Still to do in this suite

| Block | C-ids | What it needs |
|---|---|---|
| Tech View Inline Add | C45001 C45007 C45021 C45022 C45028 C45032 C45035 | a pure catalogue part (not `inventory_part`), a Full View cross-check, the two save-failure paths, and a role with Create & Edit OFF |
| Unsaved Data Protection | C45070–C45083 | probe 48 rerun (it died on the `evaluate` bug after C45069) |
| Bin Allocation | C45221–C45243 | the bin data state — playbook §S records `S31S-950` (four bins), `TP-12-1013-CH` (already negative) and `6050-P` (no prices) as present on **this** branch |
| Full View remainder | C45039 C45058 C45060 C45061 C45062 C45066 C53477 | catalogue vs inventory parts, the two failure paths, and two role variants (Create & Edit OFF; Full View without See Financial Data) |
| Section 1 | C45251–C45254 | a completed line with a **picked** part, and a special-order part |

---

# 2026-09-10 — second half: the harder cases

## A mistake, caught before it did any damage

Probe 61 was written to set the **Technician** role to three shapes in turn (Full View, Full View
without Create & Edit, Tech view without Create & Edit) so the four role-variant cases could run. It
indexed into `document.querySelectorAll('.q-checkbox')` — a **checkbox-only** list — against a control
map (probe 52) built from a **combined** `.q-checkbox,.q-toggle` list. Index 7 in the combined list is
*Work order lines → Create & Edit*; index 7 in a checkbox-only list is **Schedule → Delete**. The
probe was killed on its first log line, before any of its four observation legs ran.

**Probe 68 then read the role back against the exact vector recorded before any edit and found it
UNCHANGED** — checkboxes `[1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0]`, toggles `[0,1,0,0,0,0,0,0,0,0,0]`, View
mode **Tech view** — with the Save button *disabled* because there was nothing to save. Nothing needed
repairing. The Admin staff's Admin role was never involved at any point.

Two things follow:
1. **Target a permission control by its ROW TEXT, never by an index into a filtered list.** An index is
   only valid against the list it was measured on, and nothing warns you when it is not.
2. **The role save did not reach the server** — the same non-persisting behaviour the QA lead described
   for the "Move labor" toggle. Probe 69 settles whether *any* role change persists on this branch
   before the four role-variant cases are attempted again.

## 🛑 `part_type` IS A PROPERTY OF THE QUERY, NOT OF THE PART — corrected 2026-09-10 03:59

`GET /api/work-orders/part/request/inventory-parts-as-options-with-remaining-catalogue-parts` returns a
`part_type` of `inventory_part` or `special_part`, and **the same part number comes back as either one
depending on what you searched for**. Measured, on this branch, minutes apart:

| Part | in a broad `search=OIL` | in `search=<its own part number>` |
|---|---|---|
| **POI5935C** | `special_part`, `binLocations` **empty** | **`inventory_part`**, `binLocations` length **1**, cost 899, sell 1474 |
| **POI53129C** | `special_part`, empty | **`inventory_part`**, 1 bin |
| **866850C** | `special_part`, empty | **`inventory_part`**, 1 bin |
| **51372MP** | `special_part`, empty | **`inventory_part`**, 1 bin, qty 2.00 |

**So `part_type` cannot be used to tell a catalogue part from an inventory part**, and an earlier note
here that said it could was wrong. The bin data is also present-or-absent by query, which is why
51372MP's card reads *"Inventory Qty: 2 EA Unassigned 2"* while a broad search reports it as having no
bins at all. **Read the card, and confirm any payload fact with a second, differently-shaped query.**

The pure catalogue parts — the ones with no inventory record at all — are reachable through
`GET /api/parts-catalogue/catalogue-parts-that-are-not-on-location` (playbook: 19,496 of them). That is
the list C45001 clause 1 and C45039 clause 1 need.

## Open at this point

| Block | C-ids | State |
|---|---|---|
| Role variants | C53477 C45066 C45032 C44995 | waiting on probe 69's answer about whether a role save persists here |
| Save failure | C45022 C45062 | probe 56 saw **no toast and the row closed** where the case requires a toast and the row kept open; probe 62 re-runs it with abort, a 500 and a control |
| Non-editable status | C45021 C45035 C45061 | probe 58, using `POST /api/work-orders/change-status` on a spare work order |
| Pricing | C45252 C45253 C45254 | probe 67 — and the first run suggests the sell price **does** recalculate on a category change (63.32 → 94.98), which is the opposite of the expect-fail note in C45253 |
| Bin allocation | C45221–C45243 | probe 66 |
| Complete line | C45250 C45251 | probe 65, via the recorded pick + line-status recipes |
| C45001 clause 1 | C45001 | the description is read-only for the `special_part` parts tried so far, not only for inventory parts |

## ✅ The catalogue parts found, and what they settle (2026-09-10 04:05)

`GET /api/parts-catalogue/catalogue-parts-that-are-not-on-location` returns **19,510** parts with no
inventory record, and they DO appear in the inline typeahead — their card carries the literal word
**"Catalog"** where a stocked part's card reads *"Inventory Qty: N ea &lt;bin&gt; N"*. That word is how a
tester tells the two apart on screen.

Four of them were tried (**F40010212**, **3711355C93**, **170.V8AP**, **ZHNM8BC-20**) and all four
behave identically:

| Field | Catalog part | Inventory part |
|---|---|---|
| Description | **editable** — accepted an overwrite | **read-only** |
| Cost | **editable** — accepted 13.13 | **read-only** |
| Sell price | **editable** — accepted 26.26 | **editable** |

That settles **C45001 clauses 1 and 2** and **C45039 clauses 1 and 2**, each on multiple parts in both
directions. It also means **C45252** ("entering the Cost fills in the Sell price") is testable: a
Catalog part is the one whose Cost can actually be typed.

⚠️ **The census is three types, not two** — `inventory_part` 617 · `special_part` 46 ·
`catalogue_part` 617 in one sweep. Every probe before this one lumped the last two together and only
ever picked a `special_part`, whose cost is locked, so "a catalogue part's cost cannot be overwritten"
looked true for an hour and was not.

## ⚠️ Probe 65's C45250 legs are INVALID — do not read them as evidence

Probe 65 logs `C45250 clause 1 — after the line went Complete: {"addPart":2,"addPartVisible":2,
"statuses":["Approved","Approved"]}`. **The line never went Complete.** The
`lines/change-status` call immediately above it was refused with *"Line can`t be completed with
unfulfilled part requests."*, and the probe carried on regardless — so what it recorded is Add Part
being available on an **Approved** line, which proves nothing about C45250 and would have read as a
pass. The statuses it captured say "Approved" twice, which is the giveaway.

Two lessons, both now in the probes:
- **A probe must stop when its precondition fails.** Probe 78 checks the status code of the
  line-completion call and only runs the observation legs if it succeeded.
- **Capture the state you claim to have created.** Recording the line's status alongside the
  observation is what made this catchable at all.

Probe 78 supersedes it: it takes the part-request ids off the line objects (the reason probe 65 had
none to pick — `/api/work-orders/part/list-requests` ignores every filter and returns the first 100
rows estate-wide, playbook §S), picks them, completes the line, and gates the rest on that working.
