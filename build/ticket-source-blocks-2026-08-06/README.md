# Ticket source blocks — retrofit pass, 2026-08-06

Adds the QA lead's mandated **source block** to the bottom of every defect ticket we had already filed
before the instruction existed. His ruling, verbatim: *"Yes this source block MUST exist for every ticket
you created."*

## Read in this order

| File | What it holds |
|---|---|
| **`FLAGGED.md`** | **START HERE.** The 2 tickets with **no documented source** and the 5 only **partly** supported — each decision-ready, with what it claims, what the build does, exactly where I looked and found nothing, what the expectation really rests on, a recommendation, and the test cases affected. |
| `TICKET-LIST.md` | How the 65-ticket list was derived from our own records (never a Jira author query), the provenance of every key, the live source-currency table, and the version drifts and mis-citations caught. |
| `PER-TICKET-SOURCES.md` | One entry per ticket: source type, the document named, and **the exact block written**. |
| `FINAL-VERIFICATION.json` | All 65 re-read live after the writes — one block each, description above it byte-identical, no other field changed. **65 PASS / 0 FAIL.** |
| `write-log.jsonl` | Per-operation log: HTTP status and the head/tail byte comparison for every write. |
| `snapshots/` | **Pre-edit** full-issue snapshots of all 65, taken before any write. |
| `post/`, `final/` | Post-write and independent re-read snapshots. |
| `specs/` | The eight specifications as read live, plus `SPEC-VERSIONS.json` (the Confluence version register). |
| `stories/` | The 40 epic stories as read live, with their acceptance criteria. |
| `ticket-text/` | Each ticket's description as plain text, pre-edit — what each one actually asserts. |
| `refs-cited.json`, `refs-verified.json` | Every requirement reference each ticket cites, and whether it exists in the **live** specification. |
| `tools/` | `jiralib.py` (cookie-auth REST helper) · `conf.py` (live Confluence fetch) · `verify.py` (ref checker) · `write.py` (the append-and-byte-verify writer) · `final_verify.py` · the three `blocks-*.json` block definitions. |

## Counts

| | |
|---|---|
| Tickets our records claim we filed | 66 |
| Skipped by instruction (**SV-8923**, withdrawn as invalid, no legitimate source) | 1 |
| In scope | **65** |
| Already carried a block (**SV-8937**) — untouched | 1 |
| **Blocks written** | **64** |
| Source type 1 (a story in the epic) | 0 |
| Source type 2 (the specification) | 61 |
| Source type 3 (a product owner answer, with tab + row) | 2 (SV-8879, SV-8880) — plus SV-8881 spec-backed and PO-confirmed |
| **No documented source — the block says so** | **2** (SV-8821, SV-8822) |

## What was NOT touched

No priority, type, parent, link, status, summary, label or assignee on any ticket — proven field by field
against the pre-edit snapshots. No TestRail write of any kind. No test case edited. No new ticket created.
No existing ticket commented on, transitioned or reopened. SV-8923 left exactly as it was.
