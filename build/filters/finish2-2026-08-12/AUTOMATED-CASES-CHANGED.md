# AUTOMATED CASES CHANGED — FOR VLAD (Filters finish2, 2026-08-12)

Recorded under **Standing Rule 65**. The marker meant is TestRail's own field
**`custom_atmstatus`** (3 = Automated), captured **at write time**, not our `AUTOMATION:` text marker.

## ONE case we changed carries the flag

| Case | `custom_atmstatus` at write time | What changed, in one phrase | Does it change what an automated check should conclude? |
|---|---|---|---|
| [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) — *Imported works alone: picking it greys out the other filters* | **3 — Automated** | The "last checked against build" line now says `v3.6-3e9dd6d on 12 August 2026` instead of `v3.4.2-d00239b on 8/5/2026`. **Nothing else** — the steps, the expected results, the title, the `refs` and the automation marker are byte-identical. | **No.** It is a provenance date. The assertion an automated check makes is unchanged. |

**Worth telling Vlad anyway, because it is about his case and it is good news:** C38877's step 3 was
**driven successfully for the first time** on this build. Ticking **Imported** sets `?status=imported`
and disables the other four chips (`disabled=true`, `opacity 0.7`); picking a second status
**deselects Imported**. So the exclusivity rule holds, and the case is safe to automate as written.

**And one durable fact he will need**, which cost this project three failed attempts across two
passes: the status options are **`DIV[data-test-id^="filter_option_"]`** — `filter_option_status_approved`,
`…_imported`, and so on. They are **not** `label` elements and **not** `.q-item`; both of those
selectors match nothing, so a check built on them **silently reports "no options" and cannot fail**.

## The other three Automated cases were NOT touched

**C29600, C29614, C29623** carry `custom_atmstatus` = 3 and **were not written to** in this pass.
C29614 was *read and driven* but not edited.

**Who set the flag:** on Filters these were set by hand by Vladimir Tomovic (established 2026-08-11),
so unlike Schedule's they are real signals and not an artefact of our own `add_case` tooling.
