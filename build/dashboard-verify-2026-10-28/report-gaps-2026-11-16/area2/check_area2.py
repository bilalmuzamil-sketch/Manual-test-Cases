#!/usr/bin/env python3
"""Area 2 checker: screen facts (evidence/screen-facts.json) + downloaded files (/tmp/cln/rg16/a2, never committed)
against QUOTED requirements. Reports with no written source for a feature get 'NO SOURCE' rows (facts recorded only).
Writes evidence/area2-checks.json (no names: only headers, counts, totals numbers, file names). Run: python3 check_area2.py"""
import json, csv, io, re, os, collections
import pypdf
D = os.path.dirname(os.path.abspath(__file__)); F = json.load(open(f'{D}/evidence/screen-facts.json'))['reports']
S = {'WIP': 'WIP spec, Confluence 703660034 v28 (24 Aug 2026)', 'TU': 'TU spec, Confluence 641400833 v9 (13 Aug 2026)', 'SBC': 'SBC spec, Confluence 577634305 v22 (20 Oct 2026)',
     'SBR': 'SBR spec, Confluence 585629698 v30 (21 Oct 2026)', 'ARAP': 'A/R and A/P Report Sorting, Export and Location Filter, Confluence 947650561 (last modified 13 Nov 2026)'}
NUM = lambda s: [x.replace(',', '').replace('$', '') for x in re.findall(r'-?\$?-?[\d,]+\.\d{2}', s or '')]
def csvinfo(p):
    t = open(p, encoding='utf-8-sig', errors='replace').read(); L = t.splitlines()
    hi = next((i for i, l in enumerate(L) if l.count(',') >= 2 and not re.match(r'^"?[A-Za-z ]+:\s', l)), 0)
    rows = list(csv.reader(io.StringIO('\n'.join(L[hi:])))); head = rows[0] if rows else []
    body = [r for r in rows[1:] if any(c.strip() for c in r)]; tot = [r for r in body if r and re.match(r'^(Totals?|Summary)\b', r[0].strip(), re.I)]
    return {'preamble': L[:hi], 'header': head, 'data_rows': len(body) - len(tot), 'totals_row_numbers': NUM(','.join(tot[0])) if tot else None, 'bom': t.startswith('﻿')}
def pdfinfo(p):
    try:
        r = pypdf.PdfReader(p); t = '\n'.join((pg.extract_text() or '') for pg in r.pages[:3])
        return {'pages': len(r.pages), 'has_Locations': 'Locations:' in t, 'has_total_word': bool(re.search(r'\bTotals?\b|\bSummary\b', t)), 'first_line': t.strip().splitlines()[0][:60] if t.strip() else ''}
    except Exception as e: return {'error': str(e)[:100]}
clean = lambda h: re.sub(r'\s+', ' ', re.sub(r'\b(keyboard_double_arrow_down|keyboard_double_arrow_up|arrow_drop_up|arrow_drop_down|info)\b', ' ', h)).strip()
out = []
def row(rep, req, src, quote, observed, verdict, ev='evidence/screen-facts.json'): out.append({'report': rep, 'req': req, 'source': src, 'quote': quote, 'observed': observed, 'verdict': verdict, 'evidence': ev})
def common(rep, f):
    """Facts recorded for every report (used when no written source exists)."""
    fi = f.get('first') or {}; dl = f.get('downloads') or []
    return {'export_menu': [x['t'] for x in (f.get('export_menu') or [])], 'files': [d.get('filename') or d.get('popup_url') or d.get('result') for d in dl],
            'toasts': sorted({t for d in dl for t in d.get('toasts', [])})[:3], 'column_control': bool(fi.get('column_btn')), 'column_remembered': (f.get('columns') or {}).get('remembered'),
            'sortable_headers': sum(1 for h in fi.get('heads', []) if h.get('sortable')), 'headers': len(fi.get('heads', [])), 'unnamed_controls': fi.get('unnamed_count'),
            'keyboard_reaches_export': (f.get('keyboard') or {}).get('reached_export'), 'keyboard_reaches_columns': (f.get('keyboard') or {}).get('reached_columns'),
            'enter_opens_export_menu': (f.get('keyboard') or {}).get('enter_opens_export_menu'), 'error': f.get('error')}
