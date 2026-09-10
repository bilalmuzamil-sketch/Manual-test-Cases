# Source-verification reconciliation — C43850 (Report Suite / WIP report) — REPORT ONLY

- **Case:** C43850 "Report Location scope follows the signed-in user's enrollments"
  https://shopview.testrail.io/index.php?/cases/view/43850 · **created_by 1 = Vladimir Tomovic → HANDS-OFF
  (Rule 38): assessed and reported, NEVER edited, and we do not ask per-case to edit it.**
- **Reconciled 2026-09-10, three ways (Rule 106):** the CASE's Expected (live from TestRail) · the SOURCE as
  it reads today (fetched live) · the BUILD (NOT observed this pass).

## 1. The case's Expected (live, separated-steps format)
On the Work In Progress report, the Location filter offers the workplaces the signed-in user is **enrolled**
in: enrolling the user in a new workplace (Administration → Staff → your row → Departments → "Manage staff
enrollments") makes it appear as a Location option; removing the enrollment makes it disappear. Precondition
frames the report as opening at "its documented default location scope" once the remembered view is cleared.

## 2. The source, quoted verbatim (read live 2026-09-10)
- **WIP (Work In Progress) Report PRD**, Confluence page **703660034** (space Chris Ward; lastModified
  2026-08-24; version integer not retrievable via the API call — not invented):
  - **S7-R9:** "The toolbar has a **Location** filter (rightmost), a multi-select listing the locations the
    signed-in user can access, with an 'All locations' / 'Clear all' toggle. On a first visit it defaults to
    the user's currently active location."
  - **S7-R11:** "The location scope is always constrained to the locations the user can access; a location the
    user cannot access is never included, and if the selection resolves to none, the report falls back to the
    user's currently active location."
  - **S8-R7 / S8-R8:** the report remembers the location selection and restores it; a saved value no longer
    valid falls back to that setting's default.
- **Single-location hiding** — the WIP PRD is SILENT on hiding the filter control; governing source is the
  Parts Velocity Report PRD, page **620888066**, **S2-E4**: "A user with access to only one location does not
  see the Location filter; it is hidden for a single-location user" — the same requirement recorded for WIP in
  bug **SV-8879** plus PO Chris Ward's spreadsheet answer (5 Aug 2026): "hide it".

## 3. Verdict — SUPPORTED IN SUBSTANCE, with two wording/scope divergences to flag to the author
- **Core behaviour AGREES:** the Location filter is scoped to the locations the user can access, and the
  enrollment mechanism is how that access is granted, so enrolling/unenrolling legitimately changes the
  options. The "hidden below two locations" precondition also agrees (via the parallel spec + PO answer).
- **Divergence 1 (terminology):** the source governs by **"the locations the signed-in user can access"**;
  the word **"enrollment" appears nowhere in the WIP PRD**, nor does the "Manage staff enrollments" route.
  Behaviourally equivalent, but the case asserts a term the source does not use (Rule 102 wording-to-source).
- **Divergence 2 (default scope):** the source says the default when nothing is remembered is the user's
  **single currently-active location** (S7-R9/S7-R11), NOT all accessible/enrolled locations. If the case's
  "documented default location scope" is read as "all enrolled locations," that contradicts the source.
- **Build leg:** not observed. Its automation failure is most likely the "no browser reload" live-refresh
  assumption in the steps (a timing/caching question), not a source contradiction.
- **Action:** REPORT to the QA lead. **No edit** — Vladimir's case (Rule 38). If he wants the wording aligned
  ("locations the user can access"; default = currently-active location), that is Vlad's change to make.
