# Test cases marked **Automated** in TestRail that we have changed — for Vlad

**Prepared 2026-08-11 for the QA lead to forward to Vlad (automation).**
Covers everything we changed from **6 August 2026** onward.

---

## The short version

- **75** of our test cases are marked **Automated** in TestRail today.
- **We changed 73 of them** in the last few days. (Only two were left alone.)
- **Of those 73 changes, 27 change what an automated check should conclude. The other 46 do not** —
  they were corrections to the small source note at the bottom of a case, or to formatting.
- **And of the 27 that matter, only 8 are on cases Vlad himself marked Automated.** The other 19
  are Schedule cases that carry the Automated flag for a different reason — explained below, and worth
  a minute of your time because it means the flag is not telling us what we think it is.

**So the honest headline: most of what we did this week was housekeeping that Vlad can ignore.
The 8 rows in the first table are the ones he actually needs.**

---

## 1. The ones that matter to Vlad — cases he marked Automated (8)

These are Report Suite cases Vlad flagged as Automated on 10 August. We changed them after that.

| Test case | Report / area | What we changed | Does it change what an automated check should conclude? |
|---|---|---|---|
| [C30114](https://shopview.testrail.io/index.php?/cases/view/30114) | Report Suite | what the test expects was reworded; automation flag: ready to automate -> expected to fail (SV-8991); a "known failure" note was added telling the tester what to expect; the specification version it cites was corrected | **YES** — it is now expected to FAIL against a known defect — a run should not treat that as new |
| [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) | Report Suite | automation flag: on hold -> expected to fail (SV-8938); a "known failure" note was added telling the tester what to expect | **YES** — it is now expected to FAIL against a known defect — a run should not treat that as new |
| [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) | Report Suite | automation flag: ready to automate -> on hold; the specification version it cites was corrected | **YES** — it has been put on hold — it should not be automated as it stands |
| [C30424](https://shopview.testrail.io/index.php?/cases/view/30424) | Report Suite | automation flag: ready to automate -> expected to fail (SV-8946); a "known failure" note was added telling the tester what to expect; the specification version it cites was corrected | **YES** — it is now expected to FAIL against a known defect — a run should not treat that as new |
| [C30498](https://shopview.testrail.io/index.php?/cases/view/30498) | Report Suite | automation flag: ready to automate -> expected to fail (SV-8968); a "known failure" note was added telling the tester what to expect; the specification version it cites was corrected | **YES** — it is now expected to FAIL against a known defect — a run should not treat that as new |
| [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) | Report Suite | what the test expects was reworded; automation flag: expected to fail (SV-8907) -> ready to automate; the specification version it cites was corrected | **YES** — it was expected to fail and is now expected to PASS — a run should now conclude differently |
| [C30515](https://shopview.testrail.io/index.php?/cases/view/30515) | Report Suite | what the test expects was reworded; automation flag: expected to fail (SV-8907) -> ready to automate; the specification version it cites was corrected | **YES** — it was expected to fail and is now expected to PASS — a run should now conclude differently |
| [C30518](https://shopview.testrail.io/index.php?/cases/view/30518) | Report Suite | what the test expects was reworded; a "known failure" note was added telling the tester what to expect; the source note at the bottom was refreshed; the specification version it cites was corrected | **YES** — the wording of what the test expects has changed |

**In plain terms, five things happened to these:**

- **Two tests that were expected to fail are now expected to PASS** — [C30510](https://shopview.testrail.io/index.php?/cases/view/30510) and [C30515](https://shopview.testrail.io/index.php?/cases/view/30515).
  The problem behind them (SV-8907, Work In Progress downloads failing) has been fixed, so a run that
  now passes is the correct result, not a surprise. **These two are the most likely to confuse a
  suite that has not been updated.**
- **Three tests that were expected to pass are now expected to FAIL** against known, already-reported
  problems — [C30114](https://shopview.testrail.io/index.php?/cases/view/30114) (SV-8991), [C30424](https://shopview.testrail.io/index.php?/cases/view/30424) (SV-8946) and [C30498](https://shopview.testrail.io/index.php?/cases/view/30498) (SV-8968). Each one now
  says on itself exactly what the failure looks like, so a failing run is the expected outcome and
  does not need a new ticket raised.
- **One test came off hold and is now expected to fail** — [C30352](https://shopview.testrail.io/index.php?/cases/view/30352) (SV-8938). It can be run now,
  and it will fail on the known problem.
- **One test was put on hold** — [C30398](https://shopview.testrail.io/index.php?/cases/view/30398) — because it needs a second sign-in as a different kind of
  user, which we cannot do on this environment. It is not worth automating as it stands.
- **One test had its wording tidied and gained a known-failure note** — [C30518](https://shopview.testrail.io/index.php?/cases/view/30518). Its automation
  flag did not move.

---

## 2. Also changed, but the Automated flag here is probably a false signal (19)

Every one of these is a **Schedule** case.

**Why they are separate:** nobody marked these Automated. They carry the flag because the tool we use
to create a Schedule test case has always set it automatically at the moment of creation. TestRail's
change history shows **no one ever setting it** on any of them — unlike the Report Suite and Filters
cases, where the history shows Vlad setting it by hand.

**So Vlad may well not be automating any of these.** They are listed for completeness, and because the
QA lead may want to ask him whether he wants them.

| Test case | Report / area | What we changed | Does it change what an automated check should conclude? |
|---|---|---|---|
| [C30614](https://shopview.testrail.io/index.php?/cases/view/30614) | Schedule | automation flag: ready to automate -> on hold | **YES** — it has been put on hold — it should not be automated as it stands |
| [C38863](https://shopview.testrail.io/index.php?/cases/view/38863) | Schedule | what the test expects was reworded; automation flag: on hold -> ready to automate | **YES** — it has come off hold and is now ready to automate |
| [C38865](https://shopview.testrail.io/index.php?/cases/view/38865) | Schedule | what the test expects was reworded; automation flag: on hold -> ready to automate | **YES** — it has come off hold and is now ready to automate |
| [C38867](https://shopview.testrail.io/index.php?/cases/view/38867) | Schedule | automation flag: ready to automate -> on hold; the specification version it cites was corrected | **YES** — it has been put on hold — it should not be automated as it stands |
| [C38868](https://shopview.testrail.io/index.php?/cases/view/38868) | Schedule | automation flag: ready to automate -> on hold; the specification version it cites was corrected | **YES** — it has been put on hold — it should not be automated as it stands |
| [C38869](https://shopview.testrail.io/index.php?/cases/view/38869) | Schedule | automation flag: ready to automate -> on hold; the specification version it cites was corrected | **YES** — it has been put on hold — it should not be automated as it stands |
| [C38871](https://shopview.testrail.io/index.php?/cases/view/38871) | Schedule | automation flag: ready to automate -> on hold | **YES** — it has been put on hold — it should not be automated as it stands |
| [C38872](https://shopview.testrail.io/index.php?/cases/view/38872) | Schedule | automation flag: ready to automate -> on hold; the specification version it cites was corrected | **YES** — it has been put on hold — it should not be automated as it stands |
| [C38873](https://shopview.testrail.io/index.php?/cases/view/38873) | Schedule | what the test expects was reworded; automation flag: on hold -> ready to automate | **YES** — it has come off hold and is now ready to automate |
| [C38874](https://shopview.testrail.io/index.php?/cases/view/38874) | Schedule | automation flag: ready to automate -> on hold; the specification version it cites was corrected | **YES** — it has been put on hold — it should not be automated as it stands |
| [C38926](https://shopview.testrail.io/index.php?/cases/view/38926) | Schedule | automation flag: ready to automate -> on hold; the specification version it cites was corrected | **YES** — it has been put on hold — it should not be automated as it stands |
| [C43554](https://shopview.testrail.io/index.php?/cases/view/43554) | Schedule | what the test expects was reworded; automation flag: expected to fail (SV-8863) -> ready to automate | **YES** — it was expected to fail and is now expected to PASS — a run should now conclude differently |
| [C43556](https://shopview.testrail.io/index.php?/cases/view/43556) | Schedule | what the test expects was reworded; automation flag: expected to fail (SV-8867) -> ready to automate | **YES** — it was expected to fail and is now expected to PASS — a run should now conclude differently |
| [C43582](https://shopview.testrail.io/index.php?/cases/view/43582) | Schedule | New test case, written this week; automation flag: on hold -> ready to automate | **YES** — a new case he may want to automate |
| [C43583](https://shopview.testrail.io/index.php?/cases/view/43583) | Schedule | New test case, written this week; automation flag: on hold -> ready to automate | **YES** — a new case he may want to automate |
| [C43584](https://shopview.testrail.io/index.php?/cases/view/43584) | Schedule | New test case, written this week; automation flag: on hold -> ready to automate | **YES** — a new case he may want to automate |
| [C43585](https://shopview.testrail.io/index.php?/cases/view/43585) | Schedule | New test case, written this week; automation flag: on hold -> ready to automate | **YES** — a new case he may want to automate |
| [C43586](https://shopview.testrail.io/index.php?/cases/view/43586) | Schedule | New test case, written this week; automation flag: on hold -> ready to automate | **YES** — a new case he may want to automate |
| [C43587](https://shopview.testrail.io/index.php?/cases/view/43587) | Schedule | New test case, written this week; automation flag: on hold -> ready to automate | **YES** — a new case he may want to automate |

Six of these are **brand-new test cases** written on 11 August for a newly specified Schedule feature
(hiding and showing the left-hand panel): [C43582](https://shopview.testrail.io/index.php?/cases/view/43582), [C43583](https://shopview.testrail.io/index.php?/cases/view/43583), [C43584](https://shopview.testrail.io/index.php?/cases/view/43584), [C43585](https://shopview.testrail.io/index.php?/cases/view/43585), [C43586](https://shopview.testrail.io/index.php?/cases/view/43586), [C43587](https://shopview.testrail.io/index.php?/cases/view/43587).
If Vlad is automating Schedule, these are new work he has not seen.

---

## 3. Changed, but nothing an automated check would notice (46)

Listed so the record is complete. In every one of these we only:

- refreshed the small note at the bottom of the case that records which document it comes from, or
- corrected the specification version number that note cites, or
- removed stray formatting code that was showing to the tester as literal text.

**The wording of what each test checks is untouched.** No script needs changing for any of these.

| Test case | Report / area | What we changed | Does it change what an automated check should conclude? |
|---|---|---|---|
| [C29600](https://shopview.testrail.io/index.php?/cases/view/29600) | Filters | the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C29614](https://shopview.testrail.io/index.php?/cases/view/29614) | Filters | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) | Filters | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C38877](https://shopview.testrail.io/index.php?/cases/view/38877) | Filters | the source note at the bottom was refreshed; formatting only (stray code tags removed from the text); the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30107](https://shopview.testrail.io/index.php?/cases/view/30107) | Report Suite | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30121](https://shopview.testrail.io/index.php?/cases/view/30121) | Report Suite | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30123](https://shopview.testrail.io/index.php?/cases/view/30123) | Report Suite | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30138](https://shopview.testrail.io/index.php?/cases/view/30138) | Report Suite | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30217](https://shopview.testrail.io/index.php?/cases/view/30217) | Report Suite | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30221](https://shopview.testrail.io/index.php?/cases/view/30221) | Report Suite | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30262](https://shopview.testrail.io/index.php?/cases/view/30262) | Report Suite | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30328](https://shopview.testrail.io/index.php?/cases/view/30328) | Report Suite | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30333](https://shopview.testrail.io/index.php?/cases/view/30333) | Report Suite | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30338](https://shopview.testrail.io/index.php?/cases/view/30338) | Report Suite | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30346](https://shopview.testrail.io/index.php?/cases/view/30346) | Report Suite | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30353](https://shopview.testrail.io/index.php?/cases/view/30353) | Report Suite | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30390](https://shopview.testrail.io/index.php?/cases/view/30390) | Report Suite | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30399](https://shopview.testrail.io/index.php?/cases/view/30399) | Report Suite | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30401](https://shopview.testrail.io/index.php?/cases/view/30401) | Report Suite | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30404](https://shopview.testrail.io/index.php?/cases/view/30404) | Report Suite | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30410](https://shopview.testrail.io/index.php?/cases/view/30410) | Report Suite | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30429](https://shopview.testrail.io/index.php?/cases/view/30429) | Report Suite | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30449](https://shopview.testrail.io/index.php?/cases/view/30449) | Report Suite | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30452](https://shopview.testrail.io/index.php?/cases/view/30452) | Report Suite | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30460](https://shopview.testrail.io/index.php?/cases/view/30460) | Report Suite | the source note at the bottom was refreshed; formatting only (stray code tags removed from the text); the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30462](https://shopview.testrail.io/index.php?/cases/view/30462) | Report Suite | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30488](https://shopview.testrail.io/index.php?/cases/view/30488) | Report Suite | the source note at the bottom was refreshed; formatting only (stray code tags removed from the text); the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30508](https://shopview.testrail.io/index.php?/cases/view/30508) | Report Suite | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30527](https://shopview.testrail.io/index.php?/cases/view/30527) | Report Suite | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30535](https://shopview.testrail.io/index.php?/cases/view/30535) | Report Suite | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30557](https://shopview.testrail.io/index.php?/cases/view/30557) | Report Suite | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30563](https://shopview.testrail.io/index.php?/cases/view/30563) | Report Suite | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30569](https://shopview.testrail.io/index.php?/cases/view/30569) | Report Suite | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30583](https://shopview.testrail.io/index.php?/cases/view/30583) | Report Suite | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C30615](https://shopview.testrail.io/index.php?/cases/view/30615) | Schedule | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C38847](https://shopview.testrail.io/index.php?/cases/view/38847) | Schedule | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C38848](https://shopview.testrail.io/index.php?/cases/view/38848) | Schedule | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C38849](https://shopview.testrail.io/index.php?/cases/view/38849) | Schedule | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C38850](https://shopview.testrail.io/index.php?/cases/view/38850) | Schedule | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C38851](https://shopview.testrail.io/index.php?/cases/view/38851) | Schedule | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C38855](https://shopview.testrail.io/index.php?/cases/view/38855) | Schedule | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C38864](https://shopview.testrail.io/index.php?/cases/view/38864) | Schedule | the source note at the bottom was refreshed | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C38866](https://shopview.testrail.io/index.php?/cases/view/38866) | Schedule | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C38870](https://shopview.testrail.io/index.php?/cases/view/38870) | Schedule | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C38875](https://shopview.testrail.io/index.php?/cases/view/38875) | Schedule | the source note at the bottom was refreshed; the specification version it cites was corrected | **NO** — wording of the assertions is untouched — only the source note or formatting moved |
| [C43555](https://shopview.testrail.io/index.php?/cases/view/43555) | Schedule | on hold before and after; the specification version named in a tester note changed (23 -> 27) | **NO** — it stays on hold either way, and only a version number in a note moved |

---

## 4. The two Automated cases we did not touch at all

[C30314](https://shopview.testrail.io/index.php?/cases/view/30314) and [C30326](https://shopview.testrail.io/index.php?/cases/view/30326) — unchanged since Vlad marked them.

---

## What we would like back from Vlad

1. **Are the Schedule cases in section 2 actually automated by you?** We think the Automated flag on
   them is an accident of our own tooling. If you are not automating them, we would like to correct the
   flag so this list stays meaningful.
2. **Anything in section 1 you want us to hold off changing again** while you adjust, please say.

---

## What happens from now on

Every pass we run that changes test cases will end with a short section listing the Automated cases it
touched, so this never has to be reconstructed after the fact again.
