# Schedule full live VIU — RESUME

> ## ⚠️ READ THIS BLOCK FIRST — it supersedes the older text below (updated 2026-08-06, session 2)
>
> **141 of 168 observed. 27 remain. STILL ZERO TESTRAIL WRITES** — proven this session by re-reading
> all 168 live and comparing every field: **0 cases differ, including `updated_on`**. Nothing is
> half-written and no repair is owed.
>
> **Build: `v3.5-7ec992f`**, last-modified Wed 05 Aug 2026 22:49:36 GMT, etag `e2a80a6ab5e0b47c29fd88af9db1e980`,
> `index.html` sha256 `66e91c52…dbbc53`. Read at **04:58Z and 05:34Z** — identical. **No redeploy.**
>
> **Access works.** Cookie header must be built as `'; '.join(lines)` — `paste -sd'; '` corrupts it.
> Probe `GET https://sv8685api.qa.shopview.com/api/auth/me/fe-permissions` → 200, 42 permissions.
> `POST /api/quick-login` has never been called and must not be.
>
> ### THE 27 STILL TO OBSERVE — re-derived, do not trust blindly
>
> * **Permissions (11)** — `C30074` `C30075` `C30076` `C30077` `C30078` `C30079` `C30081` `C30082`
>   `C30083` `C30084` `C30614`. **Nearly all need IMPERSONATION** (sign in AS a holder of each tier).
>   Rule 26 groundwork is already DONE: all 9 in-scope roles were read and are **at template**
>   (Reset To Template leaves Save disabled), so no reset is owed before observing.
> * **Edge Cases and Responsiveness (7)** — `C30086` `C30087` `C30088` `C30089` `C30090` `C38865` `C38866`.
> * **Cross-Module and Rewrite Regression (5)** — `C38867` … `C38871`.
> * **API — Schedule (4)** — `C38872` … `C38875`. **Rule 51: an API-only fault is NOT filed** — it
>   goes to `API-ASK.md` and is raised as an ask.
>
> ### Settled in session 2 — do NOT redo these
>
> `C38847` PASS · `C38849` PASS · `C29970` PASS (was HELD) · `C29969` PASS (was BLOCKED) ·
> `C30047` PASS (was DEVIATION — **SV-8923 is invalid**) · `C30050` DEVIATION (SV-8851) ·
> `C30045` DEVIATION (**SV-8941 filed**) · `C30080` PASS · `C38926` **PARTLY OBSERVED**
> (items 1–2 pass; items 3–4 need impersonation and are NOT claimed).
>
> ### Tickets
>
> **Filed this session: [SV-8933](https://shopview.atlassian.net/browse/SV-8933)** (working hours
> unreachable for staff of another location, parent SV-8699) and
> **[SV-8941](https://shopview.atlassian.net/browse/SV-8941)** (Month view shows the VIN, parent
> SV-8690). Both 12/12 field checks PASS.
> **[SV-8923](https://shopview.atlassian.net/browse/SV-8923), which we filed earlier today, is
> INVALID — recommend withdrawal.** See `SV-8923-SHOULD-BE-WITHDRAWN.md`. Not actioned.
>
> ### The working-hours "regression" is CLOSED — see `TECH-HOURS-RESOLVED-2026-08-06.md`
>
> It was three separate things: the save failure was **our own harness bug** (the Save button was
> never scrolled into view); the grid showing no hours is **SV-8851**, still Open; and the load
> failure is **location scoping**, now SV-8933. **`TECH-HOURS-REGRESSION-2026-08-06.md` is
> SUPERSEDED** — kept only as the record of what was first seen.
>
> ### Environment changes left in place (recorded in `CHANGES-MADE.md` §batch 8)
>
> **Shop business hours are now SET** on Staging Heavy Duty - 9919: **06:00–18:00 Mon–Fri**
> (previously OFF, none at all). Three cases were held or mis-verdicted because of that gap, so if a
> later pass expects an unconfigured shop, **this is why it is not**. Two test shifts were created on
> Mon 2026-08-03 and left in place.
>
> ### Two method traps that cost real time — do not repeat them
>
> 1. **Always `scrollIntoViewIfNeeded()` before a coordinate click.** A click that misses looks
>    exactly like a feature that does nothing. This produced a false "saving does not persist" defect.
> 2. **Quasar checkbox state lives on the ROOT element's `aria-checked`** (and a
>    `q-checkbox__inner--truthy` class). The hidden `<input type=checkbox>` reads `checked=false` even
>    when the permission is ON — it reported 9 of 11 roles wrongly.
> 3. **`/api/staff` rows carry BOTH `id` and `staff_id`.** The working-hours endpoint wants
>    **`staff_id`**. Using `id` returns 404 for everybody and looks like a total outage.
>
> ### Still owed after the 27
>
> **The 25 stale deviations from batches 1–5 have STILL not been re-driven** — they sit on
> `v3.5-d122eef`, which no longer exists. Then the 168 TestRail writes. Both unchanged from below.


