# -*- coding: utf-8 -*-
"""File the Sales By Customer zeros-totals-row defect.

Shape per Standing Rule 52 as amended 2026-08-05/06:
  issuetype = Story Defect (10007) · parent = the OWNING STORY (SV-8616) ·
  priority = Medium (Rule 53 as amended 2026-08-06) · owning story ALSO linked `relates to` ·
  NO Product Area (customfield_10153 does not exist on this type) · NO Severity
  (mirrors the 29 peers filed today, which carry customfield_10418 = None).

Description format mirrors the peers 1:1 (Rule 16): bold-paragraph headings, plain paragraphs,
the seven layman sections used by SV-8962 / SV-8963 / SV-8964 / SV-8965 / SV-8966, and the
source block last (QA lead: "this source block MUST exist for every ticket you created").
"""
import json, sys, subprocess, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', '..', 'ticket-source-blocks-2026-08-06', 'tools'))
import jiralib as J

STORY = 'SV-8616'
V = '15'


def src(anchor, quote):
    return ("Where this expected behaviour comes from: the Sales By Customer report specification, "
            "version %s, requirement %s, which says: \"%s\"." % (V, anchor, quote))


SEC = [
 ('What happens now', [
  'On the Sales By Customer report, when the filters match no customers the Totals line at the bottom of '
  'the table disappears completely. The column headings stay, the message "No sales data found for the '
  'selected filters." appears, and there is no Totals line at all.',
  'The written description asks for something different: it wants the Totals line to stay and to show '
  'zeros. That matters because a line of zeros tells the reader the report did run and genuinely found '
  'nothing. With the line simply gone, a reader cannot tell "nothing matched" apart from "the bottom of '
  'the report failed to load".',
  'The same happens in the downloaded spreadsheet and PDF: the file arrives with the column headings and '
  'nothing else - no data rows, which is right, but also no Totals line, which is not.']),
 ('How to see it', [
  'Open Reports, then Sales By Customer. Leave the date range on This Month, Product Type on '
  '"Parts & Service" and Location on "All locations". The report shows customers and, at the bottom, a '
  'bold Totals line.',
  'Open the Customer filter and choose "Clear all" at the top of the list. Close the list. The filter now '
  'reads "None".',
  'Look at the table: the column headings are still there and the message "No sales data found for the '
  'selected filters." appears in the middle. The Totals line is gone.',
  'Now open the three-dot menu at the top of the report and choose "Download (CSV)", then "Download '
  '(PDF)". Open both files. Each one has the column headings and nothing after them - no Totals line.',
  'To put the report back, open the Customer filter again and choose "All customers". The Totals line '
  'returns straight away.']),
 ('What should happen instead', [
  'The Totals line should stay on the screen and read zeros, alongside the empty-state message. The '
  'downloaded spreadsheet and PDF should also carry a Totals line of zeros under the column headings.']),
 ('What we tested it on', [
  'QA branch sv8582, build v3.5-7168d14, on 6 August 2026. Signed in as an Administrator, location '
  'switcher set to "Staging Heavy Duty - 9919", desktop Chrome.',
  'Test data: no particular customer, work order, part or asset is needed, and that is the point of the '
  'test - the state being checked is the one where nothing matches. Date range This Month (1 to 6 August '
  '2026), Product Type "Parts & Service", Location "All locations" (both locations), and the Customer '
  'filter emptied with "Clear all" so its label reads "None".']),
 ('How bad is it', [
  'Low. Nothing is calculated wrongly and no data is lost - the figures are correct whenever there is '
  'anything to show. It is the empty case that reads as though part of the report is broken.']),
 ('What we ruled out', [
  'This is not the Totals line being broken in general. With the same date range and the same locations '
  'and the customers left in, the report shows six customers and a Totals line reading 0.0, $1,699.52, '
  '$1,699.52, $0.00, $0.00, $178.47, $1,699.52, 90.5%, $1,877.99. The only thing changed between the two '
  'checks was the Customer filter, so the Totals line goes missing specifically when nothing matches.',
  'It is also not a slow screen: the empty state had finished loading, the message was showing, and the '
  'whole toolbar - date range, Product Type, Customer, the column chooser and the download menu - was '
  'still live and usable.']),
 ('Images', [
  'A screenshot is attached: sbc-empty-state.png. It shows the report with the Customer filter reading '
  '"None", the full row of column headings, the message "No sales data found for the selected filters." '
  'and no Totals line beneath the table.']),
 ('Technical details for developers', [
  'Screen: after "Clear all" the element carrying CSS class "report-totals-row" is absent from the table. '
  'Captured as totals = null, with the collapsed filter label "None" and 0 rows. With customers included '
  'the same table renders "q-tr report-totals-row".',
  'Report request: GET https://sv8582api.qa.shopview.com/api/reporting/reports/sales-by-customer'
  '?range=custom&start_date=2026-08-01&end_date=2026-08-06&productType=all'
  '&pagination[page]=1&pagination[rowsPerPage]=30&pagination[sortBy]=customer&pagination[descending]=false',
  'Export request: the same path with /export and variant=summary|expanded and format=csv|pdf.',
  'The server side is not the problem: the totals are computed on the server over the whole filtered set '
  '(requirement S18-R6) and come back correctly whenever the set is non-empty, so the zero-row case is a '
  'rendering and file-generation gap rather than a missing calculation.',
  'Requirement anchors: S18-N1 covers the screen, S18-R10 covers the CSV and PDF downloads. The Story 16 '
  'placeholder note in the same document restates the export half and points at S18-R10.',
  'Evidence held in our repository: build/report-suite/full-viu-2026-08-06/evidence/2026-08-06-session2/ '
  '- sbc9.json (the after-clear capture), sbc-empty-state.png (the screenshot) and sbc1.json (the '
  'populated Totals line used as the control). The downloaded no-match files were opened and read during '
  'that session but were not kept, so the screen half is the half with a retained capture.']),
 ('Where this expected behaviour comes from', [
  src('S18-N1', 'When no customer is selected (every customer cleared), the report shows the empty state '
                '(Story 17) and the totals row shows zeros.'),
  src('S18-R10', 'If an export (CSV or PDF) is triggered while the active filters match no customers - '
                 'for example, no customer is selected - the export still downloads, containing the '
                 'column headers and a totals row of zeros, with no data rows and no warning.'),
  'That is source type 2: the specification (PRD) in Confluence. The version number given is the '
  'Confluence page version, not the version written inside the page.']),
]

