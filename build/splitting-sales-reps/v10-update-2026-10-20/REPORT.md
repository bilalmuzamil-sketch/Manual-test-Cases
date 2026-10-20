# Splitting Sales Representatives — suite brought up to PRD v10 (20 Oct 2026)

Worker report for `v10-update-2026-10-20/WORKER-BRIEF.md`. **Authoring files edited and the build run only.** Nothing was written to
TestRail, Jira, Slack or Google; nothing was committed or pushed; nothing was run with `--apply`.

## 1 · What was done

- `authoring/ssr_lib.py` now reads **PRD v10** from `prd-v10-2026-10-20/CONFLUENCE-919928833-v10-2026-10-20.md`. A small converter
  (`md_to_text`) turns the markdown back into the plain lines the v8 text had (strips `**` and `\\`, the `>` of a context note,
  link targets, table pipes), so every PRD quote, coded or not, now comes from v10 and is checked verbatim against it. 142 codes found
  (138 + S1-R6a, S1-E3, S2-E6, S7-R6).
- `PRD_NAME` = PRD "Splitting Sales Representatives", Confluence 919928833, **version 10 (19 Oct 2026, Chris Ward)**, read 20 Oct 2026.
- New document in `DOCS`: **"Chris Ward's answers to the Splitting Sales Representatives question sheet (19 Oct 2026)"**, read 20 Oct
  2026, with its own "From:" line above its own quotes. `AQ(n)` quotes answer n; `check()` verifies every answer quote verbatim
  against `design-recheck-2026-10-20/chris-answers.json`. Tech plan and report specs keep their own "From:" lines, read 19 Oct 2026.
- All 120 cases re-read whole against v10 and the 38 answers (Rule 41). Result: **37 changed in what the tester reads or in their notes
  and quotes (section 2)**, 80 changed only because their quotes and "From:" line are now version 10 (section 3), 3 unchanged.
- **6 new cases** for the v10 sentences that had none (section 4). The suite now has 126 cases.
- `authoring/apply3.py`: the dry run printed a C-id for every key and stopped on the 6 new keys, which have none. It now lists them
  as "new, no C-id yet" and skips them. It still only updates existing cases, and it was not run with `--apply`.
- Layout kept on every case (two audiences, "Step N:" results, "From:" lines, "References from Design", AUTOMATION last). Titles
  kept, except S5-05 and S4-19, whose checks changed.

## 2 · Changed cases: what changed and why

