# PO / Dev question sheet — Invoice UI Refresh (SV-8218)

**Project:** Invoice UI Refresh · **Feature:** Order Reference Fields (Story 3, SV-9142)
**Raised:** 31 August 2026 · **For:** Chris Ward (PO) — with a dev check from Milomir Kotlajic
**Why this exists:** Rule 58 — an ambiguous source is never resolved by looking at the build. These
two cases are **held with their documented expectation**; they are not blocked and not failing.

---

## Question 1 — What counts as a valid Approval Code, and how does a tester get one?

**Cases held on this:** [C44913](https://shopview.testrail.io/index.php?/cases/view/44913) ·
[C44916](https://shopview.testrail.io/index.php?/cases/view/44916)

**What the specification says.** The context note under Story 3 says *"'Approval Code' is the approval
code issued through the shop's integrated-billing setup"*, and that this is **net-new**: today's
document prints the approval code under the *Authorizer* label, and the spec moves the code to its own
**Approval Code** field.

**What we can see.** The work order carries an integrated-billing number (`IBS#: 867252`), and four
integrated-billing endpoints exist: `requestIBSApproval`, `retrieveIBSApproval`, `changeIBSApproval`,
`retrieveCustomerInformation`. What we cannot tell from the build is whether an approval code can be
**put onto a test invoice on a QA branch at all** — `requestIBSApproval` may call a real
integrated-billing service, and `changeIBSApproval` may or may not accept a code we choose.

**The question, in one line:**
> **On a QA branch, how should a tester get an invoice that carries an Approval Code — can one be
> entered or changed by hand, or does it only ever arrive from the live integrated-billing service?**

**Why it matters:** if a code can be set by hand, both cases are testable today. If it can only come
from the live service, they can only ever be checked on an environment wired to it, and they need the
same treatment as the customer-portal cases — a marker that says where they *can* run.

**What we are doing meanwhile:** both cases keep their documented expectation and their current
marker. Nothing is guessed, nothing is rewritten, and neither is counted as ready to automate.

---

## OUTSTANDING — what we need from you

1. An answer to Question 1 above (one line is enough).
2. Nothing else on this project. Everything else that was previously reported as blocked has been
   re-classified: 6 cases are finished under Rule 69 (feature not built), 3 are correctly parked as
   customer-portal/staging-only, and 7 are our own remaining work with the recipes already in hand.
