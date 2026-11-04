# Deletion proposal — What/Why masked-money case (for the QA lead's decision)

Prepared 4 Nov 2026. **Nothing has been deleted or changed.** The case is left exactly as it is live; its body is saved in
`before/C154719.json` (live `get_case`, 4 Nov 2026) so it can be restored if deleted.

| C-id | Link | Title (live) | Section | Created | Last edited |
|---|---|---|---|---|---|
| C154719 | https://shopview.testrail.io/index.php?/cases/view/154719 | The report hides money but not line text from a user without financial access | What/Why → Story 3 (20463) | 30 Sep 2026 by Bilal Muzamil (user 3, the shared account our sessions write under) | 28 Oct 2026 11:56 UTC, same account (the build-verification session) |

- Refs: SV-10132. Automation status: 1 (Not Automated), so Rule 71 / tell-Vlad does not apply.
- Live marker: `AUTOMATION: HOLD - cannot be set up on staging: Settings will not give a role Invoicing & payments without also switching on See Financial Data`.
- It tests PRD v17 S3-R10: *"For a user who cannot see financial data, the downloaded report masks its money columns (rate, amount, tax
  and average cost) as it does today. The line text is not a money value and is not masked, so the same words reach every reader of the file."*

**Why delete:** Chris Ward, What/Why Doc answer 17 (read 4 Nov 2026), word for word: *"The case can't be set up from Settings. Invoicing &
payments always comes with See Financial Data, so no user can download the Customer Invoice report without seeing financial data. S3-R10
stays as a safety net for any older role set up before that rule. Please skip the masked case. Not a defect."* A manual tester cannot
create the precondition, so the case can never run (Rules 114, 137); S3-R10 remains in the PRD, so it should be recorded in the suite's
requirement map as "not testable by hand, PO said skip (answer 17)" rather than silently dropped.

**Options:** (A) delete C154719 (snapshot kept here); (B) keep it held with its present marker. Asked of the QA lead; no action until he answers.
Not in any run: the What/Why run 553 no longer exists in TestRail.
