// answer fields with the Pass pill (expand each collapsed field, click pill_checkbox_pass), section by section.
// SECS = how many sections to answer (default all). Then Save & Exit (SAVE!=='0'). Logs every POST with #responses.
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const TAG=process.env.TAG||'pass'; const s=await sess(); const p=s.page; const caps=[];
p.on('response',async r=>{ const q=r.request(); if(q.method()!=='GET'&&/\/api\//.test(r.url())&&!/recent-entities|6364962/.test(r.url())){ let b='';try{b=(await r.text()).slice(0,300)}catch{} let n=''; try{n=JSON.parse(q.postData()||'{}').responses?.length}catch{} caps.push(new Date().toISOString().slice(11,19)+' '+r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' n='+n+' -> '+b);} });
await s.go('/inspections/'+process.env.INS); await p.waitForTimeout(8000);
const secs=p.locator('[data-test-id^="sidebar_section_"]'); const ns=await secs.count(); const lim=Number(process.env.SECS||ns); let n=0;
const START=+(process.env.START||1)-1; const PILLS=(process.env.PILLS||'pass').split(','); let k2=0;
for(let i=START;i<Math.min(ns,lim);i++){ await secs.nth(i).click(); await p.waitForTimeout(1500);
  const fids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="field_card_"]')].map(e=>e.getAttribute('data-test-id').replace('field_card_','')));
  for(const id of fids){ const c=p.locator(`[data-test-id="field_collapsed_${id}"]`); if(await c.count()){ await c.click({timeout:4000}).catch(()=>{}); await p.waitForTimeout(200); }
    const pass=p.locator(`[data-test-id="field_card_${id}"] [data-test-id="pill_checkbox_${PILLS[k2++%PILLS.length]}"]`); if(await pass.count()){ await pass.click({timeout:4000}).catch(()=>{}); n++; await p.waitForTimeout(200); } }
  console.log('section',i+1,'passes so far',n,'sidebar',(await secs.nth(i).innerText()).replace(/\s+/g,' ')); }
console.log('status',(await p.locator('[data-test-id="filler_save_status"]').innerText().catch(()=>'')).replace(/\s+/g,' '),'meta',(await p.locator('[data-test-id="sidebar_meta"]').innerText().catch(()=>'')).replace(/\s+/g,' '));
console.log('POSTS before save',JSON.stringify(caps)); caps.length=0; await p.screenshot({path:`../ev/${ENV}-${TAG}-filled.png`});
if(process.env.SAVE!=='0'){ await p.click('[data-test-id="button_save_and_exit"]'); await p.waitForTimeout(900); await p.screenshot({path:`../ev/${ENV}-${TAG}-saveclick.png`}); console.log('quick toasts',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' '))))); await p.waitForTimeout(6000);
  console.log('toasts',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' '))))); console.log('url after',p.url()); await p.screenshot({path:`../ev/${ENV}-${TAG}-saved.png`});
  console.log('POSTS at save',JSON.stringify(caps));
  await s.go('/inspections/'+process.env.INS); await p.waitForTimeout(8000); await p.screenshot({path:`../ev/${ENV}-${TAG}-reopen.png`});
  console.log('reopen sidebar',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="sidebar_section_"]')].map(e=>e.innerText.replace(/\s+/g,' ')))),'meta',(await p.locator('[data-test-id="sidebar_meta"]').innerText().catch(()=>'')).replace(/\s+/g,' ')); }
await s.close(); process.exit(0);
