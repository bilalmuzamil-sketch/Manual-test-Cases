// add bin BIN to N parts (any), resumable. ENV=prod BIN=ZZBIG12223 N=1200
import {sess,post} from './common.mjs'; import fs from 'fs';
const F=`../ev/seeded-${process.env.ENV||'branch'}-${process.env.BIN}.json`; const st=fs.existsSync(F)?JSON.parse(fs.readFileSync(F)):{bin:null,done:[]};
const s=await sess(); await s.go('/parts/inventory'); let all=[];
for(let pg=1;;pg++){ const r=await s.api(`/api/inventory/parts?pagination%5BrowsPerPage%5D=500&pagination%5Bpage%5D=${pg}&pagination%5BsortBy%5D=&pagination%5Bdescending%5D=false&supply_filter=all&search=`); const c=r.json?.data?.collection||[]; all.push(...c); if(c.length<500)break;}
let todo=all.filter(x=>!st.done.includes(x.id)&&!(x.binLocations||[]).some(b=>b.name===process.env.BIN)); if(process.env.LONG) todo.sort((a,b)=>((b.name||'').length+(b.tags||[]).join(' ').length)-((a.name||'').length+(a.tags||[]).join(' ').length)); console.log('longest sample',todo.slice(0,3).map(x=>x.name+' | '+(x.tags||[]).join(',')).join(' || ').slice(0,400)); let k=0,fail=0;
for(const x of todo){ if(st.done.length>=+process.env.N)break;
  const body=st.bin?{binLocationId:st.bin,quantity:0,isDefault:false}:{binLocationName:process.env.BIN,quantity:0,isDefault:false};
  const w=await post(s,`/api/inventory/parts/${x.id}/bin-locations`,body);
  if(w.status<300){ st.bin=st.bin||w.json?.data?.binLocationId; st.done.push(x.id); if(st.done.length%100==0){fs.writeFileSync(F,JSON.stringify(st));console.log('done',st.done.length);} } else { fail++; if(fail<4) console.log('fail',x.part_number,w.status,JSON.stringify(w.json||w.text).slice(0,150)); if(fail>30)break; } }
fs.writeFileSync(F,JSON.stringify(st)); console.log('total',st.done.length,'bin',st.bin,'fails',fail); await s.browser.close();
