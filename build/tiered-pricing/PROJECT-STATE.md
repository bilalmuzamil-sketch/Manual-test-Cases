# Tiered Pricing — PROJECT STATE

## 14 Nov 2026 — intake (started; case work begins after the open Bill To, A/R and A/P and Internal Work Orders work is done)

QA lead, 14 Nov 2026: "After you are done with everything else, we have a new testing suite to create the test cases for ... New testing
suite is "Tiered Pricing"", with: drive the full design.

**Quotes and design references (Rule 117, sixteenth amendment, asked 14 Nov 2026): NO.** Each case's Expected Result ends with only the
AUTOMATION line after it. Design pictures are still attached to every case they apply to, and the References field holds the ticket and
PRD story / requirement numbers. Expected results still come only from the sources; each plain result is checked by build.py against the
source sentence it rests on (kept in the library, not printed).

| Input | Where | State at intake |
|---|---|---|
| TestRail folder | https://shopview.testrail.io/index.php?/suites/view/1&group_id=138770 — section 138770 "Tiered Pricing (11/14/2026)", top level of suite 1 | empty (0 subsections, 0 cases); its description already says the cases are aligned with the PRD as of 14 Nov 2026 (set outside our library; Rule 140 note to be written in our standard words when cases are written) |
| Epic | SV-11692 Tiered Pricing (https://shopview.atlassian.net/browse/SV-11692) | to sweep (every ticket, Rule 129) |
| PRD | Confluence 938213378 "Tiered Pricing" (https://shopview.atlassian.net/wiki/spaces/PM/pages/938213378/Tiered+Pricing) | to fetch; the tech plan was written against v0.17 (page version 37) |
| Companion PRD | Confluence 968687617 "Sales by Tier and Sales by Category" (named by the second tech plan, page version 21; story SV-11718) | to fetch |
| Design | https://claude.ai/artifact/A3NtAX9CHJCD87SXDTn9AE?sk=z3YP2vy3EJhhhP_Dr9mV0Q — 17 pages: 0 Overview, Stories 1-15, 20 Sales by Tier and Sales by Category (the tech plan counts 272 screens on pages 1-15 and 24 on page 20; Stories 16-19 have none) | to drive in full (Rules 120, 124, 126, 133; checklist lines 9 and 10) |
| Tech plan 1 | `sources/TECH-PLAN-Tiered-Pricing-upload-2026-11-14.md` (433,089 bytes, 3,626 lines; dated 11 Nov 2026) | saved; to read in full |
| Tech plan 2 | `sources/TECH-PLAN-Sales-by-Tier-and-Sales-by-Category-upload-2026-11-14.md` (221,613 bytes, 1,933 lines; dated 11 Nov 2026) | saved; to read in full |
| md-viewer links | powertools.shopview.com/md-viewer/bfa96538-… and /82509da0-… | both redirect to a sign-in page (HTTP 302); taken to be the two uploaded plans, to confirm by title |
| PO | to confirm from the PRD (owner) | — |
| Project type (skill 15 §1a) | **(ii) V2 / upgrade of existing pricing** (QA lead, 14 Nov 2026: "OK"); invariants per Rule 96 and skill 17, to be confirmed against the PRD when read | decided |

## 14 Nov 2026 — QA lead's instructions for the "must not change" (invariant) cases
Verbatim: "OK -> But keep such test cases in a separate folder, and if they can be run on staging instead of production I would usggest running
them on staging and if they can also be run on QA environment then we may run them on the QA environment too".
- Every invariant case (today's pricing behaviour that Tiered Pricing must not change) goes in its own subfolder of section 138770, separate from
  the story folders (name to be set when the folders are made, for example "Must not change: today's pricing").
- Each such case says where to run it: on staging when it can be run there (preferred over production); also on the QA environment when it
  can be run there; on production only when neither staging nor QA can show the behaviour (then with the "Run on Production After Release" pattern).

## 14 Nov 2026 — intake finished; case writing started
- Sources half done (SOURCES-REPORT.md): PRD 938213378 page v37, reports PRD 968687617 page v21, 54 tickets, both tech plans read in full;
  382 requirement rows (+42 from tech plans/tickets), 93 invariants -> 79 planned "must not change" cases, 39 numbers with hazards; PO Matt Barge.
- Design drive done (design-2026-11-14/DESIGN-DRIVE-PROOF.md): version 1794631438-539a, 272/272 boards rendered and swept, text inventory 2,630
  (0 unclassified), 49 movements, long-name breakages found.
- QA lead, 14 Nov 2026: the 11 "Today" screenshots (writer-only asset store): "I'll save the page (Recommended)" — he will send a saved copy of the
  canvas or edit access; attach them to the "must not change" cases when it arrives.
- QA lead, 14 Nov 2026, Rule 119: "Read them too" — the design tool's guides, index page and viewer runtime are being read in full by a worker
  (design-2026-11-14/TOOL-FILES-READ-2026-11-14.md).
- Case writing phase 1 (library + Stories 1-4) running; then two parallel batches for Stories 5-19 and the reports PRD.

## 14 Nov 2026 — QA lead's instruction for the PO question sheet (for when it is created)
Verbatim: "the question sheet for mat which you will create should be given the permissions to him to edit and shared with him and to all
the QA people it should have the access to edit and for the rest of @shopview people it shoul give read only access to everyone".
- Matt Barge: editor, shared with him (notified).
- Every QA person: editor (the list of QA people's addresses is to be confirmed with the QA lead before sharing).
- Everyone else at shopview.com: read only (domain-wide reader permission on the sheet).
- Show the sheet to the QA lead before sharing it (Rule 66: the question sheet is the last thing sent).
