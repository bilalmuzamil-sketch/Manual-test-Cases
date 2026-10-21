**What's wrong:** On the Lines tab, a line's Labor text names the technician by their staff record, but the roster (and the Edit Line dialog) uses their login account's name. When the two differ, one person appears under two names.

**Expected:** The staff record name in both places, the same name List, Board View and Tech View show (PRD S5-R11b; Chris, Slack, 20 Oct 2026: "use the staff record name in both places, so the roster changes to match the Labor text… Same timing as #2", i.e. this release if possible, otherwise a fast follow).

**Where:** `DbalLineTechnicianRosterFetcher.php:111-116` prefers the account name (`COALESCE(user, staff)`).
