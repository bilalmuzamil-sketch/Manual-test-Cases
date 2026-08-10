# RESUME — Filters + Schedule source-accuracy pass

> **UPDATED 2026-08-10 (late). THE PASS IS COMPLETE ON BOTH PROJECTS.**
> The earlier body of this file described the job before it was run; it has been replaced with
> the finished state. Deliverables:
> **`build/filters/source-accuracy-2026-08-10/SOURCE-ACCURACY.md`** and
> **`build/schedule/source-accuracy-2026-08-10/SOURCE-ACCURACY.md`**.

---

## Where it stands

| Project | Cases | Correctly sourced BEFORE | Correctly sourced NOW | Writes |
|---|---:|---:|---:|---:|
| **Filters** | 114 ours / 119 live | **10** | **114** | 108 |
| **Schedule** | 168 ours / 168 live | **0** | **168** | 174 |

**282 `update_case`, every one HTTP 200, 30 fields compared each, 0 mismatches, 0 collateral.**
**0 `add_case` · 0 `delete_case` · 0 section ops · 0 run writes · 0 results** — the creation hold
was respected. Runs **352** (Ahtasham) and **357** (Ayesha) proven untouched by content. Ahtasham's
**5 foreign cases** (C43576–C43580) proven byte-identical including `updated_on`/`updated_by`.

**No build stamp was refreshed on any case, deliberately.** There was no sign-in for either branch
and nothing was observed, so **the steps-and-labels half of the VIU stays unchecked on both
projects.**

## The sources, as at this pass

| | Live version | Read from | Our cases had cited |
|---|---:|---|---|
| Filters, Confluence page 572030978 | **19** (2026-08-06) | `version.number` | v18 |
| Schedule, Confluence page 713031682 | **27** (2026-08-07) | `version.number` | v23 |

Both pages' in-body "Version" fields lie (**1.6** and **1.0**). Always use `version.number`.

**Historical bodies are persisted** under each project's `source-accuracy-2026-08-10/tools/` recipe —
re-fetch with `hist.py`. Filters v18+v19 and Schedule v23–v27 were all diffed requirement by
requirement before any digit moved.

## What is NOT done, and needs a ruling before anyone touches it

1. **🔴 Schedule `§6` — Branko deleted a requirement in v24** and
   [C30041](https://shopview.testrail.io/index.php?/cases/view/30041) still tests it with
   `EXPECT FAIL (SV-8874)`. **SV-8874 may be a defect against a requirement that no longer exists.**
   The case states the document history; the expectation was **not** rewritten to the build.
2. **37 cases show raw `<ol>`/`<li>` markup to the tester** — 17 Filters, 20 Schedule. Listed by
   C-id in both deliverables. **Postdates the 5 August audit that proved zero.** A ~37-write repair,
   not attempted.
3. **Filters C29600 and C29621 have no provenance line**, and both were last edited by someone else.
   Not restored — that is a call for the QA lead.
4. **Filters C38880's `AUTOMATION: HOLD` reason is false** — it says the behaviour is undocumented;
   `S10-R4` documents it. Clearing a HOLD is a readiness claim, so it was left.
5. **Schedule `§5.3 Panel collapse` is new in v27 and no case cites it** — a coverage gap. Authoring
   is barred by the creation hold.
6. **The shop-closures question has still never been sent.** `§4.5` and `§12` have contradicted each
   other since v23 and v27 did not fix it. Three cases wait on it and **the blocker is us.**

## The next document-side job, if the QA lead wants it

The **Filters requirement→case map**, started and stopped on 6 August —
`build/filters/coverage-rederivation-2026-08-06/` holds the partial output and
`build/filters/vlad-gap-review-2026-08-06/ROOT-CAUSE.md` explains why it matters.
**Not started by this pass.**

## Two facts worth carrying forward

- **`case_refs` on a run result is a stored snapshot, not a live mirror.** Touching a case makes the
  echo catch up with the case's current `refs`, so it can move on results for cases whose `refs` you
  never edited. It looks like damage and is not — proven on run 357, where 208 records moved while
  **166 of 168 case `refs` were byte-identical**. Belongs in the playbook's §J; not written there,
  since the playbook was out of this pass's scope.
- **A masked-remainder check must mask BOTH the old and the new form of the token.** Mine failed
  closed on the first attempt because it only matched the old form. The tool was fixed, not the
  check relaxed — and that is the same class of error as the Report Suite pass's 8 false positives.
