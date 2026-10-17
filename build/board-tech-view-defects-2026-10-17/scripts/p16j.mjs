import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const d=JSON.parse(fs.readFileSync('/tmp/qa11310/ev10/prod-deleted-lead-staff.json'));
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900},dpr:2}); const p=s.page;
await s.go(`/workorders/${d.wo.id}/lines`); await p.waitForTimeout(5000);
await p.click('[data-test-id=select_lead_technician]'); await p.waitForTimeout(1500);
const o=await p.evaluate(t=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(e=>e.innerText.includes(t)); if(!e) return [...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()); e.scrollIntoView({block:'center'}); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},d.staff.last_name);
console.log('opt',JSON.stringify(o).slice(0,300)); if(!o.x){await s.close(); process.exit(0);}
await p.waitForTimeout(400); await p.screenshot({path:'/tmp/qa11310/ev10/p16-picker.png'}); await p.mouse.click(o.x,o.y); await p.waitForTimeout(2500);
console.log('dialogs',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().height>0).map(x=>x.innerText.replace(/\s+/g,' ').slice(0,200)))));
await p.keyboard.press('Escape'); await p.waitForTimeout(800); await p.screenshot({path:'/tmp/qa11310/ev10/p16-lead-set.png'});
const r=await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=3&search='+d.wo.number); const x=r.json.data.work_orders[0]; console.log('lead now',x.techAssignedId,x.techAssignedFirstName,x.techAssignedLastName);
await s.close();
