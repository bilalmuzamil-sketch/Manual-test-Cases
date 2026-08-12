# Schedule — divergences between what the sources ask for and what the build offers

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag `3250d285…` ·
`index.html` sha256 `9348ca09…` · read at **2026-08-12T06:15:15Z**.

A divergence is recorded here when a **precondition or a step** learned from the sources cannot be
carried out on this build. **Nothing here was silently rewritten to match the build**, and **no
expected behaviour was changed** — expectations still come only from the specification, the epic and
your recorded answers (Rule 57).

The test applied to each one: **would a reader of the source recognise what the build offers as the
same thing?** If yes it is cosmetic and is corrected. If no it is substantive, and the case keeps
what the source says.

---

## A · THE TEN BLOCKED PERMISSION CASES — I tried to unblock them myself, and I can tell you exactly why it cannot be done from here

**This section replaces the previous pass's "three role assignments would fix it".** That ask was
right about the goal and wrong about the mechanism, and the difference matters, so here is what
happened rather than a tidier version of it.

### What I did

Standing Rules 5, 14 and 26 authorise creating and assigning roles, and your standing instruction is
*"do whatever you want to do with data seeding/changing/editing in the QA branch."* So I did not wait.

A **staff-record** edit was off the table: it invalidates that user's session instantly (proven here
on 11 August, HTTP 409 *"Session has expired"*), and the Technician sign-in was one of only two this
estate has. So I used the lever that does **not** touch a staff record — I edited the **permission
atoms of the role the Technician already holds**, intending to walk it through each permission level,
drive the cases, and put the role back.

I validated the whole mechanism on a throwaway first: created **`ZZAUTOTEST probe`**, edited it, read
it back, deleted it, and confirmed it was gone — **estate clean, 12 roles before and after.**

### What happened, and it is the finding

| Step | Result |
|---|---|
| Edited the Technician role's permissions | **HTTP 200**, read back correctly |
| Re-read the Technician's own permissions **on the Technician session** | **HTTP 409 — "Session has expired."** |
| Restored the role to its exact baseline | done, **byte-identical, 10 fields compared, 0 mismatches** |
| Re-tested the Technician session after the restore | **still 409** |

**A ROLE-DEFINITION change invalidates the session of every user holding that role — not just a
staff-record edit.** And **it does not come back when you put the permissions back.** The
invalidation is one-way.

**So the thing needed to make these cases runnable is the same thing that destroys the session you
would run them with**, and this estate has no way to sign in again: `quick-login` and `switch-user`
are barred, and a newly created staff member needs invite confirmation before they can sign in.

**That cost the Technician session, and I am telling you plainly rather than burying it.** What it
bought is a precise ask in place of a vague one.

### What I now know that the previous ask did not

The 11 August pass already recorded *"finish ALL account configuration first, and only THEN sign in
and send the cookies"* — for **staff** edits. **It is now proven to be true of role edits as well**,
which is new, and it is why "just assign three roles" would not have worked even if someone had done
it: assigning them **after** minting the cookies would have killed those cookies too.

### The ask, stated so it cannot misfire

**Create three users, give them their permissions, and only then sign each one in and send the
cookies.** Configure first, mint second — in that order, or the cookies arrive dead.

