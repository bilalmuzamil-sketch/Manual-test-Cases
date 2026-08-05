#!/usr/bin/env python3
"""Filters cleanup 2026-08-05 — build the intended payload for every touched case.
Jobs: 1 = the 8 phone cases; 3 = the dead GitHub link; 4 = raw <ol>/<li> markup.
One case = one write, all intents folded into ONE final text."""
import json, re, sys

PRE = json.load(open('/tmp/clean/snap/PRE-cases.json'))

OLD_URL = 'https://github.com/bmuzamil-shopview/Manual-test-Cases/blob/main/'
NEW_URL = 'https://github.com/bilalmuzamil-sketch/Manual-test-Cases/blob/HEAD/'

MOB8 = ['29621', '29622', '29623', '29624', '29625', '29626', '29627', '29630']
MARKUP = ['29557', '29560', '29566', '29568', '29573', '29575', '29582', '29613', '29625', '38911']
URLONLY = ['38876', '38904', '38905', '38906', '38907', '38908', '38909', '38910', '38911']

SV8825 = 'https://shopview.atlassian.net/browse/SV-8825'
SV8875 = 'https://shopview.atlassian.net/browse/SV-8875'
ANSWERS = ('build/filters/branko-answers-2026-08-04/answers-ingested.md (' + NEW_URL +
           'build/filters/branko-answers-2026-08-04/answers-ingested.md)')

# ---------------------------------------------------------------- job 4 helpers
def delist(s):
    """<ol><li>x</li>...</ol> -> '1. x\\n2. y'. Formatting only."""
    if s is None:
        return None
    def repl(m):
        items = re.findall(r'<li>(.*?)</li>', m.group(1), re.S)
        items = [re.sub(r'\s+', ' ', i).strip() for i in items]
        return '\n'.join(f'{n+1}. {t}' for n, t in enumerate(items))
    out = re.sub(r'<ol>(.*?)</ol>', repl, s, flags=re.S)
    out = re.sub(r'<ul>(.*?)</ul>', repl, out, flags=re.S)
    out = re.sub(r'\n{3,}', '\n\n', out)
    return out

def delist_field(s):
    """Preconditions / Steps: house style ends on the last full stop, no trailing newline
    (proven: 100 of the 110 live cases end that way; only the 10 markup ones end '>\\n')."""
    v = delist(s)
    return None if v is None else v.rstrip('\n')

def strip_dup_provenance(s):
    """C29613 only: an OLDER, less complete provenance line was left behind wrapped in
    <hr /> + <p>. The current one sits lower down. Rule 54 = exactly one."""
    s = re.sub(r'\n*<hr />\n*<p>This is the expected behaviour[^<]*</p>\n*', '\n\n', s)
    return s

# ---------------------------------------------------------------- job 1 pieces
DNA = re.compile(r'\n*DO NOT AUTOMATE YET:.*?(?=\n\n---\nThis is the expected behaviour)', re.S)

def drop_dna(s):
    return DNA.sub('', s)

def prov_and_marker(body, prov, marker, diverge=None):
    """Assemble: body \n\n---\n prov [\n\n diverge] \n\n MARKER \n"""
    out = body.rstrip('\n') + '\n\n---\n' + prov
    if diverge:
        out += '\n\n' + diverge
    out += '\n\nAUTOMATION: ' + marker + '\n'
    return out

BUILD = 'the build tested on 8/5/2026 (ShopView v3.4.2-d00239b on the Filters QA branch)'
SPEC = 'the Filters specification version 1.6 as revised on 4 August 2026'
CONFIRM = ('Branko settled the question of how filters apply on a phone on 5 August 2026: he said it '
           'is written in the specification and closed the question (' + SV8825 + ').')

PLAN = {}

# ---- C29621 — chip row layout (S12-R1). Nothing about apply timing. -----------
b = PRE['29621']['custom_expected']
body = drop_dna(b).split('\n\n---\n')[0]
PLAN['29621'] = dict(
    custom_expected=prov_and_marker(
        body,
        f'This is the expected behaviour as per {BUILD}, epic SV-8785 and {SPEC} (S12-R1).',
        'READY'))

