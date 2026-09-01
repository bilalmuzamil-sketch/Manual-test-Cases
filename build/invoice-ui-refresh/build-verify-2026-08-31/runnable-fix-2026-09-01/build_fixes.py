#!/usr/bin/env python3
"""Make the FIRST step of every failing Invoice case say where to go.

Nothing is invented. Almost every one of these cases ALREADY carries its route in a precondition
line ("To open the document: click Work Orders ... Finance tab"). The fix lifts that verified
sentence into step 1, where the tester actually reads it. Only preconditions/steps change;
Expected Results are untouched (Rule 57).
"""
import json, re, html, urllib.request, base64, sys

cr = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{cr['user']}:{cr['password']}".encode()).decode()
def get(p):
    r = urllib.request.Request(cr['host'] + '/index.php?/api/v2/' + p, headers={'Authorization': 'Basic ' + AUTH})
    return json.load(urllib.request.urlopen(r, timeout=90))
def lines(v):
    v = v or ''; v = re.sub(r'<[^>]+>', '\n', v)
    return [x.strip() for x in html.unescape(v).split('\n') if x.strip()]

ROUTE_CUE = re.compile(r'^\s*\d+\.\s*(to (open|put|reach|view|see|get)\b|the (document|credit) is opened)', re.I)
LEAD = re.compile(r'^\s*\d+\.\s*')

# Routes for the handful of cases whose preconditions carry no route sentence. Each was OBSERVED
# on sv8218 (skill 18's recorded routes) -- none is invented.
FALLBACK = {
 '44987': ("To open a batch invoice: click \"Customers\" in the top menu, open a customer, click the "
           "\"Invoices\" tab, tick two or more invoice rows, and click \"Print\" in the toolbar that "
           "appears above the list. To open an imported invoice: click \"Work Orders\" in the top menu, "
           "set the Status filter to \"Imported\", and open a row - the document is shown on the record."),
 '45175': ("To open a portal invoice: the customer portal is a separate customer-facing sign-in and it "
           "exists only on staging, not on a QA branch. On the shop side, click \"Work Orders\" in the "
           "top menu, open the work order and use \"Send to Portal\" to put the invoice in front of the "
           "customer; the portal-side clicks must be recorded by whoever first runs this on staging."),
 '45185': ("To open a saved copy: click \"Work Orders\" in the top menu, open the work order, and open "
           "its History. The entries that keep a saved copy of the document are Invoice created, "
           "Invoice downloaded, Invoice emailed and Reviewed."),
 '45190': ("To open each record: an ordinary work order - click \"Work Orders\" in the top menu and open "
           "a row; an imported work order - click \"Work Orders\", set the Status filter to \"Imported\", "
           "and open a row; a parts sale - click \"Parts\" in the top menu, open \"Part Sales\", open a row. "
           "On each, the customer card is the panel down the left hand side."),
}

targets = [c for c, v in json.load(open(sys.argv[1])).items() if v['fails']]
out, notes = {}, []
for cid in sorted(targets):
    d = get(f'get_case/{cid}')
    pre, step = lines(d.get('custom_preconds')), lines(d.get('custom_steps'))
    route = next((LEAD.sub('', p) for p in pre if ROUTE_CUE.match(p)), None) or FALLBACK.get(cid)
    if not route:
        notes.append(f'C{cid}: NO ROUTE FOUND in preconditions and no recorded fallback - skipped, needs a human')
        continue
    action = LEAD.sub('', step[0]).rstrip('.') if step else 'Open the document'
    # If step 1 ALREADY carries a route, leave it alone -- prepending would duplicate the whole
    # click path in one sentence (C44964 did exactly that on the first build of this script).
    HAS_ROUTE = re.compile(r'\b(top menu|tab\b|icon\b|button\b|menu\b|Work Orders|Customers|Parts)\b', re.I)
    if HAS_ROUTE.search(action):
        new_first = f'1. {action}.'
    else:
        new_first = f'1. {route} Then {action[0].lower() + action[1:]}.'
    rest = []
    for i, s in enumerate(step[1:], start=2):
        body = LEAD.sub('', s).rstrip('.')
        # a later step with nothing to aim at gets told it happens on the document now on screen
        if len(body.split()) <= 4:
            body = f'{body} on the document now on screen'
        rest.append(f'{i}. {body}.')
    out[cid] = {'title': d['title'],
                'fields': {'custom_steps': {'blocks': [[new_first] + rest]}},
                'keep_marker': True}
for cid, v in out.items():
    v['fields']['custom_steps']['text'] = '\n'.join(v['fields']['custom_steps']['blocks'][0])
json.dump(out, open('steps-fix.json', 'w'), indent=1)
print(f'built step fixes for {len(out)} cases')
for n in notes: print(' !', n)
for cid in list(out)[:4]:
    print('\n== C' + cid); print(out[cid]['fields']['custom_steps']['text'])
