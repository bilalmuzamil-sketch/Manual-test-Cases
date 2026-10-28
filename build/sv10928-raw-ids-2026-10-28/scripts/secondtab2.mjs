// Second-tab vendor on Process Return (Confirm Return page for a manual return) and Bulk Receive.
// Tab 1 loads the app first; tab 2 creates a vendor and a manual return for it ON SCREEN; set-up adds + orders a part with it.
import {open} from '../../testing-tools/qa-session.mjs'; import * as D from './detect.mjs'; import fs from 'fs';
const env=process.argv[2]; const out=`/tmp/s10928/${env}-secondtab2`; fs.mkdirSync(out,{recursive:true});
const WO={branch:'88207a22-4650-4b85-9d19-f7b0b9b7a1e7',prod:'0ecff689-f076-4b1e-be98-d1fcaf650988'}[env];
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'});
const ctl={ms:3500,maxShots:0}; await D.install(s,ctl); const p=s.page; const R={env};
const spa=async(path)=>{ await D.reset(p); await p.evaluate(u=>{ history.pushState({},'',u); dispatchEvent(new PopStateEvent('popstate')); },path); await p.waitForTimeout(8000); };
const hl=async()=>(await D.hits(p)).map(h=>h.text.slice(0,60)+' @'+(h.path||'').slice(-60));
await s.go('/parts/returns'); await p.waitForTimeout(5000);
const t2=await s.ctx.newPage(); const caps=[]; t2.on('response',async r=>{ if(r.request().method()==='POST'&&/shopview\.com\/api\//.test(r.url())) caps.push(r.url().replace(/^https:\/\/[^/]+/,'')+' '+(await r.text().catch(()=>'')).slice(0,300)); });
await t2.goto(s.host.app+'/parts/vendors',{waitUntil:'domcontentloaded'}); await t2.waitForTimeout(5000);
const vname='ZZAUTOTEST V10928 '+env+' R'+new Date().toISOString().slice(11,19).replace(/:/g,'');
await t2.click('[data-test-id="button_new_vendor"]'); await t2.waitForTimeout(1500);
await t2.locator('[data-test-id="input_vendor_name"] input, input[data-test-id="input_vendor_name"]').first().fill(vname);
await t2.click('[data-test-id="select_vendor_tax"]'); await t2.waitForTimeout(1200); await t2.click('.q-menu .q-item >> nth=0'); await t2.waitForTimeout(600); await t2.keyboard.press('Escape').catch(()=>{});
await t2.click('[data-test-id="vendor_save_button"]'); await t2.waitForTimeout(3000);
const vid=(caps.join(' ').match(/add-vendor \{"data":\{"vendor_id":"([0-9a-f-]{36})/)||[])[1]; R.vname=vname; R.vid=vid; console.log('vendor',vname,vid);
// manual return for that vendor, on screen
await t2.goto(s.host.app+'/parts/create-return',{waitUntil:'domcontentloaded'}); await t2.waitForTimeout(5000);
const typeIn=async(t,v)=>{ const l=t2.locator(`[data-test-id="${t}"] input, input[data-test-id="${t}"]`).first(); await l.click(); await l.fill(v); };
await t2.locator('[data-test-id="select_vendor"]').first().click(); await t2.waitForTimeout(800); await t2.keyboard.type(vname,{delay:40}); await t2.waitForTimeout(2500);
await t2.locator('.q-menu .q-item',{hasText:vname}).first().click(); await t2.waitForTimeout(800);
await typeIn('input_packaging_slip','ZZ'+(Date.now()%100000)); await typeIn('input_manual_return_part_description','ZZAUTOTEST second-tab return'); await typeIn('input_manual_return_part_quantity','1'); await typeIn('input_manual_return_part_price','9.5');
await t2.locator('[data-test-id="button_save_manual_return"]').click(); await t2.waitForTimeout(4000);
const mr=(caps.join(' ').match(/manual-return-request\/create \{"data":\{"id":"([0-9a-f-]{36})/)||[])[1]; R.mr=mr; console.log('manual return',mr);
// set-up: part with that vendor on the work order, ordered
const api=(u,b)=>t2.evaluate(async([u,b,api])=>{ const r=await fetch(api+u,{method:b?'POST':'GET',credentials:'include',headers:{'content-type':'application/json'},body:b?JSON.stringify(b):undefined}); return {st:r.status,j:await r.json().catch(()=>null)}; },[u,b,s.host.api]);
const lines=(await api(`/api/work-orders/lines/${WO}`)).j?.data?.collection||[]; const L=lines.find(l=>/authori/i.test(l.status||''))||lines[0];
const prs=(await api(`/api/work-orders/${WO}/parts/list-requests-by-line`)).j; const cat=(JSON.stringify(prs).match(/"part_category_id":"([0-9a-f-]{36})"/)||[])[1];
const mk=await api('/api/work-orders/part/make-request',{line:L.line_id,work_order:WO,description:'ZZAUTOTEST second-tab bulk part',quantity:1,part_source_type:'vendor',part_number:'ZZB'+Date.now()%100000,price:7,part_category_id:cat,vendor_id:vid});
const prq=mk.j?.data?.id; const ord=await api('/api/work-orders/part/perform-request-status-action',{part_request_id:prq}); R.po=ord.j?.data?.orderId; console.log('po',ord.st,R.po);
await t2.close();
if(mr){ await spa(`/parts/confirm-return?id=${mr}&isManualReturn=1`); R.confirmReturn={hits:await hl(), vendor:await p.evaluate(()=>document.querySelector('[data-test-id="select_vendor"]')?.closest('.q-field')?.innerText.replace(/\s+/g,' ').trim())}; await p.screenshot({path:out+'/tab1-confirm-return.png'}); console.log('confirm return',JSON.stringify(R.confirmReturn)); }
if(R.po){ await spa(`/bulk-receive?ids=${R.po}`); R.bulk={hits:await hl(), text:await p.evaluate(()=>document.querySelector('main,.q-page')?.innerText.replace(/\s+/g,' ').slice(0,400))}; await p.screenshot({path:out+'/tab1-bulk-receive.png'}); console.log('bulk receive',JSON.stringify(R.bulk).slice(0,700)); }
fs.writeFileSync(out+'/result.json',JSON.stringify(R,null,1)); await s.close();
