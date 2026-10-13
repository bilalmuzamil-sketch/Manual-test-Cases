# BLOCKED — "What Are You Doing / Why Are You Doing It" (SV-11257) design artefact is not readable

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

## OUTSTANDING — what I need from you

| # | Item | Who | Why it matters |
|---|---|---|---|
| 1 | Grant read access to artefact `Pz1Q6BfvreYFpQwVQZPTE6`, **or** supply the prototype source, **or** confirm the artefact type | QA lead | The entire SV-11257 design exploration is blocked on it; no screen, control or label has been observed |
