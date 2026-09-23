# The 13 failing checks against their tickets' live status — 23 September 2026

Asked for: *"Check if the Failed test cases have the tickets which are QA passed now so that you can
change the status of those test cases and add the comment."*

**Ticket status decided WHAT to re-test. It never decides a verdict (Rule 61: ticket status is never
evidence about the build).** Every ticket below was read live today.

## The 13, sorted by what their ticket is doing

### A · Worth re-testing — the fix may have landed (3 checks)

| Check | Ticket | Ticket status | What must be true to pass |
|---|---|---|---|
| **C44836** *A Part Sale row shows the P-number, customer, status badge, total price and date* | **SV-10163** | **QA Complete** | the row shows a **total price** and a created date |
| **C55706** *A user WITH See Financial Data sees prices in search result rows* | **SV-10163** | **QA Complete** | the part-sale total, purchase-order total and supplier-invoice total all show real values |
| **C44865** *No-results in a scoped tab reads "No results for [query] in [Tab]"* | **SV-10181** | **Ready for QA** | the message names the scope tab after " in " |

*Ready for QA* means development is finished and it is waiting on us, so C44865 is squarely ours to
run.

### B · Ticket closed OBSOLETE — that is NOT a fix (4 checks)

| Check | Ticket | Closed |
|---|---|---|
| C53476 *No count in the search modal reads higher than 20* | SV-10320 | OBSOLETE / Done, 22 Sep |
| C53601 *A catalogue part not in inventory can still be found* | SV-10001 | OBSOLETE / Done, **23 Sep** |
| C55660 *Finding a record by a fragment from the middle of a word* | SV-10060 | OBSOLETE / Done, **23 Sep** |
| C55685 *Typing a name does not bring back other differently spelled names* | SV-10025 | OBSOLETE / Done, **23 Sep** |

**🛑 These cannot be passed on the strength of the closure.** CLAUDE.md §1, Rule 57, in those words:
***"A closed ticket is not a spec change."*** Closing a report as obsolete records a decision not to
do the work; it does not alter what the requirement asks for, and the case is measured against the
requirement. Unless the build itself now meets the documented Expected, these stay **Failed**.

**But it is a decision he should make, because three closed today.** If the product has decided
those behaviours are acceptable, the *cases* need retiring or their source amending — and that is
his call plus a document change, not something a ticket closure does by itself. Put to him.

### C · Ticket still live — nothing to do (4 checks)

C44848, C96844 (SV-10346, **In Progress**) · C96845 (SV-10385, Open) · C55716 (SV-10340, Open).

### D · No ticket (2 checks)

C45160 — no report by design; waiting on his decision about the exclusion note.
C44825 — he declined a report on 22 Sep; recorded do-not-re-raise.

## What stopped the re-test — proved, not assumed

**Nothing in group A could be re-run today.** The branch session cookies supplied on 22 September at
14:48 have expired — about nineteen hours against a recorded session life of roughly 58 minutes.
Every route (`/`, `/login`, `/workorders`) now redirects to Google sign-in, so the
`DEV MODE — QUICK LOGIN` panel never renders and `quick-login/users` answers 401.

Checked against the recorded trap first: **this is not the sleeping-branch case** (playbook line
357) — the URL does not contain `sleep.qa.shopview.com` and there is no `Wake Up` button. Passed
`blocker_gate.py` on all seven proofs; claim and evidence in `BLOCKER-branch-session.json`.

**What it does NOT block (Rule 68):** everything above — the live ticket statuses, the grouping, and
the ruling on the obsolete four. Only the three re-runs in group A are waiting, and they need one
thing: **a fresh session cookie for `sv9160`**, which per `ENVIRONMENT-CREDENTIALS.md` §2 only he can
supply. There is no password for a QA branch and none is to be invented.
