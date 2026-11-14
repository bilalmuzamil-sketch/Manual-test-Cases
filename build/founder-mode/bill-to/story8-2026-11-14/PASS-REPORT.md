# Bill To: Story 8 named-set update, 14 Nov 2026 (DRAFT: nothing written to TestRail, Jira, Slack or Google; nothing committed)

QA lead's approval (14 Nov 2026): a named-set update after the PRD page's Story 8 changed. Confluence 1003585538 was edited on 14 Nov 2026
(status line still v0.5, Change Log empty); the design canvas is now version 1794608112-d8a1 (page 4, ServiceFor.dc.html, redrawn; the
other 7 boards byte-identical, checked with cmp). Rule 134: every affected case rewritten top to bottom; every other case re-stamped only
where its quotes are unchanged, proved by script.

## Summary

- Named set (found by script, `find_affected.py`; the coordinator's list checked against it): **41** keys, of which 33 are live in TestRail. Added by the script beyond the coordinator's list: D-44, D-45, D-65, S8-14, S8-15, INV-06, INV-08, REL-02, S7-01, S7-02, S7-24 (page 4 references or band text). Eight hits were the Service For *column* (Story 10), not the band, and are not in the set: D-47, D-48, D-49, D-85, D-101, S10-09, S10-10, S10-11 (their quotes are unchanged; they are re-stamped).
- Rewritten: S8-01 to S8-08, S8-10 to S8-15, D-36 to D-43, D-46, D-82, D-83 (band, unit and vehicle text); D-84 (References from Design: its old page 4 words); D-44, D-45, D-65 (redrawn pictures, canvas line and words); INV-06, INV-08, REL-02, S7-01, S7-02, S7-24 (From line and, where they point at page 4, References from Design; their steps and results still hold).
- New: **S8-16 to S8-20** (address with Address 2, no address, invoice keeps name and address, Change Customer leaves the band, estimate shows the current address). Not yet in TestRail and created with them: **D-82, D-83, D-84**.
- Held cases stay held: S8-15 (production), REL-02 (production), S7-24 (question), D-65 (question 8).
- Re-stamped only (From line to the 14 Nov 2026 copy): **332** live cases (+ 11 library-only NO_MANUAL cases). Proof: every quote word for word in the new copy, quote list unchanged against the last build before this pass (commit 9f5770bf3), and the From line the ONLY difference from the live text: **332 of 332** (all).
- Markers: rewritten and new cases carry "AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026"; held cases keep their HOLD line; re-stamped cases keep their marker.

## Proposed deletions (for the QA lead; nothing deleted)

- **S8-09 C1062367** "A unit that already starts with Unit is not prefixed again" (https://shopview.testrail.io/index.php?/cases/view/1062367). Reason: it tests S8-R3's clause "a unit already starting with "Unit" is not prefixed again", which the 14 Nov 2026 page removed; S8-R4 now says the band never repeats the unit, so the behaviour has no successor (S8-01, S8-02 and S8-10 check that no unit prints). Left exactly as it is (still on PRD version 0.5, not re-stamped); it is in run 558, so a tester would fail it today. **Recommendation: delete it** (and so drop it from run 558).

## Edited outside our library

Checked at write time by `update_story8.py` (live text against our last read-back; anything different is skipped and listed in `edited-outside.json`). The dry run compares with saved read-backs only, so the live list is produced by the --apply run.

## Pictures

18 redrawn page 4 pictures fetched with the Artifact tool (read, paths, version 1794608112-d8a1) and saved as `design-2026-11-09/images/bt-p4-NN-...-2026-11-14.png`; figure list `design-2026-11-14/DESIGN-FIGURES-P4-2026-11-14.json` (`make_p4_figures.py`). The "part sale with a vehicle" row is gone: the old part sale pictures map to the new part sale row. The library now refuses any old page 4 picture name and any old page 4 caption as design words.

## Gate results

```
cases 384 {'S1': 19, 'S2': 16, 'S3': 32, 'S4': 8, 'S5': 25, 'S6': 10, 'S7': 25, 'S8': 20, 'S9': 7, 'S10': 13, 'S11': 8, 'S12': 14, 'S13': 6, 'S14': 13, 'S15': 6, 'S16': 8, 'S17': 8, 'S18': 5, 'S19': 9, 'API': 12, 'DATA': 4, 'REL': 5, 'INV': 8, 'DESIGN': 103} | held 61
PRD codes 179 covered 177 | named items 114 covered 109 | not testable ['OOS-02', 'OOS-11', 'OOS-13', 'S15-N1', 'S18-R2', 'T-VOCAB', 'UFS-H3']
PROBLEM lines: 0
```
```
cases 384 | hard problems 0 | 'does not / never' results to read for a control 86
```
```
cases 384 | moved to 0.5 (edited 14 Nov 2026): 364 mapped (+ 19 unmapped, current by default)
quotes not word for word in the new copy: {'S8-09': ['S8-R3']}
quote list unchanged: 359 | changed: 20 ['D-36', 'D-37', 'D-38', 'D-39', 'D-40', 'D-41', 'D-42', 'D-43', 'D-82', 'D-83', 'S8-01', 'S8-02', 'S8-03', 'S8-04', 'S8-05', 'S8-06', 'S8-07', 'S8-08', 'S8-10', 'S8-11'] | new keys: 5 ['S8-16', 'S8-17', 'S8-18', 'S8-19', 'S8-20']
re-stamp only: 343 | changed outside the named set (must be 0): []
```

## Per case: every part CHANGED or CONFIRMED (against the live read-back)

| Key | C-id | title | preconditions | steps | results | quotes | From line | References from Design | pictures | marker | refs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| D-36 | C1062531 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| D-37 | C1062532 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| D-38 | C1062533 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| D-39 | C1062534 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| D-40 | C1062535 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| D-41 | C1062536 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| D-42 | C1062537 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| D-43 | C1062538 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| D-44 | C1062539 | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| D-45 | C1062540 | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| D-46 | C1062541 | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| D-65 | C1062560 | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED |
| D-82 | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW |
| D-83 | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW |
| D-84 | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW |
| INV-06 | C1062493 | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| INV-08 | C1062495 | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED |
| REL-02 | C1062484 | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S7-01 | C1062335 | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED |
| S7-02 | C1062336 | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED |
| S7-24 | C1062357 | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CONFIRMED | CONFIRMED |
| S8-01 | C1062359 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| S8-02 | C1062360 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| S8-03 | C1062361 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| S8-04 | C1062362 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| S8-05 | C1062363 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| S8-06 | C1062364 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| S8-07 | C1062365 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| S8-08 | C1062366 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| S8-09 | C1062367 | CONFIRMED (proposed delete) | CONFIRMED (proposed delete) | CONFIRMED (proposed delete) | CONFIRMED (proposed delete) | CONFIRMED (proposed delete) | CONFIRMED (proposed delete) | CONFIRMED (proposed delete) | CONFIRMED (proposed delete) | CONFIRMED (proposed delete) | CONFIRMED (proposed delete) |
| S8-10 | C1062368 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| S8-11 | C1062369 | CHANGED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| S8-12 | C1062370 | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| S8-13 | C1062371 | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| S8-14 | C1062372 | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CONFIRMED | CHANGED | CHANGED | CHANGED | CHANGED | CONFIRMED |
| S8-15 | C1062373 | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CHANGED | CONFIRMED | CONFIRMED | CONFIRMED | CONFIRMED |
| S8-16 | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW |
| S8-17 | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW |
| S8-18 | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW |
| S8-19 | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW |
| S8-20 | new | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW | NEW |

Re-stamped only (332; title, preconditions, steps, results, quotes, references and marker CONFIRMED, From line CHANGED): API-01 C1062467, API-02 C1062468, API-03 C1062469, API-04 C1062470, API-05 C1062471, API-06 C1062472, API-07 C1062473, API-08 C1062474, API-09 C1062475, API-10 C1062476, API-11 C1062477, API-12 C1062478, D-01 C1062496, D-02 C1062497, D-03 C1062498, D-04 C1062499, D-05 C1062500, D-06 C1062501, D-07 C1062502, D-08 C1062503, D-09 C1062504, D-10 C1062505, D-100 C1145287, D-101 C1145288, D-102 C1145289, D-103 C1145290, D-11 C1062506, D-12 C1062507, D-13 C1062508, D-14 C1062509, D-15 C1062510, D-16 C1062511, D-17 C1062512, D-18 C1062513, D-19 C1062514, D-20 C1062515, D-21 C1062516, D-22 C1062517, D-23 C1062518, D-24 C1062519, D-25 C1062520, D-26 C1062521, D-27 C1062522, D-28 C1062523, D-29 C1062524, D-30 C1062525, D-31 C1062526, D-32 C1062527, D-33 C1062528, D-34 C1062529, D-35 C1062530, D-47 C1062542, D-48 C1062543, D-49 C1062544, D-50 C1062545, D-51 C1062546, D-52 C1062547, D-53 C1062548, D-54 C1062549, D-55 C1062550, D-56 C1062551, D-57 C1062552, D-58 C1062553, D-59 C1062554, D-60 C1062555, D-61 C1062556, D-62 C1062557, D-63 C1062558, D-64 C1062559, D-66 C1062561, D-67 C1062562, D-68 C1062563, D-69 C1062564, D-70 C1062565, D-71 C1145261, D-72 C1145262, D-73 C1145263, D-74 C1145264, D-75 C1145265, D-76 C1145266, D-77 C1145267, D-78 C1145268, D-79 C1145269, D-80 C1145270, D-81 C1145271, D-85 C1145272, D-86 C1145273, D-87 C1145274, D-88 C1145275, D-89 C1145276, D-90 C1145277, D-91 C1145278, D-92 C1145279, D-93 C1145280, D-94 C1145281, D-95 C1145282, D-96 C1145283, D-97 C1145284, D-98 C1145285, D-99 C1145286, DATA-01 C1062479, DATA-02 C1062480, DATA-03 C1062481, DATA-04 C1062482, INV-01 C1062488, INV-02 C1062489, INV-03 C1062490, INV-04 C1062491, INV-05 C1062492, INV-07 C1062494, REL-01 C1062483, REL-03 C1062485, REL-04 C1062486, REL-05 C1062487, S1-01 C1061212, S1-02 C1061213, S1-03 C1061214, S1-04 C1061215, S1-05 C1061216, S1-06 C1061217, S1-07 C1061218, S1-08 C1061219, S1-09 C1061220, S1-10 C1061221, S1-11 C1061222, S1-12 C1061223, S1-13 C1061224, S1-14 C1061225, S1-15 C1061226, S1-16 C1061227, S10-01 C1062380, S10-02 C1062381, S10-03 C1062382, S10-04 C1062383, S10-05 C1062384, S10-06 C1062385, S10-07 C1062386, S10-09 C1062387, S10-10 C1062388, S10-11 C1062389, S10-12 C1062390, S10-13 C1062391, S11-01 C1062392, S11-02 C1062393, S11-03 C1062394, S11-04 C1062395, S11-05 C1062396, S11-06 C1062397, S11-07 C1062398, S11-08 C1062399, S12-01 C1062400, S12-02 C1062401, S12-03 C1062402, S12-04 C1062403, S12-05 C1062404, S12-06 C1062405, S12-07 C1062406, S12-08 C1062407, S12-09 C1062408, S12-10 C1062409, S12-11 C1062410, S12-12 C1062411, S12-13 C1062412, S13-01 C1062413, S13-02 C1062414, S13-03 C1062415, S13-04 C1062416, S13-05 C1062417, S13-06 C1062418, S14-01 C1062419, S14-02 C1062420, S14-03 C1062421, S14-04 C1062422, S14-05 C1062423, S14-06 C1062424, S14-07 C1062425, S14-08 C1062426, S14-09 C1062427, S14-10 C1062428, S14-11 C1062429, S14-12 C1062430, S14-13 C1062431, S15-01 C1062432, S15-02 C1062433, S15-03 C1062434, S15-04 C1062435, S15-05 C1062436, S15-06 C1062437, S16-01 C1062438, S16-02 C1062439, S16-03 C1062440, S16-04 C1062441, S16-05 C1062442, S16-06 C1062443, S16-07 C1062444, S16-08 C1062445, S17-01 C1062446, S17-02 C1062447, S17-03 C1062448, S17-04 C1062449, S17-05 C1062450, S17-06 C1062451, S17-07 C1062452, S17-08 C1062453, S18-01 C1062454, S18-02 C1062455, S18-03 C1062456, S18-04 C1062457, S18-05 C1062458, S19-01 C1062459, S19-02 C1062460, S19-03 C1062461, S19-04 C1062462, S19-05 C1062463, S19-06 C1062464, S19-07 C1062465, S19-08 C1062466, S19-09 C1145291, S2-01 C1061355, S2-02 C1061356, S2-03 C1061868, S2-04 C1061869, S2-05 C1062125, S2-06 C1062126, S2-07 C1062254, S2-09 C1062255, S2-10 C1062256, S2-11 C1062257, S2-12 C1062258, S2-13 C1062259, S2-14 C1062260, S2-15 C1062261, S2-16 C1062262, S3-01 C1062263, S3-02 C1062264, S3-03 C1062265, S3-04 C1062266, S3-05 C1062267, S3-06 C1062268, S3-07 C1062269, S3-08 C1062270, S3-09 C1062271, S3-10 C1062272, S3-11 C1062273, S3-12 C1062274, S3-13 C1062275, S3-14 C1062276, S3-15 C1062277, S3-16 C1062278, S3-17 C1062279, S3-18 C1062280, S3-19 C1062281, S3-20 C1062282, S3-22 C1062283, S3-23 C1062284, S3-24 C1062285, S3-25 C1062286, S3-26 C1062287, S3-27 C1062288, S3-28 C1062289, S3-29 C1062290, S3-31 C1062291, S3-32 C1062292, S4-01 C1062293, S4-02 C1062294, S4-03 C1062295, S4-04 C1062296, S4-05 C1062297, S4-06 C1062298, S4-07 C1062299, S4-08 C1062300, S5-01 C1062301, S5-02 C1062302, S5-03 C1062303, S5-04 C1062304, S5-05 C1062305, S5-06 C1062306, S5-07 C1062307, S5-08 C1062308, S5-09 C1062309, S5-10 C1062310, S5-12 C1062311, S5-13 C1062312, S5-14 C1062313, S5-15 C1062314, S5-16 C1062315, S5-17 C1062316, S5-18 C1062317, S5-19 C1062318, S5-20 C1062319, S5-21 C1062320, S5-22 C1062321, S5-23 C1062322, S5-24 C1062323, S5-25 C1062324, S6-01 C1062325, S6-02 C1062326, S6-03 C1062327, S6-04 C1062328, S6-05 C1062329, S6-06 C1062330, S6-07 C1062331, S6-08 C1062332, S6-09 C1062333, S6-10 C1062334, S7-03 C1062337, S7-04 C1062338, S7-05 C1062339, S7-06 C1062340, S7-07 C1062341, S7-08 C1062342, S7-09 C1062343, S7-10 C1062344, S7-11 C1062345, S7-12 C1062346, S7-13 C1062347, S7-14 C1062348, S7-16 C1062349, S7-17 C1062350, S7-18 C1062351, S7-19 C1062352, S7-20 C1062353, S7-21 C1062354, S7-22 C1062355, S7-23 C1062356, S7-25 C1062358, S9-01 C1062374, S9-02 C1062375, S9-03 C1062376, S9-04 C1062377, S9-05 C1062378, S9-07 C1062379

## Reading coverage

- `sources/PRD-DIFF-v0.5-to-2026-11-14.txt`: 27 lines, both sides read in full.
- `sources/CONFLUENCE-1003585538-read-2026-11-14.md` (51,499 bytes): Story 8 (lines 388-417) and Story 6 rows read in full; the whole copy checked by script (every quote of every case, 179 requirement codes, 19 User Feedback rows, every named item).
- Old Story 8 (v0.5 copy) read in full for the comparison.
- Design: `ServiceFor.dc.html` version 1794608112-d8a1 (12,171 bytes) read in full as text; the 7 other boards compared byte for byte (identical); one redrawn picture viewed (modern invoice: name in the address's weight, unit only in the asset table).
- Every rewritten and new case read in full (tester text; quotes, references and marker blocks on S8-01, D-36, D-65, D-82, D-84); siblings built from the same templates (S8-03, S8-04, D-39, D-41, D-43, D-45) read too.

## Scripts (prepared, not run)

- `update_story8.py`: readiness check; per case locked on the live text (skips and lists edits made outside our library, Automated cases, other authors); changed fields only; read-back; redrawn pictures attached and old page 4 pictures deleted where TestRail allows; map prd_version set to the new copy for each case written. S8-09 not touched; no run change.
- `create_story8.py`: S8-16 to S8-20 and D-82 to D-84; readiness check; foreign-case guard; read-back; pictures; run 558 union only; assigned to user 6.
- `folder_note.py`: Rule 140 note on folder 132467, "current as of 11/14/2026"; dry run saves the live description as the lock; --apply writes only if it is unchanged; QA lead's own text kept below.

## Full text of every rewritten and new case

### D-36 · Design: Modern invoice billed to someone else prints the two-line band

Folder: Design — how it looks · refs SV-12309,SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have a new customer for this test, customer B, the customer the work is for, with a street, city, province or state and postal or ZIP code on file.
- Have a new customer for this test, customer A, the payer, so the documents bill a customer other than their own.
- Have a new work order for this test for customer B, billed to customer A, invoiced, with an asset that has a unit, year, make and model (for example Unit 854, 2024 International CV515).
- Make sure the organization's document design setting is the modern layout.
- Open the attached pictures bt-p4-02-after-modern-invoice-2026-11-14.png, bt-p4-01-before-modern-invoice-2026-11-14.png at 100% zoom beside the screen.

**Steps**
1. Open the work order.
2. Click the print icon on the Finance tab.

**Expected Result**
Step 1:
- The Finance tab shows the invoice.
Step 2:
- Directly under the ADDRESSES box (Bill To | Remit payment to), a full-width band with a light gray fill and a thin gray border prints.
- Its first line reads "SERVICE FOR".
- Its second line reads customer B's name, then " · ", then customer B's address, in the same weight as the address (the name is not bold).
- The band shows no unit, year, make or model; they print once, in the asset table below the band.
- The Bill To block names customer A.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12309 (Story 7, Invoicing to the Bill To), story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R1: “A full-width band prints directly under the address row. Its first line reads "SERVICE FOR". Its second line reads the customer's name, then " · " and that customer's own address, in the same weight as the address.”
- S8-R4: “The band never repeats the unit, year, make or model; the asset table below it prints them. A part sale prints the same band as a work order.”
- S8-R5: “The band has a light gray fill and a thin gray border so it reads in black and white.”
- S7-R1: “The invoice's Bill To block prints the Bill To's name, address and phone, saved on the invoice when it is created.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: page "4 Service For band on invoices and estimates", pictures "Modern" (This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Modern" (Production (v26.45.2.1), row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)").
Design pictures attached to this case:
- bt-p4-02-after-modern-invoice-2026-11-14.png
- bt-p4-01-before-modern-invoice-2026-11-14.png
The design's own words:
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
- “Unit 854 and 2024 INTERNATIONAL CV515 print once, in the asset table below.”
- “Light gray fill and thin gray border, so it reads in black and white.”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### D-37 · Design: Legacy invoice billed to someone else prints the two-line band

Folder: Design — how it looks · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have a new customer for this test, customer B, the customer the work is for, with a street, city, province or state and postal or ZIP code on file.
- Have a new customer for this test, customer A, the payer, so the documents bill a customer other than their own.
- Have a new work order for this test for customer B, billed to customer A, invoiced.
- Make sure the organization's document design setting is the legacy layout.
- Open the attached pictures bt-p4-04-after-legacy-invoice-2026-11-14.png, bt-p4-03-before-legacy-invoice-2026-11-14.png at 100% zoom beside the screen.

**Steps**
1. Open the work order.
2. Click the print icon on the Finance tab.

**Expected Result**
Step 1:
- The Finance tab shows the invoice.
Step 2:
- The band sits under Bill To and Remit payment to and above the asset table.
- Its first line reads "SERVICE FOR".
- Its second line reads customer B's name, then " · ", then customer B's address, in the same weight as the address (the name is not bold).
- The Bill To block names customer A.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R1: “A full-width band prints directly under the address row. Its first line reads "SERVICE FOR". Its second line reads the customer's name, then " · " and that customer's own address, in the same weight as the address.”
- S8-R6: “The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: page "4 Service For band on invoices and estimates", pictures "Legacy" (This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Legacy" (Production (v26.45.2.1), row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)").
Design pictures attached to this case:
- bt-p4-04-after-legacy-invoice-2026-11-14.png
- bt-p4-03-before-legacy-invoice-2026-11-14.png
The design's own words:
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### D-38 · Design: Modern estimate prints the band with the customer's current address

Folder: Design — how it looks · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have a new customer for this test, customer B, the customer the work is for, with a street, city, province or state and postal or ZIP code on file.
- Have a new customer for this test, customer A, the payer, so the documents bill a customer other than their own.
- Have a new work order for this test for customer B, billed to customer A, in Approved, so it has an estimate.
- Make sure the organization's document design setting is the modern layout.
- Open the attached pictures bt-p4-06-after-modern-estimate-2026-11-14.png, bt-p4-05-before-modern-estimate-2026-11-14.png at 100% zoom beside the screen.

**Steps**
1. Open the work order.
2. Click the print icon on the Finance tab.

**Expected Result**
Step 1:
- The Finance tab shows the estimate.
Step 2:
- The Bill To block names customer A with its address.
- Under it, the band reads "SERVICE FOR" on its first line.
- Its second line reads customer B's name, " · " and the address shown on customer B's page today.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R1: “A full-width band prints directly under the address row. Its first line reads "SERVICE FOR". Its second line reads the customer's name, then " · " and that customer's own address, in the same weight as the address.”
- S8-R6: “The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice.”
- S8-R8: “An invoice prints the name and address it was created with. A later change to that customer's name or address, or to the work order's customer, never changes an existing invoice (S7-E1). An estimate prints them as they are now.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: page "4 Service For band on invoices and estimates", pictures "Modern" (This build, row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)"), "Modern" (Production (v26.45.2.1), row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)").
Design pictures attached to this case:
- bt-p4-06-after-modern-estimate-2026-11-14.png
- bt-p4-05-before-modern-estimate-2026-11-14.png
The design's own words:
- “Bill To: "Buda Truck Repair" with its address. Band: "SERVICE FOR", then "A & J Truck & Trailer Repair · 17483 Shane Drive, Patriciashire, Ontario B4Y6L9".”
- “An estimate reads the customer's current address.”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### D-39 · Design: Legacy estimate billed to someone else prints the two-line band

Folder: Design — how it looks · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have a new customer for this test, customer B, the customer the work is for, with a street, city, province or state and postal or ZIP code on file.
- Have a new customer for this test, customer A, the payer, so the documents bill a customer other than their own.
- Have a new work order for this test for customer B, billed to customer A, in Approved, so it has an estimate.
- Make sure the organization's document design setting is the legacy layout.
- Open the attached pictures bt-p4-08-after-legacy-estimate-2026-11-14.png, bt-p4-07-before-legacy-estimate-2026-11-14.png at 100% zoom beside the screen.

**Steps**
1. Open the work order.
2. Click the print icon on the Finance tab.

**Expected Result**
Step 1:
- The Finance tab shows the estimate.
Step 2:
- The Bill To block names customer A.
- The band sits under the Bill To and Remit payment to row.
- Its first line reads "SERVICE FOR".
- Its second line reads customer B's name, then " · ", then customer B's address, in the same weight as the address (the name is not bold).
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R6: “The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice.”
- S8-R1: “A full-width band prints directly under the address row. Its first line reads "SERVICE FOR". Its second line reads the customer's name, then " · " and that customer's own address, in the same weight as the address.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: page "4 Service For band on invoices and estimates", pictures "Legacy" (This build, row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)"), "Legacy" (Production (v26.45.2.1), row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)").
Design pictures attached to this case:
- bt-p4-08-after-legacy-estimate-2026-11-14.png
- bt-p4-07-before-legacy-estimate-2026-11-14.png
The design's own words:
- “Bill To is Buda; the same band.”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### D-40 · Design: Modern part sale with a vehicle prints the same band, with no unit

Folder: Design — how it looks · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have a new customer for this test, customer B, the customer the work is for, with a street, city, province or state and postal or ZIP code on file.
- Have a new customer for this test, customer A, the payer, so the documents bill a customer other than their own.
- Have a new part sale for this test for customer B, billed to customer A, open, with a vehicle attached that has a unit, year, make and model (for example Unit 4417, 2011 Hyundai Santa Fe).
- Make sure the organization's document design setting is the modern layout.
- Open the attached pictures bt-p4-10-after-modern-part-sale-2026-11-14.png, bt-p4-09-before-modern-part-sale-2026-11-14.png at 100% zoom beside the screen.

**Steps**
1. Open the part sale.
2. Click the print icon on the Finance tab.

**Expected Result**
Step 1:
- The Finance tab shows the part sale document.
Step 2:
- The Bill To block names customer A.
- Under the Bill To and Remit payment to row, a full-width band prints.
- Its first line reads "SERVICE FOR".
- Its second line reads customer B's name, then " · ", then customer B's address, in the same weight as the address (the name is not bold).
- The band shows no unit, year, make or model of the vehicle.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R4: “The band never repeats the unit, year, make or model; the asset table below it prints them. A part sale prints the same band as a work order.”
- S8-R6: “The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: page "4 Service For band on invoices and estimates", pictures "Modern" (This build, row "Part sale (P2-254, 4 Star billed to 7 Star)"), "Modern" (Production (v26.45.2.1), row "Part sale (P2-254, 4 Star billed to 7 Star)").
Design pictures attached to this case:
- bt-p4-10-after-modern-part-sale-2026-11-14.png
- bt-p4-09-before-modern-part-sale-2026-11-14.png
The design's own words:
- “Bill To is 7 Star. Band: "SERVICE FOR", then "4 Star Truck Repair · 6263 Elizabeth Causeway Apt. 973, Raystad, British Columbia V4M 8Y2".”
- “A part sale prints the same band as a work order, vehicle or not.”
The design draws the part sale without a vehicle only; its words say the band is the same "vehicle or not", so this case compares the band's lines with that picture.
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### D-41 · Design: Legacy part sale with a vehicle prints the same band, with no unit

Folder: Design — how it looks · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have a new customer for this test, customer B, the customer the work is for, with a street, city, province or state and postal or ZIP code on file.
- Have a new customer for this test, customer A, the payer, so the documents bill a customer other than their own.
- Have a new part sale for this test for customer B, billed to customer A, open, with a vehicle attached that has a unit, year, make and model (for example Unit 4417, 2011 Hyundai Santa Fe).
- Make sure the organization's document design setting is the legacy layout.
- Open the attached pictures bt-p4-12-after-legacy-part-sale-2026-11-14.png, bt-p4-11-before-legacy-part-sale-2026-11-14.png at 100% zoom beside the screen.

**Steps**
1. Open the part sale.
2. Click the print icon on the Finance tab.

**Expected Result**
Step 1:
- The Finance tab shows the part sale document.
Step 2:
- The Bill To block names customer A.
- Under the Bill To and Remit payment to row, a full-width band prints.
- Its first line reads "SERVICE FOR".
- Its second line reads customer B's name, then " · ", then customer B's address, in the same weight as the address (the name is not bold).
- The band shows no unit, year, make or model of the vehicle.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R4: “The band never repeats the unit, year, make or model; the asset table below it prints them. A part sale prints the same band as a work order.”
- S8-R6: “The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: page "4 Service For band on invoices and estimates", pictures "Legacy" (This build, row "Part sale (P2-254, 4 Star billed to 7 Star)"), "Legacy" (Production (v26.45.2.1), row "Part sale (P2-254, 4 Star billed to 7 Star)").
Design pictures attached to this case:
- bt-p4-12-after-legacy-part-sale-2026-11-14.png
- bt-p4-11-before-legacy-part-sale-2026-11-14.png
The design's own words:
- “Bill To is 7 Star. Band: "SERVICE FOR", then "4 Star Truck Repair · 6263 Elizabeth Causeway Apt. 973, Raystad, British Columbia V4M 8Y2".”
- “A part sale prints the same band as a work order, vehicle or not.”
The design draws the part sale without a vehicle only; its words say the band is the same "vehicle or not", so this case compares the band's lines with that picture.
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### D-42 · Design: Modern part sale without a vehicle prints the same two-line band

Folder: Design — how it looks · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have a new customer for this test, customer B, the customer the work is for, with a street, city, province or state and postal or ZIP code on file.
- Have a new customer for this test, customer A, the payer, so the documents bill a customer other than their own.
- Have a new part sale for this test for customer B, billed to customer A, open, with no vehicle attached.
- Make sure the organization's document design setting is the modern layout.
- Open the attached pictures bt-p4-10-after-modern-part-sale-2026-11-14.png, bt-p4-09-before-modern-part-sale-2026-11-14.png at 100% zoom beside the screen.

**Steps**
1. Open the part sale.
2. Click the print icon on the Finance tab.

**Expected Result**
Step 1:
- The Finance tab shows the part sale document.
Step 2:
- The Bill To block names customer A.
- Under the Bill To and Remit payment to row, a full-width band prints.
- Its first line reads "SERVICE FOR".
- Its second line reads customer B's name, then " · ", then customer B's address, in the same weight as the address (the name is not bold).
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R4: “The band never repeats the unit, year, make or model; the asset table below it prints them. A part sale prints the same band as a work order.”
- S8-R6: “The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: page "4 Service For band on invoices and estimates", pictures "Modern" (This build, row "Part sale (P2-254, 4 Star billed to 7 Star)"), "Modern" (Production (v26.45.2.1), row "Part sale (P2-254, 4 Star billed to 7 Star)").
Design pictures attached to this case:
- bt-p4-10-after-modern-part-sale-2026-11-14.png
- bt-p4-09-before-modern-part-sale-2026-11-14.png
The design's own words:
- “Bill To is 7 Star. Band: "SERVICE FOR", then "4 Star Truck Repair · 6263 Elizabeth Causeway Apt. 973, Raystad, British Columbia V4M 8Y2".”
- “A part sale prints the same band as a work order, vehicle or not.”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### D-43 · Design: Legacy part sale without a vehicle prints the same two-line band

Folder: Design — how it looks · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have a new customer for this test, customer B, the customer the work is for, with a street, city, province or state and postal or ZIP code on file.
- Have a new customer for this test, customer A, the payer, so the documents bill a customer other than their own.
- Have a new part sale for this test for customer B, billed to customer A, open, with no vehicle attached.
- Make sure the organization's document design setting is the legacy layout.
- Open the attached pictures bt-p4-12-after-legacy-part-sale-2026-11-14.png, bt-p4-11-before-legacy-part-sale-2026-11-14.png at 100% zoom beside the screen.

**Steps**
1. Open the part sale.
2. Click the print icon on the Finance tab.

**Expected Result**
Step 1:
- The Finance tab shows the part sale document.
Step 2:
- The Bill To block names customer A.
- Under the Bill To and Remit payment to row, a full-width band prints.
- Its first line reads "SERVICE FOR".
- Its second line reads customer B's name, then " · ", then customer B's address, in the same weight as the address (the name is not bold).
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R4: “The band never repeats the unit, year, make or model; the asset table below it prints them. A part sale prints the same band as a work order.”
- S8-R6: “The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: page "4 Service For band on invoices and estimates", pictures "Legacy" (This build, row "Part sale (P2-254, 4 Star billed to 7 Star)"), "Legacy" (Production (v26.45.2.1), row "Part sale (P2-254, 4 Star billed to 7 Star)").
Design pictures attached to this case:
- bt-p4-12-after-legacy-part-sale-2026-11-14.png
- bt-p4-11-before-legacy-part-sale-2026-11-14.png
The design's own words:
- “Bill To is 7 Star. Band: "SERVICE FOR", then "4 Star Truck Repair · 6263 Elizabeth Causeway Apt. 973, Raystad, British Columbia V4M 8Y2".”
- “A part sale prints the same band as a work order, vehicle or not.”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### D-44 · Design: Modern invoice that pays for itself prints no band

Folder: Design — how it looks · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have customer B with no saved Bill Invoices To, so the customer bills itself.
- Have a new work order for this test for customer B billing itself, invoiced.
- Set the document design to modern (Settings, invoice and estimate design).
- Open the attached pictures bt-p4-14-after-modern-pays-for-itself-2026-11-14.png, bt-p4-13-before-modern-pays-for-itself-2026-11-14.png at 100% zoom beside the screen.

**Steps**
1. Open the work order.
2. Click the print icon on the Finance tab.

**Expected Result**
Step 1:
- The Finance tab shows the invoice.
Step 2:
- No SERVICE FOR band prints; the asset row follows the ADDRESSES box directly, as in production.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-N1: “When the customer pays for itself, no band prints and the document is unchanged.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn), read 14 Nov 2026: page "4 Service For band on invoices and estimates", pictures "Modern, pays for itself" (This build), "Modern, pays for itself" (Production (v26.45.2.1)).
Design pictures attached to this case:
- bt-p4-14-after-modern-pays-for-itself-2026-11-14.png
- bt-p4-13-before-modern-pays-for-itself-2026-11-14.png
The design's own words:
- “No band. Identical to production (same render, same bytes).”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### D-45 · Design: Legacy invoice that pays for itself prints no band

