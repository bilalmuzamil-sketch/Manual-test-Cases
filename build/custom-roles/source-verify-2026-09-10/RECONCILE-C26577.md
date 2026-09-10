# Source-verification reconciliation — C26577 (Custom Roles & Permissions)

- **Case:** C26577 "seeFinancialData OFF strips pricing from PDF endpoints (LinesDetailProvider path)"
  https://shopview.testrail.io/index.php?/cases/view/26577 · created_by 3 (ours) · Automated (atm_status 3).
- **Reconciled:** 2026-09-10, three ways (Rule 106): the CASE's Expected (read live from TestRail) · the
  SOURCE as it reads today (fetched live from Jira this pass) · the BUILD (NOT observed this pass — deferred
  to the build-verification session).

## 1. The case's Expected (live)
See Financial Data OFF ⇒ the work-order PDF renders with no pricing of any kind (no dollar amounts, no rate
columns, no part costs, no margins); a text search of the PDF returns no monetary hits.

## 2. The source, quoted verbatim (read live 2026-09-10)
- **SV-7523** "Permission: See Financial Data" (Story, epic SV-7388, Done):
  > "Key: seeFinancialData. Cross-cutting toggle controlling ALL financial data visibility app-wide. ON:
  > user can see pricing, costs, margins, financial columns … OFF: all financial data hidden across every
  > page."
- **SV-7484** "[CRP-BE-09] seeFinancialData enforcement chokepoint (serializer-group masking)" (Task, epic
  SV-7388, Done):
  > Scope: "… Backstop: a query/PDF-path stripper for endpoints that bypass the serializer (PDF controllers,
  > `LinesDetailProvider`)."
  > Acceptance criteria: "Functional test: a `tech` user (Fin OFF) gets payloads with no sellPrice/cost/margin
  > keys (incl. PDF paths)."
- Version note (Rule 100): these are Jira issues (no Confluence version integer applies); both read Done on
  2026-09-10.

## 3. Verdict
**CASE AGREES WITH SOURCE.** The Expected is exactly SV-7484's acceptance criterion + SV-7523's "OFF hides
all financial data". The case is NOT a defect; it is source-accurate and fully traceable (Rule 20/64).
The internal references it carries ("CRP-BE-09", "LinesDetailProvider", "PDF paths") are lifted verbatim
from SV-7484 — not stale guesses.

- **Build leg:** deferred. When it fails in automation, the likely cause is the PDF endpoint not being
  pinned/discoverable (same as sibling C26578's note), NOT a wrong Expected. The build-verification session
  observes the live PDF endpoint and confirms no pricing (or catches a real leak).
- **This pass also corrected the case (QA-lead go-ahead 2026-09-10):** pinned the endpoint to the WO
  Print/Download-PDF + LinesDetailProvider path, added the provenance line, set the automation type. Behaviour
  unchanged; atm_status stays 3. Vlad notice: `../fix-C26577-2026-09-10/FOR-VLAD-2026-09-10.md`.
