# Is SV-10277 real? — user-visible proof, 20 September 2026

The QA lead asked whether SV-10277 is a real issue. Everything I had recorded until now proved the
**scores** were flattened; it did not prove a user would ever **see** a wrong order. That gap was fair,
and this closes it.

Build **v26.36.8-d146c39** (unchanged — nothing has been rolled back). Probe: `isitreal.mjs`.
All examples are **ordinary production-shaped records** — none of my seeded ZZ data.

## A · An out-of-stock part appears ABOVE one that is in stock

30 everyday part searches examined; **5 return a wrong order**:

| You type | What sits higher | What sits lower |
|---|---|---|
| `tire` | **row 1** `TIREMAAX PRO HUB` — **0 Available** | row 2 `Wheel Stud` — 20 Available |
| `door` | row 4 `Door Hold Back, 3", Aluminium, Pair` — **0 Available** | row 6 `SEAL DOOR SEALOK .500"` — 24 Available |
| `bearing` | row 10 `Bearing Buddy® Chrome Bearing Protectors` — **0 Available** | row 11 `WHEEL BEARING CUP` — 3 Available |
| `belt` | row 12 `Belt Tensioner Idler Pulley, HDEP` — **0 Available** | row 15 `GM 4.3L FAN BELT` — 1 Available |
| `valve` | row 16 `VALVE CORE, M8` — **0 Available** | row 17 `Spring Loaded Air Tank Drain Valve` — 10 Available |

`tire` is the one to show anyone: **the very first result is a part the shop does not have.**

§6.1 Parts: *"In stock (>0) → +0.20"*.

## B · A name that merely CONTAINS the word appears ABOVE one that STARTS with it

33 company and vendor lists examined; **6 return a wrong order**:

| You type | What sits higher (word inside the name) | What sits lower (name starts with the word) |
|---|---|---|
| `diesel` | **row 1** `Stillwater Diesel Repair` | **row 5** `Diesel Diesel & Fleet Repair` |
| `fleet` | **row 1** `Continental Fleet Services` | **row 8** `Fleetwise Truck Repair LLC` |
| `service` | **row 1** `Monroe Truck Service & Repair` | row 3 `Continental Fleet Services` |
| `service` (vendors) | row 4 `Barfuss' Fleet Service` | row 6 `Sylvest Mechanical Services` |
| `mobile` | row 6 `Henderson Mobile Truck Repair` | row 9 `Mobile Truck & Trailer Repair Muscatine` |
| `mobile` (vendors) | row 19 `Urbana Mobile Truck Repair` | row 20 `Mobile Truck & Trailer Repair Oak Hill` |

§6.1: *"Prefix match on primary name field → +0.70"* and *"Whole-word match anywhere in indexed fields
→ +0.50"* — a gap of 0.20 that should always put the first kind above the second. Both now sit on
1.00, so the gap cannot apply.

## What this does and does not prove

**Proved:** on this build the documented ordering rules are not honoured, and the wrong record reaches
the top of an ordinary search that a shop would type. This is user-visible, not theoretical.

**Not proved:** that these same searches were correct *before* the SV-10161 change. The pre-fix build
is gone and no capture of it exists, so the link to that change rests on the arithmetic (a name match
now reaches the 1.00 ceiling on its own, absorbing every credit added afterwards) rather than on a
before-and-after measurement. Stated plainly rather than implied (Rule 12).

## Nothing has been rolled back
Build marker re-read: **v26.36.8-d146c39**, the same as this morning. Every number in SV-10277
re-measured identical: name credit still the enlarged one (1.00 vs 0.50 on the clean pair) ·
starts-with and contains both 1.00 · `shoe` returns 20 parts all at 1.00 · `truck repair` returns
customers and vendors flat at 1.00 · and `deshawn` still returns the right company first, so SV-10161
itself remains fixed.
