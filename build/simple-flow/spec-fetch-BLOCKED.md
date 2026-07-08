# Simple Flow — Updated Spec Fetch: BLOCKED (Atlassian auth-walled)

**Date:** 2026-07-08
**Task:** Retrieve Milos's (PO) updated Simple Flow / Simple Mode spec and diff it
against our recorded baseline `build/simple-flow/requirements.md` (extracted at doc
status V2.3). **Result: could NOT retrieve the current spec.** No diff was produced.
No case JSONs / Excel / TestRail were touched.

**Target page:**
https://shopview.atlassian.net/wiki/spaces/PM/pages/646021121/Simple+Mode+Streamlined+Work+Order+Completion+Receiving

## Fetch routes attempted (all failed)

| Route | Result |
|---|---|
| Atlassian/Confluence MCP (ToolSearch: `confluence`, `atlassian`, `wiki`, `get-page`, `read`) | **No such tool surfaced.** Only GitHub MCP tools are connected. No Atlassian/Jira/Confluence connector available. |
| WebFetch on the page URL | **HTTP 403 Forbidden.** |
| `curl -L` on the page URL (via agent proxy) | **HTTP 202, 0 bytes** — redirected to `id.atlassian.com/login?...&application=confluence` (login wall). |
| Confluence REST API `GET /wiki/rest/api/content/646021121?expand=body.storage,version` (no auth) | **HTTP 403** `{"message":"Current user not permitted to use Confluence"}`. |
| Word export `GET /wiki/exportword?pageId=646021121` | **HTTP 202, 0 bytes** (login redirect). |
| PDF export `GET /wiki/spaces/flyingpdf/pdfpageexport.action?pageId=646021121` | **HTTP 202, 0 bytes** (login redirect). |
| Stored creds re-use | Only creds on this box are **TestRail** (`shopview.testrail.io`, Basic auth). NOT Atlassian SSO — cannot authenticate to Confluence. |
| Newly-attached spec in `/tmp` and `/root/.claude/uploads` | **None.** The only Simple Flow doc present is the ORIGINAL upload `31240e6d-SimpleMode_StreamlinedWorkOrderCompletionReceiving.doc` (from 2026-07-01, = our V2.3 baseline). No newer .doc/.docx/.pdf/.html was provided. |

## What is needed to unblock (either one)

1. **Provide the updated spec export** — attach the current Confluence page as a
   `.doc`/`.docx`/`.pdf`/`.html` (same as the original upload). This is the fastest
   path; then we can diff vs `requirements.md` (V2.3) and produce the delta table +
   affected SF case IDs. **OR**
2. **Reconnect the Atlassian/Confluence connector** (MCP) with an account that can
   read space **PM** page **646021121**, so we can fetch `body.storage` + `version`
   directly.

Until one of those arrives, the diff cannot be produced — no guessing per standing
rule #1 (never proceed without the complete information needed).
