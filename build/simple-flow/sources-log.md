# Simple Flow — Sources Log

Ingestion date: **2026-07-06**. Project: **Simple Flow** (Simple Mode —
Streamlined Work Order Completion & Receiving). Epic **SV-7301**.

| # | Source | Type | Status | What was recovered |
|---|---|---|---|---|
| 1 | `31240e6d-SimpleMode_StreamlinedWorkOrderCompletionReceiving.doc` | Confluence "Save as .doc" = MHTML (multipart; `text/html` part, quoted-printable) | **PARSED OK — complete** | Full product spec: header (Epic SV-7301, Owner @Milos Vasic, status "Draft for build — V2.3"), §1 Business Case, §2 Feature Overview, §3 Jobs to be Done, §4 Key Decisions, §5 Cross-System & Data Integrity, §6 Terminology, §7 Requirements = **17 stories (SV-7696…SV-7710, SV-7870, SV-7876)** each with Summary/Context/Requirements/Acceptance Criteria (incl. core-parts sub-criteria), §8 Open Questions. No mid-doc truncation. Extracted via Python `email` module + HTMLParser → `/tmp/simple_text.txt`. |
| 2 | `9a899fa3-Simple_Flow_Design.zip` | Design bundle (HTML/JSX/CSS/PNG/fonts) | **PARSED OK** | Unzipped to `/tmp/simple-flow-design/`. 15 HTML mockups/prototypes, 3 MD dev handoffs, 4 JSX, 2 CSS, ~50 PNG screenshots, 54 Inter fonts. Cataloged in `design-notes.md`. Design references **Spec V1.4** (drift vs doc's V2.3). |
| 3 | Confluence page `…/wiki/spaces/PM/pages/646021121/Simple+Mode…` | Live Confluence URL | **BLOCKED (HTTP 403 Forbidden)** | Nothing — WebFetch returned 403 (requires Atlassian auth). Could not confirm the .doc is the latest version. The .doc (source #1) is the working spec of record. |
| 4 | Jira Epic `…/browse/SV-7301` | Live Jira URL | **BLOCKED (HTTP 403 Forbidden)** | Nothing directly. Could not read child-story bodies/comments/status. **Story IDs recovered from the .doc text instead:** SV-7696, SV-7697, SV-7698, SV-7699, SV-7700, SV-7701, SV-7702, SV-7703, SV-7704, SV-7705, SV-7706, SV-7707, SV-7708, SV-7709, SV-7710 (SV-7696…SV-7710 = Stories 1–15), SV-7870 (Story 16 review), SV-7876 (Story 17 tech story). |

## Notes
- Confluence + Jira are behind Atlassian sign-in / Cloudflare; WebFetch cannot
  authenticate. To read them, an authenticated path (browser session / API token,
  or the staging/QA MITM approach used in other projects) would be needed. Not
  attempted for this ingestion pass.
- Secrets/cookies (if later supplied for QA env sv7301) must live in `/tmp` only —
  never committed.
