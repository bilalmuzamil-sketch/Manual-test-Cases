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
