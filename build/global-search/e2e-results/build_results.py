"""Build the results workbook for one automated run of the Global Search V2 suite.

Reads Playwright's own JSON results (never the console text), classifies each test, and writes:
  Summary · All results · Passed · Failed · Known faults (still there) · Known faults (gone?) · Stood down
Usage: build_results.py <e2e-results.json> <out.xlsx> <ticket-status.json> <build> <env> [re-run.json ...]
                        [--replace] [--classify classify-<date>.json]
  --replace   a re-run REPLACES the result of the test it repeats (the first result is kept in its own
              column); without it a re-run is only shown beside a failed row, as on 2 October 2026
  --classify  that run's reading of each failure (ticketed / possible / ours); without it, the
              2 October 2026 reading below is used, so that workbook can be rebuilt unchanged
"""
import json, re, sys, datetime
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

ARGS = sys.argv[1:]
REPLACE = '--replace' in ARGS
CLASSIFY = ARGS[ARGS.index('--classify') + 1] if '--classify' in ARGS else None
ARGS = [a for i, a in enumerate(ARGS) if a != '--replace' and a != '--classify' and (i == 0 or ARGS[i - 1] != '--classify')]
src, out, tickets_f, build, env = ARGS[0:5]
rerun_fs = ARGS[5:]                # re-runs, oldest first; a later one wins for a test in both
TICKETS = json.load(open(tickets_f)) if tickets_f != '-' else {}
TR = 'https://shopview.testrail.io/index.php?/cases/view/'
RUN = 'https://shopview.testrail.io/index.php?/runs/view/415'
JIRA = 'https://shopview.atlassian.net/browse/'
ANSI = re.compile(r'\x1b\[[0-9;]*m')

def clean(t):
    t = ANSI.sub('', t or '')
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def parse(path):
  rows = []
  def walk(s, f=None):
      f = s.get('file', f)
      for sp in s.get('suites', []): walk(sp, f)
      for spec in s.get('specs', []):
          for t in spec.get('tests', []):
              res = (t.get('results') or [{}])[-1]
              ann = {a.get('type'): a.get('description', '') for a in (t.get('annotations') or [])}
              title = spec['title']
              cid = (re.search(r'@C(\d+)', title) or re.search(r'\bC(\d{5,6})\b', title))
              ticket = (re.search(r'expected to fail: (SV-\d+)', title) or [None, None])[1]
              st = t.get('status')                       # expected | unexpected | skipped | flaky
              if st == 'skipped':
                  kind = 'Stood down'
              elif 'fail' in ann or ticket:
                  kind = 'Known fault — still there' if st == 'expected' else 'Known fault — did not reproduce'
              elif st == 'expected':
                  kind = 'Passed'
              else:
                  kind = 'Failed'
              err = clean(((res.get('errors') or [{}])[0] or {}).get('message') or res.get('error', {}).get('message', ''))
              reason = clean(ann.get('skip', ''))
              rows.append(dict(_status=st, cid=cid.group(1) if cid else '', title=clean(re.sub(r'\s*@C\d+', '', title)),
                               file=f, line=spec.get('line'), kind=kind, ticket=ticket, err=err[:600],
                               reason=reason[:600], secs=round((res.get('duration') or 0) / 1000, 1)))
  d = json.load(open(path))
  for x in d.get('suites', []): walk(x)
  return rows
rows = parse(src)
norm = lambda t: re.sub(r'\s*\[expected to fail:[^\]]*\]', '', t).strip()
RERUN = {}
for f_ in rerun_fs:
    RERUN.update({(r['file'], norm(r['title'])): r for r in parse(f_)})

