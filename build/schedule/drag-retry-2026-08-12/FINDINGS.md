# Schedule — the seven cases held for "a drag that could not be completed", 2026-08-12

Build **`v3.5-65d6500`** (`index.html` last-modified Tue 11 Aug 2026 09:33:33 GMT, etag
`3250d285ffcf50626363a578fe273071`, sha256 `9348ca09…`), read at the start and again at the end.
Location **`Staging Heavy Duty - 9919`**. Suite 176 cases, run 357 — **never written to**.

**The premise held.** The drag IS drivable, and the two things that defeated the earlier attempts were
ours, not the product's: a drop target computed at **y=2095 in a 1080-tall viewport**, and a **one-line
work order**, where no scope picker is expected at all. A 27-line order opens the picker first try.

---

## The headline: the HOLD reason was wrong on five of the seven

Only two of the seven actually needed a drag we could not previously complete. **Three needed no drag
at all**, and two needed one that works. The HOLD text — *"it needs a drag that could not be
completed"* — had been copied across the whole group.

| Case | Needed a drag? | Now |
|---|---|---|
| C29967 | yes — and it works | **DEVIATION**, ticketed SV-8886 |
| C29982 | yes — and it works | **DEVIATION**, ticketed SV-9090 / SV-8855 (both closed, both still reproduce) |
| C29984 | yes — and it works | **DEVIATION on item 3**, ticketed SV-9006 |
| C29985 | yes — and it works | see below |
| C30004 | drags an EXISTING shift — no scope picker involved | see below |
| C30013 | **no drag at all** — it needs an open detail modal | **DEVIATION on item 4** |
| C30020 | drags an EXISTING event — no scope picker involved | see below |

---

## F1 · C29967 — tick-box mode: two of the four controls the spec asks for are absent

The picker was opened on **S8685-14158 · Brabay Maintenance, 27 lines · 67.7h**, dropped on
**Alicia Campbell · Thu, Aug 13**.

| Spec §4.3 asks for | Build | Verdict |
|---|---|---|
| tick boxes, one per line | **27 checkboxes**, `checkbox_line_picker_<lineId>` | PASS |
| running tally *"Create shift · 2 lines · 6h"* | `text_line_picker_tally` reads **`0 selected · 0h`** → **`2 selected · 4h`** after ticking two | present, **different wording** |
| a **"Select all"** shortcut | **absent** | **FAIL** |
| a **"Cancel"** returning to the single-tap list | **absent** | **FAIL** |

**The arithmetic is right** — the two ticked lines estimate 1.6h + 2.3h = 3.9h, shown as `4h`.

**Before calling the two absent, tick-box mode was proven entered** (27 checkboxes present) **and two
lines were ticked**, so both controls had something to act on. The only `All` control is
`button_line_picker_scope_all`, reading **`All 27`** — a filter between all lines and unscheduled
lines, beside `Unscheduled 0`. It ticks nothing.

**There is a way out of tick-box mode, and the case should say so**: pressing **`Select multiple`
again** toggles the boxes off (27 → 0) with the picker still open. But the button's label does not
change while you are in tick-box mode, so nothing on screen tells a tester that is the way back.

