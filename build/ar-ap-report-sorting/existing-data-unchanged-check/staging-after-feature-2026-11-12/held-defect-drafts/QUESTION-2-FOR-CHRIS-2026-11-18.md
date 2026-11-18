# Question for Chris Ward — A/R and A/P Report Sorting (epic SV-11315): the "Amount" of a partly-used credit

Status: **drafted 18 Nov 2026, not sent.** The QA lead did not know the answer ("1. I dont know", 18 Nov), so it goes to
Product. It is a question, not a ticket (Rules 58, 121). Pictures: `../../../v1-regression/partly-used-credit-2026-11-12/annotated/`
PIC1 (production) and PIC3 (staging).

---

Hi Chris, one question on the A/R and A/P report release before Thursday, please.

**Project / feature:** A/R and A/P Report Sorting, Export and Location Filter (SV-11315), the A/R Aging Detail and A/R
Aging Collection reports.

**What changed:** for a credit memo or deposit that has been partly used, the **Amount** column now shows the credit's
original amount. Today, on production, it shows what is left, the same as Open Balance. Open Balance and every total are
unchanged.

**Example you can open:**
- Production, A/R Aging Detail, as of 11/12/2026: credit memo CM1-4414 ($200.00, $155.00 of it used) shows
  Amount **$-45.00**, Open Balance **$-45.00** (picture 1).
- Staging (new reports), A/R Aging Detail, customer 4 Star Truck Repair, as of 11/12/2026: credit memo CM2-4353
  ($200.00, partly used) shows Amount **$-200.00**, Open Balance **$-150.00**; before the release staging showed
  $-150.00 in both (picture 2).
- On staging 6 credits are affected; production will have more.

**Why we're asking:** the PRD says both things.
- S5-R18a: "The Detail reports' Amount column holds original amounts and is not compared."
- What changes for existing users: "…and the reports show money exactly as they do today." This change isn't in that list.

**Question:** should the Amount column of a partly-used credit show
- (a) the original credit amount (as staging does now), or
- (b) what is left, as production does today?

If (a), could the "What changes for existing users" list mention it? If (b), we'll raise it for a fix.
