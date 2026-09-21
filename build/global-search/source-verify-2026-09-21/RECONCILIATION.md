# Source re-read — 21 September 2026, on the QA lead's go-ahead (Rule 81)

**He asked for the requirements to be re-read before the run.** Done, live, once for the whole pass
(Rule 106: one gated fetch per pass, then every case checked against that single read).

## Result: THE DOCUMENT HAS NOT CHANGED SINCE 17 SEPTEMBER

| | |
|---|---|
| Page | **Global Search - Product Requirements**, Confluence page **576978945** |
| Version read live today | **17** |
| Last edited | **2026-09-08** (author `712020:1f21c…` — Branko) |
| Version at our last read | **17**, read 17 September |
| Content | **byte-equivalent after whitespace normalisation**, similarity 0.9994 |

The only two textual differences are **extraction artefacts of the two different flatteners**, proved
by re-extracting with link and macro nodes included:

| Old extract (17 Sep) | Today's extract | What it actually is |
|---|---|---|
| `CompleteGreen` | `Complete` | a status macro; the old flattener concatenated its **colour** onto its text. Status is **Complete** in both. |
| `SV-9160267fb633-cc25-3f2d-8011-7f1e9199ad21System Jira` | `https://shopview.atlassian.net/browse/SV-9160` | a Jira macro; the old flattener emitted its internal id, mine emits the link. **Same issue.** |

**A caught extraction bug, recorded because it nearly produced a false "unchanged".** My first
flattener walked only `text` nodes, so it silently dropped every **link, inlineCard and status**
node — the three `claude.ai/design` links vanished from the extract and the diff still read
"0.9993 similar". Fixed before any conclusion was drawn; today's extract carries all three design
links, same as the 17 September copy. **This is skill 20's rule applied to a document instead of a
screen: what my tool returned was not what the page contains.**

## Scope of this read (Rule 57 list)

- **Spec / PRD** — re-read live today, unchanged (above).
- **The epic's stories** — read live today: **SV-9167 · SV-9169 · SV-9173 · SV-9306 · SV-9310 are
  OBSOLETE/Done**; SV-9168, SV-9170, SV-9171, SV-9174 are TESTING QA; SV-9309 is Code Review.
- **The design** — the PRD carries **3** `claude.ai/design` links, present and identical in both
  extracts. The share pages themselves are undated and editable, so they cannot be version-diffed
  (CLAUDE.md §5); not walked this pass, and no claim is made about them.
- **Newer written statement** — the QA lead's instruction of 21 September excluding sections 6767,
  6769, 6774 and 8056, which sets the yardstick to the written requirements alone (**GENERAL
  scope**, Rule 110).

## What this means for the run

Every verdict in this pass reconciles against **PRD page 576978945 version 17, read live
21 September 2026**. No case may be judged against memory or against an extract (Rule 106), and no
Expected is edited whatever the reconciliation shows (Rule 114).

Files: `spec-576978945-2026-09-21.txt` (today's extract, 27,139 chars) ·
`../source-verify-2026-09-17/spec-576978945-v17-2026-09-17.txt` (the 17 September copy).
