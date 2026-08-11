# Flag corrections — who set the Automated flag, per case, and what was done

**Date:** 2026-08-11 · **Scope:** all three active projects — Filters, Schedule, Report Suite.
**Ruling.** QA lead, verbatim: *"Are you adding 'Automated' to the test cases when you create them?
there ar etest cases which are being given the AUTOMATED testrail marker, those are fine, but if you
are adding that marker that is wrong."* — and on scope: *"Yeh wee need to fix everycase from all the
three projects where we have mistakengly done that."*

**Result in one line: 31 flags corrected, 44 left alone, and the 44 were left alone because TestRail's
history shows Vladimir Tomovic set every one of them himself.**

---

## 1. How "who set it" was established — per case, never by subtraction

`get_history_for_case`, fully paged, for **all 75** of our cases carrying `custom_atmstatus = 3`.
TestRail's history records every field change with the field name, the old and new values, the user id
and the timestamp. The population was filtered to changes of `custom_atmstatus` itself.

| | Cases |
|---|---:|
| Ours across the three groups (`created_by = 3`) | **764** — Filters 114 · Schedule 174 · Report Suite 476 |
| …of those, carrying `custom_atmstatus = 3` | **75** — Filters 4 · Schedule 31 · Report Suite 40 |
| **…with a history entry showing a person set the flag** | **44 — every one user 1, Vladimir Tomovic** |
| **…with NO `custom_atmstatus` history entry at all** | **31 — all Schedule** |

**The absence is a measurement, not a gap.** All 31 have **non-empty** histories — TestRail has been
recording their `custom_expected`, `refs` and `title` changes throughout — and **none of that history
ever touches `custom_atmstatus`**. So the value `3` has stood unchanged since the case was created,
and we created it.

**A second, independent line of evidence agrees exactly.** Our `add_case` tooling hardcodes
`custom_atmstatus: 3` (see `FIELD-FACTS.md`), while imported cases arrive as `1`. Measured live:

> **Every one of the 31 Schedule cases with an id above 30090 — i.e. every case we added by API — is
> `3`. All 143 imported Schedule cases are `1`. No exceptions in either direction.**

Two methods, arrived at from different directions, name the same 31 cases.

---

## 2. The 31 cases corrected — `3` (Automated) → `1` (Not Automated)

All Schedule. All authored by us (`created_by = 3`). None appears in anyone else's history.

