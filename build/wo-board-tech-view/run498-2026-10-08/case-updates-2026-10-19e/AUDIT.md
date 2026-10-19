# C368167 step 2 — 19 Oct 2026 (QA lead: "Correct it the way it needs to be make sure the test stay runnable for a lay man and a manual QA tester")
| Case | Automated | Field | Change | Write | Served page |
|---|---|---|---|---|---|
| C368167 | YES (QA lead said no need to tell Vlad) | custom_steps | step 2: wait for the invoice on the Finance tab (INV-…); leave a New Customer Payment window open IF one opens; on the current build (c850386) none opens, so go on | 200, read-back equal, untouched equal, flags equal | fr-view, clean (after) |
Why: on staging v26.40.19-c850386 Create Invoice no longer opens the payment window (L0462). Expected results unchanged.