SUMMARY = ('Sales By Customer drops the Totals line entirely when nothing matches, '
           'on screen and in the downloads, instead of showing zeros')


def adf():
    content = []
    for head, paras in SEC:
        content.append({'type': 'paragraph',
                        'content': [{'type': 'text', 'text': head, 'marks': [{'type': 'strong'}]}]})
        for p in paras:
            content.append({'type': 'paragraph', 'content': [{'type': 'text', 'text': p}]})
    return {'type': 'doc', 'version': 1, 'content': content}


def post(path, payload, out):
    p = '/tmp/z/_post_payload.json'
    json.dump(payload, open(p, 'w'))
    r = subprocess.run(['curl', '-s', '-o', out, '-w', '%{http_code}', '-X', 'POST',
                        '-H', 'Cookie: ' + J.CK, '-H', 'Content-Type: application/json',
                        '-H', 'Accept: application/json', '-H', 'Origin: ' + J.BASE,
                        '-H', 'Referer: ' + J.BASE + '/jira/software/projects/SV/issues',
                        '--data-binary', '@' + p, J.BASE + path],
                       capture_output=True, text=True)
    code = r.stdout.strip()
    try:
        return code, json.load(open(out))
    except Exception:
        return code, open(out, errors='replace').read()[:800]


if __name__ == '__main__':
    if '--dry-run' in sys.argv:
        d = adf()
        print('summary (%d chars): %s' % (len(SUMMARY), SUMMARY))
        print('paragraphs:', len(d['content']))
        for n in d['content']:
            t = n['content'][0]['text']
            bold = n['content'][0].get('marks')
            print(('## ' if bold else '   ') + t[:150])
        json.dump({'fields': {'project': {'key': 'SV'}, 'issuetype': {'id': '10007'},
                              'parent': {'key': STORY}, 'summary': SUMMARY,
                              'description': d, 'priority': {'name': 'Medium'}}},
                  open('/tmp/z/create-payload.json', 'w'), indent=1)
        print('\npayload written to /tmp/z/create-payload.json')
        sys.exit(0)

    payload = {'fields': {'project': {'key': 'SV'}, 'issuetype': {'id': '10007'},
                          'parent': {'key': STORY}, 'summary': SUMMARY,
                          'description': adf(), 'priority': {'name': 'Medium'}}}
    code, d = post('/rest/api/3/issue', payload, '/tmp/z/created.json')
    print('CREATE HTTP', code, json.dumps(d)[:400])
    if code not in ('200', '201'):
        sys.exit(1)
    key = d['key']
    print('KEY', key)
    lc, ld = post('/rest/api/3/issueLink',
                  {'type': {'name': 'Relates'},
                   'inwardIssue': {'key': key}, 'outwardIssue': {'key': STORY}},
                  '/tmp/z/link.json')
    print('LINK HTTP', lc, str(ld)[:200])
    json.dump({'key': key, 'create_http': code, 'link_http': lc},
              open(os.path.join(HERE, '..', 'created.json'), 'w'), indent=1)
