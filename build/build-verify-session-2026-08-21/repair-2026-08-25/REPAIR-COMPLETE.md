# REPAIR COMPLETE — the 5 cases my writes damaged now render correctly

**QA lead approved 2026-08-25 ("Approve Item 1 now").** Repaired through the TestRail web editor,
verified from the rendered page a tester actually sees.

## RESULT — 5 of 5 CLEAN

| Case | Project · run | Container now | Literal tags visible | Verdict |
|---|---|---|---|---|
| [C44874](https://shopview.testrail.io/index.php?/cases/view/44874) | Global Search V2 · R415 | `markdown fr-view` ×3 | none | **CLEAN** |
| [C44875](https://shopview.testrail.io/index.php?/cases/view/44875) | Global Search V2 · R415 | `markdown fr-view` ×3 | none | **CLEAN** (see note) |
| [C45032](https://shopview.testrail.io/index.php?/cases/view/45032) | Inline Add/Edit Parts · R418 | `markdown fr-view` ×3 | none | **CLEAN** |
| [C45055](https://shopview.testrail.io/index.php?/cases/view/45055) | Inline Add/Edit Parts · R418 | `markdown fr-view` ×3 | none | **CLEAN** |
| [C45066](https://shopview.testrail.io/index.php?/cases/view/45066) | Inline Add/Edit Parts · R418 | `markdown fr-view` ×3 | none | **CLEAN** |

**The UI save is what ends the damage:** it moves each field from the escaping `markdown` container
into `markdown fr-view`, where stored HTML renders instead of being shown as text. That is why the API
could never fix it and the editor can.

**Approved content is intact:** `[q]` on C44875, `[typed text]` on C45055, `"Fib"` on C44874, and the
`(Tech View)` / `(Full View)` titles on C45032 / C45066. **No marker date moved** — no build was checked.
Every case still reads `AUTOMATION: Not available on Build to test Yet`, marker last.

**Note on C44875:** the editor auto-converted typed `1.` / `2.` prefixes into a real `<ol>` list, so
the rendered text no longer contains the literal characters "1." — **the tester sees numbering drawn
by the list markup instead**. Content identical, presentation slightly better. Recorded because a
naive text comparison flags it as a difference when nothing is wrong.

## HOW IT WAS DONE — REUSED, NOT REINVENTED (Rule 27)

Adapted from `build/report-suite/damage-2026-08-26/ui_repair_batch.mjs` (the route that repaired
**71 of 72** cases). Only the case list, the intended content and the credential source changed.

**Intended content came from MY OWN PRE-WRITE SNAPSHOTS**, not from what is stored now (that is the
damage) and not from the API — the original plain text plus only the QA-lead-approved substitutions.
The builder refuses to run if a snapshot already contains a tag, or if an approved substring is
missing (`build_intended.py`).

**Two mechanics worth carrying forward:**
- **The bridge needs a cert first.** `bridge.mjs` died with `ENOENT /tmp/atlassian/mitm.key`; the
  `openssl req -x509 …` step is in `build/ATLASSIAN-JIRA-ACCESS-METHOD.md` line 83. **Add
  `DNS:*.testrail.io` to the SAN** — the documented command only covers `*.atlassian.net`.
- **UI login uses the ACCOUNT password, not the API key.** In this container they are two different
  secrets (`/tmp/testrail/creds-ui.json` vs `/tmp/testrail/creds.json`); the API key authenticates the
  REST API but **not** the web session.

## TWO FALSE ALARMS OF MY OWN, RECORDED SO THEY ARE NOT RE-DERIVED

1. **"Still on the edit page after Save" is not a failed save.** C44875 and C45055 both reported it,
   with a **302** on the save POST — a successful redirect. Both had in fact saved. The proven script
   already warns that the redirect lags `networkidle`; the residual case is that the URL check can
   still fire on a landed save. **Verify from the case, never from the navigation.**
2. **A regex over the whole view page reports false damage.** Counting every `div[class^=markdown]`
   picks up containers that carry ids (`addCommentComment_display`, `requirements_display`) **and the
   change-history the UI save itself adds** — which renders the OLD value, tags and all. My crude
   scanner therefore "found" tags on cases that were already clean. **Only the ANONYMOUS containers,
   first three in document order, are the case's fields** — as the proven script says. **A verifier
   that reads more of the page than the fields will manufacture findings.**
3. **"Stored value contains a tag" is NOT a defect on an `fr-view` case.** It is the normal, correct
   state — that container renders HTML. My first verifier gated on it and reported 0 of 5 clean when
   the true answer was 4 of 5. **Gate on what the tester READS, never on what is stored.**

## WRITES

**5 UI saves, one per case, all approved.** No API `update_case`. No `add_case`, no `delete_case`, no
run write, no result write, no Jira. `custom_atmstatus` unchanged on all five (all `1`); titles
unchanged by the repair.
