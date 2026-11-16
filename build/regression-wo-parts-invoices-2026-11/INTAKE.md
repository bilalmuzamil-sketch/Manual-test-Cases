# Regression: work order lifecycle, parts lifecycle, invoice accuracy: intake (started 16 Nov 2026)

## The order (QA lead, 13 Nov 2026, verbatim)
> "I need to run the regression tests on workorder l;ifecycle and parts lifecycle and also ensure that the invoices being created by both parts lifecycle and work order are accurate and nothing is being missed. Can you do that ?"

## Answers so far
- **Build:** STAGING. QA lead, 16 Nov: *"Yes Staging if the QA environment is destroyed."* (sv11839 unreachable since 13 Nov.)
  - Staging app.staging.shopview.com build **v26.45.4-f3d3d2d** at 06:28 UTC 16 Nov; sign-in 200.
- **Still open:** the rest of the intake (scope, TestRail use, epic for bugs). See OUTSTANDING in chat.

## Candidate sources found (Confluence CQL title search + Jira, 16 Nov 2026 ~06:40 UTC). Versions to be read before use (Rule 31/59).

| Area | Source | Notes |
|---|---|---|
| Parts lifecycle (NEW feature) | Confluence 829227015 "Parts Lifecycle Update" (owner Chris Ward; status "Ready for dev - 2026-10-07"; last changed 13 Nov 2026) | Epic **SV-10647** "FounderMode Part Lifecycle", TESTING QA. 13 stories SV-10814…SV-10826 (Testing Stage / Ready for Production), verify tasks SV-11038…SV-11046 (Done), SV-11756 and SV-12010 (Board Backlog), SV-12606 (unit tests). A V2/upgrade of parts behaviour, so Rule 96 applies: derive the invariant set (what must NOT change in the WO/invoice/part flows). |
| Parts on WO lines | 782761986 "Inline Add and Edit Parts on Work Order Lines" (SV-9315) | |
| Part sale / receiving / WO completion | 646021121 "Simple Mode — Streamlined Work Order Completion & Bulk Receiving" (SV-7301; our completed Simple Flow project) | |
| Parts ordering | 54689805 "Parts Ordering" (Sep 2025) | old |
| Invoice creation | 989757441 "Create Invoice: closing the payment window" (SV-11987, "current behavior in production, checked against the code on 30 Oct 2026") | |
| Invoice/payment statuses | 767066118 "Invoice Status and Payment Status Reference" | |
| Invoice document | 755990532 "Invoice UI Refresh" (SV-8218); 845447188 "Invoice Design Selection" (SV-9892); 894009346 "Manual Invoice PDFs" (SV-10493) | |
| Fees, discounts, tax on invoices | our Fees & Discounts V1 project (SV-7387): `build/fees-discounts/` | completed 27 Jul |
| Voids | 827064321 "AccountingHub: Voided Invoice Defects" | accounting side |
| Work order lifecycle | 75071512 "Work Order Life Cycle - SLA" (excerpt empty) | **No WO-lifecycle PRD found yet.** Search Jira epics next; ask the QA lead / Chris for the WO lifecycle source |

## TestRail
- No TestRail credentials are in this container (/tmp/testrail missing).
- Existing WO / parts / invoice cases cannot be read until the QA lead supplies them, or says to work without TestRail.

## Scope change, QA lead 16 Nov 2026 (verbatim): "Please do not do anytning for parts lifecycle."
- **OUT of scope:** the parts lifecycle. That means the Part Lifecycle feature (SV-10647, Confluence 829227015) and any parts-lifecycle testing.
  - Nothing is to be read, tested, drafted or filed for it.
- **IN scope:** the work order lifecycle, and the accuracy of the invoices it creates.
- **Asked of the QA lead (open):** are part-sale invoices (over-the-counter part sales) also out?
  - Recommended: treat them as out until he says otherwise.

## QA lead's answers, 16 Nov 2026 (verbatim)
> "1. No
> 2. NO - when this feature was created we used to have small epics and tickets - but most of those tickets are now outdated so we have to be very careful when taking evidece of expected behavior from the tickets as we might end up taking evidences from the outdated ticket which once was an expected behavior but now after the changes is an obsolete behavior, also note that how work order behaves also depends on how we have set it up from settings -> https://app.staging.shopview.com/administration/settings
> 3. [TestRail key: stored in /tmp/testrail/creds.json only, chmod 600; works as user 3 Bilal Muzamil, 07:07 UTC]
> 4. yes"

## What that means for the run
1. **Part-sale invoices are IN scope.** Scope = the work order lifecycle + the accuracy of every invoice created from a work order or a part sale. The parts lifecycle stays OUT.
2. **There is no work order lifecycle PRD. Expected behaviour comes from tickets, and most of them are outdated.** Rules for using a ticket as a source:
   - **Supersession chain.** For every expectation, find every ticket that touched the same behaviour and take the LATEST statement (Rule 32). Record the chain (older ticket → newer ticket), not just one ticket.
   - **A ticket is only a source if nothing later contradicts it.** Check later tickets, PRDs (Fees & Discounts, Simple Mode, Invoice UI Refresh, Create Invoice payment window, Invoice Status reference) and Chris Ward's answers.
   - **Where the chain is unclear, or the only source is old**, do not assume. It becomes a question for Chris (Rule 58), with an annotated picture. Never ask him to change a document.
   - **The build is never the source** (Rule 57).
3. **Work order behaviour depends on Settings** (Administration → Settings).
   - Before testing, record every work-order- and invoice-related setting at the test location(s): a screenshot plus values.
   - Test each behaviour under the setting value(s) that change it. Record the setting state with every result.
   - Restore any setting changed (staging is shared).
4. **Bugs:** ask the QA lead per ticket which epic.

