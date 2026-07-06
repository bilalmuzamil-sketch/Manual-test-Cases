# Fees and Discount project — STATUS

**STATUS:** Verification done; feature **NOT yet deployed** on staging (org flag on,
but no backend/UI). **Waiting for dev deploy (~2h)** as of 2026-07-06.

**On resume:** fresh cookies → **re-verify live** (fe-permissions has F&D key, WO JSON
has adjustments collection, endpoints 200, UI renders) → **full VIU** across all
surfaces → **Excel** (with a VIU tab) → **TestRail only after user approval**.
Step-by-step playbook: `build/fees-discounts/RESUME-STRATEGY.md`.

**Have (complete):**
- COMPLETE spec — `requirements.md` (Stories 1–14, §5 calc contract, Story 13 perms).
- COMPLETE designs — `design-notes.md` (from 5 HTML mockups + design↔spec discrepancies).
- Loom transcript (summary) — `/tmp/fees-discounts/loom-transcript.txt` (ephemeral).
- Staging admin access proven (quick-login admin + boot2 + MITM bridge).

**Verified (see `viu-findings.md` + `screenshots/`):**
- `FeesAndDiscounts` flag **ENABLED** for org `d55bc308-…`.
- Feature **NOT exercisable**: no F&D permission in fe-permissions, no adjustment
  fields on work orders, all fees/discounts endpoints 404, and ZERO F&D controls
  render on any surface (WO / parts / customer / admin).

**Do not write final cases until the feature is confirmed live and VIU'd.**
</content>
