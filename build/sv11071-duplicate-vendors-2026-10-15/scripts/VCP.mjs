// usage: node VC.mjs '<json {tag,name,a1,a2,city,zip,clicks,answer:"cancel"|"continue"|null}>'  (create a vendor on screen)
import {op,J,post} from './lib.mjs'; import fs from 'fs';
const P=JSON.parse(process.argv[2]); const s=await op(); const p=s.page; await post(s,'/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
const W=[]; p.on('request',r=>{ if(r.method()!=='GET'&&/\/api\/.*vendor/i.test(r.url())) W.push(r.method()+' '+r.url().replace(/.*\/api/,'/api')+' :: '+(r.postData()||'').slice(0,300)); });
p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\/.*vendor/i.test(r.url())) W.push('  <- '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,300)); });
const toasts=new Set(); const grab=async()=>{ for(const t of await p.locator('.q-notification').allInnerTexts().catch(()=>[])) toasts.add(t.replace(/\s+/g,' ').trim()); };
await s.go('/parts/vendors'); await p.waitForTimeout(3500);
await p.locator('[data-test-id="button_new_vendor"]').click(); await p.waitForTimeout(1800);
const D=p.locator('.q-dialog').last();
for(const [k,tid] of [['name','input_vendor_name'],['a1','input_vendor_address_1'],['a2','input_vendor_address_2'],['city','input_vendor_city'],['zip','input_vendor_postal_code']]) if(P[k]!=null) await D.locator(`[data-test-id="${tid}"]`).fill(P[k]);
const pick=async(tid,text)=>{ await D.locator(`[data-test-id="${tid}"]`).click(); await p.waitForTimeout(900); if(text){ await p.keyboard.type(text,{delay:30}); await p.waitForTimeout(900);} const it=p.locator('.q-menu .q-item'); const opts=await it.allInnerTexts(); const i=text?Math.max(0,opts.findIndex(o=>o.includes(text))):0; const chosen=opts[i]; await it.nth(i).click(); await p.waitForTimeout(500); await p.keyboard.press('Escape').catch(()=>{}); await p.waitForTimeout(300); return chosen; };
const taxPicked=await pick('select_vendor_tax',P.tax||null); if(P.state) await pick('select_vendor_state',P.state); if(P.country) await pick('select_vendor_country',P.country);
await p.screenshot({path:`ev/${P.tag}-1-filled.png`});
const n=P.clicks||1; const btn=D.locator('[data-test-id="vendor_save_button"]'); const bb=await btn.boundingBox();
for(let i=0;i<n;i++){ await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(n>1?60:0); }
for(let i=0;i<10;i++){ await p.waitForTimeout(300); await grab(); }
const dialogs=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,220)));
const btns=await p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); return d?[...d.querySelectorAll('button')].map(b=>(b.getAttribute('data-test-id')||'-')+'|'+b.innerText.trim()):[];});
await p.screenshot({path:`ev/${P.tag}-2-after-save.png`});
let answered=null;
if(P.answer && dialogs.some(t=>/already exists/i.test(t))){ const want=P.answer==='continue'?/create|continue|yes|anyway|save/i:/cancel|no|back/i;
  const b=p.locator('.q-dialog').last().locator('button').filter({hasText:want}).last(); answered=await b.innerText().catch(()=>null); await b.click(); for(let i=0;i<10;i++){ await p.waitForTimeout(300); await grab(); }
  await p.screenshot({path:`ev/${P.tag}-3-after-answer.png`}); }
const dialogs2=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,160)));
const creates=W.filter(w=>/^POST/.test(w)).length;
const out={taxPicked,P,writes:W,creates,toasts:[...toasts],dialogsAfterSave:dialogs,buttons:btns,answered,dialogsEnd:dialogs2};
fs.writeFileSync(`vc-${P.tag}.json`,JSON.stringify(out,null,1));
console.log(P.tag,'| POSTs',creates,'| toasts',J([...toasts],300),'\n  after save',J(dialogs,400),'\n  buttons',J(btns,300),'\n  answered',answered,'| end dialogs',J(dialogs2,200),'\n  writes',J(W,600));
await s.close();
