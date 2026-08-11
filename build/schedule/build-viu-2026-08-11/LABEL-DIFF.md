# Schedule — staged label / navigation change list, 2026-08-11

**Build: `v3.5-65d6500`** (last-mod Tue 11 Aug 2026 09:33:33 GMT, etag `3250d285ffcf50626363a578fe273071`,
`index.html` sha256 `9348ca09…` — identical at pass start 13:16:21Z and pass end).
**Location: `Staging Heavy Duty - 9919`**, confirmed **on screen** in the top-bar selector before any
observation was taken (`evidence/schedule-page.png`).
**Surfaces harvested: 15.** **Distinct build strings captured: 909.**

**ZERO TestRail writes. `get_*` only.** Every row below is decision-ready and pushable as-is by an
authorised pass once the sibling's Schedule write pass clears.

**Scope reminder: these are LABEL and NAVIGATION corrections only.** Not one expectation is changed.
Where the build differs from what the documents require, the case keeps the documented expectation
(Rule 57).

---

## 1 · THE TWO INTERNAL CLASHES ARE SETTLED — and the method matters, because pixels lie

Our suite contradicted **itself** on two labels. Both are now settled from the **raw text nodes**, and
that distinction is the whole finding:

> **`textContent` (raw markup) is immune to CSS `text-transform`; `innerText` is not.** The Schedule
> toolbar panels are **styled uppercase**, so reading the screen — or an `innerText` dump — returns
> `FILTER & DISPLAY` and `VIEW OPTIONS`. The **raw text nodes read `Filter & display` and
> `View options`.** Screenshot evidence alone would have produced a wrong answer here, in both cases.

| Clash | Our suite said | **The build ships** | Verdict |
|---|---|---|---|
| **1** | `Filter & Display` (C30042) **vs** `Filter and Display` (5 cases) | **`Filter & display`** — ampersand, lower-case `d` | **Both sides are wrong, but C30042 is much closer.** The ampersand is right; the capital `D` is not. |
| **2** | `VIN` (C30042) **vs** `VIN Number` (C30034, C30045) | **`VIN Number`** | **`VIN Number` is right.** C30042's `VIN` is the defect. |

**⚠️ A TRAP IN OUR OWN METHOD, WORTH RECORDING: the `Filter and Display` form MATCHES AN INVISIBLE
`aria-label`.** The toolbar button carries `aria-label="Filter and display options"`, present on all
15 surfaces, so a naive containment check marks those 5 cases "found in the build" — **and they are,
but only in a string no manual tester can ever see.** The visible label is `Filter & display`.
**A label diff must prefer the visible string over the accessible name, or it will certify the wrong
wording.**

---

## 2 · THE STAGED CHANGES — 12 distinct cases

Per row: the exact current wording, the exact build wording, and the precise field to edit.

### 2.1 Casing only — `View options`

