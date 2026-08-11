# Report Suite — the 248-character limit, refs-cleanup pass, 2026-08-11

## THE NIL RETURN, STATED FIRST

**Not one case was left unwritten for length. Zero entries could not be made to fit.**

This file exists to record that plainly, and to show the working on the five entries that needed
condensing — not to report a shortfall. **`logs/over-limit.json` is an empty list.**

---

## 1 · The limit, re-confirmed from live data rather than assumed

**248 CHARACTERS per comma-separated entry — not bytes.** Over-length returns
`HTTP 400 Field :refs does not match the required pattern.`

The character-not-byte distinction is load-bearing here and was re-confirmed from the live suite:
**[C30458](https://shopview.testrail.io/index.php?/cases/view/30458) is stored and accepted at 248
characters / 251 bytes.** If the cap were on bytes it could not exist. These entries are dense with
em-dashes — one character, three bytes — so the two measures diverge by up to 5, and measuring the
wrong one would have condensed entries that never needed it.

**Every entry was MEASURED before it was sent. Nothing was estimated.** The writer additionally
refused any payload over 248 characters or containing a comma, before the API call rather than
after it.

## 2 · The pressure was real

- **The longest existing entry in the suite is exactly 248** — the suite was already sitting on the
  ceiling before this pass began, with no slack anywhere.
- **11 of the 42 flagged citations had under 20 characters of headroom**; four had under 10.
- A pin costs **14–15 characters** (`v17 2026-08-10 ` is 15; `v6 2026-08-07 ` is 14).
- **After this pass the maximum is still 248** — two entries land exactly on it
  ([C30485](https://shopview.testrail.io/index.php?/cases/view/30485) and
  [C30603](https://shopview.testrail.io/index.php?/cases/view/30603)) and both were accepted and
  byte-verified.

**The 58 GAP-2 date changes are same-length substitutions**, so they moved no entry closer to the
ceiling at all.

---

## 3 · The five condensations, with the full before and after

**The rule applied: condense descriptive or redundant text; never the ticket key, never an anchor,
never the version, never a source.** Two kinds of removal were used, both recoverable:

- **(a) A `Story N` locator immediately before an anchor of that same story.** The anchor already
  encodes it — `S4-R5` *is* Story 4 — and sibling cases in the same report already cite without the
  locator ([C30096](https://shopview.testrail.io/index.php?/cases/view/30096),
  [C30098](https://shopview.testrail.io/index.php?/cases/view/30098),
  [C30099](https://shopview.testrail.io/index.php?/cases/view/30099) all do). **No information is
  lost, and the anchor itself is untouched.**
- **(b) Filler the same clause is written without elsewhere in the suite** — `msg`, a stray
  semicolon, a definite article.

### C30111 — over by 9, saved 13, now 244 (4 spare)

**Removed:** `Story 4 ` (redundant: `S4-R5`/`S4-R6`) · `msg ` · `P10; [ruling` → `P10 [ruling`.

Both filler removals **normalise to the form C30215 already uses for the identical clause** — that
case writes `per Chris Ward 2026-07-29` and `video P10 [ruling`. So this is alignment with a sibling,
not invention.

> **before** — `SV-8603 (SBC spec Story 4 S4-R5; S4-R6 — per-row location identifier in All-locations view ADDED per kickoff video P10; [ruling 2026-07-28 video-overrides-spec]) + on-screen location-scope indicator per Chris Ward msg 2026-07-29 [newest-wins]`
>
> **after** — `SV-8603 (SBC spec v17 2026-08-10 S4-R5; S4-R6 — per-row location identifier in All-locations view ADDED per kickoff video P10 [ruling 2026-07-28 video-overrides-spec]) + on-screen location-scope indicator per Chris Ward 2026-07-29 [newest-wins]`

### C30134 — over by 1, saved 4, now 245 (3 spare)

**Removed:** `msg ` only. **The smallest possible edit for the smallest possible overflow.**
[C30470](https://shopview.testrail.io/index.php?/cases/view/30470) writes the same attribution as
`by Chris Ward answer 2026-07-29`, so dropping `msg` costs nothing.

> **before** — `… S8-R10 - identifier RE-RULED to the VIN chain (VIN -> Unit # -> plate); by Chris Ward msg 2026-07-29 [newest-wins]; supersedes video P24 serial ruling AND the spec's year/make/model rule)`
>
> **after** — `… S8-R10 - identifier RE-RULED to the VIN chain (VIN -> Unit # -> plate); by Chris Ward 2026-07-29 [newest-wins]; supersedes video P24 serial ruling AND the spec's year/make/model rule)`

### C30215 — over by 5, saved 9, now 244 (4 spare)

**Removed:** `Story 21 ` only — redundant against `S21-R3; S21-R4; S21-R5`.

> **before** — `SV-8638 (SBR spec Story 21 S21-R3; S21-R4; S21-R5; §3 — …`
>
> **after** — `SV-8638 (SBR spec v18 2026-08-07 S21-R3; S21-R4; S21-R5; §3 — …`

### C30327 — over by 5, saved 8, now 245 (3 spare)

**Removed:** `the old ` from *"RESCOPED 2026-08-03: the old "Reports access …" state cannot exist"*.

**Honest note, because this is the one judgement call of the five:** dropping `old` removes a word
that was doing light work. It is defensible because **`RESCOPED 2026-08-03:` immediately precedes it
and already says the state is superseded** — the sentence still asserts exactly the same thing.
Removing only `the` would have saved 4 and left the entry **one character over**, so the choice was
this or nothing.

> **before** — `… - RESCOPED 2026-08-03: the old "Reports access without Inventory Reports View" state cannot exist under one permission; …`
>
> **after** — `… - RESCOPED 2026-08-03: "Reports access without Inventory Reports View" state cannot exist under one permission; …`

### C30516 — over by 7, saved 8, now 247 (1 spare)

**Removed:** `Story 9 ` only — redundant against `S9-E1`.

Left with **1 character of headroom**, which is deliberate: a second removal was available
(`to the VIN chain` → `to VIN chain`) and was **not** taken, because
[C30470](https://shopview.testrail.io/index.php?/cases/view/30470) and
[C30485](https://shopview.testrail.io/index.php?/cases/view/30485) both write *"to the VIN chain"*
and breaking that consistency to buy slack this entry does not need would have been the worse trade.

> **before** — `SV-8665 (WIP spec Story 9 S9-E1; §2 Known Limitations (v1) - asset identifier RE-RULED …`
>
> **after** — `SV-8665 (WIP spec v11 2026-08-10 S9-E1; §2 Known Limitations (v1) - asset identifier RE-RULED …`

---

## 4 · Two entries now sit exactly on 248

[C30485](https://shopview.testrail.io/index.php?/cases/view/30485) (WIP) and
[C30603](https://shopview.testrail.io/index.php?/cases/view/30603) (IV) took their pin without
condensing and landed on **exactly the limit**. Both were written, byte-verified and re-read from
live afterwards.

**This is worth flagging for whoever writes next: those two, plus
[C30516](https://shopview.testrail.io/index.php?/cases/view/30516) at 247 and
[C30398](https://shopview.testrail.io/index.php?/cases/view/30398)/[C38859](https://shopview.testrail.io/index.php?/cases/view/38859)
at 247, cannot absorb a single further character.** Any future pass adding to those entries must
condense first — and the safe candidates are catalogued above.
