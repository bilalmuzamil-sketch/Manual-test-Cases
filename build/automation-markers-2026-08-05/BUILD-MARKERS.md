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
