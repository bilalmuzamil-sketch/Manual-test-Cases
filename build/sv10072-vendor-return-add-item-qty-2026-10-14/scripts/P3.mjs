import {os,J,post} from './lib.mjs'; import fs from 'fs';
const s=await os(); await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
let all=[]; for(let pg=1;pg<=200;pg++){ const d=(await s.api(`/api/inventory/parts?pagination[rowsPerPage]=100&pagination[page]=${pg}`)).json?.data; const c=d?.collection||[]; all=all.concat(c); if(c.length<100) break; }
const ok=p=>+p.quantity>=6 && +p.quantity<500 && !p.is_core && !+p.core_charge && !p.has_outstanding_return && p.vendor_id;
const lead=id=>(id.match(/^\d+/)||[''])[0];
const pick={
 eight: all.filter(p=>ok(p)&&lead(p.id).length===8&&lead(p.id)[0]!=='0'),
 one: all.filter(p=>ok(p)&&lead(p.id).length===1&&lead(p.id)!=='0'),
 zero: all.filter(p=>ok(p)&&/^00\d/.test(p.id)),
 letter: all.filter(p=>ok(p)&&lead(p.id)==='')};
const out={}; for(const k in pick){ const p=pick[k][0]; out[k]=p&&{id:p.id,pn:p.part_number,name:p.name,qty:+p.quantity,vendor_id:p.vendor_id,vendor:p.vendor_name,price:p.purchase_price_value??p.purchase_price,bins:p.binLocations}; console.log(k,pick[k].length,J(out[k],300)); }
const dec=all.filter(p=>ok(p)&&/ATF|OIL|FLUID|COOLANT|DEF/i.test(p.name)&&String(p.quantity).includes('.')); console.log('decimal stock',dec.length,J(dec.slice(0,3).map(p=>[p.id,p.part_number,p.name.slice(0,25),p.quantity]),400));
fs.writeFileSync('parts.json',JSON.stringify(out,null,1)); await s.close();
