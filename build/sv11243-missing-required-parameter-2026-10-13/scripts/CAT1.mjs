import {op,J,post,setLoc} from './lib.mjs'; import fs from 'fs';
const base=JSON.parse(fs.readFileSync('base-change.json'));
const s=await op({dpr:1}); await setLoc(s);
const r=await post(s,'/api/work-orders/parts/change',Object.assign({},base,{id:'0a74138e-151f-4556-b7ce-11a0e1fd1c19',part_category_id:'0aaeeedf-e4a0-433b-8a5e-48a06bedeb8d',status:'Authorized',quantity:30,description:'ZZAUTOTEST Round jacketed 2 wire cable ft'})); console.log('set Lighting',r.status,J(r.json,150));
const cats=await s.api('/api/parts-catalogue/categories'); console.log('pc cats',cats.status,J(cats.json,300));
for(const u of ['/api/inventory/categories?all=1','/api/parts/categories','/api/part-categories']){ const x=await s.api(u); console.log(u,x.status,J(x.json,250)); }
await s.close();
