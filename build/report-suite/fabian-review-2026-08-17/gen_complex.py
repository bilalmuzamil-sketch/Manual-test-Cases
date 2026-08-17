import sys,json,re
sys.path.insert(0,'build/report-suite/fabian-review-2026-08-17'); import rslib as R
live=json.load(open('/tmp/live_ours.json'))

# Per-case: replacements (applied to title,preconds,steps,body), anchors, optional chris-file sentence (verbatim, own read-date)
NOTE9071=' The column was renamed from "Inv. Hrs" to "Labor Delta" per SV-9071; only the name changed.'
CHRIS='https://docs.google.com/spreadsheets/d/1x8cuYJlFsDHalVZZTh156_ZCq2gcOaGY/edit?usp=sharing&ouid=106388879401921597782&rtpof=true&sd=true'
SPEC={'SBC':('Sales By Customer',20),'SBR':('Sales By Representative',22),'WIP':('Work In Progress',21)}

C={}
def add(cid, story, anchors, reps, prov_extra='', note=True):
    C[cid]=dict(story=story,anchors=anchors,reps=reps,prov_extra=prov_extra,note=note)

# ---- SBC ----
add(30124,'SV-8608','S8-R12; S7-R17; S7-R18',
 [('per-invoice Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, and Subtotal',
   'per-invoice Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, and Subtotal')])
add(30142,'SV-8608','S10-R1; S10-R2; S10-R6; S13-R4',
 [('Customer, Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal',
   'Customer, Date, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal')])
add(30149,'SV-8609','S7-R17; S7-R18; §Terminology Subtotal and Margin include Adjustments',
 [('The financial columns appear in this order: Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin % — with Subtotal as the rightmost column.',
   'The financial columns appear in this order: Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin % — with Subtotal as the rightmost column.'),
  ('Subtotal = Labor Invoiced + Parts Invoiced + Shop Supplies, before tax.',
   'Subtotal = Labor Invoiced + Parts Invoiced + Shop Supplies + Adjustments, before tax.'),
  ('Margin = Labor Margin + Parts Margin — it does NOT include any Shop Supplies amount (shop supplies add to Subtotal but add no profit to Margin).',
   'Margin = Labor Margin + Parts Margin + Adjustments — it does NOT include any Shop Supplies amount (shop supplies add to Subtotal but add no profit to Margin). Adjustments (the signed net of invoice-level fees and discounts) is never allocated into Labor or Parts and carries no cost, so its full amount flows into Margin.')])
add(30156,'SV-8611','S13-R4',
 [('nine toggles','ten toggles'),
  ('The panel lists nine toggles, in order: Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %.',
   'The panel lists ten toggles, in order: Date, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %.'),
  ('all nine toggleable columns default to visible','all ten toggleable columns default to visible'),
  ('this panel lists nine toggles and no Location toggle','this panel lists ten toggles and no Location toggle')])
add(30161,'SV-8612','S14-R5',
 [('these thirteen columns in this exact order: Customer, Asset, Invoice #, Date, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal. When the Location column is shown on screen the file also carries it — immediately after Date, the position it holds on screen — making fourteen.',
   'these fourteen columns in this exact order: Customer, Asset, Invoice #, Date, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal. When the Location column is shown on screen the file also carries it — immediately after Date, the position it holds on screen — making fifteen.')])
add(30169,'SV-8612','S14-R5',
 [('thirteen columns when the Location column is not shown on screen, plus the Location column immediately after Date whenever it is shown.',
   'fourteen columns (Customer, Asset, Invoice #, Date, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal) when the Location column is not shown on screen, plus the Location column immediately after Date whenever it is shown.')])
add(38856,'SV-8612','S14-R4',
 [('these ten columns in this exact order: Customer, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Margin, Margin %, Subtotal',
   'these eleven columns in this exact order: Customer, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal')])
add(30151,'SV-8610','S12-R1; S12-R2; S12-R3; S12-R4; S12-R5; S12-R6',
 [('Inv. Hrs heading is verbatim','Labor Delta heading is verbatim'),
  ('The column heading reads "Inv. Hrs" (including the period after "Inv").','The column heading reads "Labor Delta".')])

