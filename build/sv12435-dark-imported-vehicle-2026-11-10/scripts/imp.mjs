import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; const resp=[];
p.on('response',async r=>{ if(/\/api\/imports/.test(r.url())&&r.request().method()!=='GET') resp.push(r.status()+' '+(await r.text().catch(()=>'')).slice(0,400)); });
const c=await s.api('/api/companies?limit=3'); const cust=(c.json?.data?.collection||c.json?.data?.companies||[])[0]; console.log('cust',c.status,JSON.stringify(cust).slice(0,150));
const name=cust?.name||cust?.company_name;
const csv=`*Shop Location,*Customer,VIN,Year,Make,Model,Unit #,Unit Type,Mileage,Hours,*Invoice Number,*Invoice Date,PO,Service Advisor,*Item,*Line Title,Line Description,Tech Story,Part #,Part Description,*Qty,*Rate,*Total,*Tax Amount
Staging Heavy Duty - 9919,"${name}",ZZ12435DARK000045,2011,Hyundai,Santa Fe,ZZ12435U,,45,9987,ZZ12435-INV1,11/09/2026,PO-12435,,Labor,Brake inspection,ZZAUTOTEST dark mode check,,,,1,10,10,0
`;
fs.writeFileSync('../ev/import-sv12435.csv',csv);
await s.go('/administration/invoices-import'); await p.waitForTimeout(4000);
await p.locator('input[type=file]').first().setInputFiles('../ev/import-sv12435.csv'); await p.waitForTimeout(3000);
const ib=p.locator('[data-test-id="button_import_invoices"]'); console.log('enabled',await ib.isEnabled());
if(await ib.isEnabled()){ await ib.click(); await p.waitForTimeout(6000); }
console.log('resp',resp.join(' | '));
const l=await s.api('/api/work-orders-imported?limit=5'); console.log('list',JSON.stringify(l.json).slice(0,300));
await s.close(); process.exit(0);
