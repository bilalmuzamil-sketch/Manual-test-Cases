# C96975 defect draft — sources read live 17 Oct 2026

## PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030
- Read live: 2026-10-17 11:15 UTC via REST /wiki/rest/api/content/845185030?expand=body.storage,version (jira.sh, read only)
- Version: 64 (last edited 2026-10-16T20:42:55.743Z by Chris Ward)
- Lines quoted (storage body, markup stripped):

> S5-R1: Tech View has its own optional-column selection, separate from List. Changing columns in Tech View never changes List, and changing columns in List never changes Tech View.
> S5-R8: Save the Tech View column selection per user across logout/login, devices, and locations. List keeps saving its columns exactly as it does today.

## TestRail C96975 "Tech View keeps its own column choice, separate from List, for each user" — Expected, read live 2026-10-17 11:15 UTC (read only)

> Expected results
> Step 11: List still shows Service Advisor, and List has no Assigned Techs column: Tech View's choice did not touch List.
> Step 15: Tech View still shows Progress: List's choice did not touch Tech View.
> Steps 18, 20 and 23: Tech View shows neither Service Advisor nor Assigned Techs and still shows Progress, after logging back in, in the second browser and at {Location-B}.
> Steps 18, 20 and 23: List keeps its own columns: Service Advisor on and Progress off.
> Source — where this behaviour comes from
> Epic SV-10043; stories SV-10048 (Story 5, Fields to display (Board View) and columns (Tech View)) and SV-10050 (Story 7); PRD "Work Orders — Board View & Tech View Display Options", Confluence 845185030, version 52 (14 Oct 2026, Chris Ward), S5-R1, S5-R8 and S7-R7 (S7-R7 rewritten in version 51 on 14 Oct 2026 (Chris Ward ruling after Sasha Grosman's staging review: Tech View's default columns are the design's 13, and Assigned Techs is on by default), so this case now turns Assigned Techs off, a choice different from the default), read 14 Oct 2026. Review Decisions DR-33 (Tech View's column selection separate from List both ways). Source-verified 14 October 2026. Last checked against build v26.40.19-1493c63 (staging) on 10/16/2026.
> Exact quotes from the source (for reproducibility)
