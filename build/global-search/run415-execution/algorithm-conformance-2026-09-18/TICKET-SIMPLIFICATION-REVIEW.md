# SV-10238 — review of the simplified rewrite, and what was restored (18 September 2026)

The QA lead rewrote the ticket through ChatGPT, liked the shape, and asked two things: whether the
simplification had cost it its meaning, and to put the inline pictures back.

## The pictures — what was wrong and what fixed it

The rewrite replaced the three image references with **editor session links**:

```
!blob:https://media.staging.atl-paas.net/?type=file&localId=null&id=c044113a-…|thumbnail!
```

A `blob:` URL is a handle that exists only inside the browser tab that uploaded the file. Saved into
the description it points at nothing, so every picture rendered broken. The three attachments were
never lost — they are still on the issue as `PIC1-vehicle.png` (id 61084), `PIC2-workorder.png`
(61085) and `PIC3-part.png` (134 KB, 61086).

Fixed by naming the attachments, with the true aspect stated so Jira does not squash them:

```
!PIC1-vehicle.png|width=760,height=543!
!PIC2-workorder.png|width=760,height=543!
!PIC3-part.png|width=760,height=651!
```

Each now sits **immediately under the example it belongs to** — the vehicle picture after Example 1,
the work order after Example 2, the part after Example 3 — verified from the rendered description.

## What the simplification got RIGHT, and is kept

* Three named examples with their own sub-headings, instead of one long numbered run.
* The summary table of individual-versus-combined searches.
* A shorter, cooler title.
* Shorter sentences throughout.

## What it lost, and is now restored

| Lost | Why it matters | Restored as |
|---|---|---|
| *"A record cannot be found by the words the product itself prints for it"* | the one sentence that makes the problem obvious to a non-technical reader | second paragraph of the Description |
| The user impact — people type what they read off the truck; nothing warns them; more precision makes it worse | this is what gets a ticket prioritised rather than parked | a *Why it matters* paragraph |
| The **control** — two words of ONE field work | without it a reader can conclude "multi-word search is broken", which is wrong and sends the fix in the wrong direction | its own short block, using `ZZMATRIX Alpha` |
| The **verbatim source** with page id, version and read date | our standard, and it is what stops an argument about what the requirement says | Sources, quoted as before |
| The honest note that §7 does **not** state how words across two fields combine | leaving it out lets a developer answer "the spec doesn't require it"; including it keeps us straight | last paragraph of Sources |
| House order — Environment second to last, Sources last | the agreed layout | restored |

## An error of MINE that the rewrite happened to remove — now corrected properly

My original said: *"words that live in the same field do work — `Freightliner Cascadia` (make and
model) returns twenty vehicles."* **Make and model are two different indexed fields**, so that
example contradicted the very claim it was supporting.

Measured again: `Freightliner Cascadia` does return twenty vehicles, but the engine reports the match
as a **near-spelling match on the `make` field alone, scoring 0.65** — the phrase was compared
against one field and scraped over the fuzzy bar. The two fields still never combine.

The ticket now uses a genuine same-field control (`ZZMATRIX Alpha` → one customer, matched on `name`,
0.90) and adds a warning that the make-and-model case looks like a counter-example and is not one.

## Two claims the rewrite introduced, verified before keeping them

The table said the Work Order is returned by `Fibridge` alone and the Part by `Brake Shoe` alone.
Neither had been measured. Both were checked on build `v26.36.7-069b8c2`: `Fibridge` returns twenty
work orders including `S9160-17671`, and `Brake Shoe` returns twenty parts including
`ZZAUTOTEST Fibridge Brake Shoe Kit`. Both claims hold and stay.
