import {op,j} from '../lib.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('prod/setup.json')); const s=await op();
const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const r=await P('/api/organizations/settings/change',Object.assign({},S.settings,{requireReview:false})); console.log('restore',r.status);
const now=(await s.api('/api/organizations/settings')).json.data; const orig=S.settings;
const diff=Object.keys(orig).filter(k=>JSON.stringify(orig[k])!==JSON.stringify(now[k])); console.log('fields differing from original:',diff.length?diff:'none');
const {wo}=JSON.parse(fs.readFileSync('prod/wo.json')); console.log('S2-960 status',(await s.api('/api/work-orders/view/'+wo)).json.data?.work_order?.status??'?');
await s.close();
