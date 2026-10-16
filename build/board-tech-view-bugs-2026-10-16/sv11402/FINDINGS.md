# SV-11402 — Tech View: dragging a pinned technician's header opens the work order where it is released

**Verdict: PASSED, 6 of 6.** Jira comment **78920**, 16 Oct 2026; row 1 corrected in place 18:43 CDT (order "updated"
was true for the Tech run only; the admin run kept the order).

## Source currency
PRD v64 (S9-R9, S9-R10, S2-R8 unchanged since v55) · ticket TESTING STAGE, Slavcho Mitrov, only Chris Ward's two
comments (environment Chrome/Windows/mouse) · build staging v26.40.19-754919e unchanged start → posting.

## Matrix (`data/d02b-tech.json`, `d02b-admin.json`, `d02bx2-admin.json`; search "ZZAUTOTEST F2 Tech Pin Order")
| Case | Tech (view-only) | Admin (can drag WOs) |
|---|---|---|
| A pinned grip → row in pinned area (S2-35338), down | no open, order changed | no open, order kept |
| B pinned grip → row of unpinned tech (S2-35339), down | no open, moved to end of pinned group | same |
| C pinned by NAME → row, down | no open, stays pinned | same |
| D unpinned grip → row in pinned area, up | no open, stays first unpinned | same |
| F pinned grip → row, up | no open, order kept | same |
| E plain click on S2-35339 | opens /workorders/2c136a90…/lines | same |
0 navigations recorded during every drag. Assignments unchanged afterwards (`w02.mjs`: S2-35338 → Ahtsham Foreman,
S2-35339 → Ahtsham Parts Manger).

## Facts learned
- Pins are capped at **3**: with 3 pinned, every other pin button is disabled (Tech had Ana Alpha + Ben Bravo pinned).
- The shared admin's pins were changed by another session mid-pass (two pins appeared, later gone); every run snapshotted
  and restored only `pinnedTechnicianIds`, `technicianOrder`, `collapsedGroups`, read back equal each time.
- Own script bug caught: the group-toggle id prefix is 30 characters (`button_tech_view_group_toggle_`), not 31.

## Film
`VR02.mjs` (admin), anchored + `idle_cut_voiced.py`: 48.6 → 37.8 s. Prefs restored (read back equal).
