// open inspection INS on work order WO, DISC=1 dumps controls; otherwise click Pass on every field in every section, then Save & Exit
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const s=await sess(); const p=s.page; const caps=[]; const TAG=process.env.TAG||'fill';
p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\/(?!6364962)/.test(r.url())){ let b='';try{b=(await r.text()).slice(0,300)}catch{} caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' :: '+(r.request().postData()||'').length+'B -> '+b);} });
await s.go('/workorders/'+process.env.WO+'/lines'); await p.waitForTimeout(7000); await p.click(`[data-test-id="inspection_open_${process.env.INS}"]`); await p.waitForTimeout(6000);
const ids=async()=>p.evaluate(()=>{const m={}; for(const e of document.querySelectorAll('[data-test-id]')){const k=e.getAttribute('data-test-id').replace(/[0-9a-f-]{36}/g,'<id>'); m[k]=(m[k]||0)+1;} return m;});
console.log('url',p.url()); console.log('ids',JSON.stringify(await ids()).slice(0,2500)); await p.screenshot({path:`../ev/${ENV}-${TAG}-open.png`});
if(!process.env.DISC){ const t=p.locator('[data-test-id="mark_ok_inspection"]'); console.log('mark-all text',(await t.innerText()).replace(/\s+/g,' ')); await t.click(); await p.waitForTimeout(1500);
  const a=p.locator('[data-test-id="mark_ok_action_inspection"]'); if(await a.isEnabled().catch(()=>false)){ console.log('action text',(await a.innerText()).replace(/\s+/g,' ')); await a.click(); await p.waitForTimeout(2500); }
  const dl=await p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?d.innerText.replace(/\n+/g,' | ').slice(0,300):null;}); console.log('dialog',dl); if(dl){ const c=p.locator('.q-dialog button').last(); console.log('confirm',await c.innerText()); await c.click(); await p.waitForTimeout(2500); }
  console.log('status',await p.locator('[data-test-id="filler_save_status"]').innerText().catch(()=>'')); console.log('meta',(await p.locator('[data-test-id="sidebar_meta"]').innerText().catch(()=>'')).replace(/\s+/g,' '));
  await p.screenshot({path:`../ev/${ENV}-${TAG}-filled.png`}); await p.click('[data-test-id="button_save_and_exit"]'); await p.waitForTimeout(6000);
  console.log('toasts',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' '))))); console.log('url after',p.url()); await p.screenshot({path:`../ev/${ENV}-${TAG}-saved.png`}); }
console.log('caps',JSON.stringify(caps.slice(-6),null,1).slice(0,2500)); await s.close(); process.exit(0);