# ---------- what each failure MEANS — decided by looking at it, one by one (2026-10-02) ----------
K_TICKET, K_NEW, K_OURS = 'Failed — already reported', 'Failed — possible new problem', "Failed — our test's fault"
SV34 = ('SV-10634', 'The row shows only the characters typed, not the whole value that matched.')
TYPED = {c: SV34 for c in ('146205', '146206', '146238', '146242', '146252', '146271', '146272', '146209')}
TICKETED = {**TYPED, '146222': ('SV-10635', 'The customer row does not show the telephone on hover.')}
POSSIBLE = {
  '146233': 'Parts: the whole part name is highlighted, instead of just the typed part inside it.',
  '146235': 'Parts: the whole part name is highlighted, instead of just the typed part inside it.',
  '146227': 'Vehicles: two different vehicles (same unit number, different serial number) read identically in the results.',
  '146228': 'Vehicles: two different vehicles (same unit number, different serial number) read identically in the results.',
  '45137':  'Purchase orders: a received order is listed above one still on order.',
  '44828':  'None of the 65 rows for the typed text carried a highlight.',
  '146216': "A contact's e-mail match shows a different detail of the record instead of the e-mail.",
}
OURS = {
  **{c: "The test sent its requests to the production server instead of staging (a server address written into one helper)."
     for c in ('55724', '55723', '45139', '53586', '53587')},
  '55712':  'The search box did not open in time, in the file whose other tests had just failed on the wrong server.',
  **{c: 'The test looked for a technician by a first name that exists only on the old QA branch, so it never switched '
        'person and measured what an administrator sees.' for c in ('45144', '45146', '45147', '45143')},
  '45151':  'The test used a customer and vehicle that exist only on the old QA branch, so it could not create its jobs.',
  '146306': 'The test used an old sign-in route that needs a second cookie nobody supplies any more.',
  '55716':  'The test looked for the two suppliers it had just created in a list that did not include them, and crashed.',
  **{c: 'The test failed on a row that matched on a detail it does not display, which cannot show where a highlight sits.'
     for c in ('146245', '146247', '146266', '146268')},
  '44809':  'The search box did not respond to a click within 60 seconds — test timing, not a product behaviour.',
}
if CLASSIFY:                        # this run's own reading replaces the 2 October one
    _c = json.load(open(CLASSIFY))
    TICKETED = {k: tuple(v) for k, v in _c.get('ticketed', {}).items()}
    POSSIBLE = {k: v[0] if isinstance(v, list) else v for k, v in _c.get('possible', {}).items()}
    POSSIBLE_TODO = {k: v[1] for k, v in _c.get('possible', {}).items() if isinstance(v, list) and len(v) > 1}
    OURS = _c.get('ours', {})
    TEXT = _c.get('text', {})
else:
    POSSIBLE_TODO, TEXT = {}, {}
if REPLACE:                         # the latest attempt at a test is its result; the first is kept beside it
    LABEL = {'expected': 'Passed', 'skipped': 'Stood down', 'unexpected': 'Failed', 'flaky': 'Passed on retry'}
    for r in rows:
        rr = RERUN.get((r['file'], norm(r['title'])))
        if not rr: continue
        first = r['kind'] if r['kind'] != 'Failed' else 'Failed'
        detail = r['reason'] or r['err']
        for k in ('_status', 'kind', 'err', 'reason', 'secs', 'ticket'): r[k] = rr[k]
        r['rerun'], r['rerun_detail'] = f'First run: {first}', detail
        r['replaced'] = True
for r in rows:
    # C55716 (suppliers) still carried a stale "expected to fail" title and crashed: it is a failure.
    if not (r['kind'] == 'Failed' or (r['kind'] == 'Known fault — did not reproduce' and r['cid'] == '55716')):
        continue
    c = r['cid']
    if c in OURS:
        r['kind'], r['why'] = K_OURS, OURS[c]
    elif c in TICKETED:
        r['kind'], (r['rel'], r['why']) = K_TICKET, TICKETED[c]
    elif c in POSSIBLE:
        r['kind'], r['why'] = K_NEW, POSSIBLE[c]
    else:
        r['kind'], r['why'] = K_NEW, 'Not yet looked at.'
    if r.get('replaced'): continue
    rr = RERUN.get((r['file'], norm(r['title'])))
    r['rerun'] = ({'expected': 'Passed', 'skipped': 'Stood down', 'unexpected': 'Failed', 'flaky': 'Passed on retry'}
                  .get(rr['_status'], rr['_status']) if rr else '')
    r['rerun_detail'] = (rr['reason'] or rr['err'] or '') if rr else ''
unclassified = [r['cid'] for r in rows if r['kind'] == 'Failed']
assert not unclassified, unclassified

