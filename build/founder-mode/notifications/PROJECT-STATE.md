# Founder Mode → Notifications — PROJECT-STATE

**Feature:** Notifications Center (Founder Mode Batch #1)
**Epic:** SV-9667 · **Spec:** Confluence 817463297 "Notifications Update V1" (read 2026-09-30)
**TestRail:** Founder Mode = section 20434 → **Notifications = 20436**
**Design:** artifact CmsxESdXv2Y2YTGyTVVLg7 (11 canvas boards, driven end-to-end — Rule 115)
**Branch:** `claude/slack-session-setup-7v5itm`
**Build:** ❌ **No QA branch and no tech plan yet** — every case is `AUTOMATION: HOLD`, source-verified
only (Rule 85). To be build-verified once a Notifications QA build exists.

## What was created — 56 cases, Rule 117, one behaviour each

Content sub-folders (one per PRD story S1–S10), 197 spec anchors covered 1:1 (no gap, no duplicate,
no extra — verified by script against `anchor-quotes.json`):

| Story | Sub-folder (section) | Cases | Case ids |
|---|---|---|---|
| S1 Work the inbox | 20450 | 7 | C154651–C154657 |
| S2 Read a notification | 20451 | 5 | C154658–C154662 |
| S3 Compose a note | 20452 | 11 | C154663–C154673 |
| S4 Delete a note | 20453 | 4 | C154674–C154677 |
| S5 The Notifications page & tabs | 20454 | 3 | C154678–C154680 |
| S6 Manage tag groups | 20455 | 13 | C154681–C154693 |
| S7 Manage quick notes | 20456 | 4 | C154694–C154697 |
| S8 Notification preferences | 20457 | 3 | C154698–C154700 |
| S9 Notes on a Part Sale | 20458 | 2 | C154701–C154702 |
| S10 Permissions | 20459 | 4 | C154703–C154706 |
| **Total** | | **56** | C154651–C154706 |

Each case: concise title (≤80), seed values shown as examples beside the standard QA steps that
create them, build-glossary UI wording (bell → Notifications page; tabs Inbox / Tag groups / Quick
notes / Preferences; New Note; New tag group / New quick note dialogs; reference pills "Work Order:
S99-15591" / "Part Sale: P99-4021"; "Customer Visible"; "Mark all read" / "Load more" / "Unread
only"), Expected = runnable observations with the **verbatim source quote** kept under "Exact quotes
… (for reproducibility)" (Rule 113/117).

**Render:** 56/56 rendered clean on TestRail (fr-view repair pass, 2026-09-30).

## Coverage verdict (Rule 115 — every provided source)
- **PRD (Confluence 817463297):** ✅ 100% — all 197 requirement anchors S1-R/N/E covered 1:1.
- **Design (11 canvas boards, driven end-to-end):** ✅ CONFIRM — every board's UI (Inbox before/after,
  Main tab strip, Note modal, Quick-note modal, Tag-groups list + modal, Preferences card, Part-sale
  notes, Delete-note confirm) is represented in the cases; wording taken from the boards matches the
  PRD. No DIVERGE found.
- **Tech plan:** none supplied for Notifications (noted at intake). N/A.
- **Epic/stories (SV-9667):** ✅ the ten stories map 1:1 to the ten content sub-folders.

## Outstanding
- **No QA build** → all 56 cases HOLD; build-verify when a Notifications branch exists (Rule 85).
- **No tech plan** for Notifications — remind the QA lead (Rule 30) if release-note/NFR behaviour
  should be covered.
- Nothing else outstanding.
