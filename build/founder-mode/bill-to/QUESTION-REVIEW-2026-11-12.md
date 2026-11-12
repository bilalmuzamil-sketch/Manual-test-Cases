# Bill To — the 15 open questions for Chris Ward re-checked against skill 07 §6.0 (12 Nov 2026)

QA lead, 12 Nov 2026: "Yes" (run the new pre-send checks on the open Bill To questions). PRD unchanged since v0.5 (last modified
7 Nov 2026). The Bill To PRD has NO precedence statement (its "Design authority" cell is empty), so check (a) settles nothing. No tech
plan exists (check (c) has only the design and its library). Design library read: `design-2026-11-09/files/project/ds/shopview/`.

| # | Topic | Result | Check / reason |
|---|---|---|---|
| 1 | Permissions, one of two | Keep | Real ambiguity in S5-N1/S5-N2; no source settles it |
| 2 | Banner on an invoiced work order | Keep | PRD silent; money (Credit Hold) — risky gap (c) |
| 3 | Part sale badges | Keep | PRD silent; no design picture; Credit Hold — risky (c) |
| 4 | List order | Keep | PRD rule vs design; no precedence statement; behaviour |
| 5 | Close button on the locked message | Keep | PRD vs design; the library's alert has an X, not a "Close" button; behaviour |
| 6 | Cancel in Bill Invoices To | Keep | PRD lists only "Save" (buttons "as they render") vs design; no library rule |
| 7 | Remove button order | Keep | PRD order vs design order; no library rule on button order |
| 8 | Legacy invoice phone | Keep | PRD explicit vs design; output on a customer document |
| 9 | Long name cut with no "…" | Keep | Library has no truncation rule for this field; our own look check (no cut-off text, Rule 126) conflicts with the frame |
| 10 | Asset tab width at 1440 | Keep | Same: the frame scrolls sideways where our 1440/1536 check expects none |
| **11** | **Tooltip position** | **WITHDRAW** | **(d) design library over a single frame: the library places a tooltip beside its trigger (`.sv-tt-pop--top/bottom/left/right`, 10 px from it, centred) and caps it at 326 px (`.sv-tt { max-width: 326px }`); the frame's tooltip at the window's left edge, one long line, breaks it. The case follows the library.** |
| 12 | Lists over the top bar | Keep | Library has no menu-placement rule; overlap conflicts with our own look check |
| 13 | Banner place | Keep | PRD explicit (page header) vs design (under tabs); no precedence statement |
| 14 | "Loaded row" vs "at least one row" | Keep | Wording differs in a way that changes the result with paging |
| 15 | AccountingHub change | Keep (borderline) | PRD Key Decision says no hub change; the design's cover says an event is still needed from the hub owner. Accounting risk (c) |

Result: 14 kept, 1 withdrawn (q11). Because the sheet is already with Chris, row 11 is NOT edited (Rule 131); the QA lead tells him
to skip it. Case D-68 (held on q11, the design-version case) is to be rewritten to the library rule and released, with the QA lead's
go-ahead for the TestRail edit.
