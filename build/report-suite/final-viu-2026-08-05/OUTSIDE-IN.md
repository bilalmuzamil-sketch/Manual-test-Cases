# Report Suite — OUTSIDE-IN GAP HUNT (Standing Rules 45 + 46)

Five checks. **"Not applicable" is a permitted answer; silence is not.**

---

## (a) FOREIGN-COVERAGE DIFF — BOTH DIRECTIONS

**The population:** 5 foreign cases, **C38919–C38923**, all authored by **Vladimir Tomovic** (user id 1;
we are user id 3). **Not one was edited, moved or deleted** (Rule 38) — proven byte-identical including
`updated_on` and `updated_by` in `testrail-execution-log.md`.

### Direction 1 — do THEIR cases duplicate OURS?

| Their case | Their assertion (title) | Our counterpart | Verdict |
|---|---|---|---|
| C38919 | TU column selector hides Est. Lost Labor, persists across reloads | TU-COL-01 C38859, TU-COL-* set | **AUTOMATED EQUIVALENT** of coverage we hold |
| C38920 | PV Location column is scope-governed — hidden at one location | PV-FILT-14 C38914 | **AUTOMATED EQUIVALENT — and it agrees with the SPEC, not with our edited case** (see below) |
| C38921 | IV CSV export carries the As of and Locations metadata lines | IV-EXP-04 C30590, IV-EXP-02 C30588 | **AUTOMATED EQUIVALENT** |
| C38922 | WIP CSV export gains the Locations line while its column semantics hold | WIP-EXP-02 C30511 | **AUTOMATED EQUIVALENT** |
| C38923 | SBR Summary and Expanded CSV exports carry the Location column at its designated slot | SBR-EXP-10 C30285, SBR-EXP-11 C30286 | **AUTOMATED EQUIVALENT** — this is the case that exposed our four-report export gap on 2026-07-31 |

### Direction 2 — assertions in THEIR cases with NO counterpart in ours

**Result: none.** Every one of the five maps onto coverage we hold. **No CANDIDATE GAP this pass.**

### ⚠️ ONE CONTRADICTS-OURS — and HE IS RIGHT AGAIN

**C38920**, quoted from its title: *"PV Location column is **scope-governed** — hidden at one location."*

Our **PV-FILT-14 = [C38914](https://shopview.testrail.io/index.php?/cases/view/38914)** said, until this
pass, that the column is in the column-selection control and the tester can switch it off.

**The Parts Velocity specification, v5, S3-R10, verbatim:** *"The column is auto-managed by the location
scope (it is not one of the 20 columns in the picker, S4-R1, and **is not user-toggleable**) and is hidden
entirely when a single location is in scope."*

**His case matches the specification. Ours did not.** This is the **second time** (after C38923 on
2026-07-31) that an automation engineer's case, carrying no `refs` at all, has been the thing that caught a
real error in ours — and Rule 44 is explicit that a missing `refs` is a traceability shortcoming of his
case, never evidence about the build.

**Action taken:** **ours** was repaired (§4 of `FINDINGS.md`). **His was not touched.** Nothing was raised
with him, because there is no disagreement left to raise — we were wrong and we have said so.

---

## (b) THE AUTOMATION-ENGINEER LENS — "what would I assert from the running build?"

**Applicable this pass for the first time in a while, because the session is alive.** Applied to the export
surface, it produced the real evidence in `FINDINGS.md` §3.3–§3.7 — and it is what caught two things a
document read could not:

- the **Location column genuinely disappearing** when one of two accessible locations is selected — the
  concrete fact that makes SBC v14 S4-R12 unmet and the other five specs met;
- the **`last_12_months` rejection**, which no amount of spec reading would have surfaced.

**Honest limit (Rule 12):** the lens was applied to the **API and the downloaded files**, not to the
rendered screens. Anything that exists only in the DOM — the column-selector panel's contents, the date
picker's list, the page controls — **was not driven this pass**, and every conclusion that would need it is
held rather than asserted.

---

## (c) THE HOSTILE-REVIEWER LENS — run BEFORE delivery

What a reviewer would say, and the answer, in advance:

| The challenge | The honest answer |
|---|---|
| *"You said 440 are ready to automate — so 440 pass?"* | **No.** `READY` means automatable. The pass/fail verdicts are the 2026-08-04 ones and are two builds old. Stated in `FINDINGS.md` §7 and in the readiness legend. |
| *"Fifteen cases are on HOLD for a column. Isn't that your own mess?"* | **Partly, yes.** The specs contradict each other, which is Chris's; but a previous pass of ours wrote the ambiguous reading in as a requirement and overwrote a correct line. Register entry 1, risk HIGH. |
| *"You were asked to seed the logo state and didn't."* | Correct. Two other workers share the organisation, and the requirement has since been written down. Register entry 3, risk MEDIUM. |
| *"You claim 440 legitimate cases — did you read them?"* | Not individually today. Reached by exhaustive pattern elimination. Register entry 6. |
| *"Vlad found your error again."* | **Yes, for the second time.** §(a) above says so plainly, names the requirement he matched and we did not, and records that we fixed ours. |
| *"Four of your cases aren't in the test run."* | True, and we may not write to it. Register entry 7. |

---

## (d) EVERY EXTERNAL SIGNAL TREATED AS A COVERAGE INPUT

| Signal | Logged? | Diffed against the suite? | Outcome |
|---|---|---|---|
| The QA lead's correction of principle (2026-08-05) | yes | **yes — all 473** | the audit; 42 cases repaired |
| His clarification on "matched to the build" | yes | yes | audit §10 — a clean negative, plus the answer that the contamination entered via an answer-ingest pass, not a VIU pass |
| Chris Ward's spec edits (SBC v14, PV v5, saved during the pass) | yes | yes | 10 requirement-level verdicts; 4 of our open items settled |
| Vladimir Tomovic's C38920 | yes | yes | **our case was wrong; repaired** |
| SV-8819 moving to `Done` | yes | yes | the stale "known issue" line had already been removed on 2026-08-04; correct |
| SV-8821 moving to `OBSOLETE` | yes | yes | **not reopened, not "restored"** (Rule 53 corollary) — reported |

---

## (e) NO "COVERED" VERDICT WITHOUT BOTH TEXTS QUOTED — and one row PER ASSERTION

Complied with throughout `../expected-behaviour-audit-2026-08-05.md`: every Class A, A\*, B and D case
carries the case text and the requirement text side by side, and **the three cases I was most confident were
wrong were cleared by quoting the spec against them** (C30356, C30336, C30384 — §6 of the audit). That is the
clause working as intended: it stopped me "repairing" three correct cases.

**One row per assertion:** SBC v14 **S4-R13** makes two assertions — a `"Locations:"` line **and** the
Location column in every export. Both were checked separately against the live files:

| Assertion | Live evidence | Verdict |
|---|---|---|
| a `"Locations:"` line naming the scope, "All locations" when all are selected | line 2 of the CSV = `"Locations: All locations"` | **MET** |
| the export also carries the Location **column** when it is shown on screen | present with both locations selected, absent with one | **MET on the in-scope reading, NOT MET on v14's access reading** — held on Q1 |
