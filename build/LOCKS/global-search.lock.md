# CLAIM — global-search (Global Search V2, group 6720)
LANE: build-verification
INTENT: (a) READ get_history_for_case on C44897 (QA lead authorised 2026-08-25).
        (b) ONE update_case on C44864 — TITLE ONLY, to repair the <query> placeholder
            TestRail swallowed on import (QA lead approved 2026-08-25). All three text
            fields + refs sent at their exact pre-write snapshot values (core 2.1).
        (c) Back-fill testrail_case_id into build/global-search/testrail-id-map.csv (local file).
        NO add_case. NO delete_case. NO run writes. NO Jira. No other case touched.
STARTED: 2026-08-25T10:20:00Z
EXPECTED RELEASE: ~40 min — when C44864 is byte-verified and the id-map is committed.
SESSION: build-verification lane / claude/slack-session-0sxnd9
