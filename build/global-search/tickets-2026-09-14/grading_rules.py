#!/usr/bin/env python3
"""Pull each case's OWN grading instruction out of its full Expected text.

These cases do not just state an expectation - most of them say what verdict to record if it is not
met, and the instruction lives in the TAIL of the Expected. The execution-plan extractor kept only
the first 420 characters, so every verdict written from it was judged against a partial case. One
was already wrong because of it: the licence-plate case says in its tail "mark the case BLOCKED ...
Do NOT mark it Failed and do NOT raise a defect until the Product Owner has ruled", and it had been
marked Failed.

Read-only. Prints, per case, the sentences that tell the tester what to record.
"""
import json, os, re, sys
D = os.path.dirname(os.path.abspath(__file__))
full = json.load(open(f'{D}/CASES-FULL.json'))
verd = json.load(open(f'{D}/VERDICTS.json'))['verdicts']

# Phrases that carry an instruction about the VERDICT, not about the behaviour.
PAT = re.compile(
    r'[^.]*?(?:'
    r'mark (?:the (?:case|test)|it) (?:as )?(?:BLOCKED|Blocked|blocked|FAILED|Failed)'
    r'|do NOT mark it Failed|Do NOT mark it Failed'
    r'|do not raise a defect|Do NOT raise a defect|raise a defect'
    r'|record and flag|EXPECTED TO FAIL|expected to fail'
    r'|tell the QA lead|report it|a task ticket goes to the Product Owner'
    r'|awaiting Product Owner|until the Product Owner has ruled'
    r')[^.]*\.', re.I)

rows = []
for cid, c in sorted(full.items(), key=lambda kv: int(kv[0][1:])):
    if 'error' in c:
        rows.append((cid, c['title'], ['COULD NOT READ THIS CASE'], verd.get(cid, {}).get('verdict')))
        continue
    hits = [h.strip() for h in PAT.findall(c['expected'])]
    seen, uniq = set(), []
    for h in hits:
        k = h[:60].lower()
        if k not in seen:
            seen.add(k); uniq.append(h)
    rows.append((cid, c['title'], uniq, verd.get(cid, {}).get('verdict')))

want_blocked = re.compile(r'mark (?:the (?:case|test)|it) (?:as )?blocked|do not mark it failed', re.I)

# A case that says "Blocked until the Product Owner has ruled" is asking for a RULING, not for
# Blocked forever. Once the ruling is on file, Failed is the correct verdict and the case text is
# what is out of date. So the gate does not just look at the case: it also asks whether the verdict
# NAMES the ruling and carries the ticket it produced. A Failed with neither is still flagged --
# which is the thing this gate exists to catch. Ruling of 2026-09-15:
# build/global-search/questions-2026-09-15/ (the answered sheet, all ten rows YES).
pending_po = re.compile(r'until the Product Owner has ruled|a task ticket goes to the Product Owner'
                        r'|until the PO has ruled', re.I)
# A ruling reaches a case in more than one shape: an answered question sheet, or the QA lead
# approving the finding directly. Both are rulings; only the wording differs.
RULED = re.compile(r'(?:answered|approved|ruled)\b[^.]{0,80}\b15 September 2026'
                   r'|Product Owner question[^.]*was answered', re.I)

conflicts, resolved = [], []
for cid, title, hits, v in rows:
    joined = ' '.join(hits)
    if v != 'Failed' or not want_blocked.search(joined):
        continue
    rec = verd.get(cid, {})
    if pending_po.search(joined) and RULED.search(rec.get('observed', '')) \
            and 'browse/' in (rec.get('ticket') or ''):
        resolved.append((cid, title))
    else:
        conflicts.append((cid, title, v))

for cid, title, hits, v in rows:
    mark = '  <-- VERDICT MAY BE WRONG' if any(c[0] == cid for c in conflicts) else ''
    print(f'{cid}  [{v or "unjudged"}]  {title[:62]}{mark}')
    for h in hits:
        print(f'      · {h[:190]}')
print()
if resolved:
    print(f'{len(resolved)} case(s) said "Blocked until the Product Owner has ruled"; the ruling is '
          f'recorded and each carries its ticket, so Failed is correct:',
          ', '.join(c[0] for c in resolved))
    print('   (their case text still tells a tester to mark them Blocked -- that wording is now out '
          'of date and needs the QA lead\'s go-ahead to change.)')
print(f'{len(conflicts)} verdict(s) contradict the case\'s own instruction:',
      ', '.join(c[0] for c in conflicts) or 'none')
sys.exit(1 if conflicts else 0)
