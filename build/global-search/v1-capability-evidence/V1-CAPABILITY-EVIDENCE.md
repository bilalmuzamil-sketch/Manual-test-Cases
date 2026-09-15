# Everything the OLD search could do — and proof of each one you can run yourself

**What this is.** A complete list of every single thing a user could do with the old search box,
with, against each one, **evidence you can execute** rather than a claim you have to trust.

**Baseline:** the ShopView product repository at commit **`55767168`** — the last state of the old
search before the new one replaced it.

**Date:** 15 September 2026.

---

## Why it exists

Until now, every statement we made about the old version — *"a customer could be found by postcode"*,
*"part of a chassis number worked"* — rested on somebody having read the old code and reported
faithfully. That is a reasonable thing to do once. It is not something to build a release argument on,
for three reasons:

1. **It cannot be checked.** If a developer asks *"are you certain the old version did that?"*, the
   answer is a conversation.
2. **It can be wrong.** On 15 September two of six filed tickets turned out to claim more than the old
   version actually did. Both were caught, but only because someone went back and looked again.
3. **It disappears.** The reading lived in one session's head.

So the old search has been **re-created from its own source code and made runnable.** You give it
records, you give it a search term, and it tells you what the old product would have shown.

## How to run it

```bash
cd build/global-search/v1-capability-evidence
python3 prove_all_v1_capabilities.py          # the whole table, pass or fail
python3 prove_all_v1_capabilities.py --md     # the same as markdown
```

Every row that says **runs green** is an assertion that just executed. If someone changes the
re-creation and breaks it, the suite fails and says which capability.

**To settle a new argument**, use the engine directly:

```python
from v1_search import customer, finds
c = customer("Peterson Trucking", city="Fernvale", telephone="(419) 555-0143")
finds("555-0143", [c])     # True  - the old version DID find a customer from part of its number
finds("4195550143", [c])   # False - it did NOT match plain digits
```

## The result

**53 of the 72 capabilities are proved by running code. 0 fail. 19 cannot be simulated** and rest on
their code citation — and they are listed rather than quietly dropped, because a register that hid
them would be claiming more than it can show.

**The 19 are the ones that were never about matching text**: the keyboard shortcut, the icon on each
row, the analytics event, how the panel behaved on a phone, the loading state, the ordering of jobs by
date, and the scoping that the database did rather than the screen. For those, the proof is the line
of code, cited on the row.

### 🔴 The mistake this caught on its very first run

The suite failed one row immediately: *"a job, by its number with the shop number in front."* **The
engine was right and my test was wrong** — I had asserted a fifth written form (`S917611`) that the old
query never produced. The four it actually writes, from `S-17611` at shop `9160`, are `S17611`,
`S916017611`, `S9160-17611` and `9160-17611`.

That is exactly why this exists. Reasoning about the old code produced a wrong claim; running it caught
it in seconds.

### 🔴 The thing most often got wrong about the old search

There were **two matching passes and they behaved differently:**

| | What it compared | Where it looked | Spaces |
|---|---|---|---|
| **Pass 1** | the record's **visible name** | only from the **start** | **kept** |
| **Pass 2** | one long **combined text** of every detail | **anywhere inside** | **removed** |

A vehicle's visible name was `2019 Freightliner Cascadia`, so typing `2019 Freightliner` matched on
**pass 1**, as a prefix. Anyone modelling only pass 2 gets the right answer there **by luck** and the
wrong answer elsewhere. Both passes are implemented.

## What is in the folder

| File | What it is |
|---|---|
| `v1_search.py` | the old search, re-created: all five database queries and the exact two-pass screen filter, each line cited to its source |
| `prove_all_v1_capabilities.py` | one assertion per capability; prints the table below; exits non-zero if any fails |
| `V1-CAPABILITY-EVIDENCE.md` | this document |

---

## The complete register

