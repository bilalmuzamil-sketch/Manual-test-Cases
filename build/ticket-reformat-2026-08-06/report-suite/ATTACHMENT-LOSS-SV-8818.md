# One attachment was destroyed by the first write, and it is not recoverable

**Read this first, because it is the one thing this pass did that cannot be undone.**

## What happened

The first reformat write to **[SV-8818](https://shopview.atlassian.net/browse/SV-8818)** deleted the
attachment **`image-20260804-061644.png`** (attachment id `59255`, media id
`4aec0119-0131-4ead-a82d-b460af9b6309`). It is gone from Jira and we do not hold a copy.

## Why

That image was a **pasted screenshot**, so it lived as an **embedded** attachment — an attachment whose
only reason to exist is the media reference inside the description. The old description referenced it;
the new five-part description did not. **Jira deleted the file when its last reference was removed.**

## It is not in the changelog — at all

The SV-8818 changelog for that moment records exactly one item: `description`. **There is no attachment
entry.** So the loss is provable only because the write was byte-verified against a pre-write snapshot
(Standing Rule 50). Read from Jira's own history alone, nobody could reconstruct that a file had ever
been there. This is the same class of silent, unlogged loss as the Product Area wipe recorded against
Rule 52.

Evidence:

| | |
|---|---|
| pre-write snapshot | **`snapshots/working-set.json` — 6 attachments, including `59255`.** ⚠️ **Corrected 2026-08-06:** this row used to cite `snapshots/pre-write/SV-8818.json`, and **that file holds 5, not 6** — SV-8818 was written twice (the failed write, then the repair) and the second write overwrote it with the post-loss state. `working-set.json` was committed **before any write** and is the true baseline. The finding is unchanged; only the citation was wrong. |
| the destroyed picture's own reference | `snapshots/pre-edit/SV-8818.adf.json` — still contains the `media` node `4aec0119-0131-4ead-a82d-b460af9b6309` |
| post-write snapshot | `snapshots/post-write/SV-8818.json` — 5 attachments, `59255` absent |
| live re-read | `GET /rest/api/3/attachment/59255` → **HTTP 404** *"The attachment with id '59255' does not exist"* |
| changelog | one `description` item at `2026-08-06T08:25:43`, nothing about an attachment |

## What was done about it

1. **The batch stopped immediately**, as Rule 50 requires — the verification returned FAIL and the
   remaining five writes in that batch did not run.
2. **Recovery was attempted and failed.** The attachment record is deleted, so no signed media URL can
   be obtained; there is no copy in the repository and none in `/tmp` (the earlier upload log covers
   only the evidence files `59227`–`59249`, not pasted screenshots).
3. **The method changed for every remaining ticket:** every existing media node is now carried forward
   into the new description. Proven on SV-8823 — the media node came back byte-identical and the
   attachment list did not move.
4. **SV-8818 now carries a different image inline**, `parts-velocity-download-menu.png` (`59251`), which
   was already attached to the ticket and had never been referenced. It shows the download menu the
   steps use. That does not replace what was lost; it is what the ticket can honestly show today.

## What is owed

**One screenshot for SV-8818** — the PDF download failing on Parts Velocity — to be taken when a QA
session is available again. Recorded in `IMAGES-OWED.md`.

## The durable lesson, for the playbook

> **Rewriting a Jira description DELETES any pasted/embedded image whose media node you drop, and the
> deletion is NOT written to the changelog.** Before rewriting a description, list the media nodes in
> the current ADF and carry every one of them into the new body. Verify by comparing the `attachment`
> field pre and post — a description-only edit must leave it byte-identical.

**✅ NOW FOLDED INTO `build/APP-ACTIONS-PLAYBOOK.md` § J as DECLARED HAZARD #4 (2026-08-06)**, with
the working method (lift every existing `mediaSingle` / `mediaGroup` node **verbatim**, then refuse to
write at all if the new body would drop one), the reusable auditor and writer, and one extra fact
verified live: **the changelog records an attachment being ADDED but never being DELETED.** A pointer
was also added at the top of the "Filing a defect ticket" section so a Jira-focused reader meets the
hazard before touching a description.

**And the guarantee the QA lead asked for now exists as evidence, not assertion:** all **92** tickets
across both reformat passes were compared attachment by attachment, **by id**, against pre-write
baselines — **46 before, 45 now, this one loss, 0 renamed, 0 broken references.** See
[`../attachment-audit/ATTACHMENT-VERIFICATION.md`](../attachment-audit/ATTACHMENT-VERIFICATION.md).
