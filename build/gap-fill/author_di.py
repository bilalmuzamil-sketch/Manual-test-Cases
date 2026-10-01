#!/usr/bin/env python3
"""Rule-117 gap-fill cases for 2 Digital Inspection V2 gap stories.
  SV-8347 -> section 25607 (permission-gated delete/reopen of incomplete inspection on a completed line)
  SV-9882 -> section 25608 (server-side conversion: Word/Excel->PDF, HEIC/TIFF->web image, render in place)
Dry:   python3 build/gap-fill/author_di.py
Apply: python3 build/gap-fill/author_di.py --apply
"""
import importlib.util
spec = importlib.util.spec_from_file_location("gf", "build/gap-fill/gf_lib.py")
L = importlib.util.module_from_spec(spec); spec.loader.exec_module(L)

# ---------------------------------------------------------------------------
# SV-8347  section 25607
# ---------------------------------------------------------------------------
SEC_8347 = 25607
SRC_8347 = ("Epic SV-8181 (Digital Inspection V2); story SV-8347 (Enable deleting an incomplete "
            "inspection (Not started) from a completed line); Jira description (current, primary) + "
            "Confluence 768507905; read 1 Oct 2026.")
MK_8347 = ("authored from story SV-8347 (status Open, not yet built); no reachable QA build - "
           "not build-verified.")

Q_CREATE_EDIT = ("SV-8347 description",
    "Incomplete inspection → delete needs WO Lines: Create & Edit, whether the line is complete or not.")
Q_GATED = ("SV-8347 description",
    "deletion should be gated on the inspection's status and the WO-Lines atom, independent of the WO line's status.")
Q_COMPLETED = ("SV-8347 description",
    "Completed inspection → delete/reopen needs WO Lines: Delete")
Q_EXPECTED = ("SV-8347 description",
    "Expected: The described user can delete incomplete inspections.")
Q_ACTUAL = ("SV-8347 description",
    "Actual: The described user has only View mode after the line is completed. The Delete icon is hidden.")

# Case 1 - the fix: delete allowed with Create & Edit
L.add(SEC_8347,
    "Delete a Not started inspection on a completed line (WO Lines: Create & Edit)",
    [
        "Build: Digital Inspection V2, on a reachable QA environment.",
        "A custom role with WO Lines: Create & Edit turned ON and WO Lines: Delete turned OFF, set in Settings > Roles (e.g. role 'ZZAUTOTEST Inspector').",
        "A test user signed in with that role.",
        "A work order with one line set to Complete status (e.g. line 'Front brakes'), set by completing the line.",
        "A digital inspection on that completed line in Not started status (e.g. template 'ZZAUTOTEST Brake Check'), added before the line was completed.",
    ],
    [
        "Open the work order that has the completed line.",
        "Open the completed line 'Front brakes'.",
        "Locate the Not started inspection 'ZZAUTOTEST Brake Check' on that line.",
        "Check whether the inspection shows a Delete (trash) icon or opens in View mode only.",
        "Select the Delete (trash) icon on the Not started inspection.",
        "Confirm the deletion in the confirmation prompt.",
    ],
    [
        "The Not started inspection shows a Delete (trash) icon; it is not limited to View mode.",
        "Selecting Delete removes the inspection from the completed line.",
        "The delete is allowed even though the work order line is Complete.",
    ],
    SRC_8347, [Q_CREATE_EDIT, Q_EXPECTED], MK_8347)

# Case 2 - negative gate for incomplete inspection (no Create & Edit -> View mode only)
L.add(SEC_8347,
    "No WO Lines: Create & Edit - Not started inspection stays View mode only",
    [
        "Build: Digital Inspection V2, on a reachable QA environment.",
        "A custom role with WO Lines: Create & Edit turned OFF and WO Lines: Delete turned OFF, set in Settings > Roles (e.g. role 'ZZAUTOTEST Viewer').",
        "A test user signed in with that role.",
        "A work order with one line set to Complete status (e.g. line 'Front brakes').",
        "A digital inspection on that completed line in Not started status (e.g. template 'ZZAUTOTEST Brake Check').",
    ],
    [
        "Open the work order that has the completed line.",
        "Open the completed line 'Front brakes'.",
        "Open the Not started inspection 'ZZAUTOTEST Brake Check'.",
        "Look for a Delete (trash) icon on the inspection.",
    ],
    [
        "The inspection opens in View mode only.",
        "No Delete (trash) icon is shown on the inspection.",
        "This user cannot delete the Not started inspection.",
    ],
    SRC_8347, [Q_CREATE_EDIT, Q_GATED], MK_8347)

