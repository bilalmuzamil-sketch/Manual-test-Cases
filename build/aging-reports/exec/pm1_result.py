"""pm1_result.py — 11 Nov 2026: permission tests from pm1b (new staff member per role, switch-user, own browser context - L0679). Each role's permissions
read back from the switched session (fe-permissions). Positive control: the Admin's own view shows the same numbers as links (pm1/control-*.png)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b=()): src = PP + 'pm1/' + n; dst = PP + 'pics/%s-pm1-%s' % (cid, n); ann(src, dst, t, [], [], list(b)); return dst
o = json.load(open(PP + 'pm1/out.json'))
def perms(rk): return ', '.join(o['role_' + rk]['perms'])
ROWS = (278, 208, 1132, 300); CH = (278, 118, 900, 32)
def who(rk, extra=''): return 'Signed in as a new staff member "ZZAUTOTEST Perm %s" whose role "%s" has exactly: %s.%s' % (rk, o['role_' + rk]['role'], perms(rk), extra)
R = {}
R['C715425'] = {'verdict': 'Passed', 'observed': [who('invwo'), 'A/R Aging Detail, customer "ZZAUTOTEST AR Customer A" ticked, every bucket open: work order invoices S11315-17582, -17581, -17585, -17583 are blue links; part sale invoice P11315-248 is plain black text.',
    'Step 1: invoice B (part sale P11315-248) is plain text - the role lacks Part sales View.', 'Step 2: clicking invoice A (S11315-17582) opens the work order\'s Finance page.'],
    'pictures': [P('C715425', 'C715425-1-ids.png', 'Step 1: work order invoices are links, the part sale invoice is plain text', [ROWS + ('good', 'Links / plain')]), P('C715425', 'C715425-2-click-wo.png', 'Step 2: the work order\'s Finance page opens')]}
R['C715426'] = {'verdict': 'Passed', 'observed': [who('wops'), 'A/R Aging Detail, customer "ZZAUTOTEST AR Customer A" ticked, every bucket open.',
    'Step 1: invoice A (work order invoice S11315-17582) and invoice B (part sale P11315-248) are both plain black text - the role lacks Invoicing & payments View.', 'Step 2: clicking invoice A\'s number opens nothing: the same report stays, no new tab, no window.'],
    'pictures': [P('C715426', 'C715426-1-ids.png', 'Step 1: both numbers plain text', [ROWS + ('good', 'Plain text')]), P('C715426', 'C715426-2-click-wo.png', 'Step 2: nothing opens', [ROWS + ('good', 'Same report')])]}
R['C715427'] = {'verdict': 'Passed', 'observed': [who('invps'), 'A/R Aging Detail, customer "ZZAUTOTEST AR Customer A" ticked, every bucket open.',
    'Step 1: invoice A (work order invoice S11315-17582) is plain text - the role lacks Work orders View; the part sale invoice P11315-248 is a blue link.', 'Step 2: clicking invoice B (P11315-248) opens the part sale\'s Finance page.'],
    'pictures': [P('C715427', 'C715427-1-ids.png', 'Step 1: work order invoice plain, part sale invoice a link', [ROWS + ('good', 'Plain / link')]), P('C715427', 'C715427-2-click-ps.png', 'Step 2: the part sale\'s Finance page opens')]}
R['C715428'] = {'verdict': 'Passed', 'observed': [who('vomv'), 'A/P Unpaid Invoices, vendor "ZZY Types P92" ticked and its group open; bill A = ZZY925996616, received at Staging Heavy Duty - 9919 (my location).',
    'Step 1: bill A\'s number is a blue link.', 'Step 2: clicking it opens bill A\'s delivery.'],
    'pictures': [P('C715428', 'C715428-1-bill.png', 'Step 1: the bill number is a link', [ROWS + ('good', 'Link')]), P('C715428', 'C715428-2-click-bill.png', 'Step 2: the delivery opens')]}
R['C715429'] = {'verdict': 'Passed', 'observed': [who('vomce', ' The case asks for "Create & Edit but not View": on the Create Role screen, ticking Vendor and order management "Create & Edit" ticks "View" as well (the role screen does it - picture), so a Create & Edit role without View cannot be made; the role used has Create & Edit (and the View it forces).'),
    'A/P Unpaid Invoices, vendor "ZZY Types P92" ticked and its group open; bill A = ZZY925996616, received at Staging Heavy Duty - 9919.', 'Step 1: bill A\'s number is a blue link.', 'Step 2: clicking it opens bill A\'s delivery.'],
    'pictures': [P('C715429', 'C715429-1-bill.png', 'Step 1: the bill number is a link', [ROWS + ('good', 'Link')]), P('C715429', 'C715429-2-click-bill.png', 'Step 2: the delivery opens'),
                 ann(PP + 'p71/09-ZZAUTOTEST-P71-VOM-create-edit-filled.png', PP + 'pics/C715429-p71-role.png', 'Create Role: ticking "Create & Edit" ticks "View" too', [], [], [(1080, 560, 240, 70, 'good', 'View ticked with Create & Edit')]) or PP + 'pics/C715429-p71-role.png']}
R['C715430'] = {'verdict': 'Passed', 'observed': [who('rep'), 'A/P Aging Detail, vendor "ZZY Types P92" ticked, every bucket open; bill A = ZZY925996616 and vendor credit A = C-13685, both at Staging Heavy Duty - 9919.',
    'Step 1: both numbers are plain black text.', 'Step 2: clicking bill A\'s number opens nothing: the same report stays, no new tab, no window.'],
    'pictures': [P('C715430', 'C715430-1-nums.png', 'Step 1: bill and vendor credit numbers plain text', [ROWS + ('good', 'Plain text')]), P('C715430', 'C715430-2-click-bill.png', 'Step 2: nothing opens')]}
R['C715424'] = {'verdict': 'Passed', 'observed': [who('admin1', ' This person is enrolled at Staging Heavy Duty - 9919 only: their user menu has no "Change Location" (shown only to people enrolled at two or more locations).'),
    'A/R Aging Detail, customer "ZZAUTOTEST AR V1R-87 Location C" ticked, every bucket open; invoice A = S-17887, made at ZZAUTOTEST V1R-87 Location C (not enrolled).',
    'Step 1: the row is listed ("Nov 1, 2026 · ZZAUTOTEST V1R-87 Location C · Invoice · S-17887 · $87.00") and its number is plain black text.', 'Step 2: clicking it opens nothing and no dialog shows.'],
    'pictures': [P('C715424', 'C715424-1-row.png', 'Step 1: the row is listed; S-17887 is plain text', [ROWS + ('good', 'Listed, plain')]), P('C715424', 'C715424-2-click.png', 'Step 2: nothing opens, no dialog')]}
R['C715385'] = {'verdict': 'Passed', 'observed': [who('admin1', ' Enrolled at Staging Heavy Duty - 9919 only, which is also the current location.'),
    'Step 1: A/P Unpaid Invoices lists rows from Staging Lethbridge - 4310 too (and Staging Heavy Duty - 9919) - the report stays organization-wide.',
    'Step 2: the Location menu lists Staging Heavy Duty - 9919, Staging Lethbridge - 4310 and ZZAUTOTEST V1R-87 Location C, all ticked ("3 selected"), although this person is enrolled only at Heavy Duty.'],
    'pictures': [P('C715385', 'C715385-1-rows.png', 'Step 1: rows from Lethbridge listed too', [ROWS + ('good', 'Organization-wide')]), P('C715385', 'C715385-2-menu.png', 'Step 2: every location listed and ticked', [(880, 115, 440, 300, 'good', '3 selected')])]}
R['C715448'] = {'verdict': 'Passed', 'observed': [who('rep', ' The role has no "View and Manage AP/AR Data" switch.'),
    'A/R Aging Collection, customer "Andrews\' Truck & Trailer Repair LLC" ticked.',
    'Step 1: the group row shows "Phone: 343-203-3967"; no credit term and no "Credit term:" label.', 'Steps 2-3: the PDF downloads; customer A\'s line reads "Andrews\' Truck & Trailer Repair LLC   Phone: 343-203-3967" - no credit term.',
    'Steps 4-5: the CSV downloads; its heading row reads Date, Location, Transaction Type, ID, Customer, Phone, Due Date, Past Due, Amount, Open Balance - a "Phone" column after "Customer", no "Credit Term" column.'],
    'pictures': [P('C715448', 'C715448-1-group.png', 'Step 1: Phone shows, no Credit term', [(278, 208, 900, 48, 'good', 'Phone only')]), P('C715448', 'C715448-csv-top.png', 'Step 5: CSV heading - Phone after Customer, no Credit Term')]}
R['C715474'] = {'verdict': 'Passed', 'observed': [who('rep', ' "See Financial Data" is off.'),
    'Step 1: the Reports left menu offers all six: A/R Aging Summary, A/R Aging Detail, A/R Aging Collection (ACCOUNTS RECEIVABLE) and A/P Aging Summary, A/P Aging Detail, A/P Unpaid Invoices (ACCOUNTS PAYABLE).',
    'Steps 2-7: each opens with its amounts - ' + '; '.join('%s: %s' % (o['C715474'][k]['title'], ' / '.join(o['C715474'][k]['totals'].split('\t')[1:]).strip(' /').replace(' / / ', ' / ')) for k in ('ars', 'ard', 'arc', 'aps', 'apd', 'apu')) + ' - "See Financial Data" off does not hide them.'],
    'pictures': [P('C715474', 'C715474-1-menu.png', 'Step 1: all six reports offered', [(0, 590, 248, 250, 'good', 'Six aging reports')])] + [P('C715474', 'C715474-2-%s.png' % k, 'Step %d: %s opens with its amounts' % (i + 2, t), [(278, 852, 1132, 46, 'good', 'Amounts shown')]) for i, (k, t) in enumerate([('ars', 'A/R Summary'), ('ard', 'A/R Detail'), ('arc', 'A/R Collection'), ('aps', 'A/P Summary'), ('apd', 'A/P Detail'), ('apu', 'A/P Unpaid Invoices')])]}
R['C715616'] = {'verdict': 'Passed', 'observed': [who('rep', ' "See Financial Data" is off; no setting was changed after the release.'),
    'Step 1: A/R Aging Summary "Download (PDF)" downloads ar-aging-summary.pdf (94 KB) with "Success - Data exported successfully."', 'Step 2: A/P Aging Detail opens.',
    'Step 3: "Download (CSV)" downloads ap-aging-detail.csv (2 MB) with the same success message.'],
    'pictures': [P('C715616', 'C715616-ars-toast-late.png', 'Step 1: the PDF downloads - success message', [(930, 820, 420, 80, 'good', 'Success')]), P('C715616', 'C715616-2-apd.png', 'Step 2: A/P Aging Detail opens'), P('C715616', 'C715616-apd-toast-late.png', 'Step 3: the CSV downloads - success message', [(930, 820, 420, 80, 'good', 'Success')])]}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, pm1b permissions'}, 'results': R}, open(PP + 'RESULTS-pm1.json', 'w'), indent=1); print(list(R))
