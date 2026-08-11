# Schedule — the STAGED pack: 2 new cases + 1 case extension — 2026-08-11

# 🛑 NOTHING HERE HAS BEEN EXECUTED.

**Zero `add_case`, zero `update_case`, zero `delete_case`, zero run write, zero Jira call that creates
anything.** Another worker owns TestRail writes for Schedule right now; this pack is **decision-ready for a
later authorised pass** (Rules 6 / 62). Every item below is the exact payload that pass would send.

**What it closes:** the **3 genuinely still-open assertions** left after re-verifying the 19 + 4 rows the
2026-08-10 map flagged. All three are in **§11**, and all three have been in the specification for
**19 to 27 days** — they are our miss, not spec churn (`COVERAGE-REDERIVATION.md` §4).

---

## The manifest

| # | Op | Internal id | Title | Section | Closes | Marker |
|---|---|---|---|---|---|---|
| **S1** | `add_case` | `SCH-EDGE-09` | Dark mode is chosen from the user menu and is remembered for you | **Edge Cases and Responsiveness — 4280** | `§11-L303.A1` | `AUTOMATION: READY` |
| **S2** | `add_case` | `SCH-EDGE-10` | In dark mode pop-up windows still look raised above the page | **Edge Cases and Responsiveness — 4280** | `§11-L303.A4` | `AUTOMATION: READY` |
| **S3** | `update_case` | `SCH-LANE-03` = [C29998](https://shopview.testrail.io/index.php?/cases/view/29998) | *(title unchanged)* | Overlap & Lane Stacking — 4266 | `§11-L301.A6` | `AUTOMATION: READY` *(unchanged)* |

**Ops: 2 `add_case` + 1 `update_case` = 3. Plus one run sync — see the bottom of this file, it is part of
the item and not an afterthought.**

### Decisions taken in building this pack, stated up front

**Why two new cases and one extension, rather than three of either.** S1 and S2 assert behaviours with
**preconditions no existing case sets up** — S1 needs a sign-out/sign-in cycle, S2 needs pop-ups open in
dark mode — and neither belongs under C38866's title, *"Schedule and all its dialogs display correctly in
dark mode"*. S3 is different: its expensive part is **five mutually overlapping shifts on one technician**,
which **C29998 already seeds**, and the assertion is one line inside the state that case already produces.
A standalone case would duplicate that seed to assert one sentence — Rule 28 calls that a **MERGE, not a
KEEP**, so it is staged as an extension.

**Why `AUTOMATION: READY` on all three.** `READY` asserts *automatable*, not *currently passing*, and is
**build-independent** (Rule 60 layer 3). None of the three needs a physical device or an account we do not
have — the only thing that looked like a blocker, proving *per user*, is settled by signing in as the
**same** user in a second browser rather than needing a second account (see S1's deliberate scope note).
**No `READY - EXPECT FAIL` is set on anything**: no live source backs an expect-fail on any of these, and
Rule 61 as amended on 2026-08-11 is explicit — **no backing, no marker.** The tester discovers pass or fail.

**Why `custom_atmstatus` is `1`.** That is TestRail's own "Automated" field and it is **Vlad's to set, not
ours** (Rule 64, settled 2026-08-11). All 174 live Schedule cases now read `1` after the correction pass.
**⚠️ `build/schedule/panel-collapse-2026-08-11/tools/push.py` hardcodes `3` — do not reuse it unpatched.**

**Why `refs` carries no comma.** TestRail splits `refs` on commas into separate entries and rejects any one
entry over 248 characters. The Rule-20 + Rule-42 content (ticket · spec anchor · version pin · date) is
therefore written **comma-free** in a single entry. Lengths are given per item and all are well under 248.

**Why sentence 2 of the provenance line is absent.** **No build was observed in this pass** (Rule 12), so
naming a build the case was "last checked against" would assert a check nobody made — the exact failure
that makes a provenance line worse than none (Rule 54).

---

# S1 · `add_case` — `SCH-EDGE-09`

**Closes `§11-L303.A1`.** Requirement quoted against the gap it fills (Rule 45(e)):

> **Confluence v27 §11, verbatim:** *"**Dark theme.** The Schedule supports a user-selectable Light / Dark
> theme, **chosen from the user menu and persisted per user**. It is built on the design-system color
> tokens…"*
>
> **Story [SV-8700](https://shopview.atlassian.net/browse/SV-8700), requirement 5, verbatim:** *"Dark
> theme: built on design-system color tokens. Surfaces, borders, text, accents, and elevation/shadow tokens
> remap automatically. **User-selectable from user menu, persisted per user.**"*
>
> **What the suite asserts today — SCH-EDGE-08 = [C38866](https://shopview.testrail.io/index.php?/cases/view/38866), verbatim:**
> step 1 *"Switch the app to dark mode."*; expected 1 *"In dark mode every part of the Schedule stays
> readable - no white-on-white or black-on-black text, no unreadable labels or invisible icons."*
>
> **The gap:** C38866 asserts **rendering**. It never chooses the theme from the user menu and never signs
> out and back in, so **neither "chosen from the user menu" nor "persisted per user" is asserted by any
> case** — while C38866's own `refs` *claim* the persistence.

| | |
|---|---|
| **Section** | **4280** "Edge Cases and Responsiveness" — where C38866 and C30086, the other §11 cases, already live |
| **Type / template** | non-API, standard (§11 is a product requirement; nothing here touches an endpoint — Rule 4) |
| **`custom_atmstatus`** | **`1`** (Not Automated) · `custom_automation_type` `0` |
| **`refs`** *(one comma-free entry, **93 chars**)* | `SV-8700 (§11 Dark theme - chosen from user menu and persisted per user - spec v27 2026-08-07)` |

### Title
```
Dark mode is chosen from the user menu and is remembered for you
```
*(**64** characters — under the 80 bar.)*

### Preconditions
```
1. You are signed in to the ShopView App on a desktop browser.
2. Your role has the Schedule: View permission.
3. You know the password for the account you are signed in with, because this test signs out and back in.
4. The app is currently in light mode.
```

### Steps
```
1. Open the menu for your own account - the one under your name or profile picture at the top of the page - and look for the light / dark theme choice in it.
2. Use that choice to switch the app to dark mode.
3. Open the Schedule page and check it is in dark mode.
4. Sign out of the ShopView App completely.
5. Sign back in with the same account and open the Schedule page again.
6. Check whether the Schedule is in light mode or dark mode.
7. On a different computer, or in a private browsing window, sign in with the SAME account again and open the Schedule page.
8. Check whether the Schedule is in light mode or dark mode there too.
9. Switch back to light mode from the same menu when you have finished, so you leave the account as you found it.
```

### Expected Results
```
1. The light / dark theme choice is in your own account menu at the top of the page. You do not have to go into a settings page to find it.
2. Choosing dark mode switches the app to dark mode straight away, and the Schedule page opens in dark mode.
3. At step 6, after signing out and signing back in, the Schedule is STILL in dark mode. Your choice was remembered.
4. At step 8, on the other computer or in the private window, the Schedule is ALSO in dark mode. The choice is remembered against your account, not against the one browser you set it in.
5. Switching back to light mode at step 9 works the same way and is remembered in the same way.

---
This is the expected behaviour as per epic SV-8685, its story SV-8700 (requirement 5), and the Schedule specification version 27 (§11 Dark theme), both read on 11 August 2026.

AUTOMATION: READY
```

### Deliberate scope decision on this case, recorded rather than left for a reviewer to find

**The requirement's words are *"persisted per user"*. This case proves the choice is stored against the
ACCOUNT — by signing in as the same user in a second browser at step 7 — and does NOT prove that one
person's choice leaves another person's untouched.**

That second half would need a **second sign-in as a different person**, which is **the blocker holding 13
Schedule cases today** and has been outstanding since 5 August. **Scoping it out is what keeps this case
`READY` instead of `HOLD`**, and the account-scoping check at step 7 carries the substantive promise: it
is what distinguishes a per-user setting from a per-browser one, which is the failure a tester would
actually meet. **Risk: LOW.** Recorded in `DELIBERATE-DECISIONS.md` entry **D3**.

**One label is deliberately not pinned.** The specification says *"the user menu"* and we hold **no dated
design** for it (source D is PARTIAL) and **observed no build this pass**. Step 1 therefore describes the
menu in the document's own words plus a plain-English locator — *"the one under your name or profile
picture at the top of the page"* — and **names no button text we have not seen**. Rule 9 forbids inventing
a label; it does not forbid quoting the source. **A later pass with build access should confirm the exact
menu wording.**

---

# S2 · `add_case` — `SCH-EDGE-10`

**Closes `§11-L303.A4`.** Requirement quoted against the gap it fills:

> **Confluence v27 §11, verbatim:** *"It is built on the design-system color tokens, so surfaces, borders,
> text, and accents remap automatically; **elevation/shadow tokens also swap so depth reads correctly on
> dark surfaces**."*
>
> **Story SV-8700, requirement 5, verbatim:** *"Surfaces, borders, text, accents, **and elevation/shadow
> tokens remap automatically**."*
>
> **What the suite asserts today — C38866, verbatim:** expected 1 *"In dark mode every part of the Schedule
> stays **readable** - no white-on-white or black-on-black text, no unreadable labels or invisible icons."*
>
> **The gap:** **readability and depth are different properties with different failures.** A dialog can be
> perfectly readable and still look flat — merged into the page — because a dark shadow drawn on a dark
> surface disappears. **No case asserts a pop-up still looks raised in dark mode.**

| | |
|---|---|
| **Section** | **4280** "Edge Cases and Responsiveness" |
| **Type / template** | non-API, standard |
| **`custom_atmstatus`** | **`1`** · `custom_automation_type` `0` |
| **`refs`** *(one comma-free entry, **99 chars**)* | `SV-8700 (§11 Dark theme - elevation and shadow swap so depth reads correctly - spec v27 2026-08-07)` |

### Title
```
In dark mode pop-up windows still look raised above the page
```
*(**60** characters — under the 80 bar.)*

### Preconditions
```
1. You are signed in to the ShopView App on a desktop browser.
2. Your role has the Schedule: View permission.
3. The app is in dark mode.
4. You are on the Schedule page in week view, with at least one shift in the grid.
```

### Steps
```
1. Click a shift in the grid to open its details window, and look at where that window meets the page behind it.
2. Close it, then open the View options menu from the row of buttons above the grid, and look at where that menu meets the page behind it.
3. Rest your mouse pointer on a shift so its hover tooltip appears, and look at where the tooltip meets the page behind it.
4. Switch the app to light mode and look at the same three things again, so you have something to compare against.
```

### Expected Results
```
1. In dark mode each of the three - the shift details window, the View options menu and the hover tooltip - is clearly separated from the page behind it. You can tell where it ends and the page begins.
2. The separation comes from the pop-up itself: it sits on a slightly different shade from the page behind it, or has a visible edge or soft shadow around it.
3. None of the three blends into the page so that its edges cannot be made out, and none of them is missing that separation entirely while the light-mode version has it.
4. Nothing you check is unreadable, and no text or icon disappears into the background.

---
This is the expected behaviour as per epic SV-8685, its story SV-8700 (requirement 5), and the Schedule specification version 27 (§11 Dark theme), both read on 11 August 2026.

AUTOMATION: READY
```

### Honest note: this reverses the 2026-08-10 recommendation, and says why

The 2026-08-10 pass recommended **skipping** this as *"closer to a design-fidelity check than behaviour"*,
to be picked up by a Figma-fidelity pass. **This pass disagrees.** That Figma pass **has not happened and
is not scheduled**, the design source is **PARTIAL and undated**, and **the release is Thursday**. The
assertion is plainly layman-checkable — a tester can see whether a window stands off the page or merges
into it — without reading a single design token. **A skip whose owning pass never runs is an uncovered
requirement with a nicer name.** Recorded in `DELIBERATE-DECISIONS.md` entry **D2**.

**What this case deliberately does NOT assert:** that the app uses *"elevation/shadow **tokens**"*, which is
an implementation detail nobody can observe from a screen (the sibling assertions `§11-L303.A2` and `.A3`
are verdicted NOT-INDEPENDENTLY-TESTABLE for exactly that reason). It asserts the **observable consequence
the requirement itself names — "so depth reads correctly on dark surfaces"**.

---

# S3 · `update_case` — `SCH-LANE-03` = [C29998](https://shopview.testrail.io/index.php?/cases/view/29998)

**Closes `§11-L301.A6`.** Requirement quoted against the gap it fills:

> **Confluence v27 §11, verbatim:** *"Overtime and conflict signals are not color-only (OT uses a text tag;
> **the overflow uses shape**)."*
>
> **The sibling assertion IS covered** — *"OT uses a text tag"* by **SCH-CAP-03 =
> [C30032](https://shopview.testrail.io/index.php?/cases/view/30032)**: *"The tag is text, not a color-only
> signal."* **Which is exactly why this matters: at line level the row reads *covered* and closes.**
>
> **What C29998 asserts today, verbatim:** expected 2 *"The remaining overlapping shifts collapse into a
> '+N more' affordance (here '+2 more')."*; expected 3 *"Clicking it opens a popover listing the hidden
> shifts."*
>
> **The gap:** C29998 asserts the overflow **exists** and **opens**; C38866 asserts the **conflict and
> overtime** cues are not colour-only. **Neither asserts the OVERFLOW is conveyed by SHAPE**, so a build
> that signalled it by colour alone — a coloured strip with no text and no distinct form — would pass every
> case in the suite.

**This requirement has been in the specification since version 1, 2026-07-15 — 27 days.** It is the oldest
uncovered thing this pass found.

### The change: **ONE expected result appended. Nothing else is touched.**

| Field | Change |
|---|---|
| `title` | **unchanged** |
| `custom_preconds` | **unchanged** |
| `custom_steps` | **unchanged** |
| `custom_expected` | **one item inserted as the new item 4**, before the `---` separator; items 1–3 and the whole provenance block **unchanged** |
| `refs` | **one anchor added**: `§11` alongside the existing `§4.7` |
| marker | **unchanged** — `AUTOMATION: READY` |

**New expected item 4, to be inserted after the existing item 3 and before the existing item 4:**
```
4. You can tell the '+2 more' is something to click without relying on its colour: it carries the count as words you can read, and it is drawn as its own distinct shape - a small chip, pill or button - not just a differently coloured patch of the lane.
```
*(The existing item 4, "The hidden shifts can be opened from that popover.", becomes item 5.)*

**Proposed `refs`** *(one comma-free entry, **88 chars**)*:
```
SV-8693 (§4.7 lane cap and overflow + §11 the overflow uses shape - spec v27 2026-08-07)
```

**⚠️ The whole case must be re-verified end-to-end before this is written (Rule 41)** — there are no
surgical edits, and opening a case is the cheapest chance to notice it is stale. **And all four text
fields must be sent on the payload** (`custom_preconds`, `custom_steps`, `custom_expected`, `refs`):
TestRail **re-renders any text field you omit** through its HTML pipeline, which is how a Filters pass
turned plain text into `<p>`-wrapped CRLF on write 1 of 110.

---

## RUN SYNC — part of this item, not an afterthought (Rules 34 / 47)

**Run 357 has `include_all = false`**, so **it will not pick up S1 and S2 by itself** and the two new cases
would sit outside the run a tester actually executes. Syncing means:

1. `get_tests/357` and `get_results_for_run/357` — **snapshot first**.
2. **UNION** the run's current 174 case ids with the 2 new ones → **176**.
3. `update_run` with the **FULL union of 176**.
4. Verify after: **176 tests**, case-id sets **equal in both directions**, and **every prior result present
   BY ID** — never by count alone.

> **⚠️ A PARTIAL `case_ids` LIST DELETES THE OMITTED TESTS AND THEIR RECORDED RESULTS. Always union.**

**Run 357 belongs to Ayesha Khan and needs its own explicit authorisation** (Rule 6). S3 needs no run sync —
it edits a case already in the run.

---

## What a later pass must check before pushing any of this

1. **Re-read the spec version at write time (Rule 59).** It was v27 at 13:09Z and 13:26Z today; Branko has
   edited this page 27 times and twice within one hour on 7 August. **If it has moved, re-derive before
   writing** — the three requirements here are §11 and §4.7 anchors and a v28 could touch them.
2. **Re-read C29998 whole** before S3 (Rule 41), and re-read C38866 — if another pass has since added the
   persistence or depth assertions to it, **S1 or S2 may have become redundant and must not be pushed
   blind**.
3. **Byte-verify every write** (Rule 50): re-GET and compare field by field against the intended payload,
   with every untouched field proven byte-identical to its pre-write snapshot. **On any mismatch, stop the
   batch.**
4. **Record `custom_atmstatus` at write time and end the report with an "AUTOMATED CASES CHANGED — FOR
   VLAD" section** (Rule 65). On today's reading **all three targets are `1`**, so that section will read
   **"none"** — **but it must still be written, and the value must be captured at write time, because the
   flag moves both ways.**
