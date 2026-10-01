# SEED THE TEST DATA `<feature> <env>` — build the data the cases need, and keep a one-command rebuild

> **Call it:** `SEED THE TEST DATA for Invoicing on STAGING` (or `QA`, or `LIVE`)
> Day-to-day rebuild keyword is unchanged: `RESEED <FEATURE> <ENV>`
>
> 🔴 **I never ask before seeding.** If a case needs data the environment does not hold, I create
> it and tell you afterwards, with the proof (Rule 114.6, your instruction: *"Please do never ask
> before seeding."*). The gate below is about ACCESS, not permission.

---

## THE GATE — what I ask you for

| What I need | Why | Note |
|---|---|---|
| **A login for that environment** | There is no way to create data without one | 🔴 **A DEDICATED account, not yours.** A fresh login expires that user's previous session — using your account kills the browser you are working in, mid-run. It happened three times. |
| **Which workplace / shop** to seed into | Seeding the wrong shop is silent and wrong | e.g. "Trucks Hill 2" |
| **Confirmation the environment is disposable** | Once, for the project | You have given this for staging, QA and the production test org |

Credentials go to `/tmp/<env>/`, `chmod 600`, **never committed** (Rule 82, public repo). With a
credential file present the run **re-mints its own session** when one expires and carries on.

---

## THE FIVE REQUIREMENTS — it is not done until all five are true

1. **ONE COMMAND** rebuilds everything, per environment.
2. **ONE KEYWORD** you can say — `RESEED <FEATURE> <ENV>` — naming the only thing you must supply.
3. **A READ-ONLY STATUS BOARD** that says what actually survived. A redeploy does not always take
   everything: one took 32 of 33 records, another took none. Rebuilding blind wastes the time the
   kit saves.
4. **RESUMABLE** from a step number, because a session expires and a branch redeploys mid-run.
5. **EVERY STEP PROVED THROUGH THE FEATURE'S OWN INTERFACE.** *"The record exists"* is not *"the
   feature can find it"* — a catalogue part with no inventory row sits happily in the database and
   is invisible to search.

> Its test: **if the environment were wiped in the next ten minutes, could you say one thing, hand
> over one set of credentials, and have every suite working again?**

---

## THE STEPS

1. **Read the CASES, not a summary of them**, and extract what the tester will literally type.
2. **Measure before creating.** Find out what the environment already has; create only the difference.
3. **Write the design rule first** — e.g. *"the keyword lives in exactly one field of each record,
   and never in the name"* — so the data can prove attribution.
4. **Pick a keyword that cannot collide.** Measure it at zero first. `ZZTWIN` was rejected because
   it already drew 2 fuzzy hits; `ZZSTATE` drew 24.
5. **Write the manifest** with `serves` (which cases need this record) and `_why` for every entry.
6. **Seed, then VERIFY as a separate step**, through the feature's interface.
7. **Run it three times.** Idempotence is a claim until you have.
8. **Reconcile server-assigned identifiers** — read back the real numbers (Rule 111).
9. **Write the traps down** beside the code that hit them.

Scaffold a new kit rather than writing one:
```bash
python3 build/testing-tools/seeding/scaffold_seeding.py <slug> "<Feature Name>"
```
The engine is generic; **only the manifest is per-feature**, so the second feature costs a fraction
of the first.

---

## THE TRAPS — all of these are feature-independent, all of them bit us

| Trap | How it shows up | Fix |
|---|---|---|
| 🔴 **One pass leaves gaps, silently** | 7 records "needing action", 4 cases with no data — and a cheerful summary | **Always a SECOND PASS.** A record whose creation is deferred takes its children with it. Fixed three universes on production. |
| **A finder keyed on a non-unique field** | The second record "finds" the first, reports present, is never created. The count reads 35/35 and is wrong | Key the finder on something that genuinely differs |
| **Per-environment state in one shared file** | A production run overwrites the QA branch's ids; four records read MISSING while sitting there | Key ids, state AND terms by environment |
| **Borrowing a value from a named donor record** | `tax_id` resolution dies on an environment that has no "Carolina Truck & Trailer Repair" | Fall back to ANY record carrying the value |
| **A status that cannot walk back** | Approved → Estimate is refused; the spread runs dry and a case sees 6 of 7 badge colours | Over-provision statuses that have no repair move |
| **Slow indexing read as a loss** | "Created but genuinely not returned" | Wait and re-ask. One part took ~20 minutes while its twin was instant |
| **A kit covering six of seven universes** | Reports success while leaving a suite dead | Wire a new universe into the rebuild, the board and the register **the same day** |

---

## DONE WHEN
The status board reads PRESENT for every universe, the verifier passes through the feature's own
interface, the one-command rebuild has been run end-to-end at least once, and the state files are
committed — git is the only durable store; the container is not.

**Canonical:** `build/skills/20-FEATURE-DATA-SEEDING.md` · schema at
`build/testing-tools/seeding/MANIFEST-SCHEMA.md` · reference implementation
`build/global-search/seeding/` · fast card `build/global-search/RESEED-FAST-CARD.md`.
**Rules:** 114, 114.6, 111, 112, 115, 82, 29.
