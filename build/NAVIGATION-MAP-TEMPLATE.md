# NAVIGATION MAP — `<PROJECT NAME>` (TEMPLATE — copy to `build/<project>/NAVIGATION-MAP.md`)

> **WHAT THIS FILE IS.** How each screen in this project is **actually reached on the build** —
> observed once, live, and written down so no later session rediscovers it (Rule 27). Navigation is
> one of only **two things we take from the build at all** (Rule 57: the on-screen labels/navigation,
> and the pass/fail verdict).
>
> **READ IT BEFORE YOU NAVIGATE. WRITE TO IT THE MOMENT A PATH IS CONFIRMED** — in the same pass, not
> at the end (Rule 93). It is a small file; reading it costs a fraction of rediscovery, which is why
> this is a token-discipline win rather than overhead (Rule 88 / the Token-Discipline Charter).
>
> **Convention in full:** `build/skills/03-RUN-CHECK.md` §9. **Shared, cross-project staging paths live
> in `build/APP-ACTIONS-PLAYBOOK.md` ("Navigation Map")** — if a path is genuinely general, put it
> there and point at it from here rather than duplicating it.

**Project:** `<project>` · **Epic:** `<SV-xxxx>` · **Branch(es) covered:** `<branch>` ·
**Map started:** `<YYYY-MM-DD>` · **Last appended:** `<YYYY-MM-DD>`

---

## 🛑 THE GUARDS — read before adding a row

- **A path is written ONLY after it was navigated successfully and OBSERVED LIVE** (Rule 12). **Never
  infer a path from product source code, from a spec, from a design, or from another branch** — that is
  the Rule 57 trap: a route that exists in code may not be deployed, or may not be flag-enabled, on the
  branch under test.
- **NAVIGATION ONLY — never expected behaviour.** Expected behaviour comes from the documents (Rule 57).
  **A row in this file is never cited in a case's Expected Results or in its provenance line.**
- **PATHS ARE BRANCH-SPECIFIC.** Do not reuse a path recorded on one branch for another without
  re-observing it. Observed on a second branch ⇒ **add its own row; never overwrite the first.**
- **FRESHNESS CARRIES THE RULE 91 BADGE, WITH THE DATE:** **✅ ≤7 days · 🟠 8–14 days · 🔴 >14 days ·
  ❌ never observed.** A stale row is still usable **as a starting point**; if it fails, **re-observe,
  correct the row, and commit the correction in the same pass** (Rule 93) — **never leave a known-wrong
  path for the next session.**
- **This map is a convenience for REACHING a screen. It is never evidence that a feature WORKS** — the
  pass/fail verdict still comes from observing the feature itself.
- Menu paths are written in **the build's own on-screen labels**, exactly as they read (Rule 9) — never
  a tidied-up or remembered wording.

---

## THE MAP

| Feature / screen | Exact menu path (build's own on-screen labels) | URL | Branch + build marker observed on | Date observed | Badge | Recorded by (session / lane) |
|---|---|---|---|---|---|---|
| `<screen name>` | `Top nav → <Label> → <Label>` | `<https://…/route>` | `<branch> · <vX.Y-sha>` | `<YYYY-MM-DD>` | `<✅/🟠/🔴>` | `<session / lane>` |

*(Delete the example row once the first real one is observed. If a screen has not been reached yet,
either leave it out or list it with badge **❌ never observed** and no path — never a guessed path.)*

---

## NOTES AND GOTCHAS (optional, navigation-related only)

Anything that affects **reaching** a screen and would otherwise cost the next session time — a
permission that hides a nav item, a sub-route that only loads with a parent record open, a route that
bounces on direct entry. **Not** behaviour, **not** expectations, **not** verdicts.

- `<gotcha, with the date and branch it was observed on>`