# Case 3 - completed inspection delete/reopen gated on WO Lines: Delete
L.add(SEC_8347,
    "Delete or reopen a completed inspection requires WO Lines: Delete",
    [
        "Build: Digital Inspection V2, on a reachable QA environment.",
        "A custom role with WO Lines: Delete turned OFF but WO Lines: Create & Edit ON, in Settings > Roles (e.g. role 'ZZAUTOTEST Inspector').",
        "A second custom role with WO Lines: Delete turned ON, in Settings > Roles (e.g. role 'ZZAUTOTEST Lead').",
        "A test user signed in for each of the two roles.",
        "A work order with one line set to Complete status (e.g. line 'Front brakes').",
        "A completed inspection on that line (e.g. 'ZZAUTOTEST Brake Check' run to completion so its report exists).",
    ],
    [
        "Sign in as the user whose role has WO Lines: Delete turned off.",
        "Open the completed line and open the completed inspection.",
        "Check for a Delete (trash) icon and a Reopen action.",
        "Sign in as the user whose role has WO Lines: Delete turned on.",
        "Open the completed line and open the completed inspection.",
        "Check for a Delete (trash) icon and a Reopen action.",
        "Select Reopen and confirm the prompt.",
    ],
    [
        "Without WO Lines: Delete, the completed inspection opens in View mode with no Delete icon and no Reopen action.",
        "With WO Lines: Delete, the completed inspection shows a Delete (trash) icon and a Reopen action.",
        "Reopen returns the completed inspection to an editable state.",
    ],
    SRC_8347, [Q_COMPLETED, Q_GATED], MK_8347)

# Case 4 - gate is independent of the WO line's status
L.add(SEC_8347,
    "Incomplete inspection delete gate is independent of the WO line's status",
    [
        "Build: Digital Inspection V2, on a reachable QA environment.",
        "A custom role with WO Lines: Create & Edit turned ON, in Settings > Roles (e.g. role 'ZZAUTOTEST Inspector').",
        "A test user signed in with that role.",
        "A work order line in Complete status carrying a Not started inspection (e.g. line 'Front brakes', inspection 'ZZAUTOTEST Brake Check').",
        "A second work order line that is NOT complete (In progress) carrying a Not started inspection (e.g. line 'Rear brakes', inspection 'ZZAUTOTEST Rear Check').",
    ],
    [
        "Open the work order and open the Complete line 'Front brakes'.",
        "Check that the Not started inspection shows a Delete (trash) icon, then delete it and confirm.",
        "Open the not-complete line 'Rear brakes'.",
        "Check that the Not started inspection shows a Delete (trash) icon, then delete it and confirm.",
    ],
    [
        "On the Complete line, the Not started inspection shows a Delete icon and can be deleted.",
        "On the not-complete line, the Not started inspection shows a Delete icon and can be deleted.",
        "The delete behaviour for a Not started inspection is the same whether or not the line is Complete.",
    ],
    SRC_8347, [Q_CREATE_EDIT, Q_GATED], MK_8347)

# ---------------------------------------------------------------------------
# SV-9882  section 25608
# ---------------------------------------------------------------------------
SEC_9882 = 25608
SRC_9882 = ("Epic SV-8181 (Digital Inspection V2); story SV-9882 (DVI V2 - Convert reference files the "
            "viewer cannot render); Jira description (current, primary) + Confluence 768507905 S11-R4/R9; "
            "read 1 Oct 2026.")
MK_9882 = ("authored from story SV-9882 (status Open, not yet built); no reachable QA build - "
           "not build-verified.")

Q_WORD_EXCEL = ("SV-9882 requirement",
    "Word and Excel → PDF, so they open in the viewer the way a PDF already does")
