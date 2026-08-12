# Filters — changes made, 2026-08-12

**One case changed. Nothing else in TestRail, Jira, run 352 or the environment.**

## [C43590](https://shopview.testrail.io/index.php?/cases/view/43590) — precondition and one step

**Why:** the precondition named **Parts → Part Sales** as the example of a page whose filter bar shows
only ONE filter button. Measured live on `v3.6-3e9dd6d`, Part Sales shows **zero** filter chips and no
filter bar at all, while **Reports → Technician Efficiency** shows exactly one (`filter_chip_range`,
*"Date : This month"*) with `toggle_filter_bar` absent from the DOM. The old escape hatch only
anticipated *"two or more"* filter buttons, so a tester would have found a third state it did not
cover and marked a runnable test BLOCKED.

**Category: COSMETIC** — a one-filter page exists and behaves as the case expects; only the example
was stale.

### `custom_preconds`

**Before:**
> 2. You can reach a page whose filter bar shows only ONE filter button. On the build the developers were working on, Parts then Part Sales was such a page: its filter bar showed only Status.
> 3. If every page you can reach shows two or more filter buttons, mark this test BLOCKED and say which pages you checked - do not mark it failed.

**After:**
> 2. You can reach a page whose filter bar shows only ONE filter button. On the build tested, Reports then Technician Efficiency was such a page: its filter bar showed only the Date button. (An earlier build had Parts then Part Sales as the example; that page now shows no filter bar at all, so use Technician Efficiency.)
> 3. If every page you can reach shows either no filter bar at all, or two or more filter buttons, mark this test BLOCKED and say which pages you checked - do not mark it failed.

### `custom_steps`, step 3

**Before:** *"Look along the whole toolbar row - where the Search control and the page's main button sit - for the small control that hides and shows the filter bar."*

**After:** *"Look along the whole toolbar row at the top of the table - including where a Search control or the page's main button would sit - for the small control that hides and shows the filter bar."*

Technician Efficiency has neither a Search control nor a main button, and the old wording presupposed
both.

### Not changed

`custom_expected` was sent **byte-identical** (all three text fields must go on every payload or
TestRail re-renders the omitted ones). `title`, `refs`, `section_id` and `custom_atmstatus` untouched.
**No re-stamp was needed** — its Rule-54 sentence 2 already reads *"Last checked against build
v3.6-3e9dd6d on 12 August 2026."*

---

## Deliberately NOT changed

| Case | Why |
|---|---|
| [C38897](https://shopview.testrail.io/index.php?/cases/view/38897) | The build fails a documented requirement. Under Rule 57 the case keeps its expectation; the tester will FAIL it, which is the correct outcome. Adding a hold or a marker would **disarm a case that is working**. Raised instead. |
| [C38889](https://shopview.testrail.io/index.php?/cases/view/38889) | Its own note already describes exactly what the build does, and it carries `EXPECT FAIL (SV-8912)`. Confirmed unchanged. Nothing owed. |
| [C38891](https://shopview.testrail.io/index.php?/cases/view/38891) | Two of ~42 surface names are stale. Fixing two would make the case look freshly verified while forty stayed unchecked — the same reasoning two prior passes recorded. |
| The other 113 | Not examined by this pass, or examined and found accurate. **A case not walked was not changed.** |

## Environment

**Nothing created, nothing deleted, no role, staff record or setting touched** — the brief bars those
on this branch because such an edit destroys the session of every holder.

The only state this session left was on the **admin** account's own saved page filters, from driving
the filter chips: an `Asset on Site : No` selection and a throwaway search term. **Both were cleared**
(`filter-bar-survey.json`, `cleanup` block: the chips read plain afterwards). It could not have
affected the tester in any case — saved filters are per user, proven this session by the two
identities returning **different** `work-orders-list` preferences, and the tester is user 7.
