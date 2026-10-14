# DVI V2 — edits by other people since our 30 Sep reformat (read 14 Oct 2026)


## C88549 — Building a template: the Per axle field, default rows, units, placemen
https://shopview.testrail.io/index.php?/cases/view/88549

### 2026-10-05 20:15 UTC · user 4 · custom_steps
```
-4. Confirm each row states whether it is measured per tire or per brake (tire pressure and tread depth per tire; brake lining and push-rod travel per brake), and that the author does not choose how many values a side needs.
+4. Confirm each row has a scope, '1 per side' or 'Outer + inner' (tire pressure and tread depth default to Outer + inner; brake lining and push-rod travel to 1 per side), set by the author in the builder, and that the technician can change it while filling; brake lining and push-rod travel always record two values, one per side, when the form is filled.
```
### 2026-10-05 20:15 UTC · user 4 · custom_expected
```
-- Each row states whether it is measured on the tire or the brake (tire pressure and tread depth default to per tire, brake lining and push-rod travel to per brake).
-- The author does not choose how many values a side needs: a per-tire row follows the axle's Single or Dual setting at fill time, and a per-brake row is always one value per side.Source — where this behaviour comes from
+- Each row has a scope, '1 per side' or 'Outer + inner' (tire pressure and tread depth default to Outer + inner, brake lining and push-rod travel to 1 per side).
+- The author sets each row's scope in the builder, and the technician can change it while filling. An 'Outer + inner' row records four values on a Dual axle and two on a Single axle; a '1 per side' row always records two.
+- Brake lining and push-rod travel always record two values, one per side, when the form is filled.Source — where this behaviour comes from
-- S8-R4: “Each row will state whether it is measured on the tire or on the brake. Tire pressure and tread depth will default to per tire, brake lining and push-rod travel to per brake”
-- S8-R5: “The author will not choose how many values a side needs. A per-tire row follows the axle's Single or Dual setting at fill time; a per-brake row is always one value per side”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S8-R4: “Each row will have a scope, '1 per side' or 'Outer + inner'. Tire pressure and tread depth default to Outer + inner, brake lining and push-rod travel to 1 per side”
+- S8-R5: “The author sets each row's scope in the builder, and the technician can change it while filling. An 'Outer + inner' row records four values on a Dual axle and two on a Single axle; a '1 per side' row always records two”
+- S8-R11: “A per-tire row on a Dual axle will record four values, left outer, left inner, right inner and right outer. On a Single axle it will record two. A per-brake row will always record two”Amended on 5 October 2026
+S8-R4 and S8-R5 changed on 29 September 2026 (Digital Inspections V2 specification, Confluence page 768507905 (read on 5 October 2026)): a row's scope is now '1 per side' or 'Outer + inner', the author sets it in the builder, and the technician can change it while filling. Brake lining and push-rod travel always record two values when the form is filled (S8-R11, confirmed by the PM in SV-10877 on 5 October 2026). The S8-R4, S8-R5 and S8-R11 quotes above are the current wording, and step 4 and the expected results follow them. The Passed result in test run #494 (developer tests) was recorded against the earlier wording.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```
### 2026-10-12 12:33 UTC · user 4 · custom_steps
```
-2. Add one and confirm it is named 'New axle measurements' with four rows pre-filled: tire pressure, tread depth, brake lining, push-rod travel.
-3. Confirm each row carries an author-set unit as a default (PSI for tire pressure; inches for tread depth, brake lining, push-rod travel).
-4. Confirm each row has a scope, '1 per side' or 'Outer + inner' (tire pressure and tread depth default to Outer + inner; brake lining and push-rod travel to 1 per side), set by the author in the builder, and that the technician can change it while filling; brake lining and push-rod travel always record two values, one per side, when the form is filled.
+2. Add one and confirm it is named 'New axle measurements' with four rows pre-filled: tire pressure, tread depth, brake lining, push-rod travel; these four are the only row types, and each appears once.
+3. Confirm each row carries an author-set unit as a default (psi for tire pressure; inches for tread depth, brake lining, push-rod travel).
+4. Confirm each row has a type: tire pressure, tread depth, brake lining or push-rod travel. Only the two tire rows have a scope control in the builder, '1 per side' or 'Outer + inner' (default Outer + inner); brake lining and push-rod travel are always '1 per side' and show no scope control. Then fill an inspection from the template and confirm no row offers a scope control (each row keeps the scope set in the template). Switch an axle between Single and Dual and confirm the switch changes only the tire rows: a tire row on 'Outer + inner' shows four values on Dual and two on Single, while brake lining and push-rod travel always show two values, left and right.
```
### 2026-10-12 12:33 UTC · user 4 · custom_expected
```
-- A new per-axle field is named "New axle measurements" and pre-filled with four measurement rows: tire pressure, tread depth, brake lining and push-rod travel.
-- Each row carries a unit set by the author as the starting default (PSI for tire pressure; inches for tread depth, brake lining and push-rod travel).
-- Each row has a scope, '1 per side' or 'Outer + inner' (tire pressure and tread depth default to Outer + inner, brake lining and push-rod travel to 1 per side).
-- The author sets each row's scope in the builder, and the technician can change it while filling. An 'Outer + inner' row records four values on a Dual axle and two on a Single axle; a '1 per side' row always records two.
-- Brake lining and push-rod travel always record two values, one per side, when the form is filled.Source — where this behaviour comes from
+- A new per-axle field is named "New axle measurements" and pre-filled with four measurement rows: tire pressure, tread depth, brake lining and push-rod travel. These four are the only row types, and each appears once.
+- Each row carries a unit set by the author as the starting default (psi for tire pressure; inches for tread depth, brake lining and push-rod travel).
+- Each row has a type: tire pressure, tread depth, brake lining or push-rod travel. A row's scope, '1 per side' or 'Outer + inner', says whether it records one value per side or an outer and an inner value per side; it is not the axle's Single/Dual setting. The two tire rows have a scope control, defaulting to Outer + inner; the two brake rows are always '1 per side' and show no scope control.
+- The author sets the scope of the tire rows in the builder. It cannot be changed while filling: each row follows the template.
+- Whoever fills the inspection can switch each axle between Single and Dual. The switch changes the tire rows only: a tire row on 'Outer + inner' records four values on a Dual axle and two on a Single axle. It never changes the brake rows: brake lining and push-rod travel always record two values, left and right, as does a tire row on '1 per side'.Source — where this behaviour comes from
-- S8-R2: “A new per-axle field will be named "New axle measurements" and pre-filled with four measurement rows: tire pressure, tread depth, brake lining and push-rod travel”
-- S8-R3: “Each row will carry a unit set by the author, which is the default the technician starts from rather than a fixed value. Defaults will be PSI for tire pressure and inches for tread depth, brake lining and push-rod travel”
-- S8-R4: “Each row will have a scope, '1 per side' or 'Outer + inner'. Tire pressure and tread depth default to Outer + inner, brake lining and push-rod travel to 1 per side”
-- S8-R5: “The author sets each row's scope in the builder, and the technician can change it while filling. An 'Outer + inner' row records four values on a Dual axle and two on a Single axle; a '1 per side' row always records two”
-- S8-R11: “A per-tire row on a Dual axle will record four values, left outer, left inner, right inner and right outer. On a Single axle it will record two. A per-brake row will always record two”Amended on 5 October 2026
-S8-R4 and S8-R5 changed on 29 September 2026 (Digital Inspections V2 specification, Confluence page 768507905 (read on 5 October 2026)): a row's scope is now '1 per side' or 'Outer + inner', the author sets it in the builder, and the technician can change it while filling. Brake lining and push-rod travel always record two values when the form is filled (S8-R11, confirmed by the PM in SV-10877 on 5 October 2026). The S8-R4, S8-R5 and S8-R11 quotes above are the current wording, and step 4 and the expected results follow them. The Passed result in test run #494 (developer tests) was recorded against the earlier wording.
+- S8-R2: “A new per-axle field will be named "New axle measurements" and pre-filled with four measurement rows: tire pressure, tread depth, brake lining and push-rod travel. These four are the only row types, and each can appear once”
+- S8-R3: “Each row will carry a unit set by the author, which is the default the technician starts from rather than a fixed value. Defaults will be psi for tire pressure and inches for tread depth, brake lining and push-rod travel”
+- S8-R4: “Each row has a type: tire pressure, tread depth, brake lining or push-rod travel. The two tire rows have a scope, '1 per side' or 'Outer + inner', defaulting to Outer + inner. The two brake rows are always '1 per side'”
+- S8-R5: “The author sets the scope of the tire rows in the builder; the brake rows have no scope control. The technician does not change a row's scope while filling. An 'Outer + inner' row records four values on a Dual axle and two on a Single axle; a '1 per side' row always records two”
+- S8-R10: “Each axle will be set to Single or Dual, and to Drum or Disc. Drum or Disc may be left blank when the axle has no brakes”
+- Key Decision: “One vocabulary for the row scope: "1 per side" and "Outer + inner", on every surface”
+- S8-R11: “A tire row on 'Outer + inner' records four values on a Dual axle, left outer, left inner, right inner and right outer, and two on a Single axle. A tire row on '1 per side' and a brake row always record two, left and right”Amended on 12 October 2026
+S8-R2, S8-R4, S8-R5 and S8-R11 changed on 7 October 2026 (Digital Inspections V2 specification, Confluence page 768507905, version 42 of 7 October 2026, read on 12 October 2026), after the PM's decision on SV-10877 of 7 October 2026: a per-axle field has four fixed row types, each at most once; only the two tire rows have a scope, set by the author in the builder; the two brake rows are always '1 per side' with no scope control; and the technician does not change a row's scope while filling. Scope here is the row's '1 per side' or 'Outer + inner' setting (the Key Decision quoted above), not the axle's Single/Dual setting (S8-R10). Whoever fills the inspection still switches Single/Dual while filling (S8-R17); the switch changes how many values a tire row on 'Outer + inner' records and never changes the brake rows. S8-R3 writes the tire pressure unit as psi since 6 October 2026. The quotes above are the current wording, and steps 2 to 4 and the expected results follow them. This replaces the amendment of 5 October 2026. The Passed result in test run #494 (developer tests) was recorded against the earlier wording.
```