def cause(r):
    return r.get('why', '') if r['kind'].startswith('Failed') else ''

def related(r):
    return r['ticket'] or r.get('rel')

def happened(r):
    k = r['kind']
    if k == 'Passed': return 'Passed.'
    if k == 'Stood down': return r['reason'] or 'Stood down without a stated reason.'
    if k == 'Known fault — still there':
        return f"Failed in the known way. The fault recorded under {r['ticket']} is still there."
    if k == 'Known fault — did not reproduce':
        return f"The known fault recorded under {r['ticket']} did NOT happen this time — the behaviour may have been fixed."
    return r['err'] or 'Failed (no message recorded).'

def todo(r):
    k = r['kind']
    if k == 'Passed': return ''
    if k == 'Known fault — still there': return 'Nothing new. Already known; waiting on the fix.'
    if k == 'Known fault — did not reproduce':
        return (f"The ticket reads {TICKETS.get(r['ticket'], 'unknown')}. Confirm by hand that the behaviour is fixed; "
                'if it is, this test should stop expecting the fault.')
    if k == 'Stood down':
        return 'Supply what the reason names (a record or a login), then run this case again. Nothing was judged.'
    if k == K_TICKET:
        return (f"Nothing new to raise: this is the behaviour {r['rel']} describes (status {TICKETS.get(r['rel'], 'unknown')}). "
                'It should pass once that fix reaches this build.')
    if k == K_NEW and r['cid'] in POSSIBLE_TODO:
        return POSSIBLE_TODO[r['cid']]
    if k == K_NEW:
        return ('Check it against the requirement as it reads today (not yet done), then decide whether to raise it. '
                'Nothing has been raised.')
    if k == K_OURS:
        rr = r.get('rerun') or 'not re-run'
        return f"The test has been fixed. Re-run after the fix: {rr}."
    return ''

# ---------- workbook ----------
F = 'Arial'
H_FONT = Font(name=F, bold=True, color='FFFFFF'); H_FILL = PatternFill('solid', fgColor='1F3864')
BODY = Font(name=F, size=10); LINK = Font(name=F, size=10, color='0563C1', underline='single')
THIN = Border(bottom=Side(style='thin', color='D9D9D9'))
WRAP = Alignment(wrap_text=True, vertical='top')
FILLS = {'Passed': 'E2EFDA', K_TICKET: 'FFF2CC', K_NEW: 'FCE4D6', K_OURS: 'E4DFEC', 'Known fault — still there': 'FFF2CC',
         'Known fault — did not reproduce': 'DDEBF7', 'Stood down': 'EDEDED'}

COLS = [('Case', 10), ('Case in TestRail', 16), ('Test run', 12), ('What the test checks', 60), ('Result', 22),
        ('Likely cause', 34), ('What happened', 70), ('What needs to be done', 50), ('Ticket', 12),
        ('Ticket status (read live)', 18), ('Spec file', 40), ('Line', 6), ('Seconds', 8),
        ('Re-run after fixing the test' if not REPLACE else 'First result (a re-run replaced it)', 18),
        ('Re-run detail' if not REPLACE else 'What the first result said', 60)]

def sheet(wb, name, data, note):
    ws = wb.create_sheet(name)
    ws['A1'] = note; ws['A1'].font = Font(name=F, size=10, italic=True); ws.merge_cells('A1:O1')
    ws.row_dimensions[1].height = 30; ws['A1'].alignment = WRAP
    for i, (h, w) in enumerate(COLS, 1):
        c = ws.cell(row=2, column=i, value=h); c.font = H_FONT; c.fill = H_FILL; c.alignment = WRAP
        ws.column_dimensions[get_column_letter(i)].width = w
    for n, r in enumerate(data, 3):
        vals = [f"C{r['cid']}" if r['cid'] else '', 'Open case' if r['cid'] else '', 'Run 415',
                r['title'], r['kind'], cause(r), happened(r), todo(r),
                related(r) or '', TICKETS.get(related(r), '') if related(r) else '', r['file'], r['line'], r['secs'],
                r.get('rerun', ''), r.get('rerun_detail', '')[:400]]
        for i, v in enumerate(vals, 1):
            c = ws.cell(row=n, column=i, value=v); c.font = BODY; c.alignment = WRAP; c.border = THIN
        if r['cid']:
            ws.cell(row=n, column=2).hyperlink = TR + r['cid']; ws.cell(row=n, column=2).font = LINK
        ws.cell(row=n, column=3).hyperlink = RUN; ws.cell(row=n, column=3).font = LINK
        if related(r):
            ws.cell(row=n, column=9).hyperlink = JIRA + related(r); ws.cell(row=n, column=9).font = LINK
        ws.cell(row=n, column=5).fill = PatternFill('solid', fgColor=FILLS[r['kind']])
    ws.freeze_panes = 'A3'; ws.auto_filter.ref = f"A2:M{max(2, len(data) + 2)}"
    return ws

