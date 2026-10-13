# Audit — SV-9797 / SV-9803 / C44952 reconciliation · 2026-10-13

**Outcome: 1 Jira write (a comment on SV-9797). 0 TestRail writes — C44952 was already correct
and was left byte-identical.**

Supersedes the open question left by
`build/invoice-ui-refresh/execution-2026-09-07/AUDIT-C44952-ticket-repoint-2026-09-07.md` §4,
which asked the QA lead to rule on which of the two tickets was the live home. **That question
has been answered by events** — see §2.

---

## 1 · Per-case / per-issue operation log

| # | Operation | Target | Endpoint | HTTP | Verification result |
|---|---|---|---|---|---|
| 1 | `getJiraIssue` + changelog (read) | SV-9797 | `GET /rest/api/3/issue/SV-9797` | **200** | OBSOLETE / Done, parent epic SV-8218, labels none, Product Area `Work Orders`, 1 comment (ours, 2026-09-07 14:27:40). Last changed **2026-09-07 14:30:37 −0500**; untouched since. |
| 2 | `getJiraIssue` + changelog (read) | SV-9803 | `GET /rest/api/3/issue/SV-9803` | **200** | OBSOLETE / Done, parent story SV-9147, label `fs_invoice_refresh`, assignee **Chris Ward**, 1 comment — **his adjudication**, 2026-09-07 17:16:38. Closed by **him** at 17:16:39. Untouched since. |
| 3 | `searchJiraIssuesUsingJql` (read) | project SV, created ≥ 2026-09-07, text ~ Remaining Balance / paid banner / S8-R9 | `POST /rest/api/3/search/jql` | **200** | 50 hits; **no third ticket carries this finding.** Re-filed nowhere. |
| 4 | `searchJiraIssuesUsingJql` (read) | project SV, `summary ~ "Remaining Balance"` | same | **200** | 12 hits across all time; only SV-9797 and SV-9803 relate to S8-R9. |
| 5 | `searchConfluenceUsingCql` (read) | spec page `755990532` | `GET /wiki/rest/api/search` | **200** | *Invoice UI Refresh*, owner Chris Ward. **Last modified Oct 07, 2026** — the page has moved again since the v64 amendment. Version integer not returned (the known `BLOCKED-confluence-version-integers` limitation). |
| 6 | `get_case` (read) | **C44952** | `GET /api/v2/get_case/44952` | **200** | `custom_expected` **1,236 bytes**, sha256 `c61db168b1bae7f13ef006c23f8c22f2991edab38f4658b76d688c1d7045fd28`. **`SV-9803` ×0 · `SV-9797` ×0** · `<br>` ×7 · `AUTOMATION: READY`. `created_by = 3` (ours). `custom_atmstatus = 1` (Not Automated). `refs = "SV-9147 (S8-R9; G-R1)"`. `updated_on = 1788853798` = **2026-09-08 07:49:58 UTC**, `updated_by = 3`. |
| 7 | Rule 6 / 38 gate — authorship | C44952 | same payload | 200 | **PASS.** `created_by = 3` (ours). Not user 1 (Vladimir Tomovic). |
| 8 | Rule 71 gate — Automated flag | C44952 | same payload | 200 | **PASS.** `custom_atmstatus = 1` — not flagged Automated. |
| 9 | Decision gate — does the case name a dead ticket? | C44952 | same payload | 200 | **NO.** It names **no ticket at all**, which is the correct state now that both tickets are closed and the finding is resolved by a spec amendment. Brief's own rule: *"or no ticket at all if neither is live"*. |
| 10 | **`update_case`** | C44952 | — | **NOT ISSUED** | **Withheld — the case already reads correctly.** Brief: *"If the case already names the winner, change NOTHING."* |
| 11 | **`addCommentToJiraIssue`** (write) | **SV-9797** | `POST /rest/api/3/issue/SV-9797/comment` | **201** | Comment **id 78608** created 2026-10-13 11:09:48 −0500. Supersedes the stale pointer; the 2026-09-07 comment was **left in place, not deleted**. |
| 12 | Re-read verification | SV-9797 | `GET /rest/api/3/issue/SV-9797` | **200** | **PASS.** 2 comments now (`76138` original + `78608` correction), both present. Status still OBSOLETE / Done, parent still SV-8218. |
| 13 | Re-read verification | SV-9803 | `GET /rest/api/3/issue/SV-9803` | **200** | **PASS — untouched.** `updated = 2026-09-07T17:16:39.310−0500`, unchanged by this pass. |
| 14 | Re-read verification | C44952 | `GET /api/v2/get_case/44952` | **200** | **PASS — byte-identical.** sha256 `c61db168…45fd28` before **and** after; `updated_on` still `1788853798`. Nothing this pass reached the case. |

