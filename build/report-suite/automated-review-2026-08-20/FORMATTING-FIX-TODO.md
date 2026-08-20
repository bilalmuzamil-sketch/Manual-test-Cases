# FORMATTING-FIX TODO — TestRail UI Edit→full-stop→Save reflow (2026-08-20)

**The QA lead's confirmed interim fix for the `<p>…<br>` paragraph-squash is a TestRail WEB-UI action:**
open the case → **Edit** → add a full stop after any line → **Save** (this makes TestRail's editor
re-process the stored HTML and clear the squash). It cannot be done over the API (the API writes the
`<br>` form; only the UI editor reflows it).

## Browser drive was ATTEMPTED and FAILED — reason below
- A fresh MITM bridge was built (`build/testing-tools/staging-bridge.mjs`, port read live from
  `$HTTPS_PROXY`) and Chromium (`/opt/pw-browsers/chromium-1194`) was pointed at it — the TLS path worked
  (the TestRail login page loaded, title "Login - TestRail").
- Login at `https://shopview.testrail.io/index.php?/auth/login/` with the supplied UI credentials
  (`#name` / `#password` / `#button_primary`) was **rejected**: TestRail returned
  **"Email/Login or Password is incorrect. Please try again."**
- The submitted values were byte-verified before submit: username matched exactly (26 chars); password
  matched exactly (10 chars, including the special character), read back from the field identical to the
  supplied value. So this is **not** a typing / special-character problem — **the account rejects this
  password on the web-UI login form.** (The credential is held only in `/tmp/testrail-ui.txt`, chmod 600,
  never written to the repo.)
- Tried both `fill()` and char-by-char `type()`; same result. **3 attempts, then stopped** — SSO/password
  brute force is barred, and the coordinator's instruction is not to block.

**⇒ WE NEED WORKING TestRail WEB-UI credentials** (or confirmation that this account's UI login is
SSO-only, in which case a human must run the reflow, or supply an SSO-capable session). The API Basic-auth
key in `/tmp/testrail/creds.json` is a separate secret and does **not** grant web-UI form login.

## Cases still needing the manual Edit→full-stop→Save reflow
This 2026-08-20 classification pass wrote **0** cases, so the only cases in `<p>…<br>` interim form that
need the UI reflow are the three edited/created earlier this session:

| C-id | Project | Format now | atm (live) |
|---|---|---|---|
| [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | Report Suite / WIP | `<p>…<br>…` (0 `<ol>/<li>`) | 3 |
| [C43838](https://shopview.testrail.io/index.php?/cases/view/43838) | Report Suite / WIP | `<p>…<br>…` (0 `<ol>/<li>`) | 1 |
| [C43984](https://shopview.testrail.io/index.php?/cases/view/43984) | Report Suite / WIP | `<p>…<br>…` (0 `<ol>/<li>`) | 1 |

**For each:** open in TestRail web UI → Edit → add a full stop after any line in Preconditions / Steps /
Expected → Save → re-open and confirm each step/precondition/expected line renders on its own line, with
NO literal `<br>` shown as text and NO `<p>` paragraph-squash.

**Note:** the `<br>` interim form already renders line-broken (it is not `<ol>/<li>` raw markup), so these
are cosmetic squash fixes, not correctness defects — safe to leave until working UI credentials arrive.
