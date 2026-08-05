# Schedule — SOURCE CURRENCY, 5 August 2026 (provenance re-word + coverage-gap authoring pass)

Standing Rule 31 pre-flight **and Standing Rule 59's second read immediately before the writes**.
Verdicts: **CURRENT** / **STALE** / **PARTIAL**.

## Rule 59 — BOTH timestamps, as the rule requires

| | UTC |
|---|---|
| **Sources read at pass start** | **2026-08-05T17:11:48Z** (build marker) · **2026-08-05T17:12:21Z** (Confluence spec) |
| **Sources re-read at write start** | **2026-08-05T17:33Z** — see the verdict below |

## THE HEADLINE: THE BUILD MOVED AGAIN, ONE AND A HALF HOURS AFTER THE PREVIOUS PASS ENDED

| | Value |
|---|---|
| Build the previous pass observed | **`v3.5-be42149`**, last-modified Wed 05 Aug 2026 **08:09:19** GMT |
| **Build live NOW** | **`v3.5-d122eef`**, last-modified Wed 05 Aug 2026 **15:35:43** GMT, etag `dd1c57e2fb4beba9758b62a29afdeaab` |
| Read at | **17:11:48Z** and **17:29:54Z** — `index.html` **sha256 identical both reads** (`d422adc9…`), so nothing redeployed under this pass |

**Consequence, stated plainly: NOT ONE of the 165 existing cases has been checked against `v3.5-d122eef`.**
The previous pass's 8 fresh observations were made on `v3.5-be42149`; the other 157 were measured on
`v3.5-4873abe` on 4 August. **This is the third build marker in two days** — exactly the steady state
Standing Rule 60 exists for. The three cases authored in this pass **were** observed on
`v3.5-d122eef`, so they are the only Schedule cases whose recorded check names the current build.

## The block

| # | Source | Identifier | Version / last-updated | Checked (UTC) | Verdict |
|---|---|---|---|---|---|
| 1 | Specification | Confluence page **713031682** "Schedule" | **Confluence version 23**, last edited **2026-07-30T10:40:32.155Z** by Branko Cicovic; body **58,584 chars**, sha256 `9e426a746f64a81c…` | 2026-08-05 **17:12:21Z** | **CURRENT** |
| 2 | Epic | **SV-8685** | unchanged this pass | 2026-08-05 17:1xZ | **CURRENT** |
| 3 | Stories read verbatim for the new cases | **SV-8686**, **SV-8688**, **SV-8692** | all three `Ready for QA` | 2026-08-05 17:1xZ | **CURRENT** |
| 4 | The three gap tickets | **SV-8863** (`Ready to Fix`), **SV-8870** (`Open`), **SV-8867** (`Open`) | read live, full descriptions quoted in `NEW-CASES.md` | 2026-08-05 17:1xZ | **CURRENT** |
| 5 | Designs | — | **NONE EXISTS** — Schedule is a spec-only project (user confirmed 2026-07-21). No Figma file, so no Rule-35 queue | 2026-08-05 | **N/A — not a shortfall** |
| 6 | Engineering tech plan | `build/schedule/tech-plan-2026-07-29/` | unchanged since 29 July | 2026-08-05 | **CURRENT** |
| 7 | PO answers | `build/schedule/branko-answers-2026-07-31/` | unchanged; **the shop-closure question has still never been sent** | 2026-08-05 | **PARTIAL** |
| 8 | Build | `https://sv8685.qa.shopview.com` | **`v3.5-d122eef`** (see above) | 17:11:48Z / 17:29:54Z | **CURRENT, NOT DECLARED FINAL** |

## 1 — the specification, and the Rule 31(a) trap confirmed live for the third time

`GET /wiki/rest/api/content/713031682?expand=version,body.storage` → **HTTP 200**.

- **Confluence version 23**, last edited **30 July 2026**. Body length **58,584 characters** — byte-for-byte
  the same length the previous pass recorded, and the same edit date, so **nothing has moved**.
- **The in-body "Version" field still reads `1.0`.** Read live this pass:
  `<td><p><strong>Version</strong></p></td><td><p>1.0</p></td>`. **Go by the Confluence number, never
  the number printed inside the document** — this is the field that let this spec drift five versions
  unnoticed once already.

## Rule 59 verdict of the second read: UNCHANGED, with one exception that is not a source

At write start the spec was still **version 23** and the three gap tickets were still in the statuses
recorded above. **Nothing was re-derived, because nothing moved.**

**The one thing that DID move is the build**, and it moved *before* the pass began rather than during
it — which is why every provenance line written by this pass names the build each case was **actually**
last checked against, and never the build that happens to be deployed today.

## What a build move does and does not invalidate (Standing Rule 60)

| Layer | Moved by the redeploy? |
|---|---|
| The documented expectation, the requirement anchor, the spec version, the epic/story reference | **No** — build-independent, survives untouched |
| On-screen labels and the navigation path | **Possibly** — Rule-49 queue |
| The pass/fail verdict | **Possibly** — Rule-49 queue |
| `AUTOMATION: READY - EXPECT FAIL (…)` and `HOLD - not built` markers | **Possibly** — they assert a build fact |
| Plain `AUTOMATION: READY` | **No** — it asserts *automatable*, not *currently passing* |

The Rule-49 re-check queue is therefore **OPEN**, as the normal steady state of this project, and all
165 carried-forward verdicts remain **PROVISIONAL**.
