#!/usr/bin/env python3
"""Data for the cross-project QA pre-emptive answers register (2026-07-31).

ONE source of truth for both deliverables. `gen_preemptive_register.py` reads this
module and emits ANTICIPATED-QUESTIONS-AND-ANSWERS.md + .xlsx.

Per-row schema (Standing Rule 16 - fixed, do not reorder):
  n            - row number (assigned by the generator, in list order)
  project      - Report Suite | Schedule | Filters | Cross-project
  category     - one of CATEGORIES keys (A..G)
  say          - the sentence a QA might actually post in a channel
  answer       - paste-ready reply, plain layman English (Rule 7), 1-3 sentences
  evidence     - document + VERSION + anchor + date, verbatim quote where it turns on
                 wording (Rules 25/31); "NOT ESTABLISHED" where we could not find it
  cases        - list of (internal_id, cid_or_None) tuples, or the string reason when
                 there is deliberately no case (Rule 8: never a bare internal ID)
  closer       - who can close it
  status       - SETTLED | AWAITING ANSWER | AWAITING LIVE BUILD | SCHEDULED | ACCEPTED
  risk         - LOW | MEDIUM | HIGH  (honest: HIGH = we would concede something)
"""

CATEGORIES = {
    "A": "Spec contradicts itself - we did not pick a side silently",
    "B": "Case follows a PO ruling that is not (yet) in the spec",
    "C": "Deliberately not authored, for a stated reason",
    "D": "Left open on purpose - awaiting an answer",
    "E": "Left open on purpose - awaiting a live observation",
    "F": "Someone else's case disagrees with ours",
    "G": "Known imperfection, accepted or scheduled",
}

TR = "https://shopview.testrail.io/index.php?/cases/view/"

# Counts used in the headline text, all verified 2026-07-31 from the id-maps + PROJECT-STATEs.
COUNTS = {
    "Report Suite": {"ours": 474, "live": 479, "run": "359", "run_tests": 474,
                     "run_results": 539, "retired_note": "515 authored -> 474 active"},
    "Schedule": {"ours": 165, "live": 165, "run": "357", "run_tests": 165,
                 "run_results": 429, "retired_note": "192 authored -> 165 active / 27 retired"},
    "Filters": {"ours": 110, "live": 110, "run": "352", "run_tests": 110,
                "run_results": 395, "retired_note": "146 authored -> 110 active / 36 retired"},
}

