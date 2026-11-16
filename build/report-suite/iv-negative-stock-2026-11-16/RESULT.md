# Inventory Value cases vs SV-10380 (negative stock) — read-only scan, 16 Nov 2026

QA lead, 16 Nov: "1. OK" to "let me list the affected cases first, without changing anything".
Source that changed the expectation: SV-10380 (created 22 Sep 2026, newer than IV spec v10 of 13 Aug): "Include negative-quantity parts with their signed values." / "A net-zero part contributes zero; this bug does not mandate displaying a zero-quantity row." / "Product decisions are complete".

Scan (`scan.py`, live TestRail, 15 Inventory Value sections, 85 cases, 74 ours): 20 cases mention stock-sign words (`hits.json`).
- **Out of date — 1 case:** C30540 "A part appears only if not a core charge and on-hand quantity is above zero" (Reports Suite > Inventory Value > IV — Row Scope; ours; not Automated; AUTOMATION: READY). Expected says "The zero-quantity and negative-quantity parts are not listed — only quantities greater than zero are valued." SV-10380 reverses the negative part. (Zero-quantity: SV-10380 does not require showing a net-zero row, so that sentence still stands. Core-charge line: SV-10379 is still Blocked, unchanged.)
- **Not affected:** C30535 and C30541 only use parts WITH stock as their setup; the other Report Suite hits mention "negative" for Margin %, formats or totals, or "bin" in an unrelated word.
- **Already covered:** the new behaviour has its own cases in Founder Mode (September 2026) > Part Lifecycle > Inventory Value net quantity (SV-10380): ours C425662, C425663, C425667, C425668, C839451; Mudassir Qamar's (user 6, the project's tester) C855967–C855970, C897144–C897146.
- No TestRail writes made.

## Update made — QA lead, 16 Nov 2026: "1. Yes"
C30540 updated (`update_c30540.py`, `audit-log.jsonl`, before/after snapshots): new title "A part appears unless it is a core charge or its on-hand quantity is zero"; precondition now requires a negative-quantity part; expected: zero-quantity part not listed, negative-quantity part listed with values below zero and lowering the totals (example −2 / −$20.00 at $10.00 cost), core-charge and dead-stock lines unchanged; provenance adds SV-10380 (read 16 Nov); build stamp says honestly that point 4 is not yet build-checked; divergence sentence (Rule 56) names S2-R1 vs SV-10380. Refs + "SV-10380 (negative quantities are listed; 22 Sep 2026)". HTTP 200, every field read back equal, render self-check passed. Not an Automated case (Rule 71/65 not triggered). id-map title updated.
