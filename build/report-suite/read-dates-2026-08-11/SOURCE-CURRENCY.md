# Report Suite — SOURCE CURRENCY, 2026-08-11 (Standing Rules 31 + 59)

Every source cited by any of the 476 cases was read **live in this pass**. Nothing below is
carried forward from a previous pass's record, because the whole point of a read-date is that
somebody actually looked (Rule 54 as amended 2026-08-11).

**Rule 59 — the sources were read TWICE**: once at pass start, and again immediately before the
first write.

| | |
|---|---|
| Pass-start read | **2026-08-11 18:27:54Z** |
| Write-start re-read | **2026-08-11 18:39:41Z** |
| Verdict of the second read | **all six specifications UNCHANGED** — same version integer on every page |
| First write | 2026-08-11 18:40Z · last write 2026-08-11 ~18:52Z |

---

## 1 · The six specifications — each has its OWN page and its OWN version

There is no such thing as "the Report Suite spec version". Six pages move independently, and a
case that cites three of them (C43550 does) needs three separate version pins.

| Report | Confluence page | Live version | Last edited | Editor / message | Verdict |
|---|---|---|---|---|---|
| Sales By Customer | `577634305` | **17** | 2026-08-10T17:22:42Z | Chris Ward — *"SV-9074: Product Type filter to multi-select toggles"* | **CURRENT** |
| Sales By Representative | `585629698` | **18** | 2026-08-07T03:43:08Z | Chris Ward — *"Section 3 tidy-ups (QA workbook 2026-08-06)"* | **CURRENT** |
| Parts Velocity | `620888066` | **6** | 2026-08-07T03:43:09Z | Chris Ward — *"Section 3 tidy-ups (QA workbook 2026-08-06)"* | **CURRENT** |
| Technician Utilization | `641400833` | **7** | 2026-08-07T03:43:12Z | Chris Ward — *"Section 3 tidy-ups (QA workbook 2026-08-06)"* | **CURRENT** |
| Work In Progress | `703660034` | **11** | 2026-08-10T17:21:17Z | Chris Ward — *"QA-cycle decisions: line-state bucketing, fixed-price valuation, core …"* | **CURRENT** |
| Inventory Value | `720142338` | **5** | 2026-08-07T03:43:11Z | Chris Ward — *"Section 3 tidy-ups (QA workbook 2026-08-06)"* | **CURRENT** |

Full version histories for all six are in `evidence/*-version-history.json`; the storage bodies of
both the pinned and the live version of each are in `evidence/*.xml`.

### How the version was confirmed — and the trap that did NOT apply here

The brief warned that these pages carry an in-body "Version" field that lies (Rule 31 trap (a),
which is exactly how the Schedule spec drifted five versions unnoticed). **It does not apply to
these six pages: the field is not there at all.** All six storage bodies were flattened and
searched; **zero** in-body version mentions were found on any of them. So the only marker that
exists is the Confluence API's `version.number`, which is what every figure above and every pin
written to a case comes from.

**That is a better outcome than the trap, not a worse one** — there is no second number to be
misled by. It is recorded rather than passed over, because a future pass should not go looking for
a field that does not exist and conclude the fetch failed.

### Confirmed by CONTENT as well as by number

For each of the five reports whose version had moved, the **previously pinned version's body was
fetched too** and compared against the live one, so the move is proven by the text changing and not
merely by an integer incrementing:

| Report | Bodies compared | Body size | Anchors | Result |
|---|---|---|---|---|
| Sales By Customer | v16 vs v17 | 77,768 → 78,624 chars | 239 → 240 | 1 added, 7 changed, **0 gone** |
| Sales By Representative | v17 vs v18 | 103,591 → 103,734 | 228 → 228 | 0 added, 2 changed, **0 gone** |
| Parts Velocity | v5 vs v6 | 62,544 → 63,244 | 73 → 74 | 1 added, 3 changed, **0 gone** |
| Technician Utilization | — already live at 7 | 54,640 | 240 anchors read | nothing to compare |
| Work In Progress | v10 vs v11 | 49,750 → 52,177 | 124 → 124 | 0 added, 2 changed, **0 gone** |
| Inventory Value | v4 vs v5 | 46,179 → 46,414 | 113 → 113 | 0 added, 2 changed, **0 gone** |

---

## 2 · Epic SV-8582

| | |
|---|---|
| Read live | **2026-08-11 18:33Z** |
| Type / status | Epic · **Open** · no resolution |
| Assignee | Chris Ward |
| Last updated | 2026-08-10T05:22:16-0500 |
| Direct children | **105**, verified two independent ways — `parent = SV-8582` → 105 and `"Epic Link" = SV-8582` → 105, **key sets equal in both directions**, no paging remainder (Rule 37 Tier-1) |
| Verdict | **CURRENT** |

