import sys,json
sys.path.insert(0,'build/report-suite/fabian-review-2026-08-17'); import rslib as R
sys.path.insert(0,'build/testing-tools'); from testrail_add_case import add_case_payload

MARK=R.MARKER
def prov(sent): return sent
# ---- Item 7: CSV filter-summary metadata, one per report ----
CSV=[  # (internal_id, section, report_name, story, anchor, filter_lines_desc, title)
 ('SBC-EXP-17',4300,'Sales By Customer',20,'SV-8612','S14-R13a','the date range, the "Product Type: {value}" line, and the "Locations:" line',
   "CSV export repeats the PDF header's Product Type and Locations filter lines"),
 ('SBR-EXP-17',4322,'Sales By Representative',22,'SV-8631','S14-R20a','the date range, the Product Type and payment-status filter lines, and the "Locations:" line',
   "CSV export repeats the PDF header's Product Type, status and Locations lines"),
 ('PV-EXP-13',4335,'Parts Velocity',10,'SV-8646','S6-R11a','the date range and the "Locations:" line, plus any report-specific filter lines the PDF header names',
   "CSV export repeats the PDF header's date range and Locations filter lines"),
 ('TU-EXP-11',4346,'Technician Utilization',9,'SV-8654','S7-R13a','the date range, the technician selection when it is narrowed, and the "Locations:" line',
   "CSV export repeats the PDF header's technician and Locations filter lines"),
 ('WIP-EXP-11',4360,'Work In Progress',21,'SV-8665','S9-R10b','the "as of" date, the active tab and the Advisor / Customer / Asset selections when narrowed, and the "Locations:" line',
   "CSV export repeats the PDF header's as-of date and Locations lines"),
 ('IV-EXP-11',4373,'Inventory Value',10,'SV-8677','S10-R15a','the "as of" date and the "Locations:" line, plus any report-specific filter lines the PDF header names',
   "CSV export shows the PDF header's as-of date and Locations filter lines"),
]
NEW=[]
for iid,sec,name,ver,story,anchor,lines,title in CSV:
    pre=('1. You are signed in to the ShopView App on a desktop browser.\n'
         f'2. The {name} report is open with at least one filter narrowed (for example a chosen date/scope and one or more locations) so the PDF header would show more than one filter line.')
    steps=('1. Download the report as a PDF and read the filter-summary lines in its header area.\n'
           '2. Download the report as a CSV and open it in a plain text editor or spreadsheet.\n'
           '3. Compare the leading rows of the CSV (above the column-header row) with the PDF header lines.')
    exp=(f'1. The CSV carries the same filter-summary lines as the PDF header - {lines} - each as a leading metadata row above the column-header row.\n'
         '2. The lines appear verbatim (the same wording) and in the same order as in the PDF header.\n'
         '3. A CSV saved or forwarded later is never ambiguous about which filters produced it: every filter the PDF header names is present in the CSV.\n'
         '4. Note for the tester: this is the suite-wide rule that the CSV must name the same filters as the PDF. If your report shows no narrowed filters, widen or narrow one so at least one filter line appears, then compare again.')
    body=exp
    pr=(f"This is the expected behaviour as per epic SV-8582 and the {name} report specification version {ver} ({anchor}), both read on 17 August 2026. "
        f"{anchor} is the suite-wide rule (added 2026-08-12, SV-9283) that the CSV carries every filter-summary line the PDF header names.")
    expF=R.assemble(body, pr)
    refs=f"{story} ({name.split()[0] if False else ('SBC' if 'Customer' in name else 'SBR' if 'Representative' in name else 'PV' if 'Parts' in name else 'TU' if 'Technician' in name else 'WIP' if 'Progress' in name else 'IV')} spec v{ver} 2026-08-17 {anchor}; suite-wide CSV filter-summary rule SV-9283)"
    NEW.append((iid,sec,title,pre,steps,expF,refs))

