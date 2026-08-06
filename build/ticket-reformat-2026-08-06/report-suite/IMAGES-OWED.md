# Images — what is on the tickets now, and exactly what is owed when a QA session returns

The QA lead asked for inline images **on new tickets**. This pass filed no new tickets — it is a reformat —
and **no screenshot could be taken today**: the shared QA sign-in expired estate-wide at about 11:37Z, and
`quick-login` is itself SSO-gated and answers 401. **`quick-login` and `switch-user` were not called.**

So the instruction was met the only way it could be: **where a ticket already had an image attached, that
image is now referenced inline in the description at the point it helps** — inside *Current behaviour*,
with a one-line caption.

## What is inline now (verified in the rendered description, not just in the payload)

| Ticket | Image now inline | Where it sits |
|---|---|---|
| [SV-8818](https://shopview.atlassian.net/browse/SV-8818) | `parts-velocity-download-menu.png` (attachment 59251) | Current behaviour — the download menu the steps use |
| [SV-8820](https://shopview.atlassian.net/browse/SV-8820) | `image-20260804-063045.png` (59256) and `image-20260804-063240.png` (59257) | Current behaviour — the two wrong "As of" dates |
| [SV-8823](https://shopview.atlassian.net/browse/SV-8823) | `inventory-value-screen-column-order.png` (59254) | Current behaviour — the on-screen column order the file disagrees with |
| [SV-8879](https://shopview.atlassian.net/browse/SV-8879) | `sales-by-customer-single-location-chooser.png` (59340) | Current behaviour — the chooser shown to a single-location user |

Every other attachment on those tickets is an evidence file (JSON, JSONL, Markdown), not an image. Those
**remain attached and were deliberately not inlined** — the format has no evidence section any more, and an
inline JSON file helps nobody.

## The one image that is gone, and it was this pass that destroyed it

**[SV-8818](https://shopview.atlassian.net/browse/SV-8818) has lost `image-20260804-061644.png`
(attachment 59255).** It was a pasted screenshot, so it lived only as long as the description referenced it,
and the first write dropped that reference. Jira deleted the file and **logged nothing**. It is not
recoverable — the attachment record is gone, so no media URL can be obtained, and there is no copy in the
repository or in `/tmp`.

Full account, with the evidence and the durable lesson:
[`ATTACHMENT-LOSS-SV-8818.md`](ATTACHMENT-LOSS-SV-8818.md).

## What is owed, and the exact steps for whoever has a session

**One screenshot, for SV-8818.** Everything else is in place.

1. Sign in at `https://sv8582.qa.shopview.com` as an Admin.
2. Open Reports → Parts Velocity. Set the date range to **This Year**, select the single location
   **Staging Heavy Duty - 9919**, and type **HO** into the report's search box, which brings the view to
   449 rows with all twenty columns on.
3. Open the three-dot menu and choose the **PDF** download. Wait about thirty seconds for the failure.
4. Screenshot **the error message**, with the report and the toolbar visible behind it.
5. Attach it to SV-8818 and reference it inline in *Current behaviour*, immediately after the paragraph
   that begins *"No file is produced."*

**How to inline it without repeating the mistake** — the media id is not the attachment id, and it is only
exposed on the redirect from `/rest/api/3/attachment/content/{id}`. `tools/media.py` resolves it (it keeps
the UUID and never the signed token). Then send the whole description again, with a `mediaSingle` node
carrying that UUID, and **byte-compare the `attachment` field before and after** — a description-only edit
must leave it untouched.

## Two images worth adding later, but not owed

- **[SV-8819](https://shopview.atlassian.net/browse/SV-8819)** already has `parts-velocity-turns-per-year-column.png`
  attached and never referenced. It is a **closed** ticket and was not rewritten, so nothing was done to it.
  Its media id is resolved and recorded in `snapshots/media-ids.json` if it is ever reformatted.
- **The 56 Story Defects have no images at all.** Most describe a wording, an order, a colour or a file's
  contents, where a screenshot adds little to a named step. If the POs ask for images across the board, the
  ones that would genuinely gain are the four visual ones — SV-8965, SV-8970, SV-8980 (table colours and
  alignment) and SV-8988 (the muted Estimates figure).
