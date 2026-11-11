"""pm2_result.py — 11 Nov 2026: permission redo (pm2): C715431, C715432, C715610 (customer/vendor ticked first, L0684) and C715384 (Apollo Beach's group open)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b=()): src = PP + 'pm2/' + n; dst = PP + 'pics/%s-pm2-%s' % (cid, n); ann(src, dst, t, [], [], list(b)); return dst
o = json.load(open(PP + 'pm2/out.json')); R = {}
def who(rk, extra=''): return 'Signed in as a new staff member "ZZAUTOTEST Perm %s" whose role "%s" has exactly: %s.%s' % (rk, o['role_' + rk]['role'], ', '.join(o['role_' + rk]['perms']) if rk != 'admin1' else 'the Admin role (all permissions)', extra)
ROW = (278, 208, 1132, 48); CH = (278, 118, 900, 32)
v = o['C715431']; assert v['name'][0]['link'] and '/reports/ar-aging-collection' in v['2-click']['url'] and 'customerIds=6a7da37d' in v['2-click']['url']
R['C715431'] = {'verdict': 'Passed', 'observed': [who('cust'), 'A/R Aging Summary, as of today (customer A, "ZZAUTOTEST AR Customer A", picked in the Customer filter so its row is on screen).',
    'Step 1: customer A\'s name is a blue link.', 'Step 2: clicking it opens A/R Aging Collection with only customer A ticked (chip "Customer: ZZAUTOTEST AR C...").'],
    'pictures': [P('C715431', 'C715431-1-name.png', 'Step 1: the customer name is a link', [ROW + ('good', 'Link')]), P('C715431', 'C715431-2-click.png', 'Step 2: A/R Aging Collection with only customer A ticked', [CH + ('good', 'Only customer A')])]}
v = o['C715432']; assert v['name'][0]['link'] and '/reports/ap-unpaid-invoices' in v['2-click']['url'] and any('Vendor: ZZY Types P92' in c for c in v['chips'])
R['C715432'] = {'verdict': 'Passed', 'observed': [who('rep', ' No Vendor and order management access.'), 'A/P Aging Summary, as of today (vendor A, "ZZY Types P92", picked in the Vendor filter so its row is on screen).',
    'Step 1: vendor A\'s name in the Vendor column is a blue link - even without Vendor and order management access.', 'Step 2: clicking it opens A/P Unpaid Invoices with only vendor A ticked (chip "Vendor: ZZY Types P92").'],
    'pictures': [P('C715432', 'C715432-1-name.png', 'Step 1: the vendor name is a link', [ROW + ('good', 'Link')]), P('C715432', 'C715432-2-click.png', 'Step 2: A/P Unpaid Invoices with only vendor A ticked', [CH + ('good', 'Only vendor A')])]}
v = o['C715610']; assert not v['name'][0]['link'] and '/reports/ar-aging-summary' in v['2-click']['url'] and not v['2-click']['newTabs'] and not v['2-click']['dialogs']
R['C715610'] = {'verdict': 'Passed', 'observed': [who('rep', ' No Customers View.'), 'A/R Aging Summary, as of today (customer A, "ZZAUTOTEST AR Customer A", picked in the Customer filter so its row is on screen).',
    'Step 1: customer A\'s name is plain black text, not a link.', 'Step 2: clicking it opens nothing: the same report stays, no new tab, no window.'],
    'pictures': [P('C715610', 'C715610-1-name.png', 'Step 1: the customer name is plain text', [ROW + ('good', 'Plain text')]), P('C715610', 'C715610-2-click.png', 'Step 2: nothing opens', [ROW + ('good', 'Same report')])]}
v = o['C715384']; assert 'Staging Lethbridge - 4310' in v['apollo'] and v['menu']['text'][1] == '3 selected'
R['C715384'] = {'verdict': 'Passed', 'observed': [who('admin1', ' Enrolled at Staging Heavy Duty - 9919 only (no "Change Location" in the user menu), which is also the current location.'),
    'Step 1: A/R Aging Collection lists customers with documents at Staging Lethbridge - 4310 too - e.g. Apollo Beach Truck & Equipment Repair\'s invoice S3-14144 ("Apr 6, 2026 · Staging Lethbridge - 4310 · Invoice · $1,491.58") - the report stays organization-wide.',
    'Step 2: the Location menu lists Staging Heavy Duty - 9919, Staging Lethbridge - 4310 and ZZAUTOTEST V1R-87 Location C, all ticked ("3 selected"), although this person is enrolled only at Heavy Duty.'],
    'pictures': [P('C715384', 'C715384-1-rows.png', 'Step 1: a Lethbridge invoice listed', [(278, 208, 1132, 400, 'good', 'Lethbridge row shown')]), P('C715384', 'C715384-2-menu.png', 'Step 2: every location listed and ticked', [(880, 115, 440, 300, 'good', '3 selected')])]}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, pm2 permission redo'}, 'results': R}, open(PP + 'RESULTS-pm2.json', 'w'), indent=1); print(list(R))
