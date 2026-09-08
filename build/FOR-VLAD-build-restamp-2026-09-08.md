# Rule 65 notice for Vlad — build-check line re-stamped on 9 Automated cases (2026-09-08)

**What changed:** the build-verification line in each case's Expected Results was re-stamped from
`Last checked against build v26.35.6-598cc8a on 9/1|9/2/2026`
→ `Last checked against build v26.35.9-7f2e4fa on 9/8/2026`.
Nothing else was touched — no title, precondition, step, expected behaviour, `AUTOMATION:` marker,
`custom_atmstatus`, `custom_automation_type`, section or refs change. Only the single
"Last checked against build …" sentence changed, verified by read-back
(`after === before.replaceAll(from, to)`), and the served page still renders in `markdown fr-view`.

**Why:** the QA branch sv9315 moved to build `v26.35.9-7f2e4fa`. The distinct precondition labels of
suites 6617 (Printer Friendly WO) and 6597 (Inline Add & Edit Parts) were re-observed on the new build
(role-edit screen, WO More menu, Lines/inline Add Part, settings sidebar — all unchanged); the stamp
was moved to reflect that re-check date.

**Why you're told:** Rule 71/65 — these cases are TestRail-flagged **Automated**, so you get a heads-up
whenever anything on them changes. The QA lead's explicit go-ahead (2026-09-02) covers updating the
Automated cases in these three suites to keep them runnable and build-verified.

**`custom_atmstatus` stays 3 (Automated) on all of them — unchanged.**
**Vladimir Tomovic's cases (C45220, C45268, C53474, C53475) were NOT touched** (Rule 38).

**⚠️ CORRECTION — only ONE Automated case has actually been re-stamped so far.** The re-stamp batch was
stopped early (TestRail was deadlocking under concurrent load), and of the Automated cases only
**C45123** reached the write. The other eight are **authorised and pending** — they will be re-stamped
when the deferred bulk pass runs (estate quiet). This notice will be updated then.

| Suite | Case | Status |
|---|---|---|
| Printer Friendly WO | **C45123** | ✅ build stamp → v26.35.9-7f2e4fa 9/8/2026 (verified read-back) |
| Printer Friendly WO | C45107 | ⏳ pending deferred re-stamp (still v26.35.6) |
| Inline Add & Edit Parts | C45005 | ⏳ pending (still v26.35.6) |
| Inline Add & Edit Parts | C45026 | ⏳ pending (still v26.35.6) |
| Inline Add & Edit Parts | C45223 | ⏳ pending (still v26.35.6) |
| Inline Add & Edit Parts | C45224 | ⏳ pending (still v26.35.6) |
| Inline Add & Edit Parts | C45237 | ⏳ pending (still v26.35.6) |
| Inline Add & Edit Parts | C45252 | ⏳ pending (still v26.35.6) |
| Inline Add & Edit Parts | C45253 | ⏳ pending (still v26.35.6) |

Only the build-check line changes (nothing else) — this is a heads-up per Rule 65 whether it lands now
or on the deferred pass.

Case links: `https://shopview.testrail.io/index.php?/cases/view/<id>`

Per-case audit (old → new, verified read-back):
`build/inline-add-edit-parts/build-verify-2026-09-08/restamp-9-1/APPLIED.jsonl`
and `.../restamp-9-2/APPLIED.jsonl`.