## C88550 — Building a template: editing axle rows, reference file and axle count
https://shopview.testrail.io/index.php?/cases/view/88550

### 2026-10-12 12:33 UTC · user 4 · custom_steps
```
-1. Rename a row in place (confirm with a check, dismiss with an X) and confirm no dialog appears.
-2. Add and remove rows; confirm the last row cannot be removed.
+1. Rename a row in place (confirm with a check, dismiss with an X) and confirm no dialog appears, and that the renamed row keeps its type (a renamed brake row still shows no scope control).
+2. On a new field, where all four rows are present, confirm there is no control to add a row. Remove a row and confirm the add control appears and offers only the removed row type; add it back and confirm the add control is hidden again. Confirm the last row cannot be removed.
```
### 2026-10-12 12:33 UTC · user 4 · custom_expected
```
-- Rows are renamed in place, confirmed with a check and dismissed with an X, without a dialog.
-- Rows can be added and removed, but the last row cannot be removed.
+- Rows are renamed in place, confirmed with a check and dismissed with an X, without a dialog. Renaming changes the label only; the row keeps its type.
+- Rows can be removed and added back. Adding a row offers only the row types the field does not already have, and the add control is not shown when all four are present. The last row cannot be removed.
-- S8-R6: “Rows will be renamed in place, confirmed with a check and dismissed with an X, without a dialog”
-- S8-R7: “Rows can be added and removed. The last row cannot be removed”
+- S8-R6: “Rows will be renamed in place, confirmed with a check and dismissed with an X, without a dialog. Renaming changes the label only; the row keeps its type”
+- S8-R7: “Rows can be removed and added back. Adding a row offers only the row types the field does not already have, and the add control is not shown when all four are present. The last row cannot be removed”
-- S8-R28: “A standalone Measurement field will default to inches, and inches will be first in the unit list. Most of what a shop measures is read in inches, so the common case should not be a scroll away”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S8-R28: “A standalone Measurement field will default to inches, and inches will be first in the unit list. Most of what a shop measures is read in inches, so the common case should not be a scroll away”Amended on 12 October 2026
+S8-R6 and S8-R7 changed on 7 October 2026 (Digital Inspections V2 specification, Confluence page 768507905, version 42 of 7 October 2026, read on 12 October 2026), after the PM's decision on SV-10877: a renamed row keeps its type, and a row can be added back only from the row types the field does not have, with the add control hidden when all four are present. The S8-R6 and S8-R7 quotes above are the current wording, and steps 1 and 2 and the expected results follow them. The Passed result in test run #494 (developer tests) was recorded against the earlier wording.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88551 — Filling an inspection: setting up each axle and recording values
https://shopview.testrail.io/index.php?/cases/view/88551

### 2026-10-12 12:33 UTC · user 4 · custom_steps
```
-2. Confirm a per-tire row records four values on a Dual axle (LO, LI, RI, RO) and two on a Single; a per-brake row always records two.
+2. Confirm a tire row on 'Outer + inner' (the default) records four values on a Dual axle (LO, LI, RI, RO) and two on a Single; a tire row set to '1 per side' in the template and a brake row always record two, left and right.
```
### 2026-10-12 12:33 UTC · user 4 · custom_expected
```
-- A per-tire row records four values on a Dual axle (left outer, left inner, right inner, right outer) and two on a Single; a per-brake row always records two.
+- A tire row on 'Outer + inner' records four values on a Dual axle (left outer, left inner, right inner, right outer) and two on a Single axle; a tire row on '1 per side' and a brake row always record two, left and right.
-- S8-R11: “A per-tire row on a Dual axle will record four values, left outer, left inner, right inner and right outer. On a Single axle it will record two. A per-brake row will always record two”
+- S8-R11: “A tire row on 'Outer + inner' records four values on a Dual axle, left outer, left inner, right inner and right outer, and two on a Single axle. A tire row on '1 per side' and a brake row always record two, left and right”
-- S8-R16: “Values will accept numbers and characters, including the text N/A”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S8-R16: “Values will accept numbers and characters, including the text N/A”Amended on 12 October 2026
+S8-R11 changed on 7 October 2026 (Digital Inspections V2 specification, Confluence page 768507905, version 42 of 7 October 2026, read on 12 October 2026), after the PM's decision on SV-10877: only a tire row on 'Outer + inner' records four values on a Dual axle; a tire row on '1 per side' and a brake row always record two, left and right. The S8-R11 quote above is the current wording, and step 2 and the expected results follow it. The Passed result in test run #494 (developer tests) was recorded against the earlier wording.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88553 — Filling: single or dual wheels, adding and removing axles, row units
https://shopview.testrail.io/index.php?/cases/view/88553

