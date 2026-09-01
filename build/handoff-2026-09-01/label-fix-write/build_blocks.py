#!/usr/bin/env python3
"""🛑 THE PRECONDITIONS NAMED PERMISSION LABELS THAT DO NOT EXIST ON THE BUILD. Fixing 118 of them.

WHAT WAS WRONG, and it is the exact thing the runnability gate cannot catch. That gate proves a
precondition is tester-SHAPED - it names a screen, gives a click, points at something - and its own
header says it cannot prove the route it names is CORRECT. Asked directly whether the preconditions
were build-verified, I inventoried every UI label they claim (166 cases) and checked the unconfirmed
ones on screen. Two are wrong, and they are the two most widely used:

  “Work Order Line - Create and Edit”     claimed by 117 preconditions   -> NOT on the screen
  “Work Orders → Work Order View Mode”    claimed by  90 preconditions   -> NOT on the screen

WHAT THE ROLE EDIT SCREEN ACTUALLY SAYS (read verbatim from
/administration/roles-permissions/<id>/edit, evidence/precond-role-edit.png):

  "Work orders — Manage work orders the core operational records in ShopView.  View | Create & Edit |
   Delete       View mode — Controls interface complexity, not access controls.  Full View | Tech view"
  "Review work orders | Pick parts | Order parts"
  "Work order lines — Add, edit, and remove the individual labor and part lines on a work order.
   Create & Edit | Delete"

So the permission is the **“Work order lines”** section's **“Create & Edit”** toggle, and the view mode
is the **“Work orders”** section's **“View mode”** setting, offering **“Full View”** and **“Tech view”**.
A tester hunting for "Work Order Line - Create and Edit" would never find it. Rule 9: the case carries
the build's own wording.

ONE MORE, found the same way: C45111 says paste the long story into the “Tech Story” box. On screen the
row is labelled **“Story”**, with the placeholder **“Add tech story for this line”**
(observed on evidence/last3-line-complete.png).

This pass touches PRECONDITIONS ONLY, by exact string replacement, and asserts every intended case
actually changed. Nothing else in any case is in the payload.
"""
import json, base64, urllib.request, re, html, time, os, collections

DIR = os.path.dirname(os.path.abspath(__file__))
C = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
def get(p):
    for a in range(5):
        try:
            r = urllib.request.Request('https://shopview.testrail.io/index.php?/api/v2/' + p,
                                       headers={'Authorization': 'Basic ' + AUTH})
            return json.load(urllib.request.urlopen(r, timeout=180))
        except Exception:
            if a == 4: raise
            time.sleep(2 ** a)
def paged(p, key):
    out, off = [], 0
    while True:
        j = get(f'{p}&limit=250&offset={off}'); ch = j[key] if isinstance(j, dict) else j
        out += ch
        if len(ch) < 250: break
        off += 250
    return out
def blocks_of(h):
    parts = re.findall(r'<li>(.*?)</li>|<p>(.*?)</p>', h, re.S)
    chunks = [a or b for a, b in parts] or [h]
    out = []
    for p in chunks:
        p = re.sub(r'</p>\s*<p>', '<br>', p)
        lines = [html.unescape(re.sub(r'<[^>]+>', '', x)).strip() for x in re.split(r'<br\s*/?>', p)]
        lines = [l for l in lines if l != '']
        if lines: out.append(lines)
    return out

PERM_NEW = ('Your user’s role can edit work order lines. To check it: open “Settings”, click '
            '“Roles & Permissions” in the sidebar, click the pencil on the role your user is on, then '
            'find the “Work order lines” section and make sure its “Create & Edit” toggle is on.')
