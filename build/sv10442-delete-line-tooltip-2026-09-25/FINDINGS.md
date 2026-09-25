# SV-10442 — "Delete line" tooltip says "declined" on a line with staged parts

**Ticket:** https://shopview.atlassian.net/browse/SV-10442 · Bug · Medium · reporter Bilal Muzamil · status TESTING QA
**Relates:** SV-10190 · **PR:** ShopView/shopview #3274 · **Branch:** `SV-10442-delete-line-tooltip-wording`
**Scope per the handoff:** BE only, 2 files, one string literal in `LinesDetailProvider.php`.

## §0 Sources and build markers (read live)

| Source | Value | Read at |
|---|---|---|
| QA branch | `sv10442.qa.shopview.com` — **v26.39.0-7a11ac0**, last-mod Fri 25 Sep 2026 08:53:34 GMT, etag `0a816a29bf7e9209ea0033a85669daa9` | 2026-09-25 08:58 UTC |
| Production (the BEFORE, Rule 86) | `app.shopview.com` — **v26.39.0-07c719b**, last-mod Thu 24 Sep 2026 09:47:48 GMT, etag `103d8c34ec52538553412443849086d3` | 2026-09-25 08:58 UTC |
| Ticket description + 1 comment | read live via REST; description defines the test (Rule 66) | 2026-09-25 08:58 UTC |
| Dev QA handoff | supplied by the QA lead; treated as an input, not the test | 2026-09-25 |

The ticket description and the handoff agree on what "fixed" means, so there is no Rule-66 divergence to flag.

## §1 The reported bug, on production (the BEFORE)

Production work order **S2-556** (customer *aqeel transport 56*, 2021 KIA FORTE), line 2 **"Fghfghgfh"**, which holds a picked
part (`In Stock` / `Pick` row on the line). Opened the line's action menu and hovered the greyed-out **Delete line**:

> Line can not be **declined** with staged parts, please move parts to another line or return them

That is the defect exactly as reported — the control is *Delete line* and the message talks about *declining*.
Evidence: `ev/tip-prod-delete-staged.png`.

Scanning production's own data, this is not a one-off: **19 lines** across the work orders sampled carry that same
"declined" wording on their `deletable_reason`.

## §2 The fix, on the branch (the AFTER)

