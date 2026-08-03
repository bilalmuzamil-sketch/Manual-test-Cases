> **NOT TO BE POSTED — QA lead's ruling 2026-08-03: "Ignore this ticket."**

# SV-8780 — follow-up comment DRAFT (⛔ NOT POSTED)

**Status of this file: A DRAFT ONLY. Nothing has been posted to Jira.** Posting is outward-facing
and needs the QA lead's explicit go-ahead (Standing Rule 6). Written 2026-08-03.

**Ticket:** [SV-8780](https://shopview.atlassian.net/browse/SV-8780) — *"SBC report gated by its own
permission"* · Story Defect (subtask) under **SV-8598** · Epic **SV-8582**

---

## LIVE STATE, READ TODAY (read-only, Atlassian MCP — 2026-08-03)

| Field | Value | Note |
|---|---|---|
| Status | **Ready to Fix** | **Our own `DEV-TICKET-SBC-permissions.md` still records "Open" as the status on creation** — true at creation, but the ticket has moved since. Corrected here |
| Created | 2026-07-30 | Reporter: Bilal Muzamil |
| Updated | **2026-08-02** | |
| Parent | **SV-8598** *"[Reports Suite][B5] Sales By Customer (SBC) report + dedicated permission"* — status **Open** | Verified live, not assumed |
| Resolution | none | |
| Comments | **1** — Chris Ward, 2026-07-31 | Quoted below |

**Chris's existing comment on the ticket, verbatim (2026-07-31):**

> *"Surfaced in stand-up . the answer is: Yes.*
>
> *Spec updated accordingly.*
>
> *Great catch @Bilal Muzamil"*

**His "Spec updated accordingly" was checked, not taken on trust.** SBC spec (Confluence 577634305,
read live 2026-08-03) now reads:

> **S1-R2:** *"The report is gated by ordinary reports access, not by a report-specific permission.
> Any user with standard reports access can open it; there is no dedicated Sales By Customer View
> permission."*

with a matching change-log row dated **2026-07-31**. **The spec edit is genuinely done.** (Worth
stating, because on 2026-07-29 he believed he had made the WIP identifier edit and had not — so
these are verified each time. This one checks out.)

---

## MY RECOMMENDATION: **UPDATE the ticket — do NOT close it, do NOT widen it**

| Option | Verdict |
|---|---|
| **Close it** | ❌ **No.** The finding is unchanged and has never been disproved. Chris has now agreed with it three times, and it sits at **Ready to Fix** — i.e. accepted work, not a misunderstanding. And **nothing has been observed on a running build** (no QA branch), so we cannot claim the behaviour is already correct |
| **Re-scope it to cover Q2=A** (collapse all report permissions into one) | ❌ **No.** That is a different change, in a different place, with a Custom-Roles blast radius reaching consumers outside this project — and the scope of Chris's Q2=A answer is **genuinely ambiguous** and unanswered. Folding it into a subtask about one SBC atom would bury it. It needs its own ticket, later |
| **Leave it entirely alone** | ⚠️ **Risky.** The ticket's *Expected* asks engineering to **drop the dedicated gate**. Chris has since said: **if it is already built, don't rip it out — hide it from the front end and leave it inert** (*"no wasted time"*). It is Ready to Fix, so someone could pick it up this week and do the expensive removal he explicitly does not want |
| ✅ **UPDATE it with the fix-route ruling** | **Recommended.** One comment. It costs nothing, it prevents wasted engineering effort, and it puts the PO's newest instruction on the ticket where the implementer will read it |

**Urgency:** mildly time-sensitive. **Ready to Fix** means it can be picked up at any point, and the
whole value of the comment is that it lands **before** someone starts removing the atom.

---

## THE DRAFT COMMENT — text to post verbatim if approved

> Update from Chris (PO), and it changes **how** this should be fixed rather than whether — so worth
> capturing here before anyone picks it up.
>
> He has now confirmed the ruling for a third time: Sales By Customer should open on ordinary reports
> access, like the other five reports. He answered "A" to both questions on the permissions sheet for
> this ticket, and thank you for the spec edit — S1-R2 now reads *"The report is gated by ordinary
> reports access, not by a report-specific permission"*, which we have confirmed on the live page.
>
> **The important part is the fix route.** In his own words:
>
> *"But it's important that (if it's already built), we just hide the new permissions from FE (they
> can exist and not do anything for now -- no wasted time)"*
>
> So, to be explicit about what that means for this ticket:
>
> * **The dedicated permission does NOT have to be removed from the back end.** If
>   `ROLE_SALES_BY_CUSTOMER_REPORT::VIEW` is already built, it may stay where it is.
> * **It must stop gating anything.** Sales By Customer must open for any user with ordinary reports
>   access — the report must not require the dedicated permission on any of its endpoints.
> * **It must not be visible in the front end.** Administrators should not see a "Sales By Customer"
>   permission offered when editing a role.
> * Net effect: the permission may exist and do nothing for now. Chris was explicit that he does not
>   want time spent unpicking it.
>
> This supersedes the "drop the dedicated atom" wording in the ticket's Expected section above — that
> was written from the option-A follow-on on the question sheet, and Chris has since chosen the
> cheaper route. Please treat this comment as the accepted outcome.
>
> Some useful context he added, since it explains why the permission was ever specced:
>
> *"During the design/build of CRP originally -- it was intended to be modular... SBC actually has
> several features that we dropped almost right before the squad assembled, and is a good example of
> some of the items that SHOULD be gated behind an additional permission set. That being said, the
> requirements should have dropped with the additional features dropping, I own that."*
>
> Two notes on the back of that:
>
> 1. If any of those dropped Sales By Customer features ever come back, the dedicated permission
>    becomes justified again — which is another reason not to spend effort deleting it now.
> 2. There may still be a Custom Roles follow-up to make sure the inert permission does not surface
>    in the role matrix. Flagging it rather than assuming it; happy to raise it separately if useful.
>
> **On the QA side:** our three Sales By Customer permission test cases already expect the ruled
> behaviour, so no test needs rewriting — we are only updating their notes to point at this ticket and
> to add that the permission should not be visible on screen. We are also proposing one new test that
> checks exactly that (that no "Sales By Customer" permission is offered in the role editor), so the
> "hidden from the front end" half of the ruling is actually covered.
>
> **One thing to flag, deliberately kept out of this ticket:** Chris also answered "A" to a second
> question — that all report access should collapse into a **single** Reports permission, rather than
> the existing per-area reports permissions (Inventory Reports View for Parts Velocity and Inventory
> Value, the timesheet one for Technician Utilization, and so on). That is a bigger and different
> change, and it touches permissions used outside this project, so we have **not** folded it in here.
> We have gone back to Chris to establish how far he intends it to reach before anything is raised.
>
> **For completeness on where this stands for testing:** none of the above has been observed on a
> running build — the Report Suite QA branch is not available to QA yet, so everything here is from
> the specification, the engineering plan and Chris's ruling. When the branch exists we will confirm
> the live behaviour and report back on this ticket.