## State in one paragraph

**137 of 168 observed, of which ONE (C30050) is re-opened as unsettled. 31 remain. STILL ZERO TESTRAIL WRITES** — every verdict lives only in
`evidence/batch*/VERDICTS.json`, so nothing is half-written and no repair is owed. The write pass
begins only once observation is complete, per the standing instruction.

## Session and access — the 401 was ours, not the server's

**The cookies work.** The 401 that stopped the 2026-08-06 attempt was a **malformed cookie header we
built ourselves**: `paste -sd'; '` alternates the two delimiter characters, producing `A=1;B=2 C=3`
and losing the third cookie. Build the header as `'; '.join(lines)` and it returns **HTTP 200** first
try.

**Confirmed diagnostic:** against the set that had 401'd, `sv_sso_session` and `PHPSESSID` were
byte-identical and only **`cf_clearance`** had changed. **On a 401 here, ask for a fresh
`cf_clearance` before assuming the sign-in is dead.**

* Cookie file `/tmp/schedule-viu/ck.txt`, chmod 600, **one line**, `name=value; name=value; …` —
  the harness does `COOKIE.split('; ')`, so the multi-line form silently breaks it.
* **Probe the `…api.` host**: `GET https://sv8685api.qa.shopview.com/api/auth/me/fe-permissions`.
  The **app** host answers 200 on any path because it serves the SPA shell.
* **`POST /api/quick-login` has never been called** and must not be — a sibling Report Suite worker
  shares this `sv_sso_session` and quick-login rotates it.

## Build

**`v3.5-7ec992f`** · last-modified **Wed 05 Aug 2026 22:49:36 GMT** · etag
`e2a80a6ab5e0b47c29fd88af9db1e980`. Read at session start **and** end on 2026-08-06 — the served
`index.html` is **byte-identical on sha256** (`66e91c52…dbbc53`). **No redeploy under this session.**

| Half | Cases | Build | Date |
|---|---|---|---|
| Batches 1–5 | **97** | `v3.5-d122eef` — **superseded, gone** | 8/5/2026 |
| Batches 6, 7, 7b | **40** | **`v3.5-7ec992f`** | 8/6/2026 |
| Not observed | **31** | — | — |

## Harness (works — rebuild takes two minutes)

```
# 1. cookie header, ONE LINE
python3 -c "print('; '.join(l.strip() for l in open('/tmp/schedule-viu/ck.txt') if l.strip()))"
# 2. MITM bridge — must be started as a BACKGROUND TOOL CALL; `setsid` inside a
#    foreground call is killed with the call. Port lands in bridge-port.txt.
cd /tmp/schedule-viu && NODE_USE_ENV_PROXY=1 exec node bridge.mjs 0 > bridge.log 2>&1
```
`/tmp/sv/h.mjs` exports `boot / go / api / dump / texts / shot`. Playwright resolves from
`/opt/node22/lib/node_modules/playwright`; Chromium at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. TestRail helper `/tmp/testrail/tr.py`.

## THE 31 STILL TO OBSERVE — re-derived from the live 168 minus recorded verdicts

**Do not trust this list blindly; re-derive it the same way.** Pull the 168, load every
`evidence/batch*/VERDICTS.json`, subtract.

* **Working Hours (2)** — `C38847` SCH-HRS-01, `C38849` SCH-HRS-03. **Both need shop business hours
  set on Edit Location**, which is a shared setting — do them with `C29970` below, and last.
* **Permissions (13)** — `C30074` … `C30084` (SCH-PERM-01…11), `C30614` SCH-PERM-12, `C38926`
  SCH-PERM-13. **Rule 26 applies to all of it: reset each in-scope role to template BEFORE
  observing, record before/after, and record what you leave it in.**