### 2026-10-12 12:33 UTC · user 4 · custom_steps
```
-1. Switch an axle between Single and Dual and confirm entered values are preserved with no warning (Single keeps the outer readings as left/right; switching back restores the inner readings; preserved values live for the session only).
+1. Switch an axle between Single and Dual and confirm entered values are preserved with no warning (Single keeps the outer readings as left/right; switching back restores the inner readings; preserved values live for the session only). Then start another axle on Single, enter left and right values with verdicts, and switch it to Dual: they are kept as the outer readings.
```
### 2026-10-12 12:33 UTC · user 4 · custom_expected
```
+- An axle filled on Single keeps its left and right values and verdicts when switched to Dual; they become the outer readings.
-- S8-R27: “The technician will be able to change a row's unit while filling. The change applies to that row across the whole axle, so every position on it is read in one unit, and it does not touch the other rows or the other axles”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S8-R27: “The technician will be able to change a row's unit while filling. The change applies to that row across the whole axle, so every position on it is read in one unit, and it does not touch the other rows or the other axles”Amended on 12 October 2026
+Step 1 and the expected results now also switch an axle that was filled on Single to Dual. Story defect SV-11095 found that this direction cleared the verdicts, against S8-R17 (Digital Inspections V2 specification, Confluence page 768507905, version 42 of 7 October 2026, read on 12 October 2026; S8-R17 itself is unchanged). The fix is on sv8181 since 12 October 2026 (v26.40.14-d06c301).
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88557 — Attach one file per question: file types, panel, size limit and names
https://shopview.testrail.io/index.php?/cases/view/88557

### 2026-10-13 17:57 UTC · user 4 · custom_preconds
```
-- Have PDF, image (incl. HEIC), Word, Excel and a video file to hand.
+- Have a PDF, JPG, PNG, HEIC, Word (DOC/DOCX) and Excel (XLS/XLSX) file to hand, plus a GIF, a WEBP, a TIFF, a video and a file larger than 20 MB.
```
### 2026-10-13 17:57 UTC · user 4 · custom_steps
```
-2. Upload from the field's properties panel and confirm the accepted types and the size limit are stated there before uploading (PDF, image incl HEIC, Word, Excel accepted; video not).
-3. Confirm the stated size limit (20 MB where the platform upload cap is raised to match in the same release, otherwise 10 MB and the panel says 10 MB).
+2. Upload from the field's properties panel and confirm the accepted file types are stated there before uploading (PDF, JPG, PNG, HEIC, Word (DOC, DOCX) and Excel (XLS, XLSX) accepted; GIF, WEBP, TIFF and video not), and that the size limit is not stated in advance.
+3. Upload a file larger than 20 MB and confirm it is rejected with a message that states the limit (20 MB).
```
### 2026-10-13 17:57 UTC · user 4 · custom_expected
```
-- PDF, image, Word and Excel files are accepted, including HEIC; video is not accepted.
-- The author uploads from the field's properties panel, where the accepted file types and the size limit are stated before the upload; the limit is 20 MB where the platform's upload cap is raised to match in the same release, otherwise 10 MB and the panel says 10 MB.
+- PDF, JPG, PNG, HEIC, Word (DOC, DOCX) and Excel (XLS, XLSX) files are accepted; GIF, WEBP, TIFF and video files are not.
+- The author uploads from the field's properties panel, where the accepted file types are stated before the upload. The size limit is not stated in advance: a file over 20 MB is rejected with a message that states the limit.
-- S11-R2: “PDF, image, Word and Excel files will be accepted, including HEIC. Video will not be accepted”
-- S11-R3: “The author will upload from the field's properties panel, and the accepted file types and the size limit will be stated there before the upload rather than after a file is rejected. The limit is 20 MB where the platform's own upload cap is raised to match in the same release; where it is not, the limit is 10 MB and the panel says 10 MB. No endpoint enforces either figure today — S11 is new work, so this is the decision rather than a description of what exists”
+- S11-R2: “PDF, JPG, PNG, HEIC, Word (DOC, DOCX) and Excel (XLS, XLSX) files will be accepted. GIF, WEBP, TIFF and video will not be accepted”
+- S11-R3: “The author will upload from the field's properties panel, and the accepted file types will be stated there before the upload. The size limit is not stated in advance; a file over it is rejected with a message that states the limit. The limit is 20 MB. No endpoint enforces either figure today — S11 is new work, so this is the decision rather than a description of what exists”
-- S11-R10: “The always-visible attachment is called the general reference file, on every field type. The file inside a follow-up block is not a reference file and carries no such label (S19-R12)”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S11-R10: “The always-visible attachment is called the general reference file, on every field type. The file inside a follow-up block is not a reference file and carries no such label (S19-R12)”Amended on 13 October 2026
+S11-R2 and S11-R3 changed on 29 September and 7 October 2026 (Digital Inspections V2 specification, Confluence page 768507905, read on 13 October 2026): the accepted types are listed and GIF, WEBP and TIFF are not accepted; the size limit is not stated in advance, a file over it is rejected with a message that states the limit, and the limit is 20 MB. The quotes above are the current wording; the preconditions, steps 2-3 and the expected results follow it.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88558 — The technician opens the attached file, unsupported types offer downlo
https://shopview.testrail.io/index.php?/cases/view/88558

