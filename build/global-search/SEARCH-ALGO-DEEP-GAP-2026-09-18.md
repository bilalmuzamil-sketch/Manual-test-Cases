# Global Search — deep gap hunt on search algorithm (fuzzy + ranking) for regression confidence (2026-09-18)

Context: a serious search bug was fixed; the QA lead wants confidence it is fully fixed and that the
algorithm matches the spec 100%. This goes finer than FULL-COVERAGE-AUDIT-2026-09-18.md: it lists
sub-behaviours and BOUNDARY conditions in PRD 576978945 v1.5 §6/§7 that current cases assert only at a
coarse level. Fuzzy folder = C44839–49, C55713–15. Ranking folder = C44850–54, C45137–39, C55707–12,
C55716, C55722–23.

## The bug is SV-10211 — and we ALREADY have the regression test
SV-10211 (Story Defect under SV-9165 ranking engine, QA Complete / Passed 2026-09-18): a **prefix**
name match and a **whole-word** match were scored IDENTICALLY (`0.90000004`), so a name beginning with
the typed text was not lifted above one merely containing it (only the typo match, `0.45`, ranked
correctly last). Fix restores prefix (+0.70) > whole-word (+0.50) > fuzzy (+0.40) per §6.1.

**This is exactly what C55707 asserts** ("A prefix name match ranks above a whole-word match, which
ranks above a fuzzy match"). So the direct regression is already covered. TWO refinements make it
bullet-proof and match what the ticket taught:
- **Tighten C55707's preconditions to hold ALL other signals equal** between the competing records —
  same address/phone, no open work orders, not recently viewed — so nothing else can decide the order.
  The bug was only visible because the reporter controlled those; a looser C55707 could PASS for the
  wrong reason (another signal breaking the tie) and hide a re-regression. This is the key lesson.
- Keep C55722/C55723 (count magnitude; name-vs-secondary) which exercise adjacent scoring tiers.

## Finer FUZZY (§7) gaps — highest regression value
| # | Sub-behaviour in the spec | Covered? | Why it matters for a fixed bug |
|---|---|---|---|
| F-a | **Fuzzy is not over-greedy** — a clearly UNRELATED / too-different query returns NO fuzzy match (Jaccard <0.35 / similarity below threshold) | ❌ none | The classic "search suddenly returns garbage" regression. We test that typos DO match; nothing tests that non-matches DON'T. |
| F-b | **Diacritics/accents normalized** — "Jose" finds "José" and vice versa | ❌ none | Accent handling is a common breakage point; not exercised by any case. |
| F-c | **Hyphens/apostrophes optional in names** — "OBrien" finds "O'Brien"; "Smith Jones" finds "Smith-Jones" | ❌ none | Name normalization rule in §7, untested. |
| F-d | **Phonetic applies to NAMES ONLY** — a sound-alike match does NOT happen on a part number/description/identifier | ❌ none | §7 restricts phonetic to names; a bug could over-apply it and surface nonsense. |
| F-e | **Phonetic is last-resort and ranks BELOW a closer match** — when a trigram/near match and a sound-alike both exist, the closer one is higher | ⚠️ partial (C44842 says "likely lower") | Not a dedicated comparison. |

## Finer RANKING (§6) gaps
| # | Sub-behaviour | Covered? | Why it matters |
|---|---|---|---|
| R-a | **An exact identifier match always wins** — a typed exact ID pins ABOVE even a strong competing name match | ⚠️ partial (C44850 pins; no competing-strong-name compare) | If the fix touched the pin path, prove the exact-ID still beats a strong name match. |
| R-b | **A record ranked beyond the top 20 is NOT returned; narrowing the query surfaces it** (§6.1 last line + §5.2 cap) | ❌ none | Cap × ranking interaction — a bug here means the wanted record is unreachable. |
| R-c | **Recency decay direction across the entity-specific half-lives** (WO 14d, Part Sale 7d, PO 14d, VI 30d) | ⚠️ direction covered per entity (C44851/C45137/C45138/C55711); half-life magnitude not | Low priority; manual granularity can't measure a half-life precisely. |

## Recommendation
1. **Get the bug's exact symptom** and add ONE targeted regression case reproducing it (highest value).
2. Add the grounded finer cases — **F-a, F-b, F-c, F-d** (Fuzzy) and **R-a, R-b** (Ranking): 6 cases,
   same shape/standard, into Fuzzy Matching (6725) / Ranking and Prioritization (6726), added to run 415,
   not-yet-build-verified. F-e and R-c are low value at manual granularity — note, do not build.
This closes the algorithm coverage to the sub-behaviour level, which is what "100% per spec" requires
for a feature whose ranking/fuzzy logic was just changed.
