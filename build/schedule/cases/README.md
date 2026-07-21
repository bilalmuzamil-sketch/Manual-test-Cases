# Schedule — cases/ (authoring PENDING)

This folder will hold the authored test-case source for the **Schedule** project
(ShopView App · Technician Scheduling Module), one JSON file per area group, with
internal IDs of the form `SCH-<AREA>-NN` (mirroring the `GS-`/`FLT-`/`SF-`/`FD-`
conventions of the other projects).

**STATUS: EMPTY — authoring has NOT started yet.**

- This onboarding step was **SCAFFOLD + SPEC INGEST + COMPLETENESS ASSESSMENT ONLY**.
  Test cases are authored **after** the user reviews the ingested spec
  (`../requirements.md`) and confirms the authoring plan.
- **VIU (live build-accurate verification) comes later**, once a QA branch /
  environment exists for Schedule (currently unknown — ask the user at VIU).
- When authored: follow Standing Rule 9 (build-accurate, layman wording), Standing
  Rule 4 (any API-touching case → an "API"-titled section — note: the spec currently
  contains NO API endpoints/methods/status codes, so API-section cases may not apply
  unless a backend contract is provided), Standing Rule 16 (import format pure 1:1
  with `testrail-import/*-testrail-import.csv`), and Standing Rule 8 (TestRail Case ID
  + link columns in every deliverable, sourced from `../testrail-id-map.csv`).
- **This is a SPEC-ONLY project right now** — no Figma/designs were provided. Any exact
  on-screen label/state the spec does not pin down must be authored as **"VIU-confirm"**
  and confirmed LIVE at VIU. Do NOT invent labels.

See `../PROJECT-STATE.md` (canonical resume doc) for status, the plan, and
how-to-resume.
