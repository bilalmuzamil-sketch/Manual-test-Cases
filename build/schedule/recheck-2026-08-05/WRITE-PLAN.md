# Schedule — the single staged write, waiting on build access

**Nothing was written to TestRail on 5 August.** This file is what is queued, so that when cookies
arrive it goes out as **one** write per case rather than several.

## Why one write, not several

The instruction for this pass is explicit: *"Where a case is touched for more than one reason, apply
all intents to ONE final text and write it ONCE."* Three separate intents are pending on overlapping
sets of cases:

| Intent | Cases | Needs the build? |
|---|---|---|
| A — re-stamp the provenance line to `v3.5-be42149` + the date observed (Rule 54) | **all 165** | **yes** — the date must be a date we actually observed |
| B — add the automation marker (Rule 55 placement) | **all 165** | **yes** — the state depends on the re-checked verdict |
| C — repair raw `<ol>`/`<li>` markup shown to the tester | **16** | no |
| D — replace two now-false "has no developer ticket yet" sentences | **2** | no |

C and D could have gone out today. They were **held deliberately**, because sending them would mean
writing those 18 cases twice, and — worse — it would refresh their `updated_on` while leaving a
provenance line naming a build that no longer exists. A case that **looks** freshly updated while
pointing at a dead build is harder to spot as stale than one that is plainly old. That is the trap
Standing Rule 41 exists to prevent.

## A — provenance re-stamp, 165 cases

Every case currently ends:

```
This is the expected behaviour as per the build tested on 8/4/2026 (v3.5-4873abe), and as per epic
SV-8685 and the Schedule specification version 23 (§<anchor>).
```

Read live from all 165: **165 name `v3.5-4873abe`, 165 name `8/4/2026`, each exactly once, none
doubled.** The stamper replaces the line, never appends.

The new line keeps **specification version 23** (the live Confluence version is still 23, proven by
content diff, not by the version number) and changes only the build and the date — **to the date the
row was actually re-observed**, per row, not a blanket date.

## B — automation markers, 165 cases

**Currently 0 of 165 carry an `AUTOMATION:` line.** Schedule never got the marker pass; it was halted
on 5 August because the build had moved.

Placement, exactly: **after** the provenance line, with a **blank line before** it and a line break
after. Three states only, and the greppable prefix `AUTOMATION: ` stays exact.

Expected distribution once the verdicts are re-checked, from the 4 August outcomes:

| State | Cases | Basis |
|---|---|---|
| `AUTOMATION: READY` | 138 | the 138 that passed |
| `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` | 19 | the product-is-wrong cases, **each naming its own ticket key** |
| `AUTOMATION: HOLD - waiting on the product owner's answer` | 2 | SCH-EDGE-05 = C30089, SCH-SPREAD-07 = C29983 |
| `AUTOMATION: HOLD - <the specific thing needed>` | 2 | SCH-EDGE-07 = C38865, SCH-START-02 = C29970 |
| `AUTOMATION: HOLD - the feature is not built yet` | 4 | SCH-API-02 = C38873, SCH-DND-08 = C29962, SCH-EVT-02 = C30017, SCH-SPREAD-11 = C38863 |

**Arithmetic gate: 138 + 19 = 157**, which must equal the ready-to-automate figure in the rebuilt
readiness report. **This distribution is the 4 August one and will shift** if a re-checked row changes
— in particular if any of the four not-built features shipped in this deploy, or if the two
contradicted PASS verdicts (C29939, C29944) turn out to be deviations. **The gate is checked against
the re-checked numbers, not against these.**

**Two of the 19 need a ticket key they did not have on 4 August:**

| Case | C-id | Marker to use |
|---|---|---|
| SCH-MODAL-03 | C30010 | `AUTOMATION: READY - EXPECT FAIL (SV-8834)` |
| SCH-TOOL-03 | C30041 | `AUTOMATION: READY - EXPECT FAIL (SV-8874)` |

**Two of the 19 still have no ticket, deliberately** — SCH-EDGE-02 = C30086 and SCH-TIP-01 = C30034.
Their markers must not name a ticket they do not have; they read
`AUTOMATION: READY - EXPECT FAIL (no ticket - accepted, see the decisions register)`.

**A tool flag never makes a case HOLD.** Reading a colour, a size or a network request, forcing a
viewport, flipping the app's own dark-mode switch, or seeding a busy schedule are all things a script
does for itself. Only a real physical device or an unobtainable external account justifies HOLD, and
**no Schedule case needs one**.

## C — the 16 raw-markup repairs

All 16 are named with C-ids in `FINDINGS.md` finding 7. **Formatting only — not one word of meaning
changes.** Literal `<ol>` and `<li>` tags in preconditions, steps and expected results become the
numbered-line format the rest of the suite uses. It predates this work; it is not a regression.

## D — two sentences that are now false

| Case | C-id | Current text | Must become |
|---|---|---|---|
| SCH-MODAL-03 | [C30010](https://shopview.testrail.io/index.php?/cases/view/30010) | *"It has been reported to the QA lead but has no developer ticket yet. ... do not raise a new ticket without asking the QA lead."* | names **SV-8834** with its link, and tells the tester to mark it failed and reference that ticket |
| SCH-TOOL-03 | [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) | records the deviation with no ticket | names **SV-8874** with its link |

Leaving these is not cosmetic: a tester reading C30010 today is told a real fault is unreported and is
told not to raise it, when it **has** been reported by another QA and accepted into the backlog.

## E — corrections owed to our own verdicts, pending observation

Not writes yet — they are **verdict changes** that need the build first (`FINDINGS.md` finding 4):

| Case | C-id | What to drive | Likely outcome |
|---|---|---|---|
| SCH-SEARCH | [C29939](https://shopview.testrail.io/index.php?/cases/view/29939) | type the technician's **full** name exactly as the row shows it, then a partial | our PASS becomes a **deviation** and the case points at SV-8873 |
| SCH-FILT | [C29944](https://shopview.testrail.io/index.php?/cases/view/29944) | **every** status the chip offers, not just Approved | our PASS becomes a **deviation** and the case points at SV-8868 |

## F — not in this write, needs the QA lead first

- **Three candidate new cases** for the gaps at SV-8863 (which view the module opens on), SV-8870
  (drag-create in Month view) and SV-8867 (reassigning a series member). **Not authored** — new cases
  need authorisation.
- **The API-only ask** for SCH-API-02 = C38873 stays unfiled (Standing Rule 51).
- **Whether run 357 should be reset** — it holds 429 records, all Untested. Untouched, and proven so.

## Guardrails for the write, when it happens

- `update_case` only. **0** add, **0** delete, **0** section, **0** run writes.
- Full pre-write snapshot committed first; post-write snapshot after.
- Every write re-GET and byte-compared against the intended payload, **all 30 fields**, with every
  field not meant to change proven byte-identical to its pre-write snapshot. No sampling.
- `refs` verified under `','.join(p.strip() for p in s.split(','))`, declared in the log; no single
  comma-free entry over 248 characters.
- On any mismatch the write **failed**: stop the batch, report both byte sequences, do not retry blindly.
- Run 357 snapshotted before and after; case_id sets equal both ways; all 429 results present by ID.
