# UI BUILD-VERIFICATION — done, on the V2 QA branch

**Date:** 2026-09-14 · **Branch:** `sv9160.qa.shopview.com` · **Driven with:** headless Chromium via
the documented MITM bridge (`build/testing-tools/staging-bridge.mjs`) + boot2-style SPA hydration
(quick-login payload + `fe_permissions_wrapper` into localStorage). This is the step I previously said
was not needed, then corrected myself on. **It is now done.**

## VERDICT: the suite is executable. Global search works and the cases can be run.

| Check | Result |
|---|---|
| Sign in to the QA branch | ✅ lands on `/workorders` |
| Header control opens global search | ✅ it is a **BUTTON**, `data-test-id="global_search_trigger"`, labelled *"Search customers, work orders, pa…"* — **not a typeable field as in V1** |
| Keyboard shortcut | ✅ **`Ctrl+k` opens the modal** |
| Modal renders | ✅ centred modal: input, scope tab strip, grouped results |
| Scope tabs | ✅ All · Work orders · Customers · Assets · Parts · Vendors · Part sales · Purchase orders · Vendor invoices — **each with its own count** |
| Group headings with counts | ✅ e.g. `Work orders (4)`, `Customers (7)`, `Assets (1)`, `Parts (0)` |
| Accessibility announcement | ✅ *"12 results found across 3 categories"* |
| Esc closes | ✅ |
| Seeded data visible in the UI | ✅ all four seeded work orders `S9160-17580…17583`, the seeded customer with its address line, the seeded asset, and `Contact match` labels on customers |

## ⚠️ A FALSE DEFECT I ALMOST REPORTED — recorded so nobody repeats it
My first automated pass reported **"Ctrl+K does not open global search"**. That was **wrong and was my
own test artifact**: Playwright's `Control+K` (capital K) sends Ctrl+**Shift**+K, which the app
correctly ignores because it listens for `e.key === 'k'`. Sending `Control+k` opens the modal every
time. **The shortcut works.** Had I reported it, the team would have chased a non-bug — and existing
cases C45156 and C44804 would have been wrongly failed.

## WHAT THIS CHANGED IN THE CASES

### 1. All 19 preconditions rewritten with the real V2 surface
They previously described V1's header search field. They now describe what a tester actually sees:
the trigger is a **button**, the search opens as a **centred modal**, there is a **scope tab strip
with counts**, group headings carry counts, **Esc closes**, and — a detail that would otherwise cause
mismatches — **group headings are SENTENCE case in the build** (`Work orders`, `Part sales`), not the
Title Case used in older case text. They also now tell the tester to click an entity's **scope tab**
to confirm a genuine zero rather than scrolling a long list.

### 2. C53589 rewritten — it could not have passed
Old title: *"The search box shows a loading state until results are ready."* That was a faithful V1
behaviour (V1 pre-loaded the entire searchable collection, so it had to disable the input and show
"Loading…"). **V2 has no such state and cannot have one** — the modal opens instantly and queries the
server per keystroke (PRD §8, 150 ms debounce). The case would have failed for the wrong reason.

New title: **"Typing is never lost while search results are loading."** It tests the risk the V1
behaviour actually protected against — a race between fast typing and in-flight responses leaving the
user looking at results for a query they no longer have. The full rationale is written into the case.

### 3. Everything else stands
The other 18 cases' steps and expectations survive contact with the real build: groups, counts,
navigation and the seeded data all behave as the cases assume.

## Still true from the earlier API pass
The identifier-matching signals (unit number, full VIN, part number, vendor email not returning their
records) were observed through the API and are **unchanged by this UI pass** — the UI calls the same
`/api/search`. Confirm them during execution.
