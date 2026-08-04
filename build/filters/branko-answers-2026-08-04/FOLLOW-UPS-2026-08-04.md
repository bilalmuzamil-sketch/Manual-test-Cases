# Filters — follow-ups after Branko's answers of 2026-08-04

> **ONE optional confirmation line is drafted. ONE candidate is deliberately NOT asked.**
> **No new question sheet has been created**, and none should be: a whole sheet for one
> belt-and-braces line would invite him to hold two Filters sheets at once and answer the wrong one.

**The bar every candidate had to clear first.** Four questions have already been withdrawn on this
project for asking something a source had already answered. So nothing below is proposed until it is
**proved unanswered** against three things: (1) his answers of **2026-08-04**, (2) **all** his prior
answers — 2026-07-17, 2026-07-20, 2026-07-31 — and (3) the **live** v1.6 spec body, re-fetched from
Confluence this pass (page 572030978, version 14, 73 403 bytes).

---

## 1. DRAFTED — **OPTIONAL** · does the mobile combined "All Filters" sheet keep its "Apply filters" button?

### 1.1 The proof that it is unanswered

| Source checked | Method | Result |
|---|---|---|
| **Live spec v1.6 body** | full-text scan of the storage-format body fetched this pass | **`"Apply filters"` — 0 hits.** The only `"All Filters"` hit is `S8-R1`'s phrase *"removes all active filter selections across **all filters**"* — **not the screen.** `"bottom sheet"` appears once, in `S12-R3`, describing dropdowns generally. **The screen does not exist in the document.** |
| **Live spec — the contrary requirements** | same scan | `S2-R6`, verbatim: *"The table filters in real time as the user makes selections **(no confirm/apply button needed)**"*. `S12-R2`, verbatim: *"The filter chips behave **identically to desktop**…"*. Both point away from a batch Apply step. |
| **His 2026-07-17 answers** | grep for `all filters` / `apply filter` | **no mention** |
| **His 2026-07-20 Round-2 answers** | same | **no mention** |
| **His 2026-07-31 answers** | same | **no mention** — the closest is Q5's mobile-parity sentence, which is about Parts/Reports matching Work Orders, not about the sheet |
| **His 2026-08-04 answers** | per-cell scan of column F, all nine | only **Q1** touches it, and **only through the option text he selected** — his typed words are *"A - no apply button"*, which on its face is about the **single-filter** window |

**Verdict: genuinely unanswered in his own words.** The combined sheet's button is supported by
**endorsement-by-option-selection**, not by a sentence he wrote.

### 1.2 Why it is OPTIONAL, stated honestly rather than oversold

The six cases that assert this button **already have a defensible basis**, and it should be said
plainly so nobody treats this as a hole:

1. **The option he chose names the model.** Option A read *"(the engineering plan's way)"*, and the
   `What happens now` column he read defined that model as *"only the combined "All Filters" window
   keeps an "Apply filters" button"*. He selected it **without amendment**.
2. **The engineering plan states it verbatim** — decision **D15**: *"Mobile "All Filters" combined
   bottom sheet — **IN**, with an "Apply filters" button (batch-apply; deliberate difference from
   desktop real-time). Individual chips/sheets stay real-time."*
3. **The agreed design shows the sheet and its sticky button** (Figma `11884:13689`).

So three sources agree, one of them a PO selection. **This line is insurance for a public challenge,
not a blocker**, and no case is being held for it. If you would rather not spend another question on
Branko, the honest position is already good.

### 1.3 The line, ready to send (Rule 7 — plain, no jargon, no case IDs)

> **One small confirmation, please.** On a phone there are two different windows. Tapping a **single**
> filter button opens a small window for just that filter — you told us on 4 August that choices there
> apply **straight away, with no button**, and we have set our tests to that. There is also a
> combined window called **"All Filters"** that lists all five filters together, and the design shows
> a blue **"Apply filters"** button at the bottom of that one. Can you confirm the combined window
> **keeps** that button, so nothing happens to the list until it is tapped? Yes or no is enough.
>
> *(Why we ask: your written description says filters apply straight away and never mentions this
> combined window, so we want your word on it rather than reading it off the picture.)*

