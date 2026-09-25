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

## §4 The other blocked-delete reasons — scope note

The handoff names two other reasons (labor on the line, completed line). Production actually emits **four** distinct
blocked-delete reasons, so the honest scope for "unchanged" is three, not two:

| # | Reason text on production | Occurrences seen | Example |
|---|---|---|---|
| 1 | Line can not be **declined** with staged parts… *(the one being fixed)* | 19 | S2-556 line `fa079e47` |
| 2 | You cannot delete a line that has labor on it. Please move the labor first | 2 | S2-562 line `c48eba6b` "Change engine" |
| 3 | You cannot delete a line that is completed. Please uncomplete the line first | 40 | S2-194 line `57687677` |
| 4 | You cannot delete a line when a work order is marked AS Completed. Please uncomplete the work order first | 1 | S2-810 line `0644ec67` |

Rows 2–4 must render identically on the branch. **Status: not yet observed on the branch** — see §6.

## §5 Honest method notes

- The `pkill -f staging-bridge.mjs` trap fired again and killed my own shell (playbook §U.0b). Restarted with `setsid`
  and no `pkill`.
- I could not read PR #3274: this session's GitHub access is scoped to the test-case repo only. It is not a source of
  truth for the verdict in any case — the screen is (Rule 89).

## §6 What is still outstanding

**The QA branch went away mid-pass.** `sv10442.qa.shopview.com` stopped resolving at about **09:20 UTC** (no DNS A
record at all, not merely asleep), after the §2 and §3 captures were taken. Production is unaffected and was reachable
throughout. Still owed once it returns:

1. The three unchanged reasons from §4 rendered on the branch.
2. The regression the handoff calls out: a line with nothing blocking it still deletes.

