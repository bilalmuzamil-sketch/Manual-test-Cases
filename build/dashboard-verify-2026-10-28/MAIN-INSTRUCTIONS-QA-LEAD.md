# Dashboard and Reports: the QA lead's MAIN INSTRUCTIONS (verbatim)

> **Saved on the QA lead's request, 13 Nov 2026:** *"Save the main instructions for future reference to give me back when I ask for it."*
> When he asks for "the main instructions" / "my main task prompt", give him **Section 1 word for word** (typos kept), then Section 2 if useful.
> Source of Section 1: `RUN-STATE.md` "The order", written on 28 Oct 2026 at the time it was given. It is copied here byte for byte.

## 1. The main instruction (28 Oct 2026)

> "TestRail (yes/no)" → **NO**
> "I want you to run the independant run based on PRD and sources and find calculation bugs for dashboard and if the reports are also not showing the correct data, and I need complete defects drafted to create the jira ticket for each defect with the steps of reproduction which a layman non technical person and a manual QA tester can follow to reproduce the defect/bug.
> Make sure that you NEVER run a delta pass, I need a FULL pass run to find the bugs/defects and all the jira tickets drafted for each bug/defect, then I will give you a go ahead and you will create each defect/bug upon my permission.
> I want this dashboard first and then the reports to be 100% scrutinez to ensure either they are showing correct data OR we have a defect/bug for anything which is wrong.
> Continue unattended as I am going to sleep now."

Earlier in the same thread: "I want everything in the dashboard to be correct ... for every filter/timeline and everything."

## 2. Later instructions that build on it (verbatim)

- **4 Nov 2026** (testing the SV-11839 tickets on QA branch sv11839): *"But your primary prupose is to see if there is still any other bug for the dashboard besides thetickets reported in that epic and fixed in that epic."*
- **5 Nov 2026:** *"Can you check if you can still find any bugs/defects related to dashboard, I do not want anyone to be able to find a bug which we missed to report."*
- **5 Nov 2026:** *"I wont be able to answer your questions, you have to continue unattended as I am goingt o sleep, you have all my authority to unblock yourself."*

## 3. Where the work stands
- Coverage check against Section 1, made 13 Nov 2026, as reported to the QA lead:
  - **Dashboard:** covered except the week-boundary check (scheduled 15 Nov), login landing (S1-R3, needs Google SSO), S12-R7–R10 and a $0.00 invoice.
  - **Reports:** figures covered on build v26.43.2 (28 Oct). Downloads, column chooser, sorting and some edge cases are NOT VERIFIED.
  - **Not done:** the SV-10702 39(b) comment.
- On 13 Nov the QA lead approved finishing all of these. Their status lives in `RUN-STATE.md` and `dashboard-bug-hunt-2026-11-05/RESULTS.md`, not here.
