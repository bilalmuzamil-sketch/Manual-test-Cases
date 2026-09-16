import json,base64,urllib.request,ssl,re,html
cr=json.load(open('/tmp/testrail/creds.json'))
A=base64.b64encode(f"{cr['user']}:{cr['login_password'] or cr['password']}".encode()).decode()
ctx=ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
def api(p):
    r=urllib.request.Request(cr['host'].rstrip('/')+f"/index.php?/api/v2/{p}",headers={'Authorization':'Basic '+A})
    return json.loads(urllib.request.urlopen(r,context=ctx,timeout=60).read())
cs=[];off=0
while True:
    r=api(f"get_cases/1&suite_id=1&section_id=6769&limit=250&offset={off}")
    x=r['cases'] if isinstance(r,dict) else r; cs+=x
    if len(x)<250: break
    off+=250
json.dump(cs,open('sec6769-full.json','w'))
st=lambda s: re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',s or ''))).strip()
V1FILES=('FetchDataQueryHandler.php','useGlobalSearch.ts','GlobalSearch.vue','routingService.ts',
         'FetchDataController.php','DesktopMenu.vue')
bad=[]
for c in sorted(cs,key=lambda x:x['id']):
    exp=st(c.get('custom_expected')); refs=c.get('refs') or ''
    # locate the provenance sentence: the text after the '---' separator
    prov = exp.split('---',1)[1] if '---' in exp else exp
    sha_in_refs   = '55767168' in refs
    sha_in_prov   = '55767168' in prov
    # INV-90 is an ABSENCE (no feature flag exists in V1), so there is no file to cite.
    # A documented absence is a valid V1 citation - inventing a file would be worse.
    file_in_prov  = any(f in prov for f in V1FILES) or 'ABSENCE of any feature flag' in prov
    # does the FIRST authority named in the provenance mention V1 before the V2 spec?
    iv1 = prov.find('55767168'); iv2 = prov.find('Product Requirements specification')
    v1_leads = iv1 != -1 and (iv2 == -1 or iv1 < iv2)
    ok = sha_in_refs and sha_in_prov and file_in_prov and v1_leads
    if not ok:
        bad.append(c['id'])
        flags=[]
        if not sha_in_refs: flags.append('refs-no-SHA')
        if not sha_in_prov: flags.append('prov-no-SHA')
        if not file_in_prov: flags.append('prov-no-V1-file')
        if not v1_leads: flags.append('V2-spec-leads')
        print(f"FIX  C{c['id']}  {c['title'][:52]:54s} {flags}")
print(f"\n{len(cs)} cases | compliant {len(cs)-len(bad)} | NEED FIX {len(bad)}")
print("FIX_IDS="+",".join(str(i) for i in bad))
