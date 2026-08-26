# PRD 576978945 — Confluence version 12 (re-verified 2026-08-26)

Live version bumped 11 -> 12 as an UNLOGGED edit (in-body 'Version' still 1.2; no new change-log row).
Full-body comparison v11 -> v12 shows exactly ONE content change:

- **Section 4, Work Orders 'Indexed' fields dropped `status`.** v11: '...service advisor name, status, line item descriptions'. v12: '...service advisor name, line item descriptions'. (Displayed still includes the status badge; ranking section 6.1 still uses WO status as a signal.)

Impact on the 110 V2 functional cases: **NONE** — no case asserts searching a Work Order by status (verified by grep 2026-08-26). Cases are content-correct for v12; only the provenance stamp is re-pinned v11 -> v12. WO-status drop recorded as PO item (PO-REG-6). Honest limit: no persisted v11 body file, so the diff is a careful two-fetch read comparison, not a programmatic diff.
