# Execution log — ticket reformat, Filters and Schedule, 2026-08-06

One row per operation. Standing Rule 50: `204 No Content` on its own is not a
verification, so every row carries what was compared and what the comparison found.

**Sources read at pass start 2026-08-06 ~11:55Z and RE-READ at write start
2026-08-06 13:26:51Z (Standing Rule 59). Verdict of the second read: UNCHANGED —
Filters still Confluence v19, Schedule still v25.**

Every write was `PUT /rest/api/3/issue/{key}` with an ADF body carrying **only**
`description`. No other field was sent on any request.

| # | Operation | Ticket | HTTP | Fields compared | Fields moved | Description vs payload | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | PUT description | [SV-8959](https://shopview.atlassian.net/browse/SV-8959) | 204 | 317 | 0 | byte-identical | VERIFIED |
| 2 | PUT description | [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | 204 | 514 | 1 | byte-identical | **MISMATCH — batch stopped** |
| 3 | verify only (re-check after the batch stop) | [SV-8959](https://shopview.atlassian.net/browse/SV-8959) | n/a (verify-only) | 317 | 0 | byte-identical | VERIFIED |
| 4 | verify only (re-check after the batch stop) | [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | n/a (verify-only) | 514 | 0 | byte-identical | VERIFIED |
| 5 | PUT description | [SV-8846](https://shopview.atlassian.net/browse/SV-8846) | 204 | 412 | 0 | byte-identical | VERIFIED |
| 6 | PUT description | [SV-8871](https://shopview.atlassian.net/browse/SV-8871) | 204 | 476 | 0 | byte-identical | VERIFIED |
| 7 | PUT description | [SV-8912](https://shopview.atlassian.net/browse/SV-8912) | 204 | 346 | 0 | byte-identical | VERIFIED |
| 8 | PUT description | [SV-8848](https://shopview.atlassian.net/browse/SV-8848) | 204 | 280 | 0 | byte-identical | VERIFIED |
| 9 | PUT description | [SV-8849](https://shopview.atlassian.net/browse/SV-8849) | 204 | 366 | 0 | byte-identical | VERIFIED |
| 10 | PUT description | [SV-8850](https://shopview.atlassian.net/browse/SV-8850) | 204 | 316 | 0 | byte-identical | VERIFIED |
| 11 | PUT description | [SV-8851](https://shopview.atlassian.net/browse/SV-8851) | 204 | 324 | 0 | byte-identical | VERIFIED |
| 12 | PUT description | [SV-8852](https://shopview.atlassian.net/browse/SV-8852) | 204 | 324 | 0 | byte-identical | VERIFIED |
| 13 | PUT description | [SV-8853](https://shopview.atlassian.net/browse/SV-8853) | 204 | 291 | 0 | byte-identical | VERIFIED |
| 14 | PUT description | [SV-8854](https://shopview.atlassian.net/browse/SV-8854) | 204 | 281 | 0 | byte-identical | VERIFIED |
| 15 | PUT description | [SV-8855](https://shopview.atlassian.net/browse/SV-8855) | 204 | 281 | 0 | byte-identical | VERIFIED |
| 16 | PUT description | [SV-8856](https://shopview.atlassian.net/browse/SV-8856) | 204 | 277 | 0 | byte-identical | VERIFIED |
| 17 | PUT description | [SV-8857](https://shopview.atlassian.net/browse/SV-8857) | 204 | 438 | 0 | byte-identical | VERIFIED |
| 18 | PUT description | [SV-8886](https://shopview.atlassian.net/browse/SV-8886) | 204 | 656 | 0 | byte-identical | VERIFIED |
| 19 | PUT description | [SV-8924](https://shopview.atlassian.net/browse/SV-8924) | 204 | 434 | 0 | byte-identical | VERIFIED |
| 20 | PUT description | [SV-8933](https://shopview.atlassian.net/browse/SV-8933) | 204 | 501 | 0 | byte-identical | VERIFIED |
| 21 | PUT description | [SV-8941](https://shopview.atlassian.net/browse/SV-8941) | 204 | 424 | 0 | byte-identical | VERIFIED |
| 22 | PUT description | [SV-8942](https://shopview.atlassian.net/browse/SV-8942) | 204 | 352 | 0 | byte-identical | VERIFIED |
| 23 | PUT description | [SV-8957](https://shopview.atlassian.net/browse/SV-8957) | 204 | 383 | 0 | byte-identical | VERIFIED |
| 24 | PUT description | [SV-8958](https://shopview.atlassian.net/browse/SV-8958) | 204 | 305 | 0 | byte-identical | VERIFIED |

## The one stop, and what it was

The batch **did stop once**, exactly as Rule 50 requires, on the first attempt at
**SV-8845**. The description had written correctly (`204`, byte-identical to the
payload) but the sweep found one field moved: `lastViewed`.

It was not ours, and it was not waved away as noise. It was probed first
(`snapshots/lastviewed-probe.json`):

- SV-8843 has been read by us 5+ times today and its `lastViewed` has not moved off
  `2026-08-05T12:31:46.607-0500`.
- SV-8959 was read **and written** by us today and its `lastViewed` is still null.
- So neither a REST `GET` nor our `PUT` sets it.
- SV-8845's moved to `2026-08-06T08:20:05.198-0500` (13:20:05Z) — nine minutes after
  Stefan Mitrovic raised its priority and about seven minutes **before** our write.

**Conclusion: somebody opened SV-8845 in the Jira web UI under this shared account**
**during the pass.** `lastViewed` is per-user metadata and not part of the issue's
content, so it is excluded from the comparison — with that evidence recorded, and the
browser view reported here rather than absorbed.

### A second, later `lastViewed` movement -- in the other direction

On the final re-check run, **SV-8854's `lastViewed` went from a value to `null`**
(`2026-08-04T22:07:56.392-0500` -> `null`). Nothing wrote to that ticket between the
two reads. So the field is not merely set outside our control -- it is **cleared**
outside our control too. That strengthens rather than weakens the exclusion: a field
that can spontaneously empty itself is plainly not part of the issue's content. It is
recorded here because an unexplained change noticed and then not mentioned is the same
failure as one never noticed.

## ADF normalisation: none

TestRail's `update_case` re-renders any text field you omit; Jira's issue API did not
do anything of the kind here. All 22 descriptions came back **byte-identical to the
payload including `localId`**, which we never sent and Jira never minted. The
`localId`-stripping safety net in `tools/rewrite.py` never fired. Recorded because a
normalisation that does not exist is worth knowing as precisely as one that does.

## Final exhaustive re-check (`snapshots/final-audit.json`)

- all **22** rewritten tickets re-read live and re-verified: **22 pass / 0 fail**
- description compared **raw, including `localId`**: 22 of 22 exact
- structural shape check — the five headings, in order, a line break before Source, an
  Environment line immediately before one numbered list, and no surviving old-format
  heading: **22 of 22 clean**
- twelve named critical fields checked by name as well as by sweep (type, type id,
  parent, priority, status, resolution, Product Area, labels, assignee, summary, links,
  attachment ids): **0 changes across all 22**
- the **5** closed tickets proven byte-identical to
  their pre-edit snapshot **including `updated`**, which is what proves we did not
  write to them: 5 of 5 untouched

### An honest note about this log's own checker

The first run of the shape check reported **3 failures** on SV-8851, SV-8852 and
SV-8941 for an old-format section called `test data`. It was wrong: it scanned the
whole document instead of the headings, and matched our own steps saying *"Check the
test data first"* and *"no extra test data is needed"* — wording Standing Rule 50
asks for. **The checker was corrected, not the tickets**, and the fault is recorded
here rather than quietly removed.

## What was NOT done

- **0 writes to anybody else's ticket.**
- **0 TestRail calls of any kind** — sibling workers are live in those cases.
- **0 changes to type, parent, priority, status, links, labels, assignee or Product
  Area**, on any ticket, including the nine Mudassir Qamar converted and SV-8848 whose
  parent he deliberately removed (Standing Rule 53's corollary).
- **0 screenshots taken** — the shared QA sign-in expired estate-wide at ~11:37Z and
  `quick-login` was never called. See `IMAGES-OWED.md`.
- **0 tickets reopened**, including the three closed ones our records say still
  reproduce.