---

## IF APPROVED — how to post it

`addCommentToJiraIssue` on **SV-8780** with the text between the block-quote markers above
(un-indented). **Do not change the ticket's status or fields** — the comment is the whole change; the
status is already **Ready to Fix**, which is correct.

**Do not** post anything about the single-Reports-permission collapse beyond the flagging paragraph
already in the draft, until Chris has answered how far Q2=A reaches.

---

## OUTSTANDING — what I need from you

| # | What I need | Which ruling froze it (verbatim) | When / what it answered | What it blocks | Was it right? | What unblocks it |
|---|---|---|---|---|---|---|
| 1 | **Your go-ahead to post the comment above** | *"DRAFT a comment but DO NOT POST IT — posting to Jira is outward-facing and needs the QA lead's explicit go-ahead."* | This pass, 2026-08-03, answering what to do about SV-8780 after Chris's ruling | Engineering may remove the dedicated atom — the expensive fix Chris explicitly said he does not want (*"no wasted time"*). The ticket is at **Ready to Fix**, so it can be picked up at any time | **Yes** — a Jira comment is visible to the whole squad and the PO, so it is right that a human releases it. But this is one of the few held items with a real cost to waiting | One word from you. The text is final and needs no further work |
| 2 | **A decision on whether to raise a separate ticket for Q2=A** (the single-Reports-permission collapse) | — (no prior ruling; new this pass) | — | Nothing yet — it should wait for Chris in any case | — | Chris confirming how far Q2=A reaches, then your call |
| 3 | **Chris to say which SBC features dropped** "right before the squad assembled" | — | — | Nothing today. Our check found **zero** lingering descoped requirements and **zero** stale cases, so this may already be closed — only he can confirm which features he meant | — | Chris's reply |
| 4 | **A QA branch / environment for the Report Suite** (`project/reports-suite-bravo`) + its flag state + fresh cookies | — | — | The permission behaviour in this ticket has **never been observed live**, and all **474** Report Suite cases remain VIU-Pending | — | Dev providing the branch |

**Nothing was posted to Jira. Nothing was written to TestRail. No test case was edited.**
