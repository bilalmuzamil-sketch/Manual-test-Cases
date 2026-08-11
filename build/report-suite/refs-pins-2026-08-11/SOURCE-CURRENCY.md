# Report Suite — SOURCE CURRENCY, refs version-pin pass, 2026-08-11 (Standing Rules 31 + 59)

Every version figure below was **fetched live in this pass**, not carried forward from the two
earlier passes today. That matters here more than usual: the whole job is to write a version
number onto 343 cases, so the number had better come from somebody who actually looked.

| | |
|---|---|
| Pass-start read | **2026-08-11 20:14:31Z** |
| Write-start re-read (Rule 59) | **2026-08-11 20:22:48Z** |
| Verdict of the second read | **all six specifications UNCHANGED** — same version integer *and* same body length on every page |

## 1 · The six specifications — live version, and how each was confirmed

There is no single "Report Suite spec version". Six pages move independently, so every pin is
per-report and nothing is generalised across them.

| Report | Confluence page | **Live version** | Published | Editor / message |
|---|---|---|---|---|
| Sales By Customer | `577634305` | **17** | 2026-08-10T17:22:42Z | Chris Ward — *"SV-9074: Product Type filter to multi-select toggles"* |
| Sales By Representative | `585629698` | **18** | 2026-08-07T03:43:08Z | Chris Ward — *"Section 3 tidy-ups (QA workbook 2026-08-06)"* |
| Parts Velocity | `620888066` | **6** | 2026-08-07T03:43:09Z | Chris Ward — *"Section 3 tidy-ups (QA workbook 2026-08-06)"* |
| Technician Utilization | `641400833` | **7** | 2026-08-07T03:43:12Z | Chris Ward — *"Section 3 tidy-ups (QA workbook 2026-08-06)"* |
| Work In Progress | `703660034` | **11** | 2026-08-10T17:21:17Z | Chris Ward — *"QA-cycle decisions: line-state bucketing, fixed-price valuation, core …"* |
| Inventory Value | `720142338` | **5** | 2026-08-07T03:43:11Z | Chris Ward — *"Section 3 tidy-ups (QA workbook 2026-08-06)"* |

### Confirmed BY CONTENT, not by an integer incrementing

For every report whose pin had to move, the **previously-pinned body was fetched as well** and
diffed against the live one. An integer going up proves nothing on its own; text changing does.

| Report | Bodies compared | Text size | sha256 identical? | Anchors | Anchors **removed** |
|---|---|---|---|---|---|
| Sales By Customer | v16 → v17 | 65,306 → 66,096 | **No** | 239 → 240 (`S3-R6a` added) | **0** |
| Sales By Representative | v15 → v18 | 83,285 → 84,445 | **No** | 228 → 228 | **0** |
| Sales By Representative | v17 → v18 | 84,310 → 84,445 | **No** | 228 → 228 | **0** |
| Parts Velocity | v4 → v6 | 50,011 → 51,169 | **No** | 73 → 74 (`S6-R12` added) | **0** |
| Work In Progress | v10 → v11 | 41,254 → 43,563 | **No** | 124 → 124 | **0** |
| Inventory Value | v3 → v5 | 36,658 → 37,730 | **No** | 112 → 113 (`S10-R8a` added) | **0** |

**Technician Utilization was already live at 7**, so there was nothing to compare and nothing to
re-pin — all 59 TU pins were already correct.

**The "0 anchors removed" column is the one that makes re-pinning safe.** Moving a pin from v15 to
v18 is only honest if the requirement the case cites still exists at v18. It does, everywhere:
a per-case check across all 337 re-pinned citations found **0 citing an anchor absent from the
live body** it now names.

Raw bodies: `evidence/<Report>-v<N>.xml` · per-version metadata: `evidence/<Report>-v<N>-meta.json` ·
the diff table above, machine-readable: `evidence/version-content-diff.json` · the Rule-59 re-read:
`evidence/reread-at-write-start.json`.

### Rule 31 trap (a) — checked, and it does not apply

These six pages carry **no in-body "Version" field at all**. All six live bodies were flattened and
searched: the only hits are the ordinary English word *"version."* in prose (SBC 2, PV 1, WIP 1,
and none at all in SBR, TU, IV). **So the Confluence API's `version.number` is the only marker that
exists**, and it is what every figure above and every pin written to a case comes from.

Recorded rather than passed over, because a future pass should not go hunting for a field that does
not exist and conclude its fetch failed.

## 2 · Epic SV-8582

Cited by every case's provenance line; **not re-read in this pass and not needed** — this pass
changes no provenance reference to the epic. It was Tier-1 currency-checked at **105 children**
earlier today by the `read-dates-2026-08-11` pass. Rule 37 requires the QA lead's go-ahead before a
Tier-2 full re-read, and nothing here called for one.

## 3 · The engineering technical plan — relevant to exactly one case

`build/report-suite/tech-plan-2026-07-29/TechPlan-Reports-Suite-Full-Implementation.md`, a committed
verbatim copy of a user upload (sha256 `48c07e7b3f1bee9ea5053b31af9e5570a53472a740f880a9d782baf1bc71c0d0`).
It is the sole documented source behind **C38925**, and it **carries no version of its own** — which
is why that case's provenance names a read-date rather than a version number. See `FINDINGS.md` §2.

## 4 · Designs and Figma — NOT APPLICABLE, stated rather than omitted

Rule 57 (amended 2026-08-06) makes designs and Figma authoritative sources. **The Report Suite has
none** — spec-only from the start, and not one of the 480 cases cites a design or a Figma frame.
No Rule-35 fetch queue is open for this project. Recorded as N/A because a silent omission is
indistinguishable from a source nobody checked.

## 5 · The build — deliberately NOT read, and deliberately NOT stamped

**No build was observed. No case's Rule 54 sentence 2 was added, altered, re-dated or removed** —
the writer refuses the write outright if that line moves, and it did not move on any of the 343.
The QA-branch session is expired estate-wide, so **this pass claims no build fact whatsoever**
(Rule 12).

**A version pin is a pointer to a document. It says nothing about a build, and this pass asserts
nothing about one.**
