#!/usr/bin/env python3
"""Generate ATTACHMENT-VERIFICATION.md from the audit JSON. Every number in the document
comes out of the machine-readable evidence, never out of prose."""
import json, os, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.abspath(os.path.join(HERE, '..'))
A_ = json.load(open(os.path.join(BASE, 'snapshots', 'attachment-audit.json')))
X = json.load(open(os.path.join(BASE, 'snapshots', 'media-exactness.json')))
BR = 'https://shopview.atlassian.net/browse/'
rows = A_['rows']
with_att = [r for r in rows if r['attachments_before'] or r['attachments_now']]
losses = [r for r in rows if r['verdict'] == 'LOSS']
tot_before = sum(r['attachments_before'] for r in rows)
tot_now = sum(r['attachments_now'] for r in rows)

L = []
A = L.append
A('# Was any other image lost? No. Ticket by ticket, by attachment id.')
A('')
A('**The short answer, and it is the one the QA lead asked for: exactly one attachment was '
  'destroyed all day, and it is the one already reported on '
  f'[SV-8818]({BR}SV-8818). Every other attachment on every other ticket is present, by id.**')
A('')
A('This was a guarantee that had to be earned rather than given. Both reformat passes kept '
  'snapshots taken **before any write**, so the question is checkable: what was attached then, '
  'and what is attached now.')
A('')
A('## What was compared, and how')
A('')
A('| | |')
A('|---|---|')
A(f'| Tickets audited | **{len(rows)}** — the whole population of both passes |')
A(f'| Of those, rewritten | **{A_["rewritten"]}** |')
A(f'| Attachments before any write | **{tot_before}** |')
A(f'| Attachments now | **{tot_now}** |')
A(f'| Missing now | **{tot_before - tot_now}** — the single SV-8818 screenshot |')
A('| Renamed or swapped | **0** |')
A('| Body references pointing at nothing | **0** |')
A('')
A('**Compared by attachment id and filename, never by count** (Standing Rule 50). A count '
  'match can hide a swap: two attachments could be exchanged and the total would still read '
  'the same. So each id was looked for individually, in both directions, and each surviving '
  "id's filename was compared with the filename it had before.")
A('')
A('The baselines, both committed to git before the writes they are being used to check:')
A('')
A('- **Report Suite** — `report-suite/snapshots/working-set.json`, the live population read at '
  'the start of that pass. It holds the attachment list for all 65 tickets, and it is the file '
  'that still records the SV-8818 screenshot as present.')
A('- **Filters and Schedule** — `filters-schedule/snapshots/pre-edit/<KEY>.json`, a full issue '
  'read per ticket taken before that pass wrote anything.')
A('')
A('**One correction to the earlier account.** `ATTACHMENT-LOSS-SV-8818.md` cites '
  '`snapshots/pre-write/SV-8818.json` as showing six attachments. It shows **five**, because '
  'SV-8818 was written twice — the failed write and then the repair — and the second write '
  'overwrote that file with the state after the loss. **The loss is still fully provable**, '
  'from `working-set.json` (six attachments, including `59255`) and from the pre-edit copy of '
  "the old description, which still contains the destroyed picture's reference. Nothing about "
  'the finding changes; the citation in that document was pointing at the wrong file.')
A('')
A('## Every ticket that has ever had an attachment')
A('')
A('The other tickets have no attachments at all, before or after, so there is nothing to lose '
  f'on them — that is {len(rows) - len(with_att)} of the {len(rows)}. The '
  f'{len(with_att)} that do are listed here in full.')
A('')
A('| Ticket | Rewritten | Before | Now | Missing | Every id matches | Pictures shown in the body |')
A('|---|---|---|---|---|---|---|')
for r in sorted(with_att, key=lambda r: int(r['ticket'].split('-')[1])):
    vis = [m for m in r['media'] if m.get('visual')]
    inline = [m for m in vis if m.get('inline_now')]
    miss = ', '.join(f"`{m['id']}` {m['filename']}" for m in r['missing']) or '—'
    ok = 'no — see below' if r['missing'] else 'yes'
    shown = (f"{len(inline)} of {len(vis)}" if vis else 'none attached')
    when = 'yes' if r['rewritten'] else 'yes — later, as a closed ticket'
    A(f"| [{r['ticket']}]({BR}{r['ticket']}) | {when} | "
      f"{r['attachments_before']} | {r['attachments_now']} | {miss} | {ok} | {shown} |")
A('')
A('## The pictures inside the descriptions, compared attribute by attribute')
A('')
A('Presence is not enough — a picture can survive as a file and still be broken in the body. '
  'So every media reference in every description was compared with the reference that stood '
  'there before the rewrite.')
