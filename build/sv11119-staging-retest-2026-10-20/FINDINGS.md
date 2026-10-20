# SV-11119 — two people reorder the same technician (staging re-check, 20 Oct 2026)

Build v26.40.20-0509710, two Admin browsers (k9.mjs = k8 + drop mode + Tech View read), search QA1019, column ZZAUTOTEST DC15 Vic Hover.
PRD v68 S9-R11 (unchanged from v65 in substance; worked example Alpha, Mid, Zeta → Mid, Zeta, Alpha).

| Run | Start | A moves | B (stale) moves | After refresh A = B | Expected (S9-R11) |
|---|---|---|---|---|---|
| k9-top1 | Zeta, Mid, Alpha | Alpha → top | Mid → top | Mid, Alpha, Zeta | same |
| k9-top2 | Mid, Alpha, Zeta | Zeta → top | Alpha → top | Alpha, Zeta, Mid | same |
| k9-btw1 | — | — | B drop did not register (target inside the card) | harness miss, not counted | — |
| k9-btw2 | Mid, Alpha, Zeta | Zeta → top | Mid → just above Zeta | Mid, Zeta, Alpha | same (before the card below it on B's screen) |
| tv19 (after btw2) | Tech View group order | | | Mid, Zeta, Alpha (+ rest) | same as Board |
| k9-top3 | Mid, Zeta, Alpha | Alpha → top | Zeta → top | Zeta, Alpha, Mid | same |
No toast in any run. Cards 4–7 unchanged throughout.

Posted new comment (QA lead: "New PASSED comment"); 78986 (FAILED, 19 Oct) left for the QA lead to delete.
Before picture = 19 Oct exhibit with its old "Expected (later save wins)" legend cropped off (it predated spec v65).
