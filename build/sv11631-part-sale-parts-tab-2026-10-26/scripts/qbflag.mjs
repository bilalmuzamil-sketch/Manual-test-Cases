// Retest 28 Oct: R10 unblock — read org feature flags; with arg "off" drop QuickBooks from the set.
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21'});
const me=(await s.api('/api/auth/me')).json; const org=me?.data?.organization_id||me?.data?.organization?.id||me?.data?.user?.organization_id;
console.log('org',org, org?'':JSON.stringify(me).slice(0,400));
const f=(await s.api(`/api/organization/feature-flags?organization_id=${org}`)).json; const feats=f.data.features; console.log('flags',feats.map(x=>x.name).join(','));
fs.writeFileSync('/tmp/qa11631/flags-before.json',JSON.stringify(f));
if(process.argv[2]==='off'){ const ids=feats.filter(x=>!/quickbooks/i.test(x.name)).map(x=>x.featureFlagId);
  const r=await s.api('/api/organization/feature-flags',{method:'POST',body:{organization_id:org,feature_flag_ids:ids}}); console.log('POST',r.status,JSON.stringify(r.json).slice(0,200));
  console.log('mapping',JSON.stringify((await s.api('/api/bookkeeping/adjustment-item-mapping-status')).json)); }
process.exit(0);
