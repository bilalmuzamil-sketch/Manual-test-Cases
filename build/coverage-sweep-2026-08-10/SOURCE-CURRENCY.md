# SOURCE-CURRENCY — coverage sweep, 2026-08-10

Standing Rule 31 pre-flight, run **before** any analysis, and **re-read at 15:22:39Z immediately
before these documents were written** (Rule 59 — both timestamps recorded below).

**Every version number below is the CONFLUENCE version, read live from the API.** The version
printed *inside* the page body is the Rule 31(a) trap and it lied twice today — see §2.

---

## THE TABLE

| Source | Identifier | Live version / last updated | Checked (UTC) | Verdict |
|---|---|---|---|---|
| **Filters spec** | Confluence page **572030978** | **v19**, 2026-08-06T11:48:47Z | 15:22Z | **CURRENT** — matches the brief |
| **Schedule spec** | Confluence page **713031682** | **v27**, 2026-08-07T15:01:20Z | 15:22Z | **STALE — the brief said v25; live is v27.** Two versions ahead. §3 |
| **SBC spec** | Confluence page **577634305** | **v16**, 2026-08-07T03:43:06Z | 15:22Z | **STALE — brief said v15** |
| **SBR spec** | Confluence page **585629698** | **v18**, 2026-08-07T03:43:08Z | 15:22Z | **STALE — brief said v17** |
| **PV spec** | Confluence page **620888066** | **v6**, 2026-08-07T03:43:09Z | 15:22Z | **STALE — brief said v5.** Added `S6-R12` |
| **TU spec** | Confluence page **641400833** | **v7**, 2026-08-07T03:43:12Z | 15:22Z | **STALE — brief said v6.** Added `S7-R14` |
| **WIP spec** | Confluence page **703660034** | **v10**, 2026-08-07T03:43:13Z | 15:22Z | **STALE — brief said v9** |
| **IV spec** | Confluence page **720142338** | **v5**, 2026-08-07T03:43:11Z | 15:22Z | **STALE — brief said v4** |
| **Filters epic** | **SV-8785** | **21 children**, updated 2026-08-07T08:12Z | 15:15Z | **CURRENT** — verified two ways, key sets equal |
| **Schedule epic** | **SV-8685** | **24 children**, updated 2026-08-04T07:17Z | 15:15Z | **CURRENT** — verified two ways, key sets equal |
| **Report Suite epic** | **SV-8582** | **104 children**, updated **2026-08-10T05:22Z (today)** | 15:15Z | **CURRENT** — verified two ways, key sets equal |
| **TestRail cases** | groups 4110 / 4254 / 4281 | Filters 114 · Schedule 168 · Reports 476 ours + 12 foreign | 15:12Z | **CURRENT** — paged, 626 sections walked |
| **Filters engineering handover** | `HANDOVER — App-Wide Filter Redesign` | supplied 2026-08-10 | 15:16Z | **CURRENT** — load-bearing; see §4 |
| **Schedule design review** | Fabian / Sasha, 2026-08-05 | supplied 2026-08-10 | 15:16Z | **CURRENT** — load-bearing; see §4 |
| **Filters requirement→case map** | `build/filters/coverage-rederivation-2026-08-06/COVERAGE-MAP.md` | built against **v19** | 15:05Z | **CURRENT and re-used** — v19 is still live, so it did not need rebuilding |
| **Schedule requirement→case map** | — | **does not exist** | — | **MISSING** — no per-requirement map has ever been built for Schedule. §3 |
| **Report Suite requirement→case map** | — | **does not exist as a map**; rebuilt mechanically this pass from live anchors | 15:14Z | **PARTIAL** — anchor-level only, see the honesty note in §5 |
| **Live build (all three QA branches)** | `*.qa.shopview.com` | **not contacted** | — | **NOT USED — deliberately.** Coverage is a document question (Rule 57). `quick-login` and `switch-user` were not called |

---

## 1. NOTHING IN THIS PASS RESTS ON A LIVE OBSERVATION

A coverage question is entirely document-side: expected behaviour comes from the PRD, the epic's
stories, the PO's verified answers and the design (Rule 57), and **never from the build**. No QA
branch was opened, no sign-in attempted. **Anything below that would need live observation is
labelled as such** — and the only such item is the visual-fidelity group in `GAPS.md`, which cannot
be settled from a document because the handover says the components are not yet pixel-perfect.

---

## 2. THE RULE 31(a) TRAP FIRED TWICE, AGAIN

| Page | Confluence version | Version printed inside the body |
|---|---|---|
| Filters | **19** | *"1.6"* |
| Schedule | **27** | *"1.0"* |

**The engineering handover repeats the trap in its own header** — it cites the PRD as *"currently
v1.6"*, which is the in-body number, not the page version. Anyone reading the handover and going to
Confluence expecting v1.6 will be thirteen versions out.

---

## 3. HOW STALE OUR CASES' OWN PROVENANCE LINES ARE

