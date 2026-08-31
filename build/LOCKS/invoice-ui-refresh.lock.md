# CLAIM — invoice-ui-refresh (Invoice Refresh, group 6559, run R417)
LANE: build-verification
INTENT: BUILD VERIFICATION of our 89 cases against sv8218 (v26.35.5-8c3cc21), authorised by the
        QA lead 2026-08-31 with source confirmed at spec v45.
        - drive each case live; five runnability checks; evidence per case
        - update_case on OURS ONLY where preconditions/steps need to be build-accurate, and to
          lift the marker + stamp the "last checked against build" line
        - 30 FOREIGN cases (created_by=6) are HANDS-OFF (Rule 38) — reported, never touched
        - 5 Automated cases (C44919 C44920 C44921 C44922 C44985) HELD for his yes/no (Rule 71)
        - run R417: union-only sync if the suite changes; NO result writes
        NO add_case. NO delete_case. NO Jira.
NOTE: supersedes the test-case-creation lane's 2026-08-21 intake claim, which the QA lead confirmed
      on 2026-08-31 is finished ("that's a good strategy for now, we will start build verification
      when I give you a go ahead"). Previous claim text preserved in git history.
STARTED: 2026-08-31T09:25:00Z
EXPECTED RELEASE: when the pass reports, or on a blocker.
SESSION: build-verification lane / claude/slack-session-0sxnd9