# ---- C29622 — All Filters sheet carries the Apply filters button (S12-R3) -----
body = drop_dna(PRE['29622']['custom_expected']).split('\n\n---\n')[0]
PLAN['29622'] = dict(
    custom_expected=prov_and_marker(
        body,
        f'This is the expected behaviour as per {BUILD}, epic SV-8785 and {SPEC} '
        f'(S12-R3, S12-R6). {CONFIRM}',
        'READY'))

# ---- C29623 — tapping Apply filters applies the statuses ----------------------
body = drop_dna(PRE['29623']['custom_expected']).split('\n\n---\n')[0]
PLAN['29623'] = dict(
    custom_expected=prov_and_marker(
        body,
        f'This is the expected behaviour as per {BUILD}, epic SV-8785 and {SPEC} '
        f'(S12-R2, S12-R3, S12-R6, S2-R1). {CONFIRM}',
        'READY'))

# ---- C29624 — THE REVERSAL: single chip sheet now stages and needs Apply ------
PLAN['29624'] = dict(
    title='Mobile: one chip opens its own sheet and applies only on Apply filters',
    custom_steps=(
        "1. Tap the Status chip (not the 'All Filters' chip).\n"
        "2. Read the sheet that opens.\n"
        "3. Tick one status, then tick a second one, and watch the work order list while you do it.\n"
        "4. Tap the 'Apply filters' button inside the sheet and look at the list again."),
    custom_expected=prov_and_marker(
        "1. A bottom sheet opens for that single filter: its title row shows the filter's icon and "
        "name (for example 'Status') with a close (x) button, and no accordion list of the other filters.\n"
        "2. The sheet shows only that filter's options (the nine status checkboxes plus 'Clear Selection').\n"
        "3. You can tick more than one option, and the work order list does NOT change while you tick "
        "- your choices are only being held, not applied yet.\n"
        "4. An 'Apply filters' button is shown inside the sheet. Tapping it applies your choices: the "
        "sheet closes and the list shows only the ticked statuses.\n"
        "5. The chip then shows its active state with the value(s) you picked. 'Clear Selection' and "
        "'Clear Filters' work the same way as on desktop.\n"
        "\n"
        "Known issue: on the build tested a single filter's own sheet lets you pick only one value and "
        "has no 'Apply filters' button - it filters the list the moment you tap a value. Only the "
        "combined 'All Filters' sheet holds your choices and applies them on a button. Until it is "
        "fixed this test is expected to fail - it is already reported. Ticket: " + SV8875,
        f'This is the expected behaviour as per epic SV-8785 and {SPEC} (S12-R2, S12-R6, S2-R2). '
        f'It has not been confirmed against the build in this check, so no build date is claimed for it.',
        'READY - EXPECT FAIL (SV-8875)',
        diverge=(
            "Please note this is a change from what this test used to say. It used to expect a single "
            "filter's sheet to filter the list straight away with no 'Apply filters' button. Branko "
            "asked for the new behaviour in the specification and confirmed it on 5 August 2026 when he "
            "closed our question (" + SV8825 + "), saying it is written in the specification. The "
            "earlier position came from his own written answers of 4 August 2026, in this file: " +
            ANSWERS + ", where he said a single filter window applies straight away with no button. We "
            "have taken his latest word as the one that counts, so if you remember the old behaviour, "
            "do not raise it as a new problem.")))

# ---- C29625 — Customer inside the All Filters sheet (markup + job 1) ----------
b = strip_dup_provenance(delist(PRE['29625']['custom_expected']))
body = drop_dna(b).split('\n\n---\n')[0]
PLAN['29625'] = dict(
    custom_preconds=delist_field(PRE['29625']['custom_preconds']),
    custom_steps=delist_field(PRE['29625']['custom_steps']),
    custom_expected=prov_and_marker(
        body,
        f'This is the expected behaviour as per {BUILD}, epic SV-8785 and {SPEC} '
        f'(S12-R2, S12-R6, S3-R2, S3-R3). {CONFIRM}',
        'READY'))

# ---- C29626 / C29627 — other filters inside the All Filters sheet -------------
body = drop_dna(PRE['29626']['custom_expected']).split('\n\n---\n')[0]
PLAN['29626'] = dict(
    custom_expected=prov_and_marker(
        body,
        f'This is the expected behaviour as per {BUILD}, epic SV-8785 and {SPEC} '
        f'(S12-R2, S12-R6, S4-R1, S5-R1). {CONFIRM}',
        'READY'))

