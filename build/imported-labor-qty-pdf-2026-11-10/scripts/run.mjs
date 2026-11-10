import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const INV=process.env.INV; const out=`../ev/${ENV}`;
const s=await sess(); const p=s.page; const log=[];
const L=(...a)=>{const t=a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '); console.log(t); log.push(t);};
const loc = ENV==='prod'?'Trucks Hill 2':'Staging Heavy Duty - 9919';
const cust= ENV==='prod'?'aqeel transport 56':'Mayfield Heights Truck Centre';
const vin = ENV==='prod'?'ZZ9818P0000000045':'ZZ12435DARK000045';
const hdr='*Shop Location,*Customer,VIN,Year,Make,Model,Unit #,Unit Type,Mileage,Hours,*Invoice Number,*Invoice Date,PO,Service Advisor,*Item,*Line Title - What are you doing,Line Description - Why are you doing it,Tech Story,Part #,Part Description,*Qty,*Rate,*Total,*Tax Amount';
const pre=`${loc},"${cust}",${vin},2011,Hyundai,Santa Fe,ZZQTY,,45,9987,${INV},11/10/2026,,,`;
const csv=[hdr,
 pre+'Labor,Brake inspection,ZZAUTOTEST labor 2.5 hours,,,,2.5,40,100,0',
 pre+'Part,Brake inspection,ZZAUTOTEST labor 2.5 hours,,ZZQTY-1,Brake pad,4,5,20,0',
 pre+'Sublet,Tow in,ZZAUTOTEST sublet 3 hours,,,,3,20,60,0'].join('\n')+'\n';
fs.writeFileSync(`${out}/import-${INV}.csv`,csv);
let id=null;
const find=async()=>{ for(let pg=1;pg<=5;pg++){ const r=await s.api(`/api/work-orders-imported?limit=100&page=${pg}&search=${INV}`); const w=r.json?.data?.workOrders||[]; const m=w.find(x=>JSON.stringify(x).includes(INV)); if(m) return m.id; if(w.length<100) break;} return null; };
id=await find();
if(!id){ await s.go('/administration/invoices-import'); await p.waitForTimeout(4000);
  await p.locator('input[type=file]').first().setInputFiles(`${out}/import-${INV}.csv`); await p.waitForTimeout(3000);
  const ib=p.locator('[data-test-id="button_import_invoices"]'); L('import enabled',await ib.isEnabled());
  await ib.click(); await p.waitForTimeout(8000); await p.screenshot({path:`${out}/import-result.png`});
  id=await find(); }
L('id',id); if(!id){ await s.close(); process.exit(1); }
const v=await s.api('/api/work-orders-imported/'+id); fs.writeFileSync(`${out}/view.json`,JSON.stringify(v.json,null,1));
const lines=v.json?.data?.lines||v.json?.data?.workOrder?.lines||[];
L('api lines', (JSON.stringify(v.json).match(/"timeEstimate":[0-9.]+|"quantity":[0-9.]+/g)||[]).join(' '));
await s.go('/imported-work-orders/'+id); await p.waitForTimeout(7000);
await p.screenshot({path:`${out}/screen.png`,fullPage:true});
// on-screen quantity cells
const rows=await p.evaluate(()=>[...document.querySelectorAll('tr')].map(tr=>{const r=tr.getBoundingClientRect(); return {t:tr.innerText.replace(/\s+/g,' ').trim().slice(0,160), x:r.x,y:r.y+window.scrollY,w:r.width,h:r.height};}).filter(o=>/Labor|Sublet|Brake pad|Tow in|Quantity|ZZQTY/i.test(o.t)));
fs.writeFileSync(`${out}/screen-rows.json`,JSON.stringify(rows,null,1)); rows.forEach(r=>L('ROW',r.t));
const b=p.locator('main button:has-text("get_app")').first(); const dl=p.waitForEvent('download',{timeout:40000}).catch(()=>null); await b.click(); const d=await dl;
if(d){ await d.saveAs(`${out}/download.pdf`); L('pdf saved'); } else L('no download');
L('url',p.url());
fs.writeFileSync(`${out}/run.log`,log.join('\n')+'\n'); await s.close(); process.exit(0);
