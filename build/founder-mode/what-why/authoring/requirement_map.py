"""Requirement map inputs that are not cases (build.py merges them with the cases and writes ../REQUIREMENT-MAP.json). Every one of the
41 PRD v15 codes must end up in exactly one of: covered by a case, NO_MANUAL (with the reason, L-14), OTHER_STORY (covered by a case in
another story's section, named), or PENDING (its story's module is not written yet).

NO_MANUAL: a behaviour a manual tester cannot set up or reach. It is listed for the developers' own checks and reported to the QA lead;
it never becomes a manual case. PART_MANUAL: a code a case covers, but one of whose sentences a manual tester cannot reach (said here so
the coverage record is honest)."""

NO_MANUAL = {}
PART_MANUAL = {
    "S3-R8a": "Covered by S3-25 (report: =, +, - and @) and S3-26 (QuickBooks: no apostrophe). A line starting with a tab or a carriage "
              "return cannot be typed as a Title by hand; developers' check.",
    "S4-R8": "Covered by S4-09 (an empty *Line Title on a Labor row). \"Rows that need no title (shop supplies, misc and credit memo rows) "
             "are unaffected\" is today's behaviour and is not tested separately.",
    "S3-R6a": "Covered in both states (on: S3-01, S3-03, S3-06, S3-11, S3-12; off: S3-02, S3-04, S3-05 ...). Not by hand: the default "
              "for a shop created since June 2025 (a manual tester cannot create a new shop); developers' check.",
    "S3-R4": "Covered by S3-03 and S3-14 (the same line on both routes) and S3-23 (an old invoice). \"Built at the same moment\" is "
             "approached by downloading the report right after the sync; the builder being one piece of code is the developers' check "
             "(tech plan: InvoiceCreateSyncServiceTest).",
    "S3-R11": "Covered by S3-08 over every report the Export Reports dialog lists. Reports or exports outside that dialog are the "
              "developers' check (tech plan FR-010: nothing else reads the text).",
    "S3-R7": "Covered on both routes (S3-05, S3-13 report; S3-14 QuickBooks). \"Today only the live sync cuts ... the report has no cut "
             "at all\" describes the old build and is not re-tested.",
    "PRE-S3-3": "S3-18 checks the download is refused without Invoicing & payments - View; that the refusal comes from the server and "
                "not the screen is the developers' check.",
}
# Words the PRD quotes in a requirement line that a written story's cases must use word for word (build.py's messages gate),
# except these, which are not words a tester sees on a screen in this feature:
NOT_SCREEN_WORDS = {
    "What are you doing?: ": "S3-R8a names the old line's start to explain the guard; S3-09 and S3-17 check old invoices start with it",
    "X is a required field": "the PRD's name for the app-wide message form, not a message",
}
OTHER_STORY = {}
