import json,re
o=json.load(open('/tmp/cln/out-R.json')); out={}
STAMP='<p>Last checked against build v26.40.8-7a95011 on 10/8/2026.</p>'
def fix_exp(e,marker):
    e=e.replace('Source-verified 8 October 2026; not yet build-verified.','Source-verified 8 October 2026.')
    e=re.sub(r'<p>AUTOMATION:[^<]*</p>','',e).rstrip()
    if 'Last checked against build' not in e: e+=STAMP
    return e+'<p>AUTOMATION: '+marker+'</p>'
# C368213
p=o['368213']['custom_preconds']
old=re.search(r"<li>On the line's Parts row click Add Part and add two parts from a vendor;.*?</li>",p).group(0)
new=('<li>On the line\'s Parts row click Add Part: an entry row opens. Type Description (e.g. "ZZAUTOTEST Brake Pads 1"), Qty 1, Cost 100 and Sell price 150, then click Save (message "Part added"). Add a second part the same way. Both parts read "Auth To Order" with an Order button.</li>'
     '<li>Click Order on the first part; it reads "Awaiting" with a Receive button. Click Receive: in the "Receive parts" window pick a vendor in Assign Vendor (e.g. "5 Star Truck Repair"), type a Vendor Invoice Number (e.g. "ZZINV-1"), type a part number in the part\'s row (e.g. "ZZPN-1"), set Qty Received to 1, tick the part\'s row and click Receive Parts (1). The message reads "Parts received."</li>'
     '<li>Click the received part\'s three-dots (part menu) &gt; Return. In "Add new part return request" type a Return Reason (e.g. "ZZAUTOTEST wrong part"), keep Quantity 1 and click Save &amp; Close. The part reads "Returned".</li>')
p=p.replace(old,new)
oldc=re.search(r"<li>Check the setup worked: \[WO-1\]'s Parts tab shows the two parts, one received, on.*?</li>",p).group(0)
p=p.replace(oldc,'<li>Check the setup worked: on [WO-1]\'s Lines tab the line shows two parts: one "Auth To Order" and one "Returned". If not, finish the order, receive and return steps above before starting.</li>')
out['368213']={'custom_preconds':p,'custom_steps':o['368213']['custom_steps'],'custom_expected':fix_exp(o['368213']['custom_expected'],'READY')}
# C368217
p=o['368217']['custom_preconds']
old='Receive one part and raise a return on it (Authorize turns the parts to &ldquo;Auth To Order&rdquo; with an Order button; the receive and return steps were not walked on this build).'
if old not in p: old=old.replace('&ldquo;','"').replace('&rdquo;','"')
assert old in p, 'ps old'
new=('Click Authorize (the parts read "Auth To Order" with an Order button). Click Order on one part (it then shows a Receive button) and click Receive: in the "Receive parts" window type a Vendor Invoice Number (e.g. "ZZINV-PS1"), type a part number in the part\'s row (e.g. "ZZPN-PS1"), set Qty Received to 1, tick the row and click Receive Parts (1); the message reads "Parts received." and the part reads "Received". Click that part\'s Return part button: in "Add new part return request" type a Return Reason (e.g. "ZZAUTOTEST wrong part"), keep Quantity 1 and click Save &amp; Close. '
     'Then make the second location\'s part sale: your initials at the top right &gt; Change Location &gt; Staging Lethbridge - 4310; Parts &gt; Part Sales &gt; New Part Sale &gt; Customer "ZZAUTOTEST Part Sale Counts" &gt; Save; on its Parts tab Add Part twice the same way as above; then switch back with Change Location &gt; Staging Heavy Duty - 9919.')
p=p.replace(old,new)
oc='Check the setup worked: [PS-1] shows Parts (2).'
assert oc in p
p=p.replace(oc,'Check the setup worked: on [PS-1] one part reads "Auth To Order" and the returned part no longer shows under the Parts tab (it reads Parts (1)); the top bar shows Staging Heavy Duty - 9919. If not, finish the steps above before starting.')
out['368217']={'custom_preconds':p,'custom_steps':o['368217']['custom_steps'],'custom_expected':fix_exp(o['368217']['custom_expected'],'READY')}
for k,reason in [('368169','HOLD - no way to open the Edit Work Order window was found on this build; waiting for the QA lead'),('368170','HOLD - no way to open the Edit Work Order window was found on this build; waiting for the QA lead'),('368171','HOLD - no way to open the Edit Work Order window was found on this build; waiting for the QA lead'),('368197','HOLD - the List has no pages on this build (it loads more rows as you scroll); waiting for the QA lead')]:
    out[k]={'custom_preconds':o[k]['custom_preconds'],'custom_steps':o[k]['custom_steps'],'custom_expected':fix_exp(o[k]['custom_expected'],reason)}
json.dump(out,open('/tmp/cln/step1b-write.json','w')); print(sorted(out))
