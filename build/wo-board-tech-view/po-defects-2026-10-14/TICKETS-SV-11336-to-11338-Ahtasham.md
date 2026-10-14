# Ahtasham Amjad's design defects, 14 Oct 2026 (read-only fetch; full descriptions in Jira)
Slack (Ahtasham, #fs channel C0C41RV3T3L, relayed by the QA lead): three more defects + two product questions.

- **SV-11336** (Story Defect, parent SV-10048, created 2026-10-14T15:35 -0500): Tech View group header and row, Board column
  header and card show the user account name, not the staff record name List's Lead Technician shows (S2-15824 List "Jacqueline
  Calderon" vs views "Brent Avila"; S2-17338 "Kenneth Oconnor" vs "Douglas Fields"). Expected per S5-R11b (PRD v51).
  **Our case: C581895 "Cards and headers show the technician's staff record name, as the List does" (created 14 Oct from PO answer 4).**
- **SV-11337** (parent SV-10046, 15:47): Board View card text smaller/lighter than the design (Detailed cards, ~262 px): design
  number ~15px, customer ~15–16px weight 600, unit · asset ~13px, total price ~16px weight 600; build 14/14/12/14 px weight 500 and
  the same at every density (only padding 10×12/12/16 and card height 148/160/197 change). No PRD sentence.
- **SV-11338** (parent SV-10045, 15:57): Tech View and Board View header avatar for a technician with no photo is solid blue
  (rgb 56,116,255) with white initials; design: light-grey circle with dark initials (e.g. "BM" Brenda Martinez); header name design
  ~16px weight 600, build 14px. Cites S2-R12 / S3-R12 (name, avatar, count — no style sentence).

Product questions Ahtasham asked Chris on Slack (14 Oct): (1) PRD S2-R11 keeps pinning in Tech View, but the design's Tech View
header has no pin icon — keep the pin as staging has it? (2) On a Board card, More actions (hover / keyboard focus) covers part of
the status badge; the design doesn't show this state — acceptable, or should the badge stay fully visible?
