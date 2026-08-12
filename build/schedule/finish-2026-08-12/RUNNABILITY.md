# Schedule — the runnability walk: can a tester pick this up tomorrow and run it?

**Build `v3.5-65d6500`** · last-mod Tue 11 Aug 2026 09:33:33 GMT · etag `3250d285…` ·
`index.html` sha256 `9348ca09…` · **read at 2026-08-12T06:15:15Z, unmoved all pass.**

The five checks the QA lead asked for, per case: **is the precondition reachable · does the
navigation path exist · is each control where the step says it is · do the steps work in the order
written · are the labels the ones on screen.**

---

## 1 · THE HONEST NUMBER FIRST

**Cases whose every step was actually carried out on this build: 7 this pass**, on top of the **28**
recorded by earlier passes on this same build marker — **at most 35 of 176, and at least 33**, because
I cannot rule out that one or two of my seven were also among the earlier "dialog pass" fourteen.

**The other ~141 have had their LABELS checked against a live harvest of this build.** That is worth
something and it is not the same claim, so it is reported separately and never added into the walked
figure.

| | |
|---|---|
| Steps actually carried out, this pass | **7** — C29941, C29944, C29946, C30008, C30037, C30042, C30046 |
| Steps partly carried out | **2** — C30015 (steps 1–2 of 3), C30047 (before-state not measured) |
| Labels checked against the live build | **176 of 176** |
| Cases quoting no build label at all | **127** — nothing to check; their steps are prose |
| Cases where every quoted label resolved | **44 of the remaining 49** |
| Cases with a label that did NOT resolve | **5**, all accounted for below |

## 2 · WHAT WAS DRIVEN, STEP BY STEP

Per-step evidence: `evidence/walk.json`; screenshots `evidence/w-*.png`.

