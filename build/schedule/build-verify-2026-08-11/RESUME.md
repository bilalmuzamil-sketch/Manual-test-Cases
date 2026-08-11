# RESUME — Schedule build verification, 2026-08-11 (second attempt)

**Read `BUILD-VERIFICATION.md` first, then `CLASSIFICATION.md`.**

## Where it stands, in one line

**0 of 174 build-verified. 174 remain unverified. 0 TestRail writes, 0 Jira calls, 0 env changes.**
**The token WORKED this time.** A different blocker stopped the pass: **the application redirects
every route to `/administration/locations`.**

## 🔴 THE ONE THING NEEDED — and it is NOT a fresh token

**A way into the app as a user with a `default_workplace`, on `Staging Heavy Duty - 9919`.** Either:

1. **Set a default location on `admin@shopview.com`** (Staff admin → default location → Heavy Duty).
   One field. **Not done by us** — it changes a shared account, and the QA lead's standing
   instruction is *"If the app bounces you, report it rather than engineering around it."*
2. **Or a named QA user that already has one, with a sign-in.**

**Do not ask for another `sv_sso_session`.** It was alive at pass start **and still returned HTTP 200
at pass end**. `quick-login` / `switch-user` never called (barred).

### Why the obvious workarounds are already ruled out — measured, not assumed

- **Permissions are fine** — `scheduleView` + `scheduleCreateAndEdit` + `scheduleDelete` all present,
  42 perms, `view_mode: full`. Not a permission bounce.
- **It is app-wide, not Schedule's** — `/schedule`, `/workorders`, `/customers`, `/reports`, `/parts`
  **all five** land on `/administration/locations`.
- **The cause is the account** — `admin@shopview.com` genuinely has `default_workplace: null` and
  `workplace_id: null` on its staff record.
- **`change-location` is not enough** — returned HTTP 200, top bar read `Staging Heavy Duty - 9919`,
  `localStorage.location` correct. Still bounced.
- **The app's own top-bar switcher is not enough either** — opened it and picked Heavy Duty through
  the UI (`switcher opened: true`, `picked: true`). Still bounced. It sets the session's active
  workplace, not the staff record's default.
- **In-app navigation is not enough** — clicking the `Schedule` nav item bounces too.

## The build and the location

**`v3.5-65d6500`** · last-mod **Tue 11 Aug 2026 09:33:33 GMT** · etag `3250d285ffcf50626363a578fe273071`
· read at pass **start and end**, **byte-identical — 0 moves under the pass**.
**Location: `Staging Heavy Duty - 9919`** throughout, per the QA lead's standing instruction. **No
observation was taken on any other location** — and no observation of the product was taken at all.

## The exact next actions, in order

1. **Get past the bounce** (above). Everything else is blocked behind it — there is no partial subset
   that can be done first, because the specification pins no label wording, so **the build decides
   all 85 asserted strings** (`CLASSIFICATION.md` §2).
2. **Check click-to-arm FIRST** — `button_sidebar_arm_<woId>` / `aria-pressed` / `aria-label` containing
   *"by click"*. **7 cases** unblock if it is back (SV-8957).
   **⚠️ The first harvest's `html_has_arm: false` is INVALID — it was measured on
   `/administration/locations`, not the Schedule page. Do not reuse it.**
3. **Run the label diff — it is mechanical and already built.** `tools/harvest3.cjs` reaches and dumps
   the page vocabulary; `tools/diff_labels.py` then classifies all 85 strings
   EXACT / CASE / VARIANT / ABSENT against `evidence/distinct_labels.txt`. Start with the 9
   capitalisation rows — one page, one menu.
4. **Settle the two internal clashes** (`CLASSIFICATION.md` §1) — `Filter & Display` (C30042) vs
   `Filter and Display` (5 cases), and `VIN` vs `VIN Number`. Both class A → the build decides; both
   are defects in our suite whichever way it falls. `harvest3.cjs` already tries to open that toolbar
   dropdown, which settles both in one screenshot.
5. **Re-confirm the Panel collapse control is still absent** (C43582–C43587) — their stamp names the
   superseded `v3.5-af3a6e1`. **Do not turn their plain `READY` marker back into a prediction.**
6. **Put the 7 capitalisation rows to the QA lead** if the build shows lower case
   (`CLASSIFICATION.md` §2) — but note the corrected test means that **if the build renders
   `Create Event` / `New Work Order` in Title Case, our cases are already right and nothing changes.**

## Hygiene — re-measured LIVE this pass

**Raw markup 0 of 174** · **174 markers, exactly one each** (`READY` 146 · `HOLD` 28; gate
146 = 174 − 28 ✓) · **174 provenance lines, exactly once each** · **174 build stamps** ·
**`custom_atmstatus` = 1 on all 174, none Automated.**

**Re-census before AND after any write** — markup zero is never durable (TestRail re-renders text
into HTML hours later without moving `updated_on`, playbook §J hazard 5).

**Verdict/build split unchanged: 90 on `v3.5-7ec992f` · 78 on `v3.5-d122eef` (gone) · 6 on
`v3.5-af3a6e1`. No case's verdict rests on the build now running.**

## Proofs held

**All 174 cases byte-identical** start to end, `updated_on`/`updated_by` included — **0 field diffs**.
**Run 357 untouched BY CONTENT**: `include_all` false, 174 tests, test-id and case-id sets equal both
directions, **458 results all present by ID, 0 missing, 0 new, 0 field changes**, counters unchanged
25/0/1/148. Snapshots: `evidence/cases-174-{START,END}.json`, `evidence/run357-*-{START,END}.json`.

## Tooling gotcha found (worth the playbook)

`/tmp/trlib.py`'s `getall()` appends `?limit=…`, but the TestRail URL `index.php?/api/v2/…` **already
contains a `?`** — so every paginated call double-`?`s and returns **HTTP 400**. `get_case` is
unaffected (no pagination), which disguises it as a partial outage. **Paginate with `&`.**

## Nothing to restore

Nothing seeded, created or modified anywhere — **no data, no role, no setting, and no default
workplace.** `change-location` is session-scoped and leaves no residue. The product was never reached.