**How to send it:** append to the existing thread where the 2026-08-04 sheet was returned. **Do not
create a new sheet.**

**If he answers YES** → no case changes at all; the six cases' basis simply becomes his own sentence
instead of an option he selected, and the defence register's paste-ready answer gets stronger.
**If he answers NO** (the combined window has no button either) → **6 cases need real edits**:
FLT-MOB-02 [C29622](https://shopview.testrail.io/index.php?/cases/view/29622) ·
FLT-MOB-03 [C29623](https://shopview.testrail.io/index.php?/cases/view/29623) ·
FLT-MOB-05 [C29625](https://shopview.testrail.io/index.php?/cases/view/29625) ·
FLT-MOB-06 [C29626](https://shopview.testrail.io/index.php?/cases/view/29626) ·
FLT-MOB-07 [C29627](https://shopview.testrail.io/index.php?/cases/view/29627) ·
FLT-MOB-08 [C29628](https://shopview.testrail.io/index.php?/cases/view/29628).

---

## 2. DELIBERATELY NOT ASKED — the six never-opened filter buttons' option lists

**The candidate:** his **Q8** answer does not address the six buttons it was asked about (Location,
Transaction Type, Invoice Status, Type, User, Mention). On the face of it, that looks like a
re-ask.

**Why re-asking would be wrong — he has now answered it twice, in substance:**

| Date | His words, verbatim | What it establishes |
|---|---|---|
| **2026-07-31**, Q3 | *"We should support all the filters we have right now in the app as well as all choices per filter. **There is no specific list of choices.**"* | the option lists are **data-driven**; there is no fixed list to assert |
| **2026-08-04**, Q8 | *"**We do not have list of all filter items.** we should have all filters we support now per each page plus we should add new ones."* | **no written list exists** — stated directly, for the second time |

**And our case already tests it that way.** FLT-RPTS-22 ·
[C38911](https://shopview.testrail.io/index.php?/cases/view/38911), live expected item 3: *"Write down
the choices you actually see behind each of these six buttons. **They have not been written down
anywhere yet, so your list becomes the record.**"* — his answer **confirms that sentence is accurate**
rather than contradicting it.

**Conclusion:** a third ask would produce the same reply and would be the **fifth** withdrawn question
of this project. **Not asked.** The residual — that six option lists have no written source — is a
recorded, honest limitation of FLT-RPTS-22, not an open question. It will be settled by **observation
at VIU**, which is exactly what the case instructs.

---

## 3. NOT A QUESTION FOR BRANKO — two items that are now other people's

Both came out of his answers and neither is a PO question, so neither belongs on a sheet.

| Item | His words | Who it is for |
|---|---|---|
| **The page-by-page Parts/Reports filter list** | *"Same as before, we do not have concrete list. **If this is really necessary i suggest Engineering + PO together make a list for remaining 6 Parts pages i Reports, using same format as Work Orders do.**"* | **The QA lead**, to arrange that joint session. He has not refused — he has named the owners and the format. Asking *him* again would ignore what he actually said. |
| **The searchable-field write-up** | *"**Have Engineering write up that list as technical documentation (not as a blocker for tests, but as a reference document).** Tests can work with "typing narrows the list" until the list is complete."* | **Engineering.** Explicitly **not blocking** our tests. Recorded so that `S13-R23`'s *"Pending"* marker finally has an owner. |

---

## 4. Nothing else

The other seven answers (Q1's direct half, Q2, Q3, Q4, Q5, Q6, Q7) are **clear, actionable and
complete**. They raise **no** new product question. Their consequences are worked through in
`answers-ingested.md` §3 and staged in `staged-case-plan.md`.

**One item that is NOT a question but should not be forgotten:** two of his answers can only be
**confirmed against the running build** — Q1's mobile sheet behaviour and Q3's Vendors filter bar.
Both are marked **"needs the live check once VIU is authorised"**. The Filters QA branch
(`sv8785.qa.shopview.com`) was **not touched** by this pass, per the QA lead's reservation of Filters
VIU until Report Suite is complete.
