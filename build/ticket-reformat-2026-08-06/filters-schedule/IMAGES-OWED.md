# Images — what exists, what was made inline, and what is owed

## Why nothing was captured in this pass

Inline images were asked for on **new** tickets. This pass filed nothing — it reformatted 22
existing tickets — so no new capture was in scope.

It also could not have taken one. **The shared QA sign-in expired estate-wide at about
11:37Z today**, and `quick-login` is itself SSO-gated and returns 401. Per the brief,
**neither `quick-login` nor `switch-user` was called at any point in this pass**, and no
screenshot was attempted. Asserting a picture we had not taken would be a Rule-12 breach.

## What the 22 rewritten tickets carry today

Six of the 22 have attachments. Four already showed them inline; two had them dangling.

| Ticket | Attachments | Whose | Inline before | Inline / referenced now |
|---|---|---|---|---|
| [SV-8845](https://shopview.atlassian.net/browse/SV-8845) | 2 PNG + 1 WEBM | ours; the WEBM is Ahtasham Amjad's | 2 PNG shown inline | **the same 2 PNG, preserved byte-for-byte and moved to the point in *Current behaviour* where they help**, with a caption saying what they show |
| [SV-8846](https://shopview.atlassian.net/browse/SV-8846) | 2 PNG | ours | 2 PNG shown inline | **the same 2 PNG, preserved byte-for-byte, captioned in *Current behaviour*** |
| [SV-8857](https://shopview.atlassian.net/browse/SV-8857) | 2 MP4 | **Ayesha Khan's** | none — both dangling | **named in *Current behaviour* in plain words**, saying which recording shows the fault and who made it |
| [SV-8871](https://shopview.atlassian.net/browse/SV-8871) | 2 WEBM (identical duplicates) | ours | none — both dangling | not referenced — see below |
| [SV-8912](https://shopview.atlassian.net/browse/SV-8912) | none | — | — | — |
| the other 17 | none | — | — | — |

**The four preserved images were not re-uploaded and not re-created.** Their existing ADF
`mediaSingle` nodes were lifted verbatim out of the pre-edit snapshot by media id, so the
picture on the ticket is the same file it always was — same id, same alt text, same
dimensions. That is why the description byte-compare still passes.

## The one mechanical limit found, and it is worth recording

**A dangling attachment cannot be turned into an inline image from the REST API.** An ADF
`media` node needs the file's **media-services UUID**, and
`GET /rest/api/3/attachment/{id}` does not return one — it gives the numeric attachment id,
the filename, the author, the size and a content URL, and nothing else (checked live on
attachment 59392). The UUID only exists once a client has uploaded through the media API.

So for SV-8857 the honest options were a plain-text pointer naming the exact file, or a
guessed id that would render as a broken image. **The pointer was chosen.** The attachment
still appears in Jira's own attachments panel, and now the description says which file to
watch and why.

## What is owed when a session has a working sign-in

Small list, and none of it blocks anybody reading the tickets.

1. **SV-8871 — one screenshot.** Its two attachments are *identical duplicate* WEBM
   recordings of the same capture, and neither was referenced. A single still showing the
   Customer button reading only `Customer` beside a Status button reading `Status: Paid` would
   make the point faster than a 1.6 MB video. Worth adding; worth also deleting one of the
   duplicate videos, which is the QA lead's call since deletion is irreversible.
2. **SV-8857 — a true inline embed** of `Reproduced on QA - 8857.mp4`, if you want the video
   in the body rather than named in the text. Needs a media-API upload, so it needs a
   browser-capable session.
3. **SV-8845's third attachment** is Ahtasham Amjad's `not reproducble.webm`. It is
   **deliberately not referenced inline** — it is his evidence arguing the opposite of the
   ticket, and quoting it inline as though it were our evidence would misrepresent both of
   us. It stays visible in the attachments panel where it belongs.
4. **The 16 tickets with no image at all.** None of them needs one: their symptom is a
   quoted string, a count, or a missing control, and every such value is quoted verbatim in
   *Current behaviour*. Each of those tickets' old description said as much explicitly, and
   that judgement has not changed. Listed here so "no image" reads as a decision rather than
   an omission.

## Outstanding — what I need from you

1. **A fresh QA sign-in** for `.qa.shopview.com` if you want items 1 and 2 above done.
2. **Your call on deleting the duplicate WEBM on SV-8871** — irreversible, so not ours.
3. **Nothing else outstanding on images.**
