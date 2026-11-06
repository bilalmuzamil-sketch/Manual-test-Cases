import {sess,arr} from './common.mjs'; const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(3000);
let out=[]; for(let pg=1;pg<=10;pg++){ const d=arr((await s.api(`/api/inventory/parts?pagination[page]=${pg}&pagination[rowsPerPage]=500`)).json?.data); if(!d.length) break; out.push(...d); }
const c=out.filter(x=>Number(x.core_charge)>0||x.core_part_id||x.has_core||x.core_price>0); console.log('total',out.length,'cored',c.length, JSON.stringify(c.slice(0,8).map(x=>[x.part_number,x.core_charge,x.core_part_id,x.quantity,x.workplace_id?.slice(0,8)])));
const k=out[0]&&Object.keys(out[0]).filter(k=>/core/i.test(k)); console.log('core keys',k); await s.close(); process.exit(0);
