# Maintenance Reminders (MR V2) — exhaustive design drive, 2026-10-06

**Status: IN PROGRESS** (this file is written as the drive runs; the final tables replace this note).

- Package: `build/maintenance-reminder-v2/sources/design-MR_V2_2-2026-10-06/` (Claude Design export "MR V2", taken 2026-10-06)
- Driver: `build/testing-tools/drive_design_full.py` (generic, reusable)
- Load mode: `file://` from inside the package folder, Chromium flag `--allow-file-access-from-files` (without it the
  dc runtime cannot fetch the sibling component boards ShopviewHeader / SettingsSidebar and the app chrome is missing).
  React 18.3.1 / ReactDOM / Babel standalone (support.js loads them from unpkg) are fetched with verified TLS via the agent proxy CA and fulfilled to the browser.

## Progress log
- ShopviewHeader, SettingsSidebar, Maintenance Reminders (index): driven, 100% (see tables below when final).
- Chunk 1: running (3 workers). Chunk 2 → Flow Map → Canned lines → 4-work-order → Demo: running (2 workers).
