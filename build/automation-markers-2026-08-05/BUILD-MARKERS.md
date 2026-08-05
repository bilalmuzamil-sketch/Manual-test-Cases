# Automation-marker pass, 5 August 2026 — the build markers, read live at the start

Read with `curl -D` against each QA branch's `index.html`, 2026-08-05 11:34 UTC.

| Branch | Field | Expected (from the readiness report) | Read live at start | Verdict |
|---|---|---|---|---|
| Filters `sv8785.qa.shopview.com` | `<meta name="app-version">` | `v3.4.2-d00239b` | **`v3.4.2-d00239b`** | **IDENTICAL** |
| | `last-modified` | Tue, 04 Aug 2026 22:51:02 GMT | Tue, 04 Aug 2026 22:51:02 GMT | **IDENTICAL** |
| | `etag` | `b9ab1d41718b5e871432064ed914e2e7` | `b9ab1d41718b5e871432064ed914e2e7` | **IDENTICAL** |
| Schedule `sv8685.qa.shopview.com` | `<meta name="app-version">` | `v3.5-4873abe` | **`v3.5-be42149`** | **CHANGED — REDEPLOYED** |
| | `last-modified` | Tue, 04 Aug 2026 14:47:39 GMT | **Wed, 05 Aug 2026 08:09:19 GMT** | **CHANGED** |
| | `etag` | `9b4b1fc776ebbfb04a9a0ca051d847f7` | **`70e496609e155994b93f515db32d0289`** | **CHANGED** |

## What this means

**Filters is safe to write.** The build serving right now is byte-identical, on all three markers, to
the build the 110 verdicts were measured on this morning. Nothing has moved under us.

**Schedule is NOT safe to write.** The Schedule QA branch was rebuilt at **08:09 UTC this morning**,
after the 4 August verdicts were taken. Every one of the 165 Schedule verdicts — and every one of the
165 provenance lines — names a build that no longer exists. Under Standing Rule 49 that makes the
whole set due for a re-check before anything is asserted from it, and under Standing Rule 12 we cannot
write "expect this to fail" or "this feature is not built" onto a case from a build we have not
observed. **No Schedule case was written in this pass.** See `SCHEDULE-HALTED.md`.

## Re-read at the END of the pass — 2026-08-05 11:54 UTC

| Branch | Field | At start (11:34) | At end (11:54) | Verdict |
|---|---|---|---|---|
| Filters `sv8785` | app-version | `v3.4.2-d00239b` | `v3.4.2-d00239b` | **IDENTICAL** |
| | last-modified | Tue, 04 Aug 2026 22:51:02 GMT | Tue, 04 Aug 2026 22:51:02 GMT | **IDENTICAL** |
| | etag | `b9ab1d41718b5e871432064ed914e2e7` | `b9ab1d41718b5e871432064ed914e2e7` | **IDENTICAL** |
| Schedule `sv8685` | app-version | `v3.5-be42149` | `v3.5-be42149` | **IDENTICAL** |
| | last-modified | Wed, 05 Aug 2026 08:09:19 GMT | Wed, 05 Aug 2026 08:09:19 GMT | **IDENTICAL** |
| | etag | `70e496609e155994b93f515db32d0289` | `70e496609e155994b93f515db32d0289` | **IDENTICAL** |

**No redeploy happened under us on either branch during the pass.** The Filters writes therefore rest
on the same build the verdicts were measured on. The Schedule branch was **already** on a newer build
when the pass began — that is why nothing was written there, not because it moved mid-pass.

## Final exhaustive re-read of all 275 cases, after the last write

| Check (every case, no sampling) | Result |
|---|---|
| Filters cases live | 110 |
| Schedule cases live | 165 |
| Filters cases whose text is byte-identical to the intended payload | **102 of 102** |
| Marker appears **exactly once** per written case | **102 of 102** |
| Marker is the **last** thing in Expected Results | **102 of 102** |
| A **blank line** immediately before the marker | **102 of 102** |
| A **line break** immediately after the marker | **102 of 102** |
| Provenance line **still present and still BEFORE** the marker | **102 of 102** |
| The 8 deliberately-skipped cases carry **no** marker | **8 of 8** |
| Schedule cases carrying a marker | **0 of 165 — as intended** |
| Cases authored by anyone other than user id 3 (Bilal Muzamil) | **0** — no foreign case exists in either group |
| **Errors of any kind** | **0** |