# ---- SBR ----
add(30218,'SV-8622','S5-R2',
 [('Row layout: 12 columns','Row layout: 13 columns'),
  ('Date, Invoice, Customer, Status, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal (12 columns)',
   'Date, Invoice, Customer, Status, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Adjustments, Margin, Margin %, Subtotal (13 columns)'),
  ('it sits immediately after Status, making 13.','it sits immediately after Status, making 14.')])
add(30235,'SV-8626','§3 negative money columns',
 [('across every money column (Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Subtotal).',
   'across every money column (Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Adjustments, Margin, Subtotal).'),
  ('Inv. Hrs (a signed time value) and Margin % (a signed percentage) are excluded','Labor Delta (a signed time value) and Margin % (a signed percentage) are excluded')])
add(30241,'SV-8628','S11-R1; S11-R6',
 [('All eight financial columns are sortable','All nine financial columns are sortable'),
  ('Click each financial column header in turn: Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal.',
   'Click each financial column header in turn: Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Adjustments, Margin, Margin %, Subtotal.')])
add(30265,'SV-8630','S20-R2',
 [('seven metric toggles','eight metric toggles'),
  ('lists the seven toggleable metric columns, each with a toggle switch: Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %.',
   'lists the eight toggleable metric columns, each with a toggle switch: Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Adjustments, Margin, Margin %.'),
  ('On first visit all seven metric columns are visible.','On first visit all eight metric columns are visible.'),
  ('With all seven metric columns hidden','With all eight metric columns hidden')])
add(30229,'SV-8626','S9-R1; S9-R2; §3',
 [('Inv. Hrs is hours invoiced minus hours worked','Labor Delta is hours invoiced minus hours worked'),
  ('The column heading reads "Inv. Hrs" (verbatim, including the period after "Inv").','The column heading reads "Labor Delta".'),
  ('item 1 passes — the heading really does read "Inv. Hrs" with the period. Item 2 does not: the value reads 0.0 everywhere',
   'the Labor Delta value reads 0.0 everywhere')])
add(30279,'SV-8631','S14-R6',
 [('/ Parts Invoiced / Parts Margin / Margin / Margin % / Subtotal.',
   '/ Parts Invoiced / Parts Margin / Adjustments / Margin / Margin % / Subtotal.')])
add(30278,'SV-8631','S14-R5',
 [('Rep / Inv. Hrs / Labor Invoiced / Labor Margin / Parts Invoiced / Parts Margin / Margin / Margin % / Subtotal.',
   'Rep / Labor Delta / Labor Invoiced / Labor Margin / Parts Invoiced / Parts Margin / Adjustments / Margin / Margin % / Subtotal.'),
  ('Inv. Hrs keeps its green/red/default coloring.','Labor Delta keeps its green/red/default coloring.')],
 prov_extra=f"Chris Ward's decision of 5 August 2026, recorded in his answers in this file: {CHRIS}, governs the layout where the specification is silent (read on 11 August 2026).", note=True)
add(30285,'SV-8631','S14-R15',
 [('Representative, # Invoices, # Customers, Hrs Worked, Hrs Invoiced, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal. On this build only nine of them arrive - Representative, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal - because # Invoices, # Customers, Hrs Worked and Hrs Invoiced are missing by mistake. Record what you see; the four missing columns are with the developers.',
   'Representative, # Invoices, # Customers, Hrs Worked, Hrs Invoiced, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Adjustments, Margin, Margin %, Subtotal. On this build the four hours-related columns - # Invoices, # Customers, Hrs Worked and Hrs Invoiced - are missing by mistake. Record what you see; the four missing columns are with the developers.'),
  ('the Summary spreadsheet arrives with only nine of the thirteen column headings - # Invoices, # Customers, Hrs Worked and Hrs Invoiced are all absent -',
   'the Summary spreadsheet is missing four column headings - # Invoices, # Customers, Hrs Worked and Hrs Invoiced are all absent -')],
 prov_extra=f"Chris Ward's decision of 5 August 2026, recorded in his answers in this file: {CHRIS}, governs where the specification differs (read on 11 August 2026).", note=True)
add(30286,'SV-8631','S14-R16',
 [('Representative, Date, Invoice #, Customer, Status, Hrs Worked, Hrs Invoiced, Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin, Margin %, Subtotal.',
   'Representative, Date, Invoice #, Customer, Status, Hrs Worked, Hrs Invoiced, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Adjustments, Margin, Margin %, Subtotal.')],
 prov_extra=f"Chris Ward's decision of 5 August 2026, recorded in his answers in this file: {CHRIS}, governs where the specification differs (read on 11 August 2026).", note=True)
