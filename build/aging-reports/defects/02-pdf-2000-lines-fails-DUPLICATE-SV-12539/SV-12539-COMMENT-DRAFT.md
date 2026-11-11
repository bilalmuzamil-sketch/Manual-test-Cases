# Draft comment for SV-12539 — HELD (Jira write; needs the QA lead's own yes, Rule 62). Not posted.

```
The same failure also happens at exactly *2,000 rows*, which the PRD allows (S3-N1: "Exactly 2,000 rows is allowed.").

# On https://sv11315.qa.shopview.com open *Reports* → *A/P Aging Detail*, *As of* 11/11/2026.
# In *Vendor*, tick *Fate Roadside Truck Repair*, *New Castle Diesel Performance* and *Grand Haven Diesel Services LLC* (715 + 707 + 578 = 2,000 lines on 11 Nov 2026).
# *⋯* → *Download (CSV)*: downloads, 2,000 document rows.
# *⋯* → *Download (PDF)*.
#* After about 32 seconds: "We couldn't export this report. Please try again." No file.

Also seen at 1,783 rows (all vendors, *As of* 04/01/2025), twice. A 444-row PDF (*As of* 02/01/2025) downloads fine, and 2,001 rows is refused at once with the correct "too large for PDF" message.

!SV-12539-2000-rows-no-pdf.png|width=1000!
```

Picture: `build/aging-reports/exec/pics/C715469-4-no-pdf.png` (annotated; banner "Step 4: Download (PDF) at exactly 2,000 lines - no file after 4 minutes").
Caveat: no picture yet of the on-screen error message at 2,000 rows (the other session's p48b re-run; `exec/p48b/` did not exist when this was written). The 1,783-row run recorded the message text at ~31.5 s (`exec/p47.log`).