Folder: Design — how it looks · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have customer B with no saved Bill Invoices To, so the customer bills itself.
- Have a new work order for this test for customer B billing itself, invoiced.
- Set the document design to legacy (Settings, invoice and estimate design).
- Open the attached pictures bt-p4-16-after-legacy-pays-for-itself-2026-11-14.png, bt-p4-15-before-legacy-pays-for-itself-2026-11-14.png at 100% zoom beside the screen.

**Steps**
1. Open the work order.
2. Click the print icon on the Finance tab.

**Expected Result**
Step 1:
- The Finance tab shows the invoice.
Step 2:
- No band prints; the asset table follows the Bill To / Remit payment to row, as in production.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-N1: “When the customer pays for itself, no band prints and the document is unchanged.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn), read 14 Nov 2026: page "4 Service For band on invoices and estimates", pictures "Legacy, pays for itself" (This build), "Legacy, pays for itself" (Production (v26.45.2.1)).
Design pictures attached to this case:
- bt-p4-16-after-legacy-pays-for-itself-2026-11-14.png
- bt-p4-15-before-legacy-pays-for-itself-2026-11-14.png
The design's own words:
- “No band. Identical to production (same render, same bytes).”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### D-46 · Design: Batch invoice prints a band only on invoices billed to someone else