wb = Workbook(); summ = wb.active; summ.title = 'Summary'
KINDS = [K_NEW, K_TICKET, K_OURS, 'Known fault — still there', 'Known fault — did not reproduce', 'Stood down', 'Passed']
order = KINDS
srt = sorted(rows, key=lambda r: (order.index(r['kind']), r['file'] or '', r['line'] or 0))
sheet(wb, 'All results', srt, 'Every test in this run, one row each. The Summary counts are formulas over this sheet.')
sheet(wb, 'Possible new problems', [r for r in srt if r['kind'] == K_NEW],
      TEXT.get('possible_note', 'Failures not described by any ticket. NOT yet checked against the requirement as it reads today, and nothing has been raised.'))
sheet(wb, 'Already reported', [r for r in srt if r['kind'] == K_TICKET],
      'Failures showing a behaviour a filed ticket already describes. The ticket and its live status are on each row. Nothing new to raise.')
sheet(wb, "Our test's fault", [r for r in srt if r['kind'] == K_OURS],
      'Failures caused by the test itself, not the product. Each test has been fixed; the last two columns show it re-run on the same build.')
sheet(wb, 'Known faults - still there', [r for r in srt if r['kind'] == 'Known fault — still there'],
      'Tests written to reproduce a fault already recorded in a ticket. They failed in exactly the known way — that is the expected result.')
sheet(wb, 'Known faults - gone', [r for r in srt if r['kind'] == 'Known fault — did not reproduce'],
      'Tests written to reproduce a known fault, where the fault did NOT happen this time. Worth confirming by hand: it may have been fixed.')
sheet(wb, 'Stood down', [r for r in srt if r['kind'] == 'Stood down'],
      'Tests that did not judge the product because something they need was missing. Each says what. These are not passes and not failures.')
sheet(wb, 'Passed', [r for r in srt if r['kind'] == 'Passed'], 'Tests that passed.')

# Summary — counts are FORMULAS over 'All results'
s = summ
s.column_dimensions['A'].width = 44; s.column_dimensions['B'].width = 16; s.column_dimensions['C'].width = 70
s['A1'] = 'Global Search V2 — automated test results'; s['A1'].font = Font(name=F, size=14, bold=True)
info = [('Environment', env), ('Build tested', build), ('Run date', TEXT.get('run_date', '2 October 2026 (full run); fixed tests re-run 2–3 October 2026, same build')),
        ('How it was run', TEXT.get('how', 'npm test from a fresh copy of the branch: the data was seeded and checked first, then every spec ran. '
                           'Failures caused by the tests themselves were then fixed and those test files re-run on the same build.')),
        ('Recorded in TestRail?', 'No — by instruction, this run is reported only in this file.'),
        ('Test run these cases belong to', 'Run 415')]
for i, (k, v) in enumerate(info, 3):
    s.cell(row=i, column=1, value=k).font = Font(name=F, bold=True, size=10)
    c = s.cell(row=i, column=2, value=v); c.font = BODY
    s.merge_cells(start_row=i, start_column=2, end_row=i, end_column=3); c.alignment = WRAP
