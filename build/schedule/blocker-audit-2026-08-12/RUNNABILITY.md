# Schedule — runnability

## 🔴 THE HEADLINE: NOTHING WAS WALKED THIS PASS, AND NO RUNNABILITY CLAIM IS MADE

**Zero of the 176 cases had their steps walked in this pass.** The QA session supplied in the brief
returns **HTTP 401 `sso_required`** (proof: `BLOCKER-AUDIT.md` §0), and the five runnability checks —
precondition reachable · navigation path exists · each control where the step says it is · steps work
in the order written · labels are the ones on screen — **every one of them requires the running
application.**

**So this file records what is now KNOWN to need walking, and why — not what was found.** Under
Rule 12 an unobserved case stays unobserved, and no figure here may be read as coverage.

**The union total carried forward from previous passes is unchanged at 147 of 176 walked.** This pass
adds **0**. It does, however, **subtract 4 from the reported remainder** — see §A.

---

## §A — FOUR CASES SHOULD MOVE FROM "REMAINING" TO "WALKED, MARKER PENDING"

**C29985 · C30004 · C30013 · C30020.** Each states in its own expected results: *"This has been
checked on the build and reported to the QA lead, but it does not have a ticket number yet."* A fault
cannot be observed without running the steps.

**These do not need your session.** They need **one ticket number each**, and Jira creation is under
the Rule-62 hold. **Do not spend live minutes re-walking them.**

⇒ **Reported remainder 29 → 25.**

---

## §B — THE PRIORITY WORK-LIST FOR THE NEXT LIVE SESSION

Ordered by value per minute. **§B1 is cheap and may close cases outright; §B4 is destructive and goes
last.**

### B1 · Re-check thirteen "not in this build" claims — CHEAPEST, HIGHEST VALUE

The branch is on **`v3.5-84846fa`** (12 Aug 21:44 GMT). These claims were measured on
`v3.5-65d6500` or `v3.5-7ec992f` — **one or two deploys ago**. Each is a single look:

| Cases | Look for | Spec anchor |
|---|---|---|
| C43582–C43587 (6) | a **borderless panel-left icon button, first item in the grid toolbar, left of Today**; tooltip *"Hide panel"* / *"Show panel"* | **§5.3** |
| C29973, C29974, C29975 | an **Unassigned row inside the grid** (an in-grid lane, not a separate tray) | **§3.2** |
| C29929 | a **collapsible department group header** | **§3.2** |
| C29945 | a **Priority filter offering High / Medium / Low** in the sidebar Filter | **§5.1** |
| C30050 | **Tech Hours** toggle showing each technician's hours next to their name | **§9** |
| C38868, C38869, C38871 | Dashboard schedule row · appointment at WO creation · Priority field on the WO form | — |

**🔴 Rule out the harness before recording any absence.** More than forty-five false absences were
caught in two days. For each: **state what makes the current state one where the control should
appear, and prove the check can fail** (find a control you know exists using the same probe). Record
**"not established"** rather than a finding. **Never invent a step.**

### B2 · Walk the three PO-blocked cases — the verdict is blocked, the walk is not

**C29983 · C30089 · C43555.** Walk all five checks and record runnability. **Do NOT lift their
`AUTOMATION: HOLD`** — the product question is genuinely open (the spec contradicts itself: **§4.5**
*"not skipped in V1"* vs **§12** *"block the spread step"*). **Do NOT touch their expected results.**

*C30089 carries a second, separate blocker — the shop-closure setting is absent from the build — so
it belongs in B1's re-check too.*

### B3 · The eight second-sign-in cases — check the estate FIRST, before concluding anything

**C30076 · C30077 · C30078 · C30079 · C30081 · C30084 · C30614 · C38926**, plus **C30044**.

**Start read-only: `GET /api/staff` (96 active / 66 deactivated at the last count).** On Filters the
equivalent group needed **no new user at all — 17 inactive staff already existed.** Specifically:
**C30084** wants a **Time Clock staff setting**, not a permission; **C30044** wants *"a user with no
staff record of their own"*. Either may already exist.

Then walk the **positive** half from the administrator session (the control exists and behaves for a
holder) and the runnability of every step. The **negative** half needs the second sign-in.

### B4 · The four role/staff/settings cases — LAST, and C30080 first among them

**Do these only after everything in B1–B3 is committed and pushed.**

1. **C30080 first — it is probably free.** It creates *a ZZAUTOTEST custom role nobody holds* and
   never edits the administrator's own role, so the known session-destroying mechanism (editing a
   role a user **holds**) should not fire. **Reasoned, not measured.**
2. Then **C29971** (settings: clear tech hours + business hours), **C30083** (staff departments),
   **C38870** (staff multi-location) — each a write that may end the session.

**🔴 Do not edit `admin@shopview.com`** — its working hours and default location were configured
deliberately by the QA lead and cases depend on them. **Prefer a throwaway `ZZAUTOTEST` staff
member.** Seeding is authorised; no restore, no cleanup required.

**Write `RESUME.md` in full and push BEFORE the first destructive write.**

---

## §C — THE HAZARD THAT HAS ALREADY BITTEN TWICE

**Two previous passes deleted a shift by pressing Delete expecting a confirmation that does not
appear for a non-series shift.** A series member prompts for scope; a lone shift just goes.
**Establish series membership before pressing Delete.** Do not be the third.
