// [ENV=prod] node pubapi.mjs <staffUserId> -> mint a ZZAUTOTEST public API key (staff:read/write), PATCH /api/v1/staff/{id} with bad + good salaries, revoke key. Key never printed.
import {sess,post} from './common.mjs';
const [ID]=process.argv.slice(2); const s=await sess(); await s.go('/administration/staff'); await s.page.waitForTimeout(1500);
const c=await post(s,'/api/open-api/credentials',{name:'ZZAUTOTEST SV12183 '+Date.now(),scopes:['staff:read','staff:write']});
const cred=c.json?.data; const key=cred?.key||cred?.apiKey||cred?.token||cred?.secret||cred?.plainKey; console.log('mint',c.status,Object.keys(cred||{}).join(','), key?'(key received)':JSON.stringify(c.json).slice(0,200));
const pub=async(m,u,b)=>s.page.evaluate(async([m,u,b,k])=>{const api=location.origin.replace('://sv','://sv').replace(/^(https:\/\/sv\d+)(\.qa)/,'$1api$2').replace('app.shopview','api.shopview'); const r=await fetch(api+u,{method:m,headers:{'Authorization':'Bearer '+k,'Content-Type':'application/json','Accept':'application/json'},body:b?JSON.stringify(b):undefined}); let t=await r.text(); return [r.status,t.slice(0,220),api];},[m,u,b,key]);
console.log('GET', JSON.stringify(await pub('GET','/api/v1/staff/'+ID)));
for(const b of [{salary:-5000},{salary:'abc'},{salary:10000},{salary:-0.01},{salary:25.5},{salary:0}]){ const r=await pub('PATCH','/api/v1/staff/'+ID,b); const g=await pub('GET','/api/v1/staff/'+ID); console.log('PATCH',JSON.stringify(b),r[0],r[1].slice(0,160),'| now',(g[1].match(/"salary"[^,}]*/)||[''])[0]); }
const cid=cred?.id; if(cid){ const d=await s.api('/api/open-api/credentials/'+cid,{method:'DELETE'}); console.log('revoke',d.status); }
await s.close(); process.exit(0);
