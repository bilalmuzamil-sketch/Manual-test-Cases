## Jira/Confluence access
- **LOG IN TO JIRA / FILE OR READ A TICKET — the whole recipe is `build/ATLASSIAN-JIRA-ACCESS-METHOD.md`
  (§0a "THE FAST PATH" is copy-pasteable) with runnable scripts at `build/atlassian-login/`
  (`bridge.mjs` · `login.mjs` · `jira.sh`). Do NOT re-derive it.**
- Live browser login (headless Chromium via a fresh MITM bridge → id.atlassian.com email+password →
  a **6-CHARACTER ALPHANUMERIC** email code (digits + uppercase letters) — **not** 6 digits, typed into
  **six separate boxes** `input[data-testid^="otp-input-index-"]`) is the PRIMARY way to reach
  `shopview.atlassian.net`. **Check whether the Atlassian MCP even exists before planning around it**
  — there were zero MCP servers on 2026-08-04; REST v3 with the session cookie is the reliable path.
  Creds/cookies/codes in `/tmp` only, and `/tmp` is wiped by a container reset.
- **Writes with cookie auth need `Origin` + `Referer` on `shopview.atlassian.net` or every POST/PUT
  is `403 XSRF check failed`**; `/rest/api/3/search` is **410** → use `/rest/api/3/search/jql`
  (pages by `nextPageToken`). Full gotcha table: that doc's §5a.
- **Posting evidence (attachments + inline images + comment edit):** see §K "Jira evidence method".
- **FILING A DEFECT TICKET — the organisation's REQUIRED format: see the section of that name below.**

