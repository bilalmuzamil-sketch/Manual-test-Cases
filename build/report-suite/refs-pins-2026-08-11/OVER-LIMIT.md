# The 248-character `refs` limit — what hit it, and what was done

## The constraint, and the fact that had to be checked first

TestRail rejects any single comma-separated `refs` entry over **248 characters** with
`HTTP 400 Field :refs does not match the required pattern.` — a **pattern** error, not a length
error. Total length across entries is unbounded; it is the individual entry that is capped.

**Characters or bytes? It is CHARACTERS — and this was established from live data, not assumed.**
It matters here because these refs are full of em-dashes, which are one character but **three
bytes** in UTF-8, so the two measures diverge by up to 5 on our longest entries. The proof is
sitting in the suite already:

| Case | Stored `refs` entry | chars | bytes | TestRail's verdict |
|---|---|---|---|---|
| [C30458](https://shopview.testrail.io/index.php?/cases/view/30458) | longest in the suite | **248** | **251** | **accepted and stored** |
| [C38859](https://shopview.testrail.io/index.php?/cases/view/38859) | second longest | 247 | 249 | accepted and stored |

If the cap were on bytes, C30458 could not exist. So **every measurement in this pass is in
characters**, and every entry was measured — never estimated — before being sent.

**A correction to the brief, worth recording because it tightens the margin:** the brief put the
longest existing entry at 246 characters. It is **248** (C30458) — already exactly on the ceiling.
The suite has less headroom than we thought, not more.

## What the re-pin itself cost in length: nothing

This is the happy part, and it is not luck — it falls out of the shape of the pins:

| Move | Old pin | New pin | Δ chars |
|---|---|---|---|
| Sales By Customer | `SBC spec v16 2026-08-06` | `SBC spec v17 2026-08-10` | **0** |
| Sales By Representative | `SBR spec v15 2026-07-29` | `SBR spec v18 2026-08-07` | **0** |
| Sales By Representative | `SBR spec v17 2026-08-05` | `SBR spec v18 2026-08-07` | **0** |
| Parts Velocity | `PV spec v4 2026-07-29` | `PV spec v6 2026-08-07` | **0** |
| Work In Progress | `WIP spec v10 2026-08-06` | `WIP spec v11 2026-08-10` | **0** |
| Inventory Value | `IV spec v3 2026-07-29` | `IV spec v5 2026-08-07` | **0** |

Every move stays inside the same digit count, and an ISO date is always ten characters. **So all
337 re-pins are length-neutral, and none of them could push an entry over the edge.** The brief
anticipated that `v15 → v18` might; it does not, because both are two digits.

## The one entry that DID exceed the limit — C30511

It was pushed over not by the version pin but by the **comma repair**. TestRail splits `refs` on
commas, so C30511's stray comma had been quietly storing it as *two* references of 220 and 31
characters. Joining them back into the one reference it was always meant to be makes a single
entry of **253** characters — five over.

**[C30511](https://shopview.testrail.io/index.php?/cases/view/30511)** · Work In Progress · Story 9 exports

| | |
|---|---|
| Before | 252 chars, **2 entries** (one of them the phantom `resolving the v9 contradiction`) |
| After the re-pin + comma repair, uncondensed | **253 chars, 1 entry — 5 over the limit** |
| After condensation | **245 chars, 1 entry — accepted** |

**The condensation, in full.** Exactly one edit, to descriptive text only:

> `downloads mirror the shown columns; the filters and the Totals row`
> → `downloads mirror the shown columns; filters and Totals row`

Two definite articles removed. **Nothing else changed**: the ticket key `SV-8665`, all seven
anchors (`S9-R2`, `S9-R3`, `S9-R4`, `S9-R10a`, `S7-R13`, `S9-E1`, and the second `S9-R10a`
reference), the version pin, the `"Locations:"` quotation and the note that `S7-R13` was rewritten
in v10 resolving the v9 contradiction are all intact. The meaning is identical: the downloads
mirror the shown columns, the filters, and the Totals row.

Final stored value, 245 characters:

```
SV-8665 (WIP spec v11 2026-08-10 Story 9 S9-R2; S9-R3; S9-R4; S9-R10a + Story 7 S7-R13; S9-E1 — downloads mirror the shown columns; filters and Totals row; S9-R10a = the "Locations:" line; S7-R13 rewritten in v10; resolving the v9 contradiction)
```

**Note the deliberate non-change inside it:** `rewritten in v10` and `the v9 contradiction` are
*historical statements about when a requirement changed*, not currency pins, and they were left
exactly as they were. Re-pointing them at v11 would have turned a true sentence into a false one.

## Nothing was left unwritten

**Every case in the plan was written. No case was skipped for length**, and `OVER-LIMIT` has no
second entry.

Two cases sit close enough to the ceiling to be worth naming for whoever edits them next:

| Case | Entry after this pass | Headroom |
|---|---|---|
| [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | 247 chars | **1 character** |
| [C30467](https://shopview.testrail.io/index.php?/cases/view/30467) | 246 chars | 2 characters (untouched by this pass) |

**C30398 is the one that shaped a decision.** Its comma repair would naturally have used the
suite's own `; ` separator, which lands it on **exactly 248** — legal, but with zero margin. A
plain space was used instead, giving 247 and reading just as well (*"…now states the single reports
permission outright so his spec edit is DONE"*). The same plain-space treatment was used on
[C30216](https://shopview.testrail.io/index.php?/cases/view/30216), where the comma sat between a
version and its date (`(SBR v16,2026-08-05)`) and a space is simply the right repair.

**The structural point for the next pass: this suite has cases within one or two characters of a
hard limit that fails the write outright. Measure before sending; do not estimate.**
