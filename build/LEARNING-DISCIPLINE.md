# Learning Discipline — how NOT to record a wrong durable learning

**Why this exists (2026-08-28):** during SV-9500/SV-8504 QA I was doing quick-login **correctly in the
morning**, then started failing, then wrote a durable playbook rule **"NEVER quick-login — it logs out the
user."** That rule was **wrong** (too broad) and would have cost us the ability to change roles for
permission testing forever. The QA lead flagged it: *"This type of wrong learning can bite us in future
too — set up some protection around your learning."* This doc is that protection.

## What actually went wrong (the worked example)
- The QA-branch **session was already valid** (`GET /api/auth/me/fe-permissions` → **200**).
- I called quick-login anyway, **via an in-page `fetch` (page.evaluate)**. Quick-login **rotates the
  session**: it returns a **new `PHPSESSID` in `Set-Cookie`** (the old one is now dead). But an in-page
  cross-origin fetch to the API host **does not hand that new cookie back to my code**, and the browser
  context **kept the OLD PHPSESSID** → every later call got **409 "Session has expired."**
- I then **reused that dead PHPSESSID** across runs (409 forever) and **re-ran quick-login repeatedly**,
  compounding it. The user's browser, sharing that same rotated PHPSESSID, got logged out.
- **The correct fix was narrow:** probe first and skip quick-login when already 200; if you must
  quick-login (only to change role), **capture the new PHPSESSID from `Set-Cookie`** (direct fetch or a
  network-response listener — an in-page fetch can't), **use it, discard the old**, and never reuse a
  409'd jar. Proven live: captured PHPSESSID `7f196596…` → fe-permissions **200, session alive** end-to-end.
- **The wrong learning I wrote instead:** "quick-login always logs people out, never use it." I inferred a
  broad *causal* prohibition from a *correlation* (session died while I happened to be testing) without
  isolating the mechanism.

## The five guards (apply before writing ANY durable "NEVER / ALWAYS" learning)

1. **Correlation ≠ causation.** "X happened while I did Y" is not "Y causes X." Before recording a durable
   rule, **isolate the mechanism with a controlled test** (change one variable, observe). I only earned the
   right to write the quick-login rule after the `ql_test` / `ql_correct` experiments showed *exactly* which
   step broke and which fixed it.

2. **A previously-PROVEN method that starts failing means SOMETHING CHANGED — not that the method is
   wrong.** Default hypothesis = my usage/state/timing/concurrency changed (stale cookie, poisoned session,
   repeated calls), **not** "the technique is fundamentally invalid." Investigate the delta first.

3. **A new conclusion that CONTRADICTS an earlier proven fact is a RED FLAG, not an overwrite.** If I have
   `quick-login worked (proven, this morning)` and I'm about to write `quick-login never works`, STOP:
   that's a contradiction to resolve by investigation, not by replacing the old learning. Keep both on the
   table until the mechanism explains the difference.

4. **Label every durable learning by evidence grade, and gate broad rules on the top grade:**
   - **OBSERVED-MECHANISM** — I saw the causal step happen and reproduced it. *Only these* may become a
     broad "NEVER/ALWAYS" rule.
   - **INFERRED / CORRELATION** — plausible but not mechanism-proven. Write it as **provisional** ("seems
     to… — not yet mechanism-confirmed"), never as an absolute prohibition.
   - **HEARD/RULING** — from the user/PO/dev. Record verbatim + attribute; still test before generalizing.

5. **Prefer the NARROWEST rule the evidence supports.** "Don't reuse a 409'd PHPSESSID; capture the rotated
   one; probe first; don't quick-login on a shared account" is narrow and correct. "Never quick-login" is
   broad and wrong. A broad prohibition that removes a whole capability needs top-grade evidence and a
   stated reason it can't be scoped narrower.

## The mechanical safeguard
- When I catch myself writing **"NEVER"**, **"ALWAYS"**, or **"it's impossible to…"** into a durable doc
  (playbook / CLAUDE.md / process), run this checklist first. If the learning is grade INFERRED, downgrade
  the wording to provisional and add *"(mechanism not yet confirmed — verify before relying)"*.
- When correcting a durable doc, **keep a one-line note of what the old (wrong) version said and why it was
  wrong**, so the correction is auditable and the same wrong conclusion isn't re-derived. (Done in
  APP-ACTIONS-PLAYBOOK.md §quick-login.)

## Ties to existing rules
Extends Standing Rule 12 (observed, never inferred — this is its *learning-time* twin: don't record an
inference as a proven fact), Rule 27 (the books are the shared brain — a wrong entry mis-teaches the other
session too), Rule 31 (a proven-absence finding has a shelf life — re-check, don't cache) and Rule 33
(judge the claim, not the claimant — including my own past conclusions).
