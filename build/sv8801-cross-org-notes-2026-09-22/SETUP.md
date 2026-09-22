# SV-8801 — cross-organization note access. Setup findings, before any testing.

**Ticket:** Bug · TESTING QA · Medium · labels `security`, `multi-tenancy`, `QA_Validation_Required`
· reporter/assignee **Slavcho Mitrov** · no parent, no links · **1 comment (76817)**, no attachments.

**What it is:** a logged-in user in one organization can **edit, delete, or attach files to another
organization's notes** if they know the note's UUID. `NoteRepository::findById()`/`findOneBy()` have no
organization filter and `NoteVoter` only asks "does this user have the Notes permission?", never
"…in the same organization?". Live in production.

## ⚠️ The developer's environment instruction is out of date

Comment 76817 (18 Sep) says: *"no per-branch QA environment will exist for this ticket … the QA deploy
workflow lives only on develop, so sv8801.qa.shopview.com will not come up. Please test on staging
instead."*

**It is up.** Measured just now, straight through the agent proxy:

| Host | HTTP | app-version | last-modified |
|---|---|---|---|
| `sv8801.qa.shopview.com` | **200** | **`v26.36.8-18877c9`** | Mon 21 Sep 2026 13:33:09 GMT |
| `app.staging.shopview.com` | 200 | `v26.36.8-339df81` | Mon 21 Sep 2026 15:14:57 GMT |
| `app.shopview.com` (prod) | 200 | `v26.36.8-961aeb2` | Thu 17 Sep 2026 08:39:46 GMT |
| `sv9999.qa.shopview.com` (control) | **000, no body** | — | — |

**It is not a wildcard fallback** — a made-up `sv9999` host returns nothing at all, and sv8801 serves
its **own distinct build and etag**, different from staging's. His comment is 18 Sep; this deployed
**21 Sep**, three days later. **Which build actually carries the fix is not yet established** — being
up is not the same as containing PR #3149.

**This matters:** testing the wrong host would test the wrong code. Resolving it is cheap once the
fixture exists, because the pre-fix and post-fix behaviours differ loudly (200 + row mutated vs 400
not-found), so whichever host still shows the old behaviour *is* the before-capture.

## What the test needs, and the trap in it

**Done-when (description):** a user in Org A gets **not found** for an Org B note on all four
endpoints — `POST /api/note/add-attachments`, `/update`, `/delete`, `/delete-attachment`.

**The developer's four highlights (comment 76817):**
1. **Seven** endpoints share the guard — six internal note endpoints **plus the Customer Portal
   attachment download**, easy to miss because no portal file appears in the diff. Attachment
   thumbnails resolve through it, so a regression shows as **broken images, not an error**.
2. Another org's note must return **400 not-found, never 403** — a 403 confirms the note exists.
   **Same-org-without-permission still returns 403 and is unchanged** (NoteVoter deliberately untouched).
3. **Two checks need database verification, not a status code:** note delete and attachment delete.
   **Before the fix both returned 200 *and actually mutated the row*, so a status-only assertion would
   have passed against the bug.**
4. **Do not file** the known residual: delete-attachment returns different error bodies for a
   nonexistent attachment id vs another org's. Reveals existence only; the delete is still blocked.

**⚠️ THE FIXTURE TRAP.** A random UUID also returns not-found. **Passing the test with a made-up id
would prove nothing.** The negative case needs a note that genuinely **exists and belongs to another
organization** — otherwise the fixture cannot show the opposite and the run is not evidence either way.

## Progress so far

* Session on sv8801 confirmed live — `GET /api/auth/me/fe-permissions` → 200.
* **Org A** = `d55bc308-e61a-438d-b5f1-c7a73c89d49f` (Staging Foothills Group Inc), 36 notes visible
  via `GET /api/notes`.
* Endpoint contracts probed: `/api/note/update` → 400 `{"id":"Note ID is required."}`;
  `/api/note/delete` → 400 `{"id":"Id is required."}`; the two attachment endpoints 500 on a JSON body
  (they are almost certainly multipart).
* Only **one** organization existed, so there was no cross-tenant fixture at all. Found
  **`POST /api/register`**, which names its required fields, and used it to create
  **Org B** = **`d20c1fef-558d-4e55-9e1e-86f6a30f4a28`** — *ZZAUTOTEST SV-8801 Org B*. Both orgs now
  list.
* Org scoping already demonstrably works somewhere: `GET /api/organizations/{OrgB}/roles` → **403**
  from an Org A session.

## The remaining blocker

**A note must exist inside Org B, and planting one needs an identity in Org B.** Registration returned
`{"data":[]}` — no credentials — and the admin it created is not visible from Org A's staff list. The
usual invite-email confirmation is not readable from here.

Routes still to try: a password-reset that yields a token on a QA env, cross-org `switch-user`
(currently blocked by the shared-PHPSESSID rotation that `quick-login` causes), or a mail catcher.
