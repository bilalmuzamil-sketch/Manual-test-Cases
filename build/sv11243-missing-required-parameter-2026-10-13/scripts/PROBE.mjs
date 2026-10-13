import {op,J,post,setLoc} from './lib.mjs'; import fs from 'fs';
const base=JSON.parse(fs.readFileSync('base-change.json'));
const s=await op({dpr:1}); await setLoc(s);
const cases={ok:{},status_null:{status:null},status_empty:{status:''},cat_null:{part_category_id:null},cat_unknown:{part_category_id:'00000000-0000-4000-8000-000000000000'},desc_null:{description:null},desc_empty:{description:''},qty_null:{quantity:null},qty_empty:{quantity:''},sell_null:{sell_price:null},disc_null:{discount:null},core_null:{core_charge:null},id_unknown:{id:'00000000-0000-4000-8000-000000000000'},wo_null:{work_order_id:null}};
const out={};
for(const [k,v] of Object.entries(cases)){ const r=await post(s,'/api/work-orders/parts/change',Object.assign({},base,v)); out[k]=r.status+' '+J(r.json,160); console.log(k.padEnd(12),out[k]); }
fs.writeFileSync('probe.json',JSON.stringify(out,null,1)); await s.close();
