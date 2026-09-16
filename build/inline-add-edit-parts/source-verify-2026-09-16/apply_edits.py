#!/usr/bin/env python3
"""Inline source-verify 2026-09-16: 5 genuine content edits grounded in spec 782761986
(2026-09-10 terminology/status revision). Writable cases only (atm=1). fr-view-safe:
edits keep <p>-block structure; served-page scan verifies afterwards."""
import json, urllib.request, base64, re
creds = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{creds['user']}:{creds['password']}".encode()).decode()
def get(cid):
    return json.load(urllib.request.urlopen(urllib.request.Request(
        f"https://shopview.testrail.io/index.php?/api/v2/get_case/{cid}", headers={'Authorization':f'Basic {AUTH}'})))
def post(cid, payload):
    req=urllib.request.Request(f"https://shopview.testrail.io/index.php?/api/v2/update_case/{cid}",
        data=json.dumps(payload).encode(), headers={'Authorization':f'Basic {AUTH}','Content-Type':'application/json'}, method='POST')
    return urllib.request.urlopen(req).status

RD = "read on 16 September 2026"

def rebuild_hidden(cid, thing, sid_ref):
    # C44993 (Add Part button) / C44994 (Edit control): spec 2026-09-10 removed Declined+Imported
    # from S1-N1/N2 -> hidden only on Complete/Invoiced/Paid; Declined now shows it (feature applies).
    preconds = (
      "<p>1. In the top menu click \"Work Orders\". You need work orders you can view in these statuses: "
      "Complete, Invoiced, Paid, and Declined. Invoiced and Paid may not be settable by hand — use whichever you can reach and note which those were.</p>"
      "<p>2. Open each such work order and go to its \"Lines\" tab; each line has a Parts section beneath it.</p>")
    if thing == "add":
        steps = (
          "<p>1. For each status you can reach (Complete, Invoiced, Paid, Declined), open a work order in that status and look at the Parts section of its lines to see whether the \"+ Add Part\" button is shown.</p>")
        exp_beh = (
          "<p>1. The \"+ Add Part\" button is not displayed on any work order line when the work order status is Complete, Invoiced, or Paid.</p>"
          "<p>2. On a Declined work order the \"+ Add Part\" button IS displayed and works — Declined is a status where inline Add Part applies.</p>")
    else:
        steps = (
          "<p>1. For each status you can reach (Complete, Invoiced, Paid, Declined), open a work order in that status and hover/focus its existing part lines to see whether the Edit control (pencil) is shown.</p>")
        exp_beh = (
          "<p>1. The Edit control is not displayed on part lines when the work order status is Complete, Invoiced, or Paid.</p>"
          "<p>2. On a Declined work order the Edit control IS displayed and works — Declined is a status where inline Edit applies.</p>")
    prov = (
      "<hr /><p>Source:</p><ul>"
      f"<li>Epic SV-9315 and story SV-9316 (Story 1, Add Part Button on Work Order Lines), and the Inline Add and Edit Parts on Work Order Lines specification, Confluence page 782761986, the 2026-09-10 terminology/status revision, section {sid_ref} and the Story 1 prerequisites, {RD}.</li>"
      "</ul>"
      "<p>Note: the 2026-09-10 revision removed Declined and Imported from this rule — Imported is an invoice status, not a work order status, and Declined is now a status where the feature applies. This supersedes the earlier expect-fail against story defect SV-9917, whose premise (the control hidden on Declined) is no longer the documented expectation; SV-9917 should be reviewed for closure.</p>"
      "<p>Last checked against build v26.36.2-617d8d1 on 9/10/2026.</p>"
      "<p>AUTOMATION: READY</p>")
    title = ("Add Part button hidden on Complete, Invoiced, Paid; shown on Declined" if thing=="add"
             else "Edit control hidden on Complete, Invoiced, Paid; shown on Declined")
    return {'title':title, 'custom_preconds':preconds, 'custom_steps':steps, 'custom_expected':exp_beh+prov}

def restamp(exp):
    return re.sub(r'read on \d{1,2} September 2026', RD, exp, count=1)

edits = {}
edits[44993] = rebuild_hidden(44993, "add", "S1-N1")
edits[44994] = rebuild_hidden(44994, "edit", "S1-N2")

# C45013 / C45054: status label is "Auth to order" on the build (Requested is the concept name).
for cid in (45013, 45054):
    c = get(cid); exp = c['custom_expected']
    exp = exp.replace("the existing Requested status", "the existing “Auth to order” status (the Requested / needs-details status)")
    exp = exp.replace("added as Requested and flagged", "added with the “Auth to order” status (Requested) and flagged")
    exp = exp.replace("the part is added as Requested", "the part is added with the “Auth to order” status (Requested)")
    exp = restamp(exp)
    edits[cid] = {'custom_expected': exp}

# C45222: S7-R2 "Not stocked" is now flagged unreachable (an inventory part always has a bin).
c = get(45222); exp = c['custom_expected']
exp = exp.replace('shows &ldquo;Not stocked&rdquo;', 'would show &ldquo;Not stocked&rdquo;')
if 'unreachable' not in exp:
    exp = exp.replace('&ldquo;Not stocked&rdquo; in warning styling instead of chips.',
                      '&ldquo;Not stocked&rdquo; in warning styling instead of chips — but this is unreachable at the moment, since every inventory part has at least one bin.')
exp = restamp(exp)
edits[45222] = {'custom_expected': exp}

for cid, payload in edits.items():
    st = post(cid, payload)
    c2 = get(cid)
    print(f"C{cid}: HTTP {st} | {RD in c2['custom_expected']=} | marker={'EXPECT FAIL' if 'EXPECT FAIL' in c2['custom_expected'] else ('READY' if 'AUTOMATION: READY' in c2['custom_expected'] else '?')}")