Folder: Design — how it looks · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have a new customer for this test, customer B, the customer the work is for, with a street, city, province or state and postal or ZIP code on file.
- Have a new customer for this test, customer A, the payer, so the documents bill a customer other than their own.
- Have two new invoiced work orders for this test for customer B: invoice 1 billed to customer A, invoice 2 billing customer B itself.
- Make sure the organization's document design setting is the legacy layout.
- Open the attached pictures bt-p4-18-after-batch-page-1-2026-11-14.png, bt-p4-17-before-batch-page-1-2026-11-14.png at 100% zoom beside the screen.

**Steps**
1. Open customer B's Invoices tab.
2. Tick invoice 1.
3. Tick invoice 2.
4. Print the selected invoices as one batch.

**Expected Result**
Step 1:
- The list opens.
Step 2:
- Invoice 1's row is ticked.
Step 3:
- Both rows are ticked.
Step 4:
- Invoice 1's page has the band under the Bill To row: "SERVICE FOR", then customer B's name, " · " and customer B's address.
- Invoice 2's page has no band.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R6: “The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice.”
- S8-N1: “When the customer pays for itself, no band prints and the document is unchanged.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: page "4 Service For band on invoices and estimates", pictures "Batch, page 1" (This build, row "Pays for itself, unchanged (S2-17322), and batch"), "Batch, page 1" (Production (v26.45.2.1), row "Pays for itself, unchanged (S2-17322), and batch").
Design pictures attached to this case:
- bt-p4-18-after-batch-page-1-2026-11-14.png
- bt-p4-17-before-batch-page-1-2026-11-14.png
The design's own words:
- “Page 1 is S2-17581 with its band. In the full PDF each invoice billed to someone else gets its own band; S2-17513 reads "SERVICE FOR", then "Orchard City Truck & Trailer Repair · 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3". S2-17322 gets none.”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### D-65 · Design: Legacy invoice Bill To block prints no phone

