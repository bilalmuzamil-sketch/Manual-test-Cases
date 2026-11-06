// open inspection INS on work order WO, DISC=1 dumps controls; otherwise click Pass on every field in every section, then Save & Exit
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const s=await sess(); const p=s.page; const caps=[]; const TAG=process.env.TAG||'fill';
p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\/(?!6364962)/.test(r.url())){ let b='';try{b=(await r.text()).slice(0,300)}catch{} caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' :: '+(r.request().postData()||'').length+'B -> '+b);} });
await s.go('/workorders/'+process.env.WO+'/lines'); await p.waitForTimeout(7000); await p.click(`[data-test-id="inspection_open_${process.env.INS}"]`); await p.waitForTimeout(6000);
const ids=async()=>p.evaluate(()=>{const m={}; for(const e of document.querySelectorAll('[data-test-id]')){const k=e.getAttribute('data-test-id').replace(/[0-9a-f-]{36}/g,'<id>'); m[k]=(m[k]||0)+1;} return m;});
console.log('url',p.url()); console.log('ids',JSON.stringify(await ids()).slice(0,2500)); await p.screenshot({path:`../ev/${ENV}-${TAG}-open.png`});
if(!process.env.DISC){ const secs=p.locator('[data-test-id^="sidebar_section_"]'); const ns=await secs.count(); let n=0;
  for(let i=0;i<ns;i++){ await secs.nth(i).click(); await p.waitForTimeout(1200); const b=p.locator('[data-test-id^="mark_ok_action_field_"]'); const c=await b.count(); for(let j=0;j<c;j++){ if(await b.nth(j).isEnabled().catch(()=>false)){ await b.nth(j).click({timeout:5000}).catch(()=>{}); n++; } } }
  console.log('field OK clicks',n,'status',(await p.locator('[data-test-id="filler_save_status"]').innerText().catch(()=>'')).replace(/\s+/g,' '),'meta',(await p.locator('[data-test-id="sidebar_meta"]').innerText().catch(()=>'')).replace(/\s+/g,' '));
  await p.screenshot({path:`../ev/${ENV}-${TAG}-filled.png`}); await p.click('[data-test-id="button_save_and_exit"]'); await p.waitForTimeout(6000);
  console.log('toasts',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' '))))); console.log('url after',p.url()); await p.screenshot({path:`../ev/${ENV}-${TAG}-saved.png`});
  console.log('ALLCAPS',JSON.stringify(caps.filter(c=>!/recent-entities/.test(c)).map(c=>c.slice(0,260)))); }
console.log('caps',JSON.stringify(caps.slice(-6),null,1).slice(0,2500)); await s.close(); process.exit(0);
