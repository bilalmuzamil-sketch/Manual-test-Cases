#!/usr/bin/env python3
"""
Filters — mirror the EXECUTED TestRail state back into the LOCAL case source.

WHY THIS MATTERS MORE THAN A TIDY-UP: `cases/*.json` is the input to the import
generator, so a stale local body can be REGENERATED OVER the correct live text.
That is exactly the trap this pass found — FLT-MOB-04's local body still asserted
an 'Apply filter' button that live TestRail (and now Branko) says does not exist.
Live is authoritative here because live is what the tester reads and what the
byte-verified push wrote.

Syncs, for every case this pass wrote: title, preconditions, steps, expected
(including the provenance block) and spec_ref, plus the id-map `refs` column.
Also RESOLVES the local `notes` flags Branko's answers have settled — a note that
still says "PENDING BRANKO" after he has answered is the same false-source problem
Rule 54's honesty clause forbids, one layer down.

usage: python3 sync_local_branko.py
"""
import json, os, sys, csv, glob, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'build', 'filters', 'provenance-2026-08-04',
                               'tools'))
from classify import SEP, LEAD                                     # noqa: E402

PROJ = os.path.join(ROOT, 'build', 'filters')
PLAN = json.load(open(os.path.join(HERE, '..', 'plan.json')))
LOG = [json.loads(l) for l in open(os.path.join(HERE, '..', 'exec-log.jsonl'))]
VERIFIED = {r['case_id'] for r in LOG if r.get('verify') == 'MATCH'}
BY = {e['case_id']: e for e in PLAN if e['case_id'] in VERIFIED}

# notes whose PENDING/CONFLICT wording Branko's 2026-08-04 answers have settled
NOTE_RESOLUTIONS = {
    29624: (' | RESOLVED 2026-08-04 - Branko answered the tech-plan sheet Q1 '
            '"A - no apply button": the single-filter sheet applies INSTANTLY as '
            'you tick, and only the combined All Filters sheet keeps its "Apply '
            'filters" button. The design-vs-tech-plan conflict is closed in the '
            'tech plan\'s favour (D15). Live TestRail already asserted this; the '
            'LOCAL body was stale and asserting the opposite, and is reconciled '
            'to live by this pass. Body reflowed (paste markup repaired) - '
            'assertions unchanged. Still NOT live-verified: no Filters QA branch '
            'has been consulted (VIU reserved by the QA lead until Report Suite '
            'is complete).'),
    38876: (' | RESOLVED 2026-08-04 - Branko answered the tech-plan sheet Q2 '
            '"A - it\'s fine": Estimates IS the right first-visit tab, so nothing '
            'flips. The default tab is still absent from the PRD, which he still '
            'owes; the ruling, not the document, is what the case now cites.'),
    38904: (' | VENDORS CONFLICT RESOLVED 2026-08-04 - Branko answered the '
            'tech-plan sheet Q3 "Disign for vendors exists in figma. Check it". '
            'We checked: node 11903:10461 rendered at '
            'design-2026-07-31/frames/Parts-Explorations-20.4.2026__Vendors__'
            '11903-10461.png is UNAMBIGUOUSLY the Vendors page - page title '
            '"Vendors", the Vendors item highlighted in the left nav BELOW a '
            'separate "Vendor Invoices" item, a "New Vendor" button, columns Name/'
            'Telephone/Email/Address/City/State-Province/Zip, and exactly two '
            'filter chips: Vendor and State/Province. So the engineering reading '
            'recorded above (that this frame is Vendor Invoices) is WRONG, and the '
            'PRD v1.6 §2 already lists Vendors among the Parts views that get a '
            'filter bar. The tester-facing hedge ("the developers have not been '
            'given a design ... write down what you actually see instead of '
            'failing the whole test") is REMOVED: its premise is false and under '
            'Rule 45 it was a false all-clear that would have let a genuinely '
            'missing Vendors filter bar pass. HONEST CONSEQUENCE: this case will '
            'now legitimately FAIL if the build has not shipped the Vendors filter '
            'bar - which is the correct outcome, not a defect in the case.'),
}