ROWS = [

    # ==================================================================== #
    # REPORT SUITE                                                         #
    # ==================================================================== #

    # ---- A -----------------------------------------------------------
    dict(
        project="Report Suite", category="A",
        say="The Sales By Representative spec lists the CSV headers as a fixed set with no "
            "Location column, but your cases now expect a Location column. Which is it?",
        answer="The same spec document says both things, and we follow the newer line. "
               "S14-R20 was added on 29 July and says the Location column goes into all four "
               "downloads; the older header lists were written on 11 July and were never "
               "updated. We have asked Chris to tidy the older lines.",
        evidence="SBR spec, Confluence pageId 585629698, v15, updated 2026-07-29 by Chris Ward. "
                 "S14-R20 verbatim: \"Whenever the Location column is shown on screen (S21-R7), "
                 "it is included in all four exports in the same position it occupies on screen\". "
                 "S14-R15 / S14-R16 still enumerate their header lists \"in order\" without it "
                 "(text dates from the 2026-07-11 \"Exports hardened\" change). Analysis: "
                 "build/contradiction-analysis-2026-07-31/SBR-CSV-LOCATION.md.",
        cases=[("SBR-EXP-10", 30285), ("SBR-EXP-11", 30286)],
        closer="Chris Ward (the spec tidy). The test cases are already settled.",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Report Suite", category="A",
        say="Why is there no test case for the report logo, when Chris said all six reports "
            "use the same logo treatment?",
        answer="Because the six specs contradict each other on it, so we would be guessing. "
               "Technician Utilization says the built-in ShopView logo always; Sales By Customer "
               "has a three-step chain that can end with no logo at all; Parts Velocity has no "
               "logo rule. We flagged it for Chris instead of inventing an answer.",
        evidence="TU spec v5, SBC spec v12 S15-R17, PV spec v4 (no logo requirement) - all "
                 "captured 2026-07-31 in build/report-suite/spec-current-2026-07-31/. Chris "
                 "Ward group message 2026-07-29 promised \"same logo treatment all reports\". "
                 "Recorded in build/report-suite/chris-answers-2026-07-31/DELTAS.md, "
                 "\"Spec-text corrections Chris still owes\" item 8, and in "
                 "coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md section 8 item 1.",
        cases="no suite-wide logo case - deliberate (Standing Rule 15: spec inconsistent, "
              "flagged, never silently resolved). The existing per-report export-header cases "
              "were left unchanged.",
        closer="Chris Ward",
        status="AWAITING ANSWER", risk="LOW",
    ),

    # ---- B -----------------------------------------------------------
    dict(
        project="Report Suite", category="B",
        say="These three Sales By Customer permission cases will fail on the build we have. "
            "They are wrong.",
        answer="They fail on purpose, and the failure is the report. Chris ruled twice that "
               "every report opens for anyone with ordinary reports access, but the build gives "
               "Sales By Customer its own separate permission. Each of the three cases carries a "
               "plain note telling the tester this is a known pending build change, not a case "
               "defect.",
        evidence="Chris Ward, 2026-07-31, verbatim: \"A - the intention is to not hide these "
                 "from normal reports access. These were specced before CRP was built :)\". Said "
                 "the same on 2026-07-28: \"B -- these should be gated by normal reports "
                 "access\". Against that: SBC spec v12 (2026-07-29) S1-R2 verbatim - \"The "
                 "report is gated by a dedicated Sales By Customer report View permission - it "
                 "is not tied to a generic 'all reports' permission\" - and the engineering tech "
                 "plan section B5.3 (atom ROLE_SALES_BY_CUSTOMER_REPORT::VIEW). Dev-facing note "
                 "ready to send: build/report-suite/chris-answers-2026-07-31/"
                 "Q4-permission-dev-note-2026-07-31.md.",
        cases=[("SBC-PERM-01", 30098), ("SBC-PERM-02", 30099), ("SBC-NAV-01", 30096)],
        closer="Engineering (change the build, ticket against SV-8582) + Chris Ward (fix S1-R2).",
        status="SETTLED", risk="MEDIUM",
    ),
    dict(
        project="Report Suite", category="B",
        say="The Work In Progress cases identify assets by VIN first, but the WIP spec puts the "
            "unit number first. Your cases are out of date.",
        answer="It is the spec that is behind, not the cases. On 29 July Chris ruled that VIN, "
               "then unit number, then plate is the standard for every report including WIP, and "
               "he told us he had already edited the spec - he had not. His answer is the newer "
               "source, so it wins.",
        evidence="Chris Ward, 2026-07-29, verbatim: \"A is the correct answer\", with the "
                 "standing note \"Not just for these specs though -- really good to keep this in "
                 "mind for all actions moving forward\" - "
                 "build/report-suite/chris-update-2026-07-29/"
                 "wip-identifier-answer-2026-07-29.md. Live WIP spec v6 (2026-07-29) still "
                 "unit-number-first at section 4, S4-R7, S4-R8, S4-R9, S7-R4 - re-verified "
                 "2026-07-31, build/report-suite/SPEC-WATCH-2026-07-28.md item 1b, \"He believed "
                 "he had made this edit; he had not.\"",
        cases=[("WIP-COL-05", 30470), ("WIP-FLT-03", 30500), ("WIP-SORT-03", 30485),
               ("WIP-EXP-07", 30516)],
        closer="Chris Ward (the spec edit). The cases are settled.",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Report Suite", category="B",
        say="Four specs say a one-location user still sees the location dropdown, but your cases "
            "say it is hidden.",
        answer="Chris ruled on 31 July that it is hidden for a one-location user, and that is "
               "newer than the spec text. The four spec notes still say the opposite and he owes "
               "us that correction.",
        evidence="Chris Ward, 2026-07-31, answer Q1 = A (hidden) - "
                 "build/report-suite/chris-answers-2026-07-31/answers-ingested.md. Spec text "
                 "still contradicting: SBR v15 S21-N1, TU v5 S9-N1, IV v3 S7-N1, PV v4 S2-E4 "
                 "(\"still sees the filter\") - build/report-suite/SPEC-WATCH-2026-07-28.md "
                 "item 4, verdict \"CONTRADICTED in spec text ... but Chris's Q1 answer "
                 "2026-07-31 = A (hidden), which WINS\".",
        cases=[("SBR-LOC-05", 38913), ("TU-LOC-06", 38915), ("IV-LOC-06", 38917),
               ("PV-FILT-14", 38914)],
        closer="Chris Ward (spec text). Cases settled.",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Report Suite", category="B",
        say="Your case says pressing Escape does NOT close the deactivate pop-up, but the spec "
            "says Escape dismisses it.",
        answer="Chris chose the app's house rule over his own spec line. Asked directly on "
               "28 July whether Escape should close that pop-up, he answered B - no. The spec "
               "line S13-R8 is the one that needs fixing.",
        evidence="Chris Ward, 2026-07-28, answer to Q1 verbatim: \"B.\" (option B read \"No - "
                 "pressing \\\"Esc\\\" should NOT close it (matches the app's general house "
                 "rule); use only the Cancel and X buttons\") - "
                 "build/report-suite/chris-answers-2026-07-28/answers-ingested.md. SBR spec v15 "
                 "S13-R8 still says Esc dismisses. Case body verified live-consistent "
                 "2026-07-31: expected 3 reads \"Pressing the \\\"Esc\\\" key does NOT close it\".",
        cases=[("SBR-DEACT-04", 30255)],
        closer="Nobody - this is settled. Chris owes only the spec tidy.",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Report Suite", category="B",
        say="Half the specs say \"Sales Rep\" and your cases say \"Sales Representative\".",
        answer="Chris ruled on 31 July that the full word is used everywhere - his words were "
               "that \"Rep\" is too much slang. 24 cases follow that; his spec text has not "
               "caught up yet.",
        evidence="Chris Ward, 2026-07-31, answer Q5 = A (full word everywhere; \"Rep is too much "
                 "slang\") - build/report-suite/chris-answers-2026-07-31/answers-ingested.md and "
                 "DELTAS.md D5 (24 cases). Spec still short-form: SBR v15 S19-R7 - "
                 "SPEC-WATCH-2026-07-28.md item 9, \"STILL-MISSING\".",
        cases=[("SBR-EXP-10", 30285), ("SBR-EXP-11", 30286), ("SBR-DEACT-06", 30257)],
        closer="Chris Ward (spec text). Cases settled.",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Report Suite", category="B",
        say="Only three of the six specs mention the \"too large to export\" message, and they "
            "word it three different ways - so how can all six of your cases quote one string?",
        answer="Because Chris ruled one message for the whole suite on 31 July and explicitly "
               "retired the Sales By Customer variant. All six of our cap cases quote the ruled "
               "wording. Three spec pages still need his edit.",
        evidence="Chris Ward, 2026-07-31, answer Q2 = A - one suite-wide message: \"This report "
                 "is too large to export. Narrow the date range or filters, then try again.\" "
                 "Spec state: SBC v12 S14-R16 / S15-R25 carry the old variant; SBR v15 S14-E2 a "
                 "third wording; PV, TU and WIP carry no cap line at all - "
                 "coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md section 8 item 1.",
        cases="the six per-report export-cap cases, all already quoting the ruled string - "
              "no case change was needed (recorded in COVERAGE-REDERIVATION.md section 8).",
        closer="Chris Ward (spec text on six pages). Cases settled.",
        status="SETTLED", risk="LOW",
    ),

    # ---- C -----------------------------------------------------------
    dict(
        project="Report Suite", category="C",
        say="You deleted 57 test cases. What coverage did we lose?",
        answer="None. Those were the same check written two or three times, plus six that could "
               "not fail informatively. Every deletion has a written reason and a named survivor "
               "case, and the whole 515-case suite was scored one by one before anything was "
               "removed.",
        evidence="build/report-suite/quality-audit-2026-07-28/ - USEFULNESS-AUDIT-2026-07-28.md, "
                 "MERGE-PLAN.md (approvable per group, 41 merge groups), per-case-verdicts.csv "
                 "(all 515 cases, both a usefulness and a sense verdict each). Executed under "
                 "the user's \"Push ALL\" authorization 2026-07-28: 70 update / 1 add / 57 "
                 "delete, all HTTP 200 + verified - "
                 "reconciliation-2026-07-28/testrail-execution-log-2026-07-28.md.",
        cases="57 retired cases - deliberate. Survivors named per group in MERGE-PLAN.md.",
        closer="Nobody, this is settled (user-authorized).",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Report Suite", category="C",
        say="There are requirements in the specs with no test case at all.",
        answer="Seven, and each has a written reason. Four were deliberately cut in the 28 July "
               "audit because a tester cannot run them - for example one whose expected result is "
               "\"nothing happens\", and one that asks a human to spot an 8-pixel font change "
               "inside a PDF. Three are not requirements about the product at all.",
        evidence="build/report-suite/coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md "
                 "section 5, verbatim per item. Cut by the audit: SBC S10-N1, SBR S11-N1, SBR "
                 "S14-R14, PV S4-N1. Not independently testable: SBC S20-N1 (\"No applicable "
                 "user-visible negative cases\"), PV S3-R1 (a pointer), PV S7-R7 (\"this spec is "
                 "the source of truth for this report\"). 895 requirements enumerated; 888 "
                 "covered; 0 stale or invented anchors.",
        cases="no case - deliberate, 7 requirements, each with the reason in section 5.",
        closer="Nobody, this is settled.",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Report Suite", category="C",
        say="Why does one Parts Velocity case cite QuickBooks when QuickBooks is in none of the "
            "six report specs?",
        answer="Because it comes from a Jira story, not from a report spec, and the case says so. "
               "It covers a real precision gap - a part-of-a-unit quantity must not be rounded on "
               "the way to QuickBooks.",
        evidence="build/report-suite/coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md "
                 "section 7: \"PV-PREC-02 is a case with no report-spec requirement at all "
                 "(QuickBooks is in no report spec - its ref cites SV-8589 + the tech plan and "
                 "says so), which is a ticket-driven case, not a coverage gap.\" Driver: "
                 "SV-8589, found In Progress by the 2026-07-31 epic check "
                 "(build/epic-recheck-2026-07-31/REPORT-SUITE-EPIC-DELTA.md).",
        cases=[("PV-PREC-01", 38924), ("PV-PREC-02", 38925)],
        closer="Nobody, this is settled.",
        status="SETTLED", risk="LOW",
    ),

    # ---- D -----------------------------------------------------------
    dict(
        project="Report Suite", category="D",
        say="Chris said everything uses normal reports access - so why do your other five reports "
            "still each name a different permission?",
        answer="Because he was only asked about Sales By Customer, and we will not guess the rest. "
               "The other five each use an existing reports permission, which already matches what "
               "he said he wants; whether he wants all five collapsed into one single Reports "
               "permission is a question we have queued for him, and those cases are untouched "
               "meanwhile.",
        evidence="build/report-suite/chris-answers-2026-07-31/DELTAS.md, \"STILL-AMBIGUOUS\" item "
                 "A1, verbatim: \"whether he wants all five collapsed into one single Reports "
                 "permission is not something he was asked and not something we will infer. Cases "
                 "for those five are left unchanged; question queued.\" Also flagged in the "
                 "dev-facing note Q4-permission-dev-note-2026-07-31.md, closing section.",
        cases="the five reports' permission cases, deliberately unchanged - e.g. "
              f"SBR-PERM-01 = C30198 ({TR}30198), WIP-PERM-02 = C30527 ({TR}30527).",
        closer="Chris Ward",
        status="AWAITING ANSWER", risk="LOW",
    ),
    dict(
        project="Report Suite", category="D",
        say="If \"Sales Rep\" becomes \"Sales Representative\", why does one CSV column still say "
            "\"Rep is active?\"",
        answer="Because Chris did not name that one, and we do not extend a label ruling by "
               "guessing. His principle would probably make it \"Representative is active?\", but "
               "he only named the work-order selector, the download file and the \"Sales Rep\" "
               "column. It is queued as a question.",
        evidence="build/report-suite/chris-answers-2026-07-31/DELTAS.md, \"STILL-AMBIGUOUS\" item "
                 "A2: the second short-form header is \"Rep is active?\" (SBR spec v15 S15-R4 / "
                 "S15-R6); \"he did not name it. Left as-is ... question queued.\"",
        cases=[("SBR-ASGN-02", 30293), ("SBR-ASGN-05", 30296), ("SBR-DEACT-06", 30257)],
        closer="Chris Ward",
        status="AWAITING ANSWER", risk="LOW",
    ),

    # ---- E -----------------------------------------------------------
    dict(
        project="Report Suite", category="E",
        say="474 Report Suite cases and not one of them has been run. What have you actually "
            "verified?",
        answer="Nothing against a running build, and we say so on every document rather than "
               "implying otherwise. There is no Report Suite test environment for us to log in "
               "to - we know the branch name but have no URL and no confirmation the reports are "
               "switched on. Everything so far is checked against the specs, the epic, the tech "
               "plan and Chris's answers.",
        evidence="build/OUTSTANDING-ITEMS-REGISTER.md section 1, first row (outstanding since "
                 "2026-07-22, branch project/reports-suite-bravo, no URL). Honesty statements in "
                 "coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md (\"Nothing in this "
                 "pass is live-verified\") and build/LESSONS-2026-07-31.md framing note. "
                 "Standing Rules 12 and 22.",
        cases="all 474 active cases are VIU-Pending - "
              "build/report-suite/testrail-id-map.csv (474 rows, 0 blanks).",
        closer="You / engineering - the environment plus fresh cookies plus the flag state.",
        status="AWAITING LIVE BUILD", risk="HIGH",
    ),
    dict(
        project="Report Suite", category="E",
        say="Is the Location column actually offered in the Work In Progress column picker or not? "
            "Your case and Vladimir's case disagree.",
        answer="Our case follows the current spec, which says three times over that it is not "
               "offered there. His automated case toggles it on, and his title says \"exactly as "
               "shipped\" - so the build may not have caught up with the 29 July spec change. One "
               "look at the picker settles it, and it needs the test environment.",
        evidence="WIP spec v6, 2026-07-29T06:33:58Z. S4-R3 verbatim: \"The Location column is not "
                 "offered in the column selector\". S7-R13: \"the user does not toggle it in the "
                 "column selector\". Section 3 Key Decision: \"The per-row Location column is "
                 "automatic, not a manual toggle.\" His C38922 step 3: \"Toggle Location ON in the "
                 "Column Selection menu and download again.\" Analysis: "
                 "build/contradiction-analysis-2026-07-31/SBR-CSV-LOCATION.md Part 2.",
        cases=[("WIP-FLT-09", 38916), ("WIP-COL-01", 30466), ("WIP-COL-02", 30467)],
        closer="Us, once a QA branch exists. If the build still allows the toggle it is a "
               "build-conformance finding, not an edit to either case.",
        status="AWAITING LIVE BUILD", risk="MEDIUM",
    ),
    dict(
        project="Report Suite", category="E",
        say="Some expected results just say \"confirmed in the build\" - that is not a test.",
        answer="That is deliberate honesty where the spec does not pin an exact word or position. "
               "We will not invent an on-screen label, so those few points are marked to be "
               "confirmed live and then written down exactly as the build shows them.",
        evidence="Standing Rule 9 (never invent a build label) with Rule 12. Named examples: "
                 "TU-COL-01's accessible-name wording \"deliberately left as 'confirmed in the "
                 "build' - the spec does not state it\" and SBC-EXP-16's Location position "
                 "\"(position VIU-confirm - no Date column in this file)\" - "
                 "coverage-rederivation-2026-07-31/AUTHORING-COVERAGE.md section 2 and "
                 "RULE28-AUDIT.md item 3.",
        cases=[("TU-COL-01", 38859), ("SBC-EXP-16", 38856)],
        closer="Us, once a QA branch exists.",
        status="AWAITING LIVE BUILD", risk="LOW",
    ),
    dict(
        project="Report Suite", category="E",
        say="What is the renamed assignments download actually called?",
        answer="We do not know yet and we refused to write a made-up file name. We recorded the "
               "expected name and flagged it to be read off the real download.",
        evidence="build/report-suite/chris-answers-2026-07-31/DELTAS.md, \"STILL-AMBIGUOUS\" item "
                 "A3: \"We record the expected sales-representative-assignments.csv but flag it "
                 "for live confirmation rather than assert an invented build string (Rule 9).\"",
        cases=[("SBR-ASGN-02", 30293)],
        closer="Us, once a QA branch exists (or Chris Ward can just tell us).",
        status="AWAITING LIVE BUILD", risk="LOW",
    ),

    # ---- F -----------------------------------------------------------
    dict(
        project="Report Suite", category="F",
        say="An automation case says the SBR CSVs carry a Location column and your cases say the "
            "headers are \"exactly\" a list without it. One of you is wrong.",
        answer="He was right and we were wrong - against our own spec. His case had no references "
               "at all, which is exactly what we could have used to wave it away, and instead it "
               "exposed the same gap on four reports. Both of our cases are now fixed and the "
               "other three reports were brought up with them.",
        evidence="His C38923, created by Vladimir Tomovic 2026-07-30 15:54 UTC, no refs, no "
                 "expected results - build/testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md. "
                 "Our stale text, verbatim: \"The headers, in order, are exactly: Sales "
                 "Representative, # Invoices, ...\". Governing requirement SBR v15 S14-R20 "
                 "(2026-07-29). Fixed and pushed 2026-07-31: 33 update_case, all HTTP 200 + "
                 "re-GET verified - coverage-rederivation-2026-07-31/"
                 "testrail-execution-log-2026-07-31.md ops 20 and 21. This is why Standing Rule "
                 "44 now exists (build/LESSONS-2026-07-31.md section 1.5).",
        cases=[("SBR-EXP-10", 30285), ("SBR-EXP-11", 30286), ("PV-EXP-02", 30376),
               ("TU-EXP-04", 30437), ("IV-EXP-02", 30588)],
        closer="Nobody - closed. His case stays untouched (Standing Rule 38).",
        status="SETTLED", risk="MEDIUM",
    ),
    dict(
        project="Report Suite", category="F",
        say="Vladimir's automated cases duplicate ours. One set should go.",
        answer="Two of his five do overlap ours, one bundles two of ours into a single automated "
               "run, and two add genuinely new coverage. We have written the evidence up "
               "case-by-case but we do not touch anyone else's cases and we do not decide this - "
               "it is a conversation between you and Vladimir.",
        evidence="build/testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md section 4: DUPLICATE "
                 "C38920 (of PV-FILT-14 = C38914) and C38922 (of WIP-EXP-02 = C30511 + WIP-EXP-07 "
                 "= C30516); AUTOMATED EQUIVALENT C38919 (of TU-COL-01 = C38859 + TU-EXP-04 = "
                 "C30437); NEW COVERAGE C38921 and C38923. All five created 2026-07-30, all "
                 "Automated, all with no References, and none is in any run. Standing Rule 38.",
        cases=[("PV-FILT-14", 38914), ("WIP-EXP-02", 30511), ("WIP-EXP-07", 30516),
               ("TU-COL-01", 38859), ("TU-EXP-04", 30437)],
        closer="You + Vladimir Tomovic. Your ruling of 2026-07-31 was: do not message him.",
        status="ACCEPTED", risk="LOW",
    ),
    dict(
        project="Report Suite", category="F",
        say="TestRail shows 479 cases in the Reports Suite folder but you keep saying 474.",
        answer="474 are ours and 5 are Vladimir's automation cases. We count only our own and we "
               "never touch his, so the honest phrasing is \"ours 474, live total 479\".",
        evidence="build/testrail-foreign-cases-2026-07-31/FOREIGN-CASES.md section 3, live read "
                 "2026-07-31: group 4281 live total 479 = ours 474 + foreign 5 (C38919-C38923, "
                 "all created by TestRail user 1 = Vladimir Tomovic; we are user 3). Filters "
                 "(4110) and Schedule (4254) are 100% ours. Standing Rule 38.",
        cases="the 5 foreign cases are named for the record only - C38919, C38920, C38921, "
              "C38922, C38923. Never edited.",
        closer="Nobody, this is settled.",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Report Suite", category="F",
        say="Stefan said maybe only 200 of the 500-odd cases are useful and some just do not make "
            "sense.",
        answer="We took that seriously and scored every single case, not a sample. 11% were "
               "genuine waste and we consolidated them; 0.4% genuinely did not make sense and we "
               "had already flagged both of those ourselves. Where he is fair is regression value "
               "- about 350 carry repeat value and the rest are one-time acceptance checks, and "
               "every case is now tagged that way.",
        evidence="build/report-suite/quality-audit-2026-07-28/ - USEFULNESS-AUDIT-2026-07-28.md, "
                 "SENSE-CHECK-2026-07-28.md, per-case-verdicts.csv (all 515, both verdict sets, "
                 "with C-ids and links), EXEC-NOTE-for-Stefan.md (paste-ready). Standing Rule 28 "
                 "now makes this three-dimension audit a permanent gate on every authoring pass.",
        cases="all 515 scored; 56 identified as waste (6 deleted outright + 50 folded into "
              "survivors); 2 nonsense, both already on the delete list.",
        closer="Nobody - answered. Re-run the audit on demand for any suite.",
        status="SETTLED", risk="MEDIUM",
    ),

    # ---- G -----------------------------------------------------------
    dict(
        project="Report Suite", category="G",
        say="Six of the spec-watch items are still not in the specs. Are you just going to ignore "
            "that?",
        answer="No - the watch stays open and we chase them. The changelog Chris promised did "
               "land on all six pages on 29 July, but items 1b, 4, 6, 8, 9, 10 and 11 still need "
               "spec text, and two of them now actively contradict rulings he gave us afterwards. "
               "Our cases follow his rulings meanwhile.",
        evidence="build/report-suite/SPEC-WATCH-2026-07-28.md, re-diff run 2026-07-31: SBC "
                 "v11->v12, SBR v14->v15, PV v3->v4, TU v4->v5, WIP v5->v6, IV v2->v3, all "
                 "2026-07-29, each with a new dated Change Log row. \"DEADLINE 2026-08-04 - "
                 "verdict: partly met ... the watch CANNOT retire.\" Capture pipeline validated "
                 "6/6 byte-identical against the prior versions, so every difference is a real "
                 "Chris edit.",
        cases="no case is blocked - all follow his rulings (Rule 32 latest-wins).",
        closer="Chris Ward.",
        status="SCHEDULED", risk="MEDIUM",
    ),
    dict(
        project="Report Suite", category="G",
        say="Six engineering stories in the epic were reopened. Did you re-do the coverage?",
        answer="Yes. Six stories we had written off as superseded were reopened on 29 July, so "
               "their content is live engineering truth again. We re-read them, found one real "
               "coverage gap - the QuickBooks part-of-a-unit precision - and wrote two cases for "
               "it. Nothing else needed a change because none of the descriptions changed, only "
               "the statuses.",
        evidence="build/epic-recheck-2026-07-31/REPORT-SUITE-EPIC-DELTA.md: 97/97 children, 0 new, "
                 "0 removed, 7 status changes (6 OBSOLETE->Open on 2026-07-29, 1 Open->In "
                 "Progress). Verbatim honesty note: \"the reopening was a board/status action "
                 "only. No description text changed on any of the 7 stories\". Gap closed by "
                 "PV-PREC-01 / PV-PREC-02.",
        cases=[("PV-PREC-01", 38924), ("PV-PREC-02", 38925)],
        closer="Nobody, this is settled.",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Report Suite", category="G",
        say="Are there really no designs for these reports? How can you test the look and feel?",
        answer="There are none - zero attachments on the epic and on all 97 stories, and no Figma "
               "file. We test the look and feel from the spec wording plus Chris's walkthrough "
               "video, and anything neither of those pins down is marked to be read off the build.",
        evidence="build/report-suite/PROJECT-STATE.md (spec-only authoring) and "
                 "build/OUTSTANDING-ITEMS-REGISTER.md section 1, designs row: \"0 attachments on "
                 "the epic and all 97 stories, no Figma\". Chris Ward 2026-07-28, answer Q3 "
                 "verbatim: \"B -- currently the best is my kickoff video that's pinned in the "
                 "chat ... I'm going to film a much more condensed click-through tonight\" - the "
                 "condensed video arrived 2026-07-30 and was ingested.",
        cases="the Visual Conformance cases per report - e.g. "
              f"SBC-VIS-01 = C30185 ({TR}30185), WIP-VIS-01 = C30519 ({TR}30519).",
        closer="Chris Ward, to confirm none exist so we stop treating it as a gap.",
        status="ACCEPTED", risk="LOW",
    ),

    # ==================================================================== #
    # SCHEDULE                                                             #
    # ==================================================================== #

    # ---- A -----------------------------------------------------------
    dict(
        project="Schedule", category="A",
        say="Does a multi-day job skip shop closure days or not? Your case says it does not, but "
            "the spec says closures block the spread.",
        answer="The spec says both, in two different sections, and we follow the newer one - "
               "closures are not skipped in the first release. We flagged the older sentence for "
               "Branko and we did not author a case for the other reading.",
        evidence="Schedule spec, Confluence pageId 713031682, version 23, 2026-07-30T10:40:32Z. "
                 "Section 4.5 verbatim: \"Shop closures and public holidays are not skipped in "
                 "V1..\" (added in Confluence v22). Section 12 verbatim, untouched v18-era text: "
                 "\"Shop closures (holidays, inventory days) are defined at the shop level and "
                 "block the spread step from placing shifts on those days.\" Both live in v23 - "
                 "build/schedule/coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md "
                 "section 6 flag F1.",
        cases=[("SCH-EDGE-05", 30089), ("SCH-SPREAD-07", 29983), ("SCH-SPREAD-08", 29984),
               ("SCH-SPREAD-11", 38863)],
        closer="Branko (question NQ-1, on the sheet that is written and not yet sent).",
        status="AWAITING ANSWER", risk="LOW",
    ),

    # ---- B -----------------------------------------------------------
    dict(
        project="Schedule", category="B",
        say="The spec says the shift pop-up lists the lines with labour and total figures, but "
            "your case says no money appears there at all.",
        answer="Branko ruled there is no money in the shift pop-up, and that ruling outranks the "
               "older spec sentence. Two independent sources back him - the ratified design and "
               "the engineering plan, which says no pricing in any Schedule response.",
        evidence="Branko, 2026-07-22 answer Q3 (no money in the shift pop-up). Live spec v23 "
                 "section 4.9 still reads \"with labor/total figures\". Corroborated by the "
                 "Claude design section 4c and the tech plan D6 / NFR-002 \"no pricing in "
                 "Schedule responses\" - build/schedule/coverage-rederivation-2026-07-31/"
                 "COVERAGE-REDERIVATION.md section 6 flag F2, resolved under Standing Rule 33.",
        cases=[("SCH-MODAL-04", 30011), ("SCH-API-03", 38874)],
        closer="Branko (spec tidy). Cases settled.",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Schedule", category="B",
        say="The permissions section of the spec mentions a right-click context menu, but your "
            "cases only use left-click.",
        answer="Branko ruled on 31 July that there is no right-click, only left-click, and the "
               "rest of the spec was already rewritten that way in an earlier version. Only the "
               "permissions section still carries the old wording.",
        evidence="Branko, 2026-07-31, verbatim: \"C. there is no right click, only left click. "
                 "when clicked it opens dropdown menu with two options (Create event, New work "
                 "order) as mentioned in prd.\" - build/schedule/branko-answers-2026-07-31/"
                 "answers-ingested.md Q4. Sections 4.10 and 7 were rewritten to left-click in "
                 "Confluence v22; section 14.1 still lists right-click - COVERAGE-REDERIVATION.md "
                 "section 6 flag F3.",
        cases=[("SCH-PERM-02", 30075), ("SCH-PERM-04", 30077), ("SCH-REAS-03", 30054)],
        closer="Branko (spec tidy). Cases settled.",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Schedule", category="B",
        say="Your cases show the vehicle number on hover even when the toggle is off. The spec's "
            "view-options section ties it to the toggle.",
        answer="Branko confirmed on 31 July that the VIN is always visible on hover regardless of "
               "the toggle. That is how our cases already read - the toggle only controls the "
               "shift block itself.",
        evidence="Branko, 2026-07-31, verbatim: \"A. Vin is always visible on hover regardless of "
                 "the toggle\" - build/schedule/branko-answers-2026-07-31/answers-ingested.md Q6. "
                 "Live spec v23 section 4.13 agrees; the section 9 prose is still loosely worded. "
                 "Closes our open question OQ-6(a).",
        cases=[("SCH-TIP-01", 30034), ("SCH-VIEW-04", 30045)],
        closer="Branko (spec tidy). Cases settled.",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Schedule", category="B",
        say="Jira story SV-8695 still lists a Reassign action on the shift pop-up. Your case says "
            "Delete only.",
        answer="The Jira story is the stale one. Branko answered \"B - No button\" and the spec "
               "itself deleted that action in its newest version, on the same day. We do not edit "
               "other people's Jira tickets, so it needs their update.",
        evidence="Branko, 2026-07-31, verbatim: \"B - No button\". Confluence v23 (2026-07-30) "
                 "removed \"and Reassign to another technician\" from the section 4.9 Actions "
                 "list, which now reads only \"Actions: Delete (series-aware, section 7)\" - "
                 "build/schedule/branko-answers-2026-07-31/answers-ingested.md Q2. Our cases were "
                 "already written this way; SCH-REAS-02 was retired 2026-07-22.",
        cases=[("SCH-MODAL-08", 30015), ("SCH-REAS-01", 30052)],
        closer="Branko / dev (the Jira text). Cases settled.",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Schedule", category="B",
        say="Do meetings and events eat into a technician's capacity? You had that marked as an "
            "open question.",
        answer="They do, and it is now settled. Branko confirmed it on 31 July quoting his own "
               "spec, so the hold we had on six cases is lifted. Events count toward capacity but "
               "are not conflict-checked.",
        evidence="Branko, 2026-07-31, verbatim: \"A) section 4.12 PRD is explicit: 'Event time is "
                 "included in the utilization total alongside shifts, so meetings and training "
                 "consume capacity.' A 2-hour meeting consumes 2 hours of capacity. Note the "
                 "split in section 4.11: events count toward capacity but are not "
                 "conflict-checked.\" His quote is word-for-word identical to the live v23 body "
                 "(introduced in Confluence v19, 2026-07-23) - "
                 "build/schedule/branko-answers-2026-07-31/answers-ingested.md Q1.",
        cases=[("SCH-EVT-08", 30615), ("SCH-CAP-01", 30030), ("SCH-CAP-02", 30031),
               ("SCH-CAP-03", 30032), ("SCH-CAP-04", 30033), ("SCH-CONF-01", 30023)],
        closer="Nobody, this is settled.",
        status="SETTLED", risk="LOW",
    ),

    # ---- C -----------------------------------------------------------
    dict(
        project="Schedule", category="C",
        say="You retired the printable week view case. That is a real feature.",
        answer="Branko said it is not in the release and not even in the backlog, and we checked "
               "the whole spec ourselves and found no export or print item anywhere. The retire "
               "was your authorized call and the recorded results in the run were untouched.",
        evidence="Branko, 2026-07-31, verbatim: \"No. There is nothing about this in the PRD, not "
                 "in the future requirements.\" Independently corroborated - a full-text scan of "
                 "Confluence v23 finds no export or print item in section 6, section 9 or section "
                 "15, and the tech plan's requirement table has none either. Executed on your "
                 "authorization (\"Retire from test cases and test run\"): delete_case HTTP 200, "
                 "re-GET confirms gone, run 357 165->164 with all 429 results intact - "
                 "build/schedule/week-export-retire-2026-07-31/"
                 "testrail-execution-log-2026-07-31.md.",
        cases="SCH-EXP-01 (was C38853) - retired and deleted, deliberate. SCH-EXP-02 (was "
              "C38854) had already been merged away in the 2026-07-31 consolidation.",
        closer="Nobody, this is settled (you authorized it).",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Schedule", category="C",
        say="You dropped 25 Schedule cases in the consolidation. What went?",
        answer="20 groups of the same check written more than once, plus 2 that could not fail "
               "informatively. Every one of the 190 cases was scored first, and every merge names "
               "its survivor. Nothing was cut without your authorization.",
        evidence="build/schedule/quality-audit-2026-07-31/USEFULNESS-AUDIT-2026-07-31.md, status "
                 "block: \"EXECUTED 2026-07-31 (user-authorized) ... the 20 merge groups + 2 cuts "
                 "(companion MERGE-PLAN.md, 0 groups held) and the 6 FIX-WORDING repairs ... "
                 "Result: 190 -> 165 active cases ... 24 update_case + 25 delete_case = 49 "
                 "operations, ALL HTTP 200, ALL re-GET verified\". Backup: "
                 "build/schedule/consolidation-backup-2026-07-31/MANIFEST.md.",
        cases="25 retired cases - deliberate; survivors named per group in MERGE-PLAN.md.",
        closer="Nobody, this is settled.",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Schedule", category="C",
        say="There are 30 things in the Schedule spec with no test case.",
        answer="Correct, and each one is listed with its reason. They are the goals, the list of "
               "who uses the module, post-launch analytics targets, features explicitly out of "
               "the first release, internal field names, and two half-sentences that introduce "
               "the bullets below them. Anything a tester could actually observe was called a gap, "
               "not untestable.",
        evidence="build/schedule/coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md "
                 "section 4: 243 statements enumerated with a machine completeness proof (242 "
                 "non-blank body lines, 242 consumed, MATCH), 206 covered + 4 covered-flagged + "
                 "30 not-testable + 3 gaps. Full itemisation in the not-testable table and the "
                 "243-row matrix in APPENDIX-A-full-matrix.md.",
        cases="no case - deliberate, 30 statements, itemised in section 4.",
        closer="Nobody, this is settled.",
        status="SETTLED", risk="LOW",
    ),

    # ---- D -----------------------------------------------------------
    dict(
        project="Schedule", category="D",
        say="Can a technician change another technician's shift? There is no test for it.",
        answer="Correct, and it is deliberate. The spec says nothing at all about who may change "
               "whose shifts, and the engineering plan says technicians are limited to their own. "
               "We will not write a case against a guess. Branko told us the question is not his, "
               "so it has been re-routed to engineering.",
        evidence="Branko, 2026-07-31, verbatim: \"I'm not sure if this question is for me Bilal.\" "
                 "Spec v23 section 14 confirmed silent on write scoping. Tech plan: "
                 "ManageShiftVoter enforces own-data scoping on writes (cross-technician write "
                 "-> 403). Both source docs state the case was held un-authored: \"a new negative "
                 "case would be authored only on answer A\" and \"no case asserts the 403 ... NOT "
                 "authored\" - build/schedule/week-export-retire-2026-07-31/NQ5-CASE-MAP.md.",
        cases="no case - deliberate. The nearest case covers only the viewing side: "
              f"SCH-PERM-09 = C30082 ({TR}30082).",
        closer="Engineering / dev (question NQ-5, re-routed off the PO sheet).",
        status="AWAITING ANSWER", risk="MEDIUM",
    ),
    dict(
        project="Schedule", category="D",
        say="Does the problem counter include double-bookings or not?",
        answer="Genuinely open. The spec lists double-booked as a conflict type; the engineering "
               "plan treats it as a soft front-end warning only. We have not asserted either, and "
               "the question is written and waiting to go to Branko.",
        evidence="Spec v23 section 4.11 lists \"Double-booked\" among the conflict types; the "
                 "Schedule tech plan calls it a soft front-end warning. Recorded as NQ-2 in "
                 "build/schedule/branko-answers-2026-07-31/answers-ingested.md, \"STILL "
                 "OUTSTANDING\" item 3, and in the unsent sheet "
                 "PO-Questions-Branko-Schedule-TechPlan_2026-07-30.md.",
        cases=[("SCH-CONF-01", 30023), ("SCH-CONF-05", 30027)],
        closer="Branko",
        status="AWAITING ANSWER", risk="LOW",
    ),
    dict(
        project="Schedule", category="D",
        say="Where do the shop's working hours and closure days actually live? And can a working "
            "day be split into two ranges?",
        answer="Two questions, both still open, and on both the spec sides with our cases while "
               "the engineering plan disagrees. The spec says the hours live on Edit Staff Member "
               "and Edit Location and that \"Add hours\" supports split shifts; the plan builds a "
               "separate settings page and one range per day. We asked rather than picked.",
        evidence="Spec v23 (Edit Staff Member + Edit Location; \"'Add hours' appends more to "
                 "support split shifts\"). Tech plan: a separate Schedule Settings page in "
                 "Administration, one range per weekday. Recorded as NQ-3 and NQ-4 - "
                 "build/schedule/branko-answers-2026-07-31/answers-ingested.md, \"STILL "
                 "OUTSTANDING\" items 4 and 5.",
        cases=[("SCH-HRS-02", 38847), ("SCH-HRS-05", 38850), ("SCH-HRS-06", 38851)],
        closer="Branko",
        status="AWAITING ANSWER", risk="LOW",
    ),
    dict(
        project="Schedule", category="D",
        say="What is the \"New Work Order\" shortcut supposed to do - show a message or open the "
            "work-order window?",
        answer="Still unresolved, and we have written the case so it passes either way rather than "
               "asserting something the spec does not say.",
        evidence="build/OUTSTANDING-ITEMS-REGISTER.md section 2, item A5: \"what 'New Work Order' "
                 "actually does (a toast versus opening the WO window) is still unresolved ... "
                 "SCH-REAS-06 = C38855 passes either way, so impact is low\". Menu wording itself "
                 "is settled by Branko's Q4 answer (Create event + New work order, left-click).",
        cases=[("SCH-REAS-06", 38855)],
        closer="Branko",
        status="AWAITING ANSWER", risk="LOW",
    ),

    # ---- E -----------------------------------------------------------
    dict(
        project="Schedule", category="E",
        say="You keep saying the Schedule labels are confirmed. Confirmed against what?",
        answer="Against the spec and the ratified design prototype - not against a running build, "
               "because Schedule has no test environment yet. About 18 on-screen labels are "
               "design-pinned rather than build-confirmed, and design-pinned is not the same as "
               "verified.",
        evidence="build/schedule/coverage-rederivation-2026-07-31/COVERAGE-REDERIVATION.md "
                 "source-currency block, live build row: \"No QA branch / environment exists "
                 "(OQ-3) ... nothing in this suite is build-verified; every case stays "
                 "VIU-Pending\". Standing Rule 12. Also note the audit's own honesty label: "
                 "\"this is a DESK audit of case text vs the ingested spec/design/tech-plan "
                 "sources\" (USEFULNESS-AUDIT-2026-07-31.md).",
        cases="all 165 active cases are VIU-Pending - build/schedule/testrail-id-map.csv.",
        closer="You / engineering - the environment plus the flag state (OQ-3).",
        status="AWAITING LIVE BUILD", risk="HIGH",
    ),

    # ---- G -----------------------------------------------------------
    dict(
        project="Schedule", category="G",
        say="One of your preconditions has a stray \"(/02)\" in it.",
        answer="You are right - that is our import script stripping only part of an internal "
               "reference. It is one case, it needs a small code fix plus an authorized update, "
               "and it is on the list.",
        evidence="build/OUTSTANDING-ITEMS-REGISTER.md section 2: \"SCH-HRS-04 precondition 1 "
                 "leaves a stray (/02) in the pushed text because clean() strips only the ID, not "
                 "the whole bracket.\" Raised 2026-07-31.",
        cases=[("SCH-HRS-04", 38849)],
        closer="You (the go-ahead for one update_case, plus the gen_import.py fix).",
        status="SCHEDULED", risk="LOW",
    ),
    dict(
        project="Schedule", category="G",
        say="There is an empty folder in the Schedule tree.",
        answer="Yes - section 5406 \"Week Export and Printing\" is empty because its one case was "
               "retired on your authorization. We deliberately did not delete the folder without "
               "asking, since deleting sections is not something we do unprompted.",
        evidence="build/OUTSTANDING-ITEMS-REGISTER.md section 2: \"The Week Export case (C38853) "
                 "was retired with your authorization; the section is empty but deliberately not "
                 "deleted.\" Standing Rule 6.",
        cases="no case - the folder is empty by design after the authorized retire.",
        closer="You (one authorized cleanup operation).",
        status="SCHEDULED", risk="LOW",
    ),
    dict(
        project="Schedule", category="G",
        say="19 cases are marked low-value. Why keep them?",
        answer="Because low-value is not the same as useless, and we would rather flag them "
               "honestly than quietly delete real checks. The audit recommended keeping them and "
               "they are tagged so you can cut them later if you want.",
        evidence="build/schedule/quality-audit-2026-07-31/USEFULNESS-AUDIT-2026-07-31.md: \"The "
                 "19 WEAK-KEEP cases were kept as recommended.\" Per-case verdicts in "
                 "per-case-verdicts.csv (one row per case, both verdict sets). Standing Rule 28.",
        cases="19 WEAK-KEEP cases, individually listed with C-ids in per-case-verdicts.csv.",
        closer="You, if you want them cut.",
        status="ACCEPTED", risk="LOW",
    ),

    # ==================================================================== #
    # FILTERS                                                              #
    # ==================================================================== #

    # ---- B -----------------------------------------------------------
    dict(
        project="Filters", category="B",
        say="The PRD says the Status filter is hidden on the Estimates and Completed tabs, in six "
            "different places. Your cases say it is shown greyed out. Your cases are wrong.",
        answer="The PRD text is the stale part. Branko was asked this exact question and chose "
               "\"shown but greyed out, pre-filled with the tab's status, and not clickable\", and "
               "the QA lead ruled the same way. Both of those outrank PRD wording the author has "
               "not updated in eight versions.",
        evidence="Branko (PO), 2026-07-17, Round-1 Q4 = B, verbatim: \"Shown but greyed out, "
                 "pre-filled with the tab's status, and not clickable\" - "
                 "build/filters/branko-answers-2026-07-17/answers-ingested.md. QA lead ruling "
                 "2026-07-30, verbatim: \"Status chip is hidden on certain tabs = "
                 "greyed-out/disabled\". Live spec v1.6 (Confluence page 572030978 version 12, "
                 "2026-07-28) S9-R2 verbatim: \"On the Estimates tab, the Status filter chip is "
                 "hidden\" - and that wording is byte-identical to V1.0, so it is not a new "
                 "conflict. Full claim-by-claim: "
                 "build/filters/ahtesham-review-2026-07-31/VERIFICATION.md, Conflict 1.",
        cases=[("FLT-TAB-02", 29609), ("FLT-TAB-03", 29610), ("FLT-BAR-02", 29558)],
        closer="Branko - to align six places in his own PRD to his own answer (queued as B1).",
        status="SETTLED", risk="MEDIUM",
    ),
    dict(
        project="Filters", category="B",
        say="Story 12 says mobile behaves identically to desktop with no Apply button, so your "
            "combined \"All Filters\" sheet cases are testing something that does not exist.",
        answer="It does exist - it is in the ratified design and the engineering plan builds it "
               "deliberately as a batch-apply exception to desktop's live filtering. What is "
               "missing is the spec's mention of it, which Branko owes us.",
        evidence="Live spec v1.6 S12-R2 verbatim: \"The filter chips behave identically to "
                 "desktop\" (unchanged since V1.0). Against that: Figma node 11884:13689 is a "
                 "combined accordion bottom sheet titled \"All Filters\" with a sticky \"Apply "
                 "filters\" button, and tech-plan decision D15 verbatim: \"Mobile 'All Filters' "
                 "combined bottom sheet - IN, with an 'Apply filters' button (batch-apply; "
                 "deliberate difference from desktop real-time). Individual chips/sheets stay "
                 "real-time.\" - build/filters/ahtesham-review-2026-07-31/VERIFICATION.md, "
                 "Conflict 2.",
        cases=[("FLT-MOB-02", 29622), ("FLT-MOB-03", 29623)],
        closer="Branko - add the combined-sheet exception to Story 12 (queued as B2).",
        status="SETTLED", risk="MEDIUM",
    ),
    dict(
        project="Filters", category="B",
        say="Filters were supposed to differ by role. Nothing in your cases covers that.",
        answer="Branko ruled that a person's role changes neither the filter buttons nor the "
               "choices inside them, and the spec has no permissions section at all. So there is "
               "nothing role-specific to test, and we recorded his ruling on the twelve "
               "Parts/Reports cases instead of inventing role behaviour.",
        evidence="Branko, 2026-07-31, answer Q7 = A (role changes neither chips nor options) - "
                 "build/filters/branko-answers-2026-07-31/answers-ingested.md. Live spec v1.6 has "
                 "no permissions section (noted in DELTAS.md section 4d). Applied as change A1-A9: "
                 "\"permissions_required replaced with the Q7=A ruling on all 12 Parts/Reports "
                 "cases\" - build/filters/PROJECT-STATE.md section 0.05.",
        cases="the 12 Parts and Reports cases - e.g. "
              f"FLT-PARTS-13 = C38908 ({TR}38908), FLT-RPTS-23 = C38882 ({TR}38882).",
        closer="Nobody, this is settled.",
        status="SETTLED", risk="LOW",
    ),

    # ---- C -----------------------------------------------------------
    dict(
        project="Filters", category="C",
        say="Why is a search/command-palette test case in the Filters project?",
        answer="It is not any more. Branko ruled that the pop-up palette belongs to Global Search, "
               "not Filters, so those nine cases were retired. They had never been pushed to "
               "TestRail, so nothing was deleted from anyone's run. The in-page toolbar search box "
               "is a different control and stays in Filters.",
        evidence="Branko, 2026-07-31, answer Q6 = A - \"Test it under Global Search, not here.\" "
                 "Corroborated three ways: live spec v1.6 has no palette requirement, and the "
                 "Filters Figma file has no palette board - "
                 "build/filters/branko-answers-2026-07-31/DELTAS.md section 2. Your conditional "
                 "ruling (\"do not delete unless Branko confirms\") therefore resolved to retire - "
                 "build/OUTSTANDING-ITEMS-REGISTER.md section 7.",
        cases="FLT-SRCH-01 to FLT-SRCH-09 - retired, blank C-ids, never in TestRail. The "
              f"toolbar-search cases that stay are FLT-PSRCH-01 = C38883 ({TR}38883) through "
              f"FLT-PSRCH-13 = C38903 ({TR}38903).",
        closer="Nobody, this is settled. (The coverage now belongs to Global Search, which is "
               "POSTPONED - so it is parked, not running.)",
        status="SETTLED", risk="MEDIUM",
    ),
    dict(
        project="Filters", category="C",
        say="There is no test that says \"typing X in the page search finds Y\".",
        answer="Correct, and it is deliberate - the spec itself says that list does not exist yet. "
               "Its own words are that the searchable set is undocumented and QA has no baseline "
               "to test against. We refused to invent one.",
        evidence="Live Filters spec v1.6 (Confluence page 572030978 version 12, 2026-07-28), "
                 "S13-R23 verbatim: \"Pending: the per-table list of fields currently covered, "
                 "from engineering. Until it exists the searchable set is undocumented and QA has "
                 "no baseline to test against\". Five client-side surfaces have no field list at "
                 "all. Recorded in build/filters/ahtesham-review-2026-07-31/FIX-PLAN.md, "
                 "\"Blocked by the spec itself\".",
        cases="no per-page search-field case - deliberate. The page-search mechanics that CAN be "
              f"tested are covered: FLT-PSRCH-01 = C38883 ({TR}38883) onward.",
        closer="Branko / engineering - supply the per-table field list.",
        status="AWAITING ANSWER", risk="MEDIUM",
    ),
    dict(
        project="Filters", category="C",
        say="You retired 36 Filters cases. That is a quarter of the suite.",
        answer="27 of them were the same micro-behaviour written once per filter chip, and 9 were "
               "the palette cases that moved to Global Search. All 137 were scored one by one "
               "first, and none of them had ever been executed.",
        evidence="build/filters/quality-audit-2026-07-31/USEFULNESS-AUDIT-2026-07-31.md - 137 "
                 "scored: 71 KEEP / 52 MERGE / 3 WEAK-KEEP / 11 CUT; named slop pattern #1 "
                 "\"Near-duplicates across areas ... 19 cases (14 absorbed into 5 survivors)\". "
                 "Final state: build/filters/PROJECT-STATE.md section 0 - \"146 authored -> 110 "
                 "ACTIVE / 36 Retired\". Standing Rule 28.",
        cases="36 retired cases - deliberate; survivors named per group in MERGE-PLAN.md.",
        closer="Nobody, this is settled.",
        status="SETTLED", risk="LOW",
    ),

    # ---- D -----------------------------------------------------------
    dict(
        project="Filters", category="D",
        say="Do the individual mobile filter sheets have an Apply button or do they filter as you "
            "tick?",
        answer="Genuinely open, and the case says so on its face. The design frames show a button; "
               "the engineering plan says individual sheets stay live. The case carries a plain "
               "note telling the tester to check which one ships rather than failing it.",
        evidence="Tech-plan D15 says individual sheets stay real-time; design frames 11884:21065 "
                 "and 11884:21271 show an \"Apply filter\" button. Logged before the review as "
                 "conflict C4 / question Q4 in build/filters/tech-plan-2026-07-29/. The note is "
                 "live in TestRail on the case: \"CONFLICT - PENDING BRANKO/DEV ... Verify live "
                 "which one ships before failing this case.\" Independently re-raised by Ahtesham "
                 "2026-07-31, which raises its priority - VERIFICATION.md Conflict 2.",
        cases=[("FLT-MOB-04", 29624)],
        closer="Branko (question B3 - he has not answered it yet).",
        status="AWAITING ANSWER", risk="MEDIUM",
    ),
    dict(
        project="Filters", category="D",
        say="The Parts and Reports filter cases do not cite a requirement number.",
        answer="They cannot, because the PRD does not number those pages. We asked Branko for the "
               "numbered write-up and that question came back blank, so those twelve cases are "
               "written from the designs and cite prose sections. We recorded it as unanswered "
               "rather than assuming.",
        evidence="Branko's Q1 on the Parts/Reports sheet came back blank; his Q4 answer was a "
                 "pointer only - verbatim \"fully displayed in the design\". The live v1.6 PRD has "
                 "no S#-R# anchor for any Parts view or any report - "
                 "build/filters/branko-answers-2026-07-31/DELTAS.md, STILL-AMBIGUOUS items S1 and "
                 "S2; NEW-Q3 asks him to number them. Outstanding since 2026-07-27.",
        cases="the 12 Parts/Reports cases - e.g. "
              f"FLT-PARTS-13 = C38908 ({TR}38908), FLT-RPTS-23 = C38882 ({TR}38882).",
        closer="Branko",
        status="AWAITING ANSWER", risk="MEDIUM",
    ),
    dict(
        project="Filters", category="D",
        say="One of your Parts cases still hedges about the Vendors page.",
        answer="On purpose. Branko's answer talks about the chips shown in the design, and there "
               "is no Vendors design to read - so the hedge survives deliberately rather than us "
               "asserting a chip list we have never seen.",
        evidence="build/filters/PROJECT-STATE.md section 0.05, item 1, verbatim: \"The Vendors-page "
                 "hedge in FLT-PARTS-01 DELIBERATELY SURVIVES - Q2=A speaks about chips shown in "
                 "the design and there is no Vendors design; that stays open.\" Also "
                 "build/OUTSTANDING-ITEMS-REGISTER.md section 3.",
        cases=[("FLT-PARTS-01", 38904)],
        closer="Branko",
        status="AWAITING ANSWER", risk="LOW",
    ),
    dict(
        project="Filters", category="D",
        say="None of the Filters cases cite a Jira ticket. That breaks your own traceability rule.",
        answer="It does, and the reason is that Filters has no Jira epic and no stories at all - we "
               "proved that by listing every one of the 170 SV epics, not by a failed search. We "
               "did not invent a key; the ticket field reads \"Filters (no Jira epic)\". Every case "
               "still cites a spec anchor.",
        evidence="build/epic-recheck-2026-07-31/FILTERS-EPIC-SEARCH.md - all 170 SV epics "
                 "enumerated 2026-07-31, none is Filters, SV-4913 ruled out. "
                 "build/filters/PROJECT-STATE.md section 0 item 3: \"A ticket key does not exist "
                 "and none was invented ... Spec-anchor-only is the maximum achievable here - an "
                 "UPSTREAM gap, not an authoring gap.\" Standing Rule 20.",
        cases="all 110 active cases carry a spec anchor and no ticket - "
              "build/filters/testrail-id-map.csv (110 rows, refs column populated 110/110).",
        closer="You / Branko - give us the key, or confirm the work genuinely is not ticketed.",
        status="AWAITING ANSWER", risk="HIGH",
    ),

    # ---- E -----------------------------------------------------------
    dict(
        project="Filters", category="E",
        say="Your own audit says 19 cases should be merged. Why have you not merged them?",
        answer="Because the merge rests on an assumption we have not been able to check - that the "
               "five filter dropdowns are one shared component. If that is wrong, merging would "
               "delete real coverage, so it is held until someone can look at a running build.",
        evidence="build/filters/PROJECT-STATE.md section 0, STILL OPEN: \"26 MERGE + 1 CUT "
                 "recommendations remain HELD (13 groups) ... 19 of them hinge on whether the five "
                 "filter dropdowns share one component - a live-build question, so merging now "
                 "would be guessing.\" Also build/OUTSTANDING-ITEMS-REGISTER.md section 3, which "
                 "calls the hold \"correctly held\".",
        cases="26 MERGE + 1 CUT candidates, listed per group in "
              "build/filters/authenticity-2026-07-31/RULE28-THREE-DIMENSION-AUDIT.md section 3.",
        closer="You, and it genuinely needs the QA branch first.",
        status="AWAITING LIVE BUILD", risk="LOW",
    ),
    dict(
        project="Filters", category="E",
        say="Seven Filters cases show raw HTML tags in TestRail.",
        answer="They might, and we know exactly which seven. They store their steps as HTML list "
               "tags instead of our normal numbered lines - the content is identical, verified "
               "field by field. We deliberately did not rewrite them because if TestRail renders "
               "HTML they are fine and the rewrite would be churn. One look at a case page decides "
               "it.",
        evidence="build/filters/PROJECT-STATE.md section 0, STILL OPEN, verbatim: \"In TestRail "
                 "C29557, C29560, C29566, C29568, C29573, C29575, C29582 store "
                 "Preconditions/Steps/Expected as HTML <ol><li> while the other 103 store the "
                 "house-standard plain numbered lines. Content is byte-identical "
                 "(machine-verified on all 21 field pairs). Deliberately NOT pushed.\"",
        cases=[("FLT-BAR-01", 29557), ("FLT-STAT-01", 29560), ("FLT-CUST-01", 29566),
               ("FLT-CUST-03", 29568), ("FLT-CUST-08", 29573), ("FLT-TECH-01", 29575),
               ("FLT-ADV-01", 29582)],
        closer="Anyone who opens one of those seven case pages in TestRail and tells us what they "
               "see.",
        status="AWAITING LIVE BUILD", risk="LOW",
    ),
    dict(
        project="Filters", category="E",
        say="110 Filters cases and the run has been sitting at Untested since July. Has anything "
            "been verified?",
        answer="Not against a build - Filters has no test environment either. Around 18 on-screen "
               "labels are taken from the designs and are explicitly hedged in the case text until "
               "someone can read them off the real screen.",
        evidence="build/filters/PROJECT-STATE.md section 0: \"Every case is still VIU-Pending - no "
                 "live-build check was possible: Filters still has no QA branch/env (Rules 12/22)\" "
                 "and \"~18 on-screen labels stay design-sourced and explicitly hedged in the case "
                 "text\". Run 352 = 110 tests, 395 result records, untouched.",
        cases="all 110 active cases are VIU-Pending - build/filters/testrail-id-map.csv.",
        closer="You / engineering - the environment (OQ-3).",
        status="AWAITING LIVE BUILD", risk="HIGH",
    ),

    # ---- F -----------------------------------------------------------
    dict(
        project="Filters", category="F",
        say="Ahtesham's review found conflicts and missing coverage in the Filters run. Was he "
            "right?",
        answer="On six points: one fully right, four partly right, one wrong but with a correct "
               "point inside it - and zero false alarms. His most valuable find was real and it "
               "was ours: two of our case titles said \"hidden\" while three said \"shown greyed "
               "out\", so a tester could not tell which to trust. We fixed our titles and credited "
               "him.",
        evidence="build/filters/ahtesham-review-2026-07-31/VERIFICATION.md, verdict summary: "
                 "\"Score: 1 fully correct, 4 partly correct, 1 incorrect-with-a-correct-corollary. "
                 "He raised zero false alarms.\" The internal inconsistency was adopted and fixed "
                 "(fix F1). The behaviour itself was NOT changed - a PO ruling and a QA-lead ruling "
                 "outrank a PRD-prose reading (Standing Rule 33). Push: "
                 "build/filters/fixes-2026-07-31/testrail-execution-log-2026-07-31.md.",
        cases=[("FLT-BAR-03", 29559), ("FLT-TAB-05", 29612), ("FLT-URL-05", 38879),
               ("FLT-URL-06", 38896)],
        closer="Nobody - closed, and the refinement call is the place to walk through it.",
        status="SETTLED", risk="MEDIUM",
    ),
    dict(
        project="Filters", category="F",
        say="He said there is no case for \"Back to my view\" clearing the search, and for the "
            "Imported filter, and for shared links not overwriting saved filters.",
        answer="Two of those three did exist - they simply were not in his run, which had not been "
               "refreshed since 17 July. The third was a genuine gap and he was right: the "
               "search-clearing half and the negative case were missing. Both are now written and "
               "in the run.",
        evidence="build/filters/ahtesham-review-2026-07-31/VERIFICATION.md gaps 3, 4 and 5: "
                 "Imported exclusivity fully covered by FLT-STAT-07 = C38877; shared-URL "
                 "runtime-only fully covered by FLT-URL-05 = C38879; \"Back to my view\" - "
                 "\"CORRECT (a genuine residual gap remains) ... the query-clearing clause and the "
                 "ratified label are untested and S11-N3 has no case at all\". Closed by 15 "
                 "update_case + 8 add_case + a run-352 sync, all HTTP 200 + verified - "
                 "build/filters/fixes-2026-07-31/testrail-execution-log-2026-07-31.md.",
        cases=[("FLT-STAT-07", 38877), ("FLT-URL-05", 38879), ("FLT-URL-06", 38896)],
        closer="Nobody, this is settled.",
        status="SETTLED", risk="LOW",
    ),

    # ---- G -----------------------------------------------------------
    dict(
        project="Filters", category="G",
        say="Your own quality audit read all 110 cases and missed the contradiction a junior QA "
            "found in one pass.",
        answer="That is exactly right, and we have said so in writing. Our sense check was applied "
               "case by case, so a suite could be individually sensible and still contradict "
               "itself. We added a mandatory across-the-suite contradiction sweep, and it has since "
               "found five more on Filters and one on Schedule that nobody had reported.",
        evidence="build/filters/ahtesham-review-2026-07-31/VERIFICATION.md, \"What WE got wrong\" "
                 "item 4: \"A junior reviewer reading the run cold caught it. That is a gap in how "
                 "we ran the audit - contradiction-hunting must be done ACROSS cases in a run, not "
                 "case by case.\" Control now in place: Standing Rule 28 Dimension 2 Stage 2b "
                 "(build/LESSONS-2026-07-31.md section 1.2). Result of the new sweep on Filters: "
                 "\"1,959 assertions, 0 failures; 5 contradictions found, 5 resolved, 0 "
                 "unresolved\" - build/filters/PROJECT-STATE.md section 0 item 5.",
        cases=[("FLT-BAR-03", 29559), ("FLT-TAB-05", 29612)],
        closer="Nobody - conceded, fixed, and the process changed.",
        status="SETTLED", risk="HIGH",
    ),
    dict(
        project="Filters", category="G",
        say="Your Filters requirements file is still the old version 1.0.",
        answer="True, and it is deliberately parked rather than quietly patched. Every case has "
               "already been re-pointed to the live version 1.6 anchors, so no case reads from that "
               "stale file any more - it needs a clean re-ingest, not an edit.",
        evidence="build/filters/PROJECT-STATE.md section 0, STILL OPEN: \"requirements.md is still "
                 "the stale V1.0 ingest - re-ingest from spec-current-2026-07-31/"
                 "Filters-spec-current.md. No case cites it any more.\" Traceability repair: "
                 "\"80 of 110 refs were defective ... All repaired. Valid-in-v1.6 anchors 30 -> "
                 "100\" (section 0 item 2).",
        cases="no case affected - all 110 now cite live v1.6 anchors.",
        closer="Us (a re-ingest pass, no authorization needed).",
        status="SCHEDULED", risk="LOW",
    ),
    dict(
        project="Filters", category="G",
        say="You said the design pass is done, but twelve design boards were never downloaded.",
        answer="Correct, and we do not call the design pass complete while that is true. Figma "
               "rate-limits image rendering for about ten hours; the twelve are queued and retry "
               "automatically. All twelve are already described from their layer trees, so nothing "
               "is guessed - only the pictures are missing.",
        evidence="build/filters/design-2026-07-31/PENDING-FIGMA-FETCH.md - \"STATUS: OPEN - do not "
                 "close until ALL frames have PNGs (target 85/85)\", 73 of 85 boards have a PNG, "
                 "12 missing, last rate-limit 2026-07-30T15:03:19Z, auto-retry under Standing Rule "
                 "35 with no authorization needed. Note: /tmp is wiped on a fresh container, so the "
                 "Figma token has to be re-supplied.",
        cases="no case blocked; the 12 boards matter to Branko question NEW-Q2 (which board pins "
              "the new filter types) and to the sorting question.",
        closer="Us (automatic retry) - but you must re-supply the Figma token on a fresh container.",
        status="SCHEDULED", risk="LOW",
    ),

    # ==================================================================== #
    # CROSS-PROJECT                                                        #
    # ==================================================================== #

    dict(
        project="Cross-project", category="G",
        say="You were working from stale specs. Filters was eight versions behind.",
        answer="Yes - Filters was eight Confluence versions behind and Schedule five, and that did "
               "cost us real coverage and three questions the PRD had already answered. It is fully "
               "corrected and the rule that prevents it is now the first action of any project task. "
               "The trap worth knowing: the version number printed inside the Schedule document "
               "never changes, so only the Confluence version number is reliable.",
        evidence="build/LESSONS-2026-07-31.md section 1.1: Filters baseline V1.0 (Confluence "
                 "version 4, 2026-05-14) versus live v1.6 (version 12, 2026-07-28); Schedule "
                 "baseline v18 versus live v23. \"Filters grew from 78 requirements to 127 while "
                 "our baseline stood still.\" Controls: Standing Rule 31 (currency of all five "
                 "source types, source-currency block on every deliverable) and Standing Rule 43 "
                 "(a per-requirement coverage verdict).",
        cases="all three suites were re-derived against the live specs afterwards - Filters 110, "
              "Schedule 165, Report Suite 474.",
        closer="Nobody - conceded, corrected, and rule-controlled.",
        status="SETTLED", risk="HIGH",
    ),
    dict(
        project="Cross-project", category="G",
        say="I reviewed the run and cases were missing. Your coverage numbers do not match what I "
            "can see.",
        answer="That was real and it was our fault - if the run you reviewed is one of the three we "
               "own. A TestRail run built from a fixed selection never picks up new cases, so runs "
               "had been frozen since 17 July. The three runs for the projects we are actively "
               "working - Filters 352, Schedule 357, Reports Suite 359 - were brought current on 31 "
               "July with every recorded result preserved, and keeping them complete is now a "
               "standing duty checked whenever cases are added, edited or retired. Runs outside "
               "those three projects are not ours to manage: our coverage is measured against the "
               "case suite in TestRail, never against someone else's run selection, so if cases "
               "look missing from a run we do not own, that run's selection is its owner's to "
               "refresh.",
        evidence="build/testrail-run-sync-2026-07-31/RUN-SYNC-AUDIT.md: Filters run 352 79->94 "
                 "(later 110), Schedule 357 143->165, Report Suite 359 458->465 (later 474); result "
                 "records 395/429/539 before and after, unchanged; add-only union writes. Controls: "
                 "Standing Rule 34 (the sync method - and its warning that a partial case_ids write "
                 "to update_run DELETES the omitted tests and their results, so the sync is "
                 "union-only) and Standing Rule 47 (the scope - the three active projects' runs are "
                 "kept complete as a standing duty; runs belonging to other or completed projects, "
                 "or created by another author for work we are not doing, are out of scope). "
                 "Honesty note: the 110 / 165 / 474 figures are from the 31 July passes and have "
                 "NOT been re-verified live since - the credentials were lost with the container's "
                 "/tmp - so the re-check is written up prepared and unexecuted in "
                 "build/testrail-run-sync-2026-07-31/RUN-COMPLETENESS-CHECK-2026-07-31.md.",
        cases="113 cases were affected across 6 runs; the three active runs were brought equal to "
              "their active suites on 31 July, pending the live re-check.",
        closer="Nobody on scope - but the live re-check needs the TestRail credentials re-supplied.",
        status="SETTLED", risk="MEDIUM",
    ),
    dict(
        project="Cross-project", category="C",
        say="Two runs still have cases missing. Why did you not sync those too?",
        answer="Because those runs are out of our scope, and that is now a settled ruling rather "
               "than an open question. We keep the runs complete for the three projects we are "
               "actively working - Filters, Schedule and Reports Suite. Runs for finished projects "
               "hold graded results, and making a completed run incomplete again is a reporting "
               "decision, not a QA one. A run created by another tester for work we are not doing "
               "is theirs to manage, not ours to edit.",
        evidence="build/testrail-run-sync-2026-07-31/RUN-SYNC-AUDIT.md; user ruling 2026-07-31 "
                 "verbatim: \"For now do not do anything for the completed test runs\", and the "
                 "same day, \"ignore any test run which is not created by Bilal Muzamil\" - "
                 "clarified immediately afterwards to require that the three active projects' runs "
                 "must still contain every test case, \"like it happened with filters yesterday\". "
                 "Both halves are recorded as Standing Rule 47. Out of scope and untouched: run 324 "
                 "Fees & Discounts (25 cases missing, 185 graded results), run 325 Simple Flow (35 "
                 "missing, 147 results), and run 278 Custom Permissions - another author's run "
                 "(Vladimir Tomovic) on a different project, 3,521 graded results. The run 278 "
                 "decision paper is retained for the record but is marked SUPERSEDED: no action "
                 "will be taken on it.",
        cases="no case edited - the runs were not written to at all. The three Custom Roles "
              "regression guards CR-REG-01 = C38843, CR-REG-02 = C38844 and CR-REG-03 = C38845 are "
              "consequently in no manual run; that follows the ruling rather than being an "
              "oversight, and is recorded openly in the outstanding register.",
        closer="Nobody - settled by your scope ruling of 31 July.",
        status="SETTLED", risk="LOW",
    ),
    dict(
        project="Cross-project", category="D",
        say="There is a live \"Simple Flow V2\" epic with seven children. I thought Simple Flow was "
            "finished.",
        answer="So did we, and the epic is real - SV-8683, still Open, with three bug fixes already "
               "shipped that touch screens we hold cases for and two new enhancement stories. We "
               "deliberately did not ingest or author anything, because whether Simple Flow reopens "
               "is your call, not ours.",
        evidence="build/epic-recheck-2026-07-31/EPIC-RECHECK-SUMMARY.md: SV-8683 linked to SV-7301 "
                 "by Milos Vasic on 2026-07-27, the same day he closed SV-7301 Done; 3 of the 7 "
                 "already Done (SV-8497, SV-8581, SV-8680), 1 Ready-to-Fix (SV-8495), 2 net-new "
                 "(SV-8726 rename \"Total Price\" -> \"Total Cost\"; SV-8734 Bulk Approve/Decline "
                 "WO lines). \"Nothing was ingested or authored.\"",
        cases="no case authored - deliberate. Simple Flow's 189 existing cases are untouched.",
        closer="You / the QA lead - this needs a yes/no, not analysis.",
        status="AWAITING ANSWER", risk="MEDIUM",
    ),
    dict(
        project="Cross-project", category="G",
        say="Three Simple Flow cases cite a ticket that does not exist.",
        answer="They cite a placeholder, and it says so plainly. Fabian raised a sell-price concern "
               "on 29 July and no ticket key was ever filed, so rather than invent one we wrote "
               "\"ticket TBD\" and flagged it. They also still need a live check.",
        evidence="build/OUTSTANDING-ITEMS-REGISTER.md section 4: the three cases carry the "
                 "placeholder ref \"Fabian 2026-07-29 sell-price concern (ticket TBD)\"; "
                 "outstanding since 2026-07-29. Standing Rule 20 - a case with no ticket is flagged, "
                 "never silently unsourced.",
        cases=[("SF-RCV-14", 38860), ("SF-RCV-15", 38861), ("SF-VPART-08", 38862)],
        closer="Fabian / you - file it, or send us the key.",
        status="AWAITING ANSWER", risk="LOW",
    ),
    dict(
        project="Cross-project", category="E",
        say="So across all three active projects, how much of this has actually been tested?",
        answer="None of it, against a running build. 749 cases across Report Suite, Schedule and "
               "Filters are written, traced, audited and in the testers' runs - and there is no "
               "environment for any of the three. That is the single biggest thing we need, and we "
               "would rather say it plainly than let \"cases complete\" be read as \"feature "
               "tested\".",
        evidence="474 + 165 + 110 = 749 active cases, all VIU-Pending, verified against the three "
                 "testrail-id-map.csv files 2026-07-31. build/LESSONS-2026-07-31.md framing note: "
                 "\"none of the day's work was live-build verified. None of the three active "
                 "projects has a QA branch yet\". Same figure in "
                 "build/qa-team-responses-2026-07-31/REFINEMENT-CALL-AGENDA.md item 5. Standing "
                 "Rules 12 and 22.",
        cases="all 749 active cases across the three projects.",
        closer="You / engineering, for each of the three environments.",
        status="AWAITING LIVE BUILD", risk="HIGH",
    ),
]

