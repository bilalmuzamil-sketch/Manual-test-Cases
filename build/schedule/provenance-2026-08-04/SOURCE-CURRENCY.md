# Schedule — SOURCE-CURRENCY block (Standing Rule 31 pre-flight)

**Pass:** Standing Rule 54 provenance-line retrofit · **date checked 2026-08-04**

| # | Source | Identifier | Version / last-updated (LIVE) | Our baseline | Verdict |
|---|---|---|---|---|---|
| 1 | Spec | Confluence page **713031682** "Schedule" | **Confluence version 23**, 2026-07-30T10:40:32.155Z, Branko Cicovic, no version comment | mirror `spec-current-2026-07-31/Schedule-spec-current.md` = **v23** | **CURRENT** |
| 2 | Epic + child stories | **SV-8685 "Schedule"** | **16 children** SV-8686→SV-8700 + **SV-8812** | we recorded **15** stories SV-8686→SV-8700 | **PARTIAL — one new child, see below** |
| 3 | Designs | Claude prototype `Schedule.dc.html` (authoritative per Branko Q0); no Figma file | unchanged | same | CURRENT — no open fetch queue for Schedule |
| 4 | Tech plan | `tech-plan-2026-07-29/` | ingested 2026-07-29 | same | CURRENT |
| 5 | PO answers | `branko-answers-2026-07-31/` (+ `PO-Questions-Branko-Schedule-2026-07-31-Round-3`) | latest 2026-07-31 | same | CURRENT |

## FINDING 1 (spec) — v23 confirmed CURRENT, byte-length verified

Live fetch: `GET /wiki/rest/api/content/713031682?expand=body.storage,version,history.lastUpdated`
→ HTTP 200.

| Field | Live value | Our mirror | Match |
|---|---|---|---|
| Confluence version | **23** | 23 | ✅ |
| Last updated | 2026-07-30T10:40:32.155Z | 2026-07-30T10:40:32.155Z | ✅ |
| Body length (storage format) | **58,584 chars** | 58,584 chars | ✅ byte-length identical |
| Body sha256 (first 16) | `9e426a746f64a81c` | — (mirror is a markdown conversion) | n/a |

The spec has **not moved since our 2026-07-31 pull**. The spec-version constant used in
the provenance line is **23**.

Note the Rule-31 staleness trap applies here and is handled: the page **body's** own
version table still reads **1.0** because Branko never bumps that field. The **Confluence
version number (23)** is the real marker, and it is what the provenance line quotes —
phrased for a tester as "the Schedule specification version 23".

The Schedule spec uses **§-style** requirement locations (`§3.2`, `§4.13`, `§14.4`), not
`S<n>-R<n>` anchors; the anchor set-equality check returns 0 anchors on both sides
(consistent, not a shortfall). Requirement references in the provenance line are
therefore rendered as the § locations each case's `refs` already carries.

## FINDING 2 (epic) — SV-8685 has ONE NEW CHILD, and all 15 stories moved to In Progress

**Tier-1 currency check (Rule 37) — verified two independent ways, no paging remainder:**
`parent = SV-8685` → **16**; `"Epic Link" = SV-8685` → **16**. Same 16 keys.

Our ingest recorded **15** stories. The new child is:

| Key | Type | Status | Summary |
|---|---|---|---|
| **SV-8812** | **Task** | Board Backlog | **Set up a dedicated QA environment for testing** |

**This is not a testable requirement — it is the infrastructure ticket for the very thing
that blocks this project's live verification.** It is therefore recorded as an
**outstanding item**, not as a coverage gap, and no test case is authored for it.

All **15 stories SV-8686→SV-8700 are now `In Progress`** (they were Open at our
2026-07-27 ingest). A status move changes *when* we can verify, not *what* the
expectation is, so **no case content changes from this** — but it is the second signal,
alongside SV-8812, that a Schedule QA environment is being worked on.

**No story was removed, no story was reopened, and no story description delta was
required for this pass.** A full Tier-2 epic re-read (Rule 37) was **not** run — it is
expensive and user-gated, and the Tier-1 check shows no movement that would change an
expectation. Flagged for the QA lead rather than assumed.

## Consequence for the provenance line

Both sources are current, so Schedule cases take the plain two-source shape at
**state 1** (no build date — the Schedule QA environment does not exist yet, per SV-8812).
