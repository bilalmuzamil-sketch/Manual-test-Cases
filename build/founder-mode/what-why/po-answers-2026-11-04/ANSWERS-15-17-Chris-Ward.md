# What/Why — Chris Ward's answers to Doc questions 15-17, read 4 Nov 2026

Doc https://docs.google.com/document/d/1QcT7FRZci6AhYcI33HUac-Oob03-gCnCOKn2NFHMLjA (questions 15-17 were posted on 28 Oct 2026 by the build-verification session). Word for word:

**15.** Yes, keep the "Line Approved" tick box as it is today. It's an existing control that shows when "Require Approval for New Lines" is on, and S1-R7 keeps everything else in the dialog unchanged. The design just doesn't draw it. Not a defect.

**16.** No clear (x) button. A picked canned line is emptied the way it is today, by deleting its text in the Title box (Backspace). The picker is then empty again and the label still reads "Title" (S1-R4). An (x) would be a new control, and S1-R7 keeps the dialog as it is. Please test that deleting the text empties the picker.

**17.** The case can't be set up from Settings. Invoicing & payments always comes with See Financial Data, so no user can download the Customer Invoice report without seeing financial data. S3-R10 stays as a safety net for any older role set up before that rule. Please skip the masked case. Not a defect.
