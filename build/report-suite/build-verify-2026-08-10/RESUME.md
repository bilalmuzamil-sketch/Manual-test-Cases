# RESUME — build verification of the three handed-off reports, 2026-08-10

**Read `BUILD-VERIFICATION-2026-08-10.md` first, then `LABEL-LAYER-2026-08-10.md`.**

## Where it stands

**225 of 225 build-verified** for labels, navigation, named test data and raw markup on
**`v3.5-4795eee`** (marker read three times, byte-identical — the build did not move). **0 unverified.**

**0 TestRail writes, and that is the finding, not a shortfall** — every one of the 82 label candidates
resolved to the build differing from a documented requirement, where Rule 57 requires the case to stand.

**Proven by content, not by timestamp:** none of the 225 was updated during the session (newest
`updated_on` = 20:24Z, before the 22:40Z start) · the three foreign cases in scope (C38919, C38922,
C43572) are untouched · **run 359 holds 476 tests and 535 results with 0 created during the session**,
`include_all` still false, counters unchanged at 6 passed / 0 failed / 0 blocked / 470 untested.

## The access method — do not re-derive it

**The egress proxy resets Chromium's CONNECT tunnels**, so the local-bridge recipe and the
point-Chromium-at-the-proxy recipe both fail on this container. The method that works is in
`tools/README-ACCESS.md`: **intercept every request in Playwright and let Node perform it**
(`NODE_USE_ENV_PROXY=1`), and **seed the sign-in into `localStorage`** from `POST /api/token` +
`/api/staff` + `/api/auth/me/fe-permissions` rather than `quick-login`, which is barred.

**⚠️ THE ONE TRAP IN THAT METHOD, AND IT ALMOST COST A FALSE FINDING:** the app bounces to
`/administration/locations` unless `user.data.details.default_workplace` is set, so it is tempting to
seed one. **`admin@shopview.com` genuinely has `defaultWorkplace: null`**, and the Work In Progress
work-order link is guarded by `!!userHasDefaultWorkplace()`. Seeding a default workplace therefore
**turns on a link the real account does not get** and makes SV-8967 look fixed. It is not.
**Any finding about the WO # link must state which default-workplace state it was taken in.**

## The exact next actions

1. **A second, non-administrator sign-in** — outstanding since 5 August. It is still the single biggest
   lever: it releases C30398, C30446, C43558 and about twenty further observations, and it is the only
   way to finish C43557's first half.
2. **His ruling on C30452** — it asserts the build's Title-Case tab labels against the specification's
   lower case, and contradicts five sibling cases. Moving it is an expectation change.
3. **One authorised one-line edit**: C30436's observation block names the two spreadsheets in lower case;
   the file that arrives is `Technician-Utilization-Summary.csv`.
4. **The seven build deviations** in `LABEL-LAYER-2026-08-10.md` are written up with both texts quoted
   and **nothing was filed** — the creation hold stands until he lifts it.
5. **Not attempted this pass:** exports over the 10,000-row cap, dark mode, and the backend-only nightly
   snapshot cases.

## Nothing to restore

Nothing was seeded, created or modified in the environment. The only state touched was a throwaway
headless browser's own `localStorage`.