* **Edge Cases and Responsiveness (7)** — `C30086` … `C30090`, `C38865`, `C38866`.
* **Cross-Module and Rewrite Regression (5)** — `C38867` … `C38871`.
* **API — Schedule (4)** — `C38872` … `C38875`. **Rule 51: an API-only fault is NOT filed — it goes
  to `API-ASK.md` and is raised as an ask.**

## Then: the 25 stale deviations, still NOT re-driven

All were seen on **`v3.5-d122eef`, which no longer exists**. **None was re-checked this session.**

C29927 SCH-NAV-03 · C29939 SCH-WOL-04 (SV-8873) · C29946 SCH-FILT-05 (SV-8857) ·
C29960 SCH-DND-06 (SV-8840) · C29967 SCH-SCOPE-05 (SV-8886) · C29982 SCH-SPREAD-06 (SV-8855) ·
C29984 SCH-SPREAD-08 · C29985 SCH-SPREAD-09 · C29987 SCH-SER-01 · C29988 SCH-SER-02 (SV-8849) ·
C29998 SCH-LANE-03 (SV-8850) · C29999 SCH-LANE-04 (SV-8850) · C30001 SCH-DAY-01 (SV-8837, **and now
also SV-8915**) · C30004 SCH-DAY-04 (SV-8856) · C30009 SCH-MODAL-02 (SV-8833) ·
C30010 SCH-MODAL-03 (SV-8834) · C30013 SCH-MODAL-06 · C30014 SCH-MODAL-07 (SV-8852) ·
C30016 SCH-EVT-01 · C30020 SCH-EVT-05 · C30021 SCH-EVT-06 · C30034 SCH-TIP-01 · C30035 SCH-TIP-02 ·
C30036 SCH-TIP-03 · C43554 SCH-NAV-08 (SV-8863).

**This session proved the risk is real, twice over:** SV-8853's two faults are gone while its cases
still carry `EXPECT-FAIL`. Expect more of the 25 to have been fixed.

The other **72** from that period are passes and carry forward on the old marker; their provenance
sentence 2 must name **`v3.5-d122eef` / 8/5/2026**, never today's build.

## ⚠️ THE WORKING-HOURS SERVICE LOOKS BROKEN — and C30050 is RE-OPENED

`TECH-HOURS-REGRESSION-2026-08-06.md`. Three symptoms on `v3.5-7ec992f`, one likely cause: the grid
shows **0 of 23** technician-hours rows with the toggle on and no hours anywhere in the board
payload; **saving a technician's hours does not persist**; and one staff member's hours **cannot be
loaded at all**. **Our own edit is RULED OUT** — the stored value never moved.

**C30050 SCH-VIEW-09 must NOT be written either way** until this is resolved. Its PASS earlier the
same day, and the accompanying report that **SV-8851's fix had shipped while its ticket sat Open**,
may both have been taken during a healthy window of a flapping service.

**Owed before any ticket:** a network capture of the failing request, a duplicate search across the
epic, and a scope check (one location or the whole org — Lethbridge and Heavy Duty both fail).

## The working-hours blockers — NOT removed, and the reason has CHANGED

* **SCH-START-01 = C29969** — **still blocked, for a NEW reason.** The plan was to give one
  technician a distinct window. It was attempted on Ayesha Khan AK and **the save does not
  persist** — her Monday still reads its original 07:00 – 21:00. A distinct window cannot be
  created through the UI while the working-hours service is failing. **Record the new reason; the
  old one ("every technician has the identical 07:00–19:00 window") is superseded.**
* **SCH-START-02 = C29970**, with **C38847** and **C38849** — still HELD on the shop having no
  business hours. **Check whether the Edit Location business-hours screen is backed by the same
  failing service before assuming these are merely unstarted.** If it works, set them **LAST** —
  it is a shared setting that invalidates batch 5's working-hours observations — and record the
  BEFORE state.

## Then, and only then, the TestRail write pass

**NO TESTRAIL WRITE HAS BEEN MADE. Nothing is half-written.**

When it starts:

* Take a **FRESH** pre-write snapshot of all 168 and **commit it before any write**
  (`snapshots/PRE-cases-168.json` is from 5 Aug and other passes have run since).
* **Send all three text fields (`custom_preconds`, `custom_steps`, `custom_expected`) on EVERY
  `update_case`** — TestRail re-renders any omitted text field into `<p>` + CRLF, intermittently.
