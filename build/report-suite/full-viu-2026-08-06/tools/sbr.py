# -*- coding: utf-8 -*-
"""Sales By Representative write batch, third session 2026-08-06, build v3.5-7168d14."""
import sys, json
sys.path.insert(0,'/home/user/Manual-test-Cases/build/report-suite/full-viu-2026-08-06/tools')
sys.path.insert(0,'/tmp/testrail')
import writer, tr

def blk(sym, t, closed=False):
    extra = (" That ticket has been closed without a fix, so do not wait for one."
             if closed else "")
    return ("What you should see today: %s. This is a known problem and it is already reported - see "
            "https://shopview.atlassian.net/browse/%s%s\n"
            "· If you see exactly that, mark this test FAILED and do not raise anything new.\n"
            "· If it fails in a DIFFERENT way from what is described above, that is a NEW problem - please report it.\n"
            "· If it PASSES, the fix has shipped: tell the QA lead so the ticket can be closed and this note removed."
            % (sym, t, extra))

R = 'AUTOMATION: READY'
def EF(t): return 'AUTOMATION: READY - EXPECT FAIL (%s)' % t
def H(r):  return 'AUTOMATION: HOLD - %s' % r

# cid -> (marker, deviation block or None, [(old,new) body edits] or None)
P = {}

# ---------- straight passes: nothing changes but the build line ----------
for cid in [30276, 30265, 30267, 30269, 30206, 30208, 30201, 30261, 30262, 30264,
            30222, 30226, 30241, 30243, 30247, 30250, 30308, 30316, 30317, 30318,
            30271, 30274, 30275, 30291, 30272, 30224, 30223, 30217, 30219, 30212,
            30209, 30211, 30213, 30244, 30245, 30268, 30303, 30302, 38913, 30215,
            30204, 30278, 30319, 30197, 30195, 30251, 30249, 30300]:
    P[cid] = (R, None, None)

# ---------- deviations already carrying a ticket ----------
P[30285] = (EF('SV-8880'), blk(
    'the Summary spreadsheet arrives with only nine of the thirteen column headings - '
    '# Invoices, # Customers, Hrs Worked and Hrs Invoiced are all absent - and the file '
    'still ends with a Totals row that this version is not supposed to have. The Location '
    'column, the UTF-8 marker and the one-row-per-representative shape are all correct',
    'SV-8880'), None)

# ---------- NEW deviations ----------
P[30286] = (EF('SV-8972'), blk(
    'the Expanded spreadsheet puts Invoice # BEFORE Date instead of after it, and heads that '
    'column "Invoice Status" instead of "Status". Everything else in the heading row is right, '
    'including the Location column in its correct place after the status column',
    'SV-8972'), None)

P[30298] = (EF('SV-8973'), blk(
    'the message reads "No sales data found for the selected filters." instead of the wording '
    'above. The rest of this test is correct - no data rows are drawn and the toolbar stays usable',
    'SV-8973'), None)

P[30225] = (EF('SV-8974'), blk(
    'the newest-first part is right, but invoices that share a date come out in the order they '
    'were created rather than by invoice number. On 12 June 2026, for example, the rows run '
    'S-15487, P-117, P-113, S-15750, S-15646, S-15828, S-15812 - the numbers are in no order at all',
    'SV-8974'), None)

P[30307] = (EF('SV-8975'), blk(
    'three of the five names are wrong. The three-dot download button reads "Export report" instead '
    'of "Report actions", the column button reads "Column Selection" instead of "Show or hide '
    'columns", and the top chevron reads "Expand all representatives" / "Collapse all '
    'representatives" instead of "Expand all reps" / "Collapse all reps". The per-row chevrons are '
    'correct - they read "Expand ZZAUTOTEST RepA" and "Collapse ZZAUTOTEST RepA"',
    'SV-8975'), None)

P[30273] = (EF('SV-8976'), blk(
    'a saved date range that is no longer valid does NOT fall back to This Month. The date button '
    'reads "Select Date Range", no data is requested at all, and the report sits empty with the '
    'no-data message. Nothing errors, so the second half of this test does pass - it is only the '
    'fall-back to the default that is missing. Every other saved setting does fall back correctly',
    'SV-8976'), None)

P[30202] = (H('needs the calendar driven past a 366-day span, which this harness could not do'), None, None)

