# PROJECT-STATE — Invoice UI Refresh

**Canonical cold-resume doc.** Status derived live; do not trust remembered figures (Rule 92 / skill 15 §7).

## Identity
- **Epic:** SV-8218 (owner/assignee Chris Ward) · **PO:** Chris Ward
- **Spec:** Confluence **755990532**, live **v38** (as of 2026-08-21); tech plan built against **v36**
- **Design:** Claude artifact `c88ee207-3197-4f54-8cb9-bac3deb84354` (binding visual reference; static export held)
- **Tech plan:** `intake-2026-08-21/sources/tech-plan-2026-08-12.md` (Symfony/Twig→WeasyPrint + Vue/Quasar)
- **Git dev branch (theirs):** `project/invoice-ui-refresh` · **QA env:** none yet (feature Not started)
- **Case source:** `build/invoice-ui-refresh/cases/` · internal ID prefix **INV** (`INV-<AREA>-NN`)
- **TestRail target:** **UNCONFIRMED** — proposed: new "Invoice UI Refresh" section, suite 1

## Scope (from spec v38)
- **13 stories**, **109 rule IDs** (S1–S13 + G-R1). Documents: Estimate · Invoice (paid = receipt) ·
  Credit Invoice · Parts Sale Estimate · Parts Sale Invoice.
- Epic children: 12 named (SV-9140–9151) + SV-9195 (Story 13) + SV-9193 (batch/imported, **deferred**) +
  5 "Verify:" plan Tasks (SV-9207–9211, not test requirements).

## Status — 2026-08-21
- **INTAKE COMPLETE. 5 of 7 inputs PRESENT.** Authoring **HELD** for the QA lead's go-ahead.
- **NO cases authored. NO TestRail writes. NO Jira.** Greenfield (no prior Invoice-UI-Refresh footprint).
- **Rule-85 project:** SOURCE-VERIFIED ONLY — NO BUILD EXISTS YET.

## How to resume (ordered)
1. `git fetch` + `merge --ff-only` on `claude/slack-session-0sxnd9`; claim the lock.
2. Read `intake-2026-08-21/INTAKE-2026-08-21.md` + `SOURCE-CURRENCY.md`.
3. On go-ahead: run the **v36→v38 + log-vs-body diff** first (Rule 59), then author per skill 01.
