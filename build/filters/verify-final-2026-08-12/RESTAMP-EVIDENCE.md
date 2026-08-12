# Filters — the re-stamp: NOT PERFORMED, and the worklist it leaves

> **⚠️ PARTIAL — 0 cases were re-stamped. The eligibility analysis was never run, because the union
> harvest it depends on was never taken.**

## 1 · The result

| | cases |
|---|---|
| **RE-STAMPED** | **0** |
| Left alone as ambiguous | n/a — never adjudicated |
| Left alone as no-label | n/a — never adjudicated |
| Cases resting on the shipping build | **12, unchanged** |

## 2 · Why a re-stamp is owed at all — the premise, verified

The build is **`v3.6-3e9dd6d`**, unmoved since 11 August 07:45:44 GMT (sha256 in
`BUILD-VERIFICATION.md`). The 11 August pass **checked 106 of 114 cases against this exact build**
and deliberately wrote to only the 8 it had to correct.

**So a substantial number of cases were checked against the build that ships, and their stamps do
not say so.** That understates our position to anyone reading the suite. It is a one-pass fix.

## 3 · The census — the worklist, already built and committed

Read live 2026-08-12, all 115, no sampling. Per-case detail in
`evidence/case-census-2026-08-12.json`.

| Rule-54 sentence 2 on the case | cases |
|---|---|
| `Last checked against build v3.4.2-d00239b on 8/5/2026` | **93** |
| `Last checked against build v3.6-3e9dd6d on 8/11/2026` | **8** |
| `Last checked against build v3.6-3e9dd6d on 12 August 2026` | **4** |
| no build sentence at all | **10** |
| **total** | **115** |

**The 12 already current:** C29595, C29596, C29615, C29622, C29623, C29624, C29625, C29626, C29627,
C38895, C43561, C43590.

**The 10 carrying none:** C29558, C29559, C29600, C29609, C29610, C29612, C29621, C43560, C43562,
C43563.

**A detail the next pass must not walk past: two date formats already coexist** — `8/11/2026` and
`12 August 2026`. Pick one, say which, and do not let the re-stamp introduce a third.

## 4 · THE BAR, recorded before any result exists — which is the right order

> **A case is re-stamped only where the committed evidence shows its asserted labels were actually
> compared against a harvest taken from this build.**

**A case merely PRESENT during a pass was not checked.** That distinction is the whole of the
exercise, and it is what stops the headline becoming a number that means nothing.

| Bucket | Rule | Outcome |
|---|---|---|
| **RESTAMP** | every on-screen label the case quotes matched a **visible** string in the union harvest | re-stamp |
| **AMBIGUOUS** | at least one quoted label not found on any surface the harvest reached, **or matched only an `aria-label` / test-id** | **leave alone** |
| **NO-LABEL** | the case quotes no on-screen label, so nothing about it was ever compared | **leave alone** |

**Two traps, both proven on the sibling project today:**

- **A match found only in an `aria-label` or a `data-test-id` is never a match.** No manual tester
  can see it. On Schedule a toolbar button carried `aria-label="Filter and display options"` while
  the visible label read `Filter & display` — a naive containment check would have certified wording
  that does not exist on screen.
- **Compare strings as stored, and record CSS `text-transform` separately.** `innerText` returns what
  is *painted*, so a panel painted uppercase yields `STATUS` where the build stores `Status`.

**And the failure mode to watch for in the tooling itself:** on Schedule, the first union harvest
mixed two record shapes and reported five real labels as NOT-FOUND — **an absence manufactured by our
own tooling.** Before recording a label as absent, prove the state it should appear in and write that
proof into the evidence.

## 5 · What a re-stamp asserts, and what it does not

**It asserts:** the on-screen labels this case quotes were compared against the build that ships, and
matched.

**It does NOT assert** that the case's preconditions and steps were walked, that its verdict was
re-established, or that the case was executed. **Rule 54 sentence 2 is a record of what a case was
last checked against, not a verdict** — which is exactly why sentence 1, the source of the
expectation, must be left byte-identical on every re-stamped case.

**For how many cases have actually had their preconditions and steps walked, see `RUNNABILITY.md`.
It is 0 of 115, and that is the number worth quoting.**