| Case | Key | Title (now) | What changed | Why (v10 code / answer) |
|---|---|---|---|---|
| [C665932](https://shopview.testrail.io/index.php?/cases/view/665932) | S2-08 | An invoiced split work order shows both names as plain text | Added a first step: read the four labels without hovering. Lead Technician and Service Advisor keep the labels an invoiced card shows today ("Lead technician", "Service advisor"); only the representative fields use the new labels. Steps renumbered 1-3. | S2-R17 (v10 adds the last sentence); answer 8 |
| [C665935](https://shopview.testrail.io/index.php?/cases/view/665935) | S2-11 | A part sale's card keeps one Sales Representative field and no + | Steps 1 and 2 now expect the label "Sales representative" with a small "r", unchanged after picking a rep. | S2-N2 (v10); answer 7 |
| [C665937](https://shopview.testrail.io/index.php?/cases/view/665937) | S3-01 | On a phone the representatives show after the card is expanded | Results unchanged; answer 9 (the card's existing edit button) quoted. Q-B (design shows "Hide Details") is still unsent. | S3-R6; answer 9 |
| [C665938](https://shopview.testrail.io/index.php?/cases/view/665938) | S3-02 | On a phone the field, its arrow and the + work without hover | Results unchanged; answer 11 (arrow always shows on touch) quoted. | S3-R4; answer 11 |
| [C665940](https://shopview.testrail.io/index.php?/cases/view/665940) | S4-01 | Edit Customer has an optional Sales Representative field | Results unchanged; answer 15 (A to Z by first name, then last name) quoted. The v10 S4-R3 part-sale sentence is tested by new S4-25. | S4-R3 (v10); answer 15 |
| [C665948](https://shopview.testrail.io/index.php?/cases/view/665948) | S4-09 | A new work order starts with the customer's one representative | Note rewritten: the SBR-spec difference is now ruled by answer 38 (PRD wins), not "on the question list". | answer 38 |
| [C665954](https://shopview.testrail.io/index.php?/cases/view/665954) | S4-15 | A rep with the switch off is not copied but still credited at invoicing | Step 1 now expects the customer page to read "{Sales-rep-B} (Inactive)" (was the plain name). | S4-N2 (v10); answer 14 |
| [C665957](https://shopview.testrail.io/index.php?/cases/view/665957) | S4-18 | Deactivating a rep clears their customer fields and removes Part Sales | Step 1 now expects the Deactivate window line "They will be removed as sales representative from 2 customers." and the old line "Their customer assignments will stay where they are." gone. Note now cites the ruling. | S4-R21 (v10); answers 12, 13 |
| [C665958](https://shopview.testrail.io/index.php?/cases/view/665958) | S4-19 | The Deactivate window counts a customer once when a rep holds two fields | Title changed to "The Deactivate window counts a customer once when a rep holds two fields". Step 1 expects "... from 1 customer." (singular). Added steps 3-4: turning the switch off shows the "Turn Off Sales Representative" warning as today, with no count. | S4-R21 (v10); answer 13 |
| [C665959](https://shopview.testrail.io/index.php?/cases/view/665959) | S4-20 | Renaming a rep updates customer fields and a switched-off rep stays | Step 4 now expects "{Sales-rep-A} (Inactive)" on the customer page (was the plain name). Added step 5: Edit Customer shows "(Inactive)", the person is not offered and no option is checked. | S4-N2 (v10); answer 14 |
| [C665960](https://shopview.testrail.io/index.php?/cases/view/665960) | S4-21 | The assignments export lists one row per customer per person with Side | Step 1 now expects the file sales-representative-assignments.csv. Note now cites the ruling. | S4-R23 (v10); answers 17, 18 |
| [C665962](https://shopview.testrail.io/index.php?/cases/view/665962) | S5-01 | A split invoice gives the Labor rep a Labor row and the Parts rep a Parts row | Step 2: Sales Type sits right after Status and before Location (when shown). Note now cites the rulings (dash on the Parts row; order Status, Sales Type, Location). | S5-R19 (v10); answers 24, 26 |
| [C665964](https://shopview.testrail.io/index.php?/cases/view/665964) | S5-03 | A whole-invoice discount is shared by the size of each side | Steps 3-4 name the Adjustments column for each row's share. Note's "judge the amounts wherever they show" removed; ruling quoted. | S5-R6 (v10); answer 22 |
| [C665965](https://shopview.testrail.io/index.php?/cases/view/665965) | S5-04 | A negative side still shares a discount by size | Step 3 names the Adjustments column for each share. | S5-R6 (v10); answer 22 |
| [C665966](https://shopview.testrail.io/index.php?/cases/view/665966) | S5-05 | The Parts share is rounded to the cent and the Labor row gets the rest | Rewritten for the new rounding rule. Title changed to "The Parts share is rounded to the cent and the Labor row gets the rest". Two work orders: 100/200 with a $1.00 discount gives Parts ($0.67), Labor ($0.33) (the PRD's own example); 100/100 with $0.01 gives the half-cent tie to Labor: Labor ($0.01), Parts $0.00. The "question for the product owner" note is replaced by the ruling. | S5-R7 (v10 replaced the rule); answer 21 |
| [C665967](https://shopview.testrail.io/index.php?/cases/view/665967) | S5-06 | A whole-invoice fee with no labor or parts dollars goes to one side | Step 3 explains "empty" as "the labor side has no representative". | S5-R8 (v10); answer 23 |
| [C665968](https://shopview.testrail.io/index.php?/cases/view/665968) | S5-07 | A part sale is one Part Sales row holding the whole sale | Added a third part sale with a $0.00 shop supplies charge, which shows $0.00; the one with no charge still shows a dash. | S5-R15a (v10); answer 25 |
| [C665969](https://shopview.testrail.io/index.php?/cases/view/665969) | S5-08 | One person on both sides shows one Labor, Parts row | Added {Work-order-2} (one person on both sides, a part and no labor); new step 4 expects one "Labor, Parts" row with Labor Delta 0.0, not a dash. Steps now 1-6. | S5-R15 (v10 last sentence); answer 24 |
| [C665972](https://shopview.testrail.io/index.php?/cases/view/665972) | S5-11 | The Sales Type column is off by default, first in the list and remembered | Step 3: Sales Type right after Status, before Location when shown. | S5-R19 (v10); answer 26 |
| [C665973](https://shopview.testrail.io/index.php?/cases/view/665973) | S5-12 | Expanded CSV and PDF always carry the Sales Type column | Steps 2-3: in the CSV and PDF Sales Type sits right after Status and before any Location column. | S5-R23 (v10); answers 24, 26 |
| [C665980](https://shopview.testrail.io/index.php?/cases/view/665980) | S6-05 | A side whose staff member no longer exists prints as Unassigned | Marker now says only a data repair causes this and developers check it; a plain note says a manual tester cannot set it up; the v10 context note is quoted. | S6-N1, v10 Story 6 context note; answer 30 |
| [C665981](https://shopview.testrail.io/index.php?/cases/view/665981) | S7-01 | Each representative change writes one log entry with before and after | The step-4 "question for the product owner" note is removed. Step 4's result (adding Parts with the same person writes one entry) is now backed by the v10 sentence. | S7-R1 (v10); answer 31 |
| [C665985](https://shopview.testrail.io/index.php?/cases/view/665985) | S8-02 | Sales By Representative exports name the Sales Type selection | Note now cites the ruling (Empty export, no file). The v10 "other empty exports still download" sentence is tested by new S8-12. | S8-R4 (v10); answer 27 |
| [C665986](https://shopview.testrail.io/index.php?/cases/view/665986) | S8-03 | Sales By Customer's Product Type filter now reads Sales Type | Results unchanged; answer 28 (options renamed) quoted. | answer 28 |
| [C665987](https://shopview.testrail.io/index.php?/cases/view/665987) | S8-04 | Sales By Customer exports name the Sales Type selection | Note now cites the ruling. | S8-R9 (v10); answer 27 |
| [C665992](https://shopview.testrail.io/index.php?/cases/view/665992) | S5-16 | Line fees stay with their side and a processing fee is shared by size | Steps 3-4 name the Adjustments column for each row's share of the fee. | S5-R6 (v10); answer 22 |
| [C666003](https://shopview.testrail.io/index.php?/cases/view/666003) | REL-01 | On release day an existing customer keeps its one representative | Note removed (the ~10 customers are now in the PRD). Added {Customer-C} (its representative was no longer a user of the shop) and step 4: it reads "Unassigned". | S4-E1 (v10); answer 19 |
| [C666008](https://shopview.testrail.io/index.php?/cases/view/666008) | REL-06 | A Sales By Customer filter from before the release keeps its options | The "is a bookmarked link meant?" note is removed; answer 29 quoted. | S8-E1 (v10); answer 29 |
| [C666017](https://shopview.testrail.io/index.php?/cases/view/666017) | D-01 | Work order card at rest matches the design | Step 2: removed "the design's before board measures 36 px" (v10 dropped that context note, answer 3); it now reads "with no message showing under Lead Technician, every gap is 16 px" and quotes S1-R6a. | S1-R6 context note removed; S1-R6a (v10, no-message part); answer 3 |
| [C666018](https://shopview.testrail.io/index.php?/cases/view/666018) | D-02 | Hovering the Sales Representative row shows the box, arrow and + | Design note now cites the ruling (16 px, answer 2); answer 1 (box height same as Lead Technician, 42 px) quoted. | answers 1, 2 |
| [C666024](https://shopview.testrail.io/index.php?/cases/view/666024) | D-08 | The invoiced work order card shows the reps as plain text | Step 1 adds: Lead Technician and Service Advisor keep the labels an invoiced card shows today. | S2-R17 (v10); answer 8 |
| [C666026](https://shopview.testrail.io/index.php?/cases/view/666026) | D-10 | Edit Customer: one field, its list and the + look as designed | Design note now cites the ruling (A to Z). | S4-R3; answer 15 |
| [C666030](https://shopview.testrail.io/index.php?/cases/view/666030) | D-14 | A part sale's representative field is unchanged from Part Sales Update v1 | Steps 1 and 4 now expect the label "Sales representative" (small "r"), the opposite of the design boards. Note says the design's capital R is not what to expect. | S2-N2 (v10); answer 7 |
| [C666031](https://shopview.testrail.io/index.php?/cases/view/666031) | D-15 | Sales By Representative screen, filter and column look as designed | Step 2 adds: a part sale with no shop supplies shows a dash. Step 5: column right after Status, before Location when shown. Note now cites the rulings (design's $0.00 is sample data; the tooltip overlap is accepted as today). | S5-R15, S5-R15a, S5-R19 (v10); answers 24, 25, 26, 36 |
| [C666032](https://shopview.testrail.io/index.php?/cases/view/666032) | D-16 | Sales By Representative Expanded CSV and PDF look as designed | Steps 1-2: Sales Type right after Status, before any Location column. Note now cites the ruling. | S5-R23, S8-R4 (v10); answers 24, 26 |
| [C666033](https://shopview.testrail.io/index.php?/cases/view/666033) | D-17 | Sales By Customer Sales Type filter looks as designed | Results unchanged; answer 28 quoted. | answer 28 |
| [C666034](https://shopview.testrail.io/index.php?/cases/view/666034) | D-18 | On a phone the representative fields look as designed | Design note now cites the ruling (arrow always shows). | S3-R4; answer 11 |

## 3 · Cases whose only change is the version-10 quote and "From:" line (80)

Their steps and plain results already matched v10. The quote text changed where v10 reworded the rule (S4-E1, S4-R3 and the
Story 4 prerequisites, S5-R15, S5-R23, S7-R1, S7-R4 in C665947, C665963, C665982, C665983, C665990, C665991, C666025). The rest only
changed their "From:" line (version 10, read 20 Oct 2026):

S1-01 [C665915](https://shopview.testrail.io/index.php?/cases/view/665915), S1-02 [C665916](https://shopview.testrail.io/index.php?/cases/view/665916), S1-03 [C665917](https://shopview.testrail.io/index.php?/cases/view/665917), S1-04 [C665918](https://shopview.testrail.io/index.php?/cases/view/665918), S1-05 [C665919](https://shopview.testrail.io/index.php?/cases/view/665919), S1-06 [C665920](https://shopview.testrail.io/index.php?/cases/view/665920), S1-07 [C665921](https://shopview.testrail.io/index.php?/cases/view/665921), S1-08 [C665922](https://shopview.testrail.io/index.php?/cases/view/665922), S1-09 [C665923](https://shopview.testrail.io/index.php?/cases/view/665923), S1-10 [C665924](https://shopview.testrail.io/index.php?/cases/view/665924), S2-01 [C665925](https://shopview.testrail.io/index.php?/cases/view/665925), S2-02 [C665926](https://shopview.testrail.io/index.php?/cases/view/665926), S2-03 [C665927](https://shopview.testrail.io/index.php?/cases/view/665927), S2-04 [C665928](https://shopview.testrail.io/index.php?/cases/view/665928), S2-05 [C665929](https://shopview.testrail.io/index.php?/cases/view/665929), S2-06 [C665930](https://shopview.testrail.io/index.php?/cases/view/665930), S2-07 [C665931](https://shopview.testrail.io/index.php?/cases/view/665931), S2-09 [C665933](https://shopview.testrail.io/index.php?/cases/view/665933), S2-10 [C665934](https://shopview.testrail.io/index.php?/cases/view/665934), S2-12 [C665936](https://shopview.testrail.io/index.php?/cases/view/665936), S3-03 [C665939](https://shopview.testrail.io/index.php?/cases/view/665939), S4-02 [C665941](https://shopview.testrail.io/index.php?/cases/view/665941), S4-03 [C665942](https://shopview.testrail.io/index.php?/cases/view/665942), S4-04 [C665943](https://shopview.testrail.io/index.php?/cases/view/665943), S4-05 [C665944](https://shopview.testrail.io/index.php?/cases/view/665944), S4-06 [C665945](https://shopview.testrail.io/index.php?/cases/view/665945), S4-07 [C665946](https://shopview.testrail.io/index.php?/cases/view/665946), S4-08 [C665947](https://shopview.testrail.io/index.php?/cases/view/665947), S4-10 [C665949](https://shopview.testrail.io/index.php?/cases/view/665949), S4-11 [C665950](https://shopview.testrail.io/index.php?/cases/view/665950), S4-12 [C665951](https://shopview.testrail.io/index.php?/cases/view/665951), S4-13 [C665952](https://shopview.testrail.io/index.php?/cases/view/665952), S4-14 [C665953](https://shopview.testrail.io/index.php?/cases/view/665953), S4-16 [C665955](https://shopview.testrail.io/index.php?/cases/view/665955), S4-17 [C665956](https://shopview.testrail.io/index.php?/cases/view/665956), S4-22 [C665961](https://shopview.testrail.io/index.php?/cases/view/665961), S5-02 [C665963](https://shopview.testrail.io/index.php?/cases/view/665963), S5-09 [C665970](https://shopview.testrail.io/index.php?/cases/view/665970), S5-10 [C665971](https://shopview.testrail.io/index.php?/cases/view/665971), S5-13 [C665974](https://shopview.testrail.io/index.php?/cases/view/665974), S5-14 [C665975](https://shopview.testrail.io/index.php?/cases/view/665975), S6-01 [C665976](https://shopview.testrail.io/index.php?/cases/view/665976), S6-02 [C665977](https://shopview.testrail.io/index.php?/cases/view/665977), S6-03 [C665978](https://shopview.testrail.io/index.php?/cases/view/665978), S6-04 [C665979](https://shopview.testrail.io/index.php?/cases/view/665979), S7-02 [C665982](https://shopview.testrail.io/index.php?/cases/view/665982), S7-03 [C665983](https://shopview.testrail.io/index.php?/cases/view/665983), S8-01 [C665984](https://shopview.testrail.io/index.php?/cases/view/665984), S8-05 [C665988](https://shopview.testrail.io/index.php?/cases/view/665988), S4-23 [C665989](https://shopview.testrail.io/index.php?/cases/view/665989), S4-24 [C665990](https://shopview.testrail.io/index.php?/cases/view/665990), S5-15 [C665991](https://shopview.testrail.io/index.php?/cases/view/665991), S5-17 [C665993](https://shopview.testrail.io/index.php?/cases/view/665993), S7-04 [C665994](https://shopview.testrail.io/index.php?/cases/view/665994), S2-13 [C665995](https://shopview.testrail.io/index.php?/cases/view/665995), S8-06 [C665996](https://shopview.testrail.io/index.php?/cases/view/665996), S8-08 [C665998](https://shopview.testrail.io/index.php?/cases/view/665998), S8-11 [C666001](https://shopview.testrail.io/index.php?/cases/view/666001), REL-15 [C666002](https://shopview.testrail.io/index.php?/cases/view/666002), REL-02 [C666004](https://shopview.testrail.io/index.php?/cases/view/666004), REL-03 [C666005](https://shopview.testrail.io/index.php?/cases/view/666005), REL-04 [C666006](https://shopview.testrail.io/index.php?/cases/view/666006), REL-05 [C666007](https://shopview.testrail.io/index.php?/cases/view/666007), REL-07 [C666009](https://shopview.testrail.io/index.php?/cases/view/666009), REL-08 [C666010](https://shopview.testrail.io/index.php?/cases/view/666010), REL-09 [C666011](https://shopview.testrail.io/index.php?/cases/view/666011), REL-10 [C666012](https://shopview.testrail.io/index.php?/cases/view/666012), REL-11 [C666013](https://shopview.testrail.io/index.php?/cases/view/666013), REL-12 [C666014](https://shopview.testrail.io/index.php?/cases/view/666014), REL-13 [C666015](https://shopview.testrail.io/index.php?/cases/view/666015), REL-14 [C666016](https://shopview.testrail.io/index.php?/cases/view/666016), D-03 [C666019](https://shopview.testrail.io/index.php?/cases/view/666019), D-04 [C666020](https://shopview.testrail.io/index.php?/cases/view/666020), D-05 [C666021](https://shopview.testrail.io/index.php?/cases/view/666021), D-06 [C666022](https://shopview.testrail.io/index.php?/cases/view/666022), D-07 [C666023](https://shopview.testrail.io/index.php?/cases/view/666023), D-09 [C666025](https://shopview.testrail.io/index.php?/cases/view/666025), D-11 [C666027](https://shopview.testrail.io/index.php?/cases/view/666027), D-12 [C666028](https://shopview.testrail.io/index.php?/cases/view/666028), D-13 [C666029](https://shopview.testrail.io/index.php?/cases/view/666029).

**Unchanged (3):** S8-07 [C665997](https://shopview.testrail.io/index.php?/cases/view/665997), S8-09 [C665999](https://shopview.testrail.io/index.php?/cases/view/665999), S8-10 [C666000](https://shopview.testrail.io/index.php?/cases/view/666000). They quote only the report specs; v10 does not affect them.

## 4 · The 6 new cases (keys free, not in TestRail, no C-id)

| Key | Title | Section | Source | Marker |
|---|---|---|---|---|
| S1-11 | A rep who no longer exists or is in another organization reads Unassigned | S1 ("Story 1" folder) | S1-E3; v10 Story 6 context note; answers 5, 30 | AUTOMATION: HOLD (only a data repair causes it; developers check) |
| S2-14 | Two windows: the later pick on the one field wins and Parts goes | S2 ("Story 2" folder) | S2-E6; answer 6 | HOLD - not yet build-verified (no build yet) |
| S4-25 | A part-sales-only user adding a customer from a part sale sees the reps | S4 ("Story 4" folder) | S4-R3 last sentence, Story 4 prerequisites (v10), S4-R1; answer 16 | HOLD - not yet build-verified |
| S4-26 | Reactivating a rep does not put them back on their customers | S4 ("Story 4" folder) | S4-R20 last sentence (v10); answer 12 | HOLD - not yet build-verified |
| S7-05 | A log entry reads Unassigned for a rep who no longer exists | S7 ("Story 7" folder) | S7-R6, S7-R2, S7-R3; v10 Story 6 context note; answers 5, 30 | AUTOMATION: HOLD (only a data repair causes it; developers check) |
| S8-12 | Exports with no rows still download a file with only the headings | S8 ("Story 8" folder) | S8-R4, S8-R9 last sentences (v10); answer 27 | HOLD - not yet build-verified |

- S1-11 and S7-05 cover a staff member who no longer exists or belongs to another organization: the card and the log entry read
  "Unassigned", never a bare "(Inactive)". Both carry `AUTOMATION: HOLD - only a data repair makes a staff record stop existing or
  belong to another organization; developers check this, manual QA cannot set it up`, and a plain note saying the same (v10 context note,
  answer 30).
- S2-14 uses two windows of one browser: one adds the Parts field, the other then picks a person; after reloading, both show the one
  field with the person picked last.
- S4-25: a user with "Part Sales — Create & Edit" only opens New Customer from a part sale and sees the full A-to-Z list.
- S4-26: deactivate, then reactivate; the customers keep "Unassigned" and the removed Part Sales field stays removed.
- S8-12: a date with no invoices; CSV and PDF on both reports download with the filter line, headings and no rows, with no "Empty export".
- Every new case passes the build's checks: titles ≤ 80 characters, no semicolons, one result per step, placeholders defined, quotes
  verbatim, a "From:" line per document. They need the QA lead's go-ahead before creation (Rule 6), and hold H1 must be checked first
  (Rule 62).

## 5 · Jira stories re-read (SV-11266 to SV-11272, read only, 20 Oct 2026)

Every requirement line (S2-* to S8-*) in all seven stories is **word for word PRD v10**, including the four new codes and every v10
rewording. Story 1 (SV-11265) was re-read on 20 Oct by another worker and still says "44px" (answer 1 and the PRD: same height as Lead
Technician, 42 px). The **acceptance criteria** still carry older v8 sentences next to the new v10 ones that Chris appended. The PRD wins
(answer 37):

| Story | Acceptance-criteria sentence that differs from v10 | v10 |
|---|---|---|
| SV-11269 | "Given a whole-invoice share that leaves a cent over after rounding, then that cent goes to the Labor row." | S5-R7: Parts rounded to the nearest cent, Labor gets the rest (an AC added later agrees with v10). **This one contradicts v10.** |
| SV-11269 | Sales Type column "after Status"; Part Sales Shop Supplies "a dash when it has none"; S5-R8 without "A side is empty …" | S5-R19/R23 "and before Location"; S5-R15a; S5-R8 (each restated in the newer ACs) |
| SV-11268 | "the warning counts every customer …"; switch off: "they stay in the customer fields they hold"; release day with no ~10-customer exception | S4-R21 Deactivate window wording; S4-N2 "(Inactive)"; S4-E1 (each restated in the newer ACs) |
| SV-11272 | "a Sales By Customer filter choice remembered from before the release" | S8-E1 saved or bookmarked link (restated in a newer AC) |
| SV-11266 | "Given a part sale, then its card has no + button and keeps one Sales Representative field." | S2-N2 label "Sales representative" (restated in a newer AC) |
| SV-11271 | "Given a change that leaves the representatives as they were, then no entry is written." | S7-R4 adds the example; no conflict |
| SV-11267, SV-11270 | none | — |

No case follows a Jira sentence. All follow v10.

## 6 · Build output

`python3 authoring/build.py` (exit 0, **no PROBLEM line**):
```
cases 126 {'S1': 11, 'S2': 14, 'S3': 3, 'S4': 26, 'S5': 8, 'DATA': 9, 'S6': 5, 'S7': 5, 'S8': 12, 'REL': 15, 'DESIGN': 18}
PRD codes 142 covered 142 not yet covered: []
design gate: boards 68 attached 68 | design cases 18
```
`python3 authoring/apply3.py` (dry run, no `--apply`; it reads only local files and makes no TestRail call):
```
new, no C-id yet (not created by this script): ['S1-11', 'S2-14', 'S4-25', 'S4-26', 'S7-05', 'S8-12']
to update: 117 cases (every existing case except C665997, C665999, C666000, which quote only the report specs and are byte-identical)
```
The full list of the 114 C-ids is in the dry-run output; it is the 120 existing cases minus C665997, C665999 and C666000.

## 7 · Reading coverage (Rule 119)

| Source | Size | Read |
|---|---|---|
| `v10-update-2026-10-20/WORKER-BRIEF.md` | 4,642 B | 100% |
| PRD v10 `CONFLUENCE-919928833-v10-2026-10-20.md` | 49,542 B, lines 1–420 | 100% (1–140, 140–290, 290–420) |
| `REQUIREMENT-DIFF-v8-to-v10.md` | 12,335 B, 95 lines | 100% |
| `TEXT-DIFF-v8-to-v10.diff` | 20,221 B, 140 lines | 100% |
| `CASES-AND-V10-CHANGES.json` | 15,095 B, 674 lines | 100% |
| `chris-answers.json` (38 answers: question, what we knew, answer, where) | 41,505 B | 100% |
| `design-recheck-2026-10-20/GAPS.md` | 38,080 B | lines 1–101 (§1–§5, which include §4 and §4b) 100%; §6–§7 not needed by the brief |
| Jira SV-11266 to SV-11272 (full descriptions) | 7 stories | 100% |
| `authoring/ssr_lib.py`, `build.py`, `common.py`, `apply3.py`, all 7 `cases_*.py` | ~120 KB | 100% |
| `build/rules/RULES-61-96.md` rules 113, 114, 115, 116, 117 + amendments 1–12 (lines 2391–2926); `RULES-41-60.md` rule 41 (lines 12–60); `skills/IDEAL-TEST-CASE-STANDARD.md` | — | 100% |
| `new-design-cases.json` (DR-01, DR-02 rendered), `tools/draft_new_cases.py` lines 1–80 | — | read for the format only |

## 8 · OUTSTANDING — what I need from you

1. **Go-ahead to write to TestRail (Rule 6):** `update_case` on the 114 changed cases (the edit lock in `apply3.py` checks each case is
   unchanged since our last read-back), and `add_case` for the 6 new ones. Hold H1 (Rule 62, no new TestRail cases) must be checked as
   lifted first. The new cases also need a creation script; `apply3.py` updates only.
2. **S1-R6a** (a Lead Technician message pushes the fields down) is quoted only in D-01, for its no-message part. The message itself
   is in held design case DR-08 ([C690665](https://shopview.testrail.io/index.php?/cases/view/690665)), which waits on question **Q-C**. **Q-A, Q-B, Q-C are still unsent.**
3. **Answer 10** (wide touch tablet: touch decides the buttons, screen width decides whether the card collapses) has no PRD v10
   sentence and no case. Should we add a case quoting the answer alone?
4. **SV-11269's acceptance criterion** "that cent goes to the Labor row" contradicts v10 S5-R7. Chris may want to remove it (Jira is
   read-only for us).
5. The setup file (`SPLITTING-SALES-REPS-SETUP-FILE.md`, not linked) has no recipes for the 6 new cases, and its recipes for S5-05,
   S5-07, S5-08, S4-19, S4-20 and REL-01 now need extra records. Update it when you want the setup file current.