### 2026-10-13 17:57 UTC · user 4 · custom_preconds
```
-- A template whose fields carry attachments of various types (PDF, web image, HEIC, TIFF, Word, Excel).
+- A template whose fields carry attachments of various types (PDF, web image, HEIC, Word, Excel).
```
### 2026-10-13 17:57 UTC · user 4 · custom_steps
```
-1. Confirm the attached file is visible on the canvas on the field's row, and the technician sees it while filling and can open it.
+1. Confirm the attached file is visible on the canvas on the field's row, and the technician sees it while filling, shown by its name, and opens it by clicking the name (a hyperlink); there is no separate Open or View button.
-3. Open a HEIC/TIFF/Word/Excel file and confirm the viewer says it cannot render it and offers the download, rather than opening blank or silently downloading.
+3. Open a HEIC, Word or Excel file and confirm the viewer says it cannot render it and offers the download, rather than opening blank or silently downloading.
```
### 2026-10-13 17:57 UTC · user 4 · custom_expected
```
-- A file the viewer cannot render (HEIC, TIFF, Word, Excel) says so in that view and offers the download, rather than opening blank or silently downloading.
+- While filling, the general reference file is shown by its name, and the name is a hyperlink that opens it in the viewer; there is no separate "Open" or "View" button.
+- A file the viewer cannot render (HEIC, Word, Excel) says so in that view and offers the download, rather than opening blank or silently downloading.
-- S11-R9: “A file the viewer cannot render — HEIC, TIFF, Word, Excel — will say so in that view and offer the download, rather than opening blank or silently downloading. Converting those types on the server so they can be read in place is a separate ticket; until it lands the viewer is honest about the limit instead of pretending”
-- S11-R5: “The attached file will be visible on the canvas on the field's row”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S11-R9: “A file the viewer cannot render — HEIC, Word, Excel — will say so in that view and offer the download, rather than opening blank or silently downloading. Converting those types on the server so they can be read in place is a separate ticket; until it lands the viewer is honest about the limit instead of pretending”
+- S11-R5: “The attached file will be visible on the canvas on the field's row”
+- S11-R11: “While filling, the general reference file is shown by its name, and the name is a hyperlink that opens it in the viewer. There is no separate "Open" or "View" button. The file inside a follow-up opens the same way (S19-R19)”Amended on 13 October 2026
+S11-R9 no longer lists TIFF, which is not accepted since 29 September 2026, and S11-R11 was added on 7 October 2026: the file is shown by its name, which is the link that opens it (Digital Inspections V2 specification, Confluence page 768507905, read on 13 October 2026). The preconditions, steps 1 and 3, the expected results and the quotes follow it.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88560 — Videos are refused, other shops' files don't open, removed files are g
https://shopview.testrail.io/index.php?/cases/view/88560

### 2026-10-13 17:57 UTC · user 4 · title
```
-Attaching is refused for videos, other shops' files, and removed files
+Videos are refused, other shops' files don't open, removed files are gone
```

## C88562 — A brand-new template only offers to choose a starting point
https://shopview.testrail.io/index.php?/cases/view/88562

### 2026-10-13 17:57 UTC · user 4 · custom_steps
```
-1. On the new template, confirm only the choice of starting point is shown: start from a template, or build from scratch — no section heading, field count, section menu, signature option or add-section control.
+1. On the new template, confirm only the choice of starting point is shown: start from a template, or build from scratch — no section heading, field count, section menu, signature option, add-section control or Edit / Preview control.
```
### 2026-10-13 17:57 UTC · user 4 · custom_expected
```
-- A brand-new template shows only the choice of starting point (start from a template, or build from scratch), with no section heading, field count, section menu, signature option or add-section control.
+- A brand-new template shows only the choice of starting point (start from a template, or build from scratch), with no section heading, field count, section menu, signature option, add-section control or Edit / Preview control.
-- S12-R1: “A brand-new template will show only the choice of starting point: start from a template, or build from scratch. No section heading, field count, section menu, signature option or add-section control”
+- S12-R1: “A brand-new template will show only the choice of starting point: start from a template, or build from scratch. No section heading, field count, section menu, signature option, add-section control or Edit / Preview control”
-- S12-R3: “The "Require technician signature" option will be available while building, and withheld only on that first empty screen”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S12-R3: “The "Require technician signature" option will be available while building, and withheld only on that first empty screen”Amended on 13 October 2026
+S12-R1 also lists the Edit / Preview control among what the first screen does not show (Digital Inspections V2 specification, Confluence page 768507905, read on 13 October 2026). The quote above is the current wording; step 1 and the expected results follow it.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88563 — The starter templates, including the coming soon equipment starter
https://shopview.testrail.io/index.php?/cases/view/88563

