"""Build TECH-PLAN-TESTABLE.json from tools/_rows.json (made by assemble.py, quotes already verified verbatim)."""
import json, re, collections
rows = json.load(open('tools/_rows.json', encoding='utf-8'))
lines = open('../sources/TECH-PLAN-Internal-Work-Orders-upload-2026-11-12.md', encoding='utf-8').read().split('\n')
# where each plan line sits (section map)
SECTIONS = [(1,'Header'),(12,'§0 Execution State'),(58,'§1 Requirements / NFR / Clarifications'),(426,'§2 Architecture'),
 (459,'§3 Technical Decisions'),(538,'§4 Database Changes'),(578,'§5 API Changes'),(597,'§6 Implementation Phases'),
 (1068,'§7 Testing Strategy'),(1779,'§8 Rollback'),(1788,'§9 Performance & Security'),(1808,'§10 Traceability'),
 (2233,'§11 Verification Tickets'),(2256,'Appendix A (backend)'),(3121,'Appendix B (frontend)'),(3819,'Appendix C (AccountingHub)'),
 (5014,'Appendix D (customer portal)')]
def section(n):
    s = SECTIONS[0][1]
    for start, name in SECTIONS:
        if n >= start: s = name
    return s
DIVERGE_LINES = {1867, 2293}
out, context = [], []
for r in rows:
    v, inv, design = r['raw_verdict'], False, False
    if v == 'INFO':
        context.append({'plan_line': r['line'], 'section': section(r['line']), 'quote': r['quote'], 'prd_code': r['prd'], 'note': r['note']}); continue
    if v == 'INV':
        inv = True; v = 'ADD' if 'silent' in r['prd'].lower() else 'CONFIRM'
    elif v == 'DESIGN':
        design = True; v = 'ADD' if r['line'] == 3878 else 'CONFIRM'
    elif v == 'CHECK':
        v = 'DIVERGE' if r['line'] in DIVERGE_LINES else ('ADD' if r['line'] == 5298 else 'CONFIRM')
    out.append({'plan_line': r['line'], 'section': section(r['line']), 'quote': r['quote'], 'prd_code': r['prd'], 'verdict': v,
                'invariant': inv, 'design_differs_from_prd': design, 'note': r['note']})
PRDQ = {
 365: ('S3-R6', 'The asset Invoices tab lists the closed work order with status Closed, the badge, Total balance "No Charge" and Discount and Tax rate empty (rows on that tab have no actions).'),
 367: ('S9-R6', 'Parts cost and shop supplies of these work orders are in the Internal Work Orders report (S9-R2), not in this export.'),
 377: ('S6-R2', 'Warranty and Goodwill both default to 6430 Warranty & Goodwill Expense, already in the newer chart.'),
 501: ('S8-R1', 'a summary (number, customer, asset, classification, category, original work order when set, posting date, "No Charge", and the posted Parts cost and Shop supplies totals)'),
 1062: ('S13-R4', 'The steps run before the release is visible to users, in this order: categories, QuickBooks rows, hub accounts and mappings.'),
 1867: ('S2-E3', 'An imported work order takes the classification of its customer at import: internal for a flagged customer while the setting is on, billable otherwise.'),
 2293: ('S2-E3', 'An imported work order takes the classification of its customer at import: internal for a flagged customer while the setting is on, billable otherwise.'),
 2503: ('S7-R8', 'Create invoice first opens "Create invoice [number]?" with one "Moved from [account] to [account]" row per move and the buttons Cancel and "Create invoice"'),
 3368: ('S2-R10', 'The Status chip on the All tab gets the value "Closed", which matches only closed internal and no-charge work orders; Invoiced and Paid do not match them.'),
 3723: ('Story 3 Error Handling', 'If Close fails before the internal invoice is created, display "Could not close the work order. Try again." as an alert toast that must be dismissed; the work order stays where it was and nothing is posted.'),
}
prd_text = open('../sources/CONFLUENCE-942243841-read-2026-11-12.md', encoding='utf-8').read().replace('\\', '')
for x in out:
    if x['verdict'] == 'DIVERGE':
        code, q = PRDQ[x['plan_line']]
        assert q in prd_text, q
        x['prd_quote'] = q; x['prd_quote_code'] = code
out.sort(key=lambda x: x['plan_line'])
for i, x in enumerate(out, 1):
    x['id'] = f'TP-{i:03d}'
keys=['id','plan_line','section','verdict','prd_code','quote','note','invariant','design_differs_from_prd']
out = [{**{k: x[k] for k in keys}, **({'prd_quote_code': x['prd_quote_code'], 'prd_quote': x['prd_quote']} if 'prd_quote' in x else {})} for x in out]
cnt = collections.Counter(x['verdict'] for x in out)
doc = {
 'title': 'Internal Work Orders — tech plan statements a manual tester can observe',
 'made': '2026-11-12',
 'plan': {'file': 'build/founder-mode/internal-work-orders/sources/TECH-PLAN-Internal-Work-Orders-upload-2026-11-12.md',
          'bytes': 842447, 'lines': 5398, 'sha256': 'bc32a6f061dd4db36ed772d3519821e5798b86e60805f3ca4c7b71b7cc14799d',
          'date': '2026-10-28 (rebuilt 2026-11-09 for PRD v0.21; updated 2026-11-09 for v0.22; updated 2026-11-10 for v1.0)',
          'prd_version_built_on': 'PRD v1.0, Confluence page version 39 (published 2026-11-09, read by engineering 2026-11-10)'},
 'prd': {'file': 'build/founder-mode/internal-work-orders/sources/CONFLUENCE-942243841-read-2026-11-12.md', 'version': 'Final v1.0 (2026-11-09), Milos Vasic',
         'sha256': '1735d0b693be8e6f12ee20cb1dcc688e17be712f160dca8d10b22fd1f224a5b2',
         'match_check': "the plan's §1 copies the first sentence of all 205 PRD requirement ids; all 205 are found word for word in our PRD copy and no id is missing either way (tools/check_extract.py)"},
 'verdicts': {'CONFIRM': 'the PRD says the same', 'ADD': 'testable, PRD silent: a case may cite the plan (QA lead ruling 12 Aug 2026, Rule 30)',
              'DIVERGE': 'plan and PRD disagree: the PRD wins for the cases; see TECH-PLAN-DIVERGENCES.md'},
 'fields': {'invariant': 'the statement says something must NOT change for ordinary billable work (see INVARIANTS-FROM-PLAN.md)',
            'design_differs_from_prd': 'the plan notes that a design frame differs from the PRD text and builds the PRD text'},
 'counts': dict(cnt), 'total': len(out),
 'quote_rule': 'every quote is a verbatim substring of the cited plan line (checked by tools/assemble.py)',
 'statements': out,
 'context_not_testable': context,
}
json.dump(doc, open('TECH-PLAN-TESTABLE.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(dict(cnt), len(out), 'context', len(context))
print('invariants', sum(1 for x in out if x['invariant']), 'design', sum(1 for x in out if x['design_differs_from_prd']))
for x in out:
    if x['verdict']=='DIVERGE': print(x['id'], x['plan_line'], x['prd_code'], x['note'][:80])
