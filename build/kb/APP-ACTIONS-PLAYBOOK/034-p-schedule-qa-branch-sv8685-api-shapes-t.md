## §P — SCHEDULE QA BRANCH `sv8685`: API shapes that cost real time (proven live 2026-08-06, build `v3.5-7ec992f`)

**Session handling for this branch is §A's five traps plus §N's one-login rule — read those first.**
App `https://sv8685.qa.shopview.com` · API `https://sv8685api.qa.shopview.com` (now **verified**, not
inferred). Build marker: `curl -sS -D- -o /tmp/idx.html https://sv8685.qa.shopview.com/index.html`
then read `app-version` + `last-modified` + `etag`, and hash `index.html` — this branch redeployed
**four times in two days**, so read it at the start AND the end of every pass.

- **`GET /api/schedule/board?from=<ISO instant>&to=<ISO instant>` REJECTS A RANGE LONGER THAN 62 DAYS.**
  A **bare date is also rejected** — it wants full ISO instants. So a "the board is broken" reading is
  usually a range that is too wide or a date that is not an instant.
- **A `PATCH` CARRYING ONLY `note` IS REFUSED `400 "The request changes nothing."` FOR *ANY* ID** — real
  or invented. **Consequence: you cannot use a note-only PATCH to probe whether an id exists**, and a 400
  here says nothing about the record. Send at least one substantive field.
- **`/api/staff` ROWS CARRY BOTH `id` AND `staff_id`, AND THE WORKING-HOURS ENDPOINT WANTS `staff_id`.**
  Using `id` **404s for everybody**, which reads exactly like a **total service outage** rather than a
  wrong key. (`GET`/`PUT /api/staff/<staff_id>/working-hours`.) Pair this with §I's
  `scrollIntoViewIfNeeded()` note — between them they account for both halves of the false
  "the working-hours service is broken" report of 2026-08-06.
- **Series create:** `POST /api/schedule/shifts {workOrderId, lineIds[], staffId, startDate, startTime,
  spreadMode:'single'|'series', totalMinutes, perDayMinutes, isAllDay}` → **201**. `spreadMode:'multi'`
  is **rejected**. A 4800-minute series at 480/day materialises as **10 shifts**.
- **⚠️ CLICK-TO-ARM (the keyboard/click alternative to dragging) WAS REMOVED between `v3.5-be42149` and
  `v3.5-7ec992f`** — filed **SV-8957**. It had been `button_sidebar_arm_<woId>` with `aria-pressed`.
  **Practical consequence for tooling: with the click route gone, drag-dependent scenarios cannot be
  driven headlessly at all** — 7 cases went to `HOLD` for exactly this reason. If it is restored, use it.