### 2026-10-13 17:57 UTC · user 4 · custom_steps
```
-1. Confirm the starter library offers six slots; five carry template content (Class 8 Tractor PM, DOT / Annual Federal Safety, Air-Brake, Trailer, Light-Duty PM) built from the five templates shops already run, each card an icon and a single name.
+1. Confirm the starter library offers six slots; five carry template content (Class 8 Tractor PM Inspection, DOT / Annual Federal Safety Inspection, Air-Brake Inspection, Trailer Inspection and Light-Duty PM Inspection) built from the five templates shops already run, each card an icon and a name only, with no second line.
```
### 2026-10-13 17:57 UTC · user 4 · custom_expected
```
-- The starter library offers six slots; five carry template content (Class 8 Tractor PM, DOT / Annual Federal Safety, Air-Brake, Trailer and Light-Duty PM), each card carrying an icon and a single name.
+- The starter library offers six slots; five carry template content (Class 8 Tractor PM Inspection, DOT / Annual Federal Safety Inspection, Air-Brake Inspection, Trailer Inspection and Light-Duty PM Inspection), each card carrying an icon and a name only, with no second line.
-- S12-R4: “The starter library will offer six slots. Five carry template content — Class 8 Tractor PM Inspection (4 sections, 77 fields), DOT / Annual Federal Safety Inspection (12, 50), Air-Brake Inspection (3, 15), Trailer Inspection (5, 20) and Light-Duty PM Inspection (4, 29) — built from the five templates the shops already run. A starter card carries an icon and a name only; the name describes the template, and a second line repeating it was removed”
+- S12-R4: “The starter library will offer six slots. Five carry template content, built from the five templates the shops already run: Class 8 Tractor PM Inspection, DOT / Annual Federal Safety Inspection, Air-Brake Inspection, Trailer Inspection and Light-Duty PM Inspection. Starters are verified visually, one to one, against the output of the extension they come from. A starter card carries an icon and a name only; the name describes the template, and a second line repeating it was removed”
-- S12-R7: “A section added after the first will offer field types only, not starting points, because a starting point creates a whole template”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S12-R7: “A section added after the first will offer field types only, not starting points, because a starting point creates a whole template”Amended on 13 October 2026
+S12-R4 changed after 22 September 2026 (Digital Inspections V2 specification, Confluence page 768507905, read on 13 October 2026): it gives the starters' full names, no longer lists section and field counts, and says the starters are verified visually against the extension's output. The quote above is the current wording; step 1 and the expected results use the full names.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88564 — Field settings: measurement row cards and answer options
https://shopview.testrail.io/index.php?/cases/view/88564

### 2026-10-13 17:57 UTC · user 4 · custom_steps
```
-1. On the per-axle field, confirm measurement rows appear as cards: the row name reads as text with a rename control (check to confirm, X to dismiss), alongside the unit and whether it is measured on the tire or the brake, with defaults labelled as defaults.
-2. Add a measurement row and confirm it opens ready to be renamed; confirm the row list shows how many rows there are and offers a full-width control to add another.
+1. On the per-axle field, confirm measurement rows appear as cards: the row name reads as text with a rename control (check to confirm, X to dismiss), alongside the unit and, on a tire row (tire pressure, tread depth), its scope ('1 per side' or 'Outer + inner'); a brake row (brake lining, push-rod travel) shows no scope control; defaults are labelled as defaults.
+2. Remove a row, then use the add control and confirm it opens a menu of only the row types the field does not already have; confirm the row list shows how many rows there are, the add control is full width, and it is hidden when all four row types are present.
```
### 2026-10-13 17:57 UTC · user 4 · custom_expected
```
-- Per-axle measurement rows appear as cards: the row name reads as text with a rename control (check to confirm, X to dismiss) alongside the unit and whether it is measured on the tire or the brake, with defaults labelled as defaults.
-- A newly added measurement row opens ready to be renamed.
-- The row list shows how many rows there are and offers a full-width control to add another.
+- Per-axle measurement rows appear as cards: the row name reads as text with a rename control (check to confirm, X to dismiss) alongside the unit and, on a tire row, its scope; a brake row shows no scope control. Defaults are labelled as defaults.
+- Adding a measurement row opens a menu of the row types the field does not already have.
+- The row list shows how many rows there are and offers a full-width control to add one of the missing row types; the control is hidden when all four are present.
-- S12-R8: “Measurement rows on a per-axle field will appear as cards. The row name will read as text with a control to rename it, confirmed with a check and dismissed with an X, alongside the unit and whether the row is measured on the tire or on the brake. The defaults will be labelled as defaults, so the author does not read them as the value for a particular truck”
-- S12-R9: “A newly added measurement row will open ready to be renamed”
-- S12-R10: “The row list will show how many rows there are, and offer a full-width control to add another”
-- S12-R11: “Response options will be editable rows with their colours. An "Include Monitor option" control will turn the optional amber response on and off, and will be on by default”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S12-R8: “Measurement rows on a per-axle field will appear as cards. The row name will read as text with a control to rename it, confirmed with a check and dismissed with an X, alongside the unit and, on a tire row, its scope. A brake row shows no scope control. The defaults will be labelled as defaults, so the author does not read them as the value for a particular truck”
+- S12-R9: “Adding a measurement row opens a menu of the row types the field does not already have (S8-R7)”
+- S12-R10: “The row list will show how many rows there are, and offer a full-width control to add one of the missing row types, hidden when all four are present”
+- S12-R11: “Response options will be editable rows with their colours. An "Include Monitor option" control will turn the optional amber response on and off, and will be on by default”Amended on 13 October 2026
+S12-R8, S12-R9 and S12-R10 changed on 7 October 2026 with SV-10877, "Per-axle rows are four fixed types" (Digital Inspections V2 specification, Confluence page 768507905, read on 13 October 2026): a per-axle field carries up to four fixed row types (tire pressure, tread depth, brake lining, push-rod travel), each at most once; only the tire rows have a scope control; adding a row offers only the missing types. The quotes above are the current wording; steps 1-2 and the expected results follow it.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88567 — One text field replaces short and long text, per-axle explained
https://shopview.testrail.io/index.php?/cases/view/88567

