# Schedule — label diff, FINAL, 2026-08-11

**Build `v3.5-65d6500`** — last-mod Tue 11 Aug 2026 09:33:33 GMT, etag `3250d285ffcf50626363a578fe273071`,
`index.html` sha256 `9348ca09…`. **Sixth read, unchanged.**
**Location `Staging Heavy Duty - 9919`**, confirmed on screen before any observation was taken.
**Surfaces harvested: 34. Distinct build strings captured: 1,184.**

**This supersedes `build/schedule/build-viu-2026-08-11/LABEL-DIFF.md`**, which staged these 12 as
pending. **They are now pushed and byte-verified.**

---

## 1 · THE FINAL SPLIT

| | Before this pass | **After** |
|---|---|---|
| Cases carrying at least one quoted UI label | 57 | **57** |
| — labels **CONFIRMED correct** | 25 | **37** |
| — **NEEDING A CORRECTION** | **12** | **0** |
| — **PARTLY** checked (labels on a surface not yet reached) | **22** | **22** |
| Cases carrying **no quoted UI label** | 117 | **117** |
| **Total censused** | 174 | **174** |

**37 + 22 = 59 slots across 57 cases** (two cases fall in two buckets). **57 + 117 = 174.**

**⚠️ THE CENSUS COVERS 174, AND THE SUITE IS 176.** It predates **C43588** and **C43589**, created by
the staged push. Both were read for this file:
- **[C43589](https://shopview.testrail.io/index.php?/cases/view/43589)** uses **`View options`** — the
  **correct** build casing, checked against the harvest. **Confirmed, no correction needed.**
- **[C43588](https://shopview.testrail.io/index.php?/cases/view/43588)** describes the account menu in
  plain words and quotes no UI label. **Nothing for a label diff to check.**

**So: 0 outstanding label corrections across all 176 cases, and 22 cases still only partly checked.**

## 2 · THE 12 CORRECTIONS — PUSHED

All 12 verified against the harvest before writing, then byte-verified after. Full text in
`CHANGES-MADE.md`; per-op detail in `testrail-execution-log.md`.

| Wrong | **Build ships** | Cases |
|---|---|---|
| `View Options` | **`View options`** | C30042·C30046·C30047·C30050·C30051 |
| `Filter & Display` / `Filter and Display` | **`Filter & display`** | C30042·C29930·C30043·C30044·C30045·C30082 |
| `VIN` | **`VIN Number`** | C30042 |
| `Capacity Bars` | **`Capacity Planning`** | C30046 |
| `Saturday` / `Sunday` (the toggles) | **`Show Saturday`** / **`Show Sunday`** | C30046·C30051 |
| `working hours` (the quoted conflict reason) | **`business hours`** | C30025 |
| a closed *"and no other actions"* list | scope-conditional (Rule 42) | C30015 |

**Counted in the harvest:** `View Options` **0** · `View options` present · `Capacity Bars` **0** ·
`Capacity Planning` present · `working hours` **0** · `business hours` **65** · `Reassign` **0**.

## 3 · THE METHOD THAT MADE THE DIFFERENCE — pixels lie

> **`textContent` (raw markup) is immune to CSS `text-transform`; `innerText` is not.** These toolbar
> panels are **styled uppercase**, so the screen — and any `innerText` dump, and any screenshot —
> returns `FILTER & DISPLAY` and `VIEW OPTIONS`. **The raw text nodes read `Filter & display` and
> `View options`.** A screenshot would have produced the wrong answer on both.

> **⚠️ AND PREFER THE VISIBLE TEXT NODE OVER THE ACCESSIBLE NAME.** The toolbar button carries
> `aria-label="Filter and display options"`, so a naive containment check marks the five
> `Filter and Display` cases *"found in the build"* — **and they are, but only in a string no manual
> tester can ever see.** A label diff that does not prefer the visible string **will certify the wrong
> wording**.

## 4 · FALSE POSITIVES — flagged by our own sweep, DELIBERATELY NOT CHANGED

Recorded because a bogus correction costs more than a missed one.

| Flagged | Why it is NOT a defect |
|---|---|
| `N Lines` on C29964, C29973, C29992, C30011 | **Deliberate placeholder wording** — C29964 spells out *"with N = the line count"*. Rule 42 working as intended. |
| `View Day`, `New Shift` on C30054 | The case asserts their **ABSENCE**. A string search cannot tell an assertion from a negation. |
| `ZZAUTOTEST …` | Our own throwaway test-data names. Correctly absent from the build. |
| `Cancel` on C29967 | Asserts **ABSENCE**; and the only build match is lower-case `cancel`, a Material-icon **ligature**, not a button label. |
| `Filter and Display` "found" | Matches only the invisible **`aria-label`** — see §3. |

**C30054 is fully correct and now fully confirmed**, which settles a recorded spec defect: **the build
opens the cell menu on LEFT-click**, containing exactly `Create Event` and `New Work Order`, with no
`View Day` and no `New Shift`, and right-click adds **zero** strings. **§7 of the specification says
left-click while §14.1 and §14.2 twice say right-click — the build agrees with our case, and the
specification is wrong in two places.** A documentation defect for the PO, not a case change.

## 5 · STILL OWED — the 22 partly-checked, and the one thing that blocks each

**None of this is fixable by seeding**, and the seeding authorisation was never the constraint.

| Blocked labels | Cases | Blocker |
|---|---|---|
| `Change scope`, `Full estimate` | C29978·C29979·C29983·C29986 | Sit **past the confirm button** in the spread step — reaching them means committing a real shift. Permitted; **needs a session**. |
| `Reset To Template`, `Time Clock`, `Add hours`, `Set business hours for this shop`, `Set custom hours for this technician` | C38926·C30084·C38850·C38847·C38848·C38849 | The **Staff / Roles harness fault** — see `HARNESS-FIX.md`. |
| `Needs techs`, `Clear all`, `All / Unscheduled`, `Complete` | various | Need a filter active or a completed line seeded. **Needs a session.** |
| `Adjust` (C30014) | C30014 | **Searched the shift modal and NOT FOUND under any wording.** Not a label correction — a real open question. |

**`Schedule whole work order`, `Select multiple`, `Select all`, `Cancel` are NO LONGER blocked** — the
scope picker was reached on 11 August by dragging a **6-line** work order (the earlier failures all
dragged a **1-line** order, for which no picker is expected — the build was right and our tooling
report was wrong).

**Two label corrections are additionally OWED but NOT applied** — `Set working hours for this
technician` and `Add Hours` (capital H), visible in the QA lead's screenshots. **Not acted on because
a screenshot is not our live capture**; see `HARNESS-FIX.md`.

**The single blocker for all of it: a fresh sign-in.** Session is 401 `sso_required`.
