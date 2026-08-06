# Schedule v25 reconciliation — DELIBERATE-DECISIONS / anticipated-challenge register — 2026-08-06

> **Standing Rule 46.** Every deliberate non-authoring, every case following a later decision over
> spec text, every HELD item and every accepted imperfection of **this pass**, written down with its
> evidence **before anyone asks**. All six fields on every entry.
>
> **Read the RISK column honestly: HIGH does not mean we are wrong. It means that if this is raised in
> a public channel we have a concession to make, not just an explanation.**
>
> **Honesty clause, restated because it is the one thing that would make this file worthless:** this
> register records what we **decided**, never what we wish we had decided. Nothing found late has been
> back-dated into it as a choice.
>
> **Risk profile of this pass: HIGH 3 · MEDIUM 4 · LOW 5.**

---

### 1. We did NOT rewrite C30041 to say what the build does, even though the requirement behind it was deleted

| Field | |
|---|---|
| **The decision, plainly** | The product write-up stopped requiring that non-matching search results stay on screen faded. We removed our expectation that they fade — but we did **not** replace it with "they disappear", even though that is what the software does and what an engineer said the design shows. |
| **One-sentence answer** | The write-up now says nothing at all about what happens to the non-matching jobs, so we asked the product owner instead of copying the software's behaviour into the test. |
| **Evidence** | Confluence **v24**, 2026-08-06T08:34:03Z, deletes *"Non-matching blocks fade; matching blocks highlight."* · **SV-8874** closed OBSOLETE 08:32:42Z · Stefan Vukovic 08:15:35Z *"per design we show only shifts/events that are matching the search. **This is a gap between PRD and design.**"* — a statement about **a design we do not hold**. |
| **Affected cases** | **SCH-TOOL-03 = [C30041](https://shopview.testrail.io/index.php?/cases/view/30041)** |
| **Who can close it** | **Branko** — `QUESTIONS-FOR-BRANKO.md` **Q1** |
| **RISK** | **MEDIUM.** The concession: the case is less specific than it could be, and until Q1 is answered it cannot give a clean pass or fail. We think that is the right trade — the alternative is a test that cannot fail — but somebody may reasonably say "you already knew the answer". We did not: we knew what the software did, which under Rule 57 is not the same thing. |

### 2. We did NOT flip C30012, even though the product owner appears to contradict it

| Field | |
|---|---|
| **The decision, plainly** | Branko said this morning that the estimate badge should not be clickable. One of our tests says the estimated hours **can** be typed into the pop-up. We left the test alone and asked him what he meant. |
| **One-sentence answer** | His words name the small badge on the job line, while our test is about a different field higher up the same window, and two written documents still say our test is right — so we asked rather than guessed. |
| **Evidence** | Branko on **SV-8829**, 2026-08-06T09:31:05Z: *"**Estimated badge should not be clickable**, you can change time only in the input fields above."* · **v25 §4.9 still reads *"Estimated hours with inline edit."*** — v25 did not touch it · **SV-8695** still lists it · SV-8829's own steps distinguish the line badge (*"only 1h and an Authorized badge"*) from the modal field. |
| **Affected cases** | **SCH-MODAL-05 = [C30012](https://shopview.testrail.io/index.php?/cases/view/30012)** |
| **Who can close it** | **Branko** — **Q2** |
| **RISK** | **HIGH, and this is the one to be ready for.** The concession: **as it stands this case would fail a build the product owner considers correct**, and it currently says `AUTOMATION: READY`, so an automated run would report a failure that is arguably our fault. We are proposing a `HOLD` for exactly that reason. Anyone can fairly ask why we did not simply follow the product owner. The answer is Rule 58 — his sentence is ambiguous about scope, and the alternative was to flip a case off two live written sources onto one comment, which is the mistake made on Filters this morning in the opposite direction. |

### 3. We did NOT fetch or ingest Sasha's design

| Field | |
|---|---|
| **The decision, plainly** | Three tickets point at a design link we have never opened. We did not open it. |
| **One-sentence answer** | The QA lead's permission is conditional — *"Yes if Sasha's design is final"* — and nobody has told us it is final, so the condition has not been met. |
| **Evidence** | Register row **C3**, QA lead's ruling verbatim. The link is `claude.ai/design/p/…?via=share`, **a live editable page with no version and no date**, so opening it would show today's content and still not establish finality. Three tickets, all 2026-08-05, all citing it: **SV-8915 · SV-8916 · SV-8917**. |
| **Affected cases** | Potentially **~48** design-pinned labels across the suite; specifically named today: **SV-8916** has no counterpart among our 168. |
| **Who can close it** | **Sasha Grosman / Fabian** (is it final?), then the QA lead |
| **RISK** | **HIGH.** The concession: our design baseline is dated **27 July** and may be stale, and we cannot prove otherwise. Worse, **two people said today that the design is the deciding document** (`DESIGN-SOURCE.md` §4) — so if they mean it, our suite rests on a source we have not been allowed to check. We are not treating "we lacked permission" as an excuse: **this is a live exposure and it is stated as one.** |

### 4. `§12`'s "every shift has a start time" has no umbrella case — by an authorised earlier decision

| Field | |
|---|---|
| **The decision, plainly** | The write-up states as a rule that every scheduled job always has a start time. There is no single test for that sentence. |
| **One-sentence answer** | It is covered by six separate tests, one per way a start time can be worked out, and the umbrella test was deliberately cut in July as a duplicate. |
| **Evidence** | `SCH-START-08` *"Every shift always has a start time - none is created without one"* was **CUT in the 2026-07-31 usefulness audit with the QA lead's authorisation**, on the recorded ground that *"its steps literally re-run the entry-point cases"*. **It never had a C-id, so nothing was deleted from TestRail.** |
| **Affected cases** | **SCH-START-01 = [C29969](https://shopview.testrail.io/index.php?/cases/view/29969) · -02 = [C29970](https://shopview.testrail.io/index.php?/cases/view/29970) · -03 = [C29971](https://shopview.testrail.io/index.php?/cases/view/29971) · -04 = [C29972](https://shopview.testrail.io/index.php?/cases/view/29972) · -05 = [C29973](https://shopview.testrail.io/index.php?/cases/view/29973) · -06 = [C29974](https://shopview.testrail.io/index.php?/cases/view/29974)** |
| **Who can close it** | Nobody needs to — it is closed. Recorded so the absence is not mistaken for a miss. |
| **RISK** | **LOW.** Only fair challenge: the retirement note's C-ids are wrong (entry 8), so a reader following them lands on the wrong cases. |

### 5. The "show only business hours, not 24 hours" change request was NOT authored

| Field | |
|---|---|
| **The decision, plainly** | A design-review ticket asks for the day view to show only the working hours rather than a full 24 hours. We wrote no test for it. |
| **One-sentence answer** | The current write-up says the opposite in plain words, and the request itself says it is being tracked as a future improvement rather than for this release. |
| **Evidence** | **SV-8915**: *"Schedule width should render only business hours plus a small trailing buffer rather than the full 24 hours … **Tracked separately on the enhancements list**."* against **v25 §4.8**: *"**The full 24-hour timeline remains intact and scrollable.**"* |
| **Affected cases** | **SCH-DAY-01 = [C30001](https://shopview.testrail.io/index.php?/cases/view/30001)** — correct as written against v25 |
| **Who can close it** | **Branko** — **Q3** |
| **RISK** | **LOW.** It is out of V1 on its own account, and the live spec contradicts it. |

### 6. The label change from SV-8917 is proposed but NOT applied, because we have not seen it

| Field | |
|---|---|
| **The decision, plainly** | An engineer changed two on-screen messages this morning and told us exactly what they now say. We wrote the change up but did not put it into the tests. |
| **One-sentence answer** | We could not open the application in this pass, and a label we have not seen on screen is not a label we should put in a test as fact. |
| **Evidence** | Stefan Vukovic on **SV-8917**, 2026-08-06T13:03:11Z, quoted in full in `DESIGN-SOURCE.md` §2 · `sv8685api.qa.shopview.com/api/auth/me/fe-permissions` → **HTTP 401** · build moved to **`v3.5-d64ba62`**, last-modified 12:56:44 GMT. |
| **Affected cases** | **SCH-CONF-03 = [C30025](https://shopview.testrail.io/index.php?/cases/view/30025) · SCH-MODAL-07 = [C30014](https://shopview.testrail.io/index.php?/cases/view/30014)** |
| **Who can close it** | **A live check** — ten minutes once a sign-in exists |
| **RISK** | **MEDIUM.** The concession: two of our cases quote a label the product no longer shows, and we knew it and left it. The trade is deliberate — a wrong label written from a ticket is no better than a wrong label written from nothing. |

### 7. `quick-login` and `switch-user` were deliberately NOT called

| Field | |
|---|---|
| **The decision, plainly** | There is a way to try to get a session. We did not use it. |
| **One-sentence answer** | Both of those rotate the one shared sign-in and would have signed a colleague's live work out mid-run. |
| **Evidence** | Playbook §A trap 5; register row **C1** carries the same caution: *"only ONE live-build worker may hold that right at a time"*. The brief for this pass also instructed it. |
| **Affected cases** | The whole pass is document-side; nothing was observed |
| **Who can close it** | **the QA lead**, by arranging who holds the session |
| **RISK** | **LOW.** No verdict in this pass depends on live observation, and every place that would have is labelled. |

### 8. A defect in our OWN record is reported, not silently corrected

| Field | |
|---|---|
| **The decision, plainly** | We found five wrong case numbers inside one of our own July audit notes and left them in place, writing the correction up instead. |
| **One-sentence answer** | The record of the mistake is worth as much as the fix, and quietly overwriting an audit note is how an audit trail stops being one. |
| **Evidence** | The `SCH-START-08` retirement note cites **C29954–C29958**; those are **SCH-LINE-07** and **SCH-DND-01..04**. The correct ids are **C29969–C29973**. The internal IDs in the same sentence are right. |
| **Affected cases** | Record only — `build/schedule/cases/*.json`. **No TestRail write involved.** |
| **Who can close it** | **the QA lead** — one-line go-ahead; staged at `PROPOSED-CHANGES.md` §4 |
| **RISK** | **LOW.** Nothing downstream is wrong; a reader following the C-ids is misdirected. |

### 9. No build stamp was re-written on any case, although the build has moved

| Field | |
|---|---|
| **The decision, plainly** | The software was rebuilt again today. We did not update the "last checked against build …" line on any of the 168 cases. |
| **One-sentence answer** | We did not check any case against the new build, so writing today's build on them would be a claim we cannot stand behind. |
| **Evidence** | Build now **`v3.5-d64ba62`** (last-modified Thu 06 Aug 12:56:44 GMT, etag `abb0ecadcdbad3eaa5425958ace18385`). Our verdicts were taken on `v3.5-7ec992f` (90 cases) and `v3.5-d122eef` (78) — **neither exists now.** |
| **Affected cases** | **all 168** |
| **Who can close it** | **a live pass**, once a sign-in exists |
| **RISK** | **MEDIUM.** The concession, stated rather than buried: **not one of the 168 verdicts was taken on the build that is running.** Under Rule 60 that is the ordinary steady state of a branch nobody declares final, and Rule 60(b) limits what it invalidates to the labels and the verdict — but it is still true, and a reader is entitled to know it before quoting any Schedule number. |

### 10. Two owning stories are left contradicting the write-up

| Field | |
|---|---|
| **The decision, plainly** | Two developer tickets still describe requirements the write-up has changed or removed. We did not edit either. |
| **One-sentence answer** | They belong to other people, so we report them instead of correcting them. |
| **Evidence** | **SV-8686** still requires *"Non-matching blocks fade; matching blocks highlight"* in its Requirements **and** its Acceptance Criteria, confirmed present through Ayesha Khan's edit of 2026-08-05T19:22:33Z · **SV-8695** still says *"labor/total"* and *"estimated hours with inline edit"*, and trap (c) shows **Branko's own edit of 2026-08-03 left `labor/total` standing**. |
| **Affected cases** | **C30041** (Q1) · **C30011** and **C30012** (Q2/Q2b) |
| **Who can close it** | **Branko / the story owners** |
| **RISK** | **LOW for us, MEDIUM for the project.** A developer reading only the ticket builds the wrong thing. This is the same pattern as v23's deleted *Reassign* action, which SV-8695 also still listed — so it is a **recurring** hygiene problem worth naming as such. |

### 11. No case was authored from SV-8916

| Field | |
|---|---|
| **The decision, plainly** | A ticket says a button is missing from the software. We wrote no test for that button. |
| **One-sentence answer** | The product owner says the button is not in the design either, and it is in no version of the write-up, so there is currently nothing to test it against. |
| **Evidence** | `Add Existing Work Order` **absent from v23, v24 and v25**, checked as a literal · Branko on **SV-8916**, 2026-08-06T08:30:54Z: *"Hey there is no "Add Existing Work Order" in the design. Can you clarify where you found this?"* · ticket is **Blocked**. |
| **Affected cases** | none — this is the one candidate coverage gap this pass found from an external source |
| **Who can close it** | **Sasha Grosman** first, then **Branko** |
| **RISK** | **LOW, and it is a downgrade of an earlier concern.** Register row **C4** currently calls this *"a candidate coverage gap … only a DESIGN as its source"* — **that is now too generous**: it has **no established source at all**. Recorded so C4 can be corrected rather than carried forward at the wrong severity. |

### 12. This pass is document-side, and no verdict, marker or queue row moved

| Field | |
|---|---|
| **The decision, plainly** | We changed nothing in TestRail and closed nothing in the re-check list. |
| **One-sentence answer** | It was a paperwork pass against a new write-up version, not a testing pass, and we have not pretended otherwise. |
| **Evidence** | **0** `update_case` / `add_case` / `delete_case` / section / run / result calls. Run 357 read once: `include_all` false, 168 tests, 429 results. Rule-49 queue `full-viu-2026-08-05/RECHECK-QUEUE.md` **still OPEN**, unchanged. |
| **Affected cases** | all 168 remain **PROVISIONAL** |
| **Who can close it** | **the QA lead**, by authorising `PROPOSED-CHANGES.md` |
| **RISK** | **LOW.** The only fair challenge is that the suite is no more current in TestRail tonight than it was this morning — true, and by design: Rule 6 means we propose, he authorises. |

---

## OUTSTANDING — what I need from you

Consolidated in `PROPOSED-CHANGES.md` and `QUESTIONS-FOR-BRANKO.md`. In one line: **two answers from
Branko (Q1, Q2) decide two cases; one answer from Sasha or Fabian decides whether our design baseline
is stale; and four small go-aheads let us apply what is already staged.**