### 2026-10-13 17:57 UTC · user 4 · custom_steps
```
-4. Open the Per axle field type's on-demand explanation and confirm it says one field covers the whole unit, the author defines the measurement rows, and the technician adds each axle while filling.
+4. Open the Per axle field type's on-demand explanation and confirm it says one field covers the whole unit, the author picks which of the four measurement rows it carries, and the technician adds each axle while filling.
+5. Open a Text field's settings and confirm there is no single-line or multi-line option.
```
### 2026-10-13 17:57 UTC · user 4 · custom_expected
```
-- The Per axle field type carries an on-demand explanation: one field covers the whole unit, the author defines the measurement rows, and the technician adds each axle while filling.Source — where this behaviour comes from
+- The Per axle field type carries an on-demand explanation: one field covers the whole unit, the author picks which of the four measurement rows it carries, and the technician adds each axle while filling.
+- The Text field has no single-line or multi-line option; it grows with the answer.Source — where this behaviour comes from
-- S12-R24: “The Per axle field type will carry an explanation on demand: one field covers the whole unit, the author defines the measurement rows, and the technician adds each axle while filling the inspection in”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S12-R24: “The Per axle field type will carry an explanation on demand: one field covers the whole unit, the author picks which of the four measurement rows it carries, and the technician adds each axle while filling the inspection in”
+- S12-N4: “The Text field has no single-line or multi-line option; it grows with the answer”Amended on 13 October 2026
+S12-R24 changed on 7 October 2026 with SV-10877 (Digital Inspections V2 specification, Confluence page 768507905, read on 13 October 2026): the author picks which of the four fixed measurement rows the field carries. S12-N4 was not covered by any case; step 5 adds it. The quotes above are the current wording.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88568 — Preview shows the fill screen read-only, except the axle control
https://shopview.testrail.io/index.php?/cases/view/88568

### 2026-10-13 17:57 UTC · user 4 · custom_steps
```
-2. Confirm Preview is read-only except the axle control: adding/deleting an axle writes the count back to the draft; no values, verdicts, Mark OK, Add Note or Add Photo are accepted; a reference file still opens; and no submit bar is drawn.
-3. Confirm Preview works on a draft without publishing first, and clicking a field returns to Edit with that field selected.
+2. Confirm Preview is read-only except the axle count: Add Axle and delete axle write the count back to the draft (returning to Edit shows the new number on the Axles control), Add Axle stops at 8 and delete stops at 1, and the first axle is never deleted; no values, verdicts, Single/Dual, Drum/Disc, Mark OK, Add Note or Add Photo are accepted; a reference file is shown but cannot be opened; and no submit bar is drawn.
+3. Confirm Preview works on a draft without publishing first, and clicking anywhere on a field (except the axle count controls) returns to Edit with that field selected.
```
### 2026-10-13 17:57 UTC · user 4 · custom_expected
```
-- Preview is read-only except the axle control (adding or deleting an axle writes the count back to the draft); no values, verdicts, Mark OK, Add Note or Add Photo are accepted, a reference file still opens, and the submit bar is not drawn.
-- Preview works on a draft without asking the author to publish first, and clicking a field returns to Edit with that field selected in the panel.
+- Preview is read-only except the axle count: Add Axle and delete axle write the count back to the draft, Add Axle stops at 8, delete stops at 1 and the first axle is never deleted; no values, verdicts, Single/Dual, Drum/Disc, Mark OK, Add Note or Add Photo are accepted; a reference file is shown but cannot be opened; and the submit bar is not drawn.
+- Preview works on a draft without asking the author to publish first, and clicking anywhere on a field, except the axle count controls, returns to Edit with that field selected in the panel.
-- S12-R31: “Preview is read-only, with one exception: the axle control. Adding or deleting an axle there writes the count back to the draft, so returning to Edit shows the new number on the Axles control (S12-R29) — Preview is where an author first sees the field at its real size and works out that three is not enough, and making them carry that number back by hand is the round trip the mode exists to remove. Nothing else accepts input: no values, no verdicts, no Mark OK, no Add Note, no Add Photo. A reference file still opens, because that is a read. The submit bar is not drawn at all — it belongs to an inspection rather than a template”
-- S12-R32: “Preview works on a draft and never asks the author to publish first. Clicking a field in Preview returns to Edit with that field selected in the panel, which is the round trip the mode exists to remove”
-- S12-R33: “Preview explains nothing about itself. It draws no banner saying that nothing is saved, and no line stating how many axles the technician starts on. The Edit and Preview control already says which mode the author is in, and the Axles control explains the count where it is set (S12-R29). A mode that narrates itself is exactly the subtext this document rules out”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S12-R31: “Preview is read-only, with one exception: the axle count. Add Axle and delete axle work there (the first axle is never deleted, S8-R20) and write the count back to the draft, so returning to Edit shows the new number on the Axles control (S12-R29). Add Axle stops at 8 and delete stops at 1, so the count never leaves the range. Nothing else accepts input: no values, no verdicts, no Single/Dual, no Drum/Disc, no Mark OK, no Add Note, no Add Photo. A reference file is shown but cannot be opened. The submit bar is not drawn at all; it belongs to an inspection rather than a template”
+- S12-R32: “Preview works on a draft and never asks the author to publish first. Clicking anywhere on a field in Preview, except the axle count controls, returns to Edit with that field selected in the panel, which is the round trip the mode exists to remove”
+- S12-R33: “Preview explains nothing about itself. It draws no banner saying that nothing is saved, and no line stating how many axles the technician starts on. The Edit and Preview control already says which mode the author is in, and the Axles control explains the count where it is set (S12-R29). A mode that narrates itself is exactly the subtext this document rules out”Amended on 13 October 2026
+S12-R31 and S12-R32 changed on 29 September 2026 (Digital Inspections V2 specification, Confluence page 768507905, read on 13 October 2026): in Preview a reference file is shown but cannot be opened; Add Axle stops at 8 and delete at 1; Single/Dual and Drum/Disc take no input; clicking anywhere on a field except the axle count controls returns to Edit. The quotes above are the current wording; steps 2-3 and the expected results follow it.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88569 — Templates list, per-axle starters, the Axles control and required fiel
https://shopview.testrail.io/index.php?/cases/view/88569

