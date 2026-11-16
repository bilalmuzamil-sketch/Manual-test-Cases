# Build settings.json (Step 1) from the read-only captures in /tmp/cln/rgwo/settings-raw. No secrets are read.
import json, os
R = '/tmp/cln/rgwo/settings-raw'; OUT = '/home/user/Manual-test-Cases/build/regression-wo-parts-invoices-2026-11/steps-1-2'
cap = json.load(open(f'{R}/capture.json')); api = json.load(open(f'{R}/api.json')); dlg = json.load(open(f'{R}/02b-location-dialog.json'))
pages = {(p['page'], p['tab']): p for p in cap['pages'] if not p.get('missing')}
rows = []
def add(page, section, label, value, at, why, shot, testid=None, api_field=None, api_value=None):
    rows.append({'page': page, 'section': section, 'label': label, 'value': value, 'recorded_at_utc': at, 'affects': why, 'screenshot': shot, 'test_id': testid, 'api_field': api_field, 'api_value': api_value})
org = api['/api/organizations/settings']['j']['data']
INV = [('Labor rate', 'Choose whether labor rate will be displayed on invoices', 'What the invoice document shows for labour lines (rate column). Figures are still checked from the invoice data.'),
       ('Labor hours', '', 'Whether hours appear on the invoice document; hours on the WO must still reach the invoice (checked in invoice data).'),
       ('Labor price', '', 'Whether the labour price appears on the invoice document.'),
       ('Part number', '', 'Whether part numbers appear on the invoice document.'),
       ('Part quantity', '', 'Whether part quantities appear on the invoice document.'),
       ('Part price', '', 'Whether part prices appear on the invoice document.'),
       ('Part description', '', 'Whether part descriptions appear on the invoice document.'),
       ('Summarize parts total', '', 'Whether a parts subtotal is shown on the invoice document.'),
       ('Summarize labor total', '', 'Whether a labour subtotal is shown on the invoice document.'),
       ('Legacy invoice layout', '', 'Which invoice design is shown (Invoice Refresh is out of scope; only figures are read).')]
p = pages[('01-settings', 'Invoice')]
tog = [c for c in p['controls'] if c['kind'] == 'toggle']
for (lab, _, why), c in zip(INV, tog): add('Administration > Settings', 'Invoice tab', lab, 'On' if c['value'] == 'true' else 'Off', p['at_utc'], why, p['screenshot'], c['testid'])
dis = [c for c in p['controls'] if c['kind'] == 'field']
if dis: add('Administration > Settings', 'Invoice tab', 'Disclaimer', dis[0]['value'], p['at_utc'], 'Text printed on estimates/invoices; no effect on figures.', p['screenshot'], dis[0]['testid'])
WO = [('WORKFLOW', 'Require Approval for New Lines', 'autoApproveLines', lambda v: not v, 'New lines start as needing approval; lines must be approved before work/parts proceed (WO-1 status path).'),
      ('WORKFLOW', 'Require Review Before Completion', 'requireReview', lambda v: v, 'Whether a Review/sign-off step sits between the work and completion/invoice (WO-1).'),
      ('LINE REQUIREMENTS', 'Require Tech Story', 'requireTechStories', lambda v: v, 'Whether a line can be completed without a tech story.'),
      ('LINE REQUIREMENTS', 'Require Mileage', 'requireMileage', lambda v: v, 'Whether a line can be completed without mileage.'),
      ('LINE REQUIREMENTS', 'Require Engine Hours', 'requireHours', lambda v: v, 'Whether a line can be completed without engine hours.'),
      ('PARTS', 'Require Ordering Parts', 'requireOrderingParts', lambda v: v, 'Parts must be clicked Order before they count as ordered (part line path on WO-1..4).'),
      ('PARTS', 'Require Receiving Parts Before Completion', 'requireVendorInvoiceNumber', lambda v: v, 'Every part must be received before the WO can be completed, reviewed or invoiced (blocks Create Invoice until received).'),
      ('PARTS', 'Require Picking Inventory Parts', 'autoPickInventoryParts', lambda v: not v, 'Inventory parts must be clicked Pick before they are ready (inventory part path).')]
p = pages[('01-settings', 'Work Orders')]
tog = [c for c in p['controls'] if c['kind'] == 'toggle']
for (sec, lab, f, m, why), c in zip(WO, tog):
    add('Administration > Settings', 'Work Orders tab > ' + sec, lab, 'On' if c['value'] == 'true' else 'Off', p['at_utc'], why, p['screenshot'], c['testid'], f, org[f])
    rows[-1]['api_agrees'] = (c['value'] == 'true') == m(org[f])
add('(not on the Settings screen — API only)', 'Organization settings', 'requireVehicleIdentifier / vehicleIdentifier', f"{org['requireVehicleIdentifier']} / {org['vehicleIdentifier']}", cap['zones_end']['at_utc'], 'Whether an asset needs a VIN; affects creating the unit for a WO.', None, None, 'requireVehicleIdentifier', org['requireVehicleIdentifier'])
at = dlg['at_utc']
LOCF = {'select_timezone': ('Timezone', 'Dates on WOs/invoices/payments; Rule 99 zone.'), 'select_tax': ('Taxes', 'Tax applied to labour, parts and shop supplies on this location\'s invoices.'),
        'select_sales_tax_rounding_mode': ('Sales Tax Rounding', 'How tax is rounded on invoices (on screen: "Round the tax on every line to the cent, then add them up.").'),
        'checkbox_show_shop_supply_percentage': ('Show % on Estimates and Invoices', 'Whether the shop-supplies % shows on documents.'), 'select_remit_to': ('Remit To', 'Remit-to address on invoices.')}
