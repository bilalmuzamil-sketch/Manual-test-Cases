# Schedule — blocker audit under Standing Rule 68: RESUME

**Pass started 2026-08-13. Scope: Schedule only (TestRail group 4254, 176 cases).**

## THE ONE THING A RESUMING SESSION MUST KNOW

**THE QA SESSION SUPPLIED IN THE BRIEF IS DEAD, AND NOTHING WAS WALKED LIVE THIS PASS.**
`GET https://sv8685api.qa.shopview.com/api/auth/me/fe-permissions` returns **HTTP 401
`{"error":"sso_required"}`** with the supplied cookies. Proof it is the session and not our header
shape is in `BLOCKER-AUDIT.md` §0 (four control probes). **No `quick-login`, no `switch-user`** —
both barred by the brief.

**So steps 2, 3 and 4 of the brief (walk the steps · check the second-sign-in estate · the four
role/staff/settings cases) COULD NOT BE RUN.** Step 1 — the Rule 68 audit — **is complete**, and it
is the deliverable that did not need a session.

## STATE

| | |
|---|---|
| Branch | `claude/slack-session-0sxnd9`, fast-forwarded, was already current |
| TestRail writes this pass | **0** — nothing walked, so nothing earned a re-stamp (Rule 12) |
| Jira calls that create anything | **0** (Rule 62 hold) |
| Live suite | **176 cases, all `created_by = 3`**, 0 foreign |
| Live markers | **READY 137 · READY-EXPECT-FAIL 4 · HOLD 35**; gate 137+4 = 141 = 176−35 ✅ |
| Build running | **`v3.5-84846fa`**, last-mod Wed 12 Aug 2026 21:44:48 GMT, etag `f689bc07afb51892df7b253c08838bfb`, read twice, `index.html` sha256 identical |
| Build our cases name | `v3.5-65d6500` ×151 · `v3.5-7ec992f` ×15 · `v3.5-d122eef` ×10 — **0 of 176 name the build now running** |
| Spec | Confluence 713031682, last edited **Aug 07 2026** — matches the version 27 our cases pin. **CURRENT.** |

## IF YOU ARE RESUMING WITH A LIVE SESSION

Read `BLOCKER-AUDIT.md` first — it tells you which cases are worth your session minutes and which
are not. In priority order:

1. **The 13 "does not exist in this build" cases** — every one of those claims was made against a
   build that no longer runs. `RUNNABILITY.md` §A lists them with the exact control to look for.
2. **The 4 role/staff/settings cases** — C29971, C30080, C30083, C38870. **C30080 is very likely
   NOT session-destroying** (see `BLOCKER-AUDIT.md` §5); do it first, do the other three last.
3. **The 8 second-sign-in cases** — check what the estate already holds before concluding.

**Do NOT re-walk the 4 unticketed-fault cases (C29985, C30004, C30013, C30020).** They are already
walked; only their marker is blocked. See §2.

## THE ACCIDENTAL-DELETE HAZARD, CARRIED FORWARD
**Two previous passes deleted a shift by pressing Delete expecting a confirmation that does not
appear for a non-series shift.** Do not press Delete on a shift unless you have established it is a
series member.
