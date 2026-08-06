# Ticket type audit — which of our Bugs should be Story Defects? — 2026-08-06

**The ruling this answers.** QA lead, verbatim: *"Leave the old tickets as it is, however if there is
any old ticket that you have created as a bug that should be actually a story defect."*

**Priorities were not touched.** He settled that in the same breath, and **not one priority field on
any existing ticket was changed.** Nor was any status, any description, any link, or any field on
anybody else's ticket.

---

## The short version, in plain words

We looked at **all 87 tickets our own records say we filed**, and read every one of them live in Jira
today rather than trusting our notes.

- **61** are already right. Nothing to do.
- **12** were already converted by other people (Mudassir Qamar and Ahtasham Amjad). Left alone.
- **6** are still marked as "Bug" but are **closed**, so changing them would achieve nothing.
- **8** are still marked as "Bug", are still **open**, and are the ones you asked about.
- **1** more Bug exists on our shared account that we do **not** believe is ours — flagged below for
  you to confirm.

**We cannot make the change from here.** Jira's own interface refuses it: the only way to turn a Bug
into a Story Defect in this project is the **"Change work type"** wizard in the Jira web page, by
hand. We re-tested that today to be sure it had not changed, and it had not. So the eight below need
your clicks — about **five minutes' work in total** — or a decision to leave them.

**Is it worth doing? Honestly: it is a tidy-up, not a repair — and it has one real cost.** All eight
tickets are *already* linked to the story they belong to, so nobody is missing information today.
What converting buys is consistency with the rest of the project and a defect that shows up when
somebody reviews its story. What it costs is that the ticket **disappears from the epic's own list of
child tickets** — we measured this, and it is explained in full further down. Two of the eight we
would recommend **not** converting at all, because they affect several reports at once and no single
story owns them. Our suggestion is in the last column of the table.

---

## How to convert one (do this once per ticket)

1. Open the ticket in Jira.
2. Click the **⋯** (more actions) button at the top right.
3. Choose **Change work type**.
4. Set the work type to **Story Defect**.
5. Set the parent to the story named in the **"Move it under"** column below.
6. Confirm.

The wizard changes the type **and** moves the ticket under the story in one go. **Do not** pick
*"Story Defect - Archive"* — that is an old, retired type with a confusingly similar name, and
choosing it would leave the ticket in the wrong shape while looking correct.

---

## (B) The eight tickets — still a Bug, still open, should be a Story Defect