**Ticket: [SV-8886](https://shopview.atlassian.net/browse/SV-8886)** — Story Defect, parent SV-8689,
**In Progress**, and it describes exactly this, down to the tally wording. Nothing new to file.

## F2 · C29982 — there is no start-date control anywhere in the spread step

Spec §4.5: *"**Start date.** Defaults to the earliest working day. Adjusting it is how a second
technician's series can be made sequential (starting after the first) rather than parallel."*

**No such control exists.** The series always begins on the day dropped on. Before recording that,
**all five options of the "How much to schedule" selector were opened and chosen in turn** — including
the two the spec says reveal an extra control — because a field appearing only under a custom option
would otherwise read as missing:

| Option | Reveals | Start date? |
|---|---|---|
| `Full estimate (67h 44m)` (default) | nothing | no |
| `1 week` | nothing | no |
| `2 weeks` | nothing | no |
| `Until a date…` | **`Finish by`** + `Thu, Aug 13` with prev/next arrows | no — it bounds the **end** |
| `Specific hours…` | **`Hours`** stepper `− 9h +` | no |

The only date control in the dialog is `text_spread_until_date`, labelled **`Finish by`**.

**The selector itself matches the spec exactly** — three options apply immediately, two reveal a
control, which is the progressive disclosure §4.5 describes.

**Two tickets already cover this and BOTH ARE CLOSED WHILE THE DEFECT STILL REPRODUCES:**
**[SV-9090](https://shopview.atlassian.net/browse/SV-9090)** (10 Aug, *"Spread scheduling always begins
on the drop day"*) and **[SV-8855](https://shopview.atlassian.net/browse/SV-8855)** (4 Aug, ours) — both
**OBSOLETE / Done**. This is Standing Rule 61's exact case, so the case names the symptom and all three
outcomes rather than trusting either status.

## F3 · C29984 — the preview is right in two of three parts

Preview **collapsed**: `8 shifts · 67h 44m` and `Aug 13 to Aug 24 · 9h/day, Mon–Fri`.
Preview **expanded** (`button_spread_toggle_preview`): a genuine week-by-week breakdown —
`Week of Aug 13: Thu 13, Fri 14` · `Week of Aug 17: Mon 17, Tue 18, Wed 19, Thu 20, Fri 21` ·
`Week of Aug 24: Mon 24`.

**Item 3 fails: no skipped day is struck through, and no reason is given — the skipped days are simply
not listed at all.** The run spans Aug 13 → Aug 24 and therefore crosses **two** weekends (15–16 and
22–23); none of those four dates appears. The collapsed line's own `Mon–Fri` proves the build knows it
is skipping them.

Covered by **[SV-9006](https://shopview.atlassian.net/browse/SV-9006)** (open, QA Complete), whose
Actual Result says in terms: *"The preview does not strike Saturday through and gives no reason."*
**Honest limit: SV-9006's other half — Saturday being scheduled — did NOT reproduce here**, but this
was a different technician (Alicia Campbell, Mon–Fri), so that is not evidence against the ticket.

## F4 · C30013 — notes work, but they are kept PER SHIFT, not per work order

Driven on shift `6b12f567…` of **S-13014 · Fuline Enterprises**:

1. **Add** — `button_shift_detail_add_note` → `input_shift_detail_note` → confirm. **PASS.**
2. **Edit** — `button_shift_detail_note_edit`, text changed and redisplayed. **PASS.**
3. **Delete** — `button_shift_detail_note_delete` removes it immediately. **PASS.**
4. **Per work order** — **FAIL.** S-13014 has **18 shifts**; the note landed on **one**, and **0 of the
   other 17** carried it.

**The confirm control is an icon, `button_shift_detail_note_confirm`, not a button labelled Save.** A
text-only search for a save button finds nothing and would have reported "there is no way to save a
note" — a false absence, recorded here so the next pass does not repeat it.

**The first attempt at item 4 was wrong and is corrected here.** It picked a candidate pair of shifts
from the API and then opened whatever block was on screen, so it compared two shifts that never
received a note and concluded "same". The re-run adds the note first and then looks up **that** shift's
own work order — which is why the answer is now a measurement rather than a coincidence.

**No ticket covers this.** Prepared, not filed — the creation hold is active (Standing Rule 62).

---

## The estate

**Nothing was left behind: the board is byte-identical to the baseline taken before any drive** —
**545 shifts / 49 events / 18 series**, id sets equal in both directions and **every per-object hash
unchanged, 0 diff rows**. Snapshots `evidence/board-BEFORE.json` and `evidence/board-MID1.json`.

**One piece of ZZAUTOTEST residue exists and it is NOT ours:** shift `0f1bec52-f420-4798-948d-16f1d43c9fda`
carries the note **`ZZAUTOTEST line one\nZZAUTOTEST line two`**. Its hash is **identical in the baseline
taken before this session touched anything**, so it predates us — left by an earlier pass. Reported,
not removed.