for rep, f in F.items():
    fi = f.get('first') or {}; dl = f.get('downloads') or []; menu = [x['t'] for x in (f.get('export_menu') or [])]
    files = {d.get('filename'): d for d in dl if d.get('filename')}; heads = [clean(h['t']) for h in fi.get('heads', []) if clean(h['t'])]
    colmenu = [x['t'] for x in (f.get('column_menu') or [])]; rem = (f.get('columns') or {}).get('remembered')
    toasts = sorted({t for d in dl for t in d.get('toasts', [])})
    csvs = {n: csvinfo(d['saved']) for n, d in files.items() if n.endswith('.csv') and os.path.exists(d['saved'])}
    pdfs = {n: pdfinfo(d['saved']) for n, d in files.items() if n.endswith('.pdf') and os.path.exists(d['saved'])}
    scr_tot = NUM(' '.join(fi.get('totals') or []))
    fam = {'work-in-progress': 'WIP', 'technician-utilization': 'TU', 'sales-by-customer': 'SBC', 'sales-by-representative': 'SBR'}.get(rep) or ('ARAP' if re.match(r'a[rp]-', rep) else None)
    facts = common(rep, f) | {'csv': {n: {k: v for k, v in c.items() if k != 'preamble'} | {'preamble_keys': [re.split(r':', p)[0][:20] for p in c['preamble']]} for n, c in csvs.items()}, 'pdf': pdfs, 'screen_totals_numbers': scr_tot}
    if not fam:
        row(rep, '—', 'NO SOURCE', 'No written spec found for this report\'s downloads, column chooser, sorting or accessibility (28 Oct searches; Jira-only sources describe calculations).', facts, 'NO SOURCE (facts recorded)'); continue
    src = S[fam]
    def chk(req, quote, ok, obs): row(rep, req, src, quote, obs, 'PASS' if ok else ('FAIL' if ok is False else 'NOT VERIFIED'))
    if fam == 'WIP':
        chk('S9-R1', 'The toolbar has a menu, opened from a three-dot button, holding the download options "Download (PDF)" and "Download (CSV)".', sorted(menu) == ['Download (CSV)', 'Download (PDF)'], menu)
        chk('S9-R9', 'The downloaded files are named "wip-2-report.pdf" and "wip-2-report.csv".', set(files) == {'wip-2-report.pdf', 'wip-2-report.csv'}, list(files))
        want = ['wip-2-report.csv']
    elif fam == 'TU':
        exp = ['Download Summary (PDF)', 'Download Expanded View (PDF)', 'Download Summary (CSV)', 'Download Expanded View (CSV)']
        chk('S7-R2..R4a', 'The menu has an option labeled "Download Summary (PDF)" / "Download Expanded View (PDF)" / "Download Summary (CSV)" / "Download Expanded View (CSV)".', sorted(menu) == sorted(exp), menu)
        chk('S7-R12', 'The downloaded files are named "Technician-Utilization-Summary.pdf", "Technician-Utilization-Expanded.pdf", and "technician-utilization.csv".', {'Technician-Utilization-Summary.pdf', 'Technician-Utilization-Expanded.pdf', 'technician-utilization.csv'} <= set(files), list(files))
        chk('S8-R16', 'The icon-only Column Selection control carries an accessible name exposed to assistive technology.', bool((fi.get('column_btn') or {}).get('aria')), fi.get('column_btn'))
        th = [h for h in fi.get('heads', [])]; act = [h for h in th if h.get('aria_sort') in ('ascending', 'descending')]
        chk('S8-R10', 'The active sort column header exposes its sort state to assistive technology (aria-sort = ascending/descending on the active header, none on the others).', bool(act) and clean(act[0]['t']).startswith('Technician'), [(clean(h['t']), h.get('aria_sort')) for h in th])
        chk('S2-R13', 'All six columns (Technician, Total Hours, WO Hours, Internal Hours, Utilization %, Est. Lost Labor) are sortable by clicking the column header.', sum(1 for h in th if h.get('sortable')) >= 6 or None if not th else sum(1 for h in th if h.get('sortable')) >= 6, {'sortable': sum(1 for h in th if h.get('sortable')), 'headers': heads, 'note': 'sortable = Quasar th.sortable class; a custom header may sort without it — see sorting clicks'})
        want = ['technician-utilization.csv']
    elif fam == 'SBC':
        exp = ['Download Summary (PDF)', 'Download Expanded View (PDF)', 'Download Summary (CSV)', 'Download Expanded View (CSV)']
        chk('S14-R2/S15-R2', 'The two menu items read exactly "Download Summary (CSV)" and "Download Expanded View (CSV)." / "Download Summary (PDF)" and "Download Expanded View (PDF)."', sorted(menu) == sorted(exp), menu)
        rng = [n for n in files if n.startswith('sales-by-customer-')]
        chk('S14-R14/S15-R6', 'the Summary CSV is sales-by-customer-summary-{range}.csv and the Expanded CSV is sales-by-customer-expanded-{range}.csv … This Month → this_month', {'sales-by-customer-summary-this_month.csv', 'sales-by-customer-expanded-this_month.csv', 'sales-by-customer-summary-this_month.pdf', 'sales-by-customer-expanded-this_month.pdf'} <= set(files), rng)
        chk('S13-R6', 'The Customer and Subtotal columns, and the chevron control column, are always present and do not appear in the toggle list.', bool(colmenu) and not ({'Customer', 'Subtotal'} & set(colmenu)), colmenu)
        chk('S13-R8', "The user's column selection is remembered between visits — see Story 6.", rem, f.get('columns'))
        chk('S10-R1', 'Every column is sortable except the chevron column.', bool(fi.get('heads')) and all(h.get('sortable') for h in fi['heads'] if clean(h['t'])), [(clean(h['t']), h.get('sortable')) for h in fi.get('heads', [])])
        want = [n for n in csvs if 'summary' in n]
    elif fam == 'SBR':
        exp = ['Download Summary (PDF)', 'Download Expanded View (PDF)', 'Download Summary (CSV)', 'Download Expanded View (CSV)']
        chk('S14-R1', 'The toolbar\'s ⋯ overflow menu lists exactly four actions: "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)", "Download Expanded View (CSV)"', sorted(menu) == sorted(exp), menu)
        chk('S14-R11/R15/R16', 'sales-by-representative-summary.pdf / -expanded.pdf / -summary.csv / -expanded.csv', {'sales-by-representative-summary.pdf', 'sales-by-representative-expanded.pdf', 'sales-by-representative-summary.csv', 'sales-by-representative-expanded.csv'} <= set(files), list(files))
        chk('S20-R3', 'The five always-visible columns (Date, Invoice, Customer, Status, Subtotal) do not appear in the dropdown and cannot be hidden.', bool(colmenu) and not ({'Date', 'Invoice', 'Customer', 'Status', 'Subtotal'} & set(colmenu)), colmenu)
        chk('S20-R5', 'Column visibility is persisted and restored per Story 23.', rem, f.get('columns'))
        want = [n for n in csvs if 'summary' in n]
    else:
        chk('S3-R1', 'Each of the six reports has the native report Export menu (the ⋯ button at the right of the title row, labelled "Export report") with "Download (PDF)" and "Download (CSV)".', (fi.get('export_btn') or {}).get('aria') == 'Export report' and sorted(menu) == ['Download (CSV)', 'Download (PDF)'], {'button': fi.get('export_btn'), 'menu': menu})
        chk('S2-R1', "Every column on all six reports sorts when its header is clicked, except A/P Unpaid Invoices' Vendor Name column (S2-N1).", bool(fi.get('heads')) and all(h.get('sortable') or (rep == 'ap-unpaid-invoices' and 'Vendor' in h['t']) for h in fi['heads'] if clean(h['t'])), [(clean(h['t']), h.get('sortable')) for h in fi.get('heads', [])])
        c = next(iter(csvs.values()), None)
        chk('S3-R4/S3-R8', 'the CSV "As of: Oct 15, 2026" … The CSV starts with the lines of S3-R5, each in its own row, in this order: As of, Locations', None if not c else bool(c['preamble']) and c['preamble'][0].strip('"').startswith('As of:') and any(p.strip('"').startswith('Locations:') for p in c['preamble'][1:2]), c['preamble'] if c else 'no CSV downloaded')
        want = list(csvs)[:1]
    # shared download checks (where the family's spec has them)
    succ = {'WIP': 'S9-R11', 'ARAP': 'S3-R10'}.get(fam)
    if succ: chk(succ, 'On a successful download the user sees a success notification with the caption "Data exported successfully."', None if not dl else any('Data exported successfully.' in t for t in toasts), toasts)
    loc = {'WIP': 'S9-R10a', 'TU': 'S7-R13a', 'SBC': 'S14-R13', 'SBR': 'S14-R20a', 'ARAP': 'S3-R5'}[fam]
    for n in want:
        c = csvs.get(n)
        if not c: chk(loc, 'Each download includes a "Locations:" line naming the location or locations the report is scoped to', None, f'{n} not downloaded'); continue
        chk(loc, 'Each download includes a "Locations:" line naming the location or locations the report is scoped to (CSV)', any(p.strip('"').startswith('Locations:') for p in c['preamble']), [p[:40] for p in c['preamble']])
        if fam in ('WIP',):
            ren = {'Unit': 'Asset', 'Branch': 'Location'}; ch = [ren.get(h, h) for h in c['header']]
            chk('S9-R2', 'Both downloads include only the columns currently shown, in the same left-to-right order as the screen, with Total last.', [h.lower() for h in ch] == [h.lower() for h in heads], {'csv': c['header'], 'screen': heads})
            chk('S9-R4', 'Both downloads include a Totals row matching the on-screen Totals row for the tab.', c['totals_row_numbers'] is not None and sorted(c['totals_row_numbers']) == sorted(scr_tot), {'csv': c['totals_row_numbers'], 'screen': scr_tot})
    if fam in ('WIP', 'TU', 'SBC', 'SBR'):
        req = {'WIP': ('S8-R7', 'The report remembers, in the user\'s browser, … column selection … and restores them on the user\'s next visit.'), 'TU': ('S10-R6', "The report remembers the user's column selection in the browser … and restores it on the next visit")}.get(fam)
        if req: chk(req[0], req[1], rem, f.get('columns'))
    row(rep, 'facts', src, '(facts recorded for the record; not a requirement)', facts, 'INFO')
json.dump(out, open(f'{D}/evidence/area2-checks.json', 'w'), indent=1, default=str)
T = collections.Counter((r['report'], r['verdict']) for r in out if r['verdict'] != 'INFO')
for r in out:
    if r['verdict'] not in ('INFO',): print(f"{r['report'][:24]:24} {r['req'][:16]:16} {r['verdict']:28} {json.dumps(r['observed'], default=str)[:150]}")
