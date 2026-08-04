# Schedule — surface matrix (Standing Rule 40)

Every requirement that can touch more than one surface, with **a verdict per surface**. "n/a" always
carries its reason. The Schedule has no PDF, no CSV, no print view and no email delivery, so those
columns are absent by design rather than skipped — the spec defines none and none exists in the build.

Surfaces in play: **grid** (Day/Week/Month) · **sidebar** · **modal** · **tooltip** · **toast** ·
**settings** (Edit Staff Member / Edit Location) · **API** · **empty state** · **mobile / narrow**.

| requirement | grid | sidebar | modal | tooltip | toast | settings | API | empty state | mobile |
|---|---|---|---|---|---|---|---|---|---|
| **§4.4 VIN line, gated by the VIN switch** | covered SCH-BLOCK-01 = C29991 + SCH-VIEW-04 = C30045 — VIN appears as a 4th line when on | n/a — cards never show a VIN | covered SCH-MODAL-01 = C30008 — always shown, switch ignored (PO ruling) | covered SCH-TIP-01 = C30034 — always shown (PO ruling); this is what SV-8835 disputes | n/a — toasts carry no VIN | n/a | covered SCH-API-03 = C38874 — `vin` is in the payload for every consumer | n/a | covered SCH-EDGE-02 = C30086 |
| **§4.2 start-time hierarchy (tech hours → business hours → 7 AM)** | covered SCH-START-04 = C29972 (day-view drop position) | n/a | covered SCH-MODAL-02 = C30009 (the two time boxes) | covered SCH-TIP-01 = C30034 (time range) | n/a | covered SCH-HRS-03 = C38848 + SCH-HRS-02 = C38847 (both editors) | covered SCH-API-01 = C38872 | n/a | n/a | 
| **§4.11 conflict detection (4 types)** | covered SCH-CONF-01/02/03 = C30023/24/25 (icon on the block) + SCH-CONF-05 = C30027 (toolbar pill) | n/a — cards carry no conflict signal | covered SCH-MODAL-07 = C30014 — banner present, **Adjust action absent** (SV-8852) | covered SCH-TIP-02 = C30035 | n/a | covered — the conflict depends on the hours set in Edit Staff Member | covered SCH-API-01 = C38872 (`conflictReasons`) | n/a | n/a |
| **§4.12 capacity (fill, amber spill, OT tag)** | covered SCH-CAP-01/02/03 = C30030/31/32 in Week AND Month headers | n/a | n/a — the modal shows no capacity | covered SCH-CAP-04 = C30033 (per-technician breakdown) | n/a | covered — capacity is the sum of the hours set in the two editors | n/a — no separate capacity endpoint; it comes on the board | n/a | n/a |
| **§4.6 linked series rendering** | covered SCH-SER-01/02/03 = C29987/88/89 across Month, Week and Day — and **in Week the blocks cannot be opened at all** (SV-8849) | covered SCH-REG-02 = C38868 — one card, not one per shift | covered SCH-SER-03 = C29989 — "Part of a series · Shift 1 of 4" | covered SCH-TIP-01 = C30034 — "Part of a series" | covered SCH-DEL-09 = C30065 — "Series scheduled" | n/a | covered SCH-SER-04 = C29990 — `series[]` summary row | n/a | n/a |
| **§4.7 lane stacking + "+N more"** | covered SCH-LANE-01/02/03/04 = C29996/97/98/99 in all three views | n/a | n/a | n/a | n/a | n/a | n/a — lanes are a render concern | covered — **the "+N more" box lists nothing** (SV-8850) | n/a |
| **§7 undo toast on every action** | n/a | n/a | n/a | n/a | covered SCH-DEL-08 = C30064 + SCH-DEL-09 = C30065 — create, series create, move, delete and event delete all toast with Undo | n/a | n/a | n/a | n/a |
| **§9 the two toolbar controls and their defaults** | covered SCH-VIEW-05/06/09/10 = C30046/47/50/51 (**Business Hours default wrong, SV-8827; Tech Hours does nothing, SV-8851**) | covered SCH-VIEW-01 = C30042 + SCH-VIEW-02 = C30043 (department groups) | n/a | covered SCH-VIEW-04 = C30045 | n/a | n/a | n/a — preferences are client-side | n/a | covered SCH-EDGE-02 = C30086 |
| **§14 permission tiers** | covered SCH-PERM-01/02/04/05/06 = C30074/75/77/78/79 | covered SCH-PERM-08 = C30081 — **list NOT hidden without Work Orders: View (SV-8854)** | covered SCH-PERM-02 = C30075 — delete, colour, notes and the time boxes all withheld from a View-only user | covered SCH-PERM-01 = C30074 | n/a | covered SCH-PERM-13 = C38926 (all 11 default roles read live) | covered SCH-API-01 = C38872 — 403/200 per tier, enforced server-side | n/a | n/a |
| **§5.1 sidebar filters** | n/a | covered SCH-FILT-01…06 = C29942…C29947 — **no Clear all and no active count (SV-8857)** | n/a | n/a | n/a | n/a | covered — `facetCounts` matches the popover counts exactly | covered SCH-WOL-06 = C29941 — "No schedulable work orders match this filter." | covered SCH-EDGE-02 = C30086 |
| **§3.2 week column order (Mon → Sun)** | covered SCH-NAV-03 = C29927 — **build is Sunday-first in Week AND Month (SV-8826)** | covered SCH-MCAL-04 = C29935 — the mini calendar IS Monday-first, so the two disagree on one screen | n/a | n/a | n/a | n/a | n/a — order is a render concern | n/a | covered SCH-EDGE-02 = C30086 |
| **§4.2 working-hours editors** | covered — the grid shades and the capacity follows what is set | n/a | n/a | n/a | n/a | covered SCH-HRS-02/03/04/05/06 = C38847/48/49/50/51 in BOTH editors, incl. the verbatim overlap message | covered SCH-HRS-04 = C38849 (`GET /api/staff/{id}/working-hours`) | covered — a day with no range reads "Not working" | n/a |

**No surface was left unexamined.** The three cross-surface defects this matrix exposed — the Week-view
series blocks that cannot be opened, the empty "+N more" box, and the sidebar list leaking to a user
without Work Orders: View — are all filed.