| Internal | C-id | Link | Field | Current | **Build** |
|---|---|---|---|---|---|
| SCH-VIEW-05 | C30046 | [link](https://shopview.testrail.io/index.php?/cases/view/30046) | `title`, `custom_steps` | `'View Options'` | **`View options`** |
| SCH-VIEW-06 | C30047 | [link](https://shopview.testrail.io/index.php?/cases/view/30047) | `custom_steps` | `'View Options'` | **`View options`** |
| SCH-VIEW-09 | C30050 | [link](https://shopview.testrail.io/index.php?/cases/view/30050) | `custom_steps` | `'View Options'` | **`View options`** |
| SCH-VIEW-10 | C30051 | [link](https://shopview.testrail.io/index.php?/cases/view/30051) | `custom_steps` | `'View Options'` | **`View options`** |

### 2.2 `Filter & display` — the visible toolbar label

| C-id | Link | Field | Current | **Build** |
|---|---|---|---|---|
| C30042 | [link](https://shopview.testrail.io/index.php?/cases/view/30042) | `title`, `custom_steps` | `'Filter & Display'` | **`Filter & display`** |
| C29930 | [link](https://shopview.testrail.io/index.php?/cases/view/29930) | `custom_expected` | `the 'Filter and Display' dropdown` | **`Filter & display`** |
| C30043 | [link](https://shopview.testrail.io/index.php?/cases/view/30043) | `custom_steps` | `In 'Filter and Display', turn OFF one department's toggle.` | **`Filter & display`** |
| C30044 | [link](https://shopview.testrail.io/index.php?/cases/view/30044) | `custom_steps` | `In 'Filter and Display', turn ON 'My Shifts'.` | **`Filter & display`** |
| C30045 | [link](https://shopview.testrail.io/index.php?/cases/view/30045) | `custom_steps` | `Turn 'VIN Number' ON in 'Filter and Display'.` | **`Filter & display`** |
| C30082 | [link](https://shopview.testrail.io/index.php?/cases/view/30082) | `custom_steps` | `Check 'My Shifts' in 'Filter and Display' is OFF (default).` | **`Filter & display`** |

**Note on C30008:** an earlier extraction attributed `Filter and Display` to it. **A live re-read does
not reproduce that** — the string is not in its current text. **No change staged; the earlier
attribution was wrong.**

### 2.3 The `View options` toggle labels — three of six are wrong, and all six DEFAULTS are right

C30046 enumerates the menu. Observed live (`evidence/surface-03-view-options-menu.png`):

| Our case says | **Build ships** | Default asserted | Default observed |
|---|---|---|---|
| `Business Hours` | **`Business Hours`** ✓ | OFF | **OFF** ✓ |
| **`Capacity Bars`** | **`Capacity Planning`** ✗ | ON | **ON** ✓ |
| `Events` | **`Events`** ✓ | ON | **ON** ✓ |
| `Tech Hours` | **`Tech Hours`** ✓ | OFF | **OFF** ✓ |
| **`Saturday`** | **`Show Saturday`** ✗ | ON | **ON** ✓ |
| **`Sunday`** | **`Show Sunday`** ✗ | ON | **ON** ✓ |

**"Six toggles" is correct, and every one of the six default states is correct.** Only three labels
need changing — in **C30046** (`title`, `custom_steps`, `custom_expected`) and, for the weekend pair,
**C30051** (`custom_steps`, `custom_expected`).

**Worth crediting the earlier pass:** `Tech Hours` defaulting **OFF** is confirmed, which is the half
of [SV-8827](https://shopview.atlassian.net/browse/SV-8827) our records already flagged as wrong in
the ticket.

### 2.4 `VIN` → `VIN Number` in C30042

| C-id | Field | Current | **Build** |
|---|---|---|---|
| C30042 | `title`, `custom_expected` ×2 | `'My Shifts', and 'VIN'` · `'My Shifts' OFF, 'VIN' OFF` | **`VIN Number`** |

**Everything else in C30042 is right:** the dropdown is checkbox style, carries a toggle per department
(`Service`, `Work order status`, `Service/Parts` — all three ON), `My Shifts` OFF, `VIN Number` OFF.

### 2.5 🔴 `working hours` → `business hours` — the conflict reason wording, C30025

**The highest-value row here, because a tester would search the screen for a phrase that is not on it.**

Observed live in the **`Schedule issues`** panel (`evidence/surface-05-conflicts.png`), verbatim:

- `Starts before business hours (7:00 AM) · Double-booked with Xamont Holdings`
- `Extends past business hours (3:00 PM) · Double-booked with Kastone Solutions`
- `Double-booked with Goport Energy`

**C30025** ([link](https://shopview.testrail.io/index.php?/cases/view/30025)) says, in
`custom_expected`: *"a reason sentence in the spirit of **'Starts before working hours'**"* and *"in the
spirit of **'Extends past working hours'**"*.

**In fairness to the case, it is hedged — "in the spirit of" is deliberate scope-conditional wording
(Rule 42) and is NOT a false assertion.** But the quoted example is the thing a tester actually looks
for, so the recommendation is to **swap the quoted examples to the build's own words while KEEPING the
scope-conditional framing**: *"in the spirit of 'Starts before business hours'"*.

**⚠️ AND A SEPARATE QUESTION IS RAISED, NOT ANSWERED — see `FINDINGS.md` F7.** The case says the flag
is measured against *"that technician's own configured working-day START/END time"* with a hierarchy of
technician hours → shop business hours → default. The build's message says **"business hours"** and
quotes **7:00 AM / 3:00 PM**. **Which tier actually drives it is NOT established by this observation**,
because the flagged shifts belong to other technicians whose hours we did not read. **Recorded as a
question; nothing re-verdicted.** Also note the panel header is **`Schedule issues`**, and the toolbar
pill reads **`6 conflicts`** (Day), **`37 conflicts`** (Week), **`122 conflicts`** (Month).

### 2.6 A closed enumeration the build now contradicts — C30015

`custom_expected` item 1 reads: *"The modal offers a Delete action (a trash icon in the header) and a
close (x) icon — **and no other actions**."*

**Observed in the shift modal** (`evidence/surface-09-shift-modal.png`,
`evidence/surface-10-series-block.png`): alongside `Delete shift` and `Close shift details` the modal
also offers **`Add Note`**, **`Edit estimated hours for <line>`**, **`Change colour`** (`Colour: blue.
Change colour`) and **`Open work order S-12876 in a new tab`**.

**So "no other actions" is a closed enumeration that is now false** — precisely the Rule-42 time bomb.
**The case's actual point is still correct and is confirmed: there is NO `Reassign` action in the
modal.** Recommendation: **keep the `Reassign` assertion, rewrite item 1 scope-conditionally** rather
than deleting it, and note this is a wording repair, not a change of expectation.

---

## 3 · FALSE POSITIVES — flagged by our own sweep and DELIBERATELY NOT STAGED

**Recorded because a bogus correction costs more than a missed one, and because an automated diff
producing 4 confident wrong rows is worth knowing about.**

| Flagged | Why it is NOT a defect |
|---|---|
| **`N Lines`** on C29964, C29973, C29992, C30011 | **Deliberate placeholder wording.** C29964 spells it out: *"the block's last text line reads 'N Lines' (**with N = the line count**)"*. The build renders `8 Lines`, `4 Lines`, `2 Lines`. The cases are RIGHT — this is Rule 42 wording working as intended. |
| **`View Day`** and **`New Shift`** on C30054 | The case asserts their **ABSENCE**: *"There is no 'View Day' item — it was removed"*. A string search cannot tell an assertion from a negation. |
| **`ZZAUTOTEST note` / `ZZAUTOTEST stand-up` / `ZZAUTOTEST Rush`** | Our own throwaway **test-data names**, not build labels. Correctly absent. |

### ✅ C30054 is fully correct AND now fully confirmed — all five points

Worth stating positively, because it settles a recorded spec defect. Observed live
(`evidence/surface-12-cell-leftclick.png`, `evidence/surface-13-cell-rightclick.png`):

1. **Left-click** an empty cell opens a menu ✓ — headed `MQ Test Tech Qamar · Tue, Aug 11 · 21:15`
2. It contains **exactly** `Create Event` and `New Work Order` ✓
3. No `View Day` ✓ · 4. No `New Shift` ✓
5. **Right-clicking does NOT open it** ✓ — the right-click surface added **zero** new strings

**This resolves, by observation, the spec self-contradiction already on our record** (§7 says
left-click; §14.1/§14.2 twice say right-click). **The build is left-click. Our case is right and the
specification is wrong in two places** — a documentation defect for the PO, not a case change.

---

## 4 · WHAT IS STILL OWED, AND THE ONE THING THAT BLOCKS IT

**24 quoted labels sit on surfaces this pass could not reach.** The single cause for most of them:

🔴 **THE SCOPE PICKER AND SPREAD DIALOG CANNOT BE OPENED, BECAUSE OPENING THEM REQUIRES A DRAG AND THE
CLICK ALTERNATIVE HAS BEEN REMOVED** ([SV-8957](https://shopview.atlassian.net/browse/SV-8957)).
Re-confirmed on the Schedule page this run: **no arm test-id, no `aria-label` containing "by click",
no arm markup anywhere.** Our tooling cannot complete an HTML5 drag on this grid.

Blocked behind it: `Schedule whole work order`, `Select multiple`, `Select all`, `Cancel`,
`Change scope`, `Full estimate` — **C29956, C29958, C29963, C29964, C29965, C29967, C29978, C29979,
C29983, C29986.**

Reachable, simply not yet visited: `Time Clock`, `Reset To Template` (Custom Roles admin),
`Add hours`, `Set business hours for this shop`, `Set custom hours for this technician` (Working Hours
settings), `Needs techs`, `Clear all`, `All / Unscheduled`, `Complete` (need a filter active / a
completed line seeded), `Adjust` (C30014 — searched the shift modal and **not found under any
wording**; see `FINDINGS.md`).
