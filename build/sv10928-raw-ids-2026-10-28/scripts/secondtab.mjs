// "Vendor created in a second tab": tab 1 loads the app first; tab 2 creates a vendor ON SCREEN (Parts -> Vendors -> New Vendor),
// then (set-up) a part request with that vendor is added to a work order and ordered. Tab 1 then moves IN-APP (no reload) to the
// screens that show the part's vendor. Records every ID seen on screen and the vendor text shown.
// usage: node secondtab.mjs <branch|prod>
import {open} from '../../testing-tools/qa-session.mjs'; import * as D from './detect.mjs'; import {click} from './scenarios.mjs'; import fs from 'fs';
const env=process.argv[2]; const out=`/tmp/s10928/${env}-secondtab`; fs.mkdirSync(out,{recursive:true});
const WO={branch:'88207a22-4650-4b85-9d19-f7b0b9b7a1e7',prod:'0ecff689-f076-4b1e-be98-d1fcaf650988'}[env];
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'});
const ctl={ms:3500,maxShots:0}; await D.install(s,ctl); const p=s.page; const R={env};
const spa=async(path)=>{ await D.reset(p); await p.evaluate(u=>{ history.pushState({},'',u); dispatchEvent(new PopStateEvent('popstate')); },path); await p.waitForTimeout(7000); };
const hitList=async()=>(await D.hits(p)).map(h=>h.text.slice(0,80)+' @'+(h.path||'').slice(-70));
// tab 1: load the app on the work order Parts tab (this fills the session vendor list)
await s.go(`/workorders/${WO}/part-requests`); await p.waitForTimeout(5000);
// tab 2: create a vendor on screen
const t2=await s.ctx.newPage(); const caps=[]; t2.on('response',async r=>{ if(r.request().method()==='POST'&&/shopview\.com\/api\/.*vendor/.test(r.url())) caps.push({u:r.url(),st:r.status(),b:(await r.text().catch(()=>'')).slice(0,400)}); });
await t2.goto(s.host.app+'/parts/vendors',{waitUntil:'domcontentloaded'}); await t2.waitForTimeout(5000);
const vname='ZZAUTOTEST V10928 '+env+' '+new Date().toISOString().slice(11,19).replace(/:/g,'');
await t2.click('[data-test-id="button_new_vendor"]'); await t2.waitForTimeout(1500);
await t2.fill('[data-test-id="input_vendor_name"] input, input[data-test-id="input_vendor_name"]',vname).catch(async()=>{ await t2.click('[data-test-id="input_vendor_name"]'); await t2.keyboard.type(vname); });
await t2.click('[data-test-id="select_vendor_tax"]'); await t2.waitForTimeout(1200); await t2.click('.q-menu .q-item >> nth=0'); await t2.waitForTimeout(600); await t2.keyboard.press('Escape').catch(()=>{}); await t2.waitForTimeout(400);
await t2.click('[data-test-id="vendor_save_button"]'); await t2.waitForTimeout(3000);
await t2.screenshot({path:out+'/tab2-vendor-saved.png'});
R.vendorCreate=caps; const vid=(JSON.stringify(caps).match(/"(?:vendor_id|id|vendorId)\\?":\\?"([0-9a-f-]{36})/)||[])[1]; R.vname=vname; R.vid=vid; console.log('vendor',vname,vid,JSON.stringify(caps).slice(0,300));
if(!vid){ fs.writeFileSync(out+'/result.json',JSON.stringify(R,null,1)); await s.close(); process.exit(1); }
// set-up (stands in for tab 2 adding the part): a vendor part request on an authorized line, then order it
const api=(u,b)=>t2.evaluate(async([u,b,api])=>{ const r=await fetch(api+u,{method:b?'POST':'GET',credentials:'include',headers:{'content-type':'application/json'},body:b?JSON.stringify(b):undefined}); return {st:r.status,j:await r.json().catch(()=>null)}; },[u,b,s.host.api]);
const lines=(await api(`/api/work-orders/lines/${WO}`)).j?.data?.collection||[]; const L=lines.find(l=>/authori/i.test(l.status||l.line_status||''))||lines[0];
const prs=(await api(`/api/work-orders/${WO}/parts/list-requests-by-line`)).j; const cat=(JSON.stringify(prs).match(/"part_category_id":"([0-9a-f-]{36})"/)||[])[1]; R.cat=cat;
const mk=await api('/api/work-orders/part/make-request',{line:L.line_id,work_order:WO,description:'ZZAUTOTEST second-tab vendor part',quantity:1,part_source_type:'vendor',part_number:'ZZ10928-'+Date.now()%100000,price:12.5,part_category_id:cat,vendor_id:vid});
R.make=mk.st; const prq=(JSON.stringify(mk.j).match(/"(?:part_request_id|id)":"([0-9a-f-]{36})"/)||[])[1]; R.prq=prq; console.log('make-request',mk.st,JSON.stringify(mk.j).slice(0,200));
const ord=await api('/api/work-orders/part/perform-request-status-action',{part_request_id:prq}); R.order=ord.st; R.po=ord.j?.data?.orderId; console.log('order',ord.st,R.po);
await t2.close();
// tab 1, no reload: Parts tab
await spa('/workorders'); await spa(`/workorders/${WO}/part-requests`);
for(let i=0;i<12;i++){ await p.mouse.wheel(0,600); await p.waitForTimeout(400); }
R.partsDbg=await p.evaluate(id=>({rows:document.querySelectorAll('[data-test-id^="table_row_part_request_"]').length, withId:[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>t.includes(id)).slice(0,8)}),prq); console.log('parts dbg',JSON.stringify(R.partsDbg));
R.partsTab={hits:await hitList(), row:await p.evaluate(id=>{ const r=[...document.querySelectorAll('[data-test-id]')].find(e=>e.getAttribute('data-test-id').startsWith('table_row_part_request_')&&e.getAttribute('data-test-id').endsWith(id)); if(!r) return null; r.scrollIntoView({block:'center'});
  return {tid:r.getAttribute('data-test-id').replace(/[0-9a-f-]{36}/g,'<id>'), fields:[...r.querySelectorAll('.q-field')].map(f=>f.innerText.replace(/\s+/g,' ').trim()).filter(t=>/Vendor|Category/.test(t)), text:r.innerText.replace(/\s+/g,' ').slice(0,200)}; },prq)};
await p.waitForTimeout(800); await p.screenshot({path:out+'/tab1-parts-tab.png'}); console.log('parts tab',JSON.stringify(R.partsTab));
// tab 1: Lines tab -> Edit Part on that part
await spa(`/workorders/${WO}/lines`);
try{ await click(s,`button_edit_part_${prq}`); await p.waitForTimeout(5000);
  R.editPart={hits:await hitList(), fields:await p.evaluate(()=>[...document.querySelectorAll('.q-dialog .q-field')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(Boolean))};
  await p.screenshot({path:out+'/tab1-edit-part.png'}); await p.keyboard.press('Escape'); }catch(e){ R.editPart={err:e.message.slice(0,120)}; }
console.log('edit part',JSON.stringify(R.editPart).slice(0,600));
// tab 1: the purchase order receive screen for that order
if(R.po){ await spa(`/order/${R.po}?receive=1&workOrderId=${WO}`);
  R.poReceive={hits:await hitList(), text:await p.evaluate(()=>document.querySelector('main,.q-page')?.innerText.replace(/\s+/g,' ').slice(0,500))};
  await p.screenshot({path:out+'/tab1-po-receive.png'}); console.log('po receive',JSON.stringify(R.poReceive).slice(0,700)); }
fs.writeFileSync(out+'/result.json',JSON.stringify(R,null,1)); console.log(JSON.stringify(await s.marker())); await s.close();
