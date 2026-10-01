# SV-10586 — Opening Staff from Roles & Permissions mixes in and overwrites your saved Staff filters

**Ticket:** [SV-10586](https://shopview.atlassian.net/browse/SV-10586) · status TESTING QA · priority Medium · reporter and assignee Dipesh Changawala · relates to SV-10179
**QA branch:** https://sv10586.qa.shopview.com — build **`v26.39.2-ad6deec`**
**Production (the BEFORE half, Standing Rule 86):** https://app.shopview.com — build **`v26.40.0-515e092`**, last-modified Thu, 01 Oct 2026 09:19:31 GMT
**Handoff followed:** the QA handoff generated from the diff (PR #3373), every box
**Date:** 2026-10-01

> Note on version numbers: production reads `v26.40.0` and the branch `v26.39.2`. The branch is cut
> from an earlier base, so the higher production number does **not** mean production is ahead on this
> fix — and it is not: both halves of the bug reproduce there, proven in §3.

---

## 1. Verdict

**PASS** — every check in the handoff passes, and both halves of the reported bug are fixed.

One thing to be aware of before running the checklist: the **Users count on the Roles page counts
active *and* deactivated people**, while Staff opens on the Active tab. See §4 — it is not a
regression and not something this change touches, but it will look like a failed check if you only
read the Active tab.

---

## 2. What was checked

| # | Check | Result |
|---|---|---|
| 1 | Setup: Permissions + Location + Department save and survive leaving and returning | **PASS** |
| 2 | Clicking a role's Users count opens Staff with only that role | **PASS** — Admin, Technician, Foreman and Parts Technician all opened with that role alone |
| 3 | No Technician, no Location, no Department carried in | **PASS** — all four showed "All locations" and "All departments" |
| 4 | The number of people matches the Users count | **PASS, reading both tabs** — see §4 |
| 5 | A role with 0 users shows no link | **PASS** — only roles with people are linked |
| 6 | Open the link, change nothing, leave and return | **PASS** — saved view restored |
| 7 | Open the link, refresh, then return from the menu | **PASS** — saved view restored |
| 8 | Open the link, type in search only, leave and return | **PASS** — saved view unchanged |
| 9 | Open the link, add a Location, leave and return | **PASS** — saved view is now Admin + that Location; Technician and Department gone, as intended |
| 10 | Open the link, remove the role chip, leave and return | **PASS** — no filters saved, old Location and Department gone, as intended |
| 11 | After your own change the `roleName=` leaves the address bar | **PASS** |
| 12 | Bad link `?roleName=ROLE_UNKNOWN` | **PASS** — normal saved view loads, and is unchanged afterwards |
| 13 | Normal visit (from the menu): a filter change is still saved | **PASS** |
| 14 | Active and Deactivated tabs after arriving from the link | **PASS** — both load, filter stays the clicked role |
| 15 | Browser Back then Forward | **PASS** — both pages load, no error |
| 16 | Hotspot: a report opened from a shared link does not overwrite the saved report view | **PASS** — Sales report, saved view unchanged after a `?range=this_year` link |
| 17 | Hotspot: typing in search is not a filter change | **PASS** on Staff |

### The measurements behind rows 2–4

| Role clicked | Users count | Permissions after | Locations | Departments | Active | Deactivated | Active + Deactivated |
|---|---|---|---|---|---|---|---|
| Admin | 84 | Admin | All | All | 57 | 27 | **84** |
| Technician | 55 | Technician | All | All | 26 | 29 | **55** |
| Foreman | 12 | Foreman | All | All | 6 | 6 | **12** |
| Parts Technician | 4 | Parts Technician | All | All | 4 | 0 | **4** |

---

## 3. The before and after, captured on production

Production carries the pre-fix behaviour, so the reported steps were run there first. Saved view
built as the ticket describes — **Technician + Trucks Hill 2 + Department1** — then the **Admin**
Users count (8) clicked.

| Step | Production `v26.40.0-515e092` | QA branch `v26.39.2-ad6deec` |
|---|---|---|
| 4 — Staff opens from the link | Permissions **2 permission groups** (Technician + Admin), Location **Trucks Hill 2** and Department **Department1** still applied; list shows **7** against a count of **8** | Permissions **Admin** only, **All locations**, **All departments** |
| 5 — leave, come back from the menu, having changed nothing | still **2 permission groups** — the saved filter has been overwritten | **Technician + Lethbridge + Service** — exactly as left |

Production URL at step 4 was `?roleName=Admin&roles=Technician&roles=Admin&workplaces=…&departments=…`,
which is the merge the ticket describes. On the branch it is `?roleName=Admin&roles=Admin`.

**Production was restored.** Its saved Staff view was **Sales Representative / All locations / All
departments** before this pass and is again now, confirmed after leaving Staff and returning from
the menu. Nothing else on production was changed.

---

## 4. The Users count includes deactivated people — worth knowing, not a defect here

The handoff says the number of people in the list should equal the Users count you clicked. It does,
but only if you count **both tabs**. Clicking Admin (84) gives 57 Active and 27 Deactivated, and
Staff opens on Active. The same holds for all four roles tested, exactly.

This is not caused by this change: the count is produced by the Roles & Permissions page, which this
PR does not touch, and the Staff filter is demonstrably correct — it returns every person in that
role, across both tabs. **Flagged rather than filed**, because whether a "Users" count should include
deactivated people is a product question, not a QA verdict. If the team wants it raised, say so and
I will file it.

---

## 5. Things checked and deliberately not reported as faults

1. **A report's date filter does not persist.** On the Sales report, setting Date to Today, leaving
   and returning shows "This month" again. **Production behaves identically**, so it is existing
   behaviour and not a regression from the shared-helper refactor. Checked precisely because the
   helpers these two pages share are the risk this PR carries.
2. **Typing in the Staff search dropped `roleName=` from the address bar** while the saved view was
   still left alone. The visible rule — search is not a filter change, so nothing is saved — holds.

---

## 6. How it was tested

Viewport 1700 x 1050, signed in as Admin on both environments.

Honest split of what was clicked and what was called: everything under test was driven **on the
screen** — the filter chips and their option lists, the chips' clear icons, the Roles & Permissions
Users links, the left-hand menu, the Active/Deactivated tabs, the search box, and the browser's own
Back and Forward. Nothing about the filters or the saving was done through the API.

One mechanical note for whoever automates this: the filter options are Quasar checkbox rows, and a
plain mouse click on the row closes the menu without applying the option. Focusing the option and
pressing **Space** applies it reliably — a real keyboard gesture, and the one used throughout.

## 7. Test data left in place

Per-ticket QA branches need no cleanup. The branch is left with a saved Staff view of
**Admin + Staging Heavy Duty - 9919**, which is where check 9 finished. Nothing was created or
deleted — only filter preferences, which are per user account.

## 8. Evidence

- `ev/01-before-after.png` — step 4 on both builds
- `ev/02-saved-filters-left-alone.png` — step 5 on both builds
- `ev/03-your-first-change-is-saved.png` — the first-own-change rule on the branch
- `ev/build_ex.py` — the exhibit builder
- Probe scripts and raw run output: `/tmp/qa10586/` (branch) and `/tmp/qa10586p/` (production), not committed

## 9. Pre-post gate (Standing Rule 72)

Recorded in `GATE.md` when the comment is posted.
