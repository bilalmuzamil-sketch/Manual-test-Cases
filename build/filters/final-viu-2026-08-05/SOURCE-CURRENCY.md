# Filters — where every source stood, 5 August 2026 (the final-check pass)

Standing Rule 31: the currency of **all** sources is established before anything is done, and every
source gets a verdict. Nothing here is copied from an earlier pass's summary — each line was read
live by this pass.

| Source | Identifier | Version / last change | Checked | Verdict |
|---|---|---|---|---|
| **Specification** | Confluence page **572030978** "Filters" | **Confluence version 18**, 2026-08-04T18:19:21.735Z, Branko Cicovic, note *"Date-range filter: reflect current in-app default range and standard predefined ranges (Feature Overview + Key Decisions)"* | 2026-08-05 13:24Z | **CURRENT — proven by content, not by version number.** Our committed mirror `recheck-2026-08-05/evidence/spec-v18.xml` is **byte-identical** to the live storage body: 56983 bytes, same md5. |
| Requirements extracted | **132 anchors** — 104 `Sn-Rn`, 28 `Sn-Nn` / `Sn-En` | parsed from the live v18 body | 2026-08-05 | complete |
| **Epic** | **SV-8785** "Filters" (Epic, Open) | **20 children**, counted two independent ways — `parent=SV-8785` and `"Epic Link"=SV-8785` — same keys, sets equal **both directions**, `isLast=true`, no paging remainder | 2026-08-05 13:26Z | **CURRENT — and it moved since yesterday** (see below) |
| **Story defects** | subtasks of the 14 stories | **8** — SV-8824, SV-8828, SV-8832, SV-8846, SV-8871, SV-8872, SV-8875, SV-8878 | 2026-08-05 13:26Z | **CURRENT** |
| **Build** | `sv8785.qa.shopview.com` | **`v3.4.2-d00239b`**, `index.html` last-modified **Tue, 04 Aug 2026 22:51:02 GMT**, etag `b9ab1d41718b5e871432064ed914e2e7` | **13:22:10Z, 14:13:35Z and 14:25:10Z** | **CURRENT and STABLE — `index.html` byte-identical at all three reads (sha256 `d4845701337c6836…`), so nothing redeployed under this pass.** The branch is still **not declared final**, so verdicts stay PROVISIONAL (Rule 49). |
| Designs (Figma) | file `DR4gEODShYgJqkozs3mF5q`, Filters nodes | Rule-35 fetch queue **CLOSED at 85/85** since 2026-07-31 | 2026-08-05 | **CURRENT** |
| Engineering tech plan | Filters tech plan, ingested 2026-07-29 | unchanged | 2026-08-05 | **CURRENT** |
| PO answers | `branko-answers-2026-08-04/answers-ingested.md`; **SV-8825** closed by Branko 2026-08-05T05:18:22-0500 | newest PO input | 2026-08-05 | **CURRENT** |
| Test cases | TestRail group **4110** | **110** cases, every one `created_by = 3` (Bilal Muzamil) — **no foreign case in the group** | 2026-08-05 13:23Z and 14:20Z | **CURRENT** |
| Test run | run **352** (Ahtasham Amjad) | `include_all:false`, 110 tests, **438** result records, 36 Passed / 2 Failed | 13:23Z and 14:21Z | **CURRENT — and proven untouched by us** |

## The trap this project keeps setting, confirmed again — and fixed this time

The specification page's own body still reads **"Version: 1.6"** while the Confluence page version is
**18**. That is exactly the Standing Rule 31(a) staleness trap: the number written *inside* the
document does not move, so a reader who trusts it never notices the page advancing.

Until this pass **all 110 provenance lines said "specification version 1.6"**. That has been corrected
on all 110 to name **Confluence version 18**, so the case text now points at the number that actually
moves.

## What moved in the epic since yesterday

| Change | Detail |
|---|---|
| **SV-8791 is now QA Complete** | three stories are now QA Complete — SV-8787, SV-8788, SV-8791 |
| **All four Bug children are now OBSOLETE** | SV-8843, SV-8844, SV-8845, SV-8847 |
| **SV-8843 and SV-8847 were closed under OUR OWN account** | Bilal Muzamil, 2026-08-04 21:41:31 and 22:02:41 (−0500). The QA lead works in Jira under this same account, so the changelog cannot tell his edits from ours (Standing Rule 53's corollary). Either way, **closing a ticket is a triage decision about whether to fix — not an amendment to the specification.** |
| **SV-8845 was closed by Ahtasham** | 2026-08-05 04:41:58 (−0500), OBSOLETE / Done — **and this pass proved it still reproduces** |
| **SV-8876 is new and it is about us** | Ahtasham Amjad, 2026-08-05 06:17:01 (−0500), status **Ready**: *"a test case has waived it without the PRD being updated"*, quoting C29557's waiver note. He found our defect before we did. Not touched (Rule 38). |
| Three new story defects today | SV-8872, SV-8875, SV-8878 (all Ahtasham) |

## Honest limits of this pass

- **The branch is not declared final**, so every verdict is **PROVISIONAL** and the Rule-49 queue stays open.
- **Not all 110 cases were driven live this pass.** What was driven is listed case by case in
  `FINDINGS.md`, with the un-driven ones named and the reason given. No verdict here is inferred.
