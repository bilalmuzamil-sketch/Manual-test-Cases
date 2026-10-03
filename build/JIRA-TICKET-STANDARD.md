# The Jira ticket standard (every ticket we create or rewrite)

**Canonical example: [SV-10804](https://shopview.atlassian.net/browse/SV-10804)** — *"Vendor credit puts its
tax into Parts Inventory instead of Sales Tax Expense"* (2 Oct 2026). The QA lead's ruling on it, verbatim:
*"Learn from this ticket creating model and save it forever with you as a standard. The tickets should be
like this."* Its body is saved at `build/sv10406-accountinghub-2026-10-02/SV-10804-description.txt`.
**Standing Rule 95 makes this standard mandatory and adds the before/after learning check.**

This document **supersedes** the ticket parts of `build/ANNOTATED-SCREENSHOTS-AND-BITEPROOF-TICKETS-GUIDE.md`
where they disagree (that guide still describes linking images from GitHub and a technical section).
Its Part 1 (how to annotate) still applies; image *quality and placement* now follow §5 below.

---

## 0. The test of a good ticket

**A first-time, non-technical reader understands the problem from the summary alone, and can reproduce
it by following the steps without asking a question.** Everything below serves that.

The three corrections that shaped SV-10804, so they are never needed again:

| What the QA lead said | What it means for every ticket |
|---|---|
| *"keep this ticket super straight forward … Small summary in a few line. Steps of reproduction Expected behavior: and mention from where that expected behavior is coming from and then the current behavior."* | Fixed layout, in that order (§3). Expected behaviour always cites its source. |
| *"you are using worlds like 1300 parts inventory. 6110 Sales Tax Expense … which the first time readers would be confused to understand."* | Plain words. No account codes, internal ids, endpoints or jargon (§4). |
| *"the image quality is not retina level they are hard to see"* | 2× captures, tight crops, captions under the image, embedded at half size (§5). |

---

## 1. BEFORE writing the ticket — the pre-ticket check (Rule 95, part A)

1. **Read this standard**, `build/LESSONS-INDEX.md` (scan by the shape of the problem) and the playbook
   recipe for the area (e.g. §AJ for returns/credits, §V.0 for attachments). Reuse; don't rediscover.
2. **Search Jira for a duplicate first** — on the plain symptom, the on-screen wording and the screen
   name, in **all statuses** (Rule 93). Read the closest matches.
3. **Re-read the source ticket live, newest comments included, right before filing** (Rule 59). On
   SV-10804 this found the PO had already routed the issue elsewhere (Chris Ward, comment 77800) — that
   went to the QA lead as a question, and the ticket was filed only after he said *"Yes file a new ticket."*
4. **Reproduce with brand-new data, more than once, ideally with different values** (SV-10804: three
   runs, two tax rates). The QA lead: *"DO not try proving it as a problem with the existing data,
   create new data."*
5. **Drive every step the reader will follow ON SCREEN** before writing it down (Rule 68). Steps done
   through the API during setup must be redone on screen, or left out of the steps. On SV-10804 this
   caught two steps that had changed (Add Part is an inline row; Receive opens a dialog on the work order).
6. **Capture the evidence at 2× while you are there** (§5) — the screens, and the row positions to mark.

## 2. Fields

| Field | Value |
|---|---|
| Type | **Bug** |
| Priority | **Medium**, always (the PO raises or lowers it) |
| Product Area (`customfield_10153`) | **Required — create fails without it.** Copy the source ticket's value (e.g. Accounting = id 10533) |
| Labels | copy the source ticket's |
| Parent | the epic, where the source ticket has one; if the source ticket is parentless, leave it parentless and say so in your notes (Rule 52) |
| Links | **Relates** → the ticket you were testing, plus any ticket that will own the fix |
| Title | the problem in plain words, ≤ ~80 characters (Rule 69). SV-10804: *"Vendor credit puts its tax into Parts Inventory instead of Sales Tax Expense"* |

## 3. The body — always this layout, in this order

```
Found while testing [SV-xxxx|https://shopview.atlassian.net/browse/SV-xxxx]     <- only when it was found while testing another ticket

h3. Summary
<2–3 plain sentences: what goes wrong, in everyday words. No codes, no jargon.>

h3. Steps to reproduce
Open <environment>: <link> (<login>, location <name>).
# <step with the exact on-screen labels in *bold*>
# ...
# <the step where the problem becomes visible>:
!01-<what-it-shows>-hd.png|width=<w/2>,height=<h/2>!          <- the image sits right after the step it proves
# <next step>                                                   <- fix the numbering after an image (§6)

*Fastest way to see it:* <deep link to an example already in the environment> <and the one click left>.

h3. Expected behaviour
<1–2 plain sentences.>
*Where this comes from:*
* [SV-xxxx|link]: <plain one-line meaning> — _"<short verbatim quote>"_
* <spec page + version + requirement, or the PO's answer + date>

h3. Current behaviour
<1–2 plain sentences.>
!02-<what-it-shows>-hd.png|width=<w/2>,height=<h/2>!
<"It happened on all N tries:" + a small plain table, one row per try>

Tested on <environment>, <date>.
```

**Rules for each section**
- **Summary**: a reader who stops here still knows what is wrong.
- **Steps**: numbered, every click, exact on-screen labels in **bold**, real test data named (Rule 50),
  nothing that needs a console or an endpoint. One clear path — not two alternative routes.
- **Expected behaviour**: comes from a document — a ticket, the spec, a PO answer (Rule 57), never from
  what the build does. **Always say where it comes from**, with a short verbatim quote. If no document
  covers it, it is a question for the PO, not a ticket (Rule 58).
- **Current behaviour**: what you saw, in the same plain words as the summary, then the picture, then
  the counts (*"all three tries"*).
- **No "Technical details" section** unless the QA lead asked for one on that ticket (Rule 84). Endpoint
  names, ids and raw responses go in the findings doc.
- Human QA voice, no AI fingerprint (Rule 65).

## 4. Plain words

- Describe **what happened**, not the system's internals: *"the tax was recorded as a tax cost"*, *"taken
  off the value of the parts in stock"* — not *"Dr 6110 / Cr 1300"*.
- **No account codes, internal ids, endpoint names, HTTP codes, field names, or accounting terms**
  (debit/credit, COGS) in the text a reader reads.
- An on-screen name appears **only where the reader has to find it**, with a plain explanation beside it
  the first time: *"the tax cost (Sales Tax Expense)"*.
- A verbatim source quote is allowed in *Where this comes from*, **after** the plain explanation of what it means.
- **Check it mechanically after posting:** grep the read-back text for account codes and jargon words.

## 5. Images — sharp, tight, explained underneath

- **Capture at 2×:** `open({env, cookies, vp:{width:1300,height:900}, dpr:2})` in
  `build/testing-tools/qa-session.mjs`. Widen the window when the screen is wider (the ShopView return
  page needs 1700).
- **Record the exact position** of each row you will mark with `getBoundingClientRect()`.
- **Build with `build/testing-tools/ticket_exhibit.py`:** `panel()` crops to **only the rows that matter**,
  draws a box and a numbered badge on each, and writes the explanation as **numbered plain sentences under
  the image**; `stack()` puts before/after panels in one image; `jira_embed()` gives the half-size embed.
- **Before/after in one image** when the point is a difference (SV-10804: "when the part was received"
  above "when the part was returned").
- **Name files by what they show**, ending `-hd.png`.
- **Look at every image before uploading**: nothing cut off at the edges, badges visible, no caption
  covering a value.
- **Upload as real Jira attachments** (`POST /rest/api/3/issue/{key}/attachments`, `X-Atlassian-Token:
  no-check`), never as external links (Rule 81). **Delete attachments that a new version replaces**, so
  the ticket only carries the current images.

## 6. Posting mechanics (proven on SV-10804)

1. Create with `POST /rest/api/2/issue` — wiki-markup `description`, fields from §2 (Product Area included).
2. Upload the images, then **re-PUT the description** so the `!file!` references bind to the uploads.
3. **An image between numbered steps restarts the numbering at 1.** Fix: GET the stored ADF via v3, set the
   second `orderedList.attrs.order` to the right number, PUT it back via v3.
4. Add the **Relates** links (`POST /rest/api/2/issueLink`).
5. **Read it back** (v3) and check: headings in order; images are `media type=file`, in the right places,
   at the right size; numbering continues; table rows; links; priority; no account codes or jargon; no AI
   fingerprint. The write response only echoes what you sent — the read-back is the proof (Rule 81).

## 7. AFTER filing — the learning check (Rule 95, part B)

Before the turn ends, ask: **did anything on this ticket go wrong, get corrected, or work in a new way?**
For each yes, write it down **in the same turn** where it will be found next time:

| If it was… | Put it in… |
|---|---|
| a change to how tickets should look or read | **this standard** (and point §0 at the correction) |
| a new way to do something in the app or Jira | the **playbook** recipe for that area |
| a mistake, or a correction from the QA lead | a row in **`build/LESSONS-INDEX.md`** |
| something that must always be done | a **Standing Rule** in `CLAUDE.md` |
| repeated work a script could do | a tool in **`build/testing-tools/`** |

Then commit and push (Rule 29). If nothing needs adding, say so in the findings doc — *"learning check:
nothing new"* — so it is visible that the check ran.

## 8. A "remaining issue" comment to a developer (QA lead, 2026-10-03)
*"The comment is too big. We just need something like whats happening vs what it should be that is it."*
Keep it to: the mention · a title · **What's happening** (one line per issue, with one example on the branch) · **What it should be** (one line, naming where it comes from) · the screenshots. No full step lists, no tables, no "for reference" sections. Example: SV-8552 comment 77811.

## 9. When the fix is only partial (Standing Rule 97, QA lead 2026-10-03)
- The QA comment's first panel is **not green**: *"OVERALL QA STATUS: PARTIALLY PASSED"*, then one line — the details of what passed are below, and the remaining issues to be fixed are in a separate comment.
- The remaining issues go in **their own comment** to the developer, in the §8 short format.
- **Never** a "things I did not treat as faults" section. Anything that looks wrong goes to the QA lead as a question, with steps for him to reproduce it; he decides whether it joins the remaining-issues comment.
- Green *"OVERALL QA STATUS: PASSED"* only when every point is verified fixed.
