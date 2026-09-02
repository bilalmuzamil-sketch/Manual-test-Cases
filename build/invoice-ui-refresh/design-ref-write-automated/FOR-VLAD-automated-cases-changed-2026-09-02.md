# FOR VLAD — Automated cases changed on 2026-09-02 (Standing Rule 65)

Rule 65: when we change a case TestRail's own **Automated** flag is on (`custom_atmstatus = 3`), Vlad
is told so he can adjust his automation. This is that notice, for the **Invoice UI Refresh** suite.

**Authorisation:** the QA lead, 2026-09-02, verbatim: *"Go ahead with that too but after completing
everything else."* — in answer to a report naming these exact five cases. Register row **INV-DEV-3**.
The pass ran last, as he asked, after the other 84 were written and checked.

## What changed, and it is one sentence

Each case gained a **design reference** at the end of its provenance block — the link to the binding
Design Document plus **where in it** the case can be found. Nothing else moved.

| Case | Title | Automated flag | Link |
|---|---|---|---|
| **C44919** | Authorizer is selected in the work order customer contact card | **3, before and after** | https://shopview.testrail.io/index.php?/cases/view/44919 |
| **C44920** | Authorizer is optional and can be cleared with 'No authorizer' | **3, before and after** | https://shopview.testrail.io/index.php?/cases/view/44920 |
| **C44921** | Authorizer's phone shows below the name when the contact has one | **3, before and after** | https://shopview.testrail.io/index.php?/cases/view/44921 |
| **C44922** | Authorizer is locked once the work order is invoiced | **3, before and after** | https://shopview.testrail.io/index.php?/cases/view/44922 |
| **C44985** | Parts sale receives the Authorizer treatment (net-new) | **3, before and after** | https://shopview.testrail.io/index.php?/cases/view/44985 |

**Example of the added sentence (C44920):**

> Design: the Design Document (https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354) —
> open "Authorizer Entry (Work Order)", then the open Authorizer dropdown — its first option is
> "No authorizer", and the footnote reads "Only contacts with 'Approves Work' on".

**What did NOT change on any of the five:** the expected behaviour, the preconditions, the steps, the
Rule-54 provenance sentence, the automation marker, the section, the references, the case type, and the
**Automated flag itself** — re-read before and after each write, still `3` on all five.

**Checks after the write:** all five re-read from the served page — `markdown fr-view` on every field,
**0 escaping containers, 0 literal tags**. Per-case audit trail with HTTP status and verification
result: `APPLIED.jsonl` in this folder (Rule 50).

## Also worth telling him

* **Six *Inline* (6597) Automated cases still carry a precondition naming a permission that does not
  exist** — C45005, C45026, C45223, C45224, C45227, C45237 say *"Work Order Line - Create and Edit"* and
  *"Work Orders → Work Order View Mode"*. The build has a **"Work order lines"** section with a
  **"Create & Edit"** toggle and a **"View mode"** setting inside **"Work orders"**. The other 116 were
  corrected on 2026-09-01; **these six are held under Rule 71 and the 2026-09-02 go-ahead does not
  reach them** (different suite, different change). Register row **HO-11**.
* **C45123** (Printer Friendly, Automated) is still held awaiting a per-case go-ahead; its behaviour is
  verified PASS and only its steps are short of naming where to look. Register row **HO-1**.
* Vlad flagged **C45223, C45224, C45227, C45237** Automated himself at 12:47 on 2026-09-01.

**Earlier notices, each valid for its own date:**
`build/handoff-2026-09-01/FOR-VLAD-automated-cases-changed-2026-09-01.md` (Inline C45005/C45026) and
`build/invoice-ui-refresh/build-verify-2026-08-31/FOR-VLAD-automated-cases-changed-2026-08-31.md`.