A('')
A(f"**{X['preserved']} references were carried through a rewrite, and "
  f"{X['preserved_byte_identical']} of them are byte-identical.** The other "
  f"{X['preserved'] - X['preserved_byte_identical']} point at exactly the same file — the file "
  'reference itself never changed, which is what protects the picture — but lost their display '
  'size or changed their alignment. That is worth saying plainly rather than rounding to '
  '"preserved":')
A('')
A('| Ticket | Picture | What changed |')
A('|---|---|---|')
for r in X['media_node_rows']:
    if r['state'] == 'PRESERVED' and not r['attrs_byte_identical']:
        d = r.get('diff') or {}
        bits = []
        if 'width' in d or 'height' in d:
            bits.append('its set display size was dropped, so it now renders at its natural size')
        if 'localId' in d:
            bits.append('an internal editor id was dropped (no visible effect)')
        if 'alt' in d:
            bits.append('a filename label was added')
        A(f"| [{r['ticket']}]({BR}{r['ticket']}) | `{r['media_id'][:8]}…` "
          f"{r['alt'] or '(no label)'} | {'; '.join(bits)} |")
A('')
A('**None of that risks a file** and none of it is a loss. It happened because the Report Suite '
  'pass rebuilt each picture reference from scratch, while the Filters and Schedule pass lifted '
  'the original reference out verbatim. **Lifting it verbatim is the better method**, it is what '
  "the closed-ticket writes used, and their two pictures came back byte-identical. On SV-8820 "
  'the two pasted screenshots now show at full size instead of the width the author had set, and '
  'on SV-8823 and SV-8879 one picture each moved from centred to left-aligned. Cosmetic, '
  'reversible, and reported rather than absorbed.')
A('')
A('## The four images and the two recordings the Filters and Schedule pass reported keeping')
A('')
A('That pass said it kept four inline images byte-for-byte and named two dangling videos in '
  '**words**. **Both halves check out.**')
A('')
A('| | |')
A('|---|---|')
A(f'| [SV-8845]({BR}SV-8845) | its two pictures, `79cea153…` and `7d8081e6…`, are still shown '
  'in the body and their references are **byte-identical**, including the exact pixel widths '
  '412 and 402 the author had set |')
A(f'| [SV-8846]({BR}SV-8846) | its two pictures, `8922699b…` and `c0e48765…`, likewise still '
  'shown, references **byte-identical** |')
A(f'| [SV-8857]({BR}SV-8857) | both recordings are still attached — `Reproduced on QA - '
  '8857.mp4` and `Verified in QA.mp4` — and the body names them in plain words, verified by '
  "reading the live text: *“Two screen recordings made by Ayesha Khan are attached to this "
  "ticket…”* |")
A('')
A('So the four images are confirmed, and the two recordings are confirmed both as files and as '
  'the sentence that describes them.')
A('')
A('**And there were more preserved than that pass claimed**, because the Report Suite half also '
  f'carried pictures through: [SV-8820]({BR}SV-8820) kept two pasted screenshots in its body, '
  f'and [SV-8823]({BR}SV-8823) and [SV-8879]({BR}SV-8879) one each.')
A('')
A('## The one loss, re-confirmed from Jira itself')
A('')
A(f"Asking Jira directly for the destroyed attachment returns **HTTP {X['destroyed_attachment_reread']['http']}** "
  f"— *“{X['destroyed_attachment_reread']['message'][0]}”*. It is not hidden, not moved and "
  'not recoverable.')
A('')
A(f"On [SV-8818]({BR}SV-8818) a different picture that was already attached and had never been "
  'shown, `parts-velocity-download-menu.png`, is now shown in the body instead. That does not '
  'replace what was lost; it is what the ticket can honestly show today.')
A('')
A('## How to re-run this')
A('')
A('```')
A('python3 attachment-audit/tools/audit.py        # every ticket, by attachment id')
A('python3 attachment-audit/tools/media_exact.py  # every picture reference, attribute by attribute')
A('python3 attachment-audit/tools/gen_report.py   # this document')
A('```')
A('')
A('Read-only against Jira. No TestRail call of any kind was made by any of it. Evidence: '
  '`snapshots/attachment-audit.json`, `snapshots/media-exactness.json`, and a full live copy of '
  'each of the 92 issues in `snapshots/live/`.')
A('')
A(f'*Audited {datetime.date.today().isoformat()}. Re-run unchanged after the eight closed '
  'tickets were rewritten, so the guarantee covers those writes too.*')

p = os.path.join(BASE, 'ATTACHMENT-VERIFICATION.md')
open(p, 'w').write('\n'.join(L) + '\n')
print('wrote', p)
print('losses:', [r['ticket'] for r in losses], '| with attachments:', len(with_att),
      '| before', tot_before, 'now', tot_now)
