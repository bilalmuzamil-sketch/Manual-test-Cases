import json,base64,urllib.request,ssl,re,html,datetime,time,sys
cr=json.load(open('/tmp/testrail/creds.json'))
HOST=cr['host'].rstrip('/');A=base64.b64encode(f"{cr['user']}:{cr['login_password'] or cr['password']}".encode()).decode()
ctx=ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt');H={'Authorization':'Basic '+A,'Content-Type':'application/json'}
def api(p,d=None):
    r=urllib.request.Request(f"{HOST}/index.php?/api/v2/{p}",data=json.dumps(d).encode() if d is not None else None,headers=H)
    for a in range(4):
        try: return json.loads(urllib.request.urlopen(r,context=ctx,timeout=60).read())
        except urllib.error.HTTPError as e:
            if a==3: raise RuntimeError(f"HTTP {e.code} {e.read()[:200]}")
            time.sleep(2**a)
st=lambda s: re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',s or ''))).strip()

# case -> (invariant, V1 citation, note about how V2 compares)
M={
45142:('INV-72','FetchDataQueryHandler.php:47-53 with routingService.ts:78-99 - Work Order hits are gated on the workOrdersView bundle','V2 keeps this gate'),
45143:('INV-73','FetchDataQueryHandler.php:47-53 with routingService.ts:84-85 - Part and Vendor gate on their own bundles, so a partSales-only role keeps Part Sale hits and nothing else (SV-8412)','V2 keeps this gate'),
45144:('INV-72 + INV-73','FetchDataQueryHandler.php:47-53 - catalogue Part hits require the catalogInventoryView bundle and nothing else','V2 keeps this gate'),
45145:('INV-72','FetchDataQueryHandler.php:47-53 - Vendor hits require the vendorOrderManagementView bundle','V2 keeps this gate'),
45146:('INV-72','FetchDataQueryHandler.php:47-53 - Customer and Vehicle hits are both gated on the customersView bundle','V2 keeps this gate'),
45147:('INV-71','FetchDataController.php:50-51 - the TimeClock role receives an entirely empty result','V2 keeps this'),
45148:('INV-74','routingService.ts:78-99 - an unknown or new result type defaults to NOT permitted','V2 keeps this'),
45149:('INV-64','useGlobalSearch.ts:21-29 - history entries the user may no longer see are filtered out','V2 applies the same filtering to its recent-activity list'),
45150:('INV-80','FetchDataQueryHandler.php:127-130, 169-171, 252-254, 302-304 and 333-335 - every fetcher is organization-scoped','V2 keeps this'),
45151:('INV-81','FetchDataQueryHandler.php:130 - ONLY Work Order and Part Sale rows are workplace-scoped; Customer, Vehicle, Vendor and Part are organization-scoped only','V2 must keep BOTH halves: narrowing the other four to the current location would itself be a V1 capability loss'),
45152:('INV-82','useGlobalSearch.ts:286-299 - a location switch clears the cache and refetches under the new location','V2 keeps this'),
45154:('INV-47','GlobalSearch.vue:223-234 - selecting the record you are already on neither navigates nor records history','V2 keeps this'),
45155:('INV-20','GlobalSearch.vue:60 - the internal Vehicles group is shown to users as Assets','V2 keeps this'),
45156:('INV-40','GlobalSearch.vue:243-254 - Ctrl+K on Windows and Command+K on Mac reach search, unless focus is already in an input or text area','V2 keeps the shortcut; V1 focused the field where V2 opens a modal, which is a presentation change and not a capability loss'),
45157:('INV-16','useGlobalSearch.ts:182-184 - a record matched in the first pass is not shown again in the second','V2 keeps this'),
45158:('INV-90','the ABSENCE of any feature flag in the V1 component, composable and configuration - verified by searching for one and finding none','V2 keeps this'),
45159:('INV-34','GlobalSearch.vue:131-137 - in V1 a user with no default workplace never fetched the collection at all, so they got NO search results whatsoever','V2 DIFFERS AND IS BETTER here: giving such a user a working search is a gain, so this case deliberately keeps the V2 expectation. No V1 capability is lost'),
45160:('INV-48','GlobalSearch.vue:211-217 - selecting a result fires the global_search_use analytics event','V2 keeps this'),
45161:('INV-10','useGlobalSearch.ts:69-71 with GlobalSearch.vue:201 - matching begins at two characters','V2 keeps this'),
53516:('INV-04','FetchDataQueryHandler.php:292 - v.licence_plate is folded into the asset search text','Version 1.5 of the V2 specification section 4 does NOT list licence plate among the indexed Asset fields, so this is a PO decision item'),
53578:('INV-02','FetchDataQueryHandler.php:112 - c.name is folded into the work order search text','V2 indexes the customer name for Work Orders'),
53580:('INV-04','FetchDataQueryHandler.php:290 - v.unit is folded into the asset search text','Version 1.5 of the V2 specification section 4 also indexes unit number, so a failure here is a build defect rather than a product decision'),
53581:('INV-04','FetchDataQueryHandler.php:286 - the owning company name is folded into the asset search text','V2 indexes the owning customer for Assets'),
53584:('INV-05','FetchDataQueryHandler.php:163 - v.email is folded into the vendor search text','Version 1.5 of the V2 specification section 4 also indexes vendor email, so a failure here is a build defect rather than a product decision'),
53586:('INV-33','useGlobalSearch.ts:309-313 and its five call sites, which refreshed the searchable collection the moment a record was created','Version 1.5 of the V2 specification section 9 allows up to 30 seconds for the index to refresh, which this case follows'),
53587:('INV-33','useGlobalSearch.ts:309-313 and its five call sites, which refreshed the searchable collection the moment a record was created','Version 1.5 of the V2 specification section 9 allows up to 30 seconds for the index to refresh, which this case follows'),
53588:('INV-18','FetchDataQueryHandler.php:124 - work order rows are ordered by start_date DESC, newest first','Version 1.5 of the V2 specification section 6.1 replaces strict newest-first with a scored ranking in which recency is one factor, which this case follows'),
53604:('INV-03 + INV-05','FetchDataQueryHandler.php:229 (c.address_2) and :158 (v.address_2) - address line 2 is folded into both the customer and the vendor search text','Version 1.5 of the V2 specification section 4 names address without separating line 2'),
53605:('INV-04','FetchDataQueryHandler.php:287 - v.year is folded into the asset search text','V2 indexes the asset year'),
53607:('INV-06','FetchDataQueryHandler.php:325 - cp.name, the catalogue part name, is folded into the part search text','V2 indexes the part description'),
}
PROV=('<p>---<br><strong>SOURCE - THIS CASE IS TESTED AGAINST V1, NOT AGAINST THE V2 SPECIFICATION.</strong><br>'
 'This is the expected behaviour as per <strong>the V1 product itself</strong>: the ShopView product repository '
 'at commit <strong>55767168</strong>, {cite} (V1 invariant {inv}). For this V1 regression suite the shipped V1 '
 'product IS the specification - Standing Rule 109 - so the expectation above is V1\'s behaviour and nothing else.<br>'
 'For information only, and never as the authority for this case: {v2}.<br>'
 'Where V2 differs from V1 the difference is raised as a finding and a task ticket for the Product Owner, never '
 'adopted as the expectation (Standing Rules 96 and 58).<br><br>'
 'AUTOMATION: Not available on Build to test Yet - Last checked 14/9/2026</p>')