Q_HEIC_TIFF = ("SV-9882 requirement",
    "HEIC and TIFF → a web image (webp or jpeg)")
Q_AFTER = ("SV-9882 QA note",
    "Before conversion, each states it can only be downloaded. After conversion, each renders in place")
Q_MULTIPAGE = ("SV-9882 edge case",
    "A multi-page Word or Excel document converts whole. A single-page-only conversion would silently hide content the author attached")
Q_WIDE = ("SV-9882 edge case",
    "An Excel sheet wider than a page converts to something readable rather than clipping columns — this is the case most likely to need a decision on layout")
Q_ORIGINAL = ("SV-9882 requirement",
    "The original file is kept and is what the download action returns. The conversion is a rendering convenience, not a replacement — an author who uploaded an Excel sheet gets an Excel sheet back")
Q_DL_ORIGINAL = ("SV-9882 QA note",
    "The download action still returns the original file, not the converted one")
Q_FAIL_USABLE = ("SV-9882 requirement",
    "A conversion that fails leaves the attachment usable: the file is still attached, still downloadable, and the viewer falls back to the S11-R9 state")
Q_CORRUPT = ("SV-9882 edge case",
    "A password-protected or corrupt document fails conversion and falls back to the S11-R9 state rather than blocking the upload")
Q_S11R4 = ("Confluence 768507905 S11-R4",
    "A PDF and a web image are readable there without downloading")
Q_S11R9 = ("Confluence 768507905 S11-R9",
    "A file the viewer cannot render — HEIC, TIFF, Word, Excel — will say so in that view and offer the download, rather than opening blank or silently downloading.")

# Case 1 - Word -> PDF renders in place (multi-page whole)
L.add(SEC_9882,
    "Word reference file converts to PDF and renders in the viewer in place",
    [
        "Build: Digital Inspection V2, on a reachable QA environment.",
        "A multi-page Word reference file attached to a question from the field's properties panel in the template builder (e.g. 'ZZAUTOTEST-procedure.docx', 3 pages).",
        "The file is within the stated upload size limit (e.g. under 20 MB).",
        "A work order running that inspection, open on the technician fill screen.",
    ],
    [
        "On the fill screen, open the question that has the Word reference file.",
        "Select the attached file to open the full-page reference viewer.",
        "Scroll through the viewer to the last page.",
    ],
    [
        "The Word file opens as a readable full-page document in the viewer, not a blank frame and not an automatic download.",
        "Close and Download actions are available in the viewer.",
        "Every page of the document is shown; no pages are missing.",
    ],
    SRC_9882, [Q_WORD_EXCEL, Q_MULTIPAGE, Q_S11R4], MK_9882)

# Case 2 - Excel -> PDF renders in place
L.add(SEC_9882,
    "Excel reference file converts to PDF and renders in the viewer in place",
    [
        "Build: Digital Inspection V2, on a reachable QA environment.",
        "An Excel reference file attached to a question from the field's properties panel in the template builder (e.g. 'ZZAUTOTEST-torque-chart.xlsx').",
        "The file is within the stated upload size limit (e.g. under 20 MB).",
        "A work order running that inspection, open on the technician fill screen.",
    ],
    [
        "On the fill screen, open the question that has the Excel reference file.",
        "Select the attached file to open the full-page reference viewer.",
    ],
    [
        "The Excel file opens as a readable full-page document in the viewer, not a blank frame and not an automatic download.",
        "The spreadsheet content is readable without downloading.",
        "Close and Download actions are available in the viewer.",
    ],
    SRC_9882, [Q_WORD_EXCEL, Q_AFTER], MK_9882)

