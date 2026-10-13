// view-only custom role: must still NOT be able to change a part on a completed part sale
import {ob,J,post} from './lib.mjs'; import fs from 'fs'; import {rolePerms,assignRole} from './roles.mjs';
const tech=JSON.parse(fs.readFileSync('tech-before.json')); const cr=JSON.parse(fs.readFileSync('custom-role.json'));
const out={};
let a=await ob({dpr:1}); out.perms=await rolePerms(a,cr.id); out.assign=await assignRole(a,tech,cr.id); await a.close();
const s=await ob({dpr:2,quick:'tech'}); const p=s.page; const net=[];
p.on('response',async r=>{ if(/parts\/change/.test(r.url())){ let b=''; try{b=(await r.text()).slice(0,200);}catch(e){} net.push({st:r.status(),res:b}); } });
await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'}); await p.evaluate(()=>localStorage.setItem('location',JSON.stringify('b3c8c820-f815-4cf1-8938-10956c5ee71a')));
out.fe=(await s.api('/api/auth/me/fe-permissions')).json.data.fe_permissions;
await s.go('/parts/part-sale/6c6bb614-e7b0-4f48-aa76-053f7b29d33b/part-requests'); await p.waitForTimeout(4500);
out.url=p.url(); out.num=await p.evaluate(()=>document.querySelector('[data-test-id="text_wo_number"]')?.innerText); out.status=await p.evaluate(()=>document.querySelector('[data-test-id="badge_wo_status"]')?.innerText);
out.inputs=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_sell_price_"]')].map(e=>({id:e.getAttribute('data-test-id'),v:e.value,dis:!!(e.disabled||e.readOnly)})));
out.addPart=await p.evaluate(()=>{const e=document.querySelector('[data-test-id="button_add_part"]'); return e? !!(e.disabled||e.classList.contains('disabled')):'absent';});
await p.screenshot({path:'ev/custom-role-ps.png'});
const first=out.inputs.find(x=>!x.dis); if(first){ const inp=p.locator(`[data-test-id="${first.id}"]`); await inp.click(); await inp.press('Control+a'); await inp.pressSequentially('99.00',{delay:80}); await inp.press('Enter'); await p.waitForTimeout(3500); out.toast=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')).join(' ## ')); await p.screenshot({path:'ev/custom-role-ps-try.png'}); await p.reload(); await p.waitForTimeout(4000); out.after=await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.value,first.id); }
out.net=net; fs.writeFileSync('runs/custom.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out,null,1).slice(0,2500));
await s.close();