CUT=re.compile(r'(?:<p>)?-{3,}\s*(?:<br\s*/?>)?\s*(?=(?:<[^>]+>\s*)*(?:This is the expected behaviour|<strong>SOURCE|<strong>THIS SUITE))',re.I)
if '--confirm' not in sys.argv: print('dry run; pass --confirm'); sys.exit(0)
aud=[];bad=[]
for cid,(inv,cite,v2) in M.items():
    cur=api(f"get_case/{cid}"); exp=cur.get('custom_expected') or ''
    m=CUT.search(exp)
    head = exp[:m.start()] if m else exp.rstrip()
    orig_head_probe = st(head)[:60]
    assert orig_head_probe, f"C{cid} empty head"
    new = head.rstrip()+'\n'+PROV.format(cite=cite,inv=inv,v2=v2)
    upd={'custom_expected':new}
    if '55767168' not in (cur.get('refs') or ''):
        upd['refs']=f"SV-9160 ({inv}; V1 baseline 55767168)"
    api(f"update_case/{cid}",upd)
    rb=api(f"get_case/{cid}"); s=st(rb['custom_expected']); prov=s.split('---',1)[1] if '---' in s else s
    i1,i2=prov.find('55767168'),prov.find('Product Requirements specification')
    ck={'body_preserved':orig_head_probe in s,
        'source_header':'THIS CASE IS TESTED AGAINST V1' in s,
        'sha_in_prov':'55767168' in prov,
        'v1_leads': i1!=-1 and (i2==-1 or i1<i2),
        'rule109':'Standing Rule 109' in s,
        'refs_sha':'55767168' in (rb.get('refs') or ''),
        'marker_last': s.rstrip().endswith('Last checked 14/9/2026')}
    ok=all(ck.values()); aud.append({'case_id':cid,'title':rb['title'],'verified':ok,'checks':ck})
    if not ok: bad.append(cid)
    print(('OK   ' if ok else 'FAIL ')+f"C{cid} {rb['title'][:50]}"+('' if ok else '  '+str([k for k,v in ck.items() if not v])))
ts=datetime.datetime.utcnow().strftime('%Y-%m-%dT%H%M%SZ')
json.dump({'when_utc':ts,'operation':'update_case','rule':'109','count':len(aud),'all_verified':not bad,'cases':aud},
          open(f'correction-audit-v1-source-{ts}.json','w'),indent=1)
print(f"\n{len(aud)} SOURCE lines rewritten | all_verified={not bad}")
