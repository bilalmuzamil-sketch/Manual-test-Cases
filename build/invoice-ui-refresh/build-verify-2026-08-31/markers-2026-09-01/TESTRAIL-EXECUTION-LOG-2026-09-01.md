# TestRail execution log — Invoice UI Refresh marker push, 1 September 2026

**Authorised by the QA lead** on 2026-09-01 ("1. Approved", re-confirmed "1. Push").
**Write path:** the TestRail **web editor** driven by Playwright, never the API — an API write leaves
the fields in the escaping container and the tester reads raw tags (CLAUDE.md §5, playbook §J).
**Rule 71:** all eight cases re-read immediately before writing; every one `custom_atmstatus = 1`
(not Automated), so nothing was held and no Rule 65 report to Vlad is owed for this push.

## What changed on each case

| Field | Change |
|---|---|
| `custom_preconds` | Rewritten as a UI route a layman can follow (skill 18) |
| `custom_steps` | Rewritten the same way |
| `custom_expected` | **Requirement lines byte-for-byte unchanged (Rule 57)** and provenance sentence 1 byte-for-byte unchanged (Rule 54). Only: the false *"could not be build-verified"* line removed, sentence 2 set, marker set |

## Result — 8 of 8 applied and verified

| Case | Marker now | HTTP | Containers |
|---|---|---|---|
| [C44923](https://shopview.testrail.io/index.php?/cases/view/44923) | `AUTOMATION: READY` | 200 | 3 × `markdown fr-view` |
| [C44947](https://shopview.testrail.io/index.php?/cases/view/44947) | `AUTOMATION: READY` | 200 | 3 × `markdown fr-view` |
| [C44987](https://shopview.testrail.io/index.php?/cases/view/44987) | `AUTOMATION: READY` | 200 | 3 × `markdown fr-view` |
| [C45190](https://shopview.testrail.io/index.php?/cases/view/45190) | `AUTOMATION: READY` | 200 | 3 × `markdown fr-view` |
| [C45191](https://shopview.testrail.io/index.php?/cases/view/45191) | `AUTOMATION: READY` | 200 | 3 × `markdown fr-view` |
| [C45196](https://shopview.testrail.io/index.php?/cases/view/45196) | `AUTOMATION: READY` | 200 | 3 × `markdown fr-view` |
| [C45197](https://shopview.testrail.io/index.php?/cases/view/45197) | `AUTOMATION: READY` | 200 | 3 × `markdown fr-view` |
| [C45185](https://shopview.testrail.io/index.php?/cases/view/45185) | `AUTOMATION: HOLD - this case fails on a server error that has no ticket yet; change to READY - EXPECT FAIL (SV-xxxx) once the ticket is filed` | 200 | 3 × `markdown fr-view` |

Every write was verified before being logged as done: `atmstatus`, `section_id` and `refs`
unchanged; all three fields served from `markdown fr-view` (not the escaping container); rendered
text equal to the intended text character for character; no literal tags or HTML entities visible;
exactly one `AUTOMATION:` marker, and it is the exact string above; provenance sentence 1
unaltered; sentence 2 present and exactly `Last checked against build v26.35.5-8c3cc21 on 9/1/2026.`

**C45185 is a HOLD, not READY.** It FAILS on the build, and the marker convention's failing form is
`READY - EXPECT FAIL (SV-xxxx)`, which needs a ticket number. The Jira hold stands and the QA lead
said not to file it now, so a HOLD carrying the reason and its own clearing instruction is the only
honest literal available. Being a HOLD, it is excluded from the ready-to-automate arithmetic.

## Two write failures, and what they actually were

Three saves came back with the browser still on the edit page after a 302. The recorded cause is the
editor's one-shot token, so the first two looked routine. **C45197 failed twice, which is not a race**
— so a page-state dump was added to the writer instead of retrying blind, and it named the real
cause immediately:

> `Deadlock found when trying to get lock; try restarting transaction`

A database deadlock, genuinely retryable — the next attempt succeeded. The same dump also surfaced
`Title is too long`, which is a **latent validation template in the DOM, not a live error**: C45197's
title is 69 characters. Recorded so the next session does not chase it.

**Lesson folded into the writer:** when one case fails twice the same way, dump the page rather than
retrying — "flake" is not a root cause (skill 03).

## Two titles exceed the ≤ ~80 character convention

Not changed (out of scope for this push) — [C45190](https://shopview.testrail.io/index.php?/cases/view/45190) at **99**
and [C45185](https://shopview.testrail.io/index.php?/cases/view/45185) at **89**. They will truncate
on the case page. Say the word and they are a one-line fix.
