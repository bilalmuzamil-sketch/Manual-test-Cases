# Re-run of 21 September 2026 — unattended pass

**Authorised by the QA lead 21 Sep:** run everything **except** sections 6767, 6769, 6774, 8056;
results go into **run 415** as new results with the tests marked accordingly; requirements re-read
first (done — PRD v17, unchanged); *"Continue unattended as I am going to sleep now"*; *"You are
authorized to CRUD the QA branch in order to keep yourself unblocked."*

**Scope** 129 checks · 17 folders · build `v26.36.8-d146c39` · source PRD 576978945 **v17** read
live 21 Sep · yardstick **GENERAL** (written requirements only).

**Standing holds that do NOT lift while he sleeps:** no Jira issue of any kind (62/113 — a failure is
recorded with `ticket_held` and listed for him) · no Expected edited, ever (114) · Vladimir's cases
(38) and Automated cases (71) — neither is in scope this pass.

## Folder progress

| # | Folder | Checks | State |
|---|---|---|---|
| 1 | Ranking and Prioritization | 23 | **DONE** — 19 passed · 1 failed (C55716, ticket held) · 3 blocked (C45137, C45138, C55709) |
| 2 | Per-Entity Result Shape | 9 | **DONE** — 7 passed · 2 failed (both already ticketed) |
| 3 | Grouped Results and Counts | 9 | **DONE** — 6 passed · 2 failed (C44825 already ticketed, C53476 ticket held) · 1 blocked (C44826) |
| 4 | Scope Tabs | 12 | **DONE** — 12 passed |
| 5 | Fuzzy Matching | 18 | **DONE** — 18 passed |
| 6 | Permissions and Role-Based Scoping | 23 | to do |
| 7 | Palette Open, Close and Keyboard | 10 | **DONE** — 10 passed |
| 8 | Recent Activity Default State | 5 | to do |
| 9 | Mobile Global Search (v2) | 6 | IN PROGRESS |
| 10 | Persisting Query | 3 | **DONE** — 2 passed · 1 failed (C44861, ticket held) |
| 11 | Empty and First-Time State | 2 | **DONE** — 2 passed |
| 12 | No-Results State | 2 | **DONE** — 1 passed · 1 failed (C44865, already ticketed) |
| 13 | Page-Search Cutover (v2) | 2 | to do |
| 14 | In-Page Work Orders List Search | 2 | to do |
| 15 | Purchase Orders Entity (v2) | 1 | **DONE** — passed |
| 16 | Vendor Invoices Entity (v2) | 1 | **DONE** — passed |
| 17 | Error State | 1 | **DONE** — passed |

## Fixtures present on the branch (enumerated live 21 Sep)

customers ZZACC · ZZAUTOTEST(21) · ZZCAP161 · ZZCUSTOPEN(3) · ZZMATRIX/ZZMATROX · ZZOPENCOUNT(4) ·
ZZPHON(4) · ZZPINRIVAL(2) · ZZPREFIX(2)/ZZPREFIY · ZZPSRANK(3) · ZZPUNC(3) · ZZTALLYQ(4) ·
ZZTIEBREAK(3) · ZZTOGCUST/ZZTOGPS/ZZTOGWO · ZZVORTAC(3)
parts ZZAUTOTEST(10) · ZZBROAD(15) · ZZCATBIN/ZZCATLIFT/ZZCATMOVE/ZZCATROLL · ZZPARTBUSY(3) ·
ZZPHON(3) · ZZPRXQ(2) · ZZSORTX(2) · ZZSTOCKPART(2) · ZZTABP(2) · ZZTABQ(3) · ZZTOGPART ·
ZZTOGPRICE · ZZTOGVEN · ZZVORTAC(2)
vendors ZZAUTOTEST(6) · ZZMAGENTA(2)/ZZMAGENTO · ZZTOGVEN(2) · ZZVENDORPO(4) · ZZVORTAC(4)
assets ZZOBSIDIAN(4)/ZZOBSIDIAM(2) · vendor invoices ZZTOGV(2)

## Method for every check this pass

Skill 19 + skill 20: observed **on the screen** through the control a person uses · ordering claims
take **two alternating rounds** · a fixture must be **discriminating** · a **positive control** before
any negative · build marker recorded · *"what would make this my fault?"* answered. Nothing is judged
from a value read behind the screen.


## Instrument note, 21 Sep

**A one-letter query is below the product's two-character minimum and returns the RECENT list, not results.**
An earlier sweep that used `a` as a broad query was therefore reading recent items and reporting them as
result rows. Caught by reading the panel's own text (`Recent searches / TODAY`). Every broad query in this
pass uses two characters or more.

**Second instrument note:** cutting a request off inside the browser (`route.abort`) is NOT a server failure — the panel simply closes, which reads as a crash. Make the server answer **500** instead, and the product shows its Search unavailable / Retry banner correctly.

**A reported fault is FIXED:** SV-10178 (asset rows joining the unit number to the year with no separator) does not reproduce — the row now reads `TRK 412 · 2019 Freightliner Cascadia`, matching the work-order row. Checked against the ticket's own steps. The ticket is still *In Progress*, so the QA lead may want to move it.
