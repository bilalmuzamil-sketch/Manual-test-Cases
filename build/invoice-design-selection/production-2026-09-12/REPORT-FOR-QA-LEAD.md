# Invoice redesign testing on the live Production account — where it stands

Tested through the night of 12 September on the live Production account, on the build that went out
today. Everything below was seen on screen or in the actual document a customer would receive.

**Nothing failed.** Not one check found the feature doing the wrong thing.

---

## 1 · What is finished

| What was checked | Result |
|---|---|
| The shop-wide setting itself — the switch, the confirm box, what happens when a save is refused | Works as written |
| Every customer document now follows the shop's setting — all six kinds, each seen under both looks | Works as written |
| The money never changes between the two looks — same totals, same tax, same document numbers | Confirmed on every document checked |
| A copy already saved or already in a customer's hands does not change when the shop switches | Confirmed |
| Undoing an invoice and raising it again gives the new invoice the look the shop is set to right then | Confirmed |
| A customer credit that stands on its own follows the current look and keeps no look of its own | Confirmed |
| The old look's approval column, and the approving contact staying put and locked after invoicing | Seen working (one part still open — see section 4) |

**Thirty-six of the forty-five checks now carry a Production result.** Each one has its own comment
on the test, clearly marked as coming from Production, with the earlier result left untouched below it.

> ⚠️ **One thing to watch when you open the run:** the run's own summary says 45 passed. That is
> counting the earlier testing too. The number that matters is **36 with a Production result**; the
> other nine still show what was found on the test site, not here.

---

## 2 · What is left, and exactly what each one needs

| What is left | Why it is not done | What would finish it |
|---|---|---|
| A brand-new shop starts on the new look | Would mean creating a real new company on the live system | Your say-so, or do this one on the test site instead |
| Someone without settings access cannot see the setting | Needs a second sign-in that does not have settings access. Making one sends a real invitation email to a real address | Give me a second username and password that lacks settings access, or say it is fine to invite one |
| A credit spread across several invoices at once | It needs two invoices standing unpaid at the same time, and this customer has money already sitting on account that settles each new invoice the moment it is raised, so nothing stays unpaid. Raising fresh work instead does not help either: a new job cannot be invoiced until a foreman or manager approves it, and this sign-in cannot approve its own work | Either approve a couple of jobs for review and give me a customer with no money on account, or accept that the same behaviour was already proved on two other credits — one raised against a parts sale, one standing entirely on its own — both of which followed the shop's setting and kept no look of their own |
| Sending a document by email — three checks | The send box opens with a **real customer's email address already ticked**, and it would not untick. I stopped rather than risk emailing a real person from the live system | Confirm that address is safe to email, or point me at a job whose customer address is a test one |
| Paying by card on the customer portal — two checks | Card taking is switched **off** on this account, and there are no card payments at all. Turning it on is a money-handling change on the live system | Tell me to switch card taking on, or leave these two to the test site |
| Batch and imported invoices | **Batch:** the report that lists them shows none at all on this account, so there is nothing of that kind to open. **Imported:** there IS a screen for importing invoices from a spreadsheet. I used its own template, and it said "imported successfully" — but I could not then find the imported invoice anywhere: not on the customer's list, and not in the full list of every job on the account, which I went through to the end. So I could not open it under each look | Tell me where an imported invoice shows up once it has been brought in — or point me at one that already exists. Worth a glance in its own right: a spreadsheet that reports success but leaves nothing you can find is the sort of thing a real customer would notice. I have not called it a fault and have not failed anything for it |

---

## 3 · Nothing is blocked in a way that stops the rest

Every item above is waiting on a decision or a piece of data, not on anything broken. None of them
blocks any other check, and none of them blocks the invoice refresh testing you want to run next.

---

## 4 · Two things for you to decide

### (a) The two questions for the Product Manager — ticket is written and waiting

You asked me to raise these as a task once all the testing was done, to link them to the right
stories, and **not** to fail any test because of them. All three done. The ticket is written in plain
words with two labelled pictures showing exactly what differs, and it says in its own text that no
test has been failed for either point.

**The two questions are:**

1. On an invoice where a line carries an extra fee, the two looks add that fee up differently on the
   line itself — one look folds it into the line, the other keeps it separate. **The customer is
   billed exactly the same either way**, and the summary underneath is identical in both. Only the
   line's own total reads differently.
2. On an estimate — a quote for work not yet done — the old look prints a "Payments" heading and a
   "Balance". The new look prints neither. This happens on any estimate, including ones for jobs that
   have never been invoiced and have taken no money, where the balance simply repeats the total.

Neither breaks the written specification, which allows the two looks to lay a document out
differently. The question is whether they are what the product should do.

**What I need:** his answer, and then whether the related checks are passed or failed.
**If nothing happens:** the ticket just sits there. Nothing is blocked, and no test is affected.

### (b) A small thing worth a look, separate from this feature

Bringing invoices in from a spreadsheet said **"imported successfully"**, and the system raised no
complaint about the file, but afterwards I could not find the invoice it says it created — not on the
customer, and not among every job on the account. It may simply live somewhere I have not thought to
look, which is why I am telling you rather than raising it. It has nothing to do with the two looks,
and no test has been marked down for it.

### (c) One check that is three-quarters done

The check on the old look's approval column found three of its four parts working correctly. The
fourth needs a job carrying an approval code from the outside approval system, and no job on this
account has one. Getting one means sending a **real approval request out of the live system**, which
I would not do while you were asleep.

**Your options:** (1) say it is fine to send one — I will finish it; (2) accept it as passed on the
three parts that were seen; or (3) leave this part to the test site.
**If nothing happens:** this one check stays without a Production result. Nothing else is affected.

---

## 5 · Ready to hand over?

**Not yet — nine checks still need a Production result, and six of those need something from you.**
The thirty-six that are done are finished properly and need nothing further.

The invoice refresh testing you wanted next has not been started, as agreed — that waits until this
one is complete.

---
---REFERENCE--- (identifiers, for the record — not needed to read the above)

Run 446 · https://shopview.testrail.io/index.php?/runs/view/446 · build `v26.36.4-3e1c643` ·
account `bilal.muzamil+serviceadvisornoreports@shopview.com` · org Bilal-Trucks · workplaces Truck Hill 1
and Trucks Hill 2.

**With a Production result (36):** C53518–C53522, C53524–C53528, C53530–C53536, C53539, C53540,
C53541, C53542, C53543, C53544, C53546–C53550, C53552–C53564, C53566, C53571, C53572, C53592
(exact list in `PR-01.json` … `PR-12.json`).

**Without one (9):** C53523 · C53529 · C53537 · C53545 · C53551 · C53565 · C53567 · C53568 · C53569.
**Three-quarters done, held:** C53570.

**Ticket raised:** SV-9978 (Task, Medium, Product Area Work Orders), linked `relates to` SV-9895 and
SV-9897 under epic SV-9892 — https://shopview.atlassian.net/browse/SV-9978

**Evidence:** `build/invoice-design-selection/production-2026-09-12/` — probes PR1–PR59, documents
under `evidence/`, results under `PR-*.json`.
