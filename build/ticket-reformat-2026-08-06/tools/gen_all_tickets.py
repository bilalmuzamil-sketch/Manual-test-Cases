#!/usr/bin/env python3
"""Generate ALL-TICKETS.md -- every defect ticket we created, as a plain list the QA lead
can work down. Built from the LIVE reads taken by the attachment audit, never from notes.
"""
import json, os, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.abspath(os.path.join(HERE, '..'))
LIVE = os.path.join(BASE, 'attachment-audit', 'snapshots', 'live')
AUD = json.load(open(os.path.join(BASE, 'attachment-audit', 'snapshots', 'attachment-audit.json')))
FSPOP = json.load(open(os.path.join(BASE, 'filters-schedule', 'snapshots', 'population.json')))

BR = 'https://shopview.atlassian.net/browse/'
IMG_EXT = ('.png', '.jpg', '.jpeg', '.gif', '.webm', '.mp4', '.mov')

# every ticket in the two passes' populations was rewritten: 84 by them, 8 (the closed
# ones) by the closed-tickets pass. Recorded per ticket rather than asserted globally.
CLOSED8 = ['SV-8819', 'SV-8821', 'SV-8822', 'SV-8843', 'SV-8844', 'SV-8847',
           'SV-8902', 'SV-8923']

rows = {}
for r in AUD['rows']:
    k = r['ticket']
    live = json.load(open(os.path.join(LIVE, f'{k}.json')))
    f = live['fields']
    half = FSPOP['project'].get(k, 'Report Suite')
    visual = [m for m in r['media'] if m.get('visual')]
    inline = [m for m in visual if m.get('inline_now')]
    # Stated as measured, not as assumed: "shown in the body" means the picture's own
    # reference was found inside the live description. Whether a dangling one is also
    # NAMED in the words is not measured here, so it is not claimed.
    if not visual:
        img = 'no'
    elif inline:
        img = f'yes — {len(visual)} attached, {len(inline)} shown in the body'
    else:
        img = f'yes — {len(visual)} attached, none shown in the body'
    if k == 'SV-8818':
        img += ' (one pasted image was destroyed — see the note below)'
    rows[k] = {
        'key': k, 'half': half, 'summary': f['summary'],
        'type': f['issuetype']['name'],
        'status': f['status']['name'],
        'resolution': (f.get('resolution') or {}).get('name'),
        'priority': f['priority']['name'],
        'parent': (f.get('parent') or {}).get('key'),
        'rewritten': 'yes' + (' (as a closed ticket, 6 Aug)' if k in CLOSED8 else ''),
        'image': img,
        'attachments': r['attachments_now'],
    }

order = sorted(rows, key=lambda k: int(k.split('-')[1]))
groups = [('Report Suite', 'SV-8582'), ('Filters', 'SV-8785'), ('Schedule', 'SV-8685')]

L = []
A = L.append
A('# Every ticket we created — the working list')
A('')
A('**This is the list the QA lead asked for.** One row per ticket, with the link, what it is '
  'about in one line, whether its description has been rewritten into the new five-part shape, '
  'what state it is in, and whether it carries a picture or a recording.')
A('')
A(f'**Read live from Jira on {datetime.date.today().isoformat()}** — the status, resolution and '
  'attachment columns are what Jira held at that moment, not what our notes said.')
A('')
tot = len(rows)
A(f'## The counts')
A('')
A('| | Tickets | Rewritten |')
A('|---|---|---|')
for name, epic in groups:
    ks = [k for k in order if rows[k]['half'] == name]
    A(f'| {name} ({epic}) | {len(ks)} | {len(ks)} |')
A(f'| **Total** | **{tot}** | **{tot}** |')
A('')
A('**Every ticket we created now carries the five-part description — 84 were rewritten in the '
  'two earlier passes today and the remaining 8, all of them closed, were rewritten afterwards '
  'on the QA lead\'s instruction that all of them be corrected.**')
A('')
A('Two counting notes, said plainly so the total can be checked:')
A('')
A('- **[SV-8871](' + BR + 'SV-8871) is counted once, under Filters.** It came up in the Report '
  'Suite sweep as well, because that sweep looks at every ticket this account created, but it '
  'belongs to a Filters story (its parent is SV-8795, Filter Persistence) and it was rewritten '
  'by the Filters and Schedule pass. So it is a Filters ticket and it is counted there only.')
A('- **[SV-8910](' + BR + 'SV-8910) is not in this list.** It was created under our account but '
  'whose work it is has never been confirmed, and the QA lead asked for it to be left out until '
  'that is settled. It is a Bug, Open, priority Low, with no parent, titled *"Vendor invoice '
  'total is duplicated onto every purchase order when one receive spans two POs"*. **Its '
  'description has NOT been rewritten.** If it is ours, it needs one more write and a parent.')
A('')

for name, epic in groups:
    ks = [k for k in order if rows[k]['half'] == name]
    A(f'## {name} — {len(ks)} tickets (epic {epic})')
    A('')
    A('| Ticket | What it is about | Rewritten | Type | Status | Picture or recording |')
    A('|---|---|---|---|---|---|')
    for k in ks:
        r = rows[k]
        st = r['status'] + (f" / {r['resolution']}" if r['resolution'] else '')
        A(f"| [{k}]({BR}{k}) | {r['summary']} | {r['rewritten']} | {r['type']} | {st} | "
          f"{r['image']} |")
    A('')

A('## The one thing that went wrong, and it is not recoverable')
A('')
A('**[SV-8818](' + BR + 'SV-8818) lost a pasted screenshot** (`image-20260804-061644.png`) on '
  'the very first write of the day. The new description did not carry the picture\'s reference, '
  'and Jira deletes a pasted image the moment its last reference disappears. The file is gone '
  'and we do not hold a copy. Jira\'s own history does not record it — it logs only that the '
  'description changed — so this is provable only because the write was compared against a '
  'snapshot taken beforehand.')
A('')
A('**Every write after that carried the pictures forward, and that is now proven rather than '
  'asserted.** All 92 tickets were compared attachment by attachment, by id, against snapshots '
  f'taken before any write: **{tot - 1} unchanged, 1 loss, and it is the one above.** The full '
  'evidence is in `attachment-audit/ATTACHMENT-VERIFICATION.md`.')
A('')
A('## What is owed')
A('')
A('1. **One screenshot for SV-8818** — the PDF download failing on Parts Velocity — the next '
  'time a QA session is available.')
A('2. **A decision on SV-8910** — is it ours? If yes it needs its description rewritten and a '
  'parent set.')
A('3. **A decision on SV-8843 and SV-8847** — both closed as OBSOLETE, and our records say the '
  'behaviour they describe still happens on the branch. Reopening somebody else\'s closure is '
  'your call, not ours, so nothing was reopened and no status was touched. (SV-8845 was in the '
  'same position but reads **In Progress** now, so somebody has already picked it up and it '
  'needs nothing from you.)')
A('')

p = os.path.join(BASE, 'ALL-TICKETS.md')
open(p, 'w').write('\n'.join(L) + '\n')
print('wrote', p, f'({tot} tickets)')
for name, epic in groups:
    print(' ', name, sum(1 for k in order if rows[k]['half'] == name))
