// usage: [ENV=branch LOCID=<id>] node prodloc.mjs show | set <tz> | restore   (default: production, ZZAUTOTEST C614715 Empty Location)
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'prod'; const ID=process.env.LOCID||'c43fe73d-74e4-408c-83d7-92994b3fb2fe'; const [MODE,TZ]=process.argv.slice(2); const SNAP=`/tmp/sv11970/${ENV}-loc-original-${ID.slice(0,8)}.json`;
const rd=f=>fs.readFileSync('/tmp/sv11970/'+f,'utf8').trim();
const rs=f=>fs.readFileSync('/tmp/staging/'+f,'utf8').trim();
const s=ENV==='staging'? await open({env:'staging',cookies:{sv_sso_session:rs('sso'),PHPSESSID:rs('phpsess'),cf_clearance:rs('cfc')},quick:'admin',dir:'/tmp/qa53',vp:{width:1440,height:900}}) : ENV==='prod'? await open({env:'prod',dir:'/tmp/qa52',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim(),vp:{width:1440,height:900}})
 : await open({env:'branch',ticket:'11970',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa51',vp:{width:1440,height:900}});
const get=async()=>((await s.api('/api/workplaces')).json.data.collection||[]).find(x=>x.id===ID);
const w=await get();
if(MODE==='show'){ console.log(JSON.stringify(w,null,1)); if(!fs.existsSync(SNAP)) fs.writeFileSync(SNAP,JSON.stringify(w)); }
else { const base=MODE==='restore'?JSON.parse(fs.readFileSync(SNAP,'utf8')):w; const tz=MODE==='restore'?base.timezone:TZ;
  const b={...base,id:ID,workplace_id:ID,timezone:tz,another:false}; if(b.tax&&typeof b.tax==='object') b.tax={id:b.tax.id,name:b.tax.name};
  const r=await s.api('/api/workplaces/change',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}); console.log('change',r.status,JSON.stringify(r.json||r.text).slice(0,300));
  const a=await get(); console.log('now timezone',a.timezone);
  if(MODE==='restore'){ const o=JSON.parse(fs.readFileSync(SNAP,'utf8')); const diff=Object.keys(o).filter(k=>JSON.stringify(o[k])!==JSON.stringify(a[k])); console.log('fields different from original:',JSON.stringify(diff)); } }
await s.close(); process.exit(0);