**One movement worth recording**: our project notes say the epic dropped to **104** children on
6 August when SV-8821 and SV-8822 were closed and had their parent stripped. It reads **105**
today. This is a Tier-1 currency check only — **no full epic re-read was done or needed**, and
Rule 37 requires the QA lead's go-ahead before one.

## 3 · The two cited stories

| Story | Cited by | Read | Verdict |
|---|---|---|---|
| SV-8657 | C30452 | already carried `read on 11 August 2026` from the earlier pass today; **left exactly as found** | CURRENT |
| SV-8654 | C30434 | as above | CURRENT |

Both were read live earlier today by the `dated-provenance-2026-08-11` pass and already carried an
honest read-date. **Re-stamping them with the same date would have been harmless; re-stamping them
with a date nobody stood behind would not.** They were left untouched (Rule 12).

## 4 · Chris Ward's answers sheet — cited by 46 cases

| | |
|---|---|
| Source | `https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/…` |
| Fetched live | **2026-08-11 18:35:23Z**, HTTP 200, 32,088 bytes |
| sha256 of the file as read | `6da732152589a31b842adf6e1a16549c3fce0dd0ca0c4da0e5792aac924993cd` |
| Identity confirmed | first cell reads *"Urgent - the location column - Report Suite - Chris Ward"*; three tabs — *Urgent - Location column*, *The product vs your write-up*, *Questions and things to note* |
| Verdict | **CURRENT** |

**This was fetched, not assumed.** The read-date on those 46 cases rests on the export above, and
the hash is recorded so a later pass can tell whether the sheet has since moved.

## 5 · The engineering technical plan — cited by 1 case (C38925)

| | |
|---|---|
| Artefact | `build/report-suite/tech-plan-2026-07-29/TechPlan-Reports-Suite-Full-Implementation.md` |
| Nature | a **verbatim copy of a user upload**, not a live URL — the committed file *is* the artefact |
| Committed | `c0458997` 2026-07-30, *"ingest engineering tech plan (verbatim copy, user upload 2026-07-29)"* |
| sha256 | `48c07e7b3f1bee9ea5053b31af9e5570a53472a740f880a9d782baf1bc71c0d0` |
| Read | **2026-08-11 18:35:47Z** |
| Content check | it does carry the point C38925 rests on — line 152 describes the QuickBooks journal-entry sync multiplying truncated fractional quantities into dollar amounts, and line 227 states the expected outcome |
| Verdict | **CURRENT** |

## 6 · Designs and Figma — NOT APPLICABLE, and stated rather than omitted

Rule 57 (as amended 2026-08-06) makes the design and Figma authoritative sources. **The Report
Suite has none**: this project has been spec-only from the start, and **not one of the 476 cases
cites a design or a Figma frame** (searched across all 476 provenance blocks — zero occurrences of
"design", zero of "figma"). So there is no design currency to establish, and no Rule-35 fetch queue
is open for this project.

**This is recorded as N/A rather than left blank, because a silent omission is indistinguishable
from a source nobody checked.**

## 7 · The build — deliberately NOT read, and deliberately NOT stamped

**No build was observed in this pass, and no case's Rule 54 sentence 2 was added, altered, re-dated
or removed.** All 476 keep the build line they had:

| Build named | Date named | Cases |
|---|---|---|
| `v3.5-16cf83f` | 8/6/2026 | 213 |
| `v3.5-7168d14` | 8/6/2026 | 129 |
| `v3.4.1-3d03023` | 8/4/2026 | 64 |
| `v3.5-f77875c` | 8/6/2026 | 48 |
| `v3.5-4795eee` | 8/10/2026 | 13 |
| `v3.5-16cf83f` | 8/5/2026 | 4 |
| *(none — the case says in its own words that it has not been checked against a build)* | — | 5 |

**A note on the brief's framing, corrected against what the cases actually say.** The brief
described 251 cases (Sales By Representative 112 · Parts Velocity 71 · Inventory Value 68) as
*"never checked against any build"*. **Live, all 251 carry a build line** — mostly `v3.5-16cf83f`
and `v3.5-7168d14`, dated 8/6/2026. What our own record actually claims
(`source-accuracy-remaining-2026-08-11/RESUME.md` and the CLAUDE.md entry it feeds) is narrower and
correct: those 251 are **source-accurate but not verified against the build now running**. The
distinction matters, because "never checked against any build" would make the 5 cases in the last
row of that table indistinguishable from the other 251 — and they are the only ones of which it is
literally true.

**Nothing turned on the difference here**: the instruction to preserve every build line exactly was
followed for all 476 either way, and it was verified afterwards that sentence 2 is byte-identical
on every one.
