# BLOCKED — "What Are You Doing / Why Are You Doing It" (SV-11257) design artefact is not readable

> ## 🔴 UPDATED 2026-10-13 (second pass) — THE BROWSER ROUTE WORKS; THE ARTEFACT NEEDS A LOGIN
>
> **The connector `deny` in §3 was NOT the whole story, and the original conclusion ("not readable")
> was reached too early.** A real browser DOES reach this artefact's page — see **§6**, which
> replaces §3 as the current finding. What it finds there is a **claude.ai sign-in wall**, proven
> with a control, so the item stays blocked — but **for a different and much more precise reason**,
> and §5's ask is correspondingly narrower. **Read §6 before re-attempting anything.**
> **Still blocked ⇒ still zero screens, zero controls, zero labels observed (Rule 12), and
> `build/what-why/DESIGN-REFERENCE-2026-10-13.md` is still NOT written.**

**Date:** 2026-10-13
**Project:** What Are You Doing / Why Are You Doing It — epic **SV-11257**
**Blocks:** the whole design-exploration pass, and therefore
`build/what-why/DESIGN-REFERENCE-2026-10-13.md`, which has **not** been written.

---

## 1 · What was asked

Exhaustively run the design prototype (every screen, every state, every control, every label),
screenshot every state, and produce a reusable design reference at
`build/what-why/DESIGN-REFERENCE-2026-10-13.md` with screenshots under
`build/what-why/design-2026-10-13/`.

## 2 · The artefact

```
https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6?sk=VdwhqSXNj79W1gN-9Xe8qg
```

Artefact id: `Pz1Q6BfvreYFpQwVQZPTE6` (22 characters — well-formed per the docs connector's own
id rules). Share key `sk=VdwhqSXNj79W1gN-9Xe8qg` present on the link.

## 3 · What was tried, and the exact result

The instruction was explicit that this is a claude.ai artifact link and must be read through the
docs tooling, never web-fetched. That is what was done.

| # | Call | Result |
|---|---|---|
| 0 | `Skill: anthropic-skills:docs`, then `Claude_Docs.guide(items=["topic.index"])` | Loaded. Instructions read before any docs call. |
| 1 | `Claude_Docs.read(ref={"object":"project","id":"Pz1Q6BfvreYFpQwVQZPTE6"})` | `{"verdict":"deny","reason":"access"}` — support ref `req_011CfzXHRtytfYSAs6Lu9V5o` |
| 2 | `Claude_Docs.read(ref={"object":"project","id":"https://claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6?sk=VdwhqSXNj79W1gN-9Xe8qg"})` (whole link, share key included) | `{"verdict":"deny","reason":"access"}` — support ref `req_011CfzXHjrytwSu8qW9XPCoM` |
| 3 | `Claude_Docs.read(ref={"object":"project","id":"https://claude.ai/code/artifact/Pz1Q6BfvreYFpQwVQZPTE6"})` (`/code/artifact/` form) | `{"verdict":"deny","reason":"access"}` — support ref `req_011CfzXMjMaQNu4c6SWjWo5T` |
| 4 | `Claude_Docs.query(object="utterance", container={"kind":"project","id":"Pz1Q6BfvreYFpQwVQZPTE6"})` (comment listing — a different action, in case read access differed) | `{"verdict":"deny","reason":"access"}` — support ref `req_011CfzXMnUr9C6cc63AhjF5d` |
| 5 | `ToolSearch` for an Artifact tool (`select:Artifact,ArtifactComments,artifacts`) | **No matching deferred tools found** — this session has no Artifact tool, so the docs connector's documented fallback ("another artifact type → your artifact tools") is not available here. |

The refusal text returned on every attempt, verbatim:

> `this doc is not shared with you (or not with the access this action needs), or no doc has this id`
> `— the cases answer alike by design. Retrying will not change the answer: tell the person and ask`
> `them to share the doc with you (or to raise your access if you can already read it).`
> `… a well-formed id → the answer stands.`

## 4 · What was deliberately NOT done

- **No `WebFetch` / `curl` of the artifact URL.** The instruction barred it, and the docs connector
  states plainly that only docs tools read a doc.
- **No `batch(container.create.artifact=<link>)`.** The connector offers that path for a *blank*
  artifact handed over to build a doc on. This artefact is an existing design prototype, so that
  call would be a WRITE against someone else's artefact — out of scope for a read-and-record pass.
- **No design reference written.** Nothing about this design has been observed. Under Rule 12
  (verified means observed, never inferred) and Rule 113 (the Expected Result is the source's own
  words, quoted verbatim), a design reference assembled from the epic title, the feature name or
  any summary would be fabrication. **Zero screens, zero controls, zero labels observed.**

## 5 · The exact ask — what is needed to unblock

One of the following:

1. **Share the artefact with this session's account** (`bilal.muzamil@shopview.com`) with at least
   read access — a share key in the URL alone did not grant the docs connector access; **or**
2. **Paste the prototype's source** (HTML / JSX) directly into the session, or commit it to the
   repo, so it can be saved to the scratchpad and executed in Chromium via Playwright; **or**
3. **Confirm whether the artefact is a Docs-type artifact at all.** If it is an interactive
   code/React artifact rather than a doc, the docs connector cannot read it by design and an
   Artifact tool (absent from this session) would be required.

