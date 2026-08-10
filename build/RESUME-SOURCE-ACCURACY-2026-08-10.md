# RESUME — Filters + Schedule source-accuracy pass

> **Written 2026-08-10 after the QA lead stopped the pass for two hours.**
> **Nothing was written to TestRail, and nothing was left half-done on disk** — see
> "State when it stopped" below. This file is the pick-up point.

---

## State when it stopped — nothing to salvage

The worker's last output was *"Now let me build the writer with masked verification, and dry-run
it first"*. It was **still building tooling** and had not started writing.

**Checked, not assumed:**

- `build/filters/source-accuracy-2026-08-10/` — **does not exist**
- `build/schedule/source-accuracy-2026-08-10/` — **does not exist**
- **No oplog, no execution log, no dry-run output** anywhere in the repo or in the scratch dir
- `git status` **clean**, nothing untracked, **no stash**, nothing unpushed
- Last commit on the branch is `0db32aef`, the *finished* Report Suite pass

**So: zero `update_case` calls, zero of anything else.** Every Filters and Schedule case is
exactly as the previous passes left it. Start clean.

---

## The job

Make **every Filters and Schedule case's source reference 100% accurate** — the same pass just
completed for the three handed-off Report Suite reports, which took **225 cases from 13
correctly-sourced to 225**.

This is a *source-reference* pass. It is not a re-VIU: the **steps-and-labels half stays
unchecked** on both projects (no sign-in — see limits below), and the resume deliverable must
say so plainly.

---

## The proven method to copy

**`build/report-suite/full-viu-2026-08-06/SOURCE-ACCURACY-2026-08-10.md`** (commit `0db32aef`).

Its essential discipline, in the order it matters:

1. **Do not just bump the version digits.** Fetch the **previous page version** and **diff it
   requirement by requirement**, so the re-stamp is **provably nominal**.
2. **Read by hand** any case whose requirement genuinely changed.
3. Take the version from the API's **`version.number`** — **never** the in-body "Version" field
   (the Rule-31(a) trap; Schedule's in-body field has read `1.0` for its whole life).
4. **Quote-verify every anchor kept** — the anchor must actually say what the case says it says.
5. **Sanity-check by hand any automated "this anchor does not exist" result.** That pass's first
   extractor produced **8 false positives** because its pattern disallowed a bracket.

---

## The scale

| Project | Cases | Citing | Live | Gap |
|---|---|---|---|---|
| **Filters** | 114 | **105 cite spec v18** | **v19** | v19's **only** change is a new **`S1-R3`** (chips carry a leading type-icon) |
| **Schedule** | 168 | **ALL cite v23** | **v27** | Mechanism known: **versions 17–26 carry ten consecutive empty version comments** |

Both gaps look large and are mostly nominal — but "mostly" is what the requirement-by-requirement
diff is for. Prove it; do not assume it.

**Reuse, do not re-fetch:** `build/schedule/coverage-rederivation-2026-08-10/` already pulled the
Schedule history — **all 27 versions examined and string-dated**
(`evidence/string-dating-all-27-versions.json`), with **raw bodies persisted for v23–v27**
(`evidence/raw-v23.xml` … `raw-v27.xml`) and a **v25→v27 diff** already computed.

---

## The four classes to look for beyond the digits

Found on the Report Suite; expect the same shapes here.

1. **A reference saying a source is wrong** — after that source has since been corrected.
2. **A case saying a question is open** — after it was answered.
3. **A divergence note where nothing diverges.** Manufacturing a conflict is **itself a defect**
   (Rule 56's honesty half). **Leave *genuine* divergence notes alone.**
4. **A provenance line crediting the spec for something the spec does not say.**

**Schedule has five known instances of class 4.** The sharpest is
**[C38865](https://shopview.testrail.io/index.php?/cases/view/38865)**, which cites **§4.5 for
daylight-saving behaviour** when ***daylight* and *clock change* appear zero times in all 27
versions**.

---

## Filters' own known items

- **Two cases quote the build's *"Back To My Saved Filters"*** where spec **S11-R7** requires
  ***"Back to my view"***. The spec wins (Rule 57 — the build supplies labels, never the
  expectation, and here the label itself is what the spec pins).
- **One case carries an unresolved contradiction** about whether **one report or six** had filter
  bars on a given build. **Leave it stated** unless a document settles it.

---

## The standing limits — read before doing anything

- **The QA lead's hold: *"Do not create anything until my next order."*** So **no Jira ticket, no
  `add_case`, no new artefact anywhere.** **`update_case` on existing cases continues** — that is
  correction, not creation.
- **Runs 352 (Ahtasham) and 357 (Ayesha) must be proven untouched by content** — snapshot before,
  verify after, every prior result present **by ID** (Rules 34/47/50).
- **Foreign cases are hands-off** (Rule 38): **Ahtasham has five in Filters**, **Vladimir Tomovic
  twelve in the Report Suite**. Do not edit, and prove them byte-identical including
  `updated_on` / `updated_by`.
- **No sign-in for either branch, and none is needed** for this pass. Therefore **do not refresh
  any build stamp**, and **state in the deliverable that the steps-and-labels half stays
  unchecked**.
- Verification is **exhaustive then exact** (Rule 50): every case, every field, byte-compared;
  untouched fields proven byte-identical; **a mismatch stops the batch**.

---

## What the QA lead is waiting on, in his order of value

1. **A fresh `sv_sso_session` for Reports `sv8582`** — **the highest-value thing**. It alone
   unblocks the **steps-and-labels check on all 225 cases** of the three handed-off reports.
2. **Filters `sv8785`** sign-in — later.
3. **Schedule `sv8685`** sign-in — later.

**And his standing instruction: nothing goes to Chris or Branko until our own work is finished.**
Questions **accumulate on the two ready sheets** and go out as **one batch**.