for f in dlg['fields']:
    if f['testid'] in LOCF: add('Administration > Settings > Locations > Edit Location (this location)', 'Edit Location dialog', LOCF[f['testid']][0], f['value'], at, LOCF[f['testid']][1], 'evidence/settings/02b-location-edit-dialog.png', f['testid'])
sup = [f for f in dlg['fields'] if f['testid'] == 'input_base']
for lab, f in zip(['Shop Supplies Charge (% of labor)', 'Shop Supplies Min ($)', 'Shop Supplies Max ($)'], sup):
    add('Administration > Settings > Locations > Edit Location (this location)', 'Edit Location dialog', lab, f['value'] or '(empty)', at, 'Shop supplies charge added to invoices (0 here, so no shop-supplies line is expected).', 'evidence/settings/02b-location-edit-dialog.png', 'input_base')
tax = [x for x in api['/api/taxes']['j']['data']['collection'] if x['name'] == 'GST' and x['id'].startswith('819f3c25')][0]
add('Administration > Settings > Taxes', 'Taxes list', 'GST (tax on this location)', f"rate {tax['rateTotal']}% (component GST {tax['rates'][0]['percentage']}%); applies to labor={tax['isEnabledLabor']}, parts={tax['isEnabledParts']}, shop supplies={tax['isEnabledShopSupplies']} (API)", cap['pages'][4]['at_utc'] if len(cap['pages'])>4 else None, 'Tax rate used to recompute every invoice.', 'evidence/settings/03-taxes.png')
lt = api['/api/labour-types']['j']['data']['collection']
for l in lt: add('Administration > Settings > Labor Rates', 'Labor Rates list', l['name'], f"${l['labour_rate']}{' (Default)' if l['is_default'] else ''}", pages[('04-labor-rates', None)]['at_utc'], 'Labour rate used on WO labour lines.', 'evidence/settings/04-labor-rates.png')
add('Administration > Settings > Canned Lines', 'Canned Lines list', 'Canned lines', 'none at this location ("Empty bays, endless possibilities")', pages[('05-canned-lines', None)]['at_utc'], 'No canned lines: WO lines are added by hand.', 'evidence/settings/05-canned-lines.png')
add('Administration > Settings > Fees & Discounts', 'Fees & Discounts list', 'Fee / discount templates', 'none (list empty); "Pass convenience fee to customer" toggle shown above the list', pages[('06-fees-discounts', None)]['at_utc'], 'Fees & Discounts are OUT of scope; an empty list means nothing auto-applies to the test WOs.', 'evidence/settings/06-fees-discounts.png')
fdc = [c for c in pages[('06-fees-discounts', None)]['controls']]
if fdc: rows[-1]['value'] += f" (toggle value {fdc[0]['value']})"
pr = api['/api/pricing-rules/list?limit=200&page=1']['j']['data']['collection']
dm = [m for m in pr if m.get('is_default')]
add('Administration > Settings > Pricing', 'Pricing Matrices', 'Pricing matrices', f"{len(pr)} matrices; default = {dm[0]['name'] if dm else '?'} ({len(dm[0]['rules']) if dm else 0} cost bands, e.g. cost $0-10 markup 300%, $24.01-55 markup 150%)", pages[('07-pricing', None)]['at_utc'], 'Sets the suggested sell price of a part from its cost; the invoice is checked against the price on the WO/part sale.', 'evidence/settings/07-pricing.png')
add('Administration > Settings > Bin Locations', 'Bin Locations list', 'Bins at this location', 'General Storage (Default), 0 inventory parts', pages[('08-bin-locations', None)]['at_utc'], 'Where seeded inventory parts are stored.', 'evidence/settings/08-bin-locations.png')
pm = open(f'{R}/10-payment-methods.txt').read().split('\n')
add('Administration > Settings > Payment Methods', 'Customer Payments tab', 'Payment methods', 'Cash, Check, Debit, Visa, Mastercard, Amex, E-transfer, EFT, Gift card, Applied credit, Charge Account, Payroll deduction, Exmerce, 123, STG QA pm 164331 (delete me)', pages[('10-payment-methods', None)]['at_utc'], 'Methods offered when paying an invoice.', 'evidence/settings/10-payment-methods.png')
ff = [f['name'] for f in api['/api/organization/feature-flags?organization_id=d55bc308-e61a-438d-b5f1-c7a73c89d49f']['j']['data']['features']]
add('(feature flags — API read only, /administration/feature-flags not opened)', 'Organization feature flags', 'Enabled features', ', '.join(ff), cap['zones_end']['at_utc'], 'PartSales and deposits are ON (part sales and WO deposits are testable); FeesAndDiscounts ON but out of scope.', None)
json.dump({'location': {'id': '2644c166-362b-48ec-9cf2-2ac974418039', 'name': 'ZZAUTOTEST R365 Location C with a name longer than the chip', 'timezone': 'America/Edmonton'},
           'zones': {'start': cap['zones_start'], 'end': cap['zones_end']}, 'note': 'Read only. No setting was changed. The Edit Location dialog was closed with its close button; no request other than GET was sent.',
           'settings': rows}, open(f'{OUT}/settings.json', 'w'), indent=1)
print(len(rows), 'settings rows'); [print(' ', r['label'], '=', str(r['value'])[:70], '| api_agrees' if r.get('api_agrees') else ('| API DISAGREES' if r.get('api_agrees') is False else '')) for r in rows]