# The Top 10, by likelihood x risk. Values are indices into ROWS, resolved by
# (project, category, first 40 chars of `say`) so a reorder of ROWS cannot silently
# break the ranking.
TOP10 = [
    ("Cross-project", "E", "So across all three active projects, how "),
    ("Cross-project", "G", "You were working from stale specs. Filter"),
    ("Filters", "G", "Your own quality audit read all 110 cases"),
    ("Report Suite", "F", "An automation case says the SBR CSVs carr"),
    ("Filters", "D", "None of the Filters cases cite a Jira tic"),
    ("Cross-project", "G", "I reviewed the run and cases were missing"),
    ("Report Suite", "B", "These three Sales By Customer permission "),
    ("Filters", "B", "The PRD says the Status filter is hidden "),
    ("Report Suite", "F", "Stefan said maybe only 200 of the 500-odd"),
    ("Filters", "F", "Ahtesham's review found conflicts and mis"),
]

# The honest concession list - what we would have to give up if challenged.
CONCEDED = [
    ("Nothing in any of the three active suites is live-verified.",
     "749 cases are written and reviewed and not one has been checked against a running "
     "build. If someone says \"you have not tested anything\", the accurate answer is "
     "\"correct - there is no environment for any of the three projects\". This is not a "
     "QA shortfall we can close ourselves.",
     "The environment for Report Suite, Schedule and Filters, plus the feature-flag state."),
    ("We worked from stale specs - eight versions behind on Filters, five on Schedule.",
     "It cost real coverage (Filters grew 78 -> 127 requirements while our baseline stood "
     "still) and it cost the PO three questions his own document had already answered. "
     "Corrected, and Standing Rule 31 now makes a currency check of every source the first "
     "action of any project task.",
     "Nothing - fixed."),
    ("Our own quality audit missed a contradiction that a junior QA found cold, in one pass.",
     "Two Filters case titles said \"hidden\" while three cases said \"shown greyed out\". "
     "Our sense check was per-case, so it could not see it. Standing Rule 28 now requires an "
     "across-the-suite contradiction sweep, which has since found five more on Filters and "
     "one on Schedule.",
     "Nothing - fixed, and credited to Ahtesham."),
    ("An automation engineer's case was right and two of ours were wrong, against our own spec.",
     "Our SBR CSV cases enumerated the headers \"exactly\" without the Location column that "
     "our own spec added on 29 July. A tester following them would have failed a correct "
     "build. The same gap existed on three more reports. We found it only because his case "
     "disagreed - not by auditing.",
     "Nothing - fixed on all five reports; Standing Rules 40, 41, 42, 43 and 44 exist "
     "because of it."),
    ("The testers' runs had been frozen since 17 July, so reviewers saw false coverage gaps.",
     "113 active cases were missing across six runs, which is why a reviewer reported \"no "
     "case exists\" for coverage we had already pushed. The three runs for the projects we "
     "are actively working - Filters 352, Schedule 357, Reports Suite 359 - were brought "
     "current with every result preserved, and keeping them complete is now a standing duty "
     "rather than a one-off fix (Standing Rules 34 and 47). Runs outside those three "
     "projects are out of scope and are not synced, written to, or audited for missing "
     "cases.",
     "Re-supply the TestRail credentials so the three runs can be re-checked live - they are "
     "believed complete at 110 / 165 / 474 but have not been re-verified since 31 July, and "
     "the check is written up prepared and unexecuted. Run 278 no longer needs a decision: "
     "the 31 July scope ruling closed it."),
    ("Three Sales By Customer permission cases will fail against today's build, deliberately.",
     "The PO ruled one way and the build does the other. We chose to follow the PO and let "
     "the failure be the report. If nobody files the change ticket, a tester will read those "
     "three failures as our defect.",
     "A dev change ticket against SV-8582, and Chris's fix to spec S1-R2. Draft is written."),
    ("Filters cases can never cite a Jira ticket, because Filters has no epic.",
     "Half of our own traceability rule is unsatisfiable on that project. We proved the "
     "absence by listing all 170 SV epics rather than guessing, and we did not invent a key.",
     "The epic key, or your confirmation that the work genuinely is not ticketed."),
    ("Twelve of the 85 Filters design boards still have no rendered picture.",
     "Figma rate-limits image rendering. All twelve are described from their layer trees so "
     "nothing is guessed, but the design pass may not be called complete while the queue is "
     "open.",
     "The Figma token re-supplied on a fresh container; the retry itself is automatic."),
    ("Six of the twelve Report Suite spec-watch items are still not in the specs.",
     "Two of them now actively contradict rulings Chris gave us afterwards, so anyone reading "
     "his written spec against our cases will see a mismatch and read it as our error.",
     "Chris Ward's spec edits - headed by the WIP asset identifier, which he believes he has "
     "already made."),
    ("Twelve Filters Parts/Reports cases are written from designs, not from a numbered spec.",
     "Their traceability is genuinely weaker than the rest of the suite. Branko's question "
     "asking for the numbered write-up came back blank, and we recorded that rather than "
     "inferring an answer.",
     "Branko's numbered per-page write-up (NEW-Q3)."),
]
