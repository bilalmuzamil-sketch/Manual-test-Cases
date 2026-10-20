# State — SV-10687 (saved 20 Oct 2026)

**Ticket:** SV-10687 [Security] ids not checked against org/location — TESTING QA. Handoff = Nemanja 79048.
**Env:** https://sv10687.qa.shopview.com, build v26.40.19-edfe7b0 (re-read 20 Oct, unchanged). QA lead answers: no recording, no technical section.

## Done (all on screen, evidence in `ev/`, detail in FINDINGS.md)
1. Return request: make / edit reason+qty / Put Back — PASS
2. Delete a part: inventory part picked from bin MZF1C (stock back 2→3) and a Found part — PASS
3. Move part: normal (two-click "Please Confirm"), part with open core (core row follows), declined target → "Part cannot be moved to declined line" — PASS. Core row and invoiced WO are not offered by the screen (same on production — to state).
4. Split: 2 lines → new WO with all parts — PASS; invoiced/paid → "No actions available for this selection" — PASS
5. Audit Log opens — PASS
6. Change sales rep (Ashley Schultz, Brandon Jarvis made reps) — PASS
7. Receive Payment: cash, two locations ($716.49, Heavy Duty + Lethbridge S10687-17582), overpayment → DEP-4703, deposit applied, store credit CM10687-4189 applied — PASS
8. Lethbridge credit CM10687-4190 / deposit DEP-4704 not offered at Heavy Duty, offered at Lethbridge — PASS
9. Invoice page New Payment $100 on S2-17312 — PASS
10. IBS batch (S2-17462) Make Payment → Paid — PASS
12. Production before (S2-868): return make/edit/Put Back identical.

## Open
- **Portal online payment not run:** branch `customer-portal/payment-settings` = `onboarded:false`, no Send to Portal on the invoice. Asked the QA lead (Rule 91) — waiting.
- Then: exhibits (before/after prod vs branch return edit + key checks), comment (PASSED or PARTIALLY depending on portal answer), pre-post gate, post, read back.

## Test data (branch, left in place)
WO S10687-17580 `9a211bb0-c67f-4d49-83f9-48beefc83a5c` (line 3 declined), split WO `0cf50170-0b0e-435e-a07a-d36b1de30cdc`, Lethbridge WO `29dfa220-4642-4c05-9e1a-27f9f01d1e1d` (S10687-17582), customer Desert Edge Truck Service & Repair (account aea27c3a…).
Scripts (ephemeral): /tmp/qa11310/{ret5-7,del687*,movx,movwo,split687,split2,split3,log687,rep687,staff687b,payx,pay*,cred1,loc,leth,take1,ibs1-3,prodret}.mjs
