import {sess} from './common.mjs'; import fs from 'fs';
const EV='../ev'; const s=await sess(); const p=s.page; const out={};
const H={'content-type':'application/json'};
const v=async id=>{const r=await s.api('/api/inventory/returns/'+id); return {st:r.status,body:JSON.stringify(r.json).slice(0,260)};};
const shot=async(path,name)=>{ await s.go(path); await p.waitForTimeout(6000); await p.screenshot({path:`${EV}/${name}.png`});
  return p.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,500)); };
out.marker=await s.marker();
// Org A, Heavy Duty
const list=(await s.api('/api/inventory/returns?limit=5')).json.data.collection; const A=list[0].vendor_return_id; out.A=list[0];
const RAND='3f6c2b1e-9d4a-4c8e-b7a1-5e2d9c0f1a77';
out.a_own=await v(A); out.a_rand=await v(RAND); out.a_bad=await v('not-a-uuid');
out.a_own_screen=await shot('/parts/return/'+A,'01-orgA-own-return');
out.a_rand_screen=await shot('/parts/return/'+RAND,'02-orgA-unknown-id');
// other location
const cl=await s.api('/api/iam/change-location',{method:'POST',headers:H,body:JSON.stringify({workplace_id:'f8a8b802-7780-4b16-bf10-343caeb616b2',workplace_timezone:'America/Edmonton'})}); out.cl=cl.status;
const ll=(await s.api('/api/inventory/returns?limit=5')).json?.data?.collection||[]; const L=ll[0]?.vendor_return_id; out.L=ll[0]?{id:L,wp:ll[0].workplaceId,vendor:ll[0].vendor_name,cm:ll[0].credit_memo_number}:null;
out.l_in_leth=L?await v(L):null; out.A_in_leth=await v(A);
out.A_in_leth_screen=await shot('/parts/return/'+A,'03-orgA-heavyduty-return-while-lethbridge');
await s.api('/api/iam/change-location',{method:'POST',headers:H,body:JSON.stringify({workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'})});
out.L_in_hd=L?await v(L):null; out.A_back=await v(A);
// Org B
const pw=fs.readFileSync('/tmp/sv12120/orgb-pw','utf8').trim();
const l=await s.api('/api/login',{method:'POST',headers:H,body:JSON.stringify({username:'bilal.muzamil+sv12120b@shopview.com',password:pw})}); out.b_login=l.status;
let wps=(await s.api('/api/staff/my-workplaces')).json.data.collection;
if(!wps.length){ const c=await s.api('/api/workplaces/create',{method:'POST',headers:H,body:JSON.stringify({name:'ZZAUTOTEST OrgB Shop',shop_id:'12120',address_1:'1 Test St',city:'Calgary',state_or_province:'AB',postal_code:'T2P 1J9',telephone:'(403) 555 - 0100',timezone:'America/Edmonton',country_code:'CA'})}); out.b_wp_create=[c.status,JSON.stringify(c.json).slice(0,200)]; wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; }
out.b_wp=wps.map(w=>w.name);
if(wps[0]) out.b_cl=(await s.api('/api/iam/change-location',{method:'POST',headers:H,body:JSON.stringify({workplace_id:wps[0].id,workplace_timezone:'America/Edmonton'})})).status;
out.b_A=await v(A); out.b_L=L?await v(L):null; out.b_rand=await v(RAND); out.b_list=JSON.stringify((await s.api('/api/inventory/returns?limit=5')).json).slice(0,200);
out.b_A_screen=await shot('/parts/return/'+A,'04-orgB-opens-orgA-return');
fs.writeFileSync(EV+'/matrix.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out,null,1));
await s.close(); process.exit(0);
