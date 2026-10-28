# Duplicate searches (run live in Jira, 28 Oct 2026)

| Finding | JQL | Hits | Verdict |
|---|---|---|---|
| F2 Tech Efficiency counts declined lines | `project = SV AND (text ~ "\"technician efficiency\"" AND (text ~ "declined" OR text ~ "decline")) ORDER BY created DESC` | SV-6030 (ShopCoach, Obsolete), SV-2386 (WO stats tab, Backlog) | unrelated |
| F2 | `project = SV AND (summary ~ "Technician Efficiency" OR summary ~ "Tech Efficiency" OR parent = SV-9575 OR summary ~ "invoiced tech hours") AND created >= 2026-06-01 ORDER BY created DESC` | SV-11905 (Efficiency column sort, Open, 2026-10-28), SV-11297, SV-10934, SV-10932, SV-10894, SV-10887, SV-10884, SV-9127, SV-8985, SV-8245, SV-7850 (extreme % near zero clocked — OBSOLETE), SV-7573 | none about declined lines |
| F4 Revenue after discount | `project = SV AND (text ~ "\"before any discount\"" OR (summary ~ "Revenue" AND (summary ~ "discount" OR text ~ "discount"))) AND created >= 2026-06-01 ORDER BY created DESC` | 0 | none |
| F1 Utilization open timesheets | read SV-11688 directly | SV-11688 Ready to Fix (assignee Dusan Radulovic, updated 2026-10-23) | **already reported — no new ticket** |