| User | Permissions needed | Unblocks |
|---|---|---|
| 1 | **Schedule: View switched OFF** | [C30076](https://shopview.testrail.io/index.php?/cases/view/30076) · [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) leg 1 · [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) |
| 2 | **Schedule: Edit, but NOT Delete** | [C30077](https://shopview.testrail.io/index.php?/cases/view/30077) · [C30078](https://shopview.testrail.io/index.php?/cases/view/30078) · [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) leg 3 |
| 3 | **Schedule: View but WITHOUT Work Orders: View** | [C30081](https://shopview.testrail.io/index.php?/cases/view/30081) · [C30614](https://shopview.testrail.io/index.php?/cases/view/30614) · [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) |

**A fourth would help:** a **Schedule: Delete** holder who is not an administrator
([C30079](https://shopview.testrail.io/index.php?/cases/view/30079)).
[C30044](https://shopview.testrail.io/index.php?/cases/view/30044) needs a user with **no staff
record of their own** and [C30084](https://shopview.testrail.io/index.php?/cases/view/30084) needs
two staff differing only in the **`Time Clock`** setting — neither is a role assignment.

### Two product behaviours found while doing this, both worth keeping

**1 · The permission tiers are enforced server-side, and they cascade upward on save.** Asking for
`Schedule: Delete` alone came back with **`Schedule: Edit` and `Schedule: View` added automatically**.
That is the specification's `Delete ⊇ Edit ⊇ View` tier being enforced at the API, which is a **good**
finding — it is the behaviour several of the blocked cases exist to assert, observed from the other
side. **It is not a substitute for observing it in the UI**, and I am not recording it as one.

**2 · A save that silently does nothing, if you send the wrong field names.** `PUT /api/roles/{id}`
with snake_case field names returns **HTTP 200 and applies additions but silently ignores removals**.
The screen sends camelCase (`fePermissions`, `viewMode`, `crossToggles`), and with those exact names
the same call replaces the set correctly. **This is why the first restore attempt reported success and
changed nothing** — caught only because the read-back was compared field by field rather than trusting
the 200. **Not raised as a defect** (no user can send snake_case from the screen), but recorded,
because a 200 that does half the write is the kind of thing that costs somebody a day.

---

## B · SUBSTANTIVE — the control the source describes is not in the build

| Case | Source says | Build offers | Marked |
|---|---|---|---|
| [C43582](https://shopview.testrail.io/index.php?/cases/view/43582)–[C43587](https://shopview.testrail.io/index.php?/cases/view/43587) | a control to collapse the left work-order panel | **no such control.** The only panel-like control is `Hide the calendar`, which folds the month calendar *inside* the panel — a different thing | `HOLD - the panel button does not exist in this build` |
| [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) | a click alternative to dragging (§7, §11) | **removed between builds** — proven present 5 August, gone now | `READY - EXPECT FAIL`, [SV-8957](https://shopview.atlassian.net/browse/SV-8957) |

## C · COSMETIC — corrected so a tester is not stranded

Carried forward from the passes on this same build; each was a label the tester would have hunted for
and not found.

| Case | Case said | Build shows | When |
|---|---|---|---|
| [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) · [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) | `Set custom hours for this technician` | **`Set working hours for this technician`** | 12 Aug |
| [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) | `Add hours` | **`Add Hours`** | 12 Aug |
| [C30042](https://shopview.testrail.io/index.php?/cases/view/30042) +5 | `View Options` | **`View options`** | 11 Aug |
| [C30042](https://shopview.testrail.io/index.php?/cases/view/30042) +5 | `Filter & Display` | **`Filter & display`** | 11 Aug |
| [C30042](https://shopview.testrail.io/index.php?/cases/view/30042) | `VIN` | **`VIN Number`** | 11 Aug |
| [C30046](https://shopview.testrail.io/index.php?/cases/view/30046) | `Capacity Bars` | **`Capacity Planning`** | 11 Aug |
| [C30059](https://shopview.testrail.io/index.php?/cases/view/30059) | step 1 scope `this and everything after` | **`This and all later shifts`** | 12 Aug |
| [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) | `Reset To Template` on the role's three-dot menu | **no such menu item** — the control is `Reset to template` on the role's own edit screen | 12 Aug |

**C38926 was not cosmetic in effect.** A tester following the old step would have opened the menu,
found nothing, and been stuck — on the case whose whole purpose is to reset roles before permission
testing.

## D · RAISED, DELIBERATELY NOT EDITED — an expected result is not ours to change

[C30061](https://shopview.testrail.io/index.php?/cases/view/30061)'s **expected result** names the
scope options as `this and after`, `this only`, `whole series`. The build shows **`This and all later
shifts`**, **`This shift only`**, **`Entire series (8 shifts)`**.

Recognisably the same three options, so nobody is stranded — which is exactly why it was left alone
while C30059's **step** was corrected. A step sends a tester hunting; an expected result does not.
**One word from you and it is a two-minute change.**

---

*Sections E and F — the per-case runnability walk of this pass — are in `RUNNABILITY.md`.*

---

# E · FOUND BY THE RUNNABILITY WALK, 2026-08-12

Both were found by carrying out steps, not by reading text, and **neither has been rewritten.** The
cases keep what the sources say; the build's disagreement is recorded here (Rule 57).

**No ticket has been raised for either — the creation hold is active** (Standing Rule 62 and the
2026-08-10 ruling *"Do not create anything until my next order."*). Both are written up ready to file.

## E1 · The sidebar filter panel offers no Priority group, and no group headings at all

| | |
|---|---|
| **Cases** | [C29942](https://shopview.testrail.io/index.php?/cases/view/29942) · [C29945](https://shopview.testrail.io/index.php?/cases/view/29945) · touches [C29943](https://shopview.testrail.io/index.php?/cases/view/29943) |
| **Source** | `SV-8687 (§5.1)` — C29942 expects *"three groups: Assignment (Assigned, Unassigned), Status (…), and Priority (High, Medium, Low)"*; C29945 expects *"The Priority group offers High, Medium, and Low."* |
| **Build** | the panel's entire text is **`FILTERS · Clear all · Unassigned 22 · Assigned 71 · Approved 92 · Declined 0 · In Progress 0 · Ready for Review 1`** |

**There is no `Priority` group, no `High` / `Medium` / `Low`, and no `Assignment` or `Status`
heading** — the options are a single flat list. Read from the panel's own full text on three separate
runs, so it is not a scroll or a truncation artefact.

**C29945 cannot be run at all as written** — its step 2 says *"Choose High under Priority"*, and there
is nothing to choose. **C29942's group-structure assertion fails on the same evidence.**

**Recommendation: one Story Defect against `SV-8687`, priority Medium** (Rules 52/53), when the hold
lifts. **Markers deliberately unchanged** — `AUTOMATION: READY` asserts *automatable*, not *passing*,
and turning them into `EXPECT FAIL` needs a ticket number that cannot exist yet.

## E2 · No Unassigned lane appears in the grid, in a week that contains three unassigned shifts

| | |
|---|---|
| **Case** | [C29931](https://shopview.testrail.io/index.php?/cases/view/29931) |
| **Source** | `SV-8686 (§3.2, §4.2)` — *"An unassigned row/lane appears within the grid itself… Shifts without a technician sit in this row."* |
| **Build** | **all 30 lane labels read, none matches `unassigned`, and the word does not occur anywhere in the grid's text** |

**The precondition was proven to hold before the absence was recorded**, which is the part that makes
this worth reading: querying the board across June–November found **8 shifts with no technician**, and
**three of them fall inside the week on screen** — 10, 11 and 13 August, against work orders S-13014
and S-12876, while the grid showed `Aug 10 – 16, 2026`.

**So the shifts exist, they are in view, and no lane holds them.** Whether they render somewhere else
or not at all is not established, and I have not guessed.

**My first attempt at this reported the same absence for the wrong reason** — it compared only the
first 22 of 30 lane labels. **That would have been a right answer built on a broken check**, which is
worth as much of a warning as a wrong one.

**Recommendation: one Story Defect against `SV-8686`, priority Medium**, when the hold lifts.

## E3 · One result that flattered us, checked hardest, and survived

[C43554](https://shopview.testrail.io/index.php?/cases/view/43554) asserts the module opens on **Day**
view. [SV-8863](https://shopview.atlassian.net/browse/SV-8863) says it opened on Week.

**On this build it opens on Day** — in a browser context that had never touched the view control,
navigating in from Work Orders and reading the toggle before anything else:
`Day pressed="true" · Week "false" · Month "false"`, range `Wed, Aug 12`.

**I nearly withdrew this as confounded**, because an earlier probe in the session had switched the
view. What settled it: **every probe records its non-GET calls and all of them read `[]`**, so the view
is not persisted server-side, and each run launches a fresh browser. **The confound could not reach
across runs.**

**So SV-8863's symptom does not reproduce on `v3.5-65d6500`.** Under Rule 61 that is an outcome-3
report — **the ticket is worth re-reading before release**, and it is not ours to close.
