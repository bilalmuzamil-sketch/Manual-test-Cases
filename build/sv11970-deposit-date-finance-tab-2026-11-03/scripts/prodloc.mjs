// usage: node prodloc.mjs show | set <tz> | restore     (production, location ZZAUTOTEST C614715 Empty Location)
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const ID='c43fe73d-74e4-408c-83d7-92994b3fb2fe'; const [MODE,TZ]=process.argv.slice(2); const SNAP='/tmp/sv11970/prod-loc-original.json';
const s=await open({env:'prod',dir:'/tmp/qa52',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim(),vp:{width:1440,height:900}});
const get=async()=>((await s.api('/api/workplaces')).json.data.collection||[]).find(x=>x.id===ID);
const w=await get();
if(MODE==='show'){ console.log(JSON.stringify(w,null,1)); if(!fs.existsSync(SNAP)) fs.writeFileSync(SNAP,JSON.stringify(w)); }
else { const base=MODE==='restore'?JSON.parse(fs.readFileSync(SNAP,'utf8')):w; const tz=MODE==='restore'?base.timezone:TZ;
  const b={...base,id:ID,workplace_id:ID,timezone:tz,another:false}; if(b.tax&&typeof b.tax==='object') b.tax={id:b.tax.id,name:b.tax.name};
  const r=await s.api('/api/workplaces/change',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('change',r.status,JSON.stringify(r.json||r.text).slice(0,300));
  const a=await get(); console.log('now timezone',a.timezone);
  if(MODE==='restore'){ const o=JSON.parse(fs.readFileSync(SNAP,'utf8')); const diff=Object.keys(o).filter(k=>JSON.stringify(o[k])!==JSON.stringify(a[k])); console.log('fields different from original:',JSON.stringify(diff)); } }
await s.close(); process.exit(0);