| Ticket | Link | What it is about | Move it under | Our suggestion |
|---|---|---|---|---|
| **SV-8818** | [open](https://shopview.atlassian.net/browse/SV-8818) | Downloading a PDF fails with a server error on five of the six new reports. | **SV-8591** — *[Reports Suite][A3] Export contract + 10k row-cap guard* | **Convert.** The fault is in the shared download code, and this is the shared download story, so it is a genuine home. |
| **SV-8820** | [open](https://shopview.atlassian.net/browse/SV-8820) | Inventory Value shows the stock value for the day *after* the date you asked for. | **SV-8672** — *Inv Value - Story 5 - As-Of Date and History* | **Convert.** Certain — the written requirement and the ticket's own link agree. |
| **SV-8823** | [open](https://shopview.atlassian.net/browse/SV-8823) | The Inventory Value spreadsheet sends money as text, and ignores which columns you chose. | **SV-8677** — *Inv Value - Story 10 - Export to PDF and CSV* | **Convert.** Certain — both routes agree. |
| **SV-8845** | [open](https://shopview.atlassian.net/browse/SV-8845) | On a phone, a shared filter link shows the filters switched on but lists the wrong work orders. | **SV-8797** — *Mobile Filter Bar* | **Convert.** Matches Ahtasham's own choice for its twin, SV-8846. *(Alternative: SV-8796 "URL State & Shareable Links" — see the caveat below.)* |
| **SV-8848** | [open](https://shopview.atlassian.net/browse/SV-8848) | Every time shown on the Schedule is six hours later than the time it was scheduled for. | **SV-8686** — *Schedule Grid Layout & Navigation* | **Ask first — do not convert blind.** See the caveat below; Mudassir appears to have left this one out on purpose. |
| **SV-8879** | [open](https://shopview.atlassian.net/browse/SV-8879) | A user with access to only one location is still shown the location chooser, on all six reports. | **SV-8603** — *SBC - Story 4 - Filter by location* | **Leave it as a Bug.** It spans all six reports and every report has its own location story; see the caveat. |
| **SV-8880** | [open](https://shopview.atlassian.net/browse/SV-8880) | The Sales By Representative summary spreadsheet is missing four columns the screen shows. | **SV-8631** — *SBR - Story 14 - PDF and CSV exports* | **Convert.** Certain — both routes agree. |
| **SV-8881** | [open](https://shopview.atlassian.net/browse/SV-8881) | The Technician Utilization download menu drops the word "Download" from all four options. | **SV-8654** — *Tech Util - Story 7 - Export to PDF and CSV* | **Convert.** Certain — both routes agree. |

### What changes as a side effect, on every one of the eight

- The work type becomes **Story Defect**, which makes the ticket a **sub-task** of the story instead
  of a top-level item.
- The parent moves from the epic (or, for SV-8848, from nothing) to the story named above.
- **Product Area is silently emptied.** These eight currently read *Reports & Dashboards* ×5,
  *Work Orders* ×1, *Schedule* ×1. Story Defects have no Product Area field at all, so the value is
  lost, and **Jira does not record the loss in the history** — it is only provable because we
  byte-checked these tickets when we filed them. You have already accepted this: *"Product area loss
  is OK."* It is repeated here only so it is never a surprise.
- **The ticket leaves the epic's own child list.** Measured today, not assumed — see below.
- **Nothing else moves:** priority, status, the description, the source block and the `relates to`
  story link are all untouched by the wizard.

### The three caveats, stated rather than buried

**SV-8845 — two defensible parents.** The failure only happens on a phone, which points at
**SV-8797 (Mobile Filter Bar)**, the story the ticket already links, and the story Ahtasham chose
when he converted its twin SV-8846. But the *mechanism* is the URL, and the ticket's source block
also cites requirement S11-R2, which belongs to **SV-8796 (URL State & Shareable Links)**. Either is
arguable. We recommend SV-8797 for consistency with SV-8846.

**SV-8848 — somebody else already made a decision here.** Mudassir Qamar converted **nine of the ten**
Schedule tickets we filed on 4 August (SV-8849 through SV-8857, all on 5 August between 09:15 and
09:23). He did **not** convert this one. What he did instead was **strip its parent** — SV-8685 → None,
at 2026-08-05T09:21:39-0500 — right in the middle of that run. Converting nine and deliberately
un-parenting the tenth looks like a judgement, not an oversight: a six-hour offset on *every* time
displayed may well be a platform time-zone fault rather than a Schedule story defect. **It is
therefore the one shape the rule forbids (no parent at all), and it is also the one we should not fix
without asking him or you.**

**SV-8879 — the parent genuinely cannot be determined.** The defect appears on **all six reports**,
and each report has its own location-filter story (Sales By Customer SV-8603, Sales By Representative
SV-8638, Technician Utilization SV-8656, Inventory Value SV-8674, and so on). Filing it under the
Sales By Customer story alone would understate it by five reports. Its authority is also a product
owner answer that overrides four separate written specifications, so there is no single requirement
section to point at either. **This is the clearest case in the whole set for a cross-cutting defect
staying on the epic** — which is arguably what the old Bug-on-the-epic shape was for.

---

## Can we do it ourselves? No — re-confirmed today

A proven-absence finding has a shelf life, so the refusal was re-tested rather than taken from our
notes.

**One `PUT` on SV-8881**, asking for work type 10007 (Story Defect) and parent SV-8654:

```
PUT /rest/api/3/issue/SV-8881
{"fields": {"issuetype": {"id": "10007"}, "parent": {"key": "SV-8654"}}}
→ HTTP 400
{"errorMessages": [], "errors": {"pid": "Issues with this Issue Type must be created in the same
 project as the parent."}}
```

The message is misleading — the parent **is** in the same project — but the refusal is the same one
recorded on 5 August, so **nothing has changed and conversion is still web-page-only.**

**The probe was harmless, and that is proven, not asserted:** SV-8881 was read before and after and
**all 59 fields are byte-identical**, `updated` included (`2026-08-06T02:49:35.862-0500` both times).
Evidence: `snapshots/API-REFUSAL-PROBE.json`.

SV-8881 was chosen deliberately: it is ours, it is a Bug that should convert anyway, its owning story
is unambiguous by both routes, and **its history contains not one edit by anybody else** — so even a
*successful* conversion could not have cut across another person's triage.

---

## Does converting actually matter? The honest answer

**Our read: it is about consistency and reporting tidiness, not a defect in the tickets.** All eight
are already linked `relates to` the correct story, so no information is missing today and no developer
is blocked by the shape. But two things are genuinely at stake, and one of them is a **loss**:

**What converting GAINS — measured**

- **Consistency with the project.** Project SV holds **575 Story Defects**: 367 under a Story, 149
  under a Task, 57 under a Bug, 2 with no parent, and **0 under an Epic**. Our eleven epic-parented
  Bugs are the outliers.
- **Per-story visibility.** `parent = SV-8654` returns **5** Story Defects today, and SV-8881 is not
  among them. Anyone reviewing the defects on Technician Utilization's export story sees five of ours
  and misses the sixth.

**What converting LOSES — also measured, and it corrects our own written rule**

- **The ticket drops out of the epic's direct child list.** `parent = SV-8582` / `SV-8685` /
  `SV-8785` returns **11 of our 14 Bugs** and **0 of our 73 Story Defects**.
- **⚠️ So Standing Rule 52's wording that a Story Defect *"STILL ROLLS UP TO THE EPIC"* is not true in
  Jira's query model.** It rolls up only by joining epic → story → defect, two hops. It is **not**
  returned by `parent = <epic>`, and `parentEpic` is no help either — `parentEpic = SV-8582` returned
  only the epic itself, so that operator is evidence for nothing here. **We have not edited CLAUDE.md;
  this is reported for you to rule on.** If you work from the epic's child panel, converting makes
  these eight *less* visible to you, not more.
- **Product Area is emptied**, silently and unloggably, as set out above.

**Not verified, and said so:** board behaviour. A top-level Bug is normally its own card on a board
while a sub-task is nested inside its parent's card — but no board configuration was read live, so
that is ordinary Jira behaviour rather than an observation of ours.

**Recommendation.** Convert the five clear ones (**SV-8818, SV-8820, SV-8823, SV-8880, SV-8881**) and
**SV-8845** if you want the consistency; **ask about SV-8848** because somebody else has already
made a call on it; and **leave SV-8879 as a Bug** because it is cross-cutting and no one story owns
it. That is **six clicks-worth of work with a real trade-off attached**, not a fix — so it is entirely
reasonable to decide it is not worth your time.

---

## (C) Ours, a Bug, deliberately left alone — 6

All six are **closed**. Converting a closed ticket changes nothing anybody will act on, and would put
a fresh change on settled work.

| Ticket | Status | Why it is left alone |
|---|---|---|
| [SV-8819](https://shopview.atlassian.net/browse/SV-8819) | Done | The fix shipped. |
| [SV-8821](https://shopview.atlassian.net/browse/SV-8821) | OBSOLETE | **You ruled on it today**, verbatim: *"Marked it as AObsolete - ignore it for now."* Its parent was also removed under the shared account today (2026-08-06T03:05:46-0500, SV-8582 → None), so the parentless shape is deliberate, not drift. |
| [SV-8822](https://shopview.atlassian.net/browse/SV-8822) | OBSOLETE | Withdrawn under Standing Rule 51 as an API-only defect no user or manual tester can reach. The finding is kept in the defect pack; the ticket was closed rather than deleted. |
| [SV-8843](https://shopview.atlassian.net/browse/SV-8843) | OBSOLETE | Reopened and then **re-closed** under the shared account on 2026-08-05T12:32:50-0500 — a deliberate second decision. |
| [SV-8844](https://shopview.atlassian.net/browse/SV-8844) | OBSOLETE | Closed 2026-08-05T02:40:48-0500; the underlying fault was confirmed fixed. |
| [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | OBSOLETE | Closed 2026-08-04T22:02:41-0500, **though our Filters records note the behaviour still reproduces.** Whether to *reopen* it is a separate question from its type and is your call — we have not bundled the two together. |

**Worth knowing while you are here (no action taken):** **SV-8845** was closed OBSOLETE by Ahtasham
Amjad on 5 August, reopened under the shared account the same day, and **Milos Vasic moved it to
"Ready to Fix" today at 2026-08-06T05:30:12-0500 and assigned it to Dusan Radulovic seven seconds
later.** So the reopen our Filters notes recommended has happened, **a developer now owns it**, and it
is live work — which is why it sits in the convert list rather than here. It is also the one ticket in
bucket (B) where converting would touch something a developer is actively holding, so if you would
rather not disturb it mid-fix, that is a reasonable call.

---

## (D) Converted by someone else already — 12. Not touched.

Every one was filed by us as a `Bug` on the epic and converted by another person, who thereby also
chose its parent story. **Standing Rule 38 and Rule 53's corollary: another person's triage is not
ours to revisit** — and on this shared account their edits are indistinguishable from ours in the
history, which is exactly why we leave them.

| Ticket | Converted by | When | Landed under |
|---|---|---|---|
| [SV-8846](https://shopview.atlassian.net/browse/SV-8846) | Ahtasham Amjad | 2026-08-05T04:46:32-0500 | SV-8797 *Mobile Filter Bar* |
| [SV-8871](https://shopview.atlassian.net/browse/SV-8871) | Ahtasham Amjad | 2026-08-05T04:51:42-0500 | SV-8795 *Filter Persistence* |
| [SV-8849](https://shopview.atlassian.net/browse/SV-8849) | Mudassir Qamar | 2026-08-05T09:15:03-0500 | SV-8692 *Linked Series & Banners* |
| [SV-8850](https://shopview.atlassian.net/browse/SV-8850) | Mudassir Qamar | 2026-08-05T09:15:55-0500 | SV-8693 *Overlap & Lane Stacking* |
| [SV-8851](https://shopview.atlassian.net/browse/SV-8851) | Mudassir Qamar | 2026-08-05T09:16:51-0500 | SV-8700 *View Options, Color System & Display Customization* |
| [SV-8852](https://shopview.atlassian.net/browse/SV-8852) | Mudassir Qamar | 2026-08-05T09:18:28-0500 | SV-8697 *Conflict Detection* |
| [SV-8853](https://shopview.atlassian.net/browse/SV-8853) | Mudassir Qamar | 2026-08-05T09:19:20-0500 | SV-8700 *View Options, Color System & Display Customization* |
| [SV-8854](https://shopview.atlassian.net/browse/SV-8854) | Mudassir Qamar | 2026-08-05T09:20:08-0500 | SV-8687 *Work Order Sidebar & Mini Calendar* |
| [SV-8855](https://shopview.atlassian.net/browse/SV-8855) | Mudassir Qamar | 2026-08-05T09:21:12-0500 | SV-8691 *Multi-Day Spread Scheduling* |
| [SV-8856](https://shopview.atlassian.net/browse/SV-8856) | Mudassir Qamar | 2026-08-05T09:22:12-0500 | SV-8694 *Day View Timeline Interactions* |
| [SV-8857](https://shopview.atlassian.net/browse/SV-8857) | Mudassir Qamar | 2026-08-05T09:23:07-0500 | SV-8687 *Work Order Sidebar & Mini Calendar* |
| [SV-8886](https://shopview.atlassian.net/browse/SV-8886) | Mudassir Qamar | 2026-08-05T09:29:49-0500 | SV-8689 *Scope Picker* |

**Note the pattern that matters for SV-8848:** Mudassir worked straight through the Schedule batch in
an eight-minute run, and **SV-8848 sits inside that window** — he un-parented it at 09:21:39, between
converting SV-8855 (09:21:12) and SV-8856 (09:22:12). He had it open and chose differently.

---

## (A) Already correct — 61. Nothing to do.

All 61 were filed directly in the shape the rule now requires and were verified live:

- **work type `Story Defect` (10007)** on all 61 — hierarchy level **−1**, `subtask: true`;
- **parent is a Story** on all 61 — never an Epic, never a Task;
- **all 50 distinct parent stories** are level-0 Stories under **SV-8582** (34), **SV-8685** (13) or
  **SV-8785** (3), so the roll-up chain is intact in every case;
- **Product Area null** on all 61, as expected — the field does not exist on this type.

Keys: SV-8907, SV-8908, SV-8912, SV-8923, SV-8924, SV-8925, SV-8926, SV-8927, SV-8928, SV-8929,
SV-8930, SV-8931, SV-8932, SV-8933, SV-8934, SV-8935, SV-8936, SV-8937, SV-8938, SV-8939, SV-8940,
SV-8941, SV-8942, SV-8943, SV-8944, SV-8945, SV-8946, SV-8947, SV-8948, SV-8949, SV-8950, SV-8951,
SV-8952, SV-8953, SV-8954, SV-8955, SV-8956, SV-8957, SV-8958, SV-8959, SV-8962, SV-8963, SV-8964,
SV-8965, SV-8966, SV-8967, SV-8968, SV-8969, SV-8970, SV-8972, SV-8973, SV-8974, SV-8975, SV-8976,
SV-8977, SV-8978, SV-8979, SV-8980, SV-8981, SV-8982, SV-8983.

*(SV-8923 is in this list. It is correctly shaped, and separately it is OBSOLETE — withdrawn as an
invalid defect. Its shape is right either way.)*

---

## (E) Not ours — 1 examined and excluded, flagged for you

We also swept Jira from the outside rather than only reading our own list:
**`project = SV AND issuetype = Bug AND created >= 2026-08-01`** → **35 Bugs**, fully paged.

By creator: Bilal Muzamil 15 · Ryan Fyfe 11 · Sasha Grosman 4 · Chris Ward 2 · Tracy Davies 1 ·
Mudassir Qamar 1 · Ayesha Khan 1.

**The 15 on our shared account reconcile exactly:** our **14** still-Bug tickets **+ SV-8910**. (The
12 we filed as Bugs and others converted no longer answer an `issuetype = Bug` query, which is why
the arithmetic works.)

**[SV-8910](https://shopview.atlassian.net/browse/SV-8910)** — *"Vendor invoice total is duplicated
onto every purchase order when one receive spans two POs"*, Bug, Open, no parent, Product Area
**Parts**, created 2026-08-05T15:33:57-0500.

**We do not believe this is ours, and on a shared account we cannot prove it either way — so it is
flagged, not claimed.** Four independent tells all point away from us:

1. it is named in **none** of our committed records;
2. it carries **no source block**, while our retrofit pass put one on all 65 of ours;
3. its body uses **your** Jira template — *"Found this issue while testing this:"*, *"Steps of
   reproduction"* — not our seven-section format;
4. its subject is **vendor invoicing and purchase orders**, which is none of our three active
   projects.

**Please confirm it is yours.** If it is in fact ours, it belongs in bucket (B) and needs a parent
story choosing.

---

## Verification

| Check | Result |
|---|---|
| Population | **87** — the 66 of `TICKET-LIST.md` **+ 21 filed after that list was written** (9 Report Suite session 2, 12 session 3) |
| Every ticket read live today | **87 / 87 HTTP 200** — no field carried forward from a note |
| Creator on every one | Bilal Muzamil (the shared account) on all 87 |
| Buckets reconcile | 61 A + 8 B + 6 C + 12 D = **87** ✓ |
| Story Defects verified in shape | 73 / 73 at level −1, `subtask: true`, Story parent, Product Area null |
| Parent stories verified | 50 / 50 level-0 Stories under SV-8582 / SV-8685 / SV-8785 |
| Outside-in sweep | 35 recent Bugs, fully paged; 1 on our account not in our records, examined and excluded |
| Jira writes | **exactly 1** — the authorised refusal probe, which returned HTTP 400 and left all 59 fields byte-identical |
| Priorities changed | **0** |
| Fields changed on anybody else's ticket | **0** |
| TestRail calls | **0** |

**Population honesty.** `TICKET-LIST.md` listed 66. Auditing only those would have missed 21 tickets
filed the same day — a stale population is the very failure Standing Rule 31's lesson describes. All
21 are in bucket (A), so the answer to your question is unchanged; but the number was verified rather
than assumed.

**Evidence** — `snapshots/live-state.json` (all 87, every field) · `snapshots/bug-detail.json` (full
changelogs for the 14 Bugs + target stories) · `snapshots/API-REFUSAL-PROBE.json` (the one write,
before/after) · `snapshots/rollup-and-sweep.json` (roll-up measurements + outside-in sweep) ·
`snapshots/parent-stories.json` · `snapshots/project-convention.json` · `type-audit.json` (the
machine-readable classification) · `tools/` (every script, all read-only bar `probe.py`).

---

## OUTSTANDING — what I need from you

1. **A decision on the eight in bucket (B).** Convert the five clear ones plus SV-8845? Our
   recommendation is above, including the two we suggest you *don't* convert. **We cannot do it from
   here** — the API refuses, so it is the web-page wizard by hand.
2. **A ruling on SV-8848.** Mudassir converted nine of ten and deliberately un-parented this one. It
   is currently the one shape the rule forbids (no parent). Should it go under SV-8686, under a story
   he picks, or stay as it is?
3. **A ruling on SV-8879.** It affects all six reports and no single story owns it. We recommend
   leaving it as an epic-parented Bug; that is the opposite of what the rule says, so it needs your
   word.
4. **Confirm SV-8910 is yours.** If it is not, it belongs in bucket (B) and needs a parent story.
5. **A ruling on the roll-up wording in Standing Rule 52.** It says a Story Defect *"STILL ROLLS UP
   TO THE EPIC"*, and we measured today that it does **not** in `parent = <epic>` — 0 of our 73.
   **We have not edited CLAUDE.md.** The rule's *shape* is unaffected; only its stated rationale is
   inaccurate, and it matters because it is the argument for converting.
6. **Whether SV-8847 should be reopened** — closed OBSOLETE, but our Filters records say the
   behaviour still reproduces. Kept separate from the type question on purpose.
