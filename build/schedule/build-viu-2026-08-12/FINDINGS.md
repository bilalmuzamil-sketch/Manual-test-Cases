# Schedule — findings, 2026-08-12

Build **`v3.5-65d6500`**, byte-identical at start, mid-run and end.
Location **`Staging Heavy Duty - 9919`**. Suite **176 cases**, run **357** (never written to).

---

## F1 · The harness fault was ours, and the fix was in the bundle

`/administration/roles-permissions` and `/administration/staff` rendered empty because the app builds
its organisation-scoped URLs from `localStorage["user"].data.details.intercom_data.company.id`, and a
cookies-only harness never sets it. **Not a product defect.** Full write-up: `HARNESS-FIX.md`.

**The 11 August file's recommended first move would not have worked** — `GET /api/iam/view-profile/`
returns HTTP 200 with real data, its trailing slash is normal, and it carries no organisation id at
all. Recorded as a dead end rather than quietly dropped.

## F2 · `Reset to template` is not where our case sent the tester — a real runnability defect

The roles-list three-dot menu offers **only `View Permissions`** (measured on Technician and Parts
Manager, reading the **last** `.q-menu`, not the first). The control is on the role's own screen at
`/administration/roles-permissions/<id>/edit`, `data-test-id="reset_template_edit"`, reading
**`Reset to template`**. C38926 has been corrected. **A tester would have been stuck on the very case
that resets every role before permission testing.**

## F3 · Three label corrections the QA lead's screenshots had already predicted

`Set working hours for this technician` (not *custom hours*) and `Add Hours` (capital H, in **both**
the staff and the location editors). Read live today, so they now carry an honest build stamp. The 11
August decision not to act on the screenshots alone was correct.

## F4 · SV-8957 is closed OBSOLETE and still reproduces

The click-to-arm alternative is absent — proven in a state where it must appear (21 orders, approved
lines, grid rendered, Edit held) and looked for three ways (load, hover, expanded line list). **The
only `aria-pressed` elements in the whole document are the three view buttons.**

**This is Rule 61's exact case**: a ticket closed without a fix tells the reader nothing, so the case
now names the symptom and all three outcomes. **Ticket status is not evidence about the build.**

## F5 · The panel-collapse feature has no interface, and six cases said READY

`Today` is the leftmost toolbar control at x=325; nothing is to its left. The only panel-like control
anywhere is `button_mini_calendar_collapse` — *"Hide the calendar"* — which folds the **month
calendar inside** the panel. Six cases moved to `AUTOMATION: HOLD`.

**No ticket covers this.** [SV-8942](https://shopview.atlassian.net/browse/SV-8942) is about sideways
scrolling at <=960 px and is closed OBSOLETE. **A defect ticket would be the right next step and one
was NOT created — Standing Rule 62 and the QA lead's active "create nothing until my next order"
hold both apply.** The finding is prepared and sits here; the ask is in OUTSTANDING below.

## F6 · Two verdicts improved without anyone re-driving them

- **C43554 passes** — `Day` carries `aria-pressed="true"` on arrival, which is what the case expects.
- **The conflict pills corroborate the recorded hours** — *"Starts before business hours (7:00 AM)"*,
  *"Extends past business hours (7:00 PM)"* — matching `admin@shopview.com`'s Mon-Fri 07:00-19:00.

## F7 · Three stale titles in our own id-map

C30042, C30046 and C30051 still carried pre-11-August wording, because that pass pushed the case
titles but never re-merged the map. Fixed from live. **The generator blanks all 176 C-ids on every
rerun** — a standing gotcha that has now bitten twice; the re-merge is in `tools/`.

---

## What was NOT done, stated plainly

- **162 of the 176 cases were not checked against the build now running.** 14 were. This pass was
  chartered on the dialogs, the harness and the two wrong-marker groups, not on a fresh run of all 176.
- **The scope picker WAS reached, on the second attempt** — the first drag computed a drop target at
  y=2095 in a 1080-tall viewport and landed nowhere, which is a tooling defect of ours and exactly the
  shape of a false "the control is missing" finding. Constraining the target to the visible window
  fixed it at once. **`Schedule whole work order` and `Select multiple` are confirmed exact**
  (C29956, C29963, C29964, C29965, C29967). **This also means drag-and-drop IS drivable through our
  tooling**, which bears on the seven cases sitting on `HOLD` for a drag that "could not be
  completed" — worth a re-try next pass rather than accepting that HOLD as settled.
- **`Change scope` and `Full estimate` (C29978, C29979, C29983, C29986) remain unchecked** — they sit
  past the picker's confirm button, and the confirm was deliberately not pressed.
- **The `Filter & display` and `View options` menus were not re-opened today** — both anchor lookups
  resolved to the same non-clickable `DIV`. Their labels were confirmed and pushed on 11 August
  against this same build marker, so they stand unverified-today rather than unverified.
- **Nothing was seeded and nothing was created.** No work orders, shifts, events, series, customers or
  technicians. **No ZZAUTOTEST data exists from this pass because none was needed** — every state used
  already existed and was read only. The Edit Staff and Edit Location dialogs were opened and closed
  **without saving**; the scope-picker drag opened the dialog and ended on Escape.
  **Proven, not asserted:** `GET /api/schedule/board` across the whole of August afterwards reads
  **138 shifts, 25 events, 14 series, and ZERO shifts starting on 2026-08-13** — the exact date the
  picker offered. Per-shift hashes in `evidence/board-after-drag.json`.
- **`admin@shopview.com` was not edited. `quick-login` and `switch-user` were never called.**

---

## OUTSTANDING — what I need from you

1. **A defect ticket for the missing panel-collapse button (C43582-C43587).** The feature has no
   interface, no ticket covers it, and six cases sit on `HOLD` because there is no ticket number to
   put in an `EXPECT FAIL` marker. **Not created: your "do not create anything until my next order"
   hold is active, and Standing Rule 62 requires your permission per ask.** The finding, the evidence
   and the ready-to-file text are here; say the word and it goes in as a Story Defect under SV-8686
   at priority Medium.
2. **Whether to reopen [SV-8957](https://shopview.atlassian.net/browse/SV-8957).** It is closed
   OBSOLETE and the defect plainly still reproduces. C29962 is now honest either way, so this is a
   tidiness-and-truth call, not a blocker.
3. **A second sign-in as a non-administrator.** **13 of the 34 HOLDs are waiting on exactly this** —
   the whole Permissions area, plus C30084, which needs two staff members with the `Time Clock`
   setting differing. Impersonation was deliberately not used because two sibling workers share this
   session.
4. **Branko still owes the shop-closures answer.** Two cases are held on it and, honestly, **the
   question has never been sent** — the blocker is on our side, not his.
5. **Nothing else.** Sources are current, the session held all session, and the build never moved.
