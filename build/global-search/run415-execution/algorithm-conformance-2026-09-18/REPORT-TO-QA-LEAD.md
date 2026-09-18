# One ticket raised — and two corrections you need to know about

## The ticket: https://shopview.atlassian.net/browse/SV-10238

**"Search does not combine words that live in different fields of one record."**

The plainest way to say what is wrong: **the product cannot find a record by the words it prints for
that record.**

- A truck whose line reads *2019 Freightliner Cascadia* is found by **2019** (twenty trucks come
  back) and by **Freightliner** (twenty come back). Type **2019 Freightliner** and **no truck comes
  back at all**.
- A job whose line reads *S9160-17671 ZZAUTOTEST Fibridge Logistics* is found by its number. Type the
  number and the customer together and **nothing comes back anywhere**.
- A part whose line reads *ZZAUTOTEST Fibridge Brake Shoe Kit · ZZT-FIB-1001* is found by its number.
  Type two words of its name with that number and **nothing comes back**.
- Two words that live in the same place do work — *Freightliner Cascadia* is fine — which is what
  shows the wall is between the fields, not between the words.

It matters because it is the most natural way anyone searches: people type what they can read off
the truck or the paperwork. And it is silent — the record does not appear, which reads as the record
not existing. The more precisely someone describes what they want, the less likely they are to find
it.

Three pictures are in the ticket, each showing the same search twice — one word, then two — marked
up and sized to fit the description.

## What I seeded to be sure, and what it proved

You said to seed whatever I needed, so I built a set of six customers that differ in **exactly one
thing**: where the typed word sits — at the start of the name, in the middle of the name, in the
address, in a contact's name, in the telephone, and one with a single letter changed. Same address,
same style of name, no jobs, no history. That way any difference in the order can only come from the
one thing being tested.

**Everything else in the scoring is right, and I can show the numbers.** Every rung of the ladder
landed exactly where the requirements say it should, including the small extra weight a match on the
company's own name is supposed to get over a match on one of its other details. I also seeded two
identical trucks a few years apart and the newer one gets exactly the small lift it is meant to get.

So the ticket says one thing only, and says it with evidence.

## Two corrections

**1. The report I raised this morning no longer happens.** The test branch was rebuilt during the day.
On this afternoon's build the name that starts with what you typed now ranks above the one that
merely contains it, which is what we asked for. I have re-run the check and marked it as passing.
**SV-10211 should be closed** once someone confirms the fix went in on purpose.

**2. One of our older reports looks wrong, and it is ours, not theirs.** SV-10161 says a company found
through one of its people must not outrank a company found by its own name. The requirements do not
say that — they only give the name match a small extra weight, and in that particular comparison the
other company was matched in a stronger way *and* has eleven open jobs, both of which the
requirements say should lift it. My controlled test shows the small extra weight is applied
correctly. **I recommend withdrawing that report and correcting our own check.**

---

## OUTSTANDING — what I need from you

**1. Close SV-10211?** It no longer happens on today's build. Say the word and I will add a short note
saying what I re-measured and ask them to confirm the fix was deliberate.
*Cost of leaving it:* a developer spends time chasing something that is already fixed.

**2. Withdraw SV-10161 and correct our check?** The product is behaving as written. I will not touch
either until you say so.
*Cost of leaving it:* we are asking for a change that would break the agreed way results are ordered.

**3. Nothing else is outstanding for the new ticket** — it is filed, pictured and linked to the
matching work and to the older truck-specific report.
