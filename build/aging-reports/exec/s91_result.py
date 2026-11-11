"""s91_result.py — 11 Nov 2026: C1062570 / C1062571 re-run on the page (after SV-12540 was found to be our own measurement error and closed by the
QA lead): each group's rows counted ON THE PAGE after opening and after each scroll to the end, every document number read. Replaces the Failed results."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b=()): dst = PP + 'pics/%s-%s' % (cid, n); ann(PP + 's91/' + n, dst, t, [], [], list(b)); return dst
R = {
 'C1062570': {'verdict': 'Passed', 'observed': [
    'A/R Aging Collection, as of today, only customer "ZZAUTOTEST OVER100 C" ticked (113 overdue invoices).',
    'Step 1: the group row reads "ZZAUTOTEST OVER100 C (113)" - more than 100.',
    'Step 2: opening the group shows its first 100 invoices (100 rows on the page; the 100th is S11315-17653).',
    'Step 3: scrolling to the end of those 100 adds the next ones underneath: 113 rows (the remaining 13 - up to 100 more each time).',
    'Step 4: scrolled to the end until nothing more loads: 113 rows, 113 different invoice numbers, none repeated - equal to the count in brackets.',
    'Measured on the page itself (rows counted after each scroll), not from the server reply - the earlier Failed result and its ticket came from reading the reply.'],
  'pictures': [P('C1062570', '01-C1062570-1-count.png', 'Step 1: the count in brackets - 113'), P('C1062570', '02-C1062570-2-open.png', 'Step 2: the group opens with its first 100 invoices'), P('C1062570', '05-C1062570-4-end.png', 'Step 4: the end - 113 invoices, each once')]},
 'C1062571': {'verdict': 'Passed', 'observed': [
    'A/P Unpaid Invoices Report, as of today, only vendor "Grand Haven Diesel Services LLC" ticked (578 unpaid bills - well over 2 x 100, so the "100 more each time" is seen several times).',
    'Step 1: the group row reads "Grand Haven Diesel Services LLC (578)".',
    'Step 2: opening the group shows its first 100 bills (100 rows on the page).',
    'Step 3: each scroll to the end of what is drawn adds up to 100 more: 200, 300, 400, 500, then the last 78 (578).',
    'Step 4: scrolled until nothing more loads: 578 rows - equal to the count in brackets. Two bill numbers appear twice (979569 and 1008064): the downloaded spreadsheet also holds each of them twice, as two separate bills with the same vendor invoice number, date and amount - they are two documents in the data, not a row loaded twice. Every other number appears once.',
    'Measured on the page itself, not from the server reply.'],
  'pictures': [P('C1062571', '06-C1062571-1-count.png', 'Step 1: the count in brackets - 578'), P('C1062571', '07-C1062571-2-open.png', 'Step 2: the group opens with its first 100 bills'), P('C1062571', '08-C1062571-3-scroll1.png', 'Step 3: after a scroll - 100 more added'), P('C1062571', '10-C1062571-4-end.png', 'Step 4: the end - 578 bills')]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s91 group paging on the page'}, 'results': R}, open(PP + 'RESULTS-s91.json', 'w'), indent=1); print(list(R))
