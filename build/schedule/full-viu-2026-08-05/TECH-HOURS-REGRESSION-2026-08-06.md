# Technician hours stopped rendering on the grid — under a build that never moved

**Status: OBSERVED AND RECORDED, NOT FILED.** A cause has not been established and one of the
candidate causes is **our own edit**. Filing it now would risk reporting our own footprint as a
product defect.

## What changed, precisely

| | Batch 7, earlier on 2026-08-06 | Later on 2026-08-06 |
|---|---|---|
| Build | `v3.5-7ec992f` | `v3.5-7ec992f` |
| `index.html` sha256 | `66e91c52…dbbc53` | `66e91c52…dbbc53` — **byte-identical** |
| "Tech Hours" toggle | `aria-checked=true` | `aria-checked=true` |
| Row headers | `Brittany Anderson \| HD Technician \| 7:00 AM – 7:00 PM`, and `MQ Test Tech No \| MQ Test Tech \| Not working` | `Brittany Anderson \| HD Technician` — **no hours on any row** |
| Rows showing any hours text | every technician row | **0 of 21** |
| Hours data anywhere in `GET /api/schedule/board` | present | **absent** — a recursive key search for `hour`/`workingHours` returned nothing |

**There was no deploy.** The build marker was read at session start and again at the end and the
served `index.html` is byte-identical on sha256, `last-modified` and `etag`. So this is not a build
change; it is a data or service change under a fixed build.

Evidence: `evidence/batch7b/b9p.json`, `b9q.json`, `b9r.json` (and `evidence/batch7/b7d.json` for the
earlier, working observation).

## Why this matters

**SCH-VIEW-09 = [C30050](https://shopview.testrail.io/index.php?/cases/view/30050)** was flipped this
same day from DEVIATION to **PASS — "Fixed"** on the strength of the earlier observation, and that
flip was reported as evidence that **SV-8851's fix had shipped while the ticket sat Open**. If the
hours are not rendering now, that PASS is no longer safe to write.

**C30050 is therefore re-opened as UNSETTLED for the write pass.** It must be re-observed before it is
written either way. It is listed in `RECHECK-QUEUE.md`.

## The three candidate causes, none of them ruled out

1. **Our own edit.** Between the two observations we changed **Ayesha Khan AK's Monday hours from
   07:00–21:00 to 10:00–16:00 and saved** (`CHANGES-MADE.md` row 8). If one malformed or unexpected
   record makes the whole location's hours payload fail, that would produce exactly this.
2. **A pre-existing fault in the hours service.** Turning the custom-hours toggle on for
   **Benjamin Peters** produced *"Couldn't load this technician's hours, so they can't be edited
   right now. Close and reopen the dialog to try again."* on **every** attempt — and that was seen
   **before** the Ayesha save. So the hours service was already failing for at least one staff member
   independently of anything we did.
3. **Intermittency.** Not tested, and it cannot be dismissed on one pair of observations.

## What would settle it, in order

1. Re-read the grid with Tech Hours on **without changing anything** — is it still empty?
2. Set **Ayesha Khan AK's Monday back to 07:00–21:00** and re-read. If the hours return, cause 1 is
   proven and this is **our footprint, not a defect** — restore and say so plainly.
3. If they do **not** return, capture the failing request from the network log and check whether it is
   the same failure behind the Benjamin Peters error. Only then is there a ticket, and it should be
   about the hours service, not about the toggle.

**Until step 2 is done, no ticket may be raised and C30050 may not be written.**