Folder: Design — how it looks · refs SV-12309 · held: yes

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Have customer A with a phone number and customer B, so the payer's block has a phone to print.
- Have a new work order for this test for customer B billed to customer A, invoiced, so a work order bills a customer other than its own.
- Set the document design to legacy.
- Open the attached pictures bt-p4-04-after-legacy-invoice-2026-11-14.png, bt-p4-02-after-modern-invoice-2026-11-14.png at 100% zoom beside the screen.

**Steps**
1. Open the work order.
2. Click the print icon on the Finance tab.

**Expected Result**
Step 1:
- The Finance tab shows the invoice.
Step 2:
- The Bill To block shows customer A's name and address with no phone line (the modern layout prints the phone).
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12309 (Story 7, Invoicing to the Bill To)
- S7-R1: “The invoice's Bill To block prints the Bill To's name, address and phone, saved on the invoice when it is created.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn), read 14 Nov 2026: page "4 Service For band on invoices and estimates", pictures "Legacy" (This build), "Modern" (This build).
Design pictures attached to this case:
- bt-p4-04-after-legacy-invoice-2026-11-14.png
- bt-p4-02-after-modern-invoice-2026-11-14.png
The design's own words:
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
Difference: S7-R1 says the Bill To block prints the phone (BT-D05, question 8).
AUTOMATION: HOLD - the design differs from the PRD, waiting on the PO (question 8)

### D-82 · Design: A long name and address stay inside the band on modern invoices

