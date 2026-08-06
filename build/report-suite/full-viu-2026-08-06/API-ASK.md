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


---

# Added by the third session, 2026-08-06

## The custom date range accepts one day more than the documented limit

**What we found.** Sales By Representative's written description caps a custom date range at **366 days,
counting both end dates**. The server accepts **367**. Asking for 368 is correctly refused with
"Date range cannot exceed 366 days."

The boundary was pinned exactly rather than estimated:

| Range asked for, counting both ends | Server answer |
|---|---|
| 366 days (2025-08-06 to 2026-08-06) | accepted |
| **367 days (2025-08-05 to 2026-08-06)** | **accepted - one day past the limit** |
| 368 days (2025-08-04 to 2026-08-06) | refused, "Date range cannot exceed 366 days." |

**Why this is an ASK and not a ticket.** We could not get the calendar itself to build a range longer than
366 days from our harness, so we have **not shown that a person using the screen can reach the extra
day**. If the calendar stops them, this is only reachable by calling the service directly, which makes it
API-related - and an API-related finding is never filed without asking (Rule 51).

**The question for the QA lead:** file it, or leave it? And if the answer depends on whether the calendar
allows it, that is one more thing to check on a run that can drive the calendar across a year boundary.

**Source:** the Sales By Representative report specification, version 17, requirement **S2-R6**: *"The
Custom range is capped at a maximum span of 366 days (start and end dates inclusive), matching the largest
preset. A custom selection whose start-to-end span exceeds 366 days is not accepted; the picker holds the
user to a range of 366 days or fewer."*

## Already recorded, re-confirmed today

The service **rejects `last_12_months`** as a range name with "Selected date range is invalid.", and that
is the first period the chooser offers. **It is not reachable from the screen** - the application always
turns a chosen period into explicit start and end dates before asking - so it stays an ask rather than a
ticket.
