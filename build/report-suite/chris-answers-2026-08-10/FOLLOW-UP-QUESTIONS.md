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

## Q1 — REPORT SUITE · all six reports · where each report sits in the Reports menu

**What happens now**

> Thank you for the answer on this — the part about what you want is clear and we have taken it as the
> rule: new reports go **below** the existing links in whatever group they join, nothing that people
> already click on should move, and the **Parts** section is brand new with this work. We have checked
> that last point and your descriptions agree with you, so that is settled.
>
> What we still cannot act on is the other half. You said a **Sales** heading does not exist as far as
> you know, and that our description of the current arrangement looked like a hallucination. We are not
> going to argue with you from the product — if our description was wrong, we would rather correct our
> records than quietly assume we were right.
>
> We also could not tell what "Picture is true on this" referred to. No picture was attached to the
> question, so we do not know whether you were agreeing that the arrangement is real or referring to
> something you were looking at.
>
> Why we are asking: one of our tests records which heading **Sales By Customer** sits under. It is
> written today so that it only claims what your description claims, which is honest but weak. We can
> only make it a real test once we know the heading you expect.

**The question**

> Under which heading should **Sales By Customer** appear in the Reports menu?

**Options**

> A) There is no separate "Sales" heading — Sales By Customer should sit under **Performance**, below
> the links already there.
>
> B) There should be a **Sales** heading, and Sales By Customer belongs under it.
>
> C) Somewhere else — please say where.

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
| Q1 | SBC-NAV-01 **C30096** | https://shopview.testrail.io/index.php?/cases/view/30096 | Case is `AUTOMATION: READY` and **not** on hold. **A** or **B** lets it assert a named heading instead of merely recording one. **No change until he answers** — his answer C settled placement-order but not the heading. |
| Q2 | SBR-EXP-01 **C30278** | https://shopview.testrail.io/index.php?/cases/view/30278 | Orientation is already settled (landscape, staged as P6). The caveat would add a **second** assertion about page fit. **Not written into the case** until answered. |
| Q3 | No case is blocked | — | Documentation hygiene on Inventory Value v5 (S3-R1 + §4) and Sales By Representative v18 (§3 + §4). Both are non-handed-off reports. |
| Q4 | SBC-PERM-04 **C30100** | https://shopview.testrail.io/index.php?/cases/view/30100 | C30100's premise is voided by his answer A. Whether the report should ever offer that journey is settled; **whether C30100 is re-scoped or retired is a QA-LEAD decision, not a PO one** — which is why the PO-facing question is only the documentation tidy-up. |

**Source currency for this sheet:** all six specifications fetched live 2026-08-10 — Sales By Customer
**v16**, Sales By Representative **v18**, Parts Velocity **v6**, Technician Utilization **v7**, Work In
Progress **v10**, Inventory Value **v5**. Every quoted sentence above was read from the live page body,
never from a search result. The application was **not** opened, so **no claim on this sheet rests on the
build**.
