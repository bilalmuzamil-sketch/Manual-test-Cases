# "Found under All, missing from its own section" — four Story Defects, 14 September 2026

These are the QA lead's findings. **The evidence is his own screen recording**, decoded frame by frame
(the branch was returning gateway errors, so no fresh capture was possible — and nothing was filed
from an outage zero).

All four are **Story Defect**, priority Medium, parent **SV-9169** — *FE: Scope tab strip with live
counts, grouped results and scoped-tab load-more* — under epic SV-9160. **SV-9169, not the index
story**, because the count is CORRECT: the record is indexed and counted. It is the section's own view
that comes back empty.

Each carries the annotated frame for its moment, the full recording, and the line
**"Move to the timeline related to this ticket"** with the timestamp.

| What is missing from its own section | Typed | Section | Moment | Ticket |
|---|---|---|---|---|
| A vehicle, by full VIN | `BAHUTYV09T63EV7NS` | Assets | **0:34** | [SV-10014](https://shopview.atlassian.net/browse/SV-10014) |
| A supplier, by email | `jay.harrison@gmail.com` | Vendors | **1:20** | [SV-10015](https://shopview.atlassian.net/browse/SV-10015) |
| A part, by part number | `ZZT-88-4412` | Parts | **1:35** | [SV-10016](https://shopview.atlassian.net/browse/SV-10016) |
| A job, by part of its number | `17580` | Work orders | **1:42** | [SV-10017](https://shopview.atlassian.net/browse/SV-10017) |

SV-10014 also carries a second frame (0:29) showing the vehicle on the customer's own vehicle list,
so nobody can argue the record does not exist.

## How the evidence was recovered

The recording is h264 in a webm container with **no duration header**, so it cannot be seeked, and
Playwright's bundled ffmpeg cannot decode h264 while Playwright's Chromium has no h264 decoder either.
Installing a full `ffmpeg` solved it: one frame per second, 106 frames, then `tesseract` over a crop of
the search area to find which second shows which search. Recipe recorded in the playbook.

## Why the recording is NOT on the other eight tickets

It does not show them. Every B-group query and the status query were searched for across all 106
frames and **none appears** in the recording. Attaching it there, under an instruction to "move to the
timeline related to this ticket", would send a reader to a timeline that does not exist. Say the word
and I will attach it anyway.

## One correction to my own note

My scheduled reminder said *five* findings. The QA lead's message lists **four**. The fifth (a vehicle
by unit number, `ZZT-4471`) was mine, not his, and I have no evidence for it — it is not filed.
