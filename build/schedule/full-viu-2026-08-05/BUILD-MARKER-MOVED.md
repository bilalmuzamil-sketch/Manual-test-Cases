# 🔴 THE BUILD MOVED BETWEEN THE TWO HALVES OF THIS PASS

This is the single most important thing to know about this pass, so it has its own file.

## What happened

The pass observed 97 of 168 cases, was cut off by a session limit, and resumed several
hours later. **In that gap the QA branch was redeployed.**

| | Marker | `index.html` last-modified | etag | Read at (UTC) |
|---|---|---|---|---|
| **First half** (97 cases) | **`v3.5-d122eef`** | Wed 05 Aug 2026 15:35:43 GMT | `dd1c57e2fb4beba9758b62a29afdeaab` | 2026-08-05 19:51Z |
| **Second half** (71 cases) | **`v3.5-7ec992f`** | Wed 05 Aug 2026 **22:49:36** GMT | `e2a80a6ab5e0b47c29fd88af9db1e980` | 2026-08-06 02:28Z |

Evidence: `evidence/build-marker-START-index.html` + `-headers.txt` (first half) and
`evidence/build-marker-RESUME-index.html` + `-headers.txt` (second half). The served page
itself also reports `v3.5-7ec992f` in its `app-version` meta tag, read from inside the
running browser, so the header and the page agree.

**That is the fourth deploy of this branch in two days**: `v3.5-4873abe` →
`v3.5-be42149` → `v3.5-d122eef` → `v3.5-7ec992f`.

## What it means, stated plainly

**No single build was ever observed across all 168 cases.** The pass is a composite of two
builds, and every case says on its own face which one it was checked against
(Standing Rule 54, sentence 2 — "Last checked against build `<marker>` on `<date>`").

| Cases | Marker they were checked against | Date |
|---|---|---|
| **97** (batches 1–5) | `v3.5-d122eef` — **a build that no longer exists** | 8/5/2026 |
| **71** (batches 6–9) | `v3.5-7ec992f` | 8/6/2026 |

**The 97 were NOT re-observed on the new build**, and nothing about them has been
silently upgraded to look as though they were. Per the instruction governing this resume,
batches 1–5 were not redone; their verdicts are carried forward **with the old marker
named on each case**.

## The honest risk this creates, in one paragraph

**The 25 deviations among the 97 are the exposed ones.** A deviation is a statement that
the build is wrong, and it drives an `AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` marker.
If the 22:49 deploy fixed any of those faults, that case now carries an expect-fail marker
for a fault that no longer reproduces — the marker would be wrong, and an automation run
would report a false failure. The 70 passes carry the mirror-image risk (a regression the
deploy introduced would go unseen), but a pass turning into a failure is the less damaging
direction because the automated run would catch it.

**Nothing here is inferred.** We do not know whether the deploy changed any of the 25,
because we did not look. It is recorded as an open re-check obligation, not as a guess in
either direction.

## What closes this

`RECHECK-QUEUE.md` carries a row per case in the 97 with the reason **"observed on
`v3.5-d122eef`, which has been superseded by `v3.5-7ec992f`"**. The branch has still not
been declared final (Rule 49), so every verdict in the pass — on both markers — remains
**PROVISIONAL** regardless.