* **Prove untouched cases by comparing CONTENT, never by `updated_on`** — a sibling project found 14
  cases whose content changed while the timestamp stayed frozen.
* `refs` is the one declared exception: verify under `','.join(p.strip() for p in s.split(','))`; a
  single comma-entry over 248 chars returns HTTP 400.
* **Rule 54 — two sentences that never merge.** Sentence 1 names ONLY documents. Sentence 2 is
  "Last checked against build `<marker>` on `<date>`" **with the marker THAT case was actually seen
  on** — so **97 cases say `v3.5-d122eef` / 8/5/2026** and the rest say `v3.5-7ec992f`. Barred:
  "as per the build tested on", "verified by the build", and "passed"/"verified" on a failing case.
* **Every EXPECT-FAIL case gets the three-outcome block** — see
  `EXPECT-FAIL-BLOCK-REQUIREMENT.md`. Symptom, then the three outcomes, placed with the deviation
  note **before** the provenance line; the `AUTOMATION:` marker still goes last.
* **Run 357** (Ayesha Khan, 168 tests, 429 results): **zero result writes, zero run writes** unless a
  case is added.

## Known-good facts (keep — all re-proven or newly learned)

* **Cookie header must be one line**; `paste -sd'; '` corrupts it (see above).
* **Series create:** `POST /api/schedule/shifts {workOrderId, lineIds[], staffId, startDate,
  startTime, spreadMode:'single'|'series', totalMinutes, perDayMinutes, isAllDay}` → 201.
  `spreadMode:'multi'` is rejected. A 4800-minute series at 480/day materialises as **10 shifts**.
* **Board:** `GET /api/schedule/board?from=<ISO instant>&to=<ISO instant>` — a bare date is rejected.
* **Toolbar search** is `input_schedule_search`, placeholder **"Search work orders..."**; the
  sidebar's is `input_sidebar_search`, **"Search work orders"** with no ellipsis. Easy to confuse.
* **Filter and Display** = `schedule_filter_display_menu` (department toggles, My Shifts, VIN Number
  = `toggle_schedule_show_vin`). **View Options** = `schedule_view_options_menu` (Business Hours,
  Tech Hours, Capacity Planning, Events, Show Saturday, Show Sunday).
* **Block colour** lives on a descendant carrying `schedule-block--<colour>`, **not** on
  `.fc-timeline-event` itself — read the first descendant with a non-transparent background.
  Default blue = `rgb(233, 245, 255)` / `#e2effe`.
* **Colour picker:** `button_shift_detail_color` → `button_color_swatch_<colour>` ×7 (blue, teal,
  violet, pink, cyan, amber, grey), each with `button_color_label_rename_<colour>`. Renaming uses
  `input_color_label_name` and **needs `button_color_label_save` — Enter does NOT save.** Events use
  the same palette via **Edit Event → `button_event_color`**; the event default is Grey.
* **Working hours editor:** `toggle_custom_working_hours`, then per day and index
  `input_working_hours_start_<day>_<n>` / `_end_<day>_<n>`, `button_remove_working_hours_<day>_<n>`,
  `button_add_working_hours_<day>`. Save is `button_save_staff` ("Save & Close").
* **Staff list row targeting:** iterating `tbody tr` and clicking `nth-child(i+1)` is **off by one or
  two** and opens the wrong person. Resolve the icon's bounding box **inside a single
  `page.evaluate`** that matches the row by text, then click those coordinates — and **always read
  back the first/last name inputs to confirm who actually opened**.
* **Quasar focus rings** live on a `.q-focus-helper` **child**, not on `outline`/`box-shadow`.
* **Modal layering:** `dialog_schedule_shift_detail`; sub-pickers are `.q-menu` on top; Escape closes
  the topmost only.
* **Margaret Garcia is on the schedule grid but is NOT in the Staff list** — independent
  corroboration of Ayesha Khan's **SV-8922 / SV-8921**.

## Changes made, all recorded

`CHANGES-MADE.md` — 10 rows for this session, each with its BEFORE value. **Teardown is not
required** (QA lead, 2026-08-05). The two that a later reader most needs to know:
**Ayesha Khan AK's Monday hours were changed 07:00–21:00 → 10:00–16:00 and saved**, and a
**Pamill Paving shift on S-12876 was reassigned to Jose Young and not undone**.
