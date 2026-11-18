# Partly-used credit "Amount" — re-checked 18 Nov 2026 (ticket NOT created)

The QA lead asked (18 Nov) for a ticket tagging Chris Ward to confirm the behaviour or mark it Obsolete. Before drafting
(Rules 121, 125, 126) the following was observed, measured or quoted:

| What | Finding | How |
|---|---|---|
| Old reports (production) | Amount = what is left, same as Open Balance | Production v26.45.5-0b53dd5, 18 Nov 20:21 UTC, Admin, as of 2026-11-18 (today), app time-zone setting "UTC", browser UTC: CM1-4414 Amount $-45.00, Open Balance $-45.00 (`shots/prod-1-…png`); its customer page: Total -$200.00, Balance -$45.00 (`shots/prod-2-…png`); `shots/prod-NOTES.json` |
| Old code | both columns = total minus uses up to the as-of date, no "today" switch | fc08f23 `AgingDetailTransaction.php:132-133`, `DbalAccountReceivableCustomerFetcher.php` fetchCreditMemosForCustomers, `OpenBalanceAsOfSql.php` creditMemoExpression / depositExpression; unchanged on origin/main (contains 0b53dd5) |
| New reports | Amount = the credit's original total, Open Balance = what is left | origin/develop `ArOpenDocumentsSql.php:182` (`cm.total_amount`), `:214` (`d.amount`); staging data 18 Nov (b6a5d15): CM2-4353 Amount -20000 / Open -15000 cents |
| PRD v14 (16 Nov) | S5-R18a: "The Detail reports' Amount column holds original amounts and is not compared." — the change is NOT in "What changes for existing users" | read 18 Nov, `sources/PRD-947650561-v14-2026-11-18.md` |
| Developers | SV-12136 handoff (10 Nov) QA checklist: "Find a partly used vendor credit: Amount = the original credit (e.g. "$-10.00"), Open Balance = what is unused" | Jira SV-12136 comment 80616-linked handoff |
| **Already raised** | **12 Nov, the QA lead's own comment on SV-11315 (id 81069) to Milos: "not a bug … Could you add this line to section 2?"; Milos (81072): "will do"** | Jira SV-11315 comments |

**Outcome:** no ticket. It would contradict the 12 Nov position and close as "never a bug" (Rule 121). The open item is
Milos's PRD line, still missing in v14. Staging was not re-shot today (the session expired, 401); the staging values are
from today's data call and the 12 Nov picture.
