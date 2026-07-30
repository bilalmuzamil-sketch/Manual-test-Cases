# Schedule — New questions from the engineering plan — 2026-07-29

Plain-language questions only. These came up because the engineering build plan
describes a few things differently from the product write-up and the design
pictures. Please pick an option (or write your own answer) for each.

## Question NQ-1 — Shop closure days: does a multi-day job skip them?

**What happens now:** When a big job is spread across several days, the schedule
plans one shift per day. Earlier we were told that shop closure days (holidays,
inventory days) do NOT get skipped in the first release — a shift can land on a
closure day. The engineering build plan says the opposite: the system will
really skip closure days, and the preview will show them as skipped.

**The question:** In the first release, when a job is spread across days that
include a shop closure day, should that day be skipped (no work planned on it),
or can a shift land on it?

**Options:**

- A) Skip closure days — no shift is planned on a closure day (as the build plan says).
- B) Do not skip them — a shift can land on a closure day in the first release (as we were told earlier).
- C) Something else (please explain).

**Your answer:** ____________________

## Question NQ-2 — Does the conflict counter include double-bookings?

**What happens now:** The schedule flags problems like a shift outside a
technician's working hours, and a counter at the top shows how many problems
there are. The product write-up also counts a technician being booked on two
jobs at the same time ("double-booked") as one of these problems. The
engineering plan treats double-booking as a milder heads-up only — shown on the
screen, but not counted as a real "conflict" in that counter.

**The question:** When a technician is booked on two jobs at the same time,
should that show up in the conflicts counter and list at the top, or only as a
milder warning on the shift itself?

**Options:**

- A) Yes — double-bookings count in the conflicts counter and list.
- B) No — double-bookings are only a milder warning on the shift, not in the counter.
- C) Something else (please explain).

**Your answer:** ____________________

## Question NQ-3 — Where do the shop's working hours and closure days live?

**What happens now:** The design pictures we had put the shop's working hours
inside the "Edit Location" window (a toggle called "Set business hours for this
shop"). The engineering plan instead builds a separate "Schedule Settings" page
in the Administration area, which holds the shop's working hours AND its
closure days, with a link to it from the schedule's view options.

**The question:** Where should someone go to set the shop's working hours and
closure days?

**Options:**

- A) A separate "Schedule Settings" page in Administration (as the build plan says).
- B) Inside the Edit Location window (as the design pictures showed).
- C) Something else (please explain).

**Your answer:** ____________________

## Question NQ-4 — Can a technician have a split working day (two time ranges)?

**What happens now:** The design pictures show an "Add hours" button so a
technician's day can have two working ranges (for example 8–12 and 13–17 — a
split shift), with a check that the ranges don't overlap. The engineering plan
only stores ONE working range per day for each technician — no second range at
all.

**The question:** In the first release, can a technician's working day have two
separate time ranges (a split shift), or just one range per day?

**Options:**

- A) Just one range per day (as the build plan says) — the "Add hours" idea is for later.
- B) Two (or more) ranges per day, with the overlap check (as the pictures show).
- C) Something else (please explain).

**Your answer:** ____________________

## Question NQ-5 — May a technician change other technicians' shifts?

**What happens now:** Everyone who can see the schedule sees ALL technicians'
shifts. For making changes, the engineering plan adds a restriction for certain
technician-type users: if their account is set to "own data only", they can
create and change ONLY their own shifts — trying to change someone else's is
refused. The product write-up does not mention this restriction.

**The question:** Should a technician-type user (with the "own data only"
setting) be able to change only their OWN shifts, while seeing everyone's?

**Options:**

- A) Yes — such users can change only their own shifts (as the build plan says). We will then add a test for it.
- B) No — anyone who can edit the schedule can change anyone's shifts.
- C) Something else (please explain).

**Your answer:** ____________________

---

## QA Internal Mapping (QA-only — not for the PO)

| Q# | Affected cases (C-id, TestRail link) | Source refs | Resolves to |
|---|---|---|---|
| NQ-1 | SCH-EDGE-05 (C30089, https://shopview.testrail.io/index.php?/cases/view/30089), SCH-SPREAD-07 (C29983, /cases/view/29983), SCH-SPREAD-08 (C29984, /cases/view/29984); also the new SCH-SPREAD-11 + SCH-API-02 previews (no C-id yet) | Tech plan D7 ("skips closures + non-working days (real skipping)") + Phase 7 SpreadDialog + its E2E "created series has no shift on the closure day" vs Jira SV-8691 delta D2 (2026-07-27): "shop closures NOT skipped in V1". Last-update-wins is ambiguous (plan dated 2026-07-22, handed 2026-07-29; Jira delta ingested 2026-07-27). | A → rewrite SCH-EDGE-05 (closure = skipped + struck through in preview) + SCH-SPREAD-07 expected #3 + SCH-SPREAD-08 reason list. B → cases stand. Verify LIVE either way. |
| NQ-2 | SCH-CONF-01 (C30023, /cases/view/30023), SCH-CONF-05 (C30027, /cases/view/30027) | Tech plan D4: double-booking = FE soft warning, "not a hard 'conflict' per the locked definition"; BE detector = outside-window/closure/non-working only. vs SV-8697 §4.11 "Double-booked" conflict type + our pill-count expectations. | A → cases stand. B → rewrite SCH-CONF-01 expected #3/#4 (icon yes, pill no) and adjust SCH-CONF-05's count basis. |
| NQ-3 | SCH-HRS-01 (C38846, /cases/view/38846), SCH-HRS-02 (C38847, /cases/view/38847) | Tech plan Phase 2 (`ScheduleSettings.vue` in Administration + closures CRUD + View-Options link) vs design/SV-8699 Edit-Location toggle. Plan itself says the design's Hours Settings file was an empty SHELL. | A → re-home SCH-HRS-01/02 to the Schedule Settings page + author a closures-CRUD case. B → cases stand; closures UI location TBD. |
| NQ-4 | SCH-HRS-05 (C38850, /cases/view/38850), SCH-HRS-06 (C38851, /cases/view/38851), SCH-HRS-07 (C38852, /cases/view/38852) | Tech plan §3 `staff_working_hours` = one `start_minute/end_minute` per weekday, unique (staff, workplace, day) — no split ranges. vs SV-8699 verbatim "Add hours appends more to support split shifts". | A → retire/park SCH-HRS-05..07 (pending authorization). B → cases stand and the build plan's model must change. |
| NQ-5 | SCH-PERM-09 (C30082, /cases/view/30082) context; a new negative case would be authored only on answer A | Tech plan NFR-003/§4: `ManageShiftVoter` own-data scoping for `isRestrictedToOwnData()` users; error "cross-tech own-data violation → 403". Spec §14 is silent on WRITE scoping (SCH-PERM-09 covers VIEW only — no contradiction, but unconfirmed). | A → author the own-data write-negative (UI + API halves). B → no case; confirm no 403 surprises at VIU. |

Related updates recorded the same day in `PO-Questions-Branko-Schedule-2026-07-27.md`
(QA-internal appendix): the tech plan informs pending Q1 (events→capacity: plan builds
"count"), Q2 (reassign: plan builds drag-only), Q3 (no export in the plan), Q4 (New Work
Order opens the real WO window), Q5 (plan default = 7 in the morning to 7 in the
evening), Q7 (the tech plan IS the backend written description — API cases now staged).
