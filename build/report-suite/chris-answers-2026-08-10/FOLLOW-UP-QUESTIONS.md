# Follow-up questions for Chris Ward — Report Suite — 2026-08-10

**DRAFT — NOT SENT. Nothing has been written to TestRail, Jira or Confluence.**

**Product Owner: Chris Ward.** He also owns **Fees & Discounts**, so — per Standing Rule 55 — **every
question below names the project and the report on its own row**, so a question read on its own days
later is still unambiguous.

**Four items. Three are one line. Two of them exist only because an answer he already gave was partly
unclear — and under Standing Rule 58 an unclear answer goes back to him rather than being resolved by
looking at the product.**

Wording rules applied (Rules 7 and 55): no case IDs, no requirement anchors, no HTTP terms, no internal
names, and not the word "VIU" anywhere he reads. The QA-only mapping is at the bottom and **must not be
forwarded**.

---

## Q1 — REPORT SUITE · Sales By Customer · which heading it sits under in the Reports menu
*(the "report access and navigation placement" story, SV-8600, under epic SV-8582)*

**What happens now**

> **First, a correction from us, and an apology.** Our last sheet told you that none of the six
> write-ups says which heading a report belongs under. **That was wrong.** Five of the six do say it,
> in plain words: **Technician Utilization** and **Work In Progress** both say *"under the Performance
> group"*, **Sales By Representative** says *"at the bottom of the Performance group"*, and **Parts
> Velocity** and **Inventory Value** both say **Parts** — Parts Velocity even says it *"creates the
> Parts section"*, which is exactly the point you made back to us. We should have read your own
> write-ups before asking, and we are sorry. You were right to push back.
>
> **Your instruction is clear and we have taken it as the rule:** new reports go **below** the links
> already in their heading, nothing people already click on should move, and the **Parts** section is
> new with this work. That is how all six of our tests are already written, so nothing changes there.
>
> **What is genuinely left is one report only.** **Sales By Customer** is the single one of the six
> whose write-up does not name a heading — it says only that the report *"appears in the Reports
> left-side navigation"*. Everything else on this topic is settled.

**The question**

> Sales By Customer sits under **Performance**, below the links already there — is that right?

**Options**

> A) Yes — **Performance**, below the existing links. *(If so, please add that line to the Sales By
> Customer write-up so there is something to test against; the other five already have it.)*
>
> B) No — it belongs somewhere else. Please say where.

> *One more thing, for information only — no answer needed. Back on 3 August our test environment
> showed Sales By Customer under a heading called "Sales". Nothing on the live screen shows that now,
> and no write-up mentions such a heading, so we believe it was a temporary state of that test
> environment rather than anything real. That is where our earlier description of a "Sales" heading
> came from — it was a note about a test build, and we should not have put it to you as though it were
> the product. We are not raising it as a problem.*

**Your answer:** _______________________________________________

---

## Q2 — REPORT SUITE · Sales By Representative · what "it must all fit on screen" means for a download

**What happens now**

> You chose **A4 landscape** for the printable downloads, and we have taken that as settled — thank you.
> We are updating our test to landscape.
>
> You added: "caveat: It must all fit on screen." We are not sure how to check that, because these are
> files someone downloads and prints rather than something on screen, and this report has sixteen
> columns.
>
> Why we are asking: we would rather ask one short question than guess a rule and write a test that
> quietly measures the wrong thing.

**The question**

> What should the caveat mean in practice?

**Options**

> A) Every column must fit across the page width, with nothing cut off and nothing pushed onto a second
> page sideways.
>
> B) It is fine for the table to continue onto further pages, as long as no column is cut off
> mid-column.
>
> C) Something else — please describe it.

**Your answer:** _______________________________________________

---

## Q3 — REPORT SUITE · Inventory Value and Sales By Representative · two leftover sentences

**What happens now**

> You updated all six descriptions on 6 August after our last list — thank you, that cleared most of it,
> and we have checked each one.
>
> Two are only part done. In **Inventory Value** and **Sales By Representative**, the numbered
> requirement now says the right thing — the person gets the Location column based on what they are
> allowed to see, and can switch it on and off — but an earlier sentence in each document still says the
> old thing: that the column appears and disappears on its own depending on how many locations are in
> view.
>
> So those two descriptions currently say both. The other four are clean.
>
> Nothing is blocked by this, and neither of those two reports is one of the three we are concentrating
> on. It is a tidy-up so nobody reads the wrong sentence later.

