# -*- coding: utf-8 -*-
"""Assign a class to every unmatched quoted string and emit CLASSIFICATION.md.
A = direction to a control (preconds/steps) -> build's wording
B = expected result where a numbered requirement PINS the wording -> spec's wording kept
C = expected result, incidental description -> build's wording
N = no mismatch (checker artefact / state the default page cannot show / not an app control)
"""
import json,io,os
rows=json.load(open('/tmp/lb_misses.json'))
cases={c['id']:c for c in json.load(open('/tmp/lb_225.json'))}
LINK='https://shopview.testrail.io/index.php?/cases/view/%d'

# --- per (case, string) overrides: (class, build_shows, requirement, action)
OV={}
def o(cid,s,cls,build,req,act):
    OV[(cid,s)]=(cls,build,req,act)

for cid in (30172,30173,30194):
    o(cid,'Download (CSV)','A','"Download Summary (CSV)" and "Download Expanded View (CSV)"',
      'SBC S14-R2 - "The two menu items read exactly “Download Summary (CSV)” and “Download Expanded View (CSV)”"',
      'CHANGED to the build wording (which is also the spec wording)')
    o(cid,'Download (PDF)','A','"Download Summary (PDF)" and "Download Expanded View (PDF)"',
      'SBC S15-R2 - "The two menu items read exactly “Download Summary (PDF)” and “Download Expanded View (PDF)”"',
      'CHANGED to the build wording (which is also the spec wording)')
o(30436,'Download (CSV)','A','"Download Summary (CSV)" and "Download Expanded View (CSV)"',
  'TU S7-R4 (v5 capture) says "Download (CSV)"; C30434 records the four-item wording as the current requirement per Chris Ward 8/5/2026',
  'CHANGED to the build wording so the step names a control that exists')
TAB1='Approved - partially completed'; TAB2='Approved - not started'
for cid,fld in ((30488,'preconds'),(30489,'preconds'),(30490,'steps')):
    for t,b in ((TAB1,'Approved - Partially Completed'),(TAB2,'Approved - Not Started')):
        o(cid,t,'A','"%s"'%b,'WIP S1-R2 writes the tab labels in lower case',
          'CHANGED to the build wording - it tells the tester which tab to open')
for cid in (30462,30464,30490):
    for t,b in ((TAB1,'Approved - Partially Completed'),(TAB2,'Approved - Not Started')):
        OV.setdefault((cid,t),('C','"%s"'%b,'WIP S1-R2 writes the tab labels in lower case; the assertion here is PLACEMENT, not the label',
          'CHANGED to the build wording - the tab name is a locator, the assertion is unchanged'))
o(30452,'Completed (30)','B','tabs read "Approved - Partially Completed (34)", "Approved - Not Started (4)", "Completed (4)", "Estimates (14)"',
  'WIP S1-R2 - "four tabs, labeled (in order) “Approved - partially completed”, “Approved - not started”, “Completed”, and “Estimates”"',
  'NOT CHANGED - the label IS the assertion here, and the case currently asserts the BUILD’s Title Case against the spec. ESCALATED to the QA lead')
o(30112,'Search customers…','B','placeholder "Search customers" - no ellipsis, not pinned to the top',
  'SBC S18-R2 - "A “Search customers…” hint is pinned to the top of the dropdown"',
  'NOT CHANGED - spec pins the wording; recorded as a build deviation')
o(30128,'Expand all.','B','no tooltip at all; the accessible name is "Expand all customers"',
  'SBC S8-R18 - "Hovering the header-row chevron shows an “Expand all” or “Collapse all” tooltip"',
  'NOT CHANGED - spec pins the wording; recorded as a build deviation')
o(30128,'Collapse all','B','no tooltip at all; the accessible name is "Collapse all customers"',
  'SBC S8-R18','NOT CHANGED - spec pins the wording; recorded as a build deviation')
o(30423,'Filter by Technician','B','the field label reads "Filter By Technician" (capital B)',
  'TU S5-R1 - "a filter labeled “Filter by Technician”"',
  'NOT CHANGED - spec pins the wording; recorded as a build deviation (one letter)')
o(30425,'Select all','B','the control reads "All technicians"',
  'TU S5-R6 - "The filter has a control labeled “Select all”"',
  'NOT CHANGED - spec pins the wording; recorded as a build deviation')
