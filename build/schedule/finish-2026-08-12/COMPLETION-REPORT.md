# Schedule — completion report

**Every figure below was derived LIVE from TestRail and the running build. Read at
`2026-08-12T06:54:44Z`. Build `v3.5-65d6500`, unmoved all pass.**

| Measure | Figure | How it was derived |
|---|---|---|
| Cases — **ours / live** | **176 / 176** | every case under the group 4254 subtree (31 sections, paged); all ours, none foreign |
| **Source-verified** | **176 / 176** | every case carries its Rule-54 provenance line naming epic SV-8685 and the Schedule specification version 27 |
| **Build line naming the RUNNING build** | **76 / 176** | count of cases whose text names `v3.5-65d6500` |
| **Preconditions and steps ACTUALLY WALKED** | **19 this pass · 45–47 of 176 in total** | the honest, smaller number — see the note below |
| Labels checked against a live harvest | **176 / 176** | 758 visible strings and 297 test ids harvested across 20 surfaces |
| **Runnable / held** | **147 / 29** | live marker census |
| Marker arithmetic | **143 READY + 4 EXPECT-FAIL = 147**, and **176 − 29 HOLD = 147** | **closes both ways** |
| Suite hygiene | **0 unmarked · 0 doubled markers · 0 raw markup · 176/176 provenance lines** | live census |
| **Created** | 0 cases · 0 sections · 0 Jira issues | creation hold active |
| **Updated** | **3 cases**, each HTTP 200 + byte-verified, 30 fields compared, 0 mismatches | `testrail-execution-log.md` |
| **Deleted** | 0 | |
| Run 357 | **untouched, proven by content** — 176 tests, all 529 results present by id, 0 graded and 0 echo fields moved, 0 new results | read at 06:18:53Z and 06:54:01Z |

## The walked figure, stated strictly

**19 cases had every step carried out on this build this pass**, in two batches:
· batch 1 — C29941, C29944, C29946, C30008, C30037, C30042, C30046
· batch 2 — C29925, C29927, C29928, C29930, C29931, C29932, C29934, C29936, C29937, C29940, C29942, C43554

**5 more were partly driven:** C30015, C30047, C29933, C29948, C29954.

Earlier passes recorded **28** on this same build marker. **The union is between 45 and 47** — I
cannot rule out that one or two of mine were also among the earlier "dialog pass" fourteen, and I
would rather give you a range than a number I cannot defend.

**Three of the nineteen produced a result I will not stand behind as a verdict** — C43554 (confounded
by my own earlier probe), C29931 and C29942 (inconclusive). **Their STEPS were still carried out, so
they count as walked; their outcomes do not count as verdicts.** `RUNNABILITY.md` §7.

**The other ~129 cases have had their LABELS checked, not their steps carried out.** That distinction
is the whole point of this report and the two figures are never added together.

## What is left, itemised, with what each item waits on

| # | What is left | Waiting on | Effect if it stays open |
|---|---|---|---|
| 1 | **~129 cases whose steps have not been carried out** | worker time, nothing else — the estate, the session and the method all work | a tester meets an unrunnable step for the first time during the release run |
| 2 | **10 permission cases** — C30076, C30077, C30078, C30079, C30081, C30614, C38874, C38872, C38926 (part), C30044 | **three users, created and given their permissions BEFORE their cookies are minted.** The order matters: a permission change kills an existing session one way. Table in `DIVERGENCES.md` §A | the whole permission area of Schedule ships unobserved |
| 3 | **~11 drag-dependent cases** — the scope picker and multi-day spread | a drag our tooling cannot perform, and the click alternative was removed from the build ([SV-8957](https://shopview.atlassian.net/browse/SV-8957)) | unchanged from previous passes; correctly held |
| 4 | **`Set business hours for this shop`** (C38847) | one probe that reaches Settings → Locations → the pencil. **Not reached, and NOT recorded as absent** | one case unverified |
| 5 | **`Reset to template`** on a role's own screen (C38926) | the roles-list row click did not navigate. The other half — that the three-dot menu does **not** offer it — is confirmed | one case half-verified |
| 6 | **C30061's expected result** uses shorthand scope names | **your ruling.** An expected result is not ours to edit. One word and it is a two-minute change | the case reads oddly against the screen; nobody is stranded |
| 7 | **C30015 step 3 is a hazard as written** | **your ruling** on adding one warning sentence | a tester who picks a non-series block deletes it with no confirmation |
| 8 | **The Technician session is dead** | a fresh sign-in for `bilal.muzamil+schedule@shopview.com` | no Technician-perspective work is possible until it arrives |
| 9 | **Two playbook entries are owed** | a worker permitted to edit `build/APP-ACTIONS-PLAYBOOK.md` | the shift create/delete contract has now cost two shifts in two days because it lives only in incident reports |

## The one thing that would help most

**Item 2.** Three users, configured first and signed in second, unblock ten cases and the entire
permission area. Everything else on this list is either worker time or a one-line ruling from you.

## Honest limits

**The branch is not declared final, so every verdict here is provisional** (Rule 49), and **100 of
the 176 cases carry a verdict recorded against an earlier build** — under Rule 60 that is the
ordinary consequence of a branch that keeps moving, not an alarm, and each case says so in its own
text. **A Rule-49 re-check queue remains open.**