body = drop_dna(PRE['29627']['custom_expected']).split('\n\n---\n')[0]
PLAN['29627'] = dict(
    custom_expected=prov_and_marker(
        body,
        f'This is the expected behaviour as per {BUILD}, epic SV-8785 and {SPEC} '
        f'(S12-R2, S12-R6, S6-R1). {CONFIRM}',
        'READY'))

# ---- C29630 — mobile empty state (S12-N1). Keeps its own known-issue line. ----
body = drop_dna(PRE['29630']['custom_expected']).split('\n\n---\n')[0]
PLAN['29630'] = dict(
    custom_expected=prov_and_marker(
        body,
        f'This is the expected behaviour as per {BUILD}, epic SV-8785 and {SPEC} (S12-N1, S8-R3).',
        'READY - EXPECT FAIL (SV-8845)'))

# ---- job 4 only: the other 8 markup cases ------------------------------------
for cid in ['29557', '29560', '29566', '29568', '29573', '29575', '29582', '29613']:
    v = PRE[cid]
    e = delist(v['custom_expected'])
    if cid == '29613':
        e = strip_dup_provenance(e)
    PLAN[cid] = dict(custom_preconds=delist_field(v['custom_preconds']),
                     custom_steps=delist_field(v['custom_steps']),
                     custom_expected=e)

# ---- job 3 only: the 9 remaining cases carrying the dead link ----------------
for cid in URLONLY:
    d = PLAN.setdefault(cid, {})
    v = PRE[cid]
    if cid == '38911':                      # markup case too
        d['custom_preconds'] = delist_field(v['custom_preconds'])
        d['custom_steps'] = delist_field(v['custom_steps'])
        d['custom_expected'] = delist(v['custom_expected'])
    for f in ('custom_preconds', 'custom_steps', 'custom_expected'):
        cur = d.get(f, v.get(f))
        if cur and OLD_URL in cur:
            d[f] = cur.replace(OLD_URL, NEW_URL)
    for f in list(d):
        if d[f] == v.get(f):
            del d[f]

# ---- final sweep: no dead link may survive anywhere -------------------------
for cid, d in PLAN.items():
    for f in ('custom_preconds', 'custom_steps', 'custom_expected'):
        if f in d and d[f] and OLD_URL in d[f]:
            d[f] = d[f].replace(OLD_URL, NEW_URL)

# ---- guards -----------------------------------------------------------------
errs = []
for cid, d in PLAN.items():
    if not d:
        errs.append(f'C{cid}: empty intent')
    for f, val in d.items():
        if val is None:
            errs.append(f'C{cid}.{f} is None')
        if isinstance(val, str):
            if OLD_URL in val:
                errs.append(f'C{cid}.{f} still holds the dead owner')
            if re.search(r'<(ol|li|ul|p|hr|br|div)\b', val, re.I):
                errs.append(f'C{cid}.{f} still holds raw markup')
            if 'DO NOT AUTOMATE YET' in val:
                errs.append(f'C{cid}.{f} still holds the false open-question line')
            if 'VIU' in val:
                errs.append(f'C{cid}.{f} leaks the word VIU')
    if 'title' in d and len(d['title']) > 80:
        errs.append(f'C{cid}: title {len(d["title"])} chars > 80')
    e = d.get('custom_expected')
    if e is not None:
        n = len(re.findall(r'^AUTOMATION: ', e, re.M))
        if n != 1:
            errs.append(f'C{cid}: {n} automation markers (want 1)')
        if not e.rstrip('\n').split('\n')[-1].startswith('AUTOMATION: '):
            errs.append(f'C{cid}: marker is not last')
        p = len(re.findall(r'This is the expected behaviour', e))
        if p != 1:
            errs.append(f'C{cid}: {p} provenance lines (want 1)')

json.dump(PLAN, open('/tmp/clean/plan.json', 'w'), indent=1)
print('cases in plan:', len(PLAN))
print('ops (fields written):', sum(len(v) for v in PLAN.values()))
for cid in sorted(PLAN, key=int):
    print(f'  C{cid}: {sorted(PLAN[cid])}')
print('\nGUARDS:', 'CLEAN' if not errs else 'FAILED')
for e in errs:
    print('  !!', e)
sys.exit(1 if errs else 0)