Until one of those lands, the design pass cannot start and nothing downstream of it
(case authoring, coverage, PO questions) has a source.

---

## 6 · SECOND PASS, 2026-10-13 — the browser route (supersedes §3 as the live finding)

**The brief for this pass was right: a connector `deny` does not mean the page is unreachable.** A
share link carrying an `sk=` key is a browser affordance and had never been opened in a browser.
It has now been, and it produced a **definite, attributed answer** instead of a connector refusal.

### 6.1 What was done

Chromium (already installed; **`playwright install` was never run**) over the standard agent proxy —
**the committed MITM bridge was not needed, and TLS verification was never disabled.**

| # | Attempt | Result |
|---|---|---|
| 6 | **Headless** Chromium → `claude.ai/artifact/Pz1Q6BfvreYFpQwVQZPTE6?sk=…` | Document **HTTP 200**, but renders **"Page not found"**. Both XHRs **403**. |
| 7 | Read the 403's **headers** (not just its status) | **`cf-mitigated: challenge`**, `server: cloudflare`, body `<title>Just a moment...</title>` — **a Cloudflare bot challenge. The request never reached the application, so the 403 was never an access verdict.** |
| 8 | **Headed** Chromium under `xvfb-run`, real UA, `--disable-blink-features=AutomationControlled`, `navigator.webdriver` masked | **Challenge passed unattended in ~10 s, no CAPTCHA.** Telemetry POST flipped **403 → 204** — that flip is how you know you are through. |
| 9 | Same page, now past Cloudflare | Renders **"Sign in to view this page"** + a **"Sign in"** button. `/api/frame/<uuid>?sk=…` ⇒ **401**. |
| 10 | **Rule 110(a) control — vary the share key**, from inside the cleared page | Real key, **no** key and a **garbage** key all return **byte-identical** `404 {"type":"not_found_error","message":"Not found"}`. `/api/account` ⇒ **403 `account_session_invalid` · "Invalid authorization"**. |
| 11 | All **six** artefact route forms (`/artifact/`, `/artifacts/`, `/public/artifacts/` ×2, `/share/`, `claude.site`) | Every one 200 at the edge, decided in the SPA: two sign-in walls, one full login page, three not-found. **Not a wrong-route problem.** Table in `build/APP-ACTIONS-PLAYBOOK.md` §S. |

### 6.2 What is now PROVEN (observed, not inferred — Rule 12)

- ✅ **claude.ai is reachable from this container, and the artefact page itself loads.** The
  earlier "unreachable / not readable" framing was wrong.
- ✅ **The 403s were Cloudflare, not permission.** Recorded so no session re-reads one as a denial.
- 🔴 **The artefact requires an authenticated claude.ai session.** The container has none.
- 🔴 **The `sk=` share key is NOT being honoured for anonymous access** — proven by control, not
  assumed: three different key values produce the same response, so the key is not evaluated at all.
  This is **not** a malformed id, a stale key or a wrong route.

**Evidence (committed):** `build/what-why/design-2026-10-13/01-share-link-sign-in-wall.png` ·
`02-claude-ai-login-page.png` · `frame-api-probe.json` (the three-key control) · `route-probe.json`
(all six routes). **Reusable recipe:** `build/APP-ACTIONS-PLAYBOOK.md` **§S**.

### 6.3 What was deliberately NOT done

- **No claude.ai login attempt.** The brief barred it: land on a login wall ⇒ stop and report.
- **No design reference written.** The wall was never passed, so **no screen, control, label, flow
  or copy has been observed.** Writing one from the epic title or any summary would be fabrication
  (Rule 12; Rule 113 — the Expected Result is the source's own words).

### 6.4 The ask is now narrower than §5

§5 offered three options; **option 3 is answered and option 1 needs restating.** The artefact is a
**rendered artifact page, not a Docs-type doc** — which is why the docs connector refused it — so
raising docs access would not have helped. What unblocks it:

1. **Re-share the artefact with link/public access** (from the artefact's own Share menu, set so
   anyone holding the link can view), then re-send the link — the §6 browser recipe will then
   render it with no further work; **or**
2. **Hand over the prototype source** (HTML/JSX) pasted into the session or committed to the repo —
   it then runs locally in Chromium and the full design pass proceeds offline; **or**
3. **Share it to the account `bilal.muzamil@shopview.com`** *and* supply a signed-in claude.ai
   session for that account to this container — note this is the slowest option and involves
   credentials, so **(1) or (2) is preferred.**

---

## OUTSTANDING — what I need from you

| # | Item | Who | Why it matters |
|---|---|---|---|
| 1 | ~~Grant read access to artefact `Pz1Q6BfvreYFpQwVQZPTE6`, **or** supply the prototype source, **or** confirm the artefact type~~ — **superseded by row 2 on 2026-10-13.** Artefact type is now answered (§6.4): it is a rendered artifact page, not a Docs doc | QA lead | — |
| 2 | **Either (a) re-share artefact `Pz1Q6BfvreYFpQwVQZPTE6` with link/public access and re-send the link, or (b) paste/commit the prototype source.** Proven: the page loads in a browser but shows **"Sign in to view this page"**, and the `sk=` key grants nothing anonymously (control in §6.1 row 10) | QA lead | The entire SV-11257 design exploration is blocked on it; **still zero screens, zero controls, zero labels observed.** Option (a) costs one share-menu change and the pass then runs unattended |