### 2026-10-13 17:57 UTC · user 4 · custom_steps
```
-3. Confirm the per-axle Axles control sits in the panel shaped like a measurement row, below the rows and above the add control, headed 'Measurement rows · every axle', defaulting to 3, offering 2 to 5, explained on demand; an out-of-range count drops back to the default rather than being rejected.
+3. Confirm the per-axle Axles control sits in the panel shaped like a measurement row, below the rows and above the add control, headed 'Measurement rows · every axle', defaulting to 3, offering 1 to 8, explained on demand; an out-of-range count drops back to the default rather than being rejected.
```
### 2026-10-13 17:57 UTC · user 4 · custom_expected
```
-- A per-axle field's properties panel offers an Axles control shaped like a measurement row, below the rows and above the add control, defaulting to 3 and offering 2 to 5, explained on demand; the rows above it are headed "Measurement rows · every axle".
+- A per-axle field's properties panel offers an Axles control shaped like a measurement row, below the rows and above the add control, defaulting to 3 and offering 1 to 8, explained on demand; the rows above it are headed "Measurement rows · every axle".
-- S12-R28: “Seeded templates will arrive with checkbox fields marked required to complete, and with text, notes and measurement fields optional. A shop turns off what it does not want rather than turning on what it does. Requiring every field would put a required comment in every section of a 77-field template and would fight the one-press Mark OK of S18”
-- S12-R29: “A per-axle field will offer an Axles control in its properties panel, in the shape of a measurement row and sitting below the rows, above the control that adds one — so the panel reads top to bottom: what every axle is measured on, then how many axles to start with. It defaults to 3 and offers 2 to 5, and it is explained on demand rather than in permanent text. The rows above it are headed "Measurement rows · every axle"”
-- S12-R30: “An axle count outside the offered range is dropped back to the default rather than rejected. A template that fails to save over a starting point would be worse than one that starts at three”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S12-R28: “Seeded templates will arrive with checkbox fields marked required to complete, and with text, notes and measurement fields optional. A shop turns off what it does not want rather than turning on what it does. Requiring every field would put a required comment in every section of the largest starter and would fight the one-press Mark OK of S18”
+- S12-R29: “A per-axle field will offer an Axles control in its properties panel, in the shape of a measurement row and sitting below the rows, above the control that adds one — so the panel reads top to bottom: what every axle is measured on, then how many axles to start with. It defaults to 3 and offers 1 to 8, and it is explained on demand rather than in permanent text. The rows above it are headed "Measurement rows · every axle"”
+- S12-R30: “An axle count outside the offered range is dropped back to the default rather than rejected. A template that fails to save over a starting point would be worse than one that starts at three”Amended on 13 October 2026
+S12-R29 changed on 29 September 2026 (Digital Inspections V2 specification, Confluence page 768507905, read on 13 October 2026): the Axles control offers 1 to 8 (was 2 to 5). S12-R28 now says "the largest starter" instead of "a 77-field template". The quotes above are the current wording; step 3 and the expected results follow it.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88570 — Choosing a starting point again, clearing labels, and descriptions
https://shopview.testrail.io/index.php?/cases/view/88570

### 2026-10-13 17:57 UTC · user 4 · custom_steps
```
-1. Confirm a starting point cannot be applied twice, or to a template that already has sections (offered only on the empty first screen).
+1. Confirm a starting point cannot be applied twice, or to a template that already has content (offered only on the empty first screen).
```
### 2026-10-13 17:57 UTC · user 4 · custom_expected
```
-- A starting point cannot be applied twice, or to a template that already has sections, because it is offered only on the empty first screen.
+- A starting point cannot be applied twice, or to a template that already has content, because it is offered only on the empty first screen.
-- S12-N1: “A starting point cannot be applied twice, or to a template that already has sections, because starting points are offered only on the empty first screen”
+- S12-N1: “A starting point cannot be applied twice, or to a template that already has content, because starting points are offered only on the empty first screen”
-- S12-N3: “No surface the technician sees — the fill screen, and therefore Preview — carries a generated descriptor line summarising a field's configuration. Not "4 measurement rows · 3 axles to start · verdict per tire", nor any variant of it. An instruction the author wrote is a different thing and is shown as written”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S12-N3: “No surface the technician sees — the fill screen, and therefore Preview — carries a generated descriptor line summarising a field's configuration. Not "4 measurement rows · 3 axles to start · verdict per tire", nor any variant of it. An instruction the author wrote is a different thing and is shown as written”Amended on 13 October 2026
+S12-N1 says "content" rather than "sections" (Digital Inspections V2 specification, Confluence page 768507905, read on 13 October 2026). The quote above is the current wording; step 1 and the expected results follow it.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88584 — Building a template: the follow-up switch and the answer blocks
https://shopview.testrail.io/index.php?/cases/view/88584

### 2026-10-13 17:57 UTC · user 4 · custom_steps
```
-4. Confirm the text area and attach control are rendered and disabled until the checkbox is checked (not revealed only on check), and a follow-up is one text and at most one file (no second file, no list).
+4. Confirm the text area and attach control are rendered and disabled until the checkbox is checked (not revealed only on check), and a follow-up is a text, a file, or both, with at most one file (no second file, no list).
```
### 2026-10-13 17:57 UTC · user 4 · custom_expected
```
-- A follow-up is one text and at most one file — there is no second file and no list.Source — where this behaviour comes from
+- A follow-up is a text, a file, or both, with at most one file — there is no second file and no list.Source — where this behaviour comes from
-- S19-R5: “A follow-up is one text and at most one file. There is no second file and no list”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S19-R5: “A follow-up is a text, a file, or both, with at most one file. There is no second file and no list”Amended on 13 October 2026
+S19-R5 reads "a text, a file, or both, with at most one file" (Digital Inspections V2 specification, Confluence page 768507905, read on 13 October 2026). The quote above is the current wording; step 4 and the expected results follow it.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88589 — Filling: the attached file, the instruction text and the two layouts
https://shopview.testrail.io/index.php?/cases/view/88589

### 2026-10-13 17:57 UTC · user 4 · custom_steps
```
-1. Open the attached file and confirm it opens full screen in the same view and closes back to the exact position in the inspection, its action reading View Instruction.
+1. On OK or N/A, first click Instruction in the card footer to expand it. Click the attached file's name and confirm it opens full screen in the same view and closes back to the exact position in the inspection; the file name is the hyperlink that opens it, and there is no separate "View Instruction" button.
```
### 2026-10-13 17:57 UTC · user 4 · custom_expected
```
-- The attached file opens full screen in the same view and closes back to the exact position in the inspection, its action reading View Instruction.
+- The attached file opens full screen in the same view and closes back to the exact position in the inspection; the file name is a hyperlink that opens it, with no separate "View Instruction" button.
-- S19-R19: “The attached file will open full screen in the same view and close back to the exact position in the inspection, as the reference file already does. Its action reads View Instruction”
+- S19-R19: “The attached file will open full screen in the same view and close back to the exact position in the inspection, as the reference file already does. The file name is a hyperlink that opens it; there is no separate "View Instruction" button”
-- S19-R21: “Desktop and phone will be two layouts rather than one compressed. On a phone the acknowledgement takes its own full-width row below the file row, because the file row has no width to spare and the target has to be hittable with a gloved thumb”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S19-R21: “Desktop and phone will be two layouts rather than one compressed. On a phone the acknowledgement takes its own full-width row below the file row, because the file row has no width to spare and the target has to be hittable with a gloved thumb”Amended on 13 October 2026
+S19-R19 changed on 7 October 2026, decided on SV-10794 (Digital Inspections V2 specification, Confluence page 768507905, read on 13 October 2026): the file name is a hyperlink that opens the file; there is no "View Instruction" button. The quote above is the current wording; step 1 and the expected results follow it. Step 1 also says that on OK or N/A the instruction is first expanded from the Instruction action in the card footer (S19-R15).
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88590 — Submitting needs every required acknowledgement, listed as outstanding
https://shopview.testrail.io/index.php?/cases/view/88590