| Case | Title |
|---|---|
| [C30614](https://shopview.testrail.io/index.php?/cases/view/30614) | With Work Orders: View OFF, work order details on  |
| [C30615](https://shopview.testrail.io/index.php?/cases/view/30615) | An event's hours count toward the capacity bar but |
| [C38847](https://shopview.testrail.io/index.php?/cases/view/38847) | Business-hours toggle reveals a per-day (Mon-Sun)  |
| [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) | Edit Staff has a 'Set custom hours for this techni |
| [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) | A technician with no custom hours inherits the sho |
| [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) | 'Add hours' appends a removable second range for s |
| [C38851](https://shopview.testrail.io/index.php?/cases/view/38851) | Overlapping hour ranges block Save; incomplete row |
| [C38855](https://shopview.testrail.io/index.php?/cases/view/38855) | 'New Work Order' in the cell menu points the user  |
| [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | Spread past 8 weeks asks to confirm; a series can  |
| [C38864](https://shopview.testrail.io/index.php?/cases/view/38864) | Schedule actions save immediately - Undo reverses  |
| [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | A multi-week series keeps the same local start tim |
| [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | Schedule and all its dialogs display correctly in  |
| [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) | Shifts and events created before the Schedule rewr |
| [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) | Dashboard shows one schedule row per work order ev |
| [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) | A work order created with an appointment shows up  |
| [C38870](https://shopview.testrail.io/index.php?/cases/view/38870) | A multi-location technician's shift appears only o |
| [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) | Work order form offers a Priority (High/Medium/Low |
| [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | API - Schedule reads need View; writes need Edit;  |
| [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) | API - Series past 8 weeks returns 409 until acknow |
| [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) | API - No pricing fields in Schedule responses; WO  |
| [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | API - A shift from another location returns 404, n |
| [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) | Default roles start at the Schedule level the spec |
| [C43554](https://shopview.testrail.io/index.php?/cases/view/43554) | Schedule opens on Day view the first time you open |
| [C43555](https://shopview.testrail.io/index.php?/cases/view/43555) | Month view: dragging a work order onto a day creat |
| [C43556](https://shopview.testrail.io/index.php?/cases/view/43556) | Week view: a shift that is part of a repeating ser |
| [C43582](https://shopview.testrail.io/index.php?/cases/view/43582) | Panel button sits left of Today and its tooltip na |
| [C43583](https://shopview.testrail.io/index.php?/cases/view/43583) | Panel button hides the left panel and the grid wid |
| [C43584](https://shopview.testrail.io/index.php?/cases/view/43584) | What you had set up in the left panel survives hid |
| [C43585](https://shopview.testrail.io/index.php?/cases/view/43585) | On a narrow window the panel button still works an |
| [C43586](https://shopview.testrail.io/index.php?/cases/view/43586) | Menus and pop-up windows reposition when the left  |
| [C43587](https://shopview.testrail.io/index.php?/cases/view/43587) | Hiding the panel lasts for the rest of your sign-i |

**Verification (Standing Rule 50).** Each write sent `custom_atmstatus: 1` **plus all three text
fields at their exact pre-write values** — playbook DECLARED NORMALISATION #3: a text field omitted
from an `update_case` payload gets pushed back through TestRail's HTML pipeline and reaches the tester
as raw markup. Then, per case, a re-GET and a comparison of **all 30 fields** against the pre-write
snapshot.

- **31 of 31 HTTP 200 · 31 of 31 verified PASS · 0 mismatches.**
- **The only fields that moved on any case are `custom_atmstatus`, `updated_on` and `updated_by`.**
  `title`, `refs`, `section_id`, `type_id`, `priority_id`, `template_id`, `custom_preconds`,
  `custom_steps`, `custom_expected` and every other field are byte-identical.
- An **independent second re-read** afterwards (a fresh `get_case` per case, not the write's own
  response) confirms the same: **0 mismatches**.
- Group-wide check afterwards: **Schedule now reads 174 of 174 Not Automated.**
- **Raw-markup census before writing: 0 of 31** (playbook DECLARED HAZARD #5 — the render fires hours
  later, so this is stated as a measurement of the moment, not a durable state).

Pre-write bodies: `snapshots/PRE-31-schedule-cases.json` · post-write: `snapshots/POST-31-schedule-cases.json`
· per-operation log: `testrail-execution-log.md` and `evidence/oplog-31-flag-fixes.json`.

---

## 3. The 44 cases left alone — Vlad set every one of them

**Not touched, and they must not be.** Clearing a flag he set would break his automation silently, in
a system we do not own — the exact harm the rule exists to prevent.

| Project | Case | Flag changes | Sequence |
|---|---|---:|---|
| Filters | [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | 3 | Not Automated → Automated → Not Automated → Automated |
| Filters | [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | 1 | Not Automated → Automated |
| Filters | [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | 1 | Not Automated → Automated |
| Filters | [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | 2 | Automated → Not Automated → Automated |
| Report Suite | [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | 1 | Not Automated → Automated |
| Report Suite | [C30114](https://shopview.testrail.io/index.php?/cases/view/30114) | 1 | Not Automated → Automated |
| Report Suite | [C30121](https://shopview.testrail.io/index.php?/cases/view/30121) | 1 | Not Automated → Automated |
| Report Suite | [C30123](https://shopview.testrail.io/index.php?/cases/view/30123) | 1 | Not Automated → Automated |
| Report Suite | [C30138](https://shopview.testrail.io/index.php?/cases/view/30138) | 1 | Not Automated → Automated |
| Report Suite | [C30217](https://shopview.testrail.io/index.php?/cases/view/30217) | 1 | Not Automated → Automated |
| Report Suite | [C30221](https://shopview.testrail.io/index.php?/cases/view/30221) | 1 | Not Automated → Automated |
| Report Suite | [C30262](https://shopview.testrail.io/index.php?/cases/view/30262) | 1 | Not Automated → Automated |
| Report Suite | [C30314](https://shopview.testrail.io/index.php?/cases/view/30314) | 1 | Not Automated → Automated |
| Report Suite | [C30326](https://shopview.testrail.io/index.php?/cases/view/30326) | 1 | Not Automated → Automated |
| Report Suite | [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) | 1 | Not Automated → Automated |
| Report Suite | [C30333](https://shopview.testrail.io/index.php?/cases/view/30333) | 1 | Not Automated → Automated |
| Report Suite | [C30338](https://shopview.testrail.io/index.php?/cases/view/30338) | 1 | Not Automated → Automated |
| Report Suite | [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | 1 | Not Automated → Automated |
| Report Suite | [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | 1 | Not Automated → Automated |
| Report Suite | [C30353](https://shopview.testrail.io/index.php?/cases/view/30353) | 1 | Not Automated → Automated |
| Report Suite | [C30390](https://shopview.testrail.io/index.php?/cases/view/30390) | 1 | Not Automated → Automated |
| Report Suite | [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | 1 | Not Automated → Automated |
| Report Suite | [C30399](https://shopview.testrail.io/index.php?/cases/view/30399) | 1 | Not Automated → Automated |
| Report Suite | [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | 1 | Not Automated → Automated |
| Report Suite | [C30404](https://shopview.testrail.io/index.php?/cases/view/30404) | 1 | Not Automated → Automated |
| Report Suite | [C30410](https://shopview.testrail.io/index.php?/cases/view/30410) | 1 | Not Automated → Automated |
| Report Suite | [C30424](https://shopview.testrail.io/index.php?/cases/view/30424) | 1 | Not Automated → Automated |
| Report Suite | [C30429](https://shopview.testrail.io/index.php?/cases/view/30429) | 1 | Not Automated → Automated |
| Report Suite | [C30449](https://shopview.testrail.io/index.php?/cases/view/30449) | 1 | Not Automated → Automated |
| Report Suite | [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | 1 | Not Automated → Automated |
| Report Suite | [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) | 1 | Not Automated → Automated |
| Report Suite | [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | 1 | Not Automated → Automated |
| Report Suite | [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | 1 | Not Automated → Automated |
| Report Suite | [C30498](https://shopview.testrail.io/index.php?/cases/view/30498) | 1 | Not Automated → Automated |
| Report Suite | [C30508](https://shopview.testrail.io/index.php?/cases/view/30508) | 1 | Not Automated → Automated |
| Report Suite | [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | 1 | Not Automated → Automated |
| Report Suite | [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | 1 | Not Automated → Automated |
| Report Suite | [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | 1 | Not Automated → Automated |
| Report Suite | [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | 1 | Not Automated → Automated |
| Report Suite | [C30535](https://shopview.testrail.io/index.php?/cases/view/30535) | 1 | Not Automated → Automated |
| Report Suite | [C30557](https://shopview.testrail.io/index.php?/cases/view/30557) | 1 | Not Automated → Automated |
| Report Suite | [C30563](https://shopview.testrail.io/index.php?/cases/view/30563) | 1 | Not Automated → Automated |
| Report Suite | [C30569](https://shopview.testrail.io/index.php?/cases/view/30569) | 1 | Not Automated → Automated |
| Report Suite | [C30583](https://shopview.testrail.io/index.php?/cases/view/30583) | 1 | Not Automated → Automated |

**Note the ones that moved more than once.** [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) went **Not Automated → Automated → Not
Automated → Automated** and [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) went **Automated → Not Automated → Automated**. The flag is
something he actively manages, in both directions.

**[C38877](https://shopview.testrail.io/index.php?/cases/view/38877) is the one genuinely ambiguous case, and it is reported rather than resolved.** Its
**earliest** history entry is Vlad taking it **`3 → 1`**, which means it was already `3` before that —
possibly born that way from our own `add_case`, exactly like the Schedule 31. **We cannot tell.** But
his **most recent** deliberate act on it was setting it back to **Automated on 6 August**, so whatever
its origin, its current value is his decision and is left untouched.

---

## 4. Nothing belonging to another author was touched (Rule 38)

| | |
|---|---|
| Foreign cases carrying `custom_atmstatus = 3` | **12**, all Report Suite, all `created_by = 1` (Vladimir Tomovic) |
| Foreign cases carrying `custom_atmstatus` unset | **5**, all Filters, all `created_by = 7` (Ahtasham Amjad) — [C43576](https://shopview.testrail.io/index.php?/cases/view/43576), [C43577](https://shopview.testrail.io/index.php?/cases/view/43577), [C43578](https://shopview.testrail.io/index.php?/cases/view/43578), [C43579](https://shopview.testrail.io/index.php?/cases/view/43579), [C43580](https://shopview.testrail.io/index.php?/cases/view/43580) |
| **Written to by this pass** | **0 of either** |

---

## 5. Does the total match the figure that was expected?

**Yes — 31, exactly.** But it was **derived per case from history**, not reconciled to an expected
figure, and it would have been reported as 31 whatever the expectation was. Had the two disagreed, the
history would have won and the disagreement would be the headline of this section.

**What would make this list wrong, stated plainly:**

1. **The QA lead works in the TestRail UI under this same account (user 3).** If he ever set a flag by
   hand, it is indistinguishable from ours in the history. No such entry exists for any of the 31 —
   they have **no** `custom_atmstatus` entry at all — so this does not affect the result here, but it
   is the standing limitation of every user-attributed claim we make.
2. **TestRail history records changes, not the creation event.** "No entry" proves the value has not
   moved since creation; it does not itself prove what set it. That is why the `add_case`-hardcoding
   evidence in §1 is presented alongside it rather than instead of it.
3. **The flag is read as it stands today.** A case Vlad has since unmarked is not in the population at
   all, and one he marks tomorrow would change the answer.
