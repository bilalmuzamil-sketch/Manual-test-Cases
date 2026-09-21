# SV-10188 — the developer is right, and the ticket should be closed

**Date** 21 September 2026 · **Branch** `sv9160` · **Build marker read live: `v26.36.8-d146c39`**
— **the same build the 20 and 21 September readings were taken on. No deployment happened in
between, so the product did not change. My measurement was wrong.**

Ticket: https://shopview.atlassian.net/browse/SV-10188 (status **REJECTED FROM TESTING**, parent
`SV-9165`, which is **TESTING QA**). Developer comment **76921**, Sinisa Nogic, 21 September 2026:

> That part that is last on the list should be there. There are 0 of them available, and it does not
> get a +0.2 bonus for that. You cannot take scores selectively. You have to calculate all of them.

---

## 1 · What I got wrong, and why

My earlier evidence for "standing on the work order makes no difference to the order at all" was
produced by calling the search endpoint **directly from a script**:

```js
const off = await get('/api/search?q=' + encodeURIComponent(word));   // from a neutral page
const on  = await get('/api/search?q=' + encodeURIComponent(word));   // from the work order page
```

Both calls send **nothing but the query**. §8 of the PRD says the front end must
*"query the backend search endpoint with the current query, scope, **and page context**"* — the
page context is added **by the search box**, not by the URL. A raw call therefore **cannot** carry
it, and the two lists were always going to be identical. That identity was an artefact of my
instrument, not a fact about the product.

**This is Rule 104 exactly — I did not prove the instrument could observe the thing I was calling
absent.** The positive control that would have caught it (does the order EVER change with the page?)
was never run.

## 2 · What the screen actually does — measured through the search box

Query `ZZAUTOTEST Fibridge`, Parts tab, read off the rendered rows. Two full passes, alternating
pages, both passes agreeing with each other:

| Standing on | 1st | 2nd | 3rd |
|---|---|---|---|
| Customers page (unrelated) | **Brake Shoe Kit** (40 available) | Wheel Seal (2) | Air Dryer Cartridge (0) |
| Work order `S9160-17671` | Wheel Seal (2) | **Brake Shoe Kit** (40) | Air Dryer Cartridge (0) |
| Customers page again | **Brake Shoe Kit** | Wheel Seal | Air Dryer Cartridge |
| Work order again | Wheel Seal | **Brake Shoe Kit** | Air Dryer Cartridge |

`Off the work order, both passes agree: true` · `On the work order, both passes agree: true` ·
`THE ORDER CHANGES WITH WHERE YOU STAND: true`

**Precondition read back off the screen** (work order → Parts tab, `Parts (3)`): exactly one row
carries a description — **`ZZAUTOTEST Fibridge Brake Shoe Kit`**, requested Sep 17 2026, status
`In Stock`. The other two rows are empty `Auth To Order` lines. So exactly one of the three search
results is on the work order — and that is the one, and the only one, that moves down when you
search from it.

**Instrument check (Rule 104 positive control):** the broad query returns 3 rows, the narrower
`ZZAUTOTEST Fibridge Wheel` returns 2. The panel is reading real, query-sensitive data.

## 3 · Against the source

`build/global-search/source-verify-2026-09-17/spec-576978945-v17-2026-09-17.txt`, §6.3, read
21 September 2026:

> If the user is currently on a Customer page, all candidate Assets and Work Orders owned by that
> customer get a +0.20 boost; if on a Work Order, parts already on that WO are demoted by −0.10
> (the user is usually looking for something they don't have yet) while other parts in the same
> category as the WO's existing parts get +0.05.

§6.1, Parts: *in stock (>0) → +0.20*. The Air Dryer Cartridge has **0 available**, so it does not
earn that, and last is where it belongs — which is Sinisa's point, and it is correct.

**Verdict: §6.3 is working — both the demotion and the same-category lift (§4 below).
SV-10188's stated defect does not reproduce. The ticket should be closed / marked obsolete.**

## 4 · The second half of §6.3 — also proved working, on the fourth fixture

*"other parts in the same category as the WO's existing parts get +0.05."*

Three fixtures failed to isolate it, each for the same reason: the same-category part already sat
first **on the neutral page**, so a lift had nowhere to show.

| Fixture | same-category part | created | neutral page | work order | discriminating? |
|---|---|---|---|---|---|
| `ZZCATLIFT` | Hose Clamp | 1st | Clamp, Clips | Clamp, Clips | no — already top |
| `ZZCATMOVE` | Hose Zulu | 2nd | Zulu, Alfa | Zulu, Alfa | no — already top |
| `ZZCATROLL` | Hose Zulu | 1st | Zulu, Alfa | Zulu, Alfa | no — already top |
| **`ZZCATBIN`** | **Hose Sierra** | 1st | **Tango, Sierra** | **Sierra, Tango** | **YES** |

`ZZCATBIN` is the pair that landed the same-category part **second** on the neutral page, so the
lift had somewhere to go — and it went there. Two full passes, alternating pages:

| Standing on | 1st | 2nd |
|---|---|---|
| Customers page | Hose Tango (`HD-Fasteners`, a different category) | Hose Sierra (`Uncategorized`) |
| Work order `S9160-17671` | **Hose Sierra** — shares the category of the part already on the order | Hose Tango |
| Customers page again | Hose Tango | Hose Sierra |
| Work order again | **Hose Sierra** | Hose Tango |

`off agrees across passes: true` · `on agrees across passes: true` ·
`the same-category part leads ONLY on the work order: true`

Both parts are identical in every §6.1 signal — 0 available, the same bin, never sold, never
viewed, one shared query token, names of equal length — and differ **only** in category. The only
rule in the specification that can reorder them by where the searcher is standing is §6.3.
(The intended extra handicap, stripping the bin off one part, was refused by the product — the
change call wants `catalog_part_id` and `purchase_price` — and turned out to be unnecessary.)

**⇒ BOTH halves of §6.3 work. C44854 passes in full.**

## 5 · Evidence in this folder

`off-wo.png` · `on-wo.png` · `wo-lines.png` · `wo-parts-tab.png` · probes `/tmp/gs/sv10188ctx2.mjs`,
`/tmp/gs/sv10188confirm.mjs`, `/tmp/gs/woparts.mjs`, `/tmp/gs/catlift.mjs`, `/tmp/gs/catmove.mjs`, `/tmp/gs/catroll.mjs`,
`/tmp/gs/catnobin.mjs`, `/tmp/gs/catbin2.mjs`; pictures `cat-off.png`, `cat-on.png`.