SUBS = [
 # --- the permission sentence, in its four recorded spellings
 ("Your user has the 'Work Order Line - Create and Edit' permission enabled. To check it: open "
  "“Settings”, click “Roles & Permissions” in the sidebar, then click the pencil on the role your user "
  "is on, and look for “Work Order Line - Create and Edit”.", PERM_NEW),
 ("Your user has the ‘Work Order Line - Create and Edit’ permission enabled. To check it: open "
  "“Settings”, click “Roles & Permissions” in the sidebar, then click the pencil on the role your user "
  "is on, and look for “Work Order Line - Create and Edit”.", PERM_NEW),
 ("You have the 'Work Order Line - Create and Edit' setting enabled. To check it: open “Settings”, "
  "click “Roles & Permissions” in the sidebar, then click the pencil on the role your user is on, and "
  "look for “Work Order Line - Create and Edit”.", PERM_NEW),
 ("Your user has the 'Work Order Line - Create and Edit' permission enabled.",
  'Your user’s role can edit work order lines — the “Work order lines” section’s “Create & Edit” '
  'toggle, under “Settings” › “Roles & Permissions” › the pencil on your role.'),
 # --- the negative-permission variant
 ("Sign in as a user whose role does NOT have the 'Work Order Line - Create and Edit' permission, or "
  "have an administrator create one. To set a role up that way: open “Settings”, click "
  "“Roles & Permissions” in the sidebar, click the pencil on THAT role, switch "
  "“Work Order Line - Create and Edit” off and save.",
  'Sign in as a user whose role cannot edit work order lines, or have an administrator set one up. To '
  'do that: open “Settings”, click “Roles & Permissions” in the sidebar, click the pencil on THAT '
  'role, find the “Work order lines” section, switch its “Create & Edit” toggle off and save.'),
 # --- the view mode sentence, both values
 ("Your “Work Orders → Work Order View Mode” permission is set to Tech View. To check or change it: "
  "open “Settings”, click “Roles & Permissions” in the sidebar, then click the pencil on the role your "
  "user is on, then set “Work Order View Mode” to Tech View.",
  'Your role’s work order view mode is set to “Tech view”. To check or change it: open “Settings”, '
  'click “Roles & Permissions” in the sidebar, click the pencil on the role your user is on, then in '
  'the “Work orders” section set “View mode” to “Tech view”.'),
 ("Your “Work Orders → Work Order View Mode” permission is set to Full View. To check or change it: "
  "open “Settings”, click “Roles & Permissions” in the sidebar, then click the pencil on the role your "
  "user is on, then set “Work Order View Mode” to Full View.",
  'Your role’s work order view mode is set to “Full View”. To check or change it: open “Settings”, '
  'click “Roles & Permissions” in the sidebar, click the pencil on the role your user is on, then in '
  'the “Work orders” section set “View mode” to “Full View”.'),
 # --- C45111's story box
 ('into its “Tech Story” box',
  'into the line’s “Story” box (it reads “Add tech story for this line” when it is empty)'),
]
# any surviving occurrence of these is a failure of this pass
BANNED = [re.compile(r'Work Order Line\s*-\s*Create and Edit'),
          re.compile(r'Work Order View Mode'),
          re.compile(r'“Tech Story”')]

SEC = [6755, 6756, 6757, 6758, 6759, 6760, 6771, 6761, 6762, 6763, 6764, 6765, 6766]
cases = []
for sid in SEC: cases += paged(f'get_cases/1&section_id={sid}', 'cases')
print('cases read:', len(cases))

intended, snap, skipped = {}, {}, []
applied_counts = collections.Counter()
for c in cases:
    pre = c.get('custom_preconds') or ''
    if not any(rx.search(pre) for rx in BANNED):
        continue
    if c['created_by'] != 3:
        skipped.append((c['id'], 'foreign (Rule 38)')); continue
    if c.get('custom_atmstatus') == 3:
        skipped.append((c['id'], 'Automated, no per-case go-ahead (Rule 71)')); continue
    blocks = blocks_of(pre)
    new_blocks, changed = [], 0
    for b in blocks:
        nb = []
        for line in b:
            out = line
            for old, new in SUBS:
                if old in out:
                    out = out.replace(old, new); changed += 1
            nb.append(out)
        new_blocks.append(nb)
    if not changed:
        skipped.append((c['id'], 'the banned label is present but no known sentence matched — LOOK AT IT'))
        continue
    text = '\n\n'.join('\n'.join(b) for b in new_blocks)
    leftover = [rx.pattern for rx in BANNED if rx.search(text)]
    if leftover:
        skipped.append((c['id'], f'still contains {leftover} after substitution — LOOK AT IT')); continue
    applied_counts[changed] += 1
    intended[str(c['id'])] = {
        'title': c['title'], 'verdict': 'precondition label corrected to the build’s own wording',
        'marker_override': next((l for l in
            [x for bb in blocks_of(c.get('custom_expected') or '') for x in bb]
            if l.upper().startswith('AUTOMATION:')), 'AUTOMATION: READY'),
        'build_sentence': next((l for l in
            [x for bb in blocks_of(c.get('custom_expected') or '') for x in bb]
            if l.startswith('Last checked against build')), None),
        'fields': {'custom_preconds': {'blocks': new_blocks, 'text': text}},
    }
    exp_blocks = blocks_of(c.get('custom_expected') or '')
    prov = [l for bb in exp_blocks for l in bb if l.startswith('This is the expected behaviour')]
    own = [l for bb in exp_blocks for l in bb if l.lower().startswith('source:')]
    snap[str(c['id'])] = {'title': c['title'], 'atm': c.get('custom_atmstatus'),
                          'section_id': c['section_id'], 'refs': c.get('refs'),
                          'provenance': prov, 'own_source': own,
                          'before': {'custom_preconds': pre}}

json.dump(intended, open(f'{DIR}/intended-blocks.json', 'w'), indent=1, ensure_ascii=False)
json.dump(snap, open(f'{DIR}/PRE-snapshot.json', 'w'), indent=1, ensure_ascii=False)
print(f'\nto write: {len(intended)}   (substitutions per case: {dict(applied_counts)})')
print(f'skipped: {len(skipped)}')
for cid, why in skipped: print(f'   C{cid}: {why}')
