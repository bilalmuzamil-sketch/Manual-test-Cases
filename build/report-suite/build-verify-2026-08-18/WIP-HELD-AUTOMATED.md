# WIP-HELD-AUTOMATED — Automated WIP cases HELD for ask-first ratification (2026-08-18)

**Rule 71 / skill 03 §5.4, §6.4.** These 10 WIP cases carry TestRail's own **`custom_atmstatus = 3`
("Automated")** — re-confirmed **LIVE** this pass (2026-08-18, all 10 still atm=3). They are the contract
Vladimir Tomovic's automation runs against, so **they were verified live but NOT written.** The intended
change per case is recorded below for the QA lead's **ask-first** go-ahead; on approval the edit is made
**coupled with build verification** (skill 03 §6.4) and the case number handed to Vlad (Rule 65 / register
`build/fabian-review-2026-08-17-CONSOLIDATED/AUTOMATED-CASES-REGISTER.md`).

**Who set the flag:** these are Report-Suite cases; on this project the `custom_atmstatus=3` flag is
Vladimir Tomovic's own (not our `add_case` tooling). They are genuinely Automated and must not be edited
without his awareness.

**Build verified against:** `v3.8-bd246fd` · Location Staging Heavy Duty - 9919 · Admin.

| Case (C-id) | internal | live marker (atm=3) | live observation | intended change (ON APPROVAL) | affects what Vlad's check concludes? |
|---|---|---|---|---|---|
| [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | WIP-TAB-02 | `AUTOMATION: READY` | Tab structure present, counts match API | refresh Rule-54 sentence-2 → `Last checked against build v3.8-bd246fd on 8/18/2026.` (body unchanged) | **No** — metadata only |
| [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) | WIP-SCOPE-05 | `Not available on Build to test Yet` | line-state scope feature present | **LIFT → `AUTOMATION: READY`** + sentence-2 | **Yes** — marker moves deferred→ready |
| [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | WIP-PLACE-01 | `Not available on Build to test Yet` | tab placement by line state present | **LIFT → `AUTOMATION: READY`** + sentence-2 | **Yes** — marker moves deferred→ready |
| [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | WIP-SUM-02 | `AUTOMATION: READY` | summary strip present | refresh sentence-2 (body unchanged) | **No** — metadata only |
| [C30498](https://shopview.testrail.io/index.php?/cases/view/30498) | WIP-FLT-01 | `READY - EXPECT FAIL (SV-8968)` | SV-8968 **OBSOLETE** (verified live); filter server-recompute reproduces | **STRIP → plain `AUTOMATION: READY`** (no live backing), remove symptom block, sentence-2 | **Yes** — expect-fail→ready changes the automated conclusion |
| [C30508](https://shopview.testrail.io/index.php?/cases/view/30508) | WIP-PERS-03 | `Not available on Build to test Yet` | column-persistence feature present | **LIFT → `AUTOMATION: READY`** + sentence-2 | **Yes** — marker moves deferred→ready |
| [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | WIP-EXP-01 | `AUTOMATION: READY` | exports present (PDF/CSV), download works | refresh sentence-2 (body unchanged) | **No** — metadata only |
| [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | WIP-EXP-06 | `AUTOMATION: READY` | exports present | refresh sentence-2 (body unchanged) | **No** — metadata only |
| [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | WIP-EXP-09 | `Not available on Build to test Yet` | export feature present | **LIFT → `AUTOMATION: READY`** + sentence-2 | **Yes** — marker moves deferred→ready |
| [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | WIP-PERM-02 | `AUTOMATION: READY` | permission-gated behaviour (WO link) present in report | refresh sentence-2 (body unchanged) | **No** — metadata only |

**Summary of intended changes:** 5 lift/strip that change the automated conclusion (C30460, C30462,
C30498, C30508, C30518) + 5 metadata-only sentence-2 refreshes (C30452, C30488, C30510, C30515, C30527).
**NOTHING WAS WRITTEN to any of the 10.** All `custom_atmstatus=3` preserved (untouched).
