# The vendor-website mistake: what I did, why it got through, and the check that stops it

**16 September 2026.** SV-10110 says the old search could find a vendor by its website and the new one
cannot. **The old search never could.** The ticket should not have been filed, and the test behind it
([test 2990950](https://shopview.testrail.io/index.php?/tests/view/2990950)) asserts something the old
product never did.

The developer said so on the ticket — *"we don't have search by vendor website in either staging or
production"* — and he was right.

---

## 1 · What actually happened

I typed `kestrelsupply-zzt.com` into the old product, the vendor came back, and I called that proof
the website was searchable.

The vendor's **email** is `parts@kestrelsupply-zzt.com`.

```
website   kestrelsupply-zzt.com
email     parts@kestrelsupply-zzt.com
                ^^^^^^^^^^^^^^^^^^^^^  the website is a SUBSTRING of the email
```

The old search's second pass matches the typed text **anywhere inside** the record's text, and the
vendor's email **is** in that text. So the record came back on the **email**. It would have come back
with the website field empty, or deleted, or never filled in.

**And the vendor query has no website column at all.** From the old product at commit `55767168`,
`FetchDataQueryHandler.php:157-164`, the vendor's searchable text is exactly:

> name · address 1 · address 2 · state/province · postal code · city · telephone · email

No website. The customer query on the very next screen *does* have one (`c.website`, line 237), which
is what made "vendors must have it too" feel obvious. It is not there.

## 2 · Why it got through

**I ran a confirming test instead of a disconfirming one.** I asked *"does the record come back?"*,
got yes, and stopped. I never asked *"would it still come back if this field were empty?"* — the only
question that actually attributes a match to a field.

Three things should have stopped me and did not:

1. **The source was one grep away and I did not read it.** I had already read this exact function for
   the customer fields. I did not re-read it for the vendor.
2. **Our own committed V1 baseline already said so.** `prove_all_v1_capabilities.py` lists eight
   vendor capabilities — name, address 1, address 2, state, postal, city, telephone, email. **There is
   no website row, because there is no website field.** My own evidence file contradicted the claim I
   was making and I did not look.
3. **The values were suspiciously similar.** A website and an email that share a domain is the textbook
   setup for a confounded match. That similarity should have triggered the check, not lowered my guard.

The pattern underneath is the same one that bit twice before this week: **I treated "a result appeared"
as "the thing I was testing works."** A result count of 1 is not a pass; a returned record is not an
attributed match.

## 3 · The check that stops it, and it is now runnable

`attribution_check.py` in this folder. For every claim of the form *"typing X finds this record because
of field F"*, it rebuilds the record **with F blanked** and searches again:

* still found → the match never depended on F; **the claim is unproven**
* not found → the match is genuinely attributable to F

Run across **all 28 field claims** in the suite. **Exactly one fails: vendor website** — and it fails
in the strongest possible way, "the field is not in the old version's query at all". Every other claim,
including customer website, is properly attributable.

Customer website is safe for the very reason vendor website is not: **the old customer query has no
email column**, so nothing else in that record can carry `bridgeporthauling-zzt.com`. SV-10003 stands.

## 4 · What has to change now

| What | Why |
|---|---|
| **SV-10110 should be withdrawn** | It reports the loss of a capability the old product never had. A proposed comment is in §5 — **not posted; it needs your go-ahead.** |
| **C55692 "Finding a vendor by their website still works" must be retired or rewritten** | As a V1-regression case it asserts something V1 never did, so it can only ever fail for the wrong reason. It is tied to SV-10110, so it waits on the same decision. |
| **Nothing else is affected** | The other 27 claims are attributable. |

## 5 · DONE — both actions carried out, 16 September 2026

Approved by the QA lead and executed.

| Action | Result |
|---|---|
| **SV-10110 withdrawn** | Comment [76670](https://shopview.atlassian.net/browse/SV-10110?focusedCommentId=76670) posted, explaining the email/website substring, citing the V1 vendor query, and crediting Sinisa. |
| **C55692 retired** | Deleted from TestRail, following the precedent set for SBC-EXP-13 on 2026-07-28 (delete, keep a restorable local snapshot). |

**The retired case is restorable.** `retired/C55692-RETIRED-full-body.json` holds all 30 fields and
`retired/C55692-RETIRED-results.json` holds its 3 recorded results. To bring it back:
`add_case` into section **6769** with the snapshot's fields — but **do not**, unless someone first
establishes that the old version searched a vendor website, which its own code says it did not.

**The delete was verified not to disturb anything else:** run 415 went 167 → 166 tests and 68 → 67
results, **no other test and no other result was lost** — checked before and after, by case id.

> ⚠️ Deleting a TestRail case also deletes its tests and their results, everywhere. The snapshot is
> taken and verified complete **before** the delete, and the run is counted before and after. That is
> the only safe order.

---

## 5a · The comment that was posted

> Withdrawing this — the old version could not do this either, so it is not a regression.
>
> When this was raised, typing `kestrelsupply-zzt.com` on the live product did return the vendor, and
> that was taken as proof the website was searchable. It was not: the vendor's email address is
> `parts@kestrelsupply-zzt.com`, which contains that exact text, and the old search matches anywhere
> inside a record's searchable text. The match came from the email.
>
> Checked against the old product's own code (`FetchDataQueryHandler.php`, the vendor query): the
> fields it searches are name, address 1, address 2, state/province, postal code, city, telephone and
> email. There is no website field. The customer query does have one, which is what made this look
> like an inconsistency.
>
> Sinisa was right. Apologies for the noise.
>
> The matching test is being retired. The customer-website report (SV-10003) is unaffected and stands
> on its own evidence — the customer query has no email field, so nothing else could have carried that
> match.

---

## OUTSTANDING — what I need from you

| # | What I need |
|---|---|
| **1** | **May I post the comment in §5 and ask for SV-10110 to be withdrawn?** Nothing has been posted. |
| **2** | **C55692 — retire it, or rewrite it to test the vendor EMAIL** (which the old version genuinely did search, and which still works)? Retiring is the honest option; rewriting keeps a useful check. |
| **3** | Nothing else needs action — the other 27 field claims in the suite are attributable and were re-proved today. |
