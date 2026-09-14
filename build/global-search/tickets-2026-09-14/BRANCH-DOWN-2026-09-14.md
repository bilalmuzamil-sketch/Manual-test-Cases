# The sv9160 QA branch is down — 14 September 2026

**Not a product finding. Not my access. The environment.**

## What is proved

| Host | Through the same bridge, same minute |
|---|---|
| `app.shopview.com` (production) | **HTTP 200** — the positive control: bridge, proxy and certificates are fine |
| `sv9160.qa.shopview.com` | **HTTP 502** |
| `sv9160api.qa.shopview.com` | **HTTP 503** |

A working production request through the identical path rules out my bridge, my certificates and my
credentials. The branch and its API are returning gateway errors.

## Timeline

| Time (UTC) | What was seen |
|---|---|
| ~11:00–11:10 | Search **working**. Queries returned up to 61 results; the eight filed tickets' zeros were captured here, alongside controls returning 10, 14 and 61 — so those zeros are real |
| ~11:46–11:58 | Search modal showing **"Search unavailable — Retry"** with an error toast. Six queries, three retries each, nothing recorded |
| ~12:24–12:30 | Branch **502**, API **503**. Sign-in cannot complete: the quick-login route reports no DEV MODE button, which is a symptom of the branch being down, not of a bad token |

The API was already degrading while the modal said "Search unavailable"; it has since failed outright.

## Re-checked 13:18 UTC — still down

| Host | 12:30 | 13:18 |
|---|---|---|
| `app.shopview.com` (control) | 200 | **200** |
| `sv9160.qa.shopview.com` | 502 | **502** |
| `sv9160api.qa.shopview.com` | 503 | **502** |

**The branch has now been unusable for roughly 90 minutes** — since about 11:46 when the search modal
first said "Search unavailable", and hard gateway errors since about 12:24. Production answers
normally throughout, on the same connection, so this is the branch and not the route to it.

## What this does and does not affect

- **The eight Story Defects already filed are unaffected.** Their evidence was captured while search
  was demonstrably working, with controls returning results in the same session. They will still be
  re-confirmed when the cases are run.
- **The QA lead's five findings cannot be evidenced yet.** They need screenshots of a scope tab showing
  "No results" beside a count of 1, and nothing can be screenshotted on a branch returning 502.
  **Nothing will be filed from a zero taken during an outage** — an outage is indistinguishable from a
  clean negative (learning L0080).
- **Nothing here is a defect against Global Search.** A branch being down is an environment fact.

## What happens next

**The four findings the QA lead reported are no longer waiting on the branch** — he supplied a screen
recording, and they were filed from it as SV-10014, SV-10015, SV-10016 and SV-10017 (see
`FILED-TAB-DEFECTS.md`). So the outage now blocks only:

1. **Re-checking C3** — whether a mid-word fragment still finds a customer. Unresolved either way.
2. **The unit-number search** (`ZZT-4471`), which is not among the QA lead's four and has no evidence.
3. **Running the 58-case regression suite**, which was already waiting for the quota reset.
4. **Re-confirming the eight filed Story Defects** while running those cases.

A check-in is re-armed. Nothing will be filed from a zero taken while the branch is in this state.
