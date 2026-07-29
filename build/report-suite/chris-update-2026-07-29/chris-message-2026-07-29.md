# Chris Ward group message — 2026-07-29 (VERBATIM)

- **Source:** Slack group message, **Chris Ward, 8:53 AM 2026-07-29**.
- **Recipients tagged:** Parth (developer), Bilal (QA lead).
- **Caveat stated in the message itself:** the change summary was written by Chris's
  assistant and is "pending a human-eye-pass to make sure it didn't break anything".
- **Timing stated:** the spec updates + the companion visualization video are spilling
  to the next night (high priority per Chris).
- **Authority ruling for this ingest:** this message is the NEWEST source
  (last-update-wins) — newer than the kickoff video AND the current six specs.

---

Small status update team!
@Parth @Bilal -- I am still making the changes to the local and the specs that we discussed in kickoff today. It's starting to look like they're going to take too long for me to confidently get a visualization video out before the end of the night. This will likely spill into tomorrow night, though it is a high priority in my mind.
To be clear: This will slightly change all specs with an appropriately updated changelog.
A quick summary (from my assistant - pending a human-eye-pass to make sure it didn't break anything) of what's changing, to ensure no confusion:
All Reports:
-Each report now shows which location(s) it's scoped to, both on screen and written into every export (a "Locations:" line in every CSV and PDF). Fixes the confusion where a multi-location export gave  indication of which locations it covered. Permission scoping is unchanged (users still only see locations they have access to).
-Each report now ensures the same "logo" treatment.
Sales By Customer:
- Assets are now identified by VIN (falls back to Unit #, then plate) instead of the year/make/model label.
- The Print option is removed.
- Exports now come in Summary and Expanded versions, for both PDF and CSV (matching Sales By Rep). Summary = one row per customer; Expanded = the full Customer → Asset → Invoice breakdown. Menu items: Download Summary (PDF), Download Expanded View (PDF), Download Summary (CSV), Download Expanded View (CSV).
Parts Velocity:
-The part type "Catalogue" is renamed to "Special Order" (the Type filter, the Type column, and the export). Same rename applied to the matching dropdown on the Parts Sales report. No data changes — splay/label only.
Technician Utilization:
-Column selector added for visual/natural conformance.
Sales By Representative:
-Renamed in my local, additional flag added to the spec to highlight the padding issue as discussed in kickoff (this change is purely visual for the companion video I will film for the team - just a heads up).
[Second part:] it was surfaced today that Branko and Milos are working on filters project across the entire app, we absolutely will crossover with them. So, for the sake of the time being -- let's build to spec, but PLEASE expect that that portion will change once we have something workable on staging (I've asked Branko/Milos to take a sweep over of our filters once we're on staging -- I am awaiting a response).