### 2026-10-12 12:33 UTC · user 4 · custom_steps
```
-3. Press submit with items outstanding and confirm the list opens rather than an error dialog.
+3. Press submit with items outstanding and confirm the list opens rather than an error dialog. Confirm Submit is never disabled, it is named 'Submit & Generate Report' on desktop and on the phone, and the list is titled 'N items before submitting', with N the number of items listed.
```
### 2026-10-12 12:33 UTC · user 4 · custom_expected
```
+- Submit is never disabled. It is named 'Submit & Generate Report' on every surface, and the list is titled 'N items before submitting'.
-- S19-R25: “Pressing submit with items outstanding will open that list rather than raising an error dialog”
-- S19-R26: “An unacknowledged follow-up will not block the action that completes a section. The count on that action rises and the technician may move on, per S14-R6”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S19-R25: “Pressing submit with items outstanding will open that list rather than raising an error dialog. Submit is never disabled. It is named 'Submit & Generate Report' on every surface, and the list is titled 'N items before submitting'. The rule covers the submit button only; the sign-off step keeps its current labels ('Sign & generate report', 'Sign to complete', 'Confirm & lock inspection')”
+- S19-R26: “An unacknowledged follow-up will not block the action that completes a section. The count on that action rises and the technician may move on, per S14-R6”Amended on 12 October 2026
+The S19-R25 quote above now carries the whole rule (Digital Inspections V2 specification, Confluence page 768507905, version 42 of 7 October 2026, read on 12 October 2026); before, it stopped after the first sentence. Step 3 and the expected results now also check that Submit is never disabled, its name and the list title. The sign-off step's labels are outside this case.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88591 — Preview shows every follow-up, acknowledgement inactive, no banner
https://shopview.testrail.io/index.php?/cases/view/88591

### 2026-10-13 17:57 UTC · user 4 · custom_steps
```
-2. Confirm the attached file still opens in Preview (opening a file is a read), and the acknowledgement appears in the same inert, non-interactive style Preview uses for the verdict controls and takes no input.
+2. Confirm the attached file is shown in Preview but cannot be opened, as for the general reference file, and the acknowledgement appears in the same inert, non-interactive style Preview uses for the verdict controls and takes no input.
```
### 2026-10-13 17:57 UTC · user 4 · custom_expected
```
-- The file still opens in Preview (a read), and the acknowledgement renders in the inert treatment the verdict controls use there and takes no input.
+- The file is shown in Preview but cannot be opened, as for the general reference file, and the acknowledgement renders in the inert treatment the verdict controls use there and takes no input.
-- S19-R28: “The file will still open in Preview, because that is a read. The acknowledgement will render in the inert treatment the verdict controls already use there and will take no input, per S12-R31”
-- S19-R29: “Preview will draw no banner explaining itself”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S19-R28: “In Preview the file is shown but cannot be opened, as for the general reference file (S12-R31). The acknowledgement will render in the inert treatment the verdict controls already use there and will take no input, per S12-R31”
+- S19-R29: “Preview will draw no banner explaining itself”Amended on 13 October 2026
+S19-R28 changed on 7 October 2026 (Digital Inspections V2 specification, Confluence page 768507905, read on 13 October 2026): in Preview the follow-up file is shown but cannot be opened, as S12-R31 already said for the general reference file. The quote above is the current wording; step 2 and the expected results follow it.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```

## C88592 — Follow-ups: not on per-axle fields, empty ones blocked, report without
https://shopview.testrail.io/index.php?/cases/view/88592

### 2026-10-13 17:57 UTC · user 4 · title
```
-Follow-ups: not on per-axle fields, empty ones blocked, kept off the report
+Follow-ups: not on per-axle fields, empty ones blocked, report without the file
```
### 2026-10-13 17:57 UTC · user 4 · custom_preconds
```
-- A per-axle field; a checked follow-up left with no text and no file; a completed report; the ShopCoach brief; and the counting rule to check.
+- A per-axle field; a checked follow-up left with no text and no file; a completed report of an inspection whose follow-up (with text and a file) was acknowledged; the ShopCoach brief; and the counting rule to check.
```
### 2026-10-13 17:57 UTC · user 4 · custom_steps
```
-3. Confirm neither the instruction nor the acknowledgement reaches the customer report, and neither reaches the ShopCoach brief (unchanged).
+3. Confirm the customer report shows the follow-up instruction text and its acknowledgement, with who acknowledged it and when, but not the attached file; and confirm neither the instruction nor the acknowledgement reaches the ShopCoach brief (unchanged).
```
### 2026-10-13 17:57 UTC · user 4 · custom_expected
```
-- Neither the instruction nor the acknowledgement reaches the customer report.
+- The customer report shows the follow-up instruction text and its acknowledgement, with who acknowledged it and when; the attached file does not appear on the report.
-- S19-N3: “Neither the instruction nor the acknowledgement reaches the customer report”
+- S19-N3: “The customer report shows the follow-up instruction text and its acknowledgement, with who acknowledged it and when. The attached file does not appear on the report”
-- S19-N5: “An acknowledgement is not a finding and carries no count. S5-R17 counts responses”Last checked against build v26.36.8-2a64085 on 10/1/2026.
+- S19-N5: “An acknowledgement is not a finding and carries no count. S5-R17 counts responses”Amended on 13 October 2026
+S19-N3 was rewritten on 5 October 2026 (Digital Inspections V2 specification, Confluence page 768507905, read on 13 October 2026): the customer report shows the follow-up instruction text and its acknowledgement (who and when), but not the attached file. The title, preconditions, step 3, the expected results and the quote follow it.
+Last checked against build v26.36.8-2a64085 on 10/1/2026.
```