# Case 3 - wide Excel readable, no clipped columns
L.add(SEC_9882,
    "A wide Excel sheet converts to a readable layout without clipping columns",
    [
        "Build: Digital Inspection V2, on a reachable QA environment.",
        "An Excel reference file wider than one page attached from the field's properties panel (e.g. 'ZZAUTOTEST-wide-chart.xlsx' with 20 columns).",
        "A work order running that inspection, open on the technician fill screen.",
    ],
    [
        "On the fill screen, open the question that has the wide Excel reference file.",
        "Select the attached file to open the full-page reference viewer.",
        "Read across to the rightmost columns of the sheet.",
    ],
    [
        "The sheet opens readable in the viewer; the rightmost columns are not cut off at a page edge.",
        "All columns of the sheet can be read in the viewer.",
    ],
    SRC_9882, [Q_WIDE, Q_WORD_EXCEL], MK_9882)

# Case 4 - HEIC and TIFF -> web image render in place
L.add(SEC_9882,
    "HEIC and TIFF reference files convert to a web image and render in place",
    [
        "Build: Digital Inspection V2, on a reachable QA environment.",
        "A HEIC reference file attached to one question from the field's properties panel (e.g. phone photo 'ZZAUTOTEST-procedure.heic').",
        "A TIFF reference file attached to a second question (e.g. 'ZZAUTOTEST-scan.tiff').",
        "A work order running that inspection, open on the technician fill screen.",
    ],
    [
        "On the fill screen, open the question that has the HEIC file and select it to open the full-page viewer.",
        "Note whether the image is shown.",
        "Open the question that has the TIFF file and select it to open the full-page viewer.",
        "Note whether the image is shown.",
    ],
    [
        "The HEIC file displays as an image in the viewer, not a blank frame and not an automatic download.",
        "The TIFF file displays as an image in the viewer, not a blank frame and not an automatic download.",
        "Each image is readable in place, with Close and Download actions available.",
    ],
    SRC_9882, [Q_HEIC_TIFF, Q_AFTER, Q_S11R4], MK_9882)

# Case 5 - download returns the original file (UI-observable: file type/extension)
L.add(SEC_9882,
    "Download returns the original uploaded file, not the converted version",
    [
        "Build: Digital Inspection V2, on a reachable QA environment.",
        "An Excel reference file that renders as a document in the viewer after conversion (e.g. 'ZZAUTOTEST-torque-chart.xlsx').",
        "A HEIC reference file that renders as an image in the viewer after conversion (e.g. 'ZZAUTOTEST-photo.heic').",
        "A work order running that inspection, open on the technician fill screen.",
    ],
    [
        "Open the Excel reference file in the viewer and select Download.",
        "Open the saved download and check its file type (extension).",
        "Open the HEIC reference file in the viewer and select Download.",
        "Open the saved download and check its file type (extension).",
    ],
    [
        "Downloading the Excel attachment saves an Excel spreadsheet file (ending .xlsx, opens in Excel), not a PDF.",
        "Downloading the HEIC attachment saves the original HEIC file, not a converted web image.",
        "The file shown in the viewer is the converted rendering; the file that downloads is the original the author uploaded.",
    ],
    SRC_9882, [Q_ORIGINAL, Q_DL_ORIGINAL], MK_9882)

# Case 6 - corrupt / password-protected falls back to download-only, stays attached
L.add(SEC_9882,
    "Corrupt or password-protected file falls back to download-only",
    [
        "Build: Digital Inspection V2, on a reachable QA environment.",
        "A deliberately corrupt Word or Excel file attached from the field's properties panel (e.g. 'ZZAUTOTEST-corrupt.docx').",
        "A password-protected document attached to a second question (e.g. 'ZZAUTOTEST-locked.xlsx').",
        "A work order running that inspection, open on the technician fill screen.",
    ],
    [
        "In the template builder, confirm each file was accepted and stays attached after upload (not rejected).",
        "On the fill screen, open the question with the corrupt file and select it to open the viewer.",
        "Select Download for the corrupt file.",
        "Open the question with the password-protected file and select it to open the viewer.",
        "Select Download for the password-protected file.",
    ],
    [
        "Each file is accepted and stays attached at upload; neither is rejected.",
        "Opening each file in the viewer shows the download-only fallback state (a message that the file can only be downloaded) rather than a blank frame.",
        "The Download action returns each file.",
    ],
    SRC_9882, [Q_CORRUPT, Q_FAIL_USABLE, Q_S11R9], MK_9882)

L.save("build/gap-fill/di-created-log.json")
