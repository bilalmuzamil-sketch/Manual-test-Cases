# Rule 106 reconciliation — Invoice Design Selection, before any result is written

Spec read **LIVE 2026-09-11**, Confluence page **845447188**, reported by the API as last modified
**about 2 hours before this read**. Our cases were authored 2026-09-10 from **Revision 3**.
Build observed: **sv9872**, `v26.36.2-12974d6`.

## 🛑 THE SPEC HAS MOVED SINCE OUR CASES WERE WRITTEN — AND THE CONTROL ITSELF CHANGED

| | Our 57 cases (from Rev 3) | The spec as it reads TODAY | The build on sv9872 |
|---|---|---|---|
| The control | a **pick list** labelled **"Invoice Design"** | a **toggle row** titled exactly **"Legacy invoice layout"** | a **pick list** labelled **"Invoice Design"** |
| Where it sits | **top** of the Invoice Settings page | **last row** of the toggle list, below "Summarize labor total", above the Disclaimer | **top** of the Invoice tab |
| The two states | options **Modern** / **Legacy** | switch **off = Modern**, **on = Legacy**; *"There is no third state and no pick list"* | options **Modern** / **Legacy** |
| Helper text | *"…uses **the selected design**, including documents created before you changed it."* | *"…uses **the legacy design while this is on**, including documents created before you changed it."* | *"…uses **the selected design**, including documents created before you changed it."* |
| Epic | **SV-8218** | **SV-9892** (SV-8218 is only "Related") | — |

**Verbatim, S1-R1 as it reads today:**
> "A toggle row titled exactly \"Legacy invoice layout\" is the **last** row in the list of toggles on
> the invoice settings page, directly below \"Summarize labor total\" and above the Disclaimer. It is
> built exactly like the rows above it: bold title, one line of description under it, switch at the
> right edge. (Changed 2026-09-10 from a pick list at the top of the page; Chris W. on SV-9926.)"

**Verbatim, S1-R2:**
> "The switch has two states. Off is the Modern design; on is the Legacy design. There is no third
> state and no pick list."

**Verbatim, S1-R3:**
> "The row's description reads exactly: \"Every estimate, invoice and credit invoice your shop shows,
> prints or sends uses the legacy design while this is on, including documents created before you
> changed it.\""

## ⚠️ DO NOT FILE THIS AS A DEFECT YET — THE BUILD MAY SIMPLY PREDATE THE REWRITE

The spec's own change log, 2026-09-10:
> "Reworked branch (**PR #3004, head 10665aceea**) is up with Q23 and Q7 in; QA build underway."

and, for the fee-guard work:
> "(head **12974d62f9**)"

**The branch under test reports `v26.36.2-12974d6`** — that matches the *fee-guard* head, **not** PR
#3004. So sv9872 most likely predates the pick-list-to-toggle rewrite. Reporting "the control is
wrong" against a branch that was cut before the change would be a false defect of exactly the kind
Rule 106 exists to prevent. **This is a question for the QA lead, not a finding.**

## What IS unaffected and can be run now

The live-switch behaviour is the same in Rev 3 and today, and the build's helper text already
describes it. Unaffected: Story 2 (every document follows the current setting), Story 3 (estimates),
Story 5 (every surface). The confirmation dialogs, the success toast and the failure toast are
**explicitly unchanged** by the rewrite ("Confirmation dialogs unchanged"), so those are runnable too.

Affected and held: the Story 1 cases that assert the control's **form, title and position**, and the
helper-text case.

## Also wrong on every one of our 57 cases, regardless

The provenance says **epic SV-8218**. The spec now carries **epic SV-9892**, with SV-8218 as
"Related" only, and real story keys exist: **SV-9893** (Story 1), **SV-9872** (Stories 2 and 3),
**SV-9897** (Story 5). Rev 3 recorded "story keys all TBD". Every case needs its provenance corrected.