def strip_local(lines):
    out, skip = [], False
    for ln in lines:
        if not isinstance(ln, str):
            out.append(ln); continue
        if ln.strip() == SEP:
            skip = True; continue
        if ln.lstrip().startswith(LEAD):
            skip = True; continue
        if skip and not ln.strip():
            continue
        out.append(ln)
    return out


def _words(text):
    """markup-, dash- and whitespace-insensitive word signature of a body"""
    t = re.sub(r'</li>\s*<li[^>]*>', '\n', text or '')
    t = re.sub(r'<[^>]+>', ' ', t)
    t = t.replace('\u2014', '-').replace('\u2013', '-').replace('\u2019', "'")
    t = re.sub(r'^\s*\d+[.)]\s*', '', t, flags=re.M)
    return re.sub(r'[^a-z0-9]+', ' ', t.lower()).strip()


def numbered(text):
    return [ln for ln in (text or '').split('\n') if ln.strip()]


def main():
    rows = list(csv.DictReader(open(os.path.join(PROJ, 'testrail-id-map.csv'))))
    hdr = list(rows[0].keys())
    to_cid = {r['internal_id']: int(r['testrail_case_id'].lstrip('C'))
              for r in rows if r['testrail_case_id'].strip()}

    touched, files, notes_fixed = 0, 0, 0
    for f in sorted(glob.glob(os.path.join(PROJ, 'cases', '*.json'))):
        data = json.load(open(f))
        changed = False
        for c in data:
            cid = to_cid.get(c.get('id'))
            if cid not in BY:
                continue
            i = BY[cid]['intended']
            if 'title' in i:
                c['title'] = i['title']
            if 'custom_preconds' in i:
                c['preconditions'] = numbered(i['custom_preconds'])
            if 'custom_steps' in i:
                c['steps'] = numbered(i['custom_steps'])
            if 'refs' in i:
                c['spec_ref'] = i['refs']
            # expected: rebuild from the stripped body + the executed block
            body = strip_local(c.get('expected') or [])
            parts = i['custom_expected'].split(f'\n{SEP}\n')
            # WHICH BODY WINS.  Where the WORDS differ, LIVE is authoritative — it
            # is what the tester reads and what the byte-verified push wrote (this
            # is how FLT-MOB-04's stale local assertion and FLT-PARTS-01's removed
            # hedge get reconciled).  Where only the MARKUP differs — a few cases
            # were manually converted to <ol>/<li> in TestRail — the local plain
            # numbered form is KEPT, because that is the form the import needs and
            # dragging HTML into the CSV would be a regression.
            if _words(parts[0]) != _words('\n'.join(body)):
                body = numbered(parts[0])
            sentence = parts[-1].strip()
            c['expected'] = body + [SEP, sentence]
            if cid in NOTE_RESOLUTIONS and NOTE_RESOLUTIONS[cid] not in (
                    c.get('notes') or ''):
                c['notes'] = (c.get('notes') or '') + NOTE_RESOLUTIONS[cid]
                notes_fixed += 1
            changed = True
            touched += 1
        if changed:
            json.dump(data, open(f, 'w'), indent=1, ensure_ascii=False)
            files += 1

    n = 0
    for r in rows:
        cid = int(r['testrail_case_id'].lstrip('C')) if r['testrail_case_id'].strip() else None
        if cid in BY:
            i = BY[cid]['intended']
            if 'refs' in i:
                r['refs'] = i['refs']; n += 1
            if 'title' in i:
                r['title'] = i['title']
    with open(os.path.join(PROJ, 'testrail-id-map.csv'), 'w', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=hdr); w.writeheader(); w.writerows(rows)

    blanks = [r['internal_id'] for r in rows if not r['testrail_case_id'].strip()]
    print(f'local cases synced      : {touched} across {files} file(s)')
    print(f'notes flags resolved    : {notes_fixed}')
    print(f'id-map refs refreshed   : {n} rows · total rows {len(rows)} · '
          f'blank C-ids {len(blanks)}')


if __name__ == '__main__':
    main()
