// Technician (reset+assigned): no Sell Price; can it now change a part's description on a COMPLETE service WO (previously blocked)?
import {ob,J,post} from './lib.mjs'; import fs from 'fs'; import {resetRole,assignRole} from './roles.mjs';
const roles=JSON.parse(fs.readFileSync('roles.json')); const tech=JSON.parse(fs.readFileSync('tech-before.json')); const role=roles.find(r=>r.name==='Technician');
const out={}; let a=await ob({dpr:1}); const rr=await resetRole(a,role.id); out.reset={n0:rr.before.length,n1:rr.after.length,added:rr.added,removed:rr.removed}; out.assign=await assignRole(a,tech,role.id); await a.close();
const s=await ob({dpr:2,quick:'tech'}); const p=s.page; const net=[];
p.on('response',async r=>{ if(/parts\/change/.test(r.url())){ let b=''; try{b=(await r.text()).slice(0,200);}catch(e){} net.push({st:r.status(),req:(r.request().postData()||'').slice(0,300),res:b}); } });
await post(s,'/api/iam/change-location',{workplace_id:'f8a8b802-7780-4b16-bf10-343caeb616b2',workplace_timezone:'America/Edmonton'}); await p.evaluate(()=>localStorage.setItem('location',JSON.stringify('f8a8b802-7780-4b16-bf10-343caeb616b2')));
await s.go('/workorders/288cddba-f3ca-491d-8927-e86412a2ca24/part-requests'); await p.waitForTimeout(4500);
out.cols=await p.evaluate(()=>[...document.querySelectorAll('th')].map(t=>t.innerText.trim()).filter(Boolean));
out.inputs=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_"]')].filter(e=>e.closest('tr')).map(e=>({id:e.getAttribute('data-test-id'),v:e.value,dis:!!(e.disabled||e.readOnly)})).slice(0,20));
const d=out.inputs.find(x=>/input_description_/.test(x.id)&&!x.dis);
if(d){ const inp=p.locator(`[data-test-id="${d.id}"]`); await inp.click(); await inp.press('End'); await inp.pressSequentially(' ZZ',{delay:80}); await inp.press('Enter'); await p.waitForTimeout(3500); out.toast=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')).join(' ## ')); await p.screenshot({path:'ev/technician-desc.png'}); await p.reload(); await p.waitForTimeout(4000); out.after=await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.value,d.id); out.status=await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText); }
out.net=net; fs.writeFileSync('runs/tech-desc.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out,null,1).slice(0,2500));
await s.close();