**The question**

> Nothing to decide — please delete or reword those two leftover sentences next time you have the
> descriptions open.

**Options**

> (Nothing to choose — a tick is enough.)

**Your answer:** _______________________________________________

---

## Q4 — REPORT SUITE · Sales By Customer · one sentence left over from the invoice-link decision

**What happens now**

> You confirmed that someone who is not allowed to open an invoice gets **no link at all** — the invoice
> number is plain text. That is settled and it matches your description, so we are matching our tests to
> it.
>
> One sentence in the same description still describes the opposite journey: that the person clicks the
> invoice number and lands on the standard "you are not allowed in" page, then presses back. Under your
> answer there is nothing for them to click, so that sentence now describes something that cannot
> happen.
>
> Why we are asking: a tester reading that sentence would go looking for a link that should not be
> there, and would raise a fault against a build that is correct.

**The question**

> Nothing to decide — please remove or reword that leftover sentence.

**Options**

> (Nothing to choose — a tick is enough.)

**Your answer:** _______________________________________________

---

## What was DELIBERATELY left off, and why

Checked our own newer sources first, per Standing Rule 44 — the point being that most apparent PO
questions turn out to be our own records lagging.

| Item | Why it is not on this sheet |
|---|---|
| Whether the Location column is access-gated | **He answered it: `A`.** Not re-asked. |
| Whether Sales By Representative's numbered requirements should match Sales By Customer | **He answered it: `A`.** The spec edit is his to make; it is not a question. |
| Whether "Representative" applies on screen | **He answered it: `A`.** |
| The export size cap missing from three descriptions | **Already done.** All three now carry it, with the exact message. Re-asking would waste his time. |
| The four Parts Velocity / Work In Progress / Technician Utilization Location leftovers | **Already done** in the 6 August edits. Only the two that are genuinely incomplete are asked (Q3). |
| The nightly-snapshot cases that cannot be checked through the screen | Correct by design and his description says so. **Not a product question**; it needs a QA-lead ruling on whether to check it another way. |

---

## QA-only — NOT FOR CHRIS · do not forward

| Q | Cases it affects | Links | What each answer resolves |
|---|---|---|---|
| Q1 | SBC-NAV-01 **C30096** | https://shopview.testrail.io/index.php?/cases/view/30096 | **CORRECTED 2026-08-10.** The case does **not** "merely record" the heading — its expected result item 1 already **hard-asserts** *"listed in the Performance group … BELOW the pre-existing entries (Sales, Technician Efficiency, Advisor Analysis, Shop Efficiency)"*, and would fail a build that placed it elsewhere. That assertion **matches the QA lead's screenshot**, so **no change to the assertion is needed on any answer**. What C30096 actually lacks is a **specification anchor** — its `refs` cite the PRD video of 2026-07-30, because the SBC write-up names no group (the other five nav cases cite `S1-R1`/`S1-R2`). **A** closes that gap once Chris adds the line to the SBC write-up. Local mirror also shows `AUTOMATION: HOLD - waiting on an answer from the product owner`, **not** `READY` as this row previously stated — live TestRail was not readable this pass (no credentials), so the live marker is **unverified**. **Nothing written.** |
| Q2 | SBR-EXP-01 **C30278** | https://shopview.testrail.io/index.php?/cases/view/30278 | Orientation is already settled (landscape, staged as P6). The caveat would add a **second** assertion about page fit. **Not written into the case** until answered. |
| Q3 | No case is blocked | — | Documentation hygiene on Inventory Value v5 (S3-R1 + §4) and Sales By Representative v18 (§3 + §4). Both are non-handed-off reports. |
| Q4 | SBC-PERM-04 **C30100** | https://shopview.testrail.io/index.php?/cases/view/30100 | C30100's premise is voided by his answer A. Whether the report should ever offer that journey is settled; **whether C30100 is re-scoped or retired is a QA-LEAD decision, not a PO one** — which is why the PO-facing question is only the documentation tidy-up. |

**Source currency for this sheet:** all six specifications fetched live 2026-08-10 — Sales By Customer
**v16**, Sales By Representative **v18**, Parts Velocity **v6**, Technician Utilization **v7**, Work In
Progress **v10**, Inventory Value **v5**. Every quoted sentence above was read from the live page body,
never from a search result. The application was **not** opened, so **no claim on this sheet rests on the
build**.
