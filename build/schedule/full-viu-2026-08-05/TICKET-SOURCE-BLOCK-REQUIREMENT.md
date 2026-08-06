# Every ticket must name the SOURCE of its expected behaviour — QA lead, 2026-08-06

**His words, verbatim:** *"Make sure that if you create any ticket you MUST mention the source for the
expected behavior in that ticket at the bottom of the ticket after a line break in clear and simple
words for a layman to follow."*

**The rule.** Every ticket ends, at the very BOTTOM after a line break, with a plain-English statement
of **where the expected behaviour comes from** — not the symptom, not the evidence, the **source that
makes the expectation legitimate**. Give the version and the requirement reference, and **quote the
source's own words** where they are short enough, so a developer can check it without asking us.

**REFINEMENT, same day — the QA lead named the three valid source types**, verbatim: *"Source can be
the Story in Epic/Specs from PRD/Answer from the PO in an answer google spreadsheett, in case of google
spreadsheet do provide the spreadsheet link and the row reference from that spreadseet"*.

So the source is **exactly one of three things**, each with its own form:

**1 — A STORY IN THE EPIC**
> *"Where this expected behaviour comes from: the acceptance criteria on story SV-8689 in epic SV-8685,
> which say: '…'."*

**2 — THE SPECIFICATION (PRD)**
> *"Where this expected behaviour comes from: the Schedule specification, version 23, requirement 4.3,
> which says: '…'."*

Always **the version number AND the requirement reference**. Use the **Confluence version**, never the
version written inside the page body — that field is a known trap and reads `1.0` while the real page is
at **23**.

**3 — A PO ANSWER IN A GOOGLE SPREADSHEET — and this one needs BOTH parts**
> *"Where this expected behaviour comes from: Branko's answer in our questions spreadsheet — `<full
> spreadsheet link>` — tab '`<tab name>`', row `<N>` (question `<M>`), where he answered: '…'."*

**THE ROW REFERENCE IS MANDATORY.** A bare link to a multi-tab sheet with dozens of rows is not
checkable, and the entire point of the block is that a developer can verify it without asking us. Give
the tab name and the row, the question number if the sheet uses them, and quote his actual words.

**Unchanged:** no case IDs and no "QA test cases affected" section — name the DOCUMENT, never our test
case. Plain layman words. If a product owner's answer differs from the specification, **say so plainly**
rather than implying agreement. **If there is genuinely no documented source, do not invent one** — say
the specification is silent, say what the expectation actually rests on, and reconsider filing at all,
because Rule 57 makes an unsourced expectation a question for the product owner rather than a defect.
Shape unchanged: Story Defect (10007) · parent the owning story · priority Low · `relates to` link · no
Product Area.

**Why it matters, and it is the same reasoning as the whole week's work:** a ticket that only describes
what the build does gives a developer no way to tell whether the expectation is real or merely our
opinion. That is exactly the failure the QA lead caught in our test cases — build behaviour presented as
expected behaviour — and it applies to a ticket just as much.

---

## The four tickets filed today do NOT carry the block

The instruction arrived after they were filed, and the coordinator is retrofitting them in one pass so
we do not collide. **Nothing here was edited.** This is the list, with the source each one should name,
so the retrofit does not have to re-derive it:

**All four are SOURCE TYPE 2 — the specification (PRD).** None is a story's acceptance criteria and none
is a product owner answer in a spreadsheet, so **no spreadsheet link or row reference is owed on any of
them**, and no honesty caveat about a PO answer differing from the spec is owed either.

| Ticket | Case it came from | Source type | Source the block should name |
|---|---|---|---|
| [SV-8942](https://shopview.atlassian.net/browse/SV-8942) — the page scrolls sideways and the panel never collapses | SCH-EDGE-01 = [C30086](https://shopview.testrail.io/index.php?/cases/view/30086) | **2 — specification (PRD)** | **Schedule specification version 23, section 11**, which says: *"Minimum supported width is 960px (the grid scrolls horizontally below that), and the sidebar collapses on narrow viewports."* Already quoted in the ticket's "What should happen" section — it needs repeating as the closing source line. |
| [SV-8957](https://shopview.atlassian.net/browse/SV-8957) — the click alternative to dragging has disappeared | SCH-DND-08 = [C29962](https://shopview.testrail.io/index.php?/cases/view/29962) | **2 — specification (PRD)** | **Schedule specification version 23, section 11**, which says: *"drag-and-drop has a click-to-arm alternative"*. |
| [SV-8958](https://shopview.atlassian.net/browse/SV-8958) — Month view series bar does not name the technician | SCH-SER-01 = [C29987](https://shopview.testrail.io/index.php?/cases/view/29987) | **2 — specification (PRD)** | **Schedule specification version 23, section 4.6**, which says: *"Month view: a continuous bar wrapping across week rows, labeled once at the start (with the technician)"*. |
| [SV-8959](https://shopview.atlassian.net/browse/SV-8959) — the clash warning sits at the bottom of the tooltip | SCH-TIP-02 = [C30035](https://shopview.testrail.io/index.php?/cases/view/30035) | **2 — specification (PRD)** | **Schedule specification version 23, section 4.13**, whose first tooltip line is *"customer name (plus the conflict icon if conflicted)"*. |

**All four are spec-sourced.** None rests on a product owner answer, and none rests on an undocumented
expectation, so no honesty caveat is owed on any of them.

## And one honest note about a ticket we did NOT file

The 7 cases marked `AUTOMATION: HOLD - not re-checked against the current build` are deviations we could
**not re-observe** this session, so no ticket was raised for any of them. That is deliberate: filing a
defect we have not seen on the current build would be exactly the inference Rule 12 forbids, and under
this new rule it would also have no honest source line to close with.
