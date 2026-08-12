# RESUME — Filters finish5, 2026-08-12

**Read this first, then `COMPLETION-REPORT.md`.**

**Status: COMPLETE. Everything is done, committed and pushed — and the session survived, because
the staff-record edit that was going to end it turned out not to be needed at all.**

*This file was first written in full BEFORE that step, as the brief required. §3 and §7 were then
appended by the run itself.*

---

## 1 · WHERE THINGS STAND

| | |
|---|---|
| Ours / live | **115 / 120** (the 5 are Ahtasham's C43576–C43580, untouched and proven byte-identical) |
| Walked union — every step verified runnable | **108 of 115** (was 92) |
| Source-verified | **115 of 115** |
| Markers | **90 READY · 7 READY-EXPECT-FAIL · 18 HOLD**; gate closes both ways at **97** |
| Build stamps | **74** on `v3.7-20e801b` · 23 on `v3.4.2-d00239b` · 12 on `v3.6-3e9dd6d` · 6 with none |
| TestRail writes this pass | **4** — C29614, C43560, C29581, C29588; sentence-2 re-stamps, all byte-verified |
| Jira | **0 calls that create anything** |
| Run 352 | proven untouched **by content** after BOTH batches — 120 tests, 648 results, 0 graded changes, 0 new |
| Build | **`v3.7-20e801b`**, read 17:49:08Z — unchanged from finish4 |

---

## 2 · WHAT THE KILLED PASS HAD COMPLETED (recovery finding)

A container restart killed the previous worker mid-flight. **Established by content, not by
timestamps:**

* **It made ZERO TestRail writes.** All 120 cases were byte-compared against the census it took at
  **16:41Z** — **0 fields differed on any case, `updated_on` and `updated_by` included.**
* **Its measurements survived** in committed evidence plus three orphaned files, now committed
  (`c82afbe8`): `probeR2.json`, `probeR2.cjs`, `probeR3.cjs`.
* **`/tmp` was not cleared** by the restart — its logs (`/tmp/r2.log`, `/tmp/q*.log`) and its
  TestRail census (`/tmp/testrail/f5/`) were intact and were used. **The session cookies were
  rewritten** from the brief.
* **What it had finished:** the Status-chip four walked · all 14 Parts/Reports surfaces enumerated ·
  the restore contradiction settled · C29614 and C43560 driven end to end.
* **What it had not:** `probeR3` (killed mid-navigation), every `.md` deliverable, and the TestRail
  re-stamps. All done here.

---

## 3 · THE THREE SESSION-COST CASES — DONE, AND THE SESSION SURVIVED

They were scheduled last because a staff-record edit destroys the session of every holder — a
**sequencing** problem, not a wall (Standing Rule 68 (ii)). Everything else was finished, committed
and pushed first.

**Then none of them needed the edit.**

| Case | Outcome |
|---|---|
| [C29581](https://shopview.testrail.io/index.php?/cases/view/29581) | ✅ **RUNS.** Lead Technician filter, 47 options: **0 of the 17 inactive staff appear**, 5 of 22 active do. Control — an active person searched by name — **found, 2 results**. The deactivated technician *Mary Higgins* **not found**, by first name and by surname. Re-stamped. |
| [C29588](https://shopview.testrail.io/index.php?/cases/view/29588) | ✅ **RUNS.** Service Advisor filter, 60 options: **0 of 17 inactive appear**, 6 of 22 active do. Control **found, 1 result**. *Tony Green* **not found** either way. Re-stamped. |
| [C38876](https://shopview.testrail.io/index.php?/cases/view/38876) | ⛔ **Still blocked — and the blocker is now PROVED.** `DELETE` on the page preference returns **HTTP 405**, the server naming its allowed methods (**`Allow: GET, PUT`**), and the preference was **byte-identical after the attempt**. Both sign-ins carry saved page choices. **A staff edit would not have helped**: it needs a *signed-in session* for a never-used account, not a new record. |

**Why the blocker on the first two was never total:** the estate **already holds 17 inactive staff,
9 of them Technicians and 3 Sales Representatives**. A deactivated person is a state that already
exists. **Nobody had checked.**

**Honest limit:** the two people used were **already** inactive, so the precondition's *transition*
— visible, then deactivated — was not observed by us. All three steps of each case ran.

**NO staff record was created, edited or deactivated. No role, no setting, and never
`admin@shopview.com`. The session is intact.**

---

## 4 · IF YOU ARE PICKING THIS UP COLD

1. `git fetch origin claude/slack-session-0sxnd9 && git merge --ff-only`. **Never force, never
   rebase, never `reset --hard`.**
2. Sessions live in `/tmp/qa-cookies/filters-{admin,tech}.txt`, `chmod 600`, **never in the
   repository** (it is public). `/tmp` does not survive a fresh container — ask for fresh cookies.
   **Confirm the identities differ before using them**: admin **42** permissions / `full` /
   `/api/staff` **200**; technician **6** / `tech` / **403**. **Never call `quick-login` or
   `switch-user`** — a sibling worker shares the estate.
3. Re-read the build marker yourself. Do not trust `v3.7-20e801b` above.
4. The drivers are in `tools/`. `harness.cjs` + `lib.cjs` are shared; `probeQ*/R*/S*/T*.cjs` are this
   pass's. **`restamp5.py` / `restamp5b.py` are the write path** — they stop the batch on any byte
   mismatch and write the per-operation log **before** each write.

---

## 5 · THE TRAPS THIS PASS PAID FOR — DO NOT RE-DISCOVER THEM

1. **`ensureBarOpen` must not probe a chip that does not exist on the current tab.** The Status chip
   is absent on Estimates and Completed; probing for it toggled an already-open bar **shut** and made
   the whole tab look bare.
2. **The Work Orders chip ids are not the Reports chip ids.** Reports Sales uses
   `filter_chip_companyId`, not `filter_chip_company_id`. The wrong one returns 0 options and
   **cannot fail**.
3. **Reports options carry no checkbox markup.** A `checked`/`aria-checked` detector reads false for
   every row. **Read the chip's own text and the URL instead** — those are what a tester sees.
4. **A Date Range panel is not a `filter_option_` list.** Pick its periods by visible text.
5. **An active-tab test must read `aria-selected`**, or the exact class token `q-tab--active` — a
   `/active/` substring match calls every tab active, and the "other" tab you then click is the one
   already showing.
6. **A shared-URL test needs the shared value to DIFFER from the saved one.** Parts/Inventory also
   restores from the page preference, so a same-value control looks identical to the test and the
   check cannot fail.
7. **Landing on `/workorders?tab=all` beats the saved preference; bare `/workorders` restores it.**
   This single fact is what made finish4 report a false negative on filter restore.
8. **Type into a filter's search box with REAL KEYSTROKES.** Setting `input.value` and dispatching
   an `input` event is invisible to Vue's `v-model`: it empties the list for the control as well as
   the test, so an absence measured that way means nothing.
9. **Before accepting "this needs a staff record deactivated", look at the staff list.** The estate
   already holds **17 inactive staff**. Two cases were blocked on that for two passes.
10. **Never clean a baseline with an API write.** A junk preference value has once disabled saving
   altogether and looks exactly like a restore failure. Use `Clear Filters` in the interface and
   **assert the baseline is clean before measuring.**

---

## 6 · WHAT THE NEXT PASS SHOULD DO, IN ORDER

1. **Ask the QA lead for one word on C38880** — a runnable case sitting on an administrative hold.
2. **Apply the recommended step wording** in `DIVERGENCES.md` §§1, 3, 4, 5, 6 **once authorised** —
   5 cases, one `update_case` each, all three text fields per payload.
3. **Remove C29614's stale hedge** *"(to confirm live once built)"* from expectation 3 — this pass
   confirmed it live; it is an expectation edit and was deliberately not taken here.
4. **When Branko answers**, the 14 need only their expectations settled — **their steps are already
   verified runnable**, so 11 of them can go straight to a tester.
5. **When the creation hold lifts**, file C38897 and the shared-report-address observation
   (`DIVERGENCES.md` §7).

---

## 7 · THE SESSION-COST RUN — OUTCOME

*Appended by the run itself.*

**Status: RUN — see §3. Two of the three now run and were re-stamped; the third is blocked and its
blocker is proved. No staff record was touched, so the session cost nobody expected to avoid was
never paid.**
