// Lines → Edit Part → pick a part whose vendor was created in another tab after tab 1 loaded its vendor list.
// tab 1 opens Edit Part once (loads the vendor list), tab 2 creates a vendor ON SCREEN, then (set-up) a catalog part + inventory part
// with that vendor; tab 1 (no reload) opens Edit Part again, picks that part number, and the Vendor field is sampled every 200 ms.
import {open} from '../../testing-tools/qa-session.mjs'; import * as D from './detect.mjs'; import fs from 'fs';
const env=process.argv[2]; const out=`/tmp/s10928/${env}-pickvend`; fs.mkdirSync(out,{recursive:true});
const WO={branch:'88207a22-4650-4b85-9d19-f7b0b9b7a1e7',prod:'0ecff689-f076-4b1e-be98-d1fcaf650988'}[env];
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const ctl={ms:3500,maxShots:0}; await D.install(s,ctl); const p=s.page; const R={env};
const openEdit=async()=>{ for(let i=0;i<30;i++){ const ok=await p.evaluate(()=>{const b=[...document.querySelectorAll('[data-test-id="button_add_part"]')].find(e=>e.getBoundingClientRect().width>0); if(b){b.click();return true;} return false;}); if(ok) break; await p.waitForTimeout(700);}
  await p.waitForTimeout(1500); await p.locator('button',{hasText:'More options'}).first().click(); await p.waitForTimeout(2500); return await p.locator('.q-dialog').count(); };
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(6000);
R.firstOpen=await openEdit(); console.log('first open dialogs',R.firstOpen); await p.waitForTimeout(3000); await p.keyboard.press('Escape'); await p.waitForTimeout(1000); await p.keyboard.press('Escape'); await p.waitForTimeout(1000);
// tab 2
const t2=await s.ctx.newPage(); const caps=[]; t2.on('response',async r=>{ if(r.request().method()==='POST'&&/shopview\.com\/api\//.test(r.url())) caps.push(r.url().replace(/^https:\/\/[^/]+/,'')+' '+(await r.text().catch(()=>'')).slice(0,300)); });
await t2.goto(s.host.app+'/parts/vendors',{waitUntil:'domcontentloaded'}); await t2.waitForTimeout(5000);
const vname='ZZAUTOTEST V10928 '+env+' P'+new Date().toISOString().slice(11,19).replace(/:/g,'');
await t2.click('[data-test-id="button_new_vendor"]'); await t2.waitForTimeout(1500);
await t2.locator('[data-test-id="input_vendor_name"] input, input[data-test-id="input_vendor_name"]').first().fill(vname);
await t2.click('[data-test-id="select_vendor_tax"]'); await t2.waitForTimeout(1200); await t2.click('.q-menu .q-item >> nth=0'); await t2.waitForTimeout(600); await t2.keyboard.press('Escape').catch(()=>{});
await t2.click('[data-test-id="vendor_save_button"]'); await t2.waitForTimeout(3000);
const vid=(caps.join(' ').match(/add-vendor \{"data":\{"vendor_id":"([0-9a-f-]{36})/)||[])[1]; R.vname=vname; R.vid=vid; console.log('vendor',vname,vid);
const api=(u,b)=>t2.evaluate(async([u,b,base])=>{ const r=await fetch(base+u,{method:b?'POST':'GET',credentials:'include',headers:{'content-type':'application/json'},body:b?JSON.stringify(b):undefined}); const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {st:r.status,j,t:t.slice(0,300)}; },[u,b,s.host.api]);
const pn='ZZPV'+Date.now()%1000000; R.pn=pn;
const cp=await api('/api/parts-catalogue/add-catalogue-part',{name:'ZZAUTOTEST pick vendor part',part_number:pn,tags:[]}); const cpid=(JSON.stringify(cp.j).match(/[0-9a-f]{8}-[0-9a-f-]{27}/)||[])[0]; console.log('catalog',cp.st,cpid);
const inv=(await api('/api/inventory/parts?limit=1&search=')).j; const L=inv?.data?.parts||inv?.data?.collection||inv?.data||[]; const P0=(Array.isArray(L)?L:[])[0]; const cat=P0?.category; const bin=P0?.binLocations?.[0]?.binLocationId;
const ip=await api('/api/inventory/parts/create',{catalog_part_id:cpid,category_id:cat,quantity:5,cost:10,tags:[],bins:[{id:bin,quantity:5,isDefault:true}],vendor_id:vid}); console.log('inventory',ip.st,ip.t.slice(0,200));
const chk=(await api('/api/inventory/parts?limit=5&search='+pn)).j; console.log('inventory vendor',JSON.stringify(chk).match(/"vendor_(?:id|name)":"[^"]*"/g));
await t2.close();
// tab 1, no reload
await D.reset(p); R.secondOpen=await openEdit(); console.log('second open dialogs',R.secondOpen); await p.waitForTimeout(2000); console.log('dialog tids',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(',')));
const sel=p.locator('.q-dialog [data-test-id="select_part"]').first();
await sel.click(); await p.keyboard.press('Control+A'); await p.keyboard.press('Backspace'); await p.waitForTimeout(500); await p.keyboard.type(pn,{delay:40}); await p.waitForTimeout(3500);
await p.screenshot({path:out+'/typed.png'}); const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,5)); console.log('options',JSON.stringify(opts));
await p.locator('.q-menu .q-item',{hasText:pn}).first().click(); 
const t0=Date.now(); const seq=[]; let last=null;
while(Date.now()-t0<9000){ const v=await p.evaluate(()=>{const e=document.querySelector('.q-dialog [data-test-id="select_part_vendor"]'); const f=e&&(e.closest('.q-field')||e); return f?f.innerText.replace(/\s+/g,' ').replace(/^Vendor/,'').replace('arrow_drop_down','').trim():'(no vendor field)';});
  if(v!==last){ seq.push([Date.now()-t0,v]); last=v; await p.screenshot({path:`${out}/vendor-${seq.length}.png`}); } await p.waitForTimeout(200); }
R.seq=seq; R.hits=(await D.hits(p)).map(h=>h.text.slice(0,80)); console.log('vendor field',JSON.stringify(seq)); console.log('hits',JSON.stringify(R.hits));
fs.writeFileSync(out+'/result.json',JSON.stringify(R,null,1)); console.log(JSON.stringify(await s.marker())); await s.close(); process.exit(0);