Folder: Design — how it looks · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, with a long name with no spaces that no other customer has, at least 50 characters (for example NorthernPlainsHeavyTruckandTrailerRepairServicesWest), with a long address on file: a street, an Address 2, a city, a province or state and a postal or ZIP code, at least 80 characters in all (for example 8237 Brittney Divide Apartment 463, Building 891 Rear Entrance, Walshhaven, British Columbia P5H 7C4).
- Have a new customer for this test, customer C, a second customer the work is for, with a name that no other customer has and that includes each of the characters & " ' < > (for example A&B "Fleet" O'Neil <Parts> & Sons), with an address on file.
- Have a new customer for this test, customer B, the payer, so each invoice bills someone other than its customer.
- If a name field stops before the end of a name, use the longest name it takes.
- Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B.
- Have a new work order for this test, work order 2, for customer C, invoiced, billed to customer B.
- Open the attached picture bt-p4-02-after-modern-invoice-2026-11-14.png at 100% zoom beside the screen.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Click the print icon on the Finance tab.
4. Open the invoice's PDF.
5. Open work order 2.
6. Open the Finance tab.
7. Open the invoice's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- Directly under the address row, a full-width band prints; its first line reads "SERVICE FOR".
- Its second line reads customer A's name, " · " and customer A's address.
- Customer A's name and the whole address stay inside the band: no part of them runs past the band's right edge or the page's edge.
- If the address runs onto another line, the break comes before the province or state: the province or state and the postal code are on the same line, and the postal code is never split.
Step 4:
- The PDF shows the same band, with customer A's name and address inside it and the province or state and postal code on one line.
Step 5:
- Work order 2 opens for customer C.
Step 6:
- The Finance tab shows the invoice.
Step 7:
- The band reads "SERVICE FOR", then customer C's name, " · " and customer C's address.
- Customer C's name shows exactly as saved: the & " ' < > characters appear as typed, not changed into other characters or codes.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R1: “A full-width band prints directly under the address row. Its first line reads "SERVICE FOR". Its second line reads the customer's name, then " · " and that customer's own address, in the same weight as the address.”
- S8-R2: “The address reads street, then Address 2 when filled, city, then the province or state and the postal or ZIP code, the parts separated by commas, for example "965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3". The province or state and the postal code never split across two lines.”
- S8-R7: “The band leaves the address row free for a future Ship To block.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: page "4 Service For band on invoices and estimates", pictures "Modern" (This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-02-after-modern-invoice-2026-11-14.png
The design's own words:
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
The design draws the band with ordinary names and addresses only; it draws no name without spaces and no name with & " ' < >. The long name and long address follow the design-case checklist (lesson L-21); the line-break rule comes from the PRD and the design's own words above.
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### D-83 · Design: A long name and address stay inside the band on legacy invoices

Folder: Design — how it looks · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Use a desktop browser window 1440 pixels wide, at 100% zoom.
- Make sure the organization's document design setting is the legacy layout.
- Have a new customer for this test, customer A, the customer the work is for, with a long name with no spaces that no other customer has, at least 50 characters (for example NorthernPlainsHeavyTruckandTrailerRepairServicesWest), with a long address on file: a street, an Address 2, a city, a province or state and a postal or ZIP code, at least 80 characters in all (for example 8237 Brittney Divide Apartment 463, Building 891 Rear Entrance, Walshhaven, British Columbia P5H 7C4).
- Have a new customer for this test, customer C, a second customer the work is for, with a name that no other customer has and that includes each of the characters & " ' < > (for example A&B "Fleet" O'Neil <Parts> & Sons), with an address on file.
- Have a new customer for this test, customer B, the payer, so each invoice bills someone other than its customer.
- If a name field stops before the end of a name, use the longest name it takes.
- Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B.
- Have a new work order for this test, work order 2, for customer C, invoiced, billed to customer B.
- Open the attached picture bt-p4-04-after-legacy-invoice-2026-11-14.png at 100% zoom beside the screen.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Click the print icon on the Finance tab.
4. Open the invoice's PDF.
5. Open work order 2.
6. Open the Finance tab.
7. Open the invoice's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- Under Bill To and Remit payment to, above the asset table, a full-width band prints; its first line reads "SERVICE FOR".
- Its second line reads customer A's name, " · " and customer A's address.
- Customer A's name and the whole address stay inside the band: no part of them runs past the band's right edge or the page's edge.
- If the address runs onto another line, the break comes before the province or state: the province or state and the postal code are on the same line, and the postal code is never split.
Step 4:
- The PDF shows the same band, with customer A's name and address inside it and the province or state and postal code on one line.
Step 5:
- Work order 2 opens for customer C.
Step 6:
- The Finance tab shows the invoice.
Step 7:
- The band reads "SERVICE FOR", then customer C's name, " · " and customer C's address.
- Customer C's name shows exactly as saved: the & " ' < > characters appear as typed, not changed into other characters or codes.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R1: “A full-width band prints directly under the address row. Its first line reads "SERVICE FOR". Its second line reads the customer's name, then " · " and that customer's own address, in the same weight as the address.”
- S8-R2: “The address reads street, then Address 2 when filled, city, then the province or state and the postal or ZIP code, the parts separated by commas, for example "965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3". The province or state and the postal code never split across two lines.”
- S8-R7: “The band leaves the address row free for a future Ship To block.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: page "4 Service For band on invoices and estimates", pictures "Legacy" (This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-04-after-legacy-invoice-2026-11-14.png
The design's own words:
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
- “A long address wraps before the province and postal code, never inside "P5H 7C4".”
The design draws the band with ordinary names and addresses only; it draws no name without spaces and no name with & " ' < >. The long name and long address follow the design-case checklist (lesson L-21); the line-break rule comes from the PRD and the design's own words above.
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### D-84 · Design: Invoice Bill To block prints a long payer name with its IBS number

Folder: Design — how it looks · refs SV-12309,SV-12321 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Use a test organization connected to IBS.
- Have a new customer for this test, customer A, the customer the work is for, with its own IBS account number.
- Have a new customer for this test, customer B, the payer, with an IBS account number different from customer A's, with a long name with no spaces that no other customer has, at least 50 characters (for example NorthernPlainsHeavyTruckandTrailerRepairServicesWest).
- Have a new customer for this test, customer C, a second payer, with an IBS account number of its own, with a name that no other customer has and that includes each of the characters & " ' < > (for example A&B "Fleet" O'Neil <Parts> & Sons).
- If a name field stops before the end of a name, use the longest name it takes.
- Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B.
- Have a new work order for this test, work order 2, for customer A, invoiced, billed to customer C.
- Open the attached picture bt-p4-02-after-modern-invoice-2026-11-14.png at 100% zoom beside the screen.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the invoice's document.
4. Open work order 2.
5. Open the Finance tab.
6. Open the invoice's document.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- The Bill To block shows customer B's name followed by "(IBS#: [customer B's IBS number])", then customer B's address and phone.
- Customer B's name and the IBS number stay inside the Bill To block: no part of them runs into the block beside it or past the page's edge.
- The IBS number is fully visible.
Step 4:
- Work order 2 opens for customer A.
Step 5:
- The Finance tab shows the invoice.
Step 6:
- The Bill To block shows customer C's name followed by "(IBS#: [customer C's IBS number])".
- Customer C's name shows exactly as saved: the & " ' < > characters appear as typed, not changed into other characters or codes.
Words in square brackets in a message stand for the value they name, such as customer B's name exactly as it is saved; every other word of the message must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12309 (Story 7, Invoicing to the Bill To), story SV-12321 (Story 19, IBS, invoice export and Public API)
- S7-R1: “The invoice's Bill To block prints the Bill To's name, address and phone, saved on the invoice when it is created.”
- S19-R3: “The remit-to, the "(IBS#: [number])" after the Bill To's name and the IBS batch read the saved number.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: page "4 Service For band on invoices and estimates", pictures "Modern" (This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-02-after-modern-invoice-2026-11-14.png
The picture shows the invoice's Bill To block (the ADDRESSES box, left) with an ordinary name and no IBS number; compare only the block's place and lines. The design draws this place with ordinary names only; it draws no long name without spaces and no name with & " ' < >. The stress check follows the design-case checklist (lesson L-21); the expected words come from the PRD quotes above.
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### INV-06 · An imported historical invoice has no Bill To and is unchanged

Folder: What must not change · refs SV-12289 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Have a new customer for this test, customer A, the customer the work is for.
- Have one historical invoice for customer A imported for this test through Data Import, Invoices.

**Steps**
1. Open customer A's Invoices tab.
2. Open the imported invoice.

**Expected Result**
Step 1:
- The imported invoice is listed for customer A.
- No "Service For" column shows.
Step 2:
- The imported invoice names customer A only.
- It shows no Bill To other than customer A and no "SERVICE FOR" band.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289
- Out of Scope: “Historical imports and AccountingHub manual invoices. No Bill To; unchanged.”
The build is not yet available to check this case against.
AUTOMATION: Not available on Build to test Yet - Last checked 11/9/2026

### INV-08 · A shop that never picks a payer sees today's invoice and totals

Folder: What must not change · refs SV-12310,SV-12312 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Have a new customer for this test, customer A, that bills itself.
- Have a new work order for this test, work order 1, for customer A, in Complete, ready to invoice, with one part sold at $100.00 at the test location's 5% tax, that bills itself.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Click Create Invoice.
4. Open the new invoice's PDF.
5. Open customer A's Invoices tab.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The estimate shows Total $105.00 ($100.00 + 5% tax $5.00).
Step 3:
- The invoice is created for $105.00.
Step 4:
- The Bill To block names customer A.
- No "SERVICE FOR" band prints.
Step 5:
- The invoice is listed with Total $105.00.
- No "Service For" column shows.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates), story SV-12312 (Story 10, Receivables follow the Bill To)
- Goals: “A shop that never picks a different Bill To sees every total, balance, report and document unchanged.”
- Key Decisions: “Bill To shows only where it differs from the customer.”
- Feature Overview, Core Bill To: “The Bill To shows only where it differs from the customer. A customer that pays for itself sees nothing new on its documents.”
- S8-N1: “When the customer pays for itself, no band prints and the document is unchanged.”
- S10-N1: “The "Service For" column is hidden when no row on the tab, before any search, is billed for someone else.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Orchard City, Invoices" (page 5 "Getting paid", This build), "Modern, pays for itself" (page 4 "Service For band on invoices and estimates", This build, row "Pays for itself, unchanged (S2-17322), and batch"), "Legacy, pays for itself" (page 4 "Service For band on invoices and estimates", This build, row "Pays for itself, unchanged (S2-17322), and batch"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p5-10-after-orchard-city-invoices.png
- bt-p4-14-after-modern-pays-for-itself-2026-11-14.png
- bt-p4-16-after-legacy-pays-for-itself-2026-11-14.png
The design's own words:
- “S2-17513 was Orchard City's work but is not on its tab, so it cannot be paid from Orchard City's side.”
- “No band. Identical to production (same render, same bytes).”
AUTOMATION: Not available on Build to test Yet - Last checked 11/9/2026

### REL-02 · Existing invoices and balances are unchanged after the release

Folder: Run on Production After Release · refs SV-12310 · held: yes

**Preconditions**
- Sign in as an Admin at the test location.
- Use the production test account.
- Have a new customer for this test, customer A, created on production before the release, with an invoice and a balance noted before the release.
- Have a new work order for this test, work order 1, for customer A, invoiced on production before the release.

**Steps**
1. Open customer A's Invoices tab.
2. Open work order 1.
3. Open the Finance tab.
4. Open the invoice's PDF.

**Expected Result**
Step 1:
- Work order 1's invoice is listed with the same total and balance as noted before the release.
- No "Service For" column shows.
Step 2:
- Work order 1 opens for customer A.
Step 3:
- The Finance tab lists the invoice.
Step 4:
- The Bill To block names customer A and no Service For band prints: the document matches the day before.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- Feature Overview, Release day: “Nothing is migrated. Every existing work order, part sale and invoice already has one customer in both roles, so every total, balance, report and document matches the day before.”
- Goals: “A shop that never picks a different Bill To sees every total, balance, report and document unchanged.”
- S8-N2: “Invoices created before this release never print the band.”
The build is not yet available to check this case against.
AUTOMATION: HOLD - needs records made on production before the release reaches production; run on production after the release

### S7-01 · The invoice's Bill To block prints the payer's name, address and phone

Folder: Invoicing to the Bill To · refs SV-12309 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, on the COD credit term.
- Have a new customer for this test, customer B, the payer, with an address and a phone number different from customer A's.
- Have a new work order for this test, work order 1, for customer A, in Complete, ready to invoice, billed to customer B.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Click Create Invoice.
4. Open the new invoice's document.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows Create Invoice.
Step 3:
- The invoice is created.
Step 4:
- The Bill To block shows customer B's name, address and phone number.
- Customer A's address and phone are not in the Bill To block.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12309 (Story 7, Invoicing to the Bill To)
- S7-R1: “The invoice's Bill To block prints the Bill To's name, address and phone, saved on the invoice when it is created.”
- Feature Overview, State by action (Action | Open | Invoiced | Internal or No Charge): “Create the invoice | Allowed, unless the Bill To is on Credit Hold (M2) or requires a PO and Customer PO is empty | n/a | No invoice”
- Goals: “A shop can invoice a customer other than the one the work is for, without changing the work order's customer.”
- Feature Overview, Core Bill To: “The Bill To owns the receivable: payment terms and due date, credit limit, Credit Hold, Customer PO and "PO is required", deposits, payments, credits, the QuickBooks invoice customer, IBS, the portal Pay button and the invoice email.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)"), "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Part sale (P2-254, 4 Star billed to 7 Star)"), "Batch, page 1" (page 4 "Service For band on invoices and estimates", This build, row "Pays for itself, unchanged (S2-17322), and batch"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-04-after-legacy-invoice-2026-11-14.png
- bt-p4-08-after-legacy-estimate-2026-11-14.png
- bt-p4-12-after-legacy-part-sale-2026-11-14.png
- bt-p4-18-after-batch-page-1-2026-11-14.png
The design's own words:
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
- “Bill To is Buda; the same band.”
- “The same band.”
Difference BT-D05 on S7-R1 (BT-D05 legacy prints no phone; modern prints it): this case follows the PRD; the design's version is asked in question 8.
AUTOMATION: Not available on Build to test Yet - Last checked 11/9/2026

