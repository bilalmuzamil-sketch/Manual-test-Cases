# Schedule build-verify — BATCH C — Automated cases HELD (Rule 71 / skill §6.4)

**Batch C held 4 Automated cases (`custom_atmstatus = 3`). They were VERIFIED LIVE where possible but
NO TestRail write was made to any of them** (Rule 71 — an Automated case is the contract Vlad's
automation runs against; ask-first for any change, and a change is made only coupled with build-verify
in the same pass, after the QA lead's go-ahead). All four are §5405 Working Hours Settings, flagged
`1→3` by Vladimir Tomovic (id 1).

Build under observation: **`v3.8-da72171`** (last-modified Wed 19 Aug 2026 06:58:40 GMT, etag
`7e51cdf10ae9a5b00cba629186fb41d4`) — read at start (07:46Z) and end, byte-identical (same as batch B's
end marker; same v3.8 minor = bug-fix deploy, Rule 60). Org d55bc308, workplace Staging Heavy Duty - 9919.

| C-id | Title (short) | Live observation | Intended change (NOT written) |
|---|---|---|---|
| **[C38847](https://shopview.testrail.io/index.php?/cases/view/38847)** | Business-hours toggle reveals a per-day (Mon-Sun) From-To editor | **CONFIRMED PRESENT + RUNNABLE.** Administration → Locations → Edit workplace dialog carries `toggle_business_hours` ("Set business hours for this shop"). Toggling it ON (observed live; closed WITHOUT saving) reveals per-day rows `row_business_hours_monday`…`row_business_hours_sunday`, each with `select_business_hours_from_<day>_0` and `select_business_hours_to_<day>_0` (From-To editor). | Lift marker to `AUTOMATION: READY` + Rule-54 sentence 2 (build v3.8-da72171, 8/19/2026). |
| **[C38848](https://shopview.testrail.io/index.php?/cases/view/38848)** | Edit Staff has a 'Set working hours for this technician' tab | **OBSERVATION-LIMITED (NOT feature-absent).** The Staff admin table (Administration → Staff) rendered no data rows in this session's virtual-scroll (Quasar `--q-virtual-scroll` spacer rows only) although `GET /api/staff` returns a populated collection (19+ staff) — a harness/render limit under the active workplace, NOT a feature-absence claim (Rule 12 / skill §2 — a probe that cannot fire is `NOT_ESTABLISHED`, never `ABSENT`). The sibling location-level per-day editor (C38847) IS confirmed built. | Verify the per-technician working-hours tab live in the coupled ratification pass, then lift marker. Do NOT assert absent. |
| **[C38849](https://shopview.testrail.io/index.php?/cases/view/38849)** | Technician with no custom hours inherits shop business hours | **OBSERVATION-LIMITED (NOT feature-absent).** Same staff-table render limit as C38848 — the inherit behaviour is a property of the per-technician working-hours tab, which could not be driven this session. Business-hours (shop) source confirmed present (C38847). | Verify inherit live in the coupled ratification pass, then lift marker. |
| **[C38850](https://shopview.testrail.io/index.php?/cases/view/38850)** | 'Add Hours' appends a removable second range for split shifts | **CONFIRMED PRESENT + RUNNABLE.** In the revealed per-day business-hours editor (C38847), each day carries `button_add_business_hours_<day>` (appends a second From-To range) and `button_remove_business_hours_<day>_0` (removes a range). | Lift marker to `AUTOMATION: READY`. |

**Nothing was written to C38847/C38848/C38849/C38850.** The location business-hours dialog was opened,
its toggle switched ON to reveal the editor, and the dialog was **closed WITHOUT saving** — so no
location setting changed (Rule 26 / §7.3). These four are handed to Vladimir Tomovic (id 1) via
`FOR-VLAD.md` for coupled ratification.

**Also checked (Rule 5.3 tell):** a live re-read confirmed **C38847-38850 are the ONLY `custom_atmstatus = 3`
cases in batch C** — the other 64 are all `atm = 1` (manual) and were written normally.

**C38851** (Overlapping hour ranges block Save; incomplete rows ignored) is `atm = 1` (NOT automated) —
its controls (`select_business_hours_from/to_<day>`, `button_add_business_hours_<day>`) are confirmed
present, so it is runnable; it was written to `AUTOMATION: READY` in the normal batch.
