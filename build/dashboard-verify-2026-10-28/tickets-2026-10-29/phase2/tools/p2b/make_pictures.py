# Phase 2 Worker B: annotated pictures from the Rule-99 captures in /tmp/cln/p2b/keep (all taken with browser zone =
# process zone = location zone; see the meta.json next to each capture). Boxes are in source pixels (2x). SECRET-FREE.
import subprocess, os
from PIL import Image
K = '/tmp/cln/p2b/keep'
OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/phase2/pictures'
ANN = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools/annotate_v2.py'
os.makedirs(OUT, exist_ok=True)

def crop(src, box, dst):
    Image.open(src).crop(box).save(dst); return dst

def ann(src, name, title, marks):
    cmd = ['python3', ANN, src, f'{OUT}/{name}', '--scale', '2', '--title', title]
    for m in marks: cmd += ['--mark', m]
    subprocess.run(cmd, check=True); print(name)

pv_crop = crop(f'{K}/PV_B1/pv-export-p1.png', (0, 0, 2382, 400), '/tmp/cln/p2b/keep/pv-pdf-top.png')
iv_crop = crop(f'{K}/IV_DL/iv-export-p1.png', (0, 0, 2382, 400), '/tmp/cln/p2b/keep/iv-pdf-top.png')

# B1 Last 90 days = 91 days
ann(f'{K}/PV_DVI/1-pv-default.png', 'P2-B1-1-parts-velocity-last-90-days.png',
    'Parts Velocity at DVI Test on 28 Oct 2026 (Toronto time), opened with its default date',
    ['566,250,376,56:good:The date reads "Last 90 days", the report\'s default.'])
ann(pv_crop, 'P2-B1-2-download-shows-91-days.png',
    'The PDF download of that same view (Download (PDF)), top of page 1',
    ['40,196,390,34:bad:The download says Jul 30 to Oct 28, 2026. That is 91 days. Last 90 days should start on Jul 31.'])
# B2 vendor return counted
ann(f'{K}/RET_CREATE/4-after-save.png', 'P2-B2-1-vendor-return-on-parts-returns.png',
    'Parts > Returns at DVI Test: the return to the vendor just made (packaging slip "ZZAUTOTEST P2B vendor return")',
    ['499,352,2640,76:good:A return of 1 ZZAUTOTEST-PV1-10282011 to the vendor 123 Cannabis Forestlawn. No customer returned anything.'])
ann(f'{K}/RET_PV/1-pv-units-returned-after.png', 'P2-B2-2-parts-velocity-units-returned.png',
    'Parts Velocity at DVI Test, Last 90 days, with the Units Returned column switched on',
    ['2376,428,307,96:bad:Units Returned reads 1.00 because of the vendor return. It should stay 0.00: only customer returns count.'])
# B3 Location column hidden
ann(f'{K}/PV_DVI/1-pv-default.png', 'P2-B3-1-parts-velocity-no-location-column.png',
    'Parts Velocity, Admin who has four locations, one location picked (DVI Test)',
    ['2544,250,370,56:good:One location is picked: DVI Test.',
     '556,332,3984,96:bad:The column headings have no Location column. It should always be shown, as on Inventory Value.'])
ann(f'{K}/IV-first-visit.png', 'P2-B3-2-inventory-value-shows-location.png',
    'Inventory Value, same user, same single location (DVI Test), for comparison',
    ['2786,332,221,96:good:Inventory Value shows its Location column with one location picked. Parts Velocity should do the same.'])
# B4 Last Sale ignores the billed sale
ann(f'{K}/B4-pv.png', 'P2-B4-1-parts-velocity-last-sale.png',
    'Parts Velocity at Staging Heavy Duty - 9919, Last quarter (Jul 1 - Sep 30), part N000000001069, 29 Oct 2026 (Karachi time)',
    ['3136,524,226,96:good:Revenue $1.38: the part was billed in this quarter (work order S2-16621).',
     '4075,524,234,96:bad:Last Sale reads 161 days (21 May). The sale on 30 Jul should count: it should read 91 days.'])
ann(f'{K}/B4-invoice.png', 'P2-B4-2-invoice-S2-16621.png',
    'Work order S2-16621 > Finance: the invoice that billed the part',
    ['2268,436,350,46:good:Invoice Date: Jul 30, 2026.',
     '1168,2343,1450,52:good:DDE-N000000001069 - SEAL RING, 1 at $1.38, is billed on this invoice.'])
# B5 Qty heading
ann(f'{K}/IV-first-visit.png', 'P2-B5-1-inventory-value-qty-heading.png',
    'Inventory Value at DVI Test, column headings on screen',
    ['3006,332,161,96:bad:The quantity heading reads "Qty". The standard is "On Hand", the same as Parts Velocity.'])
ann(iv_crop, 'P2-B5-2-download-qty-heading.png',
    'Inventory Value PDF download (Download (PDF)), top of page 1',
    ['1556,298,95,34:bad:The download heading also reads "Qty". It should read "On Hand".'])
# B6 Receive later special order not counted
ann(f'{K}/WO_DVI_S1-38206/1-wo-finance.png', 'P2-B6-1-invoice-bills-the-part.png',
    'Work order S1-38206 > Finance at DVI Test: invoice INV-S1-38206, 28 Oct 2026',
    ['1168,1478,1450,100:good:ZZAUTOTEST-SO1-10282011 (the special-order part marked Receive later) is billed: 1 at $68.96.'])
ann(f'{K}/PV_DVI/3-pv-zzautotest.png', 'P2-B6-2-parts-velocity-shows-zero.png',
    'Parts Velocity at DVI Test, Last 90 days, search "ZZAUTOTEST"',
    ['556,620,3984,96:bad:ZZAUTOTEST-SO1-10282011 shows 0.00 sold, $0.00 revenue, Demand 0, Last Sale "—", although it was billed twice.'])
# B7 Demand counts re-invoice twice
ann(f'{K}/PV_DVI/3-pv-zzautotest.png', 'P2-B7-1-parts-velocity-demand.png',
    'Parts Velocity at DVI Test, Last 90 days, search "ZZAUTOTEST"',
    ['3822,428,263,96:bad:Demand reads 5. The part was sold on 3 work orders (two were reversed and invoiced again), so it should read 3.',
     '2431,428,287,96:good:Units Sold 6.00 is right.'])
# B8 first visit shows Margin and Total Sell
ann(f'{K}/IV-first-visit.png', 'P2-B8-1-inventory-value-first-visit.png',
    'Inventory Value opened for the first time in a fresh browser (no saved settings), DVI Test',
    ['3623,332,199,96:bad:Margin is shown on the first visit. It should start hidden.',
     '4058,332,237,96:bad:Total Sell is shown on the first visit. It should start hidden.'])
