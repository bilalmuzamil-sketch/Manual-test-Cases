# Filters — RESUME, 2026-08-12

## STATE IN ONE LINE

**115 ours / 120 live. Build `v3.6-3e9dd6d`, unmoved. 1 `update_case` (C43590), byte-verified. 0 add,
0 delete, 0 run writes, 0 results, 0 Jira. 9 of 29 priority cases fully walked, 13 more with every
named control verified, 7 not walked. Markers 90 READY + 7 EXPECT-FAIL + 18 HOLD, gate closing both
ways at 97.**

Read **`COMPLETION-REPORT.md`** first — it is the Rule-67 table. Then `RUNNABILITY.md` (what was
walked and what was not), then `DIVERGENCES.md` (the one correction, the one raised deviation).

## WHAT THE NEXT PASS SHOULD DO, IN ORDER

1. **File the C38897 ticket the moment the creation hold lifts.** The empty state offers no separate
   clear-the-search control, against spec v19 `S8-R4`/`S8-R5`. Evidence, with the rule-out that makes
   the absence meaningful, is in `evidence/empty-state.json`. It is the only unticketed real deviation
   this pass found.
2. **Finish the 7 remaining priority cases** — C29619, C38876, C38879, C38886, C43560 are ordinary
   work; **C29581 and C29588 need a staff record deactivated, which is barred on this branch** and
   should be handed to a tester rather than attempted.
3. **Walk the other 86.** Nothing beyond the 29-case priority set has been examined for runnability.
4. **Then, and only then, consider the re-stamp.** 92 cases still name `v3.4.2-d00239b`. The bar is
   unchanged and is not negotiable: **re-stamp only where the case's own quoted labels were compared
   against a harvest from this build.** A case merely present during a pass was not checked.

## THE HARNESS IS BUILT AND WORKS — DO NOT REDERIVE IT

`tools/harness.cjs`, adapted from the Schedule tool. **0 bridge errors on every run today.**

- `node harness.cjs <tag> <path> [admin|tech]` for a plain page load
- `probe_wo.cjs`, `probe_steps.cjs`, `probe_empty.cjs`, `probe_batch2/3/4/5/6.cjs` for the walks
- Viewport is a parameter — `makeHarness('admin', {width:390,height:844})` gives the phone

**Estate values, all read live and recorded in `evidence/estate-read.json`:** org
`d55bc308-…`, workplace `b3c8c820-…` (**Staging Heavy Duty - 9919**, the standing default), admin user
`0eabf741-…` / staff `ccbacb31-…`, tech user `02ea3b69-…`. They match Schedule's because the org is
shared — that was **confirmed, not assumed**.

**The hydration fix matters:** the bundle reads the org id from
`localStorage["user"] → .data.details.intercom_data.company.id` and blocks every request for a truthy
user with no `default_workplace`. Admin's own staff record carries `defaultWorkplace: null`, so the
harness seeds it. **Nothing asserted here depends on that seed** — the Filters cases concern the filter
bar, not anything gated on a default workplace.

## TRAPS THIS SESSION PAID FOR — DO NOT PAY AGAIN

1. **Quasar leaves stale empty `.q-menu` nodes mounted.** Take the last **visible, non-empty** one.
2. **The Status options are checkbox `label`s, not `.q-item`.** A `.q-item` selector finds nothing and
   **cannot fail**, so it silently reports "not disabled" for chips it never touched.
3. **Quasar paints button hover on the `.q-focus-helper` child and its `::before`/`::after`.** Reading
   the button's own `backgroundColor` shows no change and is wrong.
4. **The tabs' outer element says `text-transform: uppercase`; the inner `.q-tab__label` says
   `capitalize` and overrides it.** The tester reads *All*, not *ALL*. Do not "correct" those cases.
5. **Filter state persists per user and bleeds between probe steps.** Row counts taken after an earlier
   step's search are worthless — clear between checks, or read the URL.
6. **Arriving at `/workorders?tab=all` is itself close enough to a shared-link visit** that
   `back_to_saved_filters` appears. Test arrivals separately: plain URL, in-app nav click, and a
   filter-carrying URL.
7. **The Bash tool times out at 120 s by default** regardless of the `timeout` command — set the tool's
   own timeout for a long probe.

## THINGS ANOTHER ACTOR IS DOING TO THIS PROJECT RIGHT NOW

**Run 352 moved before this session started and kept moving during it:** 115 → 120 tests, 473 → 635
results. 154 of the new records are **assignment records** written under our shared account
(09:09–11:07 UTC) putting **all 115 of our tests on user 7**; the rest are user 7 grading. **Someone is
preparing the run for the tester.** Do not "correct" any of it.

## SESSIONS

Cookies live only in `/tmp/qa-cookies/filters-{admin,tech}.txt`, `chmod 600`, never in the repository.
`/tmp` is wiped by a container restart — rewrite them from the brief. **Both identities were proven
distinct this session**: 42 permissions / `view_mode: full` / `GET /api/staff` **200** against **6** /
`tech` / **403**, and different emails. **`quick-login` and `switch-user` were never called.**
