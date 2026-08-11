# Schedule — CHANGES MADE (read-dates pass, 2026-08-11)

## What changed, in one line

**Every source that every one of the 174 Schedule cases cites now carries the date WE read it**, so a
source that moves later cannot make the case look as though it was misread.

## The ruling this implements

QA lead, 2026-08-11, verbatim (his typing preserved, Rule 25):

> *"every expected behavior as I mentioned before should have a reference in the test cases in the
> same format as you are keeping that must tell the Manual QA guy or anyone who is auditing those
> test cases that these are the sources of the expected behavior, make sure to mention the date of
> the source when that source of truth was taken from each source, so that in future if someone
> changes the source of truth I can guard myself telling that the refrence taken from the source of
> truth was from the state of that source which was at this certain date."*

**The purpose is evidentiary, and it is what makes the date load-bearing:** a version number says
what the source was *called*; the read-date says **when we looked**.

## The tally

| | |
|---|---|
| Cases written | **174 of 174** |
| Cases already fully correct and left alone | **0** |
| Cases that already carried a read-date, but only a partial one | **26** |
| `update_case` ops | **174**, every one HTTP 200 + byte-verified MATCH, 30 fields compared each |
| Live specification version | **Confluence v27** (`version.when` 2026-08-07T15:01:20.801Z) |

**Why "already correct" is 0 and not 26.** Twenty-six cases did carry `read on 11 August 2026` when
this pass started — put there earlier today by the panel-collapse and C30041 passes. **Every one of
those 26 carried it on the specification only**, leaving the epic undated, and in one case Branko's
answers file undated too. Under the amendment's per-source requirement **none of the 174 was
complete**, so all 174 were written. The stamper is idempotent, so those 26 kept the specification
date they already had rather than gaining a second one.

## Read-dates per case, after the pass

| Read-dates on the case | Cases |
|---|---|
| 2 (the epic + one other source) | **154** |
| 3 (the epic + two other sources) | **20** |
| **0** | **0** |

## Which sources got a read-date, and how many cases cite each

| Source | Cases citing it as a source | Stamped by this pass |
|---|---|---|
| epic **SV-8685** | **174** | **174** |
| the **Schedule specification version 27** (anchored citation) | **167** | **141** (the other 26 already had it) |
| the **engineering technical plan** file | **11** | **11** |
| **Branko's answers** file (31 July) | **9** | **9** |
| a **story** as a source (SV-8686) | **7** | **7** |
| a **design** or **Figma** | **0** | **0** |

> **A correction to our own measurement, recorded rather than quietly fixed.** The first draft of
> `SOURCE-CURRENCY.md` said **174 of 174** cases cite the specification. That came from a loose
> substring match and it is **wrong: the true figure is 167.** Seven cases mention the specification
> only to say it does **not** cover the point — the six tech-plan cases (*"No numbered requirement in
> the Schedule specification version 27 covers this point"*) and C43554 (*"The Schedule specification
> version 27 does not say which view the page opens on"*). A negative mention is not a citation, and
> stamping one would have asserted the specification supports an expectation it does not. The table
> above is the corrected figure; `SOURCE-CURRENCY.md` carries the correction inline.

## The exact shape written

Canonical, the dominant form (154 cases):

> This is the expected behaviour as per epic SV-8685, read on 11 August 2026, and the Schedule
> specification version 27 (§4.2), read on 11 August 2026. Last checked against build v3.5-7ec992f on
> 8/6/2026.

Three sources (a panel-collapse case):

> This is the expected behaviour as per epic SV-8685, read on 11 August 2026, its story SV-8686, read
> on 11 August 2026, and the Schedule specification version 27 (§5.3 Panel collapse and §6 Grid
> toolbar), read on 11 August 2026. Last checked against build v3.5-af3a6e1 on 8/11/2026.

A file-based source (a tech-plan case):

> … so the refusal responses above come from the engineering technical plan, in this file: `<link>`,
> read on 11 August 2026.

**Each source carries its own date rather than one date trailing the whole list.** They happen to
share a date here because they were all read in one sitting for this purpose — but a later pass that
re-reads only the specification will move only the specification's date, and a single trailing date
would then misstate the others. The repetition is the cost of that; it is deliberate.

## What was deliberately NOT touched

1. **Sentence 2 — `Last checked against build … on …`.** Byte-identical on all 174. **None was
   added**, because none of these 174 cases has been build-verified against the build now running: the
   11 August verification attempt observed **0 of 174**. Adding one would be a fabricated observation
   (Rule 12).
2. **`refs`.** Not sent on any payload, and proven byte-identical on all 174 afterwards.
3. **Titles, preconditions, steps.** Sent verbatim from the pre-write snapshot so TestRail could not
   re-render them; byte-identical afterwards.
4. **Automation markers.** Untouched — exactly one per case, still last, still one of the three forms.
5. **Rule-56 divergence sentences and expect-fail symptom blocks.** Untouched.
6. **Negative and narrative mentions of a document.** C43554's *"the specification does not say"*, the
   six tech-plan cases' *"no numbered requirement covers this point"*, and the narrative story
   mentions in C30041 / C43555 / C43556 were **all left undated on purpose**. C30041's mention of
   story SV-8686 already dates itself a different way (*"has not been touched since the story was
   created on 27 July 2026"*), and a read-date there would be about a different thing entirely.

## Tooling

`tools/stamp.py` is the transformer, and its docstring carries the reasoning for every skip rule. It
is **idempotent** — proven by re-running it over its own output on all 174 with zero further change —
so a future re-stamp cannot double-stamp. `tools/write.py` is the writer, which stops the batch on the
first byte mismatch. `tools/tr.py` carries the corrected TestRail pagination (see `FINDINGS.md` §4).

## Deliverables NOT regenerated, deliberately

The id-map and the import were **not** regenerated. A later pass will do that once new cases land, and
`gen_import.py` is known to blank the id-map C-ids and drop the `refs` column on every rerun.