**TestRail writes this pass: 0. Jira writes this pass: 1 (one comment, no transition, no field change).**

**Served-page `markdown fr-view` scan: NOT APPLICABLE.** That gate exists to verify a TestRail
`custom_expected` write. No TestRail write was issued, so there is nothing to verify and no
Playwright/Froala session was opened. Claiming the scan here would be claiming a scan that did
not run (Rule 82's honesty clause).

---

## 2 · Why the 2026-09-07 question no longer needs the QA lead

The earlier audit halted and asked which ticket was the live home. **Chris Ward answered it
himself, in the system of record, at 17:16 that same day** — about three hours after our two
sessions stopped transitioning the tickets, and the earlier audit simply predates it.

| Time (2026-09-07, −0500) | Who | Event |
|---|---|---|
| 14:30:37 | us | Last of our churn. SV-9797 OBSOLETE/Done, SV-9803 Open. |
| ~14:32 | us | The earlier audit's read — **this is where its picture stops.** |
| **17:16:38** | **Chris Ward** | Comment on **SV-9803**: *"Not a defect. The spec was wrong, and I have amended it."* |
| **17:16:39** | **Chris Ward** | **SV-9803 → OBSOLETE / Done.** |
| 2026-09-08 07:49:58 UTC | us | **C44952 rewritten** to the amended spec: Remaining Balance removed, provenance re-stamped to **specification version 64**, marker moved `AUTOMATION: HOLD` → `AUTOMATION: READY`. |

His ruling, in his words: S8-R9 is not marked net-new, so Section 4's standing principle
decides it — *"a rule that is not net-new and disagrees with production gets amended to describe
production"*. He credited the sha256 chunk-hash evidence as what settled it. He recorded the
amended spec as **v64**, and noted that **OBSOLETE is the only no-fix-required close on that
workflow** — so his OBSOLETE on SV-9803 carries no adverse judgement on the finding.

**Therefore SV-9803 is the authoritative home.** Not because it is open — neither ticket is —
but because it is the one the PO engaged with and ruled on. SV-9797 is the duplicate, and its
only comment claimed the opposite.

**Rule 110 attribution check.** The v64 claim is Chris Ward's own statement, attributed to him
as such in the comment written (not asserted by us). It is independently corroborated by our own
2026-09-08 live read of the spec, recorded in C44952's provenance line. The Confluence version
integer itself could not be read (row 5).

---

## 3 · What was deliberately NOT done

| Not done | Why |
|---|---|
| Transition SV-9797 | Already OBSOLETE / Done — the correct terminal state for a duplicate. A transition would be a write with no effect. |
| Comment on SV-9803 | It carries the PO's ruling and nothing contradicting it. The *"Superseded by SV-9797"* comment the brief expected is **no longer present** (comment count = 1, his only). Adding to a cleanly closed ticket is noise. |
| Delete the stale 2026-09-07 comment on SV-9797 | Explicitly barred — superseding text is fine, erasing history is not. |
| Correct SV-9797's Product Area (`Work Orders`, should be `Customer Portal`) | Set wrongly by us at 14:27:29 on 2026-09-07. It is a closed duplicate that nobody should be routed to; leaving it mis-filed is harmless and arguably preferable to another write. **Flagged, not fixed.** |
| Any TestRail write | The case is already correct (rows 9–10). |
| Any Jira **creation** | Barred by the Rule 62 creation hold. Nothing here required it. |

---

## 4 · OUTSTANDING — what I need from you

1. **The Invoice UI Refresh spec page moved again on 2026-10-07** (row 5), a month after the v64
   amendment our cases are stamped against. C44952 and its section-6749 siblings cite
   *"specification version 64, read on 8 September 2026"*. **That provenance is now possibly
   stale.** Nothing is known to be wrong — this is a currency flag, not a defect. Worth a
   source-check pass on section 6749 (Rules 31 / 32 / 59). **Not run — it needs your go-ahead
   (Rule 81: source verification is offered and gated, never auto-run).**
2. **Nothing else outstanding on the two tickets or on C44952.** Both tickets are closed, the
   record is consistent, and the case is runnable as written.

---

**SV-9797:** https://shopview.atlassian.net/browse/SV-9797 — OBSOLETE / Done (duplicate)
**SV-9803:** https://shopview.atlassian.net/browse/SV-9803 — OBSOLETE / Done (**the record**, PO-ruled)
**C44952:** https://shopview.testrail.io/index.php?/cases/view/44952 — unchanged, names no ticket
**Section:** 6749 "Paid Banner, Payments and Balance" · Invoice Refresh (Aug 2026)
