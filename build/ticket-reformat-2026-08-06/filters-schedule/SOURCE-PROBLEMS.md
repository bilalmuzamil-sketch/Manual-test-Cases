# Source problems — for the QA lead

Standing ruling: *"Any ticket which do not have any source you need to give them to me."*

**Headline: every one of the 22 rewritten tickets has a real, live-verified source. None
had to have one invented, and none is sourceless.** What follows is the smaller and more
useful list: the three whose source is only **partly** supported, plus one ticket that is
not ours at all and does look genuinely sourceless.

## How the sources were checked

Not from our mirror — from the live pages, today:

| Spec | Confluence page | **Confluence version** | Published | The in-body "Version" field |
|---|---|---|---|---|
| Filters | 572030978 | **19** | 2026-08-06T11:48:47Z | says `1.6` |
| Schedule | 713031682 | **25** | 2026-08-06T09:13:51Z | says `1.0` |

Both in-body fields lie, exactly as Standing Rule 31 trap (a) describes. The
**Confluence version number** is what the tickets now cite.

Every requirement each ticket cites was checked **two ways** — the anchor present in the
live text, and a distinctive phrase from the quotation present in the live text — and a
claim passes only if both hold. **22 tickets, 33 claims, 0 failures**
(`snapshots/specs/source-verification.json`). Two of our tickets were once caught citing
requirements that did not exist; that is why this is done by machine against the live
body and not by eye.

**Nothing had moved.** Filters went v18 → v19 and Schedule v23 → v25 since our mirrors were
taken, but none of the 33 requirements these tickets rest on changed a word. So no ticket
needed re-deriving, and the version numbers in the Source sections were simply advanced to
the versions we actually read.

## The three whose source is only PARTLY supported

Each of these says so **in its own Source section**, in one plain sentence, rather than
claiming support it does not have. They are listed here so you see them without reading 22
tickets.

### 1. [SV-8848](https://shopview.atlassian.net/browse/SV-8848) — every time is six hours late

- **What the spec does support:** §4.2, that a shift's start follows the technician's
  configured working hours; and §4.8, that the Day view's "now" marker shows the current
  time. The six-hour shift breaks both.
- **What it does not support:** the specification **writes no rule about time zones
  anywhere**. It is silent on which clock the board should show.
- **Risk if challenged:** low. A 7:00 AM job reading 1:00 PM fails §4.2 whichever clock you
  argue for. But if Branko takes a different view of which clock is right, this is a
  question for him rather than a defect for a developer.

### 2. [SV-8924](https://shopview.atlassian.net/browse/SV-8924) — assigning an unassigned job moves its saved time six hours earlier

- **What the spec supports:** §3.2, dragging from the unassigned row onto a technician
  assigns it; §4.2, "that technician's hours apply".
- **What it does not support:** the spec **never says the start time must be left exactly
  as it was**. The ticket's expected behaviour is stricter than the written rule, and the
  ticket now says so.
- **Why it is still a defect on the written rule:** the job landed at 1:00 in the morning
  and the receiving technician works 07:00–19:00, so 1:00 AM is neither the time the job
  had **nor** that technician's hours. §4.2 fails either way.
- **Risk if challenged:** low, for that reason.

### 3. [SV-8933](https://shopview.atlassian.net/browse/SV-8933) — working hours cannot be opened for a staff member from another location

- **What the spec supports:** §4.2, that turning "Set custom hours for this technician" on
  reveals the per-day Mon–Sun From/To editor.
- **What it does not support:** the spec puts **no condition on which location the staff
  member is viewed from**, and never says whether working hours are held per location. It
  is silent.
- **The open product question:** if hours really are per-location, the right outcome is a
  screen that says so, not an error reading *"Couldn't load this technician's hours"*. That
  is Branko's decision, and the ticket says so in as many words.
- **Risk if challenged:** medium — a developer could reasonably answer "working hours are
  per location, working as intended", and the ticket would then need Branko rather than a
  fix. Worth asking him.

## One ticket that is NOT ours and does look sourceless

### [SV-8916](https://shopview.atlassian.net/browse/SV-8916) — "Add Existing Work Order" button missing from build

- **Not ours.** Read live today: creator **Sasha Grosman**, issuetype Bug, parent SV-8685,
  priority Medium, status **Blocked**, label `clarification-required` added by Milos Vasic
  at 2026-08-06T03:26. **Not rewritten and not touched** (Standing Rule 38).
- **We did check the claim, and it holds up:** the phrase *"Add Existing Work Order"*
  appears **0 times** in the live Schedule specification v25, and so does *"existing work
  order"*. The expectation is reported to come from Sasha's own design page, which is a
  share URL to a live editable page with no version and no date on it — not the artefact we
  ingested.
- **Why it is on this list anyway:** it is a ticket against the Schedule epic whose
  expectation has no requirement behind it, and Milos has already blocked it asking for
  clarification. Under your standing ruling that makes it yours to see. **Nothing was
  invented for it and nothing was edited on it.**

## Two things about the sources that are worth knowing

- **The Schedule spec is two versions ahead of our ingested baseline** (live 25, mirror 23).
  A sibling worker is diffing them; this pass did not attempt that diff. What it did do is
  read the **live** text for every requirement it quotes, so nothing here rests on the
  stale mirror.
- **The Filters spec moved to v19 at 11:48Z today, during this pass.** It was re-read at
  write start 13:26:51Z (Standing Rule 59) and was still v19, and the four Filters tickets'
  requirements were unchanged in it.

## Outstanding — what I need from you

1. **Branko, on SV-8933:** are technician working hours meant to be held per location? If
   yes the ticket becomes "show a proper message instead of an error"; if no it is a plain
   bug. Nobody has asked him.
2. **Branko, on SV-8848:** which clock should the Schedule board show? The spec never says.
   Answering it closes the only soft edge on that ticket.
3. **Your call on SV-8916** — it is Sasha's ticket, already blocked by Milos for
   clarification, and there is no requirement behind it. We have not touched it.
4. **Nothing else is outstanding on the sources.** All 33 requirement citations across the
   22 tickets are live-verified.
