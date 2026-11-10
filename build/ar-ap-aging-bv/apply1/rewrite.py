# A/R and A/P aging build verification on sv11315 (10 Nov 2026) — pass 1, every test in group 90418.
# Only labels/routes seen on v26.45.2-6a8b89c (probes 01-08, build/ar-ap-aging-bv/probe/) and the build line + marker.
# Expected results are untouched apart from: the build line, the marker, and the code "S8-R3" removed from one plain-words note.
import json, re, os
D = os.path.dirname(os.path.abspath(__file__)); BEFORE = json.load(open(f'{D}/../before/all.json'))
OLDLINE = '<p>Not yet checked against a build: the QA build v26.45.2-6a8b89c exists since 10 Nov 2026 and this case has not been run on it yet.</p>'
STAMP = '<p>Last checked against build v26.45.2-6a8b89c (QA site sv11315) on 11/10/2026.</p>'
NA = '<p>AUTOMATION: Not available on Build to test Yet - Last checked 11/10/2026</p>'
ROLE = [  # permission names as the role screen shows them (probe 05)
 ('"Reports → Page Access"', '"Reports" in the Page Access card'),
 ('"Vendor Order Management → View"', '"Vendor and order management → View" (under the Parts Department switch)'),
 ('"Vendor Order Management → Create &amp; Edit"', '"Vendor and order management → Create &amp; Edit" (under the Parts Department switch)'),
 ('"Invoicing &amp; Payments → View"', '"Invoicing &amp; payments → View"'),
 ('"Work Orders → View"', '"Work orders → View"'),
 ('"Part Sales → View"', '"Part sales → View" (under the Parts Department switch)'),
]
OPEN = {'A/R Summary': 'A/R Aging Summary', 'A/R Detail': 'A/R Aging Detail', 'A/R Collection': 'A/R Aging Collection',
        'A/P Summary': 'A/P Aging Summary', 'A/P Detail': 'A/P Aging Detail', 'A/P Unpaid Invoices': 'A/P Unpaid Invoices'}
STEP = {  # exact step text -> text with an on-screen anchor (checker R4); same action, same count
 'Read the bucket rows from top to bottom without expanding anything.': 'On the report page, read the bucket rows from top to bottom without expanding anything.',
 "Look at the three vendor credits' numbers.": "Look at the three vendor credits' numbers in the No. column.",
 "Look at bill A's number.": "Look at bill A's number in the No. column.",
 'Read the table area.': 'Read the area below the column headings.',
 'Open the CSV.': "Open the downloaded CSV file (from your browser's downloads list).",
 'Find the groups of vendor A and vendor B and note their order.': 'On the report page, find the group rows of vendor A and vendor B and note their order.',
 "Read the count in brackets after vendor A's name.": "Read the count in brackets after vendor A's name in its group row.",
 'Read the Location of bill A and bill B.': "Read bill A's and bill B's cells in the Location column.",
 'Read the Location of vendor credit A and vendor credit B.': "Read vendor credit A's and vendor credit B's cells in the Location column.",
 'Read the Location cell of vendor A and vendor B.': "Read vendor A's and vendor B's cells in the Location column.",
 "Look at invoice B's number.": "Look at invoice B's number in the ID column.",
 "Look at invoice A's and invoice B's numbers.": "Look at invoice A's and invoice B's numbers in the ID column.",
 "Look at invoice A's number.": "Look at invoice A's number in the ID column.",
 "Look at bill A's and vendor credit A's numbers.": "Look at bill A's and vendor credit A's numbers in the No. column.",
 "Look at vendor A's name.": "Look at vendor A's name in the Vendor column.",
 'Look at the document numbers that are links and compare them with the links on Work In Progress.': 'On the report page, look at the document numbers that are links and compare them with the links on Work In Progress.',
 'Look at the table.': 'Look at the report page below the column headings.',
 'Look for a sideways scroll bar under the table.': 'Look for a sideways scroll bar below the last row of the report page.',
 'Read the Location cells.': 'Read the cells in the Location column.',
 'Look at the vendor names and compare them with the links on Work In Progress.': 'Look at the vendor names in the Vendor column and compare them with the links on Work In Progress.',
 'Open the A/R Collection address saved before the release.': 'Paste the A/R Collection address saved before the release into the browser\'s address bar and press Enter (it opens on the Reports page).',
 'Open the A/P Unpaid Invoices address saved before the release.': 'Paste the A/P Unpaid Invoices address saved before the release into the browser\'s address bar and press Enter (it opens on the Reports page).',
 'After the release is installed, open the ShopView home page.': 'After the release is installed, click Dashboard in the top menu.',
 'After the release is installed, open Work Orders at your current location.': 'After the release is installed, click Work Orders in the top menu at your current location.',
}
for k, v in OPEN.items(): STEP[f'Open {k}.'] = f'Open {k} (Reports, then "{v}" in the left menu).'
NOTE = ('PRD version 11 (S8-R3, 5 Nov 2026)', 'PRD version 11 (its layout rules, 5 Nov 2026)')
def rewrite(c):
    p, s, e = c['custom_preconds'], c['custom_steps'], c['custom_expected']; used = []
    for o, n in ROLE:
        if o in p or o in s: used.append('role'); p = p.replace(o, n); s = s.replace(o, n)
    def sub(h):
        def f(m):
            t = m.group(1).replace('&#39;', "'")
            if t in STEP: used.append('step'); return '<li>' + STEP[t] + '</li>'
            return m.group(0)
        return re.sub(r'<li>(.*?)</li>', f, h)
    p, s = sub(p), sub(s)
    assert e.count(OLDLINE) == 1, c['id']
    e = e.replace(OLDLINE, STAMP)
    if NA in e: e = e.replace(NA, '<p>AUTOMATION: READY</p>'); used.append('ready')
    if NOTE[0] in e: e = e.replace(*NOTE); used.append('note')
    return p, s, e, used
if __name__ == '__main__':
    import collections; u = collections.Counter(); n = 0
    for k, c in BEFORE.items():
        *_, used = rewrite(c); n += 1
        for x in used: u[x] += 1
    print('tests', n, dict(u))
    hit = set()
    for c in BEFORE.values():
        for t in re.findall(r'<li>(.*?)</li>', c['custom_preconds'] + c['custom_steps']):
            if t.replace('&#39;', "'") in STEP: hit.add(t.replace('&#39;', "'"))
    print('unused step keys:', [k for k in STEP if k not in hit])