### S7-02 · Later changes to the payer do not change an existing invoice

Folder: Invoicing to the Bill To · refs SV-12309 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Have a new customer for this test, customer A.
- Have a new customer for this test, customer B, the payer, on the Net 30 credit term, with an address and a phone number.
- Have a new work order for this test, work order 1, for customer A, invoiced today (no payment applied), billed to customer B.

**Steps**
1. Open customer B's Edit Customer window.
2. Change customer B's name to a new name.
3. Change customer B's first address line to a new one.
4. Change customer B's Credit Terms to Net 15.
5. Click Save.
6. Open work order 1.
7. Open the Finance tab.
8. Open the invoice's document.

**Expected Result**
Step 1:
- Customer B's Edit Customer window opens.
Step 2:
- The name field shows the new name.
Step 3:
- Address 1 shows the new line.
Step 4:
- Credit Terms shows Net 15.
Step 5:
- The window closes.
Step 6:
- Work order 1 opens for customer A.
Step 7:
- The Finance tab lists the invoice.
Step 8:
- The Bill To block still shows customer B's old name and old address line.
- The due date is still 30 days after the invoice date.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12309 (Story 7, Invoicing to the Bill To)
- S7-E1: “Later changes to the Bill To's name, address or terms never change an existing invoice.”
- S7-R1: “The invoice's Bill To block prints the Bill To's name, address and phone, saved on the invoice when it is created.”
- S7-R2: “The Bill To's credit term, saved on the invoice, sets the due date.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)"), "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Part sale (P2-254, 4 Star billed to 7 Star)"), "Batch, page 1" (page 4 "Service For band on invoices and estimates", This build, row "Pays for itself, unchanged (S2-17322), and batch"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-04-after-legacy-invoice-2026-11-14.png
- bt-p4-08-after-legacy-estimate-2026-11-14.png
- bt-p4-12-after-legacy-part-sale-2026-11-14.png
- bt-p4-18-after-batch-page-1-2026-11-14.png
The design's own words:
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
- “Bill To is Buda; the same band.”
- “The same band.”
Difference BT-D05 on S7-R1 (BT-D05 legacy prints no phone; modern prints it): this case follows the PRD; the design's version is asked in question 8.
AUTOMATION: Not available on Build to test Yet - Last checked 11/9/2026

### S7-24 · The legacy invoice's Bill To block prints the payer's phone

Folder: Waiting on Chris Ward's answers · refs SV-12309 · held: yes

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the legacy layout.
- Have a new customer for this test, customer A, the customer the work is for, on the COD credit term.
- Have a new customer for this test, customer B, the payer, with an address and a phone number different from customer A's.
- Have a new work order for this test, work order 1, for customer A, in Complete, ready to invoice, billed to customer B.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Click Create Invoice.
4. Open the new invoice's document.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows Create Invoice.
Step 3:
- The invoice is created.
Step 4:
- The Bill To block shows customer B's name, address and phone number.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12309 (Story 7, Invoicing to the Bill To)
- S7-R1: “The invoice's Bill To block prints the Bill To's name, address and phone, saved on the invoice when it is created.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)"), "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Part sale (P2-254, 4 Star billed to 7 Star)"), "Batch, page 1" (page 4 "Service For band on invoices and estimates", This build, row "Pays for itself, unchanged (S2-17322), and batch"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-04-after-legacy-invoice-2026-11-14.png
- bt-p4-08-after-legacy-estimate-2026-11-14.png
- bt-p4-12-after-legacy-part-sale-2026-11-14.png
- bt-p4-18-after-batch-page-1-2026-11-14.png
The design's own words:
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
- “Bill To is Buda; the same band.”
- “The same band.”
Difference BT-D05 on S7-R1 (BT-D05 legacy prints no phone; modern prints it): this case follows the PRD; the design's version is asked in question 8.
AUTOMATION: HOLD - waiting on the PO (question 8)

### S8-01 · Modern invoice prints the two-line Service For band under the address row

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file: street, city, province or state and postal or ZIP code, and no Address 2 (for example 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3).
- Have a new customer for this test, customer B, the payer.
- Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B, with an asset whose Unit is "854", Year 2024, Make "International" and Model "CV515".

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the invoice's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- The Bill To block names customer B.
- Directly under the address row, a full-width band prints; its first line reads "SERVICE FOR".
- Its second line reads customer A's name, then " · ", then customer A's address as street, city, province or state and postal code, separated by commas (for example "[customer A's name] · 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3").
- Customer A's name is in the same weight as the address after it.
- The band shows no unit, year, make or model: "854" and "2024 International CV515" print only in the asset table below the band.
Words in square brackets stand for the value they name, such as customer A's name exactly as it is saved; every other word must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R1: “A full-width band prints directly under the address row. Its first line reads "SERVICE FOR". Its second line reads the customer's name, then " · " and that customer's own address, in the same weight as the address.”
- S8-R2: “The address reads street, then Address 2 when filled, city, then the province or state and the postal or ZIP code, the parts separated by commas, for example "965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3". The province or state and the postal code never split across two lines.”
- S8-R4: “The band never repeats the unit, year, make or model; the asset table below it prints them. A part sale prints the same band as a work order.”
- S8-R6: “The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice.”
- Key Decisions: “"Service For" band on documents, only when the Bill To differs.”
- Feature Overview, Core Bill To: “When the Bill To differs from the customer, printed invoices and estimates carry a "Service For" band naming the customer and its address.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Part sale (P2-254, 4 Star billed to 7 Star)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-02-after-modern-invoice-2026-11-14.png
- bt-p4-04-after-legacy-invoice-2026-11-14.png
- bt-p4-10-after-modern-part-sale-2026-11-14.png
- bt-p4-06-after-modern-estimate-2026-11-14.png
The design's own words:
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
- “Bill To is 7 Star. Band: "SERVICE FOR", then "4 Star Truck Repair · 6263 Elizabeth Causeway Apt. 973, Raystad, British Columbia V4M 8Y2".”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-02 · Legacy invoice prints the two-line Service For band

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the legacy layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file: street, city, province or state and postal or ZIP code, and no Address 2 (for example 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3).
- Have a new customer for this test, customer B, the payer.
- Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B, with an asset whose Unit is "854", Year 2024, Make "International" and Model "CV515".

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the invoice's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- The Bill To block names customer B.
- Directly under the address row, a full-width band prints; its first line reads "SERVICE FOR".
- Its second line reads customer A's name, then " · ", then customer A's address as street, city, province or state and postal code, separated by commas (for example "[customer A's name] · 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3").
- Customer A's name is in the same weight as the address after it.
- The band shows no unit, year, make or model: "854" and "2024 International CV515" print only in the asset table below the band.
Words in square brackets stand for the value they name, such as customer A's name exactly as it is saved; every other word must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R6: “The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice.”
- S8-R1: “A full-width band prints directly under the address row. Its first line reads "SERVICE FOR". Its second line reads the customer's name, then " · " and that customer's own address, in the same weight as the address.”
- S8-R4: “The band never repeats the unit, year, make or model; the asset table below it prints them. A part sale prints the same band as a work order.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Part sale (P2-254, 4 Star billed to 7 Star)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-02-after-modern-invoice-2026-11-14.png
- bt-p4-04-after-legacy-invoice-2026-11-14.png
- bt-p4-10-after-modern-part-sale-2026-11-14.png
- bt-p4-06-after-modern-estimate-2026-11-14.png
The design's own words:
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
- “Bill To is 7 Star. Band: "SERVICE FOR", then "4 Star Truck Repair · 6263 Elizabeth Causeway Apt. 973, Raystad, British Columbia V4M 8Y2".”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-03 · Modern estimate prints the two-line Service For band

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file: street, city, province or state and postal or ZIP code, and no Address 2 (for example 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3).
- Have a new customer for this test, customer B, the payer.
- Have a new work order for this test, work order 1, for customer A, in Approved, billed to customer B.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the estimate's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the estimate.
Step 3:
- The Bill To block names customer B.
- Directly under the address row, a full-width band prints; its first line reads "SERVICE FOR".
- Its second line reads customer A's name, then " · ", then customer A's address as street, city, province or state and postal code, separated by commas (for example "[customer A's name] · 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3").
- Customer A's name is in the same weight as the address after it.
Words in square brackets stand for the value they name, such as customer A's name exactly as it is saved; every other word must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R6: “The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice.”
- S8-R1: “A full-width band prints directly under the address row. Its first line reads "SERVICE FOR". Its second line reads the customer's name, then " · " and that customer's own address, in the same weight as the address.”
- Key Decisions: “"Service For" band on documents, only when the Bill To differs.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)"), "Batch, page 1" (page 4 "Service For band on invoices and estimates", This build, row "Pays for itself, unchanged (S2-17322), and batch"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-02-after-modern-invoice-2026-11-14.png
- bt-p4-04-after-legacy-invoice-2026-11-14.png
- bt-p4-06-after-modern-estimate-2026-11-14.png
- bt-p4-18-after-batch-page-1-2026-11-14.png
The design's own words:
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
- “Bill To: "Buda Truck Repair" with its address. Band: "SERVICE FOR", then "A & J Truck & Trailer Repair · 17483 Shane Drive, Patriciashire, Ontario B4Y6L9".”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-04 · Legacy estimate prints the two-line Service For band

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the legacy layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file: street, city, province or state and postal or ZIP code, and no Address 2 (for example 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3).
- Have a new customer for this test, customer B, the payer.
- Have a new work order for this test, work order 1, for customer A, in Approved, billed to customer B.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the estimate's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the estimate.
Step 3:
- The Bill To block names customer B.
- Directly under the address row, a full-width band prints; its first line reads "SERVICE FOR".
- Its second line reads customer A's name, then " · ", then customer A's address as street, city, province or state and postal code, separated by commas (for example "[customer A's name] · 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3").
- Customer A's name is in the same weight as the address after it.
Words in square brackets stand for the value they name, such as customer A's name exactly as it is saved; every other word must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R6: “The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice.”
- S8-R1: “A full-width band prints directly under the address row. Its first line reads "SERVICE FOR". Its second line reads the customer's name, then " · " and that customer's own address, in the same weight as the address.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)"), "Batch, page 1" (page 4 "Service For band on invoices and estimates", This build, row "Pays for itself, unchanged (S2-17322), and batch"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-02-after-modern-invoice-2026-11-14.png
- bt-p4-04-after-legacy-invoice-2026-11-14.png
- bt-p4-06-after-modern-estimate-2026-11-14.png
- bt-p4-18-after-batch-page-1-2026-11-14.png
The design's own words:
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
- “Bill To: "Buda Truck Repair" with its address. Band: "SERVICE FOR", then "A & J Truck & Trailer Repair · 17483 Shane Drive, Patriciashire, Ontario B4Y6L9".”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-05 · The Service For band is light gray with a thin gray border

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file: street, city, province or state and postal or ZIP code, and no Address 2 (for example 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3).
- Have a new customer for this test, customer B, the payer.
- Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the invoice's PDF.
4. Print the PDF in black and white.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- The Bill To block names customer B.
- The band has a light gray fill and a thin gray border.
Step 4:
- On the black-and-white print the band's fill and border are still visible and both of its lines are readable.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R5: “The band has a light gray fill and a thin gray border so it reads in black and white.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-02-after-modern-invoice-2026-11-14.png
The design's own words:
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-06 · A missing street drops out of the band's address with its comma

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file that has a city, a province or state and a postal or ZIP code but no street (for example Port Peterchester, Yukon Territory Y5P 3K3).
- Have a new customer for this test, customer B, the payer.
- Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the invoice's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- The Bill To block names customer B.
- Directly under the address row, a full-width band prints; its first line reads "SERVICE FOR".
- The second line reads customer A's name, " · ", then the city, a comma, then the province or state and the postal code (for example "[customer A's name] · Port Peterchester, Yukon Territory Y5P 3K3").
- No comma or empty space shows where the street would be: the address starts with the city, right after " · ".
Words in square brackets stand for the value they name, such as customer A's name exactly as it is saved; every other word must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R3: “Missing address parts drop out with their separator. With no address on file, the second line prints the name alone, with no " · ".”
- S8-R2: “The address reads street, then Address 2 when filled, city, then the province or state and the postal or ZIP code, the parts separated by commas, for example "965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3". The province or state and the postal code never split across two lines.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-04-after-legacy-invoice-2026-11-14.png
- bt-p4-02-after-modern-invoice-2026-11-14.png
The design's own words:
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-07 · A missing postal code drops out of the band's address

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file that has a street, a city and a province or state but no postal or ZIP code (for example 965 Smith Course, Port Peterchester, Yukon Territory).
- Have a new customer for this test, customer B, the payer.
- Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the invoice's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- The Bill To block names customer B.
- Directly under the address row, a full-width band prints; its first line reads "SERVICE FOR".
- The second line reads customer A's name, " · ", then the street, the city and the province or state, separated by commas (for example "[customer A's name] · 965 Smith Course, Port Peterchester, Yukon Territory").
- Nothing follows the province or state: no comma and no empty space where the postal code would be.
Words in square brackets stand for the value they name, such as customer A's name exactly as it is saved; every other word must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R3: “Missing address parts drop out with their separator. With no address on file, the second line prints the name alone, with no " · ".”
- S8-R2: “The address reads street, then Address 2 when filled, city, then the province or state and the postal or ZIP code, the parts separated by commas, for example "965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3". The province or state and the postal code never split across two lines.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-04-after-legacy-invoice-2026-11-14.png
- bt-p4-02-after-modern-invoice-2026-11-14.png
The design's own words:
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-08 · A missing city drops out of the band's address with its comma

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file that has a street, a province or state and a postal or ZIP code but no city (for example 965 Smith Course, Yukon Territory Y5P 3K3).
- Have a new customer for this test, customer B, the payer.
- Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the invoice's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- The Bill To block names customer B.
- Directly under the address row, a full-width band prints; its first line reads "SERVICE FOR".
- The second line reads customer A's name, " · ", then the street, a comma, then the province or state and the postal code (for example "[customer A's name] · 965 Smith Course, Yukon Territory Y5P 3K3").
- No two commas show side by side where the city would be.
Words in square brackets stand for the value they name, such as customer A's name exactly as it is saved; every other word must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R3: “Missing address parts drop out with their separator. With no address on file, the second line prints the name alone, with no " · ".”
- S8-R2: “The address reads street, then Address 2 when filled, city, then the province or state and the postal or ZIP code, the parts separated by commas, for example "965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3". The province or state and the postal code never split across two lines.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-04-after-legacy-invoice-2026-11-14.png
- bt-p4-02-after-modern-invoice-2026-11-14.png
The design's own words:
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-10 · A part sale with a vehicle prints the same band, with no unit

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file: street, city, province or state and postal or ZIP code, and no Address 2 (for example 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3).
- Have a new customer for this test, customer B, the payer.
- Have a new part sale for this test, part sale 1, for customer A, invoiced, billed to customer B, with a vehicle attached whose Unit is "4417", Year 2011, Make "Hyundai" and Model "Santa Fe".

