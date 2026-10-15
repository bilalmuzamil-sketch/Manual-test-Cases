# SV-11071 — Duplicate vendors after repeated Save

- Ticket: https://shopview.atlassian.net/browse/SV-11071 (TESTING QA, Medium, Bug, reporter Ryan Fyfe; customer TR Mechanics). No comments, no handoff; the description carries the agreed scope (2026-10-09).
- QA branch: https://sv11071.qa.shopview.com (build v26.40.17-5d3a257, last-modified Wed 14 Oct 2026 23:31:40 GMT). BEFORE: production (Rule 86).
- QA lead answers (2026-10-15): **No recording** · **No technical section**.
- ⚠️ The description lists three points *"For Product (Chris Ward) to confirm"* (exact-duplicate definition, same-name warning with "create anyway", Name A→Z default). No confirmation is recorded on the ticket (0 comments) — tested against the description as written; the open confirmation is stated in the comment (Rule 78).

## Source of truth — the agreed scope (description, verbatim)
1. *Success message after creating a vendor: "Vendor "<name>" created".*
2. *Default order for the Vendors list: Name A→Z … applies only when the user hasn't picked a sort column; anyone who has keeps theirs. A new vendor appears in its alphabetical place … Paging also becomes stable.*
3. *Duplicate protection … compared ignoring upper/lower case and extra spaces, and an empty field equals a missing one.* Block exact duplicates (same name **and** address lines, city, province/state, postal code, country) with *"A vendor with this name and address already exists."*; warn on same name/different address *("A vendor named "<name>" already exists. Create another one?")* with cancel or continue; *both rules also apply when editing a vendor*.
4. *Repeated clicks on Save send only one request.*
Not in scope: public API `/api/v1/vendors`, vendor CSV import, existing duplicates.

## Variant matrix (written BEFORE the duplicate checks — Rules 96/106)
| # | Case | Branch | Production BEFORE |
|---|---|---|---|
| M1 | Create a vendor → message "Vendor "<name>" created" | PASS — "Vendor "ZZAUTOTEST Xtreme Driveline 11071" created" (green), the vendor's page opens; one POST add-vendor 201 | FAIL (before) — no message; the window closes and the list stays as it was |
| M2 | Exact duplicate (same name + same address) → refused with the block message, nothing created | PASS — 400 "A vendor with this name and address already exists." shown in red (+ "Please try to resolve this."); dialog stays open; nothing created | FAIL — second identical vendor created (201); search shows two identical rows |
| M3 | Same, but different upper/lower case and extra spaces in name and address → still refused | PASS — "  zzautotest   XTREME driveline 11071 ", "12  TEST road", "calgary", "t2p 1a1" → same refusal | not run |
| M4 | Empty field vs missing (Address 2 left blank vs spaces only) → still refused | PASS — Address 2 = spaces only → same refusal | not run |
| M5 | Same name, different address (postal code) → warning; Cancel → nothing created | PASS — postal code T3A 0B1 → Confirmation "A vendor named "ZZAUTOTEST Xtreme Driveline 11071" already exists. Create another one?" (Cancel / Create); Cancel → nothing created | not run |
| M6 | Same name, different address → warning; continue → created (with the success message) | PASS — Create → second request 201 + "… created" message | not run |
| M7 | Same name and address lines but a different country → warning, not a block | PASS — same lines, Country United States → the same-name confirmation (not the block) | not run |
| M8 | Different name, same address → created, no prompt | PASS — "ZZAUTOTEST Other Vendor 11071" at the same address → created, no prompt | not run |
| M9 | Rapid repeated clicks on Save → one request, one vendor | PASS — six clicks on Save & Close within ~0.4 s → one POST, one vendor ("ZZAUTOTEST Rapid Save 11071") | not run |
| M10 | Edit: rename a vendor to an existing vendor's name with the same address → refused | PASS — rename "Other Vendor" (same address) to the Xtreme name → 400 same refusal message | not run |
| M11 | Edit: rename to an existing name with a different address → warning | PASS — rename "Rapid Save" (9 Rapid St) to the Xtreme name → "Another vendor named "…" already exists. Save anyway?" Cancel → not saved; Save → saved (200) | not run |
| M12 | Edit: open a vendor and save it unchanged → no duplicate warning against itself | PASS — saving "Rapid Save" unchanged and the original Xtreme vendor unchanged (while another Xtreme exists at a different postal code) → saved, no warning | not run |
| M13 | List with no sort chosen loads Name A→Z; the new vendor sits in its alphabetical place | PASS — no saved sort (preference null): pages 1–4 continue A→Z; all 1,046 vendors 0 out of order; the new ZZAUTOTEST vendors sit after "Zomb's Mobile Truck Repair" | FAIL — first page starts "ZZVENDORPO Supply Quiet", "Prod Admin", …; new vendor appended at the end |
| M14 | A user who picked a sort column keeps it after reload | PASS — clicking City saves {sortBy:city}; after reload still sorted by City (preference reset to none afterwards) | not run |
| M15 | Paging is stable: page 2 continues page 1 in order, no repeats or gaps | PASS — 4 pages × 30: each page continues the previous, 0 repeats | production repeats names across its list (two identical Xtremes) |

## Results
(filled in as observed)


Notes: the refusal toast reads the scope's sentence plus the app's standard "Please try to resolve this."; the edit-time warning reads "Another vendor named … Save anyway?" (create-time: "… Create another one?"). Postal codes are upper-cased by the form.

## Verdict
PASSED — all 15 cells pass on sv11071 v26.40.17-5d3a257. Chris Ward's confirmation of the three product points (description) is not on the ticket — stated in the comment.

## Pre-post gate (15 Oct 2026, ~04:25 UTC)
- Build marker re-read live: `v26.40.17-5d3a257`, last-modified Wed 14 Oct 2026 23:31:40 GMT, identical to the testing build.
- Ticket re-read live: TESTING QA, Medium, no comments, nothing new since testing.
- Steps walked live as written. **Step 5 had to change:** the comment first said ZIP `T3A 0B1`, but M6 had already created a vendor with that ZIP, so the walk got the exact-duplicate refusal instead of the Confirmation. Changed to `T1Y 6J4` and re-walked: Confirmation shown, Cancel returns to New Vendor and nothing is created (vendor list still holds exactly 3 Xtreme vendors: T2P 1A1, T3A 0B1, T2P 2B2). Step 2's first three rows matched (5 Star Truck Repair, Abadi's Diesel Repair, AC Truck Repair - Branford).
- Image sizes recomputed from the files (half of 2720×2778, 2400×2556, 2720×2600). Voice scan clean. No technical section, no recording (QA lead: No / No).
- Posted as comment **78745**; read back: 3 media of type `file` in order (sizes match file by file), 16 table rows, first text "OVERALL QA STATUS: PASSED". Saved as `comment-as-posted-78745.txt`.

## Learning check
- New: a reproduction step can be invalidated by the test matrix's own data (M6 created the very vendor step 5 was meant to create). Recorded in LESSONS-INDEX; vendor recipe added to playbook §AS.