| Case | Outcome |
|---|---|
| [C29941](https://shopview.testrail.io/index.php?/cases/view/29941) | typing `zzzxq999` emptied the list — **`No schedulable work orders match this filter.`** — and clearing it brought 21 cards back. **Runnable as written.** |
| [C29944](https://shopview.testrail.io/index.php?/cases/view/29944) | all three steps carried out; the panel opened, `Approved 92` was chosen. **See the observation in §4 — the count did not move, and I am not calling that a defect.** |
| [C29946](https://shopview.testrail.io/index.php?/cases/view/29946) | **`Clear all` exists and clicks** — and it appears **only once a filter is active**, which is worth knowing before hunting for it. **Runnable as written.** |
| [C30008](https://shopview.testrail.io/index.php?/cases/view/30008) | shift block → modal; identity section reads `Pamill Paving · Approved · S-12876 · 713 · 3HAEUMMP1NL291283`, so **the VIN is shown with the grid toggle off**, which is what the case asserts. **Runnable as written.** |
| [C30037](https://shopview.testrail.io/index.php?/cases/view/30037) | all four steps: moving across quickly produced **0 tooltips**; resting produced one; leaving dismissed it; clicking opened the modal. **Runnable as written, and the assertion holds.** |
| [C30042](https://shopview.testrail.io/index.php?/cases/view/30042) | dropdown opened and read: **`Service`, `Work order status`, `Service/Parts`, `My Shifts`, `VIN Number`** under the `FILTER & DISPLAY` heading. **Runnable as written.** |
| [C30046](https://shopview.testrail.io/index.php?/cases/view/30046) | menu reads **`Business Hours`, `Tech Hours`, `Capacity Planning`, `Events`, `Show Saturday`, `Show Sunday`**; Capacity Planning off → capacity bars **1 → 0 → 1**; Events off → event blocks **2 → 0 → 2**. **Both toggles were put back.** **Runnable as written.** |
| [C30015](https://shopview.testrail.io/index.php?/cases/view/30015) | steps 1–2 done and **the assertion is confirmed — there is no `Reassign` anywhere in the modal.** **Step 3 deliberately not driven** (see §5). |
| [C30047](https://shopview.testrail.io/index.php?/cases/view/30047) | the toggle exists and turning it on left **11 out-of-hours marked elements** visible. **The OFF state was not measured first**, so the before/after comparison the case asks for is not proven. Toggle restored. |

## 3 · LABELS RESOLVED THIS PASS THAT WERE PREVIOUSLY UNRESOLVED

Each read from a **visible** string on this build — computed style checked, never an `aria-label`.

| Label | Where it really lives | Cases it unblocks |
|---|---|---|
| **`Create Event`** and **`New Work Order`** | the **left-click** menu on empty grid space. Header reads e.g. `LARRY COLLINS · WED, AUG 12 · 06:45`. **Right-click does nothing**, which matches the cases saying *left-click* | C30016 · C30018 · C38855 · C30017 · C30077 |
| **`Set working hours for this technician`** · **`Add Hours`** | the **Edit Staff Member** dialog, under a `TECHNICIAN HOURS` heading | C38848 · C38849 · C38850 |
| **`Clear all`** | the sidebar `FILTERS` panel — **only when a filter is applied** | C29946 |
| **`+N more`** | confirmed as the real pattern; the build renders **`+1 more`** | C29998 |
| **`View Permissions`** | the roles-list three-dot menu — **and it is the ONLY item there**, which independently re-confirms the C38926 correction | C38926 |
| **no `Reassign`** | confirmed absent from the shift modal | C30015 |

**A false absence I caught before recording it.** Three earlier attempts reported the cell menu as not
opening. The lanes I was clicking are **199 px wide — the technician label column**, not the time grid.
Clicking at 35 %, 55 % and 80 % of the calendar width opened the menu **every time**. **The lesson from
this project's own notes held: prove the state a control should appear in before recording it absent.**

## 4 · ONE OBSERVATION, DELIBERATELY NOT CALLED A DEFECT

**C29944** — choosing the `Approved` status left the sidebar count at **21 cards before and after**.
That is **not** evidence of a broken filter: the sidebar holds overwhelmingly Approved work orders
already, and it renders a virtualised window rather than the whole list, so an unchanged count is the
expected result of filtering a list that was already almost entirely in that status. **Confirming it
either way needs a status the list actually mixes**, which is a seeding job, not a reading job.
**Recorded so nobody re-derives it from scratch; not a verdict.**

## 5 · WHAT I DID NOT DRIVE, AND WHY

| Not driven | Reason |
|---|---|
| **C30015 step 3** — "click Delete on a series shift and cancel" | deliberately not pressed. A probe pressed that control earlier today and destroyed a shift, because a **non-series** shift shows no confirmation. See `INCIDENT-shift-delete-2026-08-12.md`. **The case's own step is a hazard for a manual tester too** — see §6. |
| **`Set business hours for this shop`** (C38847) | the Edit Location screen was not reached — my click landed on the profile menu. **Not reached, NOT recorded as absent.** |
| **`Reset to template`** on a role's own screen (C38926) | the roles-list row click did not navigate. The case already carries the corrected note that the three-dot menu does not offer it, and **that half is re-confirmed**. |
| The **scope-picker / spread** labels — `Full estimate`, `1 week`, `2 weeks`, `Until a date…`, `Specific hours…`, `Change scope`, `Schedule whole work order`, `Select all`, `how much to schedule` | these appear only during a **drag-create**, which our tooling cannot perform and whose click alternative was removed from the build ([SV-8957](https://shopview.atlassian.net/browse/SV-8957)). This is the known held cluster, unchanged. |
| Seeded data names — `zzzxq999`, `ZZAUTOTEST stand-up`, `ZZAUTOTEST note`, `ZZAUTOTEST Rush` | **not build labels.** They are values the case tells the tester to type. Correctly unresolved, and not divergences. |

## 6 · A HAZARD IN OUR OWN CASE TEXT, WORTH ONE MINUTE OF YOUR TIME

**C30015 step 3 tells a manual tester to "Click Delete … and read what it asks (cancel without
deleting)".** On a **series** shift that is safe — a scope dialog appears. On a **non-series** shift
**there is no dialog at all and the shift is gone on the first click.** Two workers have destroyed a
shift on this branch in two days doing exactly that.

The step already says *"on a series shift"*, so it is not wrong — but a tester who picks the wrong
block loses data. **I have not changed it**: adding a warning is a wording decision on a case whose
purpose is that assertion, and it is yours to make. **One sentence would do it** — *"make sure the
block you pick is part of a series; a single shift deletes immediately with no confirmation."*

---

# BATCH 2 — navigation, grid structure, mini calendar, sidebar

**12 more cases had every step carried out; 3 more partly.** Per-step evidence: `evidence/walk2.json`.
Zero write calls (`evidence/walk2-meta.json`).

| Case | Outcome |
|---|---|
| [C29925](https://shopview.testrail.io/index.php?/cases/view/29925) | nav reads `Work Orders · Schedule · Customers · Parts · Reports`; clicking Schedule lands on `/schedule` with **both regions visible**. **Runnable as written.** |
| [C29927](https://shopview.testrail.io/index.php?/cases/view/29927) | Day → **`Wed, Aug 12`**; Week → **`Aug 10 – 16, 2026`**; Month → **`August 2026`**. **Runnable as written.** |
| [C29928](https://shopview.testrail.io/index.php?/cases/view/29928) | 30 lanes; group headers **`WORK ORDER STATUS`**, **`SERVICE/PARTS`** sit above their technicians. **Runnable as written.** |
| [C29930](https://shopview.testrail.io/index.php?/cases/view/29930) | no control anywhere in the toolbar mentions tech/department grouping — **the case's assertion is confirmed, not merely uncontradicted.** |
| [C29932](https://shopview.testrail.io/index.php?/cases/view/29932) | clicking 4 Sep in the mini calendar moved the grid **`Aug 10 – 16, 2026` → `Aug 31 – Sep 6, 2026`**. **Runnable as written.** |
| [C29934](https://shopview.testrail.io/index.php?/cases/view/29934) | the chevron took visible day cells **42 → 0 → 42**. **Runnable as written.** |
| [C29936](https://shopview.testrail.io/index.php?/cases/view/29936) | 21 cards, **no tabs above the list** — assertion confirmed. |
| [C29937](https://shopview.testrail.io/index.php?/cases/view/29937) | card reads `S8685-12876 · 1 line · 1h Est. · Pamill Paving · 713 · AC Alicia Campbell · Approved`, and its **computed left border is `rgb(37, 124, 255)` at `4px`** — the status colour, read from computed style. |
| [C29940](https://shopview.testrail.io/index.php?/cases/view/29940) | typing `G`, `o`, `p` one character at a time took the list **21 → 5 → 1** with no Enter pressed. **Real-time filtering confirmed.** |
| [C29942](https://shopview.testrail.io/index.php?/cases/view/29942) | panel opened and read. **See §7 — the badge half is inconclusive and is not called either way.** |
| [C29931](https://shopview.testrail.io/index.php?/cases/view/29931) | **See §7 — no Unassigned lane was visible, and that is NOT a deviation on this evidence.** |
| [C43554](https://shopview.testrail.io/index.php?/cases/view/43554) | **See §7 — the result is confounded by my own earlier probe and must not be read as a fix.** |
| [C29933](https://shopview.testrail.io/index.php?/cases/view/29933) · [C29948](https://shopview.testrail.io/index.php?/cases/view/29948) · [C29954](https://shopview.testrail.io/index.php?/cases/view/29954) | first steps carried out; later steps not driven. The drill-down chips read **`All 1`** and **`Unscheduled 0`**, and its header reads `S8685-12876 · 1 line · Pamill Paving`. |

## 7 · THREE RESULTS I WILL NOT DRESS UP

**C43554 — the default-view result is CONFOUNDED, and it would have been an attractive false positive.**
On arrival `Day` carried `aria-pressed="true"`, which is exactly what the case asserts and would
suggest [SV-8863](https://shopview.atlassian.net/browse/SV-8863) is fixed. **It establishes nothing**,
because **an earlier probe in this same session left the view on Day** (C30047 switches to day view),
and the view may be remembered per user. **A clean answer needs a session that has never touched the
view control.** Reported as unresolved rather than as good news.

**C29931 — no lane labelled `Unassigned` was visible among 30, and that is not a deviation.** The case
asserts an unassigned row sits inside the grid. **A lane for unassigned work may only render when an
unassigned shift exists in the visible range**, and I did not establish that one did. **Proving it
either way means seeding a shift with no technician** — which is now cheap, since data need not be
restored. **One probe away, and worth doing before release.**

**C29942 — the active-filter badge is inconclusive.** After applying a filter the button still read
`filter_list Filters` with no number, but the click landed on a container rather than a single option,
so **I cannot say a filter was actually applied.** The same assertion appears in C29946's expected
result. **Both need one clean re-drive**, and neither is called either way here.