Measured from the live case text, not from notes. Every case carries a Rule-54 provenance sentence
naming the spec version it was written against.

| Suite | Cases | Provenance names | Live | Gap |
|---|---|---|---|---|
| **Schedule** | 168 | **v23** (all 168) | **v27** | **4 versions** |
| Filters | 114 | v18 (102) · v19 (a handful) | v19 | 1 version on 102 |
| SBC | 87 | v15 (all) | v16 | 1 |
| SBR | 112 | v17 (all) | v18 | 1 |
| PV | 71 | v5 (70; 1 names none) | v6 | 1 |
| TU | 60 | v6 (all) | v7 | 1 |
| WIP | 78 | v9 (all) | v10 | 1 |
| IV | 68 | v4 (all) | v5 | 1 |

**A stale stamp is itself a finding (Rule 54), and this is the finding: 758 cases name a spec
version that is no longer current.** Schedule is the worst at four versions behind.

**But staleness of the stamp is not the same as staleness of the content.** I diffed the requirement
anchors from each recorded baseline to live:

| Spec | Baseline → live | Anchors added | Anchors removed | Verdict |
|---|---|---|---|---|
| SBC | v15 → v16 | 0 | 0 | *"Section 3 tidy-ups"* — no requirement moved |
| SBR | v17 → v18 | 0 | 0 | same |
| WIP | v9 → v10 | 0 | 0 | same |
| IV | v4 → v5 | 0 | 0 | same |
| **PV** | v5 → v6 | **1 — `S6-R12`** | 0 | **the 10,000-row export cap is now IN the spec** |
| **TU** | v6 → v7 | **1 — `S7-R14`** | 0 | **the same cap, now in the spec** |
| **Schedule** | v25 → v27 | n/a (§-numbered) | n/a | **a whole new section §5.3 "Panel collapse"** |
| Filters | v19 → v19 | 0 | 0 | unmoved |

**So the content risk is concentrated in three places, not spread over eight:** PV `S6-R12`,
TU `S7-R14`, and Schedule `§5.3`. All three are written up in `GAPS.md`.

**Honesty note:** the four "0 anchors changed" specs each grew by 150–730 bytes under the message
*"Section 3 tidy-ups (QA workbook 2026-08-06)"*. **I compared requirement anchors, not full prose.**
§3 is Key Decisions, which **is** a source of expected behaviour under Rule 57, so a prose diff of
those four is still owed. I did not do it and I am not claiming I did.

---

## 4. THE TWO NEW DOCUMENTS, AND WHAT THEY CHANGED

Both were supplied today and both changed verdicts. A third worker is doing the deep reconciliation
in `build/handover-ingest-2026-08-10/`; only the coverage-relevant facts are used here.

**Filters engineering handover** — establishes **"adopt-only-existing"** (2026-07-29): migrate only
the filters a page has today, do not invent capabilities from the spec or Figma. It lists what was
deliberately not migrated, and it says the components are **not pixel-perfect**. **This moved six
Filters assertions out of "we missed it" and into "deliberately unbuilt" or "premature".**

**Schedule design review (Fabian / Sasha, 5 August)** — supplies a sourceable expectation for the
default viewport, and marks E1, E13, E14 (Founder Mode) and E16 (vertical Day View) as out of V1.
**This prevented four items being counted as gaps that are not ours**, and it surfaced a
contradiction between our case C30001 and the V1-scoped E11.

---

## 5. WHAT THIS PASS DID *NOT* ESTABLISH — read before quoting any number here

1. **No per-requirement map exists for Schedule.** Its spec is organised as §1–§15 sections, not
   `S<n>-R<m>` anchors, so the anchor diff that works for Filters and the Report Suite is far
   coarser here. **Schedule story coverage in `STORY-COVERAGE.md` is story-level only.** A real
   Schedule coverage re-derivation has never been run and is still owed.
2. **The Report Suite check is anchor-level, not assertion-level.** A case citing `S4-R13` is
   counted as covering it. That catches *nothing cited*; it does **not** catch a requirement making
   two promises where the case only tests one — which is precisely how the SBR Location column was
   missed in July. **Only the three handed-off reports were examined further, and only at the
   uncovered anchors.** A full Rule 45(e) assertion split for all 476 Report Suite cases has not
   been done.
3. **The four "Section 3 tidy-up" prose diffs were not done** (§3 above).
4. **Nothing was observed on any build.**

---

## OUTSTANDING — what I need from you

1. **A ruling on the 758 stale provenance stamps** — do we re-stamp all of them, or only the three
   suites whose content actually moved (PV, TU, Schedule)? It is one write per case either way.
2. **Go-ahead for a Schedule requirement→case re-derivation** — it has never been done and it is the
   biggest blind spot of the three projects.
3. **Go-ahead for the four "Section 3" prose diffs** (SBC, SBR, WIP, IV).
4. Everything else is listed in `GAPS.md` and `AHTASHAM-CLAIM.md`.
