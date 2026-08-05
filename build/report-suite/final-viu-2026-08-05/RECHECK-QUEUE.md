# RE-CHECK QUEUE — Report Suite (Standing Rule 49)

## STATUS: **OPEN**

**Check this file at every session start, and before and after any Report Suite work.**
There is no background scheduler — this committed file plus that habit IS the mechanism.

| Build marker | Value |
|---|---|
| app-version | **`v3.5-16cf83f`** |
| `Last-Modified` | Wed, 05 Aug 2026 06:40:32 GMT |
| `ETag` | `177c59546701e7810b894492dabc1423` |
| `index.html` sha256 | `67932a75b5a3a11d987b065c526d2d6dd38d0f47f76adeef61a6d341b249fa78` |
| Read at | 13:20:39Z (start) and 13:55:25Z (mid) — **byte-identical**, no redeploy under the pass |

**Why it is OPEN: the branch has NOT been declared final.** Engineering said on 2026-08-03 that they are
still working on it, and nothing has superseded that. **Therefore every verdict on all 473 cases is
PROVISIONAL, and this project may not be described as VIU-complete.**

**RE-RUN THIS QUEUE WHEN:** the branch is declared final · the app-version marker changes · a session dies
early (cookies on this estate die at ~24h **or on deploy**) · the QA lead asks.

---

## ROW GROUP 1 — ALL 473 CASES: the verdicts are two builds old

| What | Detail |
|---|---|
| Cases | all **473** |
| What was observed | nothing per-case on `v3.5-16cf83f`. The 2026-08-04 verdicts were taken on **`v3.4.1-3d03023`**; there has since been `v3.4.1-3d03023` → **`v3.5-16cf83f`**, a minor-version jump. |
| What was changed this pass | Expected Results on all 473 (repairs + the automation marker). **The build clause in the provenance line was deliberately left at `8/4/2026 (build v3.4.1-3d03023)`** — re-dating without re-observing would be a false claim. |
| Re-check obligation | **Re-observe every case on the final build and re-stamp all 473 provenance lines** with the build and the date actually tested. |

## ROW GROUP 2 — the 42 repaired cases: new expectations never checked on ANY build

These now assert their **documented** requirement, which in several cases **differs from what the build
does**. Nothing here has been verified against a running build.

| Report | Cases | The restored expectation | Re-check obligation |
|---|---|---|---|
| PV | C30352, C38914 | Location column not user-toggleable, not in the picker (S3-R10) | confirm the picker's contents on screen |
| TU | C30401, C30437, C38915 | never listed in the column selector (S10-R4) | as above |
| WIP | C30467, C30511, C38916 | not offered in the column selector (S4-R3, S7-R13) | as above |
| IV | C30551, C30554, C30588, C38917 | not one of the columns offered (S7-R6) | as above |
| SBR | C38913 | not in the seven-column dropdown (S21-R7, S20-R1) | as above |
| SBC | C30156, C38912 | **the spec contradicts itself** — held on Q1/Q2 | Chris's answer FIRST, then observe |
| all six | C30111, C30215, C30337, C30443, C30503, C30575 | the invented on-screen scope indicator **deleted** | confirm nothing on screen was actually meant to be asserted |
| all six | 25 permission cases | "for now" hedges removed; PV v5 S1-R4 cited | confirm against SV-8780's fix when it lands |
| IV | C30538 | IV S1-R8 standard page controls restored | **drive the screen** — the difference is unconfirmed by us |
| WIP/PV | C30470, C30362, C30384, C30391 | build-flavoured justifications replaced with spec citations | routine re-read |

## ROW GROUP 3 — findings taken live THIS pass that must be re-confirmed on the final build

| Finding | Evidence this pass | Re-check obligation |
|---|---|---|
| Location column present with 2 locations selected, absent with 1 | live CSV header rows, both captured | re-capture; it is the evidence behind Q1 |
| **S20-R19a** (new in v14) met — Location after Customer in the Summary download | live CSV header | re-capture |
| **S20-R19** met — Location after Date in the Expanded download | live CSV header | re-capture |
| **S14-R14** export filenames met; UTF-8 BOM present; `"Locations:"` metadata line present | `content-disposition` + file bytes | re-capture |
| **S15-R15** met — the PDF logo is embedded, 1 image object, 0 URLs | 209,920-byte PDF | re-capture |
| **SV-8823 still reproduces** — `$224.92`, `90.5%` in the CSV | live file content | re-check when SV-8823 is fixed |
| **`last_12_months` rejected, `today`/`yesterday` still accepted** — against v14 S2-R2 | 13 probes | **drive the picker on screen**, then decide on filing |

## ROW GROUP 4 — the two specifications that moved DURING this pass

**Chris Ward saved SBC v14 at 13:07:07Z and PV v5 at 13:21:40Z, while the pass was running**, and he is
working through our review workbook. **The other four specs still carry the older Location model.**

| Obligation | Detail |
|---|---|
| Re-read all six specs | he may ratify the remaining four at any moment; PV v5 landed one minute before it was fetched |
| Re-derive coverage for SBC | v14's 9 changed requirements + the new **S20-R19a** each need their own verdict row (Rule 43) |
| Watch for the fixes to the three spec defects we reported | the glossary lag, the S14-R14 date-label residue, and the S4-R12 / S13-R4 contradiction |