s['B8'].hyperlink = RUN; s['B8'].font = LINK
r0 = 11
s.cell(row=r0 - 1, column=1, value='Result').font = H_FONT; s.cell(row=r0 - 1, column=1).fill = H_FILL
s.cell(row=r0 - 1, column=2, value='Tests').font = H_FONT; s.cell(row=r0 - 1, column=2).fill = H_FILL
s.cell(row=r0 - 1, column=3, value='What it means').font = H_FONT; s.cell(row=r0 - 1, column=3).fill = H_FILL
meaning = {'Passed': 'The product did what the requirement says.',
           K_NEW: TEXT.get('meaning_new', 'The product did not, and no ticket describes it. Not yet checked against the requirement; nothing raised.'),
           K_TICKET: 'The product did not, in a way a filed ticket already describes. Nothing new.',
           K_OURS: 'The test was at fault, not the product. Fixed; see the re-run result on each row.',
           'Known fault — still there': 'A fault already in a ticket is still present. Expected.',
           'Known fault — did not reproduce': 'A known fault did not happen this time — possibly fixed. Worth checking by hand.',
           'Stood down': 'Not judged: something the test needs was missing. The reason is on each row.'}
for i, k in enumerate(['Passed'] + KINDS[:-1]):
    rr = r0 + i
    s.cell(row=rr, column=1, value=k).font = BODY
    s.cell(row=rr, column=1).fill = PatternFill('solid', fgColor=FILLS[k])
    s.cell(row=rr, column=2, value=f"=COUNTIF('All results'!$E:$E,A{rr})").font = BODY
    c = s.cell(row=rr, column=3, value=meaning[k]); c.font = BODY; c.alignment = WRAP
tot = r0 + len(KINDS)
s.cell(row=tot, column=1, value='Total').font = Font(name=F, bold=True, size=10)
s.cell(row=tot, column=2, value=f'=SUM(B{r0}:B{tot - 1})').font = Font(name=F, bold=True, size=10)
s.cell(row=tot, column=3, value='Should equal the number of tests in the suite (338).').font = BODY
x = tot + 1
s.cell(row=x, column=1, value="Of the test's-fault failures: passed when re-run after the fix").font = BODY
s.cell(row=x, column=1).alignment = WRAP
s.cell(row=x, column=2, value=f"=COUNTIFS('All results'!$E:$E,\"{K_OURS}\",'All results'!$N:$N,\"Passed\")").font = BODY
c = s.cell(row=x, column=3, value='Each was a fault in the test, not the product, and has been fixed. Should equal the line above it in the table.'); c.font = BODY; c.alignment = WRAP

# failures grouped by likely cause
g0 = tot + 4
s.cell(row=g0 - 1, column=1, value='Failures by what happened').font = H_FONT; s.cell(row=g0 - 1, column=1).fill = H_FILL
s.cell(row=g0 - 1, column=2, value='Tests').font = H_FONT; s.cell(row=g0 - 1, column=2).fill = H_FILL
s.cell(row=g0 - 1, column=3, value='').fill = H_FILL
causes = sorted({cause(r) for r in rows if r['kind'].startswith('Failed')})
for i, c_ in enumerate(causes):
    rr = g0 + i
    s.cell(row=rr, column=1, value=c_).font = BODY; s.cell(row=rr, column=1).alignment = WRAP
    s.cell(row=rr, column=2, value=f"=COUNTIF('All results'!$F:$F,A{rr})").font = BODY

# by spec file
f0 = g0 + len(causes) + 3
heads = ['Spec file', 'Passed', 'Possible new', 'Already reported', 'Our test', 'Known still there', 'Known gone', 'Stood down']
for i, h in enumerate(heads, 1):
    c = s.cell(row=f0 - 1, column=i, value=h); c.font = H_FONT; c.fill = H_FILL
for col in 'DEFGH': s.column_dimensions[col].width = 16
keys = ['Passed'] + KINDS[:-1]
for i, fn in enumerate(sorted({r['file'] for r in rows})):
    rr = f0 + i
    s.cell(row=rr, column=1, value=fn).font = BODY
    for j, k in enumerate(keys, 2):
        s.cell(row=rr, column=j, value=f"=COUNTIFS('All results'!$K:$K,$A{rr},'All results'!$E:$E,\"{k}\")").font = BODY
wb.save(out)
print(f'{len(rows)} tests -> {out}')
for k in keys: print(f'  {k:34} {sum(1 for r in rows if r["kind"] == k)}')