**Steps**
1. Open part sale 1.
2. Open the Finance tab.
3. Open the invoice's PDF.

**Expected Result**
Step 1:
- Part sale 1 opens for customer A.
Step 2:
- The Finance tab shows the part sale invoice.
Step 3:
- The Bill To block names customer B.
- Directly under the address row, a full-width band prints; its first line reads "SERVICE FOR".
- Its second line reads customer A's name, then " · ", then customer A's address as street, city, province or state and postal code, separated by commas (for example "[customer A's name] · 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3").
- Customer A's name is in the same weight as the address after it.
- The band shows no "4417" and no "2011 Hyundai Santa Fe".
Words in square brackets stand for the value they name, such as customer A's name exactly as it is saved; every other word must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R4: “The band never repeats the unit, year, make or model; the asset table below it prints them. A part sale prints the same band as a work order.”
- S8-R6: “The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice.”
- S8-R1: “A full-width band prints directly under the address row. Its first line reads "SERVICE FOR". Its second line reads the customer's name, then " · " and that customer's own address, in the same weight as the address.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Part sale (P2-254, 4 Star billed to 7 Star)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-02-after-modern-invoice-2026-11-14.png
- bt-p4-04-after-legacy-invoice-2026-11-14.png
- bt-p4-10-after-modern-part-sale-2026-11-14.png
- bt-p4-06-after-modern-estimate-2026-11-14.png
The design's own words:
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
- “Bill To is 7 Star. Band: "SERVICE FOR", then "4 Star Truck Repair · 6263 Elizabeth Causeway Apt. 973, Raystad, British Columbia V4M 8Y2".”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-11 · A part sale without a vehicle prints the same band

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the legacy layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file: street, city, province or state and postal or ZIP code, and no Address 2 (for example 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3).
- Have a new customer for this test, customer B, the payer.
- Have a new part sale for this test, part sale 1, for customer A, invoiced, billed to customer B, with no vehicle attached.

**Steps**
1. Open part sale 1.
2. Open the Finance tab.
3. Open the invoice's PDF.

**Expected Result**
Step 1:
- Part sale 1 opens for customer A.
Step 2:
- The Finance tab shows the part sale invoice.
Step 3:
- The Bill To block names customer B.
- Directly under the address row, a full-width band prints; its first line reads "SERVICE FOR".
- Its second line reads customer A's name, then " · ", then customer A's address as street, city, province or state and postal code, separated by commas (for example "[customer A's name] · 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3").
- Customer A's name is in the same weight as the address after it.
Words in square brackets stand for the value they name, such as customer A's name exactly as it is saved; every other word must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R4: “The band never repeats the unit, year, make or model; the asset table below it prints them. A part sale prints the same band as a work order.”
- S8-R6: “The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice.”
- S8-R1: “A full-width band prints directly under the address row. Its first line reads "SERVICE FOR". Its second line reads the customer's name, then " · " and that customer's own address, in the same weight as the address.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Part sale (P2-254, 4 Star billed to 7 Star)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-02-after-modern-invoice-2026-11-14.png
- bt-p4-04-after-legacy-invoice-2026-11-14.png
- bt-p4-10-after-modern-part-sale-2026-11-14.png
- bt-p4-06-after-modern-estimate-2026-11-14.png
The design's own words:
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
- “Bill To is 7 Star. Band: "SERVICE FOR", then "4 Star Truck Repair · 6263 Elizabeth Causeway Apt. 973, Raystad, British Columbia V4M 8Y2".”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-12 · A batch invoice gives each invoice billed to someone else its own band

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file: street, city, province or state and postal or ZIP code, and no Address 2 (for example 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3).
- Have a new customer for this test, customer B, the payer.
- Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B.
- Have a new work order for this test, work order 2, for customer B, invoiced, that bills itself, so the batch holds an invoice with no band.

**Steps**
1. Open customer B's Invoices tab.
2. Tick work order 1's invoice.
3. Tick work order 2's invoice.
4. Print the ticked invoices as a batch invoice.

