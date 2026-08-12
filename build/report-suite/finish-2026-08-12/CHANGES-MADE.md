# CHANGES MADE

**3 cases changed. All `update_case`. All HTTP 200, 30 fields compared each, 0 mismatches,
verified by re-GET and byte comparison — never by `updated_on`.**

A previous pass prepared these three and ran out of budget before writing. **I re-verified every one
against the build before writing, and applied something different in all three cases** — see
`DIVERGENCES.md` for the evidence and the reasoning.

| Case | Prepared by the earlier pass | What I actually applied | Why |
|---|---|---|---|
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | `AUTOMATION: HOLD` | **`READY - EXPECT FAIL (SV-9074)`** + the symptom and three outcomes | The tester CAN start it, the ticket is live (`In Progress`), and a hold would disarm a case on a **final** report the day before release |
| [C43591](https://shopview.testrail.io/index.php?/cases/view/43591) | `AUTOMATION: HOLD` | **same** | same |
| [C38913](https://shopview.testrail.io/index.php?/cases/view/38913) | `AUTOMATION: HOLD` | **marker left as `READY`**; added a verdict-free note that step 8 cannot be performed | 7 of its 9 steps run fine; only step 8 is unrunnable, and there is no live ticket to back an expect-fail marker |

All three also had their Rule-54 sentence 2 re-stamped to
`Last checked against build v3.7-4626299 on 12 August 2026.` — replaced in place, never appended.

## Deliberately NOT changed

- **No step and no expected result was rewritten to match the build.** C30107 and C43591 remain
  correct against Sales By Customer specification v17.
- **No `EXPECT FAIL` marker was removed** on the strength of a closed ticket, even though 57 of the 60
  tickets those markers point at were closed in a two-minute sweep on 9 August. That is a change to
  ~75 cases and it is the QA lead's call (`DIVERGENCES.md` §4).
- **No mass re-stamp.** 469 cases keep older build lines, which are true statements about when they
  were last checked. See `COMPLETION-REPORT.md` for why.
- **The 12 foreign cases were not touched** and are proven byte-identical.
- **No sibling case was "made consistent."** C38912's hold may be disarming a runnable case; it is
  flagged for the QA lead, not edited.
