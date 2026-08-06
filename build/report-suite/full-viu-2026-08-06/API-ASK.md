# API-ASK — Report Suite, 2026-08-06 second session

Standing Rule 51: an **API-related** defect is never filed on our own initiative, and a batch approval
never covers an API item. It is asked about separately and filed **only** if the QA lead says to.

**The test:** if the fault is invisible to a user AND to a manual tester — reachable only by calling an
endpoint with a request the product's own screens never send — it is **API-related**. If the same failure
also happens through the product's own screens, it is **user-facing**, however technical the evidence.

## STATUS: **NOTHING TO ASK ABOUT. No API-only fault was found in this pass.**

Every one of the nine defects filed was checked against the reachability test before filing, and **all nine
are reachable from the product's own screens**:

| Ticket | Reachable from a screen? | How |
|---|---|---|
| SV-8962 | yes | the Customer filter's icon, its label and its typed text are all on screen |
| SV-8963 | yes | click the Location heading; click the Margin % heading |
| SV-8964 | yes | choose Download Expanded View (PDF) from the report's own menu and look at the paper size |
| SV-8965 | yes | the table's colours, padding and indentation are on screen |
| SV-8966 | yes | leave filters set, come back, and look at the toolbar |
| SV-8967 | yes | click the WO number |
| SV-8968 | yes | tick an advisor and watch the report reload |
| SV-8969 | yes | open any of the three filters before selecting anything |
| SV-8970 | yes | the table's colour is on screen |

**Two findings were characterised through the API and are still user-facing, so they are NOT API-only:**

1. **The 366-day range cap** was proven with `HTTP 400 "Date range cannot exceed 366 days."`. That is
   *evidence*, not the defect; the requirement `S2-N2` is about the calendar preventing the selection, which
   is a screen behaviour. Held in the re-check queue, not asked about here.
2. **The Sales By Customer download file name** (SV-8956, filed earlier) was traced to the front end
   discarding the server's `content-disposition`. **The server is correct**; the wrong name is what the user
   receives, on screen. User-facing.

**Nothing else surfaced.** The nightly-snapshot cases (WIP C30528/C30530/C30531/C30533 and IV
C30605/C30607) are server-side jobs, but **no fault was found in them** — they simply could not be observed,
so they are re-check rows, not API asks.