**Expected Result**
Step 1:
- Both invoices are listed.
Step 2:
- Work order 1's invoice is ticked.
Step 3:
- Work order 2's invoice is ticked.
Step 4:
- Work order 1's pages carry the band: "SERVICE FOR", then customer A's name, " · " and customer A's address.
- Work order 2's pages carry no band.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R6: “The band prints on the modern and legacy layouts, invoice and estimate, part sale invoice and batch invoice.”
- S8-N1: “When the customer pays for itself, no band prints and the document is unchanged.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Modern, pays for itself" (page 4 "Service For band on invoices and estimates", This build, row "Pays for itself, unchanged (S2-17322), and batch"), "Legacy, pays for itself" (page 4 "Service For band on invoices and estimates", This build, row "Pays for itself, unchanged (S2-17322), and batch"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-14-after-modern-pays-for-itself-2026-11-14.png
- bt-p4-16-after-legacy-pays-for-itself-2026-11-14.png
- bt-p4-02-after-modern-invoice-2026-11-14.png
- bt-p4-04-after-legacy-invoice-2026-11-14.png
The design's own words:
- “No band. Identical to production (same render, same bytes).”
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-13 · The Service For band leaves the address row as it was

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file: street, city, province or state and postal or ZIP code, and no Address 2 (for example 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3).
- Have a new customer for this test, customer B, the payer.
- Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B.
- Have a new work order for this test, work order 2, for customer B, invoiced, that bills itself, so there is an invoice to compare the address row with.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the invoice's PDF.
4. Open work order 2's invoice PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- The band sits below the address row, not inside it.
- The address row holds the same blocks as on work order 2's invoice, in the same places.
Step 4:
- Work order 2's address row holds the Bill To block naming customer B and the shop's own block, and no band.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R7: “The band leaves the address row free for a future Ship To block.”
- Out of Scope: “Ship To. Ships after Bill To as its own release. The Service For band leaves room for a Ship To block beside the Bill To.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-02-after-modern-invoice-2026-11-14.png
The design's own words:
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-14 · No band prints when the customer pays for itself

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, that bills itself, with an address on file: street, city, province or state and postal or ZIP code, and no Address 2 (for example 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3).
- Have a new work order for this test, work order 1, for customer A, invoiced, that bills itself.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the invoice's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- The Bill To block names customer A.
- No "SERVICE FOR" band prints, and customer A's address shows only in the Bill To block.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-N1: “When the customer pays for itself, no band prints and the document is unchanged.”
- Key Decisions: “"Service For" band on documents, only when the Bill To differs.”
- Feature Overview, Core Bill To: “The Bill To shows only where it differs from the customer. A customer that pays for itself sees nothing new on its documents.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Modern, pays for itself" (page 4 "Service For band on invoices and estimates", This build, row "Pays for itself, unchanged (S2-17322), and batch"), "Legacy, pays for itself" (page 4 "Service For band on invoices and estimates", This build, row "Pays for itself, unchanged (S2-17322), and batch"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-14-after-modern-pays-for-itself-2026-11-14.png
- bt-p4-16-after-legacy-pays-for-itself-2026-11-14.png
The design's own words:
- “No band. Identical to production (same render, same bytes).”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-15 · Invoices created before the release never print the band

Folder: Run on Production After Release · refs SV-12310 · held: yes

**Preconditions**
- Sign in as an Admin at the test location.
- Use the production test account.
- Have a new customer for this test, customer A, created on production before the release.
- Have a new work order for this test, work order 1, for customer A, invoiced on production before the release, that bills itself.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the invoice's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- No "SERVICE FOR" band prints.
- The invoice reads as it did before the release.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-N2: “Invoices created before this release never print the band.”
The build is not yet available to check this case against.
AUTOMATION: HOLD - needs records made on production before the release reaches production; run on production after the release

### S8-16 · The band's address includes Address 2 after the street

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file that has a street, an Address 2, a city, a province or state and a postal or ZIP code (for example 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4).
- Have a new customer for this test, customer B, the payer.
- Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the invoice's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- The Bill To block names customer B.
- Directly under the address row, a full-width band prints; its first line reads "SERVICE FOR".
- The second line reads customer A's name, " · ", then the street, Address 2, the city, then the province or state and the postal code, in that order, separated by commas (for example "[customer A's name] · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4").
- The province or state and the postal code are separated by a space, not a comma.
Words in square brackets stand for the value they name, such as customer A's name exactly as it is saved; every other word must match exactly.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R2: “The address reads street, then Address 2 when filled, city, then the province or state and the postal or ZIP code, the parts separated by commas, for example "965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3". The province or state and the postal code never split across two lines.”
- S8-R1: “A full-width band prints directly under the address row. Its first line reads "SERVICE FOR". Its second line reads the customer's name, then " · " and that customer's own address, in the same weight as the address.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Legacy" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-02-after-modern-invoice-2026-11-14.png
- bt-p4-04-after-legacy-invoice-2026-11-14.png
The design's own words:
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
- “The same two-line band, under Bill To and Remit payment to, above the asset table.”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-17 · With no address on file the band prints the name alone

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, with no address on file (no street, city, province or state, or postal code).
- Have a new customer for this test, customer B, the payer.
- Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the invoice's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- The Bill To block names customer B.
- Directly under the address row, a full-width band prints; its first line reads "SERVICE FOR".
- The second line reads customer A's name alone.
- No " · " follows the name.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R3: “Missing address parts drop out with their separator. With no address on file, the second line prints the name alone, with no " · ".”
The build is not yet available to check this case against.
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-18 · An invoice keeps the name and address it was created with

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file: street, city, province or state and postal or ZIP code, and no Address 2 (for example 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3).
- Have a new customer for this test, customer B, the payer, so the invoice prints the band.
- Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the invoice's PDF.
4. Open customer A's Edit Customer window.
5. Change customer A's name to a new name.
6. Change customer A's street to a new street.
7. Click Save.
8. Open work order 1.
9. Open the Finance tab.
10. Open the invoice's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- The band's second line reads customer A's name, " · " and customer A's address.
Step 4:
- Customer A's Edit Customer window opens.
Step 5:
- The name field shows the new name.
Step 6:
- The street field shows the new street.
Step 7:
- The window closes and customer A's page shows the new name and street.
Step 8:
- Work order 1 opens.
Step 9:
- The Finance tab shows the invoice.
Step 10:
- The band's second line still reads customer A's old name and old address, exactly as in step 3: the invoice was not changed.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R8: “An invoice prints the name and address it was created with. A later change to that customer's name or address, or to the work order's customer, never changes an existing invoice (S7-E1). An estimate prints them as they are now.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-02-after-modern-invoice-2026-11-14.png
- bt-p4-06-after-modern-estimate-2026-11-14.png
The design's own words:
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
- “Bill To: "Buda Truck Repair" with its address. Band: "SERVICE FOR", then "A & J Truck & Trailer Repair · 17483 Shane Drive, Patriciashire, Ontario B4Y6L9".”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-19 · Changing the work order's customer leaves the invoice's band as it was

Folder: Service For band on invoices and estimates · refs SV-12308,SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file: street, city, province or state and postal or ZIP code, and no Address 2 (for example 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3).
- Have a new customer for this test, customer B, the payer.
- Have a new customer for this test, customer C, the new customer, that bills itself, with an address different from customer A's.
- Have a new work order for this test, work order 1, for customer A, invoiced, billed to customer B.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the invoice's PDF.
4. Expand the Customer card.
5. Click Change Customer (the two arrows at the top right of the Customer card).
6. Pick customer C.
7. Confirm the change.
8. Open the Finance tab.
9. Open the invoice's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the invoice.
Step 3:
- The band's second line reads customer A's name, " · " and customer A's address.
Step 4:
- The Customer card shows customer A.
Step 5:
- The customer picker opens.
Step 6:
- Customer C is picked.
Step 7:
- Work order 1 now shows customer C as its customer.
Step 8:
- The Finance tab shows the invoice.
Step 9:
- The band's second line still reads customer A's name and customer A's address, exactly as in step 3.
- Customer C's name and address are not on the invoice.
- The Bill To block names customer B.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12308 (Story 6, Change Customer with a Bill To), story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R8: “An invoice prints the name and address it was created with. A later change to that customer's name or address, or to the work order's customer, never changes an existing invoice (S7-E1). An estimate prints them as they are now.”
- S6-N1: “On an Invoiced document, the invoice keeps its Bill To. A self-billed document stays self-billed, so invoicing again after Reverse bills the new customer, as today.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-02-after-modern-invoice-2026-11-14.png
- bt-p4-06-after-modern-estimate-2026-11-14.png
The design's own words:
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
- “Bill To: "Buda Truck Repair" with its address. Band: "SERVICE FOR", then "A & J Truck & Trailer Repair · 17483 Shane Drive, Patriciashire, Ontario B4Y6L9".”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

### S8-20 · An estimate shows the customer's current address

Folder: Service For band on invoices and estimates · refs SV-12310 · held: no

**Preconditions**
- Sign in as an Admin at the test location.
- Make sure the organization's document design setting is the modern layout.
- Have a new customer for this test, customer A, the customer the work is for, with an address on file: street, city, province or state and postal or ZIP code, and no Address 2 (for example 965 Smith Course, Port Peterchester, Yukon Territory Y5P 3K3).
- Have a new customer for this test, customer B, the payer, so the estimate prints the band.
- Have a new work order for this test, work order 1, for customer A, in Approved, billed to customer B.

**Steps**
1. Open work order 1.
2. Open the Finance tab.
3. Open the estimate's PDF.
4. Open customer A's Edit Customer window.
5. Change customer A's street to a new street.
6. Click Save.
7. Open work order 1.
8. Open the Finance tab.
9. Open the estimate's PDF.

**Expected Result**
Step 1:
- Work order 1 opens for customer A.
Step 2:
- The Finance tab shows the estimate.
Step 3:
- The band's second line reads customer A's name, " · " and customer A's address.
Step 4:
- Customer A's Edit Customer window opens.
Step 5:
- The street field shows the new street.
Step 6:
- The window closes.
Step 7:
- Work order 1 opens.
Step 8:
- The Finance tab shows the estimate.
Step 9:
- The band's second line now reads customer A's address with the new street.
Exact quotes from the source (for reproducibility)
From: PRD "Bill To", Confluence 1003585538, version 0.5 (edited 14 Nov 2026), pending approval, Chris Ward; Story 8 redone on 14 Nov 2026, status line still v0.5, Change Log empty, read 14 Nov 2026 · Epic SV-12289, story SV-12310 (Story 8, "Service For" band on invoices and estimates)
- S8-R8: “An invoice prints the name and address it was created with. A later change to that customer's name or address, or to the work order's customer, never changes an existing invoice (S7-E1). An estimate prints them as they are now.”
The build is not yet available to check this case against.
References from Design
Design canvas "Bill To design" (https://claude.ai/artifact/2prSHgwt2tWCz96QD2DWkd), version 1794608112-d8a1 (page 4 redrawn; the other 7 boards byte-identical to version 1794239066-4906), read 14 Nov 2026: pictures "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Invoice billed to someone else (INV-S2-17581, Buda billed to Valders)"), "Modern" (page 4 "Service For band on invoices and estimates", This build, row "Estimate billed to someone else (EST-S2-17582, A & J billed to Buda)"). Compare the screen with the pictures; the expected results come from the PRD.
Design pictures attached to this case:
- bt-p4-02-after-modern-invoice-2026-11-14.png
- bt-p4-06-after-modern-estimate-2026-11-14.png
The design's own words:
- “A full-width band under the address row. Line 1: "SERVICE FOR". Line 2: "Buda Truck Repair · 8237 Brittney Divide Apt. 463, Apt. 891, Walshhaven, British Columbia P5H 7C4", Buda's own address.”
- “Bill To: "Buda Truck Repair" with its address. Band: "SERVICE FOR", then "A & J Truck & Trailer Repair · 17483 Shane Drive, Patriciashire, Ontario B4Y6L9".”
AUTOMATION: Not available on Build to test Yet - Last checked 11/14/2026

