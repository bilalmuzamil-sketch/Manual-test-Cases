# For Vladimir Tomovic — Automated cases changed on 2026-08-31 (Rule 65)

**Vlad — four cases you have flagged Automated in TestRail were edited today.** Standing rule: you get told whenever that happens.

**Authorised by Bilal Muzamil (QA lead) on 2026-08-31**, per case, after each was build verified. `custom_atmstatus` is **unchanged (still 3 = Automated)** on all four — the flag was never touched.

**What changed in each case, and nothing else:**

1. The automation marker was lifted from `AUTOMATION: Not available on Build to test Yet` to **`AUTOMATION: READY`** — each case now passes all five runnability checks on QA branch **sv8218**, build `v26.35.5-8c3cc21`.
2. A build-check sentence was added: *"Last checked against build v26.35.5-8c3cc21 on 8/31/2026."*
3. The three text fields were re-saved as plain text so they **display correctly**. Before today they showed raw `<ol><li>` markup on screen to anyone who opened them.

**What did NOT change:** the expected behaviour, the source/provenance line (carried byte-for-byte and verified unaltered), the title, the section, the references, and the Automated flag.

| Case | Title | Link |
|---|---|---|
| C44919 | Authorizer is selected in the work order customer contact card | [https://shopview.testrail.io/index.php?/cases/view/44919](https://shopview.testrail.io/index.php?/cases/view/44919) |
| C44920 | Authorizer is optional and can be cleared with 'No authorizer' | [https://shopview.testrail.io/index.php?/cases/view/44920](https://shopview.testrail.io/index.php?/cases/view/44920) |
| C44921 | Authorizer's phone shows below the name when the contact has one | [https://shopview.testrail.io/index.php?/cases/view/44921](https://shopview.testrail.io/index.php?/cases/view/44921) |
| C44922 | Authorizer is locked once the work order is invoiced | [https://shopview.testrail.io/index.php?/cases/view/44922](https://shopview.testrail.io/index.php?/cases/view/44922) |

**Why these four were verifiable today when they were not before:** they all turn on the label **"Approves Work"**, which I had wrongly reported as absent from the build. It is `input_checkbox_is_authorizer` on the customer's **Edit Contact** dialog — exactly where the specification says it lives. Nothing had opened that screen.

The Authorizer lock (C44922) was confirmed directly: on a **paid** work order the authorizer control renders with `pointer-events: none` and its picker offers 0 options; on an **estimate** work order the same control opens with 2 options. Evidence: `build/invoice-ui-refresh/build-verify-2026-08-31/authorizer-probe.json`.

**One caveat worth your time:** "build verified" here means **runnable**, not passing. A tester or a script can execute every step and find every control and label. Whether the document is *correct* is test execution, which has not run — TestRail run **R417** still has 0 graded results.

*Per-case audit log: `TESTRAIL-EXECUTION-LOG-markers-2026-08-31.md`. Generated 2026-08-31.*
