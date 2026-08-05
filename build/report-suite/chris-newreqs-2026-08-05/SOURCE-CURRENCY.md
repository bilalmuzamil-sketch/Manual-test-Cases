# SOURCE-CURRENCY — Report Suite, Chris Ward's new requirement items (2026-08-05)

Standing Rule 31 block. Every source refreshed **live** at the start of this pass, and **again
immediately before the writes began** (Rule 59), because Chris Ward published **nine spec versions
today across two waves** and the previous pass was overtaken mid-flight.

## The six specifications

Read live from Confluence with `GET /wiki/api/v2/pages/{id}?body-format=storage`. **The version
number recorded is the CONFLUENCE version, never the in-body "Version" field** — the in-body field is
the Rule-31(a) trap.

| Report | Page id | Version at **18:34:08Z** (pass start) | Version at **19:06:53Z** (immediately before writing) | Saved at | Change-log message | Verdict |
|---|---|---|---|---|---|---|
| Sales By Customer | 577634305 | **15** | **15** | 2026-08-05T17:53:06Z | "Parth WIP review + suite-wide link-permission rule (2026-08-05)" | **CURRENT** |
| Sales By Representative | 585629698 | **17** | **17** | 2026-08-05T17:53:08Z | same | **CURRENT** |
| Parts Velocity | 620888066 | **5** | **5** | 2026-08-05T13:21:40Z | "Applied QA review workbook decisions (2026-08-04)" | **CURRENT** |
| Technician Utilization | 641400833 | **6** | **6** | 2026-08-05T13:33:10Z | same | **CURRENT** |
| Work In Progress | 703660034 | **9** | **9** | 2026-08-05T17:54:07Z | "WIP asset filter scope wording (Parth review)" | **CURRENT** |
| Inventory Value | 720142338 | **4** | **4** | 2026-08-05T13:33:13Z | same | **CURRENT** |

**Nothing moved during this pass — read THREE times.** All six versions equal the last known reads of
17:54Z. The second read (recorded in `specs-prewrite/_summary.json`, taken at **19:06:53Z**) is
byte-identical to the first by `body_sha256` on all six pages, and a **third read at the end of the pass,
19:27:40Z**, returned the same six version numbers again. **This is the first Report Suite pass today
during which Chris did not publish.**

## The build

| Marker | Value | Read at |
|---|---|---|
| `app-version` | **`v3.5-16cf83f`** | 18:41Z · again before writing · again at 19:27Z — `index.html` sha256 identical all three times |
| `last-modified` on `index.html` | Wed, 05 Aug 2026 06:40:32 GMT | both reads |
| `etag` | `"177c59546701e7810b894492dabc1423"` | both reads |

**The branch `sv8582` has NOT been declared final**, so every verdict in this pass is **PROVISIONAL**
(Rule 49) and is queued in `RECHECK-QUEUE.md`.

**The session was alive** — `GET /api/auth/me/fe-permissions` → HTTP 200, 42 atoms,
`template_slug = administrator`. **`POST /api/quick-login` was never called** (it rotates the
`sv_sso_session` two other workers share).

## The epic — Tier-1 currency check (Rule 37)

| Check | Result |
|---|---|
| `parent = SV-8582` | **105** children |
| `"Epic Link" = SV-8582` | **105** children |
| Key sets equal both directions | **YES** — 0 only-in-A, 0 only-in-B, no paging remainder |
| Composition | 97 `Story` + 8 `Bug` |
| Statuses | Open 83 · In Progress 11 · OBSOLETE 7 · Ready to Fix 3 · Done 1 |
| Subtasks under the 105 children | **1** — SV-8780 `Story Defect`, Ready to Fix, parent SV-8598 |

**Unchanged from the previous pass's record of 105.** No Tier-2 full re-read was requested or
performed (Rule 37 makes that user-gated).

## The tech plan and the designs

| Source | State |
|---|---|
| Engineering tech plan | held — `build/report-suite/tech-plan-2026-07-29/`. **Not re-supplied for today's three new items**, and they are product-level clarifications, so no tech-plan delta is expected. Recorded as an ask. |
| Designs | **STILL NOT AVAILABLE** for any of the six reports. Authoring remains spec-only (Rule 9 wording from the specification's own labels). **PARTIAL** — this is a standing shortfall, not new. |
| No Rule-35 Figma queue is open for this project | confirmed — `ls build/*/design-*/PENDING-FIGMA-FETCH.md` has no Report Suite entry |

## Chris Ward's channel message (the source for this pass)

His post is the **originating source** for the three items. Its substance is quoted verbatim in
`SPEC-DIFF.md` §1 alongside what actually landed in each page, because **for one of the three the page
text and his description do not line up** (see SBR, item 3).

## Honest shortfalls in this pass's sources

| Shortfall | Consequence |
|---|---|
| **No second sign-in with reports access and no work-order access** | The **negative half** of the link-permission rule — the whole point of items 2 and 3 — **could not be observed on any report**. See `FINDINGS.md` §4 for exactly why, and what would unblock it in minutes. |
| **The SPA could not be opened at all this pass** | The application front end refuses to hydrate from the raw cookies alone, and the only route that produces a signed-in browser is `quick-login`, which is barred. So **nothing was observed on screen**; every live observation here is at the API layer, and each one says so. |
