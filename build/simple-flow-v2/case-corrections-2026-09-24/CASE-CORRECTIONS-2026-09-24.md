# Simple Flow V2 — case correction + accuracy sweep (2026-09-24)

## Trigger
QA lead showed the live Work Orders settings page: it has **eight** toggles in three groups
(Workflow: Require Approval, Require Review · Line requirements: Require Tech Story, Require Mileage,
Require Engine Hours · Parts: Require Ordering, Require Receiving, Require Picking). Case **C44549**
said *"The page shows four toggles"* — a false statement about the page.

## Root cause
The spec (SV-9247, Story 1) discusses **four** settings because those are the ones SFV2 renames/adds/owns;
it **never says the page shows only four toggles.** The design's own `Work Order PRD.md` §1 lists **eight**
org settings. C44549's "four toggles" was an **author paraphrase that drifted into an inaccuracy** — the
exact failure Rule 113 (verbatim quote) exists to prevent. It had even been marked build-verified READY
(v26.39.0-07c719b, 9/24) by a prior pass without catching it.

## Fix applied (C44549)
- Snapshot: `C44549-SNAPSHOT-before.json`.
- Title: "Settings page shows the four Require settings…" → **"SFV2 Require settings appear named and
  grouped on the Work Orders settings page"**.
- Expected reworded: the four SFV2 settings appear named + grouped; **the page also still shows the other
  existing settings (Review, Tech Story, Mileage, Engine Hours), unchanged (Rule 96 invariant)**; added
  the verbatim Story-1 spec quotes as backing; **it does not claim the page has only four toggles**.
- Marker set to **HOLD - Expected corrected 2026-09-24; re-verify on the sv8683 QA build** (content
  changed, so the prior READY against the wrong text no longer holds). Render re-confirmed fr-view.

## Accuracy sweep of all 64 (count / enumeration language — the C44549 risk class)
Scripted flag of number+UI-noun and "only/exactly/the following" language. ~20 cases use such language.
- **Verified source-accurate against the design PRD.md:** the ⋯-menu enumerations **C44602 / C44603**
  match PRD §3 (part menu: Move · Return · Add Part Fee/Discount · Receive Part last) and §4 (line menu:
  Request part · Uncomplete · Add line note · Save as canned line · Edit labor · Receive parts (n) ·
  Authorization required) **exactly**. The other "only/exactly" usages are standard spec phrasing
  (e.g., "only outstanding steps", "the one new permission").
- **C44549 was the only case that stated a count the sources do not** — now fixed.

## Honest boundary (what remains for the build-verify session)
Source-accuracy I can and did check. **Live-build accuracy — whether the running UI shows MORE than a
case enumerates (the C44549 class) — needs the build, which is the build-verify session's job.** The
flagged enumeration cases are handed to that session to confirm against the live UI:
C44584, C44586, C44589, C44590, C44591, C44595, C44599, C44602, C44603, C44607, C53486, C53488, C53489.
