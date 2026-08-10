# COVERAGE SWEEP — 2026-08-10

**Question asked:** Ahtasham told the QA lead *"we don't have the test cases for last two stories"*,
naming [SV-8798](https://shopview.atlassian.net/browse/SV-8798) and
[SV-8799](https://shopview.atlassian.net/browse/SV-8799). The QA lead asked whether he is right, and
whether the same is true anywhere else.

**Answer in one line:** he is **wrong** that the cases are missing — six name SV-8798 and two name
SV-8799 — but **right** that the coverage is not complete, and one of those six is **genuinely
invisible to him** because his test run is frozen.

---

## READ IN THIS ORDER

| File | What it answers |
|---|---|
| **`AHTASHAM-CLAIM.md`** | **Start here.** His two stories, with the requirement and the covering case quoted side by side, the verdict, and why he could not tell |
| **`STORY-COVERAGE.md`** | **The publishable map.** Every child story of all three epics → the cases that reference it. Send this to him and to Vlad |
| **`GAPS.md`** | Every uncovered story, split into our misses · deliberately unbuilt · not-V1 · blocked · no-case-required |
| **`ROOT-CAUSE.md`** | How the ten misses happened, which rules should have caught them, and whether each rule failed or was never run |
| **`SOURCE-CURRENCY.md`** | Every source, its live version, and what this pass did **not** establish |
| `evidence/` | The raw data behind every table — epic children, story→case map, anchor diffs |

---

## THE NUMBERS

| | Filters | Schedule | Report Suite | Total |
|---|---|---|---|---|
| Epic | SV-8785 | SV-8685 | SV-8582 | |
| Children (verified two ways) | 21 | 24 | 104 | 149 |
| Stories | 15 | 15 | 97 | **127** |
| Our cases | 114 | 168 | 476 | **758** |
| **Stories with no case at all** | 1 | **0** | 15 | **16** |
| …of which legitimately need none | 1 | — | 15 | **16** |
| **Genuine coverage misses** | 4 | 1 | **5** | **10** |

**Every one of the 16 stories with no case turned out to need none** — obsolete placeholders,
engineering build stories covered through the per-report cases, one story the spec retired, and one
container ticket. **The ten real misses are all inside stories that DO have cases**, which is
exactly why story-level counting alone would have missed them.

---

## CONSTRAINTS OBSERVED

- **Read-only on TestRail and Jira.** No `update_case`, no `add_case`, no run write, no result.
- **No Jira ticket created** (Rule 62).
- **No QA branch contacted**; `quick-login` and `switch-user` were not called. Coverage is a document
  question (Rule 57), so nothing here needed the build.
- Missing cases are **proposed, not authored** — that needs the QA lead's go-ahead (Rule 6).
- Foreign cases left untouched (Rule 38): 12 by Vladimir Tomovic under the Report Suite group,
  excluded from every count.

## THE FOUR THINGS MOST WORTH DECIDING

1. **Sync run 352** — add the 4 missing cases by UNION. This is the second time the same frozen run
   has produced a false gap report from the same reviewer.
2. **Send `STORY-COVERAGE.md` to Ahtasham and Vlad.** Publishing it was recommended on 6 August and
   is still undecided.
3. **Authorise a Schedule requirement→case re-derivation** — Schedule has never had one.
4. **Close [SV-8614](https://shopview.atlassian.net/browse/SV-8614)** — the SBC spec retired Print;
   the Jira story is still Open.
