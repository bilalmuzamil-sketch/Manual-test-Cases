# Schedule — the API-only finding, written up and NOT filed (Standing Rule 51)

## The ask, in one line

**May we file a ticket for this, or not?** It is API-only, so under Standing Rule 51 it is never filed
on our own initiative — and a go-ahead given for a batch of ordinary defects does **not** cover it.

## What the finding is, in plain words

The engineering plan says that scheduling a run of days longer than **8 weeks** should stop and ask
the person to confirm before creating it, and that a single run should never be allowed to create
more than **120 days** of work at once. Neither limit exists. A long run is created silently.

## Why it is API-only, and therefore not ours to raise

| Test | Answer |
|---|---|
| Can a user reach it from any screen? | **No** |
| Can a manual tester reach it from any screen? | **No** |
| Is it reachable only by calling the endpoint directly, with a request the product's own screens never send? | **Yes** — the screens never send `acknowledgeLongSeries`, and there is no screen that asks for more than 120 days |
| Does the same failure also occur through the product's own screens? | **No** |

By the reachability test recorded in Standing Rule 51 that makes it **API-related**, so it goes here
rather than into Jira. (Contrast SV-8821 on another project, which was kept open precisely because it
*also* failed through the product's own screen.)

## The honest complication the QA lead should know before answering

**These limits are not product requirements.** They appear **only in the engineering technical plan**.
The **Schedule specification version 23 does not mention 8 weeks or 120 shifts anywhere** — verified
against the live Confluence body this pass.

So there are three possible answers, and it is a product call rather than a QA one:

1. **The limits are real and missing** → a ticket is warranted, and the specification should gain the
   requirement so it stops being engineering-only.
2. **The limits were an engineering idea that was dropped** → no ticket; our two cases
   (`SCH-SPREAD-11` = C38863 and `SCH-API-02` = C38873) should be retired or rewritten, and the
   engineering plan corrected.
3. **The limits are wanted but not yet built** → no ticket; they are simply future work, which is how
   both cases are currently marked.

**We are not guessing between these.** Both cases sit on `AUTOMATION: HOLD - the feature is not built
yet`, which is true under all three readings.

## Not re-driven this pass — stated plainly

The 409/422 behaviour was **not re-tested on `v3.5-be42149`**. The finding above is carried forward
from 4 August on `v3.5-4873abe`. It is in the re-check queue.

## What we need

**One of:** *"file it"* · *"do not file it — the limits are dropped, retire the cases"* · *"do not
file it — keep them as future work"*. Any of the three unblocks both cases.
