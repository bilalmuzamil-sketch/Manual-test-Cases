import {sess} from './common.mjs'; const s=await sess(); const p=s.page; const caps=[]; const TAG=process.env.TAG||'markall';
p.on('response',async r=>{ const q=r.request(); if(q.method()!=='GET'&&/\/api\/inspections/.test(r.url())){ let b='';try{b=(await r.text()).slice(0,200)}catch{} caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(q.postData()||'').length+'B -> '+b);} });
await s.go('/inspections/'+process.env.INS); await p.waitForTimeout(8000);
const side=async()=>JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="sidebar_section_"]')].map(e=>e.innerText.replace(/\s+/g,' '))));
console.log('start',await side(),(await p.locator('[data-test-id="sidebar_meta"]').innerText()).replace(/\s+/g,' ').slice(0,60));
await p.click('[data-test-id="mark_ok_action_inspection"]'); await p.waitForTimeout(2500); const dl=await p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?d.innerText.replace(/\s+/g,' ').slice(0,300):null}); console.log('dialog',dl);
if(dl){ const b=p.locator('.q-dialog button').filter({hasText:/mark|ok|confirm|yes/i}).last(); if(await b.count()){ await b.click(); await p.waitForTimeout(3000);} }
console.log('after mark',await side(),(await p.locator('[data-test-id="filler_save_status"]').innerText()).replace(/\s+/g,' ')); await p.screenshot({path:`../ev/branch-${TAG}-marked.png`});
await p.click('[data-test-id="button_save_and_exit"]'); await p.waitForTimeout(5000); console.log('url',p.url());
await s.go('/inspections/'+process.env.INS); await p.waitForTimeout(8000); console.log('reopen',await side()); await p.screenshot({path:`../ev/branch-${TAG}-reopen.png`}); console.log('caps',JSON.stringify(caps)); await s.close(); process.exit(0);
