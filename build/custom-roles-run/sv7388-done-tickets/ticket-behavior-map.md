# SV-7388 DONE-tickets → behavior → affected cases (RECONCILIATION MAP)

> Fill one row per DONE ticket once the tickets are pasted into this folder (see
> `README.md`). Goal: capture any behavior a ticket decided that is **outside or newer
> than** our on-file spec (`../../custom-roles-spec-update/updated-spec-source.md`,
> exported 09 Jul 2026) and tie it to the local case(s) in `../cases-2026-07-13/`.
> This is the crib the VIU pass edits from. **Cross-check every entry against the
> CURRENT Confluence 565116952 export** (the page, not this on-file copy, is
> ground-truth) before changing any case.

Legend for **Action**: **UPD** (rewrite case to match shipped behavior) ·
**FLAG** (spec/ticket conflict — needs user ruling) · **NEW** (behavior with no case →
author one) · **RETIRE** (case describes removed behavior) · **OK** (already matches).

| Ticket | Type | Title | Behavior that shipped / decided | Outside on-file spec? (Y/N + why) | Affected case(s) (C-ID) | Action | Notes |
|---|---|---|---|---|---|---|---|
| SV-XXXXX |  |  |  |  |  |  |  |
| SV-XXXXX |  |  |  |  |  |  |  |

## Known open threads to watch for in the tickets (from the current recheck prep)
- **View History Logs → View Part History** repurpose (affects C26488 + combos
  C27418/C27468/C27487/C27494).
- **Reverse Invoice → WO Delete** (affects C26496/C2497).
- **Office cannot create invoices** hard rule (affects C2480 and invoice-create cases).
- **Cores OK/Not-OK gating** — spec-internal conflict WO View vs WOL C&E.
- **Manage AP/AR requires SFD ON** + sensitive Vendor fields (affects C26424 family).
- **Time-Clock backend enforcement leaks** — Settings read / Taxes read / Customer
  create / WO create (C29457/58/59/60) — confirm the BE fix ticket status.
- **Section-3658 stub deletions/moves** — ensure no DONE ticket still references the
  retired stub C-IDs (C27729/30/32/34/38) or the moved ones (C27731→3549, C27736→3545).
