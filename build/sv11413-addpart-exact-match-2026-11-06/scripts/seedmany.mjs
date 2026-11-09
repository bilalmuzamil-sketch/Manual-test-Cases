// production set-up for SV-12410: N catalogue+inventory parts "ZZ12410 Seal Ring NNN" / ZZ12410-NNN at Trucks Hill 2 (qty 2). Test data, left in place.
import {sess,post,arr} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); const W=ws.find(w=>w.name==='Trucks Hill 2'); console.log('wp',W?.name,(await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone})).status);
const cats=arr((await s.api('/api/inventory/categories')).json?.data); const cat=cats[0]?.value||cats[0]?.id; const bj=(await s.api('/api/inventory/bin-locations')).json?.data; const bins=arr(bj?.binLocations||bj); const bin=bins[0]?.id; console.log('cat',cat,'bin',bin);
const N=+(process.env.N||210), S=+(process.env.START||1); let ok=0,bad=[];
async function one(i){ const n=String(i).padStart(3,'0'); let r=await post(s,'/api/parts-catalogue/add-catalogue-part',{name:`ZZ12410 Seal Ring ${n}`,part_number:`ZZ12410-${n}`,tags:[]});
  const cid=r.json?.data?.catalogue_part_id||r.json?.data?.id||r.json?.data?.catalogue_part?.id; if(!cid){bad.push(n+' cat '+r.status+' '+JSON.stringify(r.json).slice(0,120));return;}
  r=await post(s,'/api/inventory/parts/create',{catalog_part_id:cid,category_id:cat,quantity:2,cost:1,tags:[],bins:[{id:bin,quantity:2,isDefault:true}]}); if(r.status<300) ok++; else bad.push(n+' inv '+r.status+' '+JSON.stringify(r.json).slice(0,120)); }
for(let i=S;i<S+N;i+=5){ await Promise.all([0,1,2,3,4].filter(k=>i+k<S+N).map(k=>one(i+k))); }
console.log('created',ok,'bad',bad.length); bad.slice(0,5).forEach(b=>console.log(' ',b)); await s.close(); process.exit(0);
