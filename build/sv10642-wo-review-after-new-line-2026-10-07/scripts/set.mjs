import {ob,j} from './lib.mjs'; import fs from 'fs';
const val=process.argv[2]==='1'; const s=await ob();
const st=(await s.api('/api/organizations/settings')).json.data; console.log('before',j(st,600));
if(!fs.existsSync('settings-orig.json')) fs.writeFileSync('settings-orig.json',JSON.stringify(st));
const snake=k=>k.replace(/[A-Z]/g,m=>'_'+m.toLowerCase());
let body=Object.assign({},st,{requireReview:val}); let r=await s.api('/api/organizations/settings/change',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
console.log('camel',r.status,j(r.json,300));
if(r.status>=400){ const sb=Object.fromEntries(Object.entries(body).map(([k,v])=>[snake(k),v])); r=await s.api('/api/organizations/settings/change',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(sb)}); console.log('snake',r.status,j(r.json,300)); }
console.log('after',j((await s.api('/api/organizations/settings')).json.data,600));
await s.close();