## QA lead, 16 Nov 2026 (verbatim): never call a feature a bug from an outdated test or ticket
> "Make sure that you do not create any ticket without my review, as whe you will be looking at the repo, you will notice that even the test cases for work orders might also be outdated against the REPO. So you have to be super intelligent here NOT to call a feature as a BUG basd on an outaded test or based on an outdated jira ticket/Epic."

### How this run obeys it (a mismatch is NEVER a bug until it passes every step)
1. **Nothing reaches Jira without his review.** Every candidate is a draft in this folder. He reviews it, and only then is it filed (Rules 62, 94).
2. **A TestRail case is a checklist, never a source of truth.** Many of the 861 Work Orders cases (S4) and the part-sale cases are older than later changes. A failing TestRail step only starts an investigation.
3. **Supersession check against the product repo (ShopView/shopview, read-only)** for every mismatch between the build and a test or ticket:
   - Find the code that produces the behaviour. Read its git history (`git log -L`, `git log -S`, blame) and the ticket keys in those commits and PRs.
   - If a later commit deliberately changed the behaviour (it cites a newer ticket, PRD or decision), the behaviour is the CURRENT intended one.
   - Then the old test or ticket is OUTDATED. Report it as "outdated test/ticket" (TestRail cases are not edited without his go-ahead, Rule 6/38/71). It is NOT a bug.
   - **Code is evidence of what was CHANGED and WHEN. It is never by itself the expectation** (Rule 57/96). The chain is completed by the newer ticket or PRD the commit points to.
4. **Then the document chain:** the latest ticket, PRD or Chris Ward answer on that behaviour wins (Rule 32), and is quoted.
5. **Classification of every mismatch, one of:**
   - (a) BUG CANDIDATE: the current source says X, the build does Y, and no later deliberate change exists. Draft only.
   - (b) OUTDATED TEST/TICKET: a later deliberate change exists. Report it, do not file.
   - (c) QUESTION FOR CHRIS: the chain is unclear, or code and document disagree with no decision recorded (Rule 96: a PO decision item). Annotated picture; never ask him to change a document.
   - (d) SETTINGS-DEPENDENT: the behaviour follows a setting. Record the setting and re-test under the other value.
6. **Every candidate states its evidence chain:** test/ticket → newer ticket(s) → commit(s) and PR → current source quote → build observation (with build, time, location and the four zones).

## QA lead, 16 Nov 2026 (verbatim): exclusions, results workbook, Mudassir
> "Exclude: Invoice Refresh / Fees & Discounts (WO and part lines) / Founder Mode / Internal Work Order (12 Nov 2026)
> 1. I dont understand please share the context and tell me what 11839 has to do with regression testing?
> 2. No
> 3. Workbook and share the work book with Edit acess with Mudassir, asking him that Bilal Asked to sare this workbook with Mudassir to create the regression tikckets after verifying if they really are the genuine bugs/defects and ask hgim to not create any defect/bug based on this if anything is not verified, and send the similar slack message to him too.
> 4. As I will be travelling I wont be bale to message mudassir on slack DM"

- **OUT of scope:**
  - Invoice Refresh (S6559) and Fees & Discounts (S3895, S3897 and the rest of that group). Invoices are still checked for accuracy, but those two features are not regression-tested.
  - Founder Mode / Internal Work Order (S136701), as answer "2. No" confirms.
  - Parts lifecycle (stays out).
- **SV-11839 has nothing to do with this regression.** It is the Dashboard epic. I cited it wrongly as the "related ticket". The regression has no ticket.
- **Results:**
  - A Google Sheets workbook, shared with **Mudassir Qamar** (mudassir.qamar@shopview.com) with **edit** access.
  - The share note and a Slack DM say: Bilal asked for it to be shared so Mudassir can create the regression tickets **after verifying each one is a genuine bug**, and must **not** create any bug or defect from anything not verified.
  - Messages are sent on Bilal's behalf because he is travelling.

## Workbook and hand-over to Mudassir — done 16 Nov 2026

- Workbook (Google Sheet, owner Bilal): **ShopView Regression - Work Order Lifecycle and Invoices (Nov 2026)**
  https://docs.google.com/spreadsheets/d/1raPM8agDFIXl6TGe-uFWQFQwJrgnQqFZ1uxeH8lBfew/edit
  Tabs: Read me first · Summary · Bug candidates · Outdated tests and tickets · Questions for Chris · Passed · Not verified · Settings used.
  Headers written and read back; "Read me first" carries the instruction to Mudassir verbatim in spirit:
  create regression tickets only after verifying each is a genuine bug; never create a defect from anything unverified.
- Shared with mudassir.qamar@shopview.com as **writer** — confirmed by reading the file's permissions back (owner Bilal, writer Mudassir).
- Slack DM sent to Mudassir (U0B7LKF4YJ2) on Bilal's behalf, saying so, with the link and the same instruction:
  https://shopview.slack.com/archives/D0B80VBM789/p1794813700904279
- Summary tab status: "Not started (plan awaiting Bilal's approval, 16 Nov 2026)".
- Correction recorded: earlier I cited **SV-11839** as the related ticket for this regression. That was wrong — SV-11839 is the
  Dashboard epic and has nothing to do with this regression. The regression has **no ticket**.

## Plan approved — QA lead, 16 Nov 2026 (verbatim): "1. I will follow your recomentation"
- Recommendation he accepted: steps 1 (record settings) and 2 (full WO and part-sale flows, every invoice recomputed) first; then the TestRail cases one section at a time, starting with Work Order lines (S6) and Deposits (S3014).
- Steps 1–2 handed to a background worker: `WORKER-BRIEF-steps-1-2.md`. It works at a location other than the three the report-gaps worker is using, and changes no settings in this pass.
