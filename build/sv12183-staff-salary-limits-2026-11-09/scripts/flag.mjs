// node flag.mjs <flagName> on|off -> adds/removes one org feature flag (whole-set POST), prints before/after names
import {sess,post} from './common.mjs'; import fs from 'fs'; const [NAME,MODE]=process.argv.slice(2);
const s=await sess(); await s.go('/administration/staff'); await s.page.waitForTimeout(1200);
const org=process.env.ORG||await s.page.evaluate(()=>{const t=JSON.stringify(localStorage); const m=t.match(/organi[sz]ation_?[iI]d\\?":\\?"([0-9a-f-]{36})/); return m&&m[1];});
const all=(await s.api('/api/feature-flags')).json?.data; const A=all?.featureFlags||all?.collection||all||[];
const cur=(await s.api('/api/organization/feature-flags?organization_id='+org)).json?.data; const C=cur?.featureFlags||cur?.collection||(Array.isArray(cur)?cur:[]); console.log('raw',JSON.stringify(cur).slice(0,200));
const C2=cur?.features||C; const names=C2.map(x=>x.name); console.log('org',org,'before',JSON.stringify(names));
fs.writeFileSync('/tmp/sv12183/flags-before.json',JSON.stringify({org,names,C},null,1));
let ids=A.filter(f=>names.includes(f.name)).map(f=>f.id); const t=A.find(f=>f.name.toLowerCase()===NAME.toLowerCase()); console.log('target',t?.name,t?.id);
if(MODE==='on'&&t&&!ids.includes(t.id)) ids.push(t.id); if(MODE==='off') ids=ids.filter(i=>i!==t?.id);
const r=await post(s,'/api/organization/feature-flags',{organization_id:org,feature_flag_ids:ids}); console.log('set',r.status);
const af=(await s.api('/api/organization/feature-flags?organization_id='+org)).json?.data; console.log('after',JSON.stringify((af?.features||[]).map(x=>x.name||x.feature_flag?.name||x.featureFlag?.name)));
await s.close(); process.exit(0);
