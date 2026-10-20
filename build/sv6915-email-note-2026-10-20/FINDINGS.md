# SV-6915 — production reproduction (20 Oct 2026)

**Ask:** Milos (79116): "try to reproduce this". QA lead: test on Production, comment with steps + annotated screenshots.
**Answers from QA lead:** inbox = his Gmail via connector (plus-addresses); recording YES, voice-over NO; technical section NO.
**Posted:** comment **79140** (12:08 CDT). Read back: panel first, 2 PNG + 1 MP4 attachments, table 11 rows + header.

## Environment
Production `app.shopview.com`, build **v26.40.20-aada856** (last-modified 20 Oct 10:24:58 GMT), re-read 17:08Z before posting = same.
Admin, workplace Trucks Hill 2 (b617914c…). `requireReview:false`.

## Test data (left in place — no clean-up on production test data)
- Customer **ZZAUTOTEST SV6915 Email Note** 73b5eda6-8f3c-43d0-8f5c-5fc451708dda; contact **Inbox SV6915** 42a542d1… email `bilal.muzamil+sv6915to@shopview.com`; asset unit 6915 eaf0548c….
- **S2-983** cf8b6785-4654-4b32-8f14-f7d0151e93be — invoiced ($149.95). Notes: `sv6915-attachment.png` (For Customer), `sv6915-second-attachment.pdf` (For Customer, added before try 6).
- **S2-984** c6e92abc-2415-4a59-bd40-915eb471f3bc — Approved, estimate email, 1 For Customer png.

## Matrix (every email read in Gmail; HTML body checked)
| # | Sent (UTC) | Options | Note in received email |
|---|---|---|---|
|1 V1-plain|16:37:18|none|full|
|2 V2-attach|16:39:11|For Customer ticked (png arrived as attachment)|full|
|3 V3-bcc|16:40:58|BCC on|full|
|4 V4-extra|16:42:46|+sv6915extra|full (both To)|
|5 V5-all|16:44:34|attach+BCC+sv6915all|full (HTML verbatim checked)|
|6 V6-all-multiline|16:49:14|attach(2)+BCC+2 extra; note with & < > ' " and line breaks|`<urgent>` gone; rest incl. line breaks kept|
|7 V7-estimate-all|16:54:43|estimate S2-984, attach+BCC+extra|full|
|8 V8-angle-bracket|16:56:57|none; note starts `<Note from…`|**whole note missing** (HTML has `<p><Note from …</p>` raw)|
|9 V9-all-angle|~16:59|attach+BCC+extra; `<see attached photo>` mid-note|that part missing, rest kept|
|10 V10-less-than-number|17:00:52|none; `<30 psi`|full (`<` + digit kept)|
|11 REC-film|17:04:51|none; `<Note from REC-film…`|**whole note missing** (HTML verbatim checked)|

**Conclusion:** the reported triggers (attachments / BCC / additional recipient) do NOT reproduce on this build. The missing-note symptom DOES reproduce when the note contains text in angle brackets: the note is inserted into the email HTML without escaping, so `<word…` is read as a tag. Similar class to SV-11227 (mention emails, Done) / SV-11055.

## Honest limits / observations (bucketed, Rule 93)
- BCC copy: goes to bilal.muzamil@shopview.com, the same mailbox as the To plus-addresses → Gmail keeps one copy per Message-ID. Not separately visible. Stated in the comment.
- (d) UNVERIFIED: Gmail's PLAIN_TEXT view of every message is only "Invoice for the order number: S2-983" (no note). Could be a real text/plain part without the note, or the connector's conversion; RAW MIME isn't available through the connector. Not put in the comment.
- (c) the `<title>` / preheader carry a stray `<` ("S2-983<") — cosmetic, hidden, not raised.
- Exhibits render the received HTML locally (body markup verbatim from Gmail; unused CSS rules not copied).

## Duplicate search (Rule 93)
JQL: email+escape, email note, summary email+note, customEmailContent → only SV-11227 / SV-11055 (mention emails), SV-6915 itself.

## Recording
rec/A (send) 47.6→15.8 s (31.8 s idle cut) + recB (received email) 8.1→4.7 s, concatenated = 20.6 s, frame grid checked.

## Gate (Rule 72)
Build re-read 17:08Z unchanged; ticket re-read (Open, last comment 79116 Milos); voice scan clean; no technical section; images/video read back as file attachments; table rows 12.
Learning check: new recipes → playbook (invoice email dialog ids, Gmail plus-address inbox method, contact email field, note attachment For Customer endpoints).