add(38913,'SV-8638','S21-R7; S14-R20',
 [("on today's build the column selector on this report lists only Inv. Hrs, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Margin and Margin % — there is no Location entry in it to switch off. Step 8 therefore cannot be carried out as written: mark step 8 as blocked and record the other steps as normal.",
   "the column selector on this report lists the metric columns (Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Adjustments, Margin, Margin %) and no Location entry, because the Location column is shown automatically rather than toggled. Step 8 therefore cannot be carried out as written: mark step 8 as blocked and record the other steps as normal.")])

# ---- WIP ----
add(30466,'SV-8660','S4-R1',
 [('WO #, Status, Customer, Asset, VIN, Location, Advisor, Days Open, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Earned, Remaining, Inv. Hrs, Total.',
   'WO #, Status, Customer, Asset, VIN, Location, Advisor, Days Open, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Earned, Remaining, Adjustments, Labor Delta, Total.')])
add(30507,'SV-8664','S4-R1; S8-R7',
 [('WO #, Status, Customer, Asset, VIN, Location, Advisor, Days Open, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Earned, Remaining, Inv. Hrs, Total)',
   'WO #, Status, Customer, Asset, VIN, Location, Advisor, Days Open, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Earned, Remaining, Adjustments, Labor Delta, Total)')])
add(30467,'SV-8660; SV-8664','S4-R2; S4-R3; S8-R3; S8-R4',
 [('VIN, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Inv. Hrs) is available in the column-selection control',
   'VIN, Last Activity, Labor Earned, Labor Remaining, Parts Earned, Parts Remaining, Adjustments, Labor Delta) is available in the column-selection control')],
 prov_extra="Chris Ward confirmed this same Location rule in his answers of 10 August 2026 (build/report-suite/chris-answers-2026-08-10/), and the specification agrees (read on 10 August 2026).", note=True)

def build():
    out=[]
    for cid,spec in C.items():
        c=live[str(cid)]; rep=R.report_of(c['section_id']); name,ver=SPEC[rep]
        title=c['title']; pre=c.get('custom_preconds','')or''; steps=c.get('custom_steps','')or''
        body,_,_=R.split_expected(c['custom_expected'])
        def ap(s):
            for old,new in sorted(spec['reps'], key=lambda x:-len(x[0])):
                if old in s: s=s.replace(old,new)
            s=s.replace('Inv. Hrs','Labor Delta').replace('Inv.Hrs','Labor Delta')  # blanket catch, after targeted
            return s
        ntitle=ap(title); npre=ap(pre); nsteps=ap(steps); nbody=ap(body)
        # assert every replacement fired somewhere across the four fields
        joined_before=title+'\n'+pre+'\n'+steps+'\n'+body
        for old,new in spec['reps']:
            if old not in joined_before:
                raise SystemExit(f"!! C{cid}: OLD not found: {old[:70]!r}")
        # no residual Inv. Hrs in tester text
        if 'Inv. Hrs' in (ntitle+npre+nsteps+nbody):
            raise SystemExit(f"!! C{cid}: residual 'Inv. Hrs' after replace")
        prov=f"This is the expected behaviour as per epic SV-8582 and the {name} report specification version {ver} ({spec['anchors']}), both read on 17 August 2026."
        if spec['note']: prov+=NOTE9071
        if spec['prov_extra']: prov+=' '+spec['prov_extra']
        nexp=R.assemble(nbody, prov)
        nrefs=f"{spec['story']} ({rep} spec v{ver} 2026-08-17 {spec['anchors']}; renamed to Labor Delta per SV-9071)"
        if len(nrefs)>248: nrefs=f"{spec['story']} ({rep} spec v{ver} 2026-08-17 {spec['anchors']})"
        if len(nrefs)>248: raise SystemExit(f'!! C{cid} refs too long {len(nrefs)}')
        payload={'title':ntitle,'custom_preconds':npre,'custom_steps':nsteps,'custom_expected':nexp,'refs':nrefs}
        out.append((cid,payload))
    return out

if __name__=='__main__':
    out=build()
    json.dump(out, open('/tmp/complex_payloads.json','w'))
    print(f"built {len(out)} complex payloads OK")
    for cid,p in out:
        print('='*72,'C'+str(cid),'refs',len(p['refs']))
