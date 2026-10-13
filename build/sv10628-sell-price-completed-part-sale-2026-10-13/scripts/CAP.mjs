import {ob,J,post} from './lib.mjs'; import fs from 'fs'; import {resetRole,assignRole} from './roles.mjs';
const roles=JSON.parse(fs.readFileSync('roles.json')); const tech=JSON.parse(fs.readFileSync('tech-before.json')); const cr=JSON.parse(fs.readFileSync('custom-role.json'));
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a', LB='f8a8b802-7780-4b16-bf10-343caeb616b2'; const out={};
const geo=(p,t)=>p.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); if(!e) return null; const r=e.getBoundingClientRect(); return [r.x,r.y,r.width,r.height];},t);
const val=(p,t)=>p.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return e?(e.value??e.innerText):null;},t);
const setLoc=async(s,l)=>{ await post(s,'/api/iam/change-location',{workplace_id:l,workplace_timezone:'America/Edmonton'}); await s.page.evaluate(l=>localStorage.setItem('location',JSON.stringify(l)),l); };
const asRole=async(id,reset)=>{ const a=await ob({dpr:1}); if(reset) await resetRole(a,id); await assignRole(a,tech,id); await a.close(); };
// (a)(b)(c) Parts Manager
await asRole(roles.find(r=>r.name==='Parts Manager').id,true);
let s=await ob({dpr:2,quick:'tech'}); let p=s.page;
await setLoc(s,LB); await s.go('/workorders/288cddba-f3ca-491d-8927-e86412a2ca24/part-requests'); await p.waitForTimeout(4000);
const PID='3ccf9522-4bd2-4ace-9504-a8a3dd3f8284', T='input_sell_price_'+PID; out.wo0=await val(p,T);
await p.locator(`[data-test-id="${T}"]`).click(); await p.locator(`[data-test-id="${T}"]`).press('Control+a'); out.woTyped=(parseFloat(out.wo0)+1).toFixed(2); await p.locator(`[data-test-id="${T}"]`).pressSequentially(out.woTyped,{delay:60}); await p.locator(`[data-test-id="${T}"]`).press('Enter'); await p.waitForTimeout(3500);
out.woToast=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')).join(' / '));
await p.reload(); await p.waitForTimeout(4500); out.wo1=await val(p,T); out.woStatus=await val(p,'badge_wo_status'); out.woNum=await val(p,'text_wo_number');
out.woGeo={price:await geo(p,T),status:await geo(p,'badge_wo_status'),num:await geo(p,'text_wo_number'),pn:await geo(p,'input_part_number_'+PID)};
await p.screenshot({path:'ev/after-wo-grid.png'});
await s.go('/workorders/288cddba-f3ca-491d-8927-e86412a2ca24/lines'); await p.waitForTimeout(4000);
await p.locator(`[data-test-id="part_number_${PID}"]`).click({position:{x:40,y:20}}); await p.waitForSelector('[data-test-id="input_workorder_part_sell_price"]'); await p.waitForTimeout(1200);
out.dlg={price:await val(p,'input_workorder_part_sell_price'),geo:{price:await geo(p,'input_workorder_part_sell_price'),save:await geo(p,'button_workorder_part_save'),title:await geo(p,'dialog_title'),status:await geo(p,'badge_wo_status')}};
await p.screenshot({path:'ev/after-wo-dialog.png'}); await p.keyboard.press('Escape');
const paid=JSON.parse(fs.readFileSync('paid.json')); await setLoc(s,paid.number.startsWith('P3')?LB:HD); await s.go('/parts/part-sale/'+paid.id+'/part-requests'); await p.waitForTimeout(4000);
const pid=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_sell_price_"]')].map(e=>e.getAttribute('data-test-id'))[0]);
out.paid={num:await val(p,'text_wo_number'),status:await val(p,'badge_wo_status'),price:await val(p,pid),dis:await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`).disabled,pid),geo:{price:await geo(p,pid),status:await geo(p,'badge_wo_status'),num:await geo(p,'text_wo_number')}};
await p.screenshot({path:'ev/after-paid.png'}); await s.close();
// (d) view-only custom role
await asRole(cr.id,false); s=await ob({dpr:2,quick:'tech'}); p=s.page; await setLoc(s,HD);
await s.go('/parts/part-sale/6c6bb614-e7b0-4f48-aa76-053f7b29d33b/part-requests'); await p.waitForTimeout(4500);
const cids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="input_sell_price_"]')].map(e=>e.getAttribute('data-test-id')));
out.cust={num:await val(p,'text_wo_number'),status:await val(p,'badge_wo_status'),n:cids.length,dis:await p.evaluate(ids=>ids.every(t=>document.querySelector(`[data-test-id="${t}"]`).disabled),cids),addPart:await p.evaluate(()=>!!document.querySelector('[data-test-id="button_add_part"]')),geo:{first:await geo(p,cids[0]),last:await geo(p,cids.at(-1)),status:await geo(p,'badge_wo_status'),num:await geo(p,'text_wo_number')}};
await p.screenshot({path:'ev/after-custom.png'}); await s.close();
// restore tech to Technician (Rule 105: reset first)
await asRole(roles.find(r=>r.name==='Technician').id,true);
const a=await ob({dpr:1}); const st=(await a.api('/api/staff?limit=200&search=tech%40shopview.com')).json; const now=(st.collection||st.data?.collection||st.data).find(x=>x.email==='tech@shopview.com'); out.techRestored=now.role_label; await a.close();
fs.writeFileSync('cap.json',JSON.stringify(out,null,1)); console.log(J(out,2500));
