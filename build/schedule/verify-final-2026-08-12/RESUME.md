# Schedule verify-final — resume point, 2026-08-12

**Build `v3.5-65d6500`** — last-mod Tue 11 Aug 2026 09:33:33 GMT, etag `3250d285…`, `index.html`
sha256 `9348ca09…`. **Unmoved all pass.** Re-read it before trusting anything below.

## WHERE THIS STANDS

| | |
|---|---|
| Cases whose verdict rests on the shipping build | **76 of 176** (was 22) |
| Markers | READY **147** · EXPECT-FAIL **0** · HOLD **29** — **gate passes: 147 = 176 − 29** |
| Suite hygiene | 0 raw markup · one marker, one provenance line, one build stamp per case |
| Run 357 | **untouched, proven by content** — 176 tests, all 529 results present by id, 0 graded / 0 echo changes |
| TestRail writes | **56 `update_case`**, all HTTP 200 + byte-verified, 30 fields each, 0 mismatches |
| add / delete / section / run / result writes | **0** · Jira calls **0** · `custom_atmstatus` **never sent** |

## WHAT IS DONE

1. **Job 1 — re-stamp: 45 cases** moved onto the shipping build. Standard and evidence in
   `RESTAMP-EVIDENCE.md`; the machine decision is `evidence/restamp-eligibility.json`.
2. **Technician session — 6 cases.** C30074, C30075, C30082 driven end to end and **passing**;
   C30044, C38872, C38874 half-settled with sharpened HOLD reasons.
3. **Surfaces — 5 cases.** C29946, C30058, C30061 confirmed; **C30059 step 1 corrected** to the
   build's real scope label; **C30034** carries a corrected deviation note.

## THE NEXT THING TO DO, IN ORDER

1. **Three role assignments would unblock ten cases** — see `DIVERGENCES.md` §A. This is the highest
   value item on the list and it needs the QA lead, not a worker.
2. **Walk preconditions and steps on the 148 cases nobody has walked.** Only **33 of 176** have had
   their steps carried out on this build (see `DIVERGENCES.md` §E). Start with the 29 AMBIGUOUS
   cases in `evidence/restamp-eligibility.json` — their labels sit on surfaces no harvest reached.
3. **C30061's expected result** uses shorthand scope names (`this and after`, `this only`,
   `whole series`) that differ from the build's `This and all later shifts` / `This shift only` /
   `Entire series (N shifts)`. **Deliberately not edited** — reported in `DIVERGENCES.md` for the QA
   lead's ruling, because editing an expectation is not ours to do.

## RE-RUN RECIPE

Cookies live in `/tmp/qa-cookies/` at mode 600 — **admin** `schedule-cookie-header.txt`,
**technician** `schedule-tech-cookie-header.txt`. They are ~24 h or one deploy from expiry.

```
node tools/harness_admin.cjs  <tag> /schedule      # administrator
node tools/harness_tech.cjs   <tag> /schedule      # technician, isolated context
node tools/probe_viewonly2.cjs                     # C30074 C30075 C30082 C30044
node tools/probe_modal_readonly.cjs                # read-only modal, nav controls
node tools/probe_surfaces.cjs                      # Clear all, tooltip
node tools/probe_series_vin.cjs                    # series scope dialog, VIN toggle
python3 tools/build_union_harvest.py               # rebuild the harvest
python3 tools/restamp_eligibility.py               # re-derive the three buckets
```

Every executor writes its per-operation log to `evidence/*-oplog.json` **after every single
operation**, so a killed run leaves its exact position on disk.

## ENVIRONMENT — NOTHING TO CLEAN UP

**Nothing was created, changed or deleted.** The board was snapshotted from the API host before and
after both probe runs and compared **by id**: **159 shifts before, 159 after, 0 added, 0 removed, 0
changed**, both times. The series delete dialog was opened, read and **cancelled** — its confirm
button was never pressed. The `VIN Number` toggle was switched on and **switched back**. `0` non-GET
API calls were made from any probe.

**`admin@shopview.com` was not edited** — a staff-record edit kills the session instantly.
**`quick-login` and `switch-user` were never called.**

## TWO HARNESS TRAPS WORTH CARRYING FORWARD

- **`offsetParent !== null` IS ALWAYS FALSE FOR A `position: fixed` ELEMENT.** Quasar dialogs are
  fixed, so that test reported a fully open, fully populated modal as *"did not open"*. Use
  `getBoundingClientRect().width > 0`.
- **The series cue is not inside the shift block.** `schedule_block_series_cue` sits under
  `schedule_series_block`, a sibling structure — a probe looking for it as a descendant of
  `schedule_shift_block` finds **zero series** on a board holding **13**.

**Both produced false absences in a first run and were caught by re-reading, not by luck.** Before
recording any control as absent, prove the state it should appear in.