Branch work order **S2-17435** (customer *Andrews' Truck & Trailer Repair LLC*, 2023 Hino Incomplete Vehicle L7),
line 1 **"Service - CVIP inspection single or tandem axle"**, which holds the staged part
`N68SL-356 — 3.50-3.82" (89-97mm) SPRING LOADED T-BOLT CLAMP`. Same steps:

> Line can not be **deleted** with staged parts, please move parts to another line or return them

- On the screen: `ev/tip-branch-delete-staged.png` (Rule 89 — the verdict comes from the screen).
- In the API the page uses, `GET /api/work-orders/lines/{workOrderId}` → `deletable_reason` on that line carries the
  same new string, and `deletable` is still `false`, so the gate itself did not move.

Only the one word changed. The rest of the sentence is byte-identical between the two builds:
`…with staged parts, please move parts to another line or return them`.

## §3 The Decline tooltip is a separate message and is unchanged

Same line, same menu, hovering the greyed-out **Decline** item:

- Production: `Line can't be declined while it holds received or picked parts, please move the parts to another line or return them.`
- Branch: `Line can't be declined while it holds received or picked parts, please move the parts to another line or return them.`

Byte-identical, and it correctly still says *declined*. Evidence: `ev/tip-prod-decline-staged.png`,
`ev/tip-branch-decline-staged.png`.

## §4 Two things moved underneath the pass — found by re-reading the sources (Rule 59)

Both were found by re-reading rather than by assuming, and both change how this pass should be read.

### 4a. The QA branch was torn down mid-pass

`sv10442.qa.shopview.com` stopped resolving at about **09:20 UTC** — no DNS A record at all, not merely asleep
(another branch, `sv9160.qa.shopview.com`, resolved normally at the same moment, so this was not a local network
problem). The §2 and §3 captures were already taken, at 09:07–09:08 UTC, so the evidence for the fix itself is intact.

### 4b. Production picked up the fix while I was testing

At **09:14–09:20 UTC** production returned the old wording on **19** lines and the tooltip rendered
`…can not be **declined** with staged parts…` (that is the §1 capture). At **09:31 UTC** the same line on the same
work order returned `…can not be **deleted** with staged parts…`, and eight consecutive no-cache reads all returned
the new wording, so it is not a rolling-deploy flicker.

Production's **frontend** marker did not move (`v26.39.0-07c719b`, etag `103d8c34…`, identical before and after) —
this is a backend-only change, so the SPA marker would not move. The ticket carries fix version **v26.39.1**.

**What this means for the §1 exhibit:** it is a genuine capture of production at 09:17 UTC, but anyone opening that
same work order now will see the fixed wording. The exhibit is labelled with its capture time for exactly that reason.

## §5 The whole-output diff — exactly one of four strings changed (Rule 74)

Because production changed under me, the same scan could be run on the same environment, over the same data, twenty
minutes apart. That is a cleaner diff than a cross-environment comparison, and it covers the handoff's
"other reasons unchanged" question directly. Same 35 work orders scanned each time:

| Blocked-delete reason | Count before (09:20) | Count after (09:39) | Example line | Verdict |
|---|---|---|---|---|
| Line can not be **declined** with staged parts, please move parts to another line or return them | 19 | 0 | — | replaced |
| Line can not be **deleted** with staged parts, please move parts to another line or return them | 0 | 19 | S2-908 `cbd4cdde` | **the fix** |
| You cannot delete a line that has labor on it. Please move the labor first | 2 | 2 | S2-562 `c48eba6b` | unchanged |
| You cannot delete a line that is completed. Please uncomplete the line first | 40 | 40 | S2-194 `57687677` | unchanged |
| You cannot delete a line when a work order is marked AS Completed. Please uncomplete the work order first | 1 | 1 | S2-810 `0644ec67` | unchanged |

The counts are identical and the example line for each unchanged reason is the same line, so the three other
messages are untouched. Note the handoff names **two** other reasons; the product actually emits **three**.

Two of those three were also read **off the screen**, not only out of the endpoint:

| Reason | Where it was hovered | Tooltip text read on screen |
|---|---|---|
| labor on the line | S2-562, line `c48eba6b` | `You cannot delete a line that has labor on it. Please move the labor first` |
| work order marked Completed | S2-810, line `0644ec67` | `You cannot delete a line when a work order is marked AS Completed. Please uncomplete the work order first` |

The third — *line is completed* — is covered in the endpoint diff above (40 occurrences before and after, same
example line). Hovering it on screen took two attempts: the first candidate work order, S2-194, is **invoiced**, and
on an invoiced work order the menu does not offer a **Delete line** item at all, so there is nothing to hover.

The payload shape is unchanged too: a line object carries **47 keys** on the branch and **47** on production, with no
key added or removed on either side, and `deletable` is still `false` on a staged-parts line — the gate did not move,
only the sentence.

## §6 Honest method notes

- The `pkill -f staging-bridge.mjs` trap fired again and killed my own shell (playbook §U.0b). Restarted with `setsid`.
- I could not read PR #3274 — this session's GitHub access is scoped to the test-case repo. It is not a source of
  truth for the verdict in any case; the screen is (Rule 89).
- The changed word was located in the screenshots by pixel analysis of the tooltip (finding the all-background
  columns between words) rather than by estimating, so the annotation boxes sit on the real glyphs.

## §7 Ticket state — it was already passed and released

Read live at 09:41 UTC: status **Ready for Production**, fix version **v26.39.1**, and comment **77276**, posted
under the shared Bilal Muzamil account at **09:08:50 UTC**, already records *"QA Status: Passed"* with a screen
capture attached. Stefan Mitrovic's Ready-for-QA comment is 77274 at 08:55:58 UTC.

So this pass ran concurrently with, and independently agrees with, a pass that had already been recorded. That also
explains 4a and 4b: the branch was torn down and the fix went out to production while I was still driving it.

## §8 What was not observed

The three unchanged reasons were verified on **production**, before and after its deploy, on the screen and in the
endpoint — not on the QA branch, which had gone by the time I got to them. The one string this ticket changes was
verified on the branch, on the screen and in the endpoint. The handoff's "a line with nothing blocking it still
deletes" regression was **not run** on either environment: I will not delete a line on production, and the branch
was gone. Nothing here was inferred.
