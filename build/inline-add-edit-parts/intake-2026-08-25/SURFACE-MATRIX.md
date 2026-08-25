# Surface matrix — Inline Add and Edit Parts

The feature is a single surface: the **Work Order Details → Lines → Parts** section of an open work
order. Behaviour forks by the **Work Order View Mode** permission (Tech View vs Full View), not by URL.

| Surface / mode | Add | Edit | Covered by |
|---|---|---|---|
| Work order line Parts section — Tech View | 3-field inline row | 3-field inline row | Areas 01, 02, 03 |
| Work order line Parts section — Full View | 6-field inline row + More Options → part details modal | part details modal | Areas 01, 04, 05 |
| Cross-cutting (both modes) | unsaved-data protection, one-row-at-a-time, status/permission gating | — | Areas 01, 06 |

No secondary surfaces (email, PDF, API-only screens) are introduced by this epic. The part details
modal is an existing surface reused (S4-R9, S5-R1); this suite tests the handoff into it, not the
modal's own internals.