o(30159,'Print','N','the menu has no Print item',
  'SBC Story 16 - "(removed - Print retired)"',
  'NOT CHANGED and NOT a deviation - the case asserts there is NO Print item and the build agrees')
for cid in (30434,):
    o(cid,'Expanded (PDF)','N','menu reads "Download Summary (PDF)", "Download Summary (CSV)", "Download Expanded View (PDF)", "Download Expanded View (CSV)"',
      'C30434’s own expected result','NOT CHANGED - this string is inside the case’s known-issue note, not an instruction. REPORTED: the SV-8881 symptom no longer reproduces')
    o(cid,'Expanded (CSV)','N','as above','C30434’s own expected result','NOT CHANGED - see above')

# --- generic reason buckets for everything else
PUNCT={'Parts & Service.','Parts & Service,','Parts only,','Parts only','Service only','Service only,',
 'Service only.','All locations.','All locations,','Column Selection.','Column Selection','None.','None',
 'Parts Sales,','Parts Sales','All customers.','Sales By Customer.','N/A,','Mon D, YYYY,','Collapse all',
 'Expand all customers','Expand all technicians','Collapse all technicians',"Expand Christian Pitts's daily breakdown",
 "Collapse Christian Pitts's daily breakdown","Internal hours valued at each location's default labor rate"}
NOTCTRL={'can this person see reports','Styles','contains','collapse','(an em-dash), NOT',
 '(distinguishing it from','cell carries the assistive-technology label','— for example',
 ', two decimal places, and thousands separators — for example',
 "only when EVERY visible technician's Est. Lost Labor is",'cleared','not found','Multiple'}
def bucket(cid,s,f):
    if (cid,s) in OV: return OV[(cid,s)]
    if s in PUNCT:
        return ('N','the label itself is on the build; the trailing full stop or comma is sentence punctuation the author put inside the quote marks',
                'n/a','NOT CHANGED - no mismatch. Checker artefact.')
    if s in NOTCTRL:
        return ('N','not a control on the page - a plain-English gloss, a browser developer-tools panel, a cell value, or prose caught by the quote pattern',
                'n/a','NOT CHANGED - no mismatch.')
    return ('N','a state the default page cannot show - a toast, empty state, tooltip, seeded value, worked example, file name, or export/PDF content',
            'n/a','NOT CHANGED - the checker cannot see it on the landing page; it is not evidence of a wrong label.')

KEY={'title':'title','preconds':'custom_preconds','steps':'custom_steps','expected':'custom_expected'}
def sentence(cid,f,s):
    t=cases[cid].get(KEY[f]) or ''
    for line in t.split('\n'):
        if '"%s"'%s in line: return line.strip()
    return t.strip()[:200]

out=io.StringIO(); tally={}
out.write('| # | Case | Report | Field | What OUR case prints | What the BUILD shows | Requirement that pins it | Class | Action |\n')
out.write('|---:|---|---|---|---|---|---|:---:|---|\n')
n=0
for r in sorted(rows,key=lambda r:(r['report'],r['id'])):
    for f in ('title','preconds','steps','expected'):
        for s in r['per_field'].get(f,[]):
            cls,build,req,act=bucket(r['id'],s,f)
            tally[cls]=tally.get(cls,0)+1; n+=1
            ctx=sentence(r['id'],f,s).replace('|','\\|')
            if len(ctx)>150: ctx=ctx[:150]+'…'
            out.write('| %d | [C%d](%s) | %s | %s | `"%s"` — %s | %s | %s | **%s** | %s |\n'%(
                n,r['id'],LINK%r['id'],r['report'].replace(' Report',''),f,s.replace('|','\\|'),ctx,
                build.replace('|','\\|'),req.replace('|','\\|'),cls,act.replace('|','\\|')))
open('/tmp/lb_table.md','w').write(out.getvalue())
print('rows:',n,'| cases:',len(rows))
print('tally by class:',tally)
casecls={}
for r in rows:
    cl=set()
    for f in ('title','preconds','steps','expected'):
        for s in r['per_field'].get(f,[]): cl.add(bucket(r['id'],s,f)[0])
    for pri in 'ABCN':
        if pri in cl: casecls[r['id']]=pri; break
from collections import Counter
print('cases by highest class:',Counter(casecls.values()))
json.dump(casecls,open('/tmp/lb_casecls.json','w'))
