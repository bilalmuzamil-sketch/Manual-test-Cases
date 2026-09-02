# Process-Authoring Standard — how to create ANY process (all projects)

> **Plain-English purpose:** the user's fixed preferences for HOW a reusable process is written.
> Whenever asked to create/save a process, recipe, method, or "the way to do X", follow this
> checklist end-to-end and **do not skip anything**. This operationalises Standing Rules 18
> (reconstruct the FULL originating instruction history) + 19 (human-readable names) + the
> Process Catalog requirement, and is itself a Standing Rule (see CLAUDE.md Rule 21).

## The non-negotiables (mined from the user's own corrections)
1. **Learn from the FULL instruction history — read the RAW TRANSCRIPT, not a summary or memory.**
   Mine every one of the user's own turns on that work (session transcript at
   `/root/.claude/projects/<session>.jsonl`), plus the project memory/state/method docs and the
   relevant Standing-Rule rationale clauses. The summary + generator + memory are NOT sufficient
   on their own — the user caught exactly this ("are you sure you created it from my instructions
   and the discussion?"). Read the transcript and verify line by line.
2. **Capture BOTH: the final accepted FORMAT and the REQUIREMENTS/CORRECTIONS behind it.** Don't
   just reverse-engineer the finished artifact's columns/shape — fold in the originating intent,
   the standards demanded, and especially every correction the user made along the way ("keep it
   simple", "you missed X", "it has to be Y", "check the build first"). Corrections are part of
   the spec.
3. **Do NOT skip anything.** Every process doc includes ALL of: (a) plain-English purpose;
   (b) when-to-use / trigger phrases; (c) a fill-in-the-brackets kickoff prompt; (d) the
   originating instructions + corrections section (Rule 18); (e) the exact deliverable format to
   mirror 1:1 (Rule 16) with a canonical worked example path; (f) numbered steps; (g) reusable
   tooling / a parameterised generator template; (h) guardrails (the ones that actually mattered);
   (i) honesty/observed-not-inferred notes where live work is involved.
4. **Human-readable name** (Rule 19): a descriptive `*-PROCESS.md` / `*-METHOD.md` / `*-RECIPE.md`
   filename spelling out what it does — no cryptic slugs.
5. **Add it to the Process Catalog in the SAME turn** (`build/PROCESS-CATALOG.md`): a row with the
   process name, what it does, how to call it (trigger), the deliverable it produces, and the doc
   path. Keep the catalog complete and current.
6. **Share with the other session** by committing to the repo and indexing it in `CLAUDE.md`
   (the shared brain both parallel sessions read). Note any new durable rule in CLAUDE.md too.
7. **Tell the user how to call it** for other projects (name + trigger phrase), and offer to
   dry-run it.
8. **Reuse, don't reinvent**: if a process already covers the ask, extend/point to it rather than
   duplicating; cross-reference sibling processes so the user can pick the right one.
9. **Build in the live-build-check touchpoints + the always-ask rule (Standing Rule 22).** Every
   process doc MUST call out which of its steps/deliverables need observing the LIVE build
   (labels, controls, behaviour, permissions, calculations, states, "what needs to change",
   VIU, spec-vs-build conformance, comparisons), and MUST instruct: **at the start, ASK the user
   whether to run the live-build check for those items and request the access needed (fresh
   cookies + env/branch + flags) BEFORE proceeding** — never skip it or substitute documented/
   inferred data (Rule 12). If the user declines, LABEL those items "not live-verified this run".
10. **Build in the Confluence-spec check + ask-when-unsure rule (Standing Rule 23).** Every
    reconciliation/verification/authoring process MUST treat the CURRENT Confluence spec as a
    source of truth and, when unsure the local `requirements.md` is current, **ASK the user
    whether to read the Confluence spec** (Atlassian MCP `getConfluencePage`; each project's
    canonical pageId) before proceeding — never assume the local copy is current, never silently
    skip it.
11. **Include the "Self-seed to unblock" section (Standing Rule 14).** Every process that touches
    the build MUST carry a "Self-seed to unblock" section: it self-seeds any missing data state
    (create WOs/lines/parts/adjustments/roles/customer-defaults; discover endpoints by probing
    validation errors; switch UI↔API and use coordinate-clicks for Quasar; clean up after) rather
    than declare "blocked" or ask the user for data. Only a genuinely un-provisionable dependency
    (server 500 on create, external device) is a real blocker — characterised with evidence
    (endpoint + requestId), never bare "NOT VERIFIED"; and only then hand the user a layman
    step-by-step data-setup sheet for the one thing a human/dev must supply.

12. **EVERY HANDOFF EMBEDS THE TOKEN DISCIPLINE CHARTER VERBATIM (Standing Rule 95).** Any session
    handoff you author or revise MUST carry a section titled **"TOKEN DISCIPLINE CHARTER (mandatory —
    Rule 95)"** with **all twelve clauses reproduced VERBATIM** — a session must not have to open
    another file to learn how to spend — plus a pointer to the canonical
    `build/skills/TOKEN-DISCIPLINE-CHARTER.md`. **A handoff without it is NON-COMPLIANT and MUST NOT
    BE ISSUED.** Where a handoff already has a token/quota section, **merge into it, never duplicate**.
    Routers and other skills take the charter **by pointer only**. Authority:
    `build/rules/RULES-61-99.md`.

13. **EVERY HANDOFF EMBEDS "SEARCH BEFORE YOU GIVE UP" (Standing Rule 97).** Any session handoff you
    author or revise MUST carry a section titled **"SEARCH BEFORE YOU GIVE UP (mandatory — Rule 97)"**,
    **INLINE and in full** — a session must not have to open another file to learn how to stop giving
    up. It carries the QA-lead directive verbatim (2026-08-28), the rule that **nothing is reported as
    impossible, blocked, unavailable or unreconstructable until the workspace has been searched with the
    EXACT ERROR TEXT**, the **search drill** (`grep -rn "<exact error string>" build/ --include=*.md` ·
    `grep -rn "<endpoint/tool/symptom>" build/APP-ACTIONS-PLAYBOOK.md build/skills/` ·
    `ls build/BLOCKED-*.md` — several are marked RESOLVED with the cause — ·
    `ls build/*DIAGNOSIS*.md build/*/FINDINGS.md` · `git log --all --oneline --grep="<keyword>"`), the
    **four places in order** (`build/APP-ACTIONS-PLAYBOOK.md` · `build/skills/14-ACCESS-RESILIENCE.md` ·
    `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` · `build/rules/RULES-*.md`, grepped never read whole), the
    duty to **report the searches you ran** when the answer genuinely is not there, the five real
    2026-08-28 false blockers, and the duty to **write a new solution into the playbook or the relevant
    skill IN THE SAME PASS**. **A handoff without it is NON-COMPLIANT and MUST NOT BE ISSUED.** Merge,
    never duplicate. Routers and other skills take it **by pointer only**. Authority:
    `build/rules/RULES-61-99.md`.

## The one-page checklist (tick every box)
- [ ] Read the raw transcript; listed every relevant user turn + correction.
- [ ] Purpose (plain English) + trigger phrases + kickoff prompt.
- [ ] Originating instructions + corrections section written (Rule 18).
- [ ] Exact deliverable format documented + canonical example path (Rule 16).
- [ ] Numbered steps + parameterised generator/tooling.
- [ ] Guardrails + honesty notes.
- [ ] Human-readable filename (Rule 19).
- [ ] Row added to `build/PROCESS-CATALOG.md`.
- [ ] Indexed in `CLAUDE.md`; durable rules noted (shared with other session).
- [ ] Told the user the name + how to call it; offered a dry-run.
- [ ] **If the artefact is a HANDOFF: the Token Discipline Charter's twelve clauses embedded VERBATIM (Rule 95) — without it the handoff must not be issued.**
- [ ] **If the artefact is a HANDOFF: the "SEARCH BEFORE YOU GIVE UP" section embedded INLINE and in full (Rule 97) — drill + the four places + the write-it-down duty; without it the handoff must not be issued.**