P[30237] = (EF('SV-8977'), blk(
    'Subtotal itself is correct - it is the last column, it stays stuck to the right edge while you '
    'scroll sideways, and it is bold on the heading row, on every representative row and on the '
    'Totals row. What fails is the heading row: it does NOT stay stuck to the top when you scroll '
    'down the page, it scrolls away with the rows',
    'SV-8977'), None)

P[30238] = (EF('SV-8977'), blk(
    'the Totals row does not stay stuck to the bottom of the scrolling area - it scrolls away with '
    'the rows. The row itself is correct otherwise: it reads "Totals", the four name columns are '
    'merged, and every figure is the total across the whole filtered result',
    'SV-8977'), None)

P[30239] = (EF('SV-8978'), blk(
    'on a phone there is no separate totals bar underneath the table. The full wide Totals row stays '
    'inside the table and scrolls sideways with it, so you have to scroll right to read the '
    'Subtotal total',
    'SV-8978'), None)

P[30304] = (EF('SV-8979'), blk(
    'the expand/collapse chevrons measure 22 by 22 pixels, half the size they should be. The '
    'three-dot button and the Show Unassigned switch are both correctly 44 pixels tall',
    'SV-8979'), None)

P[30305] = (EF('SV-8980'), blk(
    'the table is not white. Every heading cell and every data row is the same pale grey as the page '
    'behind it, so the table does not read as a separate white surface. Two things are also out of '
    'line: the report title starts well to the left of the first column of data, and the Location '
    'filter stops short of the right-hand edge of the table',
    'SV-8980'), None)

P[30279] = (EF('SV-8981'), blk(
    'the Expanded View PDF is not built as one block per representative. It is a single flat table '
    'with every representative and every invoice in it, one grand Totals row at the bottom that '
    'this file should not have, no page break between representatives and no per-representative '
    'totals row. It also comes out on A3 paper instead of A4',
    'SV-8981'), None)

P[30281] = (EF('SV-8982'), blk(
    'the footer and the logo are correct on both files, but the file names are not the fixed names '
    'above - a date-range word is added to each one, so you get '
    '"sales-by-representative-summary-this_month.pdf" rather than '
    '"sales-by-representative-summary.pdf". The same happens to both spreadsheets',
    'SV-8982'), None)

P[30293] = (EF('SV-8983'), blk(
    'the file name, the three headings and the success message are all correct, but the file does '
    'NOT start with the UTF-8 marker. The report\'s own two spreadsheets do start with it, so this '
    'one file is the odd one out',
    'SV-8983'), None)

P[30277] = (EF('SV-8925'), blk(
    'the spreadsheets write money with a dollar sign and thousands commas - "$1,979.40" - and write '
    'Margin % with a percent sign, where they should hold plain numbers so the file can be '
    're-sorted and totalled. The filters, the full result set and the active order are all '
    'respected correctly',
    'SV-8925'), None)

if __name__ == '__main__':
    log, errs = [], []
    for cid, (m, k, e) in sorted(P.items()):
        st, cur = tr.get_case(cid)
        exp = cur.get('custom_expected') or ''
        try:
            new = writer.rebuild(exp, marker=m, known=k, body_edits=e)
        except Exception as ex:
            errs.append((cid, 'REBUILD ' + str(ex)[:200])); print('SKIP C%d %s' % (cid, str(ex)[:150])); continue
        # payload sanity BEFORE sending (the C30341 lesson: a byte-check proves the write, not the intent)
        import re
        nprov = new.count('This is the expected behaviour')
        nbuild = len(re.findall(r'Last checked against build ', new))
        nmark = len(re.findall(r'^AUTOMATION: ', new, re.M))
        if not (nprov == 1 and nbuild == 1 and nmark == 1 and new.rstrip().endswith(m)):
            errs.append((cid, 'PAYLOAD SHAPE prov=%d build=%d mark=%d endswith=%s' % (nprov, nbuild, nmark, new.rstrip().endswith(m))))
            print('SHAPE-REFUSE C%d prov=%d build=%d mark=%d' % (cid, nprov, nbuild, nmark)); continue
        try:
            print('OK C%d %s' % (cid, writer.write(cid, new, log=log)))
        except Exception as ex:
            errs.append((cid, 'WRITE ' + str(ex))); print('STOP C%d %s' % (cid, str(ex)[:400])); break
    json.dump({'log': log, 'errs': errs}, open('/tmp/rs4/write/sbr-oplog.json', 'w'), indent=1)
    print('wrote', len(log), 'errors', len(errs))
    for c, e in errs: print('   ERR C%s %s' % (c, e[:200]))
