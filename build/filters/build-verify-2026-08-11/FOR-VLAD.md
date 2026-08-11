# Automated cases changed — for Vlad

**Standing Rule 65: a change to a case TestRail flags Automated obliges us to tell Vlad so he can
adjust the automation.**

## Four Filters cases carry `custom_atmstatus = 3` (Automated)

[C29600](https://shopview.testrail.io/index.php?/cases/view/29600) ·
[C29614](https://shopview.testrail.io/index.php?/cases/view/29614) ·
[C29623](https://shopview.testrail.io/index.php?/cases/view/29623) ·
[C38877](https://shopview.testrail.io/index.php?/cases/view/38877)

## ONE of them was changed this pass

### [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) — *Mobile: tapping Apply filters applies the statuses and updates the count*

**What changed: one string, twice. Nothing else.**

| Field | Was | Now |
|---|---|---|
| Steps, item 3 | `Tap the 'Apply filters' button.` | `Tap the 'Apply Filters' button.` |
| Expected, item 2 | `After 'Apply filters' the sheet closes and the work order list shows only the ticked statuses.` | `After 'Apply Filters' the sheet closes and the work order list shows only the ticked statuses.` |

**Why:** the button's visible label on the running build is **`Apply Filters`** with a capital F on
both words. Read live at 390 × 844 on build `v3.6-3e9dd6d`:

```
mobile_all_filters_sheet = "All Filters | close | Status | … | Asset on Site | Apply Filters"
apply_filters            = "Apply Filters"
```

**What this means for the automation, in practice:**

- **If the locator is `data-test-id="apply_filters"` — nothing to do.** That attribute is unchanged
  and is the stable hook.
- **If the locator matches on visible text `Apply filters`** — it was already matching the wrong
  string against this build and would have been failing or falling back to a loose match. The correct
  text is now `Apply Filters`.

**The assertion did not move.** The case still asserts that the sheet closes and the list narrows only
after the button is tapped — that is spec v19 S12-R6 and it is untouched. Only the button's name
changed, to what the screen actually says.

**Also worth knowing, though it is not a change to your case:** the case's own Rule-61 symptom block
still stands — a *single* filter's own sheet applies immediately rather than deferring
([SV-8875](https://shopview.atlassian.net/browse/SV-8875)). The *combined* All Filters sheet, which is
what C29623 drives, does defer correctly.

## The other three Automated cases were NOT touched

[C29600](https://shopview.testrail.io/index.php?/cases/view/29600),
[C29614](https://shopview.testrail.io/index.php?/cases/view/29614) and
[C38877](https://shopview.testrail.io/index.php?/cases/view/38877) are **byte-identical** before and
after this pass — every field, `updated_on` and `updated_by` included.

## The `Apply Filters` change also lands on five non-automated siblings

If any of these are on your list to automate later, they now use the same corrected label:
[C29622](https://shopview.testrail.io/index.php?/cases/view/29622),
[C29624](https://shopview.testrail.io/index.php?/cases/view/29624),
[C29625](https://shopview.testrail.io/index.php?/cases/view/29625),
[C29626](https://shopview.testrail.io/index.php?/cases/view/29626),
[C29627](https://shopview.testrail.io/index.php?/cases/view/29627).
