# Pre-post bite-proof gate — production sanity, SV-10586 + SV-9568 (Standing Rule 72)

Run 2 October 2026.

| # | Check | Result |
|---|---|---|
| 1 | **Build marker read live, start and end** | `v26.40.3-df33ae5`, last-modified Fri, 02 Oct 2026 08:16:28 GMT, etag `W/"99ac97b5aea2c0dfac02e328342c0494"` — **identical both times**, no redeploy under the pass |
| 2 | **Both tickets re-read live** | SV-10586 and SV-9568 both **Done**, resolved 2026-10-02 |
| 3 | **Every figure traces to a live measurement this pass** | preference-write counts (3), stored preference bodies, header counts (14 / 11), chip text, row counts (4 / 10), role column values, and the saved-preference reads at each of the five steps |
| 4 | **Named test data confirmed live** | roles page counts read live (Admin 10, Technician 4); every row's Role column read, not assumed |
| 5 | **Exhibits** | 2 built. Geometry captured **in the same page state as each screenshot** — the first attempt took the Role-column rect from a page with no rows and the box landed in the wrong place; re-captured per state and verified (Role column x = 1147 with 10 rows, 1121 with 4 rows, 935 when empty) |
| 6 | **Before/after honesty** | the SV-9568 before-half is a real production capture from 1 Oct on `v26.40.2-95f3172`, not a reconstruction; same environment, same screen, same action |
| 7 | **Every observation bucketed** (Rule 93) | 2 observations, both "explained, not a defect"; both tickets searched for related work first |
| 8 | **Environment restored** | Staff filter restored to its exact original value; parts columns back to all 14 visible. The parts record cannot be returned to `null` and that is stated rather than glossed |
| 9 | **Human voice / no AI fingerprint** | reader-facing text scanned — clean |
| 10 | **Format** | verdict first; no "Technical details for developers" section unless approved per ticket (Standing Rule 84) |

Outcome: clear. One self-caught annotation error, fixed before anything left the repo.
