# Was any other image lost? No. Ticket by ticket, by attachment id.

**The short answer, and it is the one the QA lead asked for: exactly one attachment was destroyed all day, and it is the one already reported on [SV-8818](https://shopview.atlassian.net/browse/SV-8818). Every other attachment on every other ticket is present, by id.**

This was a guarantee that had to be earned rather than given. Both reformat passes kept snapshots taken **before any write**, so the question is checkable: what was attached then, and what is attached now.

## What was compared, and how

| | |
|---|---|
| Tickets audited | **92** — the whole population of both passes |
| Of those, rewritten | **84** |
| Attachments before any write | **46** |
| Attachments now | **45** |
| Missing now | **1** — the single SV-8818 screenshot |
| Renamed or swapped | **0** |
| Body references pointing at nothing | **0** |

**Compared by attachment id and filename, never by count** (Standing Rule 50). A count match can hide a swap: two attachments could be exchanged and the total would still read the same. So each id was looked for individually, in both directions, and each surviving id's filename was compared with the filename it had before.

The baselines, both committed to git before the writes they are being used to check:

- **Report Suite** — `report-suite/snapshots/working-set.json`, the live population read at the start of that pass. It holds the attachment list for all 65 tickets, and it is the file that still records the SV-8818 screenshot as present.
- **Filters and Schedule** — `filters-schedule/snapshots/pre-edit/<KEY>.json`, a full issue read per ticket taken before that pass wrote anything.

**One correction to the earlier account.** `ATTACHMENT-LOSS-SV-8818.md` cites `snapshots/pre-write/SV-8818.json` as showing six attachments. It shows **five**, because SV-8818 was written twice — the failed write and then the repair — and the second write overwrote that file with the state after the loss. **The loss is still fully provable**, from `working-set.json` (six attachments, including `59255`) and from the pre-edit copy of the old description, which still contains the destroyed picture's reference. Nothing about the finding changes; the citation in that document was pointing at the wrong file.

## Every ticket that has ever had an attachment

The other tickets have no attachments at all, before or after, so there is nothing to lose on them — that is 79 of the 92. The 13 that do are listed here in full.

| Ticket | Rewritten | Before | Now | Missing | Every id matches | Pictures shown in the body |
|---|---|---|---|---|---|---|
| [SV-8818](https://shopview.atlassian.net/browse/SV-8818) | yes | 6 | 5 | `59255` image-20260804-061644.png | no — see below | 1 of 1 |
| [SV-8819](https://shopview.atlassian.net/browse/SV-8819) | yes — later, as a closed ticket | 6 | 6 | — | yes | 0 of 1 |
| [SV-8820](https://shopview.atlassian.net/browse/SV-8820) | yes | 7 | 7 | — | yes | 2 of 3 |
| [SV-8821](https://shopview.atlassian.net/browse/SV-8821) | yes — later, as a closed ticket | 6 | 6 | — | yes | 2 of 2 |
| [SV-8822](https://shopview.atlassian.net/browse/SV-8822) | yes — later, as a closed ticket | 3 | 3 | — | yes | none attached |
| [SV-8823](https://shopview.atlassian.net/browse/SV-8823) | yes | 4 | 4 | — | yes | 1 of 1 |
| [SV-8844](https://shopview.atlassian.net/browse/SV-8844) | yes — later, as a closed ticket | 3 | 3 | — | yes | 2 of 3 |
| [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | yes | 3 | 3 | — | yes | 2 of 3 |
| [SV-8846](https://shopview.atlassian.net/browse/SV-8846) | yes | 2 | 2 | — | yes | 2 of 2 |
| [SV-8847](https://shopview.atlassian.net/browse/SV-8847) | yes — later, as a closed ticket | 1 | 1 | — | yes | 0 of 1 |
| [SV-8857](https://shopview.atlassian.net/browse/SV-8857) | yes | 2 | 2 | — | yes | 0 of 2 |
| [SV-8871](https://shopview.atlassian.net/browse/SV-8871) | yes | 2 | 2 | — | yes | 0 of 2 |
| [SV-8879](https://shopview.atlassian.net/browse/SV-8879) | yes | 1 | 1 | — | yes | 1 of 1 |

## The pictures inside the descriptions, compared attribute by attribute

Presence is not enough — a picture can survive as a file and still be broken in the body. So every media reference in every description was compared with the reference that stood there before the rewrite.

**12 references were carried through a rewrite, and 8 of them are byte-identical.** The other 4 point at exactly the same file — the file reference itself never changed, which is what protects the picture — but lost their display size or changed their alignment. That is worth saying plainly rather than rounding to "preserved":

| Ticket | Picture | What changed |
|---|---|---|
| [SV-8820](https://shopview.atlassian.net/browse/SV-8820) | `22fd1dc5…` image-20260804-063045.png | its set display size was dropped, so it now renders at its natural size; an internal editor id was dropped (no visible effect) |
| [SV-8820](https://shopview.atlassian.net/browse/SV-8820) | `80bf7126…` image-20260804-063240.png | its set display size was dropped, so it now renders at its natural size; an internal editor id was dropped (no visible effect) |
| [SV-8823](https://shopview.atlassian.net/browse/SV-8823) | `64865b81…` (no label) | its set display size was dropped, so it now renders at its natural size; a filename label was added |
| [SV-8879](https://shopview.atlassian.net/browse/SV-8879) | `774cf1c3…` (no label) | its set display size was dropped, so it now renders at its natural size; a filename label was added |

**None of that risks a file** and none of it is a loss. It happened because the Report Suite pass rebuilt each picture reference from scratch, while the Filters and Schedule pass lifted the original reference out verbatim. **Lifting it verbatim is the better method**, it is what the closed-ticket writes used, and their two pictures came back byte-identical. On SV-8820 the two pasted screenshots now show at full size instead of the width the author had set, and on SV-8823 and SV-8879 one picture each moved from centred to left-aligned. Cosmetic, reversible, and reported rather than absorbed.

## The four images and the two recordings the Filters and Schedule pass reported keeping

That pass said it kept four inline images byte-for-byte and named two dangling videos in **words**. **Both halves check out.**

| | |
|---|---|
| [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | its two pictures, `79cea153…` and `7d8081e6…`, are still shown in the body and their references are **byte-identical**, including the exact pixel widths 412 and 402 the author had set |
| [SV-8846](https://shopview.atlassian.net/browse/SV-8846) | its two pictures, `8922699b…` and `c0e48765…`, likewise still shown, references **byte-identical** |
| [SV-8857](https://shopview.atlassian.net/browse/SV-8857) | both recordings are still attached — `Reproduced on QA - 8857.mp4` and `Verified in QA.mp4` — and the body names them in plain words, verified by reading the live text: *“Two screen recordings made by Ayesha Khan are attached to this ticket…”* |

So the four images are confirmed, and the two recordings are confirmed both as files and as the sentence that describes them.

**And there were more preserved than that pass claimed**, because the Report Suite half also carried pictures through: [SV-8820](https://shopview.atlassian.net/browse/SV-8820) kept two pasted screenshots in its body, and [SV-8823](https://shopview.atlassian.net/browse/SV-8823) and [SV-8879](https://shopview.atlassian.net/browse/SV-8879) one each.

## The one loss, re-confirmed from Jira itself

Asking Jira directly for the destroyed attachment returns **HTTP 404** — *“The attachment with id '59255' does not exist”*. It is not hidden, not moved and not recoverable.

On [SV-8818](https://shopview.atlassian.net/browse/SV-8818) a different picture that was already attached and had never been shown, `parts-velocity-download-menu.png`, is now shown in the body instead. That does not replace what was lost; it is what the ticket can honestly show today.

## How to re-run this

```
python3 attachment-audit/tools/audit.py        # every ticket, by attachment id
python3 attachment-audit/tools/media_exact.py  # every picture reference, attribute by attribute
python3 attachment-audit/tools/gen_report.py   # this document
```

Read-only against Jira. No TestRail call of any kind was made by any of it. Evidence: `snapshots/attachment-audit.json`, `snapshots/media-exactness.json`, and a full live copy of each of the 92 issues in `snapshots/live/`.

*Audited 2026-08-06. Re-run unchanged after the eight closed tickets were rewritten, so the guarantee covers those writes too.*
