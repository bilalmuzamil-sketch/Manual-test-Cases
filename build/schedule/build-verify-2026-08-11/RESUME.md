# RESUME — Schedule build verification, 2026-08-11

**Read `BUILD-VERIFICATION.md` first, then `CLASSIFICATION.md`.**

## Where it stands, in one line

**0 of 174 build-verified. 174 remain unverified. 0 TestRail writes, 0 Jira calls.**
The session died 14 minutes in, before the Schedule page loaded once.

## 🔴 THE ONE THING NEEDED — and it is the only blocker

**A fresh `sv_sso_session` for `.qa.shopview.com`.** Ask for **that value by name**.

**Do not ask for a fresh `cf_clearance` — it will not fix this, and that is proven, not assumed.**
The three-part dead-shared-token signature from playbook §A was checked in full:

1. **All three branches 401 together** on the byte-identical shared token — `sv8685api` (Schedule),
   `sv8785api` (Filters), `sv8582api` (Report Suite). One branch alone would be trap 4, not this.
2. **The refusal is the application's own JSON from nginx** — `content-type: application/json`,
   `server: nginx/1.30.4`, body `{"error":"sso_required",…}`. It **reached the application**, so
   Cloudflare is not the problem (that returns an HTML challenge).
3. **Nothing returns 409**, so it is not a per-branch `PHPSESSID` mismatch.

Polled 8× over ~2 minutes and again later — 401 every time. `quick-login` was **not** called (barred,
and itself SSO-gated).

## The build

**`v3.5-65d6500`** · last-mod **Tue 11 Aug 2026 09:33:33 GMT** · etag `3250d285ffcf50626363a578fe273071`
· sha256 `9348ca09d6167375dc52bfc29bf3b9f8c4163dede2ea5ea62269b186c9cc5f6f` · read once at
**11:05:35Z**. **It moved** — the brief expected `v3.5-af3a6e1`. **No case's verdict rests on the
build now running** (90 on `v3.5-7ec992f`, 78 on `v3.5-d122eef` which no longer exists, 6 on
`v3.5-af3a6e1`).

## The exact next actions, in order

1. **Boot and load `/schedule`.** Tools are built and ready: `tools/mkuser.py` then a script using
   `tools/boot.cjs`. Run with `NODE_USE_ENV_PROXY=1` and allow **~7 minutes** — the first page load
   is slow while `/tmp/assetcache` is cold.
   **⚠️ Expect the `/administration/locations` bounce** — `admin@shopview.com` genuinely has
   `default_workplace: null`. **Do NOT fake one into the seed** (it turns on behaviour the real
   account does not get — it produced a false "fixed" reading on the Report Suite). Use the app's own
   `POST /api/iam/change-location {workplace_id, workplace_timezone}` with
   `b3c8c820-f815-4cf1-8938-10956c5ee71a` / `America/Edmonton`.
2. **Check whether click-to-arm is back.** Highest-value single check: **7 cases** are held only
   because a drag cannot be completed and the click alternative was removed (SV-8957). If it has
   returned, all 7 become drivable. Look for `button_sidebar_arm_<woId>` / `aria-pressed`.
3. **Run the label comparison — it is mechanical now.** `evidence/labels.json` holds all 195 mentions
   of 85 distinct strings across 82 cases, tagged by field; `evidence/partition.json` splits them
   **49 spec-exact / 9 capitalisation-differs / 27 absent-from-spec**. Harvest the page vocabulary,
   diff, and classify with `CLASSIFICATION.md`'s A/B/C table.
4. **Settle the two internal clashes** (`CLASSIFICATION.md` §1) — `Filter & Display` vs
   `Filter and Display`, and `VIN` vs `VIN Number`. Both are class A, so the build decides; both are
   defects in our suite whichever way it falls.
5. **Re-confirm the Panel collapse control is still absent** (C43582–C43587). Owed — their stamp names
   `v3.5-af3a6e1`, which is superseded. **Do not turn their plain `READY` marker back into a
   prediction; the note telling the tester to record what they find is correct and deliberate.**
6. **Put the 7 class-B capitalisation rows to the QA lead** (`CLASSIFICATION.md` §2) — `Create Event`
   / `New Work Order` in Expected Results against the spec's lower case. Left unchanged following the
   Report Suite C30452 precedent, because moving them changes an expectation.

## Hygiene already measured live — no need to redo

**Raw markup 0 of 174** (all four fields, every case) · **174 markers, exactly one each** ·
**174 provenance lines, exactly one each** · **174 build stamps** · **`custom_atmstatus = 1` on all
174, none Automated** · markers **READY 146 · HOLD 28**, gate passes both ways (146 = 174 − 28).

**⚠️ Raw markup is never durable** — TestRail re-renders text into HTML hours after a write without
moving `updated_on` (playbook §J hazard 5). **Re-census before and after any write.**

## Proofs held

**All 174 cases byte-identical** start to end, `updated_on`/`updated_by` included — 0 fields changed.
**Run 357 untouched by content**: 174 tests, 458 results all present by ID, 0 changed, 0 new,
`include_all` still false, counters 25/0/1/148 unchanged. Snapshots in `evidence/`.

## Nothing to restore

Nothing seeded, created or modified anywhere — the application was never reached.
