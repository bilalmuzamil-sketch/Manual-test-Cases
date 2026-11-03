import {sess} from './common.mjs'; const [WO,RE]=process.argv.slice(2); const s=await sess(); const v=(await s.api('/api/work-orders/view/'+WO)).json?.data; const w=v?.work_order||v||{};
for(const [k,x] of Object.entries(w)) if(new RegExp(RE||'adjust|fee|supply|supplies|total|cost','i').test(k)) console.log(k,'=',JSON.stringify(x).slice(0,300));
await s.close(); process.exit(0);