# ---- Items 2/3/4: Loom-sourced visual conformance (VIU-confirm exact styling) ----
VIS=[
 ('SUITE-VIS-TAB-01',4361,'Work In Progress',21,
  'Active view tab shows the selected-tab highlight (amber glow) when clicked',
  '1. You are signed in to the ShopView App on a desktop browser.\n2. A report with more than one view tab is open (for example the Work In Progress progress tabs).',
  '1. Note which tab is active on arrival.\n2. Click a different tab.\n3. Look at the tab you clicked and the tabs you did not.',
  ['1. When a tab is clicked it becomes the active tab and is visually distinguished from the inactive tabs by a highlight - a coloured glow around or under the active tab.',
   '2. Only one tab shows the active highlight at a time; clicking another tab moves the highlight to it.',
   '3. VIU-confirm against the design/build: the exact highlight colour is described in the design review as an "amber" glow - confirm the exact colour/shade and the exact glow style (outline, underline or shadow) live before pinning them; do not invent a hex value.',
   '4. Note for the tester: this is the shared reporting-shell tab treatment, so it looks the same on every report that has tabs.'],
  'SV-8593','shell tab styling'),
 ('SUITE-VIS-HDR-01',4326,'Sales By Representative',22,
  'Long column header labels wrap to two lines instead of being truncated',
  '1. You are signed in to the ShopView App on a desktop browser.\n2. A report with several columns and long header labels is open (for example Sales By Representative, which has the most columns).',
  '1. Read the column header row.\n2. Find a column whose label is longer than its column is wide (for example a two-word metric heading).\n3. Check whether that label is cut off or shown in full.',
  ['1. A column header label that is too long for its column width wraps onto a second line and is shown in full.',
   '2. The label is NOT truncated with an ellipsis ("...") and is NOT cut off - the header row grows to two lines tall as needed so every heading is fully readable.',
   '3. VIU-confirm against the design/build: confirm live which headings actually wrap on each report and that the two-line header row stays aligned with the data columns beneath it.',
   '4. Note for the tester: this is the shared reporting-shell header treatment, so it applies on every report.'],
  'SV-8593','shell header wrapping'),
 ('SUITE-VIS-GRP-01',4303,'Sales By Customer',20,
  'A group/summary row presents its rolled-up totals as an inline math strip',
  '1. You are signed in to the ShopView App on a desktop browser.\n2. A report with group/summary rows is open (for example Sales By Customer, whose customer and asset rows roll up their invoices).',
  '1. Find a group/summary row that rolls up several child rows (a customer row over its assets and invoices).\n2. Read the rolled-up values shown on that group row, including the Labor Delta total.',
  ['1. A group/summary row shows its rolled-up column totals (the sum across its child rows), including the Labor Delta total, in the same column positions and formats as a data row.',
   '2. Those rolled-up totals are presented together as a compact inline "math strip" on the group row - the design-review treatment for grouped totals.',
   '3. VIU-confirm against the design/build: the exact visual layout of the "math strip" (spacing, separators, whether the operator/equals signs are shown) is described only in the design review - confirm the exact presentation live before pinning it; do not invent the layout.',
   '4. Note for the tester: the rolled-up numbers themselves must tie out to the sum of the child rows; only the visual "math strip" styling is what this case is confirming.'],
  'SV-8593','grouped-totals math strip'),
]
for iid,sec,name,ver,title,pre,steps,exp_items,story,what in VIS:
    body='\n'.join(exp_items)
    rpref=('SBC' if 'Customer' in name else 'SBR' if 'Representative' in name else 'WIP')
    pr=(f"This is the expected behaviour as per epic SV-8582, the reporting-shell story {story}, and Chris Ward's design-review decisions of 17 August 2026 (the {what}). "
        f"The {name} report specification version {ver} does not name this visual treatment, so the exact styling is Loom-sourced and is marked VIU-confirm above (read on 17 August 2026).")
    expF=R.assemble(body,pr)
    refs=f"{story} ({rpref} spec v{ver} 2026-08-17; {what} per Chris Ward design review 2026-08-17; exact styling VIU-confirm)"
    NEW.append((iid,sec,title,pre,steps,expF,refs))

# build + validate lengths
out=[]
for iid,sec,title,pre,steps,expF,refs in NEW:
    if len(title)>80: raise SystemExit(f'title>80 {iid} {len(title)}')
    if len(refs)>248: raise SystemExit(f'refs>248 {iid} {len(refs)}')
    if '<' in expF or '>' in expF.replace('->',''):
        pass
    out.append(dict(id=iid,section_id=sec,title=title,preconds=pre,steps=steps,expected=expF,refs=refs))
json.dump(out,open('/tmp/new_cases.json','w'))
print('built',len(out),'new cases')
for o in out: print(o['id'],'sec',o['section_id'],'title_len',len(o['title']),'refs_len',len(o['refs']))