| # | What a user could do in V1 | Proved? | Where it is established | Test case |
|---|---|---|---|---|
| `job-1` | A job, by its plain number with nothing in front | ✅ runs green | `FetchDataQueryHandler.php:96 wo.raw_number` | C55672 |
| `job-2` | A job, by its number as it is written | ✅ runs green | `FetchDataQueryHandler.php:98-111 wo.number` | C53579 |
| `job-3` | A job, by its number with the shop number in front (four written forms) | ✅ runs green | `FetchDataQueryHandler.php:100-110 four shop-prefixed variants` | C53579 |
| `job-4` | A job, by the name of the customer it is for | ✅ runs green | `FetchDataQueryHandler.php:112 c.name` | C53578 |
| `job-5` | A part sale, by the name of the customer it is for | ✅ runs green | `FetchDataQueryHandler.php:112 - the same query returns part sales` | C55665 |
| `job-6` | A job, by typing its status - and a two-word status typed as one word | ✅ runs green | `FetchDataQueryHandler.php:113-116 wo.status, underscores removed, quality_check becomes qualitycheckqc` | C55658 |
| `cust-1` | A customer, by its company name | ✅ runs green | `FetchDataQueryHandler.php:229 c.name` | C55667 |
| `cust-2` | A customer, by its company name typed with no spaces at all | ✅ runs green | `FetchDataQueryHandler.php:230 the name is written a second time with spaces removed` | C53602 |
| `cust-3` | A customer, by its street address | ✅ runs green | `FetchDataQueryHandler.php:231 c.address_1` | C53582 |
| `cust-4` | A customer, by the second line of its address | ✅ runs green | `FetchDataQueryHandler.php:232 c.address_2` | C53604 |
| `cust-5` | A customer, by its county or state | ✅ runs green | `FetchDataQueryHandler.php:233 c.state_or_province` | C53582 |
| `cust-6` | A customer, by its postcode | ✅ runs green | `FetchDataQueryHandler.php:234 c.postal_code` | C53582 |
| `cust-7` | A customer, by its town | ✅ runs green | `FetchDataQueryHandler.php:235 c.city` | C53582 |
| `cust-8` | A customer, by its own switchboard number (written with dashes) | ✅ runs green | `FetchDataQueryHandler.php:236 c.telephone, brackets stripped and ) turned into -` | C55662 |
| `cust-9` | A customer, by its website | ✅ runs green | `FetchDataQueryHandler.php:237 c.website` | C53583 |
| `cust-10` | A customer, by a contact's first name | ✅ runs green | `FetchDataQueryHandler.php:238-244 cu.first_name` | C55670 |
| `cust-11` | A customer, by a contact's surname | ✅ runs green | `FetchDataQueryHandler.php:238-244 cu.last_name` | C55670 |
| `cust-12` | A customer, by a contact's job title | ✅ runs green | `FetchDataQueryHandler.php:238-244 cu.title` | C53603 |
| `cust-13` | A customer, by a contact's own phone number | ✅ runs green | `FetchDataQueryHandler.php:238-244 cu.telephone` | C55662 · C53603 |
| `vend-1` | A supplier, by its name | ✅ runs green | `FetchDataQueryHandler.php:157 v.name` | C55668 |
| `vend-2` | A supplier, by its street address | ✅ runs green | `FetchDataQueryHandler.php:158 v.address_1` | C53585 |
| `vend-3` | A supplier, by the second line of its address | ✅ runs green | `FetchDataQueryHandler.php:159 v.address_2` | C53604 |
| `vend-4` | A supplier, by its county or state | ✅ runs green | `FetchDataQueryHandler.php:160 v.state_or_province` | C53606 |
| `vend-5` | A supplier, by its postcode | ✅ runs green | `FetchDataQueryHandler.php:161 v.postal_code` | C53585 |
| `vend-6` | A supplier, by its town | ✅ runs green | `FetchDataQueryHandler.php:162 v.city` | C53585 |
| `vend-7` | A supplier, by its phone number | ✅ runs green | `FetchDataQueryHandler.php:163 v.telephone` | C55663 |
| `vend-8` | A supplier, by its email address | ✅ runs green | `FetchDataQueryHandler.php:164 v.email` | C53584 |
| `veh-1` | A vehicle, by the name of the customer who owns it | ✅ runs green | `FetchDataQueryHandler.php:287 c.name` | C53581 |
| `veh-2` | A vehicle, by its year | ✅ runs green | `FetchDataQueryHandler.php:288 v.year` | C53605 |
| `veh-3` | A vehicle, by its make | ✅ runs green | `FetchDataQueryHandler.php:289 vmk.name` | C55664 |
| `veh-4` | A vehicle, by its model | ✅ runs green | `FetchDataQueryHandler.php:290 vm.name` | C55664 |
| `veh-5` | A vehicle, by its unit number | ✅ runs green | `FetchDataQueryHandler.php:291 v.unit` | C53580 |
| `veh-6` | A vehicle, by its chassis number - whole, or any part of it | ✅ runs green | `FetchDataQueryHandler.php:292 v.vin, matched anywhere by useGlobalSearch.ts:84-93` | C55669 |
| `veh-7` | A vehicle, by its number plate | ✅ runs green | `FetchDataQueryHandler.php:293 v.licence_plate` | C53516 |
| `veh-8` | A vehicle, by its year typed together with its make | ✅ runs green | `the visible label is '<year> <make> <model>', FetchDataQueryHandler.php:273-280, matched by useGlobalSearch.ts:76-82` | C53605 |
| `part-1` | A part, by its description | ✅ runs green | `FetchDataQueryHandler.php:326 cp.name` | C53607 |
| `part-2` | A part, by its part number - with the dashes or without them | ✅ runs green | `FetchDataQueryHandler.php:327-328 part_number written twice, once with dashes removed` | C55666 |
| `part-3` | A part the shop has NEVER stocked - the catalogue is the only source | ✅ runs green | `FetchDataQueryHandler.php:330 reads CataloguePart. There is no inventory join anywhere in the query` | C53601 · C45153 |
| `INV-10` | Nothing is matched until you have typed two characters | ✅ runs green | `useGlobalSearch.ts:66-71` | C45161 |
| `INV-11` | Records whose visible name STARTS with what you typed come first | ✅ runs green | `useGlobalSearch.ts:76-82 then :156-180` | C55667 · C55668 · C55686 |
| `INV-12` | What you typed is looked for ANYWHERE inside the record, not just at the start | ✅ runs green | `useGlobalSearch.ts:84-93` | C55659 · C55660 |
| `INV-13` | Capitals never mattered | ✅ runs green | `useGlobalSearch.ts:67, 81, 91` | C55671 |
| `INV-14/15` | Three rows per kind of record, and NO limit on the total | ✅ runs green | `useGlobalSearch.ts:152 MAX_PER_TYPE = 3, with no overall cap` | C55661 |
| `INV-16` | A record that matches in more than one way is still listed only once | ✅ runs green | `useGlobalSearch.ts:182-184` | C45157 |
| `INV-17` | Matching a contact still returns the company they work for | ✅ runs green | `useGlobalSearch.ts:186-190` | C55670 |
| `INV-20` | Vehicles are shown to people under the heading 'Assets' | ✅ runs green | `useGlobalSearch.ts:100-137` | C45155 |
| `INV-44/63` | A search that matches nothing brings the recently-viewed list back | ✅ runs green | `useGlobalSearch.ts:229-231` | C55675 · C55679 |
| `INV-71` | A Time Clock user gets no search results at all | ✅ runs green | `useGlobalSearch.ts:140-150` | C45147 |
| `INV-72` | Each kind of result appears only for users allowed that area | ✅ runs green | `useGlobalSearch.ts:140-150` | C45142 · C45144 · C45145 · C45146 |
| `INV-73` | Parts appear only for users with the catalogue and inventory area | ✅ runs green | `useGlobalSearch.ts:140-150` | C45143 |
| `INV-74` | A kind of result nobody recognised was hidden, not shown by accident | ✅ runs green | `useGlobalSearch.ts:140-150` | C45148 |
| `INV-95` | ONLY records containing what you typed came back - never a different spelling | ✅ runs green | `useGlobalSearch.ts:76-93 - literal comparison, no allowance for near spellings` | C55685 |
| `INV-96` | The record you actually typed was never pushed below a looser match | ✅ runs green | `useGlobalSearch.ts:156-180 - pass one is appended before pass two` | C55686 |
| `INV-18` | Newer jobs were listed above older ones | — code citation only | `FetchDataQueryHandler.php ORDER BY wo.start_date DESC` | C53588 |
| `INV-33` | A record you had just created was findable straight away | — code citation only | `useGlobalSearch.ts:305-312 invalidateSearchData, called from 5 places incl. WorkOrders.vue:1914` | C53586 · C53587 |
| `INV-34` | A user with no default branch did not break search | — code citation only | `the workplace decorator in the query` | C45159 |
| `INV-40` | The keyboard shortcut opened search | — code citation only | `GlobalSearch.vue:128-131` | C45156 |
| `INV-41` | The first result was highlighted, and Enter opened it | — code citation only | `GlobalSearch.vue:157-190` | C55673 |
| `INV-42` | Group headings could not be selected with the arrow keys | — code citation only | `GlobalSearch.vue:157-159` | C55680 |
| `INV-43` | A loading state showed while results were not ready yet | — code citation only | `GlobalSearch.vue` | C53589 |
| `INV-46` | Choosing a result opened the right record | — code citation only | `routingService.ts:75` | C45153 |
| `INV-47` | Choosing the record you were already on did not reload the page | — code citation only | `GlobalSearch.vue` | C45154 |
| `INV-48` | Choosing a result recorded a usage event | — code citation only | `GlobalSearch.vue` | C45160 |
| `INV-50` | Search was reachable on a phone and a tablet as well as a desktop | — code citation only | `GlobalSearch.vue` | C55674 |
| `INV-64` | Recent items the user could no longer open were hidden | — code citation only | `useGlobalSearch.ts permittedHistory` | C45149 |
| `INV-80` | No search ever returned another organisation's records | — code citation only | `FetchDataQueryHandler.php organizationDecorator on all five queries` | C45150 |
| `INV-81` | Only jobs and part sales were limited to your branch; the rest were company-wide | — code citation only | `FetchDataQueryHandler.php workplaceDecorator on the job query only` | C45151 |
| `INV-82` | Switching branch refreshed the results | — code citation only | `useGlobalSearch.ts:286-299` | C45152 · C55684 |
| `INV-90` | No setting or flag had to be switched on to get search | — code citation only | `no flag exists in the code` | C45158 |
| `INV-92` | Every result row carried an icon saying what kind of record it was | — code citation only | `GlobalSearch.vue:60-62 with useGlobalSearch.ts:96-137` | C55682 |
| `INV-93` | The keyboard shortcut was written on the search box, correct for Mac or Windows | — code citation only | `GlobalSearch.vue:40-47, 128-131` | C55683 |
| `INV-94` | The old branch's rows were cleared before the new ones arrived | — code citation only | `useGlobalSearch.ts:286-299` | C55684 |

72 capabilities  ·  53 proved by running  ·  0 failed  ·  19 not simulatable (code citation only)
Baseline: ShopView product repository @ commit 55767168

---

## A note on the count

The planning register lists **73** capabilities; this one lists **72** rows. Nothing was dropped —
three pairs that were only ever tested together are stated as one row each (the three-per-type limit
with the absence of an overall cap; the recent list returning both under two characters and on a
no-match), one row was a summary of the exclusion list that is fully covered by the four permission
rows below it, and one row was added that the planning register did not have on its own — the year
typed together with the make, which is what [SV-10055](https://shopview.atlassian.net/browse/SV-10055)
turns on.

## What this does NOT do

🔴 **It is not the standard for the new version, and it is not a test suite for the product.** It
proves only one thing: *what the old product did.* Whether the new version should do the same is the
question our test cases ask and the Product Owner answers.

🔴 **It does not invent data.** It tells you what the old search would have returned **for the records
you give it**. If a search finds nothing on the live build, the first question is still whether the
record carries the value at all.

🔴 **It is pinned to one commit.** If the old version's code is ever revisited, the citations move and
this needs re-deriving. The commit is stated on every run so a stale copy is obvious.
